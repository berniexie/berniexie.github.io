import { readdir, readFile, mkdir, stat, writeFile } from 'node:fs/promises'
import { basename, extname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import exifr from 'exifr'
import { format, resolveConfig } from 'prettier'

const PROJECT_ROOT = fileURLToPath(new URL('..', import.meta.url))
const SOURCE_DIR = resolve(PROJECT_ROOT, 'src/photos')
const OUTPUT_DIR = resolve(PROJECT_ROOT, 'public/photos/portfolio')
const MANIFEST_PATH = resolve(SOURCE_DIR, 'photoManifest.ts')
const WIDTHS = [480, 960, 1600]
const THUMBNAIL_LIMIT = 250 * 1024
const LIGHTBOX_LIMIT = 2 * 1024 * 1024
const isSourcePhoto = (filename) => /\.(?:jpe?g|png)$/i.test(filename)
const idFor = (filename) => basename(filename, extname(filename)).toLowerCase()

async function validateManifest(sourceFilenames) {
  const manifestSource = await readFile(MANIFEST_PATH, 'utf8')
  const manifestFilenames = new Set(
    [...manifestSource.matchAll(/photo\(\s*'([^']+\.(?:jpe?g|png))'/gi)].map((match) => match[1]),
  )

  const missingFromManifest = sourceFilenames.filter((filename) => !manifestFilenames.has(filename))
  const missingFromDisk = [...manifestFilenames].filter(
    (filename) => !sourceFilenames.includes(filename),
  )

  if (missingFromManifest.length || missingFromDisk.length) {
    throw new Error(
      [
        missingFromManifest.length
          ? `Missing from photoManifest.ts: ${missingFromManifest.join(', ')}`
          : '',
        missingFromDisk.length ? `Missing source originals: ${missingFromDisk.join(', ')}` : '',
      ]
        .filter(Boolean)
        .join('\n'),
    )
  }
}

async function outputSize(path) {
  return (await stat(path)).size
}

async function generateVariant(inputPath, id, width) {
  const preserveExif = width === 1600
  let base = sharp(inputPath, { limitInputPixels: false })
    .rotate()
    .resize({ width, withoutEnlargement: true })

  if (preserveExif) {
    base = base.keepExif()
  }

  const avifPath = resolve(OUTPUT_DIR, `${id}-${width}.avif`)
  const webpPath = resolve(OUTPUT_DIR, `${id}-${width}.webp`)

  await Promise.all([
    base.clone().avif({ quality: 62, effort: 5, chromaSubsampling: '4:2:0' }).toFile(avifPath),
    base.clone().webp({ quality: 78, effort: 5, smartSubsample: true }).toFile(webpPath),
  ])

  const [avifBytes, webpBytes] = await Promise.all([outputSize(avifPath), outputSize(webpPath)])
  const limit = width === 1600 ? LIGHTBOX_LIMIT : THUMBNAIL_LIMIT

  for (const [format, bytes] of [
    ['AVIF', avifBytes],
    ['WebP', webpBytes],
  ]) {
    if (bytes > limit) {
      throw new Error(
        `${id}-${width}.${format.toLowerCase()} is ${(bytes / 1024).toFixed(0)}KB; ` +
          `the budget is ${(limit / 1024).toFixed(0)}KB`,
      )
    }
  }

  return { avifPath, webpPath, avifBytes, webpBytes }
}

async function generatePhoto(filename) {
  const id = idFor(filename)
  const inputPath = resolve(SOURCE_DIR, filename)
  const variants = []

  for (const width of WIDTHS) {
    variants.push(await generateVariant(inputPath, id, width))
  }

  return variants
}

async function extractMetadata(filename) {
  const raw = await exifr.parse(resolve(SOURCE_DIR, filename), [
    'Make',
    'Model',
    'LensModel',
    'ISO',
    'FNumber',
    'ExposureTime',
    'DateTimeOriginal',
  ])

  if (!raw) return undefined

  return {
    ...(raw.Make ? { cameraMake: raw.Make } : {}),
    ...(raw.Model ? { cameraModel: raw.Model } : {}),
    ...(raw.LensModel ? { lensModel: raw.LensModel } : {}),
    ...(raw.ISO ? { iso: raw.ISO } : {}),
    ...(raw.FNumber ? { aperture: raw.FNumber } : {}),
    ...(raw.ExposureTime ? { exposureTime: raw.ExposureTime } : {}),
    ...(raw.DateTimeOriginal ? { capturedAt: new Date(raw.DateTimeOriginal).toISOString() } : {}),
  }
}

async function updateManifestMetadata(sourceFilenames) {
  const metadata = Object.fromEntries(
    await Promise.all(
      sourceFilenames.map(async (filename) => [filename, await extractMetadata(filename)]),
    ),
  )
  const manifestSource = await readFile(MANIFEST_PATH, 'utf8')
  const serialized = JSON.stringify(metadata, null, 2)
  const assignmentPattern =
    /const PHOTO_METADATA: Readonly<Record<string, PhotoMeta>> = [\s\S]*?\n\nfunction sourcesFor/

  if (!assignmentPattern.test(manifestSource)) {
    throw new Error(`Could not find metadata assignment in ${MANIFEST_PATH}`)
  }

  const updatedSource = manifestSource.replace(
    assignmentPattern,
    `const PHOTO_METADATA: Readonly<Record<string, PhotoMeta>> = ${serialized}\n\nfunction sourcesFor`,
  )
  const prettierConfig = (await resolveConfig(MANIFEST_PATH)) ?? {}
  const formattedSource = await format(updatedSource, {
    ...prettierConfig,
    parser: 'typescript',
  })

  await writeFile(MANIFEST_PATH, formattedSource)
}

async function main() {
  const sourceFilenames = (await readdir(SOURCE_DIR)).filter(isSourcePhoto).sort()

  if (sourceFilenames.length === 0) {
    throw new Error(`No source photographs found in ${SOURCE_DIR}`)
  }

  await validateManifest(sourceFilenames)
  await updateManifestMetadata(sourceFilenames)
  await mkdir(OUTPUT_DIR, { recursive: true })

  sharp.concurrency(Math.min(4, sharp.concurrency()))

  const generated = []
  for (const [index, filename] of sourceFilenames.entries()) {
    process.stdout.write(`[${index + 1}/${sourceFilenames.length}] ${filename}\n`)
    generated.push(...(await generatePhoto(filename)))
  }

  const totalBytes = generated.reduce(
    (sum, variant) => sum + variant.avifBytes + variant.webpBytes,
    0,
  )
  const largestThumbnail = Math.max(
    ...generated
      .filter((variant) => !variant.avifPath.endsWith('-1600.avif'))
      .flatMap((variant) => [variant.avifBytes, variant.webpBytes]),
  )
  const largestLightbox = Math.max(
    ...generated
      .filter((variant) => variant.avifPath.endsWith('-1600.avif'))
      .flatMap((variant) => [variant.avifBytes, variant.webpBytes]),
  )

  process.stdout.write(
    [
      `Generated ${generated.length * 2} assets for ${sourceFilenames.length} photographs.`,
      `Total: ${(totalBytes / 1024 / 1024).toFixed(1)}MB.`,
      `Largest thumbnail: ${(largestThumbnail / 1024).toFixed(0)}KB.`,
      `Largest lightbox image: ${(largestLightbox / 1024).toFixed(0)}KB.`,
    ].join(' ') + '\n',
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})

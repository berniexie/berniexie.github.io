import { PHOTO_MANIFEST } from '../photos/photoManifest'
import type { PortfolioPhoto } from '../photos/photoManifest'

export type { PhotoMeta, PortfolioPhoto } from '../photos/photoManifest'

export interface Album {
  id: string
  title: string
  intro?: string
  photos: readonly PortfolioPhoto[]
  coverPhoto?: PortfolioPhoto
}

const FEATURED_PHOTO_COUNT = 6

function shufflePhotos(photos: readonly PortfolioPhoto[]) {
  const shuffled = [...photos]

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomValue = crypto.getRandomValues(new Uint32Array(1))[0]
    const randomIndex = randomValue % (index + 1)
    ;[shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]]
  }

  return shuffled
}

const featuredPhotos = shufflePhotos(PHOTO_MANIFEST).slice(0, FEATURED_PHOTO_COUNT)
const featuredPhotoIds = new Set(featuredPhotos.map((photo) => photo.id))
const randomizedPortfolioPhotos = [
  ...featuredPhotos,
  ...PHOTO_MANIFEST.filter((photo) => !featuredPhotoIds.has(photo.id)),
]

const PORTFOLIO_ALBUM: Album = {
  id: 'portfolio',
  title: 'Portfolio',
  photos: randomizedPortfolioPhotos,
  coverPhoto: randomizedPortfolioPhotos[0],
}

const ALBUMS: readonly Album[] = [PORTFOLIO_ALBUM]

export function usePhotos() {
  return { albums: ALBUMS }
}

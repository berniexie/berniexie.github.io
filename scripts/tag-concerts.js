// Adds rich tags to each concert entry and writes back to public/concerts/*.json files.
// Safe to rerun any time the source data or tag dictionaries change.
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import artistTags from './data/artistTags.js'
import { venueTags, festivalGuesses, cityOverrides } from './data/venueData.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const concertsDir = path.join(__dirname, '..', 'public', 'concerts')

// Read all year files from the concerts directory
const yearFiles = fs.readdirSync(concertsDir).filter((f) => f.endsWith('.json'))
const concertsByYear = {}
yearFiles.forEach((file) => {
  const year = file.replace('.json', '')
  concertsByYear[year] = JSON.parse(fs.readFileSync(path.join(concertsDir, file), 'utf8'))
})

function tagsForVenue(venue) {
  const tags = new Set()
  const direct = venueTags[venue]
  if (direct) direct.forEach((t) => tags.add(t))

  const vLower = venue.toLowerCase()
  festivalGuesses.forEach(({ match, tags: ftags }) => {
    if (vLower.includes(match)) ftags.forEach((t) => tags.add(t))
  })

  const cityTag = cityOverrides[venue]
  if (cityTag) tags.add(cityTag)

  // If we have no location, leave it empty; artist tags will still carry value.
  return [...tags]
}

function tagsForArtist(artist) {
  return artistTags[artist] || ['unknown']
}

function enrichConcert(entry) {
  const tags = new Set()
  tagsForArtist(entry.artist).forEach((t) => tags.add(t))
  tagsForVenue(entry.venue).forEach((t) => tags.add(t))

  const status = entry.rating === null ? 'cancelled' : undefined

  return {
    ...entry,
    ...(status ? { status } : {}),
    tags: [...tags],
  }
}

// Process and write each year file
let totalCount = 0
Object.entries(concertsByYear).forEach(([year, concerts]) => {
  const enriched = concerts.map(enrichConcert)
  const filePath = path.join(concertsDir, `${year}.json`)
  fs.writeFileSync(filePath, JSON.stringify(enriched, null, 2))
  console.log(`${year}: ${enriched.length} concerts tagged`)
  totalCount += enriched.length
})
console.log(`Total concerts tagged: ${totalCount}`)

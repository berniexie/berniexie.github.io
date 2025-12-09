#!/usr/bin/env node

/**
 * Script to fetch coordinates for cities in travel.json using OpenStreetMap Nominatim API
 *
 * Usage: node scripts/update-coordinates.js
 *
 * Options:
 *   --all    Refresh all coordinates (even if they exist)
 *   --dry    Dry run - don't write to file, just show what would change
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const TRAVEL_JSON_PATH = path.join(__dirname, '../public/travel.json')
const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search'

// Rate limit: Nominatim requires max 1 request per second
const RATE_LIMIT_MS = 1100

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchCoordinates(city, country) {
  const query = `${city}, ${country}`
  const url = `${NOMINATIM_URL}?q=${encodeURIComponent(query)}&format=json&limit=1`

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'TravelGlobe-Coordinate-Fetcher/1.0',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const data = await response.json()

    if (data && data.length > 0) {
      const { lat, lon } = data[0]
      return [parseFloat(lat), parseFloat(lon)]
    }

    return null
  } catch (error) {
    console.error(`  Error fetching ${query}:`, error.message)
    return null
  }
}

async function main() {
  const args = process.argv.slice(2)
  const refreshAll = args.includes('--all')
  const dryRun = args.includes('--dry')

  console.log('📍 Travel Coordinates Updater\n')

  if (dryRun) {
    console.log('🔍 DRY RUN MODE - No changes will be saved\n')
  }

  // Read travel.json
  const travelData = JSON.parse(fs.readFileSync(TRAVEL_JSON_PATH, 'utf-8'))
  const trips = travelData.trips

  console.log(`Found ${trips.length} cities in travel.json\n`)

  let updated = 0
  let skipped = 0
  let failed = 0

  for (const trip of trips) {
    const hasCoordinates =
      trip.coordinates &&
      Array.isArray(trip.coordinates) &&
      trip.coordinates.length === 2 &&
      trip.coordinates[0] !== 0 &&
      trip.coordinates[1] !== 0

    if (hasCoordinates && !refreshAll) {
      console.log(`⏭️  ${trip.city} - already has coordinates, skipping`)
      skipped++
      continue
    }

    console.log(`🔍 Fetching coordinates for ${trip.city}, ${trip.country}...`)

    const coords = await fetchCoordinates(trip.city, trip.country)

    if (coords) {
      const oldCoords = trip.coordinates
      trip.coordinates = coords
      console.log(`   ✅ [${coords[0].toFixed(4)}, ${coords[1].toFixed(4)}]`)

      if (oldCoords) {
        const latDiff = Math.abs(oldCoords[0] - coords[0])
        const lonDiff = Math.abs(oldCoords[1] - coords[1])
        if (latDiff > 0.01 || lonDiff > 0.01) {
          console.log(`   📝 Changed from [${oldCoords[0]}, ${oldCoords[1]}]`)
        }
      }

      updated++
    } else {
      console.log(`   ❌ Could not find coordinates`)
      failed++
    }

    // Rate limiting
    await sleep(RATE_LIMIT_MS)
  }

  console.log('\n' + '='.repeat(50))
  console.log(`📊 Summary:`)
  console.log(`   Updated: ${updated}`)
  console.log(`   Skipped: ${skipped}`)
  console.log(`   Failed:  ${failed}`)

  if (!dryRun && updated > 0) {
    // Write back to file with nice formatting
    const output = JSON.stringify(travelData, null, 2)
    fs.writeFileSync(TRAVEL_JSON_PATH, output)
    console.log(`\n💾 Saved to ${TRAVEL_JSON_PATH}`)
  } else if (dryRun) {
    console.log(`\n🔍 Dry run complete - no changes saved`)
  } else {
    console.log(`\n✨ No updates needed`)
  }
}

main().catch(console.error)



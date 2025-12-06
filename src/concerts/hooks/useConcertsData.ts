import { useEffect, useState, useMemo } from 'react'
import type { Concert, ConcertStats, ConcertWithTimestamp, ArtistStats } from '../types'
import { getPrimaryGenre } from '../utils'

export function useConcertsData() {
  const [concerts, setConcerts] = useState<Concert[]>([])

  useEffect(() => {
    fetch('/concerts.json')
      .then((res) => res.json())
      .then((data: Concert[]) => setConcerts(data))
      .catch((err) => console.error('Failed to load concerts:', err))
  }, [])

  // Base filtered concerts - most other computations depend on this
  const validConcerts = useMemo(
    () => concerts.filter((c) => c.rating !== null && c.status !== 'cancelled'),
    [concerts]
  )

  // Genre computations
  const { concertsByGenre, topGenresList, genrePieData } = useMemo(() => {
    const genreCounts: Record<string, number> = {}
    const concertsByGenre: Record<string, Concert[]> = {}

    validConcerts.forEach((c) => {
      const primaryGenre = getPrimaryGenre(c.tags)
      genreCounts[primaryGenre] = (genreCounts[primaryGenre] || 0) + 1
      if (!concertsByGenre[primaryGenre]) concertsByGenre[primaryGenre] = []
      concertsByGenre[primaryGenre].push(c)
    })

    // Get top 25 genres by count (exclude "other")
    const topGenresList = Object.entries(genreCounts)
      .filter(([g]) => g !== 'other')
      .sort((a, b) => b[1] - a[1])
      .slice(0, 25)
      .map(([g]) => g)

    // Pie chart data
    const genrePieData = topGenresList.map((genre) => ({
      name: genre,
      value: genreCounts[genre],
    }))

    const topGenreTotal = genrePieData.reduce((sum, item) => sum + item.value, 0)
    const otherCount = validConcerts.length - topGenreTotal
    if (otherCount > 0) {
      genrePieData.push({ name: 'other', value: otherCount })
    }

    return { genreCounts, concertsByGenre, topGenresList, genrePieData }
  }, [validConcerts])

  // Timeline/Years data
  const { yearsData, byYear } = useMemo(() => {
    const byYear: Record<number, Concert[]> = {}
    const yearsSet = new Set<number>()

    concerts.forEach((c) => {
      if (c.status === 'cancelled') return
      const year = new Date(c.date).getFullYear()
      if (!byYear[year]) byYear[year] = []
      byYear[year].push(c)
      yearsSet.add(year)
    })

    const yearsData = Array.from(yearsSet)
      .sort((a, b) => a - b)
      .map((year) => {
        const yearConcerts = byYear[year] || []
        const yearConcertsValid = yearConcerts.filter(
          (c) => c.rating !== null && c.status !== 'cancelled'
        )

        // Count primary genres for this year
        const yearGenreCounts: Record<string, number> = {}
        topGenresList.forEach((g) => (yearGenreCounts[g] = 0))

        yearConcertsValid.forEach((c) => {
          const pg = getPrimaryGenre(c.tags)
          if (topGenresList.includes(pg)) {
            yearGenreCounts[pg]++
          }
        })

        return {
          year,
          total: yearConcerts.length,
          ...yearGenreCounts,
        }
      })

    return { yearsData, byYear }
  }, [concerts, topGenresList])

  // Venue/Festival data
  const { venueTreemapData, topVenues } = useMemo(() => {
    const festivalCounts: Record<string, number> = {}
    const venueCounts: Record<string, number> = {}

    validConcerts.forEach((c) => {
      const festivalTag = c.tags.find((t) => t.startsWith('festival:'))
      if (festivalTag) {
        const festivalName = festivalTag
          .replace('festival:', '')
          .replace(/-/g, ' ')
          .split(' ')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
        festivalCounts[festivalName] = (festivalCounts[festivalName] || 0) + 1
      } else {
        venueCounts[c.venue] = (venueCounts[c.venue] || 0) + 1
      }
    })

    const topFestivals = Object.entries(festivalCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)

    const topVenuesData = Object.entries(venueCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)

    const venueTreemapData = [
      {
        name: 'Festivals',
        children: topFestivals.map(([name, count]) => ({
          name,
          size: count,
          type: 'festival',
        })),
      },
      {
        name: 'Venues',
        children: topVenuesData.map(([name, count]) => ({
          name,
          size: count,
          type: 'venue',
        })),
      },
    ]

    const topVenues = Object.entries(venueCounts)
      .concat(Object.entries(festivalCounts))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5) as [string, number][]

    return { venueTreemapData, topVenues }
  }, [validConcerts])

  // Scatter plot and ratings data
  const { scatterData, topRated, avgRating, ratingBuckets } = useMemo(() => {
    const avgRating =
      validConcerts.length > 0
        ? validConcerts.reduce((sum, c) => sum + (c.rating || 0), 0) / validConcerts.length
        : 0

    const scatterData: ConcertWithTimestamp[] = validConcerts
      .map((c) => ({
        ...c,
        timestamp: new Date(c.date).getTime(),
      }))
      .sort((a, b) => a.timestamp - b.timestamp)

    const topRated = [...validConcerts]
      .filter((c) => c.rating === 10)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    const ratingBuckets = [
      { range: '1-4', count: 0 },
      { range: '5-6', count: 0 },
      { range: '7-8', count: 0 },
      { range: '9-10', count: 0 },
    ]
    validConcerts.forEach((c) => {
      const r = c.rating!
      if (r <= 4) ratingBuckets[0].count++
      else if (r <= 6) ratingBuckets[1].count++
      else if (r <= 8) ratingBuckets[2].count++
      else ratingBuckets[3].count++
    })

    return { scatterData, topRated, avgRating, ratingBuckets }
  }, [validConcerts])

  // Top artists data
  const topArtists = useMemo<ArtistStats[]>(() => {
    const artistConcerts: Record<string, Concert[]> = {}
    validConcerts.forEach((c) => {
      if (!artistConcerts[c.artist]) artistConcerts[c.artist] = []
      artistConcerts[c.artist].push(c)
    })

    return Object.entries(artistConcerts)
      .map(([name, concerts]) => {
        const ratings = concerts.filter((c) => c.rating !== null).map((c) => c.rating!)
        const avgRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0
        const sortedByDate = [...concerts].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
        return {
          name,
          count: concerts.length,
          avgRating,
          lastSeen: sortedByDate[0].date,
          concerts,
        }
      })
      .filter((a) => a.count > 1)
      .sort((a, b) => b.count - a.count || b.avgRating - a.avgRating)
      .slice(0, 15)
  }, [validConcerts])

  // Combine all stats into final object
  const stats = useMemo<ConcertStats | null>(() => {
    if (concerts.length === 0) return null

    return {
      total: concerts.length,
      avgRating,
      yearsData,
      ratingBuckets,
      genrePieData,
      venueTreemapData,
      scatterData,
      topVenues,
      topRated,
      byYear,
      topGenresList,
      concertsByGenre,
      validConcerts,
      topArtists,
    }
  }, [
    concerts.length,
    avgRating,
    yearsData,
    ratingBuckets,
    genrePieData,
    venueTreemapData,
    scatterData,
    topVenues,
    topRated,
    byYear,
    topGenresList,
    concertsByGenre,
    validConcerts,
    topArtists,
  ])

  return { concerts, stats }
}

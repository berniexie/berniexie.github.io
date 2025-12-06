import { useEffect, useState, useMemo } from 'react'
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  Treemap,
  ScatterChart,
  Scatter,
  ZAxis,
} from 'recharts'
import { Music, Star, Calendar, MapPin } from 'lucide-react'

interface Concert {
  artist: string
  date: string
  venue: string
  rating: number | null
  tags: string[]
  status?: string
}

// Genre Colors for consistent styling across charts
const GENRE_COLORS: Record<string, string> = {
  'k-pop': '#FF6B9D', // Pink
  'k-hip-hop': '#FF9F6B', // Coral
  'k-rnb': '#FFB6C1', // Light Pink
  'k-rock': '#DC143C', // Crimson
  house: '#00BFFF', // Deep Sky Blue
  techno: '#4B0082', // Indigo
  trap: '#FF4500', // Orange Red
  dubstep: '#9400D3', // Dark Violet
  'future-bass': '#00CED1', // Dark Turquoise
  'electro-pop': '#DA70D6', // Orchid
  downtempo: '#5F9EA0', // Cadet Blue
  'progressive-house': '#1E90FF', // Dodger Blue
  midtempo: '#8B008B', // Dark Magenta
  'hip-hop': '#FFA500', // Orange
  rnb: '#DDA0DD', // Plum
  'alt-rnb': '#E6B8D9', // Lighter Plum
  rock: '#B22222', // Fire Brick
  'alt-rock': '#CD5C5C', // Indian Red
  'indie-pop': '#98FB98', // Pale Green
  'indie-rock': '#32CD32', // Lime Green
  pop: '#FF69B4', // Hot Pink
  'alt-pop': '#FF85C1', // Lighter Hot Pink
  country: '#DAA520', // Goldenrod
  latin: '#FF6347', // Tomato
  afrobeats: '#9ACD32', // Yellow Green
  'j-pop': '#FF1493', // Deep Pink
  'c-pop': '#DB7093', // Pale Violet Red
  bass: '#7B68EE', // Medium Slate Blue
  'melodic-bass': '#6A5ACD', // Slate Blue
  electronic: '#00FFFF', // Cyan
  other: '#808080', // Gray
}

// Meta tags to ignore for genre classification
const META_TAGS = new Set([
  'solo',
  'group',
  'band',
  'duo',
  'dj',
  'dj-duo',
  'dj-group',
  'collab',
  'producer',
  'english',
  'korean',
  'japanese',
  'french',
  'spanish',
  'mandarin',
  'bilingual',
  'instrumental',
  'us',
  'uk',
  'south-korea',
  'japan',
  'china',
  'france',
  'canada',
  'australia',
  'sweden',
  'germany',
  'belgium',
  'norway',
  'haiti',
  'indonesia',
  'nigeria',
  'colombia',
  'spain',
  'puerto-rico',
  'new-zealand',
  'hong-kong',
  'lebanon',
  'bangladesh',
  'multi-national',
  'korean-american',
  'vietnamese-american',
  'festival',
  'electronic',
  'edm',
  'girl-group',
  'boy-group',
])

// Genre hierarchy - first match wins (order matters!)
const GENRE_PRIORITY: string[] = [
  // Korean Specific (highest priority)
  'k-pop',
  'k-hip-hop',
  'k-rnb',
  'k-rock',
  // Specific Electronic
  'techno',
  'house',
  'trap',
  'dubstep',
  'future-bass',
  'hardstyle',
  'midtempo',
  'downtempo',
  'electro-pop',
  'progressive-house',
  'uk-garage',
  'disco-house',
  'electro-house',
  'melodic-house',
  'melodic-bass',
  'bass',
  'indietronica',
  'live-electronic',
  'future-funk',
  'nu-jazz',
  'synth-pop',
  'dancehall',
  // General Genres
  'hip-hop',
  'rnb',
  'alt-rnb',
  'rock',
  'alt-rock',
  'pop-rock',
  'pop-punk',
  'emo',
  'metalcore',
  'indie-pop',
  'indie-rock',
  'pop',
  'alt-pop',
  'country',
  'soul',
  'soul-pop',
  'funk',
  'afrobeats',
  'latin',
  'reggaeton',
  'j-pop',
  'c-pop',
]

/**
 * Get the primary genre for a concert based on tag hierarchy
 */
function getPrimaryGenre(tags: string[]): string {
  // Filter out meta tags and location tags
  const genreTags = tags.filter(
    (t) =>
      !META_TAGS.has(t) &&
      !t.startsWith('city:') &&
      !t.startsWith('venue:') &&
      !t.startsWith('festival:'),
  )

  // Find the first matching genre in priority order
  for (const genre of GENRE_PRIORITY) {
    if (genreTags.includes(genre)) {
      return genre
    }
  }

  // Fallback
  if (tags.includes('electronic') || tags.includes('edm')) {
    return 'electronic'
  }
  return 'other'
}

// Custom Tooltip for Line Chart (with examples)
interface LineTooltipPayload {
  dataKey: string
  value: number
  color: string
  name: string
}

interface CustomTooltipProps {
  active?: boolean
  payload?: LineTooltipPayload[]
  label?: number | string
}

function LineChartTooltip({
  active,
  payload,
  label,
  concerts,
}: CustomTooltipProps & { concerts: Concert[] }) {
  if (!active || !payload || payload.length === 0) return null

  const year = label as number
  const yearConcerts = concerts.filter(
    (c) => new Date(c.date).getFullYear() === year && c.status !== 'cancelled',
  )

  // Get top rated from this year
  const topRatedYear = yearConcerts
    .filter((c) => c.rating !== null)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 3)

  // Sort payload by value descending, excluding total
  const sortedPayload = [...payload]
    .filter((p) => p.dataKey !== 'total' && p.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 4)

  const totalEntry = payload.find((p) => p.dataKey === 'total')

  return (
    <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg p-3 shadow-lg min-w-[180px] z-50 relative">
      <p className="text-sm font-bold text-[var(--color-text)] mb-2">{year}</p>

      {totalEntry && (
        <p className="text-xs text-[var(--color-text-muted)] mb-2">
          <span className="font-semibold text-[var(--color-text)]">{totalEntry.value}</span> shows
        </p>
      )}

      {sortedPayload.length > 0 && (
        <div className="mb-2 space-y-1">
          {sortedPayload.map((entry) => (
            <div key={entry.dataKey} className="flex items-center gap-2 text-[10px]">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="text-[var(--color-text-muted)]">{entry.name}:</span>
              <span className="text-[var(--color-text)]">{entry.value}</span>
            </div>
          ))}
        </div>
      )}

      {topRatedYear.length > 0 && (
        <div className="border-t border-[var(--color-border)] pt-2 mt-2">
          <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
            Top Rated
          </p>
          {topRatedYear.map((c, i) => (
            <p key={i} className="text-[10px] text-[var(--color-text)]">
              {c.artist} <span className="text-[var(--color-text-muted)]">({c.rating})</span>
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

// Custom Tooltip for Genre Pie Chart (with examples)
interface PieTooltipPayload {
  name: string
  value: number
}

function GenrePieTooltip({
  active,
  payload,
  concertsByGenre,
  total,
}: {
  active?: boolean
  payload?: PieTooltipPayload[]
  concertsByGenre: Record<string, Concert[]>
  total: number
}) {
  if (!active || !payload || payload.length === 0) return null

  const data = payload[0]
  const genre = data.name as string
  const count = data.value as number
  const percentage = ((count / total) * 100).toFixed(1)

  // Get top rated in this genre
  const genreConcerts = concertsByGenre[genre] || []
  const topRated = genreConcerts
    .filter((c) => c.rating !== null)
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, 3)

  return (
    <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg p-3 shadow-lg min-w-[160px] z-50 relative">
      <p className="text-sm font-bold text-[var(--color-text)] capitalize mb-1">{genre}</p>
      <p className="text-xs text-[var(--color-text-muted)]">
        <span className="font-semibold text-[var(--color-text)]">{count}</span> shows ({percentage}
        %)
      </p>

      {topRated.length > 0 && (
        <div className="border-t border-[var(--color-border)] pt-2 mt-2">
          <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
            Top Rated
          </p>
          {topRated.map((c, i) => (
            <p key={i} className="text-[10px] text-[var(--color-text)]">
              {c.artist} <span className="text-[var(--color-text-muted)]">({c.rating})</span>
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

// Helper to get color for rating
function getRatingColor(rating: number): string {
  if (rating >= 9) return '#8b5cf6' // Violet
  if (rating >= 8) return '#34d399' // Emerald
  if (rating >= 7) return '#22d3ee' // Cyan
  if (rating >= 5) return '#fbbf24' // Amber
  return '#f87171' // Red
}

// Tooltip for Rating Scatter
function RatingScatterTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ payload: Concert & { timestamp: number } }>
}) {
  if (!active || !payload || payload.length === 0) return null

  const data = payload[0].payload
  const color = getRatingColor(data.rating || 0)

  return (
    <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg p-3 shadow-lg z-50 relative min-w-[200px]">
      <div className="flex justify-between items-start gap-4 mb-2">
        <div>
          <p className="text-sm font-bold text-[var(--color-text)]">{data.artist}</p>
          <p className="text-xs text-[var(--color-text-muted)]">
            {new Date(data.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </p>
          <p className="text-xs text-[var(--color-text-muted)]">{data.venue}</p>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-lg font-bold" style={{ color }}>
            {data.rating}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mt-2">
        {data.tags.slice(0, 5).map((tag) => (
          <span
            key={tag}
            className="text-[9px] px-1.5 py-0.5 rounded-full bg-[var(--color-bg-secondary)] text-[var(--color-text-muted)] border border-[var(--color-border)]"
          >
            {tag}
          </span>
        ))}
        {data.tags.length > 5 && (
          <span className="text-[9px] px-1.5 py-0.5 text-[var(--color-text-muted)]">
            +{data.tags.length - 5} more
          </span>
        )}
      </div>
    </div>
  )
}

// Colors for treemap
const TREEMAP_COLORS = {
  festival: '#82ca9d',
  venue: '#8884d8',
}

// Custom content for Treemap cells
interface TreemapContentProps {
  x?: number
  y?: number
  width?: number
  height?: number
  name?: string
  size?: number
  type?: string
  depth?: number
}

function TreemapContent({
  x = 0,
  y = 0,
  width = 0,
  height = 0,
  name,
  size,
  type,
  depth,
}: TreemapContentProps) {
  // Only render leaf nodes (depth 2)
  if (depth !== 2) return null

  const isSmall = width < 60 || height < 30
  const isTiny = width < 40 || height < 20

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: type === 'festival' ? TREEMAP_COLORS.festival : TREEMAP_COLORS.venue,
          stroke: 'var(--color-bg)',
          strokeWidth: 2,
          opacity: 0.85,
        }}
      />
      {!isTiny && (
        <>
          <text
            x={x + width / 2}
            y={y + height / 2 - (isSmall ? 0 : 6)}
            textAnchor="middle"
            dominantBaseline="middle"
            style={{
              fontSize: isSmall ? 8 : 10,
              fill: '#1a1a1a',
              fontWeight: 500,
            }}
          >
            {name && name.length > width / 7 ? name.slice(0, Math.floor(width / 7)) + '…' : name}
          </text>
          {!isSmall && (
            <text
              x={x + width / 2}
              y={y + height / 2 + 10}
              textAnchor="middle"
              dominantBaseline="middle"
              style={{
                fontSize: 9,
                fill: '#1a1a1a',
                opacity: 0.7,
              }}
            >
              {size}
            </text>
          )}
        </>
      )}
    </g>
  )
}

// Tooltip for Treemap
function TreemapTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ payload: { name: string; size: number; type: string } }>
}) {
  if (!active || !payload || payload.length === 0) return null

  const data = payload[0].payload
  if (!data.name || !data.size) return null

  return (
    <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg p-3 shadow-lg z-50 relative">
      <p className="text-sm font-bold text-[var(--color-text)] capitalize">{data.name}</p>
      <p className="text-xs text-[var(--color-text-muted)]">
        <span className="font-semibold text-[var(--color-text)]">{data.size}</span> shows
      </p>
      <p className="text-[10px] text-[var(--color-text-muted)] capitalize">{data.type}</p>
    </div>
  )
}

function ConcertsSection() {
  const [concerts, setConcerts] = useState<Concert[]>([])

  useEffect(() => {
    fetch('/concerts.json')
      .then((res) => res.json())
      .then((data: Concert[]) => setConcerts(data))
      .catch((err) => console.error('Failed to load concerts:', err))
  }, [])

  // Process data for charts
  const stats = useMemo(() => {
    if (concerts.length === 0) return null

    const validConcerts = concerts.filter((c) => c.rating !== null && c.status !== 'cancelled')

    // Assign primary genre to each concert
    const concertsWithGenre = validConcerts.map((c) => ({
      ...c,
      primaryGenre: getPrimaryGenre(c.tags),
    }))

    // Count concerts by primary genre
    const genreCounts: Record<string, number> = {}
    const concertsByGenre: Record<string, Concert[]> = {}

    concertsWithGenre.forEach((c) => {
      genreCounts[c.primaryGenre] = (genreCounts[c.primaryGenre] || 0) + 1
      if (!concertsByGenre[c.primaryGenre]) concertsByGenre[c.primaryGenre] = []
      concertsByGenre[c.primaryGenre].push(c)
    })

    // Get top 8 actual genres by count (exclude "other" - it's calculated separately)
    const topGenresList = Object.entries(genreCounts)
      .filter(([g]) => g !== 'other')
      .sort((a, b) => b[1] - a[1])
      .slice(0, 25)
      .map(([g]) => g)

    // Timeline Data: Concerts per year + Top Genre trends
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
          (c) => c.rating !== null && c.status !== 'cancelled',
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

    // Rating distribution
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

    // Genre Pie Data (top 6 + other)
    const genrePieData = topGenresList.map((genre) => ({
      name: genre,
      value: genreCounts[genre],
    }))

    const topGenreTotal = genrePieData.reduce((sum, item) => sum + item.value, 0)
    const otherCount = validConcerts.length - topGenreTotal
    if (otherCount > 0) {
      genrePieData.push({ name: 'other', value: otherCount })
    }

    // Venue/Festival breakdown data
    const festivalCounts: Record<string, number> = {}
    const venueCounts: Record<string, number> = {}

    validConcerts.forEach((c) => {
      const festivalTag = c.tags.find((t) => t.startsWith('festival:'))
      if (festivalTag) {
        // Convert festival tag to title case (e.g., "coachella" -> "Coachella")
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

    // Create treemap data for venues breakdown
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

    // Top venues for stats card
    const topVenues = Object.entries(venueCounts)
      .concat(Object.entries(festivalCounts))
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)

    // Average rating
    const avgRating =
      validConcerts.reduce((sum, c) => sum + (c.rating || 0), 0) / validConcerts.length

    // Scatter Plot Data
    const scatterData = validConcerts
      .map((c) => ({
        ...c,
        timestamp: new Date(c.date).getTime(),
      }))
      .sort((a, b) => a.timestamp - b.timestamp)

    // Top rated concerts (all perfect 10s)
    const topRated = [...validConcerts]
      .filter((c) => c.rating === 10)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

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
    }
  }, [concerts])

  if (!stats) return null

  return (
    <div className="py-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="flex flex-col gap-1 p-3 rounded-lg border border-[var(--color-border)]">
          <div className="flex items-center gap-2">
            <Music size={12} className="text-[var(--color-text-muted)]" />
            <span className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] font-semibold">
              Total Shows
            </span>
          </div>
          <p className="text-2xl font-bold text-[var(--color-text)]">{stats.total}</p>
        </div>
        <div className="flex flex-col gap-1 p-3 rounded-lg border border-[var(--color-border)]">
          <div className="flex items-center gap-2">
            <Star size={12} className="text-[var(--color-text-muted)]" />
            <span className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] font-semibold">
              Avg Rating
            </span>
          </div>
          <p className="text-2xl font-bold text-[var(--color-text)]">
            {stats.avgRating.toFixed(1)}
          </p>
        </div>
        <div className="flex flex-col gap-1 p-3 rounded-lg border border-[var(--color-border)]">
          <div className="flex items-center gap-2">
            <Calendar size={12} className="text-[var(--color-text-muted)]" />
            <span className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] font-semibold">
              Years Active
            </span>
          </div>
          <p className="text-2xl font-bold text-[var(--color-text)]">{stats.yearsData.length}</p>
        </div>
        <div className="flex flex-col gap-1 p-3 rounded-lg border border-[var(--color-border)]">
          <div className="flex items-center gap-2">
            <MapPin size={12} className="text-[var(--color-text-muted)]" />
            <span className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] font-semibold">
              Top Venue
            </span>
          </div>
          <p className="text-xs font-medium text-[var(--color-text)] leading-tight">
            {stats.topVenues[0]?.[0]}
          </p>
          <p className="text-[10px] text-[var(--color-text-muted)]">
            {stats.topVenues[0]?.[1]} shows
          </p>
        </div>
      </div>

      {/* Main Chart: Taste Evolution (Line Chart) */}
      <div className="mb-8 p-4 rounded-lg border border-[var(--color-border)]">
        <h4 className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] font-semibold mb-4">
          Taste Evolution (Shows per Year)
        </h4>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.yearsData}>
              <XAxis
                dataKey="year"
                tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }}
                axisLine={{ stroke: 'var(--color-border)' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }}
                axisLine={false}
                tickLine={false}
                width={30}
              />
              <Tooltip
                content={<LineChartTooltip concerts={concerts} />}
                wrapperStyle={{ zIndex: 100 }}
              />
              <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
              {/* Total Shows Line */}
              <Line
                type="monotone"
                dataKey="total"
                stroke="var(--color-text)"
                strokeWidth={2}
                dot={{ r: 3 }}
                name="Total"
              />
              {/* Genre Lines */}
              {stats.topGenresList.map((genre) => (
                <Line
                  key={genre}
                  type="monotone"
                  dataKey={genre}
                  stroke={GENRE_COLORS[genre] || '#808080'}
                  strokeWidth={1.5}
                  dot={false}
                  name={genre}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Secondary Charts Row: 2 columns max */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Genre Composition */}
        <div className="p-4 rounded-lg border border-[var(--color-border)]">
          <h4 className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] font-semibold mb-4">
            Genre Mix
          </h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.genrePieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={35}
                  outerRadius={75}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {stats.genrePieData.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={GENRE_COLORS[entry.name] || '#808080'} />
                  ))}
                </Pie>
                <Tooltip
                  content={
                    <GenrePieTooltip
                      concertsByGenre={stats.concertsByGenre}
                      total={stats.validConcerts.length}
                    />
                  }
                  wrapperStyle={{ zIndex: 100 }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '9px' }}
                  layout="vertical"
                  align="right"
                  verticalAlign="middle"
                  content={({ payload }) => {
                    // Sort by value (percentage) descending, then take top 10
                    const sortedPayload = [...(payload || [])]
                      .sort((a, b) => (b.payload?.value || 0) - (a.payload?.value || 0))
                      .slice(0, 10)
                    return (
                      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                        {sortedPayload.map((entry, index) => (
                          <li
                            key={`legend-${index}`}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                              marginBottom: '2px',
                              fontSize: '9px',
                            }}
                          >
                            <span
                              style={{
                                width: 8,
                                height: 8,
                                backgroundColor: entry.color,
                                borderRadius: '50%',
                                display: 'inline-block',
                              }}
                            />
                            <span style={{ color: 'var(--color-text-muted)' }}>{entry.value}</span>
                          </li>
                        ))}
                      </ul>
                    )
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Venues & Festivals Breakdown */}
        <div className="p-4 rounded-lg border border-[var(--color-border)]">
          <h4 className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] font-semibold mb-2">
            Venues & Festivals
          </h4>
          <div className="flex gap-2 mb-2">
            <span className="flex items-center gap-1 text-[10px] text-[var(--color-text-muted)]">
              <span
                className="w-2 h-2 rounded-sm"
                style={{ backgroundColor: TREEMAP_COLORS.venue }}
              />
              Venues
            </span>
            <span className="flex items-center gap-1 text-[10px] text-[var(--color-text-muted)]">
              <span
                className="w-2 h-2 rounded-sm"
                style={{ backgroundColor: TREEMAP_COLORS.festival }}
              />
              Festivals
            </span>
          </div>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <Treemap
                data={stats.venueTreemapData}
                dataKey="size"
                aspectRatio={4 / 3}
                stroke="var(--color-bg)"
                content={<TreemapContent />}
              >
                <Tooltip content={<TreemapTooltip />} wrapperStyle={{ zIndex: 100 }} />
              </Treemap>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* All Ratings (Full Width) */}
      <div className="mt-6 p-4 rounded-lg border border-[var(--color-border)]">
        <h4 className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] font-semibold mb-4">
          All Ratings
        </h4>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
              <XAxis
                type="number"
                dataKey="timestamp"
                domain={['dataMin', 'dataMax']}
                name="Date"
                tickFormatter={(unixTime) => new Date(unixTime).getFullYear().toString()}
                tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }}
                axisLine={{ stroke: 'var(--color-border)' }}
                tickLine={false}
              />
              <YAxis
                type="number"
                dataKey="rating"
                name="Rating"
                domain={[0, 10]}
                tickCount={11}
                tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }}
                axisLine={false}
                tickLine={false}
                width={30}
              />
              <ZAxis range={[50, 50]} />
              <Tooltip
                content={<RatingScatterTooltip />}
                wrapperStyle={{ zIndex: 100 }}
                cursor={{ strokeDasharray: '3 3' }}
              />
              <Scatter name="Ratings" data={stats.scatterData} shape="circle">
                {stats.scatterData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={getRatingColor(entry.rating || 0)}
                    strokeWidth={0}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Perfect 10s */}
      <div className="mt-6 p-4 rounded-lg border border-[var(--color-border)]">
        <h4 className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] font-semibold mb-4">
          Perfect 10s
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto pr-2">
          {stats.topRated.map((concert, i) => (
            <div
              key={`${concert.artist}-${concert.date}-${i}`}
              className="flex items-center justify-between gap-2 py-1.5 px-2 border border-[var(--color-border)] rounded"
            >
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-[var(--color-text)] truncate">
                  {concert.artist}
                </p>
                <p className="text-[10px] text-[var(--color-text-muted)] truncate">
                  {concert.venue} •{' '}
                  {new Date(concert.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                  })}
                </p>
              </div>
              <span className="text-xs font-bold flex-shrink-0 text-[var(--color-text)]">
                {concert.rating}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ConcertsSection

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts'
import type { ArtistStats } from '../types'

interface ArtistTooltipProps {
  active?: boolean
  payload?: { payload: ArtistStats }[]
}

function ArtistTooltip({ active, payload }: ArtistTooltipProps) {
  if (!active || !payload || payload.length === 0) return null

  const artist = payload[0].payload
  const lastSeenDate = new Date(artist.lastSeen).toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  })

  // Get unique venues
  const venues = [...new Set(artist.concerts.map((c) => c.venue))].slice(0, 3)

  return (
    <div className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-lg p-3 shadow-lg min-w-[180px] z-50 relative">
      <p className="text-sm font-bold text-[var(--color-text)] mb-1">{artist.name}</p>
      <p className="text-xs text-[var(--color-text-muted)]">
        <span className="font-semibold text-[var(--color-text)]">{artist.count}</span> shows
      </p>
      <p className="text-xs text-[var(--color-text-muted)]">
        Avg rating:{' '}
        <span className="font-semibold text-[var(--color-text)]">{artist.avgRating.toFixed(1)}</span>
      </p>
      <p className="text-xs text-[var(--color-text-muted)]">Last seen: {lastSeenDate}</p>

      {venues.length > 0 && (
        <div className="border-t border-[var(--color-border)] pt-2 mt-2">
          <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
            Venues
          </p>
          {venues.map((venue, i) => (
            <p key={i} className="text-[10px] text-[var(--color-text)] truncate">
              {venue}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

// Color gradient from warm to cool based on position
const BAR_COLORS = [
  '#FF6B9D', // Pink (top)
  '#FF7B8D',
  '#FF8B7D',
  '#FF9B6D',
  '#FFAB5D',
  '#FFBB4D',
  '#E8C744',
  '#C8D34A',
  '#A8DF50',
  '#88EB56',
  '#68D77C',
  '#58C3A2',
  '#48AFC8',
  '#389BEE',
  '#8884d8', // Purple (bottom)
]

interface TopArtistsChartProps {
  topArtists: ArtistStats[]
}

export function TopArtistsChart({ topArtists }: TopArtistsChartProps) {
  if (topArtists.length === 0) return null

  return (
    <div className="p-4 rounded-lg border border-[var(--color-border)] mt-8">
      <h4 className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] font-semibold mb-4">
        Most Seen Artists
      </h4>
      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={topArtists} layout="vertical" margin={{ left: 0, right: 20 }}>
            <XAxis
              type="number"
              tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }}
              axisLine={{ stroke: 'var(--color-border)' }}
              tickLine={false}
              allowDecimals={false}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: 'var(--color-text)', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={140}
              interval={0}
            />
            <Tooltip
              content={<ArtistTooltip />}
              cursor={{ fill: 'var(--color-border)', opacity: 0.3 }}
              wrapperStyle={{ zIndex: 100 }}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={20}>
              {topArtists.map((_, index) => (
                <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}


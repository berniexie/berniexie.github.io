import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  LabelList,
} from 'recharts'
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
    <div className="glass-tooltip rounded-lg p-3 min-w-[180px] z-50 relative">
      <p className="text-sm font-bold text-[var(--color-text)] mb-1">{artist.name}</p>
      <p className="text-xs text-[var(--color-text-muted)]">
        <span className="font-semibold text-[var(--color-text)]">{artist.count}</span> shows
      </p>
      <p className="text-xs text-[var(--color-text-muted)]">
        Avg rating:{' '}
        <span className="font-semibold text-[var(--color-text)]">
          {artist.avgRating.toFixed(1)}
        </span>
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

// Custom label renderer for inside the bar
function renderCustomLabel(props: {
  x?: number
  y?: number
  width?: number
  height?: number
  value?: string
}) {
  const { x = 0, y = 0, width = 0, height = 0, value } = props
  if (width < 30) return null // Don't render if bar is too small

  return (
    <text
      x={x + 6}
      y={y + height / 2}
      fill="#ffffff"
      fontSize={10}
      fontWeight={500}
      dominantBaseline="middle"
      style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
    >
      {value}
    </text>
  )
}

// Color gradient from warm to cool based on position (balanced taupe-friendly palette)
const BAR_COLORS = [
  '#C87058', // Terracotta (top)
  '#D08060',
  '#D49068',
  '#D8A070',
  '#D4A870',
  '#C8B070',
  '#B0B870',
  '#90B878',
  '#70B888',
  '#60B898',
  '#58B0A0',
  '#58A0A8',
  '#5890B0',
  '#5878B0',
  '#5A68A0', // Slate Blue (bottom)
]

interface TopArtistsChartProps {
  topArtists: ArtistStats[]
}

export function TopArtistsChart({ topArtists }: TopArtistsChartProps) {
  if (topArtists.length === 0) return null

  return (
    <div className="glass-card p-4 rounded-lg h-full">
      <h4 className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] font-semibold mb-4">
        Most Seen Artists
      </h4>
      <div className="h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={topArtists} layout="vertical" margin={{ left: 10, right: 20 }}>
            <XAxis
              type="number"
              tick={{ fill: 'var(--color-text-muted)', fontSize: 10 }}
              axisLine={{ stroke: 'var(--color-border)' }}
              tickLine={false}
              allowDecimals={false}
              domain={[0, 6]}
            />
            <YAxis type="category" dataKey="name" hide={true} />
            <Tooltip
              content={<ArtistTooltip />}
              cursor={{ fill: 'var(--color-border)', opacity: 0.3 }}
              wrapperStyle={{ zIndex: 100 }}
            />
            <Bar
              dataKey="count"
              radius={[4, 4, 4, 4]}
              barSize={18}
              isAnimationActive={false}
              style={{ cursor: 'pointer' }}
            >
              {topArtists.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={BAR_COLORS[index % BAR_COLORS.length]}
                  style={{ transition: 'opacity 0.2s ease', cursor: 'pointer' }}
                  className="hover:opacity-80"
                />
              ))}
              <LabelList dataKey="name" content={renderCustomLabel as never} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'
import type { Concert, GenrePieItem, PieTooltipPayload } from '../types'
import { GENRE_COLORS } from '../constants'

interface GenrePieTooltipProps {
  active?: boolean
  payload?: PieTooltipPayload[]
  concertsByGenre: Record<string, Concert[]>
  total: number
}

function GenrePieTooltip({ active, payload, concertsByGenre, total }: GenrePieTooltipProps) {
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

interface GenreMixChartProps {
  genrePieData: GenrePieItem[]
  concertsByGenre: Record<string, Concert[]>
  totalValidConcerts: number
}

export function GenreMixChart({
  genrePieData,
  concertsByGenre,
  totalValidConcerts,
}: GenreMixChartProps) {
  return (
    <div className="p-4 rounded-lg border border-[var(--color-border)]">
      <h4 className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] font-semibold mb-4">
        Genre Mix
      </h4>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={genrePieData}
              cx="50%"
              cy="50%"
              innerRadius={35}
              outerRadius={75}
              paddingAngle={2}
              dataKey="value"
            >
              {genrePieData.map((entry) => (
                <Cell key={`cell-${entry.name}`} fill={GENRE_COLORS[entry.name] || '#808080'} />
              ))}
            </Pie>
            <Tooltip
              content={
                <GenrePieTooltip concertsByGenre={concertsByGenre} total={totalValidConcerts} />
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
  )
}

import { XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts'
import type { Concert, LineTooltipPayload, YearData } from '../types'
import { GENRE_COLORS } from '../constants'

interface LineChartTooltipProps {
  active?: boolean
  payload?: LineTooltipPayload[]
  label?: number | string
  concerts: Concert[]
}

function LineChartTooltip({ active, payload, label, concerts }: LineChartTooltipProps) {
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
    <div className="glass-tooltip rounded-lg p-3 min-w-[180px] z-50 relative">
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

interface TasteEvolutionChartProps {
  yearsData: YearData[]
  topGenresList: string[]
  concerts: Concert[]
}

export function TasteEvolutionChart({
  yearsData,
  topGenresList,
  concerts,
}: TasteEvolutionChartProps) {
  return (
    <div className="glass-card mb-8 p-4 rounded-lg">
      <h4 className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] font-semibold mb-4">
        Taste Evolution (Shows per Year)
      </h4>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
          <LineChart data={yearsData}>
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
              dot={{ r: 3, fill: 'var(--color-text)', strokeWidth: 0 }}
              activeDot={{
                r: 5,
                fill: 'var(--color-text)',
                stroke: 'var(--color-bg)',
                strokeWidth: 2,
              }}
              name="Total"
              isAnimationActive={false}
            />
            {/* Genre Lines - Top 10 */}
            {topGenresList.slice(0, 10).map((genre) => (
              <Line
                key={genre}
                type="monotone"
                dataKey={genre}
                stroke={GENRE_COLORS[genre] || '#8A8A8A'}
                strokeWidth={1.5}
                dot={false}
                activeDot={{
                  r: 4,
                  fill: GENRE_COLORS[genre] || '#8A8A8A',
                  stroke: 'var(--color-bg)',
                  strokeWidth: 2,
                }}
                name={genre}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

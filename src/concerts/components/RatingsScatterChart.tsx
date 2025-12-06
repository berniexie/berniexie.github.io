import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
  Cell,
} from 'recharts'
import type { ConcertWithTimestamp } from '../types'
import { getRatingColor } from '../utils'

interface RatingScatterTooltipProps {
  active?: boolean
  payload?: Array<{ payload: ConcertWithTimestamp }>
}

function RatingScatterTooltip({ active, payload }: RatingScatterTooltipProps) {
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

interface RatingsScatterChartProps {
  scatterData: ConcertWithTimestamp[]
}

export function RatingsScatterChart({ scatterData }: RatingsScatterChartProps) {
  return (
    <div className="mt-8 p-4 rounded-lg border border-[var(--color-border)]">
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
            <Scatter name="Ratings" data={scatterData} shape="circle">
              {scatterData.map((entry, index) => (
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
  )
}

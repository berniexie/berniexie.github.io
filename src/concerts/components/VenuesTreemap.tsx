import { ResponsiveContainer, Treemap, Tooltip } from 'recharts'
import type { TreemapCategory } from '../types'
import { TREEMAP_COLORS } from '../constants'

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

interface TreemapTooltipProps {
  active?: boolean
  payload?: Array<{ payload: { name: string; size: number; type: string } }>
}

function TreemapTooltip({ active, payload }: TreemapTooltipProps) {
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

interface VenuesTreemapProps {
  venueTreemapData: TreemapCategory[]
}

export function VenuesTreemap({ venueTreemapData }: VenuesTreemapProps) {
  return (
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
            data={venueTreemapData}
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
  )
}

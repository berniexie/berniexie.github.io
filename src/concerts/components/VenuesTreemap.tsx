import { ResponsiveContainer, Treemap, Tooltip } from 'recharts'
import type { TreemapCategory } from '../types'

const COLORS = {
  venue: '#818cf8', // indigo-400 - matches accent
  festival: '#34d399', // emerald-400
}

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
  if (depth !== 2) return null

  const isSmall = width < 60 || height < 30
  const isTiny = width < 40 || height < 20
  const color = type === 'festival' ? COLORS.festival : COLORS.venue

  return (
    <g>
      <rect
        x={x + 1}
        y={y + 1}
        width={Math.max(0, width - 2)}
        height={Math.max(0, height - 2)}
        rx={3}
        ry={3}
        fill={color}
        fillOpacity={0.15}
        stroke={color}
        strokeWidth={1}
        strokeOpacity={0.5}
      />
      {!isTiny && (
        <>
          <text
            x={x + width / 2}
            y={y + height / 2 - (isSmall ? 0 : 7)}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="var(--color-text)"
            fontSize={isSmall ? 9 : 11}
            fontWeight={500}
            fontFamily="var(--font-body)"
          >
            {name && name.length > width / 6.5
              ? name.slice(0, Math.floor(width / 6.5)) + '…'
              : name}
          </text>
          {!isSmall && (
            <text
              x={x + width / 2}
              y={y + height / 2 + 9}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="var(--color-text-muted)"
              fontSize={10}
              fontFamily="var(--font-body)"
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
    <div className="glass-tooltip rounded-md px-3 py-2">
      <p className="text-sm text-[var(--color-text)]">{data.name}</p>
      <p className="text-xs text-[var(--color-text-muted)]">
        {data.size} shows · <span className="capitalize">{data.type}</span>
      </p>
    </div>
  )
}

interface VenuesTreemapProps {
  venueTreemapData: TreemapCategory[]
}

export function VenuesTreemap({ venueTreemapData }: VenuesTreemapProps) {
  return (
    <div className="glass-card p-4 rounded-lg">
      <h4 className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] font-semibold mb-3">
        Venues & Festivals
      </h4>
      <div className="flex gap-4 mb-3">
        <span className="flex items-center gap-1.5 text-[10px] text-[var(--color-text-muted)]">
          <span
            className="w-2 h-2 rounded-sm"
            style={{ backgroundColor: COLORS.venue }}
          />
          Venues
        </span>
        <span className="flex items-center gap-1.5 text-[10px] text-[var(--color-text-muted)]">
          <span
            className="w-2 h-2 rounded-sm"
            style={{ backgroundColor: COLORS.festival }}
          />
          Festivals
        </span>
      </div>
      <div className="h-64 md:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={venueTreemapData}
            dataKey="size"
            aspectRatio={4 / 3}
            content={<TreemapContent />}
            isAnimationActive={false}
          >
            <Tooltip content={<TreemapTooltip />} />
          </Treemap>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

import type { Concert } from '../types'

interface PerfectTensListProps {
  topRated: Concert[]
}

export function PerfectTensList({ topRated }: PerfectTensListProps) {
  return (
    <div className="glass-card mt-8 p-4 rounded-lg">
      <h4 className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] font-semibold mb-4">
        Perfect 10s
      </h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-2">
        {topRated.map((concert, i) => (
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
  )
}

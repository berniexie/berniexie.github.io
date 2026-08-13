import type { ConcertStats } from '../types'

interface StatsCardsProps {
  stats: ConcertStats
}

export function StatsCards({ stats }: StatsCardsProps) {
  const items = [
    { label: 'Shows logged', value: String(stats.total), detail: 'and counting' },
    { label: 'Average rating', value: stats.avgRating.toFixed(1), detail: 'out of 10' },
    { label: 'Years active', value: String(stats.yearsData.length), detail: '2012 — present' },
    {
      label: 'Top venue',
      value: stats.topVenues[0]?.[0] || '—',
      detail: stats.topVenues[0] ? `${stats.topVenues[0][1]} shows` : 'No venue data',
    },
  ]

  return (
    <dl className="archive-stats">
      {items.map((item) => (
        <div key={item.label}>
          <dt>{item.label}</dt>
          <dd>{item.value}</dd>
          <span>{item.detail}</span>
        </div>
      ))}
    </dl>
  )
}

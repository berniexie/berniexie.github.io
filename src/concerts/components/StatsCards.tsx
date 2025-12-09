import { Music, Star, Calendar, MapPin } from 'lucide-react'
import { FlipText } from '../../components/FlipText'
import type { ConcertStats } from '../types'

interface StatsCardsProps {
  stats: ConcertStats
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
      <div className="glass-card flex flex-col gap-1 p-3 rounded-lg">
        <div className="flex items-center gap-2">
          <Music size={12} className="text-[var(--color-text-muted)]" />
          <span className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] font-semibold">
            Total Shows
          </span>
        </div>
        <p className="text-2xl font-bold text-[var(--color-text)]">
          <FlipText delay={0}>{String(stats.total)}</FlipText>
        </p>
      </div>
      <div className="glass-card flex flex-col gap-1 p-3 rounded-lg">
        <div className="flex items-center gap-2">
          <Star size={12} className="text-[var(--color-text-muted)]" />
          <span className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] font-semibold">
            Avg Rating
          </span>
        </div>
        <p className="text-2xl font-bold text-[var(--color-text)]">
          <FlipText delay={200}>{stats.avgRating.toFixed(1)}</FlipText>
        </p>
      </div>
      <div className="glass-card flex flex-col gap-1 p-3 rounded-lg">
        <div className="flex items-center gap-2">
          <Calendar size={12} className="text-[var(--color-text-muted)]" />
          <span className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] font-semibold">
            Years Active
          </span>
        </div>
        <p className="text-2xl font-bold text-[var(--color-text)]">
          <FlipText delay={400}>{String(stats.yearsData.length)}</FlipText>
        </p>
      </div>
      <div className="glass-card flex flex-col gap-1 p-3 rounded-lg">
        <div className="flex items-center gap-2">
          <MapPin size={12} className="text-[var(--color-text-muted)]" />
          <span className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] font-semibold">
            Top Venue
          </span>
        </div>
        <p className="text-xs font-medium text-[var(--color-text)] leading-tight">
          <FlipText delay={600}>{stats.topVenues[0]?.[0] || ''}</FlipText>
        </p>
        <p className="text-[10px] text-[var(--color-text-muted)]">
          <FlipText delay={750}>{stats.topVenues[0] ? `${stats.topVenues[0][1]} shows` : ''}</FlipText>
        </p>
      </div>
    </div>
  )
}

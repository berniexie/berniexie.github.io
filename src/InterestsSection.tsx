import { useEffect, useState } from 'react'
import { Plane, Flag, Music, Tv, BookOpen, Ticket } from 'lucide-react'
import { FlipText } from './components/FlipText'

interface InterestsData {
  lastTravel: {
    city: string
    country: string
    month: string
    year: number
  }
  golf: {
    pr: number
    course: string
    date: string
    handicap: number
    handicapDate: string
  }
  mostPlayedSong: {
    title: string
    artist: string
  }
  lastWatched: {
    title: string
    platform: string
  }
  lastRead: {
    title: string
    author: string
  }
  lastConcert: {
    artist: string
    venue: string
  }
}

function InterestsSection() {
  const [data, setData] = useState<InterestsData | null>(null)

  useEffect(() => {
    fetch('/trends.json')
      .then((res) => res.json())
      .then((data: InterestsData) => setData(data))
      .catch((err) => console.error('Failed to load interests:', err))
  }, [])

  if (!data) return null

  const interests = [
    {
      icon: Plane,
      label: 'Last Travel',
      value: `${data.lastTravel.city}, ${data.lastTravel.country}`,
      subtext: `${data.lastTravel.month} ${data.lastTravel.year}`,
    },
    {
      icon: Flag,
      label: 'Golf',
      isGolfCard: true,
      left: {
        label: 'PR',
        value: String(data.golf.pr),
        subtext: data.golf.course,
      },
      right: {
        label: 'Handicap',
        value: String(data.golf.handicap),
        subtext: data.golf.handicapDate,
      },
    },
    {
      icon: Music,
      label: 'On Repeat',
      value: data.mostPlayedSong.title,
      subtext: data.mostPlayedSong.artist,
    },
    {
      icon: Tv,
      label: 'Last Watched',
      value: data.lastWatched.title,
      subtext: data.lastWatched.platform,
    },
    {
      icon: BookOpen,
      label: 'Last Read',
      value: data.lastRead.title,
      subtext: data.lastRead.author,
    },
    {
      icon: Ticket,
      label: 'Last Concert',
      value: data.lastConcert.artist,
      subtext: data.lastConcert.venue,
    },
  ]

  return (
    <div className="py-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {interests.map((item, index) => (
          <div
            key={item.label}
            className="group flex flex-col gap-2 p-3 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-text)]/30 transition-colors"
          >
            <div className="flex items-center gap-2">
              <item.icon
                size={12}
                className="text-[var(--color-text-muted)] group-hover:text-[var(--color-text)] transition-colors"
              />
              <span className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)] font-semibold">
                {item.label}
              </span>
            </div>
            {item.isGolfCard ? (
              <div className="grid grid-cols-2 gap-3">
                <div className="border-r border-[var(--color-border)] pr-3">
                  <p className="text-[9px] uppercase tracking-wider text-[var(--color-text-muted)] mb-0.5">
                    {item.left.label}
                  </p>
                  <p className="text-xs font-medium text-[var(--color-text)] leading-tight">
                    <FlipText delay={index * 200}>{item.left.value}</FlipText>
                  </p>
                  <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5 leading-tight">
                    <FlipText delay={index * 200 + 100}>{item.left.subtext}</FlipText>
                  </p>
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-[var(--color-text-muted)] mb-0.5">
                    {item.right.label}
                  </p>
                  <p className="text-xs font-medium text-[var(--color-text)] leading-tight">
                    <FlipText delay={index * 200 + 50}>{item.right.value}</FlipText>
                  </p>
                  <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5 leading-tight">
                    <FlipText delay={index * 200 + 150}>{item.right.subtext}</FlipText>
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-xs font-medium text-[var(--color-text)] leading-tight">
                  <FlipText delay={index * 200}>{item.value ?? ''}</FlipText>
                </p>
                {item.subtext && (
                  <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5 leading-tight">
                    <FlipText delay={index * 200 + 100}>{item.subtext}</FlipText>
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default InterestsSection

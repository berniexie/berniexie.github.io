import { useEffect, useState } from 'react'

interface InterestsData {
  lastTravel: { city: string; country: string; month: string; year: number }
  golf: { pr: number; course: string; date: string; handicap: number; handicapDate: string }
  mostPlayedSong: { title: string; artist: string }
  lastWatched: { title: string; platform: string }
  lastRead: { title: string; author: string }
  lastConcert: { artist: string; venue: string }
}

function InterestsSection() {
  const [data, setData] = useState<InterestsData | null>(null)

  useEffect(() => {
    let cancelled = false

    fetch('/trends.json')
      .then((response) => {
        if (!response.ok) throw new Error('Current notes unavailable')
        return response.json() as Promise<InterestsData>
      })
      .then((interests) => {
        if (!cancelled) setData(interests)
      })
      .catch(() => {
        if (!cancelled) setData(null)
      })

    return () => {
      cancelled = true
    }
  }, [])

  if (!data) return null

  const entries = [
    {
      label: 'Last travel',
      value: `${data.lastTravel.city}, ${data.lastTravel.country}`,
      detail: `${data.lastTravel.month} ${data.lastTravel.year}`,
    },
    {
      label: 'Golf',
      value: `PR ${data.golf.pr} · ${data.golf.handicap} HCP`,
      detail: data.golf.course,
    },
    {
      label: 'On repeat',
      value: data.mostPlayedSong.title,
      detail: data.mostPlayedSong.artist,
    },
    {
      label: 'Last watched',
      value: data.lastWatched.title,
      detail: data.lastWatched.platform,
    },
    {
      label: 'Last read',
      value: data.lastRead.title,
      detail: data.lastRead.author,
    },
    {
      label: 'Last concert',
      value: data.lastConcert.artist,
      detail: data.lastConcert.venue,
    },
  ]

  return (
    <section className="lately" aria-labelledby="lately-heading">
      <div className="lately__heading">
        <h2 id="lately-heading">Lately</h2>
      </div>
      <dl className="lately__rail">
        {entries.map((entry) => (
          <div key={entry.label}>
            <dt>{entry.label}</dt>
            <dd>{entry.value}</dd>
            <span>{entry.detail}</span>
          </div>
        ))}
      </dl>
    </section>
  )
}

export default InterestsSection

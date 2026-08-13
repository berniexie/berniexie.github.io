import { useEffect, useState } from 'react'
import { SplitFlapText } from './components/SplitFlapText'
import { useNearViewport } from './hooks/useNearViewport'

interface InterestsData {
  lastTravel: { city: string; country: string; month: string; year: number }
  golf: { pr: number; course: string; date: string; handicap: number; handicapDate: string }
  mostPlayedSong: { title: string; artist: string }
  lastWatched: { title: string; platform: string }
  lastRead: { title: string; author: string }
  lastConcert: { artist: string; venue: string }
}

type InterestsState =
  | { status: 'loading'; data: null }
  | { status: 'ready'; data: InterestsData }
  | { status: 'error'; data: null }

function InterestsSection() {
  const [state, setState] = useState<InterestsState>({ status: 'loading', data: null })
  const [replayCycle, setReplayCycle] = useState(0)
  const { elementRef, isNearViewport } = useNearViewport({
    rootMargin: '0px 0px -10% 0px',
  })

  useEffect(() => {
    let cancelled = false

    fetch('/trends.json')
      .then((response) => {
        if (!response.ok) throw new Error('Current notes unavailable')
        return response.json() as Promise<InterestsData>
      })
      .then((interests) => {
        if (!cancelled) setState({ status: 'ready', data: interests })
      })
      .catch(() => {
        if (!cancelled) setState({ status: 'error', data: null })
      })

    return () => {
      cancelled = true
    }
  }, [])

  const entries =
    state.status === 'ready'
      ? [
          {
            label: 'Last travel',
            value: `${state.data.lastTravel.city}, ${state.data.lastTravel.country}`,
            detail: `${state.data.lastTravel.month} ${state.data.lastTravel.year}`,
          },
          {
            label: 'Golf',
            value: `PR ${state.data.golf.pr} · ${state.data.golf.handicap} HCP`,
            detail: state.data.golf.course,
          },
          {
            label: 'On repeat',
            value: state.data.mostPlayedSong.title,
            detail: state.data.mostPlayedSong.artist,
          },
          {
            label: 'Last watched',
            value: state.data.lastWatched.title,
            detail: state.data.lastWatched.platform,
          },
          {
            label: 'Last read',
            value: state.data.lastRead.title,
            detail: state.data.lastRead.author,
          },
          {
            label: 'Last concert',
            value: state.data.lastConcert.artist,
            detail: state.data.lastConcert.venue,
          },
        ]
      : []

  const shouldPlay = state.status === 'ready' && isNearViewport

  return (
    <section className="lately" aria-labelledby="lately-heading">
      <div aria-busy={state.status === 'loading'} className="departure-board" ref={elementRef}>
        <div className="departure-board__header">
          <h2 id="lately-heading">Lately</h2>
          {state.status === 'ready' && (
            <button
              aria-label="Replay split-flap animation"
              className="departure-board__replay"
              disabled={!isNearViewport}
              onClick={() => setReplayCycle((cycle) => cycle + 1)}
              type="button"
            >
              Replay
            </button>
          )}
        </div>

        {state.status === 'loading' && (
          <div className="departure-board__message" role="status">
            Loading current notes…
          </div>
        )}

        {state.status === 'error' && (
          <div className="departure-board__message" role="status">
            Current notes unavailable.
          </div>
        )}

        {state.status === 'ready' && (
          <dl className="departure-board__rows">
            {entries.map((entry, rowIndex) => (
              <div className="departure-board__row" key={entry.label}>
                <dt>{entry.label}</dt>
                <dd>
                  <span className="sr-only">
                    {entry.value}. {entry.detail}.
                  </span>
                  <div className="departure-board__fields">
                    <SplitFlapText
                      cycle={replayCycle}
                      play={shouldPlay}
                      rowIndex={rowIndex}
                      text={entry.value}
                    />
                    <SplitFlapText
                      cycle={replayCycle}
                      play={shouldPlay}
                      rowIndex={rowIndex}
                      text={entry.detail}
                      variant="detail"
                    />
                  </div>
                </dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  )
}

export default InterestsSection

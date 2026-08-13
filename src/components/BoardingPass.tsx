import { Plane } from 'lucide-react'
import type { Trip } from '../TravelGlobe'

interface BoardingPassProps {
  trip: Trip
  homeTrip?: Trip | null
}

const BAR_WIDTHS = [2, 4, 1, 3, 2, 1, 4, 2, 3, 1, 2, 4, 1, 3, 2, 4, 1, 2, 3, 1]

export function BoardingPass({ trip, homeTrip }: BoardingPassProps) {
  const routeCode = `${trip.city.slice(0, 3)}-${Math.round(trip.score * 10)}`.toUpperCase()

  return (
    <aside className="boarding-pass" aria-label={`Trip details for ${trip.city}, ${trip.country}`}>
      <div className="boarding-pass__accent" aria-hidden="true" />
      <div className="boarding-pass__main">
        <div className="boarding-pass__header">
          <span>
            <Plane aria-hidden="true" size={14} /> BOARDING PASS
          </span>
          <span>{routeCode}</span>
        </div>

        <div className="boarding-pass__route">
          <div>
            <span className="meta-label">Destination</span>
            <strong>{trip.city}</strong>
            <small>{trip.country}</small>
          </div>
          <div>
            <span className="meta-label">Score</span>
            <strong>{trip.score.toFixed(1)}</strong>
            <small>out of 10</small>
          </div>
        </div>

        {trip.summary && <p className="boarding-pass__note">{trip.summary}</p>}
        {homeTrip && !trip.isHome && (
          <p className="boarding-pass__origin">Origin / SFO</p>
        )}
      </div>

      <div className="boarding-pass__stub" aria-hidden="true">
        <div className="boarding-pass__barcode">
          {BAR_WIDTHS.map((width, index) => (
            <span key={`${width}-${index}`} style={{ width }} />
          ))}
        </div>
      </div>
    </aside>
  )
}

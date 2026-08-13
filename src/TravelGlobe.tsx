import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Geometry } from 'geojson'
import Globe from 'react-globe.gl'
import type { GlobeMethods } from 'react-globe.gl'
import { MeshPhongMaterial } from 'three'
import { MapPin } from 'lucide-react'
import { BoardingPass } from './components/BoardingPass'
import { loadTravelData, usePortfolioSummary } from './hooks/usePortfolioSummary'

export interface Trip {
  city: string
  country: string
  coordinates: [number, number]
  score: number
  summary?: string
  isHome?: boolean
}

interface Arc {
  startLat: number
  startLng: number
  endLat: number
  endLng: number
}

interface CountryFeature {
  type: string
  properties: {
    NAME?: string
    ADMIN?: string
    ISO_A3?: string
  }
  geometry: Geometry
}

interface TravelData {
  trips: Trip[]
}

const COUNTRY_NAME_MAP: Record<string, string> = {
  USA: 'United States of America',
  UK: 'United Kingdom',
  Scotland: 'United Kingdom',
  'South Korea': 'South Korea',
  'Hong Kong': 'China',
  'Czech Republic': 'Czechia',
}

function supportsWebGl() {
  try {
    const canvas = document.createElement('canvas')
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

export default function TravelGlobe() {
  const globeRef = useRef<GlobeMethods | undefined>(undefined)
  const globeContainerRef = useRef<HTMLDivElement>(null)
  const [trips, setTrips] = useState<Trip[]>([])
  const [countries, setCountries] = useState<CountryFeature[]>([])
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null)
  const [hoveredTrip, setHoveredTrip] = useState<Trip | null>(null)
  const [homeTrip, setHomeTrip] = useState<Trip | null>(null)
  const [globeReady, setGlobeReady] = useState(false)
  const [loadError, setLoadError] = useState(false)
  const [dimensions, setDimensions] = useState({ width: 600, height: 600 })
  const [canRenderGlobe] = useState(supportsWebGl)
  const { data: portfolioSummary } = usePortfolioSummary()

  const globeMaterial = useMemo(
    () =>
      new MeshPhongMaterial({
        color: '#17211d',
        emissive: '#0d1512',
        shininess: 3,
      }),
    [],
  )

  useEffect(() => () => globeMaterial.dispose(), [globeMaterial])

  useEffect(() => {
    let cancelled = false

    Promise.all([
      loadTravelData() as Promise<TravelData>,
      fetch('/countries.geojson').then((response) => {
        if (!response.ok) throw new Error('Map data unavailable')
        return response.json() as Promise<{ features: CountryFeature[] }>
      }),
    ])
      .then(([travelData, countryData]) => {
        if (cancelled) return

        const sortedTrips = [...travelData.trips].sort((a, b) => b.score - a.score)
        const home = travelData.trips.find((trip) => trip.isHome) ?? null

        setTrips(sortedTrips)
        setCountries(countryData.features)
        setHomeTrip(home)
      })
      .catch(() => {
        if (!cancelled) setLoadError(true)
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const container = globeContainerRef.current
    if (!container) return

    const updateDimensions = () => {
      const width = Math.min(container.offsetWidth, 680)
      setDimensions({ width, height: width })
    }

    updateDimensions()
    const observer = new ResizeObserver(updateDimensions)
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!globeReady || !globeRef.current) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    globeRef.current.pointOfView({ lat: 22, lng: 5, altitude: 1.9 }, reduceMotion ? 0 : 700)

    const controls = globeRef.current.controls()
    if (!controls) return
    controls.autoRotate = !reduceMotion
    controls.autoRotateSpeed = 0.35
    controls.enableZoom = true
    controls.minDistance = 120
    controls.maxDistance = 380
    controls.enableDamping = !reduceMotion
    controls.dampingFactor = 0.08
  }, [globeReady])

  const defaultTrip = useMemo(() => {
    const latest = portfolioSummary?.latestTravel
    if (!latest) return trips[0] ?? null

    return (
      trips.find(
        (trip) =>
          trip.city.toLocaleLowerCase() === latest.city.toLocaleLowerCase() &&
          trip.country.toLocaleLowerCase() === latest.country.toLocaleLowerCase(),
      ) ??
      trips[0] ??
      null
    )
  }, [portfolioSummary?.latestTravel, trips])

  const selectedTrip = activeTrip ?? defaultTrip
  const presentedTrip = hoveredTrip ?? selectedTrip

  const handleInteraction = useCallback(() => {
    const controls = globeRef.current?.controls()
    if (controls) controls.autoRotate = false
  }, [])

  const handleTripSelect = useCallback(
    (trip: Trip) => {
      setActiveTrip(trip)
      handleInteraction()
      globeRef.current?.pointOfView(
        { lat: trip.coordinates[0], lng: trip.coordinates[1], altitude: 1.65 },
        window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 650,
      )
    },
    [handleInteraction],
  )

  const isCountryActive = useCallback(
    (feature: object) => {
      if (!presentedTrip) return false
      const country = feature as CountryFeature
      const geoName = country.properties.ADMIN || country.properties.NAME || ''
      const tripCountry = presentedTrip.country
      return (
        geoName === tripCountry ||
        COUNTRY_NAME_MAP[tripCountry] === geoName ||
        geoName.includes(tripCountry) ||
        tripCountry.includes(geoName)
      )
    },
    [presentedTrip],
  )

  const getPointColor = useCallback(
    (point: object) => ((point as Trip).city === presentedTrip?.city ? '#f3f0e7' : '#e76f45'),
    [presentedTrip],
  )

  const getPointRadius = useCallback(
    (point: object) => ((point as Trip).city === presentedTrip?.city ? 1.05 : 0.55),
    [presentedTrip],
  )

  const arcData = useMemo<Arc[]>(() => {
    if (!homeTrip || !presentedTrip || presentedTrip.isHome) return []
    return [
      {
        startLat: homeTrip.coordinates[0],
        startLng: homeTrip.coordinates[1],
        endLat: presentedTrip.coordinates[0],
        endLng: presentedTrip.coordinates[1],
      },
    ]
  }, [homeTrip, presentedTrip])

  const featuredTrips = trips.filter((trip) => !trip.isHome).slice(0, 5)

  if (loadError) {
    return (
      <div className="archive-fallback" role="status">
        <p className="meta-label">Atlas unavailable</p>
        <p>The travel notes could not be loaded. The rest of the site is still available.</p>
      </div>
    )
  }

  return (
    <div className="travel-atlas">
      <div className="travel-atlas__copy">
        <div className="travel-latest">
          <p className="meta-label">
            Latest field note
            {portfolioSummary?.latestTravel
              ? ` / ${portfolioSummary.latestTravel.month} ${portfolioSummary.latestTravel.year}`
              : ''}
          </p>
          <p className="travel-latest__place">
            {selectedTrip ? `${selectedTrip.city}, ${selectedTrip.country}` : 'Loading the atlas…'}
          </p>
        </div>

        <div>
          <p className="meta-label">Highest rated</p>
          <ol className="destination-list" aria-label="Highest-rated destinations">
            {featuredTrips.map((trip, index) => {
              const isActive = trip.city === presentedTrip?.city
              return (
                <li key={`${trip.city}-${trip.country}`}>
                  <button
                    type="button"
                    className={isActive ? 'is-active' : ''}
                    onClick={() => handleTripSelect(trip)}
                    onFocus={() => setHoveredTrip(trip)}
                    onBlur={() => setHoveredTrip(null)}
                    onMouseEnter={() => setHoveredTrip(trip)}
                    onMouseLeave={() => setHoveredTrip(null)}
                    aria-pressed={trip.city === selectedTrip?.city}
                  >
                    <span className="destination-list__index">0{index + 1}</span>
                    <span>
                      <strong>{trip.city}</strong>
                      <small>{trip.country}</small>
                    </span>
                    <span className="destination-list__score">{trip.score.toFixed(1)}</span>
                  </button>
                </li>
              )
            })}
          </ol>
        </div>

        {presentedTrip && <BoardingPass trip={presentedTrip} homeTrip={homeTrip} />}
      </div>

      <div ref={globeContainerRef} className="travel-atlas__globe">
        {canRenderGlobe ? (
          <Globe
            ref={globeRef}
            width={dimensions.width}
            height={dimensions.height}
            backgroundColor="rgba(0,0,0,0)"
            globeMaterial={globeMaterial}
            showGlobe
            showAtmosphere={false}
            showGraticules
            polygonsData={countries}
            polygonCapColor={(feature) =>
              isCountryActive(feature) ? 'rgba(231, 111, 69, 0.28)' : 'rgba(15, 98, 89, 0.08)'
            }
            polygonSideColor={() => 'rgba(0, 0, 0, 0)'}
            polygonStrokeColor={(feature) =>
              isCountryActive(feature) ? 'rgba(243, 240, 231, 0.75)' : 'rgba(243, 240, 231, 0.18)'
            }
            polygonAltitude={0.006}
            pointsData={trips}
            pointLat={(point) => (point as Trip).coordinates[0]}
            pointLng={(point) => (point as Trip).coordinates[1]}
            pointColor={getPointColor}
            pointRadius={getPointRadius}
            pointAltitude={0.012}
            pointsMerge={false}
            arcsData={arcData}
            arcStartLat={(arc) => (arc as Arc).startLat}
            arcStartLng={(arc) => (arc as Arc).startLng}
            arcEndLat={(arc) => (arc as Arc).endLat}
            arcEndLng={(arc) => (arc as Arc).endLng}
            arcColor={() => ['rgba(231, 111, 69, 0.95)', 'rgba(243, 240, 231, 0.35)']}
            arcDashLength={0.5}
            arcDashGap={0.2}
            arcDashAnimateTime={1800}
            arcStroke={0.45}
            arcAltitudeAutoScale={0.24}
            onPointHover={(point) => setHoveredTrip(point as Trip | null)}
            onPointClick={(point) => handleTripSelect(point as Trip)}
            onGlobeClick={handleInteraction}
            onGlobeReady={() => setGlobeReady(true)}
            onZoom={handleInteraction}
          />
        ) : (
          <div className="globe-fallback" role="img" aria-label="Travel atlas unavailable">
            <MapPin aria-hidden="true" />
            <p>Interactive atlas unavailable on this device.</p>
          </div>
        )}
      </div>
    </div>
  )
}

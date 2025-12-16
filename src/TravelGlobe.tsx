import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import Globe from 'react-globe.gl'
import type { GlobeMethods } from 'react-globe.gl'
import type { Geometry } from 'geojson'
import { BoardingPass } from './components/BoardingPass'

interface Trip {
  city: string
  country: string
  coordinates: [number, number] // [lat, lon]
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

// Map travel.json country names to GeoJSON names
const COUNTRY_NAME_MAP: Record<string, string> = {
  USA: 'United States of America',
  UK: 'United Kingdom',
  Scotland: 'United Kingdom',
  'South Korea': 'South Korea',
  'Hong Kong': 'China',
  'Czech Republic': 'Czechia',
}

export default function TravelGlobe() {
  const globeRef = useRef<GlobeMethods | undefined>(undefined)
  const containerRef = useRef<HTMLDivElement>(null)
  const [trips, setTrips] = useState<Trip[]>([])
  const [countries, setCountries] = useState<CountryFeature[]>([])
  const [hoveredTrip, setHoveredTrip] = useState<Trip | null>(null)
  const [homeTrip, setHomeTrip] = useState<Trip | null>(null)
  const [globeReady, setGlobeReady] = useState(false)
  const [dimensions, setDimensions] = useState({ width: 600, height: 600 })

  // Load travel data
  useEffect(() => {
    fetch('/travel.json')
      .then((res) => res.json())
      .then((data: TravelData) => {
        setTrips(data.trips)
        const home = data.trips.find((t) => t.isHome)
        if (home) setHomeTrip(home)
      })
      .catch((err) => console.error('Failed to load travel data', err))
  }, [])

  // Load country borders GeoJSON (cached locally for performance)
  useEffect(() => {
    fetch('/countries.geojson')
      .then((res) => res.json())
      .then((data: { features: CountryFeature[] }) => {
        setCountries(data.features)
      })
      .catch((err) => console.error('Failed to load country data', err))
  }, [])

  // Handle resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = Math.min(containerRef.current.offsetWidth, 800)
        setDimensions({ width, height: width })
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  // Setup globe controls when ready
  useEffect(() => {
    if (globeReady && globeRef.current) {
      globeRef.current.pointOfView({ lat: 20, lng: 0, altitude: 1.8 })

      const controls = globeRef.current.controls()
      if (controls) {
        controls.autoRotate = true
        controls.autoRotateSpeed = 0.5
        controls.enableZoom = true
        controls.minDistance = 120
        controls.maxDistance = 400
        controls.enableDamping = true
        controls.dampingFactor = 0.1
      }
    }
  }, [globeReady])

  // Stop auto-rotate on interaction
  const handleInteraction = useCallback(() => {
    if (globeRef.current) {
      const controls = globeRef.current.controls()
      if (controls) {
        controls.autoRotate = false
      }
    }
  }, [])

  // Helper to check if a country feature matches the hovered trip
  const isCountryHovered = useCallback(
    (feature: object) => {
      if (!hoveredTrip) return false
      const f = feature as CountryFeature
      const geoName = f.properties.ADMIN || f.properties.NAME || ''
      const tripCountry = hoveredTrip.country

      // Direct match
      if (geoName === tripCountry) return true

      // Mapped match
      if (COUNTRY_NAME_MAP[tripCountry] === geoName) return true

      // Partial match (e.g. "United States" vs "United States of America")
      if (geoName.includes(tripCountry) || tripCountry.includes(geoName)) return true

      return false
    },
    [hoveredTrip],
  )

  // Dynamic point color based on hover
  const getPointColor = useCallback(
    (d: object) => {
      const trip = d as Trip
      if (hoveredTrip?.city === trip.city) {
        return '#ffffff' // White when hovered
      }
      return '#f97316' // Bright orange for visibility
    },
    [hoveredTrip],
  )

  // Dynamic point radius based on hover and score
  const getPointRadius = useCallback(
    (d: object) => {
      const trip = d as Trip
      if (hoveredTrip?.city === trip.city) {
        return 1.2
      }
      return trip.score >= 9.0 ? 0.8 : 0.6
    },
    [hoveredTrip],
  )

  // Arc from home to hovered location
  const arcData = useMemo<Arc[]>(() => {
    if (!homeTrip || !hoveredTrip || hoveredTrip.isHome) return []
    return [
      {
        startLat: homeTrip.coordinates[0],
        startLng: homeTrip.coordinates[1],
        endLat: hoveredTrip.coordinates[0],
        endLng: hoveredTrip.coordinates[1],
      },
    ]
  }, [homeTrip, hoveredTrip])

  // Memoized callback props for Globe to prevent unnecessary re-renders
  const polygonCapColor = useCallback(
    (d: object) => (isCountryHovered(d) ? 'rgba(15, 118, 110, 0.2)' : 'rgba(0, 0, 0, 0)'),
    [isCountryHovered],
  )

  const polygonSideColor = useCallback(() => 'rgba(0, 0, 0, 0)', [])

  const polygonStrokeColor = useCallback(
    (d: object) => (isCountryHovered(d) ? 'rgba(15, 118, 110, 0.6)' : 'rgba(0, 0, 0, 0.1)'),
    [isCountryHovered],
  )

  const pointLat = useCallback((d: object) => (d as Trip).coordinates[0], [])
  const pointLng = useCallback((d: object) => (d as Trip).coordinates[1], [])

  const arcStartLat = useCallback((d: object) => (d as Arc).startLat, [])
  const arcStartLng = useCallback((d: object) => (d as Arc).startLng, [])
  const arcEndLat = useCallback((d: object) => (d as Arc).endLat, [])
  const arcEndLng = useCallback((d: object) => (d as Arc).endLng, [])
  const arcColor = useCallback(() => ['rgba(20, 184, 166, 0.9)', 'rgba(15, 118, 110, 0.4)'], [])

  const handlePointHover = useCallback((point: object | null) => {
    setHoveredTrip(point as Trip | null)
    if (containerRef.current) {
      containerRef.current.style.cursor = point ? 'pointer' : 'grab'
    }
  }, [])

  const handleGlobeReady = useCallback(() => setGlobeReady(true), [])

  return (
    <div className="w-full flex flex-col items-center justify-center my-12 relative z-0">
      {/* Globe container */}
      <div
        ref={containerRef}
        className="relative w-full max-w-[800px] aspect-square flex items-center justify-center"
      >
        <Globe
          ref={globeRef}
          width={dimensions.width}
          height={dimensions.height}
          backgroundColor="rgba(0,0,0,0)"
          // Day Earth texture (Blue Marble)
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          showGlobe={true}
          showAtmosphere={false}
          // Country Polygons (highlight on hover)
          polygonsData={countries}
          polygonCapColor={polygonCapColor}
          polygonSideColor={polygonSideColor}
          polygonStrokeColor={polygonStrokeColor}
          polygonAltitude={0.005}
          // Points Layer (clean circular markers)
          pointsData={trips}
          pointLat={pointLat}
          pointLng={pointLng}
          pointColor={getPointColor}
          pointRadius={getPointRadius}
          pointAltitude={0.01}
          pointsMerge={false}
          // Arcs Layer (streak from home to hovered location)
          arcsData={arcData}
          arcStartLat={arcStartLat}
          arcStartLng={arcStartLng}
          arcEndLat={arcEndLat}
          arcEndLng={arcEndLng}
          arcColor={arcColor}
          arcDashLength={0.5}
          arcDashGap={0.2}
          arcDashAnimateTime={1500}
          arcStroke={0.5}
          arcAltitudeAutoScale={0.3}
          // Hover interaction
          onPointHover={handlePointHover}
          // Globe events
          onGlobeReady={handleGlobeReady}
          onZoom={handleInteraction}
        />

        {/* Hover tooltip */}
        {hoveredTrip && (
          <div className="absolute bottom-4 right-4 z-50 animate-in fade-in duration-200">
            <BoardingPass trip={hoveredTrip} homeTrip={homeTrip} />
          </div>
        )}
      </div>
    </div>
  )
}

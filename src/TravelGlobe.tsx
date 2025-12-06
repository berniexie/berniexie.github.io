import { useEffect, useRef, useState, useCallback } from "react";
import Globe from "react-globe.gl";
import type { GlobeMethods } from "react-globe.gl";

interface Trip {
  city: string;
  country: string;
  coordinates: [number, number]; // [lat, lon]
  score: number;
  summary?: string;
}

interface TravelData {
  trips: Trip[];
}

export default function TravelGlobe() {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [hoveredTrip, setHoveredTrip] = useState<Trip | null>(null);
  const [globeReady, setGlobeReady] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 600, height: 600 });

  // Load travel data
  useEffect(() => {
    fetch("/travel.json")
      .then((res) => res.json())
      .then((data: TravelData) => {
        setTrips(data.trips);
      })
      .catch((err) => console.error("Failed to load travel data", err));
  }, []);

  // Handle resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const width = Math.min(containerRef.current.offsetWidth, 800);
        setDimensions({ width, height: width });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Setup globe controls when ready
  useEffect(() => {
    if (globeReady && globeRef.current) {
      globeRef.current.pointOfView({ lat: 20, lng: 0, altitude: 1.8 });
      
      const controls = globeRef.current.controls();
      if (controls) {
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.5;
        controls.enableZoom = true;
        controls.minDistance = 120;
        controls.maxDistance = 400;
        controls.enableDamping = true;
        controls.dampingFactor = 0.1;
      }
    }
  }, [globeReady]);

  // Stop auto-rotate on interaction
  const handleInteraction = useCallback(() => {
    if (globeRef.current) {
      const controls = globeRef.current.controls();
      if (controls) {
        controls.autoRotate = false;
      }
    }
  }, []);

  // Dynamic point color based on hover
  const getPointColor = useCallback((d: object) => {
    const trip = d as Trip;
    if (hoveredTrip?.city === trip.city) {
      return "#ffffff";
    }
    return "#a1a1aa"; // Gray
  }, [hoveredTrip]);

  // Dynamic point radius based on hover and score
  const getPointRadius = useCallback((d: object) => {
    const trip = d as Trip;
    if (hoveredTrip?.city === trip.city) {
      return 1.0;
    }
    return trip.score >= 9.0 ? 0.6 : 0.4;
  }, [hoveredTrip]);

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
          
          // Night Earth texture
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
          showGlobe={true}
          showAtmosphere={true}
          
          // Points Layer (clean circular markers)
          pointsData={trips}
          pointLat={(d) => (d as Trip).coordinates[0]}
          pointLng={(d) => (d as Trip).coordinates[1]}
          pointColor={getPointColor}
          pointRadius={getPointRadius}
          pointAltitude={0.01}
          pointsMerge={false}
          
          // Hover interaction
          onPointHover={(point) => {
            setHoveredTrip(point as Trip | null);
            if (containerRef.current) {
              containerRef.current.style.cursor = point ? "pointer" : "grab";
            }
          }}
          
          // Globe events
          onGlobeReady={() => setGlobeReady(true)}
          onZoom={handleInteraction}
          
          // Atmosphere glow
          atmosphereColor="rgba(255, 255, 255, 0.5)"
          atmosphereAltitude={0.12}
        />

        {/* Hover tooltip */}
        {hoveredTrip && (
          <div 
            className="absolute top-4 left-4 z-10 bg-black/90 backdrop-blur-md border border-white/20 px-4 py-3 rounded-lg shadow-lg animate-in fade-in duration-200 min-w-[200px]"
          >
            <div className="flex items-center justify-between gap-3 mb-2">
              <span className="font-display font-bold text-white text-lg tracking-wide">
                {hoveredTrip.city}
              </span>
              <span className="font-mono text-sm font-bold text-white bg-white/10 px-2 py-0.5 rounded">
                {hoveredTrip.score}
              </span>
            </div>
            <div className="text-gray-400 text-xs uppercase tracking-widest mb-2">
              {hoveredTrip.country}
            </div>
            {hoveredTrip.summary && (
              <p className="text-gray-300 text-xs leading-relaxed font-light border-t border-white/10 pt-2">
                {hoveredTrip.summary}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

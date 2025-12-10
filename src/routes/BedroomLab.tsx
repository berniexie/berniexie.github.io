import { useState, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid, Environment } from '@react-three/drei'
import {
  Room,
  Bed,
  Cat,
  GamingDesk,
  GamingChair,
  GolfBag,
  TennisEquipment,
  DrumKit,
  GolfIronLab,
} from '../components/bedroom'

type ComponentKey =
  | 'room'
  | 'bed'
  | 'cat'
  | 'gaming-desk'
  | 'gaming-chair'
  | 'golf-bag'
  | 'tennis'
  | 'drum-kit'
  | 'golf-iron-lab'

interface ComponentOption {
  key: ComponentKey
  label: string
  component: React.FC
}

const COMPONENT_OPTIONS: ComponentOption[] = [
  { key: 'golf-iron-lab', label: '🔬 Iron Lab', component: GolfIronLab },
  { key: 'room', label: 'Full Room', component: Room },
  { key: 'bed', label: 'Bed', component: Bed },
  { key: 'cat', label: 'Cat', component: Cat },
  { key: 'gaming-desk', label: 'Gaming Desk', component: GamingDesk },
  { key: 'gaming-chair', label: 'Gaming Chair', component: GamingChair },
  { key: 'golf-bag', label: 'Golf Set', component: GolfBag },
  { key: 'tennis', label: 'Tennis Equipment', component: TennisEquipment },
  { key: 'drum-kit', label: 'Drum Kit', component: DrumKit },
]

function LoadingFallback() {
  return (
    <mesh>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="#666" wireframe />
    </mesh>
  )
}

export default function BedroomLab() {
  const [selectedKey, setSelectedKey] = useState<ComponentKey>('golf-iron-lab')
  const [showGrid, setShowGrid] = useState(true)
  const [showAxes, setShowAxes] = useState(true)

  const selectedOption = COMPONENT_OPTIONS.find((opt) => opt.key === selectedKey)
  const SelectedComponent = selectedOption?.component || Room

  return (
    <div className="w-screen h-screen bg-zinc-900 flex">
      {/* Sidebar Controls */}
      <aside className="w-64 bg-zinc-800 border-r border-zinc-700 p-4 flex flex-col gap-4 overflow-y-auto">
        <header>
          <h1 className="text-xl font-bold text-white mb-1">🛠️ Bedroom Lab</h1>
          <p className="text-xs text-zinc-400">Dev viewer for 3D components</p>
        </header>

        {/* Component Selector */}
        <section>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Component
          </label>
          <select
            value={selectedKey}
            onChange={(e) => setSelectedKey(e.target.value as ComponentKey)}
            className="w-full bg-zinc-700 text-white border border-zinc-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {COMPONENT_OPTIONS.map((opt) => (
              <option key={opt.key} value={opt.key}>
                {opt.label}
              </option>
            ))}
          </select>
        </section>

        {/* Quick Select Buttons */}
        <section>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Quick Select
          </label>
          <div className="grid grid-cols-2 gap-2">
            {COMPONENT_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                onClick={() => setSelectedKey(opt.key)}
                className={`px-2 py-1.5 text-xs rounded-md transition-colors ${
                  selectedKey === opt.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </section>

        {/* Display Options */}
        <section>
          <label className="block text-sm font-medium text-zinc-300 mb-2">
            Display
          </label>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={showGrid}
                onChange={(e) => setShowGrid(e.target.checked)}
                className="rounded border-zinc-600 bg-zinc-700 text-blue-500 focus:ring-blue-500"
              />
              Show Grid
            </label>
            <label className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={showAxes}
                onChange={(e) => setShowAxes(e.target.checked)}
                className="rounded border-zinc-600 bg-zinc-700 text-blue-500 focus:ring-blue-500"
              />
              Show Axes
            </label>
          </div>
        </section>

        {/* Controls Help */}
        <section className="mt-auto pt-4 border-t border-zinc-700">
          <h2 className="text-sm font-medium text-zinc-300 mb-2">Controls</h2>
          <ul className="text-xs text-zinc-400 space-y-1">
            <li>🖱️ Left drag — Rotate</li>
            <li>🖱️ Right drag — Pan</li>
            <li>🖱️ Scroll — Zoom</li>
            <li>Double-click — Reset view</li>
          </ul>
        </section>

        {/* Back Link */}
        <a
          href="/"
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          ← Back to Portfolio
        </a>
      </aside>

      {/* 3D Canvas */}
      <main className="flex-1">
        <Canvas
          camera={{ position: [5, 5, 5], fov: 50 }}
          gl={{ antialias: true, alpha: false }}
          style={{ background: '#1a1a1a' }}
        >
          {/* Lighting */}
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow />
          <directionalLight position={[-5, 5, -5]} intensity={0.6} />
          <pointLight position={[0, 3, 0]} intensity={0.5} />

          {/* Environment for reflections */}
          <Environment preset="studio" />

          {/* Helpers */}
          {showGrid && (
            <Grid
              args={[20, 20]}
              cellSize={0.5}
              cellThickness={0.5}
              cellColor="#444"
              sectionSize={2}
              sectionThickness={1}
              sectionColor="#666"
              fadeDistance={25}
              fadeStrength={1}
              followCamera={false}
              infiniteGrid
            />
          )}
          {showAxes && <axesHelper args={[5]} />}

          {/* Selected Component */}
          <Suspense fallback={<LoadingFallback />}>
            <SelectedComponent />
          </Suspense>

          {/* Full Orbit Controls - unrestricted */}
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            minDistance={0.5}
            maxDistance={50}
            // No angle restrictions for full inspection
          />
        </Canvas>
      </main>
    </div>
  )
}


import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Room } from './bedroom'

export default function BedroomScene() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [4, 4, 5], fov: 55 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        {/* Lighting - brighter for visibility */}
        <ambientLight intensity={1.2} />
        <directionalLight position={[5, 8, 5]} intensity={1.5} castShadow />
        <directionalLight position={[-3, 5, 3]} intensity={0.8} />
        <pointLight position={[-2, 2, 2]} intensity={0.8} color="#ffeedd" />
        {/* Subtle blue accent light from monitor */}
        <pointLight position={[1.2, 1, -0.5]} intensity={0.4} color="#4a8aff" />
        {/* Fill light from front */}
        <pointLight position={[0, 3, 5]} intensity={0.6} color="#ffffff" />
        
        <Room />
        
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2.5}
          minAzimuthAngle={-Math.PI / 4}
          maxAzimuthAngle={Math.PI / 4}
        />
      </Canvas>
    </div>
  )
}

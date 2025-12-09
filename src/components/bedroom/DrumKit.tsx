import * as THREE from 'three'
import { COLORS } from './colors'

// Drum Kit
export function DrumKit() {
  return (
    // Corner opposite bed (Front-Right: X > 0, Z > 0)
    // Rotated 120 deg (2.1 rad) so stool faces bed (back-left)
    <group position={[1.5, 0, 1.5]} scale={1.3} rotation={[0, 4, 0]}>
      {/* Kick drum */}
      <group position={[0, 0.25, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh>
          <cylinderGeometry args={[0.28, 0.28, 0.35, 24]} />
          <meshStandardMaterial color={COLORS.drumShell} />
        </mesh>
        {/* Front head */}
        <mesh position={[0, 0.18, 0]}>
          <circleGeometry args={[0.27, 24]} />
          <meshStandardMaterial color={COLORS.drumHead} side={THREE.DoubleSide} />
        </mesh>
      </group>
      
      {/* Snare */}
      <group position={[-0.35, 0.55, 0.1]} rotation={[0.15, 0, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.08, 16]} />
          <meshStandardMaterial color={COLORS.drumShell} />
        </mesh>
        <mesh position={[0, 0.04, 0]}>
          <circleGeometry args={[0.1, 16]} />
          <meshStandardMaterial color={COLORS.drumHead} />
        </mesh>
        {/* Stand */}
        <mesh position={[0, -0.25, 0]}>
          <cylinderGeometry args={[0.01, 0.01, 0.4]} />
          <meshStandardMaterial color={COLORS.metal} />
        </mesh>
      </group>
      
      {/* Hi-tom */}
      <group position={[-0.15, 0.7, -0.15]} rotation={[0.3, 0, -0.1]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.07, 16]} />
          <meshStandardMaterial color={COLORS.drumShell} />
        </mesh>
        <mesh position={[0, 0.035, 0]}>
          <circleGeometry args={[0.08, 16]} />
          <meshStandardMaterial color={COLORS.drumHead} />
        </mesh>
      </group>
      
      {/* Mid-tom */}
      <group position={[0.15, 0.68, -0.15]} rotation={[0.3, 0, 0.1]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.09, 0.09, 0.08, 16]} />
          <meshStandardMaterial color={COLORS.drumShell} />
        </mesh>
        <mesh position={[0, 0.04, 0]}>
          <circleGeometry args={[0.09, 16]} />
          <meshStandardMaterial color={COLORS.drumHead} />
        </mesh>
      </group>
      
      {/* Floor tom */}
      <group position={[0.4, 0.35, 0.15]} rotation={[0.1, 0, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.12, 16]} />
          <meshStandardMaterial color={COLORS.drumShell} />
        </mesh>
        <mesh position={[0, 0.06, 0]}>
          <circleGeometry args={[0.12, 16]} />
          <meshStandardMaterial color={COLORS.drumHead} />
        </mesh>
        {/* Legs */}
        {[0, 2, 4].map((r) => (
          <mesh key={r} position={[Math.sin(r) * 0.1, -0.2, Math.cos(r) * 0.1]} rotation={[0.1, 0, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 0.25]} />
            <meshStandardMaterial color={COLORS.metal} />
          </mesh>
        ))}
      </group>
      
      {/* Hi-hat */}
      <group position={[-0.5, 0, 0.2]}>
        {/* Stand */}
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.01, 0.015, 0.8]} />
          <meshStandardMaterial color={COLORS.metal} />
        </mesh>
        {/* Bottom cymbal */}
        <mesh position={[0, 0.75, 0]}>
          <cylinderGeometry args={[0.12, 0.1, 0.01, 24]} />
          <meshStandardMaterial color={COLORS.cymbal} metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Top cymbal */}
        <mesh position={[0, 0.78, 0]}>
          <cylinderGeometry args={[0.12, 0.1, 0.01, 24]} />
          <meshStandardMaterial color={COLORS.cymbal} metalness={0.8} roughness={0.3} />
        </mesh>
      </group>
      
      {/* Crash cymbal */}
      <group position={[-0.35, 0, -0.35]}>
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.01, 0.01, 1]} />
          <meshStandardMaterial color={COLORS.metal} />
        </mesh>
        <mesh position={[0, 0.95, 0]} rotation={[0.15, 0, 0.1]}>
          <cylinderGeometry args={[0.15, 0.12, 0.01, 24]} />
          <meshStandardMaterial color={COLORS.cymbal} metalness={0.8} roughness={0.3} />
        </mesh>
      </group>
      
      {/* Ride cymbal */}
      <group position={[0.45, 0, -0.3]}>
        <mesh position={[0, 0.45, 0]}>
          <cylinderGeometry args={[0.01, 0.01, 0.9]} />
          <meshStandardMaterial color={COLORS.metal} />
        </mesh>
        <mesh position={[0, 0.85, 0]} rotation={[-0.1, 0, 0.05]}>
          <cylinderGeometry args={[0.18, 0.14, 0.012, 24]} />
          <meshStandardMaterial color={COLORS.cymbal} metalness={0.8} roughness={0.3} />
        </mesh>
      </group>
      
      {/* Drum throne (stool) */}
      <group position={[0, 0, 0.6]}>
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.06, 16]} />
          <meshStandardMaterial color={COLORS.chair} />
        </mesh>
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.35]} />
          <meshStandardMaterial color={COLORS.metal} />
        </mesh>
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 0.02, 3]} />
          <meshStandardMaterial color={COLORS.metal} />
        </mesh>
      </group>
    </group>
  )
}


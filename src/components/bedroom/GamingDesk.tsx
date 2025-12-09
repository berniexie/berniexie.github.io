import { RoundedBox } from '@react-three/drei'
import { COLORS } from './colors'

// Gaming Desk with Monitor
export function GamingDesk() {
  return (
    // Pushed against Back Wall (-2.5)
    // Z: -2.5 + 0.3 (half depth) = -2.2
    <group position={[1.2, 0, -2.2]}>
      {/* Desk surface */}
      <RoundedBox args={[1.2, 0.05, 0.6]} radius={0.01} position={[0, 0.7, 0]}>
        <meshStandardMaterial color={COLORS.desk} />
      </RoundedBox>
      {/* Desk legs */}
      <mesh position={[-0.5, 0.35, -0.2]}>
        <boxGeometry args={[0.05, 0.7, 0.05]} />
        <meshStandardMaterial color={COLORS.desk} />
      </mesh>
      <mesh position={[0.5, 0.35, -0.2]}>
        <boxGeometry args={[0.05, 0.7, 0.05]} />
        <meshStandardMaterial color={COLORS.desk} />
      </mesh>
      <mesh position={[-0.5, 0.35, 0.2]}>
        <boxGeometry args={[0.05, 0.7, 0.05]} />
        <meshStandardMaterial color={COLORS.desk} />
      </mesh>
      <mesh position={[0.5, 0.35, 0.2]}>
        <boxGeometry args={[0.05, 0.7, 0.05]} />
        <meshStandardMaterial color={COLORS.desk} />
      </mesh>
      
      {/* Monitor */}
      <group position={[0, 1.1, -0.1]}>
        {/* Screen */}
        <RoundedBox args={[0.7, 0.4, 0.03]} radius={0.01}>
          <meshStandardMaterial color={COLORS.monitor} />
        </RoundedBox>
        {/* Screen glow */}
        <mesh position={[0, 0, 0.02]}>
          <planeGeometry args={[0.65, 0.35]} />
          <meshStandardMaterial color={COLORS.monitorScreen} emissive={COLORS.monitorScreen} emissiveIntensity={0.3} />
        </mesh>
        {/* Monitor stand */}
        <mesh position={[0, -0.25, 0.05]}>
          <boxGeometry args={[0.05, 0.1, 0.05]} />
          <meshStandardMaterial color={COLORS.metal} />
        </mesh>
        <mesh position={[0, -0.32, 0.05]}>
          <boxGeometry args={[0.2, 0.02, 0.15]} />
          <meshStandardMaterial color={COLORS.metal} />
        </mesh>
      </group>
      
      {/* Keyboard */}
      <RoundedBox args={[0.35, 0.02, 0.12]} radius={0.005} position={[0, 0.74, 0.15]}>
        <meshStandardMaterial color={COLORS.monitor} />
      </RoundedBox>
      
      {/* Mouse */}
      <RoundedBox args={[0.05, 0.02, 0.08]} radius={0.01} position={[0.3, 0.74, 0.15]}>
        <meshStandardMaterial color={COLORS.monitor} />
      </RoundedBox>
      
      {/* RGB strip under desk */}
      <mesh position={[0, 0.68, 0.29]}>
        <boxGeometry args={[1.1, 0.01, 0.01]} />
        <meshStandardMaterial color="#4a8aff" emissive="#4a8aff" emissiveIntensity={0.5} />
      </mesh>
    </group>
  )
}


import { RoundedBox } from '@react-three/drei'
import { COLORS } from './colors'

// Gaming Chair
export function GamingChair() {
  return (
    // Adjusted to match new desk position
    // Z: Desk is at -2.2, Chair needs to be ~0.8 units back = -1.4
    <group position={[1.2, 0, -1.4]} rotation={[0, -0.2, 0]}>
      {/* Seat */}
      <RoundedBox args={[0.45, 0.08, 0.45]} radius={0.02} position={[0, 0.45, 0]}>
        <meshStandardMaterial color={COLORS.chair} />
      </RoundedBox>
      {/* Back */}
      <RoundedBox args={[0.45, 0.6, 0.08]} radius={0.02} position={[0, 0.75, -0.2]} rotation={[0.1, 0, 0]}>
        <meshStandardMaterial color={COLORS.chair} />
      </RoundedBox>
      {/* Accent stripe */}
      <mesh position={[0, 0.75, -0.16]} rotation={[0.1, 0, 0]}>
        <boxGeometry args={[0.08, 0.5, 0.02]} />
        <meshStandardMaterial color={COLORS.chairAccent} />
      </mesh>
      {/* Base */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.25]} />
        <meshStandardMaterial color={COLORS.metal} />
      </mesh>
      {/* Wheels base */}
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.03]} />
        <meshStandardMaterial color={COLORS.metal} />
      </mesh>
    </group>
  )
}


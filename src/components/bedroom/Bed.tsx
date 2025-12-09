import { RoundedBox } from '@react-three/drei'
import { COLORS } from './colors'
import { Cat } from './Cat'

// Bed component - 20% bigger
export function Bed() {
  const scale = 1.2
  return (
    // Pushed against Left Wall (-2.5) and Back Wall (-2.5)
    // Width: 1.4 * 1.2 = 1.68 -> Half = 0.84 -> X = -2.5 + 0.84 = -1.66
    // Length: 2.0 * 1.2 = 2.4 -> Half = 1.2 -> Z = -2.5 + 1.2 = -1.3
    <group position={[-1.66, 0, -1.3]} scale={scale}>
      {/* Bed frame */}
      <RoundedBox args={[1.4, 0.3, 2]} radius={0.02} position={[0, 0.15, 0]}>
        <meshStandardMaterial color={COLORS.bed} />
      </RoundedBox>
      {/* Mattress */}
      <RoundedBox args={[1.3, 0.2, 1.9]} radius={0.05} position={[0, 0.4, 0]}>
        <meshStandardMaterial color={COLORS.bedding} />
      </RoundedBox>
      {/* Pillow 1 */}
      <RoundedBox args={[0.5, 0.15, 0.35]} radius={0.05} position={[-0.3, 0.55, -0.7]}>
        <meshStandardMaterial color={COLORS.pillow} />
      </RoundedBox>
      {/* Pillow 2 */}
      <RoundedBox args={[0.5, 0.15, 0.35]} radius={0.05} position={[0.3, 0.55, -0.7]}>
        <meshStandardMaterial color={COLORS.pillow} />
      </RoundedBox>
      {/* Blanket */}
      <RoundedBox args={[1.2, 0.1, 1.2]} radius={0.03} position={[0, 0.52, 0.3]}>
        <meshStandardMaterial color={COLORS.bed} />
      </RoundedBox>
      {/* Headboard */}
      <RoundedBox args={[1.4, 0.8, 0.1]} radius={0.02} position={[0, 0.7, -0.95]}>
        <meshStandardMaterial color={COLORS.bed} />
      </RoundedBox>
      
      {/* Sleeping cat on the bed - bigger and front center */}
      <group scale={1.8} position={[0, 0.05, 0.3]}>
        <Cat />
      </group>
    </group>
  )
}


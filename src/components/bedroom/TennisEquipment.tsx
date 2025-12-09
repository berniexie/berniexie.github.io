import * as THREE from 'three'
import { COLORS } from './colors'

// Tennis Equipment
export function TennisEquipment() {
  return (
    // Against Left Wall
    <group position={[-2.2, 0, 0.8]}>
      {/* Tennis racket leaning against wall */}
      <group position={[0, 0.4, 0]} rotation={[0.2, 0.3, 0.1]}>
        {/* Handle */}
        <mesh position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.02, 0.025, 0.25]} />
          <meshStandardMaterial color={COLORS.racket} />
        </mesh>
        {/* Head frame */}
        <mesh position={[0, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.13, 0.015, 8, 24]} />
          <meshStandardMaterial color={COLORS.racket} />
        </mesh>
        {/* Strings (simplified) */}
        <mesh position={[0, 0.2, 0]}>
          <circleGeometry args={[0.11, 16]} />
          <meshStandardMaterial color="#444444" transparent opacity={0.3} side={THREE.DoubleSide} />
        </mesh>
      </group>
      
      {/* Tennis ball canisters */}
      {[0, 0.12, 0.24].map((offset, i) => (
        <group key={i} position={[0.3 + offset, 0.12, 0.1]}>
          {/* Canister */}
          <mesh>
            <cylinderGeometry args={[0.04, 0.04, 0.22, 12]} />
            <meshStandardMaterial color="#1a4a1a" />
          </mesh>
          {/* Lid */}
          <mesh position={[0, 0.12, 0]}>
            <cylinderGeometry args={[0.042, 0.042, 0.02, 12]} />
            <meshStandardMaterial color="#2a5a2a" />
          </mesh>
          {/* Ball peeking out */}
          {i === 1 && (
            <mesh position={[0, 0.15, 0]}>
              <sphereGeometry args={[0.032, 12, 12]} />
              <meshStandardMaterial color={COLORS.tennis} />
            </mesh>
          )}
        </group>
      ))}
    </group>
  )
}


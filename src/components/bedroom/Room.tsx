import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { COLORS, ROOM } from './colors'
import { Bed } from './Bed'
import { GamingDesk } from './GamingDesk'
import { GamingChair } from './GamingChair'
import { GolfBag } from './GolfSet'
import { TennisEquipment } from './TennisEquipment'
import { DrumKit } from './DrumKit'

// Floor - extends under walls to be flush with outer edges
function Floor() {
  // Floor size + 1 wall thickness to reach outer edge
  const width = ROOM.floorSize + ROOM.wallThickness
  const depth = ROOM.floorSize + ROOM.wallThickness
  
  return (
    // Shifted left and back by half wall thickness to align with outer wall edges
    <mesh position={[-ROOM.wallThickness / 2, -ROOM.floorThickness / 2, -ROOM.wallThickness / 2]}>
      <boxGeometry args={[width, ROOM.floorThickness, depth]} />
      <meshStandardMaterial color={COLORS.floor} />
    </mesh>
  )
}

// Walls - perfect corner with flush edges
function Walls() {
  const halfFloor = ROOM.floorSize / 2
  const halfWall = ROOM.wallThickness / 2
  
  return (
    <>
      {/* Back wall - sits behind floor, extends left to cover left wall */}
      {/* Width: Floor (5) + Wall Thickness (0.15) = 5.15 */}
      {/* Center X: Shifted left by half wall thickness to align right edge with floor */}
      <mesh position={[-halfWall, ROOM.wallHeight / 2, -(halfFloor + halfWall)]}>
        <boxGeometry args={[ROOM.floorSize + ROOM.wallThickness, ROOM.wallHeight, ROOM.wallThickness]} />
        <meshStandardMaterial color={COLORS.wall} />
      </mesh>
      
      {/* Left wall - sits left of floor, flush with front and back */}
      {/* Depth: Matches floor depth (5) exactly */}
      {/* Center Z: 0 to align with floor center */}
      <mesh position={[-(halfFloor + halfWall), ROOM.wallHeight / 2, 0]}>
        <boxGeometry args={[ROOM.wallThickness, ROOM.wallHeight, ROOM.floorSize]} />
        <meshStandardMaterial color={COLORS.wall} />
      </mesh>
    </>
  )
}

// The complete room that rotates
export function Room() {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (groupRef.current) {
      // Gentle floating rotation
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1 - 0.4
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05
    }
  })
  
  return (
    <group ref={groupRef} rotation={[0.3, -0.4, 0]} position={[0, -0.5, 0]} scale={0.85}>
      <Floor />
      <Walls />
      <Bed />
      <GamingDesk />
      <GamingChair />
      <GolfBag />
      <TennisEquipment />
      <DrumKit />
    </group>
  )
}


import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { CAT_COLORS } from './colors'

// Sleeping cat on the bed
export function Cat() {
  const catRef = useRef<THREE.Group>(null)
  
  // Subtle breathing animation
  useFrame((state) => {
    if (catRef.current) {
      const breathe = Math.sin(state.clock.elapsedTime * 2) * 0.008
      catRef.current.scale.y = 1 + breathe
    }
  })
  
  return (
    <group ref={catRef} position={[0.15, 0.3, 0.1]} scale={0.5} rotation={[0, 0.5, 0]}>
      {/* Body - curled up oval */}
      <mesh position={[0, 0.08, 0]} rotation={[0, 0, 0]}>
        <sphereGeometry args={[0.18, 16, 12]} />
        <meshStandardMaterial color={CAT_COLORS.orange} />
      </mesh>
      
      {/* White belly patch */}
      <mesh position={[0.08, 0.02, 0.08]} rotation={[0.3, 0.5, 0]}>
        <sphereGeometry args={[0.1, 12, 8]} />
        <meshStandardMaterial color={CAT_COLORS.white} />
      </mesh>
      
      {/* Head */}
      <group position={[-0.15, 0.12, 0.1]}>
        <mesh>
          <sphereGeometry args={[0.1, 12, 10]} />
          <meshStandardMaterial color={CAT_COLORS.orange} />
        </mesh>
        
        {/* White face patch */}
        <mesh position={[0.03, -0.02, 0.05]}>
          <sphereGeometry args={[0.06, 10, 8]} />
          <meshStandardMaterial color={CAT_COLORS.white} />
        </mesh>
        
        {/* Ears */}
        <mesh position={[-0.05, 0.08, -0.03]} rotation={[0.3, 0, -0.3]}>
          <coneGeometry args={[0.035, 0.06, 4]} />
          <meshStandardMaterial color={CAT_COLORS.orange} />
        </mesh>
        <mesh position={[0.02, 0.08, -0.03]} rotation={[0.3, 0, 0.3]}>
          <coneGeometry args={[0.035, 0.06, 4]} />
          <meshStandardMaterial color={CAT_COLORS.orange} />
        </mesh>
        
        {/* Inner ears (pink) */}
        <mesh position={[-0.05, 0.07, -0.01]} rotation={[0.3, 0, -0.3]}>
          <coneGeometry args={[0.02, 0.035, 4]} />
          <meshStandardMaterial color={CAT_COLORS.pink} />
        </mesh>
        <mesh position={[0.02, 0.07, -0.01]} rotation={[0.3, 0, 0.3]}>
          <coneGeometry args={[0.02, 0.035, 4]} />
          <meshStandardMaterial color={CAT_COLORS.pink} />
        </mesh>
        
        {/* Closed eyes (sleeping) */}
        <mesh position={[-0.02, 0, 0.085]} rotation={[0, 0, 0.1]}>
          <boxGeometry args={[0.03, 0.006, 0.005]} />
          <meshStandardMaterial color={CAT_COLORS.dark} />
        </mesh>
        <mesh position={[0.04, 0, 0.085]} rotation={[0, 0, -0.1]}>
          <boxGeometry args={[0.03, 0.006, 0.005]} />
          <meshStandardMaterial color={CAT_COLORS.dark} />
        </mesh>
        
        {/* Nose */}
        <mesh position={[0.01, -0.03, 0.095]}>
          <sphereGeometry args={[0.015, 8, 6]} />
          <meshStandardMaterial color={CAT_COLORS.pink} />
        </mesh>
      </group>
      
      {/* Tail curled around */}
      <mesh position={[0.2, 0.05, -0.05]} rotation={[0.5, 0.8, 0]}>
        <capsuleGeometry args={[0.025, 0.2, 4, 8]} />
        <meshStandardMaterial color={CAT_COLORS.orange} />
      </mesh>
      {/* Tail tip - white */}
      <mesh position={[0.28, 0.08, 0.08]} rotation={[0.8, 0.5, 0]}>
        <capsuleGeometry args={[0.022, 0.08, 4, 8]} />
        <meshStandardMaterial color={CAT_COLORS.white} />
      </mesh>
      
      {/* Front paws tucked under */}
      <mesh position={[-0.1, 0, 0.12]}>
        <sphereGeometry args={[0.035, 8, 6]} />
        <meshStandardMaterial color={CAT_COLORS.white} />
      </mesh>
      <mesh position={[-0.05, 0, 0.14]}>
        <sphereGeometry args={[0.035, 8, 6]} />
        <meshStandardMaterial color={CAT_COLORS.white} />
      </mesh>
    </group>
  )
}


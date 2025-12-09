import * as THREE from 'three'
import { GOLF_COLORS } from './colors'

// ============================================
// DETAILED GOLF SET - Clubs and Bag
// ============================================

// Reusable Club Shaft with Grip
interface ClubShaftProps {
  length: number
  isGraphite?: boolean
  gripLength?: number
}

function ClubShaft({ length, isGraphite = false, gripLength = 0.22 }: ClubShaftProps) {
  const shaftColor = isGraphite ? GOLF_COLORS.graphiteShaft : GOLF_COLORS.steelShaft
  const shaftRadius = isGraphite ? 0.006 : 0.005
  
  return (
    <group>
      {/* Main Shaft - tapered */}
      <mesh position={[0, length / 2, 0]}>
        <cylinderGeometry args={[shaftRadius * 0.8, shaftRadius, length, 12]} />
        <meshStandardMaterial color={shaftColor} metalness={isGraphite ? 0.3 : 0.8} roughness={isGraphite ? 0.6 : 0.3} />
      </mesh>
      
      {/* Grip - textured rubber */}
      <mesh position={[0, -gripLength / 2 + 0.02, 0]}>
        <cylinderGeometry args={[0.012, 0.011, gripLength, 8]} />
        <meshStandardMaterial color={GOLF_COLORS.grip} roughness={0.9} />
      </mesh>
      
      {/* Grip texture rings */}
      {[0.03, 0.06, 0.09, 0.12, 0.15].map((offset, i) => (
        <mesh key={i} position={[0, -offset, 0]}>
          <torusGeometry args={[0.0115, 0.001, 4, 16]} />
          <meshStandardMaterial color={GOLF_COLORS.gripTexture} />
        </mesh>
      ))}
      
      {/* Grip cap (butt end) */}
      <mesh position={[0, -gripLength + 0.02, 0]}>
        <sphereGeometry args={[0.012, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={GOLF_COLORS.grip} />
      </mesh>
    </group>
  )
}

// Driver Head - Large 460cc titanium style
function DriverHead() {
  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      {/* Hosel */}
      <mesh position={[0, -0.02, 0]}>
        <cylinderGeometry args={[0.008, 0.01, 0.04, 12]} />
        <meshStandardMaterial color={GOLF_COLORS.hosel} metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Ferrule */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.009, 0.008, 0.015, 12]} />
        <meshStandardMaterial color={GOLF_COLORS.ferrule} />
      </mesh>
      
      {/* Main head body - squished sphere for 460cc look */}
      <group position={[0.03, 0.02, 0]} rotation={[0, 0, -0.15]}>
        <mesh scale={[1, 0.6, 1.1]}>
          <sphereGeometry args={[0.055, 16, 16]} />
          <meshStandardMaterial color={GOLF_COLORS.driverHead} metalness={0.4} roughness={0.5} />
        </mesh>
        
        {/* Crown (top) - subtle bulge */}
        <mesh position={[0, 0.02, 0]} scale={[0.9, 0.3, 1]}>
          <sphereGeometry args={[0.05, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={GOLF_COLORS.driverHead} metalness={0.3} roughness={0.6} />
        </mesh>
        
        {/* Face - slightly convex, lighter color */}
        <mesh position={[-0.05, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <circleGeometry args={[0.04, 16]} />
          <meshStandardMaterial color={GOLF_COLORS.driverFace} metalness={0.6} roughness={0.4} />
        </mesh>
      </group>
    </group>
  )
}

// Fairway Wood Head - Smaller, lower profile
function FairwayWoodHead({ size = 1 }: { size?: number }) {
  return (
    <group rotation={[Math.PI / 2, 0, 0]} scale={size}>
      {/* Hosel */}
      <mesh position={[0, -0.015, 0]}>
        <cylinderGeometry args={[0.007, 0.009, 0.03, 12]} />
        <meshStandardMaterial color={GOLF_COLORS.hosel} metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Ferrule */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.008, 0.007, 0.012, 12]} />
        <meshStandardMaterial color={GOLF_COLORS.ferrule} />
      </mesh>
      
      {/* Head body - flatter than driver */}
      <group position={[0.02, 0.015, 0]} rotation={[0, 0, -0.1]}>
        <mesh scale={[1, 0.5, 1]}>
          <sphereGeometry args={[0.04, 14, 14]} />
          <meshStandardMaterial color={GOLF_COLORS.woodHead} metalness={0.5} roughness={0.4} />
        </mesh>
        
        {/* Face */}
        <mesh position={[-0.038, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <circleGeometry args={[0.028, 14]} />
          <meshStandardMaterial color={GOLF_COLORS.driverFace} metalness={0.6} roughness={0.4} />
        </mesh>
      </group>
    </group>
  )
}

// Iron Head - Detailed cavity back style
function IronHead({ loft = 0 }: { loft?: number }) {
  const loftAngle = 0.1 + loft * 0.03 // More loft = more angled face
  
  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      {/* Hosel - angled tube connecting to shaft */}
      <mesh position={[0.005, -0.01, 0]} rotation={[0, 0, 0.1]}>
        <cylinderGeometry args={[0.006, 0.007, 0.025, 10]} />
        <meshStandardMaterial color={GOLF_COLORS.ironChrome} metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Ferrule - black ring */}
      <mesh position={[0, 0.002, 0]}>
        <cylinderGeometry args={[0.007, 0.006, 0.01, 10]} />
        <meshStandardMaterial color={GOLF_COLORS.ferrule} />
      </mesh>
      
      {/* Ferrule chrome ring */}
      <mesh position={[0, 0.008, 0]}>
        <torusGeometry args={[0.0065, 0.001, 4, 12]} />
        <meshStandardMaterial color={GOLF_COLORS.ferruleRing} metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Main blade body */}
      <group position={[0.025, 0.015, 0]} rotation={[loftAngle, 0, -0.05]}>
        {/* Back of head - cavity back design */}
        <mesh>
          <boxGeometry args={[0.055, 0.008, 0.04]} />
          <meshStandardMaterial color={GOLF_COLORS.ironChrome} metalness={0.85} roughness={0.15} />
        </mesh>
        
        {/* Cavity (indent on back) */}
        <mesh position={[0.005, 0.003, 0]} scale={[0.7, 0.5, 0.7]}>
          <boxGeometry args={[0.04, 0.006, 0.03]} />
          <meshStandardMaterial color={GOLF_COLORS.ironFace} metalness={0.7} roughness={0.3} />
        </mesh>
        
        {/* Face - with subtle grooves suggested */}
        <mesh position={[-0.028, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <planeGeometry args={[0.035, 0.05]} />
          <meshStandardMaterial color={GOLF_COLORS.ironFace} metalness={0.7} roughness={0.25} side={THREE.DoubleSide} />
        </mesh>
        
        {/* Top line (thin edge) */}
        <mesh position={[0, 0, -0.022]}>
          <boxGeometry args={[0.055, 0.006, 0.003]} />
          <meshStandardMaterial color={GOLF_COLORS.ironChrome} metalness={0.9} roughness={0.1} />
        </mesh>
        
        {/* Sole (bottom) */}
        <mesh position={[0, -0.005, 0.01]}>
          <boxGeometry args={[0.05, 0.004, 0.025]} />
          <meshStandardMaterial color={GOLF_COLORS.ironChrome} metalness={0.85} roughness={0.2} />
        </mesh>
      </group>
    </group>
  )
}

// Putter Head - Mallet style with alignment aids
function PutterHead() {
  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      {/* Hosel - bent style */}
      <mesh position={[0.01, -0.015, 0]} rotation={[0, 0, 0.2]}>
        <cylinderGeometry args={[0.005, 0.006, 0.035, 10]} />
        <meshStandardMaterial color={GOLF_COLORS.putterSilver} metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Main mallet body */}
      <group position={[0.04, 0.01, 0]}>
        {/* Main body - rounded rectangle shape */}
        <mesh>
          <capsuleGeometry args={[0.02, 0.05, 4, 12]} />
          <meshStandardMaterial color={GOLF_COLORS.putterSilver} metalness={0.7} roughness={0.3} />
        </mesh>
        
        {/* Top surface with alignment line */}
        <mesh position={[0, 0.018, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.08, 0.04]} />
          <meshStandardMaterial color={GOLF_COLORS.putterSilver} metalness={0.6} roughness={0.4} />
        </mesh>
        
        {/* Alignment line - center */}
        <mesh position={[0, 0.019, 0]}>
          <boxGeometry args={[0.002, 0.001, 0.035]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        
        {/* Alignment dots */}
        <mesh position={[-0.02, 0.019, 0]}>
          <cylinderGeometry args={[0.003, 0.003, 0.001, 8]} />
          <meshStandardMaterial color="#ff0000" />
        </mesh>
        <mesh position={[0.02, 0.019, 0]}>
          <cylinderGeometry args={[0.003, 0.003, 0.001, 8]} />
          <meshStandardMaterial color="#ff0000" />
        </mesh>
        
        {/* Face insert - softer material */}
        <mesh position={[-0.045, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <planeGeometry args={[0.025, 0.07]} />
          <meshStandardMaterial color={GOLF_COLORS.putterInsert} roughness={0.8} />
        </mesh>
      </group>
    </group>
  )
}

// Complete Driver Club
function DriverClub({ position, rotation }: { position: [number, number, number], rotation: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      <ClubShaft length={0.65} isGraphite={true} gripLength={0.24} />
      <group position={[0, 0.65, 0]}>
        <DriverHead />
      </group>
    </group>
  )
}

// Complete Fairway Wood Club
function FairwayWoodClub({ position, rotation, size = 1 }: { position: [number, number, number], rotation: [number, number, number], size?: number }) {
  return (
    <group position={position} rotation={rotation}>
      <ClubShaft length={0.58} isGraphite={true} gripLength={0.22} />
      <group position={[0, 0.58, 0]}>
        <FairwayWoodHead size={size} />
      </group>
    </group>
  )
}

// Complete Iron Club
function IronClub({ position, rotation, loft = 0 }: { position: [number, number, number], rotation: [number, number, number], loft?: number }) {
  const length = 0.52 - loft * 0.015 // Higher lofts = shorter shafts
  return (
    <group position={position} rotation={rotation}>
      <ClubShaft length={length} isGraphite={false} gripLength={0.2} />
      <group position={[0, length, 0]}>
        <IronHead loft={loft} />
      </group>
    </group>
  )
}

// Complete Putter Club
function PutterClub({ position, rotation }: { position: [number, number, number], rotation: [number, number, number] }) {
  return (
    <group position={position} rotation={rotation}>
      <ClubShaft length={0.45} isGraphite={false} gripLength={0.25} />
      <group position={[0, 0.45, 0]}>
        <PutterHead />
      </group>
    </group>
  )
}

// Detailed Golf Bag Body
function GolfBagBody() {
  return (
    <group>
      {/* ===== BASE ===== */}
      {/* Molded plastic base */}
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.11, 0.12, 0.08, 16]} />
        <meshStandardMaterial color={GOLF_COLORS.bagMain} roughness={0.7} />
      </mesh>
      
      {/* Base rim */}
      <mesh position={[0, 0.08, 0]}>
        <torusGeometry args={[0.11, 0.008, 8, 24]} />
        <meshStandardMaterial color={GOLF_COLORS.bagTrim} />
      </mesh>
      
      {/* ===== MAIN BODY ===== */}
      {/* Lower section */}
      <mesh position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.12, 0.11, 0.32, 16]} />
        <meshStandardMaterial color={GOLF_COLORS.bagMain} roughness={0.8} />
      </mesh>
      
      {/* Mid section - slightly wider */}
      <mesh position={[0, 0.52, 0]}>
        <cylinderGeometry args={[0.13, 0.12, 0.16, 16]} />
        <meshStandardMaterial color={GOLF_COLORS.bagAccent} roughness={0.75} />
      </mesh>
      
      {/* Upper section */}
      <mesh position={[0, 0.72, 0]}>
        <cylinderGeometry args={[0.14, 0.13, 0.24, 16]} />
        <meshStandardMaterial color={GOLF_COLORS.bagMain} roughness={0.8} />
      </mesh>
      
      {/* ===== TOP CUFF ===== */}
      {/* Top opening rim */}
      <mesh position={[0, 0.86, 0]}>
        <cylinderGeometry args={[0.145, 0.14, 0.04, 16]} />
        <meshStandardMaterial color={GOLF_COLORS.bagTrim} roughness={0.6} />
      </mesh>
      
      {/* Divider wells (suggested by indents) */}
      {[0, 1.5, 3, 4.5].map((angle, i) => (
        <mesh key={i} position={[Math.cos(angle) * 0.07, 0.87, Math.sin(angle) * 0.07]}>
          <cylinderGeometry args={[0.035, 0.035, 0.03, 8]} />
          <meshStandardMaterial color={GOLF_COLORS.bagPocket} roughness={0.9} />
        </mesh>
      ))}
      
      {/* ===== POCKETS ===== */}
      {/* Large side pocket (apparel) */}
      <group position={[0.1, 0.35, 0.04]}>
        <mesh>
          <capsuleGeometry args={[0.055, 0.28, 4, 12]} />
          <meshStandardMaterial color={GOLF_COLORS.bagPocket} roughness={0.85} />
        </mesh>
        {/* Zipper line */}
        <mesh position={[0.05, 0, 0]} rotation={[0, 0, 0.1]}>
          <boxGeometry args={[0.004, 0.3, 0.01]} />
          <meshStandardMaterial color={GOLF_COLORS.bagZipper} metalness={0.6} />
        </mesh>
        {/* Zipper pull */}
        <mesh position={[0.055, 0.1, 0]}>
          <boxGeometry args={[0.012, 0.02, 0.006]} />
          <meshStandardMaterial color={GOLF_COLORS.bagZipper} metalness={0.7} />
        </mesh>
      </group>
      
      {/* Front ball pocket */}
      <group position={[0, 0.22, 0.11]}>
        <mesh>
          <capsuleGeometry args={[0.045, 0.12, 4, 10]} />
          <meshStandardMaterial color={GOLF_COLORS.bagPocket} roughness={0.85} />
        </mesh>
        {/* Zipper */}
        <mesh position={[0, 0.06, 0.04]} rotation={[0.3, 0, 0]}>
          <boxGeometry args={[0.06, 0.003, 0.006]} />
          <meshStandardMaterial color={GOLF_COLORS.bagZipper} metalness={0.6} />
        </mesh>
      </group>
      
      {/* Small accessory pocket (top front) */}
      <group position={[0.02, 0.65, 0.12]}>
        <mesh>
          <capsuleGeometry args={[0.03, 0.08, 4, 8]} />
          <meshStandardMaterial color={GOLF_COLORS.bagAccent} roughness={0.8} />
        </mesh>
      </group>
      
      {/* Valuables pocket (side) */}
      <group position={[-0.1, 0.55, 0.06]} rotation={[0, 0.3, 0]}>
        <mesh>
          <boxGeometry args={[0.06, 0.1, 0.03]} />
          <meshStandardMaterial color={GOLF_COLORS.bagPocket} roughness={0.85} />
        </mesh>
      </group>
      
      {/* ===== STAND MECHANISM ===== */}
      {/* Stand housing */}
      <mesh position={[-0.08, 0.15, -0.06]} rotation={[0.2, 0.5, 0]}>
        <boxGeometry args={[0.04, 0.12, 0.03]} />
        <meshStandardMaterial color={GOLF_COLORS.bagStand} roughness={0.6} />
      </mesh>
      
      {/* Stand legs (deployed) */}
      <group position={[-0.08, 0.1, -0.08]}>
        {/* Leg 1 */}
        <mesh position={[-0.12, -0.03, 0.08]} rotation={[0.3, 0.8, 0.5]}>
          <cylinderGeometry args={[0.008, 0.006, 0.35, 8]} />
          <meshStandardMaterial color={GOLF_COLORS.bagStand} roughness={0.5} />
        </mesh>
        {/* Foot 1 */}
        <mesh position={[-0.22, -0.18, 0.2]}>
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshStandardMaterial color={GOLF_COLORS.bagMain} roughness={0.7} />
        </mesh>
        
        {/* Leg 2 */}
        <mesh position={[0.08, -0.03, 0.12]} rotation={[0.4, -0.6, -0.4]}>
          <cylinderGeometry args={[0.008, 0.006, 0.35, 8]} />
          <meshStandardMaterial color={GOLF_COLORS.bagStand} roughness={0.5} />
        </mesh>
        {/* Foot 2 */}
        <mesh position={[0.22, -0.18, 0.28]}>
          <sphereGeometry args={[0.015, 8, 8]} />
          <meshStandardMaterial color={GOLF_COLORS.bagMain} roughness={0.7} />
        </mesh>
      </group>
      
      {/* ===== STRAPS & HANDLE ===== */}
      {/* Carry handle (top) */}
      <mesh position={[0, 0.9, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.06, 0.012, 6, 12, Math.PI]} />
        <meshStandardMaterial color={GOLF_COLORS.bagStrap} roughness={0.8} />
      </mesh>
      
      {/* Main carry strap */}
      <group position={[-0.12, 0.5, -0.02]}>
        <mesh rotation={[0, 0, 0.15]}>
          <boxGeometry args={[0.015, 0.55, 0.05]} />
          <meshStandardMaterial color={GOLF_COLORS.bagStrap} roughness={0.85} />
        </mesh>
        {/* Padding */}
        <mesh position={[0, 0.1, 0]} rotation={[0, 0, 0.15]}>
          <boxGeometry args={[0.025, 0.18, 0.06]} />
          <meshStandardMaterial color={GOLF_COLORS.bagAccent} roughness={0.9} />
        </mesh>
      </group>
      
      {/* Secondary strap */}
      <mesh position={[-0.1, 0.35, 0.04]} rotation={[0.1, 0.2, 0.2]}>
        <boxGeometry args={[0.012, 0.25, 0.04]} />
        <meshStandardMaterial color={GOLF_COLORS.bagStrap} roughness={0.85} />
      </mesh>
      
      {/* ===== DETAILS ===== */}
      {/* Towel ring */}
      <mesh position={[0.12, 0.6, 0.02]}>
        <torusGeometry args={[0.02, 0.004, 6, 12]} />
        <meshStandardMaterial color={GOLF_COLORS.bagZipper} metalness={0.7} />
      </mesh>
      
      {/* Glove holder / clip */}
      <mesh position={[0.08, 0.75, 0.1]}>
        <boxGeometry args={[0.015, 0.025, 0.008]} />
        <meshStandardMaterial color={GOLF_COLORS.bagZipper} metalness={0.6} />
      </mesh>
    </group>
  )
}

// Complete Golf Set Assembly
export function GolfBag() {
  return (
    <group position={[-2.2, 0, 2]} rotation={[0, 0.5, 0]}>
      {/* The Bag */}
      <GolfBagBody />
      
      {/* ===== CLUBS IN BAG ===== */}
      {/* Driver - back left */}
      <DriverClub 
        position={[-0.04, 0.85, -0.06]} 
        rotation={[0.15, 0.3, -0.05]} 
      />
      
      {/* 3 Wood - back right */}
      <FairwayWoodClub 
        position={[0.04, 0.85, -0.05]} 
        rotation={[0.12, -0.2, 0.08]} 
        size={0.9}
      />
      
      {/* 5 Wood - back center */}
      <FairwayWoodClub 
        position={[0, 0.85, -0.08]} 
        rotation={[0.18, 0.1, 0]} 
        size={0.8}
      />
      
      {/* Irons: 4, 5, 6, 7, 8, 9, PW */}
      <IronClub position={[-0.06, 0.85, 0.02]} rotation={[0.1, 0.4, -0.03]} loft={0} />
      <IronClub position={[-0.03, 0.85, 0.03]} rotation={[0.08, 0.2, -0.01]} loft={1} />
      <IronClub position={[0, 0.85, 0.04]} rotation={[0.1, 0, 0.02]} loft={2} />
      <IronClub position={[0.03, 0.85, 0.04]} rotation={[0.09, -0.15, 0.04]} loft={3} />
      <IronClub position={[0.06, 0.85, 0.03]} rotation={[0.11, -0.3, 0.02]} loft={4} />
      <IronClub position={[0.08, 0.85, 0.02]} rotation={[0.08, -0.4, 0.05]} loft={5} />
      <IronClub position={[0.05, 0.85, 0.06]} rotation={[0.12, -0.25, 0.03]} loft={6} />
      
      {/* Putter - front center, shorter */}
      <PutterClub 
        position={[0, 0.85, 0.08]} 
        rotation={[0.05, 0, 0]} 
      />
    </group>
  )
}


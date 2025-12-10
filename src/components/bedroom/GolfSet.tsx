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

// Detailed Golf Bag Body - Refactored for sleek modern look
function GolfBagBody() {
  return (
    <group>
      {/* Main Bag Hull - Continuous sleek shape */}
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.13, 0.11, 0.85, 32]} />
        <meshStandardMaterial color={GOLF_COLORS.bagMain} roughness={0.5} />
      </mesh>
      
      {/* Base */}
      <mesh position={[0, 0.04, 0]}>
        <cylinderGeometry args={[0.115, 0.115, 0.08, 32]} />
        <meshStandardMaterial color={GOLF_COLORS.bagAccent} roughness={0.6} />
      </mesh>

      {/* Top Cuff - angled for modern look */}
      <group position={[0, 0.88, 0]} rotation={[0.1, 0, 0]}> 
        <mesh>
          <cylinderGeometry args={[0.14, 0.135, 0.08, 32]} />
          <meshStandardMaterial color={GOLF_COLORS.bagTrim} roughness={0.5} />
        </mesh>
        {/* Interior */}
        <mesh position={[0, 0.02, 0]}>
           <cylinderGeometry args={[0.13, 0.13, 0.02, 32]} />
           <meshStandardMaterial color="#0a0a0a" />
        </mesh>
      </group>

      {/* Large Side Pocket (Right) - Sleek integration */}
      <group position={[0.1, 0.4, 0.04]} rotation={[0, 0, -0.05]}>
         <mesh>
            <capsuleGeometry args={[0.06, 0.45, 4, 16]} />
            <meshStandardMaterial color={GOLF_COLORS.bagMain} roughness={0.5} />
         </mesh>
         {/* Flush Zipper */}
         <mesh position={[0.055, 0, 0.02]} rotation={[0, 0, 0.1]}>
            <boxGeometry args={[0.003, 0.4, 0.005]} />
            <meshStandardMaterial color="#333" />
         </mesh>
      </group>

      {/* Ball Pocket (Front) */}
      <group position={[0, 0.25, 0.12]} rotation={[0.1, 0, 0]}>
         <mesh>
            <capsuleGeometry args={[0.05, 0.15, 4, 16]} />
            <meshStandardMaterial color={GOLF_COLORS.bagPocket} roughness={0.6} />
         </mesh>
      </group>
      
      {/* Upper Accessory Pocket */}
      <group position={[0, 0.65, 0.13]} rotation={[0.05, 0, 0]}>
         <mesh>
            <capsuleGeometry args={[0.04, 0.1, 4, 16]} />
            <meshStandardMaterial color={GOLF_COLORS.bagAccent} roughness={0.6} />
         </mesh>
      </group>

      {/* Spine / Handle Area (Back) */}
      <group position={[0, 0.5, -0.12]}>
         {/* Spine ridge */}
         <mesh>
             <boxGeometry args={[0.06, 0.75, 0.03]} />
             <meshStandardMaterial color={GOLF_COLORS.bagMain} roughness={0.6} />
         </mesh>
         {/* Top Handle - Modern Loop */}
         <mesh position={[0, 0.42, 0.02]} rotation={[Math.PI/3, 0, 0]}>
             <torusGeometry args={[0.035, 0.008, 8, 16, Math.PI]} />
             <meshStandardMaterial color={GOLF_COLORS.bagTrim} />
         </mesh>
      </group>

      {/* Stand Legs - Deployed, attached to back of bag */}
      <group position={[0, 0.65, -0.13]}>
         {/* Leg Hub - attaches to spine */}
         <mesh rotation={[0, 0, Math.PI/2]}>
             <cylinderGeometry args={[0.012, 0.012, 0.1, 12]} />
             <meshStandardMaterial color={GOLF_COLORS.bagStand} />
         </mesh>
         
         {/* Left Leg - pivots from hub, extends down and out */}
         <group position={[-0.05, 0, 0]}>
             <mesh position={[-0.15, -0.32, 0.08]} rotation={[0.15, 0, -0.45]}>
                 <cylinderGeometry args={[0.006, 0.005, 0.7, 8]} />
                 <meshStandardMaterial color={GOLF_COLORS.bagStand} metalness={0.4} roughness={0.6} />
             </mesh>
             {/* Foot */}
             <mesh position={[-0.38, -0.58, 0.12]}>
                 <sphereGeometry args={[0.012, 8, 8]} />
                 <meshStandardMaterial color={GOLF_COLORS.bagStand} />
             </mesh>
         </group>
         
         {/* Right Leg - pivots from hub, extends down and out */}
         <group position={[0.05, 0, 0]}>
             <mesh position={[0.15, -0.32, 0.08]} rotation={[0.15, 0, 0.45]}>
                 <cylinderGeometry args={[0.006, 0.005, 0.7, 8]} />
                 <meshStandardMaterial color={GOLF_COLORS.bagStand} metalness={0.4} roughness={0.6} />
             </mesh>
             {/* Foot */}
             <mesh position={[0.38, -0.58, 0.12]}>
                 <sphereGeometry args={[0.012, 8, 8]} />
                 <meshStandardMaterial color={GOLF_COLORS.bagStand} />
             </mesh>
         </group>
      </group>
    </group>
  )
}

// Complete Golf Set Assembly
export function GolfBag(props: any) {
  return (
    <group {...props}>
      {/* Tilt backward so bag leans on stand legs */}
      <group rotation={[-0.25, 0, 0]} position={[0, 0.08, -0.12]}>
        {/* The Bag */}
        <GolfBagBody />
        
        {/* ===== CLUBS IN BAG ===== */}
        {/* Driver - back left */}
        <DriverClub 
          position={[-0.04, 0.88, -0.06]} 
          rotation={[0.15, 0.3, -0.05]} 
        />
        
        {/* 3 Wood - back right */}
        <FairwayWoodClub 
          position={[0.04, 0.88, -0.05]} 
          rotation={[0.12, -0.2, 0.08]} 
          size={0.9}
        />
        
        {/* Irons: 4 irons selected for set */}
        <IronClub position={[-0.06, 0.88, 0.02]} rotation={[0.1, 0.4, -0.03]} loft={0} />
        <IronClub position={[0, 0.88, 0.04]} rotation={[0.1, 0, 0.02]} loft={2} />
        <IronClub position={[0.06, 0.88, 0.03]} rotation={[0.11, -0.3, 0.02]} loft={4} />
        <IronClub position={[0.05, 0.88, 0.06]} rotation={[0.12, -0.25, 0.03]} loft={6} />
        
        {/* Putter - front center, shorter */}
        <PutterClub 
          position={[0, 0.86, 0.1]} 
          rotation={[0.05, 0, 0]} 
        />
      </group>
    </group>
  )
}


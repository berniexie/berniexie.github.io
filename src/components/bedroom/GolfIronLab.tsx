// Golf Iron Lab - Build your iron from scratch here!
// 
// SCALE: 1 unit ≈ 25cm (so a 4-unit club = 1 meter)
// 
// COORDINATE SYSTEM:
//   Y = up/down (club stands upright along Y)
//   X = left/right  
//   Z = forward/backward (toward you)
//
// CLUB STRUCTURE (bottom to top):
//   - Grip: y = 0 to 1 (25cm)
//   - Shaft: y = 1 to 4 (75cm) 
//   - Head: y = 4+ (at the top)

import * as THREE from 'three'
import { useMemo } from 'react'

export function GolfIronLab() {
  
  // Create the custom shape for the club head
  const clubHeadShape = useMemo(() => {
    const shape = new THREE.Shape();
    
    // Drawing the profile of the iron (looking from face on)
    // 0,0 is where the hosel meets the head
    
    const width = 0.35;
    const heightToe = 0.20;
    const heightHeel = 0.12;
    
    shape.moveTo(0, 0); // Start at heel bottom
    
    // Bottom edge (sole)
    shape.lineTo(width * 0.7, 0); 
    
    // Toe (rounded corner) - bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)
    shape.bezierCurveTo(
      width, 0,           // control point 1
      width, heightToe * 0.5, // control point 2
      width * 0.95, heightToe // end point (top of toe)
    );
    
    // Top line
    shape.lineTo(0.05, heightHeel); // Angle down towards heel
    
    // Heel curve back to start
    shape.bezierCurveTo(
      0, heightHeel * 0.5, 
      -0.02, 0.05, 
      0, 0
    );
    
    return shape;
  }, []);

  const extrudeSettings = {
    steps: 1,
    depth: 0.03, // Thickness of the blade
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02,
    bevelSegments: 3
  };

  return (
    <group>
      {/* === GRIP (bottom) === */}
      {/* Rubber grip - thicker cylinder at the bottom */}
      <mesh 
        // position={[x, y, z]} - where to place the center of this mesh
        position={[0, 0.5, 0]}  // centered at y=0.5 (so bottom is at y=0, top at y=1)
      >
        <cylinderGeometry 
          args={[
            0.035,   // radiusTop - radius at the top of cylinder
            0.045,  // radiusBottom - radius at bottom (slightly smaller = tapered)
            1,      // height - how tall the cylinder is
            32      // radialSegments - smoothness (more = rounder, 8=octagon, 32=very smooth)
          ]} 
        />
        <meshStandardMaterial 
          color="#1a1a1a"    // color - hex color code (dark grey/black)
          roughness={0.95}   // roughness - 0=mirror/shiny, 1=matte/rough (rubber is rough)
          // metalness not set = defaults to 0 (non-metal, like rubber)
        />
      </mesh>
      
      {/* === SHAFT (middle) === */}
      {/* Steel shaft - thin cylinder, slightly tapered */}
      <mesh 
        position={[0, 2.5, 0]}  // centered at y=2.5 (bottom at y=1, top at y=4)
      >
        <cylinderGeometry 
          args={[
            0.025,  // radiusTop - thinner at top (where head attaches)
            0.03,   // radiusBottom - slightly thicker at bottom (where grip is)
            3,      // height - 3 units tall (75cm in our scale)
            16      // radialSegments - smoothness
          ]} 
        />
        <meshStandardMaterial 
          color="#c0c0c0"     // color - light grey (steel color)
          metalness={0.85}    // metalness - 0=plastic, 1=pure metal (steel is very metallic)
          roughness={0.2}     // roughness - low = shiny/reflective (polished steel)
        />
      </mesh>
      
      {/* === CLUB HEAD (top) === */}
      {/* 
        The head is complex, so we use a <group> to hold multiple parts together.
        Everything inside this group is positioned relative to the group's position.
      */}
      <group 
        position={[0, 4, 0]}  // place the whole head assembly at top of shaft
      >
        
        {/* --- HOSEL --- */}
        {/* The hosel is the small tube connecting shaft to blade */}
        <mesh 
          position={[0.01, 0.1, 0]}  // slightly above the group origin
          rotation={[0, 0, -0.1]}  // slight tilt (radians, ~6 degrees)
        >
          <cylinderGeometry 
            args={[
              0.03,   // radiusTop
              0.025,  // radiusBottom (matches shaft top)
              0.2,   // height - short connector piece
              16      // segments
            ]} 
          />
          <meshStandardMaterial 
            color="#888888"   // medium grey
            metalness={0.8}
            roughness={0.3}
          />
        </mesh>
        
        {/* --- CUSTOM BLADE SHAPE --- */}
        <mesh 
          position={[0.005, .20, 0.03]} // Offset from hosel
          rotation={[
            3.6,    // Loft angle (tilt back ~28 degrees)
            0,
            -0.3
          ]}
        >
          <extrudeGeometry args={[clubHeadShape, extrudeSettings]} />
          <meshStandardMaterial 
            color="#d0d0d0"   
            metalness={0.9}   
            roughness={0.15}  
          />
        </mesh>
        
      </group>
      
    </group>
  )
}

import React, { useRef, useState, useEffect, Suspense } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// ── UPGRADED REALISTIC EARTH-OBSERVATION SATELLITE ──
// Oriented so that local +Z points directly at the Earth (Nadir)
export const ProceduralSatellite: React.FC = () => {
  return (
    <group scale={1.8}>
      {/* 1. Main Spacecraft Bus (Hexagonal/Rectangular Aerospace Chassis) */}
      <mesh castShadow receiveShadow>
        {/* Main body elongated along Z (pointing to Earth) */}
        <boxGeometry args={[0.12, 0.12, 0.18]} />
        <meshStandardMaterial
          color="#f8fafc" // Clean white aerospace coating
          roughness={0.2}
          metalness={0.5}
        />
      </mesh>

      {/* Subtle structural paneling/lines on the bus */}
      <mesh>
        <boxGeometry args={[0.122, 0.122, 0.12]} />
        <meshStandardMaterial
          color="#e2e8f0"
          roughness={0.3}
          metalness={0.6}
          wireframe={true} // Creates a subtle structural grid effect
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* 2. Optical Imaging Sensor Payload (Mounted on +Z face, pointing directly at Earth) */}
      <group position={[0, 0, 0.1]}>
        {/* Primary Optical Telescope Housing */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.045, 0.045, 0.06, 32]} />
          <meshStandardMaterial
            color="#0f172a" // Dark carbon/metallic housing
            roughness={0.3}
            metalness={0.8}
          />
        </mesh>
        {/* Secondary Inner Baffle */}
        <mesh position={[0, 0, 0.031]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.038, 0.038, 0.005, 32]} />
          <meshStandardMaterial
            color="#1e293b"
            roughness={0.4}
            metalness={0.7}
          />
        </mesh>
        {/* Main Glass Lens Aperture (Reflective optical element) */}
        <mesh position={[0, 0, 0.034]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.032, 0.032, 0.002, 32]} />
          <meshStandardMaterial
            color="#020617" // Deep black glass
            roughness={0.02}
            metalness={1.0}
            envMapIntensity={2.0}
          />
        </mesh>
      </group>

      {/* 3. Star Trackers / Attitude Sensors (Small details on -Z face) */}
      <group position={[0, 0, -0.09]}>
        <mesh position={[0.03, 0.03, 0]} rotation={[0, 0, 0]}>
          <boxGeometry args={[0.02, 0.02, 0.02]} />
          <meshStandardMaterial color="#64748b" metalness={0.6} roughness={0.4} />
        </mesh>
        {/* High-gain communications dish (Pointing to space/relay) */}
        <mesh position={[-0.03, -0.02, -0.01]} rotation={[Math.PI, 0.2, 0]}>
          <cylinderGeometry args={[0.03, 0.005, 0.02, 16]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.3} />
        </mesh>
      </group>

      {/* 4. Left Solar Array Wing (Extending along -X) */}
      <group position={[-0.06, 0, 0]}>
        {/* Deployment Boom */}
        <mesh position={[-0.05, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.005, 0.005, 0.1, 8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Solar Panel Assembly */}
        <group position={[-0.22, 0, 0]}>
          {/* Backing Structure */}
          <mesh>
            <boxGeometry args={[0.26, 0.006, 0.14]} />
            <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.5} />
          </mesh>
          {/* Photovoltaic Cells (Deep Blue) */}
          <mesh position={[0, 0.0035, 0]}>
            <boxGeometry args={[0.25, 0.001, 0.13]} />
            <meshStandardMaterial color="#1e3a8a" roughness={0.15} metalness={0.7} />
          </mesh>
          {/* Cell Grid Lines */}
          <mesh position={[0, 0.0041, 0]}>
            <boxGeometry args={[0.25, 0.0005, 0.13]} />
            <meshStandardMaterial
              color="#3b82f6"
              roughness={0.3}
              metalness={0.8}
              wireframe={true}
              transparent
              opacity={0.4}
            />
          </mesh>
        </group>
      </group>

      {/* 5. Right Solar Array Wing (Extending along +X) */}
      <group position={[0.06, 0, 0]}>
        {/* Deployment Boom */}
        <mesh position={[0.05, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.005, 0.005, 0.1, 8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Solar Panel Assembly */}
        <group position={[0.22, 0, 0]}>
          {/* Backing Structure */}
          <mesh>
            <boxGeometry args={[0.26, 0.006, 0.14]} />
            <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.5} />
          </mesh>
          {/* Photovoltaic Cells (Deep Blue) */}
          <mesh position={[0, 0.0035, 0]}>
            <boxGeometry args={[0.25, 0.001, 0.13]} />
            <meshStandardMaterial color="#1e3a8a" roughness={0.15} metalness={0.7} />
          </mesh>
          {/* Cell Grid Lines */}
          <mesh position={[0, 0.0041, 0]}>
            <boxGeometry args={[0.25, 0.0005, 0.13]} />
            <meshStandardMaterial
              color="#3b82f6"
              roughness={0.3}
              metalness={0.8}
              wireframe={true}
              transparent
              opacity={0.4}
            />
          </mesh>
        </group>
      </group>

      {/* 6. Avionics Status Beacon (Subtle pulsing LED on +Y top) */}
      <mesh position={[0, 0.065, 0]}>
        <sphereGeometry args={[0.005, 12, 12]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#bfdbfe"
          emissiveIntensity={1.0}
        />
      </mesh>
    </group>
  );
};

// ── BLENDER GLB MODEL (HOT-SWAP) ──
const BlenderSatelliteModel: React.FC<{ url: string }> = ({ url }) => {
  const gltf = useGLTF(url);
  return <primitive object={gltf.scene} scale={0.15} />;
};

// ── MAIN SATELLITE MODEL ENTRY ──
export const SatelliteModel: React.FC = () => {
  const [hasCustomGLB, setHasCustomGLB] = useState<boolean>(false);
  const glbPath = '/models/satellite.glb';

  useEffect(() => {
    let isMounted = true;
    fetch(glbPath, { method: 'HEAD' })
      .then((res) => {
        const contentType = res.headers.get('content-type') || '';
        if (isMounted && res.ok && !contentType.includes('text/html')) {
          setHasCustomGLB(true);
        }
      })
      .catch(() => {
        if (isMounted) setHasCustomGLB(false);
      });

    return () => {
      isMounted = false;
    };
  }, [glbPath]);

  if (hasCustomGLB) {
    return (
      <Suspense fallback={<ProceduralSatellite />}>
        <BlenderSatelliteModel url={glbPath} />
      </Suspense>
    );
  }

  return <ProceduralSatellite />;
};

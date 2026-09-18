import React, { useRef, useState, useEffect, Suspense } from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// ── RECOGNIZABLE EARTH-OBSERVATION SATELLITE ──
// High-tech Earth remote-sensing satellite (chassis, solar wings, nadir optical camera, communications dish)
export const ProceduralSatellite: React.FC = () => {
  return (
    <group scale={1.2}>
      {/* 1. Main Satellite Bus (Deep metallic space titanium with gold thermal MLI foil) */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.08, 0.09, 0.13]} />
        <meshStandardMaterial
          color="#1e293b"
          roughness={0.25}
          metalness={0.85}
        />
      </mesh>

      {/* Gold Multi-Layer Insulation (MLI) Thermal Blanket Top Panel */}
      <mesh position={[0, 0.046, 0]}>
        <boxGeometry args={[0.075, 0.003, 0.12]} />
        <meshStandardMaterial
          color="#f59e0b"
          roughness={0.35}
          metalness={0.9}
        />
      </mesh>

      {/* 2. Multispectral Observation Camera Payload (Pointing down along nadir to Earth) */}
      {/* Positioned on the Earth-facing nadir side */}
      <group position={[0, -0.05, 0.02]} rotation={[Math.PI / 2, 0, 0]}>
        {/* Telescope Baffle Barrel */}
        <mesh>
          <cylinderGeometry args={[0.026, 0.03, 0.038, 24]} />
          <meshStandardMaterial
            color="#0f172a"
            metalness={0.92}
            roughness={0.18}
          />
        </mesh>
        {/* Optical Sensor Glass Aperture (Emits subtle cyan glow) */}
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.024, 0.024, 0.003, 24]} />
          <meshStandardMaterial
            color="#00f0ff"
            emissive="#00e5ff"
            emissiveIntensity={1.2}
            roughness={0.1}
            metalness={0.95}
          />
        </mesh>
      </group>

      {/* 3. Communications Parabolic Dish Antenna */}
      <group position={[0, 0.055, -0.04]} rotation={[-0.45, 0.35, 0]}>
        {/* Gimbal Mount Mast */}
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.004, 0.004, 0.032, 8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.85} roughness={0.25} />
        </mesh>
        {/* Parabolic Dish Reflector */}
        <mesh position={[0, 0.04, 0]} rotation={[Math.PI, 0, 0]}>
          <coneGeometry args={[0.04, 0.018, 24, 1, true]} />
          <meshStandardMaterial
            color="#e2e8f0"
            metalness={0.92}
            roughness={0.2}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Antenna Feed Horn */}
        <mesh position={[0, 0.048, 0]}>
          <cylinderGeometry args={[0.003, 0.003, 0.015, 8]} />
          <meshStandardMaterial color="#00e5ff" emissive="#00e5ff" emissiveIntensity={0.8} />
        </mesh>
      </group>

      {/* 4. Left Solar Array Wing */}
      <group position={[-0.04, 0, 0]}>
        {/* Carbon Fiber Array Yoke */}
        <mesh position={[-0.035, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.005, 0.005, 0.07, 8]} />
          <meshStandardMaterial color="#64748b" metalness={0.85} roughness={0.25} />
        </mesh>
        {/* Solar Panel Wing (Photovoltaic cells) */}
        <mesh position={[-0.16, 0, 0]}>
          <boxGeometry args={[0.2, 0.006, 0.085]} />
          <meshStandardMaterial
            color="#081c36"
            roughness={0.2}
            metalness={0.7}
          />
        </mesh>
        {/* Solar Cell Grid Detailing (Photovoltaic blue) */}
        <mesh position={[-0.16, 0.0035, 0]}>
          <boxGeometry args={[0.194, 0.001, 0.08]} />
          <meshStandardMaterial
            color="#0284c7"
            emissive="#0369a1"
            emissiveIntensity={0.3}
            roughness={0.15}
            metalness={0.85}
          />
        </mesh>
      </group>

      {/* 5. Right Solar Array Wing */}
      <group position={[0.04, 0, 0]}>
        {/* Carbon Fiber Array Yoke */}
        <mesh position={[0.035, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.005, 0.005, 0.07, 8]} />
          <meshStandardMaterial color="#64748b" metalness={0.85} roughness={0.25} />
        </mesh>
        {/* Solar Panel Wing */}
        <mesh position={[0.16, 0, 0]}>
          <boxGeometry args={[0.2, 0.006, 0.085]} />
          <meshStandardMaterial
            color="#081c36"
            roughness={0.2}
            metalness={0.7}
          />
        </mesh>
        {/* Solar Cell Grid Detailing */}
        <mesh position={[0.16, 0.0035, 0]}>
          <boxGeometry args={[0.194, 0.001, 0.08]} />
          <meshStandardMaterial
            color="#0284c7"
            emissive="#0369a1"
            emissiveIntensity={0.3}
            roughness={0.15}
            metalness={0.85}
          />
        </mesh>
      </group>

      {/* 6. Avionics Status LEDs & Emissive Beacons */}
      {/* Navigation Strobe Light */}
      <mesh position={[0, 0.048, 0.06]}>
        <sphereGeometry args={[0.008, 12, 12]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#00f0ff"
          emissiveIntensity={2.5}
        />
      </mesh>
      {/* Telemetry Status Beacon */}
      <mesh position={[0.035, 0.048, -0.06]}>
        <sphereGeometry args={[0.006, 12, 12]} />
        <meshStandardMaterial
          color="#10b981"
          emissive="#10b981"
          emissiveIntensity={2.0}
        />
      </mesh>
      {/* Subtle Blue Emissive Glow Aura */}
      <mesh>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshBasicMaterial
          color="#00d4ff"
          transparent
          opacity={0.06}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
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

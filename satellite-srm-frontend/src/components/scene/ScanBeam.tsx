import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ScanBeamProps {
  satellitePosition?: THREE.Vector3;
}

export const ScanBeam: React.FC<ScanBeamProps> = ({ satellitePosition }) => {
  const beamMeshRef = useRef<THREE.Mesh>(null);
  const targetRingRef = useRef<THREE.Group>(null);
  const targetDotRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!satellitePosition) return;

    // 1. Calculate ground intersection point on Earth surface (radius = 1.003)
    const groundPoint = satellitePosition.clone().normalize().multiplyScalar(1.003);
    const distance = satellitePosition.distanceTo(groundPoint);

    // 2. Position and orient the observation cone beam
    if (beamMeshRef.current) {
      const midPoint = satellitePosition.clone().add(groundPoint).multiplyScalar(0.5);
      beamMeshRef.current.position.copy(midPoint);
      beamMeshRef.current.scale.set(1, distance, 1);
      beamMeshRef.current.lookAt(satellitePosition);
      beamMeshRef.current.rotateX(Math.PI / 2);

      // Subtle opacity pulse (remote sensing sweep)
      const beamMat = beamMeshRef.current.material as THREE.MeshBasicMaterial;
      if (beamMat) {
        beamMat.opacity = 0.09 + Math.sin(clock.getElapsedTime() * 3.0) * 0.03;
      }
    }

    // 3. Position and pulse the ground target observation point
    if (targetRingRef.current) {
      targetRingRef.current.position.copy(groundPoint);
      targetRingRef.current.lookAt(satellitePosition);

      // Gentle, slow pulsing scale (1.0 to 1.25)
      const pulse = 1.0 + Math.sin(clock.getElapsedTime() * 2.5) * 0.18;
      targetRingRef.current.scale.set(pulse, pulse, pulse);
    }

    if (targetDotRef.current) {
      const dotMat = targetDotRef.current.material as THREE.MeshBasicMaterial;
      if (dotMat) {
        dotMat.opacity = 0.6 + Math.sin(clock.getElapsedTime() * 3.0) * 0.25;
      }
    }
  });

  return (
    <group>
      {/* Subtle Observation Swath Beam (Cylinder tapering toward satellite) */}
      <mesh ref={beamMeshRef}>
        <cylinderGeometry args={[0.015, 0.08, 1.0, 20, 1, true]} />
        <meshBasicMaterial
          color="#00f0ff"
          transparent
          opacity={0.09}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Ground Target Point on Earth Surface */}
      <group ref={targetRingRef}>
        {/* Outer scanning reticle ring */}
        <mesh>
          <ringGeometry args={[0.045, 0.055, 32]} />
          <meshBasicMaterial
            color="#00e5ff"
            transparent
            opacity={0.55}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Inner glowing pulse dot */}
        <mesh ref={targetDotRef}>
          <circleGeometry args={[0.022, 24]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.7}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Soft ground illumination halo */}
        <mesh position={[0, 0, -0.001]}>
          <circleGeometry args={[0.08, 24]} />
          <meshBasicMaterial
            color="#00d4ff"
            transparent
            opacity={0.18}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </group>
  );
};

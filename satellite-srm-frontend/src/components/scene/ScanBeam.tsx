import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ScanBeamProps {
  satellitePosition?: THREE.Vector3;
}

// ─────────────────────────────────────────────────────────────
// IMAGING SCAN CONE + FOOTPRINT
// Renders:
//  1. A narrow transparent cone from the optical sensor toward Earth.
//  2. A rectangular scan-footprint quad projected on the Earth surface.
//  3. Expanding concentric rings at the footprint center.
// ─────────────────────────────────────────────────────────────
export const ScanBeam: React.FC<ScanBeamProps> = ({ satellitePosition }) => {
  const coneRef = useRef<THREE.Mesh>(null);
  const coneGroupRef = useRef<THREE.Group>(null);

  const footprintRef = useRef<THREE.Mesh>(null);
  const footprintGroupRef = useRef<THREE.Group>(null);

  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);

  // Reusable objects
  const _up = useMemo(() => new THREE.Vector3(0, 1, 0), []);
  const _groundNorm = useMemo(() => new THREE.Vector3(), []);
  const _quat = useMemo(() => new THREE.Quaternion(), []);

  useFrame(({ clock }) => {
    if (!satellitePosition) return;

    const time = clock.getElapsedTime();
    const satPos = satellitePosition;

    // Ground point directly under the satellite (nadir)
    const groundPoint = satPos.clone().normalize().multiplyScalar(1.001);
    const distance = satPos.distanceTo(groundPoint);

    // ── CONE (from satellite down to Earth) ─────────────────
    if (coneGroupRef.current && coneRef.current) {
      // Midpoint between satellite and ground
      const mid = satPos.clone().add(groundPoint).multiplyScalar(0.5);
      coneGroupRef.current.position.copy(mid);

      // Orient so cone tip points toward satellite (+Y of cylinder = satellite)
      _groundNorm.copy(satPos).normalize();
      _quat.setFromUnitVectors(_up, _groundNorm);
      coneGroupRef.current.quaternion.copy(_quat);

      // Scale height to span the gap
      coneRef.current.scale.y = distance;

      // Gentle opacity pulse
      const mat = coneRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.08 + Math.sin(time * 1.2) * 0.03;
    }

    // ── FOOTPRINT QUAD (on Earth surface) ───────────────────
    if (footprintGroupRef.current) {
      footprintGroupRef.current.position.copy(groundPoint);

      // Orient the plane so it lies tangent to Earth's surface at groundPoint
      _groundNorm.copy(groundPoint).normalize();
      _quat.setFromUnitVectors(_up, _groundNorm);
      footprintGroupRef.current.quaternion.copy(_quat);

      // Subtle slow rotation to simulate swath scanning
      footprintGroupRef.current.rotateY(time * 0.04);
    }

    if (footprintRef.current) {
      // Pulsing footprint
      const mat = footprintRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.12 + Math.sin(time * 0.8) * 0.04;
    }

    // ── CONCENTRIC RINGS ─────────────────────────────────────
    if (ring1Ref.current && ring2Ref.current) {
      const p1 = (time % 2.0) / 2.0;
      const p2 = ((time + 1.0) % 2.0) / 2.0;

      ring1Ref.current.scale.setScalar(1.0 + p1 * 3.5);
      (ring1Ref.current.material as THREE.MeshBasicMaterial).opacity = 0.18 * (1 - p1);

      ring2Ref.current.scale.setScalar(1.0 + p2 * 3.5);
      (ring2Ref.current.material as THREE.MeshBasicMaterial).opacity = 0.12 * (1 - p2);
    }
  });

  return (
    <group>
      {/* ── SCAN CONE (satellite → Earth) ───────────────────── */}
      <group ref={coneGroupRef}>
        {/* Main cone: small tip at satellite, wide base at Earth */}
        <mesh ref={coneRef}>
          {/* args: topRadius, bottomRadius, height, segments, open */}
          <cylinderGeometry args={[0.006, 0.11, 1.0, 32, 1, true]} />
          <meshBasicMaterial
            color="#22d3ee"
            transparent
            opacity={0.1}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Edge lines of the cone — gives a precise angular look */}
        <mesh>
          <cylinderGeometry args={[0.006, 0.11, 1.0, 4, 1, true]} />
          <meshBasicMaterial
            color="#67e8f9"
            transparent
            opacity={0.35}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            wireframe
          />
        </mesh>
      </group>

      {/* ── FOOTPRINT (rectangular scanning quad on Earth) ───── */}
      <group ref={footprintGroupRef}>
        {/* Outer footprint rectangle */}
        <mesh ref={footprintRef} position={[0, 0.001, 0]}>
          <planeGeometry args={[0.20, 0.14]} />
          <meshBasicMaterial
            color="#0ea5e9"
            transparent
            opacity={0.14}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Footprint border lines */}
        <mesh position={[0, 0.002, 0]}>
          <planeGeometry args={[0.20, 0.14]} />
          <meshBasicMaterial
            color="#38bdf8"
            transparent
            opacity={0.5}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            wireframe
          />
        </mesh>

        {/* Inner scan-line grid (simulates pushbroom sensor rows) */}
        {[-0.04, 0, 0.04].map((x, i) => (
          <mesh key={i} position={[x, 0.002, 0]}>
            <planeGeometry args={[0.002, 0.14]} />
            <meshBasicMaterial
              color="#67e8f9"
              transparent
              opacity={0.3}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        ))}

        {/* Concentric expanding rings at footprint center */}
        <mesh ref={ring1Ref}>
          <ringGeometry args={[0.03, 0.036, 32]} />
          <meshBasicMaterial
            color="#22d3ee"
            transparent
            opacity={0.18}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh ref={ring2Ref}>
          <ringGeometry args={[0.05, 0.056, 32]} />
          <meshBasicMaterial
            color="#0ea5e9"
            transparent
            opacity={0.12}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Center crosshair dot */}
        <mesh position={[0, 0.003, 0]}>
          <circleGeometry args={[0.012, 16]} />
          <meshBasicMaterial
            color="#38bdf8"
            transparent
            opacity={0.4}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>
    </group>
  );
};

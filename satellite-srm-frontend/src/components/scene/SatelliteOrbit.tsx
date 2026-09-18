import React, { useMemo } from 'react';
import * as THREE from 'three';

interface SatelliteOrbitProps {
  orbitRadius?: number;
  eccentricity?: number;
  inclinationDeg?: number;
  rotationYDeg?: number;
  color?: string;
  opacity?: number;
}

export const SatelliteOrbit: React.FC<SatelliteOrbitProps> = ({
  orbitRadius = 1.72,
  eccentricity = 0.88,
  inclinationDeg = 45,
  rotationYDeg = 25,
  color = '#00d4ff',
  opacity = 0.22,
}) => {
  const a = orbitRadius;
  const b = orbitRadius * eccentricity;

  // Orbit plane orientation
  const orbitEuler = useMemo(() => {
    const incRad = (inclinationDeg * Math.PI) / 180;
    const rotYRad = (rotationYDeg * Math.PI) / 180;
    return new THREE.Euler(incRad, rotYRad, 0, 'YXZ');
  }, [inclinationDeg, rotationYDeg]);

  // Generate smooth elliptical curve points
  const geometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      const x = a * Math.cos(theta);
      const z = b * Math.sin(theta);
      const pt = new THREE.Vector3(x, 0, z).applyEuler(orbitEuler);
      points.push(pt);
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [a, b, orbitEuler]);

  return (
    <group>
      {/* Primary subtle thin orbit line */}
      {/* @ts-ignore - line is valid R3F intrinsic element */}
      <line geometry={geometry}>
        <lineBasicMaterial
          color={color}
          transparent
          opacity={opacity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      {/* @ts-ignore */}
      </line>

      {/* Secondary softer outer aura line */}
      {/* @ts-ignore */}
      <line geometry={geometry}>
        <lineBasicMaterial
          color="#3b82f6"
          transparent
          opacity={opacity * 0.45}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      {/* @ts-ignore */}
      </line>
    </group>
  );
};

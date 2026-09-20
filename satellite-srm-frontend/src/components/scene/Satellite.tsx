import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SatelliteModel } from './SatelliteModel';
import { SatelliteOrbit } from './SatelliteOrbit';
import { ScanBeam } from './ScanBeam';

// ── CONFIGURABLE ORBIT PARAMETERS ──
export const SATELLITE_ORBIT_RADIUS = 1.75;
export const SATELLITE_ORBIT_SPEED = 0.32;
export const SATELLITE_ORBIT_INCLINATION = 45; // degrees tilt relative to equatorial plane

export interface SatelliteProps {
  orbitRadius?: number;
  orbitSpeed?: number;
  orbitInclination?: number;
  eccentricity?: number;
  rotationYDeg?: number;
  showOrbitPath?: boolean;
  showScanBeam?: boolean;
}

export const Satellite: React.FC<SatelliteProps> = ({
  orbitRadius = SATELLITE_ORBIT_RADIUS,
  orbitSpeed = SATELLITE_ORBIT_SPEED,
  orbitInclination = SATELLITE_ORBIT_INCLINATION,
  eccentricity = 0.88,
  rotationYDeg = 25,
  showOrbitPath = true,
  showScanBeam = true,
}) => {
  const satelliteGroupRef = useRef<THREE.Group>(null);
  const [currentPosition, setCurrentPosition] = useState<THREE.Vector3>(
    new THREE.Vector3(orbitRadius, 0, 0)
  );

  const a = orbitRadius;
  const b = orbitRadius * eccentricity;

  // Euler rotation for orbital plane tilt
  const orbitEuler = useMemo(() => {
    const incRad = (orbitInclination * Math.PI) / 180;
    const rotYRad = (rotationYDeg * Math.PI) / 180;
    return new THREE.Euler(incRad, rotYRad, 0, 'YXZ');
  }, [orbitInclination, rotationYDeg]);

  useFrame(({ clock }) => {
    // Add an initial offset of ~2.5 radians to start the satellite in the top-left area
    // from the camera's perspective, avoiding initial overlap with the Earth.
    const timeOffset = 2.5; 
    const t = (clock.getElapsedTime() * orbitSpeed) + timeOffset;

    // 1. Calculate smooth elliptical position
    const x = a * Math.cos(t);
    const z = b * Math.sin(t);
    const pos = new THREE.Vector3(x, 0, z).applyEuler(orbitEuler);

    if (satelliteGroupRef.current) {
      satelliteGroupRef.current.position.copy(pos);

      // 2. Nadir pointing attitude control:
      // Spacecraft optical observation sensor continuously faces Earth center (0, 0, 0)
      satelliteGroupRef.current.lookAt(0, 0, 0);

      // Subtle, realistic gyroscope stabilization adjustment
      const gyroWobble = Math.sin(clock.getElapsedTime() * 0.5) * 0.03;
      satelliteGroupRef.current.rotateZ(gyroWobble);
    }

    // Update position for the scan beam & ground target
    setCurrentPosition(pos);
  });

  return (
    <group>
      {/* 1. Subtle Thin Glowing Orbital Path */}
      {showOrbitPath && (
        <SatelliteOrbit
          orbitRadius={orbitRadius}
          eccentricity={eccentricity}
          inclinationDeg={orbitInclination}
          rotationYDeg={rotationYDeg}
          color="#00d4ff"
          opacity={0.25}
        />
      )}

      {/* 2. Satellite Spacecraft Group */}
      <group ref={satelliteGroupRef}>
        <SatelliteModel />
      </group>

      {/* 3. Subtle Earth Observation Scan Beam & Pulsing Ground Target */}
      {showScanBeam && <ScanBeam satellitePosition={currentPosition} />}
    </group>
  );
};

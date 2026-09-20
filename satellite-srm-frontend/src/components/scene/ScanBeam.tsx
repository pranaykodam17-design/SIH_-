import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface ScanBeamProps {
  satellitePosition?: THREE.Vector3;
}

export const ScanBeam: React.FC<ScanBeamProps> = ({ satellitePosition }) => {
  const beamGroupRef = useRef<THREE.Group>(null);
  const mainBeamRef = useRef<THREE.Mesh>(null);
  const pulseBeamRef = useRef<THREE.Mesh>(null);
  
  const targetGroupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const groundGlowRef = useRef<THREE.Mesh>(null);

  // Particles for data flow
  const particleCount = 8;
  const particlesRef = useRef<THREE.InstancedMesh>(null);
  
  // Initialize random offsets for particles to stagger them
  const particleOffsets = useMemo(() => {
    return Array.from({ length: particleCount }, () => Math.random());
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ clock }, delta) => {
    if (!satellitePosition) return;

    const time = clock.getElapsedTime();
    const groundPoint = satellitePosition.clone().normalize().multiplyScalar(1.003);
    const distance = satellitePosition.distanceTo(groundPoint);
    const midPoint = satellitePosition.clone().add(groundPoint).multiplyScalar(0.5);

    // ── 1. BEAM POSITIONING ──
    if (beamGroupRef.current) {
      beamGroupRef.current.position.copy(midPoint);
      beamGroupRef.current.lookAt(satellitePosition);
      beamGroupRef.current.rotateX(Math.PI / 2);
    }

    if (mainBeamRef.current) {
      mainBeamRef.current.scale.set(1, distance, 1);
      const mat = mainBeamRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.08 + Math.sin(time * 2.0) * 0.02;
    }

    // ── 2. PULSE ANIMATION (4-second cycle) ──
    const cycle = 4.0;
    const cycleTime = time % cycle;
    const travelDuration = 1.5;
    
    // Traveling pulse down the beam
    if (pulseBeamRef.current) {
      if (cycleTime < travelDuration) {
        // Pulse traveling from satellite (top of cylinder) to ground (bottom)
        const progress = cycleTime / travelDuration;
        // Cylinder is centered at 0, top is +distance/2, bottom is -distance/2
        const yPos = (distance / 2) - (progress * distance);
        pulseBeamRef.current.position.set(0, yPos, 0);
        pulseBeamRef.current.scale.set(1.2, distance * 0.15, 1.2);
        pulseBeamRef.current.visible = true;
        
        const mat = pulseBeamRef.current.material as THREE.MeshBasicMaterial;
        // Fade out slightly as it reaches the ground
        mat.opacity = 0.4 * (1.0 - Math.pow(progress, 3));
      } else {
        pulseBeamRef.current.visible = false;
      }
    }

    // ── 3. DATA FLOW PARTICLES ──
    if (particlesRef.current) {
      for (let i = 0; i < particleCount; i++) {
        // Continuous movement down the beam
        let p = (time * 0.4 + particleOffsets[i]) % 1.0;
        
        // Position from satellite to ground
        const currentPos = new THREE.Vector3().lerpVectors(satellitePosition, groundPoint, p);
        dummy.position.copy(currentPos);
        
        // Scale pulses slightly
        const s = 0.5 + Math.sin(time * 5 + i) * 0.5;
        dummy.scale.set(s, s, s);
        
        // Orient particle to point down beam (if it were non-spherical)
        dummy.lookAt(groundPoint);
        dummy.updateMatrix();
        particlesRef.current.setMatrixAt(i, dummy.matrix);
      }
      particlesRef.current.instanceMatrix.needsUpdate = true;
    }

    // ── 4. EARTH ENHANCEMENT EFFECT (Ground Target) ──
    if (targetGroupRef.current) {
      targetGroupRef.current.position.copy(groundPoint);
      targetGroupRef.current.lookAt(satellitePosition);
    }

    // Enhancement triggers right after travelDuration
    const impactTime = cycleTime - travelDuration;
    const impactDuration = 2.0;

    if (impactTime > 0 && impactTime < impactDuration) {
      const progress = impactTime / impactDuration;
      // Easing out
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      if (ring1Ref.current && ring2Ref.current && groundGlowRef.current) {
        // Expanding concentric rings
        ring1Ref.current.scale.setScalar(1.0 + easeOut * 2.0);
        (ring1Ref.current.material as THREE.Material).opacity = 0.4 * (1 - progress);

        ring2Ref.current.scale.setScalar(1.0 + easeOut * 3.5);
        (ring2Ref.current.material as THREE.Material).opacity = 0.2 * (1 - progress);

        // Ground glow bloom
        groundGlowRef.current.scale.setScalar(1.0 + easeOut * 1.5);
        (groundGlowRef.current.material as THREE.Material).opacity = 0.3 * (1 - progress);
      }
    } else {
      // Resting state
      if (ring1Ref.current && ring2Ref.current && groundGlowRef.current) {
        ring1Ref.current.scale.setScalar(1.0);
        (ring1Ref.current.material as THREE.Material).opacity = 0.05;
        
        ring2Ref.current.scale.setScalar(1.0);
        (ring2Ref.current.material as THREE.Material).opacity = 0.02;

        groundGlowRef.current.scale.setScalar(1.0);
        (groundGlowRef.current.material as THREE.Material).opacity = 0.05;
      }
    }
  });

  return (
    <group>
      {/* ── BEAM GROUP ── */}
      <group ref={beamGroupRef}>
        {/* Main subtle observation swath */}
        <mesh ref={mainBeamRef}>
          <cylinderGeometry args={[0.015, 0.06, 1.0, 24, 1, true]} />
          <meshBasicMaterial
            color="#19B5FE" // Cyan
            transparent
            opacity={0.08}
            blending={THREE.NormalBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Traveling Enhancement Pulse */}
        <mesh ref={pulseBeamRef} visible={false}>
          <cylinderGeometry args={[0.02, 0.03, 1.0, 24, 1, true]} />
          <meshBasicMaterial
            color="#67E8F9" // Light cyan
            transparent
            opacity={0.4}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* ── CONTINUOUS DATA FLOW PARTICLES ── */}
      <instancedMesh ref={particlesRef} args={[undefined, undefined, particleCount]}>
        <sphereGeometry args={[0.003, 8, 8]} />
        <meshBasicMaterial
          color="#67E8F9"
          transparent
          opacity={0.6}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </instancedMesh>

      {/* ── EARTH ENHANCEMENT GROUND EFFECT ── */}
      <group ref={targetGroupRef}>
        {/* Inner Data Ring */}
        <mesh ref={ring1Ref}>
          <ringGeometry args={[0.035, 0.045, 32]} />
          <meshBasicMaterial
            color="#1677FF" // Primary blue
            transparent
            opacity={0.05}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Outer Data Ring */}
        <mesh ref={ring2Ref}>
          <ringGeometry args={[0.05, 0.055, 32]} />
          <meshBasicMaterial
            color="#19B5FE" // Cyan
            transparent
            opacity={0.02}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* Soft Radial Enhancement Glow on Earth Surface */}
        <mesh ref={groundGlowRef} position={[0, 0, -0.001]}>
          <circleGeometry args={[0.06, 32]} />
          <meshBasicMaterial
            color="#19B5FE"
            transparent
            opacity={0.05}
            blending={THREE.NormalBlending}
            depthWrite={false}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </group>
  );
};

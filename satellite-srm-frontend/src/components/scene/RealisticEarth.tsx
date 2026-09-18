import React, { useRef, Suspense, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { Atmosphere } from './Atmosphere';

// ── PHOTOREALISTIC EARTH WITH ENHANCED SATELLITE VISIBILITY ──
const PhotorealisticGlobe: React.FC = () => {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);

  // Load real NASA textures locally from public/textures/earth/
  const [dayMap, nightMap, cloudsMap, specularMap] = useTexture([
    '/textures/earth/earth_day.jpg',
    '/textures/earth/earth_night.jpg',
    '/textures/earth/earth_clouds.png',
    '/textures/earth/earth_specular.jpg',
  ]);

  useEffect(() => {
    dayMap.colorSpace = THREE.SRGBColorSpace;
    nightMap.colorSpace = THREE.SRGBColorSpace;
    dayMap.needsUpdate = true;
    nightMap.needsUpdate = true;
  }, [dayMap, nightMap]);

  useFrame((_, delta) => {
    // Smooth planetary rotation
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.025;
    }
    // Independent atmospheric cloud drift
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.033;
    }
  });

  return (
    <group rotation={[0.41, 0, 0.23] /* Realistic 23.4° axial tilt */}>
      {/* 1. Main Terrestrial Earth Globe (Vibrant continents, deep oceans, crisp city lights) */}
      <mesh ref={earthRef} castShadow receiveShadow>
        <sphereGeometry args={[1.0, 64, 64]} />
        <meshStandardMaterial
          map={dayMap}
          roughnessMap={specularMap}
          roughness={0.48} // Refined for clearer contrast and vivid land colors
          metalness={0.06}
          emissiveMap={nightMap}
          emissive="#ffe4b5" // Warm glowing metropolitan centers on night side
          emissiveIntensity={0.85} // Clear, noticeable city lights
        />
      </mesh>

      {/* 2. Real NASA Cloud Layer (Crisp, defined cloud patterns) */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[1.012, 64, 64]} />
        <meshStandardMaterial
          map={cloudsMap}
          transparent={true}
          opacity={0.62} // Increased visibility of realistic swirling weather patterns
          blending={THREE.NormalBlending}
          depthWrite={false}
          roughness={0.8}
        />
      </mesh>

      {/* 3. Soft Natural Blue Atmospheric Rim */}
      <Atmosphere radius={1.034} color="#3b8eed" intensity={1.2} />
    </group>
  );
};

// ── SAFE FALLBACK GLOBE (IF TEXTURES STILL LOADING) ──
const SimpleFallbackGlobe: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.03;
    }
  });

  return (
    <mesh ref={meshRef} rotation={[0.41, 0, 0.23]}>
      <sphereGeometry args={[1.0, 64, 64]} />
      <meshStandardMaterial
        color="#1b4d89"
        roughness={0.5}
        metalness={0.1}
      />
      <Atmosphere radius={1.034} color="#3b8eed" intensity={1.2} />
    </mesh>
  );
};

// ── BLENDER GLB EARTH (HOT-SWAP SUPPORT) ──
const BlenderEarthModel: React.FC<{ url: string }> = ({ url }) => {
  const gltf = useGLTF(url);
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.025;
    }
  });

  return (
    <group ref={groupRef} rotation={[0.41, 0, 0.23]}>
      <primitive object={gltf.scene} scale={1.0} />
      <Atmosphere radius={1.034} color="#3b8eed" intensity={1.2} />
    </group>
  );
};

// ── MAIN REALISTIC EARTH ENTRY ──
export const RealisticEarth: React.FC = () => {
  const [hasCustomGLB, setHasCustomGLB] = useState<boolean>(false);
  const glbPath = '/models/earth.glb';

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
      <Suspense fallback={<SimpleFallbackGlobe />}>
        <BlenderEarthModel url={glbPath} />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<SimpleFallbackGlobe />}>
      <PhotorealisticGlobe />
    </Suspense>
  );
};

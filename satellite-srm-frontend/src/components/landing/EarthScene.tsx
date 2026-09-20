import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { RealisticEarth } from '../scene/RealisticEarth';
import { Satellite } from '../scene/Satellite';
import { StarField } from '../scene/StarField';
import { ErrorBoundary } from '../scene/ErrorBoundary';
import { Satellite as SatelliteIcon } from 'lucide-react';

interface EarthSceneProps {
  interactive?: boolean;
  enableZoom?: boolean;
  autoRotateSpeed?: number;
  className?: string;
  showHint?: boolean;
  // Satellite configurations
  showSatellite?: boolean;
  satelliteOrbitRadius?: number;
  satelliteOrbitSpeed?: number;
  satelliteOrbitInclination?: number;
  showScanBeam?: boolean;
}

// ── ERROR-SAFE FALLBACK VISUAL ──
export const EarthVisualFallback: React.FC<{ message?: string }> = ({
  message = 'Earth Observation Simulation Active',
}) => (
  <div className="w-full h-full min-h-[380px] flex flex-col items-center justify-center p-6 text-center select-none relative overflow-hidden rounded-3xl bg-gradient-to-b from-srm-surface via-srm-base to-srm-elevated border border-cyan-500/25 backdrop-blur-xl shadow-[0_0_50px_rgba(0,212,255,0.08)]">
    <div className="absolute w-72 h-72 rounded-full border border-cyan-200 animate-ping opacity-20 pointer-events-none" />
    <div className="absolute w-96 h-96 rounded-full border border-blue-500/10 pointer-events-none" />

    {/* Center Earth Graphic Orb */}
    <div className="relative w-48 h-48 sm:w-60 sm:h-60 rounded-full bg-gradient-to-tr from-srm-surface via-srm-base to-srm-elevated border-2 border-cyan-200 shadow-[0_0_60px_rgba(0,212,255,0.35)] flex items-center justify-center mb-6 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#00e5ff18_1px,transparent_1px)] [background-size:12px_12px] opacity-70" />
      <div className="absolute inset-0 rounded-full shadow-[inset_0_0_30px_rgba(0,212,255,0.6)]" />
      <div className="absolute inset-0 rounded-full border border-cyan-200 border-dashed animate-spin-slow pointer-events-none" />

      {/* Orbiting Satellite Graphic */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-14 h-14 rounded-2xl bg-[#1677FF]/20 border border-cyan-200 flex items-center justify-center text-cyan-700 shadow-[0_0_20px_rgba(0,212,255,0.4)] mb-2">
          <SatelliteIcon size={28} className="animate-pulse" />
        </div>
        <span className="font-mono text-[11px] font-bold text-cyan-700 uppercase tracking-wider">
          TerraSR-1 Satellite
        </span>
      </div>
    </div>

    <div className="relative z-10 flex items-center gap-2 px-3 py-1 rounded-full bg-[#1677FF]/20 border border-cyan-400/30 text-xs font-mono text-cyan-700 mb-2">
      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
      <span>{message}</span>
    </div>

    <p className="relative z-10 text-xs text-[#526A82] max-w-xs leading-relaxed font-mono">
      AI multispectral super-resolution & orbital observation active.
    </p>
  </div>
);

export const EarthScene: React.FC<EarthSceneProps> = ({
  interactive = true,
  enableZoom = true,
  autoRotateSpeed = 0.5,
  className = 'w-full h-[520px] lg:h-[620px]',
  showHint = true,
  // Satellite configurations
  showSatellite = true,
  satelliteOrbitRadius = 1.75,
  satelliteOrbitSpeed = 0.32,
  satelliteOrbitInclination = 45,
  showScanBeam = true,
}) => {
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);
  const [isInteracting, setIsInteracting] = useState<boolean>(false);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl =
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
      }
    } catch {
      setHasWebGL(false);
    }
  }, []);

  if (!hasWebGL) {
    return (
      <div className={`relative ${className}`}>
        <EarthVisualFallback message="WebGL Mode (Fallback Display)" />
      </div>
    );
  }

  return (
    <div className={`relative ${className} select-none`}>
      {/* Subtle outer ambient space glow */}
      <div className="absolute inset-0 rounded-full bg-[#1677FF]/[0.04] blur-3xl pointer-events-none" />

      {/* ErrorBoundary wraps WebGL Canvas */}
      <ErrorBoundary fallback={<EarthVisualFallback />}>
        <Canvas
          camera={{ position: [0, 0.2, 3.8], fov: 42 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
          }}
          dpr={[1, 1.5]}
          className="w-full h-full cursor-grab active:cursor-grabbing"
          onPointerDown={() => setIsInteracting(true)}
          onPointerUp={() => setIsInteracting(false)}
        >
          {/* Deep Space Background Stars with subtle gentle movement */}
          <StarField count={2200} speed={0.6} />

          {/* ── ENHANCED DAYLIGHT ILLUMINATION ── */}
          {/* 1. Soft bright ambient illumination for daytime realism */}
          <ambientLight color="#ffffff" intensity={1.0} />

          {/* 2. Key Sun Directional Light (Crisp daylight hemisphere) */}
          <directionalLight
            position={[8.0, 4.0, 6.0]}
            intensity={2.5}
            color="#ffffff"
            castShadow
          />

          {/* 3. Soft Frontal Camera Fill Light */}
          <directionalLight
            position={[0, 2.0, 6]}
            intensity={0.8}
            color="#f0f9ff"
          />

          {/* 4. Natural Atmospheric Blue Rim Backlight */}
          <directionalLight
            position={[-6, 3, -5]}
            intensity={1.0}
            color="#7dd3fc"
          />

          {/* 5. Nadir Fill */}
          <directionalLight
            position={[0, -5, 2.0]}
            intensity={0.4}
            color="#e2e8f0"
          />

          <Suspense fallback={null}>
            {/* 1. Photorealistic NASA Earth (Continents, Oceans, Clouds, City Lights) */}
            <RealisticEarth />

            {/* 2. Recognizable 3D Satellite Spacecraft + Elliptical Orbit + Scanning Observation Beam */}
            {showSatellite && (
              <Satellite
                orbitRadius={satelliteOrbitRadius}
                orbitSpeed={satelliteOrbitSpeed}
                orbitInclination={satelliteOrbitInclination}
                showOrbitPath={true}
                showScanBeam={showScanBeam}
              />
            )}
          </Suspense>

          {interactive && (
            <OrbitControls
              enableRotate={true}
              autoRotate={!isInteracting}
              autoRotateSpeed={autoRotateSpeed}
              enableZoom={enableZoom}
              minDistance={2.2}
              maxDistance={6.0}
              enablePan={false}
              enableDamping={true}
              dampingFactor={0.06}
              rotateSpeed={0.8}
            />
          )}
        </Canvas>
      </ErrorBoundary>

      {/* Interactive Control Pill Hint */}
      {showHint && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur-md border border-[#D7E6F4] text-xs text-[#425873] pointer-events-none shadow-lg shadow-black/40">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="font-mono text-[11px] tracking-wide text-cyan-700/90 uppercase">
            3D Satellite Observation
          </span>
          <span className="text-[#6B7F95]">•</span>
          <span className="text-[#526A82] text-[11px]">Drag to rotate</span>
          {enableZoom && (
            <>
              <span className="text-[#6B7F95]">•</span>
              <span className="text-[#526A82] text-[11px]">Scroll to zoom</span>
            </>
          )}
        </div>
      )}

      {/* Real-Time Telemetry Badge */}
      <div className="absolute top-4 right-4 z-20 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/85 backdrop-blur-md border border-cyan-500/25 text-xs text-[#425873] shadow-md">
        <SatelliteIcon size={14} className="text-[#1677FF] animate-pulse" />
        <span className="font-mono text-[11px] text-[#526A82]">TerraSR-1:</span>
        <span className="font-mono text-[11px] text-cyan-700 font-semibold">Active Scanning</span>
      </div>
    </div>
  );
};

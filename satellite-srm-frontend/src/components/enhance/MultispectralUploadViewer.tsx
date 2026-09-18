import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import { Sparkles, CheckCircle2, Satellite as SatelliteIcon, Radio } from 'lucide-react';
import { FourBandFiles } from '../../types/satellite';
import { RealisticEarth } from '../scene/RealisticEarth';
import { ProceduralSatellite } from '../scene/SatelliteModel';
import { ScanBeam } from '../scene/ScanBeam';
import { SpectralStreamParticles } from '../scene/SpectralStreamParticles';
import { ErrorBoundary } from '../scene/ErrorBoundary';

interface MultispectralUploadViewerProps {
  fourBands: FourBandFiles;
  className?: string;
}

// 3D Scene content for compact upload visualization
const UploadSceneContent: React.FC<{ fourBands: FourBandFiles }> = ({ fourBands }) => {
  const satellitePos = new THREE.Vector3(0.5, 0.45, 1.25);

  const loadedBands = {
    b02: Boolean(fourBands.b02),
    b03: Boolean(fourBands.b03),
    b04: Boolean(fourBands.b04),
    b08: Boolean(fourBands.b08),
  };

  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight position={[4, 2, 3]} intensity={1.8} />
      <pointLight position={[-3, -2, -2]} intensity={0.4} color="#00e5ff" />

      {/* Scaled Earth globe in background */}
      <group position={[-0.4, -0.6, -0.2]} scale={0.85}>
        <RealisticEarth />
      </group>

      {/* Satellite stationed in observation pose */}
      <group position={satellitePos} rotation={[-0.35, -0.4, 0.15]} scale={0.9}>
        <ProceduralSatellite />
      </group>

      {/* Observation Scan Beam from Satellite toward Earth */}
      <ScanBeam satellitePosition={satellitePos} />

      {/* Dynamic Spectral Streams for Loaded Bands */}
      <SpectralStreamParticles
        loadedBands={loadedBands}
        satellitePosition={satellitePos}
      />
    </>
  );
};

// 2D Fallback if WebGL is disabled or unsupported
const Upload2DFallback: React.FC<{ fourBands: FourBandFiles; allLoaded: boolean }> = ({
  fourBands,
  allLoaded,
}) => (
  <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center select-none bg-gradient-to-r from-[#030e1d] via-[#05182e] to-[#030e1d]">
    <div className="flex items-center gap-2 mb-2 text-xs font-mono text-cyan-400">
      <SatelliteIcon size={14} className="animate-pulse" />
      <span>Spectral Channel Telemetry (2D Fallback)</span>
    </div>
    {allLoaded ? (
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold animate-pulse">
        <CheckCircle2 size={13} />
        <span>MULTISPECTRAL INPUT READY</span>
      </div>
    ) : (
      <div className="text-[11px] text-slate-400 font-mono">
        Waiting for Sentinel-2 spectral streams (B02, B03, B04, B08)
      </div>
    )}
  </div>
);

export const MultispectralUploadViewer: React.FC<MultispectralUploadViewerProps> = ({
  fourBands,
  className = '',
}) => {
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl =
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl');
      if (!gl) setHasWebGL(false);
    } catch {
      setHasWebGL(false);
    }
  }, []);

  const b02Ready = Boolean(fourBands.b02);
  const b03Ready = Boolean(fourBands.b03);
  const b04Ready = Boolean(fourBands.b04);
  const b08Ready = Boolean(fourBands.b08);
  const allLoaded = b02Ready && b03Ready && b04Ready && b08Ready;

  return (
    <div
      className={`relative w-full h-[155px] sm:h-[165px] rounded-xl overflow-hidden border border-white/[0.08] bg-[#030a16] shadow-inner ${className}`}
    >
      {/* 3D Canvas Layer */}
      {hasWebGL ? (
        <ErrorBoundary fallback={<Upload2DFallback fourBands={fourBands} allLoaded={allLoaded} />}>
          <div className="absolute inset-0 pointer-events-none">
            <Canvas
              camera={{ position: [0, 0.1, 2.5], fov: 40 }}
              gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
              dpr={[1, 1.5]}
            >
              <Suspense fallback={null}>
                <UploadSceneContent fourBands={fourBands} />
              </Suspense>
            </Canvas>
          </div>
        </ErrorBoundary>
      ) : (
        <Upload2DFallback fourBands={fourBands} allLoaded={allLoaded} />
      )}

      {/* Top Left Header Badge */}
      <div className="absolute top-2.5 left-3 pointer-events-none z-10 flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
          <Radio size={12} className="animate-pulse" />
        </div>
        <div>
          <div className="text-[11px] font-bold text-white tracking-wide leading-none flex items-center gap-1.5">
            <span>Sentinel-2 Spectral Ingestion</span>
            <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              ORBIT 786 KM
            </span>
          </div>
          <div className="text-[9px] text-slate-400 font-mono mt-0.5">
            4-Band Radiometric Stream Link
          </div>
        </div>
      </div>

      {/* Bottom Stream Status Pills */}
      <div className="absolute bottom-2.5 left-3 right-3 pointer-events-none z-10 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          {/* B02 Blue */}
          <div
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono border transition-all duration-300 ${
              b02Ready
                ? 'bg-blue-500/20 border-blue-400/50 text-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.3)]'
                : 'bg-white/[0.03] border-white/[0.08] text-slate-500'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                b02Ready ? 'bg-cyan-400 animate-pulse' : 'bg-slate-600'
              }`}
            />
            <span>B02 Blue</span>
          </div>

          {/* B03 Green */}
          <div
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono border transition-all duration-300 ${
              b03Ready
                ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                : 'bg-white/[0.03] border-white/[0.08] text-slate-500'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                b03Ready ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'
              }`}
            />
            <span>B03 Green</span>
          </div>

          {/* B04 Red */}
          <div
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono border transition-all duration-300 ${
              b04Ready
                ? 'bg-red-500/20 border-red-400/50 text-red-300 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
                : 'bg-white/[0.03] border-white/[0.08] text-slate-500'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                b04Ready ? 'bg-red-400 animate-pulse' : 'bg-slate-600'
              }`}
            />
            <span>B04 Red</span>
          </div>

          {/* B08 NIR */}
          <div
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono border transition-all duration-300 ${
              b08Ready
                ? 'bg-purple-500/20 border-purple-400/50 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                : 'bg-white/[0.03] border-white/[0.08] text-slate-500'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                b08Ready ? 'bg-purple-400 animate-pulse' : 'bg-slate-600'
              }`}
            />
            <span>B08 NIR</span>
          </div>
        </div>

        {/* When all four are loaded: MULTISPECTRAL INPUT READY banner */}
        {allLoaded && (
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-cyan-500/20 via-emerald-500/20 to-cyan-500/20 border border-emerald-400/50 text-emerald-300 text-[11px] font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)] animate-fade-in animate-pulse">
            <Sparkles size={13} className="text-cyan-400" />
            <span>MULTISPECTRAL INPUT READY</span>
          </div>
        )}
      </div>
    </div>
  );
};

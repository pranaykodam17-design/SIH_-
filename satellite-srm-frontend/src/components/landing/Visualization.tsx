import React from 'react';
import { Box, Monitor, Code2 } from 'lucide-react';
import { EarthScene, EarthVisualFallback } from './EarthScene';
import { ErrorBoundary } from '../scene/ErrorBoundary';

export const Visualization: React.FC = () => {
  return (
    <section
      id="visualization"
      className="relative py-28 bg-white border-t border-[#D7E6F4] overflow-hidden"
    >
      {/* Background radial glows */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-cyan-600/[0.05] blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] rounded-full bg-[#1677FF]/[0.05] blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1677FF]/20 border border-cyan-400/25 mb-4">
            <Box size={14} className="text-[#1677FF]" />
            <span className="font-mono text-xs font-semibold tracking-wider text-cyan-700 uppercase">
              SECTION 05 — 3D VISUALIZATION
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#10233F] tracking-tight mb-6">
            From Pixels to a{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
              Spatial Experience
            </span>
          </h2>

          <p className="text-lg sm:text-xl text-[#425873] max-w-2xl mx-auto leading-relaxed mb-4">
            Enhanced satellite imagery can be combined with 3D visualization technologies for immersive geographic interpretation.
          </p>

          {/* Technology Highlight Pill */}
          <div className="inline-flex items-center gap-2 sm:gap-3 px-4 py-2 rounded-2xl bg-white border border-cyan-400/30 backdrop-blur-md shadow-[0_0_25px_rgba(0,212,255,0.15)]">
            <span className="text-xs font-mono text-[#526A82] uppercase tracking-wider">
              Powered by
            </span>
            <span className="font-mono text-xs sm:text-sm font-bold text-cyan-700">
              Blender + WebGL + React
            </span>
          </div>
        </div>

        {/* 3D Visualization Grid Showcase */}
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Interactive 3D Spatial Scene (7 cols) */}
          <div className="lg:col-span-7 relative rounded-3xl bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-cyan-500/25 p-4 sm:p-6 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,212,255,0.08)] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 mb-2 border-b border-[#D7E6F4]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-xs font-mono text-cyan-700 uppercase tracking-wide">
                  Spatial Viewport • React Three Fiber
                </span>
              </div>
              <span className="text-[11px] font-mono text-[#526A82]">
                Draco glTF Ready
              </span>
            </div>

            {/* EarthScene wrapped in ErrorBoundary */}
            <div className="w-full h-[380px] sm:h-[460px]">
              <ErrorBoundary fallback={<EarthVisualFallback message="Spatial Viewport (Safe Fallback Mode)" />}>
                <EarthScene
                  interactive={true}
                  enableZoom={true}
                  autoRotateSpeed={0.5}
                  className="w-full h-full"
                  showHint={false}
                />
              </ErrorBoundary>
            </div>

            <div className="px-4 py-2 mt-2 bg-white rounded-xl border border-[#D7E6F4] flex items-center justify-between text-xs text-[#526A82]">
              <span className="font-mono">Axial Tilt: 23.4°</span>
              <span className="font-mono text-[#1677FF]">GLB Drop-In: Active</span>
            </div>
          </div>

          {/* Right Column: Architectural Pillars (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Pillar 1: Blender */}
            <div className="rounded-2xl bg-white hover:bg-white border border-[#D7E6F4] hover:border-cyan-200 p-6 backdrop-blur-md transition-all duration-300">
              <div className="flex items-center gap-3.5 mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-400/30 flex items-center justify-center text-amber-700">
                  <Box size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#10233F]">Blender 3D Modeling</h3>
                  <p className="text-xs font-mono text-[#526A82]">Digital Terrain & Asset Authoring</p>
                </div>
              </div>
              <p className="text-xs text-[#425873] leading-relaxed">
                Design custom planetary bodies, digital elevation models (DEMs), and satellite orbits with precision PBR shaders, exported cleanly as compressed glTF/GLB binaries.
              </p>
            </div>

            {/* Pillar 2: WebGL */}
            <div className="rounded-2xl bg-white hover:bg-white border border-[#D7E6F4] hover:border-cyan-200 p-6 backdrop-blur-md transition-all duration-300">
              <div className="flex items-center gap-3.5 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#1677FF]/20 border border-cyan-400/30 flex items-center justify-center text-cyan-700">
                  <Monitor size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#10233F]">WebGL & Three.js</h3>
                  <p className="text-xs font-mono text-[#526A82]">Hardware-Accelerated In-Browser Engine</p>
                </div>
              </div>
              <p className="text-xs text-[#425873] leading-relaxed">
                Direct GPU pipeline executes custom atmospheric Fresnel shaders and orbital trigonometry at a locked 60 frames per second without external plugins.
              </p>
            </div>

            {/* Pillar 3: React Three Fiber */}
            <div className="rounded-2xl bg-white hover:bg-white border border-[#D7E6F4] hover:border-cyan-200 p-6 backdrop-blur-md transition-all duration-300">
              <div className="flex items-center gap-3.5 mb-3">
                <div className="w-10 h-10 rounded-xl bg-[#1677FF]/15 border border-blue-400/30 flex items-center justify-center text-blue-700">
                  <Code2 size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#10233F]">React Three Fiber</h3>
                  <p className="text-xs font-mono text-[#526A82]">Declarative 3D Architecture</p>
                </div>
              </div>
              <p className="text-xs text-[#425873] leading-relaxed">
                Combines React state management with 3D scene graphs, enabling seamless hot-swapping between procedural fallback models and custom Blender GLB assets.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

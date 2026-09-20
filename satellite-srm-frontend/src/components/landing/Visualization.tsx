import React from 'react';
import { Box, Monitor, Code2 } from 'lucide-react';
import { EarthScene, EarthVisualFallback } from './EarthScene';
import { ErrorBoundary } from '../scene/ErrorBoundary';

export const Visualization: React.FC = () => {
  return (
    <section
      id="visualization"
      className="relative py-20 bg-white border-t border-border overflow-hidden"
    >
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-2xl mb-14">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-ink tracking-tight mb-5">
            From pixels to a spatial experience
          </h2>

          <p className="text-base sm:text-lg text-slate leading-relaxed mb-6">
            Enhanced satellite imagery combined with 3D visualization technologies for immersive geographic interpretation.
          </p>

          {/* Technology Highlight Pill */}
          <div className="inline-flex items-center gap-2 sm:gap-3 px-4 py-2 rounded-lg bg-wash border border-border">
            <span className="text-xs font-mono text-slate">
              Powered by
            </span>
            <span className="font-mono text-sm font-semibold text-band-blue">
              Blender + WebGL + React
            </span>
          </div>
        </div>

        {/* 3D Visualization Grid Showcase */}
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Interactive 3D Spatial Scene (7 cols) */}
          <div className="lg:col-span-7 relative rounded-lg bg-wash border border-border p-4 sm:p-6 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 mb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-band-blue font-medium">
                  Spatial Viewport • React Three Fiber
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate">
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

            <div className="px-4 py-2 mt-2 bg-white rounded border border-border flex items-center justify-between text-[11px] text-slate">
              <span className="font-mono">Axial Tilt: 23.4°</span>
              <span className="font-mono text-band-blue">GLB Drop-In: Active</span>
            </div>
          </div>

          {/* Right Column: Architectural Pillars (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Pillar 1: Blender */}
            <div className="rounded-lg bg-white hover:bg-wash border border-border p-6 transition-all duration-200">
              <div className="flex items-center gap-3.5 mb-3">
                <div className="w-10 h-10 rounded-md bg-[#FFFBEB] border border-[#FEF3C7] flex items-center justify-center text-[#B45309]">
                  <Box size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-ink">Blender 3D Modeling</h3>
                  <p className="text-[11px] font-mono text-slate">Digital Terrain & Asset Authoring</p>
                </div>
              </div>
              <p className="text-[13px] text-slate leading-relaxed">
                Design custom planetary bodies, digital elevation models (DEMs), and satellite orbits with precision PBR shaders, exported cleanly as compressed glTF/GLB binaries.
              </p>
            </div>

            {/* Pillar 2: WebGL */}
            <div className="rounded-lg bg-white hover:bg-wash border border-border p-6 transition-all duration-200">
              <div className="flex items-center gap-3.5 mb-3">
                <div className="w-10 h-10 rounded-md bg-wash border border-border flex items-center justify-center text-band-blue">
                  <Monitor size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-ink">WebGL & Three.js</h3>
                  <p className="text-[11px] font-mono text-slate">Hardware-Accelerated In-Browser Engine</p>
                </div>
              </div>
              <p className="text-[13px] text-slate leading-relaxed">
                Direct GPU pipeline executes custom atmospheric Fresnel shaders and orbital trigonometry at a locked 60 frames per second without external plugins.
              </p>
            </div>

            {/* Pillar 3: React Three Fiber */}
            <div className="rounded-lg bg-white hover:bg-wash border border-border p-6 transition-all duration-200">
              <div className="flex items-center gap-3.5 mb-3">
                <div className="w-10 h-10 rounded-md bg-wash border border-border flex items-center justify-center text-band-blue">
                  <Code2 size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-ink">React Three Fiber</h3>
                  <p className="text-[11px] font-mono text-slate">Declarative 3D Architecture</p>
                </div>
              </div>
              <p className="text-[13px] text-slate leading-relaxed">
                Combines React state management with 3D scene graphs, enabling seamless hot-swapping between procedural fallback models and custom Blender GLB assets.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

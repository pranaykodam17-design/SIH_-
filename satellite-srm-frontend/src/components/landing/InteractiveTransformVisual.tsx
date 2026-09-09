import React, { useState } from 'react';
import { ArrowRight, Sparkles, Sliders, Eye, Grid } from 'lucide-react';

export const InteractiveTransformVisual: React.FC = () => {
  const [sliderPos, setSliderPos] = useState(50);
  const [showGrid, setShowGrid] = useState(false);

  return (
    <div className="relative mx-auto w-full max-w-5xl rounded-2xl border border-space-border bg-space-card/90 p-3 sm:p-6 shadow-2xl backdrop-blur-md overflow-hidden">
      
      {/* Top Console Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-space-border/80 text-xs font-mono">
        <div className="flex items-center gap-3">
          <span className="flex h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
          <span className="text-slate-300 font-semibold">INTERACTIVE SPATIAL TRANSFORMATION SENSOR</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded border transition-colors ${
              showGrid ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' : 'bg-space-elevated border-space-border text-slate-400'
            }`}
          >
            <Grid className="h-3.5 w-3.5" />
            <span>10m Pixel Grid</span>
          </button>
          <span className="text-slate-400">Scale: <strong className="text-cyan-300 font-bold">x3.0 (Sub-4m)</strong></span>
        </div>
      </div>

      {/* Main Dual-View Container */}
      <div className="relative mt-4 h-72 sm:h-96 md:h-[420px] w-full select-none overflow-hidden rounded-xl border border-space-border bg-slate-950">
        
        {/* Right side: High Resolution (Sub-4m SR) */}
        <div className="absolute inset-0">
          <img
            src="/sample-satellite/sr.png"
            alt="Sub-4m Super Resolved Satellite Product"
            className="h-full w-full object-cover"
          />
          <div className="absolute top-4 right-4 z-10 rounded-md bg-space-darkest/80 px-3 py-1.5 text-xs font-mono font-bold text-cyan-300 border border-cyan-500/40 backdrop-blur-md shadow-lg">
            SUB-4m RECONSTRUCTION (SwinIR)
          </div>
        </div>

        {/* Left side: Low Resolution (10m Sentinel-2) clipped by slider */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPos}%` }}
        >
          <img
            src="/sample-satellite/lr.png"
            alt="10m Sentinel-2 Input Satellite Product"
            className="h-full w-full object-cover max-w-none"
            style={{ width: '100%', height: '100%' }}
          />

          {/* Optional pixel grid overlay for 10m representation */}
          {showGrid && (
            <div className="absolute inset-0 pixel-grid-overlay pointer-events-none opacity-60" />
          )}

          <div className="absolute top-4 left-4 z-10 rounded-md bg-space-darkest/80 px-3 py-1.5 text-xs font-mono font-bold text-amber-300 border border-amber-500/40 backdrop-blur-md shadow-lg">
            10m NATIVE INPUT (Sentinel-2 L2A)
          </div>
        </div>

        {/* Draggable Divider Handle */}
        <div
          className="absolute top-0 bottom-0 z-20 w-1 bg-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.8)] cursor-ew-resize flex items-center justify-center"
          style={{ left: `${sliderPos}%` }}
        >
          <div className="flex h-10 w-10 -ml-5 items-center justify-center rounded-full border-2 border-cyan-300 bg-space-darkest shadow-2xl text-cyan-300">
            <Sliders className="h-4 w-4 rotate-90" />
          </div>
        </div>

        {/* Slider invisible input for touch/mouse interaction */}
        <input
          type="range"
          min="0"
          max="100"
          value={sliderPos}
          onChange={(e) => setSliderPos(Number(e.target.value))}
          aria-label="Satellite Resolution Comparison Slider"
          className="absolute inset-0 z-30 opacity-0 cursor-ew-resize w-full h-full"
        />

        {/* Scanline subtle styling */}
        <div className="absolute inset-0 scanline pointer-events-none opacity-40"></div>
      </div>

      {/* Bottom Information Pill */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <span className="text-amber-400">← Drag left to reveal Sub-4m</span>
          <span>|</span>
          <span className="text-cyan-400">Drag right to inspect 10m Input →</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-300">Target Resolution: <strong className="text-white">3.33 m GSD</strong></span>
          <span className="text-slate-300">Preserved Bands: <strong className="text-white">B02 · B03 · B04 · B08</strong></span>
        </div>
      </div>
    </div>
  );
};

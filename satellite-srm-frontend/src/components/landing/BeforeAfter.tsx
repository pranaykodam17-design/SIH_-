import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, SlidersHorizontal, Maximize2, MoveHorizontal, Check, RefreshCw } from 'lucide-react';

export const BeforeAfter: React.FC = () => {
  const [sliderPos, setSliderPos] = useState<number>(50); // percentage 0 - 100
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const clamped = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(clamped);
  }, []);

  const handlePointerDown = () => setIsDragging(true);

  useEffect(() => {
    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      handleMove(clientX);
    };

    const onPointerUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', onPointerMove);
      window.addEventListener('mouseup', onPointerUp);
      window.addEventListener('touchmove', onPointerMove);
      window.addEventListener('touchend', onPointerUp);
    }

    return () => {
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
    };
  }, [isDragging, handleMove]);

  return (
    <section
      id="before-after"
      className="relative py-28 bg-[#020b18] border-t border-white/[0.06] overflow-hidden select-none"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-cyan-600/[0.04] blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/25 mb-4">
            <SlidersHorizontal size={14} className="text-cyan-400" />
            <span className="font-mono text-xs font-semibold tracking-wider text-cyan-300 uppercase">
              SECTION 04 — BEFORE / AFTER
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-6">
            Interactive Image{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">
              Comparison
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Drag the slider horizontally to inspect how SwinIR-SRM eliminates pixelation and recovers sub-pixel spatial boundaries.
          </p>
        </div>

        {/* ── INTERACTIVE SLIDER CONTAINER ── */}
        <div className="relative max-w-5xl mx-auto">
          {/* Metrics Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-3 rounded-t-2xl bg-black/60 border-t border-x border-white/10 text-xs font-mono text-slate-300 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <span className="text-slate-400">Dataset: Sentinel-2 L2A</span>
              <span className="hidden sm:inline text-slate-600">•</span>
              <span className="text-cyan-300">EPSG:32644 (UTM Zone 44N)</span>
            </div>
            <div className="flex items-center gap-4 text-emerald-400 font-semibold">
              <span>PSNR: +4.2 dB</span>
              <span className="text-slate-600">•</span>
              <span>SSIM: 0.912</span>
            </div>
          </div>

          {/* Interactive Split View Screen */}
          <div
            ref={containerRef}
            className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-b-2xl overflow-hidden border border-white/10 cursor-ew-resize shadow-[0_10px_50px_rgba(0,0,0,0.8)]"
            onClick={(e) => handleMove(e.clientX)}
          >
            {/* 1. Super-Resolved Layer (Full Width Base Layer - Right Side) */}
            <img
              src="/sample-satellite/sr.png"
              alt="Super-Resolved Satellite Imagery"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none"
            />

            {/* 2. Original Low-Res Layer (Clipped to Slider Percentage - Left Side) */}
            <div
              className="absolute inset-0 overflow-hidden pointer-events-none"
              style={{ width: `${sliderPos}%` }}
            >
              <img
                src="/sample-satellite/lr.png"
                alt="Original Low-Res Satellite Imagery"
                className="absolute inset-0 w-full h-full object-cover max-w-none filter blur-[0.4px]"
                style={{ width: containerRef.current?.clientWidth || '100%' }}
              />
              {/* Subtle pixel grid on LR side to emphasize native 10m pixel discretization */}
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
            </div>

            {/* Floating Label: Left (Original LR) */}
            <div
              className="absolute top-4 left-4 z-20 pointer-events-none transition-opacity duration-200"
              style={{ opacity: sliderPos < 15 ? 0 : 1 }}
            >
              <div className="px-3.5 py-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/20 text-xs font-mono text-slate-200 shadow-lg">
                <span className="text-red-400 font-bold">LEFT: </span>
                <span>Original Satellite (10m)</span>
              </div>
            </div>

            {/* Floating Label: Right (Super-Resolved SR) */}
            <div
              className="absolute top-4 right-4 z-20 pointer-events-none transition-opacity duration-200"
              style={{ opacity: sliderPos > 85 ? 0 : 1 }}
            >
              <div className="px-3.5 py-1.5 rounded-xl bg-[#020b18]/85 backdrop-blur-md border border-cyan-500/40 text-xs font-mono text-cyan-300 shadow-[0_0_20px_rgba(0,212,255,0.25)]">
                <span className="text-cyan-400 font-bold">RIGHT: </span>
                <span>Super-Resolved (3.3m)</span>
              </div>
            </div>

            {/* Glowing Vertical Slider Line */}
            <div
              className="absolute top-0 bottom-0 z-30 w-[2px] bg-gradient-to-b from-cyan-300 via-cyan-400 to-blue-500 shadow-[0_0_15px_#00e5ff] pointer-events-none"
              style={{ left: `${sliderPos}%` }}
            >
              {/* Center Drag Handle Button */}
              <div
                onMouseDown={handlePointerDown}
                onTouchStart={handlePointerDown}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#020b18] border-2 border-cyan-400 flex items-center justify-center text-cyan-300 shadow-[0_0_25px_rgba(0,212,255,0.6)] cursor-grab active:cursor-grabbing hover:scale-110 transition-transform pointer-events-auto"
              >
                <MoveHorizontal size={18} />
              </div>
            </div>
          </div>

          {/* Quick Jump Split Preset Buttons */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <span className="text-xs font-mono text-slate-400">Jump to View:</span>
            {[
              { label: 'Original (10m)', val: 95 },
              { label: '50/50 Split', val: 50 },
              { label: 'Super-Resolved (3m)', val: 5 },
            ].map((btn) => (
              <button
                key={btn.label}
                onClick={() => setSliderPos(btn.val)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all duration-200 ${
                  Math.abs(sliderPos - btn.val) < 8
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_15px_rgba(0,212,255,0.2)]'
                    : 'bg-white/[0.04] text-slate-400 hover:text-white border border-white/[0.06]'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

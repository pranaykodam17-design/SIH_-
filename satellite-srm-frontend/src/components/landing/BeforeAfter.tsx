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
      className="relative py-20 bg-white border-t border-border overflow-hidden select-none"
    >
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-2xl mb-14">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-ink tracking-tight mb-5">
            Interactive image comparison
          </h2>

          <p className="text-base sm:text-lg text-slate leading-relaxed">
            Drag the slider horizontally to inspect how SwinIR-SRM eliminates pixelation and recovers sub-pixel spatial boundaries.
          </p>
        </div>

        {/* ── INTERACTIVE SLIDER CONTAINER ── */}
        <div className="relative max-w-5xl mx-auto">
          {/* Metrics Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-3 rounded-t-lg bg-wash border-t border-x border-border text-[11px] font-mono text-slate">
            <div className="flex items-center gap-3">
              <span>Dataset: Sentinel-2 L2A</span>
              <span className="hidden sm:inline">•</span>
              <span className="text-band-blue">EPSG:32644 (UTM Zone 44N)</span>
            </div>
            <div className="flex items-center gap-3 text-emerald-600 font-medium">
              <span>PSNR: +4.2 dB</span>
              <span className="text-slate">•</span>
              <span>SSIM: 0.912</span>
            </div>
          </div>

          {/* Interactive Split View Screen */}
          <div
            ref={containerRef}
            className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-b-lg overflow-hidden border border-border cursor-ew-resize shadow-card"
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
              <div className="px-3 py-1.5 rounded bg-white border border-border text-[11px] font-mono text-slate shadow-card">
                <span className="text-band-nir font-semibold">LEFT: </span>
                <span>Original (10m)</span>
              </div>
            </div>

            {/* Floating Label: Right (Super-Resolved SR) */}
            <div
              className="absolute top-4 right-4 z-20 pointer-events-none transition-opacity duration-200"
              style={{ opacity: sliderPos > 85 ? 0 : 1 }}
            >
              <div className="px-3 py-1.5 rounded bg-white border border-border text-[11px] font-mono text-slate shadow-card">
                <span className="text-band-blue font-semibold">RIGHT: </span>
                <span>Super-Resolved (3.3m)</span>
              </div>
            </div>

            {/* Solid Vertical Slider Line */}
            <div
              className="absolute top-0 bottom-0 z-30 w-[2px] bg-band-blue pointer-events-none"
              style={{ left: `${sliderPos}%` }}
            >
              {/* Center Drag Handle Button */}
              <div
                onMouseDown={handlePointerDown}
                onTouchStart={handlePointerDown}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border-2 border-band-blue flex items-center justify-center text-band-blue shadow-card cursor-grab active:cursor-grabbing hover:scale-105 transition-transform pointer-events-auto"
              >
                <MoveHorizontal size={14} />
              </div>
            </div>
          </div>

          {/* Quick Jump Split Preset Buttons */}
          <div className="flex items-center justify-center gap-3 mt-5">
            <span className="text-[11px] font-mono text-slate">Jump to View:</span>
            {[
              { label: 'Original (10m)', val: 95 },
              { label: '50/50 Split', val: 50 },
              { label: 'Super-Resolved (3m)', val: 5 },
            ].map((btn) => (
              <button
                key={btn.label}
                onClick={() => setSliderPos(btn.val)}
                className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all duration-150 ${
                  Math.abs(sliderPos - btn.val) < 8
                    ? 'bg-band-blue/10 text-band-blue border border-band-blue'
                    : 'bg-white text-slate hover:text-ink border border-border hover:bg-wash'
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

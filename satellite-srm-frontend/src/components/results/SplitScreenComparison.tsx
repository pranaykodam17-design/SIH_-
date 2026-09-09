import React, { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface SplitScreenComparisonProps {
  lrUrl: string;
  srUrl: string;
}

export const SplitScreenComparison: React.FC<SplitScreenComparisonProps> = ({ lrUrl, srUrl }) => {
  const [zoom, setZoom] = useState(1.0);
  const [crosshairPos, setCrosshairPos] = useState<{ x: number; y: number } | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setCrosshairPos({ x, y });
  };

  const handleMouseLeave = () => {
    setCrosshairPos(null);
  };

  return (
    <div className="w-full rounded-xl border border-space-border bg-space-card p-4 shadow-2xl">
      <div className="flex items-center justify-between pb-3 border-b border-space-border text-xs font-mono mb-3">
        <span className="text-slate-300 font-bold">SYNCHRONIZED SIDE-BY-SIDE INSPECTION</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom(prev => Math.max(1, prev - 0.25))}
            className="p-1 rounded bg-space-elevated hover:bg-space-border text-slate-300"
            title="Zoom Out"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
          <span className="text-cyan-300">{zoom.toFixed(1)}x</span>
          <button
            onClick={() => setZoom(prev => Math.min(3, prev + 0.25))}
            className="p-1 rounded bg-space-elevated hover:bg-space-border text-slate-300"
            title="Zoom In"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setZoom(1.0)}
            className="p-1 rounded bg-space-elevated hover:bg-space-border text-slate-400"
            title="Reset"
          >
            <RotateCcw className="h-3 w-3" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Left: 10m Input */}
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative h-80 sm:h-96 rounded-lg border border-space-border overflow-hidden bg-slate-950 cursor-crosshair"
        >
          <img
            src={lrUrl}
            alt="10m Sentinel-2 native"
            className="h-full w-full object-cover"
            style={{ transform: `scale(${zoom})` }}
          />
          <div className="absolute top-2 left-2 rounded bg-space-darkest/80 px-2 py-1 text-[11px] font-mono text-amber-300 border border-amber-500/40">
            10m SENTINEL-2 L2A
          </div>

          {crosshairPos && (
            <div
              className="absolute pointer-events-none w-4 h-4 -ml-2 -mt-2 border border-cyan-400 rounded-full"
              style={{ left: `${crosshairPos.x}%`, top: `${crosshairPos.y}%` }}
            />
          )}
        </div>

        {/* Right: Sub-4m SR */}
        <div
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative h-80 sm:h-96 rounded-lg border border-space-border overflow-hidden bg-slate-950 cursor-crosshair"
        >
          <img
            src={srUrl}
            alt="Sub-4m SwinIR output"
            className="h-full w-full object-cover"
            style={{ transform: `scale(${zoom})` }}
          />
          <div className="absolute top-2 left-2 rounded bg-space-darkest/80 px-2 py-1 text-[11px] font-mono text-cyan-300 border border-cyan-500/40">
            SUB-4m RECONSTRUCTION
          </div>

          {crosshairPos && (
            <div
              className="absolute pointer-events-none w-4 h-4 -ml-2 -mt-2 border border-cyan-400 rounded-full"
              style={{ left: `${crosshairPos.x}%`, top: `${crosshairPos.y}%` }}
            />
          )}
        </div>

      </div>
    </div>
  );
};

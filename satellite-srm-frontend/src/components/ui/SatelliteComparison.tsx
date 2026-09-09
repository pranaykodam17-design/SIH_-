import React, { useRef, useState, useCallback, useEffect } from 'react';
import { ChevronsLeftRight, ZoomIn, ZoomOut, Maximize2, RotateCcw } from 'lucide-react';

interface SatelliteComparisonProps {
  beforeUrl: string;
  afterUrl: string;
  beforeLabel?: string;
  afterLabel?: string;
  initialPosition?: number; // 0-100
  height?: string;
  showControls?: boolean;
  className?: string;
}

export const SatelliteComparison: React.FC<SatelliteComparisonProps> = ({
  beforeUrl,
  afterUrl,
  beforeLabel = 'Sentinel-2 · 10m',
  afterLabel = 'SRM Enhanced · <4m',
  initialPosition = 50,
  height = '420px',
  showControls = true,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(initialPosition); // percentage 0-100
  const [isDragging, setIsDragging] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);

  const getPositionFromEvent = useCallback((clientX: number) => {
    const container = containerRef.current;
    if (!container) return position;
    const rect = container.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    return (x / rect.width) * 100;
  }, [position]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setPosition(getPositionFromEvent(e.clientX));
  }, [getPositionFromEvent]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsDragging(true);
    setPosition(getPositionFromEvent(e.touches[0].clientX));
  }, [getPositionFromEvent]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setPosition(getPositionFromEvent(e.clientX));
    };
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault();
      setPosition(getPositionFromEvent(e.touches[0].clientX));
    };
    const handleUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleUp);
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleUp);
    };
  }, [isDragging, getPositionFromEvent]);

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.25, 3));
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.25, 0.5));
  const handleReset = () => { setZoom(1); setPosition(50); };

  const containerStyle: React.CSSProperties = {
    height: fullscreen ? '100vh' : height,
    userSelect: 'none',
    WebkitUserSelect: 'none',
    cursor: isDragging ? 'col-resize' : 'ew-resize',
  };

  const imageStyle: React.CSSProperties = {
    transform: `scale(${zoom})`,
    transformOrigin: 'center center',
    transition: isDragging ? 'none' : 'transform 0.2s ease',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    pointerEvents: 'none',
  };

  const Wrapper = fullscreen
    ? ({ children }: { children: React.ReactNode }) => (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col">
          {children}
        </div>
      )
    : ({ children }: { children: React.ReactNode }) => (
        <div className={`relative rounded-2xl overflow-hidden border border-white/[0.08] ${className}`}>
          {children}
        </div>
      );

  return (
    <Wrapper>
      {/* Comparison Area */}
      <div
        ref={containerRef}
        className="relative overflow-hidden select-none"
        style={containerStyle}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* BEFORE (left — low res) */}
        <div className="absolute inset-0">
          <img src={beforeUrl} alt="Before — Original" style={imageStyle} draggable={false} />
        </div>

        {/* AFTER (right — super-res), clipped */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${position}%` }}
        >
          <div style={{ width: containerRef.current ? containerRef.current.clientWidth + 'px' : '100%', height: '100%' }}>
            <img src={afterUrl} alt="After — Enhanced" style={imageStyle} draggable={false} />
          </div>
        </div>

        {/* Divider line */}
        <div
          className="absolute top-0 bottom-0 z-10"
          style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
        >
          <div className="comparison-handle w-full h-full relative">
            {/* The vertical line */}
            <div className="absolute inset-0 w-[2px] mx-auto bg-gradient-to-b from-transparent via-[#00d4ff] to-transparent shadow-[0_0_12px_rgba(0,212,255,0.7)]" />
            {/* Handle circle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#020c1b] border-2 border-[#00d4ff] shadow-[0_0_20px_rgba(0,212,255,0.5)] flex items-center justify-center z-20 cursor-col-resize">
              <ChevronsLeftRight size={16} className="text-[#00d4ff]" />
            </div>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-3 right-3 z-20 pointer-events-none">
          <span className="px-2.5 py-1 text-[11px] font-semibold bg-[#020c1b]/80 backdrop-blur-sm border border-white/10 rounded-lg text-slate-400">
            {beforeLabel}
          </span>
        </div>
        <div className="absolute top-3 left-3 z-20 pointer-events-none">
          <span className="px-2.5 py-1 text-[11px] font-bold bg-[#00d4ff]/15 backdrop-blur-sm border border-[#00d4ff]/30 rounded-lg text-[#00d4ff]">
            {afterLabel}
          </span>
        </div>

        {/* Hint overlay (only shown once) */}
        {position === initialPosition && !isDragging && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
            <div className="px-3 py-1.5 text-[11px] text-slate-400 bg-[#020c1b]/70 backdrop-blur-sm border border-white/10 rounded-lg flex items-center gap-1.5">
              <ChevronsLeftRight size={12} />
              Drag to compare
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      {showControls && (
        <div className="flex items-center justify-between px-4 py-2.5 bg-[#071525]/80 backdrop-blur-sm border-t border-white/[0.05]">
          <div className="flex items-center gap-1">
            <button
              onClick={handleZoomOut}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all duration-150"
              title="Zoom Out"
            >
              <ZoomOut size={14} />
            </button>
            <span className="text-xs text-slate-500 font-mono w-12 text-center">{Math.round(zoom * 100)}%</span>
            <button
              onClick={handleZoomIn}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all duration-150"
              title="Zoom In"
            >
              <ZoomIn size={14} />
            </button>
            <div className="w-px h-4 bg-white/10 mx-1" />
            <button
              onClick={handleReset}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all duration-150"
              title="Reset"
            >
              <RotateCcw size={13} />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-xs text-slate-600">
              Slider: <span className="text-slate-400 font-mono">{Math.round(position)}%</span>
            </div>
            <button
              onClick={() => setFullscreen((v) => !v)}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all duration-150"
              title={fullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              <Maximize2 size={13} />
            </button>
          </div>
        </div>
      )}

      {/* Fullscreen close */}
      {fullscreen && (
        <div className="absolute top-4 right-4 z-[110]">
          <button
            onClick={() => setFullscreen(false)}
            className="px-3 py-1.5 text-xs bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white transition-all duration-200"
          >
            Exit Fullscreen
          </button>
        </div>
      )}
    </Wrapper>
  );
};

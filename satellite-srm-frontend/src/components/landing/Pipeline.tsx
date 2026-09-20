import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Satellite,
  Sliders,
  Cpu,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Zap,
  Activity,
  Workflow,
  ChevronRight
} from 'lucide-react';

interface Stage {
  id: number;
  title: string;
  subtitle: string;
  tag: string;
  icon: React.ReactNode;
  color: string;
  borderColor: string;
  glowColor: string;
  description: string;
  specs: { label: string; value: string }[];
}

export const Pipeline: React.FC = () => {
  const [activeStage, setActiveStage] = useState<number>(3); // SwinIR active by default

  const stages: Stage[] = [
    {
      id: 1,
      title: 'Satellite Imagery',
      subtitle: 'Raw Acquisition',
      tag: 'Step 01',
      icon: <Satellite size={22} />,
      color: 'from-blue-500/20 to-cyan-500/10',
      borderColor: 'border-blue-500/30',
      glowColor: 'shadow-[0_0_25px_rgba(59,130,246,0.35)]',
      description:
        'Acquires 10m Sentinel-2 MSI Level-2A surface reflectance data containing high-precision geospatial coordinate reference systems.',
      specs: [
        { label: 'Ground Sample Distance', value: '10 Meters' },
        { label: 'Data Container', value: 'Cloud-Optimized GeoTIFF' },
        { label: 'Revisit Period', value: '5 Days' },
      ],
    },
    {
      id: 2,
      title: 'Multispectral Processing',
      subtitle: 'Radiometric Calibration',
      tag: 'Step 02',
      icon: <Sliders size={22} />,
      color: 'from-cyan-500/20 to-teal-500/10',
      borderColor: 'border-cyan-200',
      glowColor: 'shadow-[0_0_25px_rgba(0,212,255,0.35)]',
      description:
        'Normalizes dynamic range, harmonizes cross-band co-registration, and isolates spectral channels (Blue, Green, Red, Near-Infrared).',
      specs: [
        { label: 'Bands Processed', value: 'B2, B3, B4, B8' },
        { label: 'Normalization', value: 'Robust Percentile Clipping' },
        { label: 'Registration Error', value: '< 0.15 Pixel' },
      ],
    },
    {
      id: 3,
      title: 'Deep Learning',
      subtitle: 'Cross-Spectral Attention',
      tag: 'Step 03',
      icon: <Cpu size={22} />,
      color: 'from-violet-500/20 to-indigo-500/10',
      borderColor: 'border-violet-500/30',
      glowColor: 'shadow-[0_0_25px_rgba(139,92,246,0.35)]',
      description:
        'Deep residual feature extractors learn joint spectral-spatial representations, correlating physical reflectance across all wavebands.',
      specs: [
        { label: 'Architecture', value: 'Deep Residual Network' },
        { label: 'Feature Depth', value: '180 Channels' },
        { label: 'Fusion Scheme', value: 'Cross-Band Attention' },
      ],
    },
    {
      id: 4,
      title: 'SwinIR Super Resolution',
      subtitle: 'Shifted Window Transformer',
      tag: 'Step 04',
      icon: <Sparkles size={22} />,
      color: 'from-cyan-400/25 to-blue-600/15',
      borderColor: 'border-cyan-400/50',
      glowColor: 'shadow-[0_0_35px_rgba(0,212,255,0.5)]',
      description:
        'Shifted Window Self-Attention calculates long-range contextual relationships, driving 3× sub-pixel feature reconstruction.',
      specs: [
        { label: 'Attention Mechanism', value: 'Shifted Window Self-Attention' },
        { label: 'Window Size', value: '8 × 8 Patches' },
        { label: 'Upsampling Method', value: 'Sub-Pixel PixelShuffle' },
      ],
    },
    {
      id: 5,
      title: 'Enhanced Satellite Imagery',
      subtitle: 'Analysis-Ready Intelligence',
      tag: 'Step 05',
      icon: <CheckCircle2 size={22} />,
      color: 'from-emerald-500/20 to-cyan-500/10',
      borderColor: 'border-emerald-500/30',
      glowColor: 'shadow-[0_0_25px_rgba(16,185,129,0.35)]',
      description:
        'Produces sub-4m analysis-ready geospatial imagery with pristine spatial crispness while strictly preserving original spectral indices.',
      specs: [
        { label: 'Reconstructed GSD', value: 'Sub-4m (3.3 Meters)' },
        { label: 'PSNR Improvement', value: '+4.2 dB Average' },
        { label: 'Spatial Factor', value: '3× Scale (9× Pixels)' },
      ],
    },
  ];

  return (
    <section
      id="approach"
      className="relative py-20 bg-white border-t border-border overflow-hidden"
    >
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-2xl mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-ink tracking-tight mb-5">
            End-to-end super-resolution pipeline
          </h2>

          <p className="text-base sm:text-lg text-slate leading-relaxed">
            From raw multispectral GeoTIFF to sub-4m spatial clarity, using transformer-based vision architectures.
          </p>
        </div>

        {/* ── DESKTOP HORIZONTAL CONNECTED PIPELINE ── */}
        <div className="relative hidden xl:block mb-16">
          {/* Thin connector line */}
          <div className="absolute top-[44px] left-[8%] right-[8%] h-px bg-border z-0" />

          {/* 5 Sequential Stage Nodes */}
          <div className="grid grid-cols-5 gap-4 relative z-10">
            {stages.map((stage) => {
              const isSelected = activeStage === stage.id;
              return (
                <div
                  key={stage.id}
                  onClick={() => setActiveStage(stage.id)}
                  className={`cursor-pointer rounded-lg p-4 transition-all duration-200 border ${
                    isSelected
                      ? 'bg-white border-band-blue shadow-card-hover -translate-y-1'
                      : 'bg-white border-border hover:border-slate/30'
                  }`}
                >
                  {/* Top: Icon + Indicator */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 ${
                        isSelected
                          ? 'bg-[#1677FF]/20 text-cyan-700 scale-110'
                          : 'bg-white text-[#526A82]'
                      }`}
                    >
                      {stage.icon}
                    </div>
                    <span className="font-mono text-[11px] font-bold text-[#6B7F95]">
                      {stage.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#10233F] mb-1 leading-snug">
                    {stage.title}
                  </h3>
                  <p className="text-xs text-[#526A82] font-mono mb-3">
                    {stage.subtitle}
                  </p>

                  <div className="flex items-center gap-1 text-[11px] font-medium text-[#1677FF]">
                    <span>Inspect</span>
                    <ChevronRight size={12} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── MOBILE / TABLET VERTICAL CONNECTED PIPELINE ── */}
        <div className="xl:hidden space-y-4 mb-12 relative">
          <div className="absolute top-6 bottom-6 left-6 w-[2px] bg-gradient-to-b from-blue-500/40 via-cyan-400/60 to-emerald-400/40 z-0" />
          {stages.map((stage) => {
            const isSelected = activeStage === stage.id;
            return (
              <div
                key={stage.id}
                onClick={() => setActiveStage(stage.id)}
                className={`relative z-10 flex items-start gap-4 rounded-2xl p-5 border backdrop-blur-md cursor-pointer transition-all ${
                  isSelected
                    ? `bg-white ${stage.borderColor} ${stage.glowColor}`
                    : 'bg-white border-[#D7E6F4]'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center ${
                    isSelected ? 'bg-[#1677FF]/25 text-cyan-700' : 'bg-white text-[#526A82]'
                  }`}
                >
                  {stage.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-base font-bold text-[#10233F] truncate">{stage.title}</h3>
                    <span className="font-mono text-[10px] text-[#526A82]">{stage.tag}</span>
                  </div>
                  <p className="text-xs text-[#526A82]">{stage.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── ACTIVE STAGE DEEP DIVE CARD ── */}
        {(() => {
          const current = stages.find((s) => s.id === activeStage) || stages[3];
          return (
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="rounded-3xl bg-gradient-to-r from-white/[0.06] via-white/[0.04] to-cyan-500/[0.03] border border-cyan-200 p-8 sm:p-10 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,212,255,0.06)]"
            >
              <div className="grid lg:grid-cols-12 gap-8 items-center">
                {/* Left: Stage summary & details (7 cols) */}
                <div className="lg:col-span-7">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#1677FF]/20 border border-cyan-400/30 text-cyan-700 font-mono text-xs font-semibold mb-3">
                    <Activity size={12} /> {current.tag} Active Focus
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-[#10233F] mb-3">
                    {current.title}
                  </h3>
                  <p className="text-[#425873] text-sm sm:text-base leading-relaxed mb-6">
                    {current.description}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {current.specs.map((spec, i) => (
                      <div
                        key={i}
                        className="rounded-xl bg-white border border-[#D7E6F4] p-3.5"
                      >
                        <div className="text-[11px] font-mono text-[#526A82] uppercase tracking-wider mb-1">
                          {spec.label}
                        </div>
                        <div className="text-sm sm:text-base font-bold text-[#10233F] font-mono">
                          {spec.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Technical Diagram Badge (5 cols) */}
                <div className="lg:col-span-5 rounded-2xl bg-white border border-cyan-200 p-6 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-xs font-mono text-[#526A82] pb-3 border-b border-[#D7E6F4] mb-4">
                    <span>STATUS: OPERATIONAL</span>
                    <span className="text-[#1677FF]">LATENCY: ~2.4s / TILE</span>
                  </div>

                  <div className="space-y-3 font-mono text-xs text-[#425873]">
                    <div className="flex items-center justify-between">
                      <span className="text-[#6B7F95]">Pipeline Flow:</span>
                      <span className="text-cyan-700">GeoTIFF → Tensors → SR GeoTIFF</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#6B7F95]">Inference Core:</span>
                      <span className="text-[#10233F]">PyTorch + CUDA Acceleration</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#6B7F95]">Coordinate Sync:</span>
                      <span className="text-emerald-600">EPSG:32644 (UTM 44N)</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-[#D7E6F4] flex items-center justify-between">
                    <span className="text-xs text-[#526A82]">SwinIR Deep Model</span>
                    <span className="px-2.5 py-1 rounded bg-cyan-400/20 text-cyan-700 text-xs font-mono font-bold">
                      v1.4 Production
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })()}
      </div>
    </section>
  );
};

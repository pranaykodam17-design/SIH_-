import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, ZoomIn, Eye, Layers, ArrowRight } from 'lucide-react';

export const Challenge: React.FC = () => {
  const [selectedAspect, setSelectedAspect] = useState<'urban' | 'agri' | 'disaster'>('agri');

  const aspects = {
    agri: {
      title: 'Precision Agriculture',
      lr: 'Mixed boundary pixels blur crop rows, masking early disease and irrigation stress.',
      sr: 'Sub-4m reconstruction separates individual crop parcels and micro-drainage channels.',
    },
    urban: {
      title: 'Urban Cadastre & Planning',
      lr: 'Buildings blend into roadways; individual structures are unresolved at 10m GSD.',
      sr: 'Clear building footprints, distinct arterial roads, and impervious surface detection.',
    },
    disaster: {
      title: 'Emergency Flood Mapping',
      lr: 'Coarse water-land boundaries impede accurate infrastructure damage estimation.',
      sr: 'Exact flood inundation perimeters down to property lines for targeted relief.',
    },
  };

  return (
    <section
      id="challenge"
      className="relative py-20 bg-white border-t border-border overflow-hidden"
    >
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-2xl mb-14">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-ink tracking-tight mb-5">
            The spatial resolution bottleneck
          </h2>

          <p className="text-base sm:text-lg text-slate leading-relaxed mb-3">
            Satellite imagery is essential for Earth observation, but spatial resolution limits what can be detected.
          </p>

          <p className="text-sm sm:text-base text-slate leading-relaxed">
            Sentinel-2 offers 5-day global revisit, but at 10m GSD, small features and fine boundaries remain unresolved.
          </p>
        </div>

        {/* Interactive Comparison Cards */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Card 1: Low Resolution */}
          <div className="group rounded-lg bg-white border border-border p-6 sm:p-8 transition-all duration-200 hover:shadow-card-hover relative overflow-hidden">

            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-md bg-red-50 border border-red-200 flex items-center justify-center text-band-nir">
                  <AlertCircle size={18} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-ink">Low resolution</h3>
                  <p className="text-[12px] text-slate font-mono">10m GSD (Sentinel-2)</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded bg-red-50 text-band-nir font-mono text-[11px] font-medium">
                Original 1×
              </span>
            </div>

            {/* Visual Display */}
            <div className="relative aspect-video rounded-lg overflow-hidden border border-border mb-6 bg-wash">
              <img
                src="/sample-satellite/lr.png"
                alt="Low Resolution Satellite Input"
                className="w-full h-full object-cover filter blur-[0.6px] contrast-95 scale-105"
              />
              <div className="absolute inset-0 bg-red-950/15 pointer-events-none" />
              {/* Simulated Pixel Grid Overlay */}
              <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

              <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-white backdrop-blur-md text-[11px] font-mono text-red-700 border border-red-500/30">
                1 Pixel = 100 m²
              </div>
            </div>

            {/* Constraints List */}
            <ul className="space-y-3 text-sm text-[#425873]">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                <span><strong className="text-[#10233F]">Spectral Bleeding:</strong> Small features blend with surrounding terrain.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                <span><strong className="text-[#10233F]">Pixelated Edges:</strong> Road curves and field perimeters become staircase artifacts.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                <span><strong className="text-[#10233F]">Limited Analytics:</strong> Critical geospatial algorithms fail to classify sub-10m structures.</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Enhanced Resolution */}
          <div className="group rounded-3xl bg-gradient-to-b from-white/[0.07] to-white/[0.02] border border-cyan-200 hover:border-cyan-400/60 p-6 sm:p-8 backdrop-blur-xl transition-all duration-300 relative overflow-hidden shadow-[0_0_40px_rgba(0,212,255,0.08)]">
            <div className="absolute top-0 right-0 w-36 h-36 bg-[#1677FF]/20 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1677FF]/20 border border-cyan-200 flex items-center justify-center text-cyan-700 shadow-[0_0_15px_rgba(0,212,255,0.3)]">
                  <CheckCircle2 size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#10233F]">Enhanced Resolution</h3>
                  <p className="text-xs text-cyan-700 font-mono">Sub-4m Reconstructed GSD (SwinIR-SRM)</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#1677FF]/20 border border-cyan-200 text-cyan-800 font-mono text-xs font-bold">
                Enhanced 3×
              </span>
            </div>

            {/* Visual Display */}
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-cyan-200 mb-6 bg-[#F5FAFF] shadow-[0_0_20px_rgba(0,212,255,0.15)]">
              <img
                src="/sample-satellite/sr.png"
                alt="Enhanced Resolution Super-Resolved Imagery"
                className="w-full h-full object-cover scale-105 transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-cyan-950/10 pointer-events-none" />

              <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-md bg-white backdrop-blur-md text-[11px] font-mono text-cyan-700 border border-cyan-200">
                1 Pixel = 11.1 m² (9× Pixel Density)
              </div>
            </div>

            {/* Super-Resolution Advantages */}
            <ul className="space-y-3 text-sm text-[#425873]">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                <span><strong className="text-[#10233F]">True Sub-Pixel Recovery:</strong> Deep transformer self-attention reconstructs sub-10m textures.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                <span><strong className="text-[#10233F]">Radiometric Consistency:</strong> Preserves multispectral reflectance and NDVI fidelity.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-2 flex-shrink-0" />
                <span><strong className="text-[#10233F]">Commercial-Grade Detail:</strong> Near-commercial geospatial analytics without proprietary satellite costs.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Interactive Domain Context Selector */}
        <div className="rounded-2xl bg-white border border-[#D7E6F4] p-6 backdrop-blur-md">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <span className="text-xs font-mono uppercase tracking-wider text-[#526A82]">
              Impact on Decision-Making:
            </span>
            <div className="flex items-center gap-2">
              {(['agri', 'urban', 'disaster'] as const).map((key) => (
                <button
                  key={key}
                  onClick={() => setSelectedAspect(key)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                    selectedAspect === key
                      ? 'bg-[#1677FF]/20 text-cyan-700 border border-cyan-200 shadow-[0_0_15px_rgba(0,212,255,0.2)]'
                      : 'bg-white text-[#526A82] hover:text-[#425873] border border-[#D7E6F4]'
                  }`}
                >
                  {aspects[key].title}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 pt-3 border-t border-[#D7E6F4]">
            <div>
              <div className="text-xs font-mono text-red-600 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <AlertCircle size={13} /> Bottleneck at 10m
              </div>
              <p className="text-sm text-[#425873] leading-relaxed">
                {aspects[selectedAspect].lr}
              </p>
            </div>
            <div>
              <div className="text-xs font-mono text-cyan-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <CheckCircle2 size={13} /> TerraSR Solution at 3.3m
              </div>
              <p className="text-sm text-[#425873] leading-relaxed">
                {aspects[selectedAspect].sr}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

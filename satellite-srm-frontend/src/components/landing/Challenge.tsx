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
      className="relative py-24 bg-white border-t border-[#D7E6F4] overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-10 w-96 h-96 rounded-full bg-[#1677FF]/[0.03] blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-indigo-500/[0.03] blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1677FF]/20 border border-cyan-400/25 mb-4">
            <Layers size={13} className="text-[#1677FF]" />
            <span className="font-mono text-xs font-semibold tracking-wider text-cyan-700 uppercase">
              SECTION 01 — THE CHALLENGE
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#10233F] tracking-tight mb-6">
            The Spatial Resolution{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Bottleneck
            </span>
          </h2>

          <p className="text-lg sm:text-xl text-[#425873] font-medium italic mb-4 leading-relaxed">
            &ldquo;Satellite imagery provides valuable information for Earth observation, but spatial resolution can limit detailed analysis.&rdquo;
          </p>

          <p className="text-sm sm:text-base text-[#526A82] max-w-2xl mx-auto leading-relaxed">
            Freely available constellations like Sentinel-2 offer unmatched 5-day global revisit rates, but their 10m Ground Sample Distance (GSD) leaves small physical assets and fine boundaries undetectable.
          </p>
        </div>

        {/* Interactive Comparison Cards */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Card 1: Low Resolution */}
          <div className="group rounded-3xl bg-gradient-to-b from-white/[0.05] to-white/[0.02] border border-red-500/20 hover:border-red-500/40 p-6 sm:p-8 backdrop-blur-xl transition-all duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/15 border border-red-400/30 flex items-center justify-center text-red-600">
                  <AlertCircle size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#10233F]">Low Resolution</h3>
                  <p className="text-xs text-[#526A82] font-mono">10m Ground Sample Distance (Sentinel-2)</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-red-500/15 text-red-700 font-mono text-xs font-semibold">
                Original 1×
              </span>
            </div>

            {/* Visual Display */}
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-[#D7E6F4] mb-6 bg-[#F5FAFF]">
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

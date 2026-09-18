import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Waves, Sparkles, Droplets, Leaf, Building, Sun, Eye, Info } from 'lucide-react';

interface BandCard {
  id: string;
  name: string;
  bandCode: string;
  wavelength: string;
  range: string;
  icon: React.ReactNode;
  themeColor: string;
  accentBg: string;
  borderGlow: string;
  badgeColor: string;
  summary: string;
  primaryUses: string[];
  scientificValue: string;
}

export const Multispectral: React.FC = () => {
  const [selectedBand, setSelectedBand] = useState<string>('nir');

  const bands: BandCard[] = [
    {
      id: 'blue',
      name: 'BLUE',
      bandCode: 'Band 2',
      wavelength: '490 nm',
      range: '458 – 523 nm',
      icon: <Droplets size={22} />,
      themeColor: 'text-cyan-400',
      accentBg: 'from-cyan-500/15 to-blue-500/5',
      borderGlow: 'hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(0,212,255,0.2)]',
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30',
      summary:
        'Maximum penetration through shallow aquatic environments and critical for aerosol scattering correction.',
      primaryUses: [
        'Coastal bathymetry and reef health',
        'Atmospheric aerosol optical depth (AOD)',
        'Soil vs. water body distinction',
      ],
      scientificValue:
        'Shortest visible wavelength; essential for true-color RGB synthesis and atmospheric path radiance compensation.',
    },
    {
      id: 'green',
      name: 'GREEN',
      bandCode: 'Band 3',
      wavelength: '560 nm',
      range: '543 – 578 nm',
      icon: <Leaf size={22} />,
      themeColor: 'text-emerald-400',
      accentBg: 'from-emerald-500/15 to-teal-500/5',
      borderGlow: 'hover:border-emerald-400/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
      summary:
        'Captures peak reflectance from healthy green vegetation canopies and sediment dynamics in inland water bodies.',
      primaryUses: [
        'Vegetation vigor & canopy cover',
        'Turbidity & suspended matter in lakes',
        'NDWI water index calculations',
      ],
      scientificValue:
        'Corresponds to the green chlorophyll reflection peak, revealing subtle nuances in plant nutrition and river turbidity.',
    },
    {
      id: 'red',
      name: 'RED',
      bandCode: 'Band 4',
      wavelength: '665 nm',
      range: '650 – 680 nm',
      icon: <Sun size={22} />,
      themeColor: 'text-red-400',
      accentBg: 'from-red-500/15 to-amber-500/5',
      borderGlow: 'hover:border-red-400/50 hover:shadow-[0_0_30px_rgba(239,68,68,0.2)]',
      badgeColor: 'bg-red-500/20 text-red-300 border-red-400/30',
      summary:
        'Strongest chlorophyll-a absorption band. Essential baseline for determining photosynthetic activity and urban materials.',
      primaryUses: [
        'Chlorophyll-a absorption quantification',
        'Urban built-up infrastructure contrast',
        'Soil boundary & geological mapping',
      ],
      scientificValue:
        'Pairs inversely with NIR to formulate the Normalized Difference Vegetation Index (NDVI = (NIR - Red) / (NIR + Red)).',
    },
    {
      id: 'nir',
      name: 'NIR',
      bandCode: 'Band 8 (Near-Infrared)',
      wavelength: '842 nm',
      range: '785 – 900 nm',
      icon: <Sparkles size={22} />,
      themeColor: 'text-violet-400',
      accentBg: 'from-violet-500/15 to-purple-500/5',
      borderGlow: 'hover:border-violet-400/50 hover:shadow-[0_0_30px_rgba(139,92,246,0.25)]',
      badgeColor: 'bg-violet-500/20 text-violet-300 border-violet-400/30',
      summary:
        'Invisible to human eyes, NIR radiation reflects powerfully off spongy plant mesophyll cells and absorbs completely in pure water.',
      primaryUses: [
        'Biomass volume & plant cellular stress',
        'Razor-sharp land-water boundary definition',
        'Drought assessment & soil moisture',
      ],
      scientificValue:
        'The definitive band for bio-physical Earth analysis. Sharp contrast against Red creates high-confidence vegetation and moisture masks.',
    },
  ];

  return (
    <section
      id="multispectral"
      className="relative py-28 bg-[#030914] border-t border-white/[0.06] overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 right-10 w-[500px] h-[500px] rounded-full bg-violet-600/[0.04] blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[450px] h-[450px] rounded-full bg-cyan-600/[0.04] blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/25 mb-4">
            <Waves size={14} className="text-cyan-400" />
            <span className="font-mono text-xs font-semibold tracking-wider text-cyan-300 uppercase">
              SECTION 03 — MULTISPECTRAL DATA
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-6">
            Complementary Spectral{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Intelligence
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Multispectral satellite sensors capture discrete wavebands far beyond the visible spectrum. Each band provides complementary physical measurements of Earth’s atmosphere, vegetation, soil, and water.
          </p>
        </div>

        {/* 4 Spectral Band Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          {bands.map((band) => {
            const isSelected = selectedBand === band.id;
            return (
              <div
                key={band.id}
                onClick={() => setSelectedBand(band.id)}
                className={`cursor-pointer rounded-3xl p-6 sm:p-7 backdrop-blur-xl border transition-all duration-300 flex flex-col justify-between ${
                  isSelected
                    ? `bg-gradient-to-b ${band.accentBg} border-white/25 shadow-[0_0_35px_rgba(255,255,255,0.06)] -translate-y-2`
                    : 'bg-white/[0.03] border-white/[0.08]'
                } ${band.borderGlow}`}
              >
                <div>
                  {/* Top Bar: Icon + Band Code */}
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center justify-center ${band.themeColor}`}>
                      {band.icon}
                    </div>
                    <span className={`px-2.5 py-1 rounded-full border text-[11px] font-mono font-bold ${band.badgeColor}`}>
                      {band.bandCode}
                    </span>
                  </div>

                  {/* Title & Wavelength */}
                  <div className="mb-4">
                    <h3 className="text-2xl font-black text-white tracking-tight">
                      {band.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-sm font-bold font-mono ${band.themeColor}`}>
                        λ {band.wavelength}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        ({band.range})
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-6">
                    {band.summary}
                  </p>
                </div>

                {/* Primary Applications List */}
                <div className="pt-4 border-t border-white/[0.08] space-y-2">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                    Key Indicators
                  </div>
                  {band.primaryUses.map((use, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                      <span className={`w-1.5 h-1.5 rounded-full ${band.themeColor} bg-current`} />
                      <span className="truncate">{use}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Deep Dive Spectral Band Insight Box */}
        {(() => {
          const current = bands.find((b) => b.id === selectedBand) || bands[3];
          return (
            <div className="rounded-3xl bg-gradient-to-r from-white/[0.04] to-cyan-500/[0.02] border border-white/[0.1] p-6 sm:p-8 backdrop-blur-xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08] mb-4">
                <div className="flex items-center gap-3">
                  <span className={`text-xl font-bold font-mono ${current.themeColor}`}>
                    {current.name} Channel Deep Dive
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md bg-white/10 font-mono text-xs text-slate-300">
                    Sentinel-2 MSI
                  </span>
                </div>
                <div className="font-mono text-xs text-slate-400">
                  GSD: 10m Native • TerraSR Scale: 3.3m
                </div>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                <strong className="text-white">Radiometric Role: </strong>
                {current.scientificValue}
              </p>
            </div>
          );
        })()}
      </div>
    </section>
  );
};

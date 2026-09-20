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
      themeColor: 'text-[#1677FF]',
      accentBg: 'from-cyan-500/15 to-blue-500/5',
      borderGlow: 'hover:border-cyan-400/50 hover:shadow-[0_0_30px_rgba(0,212,255,0.2)]',
      badgeColor: 'bg-[#1677FF]/20 text-cyan-700 border-cyan-400/30',
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
      themeColor: 'text-emerald-600',
      accentBg: 'from-emerald-500/15 to-teal-500/5',
      borderGlow: 'hover:border-emerald-400/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]',
      badgeColor: 'bg-emerald-500/20 text-emerald-700 border-emerald-400/30',
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
      themeColor: 'text-red-600',
      accentBg: 'from-red-500/15 to-amber-500/5',
      borderGlow: 'hover:border-red-400/50 hover:shadow-[0_0_30px_rgba(239,68,68,0.2)]',
      badgeColor: 'bg-red-500/20 text-red-700 border-red-400/30',
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
      className="relative py-20 bg-white border-t border-border overflow-hidden"
    >
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-2xl mb-14">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-ink tracking-tight mb-5">
            Complementary spectral intelligence
          </h2>

          <p className="text-base sm:text-lg text-slate leading-relaxed">
            Multispectral sensors capture discrete wavebands far beyond the visible spectrum. Each band provides complementary physical measurements of Earth’s atmosphere, vegetation, soil, and water.
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
                className={`cursor-pointer rounded-lg p-6 border transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white border-band-blue shadow-card-hover -translate-y-1'
                    : 'bg-white border-border hover:border-slate/30'
                }`}
              >
                <div>
                  {/* Top Bar: Icon + Band Code */}
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-10 h-10 rounded-md bg-wash border border-border flex items-center justify-center ${band.themeColor}`}>
                      {band.icon}
                    </div>
                    <span className="px-2 py-0.5 rounded border border-border bg-wash text-[11px] font-mono font-medium text-slate">
                      {band.bandCode}
                    </span>
                  </div>

                  {/* Title & Wavelength */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-ink mb-1">
                      {band.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className={`text-[13px] font-mono font-medium ${band.themeColor}`}>
                        λ {band.wavelength}
                      </span>
                      <span className="text-[12px] text-slate font-mono">
                        ({band.range})
                      </span>
                    </div>
                  </div>

                  <p className="text-[13px] text-slate leading-relaxed mb-6">
                    {band.summary}
                  </p>
                </div>

                {/* Primary Applications List */}
                <div className="pt-4 border-t border-border space-y-2">
                  <div className="text-[11px] font-mono font-medium text-slate mb-2">
                    Key Indicators
                  </div>
                  {band.primaryUses.map((use, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-[13px] text-slate">
                      <span className={`w-1 h-1 rounded-full ${band.themeColor} bg-current`} />
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
            <div className="rounded-lg bg-wash border border-border p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-border mb-4">
                <div className="flex items-center gap-3">
                  <span className={`text-lg font-bold font-mono ${current.themeColor}`}>
                    {current.name} Channel
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white border border-border font-mono text-[11px] text-slate">
                    Sentinel-2 MSI
                  </span>
                </div>
                <div className="font-mono text-[12px] text-slate">
                  GSD: 10m Native • TerraSR Scale: 3.3m
                </div>
              </div>
              <p className="text-[14px] text-slate leading-relaxed">
                <strong className="text-ink font-medium">Radiometric Role: </strong>
                {current.scientificValue}
              </p>
            </div>
          );
        })()}
      </div>
    </section>
  );
};

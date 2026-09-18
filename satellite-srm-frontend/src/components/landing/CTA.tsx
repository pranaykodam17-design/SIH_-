import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Satellite, Sparkles, ShieldCheck, Zap } from 'lucide-react';

export const CTA: React.FC = () => {
  return (
    <section className="relative py-28 bg-[#020b18] border-t border-white/[0.06] overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[450px] rounded-full bg-gradient-to-r from-cyan-500/15 via-blue-600/10 to-indigo-600/15 blur-[160px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative rounded-3xl bg-gradient-to-b from-white/[0.08] via-white/[0.04] to-cyan-500/[0.04] border border-cyan-400/30 p-8 sm:p-14 text-center backdrop-blur-2xl shadow-[0_0_80px_rgba(0,212,255,0.12)] overflow-hidden">
          {/* Subtle Grid Mask */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-400/30 mb-6 shadow-[0_0_20px_rgba(0,212,255,0.2)]">
            <Sparkles size={14} className="text-cyan-300" />
            <span className="font-mono text-xs font-semibold tracking-wider text-cyan-200 uppercase">
              EXPERIENCE THE LIVE PIPELINE
            </span>
          </div>

          {/* Headline */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-6 max-w-3xl mx-auto leading-tight">
            Ready to explore satellite imagery at{' '}
            <span className="bg-gradient-to-r from-cyan-300 via-sky-200 to-blue-400 bg-clip-text text-transparent">
              higher resolution?
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Enhance Sentinel-2 multispectral imagery from 10m to sub-4m spatial clarity in seconds.
            Process custom GeoTIFF tiles or explore pre-computed multi-band benchmarks.
          </p>

          {/* Buttons Row */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
            <Link
              to="/platform"
              className="group inline-flex items-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 bg-[length:200%_auto] hover:bg-right text-slate-950 font-black text-base shadow-[0_0_35px_rgba(0,212,255,0.5)] hover:shadow-[0_0_50px_rgba(0,212,255,0.8)] transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <span>Launch TerraSR Platform</span>
              <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform duration-200" />
            </Link>

            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 hover:text-white font-semibold text-base border border-white/10 hover:border-white/20 backdrop-blur-md transition-all duration-200"
            >
              <span>Browse Sample Gallery</span>
            </Link>
          </div>

          {/* Feature Badges */}
          <div className="pt-8 border-t border-white/[0.08] flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-cyan-400" />
              <span>Full Radiometric Integrity</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-cyan-400" />
              <span>GPU-Accelerated Inference</span>
            </div>
            <div className="flex items-center gap-2">
              <Satellite size={16} className="text-cyan-400" />
              <span>Cloud-Optimized GeoTIFF</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

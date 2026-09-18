import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, Sparkles, Cpu, Satellite, Radio } from 'lucide-react';
import { EarthScene, EarthVisualFallback } from './EarthScene';
import { ErrorBoundary } from '../scene/ErrorBoundary';

export const Hero: React.FC = () => {
  const scrollToHowItWorks = () => {
    const el = document.querySelector('#challenge');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex items-center pt-24 pb-16 lg:py-0 overflow-hidden bg-[#020b18]"
    >
      {/* Background Deep Space Radial Glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-blue-600/[0.07] blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-[600px] h-[600px] rounded-full bg-cyan-500/[0.08] blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/3 w-[500px] h-[500px] rounded-full bg-indigo-600/[0.05] blur-[120px] pointer-events-none" />

      {/* Subtle coordinate / telemetry grid overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-4 items-center min-h-[calc(100vh-6rem)]">
          {/* ── LEFT SIDE: Typography & Actions (5-6 cols) ── */}
          <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-center text-left pt-6 lg:pt-0">
            {/* Small Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 w-fit mb-6 shadow-[0_0_20px_rgba(0,212,255,0.15)]"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
              </span>
              <span className="font-mono text-[11px] font-semibold tracking-wider text-cyan-300 uppercase">
                SATELLITE INTELLIGENCE PLATFORM
              </span>
            </motion.div>

            {/* Large Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: 'easeOut' }}
              className="text-4xl sm:text-5xl md:text-6xl xl:text-[68px] font-black text-white tracking-tight leading-[1.08] mb-6"
            >
              See Earth in{' '}
              <span className="block mt-1 bg-gradient-to-r from-cyan-300 via-blue-400 to-indigo-300 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(0,212,255,0.4)]">
                Higher
              </span>{' '}
              <span className="block bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(0,212,255,0.4)]">
                Resolution.
              </span>
            </motion.h1>

            {/* Supporting Text */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: 'easeOut' }}
              className="text-base sm:text-lg text-slate-300/90 leading-relaxed max-w-xl mb-8 font-normal"
            >
              AI-powered multispectral super-resolution for transforming satellite
              imagery into enhanced high-resolution spatial intelligence.
            </motion.p>

            {/* Buttons Row */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.45, ease: 'easeOut' }}
              className="flex flex-wrap items-center gap-4 mb-10"
            >
              <Link
                to="/platform"
                className="group inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400 bg-[length:200%_auto] hover:bg-right text-slate-950 font-bold text-sm sm:text-base shadow-[0_0_30px_rgba(0,212,255,0.4)] hover:shadow-[0_0_45px_rgba(0,212,255,0.7)] transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <span>Explore Platform</span>
                <ArrowRight size={17} className="group-hover:translate-x-1.5 transition-transform duration-200" />
              </Link>

              <button
                onClick={scrollToHowItWorks}
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.09] text-slate-200 hover:text-white font-semibold text-sm sm:text-base border border-white/10 hover:border-white/20 backdrop-blur-md transition-all duration-200"
              >
                <span>How It Works</span>
                <ChevronDown size={17} className="text-cyan-400" />
              </button>
            </motion.div>

            {/* Quick Metrics / Spec Strip */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="pt-6 border-t border-white/[0.08] grid grid-cols-3 gap-4"
            >
              <div>
                <div className="text-2xl font-black text-cyan-300 font-mono">3×</div>
                <div className="text-xs text-slate-400 mt-0.5">Spatial Scale</div>
              </div>
              <div>
                <div className="text-2xl font-black text-white font-mono">10m→3m</div>
                <div className="text-xs text-slate-400 mt-0.5">GSD Detail</div>
              </div>
              <div>
                <div className="text-2xl font-black text-indigo-300 font-mono">4-Band</div>
                <div className="text-xs text-slate-400 mt-0.5">B, G, R, NIR</div>
              </div>
            </motion.div>
          </div>

          {/* ── RIGHT SIDE: Large Interactive 3D Earth (6-7 cols) ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.1, delay: 0.2, ease: 'easeOut' }}
            className="lg:col-span-6 xl:col-span-7 relative flex items-center justify-center min-h-[480px] sm:min-h-[560px] lg:min-h-[640px] xl:min-h-[700px]"
          >
            {/* Radial glow backdrop behind 3D Earth */}
            <div className="absolute w-[85%] h-[85%] rounded-full bg-gradient-radial from-cyan-500/15 via-blue-600/5 to-transparent blur-2xl pointer-events-none" />

            {/* Live Three.js WebGL Earth Scene wrapped in ErrorBoundary */}
            <div className="w-full h-[460px] sm:h-[540px] lg:h-[620px] xl:h-[680px]">
              <ErrorBoundary fallback={<EarthVisualFallback />}>
                <EarthScene
                  interactive={true}
                  enableZoom={true}
                  autoRotateSpeed={0.7}
                  className="w-full h-full"
                  showHint={true}
                />
              </ErrorBoundary>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

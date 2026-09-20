import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { EarthScene, EarthVisualFallback } from './EarthScene';
import { ErrorBoundary } from '../scene/ErrorBoundary';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);

  const scrollToHowItWorks = () => {
    const el = document.querySelector('#challenge');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // One orchestrated GSAP entrance sequence
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });

    tl.from('.hero-earth', { opacity: 0, scale: 0.95, duration: 0.8 })
      .from('.hero-headline', { opacity: 0, y: 20, duration: 0.5 }, '-=0.3')
      .from('.hero-subtext', { opacity: 0, y: 16, duration: 0.45 }, '-=0.2')
      .from('.hero-actions', { opacity: 0, y: 14, duration: 0.4 }, '-=0.15')
      .from('.hero-stat', { opacity: 0, y: 10, duration: 0.35, stagger: 0.08 }, '-=0.15');
  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen w-full flex items-center pt-20 pb-16 lg:py-0 overflow-hidden bg-white"
    >
      {/* Subtle grid pattern — only in center */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1B2B3A06_1px,transparent_1px),linear-gradient(to_bottom,#1B2B3A06_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_50%_40%_at_50%_50%,#000_60%,transparent_100%)] pointer-events-none" />

      <div className="relative z-10 max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-4 items-center min-h-[calc(100vh-5rem)]">

          {/* Left: text */}
          <div className="lg:col-span-5 flex flex-col justify-center text-left pt-6 lg:pt-0">
            <h1 className="hero-headline text-4xl sm:text-5xl lg:text-[56px] font-bold text-ink tracking-tight leading-[1.1] mb-5">
              See Earth in
              <br />higher resolution.
            </h1>

            <p className="hero-subtext text-base sm:text-lg text-slate leading-relaxed max-w-lg mb-8">
              AI-powered multispectral super-resolution that transforms 10m Sentinel-2
              imagery into sub-4m analysis-ready maps.
            </p>

            <div className="hero-actions flex flex-wrap items-center gap-3 mb-10">
              <Link
                to="/platform"
                className="btn-primary text-sm sm:text-base py-3 px-5"
              >
                <span>Explore platform</span>
                <ArrowRight size={16} />
              </Link>

              <button
                onClick={scrollToHowItWorks}
                className="btn-secondary text-sm sm:text-base py-3 px-5"
              >
                <span>How it works</span>
                <ChevronDown size={16} className="text-band-blue" />
              </button>
            </div>

            {/* Stats strip */}
            <div className="flex flex-wrap gap-8">
              {[
                { value: '3×', label: 'Resolution gain' },
                { value: '4', label: 'Spectral bands' },
                { value: '<4m', label: 'Output GSD' },
              ].map((s) => (
                <div key={s.label} className="hero-stat">
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-ink leading-none">{s.value}</div>
                  <div className="text-[13px] text-slate mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: 3D Earth */}
          <div className="lg:col-span-7 hero-earth relative h-[400px] sm:h-[500px] lg:h-[600px]">
            <ErrorBoundary fallback={<EarthVisualFallback />}>
              <EarthScene interactive={true} showHint={true} />
            </ErrorBoundary>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
        <button
          onClick={scrollToHowItWorks}
          className="flex flex-col items-center gap-1 text-slate/50 hover:text-slate transition-colors"
        >
          <span className="text-[11px]">Scroll</span>
          <ChevronDown size={14} />
        </button>
      </div>
    </section>
  );
};

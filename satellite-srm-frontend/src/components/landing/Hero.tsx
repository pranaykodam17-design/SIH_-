import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Satellite, Compass, Layers, ShieldCheck, Play } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { InteractiveTransformVisual } from './InteractiveTransformVisual';
import { useSrmStore } from '../../store/useSrmStore';

export const Hero: React.FC = () => {
  const navigate = useNavigate();
  const { loadDemoDataset } = useSrmStore();

  const handleDemo = () => {
    loadDemoDataset();
    navigate('/app/results/SRM-NTRO-DEMO-01');
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
      
      {/* Background radial glow & coordinate grid */}
      <div className="absolute inset-0 -z-10 bg-grid-pattern opacity-25"></div>
      <div className="absolute top-1/4 left-1/2 -z-10 h-[500px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-cyan-600/15 via-blue-600/10 to-transparent blur-3xl"></div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 mb-6">
          <Badge variant="cyan" dot className="py-1 px-3 text-xs tracking-widest uppercase">
            AI-POWERED EARTH OBSERVATION
          </Badge>
          <span className="text-xs font-mono text-slate-400 hidden sm:inline">NTRO PS-26142</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight sm:leading-none">
          From 10m Satellite Pixels <br className="hidden sm:block" />
          to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-emerald-400 glow-cyan">Sub-4m</span> Intelligence.
        </h1>

        {/* Concise scientific supporting text */}
        <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-slate-300 leading-relaxed font-sans">
          Reconstruct fine spatial details from medium-resolution multispectral satellite imagery using deep learning, while preserving strict spectral fidelity, geospatial projections, and quantified pixel-level uncertainty.
        </p>

        {/* CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            variant="primary"
            onClick={() => navigate('/app/upload')}
            className="w-full sm:w-auto font-mono font-bold"
          >
            Start Reconstruction
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>

          <Button
            size="lg"
            variant="secondary"
            onClick={handleDemo}
            className="w-full sm:w-auto font-mono"
          >
            <Play className="h-4 w-4 mr-2 text-cyan-400" />
            Explore Live Demo
          </Button>

          <a
            href="#pipeline"
            className="text-xs font-mono text-slate-400 hover:text-cyan-400 underline underline-offset-4 transition-colors"
          >
            Explore the Technology ↓
          </a>
        </div>

        {/* Telemetry pill specs */}
        <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto text-left font-mono">
          <div className="rounded-lg border border-space-border bg-space-card/60 p-3">
            <span className="text-[10px] text-slate-400 uppercase">Input Imagery</span>
            <p className="text-sm font-bold text-white">10m Sentinel-2</p>
          </div>
          <div className="rounded-lg border border-space-border bg-space-card/60 p-3">
            <span className="text-[10px] text-slate-400 uppercase">Target Resolution</span>
            <p className="text-sm font-bold text-cyan-300">&lt; 4m Enhanced GSD</p>
          </div>
          <div className="rounded-lg border border-space-border bg-space-card/60 p-3">
            <span className="text-[10px] text-slate-400 uppercase">Fidelity Constraint</span>
            <p className="text-sm font-bold text-emerald-400">Spectral Loss (NDVI)</p>
          </div>
          <div className="rounded-lg border border-space-border bg-space-card/60 p-3">
            <span className="text-[10px] text-slate-400 uppercase">Reliability Metric</span>
            <p className="text-sm font-bold text-amber-300">MC-Dropout Uncertainty</p>
          </div>
        </div>

        {/* Interactive Satellite Visual */}
        <div className="mt-14">
          <InteractiveTransformVisual />
        </div>

      </div>
    </section>
  );
};

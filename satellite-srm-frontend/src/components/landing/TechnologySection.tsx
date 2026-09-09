import React from 'react';
import { Cpu, Server, Network, Terminal, Shield, Workflow } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Link } from 'react-router-dom';

export const TechnologySection: React.FC = () => {
  return (
    <section id="technology" className="py-20 border-t border-space-border/60 bg-space-darkest/90 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="emerald" className="mb-3 uppercase tracking-wider">
            System Architecture
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Engineered for Scientific Earth Intelligence
          </h2>
          <p className="mt-4 text-slate-300 leading-relaxed text-sm sm:text-base">
            A modular remote sensing stack connecting PyTorch deep learning models to geospatial raster engines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <Card className="border-space-border bg-space-card p-6">
            <Cpu className="h-8 w-8 text-cyan-400 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Multispectral SwinIR</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Residual Swin Transformer blocks (RSTB) with shifted local window attention, capturing long-range contextual spatial relationships across multispectral satellite bands.
            </p>
            <div className="mt-4 pt-4 border-t border-space-border/60 font-mono text-[11px] text-slate-400">
              Params: 11.8M • 4-Channel In/Out
            </div>
          </Card>

          <Card className="border-space-border bg-space-card p-6">
            <Workflow className="h-8 w-8 text-emerald-400 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Seamless Hann-Window Tiling</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Splits full satellite scenes into 64x64 patches with 16px overlap. Blends adjoining predictions with 2D Hann window weighting to eliminate seam artifacts.
            </p>
            <div className="mt-4 pt-4 border-t border-space-border/60 font-mono text-[11px] text-slate-400">
              Gigapixel scale • Zero border discontinuities
            </div>
          </Card>

          <Card className="border-space-border bg-space-card p-6">
            <Network className="h-8 w-8 text-indigo-400 mb-4" />
            <h3 className="text-lg font-bold text-white mb-2">Monte Carlo Dropout Variance</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Executes stochastic forward passes with active dropout at inference time. The spatial variance provides an empirical confidence estimate for every pixel.
            </p>
            <div className="mt-4 pt-4 border-t border-space-border/60 font-mono text-[11px] text-slate-400">
              Epistemic uncertainty • Float32 TIFF
            </div>
          </Card>

        </div>

        <div className="mt-10 text-center">
          <Link
            to="/app/about"
            className="inline-flex items-center gap-2 text-sm font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <span>Explore Complete Interactive Neural Architecture Diagram</span>
            <span>→</span>
          </Link>
        </div>

      </div>
    </section>
  );
};

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Satellite, ShieldCheck, Zap } from 'lucide-react';

export const CTA: React.FC = () => {
  return (
    <section className="relative py-20 bg-wash border-t border-border">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-ink tracking-tight mb-5">
            Ready to explore satellite imagery at higher resolution?
          </h2>

          <p className="text-base sm:text-lg text-slate leading-relaxed mb-8">
            Enhance Sentinel-2 multispectral imagery from 10m to sub-4m spatial clarity.
            Upload your own GeoTIFF tiles or browse pre-computed benchmarks.
          </p>

          <div className="flex flex-wrap items-center gap-3 mb-10">
            <Link
              to="/platform"
              className="btn-primary text-base py-3 px-6"
            >
              <span>Launch platform</span>
              <ArrowRight size={16} />
            </Link>

            <Link
              to="/gallery"
              className="btn-secondary text-base py-3 px-6"
            >
              Browse gallery
            </Link>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-[13px] text-slate">
            <div className="flex items-center gap-2">
              <ShieldCheck size={15} className="text-band-blue" />
              <span>Radiometric integrity</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap size={15} className="text-band-blue" />
              <span>GPU-accelerated</span>
            </div>
            <div className="flex items-center gap-2">
              <Satellite size={15} className="text-band-blue" />
              <span>Cloud-optimized GeoTIFF</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

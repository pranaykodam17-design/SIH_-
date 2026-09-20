import React from 'react';
import { Link } from 'react-router-dom';
import { Satellite, Github, ExternalLink, Mail } from 'lucide-react';

const FOOTER_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Platform', to: '/platform' },
  { label: 'Compare', to: '/compare' },
  { label: 'Analysis', to: '/analysis' },
  { label: 'Use Cases', to: '/use-cases' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'About', to: '/about' },
];

const TECH_TAGS = ['SwinIR', 'Sentinel-2', 'SRGAN', 'PyTorch', 'FastAPI', 'GeoTIFF', 'EPSG:32644'];

export const Footer: React.FC = () => {
  return (
    <footer className="relative border-t border-border bg-white mt-auto">
      <div className="max-w-[1120px] mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-md bg-band-blue flex items-center justify-center">
                <Satellite size={16} className="text-white" />
              </div>
              <div>
                <div className="text-[15px] font-bold text-ink">TerraSR</div>
                <div className="text-[11px] text-slate">Satellite Super-Resolution</div>
              </div>
            </div>
            <p className="text-slate text-sm leading-relaxed max-w-xs">
              Deep learning super-resolution for Sentinel-2 multispectral imagery.
              Transforms 10m imagery into sub-4m analysis-ready maps.
            </p>
            <div className="flex items-center gap-2 mt-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 flex items-center justify-center rounded-md text-slate hover:text-ink hover:bg-wash border border-border transition-colors duration-150"
                title="GitHub"
              >
                <Github size={14} />
              </a>
              <a
                href="mailto:srm@example.com"
                className="w-8 h-8 flex items-center justify-center rounded-md text-slate hover:text-ink hover:bg-wash border border-border transition-colors duration-150"
                title="Email"
              >
                <Mail size={14} />
              </a>
              <a
                href="#"
                className="w-8 h-8 flex items-center justify-center rounded-md text-slate hover:text-ink hover:bg-wash border border-border transition-colors duration-150"
                title="Documentation"
              >
                <ExternalLink size={14} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <div className="text-[13px] font-semibold text-ink mb-3">Navigation</div>
            <ul className="space-y-2">
              {FOOTER_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-slate hover:text-band-blue transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Technology */}
          <div>
            <div className="text-[13px] font-semibold text-ink mb-3">Technology</div>
            <div className="flex flex-wrap gap-1.5 mb-5">
              {TECH_TAGS.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-[11px] font-mono font-medium text-slate bg-wash rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between text-[13px]">
                <span className="text-slate">Input</span>
                <span className="font-mono text-ink">10m GSD</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-slate">Output</span>
                <span className="font-mono text-band-blue">&lt;4m GSD</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-slate">Scale</span>
                <span className="font-mono text-ink">3×</span>
              </div>
              <div className="flex justify-between text-[13px]">
                <span className="text-slate">Sensor</span>
                <span className="font-mono text-ink">Sentinel-2 MSI</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[12px] text-slate">
            Deep Learning Based Super Resolution Mapping · NTRO Problem Statement 26142
          </div>
          <span className="text-[12px] text-slate font-mono">v1.0.0</span>
        </div>
      </div>
    </footer>
  );
};

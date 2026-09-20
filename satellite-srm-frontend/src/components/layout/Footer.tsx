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
    <footer className="relative border-t border-[#D7E6F4] bg-[#EAF4FF] mt-auto">
      {/* Top gradient line */}
      <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-glow-cyan">
                <Satellite size={18} className="text-[#10233F]" />
              </div>
              <div>
                <div className="text-base font-black text-[#10233F] tracking-tight">SRM</div>
                <div className="text-[10px] text-[#6B7F95] tracking-wider">Sharper Earth. Better Decisions.</div>
              </div>
            </div>
            <p className="text-[#6B7F95] text-sm leading-relaxed max-w-xs">
              Deep Learning Based Super Resolution Mapping — transforming 10m Sentinel-2 imagery
              into sub-4m analysis-ready maps using generative AI.
            </p>
            <div className="flex items-center gap-2 mt-5">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white hover:bg-white text-[#6B7F95] hover:text-[#425873] border border-[#D7E6F4] transition-all duration-200"
                title="GitHub"
              >
                <Github size={14} />
              </a>
              <a
                href="mailto:srm@example.com"
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white hover:bg-white text-[#6B7F95] hover:text-[#425873] border border-[#D7E6F4] transition-all duration-200"
                title="Email"
              >
                <Mail size={14} />
              </a>
              <a
                href="#"
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white hover:bg-white text-[#6B7F95] hover:text-[#425873] border border-[#D7E6F4] transition-all duration-200"
                title="Documentation"
              >
                <ExternalLink size={14} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <div className="text-xs font-bold text-[#526A82] uppercase tracking-widest mb-4">Navigation</div>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-[#6B7F95] hover:text-[#1677FF] transition-colors duration-200 flex items-center gap-1.5 group"
                  >
                    <span className="w-0 group-hover:w-3 h-px bg-cyan-400 transition-all duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <div className="text-xs font-bold text-[#526A82] uppercase tracking-widest mb-4">Technology</div>
            <div className="flex flex-wrap gap-2 mb-6">
              {TECH_TAGS.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 text-[11px] font-medium text-[#526A82] bg-white border border-[#D7E6F4] rounded-md"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-[#526A82]">Input Resolution</span>
                <span className="text-[#526A82] font-mono">10m GSD</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#526A82]">Output Resolution</span>
                <span className="text-[#1677FF] font-mono">&lt;4m GSD</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#526A82]">Scale Factor</span>
                <span className="text-[#526A82] font-mono">3× SR</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#526A82]">Sensor</span>
                <span className="text-[#526A82] font-mono">Sentinel-2 MSI</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#D7E6F4] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-[#526A82] text-center sm:text-left">
            Deep Learning Based Super Resolution Mapping · NTRO Problem Statement 26142
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] text-[#526A82]">System Online</span>
            </div>
            <span className="text-[11px] text-[#425873]">v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

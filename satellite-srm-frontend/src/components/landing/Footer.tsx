import React from 'react';
import { Link } from 'react-router-dom';
import { Satellite, Github, ExternalLink, Mail, Award, Globe, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="relative bg-[#010710] border-t border-white/[0.08] text-slate-400">
      {/* Top cyan gradient highlight line */}
      <div className="h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Column 1: Brand & Mission (2 cols) */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 flex items-center justify-center shadow-[0_0_20px_rgba(0,212,255,0.3)]">
                <Satellite size={20} className="text-slate-950" />
              </div>
              <div>
                <div className="text-xl font-black text-white tracking-tight">TerraSR</div>
                <div className="text-xs text-cyan-300 font-medium">Multispectral Intelligence</div>
              </div>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm mb-6">
              AI-Powered Multispectral Super Resolution platform transforming 10m Sentinel-2
              satellite imagery into sub-4m spatial intelligence for defense, agriculture, and environmental observation.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-slate-300">
              <Award size={14} className="text-cyan-400" />
              <span>Smart India Hackathon • NTRO PS-26142</span>
            </div>
          </div>

          {/* Column 2: Platform Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/platform" className="hover:text-cyan-300 transition-colors flex items-center gap-1">
                  <span>Enhance Imagery</span>
                  <ArrowUpRight size={12} className="opacity-60" />
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-cyan-300 transition-colors">
                  Dual-Layer Compare
                </Link>
              </li>
              <li>
                <Link to="/analysis" className="hover:text-cyan-300 transition-colors">
                  Spectral Analytics
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-cyan-300 transition-colors">
                  Sample Gallery
                </Link>
              </li>
              <li>
                <Link to="/use-cases" className="hover:text-cyan-300 transition-colors">
                  Real-World Use Cases
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Technology */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono mb-4">
              Technology
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <span className="text-slate-300 font-medium">SwinIR Transformer</span>
              </li>
              <li>
                <span className="text-slate-300 font-medium">Sentinel-2 (10m L2A)</span>
              </li>
              <li>
                <span className="text-slate-300 font-medium">React Three Fiber</span>
              </li>
              <li>
                <span className="text-slate-300 font-medium">WebGL & Blender</span>
              </li>
              <li>
                <span className="text-slate-300 font-medium">GeoTIFF & EPSG:32644</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Project & Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono mb-4">
              Connect
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="hover:text-cyan-300 transition-colors">
                  About the Project
                </Link>
              </li>
              <li>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1.5"
                >
                  <Github size={14} />
                  <span>GitHub Repository</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:contact@terrasr.ai"
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1.5"
                >
                  <Mail size={14} />
                  <span>Project Contact</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 <strong className="text-slate-300">TerraSR</strong>. AI-Powered Multispectral Super Resolution.
          </div>
          <div className="flex items-center gap-6 font-mono text-[11px]">
            <span>FastAPI Backend</span>
            <span>•</span>
            <span>PyTorch Deep Learning</span>
            <span>•</span>
            <span>Three.js WebGL</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

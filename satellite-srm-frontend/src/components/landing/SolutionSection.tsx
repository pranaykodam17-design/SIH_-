import React from 'react';
import { CheckCircle2, Cpu, Layers, ShieldCheck, Zap, Compass } from 'lucide-react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

export const SolutionSection: React.FC = () => {
  return (
    <section className="py-20 border-t border-blue-100/60 bg-white relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div>
            <Badge variant="emerald" className="mb-3 uppercase tracking-wider">
              Deep Learning Solution
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#10233F] leading-tight">
              Multispectral Super Resolution Mapping with Strict Geospatial Integrity
            </h2>
            <p className="mt-4 text-[#425873] leading-relaxed text-base">
              Satellite-SRM bridges the gap between medium-resolution frequency and high-resolution precision. Our pipeline processes genuine 4-band rasters through a custom SwinIR architecture designed specifically for Earth Observation.
            </p>

            <div className="mt-8 space-y-4">
              
              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center mt-0.5 shrink-0">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#10233F]">Direct 4-Band Processing</h4>
                  <p className="text-xs text-[#526A82] mt-0.5">Operates natively on Blue (B02), Green (B03), Red (B04), and Near-Infrared (B08) rasters without 3-channel RGB loss.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-[#1677FF]/20 text-[#1677FF] flex items-center justify-center mt-0.5 shrink-0">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#10233F]">Spectral Consistency & NDVI Loss</h4>
                  <p className="text-xs text-[#526A82] mt-0.5">Penalizes spectral deviation across vegetation and moisture indices, ensuring that reconstructed pixels maintain correct scientific reflectance.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-indigo-500/20 text-indigo-600 flex items-center justify-center mt-0.5 shrink-0">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#10233F]">Quantified Pixel-Level Uncertainty</h4>
                  <p className="text-xs text-[#526A82] mt-0.5">Utilizes Monte Carlo Dropout variance across inference passes to generate a companion uncertainty map, empowering mission analysts with confidence metrics.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="h-6 w-6 rounded-full bg-sky-500/20 text-sky-600 flex items-center justify-center mt-0.5 shrink-0">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[#10233F]">Production GIS Output</h4>
                  <p className="text-xs text-[#526A82] mt-0.5">Generates standard GeoTIFF rasters with updated affine transforms (EPSG:32644) ready for instant drag-and-drop ingestion into QGIS and ArcGIS.</p>
                </div>
              </div>

            </div>
          </div>

          {/* Graphical diagram card */}
          <div className="relative">
            <div className="rounded-2xl border border-cyan-200 bg-white/80 p-6 backdrop-blur-md shadow-sm glow-box-cyan font-mono text-xs">
              <div className="flex items-center justify-between border-b border-blue-100 pb-3 mb-4">
                <span className="text-[#425873] font-bold">RECONSTRUCTION MATRIX SPECIFICATION</span>
                <Badge variant="cyan">NTRO PS-26142</Badge>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-blue-100/40">
                  <span className="text-[#526A82]">Native Ground Sampling Distance:</span>
                  <span className="text-amber-600 font-bold">10.0 m</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-blue-100/40">
                  <span className="text-[#526A82]">Super-Resolved Ground Sampling Distance:</span>
                  <span className="text-[#1677FF] font-bold">&lt; 4.0 m (3.33 m GSD)</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-blue-100/40">
                  <span className="text-[#526A82]">Scaling Factor:</span>
                  <span className="text-[#10233F] font-bold">x3.0 Spatial Magnification</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-blue-100/40">
                  <span className="text-[#526A82]">Spectral Bands Handled:</span>
                  <span className="text-emerald-600 font-bold">B02 · B03 · B04 · B08</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-blue-100/40">
                  <span className="text-[#526A82]">Inference Architecture:</span>
                  <span className="text-[#10233F] font-bold">Swin Transformer (RSTB Blocks)</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-[#526A82]">Seamless Tiling:</span>
                  <span className="text-[#10233F] font-bold">2D Hann Window Overlap Blend</span>
                </div>
              </div>

              <div className="mt-6 rounded-lg bg-white p-4 border border-blue-100 text-[#425873] text-[11px] leading-relaxed">
                <strong className="text-[#1677FF]">Scientific Note:</strong> The model does not physically acquire new optical measurements; it evaluates statistical spatial dependencies learned across high-resolution training distributions to reconstruct plausible high-frequency boundaries.
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

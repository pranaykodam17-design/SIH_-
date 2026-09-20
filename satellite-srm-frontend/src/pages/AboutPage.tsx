import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, ShieldAlert, BookOpen, BrainCircuit, Target, Scale } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F5FAFF]">
      {/* Header */}
      <div className="border-b border-[#D7E6F4] bg-white/60 backdrop-blur-sm sticky top-[68px] z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-[#6B7F95] hover:text-[#425873] hover:bg-white transition-all"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-black text-[#10233F] leading-none">About SRM</h1>
            <p className="text-xs text-[#6B7F95] mt-0.5">The science behind Super Resolution Mapping</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        
        <div className="text-center mb-16">
          <div className="w-16 h-16 rounded-2xl bg-[#1677FF]/20 border border-cyan-200 flex items-center justify-center mx-auto mb-6">
            <BrainCircuit size={32} className="text-[#1677FF]" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-[#10233F] mb-4">
            Why Super Resolution Mapping?
          </h2>
          <p className="text-[#526A82] text-lg max-w-2xl mx-auto">
            Bridging the gap between the high temporal frequency of open satellite data 
            and the high spatial resolution required for precision analytics.
          </p>
        </div>

        <div className="space-y-12">
          
          {/* Section 1: The Problem */}
          <div className="glass rounded-3xl p-8 border border-[#D7E6F4]">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <Target size={18} className="text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-[#10233F]">The Resolution Trade-off</h3>
            </div>
            <p className="text-[#526A82] leading-relaxed">
              Earth observation traditionally faces a strict trade-off: you can have high spatial resolution 
              (seeing fine details) or high temporal resolution (frequent revisits), but rarely both for free. 
              Missions like Sentinel-2 provide excellent global coverage every 5 days, but at a 10–20m 
              Ground Sample Distance (GSD), which is insufficient for micro-level urban planning or precision agriculture.
            </p>
          </div>

          {/* Section 2: Our Approach */}
          <div className="glass rounded-3xl p-8 border border-cyan-200 shadow-glow-cyan relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#1677FF]/20 border border-cyan-200 flex items-center justify-center">
                  <Scale size={18} className="text-[#1677FF]" />
                </div>
                <h3 className="text-xl font-bold text-[#10233F]">Deep Learning Super Resolution</h3>
              </div>
              <p className="text-[#425873] leading-relaxed mb-6">
                Instead of relying solely on expensive optical hardware, SRM uses deep learning (SwinIR/SRGAN) 
                to computationally reconstruct high-frequency spatial details. The model learns complex mappings 
                from low-resolution to high-resolution patches by studying thousands of paired satellite images.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-[#F5FAFF]/50 p-4 rounded-xl border border-[#D7E6F4]">
                  <h4 className="text-sm font-bold text-[#10233F] mb-2 flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-600" />
                    Spatial Enhancement
                  </h4>
                  <p className="text-xs text-[#526A82]">
                    Upscales 10m Sentinel-2 data to ~3.3m GSD (3× scale factor), revealing field boundaries, roads, and buildings.
                  </p>
                </div>
                <div className="bg-[#F5FAFF]/50 p-4 rounded-xl border border-[#D7E6F4]">
                  <h4 className="text-sm font-bold text-[#10233F] mb-2 flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-600" />
                    Spectral Consistency
                  </h4>
                  <p className="text-xs text-[#526A82]">
                    Custom loss functions ensure that inter-band ratios (like NDVI) are strictly preserved for scientific analysis.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Scientific Credibility & Uncertainty */}
          <div className="glass rounded-3xl p-8 border border-amber-500/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/20 flex items-center justify-center">
                <ShieldAlert size={18} className="text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-[#10233F]">Validation & Uncertainty</h3>
            </div>
            <p className="text-[#526A82] leading-relaxed mb-6">
              AI-generated details are inferred, not physically measured. For scientific and critical operational use, 
              it is essential to quantify the model's confidence. SRM implements Monte Carlo Dropout to generate a 
              spatial uncertainty map alongside the enhanced image.
            </p>

            <div className="bg-amber-500/[0.05] border border-amber-500/15 p-4 rounded-xl text-sm text-amber-600/90 flex items-start gap-3">
              <BookOpen size={18} className="flex-shrink-0 mt-0.5" />
              <div>
                <strong>Important Note for Users:</strong><br/>
                While SRM significantly improves visual interpretation and automated feature extraction, 
                high-uncertainty regions should always be validated against true high-resolution reference data 
                (e.g., PlanetScope, Maxar, or Drone imagery) before making critical decisions.
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

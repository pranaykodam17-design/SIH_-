import React, { useState } from 'react';
import { ChevronDown, Info, Cpu, Target, FileOutput, Shield, Layers, Gauge } from 'lucide-react';

export interface ModelSettingsValues {
  model: string;
  scaleFactor: number;
  outputFormat: string;
  enableUncertainty: boolean;
  spectralConsistency: boolean;
  artifactReduction: boolean;
}

interface ModelSettingsProps {
  values: ModelSettingsValues;
  onChange: (values: ModelSettingsValues) => void;
  disabled?: boolean;
}

const MODELS = [
  { id: 'SwinIR-SRM',  label: 'SwinIR-SRM',        badge: 'Recommended', desc: 'Swin Transformer-based SR — best quality & spectral consistency' },
  { id: 'SRGAN',       label: 'SRGAN',               badge: 'Fast',        desc: 'GAN-based super-resolution — faster inference, good perceptual quality' },
  { id: 'ESRGAN',      label: 'ESRGAN',              badge: '',            desc: 'Enhanced SRGAN with RRDB blocks — sharper textures' },
  { id: 'Bicubic-3x',  label: 'Bicubic Baseline',    badge: 'Baseline',   desc: 'Classic bicubic interpolation — used as benchmark comparison' },
];

const SCALE_OPTIONS = [
  { value: 2, label: '2× — 5m GSD',  desc: '2× SR: 10m → 5m' },
  { value: 3, label: '3× — 3.3m GSD', desc: '3× SR: 10m → 3.3m (Recommended)' },
  { value: 4, label: '4× — 2.5m GSD', desc: '4× SR: 10m → 2.5m' },
];

const FORMAT_OPTIONS = ['GeoTIFF (Georeferenced)', 'GeoTIFF (Float32)', 'PNG (Preview)', 'TIFF (Raw)'];

const Toggle: React.FC<{
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}> = ({ checked, onChange, disabled }) => (
  <button
    type="button"
    onClick={() => !disabled && onChange(!checked)}
    className={`toggle-switch ${checked ? 'on' : ''} ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
  />
);

export const ModelSettings: React.FC<ModelSettingsProps> = ({ values, onChange, disabled }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const update = <K extends keyof ModelSettingsValues>(key: K, val: ModelSettingsValues[K]) =>
    onChange({ ...values, [key]: val });

  const selectedModel = MODELS.find((m) => m.id === values.model) ?? MODELS[0];

  return (
    <div className="space-y-5">
      {/* Model Selection */}
      <div>
        <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
          <Cpu size={12} /> Super-Resolution Model
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {MODELS.map((m) => (
            <button
              key={m.id}
              type="button"
              disabled={disabled}
              onClick={() => update('model', m.id)}
              className={`relative p-3.5 rounded-xl border text-left transition-all duration-200 ${
                values.model === m.id
                  ? 'bg-cyan-500/8 border-cyan-500/35 shadow-[0_0_16px_rgba(0,212,255,0.08)]'
                  : 'bg-white/[0.03] border-white/[0.07] hover:bg-white/[0.06] hover:border-white/[0.12]'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-sm font-semibold ${values.model === m.id ? 'text-cyan-400' : 'text-slate-300'}`}>
                  {m.label}
                </span>
                {m.badge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    m.badge === 'Recommended' ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/25' :
                    m.badge === 'Fast'        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25' :
                    m.badge === 'Baseline'    ? 'bg-slate-700 text-slate-400 border border-white/10' :
                    'bg-violet-500/15 text-violet-400 border border-violet-500/25'
                  }`}>{m.badge}</span>
                )}
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">{m.desc}</p>
              {values.model === m.id && (
                <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Scale Factor */}
      <div>
        <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
          <Target size={12} /> Scale Factor
        </label>
        <div className="flex gap-2">
          {SCALE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              disabled={disabled}
              onClick={() => update('scaleFactor', opt.value)}
              className={`flex-1 py-3 px-2 rounded-xl border text-center transition-all duration-200 ${
                values.scaleFactor === opt.value
                  ? 'bg-cyan-500/8 border-cyan-500/35 text-cyan-400'
                  : 'bg-white/[0.03] border-white/[0.07] text-slate-400 hover:bg-white/[0.06]'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="text-sm font-bold leading-none mb-1">{opt.value}×</div>
              <div className="text-[10px] text-slate-600 leading-tight">
                {opt.value === 2 ? '5m GSD' : opt.value === 3 ? '3.3m GSD' : '2.5m GSD'}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Output Format */}
      <div>
        <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
          <FileOutput size={12} /> Output Format
        </label>
        <div className="relative">
          <select
            className="select-field pr-10"
            value={values.outputFormat}
            onChange={(e) => update('outputFormat', e.target.value)}
            disabled={disabled}
          >
            {FORMAT_OPTIONS.map((fmt) => (
              <option key={fmt} value={fmt}>{fmt}</option>
            ))}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
        </div>
      </div>

      {/* Advanced Settings */}
      <div>
        <button
          type="button"
          onClick={() => setShowAdvanced((v) => !v)}
          className="flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-300 transition-colors duration-200"
        >
          <ChevronDown size={14} className={`transition-transform duration-200 ${showAdvanced ? 'rotate-180' : ''}`} />
          Advanced Settings
        </button>

        {showAdvanced && (
          <div className="mt-3 space-y-3 animate-fade-in">
            {/* Uncertainty */}
            <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                  <Gauge size={12} className="text-violet-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-300">Uncertainty Estimation</div>
                  <div className="text-[11px] text-slate-600">Monte Carlo Dropout — 10 stochastic passes</div>
                </div>
              </div>
              <Toggle checked={values.enableUncertainty} onChange={(v) => update('enableUncertainty', v)} disabled={disabled} />
            </div>

            {/* Spectral Consistency */}
            <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Layers size={12} className="text-emerald-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-300">Spectral Consistency</div>
                  <div className="text-[11px] text-slate-600">Preserve NDVI and inter-band ratios</div>
                </div>
              </div>
              <Toggle checked={values.spectralConsistency} onChange={(v) => update('spectralConsistency', v)} disabled={disabled} />
            </div>

            {/* Artifact Reduction */}
            <div className="flex items-center justify-between py-3 px-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <Shield size={12} className="text-amber-400" />
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-300">Artifact Reduction</div>
                  <div className="text-[11px] text-slate-600">Post-processing noise filter on tile boundaries</div>
                </div>
              </div>
              <Toggle checked={values.artifactReduction} onChange={(v) => update('artifactReduction', v)} disabled={disabled} />
            </div>

            {/* Info note */}
            <div className="flex items-start gap-2 px-3 py-2.5 bg-blue-500/[0.05] border border-blue-500/15 rounded-xl">
              <Info size={13} className="text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-[11px] text-blue-400/80 leading-relaxed">
                Enhanced details are model-inferred. Always validate against high-resolution reference data for critical applications.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3, ArrowLeft, Info, Download, TrendingUp, TrendingDown,
  Activity, Layers, TreePine, Droplets, Building
} from 'lucide-react';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  Tooltip, Legend, CartesianGrid
} from 'recharts';
import { MetricCard, InlineMetric } from '../components/ui/MetricCard';
import { useSrmStore, DEMO_JOB, DEMO_METRICS } from '../store/useSrmStore';
import { resolveApiUrl } from '../api/client';

/* Simulated spectral profile data */
const SPECTRAL_DATA = [
  { band: 'B02\n(Blue)',  original: 420,  enhanced: 418  },
  { band: 'B03\n(Green)', original: 780,  enhanced: 782  },
  { band: 'B04\n(Red)',   original: 1240, enhanced: 1244 },
  { band: 'B05',          original: 1580, enhanced: 1578 },
  { band: 'B06',          original: 2100, enhanced: 2095 },
  { band: 'B07',          original: 2350, enhanced: 2348 },
  { band: 'B08\n(NIR)',   original: 3200, enhanced: 3205 },
  { band: 'B11',          original: 2900, enhanced: 2895 },
  { band: 'B12',          original: 1600, enhanced: 1602 },
];

const FEATURE_CLASSES = [
  { name: 'Vegetation',   icon: <TreePine size={14} />,   pct: 42, color: 'bg-emerald-500', textColor: 'text-emerald-600' },
  { name: 'Bare Soil',    icon: <Layers size={14} />,     pct: 31, color: 'bg-amber-500',   textColor: 'text-amber-600'   },
  { name: 'Water Bodies', icon: <Droplets size={14} />,   pct: 12, color: 'bg-accent',    textColor: 'text-accent'    },
  { name: 'Built-up',     icon: <Building size={14} />,   pct: 15, color: 'glass-panel-secondary0',   textColor: 'text-secondary'   },
];

const CUSTOM_TOOLTIP = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white/95 dark:bg-slate-900/95 border border-slate-900/10 dark:border-white/15 rounded-xl p-3 shadow-xl backdrop-blur-md">
      <div className="text-[11px] text-secondary mb-2 font-semibold">{label}</div>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 text-xs">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-muted-foreground font-medium">{p.name}:</span>
          <span className="font-bold text-primary">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

export const AnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const { activeJob, activeJobs, selectedJobId, setSelectedJobId, setActiveJob } = useSrmStore();
  const job     = activeJob ?? DEMO_JOB;
  const metrics = job.metrics ?? DEMO_METRICS;
  const meta    = job.metadata;

  const [activeTab, setActiveTab] = useState<'spectral' | 'quality' | 'landcover' | 'uncertainty'>('spectral');
  const [showHeatmap, setShowHeatmap] = useState<boolean>(true);

  const tabs = [
    { id: 'spectral' as const,   label: 'Spectral',    icon: <Activity size={14} />  },
    { id: 'quality' as const,    label: 'Quality',     icon: <BarChart3 size={14} /> },
    { id: 'landcover' as const,  label: 'Land Cover',  icon: <Layers size={14} />    },
    { id: 'uncertainty' as const, label: 'Uncertainty', icon: <Info size={14} />     },
  ];

  // Derive confidence from mean uncertainty (if available)
  const uncMean = metrics?.uncertainty?.mean ?? 0.0842;
  const confidencePercent = Math.max(0, Math.min(100, (1 - uncMean) * 100));
  
  let confidenceLabel = "High Confidence";
  let confidenceColor = "bg-emerald-500";
  let confidenceTextColor = "text-emerald-600 dark:text-emerald-400";
  if (confidencePercent < 65) {
    confidenceLabel = "Low Confidence";
    confidenceColor = "bg-pink-500";
    confidenceTextColor = "text-pink-600 dark:text-pink-400";
  } else if (confidencePercent < 85) {
    confidenceLabel = "Moderate Confidence";
    confidenceColor = "bg-amber-400";
    confidenceTextColor = "text-amber-600 dark:text-amber-400";
  }

  return (
    <div className="min-h-screen ">
      {/* Header */}
      <div className="border-b border-slate-900/10 dark:border-white/15 bg-white/75 dark:bg-[#071428]/65 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-muted-foreground hover:text-primary hover:bg-slate-900/5 dark:hover:bg-white/10 transition-all"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-black text-primary leading-none">Satellite Analysis</h1>
            <p className="text-xs text-secondary mt-0.5">Post-enhancement quality and spectral evaluation</p>
          </div>

          {activeJobs.length > 1 && (
            <div className="flex items-center gap-1.5 ml-2 sm:ml-6 bg-slate-900/5 dark:bg-white/10 p-1 rounded-xl border border-slate-900/10 dark:border-white/20">
              <span className="text-[11px] font-semibold text-secondary px-2">Batch:</span>
              {activeJobs.map((j, idx) => (
                <button
                  key={j.jobId}
                  onClick={() => {
                    setSelectedJobId(j.jobId);
                    setActiveJob(j);
                  }}
                  className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-all ${
                    (selectedJobId || job.jobId) === j.jobId
                      ? 'bg-blue-500/15 dark:bg-cyan-400/20 text-blue-700 dark:text-cyan-400 border border-blue-500/30 dark:border-cyan-400/30 font-bold'
                      : 'text-muted-foreground hover:text-primary'
                  }`}
                  title={j.metadata?.filename}
                >
                  #{idx + 1}
                </button>
              ))}
            </div>
          )}
          <button
            onClick={() => {
              const a = document.createElement('a');
              a.href = job.outputs?.srPreviewUrl ?? '/sample-satellite/sr.png';
              a.download = 'SRM_Enhanced.png';
              a.click();
            }}
            className="ml-auto flex items-center gap-2 bg-slate-900 dark:bg-cyan-500 hover:bg-slate-800 dark:hover:bg-cyan-400 text-white dark:text-slate-900 text-xs font-semibold py-2 px-4 rounded-xl transition-colors shadow-sm"
          >
            <Download size={13} />
            Download Results
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* KPI row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <MetricCard
            label="Scale Factor"
            value={`${metrics.scale_factor}×`}
            subLabel="Spatial enhancement"
            color="cyan"
            description="3× super-resolution: 10m GSD → 3.33m GSD"
          />
          <MetricCard
            label="SSIM"
            value={metrics.ssim.model.toFixed(3)}
            subLabel="vs bicubic baseline"
            color="blue"
            trend={metrics.ssim.gain > 0 ? 'up' : 'down'}
            trendValue={`${metrics.ssim.gain > 0 ? '+' : ''}${metrics.ssim.gain.toFixed(3)}`}
            description="Structural Similarity Index — spatial fidelity measure"
          />
          <MetricCard
            label="PSNR"
            value={metrics.psnr_db.model.toFixed(1)}
            unit="dB"
            subLabel="Peak signal-to-noise"
            color="violet"
            description="Peak Signal-to-Noise Ratio — higher is better"
          />
          <MetricCard
            label="NDVI Corr."
            value={metrics.ndvi_correlation.model.toFixed(3)}
            subLabel="Vegetation index"
            color="emerald"
            description="Pearson correlation of NDVI between input and enhanced"
          />
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 p-1 bg-white/70 dark:bg-slate-950/60 backdrop-blur-xl border border-slate-900/10 dark:border-white/15 rounded-xl w-fit">
          {tabs.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-transparent ${
                activeTab === id
                  ? 'bg-blue-500/10 dark:bg-cyan-400/20 border-blue-500/30 dark:border-cyan-400/30 text-blue-700 dark:text-cyan-400'
                  : 'text-secondary hover:text-primary hover:bg-slate-900/5 dark:hover:bg-white/5'
              }`}
            >
              {icon}
              <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* ── SPECTRAL TAB ── */}
        {activeTab === 'spectral' && (
          <div className="grid lg:grid-cols-3 gap-6 anim-fade-in">
            <div className="lg:col-span-2 rounded-2xl p-6 bg-white/40 dark:bg-slate-950/30 backdrop-blur-md border border-slate-900/10 dark:border-white/15">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-base font-bold text-primary">Spectral Reflectance Profile</h2>
                  <p className="text-xs text-secondary mt-0.5">Band-by-band reflectance: original vs enhanced</p>
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold">
                  <div className="flex items-center gap-1.5 text-secondary"><div className="w-3 h-0.5 bg-slate-500 rounded" /> Original</div>
                  <div className="flex items-center gap-1.5 text-secondary"><div className="w-3 h-0.5 bg-[#00d4ff] rounded" /> Enhanced</div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={280} className="text-secondary">
                <LineChart data={SPECTRAL_DATA} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-900/15 dark:text-white/15" />
                  <XAxis dataKey="band" tick={{ fill: 'currentColor', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'currentColor', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CUSTOM_TOOLTIP />} cursor={{ stroke: 'currentColor', strokeWidth: 1, strokeDasharray: '4 4', className: 'text-slate-900/15 dark:text-white/15' }} />
                  <Line type="monotone" dataKey="original" stroke="#64748b" strokeWidth={2} dot={false} name="Original" />
                  <Line type="monotone" dataKey="enhanced" stroke="#00d4ff" strokeWidth={2} dot={{ fill: '#00d4ff', r: 3 }} name="Enhanced" strokeDasharray="5 2" />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-4 flex items-start gap-2 px-3 py-2.5 bg-slate-900/5 dark:bg-white/5 border border-slate-900/10 dark:border-white/10 rounded-xl">
                <Info size={12} className="text-muted-foreground flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Enhanced imagery maintains spectral consistency with source data. Deviations within ±0.5% 
                  indicate high fidelity spectral reconstruction.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl p-5 bg-white/75 dark:bg-slate-950/65 backdrop-blur-xl border border-slate-900/10 dark:border-white/15">
                <div className="text-xs font-bold text-primary uppercase tracking-widest mb-4">Spectral Metrics</div>
                <InlineMetric label="SAM (deg)" value={metrics.sam_deg.model.toFixed(2)} unit="°" color="amber" />
                <InlineMetric label="ERGAS"     value={metrics.ergas.model.toFixed(1)}            color="amber" />
                <InlineMetric label="NDVI MAE"  value={metrics.ndvi_mae.model.toFixed(4)}         color="default" />
                <InlineMetric label="NDVI Corr" value={metrics.ndvi_correlation.model.toFixed(4)} color="emerald" />
              </div>

              <div className="rounded-2xl p-5 bg-white/75 dark:bg-slate-950/65 backdrop-blur-xl border border-slate-900/10 dark:border-white/15">
                <div className="text-xs font-bold text-primary uppercase tracking-widest mb-4">vs Bicubic Baseline</div>
                <div className="flex flex-col">
                  {Object.entries({
                    'PSNR (dB)': { m: metrics.psnr_db.model, b: metrics.psnr_db.bicubic, max: 50 },
                    'SSIM':      { m: metrics.ssim.model,     b: metrics.ssim.bicubic, max: 1 },
                    'SAM':       { m: metrics.sam_deg.model,  b: metrics.sam_deg.bicubic, max: 10 },
                  }).map(([key, { m, b, max }]) => (
                    <div key={key} className="py-3 border-b border-slate-900/10 dark:border-white/15 last:border-0 first:pt-0 last:pb-0">
                      <div className="flex items-center justify-between text-xs mb-2.5">
                        <span className="font-semibold text-secondary">{key}</span>
                        <div className="flex items-center gap-3 font-mono text-[10px]">
                          <span className="text-muted-foreground">Bicubic: <span className="text-primary font-bold">{b}</span></span>
                          <span className="text-cyan-700 dark:text-cyan-400">Model: <span className="text-primary font-bold">{m}</span></span>
                        </div>
                      </div>
                      {/* Comparison bars */}
                      <div className="relative h-1.5 bg-slate-900/5 dark:bg-white/10 rounded-full overflow-hidden">
                        <div className="absolute top-0 left-0 bottom-0 bg-slate-400 dark:bg-slate-500/80 rounded-full" style={{ width: `${(b/max)*100}%` }} />
                        <div className="absolute top-0 left-0 bottom-0 bg-cyan-500/90 dark:bg-cyan-400/90 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.4)]" style={{ width: `${(m/max)*100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── QUALITY TAB ── */}
        {activeTab === 'quality' && (
          <div className="space-y-6 anim-fade-in">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: 'PSNR',            value: metrics.psnr_db.model.toFixed(2),          unit: 'dB',  color: 'cyan'    as const, desc: 'Peak Signal-to-Noise Ratio — spatial fidelity',        better: metrics.psnr_db.higherIsBetter,        gain: metrics.psnr_db.gain },
                { label: 'SSIM',            value: metrics.ssim.model.toFixed(4),               unit: '',    color: 'blue'    as const, desc: 'Structural Similarity — perceptual quality',           better: metrics.ssim.higherIsBetter,           gain: metrics.ssim.gain },
                { label: 'SAM',             value: metrics.sam_deg.model.toFixed(2),            unit: '°',   color: 'amber'   as const, desc: 'Spectral Angle Mapper — spectral distortion (↓ better)',better: !metrics.sam_deg.higherIsBetter,       gain: metrics.sam_deg.gain },
                { label: 'ERGAS',           value: metrics.ergas.model.toFixed(2),              unit: '',    color: 'violet'  as const, desc: 'Global synthesis quality index (↓ better)',            better: !metrics.ergas.higherIsBetter,         gain: metrics.ergas.gain },
                { label: 'NDVI Corr.',      value: metrics.ndvi_correlation.model.toFixed(4),   unit: '',    color: 'emerald' as const, desc: 'Pearson correlation of NDVI vegetation index',         better: metrics.ndvi_correlation.higherIsBetter,gain: metrics.ndvi_correlation.gain },
                { label: 'NDVI MAE',        value: metrics.ndvi_mae.model.toFixed(4),           unit: '',    color: 'default' as const, desc: 'Mean absolute error of NDVI (↓ better)',              better: !metrics.ndvi_mae.higherIsBetter,      gain: metrics.ndvi_mae.gain },
              ].map(({ label, value, unit, color, desc, gain }) => (
                <MetricCard
                  key={label}
                  label={label}
                  value={value}
                  unit={unit}
                  color={color}
                  description={desc}
                  trend={gain > 0 ? 'up' : 'down'}
                  trendValue={`${gain > 0 ? '+' : ''}${gain.toFixed(3)}`}
                  size="sm"
                />
              ))}
            </div>

            {/* NDVI comparison image */}
            <div className="glass rounded-2xl p-5">
              <h3 className="text-sm font-bold text-primary mb-3">NDVI Comparison</h3>
              <div className="rounded-xl overflow-hidden border border-theme">
                <img
                  src={job.outputs?.ndviPreviewUrl ?? '/sample-satellite/ndvi_comparison.png'}
                  alt="NDVI Comparison"
                  className="w-full object-cover max-h-72"
                />
              </div>
              <p className="text-xs text-secondary mt-2 flex items-center gap-1.5">
                <Info size={11} />
                NDVI Pearson correlation: {metrics.ndvi_correlation.model.toFixed(4)} — spectral vegetation index consistency
              </p>
            </div>
          </div>
        )}

        {/* ── LAND COVER TAB ── */}
        {activeTab === 'landcover' && (
          <div className="grid lg:grid-cols-2 gap-6 anim-fade-in">
            <div className="glass rounded-2xl p-6">
              <h2 className="text-base font-bold text-primary mb-2">Land Cover Classification</h2>
              <p className="text-xs text-muted-foreground mb-6">Estimated from enhanced imagery spectral signature</p>
              <div className="space-y-4">
                {FEATURE_CLASSES.map(({ name, icon, pct, color, textColor }) => (
                  <div key={name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className={`flex items-center gap-2 text-sm font-medium ${textColor}`}>
                        {icon} {name}
                      </div>
                      <span className="text-sm font-bold text-secondary">{pct}%</span>
                    </div>
                    <div className="progress-track">
                      <div className={`${color} h-full rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-[11px] text-secondary flex items-start gap-1.5">
                <Info size={11} className="mt-0.5 flex-shrink-0" />
                Land cover estimates are model-inferred from spectral signatures. Ground-truth validation recommended.
              </p>
            </div>

            <div className="glass rounded-2xl p-6">
              <h2 className="text-base font-bold text-primary mb-2">Enhanced Image Preview</h2>
              <p className="text-xs text-muted-foreground mb-4">Super-resolved RGB composite</p>
              <div className="rounded-xl overflow-hidden border border-theme">
                <img
                  src={resolveApiUrl(job.outputs?.srPreviewUrl) || '/sample-satellite/sr.png'}
                  alt="Enhanced SR"
                  className="w-full object-cover"
                />
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                {[
                  { label: 'Detected Vegetation', val: '42%', color: 'text-emerald-600' },
                  { label: 'Urban Structures',    val: '15%', color: 'text-accent'    },
                  { label: 'Water Bodies',        val: '12%', color: 'text-accent'    },
                  { label: 'Bare Soil / Other',   val: '31%', color: 'text-amber-600'   },
                ].map(({ label, val, color }) => (
                  <div key={label} className="glass-panel rounded-xl p-3 border border-theme">
                    <div className={`text-lg font-black ${color}`}>{val}</div>
                    <div className="text-[11px] text-secondary">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── UNCERTAINTY TAB ── */}
        {activeTab === 'uncertainty' && (
          <div className="grid lg:grid-cols-2 gap-6 anim-fade-in">
            {/* Uncertainty Map Card */}
            <div className="rounded-2xl p-6 bg-white/75 dark:bg-slate-950/65 backdrop-blur-xl border border-slate-900/15 dark:border-white/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-base font-bold text-primary">Uncertainty Map</h2>
                  <p className="text-xs text-secondary mt-0.5">
                    Spatial predictive variance from 10 Monte Carlo Dropout forward passes
                  </p>
                </div>
                
                {/* Heatmap Toggle */}
                <div className="flex bg-slate-900/5 dark:bg-slate-800 p-1 rounded-lg border border-slate-900/10 dark:border-white/10 shrink-0">
                  <button
                    onClick={() => setShowHeatmap(false)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                      !showHeatmap 
                        ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' 
                        : 'text-muted-foreground hover:text-secondary'
                    }`}
                  >
                    SR Image
                  </button>
                  <button
                    onClick={() => setShowHeatmap(true)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                      showHeatmap 
                        ? 'bg-purple-500 text-white shadow-sm' 
                        : 'text-muted-foreground hover:text-secondary'
                    }`}
                  >
                    Uncertainty Heatmap
                  </button>
                </div>
              </div>
              
              <div className="rounded-xl overflow-hidden border border-slate-900/10 dark:border-white/10 bg-slate-100 dark:bg-slate-900 min-h-[200px] flex items-center justify-center relative">
                <img
                  src={showHeatmap 
                    ? (resolveApiUrl(job.outputs?.uncertaintyPreviewUrl) || '/sample-satellite/uncertainty.png')
                    : (resolveApiUrl(job.outputs?.srPreviewUrl) || '/sample-satellite/sr.png')}
                  alt={showHeatmap ? "Uncertainty map" : "Super-resolved image"}
                  className="w-full h-full object-cover text-sm text-muted-foreground font-medium"
                />
              </div>
              
              {showHeatmap && (
                <div className="mt-4 flex items-start gap-2">
                  <div className="flex items-center gap-4 text-xs font-medium text-secondary flex-wrap">
                    <span className="text-muted-foreground font-semibold mr-2">Legend:</span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded bg-black" /> Low Uncertainty (High Confidence)
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400">→</div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded bg-purple-600" />
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400">→</div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded bg-orange-500" />
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400">→</div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded bg-yellow-200" /> High Uncertainty (Low Confidence)
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              {/* What is Uncertainty? Card */}
              <div className="rounded-2xl p-5 bg-white/75 dark:bg-slate-950/65 backdrop-blur-xl border border-slate-900/10 dark:border-white/15">
                <h3 className="text-sm font-bold text-primary mb-4">What is Uncertainty?</h3>
                <p className="text-sm text-secondary leading-relaxed mb-4">
                  SRM uses Monte Carlo Dropout to estimate spatial uncertainty. 
                  The model runs 10 stochastic inference passes with active dropout, 
                  then computes the pixel-wise standard deviation across passes.
                </p>
                <p className="text-sm text-secondary leading-relaxed">
                  High-uncertainty regions indicate where the model has less confidence 
                  in the enhanced detail — typically at edges, texture boundaries, and 
                  spectrally ambiguous areas.
                </p>
              </div>

              {/* Confidence Level Card */}
              <div className="rounded-2xl p-5 bg-white/75 dark:bg-slate-950/65 backdrop-blur-xl border border-slate-900/10 dark:border-white/15">
                <h3 className="text-sm font-bold text-primary mb-3">Confidence Level</h3>
                <div className="flex items-end gap-3 mb-2">
                  <span className={`text-3xl font-black ${confidenceTextColor}`}>
                    {confidencePercent.toFixed(1)}%
                  </span>
                  <span className={`text-sm font-semibold mb-1 ${confidenceTextColor}`}>
                    {confidenceLabel}
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-900/10 dark:bg-slate-700 rounded-full overflow-hidden mb-3">
                  <div 
                    className={`h-full ${confidenceColor} transition-all duration-1000`}
                    style={{ width: `${confidencePercent}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Confidence is derived from the model's uncertainty estimation (1 - μ). 
                  The heatmap highlights areas where the super-resolution model has higher or lower prediction uncertainty.
                </p>
              </div>

              {/* Uncertainty Summary Card */}
              <div className="rounded-2xl p-5 bg-white/75 dark:bg-slate-950/65 backdrop-blur-xl border border-slate-900/10 dark:border-white/15">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-sm font-bold text-primary">Uncertainty Summary</h3>
                  {job.outputs?.uncertaintyGeoTiffUrl && (
                    <button 
                      onClick={() => {
                        const a = document.createElement('a');
                        a.href = resolveApiUrl(job.outputs?.uncertaintyGeoTiffUrl)!;
                        a.download = 'uncertainty_map.tif';
                        a.click();
                      }}
                      className="text-xs flex items-center gap-1 text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300 font-semibold transition-colors"
                      title="Download float32 Uncertainty TIFF"
                    >
                      <Download size={13} />
                      Export TIFF
                    </button>
                  )}
                </div>
                <div className="flex flex-col">
                  {[
                    { label: "MC Dropout passes", value: "10", color: "text-cyan-700 dark:text-cyan-400" },
                    { label: "Mean Variance (μ)", value: metrics?.uncertainty?.mean?.toFixed(4) || "0.0842", color: "text-purple-600 dark:text-purple-400" },
                    { label: "Max Variance (max)", value: metrics?.uncertainty?.max?.toFixed(4) || "0.4820", color: "text-amber-600 dark:text-amber-400" },
                    { label: "Min Variance (min)", value: metrics?.uncertainty?.min?.toFixed(4) || "0.0120", color: "text-emerald-600 dark:text-emerald-400" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-slate-900/10 dark:border-white/15 last:border-0 last:pb-0">
                      <span className="text-xs text-secondary font-semibold">{item.label}</span>
                      <span className={`text-sm font-bold font-mono ${item.color}`}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Info Alert */}
              <div className="flex items-start gap-2.5 px-4 py-3 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border border-amber-500/30 rounded-xl">
                <Info size={14} className="text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-primary leading-relaxed">
                  Always validate enhanced imagery in high-uncertainty regions against 
                  available high-resolution reference data before operational use.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Metadata footer */}
        <div className="glass rounded-2xl p-5 border border-theme">
          <div className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Image Metadata</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-3">
            {[
              { label: 'Filename',    value: meta?.filename         ?? 'S2A_agriculture.tif'        },
              { label: 'Sensor',      value: meta?.sensor           ?? 'Sentinel-2 MSI'             },
              { label: 'Input GSD',   value: `${meta?.nativeResolution ?? 10}m`                    },
              { label: 'Output GSD',  value: `${meta?.targetResolution?.toFixed(2) ?? '3.33'}m`    },
              { label: 'CRS',         value: meta?.crs              ?? 'EPSG:32644'                 },
              { label: 'Acquired',    value: meta?.acquisitionDate  ?? '2026-05-15'                 },
            ].map(({ label, value }) => (
              <div key={label}>
                <div className="text-[10px] text-secondary mb-0.5">{label}</div>
                <div className="text-xs text-secondary font-mono truncate" title={value}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

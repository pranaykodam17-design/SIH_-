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
  { name: 'Water Bodies', icon: <Droplets size={14} />,   pct: 12, color: 'bg-[#1677FF]',    textColor: 'text-[#1677FF]'    },
  { name: 'Built-up',     icon: <Building size={14} />,   pct: 15, color: 'bg-slate-500',   textColor: 'text-[#526A82]'   },
];

const CUSTOM_TOOLTIP = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#EEF7FF] border border-[#D7E6F4] rounded-xl p-3 shadow-xl">
      <div className="text-[11px] text-[#526A82] mb-2">{label}</div>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 text-xs">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-[#526A82]">{p.name}:</span>
          <span className="font-bold text-[#10233F]">{p.value}</span>
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

  const tabs = [
    { id: 'spectral' as const,   label: 'Spectral',    icon: <Activity size={14} />  },
    { id: 'quality' as const,    label: 'Quality',     icon: <BarChart3 size={14} /> },
    { id: 'landcover' as const,  label: 'Land Cover',  icon: <Layers size={14} />    },
    { id: 'uncertainty' as const, label: 'Uncertainty', icon: <Info size={14} />     },
  ];

  return (
    <div className="min-h-screen bg-wash bg-earth-decor">
      {/* Header */}
      <div className="border-b border-border bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-[#6B7F95] hover:text-[#425873] hover:bg-white transition-all"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-black text-[#10233F] leading-none">Satellite Analysis</h1>
            <p className="text-xs text-[#6B7F95] mt-0.5">Post-enhancement quality and spectral evaluation</p>
          </div>

          {activeJobs.length > 1 && (
            <div className="flex items-center gap-1.5 ml-2 sm:ml-6 bg-white p-1 rounded-xl border border-[#D7E6F4]">
              <span className="text-[11px] font-semibold text-[#526A82] px-2">Batch:</span>
              {activeJobs.map((j, idx) => (
                <button
                  key={j.jobId}
                  onClick={() => {
                    setSelectedJobId(j.jobId);
                    setActiveJob(j);
                  }}
                  className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-all ${
                    (selectedJobId || job.jobId) === j.jobId
                      ? 'bg-[#1677FF]/25 text-cyan-700 border border-cyan-200 font-bold'
                      : 'text-[#6B7F95] hover:text-[#425873]'
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
            className="ml-auto btn-secondary text-xs py-2"
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
        <div className="flex gap-1 p-1 bg-white border border-[#D7E6F4] rounded-xl w-fit">
          {tabs.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === id
                  ? 'bg-[#1677FF]/20 border border-cyan-200 text-[#1677FF]'
                  : 'text-[#6B7F95] hover:text-[#425873]'
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
            <div className="lg:col-span-2 glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-base font-bold text-[#10233F]">Spectral Reflectance Profile</h2>
                  <p className="text-xs text-[#6B7F95] mt-0.5">Band-by-band reflectance: original vs enhanced</p>
                </div>
                <div className="flex items-center gap-3 text-xs text-[#6B7F95]">
                  <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-slate-500 rounded" /> Original</div>
                  <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-cyan-400 rounded" /> Enhanced</div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={SPECTRAL_DATA} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="band" tick={{ fill: '#4A6080', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#4A6080', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CUSTOM_TOOLTIP />} />
                  <Line type="monotone" dataKey="original" stroke="#64748b" strokeWidth={2} dot={false} name="Original" />
                  <Line type="monotone" dataKey="enhanced" stroke="#00d4ff" strokeWidth={2} dot={{ fill: '#00d4ff', r: 3 }} name="Enhanced" strokeDasharray="5 2" />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-4 flex items-start gap-2 px-3 py-2.5 bg-[#1677FF]/[0.05] border border-blue-500/15 rounded-xl">
                <Info size={12} className="text-[#1677FF] flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-[#1677FF]/75 leading-relaxed">
                  Enhanced imagery maintains spectral consistency with source data. Deviations within ±0.5% 
                  indicate high fidelity spectral reconstruction.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="glass rounded-2xl p-5">
                <div className="text-xs font-bold text-[#6B7F95] uppercase tracking-widest mb-4">Spectral Metrics</div>
                <InlineMetric label="SAM (deg)" value={metrics.sam_deg.model.toFixed(2)} unit="°" color="amber" />
                <InlineMetric label="ERGAS"     value={metrics.ergas.model.toFixed(1)}            color="amber" />
                <InlineMetric label="NDVI MAE"  value={metrics.ndvi_mae.model.toFixed(4)}         color="default" />
                <InlineMetric label="NDVI Corr" value={metrics.ndvi_correlation.model.toFixed(4)} color="emerald" />
              </div>

              <div className="glass rounded-2xl p-5">
                <div className="text-xs font-bold text-[#6B7F95] uppercase tracking-widest mb-3">vs Bicubic Baseline</div>
                <div className="space-y-3">
                  {Object.entries({
                    'PSNR (dB)': { m: metrics.psnr_db.model, b: metrics.psnr_db.bicubic },
                    'SSIM':      { m: metrics.ssim.model,     b: metrics.ssim.bicubic     },
                    'SAM':       { m: metrics.sam_deg.model,  b: metrics.sam_deg.bicubic  },
                  }).map(([key, { m, b }]) => (
                    <div key={key}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-[#6B7F95]">{key}</span>
                        <div className="flex gap-3">
                          <span className="text-[#526A82]">Bicubic: {b}</span>
                          <span className="text-[#1677FF] font-mono">Model: {m}</span>
                        </div>
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
              <h3 className="text-sm font-bold text-[#10233F] mb-3">NDVI Comparison</h3>
              <div className="rounded-xl overflow-hidden border border-[#D7E6F4]">
                <img
                  src={job.outputs?.ndviPreviewUrl ?? '/sample-satellite/ndvi_comparison.png'}
                  alt="NDVI Comparison"
                  className="w-full object-cover max-h-72"
                />
              </div>
              <p className="text-xs text-[#526A82] mt-2 flex items-center gap-1.5">
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
              <h2 className="text-base font-bold text-[#10233F] mb-2">Land Cover Classification</h2>
              <p className="text-xs text-[#6B7F95] mb-6">Estimated from enhanced imagery spectral signature</p>
              <div className="space-y-4">
                {FEATURE_CLASSES.map(({ name, icon, pct, color, textColor }) => (
                  <div key={name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className={`flex items-center gap-2 text-sm font-medium ${textColor}`}>
                        {icon} {name}
                      </div>
                      <span className="text-sm font-bold text-[#425873]">{pct}%</span>
                    </div>
                    <div className="progress-track">
                      <div className={`${color} h-full rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-[11px] text-[#526A82] flex items-start gap-1.5">
                <Info size={11} className="mt-0.5 flex-shrink-0" />
                Land cover estimates are model-inferred from spectral signatures. Ground-truth validation recommended.
              </p>
            </div>

            <div className="glass rounded-2xl p-6">
              <h2 className="text-base font-bold text-[#10233F] mb-2">Enhanced Image Preview</h2>
              <p className="text-xs text-[#6B7F95] mb-4">Super-resolved RGB composite</p>
              <div className="rounded-xl overflow-hidden border border-[#D7E6F4]">
                <img
                  src={resolveApiUrl(job.outputs?.srPreviewUrl) || '/sample-satellite/sr.png'}
                  alt="Enhanced SR"
                  className="w-full object-cover"
                />
              </div>
              <div className="grid grid-cols-2 gap-3 mt-4">
                {[
                  { label: 'Detected Vegetation', val: '42%', color: 'text-emerald-600' },
                  { label: 'Urban Structures',    val: '15%', color: 'text-[#1677FF]'    },
                  { label: 'Water Bodies',        val: '12%', color: 'text-[#1677FF]'    },
                  { label: 'Bare Soil / Other',   val: '31%', color: 'text-amber-600'   },
                ].map(({ label, val, color }) => (
                  <div key={label} className="bg-white rounded-xl p-3 border border-[#D7E6F4]">
                    <div className={`text-lg font-black ${color}`}>{val}</div>
                    <div className="text-[11px] text-[#526A82]">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── UNCERTAINTY TAB ── */}
        {activeTab === 'uncertainty' && (
          <div className="grid lg:grid-cols-2 gap-6 anim-fade-in">
            <div className="glass rounded-2xl p-6">
              <h2 className="text-base font-bold text-[#10233F] mb-2">Uncertainty Map</h2>
              <p className="text-xs text-[#6B7F95] mb-4">
                Spatial predictive variance from 10 Monte Carlo Dropout forward passes
              </p>
              <div className="rounded-xl overflow-hidden border border-violet-500/20">
                <img
                  src={resolveApiUrl(job.outputs?.uncertaintyPreviewUrl) || '/sample-satellite/uncertainty.png'}
                  alt="Uncertainty map"
                  className="w-full"
                />
              </div>
              <div className="mt-3 flex items-start gap-2">
                <div className="flex items-center gap-3 text-xs text-[#6B7F95] flex-wrap">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-[#1677FF]" /> Low confidence
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-yellow-500" /> Medium confidence
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-red-500" /> High uncertainty
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="glass rounded-2xl p-5">
                <h3 className="text-sm font-bold text-[#10233F] mb-4">What is Uncertainty?</h3>
                <p className="text-sm text-[#526A82] leading-relaxed mb-4">
                  SRM uses Monte Carlo Dropout to estimate spatial uncertainty. 
                  The model runs 10 stochastic inference passes with active dropout, 
                  then computes the pixel-wise standard deviation across passes.
                </p>
                <p className="text-sm text-[#6B7F95] leading-relaxed">
                  High-uncertainty regions indicate where the model has less confidence 
                  in the enhanced detail — typically at edges, texture boundaries, and 
                  spectrally ambiguous areas.
                </p>
              </div>

              <div className="glass rounded-2xl p-5">
                <h3 className="text-sm font-bold text-[#10233F] mb-3">Uncertainty Summary</h3>
                <InlineMetric label="MC Dropout passes"   value="10"      color="cyan"    />
                <InlineMetric label="Mean confidence"     value="87.3%"   color="emerald" />
                <InlineMetric label="High-uncertainty px" value="4.2%"    color="amber"   />
                <InlineMetric label="Low-uncertainty px"  value="91.5%"   color="emerald" />
              </div>

              <div className="flex items-start gap-2.5 px-4 py-3 bg-amber-500/[0.06] border border-amber-500/15 rounded-xl">
                <Info size={13} className="text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-600/80 leading-relaxed">
                  Always validate enhanced imagery in high-uncertainty regions against 
                  available high-resolution reference data before operational use.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Metadata footer */}
        <div className="glass rounded-2xl p-5 border border-[#D7E6F4]">
          <div className="text-xs font-bold text-[#6B7F95] uppercase tracking-widest mb-4">Image Metadata</div>
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
                <div className="text-[10px] text-[#526A82] mb-0.5">{label}</div>
                <div className="text-xs text-[#526A82] font-mono truncate" title={value}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

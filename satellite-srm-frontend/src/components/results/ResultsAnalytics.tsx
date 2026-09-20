import React, { useState } from 'react';
import {
  BarChart3, Activity, ShieldAlert, Cpu, Clock, Layers,
  Maximize2, X, Info, CheckCircle2,
  Scale, Sparkles, Compass, AlertTriangle
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  Tooltip, CartesianGrid, Cell
} from 'recharts';
import { ProcessingJob } from '../../types/satellite';
import { resolveApiUrl } from '../../api/client';

interface ResultsAnalyticsProps {
  job: ProcessingJob;
}

/* ─── tiny helpers ────────────────────────────────────────────── */

/** Thin horizontal progress bar */
const ProgressBar: React.FC<{ value: number; max?: number; color: string }> = ({
  value, max = 1, color,
}) => {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="h-1.5 w-full bg-white rounded-full overflow-hidden mt-2">
      <div
        className={`h-full rounded-full transition-all duration-700 ${color}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
};

/** A single data card with optional progress bar */
const DataCell: React.FC<{
  label: string;
  value: React.ReactNode;
  sub?: string;
  accent?: string;
  barValue?: number;
  barMax?: number;
  barColor?: string;
}> = ({ label, value, sub, accent = 'text-[#10233F]', barValue, barMax, barColor }) => (
  <div className="p-3.5 bg-white border border-[#D7E6F4] rounded-xl">
    <span className="text-[11px] font-mono text-[#6B7F95] block mb-1">{label}</span>
    <span className={`text-xl font-black font-mono ${accent} leading-none`}>{value}</span>
    {sub && <span className="text-[10px] text-[#6B7F95] block mt-1">{sub}</span>}
    {barValue !== undefined && barMax !== undefined && barColor && (
      <ProgressBar value={barValue} max={barMax} color={barColor} />
    )}
  </div>
);

/** "Not available" placeholder */
const NA: React.FC<{ label: string }> = ({ label }) => (
  <div className="p-3.5 bg-white border border-[#D7E6F4] rounded-xl">
    <span className="text-[11px] font-mono text-[#526A82] block mb-1">{label}</span>
    <span className="text-xs text-[#526A82] italic">Not available for this input</span>
  </div>
);

/** Section card wrapper */
const Section: React.FC<{
  icon: React.ReactNode;
  title: string;
  badge?: React.ReactNode;
  hoverBorder: string;
  children: React.ReactNode;
}> = ({ icon, title, badge, hoverBorder, children }) => (
  <div className={`glass rounded-2xl p-5 border border-[#D7E6F4] space-y-4 transition-all duration-300 ${hoverBorder}`}>
    <div className="flex items-center justify-between border-b border-[#D7E6F4] pb-3">
      <div className="flex items-center gap-2">
        {icon}
        <h4 className="text-sm font-bold text-[#10233F] uppercase tracking-wider font-mono">{title}</h4>
      </div>
      {badge}
    </div>
    {children}
  </div>
);

/* ─── Custom recharts tooltip ──────────────────────────────────── */
const ChartTooltip = ({
  active, payload, label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#EEF7FF] border border-[#D7E6F4] rounded-xl px-3 py-2 shadow-xl text-xs">
      <div className="text-[#526A82] mb-1 font-mono">{label}</div>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-[#526A82]">{p.name}:</span>
          <span className="font-bold text-[#10233F]">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
export const ResultsAnalytics: React.FC<ResultsAnalyticsProps> = ({ job }) => {
  const [showUncertaintyModal, setShowUncertaintyModal] = useState(false);

  const metrics   = job.metrics;
  const telemetry = job.telemetry;
  const metadata  = job.metadata;
  const outputs   = job.outputs;

  const hasReference = metrics?.hasReferenceData ?? false;

  /* ── 1. MODEL RESULT ─────────────────────────────────────── */
  const inputGsd = telemetry?.inputGsd
    ?? (metadata?.nativeResolution != null ? `${metadata.nativeResolution.toFixed(1)} m` : null);

  const outputGsd = telemetry?.targetGsd
    ?? (metadata?.targetResolution != null ? `${metadata.targetResolution.toFixed(2)} m` : null);

  const scaleFactor: number | null =
    metrics?.scale_factor != null
      ? metrics.scale_factor
      : metadata?.nativeResolution != null && metadata?.targetResolution != null
        ? metadata.nativeResolution / metadata.targetResolution
        : null;

  /* ── 2. IMAGE QUALITY ──────────────────────────────────────── */
  const psnr     = hasReference && metrics?.psnr_db          ? metrics.psnr_db          : null;
  const ssim     = hasReference && metrics?.ssim             ? metrics.ssim             : null;
  const sam      = hasReference && metrics?.sam_deg          ? metrics.sam_deg          : null;
  const ergas    = hasReference && metrics?.ergas            ? metrics.ergas            : null;
  const ndviCorr = hasReference && metrics?.ndvi_correlation ? metrics.ndvi_correlation : null;
  const ndviMae  = hasReference && metrics?.ndvi_mae         ? metrics.ndvi_mae         : null;

  /* Bar chart data — only built when reference data exists */
  const qualityChartData =
    hasReference && psnr && ssim && sam
      ? [
          { metric: 'PSNR',     model: psnr.model,                         bicubic: psnr.bicubic                         },
          { metric: 'SSIM×40',  model: +(ssim.model  * 40).toFixed(2),     bicubic: +(ssim.bicubic  * 40).toFixed(2)     },
          { metric: 'SAM↓',     model: sam.model,                          bicubic: sam.bicubic                          },
          ...(ergas ? [{ metric: 'ERGAS↓', model: ergas.model, bicubic: ergas.bicubic }] : []),
        ]
      : null;

  /* ── 3. UNCERTAINTY ────────────────────────────────────────── */
  const uncStats       = metrics?.uncertainty;
  const meanUnc        = uncStats?.mean != null ? uncStats.mean : null;
  const maxUnc         = uncStats?.max  != null ? uncStats.max  : null;
  const uncertaintyUrl = resolveApiUrl(outputs?.uncertaintyPreviewUrl) ?? null;
  const confidencePct  = meanUnc != null ? Math.round((1 - meanUnc) * 100) : null;

  /* ── 4. PROCESSING ─────────────────────────────────────────── */
  const processingTime = telemetry?.elapsedSeconds   != null ? `${telemetry.elapsedSeconds}s`   : null;
  const inferenceTime  = telemetry?.inferenceSeconds != null ? `${telemetry.inferenceSeconds}s` : null;
  const imageDims      = metadata?.width && metadata?.height
    ? `${metadata.width} \u00d7 ${metadata.height} px` : null;
  const bandCount  = telemetry?.bandCount ?? metadata?.bands?.length ?? null;
  const bandNames  = metadata?.bands?.join(', ') ?? null;

  return (
    <div className="space-y-6">

      {/* ── Section Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#D7E6F4] pb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-lg bg-[#1677FF]/20 border border-cyan-500/25 flex items-center justify-center">
              <BarChart3 size={13} className="text-[#1677FF]" />
            </div>
            <span className="text-xs font-mono font-bold tracking-wider text-[#1677FF] uppercase">
              Mission Analytics
            </span>
          </div>
          <h3 className="text-xl font-bold text-[#10233F] tracking-tight">
            Comprehensive Verification &amp; Metrics
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-white border border-[#D7E6F4] text-[#526A82]">
            Engine: {telemetry?.model || 'SwinIR-SRM'}
          </span>
          {hasReference && (
            <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 flex items-center gap-1">
              <CheckCircle2 size={11} /> Validated Output
            </span>
          )}
        </div>
      </div>

      {/* ── 2×2 analytics grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ══════════════════════════════════════════════════════
            1. MODEL RESULT
        ══════════════════════════════════════════════════════ */}
        <Section
          icon={<Scale size={16} className="text-[#1677FF]" />}
          title="1. Model Result"
          badge={<span className="text-[11px] font-mono text-[#6B7F95]">Resolution Magnification</span>}
          hoverBorder="hover:border-cyan-200"
        >
          <div className="grid grid-cols-3 gap-3">
            {inputGsd
              ? <DataCell label="Input GSD"    value={inputGsd}         sub="Sentinel-2 Native"  accent="text-[#10233F]"    />
              : <NA label="Input GSD" />}
            {outputGsd
              ? <DataCell label="Output GSD"   value={outputGsd}        sub="Deep Learning SR"   accent="text-cyan-700" />
              : <NA label="Output GSD" />}
            {scaleFactor != null
              ? <DataCell label="Scale Factor" value={`${scaleFactor}\u00d7`} sub="Spatial Expansion"  accent="text-[#10233F]"    />
              : <NA label="Scale Factor" />}
          </div>

          {/* Pixel sub-division bar */}
          {scaleFactor != null && inputGsd && outputGsd && (
            <div className="p-3 bg-white border border-[#D7E6F4] rounded-xl space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#526A82]">
                <span>Macro-Pixel \u2192 Sub-Pixel Reconstruction</span>
                <span className="text-[#1677FF] font-semibold">
                  1:{Math.round(scaleFactor * scaleFactor)} Pixel Sub-Division
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-3.5 rounded bg-slate-700/60 border border-slate-600 flex items-center justify-center text-[9px] font-mono text-[#425873]">
                  {inputGsd} Input Pixel
                </div>
                <div className="text-[#6B7F95] text-xs font-mono">\u27a1</div>
                <div
                  className="flex-1 h-3.5 rounded bg-[#1677FF]/20 border border-cyan-200 grid gap-0.5 p-0.5"
                  style={{ gridTemplateColumns: `repeat(${Math.round(scaleFactor)}, 1fr)` }}
                >
                  {Array.from({ length: Math.round(scaleFactor) * Math.round(scaleFactor) }).map((_, i) => (
                    <div key={i} className="bg-cyan-400/60 rounded-[1px]" />
                  ))}
                </div>
              </div>
            </div>
          )}
        </Section>

        {/* ══════════════════════════════════════════════════════
            2. IMAGE QUALITY
        ══════════════════════════════════════════════════════ */}
        <Section
          icon={<Activity size={16} className="text-[#1677FF]" />}
          title="2. Image Quality"
          badge={
            hasReference
              ? <span className="text-[11px] font-mono text-emerald-600 flex items-center gap-1"><CheckCircle2 size={12} /> Reference Data Active</span>
              : <span className="text-[11px] font-mono text-[#6B7F95]">No Ground Truth Reference</span>
          }
          hoverBorder="hover:border-blue-500/30"
        >
          {!hasReference ? (
            <div className="flex items-center gap-2 p-3 bg-amber-500/[0.05] border border-amber-500/15 rounded-xl">
              <AlertTriangle size={14} className="text-amber-600 flex-shrink-0" />
              <p className="text-xs text-amber-600/80">
                PSNR / SSIM require a high-resolution reference image. Not available for this input.
              </p>
            </div>
          ) : (
            <>
              {/* PSNR + SSIM */}
              <div className="grid grid-cols-2 gap-3">
                {psnr
                  ? (
                    <DataCell
                      label="PSNR (dB)"
                      accent="text-[#10233F]"
                      value={<>{psnr.model.toFixed(1)}<span className="text-sm font-normal text-[#6B7F95] ml-1">dB</span></>}
                      sub={`vs ${psnr.bicubic.toFixed(1)} dB baseline \u2022 +${psnr.gain.toFixed(2)} dB gain`}
                      barValue={psnr.model}
                      barMax={50}
                      barColor="bg-blue-400"
                    />
                  )
                  : <NA label="PSNR (dB)" />}

                {ssim
                  ? (
                    <DataCell
                      label="SSIM"
                      accent="text-[#10233F]"
                      value={ssim.model.toFixed(4)}
                      sub={`vs ${ssim.bicubic.toFixed(4)} baseline \u2022 +${ssim.gain.toFixed(4)} gain`}
                      barValue={ssim.model}
                      barMax={1}
                      barColor="bg-cyan-400"
                    />
                  )
                  : <NA label="SSIM" />}
              </div>

              {/* Spectral Consistency */}
              <div className="p-3 bg-white border border-[#D7E6F4] rounded-xl space-y-2">
                <span className="text-[11px] font-mono text-[#526A82] uppercase tracking-wider block">
                  Spectral Consistency Metrics
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                  {([
                    { label: 'SAM (\u00b0)',    m: sam,      fmt: (v: number) => `${v.toFixed(2)}\u00b0`, good: false },
                    { label: 'ERGAS',       m: ergas,    fmt: (v: number) => v.toFixed(2),             good: false },
                    { label: 'NDVI Corr.',  m: ndviCorr, fmt: (v: number) => v.toFixed(3),             good: true  },
                    { label: 'NDVI MAE',    m: ndviMae,  fmt: (v: number) => v.toFixed(4),             good: false },
                  ] as const).map(({ label, m, fmt, good }) =>
                    m ? (
                      <div key={label} className="p-2 rounded bg-white border border-[#D7E6F4]">
                        <span className="text-[10px] text-[#6B7F95] block">{label}</span>
                        <span className="font-bold text-[#10233F]">{fmt(m.model)}</span>
                        <span className={`text-[9px] block ${good ? 'text-emerald-600' : 'text-sky-600'}`}>
                          {good && m.gain > 0 ? '+' : ''}{m.gain.toFixed(3)} vs base
                        </span>
                      </div>
                    ) : (
                      <div key={label} className="p-2 rounded bg-white border border-[#D7E6F4]">
                        <span className="text-[10px] text-[#6B7F95] block">{label}</span>
                        <span className="text-[10px] text-[#526A82] italic">N/A</span>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* Model vs Bicubic bar chart */}
              {qualityChartData && (
                <div className="p-3 bg-white border border-[#D7E6F4] rounded-xl">
                  <div className="text-[11px] font-mono text-[#526A82] uppercase tracking-wider mb-3">
                    Model vs Bicubic Baseline
                  </div>
                  <ResponsiveContainer width="100%" height={120}>
                    <BarChart data={qualityChartData} margin={{ top: 4, right: 4, bottom: 4, left: -20 }} barGap={2}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis dataKey="metric" tick={{ fill: '#4A6080', fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#4A6080', fontSize: 10 }} axisLine={false} tickLine={false} />
                      <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.04)' }} />
                      <Bar dataKey="bicubic" name="Bicubic" radius={[3, 3, 0, 0]} maxBarSize={18}>
                        {qualityChartData.map((_, i) => (
                          <Cell key={i} fill="rgba(100,116,139,0.5)" />
                        ))}
                      </Bar>
                      <Bar dataKey="model" name="Model" radius={[3, 3, 0, 0]} maxBarSize={18}>
                        {qualityChartData.map((_, i) => (
                          <Cell key={i} fill="#00d4ff" />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-[10px] font-mono text-[#6B7F95]">
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-2 rounded-sm bg-slate-500/60 inline-block" /> Bicubic
                    </span>
                    <span className="flex items-center gap-1.5">
                      <span className="w-3 h-2 rounded-sm bg-cyan-400 inline-block" /> Model (SwinIR-SRM)
                    </span>
                    <span className="ml-auto italic">SSIM normalised \u00d740 for readability</span>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Disclaimer — always shown */}
          <div className="flex items-start gap-2 px-3 py-2.5 bg-[#1677FF]/[0.05] border border-blue-500/15 rounded-xl">
            <Info size={12} className="text-[#1677FF] flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-[#1677FF]/75 leading-relaxed">
              Metrics computed vs. a bicubic upsampling baseline. Validate against high-resolution reference data for critical applications.
            </p>
          </div>
        </Section>

        {/* ══════════════════════════════════════════════════════
            3. UNCERTAINTY
        ══════════════════════════════════════════════════════ */}
        <Section
          icon={<ShieldAlert size={16} className="text-amber-600" />}
          title="3. Uncertainty"
          badge={<span className="text-[11px] font-mono text-[#526A82]">Monte Carlo Variance</span>}
          hoverBorder="hover:border-amber-500/30"
        >
          <div className="grid grid-cols-2 gap-3">
            {meanUnc != null
              ? (
                <DataCell
                  label="Mean Uncertainty"
                  accent="text-amber-700"
                  value={
                    <>{meanUnc.toFixed(4)}<span className="text-sm font-normal text-[#6B7F95] ml-1">({(meanUnc * 100).toFixed(1)}%)</span></>
                  }
                  sub="Average spatial variance"
                  barValue={meanUnc}
                  barMax={1}
                  barColor="bg-amber-400"
                />
              )
              : <NA label="Mean Uncertainty" />}

            {maxUnc != null
              ? (
                <DataCell
                  label="Max Uncertainty"
                  accent="text-rose-400"
                  value={
                    <>{maxUnc.toFixed(4)}<span className="text-sm font-normal text-[#6B7F95] ml-1">({(maxUnc * 100).toFixed(1)}%)</span></>
                  }
                  sub="Peak boundary variance"
                  barValue={maxUnc}
                  barMax={1}
                  barColor="bg-rose-400"
                />
              )
              : <NA label="Max Uncertainty" />}
          </div>

          {/* Confidence gauge — only shown when meanUnc is available from backend */}
          {confidencePct != null && (
            <div className="p-3 bg-white border border-[#D7E6F4] rounded-xl space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-[#526A82]">Overall Model Confidence</span>
                <span className="text-emerald-600 font-bold">{confidencePct}%</span>
              </div>
              <div className="h-2 w-full bg-white rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-700"
                  style={{ width: `${confidencePct}%` }}
                />
              </div>
              <p className="text-[10px] text-[#6B7F95]">
                Derived from mean uncertainty: 1 \u2212 {meanUnc!.toFixed(4)} = {confidencePct}% model confidence
              </p>
            </div>
          )}

          {/* Uncertainty visualisation */}
          <div className="p-3 bg-white border border-[#D7E6F4] rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-[#526A82] uppercase tracking-wider">
                Uncertainty Visualization Layer
              </span>
              {uncertaintyUrl && (
                <button
                  onClick={() => setShowUncertaintyModal(true)}
                  className="text-[11px] font-mono text-[#1677FF] hover:text-cyan-700 flex items-center gap-1"
                >
                  <Maximize2 size={10} /> Expand Map
                </button>
              )}
            </div>

            {uncertaintyUrl ? (
              <div className="flex items-center gap-3">
                <div
                  onClick={() => setShowUncertaintyModal(true)}
                  className="w-20 h-20 rounded-lg overflow-hidden border border-[#D7E6F4] cursor-pointer flex-shrink-0 relative group"
                >
                  <img
                    src={uncertaintyUrl}
                    alt="Uncertainty Heatmap"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 size={14} className="text-[#10233F]" />
                  </div>
                </div>
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#526A82]">
                    <span>Low Variance (&lt;0.10)</span>
                    <span>High Variance (&gt;0.40)</span>
                  </div>
                  <div
                    className="h-2 rounded-full w-full border border-[#D7E6F4]"
                    style={{ background: 'linear-gradient(to right, #0f1441, #1e5f87, #beaf1e, #f53c32)' }}
                  />
                  <p className="text-[10px] text-[#6B7F95] leading-tight">
                    Navy: High Confidence \u2022 Yellow/Red: Complex Edges &amp; Shadows
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-xs text-[#526A82] italic py-1">
                Not available for this input
              </div>
            )}
          </div>
        </Section>

        {/* ══════════════════════════════════════════════════════
            4. PROCESSING
        ══════════════════════════════════════════════════════ */}
        <Section
          icon={<Cpu size={16} className="text-violet-400" />}
          title="4. Processing"
          badge={<span className="text-[11px] font-mono text-[#526A82]">Compute Telemetry</span>}
          hoverBorder="hover:border-violet-500/30"
        >
          <div className="grid grid-cols-2 gap-3">
            {processingTime ? (
              <div className="p-3.5 bg-white border border-[#D7E6F4] rounded-xl">
                <div className="flex items-center gap-1.5 mb-1 text-[#6B7F95] text-[11px] font-mono">
                  <Clock size={11} />
                  <span>Processing Time</span>
                </div>
                <span className="text-xl font-black text-[#10233F] font-mono">{processingTime}</span>
                <span className="text-[10px] text-[#6B7F95] block mt-1">Total Pipeline Duration</span>
              </div>
            ) : <NA label="Processing Time" />}

            {inferenceTime ? (
              <div className="p-3.5 bg-white border border-[#D7E6F4] rounded-xl">
                <div className="flex items-center gap-1.5 mb-1 text-[#6B7F95] text-[11px] font-mono">
                  <Sparkles size={11} />
                  <span>Inference Time</span>
                </div>
                <span className="text-xl font-black text-violet-300 font-mono">{inferenceTime}</span>
                <span className="text-[10px] text-[#6B7F95] block mt-1">SwinIR Neural Pass</span>
              </div>
            ) : <NA label="Inference Time" />}

            {imageDims ? (
              <div className="p-3.5 bg-white border border-[#D7E6F4] rounded-xl">
                <div className="flex items-center gap-1.5 mb-1 text-[#6B7F95] text-[11px] font-mono">
                  <Compass size={11} />
                  <span>Image Dimensions</span>
                </div>
                <span className="text-lg font-black text-[#10233F] font-mono leading-tight">{imageDims}</span>
                <span className="text-[10px] text-[#6B7F95] block mt-1">SR Output Raster Grid</span>
              </div>
            ) : <NA label="Image Dimensions" />}

            {bandCount != null ? (
              <div className="p-3.5 bg-white border border-[#D7E6F4] rounded-xl">
                <div className="flex items-center gap-1.5 mb-1 text-[#6B7F95] text-[11px] font-mono">
                  <Layers size={11} />
                  <span>Number of Bands</span>
                </div>
                <span className="text-xl font-black text-[#10233F] font-mono">{bandCount} Bands</span>
                <span className="text-[10px] text-[#6B7F95] block mt-1">
                  {bandNames ?? 'B02, B03, B04, B08'}
                </span>
              </div>
            ) : <NA label="Number of Bands" />}
          </div>

          {/* Tile progress */}
          {telemetry?.tileProgress && (
            <div className="p-2.5 bg-white border border-[#D7E6F4] rounded-xl text-[11px] font-mono text-[#526A82]">
              Tile Progress: <strong className="text-[#10233F]">{telemetry.tileProgress}</strong>
            </div>
          )}

          {/* Hardware row */}
          <div className="p-2.5 bg-white border border-[#D7E6F4] rounded-xl flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-[#526A82]">
            <span>Device: <strong className="text-[#10233F]">{telemetry?.device ?? 'CUDA GPU / PyTorch Fallback'}</strong></span>
            {telemetry?.memoryAllocated && (
              <span>VRAM: <strong className="text-[#1677FF]">{telemetry.memoryAllocated}</strong></span>
            )}
          </div>
        </Section>
      </div>

      {/* ── Uncertainty full-screen modal ── */}
      {showUncertaintyModal && uncertaintyUrl && (
        <div className="fixed inset-0 z-50 bg-white backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
          <div className="glass rounded-2xl p-6 border border-[#D7E6F4] max-w-2xl w-full space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#D7E6F4] pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert size={18} className="text-amber-600" />
                <h3 className="text-base font-bold text-[#10233F]">Spatial Uncertainty Variance Layer</h3>
              </div>
              <button
                onClick={() => setShowUncertaintyModal(false)}
                className="w-7 h-7 rounded-lg bg-white hover:bg-white flex items-center justify-center text-[#425873]"
              >
                <X size={14} />
              </button>
            </div>

            <div className="w-full h-80 sm:h-96 rounded-xl overflow-hidden border border-[#D7E6F4] bg-white flex items-center justify-center">
              <img
                src={uncertaintyUrl}
                alt="High-Resolution Uncertainty Layer"
                className="max-w-full max-h-full object-contain"
              />
            </div>

            <div className="p-3 bg-white border border-[#D7E6F4] rounded-xl space-y-1.5 text-xs font-mono">
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                <span className="text-[#526A82]">
                  Mean: <strong className="text-amber-700">
                    {meanUnc != null ? meanUnc.toFixed(4) : 'N/A'}
                  </strong>
                </span>
                <span className="text-[#526A82]">
                  Max: <strong className="text-rose-400">
                    {maxUnc != null ? maxUnc.toFixed(4) : 'N/A'}
                  </strong>
                </span>
                {confidencePct != null && (
                  <span className="text-[#526A82]">
                    Confidence: <strong className="text-emerald-600">{confidencePct}%</strong>
                  </span>
                )}
              </div>
              <div
                className="h-2.5 rounded-full w-full border border-[#D7E6F4]"
                style={{ background: 'linear-gradient(to right, #0f1441, #1e5f87, #beaf1e, #f53c32)' }}
              />
              <div className="flex items-center justify-between text-[10px] text-[#526A82] pt-1">
                <span>0.00: High Confidence</span>
                <span>0.25: Moderate</span>
                <span>0.50+: Edge Variance</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

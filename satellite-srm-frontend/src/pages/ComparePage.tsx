import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronsLeftRight, Layers, Eye, Diff, Download,
  MapPin, Clock, Cpu, Info, ArrowLeft
} from 'lucide-react';
import { SatelliteComparison } from '../components/ui/SatelliteComparison';
import { InlineMetric } from '../components/ui/MetricCard';
import { useSrmStore, DEMO_JOB } from '../store/useSrmStore';
import { resolveApiUrl } from '../api/client';

type CompareMode = 'slider' | 'split' | 'opacity' | 'difference';

const COMPARE_MODES: { id: CompareMode; label: string; icon: React.ReactNode }[] = [
  { id: 'slider', label: 'Swipe', icon: <ChevronsLeftRight size={15} /> },
  { id: 'split', label: 'Split', icon: <Layers size={15} /> },
  { id: 'opacity', label: 'Opacity', icon: <Eye size={15} /> },
  { id: 'difference', label: 'Difference', icon: <Diff size={15} /> },
];

export const ComparePage: React.FC = () => {
  const navigate = useNavigate();
  const { activeJob, activeJobs, selectedJobId, setSelectedJobId, setActiveJob } = useSrmStore();
  const job = activeJob ?? DEMO_JOB;

  const [mode, setMode] = useState<CompareMode>('slider');
  const [opacity, setOpacity] = useState(60);

  const lrUrl = resolveApiUrl(job.outputs?.lrPreviewUrl) || '/sample-satellite/lr.png';
  const srUrl = resolveApiUrl(job.outputs?.srPreviewUrl) || '/sample-satellite/sr.png';
  const meta = job.metadata;

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = srUrl;
    a.download = `SRM_Enhanced_${meta?.filename || 'output'}.png`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-wash bg-earth-decor">
      {/* ── Header ── */}
      <div className="border-b border-border bg-white/80 backdrop-blur-sm">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-[#6B7F95] hover:text-[#425873] hover:bg-white transition-all duration-200"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-black text-[#10233F] leading-none">Compare Results</h1>
            <p className="text-xs text-[#6B7F95] mt-0.5">Before / after deep learning enhancement</p>
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
                  className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-all ${(selectedJobId || job.jobId) === j.jobId
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

          <div className="ml-auto flex items-center gap-3">
            <button onClick={handleDownload} className="btn-primary text-xs py-2 px-4">
              <Download size={13} />
              Download Enhanced
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main viewer */}
          <div className="lg:col-span-3 space-y-4">
            {/* Mode selector */}
            <div className="flex items-center gap-2 p-1 bg-white border border-[#D7E6F4] rounded-xl w-fit">
              {COMPARE_MODES.map(({ id, label, icon }) => (
                <button
                  key={id}
                  onClick={() => setMode(id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${mode === id
                    ? 'bg-[#1677FF]/20 border border-cyan-200 text-[#1677FF]'
                    : 'text-[#6B7F95] hover:text-[#425873]'
                    }`}
                >
                  {icon}
                  <span className="hidden sm:inline">{label}</span>
                </button>
              ))}
            </div>

            {/* Comparison view */}
            {mode === 'slider' && (
              <SatelliteComparison
                beforeUrl={srUrl}
                afterUrl={lrUrl}
                beforeLabel={`SRM Enhanced · <${meta?.targetResolution?.toFixed(1) || '3.3'}m`}
                afterLabel={`Sentinel-2 · ${meta?.nativeResolution?.toFixed(0) || '10'}m`}
                ndviUrl={resolveApiUrl(job.outputs?.ndviPreviewUrl)}
                uncertaintyUrl={resolveApiUrl(job.outputs?.uncertaintyPreviewUrl)}
                height="560px"
                initialPosition={50}
                bounds={meta?.bounds}
                center={meta?.center}
                crs={meta?.crs}
              />
            )}

            {mode === 'split' && (
              <div className="grid grid-cols-2 gap-3 rounded-2xl overflow-hidden">
                <div className="relative rounded-xl overflow-hidden border border-cyan-200">
                  <img src={srUrl} alt="Enhanced" className="w-full object-cover" style={{ height: '520px' }} />
                  <div className="absolute top-3 left-3 tag-cyan text-[10px]">
                    SRM Enhanced · &lt;{meta?.targetResolution?.toFixed(1) || '3.3'}m
                  </div>
                </div>
                <div className="relative rounded-xl overflow-hidden border border-[#D7E6F4]">
                  <img src={lrUrl} alt="Original" className="w-full object-cover" style={{ height: '520px' }} />
                  <div className="absolute top-3 left-3 px-2.5 py-1 text-[10px] bg-[#F5FAFF]/70 border border-[#D7E6F4] rounded-lg text-[#526A82]">
                    Sentinel-2 · {meta?.nativeResolution?.toFixed(0) || '10'}m
                  </div>
                </div>
              </div>
            )}

            {mode === 'opacity' && (
              <div className="relative rounded-2xl overflow-hidden border border-[#D7E6F4]" style={{ height: '520px' }}>
                <img src={lrUrl} alt="Original" className="absolute inset-0 w-full h-full object-cover" />
                <img
                  src={srUrl}
                  alt="Enhanced"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ opacity: opacity / 100 }}
                />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="glass rounded-xl p-3 border border-[#D7E6F4]">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs text-[#6B7F95]">Original</span>
                      <input
                        type="range"
                        min={0}
                        max={100}
                        value={opacity}
                        onChange={(e) => setOpacity(Number(e.target.value))}
                        className="flex-1"
                      />
                      <span className="text-xs text-[#1677FF]">{opacity}% Enhanced</span>
                    </div>
                  </div>
                </div>
                <div className="absolute top-3 left-3 tag-cyan text-[10px]">Opacity Mode</div>
              </div>
            )}

            {mode === 'difference' && (
              <div className="relative rounded-2xl overflow-hidden border border-violet-500/20" style={{ height: '520px' }}>
                <img
                  src={job.outputs?.uncertaintyPreviewUrl ?? '/sample-satellite/uncertainty.png'}
                  alt="Difference/Uncertainty"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ mixBlendMode: 'luminosity' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-srm-surface to-transparent" />
                <div className="absolute top-3 left-3 px-2.5 py-1 bg-violet-500/20 border border-violet-500/30 rounded-lg text-violet-400 text-[10px] font-bold">
                  Uncertainty / Confidence Map
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="glass rounded-xl px-3 py-2 border border-[#D7E6F4]">
                    <div className="text-[11px] text-[#526A82] flex items-center gap-1.5">
                      <Info size={11} className="text-violet-400" />
                      Brighter regions indicate higher model uncertainty (Monte Carlo Dropout)
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right panel — Metadata */}
          <div className="lg:col-span-1 space-y-4">
            {/* Input info */}
            <div className="glass rounded-2xl p-5">
              <div className="text-xs font-bold text-[#6B7F95] uppercase tracking-widest mb-4">Image Metadata</div>
              <div className="space-y-0">
                <InlineMetric label="Input Resolution" value="10m" color="default" />
                <InlineMetric label="Output Resolution" value={`<${meta?.targetResolution?.toFixed(1) || '3.3'}m`} color="cyan" />
                <InlineMetric label="Scale Factor" value={`${job.metrics?.scale_factor ?? 3}×`} color="cyan" />
                <InlineMetric label="Width" value={`${meta?.width ?? 512}px`} />
                <InlineMetric label="Height" value={`${meta?.height ?? 512}px`} />
                <InlineMetric label="Bands" value="4 (B02-08)" />
                <InlineMetric label="CRS" value={meta?.crs ?? 'EPSG:32644'} />
                <InlineMetric label="Sensor" value="Sentinel-2 MSI" />
              </div>
            </div>

            {/* Model info */}
            <div className="glass rounded-2xl p-5">
              <div className="text-xs font-bold text-[#6B7F95] uppercase tracking-widest mb-4">Processing Info</div>
              <div className="space-y-0">
                <InlineMetric label="Model" value={job.telemetry.model.split(' ')[0]} color="cyan" />
                <InlineMetric label="Device" value={job.telemetry.device.split('/')[0].trim()} />
                <InlineMetric label="Tiles" value={job.telemetry.tileProgress} />
                <InlineMetric label="Elapsed" value={`${job.telemetry.elapsedSeconds}s`} />
                <InlineMetric label="Memory" value={job.telemetry.memoryAllocated} />
                <InlineMetric label="Status" value={job.status} color="emerald" />
              </div>
            </div>

            {/* Location */}
            <div className="glass rounded-2xl p-5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#6B7F95] uppercase tracking-widest mb-3">
                <MapPin size={11} />
                Location
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-[#526A82]">Lat</span>
                  <span className="text-[#526A82] font-mono">{meta?.center?.[0]?.toFixed(4) ?? '17.4106'}°N</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#526A82]">Lon</span>
                  <span className="text-[#526A82] font-mono">{meta?.center?.[1]?.toFixed(4) ?? '78.4776'}°E</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#526A82]">Acquired</span>
                  <span className="text-[#526A82] font-mono">{meta?.acquisitionDate ?? '2026-05-15'}</span>
                </div>
              </div>
            </div>

            {/* Download */}
            <button onClick={handleDownload} className="btn-primary w-full justify-center text-sm">
              <Download size={15} />
              Download GeoTIFF
            </button>

            <button
              onClick={() => navigate('/analysis')}
              className="btn-secondary w-full justify-center text-sm"
            >
              View Analysis
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

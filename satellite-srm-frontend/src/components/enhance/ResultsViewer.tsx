import React from 'react';
import {
  Download, ExternalLink, BarChart3, RefreshCcw,
  CheckCircle, Info, ImageIcon
} from 'lucide-react';
import { ProcessingJob } from '../../types/satellite';
import { SatelliteComparison } from '../ui/SatelliteComparison';
import { MetricCard } from '../ui/MetricCard';

import { resolveApiUrl } from '../../api/client';

interface ResultsViewerProps {
  job: ProcessingJob;
  onNewEnhancement: () => void;
  onViewAnalysis: () => void;
  onViewCompare: () => void;
}

export const ResultsViewer: React.FC<ResultsViewerProps> = ({
  job,
  onNewEnhancement,
  onViewAnalysis,
  onViewCompare,
}) => {
  const outputs = job.outputs;
  const metrics = job.metrics;

  const lrUrl  = resolveApiUrl(outputs?.lrPreviewUrl) || '/sample-satellite/lr.png';
  const srUrl  = resolveApiUrl(outputs?.srPreviewUrl) || '/sample-satellite/sr.png';
  const tifUrl = resolveApiUrl(outputs?.srGeoTiffUrl);
  const uncertaintyUrl = resolveApiUrl(outputs?.uncertaintyPreviewUrl) || '/sample-satellite/uncertainty.png';
  const ndviUrl = resolveApiUrl(outputs?.ndviPreviewUrl) || '/sample-satellite/ndvi_comparison.png';

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = srUrl;
    link.download = `SRM_Enhanced_${job.metadata.filename || 'output'}.png`;
    link.target = '_blank';
    link.click();
  };

  const handleDownloadTiff = () => {
    if (!tifUrl) return;
    const link = document.createElement('a');
    link.href = tifUrl;
    link.download = `SRM_${job.metadata.filename?.replace(/\.[^.]+$/, '') || 'product'}.tif`;
    link.target = '_blank';
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Success banner */}
      <div className="flex items-center gap-3 px-4 py-3 bg-emerald-500/[0.07] border border-emerald-500/20 rounded-xl">
        <CheckCircle size={16} className="text-emerald-400 flex-shrink-0" />
        <div className="flex-1">
          <span className="text-sm font-semibold text-emerald-400">Enhancement Complete</span>
          <span className="text-sm text-slate-500 ml-2">{job.message}</span>
        </div>
        <span className="text-xs text-slate-600 font-mono">{job.telemetry.elapsedSeconds}s</span>
      </div>

      {/* See the Difference heading */}
      <div className="text-center">
        <div className="section-eyebrow justify-center mb-3">Results</div>
        <h3 className="text-2xl font-black text-white mb-2">See the Difference</h3>
        <p className="text-sm text-slate-500">
          Drag the divider to compare input and enhanced imagery
        </p>
      </div>

      {/* Comparison Slider */}
      <SatelliteComparison
        beforeUrl={srUrl}
        afterUrl={lrUrl}
        beforeLabel={`SRM Enhanced · <${job.metadata.targetResolution?.toFixed(1) || '3.3'}m`}
        afterLabel={`Sentinel-2 · ${job.metadata.nativeResolution?.toFixed(0) || '10'}m`}
        height="440px"
        showControls={true}
        initialPosition={60}
      />

      {/* Action buttons */}
      <div className="flex flex-wrap gap-3">
        <button onClick={handleDownload} className="btn-primary flex-1 sm:flex-none justify-center">
          <Download size={15} />
          Download PNG
        </button>
        {tifUrl && (
          <button onClick={handleDownloadTiff} className="btn-secondary flex-1 sm:flex-none justify-center text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/10">
            <Download size={14} />
            Download GeoTIFF (.tif)
          </button>
        )}
        <button onClick={onViewCompare} className="btn-secondary flex-1 sm:flex-none justify-center">
          <ExternalLink size={14} />
          Full Comparison
        </button>
        <button onClick={onViewAnalysis} className="btn-secondary flex-1 sm:flex-none justify-center">
          <BarChart3 size={14} />
          Analysis
        </button>
        <button onClick={onNewEnhancement} className="btn-secondary flex-1 sm:flex-none justify-center">
          <RefreshCcw size={14} />
          New Image
        </button>
      </div>

      {/* Metrics grid */}
      {metrics && (
        <div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Quality Metrics</div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <MetricCard
              label="Scale Factor"
              value={`${metrics.scale_factor}×`}
              subLabel="Spatial enhancement"
              color="cyan"
              size="sm"
            />
            <MetricCard
              label="SSIM"
              value={metrics.ssim.model.toFixed(3)}
              subLabel="Structural similarity"
              color="blue"
              size="sm"
            />
            <MetricCard
              label="PSNR"
              value={metrics.psnr_db.model.toFixed(1)}
              unit="dB"
              subLabel="Peak signal-to-noise"
              color="violet"
              size="sm"
            />
            <MetricCard
              label="NDVI Corr."
              value={metrics.ndvi_correlation.model.toFixed(3)}
              subLabel="Vegetation index fidelity"
              color="emerald"
              size="sm"
            />
          </div>

          {/* Scientific disclaimer */}
          <div className="mt-3 flex items-start gap-2 px-3 py-2.5 bg-blue-500/[0.05] border border-blue-500/15 rounded-xl">
            <Info size={12} className="text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-blue-400/75 leading-relaxed">
              Metrics are computed vs. a bicubic baseline. Model-inferred spatial details must be validated 
              against high-resolution reference data for critical applications.
            </p>
          </div>
        </div>
      )}

      {/* Output file links */}
      {outputs && (
        <div>
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Output Artifacts</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {[
              { label: 'SR GeoTIFF',       url: tifUrl,                          ext: 'TIF',  desc: 'Georeferenced EPSG:32644' },
              { label: 'SR Preview',        url: srUrl,                           ext: 'PNG',  desc: 'RGB composite preview' },
              { label: 'Uncertainty Map',   url: uncertaintyUrl,                  ext: 'PNG',  desc: 'Spatial confidence map' },
              { label: 'NDVI Comparison',   url: ndviUrl,                         ext: 'PNG',  desc: 'Vegetation index overlay' },
            ].map(({ label, url, ext, desc }) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 px-3.5 py-3 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.07] hover:border-white/[0.12] rounded-xl transition-all duration-200 group"
              >
                <div className="w-8 h-8 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center flex-shrink-0">
                  <ImageIcon size={14} className="text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-300 group-hover:text-slate-100 transition-colors">{label}</div>
                  <div className="text-[11px] text-slate-600">{desc}</div>
                </div>
                <span className="text-[10px] font-mono text-slate-600 group-hover:text-slate-400 transition-colors">{ext}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

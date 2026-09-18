import React from 'react';
import {
  Download, ExternalLink, BarChart3, RefreshCcw,
  CheckCircle, Info
} from 'lucide-react';
import { ProcessingJob } from '../../types/satellite';
import { InteractiveComparisonViewer } from '../results/InteractiveComparisonViewer';
import { MultispectralPanel } from '../results/MultispectralPanel';
import { MetricCard } from '../ui/MetricCard';
import { GisProductsPanel } from '../results/GisProductsPanel';
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

  // Real 4-Band and False Color Preview URLs
  const b02Url = resolveApiUrl(outputs?.b02PreviewUrl) || '/sample-satellite/b02.png';
  const b03Url = resolveApiUrl(outputs?.b03PreviewUrl) || '/sample-satellite/b03.png';
  const b04Url = resolveApiUrl(outputs?.b04PreviewUrl) || '/sample-satellite/b04.png';
  const b08Url = resolveApiUrl(outputs?.b08PreviewUrl) || '/sample-satellite/b08.png';
  const falseColorUrl = resolveApiUrl(outputs?.falseColorPreviewUrl) || '/sample-satellite/false_color.png';

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
    <div className="space-y-8">
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
          Drag the vertical divider, use mouse wheel to zoom, and drag to pan across the imagery
        </p>
      </div>

      {/* Large Interactive Before vs Super-Resolved Comparison Viewer */}
      <InteractiveComparisonViewer
        originalUrl={lrUrl}
        superResolvedUrl={srUrl}
        ndviUrl={ndviUrl}
        uncertaintyUrl={uncertaintyUrl}
        originalLabel="ORIGINAL"
        superResolvedLabel="SUPER-RESOLVED"
        originalResolution={`${job.metadata.nativeResolution?.toFixed(0) || '10'}m GSD`}
        enhancedResolution={`~${job.metadata.targetResolution?.toFixed(2) || '3.33'}m GSD`}
        crs={job.metadata.crs || 'EPSG:32644 (UTM Zone 44N)'}
        bounds={job.metadata.bounds}
        center={job.metadata.center}
        height="560px"
        initialPosition={50}
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

      {/* ── Professional Multispectral Visualization Panel (Real 4-Band Data) ── */}
      <MultispectralPanel
        srPreviewUrl={srUrl}
        b02Url={b02Url}
        b03Url={b03Url}
        b04Url={b04Url}
        b08Url={b08Url}
        falseColorUrl={falseColorUrl}
        bounds={job.metadata.bounds}
        crs={job.metadata.crs}
        resolution={`~${job.metadata.targetResolution?.toFixed(2) || '3.33'}m GSD`}
      />

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

      {/* GIS Export Panel */}
      {outputs && (
        <GisProductsPanel job={job} />
      )}
    </div>
  );
};

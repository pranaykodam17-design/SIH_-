import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSrmStore, DEMO_JOB } from '../store/useSrmStore';
import { ImageComparisonSlider } from '../components/results/ImageComparisonSlider';
import { SplitScreenComparison } from '../components/results/SplitScreenComparison';
import { UncertaintyViewer } from '../components/results/UncertaintyViewer';
import { NDVIViewer } from '../components/results/NDVIViewer';
import { MetricCard } from '../components/results/MetricCard';
import { GisProductsPanel } from '../components/results/GisProductsPanel';
import { GeoMap } from '../components/map/GeoMap';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Sliders, SplitSquareVertical, ShieldAlert, Sprout, Download, BarChart2, CheckCircle2 } from 'lucide-react';

export const ResultsPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const { activeJob } = useSrmStore();

  const currentJob = activeJob || DEMO_JOB;
  const outputs = currentJob.outputs || DEMO_JOB.outputs!;
  const metrics = currentJob.metrics || DEMO_JOB.metrics!;
  const metadata = currentJob.metadata || DEMO_JOB.metadata;

  const [activeTab, setActiveTab] = useState<'slider' | 'split' | 'uncertainty' | 'ndvi'>('slider');

  return (
    <div className="space-y-8">
      
      {/* Top Completion Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-space-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-3 w-3 rounded-full bg-emerald-400"></span>
            <h1 className="text-2xl font-bold font-mono text-white">
              RECONSTRUCTION COMPLETED: {currentJob.jobId}
            </h1>
          </div>
          <p className="text-xs font-mono text-slate-400">
            Spatial magnification: 10m Sentinel-2 → Sub-4m (3.33m GSD) • Strict EPSG:32644 preservation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="emerald" dot>
            QGIS / ARCGIS READY
          </Badge>
          <Link
            to={`/app/validation/${currentJob.jobId}`}
            className="px-3 py-1.5 rounded-lg border border-cyan-500/40 bg-space-elevated hover:bg-space-border text-cyan-300 text-xs font-mono font-bold transition-colors"
          >
            Validation Suite →
          </Link>
        </div>
      </div>

      {/* Primary 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="PSNR" entry={metrics.psnr_db} subtitle="Peak Signal-to-Noise Ratio" />
        <MetricCard label="SSIM" entry={metrics.ssim} subtitle="Structural Similarity" />
        <MetricCard label="SAM" entry={metrics.sam_deg} subtitle="Spectral Angle Mapper" />
        <MetricCard label="NDVI Pearson" entry={metrics.ndvi_correlation} subtitle="Vegetation Correlation" />
      </div>

      {/* Visualization Tab Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-space-border pb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('slider')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
              activeTab === 'slider'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-space-elevated'
            }`}
          >
            <Sliders className="h-3.5 w-3.5" />
            <span>Comparison Slider</span>
          </button>

          <button
            onClick={() => setActiveTab('split')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
              activeTab === 'split'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-space-elevated'
            }`}
          >
            <SplitSquareVertical className="h-3.5 w-3.5" />
            <span>Split-Screen View</span>
          </button>

          <button
            onClick={() => setActiveTab('uncertainty')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
              activeTab === 'uncertainty'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-space-elevated'
            }`}
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>Model Uncertainty</span>
          </button>

          <button
            onClick={() => setActiveTab('ndvi')}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-mono font-bold transition-all ${
              activeTab === 'ndvi'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-space-elevated'
            }`}
          >
            <Sprout className="h-3.5 w-3.5" />
            <span>NDVI Vegetation</span>
          </button>
        </div>

        <div className="text-xs font-mono text-slate-500 hidden sm:block">
          Sensor: {metadata.sensor}
        </div>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'slider' && (
          <ImageComparisonSlider
            lrUrl={outputs.lrPreviewUrl}
            srUrl={outputs.srPreviewUrl}
          />
        )}

        {activeTab === 'split' && (
          <SplitScreenComparison
            lrUrl={outputs.lrPreviewUrl}
            srUrl={outputs.srPreviewUrl}
          />
        )}

        {activeTab === 'uncertainty' && (
          <UncertaintyViewer
            srUrl={outputs.srPreviewUrl}
            uncertaintyUrl={outputs.uncertaintyPreviewUrl}
          />
        )}

        {activeTab === 'ndvi' && (
          <NDVIViewer
            ndviUrl={outputs.ndviPreviewUrl}
          />
        )}
      </div>

      {/* Geospatial AOI Footprint & Bounding Box Map */}
      <GeoMap
        bounds={metadata.bounds}
        center={metadata.center}
        crs={metadata.crs}
        nativeRes={metadata.nativeResolution}
        targetRes={metadata.targetResolution}
      />

      {/* GIS Products Download Panel */}
      <GisProductsPanel job={currentJob} />

    </div>
  );
};

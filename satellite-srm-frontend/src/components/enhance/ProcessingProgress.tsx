import React from 'react';
import { CheckCircle2, Clock, Loader2, AlertCircle, ArrowDown } from 'lucide-react';
import { ProcessingJob, ProcessingStageId } from '../../types/satellite';

interface ProcessingProgressProps {
  job: ProcessingJob;
}

interface RealStage {
  id: string;
  label: string;
  description: string;
  matches: (currentStage: ProcessingStageId, isCompleted: boolean) => 'completed' | 'active' | 'pending';
}

const REAL_STAGES: RealStage[] = [
  {
    id: 'stage_1',
    label: 'Preparing imagery',
    description: 'Ingesting raster structure & validating TIFF headers',
    matches: (curr, done) => {
      if (done) return 'completed';
      if (curr === 'ingestion') return 'active';
      return 'completed'; // ingestion is first, so if curr is anything else it is completed
    },
  },
  {
    id: 'stage_2',
    label: 'Reading bands',
    description: 'Calibrating radiometric channels (B02, B03, B04, B08) & patch tiling',
    matches: (curr, done) => {
      if (done) return 'completed';
      if (curr === 'ingestion') return 'pending';
      if (curr === 'preprocessing') return 'active';
      return 'completed';
    },
  },
  {
    id: 'stage_3',
    label: 'Running SwinIR',
    description: 'Deep residual transformer neural inference (3× spatial scaling)',
    matches: (curr, done) => {
      if (done) return 'completed';
      if (curr === 'ingestion' || curr === 'preprocessing') return 'pending';
      if (curr === 'super_resolution') return 'active';
      return 'completed';
    },
  },
  {
    id: 'stage_4',
    label: 'Reconstructing output',
    description: 'Multi-band spectral blending & Monte Carlo uncertainty variance',
    matches: (curr, done) => {
      if (done) return 'completed';
      if (['ingestion', 'preprocessing', 'super_resolution'].includes(curr)) return 'pending';
      if (['spectral_consistency', 'uncertainty_estimation'].includes(curr)) return 'active';
      return 'completed';
    },
  },
  {
    id: 'stage_5',
    label: 'Generating metrics',
    description: 'Calculating PSNR, SSIM, SAM, ERGAS & GeoTIFF product export',
    matches: (curr, done) => {
      if (done) return 'completed';
      if (['validation', 'gis_export'].includes(curr)) return 'active';
      return 'pending';
    },
  },
  {
    id: 'stage_6',
    label: 'Complete',
    description: 'All sub-4m super-resolution products verified and ready for review',
    matches: (_curr, done) => {
      if (done) return 'completed';
      return 'pending';
    },
  },
];

export const ProcessingProgress: React.FC<ProcessingProgressProps> = ({ job }) => {
  const isCompleted = job.status === 'completed';

  return (
    <div className="space-y-6">
      {/* Overall progress header */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#07172b]/90 p-5 shadow-[0_0_30px_rgba(0,212,255,0.06)]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            {isCompleted ? (
              <CheckCircle2 size={18} className="text-emerald-400" />
            ) : (
              <Loader2 size={18} className="text-cyan-400 animate-spin" />
            )}
            <div>
              <h3 className="text-sm font-bold text-white leading-none">
                {isCompleted ? 'Reconstruction Complete' : 'Super-Resolution Engine Active'}
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">
                {job.message || 'Processing multispectral satellite imagery…'}
              </p>
            </div>
          </div>
          <span className={`text-base font-black font-mono ${isCompleted ? 'text-emerald-400' : 'text-cyan-400'}`}>
            {job.overallProgress}%
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full bg-white/[0.06] overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              isCompleted
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-400'
                : 'bg-gradient-to-r from-cyan-500 to-blue-500'
            }`}
            style={{ width: `${Math.max(5, job.overallProgress)}%` }}
          />
        </div>
      </div>

      {/* Real Backend Processing Flow (Vertical Flow with ↓ connectors) */}
      <div className="space-y-1.5">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1 mb-2">
          Execution Stages
        </div>

        {REAL_STAGES.map((stage, idx) => {
          const status = stage.matches(job.currentStageId, isCompleted);
          const isLast = idx === REAL_STAGES.length - 1;

          return (
            <React.Fragment key={stage.id}>
              <div
                className={`flex items-start gap-3.5 p-3 rounded-xl border transition-all duration-300 ${
                  status === 'active'
                    ? 'bg-cyan-500/[0.08] border-cyan-500/40 shadow-[0_0_15px_rgba(0,212,255,0.1)]'
                    : status === 'completed'
                    ? 'bg-emerald-500/[0.04] border-emerald-500/20'
                    : 'bg-white/[0.02] border-white/[0.05] opacity-40'
                }`}
              >
                {/* Status Indicator Icon */}
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  status === 'completed'
                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                    : status === 'active'
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40'
                    : 'bg-white/[0.03] text-slate-600 border border-white/[0.06]'
                }`}>
                  {status === 'completed' ? (
                    <CheckCircle2 size={14} className="text-emerald-400" />
                  ) : status === 'active' ? (
                    <Loader2 size={13} className="text-cyan-400 animate-spin" />
                  ) : (
                    <Clock size={12} className="text-slate-600" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold leading-tight ${
                      status === 'active'
                        ? 'text-cyan-300'
                        : status === 'completed'
                        ? 'text-slate-200'
                        : 'text-slate-500'
                    }`}>
                      {stage.label}
                    </span>
                    {status === 'active' && (
                      <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/15 px-2 py-0.5 rounded border border-cyan-500/30 animate-pulse">
                        RUNNING
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                    {stage.description}
                  </p>
                </div>
              </div>

              {/* Downward connecting indicator */}
              {!isLast && (
                <div className="flex justify-center py-0.5">
                  <ArrowDown
                    size={11}
                    className={`transition-colors duration-300 ${
                      status === 'completed' ? 'text-emerald-500/50' : 'text-slate-700'
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Real Live Telemetry Panel */}
      <div className="rounded-2xl border border-white/[0.08] bg-[#071525]/80 p-4">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
          Backend System Telemetry
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05]">
            <span className="text-[10px] text-slate-500 block mb-0.5">Model</span>
            <span className="font-mono text-cyan-300 font-bold truncate block" title={job.telemetry.model}>
              {job.telemetry.model || 'SwinIR-SRM'}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05]">
            <span className="text-[10px] text-slate-500 block mb-0.5">Resolution</span>
            <span className="font-mono text-white truncate block">
              {job.telemetry.inputGsd} → {job.telemetry.targetGsd}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05]">
            <span className="text-[10px] text-slate-500 block mb-0.5">Elapsed</span>
            <span className="font-mono text-amber-300 font-bold">
              {job.telemetry.elapsedSeconds}s
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05]">
            <span className="text-[10px] text-slate-500 block mb-0.5">Operation</span>
            <span className="font-mono text-emerald-300 truncate block" title={job.telemetry.activeOperation}>
              {job.telemetry.activeOperation || 'Active'}
            </span>
          </div>
        </div>
      </div>

      {/* Safety Notice */}
      {!isCompleted && (
        <div className="flex items-center gap-2 px-3 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300 text-xs">
          <AlertCircle size={14} className="flex-shrink-0" />
          <span>Processing in progress on backend — do not close or navigate away.</span>
        </div>
      )}
    </div>
  );
};


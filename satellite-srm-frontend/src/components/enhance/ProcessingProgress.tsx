import React from 'react';
import { CheckCircle, Clock, Loader, AlertCircle } from 'lucide-react';
import { ProcessingJob, ProcessingStageId, PIPELINE_STAGES } from '../../types/satellite';

interface ProcessingProgressProps {
  job: ProcessingJob;
}

const STAGE_ICONS: Record<ProcessingStageId, string> = {
  ingestion:              '📡',
  preprocessing:          '🔧',
  super_resolution:       '🤖',
  spectral_consistency:   '🌈',
  uncertainty_estimation: '📊',
  validation:             '✅',
  gis_export:             '🗺️',
};

function getStageStatus(stageId: ProcessingStageId, currentStageId: ProcessingStageId, overallProgress: number) {
  const stageOrder: ProcessingStageId[] = [
    'ingestion', 'preprocessing', 'super_resolution',
    'spectral_consistency', 'uncertainty_estimation', 'validation', 'gis_export',
  ];
  const currentIdx = stageOrder.indexOf(currentStageId);
  const stageIdx   = stageOrder.indexOf(stageId);

  if (stageIdx < currentIdx) return 'completed';
  if (stageIdx === currentIdx && overallProgress < 100) return 'active';
  if (overallProgress === 100) return 'completed';
  return 'pending';
}

export const ProcessingProgress: React.FC<ProcessingProgressProps> = ({ job }) => {
  const isCompleted = job.status === 'completed';

  return (
    <div className="space-y-6">
      {/* Overall progress */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            {isCompleted ? (
              <CheckCircle size={15} className="text-emerald-400" />
            ) : (
              <Loader size={15} className="text-cyan-400 animate-spin" />
            )}
            <span className="text-sm font-semibold text-slate-200">
              {isCompleted ? 'Processing Complete' : 'Processing…'}
            </span>
          </div>
          <span className={`text-sm font-bold font-mono ${isCompleted ? 'text-emerald-400' : 'text-cyan-400'}`}>
            {job.overallProgress}%
          </span>
        </div>
        <div className="progress-track">
          <div
            className={`progress-fill transition-all duration-500 ${isCompleted ? 'bg-gradient-to-r from-emerald-500 to-cyan-500' : ''}`}
            style={{ width: `${job.overallProgress}%` }}
          />
        </div>
      </div>

      {/* Message */}
      {!isCompleted && (
        <div className="flex items-start gap-2.5 px-4 py-3 bg-cyan-500/[0.05] border border-cyan-500/15 rounded-xl">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 animate-pulse flex-shrink-0" />
          <p className="text-sm text-slate-300 leading-relaxed">{job.message}</p>
        </div>
      )}

      {/* Pipeline stages */}
      <div className="space-y-2">
        {PIPELINE_STAGES.map((stage) => {
          const status = getStageStatus(stage.id, job.currentStageId, job.overallProgress);
          return (
            <div
              key={stage.id}
              className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all duration-300 ${
                status === 'active'
                  ? 'bg-cyan-500/[0.06] border-cyan-500/25 shadow-[0_0_12px_rgba(0,212,255,0.06)]'
                  : status === 'completed'
                  ? 'bg-emerald-500/[0.04] border-emerald-500/15'
                  : 'bg-white/[0.02] border-white/[0.05] opacity-40'
              }`}
            >
              {/* Stage icon */}
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0 mt-0.5 ${
                status === 'active'    ? 'bg-cyan-500/15 border border-cyan-500/25' :
                status === 'completed' ? 'bg-emerald-500/10 border border-emerald-500/15' :
                'bg-white/[0.04] border border-white/[0.06]'
              }`}>
                {status === 'completed' ? (
                  <CheckCircle size={14} className="text-emerald-400" />
                ) : status === 'active' ? (
                  <Loader size={13} className="text-cyan-400 animate-spin" />
                ) : (
                  <Clock size={13} className="text-slate-600" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-bold text-slate-600 font-mono">{stage.stepNumber}</span>
                  <span className={`text-sm font-semibold leading-none ${
                    status === 'active'    ? 'text-cyan-300' :
                    status === 'completed' ? 'text-slate-300' :
                    'text-slate-600'
                  }`}>
                    {stage.name}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">{stage.description}</p>

                {/* Active stage sub-tasks */}
                {status === 'active' && (
                  <div className="mt-2 space-y-1">
                    {stage.subTasks.map((task, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[10px] text-slate-500">
                        <span className="text-cyan-600">›</span>
                        {task}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Telemetry */}
      <div className="glass rounded-xl p-4">
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">
          System Telemetry
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
          {[
            { label: 'Model',       value: job.telemetry.model },
            { label: 'Device',      value: job.telemetry.device },
            { label: 'Input GSD',   value: job.telemetry.inputGsd },
            { label: 'Target GSD',  value: job.telemetry.targetGsd },
            { label: 'Tiles',       value: job.telemetry.tileProgress },
            { label: 'Memory',      value: job.telemetry.memoryAllocated },
            { label: 'Elapsed',     value: `${job.telemetry.elapsedSeconds}s` },
            { label: 'Operation',   value: job.telemetry.activeOperation },
          ].map(({ label, value }) => (
            <div key={label} className="flex flex-col">
              <span className="text-[10px] text-slate-600">{label}</span>
              <span className="text-xs text-slate-400 font-mono truncate" title={value}>{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Warning */}
      {!isCompleted && (
        <div className="flex items-center gap-2 px-3 py-2 bg-amber-500/[0.06] border border-amber-500/15 rounded-xl">
          <AlertCircle size={13} className="text-amber-400 flex-shrink-0" />
          <span className="text-[11px] text-amber-400/80">Do not navigate away — processing in progress</span>
        </div>
      )}
    </div>
  );
};

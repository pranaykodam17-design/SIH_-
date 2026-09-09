import React from 'react';
import { TelemetryData } from '../../types/satellite';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { formatDuration } from '../../lib/utils';
import { Terminal, Cpu, Activity, Clock, Layers, HardDrive } from 'lucide-react';

interface TelemetryPanelProps {
  telemetry: TelemetryData;
}

export const TelemetryPanel: React.FC<TelemetryPanelProps> = ({ telemetry }) => {
  return (
    <Card className="border-cyan-500/30 bg-space-card/90 font-mono text-xs shadow-xl">
      <div className="flex items-center justify-between border-b border-space-border pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-cyan-400" />
          <span className="font-bold text-white tracking-wider text-xs">
            LIVE RECONSTRUCTION TELEMETRY
          </span>
        </div>
        <Badge
          variant={telemetry.status === 'RUNNING' ? 'cyan' : 'emerald'}
          dot={telemetry.status === 'RUNNING'}
        >
          {telemetry.status}
        </Badge>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        
        <div className="p-2.5 rounded bg-space-elevated border border-space-border/60">
          <span className="text-[10px] text-slate-500 block uppercase mb-1">Architecture</span>
          <span className="font-bold text-white text-[11px] truncate block" title={telemetry.model}>
            {telemetry.model || 'SwinIR-SRM'}
          </span>
        </div>

        <div className="p-2.5 rounded bg-space-elevated border border-space-border/60">
          <span className="text-[10px] text-slate-500 block uppercase mb-1">Resolution Shift</span>
          <span className="font-bold text-cyan-300 text-[11px]">
            {telemetry.inputGsd} → {telemetry.targetGsd}
          </span>
        </div>

        <div className="p-2.5 rounded bg-space-elevated border border-space-border/60">
          <span className="text-[10px] text-slate-500 block uppercase mb-1">Compute Device</span>
          <span className="font-bold text-emerald-400 text-[11px]">
            {telemetry.device || 'CUDA GPU / CPU'}
          </span>
        </div>

        <div className="p-2.5 rounded bg-space-elevated border border-space-border/60">
          <span className="text-[10px] text-slate-500 block uppercase mb-1">Elapsed Duration</span>
          <span className="font-bold text-amber-300 text-[11px]">
            {formatDuration(telemetry.elapsedSeconds)}
          </span>
        </div>

        <div className="p-2.5 rounded bg-space-elevated border border-space-border/60">
          <span className="text-[10px] text-slate-500 block uppercase mb-1">Tile Blending</span>
          <span className="font-bold text-white text-[11px]">
            {telemetry.tileProgress || 'N/A'}
          </span>
        </div>

        <div className="p-2.5 rounded bg-space-elevated border border-space-border/60">
          <span className="text-[10px] text-slate-500 block uppercase mb-1">Spectral Channels</span>
          <span className="font-bold text-white text-[11px]">
            {telemetry.bandCount} Channels (B02-B08)
          </span>
        </div>

        <div className="p-2.5 rounded bg-space-elevated border border-space-border/60">
          <span className="text-[10px] text-slate-500 block uppercase mb-1">Memory Allocation</span>
          <span className="font-bold text-white text-[11px]">
            {telemetry.memoryAllocated || 'N/A'}
          </span>
        </div>

        <div className="p-2.5 rounded bg-space-elevated border border-space-border/60">
          <span className="text-[10px] text-slate-500 block uppercase mb-1">Active Operation</span>
          <span className="font-bold text-cyan-400 text-[11px] truncate block" title={telemetry.activeOperation}>
            {telemetry.activeOperation || 'Standing by'}
          </span>
        </div>

      </div>
    </Card>
  );
};

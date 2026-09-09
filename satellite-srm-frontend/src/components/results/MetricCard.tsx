import React from 'react';
import { Card } from '../ui/Card';
import { MetricEntry } from '../../types/satellite';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  label: string;
  entry: MetricEntry;
  subtitle?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ label, entry, subtitle }) => {
  const isPositiveGain = entry.gain > 0;
  const isGood = entry.higherIsBetter ? isPositiveGain : !isPositiveGain;

  return (
    <Card className="border-space-border bg-space-card/80 p-4 font-mono">
      <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
        <span className="uppercase font-bold tracking-wider">{label}</span>
        {entry.unit && <span className="text-slate-500">[{entry.unit}]</span>}
      </div>

      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-2xl font-bold text-white tracking-tight">
          {entry.model.toFixed( entry.unit === 'dB' ? 2 : 4 )}
        </span>
        <span className="text-xs text-slate-500">
          vs {entry.bicubic.toFixed( entry.unit === 'dB' ? 2 : 4 )} base
        </span>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-space-border/60 text-xs">
        <span className="text-slate-400 text-[11px] truncate max-w-[150px]" title={entry.description}>
          {subtitle || entry.description}
        </span>
        <div className={`flex items-center gap-1 font-bold text-xs ${
          isGood ? 'text-emerald-400' : 'text-amber-400'
        }`}>
          {isPositiveGain ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
          <span>{entry.gain > 0 ? `+${entry.gain.toFixed(2)}` : entry.gain.toFixed(2)}</span>
        </div>
      </div>
    </Card>
  );
};

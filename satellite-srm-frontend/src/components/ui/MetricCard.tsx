import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  subLabel?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: 'cyan' | 'blue' | 'emerald' | 'amber' | 'violet' | 'default';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  icon?: React.ReactNode;
  description?: string;
}

const COLOR_MAP = {
  cyan:    { border: 'border-cyan-500/20',   bg: 'bg-cyan-500/5',   text: 'text-cyan-400',   glow: 'shadow-[0_0_20px_rgba(0,212,255,0.08)]' },
  blue:    { border: 'border-blue-500/20',   bg: 'bg-blue-500/5',   text: 'text-blue-400',   glow: 'shadow-[0_0_20px_rgba(59,130,246,0.08)]' },
  emerald: { border: 'border-emerald-500/20',bg: 'bg-emerald-500/5',text: 'text-emerald-400', glow: 'shadow-[0_0_20px_rgba(16,185,129,0.08)]' },
  amber:   { border: 'border-amber-500/20',  bg: 'bg-amber-500/5',  text: 'text-amber-400',  glow: 'shadow-[0_0_20px_rgba(245,158,11,0.08)]' },
  violet:  { border: 'border-violet-500/20', bg: 'bg-violet-500/5', text: 'text-violet-400', glow: 'shadow-[0_0_20px_rgba(139,92,246,0.08)]' },
  default: { border: 'border-white/[0.08]',  bg: 'bg-white/[0.03]', text: 'text-slate-300',  glow: '' },
};

const SIZE_MAP = {
  sm: { card: 'p-4', value: 'text-2xl', label: 'text-xs', unit: 'text-sm', icon: 'w-7 h-7 text-sm' },
  md: { card: 'p-5', value: 'text-3xl', label: 'text-xs', unit: 'text-base', icon: 'w-8 h-8 text-base' },
  lg: { card: 'p-6', value: 'text-4xl', label: 'text-sm', unit: 'text-xl', icon: 'w-10 h-10 text-lg' },
};

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  unit,
  subLabel,
  trend,
  trendValue,
  color = 'default',
  size = 'md',
  className = '',
  icon,
  description,
}) => {
  const c = COLOR_MAP[color];
  const s = SIZE_MAP[size];

  const TrendIcon =
    trend === 'up'   ? TrendingUp :
    trend === 'down' ? TrendingDown : Minus;

  const trendColor =
    trend === 'up'   ? 'text-emerald-400' :
    trend === 'down' ? 'text-red-400' :
    'text-slate-500';

  return (
    <div
      className={`relative rounded-xl border ${c.border} ${c.bg} ${c.glow} ${s.card} transition-all duration-300 hover:border-opacity-40 group ${className}`}
    >
      {/* Top row: icon + trend */}
      <div className="flex items-start justify-between mb-3">
        {icon && (
          <div className={`${s.icon} flex items-center justify-center rounded-lg ${c.bg} border ${c.border} ${c.text} flex-shrink-0`}>
            {icon}
          </div>
        )}
        {trend && trendValue && (
          <div className={`flex items-center gap-1 text-[11px] font-semibold ${trendColor} ml-auto`}>
            <TrendIcon size={11} />
            {trendValue}
          </div>
        )}
      </div>

      {/* Value */}
      <div className="flex items-end gap-1.5 mb-1">
        <span className={`${s.value} font-black leading-none tracking-tight ${c.text} anim-counter`}>
          {value}
        </span>
        {unit && (
          <span className={`${s.unit} font-medium text-slate-500 mb-0.5 leading-none`}>{unit}</span>
        )}
      </div>

      {/* Label */}
      <div className={`${s.label} font-semibold text-slate-400 leading-snug`}>{label}</div>

      {/* Sub-label */}
      {subLabel && (
        <div className="text-[11px] text-slate-600 mt-1 leading-snug">{subLabel}</div>
      )}

      {/* Description tooltip on hover */}
      {description && (
        <div className="absolute bottom-full left-0 right-0 mb-2 px-3 py-2 bg-[#0d1f38] border border-white/10 rounded-xl text-[11px] text-slate-400 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-20 shadow-lg">
          {description}
        </div>
      )}
    </div>
  );
};

/* ── Compact inline metric (for tables/lists) ── */
interface InlineMetricProps {
  label: string;
  value: string | number;
  unit?: string;
  color?: 'cyan' | 'emerald' | 'amber' | 'red' | 'default';
}

export const InlineMetric: React.FC<InlineMetricProps> = ({ label, value, unit, color = 'default' }) => {
  const textColor =
    color === 'cyan'    ? 'text-cyan-400' :
    color === 'emerald' ? 'text-emerald-400' :
    color === 'amber'   ? 'text-amber-400' :
    color === 'red'     ? 'text-red-400' :
    'text-slate-300';

  return (
    <div className="flex items-center justify-between py-2.5 border-b border-white/[0.05] last:border-0">
      <span className="text-xs text-slate-500">{label}</span>
      <span className={`text-sm font-bold font-mono ${textColor}`}>
        {value}{unit && <span className="text-slate-600 font-normal ml-0.5 text-xs">{unit}</span>}
      </span>
    </div>
  );
};

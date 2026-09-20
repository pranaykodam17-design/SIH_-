import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'cyan' | 'emerald' | 'amber' | 'purple' | 'slate' | 'red';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'cyan',
  dot = false,
  children,
  ...props
}) => {
  const styles = {
    cyan: 'bg-cyan-950/60 text-cyan-700 border-cyan-200',
    emerald: 'bg-emerald-950/60 text-emerald-700 border-emerald-500/30',
    amber: 'bg-amber-950/60 text-amber-700 border-amber-500/30',
    purple: 'bg-indigo-950/60 text-indigo-700 border-indigo-500/30',
    slate: 'bg-[#EEF7FF] text-[#425873] border-[#D7E6F4]',
    red: 'bg-red-950/60 text-red-700 border-red-500/30',
  };

  const dotStyles = {
    cyan: 'bg-cyan-400 animate-pulse',
    emerald: 'bg-emerald-400 animate-pulse',
    amber: 'bg-amber-400 animate-pulse',
    purple: 'bg-indigo-400 animate-pulse',
    slate: 'bg-slate-400',
    red: 'bg-red-400 animate-ping',
  };

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium border",
        styles[variant],
        className
      )}
      {...props}
    >
      {dot && <span className={cn("w-1.5 h-1.5 rounded-full", dotStyles[variant])} />}
      {children}
    </div>
  );
};

import React from 'react';
import { cn } from '../../lib/utils';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  color?: 'cyan' | 'emerald' | 'amber';
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  color = 'cyan',
  className,
  ...props
}) => {
  const colorMap = {
    cyan: 'bg-gradient-to-r from-cyan-500 to-blue-500',
    emerald: 'bg-gradient-to-r from-emerald-500 to-cyan-400',
    amber: 'bg-gradient-to-r from-amber-500 to-red-500',
  };

  return (
    <div
      className={cn("h-2 w-full overflow-hidden rounded-full bg-space-border/80", className)}
      {...props}
    >
      <div
        className={cn("h-full transition-all duration-300 ease-out", colorMap[color])}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
};

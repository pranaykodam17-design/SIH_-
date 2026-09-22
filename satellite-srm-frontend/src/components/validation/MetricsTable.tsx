import React from 'react';
import { ValidationMetrics } from '../../types/satellite';
import { Badge } from '../ui/Badge';
import { TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';

interface MetricsTableProps {
  metrics: ValidationMetrics | undefined;
}

export const MetricsTable: React.FC<MetricsTableProps> = ({ metrics }) => {
  if (!metrics || !metrics.hasReferenceData) {
    return (
      <div className="p-8 text-center font-mono rounded-xl border border-blue-100 glass-panel">
        <Info className="h-8 w-8 text-amber-600 mx-auto mb-2" />
        <h4 className="text-base font-bold text-primary mb-1">Reference Imagery Required</h4>
        <p className="text-xs text-secondary max-w-md mx-auto">
          Reference-based scientific benchmarks (PSNR, SSIM, SAM, ERGAS) require a coincident sub-4m high-resolution validation raster. No reference raster was supplied for this operational pass.
        </p>
      </div>
    );
  }

  const rows = [
    { key: 'PSNR_dB', label: 'PSNR (Peak Signal-to-Noise Ratio)', entry: metrics.psnr_db, target: 'Higher is better' },
    { key: 'SSIM', label: 'SSIM (Structural Similarity Index)', entry: metrics.ssim, target: 'Closer to 1.0 is better' },
    { key: 'SAM_deg', label: 'SAM (Spectral Angle Mapper)', entry: metrics.sam_deg, target: 'Lower is better' },
    { key: 'ERGAS', label: 'ERGAS (Relative Global Dimensionless Error)', entry: metrics.ergas, target: 'Lower is better' },
    { key: 'NDVI_Corr', label: 'NDVI Pearson Correlation', entry: metrics.ndvi_correlation, target: 'Closer to 1.0 is better' },
    { key: 'NDVI_MAE', label: 'NDVI Mean Absolute Error', entry: metrics.ndvi_mae, target: 'Lower is better' },
  ];

  return (
    <div className="overflow-x-auto rounded-xl border border-blue-100 glass-panel">
      <table className="w-full text-left font-mono text-xs">
        <thead className="border-b border-blue-100 glass-panel text-secondary uppercase text-[11px]">
          <tr>
            <th className="py-3 px-4">Evaluation Metric</th>
            <th className="py-3 px-4">Bicubic Baseline</th>
            <th className="py-3 px-4">SwinIR SRM Model</th>
            <th className="py-3 px-4">Performance Delta</th>
            <th className="py-3 px-4 hidden sm:table-cell">Target Direction</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-space-border/60 text-secondary">
          {rows.map((row) => {
            const entry = row.entry;
            const isPositive = entry.gain > 0;
            const isGood = entry.higherIsBetter ? isPositive : !isPositive;

            return (
              <tr key={row.key} className="hover:bg-surface/40 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="font-bold text-primary">{row.label}</div>
                  <div className="text-[10px] text-secondary font-sans">{entry.description}</div>
                </td>
                <td className="py-3.5 px-4 text-secondary font-bold">
                  {entry.bicubic.toFixed(4)} {entry.unit}
                </td>
                <td className="py-3.5 px-4 font-bold text-cyan-700">
                  {entry.model.toFixed(4)} {entry.unit}
                </td>
                <td className="py-3.5 px-4 font-bold">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] ${
                    isGood ? 'bg-emerald-950/60 text-emerald-700 border border-emerald-500/30' : 'bg-amber-950/60 text-amber-700 border border-amber-500/30'
                  }`}>
                    {isPositive ? '+' : ''}{entry.gain.toFixed(4)}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-secondary text-[11px] hidden sm:table-cell">
                  {row.target}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

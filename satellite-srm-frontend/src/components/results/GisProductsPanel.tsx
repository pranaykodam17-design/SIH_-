import React from 'react';
import { SRMOutputs } from '../../types/satellite';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Download, FileCode, Layers, Shield, FileCheck, CheckCircle2 } from 'lucide-react';

interface GisProductsPanelProps {
  outputs: SRMOutputs;
}

export const GisProductsPanel: React.FC<GisProductsPanelProps> = ({ outputs }) => {
  const products = [
    {
      name: "SR_product.tif",
      description: "Sub-4m multispectral super-resolved GeoTIFF raster with updated affine transformation.",
      badge: "EPSG:32644",
      size: "9.4 MB",
      url: outputs.srGeoTiffUrl,
      type: "GeoTIFF (4 Bands: B02, B03, B04, B08)"
    },
    {
      name: "uncertainty_map.tif",
      description: "Pixel-level Monte Carlo variance map for spatial confidence analysis in QGIS.",
      badge: "FLOAT32 RASTER",
      size: "2.4 MB",
      url: outputs.uncertaintyGeoTiffUrl,
      type: "GeoTIFF (1 Band Variance)"
    },
    {
      name: "metrics.json",
      description: "Quantitative remote sensing verification metrics comparing model vs bicubic baseline.",
      badge: "JSON METADATA",
      size: "1.2 KB",
      url: outputs.metricsJsonUrl,
      type: "Scientific Evaluation Results"
    },
    {
      name: "preview.png",
      description: "Full-resolution RGB rendered PNG preview for reports and documentation.",
      badge: "PNG PREVIEW",
      size: "1.3 MB",
      url: outputs.srPreviewUrl,
      type: "Rendered RGB Graphic"
    }
  ];

  return (
    <Card className="border-space-border bg-space-card p-6 shadow-2xl">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-space-border mb-4">
        <div>
          <h3 className="text-base font-bold font-mono text-white">
            GIS-READY SCIENTIFIC PRODUCTS
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Preserves spatial reference metadata and geocoded tags for standard GIS software.
          </p>
        </div>
        <Badge variant="cyan">QGIS & ARCGIS COMPATIBLE</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((item, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-space-elevated border border-space-border flex flex-col justify-between hover:border-cyan-500/40 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-xs font-bold text-cyan-300">
                  {item.name}
                </span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-space-darkest text-slate-400 border border-space-border">
                  {item.badge}
                </span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed mb-3">
                {item.description}
              </p>
              <div className="flex items-center justify-between font-mono text-[11px] text-slate-400 mb-4">
                <span>{item.type}</span>
                <span>{item.size}</span>
              </div>
            </div>

            <a
              href={item.url}
              download={item.name}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-2 px-3 rounded-lg bg-space-darkest hover:bg-cyan-950/60 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 text-xs font-mono font-semibold transition-all"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download {item.name}</span>
            </a>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-space-border/60 text-xs font-mono text-slate-400 flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
        <span>
          Affine projection parameters & NoData flags are written into the GeoTIFF header for direct GIS alignment.
        </span>
      </div>
    </Card>
  );
};

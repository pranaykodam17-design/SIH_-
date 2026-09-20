import React, { useState } from 'react';
import { PIPELINE_STAGES } from '../../types/satellite';
import { Badge } from '../ui/Badge';
import { Card } from '../ui/Card';
import { ArrowRight, CheckCircle2, ChevronRight, Layers, Cpu, ShieldCheck, FileSpreadsheet } from 'lucide-react';

export const PipelineSection: React.FC = () => {
  const [selectedStageIndex, setSelectedStageIndex] = useState(2); // default to AI Super Resolution

  const selectedStage = PIPELINE_STAGES[selectedStageIndex];

  return (
    <section id="pipeline" className="py-20 border-t border-blue-100/60 bg-white/90 relative">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="cyan" className="mb-3 uppercase tracking-wider">
            Processing Architecture
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#10233F]">
            The 7-Stage Satellite Reconstruction Pipeline
          </h2>
          <p className="mt-4 text-[#425873] leading-relaxed text-sm sm:text-base">
            From raw multispectral GeoTIFF ingestion to QGIS-ready sub-4m rasters. Click any stage to inspect computational tasks and scientific validation steps.
          </p>
        </div>

        {/* Horizontal scrollable stage selector */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 mb-8">
          {PIPELINE_STAGES.map((stage, idx) => {
            const isSelected = selectedStageIndex === idx;
            return (
              <button
                key={stage.id}
                onClick={() => setSelectedStageIndex(idx)}
                className={`flex flex-col text-left p-3 rounded-xl border transition-all duration-200 ${
                  isSelected
                    ? 'border-cyan-400 bg-cyan-950/40 shadow-lg shadow-cyan-500/10'
                    : 'border-blue-100 bg-white hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`font-mono text-xs font-bold ${isSelected ? 'text-[#1677FF]' : 'text-[#6B7F95]'}`}>
                    STEP {stage.stepNumber}
                  </span>
                  {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse"></span>}
                </div>
                <span className={`text-xs font-semibold line-clamp-1 ${isSelected ? 'text-[#10233F]' : 'text-[#425873]'}`}>
                  {stage.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Detailed stage view card */}
        <Card className="border-cyan-200 bg-white p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="md:col-span-1 border-b md:border-b-0 md:border-r border-blue-100 pb-6 md:pb-0 md:pr-8">
              <span className="font-mono text-xs text-[#1677FF] uppercase font-bold tracking-wider">
                STAGE {selectedStage.stepNumber} DETAILED SPECIFICATION
              </span>
              <h3 className="text-2xl font-bold text-[#10233F] mt-2 mb-3">
                {selectedStage.name}
              </h3>
              <p className="text-sm text-[#425873] leading-relaxed mb-6">
                {selectedStage.description}
              </p>
              
              <div className="font-mono text-xs text-[#526A82] space-y-2 bg-white/80 p-4 rounded-lg border border-blue-100">
                <div className="flex justify-between">
                  <span>Pipeline ID:</span>
                  <span className="text-cyan-700 font-bold">{selectedStage.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Execution Target:</span>
                  <span className="text-[#10233F]">CPU / CUDA GPU</span>
                </div>
                <div className="flex justify-between">
                  <span>Standard:</span>
                  <span className="text-emerald-600">NTRO Remote Sensing</span>
                </div>
              </div>
            </div>

            {/* Subtasks breakdown */}
            <div className="md:col-span-2 space-y-4">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#526A82] font-bold">
                Granular Operations Executed in this Stage
              </h4>
              
              <div className="space-y-3">
                {selectedStage.subTasks.map((task, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3.5 rounded-lg bg-white border border-blue-100/60">
                    <div className="h-5 w-5 rounded-full bg-[#1677FF]/20 text-[#1677FF] flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-sm font-mono text-[#425873]">
                      {task}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex items-center justify-between text-xs font-mono text-[#526A82]">
                <span>Stage sequence: {selectedStageIndex + 1} of {PIPELINE_STAGES.length}</span>
                <button
                  onClick={() => setSelectedStageIndex((prev) => (prev + 1) % PIPELINE_STAGES.length)}
                  className="flex items-center gap-1 text-[#1677FF] hover:text-cyan-700"
                >
                  <span>Next stage</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

          </div>
        </Card>

      </div>
    </section>
  );
};

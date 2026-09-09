import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Zap, Upload, Settings2, RefreshCw, CheckCircle2,
  AlertCircle, Download, FileImage, RotateCcw, ChevronRight
} from 'lucide-react';
import { ImageUploader } from '../components/enhance/ImageUploader';
import { ModelSettings, ModelSettingsValues } from '../components/enhance/ModelSettings';
import { ProcessingProgress } from '../components/enhance/ProcessingProgress';
import { ResultsViewer } from '../components/enhance/ResultsViewer';
import { useSrmStore, DEMO_JOB } from '../store/useSrmStore';
import { startSingleSuperResolution } from '../api/superResolution';
import { getJobStatus } from '../api/jobs';
import { ProcessingJob, BatchFileItem } from '../types/satellite';

type Step = 'upload' | 'processing' | 'results';

const STEP_LABELS: { id: Step; label: string; icon: React.ReactNode }[] = [
  { id: 'upload',     label: 'Configure',  icon: <Upload size={14} />       },
  { id: 'processing', label: 'Enhancing',  icon: <RefreshCw size={14} />    },
  { id: 'results',    label: 'Results',    icon: <CheckCircle2 size={14} /> },
];

const DEFAULT_SETTINGS: ModelSettingsValues = {
  model:               'SwinIR-SRM',
  scaleFactor:         3,
  outputFormat:        'GeoTIFF (Georeferenced)',
  enableUncertainty:   true,
  spectralConsistency: true,
  artifactReduction:   true,
};

export const EnhancePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    activeJob,
    setActiveJob,
    activeJobs,
    setActiveJobs,
    selectedJobId,
    setSelectedJobId,
    uploadedFile,
    uploadedFiles,
    setUploadedFile,
    setUploadedFiles,
    removeUploadedFile,
    resetAll,
  } = useSrmStore();

  const [step, setStep]           = useState<Step>('upload');
  const [settings, setSettings]   = useState<ModelSettingsValues>(DEFAULT_SETTINGS);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError]         = useState<string | null>(null);

  // Resilient multi-file batch items state
  const [batchItems, setBatchItems] = useState<BatchFileItem[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // If activeJob is already completed and no batch is running, default to results
  useEffect(() => {
    if (activeJob?.status === 'completed' && batchItems.length === 0) {
      setStep('results');
    }
  }, []); // eslint-disable-line

  // Run processing for an individual item with its own isolated lifecycle
  const processBatchItem = async (itemId: string, file: File) => {
    try {
      // 1. Mark as uploading and send to real backend POST /api/v1/super-resolution
      setBatchItems(prev => prev.map(item =>
        item.id === itemId
          ? { ...item, status: 'uploading', progress: 5, stageMessage: 'Uploading raster to super-resolution engine...' }
          : item
      ));

      const response = await startSingleSuperResolution(file, {
        model: settings.model,
        enableUncertainty: settings.enableUncertainty,
        scaleFactor: settings.scaleFactor,
      });

      const jobId = response.job_id;
      if (!jobId) throw new Error('Backend did not return a job_id');

      setBatchItems(prev => prev.map(item =>
        item.id === itemId
          ? { ...item, jobId, status: 'processing', progress: 8, stageMessage: 'Job queued — ingesting raster metadata...' }
          : item
      ));

      // 2. Brief initial delay so the backend finishes writing the job to memory
      await new Promise(res => setTimeout(res, 600));

      // 3. Poll job status until completed or failed
      let isDone = false;
      let consecutivePollErrors = 0;
      const MAX_POLL_ERRORS = 8;

      while (!isDone) {
        await new Promise(res => setTimeout(res, 1200));

        try {
          const updatedJob = await getJobStatus(jobId);
          consecutivePollErrors = 0;

          if (updatedJob.status === 'completed') {
            isDone = true;
            setActiveJob(updatedJob);
            setSelectedJobId(updatedJob.jobId);
            setBatchItems(prev => prev.map(item =>
              item.id === itemId
                ? {
                    ...item,
                    status: 'completed',
                    job: updatedJob,
                    progress: 100,
                    stageMessage: 'Reconstruction completed successfully.',
                  }
                : item
            ));
          } else if (updatedJob.status === 'failed') {
            isDone = true;
            setBatchItems(prev => prev.map(item =>
              item.id === itemId
                ? {
                    ...item,
                    status: 'failed',
                    job: updatedJob,
                    error: updatedJob.error || updatedJob.message || 'Processing failed in deep learning pipeline.',
                    progress: 0,
                    stageMessage: 'Pipeline failed',
                  }
                : item
            ));
          } else {
            // Still in progress — update progress display
            setBatchItems(prev => prev.map(item =>
              item.id === itemId
                ? {
                    ...item,
                    job: updatedJob,
                    progress: Math.max(10, Math.min(95, updatedJob.overallProgress || 10)),
                    stageMessage: updatedJob.message || 'Processing…',
                  }
                : item
            ));
          }
        } catch (pollErr) {
          consecutivePollErrors++;
          console.warn(`Polling error for job ${jobId} (attempt ${consecutivePollErrors}/${MAX_POLL_ERRORS}):`, pollErr);
          if (consecutivePollErrors >= MAX_POLL_ERRORS) {
            isDone = true;
            const msg = pollErr instanceof Error ? pollErr.message : 'Job status unreachable';
            setBatchItems(prev => prev.map(item =>
              item.id === itemId
                ? { ...item, status: 'failed', error: `Polling failed after ${MAX_POLL_ERRORS} attempts: ${msg}`, progress: 0, stageMessage: 'Connection lost' }
                : item
            ));
          }
        }
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Upload or processing failed';
      console.error('processBatchItem error for', file.name, err);
      setBatchItems(prev => prev.map(item =>
        item.id === itemId
          ? {
              ...item,
              status: 'failed',
              error: errorMsg,
              progress: 0,
              stageMessage: `Error: ${errorMsg}`,
            }
          : item
      ));
    }
  };

  // Monitor batch items: when all finished, transition to results if any succeeded
  useEffect(() => {
    if (batchItems.length === 0 || step !== 'processing') return;

    const allFinished = batchItems.every(i => i.status === 'completed' || i.status === 'failed');
    if (!allFinished) return;

    const successfulItems = batchItems.filter(i => i.status === 'completed' && i.job);
    if (successfulItems.length > 0) {
      const completedJobs = successfulItems.map(i => i.job!);
      setActiveJobs(completedJobs);
      const firstJob = completedJobs[0];
      setActiveJob(firstJob);
      setSelectedJobId(firstJob.jobId);
      setStep('results');
    } else {
      setError('All items in the batch encountered errors. Review the failure details below.');
    }
  }, [batchItems, step, setActiveJob, setActiveJobs, setSelectedJobId]);

  // Main enhance handler
  const handleEnhance = async () => {
    const filesToUpload = uploadedFiles.length > 0 ? uploadedFiles : (uploadedFile ? [uploadedFile] : []);
    if (filesToUpload.length === 0) {
      setError('Please select at least one satellite image first.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      // Create initial batch items
      const initialItems: BatchFileItem[] = filesToUpload.map((file, idx) => ({
        id: `batch-${Date.now()}-${idx}-${file.name}`,
        file,
        status: 'uploading',
        progress: 5,
        stageMessage: `Queued for processing...`,
      }));

      setBatchItems(initialItems);
      setSelectedItemId(initialItems[0].id);
      setStep('processing');

      // Dispatch each item independently (non-blocking for batch)
      initialItems.forEach(item => {
        processBatchItem(item.id, item.file);
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unknown error occurred.';
      setError(`Failed to start enhancement: ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Retry an individual failed item
  const handleRetryItem = (itemToRetry: BatchFileItem) => {
    setBatchItems(prev => prev.map(i =>
      i.id === itemToRetry.id
        ? { ...i, status: 'uploading', error: undefined, progress: 5, stageMessage: 'Retrying upload…' }
        : i
    ));
    processBatchItem(itemToRetry.id, itemToRetry.file);
  };

  const handleLoadDemo = () => {
    setBatchItems([{
      id: 'demo-item',
      file: new File([], DEMO_JOB.metadata.filename),
      jobId: DEMO_JOB.jobId,
      status: 'completed',
      job: DEMO_JOB,
      progress: 100,
      stageMessage: DEMO_JOB.message,
    }]);
    setActiveJobs([DEMO_JOB]);
    setActiveJob(DEMO_JOB);
    setSelectedJobId(DEMO_JOB.jobId);
    setStep('results');
  };

  const handleReset = () => {
    resetAll();
    setBatchItems([]);
    setSelectedItemId(null);
    setStep('upload');
    setError(null);
    setIsSubmitting(false);
  };

  // Current item being inspected in processing view
  const currentItem = batchItems.find(i => i.id === selectedItemId) || batchItems[0];
  const currentInspectionJob: ProcessingJob = currentItem?.job || {
    jobId: currentItem?.jobId || 'SRM-RUNNING',
    status: currentItem?.status === 'failed' ? 'failed' : 'processing',
    currentStageId: 'ingestion',
    stageProgress: currentItem?.progress || 10,
    overallProgress: currentItem?.progress || 10,
    message: currentItem?.stageMessage || 'Processing raster…',
    telemetry: {
      status: currentItem?.status === 'failed' ? 'ERROR' : 'RUNNING',
      model: settings.model,
      inputGsd: '10.0 m',
      targetGsd: `${(10.0 / settings.scaleFactor).toFixed(2)} m`,
      bandCount: 4,
      device: 'CUDA GPU / PyTorch Fallback',
      elapsedSeconds: 0,
      tileProgress: '0 / 16 Tiles',
      memoryAllocated: '2.4 GB VRAM',
      activeOperation: currentItem?.stageMessage || 'Active Process'
    },
    metadata: {
      filename: currentItem?.file.name || 'satellite_raster.tif',
      fileSize: currentItem?.file.size || 1048576,
      format: 'GeoTIFF (Multispectral)',
      width: 512,
      height: 512,
      bands: ['B02 (Blue)', 'B03 (Green)', 'B04 (Red)', 'B08 (NIR)'],
      nativeResolution: 10.0,
      targetResolution: 10.0 / settings.scaleFactor,
      crs: 'EPSG:32644 (UTM Zone 44N)',
      bounds: DEMO_JOB.metadata.bounds,
      center: DEMO_JOB.metadata.center,
      sensor: 'Sentinel-2 MSI Level-2A',
      acquisitionDate: new Date().toISOString()
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    error: currentItem?.error,
  };

  // Separation of completed and failed items
  const completedBatchItems = batchItems.filter(i => i.status === 'completed' && i.job);
  const failedBatchItems = batchItems.filter(i => i.status === 'failed');

  const currentResultJob = activeJob || completedBatchItems[0]?.job || DEMO_JOB;

  return (
    <div className="min-h-screen bg-[#020c1b] py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* ── Header ── */}
        <div className="text-center mb-10">
          <div className="tag-cyan mx-auto mb-4 w-fit">
            <Zap size={11} />
            AI Super Resolution
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
            Enhance Satellite Imagery
          </h1>
          <p className="text-slate-500 max-w-xl mx-auto leading-relaxed">
            Turn medium-resolution Sentinel-2 imagery into sharper, sub-4m information-rich maps using deep learning AI.
          </p>
        </div>

        {/* ── Step Indicator ── */}
        <div className="flex items-center justify-center gap-0 mb-10 max-w-sm mx-auto">
          {STEP_LABELS.map(({ id, label, icon }, i) => (
            <React.Fragment key={id}>
              <div
                className={`flex flex-col items-center gap-1.5 ${
                  step === id
                    ? 'opacity-100'
                    : step === 'results' && id !== 'results'
                    ? 'opacity-80'
                    : step === 'processing' && id === 'upload'
                    ? 'opacity-80'
                    : 'opacity-30'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-300 ${
                  step === id
                    ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-400'
                    : (step === 'results' && id !== 'results') || (step === 'processing' && id === 'upload')
                    ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
                    : 'bg-white/[0.04] border-white/[0.08] text-slate-600'
                }`}>
                  {((step === 'results' && id !== 'results') || (step === 'processing' && id === 'upload'))
                    ? <CheckCircle2 size={14} className="text-emerald-400" />
                    : icon}
                </div>
                <span className={`text-[11px] font-semibold ${step === id ? 'text-cyan-400' : 'text-slate-600'}`}>
                  {label}
                </span>
              </div>
              {i < STEP_LABELS.length - 1 && (
                <div className={`flex-1 h-px mx-2 mb-4 transition-colors duration-300 ${
                  (step === 'processing' && i === 0) || step === 'results'
                    ? 'bg-gradient-to-r from-emerald-500/40 to-cyan-500/30'
                    : 'bg-white/[0.08]'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* ── Upload Step ── */}
        {step === 'upload' && (
          <div className="grid lg:grid-cols-5 gap-6 anim-fade-in">
            {/* Left: Upload (wider) */}
            <div className="lg:col-span-3 space-y-5">
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                    <Upload size={13} className="text-cyan-400" />
                  </div>
                  <h2 className="text-base font-bold text-white">Upload Satellite Image(s)</h2>
                </div>
                <ImageUploader
                  selectedFiles={uploadedFiles}
                  selectedFile={uploadedFile}
                  onFilesSelect={(files) => {
                    setUploadedFiles(files);
                  }}
                  onRemoveFile={(idx) => {
                    removeUploadedFile(idx);
                  }}
                  onClear={() => {
                    setUploadedFiles([]);
                    setUploadedFile(null);
                  }}
                />
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 px-4 py-3 bg-red-500/8 border border-red-500/20 rounded-xl">
                  <AlertCircle size={15} className="text-red-400 flex-shrink-0" />
                  <span className="text-sm text-red-400">{error}</span>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleEnhance}
                  disabled={(uploadedFiles.length === 0 && !uploadedFile) || isSubmitting}
                  className={`btn-primary flex-1 sm:flex-none justify-center py-3.5 ${((uploadedFiles.length === 0 && !uploadedFile) || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw size={15} className="animate-spin" />
                      Starting…
                    </>
                  ) : (
                    <>
                      <Zap size={15} />
                      {uploadedFiles.length > 1
                        ? `Enhance Batch (${uploadedFiles.length} Images) →`
                        : 'Enhance Image →'}
                    </>
                  )}
                </button>
                <button
                  onClick={handleLoadDemo}
                  className="btn-secondary text-sm py-3.5 px-5"
                >
                  Load Demo Dataset
                </button>
              </div>

              <p className="text-[11px] text-slate-600 text-center">
                Supports multiple GeoTIFF, TIFF, PNG, JPG rasters · Sentinel-2 MSI Level-2A recommended
              </p>
            </div>

            {/* Right: Model Settings */}
            <div className="lg:col-span-2">
              <div className="glass rounded-2xl p-6 h-full">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <Settings2 size={13} className="text-blue-400" />
                  </div>
                  <h2 className="text-base font-bold text-white">Model Settings</h2>
                </div>
                <ModelSettings
                  values={settings}
                  onChange={setSettings}
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>
        )}

        {/* ── Processing Step ── */}
        {step === 'processing' && (
          <div className="max-w-3xl mx-auto anim-fade-in space-y-6">
            {/* Batch Status Bar */}
            <div className="glass rounded-2xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <RefreshCw size={16} className="text-cyan-400 animate-spin" />
                  <span className="text-sm font-bold text-white">
                    {batchItems.length > 1
                      ? `Batch Processing Pipeline (${batchItems.filter(i => i.status === 'completed').length}/${batchItems.length} Finished)`
                      : 'Deep Learning Reconstruction Pipeline'}
                  </span>
                </div>
                <span className="text-xs font-mono text-cyan-400 font-semibold">{settings.model}</span>
              </div>

              {/* Items List / Selector */}
              <div className="space-y-2 mt-4">
                {batchItems.map((item, idx) => {
                  const isSelected = (selectedItemId || batchItems[0]?.id) === item.id;
                  const isSuccess = item.status === 'completed';
                  const isFailed = item.status === 'failed';
                  const isWorking = item.status === 'uploading' || item.status === 'processing';

                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItemId(item.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-cyan-500/10 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.15)]'
                          : 'bg-white/[0.02] border-white/[0.07] hover:bg-white/[0.05]'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-xs font-mono text-slate-500">#{idx + 1}</span>
                        <div className="truncate">
                          <div className="text-xs font-semibold text-slate-200 truncate max-w-xs sm:max-w-md">
                            {item.file.name}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate mt-0.5">
                            {item.stageMessage || 'Processing…'}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {isWorking && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center gap-1.5">
                            <RefreshCw size={10} className="animate-spin" />
                            {item.progress}%
                          </span>
                        )}
                        {isSuccess && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                            <CheckCircle2 size={11} />
                            Completed
                          </span>
                        )}
                        {isFailed && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-1">
                            <AlertCircle size={11} />
                            Failed
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Inspect Selected File's Stage Progression */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4 border-b border-white/[0.06] pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    Detailed Telemetry:
                  </span>
                  <span className="text-xs font-mono text-cyan-300 font-semibold">
                    {currentItem?.file.name}
                  </span>
                </div>
                {currentItem?.jobId && (
                  <span className="text-xs font-mono text-slate-500">
                    ID: {currentItem.jobId}
                  </span>
                )}
              </div>

              {currentItem?.status === 'failed' ? (
                <div className="p-4 bg-red-500/[0.08] border border-red-500/25 rounded-xl space-y-3">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-red-400">Enhancement Failed for this File</h4>
                      <p className="text-xs text-red-300/80 mt-1 leading-relaxed">
                        {currentItem.error || 'The model could not process this raster. Remaining batch items will continue processing uninterrupted.'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRetryItem(currentItem)}
                    className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 text-red-300 border-red-500/30 hover:bg-red-500/10"
                  >
                    <RotateCcw size={12} />
                    Retry this file
                  </button>
                </div>
              ) : (
                <ProcessingProgress job={currentInspectionJob} />
              )}
            </div>
          </div>
        )}

        {/* ── Results Step ── */}
        {step === 'results' && (
          <div className="anim-fade-in space-y-6">
            {/* Batch Overview Banner if multiple files were uploaded */}
            {batchItems.length > 1 && (
              <div className="glass rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <CheckCircle2 size={16} className="text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Batch Processing Summary</h3>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                      <span className="text-emerald-400 font-semibold">{completedBatchItems.length} Succeeded</span>
                      {failedBatchItems.length > 0 && (
                        <span className="text-red-400 font-semibold">{failedBatchItems.length} Failed</span>
                      )}
                      <span>· Total: {batchItems.length} rasters</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleReset}
                  className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
                >
                  <Upload size={13} />
                  Enhance More Images
                </button>
              </div>
            )}

            {/* ── SUCCESSFUL FILES SECTION ── */}
            {(completedBatchItems.length > 0 || !!activeJob) && (
              <div className="space-y-4">
                {/* Batch Selector if multiple successful jobs exist */}
                {completedBatchItems.length > 1 && (
                  <div className="glass rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Successful Products:
                      </span>
                      <span className="text-xs text-slate-500">
                        Click a file to inspect comparison and metrics
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {completedBatchItems.map((item, idx) => {
                        const isSelected = (selectedJobId || currentResultJob.jobId) === item.job!.jobId;
                        return (
                          <button
                            key={item.id}
                            onClick={() => {
                              setSelectedJobId(item.job!.jobId);
                              setActiveJob(item.job!);
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 flex items-center gap-2 ${
                              isSelected
                                ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                                : 'bg-white/[0.04] border border-white/[0.08] text-slate-400 hover:text-slate-200 hover:bg-white/[0.08]'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            <span className="truncate max-w-[150px]">{item.file.name || `Image ${idx + 1}`}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Detailed Results Viewer for active successful job */}
                <ResultsViewer
                  job={currentResultJob}
                  onNewEnhancement={handleReset}
                  onViewAnalysis={() => navigate('/analysis')}
                  onViewCompare={() => navigate('/compare')}
                />
              </div>
            )}

            {/* ── FAILED FILES SEPARATE SECTION ── */}
            {failedBatchItems.length > 0 && (
              <div className="glass rounded-2xl p-5 border border-red-500/20 bg-red-500/[0.02] space-y-3">
                <div className="flex items-center gap-2 border-b border-red-500/15 pb-3">
                  <AlertCircle size={16} className="text-red-400" />
                  <h3 className="text-sm font-bold text-red-400">
                    Failed Rasters ({failedBatchItems.length})
                  </h3>
                  <span className="text-xs text-slate-500 ml-auto">
                    Isolated failures did not stop successful files
                  </span>
                </div>

                <div className="space-y-2">
                  {failedBatchItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-white/[0.02] border border-white/[0.06] rounded-xl flex flex-wrap items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-slate-200 truncate">
                          {item.file.name}
                          <span className="text-[10px] text-slate-500 ml-2">
                            ({(item.file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <div className="text-[11px] text-red-400/90 mt-0.5">
                          {item.error || 'Processing was aborted for this file.'}
                        </div>
                      </div>

                      <button
                        onClick={() => handleRetryItem(item)}
                        className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5 text-cyan-400 border-cyan-500/30 hover:bg-cyan-500/10"
                      >
                        <RotateCcw size={12} />
                        Retry
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

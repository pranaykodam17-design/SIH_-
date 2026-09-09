import React, { useCallback, useRef, useState } from 'react';
import { Upload, FileImage, X, AlertCircle, CheckCircle, Plus } from 'lucide-react';

interface ImageUploaderProps {
  onFileSelect?: (file: File) => void;
  onFilesSelect?: (files: File[]) => void;
  selectedFile?: File | null;
  selectedFiles?: File[];
  onRemoveFile?: (index: number) => void;
  onClear?: () => void;
  disabled?: boolean;
}

const ACCEPTED_TYPES = ['image/tiff', 'image/png', 'image/jpeg', '.tif', '.tiff', '.geotiff'];
const MAX_SIZE_MB = 500;

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onFileSelect,
  onFilesSelect,
  selectedFile,
  selectedFiles = [],
  onRemoveFile,
  onClear,
  disabled = false,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Normalize files array: if selectedFiles has items use it, else fallback to selectedFile
  const allFiles = selectedFiles.length > 0 ? selectedFiles : (selectedFile ? [selectedFile] : []);

  const validate = (file: File): string | null => {
    const ext = file.name.toLowerCase().split('.').pop() || '';
    const allowed = ['tif', 'tiff', 'png', 'jpg', 'jpeg'];
    if (!allowed.includes(ext) && !ACCEPTED_TYPES.includes(file.type)) {
      return `"${file.name}": Unsupported format. Please upload GeoTIFF, TIFF, PNG, or JPG.`;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return `"${file.name}" is too large. Maximum size is ${MAX_SIZE_MB}MB.`;
    }
    return null;
  };

  const processFiles = useCallback((files: File[]) => {
    for (const f of files) {
      const err = validate(f);
      if (err) {
        setError(err);
        return;
      }
    }
    setError(null);
    if (onFilesSelect) {
      onFilesSelect(files);
    }
    if (onFileSelect && files.length > 0) {
      onFileSelect(files[0]);
    }
  }, [onFilesSelect, onFileSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    if (disabled) return;
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) processFiles(droppedFiles);
  }, [disabled, processFiles]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputFiles = e.target.files ? Array.from(e.target.files) : [];
    if (inputFiles.length > 0) processFiles(inputFiles);
    e.target.value = '';
  };

  const handleClear = () => {
    setError(null);
    onClear?.();
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  // If one or more files are selected — show multi-file list state
  if (allFiles.length > 0) {
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <CheckCircle size={15} className="text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-400">
              {allFiles.length} {allFiles.length === 1 ? 'Satellite Raster Selected' : 'Satellite Rasters Selected (Batch Mode)'}
            </span>
          </div>
          <button
            onClick={handleClear}
            className="text-xs text-slate-500 hover:text-red-400 transition-colors"
          >
            Clear All
          </button>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {allFiles.map((file, idx) => (
            <div
              key={`${file.name}-${idx}`}
              className="flex items-center justify-between p-3 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:border-cyan-500/30 transition-all"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
                  <FileImage size={18} className="text-cyan-400" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-medium text-slate-200 truncate max-w-xs" title={file.name}>
                    {file.name}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500">
                    <span>{formatSize(file.size)}</span>
                    <span>·</span>
                    <span className="font-mono uppercase">{file.name.split('.').pop()}</span>
                    <span>·</span>
                    <span className="text-cyan-400 font-mono">Bands: B2, B3, B4, B8</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onRemoveFile ? onRemoveFile(idx) : handleClear()}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200 flex-shrink-0 ml-2"
                title="Remove this image"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* Add more files button */}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full py-2 px-3 border border-dashed border-white/10 hover:border-cyan-500/40 rounded-xl text-xs text-slate-400 hover:text-cyan-400 flex items-center justify-center gap-2 transition-all bg-white/[0.01] hover:bg-cyan-500/[0.03]"
        >
          <Plus size={14} />
          Add More Images to Batch
        </button>

        <input
          ref={inputRef}
          id="satellite-file-input-more"
          type="file"
          accept=".tif,.tiff,.png,.jpg,.jpeg"
          multiple
          onChange={handleInputChange}
          className="hidden"
        />
      </div>
    );
  }

  // Empty state — show drag-and-drop zone
  return (
    <div>
      <div
        className={`upload-zone relative ${isDragActive ? 'drag-active' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragEnter={(e) => { e.preventDefault(); if (!disabled) setIsDragActive(true); }}
        onDragOver={(e) => { e.preventDefault(); if (!disabled) setIsDragActive(true); }}
        onDragLeave={(e) => { e.preventDefault(); setIsDragActive(false); }}
        onDrop={handleDrop}
        onClick={() => { if (!disabled) inputRef.current?.click(); }}
      >
        <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
          {/* Icon */}
          <div className={`relative mb-5 transition-transform duration-300 ${isDragActive ? 'scale-110' : ''}`}>
            <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.1] flex items-center justify-center">
              <Upload size={28} className={`transition-colors duration-300 ${isDragActive ? 'text-cyan-400' : 'text-slate-500'}`} />
            </div>
            {isDragActive && (
              <div className="absolute inset-0 rounded-2xl border-2 border-cyan-400 animate-ping opacity-30" />
            )}
          </div>

          <div className="mb-2">
            <span className={`text-base font-semibold transition-colors duration-300 ${isDragActive ? 'text-cyan-400' : 'text-slate-200'}`}>
              {isDragActive ? 'Drop your image here' : 'Upload Your Satellite Image'}
            </span>
          </div>
          <p className="text-sm text-slate-500 mb-5 max-w-xs leading-relaxed">
            Drag & drop a GeoTIFF, TIFF, PNG or JPG file here, or click to browse
          </p>

          <button
            type="button"
            className="btn-secondary text-sm px-5 py-2.5"
            onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
          >
            Choose File
          </button>

          {/* Format badges */}
          <div className="flex items-center gap-1.5 mt-5 flex-wrap justify-center">
            {['GeoTIFF', 'TIFF', 'PNG', 'JPG'].map((fmt) => (
              <span key={fmt} className="px-2 py-0.5 text-[10px] font-medium text-slate-600 bg-white/[0.03] border border-white/[0.07] rounded">
                {fmt}
              </span>
            ))}
            <span className="px-2 py-0.5 text-[10px] text-slate-700">Max {MAX_SIZE_MB}MB</span>
          </div>
        </div>

        <input
          ref={inputRef}
          id="satellite-file-input"
          type="file"
          accept=".tif,.tiff,.png,.jpg,.jpeg"
          multiple
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled}
        />
      </div>

      {/* Error */}
      {error && (
        <div className="mt-3 flex items-center gap-2 px-4 py-3 bg-red-500/8 border border-red-500/20 rounded-xl">
          <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
          <span className="text-sm text-red-400">{error}</span>
        </div>
      )}
    </div>
  );
};

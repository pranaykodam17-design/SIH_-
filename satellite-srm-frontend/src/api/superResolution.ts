import { apiClient } from './client';
import { mockStartJob } from './mockApi';
import { ProcessingJob } from '../types/satellite';

export interface StartReconstructionParams {
  file?: File;
  files?: File[];
  referenceFile?: File;
  model?: string;
  enableUncertainty?: boolean;
  scaleFactor?: number;
}

export interface SuperResolutionResponse {
  job_id: string;
  job_ids?: string[];
  count?: number;
  status: string;
  job?: ProcessingJob;
}

export async function startSingleSuperResolution(
  file: File,
  options: {
    model?: string;
    enableUncertainty?: boolean;
    scaleFactor?: number;
    referenceFile?: File;
  } = {}
): Promise<SuperResolutionResponse> {
  const formData = new FormData();
  formData.append('file', file, file.name);

  if (options.model) {
    formData.append('model', options.model);
  }
  formData.append('enable_uncertainty', String(options.enableUncertainty ?? true));
  if (options.scaleFactor) {
    formData.append('scale_factor', String(options.scaleFactor));
  }
  if (options.referenceFile) {
    formData.append('reference_file', options.referenceFile, options.referenceFile.name);
  }

  return apiClient<SuperResolutionResponse>(
    '/api/v1/super-resolution',
    {
      method: 'POST',
      body: formData,
    }
  );
}

export async function startSuperResolution(
  params: StartReconstructionParams,
  isMock = false
): Promise<SuperResolutionResponse> {
  if (isMock) {
    return mockStartJob(params as any);
  }

  const primaryFile = params.file || (params.files && params.files[0]);
  if (!primaryFile) {
    throw new Error('No satellite image file provided for super-resolution.');
  }

  return startSingleSuperResolution(primaryFile, {
    model: params.model,
    enableUncertainty: params.enableUncertainty,
    scaleFactor: params.scaleFactor,
    referenceFile: params.referenceFile,
  });
}

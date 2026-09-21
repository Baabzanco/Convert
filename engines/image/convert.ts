import { ToolError } from '../shared/errors';
import { validateJpegFile, validatePngFile } from '../shared/validation';
import { imageWorkerClient } from './worker/worker-client';
import type { ImageWorkerRequest, WorkerProgressStage } from './worker/worker-types';

export interface ImageConvertOptions {
  targetFormat: 'png' | 'jpg' | 'webp';
  quality?: number; // 0.1 to 1.0
  backgroundColor?: string;
}

export interface PngToJpgOptions {
  quality?: number; // 0.7, 0.8, 0.9 (default: 0.9)
  backgroundColor?: string; // '#FFFFFF' (default) or '#000000'
}

export interface ImageProcessingResult {
  blob: Blob;
  fileName: string;
  width: number;
  height: number;
  originalSize: number;
  convertedSize: number;
}

/**
 * Converts a JPEG file into a PNG entirely client-side in the browser.
 * Preserves dimensions, handles orientation, and validates magic bytes.
 */
export async function convertJpgToPng(
  file: File,
  onProgress?: (progress: number, stage?: WorkerProgressStage) => void
): Promise<ImageProcessingResult> {
  return convertImage(file, { targetFormat: 'png' }, onProgress);
}

/**
 * Converts a PNG file into a JPG entirely client-side in the browser.
 * Handles solid background compositing for transparency and adjustable JPEG quality.
 */
export async function convertPngToJpg(
  file: File,
  options: PngToJpgOptions = {},
  onProgress?: (progress: number, stage?: WorkerProgressStage) => void
): Promise<ImageProcessingResult> {
  return convertImage(
    file,
    {
      targetFormat: 'jpg',
      quality: options.quality ?? 0.9,
      backgroundColor: options.backgroundColor ?? '#FFFFFF',
    },
    onProgress
  );
}

/**
 * Image conversion engine coordinating validation, workers, and encoding.
 */
export async function convertImage(
  file: File,
  options: ImageConvertOptions,
  onProgress?: (progress: number, stage?: WorkerProgressStage) => void
): Promise<ImageProcessingResult> {
  // 1. Initial Validation Pipeline (Size -> Ext -> MIME -> Magic Bytes)
  if (options.targetFormat === 'png') {
    onProgress?.(10, 'validating');
    const validation = await validateJpegFile(file);
    if (!validation.valid && validation.error) {
      throw validation.error;
    }
  } else if (options.targetFormat === 'jpg') {
    onProgress?.(10, 'validating');
    const validation = await validatePngFile(file);
    if (!validation.valid && validation.error) {
      throw validation.error;
    }
  }

  // 2. Read File Data
  onProgress?.(25, 'reading');
  const buffer = await file.arrayBuffer();

  const taskId =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `task_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

  const request: ImageWorkerRequest = {
    id: taskId,
    operation: 'convert',
    fileData: buffer,
    fileName: file.name,
    mimeType: file.type || (options.targetFormat === 'jpg' ? 'image/png' : 'image/jpeg'),
    options: {
      targetFormat: options.targetFormat,
      quality: options.quality,
      backgroundColor: options.backgroundColor,
    },
  };

  // 3. Process via Image Worker with fallback
  const response = await imageWorkerClient.executeTask(request, (stage, percent) => {
    onProgress?.(percent, stage);
  });

  if (!response.success || !response.resultData) {
    const code = response.errorCode || 'PROCESSING_FAILED';
    const message = response.error || "We couldn't convert this image. Please try again.";
    throw new ToolError(code, message);
  }

  const defaultMime = options.targetFormat === 'jpg' ? 'image/jpeg' : 'image/png';
  const resultBlob = new Blob([response.resultData], { type: response.resultMime || defaultMime });
  const fallbackFileName =
    options.targetFormat === 'jpg'
      ? file.name.replace(/\.png$/i, '.jpg')
      : file.name.replace(/\.(jpe?g)$/i, '.png');

  return {
    blob: resultBlob,
    fileName: response.fileName || fallbackFileName,
    width: response.width || 0,
    height: response.height || 0,
    originalSize: response.originalSize || file.size,
    convertedSize: response.convertedSize || resultBlob.size,
  };
}


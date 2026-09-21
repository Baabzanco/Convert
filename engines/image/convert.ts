import { ToolError } from '../shared/errors';
import { validateJpegFile, validatePngFile, validateWebpFile } from '../shared/validation';
import { imageWorkerClient } from './worker/worker-client';
import type { ImageWorkerRequest, WorkerProgressStage } from './worker/worker-types';

export interface ImageConvertOptions {
  targetFormat: 'png' | 'jpg' | 'webp';
  sourceFormat?: 'png' | 'jpg' | 'webp';
  quality?: number; // 0.1 to 1.0
  backgroundColor?: string;
}

export interface PngToJpgOptions {
  quality?: number; // 0.7, 0.8, 0.9 (default: 0.9)
  backgroundColor?: string; // '#FFFFFF' (default) or '#000000'
}

export interface JpgToWebpOptions {
  quality?: number; // 0.7, 0.8, 0.9 (default: 0.9)
}

export interface WebpToJpgOptions {
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
      sourceFormat: 'png',
      targetFormat: 'jpg',
      quality: options.quality ?? 0.9,
      backgroundColor: options.backgroundColor ?? '#FFFFFF',
    },
    onProgress
  );
}

/**
 * Converts a JPEG file into a WebP entirely client-side in the browser.
 * Preserves original dimensions, handles orientation, and validates WebP output.
 */
export async function convertJpgToWebp(
  file: File,
  options: JpgToWebpOptions = {},
  onProgress?: (progress: number, stage?: WorkerProgressStage) => void
): Promise<ImageProcessingResult> {
  return convertImage(
    file,
    {
      sourceFormat: 'jpg',
      targetFormat: 'webp',
      quality: options.quality ?? 0.9,
    },
    onProgress
  );
}

/**
 * Converts a WebP file into a JPG entirely client-side in the browser.
 * Handles solid background compositing for transparency and adjustable JPEG quality.
 */
export async function convertWebpToJpg(
  file: File,
  options: WebpToJpgOptions = {},
  onProgress?: (progress: number, stage?: WorkerProgressStage) => void
): Promise<ImageProcessingResult> {
  return convertImage(
    file,
    {
      sourceFormat: 'webp',
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
  const isWebpSource =
    options.sourceFormat === 'webp' ||
    (options.targetFormat === 'jpg' && file.name.toLowerCase().endsWith('.webp'));

  if (isWebpSource) {
    onProgress?.(10, 'validating');
    const validation = await validateWebpFile(file);
    if (!validation.valid && validation.error) {
      throw validation.error;
    }
  } else if (options.targetFormat === 'png' || options.targetFormat === 'webp') {
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

  const defaultInputMime = isWebpSource
    ? 'image/webp'
    : options.targetFormat === 'jpg'
    ? 'image/png'
    : 'image/jpeg';

  const request: ImageWorkerRequest = {
    id: taskId,
    operation: 'convert',
    fileData: buffer,
    fileName: file.name,
    mimeType: file.type || defaultInputMime,
    options: {
      targetFormat: options.targetFormat,
      sourceFormat: options.sourceFormat || (isWebpSource ? 'webp' : undefined),
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

  const defaultMime =
    options.targetFormat === 'webp'
      ? 'image/webp'
      : options.targetFormat === 'jpg'
      ? 'image/jpeg'
      : 'image/png';
  const resultBlob = new Blob([response.resultData], { type: response.resultMime || defaultMime });

  // Explicit verification for WebP output to prevent accidental PNG or JPEG fallback
  if (
    options.targetFormat === 'webp' &&
    (response.resultMime !== 'image/webp' || resultBlob.type !== 'image/webp' || resultBlob.size <= 0)
  ) {
    throw new ToolError(
      'UNSUPPORTED_FORMAT',
      'Your browser could not create a WebP image. Please try another browser.'
    );
  }

  // Explicit verification for JPEG output to prevent accidental PNG or WebP fallback
  if (
    options.targetFormat === 'jpg' &&
    (response.resultMime !== 'image/jpeg' || resultBlob.type !== 'image/jpeg' || resultBlob.size <= 0)
  ) {
    throw new ToolError(
      'UNSUPPORTED_FORMAT',
      'Your browser could not create a JPG image. Please try another browser.'
    );
  }

  const fallbackFileName =
    options.targetFormat === 'webp'
      ? file.name.replace(/\.(jpe?g)$/i, '.webp')
      : options.targetFormat === 'jpg'
      ? file.name.replace(/\.(webp|png)$/i, '.jpg')
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


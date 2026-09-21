import type { ImageProcessingResult } from './convert';

export interface ImageResizeOptions {
  width?: number;
  height?: number;
  scalePercent?: number;
  maintainAspectRatio?: boolean;
}

export async function resizeImage(
  _file: File,
  _options: ImageResizeOptions,
  _onProgress?: (progress: number) => void
): Promise<ImageProcessingResult> {
  throw new Error('Image resize engine interface ready. Tool implementation scheduled for tool phase.');
}

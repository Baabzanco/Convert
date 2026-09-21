import type { ImageProcessingResult } from './convert';

export interface ImageCropOptions {
  x: number;
  y: number;
  width: number;
  height: number;
}

export async function cropImage(
  _file: File,
  _options: ImageCropOptions,
  _onProgress?: (progress: number) => void
): Promise<ImageProcessingResult> {
  throw new Error('Image crop engine interface ready. Tool implementation scheduled for tool phase.');
}

import type { ImageProcessingResult } from './convert';

export interface ImageRotateOptions {
  degrees: 90 | 180 | 270;
  flipHorizontal?: boolean;
  flipVertical?: boolean;
}

export async function rotateImage(
  _file: File,
  _options: ImageRotateOptions,
  _onProgress?: (progress: number) => void
): Promise<ImageProcessingResult> {
  throw new Error('Image rotate engine interface ready. Tool implementation scheduled for tool phase.');
}

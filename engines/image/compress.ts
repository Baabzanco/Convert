import type { ImageProcessingResult } from './convert';

export interface ImageCompressOptions {
  quality: number; // 0.1 to 1.0
  maxDimensions?: { maxWidth?: number; maxHeight?: number };
}

export async function compressImage(
  _file: File,
  _options: ImageCompressOptions,
  _onProgress?: (progress: number) => void
): Promise<ImageProcessingResult> {
  throw new Error('Image compress engine interface ready. Tool implementation scheduled for tool phase.');
}

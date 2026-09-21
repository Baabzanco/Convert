import type { PdfProcessingResult } from './convert';

export interface PdfRotateOptions {
  degrees: 90 | 180 | 270;
  pages?: number[]; // optional specific pages, all pages if undefined
}

export async function rotatePdf(
  _file: File,
  _options: PdfRotateOptions,
  _onProgress?: (progress: number) => void
): Promise<PdfProcessingResult> {
  throw new Error('PDF rotate engine interface ready. Tool implementation scheduled for PDF tool phase.');
}

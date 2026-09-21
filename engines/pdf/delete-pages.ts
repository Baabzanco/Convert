import type { PdfProcessingResult } from './convert';

export interface PdfDeletePagesOptions {
  pagesToDelete: number[]; // 1-indexed page numbers
}

export async function deletePdfPages(
  _file: File,
  _options: PdfDeletePagesOptions,
  _onProgress?: (progress: number) => void
): Promise<PdfProcessingResult> {
  throw new Error('PDF delete pages engine interface ready. Tool implementation scheduled for PDF tool phase.');
}

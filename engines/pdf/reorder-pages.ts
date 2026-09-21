import type { PdfProcessingResult } from './convert';

export interface PdfReorderPagesOptions {
  newPageOrder: number[]; // Array of 1-indexed original page numbers in desired sequence
}

export async function reorderPdfPages(
  _file: File,
  _options: PdfReorderPagesOptions,
  _onProgress?: (progress: number) => void
): Promise<PdfProcessingResult> {
  throw new Error('PDF reorder pages engine interface ready. Tool implementation scheduled for PDF tool phase.');
}

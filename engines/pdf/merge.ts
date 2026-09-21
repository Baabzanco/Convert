import type { PdfProcessingResult } from './convert';

export async function mergePdfs(
  _files: File[],
  _onProgress?: (progress: number) => void
): Promise<PdfProcessingResult> {
  throw new Error('PDF merge engine interface ready. Tool implementation scheduled for PDF tool phase.');
}

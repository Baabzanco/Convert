export interface PdfSplitOptions {
  pageRanges: string; // e.g. "1-3, 5"
  splitIntoSinglePages?: boolean;
}

export async function splitPdf(
  _file: File,
  _options: PdfSplitOptions,
  _onProgress?: (progress: number) => void
): Promise<{ blobs: Blob[]; fileNames: string[] }> {
  throw new Error('PDF split engine interface ready. Tool implementation scheduled for PDF tool phase.');
}

export interface LoadedPdfDocument {
  pageCount: number;
  data: ArrayBuffer;
}

export async function loadPdfDocument(_file: File): Promise<LoadedPdfDocument> {
  throw new Error('PDF loader interface ready. Implementation scheduled for PDF tool phase.');
}

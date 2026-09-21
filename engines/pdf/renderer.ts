export interface RenderPageOptions {
  pageNumber: number;
  scale?: number;
}

export async function renderPdfPageToCanvas(
  _pdfData: ArrayBuffer,
  _options: RenderPageOptions,
  _canvas: HTMLCanvasElement
): Promise<void> {
  throw new Error('PDF renderer interface ready. Implementation scheduled for PDF tool phase.');
}

// Polyfill Promise.try if not supported in runtime (e.g. Node/V8 environment)
if (typeof (Promise as unknown as { try?: unknown }).try !== 'function') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (Promise as unknown as { try: (fn: (...args: any[]) => any, ...args: any[]) => Promise<any> }).try = function (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    fn: (...args: any[]) => any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...args: any[]
  ) {
    return new Promise((resolve) => resolve(fn(...args)));
  };
}

// Polyfill Uint8Array.prototype.toHex if not supported in runtime
if (typeof (Uint8Array.prototype as unknown as { toHex?: unknown }).toHex !== 'function') {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (Uint8Array.prototype as any).toHex = function (): string {
    return Array.from(this as Uint8Array)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  };
}

import * as pdfjsLib from 'pdfjs-dist';
import { ToolError } from '../shared/errors';

export interface LoadedPdfDocument {
  pageCount: number;
  data: ArrayBuffer;
  pdfDoc: pdfjsLib.PDFDocumentProxy;
  fingerprint: string;
}

/**
 * Configure worker source for client-side environments.
 */
export function configurePdfJsWorker(): void {
  if (typeof window !== 'undefined' && !pdfjsLib.GlobalWorkerOptions.workerSrc) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
  }
}

/**
 * Loads a PDF document using PDF.js and returns the document proxy and page count.
 */
export async function loadPdfDocument(
  fileOrData: File | ArrayBuffer | Uint8Array
): Promise<LoadedPdfDocument> {
  configurePdfJsWorker();
  let data: ArrayBuffer;
  if (fileOrData instanceof File) {
    data = await fileOrData.arrayBuffer();
  } else if (fileOrData instanceof Uint8Array) {
    data = fileOrData.buffer.slice(
      fileOrData.byteOffset,
      fileOrData.byteOffset + fileOrData.byteLength
    ) as ArrayBuffer;
  } else {
    data = fileOrData;
  }

  try {
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(data),
      useWorkerFetch: false,
    });

    loadingTask.onPassword = () => {
      throw new ToolError(
        'PASSWORD_PROTECTED',
        'This PDF is password-protected. Please provide an unlocked PDF.'
      );
    };

    const pdfDoc = await loadingTask.promise;
    return {
      pageCount: pdfDoc.numPages,
      data,
      pdfDoc,
      fingerprint: pdfDoc.fingerprints?.[0] || 'pdf-doc',
    };
  } catch (err: unknown) {
    const errAny = err as { name?: string; message?: string };
    if (
      errAny?.name === 'PasswordException' ||
      (typeof errAny?.message === 'string' && /password/i.test(errAny.message))
    ) {
      throw new ToolError(
        'PASSWORD_PROTECTED',
        'This PDF is password-protected. Please provide an unlocked PDF.'
      );
    }
    if (
      errAny?.name === 'InvalidPDFException' ||
      (typeof errAny?.message === 'string' &&
        (/invalid/i.test(errAny.message) || /corrupt/i.test(errAny.message)))
    ) {
      throw new ToolError('INVALID_FILE', "We couldn't read this PDF. Please try another file.");
    }
    if (err instanceof ToolError) {
      throw err;
    }
    throw new ToolError('PDF_READ_ERROR', "We couldn't read this PDF. Please try another file.");
  }
}

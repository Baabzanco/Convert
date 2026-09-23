import { PDFDocument } from 'pdf-lib';
import type { PdfWorkerRequest, PdfWorkerResponse } from './worker-types';
import { calculatePageLayout } from '../image-to-pdf';
import { hasJpegMagicBytes, hasPngMagicBytes } from '../../shared/validation';

/**
 * Handles PDF worker message events.
 */
export async function processPdfWorkerJob(
  request: PdfWorkerRequest,
  postMessageFn: (response: PdfWorkerResponse) => void
): Promise<void> {
  const { id, operation, files, options } = request;

  if (operation === 'image-to-pdf') {
    try {
      const totalFiles = files.length;
      postMessageFn({
        id,
        type: 'progress',
        success: true,
        stage: 'preparing',
        progress: 10,
        totalCount: totalFiles,
      });

      const pdfDoc = await PDFDocument.create();

      for (let i = 0; i < totalFiles; i++) {
        const fileItem = files[i];
        const bytes = new Uint8Array(fileItem.data);
        const progressVal = Math.round(10 + ((i + 0.5) / totalFiles) * 80);

        postMessageFn({
          id,
          type: 'progress',
          success: true,
          stage: 'processing',
          currentIndex: i + 1,
          totalCount: totalFiles,
          fileName: fileItem.name,
          progress: progressVal,
        });

        let embeddedImage;
        const ext = fileItem.name.split('.').pop()?.toLowerCase() || '';

        if (ext === 'jpg' || ext === 'jpeg' || hasJpegMagicBytes(bytes)) {
          embeddedImage = await pdfDoc.embedJpg(bytes);
        } else if (ext === 'png' || hasPngMagicBytes(bytes)) {
          embeddedImage = await pdfDoc.embedPng(bytes);
        } else {
          // If already converted to PNG or needs PNG embedding
          embeddedImage = await pdfDoc.embedPng(bytes);
        }

        const imgWidth = fileItem.width || embeddedImage.width || 800;
        const imgHeight = fileItem.height || embeddedImage.height || 600;

        const layout = calculatePageLayout(imgWidth, imgHeight, options);

        const page = pdfDoc.addPage([layout.pageWidth, layout.pageHeight]);
        page.drawImage(embeddedImage, {
          x: layout.x,
          y: layout.y,
          width: layout.renderedWidth,
          height: layout.renderedHeight,
        });
      }

      postMessageFn({
        id,
        type: 'progress',
        success: true,
        stage: 'finalizing',
        progress: 95,
        totalCount: totalFiles,
      });

      const pdfBytes = await pdfDoc.save();
      const safeBuffer = new Uint8Array(pdfBytes).buffer;

      postMessageFn({
        id,
        type: 'result',
        success: true,
        stage: 'completed',
        progress: 100,
        totalCount: totalFiles,
        pageCount: totalFiles,
        resultData: safeBuffer,
        resultFileName: totalFiles === 1 ? fileItemNameToPdf(files[0].name) : 'images-to-pdf.pdf',
      });
    } catch (err: unknown) {
      postMessageFn({
        id,
        type: 'error',
        success: false,
        error: err instanceof Error ? err.message : 'PDF generation failed.',
      });
    }
    return;
  }

  postMessageFn({
    id,
    type: 'error',
    success: false,
    error: `Unsupported PDF operation: ${operation}`,
  });
}

function fileItemNameToPdf(name: string): string {
  const lastDot = name.lastIndexOf('.');
  if (lastDot === -1) return `${name}.pdf`;
  return `${name.substring(0, lastDot)}.pdf`;
}

// Global worker scope listener when running inside actual Web Worker
if (typeof self !== 'undefined' && typeof window === 'undefined') {
  self.onmessage = (event: MessageEvent<PdfWorkerRequest>) => {
    processPdfWorkerJob(event.data, (res) => self.postMessage(res));
  };
}

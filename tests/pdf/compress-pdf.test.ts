// Polyfill Promise.try if not supported in runtime
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

import { describe, it, expect, vi, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { PDFDocument, rgb } from 'pdf-lib';
import {
  validateCompressPdfFile,
  COMPRESS_PDF_LIMITS,
} from '@/engines/pdf/validation';
import { compressPdf, optimizePdfBytes } from '@/engines/pdf/compress';
import { sanitizePdfBaseName } from '@/engines/pdf/utils';

/**
 * Helper to generate a valid PDF with deterministic text and page count.
 */
async function createTestPdfFile(name: string, pageCount = 1, uncompressed = false): Promise<File> {
  const doc = await PDFDocument.create();
  for (let i = 0; i < pageCount; i++) {
    const page = doc.addPage([400, 600]);
    page.drawText(`${name} - Page ${i + 1}`, {
      x: 30,
      y: 550,
      size: 16,
      color: rgb(0, 0, 0),
    });
    for (let j = 0; j < 15; j++) {
      page.drawText(`Body paragraph line ${j + 1} with repeated text to allow structural compression testing.`, {
        x: 30,
        y: 500 - j * 20,
        size: 10,
        color: rgb(0.2, 0.2, 0.2),
      });
    }
  }
  const bytes = await doc.save({ useObjectStreams: !uncompressed });
  const safeBuffer = new Uint8Array(bytes).buffer;
  return new File([safeBuffer], name, { type: 'application/pdf' });
}

describe('Tool #22: Compress PDF Engine', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('1. PDF Validation & Limits', () => {
    it('accepts a valid PDF file with %PDF- header', async () => {
      const file = await createTestPdfFile('document.pdf', 2);
      const res = await validateCompressPdfFile(file);
      expect(res.valid).toBe(true);
      expect(res.error).toBeUndefined();
    });

    it('rejects a non-PDF file based on extension and MIME', async () => {
      const textFile = new File(['plain text data'], 'doc.txt', { type: 'text/plain' });
      const res = await validateCompressPdfFile(textFile);
      expect(res.valid).toBe(false);
      expect(res.error?.code).toBe('UNSUPPORTED_FORMAT');
    });

    it('rejects a fake PDF file with .pdf extension but invalid magic bytes', async () => {
      const fakePdf = new File(['Not a real PDF structure'], 'fake.pdf', {
        type: 'application/pdf',
      });
      const res = await validateCompressPdfFile(fakePdf);
      expect(res.valid).toBe(false);
      expect(res.error?.code).toBe('INVALID_FILE');
    });

    it('rejects empty 0-byte PDF files', async () => {
      const emptyPdf = new File([], 'empty.pdf', { type: 'application/pdf' });
      const res = await validateCompressPdfFile(emptyPdf);
      expect(res.valid).toBe(false);
      expect(res.error?.code).toBe('INVALID_FILE');
    });

    it('rejects oversized PDF files exceeding 100 MB', async () => {
      const hugeFile = {
        name: 'huge.pdf',
        type: 'application/pdf',
        size: COMPRESS_PDF_LIMITS.MAX_FILE_SIZE + 1024,
        slice: () => new Blob(),
      } as unknown as File;

      const res = await validateCompressPdfFile(hugeFile);
      expect(res.valid).toBe(false);
      expect(res.error?.code).toBe('FILE_TOO_LARGE');
    });
  });

  describe('2. Filename Sanitization', () => {
    it('sanitizes base filenames cleanly removing unsafe path traversal', () => {
      expect(sanitizePdfBaseName('annual-report.pdf')).toBe('annual-report');
      expect(sanitizePdfBaseName('../../../etc/passwd.pdf')).toBe('etc-passwd');
      expect(sanitizePdfBaseName('my:document*name.pdf')).toBe('my-document-name');
      expect(sanitizePdfBaseName('...pdf')).toBe('document');
    });
  });

  describe('3. Structural Compression & Genuine Size Reduction', () => {
    it('compresses a compressible multi-page PDF and reports accurate positive reduction', async () => {
      const fixturePath = path.join(process.cwd(), 'tests/fixtures/compressible.pdf');
      const buffer = fs.readFileSync(fixturePath);
      const safeBuffer = new Uint8Array(buffer).buffer;
      const file = new File([safeBuffer], 'report.pdf', { type: 'application/pdf' });

      const progressSteps: number[] = [];
      const result = await compressPdf(file, {}, (p) => {
        progressSteps.push(p.progress);
      });

      expect(result.originalSize).toBe(buffer.length);
      expect(result.isReduced).toBe(true);
      expect(result.isOriginalKept).toBe(false);
      expect(result.resultSize).toBeLessThan(result.originalSize);
      expect(result.reductionPercent).toBeGreaterThan(10);
      expect(result.resultFileName).toBe('report-compressed.pdf');
      expect(progressSteps).toContain(100);

      // Verify the generated PDF is valid and preserves page count
      const resultBytes = await result.resultBlob.arrayBuffer();
      const outputDoc = await PDFDocument.load(resultBytes);
      expect(outputDoc.getPageCount()).toBe(5);
    });

    it('preserves exact page dimensions and layout during compression', async () => {
      const doc = await PDFDocument.create();
      const p1 = doc.addPage([500, 700]);
      p1.drawText('Page 1 test text', { x: 50, y: 650, size: 12 });
      const p2 = doc.addPage([600, 800]);
      p2.drawText('Page 2 test text', { x: 50, y: 750, size: 12 });
      const bytes = await doc.save({ useObjectStreams: false });

      const file = new File([new Uint8Array(bytes).buffer], 'dimensions.pdf', {
        type: 'application/pdf',
      });
      const result = await compressPdf(file);

      const loadedOutput = await PDFDocument.load(await result.resultBlob.arrayBuffer());
      expect(loadedOutput.getPageCount()).toBe(2);
      expect(loadedOutput.getPage(0).getWidth()).toBe(500);
      expect(loadedOutput.getPage(0).getHeight()).toBe(700);
      expect(loadedOutput.getPage(1).getWidth()).toBe(600);
      expect(loadedOutput.getPage(1).getHeight()).toBe(800);
    });
  });

  describe('4. No-Reduction Handling (Never Falsely Claim Compression)', () => {
    it('returns the exact original file when PDF cannot be further reduced', async () => {
      const fixturePath = path.join(process.cwd(), 'tests/fixtures/already-optimized.pdf');
      const buffer = fs.readFileSync(fixturePath);
      const safeBuffer = new Uint8Array(buffer).buffer;
      const file = new File([safeBuffer], 'minimal.pdf', { type: 'application/pdf' });

      const result = await compressPdf(file);

      expect(result.isReduced).toBe(false);
      expect(result.isOriginalKept).toBe(true);
      expect(result.reductionPercent).toBe(0);
      expect(result.resultSize).toBe(file.size);
      expect(result.resultFileName).toBe('minimal.pdf');
      // The downloadable blob must be the original file reference
      expect(result.resultBlob).toBe(file);
    });

    it('does not report compression when compressed size equals or exceeds original size', async () => {
      // Create a minimal 1-page PDF
      const doc = await PDFDocument.create();
      doc.addPage([200, 200]);
      const bytes = await doc.save({ useObjectStreams: true });
      const file = new File([new Uint8Array(bytes).buffer], 'tiny.pdf', {
        type: 'application/pdf',
      });

      const result = await compressPdf(file);

      if (!result.isReduced) {
        expect(result.reductionPercent).toBe(0);
        expect(result.resultFileName).toBe('tiny.pdf');
        expect(result.isOriginalKept).toBe(true);
      } else {
        expect(result.resultSize).toBeLessThan(result.originalSize);
        expect(result.reductionPercent).toBeGreaterThan(0);
      }
    });
  });

  describe('5. Error Handling & Edge Cases', () => {
    it('throws ToolError with PASSWORD_PROTECTED for password-protected PDFs', async () => {
      vi.spyOn(PDFDocument, 'load').mockImplementationOnce(() => {
        throw new Error('Input document is password-protected or encrypted');
      });

      const file = await createTestPdfFile('encrypted.pdf', 1);
      await expect(compressPdf(file)).rejects.toThrow(
        'This PDF is password-protected. Please provide an unlocked PDF.'
      );
    });

    it('throws ToolError with BROWSER_MEMORY_ERROR when browser memory is exhausted', async () => {
      vi.spyOn(PDFDocument, 'load').mockImplementationOnce(() => {
        throw new Error('Array buffer allocation failed (memory error)');
      });

      const file = await createTestPdfFile('memory-test.pdf', 1);
      await expect(compressPdf(file)).rejects.toThrow(/memory/i);
    });

    it('throws ToolError when PDF has 0 pages', async () => {
      const doc = await PDFDocument.create();
      // Document without adding any pages
      const bytes = await doc.save({ addDefaultPage: false });
      const file = new File([new Uint8Array(bytes).buffer], 'zero-pages.pdf', {
        type: 'application/pdf',
      });

      await expect(compressPdf(file)).rejects.toThrow(/no readable pages|contains no pages/i);
    });

    it('handles optimizePdfBytes directly with raw Uint8Array input', async () => {
      const file = await createTestPdfFile('direct.pdf', 2, true);
      const arrayBuffer = await file.arrayBuffer();
      const res = await optimizePdfBytes(arrayBuffer, 'direct.pdf');

      expect(res.pageCount).toBe(2);
      expect(res.candidateBytes.byteLength).toBeGreaterThan(0);
      expect(res.originalDimensions.length).toBe(2);
    });
  });
});

import { PDFDocument } from 'pdf-lib';
import { ToolError } from '../shared/errors';
import { hasPdfMagicBytes } from '../shared/validation';
import { validateCompressPdfFile } from './validation';
import { sanitizePdfBaseName } from './utils';

export interface CompressPdfOptions {
  customBaseName?: string;
}

export type CompressPdfStage =
  | 'reading'
  | 'analyzing'
  | 'optimizing'
  | 'generating'
  | 'validating'
  | 'comparing'
  | 'completed';

export interface CompressPdfProgress {
  stage: CompressPdfStage;
  progress: number;
  message: string;
}

export interface CompressPdfResult {
  originalFileName: string;
  originalSize: number;
  resultFileName: string;
  resultSize: number;
  resultBlob: Blob;
  pageCount: number;
  isReduced: boolean;
  reductionPercent: number; // e.g. 34.6 (0 if not reduced)
  isOriginalKept: boolean;
}

interface PageDimension {
  width: number;
  height: number;
}

/**
 * Optimizes raw PDF bytes client-side using structural optimization.
 * Does not rasterize pages to preserve vector fidelity, typography, and layout.
 */
export async function optimizePdfBytes(
  inputData: ArrayBuffer | Uint8Array,
  fileName: string,
  onProgress?: (progress: CompressPdfProgress) => void
): Promise<{
  candidateBytes: Uint8Array;
  originalSize: number;
  pageCount: number;
  originalDimensions: PageDimension[];
}> {
  const originalBytes = inputData instanceof Uint8Array ? inputData : new Uint8Array(inputData);
  const originalSize = originalBytes.byteLength;

  if (originalSize === 0) {
    throw new ToolError('INVALID_FILE', "We couldn't read this PDF. Please choose a valid PDF file.");
  }

  if (!hasPdfMagicBytes(originalBytes)) {
    throw new ToolError('INVALID_FILE', 'This file is not a valid PDF. Please choose a valid PDF file.');
  }

  // 1. Reading stage
  onProgress?.({
    stage: 'reading',
    progress: 10,
    message: 'Reading PDF document...',
  });

  // Yield to browser event loop
  await new Promise((resolve) => setTimeout(resolve, 0));

  // 2. Analyzing document stage
  onProgress?.({
    stage: 'analyzing',
    progress: 25,
    message: 'Analyzing document structure and objects...',
  });

  let sourceDoc: PDFDocument;
  try {
    sourceDoc = await PDFDocument.load(originalBytes, {
      ignoreEncryption: false,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : '';
    if (/password|encrypt/i.test(msg)) {
      throw new ToolError(
        'PASSWORD_PROTECTED',
        'This PDF is password-protected. Please provide an unlocked PDF.'
      );
    }
    if (/memory|allocation/i.test(msg)) {
      throw new ToolError(
        'BROWSER_MEMORY_ERROR',
        'Your browser ran out of memory while compressing this PDF. Try a smaller PDF.'
      );
    }
    throw new ToolError('PDF_READ_ERROR', "We couldn't read this PDF. Please choose a valid PDF file.");
  }

  const pageCount = sourceDoc.getPageCount();
  if (pageCount === 0) {
    throw new ToolError('INVALID_FILE', 'This PDF document contains no readable pages.');
  }

  // Record original page dimensions for fidelity validation
  const originalDimensions: PageDimension[] = [];
  const pageIndices = sourceDoc.getPageIndices();
  for (const idx of pageIndices) {
    const page = sourceDoc.getPage(idx);
    originalDimensions.push({
      width: Math.round(page.getWidth() * 10) / 10,
      height: Math.round(page.getHeight() * 10) / 10,
    });
  }

  // Yield to event loop
  await new Promise((resolve) => setTimeout(resolve, 0));

  // 3. Optimizing PDF structure stage
  onProgress?.({
    stage: 'optimizing',
    progress: 50,
    message: 'Optimizing PDF streams and object table...',
  });

  let passABytes: Uint8Array | null = null;
  let passBBytes: Uint8Array | null = null;

  try {
    // Strategy A: Direct in-place re-save with compressed object streams
    passABytes = await sourceDoc.save({ useObjectStreams: true });
  } catch {
    // Fall back to Strategy B if Strategy A throws
  }

  // Yield to event loop
  await new Promise((resolve) => setTimeout(resolve, 0));

  try {
    // Strategy B: Rebuild into a clean PDF document copying only reachable page elements
    const freshDoc = await PDFDocument.create();
    const copiedPages = await freshDoc.copyPages(sourceDoc, pageIndices);
    for (const page of copiedPages) {
      freshDoc.addPage(page);
    }
    passBBytes = await freshDoc.save({ useObjectStreams: true });
  } catch {
    // Strategy B optional fallback
  }

  // 4. Generating compressed PDF stage
  onProgress?.({
    stage: 'generating',
    progress: 75,
    message: 'Generating optimized document output...',
  });

  // Pick the smaller valid candidate between Pass A and Pass B
  const candidateBytes =
    passABytes && passBBytes
      ? passABytes.byteLength <= passBBytes.byteLength
        ? passABytes
        : passBBytes
      : passABytes || passBBytes;

  if (!candidateBytes || candidateBytes.byteLength === 0) {
    throw new ToolError('PROCESSING_FAILED', "We couldn't compress this PDF. Please try again.");
  }

  return {
    candidateBytes,
    originalSize,
    pageCount,
    originalDimensions,
  };
}

/**
 * Compresses a PDF document client-side with structural optimization and strict size validation.
 * Never claims compression unless the output is strictly smaller than the input.
 */
export async function compressPdf(
  file: File,
  options: CompressPdfOptions = {},
  onProgress?: (progress: CompressPdfProgress) => void
): Promise<CompressPdfResult> {
  // Validate input file format and limits
  const validation = await validateCompressPdfFile(file);
  if (!validation.valid) {
    throw validation.error || new ToolError('INVALID_FILE', "We couldn't read this PDF. Please choose a valid PDF file.");
  }

  const baseName = options.customBaseName?.trim() || sanitizePdfBaseName(file.name);

  // Read array buffer
  let fileBuffer: ArrayBuffer;
  try {
    fileBuffer = await file.arrayBuffer();
  } catch {
    throw new ToolError('PDF_READ_ERROR', "We couldn't read this PDF file. Please try another file.");
  }

  // Run structural optimization
  const { candidateBytes, originalSize, pageCount, originalDimensions } = await optimizePdfBytes(
    fileBuffer,
    file.name,
    onProgress
  );

  // 5. Validating result stage
  onProgress?.({
    stage: 'validating',
    progress: 90,
    message: 'Validating output PDF integrity...',
  });

  // Verify candidate magic bytes
  if (!hasPdfMagicBytes(candidateBytes)) {
    throw new ToolError('PROCESSING_FAILED', "We couldn't compress this PDF. Please try again.");
  }

  // Verify candidate readability and page count
  let validatedDoc: PDFDocument;
  try {
    validatedDoc = await PDFDocument.load(candidateBytes);
  } catch {
    throw new ToolError('PROCESSING_FAILED', "We couldn't compress this PDF. Please try again.");
  }

  if (validatedDoc.getPageCount() !== pageCount) {
    throw new ToolError('PROCESSING_FAILED', 'Output page count did not match source PDF document.');
  }

  // Verify page dimensions match original (1 pt tolerance)
  for (let i = 0; i < pageCount; i++) {
    const page = validatedDoc.getPage(i);
    const orig = originalDimensions[i];
    if (orig) {
      const wDiff = Math.abs(page.getWidth() - orig.width);
      const hDiff = Math.abs(page.getHeight() - orig.height);
      if (wDiff > 1.0 || hDiff > 1.0) {
        throw new ToolError('PROCESSING_FAILED', 'Page dimensions changed during compression.');
      }
    }
  }

  // 6. Comparing file sizes stage
  onProgress?.({
    stage: 'comparing',
    progress: 95,
    message: 'Comparing file sizes...',
  });

  const candidateSize = candidateBytes.byteLength;
  const isReduced = candidateSize < originalSize;

  let resultBlob: Blob;
  let resultFileName: string;
  let resultSize: number;
  let reductionPercent: number;
  let isOriginalKept: boolean;

  if (isReduced) {
    // Genuine reduction achieved
    const rawReduction = ((originalSize - candidateSize) / originalSize) * 100;
    reductionPercent = Math.round(rawReduction * 10) / 10;
    // Safeguard: must be strictly positive
    if (reductionPercent <= 0) {
      reductionPercent = 0.1;
    }
    const safeBuffer = new Uint8Array(candidateBytes).buffer;
    resultBlob = new Blob([safeBuffer], { type: 'application/pdf' });
    resultFileName = `${baseName}-compressed.pdf`;
    resultSize = candidateSize;
    isOriginalKept = false;
  } else {
    // No size reduction possible: keep original PDF intact
    reductionPercent = 0;
    resultBlob = file;
    resultFileName = file.name;
    resultSize = originalSize;
    isOriginalKept = true;
  }

  // 7. Complete stage
  onProgress?.({
    stage: 'completed',
    progress: 100,
    message: isReduced
      ? `Compressed successfully! Reduced by ${reductionPercent}%.`
      : 'Original PDF is already optimized for this compression method.',
  });

  return {
    originalFileName: file.name,
    originalSize,
    resultFileName,
    resultSize,
    resultBlob,
    pageCount,
    isReduced,
    reductionPercent,
    isOriginalKept,
  };
}

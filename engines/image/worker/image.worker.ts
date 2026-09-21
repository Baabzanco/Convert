import type { ImageWorkerRequest, ImageWorkerResponse } from './worker-types';

/**
 * Checks if buffer starts with JPEG SOI: FF D8 FF
 */
function isJpeg(bytes: Uint8Array): boolean {
  return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
}

/**
 * Checks if buffer starts with PNG signature: 89 50 4E 47 0D 0A 1A 0A
 */
function isPng(bytes: Uint8Array): boolean {
  return (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  );
}

/**
 * Checks if buffer starts with RIFF (bytes 0-3) and WEBP (bytes 8-11)
 */
function isWebp(bytes: Uint8Array): boolean {
  return (
    bytes.length >= 12 &&
    bytes[0] === 0x52 && // 'R'
    bytes[1] === 0x49 && // 'I'
    bytes[2] === 0x46 && // 'F'
    bytes[3] === 0x46 && // 'F'
    bytes[8] === 0x57 && // 'W'
    bytes[9] === 0x45 && // 'E'
    bytes[10] === 0x42 && // 'B'
    bytes[11] === 0x50    // 'P'
  );
}

/**
 * Checks if buffer starts with GIF87a or GIF89a
 */
function isGif(bytes: Uint8Array): boolean {
  return (
    bytes.length >= 6 &&
    bytes[0] === 0x47 && // 'G'
    bytes[1] === 0x49 && // 'I'
    bytes[2] === 0x46 && // 'F'
    bytes[3] === 0x38 && // '8'
    (bytes[4] === 0x37 || bytes[4] === 0x39) && // '7' or '9'
    bytes[5] === 0x61 // 'a'
  );
}

/**
 * Checks if buffer starts with BMP signature: BM (0x42 0x4D)
 */
function isBmp(bytes: Uint8Array): boolean {
  return bytes.length >= 2 && bytes[0] === 0x42 && bytes[1] === 0x4d;
}

/**
 * Replaces extension with .png
 */
function toPngFilename(name: string): string {
  const lastDot = name.lastIndexOf('.');
  const stem = lastDot === -1 ? name : name.substring(0, lastDot);
  return `${stem}.png`;
}

/**
 * Replaces extension with .jpg
 */
function toJpgFilename(name: string): string {
  const lastDot = name.lastIndexOf('.');
  const stem = lastDot === -1 ? name : name.substring(0, lastDot);
  return `${stem}.jpg`;
}

/**
 * Replaces extension with .webp
 */
function toWebpFilename(name: string): string {
  const lastDot = name.lastIndexOf('.');
  const stem = lastDot === -1 ? name : name.substring(0, lastDot);
  return `${stem}.webp`;
}

/**
 * Core image processing logic.
 * Usable inside Web Worker and as direct fallback.
 */
export async function processImageJob(
  request: ImageWorkerRequest,
  postProgress?: (stage: 'validating' | 'reading' | 'decoding' | 'encoding' | 'finalizing', percent: number) => void
): Promise<ImageWorkerResponse> {
  const { id, fileData, fileName, operation, options } = request;

  if (
    operation !== 'convert' ||
    (options.targetFormat !== 'png' && options.targetFormat !== 'jpg' && options.targetFormat !== 'webp')
  ) {
    return {
      id,
      success: false,
      type: 'error',
      error: 'Unsupported conversion format.',
      errorCode: 'UNSUPPORTED_FORMAT',
    };
  }

  const isTargetJpg = options.targetFormat === 'jpg';
  const isTargetWebp = options.targetFormat === 'webp';

  const isSourceBmp =
    options.sourceFormat === 'bmp' ||
    fileName.toLowerCase().endsWith('.bmp') ||
    request.mimeType === 'image/bmp';
  const isSourceGif =
    !isSourceBmp &&
    (options.sourceFormat === 'gif' ||
      fileName.toLowerCase().endsWith('.gif') ||
      request.mimeType === 'image/gif');
  const isSourceWebp =
    !isSourceBmp &&
    !isSourceGif &&
    (options.sourceFormat === 'webp' ||
      fileName.toLowerCase().endsWith('.webp') ||
      request.mimeType === 'image/webp');
  const isSourcePng =
    !isSourceBmp &&
    !isSourceGif &&
    !isSourceWebp &&
    (options.sourceFormat === 'png' ||
      (!isSourceWebp &&
        (fileName.toLowerCase().endsWith('.png') ||
          request.mimeType === 'image/png' ||
          (isTargetJpg && !isSourceWebp))));
  const isSourceJpg = !isSourceBmp && !isSourceGif && !isSourceWebp && !isSourcePng;

  const expectedInputDesc = isSourceBmp
    ? 'BMP'
    : isSourceGif
    ? 'GIF'
    : isSourceWebp
    ? 'WebP'
    : isSourcePng
    ? 'PNG'
    : 'JPEG';

  // 1. Validating Stage (0 - 20%)
  postProgress?.('validating', 15);
  const bytes = new Uint8Array(fileData);

  if (isSourceBmp) {
    if (!isBmp(bytes)) {
      return {
        id,
        success: false,
        type: 'error',
        error: 'This file is not a valid BMP image.',
        errorCode: 'INVALID_FILE',
      };
    }
    if (bytes.length >= 26) {
      try {
        const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
        const dibSize = view.getUint32(14, true);
        let bWidth = 0;
        let bHeight = 0;
        if (dibSize === 12 && bytes.length >= 26) {
          bWidth = view.getUint16(18, true);
          bHeight = view.getUint16(20, true);
        } else if (dibSize >= 40 && bytes.length >= 26) {
          bWidth = Math.abs(view.getInt32(18, true));
          bHeight = Math.abs(view.getInt32(22, true));
        }
        if (bWidth > 8192 || bHeight > 8192) {
          return {
            id,
            success: false,
            type: 'error',
            error: 'This BMP is too large to process in your browser.',
            errorCode: 'BROWSER_MEMORY_ERROR',
          };
        }
      } catch {
        // Fall through
      }
    }
  } else if (isSourceGif) {
    if (!isGif(bytes)) {
      return {
        id,
        success: false,
        type: 'error',
        error: 'This file is not a valid GIF image.',
        errorCode: 'INVALID_FILE',
      };
    }
    if (bytes.length >= 10) {
      const gWidth = bytes[6] | (bytes[7] << 8);
      const gHeight = bytes[8] | (bytes[9] << 8);
      if (gWidth > 8192 || gHeight > 8192) {
        return {
          id,
          success: false,
          type: 'error',
          error: 'This GIF is too large to process in your browser.',
          errorCode: 'BROWSER_MEMORY_ERROR',
        };
      }
    }
  } else if (isSourceWebp) {
    if (!isWebp(bytes)) {
      return {
        id,
        success: false,
        type: 'error',
        error: 'This file is not a valid WebP image.',
        errorCode: 'INVALID_FILE',
      };
    }
  } else if (isSourcePng) {
    if (!isPng(bytes)) {
      return {
        id,
        success: false,
        type: 'error',
        error: 'This file is not a valid PNG image.',
        errorCode: 'INVALID_FILE',
      };
    }
  } else {
    if (!isJpeg(bytes)) {
      return {
        id,
        success: false,
        type: 'error',
        error: 'This file is not a valid JPEG image.',
        errorCode: 'INVALID_FILE',
      };
    }
  }

  // 2. Reading Stage (20 - 45%)
  postProgress?.('reading', 35);
  const originalSize = fileData.byteLength;
  const inputMime = isSourceBmp
    ? 'image/bmp'
    : isSourceGif
    ? 'image/gif'
    : isSourceWebp
    ? 'image/webp'
    : isSourcePng
    ? 'image/png'
    : 'image/jpeg';
  const blob = new Blob([fileData], { type: inputMime });

  // 3. Decoding Stage (45 - 70%)
  postProgress?.('decoding', 60);
  let bitmap: ImageBitmap | null = null;
  try {
    let decodedWithImageDecoder = false;
    if (isSourceGif && typeof ImageDecoder !== 'undefined') {
      let decoder: ImageDecoder | null = null;
      let videoFrame: VideoFrame | null = null;
      try {
        decoder = new ImageDecoder({ data: fileData, type: 'image/gif' });
        const decoded = await decoder.decode({ frameIndex: 0 });
        videoFrame = decoded.image;
        const vWidth = videoFrame.displayWidth || videoFrame.codedWidth;
        const vHeight = videoFrame.displayHeight || videoFrame.codedHeight;
        if (vWidth > 8192 || vHeight > 8192) {
          videoFrame.close();
          decoder.close();
          return {
            id,
            success: false,
            type: 'error',
            error: 'This GIF is too large to process in your browser.',
            errorCode: 'BROWSER_MEMORY_ERROR',
          };
        }
        if (typeof createImageBitmap === 'function') {
          bitmap = await createImageBitmap(videoFrame);
          decodedWithImageDecoder = true;
        }
      } catch {
        // Fallback to createImageBitmap(blob)
      } finally {
        if (videoFrame) {
          try {
            videoFrame.close();
          } catch {
            // Ignored close error
          }
        }
        if (decoder) {
          try {
            decoder.close();
          } catch {
            // Ignored close error
          }
        }
      }
    }

    if (!decodedWithImageDecoder) {
      if (typeof createImageBitmap === 'function') {
        if (isSourceJpg) {
          try {
            // Automatically handle EXIF orientation to preserve correct photograph orientation
            bitmap = await createImageBitmap(blob, { imageOrientation: 'from-image' });
          } catch {
            // Fallback if imageOrientation option is not supported
            bitmap = await createImageBitmap(blob);
          }
        } else {
          bitmap = await createImageBitmap(blob);
        }
      } else {
        throw new Error('createImageBitmap not supported in this context');
      }
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message.toLowerCase() : '';
    if (message.includes('memory') || message.includes('quota') || message.includes('out of memory')) {
      return {
        id,
        success: false,
        type: 'error',
        error: 'This image is too large for your browser to process.',
        errorCode: 'BROWSER_MEMORY_ERROR',
      };
    }
    return {
      id,
      success: false,
      type: 'error',
      error: `This file is not a valid ${expectedInputDesc} image.`,
      errorCode: 'INVALID_FILE',
    };
  }

  if (!bitmap) {
    return {
      id,
      success: false,
      type: 'error',
      error: `This file is not a valid ${expectedInputDesc} image.`,
      errorCode: 'INVALID_FILE',
    };
  }

  const width = bitmap.width;
  const height = bitmap.height;

  if (!width || !height || width <= 0 || height <= 0) {
    bitmap.close();
    return {
      id,
      success: false,
      type: 'error',
      error: `This file is not a valid ${expectedInputDesc} image.`,
      errorCode: 'INVALID_FILE',
    };
  }

  // 4. Encoding Stage (70 - 90%)
  postProgress?.('encoding', 85);
  let encodedBlob: Blob;

  const targetMime = isTargetWebp ? 'image/webp' : isTargetJpg ? 'image/jpeg' : 'image/png';
  const quality = typeof options.quality === 'number' ? Math.max(0.1, Math.min(1.0, options.quality)) : 0.9;
  const rawBg = typeof options.backgroundColor === 'string' ? options.backgroundColor.trim() : '';
  const backgroundColor =
    rawBg.toUpperCase() === '#000000' || rawBg.toLowerCase() === 'black' ? '#000000' : '#FFFFFF';

  try {
    if (typeof OffscreenCanvas !== 'undefined') {
      const canvas = new OffscreenCanvas(width, height);
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        bitmap.close();
        return {
          id,
          success: false,
          type: 'error',
          error: "We couldn't convert this image. Please try again.",
          errorCode: 'PROCESSING_FAILED',
        };
      }

      // If converting to JPG, fill solid background first (transparency handling)
      if (isTargetJpg) {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);
      }

      // Draw decoded image on top
      ctx.drawImage(bitmap, 0, 0);
      bitmap.close(); // Immediate memory cleanup

      if (isTargetJpg || isTargetWebp) {
        encodedBlob = await canvas.convertToBlob({ type: targetMime, quality });
      } else {
        encodedBlob = await canvas.convertToBlob({ type: targetMime });
      }

      // Validate WebP output to reject accidental PNG or JPEG fallback
      if (isTargetWebp && (encodedBlob.type !== 'image/webp' || encodedBlob.size <= 0)) {
        return {
          id,
          success: false,
          type: 'error',
          error: 'Your browser could not create a WebP image. Please try another browser.',
          errorCode: 'UNSUPPORTED_FORMAT',
        };
      }

      // Validate JPEG output to reject accidental PNG or WebP fallback
      if (isTargetJpg && (encodedBlob.type !== 'image/jpeg' || encodedBlob.size <= 0)) {
        return {
          id,
          success: false,
          type: 'error',
          error: 'Your browser could not create a JPG image. Please try another browser.',
          errorCode: 'UNSUPPORTED_FORMAT',
        };
      }

      // Validate PNG output to reject accidental JPEG or WebP fallback
      if (!isTargetJpg && !isTargetWebp && (encodedBlob.type !== 'image/png' || encodedBlob.size <= 0)) {
        return {
          id,
          success: false,
          type: 'error',
          error: 'Your browser could not create a PNG image. Please try another browser.',
          errorCode: 'UNSUPPORTED_FORMAT',
        };
      }
    } else if (typeof document !== 'undefined') {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        bitmap.close();
        return {
          id,
          success: false,
          type: 'error',
          error: "We couldn't convert this image. Please try again.",
          errorCode: 'PROCESSING_FAILED',
        };
      }

      // If converting to JPG, fill solid background first (transparency handling)
      if (isTargetJpg) {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);
      }

      // Draw decoded image on top
      ctx.drawImage(bitmap, 0, 0);
      bitmap.close(); // Immediate memory cleanup

      encodedBlob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => {
            if (b) resolve(b);
            else reject(new Error(`Canvas encoding to ${targetMime} failed`));
          },
          targetMime,
          isTargetJpg || isTargetWebp ? quality : undefined
        );
      });

      // Validate WebP output to reject accidental PNG or JPEG fallback
      if (isTargetWebp && (encodedBlob.type !== 'image/webp' || encodedBlob.size <= 0)) {
        return {
          id,
          success: false,
          type: 'error',
          error: 'Your browser could not create a WebP image. Please try another browser.',
          errorCode: 'UNSUPPORTED_FORMAT',
        };
      }

      // Validate JPEG output to reject accidental PNG or WebP fallback
      if (isTargetJpg && (encodedBlob.type !== 'image/jpeg' || encodedBlob.size <= 0)) {
        return {
          id,
          success: false,
          type: 'error',
          error: 'Your browser could not create a JPG image. Please try another browser.',
          errorCode: 'UNSUPPORTED_FORMAT',
        };
      }

      // Validate PNG output to reject accidental JPEG or WebP fallback
      if (!isTargetJpg && !isTargetWebp && (encodedBlob.type !== 'image/png' || encodedBlob.size <= 0)) {
        return {
          id,
          success: false,
          type: 'error',
          error: 'Your browser could not create a PNG image. Please try another browser.',
          errorCode: 'UNSUPPORTED_FORMAT',
        };
      }
    } else {
      bitmap.close();
      return {
        id,
        success: false,
        type: 'error',
        error: 'Image canvas encoding is not supported in this runtime.',
        errorCode: 'PROCESSING_FAILED',
      };
    }
  } catch (err: unknown) {
    bitmap.close();
    const message = err instanceof Error ? err.message.toLowerCase() : '';
    if (message.includes('memory') || message.includes('quota') || message.includes('out of memory')) {
      return {
        id,
        success: false,
        type: 'error',
        error: 'This image is too large for your browser to process.',
        errorCode: 'BROWSER_MEMORY_ERROR',
      };
    }
    return {
      id,
      success: false,
      type: 'error',
      error: "We couldn't convert this image. Please try again.",
      errorCode: 'PROCESSING_FAILED',
    };
  }

  // 5. Finalizing Stage (90 - 100%)
  postProgress?.('finalizing', 95);
  const resultData = await encodedBlob.arrayBuffer();
  postProgress?.('finalizing', 100);

  const outputFileName = isTargetWebp
    ? toWebpFilename(fileName)
    : isTargetJpg
    ? toJpgFilename(fileName)
    : toPngFilename(fileName);

  return {
    id,
    success: true,
    type: 'success',
    resultData,
    resultMime: targetMime,
    fileName: outputFileName,
    width,
    height,
    originalSize,
    convertedSize: resultData.byteLength,
  };
}

// Worker execution context helper for typed postMessage & listener
const workerScope = (typeof self !== 'undefined' ? self : null) as unknown as {
  postMessage: (message: unknown, transfer?: Transferable[]) => void;
  addEventListener: (type: string, listener: (event: unknown) => void) => void;
  importScripts?: (...urls: string[]) => void;
} | null;

/**
 * Worker message event listener.
 */
export async function handleWorkerMessage(event: MessageEvent<ImageWorkerRequest>): Promise<void> {
  const request = event.data;
  if (!request || !request.id) return;

  try {
    const result = await processImageJob(request, (stage, percent) => {
      const progressMessage: ImageWorkerResponse = {
        id: request.id,
        success: true,
        type: 'progress',
        stage,
        progress: percent,
      };
      workerScope?.postMessage(progressMessage);
    });

    if (result.resultData) {
      workerScope?.postMessage(result, [result.resultData]);
    } else {
      workerScope?.postMessage(result);
    }
  } catch {
    const errorMessage: ImageWorkerResponse = {
      id: request.id,
      success: false,
      type: 'error',
      error: "We couldn't convert this image. Please try again.",
      errorCode: 'PROCESSING_FAILED',
    };
    workerScope?.postMessage(errorMessage);
  }
}

// Attach listener in Web Worker environment
if (workerScope && typeof workerScope.importScripts === 'function') {
  workerScope.addEventListener('message', (event: unknown) => {
    handleWorkerMessage(event as MessageEvent<ImageWorkerRequest>);
  });
}


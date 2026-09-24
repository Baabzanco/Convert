import { ToolError } from '../shared/errors';
import {
  VALIDATION_LIMITS,
  hasJpegMagicBytes,
  hasPngMagicBytes,
  hasWebpMagicBytes,
  isAnimatedWebp,
} from '../shared/validation';

export const IMAGE_TO_PDF_LIMITS = {
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50 MB
  MAX_BATCH_FILES: 20,
  MAX_DIMENSION: 8192,
  MAX_PIXEL_COUNT: 67108864, // 8192 * 8192
  ALLOWED_EXTENSIONS: ['jpg', 'jpeg', 'png', 'webp'],
  ALLOWED_MIMES: ['image/jpeg', 'image/png', 'image/webp'],
};

export const JPG_TO_PDF_LIMITS = {
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50 MB
  MAX_BATCH_FILES: 20,
  MAX_DIMENSION: 8192,
  MAX_PIXEL_COUNT: 67108864, // 8192 * 8192
  ALLOWED_EXTENSIONS: ['jpg', 'jpeg'],
  ALLOWED_MIMES: ['image/jpeg', 'image/pjpeg'],
};

export const PNG_TO_PDF_LIMITS = {
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50 MB
  MAX_BATCH_FILES: 20,
  MAX_DIMENSION: 8192,
  MAX_PIXEL_COUNT: 67108864, // 8192 * 8192
  ALLOWED_EXTENSIONS: ['png'],
  ALLOWED_MIMES: ['image/png'],
};

export async function validatePngToPdfFile(
  file: File
): Promise<{ valid: boolean; error?: ToolError }> {
  // 1. File size check
  if (file.size > PNG_TO_PDF_LIMITS.MAX_FILE_SIZE) {
    return {
      valid: false,
      error: new ToolError('FILE_TOO_LARGE', 'This file is too large. The maximum image size is 50 MB.'),
    };
  }

  // 2. Extension check
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  if (!PNG_TO_PDF_LIMITS.ALLOWED_EXTENSIONS.includes(ext)) {
    return {
      valid: false,
      error: new ToolError(
        'UNSUPPORTED_FORMAT',
        'This file format is not supported. Please upload a PNG image.'
      ),
    };
  }

  // 3. MIME type check if present
  const conflictingMimes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/pjpeg',
    'image/webp',
    'image/gif',
    'image/bmp',
    'image/heic',
    'image/heif',
    'image/svg+xml',
    'text/plain',
    'application/zip',
  ];
  if (
    file.type &&
    (conflictingMimes.includes(file.type.toLowerCase()) ||
      !file.type.toLowerCase().includes('png'))
  ) {
    return {
      valid: false,
      error: new ToolError(
        'UNSUPPORTED_FORMAT',
        'This file format is not supported. Please upload a PNG image.'
      ),
    };
  }

  // 4. Binary signature check (PNG magic bytes: 89 50 4E 47 0D 0A 1A 0A)
  try {
    const slice = file.slice(0, 4096);
    const buffer = await slice.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    if (!hasPngMagicBytes(bytes)) {
      return {
        valid: false,
        error: new ToolError(
          'INVALID_FILE',
          "We couldn't read this PNG file. Please try another image."
        ),
      };
    }
  } catch {
    return {
      valid: false,
      error: new ToolError(
        'INVALID_FILE',
        "We couldn't read this PNG file. Please try another image."
      ),
    };
  }

  return { valid: true };
}

export function validatePngToPdfBatch(files: File[]): { valid: boolean; error?: ToolError } {
  if (files.length === 0) {
    return {
      valid: false,
      error: new ToolError('INVALID_FILE', 'Please select at least one image.'),
    };
  }
  if (files.length > PNG_TO_PDF_LIMITS.MAX_BATCH_FILES) {
    return {
      valid: false,
      error: new ToolError(
        'INVALID_FILE',
        `You can convert up to ${PNG_TO_PDF_LIMITS.MAX_BATCH_FILES} images at a time.`
      ),
    };
  }
  return { valid: true };
}

export async function validateJpgToPdfFile(
  file: File
): Promise<{ valid: boolean; error?: ToolError }> {
  // 1. File size check
  if (file.size > JPG_TO_PDF_LIMITS.MAX_FILE_SIZE) {
    return {
      valid: false,
      error: new ToolError('FILE_TOO_LARGE', 'This file is too large. The maximum image size is 50 MB.'),
    };
  }

  // 2. Extension check
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  if (!JPG_TO_PDF_LIMITS.ALLOWED_EXTENSIONS.includes(ext)) {
    return {
      valid: false,
      error: new ToolError(
        'UNSUPPORTED_FORMAT',
        'Only JPG and JPEG images are supported by this tool.'
      ),
    };
  }

  // 3. MIME type check if present
  const conflictingMimes = [
    'application/pdf',
    'image/png',
    'image/webp',
    'image/gif',
    'image/bmp',
    'image/heic',
    'image/heif',
    'image/svg+xml',
    'text/plain',
    'application/zip',
  ];
  if (
    file.type &&
    (conflictingMimes.includes(file.type.toLowerCase()) ||
      (!file.type.toLowerCase().includes('jpeg') && !file.type.toLowerCase().includes('jpg')))
  ) {
    return {
      valid: false,
      error: new ToolError(
        'UNSUPPORTED_FORMAT',
        'Only JPG and JPEG images are supported by this tool.'
      ),
    };
  }

  // 4. Binary signature check (JPEG magic bytes: FF D8 FF)
  try {
    const slice = file.slice(0, 4096);
    const buffer = await slice.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    if (!hasJpegMagicBytes(bytes)) {
      return {
        valid: false,
        error: new ToolError(
          'INVALID_FILE',
          'This file is not a valid JPG image. Please choose a valid JPG or JPEG file.'
        ),
      };
    }
  } catch {
    return {
      valid: false,
      error: new ToolError(
        'INVALID_FILE',
        'This file is not a valid JPG image. Please choose a valid JPG or JPEG file.'
      ),
    };
  }

  return { valid: true };
}

export function validateJpgToPdfBatch(files: File[]): { valid: boolean; error?: ToolError } {
  if (files.length === 0) {
    return {
      valid: false,
      error: new ToolError('INVALID_FILE', 'Please select at least one image.'),
    };
  }
  if (files.length > JPG_TO_PDF_LIMITS.MAX_BATCH_FILES) {
    return {
      valid: false,
      error: new ToolError(
        'INVALID_FILE',
        `You can convert up to ${JPG_TO_PDF_LIMITS.MAX_BATCH_FILES} images at a time.`
      ),
    };
  }
  return { valid: true };
}

export async function validateImageToPdfFile(
  file: File
): Promise<{ valid: boolean; error?: ToolError }> {
  // 1. File size check
  if (file.size > IMAGE_TO_PDF_LIMITS.MAX_FILE_SIZE) {
    return {
      valid: false,
      error: new ToolError('FILE_TOO_LARGE', 'This file is too large. The maximum image size is 50 MB.'),
    };
  }

  // 2. Extension check
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  if (!IMAGE_TO_PDF_LIMITS.ALLOWED_EXTENSIONS.includes(ext)) {
    return {
      valid: false,
      error: new ToolError(
        'UNSUPPORTED_FORMAT',
        'This file format is not supported. Please upload a JPG, PNG, or WebP image.'
      ),
    };
  }

  // 3. MIME type check if present
  const conflictingMimes = [
    'application/pdf',
    'image/gif',
    'image/bmp',
    'image/heic',
    'image/heif',
    'image/svg+xml',
    'text/plain',
    'application/zip',
  ];
  if (file.type && conflictingMimes.includes(file.type.toLowerCase())) {
    return {
      valid: false,
      error: new ToolError(
        'UNSUPPORTED_FORMAT',
        'This file format is not supported. Please upload a JPG, PNG, or WebP image.'
      ),
    };
  }

  // 4. Binary signature check
  try {
    const slice = file.slice(0, 4096);
    const buffer = await slice.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    if (ext === 'jpg' || ext === 'jpeg') {
      if (!hasJpegMagicBytes(bytes)) {
        return {
          valid: false,
          error: new ToolError('INVALID_FILE', "We couldn't read this image. Please try another file."),
        };
      }
    } else if (ext === 'png') {
      if (!hasPngMagicBytes(bytes)) {
        return {
          valid: false,
          error: new ToolError('INVALID_FILE', "We couldn't read this image. Please try another file."),
        };
      }
    } else if (ext === 'webp') {
      if (!hasWebpMagicBytes(bytes)) {
        return {
          valid: false,
          error: new ToolError('INVALID_FILE', "We couldn't read this image. Please try another file."),
        };
      }
      if (isAnimatedWebp(bytes)) {
        return {
          valid: false,
          error: new ToolError('UNSUPPORTED_FORMAT', 'Animated WebP files are not supported.'),
        };
      }
    }
  } catch {
    return {
      valid: false,
      error: new ToolError('INVALID_FILE', "We couldn't read this image. Please try another file."),
    };
  }

  return { valid: true };
}

export function validateImageToPdfBatch(files: File[]): { valid: boolean; error?: ToolError } {
  if (files.length === 0) {
    return {
      valid: false,
      error: new ToolError('INVALID_FILE', 'Please select at least one image.'),
    };
  }
  if (files.length > IMAGE_TO_PDF_LIMITS.MAX_BATCH_FILES) {
    return {
      valid: false,
      error: new ToolError(
        'INVALID_FILE',
        `You can convert up to ${IMAGE_TO_PDF_LIMITS.MAX_BATCH_FILES} images at a time.`
      ),
    };
  }
  return { valid: true };
}

export function validatePdfFile(file: File): { valid: boolean; error?: ToolError } {
  if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
    return {
      valid: false,
      error: new ToolError('UNSUPPORTED_FORMAT', 'Please select a valid PDF document.'),
    };
  }
  if (file.size > VALIDATION_LIMITS.MAX_PDF_SIZE_BYTES) {
    return {
      valid: false,
      error: new ToolError('FILE_TOO_LARGE', 'PDF file exceeds the 100 MB limit.'),
    };
  }
  return { valid: true };
}

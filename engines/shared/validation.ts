import { ToolError } from './errors';

export const VALIDATION_LIMITS = {
  MAX_IMAGE_SIZE_BYTES: 50 * 1024 * 1024, // 50 MB
  MAX_PDF_SIZE_BYTES: 100 * 1024 * 1024,   // 100 MB
  MAX_FILE_COUNT: 20,
  MAX_BATCH_FILES: 20,
} as const;

export interface ValidationRule {
  allowedExtensions?: string[];
  allowedMimes?: string[];
  maxSizeBytes?: number;
  maxCount?: number;
  checkMagicBytes?: boolean;
}

export interface ValidationResult {
  valid: boolean;
  error?: ToolError;
}

export function validateFileCount(files: File[], maxCount = VALIDATION_LIMITS.MAX_FILE_COUNT): ValidationResult {
  if (files.length === 0) {
    return { valid: false, error: new ToolError('INVALID_FILE', 'Please select at least one file.') };
  }
  if (files.length > maxCount) {
    return {
      valid: false,
      error: new ToolError('INVALID_FILE', `You can only process up to ${maxCount} files at a time.`),
    };
  }
  return { valid: true };
}

export function validateFileSize(file: File, isPdf = false): ValidationResult {
  const max = isPdf ? VALIDATION_LIMITS.MAX_PDF_SIZE_BYTES : VALIDATION_LIMITS.MAX_IMAGE_SIZE_BYTES;
  const maxMb = isPdf ? '100 MB' : '50 MB';

  if (file.size > max) {
    return {
      valid: false,
      error: new ToolError('FILE_TOO_LARGE', `"${file.name}" exceeds the maximum allowable size of ${maxMb}.`),
    };
  }
  return { valid: true };
}

export function validateFileExtension(file: File, allowedExtensions: string[]): ValidationResult {
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  const normalizedAllowed = allowedExtensions.map((e) => e.replace('.', '').toLowerCase());

  if (!normalizedAllowed.includes(ext)) {
    return {
      valid: false,
      error: new ToolError('UNSUPPORTED_FORMAT', `File extension ".${ext}" is not supported. Allowed: ${allowedExtensions.join(', ')}`),
    };
  }
  return { valid: true };
}

export function validateFileMime(file: File, allowedMimes: string[]): ValidationResult {
  if (allowedMimes.length > 0 && file.type) {
    const isAllowed = allowedMimes.some((m) => {
      if (m.endsWith('/*')) {
        return file.type.startsWith(m.replace('/*', ''));
      }
      return file.type.toLowerCase() === m.toLowerCase();
    });

    if (!isAllowed) {
      return {
        valid: false,
        error: new ToolError('UNSUPPORTED_FORMAT', `MIME type "${file.type}" is not supported.`),
      };
    }
  }
  return { valid: true };
}

/**
 * Checks if the given buffer starts with the JPEG SOI signature: FF D8 FF
 */
export function hasJpegMagicBytes(buffer: ArrayBuffer | Uint8Array): boolean {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  if (bytes.length < 3) return false;
  return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
}

/**
 * Checks if the given buffer starts with the PNG signature: 89 50 4E 47 0D 0A 1A 0A
 */
export function hasPngMagicBytes(buffer: ArrayBuffer | Uint8Array): boolean {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  if (bytes.length < 8) return false;
  return (
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
 * Validates magic-byte signature from the first bytes of a file.
 */
export async function validateMagicBytes(
  file: File | Blob,
  expectedType: 'jpeg' | 'png' | 'pdf' = 'jpeg'
): Promise<ValidationResult> {
  try {
    const slice = file.slice(0, 8);
    const buffer = await slice.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    if (expectedType === 'jpeg') {
      if (!hasJpegMagicBytes(bytes)) {
        return {
          valid: false,
          error: new ToolError('INVALID_FILE', 'This file is not a valid JPEG image.'),
        };
      }
    } else if (expectedType === 'png') {
      // PNG magic bytes: 89 50 4E 47 0D 0A 1A 0A
      if (!hasPngMagicBytes(bytes)) {
        return {
          valid: false,
          error: new ToolError('INVALID_FILE', 'This file is not a valid PNG image.'),
        };
      }
    } else if (expectedType === 'pdf') {
      // PDF magic bytes: %PDF (25 50 44 46)
      const isPdf =
        bytes.length >= 4 &&
        bytes[0] === 0x25 &&
        bytes[1] === 0x50 &&
        bytes[2] === 0x44 &&
        bytes[3] === 0x46;
      if (!isPdf) {
        return {
          valid: false,
          error: new ToolError('INVALID_FILE', 'This file is not a valid PDF document.'),
        };
      }
    }

    return { valid: true };
  } catch {
    const errorMsg =
      expectedType === 'png'
        ? 'This file is not a valid PNG image.'
        : expectedType === 'pdf'
        ? 'This file is not a valid PDF document.'
        : 'This file is not a valid JPEG image.';
    return {
      valid: false,
      error: new ToolError('INVALID_FILE', errorMsg),
    };
  }
}

/**
 * Complete validation pipeline for PNG files:
 * File -> Size -> Extension -> MIME -> Magic Bytes -> Ready
 */
export async function validatePngFile(file: File): Promise<ValidationResult> {
  // 1. Size validation
  if (file.size > VALIDATION_LIMITS.MAX_IMAGE_SIZE_BYTES) {
    return {
      valid: false,
      error: new ToolError('FILE_TOO_LARGE', 'This file is too large. Maximum size is 50 MB.'),
    };
  }

  // 2. Extension validation
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  if (ext !== 'png') {
    return {
      valid: false,
      error: new ToolError('UNSUPPORTED_FORMAT', 'Only PNG files are supported.'),
    };
  }

  // 3. MIME validation (if MIME provided by browser)
  if (file.type && file.type.toLowerCase() !== 'image/png' && file.type.toLowerCase() !== 'application/octet-stream') {
    return {
      valid: false,
      error: new ToolError('UNSUPPORTED_FORMAT', 'Only PNG files are supported.'),
    };
  }

  // 4. Magic byte validation (89 50 4E 47 0D 0A 1A 0A)
  const magicCheck = await validateMagicBytes(file, 'png');
  if (!magicCheck.valid) {
    return magicCheck;
  }

  return { valid: true };
}

/**
 * Complete validation pipeline for JPG/JPEG files:
 * File -> Size -> Extension -> MIME -> Magic Bytes -> Ready
 */
export async function validateJpegFile(file: File): Promise<ValidationResult> {
  // 1. Size validation
  if (file.size > VALIDATION_LIMITS.MAX_IMAGE_SIZE_BYTES) {
    return {
      valid: false,
      error: new ToolError('FILE_TOO_LARGE', 'This file is too large. Maximum size is 50 MB.'),
    };
  }

  // 2. Extension validation
  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  if (ext !== 'jpg' && ext !== 'jpeg') {
    return {
      valid: false,
      error: new ToolError('UNSUPPORTED_FORMAT', 'Only JPG and JPEG files are supported.'),
    };
  }

  // 3. MIME validation (if MIME provided by browser)
  if (file.type && file.type.toLowerCase() !== 'image/jpeg') {
    return {
      valid: false,
      error: new ToolError('UNSUPPORTED_FORMAT', 'Only JPG and JPEG files are supported.'),
    };
  }

  // 4. Magic byte validation (FF D8 FF)
  const magicCheck = await validateMagicBytes(file, 'jpeg');
  if (!magicCheck.valid) {
    return magicCheck;
  }

  return { valid: true };
}

export function validateFile(file: File, rules: ValidationRule): ValidationResult {
  const isPdf = rules.allowedExtensions?.some((ext) => ext.toLowerCase().includes('pdf')) || false;
  
  const sizeCheck = validateFileSize(file, isPdf);
  if (!sizeCheck.valid) return sizeCheck;

  if (rules.allowedExtensions && rules.allowedExtensions.length > 0) {
    const extCheck = validateFileExtension(file, rules.allowedExtensions);
    if (!extCheck.valid) return extCheck;
  }

  if (rules.allowedMimes && rules.allowedMimes.length > 0) {
    const mimeCheck = validateFileMime(file, rules.allowedMimes);
    if (!mimeCheck.valid) return mimeCheck;
  }

  return { valid: true };
}

import { ToolError } from '../shared/errors';
import { VALIDATION_LIMITS } from '../shared/validation';

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

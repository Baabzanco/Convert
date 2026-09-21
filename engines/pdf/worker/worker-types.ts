export type PdfOperation =
  | 'convert'
  | 'merge'
  | 'split'
  | 'compress'
  | 'rotate'
  | 'delete-pages'
  | 'reorder-pages';

export interface PdfWorkerRequest {
  id: string;
  operation: PdfOperation;
  files: Array<{ name: string; data: ArrayBuffer }>;
  options: Record<string, unknown>;
}

export interface PdfWorkerResponse {
  id: string;
  success: boolean;
  resultData?: ArrayBuffer;
  resultFiles?: Array<{ name: string; data: ArrayBuffer }>;
  error?: string;
  progress?: number;
}

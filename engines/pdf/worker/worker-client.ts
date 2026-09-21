import { PdfWorkerRequest, PdfWorkerResponse } from './worker-types';

export class PdfWorkerClient {
  private worker: Worker | null = null;

  public isSupported(): boolean {
    return typeof window !== 'undefined' && typeof Worker !== 'undefined';
  }

  public async executeTask(_request: PdfWorkerRequest): Promise<PdfWorkerResponse> {
    throw new Error('PDF worker engine will be activated in individual tool steps.');
  }

  public terminate(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }
}

export const pdfWorkerClient = new PdfWorkerClient();

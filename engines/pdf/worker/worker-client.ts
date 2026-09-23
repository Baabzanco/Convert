import type { PdfWorkerRequest, PdfWorkerResponse } from './worker-types';
import { processPdfWorkerJob } from './pdf.worker';

export class PdfWorkerClient {
  private worker: Worker | null = null;
  private workerFailed = false;
  private pendingTasks = new Map<
    string,
    {
      resolve: (value: PdfWorkerResponse) => void;
      reject: (reason?: unknown) => void;
      onProgress?: (response: PdfWorkerResponse) => void;
    }
  >();

  public isSupported(): boolean {
    return typeof window !== 'undefined' && typeof Worker !== 'undefined';
  }

  private initWorker(): Worker | null {
    if (this.worker) return this.worker;
    if (!this.isSupported() || this.workerFailed) return null;

    try {
      this.worker = new Worker(new URL('./pdf.worker.ts', import.meta.url), { type: 'module' });
      this.worker.onmessage = (event: MessageEvent<PdfWorkerResponse>) => {
        const response = event.data;
        if (!response || !response.id) return;

        const task = this.pendingTasks.get(response.id);
        if (!task) return;

        if (response.type === 'progress') {
          task.onProgress?.(response);
        } else {
          this.pendingTasks.delete(response.id);
          task.resolve(response);
        }
      };

      this.worker.onerror = () => {
        this.workerFailed = true;
        this.terminate();
      };

      return this.worker;
    } catch {
      this.workerFailed = true;
      this.worker = null;
      return null;
    }
  }

  public async executeTask(
    request: PdfWorkerRequest,
    onProgress?: (response: PdfWorkerResponse) => void
  ): Promise<PdfWorkerResponse> {
    const worker = this.initWorker();

    if (worker) {
      return new Promise<PdfWorkerResponse>((resolve, reject) => {
        this.pendingTasks.set(request.id, { resolve, reject, onProgress });
        worker.postMessage(request);
      });
    }

    // Direct in-process fallback
    return new Promise<PdfWorkerResponse>((resolve) => {
      processPdfWorkerJob(request, (res) => {
        if (res.type === 'progress') {
          onProgress?.(res);
        } else {
          resolve(res);
        }
      });
    });
  }

  public terminate(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
  }
}

export const pdfWorkerClient = new PdfWorkerClient();

import { Queue } from "../queue/queue";

/**
 * WorkerPool<T> — 開 N 條「worker 迴圈」，各自不斷從同一個 Queue 拿任務來處理。
 *
 * 併發數 = 迴圈數量本身，不需要額外的 Semaphore。
 */
export class WorkerPool<T> {
  constructor(
    private queue: Queue<T>,
    private concurrency: number,
    private handler: (task: T) => Promise<void>,
  ) {}

  start(): void {
    for (let i = 0; i < this.concurrency; i++) {
      this.runWorker(i);
    }
  }

  private async runWorker(id: number): Promise<void> {
    while (true) {
      const task = await this.queue.dequeue();
      await this.handler(task);
    }
  }
}

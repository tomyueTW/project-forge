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
    // TODO：啟動 this.concurrency 條 worker 迴圈
    // 提示：呼叫 this.runWorker(i) 但不要 await 它（要讓所有 worker「同時」跑）
    throw new Error("TODO: implement WorkerPool.start()");
  }

  private async runWorker(id: number): Promise<void> {
    // TODO：無窮迴圈：await this.queue.dequeue() 拿任務，await this.handler(task) 處理
    throw new Error("TODO: implement WorkerPool.runWorker()");
  }
}

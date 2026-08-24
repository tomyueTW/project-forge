
/**
 * Semaphore — limits how many callers can hold it concurrently.
 *
 * new Semaphore(1) 的行為應該等價於 Mutex（同時最多 1 個人）。
 * new Semaphore(N) 允許同時最多 N 個人持有。
 *
 * 使用方式：
 *   const sem = new Semaphore(5); // 最多同時 5 個
 *   await sem.acquire();
 *   try {
 *     // 使用受限資源
 *   } finally {
 *     sem.release();
 *   }
 */
export class Semaphore {
  // TODO: 你需要：
  //   1. 一個數字，記錄「還剩幾個名額」（建構子傳進來的 N 就是初始值）
  //   2. 一個等待佇列（跟 Mutex 一樣，存 resolve function）
  private available: number;
  private waiting: Array<() => void> = [];

  constructor(count: number) {
    this.available = count;
  }

  async acquire(): Promise<void> {
    if (this.available > 0) {
      this.available--;
      return;
    }

    return new Promise<void>((resolve) => {
      this.waiting.push(resolve);
    });
  }

  release(): void {
    if (this.waiting.length > 0) {
      const wakeNext = this.waiting.shift()!;
      wakeNext();
    } else {
      this.available++;
    }
  }
}

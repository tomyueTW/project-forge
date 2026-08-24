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

  constructor(count: number) {
    // TODO
  }

  async acquire(): Promise<void> {
    // TODO：還有名額就直接拿走一個名額；沒有名額就排隊
    throw new Error("TODO: implement Semaphore.acquire()");
  }

  release(): void {
    // TODO：佇列有人就直接轉交名額；佇列沒人才把名額還回池子
    throw new Error("TODO: implement Semaphore.release()");
  }
}

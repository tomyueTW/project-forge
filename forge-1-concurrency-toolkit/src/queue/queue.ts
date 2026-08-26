
/**
 * Queue<T> — 非同步佇列：enqueue 塞資料進去，dequeue 拿資料出來（沒資料就排隊等）。
 *
 * 跟 Mutex/Semaphore 是同一套 pattern：
 *   - acquire() 沒資源就排隊等「許可」
 *   - dequeue() 沒資料就排隊等「資料」
 * 差別只在於 resolve 這次要帶一個實際的值（resolve(item)），而不是 resolve()。
 */
export class Queue<T> {
  private items: T[] = [];
  private waitingConsumers: Array<(item: T) => void> = [];

  enqueue(item: T): void {
    if (this.waitingConsumers.length > 0) {
      const next = this.waitingConsumers.shift()!;
      next(item);
    } else {
      this.items.push(item);
    }
  }

  async dequeue(): Promise<T> {
    if (this.items.length > 0) {
      return this.items.shift()!;
    } else {
      return new Promise<T>((resolve) => {
        this.waitingConsumers.push(resolve);
      })
    }
  }

  get size(): number {
    return this.items.length;
  }
}


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

  async dequeue(signal?: AbortSignal): Promise<T> {
    if (this.items.length > 0) {
      return this.items.shift()!;
    } else {
      return new Promise<T>((resolve, reject) => {
        this.waitingConsumers.push(resolve);

        // TODO：如果呼叫方有傳 signal 進來，掛一個 abort 監聽器：
        //   一旦 signal 被觸發（signal.addEventListener("abort", ...)）：
        //     用 indexOf() 找到剛剛存進 waitingConsumers 的這個 resolve 的位置
        //     如果找到了（index !== -1），用 splice() 把它從 waitingConsumers 刪掉
        //     呼叫 reject(new Error("dequeue cancelled"))
        //   （沒有傳 signal 的話，維持原本行為，什麼都不用做）

        if (signal) {
          signal.addEventListener("abort", () => {
            const index = this.waitingConsumers.indexOf(resolve);
            if (index !== -1) {
              this.waitingConsumers.splice(index, 1);
              reject(new Error("dequeue cancelled"));
            }
          });
        }
      })
    }
  }

  get size(): number {
    return this.items.length;
  }
}

/**
 * Mutex — mutual exclusion lock.
 *
 * 保證同一時間只有一個呼叫者能通過 acquire() 進入臨界區，
 * 其他呼叫者必須排隊等到目前持有鎖的人呼叫 release()。
 *
 * 使用方式：
 *   await mutex.acquire();
 *   try {
 *     // critical section
 *   } finally {
 *     mutex.release();
 *   }
 */
export class Mutex {
  private locked = false;
  private waiting: Array<() => void> = [];

  async acquire(): Promise<void> {
    if (!this.locked) {
      this.locked = true;
      return;
    }

    return new Promise<void>((resolve) => {
      this.waiting.push(resolve);
    })
  }

  release(): void {
    if (this.waiting.length > 0) {
      const wakeNext = this.waiting.shift()!;
      wakeNext();
    } else {
      this.locked = false;
    }
  }
}

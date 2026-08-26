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
    // TODO：
    //   如果 waitingConsumers 裡有人在排隊等資料：
    //     從佇列拿出最前面那個等待者，直接把 item 交給他（呼叫他的 resolve，帶上 item）
    //     不要把 item 放進 this.items（因為已經直接交給消費者了）
    //   否則：
    //     把 item 放進 this.items，等未來有人 dequeue() 時再拿
    throw new Error("TODO: implement Queue.enqueue()");
  }

  async dequeue(): Promise<T> {
    // TODO：
    //   如果 this.items 裡已經有東西：
    //     直接拿出最前面的一個回傳（用 shift()）
    //   否則：
    //     排隊等：回傳一個新的 Promise<T>，把它的 resolve 存進 waitingConsumers，
    //     等未來某次 enqueue() 呼叫它
    throw new Error("TODO: implement Queue.dequeue()");
  }

  get size(): number {
    return this.items.length;
  }
}

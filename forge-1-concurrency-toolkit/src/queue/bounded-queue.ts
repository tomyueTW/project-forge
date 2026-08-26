/**
 * BoundedQueue<T> — 有容量上限的非同步佇列。
 *
 * 跟 Queue<T> 的差異：enqueue() 在佇列滿了的時候，不會立刻成功，
 * 而是要排隊等到有空位（也就是某次 dequeue() 騰出空間）才能真的塞進去。
 * 這就是 backpressure 的實作方式：Producer 塞太快，會被這個機制「拖慢」。
 */
export class BoundedQueue<T> {
  private items: T[] = [];
  private maxSize: number;

  // 跟 Queue<T> 一樣：等資料的 consumer
  private waitingConsumers: Array<(item: T) => void> = [];

  // 新增：等空位的 producer。每個等待者存「要塞進去的 item」+「完成後要呼叫的 resolve」
  private waitingProducers: Array<{ item: T; resolve: () => void }> = [];

  constructor(maxSize: number) {
    this.maxSize = maxSize;
  }

  async enqueue(item: T): Promise<void> {
    // TODO：
    //   如果 waitingConsumers 裡有人在排隊等資料：
    //     直接把 item 交給他（不用管容量限制，因為根本沒有真的堆在佇列裡）
    //   否則，如果 this.items.length < this.maxSize（還有空位）：
    //     推進 this.items，直接 return
    //   否則（滿了）：
    //     回傳一個 pending Promise，把 { item, resolve } 存進 waitingProducers，
    //     等未來某次 dequeue() 幫你把這個 item 塞進去、呼叫 resolve
    throw new Error("TODO: implement BoundedQueue.enqueue()");
  }

  async dequeue(): Promise<T> {
    // TODO：
    //   如果 this.items 裡有東西：
    //     先用 shift() 拿出最前面一個，存成 item 準備回傳
    //     然後檢查 waitingProducers 有沒有人在排隊：
    //       如果有，從佇列拿出最前面那個 { item, resolve }，
    //       把它的 item 推進 this.items（騰出的空位馬上被他填上），
    //       呼叫他的 resolve()（通知他「你的 enqueue 完成了」）
    //     最後回傳一開始存的 item
    //   否則（沒東西可拿）：
    //     排隊等資料，邏輯跟 Queue<T> 一樣
    throw new Error("TODO: implement BoundedQueue.dequeue()");
  }

  get size(): number {
    return this.items.length;
  }
}

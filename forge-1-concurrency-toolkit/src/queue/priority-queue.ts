/**
 * PriorityQueue<T> — 優先權佇列：不是「先進先出」，而是「優先權高的先出」。
 *
 * 跟 Queue<T> 的差異：`items` 不再是單純依到達時間排列的陣列，
 * 而是要隨時維持「優先權由高到低排序」這個不變量。
 * 所有複雜度都在 enqueue()：新資料要插到正確的位置，而不是永遠塞到尾端。
 * dequeue() 完全不用變——永遠拿最前面那個就好。
 *
 * 優先權定義：數字越大代表優先權越高（priority=10 比 priority=1 先被處理）。
 */
export class PriorityQueue<T> {
  private items: Array<{ item: T; priority: number }> = [];

  // 跟 Queue<T> 一樣：等資料的 consumer
  private waitingConsumers: Array<(item: T) => void> = [];

  async enqueue(item: T, priority: number): Promise<void> {
    // TODO：
    //   如果 waitingConsumers 裡有人在排隊等資料：
    //     直接把 item 交給他（不用管優先權——反正沒有其他東西可以跟它比較）
    //   否則：
    //     從頭掃描 this.items，找到第一個 priority 比自己「低」的位置，插入到它前面
    //       （用 splice 插入到指定 index）
    //     如果優先權相同，不要插到相同優先權的前面——維持「同優先權內先進先出」
    //     如果掃描到底都沒找到比自己低的（代表自己優先權最低，或 items 是空的），
    //       直接推進尾端
    if (this.waitingConsumers.length > 0) {
      const next = this.waitingConsumers.shift()!;
      next(item);
    } else {
      let insertIndex = this.items.length;
      for (let i = 0; i < this.items.length; i++) {
        if (this.items[i]!.priority < priority) {
          insertIndex = i;
          break;
        }
      }
      this.items.splice(insertIndex, 0, { item, priority });
    }
  }

  async dequeue(): Promise<T> {
    // TODO：
    //   如果 this.items 裡有東西：
    //     shift() 拿出最前面一個（優先權排序已經在 enqueue() 做完了，這裡直接拿）
    //     回傳它的 .item（注意 items 存的是 { item, priority }，不是裸資料）
    //   否則：
    //     排隊等資料，邏輯跟 Queue<T> 一樣
    if (this.items.length > 0) {
      const next = this.items.shift()!;
      return next.item
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

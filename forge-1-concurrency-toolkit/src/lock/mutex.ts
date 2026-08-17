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
  // TODO: 你需要兩個內部狀態：
  //   1. 一個 boolean，記錄「目前有沒有人持有鎖」
  //   2. 一個佇列（array），存放「正在等待鎖的人」——
  //      具體來說，存放每個等待者的 Promise 的 resolve function

  async acquire(): Promise<void> {
    // TODO:
    //   如果目前沒人持有鎖：
    //     把「持有中」標記設為 true，直接 return（不用等）
    //   如果目前已經有人持有鎖：
    //     回傳一個新的 Promise，並把這個 Promise 的 resolve 函式
    //     存進等待佇列（這個 Promise 會在未來某次 release() 時被 resolve）
    //
    // 提示：
    //   return new Promise<void>((resolve) => {
    //     // 把 resolve 存進佇列
    //   });
    throw new Error("TODO: implement Mutex.acquire()");
  }

  release(): void {
    // TODO:
    //   如果等待佇列裡還有人：
    //     把佇列最前面的那個人的 resolve 拿出來呼叫（讓他的 acquire() 完成）
    //     注意：鎖的「持有中」狀態應該維持 true（持有權直接轉移給下一位，
    //     不要在這個瞬間變成「沒人持有」又立刻被別人搶走）
    //   如果等待佇列是空的：
    //     把「持有中」標記設回 false
    throw new Error("TODO: implement Mutex.release()");
  }
}

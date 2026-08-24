/**
 * ReadWriteLock — 多個 reader 可以同時持有，writer 需要獨佔。
 *
 * 規則：
 *   - acquireRead()：如果目前沒有 writer 持有、也沒有 writer 在排隊（防止 writer starvation），
 *     直接拿到 read 存取權，activeReaders++；否則排隊等。
 *   - acquireWrite()：如果目前沒有 writer 持有、也沒有任何 active reader，
 *     直接拿到 write 存取權；否則排隊等。
 *   - releaseRead()：activeReaders--；如果變成 0 而且有 writer 在排隊，叫醒下一個 writer。
 *   - releaseWrite()：writerActive = false；優先叫醒下一個排隊的 writer（避免新 reader 一直插隊）；
 *     如果沒有排隊的 writer，才把所有排隊的 reader 一次全部叫醒（因為 reader 之間互不衝突）。
 */
export class ReadWriteLock {
  private activeReaders = 0;
  private writerActive = false;
  private waitingReaders: Array<() => void> = [];
  private waitingWriters: Array<() => void> = [];

  async acquireRead(): Promise<void> {
    // TODO：
    //   如果 !this.writerActive && this.waitingWriters.length === 0
    //     → 直接拿到：this.activeReaders++，return
    //   否則 → 排隊：new Promise((resolve) => { this.waitingReaders.push(resolve) })
    throw new Error("TODO: implement ReadWriteLock.acquireRead()");
  }

  releaseRead(): void {
    // TODO：
    //   this.activeReaders--
    //   如果 this.activeReaders === 0 && this.waitingWriters.length > 0：
    //     從 waitingWriters 拿出最前面的人，設定 this.writerActive = true，叫醒他
    throw new Error("TODO: implement ReadWriteLock.releaseRead()");
  }

  async acquireWrite(): Promise<void> {
    // TODO：
    //   如果 !this.writerActive && this.activeReaders === 0
    //     → 直接拿到：this.writerActive = true，return
    //   否則 → 排隊：new Promise((resolve) => { this.waitingWriters.push(resolve) })
    throw new Error("TODO: implement ReadWriteLock.acquireWrite()");
  }

  releaseWrite(): void {
    // TODO：
    //   this.writerActive = false
    //   如果 this.waitingWriters.length > 0：
    //     從 waitingWriters 拿出最前面的人，設定 this.writerActive = true，叫醒他
    //   否則（沒有 writer 在排隊）：
    //     把 waitingReaders 裡「所有」排隊的 reader 全部叫醒
    //     （提示：用一個迴圈，或先把整個陣列清空存到區域變數再逐一呼叫；
    //      別忘了把每個被叫醒的 reader 算進 this.activeReaders）
    throw new Error("TODO: implement ReadWriteLock.releaseWrite()");
  }
}

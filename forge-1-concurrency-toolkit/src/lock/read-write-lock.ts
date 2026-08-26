
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
    if (!this.writerActive && this.waitingWriters.length === 0) {
      this.activeReaders++;
      return;
    }

    return new Promise((resolve) => {
      this.waitingReaders.push(resolve)
    })
  }

  releaseRead(): void {
    this.activeReaders--;

    if (this.activeReaders === 0 && this.waitingWriters.length > 0) {
      const next = this.waitingWriters.shift()!;
      next();
      this.writerActive = true;
    }
  }

  async acquireWrite(): Promise<void> {
    if (!this.writerActive && this.activeReaders === 0) {
      this.writerActive = true;
      return;
    }

    return new Promise((resolve) => {
      this.waitingWriters.push(resolve) 
    })
  }

  releaseWrite(): void {
    this.writerActive = false
    if (this.waitingWriters.length > 0) {
      const next = this.waitingWriters.shift()!;
      next();
      this.writerActive = true;
    } else {
      while (this.waitingReaders.length > 0) {
        const next = this.waitingReaders.shift()!;
        next();
        this.activeReaders++;
      }
    }
  }
}

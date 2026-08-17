/**
 * Week 2 — 用 Mutex 修好 lost update，而且不用拿掉那個 await
 *
 * 執行方式：npx tsx examples/week2-mutex.ts
 *
 * 在動手寫 code 之前先預測：LockedCounter 跟 Week 1 的 BuggyCounter
 * 用的是一模一樣的 read → await → write 結構（await 完全沒拿掉），
 * 只是多包了 mutex.acquire() / release()。你覺得結果會是多少？為什麼？
 */
import { Mutex } from "../src/lock/mutex";

function simulateAsyncIO(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

/** Week 1 的 BuggyCounter，原封不動搬過來對照用 */
class BuggyCounter {
  private value = 0;

  async increment(): Promise<void> {
    const current = this.value;
    await simulateAsyncIO();
    this.value = current + 1;
  }

  get current(): number {
    return this.value;
  }
}

class LockedCounter {
  private value = 0;
  private lock = new Mutex();

  async increment(): Promise<void> {
    // TODO: 用 this.lock 保護臨界區
    // 步驟：
    //   1. await this.lock.acquire()
    //   2. try { 跟 BuggyCounter 一模一樣的三行：read → await simulateAsyncIO() → write }
    //   3. finally { this.lock.release() }
    // 注意：await simulateAsyncIO() 不要拿掉，這題的重點就是證明
    // 「臨界區裡面有 await 也沒關係，只要進臨界區前後有鎖保護」
    await this.lock.acquire()
    try {
      const current = this.value;
      await simulateAsyncIO();
      this.value = current + 1;
    } finally { 
      this.lock.release() 
    }
  }

  get current(): number {
    return this.value;
  }
}

async function runExperiment(
  label: string,
  makeCounter: () => { increment(): Promise<void>; current: number },
  taskCount: number,
): Promise<void> {
  const counter = makeCounter();
  const tasks = Array.from({ length: taskCount }, () => counter.increment());
  await Promise.all(tasks);

  const expected = taskCount;
  const actual = counter.current;
  const status = actual === expected ? "OK" : "LOST UPDATE";

  console.log(`[${label}] expected=${expected} actual=${actual} -> ${status}`);
}

async function main() {
  await runExperiment("BuggyCounter (no lock)", () => new BuggyCounter(), 100);
  await runExperiment("LockedCounter (with Mutex)", () => new LockedCounter(), 100);
}

main();

import { describe, expect, it } from "vitest";
import { Mutex } from "../../src/lock/mutex";

function simulateAsyncIO(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

/** 跟 examples/week1-race-condition.ts 的 BuggyCounter 邏輯相同 */
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

describe("Mutex — race condition reproduction and fix", () => {
  it("BuggyCounter loses updates under 100 concurrent increments (documents the bug)", async () => {
    const counter = new BuggyCounter();
    const tasks = Array.from({ length: 100 }, () => counter.increment());
    await Promise.all(tasks);

    // 這個測試「通過」代表成功重現了 bug；如果哪天 counter.current === 100，
    // 反而代表 JS runtime 的排程行為變了，這個測試會失敗，提醒你重新檢視假設
    expect(counter.current).not.toBe(100);
  });

  it("LockedCounter reaches exactly 100 under 100 concurrent increments", async () => {
    const counter = new LockedCounter();
    const tasks = Array.from({ length: 100 }, () => counter.increment());
    await Promise.all(tasks);

    expect(counter.current).toBe(100);
  });
});

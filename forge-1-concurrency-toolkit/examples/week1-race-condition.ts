/**
 * Week 1 — 親手重現「單執行緒 race condition」(lost update)
 *
 * 執行方式：npx tsx examples/week1-race-condition.ts
 *
 * 在動手寫 code 之前，先想清楚（不用寫下來，但要能講出來）：
 *   - 如果 100 個 task 同時對同一個 counter 各 +1，最後 counter 應該等於多少？
 *   - 如果最後不等於 100，是哪一步的「讀」和「寫」被別人插隊了？
 */

/** 模擬非同步 I/O（例如打一次資料庫）——完全同步的程式不會有這個問題 */
function simulateAsyncIO(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

class BuggyCounter {
  private value = 0;

  async increment(): Promise<void> {
    // 在這裡刻意製造 race condition
    const current = this.value
    await simulateAsyncIO() // 模擬資料庫讀取 or 其他微服務
    this.value = current + 1
  }

  get current(): number {
    return this.value;
  }
}

class SafeCounter {
  private value = 0;

  async increment(): Promise<void> {
    const current = this.value
    this.value = current + 1
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
  await runExperiment("BuggyCounter", () => new BuggyCounter(), 100);
  await runExperiment("SafeCounter", () => new SafeCounter(), 100);
}

main();

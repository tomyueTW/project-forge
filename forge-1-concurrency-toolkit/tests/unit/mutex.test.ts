import { describe, expect, it } from "vitest";
import { Mutex } from "../../src/lock/mutex";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe("Mutex", () => {
  it("acquire() resolves immediately when nobody holds the lock", async () => {
    const mutex = new Mutex();
    // TODO: await mutex.acquire()，斷言它確實拿到了鎖
    // 提示：可以用 mutex.release() 不噴錯來間接證明，或直接測下一題那種行為
  });

  it("a second acquire() does not resolve until release() is called", async () => {
    const mutex = new Mutex();
    const order: string[] = [];

    // TODO：
    //   1. await mutex.acquire()（主流程先拿到鎖），push "A-acquired" 到 order
    //   2. 另外啟動一個「不 await」的 async 函式（B），裡面 await mutex.acquire()，
    //      拿到後 push "B-acquired"，再 mutex.release()
    //      —— 不要在主流程用 await 等這個函式，先讓它「卡著」
    //   3. await sleep(10)，push "before-A-release" 到 order
    //      （這一步是為了給 B 一點時間「嘗試」acquire，如果 Mutex 有 bug、
    //        B 提早搶到鎖，這裡就會抓到）
    //   4. mutex.release()（讓 B 真正拿到鎖）
    //   5. 想辦法等 B 那個函式真正跑完（提示：把它存成一個變數，最後 await 它）
    //
    // 最後斷言：
    //   expect(order).toEqual(["A-acquired", "before-A-release", "B-acquired"]);
    //
    // 如果這個斷言失敗，代表 Mutex 沒有真正擋住 B 插隊。
  });

  it("wakes up multiple waiters in FIFO order", async () => {
    const mutex = new Mutex();
    const order: number[] = [];

    // TODO：
    //   1. 主流程先 await mutex.acquire()，讓鎖被佔住
    //   2. 依序啟動三個「不 await」的 acquire：分別在拿到鎖後 push 1 / 2 / 3 到 order，
    //      並各自呼叫 release()
    //   3. 主流程呼叫 release()，讓排隊的人依序被叫醒
    //   4. 用 await 等這三個 acquire 都真正完成
    //   5. 斷言 expect(order).toEqual([1, 2, 3])——先排隊的人應該先拿到鎖
  });
});

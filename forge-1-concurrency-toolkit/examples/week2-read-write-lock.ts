/**
 * Week 2 — 驗證 Read-Write Lock：
 *   1. 多個 reader 可以真的同時持有（不像 Mutex 只能 1 個）
 *   2. writer 進去的時候，絕對不會跟任何 reader 重疊
 *   3. writer 排隊之後，就算後面一直有新的 reader 想插隊，writer 最終還是拿得到鎖（不會 starvation）
 *
 * 執行方式：npx tsx examples/week2-read-write-lock.ts
 */
import { ReadWriteLock } from "../src/lock/read-write-lock";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const lock = new ReadWriteLock();

  let activeReaders = 0;
  let maxActiveReaders = 0;
  let writerFinished = false;
  let overlapDetected = false; // 一旦 writer 在跑的同時偵測到 activeReaders > 0，就代表獨佔性被破壞

  async function readerTask(id: number): Promise<void> {
    await lock.acquireRead();
    activeReaders++;
    maxActiveReaders = Math.max(maxActiveReaders, activeReaders);
    await sleep(20);
    activeReaders--;
    lock.releaseRead();
  }

  async function writerTask(): Promise<void> {
    await sleep(30); // 讓前面幾個 reader 先開始，製造「writer 要排隊」的情境
    await lock.acquireWrite();
    if (activeReaders > 0) {
      overlapDetected = true;
    }
    await sleep(10);
    writerFinished = true;
    lock.releaseWrite();
  }

  // 持續有新 reader 湧入（模擬 writer 排隊時，還一直有新 reader 想插隊）
  const readerTasks = Array.from({ length: 20 }, (_, i) => readerTask(i));

  await Promise.all([...readerTasks, writerTask()]);

  console.log(`同時最多 reader 數：${maxActiveReaders}（應該 > 1，證明 reader 可以並存）`);
  console.log(`writer 是否最終完成：${writerFinished}（應該是 true，證明沒有 starvation）`);
  console.log(`writer 執行期間是否偵測到 active reader（獨佔性被破壞）：${overlapDetected}（應該是 false）`);
}

main();

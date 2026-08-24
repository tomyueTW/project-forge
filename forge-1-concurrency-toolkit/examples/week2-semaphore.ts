/**
 * Week 2 — 驗證 Semaphore 真的把同時執行的人數限制在 N 以內
 *
 * 執行方式：npx tsx examples/week2-semaphore.ts
 *
 * 先預測：20 個 task 同時搶一個容量是 3 的 Semaphore，
 * 「同時在臨界區裡的人數」的最大值（high-water mark）應該是多少？
 */
import { Semaphore } from "../src/lock/semaphore";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const CAPACITY = 3;
  const TASK_COUNT = 20;

  const semaphore = new Semaphore(CAPACITY);

  let active = 0; // 目前同時在臨界區裡的人數
  let maxActive = 0; // 觀察到的最大同時人數（high-water mark）

  async function task(id: number): Promise<void> {
    await semaphore.acquire();
    try {
      active++;
      maxActive = Math.max(maxActive, active);
      console.log(`task ${id} 進入臨界區，目前同時 ${active} 個`);
      await sleep(50); // 模擬做一點事
    } finally {
      active--;
      semaphore.release();
    }
  }

  const tasks = Array.from({ length: TASK_COUNT }, (_, i) => task(i));
  await Promise.all(tasks);

  console.log(`\n最大同時人數：${maxActive}（容量上限：${CAPACITY}）`);
  console.log(maxActive <= CAPACITY ? "OK：沒有超過容量" : "BUG：超過容量了！");
}

main();

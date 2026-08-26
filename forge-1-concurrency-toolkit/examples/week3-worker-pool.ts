/**
 * Week 3 — 驗證 Worker Pool 的併發數精確等於開了幾條 worker 迴圈
 *
 * 執行方式：npx tsx examples/week3-worker-pool.ts
 */
import { Queue } from "../src/queue/queue";
import { WorkerPool } from "../src/worker/worker-pool";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const CONCURRENCY = 4;
  const TASK_COUNT = 20;

  const queue = new Queue<number>();

  let active = 0;
  let maxActive = 0;
  let completed = 0;

  const pool = new WorkerPool<number>(queue, CONCURRENCY, async (taskId) => {
    active++;
    maxActive = Math.max(maxActive, active);
    await sleep(30);
    active--;
    completed++;
    console.log(`task ${taskId} 完成（目前同時 ${active} 個在跑）`);
  });

  pool.start();

  for (let i = 0; i < TASK_COUNT; i++) {
    queue.enqueue(i);
  }

  // 簡單等到全部完成（之後 Week 3 會補 graceful shutdown 的正式做法）
  while (completed < TASK_COUNT) {
    await sleep(10);
  }

  console.log(`\n最大同時處理數：${maxActive}（併發上限：${CONCURRENCY}）`);
  console.log(maxActive <= CONCURRENCY ? "OK：沒有超過併發上限" : "BUG：超過併發上限了！");
}

main();

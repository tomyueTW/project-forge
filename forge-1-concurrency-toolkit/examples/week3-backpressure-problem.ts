/**
 * Week 3 — 刻意製造 backpressure：Producer 遠快於 Worker，Queue 會無限塞
 *
 * 執行方式：npx tsx examples/week3-backpressure-problem.ts
 */
import { Queue } from "../src/queue/queue";
import { WorkerPool } from "../src/worker/worker-pool";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const queue = new Queue<number>();

  // Worker 很慢：每個任務要 100ms，而且只有 2 個 worker
  const pool = new WorkerPool<number>(queue, 2, async (taskId) => {
    await sleep(100);
  });
  pool.start();

  // Producer 完全不管 Worker 死活，瞬間塞 100,000 筆進去
  console.log("Producer 開始瘋狂塞資料...");
  for (let i = 0; i < 100_000; i++) {
    queue.enqueue(i);
  }
  console.log(`Producer 塞完了。此時 queue.size = ${queue.size}`);

  // 每隔一段時間看一下 queue 還剩多少（Worker 消化的速度完全跟不上）
  for (let i = 0; i < 5; i++) {
    await sleep(500);
    console.log(`0.5 秒後，queue.size = ${queue.size}`);
  }

  console.log("\n結論：Producer 瞬間塞完，Worker 每 100ms 才處理 2 個，");
  console.log("queue.size 幾乎不會下降太多——如果 Producer 是持續不斷塞（不是塞一次就停），");
  console.log("queue.size 會無限成長，記憶體用量跟著無限成長，最終 OOM。");

  process.exit(0); // 不等 queue 真的清空，示範完就結束
}

main();

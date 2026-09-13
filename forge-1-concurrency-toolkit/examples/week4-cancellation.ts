/**
 * Week 4 — 驗證 Queue<T>.dequeue() 的取消機制：
 * 取消後不只是「這次 await 會拋錯」，還要確認被取消的 consumer
 * 真的從 waitingConsumers 移除了，不會吃掉之後才進來的資料。
 *
 * 執行方式：npx tsx examples/week4-cancellation.ts
 */
import { Queue } from "../src/queue/queue";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const queue = new Queue<string>();

  console.log("Consumer A 呼叫 dequeue()，設定 100ms 後取消...");
  const controllerA = new AbortController();
  setTimeout(() => controllerA.abort(), 100);

  let aFailed = false;
  const aPromise = queue.dequeue(controllerA.signal).catch((err) => {
    aFailed = true;
    console.log(`Consumer A 的 dequeue() 被取消了：${err.message}`);
  });

  await sleep(200);
  console.log(`200ms 後，aFailed = ${aFailed}（應該是 true）\n`);

  console.log("Producer 呼叫 enqueue('hello')...");
  queue.enqueue("hello");

  console.log("Consumer B 呼叫 dequeue()（沒有 signal，正常等待）...");
  const item = await queue.dequeue();
  console.log(`Consumer B 拿到：${item}`);

  await aPromise;

  console.log(
    item === "hello"
      ? "\n結果正確：資料交給了真正在等的 Consumer B，沒有被取消的 A 吃掉。"
      : "\n結果不符預期，檢查取消邏輯有沒有真的把 A 從 waitingConsumers 移除。",
  );
}

main();

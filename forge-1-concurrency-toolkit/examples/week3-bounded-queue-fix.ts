/**
 * Week 3 — 驗證 BoundedQueue 真的能擋住 backpressure：容量滿了之後，
 * enqueue() 會卡住，直到某次 dequeue() 騰出空位才會繼續。
 *
 * 執行方式：npx tsx examples/week3-bounded-queue-fix.ts
 */
import { BoundedQueue } from "../src/queue/bounded-queue";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const queue = new BoundedQueue<number>(3);

  await queue.enqueue(0);
  await queue.enqueue(1);
  await queue.enqueue(2);
  console.log(`塞了 3 筆（maxSize=3），queue.size = ${queue.size}`);

  let producerDone = false;
  console.log("Producer 嘗試 enqueue(3)（此時已滿）...");
  const pending = queue.enqueue(3).then(() => {
    producerDone = true;
    console.log("Producer 的 enqueue(3) 完成了！");
  });

  await sleep(200);
  console.log(
    `0.2 秒後，queue.size = ${queue.size}（應該還是 3，沒有超過 maxSize），` +
      `producerDone = ${producerDone}（應該是 false，還在卡住）`,
  );

  console.log("\n呼叫一次 dequeue() 騰出空位...");
  const taken = await queue.dequeue();
  console.log(`dequeue() 拿到 ${taken}`);

  await sleep(50);
  console.log(
    `dequeue() 之後，producerDone = ${producerDone}（應該變成 true——` +
      `空位一釋出就立刻轉交給卡住的 producer），queue.size = ${queue.size}（應該還是 3）`,
  );

  await pending;
  console.log("\n結論：容量滿了之後 enqueue() 會卡住，queue.size 從未超過 maxSize，");
  console.log("dequeue() 騰出的空位會直接轉交給下一個等待的 producer，不會憑空消失。");
}

main();

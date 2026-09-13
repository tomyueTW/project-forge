/**
 * Week 4 — 驗證 PriorityQueue：優先權高的先出，同優先權時維持先進先出。
 *
 * 執行方式：npx tsx examples/week4-priority-queue.ts
 */
import { PriorityQueue } from "../src/queue/priority-queue";

async function main() {
  const queue = new PriorityQueue<string>();

  // 故意打亂順序塞入，其中 "B" 跟 "D" 優先權相同（都是 5）
  await queue.enqueue("A", 1);
  await queue.enqueue("B", 5);
  await queue.enqueue("C", 10);
  await queue.enqueue("D", 5);
  await queue.enqueue("E", 8);

  console.log("塞入順序：A(1) B(5) C(10) D(5) E(8)");
  console.log("預期拿出順序：C(10) E(8) B(5) D(5) A(1)");
  console.log("（B 跟 D 優先權相同，B 先塞進去，所以 B 要先被拿出來）\n");

  const order: string[] = [];
  while (queue.size > 0) {
    order.push(await queue.dequeue());
  }

  console.log(`實際拿出順序：${order.join(" ")}`);
  console.log(
    order.join(",") === "C,E,B,D,A" ? "\n結果正確！" : "\n結果不符預期，檢查 enqueue() 的插入邏輯",
  );
}

main();

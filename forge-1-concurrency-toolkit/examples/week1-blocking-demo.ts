/**
 * Week 1 — 眼見為憑：CPU-bound 的同步運算會卡死整個 Event Loop
 *
 * 執行方式：npx tsx examples/week1-blocking-demo.ts
 *
 * 在跑之前先猜：console.log("start") 之後，"timer fired" 跟 "done blocking"
 * 這兩行，你覺得哪一行會先印出來？
 */

console.log("start");

// 理論上 setTimeout(fn, 0) 應該「幾乎立刻」執行 callback。
// 它被排進 Task Queue，只等 Call Stack 淨空就會執行。
setTimeout(() => {
  console.log("timer fired");
}, 0);

// 這是一段 CPU-bound、完全同步的忙碌迴圈（模擬一次很重的運算，例如算 hash）。
// 注意：這裡沒有任何 await，因為「運算」本身沒有東西可以等。
console.log("開始一段 3 秒的同步運算...");
const start = Date.now();
while (Date.now() - start < 3000) {
  // 故意讓 CPU 忙碌 3 秒，佔用 Call Stack，不讓出執行權
}

console.log("done blocking");

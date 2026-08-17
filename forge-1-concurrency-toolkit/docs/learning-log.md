# Forge I — Learning Log

隨手記，不是正式文件。每次學完一個主題或踩到一個坑就記一筆，之後寫 `learning-summary.md` 時當素材用。

## 格式建議

```
## Week N — 主題
- 學到什麼：
- 弄壞了什麼、怎麼弄壞的：
- 怎麼修好的：
- 還沒搞懂的地方：
```

---

## Week 1 — Event Loop / Async-Sync / Race Condition

- 學到什麼：
  - Call Stack / Event Loop / Microtask Queue / Task Queue 的關係；Event Loop 只有 Call Stack 淨空才會處理 Task Queue
  - `await` 只是「正確等待一個已經被設計成非同步的東西」，不會讓 blocking 的操作變成 non-blocking
  - `setTimeout(fn, 0)` 保證「進 queue 的時機」，不保證「執行的時機」
  - I/O-bound（等待為主，CPU 閒置）vs CPU-bound（運算為主，CPU 全程忙碌）——差別在等待期間 Call Stack 有沒有被佔用
  - Node.js 底層兩種非同步機制：網路 I/O 靠 OS 核心（epoll/kqueue/IOCP，不需額外執行緒）；fs/部分 crypto 靠 libuv 背景執行緒池；CPU-bound 運算完全沒有背景機制可用，只能佔用主執行緒
  - Concurrency（交錯執行，單執行緒即可，適合 I/O-bound）vs Parallelism（真正同時運算，需要多核心，是唯一能加速 CPU-bound 的方法）
  - 混合型 task 的設計原則：不是把整個 task 歸類成一種類型，而是拆成幾段，各自用適合的策略（I/O 段留主執行緒 await，CPU 段丟 worker_threads）
- 弄壞了什麼、怎麼弄壞的：
  - `BuggyCounter`：read 和 write 中間夾一次 `await`，100 個 task 同時 increment，實際結果 `1` 而非 `100`（lost update）
  - `week1-blocking-demo.ts`：用同步忙碌迴圈佔住 Call Stack 3 秒，證明 `setTimeout(fn, 0)` 的 callback 會被硬生生延後
- 怎麼修好的：
  - `SafeCounter`：read-modify-write 中間不放任何 await，整段同步執行完才讓出控制權
- 還沒搞懂的地方：
  - （持續更新）

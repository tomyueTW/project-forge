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

## Week 2 — Mutex / Critical Section / Lock Ownership

- 學到什麼：
  - Mutex 的核心概念：跟 `SafeCounter` 消除 await 不同，Mutex 允許臨界區內有 await，靠「持有鎖的人在裡面時，其他人只能排隊」來保證正確性
  - Promise 的 `resolve` 可以被存到外部變數/陣列，在完全不同的時間、不同的程式碼位置才呼叫，呼叫時才會讓對應的 `await` 繼續往下跑（這是實作 queue-based Mutex 的核心技巧）
  - `release()` 把鎖轉交給下一個排隊者時，要維持 `locked = true`（不能先設 false 再轉交），否則會有新的 `acquire()` 呼叫在轉交空檔中插隊搶到鎖，造成兩個人同時「以為自己持有鎖」
  - TypeScript strict mode 下 `Array.shift()` 回傳型別是 `T | undefined`，型別系統無法從外部的 `length > 0` 檢查推論出安全性，需要用 `!`（non-null assertion）明確告知編譯器，且要能講出為什麼這裡保證安全
- 弄壞了什麼、怎麼弄壞的：
  - 一開始完全無法從零實作 Mutex（不熟悉「把 resolve 存起來晚點呼叫」這個 pattern），透過抽出一個最小的 `sleepUntilSignaled` 範例單獨理解這個技巧後才寫得出來
- 怎麼修好的：
  - `src/lock/mutex.ts`：`locked` boolean + `waiting` 佇列（存 resolve function），`acquire()` 沒鎖直接拿、有鎖就排隊；`release()` 優先把鎖轉交給佇列最前面的人，佇列空了才真的釋放
  - `examples/week2-mutex.ts`：`LockedCounter` 用跟 `BuggyCounter` 完全相同的 read-await-write 結構，包上 `mutex.acquire()/release()`，100 次 increment 正確得到 100
- 還沒搞懂的地方：
  - （持續更新）

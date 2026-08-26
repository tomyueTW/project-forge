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
- 補充（正式測試）：`tests/unit/mutex.test.ts`（立即拿鎖、第二個 acquire 卡住直到 release、FIFO 順序）與 `tests/concurrency/mutex.test.ts`（100 併發下 BuggyCounter 失敗／LockedCounter 正確）全部完成，用「事件順序陣列」而非量時間來驗證非同步行為

## Week 2 — Semaphore

- 學到什麼：
  - Semaphore 是 Mutex 的推廣：`new Semaphore(1)` 等價於 Mutex，把「boolean 持有狀態」換成「數字名額（`available`）」
  - `release()` 的關鍵不變量：佇列有人排隊時，名額是直接從上一個持有者手上轉交給下一位，`available` 完全不動，中間不會有「暫時無主」的空檔；只有佇列真的空了，`available++` 才安全
  - 如果佇列有人時還誤把 `available++`，會製造一個假的空名額，讓全新的 `acquire()` 呼叫插隊搶走它，導致同時在臨界區的人數超過容量上限
- 弄壞了什麼、怎麼弄壞的：
  - 打完 `resolve` 時編輯器自動 import 了 `node:dns` 的 `resolve`（同名但完全不相干），沒有造成執行期錯誤（被區域參數 `resolve` 遮蔽），但學到打字後要檢查編輯器自動加的 import
- 怎麼修好的：
  - `src/lock/semaphore.ts`：`available` 計數 + `waiting` 佇列，`acquire()` 有名額直接拿、沒名額排隊；`release()` 優先轉交名額給佇列最前面的人，佇列空了才真的 `available++`
  - `examples/week2-semaphore.ts`：20 個 task 搶容量 3 的 Semaphore，追蹤 high-water mark，驗證同時人數精確等於 3、沒有超過
- 還沒搞懂的地方：
  - （持續更新）

## Week 2 — Read-Write Lock

- 學到什麼：
  - RWLock 允許多個 reader 同時持有（reader 之間不衝突），只有 writer 需要獨佔——比 Mutex 更適合讀多寫少的場景
  - Writer starvation 的根因：如果「有沒有 writer 在寫」是 reader 能不能進去的唯一條件，源源不絕的新 reader 會讓「目前沒有 active reader」這個 writer 需要的條件永遠不成立
  - 防止 writer starvation 的解法：`acquireRead()` 除了檢查 `!writerActive`，還要檢查 `waitingWriters.length === 0`——只要有 writer 在排隊，新 reader 就必須跟著排隊，不能插到 writer 前面
  - `releaseWrite()` 要優先叫醒排隊的 writer、只有沒有 writer 排隊時才叫醒所有排隊的 reader——如果反過來，starvation 問題會換一個地方重新發生
- 弄壞了什麼、怎麼弄壞的：
  - `releaseWrite()` 用 `forEach` 把所有排隊的 reader 叫醒，但沒有清空 `waitingReaders` 陣列（`forEach` 只拜訪、不像 `shift()` 會真的移除元素）。導致舊的（早就叫醒過的）resolve 函式殘留在陣列裡，下次觸發同一個分支時被重複呼叫，`this.activeReaders++` 沒有保護、被灌水，長期下來 `activeReaders` 永遠回不到 0，`acquireWrite()` 的 `activeReaders === 0` 條件永遠不成立，變成另一種 writer 永久卡死
  - 又踩到一次 `resolve` 打字時被編輯器自動 import 成 `node:dns` 的問題（第二次遇到，這次自己認出來了）
- 怎麼修好的：
  - 把 `forEach` 改成 `while (this.waitingReaders.length > 0) { const next = this.waitingReaders.shift()!; next(); this.activeReaders++; }`，跟 Mutex/Semaphore 的 `release()` 用同一套「用 `shift()` 清空佇列」的手法
  - `examples/week2-read-write-lock.ts`：驗證 20 個並發 reader、writer 完全不與 active reader 重疊、writer 即使在持續有新 reader 抵達的情況下依然能完成（沒有 starvation）
- 還沒搞懂的地方：
  - （持續更新）

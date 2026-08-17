# Forge I — 面試考題

> 這份文件在 Forge I 階段結束前會逐步累積。每個大主題（Async/Race Condition、Synchronization、
> Queue/Worker、Cache、Deadlock、Distributed Lock）完成後，我會在這裡加上幾題，你作答後我 review。
> 目前尚未開始 —— 等 Week 1 內容完成後才會出第一批題目。

## 格式

```markdown
## Q1. [問題]
**你的回答：**

**Review：** 對 / 需補強 / 需重做 —— 原因
```

---

## Async / Event Loop / Race Condition（Week 1）

## Q1. JavaScript 是單執行緒，為什麼還會發生 race condition？
**你的回答：** 因為 `await`（或其他讓出執行權的操作）會讓一個 function 執行到一半暫停，把控制權還給 Event Loop，這個空檔中別的 task 可能會插進來動同一份共享狀態；等原本的 function 恢復執行時，用的還是暫停前讀到的舊資料。

**Review：** 對。核心是「讓出執行權的空檔」，不是「兩個 CPU 核心同時跑」。

## Q2. 為什麼 `BuggyCounter` 100 次 increment 之後，結果精確等於 1，而不是介於 1~100 之間的隨機數？
**你的回答：** 因為所有 100 次「讀」都發生在同一輪同步的迴圈裡（`Array.from` 呼叫 `increment()` 100 次，每次執行到 `await` 就暫停並把控制權還給迴圈），而「寫」被推遲到 `setTimeout` 的 macrotask，這些 macrotask 要等 Call Stack 完全淨空才會被處理。所以 100 次讀保證全部搶在任何一次寫之前完成，每次都讀到同一個舊值 `0`。

**Review：** 對，而且點出了關鍵：這不是「機率性」的 race condition，是這段程式碼結構下**可重現、可預測**的結果（同步迴圈先跑完，才輪到 macrotask）。這跟很多人對 race condition「隨機、難重現」的刻板印象不同，值得記住。

## Q3. 為什麼 `SafeCounter`（read-modify-write 中間不放 await）在真實系統中反而是特例，不是常態？
**你的回答：** 因為實務上來說根本沒有 SafeCounter 的寫法，因為：
SafeCounter 的作法：read 和 write 之間不能有任何 await，但是讀寫資料庫就需要兩次wait「 read 是 await db.query(...)，write 是 await db.query(...)」

**Review：** 對，抓到核心：SafeCounter 能成立的前提是「狀態完全活在單一 process 的記憶體裡」；只要狀態換成資料庫 / Redis / 任何跨網路的外部服務，read 跟 write 天生就各自要 `await`，SafeCounter 這個選項就不存在了。

## Q4. 為什麼在 `async function` 裡呼叫 `fs.readFileSync(...)`，`await` 救不了它、還是會卡住整條 Call Stack？
**你的回答：** `fs.readFileSync(...)` 回傳的是檔案內容本身，不是 Promise；因為它是同步函式，呼叫的當下就已經卡住 Call Stack、把檔案讀完才 return。等 `await` 拿到這個已經是最終結果的值時，讓出執行權的機會根本沒發生過。

**Review：** 對，這才是完整答案：不是「有沒有用 Promise」的問題，而是「這個函式本身有沒有被設計成非同步（會不會回傳一個 pending 的 Promise）」。`await` 只能等 Promise，等不到「壓根不是 Promise、已經同步做完的東西」。

## Q5. `setTimeout(fn, 0)` 到底保證了什麼、沒保證什麼？
**你的回答：** `setTimeout(fn, 0)` 保證 0 毫秒後排進 Task Queue，但要等 Call Stack 空了才會真的執行。沒有在 0 秒後執行的原因是因為，要等 Call Stack 空了之後才執行 Task Queue。

**Review：** 對，精簡到位。「保證進 queue 的時機」跟「保證執行的時機」是兩件事，中間永遠隔著「Call Stack 是否已淨空」這個條件。

## Q6. 同樣是讓伺服器「停頓 3 秒」，一段同步的 CPU-bound 忙碌迴圈，跟 `await sleep(3000)`（non-blocking），對其他使用者的 request 影響有什麼不同？為什麼？
**你的回答：** 猜對結果（await 版不會卡住其他人），但一開始不確定原因。

**Review：** 通過（口頭補完）。關鍵不是等待時間長短，而是等待期間 Call Stack 有沒有被佔用：同步迴圈整段時間佔著 Call Stack、Event Loop 完全動彈不得；`await sleep()` 呼叫後立刻把 Call Stack 讓出來，Event Loop 可以在等待期間自由處理其他 request。這也是 I/O-bound（等待為主，CPU 閒置，適合單執行緒高並發）vs CPU-bound（運算為主，CPU 全程忙碌，單執行緒會被拖垮，需要真正平行運算）這組區分的核心。

## Q7. I/O-bound 與 CPU-bound 的本質差異是什麼？Node.js 底層實際上怎麼處理這兩種情況？
**你的回答：**（見下方導師整理，之後可以用自己的話重寫一次加深記憶）

**Review／筆記：**
- 判準不是「有沒有 `await`」，而是**瓶頸資源在哪裡**：I/O-bound 的瓶頸在 CPU 外部（磁碟、網路延遲、資料庫/其他服務的回應時間），CPU 發出請求後只能等，等待不消耗 CPU；CPU-bound 的瓶頸是 CPU 本身的運算速度，沒有「外部依賴」，從頭到尾都在真的算。
- Node.js 底層其實有兩種不同的「非同步」機制，對 JS 程式碼看起來一樣（都回傳 Promise），但實作不同：
  - 網路 I/O：直接交給作業系統核心的非同步機制（epoll / kqueue / IOCP），不需要額外執行緒，單一 Node 執行緒可以撐住幾萬個連線。
  - 檔案系統 I/O、部分 crypto/zlib：作業系統沒有原生非同步介面，Node（libuv）用一個背景執行緒池（預設 4 條）偷偷處理。
  - CPU-bound 運算（你自己寫的迴圈/排序/雜湊/圖片處理）：完全沒有背景執行緒池可用，只能在單一 JS 主執行緒上跑，沒有任何機制能讓它非同步化——因為它不是在「等誰回應」，沒有「別的地方」可以挪。
- 結論：`await` 能救的前提是背後有真正的非同步機制（OS 核心或 libuv 執行緒池）幫你把工作挪走；CPU-bound 運算沒有這個「別的地方」，所以 `await` 永遠救不了它。

## Q8. Concurrency（並發）與 Parallelism（平行）的差異是什麼？為什麼 I/O-bound 任務適合 Concurrency、CPU-bound 任務需要 Parallelism？
**你的回答：**（見下方導師整理）

**Review／筆記：**
- Concurrency：同一時間段內處理多個任務的「進度」，靠的是交錯執行（任務 A 等待時切去做任務 B），單一執行緒就辦得到（Event Loop）。只對 I/O-bound 任務有效，因為「等待」不佔用 CPU，可以交錯。
- Parallelism：同一時間點真的有多個運算同時發生，需要多個 CPU 核心/實體執行緒。是唯一能加速 CPU-bound 任務的方法——運算沒有等待的空檔可以交錯，一個核心同一瞬間物理上只能算一件事。
- 判斷方式：問「這段時間 CPU 是閒著在等，還是真的忙著在算？」閒著在等 → async/await + Event Loop（Concurrency）。真的忙著算 → `worker_threads` / 多 process / 多核心分工（Parallelism），單執行緒的非同步機制在這裡完全沒用。這是 Week 4 Worker Pool 決定「開幾個 worker」的核心依據。

## Q9. 一個 task 同時包含 I/O-bound 和 CPU-bound 的部分（例如：查資料庫 → 圖片壓縮），該怎麼設計？
**你的回答：** 這個 task 混合兩種，取決於哪一段耗時比較長。I/O-bound 用 Concurrency 處理，CPU-bound 用 worker_threads / 多 process / 多核心分工處理。

**Review：** 對。補一個實務精確化：不需要把「整個 task」歸類成一種類型，而是**拆成幾段，各自用適合的策略**——DB 查詢那段留在主執行緒用 `await`（I/O-bound，等待不佔 CPU，Event Loop 這段空檔可以服務其他 request）；圖片壓縮那段特別抽出去丟給 `worker_threads`（CPU-bound，留在主執行緒同步跑會卡住整個 Event Loop，連跟這個 task 無關的其他使用者都會被拖累）。判斷單位是「這一段程式碼」，不是「這整個 task」。

---

## Mutex / Critical Section / Lock Ownership（Week 2）

## Q10. Mutex 解決的是什麼問題？跟 Week 1 的 `SafeCounter`（拿掉 await）比，解法有什麼本質上的不同？
**你的回答：** 互斥鎖 同一時間，只有一個「持有鎖的人」可以執行臨界區的程式碼，其他想進臨界區的人，必須排隊等，直到目前持有鎖的人「釋放」鎖。Mutex可以保證該臨界區的程式碼執行不中斷。

**Review：** 需補強。Mutex 是什麼、做什麼講對了，但（1）還沒對比到 `SafeCounter`；（2）「保證臨界區程式碼執行不中斷」不準確——`LockedCounter` 臨界區裡照樣有 `await`，一樣會讓出執行權，Event Loop 一樣能趁機處理不相干的事。Mutex 保證的是更窄的一件事：不會有「另一個也想拿同一把鎖的人」插進來。待補：`SafeCounter` 靠「消除」什麼解決問題？`LockedCounter` 靠「保護」什麼解決問題？

## Q11. `acquire()` 的兩個分支（沒人持有鎖 / 已經有人持有鎖）分別做什麼？
**你的回答：** 沒有人持有鎖就是直接執行；已經有人持有鎖，是產生票等待有人按按鈕。

**Review：** 對，用「票 / 按鈕」比喻抓到核心：沒人持有鎖 → 不用排隊，直接把 `locked` 設成 `true` 拿到鎖；已經有人持有 → 建立一個「還沒完成的 Promise」，把它的 `resolve`（按鈕）存進 `waiting` 佇列，`acquire()` 就卡在這裡，直到 `release()` 按下屬於它的那顆按鈕。

## Q12. TypeScript strict mode 下，`this.waiting.shift()` 明明在 `length > 0` 的分支裡，為什麼型別還是 `(() => void) | undefined`？`!`（non-null assertion）解決了什麼、又隱藏了什麼風險？
**你的回答：** 只是 TypeScript 沒辦法從「陣列長度 > 0」自動推論出「shift() 一定有值」，這是型別系統的侷限。用 ! 之前，要能講出「為什麼這裡保證不是 undefined」，講不出來就不該用。

**Review：** 通過。型別系統的侷限、`!` 的作用、使用前提，三個重點都講到了。

---


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

---


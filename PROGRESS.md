# Project Forge — 進度追蹤

> 這份文件是「現在進行到哪、下一步做什麼」的單一事實來源。
> **每次完成一個有意義的小步驟就更新這份文件，然後 commit + push。**
> 換電腦、開新的 Claude Code session 時，先讀這份文件就能立刻接續，不需要重看對話記錄。
> 詳細的學習內容筆記在各階段的 `docs/learning-log.md`；這裡只記「位置」與「下一步」。

## 目前位置

- **階段**：Forge I — Concurrency Toolkit
- **週次**：Week 3 完成；已依 `PLAN.md` §4.5 訂出 Forge I 剩餘進度時程（每週 5 小時、目標 2026-10-31 前完成，共 7 週）
- **目前任務**：時程表 Week 1（2026-09-13 ~ 09-19）——補 Queue/Worker Pool 剩餘子題：
  priority queue、cancellation、Worker Pool graceful shutdown、worker failure + retry。
  尚未開始教學，下次從 priority queue 的「教學」步驟開始。
- **關聯專案**：`C:\Users\Quentin\Documents\QTSoloLeveling`（轉職準備：LeetCode/Java/Go/履歷，獨立 repo，進度見該專案的 `progress.md`）——目標是兩個專案盡量同步完成，落差太大就要調整時間分配

## 已完成

- [x] Git repo 初始化，GitHub public repo 建立並推上：https://github.com/tomyueTW/project-forge
- [x] `PLAN.md` 導師協作計畫與各階段驗收 SOP 定案
- [x] Forge I 專案骨架（TypeScript strict + Vitest + tsx，`npm test` / `npm run typecheck` 皆通過）
- [x] `PROGRESS.md` 建立，作為跨裝置接續進度的唯一依據
- [x] Week 1 概念講解：Call Stack / Event Loop / Microtask Queue vs Task Queue / async-await 的本質（yield point）
- [x] 手動推導 2-task lost update 案例，結論正確
- [x] `examples/week1-race-condition.ts` 完成並跑出結果：`BuggyCounter` LOST UPDATE（actual=1）、`SafeCounter` OK（actual=100）
- [x] 排查並解決 Windows PowerShell 執行 npx 的問題（執行原則 / `.ps1` vs `.cmd`）
- [x] 理解「精確等於 1」而非隨機值的原因（同步迴圈的讀 vs macrotask 的寫的排程順序）
- [x] 理解 BuggyCounter 其實是常態（外部狀態的 read 本質上是 async），SafeCounter 才是特例
- [x] `docs/interview-questions.md` Q1、Q2 已記錄並 review 通過

## 進行中

- [x] 程式碼實作：`src/queue/queue.ts`、`src/worker/worker-pool.ts`、backpressure 示範，都完成並驗證
- [x] Queue：教學 + Q17、Q18 + learning-log 全部完成
- [x] Worker Pool：教學 + Q19、Q20 + learning-log 全部完成
- [x] BoundedQueue：教學 + Q21 + 實作（`src/queue/bounded-queue.ts`）+ 驗證（`examples/week3-bounded-queue-fix.ts`）+ learning-log 全部完成
      （第一版 `enqueue()`/`dequeue()` 寫錯了好幾處，靠 `npm run typecheck` 的錯誤訊息一一定位、逐條修正，過程記在 learning-log）

## 下一步（Resume Point）

依 `PLAN.md` §4.5 時程表 Week 1：先講解 **priority queue** 的概念與動機（教學步驟，先不出骨架），
確認理解後才進入 cancellation → graceful shutdown → worker failure/retry，依序照「教學→實作→回顧→記錄」跑完整個循環。

## 待釐清 / 卡住的地方

（無）

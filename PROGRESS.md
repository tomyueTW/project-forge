# Project Forge — 進度追蹤

> 這份文件是「現在進行到哪、下一步做什麼」的單一事實來源。
> **每次完成一個有意義的小步驟就更新這份文件，然後 commit + push。**
> 換電腦、開新的 Claude Code session 時，先讀這份文件就能立刻接續，不需要重看對話記錄。
> 詳細的學習內容筆記在各階段的 `docs/learning-log.md`；這裡只記「位置」與「下一步」。

## 目前位置

- **階段**：Forge I — Concurrency Toolkit
- **週次**：Week 3 — 程式碼都已完成（Queue、Worker Pool、backpressure 示範），但發現流程漏洞：
  Queue 跟 Worker Pool 當初教學太快帶過、也沒有當場出面試考題／更新 learning-log，現在補回來
- **目前任務**：重新完整教學 Queue（純講解，暫不涉及程式碼）——目前卡在一個追問：連續 `enqueue("A")`、`enqueue("B")`、`enqueue("C")`（沒人在排隊等）之後呼叫一次 `dequeue()`，會拿到哪一個、為什麼

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

- [x] 程式碼實作全部完成：`src/queue/queue.ts`、`src/worker/worker-pool.ts`、backpressure 示範（`examples/week3-backpressure-problem.ts`）
- [x] `src/queue/bounded-queue.ts` 骨架已給，教學講過一次（enqueue/dequeue 雙向排隊、dequeue() 要順便釋放等待中的 producer）
- [ ] **Queue 重新教學中**：概念（producer/consumer 解耦、四種情境、trace）講完了，正在等你回答一題追問
- [ ] Queue 教學通過後：出面試考題、記錄 `learning-log.md`
- [ ] Worker Pool：同樣要重新做一次教學 + 面試考題 + learning-log（原本跳過了）
- [ ] BoundedQueue：teach 已完成，implement 尚未開始

## 下一步（Resume Point）

回答導師的追問：Queue 沒人排隊時連續 `enqueue("A")`、`enqueue("B")`、`enqueue("C")`，之後 `dequeue()` 一次會拿到哪個、為什麼。答完後導師會依序補：Queue 面試考題 → Worker Pool 重新教學+考題 → 回到 BoundedQueue 實作。

## 待釐清 / 卡住的地方

（無）

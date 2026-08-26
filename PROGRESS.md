# Project Forge — 進度追蹤

> 這份文件是「現在進行到哪、下一步做什麼」的單一事實來源。
> **每次完成一個有意義的小步驟就更新這份文件，然後 commit + push。**
> 換電腦、開新的 Claude Code session 時，先讀這份文件就能立刻接續，不需要重看對話記錄。
> 詳細的學習內容筆記在各階段的 `docs/learning-log.md`；這裡只記「位置」與「下一步」。

## 目前位置

- **階段**：Forge I — Concurrency Toolkit
- **週次**：Week 3 — Worker Pool 教學（純講解）進行中：N 條 worker 迴圈共搶 Queue、併發數=迴圈數、
  「呼叫但不 await」的必要性、work-stealing 式自然負載平衡都講過了
- **目前任務**：等你回答導師的追問——Queue 空了時，Worker 卡在 `await this.queue.dequeue()`，
  會不會像 polling 一樣不斷檢查？為什麼會／不會？

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
- [x] `src/queue/bounded-queue.ts` 骨架已給，教學講過一次（enqueue/dequeue 雙向排隊、dequeue() 要順便釋放等待中的 producer），implement 尚未開始
- [x] Queue：重新教學 + Q17、Q18 review 通過 + learning-log 補上
- [ ] Worker Pool：需要重新教學（純講解）+ 面試考題 + learning-log
- [ ] BoundedQueue：teach 已完成，implement 尚未開始

## 下一步（Resume Point）

導師重新教學 Worker Pool（純講解，不涉及程式碼），教完出面試考題、補 `learning-log.md`。之後回到 `src/queue/bounded-queue.ts` 實作。

## 待釐清 / 卡住的地方

（無）

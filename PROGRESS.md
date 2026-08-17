# Project Forge — 進度追蹤

> 這份文件是「現在進行到哪、下一步做什麼」的單一事實來源。
> **每次完成一個有意義的小步驟就更新這份文件，然後 commit + push。**
> 換電腦、開新的 Claude Code session 時，先讀這份文件就能立刻接續，不需要重看對話記錄。
> 詳細的學習內容筆記在各階段的 `docs/learning-log.md`；這裡只記「位置」與「下一步」。

## 目前位置

- **階段**：Forge I — Concurrency Toolkit
- **週次**：Week 1 — Event Loop / Async-Sync / 為什麼單執行緒也會 Race Condition
- **目前任務**：把 `docs/interview-questions.md` 的 Q3 用自己的文字補完，然後決定要不要進入 Week 2（Mutex）

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

- [ ] `docs/interview-questions.md` Q3（為什麼 SafeCounter 在真實系統中是特例）——待用自己文字補完
- [ ] 尚未決定：Week 1 是否還要補「blocking/non-blocking、I/O-bound vs CPU-bound」的講解，或直接進 Week 2 Mutex

## 下一步（Resume Point）

1. 打開 `forge-1-concurrency-toolkit/docs/interview-questions.md`，把 Q3 用自己的話寫完（口頭已經答對過，重寫成文字）
2. 回報導師，導師 review 後決定是否進入 Week 2（Mutex / Critical Section / Lock ownership）

## 待釐清 / 卡住的地方

（無）

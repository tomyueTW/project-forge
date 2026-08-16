# Project Forge — 進度追蹤

> 這份文件是「現在進行到哪、下一步做什麼」的單一事實來源。
> **每次完成一個有意義的小步驟就更新這份文件，然後 commit + push。**
> 換電腦、開新的 Claude Code session 時，先讀這份文件就能立刻接續，不需要重看對話記錄。
> 詳細的學習內容筆記在各階段的 `docs/learning-log.md`；這裡只記「位置」與「下一步」。

## 目前位置

- **階段**：Forge I — Concurrency Toolkit
- **週次**：Week 1 — Event Loop / Async-Sync / 為什麼單執行緒也會 Race Condition
- **目前任務**：完成 `forge-1-concurrency-toolkit/examples/week1-race-condition.ts` 的 TODO，驗證 lost update 是否如預測發生

## 已完成

- [x] Git repo 初始化，GitHub public repo 建立並推上：https://github.com/tomyueTW/project-forge
- [x] `PLAN.md` 導師協作計畫與各階段驗收 SOP 定案
- [x] Forge I 專案骨架（TypeScript strict + Vitest + tsx，`npm test` / `npm run typecheck` 皆通過）
- [x] Week 1 概念講解：Call Stack / Event Loop / Microtask Queue vs Task Queue / async-await 的本質（yield point）
- [x] 手動推導 2-task lost update 案例，結論正確：兩個 task 都在對方寫入前讀到舊值 0，最終 value=1，其中一次 increment 的效果消失

## 進行中

- [ ] 完成 `BuggyCounter.increment()`：read → await → write（模擬會被插隊的 non-atomic read-modify-write）
- [ ] 完成 `SafeCounter.increment()`：read-modify-write 中間不讓出執行權
- [ ] 執行 `npx tsx examples/week1-race-condition.ts`，把 100-task 情境的實際輸出與自己的預測對照

## 下一步（Resume Point）

在 `forge-1-concurrency-toolkit/` 目錄下執行：

```bash
npx tsx examples/week1-race-condition.ts
```

把兩行輸出（`BuggyCounter` 和 `SafeCounter`）貼給導師，對照先前手動推導的預測是否成立。

## 待釐清 / 卡住的地方

（無）

# Project Forge — 導師協作計畫

> 本文件是 `Project-Forge-Concurrent-Systems-Engineering.md`（原始規格）之上的**執行層**：
> 定義我們如何協作、每階段如何驗收、以及 Forge I 的具體週計畫。
> 原始規格文件是「要學什麼」，這份文件是「怎麼學、怎麼證明學會了」。

---

## 0.5 跨裝置延續性（重要）

因為你會在不同電腦上開新的 Claude Code session，光靠對話記錄無法延續進度，所以：

- **`PROGRESS.md`（repo 根目錄）是唯一的「現在進行到哪」事實來源。** 每完成一個有意義的小步驟
  （不用等到整個 Week 或整個階段結束）就更新它，並 **commit + push**。
- 開新 session 時，第一件事是讀 `PROGRESS.md` 的「下一步（Resume Point）」，從那裡接續，不用重講一次前情提要。
- `docs/learning-log.md` 記的是「學到了什麼、踩了什麼坑」（給 `learning-summary.md` 用的素材）；
  `PROGRESS.md` 記的是「現在卡在哪一步、下一步做什麼」——兩者分工不同，不要混著寫。
- Commit 頻率：**寧可多不要少**。完成一個 TODO、驗證完一個假設、看懂一個概念，都可以是一次 commit。

---

## 0. 角色與協作原則

**我（導師）負責：**
- 每個新概念先講解（原理 + 為什麼重要 + 現實中會怎麼壞掉）
- 提供最小骨架程式碼（不是完整解答），標好 TODO 讓你補核心邏輯
- Review 你寫的程式碼與測試，指出沒考慮到的 race condition / edge case
- 每階段結束時出「面試考題」，並在你作答後給回饋，指出落差
- 幫你把「學習成果說明」的骨架架好，內容由你自己寫（這樣才是你的）

**你負責：**
- 動手寫核心邏輯、動手刻意製造 bug（race condition / deadlock）、動手修
- 自己先嘗試回答面試考題，卡住再問（不是我先給答案）
- 寫學習成果說明——用自己的話講一遍，這是檢驗「真的懂了」還是「看得懂」的關鵬

**協作模式：混合式**
- 全新概念（Mutex、Semaphore、Deadlock、Distributed Lock…）→ 我先講解＋給骨架，你補邏輯
- 你已有基礎的部分（基本 TS/Node 寫法、簡單 CRUD）→ 你自己先做，我事後 review

**進度不綁死時程。** 你是新手，Forge I 官方建議 4–6 週，我們抓 **6–9 週**、有彈性。目標是「真的懂」，不是「趕完 checklist」。

---

## 1. 每階段的標準流程（SOP）

這是本次你額外要求、原文件沒有明講的部分，補上三階段共用的驗收流程：

```text
1. 依週計畫學習 + 實作（Understand → Implement → Test → Stress → Debug）
2. 完成該階段原文件的 Final Deliverables checklist
3. 我依據：
     (a) 原文件第 45 節「Final Success Criteria」中屬於該階段的子集
     (b) 你這階段實際寫的程式碼與做過的設計決策
   出一份「面試考題」（interview-questions.md）
4. 你自己作答（文字或口述皆可），不查資料、不看程式碼，模擬真實面試
5. 我 review 你的回答：
     - 哪些答對且講得清楚 → 過
     - 哪些答得出但講不清楚原理 → 標記「需要補強」，回去看那一小段程式碼/文件
     - 哪些答不出來 → 回到該主題重新 Implement → Break → Fix 一輪
6. 全部通過後，你撰寫「學習成果說明」（learning-summary.md）：
     - 這階段做了什麼、為什麼這樣設計
     - 踩過哪些坑（實際重現過的 race condition / deadlock / bug）
     - 如果重做一次，會怎麼改
7. 進入下一階段
```

**通過標準：不是「寫得出來」，是「講得出來」。** 能對著我（或未來的面試官）口頭解釋「為什麼會 race condition」「為什麼這樣修就不會 deadlock」，才算過關。

---

## 2. 三階段輸出總覽（原文件 + 本次新增要求）

| 階段 | 原文件成果 | 本計畫新增 |
|---|---|---|
| Forge I | Concurrency Toolkit package | `forge-1/docs/interview-questions.md`、`forge-1/docs/learning-summary.md` |
| Forge II | Ticket Booking / Flash Sale System | `forge-2/docs/interview-questions.md`、`forge-2/docs/learning-summary.md` |
| Forge III | 1–3 個 OSS PR | `forge-3/docs/interview-questions.md`、`forge-3/docs/learning-summary.md` |

三份 `learning-summary.md` 最後會匯總成一份 **Project Forge 總結**，對應原文件第 45 節「應該能夠獨立回答以下問題」的完整清單——這是最終的自我檢核。

---

## 3. Repo 結構規劃

環境（Node/Docker/Git）你說晚點處理，所以**還沒建立資料夾與初始化專案**，只先把結構定下來，等你要動手時我再幫你建置：

```text
Project-Forge/
├── Project-Forge-Concurrent-Systems-Engineering.md   (原始規格，已存在)
├── PLAN.md                                            (本文件)
├── forge-1-concurrency-toolkit/
│   ├── src/{cache,queue,worker,sync,lock,retry,timeout}/
│   ├── tests/{unit,concurrency,stress,deadlock}/
│   ├── examples/
│   ├── benchmarks/
│   └── docs/{learning-log.md, interview-questions.md, learning-summary.md}
├── forge-2-ticket-booking/        (Forge I 完成後才建立)
└── forge-3-oss-contribution/      (Forge II 完成後才建立)
```

`learning-log.md`：每週隨手記的筆記/踩坑紀錄，不是正式文件，是給 `learning-summary.md` 用的素材。

---

## 4. Forge I 週計畫（新手版，6–9 週彈性）

| 週 | 主題 | 本週要「刻意弄壞」的東西 |
|---|---|---|
| 1 | Event Loop / Call Stack / Microtask vs Macrotask / async-await 本質 / 為什麼單執行緒也會 race condition | 用最小範例重現「單執行緒 race condition」（interleaving 導致的 lost update） |
| 2 | Mutex / Critical Section / Lock ownership | 拿掉 lock，證明 lost update；加回 lock，證明修好 |
| 3 | Semaphore / Concurrency limit / Read-Write Lock | 製造 writer starvation |
| 4 | Queue（enqueue/dequeue/priority/cancellation）+ Worker Pool（lifecycle/backpressure） | 讓 queue 塞爆（backpressure 沒處理時會怎樣） |
| 5 | Cache（TTL/LRU/cache-aside）+ Cache Stampede + Request Coalescing | 重現 cache stampede：大量請求同時 miss，打爆下游 |
| 6 | Retry / Timeout / Cancellation / Backoff / Jitter | 製造 retry storm |
| 7 | Deadlock（四條件）+ Lock ordering / Try-lock | 手刻一個真的會卡死的 deadlock，再修好 |
| 8 | Distributed Lock 概念（Redis SET NX / TTL / lease）——只求理解本質差異，不要求 production-grade | 討論：local lock 為什麼在分散式環境失效 |
| 9 | Stress Test + Benchmark（No Lock vs Mutex vs Semaphore vs Queue）+ 補齊 README/ADR + **驗收（面試考題 + 學習成果說明）** | — |

每週結束你不用等到第9週才被考——我會在每個「大主題」段落（Week 2-3 同步synchronization、Week 4 queue/worker、Week 5 cache、Week 7 deadlock）小考幾題，累積到最後不會一次考太多。

---

## 5. 面試考題 / 學習成果說明的格式

**`interview-questions.md`**（我出、你答、我 review 後定案）：
```markdown
## Q1. [問題]
**你的回答：**
**Review：** 對 / 需補強 / 需重做 —— 原因
```

**`learning-summary.md`**（你寫，我只幫忙架骨架）：
```markdown
# Forge I 學習成果說明

## 做了什麼
## 關鍵設計決策與取捨
## 踩過的坑（附重現方式與根因）
## 如果重做一次會怎麼改
## 我現在能講清楚的概念 / 我還不太確定的概念
```

---

## 6. 下一步

環境設置留到你要動手時再做（`npm init`、`tsconfig`、`vitest`、Docker Compose for Redis 之後才需要）。

現在可以選：
- **A. 直接開始 Week 1**：我先講解 Event Loop / async-sync / race condition 的核心概念，用純講解＋小範例（不需要環境）帶你過一輪，之後才進入寫程式
- **B. 先把環境建好**：git init、node/TS 專案骨架、Vitest，讓你隨時可以動手驗證
- **C. 你想先調整這份週計畫**（時程、順序、要不要跳過某些主題）

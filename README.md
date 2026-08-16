# Project Forge — Concurrent Systems Engineering

> Build. Stress. Contribute.

一個自主學習、由導師引導的專案，透過三個連續、動手實作的階段，
從「會使用 concurrency tools 的工程師」提升到
「能理解、設計、debug、驗證 concurrent / distributed systems 的工程師」。

## 三個階段

| 階段 | 目標 | 產出 |
|---|---|---|
| **Forge I — Concurrency Toolkit** | 從零實作 concurrency primitives（Mutex、Semaphore、Queue、Worker Pool、Cache、Retry/Timeout），理解 concurrency bug 為什麼會發生 | `forge-1-concurrency-toolkit/` — 一個 TypeScript package |
| **Forge II — High-Concurrency Product** | 把這些 primitive 應用到有真實流量壓力的系統上 | Ticket Booking / Flash Sale 系統 |
| **Forge III — Open Source Contribution** | 閱讀、重現、修復一個真實 production OSS 的 concurrency bug | 1–3 個 pull request |

每個階段結束前都有相同的驗收關卡：完成該階段的 deliverables → 憑記憶回答一組面試考題
（不查資料）→ 用自己的話寫下學到了什麼。完整的協作流程與驗收 SOP 見
[`PLAN.md`](./PLAN.md)；原始的逐階段規格文件見
[`Project-Forge-Concurrent-Systems-Engineering.md`](./Project-Forge-Concurrent-Systems-Engineering.md)。

## 專案結構

```text
Project-Forge/
├── Project-Forge-Concurrent-Systems-Engineering.md   # 原始規格文件
├── PLAN.md                                            # 導師協作計畫與驗收 SOP
├── forge-1-concurrency-toolkit/                       # 第一階段（進行中）
├── forge-2-ticket-booking/                            # 第二階段（Forge I 完成後才建立）
└── forge-3-oss-contribution/                          # 第三階段（Forge II 完成後才建立）
```

每個階段的資料夾底下都有自己的 `docs/interview-questions.md` 與
`docs/learning-summary.md`，在該階段結束時產出。

## 目前狀態

🟡 Forge I — 開發環境已建置完成，尚未開始學習內容。

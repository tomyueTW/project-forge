# Project Forge — Concurrent Systems Engineering

> **Build. Stress. Contribute.**
>
> 以 3 個階段、每階段 1–2 個月的實作週期，系統性提升 Concurrent / Distributed Systems Engineering 能力。

---

# 1. Project Overview

## 1.1 計畫名稱

**Project Forge**

### 三階段

1. **Forge I — Concurrency Toolkit**
2. **Forge II — High-Concurrency Product**
3. **Forge III — Open Source Contribution**

---

## 1.2 核心目標

本計畫不是單純學習 Cache、Queue、Worker 或 Lock，而是透過三個連續的工程專案，建立以下能力：

- Cache
- Queue
- Worker
- Async / Sync
- Concurrency / Parallelism
- Race Condition
- Resource Competition
- Mutex / Semaphore
- Distributed Lock
- Deadlock
- Transaction
- Atomicity
- Idempotency
- Retry / Backoff
- Timeout / Cancellation
- Backpressure
- Consistency
- Observability
- Source Code Reading
- Debugging
- Open Source Contribution

核心學習循環：

```text
Understand
    ↓
Implement
    ↓
Test
    ↓
Stress
    ↓
Observe Failure
    ↓
Understand Root Cause
    ↓
Improve
    ↓
Apply to Real System
    ↓
Read OSS Implementation
    ↓
Fix Real Bug
    ↓
Contribute
```

---

# 2. Overall Architecture

```text
┌─────────────────────────────────────────────────────────────┐
│                      PROJECT FORGE                           │
│             Concurrent Systems Engineering                  │
└─────────────────────────────────────────────────────────────┘

        ┌──────────────────────┐
        │ Forge I              │
        │ Concurrency Toolkit  │
        └──────────┬───────────┘
                   │
          Build primitives
                   │
                   ▼
        ┌──────────────────────┐
        │ Forge II             │
        │ High-Concurrency     │
        │ Product              │
        └──────────┬───────────┘
                   │
          Stress real system
                   │
                   ▼
        ┌──────────────────────┐
        │ Forge III            │
        │ Open Source          │
        │ Contribution         │
        └──────────────────────┘
                   │
          Read / Reproduce /
          Fix / Test / PR
```

---

# 3. Phase Summary

| Phase | Duration | Main Objective | Final Output |
|---|---:|---|---|
| Forge I | 1–2 months | Understand and implement concurrency primitives | Concurrency Toolkit |
| Forge II | 1–2 months | Apply concurrency concepts to a real system | Ticket Booking / Flash Sale System |
| Forge III | 1–2 months | Solve a real concurrency problem in OSS | 1–3 meaningful PRs |

---

# 4. Forge I — Concurrency Toolkit

## 4.1 Phase Objective

建立自己的 **Concurrency Toolkit**，透過實作與測試理解 concurrency primitives 與常見 concurrent programming patterns。

重點不是打造一個可以取代 Redis / BullMQ 的 production library，而是：

> **用最小但完整的 implementation，理解 concurrency 問題為什麼發生，以及不同 synchronization strategy 如何解決它。**

---

## 4.2 Final Result

完成一個 TypeScript package：

```text
concurrency-toolkit/
├── src/
│   ├── cache/
│   ├── queue/
│   ├── worker/
│   ├── sync/
│   ├── lock/
│   ├── retry/
│   ├── timeout/
│   └── index.ts
├── tests/
│   ├── unit/
│   ├── concurrency/
│   ├── stress/
│   └── deadlock/
├── examples/
├── benchmarks/
├── README.md
├── package.json
└── tsconfig.json
```

---

# 5. Forge I — Required Skills

## 5.1 Async / Sync

必須理解：

- Synchronous execution
- Asynchronous execution
- Event Loop
- Call Stack
- Task Queue
- Microtask Queue
- Promise
- `async / await`
- Callback
- Blocking / Non-blocking
- I/O-bound vs CPU-bound

必須能回答：

> `async/await` 到底解決什麼問題？

> Promise concurrency 和 parallelism 有什麼差異？

> 為什麼 JavaScript 單執行緒仍然會發生 race condition？

---

# 6. Forge I — Concurrency

需要理解：

- Concurrency
- Parallelism
- Interleaving
- Race Condition
- Critical Section
- Shared State
- Resource Competition
- Atomic Operation

建立最小案例：

```text
Task A ────────┐
               ├── Shared Resource
Task B ────────┘
```

刻意製造：

```text
Read
 ↓
Context Switch
 ↓
Read
 ↓
Write
 ↓
Write
```

理解 Lost Update。

---

# 7. Forge I — Synchronization

實作：

## Mutex

```ts
const lock = new Mutex()

await lock.acquire()

try {
  // critical section
} finally {
  lock.release()
}
```

理解：

- Mutual exclusion
- Critical section
- Lock ownership
- Lock release
- Lock timeout

## Semaphore

實作：

```ts
const semaphore = new Semaphore(5)
```

限制同時最多 5 個 task。

理解：

- Concurrency limit
- Resource pool
- Worker capacity

## Read / Write Lock

理解：

- Multiple readers
- Exclusive writer
- Read-heavy workload
- Writer starvation

---

# 8. Forge I — Queue

建立：

```text
Producer
   ↓
Queue
   ↓
Consumer / Worker
```

功能：

- enqueue
- dequeue
- concurrency limit
- retry
- timeout
- priority
- cancellation
- graceful shutdown

---

# 9. Forge I — Worker Pool

建立：

```text
             ┌── Worker 1
Queue ───────┼── Worker 2
             ├── Worker 3
             └── Worker 4
```

必須理解：

- Worker lifecycle
- Worker concurrency
- Task scheduling
- Backpressure
- Worker failure
- Retry
- Graceful shutdown

---

# 10. Forge I — Cache

建立簡化版 Cache：

```text
cache.get()
cache.set()
cache.delete()
cache.clear()
```

進一步：

- TTL
- Expiration
- LRU
- Cache-aside
- Serialization
- Cache stampede
- Request coalescing / single-flight

---

# 11. Forge I — Lock

實作兩種層級：

## Local Lock

```text
Mutex
Semaphore
```

## Distributed Lock Concept

研究：

```text
Redis
SET NX
TTL
Lock ownership
Lease
Expiration
```

不要求第一階段自行實作完整 production-grade distributed lock。

目標是理解：

> Local synchronization 和 distributed synchronization 的本質差異。

---

# 12. Forge I — Deadlock

刻意製造：

```text
Thread A
  Lock A
  ↓
  Wait B

Thread B
  Lock B
  ↓
  Wait A
```

理解 Deadlock 四個必要條件：

1. Mutual Exclusion
2. Hold and Wait
3. No Preemption
4. Circular Wait

並實作至少一種避免策略：

- Lock ordering
- Timeout
- Try-lock
- Avoid nested locks

---

# 13. Forge I — Retry / Timeout / Cancellation

實作：

```text
retry()
timeout()
cancel()
backoff()
```

必須理解：

- Fixed backoff
- Exponential backoff
- Jitter
- Retry storm
- Cancellation
- Timeout propagation

---

# 14. Forge I — Testing Requirements

不能只有 unit tests。

至少包含：

### Unit Test

測試單一 primitive。

### Concurrency Test

同時啟動大量 task。

### Stress Test

例如：

```text
1,000 concurrent operations
10,000 operations
100 workers
```

### Race Test

刻意重現：

- Lost update
- Duplicate execution
- Double resource allocation

### Deadlock Test

刻意產生 lock cycle。

### Benchmark

比較：

```text
No Lock
Mutex
Semaphore
Queue
```

---

# 15. Forge I — Required Technologies

## Language

- TypeScript
- Node.js

## Required Libraries / Components

建議：

- Redis
- Vitest
- Docker
- Pino
- TypeScript tooling

可選：

- BullMQ：作為 reference implementation
- `async-mutex`：比較現成 implementation
- `p-limit`：研究 concurrency limiting

原則：

> **核心 primitive 優先自己實作；成熟 infrastructure 則用 OSS 驗證自己的理解。**

---

# 16. Forge I — Final Deliverables

- [ ] Concurrency Toolkit package
- [ ] Mutex
- [ ] Semaphore
- [ ] Queue
- [ ] Worker Pool
- [ ] Cache
- [ ] Retry
- [ ] Timeout
- [ ] Cancellation
- [ ] Deadlock examples
- [ ] Race condition examples
- [ ] Stress tests
- [ ] Benchmarks
- [ ] README
- [ ] Architecture document
- [ ] Technical decision records

---

# 17. Forge II — High-Concurrency Product

## 17.1 Phase Objective

把 Forge I 的 concurrency knowledge 放進一個真正具有大量 concurrent requests 的產品。

### Product

**Ticket Booking / Flash Sale System**

核心問題：

> 當大量使用者同時搶有限資源時，如何確保系統正確？

---

# 18. Forge II — Core Domain

```text
User
  ↓
Event
  ↓
Ticket / Seat
  ↓
Reservation
  ↓
Payment
  ↓
Order
```

核心情境：

```text
Available Tickets = 100

10,000 Users
      ↓
Concurrent Requests
      ↓
Only 100 users can succeed
```

---

# 19. Forge II — Required Features

## User

- Registration
- Login
- Authentication

## Event

- Create event
- Event details
- Ticket inventory

## Booking

- Select ticket
- Reserve ticket
- Confirm booking
- Cancel booking

## Payment

使用 Mock Payment Gateway。

模擬：

- Success
- Failure
- Timeout
- Duplicate callback

---

# 20. Forge II — Required Architecture

```text
                 Client
                   │
                   ▼
              API Server
                   │
          ┌────────┼────────┐
          │        │        │
          ▼        ▼        ▼
       Cache     Queue     Database
          │        │
          │        ▼
          │      Worker
          │        │
          └────────┴───────┐
                           ▼
                      PostgreSQL
```

---

# 21. Forge II — Cache

必須使用 Redis。

練習：

- Cache-aside
- TTL
- Cache invalidation
- Cache stampede
- Cache warming
- Request coalescing

必須回答：

> Cache stale data 時怎麼辦？

> 大量 cache miss 怎麼辦？

> Cache 被 Redis 重啟清空怎麼辦？

---

# 22. Forge II — Queue

使用：

**BullMQ + Redis**

處理：

- Reservation expiration
- Payment processing
- Notification
- Order confirmation
- Cleanup jobs

架構：

```text
API
 ↓
Queue
 ↓
Worker
 ↓
Database / External Service
```

---

# 23. Forge II — Worker

Worker 必須支援：

- Concurrency limit
- Retry
- Exponential backoff
- Timeout
- Failure handling
- Graceful shutdown
- Job idempotency

刻意測試：

```text
Worker crash
Worker timeout
Duplicate job
Retry
```

---

# 24. Forge II — Resource Competition

核心問題：

```text
100 tickets

10,000 requests
```

必須實作至少三種策略：

### Strategy A — Database Atomic Update

```sql
UPDATE tickets
SET available = available - 1
WHERE available > 0;
```

### Strategy B — Pessimistic Lock

研究：

```text
SELECT ... FOR UPDATE
```

### Strategy C — Redis Lock / Distributed Lock

比較三者：

| Strategy | 優點 | 缺點 |
|---|---|---|
| Atomic Update | 簡單、可靠 | 複雜邏輯較難 |
| DB Lock | Transaction 整合好 | Lock contention |
| Redis Lock | 分散式 | Failure / expiration 複雜 |

---

# 25. Forge II — Race Condition

至少重現：

## Overselling

```text
Inventory = 1

A → Check = 1
B → Check = 1
A → Buy
B → Buy
```

## Double Booking

同一 Seat 被兩個 user 預約。

## Lost Update

兩個 worker 同時更新同一資料。

---

# 26. Forge II — Deadlock

建立至少一個可重現案例：

```text
Transaction A
  Lock User
  ↓
  Lock Ticket

Transaction B
  Lock Ticket
  ↓
  Lock User
```

然後修復：

```text
User → Ticket
```

統一 lock ordering。

必須能解釋：

> 為什麼原本會 deadlock？

> 為什麼改成固定順序後不會？

---

# 27. Forge II — Transaction / Consistency

必須理解：

- ACID
- Atomicity
- Consistency
- Isolation
- Durability
- Transaction boundary
- Isolation levels
- Lost update
- Dirty read
- Non-repeatable read
- Phantom read

至少比較：

- Read Committed
- Repeatable Read
- Serializable

---

# 28. Forge II — Idempotency

所有重要操作都要考慮：

```text
POST /orders
POST /payments
POST /reservations
```

例如：

```text
Request
 ↓
Timeout
 ↓
Client retries
 ↓
Server receives duplicate request
```

不能造成：

```text
2 Orders
2 Payments
2 Reservations
```

實作：

```text
Idempotency-Key
```

---

# 29. Forge II — Observability

加入：

- Structured logging
- Request ID
- Job ID
- Trace ID
- Metrics
- Queue depth
- Worker utilization
- Lock wait time
- Request latency
- Error rate

推薦：

- Pino
- OpenTelemetry
- Prometheus
- Grafana

---

# 30. Forge II — Load Testing

至少使用：

- k6

建立：

### Normal Load

```text
100 RPS
```

### High Load

```text
1,000 RPS
```

### Flash Sale

```text
10,000 concurrent users
```

觀察：

- p50
- p95
- p99
- throughput
- error rate
- DB connection usage
- Redis latency
- queue depth
- worker utilization
- lock contention

---

# 31. Forge II — Required Technologies

## Frontend

- Vue 3
- TypeScript
- Quasar
- Pinia

## Backend

- NestJS
- TypeScript

## Database

- PostgreSQL

## Cache / Lock

- Redis

## Queue

- BullMQ

## Testing

- Vitest
- Supertest

## Load Testing

- k6

## Infrastructure

- Docker Compose

## Observability

- Pino
- OpenTelemetry
- Prometheus
- Grafana

---

# 32. Forge II — Final Deliverables

- [ ] Working Ticket Booking / Flash Sale system
- [ ] Authentication
- [ ] Ticket inventory
- [ ] Reservation
- [ ] Mock payment
- [ ] Redis cache
- [ ] Queue
- [ ] Worker
- [ ] Retry
- [ ] Idempotency
- [ ] Transaction
- [ ] Distributed lock
- [ ] Race condition reproduction
- [ ] Deadlock reproduction
- [ ] Load test
- [ ] Metrics
- [ ] Logs
- [ ] Architecture diagram
- [ ] Performance report
- [ ] Failure analysis report

---

# 33. Forge III — Open Source Contribution

## 33.1 Phase Objective

從「自己寫 concurrency code」進入「理解別人的 production concurrency implementation」。

核心流程：

```text
Select OSS
   ↓
Understand Architecture
   ↓
Find Concurrency Issue
   ↓
Reproduce
   ↓
Read Source
   ↓
Identify Root Cause
   ↓
Implement Fix
   ↓
Add Regression Test
   ↓
Benchmark
   ↓
Pull Request
   ↓
Code Review
   ↓
Revision
   ↓
Merge
```

---

# 34. Forge III — OSS Selection

優先選擇你前兩階段使用過的 ecosystem：

- Redis ecosystem
- BullMQ
- Node.js concurrency libraries
- Cache libraries
- Queue libraries
- Worker libraries
- Database libraries

不要一開始挑：

- Kubernetes
- Linux kernel
- Chromium
- PostgreSQL core

除非已經有足夠 code-reading experience。

---

# 35. Forge III — Source Code Reading

至少理解：

```text
Repository
 ↓
Entry Point
 ↓
Public API
 ↓
Core Implementation
 ↓
Concurrency Boundary
 ↓
State Management
 ↓
Tests
```

重點找：

- Shared state
- Lock
- Queue
- Worker
- Event
- Retry
- Timer
- Promise
- Atomic operation

---

# 36. Forge III — Concurrency Bug Investigation

選擇一個真實 issue。

優先：

- Race condition
- Duplicate job
- Worker shutdown bug
- Lock issue
- Queue ordering
- Retry bug
- Timeout bug
- Resource leak
- Deadlock
- Lost update

---

# 37. Forge III — Reproduction

必須建立：

```text
Minimal Reproduction
```

包含：

- 最小程式碼
- 固定環境
- 可重現步驟
- Expected behavior
- Actual behavior
- Failure frequency

例如：

```text
Run 1,000 times
↓
Expected: 0 failures
Actual: 17 failures
```

---

# 38. Forge III — Root Cause Analysis

必須回答：

1. Race condition 發生在哪？
2. 哪個 state 被 shared？
3. 哪個 operation 不是 atomic？
4. Context switch 發生在哪？
5. 為什麼現有 synchronization 沒有阻止問題？
6. 為什麼某些 timing 下才發生？
7. 修復方案會不會造成 deadlock？
8. 修復後 performance 是否下降？

---

# 39. Forge III — Fix

要求：

```text
Bug
 ↓
Regression Test
 ↓
Fix
 ↓
Stress Test
 ↓
Benchmark
```

不要只做到：

```text
Bug disappeared
```

而是證明：

```text
Correctness ↑
Regression protection ↑
Performance acceptable
```

---

# 40. Forge III — Pull Request

PR 必須包含：

- Problem
- Reproduction
- Root cause
- Solution
- Tests
- Performance impact
- Trade-offs

並完成至少一次：

```text
Maintainer Review
```

---

# 41. Forge III — Final Deliverables

目標：

- [ ] 1 個完整 concurrency bug investigation
- [ ] 1 個 minimal reproduction
- [ ] 1 個 regression test
- [ ] 1 個 production fix
- [ ] 1 個 benchmark / stress test
- [ ] 1 個 Pull Request

理想：

- [ ] 2–3 meaningful PRs
- [ ] 至少 1 個 PR merged

---

# 42. Cross-Phase Skill Matrix

| Skill | Forge I | Forge II | Forge III |
|---|:---:|:---:|:---:|
| Async / Sync | ★★★★★ | ★★★★☆ | ★★★★☆ |
| Concurrency | ★★★★★ | ★★★★★ | ★★★★★ |
| Race Condition | ★★★★★ | ★★★★★ | ★★★★★ |
| Mutex | ★★★★★ | ★★★★☆ | ★★★★☆ |
| Semaphore | ★★★★★ | ★★★★☆ | ★★★★☆ |
| Distributed Lock | ★★★★☆ | ★★★★★ | ★★★★★ |
| Deadlock | ★★★★★ | ★★★★★ | ★★★★★ |
| Cache | ★★★★★ | ★★★★★ | ★★★★☆ |
| Queue | ★★★★★ | ★★★★★ | ★★★★★ |
| Worker | ★★★★★ | ★★★★★ | ★★★★★ |
| Transaction | ★★★☆☆ | ★★★★★ | ★★★★★ |
| Idempotency | ★★★☆☆ | ★★★★★ | ★★★★★ |
| Retry | ★★★★☆ | ★★★★★ | ★★★★★ |
| Backpressure | ★★★★★ | ★★★★★ | ★★★★☆ |
| Load Testing | ★★★☆☆ | ★★★★★ | ★★★★☆ |
| Source Reading | ★★★★☆ | ★★★★☆ | ★★★★★ |
| Debugging | ★★★★☆ | ★★★★★ | ★★★★★ |
| OSS Contribution | ☆☆☆☆☆ | ☆☆☆☆☆ | ★★★★★ |

---

# 43. Recommended Timeline

## Forge I — 4–6 Weeks

```text
Week 1
Async / Event Loop / Concurrency fundamentals

Week 2
Mutex / Semaphore / Race Condition

Week 3
Queue / Worker Pool

Week 4
Cache / Lock / Retry / Timeout

Week 5
Deadlock / Stress Test / Benchmark

Week 6
Refactor / Documentation / Release
```

## Forge II — 5–8 Weeks

```text
Week 1
Domain + Architecture

Week 2
Booking / Inventory / Transaction

Week 3
Redis Cache

Week 4
Queue + Worker

Week 5
Lock / Race Condition / Idempotency

Week 6
Deadlock / Failure Recovery

Week 7
Load Testing / Observability

Week 8
Performance Optimization / Final Report
```

## Forge III — 4–6 Weeks

```text
Week 1
OSS selection + repository exploration

Week 2
Issue investigation + reproduction

Week 3
Source code analysis

Week 4
Fix + regression test

Week 5
Stress test + benchmark

Week 6
PR + review + revision
```

---

# 44. Engineering Rules

## Rule 1 — Don't only read

Every concept must have:

```text
Read
 ↓
Implement
 ↓
Break
 ↓
Fix
```

## Rule 2 — Deliberately create failures

每一階段都必須刻意製造：

- Race condition
- Timeout
- Duplicate execution
- Worker failure
- Deadlock
- Cache inconsistency

## Rule 3 — Correctness before Performance

優先順序：

```text
Correctness
    ↓
Consistency
    ↓
Reliability
    ↓
Observability
    ↓
Performance
```

## Rule 4 — Compare multiple solutions

例如 Inventory：

```text
Atomic Update
vs
Pessimistic Lock
vs
Optimistic Lock
vs
Redis Lock
```

記錄：

- Correctness
- Complexity
- Throughput
- Latency
- Failure behavior
- Operational cost

---

# 45. Final Success Criteria

完成 Project Forge 後，應該能夠獨立回答以下問題。

## Concurrency

- [ ] Concurrency 與 Parallelism 差異？
- [ ] JavaScript 單執行緒為什麼仍有 race condition？
- [ ] Async operation 何時會造成問題？

## Synchronization

- [ ] Mutex 解決什麼？
- [ ] Semaphore 與 Mutex 差在哪？
- [ ] 什麼時候需要 lock？
- [ ] 什麼時候不應該使用 lock？

## Deadlock

- [ ] Deadlock 為什麼發生？
- [ ] 如何重現？
- [ ] 如何避免？
- [ ] Lock ordering 如何設計？

## Cache

- [ ] Cache-aside 是什麼？
- [ ] Cache stampede 如何發生？
- [ ] Cache invalidation 如何處理？
- [ ] Distributed cache failure 怎麼辦？

## Queue / Worker

- [ ] 為什麼需要 Queue？
- [ ] Worker concurrency 怎麼限制？
- [ ] Retry 怎麼避免 retry storm？
- [ ] Duplicate job 怎麼處理？
- [ ] Worker crash 怎麼恢復？

## Database

- [ ] Transaction boundary 怎麼定？
- [ ] Isolation level 有什麼差異？
- [ ] Lost update 怎麼發生？
- [ ] Atomic update 和 DB lock 怎麼選？

## Distributed Systems

- [ ] Idempotency 為什麼重要？
- [ ] Distributed lock 的 failure mode？
- [ ] Eventual consistency 如何處理？
- [ ] Timeout / Retry / Failure 如何互相影響？

## Engineering

- [ ] 如何閱讀陌生 OSS？
- [ ] 如何建立 minimal reproduction？
- [ ] 如何定位 concurrency bug？
- [ ] 如何寫 regression test？
- [ ] 如何 benchmark 修復前後？
- [ ] 如何提交 production-quality PR？

---

# 46. Project Forge — Definition of Done

Project Forge 不以「完成三個專案」作為真正完成條件。

真正的 Definition of Done 是：

```text
                    ┌───────────────┐
                    │  Understand   │
                    └───────┬───────┘
                            ↓
                    ┌───────────────┐
                    │     Build     │
                    └───────┬───────┘
                            ↓
                    ┌───────────────┐
                    │     Break     │
                    └───────┬───────┘
                            ↓
                    ┌───────────────┐
                    │    Debug      │
                    └───────┬───────┘
                            ↓
                    ┌───────────────┐
                    │    Optimize   │
                    └───────┬───────┘
                            ↓
                    ┌───────────────┐
                    │  Apply to     │
                    │  Real System  │
                    └───────┬───────┘
                            ↓
                    ┌───────────────┐
                    │ Read Others'  │
                    │     Code      │
                    └───────┬───────┘
                            ↓
                    ┌───────────────┐
                    │ Fix Real OSS  │
                    │     Bug       │
                    └───────────────┘
```

**最終目標：**

> 從「會使用 concurrency tools 的 Full-stack Engineer」，提升到「能理解、設計、debug、驗證 Concurrent / Distributed Systems 的 Engineer」。

---

# 47. One-Line Definition

> **Forge I teaches you to build concurrency primitives.**
>
> **Forge II teaches you to survive concurrency in a real system.**
>
> **Forge III teaches you to solve concurrency problems in production open-source software.**

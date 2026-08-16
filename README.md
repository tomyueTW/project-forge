# Project Forge — Concurrent Systems Engineering

> Build. Stress. Contribute.

A self-directed, mentor-guided learning project to go from "uses concurrency tools" to
"can understand, design, debug, and verify concurrent/distributed systems" — through three
sequential, hands-on phases.

## Phases

| Phase | Goal | Output |
|---|---|---|
| **Forge I — Concurrency Toolkit** | Implement concurrency primitives from scratch (Mutex, Semaphore, Queue, Worker Pool, Cache, Retry/Timeout) and understand *why* concurrency bugs happen | `forge-1-concurrency-toolkit/` — a TypeScript package |
| **Forge II — High-Concurrency Product** | Apply those primitives to a real system under load | Ticket Booking / Flash Sale system |
| **Forge III — Open Source Contribution** | Read, reproduce, and fix a real concurrency bug in production OSS | 1–3 pull requests |

Each phase ends with the same checkpoint before moving on: finish the phase's deliverables,
answer a set of interview-style questions from memory (no notes), then write up what was
learned in your own words. See [`PLAN.md`](./PLAN.md) for the full mentoring workflow and
[`Project-Forge-Concurrent-Systems-Engineering.md`](./Project-Forge-Concurrent-Systems-Engineering.md)
for the original phase-by-phase specification.

## Structure

```text
Project-Forge/
├── Project-Forge-Concurrent-Systems-Engineering.md   # original spec
├── PLAN.md                                            # mentoring plan & SOP
├── forge-1-concurrency-toolkit/                       # Phase 1 (in progress)
├── forge-2-ticket-booking/                            # Phase 2 (created after Forge I)
└── forge-3-oss-contribution/                          # Phase 3 (created after Forge II)
```

Each phase directory contains its own `docs/interview-questions.md` and
`docs/learning-summary.md`, produced at the end of that phase.

## Status

🟡 Forge I — environment scaffolded, learning not yet started.

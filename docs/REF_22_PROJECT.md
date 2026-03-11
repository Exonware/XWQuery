# Project Reference — xwquery

**Library:** exonware-xwquery  
**Last Updated:** 08-Feb-2026  
**Requirements source:** [REF_01_REQ.md](REF_01_REQ.md) (output of GUIDE_01_REQ → GUIDE_22_PROJECT). Per REF_35_REVIEW.

---

## Vision

xwquery is the **unified query system (XWQS)** and the **library** of connectors, strategies, and handlers so **one universal script** can convert anything to anything and execute on node-based or table-based structures. It uses xwsyntax and is consumed by xwstorage, xwaction, and xwbase; anything executed in the zone (e.g. S3) is converted to XWQS first. Multi-language support (35+ grammars) and executor pipeline (core, aggregation, filtering, data, graph, etc.) implement this vision.

---

## Goals (from REF_01_REQ, ordered)

1. **Unified scripting language (XWQS):** Convert anything to anything; one universal script—no separate language per backend.
2. **Run in xwaction:** Executable script and execution flow through xwquery.
3. **Used in xwstorage:** Query execution and format conversion for storage-backed data/graphs.
4. **Used in xwbase:** Success = xwquery being used in xwbase.
5. **Executor strategy & stability:** Executors by domain; public API = engine/facade; internal executor layout may evolve; contract (capability checker, engine) remains stable (REF_13_ARCH).

---

## Functional Requirements (Summary)

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-001 | Parser and grammar system (35+ grammars) | High | Done |
| FR-002 | Executor pipeline (core, aggregation, filtering, data, graph, etc.) | High | Done (layout refactor in progress) |
| FR-003 | Engine and capability checker | High | Done |
| FR-004 | Backend integration (xwstorage, xwnode, xwdata) | High | Done |
| FR-005 | 4-layer tests; alignment with executor layout | High | In progress |
| FR-006 | Documentation of executor strategy and stability | High | Done (this doc, REF_13_ARCH) |

---

## Non-Functional Requirements (5 Priorities — from REF_01_REQ sec. 8)

1. **Security (very high):** Input validation; no code execution from query text; capability checks.
2. **Usability (ultra-high):** Clear engine API; OPERATIONS_REFERENCE, QUICK_REFERENCE, ARCHITECTURE; library understandable and reversible.
3. **Maintainability (ultra-high):** REF_* traceability; tests and docs match executor/strategy layout; 4-layer tests.
4. **Performance (high):** Parser and executor performance; optimization docs.
5. **Extensibility (ultra-high):** Pluggable grammars (xwsyntax) and strategies/connectors; add languages and backends without breaking universal-script contract.

---

## Executor Strategy and Stability

- **Public contract:** Query engine facade and capability checker; parse → plan → execute flow.
- **Executor layout:** Executors are grouped by domain (core, aggregation, filtering, data, graph, array, etc.). Refactoring may rename or move executor modules; the engine and capability checker remain the stable API.
- **Tests and docs:** Tests and documentation are updated to reference current executor paths; no orphan references to deleted executor modules (per REF_35_REVIEW).

---

## Project Status Overview

- **Current phase:** Alpha (Medium). Many grammars and executors; 247+ files; executor refactor in progress; 4-layer tests; docs in docs/ (ARCHITECTURE, PROJECT_PHASES, phase and grammar docs).
- **Docs:** REF_22_PROJECT (this file), REF_13_ARCH, REF_35_REVIEW; logs/reviews/; executor strategy documented here and in REF_13_ARCH. Historical change notes and fix guides in [docs/_archive/](_archive/).

---

## Milestones (from REF_01_REQ sec. 9)

| Milestone | Target | Status |
|-----------|--------|--------|
| **This phase:** Library + strategies + execution; convert any-to-any (XWQS); execute on node/table structures; used by xwstorage, xwaction, xwbase. Success = use in xwbase. | v0.x | M1–M2 Done; M3 in progress; M4 Done |
| M1 — Core parsers and executors | v0.x | Done |
| M2 — Grammars and backend integration | v0.x | Done |
| M3 — Executor refactor and doc alignment | v0.x | In progress |
| M4 — REF_* and stability documentation | v0.x | Done (REF_22, REF_13) |
| **Next phase:** User interface and editor (future). | — | Deferred |

---

## Traceability

- **Requirements:** [REF_01_REQ.md](REF_01_REQ.md) (source).
- **Idea/Arch/DX/API:** [REF_12_IDEA.md](REF_12_IDEA.md), [REF_13_ARCH.md](REF_13_ARCH.md), [REF_14_DX.md](REF_14_DX.md), [REF_15_API.md](REF_15_API.md).
- **Review evidence:** [REF_35_REVIEW.md](REF_35_REVIEW.md), [logs/reviews/](logs/reviews/).
- **Comparisons:** Capability comparison (full eXonware stack vs PostgreSQL): [logs/reviews/REVIEW_20260220_043628_000_XWQUERY_XWQS_VS_POSTGRES.md](logs/reviews/REVIEW_20260220_043628_000_XWQUERY_XWQS_VS_POSTGRES.md); [logs/reviews/REVIEW_20260220_165944_014_FULL_STACK_VS_POSTGRES.md](logs/reviews/REVIEW_20260220_165944_014_FULL_STACK_VS_POSTGRES.md) (scores from library-by-library inspection).

---

*See GUIDE_22_PROJECT.md for requirements process.*

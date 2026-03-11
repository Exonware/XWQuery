# Review: Archive consolidation — xwquery

**Date:** 2026-02-08  
**Artifact type:** Documentation consolidation  
**Scope:** docs/_archive → REF_*, logs/reviews

---

## Purpose

All historical documentation in `docs/_archive/` was reviewed for added value. That value has been moved into REF documents or this log. Archive files were then removed so that a single source of truth lives in REF_* and logs.

---

## Where value went

| Former _archive content | Destination |
|------------------------|-------------|
| **Architecture / structure** | REF_13_ARCH (directory structure, layering, boundaries). Current layout: `compiler/`, `runtime/executors/`, `common/`, root API. |
| **API / quick usage** | REF_15_API (public API, quick usage examples). |
| **Operations list (57 registered, 84 total)** | REF_15_API and REF_22_PROJECT (executor strategy). Operation categories: core, filtering, aggregation, projection, ordering, graph, data, array, advanced. |
| **Phase roadmap (Phase 0–3)** | Below (Phase history). REF_22_PROJECT holds current milestones (M1–M4). |
| **Grammar integration (xwsyntax, 30+ formats, 94% reduction)** | Below (Grammar integration). |
| **Executor / structure refactor history** | Below (Executor evolution). REF_13_ARCH and REF_22_PROJECT describe current executor layout and stability. |
| **Test layers and coverage narrative** | REF_51_TEST (layers, runner). Historical “72 tests, cross-format” narrative captured below. |
| **Console / demo usage** | REF_15_API quick usage; GUIDE_01_USAGE for usage. |
| **Performance / optimization notes** | REF_22 (non-functional requirements), REF_13 (layering). |

---

## Phase history (from archive)

- **Phase 0 (Experimental, Q4 2025):** Core engine, 50 operations, 35+ format converters, type-aware execution, capability checking, operation registry. Success: engine runs on xwnode structures; format conversion between major formats.
- **Phase 1 (Production ready, Q1 2026):** Stabilize API, performance optimization, error handling, logging, 95%+ test coverage.
- **Phase 2 (Query optimization, Q2 2026):** Query planning, cost-based execution, caching.
- **Phase 3 (Distributed, Q3 2026):** Distributed execution (future).

Current project milestones are in REF_22_PROJECT (M1–M4); executor refactor and doc alignment (M3) in progress.

---

## Grammar integration (from archive)

- **xwsyntax integration (Oct 2025):** 30+ grammars migrated to xwsyntax; ~94% code reduction in xwquery; 33 bidirectional pairs (66 grammar files). Universal adapter; format converters; operation detection; template engine.
- **Bidirectional status (historical):** 17/31 formats working (55%); JSON bidirectional; SQL parse+generate; 15 formats parse-only. Current format support is documented in REF_22 and code (FormatType, strategies).
- **Grammar system:** SQL, XPath, Cypher, XWQueryScript and other grammars; AST → QueryAction; Lark-based parsing. Current layout: `compiler/` (parsers, strategies, adapters, generators), `grammars/` (e.g. reql, rql .lark).

---

## Executor evolution (from archive)

- **Layout evolution:** Earlier docs referenced `executors/` at package root or `query/executors/`. Current layout: **`runtime/executors/`** with subpackages: core, aggregation, filtering, data, graph, array, ordering, projection, advanced. Engine and capability checker in `runtime/executors/`; registry and contracts there.
- **Operation counts (historical):** 57 registered operations; 84 total (57 registered + 27 unregistered). Categories: CORE 6, FILTERING 10, AGGREGATION 9, PROJECTION 2, ORDERING 3, GRAPH 31 (5 reg + 26), DATA 4, ARRAY 2, ADVANCED 17.
- **Stability:** Public contract = engine + capability checker + parse/plan/execute. Internal executor paths may change; tests and docs follow current layout (REF_22, REF_13).

---

## Test coverage narrative (from archive)

- **Historical:** Suite grew from ~10 to 72+ tests: cross-format compatibility, format parsing (SQL, GraphQL, Cypher, SPARQL, Gremlin, MongoDB, etc.), QueryAction tree consistency, format-agnostic execution. 4-layer layout: 0.core, 1.unit, 2.integration, 3.advance; strategy tests under `tests/strategies/`.
- **Current:** REF_51_TEST documents layers, runner (`python tests/runner.py`, `--core`, `--unit`, `--integration`), and that executor tests use `runtime/executors/`.

---

## Archive files removed (2026-02-08)

The following were in `docs/_archive/` and have been removed after value extraction. Value is in REF_*, this review, or logs.

**Reference / architecture:** ARCHITECTURE.md, OPERATIONS_REFERENCE.md, QUICK_REFERENCE.md, XWQUERY_REFERENCE.md, PROJECT_PHASES.md.

**Phase / status:** PHASE1_*.md, PHASE_2_*.md, PHASE_3_*.md, FINAL_STATUS*.md, FINAL_STRUCTURE_COMPLETE.md, FINAL_IMPLEMENTATION_SUCCESS.md, NEXT_STEPS.md, STATUS_VISUAL.md.

**Grammar / integration:** GRAMMAR_*.md, ALL_GRAMMARS_*.md, XWQUERY_GRAMMARS_COMPLETE.md, XWQUERYSCRIPT_GRAMMAR_COMPLETE.md, *INTEGRATION*.md, *XWSYNTAX*.md, BIDIRECTIONAL_GRAMMARS_*.md, SQL_GRAMMAR_*.md, COMPREHENSIVE_IMPLEMENTATION_SUMMARY.md, GRAMMAR_SYSTEM_FINAL_SUMMARY.md.

**Executor / refactor:** EXECUTOR_REFACTORING_COMPLETE.md, REFACTORING_*.md, STRUCTURE_REFACTORING_COMPLETE.md, REUSE_VERIFICATION.md, PROPER_REUSE_*.md, ORDER_BY_LIMIT_FIX_COMPLETE.md, ALL_57_OPERATIONS_COMPLETE.md, GUIDELINES_*.md, CONSOLE_AND_TESTS_COMPLETE.md, CONSOLE_QUICK_REFERENCE.md, DEMO_*.md.

**Tests / coverage:** TEST_COVERAGE_COMPLETE.md, OPERATION_TEST_RESULTS.md, GRAMMAR_TEST_*.md.

**Optimization / performance:** PERFORMANCE_OPTIMIZATIONS.md, OPTIMIZATION_*.md, QUERY_OPTIMIZATION.md, JSON_SERIALIZER_OPTIMIZATION.md, XWSYSTEM_*.md, COMMON_*.md, MONACO_SUPPORT_ADDED.md.

**Other:** STRATEGY_*.md, ELIMINATE_*.md, CLEANUP_SUMMARY.md, QUERY_ACTION_AS_PARSE_NODE_ARCHITECTURE.md, SYNTAX_ENGINE_*.md, UNIVERSAL_CONVERTER_QUICKSTART.md, XWNODE_*.md, XWSTORAGE_*.md, WORKING_QUERIES.md, COPY_PASTE_QUERIES.md, COMPLEX_QUERIES_TO_TRY.md, GITHUB_SETUP.md, P3_OPERATIONS_PROGRESS.md, XWSYNTAX_MAXIMUM_REUSE_COMPLETE.md, REFACTORING_FEEDBACK.md, runner_out.md.

**README:** _archive/README.md replaced with a short pointer to this review and REF_*.

---

## Standards

- **Single source of truth:** Architecture and API → REF_13_ARCH, REF_15_API. Project vision and milestones → REF_22_PROJECT. Test → REF_51_TEST. Review status → REF_35_REVIEW and logs/reviews/.
- **Historical narrative:** Phase, grammar, and executor history are summarized above and in REF_22; no need to keep duplicate archive files.

---

*Per GUIDE_35_REVIEW. Consolidation completed 2026-02-08.*

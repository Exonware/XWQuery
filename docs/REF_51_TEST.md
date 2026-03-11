# xwquery — Test Status and Coverage (REF_51_TEST)

**Last Updated:** 08-Feb-2026  
**Producing guide:** GUIDE_51_TEST  
**Requirements source:** [REF_01_REQ.md](REF_01_REQ.md)

Test status and coverage for xwquery. Key code paths per REF_14_DX (execute, convert, parse) covered in 0.core. Evidence: repo `tests/`, `docs/logs/`. Legacy: `_archive/` (OPERATION_TEST_RESULTS, GRAMMAR_TEST_RESULTS, TEST_COVERAGE_COMPLETE, etc.).

---

## Test layers

| Layer | Path | Purpose |
|-------|------|---------|
| **0.core** | `tests/0.core/` | Core behavior: executor wiring, graph/phase2/phase3 executors, order/limit, refactoring |
| **1.unit** | `tests/1.unit/` | Unit tests: grammars, parsing, console, SQL, script |
| **2.integration** | `tests/2.integration/` | Integration tests across components |
| **3.advance** | `tests/3.advance/` | Advanced scenarios and stress |

Strategy tests live under **`tests/strategies/`** (e.g. CQL, Cypher, Datalog, GraphQL, SQL, xwnode_executor). They exercise format-specific parsing and generation; imports use `runtime/executors/` where needed.

---

## Running tests

- **All layers (default):**  
  `python tests/runner.py`  
  Runs 0.core → 1.unit → 2.integration in sequence; writes `tests/runner_out.md`.

- **By layer:**  
  - Core only: `python tests/runner.py --core`  
  - Unit only: `python tests/runner.py --unit`  
  - Integration only: `python tests/runner.py --integration`  

Runner uses sub-runners when present (e.g. `tests/0.core/runner.py`) or falls back to pytest on the layer directory.

- **Direct pytest:**  
  From repo root (with `src` on `PYTHONPATH`):  
  `pytest tests/0.core -v --tb=short`  
  (Similarly for `tests/1.unit`, `tests/2.integration`, `tests/strategies`.)

---

## Executor layout and tests

All executor references in tests use the **current** layout: `exonware.xwquery.runtime.executors` and subpackages (`core`, `aggregation`, `filtering`, `data`, `graph`, `array`, `ordering`, `projection`, `advanced`). No imports from removed top-level or legacy `executors/` paths.

---

*Per GUIDE_00_MASTER and GUIDE_51_TEST.*

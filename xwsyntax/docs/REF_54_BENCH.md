# xwsyntax — Benchmarks (REF_54_BENCH)

**Last Updated:** 08-Feb-2026  
**Producing guide:** GUIDE_54_BENCH

Short reference for benchmark artifacts. No SLAs defined.

---

## Location and contents

| Path | Purpose |
|------|---------|
| `benchmarks/ast_strategy_benchmark.py` | AST optimization strategy benchmarks. |
| `benchmarks/benchmark_bidirectional.py` | Bidirectional parse/generate performance. |

---

## Relation to tests

Advance-layer **performance** tests live under `tests/3.advance/` (e.g. `test_performance.py`). The scripts in `benchmarks/` are standalone runners for ad-hoc or CI performance checks; they are not part of the 4-layer test runner.

---

*Per GUIDE_00_MASTER and GUIDE_54_BENCH.*

# Benchmark reference — xwlazy

**Last Updated:** 07-Feb-2026  
**Owner:** GUIDE_54_BENCH  
**Requirements source:** [REF_01_REQ.md](REF_01_REQ.md) sec. 8 (performance)

Performance SLAs, competition summary, and links to benchmark evidence.

---

## Performance SLAs (targets)

| Scenario | Target | Notes |
|----------|--------|------|
| Successful import overhead | < 1 ms | Hooks only trigger on failure |
| First failure (discovery + policy) | ~50 ms | Cached discovery ~5 ms thereafter |
| Selective import (modular) | < 30 ms mean | 20.9% faster than full import when applicable |
| Component creation | < 0.1 ms | Per-operation ~0.3 μs |

---

## Competition summary

xwlazy is benchmarked against 8 lazy-import libraries. It provides **7+ enterprise features** (auto-install, per-package isolation, security policies, SBOM, lockfile, performance monitoring, two-stage loading) while remaining competitive on speed.

- **Light load:** xwlazy ranks 2nd (0.65 ms) in warm/pre-installed; lazi leads at 0.32 ms.
- **Medium / heavy / enterprise:** xwlazy has multiple first-place wins in LITE and SMART modes (see [logs/benchmarks/](logs/benchmarks/)).
- **Fastest mode overall (benchmark):** `cached + full` @ light_load: 1.482 ms.
- **Modular vs monolithic:** Current modular structure is more efficient (largest file 77% smaller, selective import 20.9% faster).

---

## Benchmark evidence

- **Index:** [logs/benchmarks/INDEX.md](logs/benchmarks/INDEX.md)
- **Summaries:** [BENCHMARK_SUMMARY](logs/benchmarks/BENCHMARK_SUMMARY.md), [COMPETITION_SUMMARY](logs/benchmarks/COMPETITION_SUMMARY.md), [BENCHMARK_WINS_SUMMARY](logs/benchmarks/BENCHMARK_WINS_SUMMARY.md)
- **Runs:** All `BENCH_*.md` under [logs/benchmarks/](logs/benchmarks/)

---

## Key findings (captured from previous analysis docs)

- **Modular structure:** 49 focused modules; largest file 1,052 lines (vs 4,529 monolith); selective import 29.5 ms mean (20.9% faster than full).
- **Memory:** Peak ~0.89 MB for component footprint; warm import ~35 MB with features enabled.
- **Competition:** Feature matrix and improvement recommendations are in [logs/benchmarks/](logs/benchmarks/); PERFORMANCE_ANALYSIS recommendations (light/medium/heavy targets) retained in run reports.
- **Fastest modes by load:** Light — cached+full; Medium — preload+none; Heavy — background+clean; see FASTEST_MODE_ANALYSIS content in logs/benchmarks summaries.

---

*Per GUIDE_54_BENCH. For run-by-run evidence see [logs/benchmarks/INDEX.md](logs/benchmarks/INDEX.md).*

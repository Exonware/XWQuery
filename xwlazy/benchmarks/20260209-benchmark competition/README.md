# 20260209 — Benchmark: xwlazy vs Lazy-Import Libraries ⚔️

**Campaign:** xwlazy vs competing lazy-import libraries  
**Date:** 09-Feb-2026 (updated 10-Feb-2026)  
**Project:** exonware/xwlazy  
**Guide:** [GUIDE_54_BENCH.md](../../../../docs/guides/GUIDE_54_BENCH.md)

---

## Goal 🎯

Compare **xwlazy** against popular lazy-import libraries to see **who is fastest and most capable** under realistic import workloads, and to validate xwlazy’s two-dimensional mode system (load mode × install mode).

---

## Description 📚

This campaign reuses the legacy competition harness under `benchmarks/competition_tests/` to benchmark:

- **Libraries:** `xwlazy`, `pipimport`, `deferred-import`, `lazy-loader`, `lazy-imports`, `lazy_import`, `pylazyimports`, `lazi`, `lazy-imports-lite`
- **Scenarios:** light / medium / heavy / enterprise import loads
- **xwlazy modes:** LITE, SMART, CLEAN, PRELOAD, BACKGROUND, AUTO, FULL, and full-features combinations
- **Install behavior:** most competitors either **assume `import_name == pip_name`** (e.g. `pipimport`) or require **manual per-import overrides** (e.g. `deferred-import(package='attrs')` for `import attr`), while **xwlazy uses a curated mapping file (`xwlazy_external_libs.toml`) and project overrides** so cases like `bs4` → `beautifulsoup4` or `yaml` → `PyYAML` work out of the box.
- **Optional mixins:** xwlazy can optionally provide a per-call wrapper API, AST lazy, and type-stub tooling (env-gated, off by default); we recommend against enabling them—see the main [README](../../README.md) and the feature matrix below.

It measures:

- Import time (cold and warm)
- Memory usage
- Mode-specific wins (which xwlazy mode is fastest per load level)

Results feed into BENCH_* reports (competition summaries and “wins” summaries) under this campaign’s `benchmarks/` folder and can be compared against any SLAs defined in [REF_54_BENCH](../../../docs/REF_54_BENCH.md).

---

## Metrics 📏

- **Import time:** ms per scenario (min / mean / median as reported by the harness)
- **Throughput:** derived ops/sec where applicable
- **Memory:** peak / average memory per run
- **Wins:** which library/mode is first, second, third in each category

---

## Library Feature Comparison (vs xwlazy) 🔍

Quick feature matrix (✅ = supported / built‑in, **✅ (opt)** = optional and off by default in xwlazy, empty = not a focus of that library):

| Library | Auto‑install | Lazy import | Global import hook | Per‑call wrapper API | AST rewrite | Mapping‑aware install | Pyproject / build integration | Import tracing / debug | Type‑stub / internal API tooling | Per‑package isolation | Lockfile / SBOM | PEP 668‑aware | Ignore‑list cache | Tiny one‑liner API |
|--------|-------------|------------|--------------------|----------------------|------------|-----------------------|------------------------------|------------------------|-----------------------------------|----------------------|-----------------|--------------|-------------------|--------------------|
| **xwlazy** | ✅ | ✅ | ✅ | ✅ (opt) | ✅ (opt) | ✅ | ✅ | ✅ | ✅ (opt) | ✅ | ✅ | ✅ | ✅ | ✅ |
| **pipimport** | ✅ |  | ✅ |  |  |  |  |  |  |  |  |  | ✅ | ✅ |
| **deferred-import** | ✅ | ✅ |  | ✅ |  |  |  |  |  |  |  |  |  | ✅ |
| **lazy-loader** |  | ✅ |  |  |  |  |  |  | ✅ |  |  |  |  |  |
| **lazy-imports** |  | ✅ | ✅ |  |  |  |  |  |  |  |  |  |  |  |
| **lazy_import** |  | ✅ |  | ✅ |  |  |  |  |  |  |  |  |  |  |
| **pylazyimports** |  | ✅ |  | ✅ |  |  | ✅ |  |  |  |  |  |  |  |
| **lazi** |  | ✅ | ✅ |  |  |  |  | ✅ |  |  |  |  |  |  |
| **lazy-imports-lite** |  | ✅ |  |  | ✅ |  | ✅ |  |  |  |  |  |  |  |

**xwlazy (opt):** Per‑call wrapper API, AST rewrite, and type‑stub tooling are available via env vars (`XWLAZY_PER_CALL_API=1`, `XWLAZY_AST_LAZY=1`, `XWLAZY_TYPING_TOOLS=1`) but **disabled by default**. We recommend against enabling them from a software engineering perspective; prefer the core `hook` / `auto_enable_lazy` / `attach` API.

So this benchmark compares **xwlazy’s richer install/mode system and mapping‑aware behavior** (plus isolation and audit features) against libraries that are often simpler or specialized in different directions (AST rewriting, deep pyproject integration, or heavy import tracing), and that generally **do not provide the same automatic install + policy features**.

---

## Structure 🗂️

- **scripts/** — `run_competition_benchmarks.py` (wrapper that runs `competition_tests/benchmark_competition.py` and syncs outputs into this campaign).
- **data/** — `BENCH_*.json` and other raw outputs copied from `competition_tests/output_log/`.
- **benchmarks/** — BENCH_* reports, `INDEX.md`, `BENCHMARK_SUMMARY.md`, `BENCHMARK_WINS_SUMMARY.md`, `COMPETITION_SUMMARY.md`.

---

## How to Run ▶️

From **xwlazy** project root:

```bash
# 1) Install competition harness dependencies (once)
pip install -r benchmarks/competition_tests/requirements.txt

# 2) Run full competition (all libraries, all tests)
python "benchmarks/20260209-benchmark competition/scripts/run_competition_benchmarks.py"

# 3) Optional: limit libraries or tests
python "benchmarks/20260209-benchmark competition/scripts/run_competition_benchmarks.py" --library xwlazy --test medium_load
python "benchmarks/20260209-benchmark competition/scripts/run_competition_benchmarks.py" --library all --test light_load
```

The wrapper:

1. Calls `benchmarks/competition_tests/benchmark_competition.py`.  
2. Detects new `BENCH_*.md` / `BENCH_*.json` in `competition_tests/output_log/`.  
3. Copies Markdown reports into this campaign’s `benchmarks/` and JSON into `data/`.

---

## Results 📊

**Latest competition (2026-02-10, `BENCH_20260210_2011_COMPETITION`, AUTO mode, standard tests):**

| Load level      | xwlazy (ms)          | Best other library (ms)         |
|-----------------|----------------------|---------------------------------|
| `light_load`    | 2.15                 | lazy-imports-lite — 0.73        |
| `medium_load`   | **4.06 (fastest)**   | lazy-imports-lite — 4.54        |
| `heavy_load`    | 14.46                | pylazyimports — 13.70           |
| `enterprise_load` | 41.37             | pylazyimports — 34.60           |

- Full per-library results and rankings: see `benchmarks/BENCH_20260210_2011_COMPETITION.md`.
- Aggregated multi-mode rankings and wins (including earlier campaigns): see `benchmarks/BENCHMARK_SUMMARY.md`, `benchmarks/BENCHMARK_WINS_SUMMARY.md`, and `benchmarks/COMPETITION_SUMMARY.md`.
- Raw JSON data for plotting or regression checks: `data/BENCH_*.json`.

---

## Conclusion / Recommendations ✅

From the latest competition:

- **Production (deps pre-installed):**  
  Use **`mode="lite"`** to get top-tier lazy-import performance with minimal overhead.
- **Development / CI (on-demand installs):**  
  Use **`mode="smart"`** so missing imports are installed lazily while staying competitive or leading on medium/heavy loads.
- **Temporary or cleanup-focused runs:**  
  Use **`mode="clean"`** (install + auto-uninstall) or a **PRELOAD/BACKGROUND** load mode for heavy workloads where setup/teardown and responsiveness matter.
- **Pure library-speed comparisons:**  
  Other libraries (e.g. **lazi**) can be marginally faster on some micro-benchmarks, but they **lack xwlazy’s two-dimensional mode system, per-package isolation, and audit features**. For real projects, xwlazy is the recommended choice when you need both speed and control.

Future runs of this campaign should update:

- The “Latest competition” date and bullet summary above.  
- Links to the primary BENCH_* report and any notable JSON result files in `data/`.

---

## Related

- [GUIDE_54_BENCH.md](../../../../docs/guides/GUIDE_54_BENCH.md) — Benchmarking guide (structure, running, documentation, SLAs)  
- [REF_54_BENCH.md](../../../docs/REF_54_BENCH.md) — Performance SLAs and NFRs for xwlazy (if defined)  
- [../INDEX.md](../INDEX.md) — Benchmarks index for xwlazy


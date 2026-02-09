# Test status — xwlazy

**Last Updated:** 07-Feb-2026  
**Requirements source:** [REF_01_REQ.md](REF_01_REQ.md) sec. 8–9, [REF_22_PROJECT.md](REF_22_PROJECT.md)  
**Owner:** GUIDE_51_TEST

Test layers: 0.core, 1.unit, 2.integration (and 3.advance as applicable). Runner writes summaries to [logs/tests/](logs/tests/).

## Requirements traceability (REF_01_REQ)

| REF_01_REQ area | Test layer | Coverage |
|-----------------|------------|----------|
| One-line enable; minimal DX | 0.core, 1.unit | `test_one_line_api.py`, `test_core_hooking.py` — one-line enable, hook install |
| [lazy] extra auto-enable | 1.unit | `test_keyword_detection.py` — keyword/metadata-based enable |
| Missing import → install (no crash) | 2.integration | `test_missing_package_auto_install.py`, `test_strategy_integration.py` — auto-install on missing import |
| Reliable run; virtual + normal env | 2.integration, 3.advance | `test_installer_cache_integration.py`, `test_production_scenarios.py` |
| Zero delay when no error; performance | 0.core/benchmarks, 3.advance | `test_mode_performance.py`, `test_performance_regression.py` |
| Security / allow-deny (internal) | 3.advance | `test_security.py` |

Source: [REF_01_REQ.md](REF_01_REQ.md). Plan: [logs/reviews/REVIEW_20260207_REQ_REFLECTION_AND_PLAN.md](logs/reviews/REVIEW_20260207_REQ_REFLECTION_AND_PLAN.md).

## Status

- **Core tests:** Passing (import hook, one-line API, package registration).
- **Known:** Some tests may need environment adjustments; global hook can interfere with pytest — skips in place for test/debugging modules.
- **Evidence:** [logs/tests/INDEX.md](logs/tests/INDEX.md) — TEST_* run summaries.

## Test run evidence

See [logs/tests/INDEX.md](logs/tests/INDEX.md) for TEST_YYYYMMDD_HHMM_*.md listings.

---

## Running tests

```bash
python tests/runner.py
```

(Use `--core`, `--unit`, `--integration`, `--advance` if the runner supports layer flags.)

---

*Per GUIDE_51_TEST.*

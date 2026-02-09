# QA reference — xwlazy

**Last Updated:** 07-Feb-2026  
**Owner:** GUIDE_50_QA  
**Requirements source:** [REF_01_REQ.md](REF_01_REQ.md) sec. 8 (Five Priorities)

Quality gates and release readiness. Current phase: **Beta**.

## Release readiness (Stable gate)

Before promoting to Stable:

- **Tests:** All layers (0.core, 1.unit, 2.integration, 3.advance) passing; see [REF_51_TEST.md](REF_51_TEST.md) and [logs/tests/](logs/tests/).
- **Coverage:** Target > 95%; no critical bugs or security issues.
- **API:** Public APIs documented; breaking changes and deprecations documented; backward compatibility verified.
- **Docs:** README, REF_*, GUIDE_01_USAGE, REF_54_BENCH up to date; changelog updated.
- **Benchmarks:** Runs in [logs/benchmarks/](logs/benchmarks/); SLAs in [REF_54_BENCH.md](REF_54_BENCH.md).
- **Cross-platform:** Windows, Linux, macOS; Python 3.12+.

## Resolved issues (historical)

Critical and high-priority issues (duplicate imports, cache validation, file mtime tracking, exception handling) were resolved 2025-11-22; see [docs/changes/](changes/) for CHANGE_* evidence.

---

*Per GUIDE_50_QA. For test evidence see [logs/tests/INDEX.md](logs/tests/INDEX.md).*

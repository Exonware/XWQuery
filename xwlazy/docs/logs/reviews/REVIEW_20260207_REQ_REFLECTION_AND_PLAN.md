# Review: REF_01_REQ reflection in code, tests, docs — xwlazy

**Date:** 20260207  
**Artifact type:** Project/Requirements (reflection)  
**Scope:** xwlazy REF_01_REQ.md vs code (src/), tests (0.core–3.advance), docs (REF_*, GUIDE_*, changes/)  
**Methodology:** GUIDE_35_REVIEW; PROMPT_01_REQ_02_REVIEW  
**Output:** Review (six categories) + implementation plan to make REF_01_REQ real.

---

## Summary

**Pass with comments.** REF_01_REQ is largely reflected in behavior (one-line enable, lazy install, TOML-based config, 4-layer tests). **Gaps:** (1) REF_01_REQ says zero dependencies and TOML read-only; code has optional `tomli` for Python &lt; 3.11 and writes TOML (SBOM, lockfile). (2) REF_22_PROJECT and REF_13_ARCH use pre-sponsor wording and describe a multi-file architecture; REF_01_REQ and actual code are single-file, simple-yet-powerful. (3) Public API exposes more than “enable, disable, config.” Implementation plan below closes these gaps.

---

## 1. Critical issues

| Finding | REF_01_REQ | Current state | Action |
|--------|------------|---------------|--------|
| **Dependencies** | “Zero dependencies: only native Python standard library. No external packages. TOML: built-in reading only (no writing).” | `pyproject.toml`: `tomli>=2.0.1` for Python &lt; 3.11. Code uses `tomllib` on 3.11+ and `tomli` on &lt; 3.11. TOML is written for SBOM and lockfile. | Plan: Document or resolve (see Implementation plan). |
| **TOML writing** | “TOML: built-in reading only (no writing).” | `_write_toml_simple()`, `generate_sbom()`, `save_lockfile()` write TOML. | Plan: Either update REF_01_REQ to allow “minimal writing (SBOM, lockfile)” or provide read-only mode and document. |

No blocking correctness or safety issues; behavior matches sponsor intent (reliable run, auto-install, [lazy] extra). Gaps are requirements vs. declared constraints.

---

## 2. Improvements

| Finding | Recommendation |
|--------|-----------------|
| **REF_22_PROJECT wording** | Vision and goals use “enterprise security,” “strategy/template patterns,” “REF_* and strategy/template patterns.” REF_01_REQ sponsor: “simple yet powerful,” “one file,” “zero deps,” “only critical/famous libs.” Align REF_22 vision and goals with REF_01_REQ (sponsor voice). |
| **REF_13_ARCH structure** | REF_13_ARCH describes a “4-File Structure” (contracts, errors, base, core). Actual implementation is **single file** `src/exonware/xwlazy.py` (~2546 lines). Update REF_13_ARCH to describe the current single-file architecture and facade; keep strategy/pattern concepts but match the as-built layout. |
| **Public API surface** | REF_01_REQ: “Only expose what’s useful for users (enable, disable, config). Do not expose internal implementation.” Current `__all__` exposes many symbols (e.g. `get_all_stats`, `get_cache_stats`, `clear_cache`, `enable_learning`, `predict_next_imports`). Recommend: (a) document “minimal API” (e.g. `auto_enable_lazy`, `hook`, config) vs “advanced API” (stats, cache, learning), or (b) narrow public API and move advanced features behind a single “config” or “advanced” namespace. |

---

## 3. Optimizations

| Finding | Recommendation |
|--------|-----------------|
| **Legacy `_old/` tree** | `src/_old/` contains a multi-module layout. Confirm it is not shipped in the wheel (pyproject `packages = ["src/exonware", "src/xwlazy"]` excludes `_old`). If kept for reference, add a one-line note in REF_13_ARCH or README. |
| **Duplicate entry points** | `src/exonware/xwlazy.py` (main) and `src/xwlazy.py` (convenience re-export). Align with “single file” by documenting that the single implementation file is `exonware/xwlazy.py` and `xwlazy` is the alias. |

---

## 4. Missing features / alignment

| Gap | REF_01_REQ | Code/Tests/Docs |
|-----|-------------|------------------|
| **Single file, ~3000 lines** | Out of scope: “more than one file.” In scope: “single file, ~3000 lines maximum.” | Main file `exonware/xwlazy.py` is ~2546 lines (within limit). `version.py`, `xwlazy_external_libs.toml`, and wrapper exist; REF_01_REQ implies one main implementation file—**aligned** with intent. |
| **[lazy] extra auto-enable** | “When installing the library, users add brackets [lazy] and it automatically enables xwlazy.” | Keyword-based detection and `[lazy]` are documented and implemented; tests in 1.unit (e.g. `test_keyword_detection.py`, `test_one_line_api.py`). **Aligned.** |
| **Tests for REF_01_REQ** | “Testing is huge—unit, integration, all testing the guide requires.” | 4-layer structure (0.core, 1.unit, 2.integration, 3.advance) present. Add optional test(s) or docstrings that reference REF_01_REQ (e.g. “Requirement: one-line enable”) for traceability. |
| **Zero overhead when no error** | “Expect zero delay: xwlazy not executed unless there’s an import error.” | Implementation uses import hook that triggers on missing imports; successful imports are not wrapped. Benchmarks in REF_54_BENCH / 0.core/benchmarks. **Aligned.** |

---

## 5. Compliance & standards

| Check | Status |
|-------|--------|
| GUIDE_00_MASTER (Five Priorities, docs under `docs/`, REF/LOG) | Compliant. |
| GUIDE_01_REQ (REF_01_REQ as single source, clarity 14/14) | Compliant. |
| REF_22_PROJECT references REF_01_REQ | Yes. Content alignment: update REF_22 to sponsor voice (see Improvements). |
| REF_13_ARCH matches as-built architecture | No. Update to single-file + facade (see Improvements). |

---

## 6. Traceability

| Link | Status |
|------|--------|
| REF_01_REQ → REF_22_PROJECT, REF_12_IDEA, REF_13_ARCH | Stated in REF_01_REQ. |
| REF_22_PROJECT → REF_01_REQ | Present. |
| Code/tests to requirements | No requirement IDs in code. Optional: add a short “Requirements” subsection in REF_51_TEST or REF_22 linking test layers to REF_01_REQ sections. |

---

# Implementation plan

**Goal:** Make REF_01_REQ real in code, tests, and docs by closing the gaps above.

## Priority 1 — Documentation and requirements alignment (no code break)

| # | Action | Owner / next step |
|---|--------|--------------------|
| P1.1 | **Update REF_22_PROJECT** vision and goals to match REF_01_REQ sponsor wording: “simple yet powerful,” “one file,” “zero deps (stdlib only),” “only critical/famous libs,” “[lazy] extra auto-enable.” Keep FR table and milestones; adjust narrative. | Doc owner |
| P1.2 | **Update REF_13_ARCH** to describe current **single-file** architecture: main implementation in `exonware/xwlazy.py` (~2546 lines), facade-style API, use of TOML for config and external libs. Optionally retain “conceptual” strategy/pattern description without the 4-file layout. | Doc owner |
| P1.3 | **Clarify REF_01_REQ or dependencies** (choose one): (a) In REF_01_REQ section 2, add: “Python 3.11+: stdlib only (tomllib). Python &lt; 3.11: optional tomli for TOML reading; otherwise keep zero optional deps for 3.11+.” Or (b) Make tomli optional/extra so that default install on 3.11+ has zero deps; document in README/pyproject. | Requirements or packaging owner |
| P1.4 | **Clarify TOML writing in REF_01_REQ** (choose one): (a) In REF_01_REQ section 2 (Dependencies) or 7 (Architecture), allow “minimal TOML writing for SBOM and lockfile only.” Or (b) Keep “reading only” and add a note that SBOM/lockfile are optional features that may write TOML; document in REF_22 or REF_13. | Requirements owner |

## Priority 2 — Public API and packaging

| # | Action | Owner / next step |
|---|--------|--------------------|
| P2.1 | **Document public API tiers** in REF_13_ARCH or GUIDE_01_USAGE: “Minimal API” (e.g. `auto_enable_lazy`, `hook`, `attach`) vs “Advanced/Config API” (stats, cache, performance, learning, watched prefixes). REF_01_REQ “enable, disable, config” then maps to these tiers. | Doc owner |
| P2.2 | **(Optional)** Narrow `__all__` to minimal + config-only symbols and expose the rest via a single `xwlazy.advanced` or `xwlazy.stats` sub-namespace to satisfy “do not expose internal implementation.” Defer if current API is intentional for power users. | Code owner |

## Priority 3 — Tests and traceability

| # | Action | Owner / next step |
|---|--------|--------------------|
| P3.1 | Add a **short “Requirements traceability”** subsection in REF_51_TEST or in a test README: which test layers (0–3) cover which REF_01_REQ areas (e.g. one-line enable, [lazy] extra, missing-package install, no crash). | Test owner |
| P3.2 | **(Optional)** Add a single test or test module that explicitly asserts REF_01_REQ behavior (e.g. “one-line enable leaves normal imports unchanged”; “missing import triggers install path”) and reference REF_01_REQ in the docstring. | Test owner |

## Priority 4 — Cleanup and housekeeping

| # | Action | Owner / next step |
|---|--------|--------------------|
| P4.1 | Confirm **`_old/` is not packaged** (pyproject already excludes it). If needed, add one sentence in REF_13_ARCH or README: “Legacy multi-file layout is preserved in `src/_old/` for reference only and is not shipped.” | Doc owner |
| P4.2 | **Update REF_35_REVIEW** (or project review summary) to note this reflection review and the implementation plan (this file). | Review owner |

---

## Suggested execution order

1. **P1.1, P1.2** — Align REF_22 and REF_13_ARCH with REF_01_REQ and as-built architecture.  
2. **P1.3, P1.4** — Resolve “zero deps” and “TOML read-only” vs current behavior (doc or dependency change).  
3. **P2.1** — Document API tiers (no code change).  
4. **P3.1** — Add requirements traceability in tests docs.  
5. **P4.1, P4.2** — Confirm _old/ and update review summary.  
6. **P2.2, P3.2** — Optional API narrowing and explicit requirement tests when prioritised.

---

*Produced per PROMPT_01_REQ_02_REVIEW and GUIDE_35_REVIEW. Full review: REF_01_REQ reflection in code, tests, docs. Plan: actionable items to make REF_01_REQ real.*

---

## Execution log (plan executed 07-Feb-2026)

| Item | Status |
|------|--------|
| P1.1 Update REF_22 vision/goals to REF_01_REQ sponsor wording | Done |
| P1.2 Update REF_13_ARCH: single-file architecture + _old/ note | Done |
| P1.3 Clarify REF_01_REQ dependencies (3.11+ stdlib; &lt;3.11 tomli) | Done |
| P1.4 Clarify REF_01_REQ TOML writing (SBOM/lockfile) | Done |
| P2.1 Document public API tiers in REF_13_ARCH | Done |
| P3.1 Add Requirements traceability in REF_51_TEST | Done |
| P4.1 Note _old/ not shipped (REF_13_ARCH + README) | Done |
| P4.2 Update REF_35_REVIEW with this review | Done (link already present) |
| P2.2 Narrow __all__ (optional) | Deferred |
| P3.2 Explicit REF_01_REQ test (optional) | Deferred |

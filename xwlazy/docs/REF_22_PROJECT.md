# Project Reference — xwlazy

**Library:** exonware-xwlazy  
**Last Updated:** 07-Feb-2026  
**Requirements source:** [REF_01_REQ.md](REF_01_REQ.md)  
**Producing guide:** [GUIDE_22_PROJECT.md](../../docs/guides/GUIDE_22_PROJECT.md)

Requirements and project status (output of GUIDE_22_PROJECT). Align with REF_01_REQ sec. 1–10.

---

## Scope and boundaries (REF_01_REQ sec. 2)

| In scope | Out of scope | Dependencies | Anti-goals |
|----------|--------------|--------------|------------|
| Full implementation for venv and normal (PC) environment; local TOML; requirements config; all existing features in project docs. | Complete Python rewrite; changing how Python runs; more than one file—keep simple, single file, ~3000 lines max. | Python 3.11+: stdlib only (tomllib). Python <3.11: optional tomli. Zero external deps by default. TOML: config/manifest; minimal writing for SBOM/lockfile. | No complex compiler; only critical/famous libs; no solving libs with similar names or not famous. |

---

## Vision

xwlazy makes development easier by **automatically installing missing libraries** and doing lazy loading—simple yet powerful. One file, one-line enable; no need to be an expert. Users add `[lazy]` when installing and xwlazy intervenes when imports are missing, installing in the background instead of throwing an error. Zero dependencies (stdlib only on Python 3.11+); only critical and famous libs supported (no complex compiler, no solving every custom lib). Per REF_01_REQ.

---

## Goals

1. **Reliable run:** Don't crash; run and install what's missing (the whole purpose). Per-package isolation so each package enables lazy independently; no interference.
2. **One file, minimal DX:** Single implementation file (~3000 lines max); one line to enable. Handle both virtual and normal (PC) environment. [lazy] extra auto-enables xwlazy.
3. **Extensible mapping:** TOML and requirements config so libraries map to what they originally are; users can change TOML for non-default libs.
4. **Security and ops when needed:** Allow/deny lists, SBOM, lockfile, PEP 668; managed internally; REF_* traceability (REF_12_IDEA, REF_13_ARCH).

---

## Success criteria (REF_01_REQ sec. 1)

- **6 mo / 1 yr:** Success when it silently installs the required library in the background and runs instead of throwing an error. First-time run performance is not the priority.

---

## Risks and assumptions (REF_01_REQ sec. 10)

- **Risks:** Infinite loop or circular installation; installing in the wrong environment. **Assumptions:** Users understand xwlazy won't install every custom library (Python allows multiple libs with same name). **Kill/pivot:** If Python adds lazy installation to the language (the correct way), we may not need this.

---

## Functional Requirements (Summary)

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-001 | Per-package lazy install enable/disable | High | Done |
| FR-002 | Two-stage loading (log on import, install on usage) | High | Done |
| FR-003 | Discovery from pyproject.toml, requirements.txt, manifest | High | Done |
| FR-004 | Installation modes (AUTO, INTERACTIVE, WARN, DISABLED, DRY_RUN) | High | Done |
| FR-005 | Security: allow/deny lists, index URL, trusted hosts | High | Done |
| FR-006 | SBOM generation, lockfile management | Medium | Done |
| FR-007 | Performance monitoring and statistics API | Medium | Done |
| FR-008 | Keyword-based auto-detection (e.g. `xwlazy-enabled`) | Medium | Done |
| FR-009 | Async installer queue, manifest/watched-prefix registry | Medium | Done |

---

## Non-Functional Requirements (5 Priorities)

1. **Security:** Managed internally; allow/deny when needed; PEP 668; no unsafe defaults.
2. **Usability:** One-line enable, docs enough to use; REF_13_ARCH and GUIDE_01_USAGE.
3. **Maintainability:** Single-file implementation, REF_* docs, 4-layer tests (see REF_51_TEST).
4. **Performance:** Zero delay when no import error; max 1% with lazy on/off; caching; REF_54_BENCH.
5. **Extensibility:** One file, simple, does the job; GUIDE_01_USAGE for hooks/extension; TOML config for mappings.

---

## Project Status Overview

- **Current phase:** Beta (High maturity).
- **Features:** Per-package lazy loading, auto-install, two-stage loading, security policies, SBOM, lockfiles, performance monitoring, keyword detection, async/manifest enhancements.
- **Docs:** REF_11_COMP, REF_12_IDEA, REF_13_ARCH, REF_14_DX, REF_15_API, REF_21_PLAN, REF_22_PROJECT (this file), REF_35_REVIEW, REF_50_QA, REF_54_BENCH, REF_51_TEST, GUIDE_01_USAGE; logs under `docs/logs/`.

---

## Milestones

| Milestone | Target | Status |
|-----------|--------|--------|
| M1 — Per-package isolation, discovery, install modes | v0.1.x | Done |
| M2 — Security (allow/deny, SBOM, lockfile, PEP 668) | v0.1.x | Done |
| M3 — REF_* and review compliance | v0.1.x | Done (REF_22_PROJECT added) |
| M4 — Extended production use → consider Stable | Future | Pending |

---

## Traceability

- **Requirements source:** [REF_01_REQ.md](REF_01_REQ.md) (single source of raw/refined requirements per GUIDE_01_REQ).
- **IDEA → Project → Arch:** [REF_12_IDEA.md](REF_12_IDEA.md) (ideas/future enhancements) → this document (vision, FR/NFR, milestones) → [REF_13_ARCH.md](REF_13_ARCH.md) (architecture).
- **DX:** [REF_14_DX.md](REF_14_DX.md) | **API:** [REF_15_API.md](REF_15_API.md) | **Planning:** [REF_21_PLAN.md](REF_21_PLAN.md).
- **Used by (optional):** Packages that enable xwlazy include [xwsystem](../../xwsystem/docs/INDEX.md), [xwnode](../../xwnode/docs/INDEX.md), [xwdata](../../xwdata/docs/INDEX.md) (REF_01_REQ + full REF set).
- **Review evidence:** [REF_35_REVIEW.md](REF_35_REVIEW.md), [docs/logs/reviews/REVIEW_20260207_PROJECT_STATUS.md](logs/reviews/REVIEW_20260207_PROJECT_STATUS.md), [docs/logs/reviews/REVIEW_20260207_REQUIREMENTS.md](logs/reviews/REVIEW_20260207_REQUIREMENTS.md), [docs/logs/reviews/REVIEW_20260207_REQ_REFLECTION_AND_PLAN.md](logs/reviews/REVIEW_20260207_REQ_REFLECTION_AND_PLAN.md).

---

*See GUIDE_22_PROJECT.md for requirements process. Updates: docs/logs/reviews/.*

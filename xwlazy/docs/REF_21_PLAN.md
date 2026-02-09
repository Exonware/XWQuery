# Planning Reference — xwlazy (REF_21_PLAN)

**Library:** exonware-xwlazy  
**Last Updated:** 07-Feb-2026  
**Requirements source:** [REF_01_REQ.md](REF_01_REQ.md) sec. 9  
**Producing guide:** [GUIDE_21_PLAN.md](../../docs/guides/GUIDE_21_PLAN.md)

---

## Purpose

Milestones and roadmap for xwlazy, filled from REF_01_REQ. Execution order and phase gates per GUIDE_21_PLAN.

---

## Milestones (from REF_01_REQ sec. 9)

| Milestone | Target | Definition of done | Status |
|-----------|--------|--------------------|--------|
| (1) xwlazy able to load libraries | v0.1.x | Load libraries; lazy loading working. | Done |
| (2) Able to lazy install | v0.1.x | On missing import, auto-install in background; run instead of throwing error. | Done |
| Production / never fails | Current | In production, used, never fails, passes every test where libraries are missing. | Target |

---

## Roadmap (from REF_01_REQ)

Both milestones done. Definition of done (first): in production, used, never fails, passes every test where libraries are missing. Fixed vs flexible: scope-driven; dates flexible. Rust later: different model (Python = script runtime, Rust = compiled).

---

## Traceability

- **Requirements:** [REF_01_REQ.md](REF_01_REQ.md)
- **Project status:** [REF_22_PROJECT.md](REF_22_PROJECT.md)
- **Idea:** [REF_12_IDEA.md](REF_12_IDEA.md) | **DX:** [REF_14_DX.md](REF_14_DX.md) | **API:** [REF_15_API.md](REF_15_API.md) | **Architecture:** [REF_13_ARCH.md](REF_13_ARCH.md)

---

*Per GUIDE_21_PLAN. See REF_01_REQ.md sec. 9 for fixed vs flexible.*

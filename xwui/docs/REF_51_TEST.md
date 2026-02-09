<!-- docs/REF_51_TEST.md (output of GUIDE_51_TEST) -->
# xwui — Test Status and Coverage

**Last Updated:** 09-Feb-2026

Test status and coverage (output of GUIDE_51_TEST). Evidence: repo `tests/` (where present), `examples/`, docs/logs/. Verification and compliance: _archive/reports/.

---

## Test strategy (xwui)

xwui is a **TypeScript/JS frontend** library. Test approach:

- **Layers:** No Python 4-layer (0.core, 1.unit, 2.integration, 3.advance); tests are **non-Python** (e.g. TS/JS unit, example-based, Storybook/Playwright where used). Per full review (08-Feb-2026), xwui is scored as partial tests (🟡).
- **Evidence:** Component demos and examples in `examples/`; any `tests/` or tooling under `tools/` (e.g. audit, compliance); logs under `docs/logs/`.
- **Alignment:** Requirements and parity are in [REF_22_PROJECT.md](REF_22_PROJECT.md); test strategy is consistent with the component set and Firebase frontend parity areas (Hosting, Auth UI, data UI, Functions/API) — coverage for those areas is tracked where TS/example tests exist.

---

## Cross-references

| Document | Purpose |
|----------|---------|
| [REF_22_PROJECT.md](REF_22_PROJECT.md) | Requirements, Firebase parity list |
| [REF_15_API.md](REF_15_API.md) | API reference |
| _archive/reports/ | Compliance and verification reports |

---

*Per GUIDE_00_MASTER and GUIDE_51_TEST.*

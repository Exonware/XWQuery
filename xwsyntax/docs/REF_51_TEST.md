# xwsyntax — Test Status and Coverage (REF_51_TEST)

**Last Updated:** 08-Feb-2026  
**Producing guide:** GUIDE_51_TEST  
**Requirements source:** [REF_01_REQ.md](REF_01_REQ.md)

Test status and coverage. Evidence: repo `tests/`, `docs/logs/`.

---

## Test layers

xwsyntax uses a 4-layer test layout per GUIDE_51_TEST. Each layer has its own `runner.py`; the main orchestrator is `tests/runner.py`.

| Layer | Path | Purpose |
|-------|------|---------|
| **0.core** | `tests/0.core/` | Fast, high-value checks (core bidirectional, import sanity, **REF_01/REF_14_DX key code** — test_import.py, test_core_bidirectional.py, test_core_facade.py, **test_ref01_key_code.py**). |
| **1.unit** | `tests/1.unit/` | Unit tests: engine, grammars, bidirectional, optimizations; facade and multiformat. |
| **2.integration** | `tests/2.integration/` | End-to-end and cross-component tests. |
| **3.advance** | `tests/3.advance/` | Performance, security, and other advance checks. |

Subpackages under `1.unit/`: `engine_tests/`, `grammars_tests/`, `bidirectional_tests/`, `optimizations_tests/`.

---

## Running tests

**Recommended:** run the main orchestrator from the repo root (with `src` on `PYTHONPATH` as needed):

```bash
python tests/runner.py
```

**By layer:**

```bash
python tests/runner.py --core         # Layer 0 only
python tests/runner.py --unit         # Layer 1 only
python tests/runner.py --integration # Layer 2 only
python tests/runner.py --advance     # Layer 3 only
```

**Advance subcategories** (forwarded to the advance runner when present):

```bash
python tests/runner.py --performance
python tests/runner.py --security
```

**Output:** Terminal (colored) and `tests/runner_out.md` (Markdown). Per-layer runners write their own `runner_out.md` under the layer directory.

---

## Evidence and logs

- **Test code:** `tests/` (0.core, 1.unit, 2.integration, 3.advance).
- **Runner output:** `tests/runner_out.md`, `tests/<layer>/runner_out.md`.
- **Review and run logs:** `docs/logs/` (reviews, test logs as per project convention).

---

## Standalone script at repo root

`test_grammars.py` at the repository root is a **standalone grammar check** (e.g. Python and Rust parsing). It is not part of the 4-layer suite. Prefer adding or running grammar checks under `tests/0.core/` or `tests/1.unit/grammars_tests/` so they are covered by the runner; if kept at root, treat it as an ad-hoc script rather than the primary test entry.

---

*Per GUIDE_00_MASTER and GUIDE_51_TEST.*

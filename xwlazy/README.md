# xwlazy

**Missing import? Install it on first use.** One line to enable; standard imports, no try/except. Per-package isolation—xwsystem can be lazy while xwnode stays normal.

[![Status](https://img.shields.io/badge/status-beta-blue.svg)](https://exonware.com)
[![Python](https://img.shields.io/badge/python-3.8%2B-blue.svg)](https://www.python.org)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

---

## Install

```bash
pip install exonware-xwlazy
# or
pip install xwlazy
```

---

## Quick start

**1. Enable for your package (one line in `__init__.py`):**

```python
from xwlazy.lazy import config_package_lazy_install_enabled

config_package_lazy_install_enabled("your-package")  # or __package__
```

**2. Use normal imports.** First time a dependency is missing, xwlazy installs it; after that it’s a normal import. No changes elsewhere in your code.

**Zero-code option:** add to `pyproject.toml`:

```toml
[project]
keywords = ["xwlazy-enabled"]
```

Then `pip install -e .` — xwlazy picks it up from metadata.

---

## What you get

| Thing | What it means |
|-------|----------------|
| **On-demand install** | Missing package → pip install when code first touches it. No manual install for optional features. |
| **Per-package** | Each package turns lazy on or off. xwsystem can be lazy, xwnode not—no cross-talk. |
| **Keyword opt-in** | `"xwlazy-enabled"` in pyproject → lazy on. No code change. |
| **Two-stage load** | Import time: missing imports logged, no crash. Use time: install then run. So you keep normal `import` style. |
| **Control** | Allow/deny lists, lockfile, SBOM. PEP 668 respected (no install into system Python). |

Single implementation file: `src/exonware/xwlazy.py`; `src/xwlazy.py` re-exports. Old layout in `src/_old/` is reference only, not shipped.

---

## Modes

Two knobs: **load** (when modules load) and **install** (when pip runs). You usually pick a preset.

| Preset | Load | Install | Use when |
|--------|------|--------|----------|
| `none` | normal | none | Default; no lazy. |
| `lite` | lazy | none | Lazy load only; you pre-install deps. |
| `smart` | lazy | on first use | **Dev default.** Install when you hit the code path. |
| `full` | lazy | all at start | CI; install everything up front. |
| `clean` | lazy | on use + uninstall after | Ephemeral runs. |
| `warn` | lazy | log only, no install | See what would install; prod audit. |

**By environment:** Dev → `smart`. Staging → `lite`. Prod → `warn` or `smart` + allow list. CI → `full`.

**Example:**

```python
config_package_lazy_install_enabled("xwsystem", enabled=True, mode="smart")
```

---

## Security and production

- **Allow list:** only these packages can be auto-installed.  
  `set_package_allow_list("xwsystem", ["fastavro", "protobuf", "msgpack"])`
- **Deny list:** block specific packages.  
  `set_package_deny_list("xwsystem", ["suspicious-package"])`
- **Lockfile:** record what got installed.  
  `set_package_lockfile("xwsystem", "xwsystem-lock.json")`
- **SBOM:** for compliance.  
  `generate_package_sbom("xwsystem", "xwsystem-sbom.json")`

**Production:** use an allow list with `smart`, or use `warn` and install nothing. Don’t run `smart` in prod without allow list or lockfile if you care about audit.

PEP 668: xwlazy won’t install into externally-managed environments; it will tell you to use a venv.

---

## Troubleshooting

**See what’s going on:**

```python
from xwlazy.lazy import get_lazy_install_stats

stats = get_lazy_install_stats("xwsystem")  # enabled, mode, installed_packages, failed_packages
```

**“Nothing gets installed”:** Check `get_lazy_install_stats("your-package")` — `enabled` and `mode`. If you use an allow list, the package must be in it.

**First import slow:** That’s the first install. Use `full` to pre-install everything, or `lite` and install deps yourself; caching is on by default.

---

## Docs and tests

Content in this README is aligned with the project REFs and [docs/GUIDE_01_USAGE.md](docs/GUIDE_01_USAGE.md) (per [GUIDE_63_README](../../docs/guides/GUIDE_63_README.md)).

- **Start:** [docs/INDEX.md](docs/INDEX.md) — doc index and quick links.
- **Use it:** [docs/GUIDE_01_USAGE.md](docs/GUIDE_01_USAGE.md) — modes, integration, production, troubleshooting.
- **Requirements and status:** [docs/REF_01_REQ.md](docs/REF_01_REQ.md), [docs/REF_22_PROJECT.md](docs/REF_22_PROJECT.md).
- **API and DX:** [docs/REF_15_API.md](docs/REF_15_API.md), [docs/REF_14_DX.md](docs/REF_14_DX.md).
- **Architecture:** [docs/REF_13_ARCH.md](docs/REF_13_ARCH.md).
- **Quality:** [docs/REF_54_BENCH.md](docs/REF_54_BENCH.md), [docs/REF_51_TEST.md](docs/REF_51_TEST.md). Benchmark run logs: [docs/logs/benchmarks/](docs/logs/benchmarks/).

**Tests:**

```bash
python tests/runner.py
# or per layer: python tests/0.core/runner.py, python tests/1.unit/runner.py
```

See [docs/REF_51_TEST.md](docs/REF_51_TEST.md) for test layers and coverage.

---


---

---

## 🔬 Innovation: Where does this package fit?

**Tier 1 — Genuinely novel (nothing like this exists)**

**`xwlazy` — Adaptive Intelligent Package Manager**

Not just lazy imports — an **adaptive runtime optimizer** that learns from usage patterns. Multi-strategy caching (LRU/LFU/TTL/multi-tier), discovery (file/manifest/hybrid), security (allow-list/deny-list/SBOM), and an **intelligent selector** that picks strategies based on metrics.

- `functools.lru_cache` = one cache type; this has 6+ with auto-selection. Lock file (`xwlazy.lock.toml`), SBOM, async install, interactive mode

**Verdict:** 🟢 **Nothing like this exists** as a unified system. Part of the eXonware story — vertical integration across 20+ packages.

---

## License and links

MIT — see [LICENSE](LICENSE).

- **Homepage:** https://exonware.com  
- **Repository:** https://github.com/exonware/xwlazy  
- **Contact:** connect@exonware.com · Eng. Muhammad AlShehri  

**Version:** 1.0.1.5

*Built with ❤️ by eXonware.com - Revolutionizing Python Development Since 2025*

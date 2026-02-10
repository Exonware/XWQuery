# xwlazy ⚡️

**Missing import? Install it on first use.** One line to enable; standard imports, no try/except. Per-package isolation—xwsystem can be lazy while xwnode stays normal. 🚀

[![Status](https://img.shields.io/badge/status-beta-blue.svg)](https://exonware.com)
[![Python](https://img.shields.io/badge/python-3.8%2B-blue.svg)](https://www.python.org)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

---

## Install 📦

```bash
pip install exonware-xwlazy
# or
pip install xwlazy
```

Works in both **local/system Python** and **virtual environments** (venv, virtualenv, conda, uv, etc.):

- On a system interpreter, xwlazy respects PEP 668 and will refuse to install into externally-managed environments.
- Inside a venv, it simply uses the active environment’s `pip` — recommended for real projects.

---

## Quick start 🚀

**1. Enable for your package (one line in `__init__.py`):**

```python
from xwlazy import auto_enable_lazy

auto_enable_lazy(__package__)  # or auto_enable_lazy()
```

**2. Use normal imports.** First time a dependency is missing, xwlazy installs it; after that it’s a normal import. No changes elsewhere in your code.

**Zero-code option:** add to `pyproject.toml`:

```toml
[project]
keywords = ["xwlazy-enabled"]
```

Then `pip install -e .` — xwlazy picks it up from metadata.

---

## What you get ⭐

| Thing | What it means |
|-------|----------------|
| **On-demand install** | Missing package → pip install when code first touches it. No manual install for optional features. |
| **Per-package** | Each package turns lazy on or off. xwsystem can be lazy, xwnode not—no cross-talk. |
| **Keyword opt-in** | `"xwlazy-enabled"` in pyproject → lazy on. No code change. |
| **Two-stage load** | Import time: missing imports logged, no crash. Use time: install then run. So you keep normal `import` style. |
| **Control** | Allow/deny lists, lockfile, SBOM. PEP 668 respected (no install into system Python). |

## DX highlights for developers ✨

- **Copy-paste setup:** `pip install xwlazy` + one `auto_enable_lazy(...)` call in your package `__init__` and you’re done.
- **No import gymnastics:** Keep normal `import` statements; xwlazy installs missing deps behind the scenes, then gets out of your way.
- **Works with how you already develop:** Local/system Python or venv/conda/uv — with PEP 668 checks so you don’t accidentally mutate system installs.
- **Debuggable behavior:** `get_lazy_install_stats(...)`, lockfile/SBOM outputs, and clear logs when something is skipped or denied — so you always know *why* something happened.

Single implementation file: `src/exonware/xwlazy.py`; `src/xwlazy.py` re-exports.
When browsing on GitHub, you may see `src/_old/` — this is legacy/reference code only, safe to ignore, and not shipped or imported.

---

## Built-in library mappings

xwlazy ships with a curated mapping file (`src/exonware/xwlazy_external_libs.toml`) so common ecosystems “just work” out of the box:

- **Data & ML:** `numpy`, `pandas`, `scipy`, `scikit-learn`, `statsmodels`, `xgboost`, `lightgbm`, `catboost`, `joblib`, `dask`, …
- **Deep learning & AI:** `torch`, `tensorflow`/`tf`, `keras`, `transformers`, `jax`, `jaxlib`, …
- **Visualization & geo:** `matplotlib`, `seaborn`, `plotly`, `bokeh`, `altair`, `graphviz`, `folium`, `geopandas`, …
- **Web & APIs:** `requests`, `httpx`, `aiohttp`, `fastapi`, `uvicorn`, `django`, `flask`, `starlette`, …
- **Formats & I/O:** `PyYAML`, `ruamel.yaml`, `beautifulsoup4` (`bs4`), `pyarrow`, `fastavro`, `h5py`, and more.

You can extend or override these mappings by editing that TOML file in your own project.

## Modes and strategies 🎛️

xwlazy combines **when** to install (lazy vs normal imports) with **how** to install (strategy):

| Strategy | What it does | Use when |
|----------|--------------|---------|
| `smart`  | Uses manifests and mappings to install missing deps on first use. | Default for most projects. |
| `pip`    | Installs missing deps with plain `pip` under the lazy import hook. | You want vanilla pip behavior. |
| `wheel`  | Prefers wheel-based installs when available. | Environments with prebuilt wheels. |
| `cached` | Reuses previously resolved install candidates across runs. | Repeat runs with similar deps. |

If you **don’t** call `auto_enable_lazy(...)`, imports stay normal and nothing is installed lazily.

**Example:**

```python
from xwlazy import auto_enable_lazy

auto_enable_lazy("xwsystem", mode="smart")
```

---

## Security and production 🛡️

- **Deny list:** a central list of blocked packages loaded from the `[deny_list]` section in `xwlazy_external_libs.toml`.
- **Lockfile (opt-in):** when auditing is enabled, installed packages and basic stats persist to `~/.xwlazy/xwlazy.lock.toml` for reproducibility.
- **SBOM (opt-in):** when auditing is enabled, `generate_sbom()` writes `~/.xwlazy/xwlazy_sbom.toml` so you can audit what was installed and when.
- **PEP 668:** xwlazy won’t install into externally-managed environments; it will tell you to use a venv instead.

Auditing is **disabled by default**. To enable lockfile/SBOM writes, set `XWLAZY_AUDIT_ENABLED=1` in the environment before importing xwlazy.

For production, you typically pre-install pinned dependencies, keep the lazy hook in `smart` or `pip` strategy for edge cases, and (optionally) rely on the lockfile/SBOM for audit.

---

## Troubleshooting 🩺

**See what’s going on:**

```python
from xwlazy import get_all_stats

stats = get_all_stats()  # installed_packages, failures, lockfile_path, keyword detection, etc.
```

**“Nothing gets installed”:** Check `get_lazy_install_stats("your-package")` — `enabled` and `mode`. If you use an allow list, the package must be in it.

**First import slow:** That’s the first install. Use `full` to pre-install everything, or `lite` and install deps yourself; caching is on by default.

---

## Docs and tests 📚

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

## 🔬 Innovation: Where does this package fit?

**Tier 1 — Genuinely novel (nothing like this exists)**

**`xwlazy` — Adaptive Intelligent Package Manager**

Not just lazy imports — an **adaptive import hook** that learns from usage patterns. Multi-tier caching (in-memory LRU + disk cache), manifest-based discovery, a deny list for problematic packages, and optional SBOM/lockfile support.

- `functools.lru_cache` = one cache type; xwlazy layers caching, manifest indexing, and an adaptive installer with optional lockfile (`~/.xwlazy/xwlazy.lock.toml`) and SBOM (`~/.xwlazy/xwlazy_sbom.toml`) output for audit (off by default; enable with `XWLAZY_AUDIT_ENABLED=1`).

**Verdict:** 🟢 **Nothing like this exists** as a unified system. Part of the eXonware story — vertical integration across 20+ packages.

---

## License and links 🔗

MIT — see [LICENSE](LICENSE).

- **Homepage:** https://exonware.com  
- **Repository:** https://github.com/exonware/xwlazy  
- **Contact:** connect@exonware.com · Eng. Muhammad AlShehri  

**Version:** 1.0.1.7

*Built with ❤️ by eXonware.com - Revolutionizing Python Development Since 2025*

# xwlazy ⚡️

**Install missing Python packages on first use, without changing your imports.**

[![Status](https://img.shields.io/badge/status-beta-blue.svg)](https://exonware.com)
[![Python](https://img.shields.io/badge/python-3.8%2B-blue.svg)](https://www.python.org)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

- **Who it is for:** Python projects with optional or heavy dependencies (data, ML, plugins) where you do not want to pre-install everything.
- **What it does:** Watches imports, installs missing packages the first time code actually uses them, and records them in your project.
- **Why it is different:** Per-package scope (xwsystem lazy, xwnode normal), mapping-aware install (`bs4` -> `beautifulsoup4`), and PEP 668 and audit options built in.

---

## Quick start 🚀

### 1. Install

```bash
pip install exonware-xwlazy
# or
pip install xwlazy
```

Works in both local/system Python and virtual environments (venv, virtualenv, conda, uv, etc.):

- On a system interpreter, xwlazy respects PEP 668 and will refuse to install into externally-managed environments.
- Inside a venv, it uses the active environment `pip`.

### 2. Enable for your package (one line in `__init__.py`)

```python
from xwlazy import auto_enable_lazy

auto_enable_lazy(__package__)  # or auto_enable_lazy()
```

Then keep using normal imports. The first time a dependency is missing, xwlazy installs it; after that it behaves as a normal import.

### 3. Zero-code opt-in (optional)

Add this to `pyproject.toml`:

```toml
[project]
keywords = ["xwlazy-enabled"]
```

After `pip install -e .`, lazy mode is enabled for that project based on metadata.

---

## What you get in practice ⭐

| Capability | What it does |
|-----------|--------------|
| **On-demand install** | Missing package triggers `pip install` when code first touches it. No manual install step for optional features. |
| **Per-package scope** | Each package turns lazy on or off. xwsystem can be lazy, xwnode not - no cross-talk. |
| **Keyword opt-in** | `"xwlazy-enabled"` in `pyproject.toml` turns lazy on with no code change. |
| **Two-stage load** | Import time: missing imports logged, no crash. Use time: install then run. You keep normal `import` style. |
| **Policy and audit** | Allow/deny lists, lockfile, SBOM, and PEP 668 checks (no install into externally-managed system Python). |
| **Persist to project** | On successful install, xwlazy can add the package to `requirements.txt` and/or `pyproject.toml`. Control this with `XWLAZY_PERSIST_EXTRAS` and `XWLAZY_NO_PERSIST`. |

Single implementation file: `src/exonware/xwlazy.py`; `src/xwlazy.py` re-exports.
`src/_old/` contains legacy/reference code only and is not shipped or imported.

---

## Built-in library mappings

xwlazy ships with a curated mapping file (`src/exonware/xwlazy_external_libs.toml`) so common ecosystems “just work” out of the box:

- **Data & ML:** `numpy`, `pandas`, `scipy`, `scikit-learn`, `statsmodels`, `xgboost`, `lightgbm`, `catboost`, `joblib`, `dask`, …
- **Deep learning & AI:** `torch`, `tensorflow`/`tf`, `keras`, `transformers`, `jax`, `jaxlib`, …
- **Visualization & geo:** `matplotlib`, `seaborn`, `plotly`, `bokeh`, `altair`, `graphviz`, `folium`, `geopandas`, …
- **Web & APIs:** `requests`, `httpx`, `aiohttp`, `fastapi`, `uvicorn`, `django`, `flask`, `starlette`, …
- **Formats & I/O:** `PyYAML`, `ruamel.yaml`, `beautifulsoup4` (`bs4`), `pyarrow`, `fastavro`, `h5py`, and more.

You can extend or override these mappings by editing that TOML file in your own project.

---

## Why xwlazy? Benchmarked and mapping-aware 🏆

We run xwlazy against other lazy-import libraries (pipimport, deferred-import, lazy-loader, lazy-imports, pylazyimports, lazi, lazy-imports-lite) in a dedicated [benchmark campaign](benchmarks/20260209-benchmark%20competition/README.md). Here’s what stands out.

### Performance (latest competition run)

- **Medium load:** 4.06 ms vs 4.54 ms next best in the benchmark campaign.
- **Heavy / enterprise:** 14.46 ms heavy, 41.37 ms enterprise with auto-install, per-package isolation, and audit features on.

### Feature comparison

Other tools in the benchmark focus on different trade-offs: many do **lazy import only** (no auto-install), or **auto-install but assume `import name == pip name`**. In that comparison set, xwlazy combines: auto-install, lazy import, global import hook, **mapping-aware install**, pyproject/build integration, import tracing, per-package isolation, lockfile/SBOM, PEP 668 awareness, and a one-liner API. See the [Library Feature Comparison table](benchmarks/20260209-benchmark%20competition/README.md#library-feature-comparison-vs-xwlazy-) in the campaign README.

### Where other lazy installers break (no mapping)

Libraries that assume `import name == pip package name` will **fail or install the wrong thing** on very common imports. Examples:

| You write | Pip package to install | What happens without mapping |
|-----------|------------------------|------------------------------|
| `import bs4` | `beautifulsoup4` | They run `pip install bs4` → wrong or missing. |
| `import yaml` | `PyYAML` | `pip install yaml` → fails (no such package). |
| `import sklearn` | `scikit-learn` | `pip install sklearn` → fails. |
| `import cv2` | `opencv-python` | `pip install cv2` → fails. |
| `import PIL` | `Pillow` | `pip install PIL` → fails. |
| `import attr` | `attrs` | `pip install attr` → wrong package. |
| `import pandas` | `pandas` | Same name, so may work—but `import sklearn` or `import bs4` in the same project won’t. |

xwlazy’s curated mapping (`xwlazy_external_libs.toml`) resolves these so that `import bs4`, `import yaml`, `import sklearn`, `import cv2`, `import PIL`, etc. install the correct pip package automatically. No per-import configuration or wrapper API needed.

---

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
- **Persist to project:** when an install succeeds, xwlazy adds the package to your project’s `requirements.txt` and/or `pyproject.toml` (default: `[project.optional-dependencies.full]` if present, else `[project.dependencies]`). Override with `XWLAZY_PERSIST_EXTRAS=<name>` (write to that extras group) or `XWLAZY_PERSIST_EXTRAS=none` (force dependencies). Disable with `XWLAZY_NO_PERSIST=1`.
- **SBOM (opt-in):** when auditing is enabled, `generate_sbom()` writes `~/.xwlazy/xwlazy_sbom.toml` so you can audit what was installed and when.
- **Async I/O (default):** file updates (persist-to-project, lockfile, audit log) run in a background worker so imports/installs don’t block your app. Set `XWLAZY_ASYNC_IO=0` to force synchronous writes.
- **PEP 668:** xwlazy won’t install into externally-managed environments; it will tell you to use a venv instead.

Auditing is **disabled by default**. To enable lockfile/SBOM writes, set `XWLAZY_AUDIT_ENABLED=1` in the environment before importing xwlazy.

For production, you typically pre-install pinned dependencies, keep the lazy hook in `smart` or `pip` strategy for edge cases, and (optionally) rely on the lockfile/SBOM for audit.

---

## Optional features (we recommend against enabling) ⚠️

Three optional mixins exist for **per-call wrapper API**, **AST rewrite**, and **type-stub / internal API tooling**. They are **disabled by default** and only activate when you set the corresponding environment variable:

| Feature | Env var | API when enabled |
|--------|---------|-------------------|
| Per-call wrapper API | `XWLAZY_PER_CALL_API=1` | `lazy_import(module_name, package=..., mode=..., root=...)` |
| AST rewrite / lazy transform | `XWLAZY_AST_LAZY=1` | `enable_ast_lazy(root=...)`, `disable_ast_lazy()` |
| Type-stub / internal API tooling | `XWLAZY_TYPING_TOOLS=1` | `attach_stub(package_name, stub_content=..., stub_path=...)`, `get_stub_registry()` |

**From a software engineering perspective we recommend against enabling these.** They increase complexity, reduce maintainability, and (for AST/type-stub) are fragile or address a different problem domain. When enabled, they may or may not work well together (e.g. per-call and AST both touching imports). Prefer the core `hook` / `auto_enable_lazy` / `attach` API. Enable only for edge cases or compatibility.

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

## 🔬 Positioning in the ecosystem

`xwlazy` combines lazy imports, on-demand installation, mapping-aware resolution, and optional audit features (lockfile, SBOM). It uses multi-tier caching (in-memory LRU + disk cache), manifest-based discovery, a deny list for problematic packages, and optional audit outputs (`~/.xwlazy/xwlazy.lock.toml`, `~/.xwlazy/xwlazy_sbom.toml`, enabled with `XWLAZY_AUDIT_ENABLED=1`).

---

## License and links 🔗

MIT — see [LICENSE](LICENSE).

- **Homepage:** https://exonware.com  
- **Repository:** https://github.com/exonware/xwlazy  
- **Contact:** connect@exonware.com · eXonware Backend Team  

**Version:** See [version.py](src/exonware/xwlazy/version.py) or PyPI. **Updated:** See version.py (`__date__`).

*Built with ❤️ by eXonware.com - Revolutionizing Python Development Since 2025*

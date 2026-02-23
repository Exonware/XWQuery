# xwlazy — API Reference (REF_15_API)

**Library:** exonware-xwlazy  
**Last Updated:** 07-Feb-2026  
**Requirements source:** [REF_01_REQ.md](REF_01_REQ.md) sec. 6  
**Producing guide:** [GUIDE_15_API.md](../../docs/guides/GUIDE_15_API.md)

API reference for xwlazy (output of GUIDE_15_API). xwlazy intentionally keeps a **minimal public API**: enable, disable, config. See REF_14_DX for key code and REF_22_PROJECT for scope.

---

## Scope (from REF_01_REQ sec. 6)

### Main entry points / “key code”

| Area | Symbols |
|------|--------|
| **Activation** | `hook`, `auto_enable_lazy`, `attach` |
| **Facade** | `XWLazy` (configure, enable_package, disable_package, get_stats, etc.) |
| **Keyword detection** | `enable_keyword_detection`, `is_keyword_detection_enabled`, `check_package_keywords` |
| **Learning** | `enable_learning`, `predict_next_imports` |
| **Statistics / SBOM** | `get_all_stats`, `generate_sbom` |
| **Lockfile** | `get_lockfile`, `save_lockfile` |
| **Global hook** | `install_global_import_hook`, `uninstall_global_import_hook`, `is_global_import_hook_installed` |
| **Watched prefixes** | `add_watched_prefix`, `remove_watched_prefix`, `get_watched_prefixes`, `is_module_watched` |
| **Cache** | `get_cache_stats`, `clear_cache`, `invalidate_cache` |
| **Performance** | `get_performance_stats`, `clear_performance_stats` |
| **Utility** | `is_externally_managed` |

### Easy (1–3 lines)

- **One-line enable:** `auto_enable_lazy(__package__)` or install with `[lazy]` extra and enable via config/keyword.
- **Configure:** `XWLazy.configure(package_name, enabled=..., mode=..., install_strategy=..., allow=...)`; `enable_package` / `disable_package` shortcuts.

### Environment variables (behavior)

| Variable | Effect |
|----------|--------|
| `XWLAZY_NO_PERSIST=1` | Disable persisting successfully installed packages to the project’s `requirements.txt` and `pyproject.toml`. |
| `XWLAZY_PERSIST_EXTRAS=<name>` | Control where `pyproject.toml` is updated on successful install: set to an extras group name (e.g. `dev`) to write to `[project.optional-dependencies.<name>]`, or set to `none`/`default`/`dependencies` to force `[project.dependencies]`. |
| `XWLAZY_ASYNC_IO=0` | Disable background async I/O worker and perform file updates synchronously (default is async enabled). |
| `XWLAZY_ASYNC_IO_FLUSH_TIMEOUT_MS=<ms>` | Best-effort flush timeout at process exit for pending async I/O tasks (default: 2000ms). |

When persist is enabled (default), each successful lazy install adds the package to the project’s dependency files (see GUIDE_01_USAGE § Persist to project).

### Not in public API (from REF_01_REQ sec. 6)

Internal implementation (installer engine, strategies, discovery, manifest, async queue, etc.) is not exposed; only enable, disable, and config are part of the supported public surface.

---

*Per GUIDE_15_API. See REF_14_DX for DX contract and REF_51_TEST, REF_54_BENCH for quality.*

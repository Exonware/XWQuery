# Usage guide - xwlazy

**Last Updated:** 07-Feb-2026  
**Output:** Project-local guide (GUIDE_01_*)

How to use xwlazy: setup, modes, integration with xw libraries, best practices, production, extension, and troubleshooting.

**Related:** [REF_01_REQ.md](REF_01_REQ.md) - requirements; [REF_11_COMP.md](REF_11_COMP.md) - compliance; [REF_22_PROJECT.md](REF_22_PROJECT.md) - vision & milestones; [REF_13_ARCH.md](REF_13_ARCH.md) - architecture; [REF_14_DX.md](REF_14_DX.md) - key code; [REF_15_API.md](REF_15_API.md) - API; [REF_21_PLAN.md](REF_21_PLAN.md) - milestones; [REF_54_BENCH.md](REF_54_BENCH.md) - performance.

---

## Quick start

### One-line setup

```python
from xwlazy.lazy import config_package_lazy_install_enabled

# Auto-detect from pip install your-package[lazy]
config_package_lazy_install_enabled("your-package")
```

### Keyword-based (zero code)

In `pyproject.toml`:

```toml
[project]
keywords = ["xwlazy-enabled"]
```

After `pip install -e .`, lazy loading is enabled for that package. xwlazy reads the keyword from package metadata (default: `"xwlazy-enabled"`). Control via `enable_keyword_detection()` / `is_keyword_detection_enabled()` in `xwlazy.lazy.lazy_core` if needed.

---

## Best practices

### When to use lazy loading

- **Use for:** optional dependencies, large deps, dev-only tools, platform-specific or experimental features.
- **Avoid for:** core deps, tiny deps, hot-path imports, security-critical deps.

### Mode selection

| Environment | Recommended mode | Example |
|-------------|------------------|--------|
| Development | `smart` | `config_package_lazy_install_enabled("xwsystem", enabled=True, mode="smart")` |
| Staging | `lite` | Lazy load only; deps pre-installed |
| Production | `warn` or `smart` + allow list | `mode="warn"` for audit; or `smart` + `set_package_allow_list(...)` |
| CI/CD | `full` | Pre-install all deps |

### Persist to project

When a lazy install **succeeds**, xwlazy adds the installed package to the current project’s dependency files so the install is recorded:

- **requirements.txt:** appended (if present in project root); duplicate package names are skipped.
- **pyproject.toml (default/auto):** if `[project.optional-dependencies.full]` exists, the package is added there; otherwise it is added to `[project.dependencies]`.

You can override where `pyproject.toml` is updated:

- **Write to a specific extras group:** set `XWLAZY_PERSIST_EXTRAS=dev` to write to `[project.optional-dependencies.dev]` (created if missing).
- **Force default dependencies:** set `XWLAZY_PERSIST_EXTRAS=none` (or `dependencies`/`default`) to always write to `[project.dependencies]`.

Project root is found by walking up from the current working directory until a directory containing `pyproject.toml` or `requirements.txt` is found. To disable this behavior (e.g. in CI or read-only trees), set `XWLAZY_NO_PERSIST=1`.

### Async I/O (non-blocking)

To avoid slowing down your application, xwlazy performs file updates (persist-to-project, lockfile, audit log) using a **background I/O worker** by default. This makes file edits “pending actions” that do not block the main workflow, and it remains safe when multiple threads are installing/importing in parallel (writes are serialized and atomic).

- **Disable async I/O (force sync):** set `XWLAZY_ASYNC_IO=0`.
- **Exit flush timeout:** set `XWLAZY_ASYNC_IO_FLUSH_TIMEOUT_MS=<ms>` (default: 2000ms). This is best-effort; xwlazy will not crash your process if a flush cannot complete.

### Security

- **Production:** Use allow lists: `set_package_allow_list("xwsystem", ["fastavro", "protobuf", "msgpack"])`.
- **Lockfiles:** `set_package_lockfile("xwsystem", "xwsystem-lock.json")`.
- **SBOM:** `generate_package_sbom("xwsystem", "xwsystem-sbom.json")`.

### Anti-patterns

- Do not use `smart` in production without allow lists.
- Do not skip lockfile/SBOM for compliance-sensitive deployments.

---

## Integration with xw libraries

- **xwsystem:** `config_package_lazy_install_enabled("xwsystem", enabled=True, mode="smart")` — serializers (e.g. Avro, Protobuf) auto-install.
- **xwnode:** `mode="lite"` for lazy load only with pre-installed deps.
- **xwdata:** `mode="smart"` + `set_package_allow_list("xwdata", ["PyYAML", "pandas", "openpyxl"])`.
- **xwquery:** `mode="warn"` for monitoring without auto-install.

Examples: `examples/integration/` (xwdata, xwnode, xwquery).

---

## Production deployment

- **Pre-deployment:** Python 3.12+, venv, allow/deny lists, lockfile, SBOM, PEP 668 (externally-managed) respected.
- **Docker/K8s:** Set `XWLAZY_MODE`, `XWLAZY_ALLOW_LIST` (or package-specific env) as needed.
- **CI/CD:** Use `mode="full"` to pre-install; then run with `lite` or `warn` in production-like stages.

---

## Hooking and extension

xwlazy uses **strategy interfaces** (see [REF_13_ARCH.md](REF_13_ARCH.md)): discovery, installer, import hook, cache, lazy loader. Customize by implementing the relevant interfaces (e.g. `IInstallExecutionStrategy`, discovery strategies) and registering per package. Async install, manifest/watched prefixes, and execution strategies are documented in REF_13_ARCH. For deep customization, see the contracts and base classes in the codebase.

---

## Troubleshooting

### Packages not auto-installing

- Confirm lazy is enabled: `get_lazy_install_stats("package_name")` → check `enabled` and `mode`.
- If using an allow list, ensure the package is included in `set_package_allow_list(...)`.

### First import slow

- Use `full` mode to pre-install, or `lite` with deps pre-installed; enable caching (default).

### Hook / pytest issues

- Tests skip pytest and debugging modules; if a test hangs, ensure the runner uses the same skip logic (see REF_51_TEST and test runner).

---

*For requirements and API surface see [REF_01_REQ.md](REF_01_REQ.md) sec. 6 and [REF_13_ARCH.md](REF_13_ARCH.md); public API in `xwlazy.lazy`.*

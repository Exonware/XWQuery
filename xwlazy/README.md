# xwlazy

Lazy imports plus on-demand install: if something isn’t installed, xwlazy installs it when you first use it. One line to turn it on; no try/except import hacks.

[![Status](https://img.shields.io/badge/status-beta-blue.svg)](https://exonware.com)
[![Python](https://img.shields.io/badge/python-3.8%2B-blue.svg)](https://www.python.org)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## What it does

You enable xwlazy for a package. From then on, missing imports don’t raise—xwlazy installs the package when code actually touches it. Each package (xwsystem, xwnode, etc.) can enable it independently; no cross-talk.

**Implementation:** Single file `src/exonware/xwlazy.py`; `src/xwlazy.py` re-exports. Old multi-file layout lives in `src/_old/` for reference only and isn’t shipped.

## Quick start

**Install:**

```bash
pip install exonware-xwlazy
# or: pip install xwlazy
```

**Enable for your package (one line):**

```python
# In your package __init__.py
from xwlazy.lazy import config_package_lazy_install_enabled

config_package_lazy_install_enabled("your-package")  # or use __package__
```

**Use normal imports.** First time something is missing, xwlazy installs it; after that it’s a normal import. No code changes in the rest of your codebase.

**Zero-code option:** Add to `pyproject.toml`:

```toml
[project]
keywords = ["xwlazy-enabled"]
```

Then `pip install -e .` and xwlazy picks it up from metadata. No Python call needed.

## Modes

Two knobs: **load** (when modules load) and **install** (when pip runs). You usually just pick a preset.

**Presets:**

| Preset     | Load  | Install   | When to use |
|-----------|-------|-----------|-------------|
| `none`    | normal | none    | Default; no lazy. |
| `lite`    | lazy  | none     | Lazy load only; you pre-install deps. |
| `smart`   | lazy  | on first use | Dev default; install when you hit the code path. |
| `full`    | lazy  | all at start | CI / “install everything up front”. |
| `clean`   | lazy  | on use + uninstall after | Ephemeral runs. |
| `warn`    | lazy  | log only, no install | See what would be installed; prod audit. |

**Example:**

```python
config_package_lazy_install_enabled("xwsystem", enabled=True, mode="smart")
```

**By environment (from the docs):** Dev → `smart`; staging → `lite` (deps already there); prod → `warn` or `smart` + allow list; CI → `full`.

## Security and control

- **Allow list:** Only these packages can be auto-installed.  
  `set_package_allow_list("xwsystem", ["fastavro", "protobuf", "msgpack"])`
- **Deny list:** Block specific packages.  
  `set_package_deny_list("xwsystem", ["suspicious-package"])`
- **Lockfile:** Record what got installed.  
  `set_package_lockfile("xwsystem", "xwsystem-lock.json")`
- **SBOM:** For compliance.  
  `generate_package_sbom("xwsystem", "xwsystem-sbom.json")`

Production: use an allow list with `smart`, or use `warn` and install nothing. Don’t run `smart` in prod without allow list or lockfile if you care about audit.

PEP 668: xwlazy won’t install into externally-managed environments; it’ll tell you to use a venv.

## Stats and troubleshooting

**See what’s going on:**

```python
from xwlazy.lazy import get_lazy_install_stats

stats = get_lazy_install_stats("xwsystem")  # enabled, mode, installed_packages, failed_packages, etc.
```

**“Nothing gets installed”:** Check `get_lazy_install_stats("your-package")` — `enabled` and `mode`. If you use an allow list, the package must be in it.

**First import feels slow:** That’s the first install. Use `full` to pre-install everything, or `lite` and install deps yourself; caching is on by default.

## Docs

- [Usage guide](docs/GUIDE_01_USAGE.md) — modes, integration, production, troubleshooting.
- [Doc index](docs/INDEX.md) — REFs (requirements, architecture, API, DX, benchmarks, tests).
- [Requirements](docs/REF_01_REQ.md), [Architecture](docs/REF_13_ARCH.md), [API](docs/REF_15_API.md), [DX](docs/REF_14_DX.md).
- [Benchmarks](docs/REF_54_BENCH.md); run logs under `docs/logs/benchmarks/`.

## Tests

```bash
python tests/runner.py
# or per layer: python tests/0.core/runner.py, python tests/1.unit/runner.py
```

## License and links

MIT — see [LICENSE](LICENSE).

- [exonware.com](https://exonware.com) · [Repository](https://github.com/exonware/xwlazy) · connect@exonware.com · Eng. Muhammad AlShehri

Version: `from exonware.xwlazy import __version__` or `import exonware.xwlazy; print(exonware.xwlazy.__version__)`.

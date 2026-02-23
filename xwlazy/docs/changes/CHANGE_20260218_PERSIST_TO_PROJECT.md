# docs/changes/CHANGE_20260218_PERSIST_TO_PROJECT.md

**Date:** 2026-02-18  
**Type:** Feature  
**Scope:** xwlazy — persist successfully installed packages to project config

---

## Summary

When xwlazy successfully installs a package (lazy install run succeeds), it now records that package in the current project’s dependency files so the install is part of the project’s declared dependencies.

## Behavior

- **Project root:** Found by walking up from the current working directory until a directory containing `pyproject.toml` or `requirements.txt` is found.
- **requirements.txt:** If present, the installed package spec is appended (duplicate package names are skipped).
- **pyproject.toml (default/auto):** If `[project.optional-dependencies.full]` exists, the package is added there; otherwise it is added to `[project.dependencies]`. Duplicates (by normalized package name) are skipped.
- **Override target:** Set `XWLAZY_PERSIST_EXTRAS=<name>` to write to `[project.optional-dependencies.<name>]` (created if missing). Set `XWLAZY_PERSIST_EXTRAS=none` (or `dependencies`/`default`) to force `[project.dependencies]`.
- **Opt-out:** Set `XWLAZY_NO_PERSIST=1` to disable (e.g. CI or read-only trees).

## Implementation

- New helpers in `src/exonware/xwlazy.py`: `_find_project_root`, `_normalize_spec_for_compare`, `_add_to_requirements_txt`, `_add_to_pyproject`, `_persist_installed_to_project`.
- `_perform_install` calls `_persist_installed_to_project(successful_candidate)` after a successful install and lockfile save.

## Tests

- `tests/1.unit/test_persist_to_project.py`: 14 tests for project root discovery, requirements.txt append, pyproject.toml update (dependencies, auto-full, and override extras), no duplicates, and `XWLAZY_NO_PERSIST` respect.

## Docs

- README.md: “What you get” table and Security section.
- docs/REF_14_DX.md: Key code row for “Persist to project”.
- docs/REF_15_API.md: Environment variables `XWLAZY_NO_PERSIST`, `XWLAZY_PERSIST_EXTRAS`.
- docs/GUIDE_01_USAGE.md: New “Persist to project” subsection.
- docs/guides/GUIDE_14_DX.md: xwlazy key code bullet.

---

*Per GUIDE_41_DOCS and GUIDE_53_FIX.*

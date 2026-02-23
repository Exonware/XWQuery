# Security

## Overview

xwlazy does not handle user passwords, API keys, or tokens. It only resolves import names to package names and runs `pip install` (or other strategies) using the current environment. This document summarizes what is stored, what is never stored, and how verbose output is sanitized.

## What xwlazy does **not** store or log

- **No credentials**: No passwords, API keys, tokens, or secret environment variables are read or written by xwlazy.
- **No pip secrets**: Pip is invoked with package names only (e.g. `pip install pandas`). Any private index URLs or credentials come from the existing environment (e.g. `PIP_INDEX_URL`, `pip.conf`); xwlazy does not inject or log them.
- **No user secrets in code**: There are no hardcoded secrets in the xwlazy source tree. CI (e.g. PyPI publish) uses repository secrets (e.g. `secrets.PYPI_API_TOKEN`) and never commits them.

## What xwlazy **does** store (all non-sensitive)

- **Cache (L2 disk)**: Keys like `installed:<module_name>`, values `True`/`False`. Stored under `~/.xwlazy/cache/l2_cache/` with hashed filenames.
- **Lockfile** (if `XWLAZY_AUDIT_ENABLED=1`): Package names, install/failure counts, and a generated timestamp. Path: `~/.xwlazy/xwlazy.lock.toml`.
- **Audit log** (if audit enabled): Same as lockfile plus per-install entries (package name, status, duration, strategy). Path: `~/.xwlazy/xwlazy_sbom.toml`.
- **Persist to project**: Only package specs (e.g. `pandas>=2.0`) are appended to `requirements.txt` or `pyproject.toml`. No credentials or paths with secrets.

## Verbose output (XWLAZY_VERBOSE=1)

When `XWLAZY_VERBOSE=1`, xwlazy may write install errors and pip output to stderr. To avoid leaking credentials that might appear in pip output (e.g. private index URLs with embedded tokens), **all such text is passed through a redaction step** that replaces URL credential parts (e.g. `https://user:password@host` or `https://token@host`) with `***REDACTED***` before writing. Exception messages and other verbose strings are redacted the same way.

## .gitignore

The repository `.gitignore` excludes common secret-bearing files (e.g. `secrets.json`, `.secrets`, `credentials.json`, `.env.*.local`) so they are not accidentally committed when working in a project that uses xwlazy.

## Reporting a vulnerability

If you believe you have found a security issue, please report it responsibly (e.g. to connect@exonware.com or via your normal channel) rather than in a public issue.

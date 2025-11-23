# Version Management Guidelines

**IMPORTANT: Never hardcode version numbers in xwlazy codebase.**

## Single Source of Truth

All version information comes from a single file:
- **`src/exonware/xwlazy/version.py`** - This is the ONLY place where version numbers should be defined.

## How to Use Versions

### In Python Code

```python
# ✅ CORRECT: Import from version module
from exonware.xwlazy.version import __version__

# ❌ WRONG: Don't hardcode
__version__ = "0.1.0.19"
```

### In Docstrings

```python
# ✅ CORRECT: Don't include version in docstring
"""
Module description.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Generation Date: 10-Oct-2025
"""

# ❌ WRONG: Don't hardcode version
"""
Module description.
Version: 0.1.0.19  # <-- REMOVE THIS
"""
```

### In Documentation

```markdown
# ✅ CORRECT: Reference the version module
> **Note:** For the current version, use `from exonware.xwlazy import __version__`

# ❌ WRONG: Don't hardcode
**Version:** 0.1.0.19
```

## Updating Versions

When you need to update the version:

1. **Only edit** `src/exonware/xwlazy/version.py`
2. **Never edit** version numbers in other files
3. All other files will automatically use the new version

## Automated Checks

We have automated checks to prevent hardcoded versions:

1. **Pre-commit hook**: `.pre-commit-version-check.py` - Run before commits
2. **CI/CD check**: `.github/workflows/check-versions.yml` - Runs on PRs

## Running the Check Manually

```bash
# Check all files
python .pre-commit-version-check.py

# Check specific files
python .pre-commit-version-check.py src/some_file.py tests/test_something.py
```

## Fixing Hardcoded Versions

If you find hardcoded versions, use the fix script:

```bash
python fix_versions.py
```

This will automatically remove hardcoded version strings from docstrings.

## Exceptions

The following locations are allowed to have version numbers (they're excluded from checks):

- `src/exonware/xwlazy/version.py` - Source of truth
- `tests/resources/` - Test resources with example versions
- `_archive/` - Archived code
- `benchmarks/` - Benchmark scripts

## Why This Matters

1. **Single source of truth** - Version is defined in one place
2. **Consistency** - All parts of the codebase use the same version
3. **Maintainability** - Only one file to update when version changes
4. **Automation** - Build tools can read version from version.py


# Keyword-Based Auto-Detection

**Company:** eXonware.com  
**Author:** Eng. Muhammad AlShehri  
**Email:** connect@exonware.com  
**Version:** 0.1.0.18  
**Last Updated:** 15-Nov-2025

## 🎯 AI-Friendly Document

**This document is designed for both human developers and AI assistants.**  
Describes the keyword-based automatic detection feature that allows packages to opt-in to lazy loading without code changes.

**Related Documents:**
- [REF_ARCH.md](REF_ARCH.md) - System architecture
- [HOOKING_GUIDE.md](HOOKING_GUIDE.md) - Extension and customization guide
- [docs/guides/GUIDE_DOCS.md](guides/GUIDE_DOCS.md) - Documentation standards

---

## 🎯 Overview

xwlazy supports keyword-based auto-detection, similar to `lazy-imports-lite`. This allows packages to opt-in to lazy loading by simply adding a keyword to their `pyproject.toml` file, without requiring code changes.

**Why this feature exists:** Zero-code integration for package maintainers. Instead of modifying code or configuration, packages can simply add a keyword to their metadata, making lazy loading adoption trivial. This improves usability (Priority #2) by reducing integration complexity.

## How It Works

When enabled, xwlazy checks installed packages for a specific keyword (default: `"xwlazy-enabled"`) in their package metadata. If the keyword is found, lazy loading is automatically enabled for that package.

The keyword is stored in the package's metadata when installed, which is read from the `keywords` field in `pyproject.toml`.

## Usage

### Enabling Keyword Detection

Keyword detection is **enabled by default**. You can control it programmatically:

```python
from xwlazy.lazy.lazy_core import (
    enable_keyword_detection,
    is_keyword_detection_enabled,
    get_keyword_detection_keyword,
)

# Check if enabled
print(is_keyword_detection_enabled())  # True (default)

# Disable if needed
enable_keyword_detection(enabled=False)

# Use custom keyword
enable_keyword_detection(enabled=True, keyword="my-custom-keyword")
```

### Opting In via pyproject.toml

To enable lazy loading for your package, simply add the keyword to your `pyproject.toml`:

```toml
[project]
name = "my-package"
version = "1.0.0"
keywords = ["xwlazy-enabled"]  # <-- Add this
```

After installing your package, xwlazy will automatically detect the keyword and enable lazy loading.

### Checking for Keywords

You can programmatically check if a package has the keyword:

```python
from xwlazy.lazy.lazy_core import check_package_keywords

# Check all packages
has_keyword = check_package_keywords()

# Check specific package
has_keyword = check_package_keywords(package_name="my-package")

# Check for custom keyword
has_keyword = check_package_keywords(keyword="custom-keyword")
```

## Detection Priority

xwlazy uses the following priority order for detection:

1. **Environment variable override** (highest priority)
2. **Manual state** (explicitly set via API)
3. **Cached auto state** (from previous detection)
4. **Marker package** (`exonware-xwlazy` installed)
5. **Keyword detection** (new feature - checks package metadata)

If any of these indicate lazy loading should be enabled, it will be enabled.

## Configuration

### Default Settings

- **Enabled:** `True` (keyword detection is on by default)
- **Keyword:** `"xwlazy-enabled"`

### Customization

```python
# Change the keyword to check
enable_keyword_detection(enabled=True, keyword="my-lazy-keyword")

# Get current keyword
current_keyword = get_keyword_detection_keyword()  # "my-lazy-keyword"
```

## Examples

### Example 1: Basic Usage

```toml
# pyproject.toml
[project]
name = "my-app"
version = "1.0.0"
keywords = ["xwlazy-enabled"]
```

After `pip install -e .`, xwlazy will automatically detect and enable lazy loading.

### Example 2: Multiple Keywords

```toml
# pyproject.toml
[project]
name = "my-app"
version = "1.0.0"
keywords = ["xwlazy-enabled", "production", "web-app"]
```

The keyword can be part of a list of multiple keywords.

### Example 3: Comma-Separated Keywords

Some packaging tools store keywords as comma-separated strings. xwlazy handles this automatically:

```toml
# pyproject.toml
[project]
name = "my-app"
version = "1.0.0"
keywords = ["xwlazy-enabled, production, web-app"]
```

## Technical Details

### Implementation

- Uses `importlib.metadata` (Python 3.8+) to read package metadata
- Checks the `Keywords` field in package metadata
- Case-insensitive keyword matching
- Handles both list and comma-separated string formats
- Gracefully handles missing packages or metadata

### Performance

- Detection is cached per package
- Only checks metadata when needed
- Minimal overhead on import time

### Compatibility

- **Python:** 3.8+ (requires `importlib.metadata`)
- **Packaging tools:** Works with setuptools, flit, poetry, etc.
- **Backward compatible:** Existing detection methods still work

## Comparison with lazy-imports-lite

| Feature | lazy-imports-lite | xwlazy |
|---------|------------------|--------|
| **Keyword** | `lazy-imports-lite-enabled` | `xwlazy-enabled` (configurable) |
| **Mechanism** | AST transformation | Import hooks + auto-install |
| **Auto-install** | ❌ No | ✅ Yes |
| **Security** | ❌ No | ✅ Yes (allow/deny lists) |
| **Per-package config** | ❌ No | ✅ Yes |
| **Additional features** | Just lazy loading | Lazy loading + enterprise features |

## API Reference

### Functions

#### `enable_keyword_detection(enabled: bool = True, keyword: Optional[str] = None) -> None`

Enable/disable keyword-based detection and optionally set a custom keyword.

#### `is_keyword_detection_enabled() -> bool`

Check if keyword detection is currently enabled.

#### `get_keyword_detection_keyword() -> str`

Get the keyword currently being checked.

#### `check_package_keywords(package_name: Optional[str] = None, keyword: Optional[str] = None) -> bool`

Check if a package (or any package) has the specified keyword in its metadata.

## Troubleshooting

### Keyword Not Detected

1. **Verify package is installed:** The package must be installed (not just in source) for metadata to be available
2. **Check keyword spelling:** Ensure the keyword matches exactly (case-insensitive)
3. **Reinstall package:** After adding keyword to `pyproject.toml`, reinstall: `pip install -e .`
4. **Check metadata:** Verify keyword is in installed package metadata:
   ```python
   from importlib.metadata import distribution
   dist = distribution("my-package")
   print(dist.metadata.get_all('Keywords'))
   ```

### Detection Not Working

1. **Check if enabled:** `is_keyword_detection_enabled()`
2. **Check Python version:** Requires Python 3.8+
3. **Check priority:** Environment variables or manual state may override keyword detection

## See Also

- [Main README](../README.md)
- [Competition Analysis](../.benchmarks/COMPETITION_ANALYSIS.md)
- [Lazy Core API](../src/xwlazy/lazy/lazy_core.py)


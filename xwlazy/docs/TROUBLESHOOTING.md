# xwlazy Troubleshooting Guide

**Company:** eXonware.com  
**Author:** Eng. Muhammad AlShehri  
**Email:** connect@exonware.com  
**Version:** 1.0.0

## Overview

This guide helps you troubleshoot common issues with xwlazy.

## Table of Contents

1. [Common Issues](#common-issues)
2. [Debug Mode Usage](#debug-mode-usage)
3. [Performance Debugging](#performance-debugging)
4. [Integration Issues](#integration-issues)
5. [Getting Help](#getting-help)

## Common Issues

### Packages Not Auto-Installing

**Symptoms:**
- ImportError when importing packages
- Packages not found despite lazy loading enabled

**Solutions:**

1. **Check if lazy loading is enabled:**
```python
from xwlazy.lazy import get_lazy_install_stats
stats = get_lazy_install_stats("xwsystem")
print(f"Enabled: {stats.get('enabled', False)}")
```

2. **Verify mode configuration:**
```python
from xwlazy.lazy import get_lazy_install_stats
stats = get_lazy_install_stats("xwsystem")
print(f"Mode: {stats.get('mode', 'unknown')}")
```

3. **Check for allow list restrictions:**
```python
# If using allow list, ensure package is included
from xwlazy.lazy import set_package_allow_list
set_package_allow_list("xwsystem", ["missing-package"])
```

4. **Verify PEP 668 compliance:**
```python
# xwlazy respects PEP 668 - check if environment is externally managed
# Use virtual environment if needed
```

### Import Errors After Installation

**Symptoms:**
- Package installed but still can't import
- ModuleNotFoundError after successful installation

**Solutions:**

1. **Clear import cache:**
```python
import sys
if 'missing-module' in sys.modules:
    del sys.modules['missing-module']
```

2. **Restart Python process:**
```python
# Some packages require process restart after installation
```

3. **Check installation location:**
```python
import subprocess
result = subprocess.run(['pip', 'show', 'package-name'], capture_output=True)
print(result.stdout.decode())
```

### Security Policy Blocking Installation

**Symptoms:**
- Installation blocked by allow list
- Deny list preventing installation

**Solutions:**

1. **Check allow list:**
```python
from xwlazy.lazy import get_lazy_install_stats
stats = get_lazy_install_stats("xwsystem")
print(f"Allow list: {stats.get('allow_list', [])}")
```

2. **Add to allow list:**
```python
from xwlazy.lazy import set_package_allow_list
set_package_allow_list("xwsystem", ["blocked-package"])
```

3. **Remove from deny list:**
```python
from xwlazy.lazy import set_package_deny_list
# Clear deny list or remove specific package
```

### Performance Issues

**Symptoms:**
- Slow first import
- High memory usage
- Cache not working

**Solutions:**

1. **Enable caching:**
```python
# Caching is enabled by default
# Check cache statistics
stats = get_lazy_install_stats("xwsystem")
print(f"Cache hits: {stats.get('cache_hits', 0)}")
```

2. **Use full mode for pre-installation:**
```python
config_package_lazy_install_enabled("xwsystem", enabled=True, mode="full")
```

3. **Monitor memory usage:**
```python
import psutil
process = psutil.Process()
print(f"Memory: {process.memory_info().rss / 1024 / 1024} MB")
```

## Debug Mode Usage

### Enable Debug Logging

```python
import logging
logging.basicConfig(level=logging.DEBUG)

# xwlazy will log detailed information
from xwlazy.lazy import config_package_lazy_install_enabled
config_package_lazy_install_enabled("xwsystem", enabled=True, mode="smart")
```

### Verbose Statistics

```python
from xwlazy.lazy import get_lazy_install_stats

stats = get_lazy_install_stats("xwsystem", verbose=True)
print(stats)
```

### Installation Logging

```python
# Check installation logs
from xwlazy.lazy import get_lazy_install_stats

stats = get_lazy_install_stats("xwsystem")
print(f"Installed packages: {stats.get('installed_packages', [])}")
print(f"Failed packages: {stats.get('failed_packages', [])}")
```

## Performance Debugging

### Measure Import Time

```python
import time

start = time.perf_counter()
from exonware.xwsystem import AvroSerializer
end = time.perf_counter()

print(f"Import time: {(end - start) * 1000:.2f} ms")
```

### Cache Hit Rate

```python
from xwlazy.lazy import get_lazy_install_stats

stats = get_lazy_install_stats("xwsystem")
hits = stats.get('cache_hits', 0)
misses = stats.get('cache_misses', 0)
total = hits + misses

if total > 0:
    hit_rate = hits / total * 100
    print(f"Cache hit rate: {hit_rate:.2f}%")
```

### Memory Profiling

```python
import tracemalloc

tracemalloc.start()
# Your code here
current, peak = tracemalloc.get_traced_memory()
print(f"Current memory: {current / 1024 / 1024:.2f} MB")
print(f"Peak memory: {peak / 1024 / 1024:.2f} MB")
tracemalloc.stop()
```

## Integration Issues

### Circular Import Errors

**Symptoms:**
- ImportError: cannot import name
- Circular dependency warnings

**Solutions:**

1. **Use lazy imports:**
```python
# Instead of top-level import
def get_serializer():
    from exonware.xwsystem import AvroSerializer
    return AvroSerializer()
```

2. **Delay imports:**
```python
# Import inside functions/methods
class MyClass:
    def method(self):
        from exonware.xwsystem import AvroSerializer
        # Use serializer
```

### Package Isolation Issues

**Symptoms:**
- Packages interfering with each other
- Mode conflicts

**Solutions:**

1. **Verify per-package isolation:**
```python
# Each package has independent configuration
config_package_lazy_install_enabled("xwsystem", enabled=True, mode="smart")
config_package_lazy_install_enabled("xwdata", enabled=True, mode="lite")
```

2. **Check for conflicts:**
```python
from xwlazy.lazy import get_lazy_install_stats

stats_xwsystem = get_lazy_install_stats("xwsystem")
stats_xwdata = get_lazy_install_stats("xwdata")
# Compare configurations
```

### Environment Variable Issues

**Symptoms:**
- Configuration not applying
- Environment variables ignored

**Solutions:**

1. **Check environment variables:**
```python
import os
print(f"XWLAZY_MODE: {os.getenv('XWLAZY_MODE')}")
print(f"XWSYSTEM_LAZY_MODE: {os.getenv('XWSYSTEM_LAZY_MODE')}")
```

2. **Set explicitly in code:**
```python
# Don't rely on environment variables
config_package_lazy_install_enabled("xwsystem", enabled=True, mode="smart")
```

## Getting Help

### Check Documentation

- [README](../README.md) - Main documentation
- [Integration Guide](INTEGRATION_GUIDE.md) - Integration examples
- [Best Practices](BEST_PRACTICES.md) - Best practices guide

### Collect Debug Information

```python
from xwlazy.lazy import get_lazy_install_stats
import sys

# System information
print(f"Python version: {sys.version}")
print(f"Platform: {sys.platform}")

# xwlazy statistics
stats = get_lazy_install_stats("xwsystem")
print(f"xwlazy stats: {stats}")
```

### Report Issues

When reporting issues, include:
- Python version
- xwlazy version
- Error messages
- Debug statistics
- Configuration used
- Steps to reproduce

**Email:** connect@exonware.com

## Common Error Messages

### "Package blocked by allow list"

**Solution:** Add package to allow list or remove allow list restriction

### "PEP 668: Externally-managed environment"

**Solution:** Use virtual environment instead of system Python

### "Installation failed: [error]"

**Solution:** Check pip installation, network connectivity, and package availability

### "Circular import detected"

**Solution:** Use lazy imports or restructure code to avoid circular dependencies

---

**Last Updated:** January 2025

# YAML Circular Import Issue - Root Cause Analysis

**Company:** eXonware.com  
**Author:** Eng. Muhammad AlShehri  
**Email:** connect@exonware.com  
**Version:** 0.1.0.18  
**Last Updated:** 19-Nov-2025

## 🎯 AI-Friendly Document

**This document is designed for both human developers and AI assistants.**  
Root cause analysis of YAML circular import issue that occurs when using xwlazy with xwsystem.

**Related Documents:**
- [REF_13_ARCH.md](../REF_13_ARCH.md) - System architecture
- [docs/guides/GUIDE_DOCS.md](../guides/GUIDE_DOCS.md) - Documentation standards

---

## 🎯 Executive Summary

**Root Cause:** The circular import error occurs in `xwsystem`, not `xwlazy`. The `xwsystem.io.serialization.formats.text.yaml` module performs a **top-level import** of `yaml` (PyYAML), which happens during `xwsystem.__init__` **before** lazy mode can intercept it.

**Status:** 🔴 **ISSUE IDENTIFIED - Requires Fix in xwsystem**

**Why this matters:** This blocks lazy mode usage with xwsystem, affecting usability (Priority #2). The fix must be applied in the xwsystem repository.

---

## 🔍 Root Cause Analysis

### Error Trace

```
File "d:\OneDrive\DEV\exonware\xwsystem\examples\lazy_mode_usage\json_run.py", line 61
  from exonware.xwsystem.version import get_version
  File "D:\OneDrive\DEV\exonware\xwsystem\src\exonware\xwsystem\__init__.py", line 77
    from .io.serialization import (
  File "D:\OneDrive\DEV\exonware\xwsystem\src\exonware\xwsystem\io\__init__.py", line 148
    from . import serialization
  File "D:\OneDrive\DEV\exonware\xwsystem\src\exonware\xwsystem\io\serialization\__init__.py", line 36
    from .formats.text import (
  File "D:\OneDrive\DEV\exonware\xwsystem\src\exonware\xwsystem\io\serialization\formats\text\__init__.py", line 6
    from .yaml import YamlSerializer
  File "D:\OneDrive\DEV\exonware\xwsystem\src\exonware\xwsystem\io\serialization\formats\text\yaml.py", line 26
    import yaml
  File "C:\Users\muham\AppData\Roaming\Python\Python312\site-packages\yaml\__init__.py", line 13
    from .cyaml import *
  File "C:\Users\muham\AppData\Roaming\Python\Python312\site-packages\yaml\cyaml.py", line 7
    from yaml._yaml import CParser, CEmitter
  File "yaml/_yaml.pyx", line 16, in init yaml._yaml
AttributeError: partially initialized module 'yaml' has no attribute 'error'
```

### Problem Chain

1. **User script imports xwsystem:**
   ```python
   from exonware.xwsystem.version import get_version
   ```

2. **xwsystem.__init__ imports serialization:**
   ```python
   from .io.serialization import (
       # ... imports ...
   )
   ```

3. **serialization/__init__.py imports text formats:**
   ```python
   from .formats.text import (
       # ... includes YamlSerializer ...
   )
   ```

4. **formats/text/__init__.py imports yaml module:**
   ```python
   from .yaml import YamlSerializer
   ```

5. **yaml.py performs top-level import:**
   ```python
   # Line 26 in yaml.py
   import yaml  # ❌ This happens at module level!
   ```

6. **PyYAML module has circular dependency:**
   - `yaml/__init__.py` imports from `yaml.cyaml`
   - `yaml.cyaml` imports from `yaml._yaml`
   - `yaml._yaml` tries to access `yaml.error` before `yaml` module is fully initialized
   - **Result:** `AttributeError: partially initialized module 'yaml' has no attribute 'error'`

---

## 🎯 Root Cause

**The import happens at module level, before lazy mode can intercept it.**

### Current Code (xwsystem):
```python
# xwsystem/io/serialization/formats/text/yaml.py
# Line 26 - TOP-LEVEL IMPORT ❌
import yaml  # This executes immediately when module is imported
```

### Why This Fails:
1. **Module-level imports execute immediately** when Python loads the module
2. **Lazy mode hook** (`LazyMetaPathFinder`) only intercepts imports that go through `importlib.import_module()`
3. **Top-level imports** in `xwsystem` execute **before** the lazy hook can handle missing packages
4. **PyYAML has internal circular dependency** that causes the error even when installed

**Why this is a problem:** Lazy mode cannot intercept module-level imports that execute during package initialization. This affects usability (Priority #2) by preventing lazy mode from working with xwsystem.

---

## ✅ Solution

**Fix in xwsystem:** Make the yaml import **lazy** (deferred until actually needed).

### Recommended Fix:

```python
# xwsystem/io/serialization/formats/text/yaml.py

# ❌ REMOVE: Top-level import
# import yaml

# ✅ ADD: Lazy import inside methods
class YamlSerializer(ASerialization):
    def encode(self, data: Any, options: Optional[EncodeOptions] = None) -> bytes:
        # Lazy import - only when actually needed
        import yaml  # ✅ Import here, not at module level
        # ... rest of method ...
    
    def decode(self, data: bytes, options: Optional[DecodeOptions] = None) -> Any:
        # Lazy import - only when actually needed
        import yaml  # ✅ Import here, not at module level
        # ... rest of method ...
```

**Why this works:** Lazy imports allow xwlazy to intercept and install PyYAML before it's actually used, enabling lazy mode to work correctly.

### Alternative: Use Import Helper

```python
# xwsystem/io/serialization/formats/text/yaml.py

def _get_yaml():
    """Lazy import helper for yaml module."""
    import yaml
    return yaml

class YamlSerializer(ASerialization):
    def encode(self, data: Any, options: Optional[EncodeOptions] = None) -> bytes:
        yaml = _get_yaml()  # ✅ Lazy import
        # ... rest of method ...
```

**Why this alternative:** Centralizes lazy import logic, making it easier to maintain and reuse.

---

## 📋 Verification

**xwlazy does NOT have this issue:**
- ✅ xwlazy does **not** import yaml at module level
- ✅ xwlazy only references yaml in dependency mappings (`defs.py`)
- ✅ xwlazy does **not** require PyYAML as a dependency

**xwsystem has the issue:**
- ❌ xwsystem imports yaml at module level in `yaml.py`
- ❌ This happens during `xwsystem.__init__` before lazy mode can help
- ❌ PyYAML's internal circular dependency causes the error

---

## 🎯 Action Items

1. **Fix xwsystem:** Move `import yaml` from module level to method level in `yaml.py`
2. **Test:** Verify that lazy mode can now handle missing PyYAML
3. **Document:** Update xwsystem documentation about lazy imports for optional dependencies

---

## 📝 Related Files

- **Issue location:** `xwsystem/src/exonware/xwsystem/io/serialization/formats/text/yaml.py:26`
- **Import chain:** `xwsystem.__init__.py` → `io/__init__.py` → `serialization/__init__.py` → `formats/text/__init__.py` → `yaml.py`
- **xwlazy status:** ✅ No changes needed - issue is in xwsystem

---

**Priority:** 🔴 **HIGH** - Blocks lazy mode usage with xwsystem  
**Fix Location:** `xwsystem` repository, not `xwlazy`

---

*Part of xwlazy version 0.1.0.18*


# Demo App - xwlazy v4.0 Auto-Installation Example

**Version:** 1.0.0  
**Status:** ✅ **Working Example**

---

## 🎯 Overview

This is a simple demonstration of **xwlazy v4.0** auto-installation feature. The app imports external libraries (`requests`, `yaml`, `numpy`) that are listed in `requirements.txt` but may not be installed initially. **xwlazy automatically installs them on-demand** when they are imported.

---

## 📁 Files

- **`__init__.py`** - One-line activation using `auto_enable_lazy(__package__)`
- **`demo.py`** - Main demo script that imports and uses external libraries
- **`requirements.txt`** - Lists dependencies (xwlazy installs them automatically)
- **`README.md`** - This file

---

## 🚀 Quick Start

### Step 1: Install xwlazy

```bash
cd /path/to/xwlazy
pip install -e .
```

### Step 2: Run the Demo

**Option A: Quick Demo (packages may already be installed)**
```bash
# From the xwlazy root directory
python examples/demo_app/demo.py
```

**Option B: Full Auto-Installation Test (uninstalls packages first, then reinstalls)**
```bash
# From the xwlazy root directory
python examples/demo_app/test_auto_install.py
```

This test script will:
1. Check which packages are currently installed
2. Uninstall them to simulate a clean environment
3. Import `demo_app` - This activates xwlazy via `auto_enable_lazy()`
4. Import packages - xwlazy will **automatically install** missing packages!

### Step 3: Watch the Magic! ✨

The demo will:
1. Import `demo_app` - This activates xwlazy via `auto_enable_lazy()`
2. Import `requests` - xwlazy **auto-installs** if missing
3. Import `yaml` (PyYAML) - xwlazy **auto-installs** if missing  
4. Import `numpy` - xwlazy **auto-installs** if missing

**All libraries are confirmed to be in `xwlazy_external_libs.toml`:**
- ✅ `requests` → `requests`
- ✅ `yaml` → `PyYAML`
- ✅ `numpy` → `numpy`

---

## 📋 How It Works

### 1. Activation (One Line!)

In `__init__.py`:
```python
from exonware.xwlazy import auto_enable_lazy
auto_enable_lazy(__package__)
```

That's it! This single line activates xwlazy for the entire package.

### 2. Automatic Installation

When you import a missing package:
```python
import requests  # xwlazy intercepts ImportError and installs requests automatically!
```

xwlazy:
- Detects the missing package
- Checks `requirements.txt` for version constraints
- Checks `xwlazy_external_libs.toml` for import-to-package mapping
- Installs the package using pip
- Retries the import
- Returns the imported module

### 3. Audit Trail

All installations are logged to:
- **`xwlazy_sbom.toml`** - Software Bill of Materials (installation audit log)
- **`xwlazy.lock.toml`** - Lockfile with installed package versions

---

## 🔍 What Libraries Are Used

| Library | Import Name | Package Name | In TOML? |
|---------|-------------|--------------|----------|
| requests | `requests` | `requests` | ✅ Yes |
| PyYAML | `yaml` | `PyYAML` | ✅ Yes |
| numpy | `numpy` | `numpy` | ✅ Yes |

All libraries are already mapped in `xwlazy/src/exonware/xwlazy_external_libs.toml`.

---

## 📝 Example Output

```
======================================================================
xwlazy v4.0 Auto-Installation Demo
======================================================================

✅ demo_app imported - xwlazy is now active!
   Package: demo_app
   Version: 1.0.0

📦 Example 1: Importing 'requests' (HTTP library)
----------------------------------------------------------------------
[INSTALL] [xwlazy] Blocking Install: requests (strategy: smart)...
[OK] [xwlazy] Installed: requests via smart (2.34s)
✅ requests imported successfully!
   Version: 2.31.0
   Status: requests is ready to use

📦 Example 2: Importing 'yaml' (YAML parser)
----------------------------------------------------------------------
[INSTALL] [xwlazy] Blocking Install: yaml (strategy: smart)...
[OK] [xwlazy] Installed: PyYAML via smart (1.23s)
✅ yaml imported successfully!
   YAML serialization works: 45 bytes

📦 Example 3: Importing 'numpy' (Numerical library)
----------------------------------------------------------------------
[INSTALL] [xwlazy] Blocking Install: numpy (strategy: smart)...
[OK] [xwlazy] Installed: numpy via smart (15.67s)
✅ numpy imported successfully!
   Version: 1.24.0
   Array created: [1 2 3 4 5]
   Mean: 3.00

======================================================================
🎉 Demo Complete!
======================================================================

What happened:
1. ✅ Imported demo_app - activated xwlazy via auto_enable_lazy()
2. ✅ Imported requests - auto-installed if missing
3. ✅ Imported yaml (PyYAML) - auto-installed if missing
4. ✅ Imported numpy - auto-installed if missing

All dependencies were automatically installed from requirements.txt!
Check xwlazy_sbom.toml for the installation audit log.
```

---

## 🎨 Alternative Import Styles

xwlazy v4.0 supports both import styles:

### Option 1: Full namespace (Recommended)
```python
from exonware.xwlazy import auto_enable_lazy
auto_enable_lazy(__package__)
```

### Option 2: Direct import (Convenience)
```python
import xwlazy
xwlazy.auto_enable_lazy(__package__)
```

Both work identically!

---

## 🔧 Troubleshooting

### Issue: Libraries not installing

**Solution:** Make sure the libraries are in `xwlazy_external_libs.toml`:
- ✅ `requests` → `requests`
- ✅ `yaml` → `PyYAML`
- ✅ `numpy` → `numpy`

### Issue: ImportError still occurs

**Solution:** Check verbose mode:
```bash
export XWLAZY_VERBOSE=1  # Linux/Mac
set XWLAZY_VERBOSE=1     # Windows
python examples/demo_app/demo.py
```

### Issue: PEP 668 error (externally-managed environment)

**Solution:** Use a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # Linux/Mac
venv\Scripts\activate     # Windows
pip install -e .
```

---

## 📚 Related Documentation

- [XWLAZY_LITE.md](../../docs/XWLAZY_LITE.md) - Complete xwlazy v4.0 documentation
- [README.md](../../README.md) - Main xwlazy documentation
- [xwlazy_external_libs.toml](../../src/exonware/xwlazy_external_libs.toml) - Library mappings

---

## 💡 Key Takeaways

1. **One-line activation** - `auto_enable_lazy(__package__)` is all you need!
2. **Automatic installation** - Dependencies install automatically when imported
3. **Requirements.txt support** - Version constraints from requirements.txt are respected
4. **TOML mappings** - Import names are mapped to package names via `xwlazy_external_libs.toml`
5. **Audit trail** - All installations logged to `xwlazy_sbom.toml` and `xwlazy.lock.toml`

---

**That's it! xwlazy v4.0 makes dependency management effortless!** 🚀

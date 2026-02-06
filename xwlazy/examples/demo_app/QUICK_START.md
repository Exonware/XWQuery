# Quick Start: xwlazy v4.0 Auto-Installation Demo

**Status:** ✅ **Working Example**  
**Version:** 1.0.0

---

## 🚀 Fastest Way to See It in Action

### Step 1: Install xwlazy

```bash
cd /path/to/xwlazy
pip install -e .
```

### Step 2: Run the Auto-Installation Test

```bash
# This will uninstall packages first, then auto-install them via xwlazy
python examples/demo_app/test_auto_install.py
```

**What You'll See:**
```
Step 1: Checking current installation status...
  - requests: ❌ Not installed
  - yaml (PyYAML): ❌ Not installed  
  - numpy: ❌ Not installed

Step 2: Uninstalling packages to test auto-installation...
  (packages are already not installed - perfect for testing!)

Step 3: Activating xwlazy by importing demo_app...
  ✅ demo_app imported - xwlazy is now active!

Step 4: Importing packages - xwlazy will auto-install if missing!
  📦 Testing 'requests' import...
  [INSTALL] [xwlazy] Blocking Install: requests (strategy: pip)...
  [OK] [xwlazy] Installed: requests via pip (1.4s)
  ✅ requests imported successfully!
  
  📦 Testing 'yaml' (PyYAML) import...
  [INSTALL] [xwlazy] Blocking Install: yaml (strategy: pip)...
  [OK] [xwlazy] Installed: PyYAML via pip (1.38s)
  ✅ yaml imported successfully!
  
  📦 Testing 'numpy' import...
  [INSTALL] [xwlazy] Blocking Install: numpy (strategy: pip)...
  [OK] [xwlazy] Installed: numpy via pip (15.67s)
  ✅ numpy imported successfully!
```

---

## 📋 What This Demonstrates

1. ✅ **One-line activation** - `auto_enable_lazy(__package__)` in `__init__.py`
2. ✅ **Auto-installation from requirements.txt** - Packages install automatically
3. ✅ **TOML mapping support** - Import names mapped via `xwlazy_external_libs.toml`
4. ✅ **Import mapping** - `yaml` → `PyYAML` automatically resolved
5. ✅ **Both import styles work** - `import exonware.xwlazy` and `import xwlazy`

---

## 📁 Files Structure

```
examples/demo_app/
├── __init__.py          # One-line: auto_enable_lazy(__package__)
├── demo.py              # Simple demo script
├── test_auto_install.py # Full test (uninstalls packages first)
├── requirements.txt     # Dependencies (requests, PyYAML, numpy)
└── README.md            # Complete documentation
```

---

## ✅ Verified Libraries in TOML

All demo libraries are confirmed in `xwlazy/src/exonware/xwlazy_external_libs.toml`:
- ✅ `"requests" = "requests"` (line 82)
- ✅ `"yaml" = "PyYAML"` (line 105)  
- ✅ `"numpy" = "numpy"` (line 29)

---

## 🎯 Key Takeaway

**One line in `__init__.py` enables automatic dependency installation for your entire package!**

```python
from exonware.xwlazy import auto_enable_lazy
auto_enable_lazy(__package__)
```

That's it! Dependencies from `requirements.txt` install automatically when imported.

---

**xwlazy v4.0 makes dependency management effortless!** 🚀

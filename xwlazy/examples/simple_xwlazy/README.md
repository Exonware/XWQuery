# Simple xwlazy Example

**Company:** eXonware.com  
**Author:** Eng. Muhammad AlShehri  
**Email:** connect@exonware.com  
**Version:** 0.1.0.18  
**Generation Date:** 15-Nov-2025

## 🎯 Overview

This is the **simplest possible example** of how to hook xwlazy for automatic lazy installation and lazy loading.

## 📁 Files

- **`__init__.py`** - Shows the one-liner hook (just 1 line!)
- **`standalone_example.py`** - **RECOMMENDED**: Standalone example that works without installing the package
- **`example_usage.py`** - Demonstrates auto-installation by importing the package
- **`example_with_custom_strategies.py`** - Shows how to use custom strategies

## 🚀 Quick Start

### Recommended: Run the Standalone Example

The easiest way to see xwlazy in action:

```bash
# Make sure xwlazy is installed first
pip install -e /path/to/xwlazy

# Run the standalone example
python examples/simple_xwlazy/standalone_example.py
```

This example shows the hook directly without needing to install the example package.

### Step 1: The Hook (One Line!)

In your package's `__init__.py`:

```python
from exonware.xwlazy import config_package_lazy_install_enabled
config_package_lazy_install_enabled(__name__.split('.')[0], install_hook=True)
```

**That's it!** Your package now has automatic lazy installation.

### Step 2: Use It

```python
# Import your package (this hooks xwlazy)
import simple_xwlazy

# Import any package - it will be auto-installed if missing!
import pandas  # <- Automatically installed if not present
import numpy   # <- Automatically installed if not present
```

**Note:** To run `example_usage.py`, you need to install xwlazy in editable mode first:
```bash
cd /path/to/xwlazy
pip install -e .
```

## 📖 How It Works

1. **Hook Installation**: When `simple_xwlazy` is imported, the `__init__.py` runs and hooks xwlazy
2. **Auto-Installation**: When you import a missing package (like `pandas`), xwlazy intercepts the import and installs it automatically
3. **Auto-Loading**: Modules are loaded lazily (on-demand) for better performance

## 🎨 Custom Strategies

See `example_with_custom_strategies.py` for how to configure:
- **Package strategies**: How packages are installed (execution, timing, discovery, policy, mapping)
- **Module strategies**: How modules are loaded (helper, manager, caching)

## 🔍 What Happens Behind the Scenes

1. `config_package_lazy_install_enabled()` registers your package with xwlazy
2. `install_hook=True` installs an import hook that intercepts `ImportError`
3. When a missing package is imported, xwlazy:
   - Detects the missing package
   - Installs it automatically using pip
   - Retries the import
   - Returns the imported module

## 📝 Example Output

When you run `example_usage.py`:

```
✅ simple_xwlazy imported - xwlazy is now active!
✅ pandas imported successfully!
   Pandas version: 2.0.0
✅ Created DataFrame successfully!
   DataFrame:
      a  b
   0  1  4
   1  2  5
   2  3  6
✅ numpy imported successfully!
   NumPy version: 1.24.0

🎉 Example complete! xwlazy handled everything automatically.
```

## 🔗 Related Documentation

- [HOOKING_GUIDE.md](../../docs/HOOKING_GUIDE.md) - Complete guide on hooking and extending xwlazy
- [REF_ARCH.md](../../docs/REF_ARCH.md) - System architecture
- [README.md](../../README.md) - Main xwlazy documentation

## 💡 Key Takeaway

**One line in `__init__.py` = Automatic lazy installation for your entire package!**

```python
config_package_lazy_install_enabled(__name__.split('.')[0], install_hook=True)
```


# Competition Benchmark: xwlazy vs. Lazy Import Libraries

**Purpose:** Comprehensive performance comparison of xwlazy against competing lazy import libraries.

**Date:** November 2025  
**Version:** 1.0.0

---

## 📚 Libraries Tested

### 1. **pipimport**
- **PyPI Name:** `pipimport`
- **GitHub:** https://github.com/chaosct/pipimport
- **Description:** Automatic pip installation on import failure

### 2. **deferred-import**
- **PyPI Name:** `deferred-import`
- **GitHub:** https://github.com/orsinium-labs/deferred-import
- **Description:** Deferred import mechanism

### 3. **lazy-loader**
- **PyPI Name:** `lazy-loader`
- **GitHub:** https://github.com/scientific-python/lazy-loader
- **Description:** Lazy loading for scientific Python packages

### 4. **lazy-imports**
- **PyPI Name:** `lazy-imports`
- **GitHub:** https://github.com/bachorp/lazy-imports
- **Description:** Lazy import system

### 5. **lazy_import**
- **PyPI Name:** `lazy-import`
- **GitHub:** https://github.com/mnmelo/lazy_import
- **Description:** Lazy import implementation

### 6. **pylazyimports**
- **PyPI Name:** `pylazyimports`
- **GitHub:** https://github.com/hmiladhia/lazyimports
- **Description:** Python lazy imports

### 7. **lazi**
- **PyPI Name:** `lazi`
- **GitHub:** https://github.com/sitbon/lazi
- **Description:** Lazy import system

### 8. **lazy-imports-lite**
- **PyPI Name:** `lazy-imports-lite`
- **GitHub:** https://github.com/15r10nk/lazy-imports-lite
- **Description:** Lightweight lazy imports

### 9. **xwlazy** (Our Library)
- **PyPI Name:** `xwlazy` (or `exonware-xwlazy`)
- **GitHub:** (Internal eXonware project)
- **Description:** Advanced lazy loading with auto-installation, keyword detection, and per-package isolation

---

## 🎯 Benchmark Metrics

### Performance Metrics
1. **Import Time:** Time to import modules (cold start and warm)
2. **Memory Usage:** Peak and average memory consumption
3. **Package Size:** Disk footprint of installed packages
4. **Feature Support:** Available features per library

### Test Scenarios
1. **Light Load:** Single module import
2. **Medium Load:** Multiple module imports (10-50 modules)
3. **Heavy Load:** Large-scale imports (100+ modules)
4. **Nested Imports:** Deep dependency chains
5. **Circular Dependencies:** Circular import handling
6. **Missing Dependencies:** Auto-installation capability

---

## 🚀 Usage

### Prerequisites
```bash
# Install required dependencies
pip install -r requirements.txt

# Or manually:
pip install psutil memory-profiler
```

### Quick Start
```bash
# Interactive mode (recommended)
python run_benchmark.py

# Or run directly
python benchmark_competition.py
```

### Run Specific Library
```bash
# Test only xwlazy
python benchmark_competition.py --library xwlazy

# Test all libraries (default)
python benchmark_competition.py --library all
```

### Run Specific Test
```bash
# Light load only
python benchmark_competition.py --test light_load

# Medium load only
python benchmark_competition.py --test medium_load

# Heavy load only
python benchmark_competition.py --test heavy_load

# All tests (default)
python benchmark_competition.py --test all
```

### Feature Comparison
```bash
# Compare features across all libraries
python feature_comparison.py
```

### Command Line Options
```bash
python benchmark_competition.py --help

Options:
  --library {xwlazy,pipimport,deferred-import,lazy-loader,lazy-imports,lazy_import,pylazyimports,lazi,lazy-imports-lite,all}
                        Library to test (default: all)
  --test {light_load,medium_load,heavy_load,all}
                        Test to run (default: all)
  --skip-uninstall     Skip uninstall step (for debugging)
```

---

## 📊 Results

Results are saved to:
- `output_log/` directory (JSON and Markdown files)
- Files follow naming convention: `BENCH_YYYYMMDD_HHMM_DESCRIPTION.{json,md}`

**Example:**
- `BENCH_20251117_0415_COMPETITION.json` - JSON results
- `BENCH_20251117_0415_COMPETITION.md` - Markdown report

---

## 🔧 Features Tested

### Core Features
- ✅ Basic lazy import
- ✅ Deferred loading
- ✅ Import hook installation
- ✅ Module caching
- ✅ Thread safety

### Advanced Features
- ✅ Auto-installation on missing imports
- ✅ Keyword-based detection
- ✅ Per-package isolation
- ✅ Performance monitoring
- ✅ Memory leak prevention
- ✅ Circular dependency handling

---

## 📝 Notes

- Each library is **uninstalled before testing** to ensure clean state
- Tests run in isolated subprocesses to prevent interference
- Memory measurements use `psutil` for accuracy
- Package sizes measured after installation
- Output files follow GUIDE_DOCS.md naming conventions

---

## 🤝 Contributing

To add new test scenarios or libraries, edit:
- `benchmark_competition.py` - Main benchmark script
- `test_scenarios.py` - Test scenario definitions
- `library_adapters.py` - Library-specific adapters


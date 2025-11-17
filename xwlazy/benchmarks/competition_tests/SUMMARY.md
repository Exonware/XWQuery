# Competition Benchmark Summary

## Overview

This benchmark project compares **xwlazy** against 8 competing lazy import libraries to measure:
- ⏱️ **Performance** (import time)
- 💾 **Memory Usage** (peak and average)
- 📦 **Package Size** (disk footprint)
- ✨ **Feature Support** (available capabilities)

## Libraries Tested

All libraries with their GitHub links:

1. **pipimport** - https://github.com/chaosct/pipimport
2. **deferred-import** - https://github.com/orsinium-labs/deferred-import
3. **lazy-loader** - https://github.com/scientific-python/lazy-loader
4. **lazy-imports** - https://github.com/bachorp/lazy-imports
5. **lazy_import** - https://github.com/mnmelo/lazy_import
6. **pylazyimports** - https://github.com/hmiladhia/lazyimports
7. **lazi** - https://github.com/sitbon/lazi
8. **lazy-imports-lite** - https://github.com/15r10nk/lazy-imports-lite
9. **xwlazy** - (Internal eXonware project)

## Project Structure

```
xwlazy/benchmarks/competition_tests/
├── README.md                    # Main documentation
├── SUMMARY.md                   # This file
├── benchmark_competition.py     # Main benchmark script
├── feature_comparison.py        # Feature comparison script
├── library_adapters.py          # Library-specific adapters
├── test_scenarios.py            # Test scenario definitions
├── run_benchmark.py             # Quick start script
├── verify_setup.py              # Setup verification script
├── requirements.txt             # Python dependencies
├── .gitignore                   # Git ignore rules
└── output_log/                  # Benchmark results (BENCH_*.json and BENCH_*.md)
```

## Key Features

### Automatic Cleanup
- Each library is **uninstalled before testing** to ensure clean state
- Prevents interference between tests
- Ensures accurate measurements

### Comprehensive Testing
- **Light Load**: Single module import
- **Medium Load**: Multiple module imports (10-50)
- **Heavy Load**: Large-scale imports (100+)
- **Feature Detection**: Automatic feature discovery

### Multiple Metrics
- **Time**: Import time in milliseconds
- **Memory**: Peak and average memory usage
- **Size**: Package disk footprint
- **Features**: Supported capabilities

### Extensible Design
- Easy to add new libraries
- Custom test scenarios
- Library-specific adapters
- Feature detection system

## Quick Start

```bash
# Navigate to benchmark directory
cd xwlazy/benchmarks/competition_tests

# Install dependencies
pip install -r requirements.txt

# Verify setup
python verify_setup.py

# Run all benchmarks
python benchmark_competition.py

# Or use interactive mode
python run_benchmark.py

# Compare features
python feature_comparison.py
```

## Results Format

Results are saved in `output_log/` directory following GUIDE_DOCS.md naming conventions:

1. **JSON** (`BENCH_YYYYMMDD_HHMM_DESCRIPTION.json`)
   - Machine-readable format
   - Complete data for analysis
   - Example: `BENCH_20251117_0415_COMPETITION.json`

2. **Markdown** (`BENCH_YYYYMMDD_HHMM_DESCRIPTION.md`)
   - Human-readable format
   - Summary tables and detailed results
   - Example: `BENCH_20251117_0415_COMPETITION.md`

**Naming Convention:**
- Format: `BENCH_YYYYMMDD_HHMM_DESCRIPTION.{json,md}`
- Follows GUIDE_DOCS.md benchmark log naming standards
- YYYY: 4-digit year
- MM: 2-digit month
- DD: 2-digit day
- HH: 2-digit hour (24-hour format)
- MM: 2-digit minute
- DESCRIPTION: UPPERCASE_WITH_UNDERSCORES description

## Goals

The primary goal is to:
1. **Identify performance gaps** in xwlazy
2. **Discover missing features** compared to competitors
3. **Improve xwlazy** based on findings
4. **Document competitive advantages**

## Next Steps

After running benchmarks:
1. Analyze results in `output_log/` directory
2. Review BENCH_* reports
3. Identify areas for improvement
4. Implement optimizations
5. Re-run benchmarks to verify improvements

## Notes

- Tests run in isolated subprocesses when possible
- Memory measurements use `psutil` for accuracy
- Package sizes measured after installation
- Some libraries may fail to install (documented in results)
- Output files follow GUIDE_DOCS.md naming conventions


# Competition Benchmark Report

**Generated:** 2025-11-17T05:05:06.542244

## Basic Lazy Import

*Basic lazy import (fair comparison - all libraries)*

### Top 3 Rankings by Load Test

#### Enterprise Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 👑 | xwlazy | 34.42 | 92.27x |
| 2 🥈 | lazy_import | 35.23 | 94.45x |
| 3 🥉 | pylazyimports | 35.62 | 95.49x |

### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| deferred-import | enterprise_load | 36.29 | 97.30x | 37.66 | 0.00 | ✅ |
| lazi | enterprise_load | 36.54 | 97.96x | 74.09 | 0.00 | ✅ |
| lazy-imports | enterprise_load | 39.74 | 106.54x | 50.68 | 0.00 | ✅ |
| lazy-imports-lite | enterprise_load | 37.19 | 99.71x | 77.67 | 0.00 | ✅ |
| lazy-loader | enterprise_load | 36.20 | 97.04x | 44.43 | 0.00 | ✅ |
| lazy_import 🥈 | enterprise_load | 35.23 | 94.45x | 58.52 | 0.00 | ✅ |
| pipimport | enterprise_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pylazyimports 🥉 | enterprise_load | 35.62 | 95.49x | 66.22 | 0.00 | ✅ |
| xwlazy 👑 | enterprise_load | 34.42 | 92.27x | 88.21 | 0.00 | ✅ |

### Detailed Results

#### deferred-import

**Test:** enterprise_load

- Import Time: 36.29 ms
- Relative Time: 97.30x (vs baseline)
- Memory Peak: 37.66 MB
- Memory Avg: 31.48 MB
- Package Size: 0.00 MB
- Features: deferred_loading

#### lazi

**Test:** enterprise_load

- Import Time: 36.54 ms
- Relative Time: 97.96x (vs baseline)
- Memory Peak: 74.09 MB
- Memory Avg: 70.27 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

#### lazy-imports

**Test:** enterprise_load

- Import Time: 39.74 ms
- Relative Time: 106.54x (vs baseline)
- Memory Peak: 50.68 MB
- Memory Avg: 47.62 MB
- Package Size: 0.00 MB
- Features: lazy_import

#### lazy-imports-lite

**Test:** enterprise_load

- Import Time: 37.19 ms
- Relative Time: 99.71x (vs baseline)
- Memory Peak: 77.67 MB
- Memory Avg: 75.94 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

#### lazy-loader

**Test:** enterprise_load

- Import Time: 36.20 ms
- Relative Time: 97.04x (vs baseline)
- Memory Peak: 44.43 MB
- Memory Avg: 41.08 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

#### lazy_import 🥈

**Test:** enterprise_load 🥈

- Import Time: 35.23 ms
- Relative Time: 94.45x (vs baseline)
- Memory Peak: 58.52 MB
- Memory Avg: 54.66 MB
- Package Size: 0.00 MB
- Features: lazy_import

#### pipimport

**Test:** enterprise_load

- ❌ Error: Library pipimport is not compatible with Python 3 (Python 2 syntax detected)

#### pylazyimports 🥉

**Test:** enterprise_load 🥉

- Import Time: 35.62 ms
- Relative Time: 95.49x (vs baseline)
- Memory Peak: 66.22 MB
- Memory Avg: 62.42 MB
- Package Size: 0.00 MB
- Features: lazy_import

#### xwlazy 👑

**Test:** enterprise_load 👑

- Import Time: 34.42 ms
- Relative Time: 92.27x (vs baseline)
- Memory Peak: 88.21 MB
- Memory Avg: 82.97 MB
- Package Size: 0.00 MB
- Features: lazy_import, per_package_isolation, caching



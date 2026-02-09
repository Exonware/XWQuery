# Competition Benchmark Report

**Generated:** 2025-11-17T05:00:36.512986

## Basic Lazy Import

*Basic lazy import (fair comparison - all libraries)*

### Top 3 Rankings by Load Test

#### Heavy Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 👑 | lazy-imports | 12.82 | 29.15x |
| 2 🥈 | lazy_import | 12.84 | 29.19x |
| 3 🥉 | lazi | 12.97 | 29.48x |

#### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 👑 | lazi | 0.31 | 0.71x |
| 2 🥈 | xwlazy | 0.59 | 1.33x |
| 3 🥉 | pylazyimports | 0.68 | 1.54x |

#### Medium Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 👑 | lazy-imports | 3.69 | 8.39x |
| 2 🥈 | lazy-imports-lite | 3.87 | 8.80x |
| 3 🥉 | xwlazy | 3.93 | 8.93x |

### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| deferred-import | light_load | 0.80 | 1.82x | 26.09 | 0.00 | ✅ |
| deferred-import | medium_load | 4.02 | 9.15x | 27.37 | 0.00 | ✅ |
| deferred-import | heavy_load | 13.36 | 30.38x | 31.29 | 0.00 | ✅ |
| deferred-import | enterprise_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| lazi 👑 | light_load | 0.31 | 0.71x | 41.50 | 0.00 | ✅ |
| lazi | medium_load | 4.34 | 9.87x | 41.50 | 0.00 | ✅ |
| lazi 🥉 | heavy_load | 12.97 | 29.48x | 42.35 | 0.00 | ✅ |
| lazi | enterprise_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| lazy-imports | light_load | 1.13 | 2.56x | 35.83 | 0.00 | ✅ |
| lazy-imports 👑 | medium_load | 3.69 | 8.39x | 36.22 | 0.00 | ✅ |
| lazy-imports 👑 | heavy_load | 12.82 | 29.15x | 38.05 | 0.00 | ✅ |
| lazy-imports | enterprise_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| lazy-imports-lite | light_load | 0.68 | 1.56x | 42.46 | 0.00 | ✅ |
| lazy-imports-lite 🥈 | medium_load | 3.87 | 8.80x | 43.14 | 0.00 | ✅ |
| lazy-imports-lite | heavy_load | 13.95 | 31.72x | 43.75 | 0.00 | ✅ |
| lazy-imports-lite | enterprise_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| lazy-loader | light_load | 0.79 | 1.79x | 32.26 | 0.00 | ✅ |
| lazy-loader | medium_load | 4.06 | 9.22x | 33.56 | 0.00 | ✅ |
| lazy-loader | heavy_load | 15.35 | 34.89x | 34.99 | 0.00 | ✅ |
| lazy-loader | enterprise_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| lazy_import | light_load | 1.28 | 2.90x | 38.90 | 0.00 | ✅ |
| lazy_import | medium_load | 4.95 | 11.26x | 39.00 | 0.00 | ✅ |
| lazy_import 🥈 | heavy_load | 12.84 | 29.19x | 40.22 | 0.00 | ✅ |
| lazy_import | enterprise_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pipimport | light_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pipimport | medium_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pipimport | heavy_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pipimport | enterprise_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pylazyimports 🥉 | light_load | 0.68 | 1.54x | 41.34 | 0.00 | ✅ |
| pylazyimports | medium_load | 4.16 | 9.45x | 41.43 | 0.00 | ✅ |
| pylazyimports | heavy_load | 13.10 | 29.78x | 41.43 | 0.00 | ✅ |
| pylazyimports | enterprise_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| xwlazy 🥈 | light_load | 0.59 | 1.33x | 44.66 | 0.00 | ✅ |
| xwlazy 🥉 | medium_load | 3.93 | 8.93x | 45.97 | 0.00 | ✅ |
| xwlazy | heavy_load | 13.98 | 31.78x | 48.02 | 0.00 | ✅ |
| xwlazy | enterprise_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |

### Detailed Results

#### deferred-import

**Test:** light_load

- Import Time: 0.80 ms
- Relative Time: 1.82x (vs baseline)
- Memory Peak: 26.09 MB
- Memory Avg: 25.88 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** medium_load

- Import Time: 4.02 ms
- Relative Time: 9.15x (vs baseline)
- Memory Peak: 27.37 MB
- Memory Avg: 26.69 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** heavy_load

- Import Time: 13.36 ms
- Relative Time: 30.38x (vs baseline)
- Memory Peak: 31.29 MB
- Memory Avg: 29.33 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** enterprise_load

- ❌ Error: module 'collections' has no attribute 'abc'

#### lazi 👑

**Test:** light_load 👑

- Import Time: 0.31 ms
- Relative Time: 0.71x (vs baseline)
- Memory Peak: 41.50 MB
- Memory Avg: 41.50 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** medium_load

- Import Time: 4.34 ms
- Relative Time: 9.87x (vs baseline)
- Memory Peak: 41.50 MB
- Memory Avg: 41.50 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** heavy_load 🥉

- Import Time: 12.97 ms
- Relative Time: 29.48x (vs baseline)
- Memory Peak: 42.35 MB
- Memory Avg: 41.96 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** enterprise_load

- ❌ Error: module 'collections' has no attribute 'abc'

#### lazy-imports 👑

**Test:** light_load

- Import Time: 1.13 ms
- Relative Time: 2.56x (vs baseline)
- Memory Peak: 35.83 MB
- Memory Avg: 35.76 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load 👑

- Import Time: 3.69 ms
- Relative Time: 8.39x (vs baseline)
- Memory Peak: 36.22 MB
- Memory Avg: 36.02 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load 👑

- Import Time: 12.82 ms
- Relative Time: 29.15x (vs baseline)
- Memory Peak: 38.05 MB
- Memory Avg: 37.20 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- ❌ Error: module 'collections' has no attribute 'abc'

#### lazy-imports-lite 🥈

**Test:** light_load

- Import Time: 0.68 ms
- Relative Time: 1.56x (vs baseline)
- Memory Peak: 42.46 MB
- Memory Avg: 42.46 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** medium_load 🥈

- Import Time: 3.87 ms
- Relative Time: 8.80x (vs baseline)
- Memory Peak: 43.14 MB
- Memory Avg: 42.80 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** heavy_load

- Import Time: 13.95 ms
- Relative Time: 31.72x (vs baseline)
- Memory Peak: 43.75 MB
- Memory Avg: 43.45 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** enterprise_load

- ❌ Error: module 'collections' has no attribute 'abc'

#### lazy-loader

**Test:** light_load

- Import Time: 0.79 ms
- Relative Time: 1.79x (vs baseline)
- Memory Peak: 32.26 MB
- Memory Avg: 32.13 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** medium_load

- Import Time: 4.06 ms
- Relative Time: 9.22x (vs baseline)
- Memory Peak: 33.56 MB
- Memory Avg: 32.92 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** heavy_load

- Import Time: 15.35 ms
- Relative Time: 34.89x (vs baseline)
- Memory Peak: 34.99 MB
- Memory Avg: 34.29 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** enterprise_load

- ❌ Error: module 'collections' has no attribute 'abc'

#### lazy_import 🥈

**Test:** light_load

- Import Time: 1.28 ms
- Relative Time: 2.90x (vs baseline)
- Memory Peak: 38.90 MB
- Memory Avg: 38.85 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 4.95 ms
- Relative Time: 11.26x (vs baseline)
- Memory Peak: 39.00 MB
- Memory Avg: 38.95 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load 🥈

- Import Time: 12.84 ms
- Relative Time: 29.19x (vs baseline)
- Memory Peak: 40.22 MB
- Memory Avg: 39.66 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- ❌ Error: module 'collections' has no attribute 'abc'

#### pipimport

**Test:** light_load

- ❌ Error: Library pipimport is not compatible with Python 3 (Python 2 syntax detected)

**Test:** medium_load

- ❌ Error: Library pipimport is not compatible with Python 3 (Python 2 syntax detected)

**Test:** heavy_load

- ❌ Error: Library pipimport is not compatible with Python 3 (Python 2 syntax detected)

**Test:** enterprise_load

- ❌ Error: Library pipimport is not compatible with Python 3 (Python 2 syntax detected)

#### pylazyimports 🥉

**Test:** light_load 🥉

- Import Time: 0.68 ms
- Relative Time: 1.54x (vs baseline)
- Memory Peak: 41.34 MB
- Memory Avg: 41.34 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 4.16 ms
- Relative Time: 9.45x (vs baseline)
- Memory Peak: 41.43 MB
- Memory Avg: 41.38 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 13.10 ms
- Relative Time: 29.78x (vs baseline)
- Memory Peak: 41.43 MB
- Memory Avg: 41.43 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- ❌ Error: module 'collections' has no attribute 'abc'

#### xwlazy 🥈

**Test:** light_load 🥈

- Import Time: 0.59 ms
- Relative Time: 1.33x (vs baseline)
- Memory Peak: 44.66 MB
- Memory Avg: 44.66 MB
- Package Size: 0.00 MB
- Features: lazy_import, per_package_isolation, caching

**Test:** medium_load 🥉

- Import Time: 3.93 ms
- Relative Time: 8.93x (vs baseline)
- Memory Peak: 45.97 MB
- Memory Avg: 45.32 MB
- Package Size: 0.00 MB
- Features: lazy_import, per_package_isolation, caching

**Test:** heavy_load

- Import Time: 13.98 ms
- Relative Time: 31.78x (vs baseline)
- Memory Peak: 48.02 MB
- Memory Avg: 47.00 MB
- Package Size: 0.00 MB
- Features: lazy_import, per_package_isolation, caching

**Test:** enterprise_load

- ❌ Error: module 'collections' has no attribute 'abc'



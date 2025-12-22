# Competition Benchmark Report

**Generated:** 2025-11-17T04:42:08.648401

## Top 3 Rankings by Test Category

### Heavy Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 👑 | pylazyimports | 14.14 | 34.57x |
| 2 🥈 | lazy-imports | 14.22 | 34.75x |
| 3 🥉 | lazy-loader | 15.28 | 37.36x |

### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 👑 | lazi | 0.45 | 1.09x |
| 2 🥈 | pylazyimports | 0.53 | 1.31x |
| 3 🥉 | lazy-loader | 0.66 | 1.60x |

### Medium Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 👑 | lazy_import | 4.02 | 9.82x |
| 2 🥈 | lazy-imports | 4.32 | 10.55x |
| 3 🥉 | lazy-loader | 4.40 | 10.76x |

## Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| deferred-import | light_load | 1.04 | 2.54x | 25.67 | 0.00 | ✅ |
| deferred-import | medium_load | 7.61 | 18.59x | 27.13 | 0.00 | ✅ |
| deferred-import | heavy_load | 17.92 | 43.80x | 31.03 | 0.00 | ✅ |
| deferred-import | enterprise_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| lazi 👑 | light_load | 0.45 | 1.09x | 40.99 | 0.00 | ✅ |
| lazi | medium_load | 4.75 | 11.62x | 41.00 | 0.00 | ✅ |
| lazi | heavy_load | 17.27 | 42.20x | 41.21 | 0.00 | ✅ |
| lazi | enterprise_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| lazy-imports | light_load | 1.11 | 2.70x | 35.25 | 0.00 | ✅ |
| lazy-imports 🥈 | medium_load | 4.32 | 10.55x | 35.96 | 0.00 | ✅ |
| lazy-imports 🥈 | heavy_load | 14.22 | 34.75x | 37.66 | 0.00 | ✅ |
| lazy-imports | enterprise_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| lazy-imports-lite | light_load | 0.86 | 2.11x | 41.25 | 0.00 | ✅ |
| lazy-imports-lite | medium_load | 4.75 | 11.61x | 41.41 | 0.00 | ✅ |
| lazy-imports-lite | heavy_load | 21.06 | 51.48x | 42.20 | 0.00 | ✅ |
| lazy-imports-lite | enterprise_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| lazy-loader 🥉 | light_load | 0.66 | 1.60x | 32.05 | 0.00 | ✅ |
| lazy-loader 🥉 | medium_load | 4.40 | 10.76x | 33.18 | 0.00 | ✅ |
| lazy-loader 🥉 | heavy_load | 15.28 | 37.36x | 34.44 | 0.00 | ✅ |
| lazy-loader | enterprise_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| lazy_import | light_load | 0.95 | 2.31x | 38.36 | 0.00 | ✅ |
| lazy_import 👑 | medium_load | 4.02 | 9.82x | 38.38 | 0.00 | ✅ |
| lazy_import | heavy_load | 15.29 | 37.38x | 39.59 | 0.00 | ✅ |
| lazy_import | enterprise_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pipimport | light_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pipimport | medium_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pipimport | heavy_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pipimport | enterprise_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pylazyimports 🥈 | light_load | 0.53 | 1.31x | 40.74 | 0.00 | ✅ |
| pylazyimports | medium_load | 4.85 | 11.86x | 40.98 | 0.00 | ✅ |
| pylazyimports 👑 | heavy_load | 14.14 | 34.57x | 40.98 | 0.00 | ✅ |
| pylazyimports | enterprise_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| xwlazy | light_load | 0.71 | 1.73x | 43.42 | 0.00 | ✅ |
| xwlazy | medium_load | 5.20 | 12.71x | 44.86 | 0.00 | ✅ |
| xwlazy | heavy_load | 15.50 | 37.88x | 46.97 | 0.00 | ✅ |
| xwlazy | enterprise_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |

## Detailed Results

### deferred-import

**Test:** light_load

- Import Time: 1.04 ms
- Relative Time: 2.54x (vs baseline)
- Memory Peak: 25.67 MB
- Memory Avg: 25.46 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** medium_load

- Import Time: 7.61 ms
- Relative Time: 18.59x (vs baseline)
- Memory Peak: 27.13 MB
- Memory Avg: 26.42 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** heavy_load

- Import Time: 17.92 ms
- Relative Time: 43.80x (vs baseline)
- Memory Peak: 31.03 MB
- Memory Avg: 29.09 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** enterprise_load

- ❌ Error: module 'collections' has no attribute 'abc'

### lazi 👑

**Test:** light_load 👑

- Import Time: 0.45 ms
- Relative Time: 1.09x (vs baseline)
- Memory Peak: 40.99 MB
- Memory Avg: 40.99 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** medium_load

- Import Time: 4.75 ms
- Relative Time: 11.62x (vs baseline)
- Memory Peak: 41.00 MB
- Memory Avg: 41.00 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** heavy_load

- Import Time: 17.27 ms
- Relative Time: 42.20x (vs baseline)
- Memory Peak: 41.21 MB
- Memory Avg: 41.13 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** enterprise_load

- ❌ Error: module 'collections' has no attribute 'abc'

### lazy-imports 🥈

**Test:** light_load

- Import Time: 1.11 ms
- Relative Time: 2.70x (vs baseline)
- Memory Peak: 35.25 MB
- Memory Avg: 35.06 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load 🥈

- Import Time: 4.32 ms
- Relative Time: 10.55x (vs baseline)
- Memory Peak: 35.96 MB
- Memory Avg: 35.62 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load 🥈

- Import Time: 14.22 ms
- Relative Time: 34.75x (vs baseline)
- Memory Peak: 37.66 MB
- Memory Avg: 36.88 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- ❌ Error: module 'collections' has no attribute 'abc'

### lazy-imports-lite

**Test:** light_load

- Import Time: 0.86 ms
- Relative Time: 2.11x (vs baseline)
- Memory Peak: 41.25 MB
- Memory Avg: 41.25 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** medium_load

- Import Time: 4.75 ms
- Relative Time: 11.61x (vs baseline)
- Memory Peak: 41.41 MB
- Memory Avg: 41.33 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** heavy_load

- Import Time: 21.06 ms
- Relative Time: 51.48x (vs baseline)
- Memory Peak: 42.20 MB
- Memory Avg: 41.81 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** enterprise_load

- ❌ Error: module 'collections' has no attribute 'abc'

### lazy-loader 🥉

**Test:** light_load 🥉

- Import Time: 0.66 ms
- Relative Time: 1.60x (vs baseline)
- Memory Peak: 32.05 MB
- Memory Avg: 31.89 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** medium_load 🥉

- Import Time: 4.40 ms
- Relative Time: 10.76x (vs baseline)
- Memory Peak: 33.18 MB
- Memory Avg: 32.63 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** heavy_load 🥉

- Import Time: 15.28 ms
- Relative Time: 37.36x (vs baseline)
- Memory Peak: 34.44 MB
- Memory Avg: 33.82 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** enterprise_load

- ❌ Error: module 'collections' has no attribute 'abc'

### lazy_import 👑

**Test:** light_load

- Import Time: 0.95 ms
- Relative Time: 2.31x (vs baseline)
- Memory Peak: 38.36 MB
- Memory Avg: 38.36 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load 👑

- Import Time: 4.02 ms
- Relative Time: 9.82x (vs baseline)
- Memory Peak: 38.38 MB
- Memory Avg: 38.37 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 15.29 ms
- Relative Time: 37.38x (vs baseline)
- Memory Peak: 39.59 MB
- Memory Avg: 39.00 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- ❌ Error: module 'collections' has no attribute 'abc'

### pipimport

**Test:** light_load

- ❌ Error: Library pipimport is not compatible with Python 3 (Python 2 syntax detected)

**Test:** medium_load

- ❌ Error: Library pipimport is not compatible with Python 3 (Python 2 syntax detected)

**Test:** heavy_load

- ❌ Error: Library pipimport is not compatible with Python 3 (Python 2 syntax detected)

**Test:** enterprise_load

- ❌ Error: Library pipimport is not compatible with Python 3 (Python 2 syntax detected)

### pylazyimports 👑

**Test:** light_load 🥈

- Import Time: 0.53 ms
- Relative Time: 1.31x (vs baseline)
- Memory Peak: 40.74 MB
- Memory Avg: 40.68 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 4.85 ms
- Relative Time: 11.86x (vs baseline)
- Memory Peak: 40.98 MB
- Memory Avg: 40.87 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load 👑

- Import Time: 14.14 ms
- Relative Time: 34.57x (vs baseline)
- Memory Peak: 40.98 MB
- Memory Avg: 40.98 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- ❌ Error: module 'collections' has no attribute 'abc'

### xwlazy

**Test:** light_load

- Import Time: 0.71 ms
- Relative Time: 1.73x (vs baseline)
- Memory Peak: 43.42 MB
- Memory Avg: 43.42 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_install, keyword_detection, per_package_isolation, performance_monitoring, caching

**Test:** medium_load

- Import Time: 5.20 ms
- Relative Time: 12.71x (vs baseline)
- Memory Peak: 44.86 MB
- Memory Avg: 44.14 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_install, keyword_detection, per_package_isolation, performance_monitoring, caching

**Test:** heavy_load

- Import Time: 15.50 ms
- Relative Time: 37.88x (vs baseline)
- Memory Peak: 46.97 MB
- Memory Avg: 45.92 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_install, keyword_detection, per_package_isolation, performance_monitoring, caching

**Test:** enterprise_load

- ❌ Error: module 'collections' has no attribute 'abc'


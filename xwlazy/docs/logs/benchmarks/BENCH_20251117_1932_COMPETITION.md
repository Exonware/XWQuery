# Competition Benchmark Report

**Generated:** 2025-11-17T19:32:27.656777

## Standard Tests

### Basic Lazy Import

*Basic lazy import (fair comparison - all libraries)*

#### Top 3 Rankings by Load Test

##### Enterprise Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazi | 26.37 | 81.79x |
| 2 🥈 | pylazyimports | 27.00 | 83.75x |
| 3 🥉 | lazy-imports | 27.11 | 84.08x |

##### Heavy Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazi | 9.66 | 29.95x |
| 2 🥈 | lazy-imports-lite | 9.94 | 30.84x |
| 3 🥉 | deferred-import | 9.95 | 30.86x |

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazi | 0.53 | 1.63x |
| 2 🥈 | deferred-import | 0.63 | 1.94x |
| 3 🥉 | xwlazy | 0.64 | 2.00x |

##### Medium Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazi | 2.89 | 8.96x |
| 2 🥈 | deferred-import | 3.32 | 10.30x |
| 3 🥉 | lazy_import | 3.39 | 10.51x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| deferred-import 🥈 | light_load | 0.63 | 1.94x | 30.29 | 0.00 | ✅ |
| deferred-import 🥈 | medium_load | 3.32 | 10.30x | 31.15 | 0.00 | ✅ |
| deferred-import 🥉 | heavy_load | 9.95 | 30.86x | 34.67 | 0.00 | ✅ |
| deferred-import | enterprise_load | 27.47 | 85.22x | 43.64 | 0.00 | ✅ |
| lazi 🥇 | light_load | 0.53 | 1.63x | 72.87 | 0.00 | ✅ |
| lazi 🥇 | medium_load | 2.89 | 8.96x | 74.22 | 0.00 | ✅ |
| lazi 🥇 | heavy_load | 9.66 | 29.95x | 76.66 | 0.00 | ✅ |
| lazi 🥇 | enterprise_load | 26.37 | 81.79x | 83.27 | 0.00 | ✅ |
| lazy-imports | light_load | 0.71 | 2.20x | 49.81 | 0.00 | ✅ |
| lazy-imports | medium_load | 3.67 | 11.37x | 50.53 | 0.00 | ✅ |
| lazy-imports | heavy_load | 10.38 | 32.20x | 52.13 | 0.00 | ✅ |
| lazy-imports 🥉 | enterprise_load | 27.11 | 84.08x | 59.68 | 0.00 | ✅ |
| lazy-imports-lite | light_load | 0.75 | 2.33x | 83.38 | 0.00 | ✅ |
| lazy-imports-lite | medium_load | 3.60 | 11.16x | 84.62 | 0.00 | ✅ |
| lazy-imports-lite 🥈 | heavy_load | 9.94 | 30.84x | 86.61 | 0.00 | ✅ |
| lazy-imports-lite | enterprise_load | 31.54 | 97.83x | 88.69 | 0.00 | ✅ |
| lazy-loader | light_load | 0.76 | 2.35x | 43.75 | 0.00 | ✅ |
| lazy-loader | medium_load | 3.65 | 11.31x | 45.13 | 0.00 | ✅ |
| lazy-loader | heavy_load | 10.98 | 34.04x | 47.34 | 0.00 | ✅ |
| lazy-loader | enterprise_load | 27.89 | 86.50x | 49.79 | 0.00 | ✅ |
| lazy_import | light_load | 0.88 | 2.72x | 60.21 | 0.00 | ✅ |
| lazy_import 🥉 | medium_load | 3.39 | 10.51x | 61.38 | 0.00 | ✅ |
| lazy_import | heavy_load | 10.95 | 33.98x | 63.51 | 0.00 | ✅ |
| lazy_import | enterprise_load | 27.38 | 84.92x | 68.88 | 0.00 | ✅ |
| pipimport | light_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pipimport | medium_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pipimport | heavy_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pipimport | enterprise_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pylazyimports | light_load | 0.76 | 2.36x | 69.04 | 0.00 | ✅ |
| pylazyimports | medium_load | 4.06 | 12.60x | 70.12 | 0.00 | ✅ |
| pylazyimports | heavy_load | 10.29 | 31.91x | 70.18 | 0.00 | ✅ |
| pylazyimports 🥈 | enterprise_load | 27.00 | 83.75x | 72.73 | 0.00 | ✅ |
| xwlazy 🥉 | light_load | 0.64 | 2.00x | 88.70 | 0.00 | ✅ |
| xwlazy | medium_load | 3.64 | 11.29x | 89.01 | 0.00 | ✅ |
| xwlazy | heavy_load | 10.35 | 32.10x | 89.05 | 0.00 | ✅ |
| xwlazy | enterprise_load | 28.99 | 89.93x | 93.28 | 0.00 | ✅ |

#### Detailed Results

##### deferred-import 🥈

**Test:** light_load 🥈

- Import Time: 0.63 ms
- Relative Time: 1.94x (vs baseline)
- Memory Peak: 30.29 MB
- Memory Avg: 30.20 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** medium_load 🥈

- Import Time: 3.32 ms
- Relative Time: 10.30x (vs baseline)
- Memory Peak: 31.15 MB
- Memory Avg: 30.85 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** heavy_load 🥉

- Import Time: 9.95 ms
- Relative Time: 30.86x (vs baseline)
- Memory Peak: 34.67 MB
- Memory Avg: 32.91 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** enterprise_load

- Import Time: 27.47 ms
- Relative Time: 85.22x (vs baseline)
- Memory Peak: 43.64 MB
- Memory Avg: 39.15 MB
- Package Size: 0.00 MB
- Features: deferred_loading

##### lazi 🥇

**Test:** light_load 🥇

- Import Time: 0.53 ms
- Relative Time: 1.63x (vs baseline)
- Memory Peak: 72.87 MB
- Memory Avg: 72.86 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** medium_load 🥇

- Import Time: 2.89 ms
- Relative Time: 8.96x (vs baseline)
- Memory Peak: 74.22 MB
- Memory Avg: 73.58 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** heavy_load 🥇

- Import Time: 9.66 ms
- Relative Time: 29.95x (vs baseline)
- Memory Peak: 76.66 MB
- Memory Avg: 75.46 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** enterprise_load 🥇

- Import Time: 26.37 ms
- Relative Time: 81.79x (vs baseline)
- Memory Peak: 83.27 MB
- Memory Avg: 79.99 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

##### lazy-imports 🥉

**Test:** light_load

- Import Time: 0.71 ms
- Relative Time: 2.20x (vs baseline)
- Memory Peak: 49.81 MB
- Memory Avg: 49.80 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 3.67 ms
- Relative Time: 11.37x (vs baseline)
- Memory Peak: 50.53 MB
- Memory Avg: 50.17 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 10.38 ms
- Relative Time: 32.20x (vs baseline)
- Memory Peak: 52.13 MB
- Memory Avg: 51.35 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load 🥉

- Import Time: 27.11 ms
- Relative Time: 84.08x (vs baseline)
- Memory Peak: 59.68 MB
- Memory Avg: 55.91 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### lazy-imports-lite 🥈

**Test:** light_load

- Import Time: 0.75 ms
- Relative Time: 2.33x (vs baseline)
- Memory Peak: 83.38 MB
- Memory Avg: 83.37 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** medium_load

- Import Time: 3.60 ms
- Relative Time: 11.16x (vs baseline)
- Memory Peak: 84.62 MB
- Memory Avg: 84.00 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** heavy_load 🥈

- Import Time: 9.94 ms
- Relative Time: 30.84x (vs baseline)
- Memory Peak: 86.61 MB
- Memory Avg: 85.62 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** enterprise_load

- Import Time: 31.54 ms
- Relative Time: 97.83x (vs baseline)
- Memory Peak: 88.69 MB
- Memory Avg: 87.65 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

##### lazy-loader

**Test:** light_load

- Import Time: 0.76 ms
- Relative Time: 2.35x (vs baseline)
- Memory Peak: 43.75 MB
- Memory Avg: 43.73 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** medium_load

- Import Time: 3.65 ms
- Relative Time: 11.31x (vs baseline)
- Memory Peak: 45.13 MB
- Memory Avg: 44.45 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** heavy_load

- Import Time: 10.98 ms
- Relative Time: 34.04x (vs baseline)
- Memory Peak: 47.34 MB
- Memory Avg: 46.24 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** enterprise_load

- Import Time: 27.89 ms
- Relative Time: 86.50x (vs baseline)
- Memory Peak: 49.79 MB
- Memory Avg: 48.57 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

##### lazy_import 🥉

**Test:** light_load

- Import Time: 0.88 ms
- Relative Time: 2.72x (vs baseline)
- Memory Peak: 60.21 MB
- Memory Avg: 60.01 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load 🥉

- Import Time: 3.39 ms
- Relative Time: 10.51x (vs baseline)
- Memory Peak: 61.38 MB
- Memory Avg: 60.80 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 10.95 ms
- Relative Time: 33.98x (vs baseline)
- Memory Peak: 63.51 MB
- Memory Avg: 62.44 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 27.38 ms
- Relative Time: 84.92x (vs baseline)
- Memory Peak: 68.88 MB
- Memory Avg: 66.19 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### pipimport

**Test:** light_load

- ❌ Error: Library pipimport is not compatible with Python 3 (Python 2 syntax detected)

**Test:** medium_load

- ❌ Error: Library pipimport is not compatible with Python 3 (Python 2 syntax detected)

**Test:** heavy_load

- ❌ Error: Library pipimport is not compatible with Python 3 (Python 2 syntax detected)

**Test:** enterprise_load

- ❌ Error: Library pipimport is not compatible with Python 3 (Python 2 syntax detected)

##### pylazyimports 🥈

**Test:** light_load

- Import Time: 0.76 ms
- Relative Time: 2.36x (vs baseline)
- Memory Peak: 69.04 MB
- Memory Avg: 69.03 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 4.06 ms
- Relative Time: 12.60x (vs baseline)
- Memory Peak: 70.12 MB
- Memory Avg: 69.58 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 10.29 ms
- Relative Time: 31.91x (vs baseline)
- Memory Peak: 70.18 MB
- Memory Avg: 70.16 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load 🥈

- Import Time: 27.00 ms
- Relative Time: 83.75x (vs baseline)
- Memory Peak: 72.73 MB
- Memory Avg: 71.48 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### xwlazy 🥉

**Test:** light_load 🥉

- Import Time: 0.64 ms
- Relative Time: 2.00x (vs baseline)
- Memory Peak: 88.70 MB
- Memory Avg: 88.70 MB
- Package Size: 0.00 MB
- Features: lazy_import, per_package_isolation, caching

**Test:** medium_load

- Import Time: 3.64 ms
- Relative Time: 11.29x (vs baseline)
- Memory Peak: 89.01 MB
- Memory Avg: 88.85 MB
- Package Size: 0.00 MB
- Features: lazy_import, per_package_isolation, caching

**Test:** heavy_load

- Import Time: 10.35 ms
- Relative Time: 32.10x (vs baseline)
- Memory Peak: 89.05 MB
- Memory Avg: 89.03 MB
- Package Size: 0.00 MB
- Features: lazy_import, per_package_isolation, caching

**Test:** enterprise_load

- Import Time: 28.99 ms
- Relative Time: 89.93x (vs baseline)
- Memory Peak: 93.28 MB
- Memory Avg: 91.17 MB
- Package Size: 0.00 MB
- Features: lazy_import, per_package_isolation, caching


## Overall Winner 👑

**lazi 👑** wins with **4 first place victory(ies)** across all test categories!

### Winner Summary

| Library | First Place Wins |
|---------|------------------|
| lazi 👑 | 4 |


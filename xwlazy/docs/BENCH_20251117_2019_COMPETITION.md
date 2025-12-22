# Competition Benchmark Report

**Generated:** 2025-11-17T20:19:27.106538

## Standard Tests

### Auto Mode

*Smart install + auto-uninstall large - AUTO mode*

#### Top 3 Rankings by Load Test

##### Enterprise Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | pylazyimports | 22.87 | 82.80x |
| 2 🥈 | lazy_import | 23.50 | 85.07x |
| 3 🥉 | lazi | 23.80 | 86.16x |

##### Heavy Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazy-imports | 8.23 | 29.81x |
| 2 🥈 | lazi | 8.30 | 30.05x |
| 3 🥉 | lazy-imports-lite | 8.38 | 30.35x |

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazi | 0.28 | 1.00x |
| 2 🥈 | lazy-imports-lite | 0.35 | 1.26x |
| 3 🥉 | deferred-import | 0.45 | 1.63x |

##### Medium Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 2.50 | 9.05x |
| 2 🥈 | lazi | 2.73 | 9.88x |
| 3 🥉 | lazy-loader | 2.76 | 9.99x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| deferred-import 🥉 | light_load | 0.45 | 1.63x | 365.77 | 0.00 | ✅ |
| deferred-import | medium_load | 2.83 | 10.24x | 365.84 | 0.00 | ✅ |
| deferred-import | heavy_load | 9.18 | 33.22x | 367.11 | 0.00 | ✅ |
| deferred-import | enterprise_load | 24.54 | 88.87x | 367.19 | 0.00 | ✅ |
| lazi 🥇 | light_load | 0.28 | 1.00x | 394.20 | 0.00 | ✅ |
| lazi 🥈 | medium_load | 2.73 | 9.88x | 395.67 | 0.00 | ✅ |
| lazi 🥈 | heavy_load | 8.30 | 30.05x | 397.83 | 0.00 | ✅ |
| lazi 🥉 | enterprise_load | 23.80 | 86.16x | 403.53 | 0.00 | ✅ |
| lazy-imports | light_load | 0.50 | 1.82x | 367.31 | 0.00 | ✅ |
| lazy-imports | medium_load | 3.42 | 12.39x | 367.40 | 0.00 | ✅ |
| lazy-imports 🥇 | heavy_load | 8.23 | 29.81x | 368.90 | 0.00 | ✅ |
| lazy-imports | enterprise_load | 25.60 | 92.70x | 373.75 | 0.00 | ✅ |
| lazy-imports-lite 🥈 | light_load | 0.35 | 1.26x | 403.63 | 0.00 | ✅ |
| lazy-imports-lite | medium_load | 3.05 | 11.05x | 404.64 | 0.00 | ✅ |
| lazy-imports-lite 🥉 | heavy_load | 8.38 | 30.35x | 406.70 | 0.00 | ✅ |
| lazy-imports-lite | enterprise_load | 25.35 | 91.80x | 408.52 | 0.00 | ✅ |
| lazy-loader | light_load | 0.47 | 1.71x | 367.19 | 0.00 | ✅ |
| lazy-loader 🥉 | medium_load | 2.76 | 9.99x | 367.19 | 0.00 | ✅ |
| lazy-loader | heavy_load | 8.98 | 32.51x | 367.20 | 0.00 | ✅ |
| lazy-loader | enterprise_load | 24.11 | 87.29x | 367.31 | 0.00 | ✅ |
| lazy_import | light_load | 0.66 | 2.38x | 374.15 | 0.00 | ✅ |
| lazy_import | medium_load | 3.52 | 12.74x | 375.11 | 0.00 | ✅ |
| lazy_import | heavy_load | 8.44 | 30.55x | 376.66 | 0.00 | ✅ |
| lazy_import 🥈 | enterprise_load | 23.50 | 85.07x | 385.06 | 0.00 | ✅ |
| pipimport | light_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pipimport | medium_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pipimport | heavy_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pipimport | enterprise_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pylazyimports | light_load | 0.58 | 2.11x | 385.15 | 0.00 | ✅ |
| pylazyimports | medium_load | 2.97 | 10.75x | 386.50 | 0.00 | ✅ |
| pylazyimports | heavy_load | 8.84 | 32.00x | 387.98 | 0.00 | ✅ |
| pylazyimports 🥇 | enterprise_load | 22.87 | 82.80x | 394.08 | 0.00 | ✅ |
| xwlazy | light_load | 0.56 | 2.01x | 408.52 | 0.00 | ✅ |
| xwlazy 🥇 | medium_load | 2.50 | 9.05x | 408.59 | 0.00 | ✅ |
| xwlazy | heavy_load | 9.18 | 33.23x | 408.59 | 0.00 | ✅ |
| xwlazy | enterprise_load | 24.43 | 88.46x | 408.62 | 0.00 | ✅ |

#### Detailed Results

##### deferred-import 🥉

**Test:** light_load 🥉

- Import Time: 0.45 ms
- Relative Time: 1.63x (vs baseline)
- Memory Peak: 365.77 MB
- Memory Avg: 365.77 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** medium_load

- Import Time: 2.83 ms
- Relative Time: 10.24x (vs baseline)
- Memory Peak: 365.84 MB
- Memory Avg: 365.80 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** heavy_load

- Import Time: 9.18 ms
- Relative Time: 33.22x (vs baseline)
- Memory Peak: 367.11 MB
- Memory Avg: 366.47 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** enterprise_load

- Import Time: 24.54 ms
- Relative Time: 88.87x (vs baseline)
- Memory Peak: 367.19 MB
- Memory Avg: 367.15 MB
- Package Size: 0.00 MB
- Features: deferred_loading

##### lazi 🥇

**Test:** light_load 🥇

- Import Time: 0.28 ms
- Relative Time: 1.00x (vs baseline)
- Memory Peak: 394.20 MB
- Memory Avg: 394.20 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** medium_load 🥈

- Import Time: 2.73 ms
- Relative Time: 9.88x (vs baseline)
- Memory Peak: 395.67 MB
- Memory Avg: 394.94 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** heavy_load 🥈

- Import Time: 8.30 ms
- Relative Time: 30.05x (vs baseline)
- Memory Peak: 397.83 MB
- Memory Avg: 396.75 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** enterprise_load 🥉

- Import Time: 23.80 ms
- Relative Time: 86.16x (vs baseline)
- Memory Peak: 403.53 MB
- Memory Avg: 400.68 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

##### lazy-imports 🥇

**Test:** light_load

- Import Time: 0.50 ms
- Relative Time: 1.82x (vs baseline)
- Memory Peak: 367.31 MB
- Memory Avg: 367.31 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 3.42 ms
- Relative Time: 12.39x (vs baseline)
- Memory Peak: 367.40 MB
- Memory Avg: 367.36 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load 🥇

- Import Time: 8.23 ms
- Relative Time: 29.81x (vs baseline)
- Memory Peak: 368.90 MB
- Memory Avg: 368.15 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 25.60 ms
- Relative Time: 92.70x (vs baseline)
- Memory Peak: 373.75 MB
- Memory Avg: 371.33 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### lazy-imports-lite 🥈

**Test:** light_load 🥈

- Import Time: 0.35 ms
- Relative Time: 1.26x (vs baseline)
- Memory Peak: 403.63 MB
- Memory Avg: 403.62 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** medium_load

- Import Time: 3.05 ms
- Relative Time: 11.05x (vs baseline)
- Memory Peak: 404.64 MB
- Memory Avg: 404.14 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** heavy_load 🥉

- Import Time: 8.38 ms
- Relative Time: 30.35x (vs baseline)
- Memory Peak: 406.70 MB
- Memory Avg: 405.67 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** enterprise_load

- Import Time: 25.35 ms
- Relative Time: 91.80x (vs baseline)
- Memory Peak: 408.52 MB
- Memory Avg: 407.61 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

##### lazy-loader 🥉

**Test:** light_load

- Import Time: 0.47 ms
- Relative Time: 1.71x (vs baseline)
- Memory Peak: 367.19 MB
- Memory Avg: 367.19 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** medium_load 🥉

- Import Time: 2.76 ms
- Relative Time: 9.99x (vs baseline)
- Memory Peak: 367.19 MB
- Memory Avg: 367.19 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** heavy_load

- Import Time: 8.98 ms
- Relative Time: 32.51x (vs baseline)
- Memory Peak: 367.20 MB
- Memory Avg: 367.19 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** enterprise_load

- Import Time: 24.11 ms
- Relative Time: 87.29x (vs baseline)
- Memory Peak: 367.31 MB
- Memory Avg: 367.25 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

##### lazy_import 🥈

**Test:** light_load

- Import Time: 0.66 ms
- Relative Time: 2.38x (vs baseline)
- Memory Peak: 374.15 MB
- Memory Avg: 374.12 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 3.52 ms
- Relative Time: 12.74x (vs baseline)
- Memory Peak: 375.11 MB
- Memory Avg: 374.64 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 8.44 ms
- Relative Time: 30.55x (vs baseline)
- Memory Peak: 376.66 MB
- Memory Avg: 375.89 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load 🥈

- Import Time: 23.50 ms
- Relative Time: 85.07x (vs baseline)
- Memory Peak: 385.06 MB
- Memory Avg: 380.86 MB
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

##### pylazyimports 🥇

**Test:** light_load

- Import Time: 0.58 ms
- Relative Time: 2.11x (vs baseline)
- Memory Peak: 385.15 MB
- Memory Avg: 385.14 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 2.97 ms
- Relative Time: 10.75x (vs baseline)
- Memory Peak: 386.50 MB
- Memory Avg: 385.83 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 8.84 ms
- Relative Time: 32.00x (vs baseline)
- Memory Peak: 387.98 MB
- Memory Avg: 387.25 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load 🥇

- Import Time: 22.87 ms
- Relative Time: 82.80x (vs baseline)
- Memory Peak: 394.08 MB
- Memory Avg: 391.04 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### xwlazy 🥇

**Test:** light_load

- Import Time: 0.56 ms
- Relative Time: 2.01x (vs baseline)
- Memory Peak: 408.52 MB
- Memory Avg: 408.52 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** medium_load 🥇

- Import Time: 2.50 ms
- Relative Time: 9.05x (vs baseline)
- Memory Peak: 408.59 MB
- Memory Avg: 408.59 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** heavy_load

- Import Time: 9.18 ms
- Relative Time: 33.23x (vs baseline)
- Memory Peak: 408.59 MB
- Memory Avg: 408.59 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** enterprise_load

- Import Time: 24.43 ms
- Relative Time: 88.46x (vs baseline)
- Memory Peak: 408.62 MB
- Memory Avg: 408.60 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring


### Clean Mode

*Install on usage + uninstall after - CLEAN mode*

#### Top 3 Rankings by Load Test

##### Enterprise Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | pylazyimports | 23.27 | 84.23x |
| 2 🥈 | lazy-loader | 23.57 | 85.35x |
| 3 🥉 | lazi | 24.39 | 88.29x |

##### Heavy Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazy-loader | 8.27 | 29.96x |
| 2 🥈 | lazy-imports | 8.84 | 32.01x |
| 3 🥉 | xwlazy | 8.97 | 32.46x |

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazi | 0.41 | 1.47x |
| 2 🥈 | xwlazy | 0.46 | 1.67x |
| 3 🥉 | lazy-imports | 0.47 | 1.69x |

##### Medium Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazy-loader | 2.64 | 9.54x |
| 2 🥈 | xwlazy | 2.82 | 10.20x |
| 3 🥉 | lazy-imports-lite | 2.89 | 10.48x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| deferred-import | light_load | 0.67 | 2.41x | 321.78 | 0.00 | ✅ |
| deferred-import | medium_load | 3.45 | 12.49x | 321.78 | 0.00 | ✅ |
| deferred-import | heavy_load | 9.85 | 35.67x | 321.78 | 0.00 | ✅ |
| deferred-import | enterprise_load | 27.34 | 98.99x | 321.82 | 0.00 | ✅ |
| lazi 🥇 | light_load | 0.41 | 1.47x | 347.96 | 0.00 | ✅ |
| lazi | medium_load | 3.27 | 11.86x | 348.53 | 0.00 | ✅ |
| lazi | heavy_load | 9.19 | 33.26x | 350.97 | 0.00 | ✅ |
| lazi 🥉 | enterprise_load | 24.39 | 88.29x | 358.34 | 0.00 | ✅ |
| lazy-imports 🥉 | light_load | 0.47 | 1.69x | 322.15 | 0.00 | ✅ |
| lazy-imports | medium_load | 2.93 | 10.62x | 322.42 | 0.00 | ✅ |
| lazy-imports 🥈 | heavy_load | 8.84 | 32.01x | 322.90 | 0.00 | ✅ |
| lazy-imports | enterprise_load | 26.65 | 96.49x | 329.82 | 0.00 | ✅ |
| lazy-imports-lite | light_load | 0.51 | 1.86x | 358.43 | 0.00 | ✅ |
| lazy-imports-lite 🥉 | medium_load | 2.89 | 10.48x | 359.67 | 0.00 | ✅ |
| lazy-imports-lite | heavy_load | 9.54 | 34.53x | 362.41 | 0.00 | ✅ |
| lazy-imports-lite | enterprise_load | 47.25 | 171.07x | 365.57 | 0.00 | ✅ |
| lazy-loader | light_load | 0.56 | 2.03x | 321.82 | 0.00 | ✅ |
| lazy-loader 🥇 | medium_load | 2.64 | 9.54x | 321.82 | 0.00 | ✅ |
| lazy-loader 🥇 | heavy_load | 8.27 | 29.96x | 321.82 | 0.00 | ✅ |
| lazy-loader 🥈 | enterprise_load | 23.57 | 85.35x | 322.14 | 0.00 | ✅ |
| lazy_import | light_load | 0.67 | 2.41x | 329.96 | 0.00 | ✅ |
| lazy_import | medium_load | 2.91 | 10.52x | 330.91 | 0.00 | ✅ |
| lazy_import | heavy_load | 9.45 | 34.22x | 332.84 | 0.00 | ✅ |
| lazy_import | enterprise_load | 24.61 | 89.12x | 338.97 | 0.00 | ✅ |
| pipimport | light_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pipimport | medium_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pipimport | heavy_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pipimport | enterprise_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pylazyimports | light_load | 0.49 | 1.79x | 339.06 | 0.00 | ✅ |
| pylazyimports | medium_load | 2.93 | 10.59x | 340.01 | 0.00 | ✅ |
| pylazyimports | heavy_load | 9.43 | 34.15x | 341.84 | 0.00 | ✅ |
| pylazyimports 🥇 | enterprise_load | 23.27 | 84.23x | 347.89 | 0.00 | ✅ |
| xwlazy 🥈 | light_load | 0.46 | 1.67x | 365.57 | 0.00 | ✅ |
| xwlazy 🥈 | medium_load | 2.82 | 10.20x | 365.67 | 0.00 | ✅ |
| xwlazy 🥉 | heavy_load | 8.97 | 32.46x | 365.67 | 0.00 | ✅ |
| xwlazy | enterprise_load | 25.27 | 91.48x | 365.74 | 0.00 | ✅ |

#### Detailed Results

##### deferred-import

**Test:** light_load

- Import Time: 0.67 ms
- Relative Time: 2.41x (vs baseline)
- Memory Peak: 321.78 MB
- Memory Avg: 321.78 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** medium_load

- Import Time: 3.45 ms
- Relative Time: 12.49x (vs baseline)
- Memory Peak: 321.78 MB
- Memory Avg: 321.78 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** heavy_load

- Import Time: 9.85 ms
- Relative Time: 35.67x (vs baseline)
- Memory Peak: 321.78 MB
- Memory Avg: 321.78 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** enterprise_load

- Import Time: 27.34 ms
- Relative Time: 98.99x (vs baseline)
- Memory Peak: 321.82 MB
- Memory Avg: 321.80 MB
- Package Size: 0.00 MB
- Features: deferred_loading

##### lazi 🥇

**Test:** light_load 🥇

- Import Time: 0.41 ms
- Relative Time: 1.47x (vs baseline)
- Memory Peak: 347.96 MB
- Memory Avg: 347.96 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** medium_load

- Import Time: 3.27 ms
- Relative Time: 11.86x (vs baseline)
- Memory Peak: 348.53 MB
- Memory Avg: 348.25 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** heavy_load

- Import Time: 9.19 ms
- Relative Time: 33.26x (vs baseline)
- Memory Peak: 350.97 MB
- Memory Avg: 349.76 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** enterprise_load 🥉

- Import Time: 24.39 ms
- Relative Time: 88.29x (vs baseline)
- Memory Peak: 358.34 MB
- Memory Avg: 354.66 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

##### lazy-imports 🥈

**Test:** light_load 🥉

- Import Time: 0.47 ms
- Relative Time: 1.69x (vs baseline)
- Memory Peak: 322.15 MB
- Memory Avg: 322.15 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 2.93 ms
- Relative Time: 10.62x (vs baseline)
- Memory Peak: 322.42 MB
- Memory Avg: 322.29 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load 🥈

- Import Time: 8.84 ms
- Relative Time: 32.01x (vs baseline)
- Memory Peak: 322.90 MB
- Memory Avg: 322.66 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 26.65 ms
- Relative Time: 96.49x (vs baseline)
- Memory Peak: 329.82 MB
- Memory Avg: 326.36 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### lazy-imports-lite 🥉

**Test:** light_load

- Import Time: 0.51 ms
- Relative Time: 1.86x (vs baseline)
- Memory Peak: 358.43 MB
- Memory Avg: 358.42 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** medium_load 🥉

- Import Time: 2.89 ms
- Relative Time: 10.48x (vs baseline)
- Memory Peak: 359.67 MB
- Memory Avg: 359.05 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** heavy_load

- Import Time: 9.54 ms
- Relative Time: 34.53x (vs baseline)
- Memory Peak: 362.41 MB
- Memory Avg: 361.05 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** enterprise_load

- Import Time: 47.25 ms
- Relative Time: 171.07x (vs baseline)
- Memory Peak: 365.57 MB
- Memory Avg: 364.00 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

##### lazy-loader 🥇

**Test:** light_load

- Import Time: 0.56 ms
- Relative Time: 2.03x (vs baseline)
- Memory Peak: 321.82 MB
- Memory Avg: 321.82 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** medium_load 🥇

- Import Time: 2.64 ms
- Relative Time: 9.54x (vs baseline)
- Memory Peak: 321.82 MB
- Memory Avg: 321.82 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** heavy_load 🥇

- Import Time: 8.27 ms
- Relative Time: 29.96x (vs baseline)
- Memory Peak: 321.82 MB
- Memory Avg: 321.82 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** enterprise_load 🥈

- Import Time: 23.57 ms
- Relative Time: 85.35x (vs baseline)
- Memory Peak: 322.14 MB
- Memory Avg: 321.98 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

##### lazy_import

**Test:** light_load

- Import Time: 0.67 ms
- Relative Time: 2.41x (vs baseline)
- Memory Peak: 329.96 MB
- Memory Avg: 329.93 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 2.91 ms
- Relative Time: 10.52x (vs baseline)
- Memory Peak: 330.91 MB
- Memory Avg: 330.45 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 9.45 ms
- Relative Time: 34.22x (vs baseline)
- Memory Peak: 332.84 MB
- Memory Avg: 331.89 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 24.61 ms
- Relative Time: 89.12x (vs baseline)
- Memory Peak: 338.97 MB
- Memory Avg: 336.06 MB
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

##### pylazyimports 🥇

**Test:** light_load

- Import Time: 0.49 ms
- Relative Time: 1.79x (vs baseline)
- Memory Peak: 339.06 MB
- Memory Avg: 339.05 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 2.93 ms
- Relative Time: 10.59x (vs baseline)
- Memory Peak: 340.01 MB
- Memory Avg: 339.54 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 9.43 ms
- Relative Time: 34.15x (vs baseline)
- Memory Peak: 341.84 MB
- Memory Avg: 340.93 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load 🥇

- Import Time: 23.27 ms
- Relative Time: 84.23x (vs baseline)
- Memory Peak: 347.89 MB
- Memory Avg: 344.87 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### xwlazy 🥈

**Test:** light_load 🥈

- Import Time: 0.46 ms
- Relative Time: 1.67x (vs baseline)
- Memory Peak: 365.57 MB
- Memory Avg: 365.57 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** medium_load 🥈

- Import Time: 2.82 ms
- Relative Time: 10.20x (vs baseline)
- Memory Peak: 365.67 MB
- Memory Avg: 365.67 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** heavy_load 🥉

- Import Time: 8.97 ms
- Relative Time: 32.46x (vs baseline)
- Memory Peak: 365.67 MB
- Memory Avg: 365.67 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** enterprise_load

- Import Time: 25.27 ms
- Relative Time: 91.48x (vs baseline)
- Memory Peak: 365.74 MB
- Memory Avg: 365.71 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring


### Full Features

*All features enabled (xwlazy showcase) - AUTO mode with optimizations*

#### Top 3 Rankings by Load Test

##### Enterprise Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 22.16 | 80.23x |
| 2 🥈 | lazy-loader | 22.44 | 81.24x |
| 3 🥉 | pylazyimports | 22.60 | 81.84x |

##### Heavy Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazy-loader | 8.00 | 28.95x |
| 2 🥈 | lazy_import | 8.46 | 30.64x |
| 3 🥉 | lazy-imports-lite | 8.56 | 30.99x |

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazy-imports | 0.37 | 1.33x |
| 2 🥈 | lazi | 0.37 | 1.35x |
| 3 🥉 | lazy-loader | 0.44 | 1.58x |

##### Medium Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | pylazyimports | 2.54 | 9.20x |
| 2 🥈 | lazy-loader | 2.56 | 9.27x |
| 3 🥉 | lazi | 2.57 | 9.31x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| deferred-import | light_load | 0.61 | 2.20x | 408.65 | 0.00 | ✅ |
| deferred-import | medium_load | 3.20 | 11.58x | 408.71 | 0.00 | ✅ |
| deferred-import | heavy_load | 10.57 | 38.28x | 408.72 | 0.00 | ✅ |
| deferred-import | enterprise_load | 25.06 | 90.72x | 408.96 | 0.00 | ✅ |
| lazi 🥈 | light_load | 0.37 | 1.35x | 428.78 | 0.00 | ✅ |
| lazi 🥉 | medium_load | 2.57 | 9.31x | 430.32 | 0.00 | ✅ |
| lazi | heavy_load | 9.13 | 33.06x | 431.74 | 0.00 | ✅ |
| lazi | enterprise_load | 24.71 | 89.47x | 438.44 | 0.00 | ✅ |
| lazy-imports 🥇 | light_load | 0.37 | 1.33x | 409.02 | 0.00 | ✅ |
| lazy-imports | medium_load | 2.95 | 10.70x | 409.02 | 0.00 | ✅ |
| lazy-imports | heavy_load | 8.60 | 31.12x | 409.41 | 0.00 | ✅ |
| lazy-imports | enterprise_load | 23.76 | 86.03x | 411.50 | 0.00 | ✅ |
| lazy-imports-lite | light_load | 0.57 | 2.07x | 438.53 | 0.00 | ✅ |
| lazy-imports-lite | medium_load | 2.83 | 10.23x | 439.98 | 0.00 | ✅ |
| lazy-imports-lite 🥉 | heavy_load | 8.56 | 30.99x | 442.11 | 0.00 | ✅ |
| lazy-imports-lite | enterprise_load | 25.07 | 90.76x | 448.39 | 0.00 | ✅ |
| lazy-loader 🥉 | light_load | 0.44 | 1.58x | 408.96 | 0.00 | ✅ |
| lazy-loader 🥈 | medium_load | 2.56 | 9.27x | 408.96 | 0.00 | ✅ |
| lazy-loader 🥇 | heavy_load | 8.00 | 28.95x | 408.96 | 0.00 | ✅ |
| lazy-loader 🥈 | enterprise_load | 22.44 | 81.24x | 409.02 | 0.00 | ✅ |
| lazy_import | light_load | 0.69 | 2.51x | 411.64 | 0.00 | ✅ |
| lazy_import | medium_load | 2.80 | 10.12x | 412.71 | 0.00 | ✅ |
| lazy_import 🥈 | heavy_load | 8.46 | 30.64x | 414.13 | 0.00 | ✅ |
| lazy_import | enterprise_load | 22.89 | 82.88x | 419.04 | 0.00 | ✅ |
| pipimport | light_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pipimport | medium_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pipimport | heavy_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pipimport | enterprise_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pylazyimports | light_load | 1.11 | 4.03x | 419.38 | 0.00 | ✅ |
| pylazyimports 🥇 | medium_load | 2.54 | 9.20x | 420.21 | 0.00 | ✅ |
| pylazyimports | heavy_load | 8.58 | 31.06x | 422.75 | 0.00 | ✅ |
| pylazyimports 🥉 | enterprise_load | 22.60 | 81.84x | 428.70 | 0.00 | ✅ |
| xwlazy | light_load | 0.87 | 3.16x | 448.50 | 0.00 | ✅ |
| xwlazy | medium_load | 3.28 | 11.88x | 449.12 | 0.00 | ✅ |
| xwlazy | heavy_load | 10.38 | 37.59x | 449.12 | 0.00 | ✅ |
| xwlazy 🥇 | enterprise_load | 22.16 | 80.23x | 449.13 | 0.00 | ✅ |

#### Detailed Results

##### deferred-import

**Test:** light_load

- Import Time: 0.61 ms
- Relative Time: 2.20x (vs baseline)
- Memory Peak: 408.65 MB
- Memory Avg: 408.65 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** medium_load

- Import Time: 3.20 ms
- Relative Time: 11.58x (vs baseline)
- Memory Peak: 408.71 MB
- Memory Avg: 408.68 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** heavy_load

- Import Time: 10.57 ms
- Relative Time: 38.28x (vs baseline)
- Memory Peak: 408.72 MB
- Memory Avg: 408.72 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** enterprise_load

- Import Time: 25.06 ms
- Relative Time: 90.72x (vs baseline)
- Memory Peak: 408.96 MB
- Memory Avg: 408.84 MB
- Package Size: 0.00 MB
- Features: deferred_loading

##### lazi 🥈

**Test:** light_load 🥈

- Import Time: 0.37 ms
- Relative Time: 1.35x (vs baseline)
- Memory Peak: 428.78 MB
- Memory Avg: 428.77 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** medium_load 🥉

- Import Time: 2.57 ms
- Relative Time: 9.31x (vs baseline)
- Memory Peak: 430.32 MB
- Memory Avg: 429.55 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** heavy_load

- Import Time: 9.13 ms
- Relative Time: 33.06x (vs baseline)
- Memory Peak: 431.74 MB
- Memory Avg: 431.04 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** enterprise_load

- Import Time: 24.71 ms
- Relative Time: 89.47x (vs baseline)
- Memory Peak: 438.44 MB
- Memory Avg: 435.11 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

##### lazy-imports 🥇

**Test:** light_load 🥇

- Import Time: 0.37 ms
- Relative Time: 1.33x (vs baseline)
- Memory Peak: 409.02 MB
- Memory Avg: 409.02 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 2.95 ms
- Relative Time: 10.70x (vs baseline)
- Memory Peak: 409.02 MB
- Memory Avg: 409.02 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 8.60 ms
- Relative Time: 31.12x (vs baseline)
- Memory Peak: 409.41 MB
- Memory Avg: 409.22 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 23.76 ms
- Relative Time: 86.03x (vs baseline)
- Memory Peak: 411.50 MB
- Memory Avg: 410.45 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### lazy-imports-lite 🥉

**Test:** light_load

- Import Time: 0.57 ms
- Relative Time: 2.07x (vs baseline)
- Memory Peak: 438.53 MB
- Memory Avg: 438.52 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** medium_load

- Import Time: 2.83 ms
- Relative Time: 10.23x (vs baseline)
- Memory Peak: 439.98 MB
- Memory Avg: 439.26 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** heavy_load 🥉

- Import Time: 8.56 ms
- Relative Time: 30.99x (vs baseline)
- Memory Peak: 442.11 MB
- Memory Avg: 441.05 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** enterprise_load

- Import Time: 25.07 ms
- Relative Time: 90.76x (vs baseline)
- Memory Peak: 448.39 MB
- Memory Avg: 445.25 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

##### lazy-loader 🥇

**Test:** light_load 🥉

- Import Time: 0.44 ms
- Relative Time: 1.58x (vs baseline)
- Memory Peak: 408.96 MB
- Memory Avg: 408.96 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** medium_load 🥈

- Import Time: 2.56 ms
- Relative Time: 9.27x (vs baseline)
- Memory Peak: 408.96 MB
- Memory Avg: 408.96 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** heavy_load 🥇

- Import Time: 8.00 ms
- Relative Time: 28.95x (vs baseline)
- Memory Peak: 408.96 MB
- Memory Avg: 408.96 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** enterprise_load 🥈

- Import Time: 22.44 ms
- Relative Time: 81.24x (vs baseline)
- Memory Peak: 409.02 MB
- Memory Avg: 408.99 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

##### lazy_import 🥈

**Test:** light_load

- Import Time: 0.69 ms
- Relative Time: 2.51x (vs baseline)
- Memory Peak: 411.64 MB
- Memory Avg: 411.60 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 2.80 ms
- Relative Time: 10.12x (vs baseline)
- Memory Peak: 412.71 MB
- Memory Avg: 412.17 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load 🥈

- Import Time: 8.46 ms
- Relative Time: 30.64x (vs baseline)
- Memory Peak: 414.13 MB
- Memory Avg: 413.42 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 22.89 ms
- Relative Time: 82.88x (vs baseline)
- Memory Peak: 419.04 MB
- Memory Avg: 416.59 MB
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

##### pylazyimports 🥇

**Test:** light_load

- Import Time: 1.11 ms
- Relative Time: 4.03x (vs baseline)
- Memory Peak: 419.38 MB
- Memory Avg: 419.37 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load 🥇

- Import Time: 2.54 ms
- Relative Time: 9.20x (vs baseline)
- Memory Peak: 420.21 MB
- Memory Avg: 419.80 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 8.58 ms
- Relative Time: 31.06x (vs baseline)
- Memory Peak: 422.75 MB
- Memory Avg: 421.50 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load 🥉

- Import Time: 22.60 ms
- Relative Time: 81.84x (vs baseline)
- Memory Peak: 428.70 MB
- Memory Avg: 425.72 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### xwlazy 🥇

**Test:** light_load

- Import Time: 0.87 ms
- Relative Time: 3.16x (vs baseline)
- Memory Peak: 448.50 MB
- Memory Avg: 448.49 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** medium_load

- Import Time: 3.28 ms
- Relative Time: 11.88x (vs baseline)
- Memory Peak: 449.12 MB
- Memory Avg: 448.99 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** heavy_load

- Import Time: 10.38 ms
- Relative Time: 37.59x (vs baseline)
- Memory Peak: 449.12 MB
- Memory Avg: 449.12 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** enterprise_load 🥇

- Import Time: 22.16 ms
- Relative Time: 80.23x (vs baseline)
- Memory Peak: 449.13 MB
- Memory Avg: 449.12 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring


### Full Install Mode

*Install all dependencies on start - FULL mode*

#### Top 3 Rankings by Load Test

##### Enterprise Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazy-imports-lite | 26.68 | 96.61x |
| 2 🥈 | lazi | 27.12 | 98.20x |
| 3 🥉 | lazy_import | 28.48 | 103.10x |

##### Heavy Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 8.80 | 31.86x |
| 2 🥈 | lazy_import | 9.55 | 34.56x |
| 3 🥉 | lazi | 9.87 | 35.73x |

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | deferred-import | 0.45 | 1.62x |
| 2 🥈 | lazi | 0.48 | 1.74x |
| 3 🥉 | lazy-loader | 0.73 | 2.63x |

##### Medium Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 3.09 | 11.18x |
| 2 🥈 | deferred-import | 3.25 | 11.76x |
| 3 🥉 | lazy-imports-lite | 3.32 | 12.03x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| deferred-import 🥇 | light_load | 0.45 | 1.62x | 262.39 | 0.00 | ✅ |
| deferred-import 🥈 | medium_load | 3.25 | 11.76x | 263.12 | 0.00 | ✅ |
| deferred-import | heavy_load | 12.08 | 43.75x | 265.43 | 0.00 | ✅ |
| deferred-import | enterprise_load | 51.50 | 186.47x | 271.66 | 0.00 | ✅ |
| lazi 🥈 | light_load | 0.48 | 1.74x | 294.59 | 0.00 | ✅ |
| lazi | medium_load | 3.36 | 12.16x | 295.95 | 0.00 | ✅ |
| lazi 🥉 | heavy_load | 9.87 | 35.73x | 297.96 | 0.00 | ✅ |
| lazi 🥈 | enterprise_load | 27.12 | 98.20x | 304.63 | 0.00 | ✅ |
| lazy-imports | light_load | 4.61 | 16.68x | 279.09 | 0.00 | ✅ |
| lazy-imports | medium_load | 12.61 | 45.67x | 279.11 | 0.00 | ✅ |
| lazy-imports | heavy_load | 44.11 | 159.72x | 279.11 | 0.00 | ✅ |
| lazy-imports | enterprise_load | 81.33 | 294.47x | 279.15 | 0.00 | ✅ |
| lazy-imports-lite | light_load | 0.75 | 2.73x | 304.73 | 0.00 | ✅ |
| lazy-imports-lite 🥉 | medium_load | 3.32 | 12.03x | 305.73 | 0.00 | ✅ |
| lazy-imports-lite | heavy_load | 10.19 | 36.90x | 308.21 | 0.00 | ✅ |
| lazy-imports-lite 🥇 | enterprise_load | 26.68 | 96.61x | 313.50 | 0.00 | ✅ |
| lazy-loader 🥉 | light_load | 0.73 | 2.63x | 271.77 | 0.00 | ✅ |
| lazy-loader | medium_load | 4.24 | 15.36x | 272.87 | 0.00 | ✅ |
| lazy-loader | heavy_load | 24.78 | 89.71x | 274.81 | 0.00 | ✅ |
| lazy-loader | enterprise_load | 50.20 | 181.74x | 279.08 | 0.00 | ✅ |
| lazy_import | light_load | 1.58 | 5.73x | 279.14 | 0.00 | ✅ |
| lazy_import | medium_load | 3.69 | 13.35x | 279.14 | 0.00 | ✅ |
| lazy_import 🥈 | heavy_load | 9.55 | 34.56x | 279.20 | 0.00 | ✅ |
| lazy_import 🥉 | enterprise_load | 28.48 | 103.10x | 283.45 | 0.00 | ✅ |
| pipimport | light_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pipimport | medium_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pipimport | heavy_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pipimport | enterprise_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pylazyimports | light_load | 0.73 | 2.64x | 283.61 | 0.00 | ✅ |
| pylazyimports | medium_load | 3.64 | 13.17x | 284.83 | 0.00 | ✅ |
| pylazyimports | heavy_load | 10.28 | 37.22x | 287.23 | 0.00 | ✅ |
| pylazyimports | enterprise_load | 64.08 | 232.00x | 294.50 | 0.00 | ✅ |
| xwlazy | light_load | 0.76 | 2.76x | 313.62 | 0.00 | ✅ |
| xwlazy 🥇 | medium_load | 3.09 | 11.18x | 314.91 | 0.00 | ✅ |
| xwlazy 🥇 | heavy_load | 8.80 | 31.86x | 317.29 | 0.00 | ✅ |
| xwlazy | enterprise_load | 48.05 | 173.96x | 321.62 | 0.00 | ✅ |

#### Detailed Results

##### deferred-import 🥇

**Test:** light_load 🥇

- Import Time: 0.45 ms
- Relative Time: 1.62x (vs baseline)
- Memory Peak: 262.39 MB
- Memory Avg: 262.39 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** medium_load 🥈

- Import Time: 3.25 ms
- Relative Time: 11.76x (vs baseline)
- Memory Peak: 263.12 MB
- Memory Avg: 262.76 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** heavy_load

- Import Time: 12.08 ms
- Relative Time: 43.75x (vs baseline)
- Memory Peak: 265.43 MB
- Memory Avg: 264.28 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** enterprise_load

- Import Time: 51.50 ms
- Relative Time: 186.47x (vs baseline)
- Memory Peak: 271.66 MB
- Memory Avg: 268.54 MB
- Package Size: 0.00 MB
- Features: deferred_loading

##### lazi 🥈

**Test:** light_load 🥈

- Import Time: 0.48 ms
- Relative Time: 1.74x (vs baseline)
- Memory Peak: 294.59 MB
- Memory Avg: 294.59 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** medium_load

- Import Time: 3.36 ms
- Relative Time: 12.16x (vs baseline)
- Memory Peak: 295.95 MB
- Memory Avg: 295.27 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** heavy_load 🥉

- Import Time: 9.87 ms
- Relative Time: 35.73x (vs baseline)
- Memory Peak: 297.96 MB
- Memory Avg: 296.96 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** enterprise_load 🥈

- Import Time: 27.12 ms
- Relative Time: 98.20x (vs baseline)
- Memory Peak: 304.63 MB
- Memory Avg: 301.30 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

##### lazy-imports

**Test:** light_load

- Import Time: 4.61 ms
- Relative Time: 16.68x (vs baseline)
- Memory Peak: 279.09 MB
- Memory Avg: 279.09 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 12.61 ms
- Relative Time: 45.67x (vs baseline)
- Memory Peak: 279.11 MB
- Memory Avg: 279.10 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 44.11 ms
- Relative Time: 159.72x (vs baseline)
- Memory Peak: 279.11 MB
- Memory Avg: 279.11 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 81.33 ms
- Relative Time: 294.47x (vs baseline)
- Memory Peak: 279.15 MB
- Memory Avg: 279.13 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### lazy-imports-lite 🥇

**Test:** light_load

- Import Time: 0.75 ms
- Relative Time: 2.73x (vs baseline)
- Memory Peak: 304.73 MB
- Memory Avg: 304.72 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** medium_load 🥉

- Import Time: 3.32 ms
- Relative Time: 12.03x (vs baseline)
- Memory Peak: 305.73 MB
- Memory Avg: 305.23 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** heavy_load

- Import Time: 10.19 ms
- Relative Time: 36.90x (vs baseline)
- Memory Peak: 308.21 MB
- Memory Avg: 306.97 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** enterprise_load 🥇

- Import Time: 26.68 ms
- Relative Time: 96.61x (vs baseline)
- Memory Peak: 313.50 MB
- Memory Avg: 310.85 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

##### lazy-loader 🥉

**Test:** light_load 🥉

- Import Time: 0.73 ms
- Relative Time: 2.63x (vs baseline)
- Memory Peak: 271.77 MB
- Memory Avg: 271.75 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** medium_load

- Import Time: 4.24 ms
- Relative Time: 15.36x (vs baseline)
- Memory Peak: 272.87 MB
- Memory Avg: 272.33 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** heavy_load

- Import Time: 24.78 ms
- Relative Time: 89.71x (vs baseline)
- Memory Peak: 274.81 MB
- Memory Avg: 273.85 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** enterprise_load

- Import Time: 50.20 ms
- Relative Time: 181.74x (vs baseline)
- Memory Peak: 279.08 MB
- Memory Avg: 276.95 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

##### lazy_import 🥈

**Test:** light_load

- Import Time: 1.58 ms
- Relative Time: 5.73x (vs baseline)
- Memory Peak: 279.14 MB
- Memory Avg: 279.14 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 3.69 ms
- Relative Time: 13.35x (vs baseline)
- Memory Peak: 279.14 MB
- Memory Avg: 279.14 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load 🥈

- Import Time: 9.55 ms
- Relative Time: 34.56x (vs baseline)
- Memory Peak: 279.20 MB
- Memory Avg: 279.17 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load 🥉

- Import Time: 28.48 ms
- Relative Time: 103.10x (vs baseline)
- Memory Peak: 283.45 MB
- Memory Avg: 281.33 MB
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

##### pylazyimports

**Test:** light_load

- Import Time: 0.73 ms
- Relative Time: 2.64x (vs baseline)
- Memory Peak: 283.61 MB
- Memory Avg: 283.57 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 3.64 ms
- Relative Time: 13.17x (vs baseline)
- Memory Peak: 284.83 MB
- Memory Avg: 284.24 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 10.28 ms
- Relative Time: 37.22x (vs baseline)
- Memory Peak: 287.23 MB
- Memory Avg: 286.04 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 64.08 ms
- Relative Time: 232.00x (vs baseline)
- Memory Peak: 294.50 MB
- Memory Avg: 290.87 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### xwlazy 🥇

**Test:** light_load

- Import Time: 0.76 ms
- Relative Time: 2.76x (vs baseline)
- Memory Peak: 313.62 MB
- Memory Avg: 313.61 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** medium_load 🥇

- Import Time: 3.09 ms
- Relative Time: 11.18x (vs baseline)
- Memory Peak: 314.91 MB
- Memory Avg: 314.51 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** heavy_load 🥇

- Import Time: 8.80 ms
- Relative Time: 31.86x (vs baseline)
- Memory Peak: 317.29 MB
- Memory Avg: 316.27 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** enterprise_load

- Import Time: 48.05 ms
- Relative Time: 173.96x (vs baseline)
- Memory Peak: 321.62 MB
- Memory Avg: 319.49 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring


### Background Loading

*Background loading - BACKGROUND mode*

#### Top 3 Rankings by Load Test

##### Enterprise Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazy-imports-lite | 21.94 | 79.45x |
| 2 🥈 | lazy_import | 23.59 | 85.41x |
| 3 🥉 | deferred-import | 23.85 | 86.34x |

##### Heavy Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazy_import | 7.95 | 28.80x |
| 2 🥈 | pylazyimports | 8.14 | 29.46x |
| 3 🥉 | lazy-loader | 8.14 | 29.48x |

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | deferred-import | 0.49 | 1.79x |
| 2 🥈 | pylazyimports | 0.50 | 1.82x |
| 3 🥉 | lazy-imports | 0.53 | 1.91x |

##### Medium Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | pylazyimports | 2.50 | 9.04x |
| 2 🥈 | xwlazy | 2.53 | 9.15x |
| 3 🥉 | lazy-loader | 2.76 | 10.01x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| deferred-import 🥇 | light_load | 0.49 | 1.79x | 209.92 | 0.00 | ✅ |
| deferred-import | medium_load | 2.92 | 10.56x | 209.95 | 0.00 | ✅ |
| deferred-import | heavy_load | 9.89 | 35.83x | 209.95 | 0.00 | ✅ |
| deferred-import 🥉 | enterprise_load | 23.85 | 86.34x | 210.21 | 0.00 | ✅ |
| lazi | light_load | 0.60 | 2.19x | 244.46 | 0.00 | ✅ |
| lazi | medium_load | 3.82 | 13.84x | 244.46 | 0.00 | ✅ |
| lazi | heavy_load | 9.33 | 33.77x | 244.46 | 0.00 | ✅ |
| lazi | enterprise_load | 24.36 | 88.20x | 244.82 | 0.00 | ✅ |
| lazy-imports 🥉 | light_load | 0.53 | 1.91x | 218.29 | 0.00 | ✅ |
| lazy-imports | medium_load | 2.94 | 10.65x | 219.41 | 0.00 | ✅ |
| lazy-imports | heavy_load | 9.39 | 34.01x | 221.50 | 0.00 | ✅ |
| lazy-imports | enterprise_load | 25.00 | 90.52x | 227.11 | 0.00 | ✅ |
| lazy-imports-lite | light_load | 0.77 | 2.80x | 244.82 | 0.00 | ✅ |
| lazy-imports-lite | medium_load | 3.00 | 10.87x | 244.83 | 0.00 | ✅ |
| lazy-imports-lite | heavy_load | 9.50 | 34.40x | 245.81 | 0.00 | ✅ |
| lazy-imports-lite 🥇 | enterprise_load | 21.94 | 79.45x | 251.22 | 0.00 | ✅ |
| lazy-loader | light_load | 0.60 | 2.17x | 210.21 | 0.00 | ✅ |
| lazy-loader 🥉 | medium_load | 2.76 | 10.01x | 210.48 | 0.00 | ✅ |
| lazy-loader 🥉 | heavy_load | 8.14 | 29.48x | 211.59 | 0.00 | ✅ |
| lazy-loader | enterprise_load | 24.30 | 87.99x | 218.18 | 0.00 | ✅ |
| lazy_import | light_load | 0.63 | 2.28x | 227.25 | 0.00 | ✅ |
| lazy_import | medium_load | 2.86 | 10.37x | 227.96 | 0.00 | ✅ |
| lazy_import 🥇 | heavy_load | 7.95 | 28.80x | 229.76 | 0.00 | ✅ |
| lazy_import 🥈 | enterprise_load | 23.59 | 85.41x | 237.80 | 0.00 | ✅ |
| pipimport | light_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pipimport | medium_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pipimport | heavy_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pipimport | enterprise_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pylazyimports 🥈 | light_load | 0.50 | 1.82x | 237.91 | 0.00 | ✅ |
| pylazyimports 🥇 | medium_load | 2.50 | 9.04x | 239.55 | 0.00 | ✅ |
| pylazyimports 🥈 | heavy_load | 8.14 | 29.46x | 240.97 | 0.00 | ✅ |
| pylazyimports | enterprise_load | 24.88 | 90.08x | 244.46 | 0.00 | ✅ |
| xwlazy | light_load | 0.73 | 2.63x | 251.31 | 0.00 | ✅ |
| xwlazy 🥈 | medium_load | 2.53 | 9.15x | 252.43 | 0.00 | ✅ |
| xwlazy | heavy_load | 9.11 | 32.98x | 253.97 | 0.00 | ✅ |
| xwlazy | enterprise_load | 24.77 | 89.70x | 261.87 | 0.00 | ✅ |

#### Detailed Results

##### deferred-import 🥇

**Test:** light_load 🥇

- Import Time: 0.49 ms
- Relative Time: 1.79x (vs baseline)
- Memory Peak: 209.92 MB
- Memory Avg: 209.92 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** medium_load

- Import Time: 2.92 ms
- Relative Time: 10.56x (vs baseline)
- Memory Peak: 209.95 MB
- Memory Avg: 209.93 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** heavy_load

- Import Time: 9.89 ms
- Relative Time: 35.83x (vs baseline)
- Memory Peak: 209.95 MB
- Memory Avg: 209.95 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** enterprise_load 🥉

- Import Time: 23.85 ms
- Relative Time: 86.34x (vs baseline)
- Memory Peak: 210.21 MB
- Memory Avg: 210.08 MB
- Package Size: 0.00 MB
- Features: deferred_loading

##### lazi

**Test:** light_load

- Import Time: 0.60 ms
- Relative Time: 2.19x (vs baseline)
- Memory Peak: 244.46 MB
- Memory Avg: 244.46 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** medium_load

- Import Time: 3.82 ms
- Relative Time: 13.84x (vs baseline)
- Memory Peak: 244.46 MB
- Memory Avg: 244.46 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** heavy_load

- Import Time: 9.33 ms
- Relative Time: 33.77x (vs baseline)
- Memory Peak: 244.46 MB
- Memory Avg: 244.46 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** enterprise_load

- Import Time: 24.36 ms
- Relative Time: 88.20x (vs baseline)
- Memory Peak: 244.82 MB
- Memory Avg: 244.64 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

##### lazy-imports 🥉

**Test:** light_load 🥉

- Import Time: 0.53 ms
- Relative Time: 1.91x (vs baseline)
- Memory Peak: 218.29 MB
- Memory Avg: 218.28 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 2.94 ms
- Relative Time: 10.65x (vs baseline)
- Memory Peak: 219.41 MB
- Memory Avg: 218.86 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 9.39 ms
- Relative Time: 34.01x (vs baseline)
- Memory Peak: 221.50 MB
- Memory Avg: 220.47 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 25.00 ms
- Relative Time: 90.52x (vs baseline)
- Memory Peak: 227.11 MB
- Memory Avg: 224.33 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### lazy-imports-lite 🥇

**Test:** light_load

- Import Time: 0.77 ms
- Relative Time: 2.80x (vs baseline)
- Memory Peak: 244.82 MB
- Memory Avg: 244.82 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** medium_load

- Import Time: 3.00 ms
- Relative Time: 10.87x (vs baseline)
- Memory Peak: 244.83 MB
- Memory Avg: 244.82 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** heavy_load

- Import Time: 9.50 ms
- Relative Time: 34.40x (vs baseline)
- Memory Peak: 245.81 MB
- Memory Avg: 245.32 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** enterprise_load 🥇

- Import Time: 21.94 ms
- Relative Time: 79.45x (vs baseline)
- Memory Peak: 251.22 MB
- Memory Avg: 248.51 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

##### lazy-loader 🥉

**Test:** light_load

- Import Time: 0.60 ms
- Relative Time: 2.17x (vs baseline)
- Memory Peak: 210.21 MB
- Memory Avg: 210.21 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** medium_load 🥉

- Import Time: 2.76 ms
- Relative Time: 10.01x (vs baseline)
- Memory Peak: 210.48 MB
- Memory Avg: 210.34 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** heavy_load 🥉

- Import Time: 8.14 ms
- Relative Time: 29.48x (vs baseline)
- Memory Peak: 211.59 MB
- Memory Avg: 211.04 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** enterprise_load

- Import Time: 24.30 ms
- Relative Time: 87.99x (vs baseline)
- Memory Peak: 218.18 MB
- Memory Avg: 214.90 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

##### lazy_import 🥇

**Test:** light_load

- Import Time: 0.63 ms
- Relative Time: 2.28x (vs baseline)
- Memory Peak: 227.25 MB
- Memory Avg: 227.22 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 2.86 ms
- Relative Time: 10.37x (vs baseline)
- Memory Peak: 227.96 MB
- Memory Avg: 227.61 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load 🥇

- Import Time: 7.95 ms
- Relative Time: 28.80x (vs baseline)
- Memory Peak: 229.76 MB
- Memory Avg: 228.88 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load 🥈

- Import Time: 23.59 ms
- Relative Time: 85.41x (vs baseline)
- Memory Peak: 237.80 MB
- Memory Avg: 233.78 MB
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

##### pylazyimports 🥇

**Test:** light_load 🥈

- Import Time: 0.50 ms
- Relative Time: 1.82x (vs baseline)
- Memory Peak: 237.91 MB
- Memory Avg: 237.90 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load 🥇

- Import Time: 2.50 ms
- Relative Time: 9.04x (vs baseline)
- Memory Peak: 239.55 MB
- Memory Avg: 238.74 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load 🥈

- Import Time: 8.14 ms
- Relative Time: 29.46x (vs baseline)
- Memory Peak: 240.97 MB
- Memory Avg: 240.27 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 24.88 ms
- Relative Time: 90.08x (vs baseline)
- Memory Peak: 244.46 MB
- Memory Avg: 242.72 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### xwlazy 🥈

**Test:** light_load

- Import Time: 0.73 ms
- Relative Time: 2.63x (vs baseline)
- Memory Peak: 251.31 MB
- Memory Avg: 251.30 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** medium_load 🥈

- Import Time: 2.53 ms
- Relative Time: 9.15x (vs baseline)
- Memory Peak: 252.43 MB
- Memory Avg: 252.05 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** heavy_load

- Import Time: 9.11 ms
- Relative Time: 32.98x (vs baseline)
- Memory Peak: 253.97 MB
- Memory Avg: 253.46 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** enterprise_load

- Import Time: 24.77 ms
- Relative Time: 89.70x (vs baseline)
- Memory Peak: 261.87 MB
- Memory Avg: 258.25 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring


### Lazy Import + Install

*Lazy import + auto-install - SMART mode (on-demand)*

#### Top 3 Rankings by Load Test

##### Enterprise Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazy_import | 22.39 | 81.06x |
| 2 🥈 | xwlazy | 23.21 | 84.04x |
| 3 🥉 | lazy-imports | 23.41 | 84.77x |

##### Heavy Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | deferred-import | 8.03 | 29.07x |
| 2 🥈 | lazy_import | 8.03 | 29.08x |
| 3 🥉 | lazy-imports | 8.33 | 30.15x |

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazy-imports-lite | 0.36 | 1.30x |
| 2 🥈 | lazi | 0.37 | 1.32x |
| 3 🥉 | deferred-import | 0.45 | 1.62x |

##### Medium Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 2.33 | 8.44x |
| 2 🥈 | lazy-loader | 2.82 | 10.21x |
| 3 🥉 | deferred-import | 2.86 | 10.37x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| deferred-import 🥉 | light_load | 0.45 | 1.62x | 96.06 | 0.00 | ✅ |
| deferred-import 🥉 | medium_load | 2.86 | 10.37x | 96.86 | 0.00 | ✅ |
| deferred-import 🥇 | heavy_load | 8.03 | 29.07x | 98.31 | 0.00 | ✅ |
| deferred-import | enterprise_load | 23.50 | 85.08x | 105.48 | 0.00 | ✅ |
| lazi 🥈 | light_load | 0.37 | 1.32x | 128.01 | 0.00 | ✅ |
| lazi | medium_load | 3.68 | 13.33x | 129.14 | 0.00 | ✅ |
| lazi | heavy_load | 8.83 | 31.98x | 131.89 | 0.00 | ✅ |
| lazi | enterprise_load | 23.71 | 85.85x | 137.79 | 0.00 | ✅ |
| lazy-imports | light_load | 0.45 | 1.62x | 108.43 | 0.00 | ✅ |
| lazy-imports | medium_load | 3.59 | 13.00x | 108.48 | 0.00 | ✅ |
| lazy-imports 🥉 | heavy_load | 8.33 | 30.15x | 110.05 | 0.00 | ✅ |
| lazy-imports 🥉 | enterprise_load | 23.41 | 84.77x | 118.25 | 0.00 | ✅ |
| lazy-imports-lite 🥇 | light_load | 0.36 | 1.30x | 137.92 | 0.00 | ✅ |
| lazy-imports-lite | medium_load | 3.20 | 11.59x | 139.55 | 0.00 | ✅ |
| lazy-imports-lite | heavy_load | 9.99 | 36.16x | 141.20 | 0.00 | ✅ |
| lazy-imports-lite | enterprise_load | 24.94 | 90.31x | 142.04 | 0.00 | ✅ |
| lazy-loader | light_load | 0.72 | 2.62x | 105.61 | 0.00 | ✅ |
| lazy-loader 🥈 | medium_load | 2.82 | 10.21x | 107.20 | 0.00 | ✅ |
| lazy-loader | heavy_load | 8.99 | 32.54x | 107.71 | 0.00 | ✅ |
| lazy-loader | enterprise_load | 23.91 | 86.57x | 108.34 | 0.00 | ✅ |
| lazy_import | light_load | 0.63 | 2.29x | 118.43 | 0.00 | ✅ |
| lazy_import | medium_load | 2.99 | 10.82x | 119.42 | 0.00 | ✅ |
| lazy_import 🥈 | heavy_load | 8.03 | 29.08x | 121.43 | 0.00 | ✅ |
| lazy_import 🥇 | enterprise_load | 22.39 | 81.06x | 124.01 | 0.00 | ✅ |
| pipimport | light_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pipimport | medium_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pipimport | heavy_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pipimport | enterprise_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pylazyimports | light_load | 0.45 | 1.64x | 124.01 | 0.00 | ✅ |
| pylazyimports | medium_load | 3.28 | 11.87x | 124.01 | 0.00 | ✅ |
| pylazyimports | heavy_load | 9.41 | 34.09x | 124.07 | 0.00 | ✅ |
| pylazyimports | enterprise_load | 24.36 | 88.20x | 127.92 | 0.00 | ✅ |
| xwlazy | light_load | 0.67 | 2.44x | 142.05 | 0.00 | ✅ |
| xwlazy 🥇 | medium_load | 2.33 | 8.44x | 142.73 | 0.00 | ✅ |
| xwlazy | heavy_load | 8.58 | 31.05x | 144.76 | 0.00 | ✅ |
| xwlazy 🥈 | enterprise_load | 23.21 | 84.04x | 150.82 | 0.00 | ✅ |

#### Detailed Results

##### deferred-import 🥇

**Test:** light_load 🥉

- Import Time: 0.45 ms
- Relative Time: 1.62x (vs baseline)
- Memory Peak: 96.06 MB
- Memory Avg: 96.06 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** medium_load 🥉

- Import Time: 2.86 ms
- Relative Time: 10.37x (vs baseline)
- Memory Peak: 96.86 MB
- Memory Avg: 96.46 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** heavy_load 🥇

- Import Time: 8.03 ms
- Relative Time: 29.07x (vs baseline)
- Memory Peak: 98.31 MB
- Memory Avg: 97.59 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** enterprise_load

- Import Time: 23.50 ms
- Relative Time: 85.08x (vs baseline)
- Memory Peak: 105.48 MB
- Memory Avg: 101.89 MB
- Package Size: 0.00 MB
- Features: deferred_loading

##### lazi 🥈

**Test:** light_load 🥈

- Import Time: 0.37 ms
- Relative Time: 1.32x (vs baseline)
- Memory Peak: 128.01 MB
- Memory Avg: 128.00 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** medium_load

- Import Time: 3.68 ms
- Relative Time: 13.33x (vs baseline)
- Memory Peak: 129.14 MB
- Memory Avg: 128.58 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** heavy_load

- Import Time: 8.83 ms
- Relative Time: 31.98x (vs baseline)
- Memory Peak: 131.89 MB
- Memory Avg: 130.53 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** enterprise_load

- Import Time: 23.71 ms
- Relative Time: 85.85x (vs baseline)
- Memory Peak: 137.79 MB
- Memory Avg: 134.84 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

##### lazy-imports 🥉

**Test:** light_load

- Import Time: 0.45 ms
- Relative Time: 1.62x (vs baseline)
- Memory Peak: 108.43 MB
- Memory Avg: 108.43 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 3.59 ms
- Relative Time: 13.00x (vs baseline)
- Memory Peak: 108.48 MB
- Memory Avg: 108.46 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load 🥉

- Import Time: 8.33 ms
- Relative Time: 30.15x (vs baseline)
- Memory Peak: 110.05 MB
- Memory Avg: 109.27 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load 🥉

- Import Time: 23.41 ms
- Relative Time: 84.77x (vs baseline)
- Memory Peak: 118.25 MB
- Memory Avg: 114.17 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### lazy-imports-lite 🥇

**Test:** light_load 🥇

- Import Time: 0.36 ms
- Relative Time: 1.30x (vs baseline)
- Memory Peak: 137.92 MB
- Memory Avg: 137.91 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** medium_load

- Import Time: 3.20 ms
- Relative Time: 11.59x (vs baseline)
- Memory Peak: 139.55 MB
- Memory Avg: 138.73 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** heavy_load

- Import Time: 9.99 ms
- Relative Time: 36.16x (vs baseline)
- Memory Peak: 141.20 MB
- Memory Avg: 140.38 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** enterprise_load

- Import Time: 24.94 ms
- Relative Time: 90.31x (vs baseline)
- Memory Peak: 142.04 MB
- Memory Avg: 141.62 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

##### lazy-loader 🥈

**Test:** light_load

- Import Time: 0.72 ms
- Relative Time: 2.62x (vs baseline)
- Memory Peak: 105.61 MB
- Memory Avg: 105.59 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** medium_load 🥈

- Import Time: 2.82 ms
- Relative Time: 10.21x (vs baseline)
- Memory Peak: 107.20 MB
- Memory Avg: 106.41 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** heavy_load

- Import Time: 8.99 ms
- Relative Time: 32.54x (vs baseline)
- Memory Peak: 107.71 MB
- Memory Avg: 107.47 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** enterprise_load

- Import Time: 23.91 ms
- Relative Time: 86.57x (vs baseline)
- Memory Peak: 108.34 MB
- Memory Avg: 108.02 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

##### lazy_import 🥇

**Test:** light_load

- Import Time: 0.63 ms
- Relative Time: 2.29x (vs baseline)
- Memory Peak: 118.43 MB
- Memory Avg: 118.40 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 2.99 ms
- Relative Time: 10.82x (vs baseline)
- Memory Peak: 119.42 MB
- Memory Avg: 118.93 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load 🥈

- Import Time: 8.03 ms
- Relative Time: 29.08x (vs baseline)
- Memory Peak: 121.43 MB
- Memory Avg: 120.47 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load 🥇

- Import Time: 22.39 ms
- Relative Time: 81.06x (vs baseline)
- Memory Peak: 124.01 MB
- Memory Avg: 122.75 MB
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

##### pylazyimports

**Test:** light_load

- Import Time: 0.45 ms
- Relative Time: 1.64x (vs baseline)
- Memory Peak: 124.01 MB
- Memory Avg: 124.01 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 3.28 ms
- Relative Time: 11.87x (vs baseline)
- Memory Peak: 124.01 MB
- Memory Avg: 124.01 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 9.41 ms
- Relative Time: 34.09x (vs baseline)
- Memory Peak: 124.07 MB
- Memory Avg: 124.04 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 24.36 ms
- Relative Time: 88.20x (vs baseline)
- Memory Peak: 127.92 MB
- Memory Avg: 126.00 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### xwlazy 🥇

**Test:** light_load

- Import Time: 0.67 ms
- Relative Time: 2.44x (vs baseline)
- Memory Peak: 142.05 MB
- Memory Avg: 142.05 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** medium_load 🥇

- Import Time: 2.33 ms
- Relative Time: 8.44x (vs baseline)
- Memory Peak: 142.73 MB
- Memory Avg: 142.48 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** heavy_load

- Import Time: 8.58 ms
- Relative Time: 31.05x (vs baseline)
- Memory Peak: 144.76 MB
- Memory Avg: 143.83 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** enterprise_load 🥈

- Import Time: 23.21 ms
- Relative Time: 84.04x (vs baseline)
- Memory Peak: 150.82 MB
- Memory Avg: 147.95 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring


### Basic Lazy Import

*Basic lazy import (fair comparison - all libraries) - LITE mode*

#### Top 3 Rankings by Load Test

##### Enterprise Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 22.68 | 82.10x |
| 2 🥈 | lazy-loader | 23.56 | 85.29x |
| 3 🥉 | pylazyimports | 24.49 | 88.68x |

##### Heavy Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazy-imports | 7.89 | 28.57x |
| 2 🥈 | xwlazy | 8.57 | 31.04x |
| 3 🥉 | lazy-imports-lite | 8.65 | 31.33x |

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazi | 0.28 | 1.00x |
| 2 🥈 | lazy-imports | 0.38 | 1.38x |
| 3 🥉 | pylazyimports | 0.40 | 1.45x |

##### Medium Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazy-loader | 2.53 | 9.15x |
| 2 🥈 | pylazyimports | 2.63 | 9.54x |
| 3 🥉 | lazy-imports | 2.66 | 9.64x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| deferred-import | light_load | 0.49 | 1.78x | 29.02 | 0.00 | ✅ |
| deferred-import | medium_load | 3.17 | 11.49x | 29.97 | 0.00 | ✅ |
| deferred-import | heavy_load | 9.16 | 33.16x | 33.87 | 0.00 | ✅ |
| deferred-import | enterprise_load | 26.08 | 94.44x | 43.40 | 0.00 | ✅ |
| lazi 🥇 | light_load | 0.28 | 1.00x | 71.79 | 0.00 | ✅ |
| lazi | medium_load | 3.38 | 12.24x | 71.91 | 0.00 | ✅ |
| lazi | heavy_load | 8.70 | 31.50x | 73.72 | 0.00 | ✅ |
| lazi | enterprise_load | 26.73 | 96.78x | 80.97 | 0.00 | ✅ |
| lazy-imports 🥈 | light_load | 0.38 | 1.38x | 50.46 | 0.00 | ✅ |
| lazy-imports 🥉 | medium_load | 2.66 | 9.64x | 50.61 | 0.00 | ✅ |
| lazy-imports 🥇 | heavy_load | 7.89 | 28.57x | 52.46 | 0.00 | ✅ |
| lazy-imports | enterprise_load | 27.36 | 99.07x | 57.63 | 0.00 | ✅ |
| lazy-imports-lite | light_load | 0.53 | 1.91x | 81.08 | 0.00 | ✅ |
| lazy-imports-lite | medium_load | 2.88 | 10.42x | 82.70 | 0.00 | ✅ |
| lazy-imports-lite 🥉 | heavy_load | 8.65 | 31.33x | 84.78 | 0.00 | ✅ |
| lazy-imports-lite | enterprise_load | 32.85 | 118.94x | 88.24 | 0.00 | ✅ |
| lazy-loader | light_load | 0.45 | 1.63x | 43.51 | 0.00 | ✅ |
| lazy-loader 🥇 | medium_load | 2.53 | 9.15x | 45.21 | 0.00 | ✅ |
| lazy-loader | heavy_load | 8.78 | 31.77x | 47.11 | 0.00 | ✅ |
| lazy-loader 🥈 | enterprise_load | 23.56 | 85.29x | 50.45 | 0.00 | ✅ |
| lazy_import | light_load | 0.85 | 3.09x | 57.92 | 0.00 | ✅ |
| lazy_import | medium_load | 3.07 | 11.13x | 59.09 | 0.00 | ✅ |
| lazy_import | heavy_load | 9.99 | 36.17x | 61.37 | 0.00 | ✅ |
| lazy_import | enterprise_load | 26.12 | 94.56x | 69.02 | 0.00 | ✅ |
| pipimport | light_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pipimport | medium_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pipimport | heavy_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pipimport | enterprise_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pylazyimports 🥉 | light_load | 0.40 | 1.45x | 69.17 | 0.00 | ✅ |
| pylazyimports 🥈 | medium_load | 2.63 | 9.54x | 70.65 | 0.00 | ✅ |
| pylazyimports | heavy_load | 11.66 | 42.21x | 71.09 | 0.00 | ✅ |
| pylazyimports 🥉 | enterprise_load | 24.49 | 88.68x | 71.73 | 0.00 | ✅ |
| xwlazy | light_load | 0.46 | 1.67x | 88.31 | 0.00 | ✅ |
| xwlazy | medium_load | 3.11 | 11.25x | 89.04 | 0.00 | ✅ |
| xwlazy 🥈 | heavy_load | 8.57 | 31.04x | 90.01 | 0.00 | ✅ |
| xwlazy 🥇 | enterprise_load | 22.68 | 82.10x | 95.12 | 0.00 | ✅ |

#### Detailed Results

##### deferred-import

**Test:** light_load

- Import Time: 0.49 ms
- Relative Time: 1.78x (vs baseline)
- Memory Peak: 29.02 MB
- Memory Avg: 28.78 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** medium_load

- Import Time: 3.17 ms
- Relative Time: 11.49x (vs baseline)
- Memory Peak: 29.97 MB
- Memory Avg: 29.67 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** heavy_load

- Import Time: 9.16 ms
- Relative Time: 33.16x (vs baseline)
- Memory Peak: 33.87 MB
- Memory Avg: 31.92 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** enterprise_load

- Import Time: 26.08 ms
- Relative Time: 94.44x (vs baseline)
- Memory Peak: 43.40 MB
- Memory Avg: 38.63 MB
- Package Size: 0.00 MB
- Features: deferred_loading

##### lazi 🥇

**Test:** light_load 🥇

- Import Time: 0.28 ms
- Relative Time: 1.00x (vs baseline)
- Memory Peak: 71.79 MB
- Memory Avg: 71.79 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** medium_load

- Import Time: 3.38 ms
- Relative Time: 12.24x (vs baseline)
- Memory Peak: 71.91 MB
- Memory Avg: 71.85 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** heavy_load

- Import Time: 8.70 ms
- Relative Time: 31.50x (vs baseline)
- Memory Peak: 73.72 MB
- Memory Avg: 72.82 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** enterprise_load

- Import Time: 26.73 ms
- Relative Time: 96.78x (vs baseline)
- Memory Peak: 80.97 MB
- Memory Avg: 77.35 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

##### lazy-imports 🥇

**Test:** light_load 🥈

- Import Time: 0.38 ms
- Relative Time: 1.38x (vs baseline)
- Memory Peak: 50.46 MB
- Memory Avg: 50.46 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load 🥉

- Import Time: 2.66 ms
- Relative Time: 9.64x (vs baseline)
- Memory Peak: 50.61 MB
- Memory Avg: 50.53 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load 🥇

- Import Time: 7.89 ms
- Relative Time: 28.57x (vs baseline)
- Memory Peak: 52.46 MB
- Memory Avg: 51.55 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 27.36 ms
- Relative Time: 99.07x (vs baseline)
- Memory Peak: 57.63 MB
- Memory Avg: 55.04 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### lazy-imports-lite 🥉

**Test:** light_load

- Import Time: 0.53 ms
- Relative Time: 1.91x (vs baseline)
- Memory Peak: 81.08 MB
- Memory Avg: 81.07 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** medium_load

- Import Time: 2.88 ms
- Relative Time: 10.42x (vs baseline)
- Memory Peak: 82.70 MB
- Memory Avg: 81.89 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** heavy_load 🥉

- Import Time: 8.65 ms
- Relative Time: 31.33x (vs baseline)
- Memory Peak: 84.78 MB
- Memory Avg: 83.74 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** enterprise_load

- Import Time: 32.85 ms
- Relative Time: 118.94x (vs baseline)
- Memory Peak: 88.24 MB
- Memory Avg: 86.51 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

##### lazy-loader 🥇

**Test:** light_load

- Import Time: 0.45 ms
- Relative Time: 1.63x (vs baseline)
- Memory Peak: 43.51 MB
- Memory Avg: 43.50 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** medium_load 🥇

- Import Time: 2.53 ms
- Relative Time: 9.15x (vs baseline)
- Memory Peak: 45.21 MB
- Memory Avg: 44.37 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** heavy_load

- Import Time: 8.78 ms
- Relative Time: 31.77x (vs baseline)
- Memory Peak: 47.11 MB
- Memory Avg: 46.18 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** enterprise_load 🥈

- Import Time: 23.56 ms
- Relative Time: 85.29x (vs baseline)
- Memory Peak: 50.45 MB
- Memory Avg: 48.81 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

##### lazy_import

**Test:** light_load

- Import Time: 0.85 ms
- Relative Time: 3.09x (vs baseline)
- Memory Peak: 57.92 MB
- Memory Avg: 57.82 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 3.07 ms
- Relative Time: 11.13x (vs baseline)
- Memory Peak: 59.09 MB
- Memory Avg: 58.52 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 9.99 ms
- Relative Time: 36.17x (vs baseline)
- Memory Peak: 61.37 MB
- Memory Avg: 60.27 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 26.12 ms
- Relative Time: 94.56x (vs baseline)
- Memory Peak: 69.02 MB
- Memory Avg: 65.22 MB
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

**Test:** light_load 🥉

- Import Time: 0.40 ms
- Relative Time: 1.45x (vs baseline)
- Memory Peak: 69.17 MB
- Memory Avg: 69.12 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load 🥈

- Import Time: 2.63 ms
- Relative Time: 9.54x (vs baseline)
- Memory Peak: 70.65 MB
- Memory Avg: 69.92 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 11.66 ms
- Relative Time: 42.21x (vs baseline)
- Memory Peak: 71.09 MB
- Memory Avg: 70.92 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load 🥉

- Import Time: 24.49 ms
- Relative Time: 88.68x (vs baseline)
- Memory Peak: 71.73 MB
- Memory Avg: 71.42 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### xwlazy 🥇

**Test:** light_load

- Import Time: 0.46 ms
- Relative Time: 1.67x (vs baseline)
- Memory Peak: 88.31 MB
- Memory Avg: 88.31 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** medium_load

- Import Time: 3.11 ms
- Relative Time: 11.25x (vs baseline)
- Memory Peak: 89.04 MB
- Memory Avg: 88.89 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** heavy_load 🥈

- Import Time: 8.57 ms
- Relative Time: 31.04x (vs baseline)
- Memory Peak: 90.01 MB
- Memory Avg: 89.69 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** enterprise_load 🥇

- Import Time: 22.68 ms
- Relative Time: 82.10x (vs baseline)
- Memory Peak: 95.12 MB
- Memory Avg: 92.61 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring


### Preload Mode

*Preload all modules on start - PRELOAD mode*

#### Top 3 Rankings by Load Test

##### Enterprise Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazi | 23.17 | 83.91x |
| 2 🥈 | pylazyimports | 23.41 | 84.77x |
| 3 🥉 | lazy-imports | 23.86 | 86.38x |

##### Heavy Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazy-imports-lite | 8.17 | 29.59x |
| 2 🥈 | lazy-loader | 8.21 | 29.74x |
| 3 🥉 | lazy-imports | 8.57 | 31.03x |

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazi | 0.39 | 1.41x |
| 2 🥈 | pylazyimports | 0.48 | 1.74x |
| 3 🥉 | lazy-loader | 0.50 | 1.82x |

##### Medium Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazy-loader | 2.58 | 9.36x |
| 2 🥈 | lazy_import | 2.66 | 9.63x |
| 3 🥉 | pylazyimports | 2.75 | 9.96x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| deferred-import | light_load | 0.64 | 2.32x | 151.42 | 0.00 | ✅ |
| deferred-import | medium_load | 2.84 | 10.30x | 152.38 | 0.00 | ✅ |
| deferred-import | heavy_load | 10.32 | 37.35x | 153.78 | 0.00 | ✅ |
| deferred-import | enterprise_load | 24.51 | 88.75x | 160.71 | 0.00 | ✅ |
| lazi 🥇 | light_load | 0.39 | 1.41x | 185.00 | 0.00 | ✅ |
| lazi | medium_load | 3.91 | 14.17x | 185.00 | 0.00 | ✅ |
| lazi | heavy_load | 8.85 | 32.05x | 185.14 | 0.00 | ✅ |
| lazi 🥇 | enterprise_load | 23.17 | 83.91x | 189.71 | 0.00 | ✅ |
| lazy-imports | light_load | 0.61 | 2.21x | 161.59 | 0.00 | ✅ |
| lazy-imports | medium_load | 3.04 | 11.01x | 162.63 | 0.00 | ✅ |
| lazy-imports 🥉 | heavy_load | 8.57 | 31.03x | 164.40 | 0.00 | ✅ |
| lazy-imports 🥉 | enterprise_load | 23.86 | 86.38x | 169.05 | 0.00 | ✅ |
| lazy-imports-lite | light_load | 0.71 | 2.56x | 189.86 | 0.00 | ✅ |
| lazy-imports-lite | medium_load | 3.00 | 10.86x | 191.04 | 0.00 | ✅ |
| lazy-imports-lite 🥇 | heavy_load | 8.17 | 29.59x | 193.34 | 0.00 | ✅ |
| lazy-imports-lite | enterprise_load | 26.47 | 95.84x | 200.12 | 0.00 | ✅ |
| lazy-loader 🥉 | light_load | 0.50 | 1.82x | 160.71 | 0.00 | ✅ |
| lazy-loader 🥇 | medium_load | 2.58 | 9.36x | 160.79 | 0.00 | ✅ |
| lazy-loader 🥈 | heavy_load | 8.21 | 29.74x | 160.82 | 0.00 | ✅ |
| lazy-loader | enterprise_load | 26.14 | 94.64x | 161.43 | 0.00 | ✅ |
| lazy_import | light_load | 0.76 | 2.75x | 169.34 | 0.00 | ✅ |
| lazy_import 🥈 | medium_load | 2.66 | 9.63x | 170.61 | 0.00 | ✅ |
| lazy_import | heavy_load | 9.20 | 33.32x | 172.70 | 0.00 | ✅ |
| lazy_import | enterprise_load | 25.01 | 90.55x | 180.29 | 0.00 | ✅ |
| pipimport | light_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pipimport | medium_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pipimport | heavy_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pipimport | enterprise_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pylazyimports 🥈 | light_load | 0.48 | 1.74x | 180.39 | 0.00 | ✅ |
| pylazyimports 🥉 | medium_load | 2.75 | 9.96x | 181.53 | 0.00 | ✅ |
| pylazyimports | heavy_load | 8.58 | 31.06x | 183.70 | 0.00 | ✅ |
| pylazyimports 🥈 | enterprise_load | 23.41 | 84.77x | 185.00 | 0.00 | ✅ |
| xwlazy | light_load | 1.56 | 5.66x | 200.22 | 0.00 | ✅ |
| xwlazy | medium_load | 6.35 | 23.00x | 201.32 | 0.00 | ✅ |
| xwlazy | heavy_load | 27.49 | 99.53x | 203.68 | 0.00 | ✅ |
| xwlazy | enterprise_load | 58.88 | 213.17x | 209.30 | 0.00 | ✅ |

#### Detailed Results

##### deferred-import

**Test:** light_load

- Import Time: 0.64 ms
- Relative Time: 2.32x (vs baseline)
- Memory Peak: 151.42 MB
- Memory Avg: 151.42 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** medium_load

- Import Time: 2.84 ms
- Relative Time: 10.30x (vs baseline)
- Memory Peak: 152.38 MB
- Memory Avg: 151.90 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** heavy_load

- Import Time: 10.32 ms
- Relative Time: 37.35x (vs baseline)
- Memory Peak: 153.78 MB
- Memory Avg: 153.09 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** enterprise_load

- Import Time: 24.51 ms
- Relative Time: 88.75x (vs baseline)
- Memory Peak: 160.71 MB
- Memory Avg: 157.25 MB
- Package Size: 0.00 MB
- Features: deferred_loading

##### lazi 🥇

**Test:** light_load 🥇

- Import Time: 0.39 ms
- Relative Time: 1.41x (vs baseline)
- Memory Peak: 185.00 MB
- Memory Avg: 185.00 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** medium_load

- Import Time: 3.91 ms
- Relative Time: 14.17x (vs baseline)
- Memory Peak: 185.00 MB
- Memory Avg: 185.00 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** heavy_load

- Import Time: 8.85 ms
- Relative Time: 32.05x (vs baseline)
- Memory Peak: 185.14 MB
- Memory Avg: 185.07 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** enterprise_load 🥇

- Import Time: 23.17 ms
- Relative Time: 83.91x (vs baseline)
- Memory Peak: 189.71 MB
- Memory Avg: 187.43 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

##### lazy-imports 🥉

**Test:** light_load

- Import Time: 0.61 ms
- Relative Time: 2.21x (vs baseline)
- Memory Peak: 161.59 MB
- Memory Avg: 161.59 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 3.04 ms
- Relative Time: 11.01x (vs baseline)
- Memory Peak: 162.63 MB
- Memory Avg: 162.11 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load 🥉

- Import Time: 8.57 ms
- Relative Time: 31.03x (vs baseline)
- Memory Peak: 164.40 MB
- Memory Avg: 163.54 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load 🥉

- Import Time: 23.86 ms
- Relative Time: 86.38x (vs baseline)
- Memory Peak: 169.05 MB
- Memory Avg: 166.75 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### lazy-imports-lite 🥇

**Test:** light_load

- Import Time: 0.71 ms
- Relative Time: 2.56x (vs baseline)
- Memory Peak: 189.86 MB
- Memory Avg: 189.85 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** medium_load

- Import Time: 3.00 ms
- Relative Time: 10.86x (vs baseline)
- Memory Peak: 191.04 MB
- Memory Avg: 190.45 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** heavy_load 🥇

- Import Time: 8.17 ms
- Relative Time: 29.59x (vs baseline)
- Memory Peak: 193.34 MB
- Memory Avg: 192.19 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** enterprise_load

- Import Time: 26.47 ms
- Relative Time: 95.84x (vs baseline)
- Memory Peak: 200.12 MB
- Memory Avg: 196.74 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

##### lazy-loader 🥇

**Test:** light_load 🥉

- Import Time: 0.50 ms
- Relative Time: 1.82x (vs baseline)
- Memory Peak: 160.71 MB
- Memory Avg: 160.71 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** medium_load 🥇

- Import Time: 2.58 ms
- Relative Time: 9.36x (vs baseline)
- Memory Peak: 160.79 MB
- Memory Avg: 160.75 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** heavy_load 🥈

- Import Time: 8.21 ms
- Relative Time: 29.74x (vs baseline)
- Memory Peak: 160.82 MB
- Memory Avg: 160.80 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** enterprise_load

- Import Time: 26.14 ms
- Relative Time: 94.64x (vs baseline)
- Memory Peak: 161.43 MB
- Memory Avg: 161.12 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

##### lazy_import 🥈

**Test:** light_load

- Import Time: 0.76 ms
- Relative Time: 2.75x (vs baseline)
- Memory Peak: 169.34 MB
- Memory Avg: 169.28 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load 🥈

- Import Time: 2.66 ms
- Relative Time: 9.63x (vs baseline)
- Memory Peak: 170.61 MB
- Memory Avg: 170.02 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 9.20 ms
- Relative Time: 33.32x (vs baseline)
- Memory Peak: 172.70 MB
- Memory Avg: 171.67 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 25.01 ms
- Relative Time: 90.55x (vs baseline)
- Memory Peak: 180.29 MB
- Memory Avg: 176.49 MB
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

**Test:** light_load 🥈

- Import Time: 0.48 ms
- Relative Time: 1.74x (vs baseline)
- Memory Peak: 180.39 MB
- Memory Avg: 180.38 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load 🥉

- Import Time: 2.75 ms
- Relative Time: 9.96x (vs baseline)
- Memory Peak: 181.53 MB
- Memory Avg: 180.96 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 8.58 ms
- Relative Time: 31.06x (vs baseline)
- Memory Peak: 183.70 MB
- Memory Avg: 182.62 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load 🥈

- Import Time: 23.41 ms
- Relative Time: 84.77x (vs baseline)
- Memory Peak: 185.00 MB
- Memory Avg: 184.48 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### xwlazy

**Test:** light_load

- Import Time: 1.56 ms
- Relative Time: 5.66x (vs baseline)
- Memory Peak: 200.22 MB
- Memory Avg: 200.22 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** medium_load

- Import Time: 6.35 ms
- Relative Time: 23.00x (vs baseline)
- Memory Peak: 201.32 MB
- Memory Avg: 201.05 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** heavy_load

- Import Time: 27.49 ms
- Relative Time: 99.53x (vs baseline)
- Memory Peak: 203.68 MB
- Memory Avg: 202.64 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** enterprise_load

- Import Time: 58.88 ms
- Relative Time: 213.17x (vs baseline)
- Memory Peak: 209.30 MB
- Memory Avg: 206.54 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring


## Overall Winner 👑

**xwlazy 👑** wins with **6 first place victory(ies)** across all test categories!

### Winner Summary

| Library | First Place Wins |
|---------|------------------|
| xwlazy 👑 | 6 |
| lazi | 5 |
| lazy-loader | 5 |
| lazy-imports-lite | 4 |
| pylazyimports | 4 |
| lazy-imports | 3 |
| deferred-import | 3 |
| lazy_import | 2 |


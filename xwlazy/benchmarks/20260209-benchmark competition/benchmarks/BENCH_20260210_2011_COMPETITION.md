# Competition Benchmark Report

**Generated:** 2026-02-10T20:11:05.773767

## Standard Tests

### Auto Mode

*Smart install + auto-uninstall large - AUTO mode*

#### Top 3 Rankings by Load Test

##### Enterprise Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | pylazyimports | 34.60 | 119.19x |
| 2 🥈 | lazy-imports-lite | 38.71 | 133.35x |
| 3 🥉 | lazy-loader | 39.12 | 134.76x |

##### Heavy Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | pylazyimports | 13.70 | 47.18x |
| 2 🥈 | lazy-imports-lite | 14.16 | 48.79x |
| 3 🥉 | xwlazy | 14.46 | 49.80x |

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazy-imports-lite | 0.73 | 2.51x |
| 2 🥈 | pylazyimports | 0.82 | 2.81x |
| 3 🥉 | pipimport | 1.05 | 3.60x |

##### Medium Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 4.06 | 13.99x |
| 2 🥈 | lazy-imports-lite | 4.54 | 15.62x |
| 3 🥉 | lazy-loader | 4.92 | 16.94x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| deferred-import | light_load | 1.15 | 3.97x | 414.66 | 0.00 | ✅ |
| deferred-import | medium_load | 5.76 | 19.84x | 415.77 | 0.00 | ✅ |
| deferred-import | heavy_load | 18.76 | 64.61x | 418.79 | 0.00 | ✅ |
| deferred-import | enterprise_load | 49.09 | 169.11x | 421.84 | 0.00 | ✅ |
| lazi | light_load | 2.23 | 7.69x | 422.38 | 0.00 | ✅ |
| lazi | medium_load | 7.19 | 24.78x | 422.41 | 0.00 | ✅ |
| lazi | heavy_load | 16.76 | 57.73x | 423.06 | 0.00 | ✅ |
| lazi | enterprise_load | 40.49 | 139.48x | 423.68 | 0.00 | ✅ |
| lazy-imports | light_load | 1.23 | 4.23x | 422.02 | 0.00 | ✅ |
| lazy-imports | medium_load | 7.10 | 24.46x | 422.02 | 0.00 | ✅ |
| lazy-imports | heavy_load | 22.48 | 77.45x | 422.02 | 0.00 | ✅ |
| lazy-imports | enterprise_load | 57.97 | 199.69x | 422.03 | 0.00 | ✅ |
| lazy-imports-lite 🥇 | light_load | 0.73 | 2.51x | 423.97 | 0.00 | ✅ |
| lazy-imports-lite 🥈 | medium_load | 4.54 | 15.62x | 425.15 | 0.00 | ✅ |
| lazy-imports-lite 🥈 | heavy_load | 14.16 | 48.79x | 426.42 | 0.00 | ✅ |
| lazy-imports-lite 🥈 | enterprise_load | 38.71 | 133.35x | 434.46 | 0.00 | ✅ |
| lazy-loader | light_load | 1.43 | 4.91x | 421.85 | 0.00 | ✅ |
| lazy-loader 🥉 | medium_load | 4.92 | 16.94x | 421.88 | 0.00 | ✅ |
| lazy-loader | heavy_load | 18.10 | 62.34x | 421.88 | 0.00 | ✅ |
| lazy-loader 🥉 | enterprise_load | 39.12 | 134.76x | 422.02 | 0.00 | ✅ |
| lazy_import | light_load | 1.63 | 5.63x | 422.03 | 0.00 | ✅ |
| lazy_import | medium_load | 5.54 | 19.10x | 422.03 | 0.00 | ✅ |
| lazy_import | heavy_load | 20.09 | 69.21x | 422.03 | 0.00 | ✅ |
| lazy_import | enterprise_load | 54.24 | 186.83x | 422.04 | 0.00 | ✅ |
| pipimport 🥉 | light_load | 1.05 | 3.60x | 404.68 | 0.00 | ✅ |
| pipimport | medium_load | 5.91 | 20.36x | 405.50 | 0.00 | ✅ |
| pipimport | heavy_load | 19.64 | 67.65x | 406.64 | 0.00 | ✅ |
| pipimport | enterprise_load | 50.74 | 174.79x | 414.07 | 0.00 | ✅ |
| pylazyimports 🥈 | light_load | 0.82 | 2.81x | 422.05 | 0.00 | ✅ |
| pylazyimports | medium_load | 5.60 | 19.29x | 422.05 | 0.00 | ✅ |
| pylazyimports 🥇 | heavy_load | 13.70 | 47.18x | 422.05 | 0.00 | ✅ |
| pylazyimports 🥇 | enterprise_load | 34.60 | 119.19x | 422.39 | 0.00 | ✅ |
| xwlazy | light_load | 2.15 | 7.41x | 435.21 | 0.00 | ✅ |
| xwlazy 🥇 | medium_load | 4.06 | 13.99x | 438.96 | 0.00 | ✅ |
| xwlazy 🥉 | heavy_load | 14.46 | 49.80x | 442.33 | 0.00 | ✅ |
| xwlazy | enterprise_load | 41.37 | 142.52x | 452.23 | 0.00 | ✅ |

#### Detailed Results

##### deferred-import

**Test:** light_load

- Import Time: 1.15 ms
- Relative Time: 3.97x (vs baseline)
- Memory Peak: 414.66 MB
- Memory Avg: 414.61 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** medium_load

- Import Time: 5.76 ms
- Relative Time: 19.84x (vs baseline)
- Memory Peak: 415.77 MB
- Memory Avg: 415.21 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** heavy_load

- Import Time: 18.76 ms
- Relative Time: 64.61x (vs baseline)
- Memory Peak: 418.79 MB
- Memory Avg: 417.28 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** enterprise_load

- Import Time: 49.09 ms
- Relative Time: 169.11x (vs baseline)
- Memory Peak: 421.84 MB
- Memory Avg: 420.32 MB
- Package Size: 0.00 MB
- Features: deferred_loading

##### lazi

**Test:** light_load

- Import Time: 2.23 ms
- Relative Time: 7.69x (vs baseline)
- Memory Peak: 422.38 MB
- Memory Avg: 422.38 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** medium_load

- Import Time: 7.19 ms
- Relative Time: 24.78x (vs baseline)
- Memory Peak: 422.41 MB
- Memory Avg: 422.39 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** heavy_load

- Import Time: 16.76 ms
- Relative Time: 57.73x (vs baseline)
- Memory Peak: 423.06 MB
- Memory Avg: 422.74 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** enterprise_load

- Import Time: 40.49 ms
- Relative Time: 139.48x (vs baseline)
- Memory Peak: 423.68 MB
- Memory Avg: 423.37 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

##### lazy-imports

**Test:** light_load

- Import Time: 1.23 ms
- Relative Time: 4.23x (vs baseline)
- Memory Peak: 422.02 MB
- Memory Avg: 422.02 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 7.10 ms
- Relative Time: 24.46x (vs baseline)
- Memory Peak: 422.02 MB
- Memory Avg: 422.02 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 22.48 ms
- Relative Time: 77.45x (vs baseline)
- Memory Peak: 422.02 MB
- Memory Avg: 422.02 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 57.97 ms
- Relative Time: 199.69x (vs baseline)
- Memory Peak: 422.03 MB
- Memory Avg: 422.03 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### lazy-imports-lite 🥇

**Test:** light_load 🥇

- Import Time: 0.73 ms
- Relative Time: 2.51x (vs baseline)
- Memory Peak: 423.97 MB
- Memory Avg: 423.88 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** medium_load 🥈

- Import Time: 4.54 ms
- Relative Time: 15.62x (vs baseline)
- Memory Peak: 425.15 MB
- Memory Avg: 424.56 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** heavy_load 🥈

- Import Time: 14.16 ms
- Relative Time: 48.79x (vs baseline)
- Memory Peak: 426.42 MB
- Memory Avg: 425.79 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** enterprise_load 🥈

- Import Time: 38.71 ms
- Relative Time: 133.35x (vs baseline)
- Memory Peak: 434.46 MB
- Memory Avg: 430.44 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

##### lazy-loader 🥉

**Test:** light_load

- Import Time: 1.43 ms
- Relative Time: 4.91x (vs baseline)
- Memory Peak: 421.85 MB
- Memory Avg: 421.85 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** medium_load 🥉

- Import Time: 4.92 ms
- Relative Time: 16.94x (vs baseline)
- Memory Peak: 421.88 MB
- Memory Avg: 421.86 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** heavy_load

- Import Time: 18.10 ms
- Relative Time: 62.34x (vs baseline)
- Memory Peak: 421.88 MB
- Memory Avg: 421.88 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** enterprise_load 🥉

- Import Time: 39.12 ms
- Relative Time: 134.76x (vs baseline)
- Memory Peak: 422.02 MB
- Memory Avg: 421.95 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

##### lazy_import

**Test:** light_load

- Import Time: 1.63 ms
- Relative Time: 5.63x (vs baseline)
- Memory Peak: 422.03 MB
- Memory Avg: 422.03 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 5.54 ms
- Relative Time: 19.10x (vs baseline)
- Memory Peak: 422.03 MB
- Memory Avg: 422.03 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 20.09 ms
- Relative Time: 69.21x (vs baseline)
- Memory Peak: 422.03 MB
- Memory Avg: 422.03 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 54.24 ms
- Relative Time: 186.83x (vs baseline)
- Memory Peak: 422.04 MB
- Memory Avg: 422.03 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### pipimport 🥉

**Test:** light_load 🥉

- Import Time: 1.05 ms
- Relative Time: 3.60x (vs baseline)
- Memory Peak: 404.68 MB
- Memory Avg: 404.61 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** medium_load

- Import Time: 5.91 ms
- Relative Time: 20.36x (vs baseline)
- Memory Peak: 405.50 MB
- Memory Avg: 405.09 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** heavy_load

- Import Time: 19.64 ms
- Relative Time: 67.65x (vs baseline)
- Memory Peak: 406.64 MB
- Memory Avg: 406.09 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** enterprise_load

- Import Time: 50.74 ms
- Relative Time: 174.79x (vs baseline)
- Memory Peak: 414.07 MB
- Memory Avg: 410.43 MB
- Package Size: 0.00 MB
- Features: auto_install

##### pylazyimports 🥇

**Test:** light_load 🥈

- Import Time: 0.82 ms
- Relative Time: 2.81x (vs baseline)
- Memory Peak: 422.05 MB
- Memory Avg: 422.05 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 5.60 ms
- Relative Time: 19.29x (vs baseline)
- Memory Peak: 422.05 MB
- Memory Avg: 422.05 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load 🥇

- Import Time: 13.70 ms
- Relative Time: 47.18x (vs baseline)
- Memory Peak: 422.05 MB
- Memory Avg: 422.05 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load 🥇

- Import Time: 34.60 ms
- Relative Time: 119.19x (vs baseline)
- Memory Peak: 422.39 MB
- Memory Avg: 422.22 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### xwlazy 🥇

**Test:** light_load

- Import Time: 2.15 ms
- Relative Time: 7.41x (vs baseline)
- Memory Peak: 435.21 MB
- Memory Avg: 435.12 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** medium_load 🥇

- Import Time: 4.06 ms
- Relative Time: 13.99x (vs baseline)
- Memory Peak: 438.96 MB
- Memory Avg: 437.79 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** heavy_load 🥉

- Import Time: 14.46 ms
- Relative Time: 49.80x (vs baseline)
- Memory Peak: 442.33 MB
- Memory Avg: 441.03 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** enterprise_load

- Import Time: 41.37 ms
- Relative Time: 142.52x (vs baseline)
- Memory Peak: 452.23 MB
- Memory Avg: 447.89 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring


### Clean Mode

*Install on usage + uninstall after - CLEAN mode*

#### Top 3 Rankings by Load Test

##### Enterprise Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazy-imports | 29.51 | 101.64x |
| 2 🥈 | xwlazy | 43.36 | 149.36x |
| 3 🥉 | pipimport | 45.61 | 157.12x |

##### Heavy Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazy-imports | 10.82 | 37.26x |
| 2 🥈 | pipimport | 17.28 | 59.54x |
| 3 🥉 | xwlazy | 17.87 | 61.56x |

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazy-imports | 0.63 | 2.18x |
| 2 🥈 | pylazyimports | 0.83 | 2.86x |
| 3 🥉 | deferred-import | 0.94 | 3.24x |

##### Medium Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazy-imports | 3.51 | 12.09x |
| 2 🥈 | lazi | 5.10 | 17.56x |
| 3 🥉 | pipimport | 5.31 | 18.28x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| deferred-import 🥉 | light_load | 0.94 | 3.24x | 360.98 | 0.00 | ✅ |
| deferred-import | medium_load | 6.25 | 21.53x | 362.16 | 0.00 | ✅ |
| deferred-import | heavy_load | 20.79 | 71.61x | 364.89 | 0.00 | ✅ |
| deferred-import | enterprise_load | 49.72 | 171.29x | 370.09 | 0.00 | ✅ |
| lazi | light_load | 1.14 | 3.92x | 393.07 | 0.00 | ✅ |
| lazi 🥈 | medium_load | 5.10 | 17.56x | 393.07 | 0.00 | ✅ |
| lazi | heavy_load | 18.74 | 64.56x | 393.07 | 0.00 | ✅ |
| lazi | enterprise_load | 70.46 | 242.71x | 393.11 | 0.00 | ✅ |
| lazy-imports 🥇 | light_load | 0.63 | 2.18x | 382.77 | 0.00 | ✅ |
| lazy-imports 🥇 | medium_load | 3.51 | 12.09x | 383.56 | 0.00 | ✅ |
| lazy-imports 🥇 | heavy_load | 10.82 | 37.26x | 386.66 | 0.00 | ✅ |
| lazy-imports 🥇 | enterprise_load | 29.51 | 101.64x | 391.65 | 0.00 | ✅ |
| lazy-imports-lite | light_load | 1.15 | 3.98x | 393.11 | 0.00 | ✅ |
| lazy-imports-lite | medium_load | 7.03 | 24.22x | 393.11 | 0.00 | ✅ |
| lazy-imports-lite | heavy_load | 19.29 | 66.45x | 393.13 | 0.00 | ✅ |
| lazy-imports-lite | enterprise_load | 53.26 | 183.47x | 393.53 | 0.00 | ✅ |
| lazy-loader | light_load | 1.24 | 4.27x | 370.70 | 0.00 | ✅ |
| lazy-loader | medium_load | 7.03 | 24.21x | 371.95 | 0.00 | ✅ |
| lazy-loader | heavy_load | 23.39 | 80.59x | 373.85 | 0.00 | ✅ |
| lazy-loader | enterprise_load | 53.63 | 184.76x | 382.29 | 0.00 | ✅ |
| lazy_import | light_load | 1.74 | 5.99x | 392.13 | 0.00 | ✅ |
| lazy_import | medium_load | 7.39 | 25.46x | 392.87 | 0.00 | ✅ |
| lazy_import | heavy_load | 18.52 | 63.81x | 392.90 | 0.00 | ✅ |
| lazy_import | enterprise_load | 52.90 | 182.24x | 392.95 | 0.00 | ✅ |
| pipimport | light_load | 1.34 | 4.63x | 351.27 | 0.00 | ✅ |
| pipimport 🥉 | medium_load | 5.31 | 18.28x | 351.82 | 0.00 | ✅ |
| pipimport 🥈 | heavy_load | 17.28 | 59.54x | 353.71 | 0.00 | ✅ |
| pipimport 🥉 | enterprise_load | 45.61 | 157.12x | 360.45 | 0.00 | ✅ |
| pylazyimports 🥈 | light_load | 0.83 | 2.86x | 392.96 | 0.00 | ✅ |
| pylazyimports | medium_load | 6.10 | 21.00x | 392.96 | 0.00 | ✅ |
| pylazyimports | heavy_load | 19.30 | 66.48x | 392.96 | 0.00 | ✅ |
| pylazyimports | enterprise_load | 58.32 | 200.90x | 393.03 | 0.00 | ✅ |
| xwlazy | light_load | 1.35 | 4.64x | 393.54 | 0.00 | ✅ |
| xwlazy | medium_load | 5.86 | 20.17x | 394.41 | 0.00 | ✅ |
| xwlazy 🥉 | heavy_load | 17.87 | 61.56x | 395.09 | 0.00 | ✅ |
| xwlazy 🥈 | enterprise_load | 43.36 | 149.36x | 402.52 | 0.00 | ✅ |

#### Detailed Results

##### deferred-import 🥉

**Test:** light_load 🥉

- Import Time: 0.94 ms
- Relative Time: 3.24x (vs baseline)
- Memory Peak: 360.98 MB
- Memory Avg: 360.86 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** medium_load

- Import Time: 6.25 ms
- Relative Time: 21.53x (vs baseline)
- Memory Peak: 362.16 MB
- Memory Avg: 361.57 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** heavy_load

- Import Time: 20.79 ms
- Relative Time: 71.61x (vs baseline)
- Memory Peak: 364.89 MB
- Memory Avg: 363.53 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** enterprise_load

- Import Time: 49.72 ms
- Relative Time: 171.29x (vs baseline)
- Memory Peak: 370.09 MB
- Memory Avg: 367.49 MB
- Package Size: 0.00 MB
- Features: deferred_loading

##### lazi 🥈

**Test:** light_load

- Import Time: 1.14 ms
- Relative Time: 3.92x (vs baseline)
- Memory Peak: 393.07 MB
- Memory Avg: 393.07 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** medium_load 🥈

- Import Time: 5.10 ms
- Relative Time: 17.56x (vs baseline)
- Memory Peak: 393.07 MB
- Memory Avg: 393.07 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** heavy_load

- Import Time: 18.74 ms
- Relative Time: 64.56x (vs baseline)
- Memory Peak: 393.07 MB
- Memory Avg: 393.07 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** enterprise_load

- Import Time: 70.46 ms
- Relative Time: 242.71x (vs baseline)
- Memory Peak: 393.11 MB
- Memory Avg: 393.09 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

##### lazy-imports 🥇

**Test:** light_load 🥇

- Import Time: 0.63 ms
- Relative Time: 2.18x (vs baseline)
- Memory Peak: 382.77 MB
- Memory Avg: 382.72 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load 🥇

- Import Time: 3.51 ms
- Relative Time: 12.09x (vs baseline)
- Memory Peak: 383.56 MB
- Memory Avg: 383.17 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load 🥇

- Import Time: 10.82 ms
- Relative Time: 37.26x (vs baseline)
- Memory Peak: 386.66 MB
- Memory Avg: 385.11 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load 🥇

- Import Time: 29.51 ms
- Relative Time: 101.64x (vs baseline)
- Memory Peak: 391.65 MB
- Memory Avg: 389.17 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### lazy-imports-lite

**Test:** light_load

- Import Time: 1.15 ms
- Relative Time: 3.98x (vs baseline)
- Memory Peak: 393.11 MB
- Memory Avg: 393.11 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** medium_load

- Import Time: 7.03 ms
- Relative Time: 24.22x (vs baseline)
- Memory Peak: 393.11 MB
- Memory Avg: 393.11 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** heavy_load

- Import Time: 19.29 ms
- Relative Time: 66.45x (vs baseline)
- Memory Peak: 393.13 MB
- Memory Avg: 393.12 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** enterprise_load

- Import Time: 53.26 ms
- Relative Time: 183.47x (vs baseline)
- Memory Peak: 393.53 MB
- Memory Avg: 393.33 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

##### lazy-loader

**Test:** light_load

- Import Time: 1.24 ms
- Relative Time: 4.27x (vs baseline)
- Memory Peak: 370.70 MB
- Memory Avg: 370.57 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** medium_load

- Import Time: 7.03 ms
- Relative Time: 24.21x (vs baseline)
- Memory Peak: 371.95 MB
- Memory Avg: 371.33 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** heavy_load

- Import Time: 23.39 ms
- Relative Time: 80.59x (vs baseline)
- Memory Peak: 373.85 MB
- Memory Avg: 372.91 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** enterprise_load

- Import Time: 53.63 ms
- Relative Time: 184.76x (vs baseline)
- Memory Peak: 382.29 MB
- Memory Avg: 378.07 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

##### lazy_import

**Test:** light_load

- Import Time: 1.74 ms
- Relative Time: 5.99x (vs baseline)
- Memory Peak: 392.13 MB
- Memory Avg: 392.04 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 7.39 ms
- Relative Time: 25.46x (vs baseline)
- Memory Peak: 392.87 MB
- Memory Avg: 392.52 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 18.52 ms
- Relative Time: 63.81x (vs baseline)
- Memory Peak: 392.90 MB
- Memory Avg: 392.90 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 52.90 ms
- Relative Time: 182.24x (vs baseline)
- Memory Peak: 392.95 MB
- Memory Avg: 392.92 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### pipimport 🥈

**Test:** light_load

- Import Time: 1.34 ms
- Relative Time: 4.63x (vs baseline)
- Memory Peak: 351.27 MB
- Memory Avg: 351.23 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** medium_load 🥉

- Import Time: 5.31 ms
- Relative Time: 18.28x (vs baseline)
- Memory Peak: 351.82 MB
- Memory Avg: 351.54 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** heavy_load 🥈

- Import Time: 17.28 ms
- Relative Time: 59.54x (vs baseline)
- Memory Peak: 353.71 MB
- Memory Avg: 352.78 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** enterprise_load 🥉

- Import Time: 45.61 ms
- Relative Time: 157.12x (vs baseline)
- Memory Peak: 360.45 MB
- Memory Avg: 357.13 MB
- Package Size: 0.00 MB
- Features: auto_install

##### pylazyimports 🥈

**Test:** light_load 🥈

- Import Time: 0.83 ms
- Relative Time: 2.86x (vs baseline)
- Memory Peak: 392.96 MB
- Memory Avg: 392.96 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 6.10 ms
- Relative Time: 21.00x (vs baseline)
- Memory Peak: 392.96 MB
- Memory Avg: 392.96 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 19.30 ms
- Relative Time: 66.48x (vs baseline)
- Memory Peak: 392.96 MB
- Memory Avg: 392.96 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 58.32 ms
- Relative Time: 200.90x (vs baseline)
- Memory Peak: 393.03 MB
- Memory Avg: 392.99 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### xwlazy 🥈

**Test:** light_load

- Import Time: 1.35 ms
- Relative Time: 4.64x (vs baseline)
- Memory Peak: 393.54 MB
- Memory Avg: 393.54 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** medium_load

- Import Time: 5.86 ms
- Relative Time: 20.17x (vs baseline)
- Memory Peak: 394.41 MB
- Memory Avg: 394.23 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** heavy_load 🥉

- Import Time: 17.87 ms
- Relative Time: 61.56x (vs baseline)
- Memory Peak: 395.09 MB
- Memory Avg: 395.08 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** enterprise_load 🥈

- Import Time: 43.36 ms
- Relative Time: 149.36x (vs baseline)
- Memory Peak: 402.52 MB
- Memory Avg: 398.89 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring


### Full Features

*All features enabled (xwlazy showcase) - AUTO mode with optimizations*

#### Top 3 Rankings by Load Test

##### Enterprise Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazy_import | 34.86 | 120.08x |
| 2 🥈 | pylazyimports | 36.61 | 126.12x |
| 3 🥉 | pipimport | 37.17 | 128.03x |

##### Heavy Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazy_import | 12.51 | 43.09x |
| 2 🥈 | pylazyimports | 13.03 | 44.89x |
| 3 🥉 | pipimport | 14.25 | 49.09x |

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | deferred-import | 0.58 | 2.01x |
| 2 🥈 | lazy-loader | 0.67 | 2.32x |
| 3 🥉 | lazy-imports | 0.68 | 2.36x |

##### Medium Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | pylazyimports | 3.77 | 13.00x |
| 2 🥈 | lazy_import | 3.82 | 13.16x |
| 3 🥉 | xwlazy | 4.20 | 14.47x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| deferred-import 🥇 | light_load | 0.58 | 2.01x | 452.79 | 0.00 | ✅ |
| deferred-import | medium_load | 4.74 | 16.33x | 452.79 | 0.00 | ✅ |
| deferred-import | heavy_load | 17.80 | 61.30x | 452.79 | 0.00 | ✅ |
| deferred-import | enterprise_load | 41.12 | 141.64x | 452.79 | 0.00 | ✅ |
| lazi | light_load | 0.92 | 3.17x | 459.59 | 0.00 | ✅ |
| lazi | medium_load | 7.41 | 25.51x | 460.77 | 0.00 | ✅ |
| lazi | heavy_load | 24.13 | 83.11x | 461.93 | 0.00 | ✅ |
| lazi | enterprise_load | 43.23 | 148.92x | 468.53 | 0.00 | ✅ |
| lazy-imports 🥉 | light_load | 0.68 | 2.36x | 452.79 | 0.00 | ✅ |
| lazy-imports | medium_load | 5.19 | 17.86x | 452.79 | 0.00 | ✅ |
| lazy-imports | heavy_load | 19.87 | 68.46x | 452.79 | 0.00 | ✅ |
| lazy-imports | enterprise_load | 40.31 | 138.85x | 452.79 | 0.00 | ✅ |
| lazy-imports-lite | light_load | 1.18 | 4.06x | 469.07 | 0.00 | ✅ |
| lazy-imports-lite | medium_load | 5.30 | 18.25x | 470.14 | 0.00 | ✅ |
| lazy-imports-lite | heavy_load | 16.73 | 57.62x | 472.39 | 0.00 | ✅ |
| lazy-imports-lite | enterprise_load | 41.94 | 144.48x | 476.57 | 0.00 | ✅ |
| lazy-loader 🥈 | light_load | 0.67 | 2.32x | 452.79 | 0.00 | ✅ |
| lazy-loader | medium_load | 4.56 | 15.71x | 452.79 | 0.00 | ✅ |
| lazy-loader | heavy_load | 16.04 | 55.25x | 452.79 | 0.00 | ✅ |
| lazy-loader | enterprise_load | 43.46 | 149.70x | 452.79 | 0.00 | ✅ |
| lazy_import | light_load | 0.99 | 3.40x | 452.79 | 0.00 | ✅ |
| lazy_import 🥈 | medium_load | 3.82 | 13.16x | 452.80 | 0.00 | ✅ |
| lazy_import 🥇 | heavy_load | 12.51 | 43.09x | 452.80 | 0.00 | ✅ |
| lazy_import 🥇 | enterprise_load | 34.86 | 120.08x | 453.47 | 0.00 | ✅ |
| pipimport | light_load | 0.96 | 3.29x | 452.79 | 0.00 | ✅ |
| pipimport | medium_load | 4.28 | 14.75x | 452.79 | 0.00 | ✅ |
| pipimport 🥉 | heavy_load | 14.25 | 49.09x | 452.79 | 0.00 | ✅ |
| pipimport 🥉 | enterprise_load | 37.17 | 128.03x | 452.79 | 0.00 | ✅ |
| pylazyimports | light_load | 0.75 | 2.57x | 453.47 | 0.00 | ✅ |
| pylazyimports 🥇 | medium_load | 3.77 | 13.00x | 453.73 | 0.00 | ✅ |
| pylazyimports 🥈 | heavy_load | 13.03 | 44.89x | 453.93 | 0.00 | ✅ |
| pylazyimports 🥈 | enterprise_load | 36.61 | 126.12x | 459.18 | 0.00 | ✅ |
| xwlazy | light_load | 0.94 | 3.24x | 476.57 | 0.00 | ✅ |
| xwlazy 🥉 | medium_load | 4.20 | 14.47x | 477.19 | 0.00 | ✅ |
| xwlazy | heavy_load | 15.13 | 52.12x | 477.34 | 0.00 | ✅ |
| xwlazy | enterprise_load | 39.19 | 135.00x | 477.56 | 0.00 | ✅ |

#### Detailed Results

##### deferred-import 🥇

**Test:** light_load 🥇

- Import Time: 0.58 ms
- Relative Time: 2.01x (vs baseline)
- Memory Peak: 452.79 MB
- Memory Avg: 452.79 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** medium_load

- Import Time: 4.74 ms
- Relative Time: 16.33x (vs baseline)
- Memory Peak: 452.79 MB
- Memory Avg: 452.79 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** heavy_load

- Import Time: 17.80 ms
- Relative Time: 61.30x (vs baseline)
- Memory Peak: 452.79 MB
- Memory Avg: 452.79 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** enterprise_load

- Import Time: 41.12 ms
- Relative Time: 141.64x (vs baseline)
- Memory Peak: 452.79 MB
- Memory Avg: 452.79 MB
- Package Size: 0.00 MB
- Features: deferred_loading

##### lazi

**Test:** light_load

- Import Time: 0.92 ms
- Relative Time: 3.17x (vs baseline)
- Memory Peak: 459.59 MB
- Memory Avg: 459.54 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** medium_load

- Import Time: 7.41 ms
- Relative Time: 25.51x (vs baseline)
- Memory Peak: 460.77 MB
- Memory Avg: 460.18 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** heavy_load

- Import Time: 24.13 ms
- Relative Time: 83.11x (vs baseline)
- Memory Peak: 461.93 MB
- Memory Avg: 461.37 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** enterprise_load

- Import Time: 43.23 ms
- Relative Time: 148.92x (vs baseline)
- Memory Peak: 468.53 MB
- Memory Avg: 465.23 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

##### lazy-imports 🥉

**Test:** light_load 🥉

- Import Time: 0.68 ms
- Relative Time: 2.36x (vs baseline)
- Memory Peak: 452.79 MB
- Memory Avg: 452.79 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 5.19 ms
- Relative Time: 17.86x (vs baseline)
- Memory Peak: 452.79 MB
- Memory Avg: 452.79 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 19.87 ms
- Relative Time: 68.46x (vs baseline)
- Memory Peak: 452.79 MB
- Memory Avg: 452.79 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 40.31 ms
- Relative Time: 138.85x (vs baseline)
- Memory Peak: 452.79 MB
- Memory Avg: 452.79 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### lazy-imports-lite

**Test:** light_load

- Import Time: 1.18 ms
- Relative Time: 4.06x (vs baseline)
- Memory Peak: 469.07 MB
- Memory Avg: 468.95 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** medium_load

- Import Time: 5.30 ms
- Relative Time: 18.25x (vs baseline)
- Memory Peak: 470.14 MB
- Memory Avg: 469.61 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** heavy_load

- Import Time: 16.73 ms
- Relative Time: 57.62x (vs baseline)
- Memory Peak: 472.39 MB
- Memory Avg: 471.27 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** enterprise_load

- Import Time: 41.94 ms
- Relative Time: 144.48x (vs baseline)
- Memory Peak: 476.57 MB
- Memory Avg: 474.48 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

##### lazy-loader 🥈

**Test:** light_load 🥈

- Import Time: 0.67 ms
- Relative Time: 2.32x (vs baseline)
- Memory Peak: 452.79 MB
- Memory Avg: 452.79 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** medium_load

- Import Time: 4.56 ms
- Relative Time: 15.71x (vs baseline)
- Memory Peak: 452.79 MB
- Memory Avg: 452.79 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** heavy_load

- Import Time: 16.04 ms
- Relative Time: 55.25x (vs baseline)
- Memory Peak: 452.79 MB
- Memory Avg: 452.79 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** enterprise_load

- Import Time: 43.46 ms
- Relative Time: 149.70x (vs baseline)
- Memory Peak: 452.79 MB
- Memory Avg: 452.79 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

##### lazy_import 🥇

**Test:** light_load

- Import Time: 0.99 ms
- Relative Time: 3.40x (vs baseline)
- Memory Peak: 452.79 MB
- Memory Avg: 452.79 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load 🥈

- Import Time: 3.82 ms
- Relative Time: 13.16x (vs baseline)
- Memory Peak: 452.80 MB
- Memory Avg: 452.79 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load 🥇

- Import Time: 12.51 ms
- Relative Time: 43.09x (vs baseline)
- Memory Peak: 452.80 MB
- Memory Avg: 452.80 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load 🥇

- Import Time: 34.86 ms
- Relative Time: 120.08x (vs baseline)
- Memory Peak: 453.47 MB
- Memory Avg: 453.13 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### pipimport 🥉

**Test:** light_load

- Import Time: 0.96 ms
- Relative Time: 3.29x (vs baseline)
- Memory Peak: 452.79 MB
- Memory Avg: 452.78 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** medium_load

- Import Time: 4.28 ms
- Relative Time: 14.75x (vs baseline)
- Memory Peak: 452.79 MB
- Memory Avg: 452.79 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** heavy_load 🥉

- Import Time: 14.25 ms
- Relative Time: 49.09x (vs baseline)
- Memory Peak: 452.79 MB
- Memory Avg: 452.78 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** enterprise_load 🥉

- Import Time: 37.17 ms
- Relative Time: 128.03x (vs baseline)
- Memory Peak: 452.79 MB
- Memory Avg: 452.79 MB
- Package Size: 0.00 MB
- Features: auto_install

##### pylazyimports 🥇

**Test:** light_load

- Import Time: 0.75 ms
- Relative Time: 2.57x (vs baseline)
- Memory Peak: 453.47 MB
- Memory Avg: 453.47 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load 🥇

- Import Time: 3.77 ms
- Relative Time: 13.00x (vs baseline)
- Memory Peak: 453.73 MB
- Memory Avg: 453.60 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load 🥈

- Import Time: 13.03 ms
- Relative Time: 44.89x (vs baseline)
- Memory Peak: 453.93 MB
- Memory Avg: 453.83 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load 🥈

- Import Time: 36.61 ms
- Relative Time: 126.12x (vs baseline)
- Memory Peak: 459.18 MB
- Memory Avg: 456.55 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### xwlazy 🥉

**Test:** light_load

- Import Time: 0.94 ms
- Relative Time: 3.24x (vs baseline)
- Memory Peak: 476.57 MB
- Memory Avg: 476.57 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** medium_load 🥉

- Import Time: 4.20 ms
- Relative Time: 14.47x (vs baseline)
- Memory Peak: 477.19 MB
- Memory Avg: 477.12 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** heavy_load

- Import Time: 15.13 ms
- Relative Time: 52.12x (vs baseline)
- Memory Peak: 477.34 MB
- Memory Avg: 477.33 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** enterprise_load

- Import Time: 39.19 ms
- Relative Time: 135.00x (vs baseline)
- Memory Peak: 477.56 MB
- Memory Avg: 477.46 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring


### Full Install Mode

*Install all dependencies on start - FULL mode*

#### Top 3 Rankings by Load Test

##### Enterprise Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazy_import | 34.44 | 118.62x |
| 2 🥈 | lazy-loader | 35.38 | 121.89x |
| 3 🥉 | lazy-imports | 35.61 | 122.67x |

##### Heavy Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazy_import | 12.47 | 42.94x |
| 2 🥈 | pylazyimports | 12.71 | 43.79x |
| 3 🥉 | lazy-imports | 13.18 | 45.39x |

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazy-imports | 0.60 | 2.06x |
| 2 🥈 | pylazyimports | 0.65 | 2.25x |
| 3 🥉 | lazy-loader | 0.73 | 2.51x |

##### Medium Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | pylazyimports | 3.73 | 12.85x |
| 2 🥈 | lazy-loader | 3.74 | 12.90x |
| 3 🥉 | lazy-imports | 3.81 | 13.12x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| deferred-import | light_load | 1.26 | 4.35x | 310.00 | 0.00 | ✅ |
| deferred-import | medium_load | 4.21 | 14.49x | 311.06 | 0.00 | ✅ |
| deferred-import | heavy_load | 13.23 | 45.58x | 313.27 | 0.00 | ✅ |
| deferred-import | enterprise_load | 36.60 | 126.07x | 313.30 | 0.00 | ✅ |
| lazi | light_load | 0.97 | 3.35x | 332.37 | 0.00 | ✅ |
| lazi | medium_load | 5.34 | 18.41x | 333.68 | 0.00 | ✅ |
| lazi | heavy_load | 15.63 | 53.85x | 335.76 | 0.00 | ✅ |
| lazi | enterprise_load | 53.66 | 184.85x | 341.21 | 0.00 | ✅ |
| lazy-imports 🥇 | light_load | 0.60 | 2.06x | 313.36 | 0.00 | ✅ |
| lazy-imports 🥉 | medium_load | 3.81 | 13.12x | 313.37 | 0.00 | ✅ |
| lazy-imports 🥉 | heavy_load | 13.18 | 45.39x | 313.64 | 0.00 | ✅ |
| lazy-imports 🥉 | enterprise_load | 35.61 | 122.67x | 315.33 | 0.00 | ✅ |
| lazy-imports-lite | light_load | 0.88 | 3.04x | 341.77 | 0.00 | ✅ |
| lazy-imports-lite | medium_load | 5.71 | 19.67x | 342.42 | 0.00 | ✅ |
| lazy-imports-lite | heavy_load | 17.00 | 58.56x | 342.42 | 0.00 | ✅ |
| lazy-imports-lite | enterprise_load | 43.11 | 148.50x | 342.73 | 0.00 | ✅ |
| lazy-loader 🥉 | light_load | 0.73 | 2.51x | 313.34 | 0.00 | ✅ |
| lazy-loader 🥈 | medium_load | 3.74 | 12.90x | 313.34 | 0.00 | ✅ |
| lazy-loader | heavy_load | 13.29 | 45.79x | 313.34 | 0.00 | ✅ |
| lazy-loader 🥈 | enterprise_load | 35.38 | 121.89x | 313.35 | 0.00 | ✅ |
| lazy_import | light_load | 0.89 | 3.06x | 315.38 | 0.00 | ✅ |
| lazy_import | medium_load | 3.84 | 13.23x | 315.63 | 0.00 | ✅ |
| lazy_import 🥇 | heavy_load | 12.47 | 42.94x | 316.54 | 0.00 | ✅ |
| lazy_import 🥇 | enterprise_load | 34.44 | 118.62x | 321.63 | 0.00 | ✅ |
| pipimport | light_load | 0.91 | 3.13x | 299.70 | 0.00 | ✅ |
| pipimport | medium_load | 4.39 | 15.12x | 300.28 | 0.00 | ✅ |
| pipimport | heavy_load | 14.06 | 48.42x | 301.75 | 0.00 | ✅ |
| pipimport | enterprise_load | 35.66 | 122.83x | 309.28 | 0.00 | ✅ |
| pylazyimports 🥈 | light_load | 0.65 | 2.25x | 322.00 | 0.00 | ✅ |
| pylazyimports 🥇 | medium_load | 3.73 | 12.85x | 323.06 | 0.00 | ✅ |
| pylazyimports 🥈 | heavy_load | 12.71 | 43.79x | 324.76 | 0.00 | ✅ |
| pylazyimports | enterprise_load | 38.60 | 132.96x | 331.83 | 0.00 | ✅ |
| xwlazy | light_load | 1.14 | 3.91x | 342.73 | 0.00 | ✅ |
| xwlazy | medium_load | 6.43 | 22.14x | 343.49 | 0.00 | ✅ |
| xwlazy | heavy_load | 16.76 | 57.72x | 344.52 | 0.00 | ✅ |
| xwlazy | enterprise_load | 43.68 | 150.47x | 349.17 | 0.00 | ✅ |

#### Detailed Results

##### deferred-import

**Test:** light_load

- Import Time: 1.26 ms
- Relative Time: 4.35x (vs baseline)
- Memory Peak: 310.00 MB
- Memory Avg: 309.88 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** medium_load

- Import Time: 4.21 ms
- Relative Time: 14.49x (vs baseline)
- Memory Peak: 311.06 MB
- Memory Avg: 310.53 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** heavy_load

- Import Time: 13.23 ms
- Relative Time: 45.58x (vs baseline)
- Memory Peak: 313.27 MB
- Memory Avg: 312.16 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** enterprise_load

- Import Time: 36.60 ms
- Relative Time: 126.07x (vs baseline)
- Memory Peak: 313.30 MB
- Memory Avg: 313.28 MB
- Package Size: 0.00 MB
- Features: deferred_loading

##### lazi

**Test:** light_load

- Import Time: 0.97 ms
- Relative Time: 3.35x (vs baseline)
- Memory Peak: 332.37 MB
- Memory Avg: 332.24 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** medium_load

- Import Time: 5.34 ms
- Relative Time: 18.41x (vs baseline)
- Memory Peak: 333.68 MB
- Memory Avg: 333.03 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** heavy_load

- Import Time: 15.63 ms
- Relative Time: 53.85x (vs baseline)
- Memory Peak: 335.76 MB
- Memory Avg: 334.72 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** enterprise_load

- Import Time: 53.66 ms
- Relative Time: 184.85x (vs baseline)
- Memory Peak: 341.21 MB
- Memory Avg: 338.49 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

##### lazy-imports 🥇

**Test:** light_load 🥇

- Import Time: 0.60 ms
- Relative Time: 2.06x (vs baseline)
- Memory Peak: 313.36 MB
- Memory Avg: 313.36 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load 🥉

- Import Time: 3.81 ms
- Relative Time: 13.12x (vs baseline)
- Memory Peak: 313.37 MB
- Memory Avg: 313.37 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load 🥉

- Import Time: 13.18 ms
- Relative Time: 45.39x (vs baseline)
- Memory Peak: 313.64 MB
- Memory Avg: 313.51 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load 🥉

- Import Time: 35.61 ms
- Relative Time: 122.67x (vs baseline)
- Memory Peak: 315.33 MB
- Memory Avg: 314.49 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### lazy-imports-lite

**Test:** light_load

- Import Time: 0.88 ms
- Relative Time: 3.04x (vs baseline)
- Memory Peak: 341.77 MB
- Memory Avg: 341.65 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** medium_load

- Import Time: 5.71 ms
- Relative Time: 19.67x (vs baseline)
- Memory Peak: 342.42 MB
- Memory Avg: 342.10 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** heavy_load

- Import Time: 17.00 ms
- Relative Time: 58.56x (vs baseline)
- Memory Peak: 342.42 MB
- Memory Avg: 342.42 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** enterprise_load

- Import Time: 43.11 ms
- Relative Time: 148.50x (vs baseline)
- Memory Peak: 342.73 MB
- Memory Avg: 342.57 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

##### lazy-loader 🥈

**Test:** light_load 🥉

- Import Time: 0.73 ms
- Relative Time: 2.51x (vs baseline)
- Memory Peak: 313.34 MB
- Memory Avg: 313.34 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** medium_load 🥈

- Import Time: 3.74 ms
- Relative Time: 12.90x (vs baseline)
- Memory Peak: 313.34 MB
- Memory Avg: 313.34 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** heavy_load

- Import Time: 13.29 ms
- Relative Time: 45.79x (vs baseline)
- Memory Peak: 313.34 MB
- Memory Avg: 313.34 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** enterprise_load 🥈

- Import Time: 35.38 ms
- Relative Time: 121.89x (vs baseline)
- Memory Peak: 313.35 MB
- Memory Avg: 313.35 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

##### lazy_import 🥇

**Test:** light_load

- Import Time: 0.89 ms
- Relative Time: 3.06x (vs baseline)
- Memory Peak: 315.38 MB
- Memory Avg: 315.38 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 3.84 ms
- Relative Time: 13.23x (vs baseline)
- Memory Peak: 315.63 MB
- Memory Avg: 315.51 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load 🥇

- Import Time: 12.47 ms
- Relative Time: 42.94x (vs baseline)
- Memory Peak: 316.54 MB
- Memory Avg: 316.09 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load 🥇

- Import Time: 34.44 ms
- Relative Time: 118.62x (vs baseline)
- Memory Peak: 321.63 MB
- Memory Avg: 319.09 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### pipimport

**Test:** light_load

- Import Time: 0.91 ms
- Relative Time: 3.13x (vs baseline)
- Memory Peak: 299.70 MB
- Memory Avg: 299.61 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** medium_load

- Import Time: 4.39 ms
- Relative Time: 15.12x (vs baseline)
- Memory Peak: 300.28 MB
- Memory Avg: 299.99 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** heavy_load

- Import Time: 14.06 ms
- Relative Time: 48.42x (vs baseline)
- Memory Peak: 301.75 MB
- Memory Avg: 301.04 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** enterprise_load

- Import Time: 35.66 ms
- Relative Time: 122.83x (vs baseline)
- Memory Peak: 309.28 MB
- Memory Avg: 305.52 MB
- Package Size: 0.00 MB
- Features: auto_install

##### pylazyimports 🥇

**Test:** light_load 🥈

- Import Time: 0.65 ms
- Relative Time: 2.25x (vs baseline)
- Memory Peak: 322.00 MB
- Memory Avg: 321.95 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load 🥇

- Import Time: 3.73 ms
- Relative Time: 12.85x (vs baseline)
- Memory Peak: 323.06 MB
- Memory Avg: 322.55 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load 🥈

- Import Time: 12.71 ms
- Relative Time: 43.79x (vs baseline)
- Memory Peak: 324.76 MB
- Memory Avg: 323.92 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 38.60 ms
- Relative Time: 132.96x (vs baseline)
- Memory Peak: 331.83 MB
- Memory Avg: 328.29 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### xwlazy

**Test:** light_load

- Import Time: 1.14 ms
- Relative Time: 3.91x (vs baseline)
- Memory Peak: 342.73 MB
- Memory Avg: 342.73 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** medium_load

- Import Time: 6.43 ms
- Relative Time: 22.14x (vs baseline)
- Memory Peak: 343.49 MB
- Memory Avg: 343.39 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** heavy_load

- Import Time: 16.76 ms
- Relative Time: 57.72x (vs baseline)
- Memory Peak: 344.52 MB
- Memory Avg: 344.05 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** enterprise_load

- Import Time: 43.68 ms
- Relative Time: 150.47x (vs baseline)
- Memory Peak: 349.17 MB
- Memory Avg: 347.03 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring


### Intelligent Mode

*INTELLIGENT mode - Automatically selects optimal mode based on load level (benchmark-optimized)*

#### Top 3 Rankings by Load Test

##### Enterprise Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | deferred-import | 26.44 | 91.08x |
| 2 🥈 | lazy-imports-lite | 34.97 | 120.47x |
| 3 🥉 | pipimport | 35.40 | 121.93x |

##### Heavy Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | deferred-import | 8.64 | 29.76x |
| 2 🥈 | lazy-imports-lite | 12.28 | 42.31x |
| 3 🥉 | lazy_import | 12.62 | 43.49x |

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | deferred-import | 0.47 | 1.63x |
| 2 🥈 | lazy-loader | 0.68 | 2.34x |
| 3 🥉 | lazy-imports-lite | 0.68 | 2.35x |

##### Medium Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | deferred-import | 3.14 | 10.82x |
| 2 🥈 | lazy_import | 3.56 | 12.27x |
| 3 🥉 | pipimport | 3.89 | 13.40x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| deferred-import 🥇 | light_load | 0.47 | 1.63x | 477.74 | 0.00 | ✅ |
| deferred-import 🥇 | medium_load | 3.14 | 10.82x | 477.74 | 0.00 | ✅ |
| deferred-import 🥇 | heavy_load | 8.64 | 29.76x | 477.74 | 0.00 | ✅ |
| deferred-import 🥇 | enterprise_load | 26.44 | 91.08x | 477.79 | 0.00 | ✅ |
| lazi | light_load | 0.94 | 3.24x | 505.08 | 0.00 | ✅ |
| lazi | medium_load | 4.90 | 16.89x | 506.32 | 0.00 | ✅ |
| lazi | heavy_load | 13.40 | 46.17x | 509.09 | 0.00 | ✅ |
| lazi | enterprise_load | 38.58 | 132.88x | 515.09 | 0.00 | ✅ |
| lazy-imports | light_load | 0.71 | 2.44x | 479.17 | 0.00 | ✅ |
| lazy-imports | medium_load | 4.62 | 15.93x | 479.39 | 0.00 | ✅ |
| lazy-imports | heavy_load | 16.28 | 56.09x | 480.43 | 0.00 | ✅ |
| lazy-imports | enterprise_load | 53.89 | 185.62x | 483.84 | 0.00 | ✅ |
| lazy-imports-lite 🥉 | light_load | 0.68 | 2.35x | 515.49 | 0.00 | ✅ |
| lazy-imports-lite | medium_load | 5.62 | 19.36x | 515.91 | 0.00 | ✅ |
| lazy-imports-lite 🥈 | heavy_load | 12.28 | 42.31x | 515.92 | 0.00 | ✅ |
| lazy-imports-lite 🥈 | enterprise_load | 34.97 | 120.47x | 515.93 | 0.00 | ✅ |
| lazy-loader 🥈 | light_load | 0.68 | 2.34x | 477.79 | 0.00 | ✅ |
| lazy-loader | medium_load | 4.12 | 14.19x | 477.80 | 0.00 | ✅ |
| lazy-loader | heavy_load | 13.35 | 46.00x | 477.80 | 0.00 | ✅ |
| lazy-loader | enterprise_load | 39.20 | 135.03x | 478.78 | 0.00 | ✅ |
| lazy_import | light_load | 0.98 | 3.37x | 484.28 | 0.00 | ✅ |
| lazy_import 🥈 | medium_load | 3.56 | 12.27x | 485.07 | 0.00 | ✅ |
| lazy_import 🥉 | heavy_load | 12.62 | 43.49x | 487.08 | 0.00 | ✅ |
| lazy_import | enterprise_load | 37.00 | 127.45x | 493.28 | 0.00 | ✅ |
| pipimport | light_load | 0.96 | 3.29x | 477.70 | 0.00 | ✅ |
| pipimport 🥉 | medium_load | 3.89 | 13.40x | 477.70 | 0.00 | ✅ |
| pipimport | heavy_load | 13.13 | 45.24x | 477.70 | 0.00 | ✅ |
| pipimport 🥉 | enterprise_load | 35.40 | 121.93x | 477.74 | 0.00 | ✅ |
| pylazyimports | light_load | 0.86 | 2.95x | 493.70 | 0.00 | ✅ |
| pylazyimports | medium_load | 4.95 | 17.07x | 494.32 | 0.00 | ✅ |
| pylazyimports | heavy_load | 13.46 | 46.36x | 495.95 | 0.00 | ✅ |
| pylazyimports | enterprise_load | 36.06 | 124.22x | 504.53 | 0.00 | ✅ |
| xwlazy | light_load | 1.22 | 4.19x | 515.94 | 0.00 | ✅ |
| xwlazy | medium_load | 6.03 | 20.76x | 516.33 | 0.00 | ✅ |
| xwlazy | heavy_load | 13.18 | 45.39x | 516.50 | 0.00 | ✅ |
| xwlazy | enterprise_load | 38.19 | 131.55x | 516.57 | 0.00 | ✅ |

#### Detailed Results

##### deferred-import 🥇

**Test:** light_load 🥇

- Import Time: 0.47 ms
- Relative Time: 1.63x (vs baseline)
- Memory Peak: 477.74 MB
- Memory Avg: 477.74 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** medium_load 🥇

- Import Time: 3.14 ms
- Relative Time: 10.82x (vs baseline)
- Memory Peak: 477.74 MB
- Memory Avg: 477.74 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** heavy_load 🥇

- Import Time: 8.64 ms
- Relative Time: 29.76x (vs baseline)
- Memory Peak: 477.74 MB
- Memory Avg: 477.74 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** enterprise_load 🥇

- Import Time: 26.44 ms
- Relative Time: 91.08x (vs baseline)
- Memory Peak: 477.79 MB
- Memory Avg: 477.77 MB
- Package Size: 0.00 MB
- Features: deferred_loading

##### lazi

**Test:** light_load

- Import Time: 0.94 ms
- Relative Time: 3.24x (vs baseline)
- Memory Peak: 505.08 MB
- Memory Avg: 504.96 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** medium_load

- Import Time: 4.90 ms
- Relative Time: 16.89x (vs baseline)
- Memory Peak: 506.32 MB
- Memory Avg: 505.71 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** heavy_load

- Import Time: 13.40 ms
- Relative Time: 46.17x (vs baseline)
- Memory Peak: 509.09 MB
- Memory Avg: 507.71 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** enterprise_load

- Import Time: 38.58 ms
- Relative Time: 132.88x (vs baseline)
- Memory Peak: 515.09 MB
- Memory Avg: 512.09 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

##### lazy-imports

**Test:** light_load

- Import Time: 0.71 ms
- Relative Time: 2.44x (vs baseline)
- Memory Peak: 479.17 MB
- Memory Avg: 479.12 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 4.62 ms
- Relative Time: 15.93x (vs baseline)
- Memory Peak: 479.39 MB
- Memory Avg: 479.28 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 16.28 ms
- Relative Time: 56.09x (vs baseline)
- Memory Peak: 480.43 MB
- Memory Avg: 479.92 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 53.89 ms
- Relative Time: 185.62x (vs baseline)
- Memory Peak: 483.84 MB
- Memory Avg: 482.13 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### lazy-imports-lite 🥈

**Test:** light_load 🥉

- Import Time: 0.68 ms
- Relative Time: 2.35x (vs baseline)
- Memory Peak: 515.49 MB
- Memory Avg: 515.44 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** medium_load

- Import Time: 5.62 ms
- Relative Time: 19.36x (vs baseline)
- Memory Peak: 515.91 MB
- Memory Avg: 515.71 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** heavy_load 🥈

- Import Time: 12.28 ms
- Relative Time: 42.31x (vs baseline)
- Memory Peak: 515.92 MB
- Memory Avg: 515.92 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** enterprise_load 🥈

- Import Time: 34.97 ms
- Relative Time: 120.47x (vs baseline)
- Memory Peak: 515.93 MB
- Memory Avg: 515.93 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

##### lazy-loader 🥈

**Test:** light_load 🥈

- Import Time: 0.68 ms
- Relative Time: 2.34x (vs baseline)
- Memory Peak: 477.79 MB
- Memory Avg: 477.79 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** medium_load

- Import Time: 4.12 ms
- Relative Time: 14.19x (vs baseline)
- Memory Peak: 477.80 MB
- Memory Avg: 477.80 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** heavy_load

- Import Time: 13.35 ms
- Relative Time: 46.00x (vs baseline)
- Memory Peak: 477.80 MB
- Memory Avg: 477.80 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** enterprise_load

- Import Time: 39.20 ms
- Relative Time: 135.03x (vs baseline)
- Memory Peak: 478.78 MB
- Memory Avg: 478.29 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

##### lazy_import 🥈

**Test:** light_load

- Import Time: 0.98 ms
- Relative Time: 3.37x (vs baseline)
- Memory Peak: 484.28 MB
- Memory Avg: 484.21 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load 🥈

- Import Time: 3.56 ms
- Relative Time: 12.27x (vs baseline)
- Memory Peak: 485.07 MB
- Memory Avg: 484.68 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load 🥉

- Import Time: 12.62 ms
- Relative Time: 43.49x (vs baseline)
- Memory Peak: 487.08 MB
- Memory Avg: 486.08 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 37.00 ms
- Relative Time: 127.45x (vs baseline)
- Memory Peak: 493.28 MB
- Memory Avg: 490.19 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### pipimport 🥉

**Test:** light_load

- Import Time: 0.96 ms
- Relative Time: 3.29x (vs baseline)
- Memory Peak: 477.70 MB
- Memory Avg: 477.70 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** medium_load 🥉

- Import Time: 3.89 ms
- Relative Time: 13.40x (vs baseline)
- Memory Peak: 477.70 MB
- Memory Avg: 477.70 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** heavy_load

- Import Time: 13.13 ms
- Relative Time: 45.24x (vs baseline)
- Memory Peak: 477.70 MB
- Memory Avg: 477.70 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** enterprise_load 🥉

- Import Time: 35.40 ms
- Relative Time: 121.93x (vs baseline)
- Memory Peak: 477.74 MB
- Memory Avg: 477.72 MB
- Package Size: 0.00 MB
- Features: auto_install

##### pylazyimports

**Test:** light_load

- Import Time: 0.86 ms
- Relative Time: 2.95x (vs baseline)
- Memory Peak: 493.70 MB
- Memory Avg: 493.65 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 4.95 ms
- Relative Time: 17.07x (vs baseline)
- Memory Peak: 494.32 MB
- Memory Avg: 494.01 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 13.46 ms
- Relative Time: 46.36x (vs baseline)
- Memory Peak: 495.95 MB
- Memory Avg: 495.14 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 36.06 ms
- Relative Time: 124.22x (vs baseline)
- Memory Peak: 504.53 MB
- Memory Avg: 500.24 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### xwlazy

**Test:** light_load

- Import Time: 1.22 ms
- Relative Time: 4.19x (vs baseline)
- Memory Peak: 515.94 MB
- Memory Avg: 515.94 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** medium_load

- Import Time: 6.03 ms
- Relative Time: 20.76x (vs baseline)
- Memory Peak: 516.33 MB
- Memory Avg: 516.31 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** heavy_load

- Import Time: 13.18 ms
- Relative Time: 45.39x (vs baseline)
- Memory Peak: 516.50 MB
- Memory Avg: 516.42 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** enterprise_load

- Import Time: 38.19 ms
- Relative Time: 131.55x (vs baseline)
- Memory Peak: 516.57 MB
- Memory Avg: 516.54 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring


### Background Loading

*Background loading - BACKGROUND mode*

#### Top 3 Rankings by Load Test

##### Enterprise Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | deferred-import | 26.72 | 92.06x |
| 2 🥈 | lazy-imports | 33.13 | 114.13x |
| 3 🥉 | lazy_import | 38.14 | 131.37x |

##### Heavy Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | deferred-import | 8.26 | 28.47x |
| 2 🥈 | lazy-imports | 12.55 | 43.24x |
| 3 🥉 | pipimport | 14.04 | 48.36x |

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | deferred-import | 0.39 | 1.34x |
| 2 🥈 | lazy-imports | 0.70 | 2.40x |
| 3 🥉 | lazy-loader | 0.71 | 2.46x |

##### Medium Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | deferred-import | 2.83 | 9.73x |
| 2 🥈 | lazy-loader | 3.68 | 12.67x |
| 3 🥉 | lazy-imports | 3.79 | 13.07x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| deferred-import 🥇 | light_load | 0.39 | 1.34x | 246.81 | 0.00 | ✅ |
| deferred-import 🥇 | medium_load | 2.83 | 9.73x | 248.18 | 0.00 | ✅ |
| deferred-import 🥇 | heavy_load | 8.26 | 28.47x | 250.02 | 0.00 | ✅ |
| deferred-import 🥇 | enterprise_load | 26.72 | 92.06x | 250.15 | 0.00 | ✅ |
| lazi | light_load | 1.00 | 3.43x | 270.98 | 0.00 | ✅ |
| lazi | medium_load | 4.24 | 14.61x | 271.01 | 0.00 | ✅ |
| lazi | heavy_load | 14.07 | 48.48x | 271.07 | 0.00 | ✅ |
| lazi | enterprise_load | 40.17 | 138.36x | 271.52 | 0.00 | ✅ |
| lazy-imports 🥈 | light_load | 0.70 | 2.40x | 250.54 | 0.00 | ✅ |
| lazy-imports 🥉 | medium_load | 3.79 | 13.07x | 250.56 | 0.00 | ✅ |
| lazy-imports 🥈 | heavy_load | 12.55 | 43.24x | 251.16 | 0.00 | ✅ |
| lazy-imports 🥈 | enterprise_load | 33.13 | 114.13x | 253.59 | 0.00 | ✅ |
| lazy-imports-lite | light_load | 1.02 | 3.52x | 271.75 | 0.00 | ✅ |
| lazy-imports-lite | medium_load | 5.22 | 17.99x | 271.77 | 0.00 | ✅ |
| lazy-imports-lite | heavy_load | 17.76 | 61.18x | 272.42 | 0.00 | ✅ |
| lazy-imports-lite | enterprise_load | 43.82 | 150.94x | 279.72 | 0.00 | ✅ |
| lazy-loader 🥉 | light_load | 0.71 | 2.46x | 250.17 | 0.00 | ✅ |
| lazy-loader 🥈 | medium_load | 3.68 | 12.67x | 250.22 | 0.00 | ✅ |
| lazy-loader | heavy_load | 22.83 | 78.63x | 250.22 | 0.00 | ✅ |
| lazy-loader | enterprise_load | 38.29 | 131.88x | 250.32 | 0.00 | ✅ |
| lazy_import | light_load | 0.97 | 3.33x | 253.98 | 0.00 | ✅ |
| lazy_import | medium_load | 4.32 | 14.89x | 255.21 | 0.00 | ✅ |
| lazy_import | heavy_load | 14.53 | 50.06x | 257.17 | 0.00 | ✅ |
| lazy_import 🥉 | enterprise_load | 38.14 | 131.37x | 263.48 | 0.00 | ✅ |
| pipimport | light_load | 0.88 | 3.05x | 235.85 | 0.00 | ✅ |
| pipimport | medium_load | 4.26 | 14.68x | 236.43 | 0.00 | ✅ |
| pipimport 🥉 | heavy_load | 14.04 | 48.36x | 238.40 | 0.00 | ✅ |
| pipimport | enterprise_load | 40.23 | 138.59x | 246.18 | 0.00 | ✅ |
| pylazyimports | light_load | 0.86 | 2.97x | 263.99 | 0.00 | ✅ |
| pylazyimports | medium_load | 4.64 | 15.97x | 264.97 | 0.00 | ✅ |
| pylazyimports | heavy_load | 16.08 | 55.40x | 266.28 | 0.00 | ✅ |
| pylazyimports | enterprise_load | 42.53 | 146.50x | 270.98 | 0.00 | ✅ |
| xwlazy | light_load | 1.13 | 3.90x | 280.38 | 0.00 | ✅ |
| xwlazy | medium_load | 4.65 | 16.03x | 284.18 | 0.00 | ✅ |
| xwlazy | heavy_load | 18.24 | 62.84x | 287.47 | 0.00 | ✅ |
| xwlazy | enterprise_load | 40.59 | 139.83x | 297.52 | 0.00 | ✅ |

#### Detailed Results

##### deferred-import 🥇

**Test:** light_load 🥇

- Import Time: 0.39 ms
- Relative Time: 1.34x (vs baseline)
- Memory Peak: 246.81 MB
- Memory Avg: 246.78 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** medium_load 🥇

- Import Time: 2.83 ms
- Relative Time: 9.73x (vs baseline)
- Memory Peak: 248.18 MB
- Memory Avg: 247.49 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** heavy_load 🥇

- Import Time: 8.26 ms
- Relative Time: 28.47x (vs baseline)
- Memory Peak: 250.02 MB
- Memory Avg: 249.10 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** enterprise_load 🥇

- Import Time: 26.72 ms
- Relative Time: 92.06x (vs baseline)
- Memory Peak: 250.15 MB
- Memory Avg: 250.09 MB
- Package Size: 0.00 MB
- Features: deferred_loading

##### lazi

**Test:** light_load

- Import Time: 1.00 ms
- Relative Time: 3.43x (vs baseline)
- Memory Peak: 270.98 MB
- Memory Avg: 270.98 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** medium_load

- Import Time: 4.24 ms
- Relative Time: 14.61x (vs baseline)
- Memory Peak: 271.01 MB
- Memory Avg: 271.00 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** heavy_load

- Import Time: 14.07 ms
- Relative Time: 48.48x (vs baseline)
- Memory Peak: 271.07 MB
- Memory Avg: 271.04 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** enterprise_load

- Import Time: 40.17 ms
- Relative Time: 138.36x (vs baseline)
- Memory Peak: 271.52 MB
- Memory Avg: 271.30 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

##### lazy-imports 🥈

**Test:** light_load 🥈

- Import Time: 0.70 ms
- Relative Time: 2.40x (vs baseline)
- Memory Peak: 250.54 MB
- Memory Avg: 250.48 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load 🥉

- Import Time: 3.79 ms
- Relative Time: 13.07x (vs baseline)
- Memory Peak: 250.56 MB
- Memory Avg: 250.55 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load 🥈

- Import Time: 12.55 ms
- Relative Time: 43.24x (vs baseline)
- Memory Peak: 251.16 MB
- Memory Avg: 250.86 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load 🥈

- Import Time: 33.13 ms
- Relative Time: 114.13x (vs baseline)
- Memory Peak: 253.59 MB
- Memory Avg: 252.42 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### lazy-imports-lite

**Test:** light_load

- Import Time: 1.02 ms
- Relative Time: 3.52x (vs baseline)
- Memory Peak: 271.75 MB
- Memory Avg: 271.69 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** medium_load

- Import Time: 5.22 ms
- Relative Time: 17.99x (vs baseline)
- Memory Peak: 271.77 MB
- Memory Avg: 271.76 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** heavy_load

- Import Time: 17.76 ms
- Relative Time: 61.18x (vs baseline)
- Memory Peak: 272.42 MB
- Memory Avg: 272.10 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** enterprise_load

- Import Time: 43.82 ms
- Relative Time: 150.94x (vs baseline)
- Memory Peak: 279.72 MB
- Memory Avg: 276.07 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

##### lazy-loader 🥈

**Test:** light_load 🥉

- Import Time: 0.71 ms
- Relative Time: 2.46x (vs baseline)
- Memory Peak: 250.17 MB
- Memory Avg: 250.14 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** medium_load 🥈

- Import Time: 3.68 ms
- Relative Time: 12.67x (vs baseline)
- Memory Peak: 250.22 MB
- Memory Avg: 250.20 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** heavy_load

- Import Time: 22.83 ms
- Relative Time: 78.63x (vs baseline)
- Memory Peak: 250.22 MB
- Memory Avg: 250.22 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** enterprise_load

- Import Time: 38.29 ms
- Relative Time: 131.88x (vs baseline)
- Memory Peak: 250.32 MB
- Memory Avg: 250.27 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

##### lazy_import 🥉

**Test:** light_load

- Import Time: 0.97 ms
- Relative Time: 3.33x (vs baseline)
- Memory Peak: 253.98 MB
- Memory Avg: 253.91 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 4.32 ms
- Relative Time: 14.89x (vs baseline)
- Memory Peak: 255.21 MB
- Memory Avg: 254.60 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 14.53 ms
- Relative Time: 50.06x (vs baseline)
- Memory Peak: 257.17 MB
- Memory Avg: 256.20 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load 🥉

- Import Time: 38.14 ms
- Relative Time: 131.37x (vs baseline)
- Memory Peak: 263.48 MB
- Memory Avg: 260.32 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### pipimport 🥉

**Test:** light_load

- Import Time: 0.88 ms
- Relative Time: 3.05x (vs baseline)
- Memory Peak: 235.85 MB
- Memory Avg: 235.77 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** medium_load

- Import Time: 4.26 ms
- Relative Time: 14.68x (vs baseline)
- Memory Peak: 236.43 MB
- Memory Avg: 236.14 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** heavy_load 🥉

- Import Time: 14.04 ms
- Relative Time: 48.36x (vs baseline)
- Memory Peak: 238.40 MB
- Memory Avg: 237.44 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** enterprise_load

- Import Time: 40.23 ms
- Relative Time: 138.59x (vs baseline)
- Memory Peak: 246.18 MB
- Memory Avg: 242.34 MB
- Package Size: 0.00 MB
- Features: auto_install

##### pylazyimports

**Test:** light_load

- Import Time: 0.86 ms
- Relative Time: 2.97x (vs baseline)
- Memory Peak: 263.99 MB
- Memory Avg: 263.89 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 4.64 ms
- Relative Time: 15.97x (vs baseline)
- Memory Peak: 264.97 MB
- Memory Avg: 264.48 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 16.08 ms
- Relative Time: 55.40x (vs baseline)
- Memory Peak: 266.28 MB
- Memory Avg: 265.63 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 42.53 ms
- Relative Time: 146.50x (vs baseline)
- Memory Peak: 270.98 MB
- Memory Avg: 268.63 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### xwlazy

**Test:** light_load

- Import Time: 1.13 ms
- Relative Time: 3.90x (vs baseline)
- Memory Peak: 280.38 MB
- Memory Avg: 280.29 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** medium_load

- Import Time: 4.65 ms
- Relative Time: 16.03x (vs baseline)
- Memory Peak: 284.18 MB
- Memory Avg: 283.00 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** heavy_load

- Import Time: 18.24 ms
- Relative Time: 62.84x (vs baseline)
- Memory Peak: 287.47 MB
- Memory Avg: 286.28 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** enterprise_load

- Import Time: 40.59 ms
- Relative Time: 139.83x (vs baseline)
- Memory Peak: 297.52 MB
- Memory Avg: 293.05 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring


### Lazy Import + Install

*Lazy import + auto-install - SMART mode (on-demand)*

#### Top 3 Rankings by Load Test

##### Enterprise Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | pylazyimports | 30.27 | 104.27x |
| 2 🥈 | deferred-import | 36.87 | 127.00x |
| 3 🥉 | lazy-imports | 38.54 | 132.77x |

##### Heavy Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | pylazyimports | 11.89 | 40.95x |
| 2 🥈 | lazy-imports | 13.72 | 47.28x |
| 3 🥉 | deferred-import | 14.27 | 49.15x |

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | deferred-import | 0.60 | 2.06x |
| 2 🥈 | lazy-loader | 0.64 | 2.21x |
| 3 🥉 | lazy-imports | 0.65 | 2.23x |

##### Medium Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazy-loader | 3.57 | 12.31x |
| 2 🥈 | pylazyimports | 3.61 | 12.44x |
| 3 🥉 | deferred-import | 3.77 | 13.00x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| deferred-import 🥇 | light_load | 0.60 | 2.06x | 115.12 | 0.00 | ✅ |
| deferred-import 🥉 | medium_load | 3.77 | 13.00x | 116.22 | 0.00 | ✅ |
| deferred-import 🥉 | heavy_load | 14.27 | 49.15x | 118.24 | 0.00 | ✅ |
| deferred-import 🥈 | enterprise_load | 36.87 | 127.00x | 120.50 | 0.00 | ✅ |
| lazi | light_load | 1.42 | 4.89x | 146.08 | 0.00 | ✅ |
| lazi | medium_load | 4.80 | 16.53x | 147.29 | 0.00 | ✅ |
| lazi | heavy_load | 16.83 | 57.97x | 148.73 | 0.00 | ✅ |
| lazi | enterprise_load | 44.73 | 154.07x | 153.20 | 0.00 | ✅ |
| lazy-imports 🥉 | light_load | 0.65 | 2.23x | 123.97 | 0.00 | ✅ |
| lazy-imports | medium_load | 4.02 | 13.85x | 124.64 | 0.00 | ✅ |
| lazy-imports 🥈 | heavy_load | 13.72 | 47.28x | 126.77 | 0.00 | ✅ |
| lazy-imports 🥉 | enterprise_load | 38.54 | 132.77x | 132.75 | 0.00 | ✅ |
| lazy-imports-lite | light_load | 1.73 | 5.95x | 153.21 | 0.00 | ✅ |
| lazy-imports-lite | medium_load | 8.20 | 28.24x | 153.22 | 0.00 | ✅ |
| lazy-imports-lite | heavy_load | 26.78 | 92.24x | 153.24 | 0.00 | ✅ |
| lazy-imports-lite | enterprise_load | 72.08 | 248.31x | 156.24 | 0.00 | ✅ |
| lazy-loader 🥈 | light_load | 0.64 | 2.21x | 120.61 | 0.00 | ✅ |
| lazy-loader 🥇 | medium_load | 3.57 | 12.31x | 120.63 | 0.00 | ✅ |
| lazy-loader | heavy_load | 15.67 | 53.97x | 120.64 | 0.00 | ✅ |
| lazy-loader | enterprise_load | 41.32 | 142.35x | 123.52 | 0.00 | ✅ |
| lazy_import | light_load | 1.40 | 4.83x | 133.11 | 0.00 | ✅ |
| lazy_import | medium_load | 5.68 | 19.56x | 133.15 | 0.00 | ✅ |
| lazy_import | heavy_load | 18.25 | 62.87x | 133.16 | 0.00 | ✅ |
| lazy_import | enterprise_load | 48.15 | 165.86x | 136.05 | 0.00 | ✅ |
| pipimport | light_load | 1.64 | 5.64x | 109.92 | 0.00 | ✅ |
| pipimport | medium_load | 10.01 | 34.47x | 109.94 | 0.00 | ✅ |
| pipimport | heavy_load | 30.03 | 103.45x | 110.04 | 0.00 | ✅ |
| pipimport | enterprise_load | 56.42 | 194.36x | 114.52 | 0.00 | ✅ |
| pylazyimports | light_load | 0.72 | 2.48x | 136.48 | 0.00 | ✅ |
| pylazyimports 🥈 | medium_load | 3.61 | 12.44x | 137.46 | 0.00 | ✅ |
| pylazyimports 🥇 | heavy_load | 11.89 | 40.95x | 139.25 | 0.00 | ✅ |
| pylazyimports 🥇 | enterprise_load | 30.27 | 104.27x | 145.51 | 0.00 | ✅ |
| xwlazy | light_load | 1.88 | 6.47x | 156.86 | 0.00 | ✅ |
| xwlazy | medium_load | 7.62 | 26.25x | 161.45 | 0.00 | ✅ |
| xwlazy | heavy_load | 30.29 | 104.35x | 164.61 | 0.00 | ✅ |
| xwlazy | enterprise_load | 64.39 | 221.81x | 173.52 | 0.00 | ✅ |

#### Detailed Results

##### deferred-import 🥇

**Test:** light_load 🥇

- Import Time: 0.60 ms
- Relative Time: 2.06x (vs baseline)
- Memory Peak: 115.12 MB
- Memory Avg: 115.04 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** medium_load 🥉

- Import Time: 3.77 ms
- Relative Time: 13.00x (vs baseline)
- Memory Peak: 116.22 MB
- Memory Avg: 115.67 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** heavy_load 🥉

- Import Time: 14.27 ms
- Relative Time: 49.15x (vs baseline)
- Memory Peak: 118.24 MB
- Memory Avg: 117.23 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** enterprise_load 🥈

- Import Time: 36.87 ms
- Relative Time: 127.00x (vs baseline)
- Memory Peak: 120.50 MB
- Memory Avg: 119.37 MB
- Package Size: 0.00 MB
- Features: deferred_loading

##### lazi

**Test:** light_load

- Import Time: 1.42 ms
- Relative Time: 4.89x (vs baseline)
- Memory Peak: 146.08 MB
- Memory Avg: 145.98 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** medium_load

- Import Time: 4.80 ms
- Relative Time: 16.53x (vs baseline)
- Memory Peak: 147.29 MB
- Memory Avg: 146.71 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** heavy_load

- Import Time: 16.83 ms
- Relative Time: 57.97x (vs baseline)
- Memory Peak: 148.73 MB
- Memory Avg: 148.03 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** enterprise_load

- Import Time: 44.73 ms
- Relative Time: 154.07x (vs baseline)
- Memory Peak: 153.20 MB
- Memory Avg: 150.96 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

##### lazy-imports 🥈

**Test:** light_load 🥉

- Import Time: 0.65 ms
- Relative Time: 2.23x (vs baseline)
- Memory Peak: 123.97 MB
- Memory Avg: 123.92 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 4.02 ms
- Relative Time: 13.85x (vs baseline)
- Memory Peak: 124.64 MB
- Memory Avg: 124.30 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load 🥈

- Import Time: 13.72 ms
- Relative Time: 47.28x (vs baseline)
- Memory Peak: 126.77 MB
- Memory Avg: 125.72 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load 🥉

- Import Time: 38.54 ms
- Relative Time: 132.77x (vs baseline)
- Memory Peak: 132.75 MB
- Memory Avg: 129.79 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### lazy-imports-lite

**Test:** light_load

- Import Time: 1.73 ms
- Relative Time: 5.95x (vs baseline)
- Memory Peak: 153.21 MB
- Memory Avg: 153.21 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** medium_load

- Import Time: 8.20 ms
- Relative Time: 28.24x (vs baseline)
- Memory Peak: 153.22 MB
- Memory Avg: 153.21 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** heavy_load

- Import Time: 26.78 ms
- Relative Time: 92.24x (vs baseline)
- Memory Peak: 153.24 MB
- Memory Avg: 153.23 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** enterprise_load

- Import Time: 72.08 ms
- Relative Time: 248.31x (vs baseline)
- Memory Peak: 156.24 MB
- Memory Avg: 154.74 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

##### lazy-loader 🥇

**Test:** light_load 🥈

- Import Time: 0.64 ms
- Relative Time: 2.21x (vs baseline)
- Memory Peak: 120.61 MB
- Memory Avg: 120.56 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** medium_load 🥇

- Import Time: 3.57 ms
- Relative Time: 12.31x (vs baseline)
- Memory Peak: 120.63 MB
- Memory Avg: 120.62 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** heavy_load

- Import Time: 15.67 ms
- Relative Time: 53.97x (vs baseline)
- Memory Peak: 120.64 MB
- Memory Avg: 120.63 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** enterprise_load

- Import Time: 41.32 ms
- Relative Time: 142.35x (vs baseline)
- Memory Peak: 123.52 MB
- Memory Avg: 122.08 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

##### lazy_import

**Test:** light_load

- Import Time: 1.40 ms
- Relative Time: 4.83x (vs baseline)
- Memory Peak: 133.11 MB
- Memory Avg: 133.10 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 5.68 ms
- Relative Time: 19.56x (vs baseline)
- Memory Peak: 133.15 MB
- Memory Avg: 133.15 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 18.25 ms
- Relative Time: 62.87x (vs baseline)
- Memory Peak: 133.16 MB
- Memory Avg: 133.16 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 48.15 ms
- Relative Time: 165.86x (vs baseline)
- Memory Peak: 136.05 MB
- Memory Avg: 134.61 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### pipimport

**Test:** light_load

- Import Time: 1.64 ms
- Relative Time: 5.64x (vs baseline)
- Memory Peak: 109.92 MB
- Memory Avg: 109.92 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** medium_load

- Import Time: 10.01 ms
- Relative Time: 34.47x (vs baseline)
- Memory Peak: 109.94 MB
- Memory Avg: 109.93 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** heavy_load

- Import Time: 30.03 ms
- Relative Time: 103.45x (vs baseline)
- Memory Peak: 110.04 MB
- Memory Avg: 109.99 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** enterprise_load

- Import Time: 56.42 ms
- Relative Time: 194.36x (vs baseline)
- Memory Peak: 114.52 MB
- Memory Avg: 112.28 MB
- Package Size: 0.00 MB
- Features: auto_install

##### pylazyimports 🥇

**Test:** light_load

- Import Time: 0.72 ms
- Relative Time: 2.48x (vs baseline)
- Memory Peak: 136.48 MB
- Memory Avg: 136.44 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load 🥈

- Import Time: 3.61 ms
- Relative Time: 12.44x (vs baseline)
- Memory Peak: 137.46 MB
- Memory Avg: 136.97 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load 🥇

- Import Time: 11.89 ms
- Relative Time: 40.95x (vs baseline)
- Memory Peak: 139.25 MB
- Memory Avg: 138.35 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load 🥇

- Import Time: 30.27 ms
- Relative Time: 104.27x (vs baseline)
- Memory Peak: 145.51 MB
- Memory Avg: 142.38 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### xwlazy

**Test:** light_load

- Import Time: 1.88 ms
- Relative Time: 6.47x (vs baseline)
- Memory Peak: 156.86 MB
- Memory Avg: 156.77 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** medium_load

- Import Time: 7.62 ms
- Relative Time: 26.25x (vs baseline)
- Memory Peak: 161.45 MB
- Memory Avg: 159.90 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** heavy_load

- Import Time: 30.29 ms
- Relative Time: 104.35x (vs baseline)
- Memory Peak: 164.61 MB
- Memory Avg: 163.71 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** enterprise_load

- Import Time: 64.39 ms
- Relative Time: 221.81x (vs baseline)
- Memory Peak: 173.52 MB
- Memory Avg: 169.37 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring


### Basic Lazy Import

*Basic lazy import (fair comparison - all libraries) - LITE mode*

#### Top 3 Rankings by Load Test

##### Enterprise Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | pylazyimports | 56.21 | 193.64x |
| 2 🥈 | lazy-loader | 58.14 | 200.28x |
| 3 🥉 | lazy_import | 58.87 | 202.79x |

##### Heavy Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazy-loader | 20.55 | 70.79x |
| 2 🥈 | deferred-import | 20.55 | 70.80x |
| 3 🥉 | pylazyimports | 21.35 | 73.56x |

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | deferred-import | 0.88 | 3.02x |
| 2 🥈 | lazy-imports-lite | 1.07 | 3.68x |
| 3 🥉 | lazy-imports | 1.23 | 4.25x |

##### Medium Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | pylazyimports | 6.05 | 20.84x |
| 2 🥈 | lazy-loader | 6.09 | 20.96x |
| 3 🥉 | pipimport | 6.34 | 21.84x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| deferred-import 🥇 | light_load | 0.88 | 3.02x | 45.46 | 0.00 | ✅ |
| deferred-import | medium_load | 9.93 | 34.21x | 46.17 | 0.00 | ✅ |
| deferred-import 🥈 | heavy_load | 20.55 | 70.80x | 48.01 | 0.00 | ✅ |
| deferred-import | enterprise_load | 90.22 | 310.79x | 51.24 | 0.00 | ✅ |
| lazi | light_load | 2.39 | 8.22x | 85.05 | 0.00 | ✅ |
| lazi | medium_load | 8.20 | 28.24x | 86.16 | 0.00 | ✅ |
| lazi | heavy_load | 24.54 | 84.53x | 88.34 | 0.00 | ✅ |
| lazi | enterprise_load | 61.84 | 213.02x | 88.93 | 0.00 | ✅ |
| lazy-imports 🥉 | light_load | 1.23 | 4.25x | 61.00 | 0.00 | ✅ |
| lazy-imports | medium_load | 7.51 | 25.86x | 62.57 | 0.00 | ✅ |
| lazy-imports | heavy_load | 22.45 | 77.35x | 64.46 | 0.00 | ✅ |
| lazy-imports | enterprise_load | 59.54 | 205.11x | 70.25 | 0.00 | ✅ |
| lazy-imports-lite 🥈 | light_load | 1.07 | 3.68x | 89.04 | 0.00 | ✅ |
| lazy-imports-lite | medium_load | 10.10 | 34.80x | 89.34 | 0.00 | ✅ |
| lazy-imports-lite | heavy_load | 25.13 | 86.56x | 91.52 | 0.00 | ✅ |
| lazy-imports-lite | enterprise_load | 64.19 | 221.13x | 98.59 | 0.00 | ✅ |
| lazy-loader | light_load | 1.57 | 5.42x | 51.76 | 0.00 | ✅ |
| lazy-loader 🥈 | medium_load | 6.09 | 20.96x | 52.57 | 0.00 | ✅ |
| lazy-loader 🥇 | heavy_load | 20.55 | 70.79x | 54.53 | 0.00 | ✅ |
| lazy-loader 🥈 | enterprise_load | 58.14 | 200.28x | 60.00 | 0.00 | ✅ |
| lazy_import | light_load | 2.27 | 7.81x | 70.28 | 0.00 | ✅ |
| lazy_import | medium_load | 6.44 | 22.17x | 70.30 | 0.00 | ✅ |
| lazy_import | heavy_load | 24.07 | 82.90x | 70.47 | 0.00 | ✅ |
| lazy_import 🥉 | enterprise_load | 58.87 | 202.79x | 74.54 | 0.00 | ✅ |
| pipimport | light_load | 1.74 | 6.01x | 29.44 | 0.00 | ✅ |
| pipimport 🥉 | medium_load | 6.34 | 21.84x | 30.71 | 0.00 | ✅ |
| pipimport | heavy_load | 21.38 | 73.63x | 34.44 | 0.00 | ✅ |
| pipimport | enterprise_load | 71.48 | 246.24x | 44.11 | 0.00 | ✅ |
| pylazyimports | light_load | 1.48 | 5.10x | 75.40 | 0.00 | ✅ |
| pylazyimports 🥇 | medium_load | 6.05 | 20.84x | 76.73 | 0.00 | ✅ |
| pylazyimports 🥉 | heavy_load | 21.35 | 73.56x | 78.69 | 0.00 | ✅ |
| pylazyimports 🥇 | enterprise_load | 56.21 | 193.64x | 84.48 | 0.00 | ✅ |
| xwlazy | light_load | 1.94 | 6.69x | 102.29 | 0.00 | ✅ |
| xwlazy | medium_load | 6.72 | 23.16x | 105.22 | 0.00 | ✅ |
| xwlazy | heavy_load | 21.47 | 73.95x | 108.16 | 0.00 | ✅ |
| xwlazy | enterprise_load | 60.63 | 208.84x | 109.91 | 0.00 | ✅ |

#### Detailed Results

##### deferred-import 🥇

**Test:** light_load 🥇

- Import Time: 0.88 ms
- Relative Time: 3.02x (vs baseline)
- Memory Peak: 45.46 MB
- Memory Avg: 45.28 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** medium_load

- Import Time: 9.93 ms
- Relative Time: 34.21x (vs baseline)
- Memory Peak: 46.17 MB
- Memory Avg: 45.81 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** heavy_load 🥈

- Import Time: 20.55 ms
- Relative Time: 70.80x (vs baseline)
- Memory Peak: 48.01 MB
- Memory Avg: 47.09 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** enterprise_load

- Import Time: 90.22 ms
- Relative Time: 310.79x (vs baseline)
- Memory Peak: 51.24 MB
- Memory Avg: 49.62 MB
- Package Size: 0.00 MB
- Features: deferred_loading

##### lazi

**Test:** light_load

- Import Time: 2.39 ms
- Relative Time: 8.22x (vs baseline)
- Memory Peak: 85.05 MB
- Memory Avg: 84.93 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** medium_load

- Import Time: 8.20 ms
- Relative Time: 28.24x (vs baseline)
- Memory Peak: 86.16 MB
- Memory Avg: 85.60 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** heavy_load

- Import Time: 24.54 ms
- Relative Time: 84.53x (vs baseline)
- Memory Peak: 88.34 MB
- Memory Avg: 87.26 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** enterprise_load

- Import Time: 61.84 ms
- Relative Time: 213.02x (vs baseline)
- Memory Peak: 88.93 MB
- Memory Avg: 88.63 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

##### lazy-imports 🥉

**Test:** light_load 🥉

- Import Time: 1.23 ms
- Relative Time: 4.25x (vs baseline)
- Memory Peak: 61.00 MB
- Memory Avg: 60.83 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 7.51 ms
- Relative Time: 25.86x (vs baseline)
- Memory Peak: 62.57 MB
- Memory Avg: 61.82 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 22.45 ms
- Relative Time: 77.35x (vs baseline)
- Memory Peak: 64.46 MB
- Memory Avg: 63.57 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 59.54 ms
- Relative Time: 205.11x (vs baseline)
- Memory Peak: 70.25 MB
- Memory Avg: 67.45 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### lazy-imports-lite 🥈

**Test:** light_load 🥈

- Import Time: 1.07 ms
- Relative Time: 3.68x (vs baseline)
- Memory Peak: 89.04 MB
- Memory Avg: 89.03 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** medium_load

- Import Time: 10.10 ms
- Relative Time: 34.80x (vs baseline)
- Memory Peak: 89.34 MB
- Memory Avg: 89.19 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** heavy_load

- Import Time: 25.13 ms
- Relative Time: 86.56x (vs baseline)
- Memory Peak: 91.52 MB
- Memory Avg: 90.44 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** enterprise_load

- Import Time: 64.19 ms
- Relative Time: 221.13x (vs baseline)
- Memory Peak: 98.59 MB
- Memory Avg: 95.06 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

##### lazy-loader 🥇

**Test:** light_load

- Import Time: 1.57 ms
- Relative Time: 5.42x (vs baseline)
- Memory Peak: 51.76 MB
- Memory Avg: 51.66 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** medium_load 🥈

- Import Time: 6.09 ms
- Relative Time: 20.96x (vs baseline)
- Memory Peak: 52.57 MB
- Memory Avg: 52.17 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** heavy_load 🥇

- Import Time: 20.55 ms
- Relative Time: 70.79x (vs baseline)
- Memory Peak: 54.53 MB
- Memory Avg: 53.55 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** enterprise_load 🥈

- Import Time: 58.14 ms
- Relative Time: 200.28x (vs baseline)
- Memory Peak: 60.00 MB
- Memory Avg: 57.27 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

##### lazy_import 🥉

**Test:** light_load

- Import Time: 2.27 ms
- Relative Time: 7.81x (vs baseline)
- Memory Peak: 70.28 MB
- Memory Avg: 70.28 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 6.44 ms
- Relative Time: 22.17x (vs baseline)
- Memory Peak: 70.30 MB
- Memory Avg: 70.30 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 24.07 ms
- Relative Time: 82.90x (vs baseline)
- Memory Peak: 70.47 MB
- Memory Avg: 70.39 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load 🥉

- Import Time: 58.87 ms
- Relative Time: 202.79x (vs baseline)
- Memory Peak: 74.54 MB
- Memory Avg: 72.51 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### pipimport 🥉

**Test:** light_load

- Import Time: 1.74 ms
- Relative Time: 6.01x (vs baseline)
- Memory Peak: 29.44 MB
- Memory Avg: 29.10 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** medium_load 🥉

- Import Time: 6.34 ms
- Relative Time: 21.84x (vs baseline)
- Memory Peak: 30.71 MB
- Memory Avg: 30.21 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** heavy_load

- Import Time: 21.38 ms
- Relative Time: 73.63x (vs baseline)
- Memory Peak: 34.44 MB
- Memory Avg: 32.60 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** enterprise_load

- Import Time: 71.48 ms
- Relative Time: 246.24x (vs baseline)
- Memory Peak: 44.11 MB
- Memory Avg: 39.30 MB
- Package Size: 0.00 MB
- Features: auto_install

##### pylazyimports 🥇

**Test:** light_load

- Import Time: 1.48 ms
- Relative Time: 5.10x (vs baseline)
- Memory Peak: 75.40 MB
- Memory Avg: 75.14 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load 🥇

- Import Time: 6.05 ms
- Relative Time: 20.84x (vs baseline)
- Memory Peak: 76.73 MB
- Memory Avg: 76.07 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load 🥉

- Import Time: 21.35 ms
- Relative Time: 73.56x (vs baseline)
- Memory Peak: 78.69 MB
- Memory Avg: 77.75 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load 🥇

- Import Time: 56.21 ms
- Relative Time: 193.64x (vs baseline)
- Memory Peak: 84.48 MB
- Memory Avg: 81.59 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### xwlazy

**Test:** light_load

- Import Time: 1.94 ms
- Relative Time: 6.69x (vs baseline)
- Memory Peak: 102.29 MB
- Memory Avg: 100.66 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** medium_load

- Import Time: 6.72 ms
- Relative Time: 23.16x (vs baseline)
- Memory Peak: 105.22 MB
- Memory Avg: 104.13 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** heavy_load

- Import Time: 21.47 ms
- Relative Time: 73.95x (vs baseline)
- Memory Peak: 108.16 MB
- Memory Avg: 106.76 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** enterprise_load

- Import Time: 60.63 ms
- Relative Time: 208.84x (vs baseline)
- Memory Peak: 109.91 MB
- Memory Avg: 109.80 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring


### Preload Mode

*Preload all modules on start - PRELOAD mode*

#### Top 3 Rankings by Load Test

##### Enterprise Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 38.77 | 133.55x |
| 2 🥈 | lazy-imports-lite | 40.92 | 140.97x |
| 3 🥉 | lazi | 46.62 | 160.58x |

##### Heavy Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 13.36 | 46.03x |
| 2 🥈 | lazy-imports-lite | 15.36 | 52.91x |
| 3 🥉 | lazi | 19.02 | 65.50x |

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazy-imports-lite | 0.63 | 2.16x |
| 2 🥈 | xwlazy | 1.24 | 4.26x |
| 3 🥉 | lazi | 1.30 | 4.47x |

##### Medium Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazy-imports-lite | 4.07 | 14.04x |
| 2 🥈 | xwlazy | 4.94 | 17.03x |
| 3 🥉 | lazi | 5.76 | 19.85x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| deferred-import | light_load | 1.38 | 4.76x | 176.57 | 0.00 | ✅ |
| deferred-import | medium_load | 8.19 | 28.23x | 176.64 | 0.00 | ✅ |
| deferred-import | heavy_load | 25.96 | 89.44x | 176.74 | 0.00 | ✅ |
| deferred-import | enterprise_load | 65.23 | 224.68x | 177.52 | 0.00 | ✅ |
| lazi 🥉 | light_load | 1.30 | 4.47x | 210.84 | 0.00 | ✅ |
| lazi 🥉 | medium_load | 5.76 | 19.85x | 212.04 | 0.00 | ✅ |
| lazi 🥉 | heavy_load | 19.02 | 65.50x | 213.97 | 0.00 | ✅ |
| lazi 🥉 | enterprise_load | 46.62 | 160.58x | 216.00 | 0.00 | ✅ |
| lazy-imports | light_load | 1.38 | 4.74x | 188.17 | 0.00 | ✅ |
| lazy-imports | medium_load | 9.04 | 31.13x | 189.34 | 0.00 | ✅ |
| lazy-imports | heavy_load | 23.46 | 80.81x | 189.36 | 0.00 | ✅ |
| lazy-imports | enterprise_load | 67.50 | 232.53x | 189.92 | 0.00 | ✅ |
| lazy-imports-lite 🥇 | light_load | 0.63 | 2.16x | 216.01 | 0.00 | ✅ |
| lazy-imports-lite 🥇 | medium_load | 4.07 | 14.04x | 216.02 | 0.00 | ✅ |
| lazy-imports-lite 🥈 | heavy_load | 15.36 | 52.91x | 216.02 | 0.00 | ✅ |
| lazy-imports-lite 🥈 | enterprise_load | 40.92 | 140.97x | 217.12 | 0.00 | ✅ |
| lazy-loader | light_load | 1.59 | 5.46x | 177.95 | 0.00 | ✅ |
| lazy-loader | medium_load | 8.05 | 27.75x | 179.10 | 0.00 | ✅ |
| lazy-loader | heavy_load | 27.96 | 96.30x | 180.30 | 0.00 | ✅ |
| lazy-loader | enterprise_load | 71.68 | 246.93x | 187.70 | 0.00 | ✅ |
| lazy_import | light_load | 1.81 | 6.25x | 189.94 | 0.00 | ✅ |
| lazy_import | medium_load | 6.73 | 23.19x | 190.49 | 0.00 | ✅ |
| lazy_import | heavy_load | 24.62 | 84.82x | 191.65 | 0.00 | ✅ |
| lazy_import | enterprise_load | 81.32 | 280.12x | 197.91 | 0.00 | ✅ |
| pipimport | light_load | 1.83 | 6.30x | 175.64 | 0.00 | ✅ |
| pipimport | medium_load | 8.71 | 30.00x | 175.80 | 0.00 | ✅ |
| pipimport | heavy_load | 28.51 | 98.22x | 175.85 | 0.00 | ✅ |
| pipimport | enterprise_load | 70.74 | 243.67x | 176.45 | 0.00 | ✅ |
| pylazyimports | light_load | 3.38 | 11.64x | 198.32 | 0.00 | ✅ |
| pylazyimports | medium_load | 11.15 | 38.40x | 198.94 | 0.00 | ✅ |
| pylazyimports | heavy_load | 30.40 | 104.71x | 201.15 | 0.00 | ✅ |
| pylazyimports | enterprise_load | 80.10 | 275.93x | 210.36 | 0.00 | ✅ |
| xwlazy 🥈 | light_load | 1.24 | 4.26x | 217.67 | 0.00 | ✅ |
| xwlazy 🥈 | medium_load | 4.94 | 17.03x | 221.49 | 0.00 | ✅ |
| xwlazy 🥇 | heavy_load | 13.36 | 46.03x | 225.04 | 0.00 | ✅ |
| xwlazy 🥇 | enterprise_load | 38.77 | 133.55x | 233.81 | 0.00 | ✅ |

#### Detailed Results

##### deferred-import

**Test:** light_load

- Import Time: 1.38 ms
- Relative Time: 4.76x (vs baseline)
- Memory Peak: 176.57 MB
- Memory Avg: 176.56 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** medium_load

- Import Time: 8.19 ms
- Relative Time: 28.23x (vs baseline)
- Memory Peak: 176.64 MB
- Memory Avg: 176.61 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** heavy_load

- Import Time: 25.96 ms
- Relative Time: 89.44x (vs baseline)
- Memory Peak: 176.74 MB
- Memory Avg: 176.69 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** enterprise_load

- Import Time: 65.23 ms
- Relative Time: 224.68x (vs baseline)
- Memory Peak: 177.52 MB
- Memory Avg: 177.13 MB
- Package Size: 0.00 MB
- Features: deferred_loading

##### lazi 🥉

**Test:** light_load 🥉

- Import Time: 1.30 ms
- Relative Time: 4.47x (vs baseline)
- Memory Peak: 210.84 MB
- Memory Avg: 210.76 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** medium_load 🥉

- Import Time: 5.76 ms
- Relative Time: 19.85x (vs baseline)
- Memory Peak: 212.04 MB
- Memory Avg: 211.44 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** heavy_load 🥉

- Import Time: 19.02 ms
- Relative Time: 65.50x (vs baseline)
- Memory Peak: 213.97 MB
- Memory Avg: 213.01 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** enterprise_load 🥉

- Import Time: 46.62 ms
- Relative Time: 160.58x (vs baseline)
- Memory Peak: 216.00 MB
- Memory Avg: 214.99 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

##### lazy-imports

**Test:** light_load

- Import Time: 1.38 ms
- Relative Time: 4.74x (vs baseline)
- Memory Peak: 188.17 MB
- Memory Avg: 188.12 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 9.04 ms
- Relative Time: 31.13x (vs baseline)
- Memory Peak: 189.34 MB
- Memory Avg: 188.78 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 23.46 ms
- Relative Time: 80.81x (vs baseline)
- Memory Peak: 189.36 MB
- Memory Avg: 189.35 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 67.50 ms
- Relative Time: 232.53x (vs baseline)
- Memory Peak: 189.92 MB
- Memory Avg: 189.64 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### lazy-imports-lite 🥇

**Test:** light_load 🥇

- Import Time: 0.63 ms
- Relative Time: 2.16x (vs baseline)
- Memory Peak: 216.01 MB
- Memory Avg: 216.01 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** medium_load 🥇

- Import Time: 4.07 ms
- Relative Time: 14.04x (vs baseline)
- Memory Peak: 216.02 MB
- Memory Avg: 216.01 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** heavy_load 🥈

- Import Time: 15.36 ms
- Relative Time: 52.91x (vs baseline)
- Memory Peak: 216.02 MB
- Memory Avg: 216.02 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** enterprise_load 🥈

- Import Time: 40.92 ms
- Relative Time: 140.97x (vs baseline)
- Memory Peak: 217.12 MB
- Memory Avg: 216.57 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

##### lazy-loader

**Test:** light_load

- Import Time: 1.59 ms
- Relative Time: 5.46x (vs baseline)
- Memory Peak: 177.95 MB
- Memory Avg: 177.84 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** medium_load

- Import Time: 8.05 ms
- Relative Time: 27.75x (vs baseline)
- Memory Peak: 179.10 MB
- Memory Avg: 178.53 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** heavy_load

- Import Time: 27.96 ms
- Relative Time: 96.30x (vs baseline)
- Memory Peak: 180.30 MB
- Memory Avg: 179.71 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** enterprise_load

- Import Time: 71.68 ms
- Relative Time: 246.93x (vs baseline)
- Memory Peak: 187.70 MB
- Memory Avg: 184.00 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

##### lazy_import

**Test:** light_load

- Import Time: 1.81 ms
- Relative Time: 6.25x (vs baseline)
- Memory Peak: 189.94 MB
- Memory Avg: 189.93 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 6.73 ms
- Relative Time: 23.19x (vs baseline)
- Memory Peak: 190.49 MB
- Memory Avg: 190.22 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 24.62 ms
- Relative Time: 84.82x (vs baseline)
- Memory Peak: 191.65 MB
- Memory Avg: 191.08 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 81.32 ms
- Relative Time: 280.12x (vs baseline)
- Memory Peak: 197.91 MB
- Memory Avg: 194.79 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### pipimport

**Test:** light_load

- Import Time: 1.83 ms
- Relative Time: 6.30x (vs baseline)
- Memory Peak: 175.64 MB
- Memory Avg: 175.60 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** medium_load

- Import Time: 8.71 ms
- Relative Time: 30.00x (vs baseline)
- Memory Peak: 175.80 MB
- Memory Avg: 175.72 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** heavy_load

- Import Time: 28.51 ms
- Relative Time: 98.22x (vs baseline)
- Memory Peak: 175.85 MB
- Memory Avg: 175.82 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** enterprise_load

- Import Time: 70.74 ms
- Relative Time: 243.67x (vs baseline)
- Memory Peak: 176.45 MB
- Memory Avg: 176.15 MB
- Package Size: 0.00 MB
- Features: auto_install

##### pylazyimports

**Test:** light_load

- Import Time: 3.38 ms
- Relative Time: 11.64x (vs baseline)
- Memory Peak: 198.32 MB
- Memory Avg: 198.26 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 11.15 ms
- Relative Time: 38.40x (vs baseline)
- Memory Peak: 198.94 MB
- Memory Avg: 198.63 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 30.40 ms
- Relative Time: 104.71x (vs baseline)
- Memory Peak: 201.15 MB
- Memory Avg: 200.05 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 80.10 ms
- Relative Time: 275.93x (vs baseline)
- Memory Peak: 210.36 MB
- Memory Avg: 205.76 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### xwlazy 🥇

**Test:** light_load 🥈

- Import Time: 1.24 ms
- Relative Time: 4.26x (vs baseline)
- Memory Peak: 217.67 MB
- Memory Avg: 217.58 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** medium_load 🥈

- Import Time: 4.94 ms
- Relative Time: 17.03x (vs baseline)
- Memory Peak: 221.49 MB
- Memory Avg: 220.30 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** heavy_load 🥇

- Import Time: 13.36 ms
- Relative Time: 46.03x (vs baseline)
- Memory Peak: 225.04 MB
- Memory Avg: 223.85 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** enterprise_load 🥇

- Import Time: 38.77 ms
- Relative Time: 133.55x (vs baseline)
- Memory Peak: 233.81 MB
- Memory Avg: 229.98 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring


## Overall Winner 👑

**deferred-import 👑** wins with **11 first place victory(ies)** across all test categories!

### Winner Summary

| Library | First Place Wins |
|---------|------------------|
| deferred-import 👑 | 11 |
| pylazyimports | 8 |
| lazy-imports | 5 |
| lazy_import | 4 |
| lazy-imports-lite | 3 |
| xwlazy | 3 |
| lazy-loader | 2 |


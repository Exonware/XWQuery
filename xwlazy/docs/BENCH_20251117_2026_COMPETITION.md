# Competition Benchmark Report

**Generated:** 2025-11-17T20:26:41.306777

## Standard Tests

### Auto Mode

*Smart install + auto-uninstall large - AUTO mode*

#### Top 3 Rankings by Load Test

##### Enterprise Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazy_import | 23.02 | 59.65x |
| 2 🥈 | lazy-imports | 23.13 | 59.94x |
| 3 🥉 | xwlazy | 23.54 | 61.00x |

##### Heavy Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | deferred-import | 7.99 | 20.70x |
| 2 🥈 | lazy-imports-lite | 8.21 | 21.28x |
| 3 🥉 | lazi | 8.29 | 21.48x |

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazi | 0.36 | 0.93x |
| 2 🥈 | lazy-loader | 0.47 | 1.23x |
| 3 🥉 | xwlazy | 0.49 | 1.27x |

##### Medium Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazy-imports-lite | 2.69 | 6.98x |
| 2 🥈 | pipimport | 2.79 | 7.22x |
| 3 🥉 | lazi | 2.89 | 7.48x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| deferred-import | light_load | 0.56 | 1.45x | 403.33 | 0.00 | ✅ |
| deferred-import | medium_load | 3.23 | 8.38x | 403.33 | 0.00 | ✅ |
| deferred-import 🥇 | heavy_load | 7.99 | 20.70x | 403.34 | 0.00 | ✅ |
| deferred-import | enterprise_load | 25.27 | 65.48x | 403.34 | 0.00 | ✅ |
| lazi 🥇 | light_load | 0.36 | 0.93x | 427.16 | 0.00 | ✅ |
| lazi 🥉 | medium_load | 2.89 | 7.48x | 428.32 | 0.00 | ✅ |
| lazi 🥉 | heavy_load | 8.29 | 21.48x | 430.74 | 0.00 | ✅ |
| lazi | enterprise_load | 23.56 | 61.06x | 437.37 | 0.00 | ✅ |
| lazy-imports | light_load | 0.70 | 1.81x | 403.46 | 0.00 | ✅ |
| lazy-imports | medium_load | 2.95 | 7.63x | 403.61 | 0.00 | ✅ |
| lazy-imports | heavy_load | 9.49 | 24.58x | 403.95 | 0.00 | ✅ |
| lazy-imports 🥈 | enterprise_load | 23.13 | 59.94x | 408.09 | 0.00 | ✅ |
| lazy-imports-lite | light_load | 0.79 | 2.04x | 437.46 | 0.00 | ✅ |
| lazy-imports-lite 🥇 | medium_load | 2.69 | 6.98x | 438.97 | 0.00 | ✅ |
| lazy-imports-lite 🥈 | heavy_load | 8.21 | 21.28x | 440.67 | 0.00 | ✅ |
| lazy-imports-lite | enterprise_load | 23.91 | 61.97x | 446.25 | 0.00 | ✅ |
| lazy-loader 🥈 | light_load | 0.47 | 1.23x | 403.34 | 0.00 | ✅ |
| lazy-loader | medium_load | 3.07 | 7.97x | 403.34 | 0.00 | ✅ |
| lazy-loader | heavy_load | 8.55 | 22.15x | 403.34 | 0.00 | ✅ |
| lazy-loader | enterprise_load | 24.70 | 64.02x | 403.45 | 0.00 | ✅ |
| lazy_import | light_load | 0.76 | 1.97x | 408.47 | 0.00 | ✅ |
| lazy_import | medium_load | 3.09 | 8.01x | 409.34 | 0.00 | ✅ |
| lazy_import | heavy_load | 8.43 | 21.84x | 411.05 | 0.00 | ✅ |
| lazy_import 🥇 | enterprise_load | 23.02 | 59.65x | 415.47 | 0.00 | ✅ |
| pipimport | light_load | 0.67 | 1.74x | 403.29 | 0.00 | ✅ |
| pipimport 🥈 | medium_load | 2.79 | 7.22x | 403.32 | 0.00 | ✅ |
| pipimport | heavy_load | 8.94 | 23.15x | 403.32 | 0.00 | ✅ |
| pipimport | enterprise_load | 23.55 | 61.02x | 403.33 | 0.00 | ✅ |
| pylazyimports | light_load | 0.64 | 1.65x | 415.69 | 0.00 | ✅ |
| pylazyimports | medium_load | 3.05 | 7.90x | 416.77 | 0.00 | ✅ |
| pylazyimports | heavy_load | 9.91 | 25.69x | 418.89 | 0.00 | ✅ |
| pylazyimports | enterprise_load | 23.79 | 61.64x | 427.04 | 0.00 | ✅ |
| xwlazy 🥉 | light_load | 0.49 | 1.27x | 446.38 | 0.00 | ✅ |
| xwlazy | medium_load | 3.30 | 8.54x | 447.43 | 0.00 | ✅ |
| xwlazy | heavy_load | 8.68 | 22.49x | 447.63 | 0.00 | ✅ |
| xwlazy 🥉 | enterprise_load | 23.54 | 61.00x | 447.70 | 0.00 | ✅ |

#### Detailed Results

##### deferred-import 🥇

**Test:** light_load

- Import Time: 0.56 ms
- Relative Time: 1.45x (vs baseline)
- Memory Peak: 403.33 MB
- Memory Avg: 403.33 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** medium_load

- Import Time: 3.23 ms
- Relative Time: 8.38x (vs baseline)
- Memory Peak: 403.33 MB
- Memory Avg: 403.33 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** heavy_load 🥇

- Import Time: 7.99 ms
- Relative Time: 20.70x (vs baseline)
- Memory Peak: 403.34 MB
- Memory Avg: 403.33 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** enterprise_load

- Import Time: 25.27 ms
- Relative Time: 65.48x (vs baseline)
- Memory Peak: 403.34 MB
- Memory Avg: 403.34 MB
- Package Size: 0.00 MB
- Features: deferred_loading

##### lazi 🥇

**Test:** light_load 🥇

- Import Time: 0.36 ms
- Relative Time: 0.93x (vs baseline)
- Memory Peak: 427.16 MB
- Memory Avg: 427.15 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** medium_load 🥉

- Import Time: 2.89 ms
- Relative Time: 7.48x (vs baseline)
- Memory Peak: 428.32 MB
- Memory Avg: 427.74 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** heavy_load 🥉

- Import Time: 8.29 ms
- Relative Time: 21.48x (vs baseline)
- Memory Peak: 430.74 MB
- Memory Avg: 429.54 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** enterprise_load

- Import Time: 23.56 ms
- Relative Time: 61.06x (vs baseline)
- Memory Peak: 437.37 MB
- Memory Avg: 434.06 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

##### lazy-imports 🥈

**Test:** light_load

- Import Time: 0.70 ms
- Relative Time: 1.81x (vs baseline)
- Memory Peak: 403.46 MB
- Memory Avg: 403.46 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 2.95 ms
- Relative Time: 7.63x (vs baseline)
- Memory Peak: 403.61 MB
- Memory Avg: 403.54 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 9.49 ms
- Relative Time: 24.58x (vs baseline)
- Memory Peak: 403.95 MB
- Memory Avg: 403.78 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load 🥈

- Import Time: 23.13 ms
- Relative Time: 59.94x (vs baseline)
- Memory Peak: 408.09 MB
- Memory Avg: 406.02 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### lazy-imports-lite 🥇

**Test:** light_load

- Import Time: 0.79 ms
- Relative Time: 2.04x (vs baseline)
- Memory Peak: 437.46 MB
- Memory Avg: 437.45 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** medium_load 🥇

- Import Time: 2.69 ms
- Relative Time: 6.98x (vs baseline)
- Memory Peak: 438.97 MB
- Memory Avg: 438.22 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** heavy_load 🥈

- Import Time: 8.21 ms
- Relative Time: 21.28x (vs baseline)
- Memory Peak: 440.67 MB
- Memory Avg: 439.82 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** enterprise_load

- Import Time: 23.91 ms
- Relative Time: 61.97x (vs baseline)
- Memory Peak: 446.25 MB
- Memory Avg: 443.46 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

##### lazy-loader 🥈

**Test:** light_load 🥈

- Import Time: 0.47 ms
- Relative Time: 1.23x (vs baseline)
- Memory Peak: 403.34 MB
- Memory Avg: 403.34 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** medium_load

- Import Time: 3.07 ms
- Relative Time: 7.97x (vs baseline)
- Memory Peak: 403.34 MB
- Memory Avg: 403.34 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** heavy_load

- Import Time: 8.55 ms
- Relative Time: 22.15x (vs baseline)
- Memory Peak: 403.34 MB
- Memory Avg: 403.34 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** enterprise_load

- Import Time: 24.70 ms
- Relative Time: 64.02x (vs baseline)
- Memory Peak: 403.45 MB
- Memory Avg: 403.40 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

##### lazy_import 🥇

**Test:** light_load

- Import Time: 0.76 ms
- Relative Time: 1.97x (vs baseline)
- Memory Peak: 408.47 MB
- Memory Avg: 408.45 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 3.09 ms
- Relative Time: 8.01x (vs baseline)
- Memory Peak: 409.34 MB
- Memory Avg: 408.91 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 8.43 ms
- Relative Time: 21.84x (vs baseline)
- Memory Peak: 411.05 MB
- Memory Avg: 410.20 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load 🥇

- Import Time: 23.02 ms
- Relative Time: 59.65x (vs baseline)
- Memory Peak: 415.47 MB
- Memory Avg: 413.26 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### pipimport 🥈

**Test:** light_load

- Import Time: 0.67 ms
- Relative Time: 1.74x (vs baseline)
- Memory Peak: 403.29 MB
- Memory Avg: 403.27 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** medium_load 🥈

- Import Time: 2.79 ms
- Relative Time: 7.22x (vs baseline)
- Memory Peak: 403.32 MB
- Memory Avg: 403.32 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** heavy_load

- Import Time: 8.94 ms
- Relative Time: 23.15x (vs baseline)
- Memory Peak: 403.32 MB
- Memory Avg: 403.32 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** enterprise_load

- Import Time: 23.55 ms
- Relative Time: 61.02x (vs baseline)
- Memory Peak: 403.33 MB
- Memory Avg: 403.33 MB
- Package Size: 0.00 MB
- Features: auto_install

##### pylazyimports

**Test:** light_load

- Import Time: 0.64 ms
- Relative Time: 1.65x (vs baseline)
- Memory Peak: 415.69 MB
- Memory Avg: 415.68 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 3.05 ms
- Relative Time: 7.90x (vs baseline)
- Memory Peak: 416.77 MB
- Memory Avg: 416.23 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 9.91 ms
- Relative Time: 25.69x (vs baseline)
- Memory Peak: 418.89 MB
- Memory Avg: 417.83 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 23.79 ms
- Relative Time: 61.64x (vs baseline)
- Memory Peak: 427.04 MB
- Memory Avg: 422.97 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### xwlazy 🥉

**Test:** light_load 🥉

- Import Time: 0.49 ms
- Relative Time: 1.27x (vs baseline)
- Memory Peak: 446.38 MB
- Memory Avg: 446.38 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** medium_load

- Import Time: 3.30 ms
- Relative Time: 8.54x (vs baseline)
- Memory Peak: 447.43 MB
- Memory Avg: 447.17 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** heavy_load

- Import Time: 8.68 ms
- Relative Time: 22.49x (vs baseline)
- Memory Peak: 447.63 MB
- Memory Avg: 447.63 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** enterprise_load 🥉

- Import Time: 23.54 ms
- Relative Time: 61.00x (vs baseline)
- Memory Peak: 447.70 MB
- Memory Avg: 447.70 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring


### Clean Mode

*Install on usage + uninstall after - CLEAN mode*

#### Top 3 Rankings by Load Test

##### Enterprise Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazi | 23.05 | 59.73x |
| 2 🥈 | pipimport | 23.09 | 59.83x |
| 3 🥉 | lazy_import | 23.30 | 60.37x |

##### Heavy Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazy-imports-lite | 8.42 | 21.81x |
| 2 🥈 | lazi | 8.54 | 22.14x |
| 3 🥉 | lazy-imports | 8.66 | 22.45x |

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazi | 0.35 | 0.91x |
| 2 🥈 | deferred-import | 0.42 | 1.09x |
| 3 🥉 | lazy-loader | 0.45 | 1.16x |

##### Medium Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 2.41 | 6.25x |
| 2 🥈 | lazy_import | 2.44 | 6.33x |
| 3 🥉 | pipimport | 2.50 | 6.48x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| deferred-import 🥈 | light_load | 0.42 | 1.09x | 357.54 | 0.00 | ✅ |
| deferred-import | medium_load | 3.08 | 7.98x | 357.54 | 0.00 | ✅ |
| deferred-import | heavy_load | 8.89 | 23.04x | 357.54 | 0.00 | ✅ |
| deferred-import | enterprise_load | 24.67 | 63.92x | 357.56 | 0.00 | ✅ |
| lazi 🥇 | light_load | 0.35 | 0.91x | 377.42 | 0.00 | ✅ |
| lazi | medium_load | 3.12 | 8.09x | 378.91 | 0.00 | ✅ |
| lazi 🥈 | heavy_load | 8.54 | 22.14x | 381.32 | 0.00 | ✅ |
| lazi 🥇 | enterprise_load | 23.05 | 59.73x | 389.60 | 0.00 | ✅ |
| lazy-imports | light_load | 0.55 | 1.44x | 357.59 | 0.00 | ✅ |
| lazy-imports | medium_load | 2.91 | 7.54x | 357.60 | 0.00 | ✅ |
| lazy-imports 🥉 | heavy_load | 8.66 | 22.45x | 358.87 | 0.00 | ✅ |
| lazy-imports | enterprise_load | 25.20 | 65.31x | 359.66 | 0.00 | ✅ |
| lazy-imports-lite | light_load | 0.80 | 2.07x | 389.69 | 0.00 | ✅ |
| lazy-imports-lite | medium_load | 2.73 | 7.08x | 390.85 | 0.00 | ✅ |
| lazy-imports-lite 🥇 | heavy_load | 8.42 | 21.81x | 392.80 | 0.00 | ✅ |
| lazy-imports-lite | enterprise_load | 24.49 | 63.47x | 397.80 | 0.00 | ✅ |
| lazy-loader 🥉 | light_load | 0.45 | 1.16x | 357.56 | 0.00 | ✅ |
| lazy-loader | medium_load | 2.90 | 7.51x | 357.56 | 0.00 | ✅ |
| lazy-loader | heavy_load | 8.70 | 22.54x | 357.56 | 0.00 | ✅ |
| lazy-loader | enterprise_load | 24.48 | 63.43x | 357.59 | 0.00 | ✅ |
| lazy_import | light_load | 0.76 | 1.98x | 359.80 | 0.00 | ✅ |
| lazy_import 🥈 | medium_load | 2.44 | 6.33x | 360.61 | 0.00 | ✅ |
| lazy_import | heavy_load | 8.67 | 22.47x | 362.12 | 0.00 | ✅ |
| lazy_import 🥉 | enterprise_load | 23.30 | 60.37x | 367.73 | 0.00 | ✅ |
| pipimport | light_load | 0.74 | 1.92x | 350.74 | 0.00 | ✅ |
| pipimport 🥉 | medium_load | 2.50 | 6.48x | 351.62 | 0.00 | ✅ |
| pipimport | heavy_load | 8.90 | 23.07x | 353.50 | 0.00 | ✅ |
| pipimport 🥈 | enterprise_load | 23.09 | 59.83x | 357.53 | 0.00 | ✅ |
| pylazyimports | light_load | 0.45 | 1.17x | 367.84 | 0.00 | ✅ |
| pylazyimports | medium_load | 2.93 | 7.58x | 368.68 | 0.00 | ✅ |
| pylazyimports | heavy_load | 8.71 | 22.57x | 370.52 | 0.00 | ✅ |
| pylazyimports | enterprise_load | 23.40 | 60.63x | 377.33 | 0.00 | ✅ |
| xwlazy | light_load | 0.51 | 1.31x | 397.91 | 0.00 | ✅ |
| xwlazy 🥇 | medium_load | 2.41 | 6.25x | 399.28 | 0.00 | ✅ |
| xwlazy | heavy_load | 9.09 | 23.56x | 401.58 | 0.00 | ✅ |
| xwlazy | enterprise_load | 27.14 | 70.33x | 403.18 | 0.00 | ✅ |

#### Detailed Results

##### deferred-import 🥈

**Test:** light_load 🥈

- Import Time: 0.42 ms
- Relative Time: 1.09x (vs baseline)
- Memory Peak: 357.54 MB
- Memory Avg: 357.54 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** medium_load

- Import Time: 3.08 ms
- Relative Time: 7.98x (vs baseline)
- Memory Peak: 357.54 MB
- Memory Avg: 357.54 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** heavy_load

- Import Time: 8.89 ms
- Relative Time: 23.04x (vs baseline)
- Memory Peak: 357.54 MB
- Memory Avg: 357.54 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** enterprise_load

- Import Time: 24.67 ms
- Relative Time: 63.92x (vs baseline)
- Memory Peak: 357.56 MB
- Memory Avg: 357.55 MB
- Package Size: 0.00 MB
- Features: deferred_loading

##### lazi 🥇

**Test:** light_load 🥇

- Import Time: 0.35 ms
- Relative Time: 0.91x (vs baseline)
- Memory Peak: 377.42 MB
- Memory Avg: 377.41 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** medium_load

- Import Time: 3.12 ms
- Relative Time: 8.09x (vs baseline)
- Memory Peak: 378.91 MB
- Memory Avg: 378.17 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** heavy_load 🥈

- Import Time: 8.54 ms
- Relative Time: 22.14x (vs baseline)
- Memory Peak: 381.32 MB
- Memory Avg: 380.14 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** enterprise_load 🥇

- Import Time: 23.05 ms
- Relative Time: 59.73x (vs baseline)
- Memory Peak: 389.60 MB
- Memory Avg: 385.47 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

##### lazy-imports 🥉

**Test:** light_load

- Import Time: 0.55 ms
- Relative Time: 1.44x (vs baseline)
- Memory Peak: 357.59 MB
- Memory Avg: 357.59 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 2.91 ms
- Relative Time: 7.54x (vs baseline)
- Memory Peak: 357.60 MB
- Memory Avg: 357.60 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load 🥉

- Import Time: 8.66 ms
- Relative Time: 22.45x (vs baseline)
- Memory Peak: 358.87 MB
- Memory Avg: 358.24 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 25.20 ms
- Relative Time: 65.31x (vs baseline)
- Memory Peak: 359.66 MB
- Memory Avg: 359.27 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### lazy-imports-lite 🥇

**Test:** light_load

- Import Time: 0.80 ms
- Relative Time: 2.07x (vs baseline)
- Memory Peak: 389.69 MB
- Memory Avg: 389.68 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** medium_load

- Import Time: 2.73 ms
- Relative Time: 7.08x (vs baseline)
- Memory Peak: 390.85 MB
- Memory Avg: 390.27 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** heavy_load 🥇

- Import Time: 8.42 ms
- Relative Time: 21.81x (vs baseline)
- Memory Peak: 392.80 MB
- Memory Avg: 391.83 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** enterprise_load

- Import Time: 24.49 ms
- Relative Time: 63.47x (vs baseline)
- Memory Peak: 397.80 MB
- Memory Avg: 395.30 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

##### lazy-loader 🥉

**Test:** light_load 🥉

- Import Time: 0.45 ms
- Relative Time: 1.16x (vs baseline)
- Memory Peak: 357.56 MB
- Memory Avg: 357.56 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** medium_load

- Import Time: 2.90 ms
- Relative Time: 7.51x (vs baseline)
- Memory Peak: 357.56 MB
- Memory Avg: 357.56 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** heavy_load

- Import Time: 8.70 ms
- Relative Time: 22.54x (vs baseline)
- Memory Peak: 357.56 MB
- Memory Avg: 357.56 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** enterprise_load

- Import Time: 24.48 ms
- Relative Time: 63.43x (vs baseline)
- Memory Peak: 357.59 MB
- Memory Avg: 357.57 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

##### lazy_import 🥈

**Test:** light_load

- Import Time: 0.76 ms
- Relative Time: 1.98x (vs baseline)
- Memory Peak: 359.80 MB
- Memory Avg: 359.78 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load 🥈

- Import Time: 2.44 ms
- Relative Time: 6.33x (vs baseline)
- Memory Peak: 360.61 MB
- Memory Avg: 360.21 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 8.67 ms
- Relative Time: 22.47x (vs baseline)
- Memory Peak: 362.12 MB
- Memory Avg: 361.37 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load 🥉

- Import Time: 23.30 ms
- Relative Time: 60.37x (vs baseline)
- Memory Peak: 367.73 MB
- Memory Avg: 364.92 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### pipimport 🥈

**Test:** light_load

- Import Time: 0.74 ms
- Relative Time: 1.92x (vs baseline)
- Memory Peak: 350.74 MB
- Memory Avg: 350.64 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** medium_load 🥉

- Import Time: 2.50 ms
- Relative Time: 6.48x (vs baseline)
- Memory Peak: 351.62 MB
- Memory Avg: 351.18 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** heavy_load

- Import Time: 8.90 ms
- Relative Time: 23.07x (vs baseline)
- Memory Peak: 353.50 MB
- Memory Avg: 352.58 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** enterprise_load 🥈

- Import Time: 23.09 ms
- Relative Time: 59.83x (vs baseline)
- Memory Peak: 357.53 MB
- Memory Avg: 355.60 MB
- Package Size: 0.00 MB
- Features: auto_install

##### pylazyimports

**Test:** light_load

- Import Time: 0.45 ms
- Relative Time: 1.17x (vs baseline)
- Memory Peak: 367.84 MB
- Memory Avg: 367.83 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 2.93 ms
- Relative Time: 7.58x (vs baseline)
- Memory Peak: 368.68 MB
- Memory Avg: 368.26 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 8.71 ms
- Relative Time: 22.57x (vs baseline)
- Memory Peak: 370.52 MB
- Memory Avg: 369.61 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 23.40 ms
- Relative Time: 60.63x (vs baseline)
- Memory Peak: 377.33 MB
- Memory Avg: 373.93 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### xwlazy 🥇

**Test:** light_load

- Import Time: 0.51 ms
- Relative Time: 1.31x (vs baseline)
- Memory Peak: 397.91 MB
- Memory Avg: 397.90 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** medium_load 🥇

- Import Time: 2.41 ms
- Relative Time: 6.25x (vs baseline)
- Memory Peak: 399.28 MB
- Memory Avg: 398.80 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** heavy_load

- Import Time: 9.09 ms
- Relative Time: 23.56x (vs baseline)
- Memory Peak: 401.58 MB
- Memory Avg: 400.69 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** enterprise_load

- Import Time: 27.14 ms
- Relative Time: 70.33x (vs baseline)
- Memory Peak: 403.18 MB
- Memory Avg: 402.52 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring


### Full Features

*All features enabled (xwlazy showcase) - AUTO mode with optimizations*

#### Top 3 Rankings by Load Test

##### Enterprise Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazy-loader | 23.22 | 60.18x |
| 2 🥈 | lazy-imports | 23.55 | 61.03x |
| 3 🥉 | pylazyimports | 23.89 | 61.91x |

##### Heavy Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazy-imports | 7.80 | 20.22x |
| 2 🥈 | lazi | 8.09 | 20.97x |
| 3 🥉 | lazy-loader | 8.21 | 21.27x |

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | pylazyimports | 0.51 | 1.31x |
| 2 🥈 | lazy-loader | 0.53 | 1.37x |
| 3 🥉 | lazy-imports-lite | 0.53 | 1.37x |

##### Medium Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazy_import | 2.52 | 6.54x |
| 2 🥈 | lazy-imports | 2.58 | 6.68x |
| 3 🥉 | deferred-import | 2.60 | 6.75x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| deferred-import | light_load | 0.65 | 1.69x | 447.88 | 0.00 | ✅ |
| deferred-import 🥉 | medium_load | 2.60 | 6.75x | 447.88 | 0.00 | ✅ |
| deferred-import | heavy_load | 8.69 | 22.51x | 447.88 | 0.00 | ✅ |
| deferred-import | enterprise_load | 24.56 | 63.65x | 447.91 | 0.00 | ✅ |
| lazi | light_load | 0.64 | 1.65x | 463.70 | 0.00 | ✅ |
| lazi | medium_load | 2.65 | 6.88x | 465.05 | 0.00 | ✅ |
| lazi 🥈 | heavy_load | 8.09 | 20.97x | 466.47 | 0.00 | ✅ |
| lazi | enterprise_load | 24.84 | 64.36x | 472.90 | 0.00 | ✅ |
| lazy-imports | light_load | 0.63 | 1.64x | 447.92 | 0.00 | ✅ |
| lazy-imports 🥈 | medium_load | 2.58 | 6.68x | 447.93 | 0.00 | ✅ |
| lazy-imports 🥇 | heavy_load | 7.80 | 20.22x | 447.95 | 0.00 | ✅ |
| lazy-imports 🥈 | enterprise_load | 23.55 | 61.03x | 449.11 | 0.00 | ✅ |
| lazy-imports-lite 🥉 | light_load | 0.53 | 1.37x | 473.03 | 0.00 | ✅ |
| lazy-imports-lite | medium_load | 2.89 | 7.49x | 473.98 | 0.00 | ✅ |
| lazy-imports-lite | heavy_load | 8.85 | 22.93x | 475.65 | 0.00 | ✅ |
| lazy-imports-lite | enterprise_load | 25.22 | 65.35x | 482.00 | 0.00 | ✅ |
| lazy-loader 🥈 | light_load | 0.53 | 1.37x | 447.91 | 0.00 | ✅ |
| lazy-loader | medium_load | 3.37 | 8.74x | 447.91 | 0.00 | ✅ |
| lazy-loader 🥉 | heavy_load | 8.21 | 21.27x | 447.91 | 0.00 | ✅ |
| lazy-loader 🥇 | enterprise_load | 23.22 | 60.18x | 447.92 | 0.00 | ✅ |
| lazy_import | light_load | 0.77 | 1.99x | 449.11 | 0.00 | ✅ |
| lazy_import 🥇 | medium_load | 2.52 | 6.54x | 449.11 | 0.00 | ✅ |
| lazy_import | heavy_load | 9.51 | 24.63x | 449.88 | 0.00 | ✅ |
| lazy_import | enterprise_load | 24.62 | 63.80x | 454.02 | 0.00 | ✅ |
| pipimport | light_load | 0.70 | 1.81x | 447.73 | 0.00 | ✅ |
| pipimport | medium_load | 2.78 | 7.21x | 447.73 | 0.00 | ✅ |
| pipimport | heavy_load | 8.67 | 22.46x | 447.74 | 0.00 | ✅ |
| pipimport | enterprise_load | 24.46 | 63.38x | 447.88 | 0.00 | ✅ |
| pylazyimports 🥇 | light_load | 0.51 | 1.31x | 454.11 | 0.00 | ✅ |
| pylazyimports | medium_load | 2.61 | 6.77x | 454.66 | 0.00 | ✅ |
| pylazyimports | heavy_load | 8.52 | 22.07x | 456.75 | 0.00 | ✅ |
| pylazyimports 🥉 | enterprise_load | 23.89 | 61.91x | 463.61 | 0.00 | ✅ |
| xwlazy | light_load | 0.68 | 1.76x | 482.10 | 0.00 | ✅ |
| xwlazy | medium_load | 2.89 | 7.50x | 483.32 | 0.00 | ✅ |
| xwlazy | heavy_load | 8.89 | 23.03x | 484.86 | 0.00 | ✅ |
| xwlazy | enterprise_load | 40.92 | 106.03x | 487.34 | 0.00 | ✅ |

#### Detailed Results

##### deferred-import 🥉

**Test:** light_load

- Import Time: 0.65 ms
- Relative Time: 1.69x (vs baseline)
- Memory Peak: 447.88 MB
- Memory Avg: 447.88 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** medium_load 🥉

- Import Time: 2.60 ms
- Relative Time: 6.75x (vs baseline)
- Memory Peak: 447.88 MB
- Memory Avg: 447.88 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** heavy_load

- Import Time: 8.69 ms
- Relative Time: 22.51x (vs baseline)
- Memory Peak: 447.88 MB
- Memory Avg: 447.88 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** enterprise_load

- Import Time: 24.56 ms
- Relative Time: 63.65x (vs baseline)
- Memory Peak: 447.91 MB
- Memory Avg: 447.90 MB
- Package Size: 0.00 MB
- Features: deferred_loading

##### lazi 🥈

**Test:** light_load

- Import Time: 0.64 ms
- Relative Time: 1.65x (vs baseline)
- Memory Peak: 463.70 MB
- Memory Avg: 463.69 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** medium_load

- Import Time: 2.65 ms
- Relative Time: 6.88x (vs baseline)
- Memory Peak: 465.05 MB
- Memory Avg: 464.38 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** heavy_load 🥈

- Import Time: 8.09 ms
- Relative Time: 20.97x (vs baseline)
- Memory Peak: 466.47 MB
- Memory Avg: 465.77 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** enterprise_load

- Import Time: 24.84 ms
- Relative Time: 64.36x (vs baseline)
- Memory Peak: 472.90 MB
- Memory Avg: 469.70 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

##### lazy-imports 🥇

**Test:** light_load

- Import Time: 0.63 ms
- Relative Time: 1.64x (vs baseline)
- Memory Peak: 447.92 MB
- Memory Avg: 447.92 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load 🥈

- Import Time: 2.58 ms
- Relative Time: 6.68x (vs baseline)
- Memory Peak: 447.93 MB
- Memory Avg: 447.92 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load 🥇

- Import Time: 7.80 ms
- Relative Time: 20.22x (vs baseline)
- Memory Peak: 447.95 MB
- Memory Avg: 447.94 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load 🥈

- Import Time: 23.55 ms
- Relative Time: 61.03x (vs baseline)
- Memory Peak: 449.11 MB
- Memory Avg: 448.53 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### lazy-imports-lite 🥉

**Test:** light_load 🥉

- Import Time: 0.53 ms
- Relative Time: 1.37x (vs baseline)
- Memory Peak: 473.03 MB
- Memory Avg: 473.02 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** medium_load

- Import Time: 2.89 ms
- Relative Time: 7.49x (vs baseline)
- Memory Peak: 473.98 MB
- Memory Avg: 473.51 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** heavy_load

- Import Time: 8.85 ms
- Relative Time: 22.93x (vs baseline)
- Memory Peak: 475.65 MB
- Memory Avg: 474.81 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** enterprise_load

- Import Time: 25.22 ms
- Relative Time: 65.35x (vs baseline)
- Memory Peak: 482.00 MB
- Memory Avg: 478.83 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

##### lazy-loader 🥇

**Test:** light_load 🥈

- Import Time: 0.53 ms
- Relative Time: 1.37x (vs baseline)
- Memory Peak: 447.91 MB
- Memory Avg: 447.91 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** medium_load

- Import Time: 3.37 ms
- Relative Time: 8.74x (vs baseline)
- Memory Peak: 447.91 MB
- Memory Avg: 447.91 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** heavy_load 🥉

- Import Time: 8.21 ms
- Relative Time: 21.27x (vs baseline)
- Memory Peak: 447.91 MB
- Memory Avg: 447.91 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** enterprise_load 🥇

- Import Time: 23.22 ms
- Relative Time: 60.18x (vs baseline)
- Memory Peak: 447.92 MB
- Memory Avg: 447.92 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

##### lazy_import 🥇

**Test:** light_load

- Import Time: 0.77 ms
- Relative Time: 1.99x (vs baseline)
- Memory Peak: 449.11 MB
- Memory Avg: 449.11 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load 🥇

- Import Time: 2.52 ms
- Relative Time: 6.54x (vs baseline)
- Memory Peak: 449.11 MB
- Memory Avg: 449.11 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 9.51 ms
- Relative Time: 24.63x (vs baseline)
- Memory Peak: 449.88 MB
- Memory Avg: 449.49 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 24.62 ms
- Relative Time: 63.80x (vs baseline)
- Memory Peak: 454.02 MB
- Memory Avg: 451.95 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### pipimport

**Test:** light_load

- Import Time: 0.70 ms
- Relative Time: 1.81x (vs baseline)
- Memory Peak: 447.73 MB
- Memory Avg: 447.72 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** medium_load

- Import Time: 2.78 ms
- Relative Time: 7.21x (vs baseline)
- Memory Peak: 447.73 MB
- Memory Avg: 447.73 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** heavy_load

- Import Time: 8.67 ms
- Relative Time: 22.46x (vs baseline)
- Memory Peak: 447.74 MB
- Memory Avg: 447.73 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** enterprise_load

- Import Time: 24.46 ms
- Relative Time: 63.38x (vs baseline)
- Memory Peak: 447.88 MB
- Memory Avg: 447.81 MB
- Package Size: 0.00 MB
- Features: auto_install

##### pylazyimports 🥇

**Test:** light_load 🥇

- Import Time: 0.51 ms
- Relative Time: 1.31x (vs baseline)
- Memory Peak: 454.11 MB
- Memory Avg: 454.10 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 2.61 ms
- Relative Time: 6.77x (vs baseline)
- Memory Peak: 454.66 MB
- Memory Avg: 454.39 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 8.52 ms
- Relative Time: 22.07x (vs baseline)
- Memory Peak: 456.75 MB
- Memory Avg: 455.71 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load 🥉

- Import Time: 23.89 ms
- Relative Time: 61.91x (vs baseline)
- Memory Peak: 463.61 MB
- Memory Avg: 460.18 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### xwlazy

**Test:** light_load

- Import Time: 0.68 ms
- Relative Time: 1.76x (vs baseline)
- Memory Peak: 482.10 MB
- Memory Avg: 482.09 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** medium_load

- Import Time: 2.89 ms
- Relative Time: 7.50x (vs baseline)
- Memory Peak: 483.32 MB
- Memory Avg: 483.10 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** heavy_load

- Import Time: 8.89 ms
- Relative Time: 23.03x (vs baseline)
- Memory Peak: 484.86 MB
- Memory Avg: 484.25 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** enterprise_load

- Import Time: 40.92 ms
- Relative Time: 106.03x (vs baseline)
- Memory Peak: 487.34 MB
- Memory Avg: 486.21 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring


### Full Install Mode

*Install all dependencies on start - FULL mode*

#### Top 3 Rankings by Load Test

##### Enterprise Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | deferred-import | 23.14 | 59.96x |
| 2 🥈 | pylazyimports | 23.15 | 59.99x |
| 3 🥉 | pipimport | 23.33 | 60.46x |

##### Heavy Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | pipimport | 7.41 | 19.20x |
| 2 🥈 | lazy_import | 8.02 | 20.78x |
| 3 🥉 | lazi | 8.36 | 21.66x |

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazi | 0.27 | 0.71x |
| 2 🥈 | pylazyimports | 0.49 | 1.27x |
| 3 🥉 | deferred-import | 0.49 | 1.27x |

##### Medium Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | pipimport | 2.62 | 6.80x |
| 2 🥈 | xwlazy | 2.75 | 7.13x |
| 3 🥉 | lazy-imports | 2.80 | 7.26x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| deferred-import 🥉 | light_load | 0.49 | 1.27x | 294.48 | 0.00 | ✅ |
| deferred-import | medium_load | 2.82 | 7.31x | 295.66 | 0.00 | ✅ |
| deferred-import | heavy_load | 8.98 | 23.26x | 297.38 | 0.00 | ✅ |
| deferred-import 🥇 | enterprise_load | 23.14 | 59.96x | 302.99 | 0.00 | ✅ |
| lazi 🥇 | light_load | 0.27 | 0.71x | 318.86 | 0.00 | ✅ |
| lazi | medium_load | 2.85 | 7.39x | 320.81 | 0.00 | ✅ |
| lazi 🥉 | heavy_load | 8.36 | 21.66x | 322.92 | 0.00 | ✅ |
| lazi | enterprise_load | 23.49 | 60.88x | 328.66 | 0.00 | ✅ |
| lazy-imports | light_load | 0.67 | 1.74x | 313.75 | 0.00 | ✅ |
| lazy-imports 🥉 | medium_load | 2.80 | 7.26x | 315.05 | 0.00 | ✅ |
| lazy-imports | heavy_load | 8.95 | 23.20x | 316.35 | 0.00 | ✅ |
| lazy-imports | enterprise_load | 25.42 | 65.88x | 316.52 | 0.00 | ✅ |
| lazy-imports-lite | light_load | 0.51 | 1.33x | 328.74 | 0.00 | ✅ |
| lazy-imports-lite | medium_load | 2.86 | 7.41x | 329.46 | 0.00 | ✅ |
| lazy-imports-lite | heavy_load | 10.15 | 26.31x | 331.66 | 0.00 | ✅ |
| lazy-imports-lite | enterprise_load | 29.62 | 76.75x | 338.54 | 0.00 | ✅ |
| lazy-loader | light_load | 0.55 | 1.41x | 303.09 | 0.00 | ✅ |
| lazy-loader | medium_load | 3.34 | 8.66x | 303.96 | 0.00 | ✅ |
| lazy-loader | heavy_load | 9.05 | 23.44x | 306.11 | 0.00 | ✅ |
| lazy-loader | enterprise_load | 25.29 | 65.54x | 313.64 | 0.00 | ✅ |
| lazy_import | light_load | 0.68 | 1.77x | 316.52 | 0.00 | ✅ |
| lazy_import | medium_load | 2.87 | 7.45x | 316.52 | 0.00 | ✅ |
| lazy_import 🥈 | heavy_load | 8.02 | 20.78x | 316.52 | 0.00 | ✅ |
| lazy_import | enterprise_load | 23.40 | 60.64x | 316.54 | 0.00 | ✅ |
| pipimport | light_load | 0.61 | 1.59x | 286.82 | 0.00 | ✅ |
| pipimport 🥇 | medium_load | 2.62 | 6.80x | 287.73 | 0.00 | ✅ |
| pipimport 🥇 | heavy_load | 7.41 | 19.20x | 289.31 | 0.00 | ✅ |
| pipimport 🥉 | enterprise_load | 23.33 | 60.46x | 294.21 | 0.00 | ✅ |
| pylazyimports 🥈 | light_load | 0.49 | 1.27x | 316.54 | 0.00 | ✅ |
| pylazyimports | medium_load | 2.89 | 7.48x | 316.54 | 0.00 | ✅ |
| pylazyimports | heavy_load | 10.05 | 26.03x | 316.55 | 0.00 | ✅ |
| pylazyimports 🥈 | enterprise_load | 23.15 | 59.99x | 318.79 | 0.00 | ✅ |
| xwlazy | light_load | 0.64 | 1.65x | 338.68 | 0.00 | ✅ |
| xwlazy 🥈 | medium_load | 2.75 | 7.13x | 340.31 | 0.00 | ✅ |
| xwlazy | heavy_load | 8.56 | 22.18x | 342.12 | 0.00 | ✅ |
| xwlazy | enterprise_load | 29.93 | 77.57x | 349.82 | 0.00 | ✅ |

#### Detailed Results

##### deferred-import 🥇

**Test:** light_load 🥉

- Import Time: 0.49 ms
- Relative Time: 1.27x (vs baseline)
- Memory Peak: 294.48 MB
- Memory Avg: 294.47 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** medium_load

- Import Time: 2.82 ms
- Relative Time: 7.31x (vs baseline)
- Memory Peak: 295.66 MB
- Memory Avg: 295.07 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** heavy_load

- Import Time: 8.98 ms
- Relative Time: 23.26x (vs baseline)
- Memory Peak: 297.38 MB
- Memory Avg: 296.52 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** enterprise_load 🥇

- Import Time: 23.14 ms
- Relative Time: 59.96x (vs baseline)
- Memory Peak: 302.99 MB
- Memory Avg: 300.19 MB
- Package Size: 0.00 MB
- Features: deferred_loading

##### lazi 🥇

**Test:** light_load 🥇

- Import Time: 0.27 ms
- Relative Time: 0.71x (vs baseline)
- Memory Peak: 318.86 MB
- Memory Avg: 318.86 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** medium_load

- Import Time: 2.85 ms
- Relative Time: 7.39x (vs baseline)
- Memory Peak: 320.81 MB
- Memory Avg: 319.84 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** heavy_load 🥉

- Import Time: 8.36 ms
- Relative Time: 21.66x (vs baseline)
- Memory Peak: 322.92 MB
- Memory Avg: 321.87 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** enterprise_load

- Import Time: 23.49 ms
- Relative Time: 60.88x (vs baseline)
- Memory Peak: 328.66 MB
- Memory Avg: 325.79 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

##### lazy-imports 🥉

**Test:** light_load

- Import Time: 0.67 ms
- Relative Time: 1.74x (vs baseline)
- Memory Peak: 313.75 MB
- Memory Avg: 313.74 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load 🥉

- Import Time: 2.80 ms
- Relative Time: 7.26x (vs baseline)
- Memory Peak: 315.05 MB
- Memory Avg: 314.41 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 8.95 ms
- Relative Time: 23.20x (vs baseline)
- Memory Peak: 316.35 MB
- Memory Avg: 315.72 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 25.42 ms
- Relative Time: 65.88x (vs baseline)
- Memory Peak: 316.52 MB
- Memory Avg: 316.46 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### lazy-imports-lite

**Test:** light_load

- Import Time: 0.51 ms
- Relative Time: 1.33x (vs baseline)
- Memory Peak: 328.74 MB
- Memory Avg: 328.73 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** medium_load

- Import Time: 2.86 ms
- Relative Time: 7.41x (vs baseline)
- Memory Peak: 329.46 MB
- Memory Avg: 329.10 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** heavy_load

- Import Time: 10.15 ms
- Relative Time: 26.31x (vs baseline)
- Memory Peak: 331.66 MB
- Memory Avg: 330.57 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** enterprise_load

- Import Time: 29.62 ms
- Relative Time: 76.75x (vs baseline)
- Memory Peak: 338.54 MB
- Memory Avg: 335.10 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

##### lazy-loader

**Test:** light_load

- Import Time: 0.55 ms
- Relative Time: 1.41x (vs baseline)
- Memory Peak: 303.09 MB
- Memory Avg: 303.07 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** medium_load

- Import Time: 3.34 ms
- Relative Time: 8.66x (vs baseline)
- Memory Peak: 303.96 MB
- Memory Avg: 303.54 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** heavy_load

- Import Time: 9.05 ms
- Relative Time: 23.44x (vs baseline)
- Memory Peak: 306.11 MB
- Memory Avg: 305.04 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** enterprise_load

- Import Time: 25.29 ms
- Relative Time: 65.54x (vs baseline)
- Memory Peak: 313.64 MB
- Memory Avg: 309.88 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

##### lazy_import 🥈

**Test:** light_load

- Import Time: 0.68 ms
- Relative Time: 1.77x (vs baseline)
- Memory Peak: 316.52 MB
- Memory Avg: 316.52 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 2.87 ms
- Relative Time: 7.45x (vs baseline)
- Memory Peak: 316.52 MB
- Memory Avg: 316.52 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load 🥈

- Import Time: 8.02 ms
- Relative Time: 20.78x (vs baseline)
- Memory Peak: 316.52 MB
- Memory Avg: 316.52 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 23.40 ms
- Relative Time: 60.64x (vs baseline)
- Memory Peak: 316.54 MB
- Memory Avg: 316.53 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### pipimport 🥇

**Test:** light_load

- Import Time: 0.61 ms
- Relative Time: 1.59x (vs baseline)
- Memory Peak: 286.82 MB
- Memory Avg: 286.81 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** medium_load 🥇

- Import Time: 2.62 ms
- Relative Time: 6.80x (vs baseline)
- Memory Peak: 287.73 MB
- Memory Avg: 287.28 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** heavy_load 🥇

- Import Time: 7.41 ms
- Relative Time: 19.20x (vs baseline)
- Memory Peak: 289.31 MB
- Memory Avg: 288.54 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** enterprise_load 🥉

- Import Time: 23.33 ms
- Relative Time: 60.46x (vs baseline)
- Memory Peak: 294.21 MB
- Memory Avg: 291.83 MB
- Package Size: 0.00 MB
- Features: auto_install

##### pylazyimports 🥈

**Test:** light_load 🥈

- Import Time: 0.49 ms
- Relative Time: 1.27x (vs baseline)
- Memory Peak: 316.54 MB
- Memory Avg: 316.54 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 2.89 ms
- Relative Time: 7.48x (vs baseline)
- Memory Peak: 316.54 MB
- Memory Avg: 316.54 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 10.05 ms
- Relative Time: 26.03x (vs baseline)
- Memory Peak: 316.55 MB
- Memory Avg: 316.54 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load 🥈

- Import Time: 23.15 ms
- Relative Time: 59.99x (vs baseline)
- Memory Peak: 318.79 MB
- Memory Avg: 317.67 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### xwlazy 🥈

**Test:** light_load

- Import Time: 0.64 ms
- Relative Time: 1.65x (vs baseline)
- Memory Peak: 338.68 MB
- Memory Avg: 338.67 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** medium_load 🥈

- Import Time: 2.75 ms
- Relative Time: 7.13x (vs baseline)
- Memory Peak: 340.31 MB
- Memory Avg: 339.86 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** heavy_load

- Import Time: 8.56 ms
- Relative Time: 22.18x (vs baseline)
- Memory Peak: 342.12 MB
- Memory Avg: 341.56 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** enterprise_load

- Import Time: 29.93 ms
- Relative Time: 77.57x (vs baseline)
- Memory Peak: 349.82 MB
- Memory Avg: 346.21 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring


### Background Loading

*Background loading - BACKGROUND mode*

#### Top 3 Rankings by Load Test

##### Enterprise Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazi | 22.29 | 57.75x |
| 2 🥈 | deferred-import | 22.72 | 58.86x |
| 3 🥉 | lazy_import | 22.94 | 59.44x |

##### Heavy Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazi | 7.86 | 20.37x |
| 2 🥈 | pylazyimports | 8.08 | 20.94x |
| 3 🥉 | lazy-imports-lite | 8.18 | 21.19x |

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazi | 0.35 | 0.91x |
| 2 🥈 | lazy-loader | 0.43 | 1.11x |
| 3 🥉 | lazy-imports-lite | 0.45 | 1.15x |

##### Medium Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 2.28 | 5.90x |
| 2 🥈 | lazy-imports-lite | 2.40 | 6.21x |
| 3 🥉 | pipimport | 2.40 | 6.23x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| deferred-import | light_load | 0.45 | 1.16x | 238.80 | 0.00 | ✅ |
| deferred-import | medium_load | 2.90 | 7.52x | 240.12 | 0.00 | ✅ |
| deferred-import | heavy_load | 8.19 | 21.22x | 241.94 | 0.00 | ✅ |
| deferred-import 🥈 | enterprise_load | 22.72 | 58.86x | 242.82 | 0.00 | ✅ |
| lazi 🥇 | light_load | 0.35 | 0.91x | 272.32 | 0.00 | ✅ |
| lazi | medium_load | 2.70 | 7.00x | 273.83 | 0.00 | ✅ |
| lazi 🥇 | heavy_load | 7.86 | 20.37x | 275.86 | 0.00 | ✅ |
| lazi 🥇 | enterprise_load | 22.29 | 57.75x | 277.08 | 0.00 | ✅ |
| lazy-imports | light_load | 0.47 | 1.21x | 243.39 | 0.00 | ✅ |
| lazy-imports | medium_load | 2.96 | 7.67x | 244.31 | 0.00 | ✅ |
| lazy-imports | heavy_load | 8.77 | 22.73x | 246.75 | 0.00 | ✅ |
| lazy-imports | enterprise_load | 23.11 | 59.88x | 252.71 | 0.00 | ✅ |
| lazy-imports-lite 🥉 | light_load | 0.45 | 1.15x | 277.08 | 0.00 | ✅ |
| lazy-imports-lite 🥈 | medium_load | 2.40 | 6.21x | 277.08 | 0.00 | ✅ |
| lazy-imports-lite 🥉 | heavy_load | 8.18 | 21.19x | 277.08 | 0.00 | ✅ |
| lazy-imports-lite | enterprise_load | 23.47 | 60.82x | 277.37 | 0.00 | ✅ |
| lazy-loader 🥈 | light_load | 0.43 | 1.11x | 242.82 | 0.00 | ✅ |
| lazy-loader | medium_load | 2.63 | 6.82x | 242.82 | 0.00 | ✅ |
| lazy-loader | heavy_load | 9.02 | 23.36x | 242.82 | 0.00 | ✅ |
| lazy-loader | enterprise_load | 24.14 | 62.56x | 243.39 | 0.00 | ✅ |
| lazy_import | light_load | 0.82 | 2.11x | 252.87 | 0.00 | ✅ |
| lazy_import | medium_load | 2.51 | 6.50x | 253.75 | 0.00 | ✅ |
| lazy_import | heavy_load | 8.46 | 21.92x | 255.96 | 0.00 | ✅ |
| lazy_import 🥉 | enterprise_load | 22.94 | 59.44x | 261.49 | 0.00 | ✅ |
| pipimport | light_load | 0.65 | 1.67x | 229.11 | 0.00 | ✅ |
| pipimport 🥉 | medium_load | 2.40 | 6.23x | 229.72 | 0.00 | ✅ |
| pipimport | heavy_load | 8.85 | 22.93x | 231.29 | 0.00 | ✅ |
| pipimport | enterprise_load | 23.14 | 59.95x | 238.70 | 0.00 | ✅ |
| pylazyimports | light_load | 0.45 | 1.16x | 261.58 | 0.00 | ✅ |
| pylazyimports | medium_load | 2.59 | 6.71x | 262.53 | 0.00 | ✅ |
| pylazyimports 🥈 | heavy_load | 8.08 | 20.94x | 264.79 | 0.00 | ✅ |
| pylazyimports | enterprise_load | 23.47 | 60.83x | 272.00 | 0.00 | ✅ |
| xwlazy | light_load | 1.12 | 2.91x | 277.39 | 0.00 | ✅ |
| xwlazy 🥇 | medium_load | 2.28 | 5.90x | 277.63 | 0.00 | ✅ |
| xwlazy | heavy_load | 8.82 | 22.84x | 278.46 | 0.00 | ✅ |
| xwlazy | enterprise_load | 25.12 | 65.10x | 286.26 | 0.00 | ✅ |

#### Detailed Results

##### deferred-import 🥈

**Test:** light_load

- Import Time: 0.45 ms
- Relative Time: 1.16x (vs baseline)
- Memory Peak: 238.80 MB
- Memory Avg: 238.79 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** medium_load

- Import Time: 2.90 ms
- Relative Time: 7.52x (vs baseline)
- Memory Peak: 240.12 MB
- Memory Avg: 239.46 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** heavy_load

- Import Time: 8.19 ms
- Relative Time: 21.22x (vs baseline)
- Memory Peak: 241.94 MB
- Memory Avg: 241.03 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** enterprise_load 🥈

- Import Time: 22.72 ms
- Relative Time: 58.86x (vs baseline)
- Memory Peak: 242.82 MB
- Memory Avg: 242.38 MB
- Package Size: 0.00 MB
- Features: deferred_loading

##### lazi 🥇

**Test:** light_load 🥇

- Import Time: 0.35 ms
- Relative Time: 0.91x (vs baseline)
- Memory Peak: 272.32 MB
- Memory Avg: 272.31 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** medium_load

- Import Time: 2.70 ms
- Relative Time: 7.00x (vs baseline)
- Memory Peak: 273.83 MB
- Memory Avg: 273.08 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** heavy_load 🥇

- Import Time: 7.86 ms
- Relative Time: 20.37x (vs baseline)
- Memory Peak: 275.86 MB
- Memory Avg: 274.85 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** enterprise_load 🥇

- Import Time: 22.29 ms
- Relative Time: 57.75x (vs baseline)
- Memory Peak: 277.08 MB
- Memory Avg: 276.52 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

##### lazy-imports

**Test:** light_load

- Import Time: 0.47 ms
- Relative Time: 1.21x (vs baseline)
- Memory Peak: 243.39 MB
- Memory Avg: 243.39 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 2.96 ms
- Relative Time: 7.67x (vs baseline)
- Memory Peak: 244.31 MB
- Memory Avg: 243.86 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 8.77 ms
- Relative Time: 22.73x (vs baseline)
- Memory Peak: 246.75 MB
- Memory Avg: 245.56 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 23.11 ms
- Relative Time: 59.88x (vs baseline)
- Memory Peak: 252.71 MB
- Memory Avg: 249.83 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### lazy-imports-lite 🥈

**Test:** light_load 🥉

- Import Time: 0.45 ms
- Relative Time: 1.15x (vs baseline)
- Memory Peak: 277.08 MB
- Memory Avg: 277.08 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** medium_load 🥈

- Import Time: 2.40 ms
- Relative Time: 6.21x (vs baseline)
- Memory Peak: 277.08 MB
- Memory Avg: 277.08 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** heavy_load 🥉

- Import Time: 8.18 ms
- Relative Time: 21.19x (vs baseline)
- Memory Peak: 277.08 MB
- Memory Avg: 277.08 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** enterprise_load

- Import Time: 23.47 ms
- Relative Time: 60.82x (vs baseline)
- Memory Peak: 277.37 MB
- Memory Avg: 277.22 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

##### lazy-loader 🥈

**Test:** light_load 🥈

- Import Time: 0.43 ms
- Relative Time: 1.11x (vs baseline)
- Memory Peak: 242.82 MB
- Memory Avg: 242.82 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** medium_load

- Import Time: 2.63 ms
- Relative Time: 6.82x (vs baseline)
- Memory Peak: 242.82 MB
- Memory Avg: 242.82 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** heavy_load

- Import Time: 9.02 ms
- Relative Time: 23.36x (vs baseline)
- Memory Peak: 242.82 MB
- Memory Avg: 242.82 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** enterprise_load

- Import Time: 24.14 ms
- Relative Time: 62.56x (vs baseline)
- Memory Peak: 243.39 MB
- Memory Avg: 243.10 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

##### lazy_import 🥉

**Test:** light_load

- Import Time: 0.82 ms
- Relative Time: 2.11x (vs baseline)
- Memory Peak: 252.87 MB
- Memory Avg: 252.84 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 2.51 ms
- Relative Time: 6.50x (vs baseline)
- Memory Peak: 253.75 MB
- Memory Avg: 253.31 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 8.46 ms
- Relative Time: 21.92x (vs baseline)
- Memory Peak: 255.96 MB
- Memory Avg: 254.85 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load 🥉

- Import Time: 22.94 ms
- Relative Time: 59.44x (vs baseline)
- Memory Peak: 261.49 MB
- Memory Avg: 258.72 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### pipimport 🥉

**Test:** light_load

- Import Time: 0.65 ms
- Relative Time: 1.67x (vs baseline)
- Memory Peak: 229.11 MB
- Memory Avg: 229.09 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** medium_load 🥉

- Import Time: 2.40 ms
- Relative Time: 6.23x (vs baseline)
- Memory Peak: 229.72 MB
- Memory Avg: 229.42 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** heavy_load

- Import Time: 8.85 ms
- Relative Time: 22.93x (vs baseline)
- Memory Peak: 231.29 MB
- Memory Avg: 230.52 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** enterprise_load

- Import Time: 23.14 ms
- Relative Time: 59.95x (vs baseline)
- Memory Peak: 238.70 MB
- Memory Avg: 235.07 MB
- Package Size: 0.00 MB
- Features: auto_install

##### pylazyimports 🥈

**Test:** light_load

- Import Time: 0.45 ms
- Relative Time: 1.16x (vs baseline)
- Memory Peak: 261.58 MB
- Memory Avg: 261.57 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 2.59 ms
- Relative Time: 6.71x (vs baseline)
- Memory Peak: 262.53 MB
- Memory Avg: 262.06 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load 🥈

- Import Time: 8.08 ms
- Relative Time: 20.94x (vs baseline)
- Memory Peak: 264.79 MB
- Memory Avg: 263.66 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 23.47 ms
- Relative Time: 60.83x (vs baseline)
- Memory Peak: 272.00 MB
- Memory Avg: 268.40 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### xwlazy 🥇

**Test:** light_load

- Import Time: 1.12 ms
- Relative Time: 2.91x (vs baseline)
- Memory Peak: 277.39 MB
- Memory Avg: 277.39 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** medium_load 🥇

- Import Time: 2.28 ms
- Relative Time: 5.90x (vs baseline)
- Memory Peak: 277.63 MB
- Memory Avg: 277.60 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** heavy_load

- Import Time: 8.82 ms
- Relative Time: 22.84x (vs baseline)
- Memory Peak: 278.46 MB
- Memory Avg: 278.09 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** enterprise_load

- Import Time: 25.12 ms
- Relative Time: 65.10x (vs baseline)
- Memory Peak: 286.26 MB
- Memory Avg: 282.48 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring


### Lazy Import + Install

*Lazy import + auto-install - SMART mode (on-demand)*

#### Top 3 Rankings by Load Test

##### Enterprise Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | pipimport | 22.39 | 58.01x |
| 2 🥈 | deferred-import | 23.04 | 59.70x |
| 3 🥉 | xwlazy | 23.05 | 59.74x |

##### Heavy Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | deferred-import | 8.17 | 21.16x |
| 2 🥈 | xwlazy | 8.21 | 21.26x |
| 3 🥉 | lazy-imports-lite | 8.40 | 21.77x |

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 0.43 | 1.11x |
| 2 🥈 | pylazyimports | 0.44 | 1.15x |
| 3 🥉 | lazy-imports-lite | 0.44 | 1.15x |

##### Medium Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | pipimport | 2.31 | 5.98x |
| 2 🥈 | lazy-imports-lite | 2.51 | 6.50x |
| 3 🥉 | pylazyimports | 2.57 | 6.65x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| deferred-import | light_load | 0.67 | 1.72x | 109.20 | 0.00 | ✅ |
| deferred-import | medium_load | 3.77 | 9.77x | 109.24 | 0.00 | ✅ |
| deferred-import 🥇 | heavy_load | 8.17 | 21.16x | 110.83 | 0.00 | ✅ |
| deferred-import 🥈 | enterprise_load | 23.04 | 59.70x | 118.00 | 0.00 | ✅ |
| lazi | light_load | 0.54 | 1.39x | 141.93 | 0.00 | ✅ |
| lazi | medium_load | 3.13 | 8.11x | 142.12 | 0.00 | ✅ |
| lazi | heavy_load | 9.63 | 24.95x | 144.06 | 0.00 | ✅ |
| lazi | enterprise_load | 25.16 | 65.19x | 151.08 | 0.00 | ✅ |
| lazy-imports | light_load | 0.48 | 1.25x | 124.84 | 0.00 | ✅ |
| lazy-imports | medium_load | 2.81 | 7.29x | 124.85 | 0.00 | ✅ |
| lazy-imports | heavy_load | 9.85 | 25.53x | 124.86 | 0.00 | ✅ |
| lazy-imports | enterprise_load | 23.26 | 60.28x | 127.68 | 0.00 | ✅ |
| lazy-imports-lite 🥉 | light_load | 0.44 | 1.15x | 151.25 | 0.00 | ✅ |
| lazy-imports-lite 🥈 | medium_load | 2.51 | 6.50x | 152.63 | 0.00 | ✅ |
| lazy-imports-lite 🥉 | heavy_load | 8.40 | 21.77x | 154.44 | 0.00 | ✅ |
| lazy-imports-lite | enterprise_load | 23.95 | 62.07x | 160.50 | 0.00 | ✅ |
| lazy-loader | light_load | 0.45 | 1.16x | 118.09 | 0.00 | ✅ |
| lazy-loader | medium_load | 3.02 | 7.82x | 119.84 | 0.00 | ✅ |
| lazy-loader | heavy_load | 8.47 | 21.94x | 121.43 | 0.00 | ✅ |
| lazy-loader | enterprise_load | 26.79 | 69.42x | 124.84 | 0.00 | ✅ |
| lazy_import | light_load | 0.63 | 1.64x | 127.84 | 0.00 | ✅ |
| lazy_import | medium_load | 4.32 | 11.19x | 128.97 | 0.00 | ✅ |
| lazy_import | heavy_load | 10.89 | 28.23x | 130.48 | 0.00 | ✅ |
| lazy_import | enterprise_load | 24.95 | 64.66x | 139.23 | 0.00 | ✅ |
| pipimport | light_load | 0.67 | 1.73x | 106.93 | 0.00 | ✅ |
| pipimport 🥇 | medium_load | 2.31 | 5.98x | 107.83 | 0.00 | ✅ |
| pipimport | heavy_load | 8.95 | 23.18x | 108.55 | 0.00 | ✅ |
| pipimport 🥇 | enterprise_load | 22.39 | 58.01x | 109.04 | 0.00 | ✅ |
| pylazyimports 🥈 | light_load | 0.44 | 1.15x | 139.33 | 0.00 | ✅ |
| pylazyimports 🥉 | medium_load | 2.57 | 6.65x | 140.44 | 0.00 | ✅ |
| pylazyimports | heavy_load | 8.53 | 22.10x | 141.20 | 0.00 | ✅ |
| pylazyimports | enterprise_load | 24.31 | 62.99x | 141.93 | 0.00 | ✅ |
| xwlazy 🥇 | light_load | 0.43 | 1.11x | 160.53 | 0.00 | ✅ |
| xwlazy | medium_load | 3.48 | 9.01x | 160.70 | 0.00 | ✅ |
| xwlazy 🥈 | heavy_load | 8.21 | 21.26x | 160.79 | 0.00 | ✅ |
| xwlazy 🥉 | enterprise_load | 23.05 | 59.74x | 161.39 | 0.00 | ✅ |

#### Detailed Results

##### deferred-import 🥇

**Test:** light_load

- Import Time: 0.67 ms
- Relative Time: 1.72x (vs baseline)
- Memory Peak: 109.20 MB
- Memory Avg: 109.20 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** medium_load

- Import Time: 3.77 ms
- Relative Time: 9.77x (vs baseline)
- Memory Peak: 109.24 MB
- Memory Avg: 109.22 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** heavy_load 🥇

- Import Time: 8.17 ms
- Relative Time: 21.16x (vs baseline)
- Memory Peak: 110.83 MB
- Memory Avg: 110.04 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** enterprise_load 🥈

- Import Time: 23.04 ms
- Relative Time: 59.70x (vs baseline)
- Memory Peak: 118.00 MB
- Memory Avg: 114.41 MB
- Package Size: 0.00 MB
- Features: deferred_loading

##### lazi

**Test:** light_load

- Import Time: 0.54 ms
- Relative Time: 1.39x (vs baseline)
- Memory Peak: 141.93 MB
- Memory Avg: 141.93 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** medium_load

- Import Time: 3.13 ms
- Relative Time: 8.11x (vs baseline)
- Memory Peak: 142.12 MB
- Memory Avg: 142.02 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** heavy_load

- Import Time: 9.63 ms
- Relative Time: 24.95x (vs baseline)
- Memory Peak: 144.06 MB
- Memory Avg: 143.10 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** enterprise_load

- Import Time: 25.16 ms
- Relative Time: 65.19x (vs baseline)
- Memory Peak: 151.08 MB
- Memory Avg: 147.57 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

##### lazy-imports

**Test:** light_load

- Import Time: 0.48 ms
- Relative Time: 1.25x (vs baseline)
- Memory Peak: 124.84 MB
- Memory Avg: 124.84 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 2.81 ms
- Relative Time: 7.29x (vs baseline)
- Memory Peak: 124.85 MB
- Memory Avg: 124.85 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 9.85 ms
- Relative Time: 25.53x (vs baseline)
- Memory Peak: 124.86 MB
- Memory Avg: 124.86 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 23.26 ms
- Relative Time: 60.28x (vs baseline)
- Memory Peak: 127.68 MB
- Memory Avg: 126.27 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### lazy-imports-lite 🥈

**Test:** light_load 🥉

- Import Time: 0.44 ms
- Relative Time: 1.15x (vs baseline)
- Memory Peak: 151.25 MB
- Memory Avg: 151.25 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** medium_load 🥈

- Import Time: 2.51 ms
- Relative Time: 6.50x (vs baseline)
- Memory Peak: 152.63 MB
- Memory Avg: 151.94 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** heavy_load 🥉

- Import Time: 8.40 ms
- Relative Time: 21.77x (vs baseline)
- Memory Peak: 154.44 MB
- Memory Avg: 153.54 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** enterprise_load

- Import Time: 23.95 ms
- Relative Time: 62.07x (vs baseline)
- Memory Peak: 160.50 MB
- Memory Avg: 157.47 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

##### lazy-loader

**Test:** light_load

- Import Time: 0.45 ms
- Relative Time: 1.16x (vs baseline)
- Memory Peak: 118.09 MB
- Memory Avg: 118.08 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** medium_load

- Import Time: 3.02 ms
- Relative Time: 7.82x (vs baseline)
- Memory Peak: 119.84 MB
- Memory Avg: 118.97 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** heavy_load

- Import Time: 8.47 ms
- Relative Time: 21.94x (vs baseline)
- Memory Peak: 121.43 MB
- Memory Avg: 120.64 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** enterprise_load

- Import Time: 26.79 ms
- Relative Time: 69.42x (vs baseline)
- Memory Peak: 124.84 MB
- Memory Avg: 123.14 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

##### lazy_import

**Test:** light_load

- Import Time: 0.63 ms
- Relative Time: 1.64x (vs baseline)
- Memory Peak: 127.84 MB
- Memory Avg: 127.82 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 4.32 ms
- Relative Time: 11.19x (vs baseline)
- Memory Peak: 128.97 MB
- Memory Avg: 128.42 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 10.89 ms
- Relative Time: 28.23x (vs baseline)
- Memory Peak: 130.48 MB
- Memory Avg: 129.74 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 24.95 ms
- Relative Time: 64.66x (vs baseline)
- Memory Peak: 139.23 MB
- Memory Avg: 134.86 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### pipimport 🥇

**Test:** light_load

- Import Time: 0.67 ms
- Relative Time: 1.73x (vs baseline)
- Memory Peak: 106.93 MB
- Memory Avg: 106.88 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** medium_load 🥇

- Import Time: 2.31 ms
- Relative Time: 5.98x (vs baseline)
- Memory Peak: 107.83 MB
- Memory Avg: 107.38 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** heavy_load

- Import Time: 8.95 ms
- Relative Time: 23.18x (vs baseline)
- Memory Peak: 108.55 MB
- Memory Avg: 108.31 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** enterprise_load 🥇

- Import Time: 22.39 ms
- Relative Time: 58.01x (vs baseline)
- Memory Peak: 109.04 MB
- Memory Avg: 108.79 MB
- Package Size: 0.00 MB
- Features: auto_install

##### pylazyimports 🥈

**Test:** light_load 🥈

- Import Time: 0.44 ms
- Relative Time: 1.15x (vs baseline)
- Memory Peak: 139.33 MB
- Memory Avg: 139.32 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load 🥉

- Import Time: 2.57 ms
- Relative Time: 6.65x (vs baseline)
- Memory Peak: 140.44 MB
- Memory Avg: 139.89 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 8.53 ms
- Relative Time: 22.10x (vs baseline)
- Memory Peak: 141.20 MB
- Memory Avg: 140.83 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 24.31 ms
- Relative Time: 62.99x (vs baseline)
- Memory Peak: 141.93 MB
- Memory Avg: 141.56 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### xwlazy 🥇

**Test:** light_load 🥇

- Import Time: 0.43 ms
- Relative Time: 1.11x (vs baseline)
- Memory Peak: 160.53 MB
- Memory Avg: 160.53 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** medium_load

- Import Time: 3.48 ms
- Relative Time: 9.01x (vs baseline)
- Memory Peak: 160.70 MB
- Memory Avg: 160.68 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** heavy_load 🥈

- Import Time: 8.21 ms
- Relative Time: 21.26x (vs baseline)
- Memory Peak: 160.79 MB
- Memory Avg: 160.78 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** enterprise_load 🥉

- Import Time: 23.05 ms
- Relative Time: 59.74x (vs baseline)
- Memory Peak: 161.39 MB
- Memory Avg: 161.09 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring


### Basic Lazy Import

*Basic lazy import (fair comparison - all libraries) - LITE mode*

#### Top 3 Rankings by Load Test

##### Enterprise Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 23.51 | 60.94x |
| 2 🥈 | lazy-imports | 23.59 | 61.13x |
| 3 🥉 | lazy-imports-lite | 23.99 | 62.17x |

##### Heavy Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 8.05 | 20.86x |
| 2 🥈 | lazy-loader | 8.59 | 22.25x |
| 3 🥉 | lazy-imports | 8.76 | 22.71x |

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazi | 0.34 | 0.88x |
| 2 🥈 | lazy-imports-lite | 0.41 | 1.06x |
| 3 🥉 | lazy-imports | 0.41 | 1.06x |

##### Medium Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazy-imports | 2.58 | 6.67x |
| 2 🥈 | pylazyimports | 2.69 | 6.98x |
| 3 🥉 | lazy-imports-lite | 2.77 | 7.18x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| deferred-import | light_load | 0.45 | 1.17x | 41.48 | 0.00 | ✅ |
| deferred-import | medium_load | 3.33 | 8.64x | 42.26 | 0.00 | ✅ |
| deferred-import | heavy_load | 10.10 | 26.16x | 44.72 | 0.00 | ✅ |
| deferred-import | enterprise_load | 32.24 | 83.54x | 49.41 | 0.00 | ✅ |
| lazi 🥇 | light_load | 0.34 | 0.88x | 80.15 | 0.00 | ✅ |
| lazi | medium_load | 6.95 | 18.01x | 81.04 | 0.00 | ✅ |
| lazi | heavy_load | 23.73 | 61.49x | 83.45 | 0.00 | ✅ |
| lazi | enterprise_load | 51.76 | 134.13x | 88.12 | 0.00 | ✅ |
| lazy-imports 🥉 | light_load | 0.41 | 1.06x | 58.16 | 0.00 | ✅ |
| lazy-imports 🥇 | medium_load | 2.58 | 6.67x | 59.24 | 0.00 | ✅ |
| lazy-imports 🥉 | heavy_load | 8.76 | 22.71x | 61.58 | 0.00 | ✅ |
| lazy-imports 🥈 | enterprise_load | 23.59 | 61.13x | 67.07 | 0.00 | ✅ |
| lazy-imports-lite 🥈 | light_load | 0.41 | 1.06x | 88.12 | 0.00 | ✅ |
| lazy-imports-lite 🥉 | medium_load | 2.77 | 7.18x | 88.12 | 0.00 | ✅ |
| lazy-imports-lite | heavy_load | 9.81 | 25.42x | 88.18 | 0.00 | ✅ |
| lazy-imports-lite 🥉 | enterprise_load | 23.99 | 62.17x | 92.34 | 0.00 | ✅ |
| lazy-loader | light_load | 0.72 | 1.86x | 49.41 | 0.00 | ✅ |
| lazy-loader | medium_load | 3.32 | 8.61x | 49.45 | 0.00 | ✅ |
| lazy-loader 🥈 | heavy_load | 8.59 | 22.25x | 50.68 | 0.00 | ✅ |
| lazy-loader | enterprise_load | 24.22 | 62.77x | 57.92 | 0.00 | ✅ |
| lazy_import | light_load | 0.63 | 1.63x | 67.27 | 0.00 | ✅ |
| lazy_import | medium_load | 3.09 | 8.00x | 68.76 | 0.00 | ✅ |
| lazy_import | heavy_load | 9.71 | 25.15x | 70.36 | 0.00 | ✅ |
| lazy_import | enterprise_load | 26.37 | 68.33x | 71.53 | 0.00 | ✅ |
| pipimport | light_load | 0.67 | 1.74x | 28.38 | 0.00 | ✅ |
| pipimport | medium_load | 3.20 | 8.29x | 29.84 | 0.00 | ✅ |
| pipimport | heavy_load | 9.18 | 23.80x | 33.79 | 0.00 | ✅ |
| pipimport | enterprise_load | 24.96 | 64.69x | 41.16 | 0.00 | ✅ |
| pylazyimports | light_load | 0.59 | 1.52x | 71.66 | 0.00 | ✅ |
| pylazyimports 🥈 | medium_load | 2.69 | 6.98x | 72.68 | 0.00 | ✅ |
| pylazyimports | heavy_load | 10.19 | 26.41x | 74.90 | 0.00 | ✅ |
| pylazyimports | enterprise_load | 27.33 | 70.82x | 80.04 | 0.00 | ✅ |
| xwlazy | light_load | 0.77 | 2.00x | 92.52 | 0.00 | ✅ |
| xwlazy | medium_load | 2.83 | 7.34x | 95.83 | 0.00 | ✅ |
| xwlazy 🥇 | heavy_load | 8.05 | 20.86x | 97.82 | 0.00 | ✅ |
| xwlazy 🥇 | enterprise_load | 23.51 | 60.94x | 106.03 | 0.00 | ✅ |

#### Detailed Results

##### deferred-import

**Test:** light_load

- Import Time: 0.45 ms
- Relative Time: 1.17x (vs baseline)
- Memory Peak: 41.48 MB
- Memory Avg: 41.48 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** medium_load

- Import Time: 3.33 ms
- Relative Time: 8.64x (vs baseline)
- Memory Peak: 42.26 MB
- Memory Avg: 41.87 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** heavy_load

- Import Time: 10.10 ms
- Relative Time: 26.16x (vs baseline)
- Memory Peak: 44.72 MB
- Memory Avg: 43.50 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** enterprise_load

- Import Time: 32.24 ms
- Relative Time: 83.54x (vs baseline)
- Memory Peak: 49.41 MB
- Memory Avg: 47.07 MB
- Package Size: 0.00 MB
- Features: deferred_loading

##### lazi 🥇

**Test:** light_load 🥇

- Import Time: 0.34 ms
- Relative Time: 0.88x (vs baseline)
- Memory Peak: 80.15 MB
- Memory Avg: 80.14 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** medium_load

- Import Time: 6.95 ms
- Relative Time: 18.01x (vs baseline)
- Memory Peak: 81.04 MB
- Memory Avg: 80.59 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** heavy_load

- Import Time: 23.73 ms
- Relative Time: 61.49x (vs baseline)
- Memory Peak: 83.45 MB
- Memory Avg: 82.26 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** enterprise_load

- Import Time: 51.76 ms
- Relative Time: 134.13x (vs baseline)
- Memory Peak: 88.12 MB
- Memory Avg: 85.79 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

##### lazy-imports 🥇

**Test:** light_load 🥉

- Import Time: 0.41 ms
- Relative Time: 1.06x (vs baseline)
- Memory Peak: 58.16 MB
- Memory Avg: 58.12 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load 🥇

- Import Time: 2.58 ms
- Relative Time: 6.67x (vs baseline)
- Memory Peak: 59.24 MB
- Memory Avg: 58.74 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load 🥉

- Import Time: 8.76 ms
- Relative Time: 22.71x (vs baseline)
- Memory Peak: 61.58 MB
- Memory Avg: 60.49 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load 🥈

- Import Time: 23.59 ms
- Relative Time: 61.13x (vs baseline)
- Memory Peak: 67.07 MB
- Memory Avg: 64.36 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### lazy-imports-lite 🥈

**Test:** light_load 🥈

- Import Time: 0.41 ms
- Relative Time: 1.06x (vs baseline)
- Memory Peak: 88.12 MB
- Memory Avg: 88.12 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** medium_load 🥉

- Import Time: 2.77 ms
- Relative Time: 7.18x (vs baseline)
- Memory Peak: 88.12 MB
- Memory Avg: 88.12 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** heavy_load

- Import Time: 9.81 ms
- Relative Time: 25.42x (vs baseline)
- Memory Peak: 88.18 MB
- Memory Avg: 88.15 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** enterprise_load 🥉

- Import Time: 23.99 ms
- Relative Time: 62.17x (vs baseline)
- Memory Peak: 92.34 MB
- Memory Avg: 90.26 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

##### lazy-loader 🥈

**Test:** light_load

- Import Time: 0.72 ms
- Relative Time: 1.86x (vs baseline)
- Memory Peak: 49.41 MB
- Memory Avg: 49.41 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** medium_load

- Import Time: 3.32 ms
- Relative Time: 8.61x (vs baseline)
- Memory Peak: 49.45 MB
- Memory Avg: 49.43 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** heavy_load 🥈

- Import Time: 8.59 ms
- Relative Time: 22.25x (vs baseline)
- Memory Peak: 50.68 MB
- Memory Avg: 50.07 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** enterprise_load

- Import Time: 24.22 ms
- Relative Time: 62.77x (vs baseline)
- Memory Peak: 57.92 MB
- Memory Avg: 54.31 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

##### lazy_import

**Test:** light_load

- Import Time: 0.63 ms
- Relative Time: 1.63x (vs baseline)
- Memory Peak: 67.27 MB
- Memory Avg: 67.22 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 3.09 ms
- Relative Time: 8.00x (vs baseline)
- Memory Peak: 68.76 MB
- Memory Avg: 68.04 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 9.71 ms
- Relative Time: 25.15x (vs baseline)
- Memory Peak: 70.36 MB
- Memory Avg: 69.59 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 26.37 ms
- Relative Time: 68.33x (vs baseline)
- Memory Peak: 71.53 MB
- Memory Avg: 70.96 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### pipimport

**Test:** light_load

- Import Time: 0.67 ms
- Relative Time: 1.74x (vs baseline)
- Memory Peak: 28.38 MB
- Memory Avg: 28.10 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** medium_load

- Import Time: 3.20 ms
- Relative Time: 8.29x (vs baseline)
- Memory Peak: 29.84 MB
- Memory Avg: 29.19 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** heavy_load

- Import Time: 9.18 ms
- Relative Time: 23.80x (vs baseline)
- Memory Peak: 33.79 MB
- Memory Avg: 31.83 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** enterprise_load

- Import Time: 24.96 ms
- Relative Time: 64.69x (vs baseline)
- Memory Peak: 41.16 MB
- Memory Avg: 37.54 MB
- Package Size: 0.00 MB
- Features: auto_install

##### pylazyimports 🥈

**Test:** light_load

- Import Time: 0.59 ms
- Relative Time: 1.52x (vs baseline)
- Memory Peak: 71.66 MB
- Memory Avg: 71.62 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load 🥈

- Import Time: 2.69 ms
- Relative Time: 6.98x (vs baseline)
- Memory Peak: 72.68 MB
- Memory Avg: 72.18 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 10.19 ms
- Relative Time: 26.41x (vs baseline)
- Memory Peak: 74.90 MB
- Memory Avg: 73.80 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 27.33 ms
- Relative Time: 70.82x (vs baseline)
- Memory Peak: 80.04 MB
- Memory Avg: 77.47 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### xwlazy 🥇

**Test:** light_load

- Import Time: 0.77 ms
- Relative Time: 2.00x (vs baseline)
- Memory Peak: 92.52 MB
- Memory Avg: 92.52 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** medium_load

- Import Time: 2.83 ms
- Relative Time: 7.34x (vs baseline)
- Memory Peak: 95.83 MB
- Memory Avg: 94.98 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** heavy_load 🥇

- Import Time: 8.05 ms
- Relative Time: 20.86x (vs baseline)
- Memory Peak: 97.82 MB
- Memory Avg: 97.18 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** enterprise_load 🥇

- Import Time: 23.51 ms
- Relative Time: 60.94x (vs baseline)
- Memory Peak: 106.03 MB
- Memory Avg: 102.08 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring


### Preload Mode

*Preload all modules on start - PRELOAD mode*

#### Top 3 Rankings by Load Test

##### Enterprise Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazi | 22.65 | 58.70x |
| 2 🥈 | lazy_import | 22.75 | 58.96x |
| 3 🥉 | lazy-loader | 22.78 | 59.04x |

##### Heavy Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | deferred-import | 8.15 | 21.11x |
| 2 🥈 | lazi | 8.19 | 21.22x |
| 3 🥉 | lazy-loader | 8.35 | 21.63x |

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazi | 0.35 | 0.91x |
| 2 🥈 | lazy-imports-lite | 0.39 | 1.02x |
| 3 🥉 | lazy-imports | 0.44 | 1.14x |

##### Medium Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 2.29 | 5.94x |
| 2 🥈 | lazy-imports-lite | 2.40 | 6.21x |
| 3 🥉 | lazy_import | 2.57 | 6.66x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| deferred-import | light_load | 0.63 | 1.62x | 171.15 | 0.00 | ✅ |
| deferred-import | medium_load | 2.70 | 7.01x | 172.32 | 0.00 | ✅ |
| deferred-import 🥇 | heavy_load | 8.15 | 21.11x | 174.01 | 0.00 | ✅ |
| deferred-import | enterprise_load | 23.44 | 60.75x | 180.75 | 0.00 | ✅ |
| lazi 🥇 | light_load | 0.35 | 0.91x | 209.66 | 0.00 | ✅ |
| lazi | medium_load | 3.45 | 8.93x | 210.31 | 0.00 | ✅ |
| lazi 🥈 | heavy_load | 8.19 | 21.22x | 210.31 | 0.00 | ✅ |
| lazi 🥇 | enterprise_load | 22.65 | 58.70x | 210.51 | 0.00 | ✅ |
| lazy-imports 🥉 | light_load | 0.44 | 1.14x | 182.71 | 0.00 | ✅ |
| lazy-imports | medium_load | 3.77 | 9.77x | 182.71 | 0.00 | ✅ |
| lazy-imports | heavy_load | 9.19 | 23.80x | 182.79 | 0.00 | ✅ |
| lazy-imports | enterprise_load | 23.36 | 60.52x | 190.55 | 0.00 | ✅ |
| lazy-imports-lite 🥈 | light_load | 0.39 | 1.02x | 210.51 | 0.00 | ✅ |
| lazy-imports-lite 🥈 | medium_load | 2.40 | 6.21x | 210.57 | 0.00 | ✅ |
| lazy-imports-lite | heavy_load | 9.06 | 23.48x | 211.95 | 0.00 | ✅ |
| lazy-imports-lite | enterprise_load | 23.88 | 61.88x | 218.34 | 0.00 | ✅ |
| lazy-loader | light_load | 0.51 | 1.33x | 180.86 | 0.00 | ✅ |
| lazy-loader | medium_load | 3.00 | 7.76x | 182.12 | 0.00 | ✅ |
| lazy-loader 🥉 | heavy_load | 8.35 | 21.63x | 182.22 | 0.00 | ✅ |
| lazy-loader 🥉 | enterprise_load | 22.78 | 59.04x | 182.70 | 0.00 | ✅ |
| lazy_import | light_load | 1.13 | 2.93x | 190.70 | 0.00 | ✅ |
| lazy_import 🥉 | medium_load | 2.57 | 6.66x | 192.03 | 0.00 | ✅ |
| lazy_import | heavy_load | 8.36 | 21.66x | 194.21 | 0.00 | ✅ |
| lazy_import 🥈 | enterprise_load | 22.75 | 58.96x | 200.11 | 0.00 | ✅ |
| pipimport | light_load | 0.63 | 1.64x | 161.68 | 0.00 | ✅ |
| pipimport | medium_load | 2.94 | 7.62x | 162.01 | 0.00 | ✅ |
| pipimport | heavy_load | 8.76 | 22.70x | 164.00 | 0.00 | ✅ |
| pipimport | enterprise_load | 23.84 | 61.79x | 171.06 | 0.00 | ✅ |
| pylazyimports | light_load | 0.44 | 1.15x | 200.25 | 0.00 | ✅ |
| pylazyimports | medium_load | 2.83 | 7.33x | 201.23 | 0.00 | ✅ |
| pylazyimports | heavy_load | 9.02 | 23.39x | 203.91 | 0.00 | ✅ |
| pylazyimports | enterprise_load | 22.82 | 59.14x | 209.57 | 0.00 | ✅ |
| xwlazy | light_load | 0.56 | 1.46x | 218.68 | 0.00 | ✅ |
| xwlazy 🥇 | medium_load | 2.29 | 5.94x | 219.86 | 0.00 | ✅ |
| xwlazy | heavy_load | 8.98 | 23.26x | 222.21 | 0.00 | ✅ |
| xwlazy | enterprise_load | 23.14 | 59.97x | 228.53 | 0.00 | ✅ |

#### Detailed Results

##### deferred-import 🥇

**Test:** light_load

- Import Time: 0.63 ms
- Relative Time: 1.62x (vs baseline)
- Memory Peak: 171.15 MB
- Memory Avg: 171.14 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** medium_load

- Import Time: 2.70 ms
- Relative Time: 7.01x (vs baseline)
- Memory Peak: 172.32 MB
- Memory Avg: 171.73 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** heavy_load 🥇

- Import Time: 8.15 ms
- Relative Time: 21.11x (vs baseline)
- Memory Peak: 174.01 MB
- Memory Avg: 173.17 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** enterprise_load

- Import Time: 23.44 ms
- Relative Time: 60.75x (vs baseline)
- Memory Peak: 180.75 MB
- Memory Avg: 177.39 MB
- Package Size: 0.00 MB
- Features: deferred_loading

##### lazi 🥇

**Test:** light_load 🥇

- Import Time: 0.35 ms
- Relative Time: 0.91x (vs baseline)
- Memory Peak: 209.66 MB
- Memory Avg: 209.65 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** medium_load

- Import Time: 3.45 ms
- Relative Time: 8.93x (vs baseline)
- Memory Peak: 210.31 MB
- Memory Avg: 209.99 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** heavy_load 🥈

- Import Time: 8.19 ms
- Relative Time: 21.22x (vs baseline)
- Memory Peak: 210.31 MB
- Memory Avg: 210.31 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** enterprise_load 🥇

- Import Time: 22.65 ms
- Relative Time: 58.70x (vs baseline)
- Memory Peak: 210.51 MB
- Memory Avg: 210.41 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

##### lazy-imports 🥉

**Test:** light_load 🥉

- Import Time: 0.44 ms
- Relative Time: 1.14x (vs baseline)
- Memory Peak: 182.71 MB
- Memory Avg: 182.71 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 3.77 ms
- Relative Time: 9.77x (vs baseline)
- Memory Peak: 182.71 MB
- Memory Avg: 182.71 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 9.19 ms
- Relative Time: 23.80x (vs baseline)
- Memory Peak: 182.79 MB
- Memory Avg: 182.75 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 23.36 ms
- Relative Time: 60.52x (vs baseline)
- Memory Peak: 190.55 MB
- Memory Avg: 186.67 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### lazy-imports-lite 🥈

**Test:** light_load 🥈

- Import Time: 0.39 ms
- Relative Time: 1.02x (vs baseline)
- Memory Peak: 210.51 MB
- Memory Avg: 210.51 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** medium_load 🥈

- Import Time: 2.40 ms
- Relative Time: 6.21x (vs baseline)
- Memory Peak: 210.57 MB
- Memory Avg: 210.54 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** heavy_load

- Import Time: 9.06 ms
- Relative Time: 23.48x (vs baseline)
- Memory Peak: 211.95 MB
- Memory Avg: 211.26 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** enterprise_load

- Import Time: 23.88 ms
- Relative Time: 61.88x (vs baseline)
- Memory Peak: 218.34 MB
- Memory Avg: 215.15 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

##### lazy-loader 🥉

**Test:** light_load

- Import Time: 0.51 ms
- Relative Time: 1.33x (vs baseline)
- Memory Peak: 180.86 MB
- Memory Avg: 180.84 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** medium_load

- Import Time: 3.00 ms
- Relative Time: 7.76x (vs baseline)
- Memory Peak: 182.12 MB
- Memory Avg: 181.50 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** heavy_load 🥉

- Import Time: 8.35 ms
- Relative Time: 21.63x (vs baseline)
- Memory Peak: 182.22 MB
- Memory Avg: 182.17 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** enterprise_load 🥉

- Import Time: 22.78 ms
- Relative Time: 59.04x (vs baseline)
- Memory Peak: 182.70 MB
- Memory Avg: 182.46 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

##### lazy_import 🥈

**Test:** light_load

- Import Time: 1.13 ms
- Relative Time: 2.93x (vs baseline)
- Memory Peak: 190.70 MB
- Memory Avg: 190.67 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load 🥉

- Import Time: 2.57 ms
- Relative Time: 6.66x (vs baseline)
- Memory Peak: 192.03 MB
- Memory Avg: 191.38 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 8.36 ms
- Relative Time: 21.66x (vs baseline)
- Memory Peak: 194.21 MB
- Memory Avg: 193.13 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load 🥈

- Import Time: 22.75 ms
- Relative Time: 58.96x (vs baseline)
- Memory Peak: 200.11 MB
- Memory Avg: 197.17 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### pipimport

**Test:** light_load

- Import Time: 0.63 ms
- Relative Time: 1.64x (vs baseline)
- Memory Peak: 161.68 MB
- Memory Avg: 161.66 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** medium_load

- Import Time: 2.94 ms
- Relative Time: 7.62x (vs baseline)
- Memory Peak: 162.01 MB
- Memory Avg: 161.84 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** heavy_load

- Import Time: 8.76 ms
- Relative Time: 22.70x (vs baseline)
- Memory Peak: 164.00 MB
- Memory Avg: 163.02 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** enterprise_load

- Import Time: 23.84 ms
- Relative Time: 61.79x (vs baseline)
- Memory Peak: 171.06 MB
- Memory Avg: 167.58 MB
- Package Size: 0.00 MB
- Features: auto_install

##### pylazyimports

**Test:** light_load

- Import Time: 0.44 ms
- Relative Time: 1.15x (vs baseline)
- Memory Peak: 200.25 MB
- Memory Avg: 200.24 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 2.83 ms
- Relative Time: 7.33x (vs baseline)
- Memory Peak: 201.23 MB
- Memory Avg: 200.74 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 9.02 ms
- Relative Time: 23.39x (vs baseline)
- Memory Peak: 203.91 MB
- Memory Avg: 202.57 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 22.82 ms
- Relative Time: 59.14x (vs baseline)
- Memory Peak: 209.57 MB
- Memory Avg: 206.74 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### xwlazy 🥇

**Test:** light_load

- Import Time: 0.56 ms
- Relative Time: 1.46x (vs baseline)
- Memory Peak: 218.68 MB
- Memory Avg: 218.67 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** medium_load 🥇

- Import Time: 2.29 ms
- Relative Time: 5.94x (vs baseline)
- Memory Peak: 219.86 MB
- Memory Avg: 219.52 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** heavy_load

- Import Time: 8.98 ms
- Relative Time: 23.26x (vs baseline)
- Memory Peak: 222.21 MB
- Memory Avg: 221.16 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** enterprise_load

- Import Time: 23.14 ms
- Relative Time: 59.97x (vs baseline)
- Memory Peak: 228.53 MB
- Memory Avg: 225.43 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring


## Overall Winner 👑

**lazi 👑** wins with **10 first place victory(ies)** across all test categories!

### Winner Summary

| Library | First Place Wins |
|---------|------------------|
| lazi 👑 | 10 |
| xwlazy | 6 |
| pipimport | 4 |
| deferred-import | 4 |
| lazy-imports | 2 |
| lazy-imports-lite | 2 |
| lazy_import | 2 |
| pylazyimports | 1 |
| lazy-loader | 1 |


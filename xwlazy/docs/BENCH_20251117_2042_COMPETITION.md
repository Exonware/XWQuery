# Competition Benchmark Report

**Generated:** 2025-11-17T20:42:15.578582

## Standard Tests

### Auto Mode

*Smart install + auto-uninstall large - AUTO mode*

#### Top 3 Rankings by Load Test

##### Enterprise Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazy-imports | 22.75 | 73.01x |
| 2 🥈 | lazy_import | 23.10 | 74.13x |
| 3 🥉 | pipimport | 23.32 | 74.84x |

##### Heavy Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazy-loader | 8.17 | 26.23x |
| 2 🥈 | pipimport | 8.54 | 27.40x |
| 3 🥉 | deferred-import | 8.65 | 27.77x |

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazi | 0.32 | 1.04x |
| 2 🥈 | lazy-imports | 0.49 | 1.56x |
| 3 🥉 | pylazyimports | 0.51 | 1.64x |

##### Medium Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | pylazyimports | 2.65 | 8.50x |
| 2 🥈 | lazy-imports | 2.66 | 8.54x |
| 3 🥉 | pipimport | 2.68 | 8.61x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| deferred-import | light_load | 0.56 | 1.79x | 402.49 | 0.00 | ✅ |
| deferred-import | medium_load | 2.90 | 9.31x | 402.49 | 0.00 | ✅ |
| deferred-import 🥉 | heavy_load | 8.65 | 27.77x | 402.51 | 0.00 | ✅ |
| deferred-import | enterprise_load | 23.98 | 76.96x | 402.60 | 0.00 | ✅ |
| lazi 🥇 | light_load | 0.32 | 1.04x | 425.74 | 0.00 | ✅ |
| lazi | medium_load | 3.42 | 10.98x | 427.41 | 0.00 | ✅ |
| lazi | heavy_load | 9.51 | 30.52x | 429.24 | 0.00 | ✅ |
| lazi | enterprise_load | 26.42 | 84.78x | 434.98 | 0.00 | ✅ |
| lazy-imports 🥈 | light_load | 0.49 | 1.56x | 402.87 | 0.00 | ✅ |
| lazy-imports 🥈 | medium_load | 2.66 | 8.54x | 402.89 | 0.00 | ✅ |
| lazy-imports | heavy_load | 8.71 | 27.96x | 403.18 | 0.00 | ✅ |
| lazy-imports 🥇 | enterprise_load | 22.75 | 73.01x | 405.30 | 0.00 | ✅ |
| lazy-imports-lite | light_load | 0.71 | 2.29x | 435.06 | 0.00 | ✅ |
| lazy-imports-lite | medium_load | 2.86 | 9.16x | 435.79 | 0.00 | ✅ |
| lazy-imports-lite | heavy_load | 8.81 | 28.28x | 438.58 | 0.00 | ✅ |
| lazy-imports-lite | enterprise_load | 23.38 | 75.02x | 443.76 | 0.00 | ✅ |
| lazy-loader | light_load | 0.60 | 1.93x | 402.60 | 0.00 | ✅ |
| lazy-loader | medium_load | 2.97 | 9.52x | 402.60 | 0.00 | ✅ |
| lazy-loader 🥇 | heavy_load | 8.17 | 26.23x | 402.60 | 0.00 | ✅ |
| lazy-loader | enterprise_load | 24.02 | 77.08x | 402.87 | 0.00 | ✅ |
| lazy_import | light_load | 0.61 | 1.96x | 405.44 | 0.00 | ✅ |
| lazy_import | medium_load | 3.30 | 10.58x | 406.85 | 0.00 | ✅ |
| lazy_import | heavy_load | 9.51 | 30.53x | 408.52 | 0.00 | ✅ |
| lazy_import 🥈 | enterprise_load | 23.10 | 74.13x | 415.99 | 0.00 | ✅ |
| pipimport | light_load | 0.64 | 2.06x | 402.45 | 0.00 | ✅ |
| pipimport 🥉 | medium_load | 2.68 | 8.61x | 402.45 | 0.00 | ✅ |
| pipimport 🥈 | heavy_load | 8.54 | 27.40x | 402.45 | 0.00 | ✅ |
| pipimport 🥉 | enterprise_load | 23.32 | 74.84x | 402.47 | 0.00 | ✅ |
| pylazyimports 🥉 | light_load | 0.51 | 1.64x | 416.08 | 0.00 | ✅ |
| pylazyimports 🥇 | medium_load | 2.65 | 8.50x | 417.18 | 0.00 | ✅ |
| pylazyimports | heavy_load | 8.77 | 28.14x | 419.59 | 0.00 | ✅ |
| pylazyimports | enterprise_load | 24.85 | 79.74x | 425.66 | 0.00 | ✅ |
| xwlazy | light_load | 0.62 | 2.00x | 443.86 | 0.00 | ✅ |
| xwlazy | medium_load | 3.00 | 9.63x | 444.74 | 0.00 | ✅ |
| xwlazy | heavy_load | 9.80 | 31.46x | 444.77 | 0.00 | ✅ |
| xwlazy | enterprise_load | 23.37 | 75.01x | 444.84 | 0.00 | ✅ |

#### Detailed Results

##### deferred-import 🥉

**Test:** light_load

- Import Time: 0.56 ms
- Relative Time: 1.79x (vs baseline)
- Memory Peak: 402.49 MB
- Memory Avg: 402.49 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** medium_load

- Import Time: 2.90 ms
- Relative Time: 9.31x (vs baseline)
- Memory Peak: 402.49 MB
- Memory Avg: 402.49 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** heavy_load 🥉

- Import Time: 8.65 ms
- Relative Time: 27.77x (vs baseline)
- Memory Peak: 402.51 MB
- Memory Avg: 402.50 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** enterprise_load

- Import Time: 23.98 ms
- Relative Time: 76.96x (vs baseline)
- Memory Peak: 402.60 MB
- Memory Avg: 402.55 MB
- Package Size: 0.00 MB
- Features: deferred_loading

##### lazi 🥇

**Test:** light_load 🥇

- Import Time: 0.32 ms
- Relative Time: 1.04x (vs baseline)
- Memory Peak: 425.74 MB
- Memory Avg: 425.74 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** medium_load

- Import Time: 3.42 ms
- Relative Time: 10.98x (vs baseline)
- Memory Peak: 427.41 MB
- Memory Avg: 426.58 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** heavy_load

- Import Time: 9.51 ms
- Relative Time: 30.52x (vs baseline)
- Memory Peak: 429.24 MB
- Memory Avg: 428.32 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** enterprise_load

- Import Time: 26.42 ms
- Relative Time: 84.78x (vs baseline)
- Memory Peak: 434.98 MB
- Memory Avg: 432.11 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

##### lazy-imports 🥇

**Test:** light_load 🥈

- Import Time: 0.49 ms
- Relative Time: 1.56x (vs baseline)
- Memory Peak: 402.87 MB
- Memory Avg: 402.87 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load 🥈

- Import Time: 2.66 ms
- Relative Time: 8.54x (vs baseline)
- Memory Peak: 402.89 MB
- Memory Avg: 402.88 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 8.71 ms
- Relative Time: 27.96x (vs baseline)
- Memory Peak: 403.18 MB
- Memory Avg: 403.03 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load 🥇

- Import Time: 22.75 ms
- Relative Time: 73.01x (vs baseline)
- Memory Peak: 405.30 MB
- Memory Avg: 404.24 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### lazy-imports-lite

**Test:** light_load

- Import Time: 0.71 ms
- Relative Time: 2.29x (vs baseline)
- Memory Peak: 435.06 MB
- Memory Avg: 435.05 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** medium_load

- Import Time: 2.86 ms
- Relative Time: 9.16x (vs baseline)
- Memory Peak: 435.79 MB
- Memory Avg: 435.42 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** heavy_load

- Import Time: 8.81 ms
- Relative Time: 28.28x (vs baseline)
- Memory Peak: 438.58 MB
- Memory Avg: 437.20 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** enterprise_load

- Import Time: 23.38 ms
- Relative Time: 75.02x (vs baseline)
- Memory Peak: 443.76 MB
- Memory Avg: 441.17 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

##### lazy-loader 🥇

**Test:** light_load

- Import Time: 0.60 ms
- Relative Time: 1.93x (vs baseline)
- Memory Peak: 402.60 MB
- Memory Avg: 402.60 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** medium_load

- Import Time: 2.97 ms
- Relative Time: 9.52x (vs baseline)
- Memory Peak: 402.60 MB
- Memory Avg: 402.60 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** heavy_load 🥇

- Import Time: 8.17 ms
- Relative Time: 26.23x (vs baseline)
- Memory Peak: 402.60 MB
- Memory Avg: 402.60 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** enterprise_load

- Import Time: 24.02 ms
- Relative Time: 77.08x (vs baseline)
- Memory Peak: 402.87 MB
- Memory Avg: 402.73 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

##### lazy_import 🥈

**Test:** light_load

- Import Time: 0.61 ms
- Relative Time: 1.96x (vs baseline)
- Memory Peak: 405.44 MB
- Memory Avg: 405.42 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 3.30 ms
- Relative Time: 10.58x (vs baseline)
- Memory Peak: 406.85 MB
- Memory Avg: 406.16 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 9.51 ms
- Relative Time: 30.53x (vs baseline)
- Memory Peak: 408.52 MB
- Memory Avg: 407.70 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load 🥈

- Import Time: 23.10 ms
- Relative Time: 74.13x (vs baseline)
- Memory Peak: 415.99 MB
- Memory Avg: 412.25 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### pipimport 🥈

**Test:** light_load

- Import Time: 0.64 ms
- Relative Time: 2.06x (vs baseline)
- Memory Peak: 402.45 MB
- Memory Avg: 402.40 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** medium_load 🥉

- Import Time: 2.68 ms
- Relative Time: 8.61x (vs baseline)
- Memory Peak: 402.45 MB
- Memory Avg: 402.45 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** heavy_load 🥈

- Import Time: 8.54 ms
- Relative Time: 27.40x (vs baseline)
- Memory Peak: 402.45 MB
- Memory Avg: 402.45 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** enterprise_load 🥉

- Import Time: 23.32 ms
- Relative Time: 74.84x (vs baseline)
- Memory Peak: 402.47 MB
- Memory Avg: 402.46 MB
- Package Size: 0.00 MB
- Features: auto_install

##### pylazyimports 🥇

**Test:** light_load 🥉

- Import Time: 0.51 ms
- Relative Time: 1.64x (vs baseline)
- Memory Peak: 416.08 MB
- Memory Avg: 416.07 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load 🥇

- Import Time: 2.65 ms
- Relative Time: 8.50x (vs baseline)
- Memory Peak: 417.18 MB
- Memory Avg: 416.63 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 8.77 ms
- Relative Time: 28.14x (vs baseline)
- Memory Peak: 419.59 MB
- Memory Avg: 418.39 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 24.85 ms
- Relative Time: 79.74x (vs baseline)
- Memory Peak: 425.66 MB
- Memory Avg: 422.65 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### xwlazy

**Test:** light_load

- Import Time: 0.62 ms
- Relative Time: 2.00x (vs baseline)
- Memory Peak: 443.86 MB
- Memory Avg: 443.85 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** medium_load

- Import Time: 3.00 ms
- Relative Time: 9.63x (vs baseline)
- Memory Peak: 444.74 MB
- Memory Avg: 444.71 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** heavy_load

- Import Time: 9.80 ms
- Relative Time: 31.46x (vs baseline)
- Memory Peak: 444.77 MB
- Memory Avg: 444.77 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** enterprise_load

- Import Time: 23.37 ms
- Relative Time: 75.01x (vs baseline)
- Memory Peak: 444.84 MB
- Memory Avg: 444.82 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring


### Clean Mode

*Install on usage + uninstall after - CLEAN mode*

#### Top 3 Rankings by Load Test

##### Enterprise Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazi | 23.09 | 74.10x |
| 2 🥈 | pipimport | 23.15 | 74.30x |
| 3 🥉 | lazy_import | 23.17 | 74.35x |

##### Heavy Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazy-imports-lite | 7.89 | 25.33x |
| 2 🥈 | lazy_import | 8.17 | 26.21x |
| 3 🥉 | deferred-import | 8.17 | 26.23x |

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | deferred-import | 0.32 | 1.03x |
| 2 🥈 | lazi | 0.35 | 1.11x |
| 3 🥉 | lazy-imports | 0.46 | 1.49x |

##### Medium Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | pylazyimports | 2.37 | 7.59x |
| 2 🥈 | xwlazy | 2.37 | 7.61x |
| 3 🥉 | lazy_import | 2.46 | 7.89x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| deferred-import 🥇 | light_load | 0.32 | 1.03x | 357.02 | 0.00 | ✅ |
| deferred-import | medium_load | 2.72 | 8.72x | 357.96 | 0.00 | ✅ |
| deferred-import 🥉 | heavy_load | 8.17 | 26.23x | 359.79 | 0.00 | ✅ |
| deferred-import | enterprise_load | 23.80 | 76.39x | 359.95 | 0.00 | ✅ |
| lazi 🥈 | light_load | 0.35 | 1.11x | 376.70 | 0.00 | ✅ |
| lazi | medium_load | 2.90 | 9.29x | 377.42 | 0.00 | ✅ |
| lazi | heavy_load | 9.06 | 29.06x | 379.74 | 0.00 | ✅ |
| lazi 🥇 | enterprise_load | 23.09 | 74.10x | 386.22 | 0.00 | ✅ |
| lazy-imports 🥉 | light_load | 0.46 | 1.49x | 360.00 | 0.00 | ✅ |
| lazy-imports | medium_load | 2.76 | 8.87x | 360.00 | 0.00 | ✅ |
| lazy-imports | heavy_load | 8.92 | 28.64x | 360.01 | 0.00 | ✅ |
| lazy-imports | enterprise_load | 23.20 | 74.44x | 361.31 | 0.00 | ✅ |
| lazy-imports-lite | light_load | 0.56 | 1.79x | 386.31 | 0.00 | ✅ |
| lazy-imports-lite | medium_load | 3.00 | 9.63x | 387.35 | 0.00 | ✅ |
| lazy-imports-lite 🥇 | heavy_load | 7.89 | 25.33x | 388.68 | 0.00 | ✅ |
| lazy-imports-lite | enterprise_load | 23.38 | 75.04x | 396.72 | 0.00 | ✅ |
| lazy-loader | light_load | 0.84 | 2.70x | 359.95 | 0.00 | ✅ |
| lazy-loader | medium_load | 3.32 | 10.64x | 359.95 | 0.00 | ✅ |
| lazy-loader | heavy_load | 9.51 | 30.52x | 359.96 | 0.00 | ✅ |
| lazy-loader | enterprise_load | 24.37 | 78.21x | 359.99 | 0.00 | ✅ |
| lazy_import | light_load | 0.62 | 1.99x | 361.32 | 0.00 | ✅ |
| lazy_import 🥉 | medium_load | 2.46 | 7.89x | 361.34 | 0.00 | ✅ |
| lazy_import 🥈 | heavy_load | 8.17 | 26.21x | 361.47 | 0.00 | ✅ |
| lazy_import 🥉 | enterprise_load | 23.17 | 74.35x | 366.63 | 0.00 | ✅ |
| pipimport | light_load | 0.64 | 2.04x | 348.18 | 0.00 | ✅ |
| pipimport | medium_load | 3.30 | 10.59x | 348.86 | 0.00 | ✅ |
| pipimport | heavy_load | 8.67 | 27.84x | 350.89 | 0.00 | ✅ |
| pipimport 🥈 | enterprise_load | 23.15 | 74.30x | 356.77 | 0.00 | ✅ |
| pylazyimports | light_load | 0.65 | 2.08x | 366.73 | 0.00 | ✅ |
| pylazyimports 🥇 | medium_load | 2.37 | 7.59x | 368.29 | 0.00 | ✅ |
| pylazyimports | heavy_load | 8.42 | 27.01x | 370.51 | 0.00 | ✅ |
| pylazyimports | enterprise_load | 23.46 | 75.28x | 376.61 | 0.00 | ✅ |
| xwlazy | light_load | 0.49 | 1.58x | 396.85 | 0.00 | ✅ |
| xwlazy 🥈 | medium_load | 2.37 | 7.61x | 399.04 | 0.00 | ✅ |
| xwlazy | heavy_load | 8.75 | 28.08x | 401.07 | 0.00 | ✅ |
| xwlazy | enterprise_load | 23.99 | 76.99x | 402.36 | 0.00 | ✅ |

#### Detailed Results

##### deferred-import 🥇

**Test:** light_load 🥇

- Import Time: 0.32 ms
- Relative Time: 1.03x (vs baseline)
- Memory Peak: 357.02 MB
- Memory Avg: 357.01 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** medium_load

- Import Time: 2.72 ms
- Relative Time: 8.72x (vs baseline)
- Memory Peak: 357.96 MB
- Memory Avg: 357.49 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** heavy_load 🥉

- Import Time: 8.17 ms
- Relative Time: 26.23x (vs baseline)
- Memory Peak: 359.79 MB
- Memory Avg: 358.88 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** enterprise_load

- Import Time: 23.80 ms
- Relative Time: 76.39x (vs baseline)
- Memory Peak: 359.95 MB
- Memory Avg: 359.87 MB
- Package Size: 0.00 MB
- Features: deferred_loading

##### lazi 🥇

**Test:** light_load 🥈

- Import Time: 0.35 ms
- Relative Time: 1.11x (vs baseline)
- Memory Peak: 376.70 MB
- Memory Avg: 376.69 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** medium_load

- Import Time: 2.90 ms
- Relative Time: 9.29x (vs baseline)
- Memory Peak: 377.42 MB
- Memory Avg: 377.06 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** heavy_load

- Import Time: 9.06 ms
- Relative Time: 29.06x (vs baseline)
- Memory Peak: 379.74 MB
- Memory Avg: 378.60 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** enterprise_load 🥇

- Import Time: 23.09 ms
- Relative Time: 74.10x (vs baseline)
- Memory Peak: 386.22 MB
- Memory Avg: 382.98 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

##### lazy-imports 🥉

**Test:** light_load 🥉

- Import Time: 0.46 ms
- Relative Time: 1.49x (vs baseline)
- Memory Peak: 360.00 MB
- Memory Avg: 360.00 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 2.76 ms
- Relative Time: 8.87x (vs baseline)
- Memory Peak: 360.00 MB
- Memory Avg: 360.00 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 8.92 ms
- Relative Time: 28.64x (vs baseline)
- Memory Peak: 360.01 MB
- Memory Avg: 360.01 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 23.20 ms
- Relative Time: 74.44x (vs baseline)
- Memory Peak: 361.31 MB
- Memory Avg: 360.66 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### lazy-imports-lite 🥇

**Test:** light_load

- Import Time: 0.56 ms
- Relative Time: 1.79x (vs baseline)
- Memory Peak: 386.31 MB
- Memory Avg: 386.30 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** medium_load

- Import Time: 3.00 ms
- Relative Time: 9.63x (vs baseline)
- Memory Peak: 387.35 MB
- Memory Avg: 386.83 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** heavy_load 🥇

- Import Time: 7.89 ms
- Relative Time: 25.33x (vs baseline)
- Memory Peak: 388.68 MB
- Memory Avg: 388.02 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** enterprise_load

- Import Time: 23.38 ms
- Relative Time: 75.04x (vs baseline)
- Memory Peak: 396.72 MB
- Memory Avg: 392.70 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

##### lazy-loader

**Test:** light_load

- Import Time: 0.84 ms
- Relative Time: 2.70x (vs baseline)
- Memory Peak: 359.95 MB
- Memory Avg: 359.95 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** medium_load

- Import Time: 3.32 ms
- Relative Time: 10.64x (vs baseline)
- Memory Peak: 359.95 MB
- Memory Avg: 359.95 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** heavy_load

- Import Time: 9.51 ms
- Relative Time: 30.52x (vs baseline)
- Memory Peak: 359.96 MB
- Memory Avg: 359.95 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** enterprise_load

- Import Time: 24.37 ms
- Relative Time: 78.21x (vs baseline)
- Memory Peak: 359.99 MB
- Memory Avg: 359.97 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

##### lazy_import 🥈

**Test:** light_load

- Import Time: 0.62 ms
- Relative Time: 1.99x (vs baseline)
- Memory Peak: 361.32 MB
- Memory Avg: 361.32 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load 🥉

- Import Time: 2.46 ms
- Relative Time: 7.89x (vs baseline)
- Memory Peak: 361.34 MB
- Memory Avg: 361.33 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load 🥈

- Import Time: 8.17 ms
- Relative Time: 26.21x (vs baseline)
- Memory Peak: 361.47 MB
- Memory Avg: 361.40 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load 🥉

- Import Time: 23.17 ms
- Relative Time: 74.35x (vs baseline)
- Memory Peak: 366.63 MB
- Memory Avg: 364.05 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### pipimport 🥈

**Test:** light_load

- Import Time: 0.64 ms
- Relative Time: 2.04x (vs baseline)
- Memory Peak: 348.18 MB
- Memory Avg: 348.16 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** medium_load

- Import Time: 3.30 ms
- Relative Time: 10.59x (vs baseline)
- Memory Peak: 348.86 MB
- Memory Avg: 348.52 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** heavy_load

- Import Time: 8.67 ms
- Relative Time: 27.84x (vs baseline)
- Memory Peak: 350.89 MB
- Memory Avg: 349.94 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** enterprise_load 🥈

- Import Time: 23.15 ms
- Relative Time: 74.30x (vs baseline)
- Memory Peak: 356.77 MB
- Memory Avg: 353.91 MB
- Package Size: 0.00 MB
- Features: auto_install

##### pylazyimports 🥇

**Test:** light_load

- Import Time: 0.65 ms
- Relative Time: 2.08x (vs baseline)
- Memory Peak: 366.73 MB
- Memory Avg: 366.72 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load 🥇

- Import Time: 2.37 ms
- Relative Time: 7.59x (vs baseline)
- Memory Peak: 368.29 MB
- Memory Avg: 367.52 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 8.42 ms
- Relative Time: 27.01x (vs baseline)
- Memory Peak: 370.51 MB
- Memory Avg: 369.40 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 23.46 ms
- Relative Time: 75.28x (vs baseline)
- Memory Peak: 376.61 MB
- Memory Avg: 373.56 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### xwlazy 🥈

**Test:** light_load

- Import Time: 0.49 ms
- Relative Time: 1.58x (vs baseline)
- Memory Peak: 396.85 MB
- Memory Avg: 396.84 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** medium_load 🥈

- Import Time: 2.37 ms
- Relative Time: 7.61x (vs baseline)
- Memory Peak: 399.04 MB
- Memory Avg: 398.24 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** heavy_load

- Import Time: 8.75 ms
- Relative Time: 28.08x (vs baseline)
- Memory Peak: 401.07 MB
- Memory Avg: 400.23 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** enterprise_load

- Import Time: 23.99 ms
- Relative Time: 76.99x (vs baseline)
- Memory Peak: 402.36 MB
- Memory Avg: 401.85 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring


### Full Features

*All features enabled (xwlazy showcase) - AUTO mode with optimizations*

#### Top 3 Rankings by Load Test

##### Enterprise Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | deferred-import | 22.74 | 72.98x |
| 2 🥈 | lazi | 23.36 | 74.95x |
| 3 🥉 | lazy-loader | 23.45 | 75.25x |

##### Heavy Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | pipimport | 7.88 | 25.29x |
| 2 🥈 | lazy_import | 8.01 | 25.69x |
| 3 🥉 | lazy-imports | 8.21 | 26.34x |

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazy-imports | 0.37 | 1.19x |
| 2 🥈 | deferred-import | 0.41 | 1.32x |
| 3 🥉 | lazi | 0.44 | 1.40x |

##### Medium Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazy-imports | 2.58 | 8.27x |
| 2 🥈 | pipimport | 2.60 | 8.35x |
| 3 🥉 | xwlazy | 2.70 | 8.65x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| deferred-import 🥈 | light_load | 0.41 | 1.32x | 444.95 | 0.00 | ✅ |
| deferred-import | medium_load | 3.36 | 10.79x | 444.95 | 0.00 | ✅ |
| deferred-import | heavy_load | 8.56 | 27.47x | 444.95 | 0.00 | ✅ |
| deferred-import 🥇 | enterprise_load | 22.74 | 72.98x | 445.00 | 0.00 | ✅ |
| lazi 🥉 | light_load | 0.44 | 1.40x | 461.55 | 0.00 | ✅ |
| lazi | medium_load | 3.10 | 9.95x | 462.65 | 0.00 | ✅ |
| lazi | heavy_load | 8.42 | 27.02x | 464.42 | 0.00 | ✅ |
| lazi 🥈 | enterprise_load | 23.36 | 74.95x | 471.29 | 0.00 | ✅ |
| lazy-imports 🥇 | light_load | 0.37 | 1.19x | 445.07 | 0.00 | ✅ |
| lazy-imports 🥇 | medium_load | 2.58 | 8.27x | 445.07 | 0.00 | ✅ |
| lazy-imports 🥉 | heavy_load | 8.21 | 26.34x | 445.08 | 0.00 | ✅ |
| lazy-imports | enterprise_load | 24.16 | 77.55x | 445.47 | 0.00 | ✅ |
| lazy-imports-lite | light_load | 0.48 | 1.55x | 471.38 | 0.00 | ✅ |
| lazy-imports-lite | medium_load | 2.70 | 8.67x | 472.39 | 0.00 | ✅ |
| lazy-imports-lite | heavy_load | 8.89 | 28.53x | 473.97 | 0.00 | ✅ |
| lazy-imports-lite | enterprise_load | 23.84 | 76.51x | 479.98 | 0.00 | ✅ |
| lazy-loader | light_load | 0.59 | 1.89x | 445.00 | 0.00 | ✅ |
| lazy-loader | medium_load | 2.78 | 8.92x | 445.00 | 0.00 | ✅ |
| lazy-loader | heavy_load | 8.85 | 28.39x | 445.00 | 0.00 | ✅ |
| lazy-loader 🥉 | enterprise_load | 23.45 | 75.25x | 445.07 | 0.00 | ✅ |
| lazy_import | light_load | 0.69 | 2.22x | 445.47 | 0.00 | ✅ |
| lazy_import | medium_load | 3.19 | 10.25x | 445.51 | 0.00 | ✅ |
| lazy_import 🥈 | heavy_load | 8.01 | 25.69x | 446.59 | 0.00 | ✅ |
| lazy_import | enterprise_load | 23.80 | 76.36x | 451.79 | 0.00 | ✅ |
| pipimport | light_load | 0.72 | 2.30x | 444.86 | 0.00 | ✅ |
| pipimport 🥈 | medium_load | 2.60 | 8.35x | 444.87 | 0.00 | ✅ |
| pipimport 🥇 | heavy_load | 7.88 | 25.29x | 444.87 | 0.00 | ✅ |
| pipimport | enterprise_load | 24.19 | 77.64x | 444.95 | 0.00 | ✅ |
| pylazyimports | light_load | 0.72 | 2.31x | 452.12 | 0.00 | ✅ |
| pylazyimports | medium_load | 3.15 | 10.11x | 452.70 | 0.00 | ✅ |
| pylazyimports | heavy_load | 8.53 | 27.38x | 454.67 | 0.00 | ✅ |
| pylazyimports | enterprise_load | 23.56 | 75.62x | 461.45 | 0.00 | ✅ |
| xwlazy | light_load | 0.58 | 1.87x | 480.07 | 0.00 | ✅ |
| xwlazy 🥉 | medium_load | 2.70 | 8.65x | 480.95 | 0.00 | ✅ |
| xwlazy | heavy_load | 8.88 | 28.50x | 483.03 | 0.00 | ✅ |
| xwlazy | enterprise_load | 24.22 | 77.73x | 485.18 | 0.00 | ✅ |

#### Detailed Results

##### deferred-import 🥇

**Test:** light_load 🥈

- Import Time: 0.41 ms
- Relative Time: 1.32x (vs baseline)
- Memory Peak: 444.95 MB
- Memory Avg: 444.95 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** medium_load

- Import Time: 3.36 ms
- Relative Time: 10.79x (vs baseline)
- Memory Peak: 444.95 MB
- Memory Avg: 444.95 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** heavy_load

- Import Time: 8.56 ms
- Relative Time: 27.47x (vs baseline)
- Memory Peak: 444.95 MB
- Memory Avg: 444.95 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** enterprise_load 🥇

- Import Time: 22.74 ms
- Relative Time: 72.98x (vs baseline)
- Memory Peak: 445.00 MB
- Memory Avg: 444.98 MB
- Package Size: 0.00 MB
- Features: deferred_loading

##### lazi 🥈

**Test:** light_load 🥉

- Import Time: 0.44 ms
- Relative Time: 1.40x (vs baseline)
- Memory Peak: 461.55 MB
- Memory Avg: 461.55 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** medium_load

- Import Time: 3.10 ms
- Relative Time: 9.95x (vs baseline)
- Memory Peak: 462.65 MB
- Memory Avg: 462.11 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** heavy_load

- Import Time: 8.42 ms
- Relative Time: 27.02x (vs baseline)
- Memory Peak: 464.42 MB
- Memory Avg: 463.55 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** enterprise_load 🥈

- Import Time: 23.36 ms
- Relative Time: 74.95x (vs baseline)
- Memory Peak: 471.29 MB
- Memory Avg: 467.86 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

##### lazy-imports 🥇

**Test:** light_load 🥇

- Import Time: 0.37 ms
- Relative Time: 1.19x (vs baseline)
- Memory Peak: 445.07 MB
- Memory Avg: 445.07 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load 🥇

- Import Time: 2.58 ms
- Relative Time: 8.27x (vs baseline)
- Memory Peak: 445.07 MB
- Memory Avg: 445.07 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load 🥉

- Import Time: 8.21 ms
- Relative Time: 26.34x (vs baseline)
- Memory Peak: 445.08 MB
- Memory Avg: 445.08 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 24.16 ms
- Relative Time: 77.55x (vs baseline)
- Memory Peak: 445.47 MB
- Memory Avg: 445.27 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### lazy-imports-lite

**Test:** light_load

- Import Time: 0.48 ms
- Relative Time: 1.55x (vs baseline)
- Memory Peak: 471.38 MB
- Memory Avg: 471.37 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** medium_load

- Import Time: 2.70 ms
- Relative Time: 8.67x (vs baseline)
- Memory Peak: 472.39 MB
- Memory Avg: 471.88 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** heavy_load

- Import Time: 8.89 ms
- Relative Time: 28.53x (vs baseline)
- Memory Peak: 473.97 MB
- Memory Avg: 473.18 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** enterprise_load

- Import Time: 23.84 ms
- Relative Time: 76.51x (vs baseline)
- Memory Peak: 479.98 MB
- Memory Avg: 476.97 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

##### lazy-loader 🥉

**Test:** light_load

- Import Time: 0.59 ms
- Relative Time: 1.89x (vs baseline)
- Memory Peak: 445.00 MB
- Memory Avg: 445.00 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** medium_load

- Import Time: 2.78 ms
- Relative Time: 8.92x (vs baseline)
- Memory Peak: 445.00 MB
- Memory Avg: 445.00 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** heavy_load

- Import Time: 8.85 ms
- Relative Time: 28.39x (vs baseline)
- Memory Peak: 445.00 MB
- Memory Avg: 445.00 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** enterprise_load 🥉

- Import Time: 23.45 ms
- Relative Time: 75.25x (vs baseline)
- Memory Peak: 445.07 MB
- Memory Avg: 445.03 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

##### lazy_import 🥈

**Test:** light_load

- Import Time: 0.69 ms
- Relative Time: 2.22x (vs baseline)
- Memory Peak: 445.47 MB
- Memory Avg: 445.47 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 3.19 ms
- Relative Time: 10.25x (vs baseline)
- Memory Peak: 445.51 MB
- Memory Avg: 445.49 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load 🥈

- Import Time: 8.01 ms
- Relative Time: 25.69x (vs baseline)
- Memory Peak: 446.59 MB
- Memory Avg: 446.05 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 23.80 ms
- Relative Time: 76.36x (vs baseline)
- Memory Peak: 451.79 MB
- Memory Avg: 449.19 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### pipimport 🥇

**Test:** light_load

- Import Time: 0.72 ms
- Relative Time: 2.30x (vs baseline)
- Memory Peak: 444.86 MB
- Memory Avg: 444.85 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** medium_load 🥈

- Import Time: 2.60 ms
- Relative Time: 8.35x (vs baseline)
- Memory Peak: 444.87 MB
- Memory Avg: 444.86 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** heavy_load 🥇

- Import Time: 7.88 ms
- Relative Time: 25.29x (vs baseline)
- Memory Peak: 444.87 MB
- Memory Avg: 444.87 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** enterprise_load

- Import Time: 24.19 ms
- Relative Time: 77.64x (vs baseline)
- Memory Peak: 444.95 MB
- Memory Avg: 444.91 MB
- Package Size: 0.00 MB
- Features: auto_install

##### pylazyimports

**Test:** light_load

- Import Time: 0.72 ms
- Relative Time: 2.31x (vs baseline)
- Memory Peak: 452.12 MB
- Memory Avg: 452.12 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 3.15 ms
- Relative Time: 10.11x (vs baseline)
- Memory Peak: 452.70 MB
- Memory Avg: 452.41 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 8.53 ms
- Relative Time: 27.38x (vs baseline)
- Memory Peak: 454.67 MB
- Memory Avg: 453.69 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 23.56 ms
- Relative Time: 75.62x (vs baseline)
- Memory Peak: 461.45 MB
- Memory Avg: 458.06 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### xwlazy 🥉

**Test:** light_load

- Import Time: 0.58 ms
- Relative Time: 1.87x (vs baseline)
- Memory Peak: 480.07 MB
- Memory Avg: 480.06 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** medium_load 🥉

- Import Time: 2.70 ms
- Relative Time: 8.65x (vs baseline)
- Memory Peak: 480.95 MB
- Memory Avg: 480.71 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** heavy_load

- Import Time: 8.88 ms
- Relative Time: 28.50x (vs baseline)
- Memory Peak: 483.03 MB
- Memory Avg: 482.25 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** enterprise_load

- Import Time: 24.22 ms
- Relative Time: 77.73x (vs baseline)
- Memory Peak: 485.18 MB
- Memory Avg: 484.13 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring


### Full Install Mode

*Install all dependencies on start - FULL mode*

#### Top 3 Rankings by Load Test

##### Enterprise Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazy-imports | 22.26 | 71.45x |
| 2 🥈 | pipimport | 22.67 | 72.75x |
| 3 🥉 | lazy_import | 22.84 | 73.30x |

##### Heavy Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazy-imports-lite | 8.02 | 25.73x |
| 2 🥈 | pipimport | 8.11 | 26.02x |
| 3 🥉 | lazy_import | 8.23 | 26.42x |

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazi | 0.37 | 1.17x |
| 2 🥈 | lazy-imports | 0.46 | 1.46x |
| 3 🥉 | deferred-import | 0.46 | 1.49x |

##### Medium Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 2.31 | 7.42x |
| 2 🥈 | lazy_import | 2.46 | 7.90x |
| 3 🥉 | lazy-loader | 2.62 | 8.41x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| deferred-import 🥉 | light_load | 0.46 | 1.49x | 294.50 | 0.00 | ✅ |
| deferred-import | medium_load | 2.99 | 9.58x | 295.42 | 0.00 | ✅ |
| deferred-import | heavy_load | 8.82 | 28.30x | 297.76 | 0.00 | ✅ |
| deferred-import | enterprise_load | 22.88 | 73.43x | 303.15 | 0.00 | ✅ |
| lazi 🥇 | light_load | 0.37 | 1.17x | 319.84 | 0.00 | ✅ |
| lazi | medium_load | 3.09 | 9.93x | 320.05 | 0.00 | ✅ |
| lazi | heavy_load | 8.69 | 27.89x | 320.72 | 0.00 | ✅ |
| lazi | enterprise_load | 24.07 | 77.25x | 326.99 | 0.00 | ✅ |
| lazy-imports 🥈 | light_load | 0.46 | 1.46x | 313.98 | 0.00 | ✅ |
| lazy-imports | medium_load | 2.79 | 8.94x | 315.21 | 0.00 | ✅ |
| lazy-imports | heavy_load | 8.60 | 27.59x | 317.23 | 0.00 | ✅ |
| lazy-imports 🥇 | enterprise_load | 22.26 | 71.45x | 319.50 | 0.00 | ✅ |
| lazy-imports-lite | light_load | 0.50 | 1.62x | 327.08 | 0.00 | ✅ |
| lazy-imports-lite | medium_load | 2.67 | 8.56x | 327.86 | 0.00 | ✅ |
| lazy-imports-lite 🥇 | heavy_load | 8.02 | 25.73x | 329.68 | 0.00 | ✅ |
| lazy-imports-lite | enterprise_load | 23.65 | 75.91x | 336.77 | 0.00 | ✅ |
| lazy-loader | light_load | 0.92 | 2.96x | 303.25 | 0.00 | ✅ |
| lazy-loader 🥉 | medium_load | 2.62 | 8.41x | 304.36 | 0.00 | ✅ |
| lazy-loader | heavy_load | 8.81 | 28.27x | 305.88 | 0.00 | ✅ |
| lazy-loader | enterprise_load | 23.29 | 74.76x | 313.89 | 0.00 | ✅ |
| lazy_import | light_load | 0.61 | 1.95x | 319.51 | 0.00 | ✅ |
| lazy_import 🥈 | medium_load | 2.46 | 7.90x | 319.51 | 0.00 | ✅ |
| lazy_import 🥉 | heavy_load | 8.23 | 26.42x | 319.51 | 0.00 | ✅ |
| lazy_import 🥉 | enterprise_load | 22.84 | 73.30x | 319.56 | 0.00 | ✅ |
| pipimport | light_load | 0.63 | 2.02x | 286.15 | 0.00 | ✅ |
| pipimport | medium_load | 3.04 | 9.75x | 286.87 | 0.00 | ✅ |
| pipimport 🥈 | heavy_load | 8.11 | 26.02x | 288.75 | 0.00 | ✅ |
| pipimport 🥈 | enterprise_load | 22.67 | 72.75x | 294.33 | 0.00 | ✅ |
| pylazyimports | light_load | 0.68 | 2.17x | 319.56 | 0.00 | ✅ |
| pylazyimports | medium_load | 2.74 | 8.79x | 319.56 | 0.00 | ✅ |
| pylazyimports | heavy_load | 8.54 | 27.40x | 319.57 | 0.00 | ✅ |
| pylazyimports | enterprise_load | 23.51 | 75.46x | 319.84 | 0.00 | ✅ |
| xwlazy | light_load | 0.82 | 2.62x | 336.86 | 0.00 | ✅ |
| xwlazy 🥇 | medium_load | 2.31 | 7.42x | 338.61 | 0.00 | ✅ |
| xwlazy | heavy_load | 8.47 | 27.18x | 341.59 | 0.00 | ✅ |
| xwlazy | enterprise_load | 23.58 | 75.66x | 347.28 | 0.00 | ✅ |

#### Detailed Results

##### deferred-import 🥉

**Test:** light_load 🥉

- Import Time: 0.46 ms
- Relative Time: 1.49x (vs baseline)
- Memory Peak: 294.50 MB
- Memory Avg: 294.48 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** medium_load

- Import Time: 2.99 ms
- Relative Time: 9.58x (vs baseline)
- Memory Peak: 295.42 MB
- Memory Avg: 294.96 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** heavy_load

- Import Time: 8.82 ms
- Relative Time: 28.30x (vs baseline)
- Memory Peak: 297.76 MB
- Memory Avg: 296.62 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** enterprise_load

- Import Time: 22.88 ms
- Relative Time: 73.43x (vs baseline)
- Memory Peak: 303.15 MB
- Memory Avg: 300.46 MB
- Package Size: 0.00 MB
- Features: deferred_loading

##### lazi 🥇

**Test:** light_load 🥇

- Import Time: 0.37 ms
- Relative Time: 1.17x (vs baseline)
- Memory Peak: 319.84 MB
- Memory Avg: 319.84 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** medium_load

- Import Time: 3.09 ms
- Relative Time: 9.93x (vs baseline)
- Memory Peak: 320.05 MB
- Memory Avg: 319.95 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** heavy_load

- Import Time: 8.69 ms
- Relative Time: 27.89x (vs baseline)
- Memory Peak: 320.72 MB
- Memory Avg: 320.38 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** enterprise_load

- Import Time: 24.07 ms
- Relative Time: 77.25x (vs baseline)
- Memory Peak: 326.99 MB
- Memory Avg: 323.86 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

##### lazy-imports 🥇

**Test:** light_load 🥈

- Import Time: 0.46 ms
- Relative Time: 1.46x (vs baseline)
- Memory Peak: 313.98 MB
- Memory Avg: 313.98 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 2.79 ms
- Relative Time: 8.94x (vs baseline)
- Memory Peak: 315.21 MB
- Memory Avg: 314.60 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 8.60 ms
- Relative Time: 27.59x (vs baseline)
- Memory Peak: 317.23 MB
- Memory Avg: 316.22 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load 🥇

- Import Time: 22.26 ms
- Relative Time: 71.45x (vs baseline)
- Memory Peak: 319.50 MB
- Memory Avg: 318.37 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### lazy-imports-lite 🥇

**Test:** light_load

- Import Time: 0.50 ms
- Relative Time: 1.62x (vs baseline)
- Memory Peak: 327.08 MB
- Memory Avg: 327.07 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** medium_load

- Import Time: 2.67 ms
- Relative Time: 8.56x (vs baseline)
- Memory Peak: 327.86 MB
- Memory Avg: 327.47 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** heavy_load 🥇

- Import Time: 8.02 ms
- Relative Time: 25.73x (vs baseline)
- Memory Peak: 329.68 MB
- Memory Avg: 328.78 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** enterprise_load

- Import Time: 23.65 ms
- Relative Time: 75.91x (vs baseline)
- Memory Peak: 336.77 MB
- Memory Avg: 333.23 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

##### lazy-loader 🥉

**Test:** light_load

- Import Time: 0.92 ms
- Relative Time: 2.96x (vs baseline)
- Memory Peak: 303.25 MB
- Memory Avg: 303.23 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** medium_load 🥉

- Import Time: 2.62 ms
- Relative Time: 8.41x (vs baseline)
- Memory Peak: 304.36 MB
- Memory Avg: 303.81 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** heavy_load

- Import Time: 8.81 ms
- Relative Time: 28.27x (vs baseline)
- Memory Peak: 305.88 MB
- Memory Avg: 305.12 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** enterprise_load

- Import Time: 23.29 ms
- Relative Time: 74.76x (vs baseline)
- Memory Peak: 313.89 MB
- Memory Avg: 309.88 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

##### lazy_import 🥈

**Test:** light_load

- Import Time: 0.61 ms
- Relative Time: 1.95x (vs baseline)
- Memory Peak: 319.51 MB
- Memory Avg: 319.51 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load 🥈

- Import Time: 2.46 ms
- Relative Time: 7.90x (vs baseline)
- Memory Peak: 319.51 MB
- Memory Avg: 319.51 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load 🥉

- Import Time: 8.23 ms
- Relative Time: 26.42x (vs baseline)
- Memory Peak: 319.51 MB
- Memory Avg: 319.51 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load 🥉

- Import Time: 22.84 ms
- Relative Time: 73.30x (vs baseline)
- Memory Peak: 319.56 MB
- Memory Avg: 319.54 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### pipimport 🥈

**Test:** light_load

- Import Time: 0.63 ms
- Relative Time: 2.02x (vs baseline)
- Memory Peak: 286.15 MB
- Memory Avg: 286.13 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** medium_load

- Import Time: 3.04 ms
- Relative Time: 9.75x (vs baseline)
- Memory Peak: 286.87 MB
- Memory Avg: 286.52 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** heavy_load 🥈

- Import Time: 8.11 ms
- Relative Time: 26.02x (vs baseline)
- Memory Peak: 288.75 MB
- Memory Avg: 287.81 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** enterprise_load 🥈

- Import Time: 22.67 ms
- Relative Time: 72.75x (vs baseline)
- Memory Peak: 294.33 MB
- Memory Avg: 291.63 MB
- Package Size: 0.00 MB
- Features: auto_install

##### pylazyimports

**Test:** light_load

- Import Time: 0.68 ms
- Relative Time: 2.17x (vs baseline)
- Memory Peak: 319.56 MB
- Memory Avg: 319.56 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 2.74 ms
- Relative Time: 8.79x (vs baseline)
- Memory Peak: 319.56 MB
- Memory Avg: 319.56 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 8.54 ms
- Relative Time: 27.40x (vs baseline)
- Memory Peak: 319.57 MB
- Memory Avg: 319.57 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 23.51 ms
- Relative Time: 75.46x (vs baseline)
- Memory Peak: 319.84 MB
- Memory Avg: 319.71 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### xwlazy 🥇

**Test:** light_load

- Import Time: 0.82 ms
- Relative Time: 2.62x (vs baseline)
- Memory Peak: 336.86 MB
- Memory Avg: 336.86 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** medium_load 🥇

- Import Time: 2.31 ms
- Relative Time: 7.42x (vs baseline)
- Memory Peak: 338.61 MB
- Memory Avg: 338.29 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** heavy_load

- Import Time: 8.47 ms
- Relative Time: 27.18x (vs baseline)
- Memory Peak: 341.59 MB
- Memory Avg: 340.38 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** enterprise_load

- Import Time: 23.58 ms
- Relative Time: 75.66x (vs baseline)
- Memory Peak: 347.28 MB
- Memory Avg: 344.68 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring


### Background Loading

*Background loading - BACKGROUND mode*

#### Top 3 Rankings by Load Test

##### Enterprise Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazi | 22.54 | 72.33x |
| 2 🥈 | pylazyimports | 23.23 | 74.57x |
| 3 🥉 | xwlazy | 23.39 | 75.07x |

##### Heavy Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | pylazyimports | 7.73 | 24.81x |
| 2 🥈 | lazy-imports-lite | 7.73 | 24.81x |
| 3 🥉 | lazy_import | 8.03 | 25.78x |

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazi | 0.29 | 0.94x |
| 2 🥈 | lazy-imports-lite | 0.34 | 1.10x |
| 3 🥉 | lazy-imports | 0.44 | 1.40x |

##### Medium Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 2.39 | 7.66x |
| 2 🥈 | lazy-loader | 2.42 | 7.77x |
| 3 🥉 | lazy-imports-lite | 2.50 | 8.02x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| deferred-import | light_load | 0.63 | 2.01x | 236.24 | 0.00 | ✅ |
| deferred-import | medium_load | 3.19 | 10.23x | 237.34 | 0.00 | ✅ |
| deferred-import | heavy_load | 8.22 | 26.37x | 239.26 | 0.00 | ✅ |
| deferred-import | enterprise_load | 23.74 | 76.18x | 240.79 | 0.00 | ✅ |
| lazi 🥇 | light_load | 0.29 | 0.94x | 272.93 | 0.00 | ✅ |
| lazi | medium_load | 2.85 | 9.15x | 274.17 | 0.00 | ✅ |
| lazi | heavy_load | 8.42 | 27.01x | 276.65 | 0.00 | ✅ |
| lazi 🥇 | enterprise_load | 22.54 | 72.33x | 278.54 | 0.00 | ✅ |
| lazy-imports 🥉 | light_load | 0.44 | 1.40x | 242.85 | 0.00 | ✅ |
| lazy-imports | medium_load | 2.50 | 8.03x | 244.14 | 0.00 | ✅ |
| lazy-imports | heavy_load | 8.03 | 25.78x | 246.03 | 0.00 | ✅ |
| lazy-imports | enterprise_load | 23.52 | 75.47x | 251.86 | 0.00 | ✅ |
| lazy-imports-lite 🥈 | light_load | 0.34 | 1.10x | 278.55 | 0.00 | ✅ |
| lazy-imports-lite 🥉 | medium_load | 2.50 | 8.02x | 278.55 | 0.00 | ✅ |
| lazy-imports-lite 🥈 | heavy_load | 7.73 | 24.81x | 278.55 | 0.00 | ✅ |
| lazy-imports-lite | enterprise_load | 23.48 | 75.35x | 278.91 | 0.00 | ✅ |
| lazy-loader | light_load | 0.52 | 1.68x | 240.79 | 0.00 | ✅ |
| lazy-loader 🥈 | medium_load | 2.42 | 7.77x | 240.81 | 0.00 | ✅ |
| lazy-loader | heavy_load | 8.44 | 27.09x | 240.81 | 0.00 | ✅ |
| lazy-loader | enterprise_load | 24.76 | 79.45x | 242.76 | 0.00 | ✅ |
| lazy_import | light_load | 0.72 | 2.30x | 251.99 | 0.00 | ✅ |
| lazy_import | medium_load | 2.75 | 8.82x | 252.70 | 0.00 | ✅ |
| lazy_import 🥉 | heavy_load | 8.03 | 25.78x | 254.62 | 0.00 | ✅ |
| lazy_import | enterprise_load | 23.68 | 75.99x | 262.57 | 0.00 | ✅ |
| pipimport | light_load | 0.67 | 2.15x | 227.42 | 0.00 | ✅ |
| pipimport | medium_load | 2.63 | 8.45x | 228.35 | 0.00 | ✅ |
| pipimport | heavy_load | 8.07 | 25.91x | 230.32 | 0.00 | ✅ |
| pipimport | enterprise_load | 24.52 | 78.68x | 235.97 | 0.00 | ✅ |
| pylazyimports | light_load | 0.72 | 2.31x | 262.66 | 0.00 | ✅ |
| pylazyimports | medium_load | 2.73 | 8.75x | 264.04 | 0.00 | ✅ |
| pylazyimports 🥇 | heavy_load | 7.73 | 24.81x | 266.05 | 0.00 | ✅ |
| pylazyimports 🥈 | enterprise_load | 23.23 | 74.57x | 272.79 | 0.00 | ✅ |
| xwlazy | light_load | 0.64 | 2.06x | 278.91 | 0.00 | ✅ |
| xwlazy 🥇 | medium_load | 2.39 | 7.66x | 279.27 | 0.00 | ✅ |
| xwlazy | heavy_load | 8.39 | 26.94x | 279.95 | 0.00 | ✅ |
| xwlazy 🥉 | enterprise_load | 23.39 | 75.07x | 285.69 | 0.00 | ✅ |

#### Detailed Results

##### deferred-import

**Test:** light_load

- Import Time: 0.63 ms
- Relative Time: 2.01x (vs baseline)
- Memory Peak: 236.24 MB
- Memory Avg: 236.23 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** medium_load

- Import Time: 3.19 ms
- Relative Time: 10.23x (vs baseline)
- Memory Peak: 237.34 MB
- Memory Avg: 236.79 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** heavy_load

- Import Time: 8.22 ms
- Relative Time: 26.37x (vs baseline)
- Memory Peak: 239.26 MB
- Memory Avg: 238.30 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** enterprise_load

- Import Time: 23.74 ms
- Relative Time: 76.18x (vs baseline)
- Memory Peak: 240.79 MB
- Memory Avg: 240.03 MB
- Package Size: 0.00 MB
- Features: deferred_loading

##### lazi 🥇

**Test:** light_load 🥇

- Import Time: 0.29 ms
- Relative Time: 0.94x (vs baseline)
- Memory Peak: 272.93 MB
- Memory Avg: 272.92 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** medium_load

- Import Time: 2.85 ms
- Relative Time: 9.15x (vs baseline)
- Memory Peak: 274.17 MB
- Memory Avg: 273.55 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** heavy_load

- Import Time: 8.42 ms
- Relative Time: 27.01x (vs baseline)
- Memory Peak: 276.65 MB
- Memory Avg: 275.41 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** enterprise_load 🥇

- Import Time: 22.54 ms
- Relative Time: 72.33x (vs baseline)
- Memory Peak: 278.54 MB
- Memory Avg: 277.62 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

##### lazy-imports 🥉

**Test:** light_load 🥉

- Import Time: 0.44 ms
- Relative Time: 1.40x (vs baseline)
- Memory Peak: 242.85 MB
- Memory Avg: 242.85 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 2.50 ms
- Relative Time: 8.03x (vs baseline)
- Memory Peak: 244.14 MB
- Memory Avg: 243.50 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 8.03 ms
- Relative Time: 25.78x (vs baseline)
- Memory Peak: 246.03 MB
- Memory Avg: 245.10 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 23.52 ms
- Relative Time: 75.47x (vs baseline)
- Memory Peak: 251.86 MB
- Memory Avg: 248.94 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### lazy-imports-lite 🥈

**Test:** light_load 🥈

- Import Time: 0.34 ms
- Relative Time: 1.10x (vs baseline)
- Memory Peak: 278.55 MB
- Memory Avg: 278.55 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** medium_load 🥉

- Import Time: 2.50 ms
- Relative Time: 8.02x (vs baseline)
- Memory Peak: 278.55 MB
- Memory Avg: 278.55 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** heavy_load 🥈

- Import Time: 7.73 ms
- Relative Time: 24.81x (vs baseline)
- Memory Peak: 278.55 MB
- Memory Avg: 278.55 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** enterprise_load

- Import Time: 23.48 ms
- Relative Time: 75.35x (vs baseline)
- Memory Peak: 278.91 MB
- Memory Avg: 278.73 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

##### lazy-loader 🥈

**Test:** light_load

- Import Time: 0.52 ms
- Relative Time: 1.68x (vs baseline)
- Memory Peak: 240.79 MB
- Memory Avg: 240.79 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** medium_load 🥈

- Import Time: 2.42 ms
- Relative Time: 7.77x (vs baseline)
- Memory Peak: 240.81 MB
- Memory Avg: 240.80 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** heavy_load

- Import Time: 8.44 ms
- Relative Time: 27.09x (vs baseline)
- Memory Peak: 240.81 MB
- Memory Avg: 240.81 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** enterprise_load

- Import Time: 24.76 ms
- Relative Time: 79.45x (vs baseline)
- Memory Peak: 242.76 MB
- Memory Avg: 241.78 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

##### lazy_import 🥉

**Test:** light_load

- Import Time: 0.72 ms
- Relative Time: 2.30x (vs baseline)
- Memory Peak: 251.99 MB
- Memory Avg: 251.96 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 2.75 ms
- Relative Time: 8.82x (vs baseline)
- Memory Peak: 252.70 MB
- Memory Avg: 252.36 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load 🥉

- Import Time: 8.03 ms
- Relative Time: 25.78x (vs baseline)
- Memory Peak: 254.62 MB
- Memory Avg: 253.67 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 23.68 ms
- Relative Time: 75.99x (vs baseline)
- Memory Peak: 262.57 MB
- Memory Avg: 258.59 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### pipimport

**Test:** light_load

- Import Time: 0.67 ms
- Relative Time: 2.15x (vs baseline)
- Memory Peak: 227.42 MB
- Memory Avg: 227.32 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** medium_load

- Import Time: 2.63 ms
- Relative Time: 8.45x (vs baseline)
- Memory Peak: 228.35 MB
- Memory Avg: 227.88 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** heavy_load

- Import Time: 8.07 ms
- Relative Time: 25.91x (vs baseline)
- Memory Peak: 230.32 MB
- Memory Avg: 229.44 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** enterprise_load

- Import Time: 24.52 ms
- Relative Time: 78.68x (vs baseline)
- Memory Peak: 235.97 MB
- Memory Avg: 233.25 MB
- Package Size: 0.00 MB
- Features: auto_install

##### pylazyimports 🥇

**Test:** light_load

- Import Time: 0.72 ms
- Relative Time: 2.31x (vs baseline)
- Memory Peak: 262.66 MB
- Memory Avg: 262.65 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 2.73 ms
- Relative Time: 8.75x (vs baseline)
- Memory Peak: 264.04 MB
- Memory Avg: 263.35 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load 🥇

- Import Time: 7.73 ms
- Relative Time: 24.81x (vs baseline)
- Memory Peak: 266.05 MB
- Memory Avg: 265.05 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load 🥈

- Import Time: 23.23 ms
- Relative Time: 74.57x (vs baseline)
- Memory Peak: 272.79 MB
- Memory Avg: 269.44 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### xwlazy 🥇

**Test:** light_load

- Import Time: 0.64 ms
- Relative Time: 2.06x (vs baseline)
- Memory Peak: 278.91 MB
- Memory Avg: 278.91 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** medium_load 🥇

- Import Time: 2.39 ms
- Relative Time: 7.66x (vs baseline)
- Memory Peak: 279.27 MB
- Memory Avg: 279.18 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** heavy_load

- Import Time: 8.39 ms
- Relative Time: 26.94x (vs baseline)
- Memory Peak: 279.95 MB
- Memory Avg: 279.69 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** enterprise_load 🥉

- Import Time: 23.39 ms
- Relative Time: 75.07x (vs baseline)
- Memory Peak: 285.69 MB
- Memory Avg: 283.11 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring


### Lazy Import + Install

*Lazy import + auto-install - SMART mode (on-demand)*

#### Top 3 Rankings by Load Test

##### Enterprise Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazy-imports-lite | 23.12 | 74.20x |
| 2 🥈 | lazi | 23.24 | 74.59x |
| 3 🥉 | pylazyimports | 23.25 | 74.60x |

##### Heavy Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | pylazyimports | 8.34 | 26.76x |
| 2 🥈 | xwlazy | 8.38 | 26.89x |
| 3 🥉 | deferred-import | 8.41 | 26.98x |

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazi | 0.36 | 1.17x |
| 2 🥈 | lazy-loader | 0.46 | 1.49x |
| 3 🥉 | xwlazy | 0.47 | 1.50x |

##### Medium Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazy-imports-lite | 2.52 | 8.10x |
| 2 🥈 | pipimport | 2.55 | 8.18x |
| 3 🥉 | xwlazy | 2.93 | 9.41x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| deferred-import | light_load | 0.55 | 1.76x | 108.47 | 0.00 | ✅ |
| deferred-import | medium_load | 3.09 | 9.93x | 109.12 | 0.00 | ✅ |
| deferred-import 🥉 | heavy_load | 8.41 | 26.98x | 110.90 | 0.00 | ✅ |
| deferred-import | enterprise_load | 23.65 | 75.88x | 116.00 | 0.00 | ✅ |
| lazi 🥇 | light_load | 0.36 | 1.17x | 142.36 | 0.00 | ✅ |
| lazi | medium_load | 3.14 | 10.08x | 142.84 | 0.00 | ✅ |
| lazi | heavy_load | 8.63 | 27.69x | 144.73 | 0.00 | ✅ |
| lazi 🥈 | enterprise_load | 23.24 | 74.59x | 149.97 | 0.00 | ✅ |
| lazy-imports | light_load | 0.67 | 2.16x | 124.12 | 0.00 | ✅ |
| lazy-imports | medium_load | 3.18 | 10.20x | 124.13 | 0.00 | ✅ |
| lazy-imports | heavy_load | 9.17 | 29.42x | 124.15 | 0.00 | ✅ |
| lazy-imports | enterprise_load | 24.87 | 79.83x | 128.57 | 0.00 | ✅ |
| lazy-imports-lite | light_load | 0.52 | 1.67x | 150.09 | 0.00 | ✅ |
| lazy-imports-lite 🥇 | medium_load | 2.52 | 8.10x | 151.09 | 0.00 | ✅ |
| lazy-imports-lite | heavy_load | 8.47 | 27.18x | 153.80 | 0.00 | ✅ |
| lazy-imports-lite 🥇 | enterprise_load | 23.12 | 74.20x | 159.91 | 0.00 | ✅ |
| lazy-loader 🥈 | light_load | 0.46 | 1.49x | 116.09 | 0.00 | ✅ |
| lazy-loader | medium_load | 3.00 | 9.64x | 116.89 | 0.00 | ✅ |
| lazy-loader | heavy_load | 9.72 | 31.18x | 118.92 | 0.00 | ✅ |
| lazy-loader | enterprise_load | 26.94 | 86.46x | 124.12 | 0.00 | ✅ |
| lazy_import | light_load | 0.68 | 2.18x | 128.71 | 0.00 | ✅ |
| lazy_import | medium_load | 3.00 | 9.62x | 129.89 | 0.00 | ✅ |
| lazy_import | heavy_load | 9.85 | 31.62x | 132.24 | 0.00 | ✅ |
| lazy_import | enterprise_load | 23.94 | 76.82x | 138.33 | 0.00 | ✅ |
| pipimport | light_load | 0.62 | 2.00x | 105.27 | 0.00 | ✅ |
| pipimport 🥈 | medium_load | 2.55 | 8.18x | 105.82 | 0.00 | ✅ |
| pipimport | heavy_load | 9.80 | 31.46x | 107.27 | 0.00 | ✅ |
| pipimport | enterprise_load | 23.39 | 75.08x | 108.29 | 0.00 | ✅ |
| pylazyimports | light_load | 0.71 | 2.26x | 138.44 | 0.00 | ✅ |
| pylazyimports | medium_load | 3.22 | 10.33x | 139.30 | 0.00 | ✅ |
| pylazyimports 🥇 | heavy_load | 8.34 | 26.76x | 141.68 | 0.00 | ✅ |
| pylazyimports 🥉 | enterprise_load | 23.25 | 74.60x | 142.34 | 0.00 | ✅ |
| xwlazy 🥉 | light_load | 0.47 | 1.50x | 160.08 | 0.00 | ✅ |
| xwlazy 🥉 | medium_load | 2.93 | 9.41x | 160.71 | 0.00 | ✅ |
| xwlazy 🥈 | heavy_load | 8.38 | 26.89x | 160.91 | 0.00 | ✅ |
| xwlazy | enterprise_load | 23.59 | 75.71x | 161.89 | 0.00 | ✅ |

#### Detailed Results

##### deferred-import 🥉

**Test:** light_load

- Import Time: 0.55 ms
- Relative Time: 1.76x (vs baseline)
- Memory Peak: 108.47 MB
- Memory Avg: 108.47 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** medium_load

- Import Time: 3.09 ms
- Relative Time: 9.93x (vs baseline)
- Memory Peak: 109.12 MB
- Memory Avg: 108.80 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** heavy_load 🥉

- Import Time: 8.41 ms
- Relative Time: 26.98x (vs baseline)
- Memory Peak: 110.90 MB
- Memory Avg: 110.01 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** enterprise_load

- Import Time: 23.65 ms
- Relative Time: 75.88x (vs baseline)
- Memory Peak: 116.00 MB
- Memory Avg: 113.45 MB
- Package Size: 0.00 MB
- Features: deferred_loading

##### lazi 🥇

**Test:** light_load 🥇

- Import Time: 0.36 ms
- Relative Time: 1.17x (vs baseline)
- Memory Peak: 142.36 MB
- Memory Avg: 142.36 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** medium_load

- Import Time: 3.14 ms
- Relative Time: 10.08x (vs baseline)
- Memory Peak: 142.84 MB
- Memory Avg: 142.60 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** heavy_load

- Import Time: 8.63 ms
- Relative Time: 27.69x (vs baseline)
- Memory Peak: 144.73 MB
- Memory Avg: 143.80 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** enterprise_load 🥈

- Import Time: 23.24 ms
- Relative Time: 74.59x (vs baseline)
- Memory Peak: 149.97 MB
- Memory Avg: 147.35 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

##### lazy-imports

**Test:** light_load

- Import Time: 0.67 ms
- Relative Time: 2.16x (vs baseline)
- Memory Peak: 124.12 MB
- Memory Avg: 124.12 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 3.18 ms
- Relative Time: 10.20x (vs baseline)
- Memory Peak: 124.13 MB
- Memory Avg: 124.13 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 9.17 ms
- Relative Time: 29.42x (vs baseline)
- Memory Peak: 124.15 MB
- Memory Avg: 124.14 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 24.87 ms
- Relative Time: 79.83x (vs baseline)
- Memory Peak: 128.57 MB
- Memory Avg: 126.36 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### lazy-imports-lite 🥇

**Test:** light_load

- Import Time: 0.52 ms
- Relative Time: 1.67x (vs baseline)
- Memory Peak: 150.09 MB
- Memory Avg: 150.08 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** medium_load 🥇

- Import Time: 2.52 ms
- Relative Time: 8.10x (vs baseline)
- Memory Peak: 151.09 MB
- Memory Avg: 150.59 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** heavy_load

- Import Time: 8.47 ms
- Relative Time: 27.18x (vs baseline)
- Memory Peak: 153.80 MB
- Memory Avg: 152.46 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** enterprise_load 🥇

- Import Time: 23.12 ms
- Relative Time: 74.20x (vs baseline)
- Memory Peak: 159.91 MB
- Memory Avg: 156.86 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

##### lazy-loader 🥈

**Test:** light_load 🥈

- Import Time: 0.46 ms
- Relative Time: 1.49x (vs baseline)
- Memory Peak: 116.09 MB
- Memory Avg: 116.08 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** medium_load

- Import Time: 3.00 ms
- Relative Time: 9.64x (vs baseline)
- Memory Peak: 116.89 MB
- Memory Avg: 116.50 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** heavy_load

- Import Time: 9.72 ms
- Relative Time: 31.18x (vs baseline)
- Memory Peak: 118.92 MB
- Memory Avg: 117.91 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** enterprise_load

- Import Time: 26.94 ms
- Relative Time: 86.46x (vs baseline)
- Memory Peak: 124.12 MB
- Memory Avg: 121.52 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

##### lazy_import

**Test:** light_load

- Import Time: 0.68 ms
- Relative Time: 2.18x (vs baseline)
- Memory Peak: 128.71 MB
- Memory Avg: 128.68 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 3.00 ms
- Relative Time: 9.62x (vs baseline)
- Memory Peak: 129.89 MB
- Memory Avg: 129.32 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 9.85 ms
- Relative Time: 31.62x (vs baseline)
- Memory Peak: 132.24 MB
- Memory Avg: 131.06 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 23.94 ms
- Relative Time: 76.82x (vs baseline)
- Memory Peak: 138.33 MB
- Memory Avg: 135.29 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### pipimport 🥈

**Test:** light_load

- Import Time: 0.62 ms
- Relative Time: 2.00x (vs baseline)
- Memory Peak: 105.27 MB
- Memory Avg: 105.24 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** medium_load 🥈

- Import Time: 2.55 ms
- Relative Time: 8.18x (vs baseline)
- Memory Peak: 105.82 MB
- Memory Avg: 105.54 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** heavy_load

- Import Time: 9.80 ms
- Relative Time: 31.46x (vs baseline)
- Memory Peak: 107.27 MB
- Memory Avg: 106.56 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** enterprise_load

- Import Time: 23.39 ms
- Relative Time: 75.08x (vs baseline)
- Memory Peak: 108.29 MB
- Memory Avg: 107.79 MB
- Package Size: 0.00 MB
- Features: auto_install

##### pylazyimports 🥇

**Test:** light_load

- Import Time: 0.71 ms
- Relative Time: 2.26x (vs baseline)
- Memory Peak: 138.44 MB
- Memory Avg: 138.43 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 3.22 ms
- Relative Time: 10.33x (vs baseline)
- Memory Peak: 139.30 MB
- Memory Avg: 138.87 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load 🥇

- Import Time: 8.34 ms
- Relative Time: 26.76x (vs baseline)
- Memory Peak: 141.68 MB
- Memory Avg: 140.49 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load 🥉

- Import Time: 23.25 ms
- Relative Time: 74.60x (vs baseline)
- Memory Peak: 142.34 MB
- Memory Avg: 142.01 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### xwlazy 🥈

**Test:** light_load 🥉

- Import Time: 0.47 ms
- Relative Time: 1.50x (vs baseline)
- Memory Peak: 160.08 MB
- Memory Avg: 160.07 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** medium_load 🥉

- Import Time: 2.93 ms
- Relative Time: 9.41x (vs baseline)
- Memory Peak: 160.71 MB
- Memory Avg: 160.59 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** heavy_load 🥈

- Import Time: 8.38 ms
- Relative Time: 26.89x (vs baseline)
- Memory Peak: 160.91 MB
- Memory Avg: 160.91 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** enterprise_load

- Import Time: 23.59 ms
- Relative Time: 75.71x (vs baseline)
- Memory Peak: 161.89 MB
- Memory Avg: 161.40 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring


### Basic Lazy Import

*Basic lazy import (fair comparison - all libraries) - LITE mode*

#### Top 3 Rankings by Load Test

##### Enterprise Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazy-imports | 22.41 | 71.91x |
| 2 🥈 | lazy_import | 22.83 | 73.27x |
| 3 🥉 | lazy-loader | 23.13 | 74.23x |

##### Heavy Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 8.13 | 26.11x |
| 2 🥈 | pipimport | 8.26 | 26.52x |
| 3 🥉 | deferred-import | 8.41 | 26.99x |

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazi | 0.30 | 0.96x |
| 2 🥈 | pylazyimports | 0.41 | 1.33x |
| 3 🥉 | xwlazy | 0.44 | 1.42x |

##### Medium Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazy-imports-lite | 2.45 | 7.87x |
| 2 🥈 | xwlazy | 2.67 | 8.55x |
| 3 🥉 | pipimport | 2.77 | 8.88x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| deferred-import | light_load | 0.47 | 1.51x | 41.66 | 0.00 | ✅ |
| deferred-import | medium_load | 3.00 | 9.61x | 42.58 | 0.00 | ✅ |
| deferred-import 🥉 | heavy_load | 8.41 | 26.99x | 44.70 | 0.00 | ✅ |
| deferred-import | enterprise_load | 23.24 | 74.57x | 49.26 | 0.00 | ✅ |
| lazi 🥇 | light_load | 0.30 | 0.96x | 80.61 | 0.00 | ✅ |
| lazi | medium_load | 3.27 | 10.48x | 81.18 | 0.00 | ✅ |
| lazi | heavy_load | 8.65 | 27.77x | 83.60 | 0.00 | ✅ |
| lazi | enterprise_load | 24.58 | 78.90x | 88.46 | 0.00 | ✅ |
| lazy-imports | light_load | 0.50 | 1.59x | 58.02 | 0.00 | ✅ |
| lazy-imports | medium_load | 2.81 | 9.02x | 58.96 | 0.00 | ✅ |
| lazy-imports | heavy_load | 9.10 | 29.21x | 61.26 | 0.00 | ✅ |
| lazy-imports 🥇 | enterprise_load | 22.41 | 71.91x | 66.82 | 0.00 | ✅ |
| lazy-imports-lite | light_load | 0.58 | 1.87x | 88.46 | 0.00 | ✅ |
| lazy-imports-lite 🥇 | medium_load | 2.45 | 7.87x | 88.46 | 0.00 | ✅ |
| lazy-imports-lite | heavy_load | 8.68 | 27.84x | 88.48 | 0.00 | ✅ |
| lazy-imports-lite | enterprise_load | 23.42 | 75.16x | 91.87 | 0.00 | ✅ |
| lazy-loader | light_load | 0.48 | 1.54x | 49.26 | 0.00 | ✅ |
| lazy-loader | medium_load | 3.07 | 9.85x | 49.29 | 0.00 | ✅ |
| lazy-loader | heavy_load | 8.93 | 28.64x | 50.66 | 0.00 | ✅ |
| lazy-loader 🥉 | enterprise_load | 23.13 | 74.23x | 57.86 | 0.00 | ✅ |
| lazy_import | light_load | 1.15 | 3.70x | 67.02 | 0.00 | ✅ |
| lazy_import | medium_load | 3.41 | 10.95x | 68.29 | 0.00 | ✅ |
| lazy_import | heavy_load | 9.73 | 31.23x | 70.21 | 0.00 | ✅ |
| lazy_import 🥈 | enterprise_load | 22.83 | 73.27x | 71.43 | 0.00 | ✅ |
| pipimport | light_load | 0.64 | 2.05x | 28.25 | 0.00 | ✅ |
| pipimport 🥉 | medium_load | 2.77 | 8.88x | 29.63 | 0.00 | ✅ |
| pipimport 🥈 | heavy_load | 8.26 | 26.52x | 33.43 | 0.00 | ✅ |
| pipimport | enterprise_load | 23.60 | 75.72x | 41.28 | 0.00 | ✅ |
| pylazyimports 🥈 | light_load | 0.41 | 1.33x | 71.57 | 0.00 | ✅ |
| pylazyimports | medium_load | 3.19 | 10.23x | 72.81 | 0.00 | ✅ |
| pylazyimports | heavy_load | 8.67 | 27.83x | 74.71 | 0.00 | ✅ |
| pylazyimports | enterprise_load | 24.13 | 77.44x | 80.46 | 0.00 | ✅ |
| xwlazy 🥉 | light_load | 0.44 | 1.42x | 92.11 | 0.00 | ✅ |
| xwlazy 🥈 | medium_load | 2.67 | 8.55x | 97.08 | 0.00 | ✅ |
| xwlazy 🥇 | heavy_load | 8.13 | 26.11x | 98.57 | 0.00 | ✅ |
| xwlazy | enterprise_load | 23.74 | 76.19x | 104.63 | 0.00 | ✅ |

#### Detailed Results

##### deferred-import 🥉

**Test:** light_load

- Import Time: 0.47 ms
- Relative Time: 1.51x (vs baseline)
- Memory Peak: 41.66 MB
- Memory Avg: 41.65 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** medium_load

- Import Time: 3.00 ms
- Relative Time: 9.61x (vs baseline)
- Memory Peak: 42.58 MB
- Memory Avg: 42.12 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** heavy_load 🥉

- Import Time: 8.41 ms
- Relative Time: 26.99x (vs baseline)
- Memory Peak: 44.70 MB
- Memory Avg: 43.65 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** enterprise_load

- Import Time: 23.24 ms
- Relative Time: 74.57x (vs baseline)
- Memory Peak: 49.26 MB
- Memory Avg: 46.98 MB
- Package Size: 0.00 MB
- Features: deferred_loading

##### lazi 🥇

**Test:** light_load 🥇

- Import Time: 0.30 ms
- Relative Time: 0.96x (vs baseline)
- Memory Peak: 80.61 MB
- Memory Avg: 80.60 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** medium_load

- Import Time: 3.27 ms
- Relative Time: 10.48x (vs baseline)
- Memory Peak: 81.18 MB
- Memory Avg: 80.90 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** heavy_load

- Import Time: 8.65 ms
- Relative Time: 27.77x (vs baseline)
- Memory Peak: 83.60 MB
- Memory Avg: 82.40 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** enterprise_load

- Import Time: 24.58 ms
- Relative Time: 78.90x (vs baseline)
- Memory Peak: 88.46 MB
- Memory Avg: 86.03 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

##### lazy-imports 🥇

**Test:** light_load

- Import Time: 0.50 ms
- Relative Time: 1.59x (vs baseline)
- Memory Peak: 58.02 MB
- Memory Avg: 57.98 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 2.81 ms
- Relative Time: 9.02x (vs baseline)
- Memory Peak: 58.96 MB
- Memory Avg: 58.50 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 9.10 ms
- Relative Time: 29.21x (vs baseline)
- Memory Peak: 61.26 MB
- Memory Avg: 60.15 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load 🥇

- Import Time: 22.41 ms
- Relative Time: 71.91x (vs baseline)
- Memory Peak: 66.82 MB
- Memory Avg: 64.04 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### lazy-imports-lite 🥇

**Test:** light_load

- Import Time: 0.58 ms
- Relative Time: 1.87x (vs baseline)
- Memory Peak: 88.46 MB
- Memory Avg: 88.46 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** medium_load 🥇

- Import Time: 2.45 ms
- Relative Time: 7.87x (vs baseline)
- Memory Peak: 88.46 MB
- Memory Avg: 88.46 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** heavy_load

- Import Time: 8.68 ms
- Relative Time: 27.84x (vs baseline)
- Memory Peak: 88.48 MB
- Memory Avg: 88.48 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** enterprise_load

- Import Time: 23.42 ms
- Relative Time: 75.16x (vs baseline)
- Memory Peak: 91.87 MB
- Memory Avg: 90.18 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

##### lazy-loader 🥉

**Test:** light_load

- Import Time: 0.48 ms
- Relative Time: 1.54x (vs baseline)
- Memory Peak: 49.26 MB
- Memory Avg: 49.26 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** medium_load

- Import Time: 3.07 ms
- Relative Time: 9.85x (vs baseline)
- Memory Peak: 49.29 MB
- Memory Avg: 49.27 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** heavy_load

- Import Time: 8.93 ms
- Relative Time: 28.64x (vs baseline)
- Memory Peak: 50.66 MB
- Memory Avg: 49.98 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** enterprise_load 🥉

- Import Time: 23.13 ms
- Relative Time: 74.23x (vs baseline)
- Memory Peak: 57.86 MB
- Memory Avg: 54.28 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

##### lazy_import 🥈

**Test:** light_load

- Import Time: 1.15 ms
- Relative Time: 3.70x (vs baseline)
- Memory Peak: 67.02 MB
- Memory Avg: 66.96 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 3.41 ms
- Relative Time: 10.95x (vs baseline)
- Memory Peak: 68.29 MB
- Memory Avg: 67.68 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 9.73 ms
- Relative Time: 31.23x (vs baseline)
- Memory Peak: 70.21 MB
- Memory Avg: 69.27 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load 🥈

- Import Time: 22.83 ms
- Relative Time: 73.27x (vs baseline)
- Memory Peak: 71.43 MB
- Memory Avg: 70.88 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### pipimport 🥈

**Test:** light_load

- Import Time: 0.64 ms
- Relative Time: 2.05x (vs baseline)
- Memory Peak: 28.25 MB
- Memory Avg: 28.05 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** medium_load 🥉

- Import Time: 2.77 ms
- Relative Time: 8.88x (vs baseline)
- Memory Peak: 29.63 MB
- Memory Avg: 28.95 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** heavy_load 🥈

- Import Time: 8.26 ms
- Relative Time: 26.52x (vs baseline)
- Memory Peak: 33.43 MB
- Memory Avg: 31.58 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** enterprise_load

- Import Time: 23.60 ms
- Relative Time: 75.72x (vs baseline)
- Memory Peak: 41.28 MB
- Memory Avg: 37.38 MB
- Package Size: 0.00 MB
- Features: auto_install

##### pylazyimports 🥈

**Test:** light_load 🥈

- Import Time: 0.41 ms
- Relative Time: 1.33x (vs baseline)
- Memory Peak: 71.57 MB
- Memory Avg: 71.53 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 3.19 ms
- Relative Time: 10.23x (vs baseline)
- Memory Peak: 72.81 MB
- Memory Avg: 72.20 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 8.67 ms
- Relative Time: 27.83x (vs baseline)
- Memory Peak: 74.71 MB
- Memory Avg: 73.78 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 24.13 ms
- Relative Time: 77.44x (vs baseline)
- Memory Peak: 80.46 MB
- Memory Avg: 77.58 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### xwlazy 🥇

**Test:** light_load 🥉

- Import Time: 0.44 ms
- Relative Time: 1.42x (vs baseline)
- Memory Peak: 92.11 MB
- Memory Avg: 92.11 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** medium_load 🥈

- Import Time: 2.67 ms
- Relative Time: 8.55x (vs baseline)
- Memory Peak: 97.08 MB
- Memory Avg: 96.71 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** heavy_load 🥇

- Import Time: 8.13 ms
- Relative Time: 26.11x (vs baseline)
- Memory Peak: 98.57 MB
- Memory Avg: 98.07 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** enterprise_load

- Import Time: 23.74 ms
- Relative Time: 76.19x (vs baseline)
- Memory Peak: 104.63 MB
- Memory Avg: 101.71 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring


### Preload Mode

*Preload all modules on start - PRELOAD mode*

#### Top 3 Rankings by Load Test

##### Enterprise Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | deferred-import | 22.13 | 71.03x |
| 2 🥈 | pylazyimports | 22.53 | 72.30x |
| 3 🥉 | pipimport | 22.88 | 73.43x |

##### Heavy Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 8.12 | 26.06x |
| 2 🥈 | pylazyimports | 8.28 | 26.56x |
| 3 🥉 | lazy-loader | 8.34 | 26.76x |

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazi | 0.36 | 1.17x |
| 2 🥈 | pylazyimports | 0.38 | 1.21x |
| 3 🥉 | lazy-imports | 0.38 | 1.23x |

##### Medium Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | pipimport | 2.46 | 7.89x |
| 2 🥈 | lazi | 2.70 | 8.66x |
| 3 🥉 | pylazyimports | 2.72 | 8.74x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| deferred-import | light_load | 0.73 | 2.35x | 170.79 | 0.00 | ✅ |
| deferred-import | medium_load | 2.81 | 9.03x | 171.95 | 0.00 | ✅ |
| deferred-import | heavy_load | 8.45 | 27.11x | 173.84 | 0.00 | ✅ |
| deferred-import 🥇 | enterprise_load | 22.13 | 71.03x | 179.38 | 0.00 | ✅ |
| lazi 🥇 | light_load | 0.36 | 1.17x | 208.46 | 0.00 | ✅ |
| lazi 🥈 | medium_load | 2.70 | 8.66x | 210.25 | 0.00 | ✅ |
| lazi | heavy_load | 8.61 | 27.63x | 211.30 | 0.00 | ✅ |
| lazi | enterprise_load | 24.15 | 77.51x | 211.46 | 0.00 | ✅ |
| lazy-imports 🥉 | light_load | 0.38 | 1.23x | 184.91 | 0.00 | ✅ |
| lazy-imports | medium_load | 2.74 | 8.78x | 184.94 | 0.00 | ✅ |
| lazy-imports | heavy_load | 8.71 | 27.94x | 185.02 | 0.00 | ✅ |
| lazy-imports | enterprise_load | 24.48 | 78.56x | 188.78 | 0.00 | ✅ |
| lazy-imports-lite | light_load | 0.44 | 1.42x | 211.46 | 0.00 | ✅ |
| lazy-imports-lite | medium_load | 3.25 | 10.44x | 211.47 | 0.00 | ✅ |
| lazy-imports-lite | heavy_load | 9.57 | 30.71x | 211.48 | 0.00 | ✅ |
| lazy-imports-lite | enterprise_load | 23.68 | 76.01x | 215.98 | 0.00 | ✅ |
| lazy-loader | light_load | 0.46 | 1.49x | 179.42 | 0.00 | ✅ |
| lazy-loader | medium_load | 3.08 | 9.88x | 180.18 | 0.00 | ✅ |
| lazy-loader 🥉 | heavy_load | 8.34 | 26.76x | 182.85 | 0.00 | ✅ |
| lazy-loader | enterprise_load | 22.95 | 73.65x | 184.87 | 0.00 | ✅ |
| lazy_import | light_load | 0.72 | 2.31x | 188.94 | 0.00 | ✅ |
| lazy_import | medium_load | 2.86 | 9.18x | 189.68 | 0.00 | ✅ |
| lazy_import | heavy_load | 9.19 | 29.48x | 192.12 | 0.00 | ✅ |
| lazy_import | enterprise_load | 23.96 | 76.90x | 197.35 | 0.00 | ✅ |
| pipimport | light_load | 1.06 | 3.40x | 162.41 | 0.00 | ✅ |
| pipimport 🥇 | medium_load | 2.46 | 7.89x | 163.28 | 0.00 | ✅ |
| pipimport | heavy_load | 8.57 | 27.50x | 165.39 | 0.00 | ✅ |
| pipimport 🥉 | enterprise_load | 22.88 | 73.43x | 170.51 | 0.00 | ✅ |
| pylazyimports 🥈 | light_load | 0.38 | 1.21x | 197.47 | 0.00 | ✅ |
| pylazyimports 🥉 | medium_load | 2.72 | 8.74x | 198.12 | 0.00 | ✅ |
| pylazyimports 🥈 | heavy_load | 8.28 | 26.56x | 201.09 | 0.00 | ✅ |
| pylazyimports 🥈 | enterprise_load | 22.53 | 72.30x | 208.38 | 0.00 | ✅ |
| xwlazy | light_load | 0.49 | 1.56x | 216.16 | 0.00 | ✅ |
| xwlazy | medium_load | 2.80 | 9.00x | 217.70 | 0.00 | ✅ |
| xwlazy 🥇 | heavy_load | 8.12 | 26.06x | 219.25 | 0.00 | ✅ |
| xwlazy | enterprise_load | 24.18 | 77.58x | 226.62 | 0.00 | ✅ |

#### Detailed Results

##### deferred-import 🥇

**Test:** light_load

- Import Time: 0.73 ms
- Relative Time: 2.35x (vs baseline)
- Memory Peak: 170.79 MB
- Memory Avg: 170.78 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** medium_load

- Import Time: 2.81 ms
- Relative Time: 9.03x (vs baseline)
- Memory Peak: 171.95 MB
- Memory Avg: 171.37 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** heavy_load

- Import Time: 8.45 ms
- Relative Time: 27.11x (vs baseline)
- Memory Peak: 173.84 MB
- Memory Avg: 172.90 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** enterprise_load 🥇

- Import Time: 22.13 ms
- Relative Time: 71.03x (vs baseline)
- Memory Peak: 179.38 MB
- Memory Avg: 176.61 MB
- Package Size: 0.00 MB
- Features: deferred_loading

##### lazi 🥇

**Test:** light_load 🥇

- Import Time: 0.36 ms
- Relative Time: 1.17x (vs baseline)
- Memory Peak: 208.46 MB
- Memory Avg: 208.45 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** medium_load 🥈

- Import Time: 2.70 ms
- Relative Time: 8.66x (vs baseline)
- Memory Peak: 210.25 MB
- Memory Avg: 209.36 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** heavy_load

- Import Time: 8.61 ms
- Relative Time: 27.63x (vs baseline)
- Memory Peak: 211.30 MB
- Memory Avg: 210.79 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** enterprise_load

- Import Time: 24.15 ms
- Relative Time: 77.51x (vs baseline)
- Memory Peak: 211.46 MB
- Memory Avg: 211.38 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

##### lazy-imports 🥉

**Test:** light_load 🥉

- Import Time: 0.38 ms
- Relative Time: 1.23x (vs baseline)
- Memory Peak: 184.91 MB
- Memory Avg: 184.91 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 2.74 ms
- Relative Time: 8.78x (vs baseline)
- Memory Peak: 184.94 MB
- Memory Avg: 184.93 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 8.71 ms
- Relative Time: 27.94x (vs baseline)
- Memory Peak: 185.02 MB
- Memory Avg: 185.00 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 24.48 ms
- Relative Time: 78.56x (vs baseline)
- Memory Peak: 188.78 MB
- Memory Avg: 186.93 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### lazy-imports-lite

**Test:** light_load

- Import Time: 0.44 ms
- Relative Time: 1.42x (vs baseline)
- Memory Peak: 211.46 MB
- Memory Avg: 211.46 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** medium_load

- Import Time: 3.25 ms
- Relative Time: 10.44x (vs baseline)
- Memory Peak: 211.47 MB
- Memory Avg: 211.47 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** heavy_load

- Import Time: 9.57 ms
- Relative Time: 30.71x (vs baseline)
- Memory Peak: 211.48 MB
- Memory Avg: 211.48 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** enterprise_load

- Import Time: 23.68 ms
- Relative Time: 76.01x (vs baseline)
- Memory Peak: 215.98 MB
- Memory Avg: 213.73 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

##### lazy-loader 🥉

**Test:** light_load

- Import Time: 0.46 ms
- Relative Time: 1.49x (vs baseline)
- Memory Peak: 179.42 MB
- Memory Avg: 179.40 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** medium_load

- Import Time: 3.08 ms
- Relative Time: 9.88x (vs baseline)
- Memory Peak: 180.18 MB
- Memory Avg: 179.81 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** heavy_load 🥉

- Import Time: 8.34 ms
- Relative Time: 26.76x (vs baseline)
- Memory Peak: 182.85 MB
- Memory Avg: 181.53 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** enterprise_load

- Import Time: 22.95 ms
- Relative Time: 73.65x (vs baseline)
- Memory Peak: 184.87 MB
- Memory Avg: 183.86 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

##### lazy_import

**Test:** light_load

- Import Time: 0.72 ms
- Relative Time: 2.31x (vs baseline)
- Memory Peak: 188.94 MB
- Memory Avg: 188.90 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 2.86 ms
- Relative Time: 9.18x (vs baseline)
- Memory Peak: 189.68 MB
- Memory Avg: 189.32 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 9.19 ms
- Relative Time: 29.48x (vs baseline)
- Memory Peak: 192.12 MB
- Memory Avg: 190.90 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 23.96 ms
- Relative Time: 76.90x (vs baseline)
- Memory Peak: 197.35 MB
- Memory Avg: 194.74 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### pipimport 🥇

**Test:** light_load

- Import Time: 1.06 ms
- Relative Time: 3.40x (vs baseline)
- Memory Peak: 162.41 MB
- Memory Avg: 162.37 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** medium_load 🥇

- Import Time: 2.46 ms
- Relative Time: 7.89x (vs baseline)
- Memory Peak: 163.28 MB
- Memory Avg: 162.84 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** heavy_load

- Import Time: 8.57 ms
- Relative Time: 27.50x (vs baseline)
- Memory Peak: 165.39 MB
- Memory Avg: 164.44 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** enterprise_load 🥉

- Import Time: 22.88 ms
- Relative Time: 73.43x (vs baseline)
- Memory Peak: 170.51 MB
- Memory Avg: 168.07 MB
- Package Size: 0.00 MB
- Features: auto_install

##### pylazyimports 🥈

**Test:** light_load 🥈

- Import Time: 0.38 ms
- Relative Time: 1.21x (vs baseline)
- Memory Peak: 197.47 MB
- Memory Avg: 197.46 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load 🥉

- Import Time: 2.72 ms
- Relative Time: 8.74x (vs baseline)
- Memory Peak: 198.12 MB
- Memory Avg: 197.80 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load 🥈

- Import Time: 8.28 ms
- Relative Time: 26.56x (vs baseline)
- Memory Peak: 201.09 MB
- Memory Avg: 199.61 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load 🥈

- Import Time: 22.53 ms
- Relative Time: 72.30x (vs baseline)
- Memory Peak: 208.38 MB
- Memory Avg: 204.73 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### xwlazy 🥇

**Test:** light_load

- Import Time: 0.49 ms
- Relative Time: 1.56x (vs baseline)
- Memory Peak: 216.16 MB
- Memory Avg: 216.15 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** medium_load

- Import Time: 2.80 ms
- Relative Time: 9.00x (vs baseline)
- Memory Peak: 217.70 MB
- Memory Avg: 217.14 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** heavy_load 🥇

- Import Time: 8.12 ms
- Relative Time: 26.06x (vs baseline)
- Memory Peak: 219.25 MB
- Memory Avg: 218.81 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring

**Test:** enterprise_load

- Import Time: 24.18 ms
- Relative Time: 77.58x (vs baseline)
- Memory Peak: 226.62 MB
- Memory Avg: 223.08 MB
- Package Size: 0.00 MB
- Features: keyword_detection, per_package_isolation, performance_monitoring


## Overall Winner 👑

**lazi 👑** wins with **8 first place victory(ies)** across all test categories!

### Winner Summary

| Library | First Place Wins |
|---------|------------------|
| lazi 👑 | 8 |
| lazy-imports-lite | 5 |
| lazy-imports | 5 |
| xwlazy | 4 |
| pylazyimports | 4 |
| deferred-import | 3 |
| pipimport | 2 |
| lazy-loader | 1 |


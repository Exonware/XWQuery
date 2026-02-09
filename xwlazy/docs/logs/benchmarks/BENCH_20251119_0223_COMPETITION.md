# Competition Benchmark Report

**Generated:** 2025-11-19T02:23:34.043162

## Standard Tests

### Auto Mode

*Smart install + auto-uninstall large - AUTO mode*

#### Top 3 Rankings by Load Test

##### Enterprise Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazy_import | 39.36 | 68.85x |
| 2 🥈 | lazy-imports-lite | 41.74 | 73.00x |
| 3 🥉 | pylazyimports | 42.74 | 74.76x |

##### Heavy Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | pylazyimports | 14.64 | 25.61x |
| 2 🥈 | deferred-import | 15.92 | 27.84x |
| 3 🥉 | lazy_import | 16.09 | 28.14x |

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazi | 0.38 | 0.67x |
| 2 🥈 | lazy-imports-lite | 0.62 | 1.09x |
| 3 🥉 | lazy-imports | 0.72 | 1.26x |

##### Medium Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazy_import | 4.22 | 7.39x |
| 2 🥈 | lazy-loader | 4.39 | 7.67x |
| 3 🥉 | deferred-import | 5.02 | 8.78x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| deferred-import | light_load | 0.90 | 1.58x | 359.55 | 0.00 | ✅ |
| deferred-import 🥉 | medium_load | 5.02 | 8.78x | 359.58 | 0.00 | ✅ |
| deferred-import 🥈 | heavy_load | 15.92 | 27.84x | 359.60 | 0.00 | ✅ |
| deferred-import | enterprise_load | 46.28 | 80.96x | 360.42 | 0.00 | ✅ |
| lazi 🥇 | light_load | 0.38 | 0.67x | 396.70 | 0.00 | ✅ |
| lazi | medium_load | 5.77 | 10.09x | 396.71 | 0.00 | ✅ |
| lazi | heavy_load | 30.48 | 53.31x | 396.71 | 0.00 | ✅ |
| lazi | enterprise_load | 70.00 | 122.45x | 396.76 | 0.00 | ✅ |
| lazy-imports 🥉 | light_load | 0.72 | 1.26x | 369.27 | 0.00 | ✅ |
| lazy-imports | medium_load | 5.57 | 9.74x | 369.84 | 0.00 | ✅ |
| lazy-imports | heavy_load | 16.80 | 29.39x | 371.66 | 0.00 | ✅ |
| lazy-imports | enterprise_load | 45.86 | 80.21x | 379.30 | 0.00 | ✅ |
| lazy-imports-lite 🥈 | light_load | 0.62 | 1.09x | 396.76 | 0.00 | ✅ |
| lazy-imports-lite | medium_load | 5.94 | 10.38x | 396.77 | 0.00 | ✅ |
| lazy-imports-lite | heavy_load | 16.65 | 29.13x | 396.77 | 0.00 | ✅ |
| lazy-imports-lite 🥈 | enterprise_load | 41.74 | 73.00x | 397.03 | 0.00 | ✅ |
| lazy-loader | light_load | 0.78 | 1.37x | 360.50 | 0.00 | ✅ |
| lazy-loader 🥈 | medium_load | 4.39 | 7.67x | 361.31 | 0.00 | ✅ |
| lazy-loader | heavy_load | 17.45 | 30.53x | 363.70 | 0.00 | ✅ |
| lazy-loader | enterprise_load | 44.48 | 77.81x | 369.08 | 0.00 | ✅ |
| lazy_import | light_load | 1.40 | 2.45x | 379.43 | 0.00 | ✅ |
| lazy_import 🥇 | medium_load | 4.22 | 7.39x | 380.39 | 0.00 | ✅ |
| lazy_import 🥉 | heavy_load | 16.09 | 28.14x | 382.03 | 0.00 | ✅ |
| lazy_import 🥇 | enterprise_load | 39.36 | 68.85x | 388.80 | 0.00 | ✅ |
| pipimport | light_load | 1.14 | 1.99x | 358.18 | 0.00 | ✅ |
| pipimport | medium_load | 6.10 | 10.68x | 358.23 | 0.00 | ✅ |
| pipimport | heavy_load | 17.06 | 29.84x | 359.50 | 0.00 | ✅ |
| pipimport | enterprise_load | 44.42 | 77.70x | 359.54 | 0.00 | ✅ |
| pylazyimports | light_load | 1.05 | 1.83x | 388.88 | 0.00 | ✅ |
| pylazyimports | medium_load | 5.61 | 9.82x | 390.32 | 0.00 | ✅ |
| pylazyimports 🥇 | heavy_load | 14.64 | 25.61x | 391.99 | 0.00 | ✅ |
| pylazyimports 🥉 | enterprise_load | 42.74 | 74.76x | 396.70 | 0.00 | ✅ |
| xwlazy | light_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| xwlazy | medium_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| xwlazy | heavy_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| xwlazy | enterprise_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |

#### Detailed Results

##### deferred-import 🥈

**Test:** light_load

- Import Time: 0.90 ms
- Relative Time: 1.58x (vs baseline)
- Memory Peak: 359.55 MB
- Memory Avg: 359.55 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** medium_load 🥉

- Import Time: 5.02 ms
- Relative Time: 8.78x (vs baseline)
- Memory Peak: 359.58 MB
- Memory Avg: 359.57 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** heavy_load 🥈

- Import Time: 15.92 ms
- Relative Time: 27.84x (vs baseline)
- Memory Peak: 359.60 MB
- Memory Avg: 359.59 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** enterprise_load

- Import Time: 46.28 ms
- Relative Time: 80.96x (vs baseline)
- Memory Peak: 360.42 MB
- Memory Avg: 360.01 MB
- Package Size: 0.00 MB
- Features: deferred_loading

##### lazi 🥇

**Test:** light_load 🥇

- Import Time: 0.38 ms
- Relative Time: 0.67x (vs baseline)
- Memory Peak: 396.70 MB
- Memory Avg: 396.70 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** medium_load

- Import Time: 5.77 ms
- Relative Time: 10.09x (vs baseline)
- Memory Peak: 396.71 MB
- Memory Avg: 396.70 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** heavy_load

- Import Time: 30.48 ms
- Relative Time: 53.31x (vs baseline)
- Memory Peak: 396.71 MB
- Memory Avg: 396.71 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** enterprise_load

- Import Time: 70.00 ms
- Relative Time: 122.45x (vs baseline)
- Memory Peak: 396.76 MB
- Memory Avg: 396.74 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

##### lazy-imports 🥉

**Test:** light_load 🥉

- Import Time: 0.72 ms
- Relative Time: 1.26x (vs baseline)
- Memory Peak: 369.27 MB
- Memory Avg: 369.26 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 5.57 ms
- Relative Time: 9.74x (vs baseline)
- Memory Peak: 369.84 MB
- Memory Avg: 369.55 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 16.80 ms
- Relative Time: 29.39x (vs baseline)
- Memory Peak: 371.66 MB
- Memory Avg: 370.76 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 45.86 ms
- Relative Time: 80.21x (vs baseline)
- Memory Peak: 379.30 MB
- Memory Avg: 375.48 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### lazy-imports-lite 🥈

**Test:** light_load 🥈

- Import Time: 0.62 ms
- Relative Time: 1.09x (vs baseline)
- Memory Peak: 396.76 MB
- Memory Avg: 396.76 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** medium_load

- Import Time: 5.94 ms
- Relative Time: 10.38x (vs baseline)
- Memory Peak: 396.77 MB
- Memory Avg: 396.77 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** heavy_load

- Import Time: 16.65 ms
- Relative Time: 29.13x (vs baseline)
- Memory Peak: 396.77 MB
- Memory Avg: 396.77 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** enterprise_load 🥈

- Import Time: 41.74 ms
- Relative Time: 73.00x (vs baseline)
- Memory Peak: 397.03 MB
- Memory Avg: 396.90 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

##### lazy-loader 🥈

**Test:** light_load

- Import Time: 0.78 ms
- Relative Time: 1.37x (vs baseline)
- Memory Peak: 360.50 MB
- Memory Avg: 360.48 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** medium_load 🥈

- Import Time: 4.39 ms
- Relative Time: 7.67x (vs baseline)
- Memory Peak: 361.31 MB
- Memory Avg: 360.91 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** heavy_load

- Import Time: 17.45 ms
- Relative Time: 30.53x (vs baseline)
- Memory Peak: 363.70 MB
- Memory Avg: 362.50 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** enterprise_load

- Import Time: 44.48 ms
- Relative Time: 77.81x (vs baseline)
- Memory Peak: 369.08 MB
- Memory Avg: 366.39 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

##### lazy_import 🥇

**Test:** light_load

- Import Time: 1.40 ms
- Relative Time: 2.45x (vs baseline)
- Memory Peak: 379.43 MB
- Memory Avg: 379.40 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load 🥇

- Import Time: 4.22 ms
- Relative Time: 7.39x (vs baseline)
- Memory Peak: 380.39 MB
- Memory Avg: 379.92 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load 🥉

- Import Time: 16.09 ms
- Relative Time: 28.14x (vs baseline)
- Memory Peak: 382.03 MB
- Memory Avg: 381.23 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load 🥇

- Import Time: 39.36 ms
- Relative Time: 68.85x (vs baseline)
- Memory Peak: 388.80 MB
- Memory Avg: 385.43 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### pipimport

**Test:** light_load

- Import Time: 1.14 ms
- Relative Time: 1.99x (vs baseline)
- Memory Peak: 358.18 MB
- Memory Avg: 358.12 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** medium_load

- Import Time: 6.10 ms
- Relative Time: 10.68x (vs baseline)
- Memory Peak: 358.23 MB
- Memory Avg: 358.21 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** heavy_load

- Import Time: 17.06 ms
- Relative Time: 29.84x (vs baseline)
- Memory Peak: 359.50 MB
- Memory Avg: 358.86 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** enterprise_load

- Import Time: 44.42 ms
- Relative Time: 77.70x (vs baseline)
- Memory Peak: 359.54 MB
- Memory Avg: 359.52 MB
- Package Size: 0.00 MB
- Features: auto_install

##### pylazyimports 🥇

**Test:** light_load

- Import Time: 1.05 ms
- Relative Time: 1.83x (vs baseline)
- Memory Peak: 388.88 MB
- Memory Avg: 388.87 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 5.61 ms
- Relative Time: 9.82x (vs baseline)
- Memory Peak: 390.32 MB
- Memory Avg: 389.60 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load 🥇

- Import Time: 14.64 ms
- Relative Time: 25.61x (vs baseline)
- Memory Peak: 391.99 MB
- Memory Avg: 391.15 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load 🥉

- Import Time: 42.74 ms
- Relative Time: 74.76x (vs baseline)
- Memory Peak: 396.70 MB
- Memory Avg: 394.34 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### xwlazy

**Test:** light_load

- ❌ Error: module 'collections' has no attribute 'abc'

**Test:** medium_load

- ❌ Error: module 'collections' has no attribute 'abc'

**Test:** heavy_load

- ❌ Error: module 'collections' has no attribute 'abc'

**Test:** enterprise_load

- ❌ Error: module 'collections' has no attribute 'abc'


### Clean Mode

*Install on usage + uninstall after - CLEAN mode*

#### Top 3 Rankings by Load Test

##### Enterprise Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | pipimport | 40.29 | 70.47x |
| 2 🥈 | lazy-loader | 41.68 | 72.90x |
| 3 🥉 | lazy-imports | 44.61 | 78.04x |

##### Heavy Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | pylazyimports | 14.68 | 25.68x |
| 2 🥈 | pipimport | 14.98 | 26.21x |
| 3 🥉 | lazy-imports-lite | 15.17 | 26.53x |

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazi | 0.47 | 0.81x |
| 2 🥈 | deferred-import | 0.62 | 1.09x |
| 3 🥉 | lazy-imports-lite | 0.80 | 1.39x |

##### Medium Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | deferred-import | 4.51 | 7.88x |
| 2 🥈 | pylazyimports | 4.54 | 7.93x |
| 3 🥉 | lazy-imports-lite | 5.04 | 8.82x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| deferred-import 🥈 | light_load | 0.62 | 1.09x | 313.57 | 0.00 | ✅ |
| deferred-import 🥇 | medium_load | 4.51 | 7.88x | 313.57 | 0.00 | ✅ |
| deferred-import | heavy_load | 19.40 | 33.94x | 313.58 | 0.00 | ✅ |
| deferred-import | enterprise_load | 46.27 | 80.93x | 314.17 | 0.00 | ✅ |
| lazi 🥇 | light_load | 0.47 | 0.81x | 353.48 | 0.00 | ✅ |
| lazi | medium_load | 6.83 | 11.94x | 354.03 | 0.00 | ✅ |
| lazi | heavy_load | 17.80 | 31.14x | 356.11 | 0.00 | ✅ |
| lazi | enterprise_load | 44.86 | 78.47x | 358.05 | 0.00 | ✅ |
| lazy-imports | light_load | 0.95 | 1.66x | 322.98 | 0.00 | ✅ |
| lazy-imports | medium_load | 5.09 | 8.91x | 323.54 | 0.00 | ✅ |
| lazy-imports | heavy_load | 16.04 | 28.05x | 326.31 | 0.00 | ✅ |
| lazy-imports 🥉 | enterprise_load | 44.61 | 78.04x | 334.05 | 0.00 | ✅ |
| lazy-imports-lite 🥉 | light_load | 0.80 | 1.39x | 358.05 | 0.00 | ✅ |
| lazy-imports-lite 🥉 | medium_load | 5.04 | 8.82x | 358.06 | 0.00 | ✅ |
| lazy-imports-lite 🥉 | heavy_load | 15.17 | 26.53x | 358.06 | 0.00 | ✅ |
| lazy-imports-lite | enterprise_load | 46.29 | 80.98x | 358.07 | 0.00 | ✅ |
| lazy-loader | light_load | 0.83 | 1.44x | 314.23 | 0.00 | ✅ |
| lazy-loader | medium_load | 5.30 | 9.27x | 315.12 | 0.00 | ✅ |
| lazy-loader | heavy_load | 16.18 | 28.30x | 317.02 | 0.00 | ✅ |
| lazy-loader 🥈 | enterprise_load | 41.68 | 72.90x | 322.89 | 0.00 | ✅ |
| lazy_import | light_load | 1.51 | 2.64x | 334.17 | 0.00 | ✅ |
| lazy_import | medium_load | 5.22 | 9.14x | 335.15 | 0.00 | ✅ |
| lazy_import | heavy_load | 17.92 | 31.34x | 336.84 | 0.00 | ✅ |
| lazy_import | enterprise_load | 45.46 | 79.52x | 343.68 | 0.00 | ✅ |
| pipimport | light_load | 0.82 | 1.43x | 313.15 | 0.00 | ✅ |
| pipimport | medium_load | 5.60 | 9.79x | 313.25 | 0.00 | ✅ |
| pipimport 🥈 | heavy_load | 14.98 | 26.21x | 313.29 | 0.00 | ✅ |
| pipimport 🥇 | enterprise_load | 40.29 | 70.47x | 313.55 | 0.00 | ✅ |
| pylazyimports | light_load | 0.82 | 1.44x | 343.77 | 0.00 | ✅ |
| pylazyimports 🥈 | medium_load | 4.54 | 7.93x | 345.06 | 0.00 | ✅ |
| pylazyimports 🥇 | heavy_load | 14.68 | 25.68x | 347.26 | 0.00 | ✅ |
| pylazyimports | enterprise_load | 45.17 | 79.01x | 353.31 | 0.00 | ✅ |
| xwlazy | light_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| xwlazy | medium_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| xwlazy | heavy_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| xwlazy | enterprise_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |

#### Detailed Results

##### deferred-import 🥇

**Test:** light_load 🥈

- Import Time: 0.62 ms
- Relative Time: 1.09x (vs baseline)
- Memory Peak: 313.57 MB
- Memory Avg: 313.57 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** medium_load 🥇

- Import Time: 4.51 ms
- Relative Time: 7.88x (vs baseline)
- Memory Peak: 313.57 MB
- Memory Avg: 313.57 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** heavy_load

- Import Time: 19.40 ms
- Relative Time: 33.94x (vs baseline)
- Memory Peak: 313.58 MB
- Memory Avg: 313.58 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** enterprise_load

- Import Time: 46.27 ms
- Relative Time: 80.93x (vs baseline)
- Memory Peak: 314.17 MB
- Memory Avg: 313.87 MB
- Package Size: 0.00 MB
- Features: deferred_loading

##### lazi 🥇

**Test:** light_load 🥇

- Import Time: 0.47 ms
- Relative Time: 0.81x (vs baseline)
- Memory Peak: 353.48 MB
- Memory Avg: 353.47 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** medium_load

- Import Time: 6.83 ms
- Relative Time: 11.94x (vs baseline)
- Memory Peak: 354.03 MB
- Memory Avg: 353.76 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** heavy_load

- Import Time: 17.80 ms
- Relative Time: 31.14x (vs baseline)
- Memory Peak: 356.11 MB
- Memory Avg: 355.08 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** enterprise_load

- Import Time: 44.86 ms
- Relative Time: 78.47x (vs baseline)
- Memory Peak: 358.05 MB
- Memory Avg: 357.08 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

##### lazy-imports 🥉

**Test:** light_load

- Import Time: 0.95 ms
- Relative Time: 1.66x (vs baseline)
- Memory Peak: 322.98 MB
- Memory Avg: 322.97 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 5.09 ms
- Relative Time: 8.91x (vs baseline)
- Memory Peak: 323.54 MB
- Memory Avg: 323.26 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 16.04 ms
- Relative Time: 28.05x (vs baseline)
- Memory Peak: 326.31 MB
- Memory Avg: 324.94 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load 🥉

- Import Time: 44.61 ms
- Relative Time: 78.04x (vs baseline)
- Memory Peak: 334.05 MB
- Memory Avg: 330.18 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### lazy-imports-lite 🥉

**Test:** light_load 🥉

- Import Time: 0.80 ms
- Relative Time: 1.39x (vs baseline)
- Memory Peak: 358.05 MB
- Memory Avg: 358.05 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** medium_load 🥉

- Import Time: 5.04 ms
- Relative Time: 8.82x (vs baseline)
- Memory Peak: 358.06 MB
- Memory Avg: 358.06 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** heavy_load 🥉

- Import Time: 15.17 ms
- Relative Time: 26.53x (vs baseline)
- Memory Peak: 358.06 MB
- Memory Avg: 358.06 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** enterprise_load

- Import Time: 46.29 ms
- Relative Time: 80.98x (vs baseline)
- Memory Peak: 358.07 MB
- Memory Avg: 358.06 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

##### lazy-loader 🥈

**Test:** light_load

- Import Time: 0.83 ms
- Relative Time: 1.44x (vs baseline)
- Memory Peak: 314.23 MB
- Memory Avg: 314.22 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** medium_load

- Import Time: 5.30 ms
- Relative Time: 9.27x (vs baseline)
- Memory Peak: 315.12 MB
- Memory Avg: 314.69 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** heavy_load

- Import Time: 16.18 ms
- Relative Time: 28.30x (vs baseline)
- Memory Peak: 317.02 MB
- Memory Avg: 316.07 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** enterprise_load 🥈

- Import Time: 41.68 ms
- Relative Time: 72.90x (vs baseline)
- Memory Peak: 322.89 MB
- Memory Avg: 319.95 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

##### lazy_import

**Test:** light_load

- Import Time: 1.51 ms
- Relative Time: 2.64x (vs baseline)
- Memory Peak: 334.17 MB
- Memory Avg: 334.15 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 5.22 ms
- Relative Time: 9.14x (vs baseline)
- Memory Peak: 335.15 MB
- Memory Avg: 334.68 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 17.92 ms
- Relative Time: 31.34x (vs baseline)
- Memory Peak: 336.84 MB
- Memory Avg: 336.01 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 45.46 ms
- Relative Time: 79.52x (vs baseline)
- Memory Peak: 343.68 MB
- Memory Avg: 340.28 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### pipimport 🥇

**Test:** light_load

- Import Time: 0.82 ms
- Relative Time: 1.43x (vs baseline)
- Memory Peak: 313.15 MB
- Memory Avg: 313.14 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** medium_load

- Import Time: 5.60 ms
- Relative Time: 9.79x (vs baseline)
- Memory Peak: 313.25 MB
- Memory Avg: 313.20 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** heavy_load 🥈

- Import Time: 14.98 ms
- Relative Time: 26.21x (vs baseline)
- Memory Peak: 313.29 MB
- Memory Avg: 313.28 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** enterprise_load 🥇

- Import Time: 40.29 ms
- Relative Time: 70.47x (vs baseline)
- Memory Peak: 313.55 MB
- Memory Avg: 313.42 MB
- Package Size: 0.00 MB
- Features: auto_install

##### pylazyimports 🥇

**Test:** light_load

- Import Time: 0.82 ms
- Relative Time: 1.44x (vs baseline)
- Memory Peak: 343.77 MB
- Memory Avg: 343.76 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load 🥈

- Import Time: 4.54 ms
- Relative Time: 7.93x (vs baseline)
- Memory Peak: 345.06 MB
- Memory Avg: 344.42 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load 🥇

- Import Time: 14.68 ms
- Relative Time: 25.68x (vs baseline)
- Memory Peak: 347.26 MB
- Memory Avg: 346.16 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 45.17 ms
- Relative Time: 79.01x (vs baseline)
- Memory Peak: 353.31 MB
- Memory Avg: 350.29 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### xwlazy

**Test:** light_load

- ❌ Error: module 'collections' has no attribute 'abc'

**Test:** medium_load

- ❌ Error: module 'collections' has no attribute 'abc'

**Test:** heavy_load

- ❌ Error: module 'collections' has no attribute 'abc'

**Test:** enterprise_load

- ❌ Error: module 'collections' has no attribute 'abc'


### Full Features

*All features enabled (xwlazy showcase) - AUTO mode with optimizations*

#### Top 3 Rankings by Load Test

##### Enterprise Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | deferred-import | 42.80 | 74.87x |
| 2 🥈 | lazy-imports-lite | 44.87 | 78.49x |
| 3 🥉 | pipimport | 45.30 | 79.24x |

##### Heavy Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazy-loader | 15.99 | 27.98x |
| 2 🥈 | lazy-imports | 16.24 | 28.40x |
| 3 🥉 | deferred-import | 16.32 | 28.55x |

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazi | 0.52 | 0.91x |
| 2 🥈 | lazy-imports-lite | 0.59 | 1.03x |
| 3 🥉 | lazy-imports | 0.73 | 1.28x |

##### Medium Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | deferred-import | 4.76 | 8.33x |
| 2 🥈 | lazy-imports | 5.53 | 9.67x |
| 3 🥉 | lazy_import | 5.74 | 10.04x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| deferred-import | light_load | 0.80 | 1.39x | 397.97 | 0.00 | ✅ |
| deferred-import 🥇 | medium_load | 4.76 | 8.33x | 398.53 | 0.00 | ✅ |
| deferred-import 🥉 | heavy_load | 16.32 | 28.55x | 400.10 | 0.00 | ✅ |
| deferred-import 🥇 | enterprise_load | 42.80 | 74.87x | 406.69 | 0.00 | ✅ |
| lazi 🥇 | light_load | 0.52 | 0.91x | 443.62 | 0.00 | ✅ |
| lazi | medium_load | 6.89 | 12.06x | 444.18 | 0.00 | ✅ |
| lazi | heavy_load | 19.18 | 33.55x | 444.18 | 0.00 | ✅ |
| lazi | enterprise_load | 50.06 | 87.57x | 444.33 | 0.00 | ✅ |
| lazy-imports 🥉 | light_load | 0.73 | 1.28x | 415.54 | 0.00 | ✅ |
| lazy-imports 🥈 | medium_load | 5.53 | 9.67x | 416.65 | 0.00 | ✅ |
| lazy-imports 🥈 | heavy_load | 16.24 | 28.40x | 418.39 | 0.00 | ✅ |
| lazy-imports | enterprise_load | 47.56 | 83.19x | 426.76 | 0.00 | ✅ |
| lazy-imports-lite 🥈 | light_load | 0.59 | 1.03x | 444.33 | 0.00 | ✅ |
| lazy-imports-lite | medium_load | 6.69 | 11.70x | 444.33 | 0.00 | ✅ |
| lazy-imports-lite | heavy_load | 19.11 | 33.43x | 444.33 | 0.00 | ✅ |
| lazy-imports-lite 🥈 | enterprise_load | 44.87 | 78.49x | 444.33 | 0.00 | ✅ |
| lazy-loader | light_load | 0.94 | 1.65x | 406.76 | 0.00 | ✅ |
| lazy-loader | medium_load | 6.07 | 10.61x | 407.93 | 0.00 | ✅ |
| lazy-loader 🥇 | heavy_load | 15.99 | 27.98x | 410.05 | 0.00 | ✅ |
| lazy-loader | enterprise_load | 48.69 | 85.16x | 415.42 | 0.00 | ✅ |
| lazy_import | light_load | 2.02 | 3.53x | 426.89 | 0.00 | ✅ |
| lazy_import 🥉 | medium_load | 5.74 | 10.04x | 428.09 | 0.00 | ✅ |
| lazy_import | heavy_load | 19.63 | 34.34x | 429.38 | 0.00 | ✅ |
| lazy_import | enterprise_load | 51.49 | 90.06x | 434.94 | 0.00 | ✅ |
| pipimport | light_load | 1.20 | 2.09x | 397.11 | 0.00 | ✅ |
| pipimport | medium_load | 5.96 | 10.43x | 397.12 | 0.00 | ✅ |
| pipimport | heavy_load | 17.06 | 29.84x | 397.13 | 0.00 | ✅ |
| pipimport 🥉 | enterprise_load | 45.30 | 79.24x | 397.80 | 0.00 | ✅ |
| pylazyimports | light_load | 1.09 | 1.90x | 435.02 | 0.00 | ✅ |
| pylazyimports | medium_load | 8.89 | 15.56x | 436.38 | 0.00 | ✅ |
| pylazyimports | heavy_load | 21.56 | 37.72x | 438.40 | 0.00 | ✅ |
| pylazyimports | enterprise_load | 51.30 | 89.73x | 443.52 | 0.00 | ✅ |
| xwlazy | light_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| xwlazy | medium_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| xwlazy | heavy_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| xwlazy | enterprise_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |

#### Detailed Results

##### deferred-import 🥇

**Test:** light_load

- Import Time: 0.80 ms
- Relative Time: 1.39x (vs baseline)
- Memory Peak: 397.97 MB
- Memory Avg: 397.97 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** medium_load 🥇

- Import Time: 4.76 ms
- Relative Time: 8.33x (vs baseline)
- Memory Peak: 398.53 MB
- Memory Avg: 398.25 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** heavy_load 🥉

- Import Time: 16.32 ms
- Relative Time: 28.55x (vs baseline)
- Memory Peak: 400.10 MB
- Memory Avg: 399.32 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** enterprise_load 🥇

- Import Time: 42.80 ms
- Relative Time: 74.87x (vs baseline)
- Memory Peak: 406.69 MB
- Memory Avg: 403.39 MB
- Package Size: 0.00 MB
- Features: deferred_loading

##### lazi 🥇

**Test:** light_load 🥇

- Import Time: 0.52 ms
- Relative Time: 0.91x (vs baseline)
- Memory Peak: 443.62 MB
- Memory Avg: 443.62 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** medium_load

- Import Time: 6.89 ms
- Relative Time: 12.06x (vs baseline)
- Memory Peak: 444.18 MB
- Memory Avg: 443.91 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** heavy_load

- Import Time: 19.18 ms
- Relative Time: 33.55x (vs baseline)
- Memory Peak: 444.18 MB
- Memory Avg: 444.18 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** enterprise_load

- Import Time: 50.06 ms
- Relative Time: 87.57x (vs baseline)
- Memory Peak: 444.33 MB
- Memory Avg: 444.26 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

##### lazy-imports 🥈

**Test:** light_load 🥉

- Import Time: 0.73 ms
- Relative Time: 1.28x (vs baseline)
- Memory Peak: 415.54 MB
- Memory Avg: 415.54 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load 🥈

- Import Time: 5.53 ms
- Relative Time: 9.67x (vs baseline)
- Memory Peak: 416.65 MB
- Memory Avg: 416.10 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load 🥈

- Import Time: 16.24 ms
- Relative Time: 28.40x (vs baseline)
- Memory Peak: 418.39 MB
- Memory Avg: 417.54 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 47.56 ms
- Relative Time: 83.19x (vs baseline)
- Memory Peak: 426.76 MB
- Memory Avg: 422.58 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### lazy-imports-lite 🥈

**Test:** light_load 🥈

- Import Time: 0.59 ms
- Relative Time: 1.03x (vs baseline)
- Memory Peak: 444.33 MB
- Memory Avg: 444.33 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** medium_load

- Import Time: 6.69 ms
- Relative Time: 11.70x (vs baseline)
- Memory Peak: 444.33 MB
- Memory Avg: 444.33 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** heavy_load

- Import Time: 19.11 ms
- Relative Time: 33.43x (vs baseline)
- Memory Peak: 444.33 MB
- Memory Avg: 444.33 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** enterprise_load 🥈

- Import Time: 44.87 ms
- Relative Time: 78.49x (vs baseline)
- Memory Peak: 444.33 MB
- Memory Avg: 444.33 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

##### lazy-loader 🥇

**Test:** light_load

- Import Time: 0.94 ms
- Relative Time: 1.65x (vs baseline)
- Memory Peak: 406.76 MB
- Memory Avg: 406.75 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** medium_load

- Import Time: 6.07 ms
- Relative Time: 10.61x (vs baseline)
- Memory Peak: 407.93 MB
- Memory Avg: 407.36 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** heavy_load 🥇

- Import Time: 15.99 ms
- Relative Time: 27.98x (vs baseline)
- Memory Peak: 410.05 MB
- Memory Avg: 408.99 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** enterprise_load

- Import Time: 48.69 ms
- Relative Time: 85.16x (vs baseline)
- Memory Peak: 415.42 MB
- Memory Avg: 412.74 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

##### lazy_import 🥉

**Test:** light_load

- Import Time: 2.02 ms
- Relative Time: 3.53x (vs baseline)
- Memory Peak: 426.89 MB
- Memory Avg: 426.86 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load 🥉

- Import Time: 5.74 ms
- Relative Time: 10.04x (vs baseline)
- Memory Peak: 428.09 MB
- Memory Avg: 427.50 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 19.63 ms
- Relative Time: 34.34x (vs baseline)
- Memory Peak: 429.38 MB
- Memory Avg: 428.75 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 51.49 ms
- Relative Time: 90.06x (vs baseline)
- Memory Peak: 434.94 MB
- Memory Avg: 432.18 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### pipimport 🥉

**Test:** light_load

- Import Time: 1.20 ms
- Relative Time: 2.09x (vs baseline)
- Memory Peak: 397.11 MB
- Memory Avg: 397.07 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** medium_load

- Import Time: 5.96 ms
- Relative Time: 10.43x (vs baseline)
- Memory Peak: 397.12 MB
- Memory Avg: 397.11 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** heavy_load

- Import Time: 17.06 ms
- Relative Time: 29.84x (vs baseline)
- Memory Peak: 397.13 MB
- Memory Avg: 397.12 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** enterprise_load 🥉

- Import Time: 45.30 ms
- Relative Time: 79.24x (vs baseline)
- Memory Peak: 397.80 MB
- Memory Avg: 397.46 MB
- Package Size: 0.00 MB
- Features: auto_install

##### pylazyimports

**Test:** light_load

- Import Time: 1.09 ms
- Relative Time: 1.90x (vs baseline)
- Memory Peak: 435.02 MB
- Memory Avg: 435.01 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 8.89 ms
- Relative Time: 15.56x (vs baseline)
- Memory Peak: 436.38 MB
- Memory Avg: 435.70 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 21.56 ms
- Relative Time: 37.72x (vs baseline)
- Memory Peak: 438.40 MB
- Memory Avg: 437.39 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 51.30 ms
- Relative Time: 89.73x (vs baseline)
- Memory Peak: 443.52 MB
- Memory Avg: 440.96 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### xwlazy

**Test:** light_load

- ❌ Error: module 'collections' has no attribute 'abc'

**Test:** medium_load

- ❌ Error: module 'collections' has no attribute 'abc'

**Test:** heavy_load

- ❌ Error: module 'collections' has no attribute 'abc'

**Test:** enterprise_load

- ❌ Error: module 'collections' has no attribute 'abc'


### Full Install Mode

*Install all dependencies on start - FULL mode*

#### Top 3 Rankings by Load Test

##### Enterprise Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazy_import | 43.68 | 76.40x |
| 2 🥈 | pylazyimports | 44.22 | 77.36x |
| 3 🥉 | lazy-imports-lite | 44.33 | 77.54x |

##### Heavy Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | pylazyimports | 16.01 | 28.01x |
| 2 🥈 | lazy_import | 16.16 | 28.27x |
| 3 🥉 | pipimport | 16.31 | 28.53x |

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazi | 0.43 | 0.76x |
| 2 🥈 | pylazyimports | 0.93 | 1.63x |
| 3 🥉 | deferred-import | 0.96 | 1.67x |

##### Medium Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazi | 4.73 | 8.28x |
| 2 🥈 | pylazyimports | 4.81 | 8.41x |
| 3 🥉 | lazy_import | 4.82 | 8.43x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| deferred-import 🥉 | light_load | 0.96 | 1.67x | 270.36 | 0.00 | ✅ |
| deferred-import | medium_load | 6.27 | 10.96x | 271.45 | 0.00 | ✅ |
| deferred-import | heavy_load | 19.10 | 33.41x | 273.44 | 0.00 | ✅ |
| deferred-import | enterprise_load | 77.62 | 135.77x | 277.52 | 0.00 | ✅ |
| lazi 🥇 | light_load | 0.43 | 0.76x | 295.38 | 0.00 | ✅ |
| lazi 🥇 | medium_load | 4.73 | 8.28x | 296.73 | 0.00 | ✅ |
| lazi | heavy_load | 16.34 | 28.59x | 299.11 | 0.00 | ✅ |
| lazi | enterprise_load | 44.85 | 78.45x | 306.04 | 0.00 | ✅ |
| lazy-imports | light_load | 1.89 | 3.30x | 277.76 | 0.00 | ✅ |
| lazy-imports | medium_load | 7.53 | 13.16x | 277.77 | 0.00 | ✅ |
| lazy-imports | heavy_load | 25.32 | 44.29x | 277.77 | 0.00 | ✅ |
| lazy-imports | enterprise_load | 56.43 | 98.70x | 278.15 | 0.00 | ✅ |
| lazy-imports-lite | light_load | 1.10 | 1.92x | 306.12 | 0.00 | ✅ |
| lazy-imports-lite | medium_load | 6.01 | 10.51x | 307.09 | 0.00 | ✅ |
| lazy-imports-lite | heavy_load | 16.86 | 29.49x | 309.43 | 0.00 | ✅ |
| lazy-imports-lite 🥉 | enterprise_load | 44.33 | 77.54x | 313.14 | 0.00 | ✅ |
| lazy-loader | light_load | 1.20 | 2.10x | 277.52 | 0.00 | ✅ |
| lazy-loader | medium_load | 5.14 | 8.99x | 277.52 | 0.00 | ✅ |
| lazy-loader | heavy_load | 29.28 | 51.22x | 277.52 | 0.00 | ✅ |
| lazy-loader | enterprise_load | 66.73 | 116.73x | 277.75 | 0.00 | ✅ |
| lazy_import | light_load | 1.03 | 1.80x | 278.16 | 0.00 | ✅ |
| lazy_import 🥉 | medium_load | 4.82 | 8.43x | 278.64 | 0.00 | ✅ |
| lazy_import 🥈 | heavy_load | 16.16 | 28.27x | 280.76 | 0.00 | ✅ |
| lazy_import 🥇 | enterprise_load | 43.68 | 76.40x | 285.52 | 0.00 | ✅ |
| pipimport | light_load | 1.00 | 1.74x | 261.55 | 0.00 | ✅ |
| pipimport | medium_load | 5.17 | 9.04x | 262.53 | 0.00 | ✅ |
| pipimport 🥉 | heavy_load | 16.31 | 28.53x | 265.14 | 0.00 | ✅ |
| pipimport | enterprise_load | 45.88 | 80.24x | 270.25 | 0.00 | ✅ |
| pylazyimports 🥈 | light_load | 0.93 | 1.63x | 285.62 | 0.00 | ✅ |
| pylazyimports 🥈 | medium_load | 4.81 | 8.41x | 286.18 | 0.00 | ✅ |
| pylazyimports 🥇 | heavy_load | 16.01 | 28.01x | 288.32 | 0.00 | ✅ |
| pylazyimports 🥈 | enterprise_load | 44.22 | 77.36x | 295.30 | 0.00 | ✅ |
| xwlazy | light_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| xwlazy | medium_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| xwlazy | heavy_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| xwlazy | enterprise_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |

#### Detailed Results

##### deferred-import 🥉

**Test:** light_load 🥉

- Import Time: 0.96 ms
- Relative Time: 1.67x (vs baseline)
- Memory Peak: 270.36 MB
- Memory Avg: 270.35 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** medium_load

- Import Time: 6.27 ms
- Relative Time: 10.96x (vs baseline)
- Memory Peak: 271.45 MB
- Memory Avg: 270.90 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** heavy_load

- Import Time: 19.10 ms
- Relative Time: 33.41x (vs baseline)
- Memory Peak: 273.44 MB
- Memory Avg: 272.44 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** enterprise_load

- Import Time: 77.62 ms
- Relative Time: 135.77x (vs baseline)
- Memory Peak: 277.52 MB
- Memory Avg: 275.48 MB
- Package Size: 0.00 MB
- Features: deferred_loading

##### lazi 🥇

**Test:** light_load 🥇

- Import Time: 0.43 ms
- Relative Time: 0.76x (vs baseline)
- Memory Peak: 295.38 MB
- Memory Avg: 295.37 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** medium_load 🥇

- Import Time: 4.73 ms
- Relative Time: 8.28x (vs baseline)
- Memory Peak: 296.73 MB
- Memory Avg: 296.06 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** heavy_load

- Import Time: 16.34 ms
- Relative Time: 28.59x (vs baseline)
- Memory Peak: 299.11 MB
- Memory Avg: 297.93 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** enterprise_load

- Import Time: 44.85 ms
- Relative Time: 78.45x (vs baseline)
- Memory Peak: 306.04 MB
- Memory Avg: 302.71 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

##### lazy-imports

**Test:** light_load

- Import Time: 1.89 ms
- Relative Time: 3.30x (vs baseline)
- Memory Peak: 277.76 MB
- Memory Avg: 277.76 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 7.53 ms
- Relative Time: 13.16x (vs baseline)
- Memory Peak: 277.77 MB
- Memory Avg: 277.77 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 25.32 ms
- Relative Time: 44.29x (vs baseline)
- Memory Peak: 277.77 MB
- Memory Avg: 277.77 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 56.43 ms
- Relative Time: 98.70x (vs baseline)
- Memory Peak: 278.15 MB
- Memory Avg: 277.96 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### lazy-imports-lite 🥉

**Test:** light_load

- Import Time: 1.10 ms
- Relative Time: 1.92x (vs baseline)
- Memory Peak: 306.12 MB
- Memory Avg: 306.12 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** medium_load

- Import Time: 6.01 ms
- Relative Time: 10.51x (vs baseline)
- Memory Peak: 307.09 MB
- Memory Avg: 306.61 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** heavy_load

- Import Time: 16.86 ms
- Relative Time: 29.49x (vs baseline)
- Memory Peak: 309.43 MB
- Memory Avg: 308.26 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** enterprise_load 🥉

- Import Time: 44.33 ms
- Relative Time: 77.54x (vs baseline)
- Memory Peak: 313.14 MB
- Memory Avg: 311.29 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

##### lazy-loader

**Test:** light_load

- Import Time: 1.20 ms
- Relative Time: 2.10x (vs baseline)
- Memory Peak: 277.52 MB
- Memory Avg: 277.52 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** medium_load

- Import Time: 5.14 ms
- Relative Time: 8.99x (vs baseline)
- Memory Peak: 277.52 MB
- Memory Avg: 277.52 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** heavy_load

- Import Time: 29.28 ms
- Relative Time: 51.22x (vs baseline)
- Memory Peak: 277.52 MB
- Memory Avg: 277.52 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** enterprise_load

- Import Time: 66.73 ms
- Relative Time: 116.73x (vs baseline)
- Memory Peak: 277.75 MB
- Memory Avg: 277.64 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

##### lazy_import 🥇

**Test:** light_load

- Import Time: 1.03 ms
- Relative Time: 1.80x (vs baseline)
- Memory Peak: 278.16 MB
- Memory Avg: 278.15 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load 🥉

- Import Time: 4.82 ms
- Relative Time: 8.43x (vs baseline)
- Memory Peak: 278.64 MB
- Memory Avg: 278.40 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load 🥈

- Import Time: 16.16 ms
- Relative Time: 28.27x (vs baseline)
- Memory Peak: 280.76 MB
- Memory Avg: 279.70 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load 🥇

- Import Time: 43.68 ms
- Relative Time: 76.40x (vs baseline)
- Memory Peak: 285.52 MB
- Memory Avg: 283.14 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### pipimport 🥉

**Test:** light_load

- Import Time: 1.00 ms
- Relative Time: 1.74x (vs baseline)
- Memory Peak: 261.55 MB
- Memory Avg: 261.47 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** medium_load

- Import Time: 5.17 ms
- Relative Time: 9.04x (vs baseline)
- Memory Peak: 262.53 MB
- Memory Avg: 262.04 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** heavy_load 🥉

- Import Time: 16.31 ms
- Relative Time: 28.53x (vs baseline)
- Memory Peak: 265.14 MB
- Memory Avg: 263.85 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** enterprise_load

- Import Time: 45.88 ms
- Relative Time: 80.24x (vs baseline)
- Memory Peak: 270.25 MB
- Memory Avg: 267.81 MB
- Package Size: 0.00 MB
- Features: auto_install

##### pylazyimports 🥇

**Test:** light_load 🥈

- Import Time: 0.93 ms
- Relative Time: 1.63x (vs baseline)
- Memory Peak: 285.62 MB
- Memory Avg: 285.61 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load 🥈

- Import Time: 4.81 ms
- Relative Time: 8.41x (vs baseline)
- Memory Peak: 286.18 MB
- Memory Avg: 285.90 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load 🥇

- Import Time: 16.01 ms
- Relative Time: 28.01x (vs baseline)
- Memory Peak: 288.32 MB
- Memory Avg: 287.25 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load 🥈

- Import Time: 44.22 ms
- Relative Time: 77.36x (vs baseline)
- Memory Peak: 295.30 MB
- Memory Avg: 291.81 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### xwlazy

**Test:** light_load

- ❌ Error: module 'collections' has no attribute 'abc'

**Test:** medium_load

- ❌ Error: module 'collections' has no attribute 'abc'

**Test:** heavy_load

- ❌ Error: module 'collections' has no attribute 'abc'

**Test:** enterprise_load

- ❌ Error: module 'collections' has no attribute 'abc'


### Background Loading

*Background loading - BACKGROUND mode*

#### Top 3 Rankings by Load Test

##### Enterprise Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazy-imports | 43.86 | 76.72x |
| 2 🥈 | pylazyimports | 45.45 | 79.49x |
| 3 🥉 | lazy-imports-lite | 46.90 | 82.03x |

##### Heavy Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazy-imports-lite | 16.32 | 28.55x |
| 2 🥈 | lazy-loader | 16.90 | 29.57x |
| 3 🥉 | pylazyimports | 17.13 | 29.97x |

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazi | 0.38 | 0.67x |
| 2 🥈 | lazy-imports-lite | 0.62 | 1.08x |
| 3 🥉 | lazy-imports | 0.65 | 1.14x |

##### Medium Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazy-imports-lite | 4.82 | 8.44x |
| 2 🥈 | lazy_import | 5.38 | 9.41x |
| 3 🥉 | pylazyimports | 5.40 | 9.45x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| deferred-import | light_load | 0.94 | 1.64x | 210.08 | 0.00 | ✅ |
| deferred-import | medium_load | 6.45 | 11.27x | 210.32 | 0.00 | ✅ |
| deferred-import | heavy_load | 19.29 | 33.74x | 211.38 | 0.00 | ✅ |
| deferred-import | enterprise_load | 51.54 | 90.16x | 217.23 | 0.00 | ✅ |
| lazi 🥇 | light_load | 0.38 | 0.67x | 245.18 | 0.00 | ✅ |
| lazi | medium_load | 6.46 | 11.31x | 245.19 | 0.00 | ✅ |
| lazi | heavy_load | 18.57 | 32.48x | 245.36 | 0.00 | ✅ |
| lazi | enterprise_load | 47.71 | 83.45x | 250.59 | 0.00 | ✅ |
| lazy-imports 🥉 | light_load | 0.65 | 1.14x | 226.28 | 0.00 | ✅ |
| lazy-imports | medium_load | 7.02 | 12.28x | 226.87 | 0.00 | ✅ |
| lazy-imports | heavy_load | 21.87 | 38.26x | 229.22 | 0.00 | ✅ |
| lazy-imports 🥇 | enterprise_load | 43.86 | 76.72x | 238.02 | 0.00 | ✅ |
| lazy-imports-lite 🥈 | light_load | 0.62 | 1.08x | 250.66 | 0.00 | ✅ |
| lazy-imports-lite 🥇 | medium_load | 4.82 | 8.44x | 251.44 | 0.00 | ✅ |
| lazy-imports-lite 🥇 | heavy_load | 16.32 | 28.55x | 253.31 | 0.00 | ✅ |
| lazy-imports-lite 🥉 | enterprise_load | 46.90 | 82.03x | 261.04 | 0.00 | ✅ |
| lazy-loader | light_load | 0.90 | 1.58x | 217.32 | 0.00 | ✅ |
| lazy-loader | medium_load | 6.35 | 11.11x | 218.45 | 0.00 | ✅ |
| lazy-loader 🥈 | heavy_load | 16.90 | 29.57x | 220.77 | 0.00 | ✅ |
| lazy-loader | enterprise_load | 53.29 | 93.21x | 226.16 | 0.00 | ✅ |
| lazy_import | light_load | 1.79 | 3.12x | 238.23 | 0.00 | ✅ |
| lazy_import 🥈 | medium_load | 5.38 | 9.41x | 239.42 | 0.00 | ✅ |
| lazy_import | heavy_load | 17.62 | 30.82x | 241.42 | 0.00 | ✅ |
| lazy_import | enterprise_load | 51.12 | 89.41x | 244.53 | 0.00 | ✅ |
| pipimport | light_load | 0.98 | 1.72x | 209.19 | 0.00 | ✅ |
| pipimport | medium_load | 6.47 | 11.32x | 209.59 | 0.00 | ✅ |
| pipimport | heavy_load | 18.07 | 31.61x | 209.66 | 0.00 | ✅ |
| pipimport | enterprise_load | 52.67 | 92.13x | 210.02 | 0.00 | ✅ |
| pylazyimports | light_load | 1.19 | 2.08x | 244.53 | 0.00 | ✅ |
| pylazyimports 🥉 | medium_load | 5.40 | 9.45x | 244.53 | 0.00 | ✅ |
| pylazyimports 🥉 | heavy_load | 17.13 | 29.97x | 244.53 | 0.00 | ✅ |
| pylazyimports 🥈 | enterprise_load | 45.45 | 79.49x | 245.18 | 0.00 | ✅ |
| xwlazy | light_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| xwlazy | medium_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| xwlazy | heavy_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| xwlazy | enterprise_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |

#### Detailed Results

##### deferred-import

**Test:** light_load

- Import Time: 0.94 ms
- Relative Time: 1.64x (vs baseline)
- Memory Peak: 210.08 MB
- Memory Avg: 210.08 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** medium_load

- Import Time: 6.45 ms
- Relative Time: 11.27x (vs baseline)
- Memory Peak: 210.32 MB
- Memory Avg: 210.20 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** heavy_load

- Import Time: 19.29 ms
- Relative Time: 33.74x (vs baseline)
- Memory Peak: 211.38 MB
- Memory Avg: 210.85 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** enterprise_load

- Import Time: 51.54 ms
- Relative Time: 90.16x (vs baseline)
- Memory Peak: 217.23 MB
- Memory Avg: 214.31 MB
- Package Size: 0.00 MB
- Features: deferred_loading

##### lazi 🥇

**Test:** light_load 🥇

- Import Time: 0.38 ms
- Relative Time: 0.67x (vs baseline)
- Memory Peak: 245.18 MB
- Memory Avg: 245.18 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** medium_load

- Import Time: 6.46 ms
- Relative Time: 11.31x (vs baseline)
- Memory Peak: 245.19 MB
- Memory Avg: 245.19 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** heavy_load

- Import Time: 18.57 ms
- Relative Time: 32.48x (vs baseline)
- Memory Peak: 245.36 MB
- Memory Avg: 245.27 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** enterprise_load

- Import Time: 47.71 ms
- Relative Time: 83.45x (vs baseline)
- Memory Peak: 250.59 MB
- Memory Avg: 247.97 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

##### lazy-imports 🥇

**Test:** light_load 🥉

- Import Time: 0.65 ms
- Relative Time: 1.14x (vs baseline)
- Memory Peak: 226.28 MB
- Memory Avg: 226.27 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 7.02 ms
- Relative Time: 12.28x (vs baseline)
- Memory Peak: 226.87 MB
- Memory Avg: 226.58 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 21.87 ms
- Relative Time: 38.26x (vs baseline)
- Memory Peak: 229.22 MB
- Memory Avg: 228.05 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load 🥇

- Import Time: 43.86 ms
- Relative Time: 76.72x (vs baseline)
- Memory Peak: 238.02 MB
- Memory Avg: 233.62 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### lazy-imports-lite 🥇

**Test:** light_load 🥈

- Import Time: 0.62 ms
- Relative Time: 1.08x (vs baseline)
- Memory Peak: 250.66 MB
- Memory Avg: 250.65 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** medium_load 🥇

- Import Time: 4.82 ms
- Relative Time: 8.44x (vs baseline)
- Memory Peak: 251.44 MB
- Memory Avg: 251.05 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** heavy_load 🥇

- Import Time: 16.32 ms
- Relative Time: 28.55x (vs baseline)
- Memory Peak: 253.31 MB
- Memory Avg: 252.38 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** enterprise_load 🥉

- Import Time: 46.90 ms
- Relative Time: 82.03x (vs baseline)
- Memory Peak: 261.04 MB
- Memory Avg: 257.18 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

##### lazy-loader 🥈

**Test:** light_load

- Import Time: 0.90 ms
- Relative Time: 1.58x (vs baseline)
- Memory Peak: 217.32 MB
- Memory Avg: 217.31 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** medium_load

- Import Time: 6.35 ms
- Relative Time: 11.11x (vs baseline)
- Memory Peak: 218.45 MB
- Memory Avg: 217.89 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** heavy_load 🥈

- Import Time: 16.90 ms
- Relative Time: 29.57x (vs baseline)
- Memory Peak: 220.77 MB
- Memory Avg: 219.61 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** enterprise_load

- Import Time: 53.29 ms
- Relative Time: 93.21x (vs baseline)
- Memory Peak: 226.16 MB
- Memory Avg: 223.46 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

##### lazy_import 🥈

**Test:** light_load

- Import Time: 1.79 ms
- Relative Time: 3.12x (vs baseline)
- Memory Peak: 238.23 MB
- Memory Avg: 238.20 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load 🥈

- Import Time: 5.38 ms
- Relative Time: 9.41x (vs baseline)
- Memory Peak: 239.42 MB
- Memory Avg: 238.83 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 17.62 ms
- Relative Time: 30.82x (vs baseline)
- Memory Peak: 241.42 MB
- Memory Avg: 240.44 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 51.12 ms
- Relative Time: 89.41x (vs baseline)
- Memory Peak: 244.53 MB
- Memory Avg: 242.99 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### pipimport

**Test:** light_load

- Import Time: 0.98 ms
- Relative Time: 1.72x (vs baseline)
- Memory Peak: 209.19 MB
- Memory Avg: 209.10 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** medium_load

- Import Time: 6.47 ms
- Relative Time: 11.32x (vs baseline)
- Memory Peak: 209.59 MB
- Memory Avg: 209.39 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** heavy_load

- Import Time: 18.07 ms
- Relative Time: 31.61x (vs baseline)
- Memory Peak: 209.66 MB
- Memory Avg: 209.63 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** enterprise_load

- Import Time: 52.67 ms
- Relative Time: 92.13x (vs baseline)
- Memory Peak: 210.02 MB
- Memory Avg: 209.85 MB
- Package Size: 0.00 MB
- Features: auto_install

##### pylazyimports 🥈

**Test:** light_load

- Import Time: 1.19 ms
- Relative Time: 2.08x (vs baseline)
- Memory Peak: 244.53 MB
- Memory Avg: 244.53 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load 🥉

- Import Time: 5.40 ms
- Relative Time: 9.45x (vs baseline)
- Memory Peak: 244.53 MB
- Memory Avg: 244.53 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load 🥉

- Import Time: 17.13 ms
- Relative Time: 29.97x (vs baseline)
- Memory Peak: 244.53 MB
- Memory Avg: 244.53 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load 🥈

- Import Time: 45.45 ms
- Relative Time: 79.49x (vs baseline)
- Memory Peak: 245.18 MB
- Memory Avg: 244.86 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### xwlazy

**Test:** light_load

- ❌ Error: module 'collections' has no attribute 'abc'

**Test:** medium_load

- ❌ Error: module 'collections' has no attribute 'abc'

**Test:** heavy_load

- ❌ Error: module 'collections' has no attribute 'abc'

**Test:** enterprise_load

- ❌ Error: module 'collections' has no attribute 'abc'


### Lazy Import + Install

*Lazy import + auto-install - SMART mode (on-demand)*

#### Top 3 Rankings by Load Test

##### Enterprise Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | pylazyimports | 49.03 | 85.75x |
| 2 🥈 | pipimport | 49.55 | 86.67x |
| 3 🥉 | lazy-imports-lite | 50.71 | 88.70x |

##### Heavy Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazy-imports | 17.78 | 31.09x |
| 2 🥈 | pipimport | 17.95 | 31.41x |
| 3 🥉 | pylazyimports | 18.68 | 32.68x |

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazi | 0.45 | 0.78x |
| 2 🥈 | lazy-imports | 0.58 | 1.02x |
| 3 🥉 | deferred-import | 1.04 | 1.81x |

##### Medium Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | pylazyimports | 5.53 | 9.67x |
| 2 🥈 | pipimport | 5.73 | 10.01x |
| 3 🥉 | deferred-import | 5.81 | 10.16x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| deferred-import 🥉 | light_load | 1.04 | 1.81x | 104.82 | 0.00 | ✅ |
| deferred-import 🥉 | medium_load | 5.81 | 10.16x | 105.82 | 0.00 | ✅ |
| deferred-import | heavy_load | 20.13 | 35.21x | 105.93 | 0.00 | ✅ |
| deferred-import | enterprise_load | 53.33 | 93.28x | 106.60 | 0.00 | ✅ |
| lazi 🥇 | light_load | 0.45 | 0.78x | 138.62 | 0.00 | ✅ |
| lazi | medium_load | 6.30 | 11.01x | 140.00 | 0.00 | ✅ |
| lazi | heavy_load | 23.54 | 41.18x | 141.03 | 0.00 | ✅ |
| lazi | enterprise_load | 53.50 | 93.58x | 141.68 | 0.00 | ✅ |
| lazy-imports 🥈 | light_load | 0.58 | 1.02x | 116.64 | 0.00 | ✅ |
| lazy-imports | medium_load | 8.11 | 14.19x | 118.06 | 0.00 | ✅ |
| lazy-imports 🥇 | heavy_load | 17.78 | 31.09x | 119.80 | 0.00 | ✅ |
| lazy-imports | enterprise_load | 54.49 | 95.32x | 123.26 | 0.00 | ✅ |
| lazy-imports-lite | light_load | 1.44 | 2.52x | 141.66 | 0.00 | ✅ |
| lazy-imports-lite | medium_load | 6.82 | 11.93x | 141.66 | 0.00 | ✅ |
| lazy-imports-lite | heavy_load | 22.27 | 38.96x | 143.14 | 0.00 | ✅ |
| lazy-imports-lite 🥉 | enterprise_load | 50.71 | 88.70x | 149.19 | 0.00 | ✅ |
| lazy-loader | light_load | 1.21 | 2.11x | 106.61 | 0.00 | ✅ |
| lazy-loader | medium_load | 6.41 | 11.21x | 107.09 | 0.00 | ✅ |
| lazy-loader | heavy_load | 21.01 | 36.75x | 108.69 | 0.00 | ✅ |
| lazy-loader | enterprise_load | 55.94 | 97.86x | 116.55 | 0.00 | ✅ |
| lazy_import | light_load | 1.49 | 2.61x | 123.26 | 0.00 | ✅ |
| lazy_import | medium_load | 6.77 | 11.84x | 123.26 | 0.00 | ✅ |
| lazy_import | heavy_load | 18.74 | 32.78x | 123.31 | 0.00 | ✅ |
| lazy_import | enterprise_load | 56.20 | 98.31x | 127.77 | 0.00 | ✅ |
| pipimport | light_load | 1.57 | 2.75x | 94.42 | 0.00 | ✅ |
| pipimport 🥈 | medium_load | 5.73 | 10.01x | 95.55 | 0.00 | ✅ |
| pipimport 🥈 | heavy_load | 17.95 | 31.41x | 97.17 | 0.00 | ✅ |
| pipimport 🥈 | enterprise_load | 49.55 | 86.67x | 104.59 | 0.00 | ✅ |
| pylazyimports | light_load | 1.44 | 2.52x | 127.90 | 0.00 | ✅ |
| pylazyimports 🥇 | medium_load | 5.53 | 9.67x | 128.58 | 0.00 | ✅ |
| pylazyimports 🥉 | heavy_load | 18.68 | 32.68x | 130.64 | 0.00 | ✅ |
| pylazyimports 🥇 | enterprise_load | 49.03 | 85.75x | 138.52 | 0.00 | ✅ |
| xwlazy | light_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| xwlazy | medium_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| xwlazy | heavy_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| xwlazy | enterprise_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |

#### Detailed Results

##### deferred-import 🥉

**Test:** light_load 🥉

- Import Time: 1.04 ms
- Relative Time: 1.81x (vs baseline)
- Memory Peak: 104.82 MB
- Memory Avg: 104.81 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** medium_load 🥉

- Import Time: 5.81 ms
- Relative Time: 10.16x (vs baseline)
- Memory Peak: 105.82 MB
- Memory Avg: 105.32 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** heavy_load

- Import Time: 20.13 ms
- Relative Time: 35.21x (vs baseline)
- Memory Peak: 105.93 MB
- Memory Avg: 105.88 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** enterprise_load

- Import Time: 53.33 ms
- Relative Time: 93.28x (vs baseline)
- Memory Peak: 106.60 MB
- Memory Avg: 106.27 MB
- Package Size: 0.00 MB
- Features: deferred_loading

##### lazi 🥇

**Test:** light_load 🥇

- Import Time: 0.45 ms
- Relative Time: 0.78x (vs baseline)
- Memory Peak: 138.62 MB
- Memory Avg: 138.61 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** medium_load

- Import Time: 6.30 ms
- Relative Time: 11.01x (vs baseline)
- Memory Peak: 140.00 MB
- Memory Avg: 139.31 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** heavy_load

- Import Time: 23.54 ms
- Relative Time: 41.18x (vs baseline)
- Memory Peak: 141.03 MB
- Memory Avg: 140.53 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** enterprise_load

- Import Time: 53.50 ms
- Relative Time: 93.58x (vs baseline)
- Memory Peak: 141.68 MB
- Memory Avg: 141.36 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

##### lazy-imports 🥇

**Test:** light_load 🥈

- Import Time: 0.58 ms
- Relative Time: 1.02x (vs baseline)
- Memory Peak: 116.64 MB
- Memory Avg: 116.63 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 8.11 ms
- Relative Time: 14.19x (vs baseline)
- Memory Peak: 118.06 MB
- Memory Avg: 117.35 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load 🥇

- Import Time: 17.78 ms
- Relative Time: 31.09x (vs baseline)
- Memory Peak: 119.80 MB
- Memory Avg: 118.97 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 54.49 ms
- Relative Time: 95.32x (vs baseline)
- Memory Peak: 123.26 MB
- Memory Avg: 121.63 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### lazy-imports-lite 🥉

**Test:** light_load

- Import Time: 1.44 ms
- Relative Time: 2.52x (vs baseline)
- Memory Peak: 141.66 MB
- Memory Avg: 141.66 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** medium_load

- Import Time: 6.82 ms
- Relative Time: 11.93x (vs baseline)
- Memory Peak: 141.66 MB
- Memory Avg: 141.66 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** heavy_load

- Import Time: 22.27 ms
- Relative Time: 38.96x (vs baseline)
- Memory Peak: 143.14 MB
- Memory Avg: 142.40 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** enterprise_load 🥉

- Import Time: 50.71 ms
- Relative Time: 88.70x (vs baseline)
- Memory Peak: 149.19 MB
- Memory Avg: 146.17 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

##### lazy-loader

**Test:** light_load

- Import Time: 1.21 ms
- Relative Time: 2.11x (vs baseline)
- Memory Peak: 106.61 MB
- Memory Avg: 106.61 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** medium_load

- Import Time: 6.41 ms
- Relative Time: 11.21x (vs baseline)
- Memory Peak: 107.09 MB
- Memory Avg: 106.85 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** heavy_load

- Import Time: 21.01 ms
- Relative Time: 36.75x (vs baseline)
- Memory Peak: 108.69 MB
- Memory Avg: 107.89 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** enterprise_load

- Import Time: 55.94 ms
- Relative Time: 97.86x (vs baseline)
- Memory Peak: 116.55 MB
- Memory Avg: 112.62 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

##### lazy_import

**Test:** light_load

- Import Time: 1.49 ms
- Relative Time: 2.61x (vs baseline)
- Memory Peak: 123.26 MB
- Memory Avg: 123.26 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 6.77 ms
- Relative Time: 11.84x (vs baseline)
- Memory Peak: 123.26 MB
- Memory Avg: 123.26 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 18.74 ms
- Relative Time: 32.78x (vs baseline)
- Memory Peak: 123.31 MB
- Memory Avg: 123.29 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 56.20 ms
- Relative Time: 98.31x (vs baseline)
- Memory Peak: 127.77 MB
- Memory Avg: 125.54 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### pipimport 🥈

**Test:** light_load

- Import Time: 1.57 ms
- Relative Time: 2.75x (vs baseline)
- Memory Peak: 94.42 MB
- Memory Avg: 94.35 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** medium_load 🥈

- Import Time: 5.73 ms
- Relative Time: 10.01x (vs baseline)
- Memory Peak: 95.55 MB
- Memory Avg: 94.99 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** heavy_load 🥈

- Import Time: 17.95 ms
- Relative Time: 31.41x (vs baseline)
- Memory Peak: 97.17 MB
- Memory Avg: 96.44 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** enterprise_load 🥈

- Import Time: 49.55 ms
- Relative Time: 86.67x (vs baseline)
- Memory Peak: 104.59 MB
- Memory Avg: 100.90 MB
- Package Size: 0.00 MB
- Features: auto_install

##### pylazyimports 🥇

**Test:** light_load

- Import Time: 1.44 ms
- Relative Time: 2.52x (vs baseline)
- Memory Peak: 127.90 MB
- Memory Avg: 127.89 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load 🥇

- Import Time: 5.53 ms
- Relative Time: 9.67x (vs baseline)
- Memory Peak: 128.58 MB
- Memory Avg: 128.24 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load 🥉

- Import Time: 18.68 ms
- Relative Time: 32.68x (vs baseline)
- Memory Peak: 130.64 MB
- Memory Avg: 129.62 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load 🥇

- Import Time: 49.03 ms
- Relative Time: 85.75x (vs baseline)
- Memory Peak: 138.52 MB
- Memory Avg: 134.58 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### xwlazy

**Test:** light_load

- ❌ Error: module 'collections' has no attribute 'abc'

**Test:** medium_load

- ❌ Error: module 'collections' has no attribute 'abc'

**Test:** heavy_load

- ❌ Error: module 'collections' has no attribute 'abc'

**Test:** enterprise_load

- ❌ Error: module 'collections' has no attribute 'abc'


### Basic Lazy Import

*Basic lazy import (fair comparison - all libraries) - LITE mode*

#### Top 3 Rankings by Load Test

##### Enterprise Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazy-loader | 46.54 | 81.41x |
| 2 🥈 | deferred-import | 46.87 | 81.99x |
| 3 🥉 | lazy-imports | 47.97 | 83.91x |

##### Heavy Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazy-imports | 16.87 | 29.52x |
| 2 🥈 | pylazyimports | 17.37 | 30.39x |
| 3 🥉 | deferred-import | 17.55 | 30.69x |

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazi | 0.38 | 0.67x |
| 2 🥈 | lazy-imports | 0.64 | 1.12x |
| 3 🥉 | deferred-import | 0.84 | 1.46x |

##### Medium Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | deferred-import | 4.78 | 8.36x |
| 2 🥈 | lazy-imports | 5.31 | 9.28x |
| 3 🥉 | lazy-loader | 5.36 | 9.37x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| deferred-import 🥉 | light_load | 0.84 | 1.46x | 41.56 | 0.00 | ✅ |
| deferred-import 🥇 | medium_load | 4.78 | 8.36x | 42.29 | 0.00 | ✅ |
| deferred-import 🥉 | heavy_load | 17.55 | 30.69x | 44.58 | 0.00 | ✅ |
| deferred-import 🥈 | enterprise_load | 46.87 | 81.99x | 49.33 | 0.00 | ✅ |
| lazi 🥇 | light_load | 0.38 | 0.67x | 80.50 | 0.00 | ✅ |
| lazi | medium_load | 6.25 | 10.93x | 81.09 | 0.00 | ✅ |
| lazi | heavy_load | 18.74 | 32.78x | 83.45 | 0.00 | ✅ |
| lazi | enterprise_load | 50.89 | 89.02x | 88.11 | 0.00 | ✅ |
| lazy-imports 🥈 | light_load | 0.64 | 1.12x | 58.30 | 0.00 | ✅ |
| lazy-imports 🥈 | medium_load | 5.31 | 9.28x | 59.44 | 0.00 | ✅ |
| lazy-imports 🥇 | heavy_load | 16.87 | 29.52x | 61.95 | 0.00 | ✅ |
| lazy-imports 🥉 | enterprise_load | 47.97 | 83.91x | 67.65 | 0.00 | ✅ |
| lazy-imports-lite | light_load | 1.14 | 1.99x | 88.11 | 0.00 | ✅ |
| lazy-imports-lite | medium_load | 6.51 | 11.39x | 88.12 | 0.00 | ✅ |
| lazy-imports-lite | heavy_load | 20.91 | 36.57x | 88.16 | 0.00 | ✅ |
| lazy-imports-lite | enterprise_load | 56.13 | 98.18x | 92.44 | 0.00 | ✅ |
| lazy-loader | light_load | 1.42 | 2.48x | 49.33 | 0.00 | ✅ |
| lazy-loader 🥉 | medium_load | 5.36 | 9.37x | 49.35 | 0.00 | ✅ |
| lazy-loader | heavy_load | 17.65 | 30.88x | 50.43 | 0.00 | ✅ |
| lazy-loader 🥇 | enterprise_load | 46.54 | 81.41x | 58.15 | 0.00 | ✅ |
| lazy_import | light_load | 1.74 | 3.05x | 69.00 | 0.00 | ✅ |
| lazy_import | medium_load | 6.08 | 10.63x | 69.25 | 0.00 | ✅ |
| lazy_import | heavy_load | 20.89 | 36.55x | 70.88 | 0.00 | ✅ |
| lazy_import | enterprise_load | 50.55 | 88.43x | 71.75 | 0.00 | ✅ |
| pipimport | light_load | 1.52 | 2.66x | 28.34 | 0.00 | ✅ |
| pipimport | medium_load | 7.31 | 12.79x | 29.81 | 0.00 | ✅ |
| pipimport | heavy_load | 21.13 | 36.95x | 33.67 | 0.00 | ✅ |
| pipimport | enterprise_load | 61.53 | 107.63x | 41.25 | 0.00 | ✅ |
| pylazyimports | light_load | 0.88 | 1.54x | 71.82 | 0.00 | ✅ |
| pylazyimports | medium_load | 6.07 | 10.62x | 72.59 | 0.00 | ✅ |
| pylazyimports 🥈 | heavy_load | 17.37 | 30.39x | 74.73 | 0.00 | ✅ |
| pylazyimports | enterprise_load | 54.31 | 94.99x | 80.39 | 0.00 | ✅ |
| xwlazy | light_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| xwlazy | medium_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| xwlazy | heavy_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| xwlazy | enterprise_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |

#### Detailed Results

##### deferred-import 🥇

**Test:** light_load 🥉

- Import Time: 0.84 ms
- Relative Time: 1.46x (vs baseline)
- Memory Peak: 41.56 MB
- Memory Avg: 41.55 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** medium_load 🥇

- Import Time: 4.78 ms
- Relative Time: 8.36x (vs baseline)
- Memory Peak: 42.29 MB
- Memory Avg: 41.93 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** heavy_load 🥉

- Import Time: 17.55 ms
- Relative Time: 30.69x (vs baseline)
- Memory Peak: 44.58 MB
- Memory Avg: 43.44 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** enterprise_load 🥈

- Import Time: 46.87 ms
- Relative Time: 81.99x (vs baseline)
- Memory Peak: 49.33 MB
- Memory Avg: 46.96 MB
- Package Size: 0.00 MB
- Features: deferred_loading

##### lazi 🥇

**Test:** light_load 🥇

- Import Time: 0.38 ms
- Relative Time: 0.67x (vs baseline)
- Memory Peak: 80.50 MB
- Memory Avg: 80.50 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** medium_load

- Import Time: 6.25 ms
- Relative Time: 10.93x (vs baseline)
- Memory Peak: 81.09 MB
- Memory Avg: 80.79 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** heavy_load

- Import Time: 18.74 ms
- Relative Time: 32.78x (vs baseline)
- Memory Peak: 83.45 MB
- Memory Avg: 82.28 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** enterprise_load

- Import Time: 50.89 ms
- Relative Time: 89.02x (vs baseline)
- Memory Peak: 88.11 MB
- Memory Avg: 85.78 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

##### lazy-imports 🥇

**Test:** light_load 🥈

- Import Time: 0.64 ms
- Relative Time: 1.12x (vs baseline)
- Memory Peak: 58.30 MB
- Memory Avg: 58.27 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load 🥈

- Import Time: 5.31 ms
- Relative Time: 9.28x (vs baseline)
- Memory Peak: 59.44 MB
- Memory Avg: 58.88 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load 🥇

- Import Time: 16.87 ms
- Relative Time: 29.52x (vs baseline)
- Memory Peak: 61.95 MB
- Memory Avg: 60.75 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load 🥉

- Import Time: 47.97 ms
- Relative Time: 83.91x (vs baseline)
- Memory Peak: 67.65 MB
- Memory Avg: 64.81 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### lazy-imports-lite

**Test:** light_load

- Import Time: 1.14 ms
- Relative Time: 1.99x (vs baseline)
- Memory Peak: 88.11 MB
- Memory Avg: 88.11 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** medium_load

- Import Time: 6.51 ms
- Relative Time: 11.39x (vs baseline)
- Memory Peak: 88.12 MB
- Memory Avg: 88.12 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** heavy_load

- Import Time: 20.91 ms
- Relative Time: 36.57x (vs baseline)
- Memory Peak: 88.16 MB
- Memory Avg: 88.14 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** enterprise_load

- Import Time: 56.13 ms
- Relative Time: 98.18x (vs baseline)
- Memory Peak: 92.44 MB
- Memory Avg: 90.30 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

##### lazy-loader 🥇

**Test:** light_load

- Import Time: 1.42 ms
- Relative Time: 2.48x (vs baseline)
- Memory Peak: 49.33 MB
- Memory Avg: 49.33 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** medium_load 🥉

- Import Time: 5.36 ms
- Relative Time: 9.37x (vs baseline)
- Memory Peak: 49.35 MB
- Memory Avg: 49.34 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** heavy_load

- Import Time: 17.65 ms
- Relative Time: 30.88x (vs baseline)
- Memory Peak: 50.43 MB
- Memory Avg: 49.89 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** enterprise_load 🥇

- Import Time: 46.54 ms
- Relative Time: 81.41x (vs baseline)
- Memory Peak: 58.15 MB
- Memory Avg: 54.30 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

##### lazy_import

**Test:** light_load

- Import Time: 1.74 ms
- Relative Time: 3.05x (vs baseline)
- Memory Peak: 69.00 MB
- Memory Avg: 68.40 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 6.08 ms
- Relative Time: 10.63x (vs baseline)
- Memory Peak: 69.25 MB
- Memory Avg: 69.12 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 20.89 ms
- Relative Time: 36.55x (vs baseline)
- Memory Peak: 70.88 MB
- Memory Avg: 70.07 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 50.55 ms
- Relative Time: 88.43x (vs baseline)
- Memory Peak: 71.75 MB
- Memory Avg: 71.32 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### pipimport

**Test:** light_load

- Import Time: 1.52 ms
- Relative Time: 2.66x (vs baseline)
- Memory Peak: 28.34 MB
- Memory Avg: 28.09 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** medium_load

- Import Time: 7.31 ms
- Relative Time: 12.79x (vs baseline)
- Memory Peak: 29.81 MB
- Memory Avg: 29.12 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** heavy_load

- Import Time: 21.13 ms
- Relative Time: 36.95x (vs baseline)
- Memory Peak: 33.67 MB
- Memory Avg: 31.79 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** enterprise_load

- Import Time: 61.53 ms
- Relative Time: 107.63x (vs baseline)
- Memory Peak: 41.25 MB
- Memory Avg: 37.48 MB
- Package Size: 0.00 MB
- Features: auto_install

##### pylazyimports 🥈

**Test:** light_load

- Import Time: 0.88 ms
- Relative Time: 1.54x (vs baseline)
- Memory Peak: 71.82 MB
- Memory Avg: 71.80 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 6.07 ms
- Relative Time: 10.62x (vs baseline)
- Memory Peak: 72.59 MB
- Memory Avg: 72.21 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load 🥈

- Import Time: 17.37 ms
- Relative Time: 30.39x (vs baseline)
- Memory Peak: 74.73 MB
- Memory Avg: 73.66 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 54.31 ms
- Relative Time: 94.99x (vs baseline)
- Memory Peak: 80.39 MB
- Memory Avg: 77.57 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### xwlazy

**Test:** light_load

- ❌ Error: module 'collections' has no attribute 'abc'

**Test:** medium_load

- ❌ Error: module 'collections' has no attribute 'abc'

**Test:** heavy_load

- ❌ Error: module 'collections' has no attribute 'abc'

**Test:** enterprise_load

- ❌ Error: module 'collections' has no attribute 'abc'


### Preload Mode

*Preload all modules on start - PRELOAD mode*

#### Top 3 Rankings by Load Test

##### Enterprise Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazy-loader | 50.00 | 87.47x |
| 2 🥈 | lazy_import | 51.22 | 89.60x |
| 3 🥉 | lazi | 52.58 | 91.98x |

##### Heavy Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazi | 15.69 | 27.45x |
| 2 🥈 | lazy-imports-lite | 19.20 | 33.58x |
| 3 🥉 | pipimport | 19.29 | 33.75x |

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazi | 0.55 | 0.96x |
| 2 🥈 | lazy-imports | 0.86 | 1.50x |
| 3 🥉 | deferred-import | 0.97 | 1.69x |

##### Medium Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | pipimport | 5.28 | 9.23x |
| 2 🥈 | lazi | 5.33 | 9.32x |
| 3 🥉 | lazy-loader | 5.68 | 9.94x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| deferred-import 🥉 | light_load | 0.97 | 1.69x | 159.31 | 0.00 | ✅ |
| deferred-import | medium_load | 8.68 | 15.19x | 159.32 | 0.00 | ✅ |
| deferred-import | heavy_load | 20.47 | 35.80x | 159.32 | 0.00 | ✅ |
| deferred-import | enterprise_load | 62.16 | 108.73x | 160.38 | 0.00 | ✅ |
| lazi 🥇 | light_load | 0.55 | 0.96x | 189.04 | 0.00 | ✅ |
| lazi 🥈 | medium_load | 5.33 | 9.32x | 190.35 | 0.00 | ✅ |
| lazi 🥇 | heavy_load | 15.69 | 27.45x | 192.45 | 0.00 | ✅ |
| lazi 🥉 | enterprise_load | 52.58 | 91.98x | 199.65 | 0.00 | ✅ |
| lazy-imports 🥈 | light_load | 0.86 | 1.50x | 170.93 | 0.00 | ✅ |
| lazy-imports | medium_load | 5.89 | 10.30x | 172.29 | 0.00 | ✅ |
| lazy-imports | heavy_load | 19.54 | 34.18x | 174.23 | 0.00 | ✅ |
| lazy-imports | enterprise_load | 53.39 | 93.39x | 180.41 | 0.00 | ✅ |
| lazy-imports-lite | light_load | 1.07 | 1.88x | 199.73 | 0.00 | ✅ |
| lazy-imports-lite | medium_load | 6.92 | 12.10x | 200.84 | 0.00 | ✅ |
| lazy-imports-lite 🥈 | heavy_load | 19.20 | 33.58x | 203.18 | 0.00 | ✅ |
| lazy-imports-lite | enterprise_load | 66.68 | 116.63x | 208.54 | 0.00 | ✅ |
| lazy-loader | light_load | 1.37 | 2.39x | 160.48 | 0.00 | ✅ |
| lazy-loader 🥉 | medium_load | 5.68 | 9.94x | 161.16 | 0.00 | ✅ |
| lazy-loader | heavy_load | 20.01 | 35.01x | 163.91 | 0.00 | ✅ |
| lazy-loader 🥇 | enterprise_load | 50.00 | 87.47x | 170.84 | 0.00 | ✅ |
| lazy_import | light_load | 2.18 | 3.81x | 180.54 | 0.00 | ✅ |
| lazy_import | medium_load | 5.93 | 10.38x | 181.71 | 0.00 | ✅ |
| lazy_import | heavy_load | 19.66 | 34.40x | 181.78 | 0.00 | ✅ |
| lazy_import 🥈 | enterprise_load | 51.22 | 89.60x | 182.23 | 0.00 | ✅ |
| pipimport | light_load | 1.48 | 2.58x | 149.56 | 0.00 | ✅ |
| pipimport 🥇 | medium_load | 5.28 | 9.23x | 150.96 | 0.00 | ✅ |
| pipimport 🥉 | heavy_load | 19.29 | 33.75x | 152.64 | 0.00 | ✅ |
| pipimport | enterprise_load | 56.91 | 99.55x | 159.31 | 0.00 | ✅ |
| pylazyimports | light_load | 1.21 | 2.12x | 182.20 | 0.00 | ✅ |
| pylazyimports | medium_load | 6.42 | 11.23x | 182.22 | 0.00 | ✅ |
| pylazyimports | heavy_load | 20.93 | 36.60x | 182.45 | 0.00 | ✅ |
| pylazyimports | enterprise_load | 58.31 | 101.99x | 188.84 | 0.00 | ✅ |
| xwlazy | light_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| xwlazy | medium_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| xwlazy | heavy_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| xwlazy | enterprise_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |

#### Detailed Results

##### deferred-import 🥉

**Test:** light_load 🥉

- Import Time: 0.97 ms
- Relative Time: 1.69x (vs baseline)
- Memory Peak: 159.31 MB
- Memory Avg: 159.31 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** medium_load

- Import Time: 8.68 ms
- Relative Time: 15.19x (vs baseline)
- Memory Peak: 159.32 MB
- Memory Avg: 159.31 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** heavy_load

- Import Time: 20.47 ms
- Relative Time: 35.80x (vs baseline)
- Memory Peak: 159.32 MB
- Memory Avg: 159.32 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** enterprise_load

- Import Time: 62.16 ms
- Relative Time: 108.73x (vs baseline)
- Memory Peak: 160.38 MB
- Memory Avg: 159.85 MB
- Package Size: 0.00 MB
- Features: deferred_loading

##### lazi 🥇

**Test:** light_load 🥇

- Import Time: 0.55 ms
- Relative Time: 0.96x (vs baseline)
- Memory Peak: 189.04 MB
- Memory Avg: 189.03 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** medium_load 🥈

- Import Time: 5.33 ms
- Relative Time: 9.32x (vs baseline)
- Memory Peak: 190.35 MB
- Memory Avg: 189.70 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** heavy_load 🥇

- Import Time: 15.69 ms
- Relative Time: 27.45x (vs baseline)
- Memory Peak: 192.45 MB
- Memory Avg: 191.41 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** enterprise_load 🥉

- Import Time: 52.58 ms
- Relative Time: 91.98x (vs baseline)
- Memory Peak: 199.65 MB
- Memory Avg: 196.10 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

##### lazy-imports 🥈

**Test:** light_load 🥈

- Import Time: 0.86 ms
- Relative Time: 1.50x (vs baseline)
- Memory Peak: 170.93 MB
- Memory Avg: 170.92 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 5.89 ms
- Relative Time: 10.30x (vs baseline)
- Memory Peak: 172.29 MB
- Memory Avg: 171.61 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 19.54 ms
- Relative Time: 34.18x (vs baseline)
- Memory Peak: 174.23 MB
- Memory Avg: 173.27 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 53.39 ms
- Relative Time: 93.39x (vs baseline)
- Memory Peak: 180.41 MB
- Memory Avg: 177.40 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### lazy-imports-lite 🥈

**Test:** light_load

- Import Time: 1.07 ms
- Relative Time: 1.88x (vs baseline)
- Memory Peak: 199.73 MB
- Memory Avg: 199.72 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** medium_load

- Import Time: 6.92 ms
- Relative Time: 12.10x (vs baseline)
- Memory Peak: 200.84 MB
- Memory Avg: 200.28 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** heavy_load 🥈

- Import Time: 19.20 ms
- Relative Time: 33.58x (vs baseline)
- Memory Peak: 203.18 MB
- Memory Avg: 202.01 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** enterprise_load

- Import Time: 66.68 ms
- Relative Time: 116.63x (vs baseline)
- Memory Peak: 208.54 MB
- Memory Avg: 205.86 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

##### lazy-loader 🥇

**Test:** light_load

- Import Time: 1.37 ms
- Relative Time: 2.39x (vs baseline)
- Memory Peak: 160.48 MB
- Memory Avg: 160.46 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** medium_load 🥉

- Import Time: 5.68 ms
- Relative Time: 9.94x (vs baseline)
- Memory Peak: 161.16 MB
- Memory Avg: 160.83 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** heavy_load

- Import Time: 20.01 ms
- Relative Time: 35.01x (vs baseline)
- Memory Peak: 163.91 MB
- Memory Avg: 162.54 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** enterprise_load 🥇

- Import Time: 50.00 ms
- Relative Time: 87.47x (vs baseline)
- Memory Peak: 170.84 MB
- Memory Avg: 167.38 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

##### lazy_import 🥈

**Test:** light_load

- Import Time: 2.18 ms
- Relative Time: 3.81x (vs baseline)
- Memory Peak: 180.54 MB
- Memory Avg: 180.51 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 5.93 ms
- Relative Time: 10.38x (vs baseline)
- Memory Peak: 181.71 MB
- Memory Avg: 181.12 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 19.66 ms
- Relative Time: 34.40x (vs baseline)
- Memory Peak: 181.78 MB
- Memory Avg: 181.76 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load 🥈

- Import Time: 51.22 ms
- Relative Time: 89.60x (vs baseline)
- Memory Peak: 182.23 MB
- Memory Avg: 182.00 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### pipimport 🥇

**Test:** light_load

- Import Time: 1.48 ms
- Relative Time: 2.58x (vs baseline)
- Memory Peak: 149.56 MB
- Memory Avg: 149.53 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** medium_load 🥇

- Import Time: 5.28 ms
- Relative Time: 9.23x (vs baseline)
- Memory Peak: 150.96 MB
- Memory Avg: 150.30 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** heavy_load 🥉

- Import Time: 19.29 ms
- Relative Time: 33.75x (vs baseline)
- Memory Peak: 152.64 MB
- Memory Avg: 151.88 MB
- Package Size: 0.00 MB
- Features: auto_install

**Test:** enterprise_load

- Import Time: 56.91 ms
- Relative Time: 99.55x (vs baseline)
- Memory Peak: 159.31 MB
- Memory Avg: 155.98 MB
- Package Size: 0.00 MB
- Features: auto_install

##### pylazyimports

**Test:** light_load

- Import Time: 1.21 ms
- Relative Time: 2.12x (vs baseline)
- Memory Peak: 182.20 MB
- Memory Avg: 182.20 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 6.42 ms
- Relative Time: 11.23x (vs baseline)
- Memory Peak: 182.22 MB
- Memory Avg: 182.21 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 20.93 ms
- Relative Time: 36.60x (vs baseline)
- Memory Peak: 182.45 MB
- Memory Avg: 182.34 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 58.31 ms
- Relative Time: 101.99x (vs baseline)
- Memory Peak: 188.84 MB
- Memory Avg: 185.65 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### xwlazy

**Test:** light_load

- ❌ Error: module 'collections' has no attribute 'abc'

**Test:** medium_load

- ❌ Error: module 'collections' has no attribute 'abc'

**Test:** heavy_load

- ❌ Error: module 'collections' has no attribute 'abc'

**Test:** enterprise_load

- ❌ Error: module 'collections' has no attribute 'abc'


## Overall Winner 👑

**lazi 👑** wins with **10 first place victory(ies)** across all test categories!

### Winner Summary

| Library | First Place Wins |
|---------|------------------|
| lazi 👑 | 10 |
| pylazyimports | 5 |
| deferred-import | 4 |
| lazy-imports | 3 |
| lazy-loader | 3 |
| lazy_import | 3 |
| pipimport | 2 |
| lazy-imports-lite | 2 |


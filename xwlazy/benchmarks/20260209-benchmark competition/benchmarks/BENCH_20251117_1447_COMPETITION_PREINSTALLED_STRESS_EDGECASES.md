# Competition Benchmark Report

**Generated:** 2025-11-17T14:47:08.916034

## Benchmark Scenarios

### Pre-Installed Scenario (Warm Performance)

**Description:** Libraries installed once at start. Tests run with libraries already in environment.

**Why:** Measures true import performance without installation overhead.

### Stress Tests

**Description:** High-load scenarios testing concurrency, rapid imports, memory pressure.

**Why:** Validates production-level performance and scalability.

### Edge Cases

**Description:** Invalid inputs, missing dependencies, error conditions.

**Why:** Tests robustness and error handling quality.


## Standard Tests

### Full Features

*All features enabled (xwlazy showcase)*

#### Top 3 Rankings by Load Test

##### Enterprise Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 42.96 | 39.09x |

##### Heavy Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 19.84 | 18.06x |

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 1.51 | 1.38x |

##### Medium Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 6.89 | 6.27x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| xwlazy 🥇 | light_load | 1.51 | 1.38x | 123.74 | 0.00 | ✅ |
| xwlazy 🥇 | medium_load | 6.89 | 6.27x | 123.74 | 0.00 | ✅ |
| xwlazy 🥇 | heavy_load | 19.84 | 18.06x | 123.74 | 0.00 | ✅ |
| xwlazy 🥇 | enterprise_load | 42.96 | 39.09x | 123.93 | 0.00 | ✅ |

#### Detailed Results

##### xwlazy 🥇

**Test:** light_load 🥇

- Import Time: 1.51 ms
- Relative Time: 1.38x (vs baseline)
- Memory Peak: 123.74 MB
- Memory Avg: 123.74 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_install, dependency_discovery, performance_monitoring, keyword_detection, per_package_isolation, caching

**Test:** medium_load 🥇

- Import Time: 6.89 ms
- Relative Time: 6.27x (vs baseline)
- Memory Peak: 123.74 MB
- Memory Avg: 123.74 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_install, dependency_discovery, performance_monitoring, keyword_detection, per_package_isolation, caching

**Test:** heavy_load 🥇

- Import Time: 19.84 ms
- Relative Time: 18.06x (vs baseline)
- Memory Peak: 123.74 MB
- Memory Avg: 123.74 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_install, dependency_discovery, performance_monitoring, keyword_detection, per_package_isolation, caching

**Test:** enterprise_load 🥇

- Import Time: 42.96 ms
- Relative Time: 39.09x (vs baseline)
- Memory Peak: 123.93 MB
- Memory Avg: 123.83 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_install, dependency_discovery, performance_monitoring, keyword_detection, per_package_isolation, caching


### Lazy Import + Discovery

*Lazy import + dependency discovery*

#### Top 3 Rankings by Load Test

##### Enterprise Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 26.20 | 23.84x |

##### Heavy Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 9.61 | 8.75x |

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 0.66 | 0.60x |

##### Medium Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 3.55 | 3.23x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| xwlazy 🥇 | light_load | 0.66 | 0.60x | 109.34 | 0.00 | ✅ |
| xwlazy 🥇 | medium_load | 3.55 | 3.23x | 109.48 | 0.00 | ✅ |
| xwlazy 🥇 | heavy_load | 9.61 | 8.75x | 109.48 | 0.00 | ✅ |
| xwlazy 🥇 | enterprise_load | 26.20 | 23.84x | 110.50 | 0.00 | ✅ |

#### Detailed Results

##### xwlazy 🥇

**Test:** light_load 🥇

- Import Time: 0.66 ms
- Relative Time: 0.60x (vs baseline)
- Memory Peak: 109.34 MB
- Memory Avg: 109.34 MB
- Package Size: 0.00 MB
- Features: lazy_import, dependency_discovery, per_package_isolation, caching

**Test:** medium_load 🥇

- Import Time: 3.55 ms
- Relative Time: 3.23x (vs baseline)
- Memory Peak: 109.48 MB
- Memory Avg: 109.41 MB
- Package Size: 0.00 MB
- Features: lazy_import, dependency_discovery, per_package_isolation, caching

**Test:** heavy_load 🥇

- Import Time: 9.61 ms
- Relative Time: 8.75x (vs baseline)
- Memory Peak: 109.48 MB
- Memory Avg: 109.48 MB
- Package Size: 0.00 MB
- Features: lazy_import, dependency_discovery, per_package_isolation, caching

**Test:** enterprise_load 🥇

- Import Time: 26.20 ms
- Relative Time: 23.84x (vs baseline)
- Memory Peak: 110.50 MB
- Memory Avg: 109.99 MB
- Package Size: 0.00 MB
- Features: lazy_import, dependency_discovery, per_package_isolation, caching


### Lazy Import + Install

*Lazy import + auto-install*

#### Top 3 Rankings by Load Test

##### Enterprise Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 25.44 | 23.15x |

##### Heavy Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 10.10 | 9.19x |

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 0.48 | 0.44x |

##### Medium Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 4.22 | 3.84x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| xwlazy 🥇 | light_load | 0.48 | 0.44x | 103.38 | 0.00 | ✅ |
| xwlazy 🥇 | medium_load | 4.22 | 3.84x | 103.38 | 0.00 | ✅ |
| xwlazy 🥇 | heavy_load | 10.10 | 9.19x | 103.38 | 0.00 | ✅ |
| xwlazy 🥇 | enterprise_load | 25.44 | 23.15x | 104.71 | 0.00 | ✅ |

#### Detailed Results

##### xwlazy 🥇

**Test:** light_load 🥇

- Import Time: 0.48 ms
- Relative Time: 0.44x (vs baseline)
- Memory Peak: 103.38 MB
- Memory Avg: 103.38 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_install, per_package_isolation, caching

**Test:** medium_load 🥇

- Import Time: 4.22 ms
- Relative Time: 3.84x (vs baseline)
- Memory Peak: 103.38 MB
- Memory Avg: 103.38 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_install, per_package_isolation, caching

**Test:** heavy_load 🥇

- Import Time: 10.10 ms
- Relative Time: 9.19x (vs baseline)
- Memory Peak: 103.38 MB
- Memory Avg: 103.38 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_install, per_package_isolation, caching

**Test:** enterprise_load 🥇

- Import Time: 25.44 ms
- Relative Time: 23.15x (vs baseline)
- Memory Peak: 104.71 MB
- Memory Avg: 104.05 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_install, per_package_isolation, caching


### Lazy Import + Monitoring

*Lazy import + performance monitoring*

#### Top 3 Rankings by Load Test

##### Enterprise Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 24.68 | 22.46x |

##### Heavy Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 9.60 | 8.74x |

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 0.49 | 0.45x |

##### Medium Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 3.24 | 2.95x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| xwlazy 🥇 | light_load | 0.49 | 0.45x | 115.05 | 0.00 | ✅ |
| xwlazy 🥇 | medium_load | 3.24 | 2.95x | 116.15 | 0.00 | ✅ |
| xwlazy 🥇 | heavy_load | 9.60 | 8.74x | 117.89 | 0.00 | ✅ |
| xwlazy 🥇 | enterprise_load | 24.68 | 22.46x | 123.43 | 0.00 | ✅ |

#### Detailed Results

##### xwlazy 🥇

**Test:** light_load 🥇

- Import Time: 0.49 ms
- Relative Time: 0.45x (vs baseline)
- Memory Peak: 115.05 MB
- Memory Avg: 115.05 MB
- Package Size: 0.00 MB
- Features: lazy_import, performance_monitoring, per_package_isolation, caching

**Test:** medium_load 🥇

- Import Time: 3.24 ms
- Relative Time: 2.95x (vs baseline)
- Memory Peak: 116.15 MB
- Memory Avg: 115.60 MB
- Package Size: 0.00 MB
- Features: lazy_import, performance_monitoring, per_package_isolation, caching

**Test:** heavy_load 🥇

- Import Time: 9.60 ms
- Relative Time: 8.74x (vs baseline)
- Memory Peak: 117.89 MB
- Memory Avg: 117.02 MB
- Package Size: 0.00 MB
- Features: lazy_import, performance_monitoring, per_package_isolation, caching

**Test:** enterprise_load 🥇

- Import Time: 24.68 ms
- Relative Time: 22.46x (vs baseline)
- Memory Peak: 123.43 MB
- Memory Avg: 120.66 MB
- Package Size: 0.00 MB
- Features: lazy_import, performance_monitoring, per_package_isolation, caching


### Basic Lazy Import

*Basic lazy import (fair comparison - all libraries)*

#### Top 3 Rankings by Load Test

##### Enterprise Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazy-loader | 22.69 | 20.65x |
| 2 🥈 | pylazyimports | 24.61 | 22.40x |
| 3 🥉 | xwlazy | 25.51 | 23.21x |

##### Heavy Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazy-loader | 8.12 | 7.38x |
| 2 🥈 | pylazyimports | 9.25 | 8.42x |
| 3 🥉 | xwlazy | 9.36 | 8.52x |

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | pylazyimports | 0.47 | 0.42x |
| 2 🥈 | lazy-loader | 0.49 | 0.45x |
| 3 🥉 | xwlazy | 0.53 | 0.48x |

##### Medium Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazy-loader | 2.60 | 2.37x |
| 2 🥈 | xwlazy | 2.83 | 2.58x |
| 3 🥉 | pylazyimports | 2.95 | 2.69x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| deferred-import | light_load | 1.68 | 1.53x | 29.45 | 0.00 | ✅ |
| deferred-import | medium_load | 7.66 | 6.97x | 30.72 | 0.00 | ✅ |
| deferred-import | heavy_load | 28.23 | 25.69x | 34.19 | 0.00 | ✅ |
| deferred-import | enterprise_load | 110.29 | 100.37x | 44.10 | 0.00 | ✅ |
| lazi | light_load | 0.55 | 0.50x | 88.40 | 0.00 | ✅ |
| lazi | medium_load | 3.31 | 3.01x | 89.17 | 0.00 | ✅ |
| lazi | heavy_load | 9.59 | 8.73x | 91.02 | 0.00 | ✅ |
| lazi | enterprise_load | 25.94 | 23.61x | 98.42 | 0.00 | ✅ |
| lazy-imports | light_load | 0.57 | 0.52x | 66.71 | 0.00 | ✅ |
| lazy-imports | medium_load | 3.24 | 2.95x | 68.33 | 0.00 | ✅ |
| lazy-imports | heavy_load | 9.64 | 8.78x | 70.03 | 0.00 | ✅ |
| lazy-imports | enterprise_load | 28.73 | 26.14x | 72.28 | 0.00 | ✅ |
| lazy-imports-lite | light_load | 1.24 | 1.13x | 98.70 | 0.00 | ✅ |
| lazy-imports-lite | medium_load | 3.84 | 3.49x | 98.70 | 0.00 | ✅ |
| lazy-imports-lite | heavy_load | 14.79 | 13.46x | 98.70 | 0.00 | ✅ |
| lazy-imports-lite | enterprise_load | 26.95 | 24.53x | 98.89 | 0.00 | ✅ |
| lazy-loader 🥈 | light_load | 0.49 | 0.45x | 53.09 | 0.00 | ✅ |
| lazy-loader 🥇 | medium_load | 2.60 | 2.37x | 54.64 | 0.00 | ✅ |
| lazy-loader 🥇 | heavy_load | 8.12 | 7.38x | 56.75 | 0.00 | ✅ |
| lazy-loader 🥇 | enterprise_load | 22.69 | 20.65x | 62.05 | 0.00 | ✅ |
| lazy_import | light_load | 0.70 | 0.64x | 72.31 | 0.00 | ✅ |
| lazy_import | medium_load | 3.35 | 3.05x | 72.44 | 0.00 | ✅ |
| lazy_import | heavy_load | 10.03 | 9.13x | 73.15 | 0.00 | ✅ |
| lazy_import | enterprise_load | 27.02 | 24.59x | 81.41 | 0.00 | ✅ |
| pipimport | light_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pipimport | medium_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pipimport | heavy_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pipimport | enterprise_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pylazyimports 🥇 | light_load | 0.47 | 0.42x | 84.60 | 0.00 | ✅ |
| pylazyimports 🥉 | medium_load | 2.95 | 2.69x | 84.60 | 0.00 | ✅ |
| pylazyimports 🥈 | heavy_load | 9.25 | 8.42x | 84.60 | 0.00 | ✅ |
| pylazyimports 🥈 | enterprise_load | 24.61 | 22.40x | 85.14 | 0.00 | ✅ |
| xwlazy 🥉 | light_load | 0.53 | 0.48x | 98.99 | 0.00 | ✅ |
| xwlazy 🥈 | medium_load | 2.83 | 2.58x | 99.75 | 0.00 | ✅ |
| xwlazy 🥉 | heavy_load | 9.36 | 8.52x | 101.19 | 0.00 | ✅ |
| xwlazy 🥉 | enterprise_load | 25.51 | 23.21x | 103.38 | 0.00 | ✅ |

#### Detailed Results

##### deferred-import

**Test:** light_load

- Import Time: 1.68 ms
- Relative Time: 1.53x (vs baseline)
- Memory Peak: 29.45 MB
- Memory Avg: 29.25 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** medium_load

- Import Time: 7.66 ms
- Relative Time: 6.97x (vs baseline)
- Memory Peak: 30.72 MB
- Memory Avg: 30.08 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** heavy_load

- Import Time: 28.23 ms
- Relative Time: 25.69x (vs baseline)
- Memory Peak: 34.19 MB
- Memory Avg: 32.46 MB
- Package Size: 0.00 MB
- Features: deferred_loading

**Test:** enterprise_load

- Import Time: 110.29 ms
- Relative Time: 100.37x (vs baseline)
- Memory Peak: 44.10 MB
- Memory Avg: 39.15 MB
- Package Size: 0.00 MB
- Features: deferred_loading

##### lazi

**Test:** light_load

- Import Time: 0.55 ms
- Relative Time: 0.50x (vs baseline)
- Memory Peak: 88.40 MB
- Memory Avg: 88.40 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** medium_load

- Import Time: 3.31 ms
- Relative Time: 3.01x (vs baseline)
- Memory Peak: 89.17 MB
- Memory Avg: 88.79 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** heavy_load

- Import Time: 9.59 ms
- Relative Time: 8.73x (vs baseline)
- Memory Peak: 91.02 MB
- Memory Avg: 90.12 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

**Test:** enterprise_load

- Import Time: 25.94 ms
- Relative Time: 23.61x (vs baseline)
- Memory Peak: 98.42 MB
- Memory Avg: 94.72 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

##### lazy-imports

**Test:** light_load

- Import Time: 0.57 ms
- Relative Time: 0.52x (vs baseline)
- Memory Peak: 66.71 MB
- Memory Avg: 66.68 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 3.24 ms
- Relative Time: 2.95x (vs baseline)
- Memory Peak: 68.33 MB
- Memory Avg: 67.62 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 9.64 ms
- Relative Time: 8.78x (vs baseline)
- Memory Peak: 70.03 MB
- Memory Avg: 69.24 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 28.73 ms
- Relative Time: 26.14x (vs baseline)
- Memory Peak: 72.28 MB
- Memory Avg: 71.16 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### lazy-imports-lite

**Test:** light_load

- Import Time: 1.24 ms
- Relative Time: 1.13x (vs baseline)
- Memory Peak: 98.70 MB
- Memory Avg: 98.70 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** medium_load

- Import Time: 3.84 ms
- Relative Time: 3.49x (vs baseline)
- Memory Peak: 98.70 MB
- Memory Avg: 98.70 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** heavy_load

- Import Time: 14.79 ms
- Relative Time: 13.46x (vs baseline)
- Memory Peak: 98.70 MB
- Memory Avg: 98.70 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

**Test:** enterprise_load

- Import Time: 26.95 ms
- Relative Time: 24.53x (vs baseline)
- Memory Peak: 98.89 MB
- Memory Avg: 98.80 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

##### lazy-loader 🥇

**Test:** light_load 🥈

- Import Time: 0.49 ms
- Relative Time: 0.45x (vs baseline)
- Memory Peak: 53.09 MB
- Memory Avg: 53.08 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** medium_load 🥇

- Import Time: 2.60 ms
- Relative Time: 2.37x (vs baseline)
- Memory Peak: 54.64 MB
- Memory Avg: 53.88 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** heavy_load 🥇

- Import Time: 8.12 ms
- Relative Time: 7.38x (vs baseline)
- Memory Peak: 56.75 MB
- Memory Avg: 55.70 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

**Test:** enterprise_load 🥇

- Import Time: 22.69 ms
- Relative Time: 20.65x (vs baseline)
- Memory Peak: 62.05 MB
- Memory Avg: 59.42 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

##### lazy_import

**Test:** light_load

- Import Time: 0.70 ms
- Relative Time: 0.64x (vs baseline)
- Memory Peak: 72.31 MB
- Memory Avg: 72.31 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 3.35 ms
- Relative Time: 3.05x (vs baseline)
- Memory Peak: 72.44 MB
- Memory Avg: 72.38 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 10.03 ms
- Relative Time: 9.13x (vs baseline)
- Memory Peak: 73.15 MB
- Memory Avg: 72.79 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load

- Import Time: 27.02 ms
- Relative Time: 24.59x (vs baseline)
- Memory Peak: 81.41 MB
- Memory Avg: 77.28 MB
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

**Test:** light_load 🥇

- Import Time: 0.47 ms
- Relative Time: 0.42x (vs baseline)
- Memory Peak: 84.60 MB
- Memory Avg: 84.60 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load 🥉

- Import Time: 2.95 ms
- Relative Time: 2.69x (vs baseline)
- Memory Peak: 84.60 MB
- Memory Avg: 84.60 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load 🥈

- Import Time: 9.25 ms
- Relative Time: 8.42x (vs baseline)
- Memory Peak: 84.60 MB
- Memory Avg: 84.60 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** enterprise_load 🥈

- Import Time: 24.61 ms
- Relative Time: 22.40x (vs baseline)
- Memory Peak: 85.14 MB
- Memory Avg: 84.87 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### xwlazy 🥈

**Test:** light_load 🥉

- Import Time: 0.53 ms
- Relative Time: 0.48x (vs baseline)
- Memory Peak: 98.99 MB
- Memory Avg: 98.99 MB
- Package Size: 0.00 MB
- Features: lazy_import, per_package_isolation, caching

**Test:** medium_load 🥈

- Import Time: 2.83 ms
- Relative Time: 2.58x (vs baseline)
- Memory Peak: 99.75 MB
- Memory Avg: 99.37 MB
- Package Size: 0.00 MB
- Features: lazy_import, per_package_isolation, caching

**Test:** heavy_load 🥉

- Import Time: 9.36 ms
- Relative Time: 8.52x (vs baseline)
- Memory Peak: 101.19 MB
- Memory Avg: 100.47 MB
- Package Size: 0.00 MB
- Features: lazy_import, per_package_isolation, caching

**Test:** enterprise_load 🥉

- Import Time: 25.51 ms
- Relative Time: 23.21x (vs baseline)
- Memory Peak: 103.38 MB
- Memory Avg: 102.28 MB
- Package Size: 0.00 MB
- Features: lazy_import, per_package_isolation, caching


## Stress Tests

### Full Features

*All features enabled (xwlazy showcase)*

#### Top 3 Rankings by Load Test

##### Circular Imports

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 4.71 | 4.28x |

##### Concurrent Imports

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 23.83 | 21.69x |

##### Deep Dependency Chains

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 24.72 | 22.50x |

##### Mixed Import Patterns

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 0.74 | 0.67x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| xwlazy 🥇 | concurrent_imports | 23.83 | 21.69x | 123.94 | 0.00 | ✅ |
| xwlazy | rapid_sequential_imports | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| xwlazy 🥇 | circular_imports | 4.71 | 4.28x | 124.71 | 0.00 | ✅ |
| xwlazy 🥇 | deep_dependency_chains | 24.72 | 22.50x | 124.72 | 0.00 | ✅ |
| xwlazy | repeated_imports | 0.00 | 0.00x | 124.72 | 0.00 | ❌ |
| xwlazy | memory_pressure | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| xwlazy 🥇 | mixed_import_patterns | 0.74 | 0.67x | 126.16 | 0.00 | ✅ |

#### Detailed Results

##### xwlazy 🥇

**Test:** concurrent_imports 🥇

- Import Time: 23.83 ms
- Relative Time: 21.69x (vs baseline)
- Memory Peak: 123.94 MB
- Memory Avg: 123.93 MB
- Package Size: 0.00 MB

**Test:** rapid_sequential_imports

- ❌ Error: name 'base_events' is not defined

**Test:** circular_imports 🥇

- Import Time: 4.71 ms
- Relative Time: 4.28x (vs baseline)
- Memory Peak: 124.71 MB
- Memory Avg: 124.71 MB
- Package Size: 0.00 MB

**Test:** deep_dependency_chains 🥇

- Import Time: 24.72 ms
- Relative Time: 22.50x (vs baseline)
- Memory Peak: 124.72 MB
- Memory Avg: 124.72 MB
- Package Size: 0.00 MB

**Test:** repeated_imports

- ❌ Error: Consistency: 105.58%

**Test:** memory_pressure

- ❌ Error: name 'base_events' is not defined

**Test:** mixed_import_patterns 🥇

- Import Time: 0.74 ms
- Relative Time: 0.67x (vs baseline)
- Memory Peak: 126.16 MB
- Memory Avg: 126.13 MB
- Package Size: 0.00 MB


### Lazy Import + Discovery

*Lazy import + dependency discovery*

#### Top 3 Rankings by Load Test

##### Circular Imports

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 3.92 | 3.57x |

##### Concurrent Imports

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 8.98 | 8.17x |

##### Deep Dependency Chains

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 11.18 | 10.17x |

##### Mixed Import Patterns

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 0.43 | 0.39x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| xwlazy 🥇 | concurrent_imports | 8.98 | 8.17x | 110.89 | 0.00 | ✅ |
| xwlazy | rapid_sequential_imports | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| xwlazy 🥇 | circular_imports | 3.92 | 3.57x | 112.89 | 0.00 | ✅ |
| xwlazy 🥇 | deep_dependency_chains | 11.18 | 10.17x | 112.94 | 0.00 | ✅ |
| xwlazy | repeated_imports | 0.00 | 0.00x | 112.95 | 0.00 | ❌ |
| xwlazy | memory_pressure | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| xwlazy 🥇 | mixed_import_patterns | 0.43 | 0.39x | 114.57 | 0.00 | ✅ |

#### Detailed Results

##### xwlazy 🥇

**Test:** concurrent_imports 🥇

- Import Time: 8.98 ms
- Relative Time: 8.17x (vs baseline)
- Memory Peak: 110.89 MB
- Memory Avg: 110.71 MB
- Package Size: 0.00 MB

**Test:** rapid_sequential_imports

- ❌ Error: name 'base_events' is not defined

**Test:** circular_imports 🥇

- Import Time: 3.92 ms
- Relative Time: 3.57x (vs baseline)
- Memory Peak: 112.89 MB
- Memory Avg: 112.89 MB
- Package Size: 0.00 MB

**Test:** deep_dependency_chains 🥇

- Import Time: 11.18 ms
- Relative Time: 10.17x (vs baseline)
- Memory Peak: 112.94 MB
- Memory Avg: 112.94 MB
- Package Size: 0.00 MB

**Test:** repeated_imports

- ❌ Error: Consistency: 70.67%

**Test:** memory_pressure

- ❌ Error: name 'base_events' is not defined

**Test:** mixed_import_patterns 🥇

- Import Time: 0.43 ms
- Relative Time: 0.39x (vs baseline)
- Memory Peak: 114.57 MB
- Memory Avg: 114.57 MB
- Package Size: 0.00 MB


### Lazy Import + Install

*Lazy import + auto-install*

#### Top 3 Rankings by Load Test

##### Circular Imports

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 2.72 | 2.48x |

##### Concurrent Imports

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 9.44 | 8.59x |

##### Deep Dependency Chains

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 11.19 | 10.19x |

##### Mixed Import Patterns

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 0.36 | 0.33x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| xwlazy 🥇 | concurrent_imports | 9.44 | 8.59x | 105.15 | 0.00 | ✅ |
| xwlazy | rapid_sequential_imports | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| xwlazy 🥇 | circular_imports | 2.72 | 2.48x | 107.04 | 0.00 | ✅ |
| xwlazy 🥇 | deep_dependency_chains | 11.19 | 10.19x | 107.05 | 0.00 | ✅ |
| xwlazy | repeated_imports | 0.00 | 0.00x | 107.06 | 0.00 | ❌ |
| xwlazy | memory_pressure | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| xwlazy 🥇 | mixed_import_patterns | 0.36 | 0.33x | 109.19 | 0.00 | ✅ |

#### Detailed Results

##### xwlazy 🥇

**Test:** concurrent_imports 🥇

- Import Time: 9.44 ms
- Relative Time: 8.59x (vs baseline)
- Memory Peak: 105.15 MB
- Memory Avg: 104.94 MB
- Package Size: 0.00 MB

**Test:** rapid_sequential_imports

- ❌ Error: name 'base_events' is not defined

**Test:** circular_imports 🥇

- Import Time: 2.72 ms
- Relative Time: 2.48x (vs baseline)
- Memory Peak: 107.04 MB
- Memory Avg: 107.04 MB
- Package Size: 0.00 MB

**Test:** deep_dependency_chains 🥇

- Import Time: 11.19 ms
- Relative Time: 10.19x (vs baseline)
- Memory Peak: 107.05 MB
- Memory Avg: 107.05 MB
- Package Size: 0.00 MB

**Test:** repeated_imports

- ❌ Error: Consistency: 67.52%

**Test:** memory_pressure

- ❌ Error: name 'base_events' is not defined

**Test:** mixed_import_patterns 🥇

- Import Time: 0.36 ms
- Relative Time: 0.33x (vs baseline)
- Memory Peak: 109.19 MB
- Memory Avg: 109.19 MB
- Package Size: 0.00 MB


### Lazy Import + Monitoring

*Lazy import + performance monitoring*

#### Top 3 Rankings by Load Test

##### Circular Imports

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 3.50 | 3.19x |

##### Concurrent Imports

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 22.47 | 20.45x |

##### Deep Dependency Chains

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 13.91 | 12.66x |

##### Mixed Import Patterns

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 0.69 | 0.62x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| xwlazy 🥇 | concurrent_imports | 22.47 | 20.45x | 123.64 | 0.00 | ✅ |
| xwlazy | rapid_sequential_imports | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| xwlazy 🥇 | circular_imports | 3.50 | 3.19x | 123.74 | 0.00 | ✅ |
| xwlazy 🥇 | deep_dependency_chains | 13.91 | 12.66x | 123.74 | 0.00 | ✅ |
| xwlazy | repeated_imports | 0.00 | 0.00x | 123.74 | 0.00 | ❌ |
| xwlazy | memory_pressure | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| xwlazy 🥇 | mixed_import_patterns | 0.69 | 0.62x | 123.74 | 0.00 | ✅ |

#### Detailed Results

##### xwlazy 🥇

**Test:** concurrent_imports 🥇

- Import Time: 22.47 ms
- Relative Time: 20.45x (vs baseline)
- Memory Peak: 123.64 MB
- Memory Avg: 123.54 MB
- Package Size: 0.00 MB

**Test:** rapid_sequential_imports

- ❌ Error: name 'base_events' is not defined

**Test:** circular_imports 🥇

- Import Time: 3.50 ms
- Relative Time: 3.19x (vs baseline)
- Memory Peak: 123.74 MB
- Memory Avg: 123.74 MB
- Package Size: 0.00 MB

**Test:** deep_dependency_chains 🥇

- Import Time: 13.91 ms
- Relative Time: 12.66x (vs baseline)
- Memory Peak: 123.74 MB
- Memory Avg: 123.74 MB
- Package Size: 0.00 MB

**Test:** repeated_imports

- ❌ Error: Consistency: 78.20%

**Test:** memory_pressure

- ❌ Error: name 'base_events' is not defined

**Test:** mixed_import_patterns 🥇

- Import Time: 0.69 ms
- Relative Time: 0.62x (vs baseline)
- Memory Peak: 123.74 MB
- Memory Avg: 123.74 MB
- Package Size: 0.00 MB


### Basic Lazy Import

*Basic lazy import (fair comparison - all libraries)*

#### Top 3 Rankings by Load Test

##### Circular Imports

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazy-loader | 2.24 | 2.04x |
| 2 🥈 | xwlazy | 2.42 | 2.21x |
| 3 🥉 | deferred-import | 2.44 | 2.22x |

##### Concurrent Imports

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazy-loader | 8.08 | 7.36x |
| 2 🥈 | xwlazy | 9.26 | 8.43x |
| 3 🥉 | pylazyimports | 9.83 | 8.95x |

##### Deep Dependency Chains

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 9.49 | 8.63x |
| 2 🥈 | lazy-loader | 9.91 | 9.02x |
| 3 🥉 | lazy-imports-lite | 11.22 | 10.21x |

##### Mixed Import Patterns

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 0.33 | 0.30x |
| 2 🥈 | lazy-loader | 0.35 | 0.32x |
| 3 🥉 | deferred-import | 0.36 | 0.32x |

##### Repeated Imports

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazy-loader | 0.00 | 0.00x |
| 2 🥈 | lazy-imports | 0.00 | 0.00x |
| 3 🥉 | lazy-imports-lite | 0.00 | 0.00x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| deferred-import | concurrent_imports | 32.93 | 29.96x | 44.54 | 0.00 | ✅ |
| deferred-import | rapid_sequential_imports | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| deferred-import 🥉 | circular_imports | 2.44 | 2.22x | 51.39 | 0.00 | ✅ |
| deferred-import | deep_dependency_chains | 15.76 | 14.35x | 51.42 | 0.00 | ✅ |
| deferred-import | repeated_imports | 0.00 | 0.00x | 51.43 | 0.00 | ❌ |
| deferred-import | memory_pressure | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| deferred-import 🥉 | mixed_import_patterns | 0.36 | 0.32x | 52.82 | 0.00 | ✅ |
| lazi | concurrent_imports | 19.45 | 17.70x | 98.43 | 0.00 | ✅ |
| lazi | rapid_sequential_imports | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| lazi | circular_imports | 4.88 | 4.44x | 98.68 | 0.00 | ✅ |
| lazi | deep_dependency_chains | 21.70 | 19.74x | 98.68 | 0.00 | ✅ |
| lazi | repeated_imports | 0.00 | 0.00x | 98.68 | 0.00 | ✅ |
| lazi | memory_pressure | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| lazi | mixed_import_patterns | 0.91 | 0.82x | 98.69 | 0.00 | ✅ |
| lazy-imports | concurrent_imports | 11.91 | 10.84x | 72.28 | 0.00 | ✅ |
| lazy-imports | rapid_sequential_imports | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| lazy-imports | circular_imports | 2.56 | 2.33x | 72.30 | 0.00 | ✅ |
| lazy-imports | deep_dependency_chains | 13.18 | 11.99x | 72.30 | 0.00 | ✅ |
| lazy-imports 🥈 | repeated_imports | 0.00 | 0.00x | 72.30 | 0.00 | ✅ |
| lazy-imports | memory_pressure | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| lazy-imports | mixed_import_patterns | 0.39 | 0.35x | 72.31 | 0.00 | ✅ |
| lazy-imports-lite | concurrent_imports | 11.84 | 10.77x | 98.90 | 0.00 | ✅ |
| lazy-imports-lite | rapid_sequential_imports | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| lazy-imports-lite | circular_imports | 2.74 | 2.49x | 98.91 | 0.00 | ✅ |
| lazy-imports-lite 🥉 | deep_dependency_chains | 11.22 | 10.21x | 98.91 | 0.00 | ✅ |
| lazy-imports-lite 🥉 | repeated_imports | 0.00 | 0.00x | 98.91 | 0.00 | ✅ |
| lazy-imports-lite | memory_pressure | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| lazy-imports-lite | mixed_import_patterns | 0.42 | 0.38x | 98.98 | 0.00 | ✅ |
| lazy-loader 🥇 | concurrent_imports | 8.08 | 7.36x | 62.57 | 0.00 | ✅ |
| lazy-loader | rapid_sequential_imports | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| lazy-loader 🥇 | circular_imports | 2.24 | 2.04x | 64.29 | 0.00 | ✅ |
| lazy-loader 🥈 | deep_dependency_chains | 9.91 | 9.02x | 64.33 | 0.00 | ✅ |
| lazy-loader 🥇 | repeated_imports | 0.00 | 0.00x | 64.34 | 0.00 | ✅ |
| lazy-loader | memory_pressure | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| lazy-loader 🥈 | mixed_import_patterns | 0.35 | 0.32x | 66.42 | 0.00 | ✅ |
| lazy_import | concurrent_imports | 10.98 | 9.99x | 81.82 | 0.00 | ✅ |
| lazy_import | rapid_sequential_imports | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| lazy_import | circular_imports | 2.92 | 2.66x | 83.63 | 0.00 | ✅ |
| lazy_import | deep_dependency_chains | 12.42 | 11.30x | 83.67 | 0.00 | ✅ |
| lazy_import | repeated_imports | 0.00 | 0.00x | 83.70 | 0.00 | ❌ |
| lazy_import | memory_pressure | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| lazy_import | mixed_import_patterns | 0.46 | 0.42x | 84.36 | 0.00 | ✅ |
| pipimport | concurrent_imports | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pipimport | rapid_sequential_imports | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pipimport | circular_imports | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pipimport | deep_dependency_chains | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pipimport | repeated_imports | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pipimport | memory_pressure | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pipimport | mixed_import_patterns | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pylazyimports 🥉 | concurrent_imports | 9.83 | 8.95x | 85.23 | 0.00 | ✅ |
| pylazyimports | rapid_sequential_imports | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pylazyimports | circular_imports | 2.59 | 2.36x | 86.43 | 0.00 | ✅ |
| pylazyimports | deep_dependency_chains | 12.35 | 11.23x | 86.46 | 0.00 | ✅ |
| pylazyimports | repeated_imports | 0.00 | 0.00x | 86.47 | 0.00 | ✅ |
| pylazyimports | memory_pressure | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pylazyimports | mixed_import_patterns | 0.54 | 0.49x | 88.11 | 0.00 | ✅ |
| xwlazy 🥈 | concurrent_imports | 9.26 | 8.43x | 103.38 | 0.00 | ✅ |
| xwlazy | rapid_sequential_imports | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| xwlazy 🥈 | circular_imports | 2.42 | 2.21x | 103.38 | 0.00 | ✅ |
| xwlazy 🥇 | deep_dependency_chains | 9.49 | 8.63x | 103.38 | 0.00 | ✅ |
| xwlazy | repeated_imports | 0.00 | 0.00x | 103.38 | 0.00 | ❌ |
| xwlazy | memory_pressure | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| xwlazy 🥇 | mixed_import_patterns | 0.33 | 0.30x | 103.38 | 0.00 | ✅ |

#### Detailed Results

##### deferred-import 🥉

**Test:** concurrent_imports

- Import Time: 32.93 ms
- Relative Time: 29.96x (vs baseline)
- Memory Peak: 44.54 MB
- Memory Avg: 44.33 MB
- Package Size: 0.00 MB

**Test:** rapid_sequential_imports

- ❌ Error: name 'base_events' is not defined

**Test:** circular_imports 🥉

- Import Time: 2.44 ms
- Relative Time: 2.22x (vs baseline)
- Memory Peak: 51.39 MB
- Memory Avg: 51.38 MB
- Package Size: 0.00 MB

**Test:** deep_dependency_chains

- Import Time: 15.76 ms
- Relative Time: 14.35x (vs baseline)
- Memory Peak: 51.42 MB
- Memory Avg: 51.41 MB
- Package Size: 0.00 MB

**Test:** repeated_imports

- ❌ Error: Consistency: 55.54%

**Test:** memory_pressure

- ❌ Error: name 'base_events' is not defined

**Test:** mixed_import_patterns 🥉

- Import Time: 0.36 ms
- Relative Time: 0.32x (vs baseline)
- Memory Peak: 52.82 MB
- Memory Avg: 52.82 MB
- Package Size: 0.00 MB

##### lazi

**Test:** concurrent_imports

- Import Time: 19.45 ms
- Relative Time: 17.70x (vs baseline)
- Memory Peak: 98.43 MB
- Memory Avg: 98.42 MB
- Package Size: 0.00 MB

**Test:** rapid_sequential_imports

- ❌ Error: name 'base_events' is not defined

**Test:** circular_imports

- Import Time: 4.88 ms
- Relative Time: 4.44x (vs baseline)
- Memory Peak: 98.68 MB
- Memory Avg: 98.68 MB
- Package Size: 0.00 MB

**Test:** deep_dependency_chains

- Import Time: 21.70 ms
- Relative Time: 19.74x (vs baseline)
- Memory Peak: 98.68 MB
- Memory Avg: 98.68 MB
- Package Size: 0.00 MB

**Test:** repeated_imports

- Import Time: 0.00 ms
- Relative Time: 0.00x (vs baseline)
- Memory Peak: 98.68 MB
- Memory Avg: 98.68 MB
- Package Size: 0.00 MB

**Test:** memory_pressure

- ❌ Error: name 'base_events' is not defined

**Test:** mixed_import_patterns

- Import Time: 0.91 ms
- Relative Time: 0.82x (vs baseline)
- Memory Peak: 98.69 MB
- Memory Avg: 98.68 MB
- Package Size: 0.00 MB

##### lazy-imports 🥈

**Test:** concurrent_imports

- Import Time: 11.91 ms
- Relative Time: 10.84x (vs baseline)
- Memory Peak: 72.28 MB
- Memory Avg: 72.28 MB
- Package Size: 0.00 MB

**Test:** rapid_sequential_imports

- ❌ Error: name 'base_events' is not defined

**Test:** circular_imports

- Import Time: 2.56 ms
- Relative Time: 2.33x (vs baseline)
- Memory Peak: 72.30 MB
- Memory Avg: 72.30 MB
- Package Size: 0.00 MB

**Test:** deep_dependency_chains

- Import Time: 13.18 ms
- Relative Time: 11.99x (vs baseline)
- Memory Peak: 72.30 MB
- Memory Avg: 72.30 MB
- Package Size: 0.00 MB

**Test:** repeated_imports 🥈

- Import Time: 0.00 ms
- Relative Time: 0.00x (vs baseline)
- Memory Peak: 72.30 MB
- Memory Avg: 72.30 MB
- Package Size: 0.00 MB

**Test:** memory_pressure

- ❌ Error: name 'base_events' is not defined

**Test:** mixed_import_patterns

- Import Time: 0.39 ms
- Relative Time: 0.35x (vs baseline)
- Memory Peak: 72.31 MB
- Memory Avg: 72.31 MB
- Package Size: 0.00 MB

##### lazy-imports-lite 🥉

**Test:** concurrent_imports

- Import Time: 11.84 ms
- Relative Time: 10.77x (vs baseline)
- Memory Peak: 98.90 MB
- Memory Avg: 98.90 MB
- Package Size: 0.00 MB

**Test:** rapid_sequential_imports

- ❌ Error: name 'base_events' is not defined

**Test:** circular_imports

- Import Time: 2.74 ms
- Relative Time: 2.49x (vs baseline)
- Memory Peak: 98.91 MB
- Memory Avg: 98.91 MB
- Package Size: 0.00 MB

**Test:** deep_dependency_chains 🥉

- Import Time: 11.22 ms
- Relative Time: 10.21x (vs baseline)
- Memory Peak: 98.91 MB
- Memory Avg: 98.91 MB
- Package Size: 0.00 MB

**Test:** repeated_imports 🥉

- Import Time: 0.00 ms
- Relative Time: 0.00x (vs baseline)
- Memory Peak: 98.91 MB
- Memory Avg: 98.91 MB
- Package Size: 0.00 MB

**Test:** memory_pressure

- ❌ Error: name 'base_events' is not defined

**Test:** mixed_import_patterns

- Import Time: 0.42 ms
- Relative Time: 0.38x (vs baseline)
- Memory Peak: 98.98 MB
- Memory Avg: 98.98 MB
- Package Size: 0.00 MB

##### lazy-loader 🥇

**Test:** concurrent_imports 🥇

- Import Time: 8.08 ms
- Relative Time: 7.36x (vs baseline)
- Memory Peak: 62.57 MB
- Memory Avg: 62.31 MB
- Package Size: 0.00 MB

**Test:** rapid_sequential_imports

- ❌ Error: name 'base_events' is not defined

**Test:** circular_imports 🥇

- Import Time: 2.24 ms
- Relative Time: 2.04x (vs baseline)
- Memory Peak: 64.29 MB
- Memory Avg: 64.29 MB
- Package Size: 0.00 MB

**Test:** deep_dependency_chains 🥈

- Import Time: 9.91 ms
- Relative Time: 9.02x (vs baseline)
- Memory Peak: 64.33 MB
- Memory Avg: 64.32 MB
- Package Size: 0.00 MB

**Test:** repeated_imports 🥇

- Import Time: 0.00 ms
- Relative Time: 0.00x (vs baseline)
- Memory Peak: 64.34 MB
- Memory Avg: 64.34 MB
- Package Size: 0.00 MB

**Test:** memory_pressure

- ❌ Error: name 'base_events' is not defined

**Test:** mixed_import_patterns 🥈

- Import Time: 0.35 ms
- Relative Time: 0.32x (vs baseline)
- Memory Peak: 66.42 MB
- Memory Avg: 66.42 MB
- Package Size: 0.00 MB

##### lazy_import

**Test:** concurrent_imports

- Import Time: 10.98 ms
- Relative Time: 9.99x (vs baseline)
- Memory Peak: 81.82 MB
- Memory Avg: 81.63 MB
- Package Size: 0.00 MB

**Test:** rapid_sequential_imports

- ❌ Error: name 'base_events' is not defined

**Test:** circular_imports

- Import Time: 2.92 ms
- Relative Time: 2.66x (vs baseline)
- Memory Peak: 83.63 MB
- Memory Avg: 83.63 MB
- Package Size: 0.00 MB

**Test:** deep_dependency_chains

- Import Time: 12.42 ms
- Relative Time: 11.30x (vs baseline)
- Memory Peak: 83.67 MB
- Memory Avg: 83.66 MB
- Package Size: 0.00 MB

**Test:** repeated_imports

- ❌ Error: Consistency: 52.42%

**Test:** memory_pressure

- ❌ Error: name 'base_events' is not defined

**Test:** mixed_import_patterns

- Import Time: 0.46 ms
- Relative Time: 0.42x (vs baseline)
- Memory Peak: 84.36 MB
- Memory Avg: 84.36 MB
- Package Size: 0.00 MB

##### pipimport

**Test:** concurrent_imports

- ❌ Error: Missing parentheses in call to 'print'. Did you mean print(...)? (__init__.py, line 77)

**Test:** rapid_sequential_imports

- ❌ Error: Missing parentheses in call to 'print'. Did you mean print(...)? (__init__.py, line 77)

**Test:** circular_imports

- ❌ Error: Missing parentheses in call to 'print'. Did you mean print(...)? (__init__.py, line 77)

**Test:** deep_dependency_chains

- ❌ Error: Missing parentheses in call to 'print'. Did you mean print(...)? (__init__.py, line 77)

**Test:** repeated_imports

- ❌ Error: Missing parentheses in call to 'print'. Did you mean print(...)? (__init__.py, line 77)

**Test:** memory_pressure

- ❌ Error: Missing parentheses in call to 'print'. Did you mean print(...)? (__init__.py, line 77)

**Test:** mixed_import_patterns

- ❌ Error: Missing parentheses in call to 'print'. Did you mean print(...)? (__init__.py, line 77)

##### pylazyimports 🥉

**Test:** concurrent_imports 🥉

- Import Time: 9.83 ms
- Relative Time: 8.95x (vs baseline)
- Memory Peak: 85.23 MB
- Memory Avg: 85.18 MB
- Package Size: 0.00 MB

**Test:** rapid_sequential_imports

- ❌ Error: name 'base_events' is not defined

**Test:** circular_imports

- Import Time: 2.59 ms
- Relative Time: 2.36x (vs baseline)
- Memory Peak: 86.43 MB
- Memory Avg: 86.43 MB
- Package Size: 0.00 MB

**Test:** deep_dependency_chains

- Import Time: 12.35 ms
- Relative Time: 11.23x (vs baseline)
- Memory Peak: 86.46 MB
- Memory Avg: 86.46 MB
- Package Size: 0.00 MB

**Test:** repeated_imports

- Import Time: 0.00 ms
- Relative Time: 0.00x (vs baseline)
- Memory Peak: 86.47 MB
- Memory Avg: 86.47 MB
- Package Size: 0.00 MB

**Test:** memory_pressure

- ❌ Error: name 'base_events' is not defined

**Test:** mixed_import_patterns

- Import Time: 0.54 ms
- Relative Time: 0.49x (vs baseline)
- Memory Peak: 88.11 MB
- Memory Avg: 88.08 MB
- Package Size: 0.00 MB

##### xwlazy 🥇

**Test:** concurrent_imports 🥈

- Import Time: 9.26 ms
- Relative Time: 8.43x (vs baseline)
- Memory Peak: 103.38 MB
- Memory Avg: 103.38 MB
- Package Size: 0.00 MB

**Test:** rapid_sequential_imports

- ❌ Error: name 'base_events' is not defined

**Test:** circular_imports 🥈

- Import Time: 2.42 ms
- Relative Time: 2.21x (vs baseline)
- Memory Peak: 103.38 MB
- Memory Avg: 103.38 MB
- Package Size: 0.00 MB

**Test:** deep_dependency_chains 🥇

- Import Time: 9.49 ms
- Relative Time: 8.63x (vs baseline)
- Memory Peak: 103.38 MB
- Memory Avg: 103.38 MB
- Package Size: 0.00 MB

**Test:** repeated_imports

- ❌ Error: Consistency: 62.82%

**Test:** memory_pressure

- ❌ Error: name 'base_events' is not defined

**Test:** mixed_import_patterns 🥇

- Import Time: 0.33 ms
- Relative Time: 0.30x (vs baseline)
- Memory Peak: 103.38 MB
- Memory Avg: 103.38 MB
- Package Size: 0.00 MB


## Edge Cases

### Full Features

*All features enabled (xwlazy showcase)*

#### Top 3 Rankings by Load Test

##### Already Loaded Modules

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 0.00 | 1.00x |

##### Hook Interference

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 1.38 | 1.26x |

##### Import Error Recovery

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 0.00 | 0.00x |

##### Import From String

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 0.01 | 0.01x |

##### Invalid Module Names

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 0.00 | 1.00x |

##### Missing Dependencies

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 0.00 | 1.00x |

##### Module Cleanup

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 0.87 | 0.79x |

##### Namespace Packages

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 0.00 | 0.00x |

##### Submodule Imports

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 4.06 | 1.00x |

##### Thread Safety

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 0.00 | 1.00x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| xwlazy 🥇 | missing_dependencies | 0.00 | 1.00x | 0.00 | 0.00 | ✅ |
| xwlazy 🥇 | invalid_module_names | 0.00 | 1.00x | 0.00 | 0.00 | ✅ |
| xwlazy 🥇 | already_loaded_modules | 0.00 | 1.00x | 0.00 | 0.00 | ✅ |
| xwlazy 🥇 | submodule_imports | 4.06 | 1.00x | 126.31 | 0.00 | ✅ |
| xwlazy 🥇 | hook_interference | 1.38 | 1.26x | 0.00 | 0.00 | ✅ |
| xwlazy 🥇 | module_cleanup | 0.87 | 0.79x | 0.00 | 0.00 | ✅ |
| xwlazy 🥇 | thread_safety | 0.00 | 1.00x | 0.00 | 0.00 | ✅ |
| xwlazy 🥇 | import_error_recovery | 0.00 | 0.00x | 0.00 | 0.00 | ✅ |
| xwlazy 🥇 | namespace_packages | 0.00 | 0.00x | 0.00 | 0.00 | ✅ |
| xwlazy 🥇 | import_from_string | 0.01 | 0.01x | 0.00 | 0.00 | ✅ |

#### Detailed Results

##### xwlazy 🥇

**Test:** missing_dependencies 🥇

- Import Time: 0.00 ms
- Relative Time: 1.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** invalid_module_names 🥇

- Import Time: 0.00 ms
- Relative Time: 1.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** already_loaded_modules 🥇

- Import Time: 0.00 ms
- Relative Time: 1.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** submodule_imports 🥇

- Import Time: 4.06 ms
- Relative Time: 1.00x (vs baseline)
- Memory Peak: 126.31 MB
- Memory Avg: 126.24 MB
- Package Size: 0.00 MB

**Test:** hook_interference 🥇

- Import Time: 1.38 ms
- Relative Time: 1.26x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** module_cleanup 🥇

- Import Time: 0.87 ms
- Relative Time: 0.79x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** thread_safety 🥇

- Import Time: 0.00 ms
- Relative Time: 1.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** import_error_recovery 🥇

- Import Time: 0.00 ms
- Relative Time: 0.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** namespace_packages 🥇

- Import Time: 0.00 ms
- Relative Time: 0.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** import_from_string 🥇

- Import Time: 0.01 ms
- Relative Time: 0.01x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB


### Lazy Import + Discovery

*Lazy import + dependency discovery*

#### Top 3 Rankings by Load Test

##### Already Loaded Modules

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 0.00 | 1.00x |

##### Hook Interference

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 0.32 | 0.30x |

##### Import Error Recovery

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 0.00 | 0.00x |

##### Import From String

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 0.00 | 0.00x |

##### Invalid Module Names

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 0.00 | 1.00x |

##### Missing Dependencies

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 0.00 | 1.00x |

##### Module Cleanup

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 0.30 | 0.27x |

##### Namespace Packages

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 0.00 | 0.00x |

##### Submodule Imports

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 2.05 | 1.00x |

##### Thread Safety

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 0.00 | 1.00x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| xwlazy 🥇 | missing_dependencies | 0.00 | 1.00x | 0.00 | 0.00 | ✅ |
| xwlazy 🥇 | invalid_module_names | 0.00 | 1.00x | 0.00 | 0.00 | ✅ |
| xwlazy 🥇 | already_loaded_modules | 0.00 | 1.00x | 0.00 | 0.00 | ✅ |
| xwlazy 🥇 | submodule_imports | 2.05 | 1.00x | 114.99 | 0.00 | ✅ |
| xwlazy 🥇 | hook_interference | 0.32 | 0.30x | 0.00 | 0.00 | ✅ |
| xwlazy 🥇 | module_cleanup | 0.30 | 0.27x | 0.00 | 0.00 | ✅ |
| xwlazy 🥇 | thread_safety | 0.00 | 1.00x | 0.00 | 0.00 | ✅ |
| xwlazy 🥇 | import_error_recovery | 0.00 | 0.00x | 0.00 | 0.00 | ✅ |
| xwlazy 🥇 | namespace_packages | 0.00 | 0.00x | 0.00 | 0.00 | ✅ |
| xwlazy 🥇 | import_from_string | 0.00 | 0.00x | 0.00 | 0.00 | ✅ |

#### Detailed Results

##### xwlazy 🥇

**Test:** missing_dependencies 🥇

- Import Time: 0.00 ms
- Relative Time: 1.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** invalid_module_names 🥇

- Import Time: 0.00 ms
- Relative Time: 1.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** already_loaded_modules 🥇

- Import Time: 0.00 ms
- Relative Time: 1.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** submodule_imports 🥇

- Import Time: 2.05 ms
- Relative Time: 1.00x (vs baseline)
- Memory Peak: 114.99 MB
- Memory Avg: 114.80 MB
- Package Size: 0.00 MB

**Test:** hook_interference 🥇

- Import Time: 0.32 ms
- Relative Time: 0.30x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** module_cleanup 🥇

- Import Time: 0.30 ms
- Relative Time: 0.27x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** thread_safety 🥇

- Import Time: 0.00 ms
- Relative Time: 1.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** import_error_recovery 🥇

- Import Time: 0.00 ms
- Relative Time: 0.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** namespace_packages 🥇

- Import Time: 0.00 ms
- Relative Time: 0.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** import_from_string 🥇

- Import Time: 0.00 ms
- Relative Time: 0.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB


### Lazy Import + Install

*Lazy import + auto-install*

#### Top 3 Rankings by Load Test

##### Already Loaded Modules

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 0.00 | 1.00x |

##### Hook Interference

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 0.40 | 0.36x |

##### Import Error Recovery

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 0.00 | 0.00x |

##### Import From String

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 0.00 | 0.00x |

##### Invalid Module Names

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 0.00 | 1.00x |

##### Missing Dependencies

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 0.00 | 1.00x |

##### Module Cleanup

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 0.48 | 0.44x |

##### Namespace Packages

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 0.00 | 0.00x |

##### Submodule Imports

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 1.51 | 1.00x |

##### Thread Safety

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 0.00 | 1.00x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| xwlazy 🥇 | missing_dependencies | 0.00 | 1.00x | 0.00 | 0.00 | ✅ |
| xwlazy 🥇 | invalid_module_names | 0.00 | 1.00x | 0.00 | 0.00 | ✅ |
| xwlazy 🥇 | already_loaded_modules | 0.00 | 1.00x | 0.00 | 0.00 | ✅ |
| xwlazy 🥇 | submodule_imports | 1.51 | 1.00x | 109.34 | 0.00 | ✅ |
| xwlazy 🥇 | hook_interference | 0.40 | 0.36x | 0.00 | 0.00 | ✅ |
| xwlazy 🥇 | module_cleanup | 0.48 | 0.44x | 0.00 | 0.00 | ✅ |
| xwlazy 🥇 | thread_safety | 0.00 | 1.00x | 0.00 | 0.00 | ✅ |
| xwlazy 🥇 | import_error_recovery | 0.00 | 0.00x | 0.00 | 0.00 | ✅ |
| xwlazy 🥇 | namespace_packages | 0.00 | 0.00x | 0.00 | 0.00 | ✅ |
| xwlazy 🥇 | import_from_string | 0.00 | 0.00x | 0.00 | 0.00 | ✅ |

#### Detailed Results

##### xwlazy 🥇

**Test:** missing_dependencies 🥇

- Import Time: 0.00 ms
- Relative Time: 1.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** invalid_module_names 🥇

- Import Time: 0.00 ms
- Relative Time: 1.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** already_loaded_modules 🥇

- Import Time: 0.00 ms
- Relative Time: 1.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** submodule_imports 🥇

- Import Time: 1.51 ms
- Relative Time: 1.00x (vs baseline)
- Memory Peak: 109.34 MB
- Memory Avg: 109.26 MB
- Package Size: 0.00 MB

**Test:** hook_interference 🥇

- Import Time: 0.40 ms
- Relative Time: 0.36x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** module_cleanup 🥇

- Import Time: 0.48 ms
- Relative Time: 0.44x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** thread_safety 🥇

- Import Time: 0.00 ms
- Relative Time: 1.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** import_error_recovery 🥇

- Import Time: 0.00 ms
- Relative Time: 0.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** namespace_packages 🥇

- Import Time: 0.00 ms
- Relative Time: 0.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** import_from_string 🥇

- Import Time: 0.00 ms
- Relative Time: 0.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB


### Lazy Import + Monitoring

*Lazy import + performance monitoring*

#### Top 3 Rankings by Load Test

##### Already Loaded Modules

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 0.00 | 1.00x |

##### Hook Interference

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 0.72 | 0.66x |

##### Import Error Recovery

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 0.00 | 0.00x |

##### Import From String

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 0.00 | 0.00x |

##### Invalid Module Names

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 0.00 | 1.00x |

##### Missing Dependencies

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 0.00 | 1.00x |

##### Module Cleanup

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 0.75 | 0.68x |

##### Namespace Packages

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 0.01 | 0.01x |

##### Submodule Imports

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 3.41 | 1.00x |

##### Thread Safety

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 0.00 | 1.00x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| xwlazy 🥇 | missing_dependencies | 0.00 | 1.00x | 0.00 | 0.00 | ✅ |
| xwlazy 🥇 | invalid_module_names | 0.00 | 1.00x | 0.00 | 0.00 | ✅ |
| xwlazy 🥇 | already_loaded_modules | 0.00 | 1.00x | 0.00 | 0.00 | ✅ |
| xwlazy 🥇 | submodule_imports | 3.41 | 1.00x | 123.74 | 0.00 | ✅ |
| xwlazy 🥇 | hook_interference | 0.72 | 0.66x | 0.00 | 0.00 | ✅ |
| xwlazy 🥇 | module_cleanup | 0.75 | 0.68x | 0.00 | 0.00 | ✅ |
| xwlazy 🥇 | thread_safety | 0.00 | 1.00x | 0.00 | 0.00 | ✅ |
| xwlazy 🥇 | import_error_recovery | 0.00 | 0.00x | 0.00 | 0.00 | ✅ |
| xwlazy 🥇 | namespace_packages | 0.01 | 0.01x | 0.00 | 0.00 | ✅ |
| xwlazy 🥇 | import_from_string | 0.00 | 0.00x | 0.00 | 0.00 | ✅ |

#### Detailed Results

##### xwlazy 🥇

**Test:** missing_dependencies 🥇

- Import Time: 0.00 ms
- Relative Time: 1.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** invalid_module_names 🥇

- Import Time: 0.00 ms
- Relative Time: 1.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** already_loaded_modules 🥇

- Import Time: 0.00 ms
- Relative Time: 1.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** submodule_imports 🥇

- Import Time: 3.41 ms
- Relative Time: 1.00x (vs baseline)
- Memory Peak: 123.74 MB
- Memory Avg: 123.74 MB
- Package Size: 0.00 MB

**Test:** hook_interference 🥇

- Import Time: 0.72 ms
- Relative Time: 0.66x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** module_cleanup 🥇

- Import Time: 0.75 ms
- Relative Time: 0.68x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** thread_safety 🥇

- Import Time: 0.00 ms
- Relative Time: 1.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** import_error_recovery 🥇

- Import Time: 0.00 ms
- Relative Time: 0.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** namespace_packages 🥇

- Import Time: 0.01 ms
- Relative Time: 0.01x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** import_from_string 🥇

- Import Time: 0.00 ms
- Relative Time: 0.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB


### Basic Lazy Import

*Basic lazy import (fair comparison - all libraries)*

#### Top 3 Rankings by Load Test

##### Already Loaded Modules

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazy_import | 0.00 | 1.00x |
| 2 🥈 | pylazyimports | 0.00 | 1.00x |
| 3 🥉 | lazy-imports-lite | 0.00 | 1.00x |

##### Hook Interference

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 0.27 | 0.25x |
| 2 🥈 | lazy_import | 0.28 | 0.25x |
| 3 🥉 | lazy-loader | 0.35 | 0.31x |

##### Import Error Recovery

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazy-imports-lite | 0.00 | 0.00x |
| 2 🥈 | lazy_import | 0.00 | 0.00x |
| 3 🥉 | xwlazy | 0.00 | 0.00x |

##### Import From String

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazy-imports-lite | 0.00 | 0.00x |
| 2 🥈 | lazy-loader | 0.00 | 0.00x |
| 3 🥉 | pylazyimports | 0.00 | 0.00x |

##### Invalid Module Names

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | deferred-import | 0.00 | 1.00x |
| 2 🥈 | lazy-loader | 0.00 | 1.00x |
| 3 🥉 | lazy-imports | 0.00 | 1.00x |

##### Missing Dependencies

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | deferred-import | 0.00 | 1.00x |
| 2 🥈 | lazy-loader | 0.00 | 1.00x |
| 3 🥉 | lazy-imports | 0.00 | 1.00x |

##### Module Cleanup

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 0.26 | 0.24x |
| 2 🥈 | lazy-imports-lite | 0.31 | 0.28x |
| 3 🥉 | lazy_import | 0.31 | 0.29x |

##### Namespace Packages

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | deferred-import | 0.00 | 0.00x |
| 2 🥈 | pylazyimports | 0.00 | 0.00x |
| 3 🥉 | lazy-loader | 0.00 | 0.00x |

##### Submodule Imports

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 1.25 | 1.00x |
| 2 🥈 | deferred-import | 1.32 | 1.00x |
| 3 🥉 | lazy_import | 1.57 | 1.00x |

##### Thread Safety

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | deferred-import | 0.00 | 1.00x |
| 2 🥈 | lazy-loader | 0.00 | 1.00x |
| 3 🥉 | lazy-imports | 0.00 | 1.00x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| deferred-import 🥇 | missing_dependencies | 0.00 | 1.00x | 0.00 | 0.00 | ✅ |
| deferred-import 🥇 | invalid_module_names | 0.00 | 1.00x | 0.00 | 0.00 | ✅ |
| deferred-import | already_loaded_modules | 0.00 | 1.00x | 0.00 | 0.00 | ✅ |
| deferred-import 🥈 | submodule_imports | 1.32 | 1.00x | 52.95 | 0.00 | ✅ |
| deferred-import | hook_interference | 0.37 | 0.33x | 0.00 | 0.00 | ✅ |
| deferred-import | module_cleanup | 0.40 | 0.36x | 0.00 | 0.00 | ✅ |
| deferred-import 🥇 | thread_safety | 0.00 | 1.00x | 0.00 | 0.00 | ✅ |
| deferred-import | import_error_recovery | 0.00 | 0.00x | 0.00 | 0.00 | ✅ |
| deferred-import 🥇 | namespace_packages | 0.00 | 0.00x | 0.00 | 0.00 | ✅ |
| deferred-import | import_from_string | 0.00 | 0.00x | 0.00 | 0.00 | ✅ |
| lazi | missing_dependencies | 0.00 | 1.00x | 0.00 | 0.00 | ✅ |
| lazi | invalid_module_names | 0.00 | 1.00x | 0.00 | 0.00 | ✅ |
| lazi | already_loaded_modules | 0.00 | 1.00x | 0.00 | 0.00 | ✅ |
| lazi | submodule_imports | 1.92 | 1.00x | 98.69 | 0.00 | ✅ |
| lazi | hook_interference | 0.61 | 0.55x | 0.00 | 0.00 | ✅ |
| lazi | module_cleanup | 0.44 | 0.40x | 0.00 | 0.00 | ✅ |
| lazi | thread_safety | 0.00 | 1.00x | 0.00 | 0.00 | ✅ |
| lazi | import_error_recovery | 0.00 | 0.00x | 0.00 | 0.00 | ✅ |
| lazi | namespace_packages | 0.00 | 0.00x | 0.00 | 0.00 | ✅ |
| lazi | import_from_string | 0.00 | 0.00x | 0.00 | 0.00 | ✅ |
| lazy-imports 🥉 | missing_dependencies | 0.00 | 1.00x | 0.00 | 0.00 | ✅ |
| lazy-imports 🥉 | invalid_module_names | 0.00 | 1.00x | 0.00 | 0.00 | ✅ |
| lazy-imports | already_loaded_modules | 0.00 | 1.00x | 0.00 | 0.00 | ✅ |
| lazy-imports | submodule_imports | 2.41 | 1.00x | 72.31 | 0.00 | ✅ |
| lazy-imports | hook_interference | 0.48 | 0.44x | 0.00 | 0.00 | ✅ |
| lazy-imports | module_cleanup | 0.38 | 0.35x | 0.00 | 0.00 | ✅ |
| lazy-imports 🥉 | thread_safety | 0.00 | 1.00x | 0.00 | 0.00 | ✅ |
| lazy-imports | import_error_recovery | 0.00 | 0.00x | 0.00 | 0.00 | ✅ |
| lazy-imports | namespace_packages | 0.00 | 0.00x | 0.00 | 0.00 | ✅ |
| lazy-imports | import_from_string | 0.00 | 0.00x | 0.00 | 0.00 | ✅ |
| lazy-imports-lite | missing_dependencies | 0.00 | 1.00x | 0.00 | 0.00 | ✅ |
| lazy-imports-lite | invalid_module_names | 0.00 | 1.00x | 0.00 | 0.00 | ✅ |
| lazy-imports-lite 🥉 | already_loaded_modules | 0.00 | 1.00x | 0.00 | 0.00 | ✅ |
| lazy-imports-lite | submodule_imports | 1.81 | 1.00x | 98.98 | 0.00 | ✅ |
| lazy-imports-lite | hook_interference | 0.38 | 0.35x | 0.00 | 0.00 | ✅ |
| lazy-imports-lite 🥈 | module_cleanup | 0.31 | 0.28x | 0.00 | 0.00 | ✅ |
| lazy-imports-lite | thread_safety | 0.00 | 1.00x | 0.00 | 0.00 | ✅ |
| lazy-imports-lite 🥇 | import_error_recovery | 0.00 | 0.00x | 0.00 | 0.00 | ✅ |
| lazy-imports-lite | namespace_packages | 0.00 | 0.00x | 0.00 | 0.00 | ✅ |
| lazy-imports-lite 🥇 | import_from_string | 0.00 | 0.00x | 0.00 | 0.00 | ✅ |
| lazy-loader 🥈 | missing_dependencies | 0.00 | 1.00x | 0.00 | 0.00 | ✅ |
| lazy-loader 🥈 | invalid_module_names | 0.00 | 1.00x | 0.00 | 0.00 | ✅ |
| lazy-loader | already_loaded_modules | 0.00 | 1.00x | 0.00 | 0.00 | ✅ |
| lazy-loader | submodule_imports | 2.03 | 1.00x | 66.54 | 0.00 | ✅ |
| lazy-loader 🥉 | hook_interference | 0.35 | 0.31x | 0.00 | 0.00 | ✅ |
| lazy-loader | module_cleanup | 0.44 | 0.40x | 0.00 | 0.00 | ✅ |
| lazy-loader 🥈 | thread_safety | 0.00 | 1.00x | 0.00 | 0.00 | ✅ |
| lazy-loader | import_error_recovery | 0.00 | 0.00x | 0.00 | 0.00 | ✅ |
| lazy-loader 🥉 | namespace_packages | 0.00 | 0.00x | 0.00 | 0.00 | ✅ |
| lazy-loader 🥈 | import_from_string | 0.00 | 0.00x | 0.00 | 0.00 | ✅ |
| lazy_import | missing_dependencies | 0.00 | 1.00x | 0.00 | 0.00 | ✅ |
| lazy_import | invalid_module_names | 0.00 | 1.00x | 0.00 | 0.00 | ✅ |
| lazy_import 🥇 | already_loaded_modules | 0.00 | 1.00x | 0.00 | 0.00 | ✅ |
| lazy_import 🥉 | submodule_imports | 1.57 | 1.00x | 84.52 | 0.00 | ✅ |
| lazy_import 🥈 | hook_interference | 0.28 | 0.25x | 0.00 | 0.00 | ✅ |
| lazy_import 🥉 | module_cleanup | 0.31 | 0.29x | 0.00 | 0.00 | ✅ |
| lazy_import | thread_safety | 0.00 | 1.00x | 0.00 | 0.00 | ✅ |
| lazy_import 🥈 | import_error_recovery | 0.00 | 0.00x | 0.00 | 0.00 | ✅ |
| lazy_import | namespace_packages | 0.00 | 0.00x | 0.00 | 0.00 | ✅ |
| lazy_import | import_from_string | 0.00 | 0.00x | 0.00 | 0.00 | ✅ |
| pipimport | missing_dependencies | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pipimport | invalid_module_names | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pipimport | already_loaded_modules | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pipimport | submodule_imports | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pipimport | hook_interference | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pipimport | module_cleanup | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pipimport | thread_safety | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pipimport | import_error_recovery | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pipimport | namespace_packages | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pipimport | import_from_string | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pylazyimports | missing_dependencies | 0.00 | 1.00x | 0.00 | 0.00 | ✅ |
| pylazyimports | invalid_module_names | 0.00 | 1.00x | 0.00 | 0.00 | ✅ |
| pylazyimports 🥈 | already_loaded_modules | 0.00 | 1.00x | 0.00 | 0.00 | ✅ |
| pylazyimports | submodule_imports | 1.63 | 1.00x | 88.32 | 0.00 | ✅ |
| pylazyimports | hook_interference | 0.37 | 0.34x | 0.00 | 0.00 | ✅ |
| pylazyimports | module_cleanup | 0.38 | 0.35x | 0.00 | 0.00 | ✅ |
| pylazyimports | thread_safety | 0.00 | 1.00x | 0.00 | 0.00 | ✅ |
| pylazyimports | import_error_recovery | 0.00 | 0.00x | 0.00 | 0.00 | ✅ |
| pylazyimports 🥈 | namespace_packages | 0.00 | 0.00x | 0.00 | 0.00 | ✅ |
| pylazyimports 🥉 | import_from_string | 0.00 | 0.00x | 0.00 | 0.00 | ✅ |
| xwlazy | missing_dependencies | 0.00 | 1.00x | 0.00 | 0.00 | ✅ |
| xwlazy | invalid_module_names | 0.00 | 1.00x | 0.00 | 0.00 | ✅ |
| xwlazy | already_loaded_modules | 0.00 | 1.00x | 0.00 | 0.00 | ✅ |
| xwlazy 🥇 | submodule_imports | 1.25 | 1.00x | 103.38 | 0.00 | ✅ |
| xwlazy 🥇 | hook_interference | 0.27 | 0.25x | 0.00 | 0.00 | ✅ |
| xwlazy 🥇 | module_cleanup | 0.26 | 0.24x | 0.00 | 0.00 | ✅ |
| xwlazy | thread_safety | 0.00 | 1.00x | 0.00 | 0.00 | ✅ |
| xwlazy 🥉 | import_error_recovery | 0.00 | 0.00x | 0.00 | 0.00 | ✅ |
| xwlazy | namespace_packages | 0.00 | 0.00x | 0.00 | 0.00 | ✅ |
| xwlazy | import_from_string | 0.00 | 0.00x | 0.00 | 0.00 | ✅ |

#### Detailed Results

##### deferred-import 🥇

**Test:** missing_dependencies 🥇

- Import Time: 0.00 ms
- Relative Time: 1.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** invalid_module_names 🥇

- Import Time: 0.00 ms
- Relative Time: 1.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** already_loaded_modules

- Import Time: 0.00 ms
- Relative Time: 1.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** submodule_imports 🥈

- Import Time: 1.32 ms
- Relative Time: 1.00x (vs baseline)
- Memory Peak: 52.95 MB
- Memory Avg: 52.89 MB
- Package Size: 0.00 MB

**Test:** hook_interference

- Import Time: 0.37 ms
- Relative Time: 0.33x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** module_cleanup

- Import Time: 0.40 ms
- Relative Time: 0.36x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** thread_safety 🥇

- Import Time: 0.00 ms
- Relative Time: 1.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** import_error_recovery

- Import Time: 0.00 ms
- Relative Time: 0.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** namespace_packages 🥇

- Import Time: 0.00 ms
- Relative Time: 0.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** import_from_string

- Import Time: 0.00 ms
- Relative Time: 0.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

##### lazi

**Test:** missing_dependencies

- Import Time: 0.00 ms
- Relative Time: 1.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** invalid_module_names

- Import Time: 0.00 ms
- Relative Time: 1.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** already_loaded_modules

- Import Time: 0.00 ms
- Relative Time: 1.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** submodule_imports

- Import Time: 1.92 ms
- Relative Time: 1.00x (vs baseline)
- Memory Peak: 98.69 MB
- Memory Avg: 98.69 MB
- Package Size: 0.00 MB

**Test:** hook_interference

- Import Time: 0.61 ms
- Relative Time: 0.55x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** module_cleanup

- Import Time: 0.44 ms
- Relative Time: 0.40x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** thread_safety

- Import Time: 0.00 ms
- Relative Time: 1.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** import_error_recovery

- Import Time: 0.00 ms
- Relative Time: 0.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** namespace_packages

- Import Time: 0.00 ms
- Relative Time: 0.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** import_from_string

- Import Time: 0.00 ms
- Relative Time: 0.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

##### lazy-imports 🥉

**Test:** missing_dependencies 🥉

- Import Time: 0.00 ms
- Relative Time: 1.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** invalid_module_names 🥉

- Import Time: 0.00 ms
- Relative Time: 1.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** already_loaded_modules

- Import Time: 0.00 ms
- Relative Time: 1.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** submodule_imports

- Import Time: 2.41 ms
- Relative Time: 1.00x (vs baseline)
- Memory Peak: 72.31 MB
- Memory Avg: 72.31 MB
- Package Size: 0.00 MB

**Test:** hook_interference

- Import Time: 0.48 ms
- Relative Time: 0.44x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** module_cleanup

- Import Time: 0.38 ms
- Relative Time: 0.35x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** thread_safety 🥉

- Import Time: 0.00 ms
- Relative Time: 1.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** import_error_recovery

- Import Time: 0.00 ms
- Relative Time: 0.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** namespace_packages

- Import Time: 0.00 ms
- Relative Time: 0.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** import_from_string

- Import Time: 0.00 ms
- Relative Time: 0.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

##### lazy-imports-lite 🥇

**Test:** missing_dependencies

- Import Time: 0.00 ms
- Relative Time: 1.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** invalid_module_names

- Import Time: 0.00 ms
- Relative Time: 1.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** already_loaded_modules 🥉

- Import Time: 0.00 ms
- Relative Time: 1.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** submodule_imports

- Import Time: 1.81 ms
- Relative Time: 1.00x (vs baseline)
- Memory Peak: 98.98 MB
- Memory Avg: 98.98 MB
- Package Size: 0.00 MB

**Test:** hook_interference

- Import Time: 0.38 ms
- Relative Time: 0.35x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** module_cleanup 🥈

- Import Time: 0.31 ms
- Relative Time: 0.28x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** thread_safety

- Import Time: 0.00 ms
- Relative Time: 1.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** import_error_recovery 🥇

- Import Time: 0.00 ms
- Relative Time: 0.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** namespace_packages

- Import Time: 0.00 ms
- Relative Time: 0.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** import_from_string 🥇

- Import Time: 0.00 ms
- Relative Time: 0.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

##### lazy-loader 🥈

**Test:** missing_dependencies 🥈

- Import Time: 0.00 ms
- Relative Time: 1.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** invalid_module_names 🥈

- Import Time: 0.00 ms
- Relative Time: 1.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** already_loaded_modules

- Import Time: 0.00 ms
- Relative Time: 1.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** submodule_imports

- Import Time: 2.03 ms
- Relative Time: 1.00x (vs baseline)
- Memory Peak: 66.54 MB
- Memory Avg: 66.49 MB
- Package Size: 0.00 MB

**Test:** hook_interference 🥉

- Import Time: 0.35 ms
- Relative Time: 0.31x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** module_cleanup

- Import Time: 0.44 ms
- Relative Time: 0.40x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** thread_safety 🥈

- Import Time: 0.00 ms
- Relative Time: 1.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** import_error_recovery

- Import Time: 0.00 ms
- Relative Time: 0.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** namespace_packages 🥉

- Import Time: 0.00 ms
- Relative Time: 0.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** import_from_string 🥈

- Import Time: 0.00 ms
- Relative Time: 0.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

##### lazy_import 🥇

**Test:** missing_dependencies

- Import Time: 0.00 ms
- Relative Time: 1.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** invalid_module_names

- Import Time: 0.00 ms
- Relative Time: 1.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** already_loaded_modules 🥇

- Import Time: 0.00 ms
- Relative Time: 1.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** submodule_imports 🥉

- Import Time: 1.57 ms
- Relative Time: 1.00x (vs baseline)
- Memory Peak: 84.52 MB
- Memory Avg: 84.49 MB
- Package Size: 0.00 MB

**Test:** hook_interference 🥈

- Import Time: 0.28 ms
- Relative Time: 0.25x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** module_cleanup 🥉

- Import Time: 0.31 ms
- Relative Time: 0.29x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** thread_safety

- Import Time: 0.00 ms
- Relative Time: 1.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** import_error_recovery 🥈

- Import Time: 0.00 ms
- Relative Time: 0.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** namespace_packages

- Import Time: 0.00 ms
- Relative Time: 0.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** import_from_string

- Import Time: 0.00 ms
- Relative Time: 0.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

##### pipimport

**Test:** missing_dependencies

- ❌ Error: Missing parentheses in call to 'print'. Did you mean print(...)? (__init__.py, line 77)

**Test:** invalid_module_names

- ❌ Error: Missing parentheses in call to 'print'. Did you mean print(...)? (__init__.py, line 77)

**Test:** already_loaded_modules

- ❌ Error: Missing parentheses in call to 'print'. Did you mean print(...)? (__init__.py, line 77)

**Test:** submodule_imports

- ❌ Error: Missing parentheses in call to 'print'. Did you mean print(...)? (__init__.py, line 77)

**Test:** hook_interference

- ❌ Error: Missing parentheses in call to 'print'. Did you mean print(...)? (__init__.py, line 77)

**Test:** module_cleanup

- ❌ Error: Missing parentheses in call to 'print'. Did you mean print(...)? (__init__.py, line 77)

**Test:** thread_safety

- ❌ Error: Missing parentheses in call to 'print'. Did you mean print(...)? (__init__.py, line 77)

**Test:** import_error_recovery

- ❌ Error: Missing parentheses in call to 'print'. Did you mean print(...)? (__init__.py, line 77)

**Test:** namespace_packages

- ❌ Error: Missing parentheses in call to 'print'. Did you mean print(...)? (__init__.py, line 77)

**Test:** import_from_string

- ❌ Error: Missing parentheses in call to 'print'. Did you mean print(...)? (__init__.py, line 77)

##### pylazyimports 🥈

**Test:** missing_dependencies

- Import Time: 0.00 ms
- Relative Time: 1.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** invalid_module_names

- Import Time: 0.00 ms
- Relative Time: 1.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** already_loaded_modules 🥈

- Import Time: 0.00 ms
- Relative Time: 1.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** submodule_imports

- Import Time: 1.63 ms
- Relative Time: 1.00x (vs baseline)
- Memory Peak: 88.32 MB
- Memory Avg: 88.25 MB
- Package Size: 0.00 MB

**Test:** hook_interference

- Import Time: 0.37 ms
- Relative Time: 0.34x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** module_cleanup

- Import Time: 0.38 ms
- Relative Time: 0.35x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** thread_safety

- Import Time: 0.00 ms
- Relative Time: 1.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** import_error_recovery

- Import Time: 0.00 ms
- Relative Time: 0.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** namespace_packages 🥈

- Import Time: 0.00 ms
- Relative Time: 0.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** import_from_string 🥉

- Import Time: 0.00 ms
- Relative Time: 0.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

##### xwlazy 🥇

**Test:** missing_dependencies

- Import Time: 0.00 ms
- Relative Time: 1.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** invalid_module_names

- Import Time: 0.00 ms
- Relative Time: 1.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** already_loaded_modules

- Import Time: 0.00 ms
- Relative Time: 1.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** submodule_imports 🥇

- Import Time: 1.25 ms
- Relative Time: 1.00x (vs baseline)
- Memory Peak: 103.38 MB
- Memory Avg: 103.38 MB
- Package Size: 0.00 MB

**Test:** hook_interference 🥇

- Import Time: 0.27 ms
- Relative Time: 0.25x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** module_cleanup 🥇

- Import Time: 0.26 ms
- Relative Time: 0.24x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** thread_safety

- Import Time: 0.00 ms
- Relative Time: 1.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** import_error_recovery 🥉

- Import Time: 0.00 ms
- Relative Time: 0.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** namespace_packages

- Import Time: 0.00 ms
- Relative Time: 0.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** import_from_string

- Import Time: 0.00 ms
- Relative Time: 0.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB


## Overall Winner 👑

**xwlazy 👑** wins with **77 first place victory(ies)** across all test categories!

### Winner Summary

| Library | First Place Wins |
|---------|------------------|
| xwlazy 👑 | 77 |
| lazy-loader | 6 |
| deferred-import | 4 |
| lazy-imports-lite | 2 |
| pylazyimports | 1 |
| lazy_import | 1 |


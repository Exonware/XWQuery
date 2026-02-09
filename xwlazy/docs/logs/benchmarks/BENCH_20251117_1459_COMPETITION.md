# Competition Benchmark Report

**Generated:** 2025-11-17T14:59:40.049151

## Standard Tests

### Full Features

*All features enabled (xwlazy showcase)*

#### Top 3 Rankings by Load Test

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazi | 1.11 | 0.91x |
| 2 🥈 | pylazyimports | 1.23 | 1.00x |
| 3 🥉 | lazy-imports | 1.32 | 1.07x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| deferred-import | light_load | 1.47 | 1.20x | 30.82 | 0.00 | ✅ |
| lazi 🥇 | light_load | 1.11 | 0.91x | 30.92 | 0.00 | ✅ |
| lazy-imports 🥉 | light_load | 1.32 | 1.07x | 30.84 | 0.00 | ✅ |
| lazy-imports-lite | light_load | 1.41 | 1.15x | 30.92 | 0.00 | ✅ |
| lazy-loader | light_load | 1.52 | 1.24x | 30.82 | 0.00 | ✅ |
| lazy_import | light_load | 1.57 | 1.28x | 30.87 | 0.00 | ✅ |
| pipimport | light_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pylazyimports 🥈 | light_load | 1.23 | 1.00x | 30.90 | 0.00 | ✅ |
| xwlazy | light_load | 1.78 | 1.45x | 30.92 | 0.00 | ✅ |

#### Detailed Results

##### deferred-import

**Test:** light_load

- Import Time: 1.47 ms
- Relative Time: 1.20x (vs baseline)
- Memory Peak: 30.82 MB
- Memory Avg: 30.82 MB
- Package Size: 0.00 MB
- Features: deferred_loading

##### lazi 🥇

**Test:** light_load 🥇

- Import Time: 1.11 ms
- Relative Time: 0.91x (vs baseline)
- Memory Peak: 30.92 MB
- Memory Avg: 30.92 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

##### lazy-imports 🥉

**Test:** light_load 🥉

- Import Time: 1.32 ms
- Relative Time: 1.07x (vs baseline)
- Memory Peak: 30.84 MB
- Memory Avg: 30.84 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### lazy-imports-lite

**Test:** light_load

- Import Time: 1.41 ms
- Relative Time: 1.15x (vs baseline)
- Memory Peak: 30.92 MB
- Memory Avg: 30.92 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

##### lazy-loader

**Test:** light_load

- Import Time: 1.52 ms
- Relative Time: 1.24x (vs baseline)
- Memory Peak: 30.82 MB
- Memory Avg: 30.82 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

##### lazy_import

**Test:** light_load

- Import Time: 1.57 ms
- Relative Time: 1.28x (vs baseline)
- Memory Peak: 30.87 MB
- Memory Avg: 30.86 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### pipimport

**Test:** light_load

- ❌ Error: Library pipimport is not compatible with Python 3 (Python 2 syntax detected)

##### pylazyimports 🥈

**Test:** light_load 🥈

- Import Time: 1.23 ms
- Relative Time: 1.00x (vs baseline)
- Memory Peak: 30.90 MB
- Memory Avg: 30.89 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### xwlazy

**Test:** light_load

- Import Time: 1.78 ms
- Relative Time: 1.45x (vs baseline)
- Memory Peak: 30.92 MB
- Memory Avg: 30.92 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_install, dependency_discovery, performance_monitoring, keyword_detection, per_package_isolation, caching


### Lazy Import + Discovery

*Lazy import + dependency discovery*

#### Top 3 Rankings by Load Test

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazy-imports-lite | 0.91 | 0.74x |
| 2 🥈 | lazi | 1.07 | 0.87x |
| 3 🥉 | lazy-imports | 1.38 | 1.12x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| deferred-import | light_load | 1.60 | 1.30x | 30.61 | 0.00 | ✅ |
| lazi 🥈 | light_load | 1.07 | 0.87x | 30.64 | 0.00 | ✅ |
| lazy-imports 🥉 | light_load | 1.38 | 1.12x | 30.62 | 0.00 | ✅ |
| lazy-imports-lite 🥇 | light_load | 0.91 | 0.74x | 30.64 | 0.00 | ✅ |
| lazy-loader | light_load | 1.72 | 1.40x | 30.62 | 0.00 | ✅ |
| lazy_import | light_load | 1.80 | 1.46x | 30.62 | 0.00 | ✅ |
| pipimport | light_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pylazyimports | light_load | 1.63 | 1.33x | 30.64 | 0.00 | ✅ |
| xwlazy | light_load | 2.00 | 1.63x | 30.59 | 0.00 | ✅ |

#### Detailed Results

##### deferred-import

**Test:** light_load

- Import Time: 1.60 ms
- Relative Time: 1.30x (vs baseline)
- Memory Peak: 30.61 MB
- Memory Avg: 30.61 MB
- Package Size: 0.00 MB
- Features: deferred_loading

##### lazi 🥈

**Test:** light_load 🥈

- Import Time: 1.07 ms
- Relative Time: 0.87x (vs baseline)
- Memory Peak: 30.64 MB
- Memory Avg: 30.64 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

##### lazy-imports 🥉

**Test:** light_load 🥉

- Import Time: 1.38 ms
- Relative Time: 1.12x (vs baseline)
- Memory Peak: 30.62 MB
- Memory Avg: 30.62 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### lazy-imports-lite 🥇

**Test:** light_load 🥇

- Import Time: 0.91 ms
- Relative Time: 0.74x (vs baseline)
- Memory Peak: 30.64 MB
- Memory Avg: 30.64 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

##### lazy-loader

**Test:** light_load

- Import Time: 1.72 ms
- Relative Time: 1.40x (vs baseline)
- Memory Peak: 30.62 MB
- Memory Avg: 30.61 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

##### lazy_import

**Test:** light_load

- Import Time: 1.80 ms
- Relative Time: 1.46x (vs baseline)
- Memory Peak: 30.62 MB
- Memory Avg: 30.62 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### pipimport

**Test:** light_load

- ❌ Error: Library pipimport is not compatible with Python 3 (Python 2 syntax detected)

##### pylazyimports

**Test:** light_load

- Import Time: 1.63 ms
- Relative Time: 1.33x (vs baseline)
- Memory Peak: 30.64 MB
- Memory Avg: 30.64 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### xwlazy

**Test:** light_load

- Import Time: 2.00 ms
- Relative Time: 1.63x (vs baseline)
- Memory Peak: 30.59 MB
- Memory Avg: 30.59 MB
- Package Size: 0.00 MB
- Features: lazy_import, dependency_discovery, per_package_isolation, caching


### Lazy Import + Install

*Lazy import + auto-install*

#### Top 3 Rankings by Load Test

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | deferred-import | 1.13 | 0.92x |
| 2 🥈 | lazi | 1.32 | 1.07x |
| 3 🥉 | xwlazy | 1.35 | 1.10x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| deferred-import 🥇 | light_load | 1.13 | 0.92x | 30.46 | 0.00 | ✅ |
| lazi 🥈 | light_load | 1.32 | 1.07x | 30.58 | 0.00 | ✅ |
| lazy-imports | light_load | 1.54 | 1.26x | 30.50 | 0.00 | ✅ |
| lazy-imports-lite | light_load | 1.50 | 1.22x | 30.58 | 0.00 | ✅ |
| lazy-loader | light_load | 1.68 | 1.37x | 30.48 | 0.00 | ✅ |
| lazy_import | light_load | 1.52 | 1.24x | 30.55 | 0.00 | ✅ |
| pipimport | light_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pylazyimports | light_load | 1.38 | 1.13x | 30.58 | 0.00 | ✅ |
| xwlazy 🥉 | light_load | 1.35 | 1.10x | 30.58 | 0.00 | ✅ |

#### Detailed Results

##### deferred-import 🥇

**Test:** light_load 🥇

- Import Time: 1.13 ms
- Relative Time: 0.92x (vs baseline)
- Memory Peak: 30.46 MB
- Memory Avg: 30.46 MB
- Package Size: 0.00 MB
- Features: deferred_loading

##### lazi 🥈

**Test:** light_load 🥈

- Import Time: 1.32 ms
- Relative Time: 1.07x (vs baseline)
- Memory Peak: 30.58 MB
- Memory Avg: 30.58 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

##### lazy-imports

**Test:** light_load

- Import Time: 1.54 ms
- Relative Time: 1.26x (vs baseline)
- Memory Peak: 30.50 MB
- Memory Avg: 30.50 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### lazy-imports-lite

**Test:** light_load

- Import Time: 1.50 ms
- Relative Time: 1.22x (vs baseline)
- Memory Peak: 30.58 MB
- Memory Avg: 30.58 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

##### lazy-loader

**Test:** light_load

- Import Time: 1.68 ms
- Relative Time: 1.37x (vs baseline)
- Memory Peak: 30.48 MB
- Memory Avg: 30.47 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

##### lazy_import

**Test:** light_load

- Import Time: 1.52 ms
- Relative Time: 1.24x (vs baseline)
- Memory Peak: 30.55 MB
- Memory Avg: 30.54 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### pipimport

**Test:** light_load

- ❌ Error: Library pipimport is not compatible with Python 3 (Python 2 syntax detected)

##### pylazyimports

**Test:** light_load

- Import Time: 1.38 ms
- Relative Time: 1.13x (vs baseline)
- Memory Peak: 30.58 MB
- Memory Avg: 30.57 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### xwlazy 🥉

**Test:** light_load 🥉

- Import Time: 1.35 ms
- Relative Time: 1.10x (vs baseline)
- Memory Peak: 30.58 MB
- Memory Avg: 30.58 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_install, per_package_isolation, caching


### Lazy Import + Monitoring

*Lazy import + performance monitoring*

#### Top 3 Rankings by Load Test

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazi | 1.22 | 0.99x |
| 2 🥈 | deferred-import | 1.36 | 1.11x |
| 3 🥉 | lazy-imports-lite | 1.48 | 1.20x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| deferred-import 🥈 | light_load | 1.36 | 1.11x | 30.73 | 0.00 | ✅ |
| lazi 🥇 | light_load | 1.22 | 0.99x | 30.79 | 0.00 | ✅ |
| lazy-imports | light_load | 1.62 | 1.32x | 30.75 | 0.00 | ✅ |
| lazy-imports-lite 🥉 | light_load | 1.48 | 1.20x | 30.79 | 0.00 | ✅ |
| lazy-loader | light_load | 1.56 | 1.27x | 30.73 | 0.00 | ✅ |
| lazy_import | light_load | 2.85 | 2.32x | 30.76 | 0.00 | ✅ |
| pipimport | light_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pylazyimports | light_load | 1.93 | 1.57x | 30.79 | 0.00 | ✅ |
| xwlazy | light_load | 2.22 | 1.81x | 30.79 | 0.00 | ✅ |

#### Detailed Results

##### deferred-import 🥈

**Test:** light_load 🥈

- Import Time: 1.36 ms
- Relative Time: 1.11x (vs baseline)
- Memory Peak: 30.73 MB
- Memory Avg: 30.73 MB
- Package Size: 0.00 MB
- Features: deferred_loading

##### lazi 🥇

**Test:** light_load 🥇

- Import Time: 1.22 ms
- Relative Time: 0.99x (vs baseline)
- Memory Peak: 30.79 MB
- Memory Avg: 30.79 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

##### lazy-imports

**Test:** light_load

- Import Time: 1.62 ms
- Relative Time: 1.32x (vs baseline)
- Memory Peak: 30.75 MB
- Memory Avg: 30.75 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### lazy-imports-lite 🥉

**Test:** light_load 🥉

- Import Time: 1.48 ms
- Relative Time: 1.20x (vs baseline)
- Memory Peak: 30.79 MB
- Memory Avg: 30.79 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

##### lazy-loader

**Test:** light_load

- Import Time: 1.56 ms
- Relative Time: 1.27x (vs baseline)
- Memory Peak: 30.73 MB
- Memory Avg: 30.73 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

##### lazy_import

**Test:** light_load

- Import Time: 2.85 ms
- Relative Time: 2.32x (vs baseline)
- Memory Peak: 30.76 MB
- Memory Avg: 30.76 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### pipimport

**Test:** light_load

- ❌ Error: Library pipimport is not compatible with Python 3 (Python 2 syntax detected)

##### pylazyimports

**Test:** light_load

- Import Time: 1.93 ms
- Relative Time: 1.57x (vs baseline)
- Memory Peak: 30.79 MB
- Memory Avg: 30.79 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### xwlazy

**Test:** light_load

- Import Time: 2.22 ms
- Relative Time: 1.81x (vs baseline)
- Memory Peak: 30.79 MB
- Memory Avg: 30.79 MB
- Package Size: 0.00 MB
- Features: lazy_import, performance_monitoring, per_package_isolation, caching


### Basic Lazy Import

*Basic lazy import (fair comparison - all libraries)*

#### Top 3 Rankings by Load Test

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazy-imports-lite | 1.02 | 0.83x |
| 2 🥈 | lazi | 1.06 | 0.86x |
| 3 🥉 | deferred-import | 1.18 | 0.96x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| deferred-import 🥉 | light_load | 1.18 | 0.96x | 29.99 | 0.00 | ✅ |
| lazi 🥈 | light_load | 1.06 | 0.86x | 30.39 | 0.00 | ✅ |
| lazy-imports | light_load | 1.21 | 0.99x | 30.12 | 0.00 | ✅ |
| lazy-imports-lite 🥇 | light_load | 1.02 | 0.83x | 30.39 | 0.00 | ✅ |
| lazy-loader | light_load | 1.35 | 1.10x | 30.05 | 0.00 | ✅ |
| lazy_import | light_load | 2.15 | 1.75x | 30.34 | 0.00 | ✅ |
| pipimport | light_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pylazyimports | light_load | 1.36 | 1.11x | 30.38 | 0.00 | ✅ |
| xwlazy | light_load | 1.75 | 1.43x | 30.40 | 0.00 | ✅ |

#### Detailed Results

##### deferred-import 🥉

**Test:** light_load 🥉

- Import Time: 1.18 ms
- Relative Time: 0.96x (vs baseline)
- Memory Peak: 29.99 MB
- Memory Avg: 29.91 MB
- Package Size: 0.00 MB
- Features: deferred_loading

##### lazi 🥈

**Test:** light_load 🥈

- Import Time: 1.06 ms
- Relative Time: 0.86x (vs baseline)
- Memory Peak: 30.39 MB
- Memory Avg: 30.39 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

##### lazy-imports

**Test:** light_load

- Import Time: 1.21 ms
- Relative Time: 0.99x (vs baseline)
- Memory Peak: 30.12 MB
- Memory Avg: 30.10 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### lazy-imports-lite 🥇

**Test:** light_load 🥇

- Import Time: 1.02 ms
- Relative Time: 0.83x (vs baseline)
- Memory Peak: 30.39 MB
- Memory Avg: 30.39 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

##### lazy-loader

**Test:** light_load

- Import Time: 1.35 ms
- Relative Time: 1.10x (vs baseline)
- Memory Peak: 30.05 MB
- Memory Avg: 30.04 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

##### lazy_import

**Test:** light_load

- Import Time: 2.15 ms
- Relative Time: 1.75x (vs baseline)
- Memory Peak: 30.34 MB
- Memory Avg: 30.28 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### pipimport

**Test:** light_load

- ❌ Error: Library pipimport is not compatible with Python 3 (Python 2 syntax detected)

##### pylazyimports

**Test:** light_load

- Import Time: 1.36 ms
- Relative Time: 1.11x (vs baseline)
- Memory Peak: 30.38 MB
- Memory Avg: 30.38 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### xwlazy

**Test:** light_load

- Import Time: 1.75 ms
- Relative Time: 1.43x (vs baseline)
- Memory Peak: 30.40 MB
- Memory Avg: 30.40 MB
- Package Size: 0.00 MB
- Features: lazy_import, per_package_isolation, caching


## Overall Winner 👑

**lazy-imports-lite 👑** wins with **2 first place victory(ies)** across all test categories!

### Winner Summary

| Library | First Place Wins |
|---------|------------------|
| lazy-imports-lite 👑 | 2 |
| lazi | 2 |
| deferred-import | 1 |


# Competition Benchmark Report

**Generated:** 2025-11-19T02:22:54.180922

## Standard Tests

### Basic Lazy Import

*Basic lazy import (fair comparison - all libraries) - LITE mode*

#### Top 3 Rankings by Load Test

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazi | 0.35 | 0.71x |
| 2 🥈 | lazy-imports-lite | 0.65 | 1.31x |
| 3 🥉 | pylazyimports | 0.68 | 1.38x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| deferred-import | light_load | 1.23 | 2.50x | 28.93 | 0.00 | ✅ |
| lazi 🥇 | light_load | 0.35 | 0.71x | 29.67 | 0.00 | ✅ |
| lazy-imports | light_load | 0.98 | 1.99x | 29.20 | 0.00 | ✅ |
| lazy-imports-lite 🥈 | light_load | 0.65 | 1.31x | 29.76 | 0.00 | ✅ |
| lazy-loader | light_load | 1.06 | 2.16x | 29.02 | 0.00 | ✅ |
| lazy_import | light_load | 1.69 | 3.44x | 29.41 | 0.00 | ✅ |
| pipimport | light_load | 0.84 | 1.71x | 28.34 | 0.00 | ✅ |
| pylazyimports 🥉 | light_load | 0.68 | 1.38x | 29.57 | 0.00 | ✅ |
| xwlazy | light_load | 1.12 | 2.28x | 34.60 | 0.00 | ✅ |

#### Detailed Results

##### deferred-import

**Test:** light_load

- Import Time: 1.23 ms
- Relative Time: 2.50x (vs baseline)
- Memory Peak: 28.93 MB
- Memory Avg: 28.67 MB
- Package Size: 0.00 MB
- Features: deferred_loading

##### lazi 🥇

**Test:** light_load 🥇

- Import Time: 0.35 ms
- Relative Time: 0.71x (vs baseline)
- Memory Peak: 29.67 MB
- Memory Avg: 29.66 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

##### lazy-imports

**Test:** light_load

- Import Time: 0.98 ms
- Relative Time: 1.99x (vs baseline)
- Memory Peak: 29.20 MB
- Memory Avg: 29.18 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### lazy-imports-lite 🥈

**Test:** light_load 🥈

- Import Time: 0.65 ms
- Relative Time: 1.31x (vs baseline)
- Memory Peak: 29.76 MB
- Memory Avg: 29.75 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

##### lazy-loader

**Test:** light_load

- Import Time: 1.06 ms
- Relative Time: 2.16x (vs baseline)
- Memory Peak: 29.02 MB
- Memory Avg: 29.01 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

##### lazy_import

**Test:** light_load

- Import Time: 1.69 ms
- Relative Time: 3.44x (vs baseline)
- Memory Peak: 29.41 MB
- Memory Avg: 29.34 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### pipimport

**Test:** light_load

- Import Time: 0.84 ms
- Relative Time: 1.71x (vs baseline)
- Memory Peak: 28.34 MB
- Memory Avg: 28.04 MB
- Package Size: 0.00 MB
- Features: auto_install

##### pylazyimports 🥉

**Test:** light_load 🥉

- Import Time: 0.68 ms
- Relative Time: 1.38x (vs baseline)
- Memory Peak: 29.57 MB
- Memory Avg: 29.53 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### xwlazy

**Test:** light_load

- Import Time: 1.12 ms
- Relative Time: 2.28x (vs baseline)
- Memory Peak: 34.60 MB
- Memory Avg: 32.21 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection, per_package_isolation, performance_monitoring


## Overall Winner 👑

**lazi 👑** wins with **1 first place victory(ies)** across all test categories!

### Winner Summary

| Library | First Place Wins |
|---------|------------------|
| lazi 👑 | 1 |


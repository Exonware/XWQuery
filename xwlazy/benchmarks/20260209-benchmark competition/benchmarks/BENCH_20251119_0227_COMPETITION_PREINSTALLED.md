# Competition Benchmark Report

**Generated:** 2025-11-19T02:27:22.199720

## Benchmark Scenarios

### Pre-Installed Scenario (Warm Performance)

**Description:** Libraries installed once at start. Tests run with libraries already in environment.

**Why:** Measures true import performance without installation overhead.


## Standard Tests

### Basic Lazy Import

*Basic lazy import (fair comparison - all libraries) - LITE mode*

#### Top 3 Rankings by Load Test

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | lazi | 0.32 | 0.69x |
| 2 🥈 | xwlazy | 0.65 | 1.42x |
| 3 🥉 | lazy-imports | 0.67 | 1.45x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| deferred-import | light_load | 1.05 | 2.28x | 29.32 | 0.00 | ✅ |
| lazi 🥇 | light_load | 0.32 | 0.69x | 30.02 | 0.00 | ✅ |
| lazy-imports 🥉 | light_load | 0.67 | 1.45x | 29.62 | 0.00 | ✅ |
| lazy-imports-lite | light_load | 0.97 | 2.11x | 30.07 | 0.00 | ✅ |
| lazy-loader | light_load | 0.80 | 1.74x | 29.43 | 0.00 | ✅ |
| lazy_import | light_load | 1.04 | 2.27x | 29.90 | 0.00 | ✅ |
| pipimport | light_load | 0.87 | 1.90x | 28.88 | 0.00 | ✅ |
| pylazyimports | light_load | 0.71 | 1.56x | 29.99 | 0.00 | ✅ |
| xwlazy 🥈 | light_load | 0.65 | 1.42x | 35.05 | 0.00 | ✅ |

#### Detailed Results

##### deferred-import

**Test:** light_load

- Import Time: 1.05 ms
- Relative Time: 2.28x (vs baseline)
- Memory Peak: 29.32 MB
- Memory Avg: 29.12 MB
- Package Size: 0.00 MB
- Features: deferred_loading

##### lazi 🥇

**Test:** light_load 🥇

- Import Time: 0.32 ms
- Relative Time: 0.69x (vs baseline)
- Memory Peak: 30.02 MB
- Memory Avg: 30.02 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

##### lazy-imports 🥉

**Test:** light_load 🥉

- Import Time: 0.67 ms
- Relative Time: 1.45x (vs baseline)
- Memory Peak: 29.62 MB
- Memory Avg: 29.58 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### lazy-imports-lite

**Test:** light_load

- Import Time: 0.97 ms
- Relative Time: 2.11x (vs baseline)
- Memory Peak: 30.07 MB
- Memory Avg: 30.07 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

##### lazy-loader

**Test:** light_load

- Import Time: 0.80 ms
- Relative Time: 1.74x (vs baseline)
- Memory Peak: 29.43 MB
- Memory Avg: 29.41 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

##### lazy_import

**Test:** light_load

- Import Time: 1.04 ms
- Relative Time: 2.27x (vs baseline)
- Memory Peak: 29.90 MB
- Memory Avg: 29.85 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### pipimport

**Test:** light_load

- Import Time: 0.87 ms
- Relative Time: 1.90x (vs baseline)
- Memory Peak: 28.88 MB
- Memory Avg: 28.61 MB
- Package Size: 0.00 MB
- Features: auto_install

##### pylazyimports

**Test:** light_load

- Import Time: 0.71 ms
- Relative Time: 1.56x (vs baseline)
- Memory Peak: 29.99 MB
- Memory Avg: 29.96 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### xwlazy 🥈

**Test:** light_load 🥈

- Import Time: 0.65 ms
- Relative Time: 1.42x (vs baseline)
- Memory Peak: 35.05 MB
- Memory Avg: 32.62 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection, per_package_isolation, performance_monitoring


## Overall Winner 👑

**lazi 👑** wins with **1 first place victory(ies)** across all test categories!

### Winner Summary

| Library | First Place Wins |
|---------|------------------|
| lazi 👑 | 1 |


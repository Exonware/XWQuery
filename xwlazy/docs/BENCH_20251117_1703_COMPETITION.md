# Competition Benchmark Report

**Generated:** 2025-11-17T17:03:28.386267

## Standard Tests

### Lazy Import + Install

*Lazy import + auto-install*

#### Top 3 Rankings by Load Test

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | deferred-import | 0.67 | 1.66x |
| 2 🥈 | lazi | 0.68 | 1.69x |
| 3 🥉 | lazy-loader | 0.78 | 1.94x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| deferred-import 🥇 | light_load | 0.67 | 1.66x | 29.67 | 0.00 | ✅ |
| lazi 🥈 | light_load | 0.68 | 1.69x | 30.38 | 0.00 | ✅ |
| lazy-imports | light_load | 0.81 | 2.01x | 29.86 | 0.00 | ✅ |
| lazy-imports-lite | light_load | 1.55 | 3.85x | 30.42 | 0.00 | ✅ |
| lazy-loader 🥉 | light_load | 0.78 | 1.94x | 29.73 | 0.00 | ✅ |
| lazy_import | light_load | 1.95 | 4.86x | 30.14 | 0.00 | ✅ |
| pipimport | light_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pylazyimports | light_load | 1.03 | 2.56x | 30.36 | 0.00 | ✅ |
| xwlazy | light_load | 1.08 | 2.70x | 30.43 | 0.00 | ✅ |

#### Detailed Results

##### deferred-import 🥇

**Test:** light_load 🥇

- Import Time: 0.67 ms
- Relative Time: 1.66x (vs baseline)
- Memory Peak: 29.67 MB
- Memory Avg: 29.59 MB
- Package Size: 0.00 MB
- Features: deferred_loading

##### lazi 🥈

**Test:** light_load 🥈

- Import Time: 0.68 ms
- Relative Time: 1.69x (vs baseline)
- Memory Peak: 30.38 MB
- Memory Avg: 30.38 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

##### lazy-imports

**Test:** light_load

- Import Time: 0.81 ms
- Relative Time: 2.01x (vs baseline)
- Memory Peak: 29.86 MB
- Memory Avg: 29.81 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### lazy-imports-lite

**Test:** light_load

- Import Time: 1.55 ms
- Relative Time: 3.85x (vs baseline)
- Memory Peak: 30.42 MB
- Memory Avg: 30.42 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

##### lazy-loader 🥉

**Test:** light_load 🥉

- Import Time: 0.78 ms
- Relative Time: 1.94x (vs baseline)
- Memory Peak: 29.73 MB
- Memory Avg: 29.72 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

##### lazy_import

**Test:** light_load

- Import Time: 1.95 ms
- Relative Time: 4.86x (vs baseline)
- Memory Peak: 30.14 MB
- Memory Avg: 30.08 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### pipimport

**Test:** light_load

- ❌ Error: Library pipimport is not compatible with Python 3 (Python 2 syntax detected)

##### pylazyimports

**Test:** light_load

- Import Time: 1.03 ms
- Relative Time: 2.56x (vs baseline)
- Memory Peak: 30.36 MB
- Memory Avg: 30.36 MB
- Package Size: 0.00 MB
- Features: lazy_import

##### xwlazy

**Test:** light_load

- Import Time: 1.08 ms
- Relative Time: 2.70x (vs baseline)
- Memory Peak: 30.43 MB
- Memory Avg: 30.43 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_install, per_package_isolation, caching


## Overall Winner 👑

**deferred-import 👑** wins with **1 first place victory(ies)** across all test categories!

### Winner Summary

| Library | First Place Wins |
|---------|------------------|
| deferred-import 👑 | 1 |


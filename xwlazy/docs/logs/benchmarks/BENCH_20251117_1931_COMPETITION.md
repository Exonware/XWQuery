# Competition Benchmark Report

**Generated:** 2025-11-17T19:31:37.213271

## Standard Tests

### Basic Lazy Import

*Basic lazy import (fair comparison - all libraries)*

#### Top 3 Rankings by Load Test

##### Enterprise Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 25.24 | 68.98x |

##### Heavy Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 11.45 | 31.30x |

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 0.73 | 2.00x |

##### Medium Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 2.88 | 7.88x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| xwlazy 🥇 | light_load | 0.73 | 2.00x | 30.06 | 0.00 | ✅ |
| xwlazy 🥇 | medium_load | 2.88 | 7.88x | 31.99 | 0.00 | ✅ |
| xwlazy 🥇 | heavy_load | 11.45 | 31.30x | 36.26 | 0.00 | ✅ |
| xwlazy 🥇 | enterprise_load | 25.24 | 68.98x | 43.86 | 0.00 | ✅ |

#### Detailed Results

##### xwlazy 🥇

**Test:** light_load 🥇

- Import Time: 0.73 ms
- Relative Time: 2.00x (vs baseline)
- Memory Peak: 30.06 MB
- Memory Avg: 30.05 MB
- Package Size: 0.00 MB
- Features: lazy_import, per_package_isolation, caching

**Test:** medium_load 🥇

- Import Time: 2.88 ms
- Relative Time: 7.88x (vs baseline)
- Memory Peak: 31.99 MB
- Memory Avg: 31.04 MB
- Package Size: 0.00 MB
- Features: lazy_import, per_package_isolation, caching

**Test:** heavy_load 🥇

- Import Time: 11.45 ms
- Relative Time: 31.30x (vs baseline)
- Memory Peak: 36.26 MB
- Memory Avg: 34.15 MB
- Package Size: 0.00 MB
- Features: lazy_import, per_package_isolation, caching

**Test:** enterprise_load 🥇

- Import Time: 25.24 ms
- Relative Time: 68.98x (vs baseline)
- Memory Peak: 43.86 MB
- Memory Avg: 40.21 MB
- Package Size: 0.00 MB
- Features: lazy_import, per_package_isolation, caching


## Overall Winner 👑

**xwlazy 👑** wins with **4 first place victory(ies)** across all test categories!

### Winner Summary

| Library | First Place Wins |
|---------|------------------|
| xwlazy 👑 | 4 |


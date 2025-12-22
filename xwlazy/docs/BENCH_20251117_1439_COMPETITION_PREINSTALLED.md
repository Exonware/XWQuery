# Competition Benchmark Report

**Generated:** 2025-11-17T14:39:32.577371

## Benchmark Scenarios

### Pre-Installed Scenario (Warm Performance)

**Description:** Libraries installed once at start. Tests run with libraries already in environment.

**Why:** Measures true import performance without installation overhead.


## Standard Tests

### Basic Lazy Import

*Basic lazy import (fair comparison - all libraries)*

#### Top 3 Rankings by Load Test

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 👑 | xwlazy | 1.49 | 1.95x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| xwlazy 👑 | light_load | 1.49 | 1.95x | 27.75 | 0.00 | ✅ |

#### Detailed Results

##### xwlazy 👑

**Test:** light_load 👑

- Import Time: 1.49 ms
- Relative Time: 1.95x (vs baseline)
- Memory Peak: 27.75 MB
- Memory Avg: 27.73 MB
- Package Size: 0.00 MB
- Features: lazy_import, per_package_isolation, caching



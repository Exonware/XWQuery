# Competition Benchmark Report

**Generated:** 2025-11-17T14:39:43.313803

## Benchmark Scenarios

### Stress Tests

**Description:** High-load scenarios testing concurrency, rapid imports, memory pressure.

**Why:** Validates production-level performance and scalability.


## Standard Tests

### Basic Lazy Import

*Basic lazy import (fair comparison - all libraries)*

#### Top 3 Rankings by Load Test

##### Enterprise Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 👑 | xwlazy | 65.27 | 71.82x |

##### Heavy Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 👑 | xwlazy | 26.92 | 29.62x |

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 👑 | xwlazy | 1.28 | 1.40x |

##### Medium Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 👑 | xwlazy | 6.95 | 7.65x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| xwlazy 👑 | light_load | 1.28 | 1.40x | 27.72 | 0.00 | ✅ |
| xwlazy 👑 | medium_load | 6.95 | 7.65x | 32.30 | 0.00 | ✅ |
| xwlazy 👑 | heavy_load | 26.92 | 29.62x | 34.96 | 0.00 | ✅ |
| xwlazy 👑 | enterprise_load | 65.27 | 71.82x | 44.71 | 0.00 | ✅ |

#### Detailed Results

##### xwlazy 👑

**Test:** light_load 👑

- Import Time: 1.28 ms
- Relative Time: 1.40x (vs baseline)
- Memory Peak: 27.72 MB
- Memory Avg: 27.72 MB
- Package Size: 0.00 MB
- Features: lazy_import, per_package_isolation, caching

**Test:** medium_load 👑

- Import Time: 6.95 ms
- Relative Time: 7.65x (vs baseline)
- Memory Peak: 32.30 MB
- Memory Avg: 30.03 MB
- Package Size: 0.00 MB
- Features: lazy_import, per_package_isolation, caching

**Test:** heavy_load 👑

- Import Time: 26.92 ms
- Relative Time: 29.62x (vs baseline)
- Memory Peak: 34.96 MB
- Memory Avg: 33.64 MB
- Package Size: 0.00 MB
- Features: lazy_import, per_package_isolation, caching

**Test:** enterprise_load 👑

- Import Time: 65.27 ms
- Relative Time: 71.82x (vs baseline)
- Memory Peak: 44.71 MB
- Memory Avg: 39.84 MB
- Package Size: 0.00 MB
- Features: lazy_import, per_package_isolation, caching


## Stress Tests

### Basic Lazy Import

*Basic lazy import (fair comparison - all libraries)*

#### Top 3 Rankings by Load Test

##### Circular Imports

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 👑 | xwlazy | 34.69 | 38.17x |

##### Concurrent Imports

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 👑 | xwlazy | 20.95 | 23.04x |

##### Deep Dependency Chains

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 👑 | xwlazy | 152.52 | 167.81x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| xwlazy 👑 | concurrent_imports | 20.95 | 23.04x | 45.19 | 0.00 | ✅ |
| xwlazy | rapid_sequential_imports | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| xwlazy 👑 | circular_imports | 34.69 | 38.17x | 45.41 | 0.00 | ✅ |
| xwlazy 👑 | deep_dependency_chains | 152.52 | 167.81x | 45.42 | 0.00 | ✅ |
| xwlazy | repeated_imports | 0.00 | 0.00x | 45.42 | 0.00 | ❌ |
| xwlazy | memory_pressure | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| xwlazy | mixed_import_patterns | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |

#### Detailed Results

##### xwlazy 👑

**Test:** concurrent_imports 👑

- Import Time: 20.95 ms
- Relative Time: 23.04x (vs baseline)
- Memory Peak: 45.19 MB
- Memory Avg: 44.95 MB
- Package Size: 0.00 MB

**Test:** rapid_sequential_imports

- ❌ Error: module 'sys' has no attribute 'maxsize'

**Test:** circular_imports 👑

- Import Time: 34.69 ms
- Relative Time: 38.17x (vs baseline)
- Memory Peak: 45.41 MB
- Memory Avg: 45.41 MB
- Package Size: 0.00 MB

**Test:** deep_dependency_chains 👑

- Import Time: 152.52 ms
- Relative Time: 167.81x (vs baseline)
- Memory Peak: 45.42 MB
- Memory Avg: 45.42 MB
- Package Size: 0.00 MB

**Test:** repeated_imports

- ❌ Error: Consistency: 77.16%

**Test:** memory_pressure

- ❌ Error: module 'sys' has no attribute 'maxsize'

**Test:** mixed_import_patterns

- ❌ Error: module 'sys' has no attribute 'builtin_module_names'



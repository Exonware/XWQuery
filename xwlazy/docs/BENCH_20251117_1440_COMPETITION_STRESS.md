# Competition Benchmark Report

**Generated:** 2025-11-17T14:40:43.483360

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
| 1 👑 | xwlazy | 142.38 | 86.85x |

##### Heavy Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 👑 | xwlazy | 66.58 | 40.61x |

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 👑 | xwlazy | 3.31 | 2.02x |

##### Medium Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 👑 | xwlazy | 17.87 | 10.90x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| xwlazy 👑 | light_load | 3.31 | 2.02x | 27.83 | 0.00 | ✅ |
| xwlazy 👑 | medium_load | 17.87 | 10.90x | 30.91 | 0.00 | ✅ |
| xwlazy 👑 | heavy_load | 66.58 | 40.61x | 34.68 | 0.00 | ✅ |
| xwlazy 👑 | enterprise_load | 142.38 | 86.85x | 43.81 | 0.00 | ✅ |

#### Detailed Results

##### xwlazy 👑

**Test:** light_load 👑

- Import Time: 3.31 ms
- Relative Time: 2.02x (vs baseline)
- Memory Peak: 27.83 MB
- Memory Avg: 27.83 MB
- Package Size: 0.00 MB
- Features: lazy_import, per_package_isolation, caching

**Test:** medium_load 👑

- Import Time: 17.87 ms
- Relative Time: 10.90x (vs baseline)
- Memory Peak: 30.91 MB
- Memory Avg: 29.39 MB
- Package Size: 0.00 MB
- Features: lazy_import, per_package_isolation, caching

**Test:** heavy_load 👑

- Import Time: 66.58 ms
- Relative Time: 40.61x (vs baseline)
- Memory Peak: 34.68 MB
- Memory Avg: 32.79 MB
- Package Size: 0.00 MB
- Features: lazy_import, per_package_isolation, caching

**Test:** enterprise_load 👑

- Import Time: 142.38 ms
- Relative Time: 86.85x (vs baseline)
- Memory Peak: 43.81 MB
- Memory Avg: 39.24 MB
- Package Size: 0.00 MB
- Features: lazy_import, per_package_isolation, caching


## Stress Tests

### Basic Lazy Import

*Basic lazy import (fair comparison - all libraries)*

#### Top 3 Rankings by Load Test

##### Circular Imports

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 👑 | xwlazy | 10.44 | 6.37x |

##### Concurrent Imports

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 👑 | xwlazy | 100.83 | 61.51x |

##### Deep Dependency Chains

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 👑 | xwlazy | 62.30 | 38.00x |

##### Mixed Import Patterns

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 👑 | xwlazy | 6.38 | 3.89x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| xwlazy 👑 | concurrent_imports | 100.83 | 61.51x | 44.29 | 0.00 | ✅ |
| xwlazy | rapid_sequential_imports | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| xwlazy 👑 | circular_imports | 10.44 | 6.37x | 45.85 | 0.00 | ✅ |
| xwlazy 👑 | deep_dependency_chains | 62.30 | 38.00x | 45.87 | 0.00 | ✅ |
| xwlazy | repeated_imports | 0.00 | 0.00x | 45.88 | 0.00 | ❌ |
| xwlazy | memory_pressure | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| xwlazy 👑 | mixed_import_patterns | 6.38 | 3.89x | 47.97 | 0.00 | ✅ |

#### Detailed Results

##### xwlazy 👑

**Test:** concurrent_imports 👑

- Import Time: 100.83 ms
- Relative Time: 61.51x (vs baseline)
- Memory Peak: 44.29 MB
- Memory Avg: 44.06 MB
- Package Size: 0.00 MB

**Test:** rapid_sequential_imports

- ❌ Error: module 'collections' has no attribute 'abc'

**Test:** circular_imports 👑

- Import Time: 10.44 ms
- Relative Time: 6.37x (vs baseline)
- Memory Peak: 45.85 MB
- Memory Avg: 45.84 MB
- Package Size: 0.00 MB

**Test:** deep_dependency_chains 👑

- Import Time: 62.30 ms
- Relative Time: 38.00x (vs baseline)
- Memory Peak: 45.87 MB
- Memory Avg: 45.86 MB
- Package Size: 0.00 MB

**Test:** repeated_imports

- ❌ Error: Consistency: 66.43%

**Test:** memory_pressure

- ❌ Error: module 'collections' has no attribute 'abc'

**Test:** mixed_import_patterns 👑

- Import Time: 6.38 ms
- Relative Time: 3.89x (vs baseline)
- Memory Peak: 47.97 MB
- Memory Avg: 47.91 MB
- Package Size: 0.00 MB



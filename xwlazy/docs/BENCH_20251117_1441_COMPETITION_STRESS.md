# Competition Benchmark Report

**Generated:** 2025-11-17T14:41:56.115736

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
| 1 👑 | xwlazy | 145.25 | 151.34x |

##### Heavy Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 👑 | xwlazy | 53.90 | 56.15x |

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 👑 | xwlazy | 3.65 | 3.81x |

##### Medium Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 👑 | xwlazy | 17.36 | 18.09x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| xwlazy 👑 | light_load | 3.65 | 3.81x | 27.85 | 0.00 | ✅ |
| xwlazy 👑 | medium_load | 17.36 | 18.09x | 31.22 | 0.00 | ✅ |
| xwlazy 👑 | heavy_load | 53.90 | 56.15x | 34.79 | 0.00 | ✅ |
| xwlazy 👑 | enterprise_load | 145.25 | 151.34x | 43.98 | 0.00 | ✅ |

#### Detailed Results

##### xwlazy 👑

**Test:** light_load 👑

- Import Time: 3.65 ms
- Relative Time: 3.81x (vs baseline)
- Memory Peak: 27.85 MB
- Memory Avg: 27.85 MB
- Package Size: 0.00 MB
- Features: lazy_import, per_package_isolation, caching

**Test:** medium_load 👑

- Import Time: 17.36 ms
- Relative Time: 18.09x (vs baseline)
- Memory Peak: 31.22 MB
- Memory Avg: 29.56 MB
- Package Size: 0.00 MB
- Features: lazy_import, per_package_isolation, caching

**Test:** heavy_load 👑

- Import Time: 53.90 ms
- Relative Time: 56.15x (vs baseline)
- Memory Peak: 34.79 MB
- Memory Avg: 33.01 MB
- Package Size: 0.00 MB
- Features: lazy_import, per_package_isolation, caching

**Test:** enterprise_load 👑

- Import Time: 145.25 ms
- Relative Time: 151.34x (vs baseline)
- Memory Peak: 43.98 MB
- Memory Avg: 39.39 MB
- Package Size: 0.00 MB
- Features: lazy_import, per_package_isolation, caching


## Stress Tests

### Basic Lazy Import

*Basic lazy import (fair comparison - all libraries)*

#### Top 3 Rankings by Load Test

##### Circular Imports

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 👑 | xwlazy | 15.47 | 16.12x |

##### Concurrent Imports

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 👑 | xwlazy | 103.59 | 107.93x |

##### Deep Dependency Chains

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 👑 | xwlazy | 58.47 | 60.92x |

##### Mixed Import Patterns

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 👑 | xwlazy | 1.15 | 1.20x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| xwlazy 👑 | concurrent_imports | 103.59 | 107.93x | 44.54 | 0.00 | ✅ |
| xwlazy | rapid_sequential_imports | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| xwlazy 👑 | circular_imports | 15.47 | 16.12x | 51.73 | 0.00 | ✅ |
| xwlazy 👑 | deep_dependency_chains | 58.47 | 60.92x | 51.78 | 0.00 | ✅ |
| xwlazy | repeated_imports | 0.00 | 0.00x | 51.79 | 0.00 | ❌ |
| xwlazy | memory_pressure | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| xwlazy 👑 | mixed_import_patterns | 1.15 | 1.20x | 53.32 | 0.00 | ✅ |

#### Detailed Results

##### xwlazy 👑

**Test:** concurrent_imports 👑

- Import Time: 103.59 ms
- Relative Time: 107.93x (vs baseline)
- Memory Peak: 44.54 MB
- Memory Avg: 44.26 MB
- Package Size: 0.00 MB

**Test:** rapid_sequential_imports

- ❌ Error: name 'base_events' is not defined

**Test:** circular_imports 👑

- Import Time: 15.47 ms
- Relative Time: 16.12x (vs baseline)
- Memory Peak: 51.73 MB
- Memory Avg: 51.72 MB
- Package Size: 0.00 MB

**Test:** deep_dependency_chains 👑

- Import Time: 58.47 ms
- Relative Time: 60.92x (vs baseline)
- Memory Peak: 51.78 MB
- Memory Avg: 51.76 MB
- Package Size: 0.00 MB

**Test:** repeated_imports

- ❌ Error: Consistency: 65.43%

**Test:** memory_pressure

- ❌ Error: name 'base_events' is not defined

**Test:** mixed_import_patterns 👑

- Import Time: 1.15 ms
- Relative Time: 1.20x (vs baseline)
- Memory Peak: 53.32 MB
- Memory Avg: 53.31 MB
- Package Size: 0.00 MB



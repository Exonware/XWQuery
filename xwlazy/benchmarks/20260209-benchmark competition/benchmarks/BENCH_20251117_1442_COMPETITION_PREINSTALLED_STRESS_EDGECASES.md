# Competition Benchmark Report

**Generated:** 2025-11-17T14:42:12.975081

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

### Basic Lazy Import

*Basic lazy import (fair comparison - all libraries)*

#### Top 3 Rankings by Load Test

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 👑 | xwlazy | 1.43 | 1.35x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| xwlazy 👑 | light_load | 1.43 | 1.35x | 27.96 | 0.00 | ✅ |

#### Detailed Results

##### xwlazy 👑

**Test:** light_load 👑

- Import Time: 1.43 ms
- Relative Time: 1.35x (vs baseline)
- Memory Peak: 27.96 MB
- Memory Avg: 27.93 MB
- Package Size: 0.00 MB
- Features: lazy_import, per_package_isolation, caching


## Stress Tests

### Basic Lazy Import

*Basic lazy import (fair comparison - all libraries)*

#### Top 3 Rankings by Load Test

##### Circular Imports

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 👑 | xwlazy | 9.64 | 9.11x |

##### Concurrent Imports

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 👑 | xwlazy | 85.03 | 80.33x |

##### Deep Dependency Chains

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 👑 | xwlazy | 51.56 | 48.71x |

##### Mixed Import Patterns

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 👑 | xwlazy | 1.02 | 0.96x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| xwlazy 👑 | concurrent_imports | 85.03 | 80.33x | 30.36 | 0.00 | ✅ |
| xwlazy | rapid_sequential_imports | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| xwlazy 👑 | circular_imports | 9.64 | 9.11x | 43.23 | 0.00 | ✅ |
| xwlazy 👑 | deep_dependency_chains | 51.56 | 48.71x | 43.29 | 0.00 | ✅ |
| xwlazy | repeated_imports | 0.00 | 0.00x | 43.29 | 0.00 | ❌ |
| xwlazy | memory_pressure | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| xwlazy 👑 | mixed_import_patterns | 1.02 | 0.96x | 45.52 | 0.00 | ✅ |

#### Detailed Results

##### xwlazy 👑

**Test:** concurrent_imports 👑

- Import Time: 85.03 ms
- Relative Time: 80.33x (vs baseline)
- Memory Peak: 30.36 MB
- Memory Avg: 30.09 MB
- Package Size: 0.00 MB

**Test:** rapid_sequential_imports

- ❌ Error: name 'base_events' is not defined

**Test:** circular_imports 👑

- Import Time: 9.64 ms
- Relative Time: 9.11x (vs baseline)
- Memory Peak: 43.23 MB
- Memory Avg: 43.22 MB
- Package Size: 0.00 MB

**Test:** deep_dependency_chains 👑

- Import Time: 51.56 ms
- Relative Time: 48.71x (vs baseline)
- Memory Peak: 43.29 MB
- Memory Avg: 43.27 MB
- Package Size: 0.00 MB

**Test:** repeated_imports

- ❌ Error: Consistency: 86.81%

**Test:** memory_pressure

- ❌ Error: name 'base_events' is not defined

**Test:** mixed_import_patterns 👑

- Import Time: 1.02 ms
- Relative Time: 0.96x (vs baseline)
- Memory Peak: 45.52 MB
- Memory Avg: 45.52 MB
- Package Size: 0.00 MB


## Edge Cases

### Basic Lazy Import

*Basic lazy import (fair comparison - all libraries)*

#### Top 3 Rankings by Load Test

##### Already Loaded Modules

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 👑 | xwlazy | 0.00 | 1.00x |

##### Hook Interference

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 👑 | xwlazy | 1.02 | 0.96x |

##### Import Error Recovery

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 👑 | xwlazy | 0.00 | 0.00x |

##### Import From String

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 👑 | xwlazy | 0.00 | 0.00x |

##### Invalid Module Names

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 👑 | xwlazy | 0.00 | 1.00x |

##### Missing Dependencies

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 👑 | xwlazy | 0.00 | 1.00x |

##### Module Cleanup

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 👑 | xwlazy | 2.34 | 2.21x |

##### Namespace Packages

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 👑 | xwlazy | 0.00 | 0.00x |

##### Submodule Imports

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 👑 | xwlazy | 4.20 | 1.00x |

##### Thread Safety

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 👑 | xwlazy | 0.00 | 1.00x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| xwlazy 👑 | missing_dependencies | 0.00 | 1.00x | 0.00 | 0.00 | ✅ |
| xwlazy 👑 | invalid_module_names | 0.00 | 1.00x | 0.00 | 0.00 | ✅ |
| xwlazy 👑 | already_loaded_modules | 0.00 | 1.00x | 0.00 | 0.00 | ✅ |
| xwlazy 👑 | submodule_imports | 4.20 | 1.00x | 45.70 | 0.00 | ✅ |
| xwlazy 👑 | hook_interference | 1.02 | 0.96x | 0.00 | 0.00 | ✅ |
| xwlazy 👑 | module_cleanup | 2.34 | 2.21x | 0.00 | 0.00 | ✅ |
| xwlazy 👑 | thread_safety | 0.00 | 1.00x | 0.00 | 0.00 | ✅ |
| xwlazy 👑 | import_error_recovery | 0.00 | 0.00x | 0.00 | 0.00 | ✅ |
| xwlazy 👑 | namespace_packages | 0.00 | 0.00x | 0.00 | 0.00 | ✅ |
| xwlazy 👑 | import_from_string | 0.00 | 0.00x | 0.00 | 0.00 | ✅ |

#### Detailed Results

##### xwlazy 👑

**Test:** missing_dependencies 👑

- Import Time: 0.00 ms
- Relative Time: 1.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** invalid_module_names 👑

- Import Time: 0.00 ms
- Relative Time: 1.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** already_loaded_modules 👑

- Import Time: 0.00 ms
- Relative Time: 1.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** submodule_imports 👑

- Import Time: 4.20 ms
- Relative Time: 1.00x (vs baseline)
- Memory Peak: 45.70 MB
- Memory Avg: 45.62 MB
- Package Size: 0.00 MB

**Test:** hook_interference 👑

- Import Time: 1.02 ms
- Relative Time: 0.96x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** module_cleanup 👑

- Import Time: 2.34 ms
- Relative Time: 2.21x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** thread_safety 👑

- Import Time: 0.00 ms
- Relative Time: 1.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** import_error_recovery 👑

- Import Time: 0.00 ms
- Relative Time: 0.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** namespace_packages 👑

- Import Time: 0.00 ms
- Relative Time: 0.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** import_from_string 👑

- Import Time: 0.00 ms
- Relative Time: 0.00x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB



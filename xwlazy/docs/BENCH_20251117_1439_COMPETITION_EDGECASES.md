# Competition Benchmark Report

**Generated:** 2025-11-17T14:39:57.520877

## Benchmark Scenarios

### Edge Cases

**Description:** Invalid inputs, missing dependencies, error conditions.

**Why:** Tests robustness and error handling quality.


## Standard Tests

### Basic Lazy Import

*Basic lazy import (fair comparison - all libraries)*

#### Top 3 Rankings by Load Test

##### Enterprise Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 👑 | xwlazy | 140.56 | 119.82x |

##### Heavy Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 👑 | xwlazy | 62.68 | 53.43x |

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 👑 | xwlazy | 3.40 | 2.90x |

##### Medium Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 👑 | xwlazy | 15.39 | 13.12x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| xwlazy 👑 | light_load | 3.40 | 2.90x | 27.68 | 0.00 | ✅ |
| xwlazy 👑 | medium_load | 15.39 | 13.12x | 30.92 | 0.00 | ✅ |
| xwlazy 👑 | heavy_load | 62.68 | 53.43x | 34.62 | 0.00 | ✅ |
| xwlazy 👑 | enterprise_load | 140.56 | 119.82x | 43.88 | 0.00 | ✅ |

#### Detailed Results

##### xwlazy 👑

**Test:** light_load 👑

- Import Time: 3.40 ms
- Relative Time: 2.90x (vs baseline)
- Memory Peak: 27.68 MB
- Memory Avg: 27.68 MB
- Package Size: 0.00 MB
- Features: lazy_import, per_package_isolation, caching

**Test:** medium_load 👑

- Import Time: 15.39 ms
- Relative Time: 13.12x (vs baseline)
- Memory Peak: 30.92 MB
- Memory Avg: 29.32 MB
- Package Size: 0.00 MB
- Features: lazy_import, per_package_isolation, caching

**Test:** heavy_load 👑

- Import Time: 62.68 ms
- Relative Time: 53.43x (vs baseline)
- Memory Peak: 34.62 MB
- Memory Avg: 32.77 MB
- Package Size: 0.00 MB
- Features: lazy_import, per_package_isolation, caching

**Test:** enterprise_load 👑

- Import Time: 140.56 ms
- Relative Time: 119.82x (vs baseline)
- Memory Peak: 43.88 MB
- Memory Avg: 39.25 MB
- Package Size: 0.00 MB
- Features: lazy_import, per_package_isolation, caching


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
| 1 👑 | xwlazy | 2.05 | 1.75x |

##### Import Error Recovery

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 👑 | xwlazy | 0.01 | 0.00x |

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
| 1 👑 | xwlazy | 1.84 | 1.57x |

##### Namespace Packages

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 👑 | xwlazy | 0.00 | 0.00x |

##### Submodule Imports

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 👑 | xwlazy | 8.41 | 1.00x |

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
| xwlazy 👑 | submodule_imports | 8.41 | 1.00x | 44.05 | 0.00 | ✅ |
| xwlazy 👑 | hook_interference | 2.05 | 1.75x | 0.00 | 0.00 | ✅ |
| xwlazy 👑 | module_cleanup | 1.84 | 1.57x | 0.00 | 0.00 | ✅ |
| xwlazy 👑 | thread_safety | 0.00 | 1.00x | 0.00 | 0.00 | ✅ |
| xwlazy 👑 | import_error_recovery | 0.01 | 0.00x | 0.00 | 0.00 | ✅ |
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

- Import Time: 8.41 ms
- Relative Time: 1.00x (vs baseline)
- Memory Peak: 44.05 MB
- Memory Avg: 43.97 MB
- Package Size: 0.00 MB

**Test:** hook_interference 👑

- Import Time: 2.05 ms
- Relative Time: 1.75x (vs baseline)
- Memory Peak: 0.00 MB
- Memory Avg: 0.00 MB
- Package Size: 0.00 MB

**Test:** module_cleanup 👑

- Import Time: 1.84 ms
- Relative Time: 1.57x (vs baseline)
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

- Import Time: 0.01 ms
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



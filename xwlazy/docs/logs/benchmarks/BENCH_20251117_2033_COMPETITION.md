# Competition Benchmark Report

**Generated:** 2025-11-17T20:33:57.390888

## Standard Tests

### Auto Mode

*Smart install + auto-uninstall large - AUTO mode*

#### Top 3 Rankings by Load Test

##### Enterprise Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 24.41 | 91.00x |

##### Heavy Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 8.29 | 30.92x |

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 0.61 | 2.28x |

##### Medium Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 3.17 | 11.83x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| xwlazy 🥇 | light_load | 0.61 | 2.28x | 86.33 | 0.00 | ✅ |
| xwlazy 🥇 | medium_load | 3.17 | 11.83x | 87.27 | 0.00 | ✅ |
| xwlazy 🥇 | heavy_load | 8.29 | 30.92x | 89.16 | 0.00 | ✅ |
| xwlazy 🥇 | enterprise_load | 24.41 | 91.00x | 91.30 | 0.00 | ✅ |

#### Detailed Results

##### xwlazy 🥇

**Test:** light_load 🥇

- Import Time: 0.61 ms
- Relative Time: 2.28x (vs baseline)
- Memory Peak: 86.33 MB
- Memory Avg: 86.32 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_install, on_demand_install, per_package_isolation, caching, async_operations

**Test:** medium_load 🥇

- Import Time: 3.17 ms
- Relative Time: 11.83x (vs baseline)
- Memory Peak: 87.27 MB
- Memory Avg: 86.80 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_install, on_demand_install, per_package_isolation, caching, async_operations

**Test:** heavy_load 🥇

- Import Time: 8.29 ms
- Relative Time: 30.92x (vs baseline)
- Memory Peak: 89.16 MB
- Memory Avg: 88.26 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_install, on_demand_install, per_package_isolation, caching, async_operations

**Test:** enterprise_load 🥇

- Import Time: 24.41 ms
- Relative Time: 91.00x (vs baseline)
- Memory Peak: 91.30 MB
- Memory Avg: 90.31 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_install, on_demand_install, per_package_isolation, caching, async_operations


### Clean Mode

*Install on usage + uninstall after - CLEAN mode*

#### Top 3 Rankings by Load Test

##### Enterprise Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 24.45 | 91.17x |

##### Heavy Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 9.29 | 34.65x |

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 0.55 | 2.04x |

##### Medium Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 2.53 | 9.42x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| xwlazy 🥇 | light_load | 0.55 | 2.04x | 75.49 | 0.00 | ✅ |
| xwlazy 🥇 | medium_load | 2.53 | 9.42x | 76.84 | 0.00 | ✅ |
| xwlazy 🥇 | heavy_load | 9.29 | 34.65x | 78.95 | 0.00 | ✅ |
| xwlazy 🥇 | enterprise_load | 24.45 | 91.17x | 86.11 | 0.00 | ✅ |

#### Detailed Results

##### xwlazy 🥇

**Test:** light_load 🥇

- Import Time: 0.55 ms
- Relative Time: 2.04x (vs baseline)
- Memory Peak: 75.49 MB
- Memory Avg: 75.48 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_install, auto_uninstall, per_package_isolation, caching, async_operations

**Test:** medium_load 🥇

- Import Time: 2.53 ms
- Relative Time: 9.42x (vs baseline)
- Memory Peak: 76.84 MB
- Memory Avg: 76.16 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_install, auto_uninstall, per_package_isolation, caching, async_operations

**Test:** heavy_load 🥇

- Import Time: 9.29 ms
- Relative Time: 34.65x (vs baseline)
- Memory Peak: 78.95 MB
- Memory Avg: 77.94 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_install, auto_uninstall, per_package_isolation, caching, async_operations

**Test:** enterprise_load 🥇

- Import Time: 24.45 ms
- Relative Time: 91.17x (vs baseline)
- Memory Peak: 86.11 MB
- Memory Avg: 82.61 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_install, auto_uninstall, per_package_isolation, caching, async_operations


### Full Features

*All features enabled (xwlazy showcase) - AUTO mode with optimizations*

#### Top 3 Rankings by Load Test

##### Enterprise Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 23.69 | 88.35x |

##### Heavy Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 8.50 | 31.68x |

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 0.53 | 1.96x |

##### Medium Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 2.62 | 9.77x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| xwlazy 🥇 | light_load | 0.53 | 1.96x | 91.37 | 0.00 | ✅ |
| xwlazy 🥇 | medium_load | 2.62 | 9.77x | 91.37 | 0.00 | ✅ |
| xwlazy 🥇 | heavy_load | 8.50 | 31.68x | 91.38 | 0.00 | ✅ |
| xwlazy 🥇 | enterprise_load | 23.69 | 88.35x | 96.50 | 0.00 | ✅ |

#### Detailed Results

##### xwlazy 🥇

**Test:** light_load 🥇

- Import Time: 0.53 ms
- Relative Time: 1.96x (vs baseline)
- Memory Peak: 91.37 MB
- Memory Avg: 91.37 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_install, on_demand_install, per_package_isolation, caching, async_operations

**Test:** medium_load 🥇

- Import Time: 2.62 ms
- Relative Time: 9.77x (vs baseline)
- Memory Peak: 91.37 MB
- Memory Avg: 91.37 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_install, on_demand_install, per_package_isolation, caching, async_operations

**Test:** heavy_load 🥇

- Import Time: 8.50 ms
- Relative Time: 31.68x (vs baseline)
- Memory Peak: 91.38 MB
- Memory Avg: 91.37 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_install, on_demand_install, per_package_isolation, caching, async_operations

**Test:** enterprise_load 🥇

- Import Time: 23.69 ms
- Relative Time: 88.35x (vs baseline)
- Memory Peak: 96.50 MB
- Memory Avg: 93.94 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_install, on_demand_install, per_package_isolation, caching, async_operations


### Full Install Mode

*Install all dependencies on start - FULL mode*

#### Top 3 Rankings by Load Test

##### Enterprise Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 25.69 | 95.78x |

##### Heavy Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 9.36 | 34.91x |

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 0.60 | 2.24x |

##### Medium Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 3.85 | 14.36x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| xwlazy 🥇 | light_load | 0.60 | 2.24x | 71.57 | 0.00 | ✅ |
| xwlazy 🥇 | medium_load | 3.85 | 14.36x | 72.57 | 0.00 | ✅ |
| xwlazy 🥇 | heavy_load | 9.36 | 34.91x | 72.80 | 0.00 | ✅ |
| xwlazy 🥇 | enterprise_load | 25.69 | 95.78x | 75.40 | 0.00 | ✅ |

#### Detailed Results

##### xwlazy 🥇

**Test:** light_load 🥇

- Import Time: 0.60 ms
- Relative Time: 2.24x (vs baseline)
- Memory Peak: 71.57 MB
- Memory Avg: 71.57 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_install, batch_install, per_package_isolation, caching, async_operations

**Test:** medium_load 🥇

- Import Time: 3.85 ms
- Relative Time: 14.36x (vs baseline)
- Memory Peak: 72.57 MB
- Memory Avg: 72.07 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_install, batch_install, per_package_isolation, caching, async_operations

**Test:** heavy_load 🥇

- Import Time: 9.36 ms
- Relative Time: 34.91x (vs baseline)
- Memory Peak: 72.80 MB
- Memory Avg: 72.76 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_install, batch_install, per_package_isolation, caching, async_operations

**Test:** enterprise_load 🥇

- Import Time: 25.69 ms
- Relative Time: 95.78x (vs baseline)
- Memory Peak: 75.40 MB
- Memory Avg: 74.16 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_install, batch_install, per_package_isolation, caching, async_operations


### Background Loading

*Background loading - BACKGROUND mode*

#### Top 3 Rankings by Load Test

##### Enterprise Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 27.51 | 102.56x |

##### Heavy Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 8.99 | 33.52x |

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 0.45 | 1.69x |

##### Medium Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 3.49 | 12.99x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| xwlazy 🥇 | light_load | 0.45 | 1.69x | 62.77 | 0.00 | ✅ |
| xwlazy 🥇 | medium_load | 3.49 | 12.99x | 64.11 | 0.00 | ✅ |
| xwlazy 🥇 | heavy_load | 8.99 | 33.52x | 65.96 | 0.00 | ✅ |
| xwlazy 🥇 | enterprise_load | 27.51 | 102.56x | 71.43 | 0.00 | ✅ |

#### Detailed Results

##### xwlazy 🥇

**Test:** light_load 🥇

- Import Time: 0.45 ms
- Relative Time: 1.69x (vs baseline)
- Memory Peak: 62.77 MB
- Memory Avg: 62.76 MB
- Package Size: 0.00 MB
- Features: lazy_import, background_loading, per_package_isolation, caching, async_operations

**Test:** medium_load 🥇

- Import Time: 3.49 ms
- Relative Time: 12.99x (vs baseline)
- Memory Peak: 64.11 MB
- Memory Avg: 63.45 MB
- Package Size: 0.00 MB
- Features: lazy_import, background_loading, per_package_isolation, caching, async_operations

**Test:** heavy_load 🥇

- Import Time: 8.99 ms
- Relative Time: 33.52x (vs baseline)
- Memory Peak: 65.96 MB
- Memory Avg: 65.04 MB
- Package Size: 0.00 MB
- Features: lazy_import, background_loading, per_package_isolation, caching, async_operations

**Test:** enterprise_load 🥇

- Import Time: 27.51 ms
- Relative Time: 102.56x (vs baseline)
- Memory Peak: 71.43 MB
- Memory Avg: 68.74 MB
- Package Size: 0.00 MB
- Features: lazy_import, background_loading, per_package_isolation, caching, async_operations


### Lazy Import + Install

*Lazy import + auto-install - SMART mode (on-demand)*

#### Top 3 Rankings by Load Test

##### Enterprise Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 25.63 | 95.57x |

##### Heavy Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 8.65 | 32.25x |

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 0.58 | 2.18x |

##### Medium Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 3.23 | 12.04x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| xwlazy 🥇 | light_load | 0.58 | 2.18x | 45.77 | 0.00 | ✅ |
| xwlazy 🥇 | medium_load | 3.23 | 12.04x | 46.36 | 0.00 | ✅ |
| xwlazy 🥇 | heavy_load | 8.65 | 32.25x | 48.91 | 0.00 | ✅ |
| xwlazy 🥇 | enterprise_load | 25.63 | 95.57x | 53.96 | 0.00 | ✅ |

#### Detailed Results

##### xwlazy 🥇

**Test:** light_load 🥇

- Import Time: 0.58 ms
- Relative Time: 2.18x (vs baseline)
- Memory Peak: 45.77 MB
- Memory Avg: 45.76 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_install, on_demand_install, per_package_isolation, caching, async_operations

**Test:** medium_load 🥇

- Import Time: 3.23 ms
- Relative Time: 12.04x (vs baseline)
- Memory Peak: 46.36 MB
- Memory Avg: 46.06 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_install, on_demand_install, per_package_isolation, caching, async_operations

**Test:** heavy_load 🥇

- Import Time: 8.65 ms
- Relative Time: 32.25x (vs baseline)
- Memory Peak: 48.91 MB
- Memory Avg: 47.70 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_install, on_demand_install, per_package_isolation, caching, async_operations

**Test:** enterprise_load 🥇

- Import Time: 25.63 ms
- Relative Time: 95.57x (vs baseline)
- Memory Peak: 53.96 MB
- Memory Avg: 51.43 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_install, on_demand_install, per_package_isolation, caching, async_operations


### Basic Lazy Import

*Basic lazy import (fair comparison - all libraries) - LITE mode*

#### Top 3 Rankings by Load Test

##### Enterprise Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 26.30 | 98.05x |

##### Heavy Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 11.48 | 42.79x |

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 0.48 | 1.78x |

##### Medium Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 3.13 | 11.66x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| xwlazy 🥇 | light_load | 0.48 | 1.78x | 27.96 | 0.00 | ✅ |
| xwlazy 🥇 | medium_load | 3.13 | 11.66x | 35.58 | 0.00 | ✅ |
| xwlazy 🥇 | heavy_load | 11.48 | 42.79x | 38.67 | 0.00 | ✅ |
| xwlazy 🥇 | enterprise_load | 26.30 | 98.05x | 45.64 | 0.00 | ✅ |

#### Detailed Results

##### xwlazy 🥇

**Test:** light_load 🥇

- Import Time: 0.48 ms
- Relative Time: 1.78x (vs baseline)
- Memory Peak: 27.96 MB
- Memory Avg: 27.96 MB
- Package Size: 0.00 MB
- Features: lazy_import, per_package_isolation, caching, async_operations

**Test:** medium_load 🥇

- Import Time: 3.13 ms
- Relative Time: 11.66x (vs baseline)
- Memory Peak: 35.58 MB
- Memory Avg: 34.93 MB
- Package Size: 0.00 MB
- Features: lazy_import, per_package_isolation, caching, async_operations

**Test:** heavy_load 🥇

- Import Time: 11.48 ms
- Relative Time: 42.79x (vs baseline)
- Memory Peak: 38.67 MB
- Memory Avg: 37.21 MB
- Package Size: 0.00 MB
- Features: lazy_import, per_package_isolation, caching, async_operations

**Test:** enterprise_load 🥇

- Import Time: 26.30 ms
- Relative Time: 98.05x (vs baseline)
- Memory Peak: 45.64 MB
- Memory Avg: 42.27 MB
- Package Size: 0.00 MB
- Features: lazy_import, per_package_isolation, caching, async_operations


### Preload Mode

*Preload all modules on start - PRELOAD mode*

#### Top 3 Rankings by Load Test

##### Enterprise Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 27.82 | 103.74x |

##### Heavy Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 9.83 | 36.67x |

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 0.66 | 2.45x |

##### Medium Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 5.78 | 21.55x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| xwlazy 🥇 | light_load | 0.66 | 2.45x | 54.14 | 0.00 | ✅ |
| xwlazy 🥇 | medium_load | 5.78 | 21.55x | 55.57 | 0.00 | ✅ |
| xwlazy 🥇 | heavy_load | 9.83 | 36.67x | 57.46 | 0.00 | ✅ |
| xwlazy 🥇 | enterprise_load | 27.82 | 103.74x | 62.66 | 0.00 | ✅ |

#### Detailed Results

##### xwlazy 🥇

**Test:** light_load 🥇

- Import Time: 0.66 ms
- Relative Time: 2.45x (vs baseline)
- Memory Peak: 54.14 MB
- Memory Avg: 54.14 MB
- Package Size: 0.00 MB
- Features: lazy_import, preload_mode, per_package_isolation, caching, async_operations

**Test:** medium_load 🥇

- Import Time: 5.78 ms
- Relative Time: 21.55x (vs baseline)
- Memory Peak: 55.57 MB
- Memory Avg: 54.86 MB
- Package Size: 0.00 MB
- Features: lazy_import, preload_mode, per_package_isolation, caching, async_operations

**Test:** heavy_load 🥇

- Import Time: 9.83 ms
- Relative Time: 36.67x (vs baseline)
- Memory Peak: 57.46 MB
- Memory Avg: 56.61 MB
- Package Size: 0.00 MB
- Features: lazy_import, preload_mode, per_package_isolation, caching, async_operations

**Test:** enterprise_load 🥇

- Import Time: 27.82 ms
- Relative Time: 103.74x (vs baseline)
- Memory Peak: 62.66 MB
- Memory Avg: 60.17 MB
- Package Size: 0.00 MB
- Features: lazy_import, preload_mode, per_package_isolation, caching, async_operations


## Overall Winner 👑

**xwlazy 👑** wins with **32 first place victory(ies)** across all test categories!

### Winner Summary

| Library | First Place Wins |
|---------|------------------|
| xwlazy 👑 | 32 |


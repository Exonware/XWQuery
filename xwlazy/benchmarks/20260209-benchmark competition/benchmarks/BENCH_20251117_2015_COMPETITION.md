# Competition Benchmark Report

**Generated:** 2025-11-17T20:15:22.195365

## Standard Tests

### Auto Mode

*Smart install + auto-uninstall large - AUTO mode*

#### Top 3 Rankings by Load Test

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 0.80 | 3.10x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| xwlazy 🥇 | light_load | 0.80 | 3.10x | 34.53 | 0.00 | ✅ |

#### Detailed Results

##### xwlazy 🥇

**Test:** light_load 🥇

- Import Time: 0.80 ms
- Relative Time: 3.10x (vs baseline)
- Memory Peak: 34.53 MB
- Memory Avg: 34.53 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_install, on_demand_install, per_package_isolation, caching, async_operations


### Clean Mode

*Install on usage + uninstall after - CLEAN mode*

#### Top 3 Rankings by Load Test

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 0.80 | 3.12x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| xwlazy 🥇 | light_load | 0.80 | 3.12x | 34.49 | 0.00 | ✅ |

#### Detailed Results

##### xwlazy 🥇

**Test:** light_load 🥇

- Import Time: 0.80 ms
- Relative Time: 3.12x (vs baseline)
- Memory Peak: 34.49 MB
- Memory Avg: 34.48 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_install, auto_uninstall, per_package_isolation, caching, async_operations


### Full Features

*All features enabled (xwlazy showcase) - AUTO mode with optimizations*

#### Top 3 Rankings by Load Test

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 0.65 | 2.54x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| xwlazy 🥇 | light_load | 0.65 | 2.54x | 34.65 | 0.00 | ✅ |

#### Detailed Results

##### xwlazy 🥇

**Test:** light_load 🥇

- Import Time: 0.65 ms
- Relative Time: 2.54x (vs baseline)
- Memory Peak: 34.65 MB
- Memory Avg: 34.65 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_install, on_demand_install, per_package_isolation, caching, async_operations


### Full Install Mode

*Install all dependencies on start - FULL mode*

#### Top 3 Rankings by Load Test

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 0.61 | 2.38x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| xwlazy 🥇 | light_load | 0.61 | 2.38x | 34.44 | 0.00 | ✅ |

#### Detailed Results

##### xwlazy 🥇

**Test:** light_load 🥇

- Import Time: 0.61 ms
- Relative Time: 2.38x (vs baseline)
- Memory Peak: 34.44 MB
- Memory Avg: 34.44 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_install, batch_install, per_package_isolation, caching, async_operations


### Background Loading

*Background loading - BACKGROUND mode*

#### Top 3 Rankings by Load Test

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 0.51 | 1.96x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| xwlazy 🥇 | light_load | 0.51 | 1.96x | 34.40 | 0.00 | ✅ |

#### Detailed Results

##### xwlazy 🥇

**Test:** light_load 🥇

- Import Time: 0.51 ms
- Relative Time: 1.96x (vs baseline)
- Memory Peak: 34.40 MB
- Memory Avg: 34.39 MB
- Package Size: 0.00 MB
- Features: lazy_import, background_loading, per_package_isolation, caching, async_operations


### Lazy Import + Install

*Lazy import + auto-install - SMART mode (on-demand)*

#### Top 3 Rankings by Load Test

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 0.44 | 1.71x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| xwlazy 🥇 | light_load | 0.44 | 1.71x | 34.34 | 0.00 | ✅ |

#### Detailed Results

##### xwlazy 🥇

**Test:** light_load 🥇

- Import Time: 0.44 ms
- Relative Time: 1.71x (vs baseline)
- Memory Peak: 34.34 MB
- Memory Avg: 34.34 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_install, on_demand_install, per_package_isolation, caching, async_operations


### Basic Lazy Import

*Basic lazy import (fair comparison - all libraries) - LITE mode*

#### Top 3 Rankings by Load Test

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 0.48 | 1.88x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| xwlazy 🥇 | light_load | 0.48 | 1.88x | 27.93 | 0.00 | ✅ |

#### Detailed Results

##### xwlazy 🥇

**Test:** light_load 🥇

- Import Time: 0.48 ms
- Relative Time: 1.88x (vs baseline)
- Memory Peak: 27.93 MB
- Memory Avg: 27.93 MB
- Package Size: 0.00 MB
- Features: lazy_import, per_package_isolation, caching, async_operations


### Preload Mode

*Preload all modules on start - PRELOAD mode*

#### Top 3 Rankings by Load Test

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 0.77 | 2.97x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| xwlazy 🥇 | light_load | 0.77 | 2.97x | 34.36 | 0.00 | ✅ |

#### Detailed Results

##### xwlazy 🥇

**Test:** light_load 🥇

- Import Time: 0.77 ms
- Relative Time: 2.97x (vs baseline)
- Memory Peak: 34.36 MB
- Memory Avg: 34.36 MB
- Package Size: 0.00 MB
- Features: lazy_import, preload_mode, per_package_isolation, caching, async_operations


## Overall Winner 👑

**xwlazy 👑** wins with **8 first place victory(ies)** across all test categories!

### Winner Summary

| Library | First Place Wins |
|---------|------------------|
| xwlazy 👑 | 8 |


# Competition Benchmark Report

**Generated:** 2025-11-17T20:35:19.901293

## Standard Tests

### Auto Mode

*Smart install + auto-uninstall large - AUTO mode*

#### Top 3 Rankings by Load Test

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 0.49 | 1.36x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| xwlazy 🥇 | light_load | 0.49 | 1.36x | 34.61 | 0.00 | ✅ |

#### Detailed Results

##### xwlazy 🥇

**Test:** light_load 🥇

- Import Time: 0.49 ms
- Relative Time: 1.36x (vs baseline)
- Memory Peak: 34.61 MB
- Memory Avg: 34.61 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_install, on_demand_install, per_package_isolation, caching, async_operations


### Clean Mode

*Install on usage + uninstall after - CLEAN mode*

#### Top 3 Rankings by Load Test

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 0.84 | 2.31x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| xwlazy 🥇 | light_load | 0.84 | 2.31x | 34.57 | 0.00 | ✅ |

#### Detailed Results

##### xwlazy 🥇

**Test:** light_load 🥇

- Import Time: 0.84 ms
- Relative Time: 2.31x (vs baseline)
- Memory Peak: 34.57 MB
- Memory Avg: 34.57 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_install, auto_uninstall, per_package_isolation, caching, async_operations


### Full Features

*All features enabled (xwlazy showcase) - AUTO mode with optimizations*

#### Top 3 Rankings by Load Test

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 0.73 | 2.02x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| xwlazy 🥇 | light_load | 0.73 | 2.02x | 34.68 | 0.00 | ✅ |

#### Detailed Results

##### xwlazy 🥇

**Test:** light_load 🥇

- Import Time: 0.73 ms
- Relative Time: 2.02x (vs baseline)
- Memory Peak: 34.68 MB
- Memory Avg: 34.67 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_install, on_demand_install, per_package_isolation, caching, async_operations


### Full Install Mode

*Install all dependencies on start - FULL mode*

#### Top 3 Rankings by Load Test

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 0.62 | 1.70x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| xwlazy 🥇 | light_load | 0.62 | 1.70x | 34.52 | 0.00 | ✅ |

#### Detailed Results

##### xwlazy 🥇

**Test:** light_load 🥇

- Import Time: 0.62 ms
- Relative Time: 1.70x (vs baseline)
- Memory Peak: 34.52 MB
- Memory Avg: 34.52 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_install, batch_install, per_package_isolation, caching, async_operations


### Background Loading

*Background loading - BACKGROUND mode*

#### Top 3 Rankings by Load Test

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 0.66 | 1.81x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| xwlazy 🥇 | light_load | 0.66 | 1.81x | 34.48 | 0.00 | ✅ |

#### Detailed Results

##### xwlazy 🥇

**Test:** light_load 🥇

- Import Time: 0.66 ms
- Relative Time: 1.81x (vs baseline)
- Memory Peak: 34.48 MB
- Memory Avg: 34.48 MB
- Package Size: 0.00 MB
- Features: lazy_import, background_loading, per_package_isolation, caching, async_operations


### Lazy Import + Install

*Lazy import + auto-install - SMART mode (on-demand)*

#### Top 3 Rankings by Load Test

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 0.70 | 1.93x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| xwlazy 🥇 | light_load | 0.70 | 1.93x | 34.38 | 0.00 | ✅ |

#### Detailed Results

##### xwlazy 🥇

**Test:** light_load 🥇

- Import Time: 0.70 ms
- Relative Time: 1.93x (vs baseline)
- Memory Peak: 34.38 MB
- Memory Avg: 34.38 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_install, on_demand_install, per_package_isolation, caching, async_operations


### Basic Lazy Import

*Basic lazy import (fair comparison - all libraries) - LITE mode*

#### Top 3 Rankings by Load Test

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 1.03 | 2.85x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| xwlazy 🥇 | light_load | 1.03 | 2.85x | 27.97 | 0.00 | ✅ |

#### Detailed Results

##### xwlazy 🥇

**Test:** light_load 🥇

- Import Time: 1.03 ms
- Relative Time: 2.85x (vs baseline)
- Memory Peak: 27.97 MB
- Memory Avg: 27.97 MB
- Package Size: 0.00 MB
- Features: lazy_import, per_package_isolation, caching, async_operations


### Preload Mode

*Preload all modules on start - PRELOAD mode*

#### Top 3 Rankings by Load Test

##### Light Load

| Rank | Library | Time (ms) | Relative |
|------|---------|-----------|----------|
| 1 🥇 | xwlazy | 0.75 | 2.07x |

#### Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| xwlazy 🥇 | light_load | 0.75 | 2.07x | 34.44 | 0.00 | ✅ |

#### Detailed Results

##### xwlazy 🥇

**Test:** light_load 🥇

- Import Time: 0.75 ms
- Relative Time: 2.07x (vs baseline)
- Memory Peak: 34.44 MB
- Memory Avg: 34.44 MB
- Package Size: 0.00 MB
- Features: lazy_import, preload_mode, per_package_isolation, caching, async_operations


## Overall Winner 👑

**xwlazy 👑** wins with **8 first place victory(ies)** across all test categories!

### Winner Summary

| Library | First Place Wins |
|---------|------------------|
| xwlazy 👑 | 8 |


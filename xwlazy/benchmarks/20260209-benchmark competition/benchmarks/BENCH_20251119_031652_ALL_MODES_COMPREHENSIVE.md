# Comprehensive xwlazy Mode Benchmark Report

**Generated:** 2025-11-19T03:16:52.641596
**Total Combinations Tested:** 220

## Executive Summary

### Fastest Mode by Load Level

| Load Level | Fastest Mode | Load Mode | Install Mode | Time (ms) | Memory (MB) |
|------------|--------------|-----------|--------------|-----------|-------------|
| light_load | auto + smart | auto | smart | 0.706 | 44.65 |
| medium_load | hyperparallel + full | hyperparallel | full | 4.162 | 288.05 |
| heavy_load | preload + size_aware | preload | size_aware | 15.372 | 111.74 |
| enterprise_load | preload + full | preload | full | 40.041 | 98.04 |

### Overall Fastest Mode

- **Mode**: auto + smart
- **Load Level**: light_load
- **Time**: 0.706 ms
- **Memory**: 44.65 MB

## Detailed Results by Mode Combination

### Load Mode: AUTO

| Install Mode | Light Load | Medium Load | Heavy Load | Enterprise Load |
|-------------|------------|-------------|------------|-----------------|
| none | 1.33 ms<br/>31.3 MB | 5.89 ms<br/>32.3 MB | 18.16 ms<br/>34.9 MB | 46.01 ms<br/>44.5 MB |
| smart | 0.71 ms<br/>44.7 MB | 4.55 ms<br/>44.7 MB | 15.74 ms<br/>44.9 MB | 42.70 ms<br/>52.0 MB |
| full | 1.05 ms<br/>52.1 MB | 5.77 ms<br/>52.1 MB | 19.77 ms<br/>52.2 MB | 45.20 ms<br/>58.7 MB |
| clean | 0.89 ms<br/>58.9 MB | 4.87 ms<br/>58.9 MB | 18.06 ms<br/>59.0 MB | 42.38 ms<br/>65.0 MB |
| temporary | 1.05 ms<br/>65.2 MB | 5.81 ms<br/>65.2 MB | 17.42 ms<br/>65.2 MB | 52.33 ms<br/>72.0 MB |
| size_aware | 1.00 ms<br/>72.1 MB | 4.76 ms<br/>72.1 MB | 16.47 ms<br/>72.2 MB | 46.79 ms<br/>78.3 MB |

### Load Mode: PRELOAD

| Install Mode | Light Load | Medium Load | Heavy Load | Enterprise Load |
|-------------|------------|-------------|------------|-----------------|
| none | 1.07 ms<br/>78.5 MB | 6.18 ms<br/>78.5 MB | 19.08 ms<br/>78.6 MB | 42.82 ms<br/>84.9 MB |
| smart | 1.24 ms<br/>85.0 MB | 4.56 ms<br/>85.0 MB | 15.67 ms<br/>85.1 MB | 42.65 ms<br/>91.5 MB |
| full | 0.75 ms<br/>91.7 MB | 4.44 ms<br/>91.7 MB | 15.68 ms<br/>91.7 MB | 40.04 ms<br/>98.0 MB |
| clean | 0.78 ms<br/>98.1 MB | 5.45 ms<br/>98.1 MB | 16.05 ms<br/>98.1 MB | 41.21 ms<br/>104.7 MB |
| temporary | 0.89 ms<br/>104.8 MB | 4.88 ms<br/>104.8 MB | 15.58 ms<br/>104.8 MB | 42.45 ms<br/>111.6 MB |
| size_aware | 0.99 ms<br/>111.7 MB | 5.03 ms<br/>111.7 MB | 15.37 ms<br/>111.7 MB | 41.87 ms<br/>118.4 MB |

### Load Mode: BACKGROUND

| Install Mode | Light Load | Medium Load | Heavy Load | Enterprise Load |
|-------------|------------|-------------|------------|-----------------|
| none | 1.29 ms<br/>118.5 MB | 4.84 ms<br/>118.5 MB | 15.73 ms<br/>118.5 MB | 42.83 ms<br/>124.6 MB |
| smart | 1.05 ms<br/>124.7 MB | 4.99 ms<br/>124.7 MB | 16.84 ms<br/>124.8 MB | 41.84 ms<br/>131.7 MB |
| full | 1.07 ms<br/>131.8 MB | 4.80 ms<br/>131.8 MB | 16.57 ms<br/>131.8 MB | 41.86 ms<br/>138.1 MB |
| clean | 0.71 ms<br/>138.3 MB | 4.59 ms<br/>138.3 MB | 16.28 ms<br/>138.3 MB | 41.87 ms<br/>144.6 MB |
| temporary | 0.99 ms<br/>144.8 MB | 4.74 ms<br/>144.8 MB | 15.39 ms<br/>144.8 MB | 42.30 ms<br/>151.3 MB |
| size_aware | 0.73 ms<br/>151.5 MB | 5.78 ms<br/>151.5 MB | 16.33 ms<br/>151.6 MB | 43.01 ms<br/>157.8 MB |

### Load Mode: CACHED

| Install Mode | Light Load | Medium Load | Heavy Load | Enterprise Load |
|-------------|------------|-------------|------------|-----------------|
| none | 1.15 ms<br/>157.9 MB | 5.05 ms<br/>157.9 MB | 17.32 ms<br/>157.9 MB | 43.13 ms<br/>164.1 MB |
| smart | 1.15 ms<br/>164.1 MB | 4.90 ms<br/>164.1 MB | 15.87 ms<br/>164.3 MB | 41.45 ms<br/>170.5 MB |
| full | 0.99 ms<br/>170.6 MB | 4.69 ms<br/>170.6 MB | 16.39 ms<br/>170.7 MB | 42.07 ms<br/>177.5 MB |
| clean | 0.88 ms<br/>177.6 MB | 5.47 ms<br/>177.6 MB | 15.50 ms<br/>177.7 MB | 42.37 ms<br/>183.6 MB |
| temporary | 1.04 ms<br/>183.7 MB | 4.75 ms<br/>183.7 MB | 16.33 ms<br/>183.8 MB | 43.03 ms<br/>190.4 MB |
| size_aware | 1.36 ms<br/>190.6 MB | 5.73 ms<br/>190.6 MB | 16.11 ms<br/>191.1 MB | 42.12 ms<br/>198.1 MB |

### Load Mode: TURBO

| Install Mode | Light Load | Medium Load | Heavy Load | Enterprise Load |
|-------------|------------|-------------|------------|-----------------|
| none | 1.01 ms<br/>198.1 MB | 5.21 ms<br/>198.1 MB | 16.22 ms<br/>198.2 MB | 44.69 ms<br/>204.0 MB |
| smart | 1.19 ms<br/>204.1 MB | 4.57 ms<br/>204.1 MB | 17.16 ms<br/>204.1 MB | 42.70 ms<br/>210.1 MB |
| full | 1.03 ms<br/>210.3 MB | 5.28 ms<br/>210.3 MB | 16.39 ms<br/>210.3 MB | 43.06 ms<br/>217.2 MB |
| clean | 1.52 ms<br/>217.4 MB | 5.44 ms<br/>217.4 MB | 17.51 ms<br/>217.4 MB | 43.54 ms<br/>223.5 MB |
| temporary | 1.03 ms<br/>223.5 MB | 4.93 ms<br/>223.5 MB | 15.54 ms<br/>223.6 MB | 43.82 ms<br/>230.4 MB |
| size_aware | 1.05 ms<br/>230.5 MB | 5.35 ms<br/>230.5 MB | 35.26 ms<br/>230.6 MB | 44.73 ms<br/>236.6 MB |

### Load Mode: ADAPTIVE

| Install Mode | Light Load | Medium Load | Heavy Load | Enterprise Load |
|-------------|------------|-------------|------------|-----------------|
| none | 1.69 ms<br/>236.7 MB | 6.13 ms<br/>236.7 MB | 23.57 ms<br/>236.7 MB | 49.45 ms<br/>242.8 MB |
| smart | 1.01 ms<br/>243.0 MB | 5.19 ms<br/>243.0 MB | 16.46 ms<br/>243.1 MB | 48.67 ms<br/>249.0 MB |
| full | 0.97 ms<br/>249.1 MB | 4.92 ms<br/>249.1 MB | 20.10 ms<br/>249.1 MB | 44.74 ms<br/>256.3 MB |
| clean | 1.06 ms<br/>256.4 MB | 4.98 ms<br/>256.4 MB | 19.81 ms<br/>256.5 MB | 42.89 ms<br/>263.1 MB |
| temporary | 1.03 ms<br/>263.1 MB | 4.78 ms<br/>263.1 MB | 15.99 ms<br/>263.1 MB | 44.31 ms<br/>269.5 MB |
| size_aware | 1.06 ms<br/>269.7 MB | 4.69 ms<br/>269.7 MB | 16.69 ms<br/>269.7 MB | 42.90 ms<br/>275.9 MB |

### Load Mode: HYPERPARALLEL

| Install Mode | Light Load | Medium Load | Heavy Load | Enterprise Load |
|-------------|------------|-------------|------------|-----------------|
| none | 1.06 ms<br/>276.0 MB | 5.37 ms<br/>276.0 MB | 17.25 ms<br/>276.0 MB | 46.60 ms<br/>281.8 MB |
| smart | 1.24 ms<br/>281.9 MB | 5.23 ms<br/>281.9 MB | 15.72 ms<br/>282.0 MB | 55.07 ms<br/>288.0 MB |
| full | 0.85 ms<br/>288.1 MB | 4.16 ms<br/>288.1 MB | 16.18 ms<br/>288.1 MB | 43.01 ms<br/>294.2 MB |
| clean | 0.90 ms<br/>294.3 MB | 4.75 ms<br/>294.3 MB | 19.48 ms<br/>294.3 MB | 43.79 ms<br/>301.6 MB |
| temporary | 1.05 ms<br/>301.7 MB | 4.72 ms<br/>301.7 MB | 16.96 ms<br/>301.8 MB | 49.04 ms<br/>308.7 MB |
| size_aware | 1.04 ms<br/>308.8 MB | 4.96 ms<br/>308.8 MB | 18.86 ms<br/>308.8 MB | 41.56 ms<br/>315.0 MB |

### Load Mode: STREAMING

| Install Mode | Light Load | Medium Load | Heavy Load | Enterprise Load |
|-------------|------------|-------------|------------|-----------------|
| none | 0.90 ms<br/>315.1 MB | 5.37 ms<br/>315.1 MB | 16.97 ms<br/>315.2 MB | 42.41 ms<br/>321.2 MB |
| smart | 1.92 ms<br/>321.2 MB | 4.89 ms<br/>321.2 MB | 16.08 ms<br/>321.2 MB | 42.44 ms<br/>326.3 MB |
| full | 0.86 ms<br/>326.4 MB | 4.99 ms<br/>326.4 MB | 17.07 ms<br/>326.4 MB | 43.62 ms<br/>329.8 MB |
| clean | 0.74 ms<br/>329.8 MB | 4.79 ms<br/>329.9 MB | 17.17 ms<br/>330.0 MB | 44.37 ms<br/>333.2 MB |
| temporary | 0.75 ms<br/>333.3 MB | 4.83 ms<br/>333.3 MB | 16.09 ms<br/>333.3 MB | 43.70 ms<br/>336.7 MB |
| size_aware | 0.97 ms<br/>336.7 MB | 5.23 ms<br/>336.7 MB | 17.12 ms<br/>336.7 MB | 43.74 ms<br/>340.2 MB |

### Load Mode: ULTRA

| Install Mode | Light Load | Medium Load | Heavy Load | Enterprise Load |
|-------------|------------|-------------|------------|-----------------|
| none | 0.94 ms<br/>340.2 MB | 5.26 ms<br/>340.2 MB | 17.62 ms<br/>340.2 MB | 44.85 ms<br/>344.5 MB |
| smart | 1.05 ms<br/>344.6 MB | 5.00 ms<br/>344.6 MB | 16.32 ms<br/>344.6 MB | 42.96 ms<br/>348.8 MB |
| full | 0.76 ms<br/>348.8 MB | 5.08 ms<br/>348.8 MB | 16.37 ms<br/>348.8 MB | 42.05 ms<br/>352.2 MB |
| clean | 1.10 ms<br/>352.2 MB | 5.23 ms<br/>352.2 MB | 22.05 ms<br/>352.2 MB | 44.98 ms<br/>356.3 MB |
| temporary | 0.85 ms<br/>356.3 MB | 4.88 ms<br/>356.4 MB | 17.37 ms<br/>356.4 MB | 43.42 ms<br/>360.3 MB |
| size_aware | 0.77 ms<br/>360.3 MB | 4.94 ms<br/>360.3 MB | 16.61 ms<br/>360.3 MB | 43.43 ms<br/>364.5 MB |

## Results by Load Level

### Light Load

| Rank | Load Mode | Install Mode | Time (ms) | Memory (MB) | Relative |
|------|-----------|--------------|-----------|-------------|----------|
| 1 🥇 | auto | smart | 0.706 | 44.65 | 1.01x |
| 2 🥈 | background | clean | 0.715 | 138.27 | 1.02x |
| 3 🥉 | background | size_aware | 0.732 | 151.52 | 1.05x |
| 4  | streaming | clean | 0.739 | 329.80 | 1.06x |
| 5  | preload | full | 0.751 | 91.65 | 1.07x |
| 6  | streaming | temporary | 0.753 | 333.26 | 1.08x |
| 7  | ultra | full | 0.763 | 348.84 | 1.09x |
| 8  | ultra | size_aware | 0.773 | 360.32 | 1.10x |
| 9  | preload | clean | 0.780 | 98.05 | 1.11x |
| 10  | ultra | temporary | 0.846 | 356.34 | 1.21x |

### Medium Load

| Rank | Load Mode | Install Mode | Time (ms) | Memory (MB) | Relative |
|------|-----------|--------------|-----------|-------------|----------|
| 1 🥇 | hyperparallel | full | 4.162 | 288.05 | 5.95x |
| 2 🥈 | preload | full | 4.437 | 91.65 | 6.34x |
| 3 🥉 | auto | smart | 4.547 | 44.68 | 6.50x |
| 4  | preload | smart | 4.558 | 85.05 | 6.51x |
| 5  | turbo | smart | 4.569 | 204.12 | 6.53x |
| 6  | background | clean | 4.594 | 138.28 | 6.57x |
| 7  | adaptive | size_aware | 4.688 | 269.70 | 6.70x |
| 8  | cached | full | 4.691 | 170.63 | 6.70x |
| 9  | hyperparallel | temporary | 4.718 | 301.73 | 6.74x |
| 10  | background | temporary | 4.735 | 144.79 | 6.77x |

### Heavy Load

| Rank | Load Mode | Install Mode | Time (ms) | Memory (MB) | Relative |
|------|-----------|--------------|-----------|-------------|----------|
| 1 🥇 | preload | size_aware | 15.372 | 111.74 | 21.97x |
| 2 🥈 | background | temporary | 15.394 | 144.82 | 22.00x |
| 3 🥉 | cached | clean | 15.498 | 177.67 | 22.15x |
| 4  | turbo | temporary | 15.539 | 223.57 | 22.20x |
| 5  | preload | temporary | 15.584 | 104.77 | 22.27x |
| 6  | preload | smart | 15.675 | 85.14 | 22.40x |
| 7  | preload | full | 15.680 | 91.68 | 22.41x |
| 8  | hyperparallel | smart | 15.721 | 281.96 | 22.47x |
| 9  | background | none | 15.728 | 118.47 | 22.48x |
| 10  | auto | smart | 15.737 | 44.93 | 22.49x |

### Enterprise Load

| Rank | Load Mode | Install Mode | Time (ms) | Memory (MB) | Relative |
|------|-----------|--------------|-----------|-------------|----------|
| 1 🥇 | preload | full | 40.041 | 98.04 | 57.22x |
| 2 🥈 | preload | clean | 41.209 | 104.70 | 58.89x |
| 3 🥉 | cached | smart | 41.447 | 170.51 | 59.23x |
| 4  | hyperparallel | size_aware | 41.560 | 315.03 | 59.39x |
| 5  | background | smart | 41.839 | 131.67 | 59.79x |
| 6  | background | full | 41.856 | 138.06 | 59.81x |
| 7  | preload | size_aware | 41.866 | 118.44 | 59.83x |
| 8  | background | clean | 41.867 | 144.58 | 59.83x |
| 9  | ultra | full | 42.055 | 352.20 | 60.10x |
| 10  | cached | full | 42.066 | 177.54 | 60.11x |

## Old vs New xwlazy Comparison

### Performance Comparison

| Load Level | Old (ms) | New Best (ms) | Improvement |
|------------|----------|---------------|-------------|
| light_load | 1.163 | 0.706 | +39.3% |
| medium_load | 5.033 | 4.162 | +17.3% |
| heavy_load | 16.624 | 15.372 | +7.5% |
| enterprise_load | 45.317 | 40.041 | +11.6% |

## Statistics

- **Total Successful Tests**: 216
- **Average Time**: 16.851 ms
- **Min Time**: 0.706 ms
- **Max Time**: 55.070 ms
- **Average Memory**: 212.03 MB
- **Min Memory**: 31.25 MB
- **Max Memory**: 364.45 MB

## Complete Results Table

| Load Mode | Install Mode | Load Level | Version | Time (ms) | Memory (MB) | Success |
|-----------|--------------|------------|---------|-----------|------------|--------|
| adaptive | clean | enterprise_load | new | 42.888 | 263.06 | ✅ |
| adaptive | clean | heavy_load | new | 19.806 | 256.46 | ✅ |
| adaptive | clean | light_load | new | 1.056 | 256.43 | ✅ |
| adaptive | clean | medium_load | new | 4.984 | 256.43 | ✅ |
| adaptive | full | enterprise_load | new | 44.739 | 256.33 | ✅ |
| adaptive | full | heavy_load | new | 20.105 | 249.10 | ✅ |
| adaptive | full | light_load | new | 0.972 | 249.07 | ✅ |
| adaptive | full | medium_load | new | 4.922 | 249.07 | ✅ |
| adaptive | none | enterprise_load | new | 49.450 | 242.79 | ✅ |
| adaptive | none | heavy_load | new | 23.573 | 236.68 | ✅ |
| adaptive | none | light_load | new | 1.688 | 236.66 | ✅ |
| adaptive | none | medium_load | new | 6.127 | 236.66 | ✅ |
| adaptive | size_aware | enterprise_load | new | 42.902 | 275.93 | ✅ |
| adaptive | size_aware | heavy_load | new | 16.686 | 269.71 | ✅ |
| adaptive | size_aware | light_load | new | 1.057 | 269.70 | ✅ |
| adaptive | size_aware | medium_load | new | 4.688 | 269.70 | ✅ |
| adaptive | smart | enterprise_load | new | 48.672 | 248.99 | ✅ |
| adaptive | smart | heavy_load | new | 16.459 | 243.05 | ✅ |
| adaptive | smart | light_load | new | 1.013 | 243.03 | ✅ |
| adaptive | smart | medium_load | new | 5.185 | 243.03 | ✅ |
| adaptive | temporary | enterprise_load | new | 44.309 | 269.50 | ✅ |
| adaptive | temporary | heavy_load | new | 15.989 | 263.14 | ✅ |
| adaptive | temporary | light_load | new | 1.030 | 263.08 | ✅ |
| adaptive | temporary | medium_load | new | 4.775 | 263.11 | ✅ |
| auto | clean | enterprise_load | new | 42.378 | 64.95 | ✅ |
| auto | clean | heavy_load | new | 18.058 | 58.96 | ✅ |
| auto | clean | light_load | new | 0.889 | 58.93 | ✅ |
| auto | clean | medium_load | new | 4.868 | 58.94 | ✅ |
| auto | full | enterprise_load | new | 45.202 | 58.69 | ✅ |
| auto | full | heavy_load | new | 19.767 | 52.21 | ✅ |
| auto | full | light_load | new | 1.051 | 52.09 | ✅ |
| auto | full | medium_load | new | 5.774 | 52.10 | ✅ |
| auto | none | enterprise_load | new | 46.011 | 44.50 | ✅ |
| auto | none | enterprise_load | old | 45.317 | 367.45 | ✅ |
| auto | none | heavy_load | new | 18.163 | 34.95 | ✅ |
| auto | none | heavy_load | old | 16.624 | 364.47 | ✅ |
| auto | none | light_load | new | 1.331 | 31.25 | ✅ |
| auto | none | light_load | old | 1.163 | 364.47 | ✅ |
| auto | none | medium_load | new | 5.894 | 32.27 | ✅ |
| auto | none | medium_load | old | 5.033 | 364.47 | ✅ |
| auto | size_aware | enterprise_load | new | 46.790 | 78.32 | ✅ |
| auto | size_aware | heavy_load | new | 16.467 | 72.18 | ✅ |
| auto | size_aware | light_load | new | 0.996 | 72.07 | ✅ |
| auto | size_aware | medium_load | new | 4.758 | 72.08 | ✅ |
| auto | smart | enterprise_load | new | 42.695 | 52.02 | ✅ |
| auto | smart | heavy_load | new | 15.737 | 44.93 | ✅ |
| auto | smart | light_load | new | 0.706 | 44.65 | ✅ |
| auto | smart | medium_load | new | 4.547 | 44.68 | ✅ |
| auto | temporary | enterprise_load | new | 52.335 | 72.01 | ✅ |
| auto | temporary | heavy_load | new | 17.417 | 65.23 | ✅ |
| auto | temporary | light_load | new | 1.048 | 65.16 | ✅ |
| auto | temporary | medium_load | new | 5.809 | 65.16 | ✅ |
| background | clean | enterprise_load | new | 41.867 | 144.58 | ✅ |
| background | clean | heavy_load | new | 16.282 | 138.32 | ✅ |
| background | clean | light_load | new | 0.715 | 138.27 | ✅ |
| background | clean | medium_load | new | 4.594 | 138.28 | ✅ |
| background | full | enterprise_load | new | 41.856 | 138.06 | ✅ |
| background | full | heavy_load | new | 16.572 | 131.83 | ✅ |
| background | full | light_load | new | 1.071 | 131.80 | ✅ |
| background | full | medium_load | new | 4.798 | 131.80 | ✅ |
| background | none | enterprise_load | new | 42.828 | 124.56 | ✅ |
| background | none | heavy_load | new | 15.728 | 118.47 | ✅ |
| background | none | light_load | new | 1.293 | 118.46 | ✅ |
| background | none | medium_load | new | 4.842 | 118.46 | ✅ |
| background | size_aware | enterprise_load | new | 43.007 | 157.81 | ✅ |
| background | size_aware | heavy_load | new | 16.334 | 151.58 | ✅ |
| background | size_aware | light_load | new | 0.732 | 151.52 | ✅ |
| background | size_aware | medium_load | new | 5.784 | 151.52 | ✅ |
| background | smart | enterprise_load | new | 41.839 | 131.67 | ✅ |
| background | smart | heavy_load | new | 16.842 | 124.77 | ✅ |
| background | smart | light_load | new | 1.046 | 124.75 | ✅ |
| background | smart | medium_load | new | 4.990 | 124.75 | ✅ |
| background | temporary | enterprise_load | new | 42.301 | 151.34 | ✅ |
| background | temporary | heavy_load | new | 15.394 | 144.82 | ✅ |
| background | temporary | light_load | new | 0.993 | 144.79 | ✅ |
| background | temporary | medium_load | new | 4.735 | 144.79 | ✅ |
| cached | clean | enterprise_load | new | 42.370 | 183.59 | ✅ |
| cached | clean | heavy_load | new | 15.498 | 177.67 | ✅ |
| cached | clean | light_load | new | 0.879 | 177.57 | ✅ |
| cached | clean | medium_load | new | 5.467 | 177.57 | ✅ |
| cached | full | enterprise_load | new | 42.066 | 177.54 | ✅ |
| cached | full | heavy_load | new | 16.392 | 170.68 | ✅ |
| cached | full | light_load | new | 0.990 | 170.63 | ✅ |
| cached | full | medium_load | new | 4.691 | 170.63 | ✅ |
| cached | none | enterprise_load | new | 43.126 | 164.09 | ✅ |
| cached | none | heavy_load | new | 17.321 | 157.86 | ✅ |
| cached | none | light_load | new | 1.149 | 157.86 | ✅ |
| cached | none | medium_load | new | 5.046 | 157.86 | ✅ |
| cached | size_aware | enterprise_load | new | 42.123 | 198.09 | ✅ |
| cached | size_aware | heavy_load | new | 16.115 | 191.08 | ✅ |
| cached | size_aware | light_load | new | 1.355 | 190.64 | ✅ |
| cached | size_aware | medium_load | new | 5.733 | 190.64 | ✅ |
| cached | smart | enterprise_load | new | 41.447 | 170.51 | ✅ |
| cached | smart | heavy_load | new | 15.867 | 164.27 | ✅ |
| cached | smart | light_load | new | 1.146 | 164.12 | ✅ |
| cached | smart | medium_load | new | 4.897 | 164.15 | ✅ |
| cached | temporary | enterprise_load | new | 43.032 | 190.40 | ✅ |
| cached | temporary | heavy_load | new | 16.330 | 183.82 | ✅ |
| cached | temporary | light_load | new | 1.037 | 183.71 | ✅ |
| cached | temporary | medium_load | new | 4.748 | 183.71 | ✅ |
| hyperparallel | clean | enterprise_load | new | 43.791 | 301.59 | ✅ |
| hyperparallel | clean | heavy_load | new | 19.484 | 294.32 | ✅ |
| hyperparallel | clean | light_load | new | 0.905 | 294.26 | ✅ |
| hyperparallel | clean | medium_load | new | 4.746 | 294.26 | ✅ |
| hyperparallel | full | enterprise_load | new | 43.006 | 294.18 | ✅ |
| hyperparallel | full | heavy_load | new | 16.178 | 288.09 | ✅ |
| hyperparallel | full | light_load | new | 0.853 | 288.05 | ✅ |
| hyperparallel | full | medium_load | new | 4.162 | 288.05 | ✅ |
| hyperparallel | none | enterprise_load | new | 46.599 | 281.77 | ✅ |
| hyperparallel | none | heavy_load | new | 17.247 | 275.99 | ✅ |
| hyperparallel | none | light_load | new | 1.062 | 275.96 | ✅ |
| hyperparallel | none | medium_load | new | 5.369 | 275.96 | ✅ |
| hyperparallel | size_aware | enterprise_load | new | 41.560 | 315.03 | ✅ |
| hyperparallel | size_aware | heavy_load | new | 18.859 | 308.83 | ✅ |
| hyperparallel | size_aware | light_load | new | 1.037 | 308.75 | ✅ |
| hyperparallel | size_aware | medium_load | new | 4.961 | 308.75 | ✅ |
| hyperparallel | smart | enterprise_load | new | 55.070 | 288.03 | ✅ |
| hyperparallel | smart | heavy_load | new | 15.721 | 281.96 | ✅ |
| hyperparallel | smart | light_load | new | 1.245 | 281.95 | ✅ |
| hyperparallel | smart | medium_load | new | 5.235 | 281.95 | ✅ |
| hyperparallel | temporary | enterprise_load | new | 49.036 | 308.73 | ✅ |
| hyperparallel | temporary | heavy_load | new | 16.963 | 301.76 | ✅ |
| hyperparallel | temporary | light_load | new | 1.053 | 301.73 | ✅ |
| hyperparallel | temporary | medium_load | new | 4.718 | 301.73 | ✅ |
| preload | clean | enterprise_load | new | 41.209 | 104.70 | ✅ |
| preload | clean | heavy_load | new | 16.049 | 98.07 | ✅ |
| preload | clean | light_load | new | 0.780 | 98.05 | ✅ |
| preload | clean | medium_load | new | 5.446 | 98.05 | ✅ |
| preload | full | enterprise_load | new | 40.041 | 98.04 | ✅ |
| preload | full | heavy_load | new | 15.680 | 91.68 | ✅ |
| preload | full | light_load | new | 0.751 | 91.65 | ✅ |
| preload | full | medium_load | new | 4.437 | 91.65 | ✅ |
| preload | none | enterprise_load | new | 42.817 | 84.91 | ✅ |
| preload | none | heavy_load | new | 19.077 | 78.59 | ✅ |
| preload | none | light_load | new | 1.067 | 78.52 | ✅ |
| preload | none | medium_load | new | 6.175 | 78.54 | ✅ |
| preload | size_aware | enterprise_load | new | 41.866 | 118.44 | ✅ |
| preload | size_aware | heavy_load | new | 15.372 | 111.74 | ✅ |
| preload | size_aware | light_load | new | 0.994 | 111.72 | ✅ |
| preload | size_aware | medium_load | new | 5.034 | 111.72 | ✅ |
| preload | smart | enterprise_load | new | 42.647 | 91.47 | ✅ |
| preload | smart | heavy_load | new | 15.675 | 85.14 | ✅ |
| preload | smart | light_load | new | 1.241 | 85.05 | ✅ |
| preload | smart | medium_load | new | 4.558 | 85.05 | ✅ |
| preload | temporary | enterprise_load | new | 42.451 | 111.64 | ✅ |
| preload | temporary | heavy_load | new | 15.584 | 104.77 | ✅ |
| preload | temporary | light_load | new | 0.891 | 104.75 | ✅ |
| preload | temporary | medium_load | new | 4.885 | 104.75 | ✅ |
| streaming | clean | enterprise_load | new | 44.373 | 333.23 | ✅ |
| streaming | clean | heavy_load | new | 17.170 | 329.96 | ✅ |
| streaming | clean | light_load | new | 0.739 | 329.80 | ✅ |
| streaming | clean | medium_load | new | 4.792 | 329.87 | ✅ |
| streaming | full | enterprise_load | new | 43.616 | 329.79 | ✅ |
| streaming | full | heavy_load | new | 17.067 | 326.39 | ✅ |
| streaming | full | light_load | new | 0.856 | 326.35 | ✅ |
| streaming | full | medium_load | new | 4.992 | 326.35 | ✅ |
| streaming | none | enterprise_load | new | 42.407 | 321.21 | ✅ |
| streaming | none | heavy_load | new | 16.971 | 315.17 | ✅ |
| streaming | none | light_load | new | 0.897 | 315.07 | ✅ |
| streaming | none | medium_load | new | 5.374 | 315.07 | ✅ |
| streaming | size_aware | enterprise_load | new | 43.740 | 340.18 | ✅ |
| streaming | size_aware | heavy_load | new | 17.122 | 336.71 | ✅ |
| streaming | size_aware | light_load | new | 0.974 | 336.71 | ✅ |
| streaming | size_aware | medium_load | new | 5.231 | 336.71 | ✅ |
| streaming | smart | enterprise_load | new | 42.435 | 326.34 | ✅ |
| streaming | smart | heavy_load | new | 16.080 | 321.24 | ✅ |
| streaming | smart | light_load | new | 1.923 | 321.23 | ✅ |
| streaming | smart | medium_load | new | 4.895 | 321.23 | ✅ |
| streaming | temporary | enterprise_load | new | 43.699 | 336.69 | ✅ |
| streaming | temporary | heavy_load | new | 16.086 | 333.27 | ✅ |
| streaming | temporary | light_load | new | 0.753 | 333.26 | ✅ |
| streaming | temporary | medium_load | new | 4.834 | 333.26 | ✅ |
| turbo | clean | enterprise_load | new | 43.537 | 223.46 | ✅ |
| turbo | clean | heavy_load | new | 17.509 | 217.41 | ✅ |
| turbo | clean | light_load | new | 1.523 | 217.40 | ✅ |
| turbo | clean | medium_load | new | 5.444 | 217.40 | ✅ |
| turbo | full | enterprise_load | new | 43.061 | 217.16 | ✅ |
| turbo | full | heavy_load | new | 16.395 | 210.29 | ✅ |
| turbo | full | light_load | new | 1.033 | 210.27 | ✅ |
| turbo | full | medium_load | new | 5.280 | 210.27 | ✅ |
| turbo | none | enterprise_load | new | 44.685 | 203.96 | ✅ |
| turbo | none | heavy_load | new | 16.215 | 198.17 | ✅ |
| turbo | none | light_load | new | 1.008 | 198.14 | ✅ |
| turbo | none | medium_load | new | 5.206 | 198.14 | ✅ |
| turbo | size_aware | enterprise_load | new | 44.733 | 236.64 | ✅ |
| turbo | size_aware | heavy_load | new | 35.255 | 230.56 | ✅ |
| turbo | size_aware | light_load | new | 1.050 | 230.51 | ✅ |
| turbo | size_aware | medium_load | new | 5.348 | 230.52 | ✅ |
| turbo | smart | enterprise_load | new | 42.695 | 210.07 | ✅ |
| turbo | smart | heavy_load | new | 17.156 | 204.14 | ✅ |
| turbo | smart | light_load | new | 1.185 | 204.12 | ✅ |
| turbo | smart | medium_load | new | 4.569 | 204.12 | ✅ |
| turbo | temporary | enterprise_load | new | 43.816 | 230.36 | ✅ |
| turbo | temporary | heavy_load | new | 15.539 | 223.57 | ✅ |
| turbo | temporary | light_load | new | 1.027 | 223.49 | ✅ |
| turbo | temporary | medium_load | new | 4.925 | 223.49 | ✅ |
| ultra | clean | enterprise_load | new | 44.985 | 356.27 | ✅ |
| ultra | clean | heavy_load | new | 22.049 | 352.21 | ✅ |
| ultra | clean | light_load | new | 1.098 | 352.21 | ✅ |
| ultra | clean | medium_load | new | 5.226 | 352.21 | ✅ |
| ultra | full | enterprise_load | new | 42.055 | 352.20 | ✅ |
| ultra | full | heavy_load | new | 16.370 | 348.84 | ✅ |
| ultra | full | light_load | new | 0.763 | 348.84 | ✅ |
| ultra | full | medium_load | new | 5.079 | 348.84 | ✅ |
| ultra | none | enterprise_load | new | 44.848 | 344.55 | ✅ |
| ultra | none | heavy_load | new | 17.623 | 340.20 | ✅ |
| ultra | none | light_load | new | 0.939 | 340.20 | ✅ |
| ultra | none | medium_load | new | 5.259 | 340.20 | ✅ |
| ultra | size_aware | enterprise_load | new | 43.430 | 364.45 | ✅ |
| ultra | size_aware | heavy_load | new | 16.611 | 360.32 | ✅ |
| ultra | size_aware | light_load | new | 0.773 | 360.32 | ✅ |
| ultra | size_aware | medium_load | new | 4.936 | 360.32 | ✅ |
| ultra | smart | enterprise_load | new | 42.961 | 348.81 | ✅ |
| ultra | smart | heavy_load | new | 16.320 | 344.64 | ✅ |
| ultra | smart | light_load | new | 1.050 | 344.63 | ✅ |
| ultra | smart | medium_load | new | 4.996 | 344.64 | ✅ |
| ultra | temporary | enterprise_load | new | 43.419 | 360.29 | ✅ |
| ultra | temporary | heavy_load | new | 17.371 | 356.35 | ✅ |
| ultra | temporary | light_load | new | 0.846 | 356.34 | ✅ |
| ultra | temporary | medium_load | new | 4.885 | 356.35 | ✅ |

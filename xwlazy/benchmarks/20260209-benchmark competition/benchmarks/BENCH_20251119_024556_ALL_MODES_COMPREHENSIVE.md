# Comprehensive xwlazy Mode Benchmark Report

**Generated:** 2025-11-19T02:45:56.310030
**Total Combinations Tested:** 100

## Executive Summary

### Fastest Mode by Load Level

| Load Level | Fastest Mode | Load Mode | Install Mode | Time (ms) | Memory (MB) |
|------------|--------------|-----------|--------------|-----------|-------------|
| light_load | cached + full | cached | full | 1.482 | 171.33 |
| medium_load | preload + none | preload | none | 8.987 | 78.50 |
| heavy_load | background + clean | background | clean | 32.416 | 138.71 |
| enterprise_load | cached + none | cached | none | 82.161 | 164.64 |

### Overall Fastest Mode

- **Mode**: cached + full
- **Load Level**: light_load
- **Time**: 1.482 ms
- **Memory**: 171.33 MB

## Detailed Results by Mode Combination

### Load Mode: AUTO

| Install Mode | Light Load | Medium Load | Heavy Load | Enterprise Load |
|-------------|------------|-------------|------------|-----------------|
| none | 2.23 ms<br/>30.3 MB | 9.46 ms<br/>32.0 MB | 35.02 ms<br/>35.1 MB | 102.92 ms<br/>44.6 MB |
| smart | 2.71 ms<br/>44.6 MB | 11.40 ms<br/>44.8 MB | 44.60 ms<br/>45.0 MB | 94.31 ms<br/>52.3 MB |
| full | 1.83 ms<br/>52.4 MB | 9.26 ms<br/>52.4 MB | 36.21 ms<br/>52.5 MB | 86.46 ms<br/>58.9 MB |
| clean | 2.09 ms<br/>59.0 MB | 11.55 ms<br/>59.0 MB | 33.86 ms<br/>59.0 MB | 91.77 ms<br/>65.3 MB |
| temporary | 2.48 ms<br/>65.4 MB | 10.55 ms<br/>65.4 MB | 33.83 ms<br/>65.5 MB | 87.58 ms<br/>72.0 MB |
| size_aware | 2.57 ms<br/>72.0 MB | 10.35 ms<br/>72.2 MB | 36.78 ms<br/>72.3 MB | 84.77 ms<br/>78.3 MB |

### Load Mode: PRELOAD

| Install Mode | Light Load | Medium Load | Heavy Load | Enterprise Load |
|-------------|------------|-------------|------------|-----------------|
| none | 2.19 ms<br/>78.5 MB | 8.99 ms<br/>78.5 MB | 33.03 ms<br/>78.5 MB | 104.96 ms<br/>85.4 MB |
| smart | 2.24 ms<br/>85.6 MB | 14.64 ms<br/>85.6 MB | 40.48 ms<br/>85.7 MB | 94.85 ms<br/>92.1 MB |
| full | 2.41 ms<br/>92.1 MB | 13.36 ms<br/>92.1 MB | 35.75 ms<br/>92.2 MB | 86.96 ms<br/>98.9 MB |
| clean | 1.89 ms<br/>98.9 MB | 11.73 ms<br/>99.0 MB | 37.86 ms<br/>99.1 MB | 103.95 ms<br/>105.3 MB |
| temporary | 2.07 ms<br/>105.5 MB | 9.95 ms<br/>105.5 MB | 34.31 ms<br/>105.6 MB | 97.37 ms<br/>111.7 MB |
| size_aware | 2.53 ms<br/>111.9 MB | 14.25 ms<br/>111.9 MB | 39.05 ms<br/>112.0 MB | 90.46 ms<br/>118.7 MB |

### Load Mode: BACKGROUND

| Install Mode | Light Load | Medium Load | Heavy Load | Enterprise Load |
|-------------|------------|-------------|------------|-----------------|
| none | 2.22 ms<br/>118.8 MB | 11.40 ms<br/>118.8 MB | 35.52 ms<br/>118.9 MB | 103.14 ms<br/>124.9 MB |
| smart | 4.40 ms<br/>125.0 MB | 12.08 ms<br/>125.0 MB | 40.71 ms<br/>125.0 MB | 99.59 ms<br/>131.7 MB |
| full | 2.04 ms<br/>131.8 MB | 10.17 ms<br/>131.8 MB | 35.45 ms<br/>131.9 MB | 82.54 ms<br/>138.6 MB |
| clean | 2.37 ms<br/>138.7 MB | 9.39 ms<br/>138.7 MB | 32.42 ms<br/>138.7 MB | 82.24 ms<br/>145.0 MB |
| temporary | 2.18 ms<br/>145.1 MB | 10.62 ms<br/>145.1 MB | 35.17 ms<br/>145.1 MB | 83.21 ms<br/>152.3 MB |
| size_aware | 2.51 ms<br/>152.3 MB | 10.01 ms<br/>152.4 MB | 34.56 ms<br/>152.4 MB | 92.36 ms<br/>158.2 MB |

### Load Mode: CACHED

| Install Mode | Light Load | Medium Load | Heavy Load | Enterprise Load |
|-------------|------------|-------------|------------|-----------------|
| none | 2.44 ms<br/>158.4 MB | 10.82 ms<br/>158.4 MB | 51.71 ms<br/>158.4 MB | 82.16 ms<br/>164.6 MB |
| smart | 1.95 ms<br/>164.7 MB | 9.46 ms<br/>164.7 MB | 36.45 ms<br/>164.8 MB | 106.13 ms<br/>171.3 MB |
| full | 1.48 ms<br/>171.3 MB | 11.06 ms<br/>171.4 MB | 40.93 ms<br/>171.4 MB | 101.71 ms<br/>177.6 MB |
| clean | 2.59 ms<br/>177.7 MB | 14.91 ms<br/>177.7 MB | 39.52 ms<br/>177.8 MB | 87.68 ms<br/>184.6 MB |
| temporary | 1.64 ms<br/>184.7 MB | 10.10 ms<br/>184.7 MB | 35.94 ms<br/>184.7 MB | 102.41 ms<br/>190.7 MB |
| size_aware | 1.82 ms<br/>190.7 MB | 9.39 ms<br/>190.9 MB | 41.12 ms<br/>191.4 MB | 91.64 ms<br/>197.8 MB |

## Results by Load Level

### Light Load

| Rank | Load Mode | Install Mode | Time (ms) | Memory (MB) | Relative |
|------|-----------|--------------|-----------|-------------|----------|
| 1 🥇 | cached | full | 1.482 | 171.33 | 1.12x |
| 2 🥈 | cached | temporary | 1.644 | 184.68 | 1.24x |
| 3 🥉 | cached | size_aware | 1.816 | 190.75 | 1.37x |
| 4  | auto | full | 1.829 | 52.42 | 1.38x |
| 5  | preload | clean | 1.888 | 98.89 | 1.42x |
| 6  | cached | smart | 1.947 | 164.72 | 1.46x |
| 7  | background | full | 2.042 | 131.84 | 1.54x |
| 8  | preload | temporary | 2.066 | 105.54 | 1.55x |
| 9  | auto | clean | 2.094 | 58.96 | 1.58x |
| 10  | background | temporary | 2.180 | 145.06 | 1.64x |

### Medium Load

| Rank | Load Mode | Install Mode | Time (ms) | Memory (MB) | Relative |
|------|-----------|--------------|-----------|-------------|----------|
| 1 🥇 | preload | none | 8.987 | 78.50 | 6.76x |
| 2 🥈 | auto | full | 9.255 | 52.43 | 6.96x |
| 3 🥉 | background | clean | 9.386 | 138.66 | 7.06x |
| 4  | cached | size_aware | 9.388 | 190.91 | 7.06x |
| 5  | cached | smart | 9.456 | 164.73 | 7.11x |
| 6  | auto | none | 9.463 | 32.00 | 7.12x |
| 7  | preload | temporary | 9.952 | 105.54 | 7.49x |
| 8  | background | size_aware | 10.011 | 152.36 | 7.53x |
| 9  | cached | temporary | 10.101 | 184.68 | 7.60x |
| 10  | background | full | 10.174 | 131.84 | 7.65x |

### Heavy Load

| Rank | Load Mode | Install Mode | Time (ms) | Memory (MB) | Relative |
|------|-----------|--------------|-----------|-------------|----------|
| 1 🥇 | background | clean | 32.416 | 138.71 | 24.38x |
| 2 🥈 | preload | none | 33.027 | 78.51 | 24.84x |
| 3 🥉 | auto | temporary | 33.827 | 65.54 | 25.44x |
| 4  | auto | clean | 33.861 | 59.02 | 25.47x |
| 5  | preload | temporary | 34.308 | 105.55 | 25.80x |
| 6  | background | size_aware | 34.563 | 152.40 | 26.00x |
| 7  | auto | none | 35.024 | 35.09 | 26.34x |
| 8  | background | temporary | 35.165 | 145.14 | 26.45x |
| 9  | background | full | 35.453 | 131.93 | 26.67x |
| 10  | background | none | 35.520 | 118.86 | 26.72x |

### Enterprise Load

| Rank | Load Mode | Install Mode | Time (ms) | Memory (MB) | Relative |
|------|-----------|--------------|-----------|-------------|----------|
| 1 🥇 | cached | none | 82.161 | 164.64 | 61.80x |
| 2 🥈 | background | clean | 82.243 | 144.97 | 61.86x |
| 3 🥉 | background | full | 82.543 | 138.60 | 62.09x |
| 4  | background | temporary | 83.211 | 152.26 | 62.59x |
| 5  | auto | size_aware | 84.768 | 78.33 | 63.76x |
| 6  | auto | full | 86.461 | 58.89 | 65.03x |
| 7  | preload | full | 86.960 | 98.86 | 65.41x |
| 8  | auto | temporary | 87.583 | 72.01 | 65.88x |
| 9  | cached | clean | 87.683 | 184.57 | 65.95x |
| 10  | preload | size_aware | 90.455 | 118.68 | 68.04x |

## Old vs New xwlazy Comparison

### Performance Comparison

| Load Level | Old (ms) | New Best (ms) | Improvement |
|------------|----------|---------------|-------------|
| light_load | 3.545 | 1.482 | +58.2% |
| medium_load | 11.529 | 8.987 | +22.0% |
| heavy_load | 37.965 | 32.416 | +14.6% |
| enterprise_load | 98.443 | 82.161 | +16.5% |

## Statistics

- **Total Successful Tests**: 96
- **Average Time**: 36.055 ms
- **Min Time**: 1.482 ms
- **Max Time**: 106.128 ms
- **Average Memory**: 116.64 MB
- **Min Memory**: 30.35 MB
- **Max Memory**: 197.79 MB

## Complete Results Table

| Load Mode | Install Mode | Load Level | Version | Time (ms) | Memory (MB) | Success |
|-----------|--------------|------------|---------|-----------|------------|--------|
| auto | clean | enterprise_load | new | 91.775 | 65.34 | ✅ |
| auto | clean | heavy_load | new | 33.861 | 59.02 | ✅ |
| auto | clean | light_load | new | 2.094 | 58.96 | ✅ |
| auto | clean | medium_load | new | 11.549 | 58.96 | ✅ |
| auto | full | enterprise_load | new | 86.461 | 58.89 | ✅ |
| auto | full | heavy_load | new | 36.209 | 52.53 | ✅ |
| auto | full | light_load | new | 1.829 | 52.42 | ✅ |
| auto | full | medium_load | new | 9.255 | 52.43 | ✅ |
| auto | none | enterprise_load | new | 102.920 | 44.61 | ✅ |
| auto | none | enterprise_load | old | 98.443 | 204.38 | ✅ |
| auto | none | heavy_load | new | 35.024 | 35.09 | ✅ |
| auto | none | heavy_load | old | 37.965 | 197.93 | ✅ |
| auto | none | light_load | new | 2.233 | 30.35 | ✅ |
| auto | none | light_load | old | 3.545 | 197.90 | ✅ |
| auto | none | medium_load | new | 9.463 | 32.00 | ✅ |
| auto | none | medium_load | old | 11.529 | 197.90 | ✅ |
| auto | size_aware | enterprise_load | new | 84.768 | 78.33 | ✅ |
| auto | size_aware | heavy_load | new | 36.775 | 72.32 | ✅ |
| auto | size_aware | light_load | new | 2.570 | 72.04 | ✅ |
| auto | size_aware | medium_load | new | 10.349 | 72.17 | ✅ |
| auto | smart | enterprise_load | new | 94.311 | 52.30 | ✅ |
| auto | smart | heavy_load | new | 44.599 | 45.02 | ✅ |
| auto | smart | light_load | new | 2.714 | 44.64 | ✅ |
| auto | smart | medium_load | new | 11.397 | 44.78 | ✅ |
| auto | temporary | enterprise_load | new | 87.583 | 72.01 | ✅ |
| auto | temporary | heavy_load | new | 33.827 | 65.54 | ✅ |
| auto | temporary | light_load | new | 2.479 | 65.41 | ✅ |
| auto | temporary | medium_load | new | 10.548 | 65.43 | ✅ |
| background | clean | enterprise_load | new | 82.243 | 144.97 | ✅ |
| background | clean | heavy_load | new | 32.416 | 138.71 | ✅ |
| background | clean | light_load | new | 2.370 | 138.66 | ✅ |
| background | clean | medium_load | new | 9.386 | 138.66 | ✅ |
| background | full | enterprise_load | new | 82.543 | 138.60 | ✅ |
| background | full | heavy_load | new | 35.453 | 131.93 | ✅ |
| background | full | light_load | new | 2.042 | 131.84 | ✅ |
| background | full | medium_load | new | 10.174 | 131.84 | ✅ |
| background | none | enterprise_load | new | 103.145 | 124.93 | ✅ |
| background | none | heavy_load | new | 35.520 | 118.86 | ✅ |
| background | none | light_load | new | 2.220 | 118.82 | ✅ |
| background | none | medium_load | new | 11.401 | 118.82 | ✅ |
| background | size_aware | enterprise_load | new | 92.356 | 158.21 | ✅ |
| background | size_aware | heavy_load | new | 34.563 | 152.40 | ✅ |
| background | size_aware | light_load | new | 2.511 | 152.34 | ✅ |
| background | size_aware | medium_load | new | 10.011 | 152.36 | ✅ |
| background | smart | enterprise_load | new | 99.594 | 131.68 | ✅ |
| background | smart | heavy_load | new | 40.710 | 125.03 | ✅ |
| background | smart | light_load | new | 4.397 | 125.02 | ✅ |
| background | smart | medium_load | new | 12.083 | 125.02 | ✅ |
| background | temporary | enterprise_load | new | 83.211 | 152.26 | ✅ |
| background | temporary | heavy_load | new | 35.165 | 145.14 | ✅ |
| background | temporary | light_load | new | 2.180 | 145.06 | ✅ |
| background | temporary | medium_load | new | 10.619 | 145.06 | ✅ |
| cached | clean | enterprise_load | new | 87.683 | 184.57 | ✅ |
| cached | clean | heavy_load | new | 39.517 | 177.77 | ✅ |
| cached | clean | light_load | new | 2.592 | 177.65 | ✅ |
| cached | clean | medium_load | new | 14.914 | 177.74 | ✅ |
| cached | full | enterprise_load | new | 101.711 | 177.57 | ✅ |
| cached | full | heavy_load | new | 40.929 | 171.41 | ✅ |
| cached | full | light_load | new | 1.482 | 171.33 | ✅ |
| cached | full | medium_load | new | 11.058 | 171.39 | ✅ |
| cached | none | enterprise_load | new | 82.161 | 164.64 | ✅ |
| cached | none | heavy_load | new | 51.710 | 158.44 | ✅ |
| cached | none | light_load | new | 2.441 | 158.41 | ✅ |
| cached | none | medium_load | new | 10.819 | 158.41 | ✅ |
| cached | size_aware | enterprise_load | new | 91.645 | 197.79 | ✅ |
| cached | size_aware | heavy_load | new | 41.122 | 191.43 | ✅ |
| cached | size_aware | light_load | new | 1.816 | 190.75 | ✅ |
| cached | size_aware | medium_load | new | 9.388 | 190.91 | ✅ |
| cached | smart | enterprise_load | new | 106.128 | 171.29 | ✅ |
| cached | smart | heavy_load | new | 36.454 | 164.82 | ✅ |
| cached | smart | light_load | new | 1.947 | 164.72 | ✅ |
| cached | smart | medium_load | new | 9.456 | 164.73 | ✅ |
| cached | temporary | enterprise_load | new | 102.408 | 190.67 | ✅ |
| cached | temporary | heavy_load | new | 35.938 | 184.70 | ✅ |
| cached | temporary | light_load | new | 1.644 | 184.68 | ✅ |
| cached | temporary | medium_load | new | 10.101 | 184.68 | ✅ |
| preload | clean | enterprise_load | new | 103.953 | 105.34 | ✅ |
| preload | clean | heavy_load | new | 37.860 | 99.05 | ✅ |
| preload | clean | light_load | new | 1.888 | 98.89 | ✅ |
| preload | clean | medium_load | new | 11.730 | 99.02 | ✅ |
| preload | full | enterprise_load | new | 86.960 | 98.86 | ✅ |
| preload | full | heavy_load | new | 35.746 | 92.18 | ✅ |
| preload | full | light_load | new | 2.414 | 92.09 | ✅ |
| preload | full | medium_load | new | 13.361 | 92.09 | ✅ |
| preload | none | enterprise_load | new | 104.964 | 85.43 | ✅ |
| preload | none | heavy_load | new | 33.027 | 78.51 | ✅ |
| preload | none | light_load | new | 2.193 | 78.50 | ✅ |
| preload | none | medium_load | new | 8.987 | 78.50 | ✅ |
| preload | size_aware | enterprise_load | new | 90.455 | 118.68 | ✅ |
| preload | size_aware | heavy_load | new | 39.049 | 111.98 | ✅ |
| preload | size_aware | light_load | new | 2.530 | 111.89 | ✅ |
| preload | size_aware | medium_load | new | 14.251 | 111.89 | ✅ |
| preload | smart | enterprise_load | new | 94.853 | 92.05 | ✅ |
| preload | smart | heavy_load | new | 40.484 | 85.66 | ✅ |
| preload | smart | light_load | new | 2.240 | 85.56 | ✅ |
| preload | smart | medium_load | new | 14.642 | 85.57 | ✅ |
| preload | temporary | enterprise_load | new | 97.371 | 111.73 | ✅ |
| preload | temporary | heavy_load | new | 34.308 | 105.55 | ✅ |
| preload | temporary | light_load | new | 2.066 | 105.54 | ✅ |
| preload | temporary | medium_load | new | 9.952 | 105.54 | ✅ |

# Competition Benchmark Report

**Generated:** 2025-11-17T04:29:50.637049

## Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| deferred-import | light_load | 0.38 | 0.68x | 35.00 | 0.01 | ✅ |
| deferred-import | medium_load | 2.47 | 4.44x | 36.17 | 0.01 | ✅ |
| deferred-import | heavy_load | 10.87 | 19.54x | 38.37 | 0.01 | ✅ |
| lazi | light_load | 0.46 | 0.82x | 45.48 | 0.09 | ✅ |
| lazi | medium_load | 3.36 | 6.05x | 45.48 | 0.09 | ✅ |
| lazi | heavy_load | 8.54 | 15.35x | 45.49 | 0.09 | ✅ |
| lazy-imports | light_load | 0.81 | 1.45x | 40.25 | 0.04 | ✅ |
| lazy-imports | medium_load | 4.37 | 7.86x | 40.96 | 0.04 | ✅ |
| lazy-imports | heavy_load | 13.62 | 24.48x | 41.97 | 0.04 | ✅ |
| lazy-imports-lite | light_load | 0.48 | 0.86x | 45.49 | 0.04 | ✅ |
| lazy-imports-lite | medium_load | 2.37 | 4.26x | 45.49 | 0.04 | ✅ |
| lazy-imports-lite | heavy_load | 8.89 | 15.97x | 45.55 | 0.04 | ✅ |
| lazy-loader | light_load | 0.54 | 0.98x | 38.38 | 0.04 | ✅ |
| lazy-loader | medium_load | 2.49 | 4.47x | 38.55 | 0.04 | ✅ |
| lazy-loader | heavy_load | 8.60 | 15.46x | 40.18 | 0.04 | ✅ |
| lazy_import | light_load | 1.13 | 2.04x | 42.27 | 0.07 | ✅ |
| lazy_import | medium_load | 3.65 | 6.57x | 42.74 | 0.07 | ✅ |
| lazy_import | heavy_load | 8.29 | 14.90x | 44.62 | 0.07 | ✅ |
| pipimport | light_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pipimport | medium_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pipimport | heavy_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pylazyimports | light_load | 0.41 | 0.74x | 44.63 | 0.00 | ✅ |
| pylazyimports | medium_load | 2.34 | 4.21x | 44.70 | 0.00 | ✅ |
| pylazyimports | heavy_load | 8.78 | 15.78x | 45.48 | 0.00 | ✅ |
| xwlazy | light_load | 0.49 | 0.88x | 45.55 | 0.00 | ✅ |
| xwlazy | medium_load | 3.07 | 5.52x | 46.89 | 0.00 | ✅ |
| xwlazy | heavy_load | 9.70 | 17.43x | 48.67 | 0.00 | ✅ |

## Detailed Results

### deferred-import

**Test:** light_load

- Import Time: 0.38 ms
- Relative Time: 0.68x (vs baseline)
- Memory Peak: 35.00 MB
- Memory Avg: 35.00 MB
- Package Size: 0.01 MB
- Features: deferred_loading

**Test:** medium_load

- Import Time: 2.47 ms
- Relative Time: 4.44x (vs baseline)
- Memory Peak: 36.17 MB
- Memory Avg: 35.59 MB
- Package Size: 0.01 MB
- Features: deferred_loading

**Test:** heavy_load

- Import Time: 10.87 ms
- Relative Time: 19.54x (vs baseline)
- Memory Peak: 38.37 MB
- Memory Avg: 37.28 MB
- Package Size: 0.01 MB
- Features: deferred_loading

### lazi

**Test:** light_load

- Import Time: 0.46 ms
- Relative Time: 0.82x (vs baseline)
- Memory Peak: 45.48 MB
- Memory Avg: 45.48 MB
- Package Size: 0.09 MB
- Features: lazy_import, auto_detection

**Test:** medium_load

- Import Time: 3.36 ms
- Relative Time: 6.05x (vs baseline)
- Memory Peak: 45.48 MB
- Memory Avg: 45.48 MB
- Package Size: 0.09 MB
- Features: lazy_import, auto_detection

**Test:** heavy_load

- Import Time: 8.54 ms
- Relative Time: 15.35x (vs baseline)
- Memory Peak: 45.49 MB
- Memory Avg: 45.49 MB
- Package Size: 0.09 MB
- Features: lazy_import, auto_detection

### lazy-imports

**Test:** light_load

- Import Time: 0.81 ms
- Relative Time: 1.45x (vs baseline)
- Memory Peak: 40.25 MB
- Memory Avg: 40.24 MB
- Package Size: 0.04 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 4.37 ms
- Relative Time: 7.86x (vs baseline)
- Memory Peak: 40.96 MB
- Memory Avg: 40.60 MB
- Package Size: 0.04 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 13.62 ms
- Relative Time: 24.48x (vs baseline)
- Memory Peak: 41.97 MB
- Memory Avg: 41.47 MB
- Package Size: 0.04 MB
- Features: lazy_import

### lazy-imports-lite

**Test:** light_load

- Import Time: 0.48 ms
- Relative Time: 0.86x (vs baseline)
- Memory Peak: 45.49 MB
- Memory Avg: 45.49 MB
- Package Size: 0.04 MB
- Features: lazy_import, keyword_detection

**Test:** medium_load

- Import Time: 2.37 ms
- Relative Time: 4.26x (vs baseline)
- Memory Peak: 45.49 MB
- Memory Avg: 45.49 MB
- Package Size: 0.04 MB
- Features: lazy_import, keyword_detection

**Test:** heavy_load

- Import Time: 8.89 ms
- Relative Time: 15.97x (vs baseline)
- Memory Peak: 45.55 MB
- Memory Avg: 45.52 MB
- Package Size: 0.04 MB
- Features: lazy_import, keyword_detection

### lazy-loader

**Test:** light_load

- Import Time: 0.54 ms
- Relative Time: 0.98x (vs baseline)
- Memory Peak: 38.38 MB
- Memory Avg: 38.38 MB
- Package Size: 0.04 MB
- Features: lazy_import, caching

**Test:** medium_load

- Import Time: 2.49 ms
- Relative Time: 4.47x (vs baseline)
- Memory Peak: 38.55 MB
- Memory Avg: 38.46 MB
- Package Size: 0.04 MB
- Features: lazy_import, caching

**Test:** heavy_load

- Import Time: 8.60 ms
- Relative Time: 15.46x (vs baseline)
- Memory Peak: 40.18 MB
- Memory Avg: 39.37 MB
- Package Size: 0.04 MB
- Features: lazy_import, caching

### lazy_import

**Test:** light_load

- Import Time: 1.13 ms
- Relative Time: 2.04x (vs baseline)
- Memory Peak: 42.27 MB
- Memory Avg: 42.23 MB
- Package Size: 0.07 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 3.65 ms
- Relative Time: 6.57x (vs baseline)
- Memory Peak: 42.74 MB
- Memory Avg: 42.51 MB
- Package Size: 0.07 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 8.29 ms
- Relative Time: 14.90x (vs baseline)
- Memory Peak: 44.62 MB
- Memory Avg: 43.68 MB
- Package Size: 0.07 MB
- Features: lazy_import

### pipimport

**Test:** light_load

- ❌ Error: Missing parentheses in call to 'print'. Did you mean print(...)? (__init__.py, line 77)

**Test:** medium_load

- ❌ Error: Missing parentheses in call to 'print'. Did you mean print(...)? (__init__.py, line 77)

**Test:** heavy_load

- ❌ Error: Missing parentheses in call to 'print'. Did you mean print(...)? (__init__.py, line 77)

### pylazyimports

**Test:** light_load

- Import Time: 0.41 ms
- Relative Time: 0.74x (vs baseline)
- Memory Peak: 44.63 MB
- Memory Avg: 44.63 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** medium_load

- Import Time: 2.34 ms
- Relative Time: 4.21x (vs baseline)
- Memory Peak: 44.70 MB
- Memory Avg: 44.67 MB
- Package Size: 0.00 MB
- Features: lazy_import

**Test:** heavy_load

- Import Time: 8.78 ms
- Relative Time: 15.78x (vs baseline)
- Memory Peak: 45.48 MB
- Memory Avg: 45.09 MB
- Package Size: 0.00 MB
- Features: lazy_import

### xwlazy

**Test:** light_load

- Import Time: 0.49 ms
- Relative Time: 0.88x (vs baseline)
- Memory Peak: 45.55 MB
- Memory Avg: 45.55 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_install, keyword_detection, per_package_isolation, performance_monitoring, caching

**Test:** medium_load

- Import Time: 3.07 ms
- Relative Time: 5.52x (vs baseline)
- Memory Peak: 46.89 MB
- Memory Avg: 46.22 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_install, keyword_detection, per_package_isolation, performance_monitoring, caching

**Test:** heavy_load

- Import Time: 9.70 ms
- Relative Time: 17.43x (vs baseline)
- Memory Peak: 48.67 MB
- Memory Avg: 47.78 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_install, keyword_detection, per_package_isolation, performance_monitoring, caching


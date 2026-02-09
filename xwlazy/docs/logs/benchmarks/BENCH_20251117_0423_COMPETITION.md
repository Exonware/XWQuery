# Competition Benchmark Report

**Generated:** 2025-11-17T04:23:09.722627

## Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| deferred-import | basic_import | 0.61 | 1.32x | 34.53 | 0.01 | ✅ |
| lazi | basic_import | 0.41 | 0.88x | 35.54 | 0.09 | ✅ |
| lazy-imports | basic_import | 0.82 | 1.76x | 34.88 | 0.04 | ✅ |
| lazy-imports-lite | basic_import | 0.69 | 1.49x | 35.56 | 0.04 | ✅ |
| lazy-loader | basic_import | 0.81 | 1.75x | 34.66 | 0.04 | ✅ |
| lazy_import | basic_import | 1.29 | 2.77x | 35.03 | 0.07 | ✅ |
| pipimport | basic_import | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pylazyimports | basic_import | 0.55 | 1.18x | 35.36 | 0.00 | ✅ |
| xwlazy | basic_import | 0.53 | 1.14x | 35.61 | 0.00 | ✅ |

## Detailed Results

### deferred-import

**Test:** basic_import

- Import Time: 0.61 ms
- Relative Time: 1.32x (vs baseline)
- Memory Peak: 34.53 MB
- Memory Avg: 34.53 MB
- Package Size: 0.01 MB
- Features: deferred_loading

### lazi

**Test:** basic_import

- Import Time: 0.41 ms
- Relative Time: 0.88x (vs baseline)
- Memory Peak: 35.54 MB
- Memory Avg: 35.54 MB
- Package Size: 0.09 MB
- Features: lazy_import, auto_detection

### lazy-imports

**Test:** basic_import

- Import Time: 0.82 ms
- Relative Time: 1.76x (vs baseline)
- Memory Peak: 34.88 MB
- Memory Avg: 34.86 MB
- Package Size: 0.04 MB
- Features: lazy_import

### lazy-imports-lite

**Test:** basic_import

- Import Time: 0.69 ms
- Relative Time: 1.49x (vs baseline)
- Memory Peak: 35.56 MB
- Memory Avg: 35.56 MB
- Package Size: 0.04 MB
- Features: lazy_import, keyword_detection

### lazy-loader

**Test:** basic_import

- Import Time: 0.81 ms
- Relative Time: 1.75x (vs baseline)
- Memory Peak: 34.66 MB
- Memory Avg: 34.66 MB
- Package Size: 0.04 MB
- Features: lazy_import, caching

### lazy_import

**Test:** basic_import

- Import Time: 1.29 ms
- Relative Time: 2.77x (vs baseline)
- Memory Peak: 35.03 MB
- Memory Avg: 35.00 MB
- Package Size: 0.07 MB
- Features: lazy_import

### pipimport

**Test:** basic_import

- ❌ Error: Missing parentheses in call to 'print'. Did you mean print(...)? (__init__.py, line 77)

### pylazyimports

**Test:** basic_import

- Import Time: 0.55 ms
- Relative Time: 1.18x (vs baseline)
- Memory Peak: 35.36 MB
- Memory Avg: 35.26 MB
- Package Size: 0.00 MB
- Features: lazy_import

### xwlazy

**Test:** basic_import

- Import Time: 0.53 ms
- Relative Time: 1.14x (vs baseline)
- Memory Peak: 35.61 MB
- Memory Avg: 35.61 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_install, keyword_detection, per_package_isolation, performance_monitoring, caching


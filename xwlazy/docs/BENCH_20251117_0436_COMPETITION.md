# Competition Benchmark Report

**Generated:** 2025-11-17T04:36:01.783832

## Results Summary

| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |
|---------|------|-----------|----------|-------------|-----------|----------|
| deferred-import | light_load | 0.69 | 1.45x | 25.49 | 0.00 | ✅ |
| lazi 👑 | light_load | 0.36 | 0.75x | 26.46 | 0.00 | ✅ |
| lazy-imports | light_load | 0.88 | 1.85x | 25.76 | 0.00 | ✅ |
| lazy-imports-lite | light_load | 0.51 | 1.08x | 26.52 | 0.00 | ✅ |
| lazy-loader | light_load | 0.65 | 1.36x | 25.61 | 0.00 | ✅ |
| lazy_import | light_load | 1.14 | 2.40x | 26.05 | 0.00 | ✅ |
| pipimport | light_load | 0.00 | 1.00x | 0.00 | 0.00 | ❌ |
| pylazyimports | light_load | 0.60 | 1.26x | 26.34 | 0.00 | ✅ |
| xwlazy | light_load | 0.63 | 1.31x | 26.59 | 0.00 | ✅ |

## Detailed Results

### deferred-import

**Test:** light_load

- Import Time: 0.69 ms
- Relative Time: 1.45x (vs baseline)
- Memory Peak: 25.49 MB
- Memory Avg: 25.21 MB
- Package Size: 0.00 MB
- Features: deferred_loading

### lazi 👑

**Test:** light_load 👑

- Import Time: 0.36 ms
- Relative Time: 0.75x (vs baseline)
- Memory Peak: 26.46 MB
- Memory Avg: 26.46 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_detection

### lazy-imports

**Test:** light_load

- Import Time: 0.88 ms
- Relative Time: 1.85x (vs baseline)
- Memory Peak: 25.76 MB
- Memory Avg: 25.72 MB
- Package Size: 0.00 MB
- Features: lazy_import

### lazy-imports-lite

**Test:** light_load

- Import Time: 0.51 ms
- Relative Time: 1.08x (vs baseline)
- Memory Peak: 26.52 MB
- Memory Avg: 26.51 MB
- Package Size: 0.00 MB
- Features: lazy_import, keyword_detection

### lazy-loader

**Test:** light_load

- Import Time: 0.65 ms
- Relative Time: 1.36x (vs baseline)
- Memory Peak: 25.61 MB
- Memory Avg: 25.60 MB
- Package Size: 0.00 MB
- Features: lazy_import, caching

### lazy_import

**Test:** light_load

- Import Time: 1.14 ms
- Relative Time: 2.40x (vs baseline)
- Memory Peak: 26.05 MB
- Memory Avg: 25.95 MB
- Package Size: 0.00 MB
- Features: lazy_import

### pipimport

**Test:** light_load

- ❌ Error: Library pipimport is not compatible with Python 3 (Python 2 syntax detected)

### pylazyimports

**Test:** light_load

- Import Time: 0.60 ms
- Relative Time: 1.26x (vs baseline)
- Memory Peak: 26.34 MB
- Memory Avg: 26.29 MB
- Package Size: 0.00 MB
- Features: lazy_import

### xwlazy

**Test:** light_load

- Import Time: 0.63 ms
- Relative Time: 1.31x (vs baseline)
- Memory Peak: 26.59 MB
- Memory Avg: 26.58 MB
- Package Size: 0.00 MB
- Features: lazy_import, auto_install, keyword_detection, per_package_isolation, performance_monitoring, caching


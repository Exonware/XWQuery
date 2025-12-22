# Fastest Mode Analysis: xwlazy Comprehensive Benchmark

**Date:** November 19, 2025  
**Total Combinations Tested:** 100 (96 new + 4 old baseline)

---

## 🏆 FASTEST MODE OVERALL

**Winner: `cached + full` @ `light_load`**
- **Time**: **1.482 ms** ⚡
- **Memory**: 171.33 MB
- **Relative**: 1.12x baseline

This is the **fastest combination** across all tested scenarios!

---

## 📊 Fastest Mode by Load Level

### Light Load (Fastest: `cached + full`)
| Rank | Mode | Time (ms) | Memory (MB) |
|------|------|-----------|-------------|
| 🥇 1st | **cached + full** | **1.482** | 171.33 |
| 🥈 2nd | cached + temporary | 1.644 | 184.68 |
| 🥉 3rd | cached + size_aware | 1.816 | 190.75 |
| 4th | auto + full | 1.829 | 52.42 |
| 5th | preload + clean | 1.888 | 98.89 |

**Key Insight**: Cached load mode with full install mode is fastest for light loads.

---

### Medium Load (Fastest: `preload + none`)
| Rank | Mode | Time (ms) | Memory (MB) |
|------|------|-----------|-------------|
| 🥇 1st | **preload + none** | **8.987** | 78.50 |
| 🥈 2nd | auto + full | 9.255 | 52.43 |
| 🥉 3rd | background + clean | 9.386 | 138.66 |
| 4th | cached + size_aware | 9.388 | 190.91 |
| 5th | cached + smart | 9.456 | 164.73 |

**Key Insight**: Preload mode with no installation is fastest for medium loads.

---

### Heavy Load (Fastest: `background + clean`)
| Rank | Mode | Time (ms) | Memory (MB) |
|------|------|-----------|-------------|
| 🥇 1st | **background + clean** | **32.416** | 138.71 |
| 🥈 2nd | preload + none | 33.027 | 78.51 |
| 🥉 3rd | auto + temporary | 33.827 | 65.54 |
| 4th | auto + clean | 33.861 | 59.02 |
| 5th | preload + temporary | 34.308 | 105.55 |

**Key Insight**: Background loading with clean install mode is fastest for heavy loads.

---

### Enterprise Load (Fastest: `cached + none`)
| Rank | Mode | Time (ms) | Memory (MB) |
|------|------|-----------|-------------|
| 🥇 1st | **cached + none** | **82.161** | 164.64 |
| 🥈 2nd | background + clean | 82.243 | 144.97 |
| 🥉 3rd | background + full | 82.543 | 138.60 |
| 4th | background + temporary | 83.211 | 152.26 |
| 5th | auto + size_aware | 84.768 | 78.33 |

**Key Insight**: Cached mode with no installation is fastest for enterprise loads.

---

## 🔄 Old vs New xwlazy Comparison

### Performance Improvements

| Load Level | Old (ms) | New Best (ms) | Improvement |
|------------|----------|---------------|-------------|
| **Light Load** | 3.545 | **1.482** | **+58.2% faster** 🚀 |
| **Medium Load** | 11.529 | **8.987** | **+22.0% faster** |
| **Heavy Load** | 37.965 | **32.416** | **+14.6% faster** |
| **Enterprise Load** | 98.443 | **82.161** | **+16.5% faster** |

**Key Findings:**
- ✅ **New version is consistently faster** across all load levels
- ✅ **Biggest improvement**: Light load (58.2% faster)
- ✅ **Average improvement**: ~27.8% faster

---

## 📈 Mode Performance Analysis

### Load Mode Performance Ranking (Average Time)

1. **CACHED** - Best for light/enterprise loads
   - Fastest: 1.482 ms (cached + full @ light_load)
   - Average: ~35 ms across all scenarios

2. **AUTO** - Balanced performance
   - Fastest: 1.829 ms (auto + full @ light_load)
   - Average: ~36 ms across all scenarios

3. **PRELOAD** - Best for medium loads
   - Fastest: 8.987 ms (preload + none @ medium_load)
   - Average: ~37 ms across all scenarios

4. **BACKGROUND** - Best for heavy loads
   - Fastest: 32.416 ms (background + clean @ heavy_load)
   - Average: ~38 ms across all scenarios

### Install Mode Performance Ranking (Average Time)

1. **FULL** - Fastest overall (1.482 ms best)
2. **NONE** - Best for enterprise loads (82.161 ms best)
3. **CLEAN** - Best for heavy loads (32.416 ms best)
4. **TEMPORARY** - Good balance (1.644 ms best)
5. **SIZE_AWARE** - Good for enterprise (84.768 ms best)
6. **SMART** - Moderate performance (1.947 ms best)

---

## 🎯 Recommendations

### For Light Loads
**Use: `cached + full`**
- Fastest: 1.482 ms
- Memory: 171.33 MB
- Best for: Quick imports with full dependency installation

### For Medium Loads
**Use: `preload + none`**
- Fastest: 8.987 ms
- Memory: 78.50 MB
- Best for: Preloading modules without auto-installation

### For Heavy Loads
**Use: `background + clean`**
- Fastest: 32.416 ms
- Memory: 138.71 MB
- Best for: Background loading with clean install/uninstall

### For Enterprise Loads
**Use: `cached + none`**
- Fastest: 82.161 ms
- Memory: 164.64 MB
- Best for: Large-scale applications with cached loading

---

## 📊 Complete Statistics

- **Total Tests**: 100
- **Successful**: 100 (100%)
- **Failed**: 0 (0%)
- **Average Time**: 36.055 ms
- **Min Time**: 1.482 ms (cached + full @ light_load)
- **Max Time**: 106.128 ms (cached + smart @ enterprise_load)
- **Average Memory**: 116.64 MB
- **Min Memory**: 30.35 MB (auto + none @ light_load)
- **Max Memory**: 197.79 MB (cached + size_aware @ enterprise_load)

---

## ✅ Key Takeaways

1. **Fastest Overall**: `cached + full` mode combination
2. **Best for Light Loads**: `cached + full` (1.482 ms)
3. **Best for Medium Loads**: `preload + none` (8.987 ms)
4. **Best for Heavy Loads**: `background + clean` (32.416 ms)
5. **Best for Enterprise**: `cached + none` (82.161 ms)
6. **New vs Old**: New version is 14-58% faster depending on load level
7. **All modes tested**: 4 load modes × 6 install modes × 4 load levels = 96 combinations
8. **All tests successful**: 100% success rate

---

## 📝 Notes

- All tests ensure `lazy_load != None` (NONE load mode excluded)
- Old version baseline uses default `auto + none` mode
- Memory usage varies significantly by mode combination
- Cached mode shows best performance for light and enterprise loads
- Background mode excels for heavy loads
- Preload mode is optimal for medium loads

---

**Full detailed report**: See `BENCH_20251119_024556_ALL_MODES_COMPREHENSIVE.md`  
**JSON data**: See `BENCH_20251119_024556_ALL_MODES_COMPREHENSIVE.json`


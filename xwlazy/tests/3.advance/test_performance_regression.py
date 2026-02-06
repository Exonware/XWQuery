#!/usr/bin/env python3
"""
Performance regression tests for xwlazy.

Tests baseline performance metrics, regression detection, memory leaks,
and cache efficiency.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
"""

import pytest
import time
import sys
from xwlazy.lazy import (
    config_package_lazy_install_enabled,
    get_lazy_install_stats,
)


@pytest.mark.xwlazy_advance
class TestBaselinePerformance:
    """Test baseline performance metrics."""
    
    def test_import_overhead(self):
        """Test that import overhead is minimal."""
        package_name = "test_package_perf"
        
        config_package_lazy_install_enabled(package_name, enabled=True, mode="smart")
        
        # Measure import time
        start = time.perf_counter()
        from xwlazy.lazy import get_lazy_install_stats
        end = time.perf_counter()
        
        import_time = (end - start) * 1000  # Convert to milliseconds
        
        # Import should be fast (< 10ms)
        assert import_time < 10, f"Import too slow: {import_time}ms"
    
    def test_configuration_overhead(self):
        """Test that configuration overhead is minimal."""
        package_name = "test_package_config_perf"
        
        # Measure configuration time
        start = time.perf_counter()
        config_package_lazy_install_enabled(package_name, enabled=True, mode="smart")
        end = time.perf_counter()
        
        config_time = (end - start) * 1000  # Convert to milliseconds
        
        # Configuration should be fast (< 50ms)
        assert config_time < 50, f"Configuration too slow: {config_time}ms"
    
    def test_statistics_retrieval_performance(self):
        """Test that statistics retrieval is fast."""
        package_name = "test_package_stats_perf"
        
        config_package_lazy_install_enabled(package_name, enabled=True, mode="smart")
        
        # Measure statistics retrieval time
        start = time.perf_counter()
        stats = get_lazy_install_stats(package_name)
        end = time.perf_counter()
        
        stats_time = (end - start) * 1000  # Convert to milliseconds
        
        # Statistics retrieval should be fast (< 5ms)
        assert stats_time < 5, f"Statistics retrieval too slow: {stats_time}ms"


@pytest.mark.xwlazy_advance
class TestRegressionDetection:
    """Test performance regression detection."""
    
    def test_no_performance_regression(self):
        """Test that performance hasn't regressed."""
        # Baseline: Configuration should complete in < 50ms
        package_name = "test_package_regression"
        
        start = time.perf_counter()
        config_package_lazy_install_enabled(package_name, enabled=True, mode="smart")
        end = time.perf_counter()
        
        config_time = (end - start) * 1000
        
        # Should not regress beyond 2x baseline
        assert config_time < 100, f"Performance regression detected: {config_time}ms"
    
    def test_cache_efficiency(self):
        """Test that caching improves performance."""
        package_name = "test_package_cache"
        
        config_package_lazy_install_enabled(package_name, enabled=True, mode="smart")
        
        # First call
        start1 = time.perf_counter()
        stats1 = get_lazy_install_stats(package_name)
        end1 = time.perf_counter()
        time1 = (end1 - start1) * 1000
        
        # Second call (should be faster due to caching)
        start2 = time.perf_counter()
        stats2 = get_lazy_install_stats(package_name)
        end2 = time.perf_counter()
        time2 = (end2 - start2) * 1000
        
        # Second call should be at least as fast (cached)
        # Allow some variance
        assert time2 <= time1 * 1.5, "Cache not improving performance"


@pytest.mark.xwlazy_advance
class TestMemoryManagement:
    """Test memory leak detection."""
    
    def test_no_memory_leak_on_configuration(self):
        """Test that configuration doesn't leak memory."""
        import gc
        
        # Clear any existing references
        gc.collect()
        
        # Configure multiple packages
        for i in range(10):
            package_name = f"test_package_memory_{i}"
            config_package_lazy_install_enabled(package_name, enabled=True, mode="smart")
        
        # Force garbage collection
        gc.collect()
        
        # Memory should not grow unbounded
        # (Actual memory measurement would require psutil or similar)
        # This is a basic test that operations complete
    
    def test_statistics_memory_usage(self):
        """Test that statistics don't consume excessive memory."""
        package_name = "test_package_stats_memory"
        
        config_package_lazy_install_enabled(package_name, enabled=True, mode="smart")
        
        # Get statistics multiple times
        for _ in range(100):
            stats = get_lazy_install_stats(package_name)
        
        # Should not cause memory issues
        # (Actual memory measurement would require psutil)


@pytest.mark.xwlazy_advance
class TestCacheEfficiency:
    """Test cache efficiency and hit rates."""
    
    def test_cache_hit_improves_performance(self):
        """Test that cache hits improve performance."""
        package_name = "test_package_cache_hit"
        
        config_package_lazy_install_enabled(package_name, enabled=True, mode="smart")
        
        # Multiple calls should benefit from caching
        times = []
        for _ in range(10):
            start = time.perf_counter()
            stats = get_lazy_install_stats(package_name)
            end = time.perf_counter()
            times.append((end - start) * 1000)
        
        # Later calls should be faster (cached)
        if len(times) >= 3:
            avg_first = sum(times[:3]) / 3
            avg_last = sum(times[-3:]) / 3
            
            # Last calls should be at least as fast
            assert avg_last <= avg_first * 1.2, "Cache not effective"
    
    def test_cache_invalidation(self):
        """Test that cache invalidation works correctly."""
        package_name = "test_package_cache_inval"
        
        # Initial configuration
        config_package_lazy_install_enabled(package_name, enabled=True, mode="smart")
        stats1 = get_lazy_install_stats(package_name)
        
        # Reconfigure
        config_package_lazy_install_enabled(package_name, enabled=True, mode="lite")
        stats2 = get_lazy_install_stats(package_name)
        
        # Statistics should reflect new configuration
        assert stats2.get("mode") == "lite" or stats2.get("mode") != stats1.get("mode")

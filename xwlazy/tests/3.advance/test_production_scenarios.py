#!/usr/bin/env python3
"""
Production scenario tests for xwlazy.

Tests high-load scenarios, concurrent access patterns, error recovery,
and resource cleanup.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
"""

import pytest
import threading
import time
from concurrent.futures import ThreadPoolExecutor
from xwlazy.lazy import (
    config_package_lazy_install_enabled,
    get_lazy_install_stats,
)


@pytest.mark.xwlazy_advance
class TestHighLoadScenarios:
    """Test high-load scenarios."""
    
    def test_concurrent_configuration(self):
        """Test concurrent configuration from multiple threads."""
        num_threads = 10
        num_packages = 5
        
        def configure_packages(thread_id):
            """Configure packages from a thread."""
            for i in range(num_packages):
                package_name = f"test_package_thread_{thread_id}_{i}"
                try:
                    config_package_lazy_install_enabled(
                        package_name,
                        enabled=True,
                        mode="smart"
                    )
                except Exception as e:
                    # Thread-safe operations should not raise exceptions
                    pytest.fail(f"Thread {thread_id} failed: {e}")
        
        # Run concurrent configuration
        with ThreadPoolExecutor(max_workers=num_threads) as executor:
            futures = [executor.submit(configure_packages, i) for i in range(num_threads)]
            
            # Wait for all threads
            for future in futures:
                future.result()  # Will raise if thread failed
        
        # Verify all packages configured
        for thread_id in range(num_threads):
            for i in range(num_packages):
                package_name = f"test_package_thread_{thread_id}_{i}"
                stats = get_lazy_install_stats(package_name)
                assert stats.get("enabled") is True
    
    def test_high_frequency_statistics_retrieval(self):
        """Test high-frequency statistics retrieval."""
        package_name = "test_package_high_freq"
        
        config_package_lazy_install_enabled(package_name, enabled=True, mode="smart")
        
        # Retrieve statistics many times
        for _ in range(1000):
            stats = get_lazy_install_stats(package_name)
            assert stats is not None


@pytest.mark.xwlazy_advance
class TestConcurrentAccess:
    """Test concurrent access patterns."""
    
    def test_thread_safe_statistics(self):
        """Test that statistics retrieval is thread-safe."""
        package_name = "test_package_thread_safe"
        
        config_package_lazy_install_enabled(package_name, enabled=True, mode="smart")
        
        results = []
        errors = []
        
        def get_stats():
            """Get statistics from a thread."""
            try:
                stats = get_lazy_install_stats(package_name)
                results.append(stats)
            except Exception as e:
                errors.append(e)
        
        # Run from multiple threads
        threads = [threading.Thread(target=get_stats) for _ in range(20)]
        for t in threads:
            t.start()
        for t in threads:
            t.join()
        
        # Should have no errors
        assert len(errors) == 0, f"Thread safety errors: {errors}"
        
        # All results should be valid
        assert len(results) == 20
        for stats in results:
            assert stats is not None
            assert stats.get("enabled") is True
    
    def test_concurrent_configuration_safety(self):
        """Test that concurrent configuration is safe."""
        package_name = "test_package_concurrent_config"
        
        def configure():
            """Configure from a thread."""
            config_package_lazy_install_enabled(package_name, enabled=True, mode="smart")
        
        # Configure from multiple threads simultaneously
        threads = [threading.Thread(target=configure) for _ in range(10)]
        for t in threads:
            t.start()
        for t in threads:
            t.join()
        
        # Should still work after concurrent configuration
        stats = get_lazy_install_stats(package_name)
        assert stats.get("enabled") is True


@pytest.mark.xwlazy_advance
class TestErrorRecovery:
    """Test error recovery scenarios."""
    
    def test_invalid_configuration_recovery(self):
        """Test recovery from invalid configuration."""
        package_name = "test_package_error_recovery"
        
        # Try invalid mode (should handle gracefully)
        try:
            config_package_lazy_install_enabled(
                package_name,
                enabled=True,
                mode="invalid_mode"
            )
        except Exception:
            # Invalid mode should raise or be handled
            pass
        
        # Should still be able to configure with valid mode
        config_package_lazy_install_enabled(package_name, enabled=True, mode="smart")
        stats = get_lazy_install_stats(package_name)
        assert stats.get("enabled") is True
    
    def test_statistics_after_error(self):
        """Test that statistics work after errors."""
        package_name = "test_package_stats_after_error"
        
        # Configure
        config_package_lazy_install_enabled(package_name, enabled=True, mode="smart")
        
        # Cause an error (invalid package name, etc.)
        try:
            invalid_stats = get_lazy_install_stats("nonexistent_package_xyz")
        except Exception:
            pass
        
        # Should still work for valid package
        stats = get_lazy_install_stats(package_name)
        assert stats is not None


@pytest.mark.xwlazy_advance
class TestResourceCleanup:
    """Test resource cleanup and management."""
    
    def test_configuration_cleanup(self):
        """Test that configurations can be cleaned up."""
        package_name = "test_package_cleanup"
        
        # Configure
        config_package_lazy_install_enabled(package_name, enabled=True, mode="smart")
        stats1 = get_lazy_install_stats(package_name)
        assert stats1.get("enabled") is True
        
        # Disable
        config_package_lazy_install_enabled(package_name, enabled=False)
        stats2 = get_lazy_install_stats(package_name)
        assert stats2.get("enabled") is False
    
    def test_multiple_package_management(self):
        """Test management of multiple packages."""
        num_packages = 50
        
        # Configure many packages
        for i in range(num_packages):
            package_name = f"test_package_multi_{i}"
            config_package_lazy_install_enabled(package_name, enabled=True, mode="smart")
        
        # Verify all are configured
        for i in range(num_packages):
            package_name = f"test_package_multi_{i}"
            stats = get_lazy_install_stats(package_name)
            assert stats.get("enabled") is True
        
        # Disable all
        for i in range(num_packages):
            package_name = f"test_package_multi_{i}"
            config_package_lazy_install_enabled(package_name, enabled=False)
        
        # Verify all are disabled
        for i in range(num_packages):
            package_name = f"test_package_multi_{i}"
            stats = get_lazy_install_stats(package_name)
            assert stats.get("enabled") is False

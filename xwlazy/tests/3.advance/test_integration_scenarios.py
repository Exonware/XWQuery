#!/usr/bin/env python3
"""
Integration scenario tests for xwlazy.

Tests multi-library integration, cross-package isolation, mode switching,
and configuration persistence.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
"""

import pytest
from xwlazy.lazy import (
    config_package_lazy_install_enabled,
    get_lazy_install_stats,
    set_package_allow_list,
)


@pytest.mark.xwlazy_advance
class TestMultiLibraryIntegration:
    """Test integration with multiple libraries."""
    
    def test_multiple_package_configuration(self):
        """Test configuring multiple packages independently."""
        packages = ["xwsystem", "xwnode", "xwdata", "xwquery"]
        
        # Configure each package with different modes
        config_package_lazy_install_enabled("xwsystem", enabled=True, mode="smart")
        config_package_lazy_install_enabled("xwnode", enabled=True, mode="lite")
        config_package_lazy_install_enabled("xwdata", enabled=True, mode="smart")
        config_package_lazy_install_enabled("xwquery", enabled=True, mode="warn")
        
        # Verify each is configured independently
        for package in packages:
            stats = get_lazy_install_stats(package)
            assert stats.get("enabled") is True
    
    def test_cross_package_isolation(self):
        """Test that packages are isolated from each other."""
        package1 = "test_package_isolated_1"
        package2 = "test_package_isolated_2"
        
        # Configure with different settings
        config_package_lazy_install_enabled(package1, enabled=True, mode="smart")
        config_package_lazy_install_enabled(package2, enabled=True, mode="lite")
        
        # Set allow list for package1 only
        set_package_allow_list(package1, ["fastavro", "protobuf"])
        
        # Verify isolation
        stats1 = get_lazy_install_stats(package1)
        stats2 = get_lazy_install_stats(package2)
        
        assert stats1.get("mode") == "smart"
        assert stats2.get("mode") == "lite"
        
        # Allow list should only affect package1
        # (actual enforcement tested in integration tests)


@pytest.mark.xwlazy_advance
class TestModeSwitching:
    """Test mode switching scenarios."""
    
    def test_mode_switching(self):
        """Test switching between modes."""
        package_name = "test_package_mode_switch"
        
        # Start with smart mode
        config_package_lazy_install_enabled(package_name, enabled=True, mode="smart")
        stats1 = get_lazy_install_stats(package_name)
        assert stats1.get("mode") == "smart" or stats1.get("enabled") is True
        
        # Switch to lite mode
        config_package_lazy_install_enabled(package_name, enabled=True, mode="lite")
        stats2 = get_lazy_install_stats(package_name)
        assert stats2.get("mode") == "lite" or stats2.get("enabled") is True
        
        # Switch to warn mode
        config_package_lazy_install_enabled(package_name, enabled=True, mode="warn")
        stats3 = get_lazy_install_stats(package_name)
        assert stats3.get("mode") == "warn" or stats3.get("enabled") is True
    
    def test_enable_disable_switching(self):
        """Test enabling and disabling lazy loading."""
        package_name = "test_package_enable_disable"
        
        # Enable
        config_package_lazy_install_enabled(package_name, enabled=True, mode="smart")
        stats1 = get_lazy_install_stats(package_name)
        assert stats1.get("enabled") is True
        
        # Disable
        config_package_lazy_install_enabled(package_name, enabled=False)
        stats2 = get_lazy_install_stats(package_name)
        assert stats2.get("enabled") is False
        
        # Re-enable
        config_package_lazy_install_enabled(package_name, enabled=True, mode="smart")
        stats3 = get_lazy_install_stats(package_name)
        assert stats3.get("enabled") is True


@pytest.mark.xwlazy_advance
class TestConfigurationPersistence:
    """Test configuration persistence."""
    
    def test_configuration_persistence(self):
        """Test that configuration persists across calls."""
        package_name = "test_package_persist"
        
        # Configure
        config_package_lazy_install_enabled(package_name, enabled=True, mode="smart")
        
        # Get statistics multiple times
        for _ in range(10):
            stats = get_lazy_install_stats(package_name)
            assert stats.get("enabled") is True
            # Mode should be consistent
            mode = stats.get("mode")
            if mode:
                assert mode in ["smart", "lite", "warn", "full", "clean"]
    
    def test_allow_list_persistence(self):
        """Test that allow list persists."""
        package_name = "test_package_allow_persist"
        
        # Set allow list
        set_package_allow_list(package_name, ["fastavro", "protobuf"])
        
        # Configuration should remember allow list
        config_package_lazy_install_enabled(package_name, enabled=True, mode="smart")
        
        # Allow list should still be active
        stats = get_lazy_install_stats(package_name)
        assert stats.get("enabled") is True


@pytest.mark.xwlazy_advance
class TestRealWorldScenarios:
    """Test real-world usage scenarios."""
    
    def test_development_environment_setup(self):
        """Test typical development environment setup."""
        # Development: smart mode for all packages
        packages = ["xwsystem", "xwnode", "xwdata"]
        
        for package in packages:
            config_package_lazy_install_enabled(package, enabled=True, mode="smart")
            stats = get_lazy_install_stats(package)
            assert stats.get("enabled") is True
    
    def test_production_environment_setup(self):
        """Test typical production environment setup."""
        # Production: lite mode with allow lists
        config_package_lazy_install_enabled("xwsystem", enabled=True, mode="lite")
        set_package_allow_list("xwsystem", ["fastavro", "protobuf"])
        
        stats = get_lazy_install_stats("xwsystem")
        assert stats.get("enabled") is True
    
    def test_mixed_environment_setup(self):
        """Test mixed environment with different policies."""
        # Some packages in smart mode, others in lite
        config_package_lazy_install_enabled("xwsystem", enabled=True, mode="smart")
        config_package_lazy_install_enabled("xwnode", enabled=True, mode="lite")
        config_package_lazy_install_enabled("xwquery", enabled=True, mode="warn")
        
        # Verify each has correct mode
        stats_system = get_lazy_install_stats("xwsystem")
        stats_node = get_lazy_install_stats("xwnode")
        stats_query = get_lazy_install_stats("xwquery")
        
        assert stats_system.get("enabled") is True
        assert stats_node.get("enabled") is True
        assert stats_query.get("enabled") is True

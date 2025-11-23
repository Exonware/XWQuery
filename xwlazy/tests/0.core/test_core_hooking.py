"""
Core Tests: Hooking and Configuration

Tests the hooking mechanism and configuration API.
Fast, high-value tests covering critical functionality.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.1.0.18
Generation Date: 15-Nov-2025
"""

import pytest
import sys
from pathlib import Path

# Add src to path
tests_dir = Path(__file__).resolve().parent.parent
project_root = tests_dir.parent
src_path = project_root / "src"
if str(src_path) not in sys.path:
    sys.path.insert(0, str(src_path))

from exonware.xwlazy import (
    config_package_lazy_install_enabled,
    config_module_lazy_load_enabled,
    is_lazy_install_enabled,
    is_lazy_import_enabled,
)
from exonware.xwlazy.package.services.config_manager import LazyInstallConfig
from exonware.xwlazy.package.services.strategy_registry import StrategyRegistry
from exonware.xwlazy.package.strategies import PipExecution, SmartTiming
from exonware.xwlazy.module.strategies import LazyHelper


@pytest.mark.xwlazy_core
class TestConfigurationAPI:
    """Test configuration API functions."""
    
    def test_config_package_lazy_install_enabled_basic(self):
        """Test basic package configuration."""
        result = config_package_lazy_install_enabled("test_pkg", enabled=True, install_hook=False)
        assert result == True
        assert LazyInstallConfig.is_enabled("test_pkg") == True
    
    def test_config_package_lazy_install_enabled_with_strategies(self):
        """Test package configuration with custom strategies."""
        exec_strategy = PipExecution()
        timing_strategy = SmartTiming()
        
        result = config_package_lazy_install_enabled(
            "test_pkg",
            enabled=True,
            install_hook=False,
            execution_strategy=exec_strategy,
            timing_strategy=timing_strategy,
        )
        assert result == True
        
        # Verify strategies were stored
        assert StrategyRegistry.get_package_strategy("test_pkg", "execution") is exec_strategy
        assert StrategyRegistry.get_package_strategy("test_pkg", "timing") is timing_strategy
        
        # Cleanup
        StrategyRegistry.clear_all_strategies("test_pkg")
    
    def test_config_module_lazy_load_enabled_basic(self):
        """Test basic module configuration."""
        result = config_module_lazy_load_enabled("test_pkg", enabled=True)
        assert result == True
    
    def test_config_module_lazy_load_enabled_with_strategies(self):
        """Test module configuration with custom strategies."""
        helper_strategy = LazyHelper()
        
        result = config_module_lazy_load_enabled(
            "test_pkg",
            enabled=True,
            helper_strategy=helper_strategy,
        )
        assert result == True
        
        # Verify strategy was stored
        assert StrategyRegistry.get_module_strategy("test_pkg", "helper") is helper_strategy
        
        # Cleanup
        StrategyRegistry.clear_all_strategies("test_pkg")
    
    def test_is_lazy_install_enabled(self):
        """Test is_lazy_install_enabled function."""
        config_package_lazy_install_enabled("test_pkg", enabled=True, install_hook=False)
        assert is_lazy_install_enabled("test_pkg") == True
        
        config_package_lazy_install_enabled("test_pkg", enabled=False, install_hook=False)
        assert is_lazy_install_enabled("test_pkg") == False


@pytest.mark.xwlazy_core
class TestStrategySelection:
    """Test strategy selection and retrieval."""
    
    def test_strategy_selection_via_config(self):
        """Test strategies can be selected via config function."""
        from exonware.xwlazy.package.facade import XWPackageHelper
        
        custom_exec = PipExecution()
        custom_timing = SmartTiming()
        
        config_package_lazy_install_enabled(
            "test_pkg",
            enabled=True,
            install_hook=False,
            execution_strategy=custom_exec,
            timing_strategy=custom_timing,
        )
        
        # Create helper - should use registered strategies
        helper = XWPackageHelper("test_pkg")
        assert helper._execution is custom_exec
        assert helper._timing is custom_timing
        
        # Cleanup
        StrategyRegistry.clear_all_strategies("test_pkg")
    
    def test_strategy_selection_via_module_config(self):
        """Test module strategies can be selected via config function."""
        from exonware.xwlazy.module.facade import XWModuleHelper
        
        custom_helper = LazyHelper()
        
        config_module_lazy_load_enabled(
            "test_pkg",
            enabled=True,
            helper_strategy=custom_helper,
        )
        
        # Create helper - should use registered strategy
        helper = XWModuleHelper("test_pkg")
        assert helper._helper is custom_helper
        
        # Cleanup
        StrategyRegistry.clear_all_strategies("test_pkg")


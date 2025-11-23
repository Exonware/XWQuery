"""
Core Tests: Strategy Pattern Coverage

Tests all strategy types to ensure they work correctly.
Fast, high-value tests covering 80% of functionality.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.1.0.18
Generation Date: 15-Nov-2025
"""

import pytest
import sys
from pathlib import Path
from typing import List, Dict, Optional, Any, Tuple

# Add src to path
tests_dir = Path(__file__).resolve().parent.parent
project_root = tests_dir.parent
src_path = project_root / "src"
if str(src_path) not in sys.path:
    sys.path.insert(0, str(src_path))

from exonware.xwlazy.contracts import (
    IInstallExecutionStrategy,
    IInstallTimingStrategy,
    IDiscoveryStrategy,
    IPolicyStrategy,
    IMappingStrategy,
    IModuleHelperStrategy,
    IModuleManagerStrategy,
    ICachingStrategy,
)
from exonware.xwlazy.package.base import (
    AInstallExecutionStrategy,
    AInstallTimingStrategy,
    ADiscoveryStrategy,
    APolicyStrategy,
    AMappingStrategy,
)
from exonware.xwlazy.package.strategies import (
    # Execution
    PipExecution,
    WheelExecution,
    CachedExecution,
    AsyncExecution,
    # Timing
    SmartTiming,
    FullTiming,
    CleanTiming,
    TemporaryTiming,
    # Discovery
    FileBasedDiscovery,
    ManifestBasedDiscovery,
    HybridDiscovery,
    # Policy
    PermissivePolicy,
    AllowListPolicy,
    DenyListPolicy,
    # Mapping
    ManifestFirstMapping,
    DiscoveryFirstMapping,
    HybridMapping,
)
from exonware.xwlazy.module.strategies import (
    SimpleHelper,
    LazyHelper,
    SimpleManager,
    AdvancedManager,
)
from exonware.xwlazy.common.strategies import LRUCache
from exonware.xwlazy.package.services.install_result import InstallResult, InstallStatus
from exonware.xwlazy.defs import LazyInstallMode


@pytest.mark.xwlazy_core
class TestPackageExecutionStrategies:
    """Test all package execution strategies."""
    
    def test_pip_execution_initialization(self):
        """Test PipExecution can be instantiated."""
        strategy = PipExecution()
        assert isinstance(strategy, AInstallExecutionStrategy)
        assert isinstance(strategy, IInstallExecutionStrategy)
    
    def test_wheel_execution_initialization(self):
        """Test WheelExecution can be instantiated."""
        strategy = WheelExecution()
        assert isinstance(strategy, AInstallExecutionStrategy)
        assert isinstance(strategy, IInstallExecutionStrategy)
    
    def test_cached_execution_initialization(self):
        """Test CachedExecution can be instantiated."""
        strategy = CachedExecution()
        assert isinstance(strategy, AInstallExecutionStrategy)
        assert isinstance(strategy, IInstallExecutionStrategy)
    
    def test_async_execution_initialization(self):
        """Test AsyncExecution can be instantiated."""
        strategy = AsyncExecution()
        assert isinstance(strategy, AInstallExecutionStrategy)
        assert isinstance(strategy, IInstallExecutionStrategy)


@pytest.mark.xwlazy_core
class TestPackageTimingStrategies:
    """Test all package timing strategies."""
    
    def test_smart_timing_initialization(self):
        """Test SmartTiming can be instantiated."""
        strategy = SmartTiming()
        assert isinstance(strategy, AInstallTimingStrategy)
        assert isinstance(strategy, IInstallTimingStrategy)
    
    def test_smart_timing_should_install_now(self):
        """Test SmartTiming should_install_now logic."""
        strategy = SmartTiming()
        # Smart mode: install when context indicates need
        assert strategy.should_install_now("test_pkg", None) == False
        assert strategy.should_install_now("test_pkg", {"need": True}) == True
    
    def test_smart_timing_should_uninstall_after(self):
        """Test SmartTiming should_uninstall_after logic."""
        strategy = SmartTiming()
        # Smart mode: keep installed
        assert strategy.should_uninstall_after("test_pkg", None) == False
    
    def test_full_timing_initialization(self):
        """Test FullTiming can be instantiated."""
        strategy = FullTiming()
        assert isinstance(strategy, AInstallTimingStrategy)
        assert isinstance(strategy, IInstallTimingStrategy)
    
    def test_full_timing_should_install_now(self):
        """Test FullTiming should_install_now logic."""
        strategy = FullTiming()
        # Full mode: always install now
        assert strategy.should_install_now("test_pkg", None) == True
    
    def test_clean_timing_initialization(self):
        """Test CleanTiming can be instantiated."""
        strategy = CleanTiming()
        assert isinstance(strategy, AInstallTimingStrategy)
        assert isinstance(strategy, IInstallTimingStrategy)
    
    def test_temporary_timing_initialization(self):
        """Test TemporaryTiming can be instantiated."""
        strategy = TemporaryTiming()
        assert isinstance(strategy, AInstallTimingStrategy)
        assert isinstance(strategy, IInstallTimingStrategy)
    
    def test_temporary_timing_should_uninstall_after(self):
        """Test TemporaryTiming should_uninstall_after logic."""
        strategy = TemporaryTiming()
        # Temporary mode: always uninstall after
        assert strategy.should_uninstall_after("test_pkg", None) == True


@pytest.mark.xwlazy_core
class TestPackageDiscoveryStrategies:
    """Test all package discovery strategies."""
    
    def test_file_based_discovery_initialization(self):
        """Test FileBasedDiscovery can be instantiated."""
        strategy = FileBasedDiscovery("test_pkg")
        assert isinstance(strategy, ADiscoveryStrategy)
        assert isinstance(strategy, IDiscoveryStrategy)
    
    def test_manifest_based_discovery_initialization(self):
        """Test ManifestBasedDiscovery can be instantiated."""
        strategy = ManifestBasedDiscovery("test_pkg")
        assert isinstance(strategy, ADiscoveryStrategy)
        assert isinstance(strategy, IDiscoveryStrategy)
    
    def test_hybrid_discovery_initialization(self):
        """Test HybridDiscovery can be instantiated."""
        strategy = HybridDiscovery("test_pkg")
        assert isinstance(strategy, ADiscoveryStrategy)
        assert isinstance(strategy, IDiscoveryStrategy)


@pytest.mark.xwlazy_core
class TestPackagePolicyStrategies:
    """Test all package policy strategies."""
    
    def test_permissive_policy_initialization(self):
        """Test PermissivePolicy can be instantiated."""
        strategy = PermissivePolicy()
        assert isinstance(strategy, APolicyStrategy)
        assert isinstance(strategy, IPolicyStrategy)
    
    def test_permissive_policy_allows_all(self):
        """Test PermissivePolicy allows all packages."""
        strategy = PermissivePolicy()
        allowed, reason = strategy.is_allowed("any_package")
        assert allowed == True
        assert "allows" in reason.lower() or "allowed" in reason.lower()
    
    def test_allow_list_policy_initialization(self):
        """Test AllowListPolicy can be instantiated."""
        strategy = AllowListPolicy(allowed_packages={"pkg1", "pkg2"})
        assert isinstance(strategy, APolicyStrategy)
        assert isinstance(strategy, IPolicyStrategy)
    
    def test_allow_list_policy_allows_listed(self):
        """Test AllowListPolicy allows listed packages."""
        strategy = AllowListPolicy(allowed_packages={"pkg1", "pkg2"})
        allowed, reason = strategy.is_allowed("pkg1")
        assert allowed == True
    
    def test_allow_list_policy_blocks_unlisted(self):
        """Test AllowListPolicy blocks unlisted packages."""
        strategy = AllowListPolicy(allowed_packages={"pkg1", "pkg2"})
        allowed, reason = strategy.is_allowed("pkg3")
        assert allowed == False
        assert "not in allow list" in reason.lower() or "blocked" in reason.lower()
    
    def test_deny_list_policy_initialization(self):
        """Test DenyListPolicy can be instantiated."""
        strategy = DenyListPolicy(denied_packages={"bad_pkg"})
        assert isinstance(strategy, APolicyStrategy)
        assert isinstance(strategy, IPolicyStrategy)
    
    def test_deny_list_policy_blocks_listed(self):
        """Test DenyListPolicy blocks listed packages."""
        strategy = DenyListPolicy(denied_packages={"bad_pkg"})
        allowed, reason = strategy.is_allowed("bad_pkg")
        assert allowed == False
        assert "denied" in reason.lower() or "blocked" in reason.lower() or "deny list" in reason.lower()
    
    def test_deny_list_policy_allows_unlisted(self):
        """Test DenyListPolicy allows unlisted packages."""
        strategy = DenyListPolicy(denied_packages={"bad_pkg"})
        allowed, reason = strategy.is_allowed("good_pkg")
        assert allowed == True


@pytest.mark.xwlazy_core
class TestPackageMappingStrategies:
    """Test all package mapping strategies."""
    
    def test_manifest_first_mapping_initialization(self):
        """Test ManifestFirstMapping can be instantiated."""
        strategy = ManifestFirstMapping("test_pkg")
        assert isinstance(strategy, AMappingStrategy)
        assert isinstance(strategy, IMappingStrategy)
    
    def test_discovery_first_mapping_initialization(self):
        """Test DiscoveryFirstMapping can be instantiated."""
        strategy = DiscoveryFirstMapping("test_pkg")
        assert isinstance(strategy, AMappingStrategy)
        assert isinstance(strategy, IMappingStrategy)
    
    def test_hybrid_mapping_initialization(self):
        """Test HybridMapping can be instantiated."""
        strategy = HybridMapping("test_pkg")
        assert isinstance(strategy, AMappingStrategy)
        assert isinstance(strategy, IMappingStrategy)


@pytest.mark.xwlazy_core
class TestModuleStrategies:
    """Test all module strategies."""
    
    def test_simple_helper_initialization(self):
        """Test SimpleHelper can be instantiated."""
        strategy = SimpleHelper()
        assert isinstance(strategy, IModuleHelperStrategy)
    
    def test_lazy_helper_initialization(self):
        """Test LazyHelper can be instantiated."""
        strategy = LazyHelper()
        assert isinstance(strategy, IModuleHelperStrategy)
    
    def test_simple_manager_initialization(self):
        """Test SimpleManager can be instantiated."""
        # SimpleManager needs caching and helper strategy
        from exonware.xwlazy.common.strategies import LRUCache
        caching = LRUCache(max_size=100)
        helper_strategy = SimpleHelper()
        strategy = SimpleManager("test_pkg", caching, helper_strategy)
        assert isinstance(strategy, IModuleManagerStrategy)
    
    def test_advanced_manager_initialization(self):
        """Test AdvancedManager can be instantiated."""
        from exonware.xwlazy.package.facade import XWPackageHelper
        from exonware.xwlazy.common.strategies import LRUCache
        package_helper = XWPackageHelper("test_pkg")
        caching = LRUCache(max_size=100)
        helper = LazyHelper()
        strategy = AdvancedManager("test_pkg", package_helper, caching, helper)
        assert isinstance(strategy, IModuleManagerStrategy)
    
    def test_lru_cache_initialization(self):
        """Test LRUCache can be instantiated."""
        strategy = LRUCache(max_size=100)
        assert isinstance(strategy, ICachingStrategy)


@pytest.mark.xwlazy_core
class TestStrategyRegistry:
    """Test strategy registry functionality."""
    
    def test_strategy_registry_set_get_package_strategies(self):
        """Test setting and getting package strategies."""
        from exonware.xwlazy.package.services.strategy_registry import StrategyRegistry
        
        # Test execution strategy
        exec_strategy = PipExecution()
        StrategyRegistry.set_package_strategy("test_pkg", "execution", exec_strategy)
        retrieved = StrategyRegistry.get_package_strategy("test_pkg", "execution")
        assert retrieved is exec_strategy
        
        # Test timing strategy
        timing_strategy = SmartTiming()
        StrategyRegistry.set_package_strategy("test_pkg", "timing", timing_strategy)
        retrieved = StrategyRegistry.get_package_strategy("test_pkg", "timing")
        assert retrieved is timing_strategy
        
        # Cleanup
        StrategyRegistry.clear_all_strategies("test_pkg")
    
    def test_strategy_registry_set_get_module_strategies(self):
        """Test setting and getting module strategies."""
        from exonware.xwlazy.package.services.strategy_registry import StrategyRegistry
        
        # Test helper strategy
        helper_strategy = LazyHelper()
        StrategyRegistry.set_module_strategy("test_pkg", "helper", helper_strategy)
        retrieved = StrategyRegistry.get_module_strategy("test_pkg", "helper")
        assert retrieved is helper_strategy
        
        # Cleanup
        StrategyRegistry.clear_all_strategies("test_pkg")
    
    def test_strategy_registry_clear(self):
        """Test clearing strategies."""
        from exonware.xwlazy.package.services.strategy_registry import StrategyRegistry
        
        StrategyRegistry.set_package_strategy("test_pkg", "execution", PipExecution())
        StrategyRegistry.set_module_strategy("test_pkg", "helper", LazyHelper())
        
        StrategyRegistry.clear_all_strategies("test_pkg")
        
        assert StrategyRegistry.get_package_strategy("test_pkg", "execution") is None
        assert StrategyRegistry.get_module_strategy("test_pkg", "helper") is None


@pytest.mark.xwlazy_core
class TestXWPackageHelperWithStrategies:
    """Test XWPackageHelper with custom strategies."""
    
    def test_package_helper_with_custom_execution_strategy(self):
        """Test XWPackageHelper accepts custom execution strategy."""
        from exonware.xwlazy.package.facade import XWPackageHelper
        
        custom_exec = AsyncExecution()
        helper = XWPackageHelper("test_pkg", execution_strategy=custom_exec)
        assert helper._execution is custom_exec
    
    def test_package_helper_with_custom_timing_strategy(self):
        """Test XWPackageHelper accepts custom timing strategy."""
        from exonware.xwlazy.package.facade import XWPackageHelper
        
        custom_timing = FullTiming()
        helper = XWPackageHelper("test_pkg", timing_strategy=custom_timing)
        assert helper._timing is custom_timing
    
    def test_package_helper_with_custom_policy_strategy(self):
        """Test XWPackageHelper accepts custom policy strategy."""
        from exonware.xwlazy.package.facade import XWPackageHelper
        
        custom_policy = AllowListPolicy(allowed_packages={"pkg1"})
        helper = XWPackageHelper("test_pkg", policy_strategy=custom_policy)
        assert helper._policy is custom_policy
    
    def test_package_helper_uses_registry_strategies(self):
        """Test XWPackageHelper retrieves strategies from registry."""
        from exonware.xwlazy.package.facade import XWPackageHelper
        from exonware.xwlazy.package.services.strategy_registry import StrategyRegistry
        
        # Set strategies in registry
        custom_exec = AsyncExecution()
        StrategyRegistry.set_package_strategy("test_pkg", "execution", custom_exec)
        
        # Create helper - should use registry strategy
        helper = XWPackageHelper("test_pkg")
        assert helper._execution is custom_exec
        
        # Cleanup
        StrategyRegistry.clear_all_strategies("test_pkg")


@pytest.mark.xwlazy_core
class TestXWModuleHelperWithStrategies:
    """Test XWModuleHelper with custom strategies."""
    
    def test_module_helper_with_custom_helper_strategy(self):
        """Test XWModuleHelper accepts custom helper strategy."""
        from exonware.xwlazy.module.facade import XWModuleHelper
        
        custom_helper = SimpleHelper()
        helper = XWModuleHelper("test_pkg", helper_strategy=custom_helper)
        assert helper._helper is custom_helper
    
    def test_module_helper_uses_registry_strategies(self):
        """Test XWModuleHelper retrieves strategies from registry."""
        from exonware.xwlazy.module.facade import XWModuleHelper
        from exonware.xwlazy.package.services.strategy_registry import StrategyRegistry
        
        # Set strategies in registry
        custom_helper = SimpleHelper()
        StrategyRegistry.set_module_strategy("test_pkg", "helper", custom_helper)
        
        # Create helper - should use registry strategy
        helper = XWModuleHelper("test_pkg")
        assert helper._helper is custom_helper
        
        # Cleanup
        StrategyRegistry.clear_all_strategies("test_pkg")


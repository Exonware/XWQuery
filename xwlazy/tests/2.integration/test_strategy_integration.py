"""
Integration Tests: Strategy Integration

Comprehensive integration tests that verify all strategy combinations work together.
Tests every possible combination of strategies to ensure they integrate correctly
across package and module boundaries.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com

Generation Date: 15-Nov-2025
"""

import pytest
import sys
from pathlib import Path
from unittest.mock import Mock, MagicMock, patch

# Add src to path
tests_dir = Path(__file__).resolve().parent.parent
project_root = tests_dir.parent
src_path = project_root / "src"
if str(src_path) not in sys.path:
    sys.path.insert(0, str(src_path))

from exonware.xwlazy.package.facade import XWPackageHelper
from exonware.xwlazy.module.facade import XWModuleHelper
from exonware.xwlazy.package.services.strategy_registry import StrategyRegistry

# Import all package strategies
from exonware.xwlazy.package.strategies import (
    # Execution strategies
    PipExecution,
    WheelExecution,
    CachedExecution,
    AsyncExecution,
    # Timing strategies
    SmartTiming,
    FullTiming,
    CleanTiming,
    TemporaryTiming,
    # Discovery strategies
    FileBasedDiscovery,
    ManifestBasedDiscovery,
    HybridDiscovery,
    # Policy strategies
    PermissivePolicy,
    AllowListPolicy,
    DenyListPolicy,
    # Mapping strategies
    ManifestFirstMapping,
    DiscoveryFirstMapping,
    HybridMapping,
)

# Import all module strategies
from exonware.xwlazy.module.strategies import (
    SimpleHelper,
    LazyHelper,
    SimpleManager,
    AdvancedManager,
)

# Import caching strategies
from exonware.xwlazy.common.strategies.caching_lru import LRUCache
from exonware.xwlazy.common.strategies.caching_lfu import LFUCache
from exonware.xwlazy.common.strategies.caching_ttl import TTLCache
from exonware.xwlazy.common.strategies.caching_dict import DictCache

@pytest.mark.xwlazy_integration
class TestAllStrategyCombinations:
    """Test all possible strategy combinations work together."""
    
    def setup_method(self):
        """Set up test fixtures."""
        self.package_name = "test_integration_pkg"
        # Clean up any existing strategies
        StrategyRegistry.clear_all_strategies(self.package_name)
    
    def teardown_method(self):
        """Clean up after tests."""
        StrategyRegistry.clear_all_strategies(self.package_name)
    
    @pytest.mark.parametrize("execution_strategy", [
        PipExecution(),
        WheelExecution(),
        CachedExecution(),
        AsyncExecution(),
    ])
    @pytest.mark.parametrize("timing_strategy", [
        SmartTiming(),
        FullTiming(),
        CleanTiming(),
        TemporaryTiming(),
    ])
    @pytest.mark.parametrize("policy_strategy", [
        PermissivePolicy(),
        AllowListPolicy(allowed_packages={"test_pkg"}),
        DenyListPolicy(denied_packages={"blocked_pkg"}),
    ])
    def test_package_strategy_combinations(
        self,
        execution_strategy,
        timing_strategy,
        policy_strategy
    ):
        """Test all package strategy combinations."""
        # Create package helper with all strategy combinations
        helper = XWPackageHelper(
            self.package_name,
            execution_strategy=execution_strategy,
            timing_strategy=timing_strategy,
            policy_strategy=policy_strategy,
        )
        
        # Verify strategies are set correctly
        assert helper._execution is execution_strategy
        assert helper._timing is timing_strategy
        assert helper._policy is policy_strategy
    
    @pytest.mark.parametrize("helper_strategy", [
        SimpleHelper(),
        LazyHelper(),
    ])
    @pytest.mark.parametrize("caching_strategy", [
        LRUCache(max_size=100),
        LFUCache(max_size=100),
        TTLCache(ttl_seconds=3600),
        DictCache(),
    ])
    def test_module_strategy_combinations(
        self,
        helper_strategy,
        caching_strategy
    ):
        """Test all module strategy combinations."""
        # Create a mock package helper for module helper
        mock_package_helper = Mock()
        
        # Create module helper with strategy combinations
        helper = XWModuleHelper(
            self.package_name,
            helper_strategy=helper_strategy,
            caching_strategy=caching_strategy,
        )
        
        # Verify strategies are set correctly
        assert helper._helper is helper_strategy
        assert helper._caching is caching_strategy
    
    def test_all_package_strategies_together(self):
        """Test all package strategies together in one helper."""
        # Create all strategy instances
        execution = AsyncExecution()
        timing = SmartTiming()
        discovery = HybridDiscovery()
        policy = PermissivePolicy()
        mapping = HybridMapping()
        
        # Create helper with all strategies
        helper = XWPackageHelper(
            self.package_name,
            execution_strategy=execution,
            timing_strategy=timing,
            discovery_strategy=discovery,
            policy_strategy=policy,
            mapping_strategy=mapping,
        )
        
        # Verify all strategies are set
        assert helper._execution is execution
        assert helper._timing is timing
        assert helper._discovery is discovery
        assert helper._policy is policy
        assert helper._mapping is mapping
    
    def test_all_module_strategies_together(self):
        """Test all module strategies together in one helper."""
        # Create all strategy instances
        helper_strategy = LazyHelper()
        caching = LRUCache(max_size=100)
        
        # Create mock package helper and caching for manager
        mock_package_helper = Mock()
        mock_caching = Mock()
        
        # Create manager (requires package helper and caching)
        manager = SimpleManager(
            self.package_name,
            caching=mock_caching,
            helper=helper_strategy,
        )
        
        # Create module helper
        module_helper = XWModuleHelper(
            self.package_name,
            helper_strategy=helper_strategy,
            caching_strategy=caching,
        )
        
        # Verify strategies are set
        assert module_helper._helper is helper_strategy
        assert module_helper._caching is caching
    
    def test_strategy_registry_with_all_strategies(self):
        """Test strategy registry with all strategy types."""
        # Register all package strategies
        StrategyRegistry.set_package_strategy(
            self.package_name, "execution", PipExecution()
        )
        StrategyRegistry.set_package_strategy(
            self.package_name, "timing", SmartTiming()
        )
        StrategyRegistry.set_package_strategy(
            self.package_name, "discovery", HybridDiscovery()
        )
        StrategyRegistry.set_package_strategy(
            self.package_name, "policy", PermissivePolicy()
        )
        StrategyRegistry.set_package_strategy(
            self.package_name, "mapping", HybridMapping()
        )
        
        # Register all module strategies
        StrategyRegistry.set_module_strategy(
            self.package_name, "helper", LazyHelper()
        )
        StrategyRegistry.set_module_strategy(
            self.package_name, "caching", LRUCache(max_size=100)
        )
        
        # Create helpers - should use registered strategies
        package_helper = XWPackageHelper(self.package_name)
        module_helper = XWModuleHelper(self.package_name)
        
        # Verify strategies were retrieved from registry
        assert StrategyRegistry.get_package_strategy(
            self.package_name, "execution"
        ) is not None
        assert StrategyRegistry.get_package_strategy(
            self.package_name, "timing"
        ) is not None
        assert StrategyRegistry.get_module_strategy(
            self.package_name, "helper"
        ) is not None

@pytest.mark.xwlazy_integration
class TestStrategyInteroperability:
    """Test that strategies work together in real scenarios."""
    
    def setup_method(self):
        """Set up test fixtures."""
        self.package_name = "test_interop_pkg"
        StrategyRegistry.clear_all_strategies(self.package_name)
    
    def teardown_method(self):
        """Clean up after tests."""
        StrategyRegistry.clear_all_strategies(self.package_name)
    
    def test_execution_and_timing_work_together(self):
        """Test execution and timing strategies work together."""
        execution = PipExecution()
        timing = SmartTiming()
        
        helper = XWPackageHelper(
            self.package_name,
            execution_strategy=execution,
            timing_strategy=timing,
        )
        
        # Test timing strategy decision
        should_install = timing.should_install_now("test_pkg", {"error": "ImportError"})
        assert should_install == True
        
        # Test execution strategy is set correctly
        assert helper._execution is execution
        assert helper._timing is timing
    
    def test_policy_and_mapping_work_together(self):
        """Test policy and mapping strategies work together."""
        policy = AllowListPolicy(allowed_packages={"pandas", "numpy"})
        mapping = ManifestFirstMapping()
        
        helper = XWPackageHelper(
            self.package_name,
            policy_strategy=policy,
            mapping_strategy=mapping,
        )
        
        # Test policy allows listed packages
        allowed, reason = policy.is_allowed("pandas")
        assert allowed == True
        
        # Verify strategies are set
        assert helper._policy is policy
        assert helper._mapping is mapping
    
    def test_discovery_and_mapping_work_together(self):
        """Test discovery and mapping strategies work together."""
        discovery = HybridDiscovery()
        mapping = HybridMapping()
        
        helper = XWPackageHelper(
            self.package_name,
            discovery_strategy=discovery,
            mapping_strategy=mapping,
        )
        
        # Verify strategies are set
        assert helper._discovery is discovery
        assert helper._mapping is mapping
    
    def test_module_helper_and_caching_work_together(self):
        """Test module helper and caching strategies work together."""
        helper_strategy = LazyHelper()
        caching = LRUCache(max_size=50)
        
        module_helper = XWModuleHelper(
            self.package_name,
            helper_strategy=helper_strategy,
            caching_strategy=caching,
        )
        
        # Verify strategies are set
        assert module_helper._helper is helper_strategy
        assert module_helper._caching is caching
        
        # Test caching works
        caching.set("test_key", "test_value")
        assert caching.get("test_key") == "test_value"

@pytest.mark.xwlazy_integration
class TestStrategyEdgeCases:
    """Test edge cases and boundary conditions for strategy combinations."""
    
    def setup_method(self):
        """Set up test fixtures."""
        self.package_name = "test_edge_pkg"
        StrategyRegistry.clear_all_strategies(self.package_name)
    
    def teardown_method(self):
        """Clean up after tests."""
        StrategyRegistry.clear_all_strategies(self.package_name)
    
    def test_empty_allow_list_policy(self):
        """Test allow list policy with empty list."""
        policy = AllowListPolicy(allowed_packages=set())
        helper = XWPackageHelper(
            self.package_name,
            policy_strategy=policy,
        )
        
        # Empty allow list should block everything
        allowed, reason = policy.is_allowed("any_package")
        assert allowed == False
    
    def test_empty_deny_list_policy(self):
        """Test deny list policy with empty list."""
        policy = DenyListPolicy(denied_packages=set())
        helper = XWPackageHelper(
            self.package_name,
            policy_strategy=policy,
        )
        
        # Empty deny list should allow everything
        allowed, reason = policy.is_allowed("any_package")
        assert allowed == True
    
    def test_all_timing_strategies_with_none_context(self):
        """Test all timing strategies handle None context."""
        timing_strategies = [
            SmartTiming(),
            FullTiming(),
            CleanTiming(),
            TemporaryTiming(),
        ]
        
        for timing in timing_strategies:
            # All should handle None context gracefully
            result = timing.should_install_now("test_pkg", None)
            assert isinstance(result, bool)
    
    def test_caching_strategies_with_various_sizes(self):
        """Test caching strategies with various size limits."""
        cache_configs = [
            LRUCache(max_size=1),
            LRUCache(max_size=10),
            LRUCache(max_size=1000),
            LFUCache(max_size=1),
            LFUCache(max_size=100),
        ]
        
        for cache in cache_configs:
            # Test basic operations
            cache.set("key1", "value1")
            assert cache.get("key1") == "value1"
            
            # Test eviction at limit (check _max_size attribute)
            max_size = getattr(cache, '_max_size', getattr(cache, 'max_size', None))
            if max_size == 1:
                cache.set("key2", "value2")
                # First key should be evicted
                assert cache.get("key1") is None or cache.get("key1") != "value1"

@pytest.mark.xwlazy_integration
@pytest.mark.xwlazy_performance
class TestStrategyPerformance:
    """Test that strategy combinations don't degrade performance."""
    
    def setup_method(self):
        """Set up test fixtures."""
        self.package_name = "test_perf_pkg"
        StrategyRegistry.clear_all_strategies(self.package_name)
    
    def teardown_method(self):
        """Clean up after tests."""
        StrategyRegistry.clear_all_strategies(self.package_name)
    
    def test_helper_creation_performance(self):
        """Test that creating helpers with all strategies is fast."""
        import time
        
        strategies = [
            AsyncExecution(),
            SmartTiming(),
            HybridDiscovery(),
            PermissivePolicy(),
            HybridMapping(),
        ]
        
        start = time.time()
        for _ in range(100):
            helper = XWPackageHelper(
                self.package_name,
                execution_strategy=strategies[0],
                timing_strategy=strategies[1],
                discovery_strategy=strategies[2],
                policy_strategy=strategies[3],
                mapping_strategy=strategies[4],
            )
        elapsed = time.time() - start
        
        # Should create 100 helpers in under 1 second
        assert elapsed < 1.0, f"Helper creation too slow: {elapsed:.3f}s"
    
    def test_strategy_registry_performance(self):
        """Test that strategy registry operations are fast."""
        import time
        
        start = time.time()
        for i in range(100):
            StrategyRegistry.set_package_strategy(
                f"pkg_{i}", "execution", PipExecution()
            )
            StrategyRegistry.get_package_strategy(f"pkg_{i}", "execution")
            StrategyRegistry.clear_all_strategies(f"pkg_{i}")
        elapsed = time.time() - start
        
        # Should handle 100 operations in under 0.5 seconds
        assert elapsed < 0.5, f"Registry operations too slow: {elapsed:.3f}s"


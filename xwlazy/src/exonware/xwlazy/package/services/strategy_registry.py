"""
Strategy Registry

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com

Generation Date: 15-Nov-2025

Registry to store custom strategies per package for both package and module operations.
"""

import threading
from typing import Dict, Optional, Any, TYPE_CHECKING

if TYPE_CHECKING:
    from ...contracts import (
        IInstallExecutionStrategy,
        IInstallTimingStrategy,
        IDiscoveryStrategy,
        IPolicyStrategy,
        IMappingStrategy,
        IModuleHelperStrategy,
        IModuleManagerStrategy,
        ICachingStrategy,
    )

class StrategyRegistry:
    """Registry to store custom strategies per package."""
    
    # Package strategies
    _package_execution_strategies: Dict[str, 'IInstallExecutionStrategy'] = {}
    _package_timing_strategies: Dict[str, 'IInstallTimingStrategy'] = {}
    _package_discovery_strategies: Dict[str, 'IDiscoveryStrategy'] = {}
    _package_policy_strategies: Dict[str, 'IPolicyStrategy'] = {}
    _package_mapping_strategies: Dict[str, 'IMappingStrategy'] = {}
    
    # Module strategies
    _module_helper_strategies: Dict[str, 'IModuleHelperStrategy'] = {}
    _module_manager_strategies: Dict[str, 'IModuleManagerStrategy'] = {}
    _module_caching_strategies: Dict[str, 'ICachingStrategy'] = {}
    
    _lock = threading.RLock()
    
    @classmethod
    def set_package_strategy(
        cls,
        package_name: str,
        strategy_type: str,
        strategy: Any,
    ) -> None:
        """
        Set a package strategy for a package.
        
        Args:
            package_name: Package name
            strategy_type: One of 'execution', 'timing', 'discovery', 'policy', 'mapping'
            strategy: Strategy instance
        """
        package_key = package_name.lower()
        with cls._lock:
            if strategy_type == 'execution':
                cls._package_execution_strategies[package_key] = strategy
            elif strategy_type == 'timing':
                cls._package_timing_strategies[package_key] = strategy
            elif strategy_type == 'discovery':
                cls._package_discovery_strategies[package_key] = strategy
            elif strategy_type == 'policy':
                cls._package_policy_strategies[package_key] = strategy
            elif strategy_type == 'mapping':
                cls._package_mapping_strategies[package_key] = strategy
            else:
                raise ValueError(f"Unknown package strategy type: {strategy_type}")
    
    @classmethod
    def get_package_strategy(
        cls,
        package_name: str,
        strategy_type: str,
    ) -> Optional[Any]:
        """
        Get a package strategy for a package.
        
        Args:
            package_name: Package name
            strategy_type: One of 'execution', 'timing', 'discovery', 'policy', 'mapping'
            
        Returns:
            Strategy instance or None if not set
        """
        package_key = package_name.lower()
        with cls._lock:
            if strategy_type == 'execution':
                return cls._package_execution_strategies.get(package_key)
            elif strategy_type == 'timing':
                return cls._package_timing_strategies.get(package_key)
            elif strategy_type == 'discovery':
                return cls._package_discovery_strategies.get(package_key)
            elif strategy_type == 'policy':
                return cls._package_policy_strategies.get(package_key)
            elif strategy_type == 'mapping':
                return cls._package_mapping_strategies.get(package_key)
            else:
                raise ValueError(f"Unknown package strategy type: {strategy_type}")
    
    @classmethod
    def set_module_strategy(
        cls,
        package_name: str,
        strategy_type: str,
        strategy: Any,
    ) -> None:
        """
        Set a module strategy for a package.
        
        Args:
            package_name: Package name
            strategy_type: One of 'helper', 'manager', 'caching'
            strategy: Strategy instance
        """
        package_key = package_name.lower()
        with cls._lock:
            if strategy_type == 'helper':
                cls._module_helper_strategies[package_key] = strategy
            elif strategy_type == 'manager':
                cls._module_manager_strategies[package_key] = strategy
            elif strategy_type == 'caching':
                cls._module_caching_strategies[package_key] = strategy
            else:
                raise ValueError(f"Unknown module strategy type: {strategy_type}")
    
    @classmethod
    def get_module_strategy(
        cls,
        package_name: str,
        strategy_type: str,
    ) -> Optional[Any]:
        """
        Get a module strategy for a package.
        
        Args:
            package_name: Package name
            strategy_type: One of 'helper', 'manager', 'caching'
            
        Returns:
            Strategy instance or None if not set
        """
        package_key = package_name.lower()
        with cls._lock:
            if strategy_type == 'helper':
                return cls._module_helper_strategies.get(package_key)
            elif strategy_type == 'manager':
                return cls._module_manager_strategies.get(package_key)
            elif strategy_type == 'caching':
                return cls._module_caching_strategies.get(package_key)
            else:
                raise ValueError(f"Unknown module strategy type: {strategy_type}")
    
    @classmethod
    def clear_package_strategies(cls, package_name: str) -> None:
        """Clear all package strategies for a package."""
        package_key = package_name.lower()
        with cls._lock:
            cls._package_execution_strategies.pop(package_key, None)
            cls._package_timing_strategies.pop(package_key, None)
            cls._package_discovery_strategies.pop(package_key, None)
            cls._package_policy_strategies.pop(package_key, None)
            cls._package_mapping_strategies.pop(package_key, None)
    
    @classmethod
    def clear_module_strategies(cls, package_name: str) -> None:
        """Clear all module strategies for a package."""
        package_key = package_name.lower()
        with cls._lock:
            cls._module_helper_strategies.pop(package_key, None)
            cls._module_manager_strategies.pop(package_key, None)
            cls._module_caching_strategies.pop(package_key, None)
    
    @classmethod
    def clear_all_strategies(cls, package_name: str) -> None:
        """Clear all strategies (package and module) for a package."""
        cls.clear_package_strategies(package_name)
        cls.clear_module_strategies(package_name)

__all__ = ['StrategyRegistry']


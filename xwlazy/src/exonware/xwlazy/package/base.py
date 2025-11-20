"""
#exonware/xwlazy/src/exonware/xwlazy/package/base.py

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.1.0.17
Generation Date: 10-Oct-2025

Abstract Base Class for Package Operations

This module defines the abstract base class for package operations.
"""

import threading
from abc import ABC, abstractmethod
from pathlib import Path
from typing import Dict, List, Optional, Any, Set, Tuple
from types import ModuleType

from ..defs import (
    DependencyInfo,
    LazyInstallMode,
)
from ..contracts import (
    IPackageHelper,
)


# =============================================================================
# ABSTRACT PACKAGE (Unified - Merges APackageDiscovery + APackageInstaller + APackageCache + APackageHelper)
# =============================================================================

class APackageHelper(IPackageHelper, ABC):
    """
    Unified abstract base for package operations.
    
    Merges functionality from APackageDiscovery, APackageInstaller, APackageCache, and APackageHelper.
    Provides comprehensive package operations: discovery, installation, caching, configuration, manifest loading, and dependency mapping.
    
    This abstract class combines:
    - Package discovery (mapping import names to package names)
    - Package installation (installing/uninstalling packages)
    - Package caching (caching installation status and metadata)
    - Configuration management (per-package lazy installation configuration)
    - Manifest loading (loading and caching dependency manifests)
    - Dependency mapping (mapping import names to package names)
    """
    
    __slots__ = (
        # From APackageDiscovery
        'project_root', 'discovered_dependencies', '_discovery_sources', 
        '_cached_dependencies', '_file_mtimes', '_cache_valid',
        # From APackageInstaller
        '_package_name', '_enabled', '_mode', '_installed_packages', 
        '_failed_packages',
        # From APackageCache
        '_cache',
        # From APackageHelper
        '_uninstalled_packages',
        # Common
        '_lock'
    )
    
    def __init__(self, package_name: str = 'default', project_root: Optional[str] = None):
        """
        Initialize unified package operations.
        
        Args:
            package_name: Name of package this instance is for (for isolation)
            project_root: Root directory of project (auto-detected if None)
        """
        # From APackageDiscovery
        self.project_root = Path(project_root) if project_root else self._find_project_root()
        self.discovered_dependencies: Dict[str, DependencyInfo] = {}
        self._discovery_sources: List[str] = []
        self._cached_dependencies: Dict[str, str] = {}
        self._file_mtimes: Dict[str, float] = {}
        self._cache_valid = False
        
        # From APackageInstaller
        self._package_name = package_name
        self._enabled = False
        self._mode = LazyInstallMode.SMART
        self._installed_packages: Set[str] = set()
        self._failed_packages: Set[str] = set()
        
        # From APackageCache
        self._cache: Dict[str, Any] = {}
        
        # From APackageHelper
        self._uninstalled_packages: Set[str] = set()
        
        # Common
        self._lock = threading.RLock()
    
    # ========================================================================
    # Package Discovery Methods (from APackageDiscovery)
    # ========================================================================
    
    def _find_project_root(self) -> Path:
        """Find the project root directory by looking for markers."""
        current = Path(__file__).parent.parent.parent
        while current != current.parent:
            if (current / 'pyproject.toml').exists() or (current / 'setup.py').exists():
                return current
            current = current.parent
        return Path.cwd()
    
    def discover_all_dependencies(self) -> Dict[str, str]:
        """
        Template method: Discover all dependencies from all sources.
        
        Workflow:
        1. Check if cache is valid
        2. If not, discover from sources
        3. Add common mappings
        4. Update cache
        5. Return dependencies
        
        Returns:
            Dict mapping import_name -> package_name
        """
        # Return cached result if still valid
        if self._is_cache_valid():
            return self._cached_dependencies.copy()
        
        # Cache invalid - rediscover
        self.discovered_dependencies.clear()
        self._discovery_sources.clear()
        
        # Discover from all sources (abstract method)
        self._discover_from_sources()
        
        # Add common mappings
        self._add_common_mappings()
        
        # Convert to simple dict format and cache
        result = {}
        for import_name, dep_info in self.discovered_dependencies.items():
            result[import_name] = dep_info.package_name
        
        # Update cache
        self._cached_dependencies = result.copy()
        self._cache_valid = True
        self._update_file_mtimes()
        
        return result
    
    @abstractmethod
    def _discover_from_sources(self) -> None:
        """
        Discover dependencies from all sources (abstract step).
        
        Implementations should discover from:
        - pyproject.toml
        - requirements.txt
        - setup.py
        - custom config files
        """
        pass
    
    @abstractmethod
    def _is_cache_valid(self) -> bool:
        """
        Check if cached dependencies are still valid (abstract step).
        
        Returns:
            True if cache is valid, False otherwise
        """
        pass
    
    @abstractmethod
    def _add_common_mappings(self) -> None:
        """Add common import -> package mappings (abstract step)."""
        pass
    
    @abstractmethod
    def _update_file_mtimes(self) -> None:
        """Update file modification times for cache validation (abstract step)."""
        pass
    
    def get_discovery_sources(self) -> List[str]:
        """Get list of sources used for discovery."""
        return self._discovery_sources.copy()
    
    # ========================================================================
    # Package Installation Methods (from APackageInstaller)
    # ========================================================================
    
    def get_package_name(self) -> str:
        """Get the package name this instance is for."""
        return self._package_name
    
    def set_mode(self, mode: LazyInstallMode) -> None:
        """Set the installation mode."""
        with self._lock:
            self._mode = mode
    
    def get_mode(self) -> LazyInstallMode:
        """Get the current installation mode."""
        return self._mode
    
    def enable(self) -> None:
        """Enable lazy installation."""
        with self._lock:
            self._enabled = True
    
    def disable(self) -> None:
        """Disable lazy installation."""
        with self._lock:
            self._enabled = False
    
    def is_enabled(self) -> bool:
        """Check if lazy installation is enabled."""
        return self._enabled
    
    @abstractmethod
    def install_package(self, package_name: str, module_name: Optional[str] = None) -> bool:
        """
        Install a package (abstract method).
        
        Args:
            package_name: Name of package to install
            module_name: Name of module being imported (for interactive mode)
            
        Returns:
            True if installation successful, False otherwise
        """
        pass
    
    @abstractmethod
    def _check_security_policy(self, package_name: str) -> Tuple[bool, str]:
        """
        Check security policy for package (abstract method).
        
        Args:
            package_name: Package to check
            
        Returns:
            Tuple of (allowed: bool, reason: str)
        """
        pass
    
    @abstractmethod
    def _run_pip_install(self, package_name: str, args: List[str]) -> bool:
        """
        Run pip install with arguments (abstract method).
        
        Args:
            package_name: Package to install
            args: Additional pip arguments
            
        Returns:
            True if successful, False otherwise
        """
        pass
    
    def get_stats(self) -> Dict[str, Any]:
        """Get installation statistics."""
        with self._lock:
            return {
                'enabled': self._enabled,
                'mode': self._mode.value,
                'package_name': self._package_name,
                'installed_packages': list(self._installed_packages),
                'failed_packages': list(self._failed_packages),
                'total_installed': len(self._installed_packages),
                'total_failed': len(self._failed_packages)
            }
    
    # ========================================================================
    # Package Caching Methods (from APackageCache)
    # ========================================================================
    
    def get_cached(self, key: str) -> Optional[Any]:
        """
        Get cached value (abstract method).
        
        Args:
            key: Cache key
            
        Returns:
            Cached value or None if not found
        """
        with self._lock:
            return self._cache.get(key)
    
    def set_cached(self, key: str, value: Any) -> None:
        """
        Set cached value (abstract method).
        
        Args:
            key: Cache key
            value: Value to cache
        """
        with self._lock:
            self._cache[key] = value
    
    def clear_cache(self) -> None:
        """Clear all cached values."""
        with self._lock:
            self._cache.clear()
    
    @abstractmethod
    def is_cache_valid(self, key: str) -> bool:
        """
        Check if cache entry is still valid (abstract method).
        
        Args:
            key: Cache key
            
        Returns:
            True if valid, False otherwise
        """
        pass
    
    # ========================================================================
    # Package Helper Methods (from APackageHelper)
    # ========================================================================
    
    def installed(self, package_name: str) -> bool:
        """
        Check if a package is installed.
        
        Uses cache first to avoid expensive operations.
        Checks persistent cache, then in-memory cache, then importability.
        
        Args:
            package_name: Package name to check (e.g., 'pymongo', 'msgpack')
            
        Returns:
            True if package is installed, False otherwise
        """
        # Check in-memory cache first (fast)
        with self._lock:
            if package_name in self._installed_packages:
                return True
            if package_name in self._uninstalled_packages:
                return False
        
        # Check persistent cache (abstract method)
        if self._check_persistent_cache(package_name):
            with self._lock:
                self._installed_packages.add(package_name)
                self._uninstalled_packages.discard(package_name)
            return True
        
        # Check actual installation (expensive) - abstract method
        is_installed = self._check_importability(package_name)
        
        # Update caches
        with self._lock:
            if is_installed:
                self._installed_packages.add(package_name)
                self._uninstalled_packages.discard(package_name)
                self._mark_installed_in_persistent_cache(package_name)
            else:
                self._uninstalled_packages.add(package_name)
                self._installed_packages.discard(package_name)
        
        return is_installed
    
    def uninstalled(self, package_name: str) -> bool:
        """
        Check if a package is uninstalled.
        
        Uses cache first to avoid expensive operations.
        
        Args:
            package_name: Package name to check (e.g., 'pymongo', 'msgpack')
            
        Returns:
            True if package is uninstalled, False otherwise
        """
        return not self.installed(package_name)
    
    def install(self, *package_names: str) -> None:
        """
        Install one or more packages using pip.
        
        Skips packages that are already installed (using cache).
        Only installs unique packages to avoid duplicate operations.
        Updates cache after successful installation.
        
        Args:
            *package_names: One or more package names to install (e.g., 'pymongo', 'msgpack')
            
        Raises:
            subprocess.CalledProcessError: If installation fails
        """
        if not package_names:
            return
        
        # Get unique packages only (preserves order while removing duplicates)
        unique_names = list(dict.fromkeys(package_names))
        
        # Filter out packages that are already installed (check cache first)
        to_install = []
        with self._lock:
            for name in unique_names:
                if name not in self._installed_packages:
                    # Double-check if not in cache
                    if not self.installed(name):
                        to_install.append(name)
        
        if not to_install:
            # All packages already installed
            return
        
        # Install packages (abstract method)
        self._run_install(*to_install)
        
        # Update cache after successful installation
        with self._lock:
            for name in to_install:
                self._installed_packages.add(name)
                self._uninstalled_packages.discard(name)
                self._mark_installed_in_persistent_cache(name)
    
    def uninstall(self, *package_names: str) -> None:
        """
        Uninstall one or more packages using pip.
        
        Skips packages that are already uninstalled (using cache).
        Only uninstalls unique packages to avoid duplicate operations.
        Updates cache after successful uninstallation.
        
        Args:
            *package_names: One or more package names to uninstall (e.g., 'pymongo', 'msgpack')
            
        Raises:
            subprocess.CalledProcessError: If uninstallation fails
        """
        if not package_names:
            return
        
        # Get unique packages only (preserves order while removing duplicates)
        unique_names = list(dict.fromkeys(package_names))
        
        # Filter out packages that are already uninstalled (check cache first)
        to_uninstall = []
        with self._lock:
            for name in unique_names:
                if name not in self._uninstalled_packages:
                    # Double-check if not uninstalled
                    if self.installed(name):
                        to_uninstall.append(name)
        
        if not to_uninstall:
            # All packages already uninstalled
            return
        
        # Uninstall packages (abstract method)
        self._run_uninstall(*to_uninstall)
        
        # Update cache after successful uninstallation
        with self._lock:
            for name in to_uninstall:
                self._uninstalled_packages.add(name)
                self._installed_packages.discard(name)
                self._mark_uninstalled_in_persistent_cache(name)
    
    @abstractmethod
    def _check_importability(self, package_name: str) -> bool:
        """
        Check if package is importable (abstract method).
        
        Concrete implementations should use importlib.util.find_spec or similar.
        
        Args:
            package_name: Package name to check
            
        Returns:
            True if importable, False otherwise
        """
        pass
    
    @abstractmethod
    def _check_persistent_cache(self, package_name: str) -> bool:
        """
        Check persistent cache for package installation status (abstract method).
        
        Args:
            package_name: Package name to check
            
        Returns:
            True if found in persistent cache as installed, False otherwise
        """
        pass
    
    @abstractmethod
    def _mark_installed_in_persistent_cache(self, package_name: str) -> None:
        """
        Mark package as installed in persistent cache (abstract method).
        
        Args:
            package_name: Package name to mark
        """
        pass
    
    @abstractmethod
    def _mark_uninstalled_in_persistent_cache(self, package_name: str) -> None:
        """
        Mark package as uninstalled in persistent cache (abstract method).
        
        Args:
            package_name: Package name to mark
        """
        pass
    
    @abstractmethod
    def _run_install(self, *package_names: str) -> None:
        """
        Run pip install for packages (abstract method).
        
        Args:
            *package_names: Package names to install
            
        Raises:
            subprocess.CalledProcessError: If installation fails
        """
        pass
    
    @abstractmethod
    def _run_uninstall(self, *package_names: str) -> None:
        """
        Run pip uninstall for packages (abstract method).
        
        Args:
            *package_names: Package names to uninstall
            
        Raises:
            subprocess.CalledProcessError: If uninstallation fails
        """
        pass
    
    # ========================================================================
    # IPackageHelper Interface Methods (stubs - to be implemented by subclasses)
    # ========================================================================
    
    # Note: Many methods from IPackageHelper are already implemented above.
    # The following are stubs that need concrete implementations:
    
    def install_and_import(self, module_name: str, package_name: Optional[str] = None) -> Tuple[Optional[ModuleType], bool]:
        """Install package and import module (from IPackageInstaller)."""
        raise NotImplementedError("Subclasses must implement install_and_import")
    
    def get_package_for_import(self, import_name: str) -> Optional[str]:
        """Get package name for a given import name (from IPackageDiscovery)."""
        raise NotImplementedError("Subclasses must implement get_package_for_import")
    
    def get_imports_for_package(self, package_name: str) -> List[str]:
        """Get all possible import names for a package (from IPackageDiscovery)."""
        raise NotImplementedError("Subclasses must implement get_imports_for_package")
    
    def get_package_name(self, import_name: str) -> Optional[str]:
        """Get package name for an import name (from IDependencyMapper)."""
        raise NotImplementedError("Subclasses must implement get_package_name")
    
    def get_import_names(self, package_name: str) -> List[str]:
        """Get all import names for a package (from IDependencyMapper)."""
        raise NotImplementedError("Subclasses must implement get_import_names")
    
    def is_stdlib_or_builtin(self, import_name: str) -> bool:
        """Check if import name is stdlib or builtin (from IDependencyMapper)."""
        raise NotImplementedError("Subclasses must implement is_stdlib_or_builtin")
    
    def is_enabled(self, package_name: str) -> bool:
        """Check if lazy install is enabled for a package (from IConfigManager)."""
        raise NotImplementedError("Subclasses must implement is_enabled")
    
    def get_mode(self, package_name: str) -> str:
        """Get installation mode for a package (from IConfigManager)."""
        raise NotImplementedError("Subclasses must implement get_mode")
    
    def get_load_mode(self, package_name: str) -> Any:
        """Get load mode for a package (from IConfigManager)."""
        raise NotImplementedError("Subclasses must implement get_load_mode")
    
    def get_install_mode(self, package_name: str) -> Any:
        """Get install mode for a package (from IConfigManager)."""
        raise NotImplementedError("Subclasses must implement get_install_mode")
    
    def get_mode_config(self, package_name: str) -> Optional[Any]:
        """Get full mode configuration for a package (from IConfigManager)."""
        raise NotImplementedError("Subclasses must implement get_mode_config")
    
    def get_manifest_signature(self, package_name: str) -> Optional[Tuple[str, float, float]]:
        """Get manifest file signature (from IManifestLoader)."""
        raise NotImplementedError("Subclasses must implement get_manifest_signature")
    
    def get_shared_dependencies(self, package_name: str, signature: Optional[Tuple[str, float, float]] = None) -> Dict[str, str]:
        """Get shared dependencies from manifest (from IManifestLoader)."""
        raise NotImplementedError("Subclasses must implement get_shared_dependencies")
    
    def get_watched_prefixes(self, package_name: str) -> Tuple[str, ...]:
        """Get watched prefixes from manifest (from IManifestLoader)."""
        raise NotImplementedError("Subclasses must implement get_watched_prefixes")


# =============================================================================
# DEPRECATED CLASSES (for backward compatibility)
# =============================================================================

# =============================================================================
# EXPORT ALL
# =============================================================================

__all__ = [
    'APackageHelper',
]


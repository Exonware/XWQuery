"""
#exonware/xwsystem/src/exonware/xwsystem/utils/lazy_package/lazy_contracts.py

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.1.0.16
Generation Date: 10-Oct-2025

Contracts for Lazy Loading System

This module defines all interfaces, enums, and protocols for the lazy loading
system following DEV_GUIDELINES.md structure.
"""

from enum import Enum
from typing import Protocol, Dict, List, Optional, Any, Tuple
from dataclasses import dataclass, field
from types import ModuleType


# =============================================================================
# ENUMS
# =============================================================================

class LazyLoadMode(Enum):
    """Controls lazy module loading behavior."""
    NONE = "none"           # Standard imports (no lazy loading)
    AUTO = "auto"           # Lazy loading enabled (deferred module loading)
    PRELOAD = "preload"     # Preload all modules on start
    BACKGROUND = "background"  # Load modules in background threads
    CACHED = "cached"       # Cache loaded modules but allow unloading


class LazyInstallMode(Enum):
    """Lazy installation modes."""
    # Core modes
    NONE = "none"           # No auto-installation
    SMART = "smart"         # Install on first usage (on-demand) - replaces AUTO
    FULL = "full"           # Install all dependencies on start
    CLEAN = "clean"         # Install on usage + uninstall after completion
    TEMPORARY = "temporary"  # Always uninstall after use (more aggressive than CLEAN)
    SIZE_AWARE = "size_aware"  # Install small packages, skip large ones
    
    # Special purpose modes (kept for specific use cases)
    INTERACTIVE = "interactive"  # Ask user before installing
    WARN = "warn"           # Log warning but don't install (for monitoring)
    DISABLED = "disabled"   # Don't install anything (alias for NONE, more explicit)
    DRY_RUN = "dry_run"    # Show what would be installed but don't install


class PathType(Enum):
    """Path types for validation."""
    FILE = "file"
    DIRECTORY = "directory"
    UNKNOWN = "unknown"


# =============================================================================
# DATACLASSES
# =============================================================================

@dataclass
class DependencyInfo:
    """Information about a discovered dependency."""
    import_name: str
    package_name: str
    version: Optional[str] = None
    source: str = "unknown"
    category: str = "general"


@dataclass
class LazyModeConfig:
    """Two-dimensional lazy mode configuration combining load and install modes."""
    load_mode: LazyLoadMode = LazyLoadMode.NONE
    install_mode: LazyInstallMode = LazyInstallMode.NONE
    
    # Additional configuration options
    auto_uninstall_large: bool = False  # For AUTO_MODE behavior
    large_package_threshold_mb: float = 50.0  # Size threshold for SIZE_AWARE mode
    preload_priority: List[str] = field(default_factory=list)  # Priority modules for PRELOAD
    background_workers: int = 2  # Workers for BACKGROUND mode
    
    def __post_init__(self):
        """Normalize enum values."""
        if isinstance(self.load_mode, str):
            self.load_mode = LazyLoadMode(self.load_mode)
        if isinstance(self.install_mode, str):
            self.install_mode = LazyInstallMode(self.install_mode)


# =============================================================================
# PROTOCOLS / INTERFACES (Following DEV_GUIDELINES.md - Use IClass naming)
# =============================================================================

class IPackageDiscovery(Protocol):
    """
    Interface for package discovery strategies.
    
    Implements Strategy pattern for different discovery sources
    (pyproject.toml, requirements.txt, setup.py, etc.)
    """
    
    def discover_all_dependencies(self) -> Dict[str, str]:
        """
        Discover all dependencies from all available sources.
        
        Returns:
            Dict mapping import_name -> package_name
        """
        ...
    
    def get_package_for_import(self, import_name: str) -> Optional[str]:
        """
        Get package name for a given import name.
        
        Args:
            import_name: Import name (e.g., 'cv2', 'PIL')
            
        Returns:
            Package name (e.g., 'opencv-python', 'Pillow') or None
        """
        ...
    
    def get_imports_for_package(self, package_name: str) -> List[str]:
        """
        Get all possible import names for a package.
        
        Args:
            package_name: Package name (e.g., 'opencv-python')
            
        Returns:
            List of import names (e.g., ['opencv-python', 'cv2'])
        """
        ...


class IPackageInstaller(Protocol):
    """
    Interface for package installation strategies.
    
    Implements Strategy pattern for different installation modes
    (AUTO, INTERACTIVE, WARN, DISABLED, DRY_RUN).
    """
    
    def install_package(self, package_name: str, module_name: str = None) -> bool:
        """
        Install a package.
        
        Args:
            package_name: Name of package to install
            module_name: Name of module being imported (for interactive mode)
            
        Returns:
            True if installation successful, False otherwise
        """
        ...
    
    def is_package_installed(self, package_name: str) -> bool:
        """
        Check if a package is already installed.
        
        Args:
            package_name: Name of package to check
            
        Returns:
            True if installed, False otherwise
        """
        ...
    
    def install_and_import(self, module_name: str, package_name: str = None) -> Tuple[Optional[ModuleType], bool]:
        """
        Install package and import module.
        
        Args:
            module_name: Name of module to import
            package_name: Optional package name if different from module name
            
        Returns:
            Tuple of (module_object, success_flag)
        """
        ...


class IImportHook(Protocol):
    """
    Interface for import hook strategies.
    
    Implements Observer pattern to intercept import failures.
    """
    
    def install_hook(self) -> None:
        """Install the import hook into sys.meta_path."""
        ...
    
    def uninstall_hook(self) -> None:
        """Uninstall the import hook from sys.meta_path."""
        ...
    
    def is_installed(self) -> bool:
        """
        Check if hook is installed.
        
        Returns:
            True if hook is in sys.meta_path, False otherwise
        """
        ...
    
    def handle_import_error(self, module_name: str) -> Optional[Any]:
        """
        Handle ImportError by attempting to install and re-import.
        
        Args:
            module_name: Name of module that failed to import
            
        Returns:
            Imported module if successful, None otherwise
        """
        ...


class IPackageCache(Protocol):
    """
    Interface for package caching strategies.
    
    Implements Proxy pattern for cached access to packages.
    """
    
    def get_cached(self, key: str) -> Optional[Any]:
        """
        Get cached value.
        
        Args:
            key: Cache key
            
        Returns:
            Cached value or None if not found
        """
        ...
    
    def set_cached(self, key: str, value: Any) -> None:
        """
        Set cached value.
        
        Args:
            key: Cache key
            value: Value to cache
        """
        ...
    
    def clear_cache(self) -> None:
        """Clear all cached values."""
        ...
    
    def is_cache_valid(self, key: str) -> bool:
        """
        Check if cache entry is still valid.
        
        Args:
            key: Cache key
            
        Returns:
            True if valid, False otherwise
        """
        ...


class ILazyLoader(Protocol):
    """
    Interface for lazy loading strategies.
    
    Implements Proxy pattern for deferred module loading.
    """
    
    def load_module(self, module_path: str) -> ModuleType:
        """
        Load a module lazily.
        
        Args:
            module_path: Full module path to load
            
        Returns:
            Loaded module
        """
        ...
    
    def is_loaded(self, module_path: str) -> bool:
        """
        Check if module is already loaded.
        
        Args:
            module_path: Module path to check
            
        Returns:
            True if loaded, False otherwise
        """
        ...
    
    def unload_module(self, module_path: str) -> None:
        """
        Unload a module from cache.
        
        Args:
            module_path: Module path to unload
        """
        ...


# =============================================================================
# EXPORT ALL
# =============================================================================

# =============================================================================
# PRESET MODE MAPPINGS
# =============================================================================

# Preset mode combinations for convenience
PRESET_MODES: Dict[str, LazyModeConfig] = {
    "none": LazyModeConfig(
        load_mode=LazyLoadMode.NONE,
        install_mode=LazyInstallMode.NONE
    ),
    "lite": LazyModeConfig(
        load_mode=LazyLoadMode.AUTO,
        install_mode=LazyInstallMode.NONE
    ),
    "smart": LazyModeConfig(
        load_mode=LazyLoadMode.AUTO,
        install_mode=LazyInstallMode.SMART
    ),
    "full": LazyModeConfig(
        load_mode=LazyLoadMode.AUTO,
        install_mode=LazyInstallMode.FULL
    ),
    "clean": LazyModeConfig(
        load_mode=LazyLoadMode.AUTO,
        install_mode=LazyInstallMode.CLEAN
    ),
    "temporary": LazyModeConfig(
        load_mode=LazyLoadMode.AUTO,
        install_mode=LazyInstallMode.TEMPORARY
    ),
    "size_aware": LazyModeConfig(
        load_mode=LazyLoadMode.AUTO,
        install_mode=LazyInstallMode.SIZE_AWARE
    ),
    "auto": LazyModeConfig(
        load_mode=LazyLoadMode.AUTO,
        install_mode=LazyInstallMode.SMART,
        auto_uninstall_large=True
    ),
}


def get_preset_mode(preset_name: str) -> Optional[LazyModeConfig]:
    """Get preset mode configuration by name."""
    return PRESET_MODES.get(preset_name.lower())


# =============================================================================
# EXPORT ALL
# =============================================================================

__all__ = [
    # Enums
    'LazyLoadMode',
    'LazyInstallMode',
    'PathType',
    # Dataclasses
    'DependencyInfo',
    'LazyModeConfig',
    # Presets
    'PRESET_MODES',
    'get_preset_mode',
    # Interfaces/Protocols
    'IPackageDiscovery',
    'IPackageInstaller',
    'IImportHook',
    'IPackageCache',
    'ILazyLoader',
]


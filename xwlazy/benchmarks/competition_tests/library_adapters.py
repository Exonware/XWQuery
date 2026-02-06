"""
#xwlazy/benchmarks/competition_tests/library_adapters.py

Library-specific adapters for testing different lazy import libraries.

Each adapter provides a consistent interface for testing different libraries,
handling their unique APIs and features.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 1.0.0
Generation Date: 17-Nov-2025
"""

from typing import Any, Optional
import importlib
import sys


class LibraryAdapter:
    """Base adapter for lazy import libraries."""

    def __init__(self, library_name: str, module: Any):
        self.library_name = library_name
        self.module = module

    def enable(self) -> bool:
        """Enable lazy loading."""
        return False

    def import_module(self, module_name: str) -> Any:
        """Import a module using the library's mechanism."""
        return importlib.import_module(module_name)

    def get_features(self) -> list[str]:
        """Get list of supported features."""
        return []


class XWLazyAdapter(LibraryAdapter):
    """Adapter for xwlazy with two-dimensional mode system."""

    def __init__(self, library_name: str, module: Any, config: dict[str, Any] = None):
        """Initialize xwlazy adapter with mode configuration.
        
        Args:
            library_name: Name of the library
            module: The imported module
            config: Configuration dict with keys:
                - mode: Preset mode string ("lite", "smart", "full", "clean", "auto", etc.)
                - load_mode: LazyLoadMode enum or string (optional, overrides preset)
                - install_mode: LazyInstallMode enum or string (optional, overrides preset)
                - mode_config: LazyModeConfig instance (optional, full control)
                - Legacy keys (for backward compatibility):
                  \
                  - lazy_import: Enable basic lazy import (default: True)
                  - lazy_install: Enable auto-install (default: False)
        """
        super().__init__(library_name, module)
        self.config = config or {"mode": "lite"}

    def enable(self) -> bool:
        """Enable xwlazy lazy loading based on configuration using new mode system."""
        try:
            # Clear import cache to avoid stale imports after install/uninstall
            # This fixes "source code string cannot contain null bytes" errors from corrupted cache
            import sys
            import importlib
            modules_to_clear = [k for k in list(sys.modules.keys()) 
                              if k.startswith('exonware.xwlazy') or k.startswith('xwlazy')]
            for mod in modules_to_clear:
                del sys.modules[mod]
            
            # Clear importlib cache
            if hasattr(importlib, 'invalidate_caches'):
                importlib.invalidate_caches()
            
            # Try exonware.xwlazy first (development), then xwlazy (installed)
            try:
                from exonware.xwlazy import (
                    config_package_lazy_install_enabled,
                    LazyLoadMode,
                    LazyInstallMode,
                    LazyModeConfig,
                )
            except (ImportError, SyntaxError) as e:
                # Clear cache again before trying installed package
                # Handle SyntaxError from corrupted bytecode cache
                modules_to_clear = [k for k in list(sys.modules.keys()) 
                                  if k.startswith('xwlazy') or k.startswith('exonware.xwlazy')]
                for mod in modules_to_clear:
                    del sys.modules[mod]
                
                # Clear importlib cache again
                if hasattr(importlib, 'invalidate_caches'):
                    importlib.invalidate_caches()
                
                from xwlazy import (
                    config_package_lazy_install_enabled,
                    LazyLoadMode,
                    LazyInstallMode,
                    LazyModeConfig,
                )
            
            # Use new two-dimensional mode system
            mode = self.config.get("mode")
            load_mode = self.config.get("load_mode")
            install_mode = self.config.get("install_mode")
            mode_config = self.config.get("mode_config")
            
            # Legacy config support (backward compatibility)
            if not mode and not mode_config:
                lazy_import = self.config.get("lazy_import", True)
                lazy_install = self.config.get("lazy_install", False)
                
                if lazy_import and lazy_install:
                    mode = "smart"
                elif lazy_import:
                    mode = "lite"
                else:
                    mode = "none"
            
            # Configure package (using a test package name)
            package_name = "xwlazy_test"
            
            if mode_config:
                # Full control via LazyModeConfig
                config_package_lazy_install_enabled(
                    package_name,
                    enabled=True,
                    mode_config=mode_config
                )
            elif load_mode is not None or install_mode is not None:
                # Explicit two-dimensional configuration
                config_package_lazy_install_enabled(
                    package_name,
                    enabled=True,
                    load_mode=load_mode if isinstance(load_mode, LazyLoadMode) else LazyLoadMode(load_mode) if load_mode else None,
                    install_mode=install_mode if isinstance(install_mode, LazyInstallMode) else LazyInstallMode(install_mode) if install_mode else None,
                )
            else:
                # Preset mode
                config_package_lazy_install_enabled(
                    package_name,
                    enabled=True,
                    mode=mode or "lite"
                )
            
            return True
        except Exception as e:
            print(f"    Warning: Failed to configure xwlazy: {e}")
            import traceback
            traceback.print_exc()
            return False

    def import_module(self, module_name: str) -> Any:
        """Import using xwlazy."""
        # xwlazy should handle this automatically if enabled
        return importlib.import_module(module_name)

    def get_features(self) -> list[str]:
        """Get xwlazy features based on configuration."""
        features = []
        mode = self.config.get("mode", "lite")
        load_mode = self.config.get("load_mode")
        install_mode = self.config.get("install_mode")
        mode_config = self.config.get("mode_config")
        
        # Determine load and install modes
        # Try exonware.xwlazy first (development), then xwlazy (installed)
        try:
            from exonware.xwlazy import LazyLoadMode, LazyInstallMode
        except (ImportError, SyntaxError):
            # Clear cache before trying installed package
            # Handle SyntaxError from corrupted bytecode cache
            import sys
            import importlib
            modules_to_clear = [k for k in list(sys.modules.keys()) 
                              if k.startswith('xwlazy') or k.startswith('exonware.xwlazy')]
            for mod in modules_to_clear:
                del sys.modules[mod]
            
            # Clear importlib cache
            if hasattr(importlib, 'invalidate_caches'):
                importlib.invalidate_caches()
            
            from xwlazy import LazyLoadMode, LazyInstallMode
        
        if mode_config:
            load_mode_val = mode_config.load_mode
            install_mode_val = mode_config.install_mode
        elif load_mode or install_mode:
            load_mode_val = load_mode
            install_mode_val = install_mode
        else:
            # Map preset modes
            mode_map = {
                "none": (LazyLoadMode.NONE, LazyInstallMode.NONE),
                "lite": (LazyLoadMode.AUTO, LazyInstallMode.NONE),
                "smart": (LazyLoadMode.AUTO, LazyInstallMode.SMART),
                "full": (LazyLoadMode.AUTO, LazyInstallMode.FULL),
                "clean": (LazyLoadMode.AUTO, LazyInstallMode.CLEAN),
                "temporary": (LazyLoadMode.AUTO, LazyInstallMode.TEMPORARY),
                "size_aware": (LazyLoadMode.AUTO, LazyInstallMode.SIZE_AWARE),
                "auto": (LazyLoadMode.AUTO, LazyInstallMode.SMART),
            }
            load_mode_val, install_mode_val = mode_map.get(mode, (LazyLoadMode.AUTO, LazyInstallMode.NONE))
        
        # Normalize to enum values
        if isinstance(load_mode_val, str):
            load_mode_val = LazyLoadMode(load_mode_val.lower())
        if isinstance(install_mode_val, str):
            install_mode_val = LazyInstallMode(install_mode_val.lower())
        
        # Add features based on modes
        if load_mode_val and load_mode_val != LazyLoadMode.NONE:
            features.append("lazy_import")
            if load_mode_val == LazyLoadMode.PRELOAD:
                features.append("preload_mode")
            elif load_mode_val == LazyLoadMode.BACKGROUND:
                features.append("background_loading")
            elif load_mode_val == LazyLoadMode.CACHED:
                features.append("cached_loading")
            elif load_mode_val == LazyLoadMode.TURBO:
                features.append("turbo_mode")
                features.append("multi_tier_cache")
                features.append("bytecode_cache")
            elif load_mode_val == LazyLoadMode.ADAPTIVE:
                features.append("adaptive_mode")
                features.append("pattern_learning")
            elif load_mode_val == LazyLoadMode.HYPERPARALLEL:
                features.append("hyperparallel_mode")
                features.append("max_parallelism")
            elif load_mode_val == LazyLoadMode.STREAMING:
                features.append("streaming_mode")
                features.append("async_streaming")
            elif load_mode_val == LazyLoadMode.ULTRA:
                features.append("ultra_mode")
                features.append("all_optimizations")
            elif load_mode_val == LazyLoadMode.INTELLIGENT:
                features.append("intelligent_mode")
                features.append("auto_switching")
                features.append("adaptive_selection")
        
        if install_mode_val and install_mode_val != LazyInstallMode.NONE:
            features.append("auto_install")
            if install_mode_val == LazyInstallMode.SMART:
                features.append("on_demand_install")
            elif install_mode_val == LazyInstallMode.FULL:
                features.append("batch_install")
            elif install_mode_val == LazyInstallMode.CLEAN:
                features.append("auto_uninstall")
            elif install_mode_val == LazyInstallMode.TEMPORARY:
                features.append("temporary_install")
            elif install_mode_val == LazyInstallMode.SIZE_AWARE:
                features.append("size_aware_install")
        
        # Always available features
        features.extend(["per_package_isolation", "caching", "async_operations"])
        
        return features


class PipImportAdapter(LibraryAdapter):
    """Adapter for pipimport."""

    def enable(self) -> bool:
        """Enable pipimport by calling install()."""
        try:
            # Try to import pipimport if not already imported
            if self.module is None:
                import pipimport
                self.module = pipimport
            # pipimport requires install() to be called explicitly
            self.module.install()
            return True
        except (SyntaxError, ImportError) as e:
            # pipimport has Python 2 syntax and won't work in Python 3
            print(f"    Warning: pipimport is not compatible with Python 3: {e}")
            return False
        except Exception as e:
            print(f"    Warning: Failed to enable pipimport: {e}")
            return False

    def get_features(self) -> list[str]:
        """Get pipimport features."""
        return ["auto_install"]


class DeferredImportAdapter(LibraryAdapter):
    """Adapter for deferred-import."""

    def enable(self) -> bool:
        """Enable deferred-import."""
        try:
            from deferred_import import deferred_import
            return True
        except:
            return False

    def import_module(self, module_name: str) -> Any:
        """Import using deferred-import."""
        try:
            from deferred_import import deferred_import
            return deferred_import(module_name)
        except:
            return importlib.import_module(module_name)

    def get_features(self) -> list[str]:
        """Get deferred-import features."""
        return ["deferred_loading"]


class LazyLoaderAdapter(LibraryAdapter):
    """Adapter for lazy-loader."""

    def enable(self) -> bool:
        """Enable lazy-loader."""
        try:
            import lazy_loader
            return True
        except:
            return False

    def import_module(self, module_name: str) -> Any:
        """Import using lazy-loader."""
        try:
            import lazy_loader
            return lazy_loader.bind(module_name)
        except:
            return importlib.import_module(module_name)

    def get_features(self) -> list[str]:
        """Get lazy-loader features."""
        return ["lazy_import", "caching"]


class LazyImportsAdapter(LibraryAdapter):
    """Adapter for lazy-imports."""

    def enable(self) -> bool:
        """Enable lazy-imports."""
        try:
            import lazy_imports
            lazy_imports.start()
            return True
        except:
            return False

    def get_features(self) -> list[str]:
        """Get lazy-imports features."""
        return ["lazy_import"]


class LazyImportAdapter(LibraryAdapter):
    """Adapter for lazy-import."""

    def enable(self) -> bool:
        """Enable lazy-import."""
        try:
            from lazy_import import lazy_import
            return True
        except:
            return False

    def import_module(self, module_name: str) -> Any:
        """Import using lazy-import."""
        try:
            from lazy_import import lazy_import
            return lazy_import(module_name)
        except:
            return importlib.import_module(module_name)

    def get_features(self) -> list[str]:
        """Get lazy-import features."""
        return ["lazy_import"]


class PyLazyImportsAdapter(LibraryAdapter):
    """Adapter for pylazyimports."""

    def enable(self) -> bool:
        """Enable pylazyimports."""
        try:
            import lazyimports
            lazyimports.enable()
            return True
        except:
            return False

    def get_features(self) -> list[str]:
        """Get pylazyimports features."""
        return ["lazy_import"]


class LaziAdapter(LibraryAdapter):
    """Adapter for lazi."""

    def enable(self) -> bool:
        """Enable lazi."""
        try:
            import lazi
            lazi.auto()
            return True
        except:
            return False

    def get_features(self) -> list[str]:
        """Get lazi features."""
        return ["lazy_import", "auto_detection"]


class LazyImportsLiteAdapter(LibraryAdapter):
    """Adapter for lazy-imports-lite."""

    def enable(self) -> bool:
        """Enable lazy-imports-lite."""
        try:
            import lazy_imports_lite
            lazy_imports_lite.enable()
            return True
        except:
            return False

    def get_features(self) -> list[str]:
        """Get lazy-imports-lite features."""
        return ["lazy_import", "keyword_detection"]


# Adapter factory
def create_adapter(library_name: str, config: dict[str, bool] = None) -> Optional[LibraryAdapter]:
    """Create an adapter for a library.
    
    Args:
        library_name: Name of the library
        config: Optional configuration dict (only used for xwlazy)
    """
    try:
        if library_name == "xwlazy":
            module = importlib.import_module("xwlazy")
            return XWLazyAdapter(library_name, module, config)
        elif library_name == "pipimport":
            # pipimport may have Python 2 syntax, but we still try to import it
            # The adapter will call install() which might work
            try:
                module = importlib.import_module("pipimport")
            except (SyntaxError, ImportError):
                # If import fails due to Python 2 syntax, create adapter with None module
                # The adapter will try to import and call install() in enable()
                module = None
            return PipImportAdapter(library_name, module)
        elif library_name == "deferred-import":
            module = importlib.import_module("deferred_import")
            return DeferredImportAdapter(library_name, module)
        elif library_name == "lazy-loader":
            module = importlib.import_module("lazy_loader")
            return LazyLoaderAdapter(library_name, module)
        elif library_name == "lazy-imports":
            module = importlib.import_module("lazy_imports")
            return LazyImportsAdapter(library_name, module)
        elif library_name == "lazy_import":
            module = importlib.import_module("lazy_import")
            return LazyImportAdapter(library_name, module)
        elif library_name == "pylazyimports":
            module = importlib.import_module("lazyimports")
            return PyLazyImportsAdapter(library_name, module)
        elif library_name == "lazi":
            module = importlib.import_module("lazi")
            return LaziAdapter(library_name, module)
        elif library_name == "lazy-imports-lite":
            module = importlib.import_module("lazy_imports_lite")
            return LazyImportsLiteAdapter(library_name, module)
    except ImportError:
        pass

    return None

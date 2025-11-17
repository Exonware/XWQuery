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

from typing import Any, Optional, List, Dict
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

    def get_features(self) -> List[str]:
        """Get list of supported features."""
        return []


class XWLazyAdapter(LibraryAdapter):
    """Adapter for xwlazy."""

    def __init__(self, library_name: str, module: Any, config: Dict[str, bool] = None):
        """Initialize xwlazy adapter with feature configuration.
        
        Args:
            library_name: Name of the library
            module: The imported module
            config: Feature configuration dict with keys:
                - lazy_import: Enable basic lazy import (default: True)
                - lazy_install: Enable auto-install (default: False)
                - lazy_discovery: Enable dependency discovery (default: False)
                - lazy_monitoring: Enable performance monitoring (default: False)
                - keyword_detection: Enable keyword detection (default: False)
        """
        super().__init__(library_name, module)
        self.config = config or {
            "lazy_import": True,
            "lazy_install": False,
            "lazy_discovery": False,
            "lazy_monitoring": False,
            "keyword_detection": False,
        }

    def enable(self) -> bool:
        """Enable xwlazy lazy loading based on configuration."""
        try:
            from xwlazy.lazy.lazy_core import enable_lazy_mode
            from xwlazy import (
                enable_lazy_install, disable_lazy_install,
                is_lazy_install_enabled,
            )
            
            # Configure lazy install
            if self.config.get("lazy_install", False):
                try:
                    enable_lazy_install()
                except:
                    pass
            else:
                try:
                    disable_lazy_install()
                except:
                    pass
            
            # Enable basic lazy import (always enabled if lazy_import is True)
            if self.config.get("lazy_import", True):
                enable_lazy_mode()
            
            # Note: lazy_discovery, lazy_monitoring, and keyword_detection
            # are typically enabled by default when lazy_mode is enabled
            # They can be configured separately if needed
            
            return True
        except Exception as e:
            print(f"    Warning: Failed to configure xwlazy: {e}")
            return False

    def import_module(self, module_name: str) -> Any:
        """Import using xwlazy."""
        # xwlazy should handle this automatically if enabled
        return importlib.import_module(module_name)

    def get_features(self) -> List[str]:
        """Get xwlazy features based on configuration."""
        features = []
        if self.config.get("lazy_import", True):
            features.append("lazy_import")
        if self.config.get("lazy_install", False):
            features.append("auto_install")
        if self.config.get("lazy_discovery", False):
            features.append("dependency_discovery")
        if self.config.get("lazy_monitoring", False):
            features.append("performance_monitoring")
        if self.config.get("keyword_detection", False):
            features.append("keyword_detection")
        # These are always available when lazy_import is enabled
        if self.config.get("lazy_import", True):
            features.extend(["per_package_isolation", "caching"])
        return features


class PipImportAdapter(LibraryAdapter):
    """Adapter for pipimport."""

    def enable(self) -> bool:
        """Enable pipimport."""
        try:
            import pipimport
            pipimport.install()  # If available
            return True
        except:
            return False

    def get_features(self) -> List[str]:
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

    def get_features(self) -> List[str]:
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

    def get_features(self) -> List[str]:
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

    def get_features(self) -> List[str]:
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

    def get_features(self) -> List[str]:
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

    def get_features(self) -> List[str]:
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

    def get_features(self) -> List[str]:
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

    def get_features(self) -> List[str]:
        """Get lazy-imports-lite features."""
        return ["lazy_import", "keyword_detection"]


# Adapter factory
def create_adapter(library_name: str, config: Dict[str, bool] = None) -> Optional[LibraryAdapter]:
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
            module = importlib.import_module("pipimport")
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


"""
Module Operations Facade

Main facade: XWModuleHelper extends AModuleHelper
Provides concrete implementation for all module operations.
"""

import sys
import importlib
import importlib.util
from typing import Optional
from types import ModuleType

from .base import AModuleHelper, APackageHelper
# Lazy import to avoid circular dependency
from typing import TYPE_CHECKING
if TYPE_CHECKING:
    from ..package.facade import XWPackageHelper


class XWModuleHelper(AModuleHelper):
    """
    Concrete implementation of AModuleHelper.
    
    Provides simple, clean API for working with modules (what you import).
    Uses XWPackageHelper for package operations and DependencyMapper for module-to-package mapping.
    """
    
    def __init__(self, package_name: str = 'default', package_helper: Optional[APackageHelper] = None):
        """
        Initialize XW module helper.
        
        Args:
            package_name: Package name for isolation (defaults to 'default')
            package_helper: Optional package helper instance. If None, creates XWPackageHelper.
        """
        if package_helper is None:
            # Lazy import to avoid circular dependency
            from ..package.facade import XWPackageHelper
            package_helper = XWPackageHelper(package_name)
        super().__init__(package_name, package_helper)
        self._package_name = package_name
    
    def _check_module_importability(self, module_name: str) -> bool:
        """
        Check if module is importable.
        
        Uses importlib.util.find_spec to check if module can be imported.
        
        Args:
            module_name: Module name to check
            
        Returns:
            True if importable, False otherwise
        """
        try:
            spec = importlib.util.find_spec(module_name)
            return spec is not None
        except (ValueError, AttributeError, ImportError):
            return False
    
    def _import_module(self, module_name: str) -> ModuleType:
        """
        Import a module.
        
        Uses importlib.import_module to import the module.
        
        Args:
            module_name: Module name to import
            
        Returns:
            Imported module
            
        Raises:
            ImportError: If module cannot be imported
        """
        return importlib.import_module(module_name)
    
    def _invalidate_import_caches(self) -> None:
        """
        Invalidate import caches.
        
        Uses importlib.invalidate_caches() to clear Python's import caches.
        """
        importlib.invalidate_caches()
        sys.path_importer_cache.clear()
    
    def _create_package_helper(self) -> APackageHelper:
        """
        Create a package helper instance.
        
        Returns:
            XWPackageHelper instance
        """
        from ..package.facade import XWPackageHelper
        return XWPackageHelper(self._package_name)
    
    # Abstract methods from AModule that need implementation
    def install_hook(self) -> None:
        """Install the import hook into sys.meta_path."""
        # TODO: Implement hook installation
        pass
    
    def uninstall_hook(self) -> None:
        """Uninstall the import hook from sys.meta_path."""
        # TODO: Implement hook uninstallation
        pass
    
    def handle_import_error(self, module_name: str):
        """Handle ImportError by attempting to install and re-import."""
        # TODO: Implement import error handling
        return None
    
    def load_module(self, module_path: str) -> ModuleType:
        """Load a module lazily."""
        # TODO: Implement lazy loading
        return self._import_module(module_path)
    
    def unload_module(self, module_path: str) -> None:
        """Unload a module from cache."""
        # TODO: Implement module unloading
        pass


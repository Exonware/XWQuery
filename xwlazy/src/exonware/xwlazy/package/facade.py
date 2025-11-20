"""
Package Operations Facade

Main facade: XWPackageHelper extends APackageHelper
Provides concrete implementation for all package operations.
"""

import sys
import importlib
import importlib.util
from typing import Optional

from .base import APackageHelper
from .installer_engine import InstallerEngine, LazyInstaller, InstallationCache


class XWPackageHelper(APackageHelper):
    """
    Concrete implementation of APackageHelper.
    
    Provides simple, clean API for working with packages (what you pip install).
    Uses xwlazy's InstallationCache for persistent caching and LazyInstaller for installation.
    """
    
    def __init__(self, package_name: str = 'default', project_root: Optional[str] = None):
        """
        Initialize XW package.
        
        Args:
            package_name: Package name for isolation (defaults to 'default')
            project_root: Root directory of project (auto-detected if None)
        """
        super().__init__(package_name, project_root)
        self._install_cache = InstallationCache()
        self._installer = None  # Lazy init to avoid circular imports
        self._install_engine = InstallerEngine(package_name)  # NEW: Install engine for async installs
    
    def _get_installer(self):
        """Get lazy installer instance (lazy init)."""
        if self._installer is None:
            self._installer = LazyInstaller(self._package_name)
        return self._installer
    
    def _check_importability(self, package_name: str) -> bool:
        """
        Check if package is importable.
        
        Uses importlib.util.find_spec to check if package can be imported.
        
        Args:
            package_name: Package name to check
            
        Returns:
            True if importable, False otherwise
        """
        try:
            spec = importlib.util.find_spec(package_name)
            return spec is not None
        except (ValueError, AttributeError, ImportError):
            return False
    
    def _check_persistent_cache(self, package_name: str) -> bool:
        """
        Check persistent cache for package installation status.
        
        Args:
            package_name: Package name to check
            
        Returns:
            True if found in persistent cache as installed, False otherwise
        """
        return self._install_cache.is_installed(package_name)
    
    def _mark_installed_in_persistent_cache(self, package_name: str) -> None:
        """
        Mark package as installed in persistent cache.
        
        Args:
            package_name: Package name to mark
        """
        version = self._get_installer()._get_installed_version(package_name)
        self._install_cache.mark_installed(package_name, version)
    
    def _mark_uninstalled_in_persistent_cache(self, package_name: str) -> None:
        """
        Mark package as uninstalled in persistent cache.
        
        Args:
            package_name: Package name to mark
        """
        self._install_cache.mark_uninstalled(package_name)
    
    def _run_install(self, *package_names: str) -> None:
        """
        Run pip install for packages.
        
        Uses InstallerEngine to install packages in parallel (async),
        but waits for all to complete before returning.
        
        Args:
            *package_names: Package names to install
            
        Raises:
            subprocess.CalledProcessError: If installation fails
        """
        if not package_names:
            return
        
        # Use InstallerEngine for parallel async installs
        results = self._install_engine.install_many(*package_names)
        
        # Update cache and track results
        for package_name, result in results.items():
            if result.success:
                with self._lock:
                    self._installed_packages.add(package_name)
                    self._uninstalled_packages.discard(package_name)
                    self._mark_installed_in_persistent_cache(package_name)
            else:
                with self._lock:
                    self._failed_packages.add(package_name)
                    # Raise exception if critical failure
                    if result.status.value == "failed":
                        raise RuntimeError(
                            f"Failed to install {package_name}: {result.error}"
                        )
    
    def _run_uninstall(self, *package_names: str) -> None:
        """
        Run pip uninstall for packages.
        
        Args:
            *package_names: Package names to uninstall
            
        Raises:
            subprocess.CalledProcessError: If uninstallation fails
        """
        import subprocess
        if not package_names:
            return
        
        print(f"Uninstalling {', '.join(package_names)}...")
        subprocess.run(
            [sys.executable, "-m", "pip", "uninstall", "-y"] + list(package_names),
            check=True,
            capture_output=True
        )
        print(f"{', '.join(package_names)} uninstalled successfully.")
    
    # Abstract methods from APackage that need implementation
    def _discover_from_sources(self) -> None:
        """Discover dependencies from all sources."""
        # TODO: Implement discovery logic
        pass
    
    def _is_cache_valid(self) -> bool:
        """Check if cached dependencies are still valid."""
        # TODO: Implement cache validation
        return False
    
    def _add_common_mappings(self) -> None:
        """Add common import -> package mappings."""
        # TODO: Implement common mappings
        pass
    
    def _update_file_mtimes(self) -> None:
        """Update file modification times for cache validation."""
        # TODO: Implement file mtime tracking
        pass
    
    def install_package(self, package_name: str, module_name: Optional[str] = None) -> bool:
        """Install a package."""
        try:
            self._run_install(package_name)
            return True
        except Exception:
            return False
    
    def _check_security_policy(self, package_name: str):
        """Check security policy for package."""
        # TODO: Implement security policy check
        return True, ""
    
    def _run_pip_install(self, package_name: str, args: list) -> bool:
        """Run pip install with arguments."""
        try:
            self._run_install(package_name)
            return True
        except Exception:
            return False
    
    def is_cache_valid(self, key: str) -> bool:
        """Check if cache entry is still valid."""
        # TODO: Implement cache validation
        return False


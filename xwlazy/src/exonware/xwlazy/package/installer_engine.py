"""
#exonware/xwlazy/src/exonware/xwlazy/package/installer_engine.py

Installation Engine - Unified async execution engine for install operations.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.1.0.18
Generation Date: 15-Nov-2025

This module provides InstallerEngine for unified async installation operations.
All install-related functionality is centralized here.

Merged from:
- installer.py (LazyInstaller)
- installer_registry.py (LazyInstallerRegistry)
- install_utils.py (utility functions)
- async_install_handle.py (AsyncInstallHandle)

Features:
- Parallel async installs (waits for all to complete)
- Integration with InstallCache and InstallPolicy
- Support for all install modes
- Progress tracking and error handling
"""

import os
import sys
import json
import time
import asyncio
import shutil
import sysconfig
import tempfile
import threading
import zipfile
import subprocess
import importlib
import importlib.util
import importlib.metadata
import inspect
from pathlib import Path
from typing import Dict, List, Optional, Tuple, Set, Callable, Any, TYPE_CHECKING
from dataclasses import dataclass
from enum import Enum
from collections import OrderedDict
from contextlib import suppress
from datetime import datetime
from types import ModuleType

from .base import APackageHelper
from .config_manager import LazyInstallConfig
from .dependency_mapper import DependencyMapper
from .manifest import PackageManifest
from ..defs import LazyInstallMode, LazyLoadMode, LazyModeConfig
# Lazy imports to avoid circular dependency
def _get_logger():
    """Get logger (lazy import to avoid circular dependency)."""
    from ..module.importer_engine import get_logger
    return get_logger("xwlazy.installer_engine")

def _get_log_event():
    """Get log_event function (lazy import to avoid circular dependency)."""
    from ..module.importer_engine import log_event
    return log_event

def _get_print_formatted():
    """Get print_formatted function (lazy import to avoid circular dependency)."""
    from ..module.importer_engine import print_formatted
    return print_formatted

def _get_installing_state():
    """Get installing state (lazy import to avoid circular dependency)."""
    from ..module.importer_engine import get_installing_state
    return get_installing_state()

from .spec_cache import _spec_cache_put, _spec_cache_clear

logger = None  # Will be initialized on first use
_log = None  # Will be initialized on first use
print_formatted = None  # Will be initialized on first use

# Thread-local storage for installation state
_installing = None  # Will be initialized on first use

def _ensure_logging_initialized():
    """Ensure logging utilities are initialized (lazy init to avoid circular imports)."""
    global logger, _log, print_formatted, _installing
    if logger is None:
        logger = _get_logger()
    if _log is None:
        _log = _get_log_event()
    if print_formatted is None:
        print_formatted = _get_print_formatted()
    if _installing is None:
        _installing = _get_installing_state()

# Initialize on module load (will be called when safe)
try:
    _ensure_logging_initialized()
except Exception:
    # If circular import occurs, will be initialized on first use
    pass


# =============================================================================
# INSTALLATION CACHE (from install_cache.py)
# =============================================================================

class InstallationCache:
    """
    Persistent file-based cache for tracking installed packages.
    
    Cache format: {package_name: {installed: bool, version: str, timestamp: float}}
    Cache location: ~/.xwlazy/installed_packages.json
    """
    
    def __init__(self, cache_file: Optional[Path] = None):
        """
        Initialize installation cache.
        
        Args:
            cache_file: Optional path to cache file. Defaults to ~/.xwlazy/installed_packages.json
        """
        if cache_file is None:
            cache_dir = Path.home() / ".xwlazy"
            cache_dir.mkdir(parents=True, exist_ok=True)
            cache_file = cache_dir / "installed_packages.json"
        
        self._cache_file = cache_file
        self._lock = threading.RLock()
        self._cache: Dict[str, Dict[str, Any]] = {}
        self._dirty = False
        
        # Load cache on init
        self._load_cache()
    
    def _load_cache(self) -> None:
        """Load cache from disk."""
        if not self._cache_file.exists():
            self._cache = {}
            return
        
        try:
            with self._lock:
                with open(self._cache_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    # Validate format
                    if isinstance(data, dict):
                        self._cache = {k: v for k, v in data.items() 
                                     if isinstance(v, dict) and 'installed' in v}
                    else:
                        self._cache = {}
        except (json.JSONDecodeError, IOError, OSError) as e:
            logger.debug(f"Failed to load installation cache: {e}")
            self._cache = {}
    
    def _save_cache(self) -> None:
        """Save cache to disk."""
        if not self._dirty:
            return
        
        try:
            with self._lock:
                # Create parent directory if needed
                self._cache_file.parent.mkdir(parents=True, exist_ok=True)
                
                # Write atomically using temp file
                temp_file = self._cache_file.with_suffix('.tmp')
                with open(temp_file, 'w', encoding='utf-8') as f:
                    json.dump(self._cache, f, indent=2, sort_keys=True)
                
                # Atomic rename
                temp_file.replace(self._cache_file)
                self._dirty = False
        except (IOError, OSError) as e:
            logger.warning(f"Failed to save installation cache: {e}")
    
    def is_installed(self, package_name: str) -> bool:
        """
        Check if package is marked as installed in cache.
        
        Args:
            package_name: Name of the package to check
            
        Returns:
            True if package is in cache and marked as installed, False otherwise
        """
        with self._lock:
            entry = self._cache.get(package_name)
            if entry is None:
                return False
            return entry.get('installed', False)
    
    def mark_installed(self, package_name: str, version: Optional[str] = None) -> None:
        """
        Mark package as installed in cache.
        
        Args:
            package_name: Name of the package
            version: Optional version string
        """
        with self._lock:
            self._cache[package_name] = {
                'installed': True,
                'version': version or 'unknown',
                'timestamp': time.time()
            }
            self._dirty = True
            self._save_cache()
    
    def mark_uninstalled(self, package_name: str) -> None:
        """
        Mark package as uninstalled in cache.
        
        Args:
            package_name: Name of the package
        """
        with self._lock:
            if package_name in self._cache:
                self._cache[package_name]['installed'] = False
                self._cache[package_name]['timestamp'] = time.time()
                self._dirty = True
                self._save_cache()
    
    def get_version(self, package_name: str) -> Optional[str]:
        """
        Get cached version of package.
        
        Args:
            package_name: Name of the package
            
        Returns:
            Version string if available, None otherwise
        """
        with self._lock:
            entry = self._cache.get(package_name)
            if entry and entry.get('installed', False):
                return entry.get('version')
            return None
    
    def clear(self) -> None:
        """Clear all cache entries."""
        with self._lock:
            self._cache.clear()
            self._dirty = True
            self._save_cache()
    
    def get_all_installed(self) -> Set[str]:
        """
        Get set of all packages marked as installed.
        
        Returns:
            Set of package names that are marked as installed
        """
        with self._lock:
            return {name for name, entry in self._cache.items() 
                   if entry.get('installed', False)}
    
    def __len__(self) -> int:
        """Return number of cached packages."""
        return len(self._cache)


# =============================================================================
# INSTALLATION POLICY (from install_policy.py)
# =============================================================================

class LazyInstallPolicy:
    """
    Security and policy configuration for lazy installation.
    Per-package allow/deny lists, index URLs, and security settings.
    """
    __slots__ = ()
    
    _allow_lists: Dict[str, Set[str]] = {}
    _deny_lists: Dict[str, Set[str]] = {}
    _index_urls: Dict[str, str] = {}
    _extra_index_urls: Dict[str, List[str]] = {}
    _trusted_hosts: Dict[str, List[str]] = {}
    _require_hashes: Dict[str, bool] = {}
    _verify_ssl: Dict[str, bool] = {}
    _lockfile_paths: Dict[str, str] = {}
    _lock = threading.RLock()
    
    @classmethod
    def set_allow_list(cls, package_name: str, allowed_packages: List[str]) -> None:
        """Set allow list for a package (only these can be installed)."""
        with cls._lock:
            cls._allow_lists[package_name] = set(allowed_packages)
            _log("config", f"Set allow list for {package_name}: {len(allowed_packages)} packages")
    
    @classmethod
    def set_deny_list(cls, package_name: str, denied_packages: List[str]) -> None:
        """Set deny list for a package (these cannot be installed)."""
        with cls._lock:
            cls._deny_lists[package_name] = set(denied_packages)
            _log("config", f"Set deny list for {package_name}: {len(denied_packages)} packages")
    
    @classmethod
    def add_to_allow_list(cls, package_name: str, allowed_package: str) -> None:
        """Add single package to allow list."""
        with cls._lock:
            if package_name not in cls._allow_lists:
                cls._allow_lists[package_name] = set()
            cls._allow_lists[package_name].add(allowed_package)
    
    @classmethod
    def add_to_deny_list(cls, package_name: str, denied_package: str) -> None:
        """Add single package to deny list."""
        with cls._lock:
            if package_name not in cls._deny_lists:
                cls._deny_lists[package_name] = set()
            cls._deny_lists[package_name].add(denied_package)
    
    @classmethod
    def is_package_allowed(cls, installer_package: str, target_package: str) -> Tuple[bool, str]:
        """Check if target_package can be installed by installer_package."""
        with cls._lock:
            if installer_package in cls._deny_lists:
                if target_package in cls._deny_lists[installer_package]:
                    return False, f"Package '{target_package}' is in deny list"
            
            if installer_package in cls._allow_lists:
                if target_package not in cls._allow_lists[installer_package]:
                    return False, f"Package '{target_package}' not in allow list"
            
            return True, "OK"
    
    @classmethod
    def set_index_url(cls, package_name: str, index_url: str) -> None:
        """Set PyPI index URL for a package."""
        with cls._lock:
            cls._index_urls[package_name] = index_url
            _log("config", f"Set index URL for {package_name}: {index_url}")
    
    @classmethod
    def set_extra_index_urls(cls, package_name: str, urls: List[str]) -> None:
        """Set extra index URLs for a package."""
        with cls._lock:
            cls._extra_index_urls[package_name] = urls
            _log("config", f"Set {len(urls)} extra index URLs for {package_name}")
    
    @classmethod
    def add_trusted_host(cls, package_name: str, host: str) -> None:
        """Add trusted host for a package."""
        with cls._lock:
            if package_name not in cls._trusted_hosts:
                cls._trusted_hosts[package_name] = []
            cls._trusted_hosts[package_name].append(host)
    
    @classmethod
    def get_pip_args(cls, package_name: str) -> List[str]:
        """Get pip install arguments for a package based on policy."""
        args = []
        
        with cls._lock:
            if package_name in cls._index_urls:
                args.extend(['--index-url', cls._index_urls[package_name]])
            
            if package_name in cls._extra_index_urls:
                for url in cls._extra_index_urls[package_name]:
                    args.extend(['--extra-index-url', url])
            
            if package_name in cls._trusted_hosts:
                for host in cls._trusted_hosts[package_name]:
                    args.extend(['--trusted-host', host])
            
            if cls._require_hashes.get(package_name, False):
                args.append('--require-hashes')
            
            if not cls._verify_ssl.get(package_name, True):
                args.append('--no-verify-ssl')
        
        return args
    
    @classmethod
    def set_lockfile_path(cls, package_name: str, path: str) -> None:
        """Set lockfile path for a package."""
        with cls._lock:
            cls._lockfile_paths[package_name] = path
    
    @classmethod
    def get_lockfile_path(cls, package_name: str) -> Optional[str]:
        """Get lockfile path for a package."""
        with cls._lock:
            return cls._lockfile_paths.get(package_name)


# Environment variables
_ENV_ASYNC_INSTALL = os.environ.get("XWLAZY_ASYNC_INSTALL", "").strip().lower() in {"1", "true", "yes", "on"}
_ENV_ASYNC_WORKERS = int(os.environ.get("XWLAZY_ASYNC_WORKERS", "0") or 0)
_KNOWN_MISSING_CACHE_LIMIT = int(os.environ.get("XWLAZY_MISSING_CACHE_MAX", "128") or 128)
_KNOWN_MISSING_CACHE_TTL = float(os.environ.get("XWLAZY_MISSING_CACHE_TTL", "120") or 120.0)
_DEFAULT_ASYNC_CACHE_DIR = Path(
    os.environ.get(
        "XWLAZY_ASYNC_CACHE_DIR",
        os.path.join(os.path.expanduser("~"), ".xwlazy", "wheel-cache"),
    )
)


class InstallStatus(Enum):
    """Installation status."""
    PENDING = "pending"
    RUNNING = "running"
    SUCCESS = "success"
    FAILED = "failed"
    SKIPPED = "skipped"


@dataclass
class InstallResult:
    """Result of an installation operation."""
    package_name: str
    success: bool
    status: InstallStatus
    error: Optional[str] = None
    version: Optional[str] = None
    source: Optional[str] = None  # "cache", "pip", "wheel", etc.


class InstallerEngine:
    """
    Unified async execution engine for install operations.
    
    All install-related functionality is centralized here.
    
    Features:
    - Parallel async execution for installs (waits for all to complete)
    - Integration with InstallCache and InstallPolicy
    - Support for all install modes (SMART, FULL, CLEAN, TEMPORARY, SIZE_AWARE, etc.)
    - Progress tracking and error handling
    - Retry logic with exponential backoff
    """
    
    def __init__(self, package_name: str = 'default'):
        """
        Initialize installer engine.
        
        Args:
            package_name: Package name for isolation
        """
        self._package_name = package_name
        self._install_cache = InstallationCache()
        self._loop: Optional[asyncio.AbstractEventLoop] = None
        self._loop_thread: Optional[threading.Thread] = None
        self._lock = threading.RLock()
        self._active_installs: Set[str] = set()  # Track active installs to prevent duplicates
        
        # Get install mode from config
        self._mode = LazyInstallConfig.get_install_mode(package_name) or LazyInstallMode.SMART
    
    def _ensure_loop(self) -> asyncio.AbstractEventLoop:
        """Ensure async event loop is running in background thread."""
        if self._loop is None or self._loop.is_closed():
            self._loop = asyncio.new_event_loop()
            self._loop_thread = threading.Thread(
                target=self._run_loop,
                daemon=True,
                name=f"InstallerEngine-{self._package_name}"
            )
            self._loop_thread.start()
        return self._loop
    
    def _run_loop(self):
        """Run event loop in background thread."""
        asyncio.set_event_loop(self._loop)
        self._loop.run_forever()
    
    def _get_installed_version(self, package_name: str) -> Optional[str]:
        """Get installed version of a package."""
        try:
            dist = importlib.metadata.distribution(package_name)
            return dist.version
        except importlib.metadata.PackageNotFoundError:
            return None
    
    async def _install_single(
        self,
        package_name: str,
        module_name: Optional[str] = None,
        max_retries: int = 3,
        initial_delay: float = 1.0
    ) -> InstallResult:
        """
        Install a single package asynchronously.
        
        Args:
            package_name: Package name to install
            module_name: Optional module name (for context)
            max_retries: Maximum retry attempts
            initial_delay: Initial delay before retry (exponential backoff)
            
        Returns:
            InstallResult with success status and details
        """
        # Prevent duplicate installs
        with self._lock:
            if package_name in self._active_installs:
                logger.debug(f"Install already in progress for {package_name}, skipping")
                return InstallResult(
                    package_name=package_name,
                    success=False,
                    status=InstallStatus.SKIPPED,
                    error="Install already in progress"
                )
            self._active_installs.add(package_name)
        
        try:
            # Check cache first
            if self._install_cache.is_installed(package_name):
                version = self._install_cache.get_version(package_name)
                logger.debug(f"Package {package_name} already installed (cached)")
                return InstallResult(
                    package_name=package_name,
                    success=True,
                    status=InstallStatus.SUCCESS,
                    version=version,
                    source="cache"
                )
            
            # Security check
            allowed, reason = LazyInstallPolicy.is_package_allowed(
                self._package_name, package_name
            )
            if not allowed:
                return InstallResult(
                    package_name=package_name,
                    success=False,
                    status=InstallStatus.FAILED,
                    error=f"Security policy violation: {reason}"
                )
            
            # Check externally managed environment (PEP 668)
            if self._is_externally_managed():
                return InstallResult(
                    package_name=package_name,
                    success=False,
                    status=InstallStatus.FAILED,
                    error="Environment is externally managed (PEP 668)"
                )
            
            # SIZE_AWARE mode: Check package size
            if self._mode == LazyInstallMode.SIZE_AWARE:
                mode_config = LazyInstallConfig.get_mode_config(self._package_name)
                threshold_mb = mode_config.large_package_threshold_mb if mode_config else 50.0
                
                size_mb = await self._get_package_size_mb(package_name)
                if size_mb is not None and size_mb >= threshold_mb:
                    logger.warning(
                        f"Package '{package_name}' is {size_mb:.1f}MB "
                        f"(>= {threshold_mb}MB threshold), skipping in SIZE_AWARE mode"
                    )
                    return InstallResult(
                        package_name=package_name,
                        success=False,
                        status=InstallStatus.SKIPPED,
                        error=f"Package too large ({size_mb:.1f}MB >= {threshold_mb}MB)"
                    )
            
            # Retry logic with exponential backoff
            delay = initial_delay
            last_error = None
            
            for attempt in range(max_retries):
                try:
                    # Get pip args from policy
                    policy_args = LazyInstallPolicy.get_pip_args(self._package_name) or []
                    pip_args = [
                        sys.executable, '-m', 'pip', 'install', package_name
                    ] + policy_args
                    
                    # Run pip install
                    process = await asyncio.create_subprocess_exec(
                        *pip_args,
                        stdout=asyncio.subprocess.PIPE,
                        stderr=asyncio.subprocess.PIPE
                    )
                    
                    stdout, stderr = await process.communicate()
                    
                    if process.returncode == 0:
                        # Success - mark in cache
                        version = self._get_installed_version(package_name)
                        self._install_cache.mark_installed(package_name, version)
                        
                        logger.info(f"Successfully installed {package_name} (version: {version})")
                        
                        return InstallResult(
                            package_name=package_name,
                            success=True,
                            status=InstallStatus.SUCCESS,
                            version=version,
                            source="pip"
                        )
                    else:
                        error_msg = stderr.decode() if stderr else "Unknown error"
                        last_error = f"pip install failed: {error_msg}"
                        
                        if attempt < max_retries - 1:
                            logger.warning(
                                f"Install attempt {attempt + 1} failed for {package_name}, "
                                f"retrying in {delay}s..."
                            )
                            await asyncio.sleep(delay)
                            delay *= 2  # Exponential backoff
                        else:
                            logger.error(f"Failed to install {package_name} after {max_retries} attempts")
                            
                except Exception as e:
                    last_error = str(e)
                    if attempt < max_retries - 1:
                        logger.warning(
                            f"Install attempt {attempt + 1} failed for {package_name}: {e}, "
                            f"retrying in {delay}s..."
                        )
                        await asyncio.sleep(delay)
                        delay *= 2
                    else:
                        logger.error(f"Error installing {package_name}: {e}")
            
            return InstallResult(
                package_name=package_name,
                success=False,
                status=InstallStatus.FAILED,
                error=last_error or "Unknown error"
            )
            
        finally:
            # Remove from active installs
            with self._lock:
                self._active_installs.discard(package_name)
    
    async def _get_package_size_mb(self, package_name: str) -> Optional[float]:
        """Get package size in MB (for SIZE_AWARE mode)."""
        try:
            cmd = [
                sys.executable, '-m', 'pip', 'show', package_name
            ]
            process = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            stdout, _ = await process.communicate()
            
            if process.returncode == 0:
                # Parse output to find size
                # This is a simplified version - actual implementation may vary
                output = stdout.decode()
                # Look for Size: field or estimate from download size
                # For now, return None (would need more sophisticated parsing)
                return None
        except Exception:
            pass
        return None
    
    def _is_externally_managed(self) -> bool:
        """Check if Python environment is externally managed (PEP 668)."""
        from pathlib import Path
        marker_file = Path(sys.prefix) / "EXTERNALLY-MANAGED"
        return marker_file.exists()
    
    def install_many(
        self,
        *package_names: str,
        callback: Optional[Callable[[str, InstallResult], None]] = None
    ) -> Dict[str, InstallResult]:
        """
        Install multiple packages in parallel (async), but wait for all to complete.
        
        This is a SYNCHRONOUS method that internally uses async execution.
        It waits for all installations to complete before returning.
        
        Args:
            *package_names: Package names to install
            callback: Optional callback called as (package_name, result) for each completion
            
        Returns:
            Dict mapping package_name -> InstallResult
        """
        if not package_names:
            return {}
        
        # Filter out already installed packages
        to_install = []
        results = {}
        
        for name in package_names:
            if self._install_cache.is_installed(name):
                version = self._install_cache.get_version(name)
                result = InstallResult(
                    package_name=name,
                    success=True,
                    status=InstallStatus.SUCCESS,
                    version=version,
                    source="cache"
                )
                results[name] = result
                if callback:
                    callback(name, result)
            else:
                to_install.append(name)
        
        if not to_install:
            return results
        
        # Create async tasks for all packages
        loop = self._ensure_loop()
        
        async def _install_all():
            """Install all packages in parallel."""
            tasks = [
                self._install_single(name)
                for name in to_install
            ]
            return await asyncio.gather(*tasks, return_exceptions=True)
        
        # Wait for all to complete (synchronous wait)
        try:
            future = asyncio.run_coroutine_threadsafe(_install_all(), loop)
            install_results = future.result(timeout=600)  # 10 min timeout
            
            # Process results
            for name, result in zip(to_install, install_results):
                if isinstance(result, Exception):
                    install_result = InstallResult(
                        package_name=name,
                        success=False,
                        status=InstallStatus.FAILED,
                        error=str(result)
                    )
                else:
                    install_result = result
                
                results[name] = install_result
                
                # Update cache for successful installs
                if install_result.success:
                    self._install_cache.mark_installed(
                        name,
                        install_result.version
                    )
                
                # Call callback if provided
                if callback:
                    callback(name, install_result)
                    
        except Exception as e:
            logger.error(f"Error in install_many: {e}")
            # Mark remaining as failed
            for name in to_install:
                if name not in results:
                    results[name] = InstallResult(
                        package_name=name,
                        success=False,
                        status=InstallStatus.FAILED,
                        error=str(e)
                    )
        
        return results
    
    def install_one(
        self,
        package_name: str,
        module_name: Optional[str] = None
    ) -> InstallResult:
        """
        Install a single package (synchronous interface).
        
        Args:
            package_name: Package name to install
            module_name: Optional module name (for context)
            
        Returns:
            InstallResult with success status
        """
        results = self.install_many(package_name)
        return results.get(package_name, InstallResult(
            package_name=package_name,
            success=False,
            status=InstallStatus.FAILED,
            error="Installation not executed"
        ))
    
    def set_mode(self, mode: LazyInstallMode) -> None:
        """Set installation mode."""
        with self._lock:
            self._mode = mode
    
    def get_mode(self) -> LazyInstallMode:
        """Get current installation mode."""
        return self._mode


# =============================================================================
# ASYNC INSTALL HANDLE (from async_install_handle.py)
# =============================================================================

class AsyncInstallHandle:
    """Lightweight handle for background installation jobs."""
    
    __slots__ = ("_task_or_future", "module_name", "package_name", "installer_package")
    
    def __init__(
        self,
        task_or_future: Any,  # Can be Future or asyncio.Task
        module_name: str,
        package_name: str,
        installer_package: str,
    ) -> None:
        self._task_or_future = task_or_future
        self.module_name = module_name
        self.package_name = package_name
        self.installer_package = installer_package
    
    def wait(self, timeout: Optional[float] = None) -> bool:
        """Wait for installation to complete."""
        try:
            # Handle concurrent.futures.Future (from asyncio.run_coroutine_threadsafe)
            if hasattr(self._task_or_future, 'result'):
                result = self._task_or_future.result(timeout=timeout)
                return bool(result)
            # Handle asyncio.Task
            elif hasattr(self._task_or_future, 'done'):
                if timeout is None:
                    # Use asyncio.wait_for if we have a loop
                    try:
                        loop = asyncio.get_event_loop()
                        if loop.is_running():
                            # Can't wait in running loop, return False
                            return False
                    except RuntimeError:
                        pass
                    # Create new event loop to wait
                    return asyncio.run(self._wait_task())
                else:
                    return asyncio.run(asyncio.wait_for(self._wait_task(), timeout=timeout))
            return False
        except Exception:
            return False
    
    async def _wait_task(self) -> bool:
        """Async helper to wait for task."""
        if hasattr(self._task_or_future, 'done'):
            await self._task_or_future
            return bool(self._task_or_future.result() if hasattr(self._task_or_future, 'result') else True)
        return False
    
    @property
    def done(self) -> bool:
        """Check if installation is complete."""
        if hasattr(self._task_or_future, 'done'):
            return self._task_or_future.done()
        return False


# =============================================================================
# INSTALLATION UTILITIES (from install_utils.py)
# =============================================================================

def _get_trigger_file() -> Optional[str]:
    """Get the file that triggered the import (from call stack)."""
    try:
        # Walk up the call stack to find the first non-xwlazy file
        # Look for files in xwsystem, xwnode, xwdata, or user code
        for frame_info in inspect.stack():
            filename = frame_info.filename
            # Skip xwlazy internal files and importlib
            if ('xwlazy' not in filename and 
                'importlib' not in filename and 
                '<frozen' not in filename and
                filename.endswith('.py')):
                # Return just the filename, not full path
                basename = os.path.basename(filename)
                # If it's a serialization file, use that
                if 'serialization' in filename or 'formats' in filename:
                    # Extract the format name (e.g., bson.py -> BsonSerializer)
                    if basename.endswith('.py'):
                        basename = basename[:-3]  # Remove .py
                    return f"{basename.capitalize()}Serializer" if basename else None
                return basename
    except Exception:
        pass
    return None


def _is_externally_managed() -> bool:
    """Check if Python environment is externally managed (PEP 668)."""
    marker_file = Path(sys.prefix) / "EXTERNALLY-MANAGED"
    return marker_file.exists()


def _check_pip_audit_available() -> bool:
    """Check if pip-audit is available for vulnerability scanning."""
    try:
        result = subprocess.run(
            [sys.executable, '-m', 'pip', 'list'],
            capture_output=True,
            text=True,
            timeout=5
        )
        return 'pip-audit' in result.stdout
    except Exception:
        return False


# =============================================================================
# INSTALLER REGISTRY (from installer_registry.py)
# =============================================================================

class LazyInstallerRegistry:
    """Registry to manage separate lazy installer instances per package."""
    _instances: Dict[str, 'LazyInstaller'] = {}
    _lock = threading.RLock()
    
    @classmethod
    def get_instance(cls, package_name: str = 'default') -> 'LazyInstaller':
        """Get or create a lazy installer instance for a package."""
        # LazyInstaller is defined in this same file, so no import needed
        with cls._lock:
            if package_name not in cls._instances:
                # Forward reference - LazyInstaller is defined below
                cls._instances[package_name] = LazyInstaller(package_name)
            return cls._instances[package_name]
    
    @classmethod
    def get_all_instances(cls) -> Dict[str, 'LazyInstaller']:
        """Get all lazy installer instances."""
        with cls._lock:
            return cls._instances.copy()


# =============================================================================
# LAZY INSTALLER (from installer.py - extends APackageHelper)
# =============================================================================

class LazyInstaller(APackageHelper):
    """
    Lazy installer that automatically installs missing packages on import failure.
    Each instance is isolated per package to prevent interference.
    
    This class extends APackageHelper and provides comprehensive installation functionality.
    """
    
    __slots__ = APackageHelper.__slots__ + (
        '_dependency_mapper',
        '_auto_approve_all',
        '_async_enabled',
        '_async_workers',
        '_async_loop',
        '_async_tasks',
        '_known_missing',
        '_async_cache_dir',
        '_loop_thread',
        '_install_cache',
    )
    
    def __init__(self, package_name: str = 'default'):
        """Initialize lazy installer for a specific package."""
        super().__init__(package_name)
        self._dependency_mapper = DependencyMapper(package_name)
        self._auto_approve_all = False
        self._async_enabled = False
        self._async_workers = 1
        self._async_loop: Optional[asyncio.AbstractEventLoop] = None
        self._async_tasks: Dict[str, Any] = {}
        self._known_missing: OrderedDict[str, float] = OrderedDict()
        self._async_cache_dir = _DEFAULT_ASYNC_CACHE_DIR
        self._loop_thread: Optional[threading.Thread] = None
        
        # ROOT CAUSE FIX: Load persistent installation cache
        # This cache tracks installed packages across Python restarts
        # and prevents unnecessary importability checks and installations
        self._install_cache = InstallationCache()
    
    def _ask_user_permission(self, package_name: str, module_name: str) -> bool:
        """Ask user for permission to install a package."""
        if self._auto_approve_all:
            return True
        
        print(f"\n{'='*60}")
        print(f"Lazy Installation Active - {self._package_name}")
        print(f"{'='*60}")
        print(f"Package: {package_name}")
        print(f"Module:  {module_name}")
        print(f"{'='*60}")
        print(f"\nThe module '{module_name}' is not installed.")
        print(f"Would you like to install '{package_name}'?")
        print(f"\nOptions:")
        print(f"  [Y] Yes - Install this package")
        print(f"  [N] No  - Skip this package")
        print(f"  [A] All - Install this and all future packages without asking")
        print(f"  [Q] Quit - Cancel and raise ImportError")
        print(f"{'='*60}")
        
        while True:
            try:
                choice = input("Your choice [Y/N/A/Q]: ").strip().upper()
                
                if choice in ('Y', 'YES', ''):
                    return True
                elif choice in ('N', 'NO'):
                    return False
                elif choice in ('A', 'ALL'):
                    self._auto_approve_all = True
                    return True
                elif choice in ('Q', 'QUIT'):
                    raise KeyboardInterrupt("User cancelled installation")
                else:
                    print(f"Invalid choice '{choice}'. Please enter Y, N, A, or Q.")
            except (EOFError, KeyboardInterrupt):
                print("\n❌ Installation cancelled by user")
                return False
    
    def install_package(self, package_name: str, module_name: str = None) -> bool:
        """Install a package using pip."""
        _ensure_logging_initialized()
        # CRITICAL: Set flag FIRST before ANY operations to prevent recursion
        if getattr(_installing, 'active', False):
            print(f"[DEBUG] Installation already in progress, skipping {package_name} to prevent recursion")
            return False
        
        # Check global recursion depth to prevent infinite recursion
        from ..module.importer_engine import _installation_depth, _installation_depth_lock
        with _installation_depth_lock:
            if _installation_depth > 0:
                print(f"[DEBUG] Installation recursion detected (depth={_installation_depth}), skipping {package_name}")
                return False
            _installation_depth += 1
        
        # Set flag IMMEDIATELY to prevent any imports during installation from triggering recursion
        _installing.active = True
        
        try:
            with self._lock:
                if package_name in self._installed_packages:
                    return True
                
                if package_name in self._failed_packages:
                    return False
                
                if self._mode == LazyInstallMode.DISABLED or self._mode == LazyInstallMode.NONE:
                    _log("install", f"Lazy installation disabled for {self._package_name}, skipping {package_name}")
                    return False
                
                if self._mode == LazyInstallMode.WARN:
                    logger.warning(f"[WARN] Package '{package_name}' is missing but WARN mode is active - not installing")
                    print(f"[WARN] ({self._package_name}): Package '{package_name}' is missing (not installed in WARN mode)")
                    return False
                
                if self._mode == LazyInstallMode.DRY_RUN:
                    print(f"[DRY RUN] ({self._package_name}): Would install package '{package_name}'")
                    return False
                
                if self._mode == LazyInstallMode.INTERACTIVE:
                    if not self._ask_user_permission(package_name, module_name or package_name):
                        _log("install", f"User declined installation of {package_name}")
                        self._failed_packages.add(package_name)
                        return False
                
                # Security checks
                if _is_externally_managed():
                    logger.error(f"Cannot install {package_name}: Environment is externally managed (PEP 668)")
                    print(f"\n[ERROR] This Python environment is externally managed (PEP 668)")
                    print(f"Package '{package_name}' cannot be installed in this environment.")
                    print(f"\nSuggested solutions:")
                    print(f"  1. Create a virtual environment:")
                    print(f"     python -m venv .venv")
                    print(f"     .venv\\Scripts\\activate  # Windows")
                    print(f"     source .venv/bin/activate  # Linux/macOS")
                    print(f"  2. Use pipx for isolated installs:")
                    print(f"     pipx install {package_name}")
                    print(f"  3. Override with --break-system-packages (NOT RECOMMENDED)\n")
                    self._failed_packages.add(package_name)
                    return False
                
                allowed, reason = LazyInstallPolicy.is_package_allowed(self._package_name, package_name)
                if not allowed:
                    logger.error(f"Cannot install {package_name}: {reason}")
                    print(f"\n[SECURITY] Package '{package_name}' blocked: {reason}\n")
                    self._failed_packages.add(package_name)
                    return False
                
                # Show warning about missing library with trigger file
                trigger_file = _get_trigger_file()
                module_display = module_name or package_name
                if trigger_file:
                    used_for = module_display if module_display != package_name else package_name
                    print_formatted("WARN", f"Missing library {package_name} used for ({used_for}) triggered by {trigger_file}", same_line=True)
                else:
                    print_formatted("WARN", f"Missing library {package_name} used for ({module_display})", same_line=True)
                
                # Proceed with installation
                try:
                    print_formatted("INFO", f"Installing package: {package_name}", same_line=True)
                    policy_args = LazyInstallPolicy.get_pip_args(self._package_name) or []

                    cache_args = list(policy_args)
                    if self._install_from_cached_tree(package_name):
                        print_formatted("ACTION", f"Installing {package_name} via pip...", same_line=True)
                        time.sleep(0.1)
                        self._finalize_install_success(package_name, "cache-tree")
                        return True

                    if self._install_from_cached_wheel(package_name, cache_args):
                        print_formatted("ACTION", f"Installing {package_name} via pip...", same_line=True)
                        wheel_path = self._cached_wheel_name(package_name)
                        self._materialize_cached_tree(package_name, wheel_path)
                        time.sleep(0.1)
                        self._finalize_install_success(package_name, "cache")
                        return True

                    wheel_path = self._ensure_cached_wheel(package_name, cache_args)
                    if wheel_path and self._pip_install_from_path(wheel_path, cache_args):
                        print_formatted("ACTION", f"Installing {package_name} via pip...", same_line=True)
                        self._materialize_cached_tree(package_name, wheel_path)
                        time.sleep(0.1)
                        self._finalize_install_success(package_name, "wheel")
                        return True

                    # Show installation message with animated dots
                    print_formatted("ACTION", f"Installing {package_name} via pip...", same_line=True)
                    
                    # Animate dots while installing
                    stop_animation = threading.Event()
                    
                    def animate_dots():
                        dots = ["", ".", "..", "..."]
                        i = 0
                        while not stop_animation.is_set():
                            msg = f"Installing {package_name} via pip{dots[i % len(dots)]}"
                            print_formatted("ACTION", msg, same_line=True)
                            i += 1
                            time.sleep(0.3)
                    
                    animator = threading.Thread(target=animate_dots, daemon=True)
                    animator.start()
                    
                    try:
                        pip_args = [sys.executable, '-m', 'pip', 'install']
                        if policy_args:
                            pip_args.extend(policy_args)
                            logger.debug(f"Using policy args: {policy_args}")
                        
                        pip_args.append(package_name)
                        
                        result = subprocess.run(
                            pip_args,
                            capture_output=True,
                            text=True,
                            check=True
                        )
                    finally:
                        stop_animation.set()
                        animator.join(timeout=0.5)
                    
                    self._finalize_install_success(package_name, "pip")
                    wheel_path = self._ensure_cached_wheel(package_name, cache_args)
                    if wheel_path:
                        self._materialize_cached_tree(package_name, wheel_path)
                    return True
                    
                except subprocess.CalledProcessError as e:
                    logger.error(f"Failed to install {package_name}: {e.stderr}")
                    print(f"[FAIL] Failed to install {package_name}\n")
                    self._failed_packages.add(package_name)
                    return False
                except Exception as e:
                    logger.error(f"Unexpected error installing {package_name}: {e}")
                    print(f"[ERROR] Unexpected error: {e}\n")
                    self._failed_packages.add(package_name)
                    return False
        finally:
            # CRITICAL: Always clear the installing flag
            _installing.active = False
            # Decrement global recursion depth
            from ..module.importer_engine import _installation_depth, _installation_depth_lock
            with _installation_depth_lock:
                _installation_depth = max(0, _installation_depth - 1)
    
    def _finalize_install_success(self, package_name: str, source: str) -> None:
        """Finalize successful installation by updating caches."""
        # Update in-memory cache
        self._installed_packages.add(package_name)
        
        # ROOT CAUSE FIX: Mark in persistent cache (survives Python restarts)
        version = self._get_installed_version(package_name)
        self._install_cache.mark_installed(package_name, version)
        
        print_formatted("SUCCESS", f"Successfully installed via {source}: {package_name}", same_line=True)
        print()
        
        # CRITICAL: Invalidate import caches so Python can see newly installed modules
        importlib.invalidate_caches()
        sys.path_importer_cache.clear()
        
        if _check_pip_audit_available():
            self._run_vulnerability_audit(package_name)
        self._update_lockfile(package_name)
    
    def _run_vulnerability_audit(self, package_name: str) -> None:
        """Run vulnerability audit on installed package using pip-audit."""
        try:
            result = subprocess.run(
                [sys.executable, '-m', 'pip_audit', '-r', '-', '--format', 'json'],
                input=package_name,
                capture_output=True,
                text=True,
                timeout=30
            )
            
            if result.returncode == 0:
                _log("audit", f"Vulnerability audit passed for {package_name}")
            else:
                try:
                    audit_data = json.loads(result.stdout)
                    if audit_data.get('vulnerabilities'):
                        logger.warning(f"[SECURITY] Vulnerabilities found in {package_name}: {audit_data}")
                        print(f"[SECURITY WARNING] Package '{package_name}' has known vulnerabilities")
                        print(f"Run 'pip-audit' for details")
                except json.JSONDecodeError:
                    logger.warning(f"Could not parse audit results for {package_name}")
        except subprocess.TimeoutExpired:
            logger.warning(f"Vulnerability audit timed out for {package_name}")
        except Exception as e:
            logger.debug(f"Vulnerability audit skipped for {package_name}: {e}")
    
    def _update_lockfile(self, package_name: str) -> None:
        """Update lockfile with newly installed package."""
        lockfile_path = LazyInstallPolicy.get_lockfile_path(self._package_name)
        if not lockfile_path:
            return
        
        try:
            version = self._get_installed_version(package_name)
            if not version:
                return
            
            lockfile_path = Path(lockfile_path)
            if lockfile_path.exists():
                with open(lockfile_path, 'r', encoding='utf-8') as f:
                    lockdata = json.load(f)
            else:
                lockdata = {
                    "metadata": {
                        "generated_by": f"xwlazy-{self._package_name}",
                        "version": "1.0"
                    },
                    "packages": {}
                }
            
            lockdata["packages"][package_name] = {
                "version": version,
                "installed_at": datetime.now().isoformat(),
                "installer": self._package_name
            }
            
            lockfile_path.parent.mkdir(parents=True, exist_ok=True)
            with open(lockfile_path, 'w', encoding='utf-8') as f:
                json.dump(lockdata, f, indent=2)
            
            _log("sbom", f"Updated lockfile: {lockfile_path}")
        except Exception as e:
            logger.warning(f"Failed to update lockfile: {e}")
    
    def _get_installed_version(self, package_name: str) -> Optional[str]:
        """Get installed version of a package."""
        try:
            result = subprocess.run(
                [sys.executable, '-m', 'pip', 'show', package_name],
                capture_output=True,
                text=True,
                timeout=5
            )
            
            if result.returncode == 0:
                for line in result.stdout.split('\n'):
                    if line.startswith('Version:'):
                        return line.split(':', 1)[1].strip()
        except Exception as e:
            logger.debug(f"Could not get version for {package_name}: {e}")
        return None
    
    def _ensure_async_loop(self) -> asyncio.AbstractEventLoop:
        """Ensure async event loop is running in background thread."""
        if self._async_loop is not None and self._async_loop.is_running():
            return self._async_loop
        
        with self._lock:
            if self._async_loop is None or not self._async_loop.is_running():
                loop_ready = threading.Event()
                loop_ref = [None]
                
                def _run_loop():
                    loop = asyncio.new_event_loop()
                    asyncio.set_event_loop(loop)
                    loop_ref[0] = loop
                    self._async_loop = loop
                    loop_ready.set()
                    loop.run_forever()
                
                self._loop_thread = threading.Thread(
                    target=_run_loop,
                    daemon=True,
                    name=f"xwlazy-{self._package_name}-async"
                )
                self._loop_thread.start()
                
                if not loop_ready.wait(timeout=5.0):
                    raise RuntimeError(f"Failed to start async loop for {self._package_name}")
        
        return self._async_loop
    
    def apply_manifest(self, manifest: Optional[PackageManifest]) -> None:
        """Apply manifest-driven configuration such as async installs."""
        env_override = _ENV_ASYNC_INSTALL
        desired_async = bool(env_override or (manifest and manifest.async_installs))
        desired_workers = _ENV_ASYNC_WORKERS or (manifest.async_workers if manifest else 1)
        desired_workers = max(1, desired_workers)
        
        with self._lock:
            self._async_workers = desired_workers
            
            if desired_async:
                self._ensure_async_loop()
            else:
                if self._async_loop is not None:
                    for task in list(self._async_tasks.values()):
                        if not task.done():
                            task.cancel()
                    self._async_tasks.clear()
            
            self._async_enabled = desired_async
    
    def _prune_known_missing(self) -> None:
        """Remove stale entries from the known-missing cache."""
        if not self._known_missing:
            return
        now = time.monotonic()
        with self._lock:
            while self._known_missing:
                _, ts = next(iter(self._known_missing.items()))
                if now - ts <= _KNOWN_MISSING_CACHE_TTL:
                    break
                self._known_missing.popitem(last=False)
    
    def _mark_module_missing(self, module_name: str) -> None:
        """Remember modules that failed to import recently."""
        with self._lock:
            self._prune_known_missing()
            _spec_cache_clear(module_name)
            self._known_missing[module_name] = time.monotonic()
            while len(self._known_missing) > _KNOWN_MISSING_CACHE_LIMIT:
                self._known_missing.popitem(last=False)
    
    def _clear_module_missing(self, module_name: str) -> None:
        """Remove a module from the known-missing cache."""
        with self._lock:
            self._known_missing.pop(module_name, None)
    
    def _get_async_cache_dir(self) -> Path:
        path = Path(self._async_cache_dir).expanduser()
        path.mkdir(parents=True, exist_ok=True)
        return path
    
    def _cached_wheel_name(self, package_name: str) -> Path:
        safe = package_name.replace("/", "_").replace("\\", "_").replace(":", "_")
        return self._get_async_cache_dir() / f"{safe}.whl"
    
    def _install_from_cached_wheel(self, package_name: str, policy_args: Optional[List[str]] = None) -> bool:
        wheel_path = self._cached_wheel_name(package_name)
        if not wheel_path.exists():
            return False
        return self._pip_install_from_path(wheel_path, policy_args)
    
    def _pip_install_from_path(self, wheel_path: Path, policy_args: Optional[List[str]] = None) -> bool:
        try:
            pip_args = [
                sys.executable,
                '-m',
                'pip',
                'install',
                '--no-deps',
                '--no-input',
                '--disable-pip-version-check',
            ]
            if policy_args:
                pip_args.extend(policy_args)
            pip_args.append(str(wheel_path))
            result = subprocess.run(
                pip_args,
                capture_output=True,
                text=True,
                check=True,
            )
            return result.returncode == 0
        except subprocess.CalledProcessError:
            return False
    
    def _ensure_cached_wheel(self, package_name: str, policy_args: Optional[List[str]] = None) -> Optional[Path]:
        wheel_path = self._cached_wheel_name(package_name)
        if wheel_path.exists():
            return wheel_path
        cache_dir = self._get_async_cache_dir()
        try:
            pip_args = [
                sys.executable,
                '-m',
                'pip',
                'wheel',
                '--no-deps',
                '--disable-pip-version-check',
            ]
            if policy_args:
                pip_args.extend(policy_args)
            pip_args.extend(['--wheel-dir', str(cache_dir), package_name])
            result = subprocess.run(
                pip_args,
                capture_output=True,
                text=True,
                check=True,
            )
            if result.returncode != 0:
                return None
            candidates = sorted(cache_dir.glob("*.whl"), key=lambda p: p.stat().st_mtime, reverse=True)
            if not candidates:
                return None
            primary = candidates[0]
            if wheel_path.exists():
                with suppress(Exception):
                    wheel_path.unlink()
            primary.rename(wheel_path)
            for leftover in candidates[1:]:
                with suppress(Exception):
                    leftover.unlink()
            return wheel_path
        except subprocess.CalledProcessError:
            return None

    def _cached_install_dir(self, package_name: str) -> Path:
        safe = package_name.replace("/", "_").replace("\\", "_").replace(":", "_")
        return self._get_async_cache_dir() / "installs" / safe

    def _has_cached_install_tree(self, package_name: str) -> bool:
        target = self._cached_install_dir(package_name)
        return target.exists() and any(target.iterdir())

    def _site_packages_dir(self) -> Path:
        purelib = sysconfig.get_paths().get("purelib")
        if not purelib:
            purelib = sysconfig.get_paths().get("platlib", sys.prefix)
        path = Path(purelib)
        path.mkdir(parents=True, exist_ok=True)
        return path

    def _install_from_cached_tree(self, package_name: str) -> bool:
        src = self._cached_install_dir(package_name)
        if not src.exists() or not any(src.iterdir()):
            return False
        target_root = self._site_packages_dir()
        try:
            for item in src.iterdir():
                dest = target_root / item.name
                if dest.exists():
                    if dest.is_dir():
                        shutil.rmtree(dest, ignore_errors=True)
                    else:
                        with suppress(FileNotFoundError):
                            dest.unlink()
                if item.is_dir():
                    shutil.copytree(item, dest)
                else:
                    dest.parent.mkdir(parents=True, exist_ok=True)
                    shutil.copy2(item, dest)
            return True
        except Exception as exc:
            logger.debug("Cached tree install failed for %s: %s", package_name, exc)
            return False

    def _materialize_cached_tree(self, package_name: str, wheel_path: Path) -> None:
        if not wheel_path or not wheel_path.exists():
            return
        target_dir = self._cached_install_dir(package_name)
        if target_dir.exists() and any(target_dir.iterdir()):
            return
        parent = target_dir.parent
        parent.mkdir(parents=True, exist_ok=True)
        temp_dir = Path(
            tempfile.mkdtemp(prefix="xwlazy-cache-", dir=str(parent))
        )
        try:
            with zipfile.ZipFile(wheel_path, "r") as archive:
                archive.extractall(temp_dir)
            if target_dir.exists():
                shutil.rmtree(target_dir, ignore_errors=True)
            shutil.move(str(temp_dir), str(target_dir))
        except Exception as exc:
            logger.debug("Failed to materialize cached tree for %s: %s", package_name, exc)
            with suppress(Exception):
                shutil.rmtree(temp_dir, ignore_errors=True)
        else:
            return
        finally:
            if temp_dir.exists():
                shutil.rmtree(temp_dir, ignore_errors=True)
    
    def is_module_known_missing(self, module_name: str) -> bool:
        """Return True if module recently failed to import."""
        self._prune_known_missing()
        with self._lock:
            return module_name in self._known_missing
    
    def is_async_enabled(self) -> bool:
        """Return True if async installers are enabled for this package."""
        return self._async_enabled
    
    def ensure_async_install(self, module_name: str) -> Optional[AsyncInstallHandle]:
        """Schedule (or reuse) an async install job for module_name if async is enabled."""
        if not self._async_enabled:
            return None
        return self.schedule_async_install(module_name)
    
    async def _get_package_size_mb(self, package_name: str) -> Optional[float]:
        """Get package size in MB by checking pip show or download size."""
        try:
            process = await asyncio.create_subprocess_exec(
                sys.executable, '-m', 'pip', 'show', package_name,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            stdout, _ = await process.communicate()
            
            if process.returncode == 0:
                output = stdout.decode()
                for line in output.split('\n'):
                    if line.startswith('Location:'):
                        location = line.split(':', 1)[1].strip()
                        try:
                            total_size = 0
                            for dirpath, dirnames, filenames in os.walk(location):
                                for filename in filenames:
                                    filepath = os.path.join(dirpath, filename)
                                    if os.path.exists(filepath):
                                        total_size += os.path.getsize(filepath)
                            return total_size / (1024 * 1024)
                        except Exception:
                            pass
        except Exception:
            pass
        
        # Fallback: Try to get download size from PyPI
        try:
            import urllib.request
            url = f"https://pypi.org/pypi/{package_name}/json"
            with urllib.request.urlopen(url, timeout=5) as response:
                data = json.loads(response.read())
                if 'urls' in data and data['urls']:
                    latest = data['urls'][0]
                    if 'size' in latest:
                        return latest['size'] / (1024 * 1024)
        except Exception:
            pass
        
        return None
    
    async def _async_install_package(self, package_name: str, module_name: str) -> bool:
        """Async version of install_package using asyncio subprocess."""
        # SIZE_AWARE mode: Check package size before installing
        if self._mode == LazyInstallMode.SIZE_AWARE:
            mode_config = LazyInstallConfig.get_mode_config(self._package_name)
            threshold_mb = mode_config.large_package_threshold_mb if mode_config else 50.0
            
            size_mb = await self._get_package_size_mb(package_name)
            if size_mb is not None and size_mb >= threshold_mb:
                logger.warning(f"Package '{package_name}' is {size_mb:.1f}MB (>= {threshold_mb}MB threshold), skipping installation in SIZE_AWARE mode")
                print(f"[SIZE_AWARE] Skipping large package '{package_name}' ({size_mb:.1f}MB >= {threshold_mb}MB)")
                self._failed_packages.add(package_name)
                return False
        
        # Check cache first
        if self._install_from_cached_tree(package_name):
            self._finalize_install_success(package_name, "cache-tree")
            return True
        
        # Use asyncio subprocess for pip install
        try:
            policy_args = LazyInstallPolicy.get_pip_args(self._package_name) or []
            pip_args = [sys.executable, '-m', 'pip', 'install'] + policy_args + [package_name]
            
            process = await asyncio.create_subprocess_exec(
                *pip_args,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            
            stdout, stderr = await process.communicate()
            
            if process.returncode == 0:
                self._finalize_install_success(package_name, "pip-async")
                
                # For CLEAN mode, schedule async uninstall after completion
                if self._mode == LazyInstallMode.CLEAN:
                    asyncio.create_task(self._schedule_clean_uninstall(package_name))
                
                # For TEMPORARY mode, uninstall immediately after installation
                if self._mode == LazyInstallMode.TEMPORARY:
                    asyncio.create_task(self.uninstall_package_async(package_name, quiet=True))
                
                return True
            else:
                logger.error(f"Failed to install {package_name}: {stderr.decode()}")
                self._failed_packages.add(package_name)
                return False
        except Exception as e:
            logger.error(f"Error in async install of {package_name}: {e}")
            self._failed_packages.add(package_name)
            return False
    
    async def _schedule_clean_uninstall(self, package_name: str) -> None:
        """Schedule uninstall for CLEAN mode after a delay."""
        await asyncio.sleep(1.0)
        await self.uninstall_package_async(package_name, quiet=True)
    
    async def uninstall_package_async(self, package_name: str, quiet: bool = True) -> bool:
        """Uninstall a package asynchronously in quiet mode."""
        with self._lock:
            if package_name not in self._installed_packages:
                return True
        
        try:
            pip_args = [sys.executable, '-m', 'pip', 'uninstall', '-y', package_name]
            
            process = await asyncio.create_subprocess_exec(
                *pip_args,
                stdout=asyncio.subprocess.PIPE if quiet else None,
                stderr=asyncio.subprocess.PIPE if quiet else None
            )
            
            await process.communicate()
            
            if process.returncode == 0:
                with self._lock:
                    self._installed_packages.discard(package_name)
                if not quiet:
                    logger.info(f"Uninstalled {package_name}")
                return True
            return False
        except Exception as e:
            logger.debug(f"Failed to uninstall {package_name}: {e}")
            return False
    
    def uninstall_package(self, package_name: str, quiet: bool = True) -> bool:
        """Uninstall a package (synchronous wrapper)."""
        if self._async_loop and self._async_loop.is_running():
            asyncio.run_coroutine_threadsafe(
                self.uninstall_package_async(package_name, quiet=quiet),
                self._async_loop
            )
            return True
        else:
            try:
                result = subprocess.run(
                    [sys.executable, '-m', 'pip', 'uninstall', '-y', package_name],
                    capture_output=quiet,
                    check=False
                )
                if result.returncode == 0:
                    with self._lock:
                        self._installed_packages.discard(package_name)
                    return True
                return False
            except Exception as e:
                logger.debug(f"Failed to uninstall {package_name}: {e}")
                return False
    
    def uninstall_all_packages(self, quiet: bool = True) -> None:
        """Uninstall all packages installed by this installer."""
        with self._lock:
            packages_to_uninstall = list(self._installed_packages)
            for package_name in packages_to_uninstall:
                self.uninstall_package(package_name, quiet=quiet)
    
    def schedule_async_install(self, module_name: str) -> Optional[AsyncInstallHandle]:
        """Schedule installation of a dependency in the background using asyncio."""
        if not self._async_enabled:
            return None
        
        package_name = self._dependency_mapper.get_package_name(module_name) or module_name
        if not package_name:
            return None
        
        with self._lock:
            task = self._async_tasks.get(module_name)
            if task is None or task.done():
                self._mark_module_missing(module_name)
                loop = self._ensure_async_loop()
                
                async def _install_and_cleanup():
                    try:
                        result = await self._async_install_package(package_name, module_name)
                        if result:
                            self._clear_module_missing(module_name)
                            try:
                                imported_module = importlib.import_module(module_name)
                                if self._mode == LazyInstallMode.TEMPORARY:
                                    asyncio.create_task(self.uninstall_package_async(package_name, quiet=True))
                            except Exception:
                                pass
                        return result
                    finally:
                        with self._lock:
                            self._async_tasks.pop(module_name, None)
                
                task = asyncio.run_coroutine_threadsafe(_install_and_cleanup(), loop)
                self._async_tasks[module_name] = task
        
        return AsyncInstallHandle(task, module_name, package_name, self._package_name)
    
    async def install_all_dependencies(self) -> None:
        """Install all dependencies from discovered requirements (FULL mode)."""
        if self._mode != LazyInstallMode.FULL:
            return
        
        try:
            from .discovery import get_lazy_discovery
            discovery = get_lazy_discovery()
            if discovery:
                all_deps = discovery.discover_all_dependencies()
                if not all_deps:
                    return
                
                packages_to_install = [
                    (import_name, package_name)
                    for import_name, package_name in all_deps.items()
                    if package_name not in self._installed_packages
                ]
                
                if not packages_to_install:
                    _log("install", f"All dependencies already installed for {self._package_name}")
                    return
                
                _log("install", f"Installing {len(packages_to_install)} dependencies for {self._package_name} (FULL mode)")
                
                batch_size = min(self._async_workers * 2, 10)
                for i in range(0, len(packages_to_install), batch_size):
                    batch = packages_to_install[i:i + batch_size]
                    tasks = [
                        self._async_install_package(package_name, import_name)
                        for import_name, package_name in batch
                    ]
                    results = await asyncio.gather(*tasks, return_exceptions=True)
                    
                    for (import_name, package_name), result in zip(batch, results):
                        if isinstance(result, Exception):
                            logger.error(f"Failed to install {package_name}: {result}")
                        elif result:
                            _log("install", f"✓ Installed {package_name}")
                
                _log("install", f"Completed installing all dependencies for {self._package_name}")
        except Exception as e:
            logger.warning(f"Failed to install all dependencies for {self._package_name}: {e}")
    
    def generate_sbom(self) -> Dict:
        """Generate Software Bill of Materials (SBOM) for installed packages."""
        sbom = {
            "metadata": {
                "format": "xwlazy-sbom",
                "version": "1.0",
                "generated_at": datetime.now().isoformat(),
                "installer_package": self._package_name
            },
            "packages": []
        }
        
        for pkg in self._installed_packages:
            version = self._get_installed_version(pkg)
            sbom["packages"].append({
                "name": pkg,
                "version": version or "unknown",
                "installed_by": self._package_name,
                "source": "pypi"
            })
        
        return sbom
    
    def export_sbom(self, output_path: str) -> bool:
        """Export SBOM to file."""
        try:
            sbom = self.generate_sbom()
            output_path = Path(output_path)
            output_path.parent.mkdir(parents=True, exist_ok=True)
            
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump(sbom, f, indent=2)
            
            _log("sbom", f"Exported SBOM to: {output_path}")
            return True
        except Exception as e:
            logger.error(f"Failed to export SBOM: {e}")
            return False
    
    def _is_module_importable(self, module_name: str) -> bool:
        """Check if module can be imported without installation."""
        try:
            spec = importlib.util.find_spec(module_name)
            return spec is not None and spec.loader is not None
        except (ValueError, AttributeError, ImportError, Exception):
            return False
    
    def is_package_installed(self, package_name: str) -> bool:
        """Check if a package is already installed."""
        # Step 1: Check persistent cache FIRST (fastest, no importability check needed)
        if self._install_cache.is_installed(package_name):
            # Also update in-memory cache for performance
            self._installed_packages.add(package_name)
            return True
        
        # Step 2: Check in-memory cache (fast, but lost on restart)
        if package_name in self._installed_packages:
            return True
        
        # Step 3: Check actual importability (slower, but accurate)
        try:
            # Get module name from package name (heuristic)
            module_name = package_name.replace('-', '_')
            if self._is_module_importable(module_name):
                # Cache in both persistent and in-memory cache
                version = self._get_installed_version(package_name)
                self._install_cache.mark_installed(package_name, version)
                self._installed_packages.add(package_name)
                return True
        except Exception:
            pass
        
        return False
    
    def install_and_import(self, module_name: str, package_name: str = None) -> Tuple[Optional[ModuleType], bool]:
        """
        Install package and import module.
        
        ROOT CAUSE FIX: Check if module is importable FIRST before attempting
        installation. This prevents circular imports and unnecessary installations.
        """
        # CRITICAL: Prevent recursion - if installation is already in progress, skip
        if getattr(_installing, 'active', False):
            logger.debug(f"Installation in progress, skipping install_and_import for {module_name} to prevent recursion")
            return None, False
        
        if not self.is_enabled():
            return None, False
        
        # Get package name early for cache check
        if package_name is None:
            package_name = self._dependency_mapper.get_package_name(module_name)
        
        # ROOT CAUSE FIX: Check persistent cache FIRST (fastest, no importability check)
        if package_name and self._install_cache.is_installed(package_name):
            # Package is in persistent cache - import directly
            try:
                module = importlib.import_module(module_name)
                self._clear_module_missing(module_name)
                _spec_cache_put(module_name, importlib.util.find_spec(module_name))
                logger.debug(f"Module {module_name} is in persistent cache, imported directly")
                return module, True
            except ImportError as e:
                logger.debug(f"Module {module_name} in cache but import failed: {e}")
                # Cache might be stale - fall through to importability check
        
        # ROOT CAUSE FIX: Check if module is ALREADY importable BEFORE doing anything else
        if self._is_module_importable(module_name):
            # Module is already importable - import it directly
            if package_name:
                version = self._get_installed_version(package_name)
                self._install_cache.mark_installed(package_name, version)
            try:
                module = importlib.import_module(module_name)
                self._clear_module_missing(module_name)
                _spec_cache_put(module_name, importlib.util.find_spec(module_name))
                logger.debug(f"Module {module_name} is already importable, imported directly")
                return module, True
            except ImportError as e:
                logger.debug(f"Module {module_name} appeared importable but import failed: {e}")
        
        # Package name should already be set from cache check above
        if package_name is None:
            package_name = self._dependency_mapper.get_package_name(module_name)
            if package_name is None:
                logger.debug(f"Module '{module_name}' is a system/built-in module, not installing")
                return None, False
        
        # Module is NOT importable - need to install it
        # ROOT CAUSE FIX: Temporarily remove ALL xwlazy finders from sys.meta_path
        xwlazy_finder_names = {'LazyMetaPathFinder', 'LazyPathFinder', 'LazyLoader'}
        xwlazy_finders = [f for f in sys.meta_path if type(f).__name__ in xwlazy_finder_names]
        for finder in xwlazy_finders:
            try:
                sys.meta_path.remove(finder)
            except ValueError:
                pass
        
        try:
            # Try importing again after removing finders (in case it was a false negative)
            module = importlib.import_module(module_name)
            self._clear_module_missing(module_name)
            _spec_cache_put(module_name, importlib.util.find_spec(module_name))
            return module, True
        except ImportError:
            pass
        finally:
            # Restore finders in reverse order to maintain original position
            for finder in reversed(xwlazy_finders):
                if finder not in sys.meta_path:
                    sys.meta_path.insert(0, finder)
        
        if self._async_enabled:
            handle = self.schedule_async_install(module_name)
            if handle is not None:
                return None, False

        if self.install_package(package_name, module_name):
            for attempt in range(3):
                try:
                    importlib.invalidate_caches()
                    sys.path_importer_cache.clear()
                    
                    # ROOT CAUSE FIX: Remove ALL xwlazy finders before importing
                    xwlazy_finder_names = {'LazyMetaPathFinder', 'LazyPathFinder', 'LazyLoader'}
                    xwlazy_finders = [f for f in sys.meta_path if type(f).__name__ in xwlazy_finder_names]
                    for finder in xwlazy_finders:
                        try:
                            sys.meta_path.remove(finder)
                        except ValueError:
                            pass
                    
                    try:
                        module = importlib.import_module(module_name)
                        self._clear_module_missing(module_name)
                        _spec_cache_put(module_name, importlib.util.find_spec(module_name))
                        # ROOT CAUSE FIX: Mark in both persistent and in-memory cache
                        version = self._get_installed_version(package_name)
                        self._install_cache.mark_installed(package_name, version)
                        self._installed_packages.add(package_name)
                        return module, True
                    finally:
                        # Restore finders in reverse order to maintain original position
                        for finder in reversed(xwlazy_finders):
                            if finder not in sys.meta_path:
                                sys.meta_path.insert(0, finder)
                except ImportError as e:
                    if attempt < 2:
                        time.sleep(0.1 * (attempt + 1))
                    else:
                        logger.error(f"Still cannot import {module_name} after installing {package_name}: {e}")
                        return None, False
        
        self._mark_module_missing(module_name)
        return None, False
    
    def _check_security_policy(self, package_name: str) -> Tuple[bool, str]:
        """Check security policy for package."""
        return LazyInstallPolicy.is_package_allowed(self._package_name, package_name)
    
    def _run_pip_install(self, package_name: str, args: List[str]) -> bool:
        """Run pip install with arguments."""
        if self._install_from_cached_wheel(package_name):
            return True
        try:
            pip_args = [
                sys.executable,
                '-m',
                'pip',
                'install',
                '--disable-pip-version-check',
                '--no-input',
            ] + args + [package_name]
            result = subprocess.run(
                pip_args,
                capture_output=True,
                text=True,
                check=True,
            )
            if result.returncode == 0:
                self._ensure_cached_wheel(package_name)
                return True
            return False
        except subprocess.CalledProcessError:
            return False
    
    def get_installed_packages(self) -> Set[str]:
        """Get set of installed package names."""
        with self._lock:
            return self._installed_packages.copy()
    
    def get_failed_packages(self) -> Set[str]:
        """Get set of failed package names."""
        with self._lock:
            return self._failed_packages.copy()
    
    def get_async_tasks(self) -> Dict[str, Any]:
        """Get dictionary of async installation tasks."""
        with self._lock:
            return {
                module_name: {
                    'done': task.done() if task else False,
                    'cancelled': task.cancelled() if task else False,
                }
                for module_name, task in self._async_tasks.items()
            }
    
    def get_stats(self) -> Dict[str, Any]:
        """Get installation statistics (extends base class method)."""
        base_stats = super().get_stats()
        with self._lock:
            base_stats.update({
                'async_enabled': self._async_enabled,
                'async_workers': self._async_workers,
                'async_tasks_count': len(self._async_tasks),
                'known_missing_count': len(self._known_missing),
                'auto_approve_all': self._auto_approve_all,
            })
        return base_stats
    
    # Abstract method implementations from APackageHelper
    def _discover_from_sources(self) -> None:
        """Discover dependencies from all sources."""
        from .discovery import get_lazy_discovery
        discovery = get_lazy_discovery()
        if discovery:
            all_deps = discovery.discover_all_dependencies()
            for import_name, package_name in all_deps.items():
                from ..defs import DependencyInfo
                self.discovered_dependencies[import_name] = DependencyInfo(
                    import_name=import_name,
                    package_name=package_name,
                    source='discovery',
                    category='discovered'
                )
    
    def _is_cache_valid(self) -> bool:
        """Check if cached dependencies are still valid."""
        # Use discovery's cache validation
        from .discovery import get_lazy_discovery
        discovery = get_lazy_discovery()
        if discovery:
            return discovery._is_cache_valid()
        return False
    
    def _add_common_mappings(self) -> None:
        """Add common import -> package mappings."""
        # Common mappings are handled by discovery
        pass
    
    def _update_file_mtimes(self) -> None:
        """Update file modification times for cache validation."""
        # File mtimes are handled by discovery
        pass
    
    def _check_importability(self, package_name: str) -> bool:
        """Check if package is importable."""
        return self.is_package_installed(package_name)
    
    def _check_persistent_cache(self, package_name: str) -> bool:
        """Check persistent cache for package installation status."""
        return self._install_cache.is_installed(package_name)
    
    def _mark_installed_in_persistent_cache(self, package_name: str) -> None:
        """Mark package as installed in persistent cache."""
        version = self._get_installed_version(package_name)
        self._install_cache.mark_installed(package_name, version)
    
    def _mark_uninstalled_in_persistent_cache(self, package_name: str) -> None:
        """Mark package as uninstalled in persistent cache."""
        self._install_cache.mark_uninstalled(package_name)
    
    def _run_install(self, *package_names: str) -> None:
        """Run pip install for packages."""
        for package_name in package_names:
            self.install_package(package_name)
    
    def _run_uninstall(self, *package_names: str) -> None:
        """Run pip uninstall for packages."""
        for package_name in package_names:
            self.uninstall_package(package_name, quiet=True)
    
    def is_cache_valid(self, key: str) -> bool:
        """Check if cache entry is still valid."""
        return self._is_cache_valid()


__all__ = [
    'InstallerEngine',
    'InstallResult',
    'InstallStatus',
    'AsyncInstallHandle',
    'LazyInstallerRegistry',
    'LazyInstaller',
    'InstallationCache',
    'LazyInstallPolicy',
    '_get_trigger_file',
    '_is_externally_managed',
    '_check_pip_audit_available',
]


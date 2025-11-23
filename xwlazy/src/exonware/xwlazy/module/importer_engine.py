"""
#exonware/xwlazy/src/exonware/xwlazy/module/importer_engine.py

Import Engine - Unified engine for all import-related operations.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com

Generation Date: 15-Nov-2025

This module provides unified import engine for all import-related functionality.
All import-related functionality is centralized here.

Merged from:
- logging_utils.py (Logging utilities)
- import_tracking.py (Import tracking)
- prefix_trie.py (Prefix trie data structure)
- watched_registry.py (Watched prefix registry)
- deferred_loader.py (Deferred module loader)
- cache_utils.py (Multi-tier cache and bytecode cache)
- parallel_utils.py (Parallel loading utilities)
- module_patching.py (Module patching utilities)
- archive_imports.py (Archive import utilities)
- bootstrap.py (Bootstrap utilities)
- loader.py (Lazy loader)
- registry.py (Lazy module registry)
- importer.py (Lazy importer)
- import_hook.py (Import hook)
- meta_path_finder.py (Meta path finder)

Features:
- Unified import engine for all import operations
- Multi-tier caching (L1/L2/L3)
- Parallel loading support
- Import tracking and circular import prevention
- Watched prefix registry
- Meta path finder for intercepting imports
"""

# =============================================================================
# IMPORTS
# =============================================================================

from __future__ import annotations

import os
import sys
import json
import time
import asyncio
import pickle
import struct
import builtins
import atexit
import logging
import importlib
import importlib.util
import importlib.machinery
import importlib.abc
import threading
import subprocess
import concurrent.futures
from pathlib import Path
from types import ModuleType
from typing import Dict, List, Optional, Set, Tuple, Any, Iterable, Callable
from collections import OrderedDict, defaultdict, Counter, deque
from queue import Queue
from datetime import datetime
from enum import Enum

from ..defs import LazyLoadMode, LazyInstallMode
from ..common.services.dependency_mapper import DependencyMapper
from ..common.services.spec_cache import _spec_cache_get, _spec_cache_put
from ..package.services import LazyInstallerRegistry, LazyInstaller
from ..package.services.config_manager import LazyInstallConfig
from ..package.services.manifest import _normalize_prefix
from ..errors import DeferredImportError
from .base import AModuleHelper

# Import from common (logger and cache)
from ..common.logger import get_logger, log_event
from ..common.cache import MultiTierCache, BytecodeCache

# Import from runtime folder (moved from module folder)
from ..runtime.adaptive_learner import AdaptiveLearner
from ..runtime.intelligent_selector import IntelligentModeSelector, LoadLevel

# =============================================================================
# LOGGER (from common.logger)
# =============================================================================

logger = get_logger("xwlazy.importer_engine")

# =============================================================================
# IMPORT TRACKING (from import_tracking.py)
# =============================================================================

_thread_local = threading.local()
_importing = threading.local()
_installing = threading.local()

_installation_depth = 0
_installation_depth_lock = threading.Lock()

def _get_thread_imports() -> Set[str]:
    """Get thread-local import set (creates if needed)."""
    if not hasattr(_thread_local, 'imports'):
        _thread_local.imports = set()
    return _thread_local.imports

def _is_import_in_progress(module_name: str) -> bool:
    """Check if a module import is currently in progress for this thread."""
    return module_name in _get_thread_imports()

def _mark_import_started(module_name: str) -> None:
    """Mark a module import as started for this thread."""
    _get_thread_imports().add(module_name)

def _mark_import_finished(module_name: str) -> None:
    """Mark a module import as finished for this thread."""
    _get_thread_imports().discard(module_name)

def get_importing_state() -> threading.local:
    """Get thread-local importing state."""
    return _importing

def get_installing_state() -> threading.local:
    """Get thread-local installing state."""
    return _installing

# Thread-local storage for installation state
_installing_state = get_installing_state()
_importing_state = get_importing_state()

# Global recursion depth counter to prevent infinite recursion
_installation_depth = 0
_installation_depth_lock = threading.Lock()

# =============================================================================
# PREFIX TRIE (from prefix_trie.py)
# =============================================================================

class _PrefixTrie:
    """Trie data structure for prefix matching."""
    
    __slots__ = ("_root",)

    def __init__(self) -> None:
        self._root: Dict[str, Dict[str, Any]] = {}

    def add(self, prefix: str) -> None:
        """Add a prefix to the trie."""
        node = self._root
        for char in prefix:
            node = node.setdefault(char, {})
        node["_end"] = prefix

    def iter_matches(self, value: str) -> Tuple[str, ...]:
        """Find all matching prefixes for a given value."""
        node = self._root
        matches: List[str] = []
        for char in value:
            end_value = node.get("_end")
            if end_value:
                matches.append(end_value)
            node = node.get(char)
            if node is None:
                break
        else:
            end_value = node.get("_end")
            if end_value:
                matches.append(end_value)
        return tuple(matches)

# =============================================================================
# WATCHED REGISTRY (from watched_registry.py)
# =============================================================================

class WatchedPrefixRegistry:
    """Maintain watched prefixes and provide fast trie-based membership checks."""

    __slots__ = (
        "_lock",
        "_prefix_refcounts",
        "_owner_map",
        "_prefixes",
        "_trie",
        "_dirty",
        "_root_refcounts",
        "_root_snapshot",
        "_root_snapshot_dirty",
    )

    def __init__(self, initial: Optional[List[str]] = None) -> None:
        self._lock = threading.RLock()
        self._prefix_refcounts: Counter[str] = Counter()
        self._owner_map: Dict[str, Set[str]] = {}
        self._prefixes: Set[str] = set()
        self._trie = _PrefixTrie()
        self._dirty = False
        self._root_refcounts: Counter[str] = Counter()
        self._root_snapshot: Set[str] = set()
        self._root_snapshot_dirty = False
        if initial:
            for prefix in initial:
                self._register_manual(prefix)

    def _register_manual(self, prefix: str) -> None:
        normalized = _normalize_prefix(prefix)
        if not normalized:
            return
        owner = "__manual__"
        owners = self._owner_map.setdefault(owner, set())
        if normalized in owners:
            return
        owners.add(normalized)
        self._add_prefix(normalized)

    def _add_prefix(self, prefix: str) -> None:
        if not prefix:
            return
        self._prefix_refcounts[prefix] += 1
        if self._prefix_refcounts[prefix] == 1:
            self._prefixes.add(prefix)
            self._dirty = True
            root = prefix.split('.', 1)[0]
            self._root_refcounts[root] += 1
            self._root_snapshot_dirty = True

    def _remove_prefix(self, prefix: str) -> None:
        if prefix not in self._prefix_refcounts:
            return
        self._prefix_refcounts[prefix] -= 1
        if self._prefix_refcounts[prefix] <= 0:
            self._prefix_refcounts.pop(prefix, None)
            self._prefixes.discard(prefix)
            self._dirty = True
            root = prefix.split('.', 1)[0]
            self._root_refcounts[root] -= 1
            if self._root_refcounts[root] <= 0:
                self._root_refcounts.pop(root, None)
            self._root_snapshot_dirty = True

    def _ensure_trie(self) -> None:
        if not self._dirty:
            return
        self._trie = _PrefixTrie()
        for prefix in self._prefixes:
            self._trie.add(prefix)
        self._dirty = False

    def add(self, prefix: str) -> None:
        normalized = _normalize_prefix(prefix)
        if not normalized:
            return
        with self._lock:
            self._register_manual(normalized)
    
    def is_empty(self) -> bool:
        with self._lock:
            return not self._prefixes

    def register_package(self, package_name: str, prefixes: Iterable[str]) -> None:
        owner_key = f"pkg::{package_name.lower()}"
        normalized = {_normalize_prefix(p) for p in prefixes if _normalize_prefix(p)}
        with self._lock:
            current = self._owner_map.get(owner_key, set())
            to_remove = current - normalized
            to_add = normalized - current

            for prefix in to_remove:
                self._remove_prefix(prefix)
            for prefix in to_add:
                self._add_prefix(prefix)

            if normalized:
                self._owner_map[owner_key] = normalized
            elif owner_key in self._owner_map:
                self._owner_map.pop(owner_key, None)

    def is_prefix_owned_by(self, package_name: str, prefix: str) -> bool:
        normalized = _normalize_prefix(prefix)
        owner_key = f"pkg::{package_name.lower()}"
        with self._lock:
            if normalized in self._owner_map.get("__manual__", set()):
                return True
            return normalized in self._owner_map.get(owner_key, set())

    def get_matching_prefixes(self, module_name: str) -> Tuple[str, ...]:
        with self._lock:
            if not self._prefixes:
                return ()
            self._ensure_trie()
            return self._trie.iter_matches(module_name)

    def has_root(self, root_name: str) -> bool:
        snapshot = self._root_snapshot
        if not self._root_snapshot_dirty:
            return root_name in snapshot
        with self._lock:
            if self._root_snapshot_dirty:
                self._root_snapshot = set(self._root_refcounts.keys())
                self._root_snapshot_dirty = False
            return root_name in self._root_snapshot

# Global registry instance
_DEFAULT_WATCHED_PREFIXES = tuple(
    filter(
        None,
        os.environ.get(
            "XWLAZY_LAZY_PREFIXES",
            "",
        ).split(";"),
    )
)
_watched_registry = WatchedPrefixRegistry(list(_DEFAULT_WATCHED_PREFIXES))

def get_watched_registry() -> WatchedPrefixRegistry:
    """Get the global watched prefix registry."""
    return _watched_registry

# =============================================================================
# DEFERRED LOADER (from deferred_loader.py)
# =============================================================================

class _DeferredModuleLoader(importlib.abc.Loader):
    """Loader that simply returns a preconstructed module placeholder."""

    def __init__(self, module: ModuleType) -> None:
        self._module = module

    def create_module(self, spec):  # noqa: D401 - standard loader hook
        return self._module

    def exec_module(self, module):  # noqa: D401 - nothing to execute
        return None

# =============================================================================
# CACHE (from common.cache)
# =============================================================================

# MultiTierCache and BytecodeCache are now imported from ..common.cache

# =============================================================================
# PARALLEL UTILITIES (from parallel_utils.py)
# =============================================================================

class ParallelLoader:
    """Parallel module loader with smart dependency management."""
    
    def __init__(self, max_workers: Optional[int] = None):
        if max_workers is None:
            max_workers = min(os.cpu_count() or 4, 8)
        
        self._max_workers = max_workers
        self._executor: Optional[concurrent.futures.ThreadPoolExecutor] = None
        self._lock = threading.RLock()
        
    def _get_executor(self) -> concurrent.futures.ThreadPoolExecutor:
        """Get or create thread pool executor."""
        with self._lock:
            if self._executor is None:
                self._executor = concurrent.futures.ThreadPoolExecutor(
                    max_workers=self._max_workers,
                    thread_name_prefix="xwlazy-parallel"
                )
            return self._executor
    
    def load_modules_parallel(self, module_paths: List[str]) -> Dict[str, Any]:
        """Load multiple modules in parallel."""
        executor = self._get_executor()
        results: Dict[str, Any] = {}
        
        def _load_module(module_path: str) -> Tuple[str, Any, Optional[Exception]]:
            try:
                module = importlib.import_module(module_path)
                return (module_path, module, None)
            except Exception as e:
                logger.debug(f"Failed to load {module_path} in parallel: {e}")
                return (module_path, None, e)
        
        futures = {executor.submit(_load_module, path): path for path in module_paths}
        
        for future in concurrent.futures.as_completed(futures):
            module_path, module, error = future.result()
            results[module_path] = (module, error)
        
        return results
    
    def load_modules_with_priority(
        self,
        module_paths: List[Tuple[str, int]]
    ) -> Dict[str, Any]:
        """Load modules in parallel with priority ordering."""
        sorted_modules = sorted(module_paths, key=lambda x: x[1], reverse=True)
        module_list = [path for path, _ in sorted_modules]
        return self.load_modules_parallel(module_list)
    
    def shutdown(self, wait: bool = True) -> None:
        """Shutdown the executor."""
        with self._lock:
            if self._executor:
                self._executor.shutdown(wait=wait)
                self._executor = None

class DependencyGraph:
    """Manages module dependencies for optimal parallel loading."""
    
    def __init__(self):
        self._dependencies: Dict[str, List[str]] = {}
        self._reverse_deps: Dict[str, List[str]] = {}
        self._lock = threading.RLock()
    
    def add_dependency(self, module: str, depends_on: List[str]) -> None:
        """Add dependencies for a module."""
        with self._lock:
            self._dependencies[module] = depends_on
            for dep in depends_on:
                if dep not in self._reverse_deps:
                    self._reverse_deps[dep] = []
                if module not in self._reverse_deps[dep]:
                    self._reverse_deps[dep].append(module)
    
    def get_load_order(self, modules: List[str]) -> List[List[str]]:
        """Get optimal load order for parallel loading (topological sort levels)."""
        with self._lock:
            in_degree: Dict[str, int] = {m: 0 for m in modules}
            for module, deps in self._dependencies.items():
                if module in modules:
                    for dep in deps:
                        if dep in modules:
                            in_degree[module] += 1
            
            levels: List[List[str]] = []
            remaining = set(modules)
            
            while remaining:
                current_level = [
                    m for m in remaining
                    if in_degree[m] == 0
                ]
                
                if not current_level:
                    current_level = list(remaining)
                
                levels.append(current_level)
                remaining -= set(current_level)
                
                for module in current_level:
                    for dependent in self._reverse_deps.get(module, []):
                        if dependent in remaining:
                            in_degree[dependent] = max(0, in_degree[dependent] - 1)
            
            return levels

# =============================================================================
# MODULE PATCHING (from module_patching.py)
# =============================================================================

_original_import_module = importlib.import_module

def _lazy_aware_import_module(name: str, package: Optional[str] = None) -> ModuleType:
    """Lazy-aware version of importlib.import_module."""
    if _is_import_in_progress(name):
        return _original_import_module(name, package)
    
    _mark_import_started(name)
    try:
        return _original_import_module(name, package)
    finally:
        _mark_import_finished(name)

def _patch_import_module() -> None:
    """Patch importlib.import_module to be lazy-aware."""
    importlib.import_module = _lazy_aware_import_module
    logger.debug("Patched importlib.import_module to be lazy-aware")

def _unpatch_import_module() -> None:
    """Restore original importlib.import_module."""
    importlib.import_module = _original_import_module
    logger.debug("Restored original importlib.import_module")

# =============================================================================
# ARCHIVE IMPORTS (from archive_imports.py)
# =============================================================================

_archive_path = None
_archive_added = False

def get_archive_path() -> Path:
    """Get the path to the _archive folder."""
    global _archive_path
    if _archive_path is None:
        current_file = Path(__file__)
        _archive_path = current_file.parent.parent.parent.parent.parent.parent / "_archive"
    return _archive_path

def ensure_archive_in_path() -> None:
    """Ensure the archive folder is in sys.path for imports."""
    global _archive_added
    if not _archive_added:
        archive_path = get_archive_path()
        archive_str = str(archive_path)
        if archive_str not in sys.path:
            sys.path.insert(0, archive_str)
        _archive_added = True

def import_from_archive(module_name: str):
    """Import a module from the archived lazy code."""
    ensure_archive_in_path()
    return __import__(module_name, fromlist=[''])

# =============================================================================
# BOOTSTRAP (from bootstrap.py)
# =============================================================================

def _env_enabled(env_value: Optional[str]) -> Optional[bool]:
    if not env_value:
        return None
    normalized = env_value.strip().lower()
    if normalized in ('true', '1', 'yes', 'on'):
        return True
    if normalized in ('false', '0', 'no', 'off'):
        return False
    return None

def bootstrap_lazy_mode(package_name: str) -> None:
    """Detect whether lazy mode should be enabled for ``package_name`` and bootstrap hooks."""
    package_name = package_name.lower()
    env_value = os.environ.get(f"{package_name.upper()}_LAZY_INSTALL")
    env_enabled = _env_enabled(env_value)
    enabled = env_enabled

    if enabled is None:
        from ...common.services import _detect_lazy_installation
        enabled = _detect_lazy_installation(package_name)

    if not enabled:
        return

    from ..facade import config_package_lazy_install_enabled

    config_package_lazy_install_enabled(
        package_name,
        enabled=True,
        install_hook=True,
    )

def bootstrap_lazy_mode_deferred(package_name: str) -> None:
    """Schedule lazy mode bootstrap to run AFTER the calling package finishes importing."""
    package_name_lower = package_name.lower()
    package_module_name = f"exonware.{package_name_lower}"
    
    original_import = __builtins__.__import__ if hasattr(__builtins__, '__import__') else __import__
    
    def _import_hook(name, *args, **kwargs):
        result = original_import(name, *args, **kwargs)
        
        if name == package_module_name or name.startswith(f"{package_module_name}."):
            if package_module_name in sys.modules:
                import threading
                def _install_hook():
                    if hasattr(__builtins__, '__import__'):
                        __builtins__.__import__ = original_import
                    else:
                        import builtins
                        builtins.__import__ = original_import
                    bootstrap_lazy_mode(package_name_lower)
                
                threading.Timer(0.0, _install_hook).start()
        
        return result
    
    if hasattr(__builtins__, '__import__'):
        __builtins__.__import__ = _import_hook
    else:
        import builtins
        builtins.__import__ = _import_hook

# =============================================================================
# LAZY LOADER (from loader.py)
# =============================================================================

class LazyLoader(AModuleHelper):
    """Thread-safe lazy loader for modules with caching."""
    
    def load_module(self, module_path: str = None) -> ModuleType:
        """Thread-safe module loading with caching."""
        if module_path is None:
            module_path = self._module_path
        
        if self._cached_module is not None:
            return self._cached_module
        
        with self._lock:
            if self._cached_module is not None:
                return self._cached_module
            
            if self._loading:
                raise ImportError(f"Circular import detected for {module_path}")
            
            try:
                self._loading = True
                logger.debug(f"Lazy loading module: {module_path}")
                
                self._cached_module = importlib.import_module(module_path)
                
                logger.debug(f"Successfully loaded: {module_path}")
                return self._cached_module
                
            except Exception as e:
                logger.error(f"Failed to load module {module_path}: {e}")
                raise ImportError(f"Failed to load {module_path}: {e}") from e
            finally:
                self._loading = False
    
    def unload_module(self, module_path: str) -> None:
        """Unload a module from cache."""
        with self._lock:
            if module_path == self._module_path:
                self._cached_module = None
    
    def is_loaded(self) -> bool:
        """Check if module is currently loaded."""
        return self._cached_module is not None
    
    def __getattr__(self, name: str) -> Any:
        """Get attribute from lazily loaded module."""
        module = self.load_module()
        try:
            return getattr(module, name)
        except AttributeError:
            raise AttributeError(
                f"module '{self._module_path}' has no attribute '{name}'"
            )
    
    def __dir__(self) -> list:
        """Return available attributes from loaded module."""
        module = self.load_module()
        return dir(module)

# =============================================================================
# LAZY MODULE REGISTRY (from registry.py)
# =============================================================================

class LazyModuleRegistry:
    """Registry for managing lazy-loaded modules with performance tracking."""
    
    __slots__ = ('_modules', '_load_times', '_lock', '_access_counts')
    
    def __init__(self):
        self._modules: Dict[str, LazyLoader] = {}
        self._load_times: Dict[str, float] = {}
        self._access_counts: Dict[str, int] = {}
        self._lock = threading.RLock()
    
    def register_module(self, name: str, module_path: str) -> None:
        """Register a module for lazy loading."""
        with self._lock:
            if name in self._modules:
                logger.warning(f"Module '{name}' already registered, overwriting")
            
            self._modules[name] = LazyLoader(module_path)
            self._access_counts[name] = 0
            logger.debug(f"Registered lazy module: {name} -> {module_path}")
    
    def get_module(self, name: str) -> LazyLoader:
        """Get a lazy-loaded module."""
        with self._lock:
            if name not in self._modules:
                raise KeyError(f"Module '{name}' not registered")
            
            self._access_counts[name] += 1
            return self._modules[name]
    
    def preload_frequently_used(self, threshold: int = 5) -> None:
        """Preload modules that are accessed frequently."""
        with self._lock:
            for name, count in self._access_counts.items():
                if count >= threshold:
                    try:
                        start_time = time.time()
                        _ = self._modules[name].load_module()
                        self._load_times[name] = time.time() - start_time
                        log_event("hook", logger.info, f"Preloaded frequently used module: {name}")
                    except Exception as e:
                        logger.warning(f"Failed to preload {name}: {e}")
    
    def get_stats(self) -> Dict[str, Any]:
        """Get loading statistics."""
        with self._lock:
            loaded_count = sum(
                1 for loader in self._modules.values() 
                if loader.is_loaded()
            )
            
            return {
                'total_registered': len(self._modules),
                'loaded_count': loaded_count,
                'unloaded_count': len(self._modules) - loaded_count,
                'access_counts': self._access_counts.copy(),
                'load_times': self._load_times.copy(),
            }
    
    def clear_cache(self) -> None:
        """Clear all cached modules."""
        with self._lock:
            for name, loader in self._modules.items():
                loader.unload_module(loader._module_path)
            log_event("config", logger.info, "Cleared all cached modules")

# =============================================================================
# LAZY IMPORTER (from importer.py)
# =============================================================================

class LazyImporter:
    """
    Lazy importer that defers heavy module imports until first access.
    Supports multiple load modes: NONE, AUTO, PRELOAD, BACKGROUND, CACHED,
    TURBO, ADAPTIVE, HYPERPARALLEL, STREAMING, ULTRA, INTELLIGENT.
    """
    
    __slots__ = (
        '_enabled', '_load_mode', '_lazy_modules', '_loaded_modules', '_lock',
        '_access_counts', '_background_tasks', '_async_loop',
        '_multi_tier_cache', '_bytecode_cache', '_adaptive_learner',
        '_parallel_loader', '_dependency_graph', '_load_times',
        '_intelligent_selector', '_effective_mode', '_effective_install_mode'
    )
    
    def __init__(self):
        """Initialize lazy importer."""
        self._enabled = False
        self._load_mode = LazyLoadMode.NONE
        self._lazy_modules: Dict[str, str] = {}
        self._loaded_modules: Dict[str, ModuleType] = {}
        self._access_counts: Dict[str, int] = {}
        self._load_times: Dict[str, float] = {}
        self._background_tasks: Dict[str, asyncio.Task] = {}
        self._async_loop: Optional[asyncio.AbstractEventLoop] = None
        
        # Superior mode components
        self._multi_tier_cache: Optional[MultiTierCache] = None
        self._bytecode_cache: Optional[BytecodeCache] = None
        self._adaptive_learner: Optional[AdaptiveLearner] = None
        self._parallel_loader: Optional[ParallelLoader] = None
        self._dependency_graph: Optional[DependencyGraph] = None
        self._intelligent_selector: Optional[IntelligentModeSelector] = None
        
        # Effective modes (for INTELLIGENT mode)
        self._effective_mode: Optional[LazyLoadMode] = None
        self._effective_install_mode = None
        
        self._lock = threading.RLock()
    
    def _ensure_async_loop(self) -> asyncio.AbstractEventLoop:
        """Ensure async event loop is running for background loading."""
        if self._async_loop is not None and self._async_loop.is_running():
            return self._async_loop
        
        with self._lock:
            if self._async_loop is None or not self._async_loop.is_running():
                loop_ready = threading.Event()
                
                def _run_loop():
                    loop = asyncio.new_event_loop()
                    asyncio.set_event_loop(loop)
                    self._async_loop = loop
                    loop_ready.set()
                    loop.run_forever()
                
                thread = threading.Thread(target=_run_loop, daemon=True, name="xwlazy-loader-async")
                thread.start()
                
                if not loop_ready.wait(timeout=5.0):
                    raise RuntimeError("Failed to start async loop for lazy loader")
        
        return self._async_loop
    
    def enable(self, load_mode: LazyLoadMode = LazyLoadMode.AUTO) -> None:
        """Enable lazy imports with specified load mode."""
        with self._lock:
            self._enabled = True
            self._load_mode = load_mode
            
            # Initialize superior mode components
            if load_mode in (LazyLoadMode.TURBO, LazyLoadMode.ULTRA):
                self._multi_tier_cache = MultiTierCache(l1_size=1000, enable_l3=True)
                self._bytecode_cache = BytecodeCache()
            
            if load_mode == LazyLoadMode.ADAPTIVE:
                self._adaptive_learner = AdaptiveLearner()
                self._multi_tier_cache = MultiTierCache(l1_size=1000, enable_l3=True)
            
            if load_mode == LazyLoadMode.HYPERPARALLEL:
                max_workers = min(os.cpu_count() or 4, 8)
                self._parallel_loader = ParallelLoader(max_workers=max_workers)
                self._dependency_graph = DependencyGraph()
            
            if load_mode == LazyLoadMode.STREAMING:
                self._ensure_async_loop()
            
            if load_mode == LazyLoadMode.ULTRA:
                # ULTRA combines all optimizations
                if self._multi_tier_cache is None:
                    self._multi_tier_cache = MultiTierCache(l1_size=2000, enable_l3=True)
                if self._bytecode_cache is None:
                    self._bytecode_cache = BytecodeCache()
                if self._adaptive_learner is None:
                    self._adaptive_learner = AdaptiveLearner()
                if self._parallel_loader is None:
                    self._parallel_loader = ParallelLoader(max_workers=min(os.cpu_count() or 4, 8))
                if self._dependency_graph is None:
                    self._dependency_graph = DependencyGraph()
                self._ensure_async_loop()
            
            # INTELLIGENT mode: Initialize selector and determine initial mode
            if load_mode == LazyLoadMode.INTELLIGENT:
                self._intelligent_selector = IntelligentModeSelector()
                # Detect initial load level and get optimal mode
                initial_level = self._intelligent_selector.detect_load_level()
                self._effective_mode, self._effective_install_mode = self._intelligent_selector.get_optimal_mode(initial_level)
                logger.info(f"INTELLIGENT mode initialized: {initial_level.value} -> {self._effective_mode.value} + {self._effective_install_mode.value}")
                # Enable the effective mode recursively
                self.enable(self._effective_mode)
                return  # Early return, effective mode is already enabled
            
            # For PRELOAD/TURBO/ULTRA modes, preload modules
            if load_mode in (LazyLoadMode.PRELOAD, LazyLoadMode.TURBO, LazyLoadMode.ULTRA):
                self._preload_all_modules()
            # For BACKGROUND/STREAMING modes, ensure async loop is ready
            elif load_mode in (LazyLoadMode.BACKGROUND, LazyLoadMode.STREAMING):
                self._ensure_async_loop()
            
            log_event("config", logger.info, f"Lazy imports enabled (mode: {load_mode.value})")
    
    def disable(self) -> None:
        """Disable lazy imports."""
        with self._lock:
            self._enabled = False
            
            # Cleanup cache resources
            if self._multi_tier_cache:
                self._multi_tier_cache.shutdown()
            
            log_event("config", logger.info, "Lazy imports disabled")
    
    def is_enabled(self) -> bool:
        """Check if lazy imports are enabled."""
        return self._enabled
    
    def register_lazy_module(self, module_name: str, module_path: str = None) -> None:
        """Register a module for lazy loading."""
        with self._lock:
            if module_path is None:
                module_path = module_name
            
            self._lazy_modules[module_name] = module_path
            self._access_counts[module_name] = 0
            logger.debug(f"Registered lazy module: {module_name} -> {module_path}")
    
    async def _background_load_module(self, module_name: str, module_path: str) -> ModuleType:
        """Load module in background thread."""
        try:
            actual_module = importlib.import_module(module_path)
            with self._lock:
                self._loaded_modules[module_name] = actual_module
                self._access_counts[module_name] += 1
            logger.debug(f"Background loaded module: {module_name}")
            return actual_module
        except ImportError as e:
            logger.error(f"Failed to background load {module_name}: {e}")
            raise
    
    def _preload_all_modules(self) -> None:
        """Preload all registered modules using appropriate strategy based on mode."""
        if not self._lazy_modules:
            return
        
        with self._lock:
            modules_to_load = [
                (name, path) for name, path in self._lazy_modules.items()
                if name not in self._loaded_modules
            ]
        
        if not modules_to_load:
            return
        
        # HYPERPARALLEL/ULTRA: Use thread pool executor
        if self._load_mode in (LazyLoadMode.HYPERPARALLEL, LazyLoadMode.ULTRA) and self._parallel_loader:
            module_paths = [path for _, path in modules_to_load]
            results = self._parallel_loader.load_modules_parallel(module_paths)
            
            with self._lock:
                for (name, path), (module, error) in zip(modules_to_load, results.items()):
                    if module is not None:
                        self._loaded_modules[name] = module
                        self._access_counts[name] = 0
                        if self._adaptive_learner:
                            self._adaptive_learner.record_import(name, 0.0)
            
            log_event("hook", logger.info, f"Parallel preloaded {len([r for r in results.values() if r[0] is not None])} modules")
            return
        
        # TURBO/ULTRA: Preload with predictive caching
        if self._load_mode in (LazyLoadMode.TURBO, LazyLoadMode.ULTRA) and self._multi_tier_cache:
            # Get predictive modules to prioritize
            predictive_keys = self._multi_tier_cache.get_predictive_keys(limit=10)
            priority_modules = [(name, path) for name, path in modules_to_load if name in predictive_keys]
            normal_modules = [(name, path) for name, path in modules_to_load if name not in predictive_keys]
            modules_to_load = priority_modules + normal_modules
        
        # ADAPTIVE: Preload based on learned patterns
        if self._load_mode == LazyLoadMode.ADAPTIVE and self._adaptive_learner:
            priority_modules = self._adaptive_learner.get_priority_modules(limit=10)
            priority_list = [(name, path) for name, path in modules_to_load if name in priority_modules]
            normal_list = [(name, path) for name, path in modules_to_load if name not in priority_modules]
            modules_to_load = priority_list + normal_list
        
        # Default: Use asyncio for parallel loading
        loop = self._ensure_async_loop()
        
        async def _preload_all():
            tasks = [
                self._background_load_module(name, path)
                for name, path in modules_to_load
            ]
            if tasks:
                await asyncio.gather(*tasks, return_exceptions=True)
                log_event("hook", logger.info, f"Preloaded {len(tasks)} modules")
        
        asyncio.run_coroutine_threadsafe(_preload_all(), loop)
    
    def import_module(self, module_name: str, package_name: str = None) -> Any:
        """Import a module with lazy loading."""
        start_time = time.time()
        
        # Fast path: Check if already in sys.modules (lock-free read)
        if module_name in sys.modules:
            # Lock-free check first
            if module_name not in self._loaded_modules:
                with self._lock:
                    # Double-check after acquiring lock
                    if module_name not in self._loaded_modules:
                        self._loaded_modules[module_name] = sys.modules[module_name]
            # Update access count (requires lock)
            with self._lock:
                self._access_counts[module_name] = self._access_counts.get(module_name, 0) + 1
                load_time = time.time() - start_time
                if self._adaptive_learner:
                    self._adaptive_learner.record_import(module_name, load_time)
                if self._load_mode == LazyLoadMode.INTELLIGENT:
                    self._total_import_time = getattr(self, '_total_import_time', 0.0) + load_time
            return sys.modules[module_name]
        
        # Fast path: Check if already loaded (lock-free read)
        if module_name in self._loaded_modules:
            with self._lock:
                # Double-check and update
                if module_name in self._loaded_modules:
                    self._access_counts[module_name] = self._access_counts.get(module_name, 0) + 1
                    if self._adaptive_learner:
                        self._adaptive_learner.record_import(module_name, 0.0)
                    return self._loaded_modules[module_name]
        
        # Check enabled state and get module path (requires lock)
        with self._lock:
            if not self._enabled or self._load_mode == LazyLoadMode.NONE:
                return importlib.import_module(module_name)
            
            if module_name in self._lazy_modules:
                module_path = self._lazy_modules[module_name]
            else:
                return importlib.import_module(module_name)
            
            # Update total import time for intelligent mode (initialization)
            if self._load_mode == LazyLoadMode.INTELLIGENT:
                if not hasattr(self, '_total_import_time'):
                    self._total_import_time = 0.0
        
        # INTELLIGENT mode: Check if mode switch is needed and determine effective mode
        effective_load_mode = self._load_mode
        if self._load_mode == LazyLoadMode.INTELLIGENT and self._intelligent_selector:
            # Throttle load level detection (cache for 0.1s to avoid excessive checks)
            current_time = time.time()
            last_check = getattr(self, '_last_load_level_check', 0.0)
            check_interval = 0.1  # 100ms throttle
            
            if current_time - last_check >= check_interval:
                # Fast path: lock-free reads for stats
                module_count = len(self._loaded_modules)  # Dict read is thread-safe
                total_import_time = getattr(self, '_total_import_time', 0.0)
                import_count = sum(self._access_counts.values())  # Dict read is thread-safe
                
                # Cache psutil import and memory check (only check every 0.5s)
                last_memory_check = getattr(self, '_last_memory_check', 0.0)
                memory_mb = getattr(self, '_cached_memory_mb', 0.0)
                
                if current_time - last_memory_check >= 0.5:
                    try:
                        import psutil
                        process = psutil.Process()
                        memory_mb = process.memory_info().rss / 1024 / 1024
                        self._cached_memory_mb = memory_mb
                        self._last_memory_check = current_time
                    except Exception:
                        memory_mb = 0.0
                
                # Detect current load level (lock-free)
                detected_level = self._intelligent_selector.detect_load_level(
                    module_count=module_count,
                    total_import_time=total_import_time,
                    import_count=import_count,
                    memory_usage_mb=memory_mb
                )
                
                # Check if mode switch is needed (requires lock for write)
                current_mode_tuple = (self._effective_mode or self._load_mode, self._effective_install_mode)
                if self._intelligent_selector.should_switch_mode(current_mode_tuple, detected_level):
                    optimal_load, optimal_install = self._intelligent_selector.get_optimal_mode(detected_level)
                    if optimal_load != self._effective_mode or optimal_install != self._effective_install_mode:
                        with self._lock:  # Only lock for mode switch
                            if optimal_load != self._effective_mode or optimal_install != self._effective_install_mode:
                                logger.info(f"INTELLIGENT mode switching: {detected_level.value} -> {optimal_load.value} + {optimal_install.value}")
                                self._effective_mode = optimal_load
                                self._effective_install_mode = optimal_install
                                # Switch to optimal mode (re-enable with new mode)
                                self.enable(optimal_load)
                
                self._last_load_level_check = current_time
            
            # Use effective mode for processing
            effective_load_mode = self._effective_mode or self._load_mode
        
        # Use effective mode for all checks
        check_mode = effective_load_mode
        
        # TURBO/ULTRA: Check multi-tier cache first
        if check_mode in (LazyLoadMode.TURBO, LazyLoadMode.ULTRA) and self._multi_tier_cache:
            cached_module = self._multi_tier_cache.get(module_name)
            if cached_module is not None:
                with self._lock:
                    self._loaded_modules[module_name] = cached_module
                    self._access_counts[module_name] += 1
                    self._load_times[module_name] = time.time() - start_time
                    if self._adaptive_learner:
                        self._adaptive_learner.record_import(module_name, self._load_times[module_name])
                return cached_module
        
        # ADAPTIVE: Check cache and predict next imports
        if check_mode == LazyLoadMode.ADAPTIVE:
            if self._multi_tier_cache:
                cached_module = self._multi_tier_cache.get(module_name)
                if cached_module is not None:
                    with self._lock:
                        self._loaded_modules[module_name] = cached_module
                        self._access_counts[module_name] += 1
                        load_time = time.time() - start_time
                        self._load_times[module_name] = load_time
                        if self._adaptive_learner:
                            self._adaptive_learner.record_import(module_name, load_time)
                    
                    # Predict and preload next likely imports
                    if self._adaptive_learner:
                        next_imports = self._adaptive_learner.predict_next_imports(module_name, limit=3)
                        self._preload_predictive_modules(next_imports)
                    
                    return cached_module
            
            # Record import for learning
            with self._lock:
                if self._adaptive_learner:
                    # Will be updated after load
                    pass
        
        # HYPERPARALLEL: Use parallel loading
        if check_mode == LazyLoadMode.HYPERPARALLEL and self._parallel_loader:
            results = self._parallel_loader.load_modules_parallel([module_path])
            module, error = results.get(module_path, (None, None))
            if module is not None:
                with self._lock:
                    self._loaded_modules[module_name] = module
                    self._access_counts[module_name] += 1
                    self._load_times[module_name] = time.time() - start_time
                return module
            elif error:
                raise error
        
        # STREAMING: Load asynchronously in background
        if check_mode == LazyLoadMode.STREAMING:
            return self._streaming_load(module_name, module_path)
        
        # BACKGROUND mode: Load in background, return placeholder
        if check_mode == LazyLoadMode.BACKGROUND:
            return self._background_placeholder_load(module_name, module_path)
        
        # TURBO/ULTRA: Load with bytecode cache
        actual_module = None
        if check_mode in (LazyLoadMode.TURBO, LazyLoadMode.ULTRA) and self._bytecode_cache:
            # Try to load from bytecode cache first
            bytecode = self._bytecode_cache.get_cached_bytecode(module_path)
            if bytecode is not None:
                try:
                    # Load from bytecode
                    code = compile(bytecode, f"<cached {module_path}>", "exec")
                    actual_module = importlib.import_module(module_path)
                except Exception as e:
                    logger.debug(f"Failed to load from bytecode cache: {e}")
        
        # Load module (standard or cached)
        if actual_module is None:
            try:
                actual_module = importlib.import_module(module_path)
                
                # Cache bytecode for TURBO/ULTRA
                if check_mode in (LazyLoadMode.TURBO, LazyLoadMode.ULTRA) and self._bytecode_cache:
                    try:
                        # Get compiled bytecode from module
                        if hasattr(actual_module, '__file__') and actual_module.__file__:
                            pyc_path = actual_module.__file__.replace('.py', '.pyc')
                            if os.path.exists(pyc_path):
                                with open(pyc_path, 'rb') as f:
                                    f.seek(16)  # Skip header
                                    bytecode = f.read()
                                    self._bytecode_cache.cache_bytecode(module_path, bytecode)
                    except Exception as e:
                        logger.debug(f"Failed to cache bytecode: {e}")
            except ImportError as e:
                logger.error(f"Failed to lazy load {module_name}: {e}")
                raise
        
        load_time = time.time() - start_time
        
        with self._lock:
            self._loaded_modules[module_name] = actual_module
            self._access_counts[module_name] += 1
            self._load_times[module_name] = load_time
            
            # Update total import time for intelligent mode
            if self._load_mode == LazyLoadMode.INTELLIGENT:
                self._total_import_time = getattr(self, '_total_import_time', 0.0) + load_time
            
            # Cache in multi-tier cache for TURBO/ULTRA/ADAPTIVE
            if self._multi_tier_cache:
                self._multi_tier_cache.set(module_name, actual_module)
            
            # Record for adaptive learning
            if self._adaptive_learner:
                self._adaptive_learner.record_import(module_name, load_time)
            
            logger.debug(f"Lazy loaded module: {module_name} ({load_time*1000:.2f}ms)")
        
        return actual_module
    
    def _streaming_load(self, module_name: str, module_path: str) -> ModuleType:
        """Load module asynchronously with streaming."""
        if module_name not in self._background_tasks or self._background_tasks[module_name].done():
            loop = self._ensure_async_loop()
            task = asyncio.run_coroutine_threadsafe(
                self._background_load_module(module_name, module_path),
                loop
            )
            self._background_tasks[module_name] = task
        
        # Return placeholder that streams
        placeholder = ModuleType(module_name)
        placeholder.__path__ = []
        placeholder.__package__ = module_name
        
        def _streaming_getattr(name):
            task = self._background_tasks.get(module_name)
            if task and not task.done():
                # Non-blocking check with short timeout
                try:
                    task.result(timeout=0.01)  # Very short timeout for streaming
                except Exception:
                    pass  # Still loading, continue
            
            # Check if loaded now
            with self._lock:
                if module_name in self._loaded_modules:
                    return getattr(self._loaded_modules[module_name], name)
            
            # Still loading, wait for completion
            if task and not task.done():
                task.result(timeout=10.0)
            
            with self._lock:
                if module_name in self._loaded_modules:
                    return getattr(self._loaded_modules[module_name], name)
            raise AttributeError(f"module '{module_name}' has no attribute '{name}'")
        
        placeholder.__getattr__ = _streaming_getattr  # type: ignore[attr-defined]
        return placeholder
    
    def _background_placeholder_load(self, module_name: str, module_path: str) -> ModuleType:
        """Load module in background, return placeholder."""
        if module_name not in self._background_tasks or self._background_tasks[module_name].done():
            loop = self._ensure_async_loop()
            task = asyncio.run_coroutine_threadsafe(
                self._background_load_module(module_name, module_path),
                loop
            )
            self._background_tasks[module_name] = task
        
        # Return placeholder module that will be replaced when loaded
        placeholder = ModuleType(module_name)
        placeholder.__path__ = []
        placeholder.__package__ = module_name
        
        def _getattr(name):
            # Wait for background load to complete
            task = self._background_tasks.get(module_name)
            if task and not task.done():
                task.result(timeout=10.0)  # Wait up to 10 seconds
            with self._lock:
                if module_name in self._loaded_modules:
                    return getattr(self._loaded_modules[module_name], name)
            raise AttributeError(f"module '{module_name}' has no attribute '{name}'")
        
        placeholder.__getattr__ = _getattr  # type: ignore[attr-defined]
        return placeholder
    
    def _preload_predictive_modules(self, module_names: list) -> None:
        """Preload modules predicted to be needed soon."""
        if not module_names:
            return
        
        with self._lock:
            modules_to_preload = [
                (name, self._lazy_modules[name])
                for name in module_names
                if name in self._lazy_modules and name not in self._loaded_modules
            ]
        
        if not modules_to_preload:
            return
        
        # Preload in background
        loop = self._ensure_async_loop()
        
        async def _preload_predictive():
            tasks = [
                self._background_load_module(name, path)
                for name, path in modules_to_preload
            ]
            await asyncio.gather(*tasks, return_exceptions=True)
        
        asyncio.run_coroutine_threadsafe(_preload_predictive(), loop)
    
    def preload_module(self, module_name: str) -> bool:
        """Preload a registered lazy module."""
        with self._lock:
            if module_name not in self._lazy_modules:
                logger.warning(f"Module {module_name} not registered for lazy loading")
                return False
            
            try:
                self.import_module(module_name)
                log_event("hook", logger.info, f"Preloaded module: {module_name}")
                return True
            except Exception as e:
                logger.error(f"Failed to preload {module_name}: {e}")
                return False
    
    def get_stats(self) -> Dict[str, Any]:
        """Get lazy import statistics."""
        with self._lock:
            return {
                'enabled': self._enabled,
                'registered_modules': list(self._lazy_modules.keys()),
                'loaded_modules': list(self._loaded_modules.keys()),
                'access_counts': self._access_counts.copy(),
                'total_registered': len(self._lazy_modules),
                'total_loaded': len(self._loaded_modules)
            }

# =============================================================================
# IMPORT HOOK (from import_hook.py)
# =============================================================================

class LazyImportHook(AModuleHelper):
    """
    Import hook that intercepts ImportError and auto-installs packages.
    Performance optimized with zero overhead for successful imports.
    """
    
    __slots__ = AModuleHelper.__slots__
    
    def handle_import_error(self, module_name: str) -> Optional[Any]:
        """Handle ImportError by attempting to install and re-import."""
        if not self._enabled:
            return None
        
        try:
            # Deferred import to avoid circular dependency
            from ..facade import lazy_import_with_install
            module, success = lazy_import_with_install(
                module_name, 
                installer_package=self._package_name
            )
            return module if success else None
        except Exception:
            return None
    
    def install_hook(self) -> None:
        """Install the import hook into sys.meta_path."""
        install_import_hook(self._package_name)
    
    def uninstall_hook(self) -> None:
        """Uninstall the import hook from sys.meta_path."""
        uninstall_import_hook(self._package_name)
    
    def is_installed(self) -> bool:
        """Check if hook is installed."""
        return is_import_hook_installed(self._package_name)

# =============================================================================
# META PATH FINDER (from meta_path_finder.py)
# =============================================================================

# Wrapped class cache
_WRAPPED_CLASS_CACHE: Dict[str, Set[str]] = defaultdict(set)
_wrapped_cache_lock = threading.RLock()

# Default lazy methods
_DEFAULT_LAZY_METHODS = tuple(
    filter(
        None,
        os.environ.get("XWLAZY_LAZY_METHODS", "").split(","),
    )
)

# Lazy prefix method registry
_lazy_prefix_method_registry: Dict[str, Tuple[str, ...]] = {}

# Package class hints
_package_class_hints: Dict[str, Tuple[str, ...]] = {}
_class_hint_lock = threading.RLock()

def _set_package_class_hints(package_name: str, hints: Iterable[str]) -> None:
    """Set class hints for a package."""
    normalized: Tuple[str, ...] = tuple(
        OrderedDict((hint.lower(), None) for hint in hints if hint).keys()  # type: ignore[arg-type]
    )
    with _class_hint_lock:
        if normalized:
            _package_class_hints[package_name] = normalized
        else:
            _package_class_hints.pop(package_name, None)

def _get_package_class_hints(package_name: str) -> Tuple[str, ...]:
    """Get class hints for a package."""
    with _class_hint_lock:
        return _package_class_hints.get(package_name, ())

def _clear_all_package_class_hints() -> None:
    """Clear all package class hints."""
    with _class_hint_lock:
        _package_class_hints.clear()

def register_lazy_module_methods(prefix: str, methods: Tuple[str, ...]) -> None:
    """Register method names to enhance for all classes under a module prefix."""
    prefix = prefix.strip()
    if not prefix:
        return
    
    if not prefix.endswith("."):
        prefix += "."
    
    _lazy_prefix_method_registry[prefix] = methods
    log_event("config", logger.info, f"Registered lazy module methods for prefix {prefix}: {methods}")

def _spec_for_existing_module(
    fullname: str,
    module: ModuleType,
    original_spec: Optional[importlib.machinery.ModuleSpec] = None,
) -> importlib.machinery.ModuleSpec:
    """Build a ModuleSpec whose loader simply returns an already-initialized module."""
    loader = _DeferredModuleLoader(module)
    spec = importlib.machinery.ModuleSpec(fullname, loader)
    if original_spec and original_spec.submodule_search_locations is not None:
        locations = list(original_spec.submodule_search_locations)
        spec.submodule_search_locations = locations
        if hasattr(module, "__path__"):
            module.__path__ = locations
    module.__loader__ = loader
    module.__spec__ = spec
    return spec

class LazyMetaPathFinder:
    """
    Custom meta path finder that intercepts failed imports.
    Performance optimized - only triggers when import would fail anyway.
    """
    
    __slots__ = ('_package_name', '_enabled')
    
    def __init__(self, package_name: str = 'default'):
        """Initialize meta path finder."""
        self._package_name = package_name
        self._enabled = True

    def _build_async_placeholder(
        self,
        fullname: str,
        installer: LazyInstaller,
    ) -> Optional[importlib.machinery.ModuleSpec]:
        """Create and register a deferred module placeholder for async installs."""
        handle = installer.ensure_async_install(fullname)
        if handle is None:
            return None

        missing = ModuleNotFoundError(f"No module named '{fullname}'")
        deferred = DeferredImportError(fullname, missing, self._package_name, async_handle=handle)

        module = ModuleType(fullname)
        loader = _DeferredModuleLoader(module)

        def _resolve_real_module():
            real_module = deferred._try_install_and_import()
            sys.modules[fullname] = real_module
            module.__dict__.clear()
            module.__dict__.update(real_module.__dict__)
            module.__loader__ = getattr(real_module, "__loader__", loader)
            module.__spec__ = getattr(real_module, "__spec__", None)
            module.__path__ = getattr(real_module, "__path__", getattr(module, "__path__", []))
            module.__class__ = real_module.__class__
            try:
                spec_obj = getattr(real_module, "__spec__", None) or importlib.util.find_spec(fullname)
                if spec_obj is not None:
                    _spec_cache_put(fullname, spec_obj)
            except (ValueError, AttributeError, ImportError):
                pass
            return real_module

        def _module_getattr(name):
            real = _resolve_real_module()
            if name in module.__dict__:
                return module.__dict__[name]
            return getattr(real, name)

        def _module_dir():
            try:
                real = _resolve_real_module()
                return dir(real)
            except Exception:
                return []

        module.__getattr__ = _module_getattr  # type: ignore[attr-defined]
        module.__dir__ = _module_dir  # type: ignore[attr-defined]
        module.__loader__ = loader
        module.__package__ = fullname
        module.__path__ = []

        spec = importlib.machinery.ModuleSpec(fullname, loader)
        spec.submodule_search_locations = []
        module.__spec__ = spec

        sys.modules[fullname] = module
        log_event("hook", logger.info, f"⏳ [HOOK] Deferred import placeholder created for '{fullname}'")
        return spec
    
    def find_module(self, fullname: str, path: Optional[str] = None):
        """Find module - returns None to let standard import continue."""
        return None
    
    def find_spec(self, fullname: str, path: Optional[str] = None, target=None):
        """
        Find module spec - intercepts imports to enable two-stage lazy loading.
        
        PERFORMANCE: Optimized for zero overhead on successful imports.
        """
        # Debug logging for msgpack to trace why it's not being intercepted
        if fullname == 'msgpack':
            logger.info(f"[HOOK] find_spec called for msgpack, enabled={self._enabled}, in_sys_modules={fullname in sys.modules}, installing={getattr(_installing_state, 'active', False)}, importing={getattr(_importing_state, 'active', False)}")
        
        # CRITICAL: Check installing state FIRST to prevent recursion during installation
        if getattr(_installing_state, 'active', False):
            if fullname == 'msgpack':
                logger.info(f"[HOOK] Installation in progress, skipping msgpack")
            logger.debug(f"[HOOK] Installation in progress, skipping {fullname} to prevent recursion")
            return None
        
        # Fast path 1: Hook disabled
        if not self._enabled:
            if fullname == 'msgpack':
                logger.info(f"[HOOK] Hook disabled, skipping msgpack")
            return None
        
        # Fast path 2: Module already loaded or partially initialized
        if fullname in sys.modules:
            if fullname == 'msgpack':
                logger.info(f"[HOOK] msgpack already in sys.modules, skipping")
            return None
        
        # Fast path 3: Skip C extension modules and internal modules
        if fullname.startswith('_'):
            logger.debug(f"[HOOK] Skipping C extension/internal module {fullname}")
            return None
        
        # Fast path 4: Check if parent package is partially initialized
        if '.' in fullname:
            parent_package = fullname.split('.', 1)[0]
            if parent_package in sys.modules:
                logger.debug(f"[HOOK] Skipping {fullname} - parent {parent_package} is partially initialized")
                return None
            if _is_import_in_progress(parent_package):
                logger.debug(f"[HOOK] Skipping {fullname} - parent {parent_package} import in progress")
                return None
        
        # ROOT CAUSE FIX: Check lazy install status FIRST
        root_name = fullname.split('.', 1)[0]
        _watched_registry = get_watched_registry()
        
        # Check if lazy install is enabled
        lazy_install_enabled = LazyInstallConfig.is_enabled(self._package_name)
        install_mode = LazyInstallConfig.get_install_mode(self._package_name)
        
        # If lazy install is disabled, only intercept watched modules
        if not lazy_install_enabled or install_mode == LazyInstallMode.NONE:
            if not _watched_registry.has_root(root_name):
                logger.debug(f"[HOOK] Module {fullname} not in watched registry and lazy install disabled, skipping interception")
                return None
        
        # Check persistent installation cache FIRST
        try:
            installer = LazyInstallerRegistry.get_instance(self._package_name)
            package_name = installer._dependency_mapper.get_package_name(root_name)
            if package_name and installer.is_package_installed(package_name):
                logger.debug(f"[HOOK] Package {package_name} is installed (cache check), skipping interception of {fullname}")
                return None
        except Exception:
            pass
        
        # Fast path 4: Cached spec
        cached_spec = _spec_cache_get(fullname)
        if cached_spec is not None:
            return cached_spec
        
        # Fast path 5: Stdlib/builtin check
        if fullname.startswith('importlib') or fullname.startswith('_frozen_importlib'):
            return None
        
        if '.' not in fullname:
            if DependencyMapper._is_stdlib_or_builtin(fullname):
                return None
            if fullname in DependencyMapper.DENY_LIST:
                return None
        
        # Fast path 6: Import in progress
        if _is_import_in_progress(fullname):
            if fullname == 'msgpack':
                logger.info(f"[HOOK] msgpack import in progress, skipping")
            return None
        
        if getattr(_importing_state, 'active', False):
            if fullname == 'msgpack':
                logger.info(f"[HOOK] Global importing active, skipping msgpack")
            return None
        
        # Install mode check already done above
        matching_prefixes: Tuple[str, ...] = ()
        if _watched_registry.has_root(root_name):
            matching_prefixes = _watched_registry.get_matching_prefixes(fullname)
        
        # Debug: Check if msgpack reaches this point
        if fullname == 'msgpack':
            logger.debug(f"[HOOK] msgpack: matching_prefixes={matching_prefixes}, has_root={_watched_registry.has_root(root_name)}")
        
        installer = LazyInstallerRegistry.get_instance(self._package_name)
        
        # Two-stage lazy loading for serialization and archive modules
        if matching_prefixes:
            for prefix in matching_prefixes:
                if not _watched_registry.is_prefix_owned_by(self._package_name, prefix):
                    continue
                if fullname.startswith(prefix):
                    module_suffix = fullname[len(prefix):]
                    
                    if module_suffix:
                        log_event("hook", logger.info, f"[HOOK] Candidate for wrapping: {fullname}")
                        
                        _mark_import_started(fullname)
                        try:
                            if getattr(_importing_state, 'active', False):
                                logger.debug(f"[HOOK] Recursion guard active, skipping {fullname}")
                                return None
                            
                            try:
                                logger.debug(f"[HOOK] Looking for spec: {fullname}")
                                spec = _spec_cache_get(fullname)
                                if spec is None:
                                    try:
                                        spec = importlib.util.find_spec(fullname)
                                    except (ValueError, AttributeError, ImportError):
                                        pass
                                    if spec is not None:
                                        _spec_cache_put(fullname, spec)
                                if spec is not None:
                                    logger.debug(f"[HOOK] Spec found, trying normal import: {fullname}")
                                    _importing_state.active = True
                                    try:
                                        __import__(fullname)
                                        
                                        module = sys.modules.get(fullname)
                                        if module:
                                            try:
                                                self._enhance_classes_with_class_methods(module)
                                            except Exception as enhance_exc:
                                                logger.debug(f"[HOOK] Could not enhance classes in {fullname}: {enhance_exc}")
                                            spec = _spec_for_existing_module(fullname, module, spec)
                                        log_event("hook", logger.info, f"✓ [HOOK] Module {fullname} imported successfully, no wrapping needed")
                                        if spec is not None:
                                            _spec_cache_put(fullname, spec)
                                            return spec
                                        return None
                                    finally:
                                        _importing_state.active = False
                            except ImportError as e:
                                if '.' not in module_suffix:
                                    log_event("hook", logger.info, f"⚠ [HOOK] Module {fullname} has missing dependencies, wrapping: {e}")
                                    wrapped_spec = self._wrap_serialization_module(fullname)
                                    if wrapped_spec is not None:
                                        log_event("hook", logger.info, f"✓ [HOOK] Successfully wrapped: {fullname}")
                                        return wrapped_spec
                                    logger.warning(f"✗ [HOOK] Failed to wrap: {fullname}")
                                else:
                                    logger.debug(f"[HOOK] Import failed for nested module {fullname}: {e}")
                            except (ModuleNotFoundError,) as e:
                                logger.debug(f"[HOOK] Module {fullname} not found, skipping wrap: {e}")
                                pass
                            except Exception as e:
                                logger.warning(f"[HOOK] Error checking module {fullname}: {e}")
                        finally:
                            _mark_import_finished(fullname)
                    
                    return None
            
            # If we had matching prefixes but didn't match any, continue to lazy install logic
            if matching_prefixes:
                logger.debug(f"[HOOK] {fullname} had matching prefixes but didn't match any, continuing to lazy install")
        
        # For lazy installation, handle submodules by checking if parent package is installed
        if '.' in fullname:
            parent_package = fullname.split('.', 1)[0]
            if lazy_install_enabled:
                try:
                    installer = LazyInstallerRegistry.get_instance(self._package_name)
                    package_name = installer._dependency_mapper.get_package_name(parent_package)
                    if package_name and not installer.is_package_installed(package_name):
                        logger.debug(f"[HOOK] Parent package {parent_package} not installed, intercepting parent")
                        return self.find_spec(parent_package, path, target)
                except Exception:
                    pass
            return None
        if DependencyMapper._is_stdlib_or_builtin(fullname):
            return None
        if fullname in DependencyMapper.DENY_LIST:
            return None
        
        # ROOT CAUSE FIX: For lazy installation, intercept missing imports and install them
        logger.debug(f"[HOOK] Checking lazy install for {fullname}: enabled={lazy_install_enabled}, install_mode={install_mode}")
        if lazy_install_enabled:
            if _is_import_in_progress(fullname):
                return None
            
            _mark_import_started(fullname)
            try:
                # Guard against recursion when importing facade
                if 'exonware.xwlazy.facade' in sys.modules or 'xwlazy.facade' in sys.modules:
                    from ..facade import lazy_import_with_install
                else:
                    if _is_import_in_progress('exonware.xwlazy.facade') or _is_import_in_progress('xwlazy.facade'):
                        logger.debug(f"[HOOK] Facade import in progress, skipping {fullname} to prevent recursion")
                        return None
                    from ..facade import lazy_import_with_install
                
                _importing_state.active = True
                try:
                    module, success = lazy_import_with_install(
                        fullname,
                        installer_package=self._package_name
                    )
                finally:
                    _importing_state.active = False
                
                if success and module:
                    # Module was successfully installed and imported
                    xwlazy_finder_names = {'LazyMetaPathFinder', 'LazyPathFinder', 'LazyLoader'}
                    xwlazy_finders = [f for f in sys.meta_path if type(f).__name__ in xwlazy_finder_names]
                    for finder in xwlazy_finders:
                        try:
                            sys.meta_path.remove(finder)
                        except ValueError:
                            pass
                    
                    try:
                        if fullname in sys.modules:
                            del sys.modules[fullname]
                        importlib.invalidate_caches()
                        sys.path_importer_cache.clear()
                        real_module = importlib.import_module(fullname)
                        sys.modules[fullname] = real_module
                        logger.debug(f"[HOOK] Successfully installed {fullname}, replaced module in sys.modules with real module")
                    finally:
                        for finder in reversed(xwlazy_finders):
                            if finder not in sys.meta_path:
                                sys.meta_path.insert(0, finder)
                    return None
                else:
                    logger.debug(f"[HOOK] Failed to install/import {fullname}")
                    try:
                        installer = LazyInstallerRegistry.get_instance(self._package_name)
                        if installer.is_async_enabled():
                            placeholder = self._build_async_placeholder(fullname, installer)
                            if placeholder is not None:
                                return placeholder
                    except Exception:
                        pass
                    return None
            except Exception as e:
                logger.debug(f"Lazy import hook failed for {fullname}: {e}")
                return None
            finally:
                _mark_import_finished(fullname)
    
    def _wrap_serialization_module(self, fullname: str):
        """Wrap serialization module loading to defer missing dependencies."""
        log_event("hook", logger.info, f"[STAGE 1] Starting wrap of module: {fullname}")
        
        try:
            logger.debug(f"[STAGE 1] Getting spec for: {fullname}")
            try:
                sys.meta_path.remove(self)
            except ValueError:
                pass
            try:
                spec = importlib.util.find_spec(fullname)
            finally:
                if self not in sys.meta_path:
                    sys.meta_path.insert(0, self)
            if not spec or not spec.loader:
                logger.warning(f"[STAGE 1] No spec or loader for: {fullname}")
                return None
            
            logger.debug(f"[STAGE 1] Creating module from spec: {fullname}")
            module = importlib.util.module_from_spec(spec)
            
            deferred_imports = {}
            
            logger.debug(f"[STAGE 1] Setting up import wrapper for: {fullname}")
            original_import = builtins.__import__
            
            def capture_import_errors(name, *args, **kwargs):
                """Intercept imports and defer ONLY external missing packages."""
                logger.debug(f"[STAGE 1] capture_import_errors: Trying to import '{name}' in {fullname}")
                
                if _is_import_in_progress(name):
                    logger.debug(f"[STAGE 1] Import '{name}' already in progress, using original_import")
                    return original_import(name, *args, **kwargs)
                
                _mark_import_started(name)
                try:
                    result = original_import(name, *args, **kwargs)
                    logger.debug(f"[STAGE 1] ✓ Successfully imported '{name}'")
                    return result
                except ImportError as e:
                    logger.debug(f"[STAGE 1] ✗ Import failed for '{name}': {e}")
                    
                    host_alias = self._package_name or ""
                    if name.startswith('exonware.') or (host_alias and name.startswith(f"{host_alias}.")):
                        log_event("hook", logger.info, f"[STAGE 1] Letting internal import '{name}' fail normally (internal package)")
                        raise
                    
                    if '.' in name:
                        log_event("hook", logger.info, f"[STAGE 1] Letting submodule '{name}' fail normally (has dots)")
                        raise
                    
                    log_event("hook", logger.info, f"⏳ [STAGE 1] DEFERRING missing external package '{name}' in {fullname}")
                    async_handle = None
                    try:
                        installer = LazyInstallerRegistry.get_instance(self._package_name)
                        async_handle = installer.schedule_async_install(name)
                    except Exception as schedule_exc:
                        logger.debug(f"[STAGE 1] Async install scheduling failed for '{name}': {schedule_exc}")
                    deferred = DeferredImportError(name, e, self._package_name, async_handle=async_handle)
                    deferred_imports[name] = deferred
                    return deferred
                finally:
                    _mark_import_finished(name)
            
            logger.debug(f"[STAGE 1] Executing module with import wrapper: {fullname}")
            builtins.__import__ = capture_import_errors
            try:
                spec.loader.exec_module(module)
                logger.debug(f"[STAGE 1] Module execution completed: {fullname}")
                
                if deferred_imports:
                    log_event("hook", logger.info, f"✓ [STAGE 1] Module {fullname} loaded with {len(deferred_imports)} deferred imports: {list(deferred_imports.keys())}")
                    self._replace_none_with_deferred(module, deferred_imports)
                    self._wrap_module_classes(module, deferred_imports)
                else:
                    log_event("hook", logger.info, f"✓ [STAGE 1] Module {fullname} loaded with NO deferred imports (all dependencies available)")
                
                self._enhance_classes_with_class_methods(module)
                
            finally:
                logger.debug(f"[STAGE 1] Restoring original __import__")
                builtins.__import__ = original_import
            
            logger.debug(f"[STAGE 1] Registering module in sys.modules: {fullname}")
            sys.modules[fullname] = module
            final_spec = _spec_for_existing_module(fullname, module, spec)
            _spec_cache_put(fullname, final_spec)
            log_event("hook", logger.info, f"✓ [STAGE 1] Successfully wrapped and registered: {fullname}")
            return final_spec
            
        except Exception as e:
            logger.debug(f"Could not wrap {fullname}: {e}")
            return None
    
    def _replace_none_with_deferred(self, module, deferred_imports: Dict):
        """Replace None values in module namespace with deferred import proxies."""
        logger.debug(f"[STAGE 1] Replacing None with deferred imports in {module.__name__}")
        replaced_count = 0
        
        for dep_name, deferred_import in deferred_imports.items():
            if hasattr(module, dep_name):
                current_value = getattr(module, dep_name)
                if current_value is None:
                    log_event("hook", logger.info, f"[STAGE 1] Replacing {dep_name}=None with deferred import proxy in {module.__name__}")
                    setattr(module, dep_name, deferred_import)
                    replaced_count += 1
        
        if replaced_count > 0:
            log_event("hook", logger.info, f"✓ [STAGE 1] Replaced {replaced_count} None values with deferred imports in {module.__name__}")
    
    def _wrap_module_classes(self, module, deferred_imports: Dict):
        """Wrap classes in a module that depend on deferred imports."""
        module_name = getattr(module, '__name__', '<unknown>')
        logger.debug(f"[STAGE 1] Wrapping classes in {module_name} (deferred: {list(deferred_imports.keys())})")
        module_file = (getattr(module, '__file__', '') or '').lower()
        lower_map = {dep_name.lower(): dep_name for dep_name in deferred_imports.keys()}
        class_hints = _get_package_class_hints(self._package_name)
        with _wrapped_cache_lock:
            already_wrapped = _WRAPPED_CLASS_CACHE.setdefault(module_name, set()).copy()
        pending_lower = {lower for lower in lower_map.keys() if lower_map[lower] not in already_wrapped}
        if not pending_lower:
            logger.debug(f"[STAGE 1] All deferred imports already wrapped for {module_name}")
            return
        dep_entries = [(lower, deferred_imports[lower_map[lower]]) for lower in pending_lower]
        wrapped_count = 0
        newly_wrapped: Set[str] = set()
        
        for name, obj in list(module.__dict__.items()):
            if not pending_lower:
                break
            if not isinstance(obj, type):
                continue
            lower_name = name.lower()
            if class_hints and not any(hint in lower_name for hint in class_hints):
                continue
            target_lower = None
            target_deferred = None
            for dep_lower, deferred in dep_entries:
                if dep_lower not in pending_lower:
                    continue
                if dep_lower in lower_name or dep_lower in module_file:
                    target_lower = dep_lower
                    target_deferred = deferred
                    break
            if target_deferred is None or target_lower is None:
                continue
            
            logger.debug(f"[STAGE 1] Class '{name}' depends on deferred import, wrapping...")
            wrapped = self._create_lazy_class_wrapper(obj, target_deferred)
            module.__dict__[name] = wrapped
            wrapped_count += 1
            origin_name = lower_map.get(target_lower, target_lower)
            newly_wrapped.add(origin_name)
            pending_lower.discard(target_lower)
            log_event("hook", logger.info, f"✓ [STAGE 1] Wrapped class '{name}' in {module_name}")
        
        if newly_wrapped:
            with _wrapped_cache_lock:
                cache = _WRAPPED_CLASS_CACHE.setdefault(module_name, set())
                cache.update(newly_wrapped)
        
        log_event("hook", logger.info, f"[STAGE 1] Wrapped {wrapped_count} classes in {module_name}")
    
    def _enhance_classes_with_class_methods(self, module):
        """Enhance classes that registered lazy class methods."""
        if module is None:
            return
        
        methods_to_apply: Tuple[str, ...] = ()
        for prefix, methods in _lazy_prefix_method_registry.items():
            if module.__name__.startswith(prefix.rstrip('.')):
                methods_to_apply = methods
                break
        
        if not methods_to_apply:
            methods_to_apply = _DEFAULT_LAZY_METHODS
        
        if not methods_to_apply:
            return
        
        enhanced = 0
        for name, obj in list(module.__dict__.items()):
            if not isinstance(obj, type):
                continue
            for method_name in methods_to_apply:
                attr = obj.__dict__.get(method_name)
                if attr is None:
                    continue
                if getattr(attr, "__lazy_wrapped__", False):
                    continue
                if not callable(attr):
                    continue
                
                if isinstance(attr, (classmethod, staticmethod)):
                    continue
                
                import inspect
                try:
                    sig = inspect.signature(attr)
                    params = list(sig.parameters.keys())
                    if params and params[0] == 'self':
                        logger.debug(
                            "[LAZY ENHANCE] Wrapping instance method %s.%s.%s for class-level access",
                            module.__name__,
                            name,
                            method_name,
                        )
                except Exception:
                    pass
                
                try:
                    original_func = attr
                    
                    def class_method_wrapper(func):
                        def _class_call(cls, *args, **kwargs):
                            instance = cls()
                            return func(instance, *args, **kwargs)
                        _class_call.__name__ = getattr(func, '__name__', 'lazy_method')
                        _class_call.__doc__ = func.__doc__
                        _class_call.__lazy_wrapped__ = True
                        return _class_call
                    
                    setattr(
                        obj,
                        method_name,
                        classmethod(class_method_wrapper(original_func)),
                    )
                    enhanced += 1
                    logger.debug(
                        "[LAZY ENHANCE] Added class-level %s() to %s.%s",
                        method_name,
                        module.__name__,
                        name,
                    )
                except Exception as exc:
                    logger.debug(
                        "[LAZY ENHANCE] Skipped %s.%s.%s: %s",
                        module.__name__,
                        name,
                        method_name,
                        exc,
                    )
        
        if enhanced:
            log_event("enhance", logger.info, "✓ [LAZY ENHANCE] Added %s convenience methods in %s", enhanced, module.__name__)
    
    def _create_lazy_class_wrapper(self, original_class, deferred_import: DeferredImportError):
        """Create a wrapper class that installs dependencies when instantiated."""
        class LazyClassWrapper:
            """Lazy wrapper that installs dependencies on first instantiation."""
            
            def __init__(self, *args, **kwargs):
                """Install dependency and create real instance."""
                deferred_import._try_install_and_import()
                
                real_module = importlib.reload(sys.modules[original_class.__module__])
                real_class = getattr(real_module, original_class.__name__)
                
                real_instance = real_class(*args, **kwargs)
                self.__class__ = real_class
                self.__dict__ = real_instance.__dict__
            
            def __repr__(self):
                return f"<Lazy{original_class.__name__}: will install dependencies on init>"
        
        LazyClassWrapper.__name__ = f"Lazy{original_class.__name__}"
        LazyClassWrapper.__qualname__ = f"Lazy{original_class.__qualname__}"
        LazyClassWrapper.__module__ = original_class.__module__
        LazyClassWrapper.__doc__ = original_class.__doc__
        
        return LazyClassWrapper

# Registry of installed hooks per package
_installed_hooks: Dict[str, LazyMetaPathFinder] = {}
_hook_lock = threading.RLock()

def install_import_hook(package_name: str = 'default') -> None:
    """Install performant import hook for automatic lazy installation."""
    global _installed_hooks
    
    log_event("hook", logger.info, f"[HOOK INSTALL] Installing import hook for package: {package_name}")
    
    with _hook_lock:
        if package_name in _installed_hooks:
            log_event("hook", logger.info, f"[HOOK INSTALL] Import hook already installed for {package_name}")
            return
        
        logger.debug(f"[HOOK INSTALL] Creating LazyMetaPathFinder for {package_name}")
        hook = LazyMetaPathFinder(package_name)
        
        logger.debug(f"[HOOK INSTALL] Current sys.meta_path has {len(sys.meta_path)} entries")
        sys.meta_path.insert(0, hook)
        _installed_hooks[package_name] = hook
        
        log_event("hook", logger.info, f"✅ [HOOK INSTALL] Lazy import hook installed for {package_name} (now {len(sys.meta_path)} meta_path entries)")

def uninstall_import_hook(package_name: str = 'default') -> None:
    """Uninstall import hook for a package."""
    global _installed_hooks
    
    with _hook_lock:
        if package_name in _installed_hooks:
            hook = _installed_hooks[package_name]
            try:
                sys.meta_path.remove(hook)
            except ValueError:
                pass
            del _installed_hooks[package_name]
            log_event("hook", logger.info, f"Lazy import hook uninstalled for {package_name}")

def is_import_hook_installed(package_name: str = 'default') -> bool:
    """Check if import hook is installed for a package."""
    return package_name in _installed_hooks

def register_lazy_module_prefix(prefix: str) -> None:
    """Register an import prefix for lazy wrapping."""
    _watched_registry = get_watched_registry()
    _watched_registry.add(prefix)
    normalized = _normalize_prefix(prefix)
    if normalized:
        log_event("config", logger.info, "Registered lazy module prefix: %s", normalized)

# =============================================================================
# EXPORTS
# =============================================================================

__all__ = [
    # Logging utilities
    'get_logger',
    'log_event',
    'print_formatted',
    'format_message',
    'is_log_category_enabled',
    'set_log_category',
    'set_log_categories',
    'get_log_categories',
    'XWLazyFormatter',
    # Import tracking
    '_is_import_in_progress',
    '_mark_import_started',
    '_mark_import_finished',
    'get_importing_state',
    'get_installing_state',
    '_installation_depth',
    '_installation_depth_lock',
    # Prefix trie
    '_PrefixTrie',
    # Watched registry
    'WatchedPrefixRegistry',
    'get_watched_registry',
    # Deferred loader
    '_DeferredModuleLoader',
    # Cache utilities
    # Parallel utilities
    'ParallelLoader',
    'DependencyGraph',
    # Module patching
    '_lazy_aware_import_module',
    '_patch_import_module',
    '_unpatch_import_module',
    # Archive imports
    'get_archive_path',
    'ensure_archive_in_path',
    'import_from_archive',
    # Bootstrap
    'bootstrap_lazy_mode',
    'bootstrap_lazy_mode_deferred',
    # Lazy loader
    'LazyLoader',
    # Lazy module registry
    'LazyModuleRegistry',
    # Lazy importer
    'LazyImporter',
    # Import hook
    'LazyImportHook',
    # Meta path finder
    'LazyMetaPathFinder',
    'install_import_hook',
    'uninstall_import_hook',
    'is_import_hook_installed',
    'register_lazy_module_prefix',
    'register_lazy_module_methods',
    '_set_package_class_hints',
    '_get_package_class_hints',
    '_clear_all_package_class_hints',
    '_spec_for_existing_module',
]


"""
#exonware/xwlazy/src/exonware/xwlazy/lazy/lazy_core.py

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.1.0.13
Generation Date: 10-Oct-2025

Lazy Loading System - Core Implementation

This module consolidates all lazy loading functionality into a single implementation
following DEV_GUIDELINES.md structure. It provides per-package lazy loading with:
- Automatic dependency discovery
- Secure package installation
- Import hooks for two-stage loading
- Performance monitoring and caching
- SBOM generation and lockfile management

Design Patterns Applied:
- Facade: LazySystemFacade provides unified API
- Strategy: Pluggable discovery/installation strategies
- Template Method: Base classes define workflows
- Singleton: Global instances for system-wide state
- Registry: Per-package isolation
- Observer: Performance monitoring
- Proxy: Deferred loading

Core Goal: Per-Package Lazy Loading
- Each package (xwsystem, xwnode, xwdata) can independently enable lazy mode
- Only packages installed with [lazy] extra get auto-installation
- Logs missing imports per package
- Installs on first actual usage (two-stage loading)
"""

import os
import re
import json
import sys
import subprocess
import importlib
import importlib.abc
import importlib.machinery
import importlib.util
import builtins
import threading
import time
import shutil
import sysconfig
import tempfile
import zipfile
import inspect
from collections import Counter, OrderedDict, defaultdict
from contextlib import suppress
from functools import lru_cache
from concurrent.futures import Future, ThreadPoolExecutor
from datetime import datetime
from pathlib import Path
from typing import Dict, Iterable, List, Optional, Set, Tuple, Any, Callable
from types import ModuleType

from .lazy_contracts import DependencyInfo, LazyInstallMode
from .lazy_errors import (
    LazySystemError,
    LazyInstallError,
    LazyDiscoveryError,
    ExternallyManagedError,
    DeferredImportError,
)
from .lazy_base import (
    APackageDiscovery,
    APackageInstaller,
    AImportHook,
    ALazyLoader,
)
from .logging_utils import get_logger, log_event, print_formatted, format_message
from .manifest import PackageManifest, get_manifest_loader
from .lazy_state import LazyStateManager

try:
    _STDLIB_MODULE_SET: Set[str] = set(sys.stdlib_module_names)  # type: ignore[attr-defined]
except AttributeError:
    _STDLIB_MODULE_SET = set()
_STDLIB_MODULE_SET.update(sys.builtin_module_names)

logger = get_logger("xwlazy.lazy")


def _log(category: str, message: str, *args) -> None:
    log_event(category, logger.info, message, *args)


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


@lru_cache(maxsize=1024)
def _cached_stdlib_check(module_name: str) -> bool:
    try:
        spec = importlib.util.find_spec(module_name)
        if spec is None:
            return False
        if spec.origin in ("built-in", None):
            return True
        origin = spec.origin or ""
        return (
            "python" in origin.lower()
            and "site-packages" not in origin.lower()
            and "dist-packages" not in origin.lower()
        )
    except Exception:
        return False


# =============================================================================
# SECTION 1: PACKAGE DISCOVERY (~350 lines)
# =============================================================================

class DependencyMapper:
    """
    Maps import names to package names using dynamic discovery.
    Optimized with caching to avoid repeated file I/O.
    """
    
    __slots__ = (
        '_discovery',
        '_package_import_mapping',
        '_import_package_mapping',
        '_cached',
        '_lock',
        '_package_name',
        '_manifest_generation',
        '_manifest_dependencies',
        '_manifest_signature',
        '_manifest_empty',
    )
    
    def __init__(self, package_name: str = 'default'):
        """Initialize dependency mapper."""
        self._discovery = None  # Lazy init to avoid circular imports
        self._package_import_mapping = {}
        self._import_package_mapping = {}
        self._cached = False
        self._lock = threading.RLock()
        self._package_name = package_name
        self._manifest_generation = -1
        self._manifest_dependencies: Dict[str, str] = {}
        self._manifest_signature: Optional[Tuple[str, float, float]] = None
        self._manifest_empty = False

    def set_package_name(self, package_name: str) -> None:
        """Update the owning package name (affects manifest lookups)."""
        normalized = (package_name or 'default').strip().lower() or 'default'
        if normalized != self._package_name:
            self._package_name = normalized
            self._manifest_generation = -1
            self._manifest_dependencies = {}
    
    def _get_discovery(self):
        """Get discovery instance (lazy init)."""
        if self._discovery is None:
            self._discovery = get_lazy_discovery()
        return self._discovery
    
    def _ensure_mappings_cached(self) -> None:
        """Ensure mappings are cached (lazy initialization)."""
        if self._cached:
            return
        
        with self._lock:
            if self._cached:
                return
            
            discovery = self._get_discovery()
            self._package_import_mapping = discovery.get_package_import_mapping()
            self._import_package_mapping = discovery.get_import_package_mapping()
            self._cached = True
    
    def _ensure_manifest_cached(self, loader=None) -> None:
        if loader is None:
            loader = get_manifest_loader()
        signature = loader.get_manifest_signature(self._package_name)
        if signature == self._manifest_signature and (self._manifest_dependencies or self._manifest_empty):
            return
        
        shared = loader.get_shared_dependencies(self._package_name, signature)
        if shared is not None:
            self._manifest_generation = loader.generation
            self._manifest_signature = signature
            self._manifest_dependencies = shared
            self._manifest_empty = len(shared) == 0
            return

        manifest = loader.get_manifest(self._package_name)
        current_generation = loader.generation

        dependencies: Dict[str, str] = {}
        manifest_empty = True
        if manifest and manifest.dependencies:
            dependencies = {
                key.lower(): value
                for key, value in manifest.dependencies.items()
                if key and value
            }
            manifest_empty = False

        self._manifest_generation = current_generation
        self._manifest_signature = signature
        self._manifest_dependencies = dependencies
        self._manifest_empty = manifest_empty
    
    @staticmethod
    def _is_stdlib_or_builtin(module_name: str) -> bool:
        """Return True if the module is built-in or part of the stdlib."""
        root = module_name.split('.', 1)[0]
        needs_cache = False
        if module_name in _STDLIB_MODULE_SET or root in _STDLIB_MODULE_SET:
            return True
        if _cached_stdlib_check(module_name):
            needs_cache = True
        if needs_cache:
            _cache_spec_if_missing(module_name)
        return needs_cache

    DENY_LIST: Set[str] = {
        # POSIX-only modules that don't exist on Windows but try to auto-install
        "pwd",
        "grp",
        "spwd",
        "nis",
        "termios",
        "tty",
        "pty",
        "fcntl",
        # Windows-only internals
        "winreg",
        "winsound",
        "_winapi",
        "_dbm",
        # Internal optional modules that must never trigger auto-install
        "compression",
        "socks",
        "wimlib",
        # Optional dependencies with Python 2 compatibility shims (Python 3.8+ only)
        "inspect2",  # Python 2 compatibility shim, not needed on Python 3.8+
        "rich",      # Optional CLI enhancement for httpx, not required for core functionality
    }

    def _should_skip_auto_install(self, import_name: str) -> bool:
        """Determine whether an import should bypass lazy installation."""
        if self._is_stdlib_or_builtin(import_name):
            logger.debug("Skipping lazy install for stdlib module '%s'", import_name)
            return True

        if import_name in self.DENY_LIST:
            logger.debug("Skipping lazy install for denied module '%s'", import_name)
            return True

        return False

    def get_package_name(self, import_name: str) -> Optional[str]:
        """Get package name from import name."""
        if self._should_skip_auto_install(import_name):
            return None
        
        if _spec_cache_get(import_name):
            return None
        
        loader = get_manifest_loader()
        generation_changed = self._manifest_generation != loader.generation
        manifest_uninitialized = not self._manifest_dependencies and not self._manifest_empty
        if generation_changed or manifest_uninitialized:
            self._ensure_manifest_cached(loader)
        manifest_hit = self._manifest_dependencies.get(import_name.lower())
        if manifest_hit:
            return manifest_hit

        self._ensure_mappings_cached()
        return self._import_package_mapping.get(import_name, import_name)
    
    def get_import_names(self, package_name: str) -> List[str]:
        """Get all possible import names for a package."""
        self._ensure_mappings_cached()
        return self._package_import_mapping.get(package_name, [package_name])
    
    def get_package_import_mapping(self) -> Dict[str, List[str]]:
        """Get complete package to import names mapping."""
        self._ensure_mappings_cached()
        return self._package_import_mapping.copy()
    
    def get_import_package_mapping(self) -> Dict[str, str]:
        """Get complete import to package name mapping."""
        self._ensure_mappings_cached()
        return self._import_package_mapping.copy()


class LazyDiscovery(APackageDiscovery):
    """
    Discovers dependencies from project configuration sources.
    Implements caching with file modification time checks.
    """
    
    # System/built-in modules that should NEVER be auto-installed
    SYSTEM_MODULES_BLACKLIST = {
        'pwd', 'grp', 'spwd', 'crypt', 'nis', 'syslog', 'termios', 'tty', 'pty',
        'fcntl', 'resource', 'msvcrt', 'winreg', 'winsound', '_winapi',
        'rpython', 'rply', 'rnc2rng', '_dbm',
        'sys', 'os', 'io', 'time', 'datetime', 'json', 'csv', 'math',
        'random', 're', 'collections', 'itertools', 'functools', 'operator',
        'pathlib', 'shutil', 'glob', 'tempfile', 'pickle', 'copy', 'types',
        'typing', 'abc', 'enum', 'dataclasses', 'contextlib', 'warnings',
        'logging', 'threading', 'multiprocessing', 'subprocess', 'queue',
        'socket', 'select', 'signal', 'asyncio', 'concurrent', 'email',
        'http', 'urllib', 'xml', 'html', 'sqlite3', 'base64', 'hashlib',
        'hmac', 'secrets', 'ssl', 'binascii', 'struct', 'array', 'weakref',
        'gc', 'inspect', 'traceback', 'atexit', 'codecs', 'locale', 'gettext',
        'argparse', 'optparse', 'configparser', 'fileinput', 'stat', 'platform',
        'unittest', 'doctest', 'pdb', 'profile', 'cProfile', 'timeit', 'trace',
        # Internal / optional modules that must never trigger auto-install
        'compression', 'socks', 'wimlib',
    }
    
    # Common import name to package name mappings
    COMMON_MAPPINGS = {
        'cv2': 'opencv-python',
        'PIL': 'Pillow',
        'Pillow': 'Pillow',
        'yaml': 'PyYAML',
        'sklearn': 'scikit-learn',
        'bs4': 'beautifulsoup4',
        'dateutil': 'python-dateutil',
        'requests_oauthlib': 'requests-oauthlib',
        'google': 'google-api-python-client',
        'jwt': 'PyJWT',
        'crypto': 'pycrypto',
        'Crypto': 'pycrypto',
        'MySQLdb': 'mysqlclient',
        'psycopg2': 'psycopg2-binary',
        'bson': 'pymongo',
        'lxml': 'lxml',
        'numpy': 'numpy',
        'pandas': 'pandas',
        'matplotlib': 'matplotlib',
        'seaborn': 'seaborn',
        'plotly': 'plotly',
        'django': 'Django',
        'flask': 'Flask',
        'fastapi': 'fastapi',
        'uvicorn': 'uvicorn',
        'pytest': 'pytest',
        'black': 'black',
        'isort': 'isort',
        'mypy': 'mypy',
        'psutil': 'psutil',
        'colorama': 'colorama',
        'pytz': 'pytz',
        'aiofiles': 'aiofiles',
        'watchdog': 'watchdog',
        'wand': 'Wand',
        'exifread': 'ExifRead',
        'piexif': 'piexif',
        'rawpy': 'rawpy',
        'imageio': 'imageio',
        'scipy': 'scipy',
        'scikit-image': 'scikit-image',
        'opencv-python': 'opencv-python',
        'opencv-contrib-python': 'opencv-contrib-python',
        'opentelemetry': 'opentelemetry-api',
        'opentelemetry.trace': 'opentelemetry-api',
        'opentelemetry.sdk': 'opentelemetry-sdk',
    }
    
    def _discover_from_sources(self) -> None:
        """Discover dependencies from all sources."""
        self._discover_from_pyproject_toml()
        self._discover_from_requirements_txt()
        self._discover_from_setup_py()
        self._discover_from_custom_config()
    
    def _is_cache_valid(self) -> bool:
        """Check if cached dependencies are still valid."""
        if not self._cache_valid or not self._cached_dependencies:
            return False
        
        config_files = [
            self.project_root / 'pyproject.toml',
            self.project_root / 'requirements.txt',
            self.project_root / 'setup.py',
        ]
        
        for config_file in config_files:
            if config_file.exists():
                try:
                    current_mtime = config_file.stat().st_mtime
                    cached_mtime = self._file_mtimes.get(str(config_file), 0)
                    if current_mtime > cached_mtime:
                        return False
                except:
                    return False
        
        return True
    
    def _update_file_mtimes(self) -> None:
        """Update file modification times for cache validation."""
        config_files = [
            self.project_root / 'pyproject.toml',
            self.project_root / 'requirements.txt',
            self.project_root / 'setup.py',
        ]
        for config_file in config_files:
            if config_file.exists():
                try:
                    self._file_mtimes[str(config_file)] = config_file.stat().st_mtime
                except:
                    pass
    
    def _discover_from_pyproject_toml(self) -> None:
        """Discover dependencies from pyproject.toml."""
        pyproject_path = self.project_root / 'pyproject.toml'
        if not pyproject_path.exists():
            return
        
        try:
            try:
                import tomllib  # Python 3.11+
                toml_parser = tomllib  # type: ignore[assignment]
            except ImportError:
                try:
                    import tomli as tomllib  # type: ignore[assignment]
                    toml_parser = tomllib
                except ImportError:
                    _log(
                        "discovery",
                        "TOML parser not available; attempting to lazy-install 'tomli'...",
                    )
                    try:
                        subprocess.run(
                            [sys.executable, "-m", "pip", "install", "tomli"],
                            check=False,
                            capture_output=True,
                        )
                        import tomli as tomllib  # type: ignore[assignment]
                        toml_parser = tomllib
                    except Exception as install_exc:
                        logger.warning(
                            "tomli installation failed; skipping pyproject.toml discovery "
                            f"({install_exc})"
                        )
                        return

            with open(pyproject_path, 'rb') as f:
                data = toml_parser.load(f)
            
            dependencies = []
            if 'project' in data and 'dependencies' in data['project']:
                dependencies.extend(data['project']['dependencies'])
            
            if 'project' in data and 'optional-dependencies' in data['project']:
                for group_name, group_deps in data['project']['optional-dependencies'].items():
                    dependencies.extend(group_deps)
            
            if 'build-system' in data and 'requires' in data['build-system']:
                dependencies.extend(data['build-system']['requires'])
            
            for dep in dependencies:
                self._parse_dependency_string(dep, 'pyproject.toml')
            
            self._discovery_sources.append('pyproject.toml')
        except Exception as e:
            logger.warning(f"Could not parse pyproject.toml: {e}")
    
    def _discover_from_requirements_txt(self) -> None:
        """Discover dependencies from requirements.txt."""
        requirements_path = self.project_root / 'requirements.txt'
        if not requirements_path.exists():
            return
        
        try:
            with open(requirements_path, 'r', encoding='utf-8') as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith('#'):
                        self._parse_dependency_string(line, 'requirements.txt')
            
            self._discovery_sources.append('requirements.txt')
        except Exception as e:
            logger.warning(f"Could not parse requirements.txt: {e}")
    
    def _discover_from_setup_py(self) -> None:
        """Discover dependencies from setup.py."""
        setup_path = self.project_root / 'setup.py'
        if not setup_path.exists():
            return
        
        try:
            with open(setup_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            install_requires_match = re.search(
                r'install_requires\s*=\s*\[(.*?)\]', 
                content, 
                re.DOTALL
            )
            if install_requires_match:
                deps_str = install_requires_match.group(1)
                deps = re.findall(r'["\']([^"\']+)["\']', deps_str)
                for dep in deps:
                    self._parse_dependency_string(dep, 'setup.py')
            
            self._discovery_sources.append('setup.py')
        except Exception as e:
            logger.warning(f"Could not parse setup.py: {e}")
    
    def _discover_from_custom_config(self) -> None:
        """Discover dependencies from custom configuration files."""
        config_files = [
            'dependency-mappings.json',
            'lazy-dependencies.json',
            'dependencies.json'
        ]
        
        for config_file in config_files:
            config_path = self.project_root / config_file
            if config_path.exists():
                try:
                    with open(config_path, 'r', encoding='utf-8') as f:
                        data = json.load(f)
                    
                    if isinstance(data, dict):
                        for import_name, package_name in data.items():
                            self.discovered_dependencies[import_name] = DependencyInfo(
                                import_name=import_name,
                                package_name=package_name,
                                source=config_file,
                                category='custom'
                            )
                    
                    self._discovery_sources.append(config_file)
                except Exception as e:
                    logger.warning(f"Could not parse {config_file}: {e}")
    
    def _parse_dependency_string(self, dep_str: str, source: str) -> None:
        """Parse a dependency string and extract dependency information."""
        dep_str = re.sub(r'[>=<!=~]+.*', '', dep_str)
        dep_str = re.sub(r'\[.*\]', '', dep_str)
        dep_str = dep_str.strip()
        
        if not dep_str:
            return
        
        import_name = dep_str
        package_name = dep_str
        
        if dep_str in self.COMMON_MAPPINGS:
            package_name = self.COMMON_MAPPINGS[dep_str]
        elif dep_str in self.COMMON_MAPPINGS.values():
            for imp_name, pkg_name in self.COMMON_MAPPINGS.items():
                if pkg_name == dep_str:
                    import_name = imp_name
                    break
        
        self.discovered_dependencies[import_name] = DependencyInfo(
            import_name=import_name,
            package_name=package_name,
            source=source,
            category='discovered'
        )
    
    def _add_common_mappings(self) -> None:
        """Add common mappings that might not be in dependency files."""
        for import_name, package_name in self.COMMON_MAPPINGS.items():
            if import_name not in self.discovered_dependencies:
                self.discovered_dependencies[import_name] = DependencyInfo(
                    import_name=import_name,
                    package_name=package_name,
                    source='common_mappings',
                    category='common'
                )
    
    def get_package_for_import(self, import_name: str) -> Optional[str]:
        """Get package name for a given import name."""
        mapping = self.discover_all_dependencies()
        return mapping.get(import_name)
    
    def get_imports_for_package(self, package_name: str) -> List[str]:
        """Get all possible import names for a package."""
        mapping = self.get_package_import_mapping()
        return mapping.get(package_name, [package_name])
    
    def get_package_import_mapping(self) -> Dict[str, List[str]]:
        """Get mapping of package names to their possible import names."""
        self.discover_all_dependencies()
        
        package_to_imports = {}
        for import_name, dep_info in self.discovered_dependencies.items():
            package_name = dep_info.package_name
            
            if package_name not in package_to_imports:
                package_to_imports[package_name] = [package_name]
            
            if import_name != package_name:
                if import_name not in package_to_imports[package_name]:
                    package_to_imports[package_name].append(import_name)
        
        return package_to_imports
    
    def get_import_package_mapping(self) -> Dict[str, str]:
        """Get mapping of import names to package names."""
        self.discover_all_dependencies()
        return {import_name: dep_info.package_name for import_name, dep_info in self.discovered_dependencies.items()}
    
    def export_to_json(self, file_path: str) -> None:
        """Export discovered dependencies to JSON file."""
        data = {
            'dependencies': {name: info.package_name for name, info in self.discovered_dependencies.items()},
            'sources': self.get_discovery_sources(),
            'total_count': len(self.discovered_dependencies)
        }
        
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)


# Global discovery instance
_discovery = None
_discovery_lock = threading.RLock()

def get_lazy_discovery(project_root: Optional[str] = None) -> LazyDiscovery:
    """Get the global lazy discovery instance."""
    global _discovery
    if _discovery is None:
        with _discovery_lock:
            if _discovery is None:
                _discovery = LazyDiscovery(project_root)
    return _discovery


def discover_dependencies(project_root: Optional[str] = None) -> Dict[str, str]:
    """Discover all dependencies for the current project."""
    discovery = get_lazy_discovery(project_root)
    return discovery.discover_all_dependencies()


def export_dependency_mappings(file_path: str, project_root: Optional[str] = None) -> None:
    """Export discovered dependency mappings to a JSON file."""
    discovery = get_lazy_discovery(project_root)
    discovery.export_to_json(file_path)


# =============================================================================
# SECTION 2: PACKAGE INSTALLATION (~550 lines)
# =============================================================================

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


_ENV_ASYNC_INSTALL = os.environ.get("XWLAZY_ASYNC_INSTALL", "").strip().lower() in {"1", "true", "yes", "on"}
_ENV_ASYNC_WORKERS = int(os.environ.get("XWLAZY_ASYNC_WORKERS", "0") or 0)

_SPEC_CACHE_MAX = int(os.environ.get("XWLAZY_SPEC_CACHE_MAX", "512") or 512)
_SPEC_CACHE_TTL = float(os.environ.get("XWLAZY_SPEC_CACHE_TTL", "60") or 60.0)
_spec_cache_lock = threading.RLock()
_spec_cache: "OrderedDict[str, Tuple[importlib.machinery.ModuleSpec, float]]" = OrderedDict()

_DEFAULT_ASYNC_CACHE_DIR = Path(
    os.environ.get(
        "XWLAZY_ASYNC_CACHE_DIR",
        os.path.join(os.path.expanduser("~"), ".xwlazy", "wheel-cache"),
    )
)
_KNOWN_MISSING_CACHE_LIMIT = int(os.environ.get("XWLAZY_MISSING_CACHE_MAX", "128") or 128)
_KNOWN_MISSING_CACHE_TTL = float(os.environ.get("XWLAZY_MISSING_CACHE_TTL", "120") or 120.0)
_WRAPPED_CLASS_CACHE: Dict[str, Set[str]] = defaultdict(set)
_wrapped_cache_lock = threading.RLock()


class LazyInstaller(APackageInstaller):
    """
    Lazy installer that automatically installs missing packages on import failure.
    Each instance is isolated per package to prevent interference.
    """
    
    __slots__ = APackageInstaller.__slots__ + (
        '_dependency_mapper',
        '_auto_approve_all',
        '_async_enabled',
        '_async_workers',
        '_async_executor',
        '_async_pending',
        '_known_missing',
        '_async_cache_dir',
    )
    
    def __init__(self, package_name: str = 'default'):
        """Initialize lazy installer for a specific package."""
        super().__init__(package_name)
        self._dependency_mapper = DependencyMapper(package_name)
        self._auto_approve_all = False
        self._async_enabled = False
        self._async_workers = 1
        self._async_executor: Optional[ThreadPoolExecutor] = None
        self._async_pending: Dict[str, Future] = {}
        self._known_missing: "OrderedDict[str, float]" = OrderedDict()
        self._async_cache_dir = _DEFAULT_ASYNC_CACHE_DIR
    
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
        with self._lock:
            if package_name in self._installed_packages:
                return True
            
            if package_name in self._failed_packages:
                return False
            
            if self._mode == LazyInstallMode.DISABLED:
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
                # Get the module name used (e.g., 'bson' from 'pymongo')
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
                    time.sleep(0.1)  # Brief pause for visual effect
                    self._finalize_install_success(package_name, "cache-tree")
                    return True

                if self._install_from_cached_wheel(package_name, cache_args):
                    print_formatted("ACTION", f"Installing {package_name} via pip...", same_line=True)
                    wheel_path = self._cached_wheel_name(package_name)
                    self._materialize_cached_tree(package_name, wheel_path)
                    time.sleep(0.1)  # Brief pause for visual effect
                    self._finalize_install_success(package_name, "cache")
                    return True

                wheel_path = self._ensure_cached_wheel(package_name, cache_args)
                if wheel_path and self._pip_install_from_path(wheel_path, cache_args):
                    print_formatted("ACTION", f"Installing {package_name} via pip...", same_line=True)
                    self._materialize_cached_tree(package_name, wheel_path)
                    time.sleep(0.1)  # Brief pause for visual effect
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

    def _finalize_install_success(self, package_name: str, source: str) -> None:
        self._installed_packages.add(package_name)
        # Show final success message (this will replace all previous same-line messages)
        print_formatted("SUCCESS", f"Successfully installed via {source}: {package_name}", same_line=True)
        # Add newline after final message so cursor moves to next line
        print()
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
    
    def apply_manifest(self, manifest: Optional[PackageManifest]) -> None:
        """Apply manifest-driven configuration such as async installs."""
        env_override = _ENV_ASYNC_INSTALL
        desired_async = bool(env_override or (manifest and manifest.async_installs))
        desired_workers = _ENV_ASYNC_WORKERS or (manifest.async_workers if manifest else 1)
        desired_workers = max(1, desired_workers)
        
        with self._lock:
            if desired_workers != self._async_workers and self._async_executor:
                self._async_executor.shutdown(wait=False)
                self._async_executor = None
            self._async_workers = desired_workers
            
            if not desired_async and self._async_executor:
                self._async_executor.shutdown(wait=False)
                self._async_executor = None
                self._async_pending.clear()
            
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
            # temp_dir was moved; nothing to clean.
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
    
    def ensure_async_install(self, module_name: str) -> Optional["AsyncInstallHandle"]:
        """
        Schedule (or reuse) an async install job for module_name if async is enabled.
        """
        if not self._async_enabled:
            return None
        return self.schedule_async_install(module_name)
    
    def schedule_async_install(self, module_name: str) -> Optional["AsyncInstallHandle"]:
        """Schedule installation of a dependency in the background."""
        if not self._async_enabled:
            return None
        
        package_name = self._dependency_mapper.get_package_name(module_name) or module_name
        if not package_name:
            return None
        
        with self._lock:
            future = self._async_pending.get(module_name)
            if future is None:
                self._mark_module_missing(module_name)
                if self._async_executor is None:
                    self._async_executor = ThreadPoolExecutor(
                        max_workers=self._async_workers,
                        thread_name_prefix=f"xwlazy-{self._package_name}-install",
                    )
                def _run_install():
                    if self._install_from_cached_tree(package_name):
                        self._finalize_install_success(package_name, "cache-tree")
                        return True
                    return self.install_package(package_name, module_name)

                future = self._async_executor.submit(_run_install)
                self._async_pending[module_name] = future
                
                def _cleanup(_future: Future, name: str = module_name, pkg: str = package_name) -> None:
                    with self._lock:
                        self._async_pending.pop(name, None)
                        try:
                            result = bool(_future.result())
                        except Exception:
                            result = False
                        if result:
                            self._clear_module_missing(name)
                            try:
                                importlib.import_module(name)
                            except Exception:
                                pass
                
                future.add_done_callback(_cleanup)
        
        return AsyncInstallHandle(future, module_name, package_name, self._package_name)
    
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
    
    def is_package_installed(self, package_name: str) -> bool:
        """Check if a package is already installed."""
        return package_name in self._installed_packages
    
    def install_and_import(self, module_name: str, package_name: str = None) -> Tuple[Optional[ModuleType], bool]:
        """Install package and import module."""
        if not self.is_enabled():
            return None, False
        
        if package_name is None:
            package_name = self._dependency_mapper.get_package_name(module_name)
            if package_name is None:
                logger.debug(f"Module '{module_name}' is a system/built-in module, not installing")
                return None, False
        
        try:
            module = importlib.import_module(module_name)
            self._clear_module_missing(module_name)
            _spec_cache_put(module_name, importlib.util.find_spec(module_name))
            return module, True
        except ImportError:
            pass
        
        if self._async_enabled:
            handle = self.schedule_async_install(module_name)
            if handle is not None:
                return None, False
    
        if self.install_package(package_name, module_name):
            try:
                module = importlib.import_module(module_name)
                self._clear_module_missing(module_name)
                _spec_cache_put(module_name, importlib.util.find_spec(module_name))
                return module, True
            except ImportError as e:
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


class AsyncInstallHandle:
    """Lightweight handle for background installation jobs."""
    
    __slots__ = ("future", "module_name", "package_name", "installer_package")
    
    def __init__(
        self,
        future: Future,
        module_name: str,
        package_name: str,
        installer_package: str,
    ) -> None:
        self.future = future
        self.module_name = module_name
        self.package_name = package_name
        self.installer_package = installer_package
    
    def wait(self, timeout: Optional[float] = None) -> bool:
        try:
            result = self.future.result(timeout=timeout)
            return bool(result)
        except Exception:
            return False


class LazyInstallerRegistry:
    """Registry to manage separate lazy installer instances per package."""
    _instances: Dict[str, LazyInstaller] = {}
    _lock = threading.RLock()
    
    @classmethod
    def get_instance(cls, package_name: str = 'default') -> LazyInstaller:
        """Get or create a lazy installer instance for a package."""
        with cls._lock:
            if package_name not in cls._instances:
                cls._instances[package_name] = LazyInstaller(package_name)
            return cls._instances[package_name]
    
    @classmethod
    def get_all_instances(cls) -> Dict[str, LazyInstaller]:
        """Get all lazy installer instances."""
        with cls._lock:
            return cls._instances.copy()


def sync_manifest_configuration(package_name: str) -> Optional[PackageManifest]:
    """
    Load manifest data for a package and propagate configuration hooks.
    """
    loader = get_manifest_loader()
    manifest = loader.get_manifest(package_name)
    prefixes = manifest.watched_prefixes if manifest else ()
    _watched_registry.register_package(package_name, prefixes)
    if manifest:
        _set_package_class_hints(package_name, manifest.class_wrap_prefixes)
    else:
        _set_package_class_hints(package_name, ())
    
    installer = LazyInstallerRegistry.get_instance(package_name)
    installer.apply_manifest(manifest)
    return manifest


def refresh_lazy_manifests(package_name: Optional[str] = None) -> None:
    """
    Clear manifest caches and re-apply configuration for one or all packages.
    """
    loader = get_manifest_loader()
    loader.clear_cache()
    _spec_cache_clear()
    
    if package_name:
        _set_package_class_hints(package_name, ())
        sync_manifest_configuration(package_name)
        return
    
    _clear_all_package_class_hints()
    for pkg_name in LazyInstallerRegistry.get_all_instances().keys():
        sync_manifest_configuration(pkg_name)


# =============================================================================
# SECTION 3: IMPORT HOOKS & TWO-STAGE LOADING (~450 lines)
# =============================================================================

# Global import tracking cache - Prevents infinite loops
_import_in_progress: Dict[int, Set[str]] = defaultdict(set)
_import_cache_lock = threading.RLock()
_importing = threading.local()


def _normalize_prefix(prefix: str) -> str:
    prefix = prefix.strip()
    if not prefix:
        return ""
    if not prefix.endswith("."):
        prefix += "."
    return prefix


def _spec_cache_prune_locked(now: Optional[float] = None) -> None:
    if not _spec_cache:
        return
    current = now or time.monotonic()
    while _spec_cache:
        fullname, (_, ts) = next(iter(_spec_cache.items()))
        if current - ts <= _SPEC_CACHE_TTL and len(_spec_cache) <= _SPEC_CACHE_MAX:
            break
        _spec_cache.popitem(last=False)


def _spec_cache_get(fullname: str) -> Optional[importlib.machinery.ModuleSpec]:
    with _spec_cache_lock:
        _spec_cache_prune_locked()
        entry = _spec_cache.get(fullname)
        if entry is None:
            return None
        spec, _ = entry
        _spec_cache.move_to_end(fullname)
        return spec


def _spec_cache_put(fullname: str, spec: Optional[importlib.machinery.ModuleSpec]) -> None:
    if spec is None:
        return
    with _spec_cache_lock:
        _spec_cache[fullname] = (spec, time.monotonic())
        _spec_cache.move_to_end(fullname)
        _spec_cache_prune_locked()


def _spec_cache_clear(fullname: Optional[str] = None) -> None:
    with _spec_cache_lock:
        if fullname is None:
            _spec_cache.clear()
        else:
            _spec_cache.pop(fullname, None)


def _cache_spec_if_missing(fullname: str) -> None:
    """Ensure a ModuleSpec is cached for a known-good module."""
    if _spec_cache_get(fullname):
        return
    try:
        spec = importlib.util.find_spec(fullname)
    except Exception:
        spec = None
    if spec is not None:
        _spec_cache_put(fullname, spec)


class _DeferredModuleLoader(importlib.abc.Loader):
    """Loader that simply returns a preconstructed module placeholder."""

    def __init__(self, module: ModuleType) -> None:
        self._module = module

    def create_module(self, spec):  # noqa: D401 - standard loader hook
        return self._module

    def exec_module(self, module):  # noqa: D401 - nothing to execute
        return None


class _PrefixTrie:
    __slots__ = ("_root",)

    def __init__(self) -> None:
        self._root: Dict[str, Dict[str, Any]] = {}

    def add(self, prefix: str) -> None:
        node = self._root
        for char in prefix:
            node = node.setdefault(char, {})
        node["_end"] = prefix

    def iter_matches(self, value: str) -> Tuple[str, ...]:
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


class WatchedPrefixRegistry:
    """
    Maintain watched prefixes and provide fast trie-based membership checks.
    """

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

_DEFAULT_LAZY_METHODS = tuple(
    filter(
        None,
        os.environ.get("XWLAZY_LAZY_METHODS", "").split(","),
    )
)


def register_lazy_module_prefix(prefix: str) -> None:
    """Register an import prefix for lazy wrapping."""
    _watched_registry.add(prefix)
    normalized = _normalize_prefix(prefix)
    if normalized:
        _log("config", "Registered lazy module prefix: %s", normalized)


_lazy_prefix_method_registry: Dict[str, Tuple[str, ...]] = {}

_package_class_hints: Dict[str, Tuple[str, ...]] = {}
_class_hint_lock = threading.RLock()


def _set_package_class_hints(package_name: str, hints: Iterable[str]) -> None:
    normalized: Tuple[str, ...] = tuple(
        OrderedDict((hint.lower(), None) for hint in hints if hint).keys()  # type: ignore[arg-type]
    )
    with _class_hint_lock:
        if normalized:
            _package_class_hints[package_name] = normalized
        else:
            _package_class_hints.pop(package_name, None)


def _get_package_class_hints(package_name: str) -> Tuple[str, ...]:
    with _class_hint_lock:
        return _package_class_hints.get(package_name, ())


def _clear_all_package_class_hints() -> None:
    with _class_hint_lock:
        _package_class_hints.clear()


def register_lazy_module_methods(prefix: str, methods: Tuple[str, ...]) -> None:
    """Register method names to enhance for all classes under a module prefix."""
    prefix = prefix.strip()
    if not prefix:
        return
    
    if not prefix.endswith("."):
        prefix += "."
    
    normalized_methods = tuple(m for m in methods if m)
    if not normalized_methods:
        return
    
    _lazy_prefix_method_registry[prefix] = normalized_methods

    # Retroactively enhance modules that were imported before this registration.
    target_prefix = prefix.rstrip(".")
    finder = LazyMetaPathFinder()
    for name, module in list(sys.modules.items()):
        if not isinstance(module, ModuleType):
            continue
        if not name.startswith(target_prefix):
            continue
        finder._enhance_classes_with_class_methods(module)


def _is_import_in_progress(module_name: str) -> bool:
    """Check if a module import is currently in progress for this thread."""
    thread_id = threading.get_ident()
    with _import_cache_lock:
        return module_name in _import_in_progress.get(thread_id, set())

def _mark_import_started(module_name: str) -> None:
    """Mark a module import as started for this thread."""
    thread_id = threading.get_ident()
    with _import_cache_lock:
        _import_in_progress[thread_id].add(module_name)

def _mark_import_finished(module_name: str) -> None:
    """Mark a module import as finished for this thread."""
    thread_id = threading.get_ident()
    with _import_cache_lock:
        stack = _import_in_progress.get(thread_id)
        if not stack:
            return
        stack.discard(module_name)
        if not stack:
            _import_in_progress.pop(thread_id, None)


class LazyImportHook(AImportHook):
    """
    Import hook that intercepts ImportError and auto-installs packages.
    Performance optimized with zero overhead for successful imports.
    """
    
    __slots__ = AImportHook.__slots__
    
    def handle_import_error(self, module_name: str) -> Optional[Any]:
        """Handle ImportError by attempting to install and re-import."""
        if not self._enabled:
            return None
        
        try:
            module, success = lazy_import_with_install(
                module_name, 
                installer_package=self._package_name
            )
            return module if success else None
        except:
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
            spec_obj = getattr(real_module, "__spec__", None) or importlib.util.find_spec(fullname)
            if spec_obj is not None:
                _spec_cache_put(fullname, spec_obj)
            return real_module

        def _module_getattr(name):
            real = _resolve_real_module()
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
        _log("hook", f"⏳ [HOOK] Deferred import placeholder created for '{fullname}'")
        return spec
    

def _spec_for_existing_module(
    fullname: str,
    module: ModuleType,
    original_spec: Optional[importlib.machinery.ModuleSpec] = None,
) -> importlib.machinery.ModuleSpec:
    """
    Build a ModuleSpec whose loader simply returns an already-initialized module.

    Used to hand control back to importlib without re-executing third-party code.
    """
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
            spec_obj = getattr(real_module, "__spec__", None) or importlib.util.find_spec(fullname)
            if spec_obj is not None:
                _spec_cache_put(fullname, spec_obj)
            return real_module

        def _module_getattr(name):
            real = _resolve_real_module()
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
        _log("hook", f"⏳ [HOOK] Deferred import placeholder created for '{fullname}'")
        return spec
    
    def find_module(self, fullname: str, path: Optional[str] = None):
        """Find module - returns None to let standard import continue."""
        return None
    
    def find_spec(self, fullname: str, path: Optional[str] = None, target=None):
        """Find module spec - intercepts imports to enable two-stage lazy loading."""
        if not self._enabled:
            return None
        
        # CRITICAL: Bail out immediately for stdlib/builtin and importlib internals
        # to avoid interfering with importlib.resources (Microsoft Store Python bug)
        if fullname.startswith('importlib') or fullname.startswith('_frozen_importlib'):
            return None
        
        if '.' not in fullname:
            if DependencyMapper._is_stdlib_or_builtin(fullname):
                return None
            if fullname in DependencyMapper.DENY_LIST:
                return None
        
        if _is_import_in_progress(fullname):
            logger.debug(f"[RECURSION GUARD] Import '{fullname}' already in progress, skipping hook")
            return None
        
        if getattr(_importing, 'active', False):
            logger.debug(f"[RECURSION GUARD] Lazy wrapping suspended while importing '{fullname}'")
            return None
        
        cached_spec = _spec_cache_get(fullname)
        if cached_spec is not None:
            return cached_spec
        
        lazy_enabled = is_lazy_install_enabled(self._package_name)
        if not lazy_enabled and _watched_registry.is_empty():
            return None
        
        root_name = fullname.split('.', 1)[0]
        matching_prefixes: Tuple[str, ...] = ()
        if _watched_registry.has_root(root_name):
            matching_prefixes = _watched_registry.get_matching_prefixes(fullname)
        installer = LazyInstallerRegistry.get_instance(self._package_name)
        
        # Two-stage lazy loading for serialization and archive modules
        # Host packages register prefixes to monitor (serialization modules, archives, etc.)
        # Priority impact: Usability (#2) - Missing dependencies not auto-installed
        for prefix in matching_prefixes:
            if not _watched_registry.is_prefix_owned_by(self._package_name, prefix):
                continue
            if fullname.startswith(prefix):
                module_suffix = fullname[len(prefix):]
                
                if module_suffix:
                    _log("hook", f"[HOOK] Candidate for wrapping: {fullname}")
                    
                    _mark_import_started(fullname)
                    try:
                        if getattr(_importing, 'active', False):
                            logger.debug(f"[HOOK] Recursion guard active, skipping {fullname}")
                            return None
                        
                        try:
                            logger.debug(f"[HOOK] Looking for spec: {fullname}")
                            spec = _spec_cache_get(fullname)
                            if spec is None:
                                # Temporarily remove hook to avoid interfering with nested imports
                                try:
                                    sys.meta_path.remove(self)
                                except ValueError:
                                    pass
                                try:
                                    spec = importlib.util.find_spec(fullname)
                                finally:
                                    # Restore hook
                                    if self not in sys.meta_path:
                                        sys.meta_path.insert(0, self)
                                if spec is not None:
                                    _spec_cache_put(fullname, spec)
                            if spec is not None:
                                logger.debug(f"[HOOK] Spec found, trying normal import: {fullname}")
                                _importing.active = True
                                try:
                                    # Temporarily remove hook during __import__ to avoid interfering with nested imports
                                    try:
                                        sys.meta_path.remove(self)
                                    except ValueError:
                                        pass
                                    try:
                                        __import__(fullname)
                                    finally:
                                        if self not in sys.meta_path:
                                            sys.meta_path.insert(0, self)
                                    
                                    module = sys.modules.get(fullname)
                                    if module:
                                        try:
                                            self._enhance_classes_with_class_methods(module)
                                        except Exception as enhance_exc:
                                            logger.debug(f"[HOOK] Could not enhance classes in {fullname}: {enhance_exc}")
                                        spec = _spec_for_existing_module(fullname, module, spec)
                                    _log("hook", f"✓ [HOOK] Module {fullname} imported successfully, no wrapping needed")
                                    if spec is not None:
                                        _spec_cache_put(fullname, spec)
                                        return spec
                                    return None
                                finally:
                                    _importing.active = False
                        except ImportError as e:
                            if '.' not in module_suffix:
                                _log("hook", f"⚠ [HOOK] Module {fullname} has missing dependencies, wrapping: {e}")
                                wrapped_spec = self._wrap_serialization_module(fullname)
                                if wrapped_spec is not None:
                                    _log("hook", f"✓ [HOOK] Successfully wrapped: {fullname}")
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
        
        # Only handle top-level packages
        if '.' in fullname:
            return None
        if DependencyMapper._is_stdlib_or_builtin(fullname):
            return None
        if fullname in DependencyMapper.DENY_LIST:
            return None
        
        _mark_import_started(fullname)
        try:
            try:
                if not lazy_enabled:
                    return None
                
                module, success = lazy_import_with_install(
                    fullname,
                    installer_package=self._package_name
                )
                
                if success and module:
                    spec = getattr(module, "__spec__", None)
                    if spec is None:
                        try:
                            sys.meta_path.remove(self)
                        except ValueError:
                            pass
                        try:
                            spec = importlib.util.find_spec(fullname)
                        finally:
                            if self not in sys.meta_path:
                                sys.meta_path.insert(0, self)
                    if spec is not None and spec.loader:
                        module.__spec__ = spec
                        module.__loader__ = spec.loader
                        _spec_cache_put(fullname, spec)
                        return spec
                    return None
                if not success and installer.is_async_enabled():
                    placeholder = self._build_async_placeholder(fullname, installer)
                    if placeholder is not None:
                        return placeholder
                
            except Exception as e:
                logger.debug(f"Lazy import hook failed for {fullname}: {e}")
            
            return None
        finally:
            _mark_import_finished(fullname)
    
    def _wrap_serialization_module(self, fullname: str):
        """Wrap serialization module loading to defer missing dependencies."""
        _log("hook", f"[STAGE 1] Starting wrap of module: {fullname}")
        
        try:
            logger.debug(f"[STAGE 1] Getting spec for: {fullname}")
            # Temporarily remove hook to avoid interfering with nested imports
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
                        _log("hook", f"[STAGE 1] Letting internal import '{name}' fail normally (internal package)")
                        raise
                    
                    if '.' in name:
                        _log("hook", f"[STAGE 1] Letting submodule '{name}' fail normally (has dots)")
                        raise
                    
                    _log("hook", f"⏳ [STAGE 1] DEFERRING missing external package '{name}' in {fullname}")
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
                    _log("hook", f"✓ [STAGE 1] Module {fullname} loaded with {len(deferred_imports)} deferred imports: {list(deferred_imports.keys())}")
                    # Replace None values with deferred import proxies (for modules that catch ImportError and set to None)
                    self._replace_none_with_deferred(module, deferred_imports)
                    self._wrap_module_classes(module, deferred_imports)
                else:
                    _log("hook", f"✓ [STAGE 1] Module {fullname} loaded with NO deferred imports (all dependencies available)")
                
                # Always enhance serializers with class-level convenience methods
                self._enhance_classes_with_class_methods(module)
                
            finally:
                logger.debug(f"[STAGE 1] Restoring original __import__")
                builtins.__import__ = original_import
            
            logger.debug(f"[STAGE 1] Registering module in sys.modules: {fullname}")
            sys.modules[fullname] = module
            final_spec = _spec_for_existing_module(fullname, module, spec)
            _spec_cache_put(fullname, final_spec)
            _log("hook", f"✓ [STAGE 1] Successfully wrapped and registered: {fullname}")
            return final_spec
            
        except Exception as e:
            logger.debug(f"Could not wrap {fullname}: {e}")
            return None
    
    def _replace_none_with_deferred(self, module, deferred_imports: Dict):
        """
        Replace None values in module namespace with deferred import proxies.
        
        Some modules catch ImportError and set the variable to None (e.g., yaml = None).
        This method replaces those None values with DeferredImportError proxies so the
        hook can install missing packages when the variable is accessed.
        """
        logger.debug(f"[STAGE 1] Replacing None with deferred imports in {module.__name__}")
        replaced_count = 0
        
        for dep_name, deferred_import in deferred_imports.items():
            # Check if module has this variable set to None
            if hasattr(module, dep_name):
                current_value = getattr(module, dep_name)
                if current_value is None:
                    _log("hook", f"[STAGE 1] Replacing {dep_name}=None with deferred import proxy in {module.__name__}")
                    setattr(module, dep_name, deferred_import)
                    replaced_count += 1
        
        if replaced_count > 0:
            _log("hook", f"✓ [STAGE 1] Replaced {replaced_count} None values with deferred imports in {module.__name__}")
    
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
            _log("hook", f"✓ [STAGE 1] Wrapped class '{name}' in {module_name}")
        
        if newly_wrapped:
            with _wrapped_cache_lock:
                cache = _WRAPPED_CLASS_CACHE.setdefault(module_name, set())
                cache.update(newly_wrapped)
        
        _log("hook", f"[STAGE 1] Wrapped {wrapped_count} classes in {module_name}")
    
    def _enhance_classes_with_class_methods(self, module):
        """
        Enhance classes that registered lazy class methods.
        
        Root cause: Original implementation wrapped instance methods as classmethods,
        breaking normal usage (e.g., serializer.encode(data) failed with missing 'value').
        
        Fix: Only wrap if method is NOT already an instance method. Instance methods
        should remain as-is; we only add classmethod wrappers for static/class methods.
        
        Priority: Usability (#2) - Preserve normal API usage patterns
        """
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
                
                # Skip if already a classmethod or staticmethod descriptor
                if isinstance(attr, (classmethod, staticmethod)):
                    continue
                
                # Wrap instance methods to auto-instantiate when called class-level
                # Root cause: json_run.py uses BsonSerializer.encode(data) without instantiation
                # Solution: Wrapper auto-instantiates and delegates to instance method
                # Priority: Usability (#2) - Enable convenient class-level API
                import inspect
                try:
                    sig = inspect.signature(attr)
                    params = list(sig.parameters.keys())
                    # Instance methods (first param is 'self') get wrapped for class-level convenience
                    if params and params[0] == 'self':
                        logger.debug(
                            "[LAZY ENHANCE] Wrapping instance method %s.%s.%s for class-level access",
                            module.__name__,
                            name,
                            method_name,
                        )
                except Exception:
                    # If we can't inspect, try wrapping anyway
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
            _log("enhance", "✓ [LAZY ENHANCE] Added %s convenience methods in %s", enhanced, module.__name__)
    
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
    
    _log("hook", f"[HOOK INSTALL] Installing import hook for package: {package_name}")
    
    with _hook_lock:
        if package_name in _installed_hooks:
            _log("hook", f"[HOOK INSTALL] Import hook already installed for {package_name}")
            return
        
        logger.debug(f"[HOOK INSTALL] Creating LazyMetaPathFinder for {package_name}")
        hook = LazyMetaPathFinder(package_name)
        
        logger.debug(f"[HOOK INSTALL] Current sys.meta_path has {len(sys.meta_path)} entries")
        sys.meta_path.insert(0, hook)
        _installed_hooks[package_name] = hook
        
        _log("hook", f"✅ [HOOK INSTALL] Lazy import hook installed for {package_name} (now {len(sys.meta_path)} meta_path entries)")


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
            _log("hook", f"Lazy import hook uninstalled for {package_name}")


def is_import_hook_installed(package_name: str = 'default') -> bool:
    """Check if import hook is installed for a package."""
    return package_name in _installed_hooks


# =============================================================================
# SECTION 4: LAZY LOADING & CACHING (~300 lines)
# =============================================================================

class LazyLoader(ALazyLoader):
    """
    Thread-safe lazy loader for modules with caching.
    Implements Proxy pattern for deferred module loading.
    """
    
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


class LazyImporter:
    """
    Lazy importer that defers heavy module imports until first access.
    """
    
    __slots__ = ('_enabled', '_lazy_modules', '_loaded_modules', '_lock', '_access_counts')
    
    def __init__(self):
        """Initialize lazy importer."""
        self._enabled = False
        self._lazy_modules: Dict[str, str] = {}
        self._loaded_modules: Dict[str, ModuleType] = {}
        self._access_counts: Dict[str, int] = {}
        self._lock = threading.RLock()
    
    def enable(self) -> None:
        """Enable lazy imports."""
        with self._lock:
            self._enabled = True
            _log("config", "Lazy imports enabled")
    
    def disable(self) -> None:
        """Disable lazy imports."""
        with self._lock:
            self._enabled = False
            _log("config", "Lazy imports disabled")
    
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
    
    def import_module(self, module_name: str, package_name: str = None) -> Any:
        """Import a module with lazy loading."""
        with self._lock:
            if not self._enabled:
                return importlib.import_module(module_name)
            
            if module_name in self._loaded_modules:
                self._access_counts[module_name] += 1
                return self._loaded_modules[module_name]
            
            if module_name in self._lazy_modules:
                module_path = self._lazy_modules[module_name]
                
                try:
                    actual_module = importlib.import_module(module_path)
                    self._loaded_modules[module_name] = actual_module
                    self._access_counts[module_name] += 1
                    
                    logger.debug(f"Lazy loaded module: {module_name}")
                    return actual_module
                    
                except ImportError as e:
                    logger.error(f"Failed to lazy load {module_name}: {e}")
                    raise
            else:
                return importlib.import_module(module_name)
    
    def preload_module(self, module_name: str) -> bool:
        """Preload a registered lazy module."""
        with self._lock:
            if module_name not in self._lazy_modules:
                logger.warning(f"Module {module_name} not registered for lazy loading")
                return False
            
            try:
                self.import_module(module_name)
                _log("hook", f"Preloaded module: {module_name}")
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


class LazyModuleRegistry:
    """
    Registry for managing lazy-loaded modules with performance tracking.
    """
    
    __slots__ = ('_modules', '_load_times', '_lock', '_access_counts')
    
    def __init__(self):
        """Initialize the registry."""
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
                        _ = self._modules[name].load_module()
                        _log("hook", f"Preloaded frequently used module: {name}")
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
            _log("config", "Cleared all cached modules")


class LazyPerformanceMonitor:
    """Performance monitor for lazy loading operations."""
    
    __slots__ = ('_load_times', '_access_counts', '_memory_usage')
    
    def __init__(self):
        """Initialize performance monitor."""
        self._load_times = {}
        self._access_counts = {}
        self._memory_usage = {}
    
    def record_load_time(self, module: str, load_time: float) -> None:
        """Record module load time."""
        self._load_times[module] = load_time
    
    def record_access(self, module: str) -> None:
        """Record module access."""
        self._access_counts[module] = self._access_counts.get(module, 0) + 1
    
    def get_stats(self) -> Dict[str, Any]:
        """Get performance statistics."""
        return {
            'load_times': self._load_times.copy(),
            'access_counts': self._access_counts.copy(),
            'memory_usage': self._memory_usage.copy()
        }


# Global instances
_lazy_importer = LazyImporter()
_global_registry = LazyModuleRegistry()


_lazy_importer = LazyImporter()
_global_registry = LazyModuleRegistry()


def enable_lazy_imports() -> None:
    """Enable lazy imports (loader only)."""
    _lazy_importer.enable()


def disable_lazy_imports() -> None:
    """Disable lazy imports (loader only)."""
    _lazy_importer.disable()


def is_lazy_import_enabled() -> bool:
    """Check if lazy imports are enabled."""
    return _lazy_importer.is_enabled()


def lazy_import(module_name: str, package_name: str = None) -> Any:
    """Import a module with lazy loading."""
    return _lazy_importer.import_module(module_name, package_name)


def register_lazy_module(module_name: str, module_path: str = None) -> None:
    """Register a module for lazy loading."""
    _lazy_importer.register_lazy_module(module_name, module_path)
    _global_registry.register_module(module_name, module_path or module_name)


def preload_module(module_name: str) -> bool:
    """Preload a registered lazy module."""
    return _lazy_importer.preload_module(module_name)


def get_lazy_module(name: str) -> LazyLoader:
    """Get a lazy-loaded module from the global registry."""
    return _global_registry.get_module(name)


def get_loading_stats() -> Dict[str, Any]:
    """Get loading statistics from the global registry."""
    return _global_registry.get_stats()


def preload_frequently_used(threshold: int = 5) -> None:
    """Preload frequently used modules from the global registry."""
    _global_registry.preload_frequently_used(threshold)


def get_lazy_import_stats() -> Dict[str, Any]:
    """Get lazy import statistics."""
    return _lazy_importer.get_stats()


# =============================================================================
# SECTION 5: CONFIGURATION & REGISTRY (~200 lines)
# =============================================================================

# Performance optimization: Cache detection results per package
_lazy_detection_cache: Dict[str, bool] = {}
_lazy_detection_lock = threading.RLock()

# Keyword-based detection configuration
_KEYWORD_DETECTION_ENABLED: bool = True
_KEYWORD_TO_CHECK: str = "xwlazy-enabled"

# Performance optimization: Module-level constant for mode enum conversion
_MODE_ENUM_MAP = {
    "auto": LazyInstallMode.AUTO,
    "interactive": LazyInstallMode.INTERACTIVE,
    "warn": LazyInstallMode.WARN,
    "disabled": LazyInstallMode.DISABLED,
    "dry_run": LazyInstallMode.DRY_RUN,
}


def _lazy_env_override(package_name: str) -> Optional[bool]:
    env_var = f"{package_name.upper()}_LAZY_INSTALL"
    raw_value = os.environ.get(env_var)
    if raw_value is None:
        return None

    normalized = raw_value.strip().lower()
    if normalized in ("true", "1", "yes", "on"):
        return True
    if normalized in ("false", "0", "no", "off"):
        return False
    return None


def _lazy_marker_installed() -> bool:
    if sys.version_info < (3, 8):
        return False

    try:
        from importlib import metadata
    except Exception as exc:
        logger.debug(f"importlib.metadata unavailable for lazy detection: {exc}")
        return False

    try:
        metadata.distribution("exonware-xwlazy")
        _log("config", "✅ Detected exonware-xwlazy marker package")
        return True
    except metadata.PackageNotFoundError:
        _log("config", "❌ exonware-xwlazy marker package not installed")
        return False
    except Exception as exc:
        logger.debug(f"Failed to inspect marker package: {exc}")
        return False


def _check_package_keywords(package_name: Optional[str] = None, keyword: Optional[str] = None) -> bool:
    """
    Check if any installed package has the specified keyword in its metadata.
    
    This allows packages to opt-in to lazy loading by adding:
    [project]
    keywords = ["xwlazy-enabled"]
    
    in their pyproject.toml file. The keyword is stored in the package's
    metadata when installed.
    
    Args:
        package_name: The package name to check (or None to check all packages)
        keyword: The keyword to look for (default: uses _KEYWORD_TO_CHECK)
    
    Returns:
        True if the keyword is found in any relevant package's metadata
    """
    if not _KEYWORD_DETECTION_ENABLED:
        return False
    
    if sys.version_info < (3, 8):
        return False
    
    try:
        from importlib import metadata
    except Exception as exc:
        logger.debug(f"importlib.metadata unavailable for keyword detection: {exc}")
        return False
    
    search_keyword = (keyword or _KEYWORD_TO_CHECK).lower()
    
    try:
        if package_name:
            # Check specific package
            try:
                dist = metadata.distribution(package_name)
                keywords = dist.metadata.get_all('Keywords', [])
                if keywords:
                    # Keywords can be a single string or list
                    all_keywords = []
                    for kw in keywords:
                        if isinstance(kw, str):
                            # Split comma-separated keywords
                            all_keywords.extend(k.strip().lower() for k in kw.split(','))
                        else:
                            all_keywords.append(str(kw).lower())
                    
                    if search_keyword in all_keywords:
                        _log("config", f"✅ Detected '{search_keyword}' keyword in package: {package_name}")
                        return True
            except metadata.PackageNotFoundError:
                return False
        else:
            # Check all installed packages
            for dist in metadata.distributions():
                try:
                    keywords = dist.metadata.get_all('Keywords', [])
                    if keywords:
                        all_keywords = []
                        for kw in keywords:
                            if isinstance(kw, str):
                                all_keywords.extend(k.strip().lower() for k in kw.split(','))
                            else:
                                all_keywords.append(str(kw).lower())
                        
                        if search_keyword in all_keywords:
                            package_found = dist.metadata.get('Name', 'unknown')
                            _log("config", f"✅ Detected '{search_keyword}' keyword in package: {package_found}")
                            return True
                except Exception:
                    continue
    except Exception as exc:
        logger.debug(f"Failed to check package keywords: {exc}")
    
    return False


def _detect_lazy_installation(package_name: str) -> bool:
    with _lazy_detection_lock:
        cached = _lazy_detection_cache.get(package_name)
        if cached is not None:
            return cached

    env_override = _lazy_env_override(package_name)
    if env_override is not None:
        with _lazy_detection_lock:
            _lazy_detection_cache[package_name] = env_override
        return env_override

    state_manager = LazyStateManager(package_name)
    manual_state = state_manager.get_manual_state()
    if manual_state is not None:
        with _lazy_detection_lock:
            _lazy_detection_cache[package_name] = manual_state
        return manual_state

    cached_state = state_manager.get_cached_auto_state()
    if cached_state is not None:
        with _lazy_detection_lock:
            _lazy_detection_cache[package_name] = cached_state
        return cached_state

    # Check marker package first (existing behavior)
    marker_detected = _lazy_marker_installed()
    
    # Also check for keyword in package metadata (new feature)
    keyword_detected = _check_package_keywords(package_name)
    
    # Enable if either marker package OR keyword is found
    detected = marker_detected or keyword_detected
    
    state_manager.set_auto_state(detected)

    with _lazy_detection_lock:
        _lazy_detection_cache[package_name] = detected

    return detected


class LazyInstallConfig:
    """Global configuration for lazy installation per package."""
    _configs: Dict[str, bool] = {}
    _modes: Dict[str, str] = {}
    _initialized: Dict[str, bool] = {}
    _manual_overrides: Dict[str, bool] = {}
    
    @classmethod
    def set(
        cls,
        package_name: str,
        enabled: bool,
        mode: str = "auto",
        install_hook: bool = True,
        manual: bool = False,
    ) -> None:
        """Enable or disable lazy installation for a specific package."""
        package_key = package_name.lower()
        state_manager = LazyStateManager(package_name)
        
        if manual:
            cls._manual_overrides[package_key] = True
            state_manager.set_manual_state(enabled)
        elif cls._manual_overrides.get(package_key):
            logger.debug(
                f"Lazy install config for {package_key} already overridden manually; skipping auto configuration."
            )
            return
        else:
            state_manager.set_manual_state(None)
        
        cls._configs[package_key] = enabled
        cls._modes[package_key] = mode
        
        cls._initialize_package(package_key, enabled, mode, install_hook=install_hook)
    
    @classmethod
    def _initialize_package(cls, package_key: str, enabled: bool, mode: str, install_hook: bool = True) -> None:
        """Initialize lazy installation for a specific package."""
        if enabled:
            try:
                enable_lazy_install(package_key)
                
                mode_enum = _MODE_ENUM_MAP.get(mode.lower(), LazyInstallMode.AUTO)
                set_lazy_install_mode(package_key, mode_enum)
                
                if install_hook:
                    if not is_import_hook_installed(package_key):
                        install_import_hook(package_key)
                    _log("config", f"✅ Lazy installation initialized for {package_key} (mode: {mode}, hook: installed)")
                else:
                    uninstall_import_hook(package_key)
                    _log("config", f"✅ Lazy installation initialized for {package_key} (mode: {mode}, hook: disabled)")
                
                cls._initialized[package_key] = True
                sync_manifest_configuration(package_key)
            except ImportError as e:
                logger.warning(f"⚠️ Could not enable lazy install for {package_key}: {e}")
        else:
            try:
                disable_lazy_install(package_key)
            except ImportError:
                pass
            uninstall_import_hook(package_key)
            cls._initialized[package_key] = False
            _log("config", f"❌ Lazy installation disabled for {package_key}")
            sync_manifest_configuration(package_key)
    
    @classmethod
    def is_enabled(cls, package_name: str) -> bool:
        """Check if lazy installation is enabled for a package."""
        return cls._configs.get(package_name.lower(), False)
    
    @classmethod
    def get_mode(cls, package_name: str) -> str:
        """Get the lazy installation mode for a package."""
        return cls._modes.get(package_name.lower(), "auto")


def config_package_lazy_install_enabled(
    package_name: str, 
    enabled: bool = None,
    mode: str = "auto",
    install_hook: bool = True
) -> None:
    """
    Simple one-line configuration for package lazy installation.
    
    Args:
        package_name: Package name (e.g., "xwsystem", "xwnode", "xwdata")
        enabled: True to enable, False to disable, None to auto-detect from pip installation
        mode: Installation mode - "auto", "interactive", "disabled", "dry_run"
        install_hook: Whether to install the import hook (default: True)
    
    Examples:
        # Auto-detect from installation
        config_package_lazy_install_enabled("your_package_name")
        
        # Force enable
        config_package_lazy_install_enabled("xwnode", True, "interactive")
        
        # Force disable
        config_package_lazy_install_enabled("xwdata", False)
    """
    manual_override = enabled is not None
    if enabled is None:
        enabled = _detect_lazy_installation(package_name)
    
    LazyInstallConfig.set(
        package_name,
        enabled,
        mode,
        install_hook=install_hook,
        manual=manual_override,
    )


# =============================================================================
# SECTION 6: FACADE - UNIFIED API (~150 lines)
# =============================================================================

class LazyModeFacade:
    """
    Main facade for lazy mode operations.
    Provides a unified interface for lazy loading functionality.
    """
    
    __slots__ = ('_enabled', '_strategy', '_config', '_performance_monitor')
    
    def __init__(self):
        """Initialize lazy mode facade."""
        self._enabled = False
        self._strategy = None
        self._config = {}
        self._performance_monitor = None
    
    def enable(self, strategy: str = "on_demand", **kwargs) -> None:
        """Enable lazy mode with specified strategy."""
        self._enabled = True
        self._strategy = strategy
        
        package_name = kwargs.pop('package_name', 'default').lower()
        enable_lazy_import_flag = kwargs.pop('enable_lazy_imports', True)
        enable_lazy_install_flag = kwargs.pop('enable_lazy_install', True)
        lazy_install_mode = kwargs.pop('lazy_install_mode', "auto")
        install_hook = kwargs.pop('install_hook', True)
        
        self._config.update({
            'package_name': package_name,
            'enable_lazy_imports': enable_lazy_import_flag,
            'enable_lazy_install': enable_lazy_install_flag,
            'lazy_install_mode': lazy_install_mode,
            'install_hook': install_hook,
        })
        self._config.update(kwargs)
        
        _log("config", f"Lazy mode enabled with strategy: {strategy}")
        
        if enable_lazy_import_flag:
            _lazy_importer.enable()
        else:
            _lazy_importer.disable()
        
        if enable_lazy_install_flag:
            config_package_lazy_install_enabled(
                package_name,
                True,
                lazy_install_mode,
                install_hook=install_hook,
            )
        else:
            config_package_lazy_install_enabled(
                package_name,
                False,
                install_hook=install_hook,
            )
            uninstall_import_hook(package_name)
        
        if self._config.get('enable_monitoring', True):
            self._performance_monitor = LazyPerformanceMonitor()
    
    def disable(self) -> None:
        """Disable lazy mode and cleanup resources."""
        self._enabled = False
        self._strategy = None
        
        package_name = self._config.get('package_name', 'default')
        
        if self._config.get('enable_lazy_imports', True):
            _lazy_importer.disable()
        
        if self._config.get('enable_lazy_install', True):
            LazyInstallConfig.set(
                package_name,
                False,
                self._config.get('lazy_install_mode', 'auto'),
                install_hook=self._config.get('install_hook', True),
            )
        
        if self._config.get('clear_cache_on_disable', True):
            _global_registry.clear_cache()
        
        self._performance_monitor = None
        
        _log("config", "Lazy mode disabled")
    
    def is_enabled(self) -> bool:
        """Check if lazy mode is currently enabled."""
        return self._enabled
    
    def get_stats(self) -> Dict[str, Any]:
        """Get lazy mode performance statistics."""
        stats = _global_registry.get_stats()
        stats.update({
            'enabled': self._enabled,
            'strategy': self._strategy,
            'config': self._config.copy()
        })
        
        if self._performance_monitor:
            stats['performance'] = self._performance_monitor.get_stats()
        
        return stats
    
    def configure(self, **kwargs) -> None:
        """Configure lazy mode settings."""
        self._config.update(kwargs)
        logger.debug(f"Lazy mode configuration updated: {kwargs}")
    
    def preload(self, modules: List[str]) -> None:
        """Preload specified modules."""
        for module_name in modules:
            try:
                loader = _global_registry.get_module(module_name)
                _ = loader.load_module()
                _log("hook", f"Preloaded module: {module_name}")
            except KeyError:
                logger.warning(f"Module not registered: {module_name}")
            except Exception as e:
                logger.error(f"Failed to preload {module_name}: {e}")
    
    def optimize(self) -> None:
        """Run optimization based on current usage patterns."""
        if not self._enabled:
            return
        
        threshold = self._config.get('preload_threshold', 5)
        _global_registry.preload_frequently_used(threshold)
        
        _log("config", "Lazy mode optimization completed")


# Global lazy mode facade instance
_lazy_facade = LazyModeFacade()


def enable_lazy_mode(strategy: str = "on_demand", **kwargs) -> None:
    """Enable lazy mode with specified strategy."""
    _lazy_facade.enable(strategy, **kwargs)


def disable_lazy_mode() -> None:
    """Disable lazy mode and cleanup resources."""
    _lazy_facade.disable()


def is_lazy_mode_enabled() -> bool:
    """Check if lazy mode is currently enabled."""
    return _lazy_facade.is_enabled()


def get_lazy_mode_stats() -> Dict[str, Any]:
    """Get lazy mode performance statistics."""
    return _lazy_facade.get_stats()


def configure_lazy_mode(**kwargs) -> None:
    """Configure lazy mode settings."""
    _lazy_facade.configure(**kwargs)


def preload_modules(modules: List[str]) -> None:
    """Preload specified modules."""
    _lazy_facade.preload(modules)


def optimize_lazy_mode() -> None:
    """Run optimization based on current usage patterns."""
    _lazy_facade.optimize()


# =============================================================================
# SECTION 7: PUBLIC API - SIMPLE FUNCTIONS (~200 lines)
# =============================================================================

def enable_lazy_install(package_name: str = 'default') -> None:
    """Enable lazy installation for a specific package."""
    installer = LazyInstallerRegistry.get_instance(package_name)
    installer.enable()


def disable_lazy_install(package_name: str = 'default') -> None:
    """Disable lazy installation for a specific package."""
    installer = LazyInstallerRegistry.get_instance(package_name)
    installer.disable()


def is_lazy_install_enabled(package_name: str = 'default') -> bool:
    """Check if lazy installation is enabled for a specific package."""
    installer = LazyInstallerRegistry.get_instance(package_name)
    return installer.is_enabled()


def set_lazy_install_mode(package_name: str, mode: LazyInstallMode) -> None:
    """Set the lazy installation mode for a specific package."""
    installer = LazyInstallerRegistry.get_instance(package_name)
    installer.set_mode(mode)


def get_lazy_install_mode(package_name: str = 'default') -> LazyInstallMode:
    """Get the lazy installation mode for a specific package."""
    installer = LazyInstallerRegistry.get_instance(package_name)
    return installer.get_mode()


def install_missing_package(package_name: str, installer_package: str = 'default') -> bool:
    """Install a missing package."""
    installer = LazyInstallerRegistry.get_instance(installer_package)
    return installer.install_package(package_name)


def install_and_import(
    module_name: str, 
    package_name: str = None,
    installer_package: str = 'default'
) -> Tuple[Optional[ModuleType], bool]:
    """Install package and import module."""
    installer = LazyInstallerRegistry.get_instance(installer_package)
    return installer.install_and_import(module_name, package_name)


def get_lazy_install_stats(package_name: str = 'default') -> Dict[str, Any]:
    """Get lazy installation statistics for a specific package."""
    installer = LazyInstallerRegistry.get_instance(package_name)
    return installer.get_stats()


def get_all_lazy_install_stats() -> Dict[str, Dict[str, Any]]:
    """Get lazy installation statistics for all packages."""
    all_instances = LazyInstallerRegistry.get_all_instances()
    return {name: inst.get_stats() for name, inst in all_instances.items()}


def lazy_import_with_install(
    module_name: str, 
    package_name: str = None,
    installer_package: str = 'default'
) -> Tuple[Optional[ModuleType], bool]:
    """
    Lazy import with automatic installation.
    
    This function attempts to import a module, and if it fails due to ImportError,
    it automatically installs the corresponding package using pip before retrying.
    """
    installer = LazyInstallerRegistry.get_instance(installer_package)
    return installer.install_and_import(module_name, package_name)


def xwimport(
    module_name: str, 
    package_name: str = None,
    installer_package: str = 'default'
) -> Any:
    """
    Simple lazy import with automatic installation.
    
    This function either returns the imported module or raises an ImportError.
    """
    module, available = lazy_import_with_install(module_name, package_name, installer_package)
    if not available:
        raise ImportError(f"Module {module_name} is not available and could not be installed")
    return module


# Security & Policy APIs
def set_package_allow_list(package_name: str, allowed_packages: List[str]) -> None:
    """Set allow list for a package (only these packages can be installed)."""
    LazyInstallPolicy.set_allow_list(package_name, allowed_packages)


def set_package_deny_list(package_name: str, denied_packages: List[str]) -> None:
    """Set deny list for a package (these packages cannot be installed)."""
    LazyInstallPolicy.set_deny_list(package_name, denied_packages)


def add_to_package_allow_list(package_name: str, allowed_package: str) -> None:
    """Add single package to allow list."""
    LazyInstallPolicy.add_to_allow_list(package_name, allowed_package)


def add_to_package_deny_list(package_name: str, denied_package: str) -> None:
    """Add single package to deny list."""
    LazyInstallPolicy.add_to_deny_list(package_name, denied_package)


def set_package_index_url(package_name: str, index_url: str) -> None:
    """Set PyPI index URL for a package."""
    LazyInstallPolicy.set_index_url(package_name, index_url)


def set_package_extra_index_urls(package_name: str, urls: List[str]) -> None:
    """Set extra index URLs for a package."""
    LazyInstallPolicy.set_extra_index_urls(package_name, urls)


def add_package_trusted_host(package_name: str, host: str) -> None:
    """Add trusted host for a package."""
    LazyInstallPolicy.add_trusted_host(package_name, host)


def set_package_lockfile(package_name: str, lockfile_path: str) -> None:
    """Set lockfile path for a package to track installed dependencies."""
    LazyInstallPolicy.set_lockfile_path(package_name, lockfile_path)


def generate_package_sbom(package_name: str = 'default', output_path: str = None) -> Dict:
    """Generate Software Bill of Materials (SBOM) for installed packages."""
    installer = LazyInstallerRegistry.get_instance(package_name)
    sbom = installer.generate_sbom()
    
    if output_path:
        installer.export_sbom(output_path)
    
    return sbom


def check_externally_managed_environment() -> bool:
    """Check if current Python environment is externally managed (PEP 668)."""
    return _is_externally_managed()


# Keyword-based detection API
def enable_keyword_detection(enabled: bool = True, keyword: Optional[str] = None) -> None:
    """
    Enable/disable keyword-based auto-detection of lazy loading.
    
    When enabled, xwlazy will check installed packages for a keyword
    (default: "xwlazy-enabled") in their metadata. Packages can opt-in
    by adding the keyword to their pyproject.toml:
    
    [project]
    keywords = ["xwlazy-enabled"]
    
    Args:
        enabled: Whether to enable keyword detection (default: True)
        keyword: Custom keyword to check (default: "xwlazy-enabled")
    """
    global _KEYWORD_DETECTION_ENABLED, _KEYWORD_TO_CHECK
    _KEYWORD_DETECTION_ENABLED = enabled
    if keyword is not None:
        _KEYWORD_TO_CHECK = keyword
    # Clear cache to force re-detection
    with _lazy_detection_lock:
        _lazy_detection_cache.clear()


def is_keyword_detection_enabled() -> bool:
    """Return whether keyword-based detection is enabled."""
    return _KEYWORD_DETECTION_ENABLED


def get_keyword_detection_keyword() -> str:
    """Get the keyword currently being checked for auto-detection."""
    return _KEYWORD_TO_CHECK


def check_package_keywords(package_name: Optional[str] = None, keyword: Optional[str] = None) -> bool:
    """
    Check if a package (or any package) has the specified keyword in its metadata.
    
    This is the public API for the keyword detection functionality.
    
    Args:
        package_name: The package name to check (or None to check all packages)
        keyword: The keyword to look for (default: uses configured keyword)
    
    Returns:
        True if the keyword is found in the package's metadata
    """
    return _check_package_keywords(package_name, keyword)


# =============================================================================
# EXPORT ALL
# =============================================================================

__all__ = [
    # Core classes
    'DependencyMapper',
    'LazyDiscovery',
    'LazyInstaller',
    'LazyInstallPolicy',
    'LazyInstallerRegistry',
    'LazyImportHook',
    'LazyMetaPathFinder',
    'LazyLoader',
    'LazyImporter',
    'LazyModuleRegistry',
    'LazyPerformanceMonitor',
    'LazyInstallConfig',
    'LazyModeFacade',
    'WatchedPrefixRegistry',
    'AsyncInstallHandle',
    
    # Discovery functions
    'get_lazy_discovery',
    'discover_dependencies',
    'export_dependency_mappings',
    
    # Install functions
    'enable_lazy_install',
    'disable_lazy_install',
    'is_lazy_install_enabled',
    'set_lazy_install_mode',
    'get_lazy_install_mode',
    'install_missing_package',
    'install_and_import',
    'get_lazy_install_stats',
    'get_all_lazy_install_stats',
    'lazy_import_with_install',
    'xwimport',
    
    # Hook functions
    'install_import_hook',
    'uninstall_import_hook',
    'is_import_hook_installed',
    
    # Lazy loading functions
    'enable_lazy_imports',
    'disable_lazy_imports',
    'is_lazy_import_enabled',
    'lazy_import',
    'register_lazy_module',
    'preload_module',
    'get_lazy_module',
    'get_loading_stats',
    'preload_frequently_used',
    'get_lazy_import_stats',
    
    # Lazy mode facade functions
    'enable_lazy_mode',
    'disable_lazy_mode',
    'is_lazy_mode_enabled',
    'get_lazy_mode_stats',
    'configure_lazy_mode',
    'preload_modules',
    'optimize_lazy_mode',
    
    # Configuration
    'config_package_lazy_install_enabled',
    'sync_manifest_configuration',
    'refresh_lazy_manifests',
    
    # Security & Policy
    'set_package_allow_list',
    'set_package_deny_list',
    'add_to_package_allow_list',
    'add_to_package_deny_list',
    'set_package_index_url',
    'set_package_extra_index_urls',
    'add_package_trusted_host',
    'set_package_lockfile',
    'generate_package_sbom',
    'check_externally_managed_environment',
    'register_lazy_module_prefix',
    'register_lazy_module_methods',
    
    # Keyword-based detection
    'enable_keyword_detection',
    'is_keyword_detection_enabled',
    'get_keyword_detection_keyword',
    'check_package_keywords',
]


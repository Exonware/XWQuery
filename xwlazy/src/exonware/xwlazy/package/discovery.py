"""
#exonware/xwlazy/src/exonware/xwlazy/discovery/discovery.py

Package discovery implementation.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.1.0.17
Generation Date: 10-Oct-2025

This module provides LazyDiscovery class that discovers dependencies from
project configuration sources with caching support.
"""

import json
import re
import subprocess
import sys
import threading
from pathlib import Path
from typing import Dict, List, Optional

from ..package.base import APackageHelper
from ..defs import DependencyInfo
from ..module.importer_engine import get_logger, log_event as _log

logger = get_logger("xwlazy.discovery")


class LazyDiscovery(APackageHelper):
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
        self._add_common_mappings()  # Add well-known mappings (bson->pymongo, cv2->opencv-python, etc.)
    
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
                except Exception:
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
                except Exception:
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
_discovery: Optional[LazyDiscovery] = None
_discovery_lock = threading.RLock()


def get_lazy_discovery(project_root: Optional[str] = None) -> LazyDiscovery:
    """Get or create global discovery instance."""
    global _discovery
    with _discovery_lock:
        if _discovery is None:
            _discovery = LazyDiscovery(project_root)
        return _discovery


__all__ = ['LazyDiscovery', 'get_lazy_discovery']


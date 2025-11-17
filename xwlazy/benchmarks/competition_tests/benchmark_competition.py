#!/usr/bin/env python3
"""
#xwlazy/benchmarks/competition_tests/benchmark_competition.py

Competition Benchmark: xwlazy vs. Lazy Import Libraries

Measures performance (time, memory, package size) across different loads
and features for xwlazy and competing lazy import libraries.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 1.0.0
Generation Date: 17-Nov-2025
"""

import os
import sys
import io
import json
import time
import subprocess
import shutil
import tempfile
import argparse
import warnings
from pathlib import Path
from typing import Dict, List, Optional, Any, Tuple
from dataclasses import dataclass, asdict
from datetime import datetime
import importlib.util

# Suppress pkg_resources deprecation warnings
warnings.filterwarnings("ignore", message=".*pkg_resources.*", category=UserWarning)

# Fix Windows console encoding for Unicode characters
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

try:
    import psutil
except ImportError:
    print("ERROR: Required packages not installed. Run: pip install psutil")
    sys.exit(1)

# Use importlib.metadata (Python 3.8+) with fallback to pkg_resources
try:
    from importlib.metadata import distribution, PackageNotFoundError
    _USE_IMPORTLIB = True
except ImportError:
    # Fallback for older Python versions
    try:
        import pkg_resources
        _USE_IMPORTLIB = False
        PackageNotFoundError = Exception  # Fallback exception type
    except ImportError:
        _USE_IMPORTLIB = None
        PackageNotFoundError = Exception
        print("WARNING: Cannot determine package versions. Install importlib-metadata or setuptools.")


# Library definitions
LIBRARIES = {
    "pipimport": {
        "pypi": "pipimport",
        "github": "https://github.com/chaosct/pipimport",
        "import_name": "pipimport",
    },
    "deferred-import": {
        "pypi": "deferred-import",
        "github": "https://github.com/orsinium-labs/deferred-import",
        "import_name": "deferred_import",
    },
    "lazy-loader": {
        "pypi": "lazy-loader",
        "github": "https://github.com/scientific-python/lazy-loader",
        "import_name": "lazy_loader",
    },
    "lazy-imports": {
        "pypi": "lazy-imports",
        "github": "https://github.com/bachorp/lazy-imports",
        "import_name": "lazy_imports",
    },
    "lazy_import": {
        "pypi": "lazy-import",
        "github": "https://github.com/mnmelo/lazy_import",
        "import_name": "lazy_import",
    },
    "pylazyimports": {
        "pypi": "pylazyimports",
        "github": "https://github.com/hmiladhia/lazyimports",
        "import_name": "lazyimports",
    },
    "lazi": {
        "pypi": "lazi",
        "github": "https://github.com/sitbon/lazi",
        "import_name": "lazi",
    },
    "lazy-imports-lite": {
        "pypi": "lazy-imports-lite",
        "github": "https://github.com/15r10nk/lazy-imports-lite",
        "import_name": "lazy_imports_lite",
    },
    "xwlazy": {
        "pypi": "xwlazy",  # May also be exonware-xwlazy
        "github": "Internal eXonware project",
        "import_name": "xwlazy",
    },
}


# Test mode definitions - split by feature categories
TEST_MODES = {
    "lazy_import_only": {
        "description": "Basic lazy import (fair comparison - all libraries)",
        "xwlazy_config": {
            "lazy_import": True,
            "lazy_install": False,
            "lazy_discovery": False,
            "lazy_monitoring": False,
            "keyword_detection": False,
        },
        "category": "Basic Lazy Import",
    },
    "lazy_import_install": {
        "description": "Lazy import + auto-install",
        "xwlazy_config": {
            "lazy_import": True,
            "lazy_install": True,
            "lazy_discovery": False,
            "lazy_monitoring": False,
            "keyword_detection": False,
        },
        "category": "Lazy Import + Install",
    },
    "lazy_import_discovery": {
        "description": "Lazy import + dependency discovery",
        "xwlazy_config": {
            "lazy_import": True,
            "lazy_install": False,
            "lazy_discovery": True,
            "lazy_monitoring": False,
            "keyword_detection": False,
        },
        "category": "Lazy Import + Discovery",
    },
    "lazy_import_monitoring": {
        "description": "Lazy import + performance monitoring",
        "xwlazy_config": {
            "lazy_import": True,
            "lazy_install": False,
            "lazy_discovery": False,
            "lazy_monitoring": True,
            "keyword_detection": False,
        },
        "category": "Lazy Import + Monitoring",
    },
    "full_features": {
        "description": "All features enabled (xwlazy showcase)",
        "xwlazy_config": {
            "lazy_import": True,
            "lazy_install": True,
            "lazy_discovery": True,
            "lazy_monitoring": True,
            "keyword_detection": True,
        },
        "category": "Full Features",
    },
}


@dataclass
class BenchmarkResult:
    """Results for a single benchmark run."""
    library: str
    test_name: str
    import_time_ms: float
    memory_peak_mb: float
    memory_avg_mb: float
    package_size_mb: float
    success: bool
    error: Optional[str] = None
    features_supported: List[str] = None
    timestamp: str = None
    relative_time: float = 1.0  # Relative to baseline (1.0 = same speed, >1.0 = slower, <1.0 = faster)
    test_mode: str = "lazy_import_only"  # Which test mode was used

    def __post_init__(self):
        if self.features_supported is None:
            self.features_supported = []
        if self.timestamp is None:
            self.timestamp = datetime.now().isoformat()


@dataclass
class LibraryInfo:
    """Information about a library."""
    name: str
    pypi_name: str
    github_url: str
    installed: bool = False
    version: Optional[str] = None
    package_size_mb: float = 0.0


class BenchmarkRunner:
    """Main benchmark runner."""

    def __init__(self, output_dir: Path = None):
        """Initialize benchmark runner.
        
        Why: Centralizes output directory management and follows GUIDE_DOCS.md
        naming conventions for benchmark logs.
        """
        self.output_dir = output_dir or Path(__file__).parent / "output_log"
        self.output_dir.mkdir(exist_ok=True)
        self.process = psutil.Process()

    def uninstall_library(self, library_name: str) -> bool:
        """Uninstall a library."""
        lib_info = LIBRARIES.get(library_name)
        if not lib_info:
            return False

        pypi_name = lib_info["pypi"]
        print(f"  Uninstalling {pypi_name}...")
        try:
            result = subprocess.run(
                [sys.executable, "-m", "pip", "uninstall", "-y", pypi_name],
                capture_output=True,
                text=True,
                timeout=60,
            )
            return result.returncode == 0
        except Exception as e:
            print(f"  Warning: Uninstall failed: {e}")
            return False

    def install_library(self, library_name: str) -> Tuple[bool, Optional[str]]:
        """Install a library and return (success, version)."""
        lib_info = LIBRARIES.get(library_name)
        if not lib_info:
            return False, None

        pypi_name = lib_info["pypi"]
        print(f"  Installing {pypi_name}...")
        try:
            result = subprocess.run(
                [sys.executable, "-m", "pip", "install", pypi_name],
                capture_output=True,
                text=True,
                timeout=300,
            )
            if result.returncode != 0:
                return False, None

            # Try to get version
            try:
                if _USE_IMPORTLIB:
                    dist = distribution(pypi_name)
                    version = dist.version
                elif _USE_IMPORTLIB is False:
                    dist = pkg_resources.get_distribution(pypi_name)
                    version = dist.version
                else:
                    version = "unknown"
            except (PackageNotFoundError, Exception):
                version = "unknown"

            return True, version
        except Exception as e:
            print(f"  Error installing: {e}")
            return False, None

    def get_package_size(self, library_name: str) -> float:
        """Get installed package size in MB.
        
        Why: Measures disk footprint for fair comparison across libraries.
        """
        lib_info = LIBRARIES.get(library_name)
        if not lib_info:
            return 0.0

        pypi_name = lib_info["pypi"]
        try:
            if _USE_IMPORTLIB:
                # importlib.metadata doesn't provide file locations directly
                # Use site-packages search instead
                import site
                dist = distribution(pypi_name)
                dist_name = dist.name if hasattr(dist, 'name') else pypi_name
                locations = []
                for site_dir in site.getsitepackages():
                    locations.extend([
                        Path(site_dir) / dist_name.lower().replace("-", "_"),
                        Path(site_dir) / dist_name.replace("-", "_"),
                        Path(site_dir) / pypi_name.replace("-", "_"),
                    ])
            elif _USE_IMPORTLIB is False:
                dist = pkg_resources.get_distribution(pypi_name)
                # Try multiple possible locations
                locations = [
                    Path(dist.location) / dist.project_name.lower().replace("-", "_"),
                    Path(dist.location) / dist.project_name.replace("-", "_"),
                    Path(dist.location) / pypi_name.replace("-", "_"),
                ]
            else:
                locations = []
            
            for location in locations:
                if location.exists() and location.is_dir():
                    total_size = sum(
                        f.stat().st_size for f in location.rglob("*") if f.is_file()
                    )
                    return total_size / (1024 * 1024)  # Convert to MB
            
            # Fallback: try to find in site-packages
            import site
            for site_dir in site.getsitepackages():
                possible_path = Path(site_dir) / pypi_name.replace("-", "_")
                if possible_path.exists() and possible_path.is_dir():
                    total_size = sum(
                        f.stat().st_size for f in possible_path.rglob("*") if f.is_file()
                    )
                    return total_size / (1024 * 1024)
        except Exception as e:
            print(f"    Warning: Could not calculate package size: {e}")
            pass

        return 0.0

    def _get_baseline_time(self) -> float:
        """Get baseline import time for standard library import.
        
        Why: Provides baseline for relative time calculations.
        Uses a simple standard library import to establish baseline.
        """
        # Use a standard library that's always available
        # Need to delete from sys.modules to get fresh import each time
        times = []
        test_module = "json"  # Standard library, always available
        
        for _ in range(5):
            # Remove from cache to force fresh import
            if test_module in sys.modules:
                del sys.modules[test_module]
            
            start = time.perf_counter()
            importlib.import_module(test_module)
            elapsed = (time.perf_counter() - start) * 1000
            times.append(elapsed)
        
        # Return median to avoid outliers
        times.sort()
        baseline = times[len(times) // 2]
        
        # Ensure minimum baseline (avoid division by zero)
        if baseline < 0.01:
            baseline = 0.01
        
        return baseline

    def test_basic_import(self, library_name: str, baseline_time: float = None, test_mode: str = "lazy_import_only") -> BenchmarkResult:
        """Test basic import functionality.
        
        Why: Tests the core lazy import capability of each library.
        Measures time to import the library itself, which is the most
        basic operation for lazy import systems.
        """
        lib_info = LIBRARIES.get(library_name)
        if not lib_info:
            return BenchmarkResult(
                library=library_name,
                test_name="basic_import",
                import_time_ms=0.0,
                memory_peak_mb=0.0,
                memory_avg_mb=0.0,
                package_size_mb=0.0,
                success=False,
                error="Library not found",
                test_mode=test_mode,
            )

        import_name = lib_info["import_name"]
        memory_before = self.process.memory_info().rss / (1024 * 1024)

        try:
            # Warm up - first import is often slower
            try:
                if import_name in sys.modules:
                    del sys.modules[import_name]
            except:
                pass

            # Measure import time (average of 3 runs for consistency)
            times = []
            for _ in range(3):
                try:
                    if import_name in sys.modules:
                        del sys.modules[import_name]
                except:
                    pass
                
                start_time = time.perf_counter()
                spec = importlib.util.find_spec(import_name)
                if spec is None:
                    raise ImportError(f"Cannot find module {import_name}")
                try:
                    module = importlib.import_module(import_name)
                except SyntaxError as e:
                    # Handle Python 2 compatibility issues (e.g., pipimport)
                    if "print" in str(e).lower() and "parentheses" in str(e).lower():
                        raise ImportError(f"Library {library_name} is not compatible with Python 3 (Python 2 syntax detected)")
                    raise
                elapsed = (time.perf_counter() - start_time) * 1000
                times.append(elapsed)
            
            # Use median to avoid outliers
            times.sort()
            import_time = times[len(times) // 2]

            # Measure memory after import
            memory_after = self.process.memory_info().rss / (1024 * 1024)
            memory_peak = memory_after
            memory_avg = (memory_before + memory_after) / 2

            # Check features
            features = self.detect_features(module, library_name, test_mode)

            # Calculate relative time
            if baseline_time is None:
                baseline_time = self._get_baseline_time()
            relative_time = import_time / baseline_time if baseline_time > 0 else 1.0

            return BenchmarkResult(
                library=library_name,
                test_name="basic_import",
                import_time_ms=import_time,
                memory_peak_mb=memory_peak,
                memory_avg_mb=memory_avg,
                package_size_mb=self.get_package_size(library_name),
                success=True,
                features_supported=features,
                relative_time=relative_time,
                test_mode=test_mode,
            )
        except Exception as e:
            return BenchmarkResult(
                library=library_name,
                test_name="basic_import",
                import_time_ms=0.0,
                memory_peak_mb=0.0,
                memory_avg_mb=0.0,
                package_size_mb=0.0,
                success=False,
                error=str(e),
                test_mode=test_mode,
            )

    def test_light_load(self, library_name: str, baseline_time: float = None, test_mode: str = "lazy_import_only") -> BenchmarkResult:
        """Test light load: single module import."""
        result = self.test_basic_import(library_name, baseline_time, test_mode)
        result.test_name = "light_load"
        return result

    def test_medium_load(self, library_name: str, baseline_time: float = None, test_mode: str = "lazy_import_only") -> BenchmarkResult:
        """Test medium load: multiple imports.
        
        Why: Tests performance with multiple module imports to evaluate
        how well the library handles moderate load scenarios.
        Uses standard library modules that are always available.
        """
        lib_info = LIBRARIES.get(library_name)
        if not lib_info:
            return BenchmarkResult(
                library=library_name,
                test_name="medium_load",
                import_time_ms=0.0,
                memory_peak_mb=0.0,
                memory_avg_mb=0.0,
                package_size_mb=0.0,
                success=False,
                error="Library not found",
                test_mode=test_mode,
            )

        import_name = lib_info["import_name"]
        # Standard library modules for medium load (5-8 modules)
        test_modules = ["json", "os", "sys", "datetime", "collections", "itertools", "functools", "pathlib"]
        
        memory_before = self.process.memory_info().rss / (1024 * 1024)

        try:
            # Import the library module
            if import_name in sys.modules:
                del sys.modules[import_name]
            
            try:
                module = importlib.import_module(import_name)
            except SyntaxError as e:
                # Handle Python 2 compatibility issues (e.g., pipimport)
                if "print" in str(e).lower() and "parentheses" in str(e).lower():
                    raise ImportError(f"Library {library_name} is not compatible with Python 3 (Python 2 syntax detected)")
                raise
            
            # Try to enable lazy mode using adapter with test_mode config
            try:
                from library_adapters import create_adapter
                # Get config for xwlazy based on test_mode
                config = None
                if library_name == "xwlazy" and test_mode in TEST_MODES:
                    config = TEST_MODES[test_mode]["xwlazy_config"]
                adapter = create_adapter(library_name, config)
                if adapter:
                    adapter.enable()
            except:
                pass  # Continue even if adapter fails

            # Measure import time for multiple modules (average of 3 runs)
            times = []
            for _ in range(3):
                # Clear modules from cache to force fresh imports
                # Some modules (like sys) cannot be safely removed, so we skip them
                safe_to_remove = ["json", "datetime", "collections", "itertools", "functools", "pathlib"]
                for mod in safe_to_remove:
                    if mod in sys.modules:
                        try:
                            del sys.modules[mod]
                        except (KeyError, RuntimeError):
                            pass  # Skip if removal fails
                
                start_time = time.perf_counter()
                
                # Import all test modules
                for mod in test_modules:
                    try:
                        importlib.import_module(mod)
                    except ImportError:
                        pass  # Skip if module not available
                
                elapsed = (time.perf_counter() - start_time) * 1000
                times.append(elapsed)
            
            # Use median to avoid outliers
            times.sort()
            import_time = times[len(times) // 2]

            # Measure memory after imports
            memory_after = self.process.memory_info().rss / (1024 * 1024)
            memory_peak = memory_after
            memory_avg = (memory_before + memory_after) / 2

            # Check features
            features = self.detect_features(module, library_name, test_mode)

            # Calculate relative time
            if baseline_time is None:
                baseline_time = self._get_baseline_time()
            relative_time = import_time / baseline_time if baseline_time > 0 else 1.0

            return BenchmarkResult(
                library=library_name,
                test_name="medium_load",
                import_time_ms=import_time,
                memory_peak_mb=memory_peak,
                memory_avg_mb=memory_avg,
                package_size_mb=self.get_package_size(library_name),
                success=True,
                features_supported=features,
                relative_time=relative_time,
                test_mode=test_mode,
            )
        except Exception as e:
            return BenchmarkResult(
                library=library_name,
                test_name="medium_load",
                import_time_ms=0.0,
                memory_peak_mb=0.0,
                memory_avg_mb=0.0,
                package_size_mb=0.0,
                success=False,
                error=str(e),
                test_mode=test_mode,
            )

    def test_heavy_load(self, library_name: str, baseline_time: float = None, test_mode: str = "lazy_import_only") -> BenchmarkResult:
        """Test heavy load: many imports.
        
        Why: Tests performance with many module imports to evaluate
        how well the library handles heavy load scenarios.
        Uses standard library modules that are always available.
        """
        lib_info = LIBRARIES.get(library_name)
        if not lib_info:
            return BenchmarkResult(
                library=library_name,
                test_name="heavy_load",
                import_time_ms=0.0,
                memory_peak_mb=0.0,
                memory_avg_mb=0.0,
                package_size_mb=0.0,
                success=False,
                error="Library not found",
                test_mode=test_mode,
            )

        import_name = lib_info["import_name"]
        # Standard library modules for heavy load (15+ modules)
        # Using only top-level modules that are always importable
        test_modules = [
            "json", "os", "sys", "datetime", "collections", "itertools", "functools",
            "pathlib", "tempfile", "shutil", "subprocess", "threading", "multiprocessing",
            "queue", "hashlib", "base64", "csv", "io", "re", "math", "random", "string"
        ]
        
        memory_before = self.process.memory_info().rss / (1024 * 1024)

        try:
            # Import the library module
            if import_name in sys.modules:
                del sys.modules[import_name]
            
            try:
                module = importlib.import_module(import_name)
            except SyntaxError as e:
                # Handle Python 2 compatibility issues (e.g., pipimport)
                if "print" in str(e).lower() and "parentheses" in str(e).lower():
                    raise ImportError(f"Library {library_name} is not compatible with Python 3 (Python 2 syntax detected)")
                raise
            
            # Try to enable lazy mode using adapter with test_mode config
            try:
                from library_adapters import create_adapter
                # Get config for xwlazy based on test_mode
                config = None
                if library_name == "xwlazy" and test_mode in TEST_MODES:
                    config = TEST_MODES[test_mode]["xwlazy_config"]
                adapter = create_adapter(library_name, config)
                if adapter:
                    adapter.enable()
            except:
                pass  # Continue even if adapter fails

            # Measure import time for many modules (average of 3 runs)
            times = []
            for _ in range(3):
                # Clear modules from cache to force fresh imports
                # Some modules (like sys, os) cannot be safely removed, so we skip them
                safe_to_remove = [
                    "json", "datetime", "collections", "itertools", "functools",
                    "pathlib", "tempfile", "shutil", "subprocess", "threading",
                    "multiprocessing", "queue", "hashlib", "base64", "csv", "io",
                    "re", "math", "random", "string"
                ]
                for mod in safe_to_remove:
                    if mod in sys.modules:
                        try:
                            del sys.modules[mod]
                        except (KeyError, RuntimeError):
                            pass  # Skip if removal fails
                
                start_time = time.perf_counter()
                
                # Import all test modules
                for mod in test_modules:
                    try:
                        importlib.import_module(mod)
                    except ImportError:
                        pass  # Skip if module not available
                
                elapsed = (time.perf_counter() - start_time) * 1000
                times.append(elapsed)
            
            # Use median to avoid outliers
            times.sort()
            import_time = times[len(times) // 2]

            # Measure memory after imports
            memory_after = self.process.memory_info().rss / (1024 * 1024)
            memory_peak = memory_after
            memory_avg = (memory_before + memory_after) / 2

            # Check features
            features = self.detect_features(module, library_name, test_mode)

            # Calculate relative time
            if baseline_time is None:
                baseline_time = self._get_baseline_time()
            relative_time = import_time / baseline_time if baseline_time > 0 else 1.0

            return BenchmarkResult(
                library=library_name,
                test_name="heavy_load",
                import_time_ms=import_time,
                memory_peak_mb=memory_peak,
                memory_avg_mb=memory_avg,
                package_size_mb=self.get_package_size(library_name),
                success=True,
                features_supported=features,
                relative_time=relative_time,
                test_mode=test_mode,
            )
        except Exception as e:
            return BenchmarkResult(
                library=library_name,
                test_name="heavy_load",
                import_time_ms=0.0,
                memory_peak_mb=0.0,
                memory_avg_mb=0.0,
                package_size_mb=0.0,
                success=False,
                error=str(e),
                test_mode=test_mode,
            )

    def test_enterprise_load(self, library_name: str, baseline_time: float = None, test_mode: str = "lazy_import_only") -> BenchmarkResult:
        """Test enterprise/extra-high load: maximum imports.
        
        Why: Tests performance with maximum module imports to evaluate
        how well the library handles enterprise-scale load scenarios.
        Uses standard library modules that are always available.
        """
        lib_info = LIBRARIES.get(library_name)
        if not lib_info:
            return BenchmarkResult(
                library=library_name,
                test_name="enterprise_load",
                import_time_ms=0.0,
                memory_peak_mb=0.0,
                memory_avg_mb=0.0,
                package_size_mb=0.0,
                success=False,
                error="Library not found",
                test_mode=test_mode,
            )

        import_name = lib_info["import_name"]
        # Standard library modules for enterprise load (35+ modules)
        # Using only top-level modules that are always importable
        # Note: collections must be imported first as many modules depend on collections.abc
        test_modules = [
            "collections",  # Must be first - many modules depend on collections.abc
            "json", "os", "sys", "datetime", "itertools", "functools",
            "pathlib", "tempfile", "shutil", "subprocess", "threading", "multiprocessing",
            "queue", "hashlib", "base64", "csv", "io", "re", "math", "random", "string",
            "urllib", "http", "email", "xml", "sqlite3", "pickle", "copy", "weakref",
            "gc", "traceback", "logging", "warnings", "unittest", "doctest", "pdb",
            "profile", "pstats", "timeit", "dis", "inspect", "ast", "tokenize", "keyword",
            "types", "operator", "enum", "secrets", "zlib", "binascii"
        ]
        
        memory_before = self.process.memory_info().rss / (1024 * 1024)

        try:
            # Import the library module
            if import_name in sys.modules:
                del sys.modules[import_name]
            
            try:
                module = importlib.import_module(import_name)
            except SyntaxError as e:
                # Handle Python 2 compatibility issues (e.g., pipimport)
                if "print" in str(e).lower() and "parentheses" in str(e).lower():
                    raise ImportError(f"Library {library_name} is not compatible with Python 3 (Python 2 syntax detected)")
                raise
            
            # Try to enable lazy mode using adapter with test_mode config
            try:
                from library_adapters import create_adapter
                # Get config for xwlazy based on test_mode
                config = None
                if library_name == "xwlazy" and test_mode in TEST_MODES:
                    config = TEST_MODES[test_mode]["xwlazy_config"]
                adapter = create_adapter(library_name, config)
                if adapter:
                    adapter.enable()
            except:
                pass  # Continue even if adapter fails

            # Ensure collections is imported first - many modules depend on collections.abc
            # This must be done before the timing loop to ensure collections.abc is available
            try:
                import collections
                import collections.abc  # Ensure collections.abc is available
            except ImportError:
                pass  # collections should always be available, but handle gracefully

            # Measure import time for maximum modules (average of 3 runs)
            times = []
            for _ in range(3):
                # Clear modules from cache to force fresh imports
                # Some modules (like sys, os, collections) cannot be safely removed
                # collections and collections.abc must stay loaded as many modules depend on them
                safe_to_remove = [
                    "json", "datetime", "itertools", "functools",
                    "pathlib", "tempfile", "shutil", "subprocess", "threading",
                    "multiprocessing", "queue", "hashlib", "base64", "csv", "io",
                    "re", "math", "random", "string", "copy", "weakref", "gc",
                    "traceback", "logging", "warnings", "pickle", "unittest",
                    "doctest", "pdb", "profile", "pstats", "timeit", "dis",
                    "inspect", "ast", "tokenize", "keyword", "types", "operator",
                    "enum", "secrets", "zlib", "binascii"
                ]
                # Never remove collections or its submodules - many modules depend on collections.abc
                protected_modules = {"collections", "collections.abc"}
                for mod in safe_to_remove:
                    if mod in sys.modules and mod not in protected_modules:
                        try:
                            del sys.modules[mod]
                        except (KeyError, RuntimeError):
                            pass  # Skip if removal fails
                
                # Ensure collections is available before importing other modules
                # This must be done inside the loop in case it was cleared
                try:
                    import collections
                    import collections.abc
                except ImportError:
                    pass
                
                start_time = time.perf_counter()
                
                # Import all test modules
                for mod in test_modules:
                    try:
                        importlib.import_module(mod)
                    except (ImportError, AttributeError) as e:
                        # Skip if module not available or has attribute errors
                        # Some modules might have dependencies that aren't available
                        if "collections" in str(e).lower() and "abc" in str(e).lower():
                            # If collections.abc error, ensure collections is properly loaded
                            try:
                                import collections
                                import collections.abc
                                # Retry the import
                                importlib.import_module(mod)
                            except:
                                pass  # Skip this module if it still fails
                        else:
                            pass  # Skip other errors
                
                elapsed = (time.perf_counter() - start_time) * 1000
                times.append(elapsed)
            
            # Use median to avoid outliers
            times.sort()
            import_time = times[len(times) // 2]

            # Measure memory after imports
            memory_after = self.process.memory_info().rss / (1024 * 1024)
            memory_peak = memory_after
            memory_avg = (memory_before + memory_after) / 2

            # Check features
            features = self.detect_features(module, library_name, test_mode)

            # Calculate relative time
            if baseline_time is None:
                baseline_time = self._get_baseline_time()
            relative_time = import_time / baseline_time if baseline_time > 0 else 1.0

            return BenchmarkResult(
                library=library_name,
                test_name="enterprise_load",
                import_time_ms=import_time,
                memory_peak_mb=memory_peak,
                memory_avg_mb=memory_avg,
                package_size_mb=self.get_package_size(library_name),
                success=True,
                features_supported=features,
                relative_time=relative_time,
                test_mode=test_mode,
            )
        except Exception as e:
            return BenchmarkResult(
                library=library_name,
                test_name="enterprise_load",
                import_time_ms=0.0,
                memory_peak_mb=0.0,
                memory_avg_mb=0.0,
                package_size_mb=0.0,
                success=False,
                error=str(e),
                test_mode=test_mode,
            )

    def detect_features(self, module: Any, library_name: str, test_mode: str = "lazy_import_only") -> List[str]:
        """Detect available features in a library."""
        try:
            from library_adapters import create_adapter
            # Get config for xwlazy based on test_mode
            config = None
            if library_name == "xwlazy" and test_mode in TEST_MODES:
                config = TEST_MODES[test_mode]["xwlazy_config"]
            adapter = create_adapter(library_name, config)
            if adapter:
                return adapter.get_features()
        except:
            pass

        # Fallback detection
        features = []

        # Check for common features
        if hasattr(module, "lazy_import") or hasattr(module, "lazy"):
            features.append("lazy_import")
        if hasattr(module, "enable") or hasattr(module, "activate"):
            features.append("enable_hook")
        if hasattr(module, "install") or hasattr(module, "auto_install"):
            features.append("auto_install")
        if hasattr(module, "defer") or hasattr(module, "deferred"):
            features.append("deferred_loading")
        if hasattr(module, "cache") or hasattr(module, "caching"):
            features.append("caching")

        # Library-specific checks
        if library_name == "xwlazy":
            features.extend(["keyword_detection", "per_package_isolation", "performance_monitoring"])

        return features

    def run_benchmark(self, library_name: str, test_name: str = None, baseline_time: float = None, skip_uninstall: bool = False, test_mode: str = "lazy_import_only") -> List[BenchmarkResult]:
        """Run benchmarks for a library.
        
        Why: Ensures fair comparison by using same baseline for all libraries.
        
        Args:
            library_name: Name of the library to test
            test_name: Specific test to run (None = all tests)
            baseline_time: Pre-calculated baseline time
            skip_uninstall: Skip uninstall step
            test_mode: Test mode to use (lazy_import_only, lazy_import_install, etc.)
        """
        print(f"\n{'='*80}")
        print(f"Testing: {library_name}")
        if test_mode in TEST_MODES:
            print(f"Mode: {TEST_MODES[test_mode]['category']}")
        print(f"{'='*80}")

        results = []

        # Uninstall first (unless skipped)
        if not skip_uninstall:
            self.uninstall_library(library_name)

        # Install
        success, version = self.install_library(library_name)
        if not success:
            print(f"  ❌ Failed to install {library_name}")
            return results

        print(f"  ✅ Installed version: {version}")

        # Get baseline if not provided
        if baseline_time is None:
            baseline_time = self._get_baseline_time()
            print(f"  📊 Baseline time: {baseline_time:.2f} ms")

        # Run tests
        tests = {
            "light_load": self.test_light_load,
            "medium_load": self.test_medium_load,
            "heavy_load": self.test_heavy_load,
            "enterprise_load": self.test_enterprise_load,
        }

        if test_name:
            if test_name in tests:
                tests = {test_name: tests[test_name]}
            else:
                print(f"  ❌ Unknown test: {test_name}")
                return results

        for test_name, test_func in tests.items():
            print(f"\n  Running: {test_name}...")
            result = test_func(library_name, baseline_time, test_mode)
            results.append(result)

            if result.success:
                print(f"    ✅ Success")
                print(f"    ⏱️  Import time: {result.import_time_ms:.2f} ms")
                print(f"    📊 Relative time: {result.relative_time:.2f}x (vs baseline)")
                print(f"    💾 Memory peak: {result.memory_peak_mb:.2f} MB")
                print(f"    📦 Package size: {result.package_size_mb:.2f} MB")
                if result.features_supported:
                    print(f"    ✨ Features: {', '.join(result.features_supported)}")
            else:
                print(f"    ❌ Failed: {result.error}")

        # Uninstall after testing (unless skipped)
        if not skip_uninstall:
            self.uninstall_library(library_name)

        return results

    def _generate_benchmark_filename(self, description: str = "COMPETITION") -> str:
        """Generate benchmark filename following GUIDE_DOCS.md naming convention.
        
        Format: BENCH_YYYYMMDD_HHMM_DESCRIPTION
        Why: Follows eXonware documentation standards for benchmark logs.
        """
        now = datetime.now()
        date_str = now.strftime("%Y%m%d")
        time_str = now.strftime("%H%M")
        return f"BENCH_{date_str}_{time_str}_{description}"

    def save_results(self, results: List[BenchmarkResult], description: str = "COMPETITION"):
        """Save results to JSON following BENCH_* naming convention."""
        filename = f"{self._generate_benchmark_filename(description)}.json"
        filepath = self.output_dir / filename
        data = [asdict(r) for r in results]
        with open(filepath, "w", encoding='utf-8') as f:
            json.dump(data, f, indent=2)

        print(f"\n💾 Results saved to: {filepath}")

    def generate_report(self, results: List[BenchmarkResult], description: str = "COMPETITION"):
        """Generate markdown report following BENCH_* naming convention."""
        filename = f"{self._generate_benchmark_filename(description)}.md"
        report_path = self.output_dir / filename

        with open(report_path, "w", encoding='utf-8') as f:
            f.write("# Competition Benchmark Report\n\n")
            f.write(f"**Generated:** {datetime.now().isoformat()}\n\n")
            
            # Group results by test_mode (category)
            by_mode = {}
            for result in results:
                mode = result.test_mode
                if mode not in by_mode:
                    by_mode[mode] = []
                by_mode[mode].append(result)
            
            # Generate report for each test mode
            for test_mode in sorted(by_mode.keys()):
                mode_results = by_mode[test_mode]
                if test_mode in TEST_MODES:
                    category = TEST_MODES[test_mode]["category"]
                    description = TEST_MODES[test_mode]["description"]
                else:
                    category = test_mode.replace("_", " ").title()
                    description = f"Test mode: {test_mode}"
                
                f.write(f"## {category}\n\n")
                f.write(f"*{description}*\n\n")
                
                # Find top 3 rankings for this mode
                rankings = {}  # (library, test_name) -> rank (1, 2, 3, or None)
                by_test = {}
                for result in mode_results:
                    if result.success:  # Only consider successful results
                        key = (result.test_name, result.test_mode)
                        if key not in by_test:
                            by_test[key] = []
                        by_test[key].append(result)
                
                # Determine top 3 rankings for each test (fastest times)
                for key, test_results in by_test.items():
                    if test_results:
                        # Sort by import_time_ms (ascending - fastest first)
                        sorted_results = sorted(test_results, key=lambda r: r.import_time_ms)
                        # Assign rankings (1st, 2nd, 3rd)
                        for rank, result in enumerate(sorted_results[:3], start=1):
                            rankings[(result.library, result.test_name, result.test_mode)] = rank
                
                # Add rankings summary for this mode
                f.write("### Top 3 Rankings by Load Test\n\n")
                for test_name in sorted(set(r.test_name for r in mode_results)):
                    test_results = [r for r in mode_results if r.test_name == test_name and r.success]
                    if test_results:
                        sorted_results = sorted(test_results, key=lambda r: r.import_time_ms)
                        f.write(f"#### {test_name.replace('_', ' ').title()}\n\n")
                        f.write("| Rank | Library | Time (ms) | Relative |\n")
                        f.write("|------|---------|-----------|----------|\n")
                        for rank, result in enumerate(sorted_results[:3], start=1):
                            if rank == 1:
                                medal = " 👑"
                            elif rank == 2:
                                medal = " 🥈"
                            elif rank == 3:
                                medal = " 🥉"
                            else:
                                medal = ""
                            f.write(f"| {rank}{medal} | {result.library} | {result.import_time_ms:.2f} | {result.relative_time:.2f}x |\n")
                        f.write("\n")
                
                f.write("### Results Summary\n\n")

                # Group by library for this mode
                by_library = {}
                for result in mode_results:
                    if result.library not in by_library:
                        by_library[result.library] = []
                    by_library[result.library].append(result)

                # Summary table for this mode
                f.write("| Library | Test | Time (ms) | Relative | Memory (MB) | Size (MB) | Success |\n")
                f.write("|---------|------|-----------|----------|-------------|-----------|----------|\n")

                for library, lib_results in sorted(by_library.items()):
                    for result in lib_results:
                        # Add medal emoji based on ranking
                        rank = rankings.get((result.library, result.test_name, result.test_mode))
                        if rank == 1:
                            medal = " 👑"
                        elif rank == 2:
                            medal = " 🥈"
                        elif rank == 3:
                            medal = " 🥉"
                        else:
                            medal = ""
                        
                        library_display = f"{result.library}{medal}" if medal else result.library
                        f.write(
                            f"| {library_display} | {result.test_name} | "
                            f"{result.import_time_ms:.2f} | {result.relative_time:.2f}x | "
                            f"{result.memory_peak_mb:.2f} | {result.package_size_mb:.2f} | "
                            f"{'✅' if result.success else '❌'} |\n"
                        )

                # Detailed results for this mode
                f.write("\n### Detailed Results\n\n")
                for library, lib_results in sorted(by_library.items()):
                    # Check if library has any top 3 rankings
                    has_any_medal = any(rankings.get((library, r.test_name, r.test_mode)) in [1, 2, 3] for r in lib_results)
                    if has_any_medal:
                        # Get the best ranking for this library
                        best_rank = min((rankings.get((library, r.test_name, r.test_mode)) or 999 for r in lib_results), default=999)
                        if best_rank == 1:
                            medal = " 👑"
                        elif best_rank == 2:
                            medal = " 🥈"
                        elif best_rank == 3:
                            medal = " 🥉"
                        else:
                            medal = ""
                        library_display = f"{library}{medal}"
                    else:
                        library_display = library
                    f.write(f"#### {library_display}\n\n")
                    for result in lib_results:
                        # Add medal emoji to test name based on ranking
                        rank = rankings.get((result.library, result.test_name, result.test_mode))
                        if rank == 1:
                            medal = " 👑"
                        elif rank == 2:
                            medal = " 🥈"
                        elif rank == 3:
                            medal = " 🥉"
                        else:
                            medal = ""
                        test_display = f"{result.test_name}{medal}" if medal else result.test_name
                        f.write(f"**Test:** {test_display}\n\n")
                        if result.success:
                            f.write(f"- Import Time: {result.import_time_ms:.2f} ms\n")
                            f.write(f"- Relative Time: {result.relative_time:.2f}x (vs baseline)\n")
                            f.write(f"- Memory Peak: {result.memory_peak_mb:.2f} MB\n")
                            f.write(f"- Memory Avg: {result.memory_avg_mb:.2f} MB\n")
                            f.write(f"- Package Size: {result.package_size_mb:.2f} MB\n")
                            if result.features_supported:
                                f.write(f"- Features: {', '.join(result.features_supported)}\n")
                        else:
                            f.write(f"- ❌ Error: {result.error}\n")
                        f.write("\n")
                
                f.write("\n")  # Add spacing between modes

        print(f"📊 Report saved to: {report_path}")


def main():
    parser = argparse.ArgumentParser(description="Benchmark lazy import libraries")
    parser.add_argument(
        "--library",
        choices=list(LIBRARIES.keys()) + ["all"],
        default="all",
        help="Library to test (default: all)",
    )
    parser.add_argument(
        "--test",
        choices=["light_load", "medium_load", "heavy_load", "enterprise_load", "all"],
        default="all",
        help="Test to run (default: all)",
    )
    parser.add_argument(
        "--skip-uninstall",
        action="store_true",
        help="Skip uninstall step (for debugging)",
    )
    parser.add_argument(
        "--mode",
        choices=list(TEST_MODES.keys()) + ["all"],
        default="all",
        help="Test mode to run (default: all). Modes: lazy_import_only (fair comparison), lazy_import_install, lazy_import_discovery, lazy_import_monitoring, full_features",
    )

    args = parser.parse_args()

    runner = BenchmarkRunner()

    # Get baseline once for all libraries (ensures fair comparison)
    print("\n" + "="*80)
    print("Establishing baseline for relative time measurements...")
    print("="*80)
    baseline_time = runner._get_baseline_time()
    print(f"Baseline time: {baseline_time:.2f} ms (standard library import)")
    print("All times will be relative to this baseline.\n")

    all_results = []

    libraries_to_test = list(LIBRARIES.keys()) if args.library == "all" else [args.library]
    test_modes_to_run = list(TEST_MODES.keys()) if args.mode == "all" else [args.mode]

    # Run benchmarks for each test mode
    for test_mode in test_modes_to_run:
        if test_mode in TEST_MODES:
            mode_info = TEST_MODES[test_mode]
            print(f"\n{'='*80}")
            print(f"Test Mode: {mode_info['category']}")
            print(f"Description: {mode_info['description']}")
            print(f"{'='*80}\n")

        for library_name in libraries_to_test:
            # For non-xwlazy libraries, only run in lazy_import_only mode
            # (other modes are xwlazy-specific)
            if library_name != "xwlazy" and test_mode != "lazy_import_only":
                continue
            
            results = runner.run_benchmark(
                library_name, 
                args.test if args.test != "all" else None,
                baseline_time=baseline_time,
                skip_uninstall=args.skip_uninstall,
                test_mode=test_mode
            )
            all_results.extend(results)

    # Save results
    runner.save_results(all_results)
    runner.generate_report(all_results)

    print(f"\n✅ Benchmark complete! Tested {len(libraries_to_test)} libraries across {len(test_modes_to_run)} test mode(s).")


if __name__ == "__main__":
    main()
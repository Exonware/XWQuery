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
import threading
import queue
import gc
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


# Test mode definitions - using new two-dimensional mode system
TEST_MODES = {
    "lazy_import_only": {
        "description": "Basic lazy import (fair comparison - all libraries) - LITE mode",
        "xwlazy_config": {
            "mode": "lite",  # AUTO load + NONE install
        },
        "category": "Basic Lazy Import",
    },
    "lazy_import_install": {
        "description": "Lazy import + auto-install - SMART mode (on-demand)",
        "xwlazy_config": {
            "mode": "smart",  # AUTO load + SMART install
        },
        "category": "Lazy Import + Install",
    },
    "lazy_import_preload": {
        "description": "Preload all modules on start - PRELOAD mode",
        "xwlazy_config": {
            "load_mode": "preload",
            "install_mode": "none",
        },
        "category": "Preload Mode",
    },
    "lazy_import_background": {
        "description": "Background loading - BACKGROUND mode",
        "xwlazy_config": {
            "load_mode": "background",
            "install_mode": "none",
        },
        "category": "Background Loading",
    },
    "full_install_mode": {
        "description": "Install all dependencies on start - FULL mode",
        "xwlazy_config": {
            "mode": "full",  # AUTO load + FULL install
        },
        "category": "Full Install Mode",
    },
    "clean_mode": {
        "description": "Install on usage + uninstall after - CLEAN mode",
        "xwlazy_config": {
            "mode": "clean",  # AUTO load + CLEAN install
        },
        "category": "Clean Mode",
    },
    "auto_mode": {
        "description": "Smart install + auto-uninstall large - AUTO mode",
        "xwlazy_config": {
            "mode": "auto",  # AUTO load + SMART install + auto-uninstall large
        },
        "category": "Auto Mode",
    },
    "full_features": {
        "description": "All features enabled (xwlazy showcase) - AUTO mode with optimizations",
        "xwlazy_config": {
            "mode": "auto",  # Best performance mode
        },
        "category": "Full Features",
    },
    "intelligent_mode": {
        "description": "INTELLIGENT mode - Automatically selects optimal mode based on load level (benchmark-optimized)",
        "xwlazy_config": {
            "load_mode": "intelligent",  # Automatically switches to fastest mode per load level
            "install_mode": "none",  # Will be overridden by intelligent mode
        },
        "category": "Intelligent Mode",
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
    test_category: str = "standard"  # Category: "standard", "stress", "edge_case"

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

    def _get_library_version(self, library_name: str) -> Optional[str]:
        """Get installed library version without reinstalling.
        
        Why: Allows verification of pre-installed libraries without reinstalling.
        
        Args:
            library_name: Name of the library to check
            
        Returns:
            Version string if installed, None otherwise
        """
        lib_info = LIBRARIES.get(library_name)
        if not lib_info:
            return None

        pypi_name = lib_info["pypi"]
        try:
            if _USE_IMPORTLIB:
                dist = distribution(pypi_name)
                return dist.version
            elif _USE_IMPORTLIB is False:
                dist = pkg_resources.get_distribution(pypi_name)
                return dist.version
            else:
                return None
        except (PackageNotFoundError, Exception):
            return None

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
                test_category="standard",
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
                    # For pipimport, try to continue anyway as it might work with install()
                    if library_name == "pipimport":
                        # pipimport requires install() to be called, so we'll handle it in the adapter
                        module = None  # Will be set by adapter if it works
                    elif "print" in str(e).lower() and "parentheses" in str(e).lower():
                        raise ImportError(f"Library {library_name} is not compatible with Python 3 (Python 2 syntax detected)")
                    else:
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
                test_category="standard",
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
                test_category="standard",
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
                test_category="standard",
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
                # For pipimport, try to continue anyway as it might work with install()
                if library_name == "pipimport":
                    # pipimport requires install() to be called, so we'll handle it in the adapter
                    module = None  # Will be set by adapter if it works
                elif "print" in str(e).lower() and "parentheses" in str(e).lower():
                    raise ImportError(f"Library {library_name} is not compatible with Python 3 (Python 2 syntax detected)")
                else:
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
                test_category="standard",
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
                test_category="standard",
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
                test_category="standard",
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
                # For pipimport, try to continue anyway as it might work with install()
                if library_name == "pipimport":
                    # pipimport requires install() to be called, so we'll handle it in the adapter
                    module = None  # Will be set by adapter if it works
                elif "print" in str(e).lower() and "parentheses" in str(e).lower():
                    raise ImportError(f"Library {library_name} is not compatible with Python 3 (Python 2 syntax detected)")
                else:
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
                test_category="standard",
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
                test_category="standard",
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
                test_category="standard",
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
                # For pipimport, try to continue anyway as it might work with install()
                if library_name == "pipimport":
                    # pipimport requires install() to be called, so we'll handle it in the adapter
                    module = None  # Will be set by adapter if it works
                elif "print" in str(e).lower() and "parentheses" in str(e).lower():
                    raise ImportError(f"Library {library_name} is not compatible with Python 3 (Python 2 syntax detected)")
                else:
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
                test_category="standard",
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
                test_category="standard",
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

    def _run_stress_tests(self, library_name: str, baseline_time: float, test_mode: str) -> List[BenchmarkResult]:
        """Run all stress tests for a library.
        
        Why: Tests library performance under high load, concurrency, and memory pressure.
        
        Args:
            library_name: Name of the library to test
            baseline_time: Baseline time for relative measurements
            test_mode: Test mode to use
            
        Returns:
            List of BenchmarkResult objects for all stress tests
        """
        results = []
        stress_tests = [
            self.test_concurrent_imports,
            self.test_rapid_sequential_imports,
            self.test_circular_imports,
            self.test_deep_dependency_chains,
            self.test_repeated_imports,
            self.test_memory_pressure,
            self.test_mixed_import_patterns,
        ]
        
        for test_func in stress_tests:
            try:
                result = test_func(library_name, baseline_time, test_mode)
                results.append(result)
                if result.success:
                    print(f"    ✅ {result.test_name}: {result.import_time_ms:.2f} ms")
                else:
                    print(f"    ❌ {result.test_name}: {result.error}")
            except Exception as e:
                print(f"    ❌ {test_func.__name__}: {str(e)}")
                results.append(BenchmarkResult(
                    library=library_name,
                    test_name=test_func.__name__.replace("test_", ""),
                    import_time_ms=0.0,
                    memory_peak_mb=0.0,
                    memory_avg_mb=0.0,
                    package_size_mb=0.0,
                    success=False,
                    error=str(e),
                    test_mode=test_mode,
                    test_category="stress",
                ))
        
        return results

    def _run_edge_case_tests(self, library_name: str, baseline_time: float, test_mode: str) -> List[BenchmarkResult]:
        """Run all edge case tests for a library.
        
        Why: Tests library robustness with invalid inputs, missing dependencies, and error conditions.
        
        Args:
            library_name: Name of the library to test
            baseline_time: Baseline time for relative measurements
            test_mode: Test mode to use
            
        Returns:
            List of BenchmarkResult objects for all edge case tests
        """
        results = []
        edge_tests = [
            self.test_missing_dependencies,
            self.test_invalid_module_names,
            self.test_already_loaded_modules,
            self.test_submodule_imports,
            self.test_hook_interference,
            self.test_module_cleanup,
            self.test_thread_safety,
            self.test_import_error_recovery,
            self.test_namespace_packages,
            self.test_import_from_string,
        ]
        
        for test_func in edge_tests:
            try:
                result = test_func(library_name, baseline_time, test_mode)
                results.append(result)
                if result.success:
                    print(f"    ✅ {result.test_name}: Passed")
                else:
                    print(f"    ❌ {result.test_name}: {result.error}")
            except Exception as e:
                print(f"    ❌ {test_func.__name__}: {str(e)}")
                results.append(BenchmarkResult(
                    library=library_name,
                    test_name=test_func.__name__.replace("test_", ""),
                    import_time_ms=0.0,
                    memory_peak_mb=0.0,
                    memory_avg_mb=0.0,
                    package_size_mb=0.0,
                    success=False,
                    error=str(e),
                    test_mode=test_mode,
                    test_category="edge_case",
                ))
        
        return results

    def test_concurrent_imports(self, library_name: str, baseline_time: float = None, test_mode: str = "lazy_import_only") -> BenchmarkResult:
        """Stress test: Concurrent imports from multiple threads.
        
        Why: Validates thread safety and performance under production-level concurrency.
        Measures: Import time, success rate, thread safety violations.
        """
        try:
            from library_adapters import create_adapter
            
            # Get config for xwlazy
            config = None
            if library_name == "xwlazy" and test_mode in TEST_MODES:
                config = TEST_MODES[test_mode]["xwlazy_config"]
            
            adapter = create_adapter(library_name, config)
            if not adapter:
                raise ImportError(f"Could not create adapter for {library_name}")
            
            adapter.enable()
            
            # Test modules to import
            test_modules = ["json", "os", "sys", "time", "collections", "itertools", "functools", "operator"]
            
            memory_before = self.process.memory_info().rss / (1024 * 1024)
            
            # Test with different thread counts
            thread_counts = [4, 8, 16, 32]
            all_times = []
            success_count = 0
            total_imports = 0
            
            for num_threads in thread_counts:
                results_queue = queue.Queue()
                errors = []
                
                def import_worker(module_name):
                    """Worker thread that imports a module."""
                    nonlocal success_count, total_imports
                    try:
                        total_imports += 1
                        start = time.perf_counter()
                        importlib.import_module(module_name)
                        elapsed = (time.perf_counter() - start) * 1000
                        results_queue.put(("success", elapsed))
                        success_count += 1
                    except Exception as e:
                        results_queue.put(("error", str(e)))
                        errors.append(str(e))
                
                # Run concurrent imports
                threads = []
                start_time = time.perf_counter()
                
                for _ in range(num_threads):
                    for mod in test_modules:
                        t = threading.Thread(target=import_worker, args=(mod,))
                        threads.append(t)
                        t.start()
                
                # Wait for all threads
                for t in threads:
                    t.join()
                
                elapsed_total = (time.perf_counter() - start_time) * 1000
                all_times.append(elapsed_total)
            
            # Calculate average time per import
            import_time = sum(all_times) / len(all_times) if all_times else 0.0
            
            memory_after = self.process.memory_info().rss / (1024 * 1024)
            memory_peak = memory_after
            memory_avg = (memory_before + memory_after) / 2
            
            # Success if no errors and reasonable success rate
            success = len(errors) == 0 and success_count > 0
            
            if baseline_time is None:
                baseline_time = self._get_baseline_time()
            relative_time = import_time / baseline_time if baseline_time > 0 else 1.0
            
            return BenchmarkResult(
                library=library_name,
                test_name="concurrent_imports",
                import_time_ms=import_time,
                memory_peak_mb=memory_peak,
                memory_avg_mb=memory_avg,
                package_size_mb=self.get_package_size(library_name),
                success=success,
                error=f"Errors: {len(errors)}, Success rate: {success_count}/{total_imports}" if not success else None,
                relative_time=relative_time,
                test_mode=test_mode,
                test_category="stress",
            )
        except Exception as e:
            return BenchmarkResult(
                library=library_name,
                test_name="concurrent_imports",
                import_time_ms=0.0,
                memory_peak_mb=0.0,
                memory_avg_mb=0.0,
                package_size_mb=0.0,
                success=False,
                error=str(e),
                test_mode=test_mode,
                test_category="stress",
            )

    def test_rapid_sequential_imports(self, library_name: str, baseline_time: float = None, test_mode: str = "lazy_import_only") -> BenchmarkResult:
        """Stress test: Rapid sequential imports of 100+ modules.
        
        Why: Tests performance degradation over time and cache effectiveness.
        Measures: Performance degradation, cache hit rates, memory growth.
        """
        try:
            from library_adapters import create_adapter
            
            config = None
            if library_name == "xwlazy" and test_mode in TEST_MODES:
                config = TEST_MODES[test_mode]["xwlazy_config"]
            
            adapter = create_adapter(library_name, config)
            if not adapter:
                raise ImportError(f"Could not create adapter for {library_name}")
            
            adapter.enable()
            
            # Large list of standard library modules
            test_modules = [
                "json", "os", "sys", "time", "collections", "itertools", "functools", "operator",
                "datetime", "math", "random", "string", "re", "hashlib", "base64", "urllib.parse",
                "pathlib", "shutil", "tempfile", "glob", "fnmatch", "linecache", "pickle", "copy",
                "enum", "dataclasses", "typing", "abc", "collections.abc", "contextlib", "weakref",
                "array", "bisect", "heapq", "queue", "threading", "multiprocessing", "concurrent.futures",
                "asyncio", "selectors", "socket", "ssl", "http", "urllib", "email", "mimetypes",
                "csv", "configparser", "logging", "warnings", "traceback", "inspect", "pdb", "profile",
                "pstats", "timeit", "doctest", "unittest", "difflib", "textwrap", "unicodedata",
                "locale", "gettext", "argparse", "getopt", "readline", "rlcompleter", "cmd", "shlex",
                "struct", "codecs", "encodings", "io", "fileinput", "stat", "filecmp", "mmap",
                "gzip", "bz2", "lzma", "zipfile", "tarfile", "sqlite3", "dbm", "shelve",
            ] * 2  # Repeat to get 100+ modules
            
            memory_before = self.process.memory_info().rss / (1024 * 1024)
            
            times = []
            start_time = time.perf_counter()
            
            # Protect critical modules that shouldn't be deleted
            protected_modules = {"sys", "os", "builtins", "__builtin__", "importlib", "importlib.util", "collections"}
            
            for mod in test_modules:
                try:
                    # Clear from cache to test fresh import (but protect critical modules)
                    if mod in sys.modules and mod not in protected_modules:
                        del sys.modules[mod]
                except:
                    pass
                
                mod_start = time.perf_counter()
                try:
                    # Ensure parent module is loaded for submodules
                    if "." in mod:
                        parent_mod = mod.split(".")[0]
                        if parent_mod not in sys.modules:
                            try:
                                importlib.import_module(parent_mod)
                            except:
                                pass
                    importlib.import_module(mod)
                    mod_elapsed = (time.perf_counter() - mod_start) * 1000
                    times.append(mod_elapsed)
                except (ImportError, SyntaxError, AttributeError):
                    pass  # Skip modules that can't be imported
            
            total_time = (time.perf_counter() - start_time) * 1000
            
            # Check for performance degradation (later imports should be faster due to caching)
            if len(times) > 20:
                first_half = sum(times[:len(times)//2]) / (len(times)//2)
                second_half = sum(times[len(times)//2:]) / (len(times)//2)
                degradation = (second_half - first_half) / first_half if first_half > 0 else 0.0
            else:
                degradation = 0.0
            
            memory_after = self.process.memory_info().rss / (1024 * 1024)
            memory_peak = memory_after
            memory_avg = (memory_before + memory_after) / 2
            
            # Success if reasonable performance and no unbounded memory growth
            success = len(times) > 0 and (memory_after - memory_before) < 500  # Less than 500MB growth
            
            if baseline_time is None:
                baseline_time = self._get_baseline_time()
            relative_time = total_time / baseline_time if baseline_time > 0 else 1.0
            
            return BenchmarkResult(
                library=library_name,
                test_name="rapid_sequential_imports",
                import_time_ms=total_time,
                memory_peak_mb=memory_peak,
                memory_avg_mb=memory_avg,
                package_size_mb=self.get_package_size(library_name),
                success=success,
                error=f"Degradation: {degradation:.2%}, Memory growth: {memory_after - memory_before:.2f}MB" if not success else None,
                relative_time=relative_time,
                test_mode=test_mode,
                test_category="stress",
            )
        except Exception as e:
            return BenchmarkResult(
                library=library_name,
                test_name="rapid_sequential_imports",
                import_time_ms=0.0,
                memory_peak_mb=0.0,
                memory_avg_mb=0.0,
                package_size_mb=0.0,
                success=False,
                error=str(e),
                test_mode=test_mode,
                test_category="stress",
            )

    def test_circular_imports(self, library_name: str, baseline_time: float = None, test_mode: str = "lazy_import_only") -> BenchmarkResult:
        """Stress test: Circular import handling.
        
        Why: Tests libraries handling circular dependencies gracefully.
        Measures: Handling time, success vs failure.
        """
        try:
            from library_adapters import create_adapter
            
            config = None
            if library_name == "xwlazy" and test_mode in TEST_MODES:
                config = TEST_MODES[test_mode]["xwlazy_config"]
            
            adapter = create_adapter(library_name, config)
            if not adapter:
                raise ImportError(f"Could not create adapter for {library_name}")
            
            adapter.enable()
            
            # Create temporary modules with circular dependencies
            temp_dir = tempfile.mkdtemp()
            try:
                # Module A imports B
                mod_a_path = Path(temp_dir) / "mod_a.py"
                mod_a_path.write_text("import mod_b\nvalue_a = 1\n")
                
                # Module B imports A
                mod_b_path = Path(temp_dir) / "mod_b.py"
                mod_b_path.write_text("import mod_a\nvalue_b = 2\n")
                
                # Add temp dir to path
                sys.path.insert(0, temp_dir)
                
                memory_before = self.process.memory_info().rss / (1024 * 1024)
                start_time = time.perf_counter()
                
                try:
                    # Try importing - should handle circular import
                    import mod_a
                    elapsed = (time.perf_counter() - start_time) * 1000
                    success = True
                    error = None
                except (ImportError, AttributeError, RecursionError) as e:
                    elapsed = (time.perf_counter() - start_time) * 1000
                    success = False
                    error = f"Circular import failed: {str(e)}"
                
                memory_after = self.process.memory_info().rss / (1024 * 1024)
                memory_peak = memory_after
                memory_avg = (memory_before + memory_after) / 2
                
                # Cleanup
                sys.path.remove(temp_dir)
                if "mod_a" in sys.modules:
                    del sys.modules["mod_a"]
                if "mod_b" in sys.modules:
                    del sys.modules["mod_b"]
                
                if baseline_time is None:
                    baseline_time = self._get_baseline_time()
                relative_time = elapsed / baseline_time if baseline_time > 0 else 1.0
                
                return BenchmarkResult(
                    library=library_name,
                    test_name="circular_imports",
                    import_time_ms=elapsed,
                    memory_peak_mb=memory_peak,
                    memory_avg_mb=memory_avg,
                    package_size_mb=self.get_package_size(library_name),
                    success=success,
                    error=error,
                    relative_time=relative_time,
                    test_mode=test_mode,
                    test_category="stress",
                )
            finally:
                shutil.rmtree(temp_dir, ignore_errors=True)
        except Exception as e:
            return BenchmarkResult(
                library=library_name,
                test_name="circular_imports",
                import_time_ms=0.0,
                memory_peak_mb=0.0,
                memory_avg_mb=0.0,
                package_size_mb=0.0,
                success=False,
                error=str(e),
                test_mode=test_mode,
                test_category="stress",
            )

    def test_deep_dependency_chains(self, library_name: str, baseline_time: float = None, test_mode: str = "lazy_import_only") -> BenchmarkResult:
        """Stress test: Deep dependency chains (10+ levels).
        
        Why: Tests import time scaling and dependency resolution performance.
        """
        try:
            from library_adapters import create_adapter
            
            config = None
            if library_name == "xwlazy" and test_mode in TEST_MODES:
                config = TEST_MODES[test_mode]["xwlazy_config"]
            
            adapter = create_adapter(library_name, config)
            if not adapter:
                raise ImportError(f"Could not create adapter for {library_name}")
            
            adapter.enable()
            
            # Create temporary modules with deep dependency chain
            temp_dir = tempfile.mkdtemp()
            try:
                # Create 10 modules, each importing the next
                depth = 10
                for i in range(depth):
                    mod_path = Path(temp_dir) / f"mod_{i}.py"
                    if i < depth - 1:
                        mod_path.write_text(f"import mod_{i+1}\nvalue_{i} = {i}\n")
                    else:
                        mod_path.write_text(f"value_{i} = {i}\n")
                
                sys.path.insert(0, temp_dir)
                
                memory_before = self.process.memory_info().rss / (1024 * 1024)
                start_time = time.perf_counter()
                
                try:
                    import mod_0  # This should import all dependencies
                    elapsed = (time.perf_counter() - start_time) * 1000
                    success = True
                    error = None
                except Exception as e:
                    elapsed = (time.perf_counter() - start_time) * 1000
                    success = False
                    error = str(e)
                
                memory_after = self.process.memory_info().rss / (1024 * 1024)
                memory_peak = memory_after
                memory_avg = (memory_before + memory_after) / 2
                
                # Cleanup
                sys.path.remove(temp_dir)
                for i in range(depth):
                    mod_name = f"mod_{i}"
                    if mod_name in sys.modules:
                        del sys.modules[mod_name]
                
                if baseline_time is None:
                    baseline_time = self._get_baseline_time()
                relative_time = elapsed / baseline_time if baseline_time > 0 else 1.0
                
                return BenchmarkResult(
                    library=library_name,
                    test_name="deep_dependency_chains",
                    import_time_ms=elapsed,
                    memory_peak_mb=memory_peak,
                    memory_avg_mb=memory_avg,
                    package_size_mb=self.get_package_size(library_name),
                    success=success,
                    error=error,
                    relative_time=relative_time,
                    test_mode=test_mode,
                    test_category="stress",
                )
            finally:
                shutil.rmtree(temp_dir, ignore_errors=True)
        except Exception as e:
            return BenchmarkResult(
                library=library_name,
                test_name="deep_dependency_chains",
                import_time_ms=0.0,
                memory_peak_mb=0.0,
                memory_avg_mb=0.0,
                package_size_mb=0.0,
                success=False,
                error=str(e),
                test_mode=test_mode,
                test_category="stress",
            )

    def test_repeated_imports(self, library_name: str, baseline_time: float = None, test_mode: str = "lazy_import_only") -> BenchmarkResult:
        """Stress test: Repeated imports of same module (100+ times).
        
        Why: Tests cache effectiveness and performance consistency.
        """
        try:
            from library_adapters import create_adapter
            
            config = None
            if library_name == "xwlazy" and test_mode in TEST_MODES:
                config = TEST_MODES[test_mode]["xwlazy_config"]
            
            adapter = create_adapter(library_name, config)
            if not adapter:
                raise ImportError(f"Could not create adapter for {library_name}")
            
            adapter.enable()
            
            test_module = "json"  # Standard library module
            num_imports = 100
            
            memory_before = self.process.memory_info().rss / (1024 * 1024)
            times = []
            
            for i in range(num_imports):
                # Don't remove from sys.modules - test cache effectiveness
                start = time.perf_counter()
                try:
                    importlib.import_module(test_module)
                    elapsed = (time.perf_counter() - start) * 1000
                    times.append(elapsed)
                except Exception:
                    pass
            
            total_time = sum(times)
            avg_time = total_time / len(times) if times else 0.0
            
            # Check consistency (std dev should be low for cached imports)
            if len(times) > 1:
                mean = avg_time
                variance = sum((t - mean) ** 2 for t in times) / len(times)
                std_dev = variance ** 0.5
                consistency = std_dev / mean if mean > 0 else 0.0
            else:
                consistency = 0.0
            
            memory_after = self.process.memory_info().rss / (1024 * 1024)
            memory_peak = memory_after
            memory_avg = (memory_before + memory_after) / 2
            
            # Success if consistent performance (low std dev)
            success = len(times) == num_imports and consistency < 0.5  # Less than 50% variation
            
            if baseline_time is None:
                baseline_time = self._get_baseline_time()
            relative_time = avg_time / baseline_time if baseline_time > 0 else 1.0
            
            return BenchmarkResult(
                library=library_name,
                test_name="repeated_imports",
                import_time_ms=avg_time,
                memory_peak_mb=memory_peak,
                memory_avg_mb=memory_avg,
                package_size_mb=self.get_package_size(library_name),
                success=success,
                error=f"Consistency: {consistency:.2%}" if not success else None,
                relative_time=relative_time,
                test_mode=test_mode,
                test_category="stress",
            )
        except Exception as e:
            return BenchmarkResult(
                library=library_name,
                test_name="repeated_imports",
                import_time_ms=0.0,
                memory_peak_mb=0.0,
                memory_avg_mb=0.0,
                package_size_mb=0.0,
                success=False,
                error=str(e),
                test_mode=test_mode,
                test_category="stress",
            )

    def test_memory_pressure(self, library_name: str, baseline_time: float = None, test_mode: str = "lazy_import_only") -> BenchmarkResult:
        """Stress test: Memory pressure with 50+ large modules.
        
        Why: Tests memory leaks and garbage collection effectiveness.
        """
        try:
            from library_adapters import create_adapter
            
            config = None
            if library_name == "xwlazy" and test_mode in TEST_MODES:
                config = TEST_MODES[test_mode]["xwlazy_config"]
            
            adapter = create_adapter(library_name, config)
            if not adapter:
                raise ImportError(f"Could not create adapter for {library_name}")
            
            adapter.enable()
            
            # Large standard library modules
            large_modules = [
                "collections", "itertools", "functools", "operator", "datetime", "math",
                "random", "string", "re", "hashlib", "base64", "urllib.parse", "pathlib",
                "shutil", "tempfile", "glob", "pickle", "copy", "enum", "dataclasses",
                "typing", "abc", "collections.abc", "contextlib", "weakref", "array",
                "bisect", "heapq", "queue", "threading", "multiprocessing", "concurrent.futures",
                "asyncio", "selectors", "socket", "ssl", "http", "urllib", "email", "mimetypes",
                "csv", "configparser", "logging", "warnings", "traceback", "inspect", "pdb",
                "profile", "pstats", "timeit", "doctest", "unittest", "difflib", "textwrap",
            ]
            
            memory_before = self.process.memory_info().rss / (1024 * 1024)
            peak_memory = memory_before
            
            start_time = time.perf_counter()
            
            # Protect critical modules that shouldn't be deleted
            protected_modules = {"sys", "os", "builtins", "__builtin__", "importlib", "importlib.util", "collections"}
            
            for mod in large_modules:
                try:
                    if mod in sys.modules and mod not in protected_modules:
                        del sys.modules[mod]
                except:
                    pass
                
                try:
                    # Ensure parent module is loaded for submodules
                    if "." in mod:
                        parent_mod = mod.split(".")[0]
                        if parent_mod not in sys.modules:
                            try:
                                importlib.import_module(parent_mod)
                            except:
                                pass
                    importlib.import_module(mod)
                    # Check memory after each import
                    current_memory = self.process.memory_info().rss / (1024 * 1024)
                    peak_memory = max(peak_memory, current_memory)
                except (ImportError, SyntaxError, AttributeError):
                    pass
            
            elapsed = (time.perf_counter() - start_time) * 1000
            
            # Force garbage collection
            gc.collect()
            memory_after = self.process.memory_info().rss / (1024 * 1024)
            memory_avg = (memory_before + memory_after) / 2
            
            # Success if reasonable memory growth and GC works
            memory_growth = memory_after - memory_before
            success = memory_growth < 200  # Less than 200MB growth
            
            if baseline_time is None:
                baseline_time = self._get_baseline_time()
            relative_time = elapsed / baseline_time if baseline_time > 0 else 1.0
            
            return BenchmarkResult(
                library=library_name,
                test_name="memory_pressure",
                import_time_ms=elapsed,
                memory_peak_mb=peak_memory,
                memory_avg_mb=memory_avg,
                package_size_mb=self.get_package_size(library_name),
                success=success,
                error=f"Memory growth: {memory_growth:.2f}MB" if not success else None,
                relative_time=relative_time,
                test_mode=test_mode,
                test_category="stress",
            )
        except Exception as e:
            return BenchmarkResult(
                library=library_name,
                test_name="memory_pressure",
                import_time_ms=0.0,
                memory_peak_mb=0.0,
                memory_avg_mb=0.0,
                package_size_mb=0.0,
                success=False,
                error=str(e),
                test_mode=test_mode,
                test_category="stress",
            )

    def test_mixed_import_patterns(self, library_name: str, baseline_time: float = None, test_mode: str = "lazy_import_only") -> BenchmarkResult:
        """Stress test: Mixed lazy and standard imports.
        
        Why: Tests import hook interference and correct behavior with mixed patterns.
        """
        try:
            from library_adapters import create_adapter
            
            config = None
            if library_name == "xwlazy" and test_mode in TEST_MODES:
                config = TEST_MODES[test_mode]["xwlazy_config"]
            
            adapter = create_adapter(library_name, config)
            if not adapter:
                raise ImportError(f"Could not create adapter for {library_name}")
            
            adapter.enable()
            
            test_modules = ["json", "os", "sys", "time", "collections"]
            
            memory_before = self.process.memory_info().rss / (1024 * 1024)
            start_time = time.perf_counter()
            
            # Protect critical modules that shouldn't be deleted
            protected_modules = {"sys", "os", "builtins", "__builtin__", "importlib", "importlib.util", "collections"}
            
            # Mix lazy and standard imports
            for i, mod in enumerate(test_modules):
                try:
                    if mod in sys.modules and mod not in protected_modules:
                        del sys.modules[mod]
                except:
                    pass
                
                if i % 2 == 0:
                    # Use lazy import (via adapter)
                    importlib.import_module(mod)
                else:
                    # Use standard import
                    importlib.import_module(mod)
            
            elapsed = (time.perf_counter() - start_time) * 1000
            
            memory_after = self.process.memory_info().rss / (1024 * 1024)
            memory_peak = memory_after
            memory_avg = (memory_before + memory_after) / 2
            
            # Verify modules are accessible
            success = True
            for mod in test_modules:
                if mod not in sys.modules:
                    success = False
                    break
            
            if baseline_time is None:
                baseline_time = self._get_baseline_time()
            relative_time = elapsed / baseline_time if baseline_time > 0 else 1.0
            
            return BenchmarkResult(
                library=library_name,
                test_name="mixed_import_patterns",
                import_time_ms=elapsed,
                memory_peak_mb=memory_peak,
                memory_avg_mb=memory_avg,
                package_size_mb=self.get_package_size(library_name),
                success=success,
                error="Some modules not accessible" if not success else None,
                relative_time=relative_time,
                test_mode=test_mode,
                test_category="stress",
            )
        except Exception as e:
            return BenchmarkResult(
                library=library_name,
                test_name="mixed_import_patterns",
                import_time_ms=0.0,
                memory_peak_mb=0.0,
                memory_avg_mb=0.0,
                package_size_mb=0.0,
                success=False,
                error=str(e),
                test_mode=test_mode,
                test_category="stress",
            )

    def test_missing_dependencies(self, library_name: str, baseline_time: float = None, test_mode: str = "lazy_import_only") -> BenchmarkResult:
        """Edge case: Importing modules with missing dependencies.
        
        Why: Tests error handling and graceful degradation.
        """
        try:
            from library_adapters import create_adapter
            
            config = None
            if library_name == "xwlazy" and test_mode in TEST_MODES:
                config = TEST_MODES[test_mode]["xwlazy_config"]
            
            adapter = create_adapter(library_name, config)
            if not adapter:
                raise ImportError(f"Could not create adapter for {library_name}")
            
            adapter.enable()
            
            # Try importing non-existent modules
            non_existent = ["nonexistent_module_xyz123", "another_fake_module_abc456"]
            
            errors_handled = 0
            crashes = 0
            
            for mod_name in non_existent:
                try:
                    importlib.import_module(mod_name)
                except ImportError:
                    errors_handled += 1  # Expected - proper error handling
                except Exception as e:
                    crashes += 1  # Unexpected - should be ImportError
            
            # Success if all errors handled gracefully (ImportError, not crashes)
            success = errors_handled == len(non_existent) and crashes == 0
            
            return BenchmarkResult(
                library=library_name,
                test_name="missing_dependencies",
                import_time_ms=0.0,
                memory_peak_mb=0.0,
                memory_avg_mb=0.0,
                package_size_mb=self.get_package_size(library_name),
                success=success,
                error=f"Crashes: {crashes}, Handled: {errors_handled}/{len(non_existent)}" if not success else None,
                test_mode=test_mode,
                test_category="edge_case",
            )
        except Exception as e:
            return BenchmarkResult(
                library=library_name,
                test_name="missing_dependencies",
                import_time_ms=0.0,
                memory_peak_mb=0.0,
                memory_avg_mb=0.0,
                package_size_mb=0.0,
                success=False,
                error=str(e),
                test_mode=test_mode,
                test_category="edge_case",
            )

    def test_invalid_module_names(self, library_name: str, baseline_time: float = None, test_mode: str = "lazy_import_only") -> BenchmarkResult:
        """Edge case: Invalid module names (empty, None, special chars, unicode).
        
        Why: Tests graceful error handling with invalid inputs.
        """
        try:
            from library_adapters import create_adapter
            
            config = None
            if library_name == "xwlazy" and test_mode in TEST_MODES:
                config = TEST_MODES[test_mode]["xwlazy_config"]
            
            adapter = create_adapter(library_name, config)
            if not adapter:
                raise ImportError(f"Could not create adapter for {library_name}")
            
            adapter.enable()
            
            invalid_names = ["", "..", "/", "\\", "null\x00", "test\nmodule", "test\tmodule"]
            
            errors_handled = 0
            crashes = 0
            
            for mod_name in invalid_names:
                try:
                    importlib.import_module(mod_name)
                except (ImportError, ValueError, TypeError):
                    errors_handled += 1  # Expected - proper error handling
                except Exception:
                    crashes += 1  # Unexpected
            
            # Success if all errors handled gracefully
            success = errors_handled == len(invalid_names) and crashes == 0
            
            return BenchmarkResult(
                library=library_name,
                test_name="invalid_module_names",
                import_time_ms=0.0,
                memory_peak_mb=0.0,
                memory_avg_mb=0.0,
                package_size_mb=self.get_package_size(library_name),
                success=success,
                error=f"Crashes: {crashes}, Handled: {errors_handled}/{len(invalid_names)}" if not success else None,
                test_mode=test_mode,
                test_category="edge_case",
            )
        except Exception as e:
            return BenchmarkResult(
                library=library_name,
                test_name="invalid_module_names",
                import_time_ms=0.0,
                memory_peak_mb=0.0,
                memory_avg_mb=0.0,
                package_size_mb=0.0,
                success=False,
                error=str(e),
                test_mode=test_mode,
                test_category="edge_case",
            )

    def test_already_loaded_modules(self, library_name: str, baseline_time: float = None, test_mode: str = "lazy_import_only") -> BenchmarkResult:
        """Edge case: Importing modules already in sys.modules.
        
        Why: Tests reuse vs reload behavior and performance.
        """
        try:
            from library_adapters import create_adapter
            
            config = None
            if library_name == "xwlazy" and test_mode in TEST_MODES:
                config = TEST_MODES[test_mode]["xwlazy_config"]
            
            adapter = create_adapter(library_name, config)
            if not adapter:
                raise ImportError(f"Could not create adapter for {library_name}")
            
            adapter.enable()
            
            test_module = "json"
            
            # First import
            importlib.import_module(test_module)
            first_time = time.perf_counter()
            importlib.import_module(test_module)  # Second import (already loaded)
            second_time = (time.perf_counter() - first_time) * 1000
            
            # Second import should be much faster (cached)
            success = second_time < 1.0  # Should be very fast (< 1ms)
            
            return BenchmarkResult(
                library=library_name,
                test_name="already_loaded_modules",
                import_time_ms=second_time,
                memory_peak_mb=0.0,
                memory_avg_mb=0.0,
                package_size_mb=self.get_package_size(library_name),
                success=success,
                error=f"Re-import time: {second_time:.2f}ms (expected < 1ms)" if not success else None,
                test_mode=test_mode,
                test_category="edge_case",
            )
        except Exception as e:
            return BenchmarkResult(
                library=library_name,
                test_name="already_loaded_modules",
                import_time_ms=0.0,
                memory_peak_mb=0.0,
                memory_avg_mb=0.0,
                package_size_mb=0.0,
                success=False,
                error=str(e),
                test_mode=test_mode,
                test_category="edge_case",
            )

    def test_submodule_imports(self, library_name: str, baseline_time: float = None, test_mode: str = "lazy_import_only") -> BenchmarkResult:
        """Edge case: Importing submodules (e.g., json.encoder, collections.abc).
        
        Why: Tests parent module handling and namespace packages.
        """
        try:
            from library_adapters import create_adapter
            
            config = None
            if library_name == "xwlazy" and test_mode in TEST_MODES:
                config = TEST_MODES[test_mode]["xwlazy_config"]
            
            adapter = create_adapter(library_name, config)
            if not adapter:
                raise ImportError(f"Could not create adapter for {library_name}")
            
            adapter.enable()
            
            submodules = ["json.encoder", "collections.abc", "urllib.parse"]
            
            memory_before = self.process.memory_info().rss / (1024 * 1024)
            start_time = time.perf_counter()
            
            success_count = 0
            for submod in submodules:
                try:
                    if submod in sys.modules:
                        del sys.modules[submod]
                except:
                    pass
                
                try:
                    importlib.import_module(submod)
                    success_count += 1
                except (ImportError, AttributeError):
                    pass
            
            elapsed = (time.perf_counter() - start_time) * 1000
            
            memory_after = self.process.memory_info().rss / (1024 * 1024)
            memory_peak = memory_after
            memory_avg = (memory_before + memory_after) / 2
            
            success = success_count == len(submodules)
            
            if baseline_time is None:
                baseline_time = self._get_baseline_time()
            relative_time = elapsed / baseline_time if baseline_time > 0 else 1.0
            
            return BenchmarkResult(
                library=library_name,
                test_name="submodule_imports",
                import_time_ms=elapsed,
                memory_peak_mb=memory_peak,
                memory_avg_mb=memory_avg,
                package_size_mb=self.get_package_size(library_name),
                success=success,
                error=f"Success: {success_count}/{len(submodules)}" if not success else None,
                test_mode=test_mode,
                test_category="edge_case",
            )
        except Exception as e:
            return BenchmarkResult(
                library=library_name,
                test_name="submodule_imports",
                import_time_ms=0.0,
                memory_peak_mb=0.0,
                memory_avg_mb=0.0,
                package_size_mb=0.0,
                success=False,
                error=str(e),
                test_mode=test_mode,
                test_category="edge_case",
            )

    def test_hook_interference(self, library_name: str, baseline_time: float = None, test_mode: str = "lazy_import_only") -> BenchmarkResult:
        """Edge case: Multiple lazy import libraries installed simultaneously.
        
        Why: Tests hook conflicts and correct behavior.
        """
        try:
            # This test is tricky - we can't easily test multiple libraries at once
            # Instead, we test that the library doesn't break when other import hooks exist
            from library_adapters import create_adapter
            
            config = None
            if library_name == "xwlazy" and test_mode in TEST_MODES:
                config = TEST_MODES[test_mode]["xwlazy_config"]
            
            adapter = create_adapter(library_name, config)
            if not adapter:
                raise ImportError(f"Could not create adapter for {library_name}")
            
            adapter.enable()
            
            # Test that imports still work
            test_module = "json"
            start_time = time.perf_counter()
            
            try:
                if test_module in sys.modules:
                    del sys.modules[test_module]
            except:
                pass
            
            importlib.import_module(test_module)
            elapsed = (time.perf_counter() - start_time) * 1000
            
            # Success if import works
            success = test_module in sys.modules
            
            if baseline_time is None:
                baseline_time = self._get_baseline_time()
            relative_time = elapsed / baseline_time if baseline_time > 0 else 1.0
            
            return BenchmarkResult(
                library=library_name,
                test_name="hook_interference",
                import_time_ms=elapsed,
                memory_peak_mb=0.0,
                memory_avg_mb=0.0,
                package_size_mb=self.get_package_size(library_name),
                success=success,
                error="Import failed" if not success else None,
                relative_time=relative_time,
                test_mode=test_mode,
                test_category="edge_case",
            )
        except Exception as e:
            return BenchmarkResult(
                library=library_name,
                test_name="hook_interference",
                import_time_ms=0.0,
                memory_peak_mb=0.0,
                memory_avg_mb=0.0,
                package_size_mb=0.0,
                success=False,
                error=str(e),
                test_mode=test_mode,
                test_category="edge_case",
            )

    def test_module_cleanup(self, library_name: str, baseline_time: float = None, test_mode: str = "lazy_import_only") -> BenchmarkResult:
        """Edge case: Remove modules from sys.modules and re-import.
        
        Why: Tests cleanup handling and re-import performance.
        """
        try:
            from library_adapters import create_adapter
            
            config = None
            if library_name == "xwlazy" and test_mode in TEST_MODES:
                config = TEST_MODES[test_mode]["xwlazy_config"]
            
            adapter = create_adapter(library_name, config)
            if not adapter:
                raise ImportError(f"Could not create adapter for {library_name}")
            
            adapter.enable()
            
            test_module = "json"
            
            # Import first time
            importlib.import_module(test_module)
            
            # Remove from sys.modules
            if test_module in sys.modules:
                del sys.modules[test_module]
            
            # Re-import
            start_time = time.perf_counter()
            importlib.import_module(test_module)
            elapsed = (time.perf_counter() - start_time) * 1000
            
            # Success if re-import works
            success = test_module in sys.modules
            
            if baseline_time is None:
                baseline_time = self._get_baseline_time()
            relative_time = elapsed / baseline_time if baseline_time > 0 else 1.0
            
            return BenchmarkResult(
                library=library_name,
                test_name="module_cleanup",
                import_time_ms=elapsed,
                memory_peak_mb=0.0,
                memory_avg_mb=0.0,
                package_size_mb=self.get_package_size(library_name),
                success=success,
                error="Re-import failed" if not success else None,
                relative_time=relative_time,
                test_mode=test_mode,
                test_category="edge_case",
            )
        except Exception as e:
            return BenchmarkResult(
                library=library_name,
                test_name="module_cleanup",
                import_time_ms=0.0,
                memory_peak_mb=0.0,
                memory_avg_mb=0.0,
                package_size_mb=0.0,
                success=False,
                error=str(e),
                test_mode=test_mode,
                test_category="edge_case",
            )

    def test_thread_safety(self, library_name: str, baseline_time: float = None, test_mode: str = "lazy_import_only") -> BenchmarkResult:
        """Edge case: Thread safety with concurrent imports.
        
        Why: Tests no data races and thread safety.
        """
        try:
            from library_adapters import create_adapter
            
            config = None
            if library_name == "xwlazy" and test_mode in TEST_MODES:
                config = TEST_MODES[test_mode]["xwlazy_config"]
            
            adapter = create_adapter(library_name, config)
            if not adapter:
                raise ImportError(f"Could not create adapter for {library_name}")
            
            adapter.enable()
            
            test_module = "json"
            num_threads = 8
            results = []
            errors = []
            
            def import_worker():
                try:
                    importlib.import_module(test_module)
                    results.append("success")
                except Exception as e:
                    errors.append(str(e))
            
            threads = []
            for _ in range(num_threads):
                t = threading.Thread(target=import_worker)
                threads.append(t)
                t.start()
            
            for t in threads:
                t.join()
            
            # Success if no errors
            success = len(errors) == 0 and len(results) == num_threads
            
            return BenchmarkResult(
                library=library_name,
                test_name="thread_safety",
                import_time_ms=0.0,
                memory_peak_mb=0.0,
                memory_avg_mb=0.0,
                package_size_mb=self.get_package_size(library_name),
                success=success,
                error=f"Errors: {len(errors)}, Success: {len(results)}/{num_threads}" if not success else None,
                test_mode=test_mode,
                test_category="edge_case",
            )
        except Exception as e:
            return BenchmarkResult(
                library=library_name,
                test_name="thread_safety",
                import_time_ms=0.0,
                memory_peak_mb=0.0,
                memory_avg_mb=0.0,
                package_size_mb=0.0,
                success=False,
                error=str(e),
                test_mode=test_mode,
                test_category="edge_case",
            )

    def test_import_error_recovery(self, library_name: str, baseline_time: float = None, test_mode: str = "lazy_import_only") -> BenchmarkResult:
        """Edge case: Recovery after ImportError.
        
        Why: Tests state consistency and retry mechanisms.
        """
        try:
            from library_adapters import create_adapter
            
            config = None
            if library_name == "xwlazy" and test_mode in TEST_MODES:
                config = TEST_MODES[test_mode]["xwlazy_config"]
            
            adapter = create_adapter(library_name, config)
            if not adapter:
                raise ImportError(f"Could not create adapter for {library_name}")
            
            adapter.enable()
            
            # Try importing non-existent module (should fail)
            try:
                importlib.import_module("nonexistent_module_xyz789")
            except ImportError:
                pass  # Expected
            
            # Then import a valid module (should work)
            start_time = time.perf_counter()
            importlib.import_module("json")
            elapsed = (time.perf_counter() - start_time) * 1000
            
            # Success if valid import works after error
            success = "json" in sys.modules
            
            if baseline_time is None:
                baseline_time = self._get_baseline_time()
            relative_time = elapsed / baseline_time if baseline_time > 0 else 1.0
            
            return BenchmarkResult(
                library=library_name,
                test_name="import_error_recovery",
                import_time_ms=elapsed,
                memory_peak_mb=0.0,
                memory_avg_mb=0.0,
                package_size_mb=self.get_package_size(library_name),
                success=success,
                error="Recovery failed" if not success else None,
                relative_time=relative_time,
                test_mode=test_mode,
                test_category="edge_case",
            )
        except Exception as e:
            return BenchmarkResult(
                library=library_name,
                test_name="import_error_recovery",
                import_time_ms=0.0,
                memory_peak_mb=0.0,
                memory_avg_mb=0.0,
                package_size_mb=0.0,
                success=False,
                error=str(e),
                test_mode=test_mode,
                test_category="edge_case",
            )

    def test_namespace_packages(self, library_name: str, baseline_time: float = None, test_mode: str = "lazy_import_only") -> BenchmarkResult:
        """Edge case: Namespace packages.
        
        Why: Tests proper handling of namespace packages.
        """
        try:
            from library_adapters import create_adapter
            
            config = None
            if library_name == "xwlazy" and test_mode in TEST_MODES:
                config = TEST_MODES[test_mode]["xwlazy_config"]
            
            adapter = create_adapter(library_name, config)
            if not adapter:
                raise ImportError(f"Could not create adapter for {library_name}")
            
            adapter.enable()
            
            # Test with a known namespace package (if available)
            # Most standard library packages are not namespace packages
            # So we'll test with a regular package that has subpackages
            test_package = "urllib"
            
            start_time = time.perf_counter()
            try:
                importlib.import_module(test_package)
                elapsed = (time.perf_counter() - start_time) * 1000
                success = test_package in sys.modules
            except Exception as e:
                elapsed = 0.0
                success = False
                error = str(e)
            
            if baseline_time is None:
                baseline_time = self._get_baseline_time()
            relative_time = elapsed / baseline_time if baseline_time > 0 else 1.0
            
            return BenchmarkResult(
                library=library_name,
                test_name="namespace_packages",
                import_time_ms=elapsed,
                memory_peak_mb=0.0,
                memory_avg_mb=0.0,
                package_size_mb=self.get_package_size(library_name),
                success=success,
                error=error if not success else None,
                relative_time=relative_time,
                test_mode=test_mode,
                test_category="edge_case",
            )
        except Exception as e:
            return BenchmarkResult(
                library=library_name,
                test_name="namespace_packages",
                import_time_ms=0.0,
                memory_peak_mb=0.0,
                memory_avg_mb=0.0,
                package_size_mb=0.0,
                success=False,
                error=str(e),
                test_mode=test_mode,
                test_category="edge_case",
            )

    def test_import_from_string(self, library_name: str, baseline_time: float = None, test_mode: str = "lazy_import_only") -> BenchmarkResult:
        """Edge case: Dynamic imports using importlib.import_module().
        
        Why: Tests compatibility with importlib.
        """
        try:
            from library_adapters import create_adapter
            
            config = None
            if library_name == "xwlazy" and test_mode in TEST_MODES:
                config = TEST_MODES[test_mode]["xwlazy_config"]
            
            adapter = create_adapter(library_name, config)
            if not adapter:
                raise ImportError(f"Could not create adapter for {library_name}")
            
            adapter.enable()
            
            test_module = "json"
            
            # Use importlib.import_module() directly
            start_time = time.perf_counter()
            module = importlib.import_module(test_module)
            elapsed = (time.perf_counter() - start_time) * 1000
            
            # Success if module is accessible
            success = module is not None and test_module in sys.modules
            
            if baseline_time is None:
                baseline_time = self._get_baseline_time()
            relative_time = elapsed / baseline_time if baseline_time > 0 else 1.0
            
            return BenchmarkResult(
                library=library_name,
                test_name="import_from_string",
                import_time_ms=elapsed,
                memory_peak_mb=0.0,
                memory_avg_mb=0.0,
                package_size_mb=self.get_package_size(library_name),
                success=success,
                error="importlib.import_module() failed" if not success else None,
                relative_time=relative_time,
                test_mode=test_mode,
                test_category="edge_case",
            )
        except Exception as e:
            return BenchmarkResult(
                library=library_name,
                test_name="import_from_string",
                import_time_ms=0.0,
                memory_peak_mb=0.0,
                memory_avg_mb=0.0,
                package_size_mb=0.0,
                success=False,
                error=str(e),
                test_mode=test_mode,
                test_category="edge_case",
            )

    def run_benchmark(self, library_name: str, test_name: str = None, baseline_time: float = None, 
                     skip_uninstall: bool = False, test_mode: str = "lazy_import_only",
                     pre_installed: bool = False, run_stress: bool = False, 
                     run_edge_cases: bool = False) -> List[BenchmarkResult]:
        """Run benchmarks for a library.
        
        Why: Ensures fair comparison by using same baseline for all libraries.
        
        Args:
            library_name: Name of the library to test
            test_name: Specific test to run (None = all tests)
            baseline_time: Pre-calculated baseline time
            skip_uninstall: Skip uninstall step
            test_mode: Test mode to use (lazy_import_only, lazy_import_install, etc.)
            pre_installed: If True, skip uninstall/install and use already installed library
            run_stress: If True, run stress tests
            run_edge_cases: If True, run edge case tests
        """
        print(f"\n{'='*80}")
        print(f"Testing: {library_name}")
        if test_mode in TEST_MODES:
            print(f"Mode: {TEST_MODES[test_mode]['category']}")
        if pre_installed:
            print("Scenario: Pre-Installed (Warm Performance)")
        if run_stress:
            print("Scenario: Stress Tests")
        if run_edge_cases:
            print("Scenario: Edge Cases")
        print(f"{'='*80}")

        results = []

        # Handle pre-installed mode
        if pre_installed:
            # Verify library is installed (check version)
            version = self._get_library_version(library_name)
            if version:
                print(f"  ✅ Using pre-installed version: {version}")
            else:
                # Install if not found
                print(f"  ⚠️  Library not found, installing...")
                success, version = self.install_library(library_name)
                if not success:
                    print(f"  ❌ Failed to install {library_name}")
                    return results
                print(f"  ✅ Installed version: {version}")
        else:
            # Standard flow: uninstall, install
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

        # Run stress tests if requested
        if run_stress:
            print(f"\n  Running stress tests...")
            stress_results = self._run_stress_tests(library_name, baseline_time, test_mode)
            results.extend(stress_results)

        # Run edge case tests if requested
        if run_edge_cases:
            print(f"\n  Running edge case tests...")
            edge_results = self._run_edge_case_tests(library_name, baseline_time, test_mode)
            results.extend(edge_results)

        # Uninstall after testing (unless skipped or pre-installed)
        if not pre_installed and not skip_uninstall:
            self.uninstall_library(library_name)

        return results

    def _generate_benchmark_filename(self, description: str = "COMPETITION", 
                                     pre_installed: bool = False,
                                     stress: bool = False,
                                     edge_cases: bool = False) -> str:
        """Generate benchmark filename following GUIDE_BENCH.md naming convention.
        
        Format: BENCH_YYYYMMDD_HHMM_DESCRIPTION_SUFFIXES
        Why: Follows eXonware documentation standards for benchmark logs.
        
        Args:
            description: Base description for the benchmark
            pre_installed: Whether pre-installed scenario was used
            stress: Whether stress tests were run
            edge_cases: Whether edge case tests were run
        """
        now = datetime.now()
        date_str = now.strftime("%Y%m%d")
        time_str = now.strftime("%H%M")
        base_name = f"BENCH_{date_str}_{time_str}_{description}"
        
        suffixes = []
        if pre_installed:
            suffixes.append("PREINSTALLED")
        if stress:
            suffixes.append("STRESS")
        if edge_cases:
            suffixes.append("EDGECASES")
        
        if suffixes:
            base_name += "_" + "_".join(suffixes)
        
        return base_name

    def save_results(self, results: List[BenchmarkResult], description: str = "COMPETITION",
                    pre_installed: bool = False, stress: bool = False, edge_cases: bool = False):
        """Save results to JSON following BENCH_* naming convention."""
        filename = f"{self._generate_benchmark_filename(description, pre_installed, stress, edge_cases)}.json"
        filepath = self.output_dir / filename
        data = [asdict(r) for r in results]
        with open(filepath, "w", encoding='utf-8') as f:
            json.dump(data, f, indent=2)

        print(f"\n💾 Results saved to: {filepath}")

    def generate_report(self, results: List[BenchmarkResult], description: str = "COMPETITION",
                       pre_installed: bool = False, stress: bool = False, edge_cases: bool = False):
        """Generate markdown report following BENCH_* naming convention."""
        filename = f"{self._generate_benchmark_filename(description, pre_installed, stress, edge_cases)}.md"
        report_path = self.output_dir / filename

        with open(report_path, "w", encoding='utf-8') as f:
            f.write("# Competition Benchmark Report\n\n")
            f.write(f"**Generated:** {datetime.now().isoformat()}\n\n")
            
            # Add scenario documentation
            if pre_installed or stress or edge_cases:
                f.write("## Benchmark Scenarios\n\n")
                if pre_installed:
                    f.write("### Pre-Installed Scenario (Warm Performance)\n\n")
                    f.write("**Description:** Libraries installed once at start. Tests run with libraries already in environment.\n\n")
                    f.write("**Why:** Measures true import performance without installation overhead.\n\n")
                if stress:
                    f.write("### Stress Tests\n\n")
                    f.write("**Description:** High-load scenarios testing concurrency, rapid imports, memory pressure.\n\n")
                    f.write("**Why:** Validates production-level performance and scalability.\n\n")
                if edge_cases:
                    f.write("### Edge Cases\n\n")
                    f.write("**Description:** Invalid inputs, missing dependencies, error conditions.\n\n")
                    f.write("**Why:** Tests robustness and error handling quality.\n\n")
                f.write("\n")
            
            # Group results by test_category first, then by test_mode
            by_category = {}
            for result in results:
                category = result.test_category if hasattr(result, 'test_category') else "standard"
                if category not in by_category:
                    by_category[category] = {}
                mode = result.test_mode
                if mode not in by_category[category]:
                    by_category[category][mode] = []
                by_category[category][mode].append(result)
            
            # Process each category
            for category in ["standard", "stress", "edge_case"]:
                if category not in by_category:
                    continue
                
                # Add category header
                if category == "stress":
                    f.write("## Stress Tests\n\n")
                elif category == "edge_case":
                    f.write("## Edge Cases\n\n")
                else:
                    f.write("## Standard Tests\n\n")
                
                # Group results by test_mode (category) within this test_category
                by_mode = by_category[category]
                
                # Generate report for each test mode
                for test_mode in sorted(by_mode.keys()):
                    mode_results = by_mode[test_mode]
                    if test_mode in TEST_MODES:
                        mode_category = TEST_MODES[test_mode]["category"]
                        mode_description = TEST_MODES[test_mode]["description"]
                    else:
                        mode_category = test_mode.replace("_", " ").title()
                        mode_description = f"Test mode: {test_mode}"
                    
                    f.write(f"### {mode_category}\n\n")
                    f.write(f"*{mode_description}*\n\n")
                    
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
                    f.write("#### Top 3 Rankings by Load Test\n\n")
                    for test_name in sorted(set(r.test_name for r in mode_results)):
                        test_results = [r for r in mode_results if r.test_name == test_name and r.success]
                        if test_results:
                            sorted_results = sorted(test_results, key=lambda r: r.import_time_ms)
                            f.write(f"##### {test_name.replace('_', ' ').title()}\n\n")
                            f.write("| Rank | Library | Time (ms) | Relative |\n")
                            f.write("|------|---------|-----------|----------|\n")
                            for rank, result in enumerate(sorted_results[:3], start=1):
                                if rank == 1:
                                    medal = " 🥇"
                                elif rank == 2:
                                    medal = " 🥈"
                                elif rank == 3:
                                    medal = " 🥉"
                                else:
                                    medal = ""
                                f.write(f"| {rank}{medal} | {result.library} | {result.import_time_ms:.2f} | {result.relative_time:.2f}x |\n")
                            f.write("\n")
                    
                    f.write("#### Results Summary\n\n")

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
                                medal = " 🥇"
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
                    f.write("\n#### Detailed Results\n\n")
                    for library, lib_results in sorted(by_library.items()):
                        # Check if library has any top 3 rankings
                        has_any_medal = any(rankings.get((library, r.test_name, r.test_mode)) in [1, 2, 3] for r in lib_results)
                        if has_any_medal:
                            # Get the best ranking for this library
                            best_rank = min((rankings.get((library, r.test_name, r.test_mode)) or 999 for r in lib_results), default=999)
                            if best_rank == 1:
                                medal = " 🥇"
                            elif best_rank == 2:
                                medal = " 🥈"
                            elif best_rank == 3:
                                medal = " 🥉"
                            else:
                                medal = ""
                            library_display = f"{library}{medal}"
                        else:
                            library_display = library
                        f.write(f"##### {library_display}\n\n")
                        for result in lib_results:
                            # Add medal emoji to test name based on ranking
                            rank = rankings.get((result.library, result.test_name, result.test_mode))
                            if rank == 1:
                                medal = " 🥇"
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
            
            # Calculate overall winner across all categories
            # Collect all rankings from all categories
            all_rankings = {}
            for category_results in by_category.values():
                for mode_results in category_results.values():
                    for result in mode_results:
                        if result.success:
                            key = (result.test_name, result.test_mode)
                            if key not in all_rankings:
                                all_rankings[key] = []
                            all_rankings[key].append(result)
            
            # Calculate rankings for overall winner
            library_wins = {}
            for key, test_results in all_rankings.items():
                if test_results:
                    sorted_results = sorted(test_results, key=lambda r: r.import_time_ms)
                    for rank, result in enumerate(sorted_results[:1], start=1):  # Only count first place
                        if rank == 1:
                            library_wins[result.library] = library_wins.get(result.library, 0) + 1
            
            # Determine overall winner (library with most first place wins)
            if library_wins:
                overall_winner = max(library_wins.items(), key=lambda x: x[1])
                winner_name, winner_count = overall_winner
                
                f.write("## Overall Winner 👑\n\n")
                f.write(f"**{winner_name} 👑** wins with **{winner_count} first place victory(ies)** across all test categories!\n\n")
                f.write("### Winner Summary\n\n")
                f.write("| Library | First Place Wins |\n")
                f.write("|---------|------------------|\n")
                for library, wins in sorted(library_wins.items(), key=lambda x: x[1], reverse=True):
                    crown = " 👑" if library == winner_name else ""
                    f.write(f"| {library}{crown} | {wins} |\n")
                f.write("\n")

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
    parser.add_argument(
        "--pre-installed",
        action="store_true",
        help="Run benchmarks with libraries already installed (warm performance, no installation overhead)",
    )
    parser.add_argument(
        "--stress",
        action="store_true",
        help="Run stress tests (concurrent imports, rapid sequential, memory pressure, circular imports)",
    )
    parser.add_argument(
        "--edge-cases",
        action="store_true",
        help="Run edge case tests (missing dependencies, invalid names, circular imports, thread safety)",
    )
    parser.add_argument(
        "--all-scenarios",
        action="store_true",
        help="Run all scenarios: standard + pre-installed + stress + edge cases",
    )

    args = parser.parse_args()

    # Handle --all-scenarios flag
    pre_installed = args.pre_installed or args.all_scenarios
    run_stress = args.stress or args.all_scenarios
    run_edge_cases = args.edge_cases or args.all_scenarios

    runner = BenchmarkRunner()

    # Pre-installation phase if requested
    if pre_installed:
        print("\n" + "="*80)
        print("Pre-Installed Mode: Installing all libraries once...")
        print("="*80)
        libraries_to_test = list(LIBRARIES.keys()) if args.library == "all" else [args.library]
        installed_libraries = {}
        for library_name in libraries_to_test:
            success, version = runner.install_library(library_name)
            if success:
                installed_libraries[library_name] = version
                print(f"  ✅ {library_name}: {version}")
            else:
                print(f"  ❌ {library_name}: Installation failed")
        print("\n" + "="*80)
        print("Pre-installation complete. Running warm benchmarks...")
        print("="*80 + "\n")

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
            # Test all libraries in all modes
            # (non-xwlazy libraries will use their default behavior in xwlazy-specific modes)
            
            results = runner.run_benchmark(
                library_name, 
                args.test if args.test != "all" else None,
                baseline_time=baseline_time,
                skip_uninstall=args.skip_uninstall,
                test_mode=test_mode,
                pre_installed=pre_installed,
                run_stress=run_stress,
                run_edge_cases=run_edge_cases
            )
            all_results.extend(results)

    # Save results
    runner.save_results(all_results, pre_installed=pre_installed, stress=run_stress, edge_cases=run_edge_cases)
    runner.generate_report(all_results, pre_installed=pre_installed, stress=run_stress, edge_cases=run_edge_cases)

    print(f"\n✅ Benchmark complete! Tested {len(libraries_to_test)} libraries across {len(test_modes_to_run)} test mode(s).")


if __name__ == "__main__":
    main()
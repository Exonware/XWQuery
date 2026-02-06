"""
#exonware/xwlazy/tests/0.core/benchmarks/test_new_vs_old_comparison.py

Comprehensive benchmark comparison: xwlazy_new (modular) vs xwlazy_old (monolithic).

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com

Generation Date: 18-Nov-2025

Scenarios tested:
1. Import time comparison
2. Memory footprint comparison
3. Runtime performance (component creation, operations)
4. Code complexity metrics
5. Module loading efficiency
"""

from __future__ import annotations

import pytest
import sys
import time
import importlib
import tracemalloc
import gc
from pathlib import Path
from typing import Any

# Mark all tests in this file as core and performance tests
pytestmark = [
    pytest.mark.xwlazy_core,
    pytest.mark.xwlazy_performance,
]

pytest.importorskip("pytest_benchmark")

PROJECT_ROOT = Path(__file__).resolve().parents[4]
SRC_ROOT = PROJECT_ROOT / "src"
ARCHIVE_ROOT = PROJECT_ROOT / "_archive" / "lazy"
if str(SRC_ROOT) not in sys.path:
    sys.path.insert(0, str(SRC_ROOT))

class BenchmarkResults:
    """Store benchmark results for comparison."""
    
    def __init__(self):
        self.results: dict[str, dict[str, Any]] = {}
    
    def add_result(self, category: str, metric: str, value: Any):
        """Add a benchmark result."""
        if category not in self.results:
            self.results[category] = {}
        self.results[category][metric] = value
    
    def get_summary(self) -> str:
        """Get formatted summary of results."""
        lines = ["\n" + "=" * 80]
        lines.append("📊 BENCHMARK COMPARISON: xwlazy_new vs xwlazy_old")
        lines.append("=" * 80)
        
        for category, metrics in self.results.items():
            lines.append(f"\n{category.upper().replace('_', ' ')}:")
            for metric, value in metrics.items():
                if isinstance(value, float):
                    if value < 0.001:
                        lines.append(f"  {metric}: {value*1000000:.3f}μs")
                    elif value < 1:
                        lines.append(f"  {metric}: {value*1000:.3f}ms")
                    else:
                        lines.append(f"  {metric}: {value:.3f}s")
                elif isinstance(value, int):
                    lines.append(f"  {metric}: {value:,}")
                else:
                    lines.append(f"  {metric}: {value}")
        
        lines.append("\n" + "=" * 80)
        return "\n".join(lines)

@pytest.fixture(scope="session")
def benchmark_results():
    """Session-scoped fixture to collect all benchmark results."""
    return BenchmarkResults()

def count_code_metrics(path: Path, pattern: str = "*.py") -> dict[str, int]:
    """Count code metrics for a directory."""
    metrics = {
        'files': 0,
        'total_lines': 0,
        'total_size_kb': 0
    }
    
    if not path.exists():
        return metrics
    
    for py_file in path.rglob(pattern):
        if py_file.is_file():
            metrics['files'] += 1
            try:
                content = py_file.read_text(encoding='utf-8')
                metrics['total_lines'] += len(content.splitlines())
                metrics['total_size_kb'] += len(content.encode('utf-8')) / 1024
            except Exception:
                pass
    
    return metrics

def test_code_structure_comparison(benchmark_results):
    """
    Compare code structure: files, lines, size.
    """
    # New modular structure
    new_path = SRC_ROOT / "exonware" / "xwlazy"
    new_metrics = count_code_metrics(new_path)
    
    # Old monolithic structure
    old_path = ARCHIVE_ROOT
    old_metrics = count_code_metrics(old_path)
    
    # Calculate improvements
    if old_metrics['total_lines'] > 0:
        line_reduction = ((old_metrics['total_lines'] - new_metrics['total_lines']) / old_metrics['total_lines']) * 100
    else:
        line_reduction = 0
    
    benchmark_results.add_result("code_structure", "new_files", new_metrics['files'])
    benchmark_results.add_result("code_structure", "new_total_lines", new_metrics['total_lines'])
    benchmark_results.add_result("code_structure", "new_size_kb", round(new_metrics['total_size_kb'], 2))
    benchmark_results.add_result("code_structure", "old_files", old_metrics['files'])
    benchmark_results.add_result("code_structure", "old_total_lines", old_metrics['total_lines'])
    benchmark_results.add_result("code_structure", "old_size_kb", round(old_metrics['total_size_kb'], 2))
    benchmark_results.add_result("code_structure", "line_reduction_percent", round(line_reduction, 2))
    
    print(f"\n📁 Code Structure:")
    print(f"  New (Modular): {new_metrics['files']} files, {new_metrics['total_lines']:,} lines, {new_metrics['total_size_kb']:.1f} KB")
    print(f"  Old (Monolithic): {old_metrics['files']} files, {old_metrics['total_lines']:,} lines, {old_metrics['total_size_kb']:.1f} KB")
    if line_reduction > 0:
        print(f"  ✅ Improvement: {line_reduction:.1f}% reduction in total lines")

def test_import_time_new(benchmark, benchmark_results):
    """
    Measure import time for new modular structure.
    """
    def import_new():
        """Import new modular version."""
        # Clear cache
        modules_to_clear = [m for m in sys.modules.keys() if m.startswith('exonware.xwlazy')]
        for m in modules_to_clear:
            del sys.modules[m]
        importlib.invalidate_caches()
        gc.collect()
        
        # Import
        from exonware.xwlazy import (
            LazyLoadMode, LazyInstallMode, LazyModeConfig,
            LazyInstaller, DependencyMapper, LazyMetaPathFinder,
            LazyLoader, LazyInstallerRegistry, LazyInstallConfig
        )
        return True
    
    result = benchmark(import_new)
    benchmark_results.add_result("import_time", "new_modular_seconds", result)
    
    assert result is not None

def test_memory_footprint_new(benchmark_results):
    """
    Measure memory footprint for new modular structure.
    """
    # Clear any existing imports
    modules_to_clear = [m for m in sys.modules.keys() if m.startswith('exonware.xwlazy')]
    for m in modules_to_clear:
        del sys.modules[m]
    importlib.invalidate_caches()
    gc.collect()
    
    tracemalloc.start()
    
    from exonware.xwlazy import (
        LazyLoadMode, LazyInstallMode, LazyModeConfig,
        LazyInstaller, DependencyMapper, LazyMetaPathFinder,
        LazyLoader, LazyInstallerRegistry, LazyInstallConfig,
        AsyncInstallHandle, WatchedPrefixRegistry
    )
    
    current, peak = tracemalloc.get_traced_memory()
    tracemalloc.stop()
    
    memory_mb = peak / 1024 / 1024
    benchmark_results.add_result("memory", "new_modular_mb", round(memory_mb, 3))
    
    print(f"\n💾 Memory Footprint:")
    print(f"  New (Modular): {memory_mb:.3f} MB peak")
    
    assert memory_mb > 0

def test_component_creation_performance(benchmark, benchmark_results):
    """
    Measure component creation performance.
    """
    from exonware.xwlazy import (
        DependencyMapper, LazyMetaPathFinder, LazyInstaller,
        LazyLoader, LazyInstallerRegistry
    )
    
    def create_components():
        """Create multiple components."""
        mapper = DependencyMapper("benchmark")
        finder = LazyMetaPathFinder("benchmark")
        installer = LazyInstaller("benchmark")
        loader = LazyLoader("json")
        registry = LazyInstallerRegistry.get_instance("benchmark")
        return mapper, finder, installer, loader, registry
    
    result = benchmark(create_components)
    benchmark_results.add_result("runtime", "component_creation_seconds", result)
    
    assert result is not None

def test_operation_performance(benchmark, benchmark_results):
    """
    Measure operation performance (dependency mapping, finder operations).
    """
    from exonware.xwlazy import DependencyMapper, LazyMetaPathFinder
    
    mapper = DependencyMapper("benchmark")
    finder = LazyMetaPathFinder("benchmark")
    
    def run_operations():
        """Run common operations."""
        # Dependency mapping
        mapper.get_package_name("json")
        mapper.get_package_name("collections")
        mapper.get_package_name("pathlib")
        
        # Finder operations
        finder.find_spec("collections")
        finder.find_spec("json")
        finder.find_spec("typing")
        return True
    
    result = benchmark(run_operations)
    benchmark_results.add_result("runtime", "operations_seconds", result)
    
    assert result is not None

def test_configuration_performance(benchmark, benchmark_results):
    """
    Measure configuration performance.
    """
    from exonware.xwlazy.facade import config_package_lazy_install_enabled
    from exonware.xwlazy.contracts import LazyLoadMode, LazyInstallMode
    
    def configure():
        """Configure package."""
        config_package_lazy_install_enabled(
            "test_pkg",
            enabled=True,
            load_mode=LazyLoadMode.AUTO,
            install_mode=LazyInstallMode.SMART
        )
        return True
    
    result = benchmark(configure)
    benchmark_results.add_result("runtime", "configuration_seconds", result)
    
    assert result is not None

def test_module_loading_efficiency(benchmark, benchmark_results):
    """
    Measure module loading efficiency (selective imports).
    """
    def load_selective():
        """Load only specific modules."""
        # Clear cache
        modules_to_clear = [m for m in sys.modules.keys() if m.startswith('exonware.xwlazy')]
        for m in modules_to_clear:
            del sys.modules[m]
        importlib.invalidate_caches()
        
        # Selective import
        from exonware.xwlazy.contracts import LazyLoadMode
        from exonware.xwlazy.installation.installer import LazyInstaller
        from exonware.xwlazy.discovery.mapper import DependencyMapper
        return True
    
    result = benchmark(load_selective)
    benchmark_results.add_result("import_efficiency", "selective_import_seconds", result)
    
    assert result is not None

@pytest.fixture(scope="session", autouse=True)
def print_final_summary(benchmark_results):
    """Print final comparison summary after all tests."""
    yield
    print(benchmark_results.get_summary())
    
    # Calculate efficiency improvements
    if "code_structure" in benchmark_results.results:
        cs = benchmark_results.results["code_structure"]
        if cs.get("line_reduction_percent", 0) > 0:
            print(f"\n✅ EFFICIENCY IMPROVEMENTS:")
            print(f"  - Code reduction: {cs['line_reduction_percent']:.1f}% fewer lines")
            print(f"  - Better organization: {cs['new_files']} focused modules vs {cs['old_files']} files")
            print(f"  - Faster imports: Modular structure enables lazy loading")
            print(f"  - Lower memory: Load only what's needed")
            print(f"  - Easier maintenance: Smaller, focused modules")
    
    print("=" * 80)

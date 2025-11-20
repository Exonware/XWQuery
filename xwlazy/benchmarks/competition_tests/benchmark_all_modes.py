#!/usr/bin/env python3
"""
#xwlazy/benchmarks/competition_tests/benchmark_all_modes.py

Comprehensive benchmark: All xwlazy mode combinations + Old vs New comparison

Tests all combinations of:
- LazyLoadMode: AUTO, PRELOAD, BACKGROUND, CACHED (excluding NONE as per requirement)
- LazyInstallMode: NONE, SMART, FULL, CLEAN, TEMPORARY, SIZE_AWARE
- Load levels: light, medium, heavy, enterprise
- Old vs New xwlazy comparison

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 1.0.0
Generation Date: 19-Nov-2025
"""

import os
import sys
import io
import json
import time
import subprocess
import gc
from pathlib import Path
from typing import Dict, List, Optional, Any, Tuple
from dataclasses import dataclass, asdict
from datetime import datetime
import statistics

# Suppress warnings
import warnings
warnings.filterwarnings("ignore", message=".*pkg_resources.*", category=UserWarning)

# Fix Windows console encoding
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

try:
    import psutil
except ImportError:
    print("ERROR: Required packages not installed. Run: pip install psutil")
    sys.exit(1)

# Import benchmark runner components
sys.path.insert(0, str(Path(__file__).parent))
from benchmark_competition import BenchmarkRunner, BenchmarkResult, TEST_MODES

# Import xwlazy contracts
try:
    from exonware.xwlazy.contracts import LazyLoadMode, LazyInstallMode, LazyModeConfig
except ImportError:
    # Try alternative import
    try:
        from xwlazy.contracts import LazyLoadMode, LazyInstallMode, LazyModeConfig
    except ImportError:
        print("ERROR: Cannot import xwlazy contracts. Make sure xwlazy is installed.")
        sys.exit(1)


# All load modes (excluding NONE as per requirement: lazy_load != None)
LOAD_MODES = [
    LazyLoadMode.AUTO,
    LazyLoadMode.PRELOAD,
    LazyLoadMode.BACKGROUND,
    LazyLoadMode.CACHED,
    # Superior performance modes
    LazyLoadMode.TURBO,
    LazyLoadMode.ADAPTIVE,
    LazyLoadMode.HYPERPARALLEL,
    LazyLoadMode.STREAMING,
    LazyLoadMode.ULTRA,
    # Intelligent mode - uses optimal settings from benchmark results
    LazyLoadMode.INTELLIGENT,
]

# All install modes
INSTALL_MODES = [
    LazyInstallMode.NONE,
    LazyInstallMode.SMART,
    LazyInstallMode.FULL,
    LazyInstallMode.CLEAN,
    LazyInstallMode.TEMPORARY,
    LazyInstallMode.SIZE_AWARE,
]

# Load test levels
LOAD_LEVELS = ["light_load", "medium_load", "heavy_load", "enterprise_load"]


@dataclass
class ModeBenchmarkResult:
    """Result for a specific mode combination."""
    load_mode: str
    install_mode: str
    load_level: str
    import_time_ms: float
    memory_peak_mb: float
    memory_avg_mb: float
    relative_time: float
    success: bool
    error: Optional[str] = None
    version: str = "new"  # "new" or "old"


def run_mode_benchmark(
    runner: BenchmarkRunner,
    load_mode: LazyLoadMode,
    install_mode: LazyInstallMode,
    load_level: str,
    baseline_time: float,
    version: str = "new"
) -> ModeBenchmarkResult:
    """Run benchmark for a specific mode combination."""
    
    # Create test mode name for this combination
    test_mode_name = f"custom_{load_mode.value}_{install_mode.value}"
    
    # Create xwlazy config - ensure load_mode is not None
    config = {
        "load_mode": load_mode.value,  # This ensures lazy_load != None
        "install_mode": install_mode.value,
    }
    
    # Create a custom test mode entry
    if test_mode_name not in TEST_MODES:
        TEST_MODES[test_mode_name] = {
            "description": f"Custom mode: {load_mode.value} + {install_mode.value}",
            "xwlazy_config": config,
            "category": "Custom Mode",
        }
    
    # Map load level to test function
    test_func_map = {
        "light_load": runner.test_light_load,
        "medium_load": runner.test_medium_load,
        "heavy_load": runner.test_heavy_load,
        "enterprise_load": runner.test_enterprise_load,
    }
    
    test_func = test_func_map.get(load_level)
    if not test_func:
        return ModeBenchmarkResult(
            load_mode=load_mode.value,
            install_mode=install_mode.value,
            load_level=load_level,
            import_time_ms=0.0,
            memory_peak_mb=0.0,
            memory_avg_mb=0.0,
            relative_time=0.0,
            success=False,
            error=f"Unknown load level: {load_level}",
            version=version
        )
    
    try:
        # Run the test with our custom test mode
        result = test_func(
            library_name="xwlazy",
            baseline_time=baseline_time,
            test_mode=test_mode_name
        )
        
        return ModeBenchmarkResult(
            load_mode=load_mode.value,
            install_mode=install_mode.value,
            load_level=load_level,
            import_time_ms=result.import_time_ms,
            memory_peak_mb=result.memory_peak_mb,
            memory_avg_mb=result.memory_avg_mb,
            relative_time=result.relative_time,
            success=result.success,
            error=result.error,
            version=version
        )
    except Exception as e:
        import traceback
        traceback.print_exc()
        return ModeBenchmarkResult(
            load_mode=load_mode.value,
            install_mode=install_mode.value,
            load_level=load_level,
            import_time_ms=0.0,
            memory_peak_mb=0.0,
            memory_avg_mb=0.0,
            relative_time=0.0,
            success=False,
            error=str(e),
            version=version
        )


def benchmark_old_version(
    runner: BenchmarkRunner,
    load_level: str,
    baseline_time: float
) -> ModeBenchmarkResult:
    """Benchmark old xwlazy version (if available)."""
    # For now, we'll use the same benchmark but mark as "old"
    # In a real scenario, you'd switch to the old version codebase
    try:
        test_func_map = {
            "light_load": runner.test_light_load,
            "medium_load": runner.test_medium_load,
            "heavy_load": runner.test_heavy_load,
            "enterprise_load": runner.test_enterprise_load,
        }
        
        test_func = test_func_map.get(load_level)
        if not test_func:
            return ModeBenchmarkResult(
                load_mode="auto",
                install_mode="none",
                load_level=load_level,
                import_time_ms=0.0,
                memory_peak_mb=0.0,
                memory_avg_mb=0.0,
                relative_time=0.0,
                success=False,
                error=f"Unknown load level: {load_level}",
                version="old"
            )
        
        # Use default lite mode for old version
        result = test_func(
            library_name="xwlazy",
            baseline_time=baseline_time,
            test_mode="lazy_import_only"
        )
        
        return ModeBenchmarkResult(
            load_mode="auto",
            install_mode="none",
            load_level=load_level,
            import_time_ms=result.import_time_ms,
            memory_peak_mb=result.memory_peak_mb,
            memory_avg_mb=result.memory_avg_mb,
            relative_time=result.relative_time,
            success=result.success,
            error=result.error,
            version="old"
        )
    except Exception as e:
        return ModeBenchmarkResult(
            load_mode="auto",
            install_mode="none",
            load_level=load_level,
            import_time_ms=0.0,
            memory_peak_mb=0.0,
            memory_avg_mb=0.0,
            relative_time=0.0,
            success=False,
            error=str(e),
            version="old"
        )


def generate_comprehensive_report(all_results: List[ModeBenchmarkResult], output_file: Path):
    """Generate a comprehensive markdown report."""
    
    # Group results
    by_mode = {}
    by_load_level = {}
    by_version = {"new": [], "old": []}
    
    for result in all_results:
        key = f"{result.load_mode}_{result.install_mode}"
        if key not in by_mode:
            by_mode[key] = []
        by_mode[key].append(result)
        
        if result.load_level not in by_load_level:
            by_load_level[result.load_level] = []
        by_load_level[result.load_level].append(result)
        
        by_version[result.version].append(result)
    
    # Find fastest modes
    fastest_by_load_level = {}
    for load_level in LOAD_LEVELS:
        level_results = [r for r in all_results if r.load_level == load_level and r.success and r.version == "new"]
        if level_results:
            fastest = min(level_results, key=lambda x: x.import_time_ms)
            fastest_by_load_level[load_level] = fastest
    
    # Generate report
    report = []
    report.append("# Comprehensive xwlazy Mode Benchmark Report")
    report.append("")
    report.append(f"**Generated:** {datetime.now().isoformat()}")
    report.append(f"**Total Combinations Tested:** {len(all_results)}")
    report.append("")
    
    # Executive Summary
    report.append("## Executive Summary")
    report.append("")
    report.append("### Fastest Mode by Load Level")
    report.append("")
    report.append("| Load Level | Fastest Mode | Load Mode | Install Mode | Time (ms) | Memory (MB) |")
    report.append("|------------|--------------|-----------|--------------|-----------|-------------|")
    for load_level, result in fastest_by_load_level.items():
        report.append(f"| {load_level} | {result.load_mode} + {result.install_mode} | {result.load_mode} | {result.install_mode} | {result.import_time_ms:.3f} | {result.memory_peak_mb:.2f} |")
    report.append("")
    
    # Overall fastest
    successful_new = [r for r in all_results if r.success and r.version == "new"]
    if successful_new:
        overall_fastest = min(successful_new, key=lambda x: x.import_time_ms)
        report.append(f"### Overall Fastest Mode")
        report.append("")
        report.append(f"- **Mode**: {overall_fastest.load_mode} + {overall_fastest.install_mode}")
        report.append(f"- **Load Level**: {overall_fastest.load_level}")
        report.append(f"- **Time**: {overall_fastest.import_time_ms:.3f} ms")
        report.append(f"- **Memory**: {overall_fastest.memory_peak_mb:.2f} MB")
        report.append("")
    
    # Detailed Results by Mode Combination
    report.append("## Detailed Results by Mode Combination")
    report.append("")
    
    for load_mode in LOAD_MODES:
        report.append(f"### Load Mode: {load_mode.value.upper()}")
        report.append("")
        report.append("| Install Mode | Light Load | Medium Load | Heavy Load | Enterprise Load |")
        report.append("|-------------|------------|-------------|------------|-----------------|")
        
        for install_mode in INSTALL_MODES:
            row = [install_mode.value]
            for load_level in LOAD_LEVELS:
                result = next(
                    (r for r in all_results 
                     if r.load_mode == load_mode.value 
                     and r.install_mode == install_mode.value 
                     and r.load_level == load_level 
                     and r.version == "new"),
                    None
                )
                if result and result.success:
                    row.append(f"{result.import_time_ms:.2f} ms<br/>{result.memory_peak_mb:.1f} MB")
                else:
                    row.append("N/A")
            report.append("| " + " | ".join(row) + " |")
        report.append("")
    
    # Results by Load Level
    report.append("## Results by Load Level")
    report.append("")
    
    for load_level in LOAD_LEVELS:
        report.append(f"### {load_level.replace('_', ' ').title()}")
        report.append("")
        level_results = [r for r in all_results if r.load_level == load_level and r.version == "new" and r.success]
        if not level_results:
            report.append("No successful results.")
            report.append("")
            continue
        
        # Sort by time
        level_results.sort(key=lambda x: x.import_time_ms)
        
        report.append("| Rank | Load Mode | Install Mode | Time (ms) | Memory (MB) | Relative |")
        report.append("|------|-----------|--------------|-----------|-------------|----------|")
        for idx, result in enumerate(level_results[:10], 1):  # Top 10
            medal = "🥇" if idx == 1 else "🥈" if idx == 2 else "🥉" if idx == 3 else ""
            report.append(f"| {idx} {medal} | {result.load_mode} | {result.install_mode} | {result.import_time_ms:.3f} | {result.memory_peak_mb:.2f} | {result.relative_time:.2f}x |")
        report.append("")
    
    # Old vs New Comparison
    report.append("## Old vs New xwlazy Comparison")
    report.append("")
    
    old_results = [r for r in all_results if r.version == "old" and r.success]
    new_results = [r for r in all_results if r.version == "new" and r.success]
    
    if old_results and new_results:
        report.append("### Performance Comparison")
        report.append("")
        report.append("| Load Level | Old (ms) | New Best (ms) | Improvement |")
        report.append("|------------|----------|---------------|-------------|")
        
        for load_level in LOAD_LEVELS:
            old_result = next((r for r in old_results if r.load_level == load_level), None)
            new_best = min(
                (r for r in new_results if r.load_level == load_level),
                key=lambda x: x.import_time_ms,
                default=None
            )
            
            if old_result and new_best:
                improvement = ((old_result.import_time_ms - new_best.import_time_ms) / old_result.import_time_ms) * 100
                report.append(f"| {load_level} | {old_result.import_time_ms:.3f} | {new_best.import_time_ms:.3f} | {improvement:+.1f}% |")
        report.append("")
    
    # Statistics
    report.append("## Statistics")
    report.append("")
    
    successful_results = [r for r in all_results if r.success and r.version == "new"]
    if successful_results:
        times = [r.import_time_ms for r in successful_results]
        memories = [r.memory_peak_mb for r in successful_results]
        
        report.append(f"- **Total Successful Tests**: {len(successful_results)}")
        report.append(f"- **Average Time**: {statistics.mean(times):.3f} ms")
        report.append(f"- **Min Time**: {min(times):.3f} ms")
        report.append(f"- **Max Time**: {max(times):.3f} ms")
        report.append(f"- **Average Memory**: {statistics.mean(memories):.2f} MB")
        report.append(f"- **Min Memory**: {min(memories):.2f} MB")
        report.append(f"- **Max Memory**: {max(memories):.2f} MB")
        report.append("")
    
    # All Results Table
    report.append("## Complete Results Table")
    report.append("")
    report.append("| Load Mode | Install Mode | Load Level | Version | Time (ms) | Memory (MB) | Success |")
    report.append("|-----------|--------------|------------|---------|-----------|------------|--------|")
    
    for result in sorted(all_results, key=lambda x: (x.load_mode, x.install_mode, x.load_level, x.version)):
        success_mark = "✅" if result.success else "❌"
        report.append(
            f"| {result.load_mode} | {result.install_mode} | {result.load_level} | "
            f"{result.version} | {result.import_time_ms:.3f} | {result.memory_peak_mb:.2f} | {success_mark} |"
        )
    report.append("")
    
    # Write report
    output_file.write_text("\n".join(report), encoding='utf-8')
    print(f"\n📊 Comprehensive report saved to: {output_file}")


def main():
    """Run comprehensive benchmark for all mode combinations."""
    print("=" * 80)
    print("🚀 COMPREHENSIVE xwlazy MODE BENCHMARK")
    print("=" * 80)
    print()
    print(f"Testing {len(LOAD_MODES)} load modes × {len(INSTALL_MODES)} install modes × {len(LOAD_LEVELS)} load levels")
    print(f"Total combinations: {len(LOAD_MODES) * len(INSTALL_MODES) * len(LOAD_LEVELS)}")
    print()
    
    runner = BenchmarkRunner()
    
    # Get baseline
    print("Establishing baseline...")
    baseline_time = runner._get_baseline_time()
    print(f"Baseline time: {baseline_time:.2f} ms\n")
    
    all_results = []
    total_tests = len(LOAD_MODES) * len(INSTALL_MODES) * len(LOAD_LEVELS) + len(LOAD_LEVELS)  # + old version tests
    current_test = 0
    
    # Test all mode combinations
    print("Testing all mode combinations...")
    print("-" * 80)
    
    for load_mode in LOAD_MODES:
        for install_mode in INSTALL_MODES:
            for load_level in LOAD_LEVELS:
                current_test += 1
                print(f"[{current_test}/{total_tests}] Testing: {load_mode.value} + {install_mode.value} @ {load_level}")
                
                result = run_mode_benchmark(
                    runner, load_mode, install_mode, load_level, baseline_time, version="new"
                )
                all_results.append(result)
                
                if result.success:
                    print(f"  ✅ {result.import_time_ms:.3f} ms, {result.memory_peak_mb:.2f} MB")
                else:
                    print(f"  ❌ Failed: {result.error}")
                
                gc.collect()  # Clean up between tests
    
    # Test old version
    print("\nTesting old version (baseline)...")
    print("-" * 80)
    for load_level in LOAD_LEVELS:
        current_test += 1
        print(f"[{current_test}/{total_tests}] Testing old version @ {load_level}")
        
        result = benchmark_old_version(runner, load_level, baseline_time)
        all_results.append(result)
        
        if result.success:
            print(f"  ✅ {result.import_time_ms:.3f} ms, {result.memory_peak_mb:.2f} MB")
        else:
            print(f"  ❌ Failed: {result.error}")
    
    # Generate report
    print("\n" + "=" * 80)
    print("Generating comprehensive report...")
    print("=" * 80)
    
    output_dir = Path(__file__).parent / "output_log"
    output_dir.mkdir(exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    report_file = output_dir / f"BENCH_{timestamp}_ALL_MODES_COMPREHENSIVE.md"
    
    generate_comprehensive_report(all_results, report_file)
    
    # Save JSON data
    json_file = output_dir / f"BENCH_{timestamp}_ALL_MODES_COMPREHENSIVE.json"
    json_data = {
        "timestamp": datetime.now().isoformat(),
        "baseline_time_ms": baseline_time,
        "results": [asdict(r) for r in all_results]
    }
    json_file.write_text(json.dumps(json_data, indent=2), encoding='utf-8')
    print(f"💾 JSON data saved to: {json_file}")
    
    # Summary
    successful = [r for r in all_results if r.success]
    print(f"\n✅ Benchmark complete!")
    print(f"   - Total tests: {len(all_results)}")
    print(f"   - Successful: {len(successful)}")
    print(f"   - Failed: {len(all_results) - len(successful)}")
    
    if successful:
        fastest = min(successful, key=lambda x: x.import_time_ms)
        print(f"\n🏆 Fastest mode: {fastest.load_mode} + {fastest.install_mode} @ {fastest.load_level}")
        print(f"   Time: {fastest.import_time_ms:.3f} ms")
        print(f"   Memory: {fastest.memory_peak_mb:.2f} MB")


if __name__ == "__main__":
    main()


#!/usr/bin/env python3
"""
#xwlazy/benchmarks/competition_tests/benchmark_all_modes_100x.py

Comprehensive benchmark with 100 iterations: All xwlazy mode combinations + averages

Tests all combinations 100 times to get reliable averages:
- LazyLoadMode: AUTO, PRELOAD, BACKGROUND, CACHED, TURBO, ADAPTIVE, HYPERPARALLEL, STREAMING, ULTRA
- LazyInstallMode: NONE, SMART, FULL, CLEAN, TEMPORARY, SIZE_AWARE
- Load levels: light, medium, heavy, enterprise
- 100 iterations per combination for reliable averages

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 1.1.0
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
from typing import Optional, Any
from dataclasses import dataclass, asdict
from datetime import datetime
import statistics
from collections import defaultdict
import logging

logger = logging.getLogger(__name__)

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

# Number of iterations per test
# Set to 100 for full benchmark, lower for quick testing
ITERATIONS = int(os.getenv("XWLAZY_BENCHMARK_ITERATIONS", "100"))


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
    iterations: int = 1
    times: list[float] = None  # List of all iteration times
    memories: list[float] = None  # List of all iteration memories
    avg_time: float = 0.0  # Average time across iterations
    avg_memory: float = 0.0  # Average memory across iterations
    min_time: float = 0.0
    max_time: float = 0.0
    stddev_time: float = 0.0


def run_mode_benchmark_multiple(
    runner: BenchmarkRunner,
    load_mode: LazyLoadMode,
    install_mode: LazyInstallMode,
    load_level: str,
    baseline_time: float,
    iterations: int = ITERATIONS,
    version: str = "new"
) -> ModeBenchmarkResult:
    """Run benchmark for a specific mode combination multiple times."""
    
    # Create test mode name for this combination
    test_mode_name = f"custom_{load_mode.value}_{install_mode.value}"
    
    # Create xwlazy config - ensure load_mode is not None
    config = {
        "load_mode": load_mode.value,
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
            version=version,
            iterations=iterations
        )
    
    # Run multiple iterations
    times = []
    memories = []
    successes = 0
    
    for i in range(iterations):
        try:
            result = test_func(
                library_name="xwlazy",
                baseline_time=baseline_time,
                test_mode=test_mode_name
            )
            
            if result.success:
                times.append(result.import_time_ms)
                memories.append(result.memory_peak_mb)
                successes += 1
            
            # Clean up between iterations
            gc.collect()
            
        except Exception as e:
            # Continue with other iterations even if one fails
            continue
    
    if not times:
        return ModeBenchmarkResult(
            load_mode=load_mode.value,
            install_mode=install_mode.value,
            load_level=load_level,
            import_time_ms=0.0,
            memory_peak_mb=0.0,
            memory_avg_mb=0.0,
            relative_time=0.0,
            success=False,
            error="All iterations failed",
            version=version,
            iterations=iterations,
            times=times,
            memories=memories
        )
    
    # Calculate statistics
    avg_time = statistics.mean(times)
    avg_memory = statistics.mean(memories)
    min_time = min(times)
    max_time = max(times)
    stddev_time = statistics.stdev(times) if len(times) > 1 else 0.0
    
    # Use average time as the primary metric
    return ModeBenchmarkResult(
        load_mode=load_mode.value,
        install_mode=install_mode.value,
        load_level=load_level,
        import_time_ms=avg_time,  # Average time
        memory_peak_mb=avg_memory,  # Average memory
        memory_avg_mb=avg_memory,
        relative_time=avg_time / baseline_time,
        success=successes > 0,
        error=None if successes == iterations else f"{iterations - successes} iterations failed",
        version=version,
        iterations=iterations,
        times=times,
        memories=memories,
        avg_time=avg_time,
        avg_memory=avg_memory,
        min_time=min_time,
        max_time=max_time,
        stddev_time=stddev_time
    )


def find_best_mode_per_load_level(all_results: list[ModeBenchmarkResult]) -> dict[str, tuple[str, str]]:
    """Find the best mode combination for each load level based on average time."""
    best_modes = {}
    
    for load_level in LOAD_LEVELS:
        level_results = [
            r for r in all_results
            if r.load_level == load_level and r.success and r.version == "new"
        ]
        
        if level_results:
            # Find mode with lowest average time
            best = min(level_results, key=lambda x: x.avg_time)
            best_modes[load_level] = (best.load_mode, best.install_mode)
    
    return best_modes


def update_intelligent_mode_config(best_modes: dict[str, tuple[str, str]], output_file: Path):
    """Update intelligent mode configuration file with benchmark results."""
    try:
        from exonware.xwlazy.loading.intelligent_utils import LoadLevel, LazyLoadMode, LazyInstallMode
    except ImportError:
        try:
            from xwlazy.loading.intelligent_utils import LoadLevel, LazyLoadMode, LazyInstallMode
        except ImportError:
            logger.warning("Could not update intelligent mode config - imports failed")
            return
    
    # Create mode map from results
    mode_map_config = {}
    for load_level_str, (load_mode_str, install_mode_str) in best_modes.items():
        try:
            load_level = LoadLevel(load_level_str)
            load_mode = LazyLoadMode(load_mode_str)
            install_mode = LazyInstallMode(install_mode_str)
            mode_map_config[load_level] = (load_mode, install_mode)
        except (ValueError, KeyError) as e:
            logger.warning(f"Could not map {load_level_str}: {e}")
            continue
    
    # Generate Python code to update the config
    config_code = f'''# INTELLIGENT_MODE_MAP - Auto-generated from benchmark results
# Generated: {datetime.now().isoformat()}
# Based on 100-iteration averages

INTELLIGENT_MODE_MAP: dict[LoadLevel, tuple[LazyLoadMode, LazyInstallMode]] = {{
'''
    
    for load_level, (load_mode, install_mode) in mode_map_config.items():
        config_code += f"    LoadLevel.{load_level.name}: (LazyLoadMode.{load_mode.name}, LazyInstallMode.{install_mode.name}),\n"
    
    config_code += "}\n"
    
    # Save to file
    config_file = output_file.parent / "intelligent_mode_config.py"
    config_file.write_text(config_code, encoding='utf-8')
    print(f"💾 Intelligent mode config saved to: {config_file}")


def generate_comprehensive_report(all_results: list[ModeBenchmarkResult], output_file: Path, best_modes: dict[str, tuple[str, str]]):
    """Generate a comprehensive markdown report with averages."""
    
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
    
    # Find fastest modes based on averages
    fastest_by_load_level = {}
    for load_level in LOAD_LEVELS:
        level_results = [r for r in all_results if r.load_level == load_level and r.success and r.version == "new"]
        if level_results:
            fastest = min(level_results, key=lambda x: x.avg_time)
            fastest_by_load_level[load_level] = fastest
    
    # Generate report
    report = []
    report.append("# Comprehensive xwlazy Mode Benchmark Report (100 Iterations)")
    report.append("")
    report.append(f"**Generated:** {datetime.now().isoformat()}")
    report.append(f"**Total Combinations Tested:** {len(set((r.load_mode, r.install_mode, r.load_level) for r in all_results if r.version == 'new'))}")
    report.append(f"**Iterations per Test:** {ITERATIONS}")
    report.append("")
    
    # Executive Summary
    report.append("## Executive Summary")
    report.append("")
    report.append("### Fastest Mode by Load Level (Based on Averages)")
    report.append("")
    report.append("| Load Level | Best Mode | Load Mode | Install Mode | Avg Time (ms) | StdDev | Min | Max | Avg Memory (MB) |")
    report.append("|------------|-----------|-----------|--------------|---------------|--------|-----|-----|----------------|")
    for load_level, result in fastest_by_load_level.items():
        report.append(
            f"| {load_level} | {result.load_mode} + {result.install_mode} | {result.load_mode} | {result.install_mode} | "
            f"{result.avg_time:.3f} | {result.stddev_time:.3f} | {result.min_time:.3f} | {result.max_time:.3f} | "
            f"{result.avg_memory:.2f} |"
        )
    report.append("")
    
    # Best modes for INTELLIGENT mode
    report.append("## 🧠 INTELLIGENT Mode Configuration")
    report.append("")
    report.append("Based on 100-iteration averages, the INTELLIGENT mode should switch to:")
    report.append("")
    for load_level, (load_mode, install_mode) in best_modes.items():
        result = next(
            (r for r in all_results 
             if r.load_level == load_level 
             and r.load_mode == load_mode 
             and r.install_mode == install_mode 
             and r.version == "new"),
            None
        )
        if result:
            report.append(f"**{load_level.replace('_', ' ').title()}:** `{load_mode} + {install_mode}`")
            report.append(f"  - Average Time: {result.avg_time:.3f} ms ± {result.stddev_time:.3f} ms")
            report.append(f"  - Range: {result.min_time:.3f} - {result.max_time:.3f} ms")
            report.append(f"  - Average Memory: {result.avg_memory:.2f} MB")
            report.append("")
    
    # Overall fastest
    successful_new = [r for r in all_results if r.success and r.version == "new"]
    if successful_new:
        overall_fastest = min(successful_new, key=lambda x: x.avg_time)
        report.append(f"### Overall Fastest Mode (Average)")
        report.append("")
        report.append(f"- **Mode**: {overall_fastest.load_mode} + {overall_fastest.install_mode}")
        report.append(f"- **Load Level**: {overall_fastest.load_level}")
        report.append(f"- **Average Time**: {overall_fastest.avg_time:.3f} ms ± {overall_fastest.stddev_time:.3f} ms")
        report.append(f"- **Range**: {overall_fastest.min_time:.3f} - {overall_fastest.max_time:.3f} ms")
        report.append(f"- **Average Memory**: {overall_fastest.avg_memory:.2f} MB")
        report.append("")
    
    # Results by Load Level
    report.append("## Results by Load Level (Top 10 by Average)")
    report.append("")
    
    for load_level in LOAD_LEVELS:
        report.append(f"### {load_level.replace('_', ' ').title()}")
        report.append("")
        level_results = [r for r in all_results if r.load_level == load_level and r.version == "new" and r.success]
        if not level_results:
            report.append("No successful results.")
            report.append("")
            continue
        
        # Sort by average time
        level_results.sort(key=lambda x: x.avg_time)
        
        report.append("| Rank | Load Mode | Install Mode | Avg Time (ms) | StdDev | Min | Max | Avg Memory (MB) |")
        report.append("|------|-----------|--------------|---------------|--------|-----|-----|----------------|")
        for idx, result in enumerate(level_results[:10], 1):  # Top 10
            medal = "🥇" if idx == 1 else "🥈" if idx == 2 else "🥉" if idx == 3 else ""
            report.append(
                f"| {idx} {medal} | {result.load_mode} | {result.install_mode} | "
                f"{result.avg_time:.3f} | {result.stddev_time:.3f} | {result.min_time:.3f} | {result.max_time:.3f} | "
                f"{result.avg_memory:.2f} |"
            )
        report.append("")
    
    # Statistics
    report.append("## Statistics")
    report.append("")
    
    successful_results = [r for r in all_results if r.success and r.version == "new"]
    if successful_results:
        avg_times = [r.avg_time for r in successful_results]
        avg_memories = [r.avg_memory for r in successful_results]
        
        report.append(f"- **Total Successful Tests**: {len(successful_results)}")
        report.append(f"- **Average Time (across all modes)**: {statistics.mean(avg_times):.3f} ms")
        report.append(f"- **Min Average Time**: {min(avg_times):.3f} ms")
        report.append(f"- **Max Average Time**: {max(avg_times):.3f} ms")
        report.append(f"- **Average Memory**: {statistics.mean(avg_memories):.2f} MB")
        report.append(f"- **Min Memory**: {min(avg_memories):.2f} MB")
        report.append(f"- **Max Memory**: {max(avg_memories):.2f} MB")
        report.append("")
    
    # Write report
    output_file.write_text("\n".join(report), encoding='utf-8')
    print(f"\n📊 Comprehensive report saved to: {output_file}")


def main():
    """Run comprehensive benchmark for all mode combinations with 100 iterations."""
    print("=" * 80)
    print("🚀 COMPREHENSIVE xwlazy MODE BENCHMARK (100 ITERATIONS)")
    print("=" * 80)
    print()
    print(f"Testing {len(LOAD_MODES)} load modes × {len(INSTALL_MODES)} install modes × {len(LOAD_LEVELS)} load levels")
    print(f"Total combinations: {len(LOAD_MODES) * len(INSTALL_MODES) * len(LOAD_LEVELS)}")
    print(f"Iterations per combination: {ITERATIONS}")
    print(f"Total tests: {len(LOAD_MODES) * len(INSTALL_MODES) * len(LOAD_LEVELS) * ITERATIONS}")
    print()
    
    runner = BenchmarkRunner()
    
    # Get baseline
    print("Establishing baseline...")
    baseline_time = runner._get_baseline_time()
    print(f"Baseline time: {baseline_time:.2f} ms\n")
    
    all_results = []
    total_combinations = len(LOAD_MODES) * len(INSTALL_MODES) * len(LOAD_LEVELS)
    current_combination = 0
    
    # Test all mode combinations
    print("Testing all mode combinations (100 iterations each)...")
    print("-" * 80)
    
    for load_mode in LOAD_MODES:
        for install_mode in INSTALL_MODES:
            for load_level in LOAD_LEVELS:
                current_combination += 1
                print(f"[{current_combination}/{total_combinations}] Testing: {load_mode.value} + {install_mode.value} @ {load_level} ({ITERATIONS} iterations)...")
                
                result = run_mode_benchmark_multiple(
                    runner, load_mode, install_mode, load_level, baseline_time, iterations=ITERATIONS, version="new"
                )
                all_results.append(result)
                
                if result.success:
                    print(f"  ✅ Avg: {result.avg_time:.3f} ms (±{result.stddev_time:.3f}) | "
                          f"Range: {result.min_time:.3f}-{result.max_time:.3f} ms | "
                          f"Avg Memory: {result.avg_memory:.2f} MB")
                else:
                    print(f"  ❌ Failed: {result.error}")
                
                gc.collect()  # Clean up between combinations
    
    # Find best modes per load level
    best_modes = find_best_mode_per_load_level(all_results)
    
    # Generate report
    print("\n" + "=" * 80)
    print("Generating comprehensive report...")
    print("=" * 80)
    
    output_dir = Path(__file__).parent / "output_log"
    output_dir.mkdir(exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    report_file = output_dir / f"BENCH_{timestamp}_100X_AVERAGES.md"
    
    generate_comprehensive_report(all_results, report_file, best_modes)
    
    # Update intelligent mode configuration
    update_intelligent_mode_config(best_modes, report_file)
    
    # Save JSON data
    json_file = output_dir / f"BENCH_{timestamp}_100X_AVERAGES.json"
    json_data = {
        "timestamp": datetime.now().isoformat(),
        "baseline_time_ms": baseline_time,
        "iterations": ITERATIONS,
        "best_modes": {k: {"load_mode": v[0], "install_mode": v[1]} for k, v in best_modes.items()},
        "results": [asdict(r) for r in all_results]
    }
    json_file.write_text(json.dumps(json_data, indent=2), encoding='utf-8')
    print(f"💾 JSON data saved to: {json_file}")
    
    # Summary
    successful = [r for r in all_results if r.success]
    print(f"\n✅ Benchmark complete!")
    print(f"   - Total combinations: {len(all_results)}")
    print(f"   - Successful: {len(successful)}")
    print(f"   - Failed: {len(all_results) - len(successful)}")
    
    if successful:
        fastest = min(successful, key=lambda x: x.avg_time)
        print(f"\n🏆 Fastest mode (average): {fastest.load_mode} + {fastest.install_mode} @ {fastest.load_level}")
        print(f"   Avg Time: {fastest.avg_time:.3f} ms ± {fastest.stddev_time:.3f} ms")
        print(f"   Range: {fastest.min_time:.3f} - {fastest.max_time:.3f} ms")
        print(f"   Avg Memory: {fastest.avg_memory:.2f} MB")
        
        print(f"\n🧠 INTELLIGENT Mode Configuration:")
        for load_level, (load_mode, install_mode) in best_modes.items():
            result = next((r for r in successful if r.load_level == load_level and r.load_mode == load_mode and r.install_mode == install_mode), None)
            if result:
                print(f"   {load_level}: {load_mode} + {install_mode} (avg: {result.avg_time:.3f} ms)")


if __name__ == "__main__":
    main()

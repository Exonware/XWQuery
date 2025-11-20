#!/usr/bin/env python3
"""
Quick consistency test - Run key modes multiple times to check repeatability.
"""
import os
import sys
import json
import statistics
from pathlib import Path
from typing import Dict, List
from datetime import datetime

# Add src to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent / "src"))

from benchmark_competition import BenchmarkRunner
from exonware.xwlazy.contracts import LazyLoadMode, LazyInstallMode

# Test the winning modes from first benchmark
TEST_MODES = [
    # Winners from first run
    ("auto", "smart", "light_load"),
    ("hyperparallel", "full", "medium_load"),
    ("preload", "size_aware", "heavy_load"),
    ("preload", "full", "enterprise_load"),
    # Runner-ups
    ("background", "clean", "light_load"),
    ("streaming", "clean", "light_load"),
    ("ultra", "full", "light_load"),
]

ITERATIONS = 20  # 20 iterations for quick consistency check

def run_test(runner, load_mode_str, install_mode_str, load_level, iterations):
    """Run a test multiple times and return statistics."""
    load_mode = LazyLoadMode(load_mode_str)
    install_mode = LazyInstallMode(install_mode_str)
    
    test_mode_name = f"consistency_{load_mode_str}_{install_mode_str}"
    config = {
        "load_mode": load_mode.value,
        "install_mode": install_mode.value,
    }
    
    from benchmark_competition import TEST_MODES
    TEST_MODES[test_mode_name] = {
        "description": f"Consistency test: {load_mode_str} + {install_mode_str}",
        "xwlazy_config": config,
        "category": "Consistency Test",
    }
    
    test_func_map = {
        "light_load": runner.test_light_load,
        "medium_load": runner.test_medium_load,
        "heavy_load": runner.test_heavy_load,
        "enterprise_load": runner.test_enterprise_load,
    }
    
    test_func = test_func_map.get(load_level)
    if not test_func:
        return None
    
    times = []
    memories = []
    baseline_time = runner._get_baseline_time()
    
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
            import gc
            gc.collect()
        except Exception as e:
            print(f"  Iteration {i+1} failed: {e}")
            continue
    
    if not times:
        return None
    
    return {
        "load_mode": load_mode_str,
        "install_mode": install_mode_str,
        "load_level": load_level,
        "iterations": len(times),
        "avg_time": statistics.mean(times),
        "min_time": min(times),
        "max_time": max(times),
        "stddev_time": statistics.stdev(times) if len(times) > 1 else 0.0,
        "avg_memory": statistics.mean(memories),
        "times": times,
        "memories": memories,
    }

def main():
    print("=" * 80)
    print("🔄 CONSISTENCY TEST - Verifying repeatability of winning modes")
    print("=" * 80)
    print(f"Iterations per test: {ITERATIONS}")
    print(f"Total tests: {len(TEST_MODES)}")
    print()
    
    runner = BenchmarkRunner()
    baseline_time = runner._get_baseline_time()
    print(f"Baseline time: {baseline_time:.2f} ms\n")
    
    results = []
    
    for idx, (load_mode_str, install_mode_str, load_level) in enumerate(TEST_MODES, 1):
        print(f"[{idx}/{len(TEST_MODES)}] Testing: {load_mode_str} + {install_mode_str} @ {load_level} ({ITERATIONS} iterations)...")
        
        result = run_test(runner, load_mode_str, install_mode_str, load_level, ITERATIONS)
        
        if result:
            results.append(result)
            print(f"  ✅ Avg: {result['avg_time']:.3f} ms (±{result['stddev_time']:.3f}) | "
                  f"Range: {result['min_time']:.3f}-{result['max_time']:.3f} ms | "
                  f"CV: {(result['stddev_time']/result['avg_time']*100):.2f}%")
        else:
            print(f"  ❌ Failed")
        print()
    
    # Summary
    print("=" * 80)
    print("📊 CONSISTENCY SUMMARY")
    print("=" * 80)
    print()
    
    print("| Mode | Load Level | Avg (ms) | StdDev | Min | Max | CV% |")
    print("|------|------------|----------|--------|-----|-----|-----|")
    for r in results:
        cv = (r['stddev_time'] / r['avg_time'] * 100) if r['avg_time'] > 0 else 0
        print(f"| {r['load_mode']} + {r['install_mode']} | {r['load_level']} | "
              f"{r['avg_time']:.3f} | {r['stddev_time']:.3f} | "
              f"{r['min_time']:.3f} | {r['max_time']:.3f} | {cv:.2f}% |")
    
    # Save results
    output_dir = Path(__file__).parent / "output_log"
    output_dir.mkdir(exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    json_file = output_dir / f"CONSISTENCY_{timestamp}_{ITERATIONS}iter.json"
    json_file.write_text(json.dumps({
        "timestamp": datetime.now().isoformat(),
        "iterations": ITERATIONS,
        "baseline_time_ms": baseline_time,
        "results": results
    }, indent=2), encoding='utf-8')
    
    print()
    print(f"💾 Results saved to: {json_file}")
    
    # Compare with first run
    print()
    print("🔍 Comparison with first benchmark run:")
    print()
    
    first_run_winners = {
        ("auto", "smart", "light_load"): 0.706,
        ("hyperparallel", "full", "medium_load"): 4.162,
        ("preload", "size_aware", "heavy_load"): 15.372,
        ("preload", "full", "enterprise_load"): 40.041,
    }
    
    print("| Mode | Load Level | First Run | This Run (Avg) | Difference |")
    print("|------|------------|-----------|----------------|------------|")
    for r in results:
        key = (r['load_mode'], r['install_mode'], r['load_level'])
        first_time = first_run_winners.get(key)
        if first_time:
            diff = r['avg_time'] - first_time
            diff_pct = (diff / first_time * 100) if first_time > 0 else 0
            print(f"| {r['load_mode']} + {r['install_mode']} | {r['load_level']} | "
                  f"{first_time:.3f} ms | {r['avg_time']:.3f} ms | "
                  f"{diff:+.3f} ms ({diff_pct:+.1f}%) |")

if __name__ == "__main__":
    main()


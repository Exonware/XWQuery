#!/usr/bin/env python3
"""
Benchmark performance improvements - Compare optimized vs previous results.
"""
import os
import sys
import json
import statistics
import time
from pathlib import Path
from datetime import datetime

# Add src to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent / "src"))

from benchmark_competition import BenchmarkRunner
from exonware.xwlazy.contracts import LazyLoadMode, LazyInstallMode

# Previous benchmark results (from BENCH_20251119_0407_COMPETITION.md)
PREVIOUS_RESULTS = {
    "light_load": 1.01,      # ms
    "medium_load": 6.24,    # ms
    "heavy_load": 17.76,    # ms
    "enterprise_load": 33.89, # ms
}

ITERATIONS = 30  # 30 iterations for good statistical confidence

def run_benchmark(runner, load_level: str, iterations: int):
    """Run INTELLIGENT mode benchmark for a load level."""
    test_mode_name = "intelligent_mode_optimized"
    config = {
        "load_mode": "intelligent",
        "install_mode": "smart",  # Will be overridden by intelligent mode
    }
    
    from benchmark_competition import TEST_MODES
    TEST_MODES[test_mode_name] = {
        "description": "INTELLIGENT mode (optimized)",
        "xwlazy_config": config,
        "category": "Performance Test",
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
    
    print(f"\n{'='*60}")
    print(f"Testing {load_level.upper()} - {iterations} iterations")
    print(f"{'='*60}")
    
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
                if (i + 1) % 10 == 0:
                    print(f"  Completed {i+1}/{iterations} iterations...")
            import gc
            gc.collect()
            time.sleep(0.01)  # Small delay to avoid system overload
        except Exception as e:
            print(f"  Iteration {i+1} failed: {e}")
            continue
    
    if not times:
        return None
    
    avg_time = statistics.mean(times)
    min_time = min(times)
    max_time = max(times)
    stddev_time = statistics.stdev(times) if len(times) > 1 else 0.0
    cv = (stddev_time / avg_time * 100) if avg_time > 0 else 0.0
    
    previous_time = PREVIOUS_RESULTS.get(load_level, 0.0)
    improvement = ((previous_time - avg_time) / previous_time * 100) if previous_time > 0 else 0.0
    
    return {
        "load_level": load_level,
        "iterations": len(times),
        "avg_time": avg_time,
        "min_time": min_time,
        "max_time": max_time,
        "stddev_time": stddev_time,
        "cv_percent": cv,
        "avg_memory": statistics.mean(memories),
        "previous_time": previous_time,
        "improvement_percent": improvement,
        "times": times,
        "memories": memories,
    }

def main():
    """Run performance benchmark."""
    print("="*60)
    print("PERFORMANCE IMPROVEMENT BENCHMARK")
    print("Testing optimized xwlazy vs previous results")
    print("="*60)
    
    runner = BenchmarkRunner()
    
    results = {}
    load_levels = ["light_load", "medium_load", "heavy_load", "enterprise_load"]
    
    for load_level in load_levels:
        result = run_benchmark(runner, load_level, ITERATIONS)
        if result:
            results[load_level] = result
    
    # Print summary
    print("\n" + "="*60)
    print("BENCHMARK RESULTS SUMMARY")
    print("="*60)
    
    print(f"\n{'Load Level':<20} {'Previous':<12} {'Optimized':<12} {'Improvement':<15} {'CV%':<8}")
    print("-" * 70)
    
    for load_level in load_levels:
        if load_level in results:
            r = results[load_level]
            improvement_str = f"{r['improvement_percent']:+.1f}%"
            if r['improvement_percent'] > 0:
                improvement_str = f"✅ {improvement_str}"
            else:
                improvement_str = f"❌ {improvement_str}"
            
            print(f"{load_level:<20} {r['previous_time']:>8.2f} ms  {r['avg_time']:>8.2f} ms  {improvement_str:<15} {r['cv_percent']:>6.1f}%")
    
    # Detailed statistics
    print("\n" + "="*60)
    print("DETAILED STATISTICS")
    print("="*60)
    
    for load_level in load_levels:
        if load_level in results:
            r = results[load_level]
            print(f"\n{load_level.upper()}:")
            print(f"  Previous:     {r['previous_time']:.2f} ms")
            print(f"  Optimized:     {r['avg_time']:.2f} ms (avg)")
            print(f"  Min:           {r['min_time']:.2f} ms")
            print(f"  Max:           {r['max_time']:.2f} ms")
            print(f"  Std Dev:       {r['stddev_time']:.2f} ms")
            print(f"  CV:            {r['cv_percent']:.1f}%")
            print(f"  Improvement:   {r['improvement_percent']:+.1f}%")
            print(f"  Memory:        {r['avg_memory']:.2f} MB (avg)")
    
    # Save results
    output_file = Path(__file__).parent / "output_log" / f"PERF_IMPROVEMENT_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    output_file.parent.mkdir(exist_ok=True)
    
    with open(output_file, 'w') as f:
        json.dump({
            "timestamp": datetime.now().isoformat(),
            "iterations": ITERATIONS,
            "previous_results": PREVIOUS_RESULTS,
            "optimized_results": results,
        }, f, indent=2)
    
    print(f"\n✅ Results saved to: {output_file}")
    
    # Overall summary
    total_improvement = sum(r['improvement_percent'] for r in results.values()) / len(results)
    print(f"\n{'='*60}")
    print(f"OVERALL AVERAGE IMPROVEMENT: {total_improvement:+.1f}%")
    print(f"{'='*60}")

if __name__ == "__main__":
    main()

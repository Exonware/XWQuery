#!/usr/bin/env python3
"""
#xwlazy/benchmarks/competition_tests/run_benchmark.py

Quick start script for running competition benchmarks.

This script provides an easy way to run benchmarks with common configurations.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 1.0.0
Generation Date: 17-Nov-2025
"""

import sys
import subprocess
from pathlib import Path


def main():
    """Run benchmarks with default settings."""
    script_dir = Path(__file__).parent
    benchmark_script = script_dir / "benchmark_competition.py"

    print("=" * 80)
    print("Competition Benchmark: xwlazy vs. Lazy Import Libraries")
    print("=" * 80)
    print()
    print("This will:")
    print("  1. Test all libraries (or specify with --library)")
    print("  2. Run all test scenarios (or specify with --test)")
    print("  3. Uninstall each library before testing")
    print("  4. Generate results and reports")
    print()
    print("Note: This may take a while as it installs/uninstalls packages.")
    print()

    response = input("Continue? (y/n): ")
    if response.lower() != "y":
        print("Cancelled.")
        return

    # Run the benchmark
    cmd = [sys.executable, str(benchmark_script)] + sys.argv[1:]
    subprocess.run(cmd)


if __name__ == "__main__":
    main()


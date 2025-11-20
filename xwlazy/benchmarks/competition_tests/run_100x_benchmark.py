#!/usr/bin/env python3
"""
Quick runner for 100x benchmark - handles imports correctly
"""
import sys
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent / "src"))

# Run the benchmark
if __name__ == "__main__":
    import benchmark_all_modes_100x
    benchmark_all_modes_100x.main()


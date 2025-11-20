#!/usr/bin/env python3
"""
Quick runner for benchmark to test INTELLIGENT mode
"""
import sys
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent / "src"))

if __name__ == "__main__":
    import benchmark_all_modes
    benchmark_all_modes.main()


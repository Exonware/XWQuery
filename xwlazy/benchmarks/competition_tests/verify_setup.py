#!/usr/bin/env python3
"""
#xwlazy/benchmarks/competition_tests/verify_setup.py

Verify that the benchmark setup is correct.

Checks for required dependencies and verifies the project structure.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 1.0.0
Generation Date: 17-Nov-2025
"""

import sys
import io
from pathlib import Path

# Fix Windows console encoding for Unicode characters
if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')


def check_dependencies():
    """Check if required dependencies are installed."""
    print("Checking dependencies...")
    
    required = {
        "psutil": "psutil",
        "pkg_resources": "setuptools",
    }
    
    missing = []
    for module, package in required.items():
        try:
            __import__(module)
            print(f"  ✅ {package}")
        except ImportError:
            print(f"  ❌ {package} (missing)")
            missing.append(package)
    
    if missing:
        print(f"\n⚠️  Missing dependencies. Install with:")
        print(f"   pip install {' '.join(missing)}")
        return False
    
    return True


def check_structure():
    """Check if project structure is correct."""
    print("\nChecking project structure...")
    
    script_dir = Path(__file__).parent
    required_files = [
        "benchmark_competition.py",
        "feature_comparison.py",
        "library_adapters.py",
        "test_scenarios.py",
        "requirements.txt",
        "README.md",
    ]
    
    all_present = True
    for file in required_files:
        path = script_dir / file
        if path.exists():
            print(f"  ✅ {file}")
        else:
            print(f"  ❌ {file} (missing)")
            all_present = False
    
    # Check output directory
    output_dir = script_dir / "output_log"
    if output_dir.exists():
        print(f"  ✅ output_log/")
    else:
        print(f"  ⚠️  output_log/ (will be created)")
        output_dir.mkdir(exist_ok=True)
    
    return all_present


def check_python_version():
    """Check Python version."""
    print("\nChecking Python version...")
    version = sys.version_info
    print(f"  Python {version.major}.{version.minor}.{version.micro}")
    
    if version.major < 3 or (version.major == 3 and version.minor < 7):
        print("  ⚠️  Python 3.7+ recommended")
        return False
    
    print("  ✅ Version OK")
    return True


def main():
    """Run all checks."""
    print("=" * 80)
    print("Benchmark Setup Verification")
    print("=" * 80)
    
    checks = [
        ("Python Version", check_python_version),
        ("Dependencies", check_dependencies),
        ("Project Structure", check_structure),
    ]
    
    results = []
    for name, check_func in checks:
        try:
            result = check_func()
            results.append((name, result))
        except Exception as e:
            print(f"  ❌ Error: {e}")
            results.append((name, False))
    
    print("\n" + "=" * 80)
    print("Summary")
    print("=" * 80)
    
    all_ok = True
    for name, result in results:
        status = "✅" if result else "❌"
        print(f"{status} {name}")
        if not result:
            all_ok = False
    
    if all_ok:
        print("\n✅ Setup verification complete! Ready to run benchmarks.")
    else:
        print("\n⚠️  Some checks failed. Please fix issues before running benchmarks.")
    
    return 0 if all_ok else 1


if __name__ == "__main__":
    sys.exit(main())

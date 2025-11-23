#!/usr/bin/env python3
"""
#exonware/xwlazy/tests/runner.py

Main test runner for xwlazy.
Coordinates all test layers and records a single Markdown summary under docs/tests.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1
Generation Date: 11-Oct-2025

Usage:
    python tests/runner.py # Run all tests
    python tests/runner.py --core # Run only core tests
    python tests/runner.py --unit # Run only unit tests
    python tests/runner.py --integration # Run only integration tests
"""

import sys
import subprocess
from pathlib import Path
from datetime import datetime

# ?? CRITICAL: Configure UTF-8 encoding for Windows console (GUIDE_TEST.md compliance)
if sys.platform == "win32":
    try:
        import io
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
    except Exception:
        pass  # If reconfiguration fails, continue with default encoding

def run_sub_runner(runner_path: Path, description: str) -> int:
    """Run a sub-runner and return exit code."""
    print("\n" + "=" * 80)
    print(f"🔍 {description}")
    print("=" * 80 + "\n")
    
    result = subprocess.run(
        [sys.executable, str(runner_path)],
        cwd=runner_path.parent.parent
    )
    
    status = "✅ PASSED" if result.returncode == 0 else "❌ FAILED"
    print(f"\n{status}\n")
    
    return result.returncode

def main():
    """Main test runner function following GUIDE_TEST.md."""
    test_dir = Path(__file__).parent
    project_root = test_dir.parent
    
    # Setup output directory
    reports_dir = project_root / "docs" / "tests"
    reports_dir.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M")
    output_file = reports_dir / f"TEST_{timestamp}_SUMMARY.md"
    
    # Add src to Python path for testing
    src_path = project_root / "src"
    sys.path.insert(0, str(src_path))
    
    # Header
    print("=" * 80)
    print("xwlazy Test Runner")
    print("Main Orchestrator - Hierarchical Test Execution")
    print("=" * 80)
    print(f"\n📁 Test Directory: {test_dir.absolute()}")
    print(f"📁 Project Root: {project_root.absolute()}")
    print(f"📄 Output File: {output_file.absolute()}\n")
    
    # Parse arguments
    args = sys.argv[1:]
    
    # Define sub-runners
    core_runner = test_dir / "0.core" / "runner.py"
    unit_runner = test_dir / "1.unit" / "runner.py"
    integration_runner = test_dir / "2.integration" / "runner.py"
    
    exit_codes = []
    
    # Determine which tests to run
    if "--core" in args:
        if core_runner.exists():
            exit_codes.append(run_sub_runner(core_runner, "Layer 0: Core Tests"))
        else:
            print("⚠️  Core runner not found")
    
    elif "--unit" in args:
        if unit_runner.exists():
            exit_codes.append(run_sub_runner(unit_runner, "Layer 1: Unit Tests"))
        else:
            print("⚠️  Unit runner not found")
    
    elif "--integration" in args:
        if integration_runner.exists():
            exit_codes.append(run_sub_runner(integration_runner, "Layer 2: Integration Tests"))
        else:
            print("⚠️  Integration runner not found")
    
    else:
        # Run all tests in sequence
        print("\n🚀 Running: ALL Tests")
        print("Layers: 0.core → 1.unit → 2.integration\n")
        
        # Core tests
        if core_runner.exists():
            exit_codes.append(run_sub_runner(core_runner, "Layer 0: Core Tests"))
        
        # Unit tests
        if unit_runner.exists():
            exit_codes.append(run_sub_runner(unit_runner, "Layer 1: Unit Tests"))
        
        # Integration tests
        if integration_runner.exists():
            exit_codes.append(run_sub_runner(integration_runner, "Layer 2: Integration Tests"))
    
    # Print summary
    print("\n" + "=" * 80)
    print("📊 TEST EXECUTION SUMMARY")
    print("=" * 80)
    
    total_runs = len(exit_codes)
    passed = sum(1 for code in exit_codes if code == 0)
    failed = total_runs - passed
    
    print(f"Total Layers: {total_runs}")
    print(f"✅ Passed: {passed}")
    print(f"❌ Failed: {failed}")
    
    # Final status
    if all(code == 0 for code in exit_codes):
        print("\n🎉 ALL TESTS PASSED!")
        # Save simple summary
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(f"# Test Execution Report\n\n")
            f.write(f"**Library:** xwlazy\n")
            f.write(f"**Generated:** {datetime.now().strftime('%d-%b-%Y %H:%M:%S')}\n")
            f.write(f"**Runner:** Main Orchestrator\n\n")
            f.write(f"---\n\n")
            f.write(f"## Summary\n\n")
            f.write(f"- **Total Layers:** {total_runs}\n")
            f.write(f"- **Passed:** {passed}\n")
            f.write(f"- **Failed:** {failed}\n\n")
            f.write(f"### ✅ ALL TESTS PASSED!\n")
        print(f"📄 Test results saved to: {output_file}")
        sys.exit(0)
    else:
        print("\n💥 SOME TESTS FAILED!")
        # Save simple summary
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(f"# Test Execution Report\n\n")
            f.write(f"**Library:** xwlazy\n")
            f.write(f"**Generated:** {datetime.now().strftime('%d-%b-%Y %H:%M:%S')}\n")
            f.write(f"**Runner:** Main Orchestrator\n\n")
            f.write(f"---\n\n")
            f.write(f"## Summary\n\n")
            f.write(f"- **Total Layers:** {total_runs}\n")
            f.write(f"- **Passed:** {passed}\n")
            f.write(f"- **Failed:** {failed}\n\n")
            f.write(f"### ❌ SOME TESTS FAILED!\n")
        print(f"📄 Test results saved to: {output_file}")
        sys.exit(1)

if __name__ == "__main__":
    main()


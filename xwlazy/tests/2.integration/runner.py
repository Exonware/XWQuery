#!/usr/bin/env python3
"""
#exonware/xwlazy/tests/2.integration/runner.py

Integration test runner for xwlazy.
Cross-module scenario tests that verify real-world usage patterns.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com

Generation Date: 15-Nov-2025

Usage:
    python tests/2.integration/runner.py
"""

import sys
import subprocess
from pathlib import Path

# ?? CRITICAL: Configure UTF-8 encoding for Windows console (GUIDE_TEST.md compliance)
if sys.platform == "win32":
    try:
        import io
        sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
        sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')
    except Exception:
        pass  # If reconfiguration fails, continue with default encoding

def main():
    """Run integration tests."""
    test_dir = Path(__file__).parent
    project_root = test_dir.parent.parent
    
    # Add src to Python path
    src_path = project_root / "src"
    if str(src_path) not in sys.path:
        sys.path.insert(0, str(src_path))
    
    print("=" * 80)
    print("xwlazy Integration Test Runner")
    print("Cross-Module Scenario Tests")
    print("=" * 80)
    print(f"\n📁 Test Directory: {test_dir.absolute()}")
    print(f"📁 Source Path: {src_path.absolute()}\n")
    
    # Run pytest with integration marker
    result = subprocess.run(
        [sys.executable, "-m", "pytest", str(test_dir), "-m", "xwlazy_integration", "-v", "--tb=short"],
        cwd=project_root
    )
    
    print("\n" + "=" * 80)
    if result.returncode == 0:
        print("✅ Integration tests PASSED")
    else:
        print("❌ Integration tests FAILED")
    print("=" * 80)
    
    return result.returncode

if __name__ == "__main__":
    sys.exit(main())


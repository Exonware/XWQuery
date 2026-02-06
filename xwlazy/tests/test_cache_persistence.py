#!/usr/bin/env python3
"""
Test to verify that xwlazy cache persists across Python sessions (L2 disk cache).

This test runs in a subprocess to simulate a fresh Python session and verify
that packages installed in a previous session are not reinstalled.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
"""

import sys
import subprocess
from pathlib import Path

def run_test_session(test_num, should_install):
    """Run a test in a fresh Python subprocess."""
    test_script = f"""
import sys
from pathlib import Path

# Add xwlazy to path
xwlazy_src = Path(r'{Path(__file__).parent.parent / "src"}')
sys.path.insert(0, str(xwlazy_src))

from exonware.xwlazy import hook

# Enable xwlazy
instance = hook(root=".", default_enabled=True, enable_global_hook=True)

print(f"[SESSION {test_num}] Importing numpy...")
try:
    import numpy
    print(f"[OK] numpy imported: {{numpy.__version__}}")
except Exception as e:
    print(f"[FAIL] Failed: {{e}}")
"""
    
    result = subprocess.run(
        [sys.executable, "-c", test_script],
        capture_output=True,
        text=True,
        cwd=Path(__file__).parent.parent
    )
    
    output = result.stdout + result.stderr
    print(output)
    
    # Check if install message appeared
    has_install = "[INSTALL]" in output
    if should_install:
        return has_install, output
    else:
        return not has_install, output

if __name__ == "__main__":
    print("=" * 70)
    print("Testing xwlazy cache persistence across Python sessions")
    print("=" * 70)
    
    # First session - should install
    print("\n[SESSION 1] First run - should INSTALL numpy")
    print("-" * 70)
    installed, output1 = run_test_session(1, should_install=True)
    if not installed:
        print("[WARN] Expected install message in first session")
    
    # Second session - should NOT install (should use L2 disk cache)
    print("\n[SESSION 2] Second run (fresh Python process) - should NOT install")
    print("-" * 70)
    should_not_install, output2 = run_test_session(2, should_install=False)
    if not should_not_install:
        print("[SUCCESS] No install message - cache is working!")
    else:
        print("[FAIL] Install message appeared - cache is NOT persisting!")
        print("This suggests the L2 disk cache is not being used properly.")
        sys.exit(1)
    
    print("\n" + "=" * 70)
    print("TEST COMPLETE")
    print("=" * 70)
    print("\nIf SESSION 2 showed an '[INSTALL]' message, the disk cache (L2) is not working.")
    print("You should only see '[INSTALL]' in SESSION 1.")

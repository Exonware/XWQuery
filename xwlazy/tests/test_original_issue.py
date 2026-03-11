#!/usr/bin/env python3
"""
Test to verify the original issue is fixed: packages should not reinstall
when imported multiple times within the same Python session.
This simulates the user's original problem where numpy and regex were
being reinstalled every time, even within the same session.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
"""

import sys
import warnings
from pathlib import Path
# Add xwlazy to path
xwlazy_src = Path(__file__).parent.parent / "src"
sys.path.insert(0, str(xwlazy_src))
from exonware.xwlazy import hook, clear_cache
import importlib

def test_no_reinstall():
    """Test that packages are not reinstalled when imported multiple times."""
    print("=" * 70)
    print("Testing: Packages should NOT reinstall within same session")
    print("=" * 70)
    # Clear cache to start fresh
    clear_cache()
    # Enable xwlazy
    instance = hook(root=".", default_enabled=True, enable_global_hook=True)
    install_count = 0
    # Simulate multiple imports of numpy (re-import triggers numpy's "reloaded" warning; suppress it)
    with warnings.catch_warnings():
        warnings.filterwarnings("ignore", message=".*reloaded.*", category=UserWarning)
        for i in range(3):
            print(f"\n[ITERATION {i+1}] Importing numpy...")
            if "numpy" in sys.modules:
                del sys.modules["numpy"]
            importlib.invalidate_caches()
            import io
            from contextlib import redirect_stdout
            f = io.StringIO()
            with redirect_stdout(f):
                import numpy  # noqa: E402
                output = f.getvalue()
                if "[INSTALL]" in output:
                    install_count += 1
                    print("  [FAIL] Install message appeared (this should not happen after first import)")
                else:
                    print("  [OK] No install message - using cache")
    print(f"\n[RESULT] Total install messages: {install_count}")
    assert install_count <= 1, f"Cache not working: {install_count} install messages (expected 0 or 1)"
    if install_count == 1:
        print("[SUCCESS] Only one install message (for first import) - cache is working!")
    elif install_count == 0:
        print("[INFO] No install messages - numpy might already be installed")
if __name__ == "__main__":
    test_no_reinstall()

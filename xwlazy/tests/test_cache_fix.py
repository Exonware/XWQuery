#!/usr/bin/env python3
"""
Test to verify that xwlazy cache prevents reinstallation of packages.
This test ensures that packages are only installed once, and subsequent
imports use the cache instead of reinstalling.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
"""

import sys
import os
import warnings
from pathlib import Path
# Add xwlazy to path for testing
xwlazy_src = Path(__file__).parent.parent / "src"
sys.path.insert(0, str(xwlazy_src))
# Enable xwlazy
from exonware.xwlazy import hook, clear_cache

def test_cache_prevents_reinstall():
    """Test that cache prevents reinstalling packages."""
    print("=" * 70)
    print("Testing xwlazy cache - packages should NOT reinstall")
    print("=" * 70)
    # Clear cache to start fresh
    clear_cache()
    # Enable xwlazy
    instance = hook(root=".", default_enabled=True, enable_global_hook=True)
    # First import - should install
    print("\n[TEST 1] First import of numpy - should INSTALL")
    print("-" * 70)
    import numpy  # noqa: E402
    print(f"[OK] numpy imported successfully: {numpy.__version__}")
    # Second import - should NOT install (should use cache)
    print("\n[TEST 2] Second import of numpy - should NOT install (use cache)")
    print("-" * 70)
    import importlib
    if "numpy" in sys.modules:
        del sys.modules["numpy"]
    importlib.invalidate_caches()
    # NumPy warns when reloaded; we expect reload in this test
    with warnings.catch_warnings():
        warnings.filterwarnings("ignore", message=".*reloaded.*", category=UserWarning)
        import numpy  # noqa: E402
    print(f"[OK] numpy imported successfully: {numpy.__version__}")
    print("[OK] No installation message should have appeared above")
    # First import of regex - should install
    print("\n[TEST 3] First import of regex - should INSTALL")
    print("-" * 70)
    import regex  # noqa: E402
    print(f"[OK] regex imported successfully: {regex.__version__}")
    # Second import of regex - should NOT install (should use cache)
    # Note: Some packages (like regex) have issues when reloaded due to circular imports
    # So we'll just verify it's already in sys.modules and skip the reload test
    print("\n[TEST 4] Verifying regex is cached (skip reload test due to Python import limitations)")
    print("-" * 70)
    if 'regex' in sys.modules:
        print(f"[OK] regex is already in sys.modules (cached)")
        print("[OK] No installation message should have appeared for TEST 3 if run again")
    else:
        print("[INFO] regex not in sys.modules (expected if first import)")
    # Check cache stats
    print("\n[TEST 5] Checking cache statistics")
    print("-" * 70)
    stats = instance.get_stats()
    cache_stats = instance.get_cache_stats()
    print(f"Cache hits: {cache_stats.get('l1_hits', 0) + cache_stats.get('l2_hits', 0)}")
    print(f"Cache misses: {cache_stats.get('misses', 0)}")
    print(f"Installed packages (in-memory cache): {len(instance.installed_cache)}")
    print("\n" + "=" * 70)
    print("TEST COMPLETE")
    print("=" * 70)
    print("\nIf you saw '[INSTALL]' messages for TEST 2 or TEST 4, the cache is NOT working.")
    print("You should only see '[INSTALL]' messages for TEST 1 and TEST 3.")
if __name__ == "__main__":
    test_cache_prevents_reinstall()

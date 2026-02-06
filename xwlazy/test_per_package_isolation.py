#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Test per-package isolation in xwlazy-lite."""

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from xwlazy_lite import hook

# Create instance
guardian = hook(default_enabled=True)

# Per-package isolation test
print("Testing Per-Package Isolation:")
print("=" * 50)

# Configure different packages differently
guardian.configure("pandas", enabled=True, mode="lazy", install_strategy="smart")
guardian.configure("numpy", enabled=False)  # Disable numpy
guardian.configure("requests", enabled=True, allow=False)  # Security deny requests

# Check policies
pandas_policy = guardian._get_policy("pandas")
numpy_policy = guardian._get_policy("numpy")
requests_policy = guardian._get_policy("requests")
default_policy = guardian._get_policy("yaml")  # Not configured, should use default

print(f"[OK] Pandas policy: {pandas_policy}")
print(f"[OK] Numpy policy: {numpy_policy}")
print(f"[OK] Requests policy: {requests_policy}")
print(f"[OK] Default policy (yaml): {default_policy}")

# Verify isolation
assert pandas_policy["enabled"] == True, "Pandas should be enabled"
assert pandas_policy["mode"] == "lazy", "Pandas should be lazy mode"
assert pandas_policy["strategy"] == "smart", "Pandas should use smart strategy"

assert numpy_policy["enabled"] == False, "Numpy should be disabled per-package"

assert requests_policy["enabled"] == True, "Requests should be enabled"
assert requests_policy["allow"] == False, "Requests should be denied per-package"

assert default_policy["enabled"] == True, "Default should use global default_enabled"

print("\n[OK] Per-Package Isolation: WORKING CORRECTLY!")
print("=" * 50)

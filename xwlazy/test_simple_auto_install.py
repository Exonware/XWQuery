"""Test script for simple_auto_install.py - Testing LibHelper only"""

import sys
import importlib.util
from pathlib import Path

# Get the path to the simple_auto_install.py file directly
simple_auto_install_path = Path(__file__).parent / "src" / "exonware" / "xwlazy" / "hooks" / "simple_auto_install.py"

# Load the module directly from file path (not through package structure)
spec = importlib.util.spec_from_file_location("simple_auto_install", simple_auto_install_path)
simple_auto_install = importlib.util.module_from_spec(spec)
sys.modules["simple_auto_install"] = simple_auto_install
spec.loader.exec_module(simple_auto_install)

# Get LibHelper from the loaded module
LibHelper = simple_auto_install.LibHelper

print("=" * 60)
print("Testing LibHelper (standalone, no package imports)")
print("=" * 60)

# Step 1: Check initial status using LibHelper
print("\n1. Checking initial status using LibHelper...")
print("\n   Using lib_installed('bson'):")
is_installed = LibHelper.lib_installed('bson')
print(f"   bson installed: {is_installed}")

print("\n   Using lib_uninstalled('bson'):")
is_uninstalled = LibHelper.lib_uninstalled('bson')
print(f"   bson uninstalled: {is_uninstalled}")

print("\n   Using package_installed('pymongo'):")
pkg_installed = LibHelper.package_installed('pymongo')
print(f"   pymongo installed: {pkg_installed}")

print("\n   Using package_uninstalled('pymongo'):")
pkg_uninstalled = LibHelper.package_uninstalled('pymongo')
print(f"   pymongo uninstalled: {pkg_uninstalled}")

# Step 2: Uninstall using LibHelper
print("\n2. Uninstalling pymongo using LibHelper...")
print("   Using lib_uninstall('bson'):")
try:
    LibHelper.lib_uninstall('bson')
except Exception as e:
    print(f"   Error during uninstall: {e}")

# Step 3: Verify uninstallation using LibHelper
print("\n3. Verifying uninstallation using LibHelper...")
print("\n   Using lib_uninstalled('bson'):")
is_uninstalled_after = LibHelper.lib_uninstalled('bson')
print(f"   bson uninstalled: {is_uninstalled_after}")

print("\n   Using package_uninstalled('pymongo'):")
pkg_uninstalled_after = LibHelper.package_uninstalled('pymongo')
print(f"   pymongo uninstalled: {pkg_uninstalled_after}")

# Step 4: Install using LibHelper
print("\n4. Installing pymongo using LibHelper...")
print("   Using lib_install('bson'):")
try:
    LibHelper.lib_install('bson')
except Exception as e:
    print(f"   Error during install: {e}")

# Step 5: Verify installation using LibHelper
print("\n5. Verifying installation using LibHelper...")
print("\n   Using lib_installed('bson'):")
is_installed_after = LibHelper.lib_installed('bson')
print(f"   bson installed: {is_installed_after}")

print("\n   Using package_installed('pymongo'):")
pkg_installed_after = LibHelper.package_installed('pymongo')
print(f"   pymongo installed: {pkg_installed_after}")

# Step 6: Test mapping
print("\n6. Testing mapping...")
print("   Using lib_map('bson'):")
mapped_pkg = LibHelper.lib_map('bson')
print(f"   bson maps to: {mapped_pkg}")

print("\n" + "=" * 60)
print("Test completed!")
print("=" * 60)

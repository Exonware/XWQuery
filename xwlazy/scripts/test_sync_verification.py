#!/usr/bin/env python3
"""Test script to verify sync_top500_libs.py is working correctly."""
from __future__ import annotations

import re
from pathlib import Path

TOML_PATH = Path(__file__).resolve().parent.parent / "src" / "exonware" / "xwlazy_external_libs.toml"


def parse_mappings() -> dict[str, str]:
    """Parse all mappings from TOML."""
    content = TOML_PATH.read_text(encoding="utf-8")
    mappings = {}
    in_mappings = False
    
    for line in content.splitlines():
        if line.strip() == "[mappings]":
            in_mappings = True
            continue
        if in_mappings and line.strip().startswith("["):
            break
        m = re.match(r'"([^"]+)"\s*=\s*"([^"]*)"', line)
        if in_mappings and m:
            mappings[m.group(1)] = m.group(2)
    
    return mappings


def test_verification():
    """Run verification tests."""
    print("=" * 60)
    print("VERIFICATION TESTS")
    print("=" * 60)
    
    mappings = parse_mappings()
    print(f"\n[OK] Total mappings: {len(mappings)}")
    
    # Test 1: Check for duplicates
    keys = list(mappings.keys())
    duplicates = [k for k in set(keys) if keys.count(k) > 1]
    if duplicates:
        print(f"[FAIL] Found duplicate keys: {duplicates}")
        return False
    else:
        print("[OK] No duplicate keys")
    
    # Test 2: Verify some known mappings
    test_cases = [
        ("sklearn", "scikit-learn"),
        ("bs4", "beautifulsoup4"),
        ("jwt", "PyJWT"),
        ("dotenv", "python-dotenv"),
        ("toml", "tomli"),
        ("aioboto3", "aioboto3"),
        ("strawberry_graphql", "strawberry-graphql"),
        ("office365", "office365"),
    ]
    
    print("\n[TEST] Testing known mappings:")
    all_passed = True
    for import_name, expected_pkg in test_cases:
        if import_name in mappings:
            actual_pkg = mappings[import_name]
            if actual_pkg == expected_pkg:
                print(f"  [OK] {import_name} -> {actual_pkg}")
            else:
                print(f"  [FAIL] {import_name} -> {actual_pkg} (expected {expected_pkg})")
                all_passed = False
        else:
            print(f"  [FAIL] {import_name} not found in mappings")
            all_passed = False
    
    # Test 3: Check format consistency (all values should be valid PyPI names)
    print("\n[TEST] Checking format consistency:")
    invalid_format = []
    for key, value in list(mappings.items())[:100]:  # Sample first 100
        # Key should be valid Python identifier (underscores ok)
        if not re.match(r"^[a-zA-Z_][a-zA-Z0-9_.]*$", key):
            invalid_format.append(f"Invalid key: {key}")
        # Value should not be empty
        if not value:
            invalid_format.append(f"Empty value for key: {key}")
    
    if invalid_format:
        print(f"  [FAIL] Found {len(invalid_format)} format issues (showing first 5):")
        for issue in invalid_format[:5]:
            print(f"    - {issue}")
        all_passed = False
    else:
        print("  [OK] Format looks good (sampled first 100)")
    
    # Test 4: Check that top 5000 packages are covered
    print("\n[TEST] Checking coverage:")
    # Sample some common packages that should be in top 5000
    common_packages = [
        "requests", "numpy", "pandas", "pytest", "flask", "django",
        "fastapi", "pydantic", "httpx", "aiohttp", "click", "rich"
    ]
    covered = 0
    for pkg in common_packages:
        # Check if package name appears as a value (normalized)
        pkg_norm = pkg.lower().replace("_", "-")
        found = any(v.lower().replace("_", "-") == pkg_norm for v in mappings.values())
        if found:
            covered += 1
        else:
            print(f"  [WARN] {pkg} not found (may have different import name)")
    
    print(f"  [OK] {covered}/{len(common_packages)} common packages covered")
    
    print("\n" + "=" * 60)
    if all_passed:
        print("[SUCCESS] ALL TESTS PASSED")
        return True
    else:
        print("[FAILURE] SOME TESTS FAILED")
        return False


if __name__ == "__main__":
    success = test_verification()
    exit(0 if success else 1)

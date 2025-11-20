#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Test column projection with WHERE clause"""
import sys
import os
from pathlib import Path

if sys.platform == 'win32':
    os.system('chcp 65001 > nul 2>&1')
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

xwnode_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(xwnode_root / "examples"))

from xwnode_console.console import XWQueryConsole

print("=" * 70)
print("COLUMN PROJECTION WITH WHERE CLAUSE TEST")
print("=" * 70)

console = XWQueryConsole(seed=42, verbose=False)

# Test cases that previously failed
test_queries = [
    "SELECT * FROM users WHERE age > 64",
    "SELECT id FROM users WHERE age > 64",
    "SELECT id, name FROM users WHERE age > 64",
    "SELECT name, age FROM users WHERE age > 30",
]

for query in test_queries:
    print(f"\n[Query] {query}")
    print("-" * 70)
    try:
        console._execute_query(query)
        print("✓ Success!")
    except Exception as e:
        print(f"✗ Failed: {type(e).__name__}: {e}")

print("\n" + "=" * 70)
print("TEST COMPLETE!")
print("=" * 70)


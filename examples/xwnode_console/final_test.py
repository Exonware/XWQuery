#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Final test - Query execution verification
Requires: pip install -e xwsystem && pip install -e xwnode
"""
import sys
import os
from pathlib import Path

if sys.platform == 'win32':
    os.system('chcp 65001 > nul 2>&1')
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')

# Add examples directory for local console imports
xwnode_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(xwnode_root / "examples"))

from xwnode_console.console import XWQueryConsole

print("=" * 70)
print("FINAL QUERY EXECUTION TEST")
print("=" * 70)

console = XWQueryConsole(seed=42, verbose=False)

queries = [
    "SELECT * FROM users WHERE age > 30",
    "SELECT name, age FROM users",
    "SELECT category, COUNT(*) FROM products GROUP BY category",
]

for i, query in enumerate(queries, 1):
    print(f"\n[Test {i}/{len(queries)}] {query}")
    print("-" * 70)
    try:
        console._execute_query(query)
        print("✓ Query executed successfully!")
    except Exception as e:
        print(f"✗ Query failed: {type(e).__name__}: {e}")

print("\n" + "=" * 70)
print("FINAL TEST COMPLETE!")
print("=" * 70)


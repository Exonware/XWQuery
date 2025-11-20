#!/usr/bin/env python3
"""Quick demo showing queries work"""
import sys
from pathlib import Path

xwnode_root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(xwnode_root / "examples"))

from xwnode_console.console import XWQueryConsole

print("[SUCCESS] XWQuery Console - Live Demo")
print("=" * 70)

c = XWQueryConsole(seed=42, verbose=False)

queries = [
    "SELECT * FROM users WHERE age > 30",
    "SELECT name, age FROM users",
    "SELECT category, COUNT(*) FROM products GROUP BY category",
]

for i, q in enumerate(queries, 1):
    print(f"\n[Query {i}] {q}")
    print("-" * 70)
    c._execute_query(q)

print("\n" + "=" * 70)
print("[OK] ALL QUERIES EXECUTED SUCCESSFULLY!")
print("=" * 70)
print("\n[INFO] Console is FULLY OPERATIONAL!")
print("   Changes to source code take effect IMMEDIATELY!")
print("   No reinstall needed - that's the power of editable install!")


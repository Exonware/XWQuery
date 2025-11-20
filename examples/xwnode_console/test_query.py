#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Quick query test - Requires editable install of xwsystem and xwnode"""
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

print("Testing: SELECT * FROM users WHERE age > 30")
print("=" * 70)

console = XWQueryConsole(seed=42, verbose=False)
console._execute_query("SELECT * FROM users WHERE age > 30")

print("\n" + "=" * 70)
print("Query test complete!")


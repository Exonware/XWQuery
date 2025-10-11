#!/usr/bin/env python3
"""Fix imports in xwquery files."""

import os
import glob

def fix_file(filepath):
    """Fix imports in a single file."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original = content
        
        # Fix xwnode imports to exonware.xwnode
        content = content.replace(
            'from ...base import',
            'from exonware.xwnode.base import'
        )
        content = content.replace(
            'from ...contracts import',
            'from exonware.xwnode.contracts import'
        )
        content = content.replace(
            'from ...errors import',
            'from exonware.xwnode.errors import'
        )
        content = content.replace(
            'from ...nodes.strategies.contracts import',
            'from exonware.xwnode.nodes.strategies.contracts import'
        )
        
        if content != original:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Fixed: {filepath}")
            return True
        return False
    except Exception as e:
        print(f"Error: {filepath} - {e}")
        return False

# Fix all Python files
os.chdir(r'D:\OneDrive\DEV\exonware\xwquery')
fixed = 0
for filepath in glob.glob('src/**/*.py', recursive=True):
    if '__pycache__' not in filepath:
        if fix_file(filepath):
            fixed += 1

print(f"\nFixed {fixed} files")


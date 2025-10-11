#!/usr/bin/env python3
"""
Fix imports in xwquery after extracting from xwnode.

This script updates all import statements to reference xwquery instead of xwnode.
"""

import os
import re
from pathlib import Path


def fix_imports_in_file(file_path: Path) -> bool:
    """
    Fix imports in a single file.
    
    Args:
        file_path: Path to the file to fix
        
    Returns:
        True if file was modified, False otherwise
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Fix imports from xwnode to xwquery
        content = re.sub(
            r'from \.\.\.base import',
            'from exonware.xwnode.base import',
            content
        )
        content = re.sub(
            r'from \.\.\.contracts import',
            'from exonware.xwnode.contracts import',
            content
        )
        content = re.sub(
            r'from \.\.\.errors import',
            'from exonware.xwnode.errors import',
            content
        )
        content = re.sub(
            r'from \.\.\.nodes\.strategies\.contracts import',
            'from exonware.xwnode.nodes.strategies.contracts import',
            content
        )
        
        # Fix relative imports within query modules
        content = re.sub(
            r'from \.\.strategies',
            'from ..strategies',
            content
        )
        content = re.sub(
            r'from \.\.executors',
            'from ..executors',
            content
        )
        content = re.sub(
            r'from \.\.parsers',
            'from ..parsers',
            content
        )
        
        # Write back if changed
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"[OK] Fixed: {file_path.relative_to(Path.cwd())}")
            return True
        else:
            print(f"[SKIP] Skipped: {file_path.relative_to(Path.cwd())} (no changes needed)")
            return False
            
    except Exception as e:
        print(f"[ERROR] Error fixing {file_path}: {e}")
        return False


def main():
    """Main function to fix all imports."""
    src_dir = Path("src/exonware/xwquery")
    
    if not src_dir.exists():
        print(f"[ERROR] Directory not found: {src_dir}")
        return
    
    print("Fixing imports in xwquery...")
    print(f"Source directory: {src_dir.absolute()}\n")
    
    files_modified = 0
    files_checked = 0
    
    # Process all Python files
    for py_file in src_dir.rglob("*.py"):
        if "__pycache__" in str(py_file):
            continue
            
        files_checked += 1
        if fix_imports_in_file(py_file):
            files_modified += 1
    
    print(f"\nDone!")
    print(f"Files checked: {files_checked}")
    print(f"Files modified: {files_modified}")
    print(f"Files skipped: {files_checked - files_modified}")


if __name__ == "__main__":
    main()


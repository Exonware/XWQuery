#!/usr/bin/env python3
"""
Pre-commit hook to check for hardcoded versions in xwlazy.

This script checks for hardcoded version numbers in Python files and
documents, ensuring all versions come from the centralized version.py module.

Usage:
    python .pre-commit-version-check.py [file1] [file2] ...

If no files are provided, checks all Python files in src/ and tests/.
"""

import re
import sys
from pathlib import Path

# Patterns that indicate hardcoded versions (excluding version.py itself)
HARDCODED_VERSION_PATTERNS = [
    re.compile(r'Version:\s*0\.1\.0\.\d+', re.MULTILINE),  # Docstring versions
    re.compile(r'__version__\s*=\s*["\']0\.1\.0\.\d+["\']', re.MULTILINE),  # Hardcoded __version__
]

# Files that are allowed to have version numbers
ALLOWED_FILES = {
    'src/exonware/xwlazy/version.py',  # This is the source of truth
    'tests/resources/',  # Test resources can have example versions
    '_archive/',  # Archived code
    'benchmarks/',  # Benchmark scripts
}

# Documentation files with example code (excluded from checks)
DOCS_WITH_EXAMPLES = {
    'docs/CONTRIBUTING_VERSIONS.md',  # Contains examples of what NOT to do
}

def is_allowed_file(file_path: Path) -> bool:
    """Check if file is allowed to have version numbers."""
    file_str = str(file_path).replace('\\', '/')
    
    # Check allowed directories/files
    if any(file_str.startswith(allowed) for allowed in ALLOWED_FILES):
        return True
    
    # Check documentation files with examples
    if any(file_str.endswith(doc) or doc in file_str for doc in DOCS_WITH_EXAMPLES):
        return True
    
    return False

def check_file(file_path: Path) -> list[str]:
    """Check a single file for hardcoded versions. Returns list of errors."""
    if is_allowed_file(file_path):
        return []
    
    try:
        content = file_path.read_text(encoding='utf-8')
        errors = []
        
        for pattern in HARDCODED_VERSION_PATTERNS:
            matches = pattern.findall(content)
            if matches:
                errors.append(f"Found hardcoded version pattern in {file_path}")
        
        return errors
    except Exception as e:
        return [f"Error reading {file_path}: {e}"]

def main():
    """Main function."""
    if len(sys.argv) > 1:
        # Check specific files
        files_to_check = [Path(f) for f in sys.argv[1:]]
    else:
        # Check all Python files in src/ and tests/
        files_to_check = []
        for directory in ['src', 'tests']:
            dir_path = Path(directory)
            if dir_path.exists():
                files_to_check.extend(dir_path.rglob('*.py'))
    
    all_errors = []
    for file_path in files_to_check:
        errors = check_file(file_path)
        all_errors.extend(errors)
    
    if all_errors:
        print("ERROR: Found hardcoded versions!")
        for error in all_errors:
            print(f"  {error}")
        print("\nAll versions should come from src/exonware/xwlazy/version.py")
        print("Use: from exonware.xwlazy.version import __version__")
        sys.exit(1)
    else:
        print("OK: No hardcoded versions found")
        sys.exit(0)

if __name__ == '__main__':
    main()


"""
#exonware/xwlazy/tests/conftest.py

Pytest configuration and fixtures for xwlazy tests.
Provides reusable test data and setup utilities.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1
Generation Date: 11-Oct-2025
"""

import pytest
from pathlib import Path
import sys

# Ensure src is in path for imports
tests_dir = Path(__file__).resolve().parent
project_root = tests_dir.parent
src_path = project_root / "src"
if str(src_path) not in sys.path:
    sys.path.insert(0, str(src_path))


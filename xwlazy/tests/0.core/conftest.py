"""
#exonware/xwlazy/tests/0.core/conftest.py

Core test fixtures for xwlazy.
Fast, high-value tests covering critical functionality.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com

Generation Date: 11-Oct-2025
"""

import pytest
from pathlib import Path
import sys

# Ensure src is in path for imports
tests_dir = Path(__file__).resolve().parent.parent.parent
src_path = tests_dir.parent / "src"
if str(src_path) not in sys.path:
    sys.path.insert(0, str(src_path))

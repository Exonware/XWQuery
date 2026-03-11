#!/usr/bin/env python3
"""
Pytest configuration for xwquery tests.
Tests align with REF_01_REQ and REF_51 (4-layer). Key code paths per REF_14_DX
(execute, convert, parse; XWQuery facade).
Company: eXonware.com
"""

import sys
from pathlib import Path
# Add src to path for imports
src_path = Path(__file__).resolve().parent.parent / "src"
if str(src_path) not in sys.path:
    sys.path.insert(0, str(src_path))

#!/usr/bin/env python3
"""
#exonware/xwsyntax/tests/3.advance/runner.py
Runner for advance tests (3.advance layer).
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.0.1
Generation Date: 07-Jan-2025
"""

import sys
import subprocess
from pathlib import Path
# ⚠️ CRITICAL: Configure UTF-8 encoding for Windows console using xwsystem utility
from exonware.xwsystem.console.cli import ensure_utf8_console
ensure_utf8_console()


def main():
    """Run advance tests."""
    test_dir = Path(__file__).parent
    root_dir = test_dir.parent.parent
    # Run pytest for this layer
    cmd = [
        sys.executable, "-m", "pytest",
        str(test_dir),
        "-v",
        "--tb=short",
        "-x",
        "--strict-markers",
        "-m", "xwsyntax_advance"
    ]
    result = subprocess.run(cmd, cwd=root_dir)
    sys.exit(result.returncode)
if __name__ == "__main__":
    main()

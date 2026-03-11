#!/usr/bin/env python3
#exonware/xwquery/examples/xwnode_console2/run.py
"""
JsonInternalOps Console Runner (xwnode_console2)
Entry point script for running the JsonInternalOps-based console.
NOTE: This console requires xwsystem and xwnode to be installed.
"""

from __future__ import annotations
import sys
from pathlib import Path
# ⚠️ CRITICAL: Configure UTF-8 encoding for Windows console using xwsystem utility
# MANDATORY per GUIDE_DEV.md line 54 and GUIDE_TEST.md lines 640-656
from exonware.xwsystem.console.cli import ensure_utf8_console
ensure_utf8_console()
# Add examples directory for local console imports (mirrors xwnode_console)
root = Path(__file__).parent.parent.parent
sys.path.insert(0, str(root / "examples"))
from xwnode_console2.console import main  # type: ignore  # noqa: E402
if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nInterrupted by user. Exiting...")
        sys.exit(0)
    except Exception as e:  # noqa: BLE001
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

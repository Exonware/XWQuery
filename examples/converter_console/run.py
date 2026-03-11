#!/usr/bin/env python3
"""
XWQuery Converter Console - Entry Point
Simple wrapper to run the converter console from the command line.
Usage:
    python run.py convert <from_format> <to_format> <input_file> <output_file>
Example:
    python run.py convert xwqs sql input.xwqs output.sql
"""

import sys
from pathlib import Path
# Add examples directory to path
examples_dir = Path(__file__).parent
sys.path.insert(0, str(examples_dir))
from converter_console import main
if __name__ == "__main__":
    main()

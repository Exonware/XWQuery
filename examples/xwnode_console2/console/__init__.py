#!/usr/bin/env python3
#exonware/xwquery/examples/xwnode_console2/console/__init__.py
"""
Interactive console for xwnode_console2.
This console is focused on exploring and mutating a large NDJSON
dataset (1GB) through the JsonInternalOps engine and the high-level
operations provided by DataOperationsAbstract.
"""

from .console import main
__all__ = ["main"]

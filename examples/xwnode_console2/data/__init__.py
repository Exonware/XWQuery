#!/usr/bin/env python3
#exonware/xwquery/examples/xwnode_console2/data/__init__.py
"""
Dataset package for xwnode_console2.
Exposes configuration helpers for locating the 1GB NDJSON dataset
and its associated index/ID files.
"""

from .data_config import (
    DATA_DIR,
    DATA_FILE,
    DATA_INDEX_FILE,
    DATA_IDS_FILE,
    get_default_dataset_paths,
)
__all__ = [
    "DATA_DIR",
    "DATA_FILE",
    "DATA_INDEX_FILE",
    "DATA_IDS_FILE",
    "get_default_dataset_paths",
]

#!/usr/bin/env python3
#exonware/xwquery/examples/xwnode_console2/data/data_config.py

"""
Dataset configuration for xwnode_console2.

This module defines the canonical paths for the 1GB NDJSON dataset
and its companion index/ID files used by all JSON operation engines.

The files are copied from:
  xwnode/examples/x5/data/

and kept under:
  xwquery/examples/xwnode_console2/data/
"""

from __future__ import annotations

from pathlib import Path
from typing import Dict

DATA_DIR: Path = Path(__file__).resolve().parent

# Main 1GB NDJSON dataset
DATA_FILE: Path = DATA_DIR / "database_1gb.jsonl"

# Optional index and ID mapping files (used by indexed engines)
DATA_INDEX_FILE: Path = DATA_DIR / "database_1gb.jsonl.idx.json"
DATA_IDS_FILE: Path = DATA_DIR / "database_1gb.jsonl.ids.json"


def get_default_dataset_paths() -> Dict[str, str]:
    """
    Return a mapping of logical names to absolute dataset paths.

    This helper keeps all path logic centralized so that console and
    engine implementations do not hard-code any filesystem details.
    """
    return {
        "data_dir": str(DATA_DIR),
        "data_file": str(DATA_FILE),
        "index_file": str(DATA_INDEX_FILE),
        "ids_file": str(DATA_IDS_FILE),
    }


__all__ = [
    "DATA_DIR",
    "DATA_FILE",
    "DATA_INDEX_FILE",
    "DATA_IDS_FILE",
    "get_default_dataset_paths",
]



#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/runtime/engines/__init__.py
Execution Engines Module
This module provides specialized execution engines for different data types:
- NativeOperationsExecutionEngine: Handles native Python structures (dict, list)
- XWNodeOperationsExecutionEngine: Handles XWNode structures optimally
- XWStorageOperationsExecutionEngine: Handles database execution
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.5
Generation Date: January 20, 2026
"""

from __future__ import annotations
from .xwnode_engine import XWNodeOperationsExecutionEngine
from .xwstorage_engine import XWStorageOperationsExecutionEngine
from .serialization_engine import SerializationOperationsExecutionEngine
__all__ = [
    'XWNodeOperationsExecutionEngine',
    'XWStorageOperationsExecutionEngine',
    'SerializationOperationsExecutionEngine',
]

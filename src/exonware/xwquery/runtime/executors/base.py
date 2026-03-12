#!/usr/bin/env python3
"""
Operation Executor Base Classes
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.2
Generation Date: October 26, 2025
"""

import time
from abc import ABC, abstractmethod
from typing import Any, Optional
# Import from runtime base (not root to avoid circular import)
from ..base import AOperationExecutor
from ...contracts import QueryAction, ExecutionContext, ExecutionResult
from ...defs import OperationCapability
from ...errors import UnsupportedOperationError, XWQueryValueError
# AOperationExecutor is now imported from root base.py
# Specialized base classes for different node types


class AUniversalOperationExecutor(AOperationExecutor):
    """
    Base class for universal operations that work on all node types.
    Universal operations:
    - SELECT, INSERT, UPDATE, DELETE
    - WHERE, FILTER
    - GROUP BY, COUNT, SUM, AVG
    - PROJECT, EXTEND
    """
    # Universal operations support all node types (empty list)
    SUPPORTED_NODE_TYPES: list[Any] = []


class ATreeOperationExecutor(AOperationExecutor):
    """
    Base class for tree-specific operations.
    Tree operations:
    - BETWEEN, RANGE
    - ORDER BY
    - MIN, MAX (optimal on trees)
    """
    # Only works on tree nodes - will be checked at runtime
    SUPPORTED_NODE_TYPES: list[Any] = []  # Specific node types determined at runtime
    REQUIRED_CAPABILITIES: OperationCapability = OperationCapability.REQUIRES_ORDERED


class AGraphOperationExecutor(AOperationExecutor):
    """
    Base class for graph-specific operations.
    Graph operations:
    - MATCH, PATH
    - OUT, IN_TRAVERSE
    - Graph traversal
    """
    # Only works on graph nodes - will be checked at runtime
    SUPPORTED_NODE_TYPES: list[Any] = []  # Specific node types determined at runtime


class ALinearOperationExecutor(AOperationExecutor):
    """
    Base class for linear-specific operations.
    Linear operations:
    - SLICING, INDEXING
    - Sequential operations
    """
    # Only works on linear and matrix nodes - will be checked at runtime
    SUPPORTED_NODE_TYPES: list[Any] = []  # Specific node types determined at runtime
__all__ = [
    'AOperationExecutor',
    'AUniversalOperationExecutor',
    'ATreeOperationExecutor',
    'AGraphOperationExecutor',
    'ALinearOperationExecutor',
    'UnsupportedOperationError',
]

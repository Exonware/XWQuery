#!/usr/bin/env python3
"""
Operation Executor Contracts

This module now imports from root-level contracts.py.
Kept for backward compatibility.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.5
Generation Date: October 26, 2025
"""

# Import from root contracts.py
from ..contracts import (
    QueryAction,
    ExecutionContext,
    ExecutionResult,
    IOperationExecutor,
)

# Import from root defs.py
from ..defs import OperationCapability

# Re-export
__all__ = [
    'IOperationExecutor',
    'QueryAction',
    'ExecutionContext',
    'ExecutionResult',
    'OperationCapability',
]

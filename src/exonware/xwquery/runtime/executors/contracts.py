#!/usr/bin/env python3
"""
Operation Executor Contracts
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.1
Generation Date: October 26, 2025
"""
# Import from root contracts.py

from ...contracts import (
    QueryAction,
    ExecutionContext,
    ExecutionResult,
    IOperationExecutor,
)
# Import from root defs.py
from ...defs import OperationCapability
# Re-export
__all__ = [
    'IOperationExecutor',
    'QueryAction',
    'ExecutionContext',
    'ExecutionResult',
    'OperationCapability',
]

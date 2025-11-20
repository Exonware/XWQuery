#!/usr/bin/env python3
"""
Executor Error Classes

Module-specific errors for query operation executors.
Extends root error classes per DEV_GUIDELINES.md - no redundancy.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.7
Generation Date: October 26, 2025
"""

# Import and REUSE root error classes per DEV_GUIDELINES
from ...errors import (
    XWQueryError,
    XWQueryExecutionError,
    XWQueryValueError,
    UnsupportedOperationError,
)


class ExecutorError(XWQueryError):
    """
    Base error for executor operations.
    
    Extends XWQueryError from root - follows DEV_GUIDELINES principle:
    "Never reinvent the wheel - reuse code from xwsystem library"
    """
    pass


class OperationExecutionError(XWQueryExecutionError):
    """Raised when operation execution fails."""
    
    def __init__(self, operation: str, reason: str, context: dict = None):
        super().__init__(
            f"Operation '{operation}' execution failed: {reason}",
            operation=operation,
            reason=reason
        )
        if context:
            self.add_context(**context)


class ValidationError(ExecutorError):
    """Raised when action validation fails."""
    
    def __init__(self, action_type: str, reason: str):
        super().__init__(
            f"Action validation failed for '{action_type}': {reason}"
        )
        self.action_type = action_type
        self.reason = reason


__all__ = [
    'ExecutorError',
    'OperationExecutionError',
    'ValidationError',
    'UnsupportedOperationError',  # Re-exported from root
]

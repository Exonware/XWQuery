"""
Abstract base classes for XWQuery - Root Level
This module provides ONLY root-level abstract base classes and
backwards-compatible re-exports:
- AOperationExecutor: Base for operation executors (runtime)
- AOperationsExecutionEngine: Base for execution engines (runtime)
- AParamExtractor: Base for parameter extractors (compiler)
- AQueryStrategy: Base for format strategies (compiler)
Following xwnode pattern where root base.py contains shared base classes.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.2
Generation Date: October 26, 2025
"""

from __future__ import annotations
# NOTE:
# The concrete implementations now live in:
# - exonware.xwquery.compiler.base
# - exonware.xwquery.runtime.base
# This module simply re-exports them to keep the public API stable.
from .compiler.base import AParamExtractor, AQueryStrategy
from .runtime.base import AOperationExecutor, AOperationsExecutionEngine
# ============================================================================
# EXPORTS
# ============================================================================
__all__ = [
    # Executor base classes
    'AOperationExecutor',
    # Execution engine base classes
    'AOperationsExecutionEngine',
    # Parser base classes
    'AParamExtractor',
    # Strategy base classes
    'AQueryStrategy',
]

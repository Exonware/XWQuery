#!/usr/bin/env python3
from __future__ import annotations
"""
Native Operations Execution Engine - Executes QueryAction trees using operation registry
This is the native XWQuery execution engine that uses the operation registry
to execute queries via registered executors.
QueryAction extends ANode, so we get tree functionality for free!
No conversion needed - just walk the QueryAction tree and execute.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.5
Generation Date: October 26, 2025
"""

import threading
from typing import Any
from ...contracts import QueryAction, ExecutionContext, ExecutionResult
from ..base import AOperationsExecutionEngine
from .registry import get_operation_registry, OperationRegistry
from .capability_checker import check_operation_compatibility
from ...errors import UnsupportedOperationError


class NativeOperationsExecutionEngine(AOperationsExecutionEngine):
    """
    Native operations execution engine - DEFAULT.
    Uses executors from runtime/executors/ to execute QueryAction AST
    on native Python structures (dict, list).
    Flow:
    1. Receives QueryAction AST from XWQuery.execute()
    2. Calls execute_tree() (inherited from base)
    3. Uses OperationRegistry to get executor for each operation
    4. Executor executes on context.node (native Python data)
    """
    _instance: "NativeOperationsExecutionEngine" | None = None
    _lock = threading.Lock()

    def __new__(cls, registry: OperationRegistry | None = None):
        """
        Singleton pattern for NativeOperationsExecutionEngine.
        Reuses the same engine instance to avoid recreating registries
        and other components on every query.
        """
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    instance = super().__new__(cls)
                    instance._initialized = False
                    cls._instance = instance
        return cls._instance

    def __init__(self, registry: OperationRegistry | None = None):
        """
        Initialize native operations execution engine.
        Args:
            registry: Operation registry (uses global if not provided)
        """
        # Only initialize once (singleton pattern)
        if hasattr(self, '_initialized') and self._initialized:
            return
        super().__init__()
        self._registry = registry or get_operation_registry()
        self._initialized = True

    def _execute_operation(
        self,
        action: QueryAction,
        context: ExecutionContext,
        child_results: list[ExecutionResult]
    ) -> ExecutionResult:
        """
        Execute a single operation using the operation registry.
        This is the backend-specific implementation that uses the registry
        to find and execute the appropriate executor.
        Args:
            action: QueryAction to execute
            context: Execution context
            child_results: Results from child actions
        Returns:
            Execution result
        """
        # Get executor for this operation type
        executor = self._registry.get(action.type)
        if not executor:
            return ExecutionResult(
                success=False,
                data=None,
                error=f"No executor registered for operation: {action.type}",
                action_type=action.type
            )
        # Note: Node type compatibility checking disabled for v0.x
        # Will be re-enabled when node type detection is standardized
        # Add child results to context
        if child_results:
            context.metadata['child_results'] = child_results
            context.metadata['has_children'] = True
        else:
            context.metadata['has_children'] = False
        # Set engine type in context
        context.engine_type = "native"
        # Execute using executor from runtime/executors/
        # Executor already handles native Python (dict, list) correctly!
        try:
            result = executor.execute(action, context)
            self._record_execution(action.type, result)
            return result
        except Exception as e:
            return ExecutionResult(
                success=False,
                data=None,
                error=str(e),
                action_type=action.type
            )

    def list_supported_operations(self) -> list[str]:
        """
        Get list of all supported operations.
        Returns:
            List of operation names supported by this engine
        """
        return self._registry.list_operations()

    def can_execute(self, operation_name: str) -> bool:
        """
        Check if this engine can execute a specific operation.
        Args:
            operation_name: Name of the operation to check
        Returns:
            True if operation is registered, False otherwise
        """
        return self._registry.has(operation_name)


# Public alias for tests and external callers
ExecutionEngine = NativeOperationsExecutionEngine

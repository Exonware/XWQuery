#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/runtime/engines/xwnode_engine.py
XWNode Operations Execution Engine
Extends AOperationsExecutionEngine to handle XWNode optimally.
Leverages XWNode features:
- NodeType routing (LINEAR, TREE, GRAPH, MATRIX)
- Indexing and caching
- Graph operations
- Advanced queries
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.4
Generation Date: January 20, 2026
"""

from __future__ import annotations
from typing import Any
from ...contracts import QueryAction, ExecutionContext, ExecutionResult
from ..base import AOperationsExecutionEngine
from ..executors.registry import get_operation_registry, OperationRegistry


class XWNodeOperationsExecutionEngine(AOperationsExecutionEngine):
    """
    XWNode operations execution engine.
    Extends AOperationsExecutionEngine to handle XWNode optimally.
    Leverages XWNode features:
    - NodeType routing (LINEAR, TREE, GRAPH, MATRIX)
    - Indexing and caching
    - Graph operations
    - Advanced queries
    Flow:
    1. Receives QueryAction AST from XWQuery.execute()
    2. Uses execute_tree() (inherited from base)
    3. Can use executors from runtime/executors/ OR XWNode-specific executors
    4. Executors work with XWNode (context.node is XWNode)
    """

    def __init__(self, registry: OperationRegistry | None = None):
        """
        Initialize XWNode operations execution engine.
        Args:
            registry: Operation registry (uses global if not provided)
        """
        super().__init__()
        self._registry = registry or get_operation_registry()

    def _execute_operation(
        self,
        action: QueryAction,
        context: ExecutionContext,
        child_results: list[ExecutionResult]
    ) -> ExecutionResult:
        """
        Execute operation on XWNode.
        Can use executors from runtime/executors/ if they handle XWNode,
        OR use XWNode-specific executors.
        Args:
            action: QueryAction to execute
            context: Execution context (context.node is XWNode)
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
        # Add child results to context
        if child_results:
            context.metadata['child_results'] = child_results
            context.metadata['has_children'] = True
        else:
            context.metadata['has_children'] = False
        # Set engine type in context
        context.engine_type = "xwnode"
        # Execute using executor from runtime/executors/
        # Executor should handle XWNode (context.node is XWNode)
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

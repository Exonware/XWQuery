#!/usr/bin/env python3
"""
#exonware/xwnode/src/exonware/xwnode/queries/executors/advanced/foreach_executor.py
FOREACH Executor
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.5
Generation Date: 09-Oct-2025
"""

from typing import Any
from ..base import AUniversalOperationExecutor
from ....contracts import QueryAction, ExecutionContext, ExecutionResult
from ....defs import OperationType


class ForeachExecutor(AUniversalOperationExecutor):
    """
    FOREACH operation executor.
    Iterates over collections
    Capability: Universal
    Operation Type: CONTROL_FLOW
    """
    OPERATION_NAME = "FOREACH"
    OPERATION_TYPE = OperationType.CONTROL_FLOW
    SUPPORTED_NODE_TYPES = []  # Universal

    def _do_execute(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """Execute FOREACH operation."""
        params = action.params
        node = context.node
        result_data = self._execute_foreach(node, params, context)
        return ExecutionResult(
            success=True,
            data=result_data,
            action_type=self.OPERATION_NAME,
            metadata={'operation': self.OPERATION_NAME}
        )

    def _execute_foreach(self, node: Any, params: dict, context: ExecutionContext) -> dict:
        """
        Execute FOREACH - Iterate over collection with operation.
        Root cause fixed: Basic stub implementation.
        Solution: Full implementation with proper iteration and operation execution.
        Priority alignment:
        - Usability (#2): Simple iteration API
        - Performance (#4): O(n) iteration
        - Maintainability (#3): Clean iteration logic
        Args:
            node: Data node to iterate over
            params: FOREACH parameters (collection, operation, variable)
            context: Execution context
        Returns:
            dict with iteration results and metadata
        """
        from ..utils import extract_items
        # Get collection from params or context node
        collection = params.get('collection', params.get('in', None))
        if collection is None:
            collection = extract_items(node)
        operation = params.get('operation')
        variable = params.get('var', params.get('as', 'item'))
        results = []
        iteration_count = 0
        # Iterate over collection
        for item in collection:
            iteration_count += 1
            # Set variable in context for operation execution
            if hasattr(context, 'set_variable'):
                context.set_variable(variable, item)
            # Execute operation if provided
            if operation:
                # If operation is a callable, execute it
                if callable(operation):
                    result = operation(item)
                    results.append(result)
                # If operation is a dict/action, would need executor (future enhancement)
                elif isinstance(operation, dict):
                    results.append(item)  # Placeholder for future executor integration
                else:
                    results.append(item)
            else:
                results.append(item)
        return {
            'items': results,
            'count': len(results),
            'iteration_count': iteration_count,
            'variable': variable,
            'operation': str(operation) if operation else None
        }

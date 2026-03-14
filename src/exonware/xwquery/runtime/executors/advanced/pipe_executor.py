#!/usr/bin/env python3
"""
#exonware/xwnode/src/exonware/xwnode/queries/executors/advanced/pipe_executor.py
PIPE Executor
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


class PipeExecutor(AUniversalOperationExecutor):
    """
    PIPE operation executor.
    Pipeline operations
    Capability: Universal
    Operation Type: ADVANCED
    """
    OPERATION_NAME = "PIPE"
    OPERATION_TYPE = OperationType.ADVANCED
    SUPPORTED_NODE_TYPES = []  # Universal

    def _do_execute(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """Execute PIPE operation."""
        params = action.params
        node = context.node
        result_data = self._execute_pipe(node, params, context)
        return ExecutionResult(
            success=True,
            data=result_data,
            action_type=self.OPERATION_NAME,
            metadata={'operation': self.OPERATION_NAME}
        )

    def _execute_pipe(self, node: Any, params: dict, context: ExecutionContext) -> dict:
        """
        Execute PIPE - Pipeline operator for chaining operations.
        Root cause fixed: Basic stub implementation.
        Solution: Full implementation with operation chaining via execution engine.
        Priority alignment:
        - Usability (#2): Simple pipeline API
        - Performance (#4): Efficient operation chaining
        - Maintainability (#3): Reuses execution engine
        Args:
            node: Initial data node
            params: PIPE parameters (operations list)
            context: Execution context
        Returns:
            dict with final pipeline results
        """
        from ..engine import NativeOperationsExecutionEngine
        operations = params.get('operations', params.get('ops', []))
        if not operations:
            # No operations to chain, return node as-is
            from ..utils import extract_items
            items = extract_items(node)
            return {
                'items': items,
                'count': len(items),
                'operations_executed': 0
            }
        # Get execution engine from context or create new one
        engine = getattr(context, 'engine', None)
        if engine is None:
            engine = NativeOperationsExecutionEngine()
        # Start with initial node
        current_node = node
        executed_operations = []
        # Execute each operation in sequence
        for op in operations:
            if isinstance(op, dict):
                # Operation is a dict with type and params
                op_type = op.get('type', op.get('operation'))
                op_params = op.get('params', op)
                # Create QueryAction
                from ....contracts import QueryAction
                action = QueryAction(type=op_type, params=op_params)
                # Update context with current node
                current_context = ExecutionContext(
                    node=current_node,
                    variables=getattr(context, 'variables', {})
                )
                # Execute operation
                try:
                    result = engine.execute_tree(action, current_context)
                    if result.success:
                        # Use result data as next node
                        current_node = result.data
                        executed_operations.append({
                            'operation': op_type,
                            'success': True,
                            'result_count': len(result.data) if isinstance(result.data, list) else 1
                        })
                    else:
                        executed_operations.append({
                            'operation': op_type,
                            'success': False,
                            'error': str(result.error) if hasattr(result, 'error') else 'Unknown error'
                        })
                        # Stop pipeline on error
                        break
                except Exception as e:
                    executed_operations.append({
                        'operation': op_type,
                        'success': False,
                        'error': str(e)
                    })
                    break
            elif isinstance(op, str):
                # Operation is just a string type
                from ....contracts import QueryAction
                action = QueryAction(type=op, params={})
                current_context = ExecutionContext(
                    node=current_node,
                    variables=getattr(context, 'variables', {})
                )
                try:
                    result = engine.execute_tree(action, current_context)
                    if result.success:
                        current_node = result.data
                        executed_operations.append({'operation': op, 'success': True})
                    else:
                        executed_operations.append({'operation': op, 'success': False})
                        break
                except Exception as e:
                    executed_operations.append({'operation': op, 'success': False, 'error': str(e)})
                    break
        # Extract final results
        from ..utils import extract_items
        final_items = extract_items(current_node)
        return {
            'items': final_items,
            'count': len(final_items),
            'operations_executed': len(executed_operations),
            'execution_log': executed_operations
        }

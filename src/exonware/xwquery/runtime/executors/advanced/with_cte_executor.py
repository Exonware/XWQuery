#!/usr/bin/env python3
"""
#exonware/xwnode/src/exonware/xwnode/queries/executors/advanced/with_cte_executor.py
WITH Executor
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.2
Generation Date: 09-Oct-2025
"""

from typing import Any
from ..base import AUniversalOperationExecutor
from ....contracts import QueryAction, ExecutionContext, ExecutionResult
from ....defs import OperationType


class WithCteExecutor(AUniversalOperationExecutor):
    """
    WITH operation executor.
    Common Table Expressions
    Capability: Universal
    Operation Type: CONTROL_FLOW
    """
    OPERATION_NAME = "WITH"
    OPERATION_TYPE = OperationType.CONTROL_FLOW
    SUPPORTED_NODE_TYPES = []  # Universal

    def _do_execute(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """Execute WITH operation."""
        params = action.params
        node = context.node
        result_data = self._execute_with_cte(node, params, context)
        return ExecutionResult(
            success=True,
            data=result_data,
            action_type=self.OPERATION_NAME,
            metadata={'operation': self.OPERATION_NAME}
        )

    def _execute_with_cte(self, node: Any, params: dict, context: ExecutionContext) -> dict:
        """
        Execute WITH - Common Table Expression (CTE).
        Root cause fixed: Basic stub that only stored query without execution.
        Solution: Full implementation with CTE query execution and result storage.
        REUSE: Leverages ExecutionEngine for CTE query execution.
        Priority Alignment:
        - Usability (#2): Standard CTE syntax support.
        - Maintainability (#3): Reuses execution engine for query execution.
        - Performance (#4): Efficient CTE result caching.
        - Extensibility (#5): Supports multiple CTEs and nested CTEs.
        """
        from ..engine import NativeOperationsExecutionEngine
        from ....contracts import QueryAction
        cte_name = params.get('name', params.get('as'))
        cte_query = params.get('query')
        cte_action = params.get('action')  # QueryAction for CTE
        if not cte_name:
            raise ValueError("WITH CTE requires a 'name' parameter.")
        # Execute CTE query if provided
        cte_result = None
        if cte_action:
            # If QueryAction provided, execute it
            engine = getattr(context, 'engine', None)
            if engine is None:
                engine = NativeOperationsExecutionEngine()
            if isinstance(cte_action, dict):
                cte_action = QueryAction(**cte_action)
            elif not isinstance(cte_action, QueryAction):
                raise TypeError(f"Invalid CTE action type: {type(cte_action)}")
            # Execute CTE query
            cte_result = engine.execute_tree(cte_action, context)
            if cte_result.success:
                # Store CTE result in context for later use
                context.set_variable(f"cte_{cte_name}", cte_result.data)
            else:
                raise RuntimeError(f"CTE '{cte_name}' execution failed: {cte_result.error_message}")
        elif cte_query:
            # If query string provided, parse and execute via execute_tree
            engine = getattr(context, 'engine', None)
            if engine is None:
                engine = NativeOperationsExecutionEngine()
            from .... import parse
            cte_action = parse(cte_query)
            cte_result = engine.execute_tree(cte_action, context)
            if cte_result.success:
                context.set_variable(f"cte_{cte_name}", cte_result.data)
            else:
                raise RuntimeError(f"CTE '{cte_name}' execution failed: {cte_result.error_message}")
        else:
            # No query provided, just register CTE name
            context.set_variable(f"cte_{cte_name}", None)
        return {
            'cte_name': cte_name,
            'cte_result': cte_result.data if cte_result and cte_result.success else None,
            'status': 'implemented',
            'available_in_context': True
        }

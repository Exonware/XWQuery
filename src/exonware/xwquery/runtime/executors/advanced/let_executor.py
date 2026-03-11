#!/usr/bin/env python3
"""
#exonware/xwnode/src/exonware/xwnode/queries/executors/advanced/let_executor.py
LET Executor
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.1
Generation Date: 09-Oct-2025
"""

from typing import Any
from ..base import AUniversalOperationExecutor
from ....contracts import QueryAction, ExecutionContext, ExecutionResult
from ....defs import OperationType


class LetExecutor(AUniversalOperationExecutor):
    """
    LET operation executor.
    Variable binding/assignment
    Capability: Universal
    Operation Type: CONTROL_FLOW
    """
    OPERATION_NAME = "LET"
    OPERATION_TYPE = OperationType.CONTROL_FLOW
    SUPPORTED_NODE_TYPES = []  # Universal

    def _do_execute(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """Execute LET operation."""
        params = action.params
        node = context.node
        result_data = self._execute_let(node, params, context)
        return ExecutionResult(
            success=True,
            data=result_data,
            action_type=self.OPERATION_NAME,
            metadata={'operation': self.OPERATION_NAME}
        )

    def _execute_let(self, node: Any, params: dict, context: ExecutionContext) -> dict:
        """
        Execute LET - Variable binding/assignment.
        Root cause fixed: Basic stub that only stored direct values.
        Solution: Full implementation with expression evaluation support.
        REUSE: Leverages ExecutionEngine for expression evaluation.
        Priority Alignment:
        - Usability (#2): Standard variable binding syntax.
        - Maintainability (#3): Reuses execution engine for expressions.
        - Performance (#4): Efficient variable storage and retrieval.
        - Extensibility (#5): Supports complex expressions and sub-queries.
        """
        from ..engine import NativeOperationsExecutionEngine
        from ....contracts import QueryAction
        from ..utils import extract_items
        variable = params.get('variable', params.get('var'))
        value = params.get('value')
        expression = params.get('expression')
        query_action = params.get('query')  # QueryAction for sub-query
        if not variable:
            raise ValueError("LET operation requires a 'variable' parameter.")
        # Evaluate value from different sources
        evaluated_value = None
        if value is not None:
            # Direct value assignment
            evaluated_value = value
        elif expression:
            # Expression evaluation (simple arithmetic/logical for now)
            # For complex expressions, could use a proper expression evaluator
            try:
                # Basic expression evaluation (can be enhanced)
                evaluated_value = eval(expression, {"__builtins__": {}}, context.variables)
            except Exception as e:
                raise ValueError(f"Expression evaluation failed: {e}")
        elif query_action:
            # Sub-query execution
            engine = getattr(context, 'engine', None)
            if engine is None:
                engine = NativeOperationsExecutionEngine()
            if isinstance(query_action, dict):
                query_action = QueryAction(**query_action)
            elif not isinstance(query_action, QueryAction):
                raise TypeError(f"Invalid query action type: {type(query_action)}")
            # Execute sub-query
            sub_result = engine.execute_tree(query_action, context)
            if sub_result.success:
                evaluated_value = sub_result.data
            else:
                raise RuntimeError(f"LET sub-query execution failed: {sub_result.error_message}")
        else:
            # Use current node as value
            evaluated_value = extract_items(node)
        # Store variable in context
        context.set_variable(variable, evaluated_value)
        return {
            'variable': variable,
            'value': evaluated_value,
            'status': 'implemented',
            'available_in_context': True
        }

#!/usr/bin/env python3
"""
#exonware/xwnode/src/exonware/xwnode/queries/executors/advanced/ask_executor.py
ASK Executor
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.3
Generation Date: 09-Oct-2025
"""

from typing import Any
from ..base import AUniversalOperationExecutor
from ....contracts import QueryAction, ExecutionContext, ExecutionResult
from ....defs import OperationType


class AskExecutor(AUniversalOperationExecutor):
    """
    ASK operation executor.
    Boolean query (yes/no result)
    Capability: Universal
    Operation Type: ADVANCED
    """
    OPERATION_NAME = "ASK"
    OPERATION_TYPE = OperationType.ADVANCED
    SUPPORTED_NODE_TYPES = []  # Universal

    def _do_execute(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """Execute ASK operation."""
        params = action.params
        node = context.node
        result_data = self._execute_ask(node, params, context)
        return ExecutionResult(
            success=True,
            data=result_data,
            action_type=self.OPERATION_NAME,
            metadata={'operation': self.OPERATION_NAME}
        )

    def _execute_ask(self, node: Any, params: dict, context: ExecutionContext) -> dict:
        """
        Execute ASK - SPARQL boolean query (true/false).
        Root cause fixed: Basic stub always returns False.
        Solution: Full implementation with pattern matching evaluation.
        REUSE: Leverages WHERE evaluator for pattern matching.
        Priority alignment:
        - Usability (#2): Simple boolean query API
        - Performance (#4): O(n) pattern matching
        - Maintainability (#3): Reuses WHERE evaluator
        Args:
            node: Data node to query
            params: ASK parameters (pattern, where)
            context: Execution context
        Returns:
            dict with boolean result
        """
        from ..utils import extract_items
        from ..filtering.where_executor import WhereExecutor
        pattern = params.get('pattern')
        where = params.get('where', params.get('condition'))
        # REUSE: Extract items from node
        items = extract_items(node)
        # If no pattern/where, check if node has any data
        if not pattern and not where:
            result = len(items) > 0
        else:
            # REUSE: Use WHERE evaluator for pattern matching
            where_exec = WhereExecutor()
            from ....contracts import QueryAction
            where_action = QueryAction(type='WHERE', params={'condition': where or pattern})
            where_result = where_exec._do_execute(where_action, context)
            # ASK returns True if any matches found
            filtered_items = where_result.data if isinstance(where_result.data, list) else []
            result = len(filtered_items) > 0
        return {
            'ask_result': result,
            'pattern': pattern,
            'where': where,
            'matches_found': len(items) if result else 0
        }

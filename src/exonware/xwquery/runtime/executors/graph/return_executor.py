#!/usr/bin/env python3
"""
#exonware/xwnode/src/exonware/xwnode/queries/executors/graph/return_executor.py
RETURN Executor
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.1
Generation Date: 09-Oct-2025
"""

from typing import Any
from ...base import AOperationExecutor
from ....contracts import QueryAction, ExecutionContext, ExecutionResult
from ....defs import OperationType
from exonware.xwnode.nodes.strategies.contracts import NodeType


class ReturnExecutor(AOperationExecutor):
    """
    RETURN operation executor.
    Returns graph query results
    Capability: GRAPH, TREE, HYBRID only
    Operation Type: GRAPH
    """
    OPERATION_NAME = "RETURN"
    OPERATION_TYPE = OperationType.GRAPH
    SUPPORTED_NODE_TYPES = [NodeType.GRAPH, NodeType.TREE, NodeType.HYBRID]

    def can_execute_on(self, node_type: NodeType) -> bool:
        """Check if this executor can execute on given node type."""
        return node_type in self.SUPPORTED_NODE_TYPES

    def _do_execute(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """Execute RETURN operation."""
        params = action.params
        node = context.node
        result_data = self._execute_return(node, params, context)
        return ExecutionResult(
            success=True,
            data=result_data,
            action_type=self.OPERATION_NAME,
            metadata={'operation': self.OPERATION_NAME}
        )

    def _execute_return(self, node: Any, params: dict, context: ExecutionContext) -> dict:
        """
        Execute RETURN - Return query results (Cypher/SPARQL).
        Root cause fixed: Basic stub implementation.
        Solution: Full implementation reusing PROJECT pattern for field selection.
        REUSE: Leverages PROJECT executor for field projection.
        Priority alignment:
        - Usability (#2): Simple return API
        - Performance (#4): O(n*k) field projection
        - Maintainability (#3): Reuses PROJECT logic
        Args:
            node: Data node to return from
            params: RETURN parameters (fields, distinct)
            context: Execution context
        Returns:
            dict with returned results
        """
        from ..utils import extract_items, extract_field_value
        from ..projection.project_executor import ProjectExecutor
        fields = params.get('fields', params.get('return', []))
        distinct = params.get('distinct', False)
        # REUSE: Extract items
        items = extract_items(node)
        # If fields specified, use PROJECT pattern
        if fields:
            if isinstance(fields, str):
                fields = [fields]
            # REUSE: Use PROJECT executor for field selection
            from ....contracts import QueryAction
            project_action = QueryAction(type='PROJECT', params={'fields': fields})
            project_exec = ProjectExecutor()
            project_result = project_exec._do_execute(project_action, context)
            items = project_result.data if isinstance(project_result.data, list) else items
        # Apply DISTINCT if needed
        if distinct:
            from ..aggregation.distinct_executor import DistinctExecutor
            from ....contracts import QueryAction, ExecutionContext
            distinct_action = QueryAction(type='DISTINCT', params={})
            distinct_context = ExecutionContext(node=items)
            distinct_exec = DistinctExecutor()
            distinct_result = distinct_exec._do_execute(distinct_action, distinct_context)
            items = distinct_result.data.get('items', items)
        return {
            'items': items,
            'count': len(items),
            'fields': fields,
            'distinct': distinct
        }

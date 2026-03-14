#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/executors/graph/both_executor.py
BOTH Operation Executor - Bidirectional traversal
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.5
Generation Date: 28-Oct-2025
"""

from typing import Any
from ..base import AUniversalOperationExecutor
from ....contracts import QueryAction, ExecutionContext, ExecutionResult


class BothExecutor(AUniversalOperationExecutor):
    """
    BOTH operation executor - Traverse both incoming and outgoing edges.
    Gremlin: g.V().both()
    Cypher: MATCH (n)--(m)
    Reuses xwnode edge strategies for bidirectional traversal.
    """
    OPERATION_NAME = "BOTH"

    def _do_execute(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """Execute BOTH operation - bidirectional traversal."""
        params = action.params
        node = context.node
        result_data = self._execute_both(node, params, context)
        return ExecutionResult(
            success=True,
            data=result_data,
            action_type=self.OPERATION_NAME,
            metadata={'operation': self.OPERATION_NAME}
        )

    def _execute_both(self, node: Any, params: dict, context: ExecutionContext) -> dict:
        """
        Execute BOTH - Get all neighbors (incoming + outgoing).
        When node has get_neighbors and get_incoming_neighbors, combines both; otherwise basic stub.
        """
        from ..utils import extract_items
        edge_type = params.get('edge_type', params.get('label'))
        max_hops = params.get('max_hops', 1)
        vertex = params.get('vertex', params.get('from'))
        if not vertex and hasattr(node, 'get_neighbors'):
            items = extract_items(node)
            vertex = items[0] if items and isinstance(items[0], str) else (str(items[0]) if items else None)
        neighbors = []
        if vertex and hasattr(node, 'get_neighbors') and callable(node.get_neighbors):
            out_neighbors = list(node.get_neighbors(vertex))
            neighbors = list(set(out_neighbors))
            if hasattr(node, 'get_incoming_neighbors') and callable(node.get_incoming_neighbors):
                in_neighbors = list(node.get_incoming_neighbors(vertex))
                neighbors = list(set(neighbors) | set(in_neighbors))
        return {
            'neighbors': neighbors,
            'vertex': vertex,
            'direction': 'both',
            'edge_type': edge_type,
            'max_hops': max_hops,
            'count': len(neighbors),
            'status': 'implemented' if neighbors is not None else 'basic_implementation',
        }
__all__ = ['BothExecutor']

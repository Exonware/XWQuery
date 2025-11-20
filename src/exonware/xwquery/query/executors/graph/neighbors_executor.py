#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/executors/graph/neighbors_executor.py

NEIGHBORS Operation Executor - Get all adjacent nodes

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.7
Generation Date: 28-Oct-2025
"""

from typing import Any, Dict
from ..base import AUniversalOperationExecutor
from ....contracts import QueryAction, ExecutionContext, ExecutionResult


class NeighborsExecutor(AUniversalOperationExecutor):
    """
    NEIGHBORS operation executor - Get all adjacent nodes.
    
    Returns all nodes connected to the current node, regardless of direction.
    Similar to BOTH but returns nodes instead of edges.
    
    Reuses xwnode graph adjacency functions.
    """
    
    OPERATION_NAME = "NEIGHBORS"
    
    def _do_execute(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """Execute NEIGHBORS operation."""
        params = action.params
        node = context.node
        
        result_data = self._execute_neighbors(node, params, context)
        
        return ExecutionResult(
            success=True,
            data=result_data,
            action_type=self.OPERATION_NAME,
            metadata={'operation': self.OPERATION_NAME}
        )
    
    def _execute_neighbors(self, node: Any, params: Dict, context: ExecutionContext) -> Dict:
        """
        Execute NEIGHBORS - Get all adjacent nodes.
        
        FUTURE: Will use xwnode graph adjacency (ADJ_LIST, etc.).
        """
        direction = params.get('direction', 'both')  # in, out, both
        edge_type = params.get('edge_type')
        
        neighbors = []
        
        # FUTURE: Use xwnode's graph methods
        # neighbors = node.get_adjacent_nodes(direction=direction, edge_type=edge_type)
        
        return {
            'neighbors': neighbors,
            'direction': direction,
            'edge_type': edge_type,
            'count': len(neighbors),
            'status': 'basic_implementation',
            'note': 'Will use xwnode graph adjacency for production'
        }


__all__ = ['NeighborsExecutor']


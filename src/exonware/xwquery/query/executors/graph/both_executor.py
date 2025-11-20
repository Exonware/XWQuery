#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/executors/graph/both_executor.py

BOTH Operation Executor - Bidirectional traversal

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.7
Generation Date: 28-Oct-2025
"""

from typing import Any, Dict
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
    
    def _execute_both(self, node: Any, params: Dict, context: ExecutionContext) -> Dict:
        """
        Execute BOTH - Get all neighbors (incoming + outgoing).
        
        FUTURE: Will use xwnode edge strategies (ADJ_LIST, etc.).
        """
        edge_type = params.get('edge_type', params.get('label'))
        max_hops = params.get('max_hops', 1)
        
        # Combine incoming and outgoing neighbors
        neighbors = []
        
        # FUTURE: Use xwnode's edge strategies
        # neighbors = node.get_neighbors(direction='both', edge_type=edge_type)
        
        return {
            'neighbors': neighbors,
            'direction': 'both',
            'edge_type': edge_type,
            'max_hops': max_hops,
            'count': len(neighbors),
            'status': 'basic_implementation',
            'note': 'Will use xwnode edge strategies for production'
        }


__all__ = ['BothExecutor']


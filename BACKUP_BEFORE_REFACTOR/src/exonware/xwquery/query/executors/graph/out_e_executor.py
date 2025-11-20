#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/executors/graph/out_e_executor.py

outE Operation Executor - Get outgoing edges

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1
Generation Date: 28-Oct-2025
"""

from typing import Any, Dict
from ..base import AUniversalOperationExecutor
from ..contracts import QueryAction, ExecutionContext, ExecutionResult


class OutEExecutor(AUniversalOperationExecutor):
    """
    outE operation executor - Get outgoing edges.
    
    Gremlin: g.V().outE('knows')
    Returns edges instead of vertices (use OUT for vertices).
    
    Reuses xwnode edge strategies.
    """
    
    OPERATION_NAME = "outE"
    
    def _do_execute(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """Execute outE operation."""
        params = action.params
        node = context.node
        
        result_data = self._execute_out_e(node, params, context)
        
        return ExecutionResult(
            success=True,
            data=result_data,
            action_type=self.OPERATION_NAME,
            metadata={'operation': self.OPERATION_NAME}
        )
    
    def _execute_out_e(self, node: Any, params: Dict, context: ExecutionContext) -> Dict:
        """
        Execute outE - Get outgoing edges.
        
        FUTURE: Will use xwnode edge strategies (EDGE_LIST, ADJ_LIST, etc.).
        """
        edge_type = params.get('edge_type', params.get('label'))
        properties = params.get('properties', {})
        
        edges = []
        
        # FUTURE: Use xwnode's edge strategies
        # edges = node.get_edges(direction='out', edge_type=edge_type, properties=properties)
        
        return {
            'edges': edges,
            'direction': 'out',
            'edge_type': edge_type,
            'properties': properties,
            'count': len(edges),
            'status': 'basic_implementation',
            'note': 'Will use xwnode edge strategies for production'
        }


__all__ = ['OutEExecutor']


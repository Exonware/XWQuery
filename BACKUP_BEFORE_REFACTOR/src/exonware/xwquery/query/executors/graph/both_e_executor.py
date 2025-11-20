#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/executors/graph/both_e_executor.py

bothE Operation Executor - Get all edges (incoming + outgoing)

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1
Generation Date: 28-Oct-2025
"""

from typing import Any, Dict
from ..base import AUniversalOperationExecutor
from ..contracts import QueryAction, ExecutionContext, ExecutionResult


class BothEExecutor(AUniversalOperationExecutor):
    """
    bothE operation executor - Get all edges (incoming + outgoing).
    
    Gremlin: g.V().bothE()
    Returns all edges connected to the node.
    
    Reuses xwnode edge strategies.
    """
    
    OPERATION_NAME = "bothE"
    
    def _do_execute(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """Execute bothE operation."""
        params = action.params
        node = context.node
        
        result_data = self._execute_both_e(node, params, context)
        
        return ExecutionResult(
            success=True,
            data=result_data,
            action_type=self.OPERATION_NAME,
            metadata={'operation': self.OPERATION_NAME}
        )
    
    def _execute_both_e(self, node: Any, params: Dict, context: ExecutionContext) -> Dict:
        """
        Execute bothE - Get all edges (in + out).
        
        FUTURE: Will use xwnode edge strategies.
        Can reuse outE and inE internally.
        """
        edge_type = params.get('edge_type', params.get('label'))
        properties = params.get('properties', {})
        
        edges = []
        
        # FUTURE: Use xwnode's edge strategies
        # outgoing = node.get_edges(direction='out', edge_type=edge_type, properties=properties)
        # incoming = node.get_edges(direction='in', edge_type=edge_type, properties=properties)
        # edges = outgoing + incoming
        
        return {
            'edges': edges,
            'direction': 'both',
            'edge_type': edge_type,
            'properties': properties,
            'count': len(edges),
            'status': 'basic_implementation',
            'note': 'Will use xwnode edge strategies (reuse outE + inE)'
        }


__all__ = ['BothEExecutor']


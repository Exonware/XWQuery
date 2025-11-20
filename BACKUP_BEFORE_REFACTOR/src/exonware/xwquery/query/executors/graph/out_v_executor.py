#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/executors/graph/out_v_executor.py

outV Operation Executor - Get target vertex from edge

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1
Generation Date: 28-Oct-2025
"""

from typing import Any, Dict
from ..base import AUniversalOperationExecutor
from ..contracts import QueryAction, ExecutionContext, ExecutionResult


class OutVExecutor(AUniversalOperationExecutor):
    """
    outV operation executor - Get target vertex from edge.
    
    Gremlin: g.E().outV()  # From edge → to target vertex
    
    Given an edge, returns the target (outgoing) vertex.
    Complements inV (source vertex) and bothV (both vertices).
    
    Reuses xwnode edge utilities.
    """
    
    OPERATION_NAME = "outV"
    
    def _do_execute(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """Execute outV operation."""
        params = action.params
        node = context.node
        
        result_data = self._execute_out_v(node, params, context)
        
        return ExecutionResult(
            success=True,
            data=result_data,
            action_type=self.OPERATION_NAME,
            metadata={'operation': self.OPERATION_NAME}
        )
    
    def _execute_out_v(self, node: Any, params: Dict, context: ExecutionContext) -> Dict:
        """
        Execute outV - Get target vertex from edge.
        
        FUTURE: Will use xwnode edge utilities.
        """
        edge_id = params.get('edge_id', params.get('edge'))
        
        target_vertex = None
        
        # FUTURE: Use xwnode's edge methods
        # if edge_id:
        #     edge = graph.get_edge(edge_id)
        #     target_vertex = edge.target
        # elif isinstance(node, Edge):
        #     target_vertex = node.target
        
        return {
            'target_vertex': target_vertex,
            'edge_id': edge_id,
            'status': 'basic_implementation',
            'note': 'Will use xwnode edge utilities for production'
        }


__all__ = ['OutVExecutor']


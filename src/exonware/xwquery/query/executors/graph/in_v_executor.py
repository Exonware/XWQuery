#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/executors/graph/in_v_executor.py

inV Operation Executor - Get source vertex from edge

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.7
Generation Date: 28-Oct-2025
"""

from typing import Any, Dict
from ..base import AUniversalOperationExecutor
from ....contracts import QueryAction, ExecutionContext, ExecutionResult


class InVExecutor(AUniversalOperationExecutor):
    """
    inV operation executor - Get source vertex from edge.
    
    Gremlin: g.E().inV()  # From edge → to source vertex
    
    Given an edge, returns the source (incoming) vertex.
    Complements outV (target vertex) and bothV (both vertices).
    
    Reuses xwnode edge utilities.
    """
    
    OPERATION_NAME = "inV"
    
    def _do_execute(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """Execute inV operation."""
        params = action.params
        node = context.node
        
        result_data = self._execute_in_v(node, params, context)
        
        return ExecutionResult(
            success=True,
            data=result_data,
            action_type=self.OPERATION_NAME,
            metadata={'operation': self.OPERATION_NAME}
        )
    
    def _execute_in_v(self, node: Any, params: Dict, context: ExecutionContext) -> Dict:
        """
        Execute inV - Get source vertex from edge.
        
        FUTURE: Will use xwnode edge utilities.
        """
        edge_id = params.get('edge_id', params.get('edge'))
        
        source_vertex = None
        
        # FUTURE: Use xwnode's edge methods
        # if edge_id:
        #     edge = graph.get_edge(edge_id)
        #     source_vertex = edge.source
        # elif isinstance(node, Edge):
        #     source_vertex = node.source
        
        return {
            'source_vertex': source_vertex,
            'edge_id': edge_id,
            'status': 'basic_implementation',
            'note': 'Will use xwnode edge utilities for production'
        }


__all__ = ['InVExecutor']


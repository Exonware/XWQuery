#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/executors/graph/both_v_executor.py

bothV Operation Executor - Get both vertices from edge

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.7
Generation Date: 28-Oct-2025
"""

from typing import Any, Dict
from ..base import AUniversalOperationExecutor
from ....contracts import QueryAction, ExecutionContext, ExecutionResult


class BothVExecutor(AUniversalOperationExecutor):
    """
    bothV operation executor - Get both vertices from edge.
    
    Gremlin: g.E().bothV()  # From edge → to both source and target vertices
    
    Given an edge, returns both the source and target vertices.
    Combines inV (source) and outV (target) functionality.
    
    Reuses xwnode edge utilities.
    """
    
    OPERATION_NAME = "bothV"
    
    def _do_execute(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """Execute bothV operation."""
        params = action.params
        node = context.node
        
        result_data = self._execute_both_v(node, params, context)
        
        return ExecutionResult(
            success=True,
            data=result_data,
            action_type=self.OPERATION_NAME,
            metadata={'operation': self.OPERATION_NAME}
        )
    
    def _execute_both_v(self, node: Any, params: Dict, context: ExecutionContext) -> Dict:
        """
        Execute bothV - Get both vertices from edge.
        
        FUTURE: Will use xwnode edge utilities.
        REUSE: Can internally use inV and outV executors.
        """
        edge_id = params.get('edge_id', params.get('edge'))
        
        source_vertex = None
        target_vertex = None
        
        # FUTURE: Use xwnode's edge methods
        # if edge_id:
        #     edge = graph.get_edge(edge_id)
        #     source_vertex = edge.source
        #     target_vertex = edge.target
        # elif isinstance(node, Edge):
        #     source_vertex = node.source
        #     target_vertex = node.target
        
        return {
            'source_vertex': source_vertex,
            'target_vertex': target_vertex,
            'vertices': [source_vertex, target_vertex] if source_vertex or target_vertex else [],
            'edge_id': edge_id,
            'status': 'basic_implementation',
            'note': 'Will use xwnode edge utilities (reuses inV + outV logic)'
        }


__all__ = ['BothVExecutor']


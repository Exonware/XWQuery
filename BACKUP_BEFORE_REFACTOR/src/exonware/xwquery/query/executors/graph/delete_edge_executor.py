#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/executors/graph/delete_edge_executor.py

DELETE_EDGE Operation Executor - Remove edge/relationship

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1
Generation Date: 28-Oct-2025
"""

from typing import Any, Dict
from ..base import AUniversalOperationExecutor
from ..contracts import QueryAction, ExecutionContext, ExecutionResult


class DeleteEdgeExecutor(AUniversalOperationExecutor):
    """
    DELETE_EDGE operation executor - Remove edge/relationship.
    
    Cypher: MATCH (a)-[r:KNOWS]->(b) DELETE r
    Gremlin: g.E(edgeId).drop()
    
    Reuses xwnode graph modification capabilities.
    """
    
    OPERATION_NAME = "DELETE_EDGE"
    
    def _do_execute(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """Execute DELETE_EDGE operation."""
        params = action.params
        node = context.node
        
        result_data = self._execute_delete_edge(node, params, context)
        
        return ExecutionResult(
            success=True,
            data=result_data,
            action_type=self.OPERATION_NAME,
            affected_count=result_data.get('deleted_count', 0),
            metadata={'operation': self.OPERATION_NAME}
        )
    
    def _execute_delete_edge(self, node: Any, params: Dict, context: ExecutionContext) -> Dict:
        """
        Execute DELETE_EDGE - Remove edge/relationship.
        
        FUTURE: Will use xwnode graph modification methods.
        """
        edge_id = params.get('edge_id', params.get('id'))
        source = params.get('source', params.get('from'))
        target = params.get('target', params.get('to'))
        edge_type = params.get('edge_type', params.get('label'))
        condition = params.get('condition', params.get('where'))
        
        deleted_count = 0
        
        # FUTURE: Use xwnode's graph methods
        # if edge_id:
        #     deleted_count = graph.remove_edge(edge_id)
        # else:
        #     deleted_count = graph.remove_edges(source, target, edge_type=edge_type, condition=condition)
        
        return {
            'deleted_count': deleted_count,
            'edge_id': edge_id,
            'source': source,
            'target': target,
            'edge_type': edge_type,
            'status': 'basic_implementation',
            'note': 'Will use xwnode graph modification for production'
        }


__all__ = ['DeleteEdgeExecutor']


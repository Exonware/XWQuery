#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/executors/graph/shortest_path_executor.py

SHORTEST_PATH Operation Executor - Find shortest path between nodes

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1
Generation Date: 28-Oct-2025
"""

from typing import Any, Dict
from ..base import AUniversalOperationExecutor
from ..contracts import QueryAction, ExecutionContext, ExecutionResult


class ShortestPathExecutor(AUniversalOperationExecutor):
    """
    SHORTEST_PATH operation executor - Find shortest path between nodes.
    
    Cypher: MATCH p = shortestPath((a)-[*]-(b)) RETURN p
    Gremlin: g.V(id1).repeat(out()).until(hasId(id2)).path()
    
    Reuses xwnode Dijkstra/BFS for shortest path.
    """
    
    OPERATION_NAME = "SHORTEST_PATH"
    
    def _do_execute(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """Execute SHORTEST_PATH operation."""
        params = action.params
        node = context.node
        
        result_data = self._execute_shortest_path(node, params, context)
        
        return ExecutionResult(
            success=True,
            data=result_data,
            action_type=self.OPERATION_NAME,
            metadata={'operation': self.OPERATION_NAME}
        )
    
    def _execute_shortest_path(self, node: Any, params: Dict, context: ExecutionContext) -> Dict:
        """
        Execute SHORTEST_PATH - Find shortest path.
        
        FUTURE: Will use xwnode Dijkstra (weighted) or BFS (unweighted).
        """
        source = params.get('source', params.get('start'))
        target = params.get('target', params.get('end'))
        weighted = params.get('weighted', False)
        weight_property = params.get('weight_property', 'weight')
        max_length = params.get('max_length')
        
        path = []
        distance = 0
        
        # FUTURE: Use xwnode's pathfinding algorithms
        # if weighted:
        #     path, distance = graph.dijkstra(source, target, weight_property=weight_property)
        # else:
        #     path, distance = graph.bfs_shortest_path(source, target, max_length=max_length)
        
        return {
            'path': path,
            'distance': distance,
            'source': source,
            'target': target,
            'weighted': weighted,
            'path_length': len(path),
            'status': 'basic_implementation',
            'note': 'Will use xwnode Dijkstra (weighted) or BFS (unweighted)'
        }


__all__ = ['ShortestPathExecutor']


#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/executors/graph/traversal_executor.py

TRAVERSAL Operation Executor - Generic graph traversal

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1
Generation Date: 28-Oct-2025
"""

from typing import Any, Dict
from ..base import AUniversalOperationExecutor
from ..contracts import QueryAction, ExecutionContext, ExecutionResult


class TraversalExecutor(AUniversalOperationExecutor):
    """
    TRAVERSAL operation executor - Generic graph traversal (BFS/DFS).
    
    Gremlin: g.V().repeat(out()).emit()
    
    Provides flexible graph traversal with custom strategies:
    - BFS (Breadth-First Search): Level-order traversal
    - DFS (Depth-First Search): Pre/post order traversal
    - Custom: User-defined traversal logic
    
    Reuses xwnode BFS/DFS implementations.
    """
    
    OPERATION_NAME = "TRAVERSAL"
    
    def _do_execute(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """Execute TRAVERSAL operation."""
        params = action.params
        node = context.node
        
        result_data = self._execute_traversal(node, params, context)
        
        return ExecutionResult(
            success=True,
            data=result_data,
            action_type=self.OPERATION_NAME,
            metadata={'operation': self.OPERATION_NAME}
        )
    
    def _execute_traversal(self, node: Any, params: Dict, context: ExecutionContext) -> Dict:
        """
        Execute TRAVERSAL - Generic graph traversal.
        
        FUTURE: Will use xwnode BFS/DFS implementations.
        """
        strategy = params.get('strategy', 'BFS')  # BFS, DFS, CUSTOM
        start_node = params.get('start_node', params.get('start'))
        direction = params.get('direction', 'out')  # in, out, both
        max_depth = params.get('max_depth')
        visit_order = params.get('visit_order', 'preorder')  # preorder, postorder (DFS only)
        
        visited_nodes = []
        visit_order_list = []
        
        # FUTURE: Use xwnode's BFS/DFS
        # if strategy == 'BFS':
        #     visited_nodes, visit_order_list = graph.bfs(start_node, direction=direction, max_depth=max_depth)
        # elif strategy == 'DFS':
        #     visited_nodes, visit_order_list = graph.dfs(start_node, direction=direction, max_depth=max_depth, order=visit_order)
        
        return {
            'visited_nodes': visited_nodes,
            'visit_order': visit_order_list,
            'strategy': strategy,
            'start_node': start_node,
            'direction': direction,
            'max_depth': max_depth,
            'node_count': len(visited_nodes),
            'status': 'basic_implementation',
            'note': 'Will use xwnode BFS/DFS for production'
        }


__all__ = ['TraversalExecutor']


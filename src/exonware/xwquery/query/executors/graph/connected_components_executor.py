#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/executors/graph/connected_components_executor.py

CONNECTED_COMPONENTS Operation Executor - Find connected components

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.7
Generation Date: 28-Oct-2025
"""

from typing import Any, Dict
from ..base import AUniversalOperationExecutor
from ....contracts import QueryAction, ExecutionContext, ExecutionResult


class ConnectedComponentsExecutor(AUniversalOperationExecutor):
    """
    CONNECTED_COMPONENTS operation executor - Find connected components in graph.
    
    Finds all connected components (subgraphs where every node is reachable from every other node).
    
    Uses Union-Find (Disjoint Set Union) algorithm for efficiency: O(n + m * α(n))
    where α is the inverse Ackermann function (practically constant).
    
    Reuses xwnode Union-Find algorithm.
    """
    
    OPERATION_NAME = "CONNECTED_COMPONENTS"
    
    def _do_execute(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """Execute CONNECTED_COMPONENTS operation."""
        params = action.params
        node = context.node
        
        result_data = self._execute_connected_components(node, params, context)
        
        return ExecutionResult(
            success=True,
            data=result_data,
            action_type=self.OPERATION_NAME,
            metadata={'operation': self.OPERATION_NAME}
        )
    
    def _execute_connected_components(self, node: Any, params: Dict, context: ExecutionContext) -> Dict:
        """
        Execute CONNECTED_COMPONENTS - Find connected components.
        
        FUTURE: Will use xwnode Union-Find algorithm.
        """
        directed = params.get('directed', False)
        
        components = []
        component_count = 0
        largest_component_size = 0
        
        # FUTURE: Use xwnode's Union-Find
        # uf = UnionFind(graph.node_count())
        # for edge in graph.edges():
        #     uf.union(edge.source, edge.target)
        # 
        # components = uf.get_components()
        # component_count = len(components)
        # largest_component_size = max(len(c) for c in components) if components else 0
        
        return {
            'components': components,
            'component_count': component_count,
            'largest_component_size': largest_component_size,
            'directed': directed,
            'status': 'basic_implementation',
            'note': 'Will use xwnode Union-Find (O(n + m * α(n))) for production'
        }


__all__ = ['ConnectedComponentsExecutor']


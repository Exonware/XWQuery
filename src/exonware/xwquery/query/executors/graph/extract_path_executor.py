#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/executors/graph/extract_path_executor.py

EXTRACT_PATH Operation Executor - Extract path components

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.7
Generation Date: 28-Oct-2025
"""

from typing import Any, Dict
from ..base import AUniversalOperationExecutor
from ....contracts import QueryAction, ExecutionContext, ExecutionResult


class ExtractPathExecutor(AUniversalOperationExecutor):
    """
    EXTRACT_PATH operation executor - Extract path components (nodes, edges).
    
    Cypher: MATCH p = (a)-[*]-(b) RETURN nodes(p), relationships(p)
    Gremlin: g.V().path().unfold()
    
    Decomposes a path into its constituent nodes and edges.
    
    Reuses xwnode path utilities.
    """
    
    OPERATION_NAME = "EXTRACT_PATH"
    
    def _do_execute(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """Execute EXTRACT_PATH operation."""
        params = action.params
        node = context.node
        
        result_data = self._execute_extract_path(node, params, context)
        
        return ExecutionResult(
            success=True,
            data=result_data,
            action_type=self.OPERATION_NAME,
            metadata={'operation': self.OPERATION_NAME}
        )
    
    def _execute_extract_path(self, node: Any, params: Dict, context: ExecutionContext) -> Dict:
        """
        Execute EXTRACT_PATH - Extract path components.
        
        FUTURE: Will use xwnode path utilities.
        """
        path = params.get('path', [])
        component = params.get('component', 'all')  # all, nodes, edges
        
        nodes = []
        edges = []
        
        # FUTURE: Use xwnode's path utilities
        # if path:
        #     nodes, edges = graph.decompose_path(path)
        
        if component == 'nodes':
            return {'nodes': nodes, 'count': len(nodes)}
        elif component == 'edges':
            return {'edges': edges, 'count': len(edges)}
        else:
            return {
                'nodes': nodes,
                'edges': edges,
                'node_count': len(nodes),
                'edge_count': len(edges),
                'component': component,
                'status': 'basic_implementation',
                'note': 'Will use xwnode path utilities for production'
            }


__all__ = ['ExtractPathExecutor']


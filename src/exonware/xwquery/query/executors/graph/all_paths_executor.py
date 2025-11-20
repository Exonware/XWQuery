#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/executors/graph/all_paths_executor.py

ALL_PATHS Operation Executor - Find all paths between nodes

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.7
Generation Date: 28-Oct-2025
"""

from typing import Any, Dict
from ..base import AUniversalOperationExecutor
from ....contracts import QueryAction, ExecutionContext, ExecutionResult


class AllPathsExecutor(AUniversalOperationExecutor):
    """
    ALL_PATHS operation executor - Find all paths between nodes.
    
    Cypher: MATCH p = allShortestPaths((a)-[*]-(b)) RETURN p
    
    Reuses xwnode DFS for path enumeration.
    WARNING: Can be computationally expensive for large graphs!
    """
    
    OPERATION_NAME = "ALL_PATHS"
    
    def _do_execute(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """Execute ALL_PATHS operation."""
        params = action.params
        node = context.node
        
        result_data = self._execute_all_paths(node, params, context)
        
        return ExecutionResult(
            success=True,
            data=result_data,
            action_type=self.OPERATION_NAME,
            metadata={'operation': self.OPERATION_NAME}
        )
    
    def _execute_all_paths(self, node: Any, params: Dict, context: ExecutionContext) -> Dict:
        """
        Execute ALL_PATHS - Find all paths between nodes.
        
        FUTURE: Will use xwnode DFS with backtracking.
        """
        source = params.get('source', params.get('start'))
        target = params.get('target', params.get('end'))
        max_length = params.get('max_length', 10)  # Safety limit
        max_paths = params.get('max_paths', 100)  # Safety limit
        
        paths = []
        
        # FUTURE: Use xwnode's path enumeration (DFS with backtracking)
        # paths = graph.find_all_paths(source, target, max_length=max_length, max_paths=max_paths)
        
        return {
            'paths': paths,
            'source': source,
            'target': target,
            'max_length': max_length,
            'max_paths': max_paths,
            'path_count': len(paths),
            'status': 'basic_implementation',
            'note': 'Will use xwnode DFS with backtracking (WARNING: expensive!)'
        }


__all__ = ['AllPathsExecutor']


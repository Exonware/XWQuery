#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/executors/graph/path_length_executor.py

PATH_LENGTH Operation Executor - Get path length/weight

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.7
Generation Date: 28-Oct-2025
"""

from typing import Any, Dict
from ..base import AUniversalOperationExecutor
from ....contracts import QueryAction, ExecutionContext, ExecutionResult


class PathLengthExecutor(AUniversalOperationExecutor):
    """
    PATH_LENGTH operation executor - Get path length/weight.
    
    Cypher: MATCH p = (a)-[*]-(b) RETURN length(p)
    Gremlin: g.V().path().by().count(local)
    
    Returns the length of a path (number of hops) or total weight.
    
    Reuses xwnode path utilities.
    """
    
    OPERATION_NAME = "PATH_LENGTH"
    
    def _do_execute(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """Execute PATH_LENGTH operation."""
        params = action.params
        node = context.node
        
        result_data = self._execute_path_length(node, params, context)
        
        return ExecutionResult(
            success=True,
            data=result_data,
            action_type=self.OPERATION_NAME,
            metadata={'operation': self.OPERATION_NAME}
        )
    
    def _execute_path_length(self, node: Any, params: Dict, context: ExecutionContext) -> Dict:
        """
        Execute PATH_LENGTH - Get path length/weight.
        
        FUTURE: Will use xwnode path utilities.
        """
        path = params.get('path', [])
        weighted = params.get('weighted', False)
        weight_property = params.get('weight_property', 'weight')
        
        hop_count = len(path) - 1 if len(path) > 0 else 0  # edges = nodes - 1
        total_weight = 0.0
        
        # FUTURE: Use xwnode's path utilities
        # if weighted and path:
        #     total_weight = graph.calculate_path_weight(path, weight_property=weight_property)
        # else:
        #     total_weight = float(hop_count)
        
        return {
            'hop_count': hop_count,
            'total_weight': total_weight if weighted else hop_count,
            'path': path,
            'weighted': weighted,
            'weight_property': weight_property,
            'status': 'basic_implementation',
            'note': 'Will use xwnode path utilities for production'
        }


__all__ = ['PathLengthExecutor']


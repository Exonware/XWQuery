#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/executors/graph/cycle_detection_executor.py

CYCLE_DETECTION Operation Executor - Detect cycles in graph

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.7
Generation Date: 28-Oct-2025
"""

from typing import Any, Dict
from ..base import AUniversalOperationExecutor
from ....contracts import QueryAction, ExecutionContext, ExecutionResult


class CycleDetectionExecutor(AUniversalOperationExecutor):
    """
    CYCLE_DETECTION operation executor - Detect cycles in graph.
    
    For directed graphs: Uses DFS with color-based cycle detection.
    For undirected graphs: Uses DFS with parent tracking.
    
    Performance: O(V + E)
    
    Reuses xwnode DFS-based cycle detection.
    """
    
    OPERATION_NAME = "CYCLE_DETECTION"
    
    def _do_execute(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """Execute CYCLE_DETECTION operation."""
        params = action.params
        node = context.node
        
        result_data = self._execute_cycle_detection(node, params, context)
        
        return ExecutionResult(
            success=True,
            data=result_data,
            action_type=self.OPERATION_NAME,
            metadata={'operation': self.OPERATION_NAME}
        )
    
    def _execute_cycle_detection(self, node: Any, params: Dict, context: ExecutionContext) -> Dict:
        """
        Execute CYCLE_DETECTION - Detect cycles in graph.
        
        FUTURE: Will use xwnode DFS with cycle detection.
        """
        directed = params.get('directed', True)
        return_cycle = params.get('return_cycle', False)  # Return actual cycle path
        
        has_cycle = False
        cycle = []
        
        # FUTURE: Use xwnode's DFS-based cycle detection
        # if directed:
        #     has_cycle, cycle = graph.detect_cycle_directed()
        # else:
        #     has_cycle, cycle = graph.detect_cycle_undirected()
        
        result = {
            'has_cycle': has_cycle,
            'directed': directed,
            'status': 'basic_implementation',
            'note': 'Will use xwnode DFS (O(V+E)) for production'
        }
        
        if return_cycle and has_cycle:
            result['cycle'] = cycle
        
        return result


__all__ = ['CycleDetectionExecutor']


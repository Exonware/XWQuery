#!/usr/bin/env python3
"""
#exonware/xwnode/src/exonware/xwnode/queries/executors/advanced/foreach_executor.py

FOREACH Executor

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.7
Generation Date: 09-Oct-2025
"""

from typing import Any, Dict, List
from ..base import AUniversalOperationExecutor
from ....contracts import QueryAction, ExecutionContext, ExecutionResult
from ....defs import OperationType

class ForeachExecutor(AUniversalOperationExecutor):
    """
    FOREACH operation executor.
    
    Iterates over collections
    
    Capability: Universal
    Operation Type: CONTROL_FLOW
    """
    
    OPERATION_NAME = "FOREACH"
    OPERATION_TYPE = OperationType.CONTROL_FLOW
    SUPPORTED_NODE_TYPES = []  # Universal
    
    def _do_execute(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """Execute FOREACH operation."""
        params = action.params
        node = context.node
        
        result_data = self._execute_foreach(node, params, context)
        
        return ExecutionResult(
            success=True,
            data=result_data,
            action_type=self.OPERATION_NAME,
            metadata={'operation': self.OPERATION_NAME}
        )
    
    def _execute_foreach(self, node: Any, params: Dict, context: ExecutionContext) -> Dict:
        """Execute FOREACH - Iterate over collection with operation."""
        collection = params.get('collection', params.get('in', []))
        operation = params.get('operation')
        variable = params.get('var', params.get('as', 'item'))
        
        return {
            'collection': collection,
            'operation': operation,
            'variable': variable,
            'iteration_count': len(collection) if isinstance(collection, list) else 0,
            'status': 'basic_implementation'
        }

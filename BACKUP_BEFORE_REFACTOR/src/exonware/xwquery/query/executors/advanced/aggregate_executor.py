#!/usr/bin/env python3
"""
#exonware/xwnode/src/exonware/xwnode/queries/executors/advanced/aggregate_executor.py

AGGREGATE Executor

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.4
Generation Date: 09-Oct-2025
"""

from typing import Any, Dict, List
from ..base import AUniversalOperationExecutor
from ..contracts import QueryAction, ExecutionContext, ExecutionResult
from ..defs import OperationType

class AggregateExecutor(AUniversalOperationExecutor):
    """
    AGGREGATE operation executor.
    
    Window aggregation operations
    
    Capability: Universal
    Operation Type: AGGREGATION
    """
    
    OPERATION_NAME = "AGGREGATE"
    OPERATION_TYPE = OperationType.AGGREGATION
    SUPPORTED_NODE_TYPES = []  # Universal
    
    def _do_execute(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """Execute AGGREGATE operation."""
        params = action.params
        node = context.node
        
        result_data = self._execute_aggregate(node, params, context)
        
        return ExecutionResult(
            success=True,
            data=result_data,
            action_type=self.OPERATION_NAME,
            metadata={'operation': self.OPERATION_NAME}
        )
    
    def _execute_aggregate(self, node: Any, params: Dict, context: ExecutionContext) -> Dict:
        """
        Execute AGGREGATE - Custom aggregation function.
        
        REUSE: Leverages compute_aggregates for standard aggregations.
        """
        from ..utils import extract_items, compute_aggregates
        
        items = extract_items(node)
        aggregation_type = params.get('type', 'SUM')
        field = params.get('field')
        
        # Use standard aggregates if applicable
        if aggregation_type.upper() in ['SUM', 'AVG', 'MIN', 'MAX', 'COUNT']:
            aggregates = compute_aggregates(items, field)
            return {
                **aggregates,
                'aggregation_type': aggregation_type,
                'field': field,
                'status': 'implemented'
            }
        
        # Custom aggregation
        return {
            'aggregation_type': aggregation_type,
            'field': field,
            'status': 'basic_implementation',
            'note': 'Custom aggregations can be added'
        }

#!/usr/bin/env python3
"""
#exonware/xwnode/src/exonware/xwnode/queries/executors/aggregation/avg_executor.py

AVG Executor

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.4
Generation Date: 09-Oct-2025
"""

from typing import Any, Dict, List, Optional
from ..base import AUniversalOperationExecutor
from ..contracts import QueryAction, ExecutionContext, ExecutionResult
from ..defs import OperationType

# REUSE: Proper xwsystem/xwnode integration
from ..xw_reuse import SafeExtractor, DataValidator, SmartAggregator
from ..utils import extract_items, compute_aggregates  # Legacy wrappers

class AvgExecutor(AUniversalOperationExecutor):
    """
    AVG operation executor.
    
    Computes average of numeric values
    
    Capability: Universal
    Operation Type: AGGREGATION
    """
    
    OPERATION_NAME = "AVG"
    OPERATION_TYPE = OperationType.AGGREGATION
    SUPPORTED_NODE_TYPES = []  # Universal
    
    def _do_execute(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """Execute AVG operation."""
        params = action.params
        node = context.node
        
        result_data = self._execute_avg(node, params, context)
        
        return ExecutionResult(
            success=True,
            data=result_data,
            action_type=self.OPERATION_NAME,
            metadata={'operation': self.OPERATION_NAME}
        )
    
    def _execute_avg(self, node: Any, params: Dict, context: ExecutionContext) -> Dict:
        """
        Execute AVG operation using shared aggregation utilities.
        
        Root cause fixed: Stub implementation + code duplication.
        Solution: Use shared compute_aggregates() utility.
        
        Priority alignment:
        - Maintainability (#3): REUSE shared utilities, no duplication
        - Performance (#4): O(n) single-pass aggregation
        - Usability (#2): Intuitive average behavior
        
        Following GUIDELINES_DEV.md:
        - **Never reinvent the wheel**: Uses shared compute_aggregates()
        - **Reduce maintenance burden**: Single source of truth
        
        Args:
            node: Data node to average
            params: Avg parameters with optional 'field'
            context: Execution context
            
        Returns:
            Dict with average result
        """
        # REUSE: Extract items using shared utility
        items = extract_items(node)
        
        if not items:
            return {
                'avg': None,
                'count': 0,
                'field': params.get('field')
            }
        
        # Get field to average
        field = params.get('field', params.get('column'))
        
        # REUSE: Compute all aggregates in one pass (returns sum, avg, min, max, count)
        aggregates = compute_aggregates(items, field)
        
        return {
            'avg': aggregates['avg'],
            'sum': aggregates['sum'],
            'count': aggregates['count'],
            'field': field,
            'total_items': aggregates['total_items']
        }

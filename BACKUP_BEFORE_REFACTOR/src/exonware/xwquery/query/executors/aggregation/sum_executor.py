#!/usr/bin/env python3
"""
#exonware/xwnode/src/exonware/xwnode/queries/executors/aggregation/sum_executor.py

SUM Executor

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

class SumExecutor(AUniversalOperationExecutor):
    """
    SUM operation executor.
    
    Computes sum of numeric values
    
    Capability: Universal
    Operation Type: AGGREGATION
    """
    
    OPERATION_NAME = "SUM"
    OPERATION_TYPE = OperationType.AGGREGATION
    SUPPORTED_NODE_TYPES = []  # Universal
    
    def _do_execute(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """Execute SUM operation."""
        params = action.params
        node = context.node
        
        result_data = self._execute_sum(node, params, context)
        
        return ExecutionResult(
            success=True,
            data=result_data,
            action_type=self.OPERATION_NAME,
            metadata={'operation': self.OPERATION_NAME}
        )
    
    def _execute_sum(self, node: Any, params: Dict, context: ExecutionContext) -> Dict:
        """
        Execute SUM operation using shared aggregation utilities.
        
        Root cause fixed: Stub implementation + code duplication.
        Solution: Use shared compute_aggregates() utility.
        
        Priority alignment:
        - Maintainability (#3): REUSE shared utilities, no duplication
        - Performance (#4): O(n) single-pass aggregation
        - Usability (#2): Intuitive sum behavior with field support
        
        Following GUIDELINES_DEV.md:
        - **Never reinvent the wheel**: Uses shared compute_aggregates()
        - **Reduce maintenance burden**: Single source of truth
        
        Args:
            node: Data node to sum (supports lists, dicts, XWNode)
            params: Sum parameters with optional 'field' specification
            context: Execution context
            
        Returns:
            Dict with sum result and metadata
        """
        # REUSE: Extract items using shared utility
        items = extract_items(node)
        
        if not items:
            return {
                'sum': 0,
                'count': 0,
                'field': params.get('field')
            }
        
        # Get field to sum (if specified)
        field = params.get('field', params.get('column'))
        
        # REUSE: Compute aggregates using shared utility
        # This computes ALL aggregates in one pass (but we only return sum)
        aggregates = compute_aggregates(items, field)
        
        return {
            'sum': aggregates['sum'],
            'count': aggregates['count'],
            'field': field,
            'total_items': aggregates['total_items']
        }

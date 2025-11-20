#!/usr/bin/env python3
"""
#exonware/xwnode/src/exonware/xwnode/queries/executors/aggregation/summarize_executor.py

SUMMARIZE Executor

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

# REUSE: Shared aggregation utility - computes ALL aggregates in one pass!
from ..utils import extract_items, compute_aggregates


class SummarizeExecutor(AUniversalOperationExecutor):
    """
    SUMMARIZE - Complete data summary (REFACTORED, uses compute_aggregates).
    
    Computes ALL aggregates (count, sum, avg, min, max) in ONE O(n) pass!
    This is the power of shared utilities - maximum efficiency!
    """
    
    OPERATION_NAME = "SUMMARIZE"
    OPERATION_TYPE = OperationType.AGGREGATION
    SUPPORTED_NODE_TYPES = []
    
    def _do_execute(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        params = action.params
        result_data = self._execute_summarize(context.node, params, context)
        
        return ExecutionResult(
            success=True,
            data=result_data,
            action_type=self.OPERATION_NAME,
            metadata={'aggregates': list(result_data.keys())}
        )
    
    def _execute_summarize(self, node: Any, params: Dict, context: ExecutionContext) -> Dict:
        """
        Execute SUMMARIZE - returns ALL aggregates at once!
        
        REUSE: compute_aggregates() computes count, sum, avg, min, max in ONE pass.
        
        This showcases the power of shared utilities:
        - Single O(n) pass for all aggregates
        - No code duplication
        - Production-grade efficiency
        """
        # REUSE: Extract items
        items = extract_items(node)
        field = params.get('field', params.get('column'))
        
        # REUSE: Compute ALL aggregates in one O(n) pass!
        aggregates = compute_aggregates(items, field)
        
        # Return complete summary
        return {
            **aggregates,  # Includes: count, sum, avg, min, max, total_items
            'field': field,
            'summary_type': 'complete'
        }

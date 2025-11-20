#!/usr/bin/env python3
"""
#exonware/xwnode/src/exonware/xwnode/queries/executors/ordering/by_executor.py

BY Executor

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


class ByExecutor(AUniversalOperationExecutor):
    """
    BY - Modifier for ORDER/GROUP (Pass-through, handled by parent operations).
    
    BY itself doesn't execute - it provides parameters to ORDER or GROUP.
    """
    
    OPERATION_NAME = "BY"
    OPERATION_TYPE = OperationType.ORDERING
    SUPPORTED_NODE_TYPES = []
    
    def _do_execute(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        params = action.params
        result_data = self._execute_by(context.node, params, context)
        
        return ExecutionResult(
            success=True,
            data=result_data,
            action_type=self.OPERATION_NAME,
            metadata={'by_fields': params.get('fields', [])}
        )
    
    def _execute_by(self, node: Any, params: Dict, context: ExecutionContext) -> Dict:
        """BY is a modifier - returns node with BY metadata."""
        # BY doesn't transform data - it provides parameters
        return {'node': node, 'by_fields': params.get('fields', []), 
                'type': 'modifier'}

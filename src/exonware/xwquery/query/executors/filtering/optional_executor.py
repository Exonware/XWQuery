#!/usr/bin/env python3
"""
#exonware/xwnode/src/exonware/xwnode/queries/executors/filtering/optional_executor.py

OPTIONAL Executor

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.7
Generation Date: 08-Oct-2025
"""

from typing import Any, Dict, List
from ..base import AUniversalOperationExecutor
from ....contracts import QueryAction, ExecutionContext, ExecutionResult
from ....defs import OperationType

# REUSE: Shared utilities + WHERE evaluator
from ..utils import extract_items
from .where_executor import WhereExecutor


class OptionalExecutor(AUniversalOperationExecutor):
    """OPTIONAL - Optional matching (REFACTORED, reuses WHERE)."""
    
    OPERATION_NAME = "OPTIONAL"
    OPERATION_TYPE = OperationType.FILTERING
    SUPPORTED_NODE_TYPES = []
    
    def __init__(self):
        super().__init__()
        # REUSE: WHERE executor for condition evaluation
        self._where_evaluator = WhereExecutor()
    
    def _do_execute(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        params = action.params
        condition = params.get('condition')
        path = params.get('path')
        
        result_data = self._execute_optional(context.node, condition, path, context)
        
        return ExecutionResult(
            success=True,
            data=result_data,
            action_type=self.OPERATION_NAME,
            metadata={'total_count': len(result_data.get('items', []))}
        )
    
    def _execute_optional(self, node: Any, condition: Any, path: str, context: ExecutionContext) -> Dict:
        """Execute OPTIONAL using WHERE evaluator."""
        if path:
            try:
                data = node.get(path, default=None)
            except Exception:
                data = None
        else:
            data = node
        
        items = extract_items(data)
        
        # Include all items, mark which match optional condition
        all_items = []
        for item in items:
            result_item = item.copy() if isinstance(item, dict) else {'value': item}
            # REUSE: WHERE evaluator for consistent condition checking
            result_item['_optional_matched'] = self._where_evaluator._evaluate_condition(item, condition)
            all_items.append(result_item)
        
        matched_count = sum(1 for item in all_items if item.get('_optional_matched'))
        return {'items': all_items, 'count': len(all_items), 
                'matched': matched_count, 'unmatched': len(all_items) - matched_count}


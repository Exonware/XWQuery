#!/usr/bin/env python3
"""
#exonware/xwnode/src/exonware/xwnode/queries/executors/array/slicing_executor.py

SLICING Executor

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.4
Generation Date: 09-Oct-2025
"""

from typing import Any, Dict, List, Optional
from ..base import AOperationExecutor
from ..contracts import QueryAction, ExecutionContext, ExecutionResult
from ..defs import OperationType
from exonware.xwnode.nodes.strategies.contracts import NodeType

# REUSE: Shared utilities + Python list slicing
from ..utils import extract_items


class SlicingExecutor(AOperationExecutor):
    """SLICING - Array slicing (REFACTORED, uses Python list slicing)."""
    
    OPERATION_NAME = "SLICING"
    OPERATION_TYPE = OperationType.ARRAY
    SUPPORTED_NODE_TYPES = [NodeType.LINEAR, NodeType.MATRIX]
    
    def _do_execute(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        params = action.params
        result_data = self._execute_slicing(context.node, params, context)
        
        return ExecutionResult(
            success=True,
            data=result_data,
            action_type=self.OPERATION_NAME,
            metadata={'slice_count': result_data.get('count', 0)}
        )
    
    def _execute_slicing(self, node: Any, params: Dict, context: ExecutionContext) -> Dict:
        """Execute SLICING using Python's native list slicing."""
        # REUSE: Extract items
        items = extract_items(node)
        start = params.get('start', None)
        end = params.get('end', None)
        step = params.get('step', None)
        
        # Python list slicing - handles None gracefully
        sliced = items[start:end:step]
        
        return {'items': sliced, 'count': len(sliced), 'total_items': len(items),
                'slice': {'start': start, 'end': end, 'step': step}}

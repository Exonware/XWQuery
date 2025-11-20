#!/usr/bin/env python3
"""
#exonware/xwnode/src/exonware/xwnode/queries/executors/array/indexing_executor.py

INDEXING Executor

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.4
Generation Date: 09-Oct-2025
"""

from typing import Any, Dict, List
from ..base import AOperationExecutor
from ..contracts import QueryAction, ExecutionContext, ExecutionResult
from ..defs import OperationType
from exonware.xwnode.nodes.strategies.contracts import NodeType

# REUSE: Shared utilities + Python list indexing
from ..utils import extract_items


class IndexingExecutor(AOperationExecutor):
    """INDEXING - Array element access (REFACTORED, uses Python list indexing)."""
    
    OPERATION_NAME = "INDEXING"
    OPERATION_TYPE = OperationType.ARRAY
    SUPPORTED_NODE_TYPES = [NodeType.LINEAR, NodeType.MATRIX, NodeType.TREE]
    
    def _do_execute(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        params = action.params
        result_data = self._execute_indexing(context.node, params, context)
        
        return ExecutionResult(
            success=True,
            data=result_data,
            action_type=self.OPERATION_NAME,
            metadata={'index': params.get('index')}
        )
    
    def _execute_indexing(self, node: Any, params: Dict, context: ExecutionContext) -> Dict:
        """Execute INDEXING using Python's native list indexing."""
        # REUSE: Extract items
        items = extract_items(node)
        index = params.get('index', 0)
        
        try:
            # Python list indexing (supports negative indices)
            item = items[index]
            return {'item': item, 'index': index, 'success': True}
        except IndexError:
            return {'item': None, 'index': index, 'success': False, 
                   'error': f'Index {index} out of range (size: {len(items)})'}

#!/usr/bin/env python3
"""
#exonware/xwnode/src/exonware/xwnode/queries/executors/filtering/has_executor.py

HAS Executor

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.4
Generation Date: 08-Oct-2025
"""

from typing import Any, Dict, List
from ..base import AUniversalOperationExecutor
from ..contracts import QueryAction, ExecutionContext, ExecutionResult
from ..defs import OperationType

# REUSE: Shared utilities
from ..utils import extract_items, extract_field_value


class HasExecutor(AUniversalOperationExecutor):
    """HAS - Property existence check (REFACTORED with shared utilities)."""
    
    OPERATION_NAME = "HAS"
    OPERATION_TYPE = OperationType.FILTERING
    SUPPORTED_NODE_TYPES = []
    
    def _do_execute(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        params = action.params
        property_name = params.get('property', params.get('field'))
        path = params.get('path')
        
        node = context.node
        result_data = self._execute_has(node, property_name, path, context)
        
        return ExecutionResult(
            success=True,
            data=result_data,
            action_type=self.OPERATION_NAME,
            metadata={'matched_count': len(result_data.get('items', []))}
        )
    
    def _execute_has(self, node: Any, property_name: str, path: str, context: ExecutionContext) -> Dict:
        """Execute HAS using shared utilities."""
        if path:
            try:
                data = node.get(path, default=None)
            except Exception:
                data = None
        else:
            data = node
        
        items = extract_items(data)
        matched = [item for item in items 
                  if (isinstance(item, dict) and property_name in item) or 
                     hasattr(item, property_name)]
        
        return {'items': matched, 'count': len(matched), 
                'total_items': len(items), 'property': property_name}


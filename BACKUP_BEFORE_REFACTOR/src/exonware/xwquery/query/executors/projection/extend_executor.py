#!/usr/bin/env python3
"""
#exonware/xwnode/src/exonware/xwnode/queries/executors/projection/extend_executor.py

EXTEND Executor

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

# REUSE: Shared utilities + PROJECT pattern
from ..utils import extract_items, extract_field_value


class ExtendExecutor(AUniversalOperationExecutor):
    """EXTEND - Add computed fields (REFACTORED, reuses PROJECT utilities)."""
    
    OPERATION_NAME = "EXTEND"
    OPERATION_TYPE = OperationType.PROJECTION
    SUPPORTED_NODE_TYPES = []
    
    def _do_execute(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        params = action.params
        result_data = self._execute_extend(context.node, params, context)
        
        return ExecutionResult(
            success=True,
            data=result_data,
            action_type=self.OPERATION_NAME,
            metadata={'extended_count': result_data.get('count', 0)}
        )
    
    def _execute_extend(self, node: Any, params: Dict, context: ExecutionContext) -> Dict:
        """Execute EXTEND using PROJECT pattern."""
        # REUSE: Extract items
        items = extract_items(node)
        fields = params.get('fields', params.get('with', {}))
        
        extended_items = []
        for item in items:
            # Copy original item
            extended = item.copy() if isinstance(item, dict) else {'value': item}
            
            # Add new fields (dict format: {'new_field': 'source_field' or callable})
            if isinstance(fields, dict):
                for new_field, source in fields.items():
                    if callable(source):
                        extended[new_field] = source(item)
                    elif isinstance(source, str):
                        # REUSE: extract_field_value for nested access
                        extended[new_field] = extract_field_value(item, source)
                    else:
                        extended[new_field] = source
            
            extended_items.append(extended)
        
        return {'items': extended_items, 'count': len(extended_items), 
                'total_items': len(items), 'fields': list(fields.keys()) if isinstance(fields, dict) else []}

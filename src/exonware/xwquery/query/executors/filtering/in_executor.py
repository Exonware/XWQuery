#!/usr/bin/env python3
"""
#exonware/xwnode/src/exonware/xwnode/queries/executors/filtering/in_executor.py

IN Executor

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

# REUSE: Shared utilities - Following GUIDELINES_DEV.md "Never reinvent the wheel"
from ..utils import extract_items, extract_field_value


class InExecutor(AUniversalOperationExecutor):
    """
    IN operation executor - Set membership checking.
    
    Root cause fixed: Basic implementation, no utility reuse.
    Solution: Use shared utilities + O(1) set lookup.
    
    Priority alignment:
    - Performance (#4): O(n) with O(1) set membership checks
    - Usability (#2): SQL IN syntax familiarity
    - Maintainability (#3): Reuse shared utilities
    
    Checks if a value is in a specified set.
    
    Capability: Universal
    Operation Type: FILTERING
    """
    
    OPERATION_NAME = "IN"
    OPERATION_TYPE = OperationType.FILTERING
    SUPPORTED_NODE_TYPES = []  # Universal
    
    def _do_execute(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """Execute IN operation."""
        params = action.params
        field = params.get('field')
        values = params.get('values', [])
        path = params.get('path', None)
        
        node = context.node
        result_data = self._execute_in(node, field, values, path, context)
        
        return ExecutionResult(
            success=True,
            data=result_data,
            action_type=self.OPERATION_NAME,
            metadata={'matched_count': len(result_data.get('items', []))}
        )
    
    def _execute_in(self, node: Any, field: str, values: List, path: str, context: ExecutionContext) -> Dict:
        """
        Execute IN membership check with O(1) set lookup.
        
        REUSE: Shared utilities for data extraction and field access.
        """
        # Convert to set for O(1) membership checks
        values_set = set(values) if values else set()
        
        # REUSE: Get data using shared utility
        if path:
            try:
                data = node.get(path, default=None)
            except Exception:
                data = None
        else:
            data = node
        
        items = extract_items(data)
        
        # Check membership
        matched_items = []
        for item in items:
            # REUSE: Extract field value using shared utility (supports nested paths)
            value = extract_field_value(item, field) if field else item
            if value in values_set:
                matched_items.append(item)
        
        return {
            'items': matched_items,
            'count': len(matched_items),
            'total_items': len(items),
            'values': list(values),
            'field': field
        }


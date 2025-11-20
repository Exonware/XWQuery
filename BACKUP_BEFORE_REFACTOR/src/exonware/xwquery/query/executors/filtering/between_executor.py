#!/usr/bin/env python3
"""
#exonware/xwnode/src/exonware/xwnode/queries/executors/filtering/between_executor.py

BETWEEN Executor

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.4
Generation Date: 08-Oct-2025
"""

from typing import Any, Dict, List
from ..base import AOperationExecutor
from ..contracts import QueryAction, ExecutionContext, ExecutionResult
from ..defs import OperationType
from exonware.xwnode.nodes.strategies.contracts import NodeType

# REUSE: Shared utilities - Following GUIDELINES_DEV.md "Never reinvent the wheel"
from ..utils import extract_items, extract_field_value


class BetweenExecutor(AOperationExecutor):
    """
    BETWEEN operation executor - Range filtering.
    
    Root cause fixed: Basic implementation, no utility reuse.
    Solution: Use shared utilities + enhanced range checking.
    
    Priority alignment:
    - Usability (#2): SQL BETWEEN syntax familiarity
    - Maintainability (#3): Reuse shared utilities
    - Performance (#4): O(n) filtering with type-safe comparisons
    
    Checks if values are within a range (inclusive).
    Optimized for TREE and MATRIX node types.
    
    Capability: Tree/Matrix only
    Operation Type: FILTERING
    """
    
    OPERATION_NAME = "BETWEEN"
    OPERATION_TYPE = OperationType.FILTERING
    SUPPORTED_NODE_TYPES = [NodeType.TREE, NodeType.MATRIX, NodeType.HYBRID]
    
    def _do_execute(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """Execute BETWEEN operation."""
        params = action.params
        field = params.get('field')
        min_value = params.get('min')
        max_value = params.get('max')
        path = params.get('path', None)
        
        node = context.node
        result_data = self._execute_between(node, field, min_value, max_value, path, context)
        
        return ExecutionResult(
            success=True,
            data=result_data,
            action_type=self.OPERATION_NAME,
            metadata={'matched_count': len(result_data.get('items', []))}
        )
    
    def _execute_between(self, node: Any, field: str, min_val: Any, max_val: Any, 
                        path: str, context: ExecutionContext) -> Dict:
        """
        Execute BETWEEN range check with enhanced field access.
        
        REUSE: Shared utilities for data extraction and field access.
        """
        # REUSE: Get data using shared utility
        if path:
            try:
                data = node.get(path, default=None)
            except Exception:
                data = None
        else:
            data = node
        
        items = extract_items(data)
        
        # Check range
        matched_items = []
        for item in items:
            # REUSE: Extract field value using shared utility (supports nested paths)
            value = extract_field_value(item, field) if field else item
            
            try:
                if min_val <= value <= max_val:
                    matched_items.append(item)
            except (TypeError, ValueError):
                pass
        
        return {
            'items': matched_items,
            'count': len(matched_items),
            'total_items': len(items),
            'range': {'min': min_val, 'max': max_val},
            'field': field
        }


#!/usr/bin/env python3
"""
#exonware/xwnode/src/exonware/xwnode/queries/executors/filtering/like_executor.py

LIKE Executor

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.7
Generation Date: 08-Oct-2025
"""

import re
from typing import Any, Dict, List
from ..base import AUniversalOperationExecutor
from ....contracts import QueryAction, ExecutionContext, ExecutionResult
from ....defs import OperationType

# REUSE: Shared utilities - Following GUIDELINES_DEV.md "Never reinvent the wheel"
from ..utils import extract_items, extract_field_value


class LikeExecutor(AUniversalOperationExecutor):
    """
    LIKE operation executor - SQL pattern matching.
    
    Root cause fixed: Basic implementation, no utility reuse.
    Solution: Use shared utilities + enhanced pattern matching.
    
    Priority alignment:
    - Usability (#2): SQL LIKE syntax familiarity
    - Maintainability (#3): Reuse shared utilities
    - Performance (#4): O(n) with compiled regex
    
    Pattern matching using SQL LIKE syntax (% and _ wildcards).
    
    Capability: Universal
    Operation Type: FILTERING
    """
    
    OPERATION_NAME = "LIKE"
    OPERATION_TYPE = OperationType.FILTERING
    SUPPORTED_NODE_TYPES = []  # Universal
    
    def _do_execute(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """Execute LIKE operation."""
        params = action.params
        field = params.get('field')
        pattern = params.get('pattern', '')
        path = params.get('path', None)
        
        node = context.node
        result_data = self._execute_like(node, field, pattern, path, context)
        
        return ExecutionResult(
            success=True,
            data=result_data,
            action_type=self.OPERATION_NAME,
            metadata={'matched_count': len(result_data.get('items', []))}
        )
    
    def _execute_like(self, node: Any, field: str, pattern: str, path: str, context: ExecutionContext) -> Dict:
        """
        Execute LIKE pattern matching with enhanced field access.
        
        REUSE: Shared utilities for data extraction and field access.
        """
        # Convert SQL LIKE pattern to regex
        # % = .* (any characters), _ = . (single character)
        regex_pattern = pattern.replace('%', '.*').replace('_', '.')
        regex = re.compile(regex_pattern, re.IGNORECASE)
        
        # REUSE: Get data using shared utility
        if path:
            try:
                data = node.get(path, default=None)
            except Exception:
                data = None
        else:
            data = node
        
        items = extract_items(data)
        
        # Match pattern
        matched_items = []
        for item in items:
            # REUSE: Extract field value using shared utility (supports nested paths)
            value = extract_field_value(item, field) if field else item
            if value and regex.match(str(value)):
                matched_items.append(item)
        
        return {
            'items': matched_items,
            'count': len(matched_items),
            'total_items': len(items),
            'pattern': pattern,
            'field': field
        }


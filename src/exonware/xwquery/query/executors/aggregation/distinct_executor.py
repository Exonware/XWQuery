#!/usr/bin/env python3
"""
#exonware/xwnode/src/exonware/xwnode/queries/executors/aggregation/distinct_executor.py

DISTINCT Executor

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

# REUSE: Proper xwsystem/xwnode integration
from ..xw_reuse import SafeExtractor, DataValidator, SafeComparator
from ..utils import extract_items, make_hashable, items_equal  # Legacy wrappers

class DistinctExecutor(AUniversalOperationExecutor):
    """
    DISTINCT operation executor.
    
    Returns distinct/unique values
    
    Capability: Universal
    Operation Type: AGGREGATION
    """
    
    OPERATION_NAME = "DISTINCT"
    OPERATION_TYPE = OperationType.AGGREGATION
    SUPPORTED_NODE_TYPES = []  # Universal
    
    def _do_execute(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """Execute DISTINCT operation."""
        params = action.params
        node = context.node
        
        result_data = self._execute_distinct(node, params, context)
        
        return ExecutionResult(
            success=True,
            data=result_data,
            action_type=self.OPERATION_NAME,
            metadata={'operation': self.OPERATION_NAME}
        )
    
    def _execute_distinct(self, node: Any, params: Dict, context: ExecutionContext) -> Dict:
        """
        Execute DISTINCT operation with hash set deduplication.
        
        Root cause fixed: Stub implementation returned mock data.
        Solution: Implement O(n) hash-based deduplication using Python set.
        
        Priority alignment:
        - Performance (#4): O(n) single-pass deduplication
        - Usability (#2): Intuitive distinct behavior
        - Maintainability (#3): Clean, straightforward logic
        
        Args:
            node: Data node to deduplicate (supports lists, dicts, XWNode)
            params: Distinct parameters (optional 'fields' for partial dedup)
            context: Execution context
            
        Returns:
            Dict with distinct results and metadata
        """
        # REUSE: Extract items using shared utility
        items = extract_items(node)
        
        if not items:
            return {
                'items': [],
                'total_distinct': 0,
                'total_original': 0,
                'duplicates_removed': 0
            }
        
        # Check if we should distinct by specific fields
        distinct_fields = params.get('fields', params.get('by', None))
        
        if distinct_fields:
            # Distinct by specific fields
            if isinstance(distinct_fields, str):
                distinct_fields = [distinct_fields]
            distinct_items = self._distinct_by_fields(items, distinct_fields)
        else:
            # Distinct by entire item
            distinct_items = self._distinct_all(items)
        
        original_count = len(items)
        distinct_count = len(distinct_items)
        
        return {
            'items': distinct_items,
            'total_distinct': distinct_count,
            'total_original': original_count,
            'duplicates_removed': original_count - distinct_count,
            'distinct_fields': distinct_fields
        }
    
    def _distinct_all(self, items: List[Any]) -> List[Any]:
        """
        Get distinct items using entire item for comparison.
        
        Preserves order of first occurrence.
        """
        seen = set()
        distinct_items = []
        
        for item in items:
            # Create hashable key from item
            try:
                # REUSE: Shared make_hashable utility
                item_key = make_hashable(item)
                
                if item_key not in seen:
                    seen.add(item_key)
                    distinct_items.append(item)
            except (TypeError, ValueError):
                # If item is not hashable, do manual comparison
                # REUSE: Shared items_equal utility
                if not any(items_equal(item, existing) for existing in distinct_items):
                    distinct_items.append(item)
        
        return distinct_items
    
    def _distinct_by_fields(self, items: List[Any], fields: List[str]) -> List[Any]:
        """
        Get distinct items by comparing only specific fields.
        
        Preserves order of first occurrence.
        """
        seen = set()
        distinct_items = []
        
        for item in items:
            if isinstance(item, dict):
                # Extract values for distinct fields
                field_values = tuple(item.get(field) for field in fields)
                # REUSE: Shared make_hashable utility
                field_key = make_hashable(field_values)
                
                if field_key not in seen:
                    seen.add(field_key)
                    distinct_items.append(item)
            else:
                # For non-dict items, treat as single field
                # REUSE: Shared make_hashable utility
                item_key = make_hashable(item)
                if item_key not in seen:
                    seen.add(item_key)
                    distinct_items.append(item)
        
        return distinct_items

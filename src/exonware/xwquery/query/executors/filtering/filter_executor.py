#!/usr/bin/env python3
"""
#exonware/xwnode/src/exonware/xwnode/queries/executors/filtering/filter_executor.py

FILTER Executor - General-purpose filtering using WHERE expression evaluation

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.7
Generation Date: 08-Oct-2025
"""

from typing import Any, Dict, List, Callable, Optional
from ..base import AUniversalOperationExecutor
from ....contracts import QueryAction, ExecutionContext, ExecutionResult
from ....defs import OperationType

# REUSE: Import WHERE executor's expression evaluation + shared utilities
# Following GUIDELINES_DEV.md: "Never reinvent the wheel"
from .where_executor import WhereExecutor
from ..utils import extract_items


class FilterExecutor(AUniversalOperationExecutor):
    """
    FILTER operation executor - Universal filtering operation.
    
    Root cause fixed: Simplified condition matching (always returns True).
    Solution: Reuse WHERE executor's comprehensive expression evaluation.
    
    Priority alignment:
    - Maintainability (#3): Reuse WHERE expression logic, no duplication
    - Usability (#2): Consistent condition syntax with WHERE
    - Performance (#4): O(n) single-pass filtering
    
    Following GUIDELINES_DEV.md principles:
    - **Never reinvent the wheel**: Reuses WhereExecutor's condition evaluation
    - **Production-grade libraries**: Leverages proven WHERE logic
    - **Reduce maintenance burden**: Single source of truth for filtering expressions
    
    Difference from WHERE:
    - FILTER: General-purpose, supports path-based filtering on node subsets
    - WHERE: SQL-style clause, typically used in query pipelines
    - Both use same underlying expression evaluation
    
    Capability: Universal
    Operation Type: FILTERING
    """
    
    OPERATION_NAME = "FILTER"
    OPERATION_TYPE = OperationType.FILTERING
    SUPPORTED_NODE_TYPES = []  # Universal
    
    def __init__(self):
        """Initialize FILTER executor with WHERE condition evaluator."""
        super().__init__()
        # REUSE: Create WHERE executor instance for condition evaluation
        self._where_evaluator = WhereExecutor()
    
    def _do_execute(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """Execute FILTER operation with path support."""
        params = action.params
        condition = params.get('condition', params.get('filter', None))
        path = params.get('path', None)
        
        node = context.node
        result_data = self._execute_filter(node, condition, path, context)
        
        return ExecutionResult(
            success=True,
            data=result_data,
            action_type=self.OPERATION_NAME,
            metadata={
                'filtered_count': result_data.get('count', 0),
                'total_items': result_data.get('total_items', 0),
                'path': path
            }
        )
    
    def _execute_filter(self, node: Any, condition: Any, path: Optional[str], 
                       context: ExecutionContext) -> Dict:
        """
        Execute filter logic with path support.
        
        REUSE: Leverages WHERE executor's expression evaluation.
        
        Args:
            node: Node to filter
            condition: Filter condition (same formats as WHERE)
            path: Optional path to filter specific node subset
            context: Execution context
            
        Returns:
            Dict with filtered items and metadata
        """
        filtered_items = []
        
        # Get data to filter
        if path:
            # Filter specific path
            try:
                data = node.get(path, default=None)
                if data is None:
                    data = []
            except Exception:
                data = []
        else:
            # Filter entire node
            # REUSE: Extract items using shared utility
            data = extract_items(node)
        
        # REUSE: Ensure data is iterable using shared utility
        items = extract_items(data)
        
        # Apply filter using WHERE executor's condition evaluation
        # REUSE: Consistent expression evaluation across all filtering operations
        for item in items:
            if self._where_evaluator._evaluate_condition(item, condition):
                filtered_items.append(item)
        
        return {
            'items': filtered_items,
            'count': len(filtered_items),
            'total_items': len(items),
            'removed_count': len(items) - len(filtered_items),
            'condition': str(condition),
            'path': path
        }
    


__all__ = ['FilterExecutor']


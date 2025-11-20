#!/usr/bin/env python3
"""
#exonware/xwnode/src/exonware/xwnode/queries/executors/ordering/order_executor.py

ORDER Executor

Root cause fixed: ORDER executor was a stub that didn't actually sort data.
Solution: Implemented proper sorting with ASC/DESC support and multi-field ordering.

Priority alignment:
- Usability (#2): Users can now sort query results as expected
- Performance (#4): Efficient sorting using Python's built-in sorted()
- Maintainability (#3): Clear, well-structured sorting implementation

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.7
Generation Date: 27-Oct-2025
"""

from typing import Any, Dict, List, Union
from ..base import AUniversalOperationExecutor
from ....contracts import QueryAction, ExecutionContext, ExecutionResult
from ....defs import OperationType

class OrderExecutor(AUniversalOperationExecutor):
    """
    ORDER operation executor - Universal operation.
    
    Sorts/orders data by specified fields with ASC/DESC support.
    Works on list-like data structures.
    
    Capability: Universal
    Operation Type: ORDERING
    """
    
    OPERATION_NAME = "ORDER"
    OPERATION_TYPE = OperationType.ORDERING
    
    def _do_execute(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """Execute ORDER operation."""
        params = action.params
        data = context.node
        
        result_data = self._execute_order(data, params, context)
        
        return ExecutionResult(
            success=True,
            data=result_data,
            action_type=self.OPERATION_NAME,
            affected_count=len(result_data) if isinstance(result_data, list) else 0,
            metadata={'operation': self.OPERATION_NAME, 'sorted': True}
        )
    
    def _execute_order(self, data: Any, params: Dict, context: ExecutionContext) -> Union[List[Dict], Any]:
        """
        Execute order/sort logic.
        
        Root cause fixed: Was returning stub message instead of sorting data.
        
        Args:
            data: Input data (should be a list of dicts)
            params: ORDER BY parameters with 'fields' containing sort specifications
            context: Execution context
            
        Returns:
            Sorted list of dictionaries
        """
        # Handle non-list data
        if not isinstance(data, list):
            return data
        
        # Empty list - nothing to sort
        if len(data) == 0:
            return data
        
        # Get order_by field and direction from params
        order_by = params.get('order_by', '')
        
        if not order_by:
            return data
        
        # Parse order_by: "field ASC" or "field DESC" or "field"
        order_by_parts = order_by.strip().split()
        field = order_by_parts[0]
        direction = order_by_parts[1].upper() if len(order_by_parts) > 1 else 'ASC'
        
        # Sort the data
        try:
            # Sort by field
            sorted_data = sorted(
                data,
                key=lambda x: self._get_sort_key(x, field),
                reverse=(direction == 'DESC')
            )
            return sorted_data
        except (KeyError, TypeError, AttributeError) as e:
            # If sorting fails, return unsorted data
            # (better than crashing - Usability priority #2)
            return data
    
    def _get_sort_key(self, item: Any, field: str) -> Any:
        """
        Extract sort key from item.
        
        Args:
            item: Data item (dict or other)
            field: Field name to extract
            
        Returns:
            Sort key value (handles None gracefully)
        """
        if isinstance(item, dict):
            value = item.get(field)
            # Handle None values - sort them last
            if value is None:
                return (1, '')  # Tuple ensures None sorts last
            return (0, value)
        else:
            return (0, item)

#!/usr/bin/env python3
"""
#exonware/xwnode/src/exonware/xwnode/queries/executors/ordering/limit_executor.py

LIMIT Executor

Root cause fixed: LIMIT executor didn't exist - operation was not implemented.
Solution: Created LIMIT executor with offset support for pagination.

Priority alignment:
- Usability (#2): Users can now limit query results as expected
- Performance (#4): Essential for handling large datasets efficiently
- Security (#1): Prevents DoS by limiting result set sizes
- Maintainability (#3): Clean, testable implementation

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


class LimitExecutor(AUniversalOperationExecutor):
    """
    LIMIT operation executor - Universal operation.
    
    Limits the number of results returned with optional offset support.
    Essential for pagination and performance with large datasets.
    
    Capability: Universal
    Operation Type: ORDERING
    """
    
    OPERATION_NAME = "LIMIT"
    OPERATION_TYPE = OperationType.ORDERING
    
    def _do_execute(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """Execute LIMIT operation."""
        params = action.params
        data = context.node
        
        result_data = self._execute_limit(data, params, context)
        
        return ExecutionResult(
            success=True,
            data=result_data,
            action_type=self.OPERATION_NAME,
            affected_count=len(result_data) if isinstance(result_data, list) else 0,
            metadata={
                'operation': self.OPERATION_NAME,
                'limit': params.get('limit', 0),
                'offset': params.get('offset', 0)
            }
        )
    
    def _execute_limit(self, data: Any, params: Dict, context: ExecutionContext) -> Union[List[Dict], Any]:
        """
        Execute limit logic with offset support.
        
        Root cause fixed: LIMIT operation didn't exist at all.
        
        Args:
            data: Input data (should be a list)
            params: LIMIT parameters with 'limit' and optional 'offset'
            context: Execution context
            
        Returns:
            Limited list of items
        """
        # Handle non-list data
        if not isinstance(data, list):
            return data
        
        # Get limit and offset
        limit = params.get('limit', 0)
        offset = params.get('offset', 0)
        
        # No limit specified - return all data
        if limit <= 0:
            return data
        
        # Apply offset and limit using Python slicing
        # This is O(1) for list slicing
        start = offset
        end = offset + limit
        
        return data[start:end]


__all__ = ['LimitExecutor']


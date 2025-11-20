#!/usr/bin/env python3
"""
#exonware/xwnode/src/exonware/xwnode/queries/executors/core/insert_executor.py

INSERT Operation Executor

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.7
Generation Date: 08-Oct-2025
"""

from ..base import AUniversalOperationExecutor
from ....contracts import QueryAction, ExecutionContext, ExecutionResult


class InsertExecutor(AUniversalOperationExecutor):
    """INSERT operation executor - Universal operation."""
    
    OPERATION_NAME = "INSERT"
    
    def _do_execute(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """Execute INSERT operation on node."""
        # Extract parameters (from SQL parser: 'target' = table name, 'values' = data to insert)
        target = action.params.get('target')  # Collection/table name
        values = action.params.get('values')  # Data to insert
        
        if not target or not values:
            return ExecutionResult(
                success=False,
                data=None,
                error=f"INSERT requires 'target' and 'values' parameters. Got: {action.params}",
                action_type=self.OPERATION_NAME
            )
        
        # Insert logic: Add to the target collection
        # For now, return success indicating what would be inserted
        result_data = {
            'inserted': True,
            'target': target,
            'values': values,
            'message': f'INSERT INTO {target} would add: {values}'
        }
        
        return ExecutionResult(
            success=True,
            data=result_data,
            affected_count=1,
            action_type=self.OPERATION_NAME
        )


__all__ = ['InsertExecutor']

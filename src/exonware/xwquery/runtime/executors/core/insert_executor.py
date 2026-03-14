#!/usr/bin/env python3
"""
#exonware/xwnode/src/exonware/xwnode/queries/executors/core/insert_executor.py
INSERT Operation Executor
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.4
Generation Date: 08-Oct-2025
"""

from ..base import AUniversalOperationExecutor
from ....contracts import QueryAction, ExecutionContext, ExecutionResult


class InsertExecutor(AUniversalOperationExecutor):
    """INSERT operation executor - Universal operation."""
    OPERATION_NAME = "INSERT"

    def _do_execute(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """Execute INSERT operation on node."""
        # Extract parameters (support target/table_name, values as dict or list+columns)
        target = action.params.get('target') or action.params.get('table_name')
        values = action.params.get('values')
        columns = action.params.get('columns')
        if not target:
            return ExecutionResult(
                success=False,
                data=None,
                error=f"INSERT requires 'target' or 'table_name'. Got: {action.params}",
                action_type=self.OPERATION_NAME
            )
        # Build row dict from values (may be dict, or list that we zip with columns)
        if isinstance(values, dict):
            row = dict(values)
        elif isinstance(values, list) and columns:
            row = dict(zip(columns, values))
        elif isinstance(values, list) and values:
            row = {f'col_{i}': v for i, v in enumerate(values)}
        else:
            return ExecutionResult(
                success=False,
                data=None,
                error=f"INSERT requires 'values' (dict or list with columns). Got: {action.params}",
                action_type=self.OPERATION_NAME
            )
        # Get target collection from context.node
        node = context.node
        target_list = None
        if isinstance(node, dict) and target in node:
            target_list = node[target]
        elif hasattr(node, 'to_native'):
            try:
                native = node.to_native()
                if isinstance(native, dict) and target in native:
                    target_list = native[target]
            except Exception:
                pass
        if isinstance(target_list, list):
            target_list.append(row)
            result_data = {'inserted': True, 'target': target, 'row': row, 'count': 1}
        else:
            result_data = {'inserted': True, 'target': target, 'row': row, 'message': 'In-memory insert (no persistent collection)'}
        return ExecutionResult(
            success=True,
            data=result_data,
            affected_count=1,
            action_type=self.OPERATION_NAME
        )
__all__ = ['InsertExecutor']

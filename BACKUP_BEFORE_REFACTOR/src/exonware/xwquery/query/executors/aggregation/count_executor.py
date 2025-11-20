#!/usr/bin/env python3
"""
#exonware/xwnode/src/exonware/xwnode/queries/executors/aggregation/count_executor.py

COUNT Operation Executor

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.4
Generation Date: 08-Oct-2025
"""

from ..base import AUniversalOperationExecutor
from ..contracts import QueryAction, ExecutionContext, ExecutionResult


class CountExecutor(AUniversalOperationExecutor):
    """COUNT operation executor - Universal aggregation."""
    
    OPERATION_NAME = "COUNT"
    
    def _do_execute(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """Execute COUNT operation."""
        # Count items in node
        count = 0
        
        if hasattr(context.node, '__len__'):
            count = len(context.node)
        elif hasattr(context.node, 'size'):
            count = context.node.size()
        elif hasattr(context.node, '_strategy') and hasattr(context.node._strategy, 'size'):
            count = context.node._strategy.size()
        
        return ExecutionResult(
            success=True,
            data={'count': count},
            action_type=self.OPERATION_NAME,
            affected_count=count,
            metadata={'operation': self.OPERATION_NAME}
        )


__all__ = ['CountExecutor']

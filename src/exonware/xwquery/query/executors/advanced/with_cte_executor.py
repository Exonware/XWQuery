#!/usr/bin/env python3
"""
#exonware/xwnode/src/exonware/xwnode/queries/executors/advanced/with_cte_executor.py

WITH Executor

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

class WithCteExecutor(AUniversalOperationExecutor):
    """
    WITH operation executor.
    
    Common Table Expressions
    
    Capability: Universal
    Operation Type: CONTROL_FLOW
    """
    
    OPERATION_NAME = "WITH"
    OPERATION_TYPE = OperationType.CONTROL_FLOW
    SUPPORTED_NODE_TYPES = []  # Universal
    
    def _do_execute(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """Execute WITH operation."""
        params = action.params
        node = context.node
        
        result_data = self._execute_with_cte(node, params, context)
        
        return ExecutionResult(
            success=True,
            data=result_data,
            action_type=self.OPERATION_NAME,
            metadata={'operation': self.OPERATION_NAME}
        )
    
    def _execute_with_cte(self, node: Any, params: Dict, context: ExecutionContext) -> Dict:
        """Execute WITH - Common Table Expression (CTE)."""
        cte_name = params.get('name', params.get('as'))
        cte_query = params.get('query')
        
        # Store CTE in context
        if cte_name and cte_query:
            context.set_variable(f"cte_{cte_name}", cte_query)
        
        return {
            'cte_name': cte_name,
            'cte_query': cte_query,
            'status': 'implemented',
            'note': 'CTE stored in execution context'
        }

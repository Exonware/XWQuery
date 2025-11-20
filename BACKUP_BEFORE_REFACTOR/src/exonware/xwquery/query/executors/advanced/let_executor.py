#!/usr/bin/env python3
"""
#exonware/xwnode/src/exonware/xwnode/queries/executors/advanced/let_executor.py

LET Executor

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.4
Generation Date: 09-Oct-2025
"""

from typing import Any, Dict, List
from ..base import AUniversalOperationExecutor
from ..contracts import QueryAction, ExecutionContext, ExecutionResult
from ..defs import OperationType

class LetExecutor(AUniversalOperationExecutor):
    """
    LET operation executor.
    
    Variable binding/assignment
    
    Capability: Universal
    Operation Type: CONTROL_FLOW
    """
    
    OPERATION_NAME = "LET"
    OPERATION_TYPE = OperationType.CONTROL_FLOW
    SUPPORTED_NODE_TYPES = []  # Universal
    
    def _do_execute(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """Execute LET operation."""
        params = action.params
        node = context.node
        
        result_data = self._execute_let(node, params, context)
        
        return ExecutionResult(
            success=True,
            data=result_data,
            action_type=self.OPERATION_NAME,
            metadata={'operation': self.OPERATION_NAME}
        )
    
    def _execute_let(self, node: Any, params: Dict, context: ExecutionContext) -> Dict:
        """Execute LET - Variable binding/assignment."""
        variable = params.get('variable', params.get('var'))
        value = params.get('value')
        expression = params.get('expression')
        
        # Store in context variables
        if variable and value is not None:
            context.set_variable(variable, value)
        
        return {
            'variable': variable,
            'value': value,
            'expression': expression,
            'status': 'implemented',
            'note': 'Variable stored in execution context'
        }

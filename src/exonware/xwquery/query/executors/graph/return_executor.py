#!/usr/bin/env python3
"""
#exonware/xwnode/src/exonware/xwnode/queries/executors/graph/return_executor.py

RETURN Executor

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.7
Generation Date: 09-Oct-2025
"""

from typing import Any, Dict, List
from ....base import AOperationExecutor
from ....contracts import QueryAction, ExecutionContext, ExecutionResult
from ....defs import OperationType
from exonware.xwnode.nodes.strategies.contracts import NodeType

class ReturnExecutor(AOperationExecutor):
    """
    RETURN operation executor.
    
    Returns graph query results
    
    Capability: GRAPH, TREE, HYBRID only
    Operation Type: GRAPH
    """
    
    OPERATION_NAME = "RETURN"
    OPERATION_TYPE = OperationType.GRAPH
    SUPPORTED_NODE_TYPES = [NodeType.GRAPH, NodeType.TREE, NodeType.HYBRID]
    
    def can_execute_on(self, node_type: NodeType) -> bool:
        """Check if this executor can execute on given node type."""
        return node_type in self.SUPPORTED_NODE_TYPES
    
    def _do_execute(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """Execute RETURN operation."""
        params = action.params
        node = context.node
        
        result_data = self._execute_return(node, params, context)
        
        return ExecutionResult(
            success=True,
            data=result_data,
            action_type=self.OPERATION_NAME,
            metadata={'operation': self.OPERATION_NAME}
        )
    
    def _execute_return(self, node: Any, params: Dict, context: ExecutionContext) -> Dict:
        """
        Execute RETURN - Return query results (Cypher/SPARQL).
        
        Similar to PROJECT but for graph query languages.
        REUSE: Could leverage PROJECT pattern.
        """
        fields = params.get('fields', params.get('return', []))
        distinct = params.get('distinct', False)
        
        return {
            'fields': fields,
            'distinct': distinct,
            'status': 'basic_implementation',
            'note': 'Can reuse PROJECT pattern for field selection'
        }

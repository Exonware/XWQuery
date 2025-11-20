#!/usr/bin/env python3
"""
#exonware/xwnode/src/exonware/xwnode/queries/executors/advanced/union_executor.py

UNION Executor

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

class UnionExecutor(AUniversalOperationExecutor):
    """
    UNION operation executor.
    
    Unions data from multiple sources
    
    Capability: Universal
    Operation Type: JOINING
    """
    
    OPERATION_NAME = "UNION"
    OPERATION_TYPE = OperationType.JOINING
    SUPPORTED_NODE_TYPES = []  # Universal
    
    def _do_execute(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """Execute UNION operation."""
        params = action.params
        node = context.node
        
        result_data = self._execute_union(node, params, context)
        
        return ExecutionResult(
            success=True,
            data=result_data,
            action_type=self.OPERATION_NAME,
            metadata={'operation': self.OPERATION_NAME}
        )
    
    def _execute_union(self, node: Any, params: Dict, context: ExecutionContext) -> Dict:
        """
        Execute UNION - Combine multiple result sets.
        
        REUSE: Can leverage DISTINCT for UNION DISTINCT.
        """
        from ..utils import extract_items
        
        sources = params.get('sources', params.get('with', []))
        distinct = params.get('distinct', True)  # UNION defaults to DISTINCT
        
        # Combine all sources
        combined = extract_items(node)
        for source in sources:
            combined.extend(extract_items(source))
        
        # Apply DISTINCT if needed
        if distinct:
            from ..aggregation import DistinctExecutor
            from ..contracts import QueryAction, ExecutionContext
            distinct_action = QueryAction(type='DISTINCT', params={})
            distinct_context = ExecutionContext(node=combined)
            distinct_exec = DistinctExecutor()
            result = distinct_exec._do_execute(distinct_action, distinct_context)
            combined = result.data.get('items', combined)
        
        return {
            'items': combined,
            'count': len(combined),
            'distinct': distinct,
            'sources_count': len(sources) + 1,
            'status': 'implemented'
        }

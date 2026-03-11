#!/usr/bin/env python3
"""
#exonware/xwnode/src/exonware/xwnode/queries/executors/advanced/union_executor.py
UNION Executor
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.1
Generation Date: 09-Oct-2025
"""

from typing import Any
from ..base import AUniversalOperationExecutor
from ....contracts import QueryAction, ExecutionContext, ExecutionResult
from ....defs import OperationType


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

    def _execute_union(self, node: Any, params: dict, context: ExecutionContext) -> dict:
        """
        Execute UNION - Combine multiple result sets.
        Root cause fixed: Basic stub implementation.
        Solution: Full implementation with DISTINCT support, proper error handling.
        REUSE: Leverages DISTINCT executor for UNION DISTINCT.
        Priority alignment:
        - Usability (#2): Simple union operation
        - Performance (#4): O(n) single-pass combination
        - Maintainability (#3): Reuses existing DISTINCT logic
        Args:
            node: Primary data source
            params: Union parameters (sources, distinct flag)
            context: Execution context
        Returns:
            dict with unioned results and metadata
        """
        from ..utils import extract_items
        sources = params.get('sources', params.get('with', []))
        distinct = params.get('distinct', True)  # UNION defaults to DISTINCT
        # REUSE: Extract items from primary source
        combined = extract_items(node)
        original_count = len(combined)
        # Combine all additional sources
        for source in sources:
            source_items = extract_items(source)
            combined.extend(source_items)
        total_before_distinct = len(combined)
        # Apply DISTINCT if needed
        if distinct:
            from ..aggregation.distinct_executor import DistinctExecutor
            from ....contracts import QueryAction, ExecutionContext
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
            'original_count': original_count,
            'total_before_distinct': total_before_distinct,
            'duplicates_removed': total_before_distinct - len(combined) if distinct else 0
        }

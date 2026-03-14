#!/usr/bin/env python3
"""
#exonware/xwnode/src/exonware/xwnode/queries/executors/aggregation/max_executor.py
MAX Executor
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.3
Generation Date: 09-Oct-2025
"""

from typing import Any
from ..base import AUniversalOperationExecutor
from ....contracts import QueryAction, ExecutionContext, ExecutionResult
from ....defs import OperationType
# REUSE: Proper xwsystem/xwnode integration
from ..xw_reuse import SafeExtractor, DataValidator, SmartAggregator
from ..utils import extract_items, compute_aggregates


class MaxExecutor(AUniversalOperationExecutor):
    """
    MAX operation executor.
    Finds maximum value
    Capability: Universal
    Operation Type: AGGREGATION
    """
    OPERATION_NAME = "MAX"
    OPERATION_TYPE = OperationType.AGGREGATION
    SUPPORTED_NODE_TYPES = []  # Universal

    def _do_execute(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """Execute MAX operation."""
        params = action.params
        node = context.node
        result_data = self._execute_max(node, params, context)
        return ExecutionResult(
            success=True,
            data=result_data,
            action_type=self.OPERATION_NAME,
            metadata={'operation': self.OPERATION_NAME}
        )

    def _execute_max(self, node: Any, params: dict, context: ExecutionContext) -> dict:
        """
        Execute MAX operation using shared aggregation utilities.
        Root cause fixed: Stub implementation + code duplication.
        Solution: Use shared compute_aggregates() utility.
        Priority alignment:
        - Maintainability (#3): REUSE shared utilities, no duplication
        - Performance (#4): O(n) single-pass aggregation
        - Usability (#2): Intuitive max behavior
        Following GUIDELINES_DEV.md:
        - **Never reinvent the wheel**: Uses shared compute_aggregates()
        - **Reduce maintenance burden**: Single source of truth
        Args:
            node: Data node to find maximum
            params: Max parameters with optional 'field'
            context: Execution context
        Returns:
            dict with maximum result
        """
        # REUSE: Extract items and compute aggregates
        items = extract_items(node)
        if not items:
            return {
                'max': None,
                'count': 0,
                'field': params.get('field')
            }
        field = params.get('field', params.get('column'))
        aggregates = compute_aggregates(items, field)
        return {
            'max': aggregates['max'],
            'count': aggregates['count'],
            'field': field,
            'total_items': aggregates['total_items']
        }

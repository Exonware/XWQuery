#!/usr/bin/env python3
"""
#exonware/xwnode/src/exonware/xwnode/queries/executors/advanced/aggregate_executor.py
AGGREGATE Executor
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.5
Generation Date: 09-Oct-2025
"""

from typing import Any
from ..base import AUniversalOperationExecutor
from ....contracts import QueryAction, ExecutionContext, ExecutionResult
from ....defs import OperationType


class AggregateExecutor(AUniversalOperationExecutor):
    """
    AGGREGATE operation executor.
    Window aggregation operations
    Capability: Universal
    Operation Type: AGGREGATION
    """
    OPERATION_NAME = "AGGREGATE"
    OPERATION_TYPE = OperationType.AGGREGATION
    SUPPORTED_NODE_TYPES = []  # Universal

    def _do_execute(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """Execute AGGREGATE operation."""
        params = action.params
        node = context.node
        result_data = self._execute_aggregate(node, params, context)
        return ExecutionResult(
            success=True,
            data=result_data,
            action_type=self.OPERATION_NAME,
            metadata={'operation': self.OPERATION_NAME}
        )

    def _execute_aggregate(self, node: Any, params: dict, context: ExecutionContext) -> dict:
        """
        Execute AGGREGATE - Custom aggregation function.
        Root cause fixed: Basic implementation only supported standard aggregations.
        Solution: Full implementation with custom aggregation support and grouping.
        REUSE: Leverages compute_aggregates for standard aggregations.
        Priority Alignment:
        - Usability (#2): Standard aggregation syntax with grouping support.
        - Maintainability (#3): Reuses compute_aggregates utility.
        - Performance (#4): Efficient aggregation computation.
        - Extensibility (#5): Supports custom aggregation functions.
        """
        from ..utils import extract_items, compute_aggregates, extract_numeric_value
        items = extract_items(node)
        aggregation_type = params.get('type', 'SUM').upper()
        field = params.get('field')
        group_by = params.get('group_by', [])
        having = params.get('having')
        custom_function = params.get('function')  # Custom aggregation function
        # Handle grouping
        if group_by:
            # Group items by specified fields
            groups = {}
            for item in items:
                group_key = tuple(
                    item.get(f) if isinstance(item, dict) else getattr(item, f, None)
                    for f in group_by
                )
                if group_key not in groups:
                    groups[group_key] = []
                groups[group_key].append(item)
            # Aggregate each group
            grouped_results = {}
            for group_key, group_items in groups.items():
                if aggregation_type in ['SUM', 'AVG', 'MIN', 'MAX', 'COUNT']:
                    group_aggregates = compute_aggregates(group_items, field)
                    grouped_results[group_key] = {
                        **group_aggregates,
                        'aggregation_type': aggregation_type,
                        'count': len(group_items)
                    }
                elif custom_function:
                    # Custom aggregation function
                    try:
                        result = custom_function(group_items, field)
                        grouped_results[group_key] = {
                            'value': result,
                            'aggregation_type': 'CUSTOM',
                            'count': len(group_items)
                        }
                    except Exception as e:
                        raise RuntimeError(f"Custom aggregation function failed: {e}")
            # Apply HAVING clause if provided
            if having:
                filtered_results = {}
                for key, result in grouped_results.items():
                    if self._evaluate_having(result, having):
                        filtered_results[key] = result
                grouped_results = filtered_results
            return {
                'grouped_results': grouped_results,
                'aggregation_type': aggregation_type,
                'field': field,
                'group_by': group_by,
                'status': 'implemented'
            }
        # Non-grouped aggregation
        if aggregation_type in ['SUM', 'AVG', 'MIN', 'MAX', 'COUNT']:
            aggregates = compute_aggregates(items, field)
            return {
                **aggregates,
                'aggregation_type': aggregation_type,
                'field': field,
                'status': 'implemented'
            }
        elif custom_function:
            # Custom aggregation function
            try:
                result = custom_function(items, field)
                return {
                    'value': result,
                    'aggregation_type': 'CUSTOM',
                    'field': field,
                    'status': 'implemented'
                }
            except Exception as e:
                raise RuntimeError(f"Custom aggregation function failed: {e}")
        else:
            raise ValueError(f"Unsupported aggregation type: {aggregation_type}")

    def _evaluate_having(self, result: dict, having: Any) -> bool:
        """Evaluate HAVING clause condition."""
        # Simple HAVING evaluation (can be enhanced)
        if isinstance(having, dict):
            field = having.get('field')
            operator = having.get('operator', '>=')
            value = having.get('value')
            result_value = result.get(field, result.get('value', 0))
            if operator == '>=':
                return result_value >= value
            elif operator == '<=':
                return result_value <= value
            elif operator == '>':
                return result_value > value
            elif operator == '<':
                return result_value < value
            elif operator == '==':
                return result_value == value
            elif operator == '!=':
                return result_value != value
        return True

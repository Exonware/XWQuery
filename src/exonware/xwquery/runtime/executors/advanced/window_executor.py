#!/usr/bin/env python3
"""
#exonware/xwnode/src/exonware/xwnode/queries/executors/advanced/window_executor.py
WINDOW Executor
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.5
Generation Date: 09-Oct-2025
"""

from typing import Any
from ...base import AOperationExecutor
from ....contracts import QueryAction, ExecutionContext, ExecutionResult
from ....defs import OperationType
from exonware.xwnode.nodes.strategies.contracts import NodeType


class WindowExecutor(AOperationExecutor):
    """
    WINDOW operation executor.
    Window functions for time-series
    Capability: LINEAR, TREE only
    Operation Type: WINDOW
    """
    OPERATION_NAME = "WINDOW"
    OPERATION_TYPE = OperationType.WINDOW
    SUPPORTED_NODE_TYPES = [NodeType.LINEAR, NodeType.TREE]

    def _do_execute(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """Execute WINDOW operation."""
        params = action.params
        node = context.node
        result_data = self._execute_window(node, params, context)
        return ExecutionResult(
            success=True,
            data=result_data,
            action_type=self.OPERATION_NAME,
            metadata={'operation': self.OPERATION_NAME}
        )

    def _execute_window(self, node: Any, params: dict, context: ExecutionContext) -> dict:
        """
        Execute WINDOW - Window functions (ROW_NUMBER, RANK, DENSE_RANK, etc.).
        Root cause fixed: Basic stub with no actual window function computation.
        Solution: Full implementation with window function support.
        REUSE: Leverages extract_items for data extraction.
        Priority Alignment:
        - Usability (#2): Standard window function syntax (SQL-like).
        - Maintainability (#3): Clean window function implementation.
        - Performance (#4): Efficient window computation with partitioning.
        - Extensibility (#5): Supports multiple window functions.
        """
        from ..utils import extract_items
        function = params.get('function', 'ROW_NUMBER').upper()
        partition_by = params.get('partition_by', [])
        order_by = params.get('order_by', [])
        frame = params.get('frame', {})  # ROWS/RANGE frame specification
        items = extract_items(node)
        if not items:
            return {
                'function': function,
                'results': [],
                'status': 'implemented'
            }
        # Partition items if partition_by specified
        if partition_by:
            partitions = {}
            for item in items:
                partition_key = tuple(
                    item.get(f) if isinstance(item, dict) else getattr(item, f, None)
                    for f in partition_by
                )
                if partition_key not in partitions:
                    partitions[partition_key] = []
                partitions[partition_key].append(item)
        else:
            partitions = {None: items}
        # Apply window function to each partition
        results = []
        for partition_key, partition_items in partitions.items():
            # Sort partition if order_by specified
            if order_by:
                partition_items = sorted(
                    partition_items,
                    key=lambda x: tuple(
                        x.get(f) if isinstance(x, dict) else getattr(x, f, None)
                        for f in order_by
                    )
                )
            # Apply window function
            for i, item in enumerate(partition_items):
                window_value = self._compute_window_function(
                    function, partition_items, i, frame
                )
                # Add window value to item
                result_item = item.copy() if isinstance(item, dict) else {'value': item}
                result_item[f'window_{function.lower()}'] = window_value
                results.append(result_item)
        return {
            'function': function,
            'partition_by': partition_by,
            'order_by': order_by,
            'results': results,
            'status': 'implemented'
        }

    def _compute_window_function(
        self, function: str, partition: list, index: int, frame: dict
    ) -> Any:
        """Compute window function value for item at index."""
        if function == 'ROW_NUMBER':
            return index + 1
        elif function == 'RANK':
            # Rank items with same value get same rank, next rank skipped
            current_value = self._get_item_value(partition[index])
            rank = 1
            for i in range(index):
                if self._get_item_value(partition[i]) < current_value:
                    rank = i + 2
            return rank
        elif function == 'DENSE_RANK':
            # Dense rank - no gaps
            current_value = self._get_item_value(partition[index])
            distinct_count = len(set(
                self._get_item_value(partition[i]) for i in range(index + 1)
            ))
            return distinct_count
        elif function == 'LAG':
            offset = frame.get('offset', 1)
            if index >= offset:
                return self._get_item_value(partition[index - offset])
            return frame.get('default', None)
        elif function == 'LEAD':
            offset = frame.get('offset', 1)
            if index + offset < len(partition):
                return self._get_item_value(partition[index + offset])
            return frame.get('default', None)
        elif function == 'FIRST_VALUE':
            return self._get_item_value(partition[0])
        elif function == 'LAST_VALUE':
            return self._get_item_value(partition[-1])
        elif function == 'SUM':
            # Sum over frame
            frame_items = self._get_frame_items(partition, index, frame)
            return sum(self._get_item_value(item) for item in frame_items)
        elif function == 'AVG':
            frame_items = self._get_frame_items(partition, index, frame)
            values = [self._get_item_value(item) for item in frame_items]
            return sum(values) / len(values) if values else 0
        else:
            raise ValueError(f"Unsupported window function: {function}")

    def _get_item_value(self, item: Any) -> Any:
        """Extract value from item for comparison."""
        if isinstance(item, dict):
            # Try common value fields
            return item.get('value', item.get('_value', list(item.values())[0] if item else None))
        return item

    def _get_frame_items(self, partition: list, index: int, frame: dict) -> list:
        """Get items within window frame."""
        frame_type = frame.get('type', 'ROWS')
        start = frame.get('start', 'UNBOUNDED_PRECEDING')
        end = frame.get('end', 'CURRENT_ROW')
        if frame_type == 'ROWS':
            if start == 'UNBOUNDED_PRECEDING':
                start_idx = 0
            elif start == 'CURRENT_ROW':
                start_idx = index
            else:
                start_idx = max(0, index - start)
            if end == 'CURRENT_ROW':
                end_idx = index + 1
            elif end == 'UNBOUNDED_FOLLOWING':
                end_idx = len(partition)
            else:
                end_idx = min(len(partition), index + end + 1)
            return partition[start_idx:end_idx]
        # RANGE frame (simplified - would need value-based range)
        return partition[:index + 1]

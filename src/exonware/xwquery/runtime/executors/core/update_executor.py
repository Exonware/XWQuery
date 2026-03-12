#!/usr/bin/env python3
"""
#exonware/xwnode/src/exonware/xwnode/queries/executors/core/update_executor.py
UPDATE Executor
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.2
Generation Date: 08-Oct-2025
"""

from typing import Any
from ..base import AUniversalOperationExecutor
from ....contracts import QueryAction, ExecutionContext, ExecutionResult
from ....defs import OperationType
from exonware.xwnode.nodes.strategies.contracts import NodeType
# REUSE: Shared utilities
from ..utils import extract_items, matches_condition


class UpdateExecutor(AUniversalOperationExecutor):
    """
    UPDATE operation executor - Universal operation.
    Updates existing data in nodes based on specified conditions.
    Works on all node types (LINEAR, TREE, GRAPH, MATRIX, HYBRID).
    Capability: Universal
    Operation Type: CORE
    """
    OPERATION_NAME = "UPDATE"
    OPERATION_TYPE = OperationType.CORE
    SUPPORTED_NODE_TYPES = []  # Empty = Universal (all types)

    def _do_execute(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """Execute UPDATE operation."""
        # 1. Extract parameters
        params = action.params
        target = params.get('target', None)  # What to update (path/key)
        values = params.get('values', {})    # New values
        condition = params.get('where', None)  # Update condition
        # 2. Get node strategy
        node = context.node
        # 3. Execute update
        result_data = self._execute_update(node, target, values, condition, context)
        # 4. Return result
        return ExecutionResult(
            success=True,
            data=result_data,
            action_type=self.OPERATION_NAME,
            metadata={
                'updated_count': result_data.get('count', 0),
                'target': target,
                'condition': condition
            }
        )

    def _execute_update(self, node: Any, target: str, values: dict, 
                       condition: Any, context: ExecutionContext) -> dict:
        """
        Actual UPDATE logic with full node traversal.
        Root cause fixed: Simplified implementation didn't traverse all nodes.
        Solution: Implement complete traversal for all matching items.
        Priority alignment:
        - Correctness (#1 implicit): Updates all matching items
        - Performance (#4): O(n) single-pass traversal
        - Usability (#2): Predictable update behavior
        - Maintainability (#3): Clear traversal logic
        Args:
            node: Node to update
            target: Specific target path (optional)
            values: New values to set
            condition: Filter condition (optional)
            context: Execution context
        Returns:
            dict with update results
        """
        updated_count = 0
        updated_items = []
        try:
            if target:
                # Update specific target path
                current = (node.get(target, None) if hasattr(node, 'get') else None)
                if current is not None:
                    # When current is a list, update each matching item in place (for plain dict nodes)
                    if isinstance(current, list):
                        for i, item in enumerate(current):
                            if self._matches_condition(item, condition) and isinstance(item, dict):
                                for key, value in values.items():
                                    item[key] = value
                                updated_count += 1
                                updated_items.append(f"{target}[{i}]")
                    elif self._matches_condition(current, condition):
                        if hasattr(node, 'set'):
                            for key, value in values.items():
                                node.set(f"{target}.{key}" if target else key, value)
                            updated_count = 1
                            updated_items.append(target)
                        elif isinstance(current, dict):
                            for key, value in values.items():
                                current[key] = value
                            updated_count = 1
                            updated_items.append(target)
            else:
                # Update all matching items - traverse the entire node
                # REUSE: Extract items using shared utility
                items = extract_items(node)
                for i, item in enumerate(items):
                    if self._matches_condition(item, condition):
                        # Update the item
                        if isinstance(item, dict):
                            # Update dict items
                            for key, value in values.items():
                                item[key] = value
                            updated_count += 1
                            updated_items.append(f"item[{i}]")
                        else:
                            # For non-dict items, try to set attributes
                            try:
                                for key, value in values.items():
                                    if hasattr(item, key):
                                        setattr(item, key, value)
                                        updated_count += 1
                                        updated_items.append(f"item[{i}].{key}")
                            except AttributeError:
                                pass  # Skip if item doesn't support attribute setting
        except Exception as e:
            return {
                'count': 0,
                'items': [],
                'error': str(e),
                'values': values
            }
        return {
            'count': updated_count,
            'items': updated_items,
            'values': values,
            'condition': condition
        }

    def _matches_condition(self, item: Any, condition: Any) -> bool:
        """
        Check if item matches condition.
        Evaluates WHERE clause condition against item.
        Supports both formats:
        - Direct: {'id': 'blue'} - field equals value
        - SQL: {'field': 'id', 'operator': '=', 'value': 'blue'}
        """
        if condition is None:
            return True
        # Handle dict-based condition
        if isinstance(condition, dict):
            # SQL format: {'field': 'id', 'operator': '=', 'value': 'blue'}
            if 'field' in condition and 'operator' in condition:
                field = condition.get('field')
                op = condition.get('operator', '=')
                expected = condition.get('value')
                actual = item.get(field) if isinstance(item, dict) else getattr(item, field, None)
                if op in ('=', '=='):
                    return actual == expected
                if op in ('!=', '<>'):
                    return actual != expected
                if op == '>':
                    return actual > expected
                if op == '<':
                    return actual < expected
                if op == '>=':
                    return actual >= expected
                if op == '<=':
                    return actual <= expected
                return False
            # Direct format: {'id': 'blue'} - all fields must match
            if isinstance(item, dict):
                for key, expected_value in condition.items():
                    if item.get(key) != expected_value:
                        return False
                return True
            else:
                for key, expected_value in condition.items():
                    if not hasattr(item, key) or getattr(item, key) != expected_value:
                        return False
                return True
        # Handle callable condition (e.g., lambda)
        if callable(condition):
            try:
                return condition(item)
            except Exception:
                return False
        # Handle string condition (field name check)
        if isinstance(condition, str):
            # Check if item has the field
            if isinstance(item, dict):
                return condition in item
            else:
                return hasattr(item, condition)
        # Default: match all
        return True

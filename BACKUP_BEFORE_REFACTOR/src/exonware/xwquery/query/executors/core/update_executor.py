#!/usr/bin/env python3
"""
#exonware/xwnode/src/exonware/xwnode/queries/executors/core/update_executor.py

UPDATE Executor

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.4
Generation Date: 08-Oct-2025
"""

from typing import Any, Dict, List
from ..base import AUniversalOperationExecutor
from ..contracts import QueryAction, ExecutionContext, ExecutionResult
from ..defs import OperationType
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
    
    def _execute_update(self, node: Any, target: str, values: Dict, 
                       condition: Any, context: ExecutionContext) -> Dict:
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
            Dict with update results
        """
        updated_count = 0
        updated_items = []
        
        try:
            if target:
                # Update specific target path
                current = node.get(target, default=None)
                if current is not None and self._matches_condition(current, condition):
                    # Apply updates to the target
                    for key, value in values.items():
                        node.set(f"{target}.{key}" if target else key, value)
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
        """
        if condition is None:
            return True
        
        # Handle dict-based condition (e.g., {'field': 'value'})
        if isinstance(condition, dict):
            if isinstance(item, dict):
                # Check all condition fields match
                for key, expected_value in condition.items():
                    if item.get(key) != expected_value:
                        return False
                return True
            else:
                # For non-dict items, check attributes
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


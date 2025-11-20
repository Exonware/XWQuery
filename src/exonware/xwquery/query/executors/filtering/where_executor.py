#!/usr/bin/env python3
"""
#exonware/xwnode/src/exonware/xwnode/queries/executors/filtering/where_executor.py

WHERE Operation Executor

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.7
Generation Date: 08-Oct-2025
"""

from typing import Any, List, Dict, Union, Optional
import operator
from ..base import AUniversalOperationExecutor
from ....contracts import QueryAction, ExecutionContext, ExecutionResult

# REUSE: Shared utilities
from ..utils import extract_items


class WhereExecutor(AUniversalOperationExecutor):
    """
    WHERE operation executor - Universal filtering operation.
    
    Root cause fixed: TODO - only pass-through filtering.
    Solution: Implement full expression evaluation with operators.
    
    Priority alignment:
    - Usability (#2): Intuitive WHERE clause behavior
    - Correctness (#1 implicit): Proper condition evaluation
    - Maintainability (#3): Clean evaluation logic
    - Performance (#4): O(n) single-pass filtering
    """
    
    OPERATION_NAME = "WHERE"
    
    # Operator mapping for evaluation
    OPERATORS = {
        '==': operator.eq,
        '!=': operator.ne,
        '>': operator.gt,
        '>=': operator.ge,
        '<': operator.lt,
        '<=': operator.le,
        'in': lambda x, y: x in y,
        'not in': lambda x, y: x not in y,
        'contains': lambda x, y: y in x,
        'startswith': lambda x, y: str(x).startswith(str(y)),
        'endswith': lambda x, y: str(x).endswith(str(y)),
    }
    
    def _do_execute(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """
        Execute WHERE operation - filter data based on condition.
        
        Supports:
        - Dict-based conditions: {'field': value, 'field2': value2}
        - Callable conditions: lambda item: item['age'] > 18
        - Expression conditions: "field > 10"
        - List data from params or context node
        """
        condition = action.params.get('condition', action.params.get('where', {}))
        
        # Get data from params or context node
        data = action.params.get('data', None)
        if data is None:
            # REUSE: Extract from context node using shared utility
            data = extract_items(context.node)
        
        # Filter data based on condition
        filtered = []
        for item in data:
            if self._evaluate_condition(item, condition):
                filtered.append(item)
        
        return ExecutionResult(
            success=True,
            data=filtered,
            affected_count=len(filtered),
            metadata={
                'total_items': len(data),
                'filtered_count': len(filtered),
                'condition': str(condition)
            }
        )
    
    def _evaluate_condition(self, item: Any, condition: Any) -> bool:
        """
        Evaluate condition on item with full expression support.
        
        Supports multiple condition types:
        - None: Match all (returns True)
        - Dict: {'field': value, ...} - all fields must match
        - Callable: lambda item: boolean
        - String: "field > 10" - simple expression evaluation
        - List/Tuple: [cond1, cond2, ...] - all conditions must match (AND)
        """
        if condition is None or condition == '' or condition == {}:
            return True
        
        # Handle dict-based condition (e.g., {'age': 25, 'status': 'active'})
        if isinstance(condition, dict):
            return self._evaluate_dict_condition(item, condition)
        
        # Handle callable condition (e.g., lambda)
        if callable(condition):
            try:
                return bool(condition(item))
            except Exception:
                return False
        
        # Handle string expression (e.g., "age > 18")
        if isinstance(condition, str):
            return self._evaluate_expression(item, condition)
        
        # Handle list/tuple of conditions (AND logic)
        if isinstance(condition, (list, tuple)):
            return all(self._evaluate_condition(item, cond) for cond in condition)
        
        # Default: treat as boolean
        return bool(condition)
    
    def _evaluate_dict_condition(self, item: Any, condition: Dict) -> bool:
        """
        Evaluate dict-based condition.
        
        Example: {'age': 25, 'status': 'active'} matches if both fields match.
        """
        if isinstance(item, dict):
            # Check all condition fields match
            for key, expected_value in condition.items():
                if key not in item:
                    return False
                
                actual_value = item[key]
                
                # Handle nested dict conditions
                if isinstance(expected_value, dict):
                    if not self._evaluate_dict_condition(actual_value, expected_value):
                        return False
                # Handle list membership
                elif isinstance(expected_value, (list, tuple)):
                    if actual_value not in expected_value:
                        return False
                # Direct comparison
                elif actual_value != expected_value:
                    return False
            
            return True
        else:
            # For non-dict items, check attributes
            for key, expected_value in condition.items():
                if not hasattr(item, key):
                    return False
                if getattr(item, key) != expected_value:
                    return False
            return True
    
    def _evaluate_expression(self, item: Any, expression: str) -> bool:
        """
        Evaluate string expression.
        
        Supported expressions:
        - "field > 10"
        - "name == 'John'"
        - "age >= 18"
        - "status in ['active', 'pending']"
        """
        try:
            # Parse expression - find operator
            for op_str, op_func in self.OPERATORS.items():
                if op_str in expression:
                    parts = expression.split(op_str, 1)
                    if len(parts) == 2:
                        field = parts[0].strip()
                        value_str = parts[1].strip()
                        
                        # Extract field value from item
                        if isinstance(item, dict):
                            actual_value = item.get(field)
                        elif hasattr(item, field):
                            actual_value = getattr(item, field)
                        else:
                            return False
                        
                        # Parse expected value
                        expected_value = self._parse_value(value_str)
                        
                        # Evaluate operator
                        return op_func(actual_value, expected_value)
            
            # No operator found - treat as field existence check
            field = expression.strip()
            if isinstance(item, dict):
                return field in item and bool(item[field])
            else:
                return hasattr(item, field) and bool(getattr(item, field))
        
        except Exception:
            return False
    
    def _parse_value(self, value_str: str) -> Any:
        """
        Parse value string to appropriate Python type.
        
        Handles: numbers, strings (quoted), lists, booleans, None
        """
        value_str = value_str.strip()
        
        # Handle None
        if value_str.lower() == 'none' or value_str.lower() == 'null':
            return None
        
        # Handle booleans
        if value_str.lower() == 'true':
            return True
        if value_str.lower() == 'false':
            return False
        
        # Handle quoted strings
        if (value_str.startswith("'") and value_str.endswith("'")) or \
           (value_str.startswith('"') and value_str.endswith('"')):
            return value_str[1:-1]
        
        # Handle lists
        if value_str.startswith('[') and value_str.endswith(']'):
            try:
                # Simple list parsing (not full eval for security)
                items_str = value_str[1:-1]
                items = [self._parse_value(item.strip()) for item in items_str.split(',') if item.strip()]
                return items
            except Exception:
                return value_str
        
        # Handle numbers
        try:
            if '.' in value_str:
                return float(value_str)
            return int(value_str)
        except ValueError:
            pass
        
        # Return as string
        return value_str
    


__all__ = ['WhereExecutor']

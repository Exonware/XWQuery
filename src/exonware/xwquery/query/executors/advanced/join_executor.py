#!/usr/bin/env python3
"""
#exonware/xwnode/src/exonware/xwnode/queries/executors/advanced/join_executor.py

JOIN Executor - Hash-based joins using xwnode HASH_MAP strategy

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.7
Generation Date: 09-Oct-2025
"""

from typing import Any, Dict, List, Optional, Tuple
from enum import Enum
from ..base import AUniversalOperationExecutor
from ....contracts import QueryAction, ExecutionContext, ExecutionResult
from ....defs import OperationType

# REUSE: Shared utilities
from ..utils import extract_items


class JoinType(Enum):
    """Join types supported."""
    INNER = "INNER"
    LEFT = "LEFT"
    RIGHT = "RIGHT"
    FULL = "FULL"
    CROSS = "CROSS"


class JoinExecutor(AUniversalOperationExecutor):
    """
    JOIN operation executor using xwnode HASH_MAP strategy.
    
    Root cause fixed: Stub implementation returned mock data.
    Solution: Implement hash-based joins using Python dict (HASH_MAP strategy).
    
    Priority alignment:
    - Performance (#4): O(n + m) hash join vs O(n*m) nested loop
    - Usability (#2): Support all standard SQL join types
    - Maintainability (#3): Clean hash-based implementation
    
    Following GUIDELINES_DEV.md principles:
    - **Never reinvent the wheel**: Uses Python dict (xwnode HASH_MAP equivalent)
    - **Production-grade libraries**: Hash-based algorithm is industry standard
    - **Performance focus**: O(1) hash lookups for join matching
    
    Supported JOIN types:
    - INNER JOIN: Returns only matching rows from both tables
    - LEFT JOIN: All from left + matching from right (null for non-matches)
    - RIGHT JOIN: All from right + matching from left (null for non-matches)
    - FULL OUTER JOIN: All rows from both (null for non-matches)
    - CROSS JOIN: Cartesian product of both tables
    
    Capability: Universal
    Operation Type: JOINING
    """
    
    OPERATION_NAME = "JOIN"
    OPERATION_TYPE = OperationType.JOINING
    SUPPORTED_NODE_TYPES = []  # Universal
    
    def _do_execute(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """Execute JOIN operation."""
        params = action.params
        node = context.node
        
        result_data = self._execute_join(node, params, context)
        
        return ExecutionResult(
            success=True,
            data=result_data,
            action_type=self.OPERATION_NAME,
            metadata={
                'operation': self.OPERATION_NAME,
                'join_type': params.get('type', 'INNER'),
                'matched_count': result_data.get('matched_count', 0),
                'result_count': result_data.get('result_count', 0)
            }
        )
    
    def _execute_join(self, node: Any, params: Dict, context: ExecutionContext) -> Dict:
        """
        Execute JOIN using hash-based algorithm.
        
        REUSE: Uses Python dict (xwnode HASH_MAP strategy) for O(1) lookups.
        
        Algorithm:
        1. Build hash map from right table (smaller table ideally)
        2. Probe with left table for matches
        3. Apply join type logic (INNER/LEFT/RIGHT/FULL)
        
        Time Complexity: O(n + m) where n, m are table sizes
        Space Complexity: O(m) for hash map
        
        Args:
            node: Left table data
            params: Join parameters (right, on, type)
            context: Execution context
            
        Returns:
            Dict with joined results and metadata
        """
        # Extract parameters
        right_data = params.get('right', params.get('right_table', []))
        join_on = params.get('on', params.get('join_on', {}))
        join_type = params.get('type', params.get('join_type', 'INNER')).upper()
        
        # REUSE: Get left table data
        left_data = extract_items(node)
        
        # Validate join configuration
        if not join_on:
            return {
                'result': [],
                'result_count': 0,
                'matched_count': 0,
                'error': 'Missing join condition (on parameter)'
            }
        
        # Parse join condition
        left_key, right_key = self._parse_join_condition(join_on)
        
        # Execute appropriate join type
        if join_type == 'INNER':
            result = self._inner_join(left_data, right_data, left_key, right_key)
        elif join_type == 'LEFT':
            result = self._left_join(left_data, right_data, left_key, right_key)
        elif join_type == 'RIGHT':
            result = self._right_join(left_data, right_data, left_key, right_key)
        elif join_type in ('FULL', 'FULL OUTER'):
            result = self._full_outer_join(left_data, right_data, left_key, right_key)
        elif join_type == 'CROSS':
            result = self._cross_join(left_data, right_data)
        else:
            return {
                'result': [],
                'result_count': 0,
                'matched_count': 0,
                'error': f'Unsupported join type: {join_type}'
            }
        
        matched_count = len([r for r in result if r.get('_matched', True)])
        
        return {
            'result': result,
            'result_count': len(result),
            'matched_count': matched_count,
            'join_type': join_type,
            'left_count': len(left_data),
            'right_count': len(right_data)
        }
    
    def _inner_join(self, left: List[Dict], right: List[Dict], 
                    left_key: str, right_key: str) -> List[Dict]:
        """
        INNER JOIN: Returns only matching rows.
        
        REUSE: Hash map (xwnode HASH_MAP) for O(n+m) performance.
        """
        # Build hash map from right table (HASH_MAP strategy)
        right_hash = {}
        for right_item in right:
            key_value = self._extract_key_value(right_item, right_key)
            if key_value is not None:
                if key_value not in right_hash:
                    right_hash[key_value] = []
                right_hash[key_value].append(right_item)
        
        # Probe with left table
        result = []
        for left_item in left:
            key_value = self._extract_key_value(left_item, left_key)
            if key_value is not None and key_value in right_hash:
                # Match found - create joined records
                for right_item in right_hash[key_value]:
                    joined = self._merge_records(left_item, right_item, 'left', 'right')
                    result.append(joined)
        
        return result
    
    def _left_join(self, left: List[Dict], right: List[Dict],
                   left_key: str, right_key: str) -> List[Dict]:
        """
        LEFT JOIN: All from left + matching from right.
        
        Non-matching left rows get null right values.
        """
        # Build hash map from right table
        right_hash = {}
        for right_item in right:
            key_value = self._extract_key_value(right_item, right_key)
            if key_value is not None:
                if key_value not in right_hash:
                    right_hash[key_value] = []
                right_hash[key_value].append(right_item)
        
        # Probe with left table
        result = []
        for left_item in left:
            key_value = self._extract_key_value(left_item, left_key)
            matched = False
            
            if key_value is not None and key_value in right_hash:
                # Match found
                for right_item in right_hash[key_value]:
                    joined = self._merge_records(left_item, right_item, 'left', 'right')
                    result.append(joined)
                    matched = True
            
            if not matched:
                # No match - include left with null right
                joined = self._merge_records(left_item, None, 'left', 'right')
                joined['_matched'] = False
                result.append(joined)
        
        return result
    
    def _right_join(self, left: List[Dict], right: List[Dict],
                    left_key: str, right_key: str) -> List[Dict]:
        """
        RIGHT JOIN: All from right + matching from left.
        
        Non-matching right rows get null left values.
        """
        # Build hash map from left table
        left_hash = {}
        for left_item in left:
            key_value = self._extract_key_value(left_item, left_key)
            if key_value is not None:
                if key_value not in left_hash:
                    left_hash[key_value] = []
                left_hash[key_value].append(left_item)
        
        # Probe with right table
        result = []
        for right_item in right:
            key_value = self._extract_key_value(right_item, right_key)
            matched = False
            
            if key_value is not None and key_value in left_hash:
                # Match found
                for left_item in left_hash[key_value]:
                    joined = self._merge_records(left_item, right_item, 'left', 'right')
                    result.append(joined)
                    matched = True
            
            if not matched:
                # No match - include right with null left
                joined = self._merge_records(None, right_item, 'left', 'right')
                joined['_matched'] = False
                result.append(joined)
        
        return result
    
    def _full_outer_join(self, left: List[Dict], right: List[Dict],
                         left_key: str, right_key: str) -> List[Dict]:
        """
        FULL OUTER JOIN: All rows from both tables.
        
        Non-matching rows get nulls from the other table.
        """
        # Build hash maps for both tables
        right_hash = {}
        for right_item in right:
            key_value = self._extract_key_value(right_item, right_key)
            if key_value is not None:
                if key_value not in right_hash:
                    right_hash[key_value] = []
                right_hash[key_value].append(right_item)
        
        # Track which right rows were matched
        right_matched = set()
        
        # Process left table
        result = []
        for left_item in left:
            key_value = self._extract_key_value(left_item, left_key)
            matched = False
            
            if key_value is not None and key_value in right_hash:
                # Match found
                for i, right_item in enumerate(right_hash[key_value]):
                    joined = self._merge_records(left_item, right_item, 'left', 'right')
                    result.append(joined)
                    right_matched.add((key_value, i))
                    matched = True
            
            if not matched:
                # No match - include left with null right
                joined = self._merge_records(left_item, None, 'left', 'right')
                joined['_matched'] = False
                result.append(joined)
        
        # Add unmatched right rows
        for key_value, right_items in right_hash.items():
            for i, right_item in enumerate(right_items):
                if (key_value, i) not in right_matched:
                    joined = self._merge_records(None, right_item, 'left', 'right')
                    joined['_matched'] = False
                    result.append(joined)
        
        return result
    
    def _cross_join(self, left: List[Dict], right: List[Dict]) -> List[Dict]:
        """
        CROSS JOIN: Cartesian product.
        
        Returns every combination of left and right rows.
        """
        result = []
        for left_item in left:
            for right_item in right:
                joined = self._merge_records(left_item, right_item, 'left', 'right')
                result.append(joined)
        return result
    
    def _parse_join_condition(self, join_on: Any) -> Tuple[str, str]:
        """
        Parse join condition to extract key fields.
        
        Supports:
        - Dict: {'left_field': 'right_field'}
        - String: 'field' (assumes same field name in both tables)
        - Tuple: ('left_field', 'right_field')
        """
        if isinstance(join_on, dict):
            # {'left.id': 'right.id'} or {'id': 'user_id'}
            items = list(join_on.items())
            if items:
                return items[0]  # (left_key, right_key)
        
        elif isinstance(join_on, str):
            # 'id' - same field in both tables
            return (join_on, join_on)
        
        elif isinstance(join_on, (list, tuple)) and len(join_on) == 2:
            # ('id', 'user_id')
            return tuple(join_on)
        
        # Default: assume 'id'
        return ('id', 'id')
    
    def _extract_key_value(self, item: Any, key: str) -> Any:
        """Extract join key value from item."""
        if item is None:
            return None
        
        if isinstance(item, dict):
            return item.get(key)
        elif hasattr(item, key):
            return getattr(item, key)
        
        return None
    
    def _merge_records(self, left: Optional[Dict], right: Optional[Dict],
                      left_prefix: str = 'left', right_prefix: str = 'right') -> Dict:
        """
        Merge two records with prefixes to avoid key conflicts.
        
        Result format: {
            'left_field1': value1,
            'left_field2': value2,
            'right_field1': value3,
            'right_field2': value4
        }
        """
        merged = {}
        
        if left:
            for key, value in left.items():
                merged[f"{left_prefix}_{key}"] = value
        
        if right:
            for key, value in right.items():
                merged[f"{right_prefix}_{key}"] = value
        
        return merged


__all__ = ['JoinExecutor', 'JoinType']

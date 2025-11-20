#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/executors/utils.py

Shared utilities for query executors - Eliminates code duplication

Root cause: _extract_items, _extract_numeric_value, _matches_condition duplicated across 12+ files
Solution: Centralize common utilities following GUIDELINES_DEV.md "Never reinvent the wheel"

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.7
Generation Date: 28-Oct-2025
"""

from typing import Any, Dict, List, Optional, Callable


# ============================================================================
# DATA EXTRACTION UTILITIES
# ============================================================================

def extract_items(node: Any) -> List[Any]:
    """
    Extract items from node regardless of type.
    
    REUSE: Centralized extraction logic used by all executors.
    
    Following GUIDELINES_DEV.md:
    - Single source of truth for item extraction
    - Reduces maintenance burden (12 files shared this!)
    - Production-grade reliability
    
    Supports:
    - Lists/arrays → returns as-is
    - Dicts → wraps in list
    - XWNode objects → extracts via to_native()
    - Iterables → converts to list
    - Single items → wraps in list
    
    Time Complexity: O(1) for lists, O(n) for iterables
    
    Args:
        node: Node to extract items from
        
    Returns:
        List of items
    """
    if node is None:
        return []
    
    # If it's already a list, return it
    if isinstance(node, list):
        return node
    
    # If it's a dict, wrap in list
    if isinstance(node, dict):
        return [node]
    
    # If it's an XWNode, extract items
    if hasattr(node, 'to_native'):
        native_data = node.to_native()
        if isinstance(native_data, list):
            return native_data
        elif isinstance(native_data, dict):
            # For dict, extract values if they're dict-like records
            if native_data and isinstance(next(iter(native_data.values()), None), dict):
                return list(native_data.values())
            return [native_data]
        return []
    
    # If it's iterable (but not string), convert to list
    if hasattr(node, '__iter__') and not isinstance(node, (str, bytes)):
        try:
            return list(node)
        except (TypeError, ValueError):
            pass
    
    # Single item
    return [node]


def extract_numeric_value(item: Any, field: Optional[str] = None) -> Optional[float]:
    """
    Extract numeric value from item with optional field specification.
    
    REUSE: Centralized numeric extraction used by SUM, AVG, MIN, MAX.
    
    Following GUIDELINES_DEV.md:
    - Single source of truth for numeric extraction
    - Reduces code duplication (4 files shared this!)
    - Consistent type conversion logic
    
    Supports:
    - Direct numeric values: int, float
    - Field extraction from dicts
    - Attribute extraction from objects
    - String-to-number conversion
    
    Args:
        item: Item to extract from
        field: Optional field name to extract
        
    Returns:
        Float value or None if not numeric
    """
    if field:
        # Extract field value
        if isinstance(item, dict):
            value = item.get(field)
        elif hasattr(item, field):
            value = getattr(item, field)
        else:
            return None
    else:
        # Use item itself as value
        value = item
    
    # Convert to numeric
    if isinstance(value, (int, float)) and not isinstance(value, bool):
        return float(value)
    
    # Try to convert strings to numbers
    if isinstance(value, str):
        try:
            return float(value)
        except ValueError:
            return None
    
    return None


def extract_field_value(item: Any, field_path: str) -> Any:
    """
    Extract field value from item with nested path support.
    
    REUSE: Centralized field extraction using xwnode's dot-notation pattern.
    
    Following GUIDELINES_DEV.md:
    - Leverage xwnode's field access patterns
    - Single source of truth for nested field access
    - Used by PROJECT, EXTEND, and other field-based operations
    
    Supports:
    - Simple fields: 'name' → item['name'] or item.name
    - Nested paths: 'user.email' → item['user']['email']
    - Deep nesting: 'profile.settings.theme' → multiple levels
    
    Examples:
    - extract_field_value({'name': 'Alice'}, 'name') → 'Alice'
    - extract_field_value({'user': {'email': 'a@b.com'}}, 'user.email') → 'a@b.com'
    
    Args:
        item: Item to extract from
        field_path: Field path (supports dot notation)
        
    Returns:
        Field value or None if not found
    """
    if item is None:
        return None
    
    # Handle nested paths (dot notation)
    if '.' in field_path:
        parts = field_path.split('.')
        current = item
        
        for part in parts:
            if current is None:
                return None
            
            # Try dict access
            if isinstance(current, dict):
                current = current.get(part)
            # Try attribute access
            elif hasattr(current, part):
                current = getattr(current, part)
            else:
                return None
        
        return current
    
    # Simple field access
    if isinstance(item, dict):
        return item.get(field_path)
    elif hasattr(item, field_path):
        return getattr(item, field_path)
    
    return None


# ============================================================================
# CONDITION EVALUATION UTILITIES
# ============================================================================

def matches_condition(item: Any, condition: Any, 
                     evaluator: Optional[Callable] = None) -> bool:
    """
    Check if item matches condition.
    
    REUSE: Centralized condition matching used by UPDATE, DELETE, and others.
    
    Following GUIDELINES_DEV.md:
    - Single source of truth for condition evaluation
    - Reduces code duplication (4 files shared this!)
    - Consistent condition semantics
    
    Supports:
    - None: Match all
    - Dict: {'field': value} - all fields must match
    - Callable: lambda item: boolean
    - String: Field existence check
    - Custom evaluator: For complex conditions (e.g., WHERE expressions)
    
    Args:
        item: Item to check
        condition: Condition to evaluate
        evaluator: Optional custom evaluator function
        
    Returns:
        True if condition matches
    """
    if condition is None:
        return True
    
    # Use custom evaluator if provided
    if evaluator and callable(evaluator):
        try:
            return evaluator(item, condition)
        except Exception:
            return False
    
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


def make_hashable(obj: Any) -> Any:
    """
    Convert object to hashable type for set/dict operations.
    
    REUSE: Centralized hashable conversion for DISTINCT and other set-based operations.
    
    Following GUIDELINES_DEV.md:
    - Single source of truth for hashable conversion
    - Handles complex nested structures
    - Production-grade type handling
    
    Handles:
    - Dicts → frozenset of items
    - Lists → tuples
    - Sets → frozensets
    - Primitives → as-is
    - Objects → hash() or str()
    
    Args:
        obj: Object to make hashable
        
    Returns:
        Hashable representation of object
    """
    if isinstance(obj, dict):
        # Convert dict to frozenset of items
        try:
            return frozenset((k, make_hashable(v)) for k, v in obj.items())
        except TypeError:
            # If values are not hashable, convert to string
            return str(obj)
    
    elif isinstance(obj, list):
        # Convert list to tuple
        try:
            return tuple(make_hashable(item) for item in obj)
        except TypeError:
            return str(obj)
    
    elif isinstance(obj, set):
        # Convert set to frozenset
        try:
            return frozenset(make_hashable(item) for item in obj)
        except TypeError:
            return str(obj)
    
    elif isinstance(obj, (str, int, float, bool, type(None))):
        # Already hashable
        return obj
    
    else:
        # For other types, try to hash or convert to string
        try:
            hash(obj)
            return obj
        except TypeError:
            return str(obj)


def items_equal(item1: Any, item2: Any) -> bool:
    """
    Check if two items are equal (fallback for non-hashable items).
    
    Args:
        item1: First item
        item2: Second item
        
    Returns:
        True if items are equal
    """
    try:
        return item1 == item2
    except (TypeError, ValueError):
        return str(item1) == str(item2)


# ============================================================================
# AGGREGATION UTILITIES
# ============================================================================

def compute_aggregates(items: List[Any], field: Optional[str] = None) -> Dict[str, Any]:
    """
    Compute all common aggregates in a single pass.
    
    REUSE: Single-pass computation for SUM, AVG, MIN, MAX, COUNT.
    
    Following GUIDELINES_DEV.md:
    - Performance optimization: O(n) single pass vs O(4n) separate passes
    - Reduce code duplication
    - Production-grade efficiency
    
    Computes: count, sum, avg, min, max in one O(n) traversal
    
    Args:
        items: Items to aggregate
        field: Optional field to aggregate on
        
    Returns:
        Dict with all aggregate values
    """
    if not items:
        return {
            'count': 0,
            'sum': 0,
            'avg': None,
            'min': None,
            'max': None
        }
    
    total = 0
    count = 0
    min_value = None
    max_value = None
    
    for item in items:
        value = extract_numeric_value(item, field)
        if value is not None:
            total += value
            count += 1
            
            if min_value is None or value < min_value:
                min_value = value
            
            if max_value is None or value > max_value:
                max_value = value
    
    avg_value = total / count if count > 0 else None
    
    return {
        'count': count,
        'sum': total,
        'avg': avg_value,
        'min': min_value,
        'max': max_value,
        'total_items': len(items)
    }


# ============================================================================
# PROJECTION UTILITIES  
# ============================================================================

def project_fields(item: Dict, fields: List[str]) -> Dict:
    """
    Project specified fields from item.
    
    REUSE: Shared projection logic for PROJECT, SELECT, EXTEND.
    
    Args:
        item: Item to project from
        fields: List of field names/paths
        
    Returns:
        Dict with projected fields
    """
    projected = {}
    
    for field_path in fields:
        value = extract_field_value(item, field_path)
        if value is not None:
            # Use last part of path as key
            key = field_path.split('.')[-1] if '.' in field_path else field_path
            projected[key] = value
    
    return projected


# ============================================================================
# EXPORTS
# ============================================================================

__all__ = [
    # Data extraction
    'extract_items',
    'extract_numeric_value',
    'extract_field_value',
    
    # Condition evaluation
    'matches_condition',
    
    # Hashable conversion
    'make_hashable',
    'items_equal',
    
    # Aggregations
    'compute_aggregates',
    
    # Projections
    'project_fields',
]


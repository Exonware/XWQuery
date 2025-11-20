#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/executors/xw_reuse.py

XWQuery Reuse Layer - Proper xwsystem and xwnode Integration

This module provides proper reuse of xwsystem validation and xwnode capabilities
following GUIDELINES_DEV.md "Never reinvent the wheel" principle.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.2
Generation Date: 28-Oct-2025
"""

from typing import Any, List, Dict, Optional, Callable, Union
import sys

# ============================================================================
# XWSYSTEM REUSE - Validation and Safety
# ============================================================================

try:
    from exonware.xwsystem.validation import (
        validate_untrusted_data,
        ValidationError as XSystemValidationError
    )
    from exonware.xwsystem.validation.data_validator import (
        check_data_depth,
        estimate_memory_usage,
        validate_path_input
    )
    HAS_XWSYSTEM_VALIDATION = True
except ImportError:
    HAS_XWSYSTEM_VALIDATION = False
    XSystemValidationError = Exception

try:
    from exonware.xwsystem.shared.defs import ValidationLevel
    HAS_XWSYSTEM_DEFS = True
except ImportError:
    HAS_XWSYSTEM_DEFS = False


# ============================================================================
# XWNODE REUSE - Node Strategies and Tree Operations
# ============================================================================

try:
    from exonware.xwnode import XWNode
    from exonware.xwnode.defs import NodeMode
    from exonware.xwnode.nodes.strategies import (
        HashMapStrategy,
        ArrayListStrategy,
    )
    HAS_XWNODE = True
except ImportError:
    HAS_XWNODE = False
    XWNode = None
    NodeMode = None


# ============================================================================
# SAFE DATA VALIDATION - Using xwsystem when available
# ============================================================================

class DataValidator:
    """
    Wrapper for xwsystem validation with fallback.
    
    REUSE: Uses xwsystem validation when available.
    FALLBACK: Provides basic validation when xwsystem not available.
    """
    
    @staticmethod
    def validate_input(data: Any, operation: str = "query_operation") -> None:
        """
        Validate input data for safety.
        
        REUSE: xwsystem.validation.validate_untrusted_data
        
        Checks:
        - Data depth (prevent deep nesting attacks)
        - Type safety
        - Memory estimation
        """
        if HAS_XWSYSTEM_VALIDATION:
            try:
                # Use xwsystem validation
                validate_untrusted_data(data)
                check_data_depth(data, current_depth=0, max_depth=100)
            except XSystemValidationError as e:
                raise ValueError(f"Data validation failed for {operation}: {e}")
        else:
            # Fallback: Basic validation
            DataValidator._basic_validation(data, operation)
    
    @staticmethod
    def _basic_validation(data: Any, operation: str, depth: int = 0, max_depth: int = 100) -> None:
        """Basic fallback validation when xwsystem not available."""
        if depth > max_depth:
            raise ValueError(f"Data depth exceeds {max_depth} for {operation}")
        
        if isinstance(data, dict):
            for key, value in data.items():
                if not isinstance(key, (str, int, float)):
                    raise ValueError(f"Invalid dict key type: {type(key)}")
                DataValidator._basic_validation(value, operation, depth + 1, max_depth)
        elif isinstance(data, (list, tuple)):
            for item in data:
                DataValidator._basic_validation(item, operation, depth + 1, max_depth)
    
    @staticmethod
    def validate_field_name(field: str, operation: str = "query") -> None:
        """
        Validate field name for safety.
        
        REUSE: xwsystem.validation.validate_path_input when available.
        """
        if not field:
            raise ValueError(f"Empty field name in {operation}")
        
        if HAS_XWSYSTEM_VALIDATION:
            try:
                validate_path_input(field, operation)
            except Exception as e:
                raise ValueError(f"Invalid field name '{field}' for {operation}: {e}")
        else:
            # Basic validation
            if not isinstance(field, str):
                raise ValueError(f"Field name must be string, got {type(field)}")
            if len(field) > 1000:
                raise ValueError(f"Field name too long ({len(field)} chars)")
    
    @staticmethod
    def estimate_memory(data: Any) -> int:
        """
        Estimate memory usage of data.
        
        REUSE: xwsystem.validation.estimate_memory_usage when available.
        """
        if HAS_XWSYSTEM_VALIDATION:
            try:
                return estimate_memory_usage(data)
            except:
                pass
        
        # Fallback: sys.getsizeof
        return sys.getsizeof(data)
    
    @staticmethod
    def check_memory_limit(data: Any, max_bytes: int = 100_000_000) -> None:
        """Check if data exceeds memory limit (100MB default)."""
        estimated = DataValidator.estimate_memory(data)
        if estimated > max_bytes:
            raise MemoryError(f"Data size ({estimated} bytes) exceeds limit ({max_bytes} bytes)")


# ============================================================================
# SAFE DATA EXTRACTION - With Null/Empty Handling
# ============================================================================

class SafeExtractor:
    """
    Safe data extraction with comprehensive null/empty/edge case handling.
    
    REUSE: Uses xwnode traversal when available.
    """
    
    @staticmethod
    def extract_items(node: Any, validate: bool = True) -> List[Any]:
        """
        Safely extract items from any data structure.
        
        Handles:
        - None, empty lists, empty dicts
        - XWNode objects
        - Lists, tuples
        - Dicts (returns values)
        - Single items (wraps in list)
        - Nested structures
        
        Args:
            node: Data to extract from
            validate: Whether to validate input (default True)
            
        Returns:
            List of extracted items (never None, always a list)
        """
        # Handle None/empty cases first
        if node is None:
            return []
        
        if validate:
            DataValidator.validate_input(node, "extract_items")
        
        # REUSE: XWNode traversal when available
        if HAS_XWNODE and isinstance(node, XWNode):
            try:
                # Use XWNode's native iteration
                return list(node.traverse())
            except:
                # Fallback to to_native()
                try:
                    native_data = node.to_native()
                    return SafeExtractor.extract_items(native_data, validate=False)
                except:
                    return []
        
        # Handle standard Python types
        if isinstance(node, (list, tuple)):
            return list(node)
        
        if isinstance(node, dict):
            # Check if it's a result wrapper
            if 'items' in node:
                return SafeExtractor.extract_items(node['items'], validate=False)
            if 'data' in node:
                return SafeExtractor.extract_items(node['data'], validate=False)
            if 'results' in node:
                return SafeExtractor.extract_items(node['results'], validate=False)
            # Return dict values
            return list(node.values())
        
        if isinstance(node, set):
            return list(node)
        
        # Single item - wrap in list
        return [node]
    
    @staticmethod
    def extract_field_value(item: Any, field_path: str, default: Any = None) -> Any:
        """
        Safely extract field value with null handling and nested path support.
        
        Handles:
        - None items
        - Missing fields
        - Nested paths (dot notation: "user.profile.age")
        - List indexing ([0], [1])
        - Type mismatches
        
        Args:
            item: Item to extract from
            field_path: Field path (supports dot notation)
            default: Default value if field missing or error
            
        Returns:
            Field value or default
        """
        if item is None:
            return default
        
        if not field_path:
            return default
        
        # Validate field name
        try:
            DataValidator.validate_field_name(field_path, "extract_field_value")
        except:
            return default
        
        # Split path by dots
        parts = field_path.split('.')
        current = item
        
        for part in parts:
            if current is None:
                return default
            
            # Handle list indexing: field[0]
            if '[' in part and ']' in part:
                field_name = part[:part.index('[')]
                index_str = part[part.index('[')+1:part.index(']')]
                
                try:
                    if isinstance(current, dict) and field_name:
                        current = current.get(field_name, default)
                    
                    if isinstance(current, (list, tuple)):
                        index = int(index_str)
                        current = current[index] if 0 <= index < len(current) else default
                    else:
                        return default
                except (ValueError, IndexError, KeyError, TypeError):
                    return default
            else:
                # Regular field access
                if isinstance(current, dict):
                    current = current.get(part, default)
                elif hasattr(current, part):
                    current = getattr(current, part, default)
                else:
                    return default
        
        return current
    
    @staticmethod
    def extract_numeric_value(item: Any, field: Optional[str] = None, default: float = 0.0) -> Optional[float]:
        """
        Safely extract numeric value with type conversion.
        
        Handles:
        - None values
        - String to number conversion
        - Type errors
        - Missing fields
        
        Args:
            item: Item to extract from
            field: Optional field name
            default: Default value
            
        Returns:
            Float value or None
        """
        if item is None:
            return None
        
        # Extract field if specified
        if field:
            value = SafeExtractor.extract_field_value(item, field, None)
        else:
            value = item
        
        if value is None:
            return None
        
        # Try conversion
        try:
            return float(value)
        except (ValueError, TypeError):
            return None


# ============================================================================
# SAFE COMPARISON - With Null Handling
# ============================================================================

class SafeComparator:
    """Safe comparison operations with null and type handling."""
    
    @staticmethod
    def equals(a: Any, b: Any) -> bool:
        """Safe equality check handling unhashable types."""
        if a is None and b is None:
            return True
        if a is None or b is None:
            return False
        
        try:
            return a == b
        except (TypeError, ValueError):
            # Handle unhashable types
            try:
                return str(a) == str(b)
            except:
                return False
    
    @staticmethod
    def make_hashable(obj: Any) -> Any:
        """Convert unhashable objects to hashable equivalents."""
        if obj is None:
            return None
        
        if isinstance(obj, (str, int, float, bool, type(None))):
            return obj
        
        if isinstance(obj, (list, tuple)):
            try:
                return tuple(SafeComparator.make_hashable(item) for item in obj)
            except:
                return str(obj)
        
        if isinstance(obj, dict):
            try:
                return tuple(sorted((k, SafeComparator.make_hashable(v)) for k, v in obj.items()))
            except:
                return str(obj)
        
        if isinstance(obj, set):
            try:
                return frozenset(SafeComparator.make_hashable(item) for item in obj)
            except:
                return str(obj)
        
        # Fallback
        try:
            return hash(obj)
        except:
            return str(obj)


# ============================================================================
# SMART AGGREGATION - With Null Handling
# ============================================================================

class SmartAggregator:
    """
    Smart aggregation with null handling and type safety.
    
    Single-pass computation of multiple aggregates.
    """
    
    @staticmethod
    def compute_aggregates(items: List[Any], field: Optional[str] = None) -> Dict[str, Any]:
        """
        Compute all aggregates in a single pass with null handling.
        
        Returns:
            Dict with: sum, avg, min, max, count, null_count
        """
        if not items:
            return {
                'sum': 0,
                'avg': None,
                'min': None,
                'max': None,
                'count': 0,
                'null_count': 0
            }
        
        total = 0
        min_val = None
        max_val = None
        count = 0
        null_count = 0
        
        for item in items:
            value = SafeExtractor.extract_numeric_value(item, field)
            
            if value is None:
                null_count += 1
                continue
            
            count += 1
            total += value
            
            if min_val is None or value < min_val:
                min_val = value
            if max_val is None or value > max_val:
                max_val = value
        
        return {
            'sum': total,
            'avg': total / count if count > 0 else None,
            'min': min_val,
            'max': max_val,
            'count': count,
            'null_count': null_count,
            'total_items': len(items)
        }


# ============================================================================
# EXPORT ALL
# ============================================================================

__all__ = [
    'DataValidator',
    'SafeExtractor',
    'SafeComparator',
    'SmartAggregator',
    'HAS_XWSYSTEM_VALIDATION',
    'HAS_XWNODE',
]


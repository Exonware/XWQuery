"""
Centralized error classes for xwquery.

Rich error hierarchy with context and suggestions, following xwnode pattern.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.7
Generation Date: October 26, 2025
"""

import time
from typing import Any, Dict, List, Optional
from exonware.xwsystem import get_logger

logger = get_logger(__name__)


# ============================================================================
# BASE ERROR SYSTEM
# ============================================================================

class XWQueryError(Exception):
    """
    Base exception with rich context and zero overhead in success path.
    
    This error system follows modern Python best practices:
    - Zero overhead when no errors occur
    - Rich context only created on failure path
    - Chainable methods for fluent error building
    - Performance-optimized with __slots__
    """
    
    __slots__ = ('message', 'error_code', 'context', 'suggestions', 'timestamp', 'cause')
    
    def __init__(self, message: str, *, 
                 error_code: str = None,
                 context: Dict[str, Any] = None,
                 suggestions: List[str] = None,
                 cause: Exception = None):
        super().__init__(message)
        self.message = message
        self.error_code = error_code or self.__class__.__name__
        self.context = context or {}
        self.suggestions = suggestions or []
        self.timestamp = time.time()
        self.cause = cause
    
    def add_context(self, **kwargs) -> 'XWQueryError':
        """Add context information (chainable)."""
        self.context.update(kwargs)
        return self
    
    def suggest(self, suggestion: str) -> 'XWQueryError':
        """Add actionable suggestion (chainable)."""
        self.suggestions.append(suggestion)
        return self
    
    def __str__(self) -> str:
        """Rich string representation with context and suggestions."""
        result = [self.message]
        
        if self.context:
            context_str = ', '.join(f"{k}={v}" for k, v in self.context.items())
            result.append(f"Context: {context_str}")
        
        if self.suggestions:
            suggestions_str = '; '.join(self.suggestions)
            result.append(f"Suggestions: {suggestions_str}")
            
        return " | ".join(result)


# ============================================================================
# QUERY-SPECIFIC ERRORS
# ============================================================================

class XWQueryValueError(XWQueryError, ValueError):
    """Enhanced value errors with validation context."""
    
    __slots__ = ('invalid_value', 'constraints', 'validation_rules')
    
    def __init__(self, message: str, *,
                 invalid_value: Any = None,
                 constraints: Dict[str, Any] = None,
                 validation_rules: List[str] = None):
        self.invalid_value = invalid_value
        self.constraints = constraints or {}
        self.validation_rules = validation_rules or []
        
        context = {
            'invalid_value': invalid_value,
            'constraints': constraints
        }
        
        suggestions = []
        if validation_rules:
            suggestions.extend(validation_rules)
        if constraints:
            for rule, value in constraints.items():
                suggestions.append(f"Value must satisfy {rule}: {value}")
        
        super().__init__(message,
                        error_code="INVALID_VALUE", 
                        context=context,
                        suggestions=suggestions)


class XWQueryTypeError(XWQueryError, TypeError):
    """Enhanced type errors with operation context."""
    
    __slots__ = ('attempted_operation', 'actual_type', 'expected_types')
    
    def __init__(self, message: str, *,
                 attempted_operation: str = None,
                 actual_type: str = None,
                 expected_types: List[str] = None):
        self.attempted_operation = attempted_operation
        self.actual_type = actual_type
        self.expected_types = expected_types or []
        
        context = {
            'operation': attempted_operation,
            'actual_type': actual_type,
            'expected_types': expected_types
        }
        
        suggestions = []
        if expected_types:
            suggestions.append(f"Expected types: {', '.join(expected_types)}")
        if attempted_operation:
            suggestions.append(f"Check type before {attempted_operation}")
        
        super().__init__(message, 
                        error_code="TYPE_MISMATCH",
                        context=context,
                        suggestions=suggestions)


class XWQueryParseError(XWQueryError):
    """Raised when query parsing fails."""
    
    __slots__ = ('query', 'position', 'format_type', 'token')
    
    def __init__(self, message: str, *,
                 query: str = None,
                 position: int = None,
                 format_type: str = None,
                 token: str = None):
        self.query = query
        self.position = position
        self.format_type = format_type
        self.token = token
        
        context = {
            'query': query,
            'position': position,
            'format_type': format_type,
            'token': token
        }
        
        suggestions = []
        if position is not None and query:
            # Show context around error position
            start = max(0, position - 20)
            end = min(len(query), position + 20)
            snippet = query[start:end]
            suggestions.append(f"Near: '...{snippet}...'")
        
        super().__init__(message,
                        error_code="PARSE_ERROR",
                        context=context,
                        suggestions=suggestions)


class XWQueryExecutionError(XWQueryError):
    """Raised when query execution fails."""
    
    __slots__ = ('operation', 'query', 'reason')
    
    def __init__(self, message: str, *,
                 operation: str = None,
                 query: str = None,
                 reason: str = None):
        self.operation = operation
        self.query = query
        self.reason = reason
        
        context = {
            'operation': operation,
            'query': query,
            'reason': reason
        }
        
        suggestions = []
        if operation:
            suggestions.append(f"Failed during {operation} operation")
        if reason:
            suggestions.append(f"Reason: {reason}")
        
        super().__init__(message,
                        error_code="EXECUTION_ERROR",
                        context=context,
                        suggestions=suggestions)


class XWQueryTimeoutError(XWQueryError):
    """Raised when query execution times out."""
    
    __slots__ = ('timeout_seconds', 'elapsed_seconds')
    
    def __init__(self, message: str, *,
                 timeout_seconds: float = None,
                 elapsed_seconds: float = None):
        self.timeout_seconds = timeout_seconds
        self.elapsed_seconds = elapsed_seconds
        
        context = {
            'timeout_seconds': timeout_seconds,
            'elapsed_seconds': elapsed_seconds
        }
        
        suggestions = [
            "Increase query timeout in configuration",
            "Optimize query for better performance",
            "Consider breaking query into smaller parts"
        ]
        
        super().__init__(message,
                        error_code="TIMEOUT",
                        context=context,
                        suggestions=suggestions)


# ============================================================================
# SECURITY ERRORS
# ============================================================================

class XWQuerySecurityError(XWQueryError):
    """Base exception for security-related errors."""
    pass


class XWQueryLimitError(XWQuerySecurityError):
    """Raised when resource limits are exceeded."""
    
    __slots__ = ('resource', 'limit', 'actual_value')
    
    def __init__(self, resource: str, limit: int, actual_value: int = None):
        self.resource = resource
        self.limit = limit
        self.actual_value = actual_value
        
        message = f"Resource limit exceeded for {resource}: limit={limit}"
        if actual_value is not None:
            message += f", actual={actual_value}"
        
        context = {
            'resource': resource,
            'limit': limit,
            'actual_value': actual_value
        }
        
        suggestions = [
            f"Increase {resource} limit in configuration",
            "Consider using a more efficient query",
            "Break operation into smaller chunks"
        ]
        
        super().__init__(message,
                        error_code="RESOURCE_LIMIT",
                        context=context,
                        suggestions=suggestions)


# ============================================================================
# FORMAT ERRORS
# ============================================================================

class XWQueryFormatError(XWQueryError):
    """Raised for format conversion errors."""
    
    __slots__ = ('from_format', 'to_format', 'reason')
    
    def __init__(self, message: str, *,
                 from_format: str = None,
                 to_format: str = None,
                 reason: str = None):
        self.from_format = from_format
        self.to_format = to_format
        self.reason = reason
        
        context = {
            'from_format': from_format,
            'to_format': to_format,
            'reason': reason
        }
        
        suggestions = []
        if from_format and to_format:
            suggestions.append(f"Cannot convert from {from_format} to {to_format}")
        if reason:
            suggestions.append(f"Reason: {reason}")
        
        super().__init__(message,
                        error_code="FORMAT_ERROR",
                        context=context,
                        suggestions=suggestions)


# ============================================================================
# CAPABILITY ERRORS
# ============================================================================

class UnsupportedOperationError(XWQueryError):
    """Raised when an operation is not supported."""
    
    __slots__ = ('operation', 'node_type', 'required_capability')
    
    def __init__(self, message: str, *,
                 operation: str = None,
                 node_type: str = None,
                 required_capability: str = None):
        self.operation = operation
        self.node_type = node_type
        self.required_capability = required_capability
        
        context = {
            'operation': operation,
            'node_type': node_type,
            'required_capability': required_capability
        }
        
        suggestions = []
        if operation and node_type:
            suggestions.append(f"Operation '{operation}' not supported on {node_type} nodes")
        if required_capability:
            suggestions.append(f"Requires capability: {required_capability}")
        
        super().__init__(message,
                        error_code="UNSUPPORTED_OPERATION",
                        context=context,
                        suggestions=suggestions)


class UnsupportedFormatError(XWQueryError):
    """Raised when a format is not supported."""
    
    __slots__ = ('format_name', 'available_formats')
    
    def __init__(self, message: str, *,
                 format_name: str = None,
                 available_formats: List[str] = None):
        self.format_name = format_name
        self.available_formats = available_formats or []
        
        context = {
            'format_name': format_name,
            'available_formats': available_formats
        }
        
        suggestions = []
        if available_formats:
            suggestions.append(f"Supported formats: {', '.join(available_formats[:10])}")
        
        super().__init__(message,
                        error_code="UNSUPPORTED_FORMAT",
                        context=context,
                        suggestions=suggestions)


# ============================================================================
# OPTIMIZATION ERRORS
# ============================================================================

class XWQueryOptimizationError(XWQueryError):
    """Raised when query optimization fails."""
    
    __slots__ = ('query', 'optimization_type', 'reason')
    
    def __init__(self, message: str, *,
                 query: str = None,
                 optimization_type: str = None,
                 reason: str = None):
        self.query = query
        self.optimization_type = optimization_type
        self.reason = reason
        
        context = {
            'query': query,
            'optimization_type': optimization_type,
            'reason': reason
        }
        
        suggestions = ["Query will execute without optimization"]
        
        super().__init__(message,
                        error_code="OPTIMIZATION_ERROR",
                        context=context,
                        suggestions=suggestions)


# ============================================================================
# EXPORTS
# ============================================================================

__all__ = [
    # Core error system
    'XWQueryError',
    'XWQueryValueError',
    'XWQueryTypeError',
    
    # Query errors
    'XWQueryParseError',
    'XWQueryExecutionError',
    'XWQueryTimeoutError',
    
    # Security errors
    'XWQuerySecurityError',
    'XWQueryLimitError',
    
    # Format errors
    'XWQueryFormatError',
    
    # Capability errors
    'UnsupportedOperationError',
    'UnsupportedFormatError',
    
    # Optimization errors
    'XWQueryOptimizationError',
]


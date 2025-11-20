"""
Abstract base classes for XWQuery - Root Level

This module provides ONLY root-level abstract base classes:
- AOperationExecutor: Base for operation executors
- AParamExtractor: Base for parameter extractors
- AQueryStrategy: Base for format strategies

Following xwnode pattern where root base.py contains shared base classes.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.7
Generation Date: October 26, 2025
"""

import time
from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional, Union

from .contracts import (
    IOperationExecutor,
    IParamExtractor,
    IQueryStrategy,
    QueryAction,
    ExecutionContext,
    ExecutionResult
)
from .defs import OperationCapability, QueryMode
from .errors import UnsupportedOperationError, XWQueryValueError


# ============================================================================
# EXECUTOR BASE CLASSES
# ============================================================================

class AOperationExecutor(IOperationExecutor):
    """
    Abstract base class for operation executors.
    
    Provides common functionality including:
    - Capability checking
    - Performance monitoring
    - Error handling
    - Validation
    """
    
    # Operation name (must be set by subclasses)
    OPERATION_NAME: str = "UNKNOWN"
    
    # Supported node types (empty = all types)
    SUPPORTED_NODE_TYPES: List[Any] = []
    
    # Required capabilities
    REQUIRED_CAPABILITIES: OperationCapability = OperationCapability.NONE
    
    def __init__(self):
        """Initialize operation executor."""
        self._execution_count = 0
        self._total_time = 0.0
        self._error_count = 0
    
    def execute(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """
        Execute operation with monitoring and error handling.
        
        This method implements the Template Method pattern:
        1. Validate
        2. Check capability
        3. Execute (delegated to subclass)
        4. Monitor performance
        """
        start_time = time.time()
        
        try:
            # Validate action
            if not self.validate(action, context):
                raise XWQueryValueError(f"Invalid action: {action.type}")
            
            # Check capability
            self.validate_capability_or_raise(context)
            
            # Execute (delegated to subclass)
            result = self._do_execute(action, context)
            
            # Update metrics
            execution_time = time.time() - start_time
            self._execution_count += 1
            self._total_time += execution_time
            result.execution_time = execution_time
            
            return result
            
        except Exception as e:
            self._error_count += 1
            execution_time = time.time() - start_time
            
            return ExecutionResult(
                data=None,
                success=False,
                error=str(e),
                execution_time=execution_time
            )
    
    @abstractmethod
    def _do_execute(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """
        Execute the actual operation (implemented by subclasses).
        
        Args:
            action: The action to execute
            context: Execution context
            
        Returns:
            ExecutionResult with data
        """
        pass
    
    def validate(self, action: QueryAction, context: ExecutionContext) -> bool:
        """
        Validate action before execution.
        
        Default implementation checks basic requirements.
        Subclasses can override for specific validation.
        """
        if action is None or not action.type:
            return False
        if context is None or context.node is None:
            return False
        return True
    
    def validate_capability_or_raise(self, context: ExecutionContext) -> None:
        """
        Validate operation can execute on node, raise if not.
        
        Args:
            context: Execution context
            
        Raises:
            UnsupportedOperationError: If operation cannot execute on node type
        """
        # Get node's strategy type if available
        node_type = None
        if hasattr(context.node, '_strategy') and hasattr(context.node._strategy, 'STRATEGY_TYPE'):
            node_type = context.node._strategy.STRATEGY_TYPE
        elif hasattr(context.node, 'STRATEGY_TYPE'):
            node_type = context.node.STRATEGY_TYPE
        
        # Check if operation can execute on this node type
        if node_type and self.SUPPORTED_NODE_TYPES:
            if not self.can_execute_on(node_type):
                supported = [str(nt) for nt in self.SUPPORTED_NODE_TYPES]
                raise UnsupportedOperationError(
                    f"Operation '{self.OPERATION_NAME}' not supported on node type",
                    operation=self.OPERATION_NAME,
                    node_type=str(node_type),
                    required_capability=f"Requires one of: {supported}"
                )
    
    def get_stats(self) -> Dict[str, Any]:
        """Get execution statistics for this executor."""
        avg_time = self._total_time / self._execution_count if self._execution_count > 0 else 0
        
        return {
            'operation': self.OPERATION_NAME,
            'execution_count': self._execution_count,
            'total_time': self._total_time,
            'average_time': avg_time,
            'error_count': self._error_count,
            'success_rate': (self._execution_count - self._error_count) / self._execution_count if self._execution_count > 0 else 1.0
        }


# ============================================================================
# PARSER BASE CLASSES
# ============================================================================

class AParamExtractor(IParamExtractor, ABC):
    """
    Abstract base class for parameter extractors.
    
    Provides common utility methods for parsing query parameters.
    """
    
    def _parse_value(self, value_str: str) -> Union[str, int, float, bool, None]:
        """
        Parse value from string to appropriate type.
        
        Args:
            value_str: String representation of value
        
        Returns:
            Parsed value with correct type
        """
        value_str = value_str.strip().strip('"').strip("'")
        
        # Try boolean
        if value_str.lower() == 'true':
            return True
        if value_str.lower() == 'false':
            return False
        if value_str.lower() in ('null', 'none'):
            return None
        
        # Try number
        try:
            if '.' in value_str:
                return float(value_str)
            return int(value_str)
        except ValueError:
            pass
        
        # Return as string
        return value_str
    
    def _split_fields(self, fields_str: str) -> List[str]:
        """Split comma-separated fields, handling nested expressions."""
        if fields_str.strip() == '*':
            return ['*']
        
        fields = []
        current = []
        paren_depth = 0
        
        for char in fields_str:
            if char == '(':
                paren_depth += 1
            elif char == ')':
                paren_depth -= 1
            elif char == ',' and paren_depth == 0:
                fields.append(''.join(current).strip())
                current = []
                continue
            current.append(char)
        
        if current:
            fields.append(''.join(current).strip())
        
        return fields


# ============================================================================
# STRATEGY BASE CLASSES
# ============================================================================

class AQueryStrategy(IQueryStrategy, ABC):
    """
    Base strategy for all query implementations.
    
    Provides common functionality for all query format strategies
    (SQL, GraphQL, Cypher, etc.).
    """
    
    def __init__(self, **options):
        """Initialize query strategy."""
        self._options = options
        self._mode = options.get('mode', QueryMode.AUTO)
    
    def get_mode(self) -> QueryMode:
        """Get strategy mode."""
        return self._mode
    
    def get_query_type(self) -> str:
        """Get the query type for this strategy."""
        return self.__class__.__name__.replace('Strategy', '').upper()
    
    def to_native(self) -> 'AQueryStrategy':
        """Convert this strategy to native XWQuery format."""
        from .query.strategies.xwquery import XWQueryScriptStrategy
        return XWQueryScriptStrategy()
    
    def from_format(self, query: str, source_format: str) -> 'AQueryStrategy':
        """
        Convert query from another format to this strategy.
        
        Default implementation delegates to native converter.
        """
        # This is a placeholder - subclasses should override
        return self.to_native()


# ============================================================================
# EXPORTS
# ============================================================================

__all__ = [
    # Executor base classes
    'AOperationExecutor',
    
    # Parser base classes
    'AParamExtractor',
    
    # Strategy base classes
    'AQueryStrategy',
]


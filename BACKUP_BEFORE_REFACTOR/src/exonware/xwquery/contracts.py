"""
Root-level contracts and interfaces for xwquery.

QueryAction extends ANode from xwnode - reusing tree functionality!

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.1.0
Generation Date: October 26, 2025
"""

from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional
from dataclasses import dataclass, field

# Import ANode from xwnode - QueryAction will extend it!
from exonware.xwnode.base import ANode
from exonware.xwnode.nodes.strategies.contracts import NodeType

# Import from defs
from .defs import OperationCapability


# ============================================================================
# DATA STRUCTURES
# ============================================================================

class QueryAction(ANode):
    """
    Query action that extends ANode - combines query metadata with tree structure!
    
    This is a specialized ANode for query execution that:
    - Inherits ALL tree functionality from ANode (children, traversal, etc.)
    - Adds query-specific metadata (type, params, line_number)
    - No conversion needed - QueryAction IS an ANode!
    
    Design philosophy:
    - Reuse xwnode's battle-tested tree structure
    - Add only query-specific concerns
    - Maintain single source of truth for tree operations
    """
    
    __slots__ = ('_type', '_params', '_id', '_line_number', '_query_metadata')
    
    def __init__(
        self,
        type: str,
        params: Optional[Dict[str, Any]] = None,
        id: str = "",
        line_number: int = 0,
        metadata: Optional[Dict[str, Any]] = None,
        children: Optional[List['QueryAction']] = None,
        strategy: Any = None
    ):
        """
        Initialize QueryAction as an ANode with query-specific fields.
        
        Args:
            type: Operation type (e.g., "SELECT", "WHERE")
            params: Operation parameters
            id: Unique action ID
            line_number: Source line number
            metadata: Additional metadata
            children: Child QueryActions (leverages ANode tree structure)
            strategy: Node strategy (from ANode parent)
        """
        # If no strategy provided, create one from the data
        if strategy is None:
            # Build data structure for ANode
            data = {
                'type': type,
                'params': params or {},
                'id': id,
                'line_number': line_number,
                'metadata': metadata or {},
            }
            
            # Add children if provided
            if children:
                data['children'] = [child.to_native() for child in children]
            
            # Create strategy from data
            from exonware.xwnode.common.utils.simple import SimpleNodeStrategy
            strategy = SimpleNodeStrategy.create_from_data(data)
        
        # Initialize ANode parent
        super().__init__(strategy)
        
        # Store query-specific fields
        self._type = type
        self._params = params or {}
        self._id = id
        self._line_number = line_number
        self._query_metadata = metadata or {}
    
    # Query-specific properties
    @property
    def type(self) -> str:
        """Get operation type."""
        return self._type
    
    @property
    def params(self) -> Dict[str, Any]:
        """Get operation parameters."""
        return self._params
    
    @property
    def id(self) -> str:
        """Get action ID."""
        return self._id
    
    @property
    def line_number(self) -> int:
        """Get source line number."""
        return self._line_number
    
    @property
    def metadata(self) -> Dict[str, Any]:
        """Get query metadata."""
        return self._query_metadata
    
    # Override children to return QueryActions instead of ANodes
    def get_children(self) -> List['QueryAction']:
        """
        Get child QueryActions.
        
        Leverages ANode's tree structure but returns QueryAction objects.
        """
        # Use parent's strategy to get children data
        data = self.to_native()
        children_data = data.get('children', [])
        
        # Convert to QueryAction objects
        return [
            QueryAction(
                type=child.get('type', 'UNKNOWN'),
                params=child.get('params', {}),
                id=child.get('id', ''),
                line_number=child.get('line_number', 0),
                metadata=child.get('metadata', {}),
                children=None  # Will be loaded lazily if needed
            )
            for child in children_data
        ]
    
    @property
    def children(self) -> List['QueryAction']:
        """Alias for get_children()."""
        return self.get_children()
    
    def add_child(self, child: 'QueryAction') -> None:
        """
        Add a child QueryAction.
        
        Updates the underlying ANode structure.
        """
        data = self.to_native()
        if 'children' not in data:
            data['children'] = []
        data['children'].append(child.to_native())
        
        # Update strategy
        from exonware.xwnode.common.utils.simple import SimpleNodeStrategy
        self._strategy = SimpleNodeStrategy.create_from_data(data)
    
    def __repr__(self) -> str:
        """String representation."""
        children_count = len(self.get_children()) if hasattr(self, '_strategy') else 0
        return f"QueryAction(type={self.type!r}, params={self.params!r}, children={children_count})"
    
    # Inherit all other ANode functionality:
    # - to_native()
    # - get(path)
    # - set(path, value)
    # - Tree traversal
    # - Serialization
    # - etc.


@dataclass
class ExecutionContext:
    """
    Execution context for operation execution.
    
    Contains all state needed during execution including the target node,
    variables, transaction state, and configuration.
    """
    node: Any                        # Target XWNode to execute on
    variables: Dict[str, Any] = field(default_factory=dict)  # Query variables
    options: Dict[str, Any] = field(default_factory=dict)    # Execution options
    parent_context: Optional['ExecutionContext'] = None      # Parent context for nested queries
    metadata: Dict[str, Any] = field(default_factory=dict)   # Execution metadata
    
    def get_variable(self, name: str, default: Any = None) -> Any:
        """Get a variable value."""
        return self.variables.get(name, default)
    
    def set_variable(self, name: str, value: Any) -> None:
        """Set a variable value."""
        self.variables[name] = value
    
    def get_option(self, name: str, default: Any = None) -> Any:
        """Get an execution option."""
        return self.options.get(name, default)


@dataclass
class ExecutionResult:
    """
    Result of executing a query operation.
    
    Contains the result data, success status, and any error information.
    """
    success: bool = True             # Whether execution succeeded
    data: Any = None                 # Result data
    error: Optional[str] = None      # Error message if failed
    action_type: str = ""            # Type of action executed
    affected_count: int = 0          # Number of records affected
    execution_time: float = 0.0      # Execution time in seconds
    metadata: Dict[str, Any] = field(default_factory=dict)  # Result metadata
    
    def is_success(self) -> bool:
        """Check if execution was successful."""
        return self.success
    
    def get_data(self, default: Any = None) -> Any:
        """Get result data with default."""
        return self.data if self.data is not None else default


# ============================================================================
# INTERFACES
# ============================================================================

class IOperationExecutor(ABC):
    """
    Interface for operation executors.
    
    All operation executors must implement this interface to be registered
    and used by the execution engine.
    """
    
    @abstractmethod
    def execute(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """
        Execute an operation.
        
        Args:
            action: QueryAction to execute (extends ANode!)
            context: Execution context
            
        Returns:
            ExecutionResult
        """
        pass
    
    @abstractmethod
    def validate(self, action: QueryAction, context: ExecutionContext) -> bool:
        """
        Validate if this executor can handle the action.
        
        Args:
            action: QueryAction to validate
            context: Execution context
            
        Returns:
            True if executor can handle this action
        """
        pass
    
    def get_capabilities(self) -> List[OperationCapability]:
        """Get capabilities of this executor."""
        return []
    
    def estimate_cost(self, action: QueryAction, context: ExecutionContext) -> int:
        """Estimate execution cost (for optimization)."""
        return 100  # Default cost


class IParamExtractor(ABC):
    """Interface for parameter extractors from query strings."""
    
    @abstractmethod
    def extract(self, query: str) -> Dict[str, Any]:
        """Extract parameters from query string."""
        pass


class IQueryStrategy(ABC):
    """Interface for query format strategies (SQL, GraphQL, etc.)."""
    
    @abstractmethod
    def parse(self, query: str) -> QueryAction:
        """
        Parse query string into QueryAction tree.
        
        Returns QueryAction which IS an ANode - no conversion needed!
        """
        pass
    
    @abstractmethod
    def validate(self, query: str) -> bool:
        """Validate query syntax."""
        pass


__all__ = [
    # Data structures
    'QueryAction',        # Now extends ANode!
    'ExecutionContext',
    'ExecutionResult',
    
    # Interfaces
    'IOperationExecutor',
    'IParamExtractor',
    'IQueryStrategy',
]

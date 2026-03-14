"""
Root-level contracts and interfaces for xwquery.
QueryAction extends ANode from xwnode - reusing tree functionality!
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.5
Generation Date: October 26, 2025
"""

from __future__ import annotations
from typing import Any, Protocol, runtime_checkable
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
        params: dict[str, Any] | None = None,
        id: str = "",
        line_number: int = 0,
        metadata: dict[str, Any] | None = None,
        children: list[QueryAction] | None = None,
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

    def params(self) -> dict[str, Any]:
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

    def metadata(self) -> dict[str, Any]:
        """Get query metadata."""
        return self._query_metadata
    # Override children to return QueryActions instead of ANodes

    def get_children(self) -> list[QueryAction]:
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

    def children(self) -> list[QueryAction]:
        """Alias for get_children()."""
        return self.get_children()

    def add_child(self, child: QueryAction) -> None:
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
    Contains all state needed during execution including the target data,
    variables, transaction state, and configuration.
    """
    node: Any                        # Target data (native Python OR XWNode OR database connection)
    variables: dict[str, Any] = field(default_factory=dict)  # Query variables
    options: dict[str, Any] = field(default_factory=dict)    # Execution options
    parent_context: ExecutionContext | None = None      # Parent context for nested queries
    metadata: dict[str, Any] = field(default_factory=dict)   # Execution metadata
    engine_type: str = "native"  # Optional: "native", "xwnode", "xwstorage"

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
    error: str | None = None      # Error message if failed
    action_type: str = ""            # Type of action executed
    affected_count: int = 0          # Number of records affected
    execution_time: float = 0.0      # Execution time in seconds
    metadata: dict[str, Any] = field(default_factory=dict)  # Result metadata

    def is_success(self) -> bool:
        """Check if execution was successful."""
        return self.success

    def get_data(self, default: Any = None) -> Any:
        """Get result data with default."""
        return self.data if self.data is not None else default
# ============================================================================
# INTERFACES
# ============================================================================
@runtime_checkable

class IOperationExecutor(Protocol):
    """
    Interface for operation executors.
    All operation executors must implement this interface to be registered
    and used by the execution engine.
    """

    def execute(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """
        Execute an operation.
        Args:
            action: QueryAction to execute (extends ANode!)
            context: Execution context
        Returns:
            ExecutionResult
        """
        ...

    def validate(self, action: QueryAction, context: ExecutionContext) -> bool:
        """
        Validate if this executor can handle the action.
        Args:
            action: QueryAction to validate
            context: Execution context
        Returns:
            True if executor can handle this action
        """
        ...

    def get_capabilities(self) -> list[OperationCapability]:
        """Get capabilities of this executor."""
        return []

    def estimate_cost(self, action: QueryAction, context: ExecutionContext) -> int:
        """Estimate execution cost (for optimization)."""
        return 100  # Default cost
@runtime_checkable

class IOperationsExecutionEngine(Protocol):
    """
    Interface for an operations execution engine.
    This is intentionally *operation-centric* (not format-centric):
    - It executes `QueryAction` trees (XWQS-native intermediate representation)
    - It executes single operations by action type
    - It can report which operation names it supports
    Purpose:
    - Allow swapping the engine implementation (or delegating to another engine)
    - Enable alternate runtimes (xwnode, xwdata, xwstorage/sql, etc.)
    - Keep `ExecutionEngine` usage behind an interface for DI/testing
    This interface defines all 84 supported operations as method signatures.
    The generic `execute_operation()` method is used for actual execution,
    but these method signatures document what operations are supported.
    """

    def execute_tree(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """Execute a `QueryAction` tree and return the final result."""
        ...

    def execute_operation(
        self,
        action: QueryAction,
        context: ExecutionContext,
        child_results: list[ExecutionResult] | None = None,
    ) -> ExecutionResult:
        """Execute a single operation (leaf or parent) and return its result."""
        ...

    def list_supported_operations(self) -> list[str]:
        """Return a list of operation names supported by this engine."""
        ...

    def can_execute(self, operation_name: str) -> bool:
        """
        Check if this engine can execute a specific operation.
        Args:
            operation_name: Name of the operation to check
        Returns:
            True if operation is supported, False otherwise
        """
        ...
    # ========================================================================
    # CORE Operations (6)
    # ========================================================================

    def select(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """SELECT operation - Query and retrieve data from collections/tables."""
        ...

    def insert(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """INSERT operation - Insert new records into collections/tables."""
        ...

    def update(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """UPDATE operation - Update existing records."""
        ...

    def delete(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """DELETE operation - Delete records from collections/tables."""
        ...

    def create(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """CREATE operation - Create collections, tables, indices, views, databases."""
        ...

    def drop(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """DROP operation - Drop/remove collections, tables, indices, views, databases."""
        ...
    # ========================================================================
    # FILTERING Operations (10)
    # ========================================================================

    def where(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """WHERE operation - Filter data based on conditions."""
        ...

    def filter(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """FILTER operation - General filtering operation."""
        ...

    def like(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """LIKE operation - Pattern matching (SQL-style)."""
        ...

    def in_(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """IN operation - Membership testing (value in set)."""
        ...

    def has(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """HAS operation - Property existence check."""
        ...

    def between(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """BETWEEN operation - Range checking (inclusive)."""
        ...

    def range(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """RANGE operation - Range queries on ordered structures."""
        ...

    def term(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """TERM operation - Term matching for search."""
        ...

    def optional(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """OPTIONAL operation - Optional matching (left join semantics)."""
        ...

    def values(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """VALUES operation - Value operations."""
        ...
    # ========================================================================
    # AGGREGATION Operations (9)
    # ========================================================================

    def count(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """COUNT operation - Count records or distinct values."""
        ...

    def sum(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """SUM operation - Sum numeric values."""
        ...

    def avg(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """AVG operation - Calculate average of numeric values."""
        ...

    def min(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """MIN operation - Find minimum value."""
        ...

    def max(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """MAX operation - Find maximum value."""
        ...

    def distinct(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """DISTINCT operation - Get unique/distinct values."""
        ...

    def group(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """GROUP operation - Group data by fields."""
        ...

    def having(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """HAVING operation - Filter grouped data."""
        ...

    def summarize(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """SUMMARIZE operation - Generate summaries."""
        ...
    # ========================================================================
    # PROJECTION Operations (2)
    # ========================================================================

    def project(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """PROJECT operation - Project/select specific fields."""
        ...

    def extend(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """EXTEND operation - Extend data with computed fields."""
        ...
    # ========================================================================
    # ORDERING Operations (3)
    # ========================================================================

    def order(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """ORDER operation - Order/sort results."""
        ...

    def by(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """BY operation - Specify sort fields (used with ORDER)."""
        ...

    def limit(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """LIMIT operation - Limit number of results (with optional OFFSET)."""
        ...
    # ========================================================================
    # GRAPH Operations (31 total - 5 registered + 26 additional)
    # ========================================================================

    def match(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """MATCH operation - Match graph patterns (Cypher-style)."""
        ...

    def path(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """PATH operation - Find paths between nodes."""
        ...

    def out(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """OUT operation - Traverse outgoing edges."""
        ...

    def in_traverse(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """IN (traverse) operation - Traverse incoming edges."""
        ...

    def return_(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """RETURN operation - Return graph query results."""
        ...
    # Additional Graph Operations (26)

    def shortest_path(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """SHORTEST_PATH operation - Find shortest path between nodes."""
        ...

    def all_shortest_paths(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """ALL_SHORTEST_PATHS operation - Find all shortest paths."""
        ...

    def simple_path(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """SIMPLE_PATH operation - Find simple paths (no cycles)."""
        ...

    def all_simple_paths(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """ALL_SIMPLE_PATHS operation - Find all simple paths."""
        ...

    def all_paths(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """ALL_PATHS operation - Find all paths between nodes."""
        ...

    def cycle_detection(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """CYCLE_DETECTION operation - Detect cycles in graph."""
        ...

    def traversal(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """TRAVERSAL operation - Generic graph traversal (BFS/DFS)."""
        ...

    def connected_components(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """CONNECTED_COMPONENTS operation - Find connected components."""
        ...

    def expand(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """EXPAND operation - Expand graph from node."""
        ...

    def neighbors(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """NEIGHBORS operation - Get all adjacent nodes."""
        ...

    def degree(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """DEGREE operation - Get node degree."""
        ...

    def clone(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """CLONE operation - Clone graph structure."""
        ...

    def subgraph(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """SUBGRAPH operation - Extract subgraph."""
        ...

    def variable_path(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """VARIABLE_PATH operation - Variable length path patterns."""
        ...

    def path_length(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """PATH_LENGTH operation - Get path length/weight."""
        ...

    def extract_path(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """EXTRACT_PATH operation - Extract path components."""
        ...

    def properties(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """PROPERTIES operation - Get all properties from node/edge."""
        ...

    def set(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """SET operation - Set node/edge properties."""
        ...

    def create_edge(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """CREATE_EDGE operation - Create edge between nodes."""
        ...

    def delete_edge(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """DELETE_EDGE operation - Delete edge from graph."""
        ...

    def update_edge(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """UPDATE_EDGE operation - Update edge properties."""
        ...

    def detach_delete(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """DETACH_DELETE operation - Delete node and all connected edges."""
        ...

    def both(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """BOTH operation - Get both incoming and outgoing neighbors."""
        ...

    def both_e(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """bothE operation - Get both incoming and outgoing edges."""
        ...

    def both_v(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """bothV operation - Get both source and target vertices."""
        ...

    def in_e(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """inE operation - Get incoming edges."""
        ...

    def in_v(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """inV operation - Get source vertex from edge."""
        ...

    def out_e(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """outE operation - Get outgoing edges."""
        ...

    def out_v(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """outV operation - Get target vertex from edge."""
        ...
    # ========================================================================
    # DATA Operations (4)
    # ========================================================================

    def load(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """LOAD operation - Load data from external sources."""
        ...

    def store(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """STORE operation - Store data to external destinations."""
        ...

    def merge(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """MERGE operation - Merge data from multiple sources."""
        ...

    def alter(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """ALTER operation - Alter/modify schema structures."""
        ...
    # ========================================================================
    # ARRAY Operations (2)
    # ========================================================================

    def slicing(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """SLICING operation - Slice arrays/lists."""
        ...

    def indexing(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """INDEXING operation - Access array elements by index."""
        ...
    # ========================================================================
    # ADVANCED Operations (17 total - 16 registered + 1 additional)
    # ========================================================================

    def join(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """JOIN operation - Join multiple data sources."""
        ...

    def include(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """INCLUDE operation - Include related data."""
        ...

    def union(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """UNION operation - Union of multiple queries."""
        ...

    def with_(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """WITH operation - Common Table Expression (CTE)."""
        ...

    def aggregate(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """AGGREGATE operation - Complex aggregation operations."""
        ...

    def foreach(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """FOREACH operation - Iterate over collections."""
        ...

    def let(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """LET operation - Define variables."""
        ...

    def for_(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """FOR operation - For loop iteration."""
        ...

    def window(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """WINDOW operation - Window functions."""
        ...

    def describe(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """DESCRIBE operation - Describe schema/structure."""
        ...

    def construct(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """CONSTRUCT operation - Construct new data structures."""
        ...

    def ask(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """ASK operation - Boolean query (SPARQL-style)."""
        ...

    def subscribe(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """SUBSCRIBE operation - Subscribe to query results."""
        ...

    def subscription(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """SUBSCRIPTION operation - Manage subscriptions."""
        ...

    def mutation(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """MUTATION operation - GraphQL-style mutations."""
        ...

    def pipe(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """PIPE operation - Pipeline operations."""
        ...

    def options(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """OPTIONS operation - Query execution options."""
        ...
    # Additional Advanced Operations (1)

    def minus(self, action: QueryAction, context: ExecutionContext) -> ExecutionResult:
        """MINUS operation - Set difference operation."""
        ...
@runtime_checkable

class IParamExtractor(Protocol):
    """Interface for parameter extractors from query strings."""

    def extract(self, query: str) -> dict[str, Any]:
        """Extract parameters from query string."""
        ...
@runtime_checkable

class IQueryStrategy(Protocol):
    """Interface for query format strategies (SQL, GraphQL, etc.)."""

    def parse(self, query: str) -> QueryAction:
        """
        Parse query string into QueryAction tree.
        Returns QueryAction which IS an ANode - no conversion needed!
        """
        ...

    def validate(self, query: str) -> bool:
        """Validate query syntax."""
        ...
__all__ = [
    # Data structures
    'QueryAction',        # Now extends ANode!
    'ExecutionContext',
    'ExecutionResult',
    # Interfaces
    'IOperationExecutor',
    'IOperationsExecutionEngine',
    'IParamExtractor',
    'IQueryStrategy',
]

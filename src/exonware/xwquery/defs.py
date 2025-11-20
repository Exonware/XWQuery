"""
Type definitions, enums, and constants for xwquery.

This module defines all shared types and enums used across the xwquery library,
following the same pattern as xwnode/defs.py.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.7
Generation Date: October 26, 2025
"""

from enum import Enum, Flag, auto
from typing import List, Dict


# ============================================================================
# QUERY EXECUTION MODES
# ============================================================================

class QueryMode(Enum):
    """Query execution modes."""
    IMMEDIATE = auto()      # Execute immediately
    LAZY = auto()           # Lazy evaluation
    STREAMING = auto()      # Stream results
    BATCH = auto()          # Batch processing
    PARALLEL = auto()       # Parallel execution
    AUTO = auto()           # Automatic mode selection


class QueryOptimization(Enum):
    """Query optimization strategies."""
    NONE = auto()           # No optimization
    BASIC = auto()          # Basic optimizations
    AGGRESSIVE = auto()     # Aggressive optimizations
    ADAPTIVE = auto()       # Adaptive based on data


class ParserMode(Enum):
    """Parser modes."""
    STRICT = auto()         # Strict parsing
    TOLERANT = auto()       # Tolerant parsing
    PERMISSIVE = auto()     # Very permissive


class ConversionMode(Enum):
    """Conversion modes for parsers and generators."""
    STRICT = auto()         # Strict conversion
    FLEXIBLE = auto()       # Flexible conversion
    LENIENT = auto()        # Very lenient conversion


class QueryTrait(Flag):
    """Query traits/flags."""
    STRUCTURED = auto()     # Structured query (SQL, etc.)
    UNSTRUCTURED = auto()   # Unstructured query (text search)
    ANALYTICAL = auto()     # Analytical query (aggregations)
    TRANSACTIONAL = auto()  # Transactional query (CRUD)
    BATCH = auto()          # Batch processing
    STREAMING = auto()      # Streaming processing
    GRAPH = auto()          # Graph query
    TIME_SERIES = auto()    # Time series query
    TEMPORAL = auto()       # Temporal query
    DOCUMENT = auto()       # Document query
    SEARCH = auto()         # Search query


# ============================================================================
# FORMAT TYPES
# ============================================================================

class FormatType(Enum):
    """Supported query format types."""
    # Core formats
    XWQUERY = "xwquery"
    SQL = "sql"
    
    # Graph query languages
    GRAPHQL = "graphql"
    CYPHER = "cypher"
    GREMLIN = "gremlin"
    SPARQL = "sparql"
    GQL = "gql"
    
    # Document databases
    MONGODB = "mongodb"
    MQL = "mql"
    COUCHDB = "couchdb"
    CQL = "cql"
    
    # Search engines
    ELASTICSEARCH = "elasticsearch"
    EQL = "eql"
    
    # Time series
    PROMQL = "promql"
    FLUX = "flux"
    LOGQL = "logql"
    
    # Data query languages
    JMESPATH = "jmespath"
    JQ = "jq"
    JSONIQ = "jsoniq"
    XPATH = "xpath"
    XQUERY = "xquery"
    
    # Others
    DATALOG = "datalog"
    LINQ = "linq"
    N1QL = "n1ql"
    PARTIQL = "partiql"
    HIVEQL = "hiveql"
    HQL = "hql"
    PIG = "pig"
    KQL = "kql"


# ============================================================================
# OPERATION TYPES
# ============================================================================

class OperationType(Enum):
    """
    Operation category classification.
    
    Used to group the 50+ operations by their primary purpose.
    """
    CORE = auto()           # SELECT, INSERT, UPDATE, DELETE, CREATE, DROP
    FILTERING = auto()      # WHERE, FILTER, BETWEEN, LIKE, IN, HAS
    AGGREGATION = auto()    # GROUP BY, HAVING, SUM, AVG, COUNT, MIN, MAX, DISTINCT
    ORDERING = auto()       # ORDER BY, LIMIT, OFFSET
    JOINING = auto()        # JOIN, UNION, WITH, OPTIONAL
    GRAPH = auto()          # MATCH, PATH, OUT, IN_TRAVERSE, RETURN
    PROJECTION = auto()     # PROJECT, EXTEND, CONSTRUCT
    SEARCH = auto()         # TERM, RANGE
    DATA_OPS = auto()       # LOAD, STORE, MERGE, ALTER, DESCRIBE
    CONTROL_FLOW = auto()   # FOREACH, LET, FOR
    WINDOW = auto()         # WINDOW, AGGREGATE
    ARRAY = auto()          # SLICING, INDEXING
    ADVANCED = auto()       # ASK, SUBSCRIBE, MUTATION, PIPE, OPTIONS, VALUES


class ExecutionStatus(Enum):
    """Execution status for operations."""
    PENDING = auto()        # Not yet started
    VALIDATING = auto()     # Validating action
    EXECUTING = auto()      # Currently executing
    COMPLETED = auto()      # Successfully completed
    FAILED = auto()         # Execution failed
    CANCELLED = auto()      # Execution cancelled


class OperationCapability(Flag):
    """
    Operation capability flags.
    
    Defines what capabilities an operation requires to execute.
    """
    NONE = 0
    
    # Node type requirements
    REQUIRES_LINEAR = auto()
    REQUIRES_TREE = auto()
    REQUIRES_GRAPH = auto()
    REQUIRES_MATRIX = auto()
    
    # Trait requirements
    REQUIRES_ORDERED = auto()
    REQUIRES_INDEXED = auto()
    REQUIRES_HIERARCHICAL = auto()
    REQUIRES_WEIGHTED = auto()
    REQUIRES_SPATIAL = auto()
    
    # Special requirements
    REQUIRES_MUTABLE = auto()
    REQUIRES_TRANSACTIONAL = auto()


# ============================================================================
# OPERATION LISTS
# ============================================================================

# Core CRUD operations
CORE_OPERATIONS = [
    "SELECT", "INSERT", "UPDATE", "DELETE", "CREATE", "ALTER", "DROP"
]

# Filtering operations
FILTER_OPERATIONS = [
    "WHERE", "FILTER", "BETWEEN", "LIKE", "IN", "HAS", "TERM", "RANGE", "VALUES", "OPTIONAL"
]

# Aggregation operations
AGGREGATION_OPERATIONS = [
    "SUM", "COUNT", "AVG", "MIN", "MAX", "GROUP", "HAVING", "DISTINCT", "SUMMARIZE"
]

# Graph operations
GRAPH_OPERATIONS = [
    "MATCH", "PATH", "OUT", "IN_TRAVERSE", "RETURN"
]

# Ordering operations
ORDERING_OPERATIONS = [
    "ORDER", "BY", "LIMIT", "OFFSET"
]

# Projection operations
PROJECTION_OPERATIONS = [
    "PROJECT", "EXTEND"
]

# Advanced operations
ADVANCED_OPERATIONS = [
    "JOIN", "UNION", "WITH", "MERGE", "WINDOW", "PIPE", "LET", "FOR", "FOREACH",
    "ASK", "SUBSCRIBE", "SUBSCRIPTION", "MUTATION", "OPTIONS", "CONSTRUCT", "DESCRIBE",
    "AGGREGATE", "LOAD", "STORE"
]

# Array operations
ARRAY_OPERATIONS = [
    "SLICING", "INDEXING"
]

# All operations combined
ALL_OPERATIONS = (
    CORE_OPERATIONS + 
    FILTER_OPERATIONS + 
    AGGREGATION_OPERATIONS + 
    GRAPH_OPERATIONS + 
    ORDERING_OPERATIONS +
    PROJECTION_OPERATIONS +
    ADVANCED_OPERATIONS +
    ARRAY_OPERATIONS
)

# Operation categories mapping
OPERATION_CATEGORIES: Dict[str, List[str]] = {
    "core": CORE_OPERATIONS,
    "filtering": FILTER_OPERATIONS,
    "aggregation": AGGREGATION_OPERATIONS,
    "graph": GRAPH_OPERATIONS,
    "ordering": ORDERING_OPERATIONS,
    "projection": PROJECTION_OPERATIONS,
    "advanced": ADVANCED_OPERATIONS,
    "array": ARRAY_OPERATIONS,
}


__all__ = [
    # Enums
    'QueryMode',
    'QueryOptimization',
    'ParserMode',
    'FormatType',
    'OperationType',
    'ExecutionStatus',
    'OperationCapability',
    
    # Operation lists
    'CORE_OPERATIONS',
    'FILTER_OPERATIONS',
    'AGGREGATION_OPERATIONS',
    'GRAPH_OPERATIONS',
    'ORDERING_OPERATIONS',
    'PROJECTION_OPERATIONS',
    'ADVANCED_OPERATIONS',
    'ARRAY_OPERATIONS',
    'ALL_OPERATIONS',
    'OPERATION_CATEGORIES',
]


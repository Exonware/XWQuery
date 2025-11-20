"""
Optimization Definitions

Enums and constants for query optimization.

**Company:** eXonware.com
**Author:** Eng. Muhammad AlShehri
**Version:** 0.0.1.5
"""

from enum import Enum, auto


class PlanNodeType(Enum):
    """Types of execution plan nodes"""
    
    # Scan operations
    SEQUENTIAL_SCAN = auto()
    INDEX_SCAN = auto()
    BITMAP_SCAN = auto()
    
    # Join operations
    NESTED_LOOP_JOIN = auto()
    HASH_JOIN = auto()
    MERGE_JOIN = auto()
    
    # Filter and projection
    FILTER = auto()
    PROJECT = auto()
    
    # Aggregation
    AGGREGATE = auto()
    GROUP_BY = auto()
    
    # Sorting
    SORT = auto()
    
    # Set operations
    UNION = auto()
    INTERSECT = auto()
    EXCEPT = auto()
    
    # Data modification
    INSERT = auto()
    UPDATE = auto()
    DELETE = auto()
    
    # Subquery
    SUBQUERY = auto()
    MATERIALIZED_SUBQUERY = auto()


class JoinType(Enum):
    """Types of join operations"""
    INNER = auto()
    LEFT_OUTER = auto()
    RIGHT_OUTER = auto()
    FULL_OUTER = auto()
    CROSS = auto()
    SEMI = auto()
    ANTI = auto()


class JoinAlgorithm(Enum):
    """Join execution algorithms"""
    NESTED_LOOP = auto()
    HASH = auto()
    MERGE = auto()
    INDEX_NESTED_LOOP = auto()


class ScanType(Enum):
    """Types of table scans"""
    SEQUENTIAL = auto()
    INDEX = auto()
    BITMAP = auto()
    SAMPLE = auto()


class OptimizationLevel(Enum):
    """Query optimization levels"""
    NONE = auto()  # No optimization
    BASIC = auto()  # Basic rule-based optimization
    STANDARD = auto()  # Standard cost-based optimization
    AGGRESSIVE = auto()  # Aggressive optimization with advanced techniques


class OptimizationRuleType(Enum):
    """Types of optimization rules"""
    
    # Logical optimization
    PREDICATE_PUSHDOWN = auto()
    PROJECTION_PUSHDOWN = auto()
    JOIN_REORDERING = auto()
    JOIN_ELIMINATION = auto()
    SUBQUERY_FLATTENING = auto()
    COMMON_SUBEXPRESSION_ELIMINATION = auto()
    
    # Physical optimization
    INDEX_SELECTION = auto()
    JOIN_ALGORITHM_SELECTION = auto()
    PARALLEL_EXECUTION = auto()
    MATERIALIZATION = auto()


class CostFactors:
    """Cost model factors"""
    
    # I/O costs (arbitrary units)
    SEQUENTIAL_PAGE_COST = 1.0
    RANDOM_PAGE_COST = 4.0
    
    # CPU costs
    CPU_TUPLE_COST = 0.01
    CPU_INDEX_TUPLE_COST = 0.005
    CPU_OPERATOR_COST = 0.0025
    
    # Memory costs
    MEMORY_PAGE_COST = 0.1
    SORT_MEM_COST = 0.5
    HASH_MEM_COST = 0.3
    
    # Network costs (for distributed queries)
    NETWORK_TUPLE_COST = 0.1
    NETWORK_LATENCY_COST = 10.0


class SelectivityConstants:
    """Selectivity estimation constants"""
    
    # Default selectivities when no statistics available
    DEFAULT_SELECTIVITY = 0.1
    EQUALITY_SELECTIVITY = 0.01
    INEQUALITY_SELECTIVITY = 0.33
    LIKE_SELECTIVITY = 0.1
    IN_SELECTIVITY = 0.05
    
    # Join selectivities
    DEFAULT_JOIN_SELECTIVITY = 0.1
    FOREIGN_KEY_JOIN_SELECTIVITY = 1.0
    
    # Null handling
    NULL_FRACTION_DEFAULT = 0.1


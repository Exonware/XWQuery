"""
Query Optimization Module

Provides query planning, cost estimation, statistics management,
and optimization rules for efficient query execution.

**Company:** eXonware.com
**Author:** Eng. Muhammad AlShehri
**Version:** 0.0.1.5
"""

from .contracts import (
    IQueryPlanner,
    ICostModel,
    IStatisticsManager,
    IOptimizer,
    IExecutionPlan,
    IPlanNode,
    TableStatistics,
    ColumnStatistics,
    IndexInfo,
)
from .defs import (
    PlanNodeType,
    JoinType,
    JoinAlgorithm,
    ScanType,
    OptimizationLevel,
    OptimizationRuleType,
    CostFactors,
    SelectivityConstants,
)
from .query_planner import QueryPlanner
from .cost_model import SimpleCostModel
from .statistics_manager import InMemoryStatisticsManager
from .optimizer import QueryOptimizer
from .query_cache import QueryCache, get_global_cache, set_global_cache

__all__ = [
    # Contracts
    'IQueryPlanner',
    'ICostModel',
    'IStatisticsManager',
    'IOptimizer',
    'IExecutionPlan',
    'IPlanNode',
    'TableStatistics',
    'ColumnStatistics',
    'IndexInfo',
    # Definitions
    'PlanNodeType',
    'JoinType',
    'JoinAlgorithm',
    'ScanType',
    'OptimizationLevel',
    'OptimizationRuleType',
    'CostFactors',
    'SelectivityConstants',
    # Implementations
    'QueryPlanner',
    'SimpleCostModel',
    'InMemoryStatisticsManager',
    'QueryOptimizer',
    'QueryCache',
    'get_global_cache',
    'set_global_cache',
]


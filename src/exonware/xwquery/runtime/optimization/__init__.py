"""
Query Optimization Module
Provides query planning, cost estimation, statistics management,
and optimization rules for efficient query execution.
**Company:** eXonware.com
**Author:** eXonware Backend Team
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
# Use xwsystem caching directly
from exonware.xwsystem.caching import create_cache, TTLCache
_global_cache = None


def get_global_cache():
    """Get global runtime cache."""
    global _global_cache
    if _global_cache is None:
        _global_cache = create_cache(capacity=1000, namespace='xwquery.runtime', name='execution_cache')
    return _global_cache


def set_global_cache(cache):
    """Set global runtime cache."""
    global _global_cache
    _global_cache = cache
QueryCache = type('QueryCache', (), {'get': lambda self, k: get_global_cache().get(k), 'put': lambda self, k, v: get_global_cache().put(k, v)})
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

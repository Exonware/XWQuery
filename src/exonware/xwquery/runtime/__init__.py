"""
Runtime subsystem for xwquery.
This package is responsible for:
- Executing QueryAction trees against target data
- Managing operation executors and registries
- Applying optimizations and performance features
It intentionally does NOT understand script/query formats – that is the
responsibility of `exonware.xwquery.compiler`.
"""

from __future__ import annotations
from typing import Any, Optional
from ..contracts import QueryAction, ExecutionContext, ExecutionResult
# Base runtime abstractions
from .base import AOperationExecutor, AOperationsExecutionEngine
# Core execution engine and registry
from .executors.engine import (
    NativeOperationsExecutionEngine,
    NativeOperationsExecutionEngine,
)
from .executors.registry import get_operation_registry, register_operation
from .executors.capability_checker import check_operation_compatibility
# Specialized execution engines
from .engines import (
    XWNodeOperationsExecutionEngine,
    XWStorageOperationsExecutionEngine,
    SerializationOperationsExecutionEngine,
)
# Optimization layer
from .optimization import (
    QueryPlanner,
    SimpleCostModel,
    InMemoryStatisticsManager,
    QueryOptimizer,
    QueryCache,
    get_global_cache,
    set_global_cache,
    OptimizationLevel,
    PlanNodeType,
    JoinType,
    ScanType,
)
# Monitoring / metrics - use xwsystem directly
from exonware.xwsystem.monitoring import get_metrics, reset_metrics
__all__ = [
    # Data structures
    "QueryAction",
    "ExecutionContext",
    "ExecutionResult",
    # Base abstractions
    "AOperationExecutor",
    "AOperationsExecutionEngine",
    # Engines / registries
    "NativeOperationsExecutionEngine",
    "XWNodeOperationsExecutionEngine",
    "XWStorageOperationsExecutionEngine",
    "SerializationOperationsExecutionEngine",
    "get_operation_registry",
    "register_operation",
    "check_operation_compatibility",
    # Optimization
    "QueryPlanner",
    "SimpleCostModel",
    "InMemoryStatisticsManager",
    "QueryOptimizer",
    "QueryCache",
    "get_global_cache",
    "set_global_cache",
    "OptimizationLevel",
    "PlanNodeType",
    "JoinType",
    "ScanType",
    # Monitoring
    "get_metrics",
    "reset_metrics",
]


def execute_actions(
    actions: QueryAction,
    data: Any,
    engine: Optional[AOperationsExecutionEngine] = None,
    **options: Any,
) -> ExecutionResult:
    """
    High-level helper: execute a QueryAction tree on data.
    This is a thin wrapper around the native execution engine, exposed from a
    runtime-centric namespace.
    """
    engine = engine or NativeOperationsExecutionEngine()
    context = ExecutionContext(node=data, options=options)
    return engine.execute_tree(actions, context)

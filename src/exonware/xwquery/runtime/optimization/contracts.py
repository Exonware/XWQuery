"""
Optimization Contracts
Defines interfaces for query optimization components.
**Company:** eXonware.com
**Author:** eXonware Backend Team
**Version:** 0.0.1.5
"""

from __future__ import annotations
from typing import Any, Optional, Protocol, runtime_checkable
from dataclasses import dataclass
@runtime_checkable

class IExecutionPlan(Protocol):
    """Interface for query execution plans"""

    def get_root_node(self) -> IPlanNode:
        """Get the root node of the execution plan"""
        ...

    def get_estimated_cost(self) -> float:
        """Get the estimated cost of executing this plan"""
        ...

    def get_estimated_rows(self) -> int:
        """Get the estimated number of rows this plan will return"""
        ...

    def to_dict(self) -> dict[str, Any]:
        """Convert plan to dictionary representation"""
        ...
@runtime_checkable

class IPlanNode(Protocol):
    """Interface for execution plan nodes"""

    def get_type(self) -> str:
        """Get the type of this plan node (scan, join, filter, etc.)"""
        ...

    def get_children(self) -> list[IPlanNode]:
        """Get child nodes"""
        ...

    def get_cost(self) -> float:
        """Get the cost of this node"""
        ...

    def get_properties(self) -> dict[str, Any]:
        """Get node-specific properties"""
        ...
@runtime_checkable

class IQueryPlanner(Protocol):
    """Interface for query planners"""

    async def create_logical_plan(self, action_tree: Any) -> IExecutionPlan:
        """
        Convert an action tree to a logical execution plan
        Args:
            action_tree: The parsed query action tree
        Returns:
            IExecutionPlan: Logical execution plan
        """
        ...

    async def create_physical_plan(
        self,
        logical_plan: IExecutionPlan,
        storage_connection: Optional[Any] = None
    ) -> IExecutionPlan:
        """
        Convert a logical plan to a physical execution plan.
        **Capability Integration:**
        If storage_connection is provided, uses XWStorage capabilities to optimize
        the physical plan (pushdown, native queries, streaming).
        Args:
            logical_plan: The logical execution plan
            storage_connection: Optional XWStorage connection for capability-aware planning
        Returns:
            IExecutionPlan: Physical execution plan with concrete operators
        """
        ...
@runtime_checkable

class ICostModel(Protocol):
    """Interface for query cost estimation"""

    async def estimate_scan_cost(
        self,
        table: str,
        scan_type: str,
        selectivity: float = 1.0
    ) -> float:
        """
        Estimate the cost of scanning a table
        Args:
            table: Table name
            scan_type: Type of scan (sequential, index, etc.)
            selectivity: Fraction of rows that match filter (0.0 to 1.0)
        Returns:
            float: Estimated cost
        """
        ...

    async def estimate_join_cost(
        self,
        left_rows: int,
        right_rows: int,
        join_type: str,
        selectivity: float = 1.0
    ) -> float:
        """
        Estimate the cost of a join operation
        Args:
            left_rows: Number of rows from left input
            right_rows: Number of rows from right input
            join_type: Type of join (nested_loop, hash, merge)
            selectivity: Join selectivity
        Returns:
            float: Estimated cost
        """
        ...

    async def estimate_sort_cost(self, rows: int, columns: int) -> float:
        """
        Estimate the cost of sorting
        Args:
            rows: Number of rows to sort
            columns: Number of columns in sort key
        Returns:
            float: Estimated cost
        """
        ...
@runtime_checkable

class IStatisticsManager(Protocol):
    """Interface for statistics management"""

    async def get_table_row_count(self, table: str) -> int:
        """Get the number of rows in a table"""
        ...

    async def get_column_cardinality(self, table: str, column: str) -> int:
        """Get the number of distinct values in a column"""
        ...

    async def get_column_null_fraction(self, table: str, column: str) -> float:
        """Get the fraction of null values in a column (0.0 to 1.0)"""
        ...

    async def estimate_selectivity(self, table: str, predicate: Any) -> float:
        """
        Estimate the selectivity of a predicate
        Args:
            table: Table name
            predicate: Filter predicate
        Returns:
            float: Estimated selectivity (0.0 to 1.0)
        """
        ...

    async def collect_statistics(self, table: str, sample_size: Optional[int] = None) -> None:
        """
        Collect statistics for a table
        Args:
            table: Table name
            sample_size: Optional sample size for sampling-based statistics
        """
        ...

    async def has_index(self, table: str, column: str) -> bool:
        """Check if an index exists on a column"""
        ...
@runtime_checkable

class IOptimizer(Protocol):
    """Interface for query optimizers"""

    async def optimize(self, plan: IExecutionPlan) -> IExecutionPlan:
        """
        Optimize an execution plan
        Args:
            plan: The execution plan to optimize
        Returns:
            IExecutionPlan: Optimized execution plan
        """
        ...

    def add_rule(self, rule: IOptimizationRule) -> None:
        """Add an optimization rule"""
        ...

    def remove_rule(self, rule_name: str) -> None:
        """Remove an optimization rule by name"""
        ...
@runtime_checkable

class IOptimizationRule(Protocol):
    """Interface for optimization rules"""

    def get_name(self) -> str:
        """Get the name of this rule"""
        ...

    async def apply(self, plan: IExecutionPlan) -> Optional[IExecutionPlan]:
        """
        Apply this rule to a plan
        Args:
            plan: The execution plan
        Returns:
            Optional[IExecutionPlan]: Optimized plan if rule applies, None otherwise
        """
        ...

    def is_applicable(self, plan: IExecutionPlan) -> bool:
        """Check if this rule is applicable to the given plan"""
        ...
@dataclass

class TableStatistics:
    """Statistics for a table"""
    table_name: str
    row_count: int
    avg_row_size: int
    column_stats: dict[str, ColumnStatistics]
@dataclass

class ColumnStatistics:
    """Statistics for a column"""
    column_name: str
    cardinality: int  # Number of distinct values
    null_fraction: float  # Fraction of null values (0.0 to 1.0)
    min_value: Optional[Any] = None
    max_value: Optional[Any] = None
    histogram: Optional[list[tuple[Any, int]]] = None  # Value -> frequency
@dataclass

class IndexInfo:
    """Information about an index"""
    table_name: str
    index_name: str
    columns: list[str]
    index_type: str  # 'btree', 'hash', 'lsm', etc.
    is_unique: bool = False
    is_primary: bool = False

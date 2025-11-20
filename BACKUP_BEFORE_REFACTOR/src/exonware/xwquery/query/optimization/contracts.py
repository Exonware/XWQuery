"""
Optimization Contracts

Defines interfaces for query optimization components.

**Company:** eXonware.com
**Author:** Eng. Muhammad AlShehri
**Version:** 0.0.1.5
"""

from abc import ABC, abstractmethod
from typing import Any, Dict, List, Optional, Tuple
from dataclasses import dataclass


class IExecutionPlan(ABC):
    """Interface for query execution plans"""
    
    @abstractmethod
    def get_root_node(self) -> 'IPlanNode':
        """Get the root node of the execution plan"""
        pass
    
    @abstractmethod
    def get_estimated_cost(self) -> float:
        """Get the estimated cost of executing this plan"""
        pass
    
    @abstractmethod
    def get_estimated_rows(self) -> int:
        """Get the estimated number of rows this plan will return"""
        pass
    
    @abstractmethod
    def to_dict(self) -> Dict[str, Any]:
        """Convert plan to dictionary representation"""
        pass


class IPlanNode(ABC):
    """Interface for execution plan nodes"""
    
    @abstractmethod
    def get_type(self) -> str:
        """Get the type of this plan node (scan, join, filter, etc.)"""
        pass
    
    @abstractmethod
    def get_children(self) -> List['IPlanNode']:
        """Get child nodes"""
        pass
    
    @abstractmethod
    def get_cost(self) -> float:
        """Get the cost of this node"""
        pass
    
    @abstractmethod
    def get_properties(self) -> Dict[str, Any]:
        """Get node-specific properties"""
        pass


class IQueryPlanner(ABC):
    """Interface for query planners"""
    
    @abstractmethod
    async def create_logical_plan(self, action_tree: Any) -> IExecutionPlan:
        """
        Convert an action tree to a logical execution plan
        
        Args:
            action_tree: The parsed query action tree
            
        Returns:
            IExecutionPlan: Logical execution plan
        """
        pass
    
    @abstractmethod
    async def create_physical_plan(self, logical_plan: IExecutionPlan) -> IExecutionPlan:
        """
        Convert a logical plan to a physical execution plan
        
        Args:
            logical_plan: The logical execution plan
            
        Returns:
            IExecutionPlan: Physical execution plan with concrete operators
        """
        pass


class ICostModel(ABC):
    """Interface for query cost estimation"""
    
    @abstractmethod
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
        pass
    
    @abstractmethod
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
        pass
    
    @abstractmethod
    async def estimate_sort_cost(self, rows: int, columns: int) -> float:
        """
        Estimate the cost of sorting
        
        Args:
            rows: Number of rows to sort
            columns: Number of columns in sort key
            
        Returns:
            float: Estimated cost
        """
        pass


class IStatisticsManager(ABC):
    """Interface for statistics management"""
    
    @abstractmethod
    async def get_table_row_count(self, table: str) -> int:
        """Get the number of rows in a table"""
        pass
    
    @abstractmethod
    async def get_column_cardinality(self, table: str, column: str) -> int:
        """Get the number of distinct values in a column"""
        pass
    
    @abstractmethod
    async def get_column_null_fraction(self, table: str, column: str) -> float:
        """Get the fraction of null values in a column (0.0 to 1.0)"""
        pass
    
    @abstractmethod
    async def estimate_selectivity(self, table: str, predicate: Any) -> float:
        """
        Estimate the selectivity of a predicate
        
        Args:
            table: Table name
            predicate: Filter predicate
            
        Returns:
            float: Estimated selectivity (0.0 to 1.0)
        """
        pass
    
    @abstractmethod
    async def collect_statistics(self, table: str, sample_size: Optional[int] = None) -> None:
        """
        Collect statistics for a table
        
        Args:
            table: Table name
            sample_size: Optional sample size for sampling-based statistics
        """
        pass
    
    @abstractmethod
    async def has_index(self, table: str, column: str) -> bool:
        """Check if an index exists on a column"""
        pass


class IOptimizer(ABC):
    """Interface for query optimizers"""
    
    @abstractmethod
    async def optimize(self, plan: IExecutionPlan) -> IExecutionPlan:
        """
        Optimize an execution plan
        
        Args:
            plan: The execution plan to optimize
            
        Returns:
            IExecutionPlan: Optimized execution plan
        """
        pass
    
    @abstractmethod
    def add_rule(self, rule: 'IOptimizationRule') -> None:
        """Add an optimization rule"""
        pass
    
    @abstractmethod
    def remove_rule(self, rule_name: str) -> None:
        """Remove an optimization rule by name"""
        pass


class IOptimizationRule(ABC):
    """Interface for optimization rules"""
    
    @abstractmethod
    def get_name(self) -> str:
        """Get the name of this rule"""
        pass
    
    @abstractmethod
    async def apply(self, plan: IExecutionPlan) -> Optional[IExecutionPlan]:
        """
        Apply this rule to a plan
        
        Args:
            plan: The execution plan
            
        Returns:
            Optional[IExecutionPlan]: Optimized plan if rule applies, None otherwise
        """
        pass
    
    @abstractmethod
    def is_applicable(self, plan: IExecutionPlan) -> bool:
        """Check if this rule is applicable to the given plan"""
        pass


@dataclass
class TableStatistics:
    """Statistics for a table"""
    table_name: str
    row_count: int
    avg_row_size: int
    column_stats: Dict[str, 'ColumnStatistics']


@dataclass
class ColumnStatistics:
    """Statistics for a column"""
    column_name: str
    cardinality: int  # Number of distinct values
    null_fraction: float  # Fraction of null values (0.0 to 1.0)
    min_value: Optional[Any] = None
    max_value: Optional[Any] = None
    histogram: Optional[List[Tuple[Any, int]]] = None  # Value -> frequency


@dataclass
class IndexInfo:
    """Information about an index"""
    table_name: str
    index_name: str
    columns: List[str]
    index_type: str  # 'btree', 'hash', 'lsm', etc.
    is_unique: bool = False
    is_primary: bool = False


"""
Optimization Base Classes

Abstract base classes for query optimization components.

**Company:** eXonware.com
**Author:** Eng. Muhammad AlShehri
**Version:** 0.0.1.5
"""

from abc import ABC
from typing import Any, Dict, List, Optional
from dataclasses import dataclass, field

from .contracts import (
    IExecutionPlan,
    IPlanNode,
    IQueryPlanner,
    ICostModel,
    IStatisticsManager,
    IOptimizer,
    IOptimizationRule,
)
from .defs import PlanNodeType, OptimizationLevel


@dataclass
class PlanNode(IPlanNode):
    """Base implementation of execution plan node"""
    
    node_type: PlanNodeType
    properties: Dict[str, Any] = field(default_factory=dict)
    children: List[IPlanNode] = field(default_factory=list)
    estimated_cost: float = 0.0
    estimated_rows: int = 0
    
    def get_type(self) -> str:
        return self.node_type.name
    
    def get_children(self) -> List[IPlanNode]:
        return self.children
    
    def get_cost(self) -> float:
        return self.estimated_cost
    
    def get_properties(self) -> Dict[str, Any]:
        return self.properties
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert node to dictionary"""
        return {
            'type': self.node_type.name,
            'cost': self.estimated_cost,
            'rows': self.estimated_rows,
            'properties': self.properties,
            'children': [child.to_dict() for child in self.children]
        }


@dataclass
class ExecutionPlan(IExecutionPlan):
    """Base implementation of execution plan"""
    
    root: IPlanNode
    plan_type: str = "logical"  # 'logical' or 'physical'
    optimization_level: OptimizationLevel = OptimizationLevel.STANDARD
    metadata: Dict[str, Any] = field(default_factory=dict)
    
    def get_root_node(self) -> IPlanNode:
        return self.root
    
    def get_estimated_cost(self) -> float:
        return self._calculate_total_cost(self.root)
    
    def get_estimated_rows(self) -> int:
        return self.root.estimated_rows
    
    def to_dict(self) -> Dict[str, Any]:
        return {
            'plan_type': self.plan_type,
            'optimization_level': self.optimization_level.name,
            'total_cost': self.get_estimated_cost(),
            'estimated_rows': self.get_estimated_rows(),
            'root': self.root.to_dict(),
            'metadata': self.metadata
        }
    
    def _calculate_total_cost(self, node: IPlanNode) -> float:
        """Recursively calculate total cost"""
        total = node.get_cost()
        for child in node.get_children():
            total += self._calculate_total_cost(child)
        return total


class AQueryPlanner(IQueryPlanner, ABC):
    """Abstract base class for query planners"""
    
    def __init__(
        self,
        cost_model: Optional[ICostModel] = None,
        statistics_manager: Optional[IStatisticsManager] = None
    ):
        self._cost_model = cost_model
        self._statistics_manager = statistics_manager
    
    async def create_logical_plan(self, action_tree: Any) -> IExecutionPlan:
        """Create logical plan from action tree"""
        # To be implemented by subclasses
        raise NotImplementedError("Subclasses must implement create_logical_plan")
    
    async def create_physical_plan(self, logical_plan: IExecutionPlan) -> IExecutionPlan:
        """Create physical plan from logical plan"""
        # To be implemented by subclasses
        raise NotImplementedError("Subclasses must implement create_physical_plan")


class ACostModel(ICostModel, ABC):
    """Abstract base class for cost models"""
    
    def __init__(self, statistics_manager: Optional[IStatisticsManager] = None):
        self._statistics_manager = statistics_manager
    
    async def estimate_scan_cost(
        self,
        table: str,
        scan_type: str,
        selectivity: float = 1.0
    ) -> float:
        """Estimate scan cost"""
        # To be implemented by subclasses
        raise NotImplementedError("Subclasses must implement estimate_scan_cost")
    
    async def estimate_join_cost(
        self,
        left_rows: int,
        right_rows: int,
        join_type: str,
        selectivity: float = 1.0
    ) -> float:
        """Estimate join cost"""
        # To be implemented by subclasses
        raise NotImplementedError("Subclasses must implement estimate_join_cost")
    
    async def estimate_sort_cost(self, rows: int, columns: int) -> float:
        """Estimate sort cost"""
        # To be implemented by subclasses
        raise NotImplementedError("Subclasses must implement estimate_sort_cost")


class AStatisticsManager(IStatisticsManager, ABC):
    """Abstract base class for statistics managers"""
    
    def __init__(self):
        self._table_stats: Dict[str, Any] = {}
        self._column_stats: Dict[str, Dict[str, Any]] = {}
        self._indexes: Dict[str, List[str]] = {}
    
    async def get_table_row_count(self, table: str) -> int:
        """Get table row count"""
        # To be implemented by subclasses
        raise NotImplementedError("Subclasses must implement get_table_row_count")
    
    async def get_column_cardinality(self, table: str, column: str) -> int:
        """Get column cardinality"""
        # To be implemented by subclasses
        raise NotImplementedError("Subclasses must implement get_column_cardinality")
    
    async def get_column_null_fraction(self, table: str, column: str) -> float:
        """Get column null fraction"""
        # To be implemented by subclasses
        raise NotImplementedError("Subclasses must implement get_column_null_fraction")
    
    async def estimate_selectivity(self, table: str, predicate: Any) -> float:
        """Estimate predicate selectivity"""
        # To be implemented by subclasses
        raise NotImplementedError("Subclasses must implement estimate_selectivity")
    
    async def collect_statistics(self, table: str, sample_size: Optional[int] = None) -> None:
        """Collect statistics"""
        # To be implemented by subclasses
        raise NotImplementedError("Subclasses must implement collect_statistics")
    
    async def has_index(self, table: str, column: str) -> bool:
        """Check if index exists"""
        table_indexes = self._indexes.get(table, [])
        return column in table_indexes


class AOptimizer(IOptimizer, ABC):
    """Abstract base class for optimizers"""
    
    def __init__(
        self,
        cost_model: Optional[ICostModel] = None,
        statistics_manager: Optional[IStatisticsManager] = None
    ):
        self._cost_model = cost_model
        self._statistics_manager = statistics_manager
        self._rules: List[IOptimizationRule] = []
    
    async def optimize(self, plan: IExecutionPlan) -> IExecutionPlan:
        """Optimize execution plan"""
        # To be implemented by subclasses
        raise NotImplementedError("Subclasses must implement optimize")
    
    def add_rule(self, rule: IOptimizationRule) -> None:
        """Add optimization rule"""
        self._rules.append(rule)
    
    def remove_rule(self, rule_name: str) -> None:
        """Remove optimization rule"""
        self._rules = [r for r in self._rules if r.get_name() != rule_name]
    
    def get_rules(self) -> List[IOptimizationRule]:
        """Get all optimization rules"""
        return self._rules.copy()


class AOptimizationRule(IOptimizationRule, ABC):
    """Abstract base class for optimization rules"""
    
    def __init__(self, name: str):
        self._name = name
    
    def get_name(self) -> str:
        return self._name
    
    async def apply(self, plan: IExecutionPlan) -> Optional[IExecutionPlan]:
        """Apply rule to plan"""
        # To be implemented by subclasses
        raise NotImplementedError("Subclasses must implement apply")
    
    def is_applicable(self, plan: IExecutionPlan) -> bool:
        """Check if rule is applicable"""
        # To be implemented by subclasses
        raise NotImplementedError("Subclasses must implement is_applicable")


"""
Optimization Rules

Individual optimization rules that can be applied to execution plans.

**Company:** eXonware.com
**Author:** Eng. Muhammad AlShehri
**Version:** 0.0.1.5
"""

from typing import Optional, List
from copy import deepcopy

from .base import AOptimizationRule, ExecutionPlan, PlanNode
from .contracts import IExecutionPlan, IPlanNode, IStatisticsManager
from .defs import PlanNodeType, ScanType


class PredicatePushdownRule(AOptimizationRule):
    """
    Push filter predicates down the query tree
    
    This reduces the amount of data that needs to be processed by
    applying filters as early as possible.
    """
    
    def __init__(self):
        super().__init__("PredicatePushdown")
    
    def is_applicable(self, plan: IExecutionPlan) -> bool:
        """Check if plan has filters that can be pushed down"""
        return self._has_pushable_filter(plan.get_root_node())
    
    async def apply(self, plan: IExecutionPlan) -> Optional[IExecutionPlan]:
        """Apply predicate pushdown"""
        root = plan.get_root_node()
        optimized_root = self._pushdown_filters(root)
        
        if optimized_root != root:
            return ExecutionPlan(
                root=optimized_root,
                plan_type=plan.plan_type,
                optimization_level=plan.optimization_level
            )
        
        return None
    
    def _has_pushable_filter(self, node: IPlanNode) -> bool:
        """Check if node or its children have pushable filters"""
        if node.get_type() == PlanNodeType.FILTER.name:
            children = node.get_children()
            if children and children[0].get_type() != PlanNodeType.SEQUENTIAL_SCAN.name:
                return True
        
        for child in node.get_children():
            if self._has_pushable_filter(child):
                return True
        
        return False
    
    def _pushdown_filters(self, node: IPlanNode) -> IPlanNode:
        """Recursively push down filters"""
        if not isinstance(node, PlanNode):
            return node
        
        # If this is a filter node
        if node.node_type == PlanNodeType.FILTER:
            children = node.get_children()
            if children:
                child = children[0]
                # Try to merge filter with child scan
                if isinstance(child, PlanNode) and child.node_type == PlanNodeType.SEQUENTIAL_SCAN:
                    # Merge filter into scan
                    merged = PlanNode(
                        node_type=PlanNodeType.SEQUENTIAL_SCAN,
                        properties={
                            **child.properties,
                            'filter': node.properties.get('condition')
                        },
                        estimated_rows=node.estimated_rows,
                        estimated_cost=child.estimated_cost + node.estimated_cost
                    )
                    return merged
        
        # Recursively process children
        new_children = [self._pushdown_filters(child) for child in node.get_children()]
        if new_children != node.get_children():
            new_node = PlanNode(
                node_type=node.node_type,
                properties=node.properties.copy(),
                children=new_children,
                estimated_rows=node.estimated_rows,
                estimated_cost=node.estimated_cost
            )
            return new_node
        
        return node


class ProjectionPushdownRule(AOptimizationRule):
    """
    Push projections down the query tree
    
    This reduces the amount of data that needs to be processed by
    selecting only required columns as early as possible.
    """
    
    def __init__(self):
        super().__init__("ProjectionPushdown")
    
    def is_applicable(self, plan: IExecutionPlan) -> bool:
        """Check if plan has projections that can be pushed down"""
        return self._has_pushable_projection(plan.get_root_node())
    
    async def apply(self, plan: IExecutionPlan) -> Optional[IExecutionPlan]:
        """Apply projection pushdown"""
        root = plan.get_root_node()
        optimized_root = self._pushdown_projections(root)
        
        if optimized_root != root:
            return ExecutionPlan(
                root=optimized_root,
                plan_type=plan.plan_type,
                optimization_level=plan.optimization_level
            )
        
        return None
    
    def _has_pushable_projection(self, node: IPlanNode) -> bool:
        """Check if node or its children have pushable projections"""
        if node.get_type() == PlanNodeType.PROJECT.name:
            return True
        
        for child in node.get_children():
            if self._has_pushable_projection(child):
                return True
        
        return False
    
    def _pushdown_projections(self, node: IPlanNode) -> IPlanNode:
        """Recursively push down projections"""
        if not isinstance(node, PlanNode):
            return node
        
        # Recursively process children
        new_children = [self._pushdown_projections(child) for child in node.get_children()]
        if new_children != node.get_children():
            new_node = PlanNode(
                node_type=node.node_type,
                properties=node.properties.copy(),
                children=new_children,
                estimated_rows=node.estimated_rows,
                estimated_cost=node.estimated_cost
            )
            return new_node
        
        return node


class IndexSelectionRule(AOptimizationRule):
    """
    Select indexes for scan operations
    
    Replaces sequential scans with index scans when appropriate.
    """
    
    def __init__(self, statistics_manager: IStatisticsManager):
        super().__init__("IndexSelection")
        self._statistics_manager = statistics_manager
    
    def is_applicable(self, plan: IExecutionPlan) -> bool:
        """Check if plan has scans that could use indexes"""
        return self._has_scannable_node(plan.get_root_node())
    
    async def apply(self, plan: IExecutionPlan) -> Optional[IExecutionPlan]:
        """Apply index selection"""
        root = plan.get_root_node()
        optimized_root = await self._select_indexes(root)
        
        if optimized_root != root:
            return ExecutionPlan(
                root=optimized_root,
                plan_type=plan.plan_type,
                optimization_level=plan.optimization_level
            )
        
        return None
    
    def _has_scannable_node(self, node: IPlanNode) -> bool:
        """Check if node is a scan that could use index"""
        if node.get_type() == PlanNodeType.SEQUENTIAL_SCAN.name:
            props = node.get_properties()
            if props.get('filter'):
                return True
        
        for child in node.get_children():
            if self._has_scannable_node(child):
                return True
        
        return False
    
    async def _select_indexes(self, node: IPlanNode) -> IPlanNode:
        """Recursively select indexes for scans"""
        if not isinstance(node, PlanNode):
            return node
        
        # If this is a sequential scan with a filter
        if node.node_type == PlanNodeType.SEQUENTIAL_SCAN:
            props = node.properties
            filter_cond = props.get('filter')
            source = props.get('source')
            
            if filter_cond and source:
                # Check if we have an index on the filter column
                filter_column = self._extract_column_from_filter(filter_cond)
                if filter_column:
                    has_index = await self._statistics_manager.has_index(source, filter_column)
                    if has_index:
                        # Convert to index scan
                        new_node = PlanNode(
                            node_type=PlanNodeType.INDEX_SCAN,
                            properties={
                                **props,
                                'index_column': filter_column
                            },
                            estimated_rows=node.estimated_rows,
                            estimated_cost=node.estimated_cost * 0.5  # Index scan is faster
                        )
                        return new_node
        
        # Recursively process children
        new_children = []
        for child in node.get_children():
            new_child = await self._select_indexes(child)
            new_children.append(new_child)
        
        if new_children != node.get_children():
            new_node = PlanNode(
                node_type=node.node_type,
                properties=node.properties.copy(),
                children=new_children,
                estimated_rows=node.estimated_rows,
                estimated_cost=node.estimated_cost
            )
            return new_node
        
        return node
    
    def _extract_column_from_filter(self, filter_cond: any) -> Optional[str]:
        """Extract column name from filter condition"""
        # Simplified extraction
        if hasattr(filter_cond, 'column'):
            return filter_cond.column
        if hasattr(filter_cond, 'left') and hasattr(filter_cond.left, 'column'):
            return filter_cond.left.column
        return None


class JoinReorderingRule(AOptimizationRule):
    """
    Reorder joins to minimize cost
    
    Applies dynamic programming or greedy algorithm to find optimal join order.
    """
    
    def __init__(self, statistics_manager: IStatisticsManager):
        super().__init__("JoinReordering")
        self._statistics_manager = statistics_manager
    
    def is_applicable(self, plan: IExecutionPlan) -> bool:
        """Check if plan has multiple joins that can be reordered"""
        return self._count_joins(plan.get_root_node()) >= 2
    
    async def apply(self, plan: IExecutionPlan) -> Optional[IExecutionPlan]:
        """Apply join reordering"""
        # Simplified: In a full implementation, this would use dynamic programming
        # to find the optimal join order
        return None
    
    def _count_joins(self, node: IPlanNode) -> int:
        """Count number of join nodes in plan"""
        count = 1 if 'JOIN' in node.get_type() else 0
        for child in node.get_children():
            count += self._count_joins(child)
        return count


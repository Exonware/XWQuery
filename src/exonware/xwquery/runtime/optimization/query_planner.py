"""
Query Planner
Converts action trees to execution plans.
**Company:** eXonware.com
**Author:** eXonware Backend Team
**Version:** 0.0.1.6
**Generation Date:** 27-Jan-2026
"""

from __future__ import annotations
from typing import Any
import asyncio
from .base import AQueryPlanner, ExecutionPlan, PlanNode
from .contracts import IExecutionPlan, ICostModel, IStatisticsManager
from .defs import PlanNodeType, JoinAlgorithm, ScanType, OptimizationLevel
# Action types are strings in xwquery


class QueryPlanner(AQueryPlanner):
    """
    Converts action trees to logical and physical execution plans
    """

    def __init__(
        self,
        cost_model: ICostModel | None = None,
        statistics_manager: IStatisticsManager | None = None,
        optimization_level: OptimizationLevel = OptimizationLevel.STANDARD
    ):
        super().__init__(cost_model, statistics_manager)
        self._optimization_level = optimization_level

    async def create_logical_plan(self, action_tree: Any) -> IExecutionPlan:
        """
        Create logical execution plan from action tree
        Logical plans are database-independent and focus on WHAT to do,
        not HOW to do it.
        """
        if not hasattr(action_tree, 'action_type'):
            raise ValueError("Invalid action tree: missing action_type")
        root_node = await self._build_logical_node(action_tree)
        plan = ExecutionPlan(
            root=root_node,
            plan_type="logical",
            optimization_level=self._optimization_level
        )
        return plan

    async def create_physical_plan(
        self,
        logical_plan: IExecutionPlan,
        storage_connection: Any | None = None
    ) -> IExecutionPlan:
        """
        Convert logical plan to physical execution plan.
        Physical plans specify HOW to execute operations
        (e.g., hash join vs merge join, sequential scan vs index scan).
        **Capability Integration:**
        If storage_connection is provided, uses XWStorage capabilities to optimize
        the physical plan (e.g., pushdown filters, use native queries, streaming).
        Args:
            logical_plan: Logical execution plan
            storage_connection: Optional XWStorage connection for capability-aware planning
        """
        logical_root = logical_plan.get_root_node()
        physical_root = await self._build_physical_node(logical_root, storage_connection)
        plan = ExecutionPlan(
            root=physical_root,
            plan_type="physical",
            optimization_level=self._optimization_level
        )
        return plan

    async def _build_logical_node(self, action: Any) -> PlanNode:
        """Build logical plan node from action"""
        action_type = action.action_type
        # Map action types to logical plan node types
        if action_type == "SELECT":
            return await self._build_select_node(action)
        elif action_type == "INSERT":
            return self._build_insert_node(action)
        elif action_type == "UPDATE":
            return self._build_update_node(action)
        elif action_type == "DELETE":
            return self._build_delete_node(action)
        elif action_type == "JOIN":
            return await self._build_join_node(action)
        elif action_type == "FILTER" or action_type == "WHERE":
            return await self._build_filter_node(action)
        elif action_type == "GROUP":
            return self._build_group_node(action)
        elif action_type == "ORDER":
            return self._build_sort_node(action)
        else:
            # Default handling for other action types
            return PlanNode(
                node_type=PlanNodeType.SEQUENTIAL_SCAN,
                properties={'action': action},
                estimated_rows=1000  # Default estimate
            )

    async def _build_select_node(self, action: Any) -> PlanNode:
        """Build SELECT node"""
        # Determine source (table or subquery)
        source = getattr(action, 'source', None)
        # Create scan node
        node = PlanNode(
            node_type=PlanNodeType.SEQUENTIAL_SCAN,
            properties={
                'source': source,
                'columns': getattr(action, 'columns', ['*']),
                'action': action
            }
        )
        # Estimate rows if statistics manager is available
        if self._statistics_manager and source:
            try:
                row_count = await self._statistics_manager.get_table_row_count(source)
                node.estimated_rows = row_count
            except:
                node.estimated_rows = 1000  # Default estimate
        else:
            node.estimated_rows = 1000
        # Estimate cost if cost model is available
        if self._cost_model and source:
            try:
                cost = await self._cost_model.estimate_scan_cost(
                    table=source,
                    scan_type='sequential'
                )
                node.estimated_cost = cost
            except:
                node.estimated_cost = 10.0  # Default cost
        else:
            node.estimated_cost = 10.0
        return node

    def _build_insert_node(self, action: Any) -> PlanNode:
        """Build INSERT node"""
        return PlanNode(
            node_type=PlanNodeType.INSERT,
            properties={
                'table': getattr(action, 'table', None),
                'values': getattr(action, 'values', []),
                'action': action
            },
            estimated_rows=1,
            estimated_cost=1.0
        )

    def _build_update_node(self, action: Any) -> PlanNode:
        """Build UPDATE node"""
        return PlanNode(
            node_type=PlanNodeType.UPDATE,
            properties={
                'table': getattr(action, 'table', None),
                'updates': getattr(action, 'updates', {}),
                'action': action
            },
            estimated_rows=100,  # Estimate
            estimated_cost=10.0
        )

    def _build_delete_node(self, action: Any) -> PlanNode:
        """Build DELETE node"""
        return PlanNode(
            node_type=PlanNodeType.DELETE,
            properties={
                'table': getattr(action, 'table', None),
                'action': action
            },
            estimated_rows=100,  # Estimate
            estimated_cost=10.0
        )

    async def _build_join_node(self, action: Any) -> PlanNode:
        """Build JOIN node"""
        # Build child nodes for left and right sides
        left_action = getattr(action, 'left', None)
        right_action = getattr(action, 'right', None)
        children = []
        if left_action:
            children.append(await self._build_logical_node(left_action))
        if right_action:
            children.append(await self._build_logical_node(right_action))
        # Estimate join result size
        left_rows = children[0].estimated_rows if children else 1000
        right_rows = children[1].estimated_rows if len(children) > 1 else 1000
        estimated_rows = int(left_rows * right_rows * 0.1)  # Assume 10% selectivity
        node = PlanNode(
            node_type=PlanNodeType.HASH_JOIN,
            properties={
                'join_type': getattr(action, 'join_type', 'inner'),
                'condition': getattr(action, 'condition', None),
                'action': action
            },
            children=children,
            estimated_rows=estimated_rows
        )
        # Estimate cost if cost model is available
        if self._cost_model:
            try:
                cost = await self._cost_model.estimate_join_cost(
                    left_rows=left_rows,
                    right_rows=right_rows,
                    join_type='hash'
                )
                node.estimated_cost = cost
            except:
                node.estimated_cost = float(left_rows + right_rows)
        else:
            node.estimated_cost = float(left_rows + right_rows)
        return node

    async def _build_filter_node(self, action: Any) -> PlanNode:
        """Build FILTER node"""
        # Build child node
        child_action = getattr(action, 'source', None)
        children = []
        if child_action:
            children.append(await self._build_logical_node(child_action))
        # Estimate selectivity
        selectivity = 0.1  # Default 10% selectivity
        if self._statistics_manager and child_action:
            try:
                source = getattr(child_action, 'source', None)
                predicate = getattr(action, 'condition', None)
                if source and predicate:
                    selectivity = await self._statistics_manager.estimate_selectivity(
                        source, predicate
                    )
            except:
                pass
        child_rows = children[0].estimated_rows if children else 1000
        estimated_rows = int(child_rows * selectivity)
        return PlanNode(
            node_type=PlanNodeType.FILTER,
            properties={
                'condition': getattr(action, 'condition', None),
                'selectivity': selectivity,
                'action': action
            },
            children=children,
            estimated_rows=estimated_rows,
            estimated_cost=float(child_rows * 0.01)  # Small CPU cost per row
        )

    def _build_group_node(self, action: Any) -> PlanNode:
        """Build GROUP BY node"""
        return PlanNode(
            node_type=PlanNodeType.GROUP_BY,
            properties={
                'group_by': getattr(action, 'group_by', []),
                'aggregates': getattr(action, 'aggregates', []),
                'action': action
            },
            estimated_rows=100,  # Estimate
            estimated_cost=50.0
        )

    def _build_sort_node(self, action: Any) -> PlanNode:
        """Build SORT node"""
        return PlanNode(
            node_type=PlanNodeType.SORT,
            properties={
                'order_by': getattr(action, 'order_by', []),
                'direction': getattr(action, 'direction', 'ASC'),
                'action': action
            },
            estimated_rows=1000,  # Estimate
            estimated_cost=100.0  # Sorting is expensive
        )

    async def _build_physical_node(
        self,
        logical_node: PlanNode,
        storage_connection: Any | None = None
    ) -> PlanNode:
        """
        Convert logical node to physical node.
        Uses XWStorage capabilities if storage_connection is provided to optimize
        the physical plan (pushdown, native queries, streaming).
        Args:
            logical_node: Logical plan node
            storage_connection: Optional XWStorage connection for capability checks
        """
        node_type = logical_node.node_type
        # Get capabilities if storage connection is available
        capabilities = None
        if storage_connection is not None:
            capabilities = self._get_storage_capabilities(storage_connection)
        # Optimize based on capabilities
        if node_type == PlanNodeType.FILTER and capabilities:
            # Check if we can pushdown filter to storage
            if capabilities.supports_query_pushdown:
                # Mark filter for pushdown in physical plan
                logical_node.properties['pushdown_enabled'] = True
                logical_node.properties['execution_path'] = 'native_optimized'
                # Reduce cost estimate since filter happens in storage
                logical_node.estimated_cost *= 0.1  # Much cheaper when pushed down
        if node_type == PlanNodeType.SEQUENTIAL_SCAN:
            source = logical_node.properties.get('source')
            # Check for index scan opportunities
            if self._statistics_manager and source:
                # In real implementation, check for index scan opportunities
                pass
            # Check if we can use native queries
            if capabilities and capabilities.supports_native_queries:
                logical_node.properties['use_native_query'] = True
                logical_node.properties['execution_path'] = 'native_optimized'
            # Check if we should use streaming for large results
            if capabilities and logical_node.estimated_rows:
                estimated_size = logical_node.estimated_rows * 1000  # Rough estimate: 1KB per row
                if capabilities.should_use_streaming(estimated_size):
                    logical_node.properties['use_streaming'] = True
        # Create physical node
        physical_node = PlanNode(
            node_type=node_type,
            properties=logical_node.properties.copy(),
            estimated_rows=logical_node.estimated_rows,
            estimated_cost=logical_node.estimated_cost
        )
        # Recursively process children
        for child in logical_node.get_children():
            physical_child = await self._build_physical_node(child, storage_connection)
            physical_node.children.append(physical_child)
        return physical_node

    def _get_storage_capabilities(self, storage_connection: Any) -> Any | None:
        """
        Get storage capabilities from XWStorage connection.
        Args:
            storage_connection: XWStorage connection instance
        Returns:
            ConnectorCapabilities if available, None otherwise
        """
        try:
            # Try to import and use XWStorage capability provider
            from exonware.xwstorage import get_connection_capabilities
            return get_connection_capabilities(storage_connection)
        except ImportError:
            # XWStorage not available
            return None
        except Exception:
            # Connection doesn't support capabilities
            return None

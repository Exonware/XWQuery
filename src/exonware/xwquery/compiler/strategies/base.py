#!/usr/bin/env python3
"""
Query Strategy Base Classes
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.2
Generation Date: October 26, 2025
"""

from __future__ import annotations
from abc import ABC, abstractmethod
from typing import Any, Optional
from datetime import datetime
# Import from root
from ..base import AQueryStrategy
from ...defs import QueryMode
from ...errors import XWQueryTypeError, XWQueryValueError
# AQueryStrategy is now imported from root base.py
# Strategy-specific base classes below


class AQueryActionExecutor(AQueryStrategy):
    """Abstract base for query action executors with XWQuery Script support."""
    @abstractmethod

    def execute_query(self, query: str, query_type: str, **kwargs) -> Any:
        """Execute a query on this backend."""
        pass
    @abstractmethod

    def validate_query(self, query: str, query_type: str) -> bool:
        """Validate if this backend can handle the query."""
        pass
    @abstractmethod

    def get_supported_query_types(self) -> list[str]:
        """Get list of query types this backend supports."""
        pass

    def to_native(self) -> XWQSStrategy:
        """Convert this executor to XWQSStrategy using actions."""
        from .xwqs import XWQSStrategy
        return XWQSStrategy()

    def to_actions_tree(self, query: str) -> Any:
        """Convert query to actions tree - default implementation."""
        script_strategy = self.to_native().from_format(query, self.get_query_type())
        return script_strategy.get_actions_tree()

    def from_actions_tree(self, actions_tree: Any) -> str:
        """Convert actions tree to query - default implementation."""
        script_strategy = self.to_native()
        script_strategy._actions_tree = actions_tree
        return script_strategy.to_format(self.get_query_type())


class ALinearQueryStrategy(AQueryStrategy):
    """Linear query capabilities."""
    @abstractmethod

    def find_by_index(self, index: int) -> Any:
        """Find element by index."""
        pass
    @abstractmethod

    def find_by_value(self, value: Any) -> list[int]:
        """Find indices by value."""
        pass
    @abstractmethod

    def range_query(self, start_index: int, end_index: int) -> list[Any]:
        """Query range of indices."""
        pass
    @abstractmethod

    def count_occurrences(self, value: Any) -> int:
        """Count occurrences of value."""
        pass


class ATreeQueryStrategy(AQueryStrategy):
    """Tree query capabilities."""
    @abstractmethod

    def find_by_key(self, key: Any) -> Any:
        """Find by key."""
        pass
    @abstractmethod

    def range_query(self, start_key: Any, end_key: Any) -> list[Any]:
        """Range query."""
        pass
    @abstractmethod

    def prefix_query(self, prefix: str) -> list[Any]:
        """Find all keys with prefix."""
        pass
    @abstractmethod

    def suffix_query(self, suffix: str) -> list[Any]:
        """Find all keys with suffix."""
        pass


class AGraphQueryStrategy(AQueryStrategy):
    """Graph query capabilities."""
    @abstractmethod

    def path_query(self, start: Any, end: Any) -> list[Any]:
        """Path query."""
        pass
    @abstractmethod

    def neighbor_query(self, node: Any) -> list[Any]:
        """Neighbor query."""
        pass
    @abstractmethod

    def shortest_path_query(self, start: Any, end: Any) -> list[Any]:
        """Shortest path query."""
        pass
    @abstractmethod

    def connected_components_query(self) -> list[list[Any]]:
        """Connected components query."""
        pass
    @abstractmethod

    def cycle_detection_query(self) -> list[list[Any]]:
        """Cycle detection query."""
        pass

    def _build_actions_tree(self, entity_name: Optional[str], fields: list[str], 
                           where_conditions: list[str], source_format: str, 
                           action_id_prefix: str = "graphql") -> Any:
        """
        Build actions tree from parsed query elements.
        Args:
            entity_name: Name of the entity/table being queried
            fields: List of field names to select
            where_conditions: List of WHERE condition strings
            source_format: Source format name (e.g., "GRAPHQL", "CYPHER")
            action_id_prefix: Prefix for action IDs (e.g., "graphql", "cypher")
        Returns:
            ANode representing the actions tree
        """
        from datetime import datetime
        from exonware.xwnode.base import ANode
        children = []
        # Add FROM action if entity_name exists
        if entity_name:
            children.append({
                "type": "FROM",
                "id": f"{action_id_prefix}_from_1",
                "content": entity_name,
                "line_number": 1,
                "timestamp": datetime.now().isoformat(),
                "children": []
            })
        # Add WHERE action if conditions exist
        if where_conditions:
            where_content = " AND ".join(where_conditions)
            children.append({
                "type": "WHERE",
                "id": f"{action_id_prefix}_where_1",
                "content": where_content,
                "line_number": 1,
                "timestamp": datetime.now().isoformat(),
                "children": []
            })
        # Main SELECT action
        select_fields = ", ".join(fields) if fields else "*"
        select_action = {
            "type": "SELECT",
            "id": f"{action_id_prefix}_select_1",
            "content": f"SELECT {select_fields}",
            "line_number": 1,
            "timestamp": datetime.now().isoformat(),
            "children": children
        }
        actions = {
            "root": {
                "type": "PROGRAM",
                "statements": [select_action],
                "comments": [],
                "metadata": {
                    "version": "1.0",
                    "created": datetime.now().isoformat(),
                    "source_format": source_format
                }
            }
        }
        return ANode.from_native(actions)


class AStructuredQueryStrategy(AQueryStrategy):
    """Structured query capabilities for SQL-like languages."""
    @abstractmethod

    def select_query(self, table: str, columns: list[str], where_clause: str = None) -> Any:
        """Execute SELECT query."""
        pass
    @abstractmethod

    def insert_query(self, table: str, data: dict[str, Any]) -> Any:
        """Execute INSERT query."""
        pass
    @abstractmethod

    def update_query(self, table: str, data: dict[str, Any], where_clause: str = None) -> Any:
        """Execute UPDATE query."""
        pass
    @abstractmethod

    def delete_query(self, table: str, where_clause: str = None) -> Any:
        """Execute DELETE query."""
        pass
    @abstractmethod

    def join_query(self, tables: list[str], join_conditions: list[str]) -> Any:
        """Execute JOIN query."""
        pass
    @abstractmethod

    def aggregate_query(self, table: str, functions: list[str], group_by: list[str] = None) -> Any:
        """Execute aggregate query."""
        pass


class ADocumentQueryStrategy(AQueryStrategy):
    """Document query capabilities for JSON/XML-like languages."""
    @abstractmethod

    def path_query(self, path: str) -> Any:
        """Execute path-based query."""
        pass
    @abstractmethod

    def filter_query(self, filter_expression: str) -> Any:
        """Execute filter query."""
        pass
    @abstractmethod

    def projection_query(self, fields: list[str]) -> Any:
        """Execute projection query."""
        pass
    @abstractmethod

    def sort_query(self, sort_fields: list[str], order: str = "asc") -> Any:
        """Execute sort query."""
        pass
    @abstractmethod

    def limit_query(self, limit: int, offset: int = 0) -> Any:
        """Execute limit query."""
        pass

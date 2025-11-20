#!/usr/bin/env python3
"""
Query Strategy Base Classes

This module now imports from root-level base.py.
Kept for backward compatibility.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.5
Generation Date: October 26, 2025
"""

from abc import ABC, abstractmethod
from typing import Any, Optional, List, Dict, Union, Type
from datetime import datetime

# Import from root
from ..base import AQueryStrategy
from ..defs import QueryMode
from ..errors import XWQueryTypeError, XWQueryValueError


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
    def get_supported_query_types(self) -> List[str]:
        """Get list of query types this backend supports."""
        pass
    
    def to_native(self) -> 'XWQueryScriptStrategy':
        """Convert this executor to XWQueryScriptStrategy using actions."""
        from .xwquery import XWQueryScriptStrategy
        return XWQueryScriptStrategy()
    
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
    
    def find_by_index(self, index: int) -> Any:
        """Find element by index."""
        raise NotImplementedError("Subclasses must implement find_by_index")
    
    def find_by_value(self, value: Any) -> List[int]:
        """Find indices by value."""
        raise NotImplementedError("Subclasses must implement find_by_value")
    
    def range_query(self, start_index: int, end_index: int) -> List[Any]:
        """Query range of indices."""
        raise NotImplementedError("Subclasses must implement range_query")
    
    def count_occurrences(self, value: Any) -> int:
        """Count occurrences of value."""
        raise NotImplementedError("Subclasses must implement count_occurrences")


class ATreeQueryStrategy(AQueryStrategy):
    """Tree query capabilities."""
    
    def find_by_key(self, key: Any) -> Any:
        """Find by key."""
        raise NotImplementedError("Subclasses must implement find_by_key")
    
    def range_query(self, start_key: Any, end_key: Any) -> List[Any]:
        """Range query."""
        raise NotImplementedError("Subclasses must implement range_query")
    
    def prefix_query(self, prefix: str) -> List[Any]:
        """Find all keys with prefix."""
        raise NotImplementedError("Subclasses must implement prefix_query")
    
    def suffix_query(self, suffix: str) -> List[Any]:
        """Find all keys with suffix."""
        raise NotImplementedError("Subclasses must implement suffix_query")


class AGraphQueryStrategy(AQueryStrategy):
    """Graph query capabilities."""
    
    def path_query(self, start: Any, end: Any) -> List[Any]:
        """Path query."""
        raise NotImplementedError("Subclasses must implement path_query")
    
    def neighbor_query(self, node: Any) -> List[Any]:
        """Neighbor query."""
        raise NotImplementedError("Subclasses must implement neighbor_query")
    
    def shortest_path_query(self, start: Any, end: Any) -> List[Any]:
        """Shortest path query."""
        raise NotImplementedError("Subclasses must implement shortest_path_query")
    
    def connected_components_query(self) -> List[List[Any]]:
        """Connected components query."""
        raise NotImplementedError("Subclasses must implement connected_components_query")
    
    def cycle_detection_query(self) -> List[List[Any]]:
        """Cycle detection query."""
        raise NotImplementedError("Subclasses must implement cycle_detection_query")


class AStructuredQueryStrategy(AQueryStrategy):
    """Structured query capabilities for SQL-like languages."""
    
    @abstractmethod
    def select_query(self, table: str, columns: List[str], where_clause: str = None) -> Any:
        """Execute SELECT query."""
        pass
    
    @abstractmethod
    def insert_query(self, table: str, data: Dict[str, Any]) -> Any:
        """Execute INSERT query."""
        pass
    
    @abstractmethod
    def update_query(self, table: str, data: Dict[str, Any], where_clause: str = None) -> Any:
        """Execute UPDATE query."""
        pass
    
    @abstractmethod
    def delete_query(self, table: str, where_clause: str = None) -> Any:
        """Execute DELETE query."""
        pass
    
    @abstractmethod
    def join_query(self, tables: List[str], join_conditions: List[str]) -> Any:
        """Execute JOIN query."""
        pass
    
    @abstractmethod
    def aggregate_query(self, table: str, functions: List[str], group_by: List[str] = None) -> Any:
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
    def projection_query(self, fields: List[str]) -> Any:
        """Execute projection query."""
        pass
    
    @abstractmethod
    def sort_query(self, sort_fields: List[str], order: str = "asc") -> Any:
        """Execute sort query."""
        pass
    
    @abstractmethod
    def limit_query(self, limit: int, offset: int = 0) -> Any:
        """Execute limit query."""
        pass

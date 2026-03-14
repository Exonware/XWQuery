#!/usr/bin/env python3
"""
Wavefront Query Strategy
This module implements the Wavefront query strategy for Wavefront Query Language operations.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.5
Generation Date: January 2, 2025
"""
from typing import Any
from .base import AStructuredQueryStrategy
from .grammar_based import GrammarBasedStrategy
from ...errors import XWQueryValueError
from ...defs import QueryMode, QueryTrait
from exonware.xwnode.base import ANode
import re
class WavefrontStrategy(GrammarBasedStrategy, AStructuredQueryStrategy):
    """Wavefront query strategy for Wavefront Query Language operations."""
    def __init__(self, **options):
        GrammarBasedStrategy.__init__(self, 'wavefront', **options)
        super().__init__(**options)
        self._mode = QueryMode.AUTO
        self._traits = QueryTrait.STRUCTURED | QueryTrait.ANALYTICAL | QueryTrait.TIME_SERIES
    def execute(self, query: str, **kwargs) -> Any:
        """Execute Wavefront query."""
        if not self.validate_query(query):
            raise XWQueryValueError(f"Invalid Wavefront query: {query}")
        return {"result": "Wavefront query executed", "query": query}
    def validate_query(self, query: str) -> bool:
        """Validate Wavefront query syntax."""
        if not query or not isinstance(query, str):
            return False
        # Wavefront uses ts() function for metrics with tags
        return any(op in query for op in ["ts(", "sum", "avg", "max", "min", "count", "alias", "label", "{", "}"])
    def get_query_plan(self, query: str) -> dict[str, Any]:
        """Get Wavefront query execution plan."""
        return {
            "query_type": "Wavefront",
            "complexity": "MEDIUM",
            "estimated_cost": 80
        }
    def select_query(self, table: str, columns: list[str], where_clause: str = None) -> Any:
        """Execute SELECT query."""
        tags = f"{{{where_clause or ''}}}" if where_clause else ""
        return self.execute(f"ts(\"{table}\"{tags})")
    def insert_query(self, table: str, data: dict[str, Any]) -> Any:
        """Execute INSERT query."""
        return self.execute(f"ts(\"{table}\")")
    def update_query(self, table: str, data: dict[str, Any], where_clause: str = None) -> Any:
        """Execute UPDATE query."""
        tags = f"{{{where_clause or ''}}}" if where_clause else ""
        return self.execute(f"ts(\"{table}\"{tags})")
    def delete_query(self, table: str, where_clause: str = None) -> Any:
        """Execute DELETE query."""
        return self.execute(f"ts(\"{table}\")")
    def join_query(self, tables: list[str], join_conditions: list[str]) -> Any:
        """Execute JOIN query."""
        return self.execute(f"ts(\"{tables[0]}\") + ts(\"{tables[1]}\")")
    def aggregate_query(self, table: str, functions: list[str], group_by: list[str] = None) -> Any:
        """Execute aggregate query."""
        tags = f"{{{', '.join([f'{g}.*' for g in group_by])}}}" if group_by else ""
        return self.execute(f"{functions[0]}(ts(\"{table}\"{tags}))")

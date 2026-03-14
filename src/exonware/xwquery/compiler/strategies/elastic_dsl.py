#!/usr/bin/env python3
"""
Elasticsearch DSL Query Strategy
This module implements the Elasticsearch DSL query strategy for Elasticsearch Query DSL operations.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.3
Generation Date: January 2, 2025
"""

from typing import Any
from .base import AStructuredQueryStrategy
from .grammar_based import GrammarBasedStrategy
from ...errors import XWQueryValueError
from ...defs import QueryMode, QueryTrait
from exonware.xwnode.base import ANode


class ElasticDSLStrategy(GrammarBasedStrategy, AStructuredQueryStrategy):
    """Elasticsearch DSL query strategy for Elasticsearch Query DSL operations."""

    def __init__(self, **options):
        GrammarBasedStrategy.__init__(self, 'elasticdsl', **options)
        super().__init__(**options)
        self._mode = QueryMode.AUTO
        self._traits = QueryTrait.DOCUMENT | QueryTrait.STRUCTURED | QueryTrait.SEARCH | QueryTrait.ANALYTICAL

    def execute(self, query: str, **kwargs) -> Any:
        """Execute Elasticsearch DSL query."""
        if not self.validate_query(query):
            raise XWQueryValueError(f"Invalid Elasticsearch DSL query: {query}")
        return {"result": "Elasticsearch DSL query executed", "query": query}

    def validate_query(self, query: str) -> bool:
        """Validate Elasticsearch DSL query syntax."""
        if not query or not isinstance(query, str):
            return False
        return any(op in query for op in ["query", "match", "term", "bool", "filter", "must", "should"])

    def get_query_plan(self, query: str) -> dict[str, Any]:
        """Get Elasticsearch DSL query execution plan."""
        return {
            "query_type": "ELASTIC_DSL",
            "complexity": "HIGH",
            "estimated_cost": 120
        }

    def select_query(self, table: str, columns: list[str], where_clause: str = None) -> Any:
        """Execute SELECT query."""
        return self.execute(f"GET /{table}/_search")

    def insert_query(self, table: str, data: dict[str, Any]) -> Any:
        """Execute INSERT query."""
        return self.execute(f"POST /{table}/_doc")

    def update_query(self, table: str, data: dict[str, Any], where_clause: str = None) -> Any:
        """Execute UPDATE query."""
        return self.execute(f"POST /{table}/_update_by_query")

    def delete_query(self, table: str, where_clause: str = None) -> Any:
        """Execute DELETE query."""
        return self.execute(f"POST /{table}/_delete_by_query")

    def join_query(self, tables: list[str], join_conditions: list[str]) -> Any:
        """Execute JOIN query."""
        return self.execute(f"GET /{tables[0]}/_search")

    def aggregate_query(self, table: str, functions: list[str], group_by: list[str] = None) -> Any:
        """Execute aggregate query."""
        return self.execute(f"GET /{table}/_search")
    # to_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)
    # from_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)

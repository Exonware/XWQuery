#!/usr/bin/env python3
"""
M3QL Query Strategy
This module implements the M3QL query strategy for M3 Query Language operations.
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
import re
class M3QLStrategy(GrammarBasedStrategy, AStructuredQueryStrategy):
    """M3QL query strategy for M3 Query Language operations."""
    def __init__(self, **options):
        GrammarBasedStrategy.__init__(self, 'm3ql', **options)
        super().__init__(**options)
        self._mode = QueryMode.AUTO
        self._traits = QueryTrait.STRUCTURED | QueryTrait.ANALYTICAL | QueryTrait.TIME_SERIES
    def execute(self, query: str, **kwargs) -> Any:
        """Execute M3QL query."""
        if not self.validate_query(query):
            raise XWQueryValueError(f"Invalid M3QL query: {query}")
        return {"result": "M3QL query executed", "query": query}
    def validate_query(self, query: str) -> bool:
        """Validate M3QL query syntax."""
        if not query or not isinstance(query, str):
            return False
        query = query.strip()
        # M3QL is PromQL-compatible: valid if it's a metric name (word) or has operators
        # Simple metric name (word starting with letter/digit)
        if re.match(r'^[\w][\w]*$', query):
            return True
        # M3QL has operators, label filters, or aggregate functions
        return any(op in query for op in ["{", "}", "=", "!=", "=~", "!~", "rate", "sum", "avg", "max", "min", "count", "by", "aggregate", "(", ")"])
    def get_query_plan(self, query: str) -> dict[str, Any]:
        """Get M3QL query execution plan."""
        return {
            "query_type": "M3QL",
            "complexity": "MEDIUM",
            "estimated_cost": 80
        }
    def select_query(self, table: str, columns: list[str], where_clause: str = None) -> Any:
        """Execute SELECT query."""
        tags = f"{{{where_clause or ''}}}" if where_clause else ""
        return self.execute(f"{table}{tags}")
    def insert_query(self, table: str, data: dict[str, Any]) -> Any:
        """Execute INSERT query."""
        return self.execute(f"{table}")
    def update_query(self, table: str, data: dict[str, Any], where_clause: str = None) -> Any:
        """Execute UPDATE query."""
        tags = f"{{{where_clause or ''}}}" if where_clause else ""
        return self.execute(f"{table}{tags}")
    def delete_query(self, table: str, where_clause: str = None) -> Any:
        """Execute DELETE query."""
        return self.execute(f"{table}")
    def join_query(self, tables: list[str], join_conditions: list[str]) -> Any:
        """Execute JOIN query."""
        return self.execute(f"{tables[0]} * on(instance) {tables[1]}")
    def aggregate_query(self, table: str, functions: list[str], group_by: list[str] = None) -> Any:
        """Execute aggregate query."""
        by_clause = f" by ({', '.join(group_by)})" if group_by else ""
        return self.execute(f"{functions[0]}({table}){by_clause}")

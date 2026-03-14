#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/query/strategies/m.py
M (Power Query) Query Strategy
This module implements the M query strategy for Power Query M language operations.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.5
Generation Date: January 2, 2025
"""

import re
from typing import Any
from .base import ADocumentQueryStrategy
from .grammar_based import GrammarBasedStrategy
from ...errors import XWQueryValueError
from ...defs import QueryMode, QueryTrait
from exonware.xwnode.base import ANode


class MStrategy(GrammarBasedStrategy, ADocumentQueryStrategy):
    """M query strategy for Power Query M language operations."""

    def __init__(self, **options):
        GrammarBasedStrategy.__init__(self, 'm', **options)
        super().__init__(**options)
        self._mode = QueryMode.AUTO
        self._traits = QueryTrait.DOCUMENT | QueryTrait.STRUCTURED | QueryTrait.ANALYTICAL

    def execute(self, query: str, **kwargs) -> Any:
        """Execute M query."""
        if not self.validate_query(query):
            raise XWQueryValueError(f"Invalid M query: {query}")
        return {"result": "M query executed", "query": query}

    def validate_query(self, query: str) -> bool:
        """Validate M query syntax."""
        if not query or not isinstance(query, str):
            return False
        query_lower = query.lower()
        return query_lower.startswith('let') and 'in' in query_lower

    def get_query_plan(self, query: str) -> dict[str, Any]:
        """Get M query execution plan."""
        return {
            "query_type": "M",
            "complexity": "HIGH",
            "estimated_cost": 125
        }

    def path_query(self, path: str) -> Any:
        """Execute path-based query."""
        return self.execute(f"let Source = {path} in Source")

    def filter_query(self, filter_expression: str) -> Any:
        """Execute filter query."""
        return self.execute(f"let Source = #table({{}}, {{}}), Filtered = Table.SelectRows(Source, each {filter_expression}) in Filtered")

    def projection_query(self, fields: list[str]) -> Any:
        """Execute projection query."""
        fields_str = ', '.join([f'"{f}"' for f in fields])
        return self.execute(f"let Source = #table({{}}, {{}}), Selected = Table.SelectColumns(Source, {{{fields_str}}}) in Selected")

    def sort_query(self, sort_fields: list[str], order: str = "asc") -> Any:
        """Execute sort query."""
        sort_str = ', '.join([f'{{"{f}", {"Order.Ascending" if order == "asc" else "Order.Descending"}}}' for f in sort_fields])
        return self.execute(f"let Source = #table({{}}, {{}}), Sorted = Table.Sort(Source, {{{sort_str}}}) in Sorted")

    def limit_query(self, limit: int, offset: int = 0) -> Any:
        """Execute limit query."""
        return self.execute(f"let Source = #table({{}}, {{}}), First = Table.FirstN(Source, {limit}) in First")
        # to_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)
        # Parse M query (let ... in ...)
        entity_name = None
        fields = []
        where_conditions = []
        # Extract table name from Table.FromRecords or similar
        table_match = re.search(r'Table\.From\w+|#table|(\w+)\s*=', query_lower, re.IGNORECASE)
        if table_match:
            entity_name = table_match.group(1) if table_match.lastindex else "Source"
        # Extract column names from Table.SelectColumns
        columns_match = re.search(r'Table\.SelectColumns\s*\([^,]+,\s*\{([^}]+)\}', query_lower, re.IGNORECASE)
        if columns_match:
            columns_str = columns_match.group(1).strip()
            # Extract quoted strings
            field_matches = re.findall(r'["\']([^"\']+)["\']', columns_str)
            fields = field_matches
        # Extract filter conditions from Table.SelectRows
        filter_match = re.search(r'Table\.SelectRows\s*\([^,]+,\s*each\s+(.+?)(?:\)|in)', query_lower, re.IGNORECASE | re.DOTALL)
        if filter_match:
            filter_expr = filter_match.group(1).strip()
            where_conditions.append(filter_expr)
        # Build actions tree
        children = []
        if entity_name:
            children.append({
                "type": "FROM",
                "id": "m_from_1",
                "content": entity_name,
                "line_number": 1,
                "timestamp": datetime.now().isoformat(),
                "children": []
            })
        if where_conditions:
            where_content = " AND ".join(where_conditions)
            children.append({
                "type": "WHERE",
                "id": "m_where_1",
                "content": where_content,
                "line_number": 1,
                "timestamp": datetime.now().isoformat(),
                "children": []
            })
        select_fields = ", ".join(fields) if fields else "*"
        select_action = {
            "type": "SELECT",
            "id": "m_select_1",
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
                    "source_format": "M"
                }
            }
        }
        return ANode.from_native(actions)
        # from_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)

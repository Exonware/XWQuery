#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/query/strategies/powerfx.py
PowerFx Query Strategy
This module implements the PowerFx query strategy for Power Platform formula language operations.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.3
Generation Date: January 2, 2025
"""

import re
from typing import Any
from .base import ADocumentQueryStrategy
from .grammar_based import GrammarBasedStrategy
from ...errors import XWQueryValueError
from ...defs import QueryMode, QueryTrait
from exonware.xwnode.base import ANode


class PowerFxStrategy(GrammarBasedStrategy, ADocumentQueryStrategy):
    """PowerFx query strategy for Power Platform formula language operations."""

    def __init__(self, **options):
        GrammarBasedStrategy.__init__(self, 'powerfx', **options)
        super().__init__(**options)
        self._mode = QueryMode.AUTO
        self._traits = QueryTrait.DOCUMENT | QueryTrait.STRUCTURED | QueryTrait.TRANSACTIONAL

    def execute(self, query: str, **kwargs) -> Any:
        """Execute PowerFx query."""
        if not self.validate_query(query):
            raise XWQueryValueError(f"Invalid PowerFx query: {query}")
        return {"result": "PowerFx query executed", "query": query}

    def validate_query(self, query: str) -> bool:
        """Validate PowerFx query syntax."""
        if not query or not isinstance(query, str):
            return False
        query_stripped = query.strip()
        # PowerFx formulas start with = or can be standalone expressions
        return query_stripped.startswith('=') or any(op in query_stripped for op in ["If", "Sum", "Filter", "LookUp", "("])

    def get_query_plan(self, query: str) -> dict[str, Any]:
        """Get PowerFx query execution plan."""
        return {
            "query_type": "PowerFx",
            "complexity": "MEDIUM",
            "estimated_cost": 100
        }

    def path_query(self, path: str) -> Any:
        """Execute path-based query."""
        return self.execute(f"={path}")

    def filter_query(self, filter_expression: str) -> Any:
        """Execute filter query."""
        return self.execute(f"=Filter(Table, {filter_expression})")

    def projection_query(self, fields: list[str]) -> Any:
        """Execute projection query."""
        return self.execute(f"=Table({{{', '.join(fields)}}})")

    def sort_query(self, sort_fields: list[str], order: str = "asc") -> Any:
        """Execute sort query."""
        sort_func = "SortByColumns" if len(sort_fields) > 1 else "Sort"
        return self.execute(f"={sort_func}(Table, {sort_fields[0]}, {'Ascending' if order == 'asc' else 'Descending'})")

    def limit_query(self, limit: int, offset: int = 0) -> Any:
        """Execute limit query."""
        return self.execute(f"=FirstN(Table, {limit})")
        # to_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)
        # Remove leading = if present
        if query.startswith('='):
            query = query[1:].strip()
        query_upper = query.upper()
        # Parse PowerFx query (function-based)
        entity_name = None
        fields = []
        where_conditions = []
        # Extract table name from function calls
        filter_match = re.search(r'FILTER\s*\(\s*(\w+)', query_upper, re.IGNORECASE)
        if filter_match:
            entity_name = filter_match.group(1)
        else:
            lookup_match = re.search(r'LOOKUP\s*\(\s*(\w+)', query_upper, re.IGNORECASE)
            if lookup_match:
                entity_name = lookup_match.group(1)
            else:
                entity_name = "Table"
        # Extract filter conditions from Filter function
        filter_cond_match = re.search(r'FILTER\s*\([^,]+,\s*(.+?)\)', query_upper, re.IGNORECASE | re.DOTALL)
        if filter_cond_match:
            filter_expr = filter_cond_match.group(1).strip()
            where_conditions.append(filter_expr)
        # Extract column references
        column_matches = re.findall(r'\[(\w+)\]', query)
        fields = list(set(column_matches))[:10]  # Remove duplicates and limit
        # Build actions tree
        children = []
        if entity_name:
            children.append({
                "type": "FROM",
                "id": "powerfx_from_1",
                "content": entity_name,
                "line_number": 1,
                "timestamp": datetime.now().isoformat(),
                "children": []
            })
        if where_conditions:
            where_content = " AND ".join(where_conditions)
            children.append({
                "type": "WHERE",
                "id": "powerfx_where_1",
                "content": where_content,
                "line_number": 1,
                "timestamp": datetime.now().isoformat(),
                "children": []
            })
        select_fields = ", ".join(fields) if fields else "*"
        select_action = {
            "type": "SELECT",
            "id": "powerfx_select_1",
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
                    "source_format": "PowerFx"
                }
            }
        }
        return ANode.from_native(actions)
        # from_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)

#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/query/strategies/jsonata.py
JSONata Query Strategy
This module implements the JSONata query strategy for JSONata (JSON transform language) operations.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.2
Generation Date: January 2, 2025
"""
from typing import Any, Optional
from .base import ADocumentQueryStrategy
from .grammar_based import GrammarBasedStrategy
from ...errors import XWQueryValueError
from ...defs import QueryMode, QueryTrait
from exonware.xwnode.base import ANode
class JSONataStrategy(GrammarBasedStrategy, ADocumentQueryStrategy):
    """JSONata query strategy for JSONata (JSON transform language) operations."""
    def __init__(self, **options):
        GrammarBasedStrategy.__init__(self, 'jsonata', **options)
        super().__init__(**options)
        self._mode = QueryMode.AUTO
        self._traits = QueryTrait.DOCUMENT | QueryTrait.STRUCTURED
    def execute(self, query: str, **kwargs) -> Any:
        """Execute JSONata query."""
        if not self.validate_query(query):
            raise XWQueryValueError(f"Invalid JSONata query: {query}")
        return {"result": "JSONata query executed", "query": query}
    def validate_query(self, query: str) -> bool:
        """Validate JSONata query syntax."""
        if not query or not isinstance(query, str):
            return False
        # JSONata uses path expressions, functions, and transformations
        return any(op in query for op in [".", "[", "(", "$", "@", "=", "!=", ">", "<", "and", "or", "not"])
    def get_query_plan(self, query: str) -> dict[str, Any]:
        """Get JSONata query execution plan."""
        return {
            "query_type": "JSONATA",
            "complexity": "MEDIUM",
            "estimated_cost": 85
        }
    def path_query(self, path: str) -> Any:
        """Execute path-based query."""
        return self.execute(path)
    def filter_query(self, filter_expression: str) -> Any:
        """Execute filter query."""
        return self.execute(f"$filter($, function($v) {{ {filter_expression} }})")
    def projection_query(self, fields: list[str]) -> Any:
        """Execute projection query."""
        fields_obj = "{" + ", ".join([f'"{f}": {f}' for f in fields]) + "}"
        return self.execute(fields_obj)
    def sort_query(self, sort_fields: list[str], order: str = "asc") -> Any:
        """Execute sort query."""
        return self.execute(f"$sort($, function($a, $b) {{ $a.{sort_fields[0]} < $b.{sort_fields[0]} }})")
    def limit_query(self, limit: int, offset: int = 0) -> Any:
        """Execute limit query."""
        if offset > 0:
            return self.execute(f"$slice($, {offset}, {limit})")
        return self.execute(f"$slice($, {limit})")
        # to_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)
        # JSONata queries are path expressions - treat as field selection
        fields = []
        where_conditions = []
        # Simple extraction - JSONata is complex, this is a basic approach
        if '.' in query or '[' in query:
            # Extract field paths
            path_parts = query.split('.')
            if path_parts:
                fields = [query]
        # Build actions tree
        children = []
        if where_conditions:
            where_content = " AND ".join(where_conditions)
            children.append({
                "type": "WHERE",
                "id": "jsonata_where_1",
                "content": where_content,
                "line_number": 1,
                "timestamp": datetime.now().isoformat(),
                "children": []
            })
        select_fields = ", ".join(fields) if fields else "*"
        select_action = {
            "type": "SELECT",
            "id": "jsonata_select_1",
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
                    "source_format": "JSONATA"
                }
            }
        }
        return ANode.from_native(actions)
        # from_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)
            # Simple projection
            if len(fields) == 1:
                return fields[0]
            else:
                fields_obj = "{" + ", ".join([f'"{f}": {f}' for f in fields]) + "}"
                return fields_obj
        return "$"

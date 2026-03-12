#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/query/strategies/jsonnet.py
Jsonnet Query Strategy
This module implements the Jsonnet query strategy for Jsonnet (data templating language) operations.
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
class JsonnetStrategy(GrammarBasedStrategy, ADocumentQueryStrategy):
    """Jsonnet query strategy for Jsonnet (data templating language) operations."""
    def __init__(self, **options):
        GrammarBasedStrategy.__init__(self, 'jsonnet', **options)
        super().__init__(**options)
        self._mode = QueryMode.AUTO
        self._traits = QueryTrait.DOCUMENT | QueryTrait.STRUCTURED
    def execute(self, query: str, **kwargs) -> Any:
        """Execute Jsonnet query."""
        if not self.validate_query(query):
            raise XWQueryValueError(f"Invalid Jsonnet query: {query}")
        return {"result": "Jsonnet query executed", "query": query}
    def validate_query(self, query: str) -> bool:
        """Validate Jsonnet query syntax."""
        if not query or not isinstance(query, str):
            return False
        # Jsonnet uses JSON-like syntax with functions, variables, and imports
        return any(op in query for op in ["{", "}", "[", "]", "local", "function", "import", "::", "+:", "if", "then", "else"])
    def get_query_plan(self, query: str) -> dict[str, Any]:
        """Get Jsonnet query execution plan."""
        return {
            "query_type": "JSONNET",
            "complexity": "MEDIUM",
            "estimated_cost": 90
        }
    def path_query(self, path: str) -> Any:
        """Execute path-based query."""
        return self.execute(f"{{ field: {path} }}")
    def filter_query(self, filter_expression: str) -> Any:
        """Execute filter query."""
        return self.execute(f"[x for x in $ if {filter_expression}]")
    def projection_query(self, fields: list[str]) -> Any:
        """Execute projection query."""
        fields_obj = "{" + ", ".join([f'"{f}": $.{f}' for f in fields]) + "}"
        return self.execute(fields_obj)
    def sort_query(self, sort_fields: list[str], order: str = "asc") -> Any:
        """Execute sort query."""
        return self.execute(f"std.sort($, function(a, b) a.{sort_fields[0]} < b.{sort_fields[0]})")
    def limit_query(self, limit: int, offset: int = 0) -> Any:
        """Execute limit query."""
        return self.execute(f"std.slice($, {offset}, {offset + limit})")
        # to_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)
        # Jsonnet queries are templating expressions - treat as transformation
        fields = []
        where_conditions = []
        # Simple extraction - Jsonnet is complex, this is a basic approach
        if '.' in query or '[' in query:
            # Extract field references
            fields = [query]
        # Build actions tree
        children = []
        if where_conditions:
            where_content = " AND ".join(where_conditions)
            children.append({
                "type": "WHERE",
                "id": "jsonnet_where_1",
                "content": where_content,
                "line_number": 1,
                "timestamp": datetime.now().isoformat(),
                "children": []
            })
        select_fields = ", ".join(fields) if fields else "*"
        select_action = {
            "type": "SELECT",
            "id": "jsonnet_select_1",
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
                    "source_format": "JSONNET"
                }
            }
        }
        return ANode.from_native(actions)
        # from_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)
            # Simple projection
            if len(fields) == 1:
                return f"$.{fields[0]}"
            else:
                fields_obj = "{" + ", ".join([f'"{f}": $.{f}' for f in fields]) + "}"
                return fields_obj
        return "$"

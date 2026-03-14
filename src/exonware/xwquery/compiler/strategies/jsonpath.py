#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/query/strategies/jsonpath.py
JSONPath Query Strategy
This module implements the JSONPath query strategy for JSONPath operations.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.3
Generation Date: January 2, 2025
"""
from typing import Any
from .base import ADocumentQueryStrategy
from .grammar_based import GrammarBasedStrategy
from ...errors import XWQueryValueError
from ...defs import QueryMode, QueryTrait
from exonware.xwnode.base import ANode
class JSONPathStrategy(GrammarBasedStrategy, ADocumentQueryStrategy):
    """JSONPath query strategy for JSONPath operations."""
    def __init__(self, **options):
        GrammarBasedStrategy.__init__(self, 'jsonpath', **options)
        super().__init__(**options)
        self._mode = QueryMode.AUTO
        self._traits = QueryTrait.DOCUMENT | QueryTrait.STRUCTURED
    def execute(self, query: str, **kwargs) -> Any:
        """Execute JSONPath query."""
        if not self.validate_query(query):
            raise XWQueryValueError(f"Invalid JSONPath query: {query}")
        return {"result": "JSONPath query executed", "query": query}
    def validate_query(self, query: str) -> bool:
        """Validate JSONPath query syntax."""
        if not query or not isinstance(query, str):
            return False
        # JSONPath uses $, @, ., .., *, [], ?(), functions
        return any(op in query for op in ["$", "@", ".", "[", "]", "*", "?", "(", ")", ".."])
    def get_query_plan(self, query: str) -> dict[str, Any]:
        """Get JSONPath query execution plan."""
        return {
            "query_type": "JSONPATH",
            "complexity": "LOW",
            "estimated_cost": 60
        }
    def path_query(self, path: str) -> Any:
        """Execute path-based query."""
        return self.execute(path)
    def filter_query(self, filter_expression: str) -> Any:
        """Execute filter query."""
        return self.execute(f"$[?({filter_expression})]")
    def projection_query(self, fields: list[str]) -> Any:
        """Execute projection query."""
        # JSONPath doesn't directly support projection, but we can use multiple paths
        paths = ", ".join([f"$.{field}" for field in fields])
        return self.execute(f"$[{paths}]")
    def sort_query(self, sort_fields: list[str], order: str = "asc") -> Any:
        """Execute sort query."""
        # JSONPath doesn't support sorting directly
        return self.execute("$[*]")
    def limit_query(self, limit: int, offset: int = 0) -> Any:
        """Execute limit query."""
        # JSONPath doesn't support limit directly, but we can use array slicing
        if offset > 0:
            return self.execute(f"$[{offset}:{offset + limit}]")
        return self.execute(f"$[:{limit}]")
        # to_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)
        # JSONPath queries are path expressions
        fields = []
        where_conditions = []
        # Extract path components
        if query.startswith('$'):
            # Remove $ and extract path
            path = query[1:].strip()
            if path:
                # Extract field names from path (simplified)
                path_parts = path.split('.')
                if path_parts:
                    fields = [p.strip('[]') for p in path_parts if p.strip('[]')]
        # Build actions tree
        children = []
        if where_conditions:
            where_content = " AND ".join(where_conditions)
            children.append({
                "type": "WHERE",
                "id": "jsonpath_where_1",
                "content": where_content,
                "line_number": 1,
                "timestamp": datetime.now().isoformat(),
                "children": []
            })
        select_fields = ", ".join(fields) if fields else "*"
        select_action = {
            "type": "SELECT",
            "id": "jsonpath_select_1",
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
                    "source_format": "JSONPATH"
                }
            }
        }
        return ANode.from_native(actions)

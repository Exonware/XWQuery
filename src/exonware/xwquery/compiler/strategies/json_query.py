#!/usr/bin/env python3
"""
JSON Query Strategy
This module implements the JSON Query strategy for generic JSON operations.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.1
Generation Date: January 2, 2025
"""

from typing import Any, Optional
from .base import ADocumentQueryStrategy
from .grammar_based import GrammarBasedStrategy
from ...errors import XWQueryValueError
from ...defs import QueryMode, QueryTrait
from exonware.xwnode.base import ANode


class JSONQueryStrategy(GrammarBasedStrategy, ADocumentQueryStrategy):
    """JSON Query strategy for generic JSON operations."""

    def __init__(self, **options):
        GrammarBasedStrategy.__init__(self, 'jsonquery', **options)
        super().__init__(**options)
        self._mode = QueryMode.AUTO
        self._traits = QueryTrait.DOCUMENT | QueryTrait.STRUCTURED | QueryTrait.ANALYTICAL

    def execute(self, query: str, **kwargs) -> Any:
        """Execute JSON query."""
        if not self.validate_query(query):
            raise XWQueryValueError(f"Invalid JSON query: {query}")
        return {"result": "JSON query executed", "query": query}

    def validate_query(self, query: str) -> bool:
        """Validate JSON query syntax."""
        if not query or not isinstance(query, str):
            return False
        return any(op in query for op in ["$", ".", "[", "]", "?", ":", "{", "}"])

    def get_query_plan(self, query: str) -> dict[str, Any]:
        """Get JSON query execution plan."""
        return {
            "query_type": "JSON_QUERY",
            "complexity": "MEDIUM",
            "estimated_cost": 50
        }

    def path_query(self, path: str) -> Any:
        """Execute path-based query."""
        return self.execute(f"$.{path}")

    def filter_query(self, filter_expression: str) -> Any:
        """Execute filter query."""
        return self.execute(f"$[?{filter_expression}]")

    def projection_query(self, fields: list[str]) -> Any:
        """Execute projection query."""
        return self.execute(f"$[{', '.join(fields)}]")

    def sort_query(self, sort_fields: list[str], order: str = "asc") -> Any:
        """Execute sort query."""
        return self.execute(f"$[sort by {sort_fields[0]}]")

    def limit_query(self, limit: int, offset: int = 0) -> Any:
        """Execute limit query."""
        return self.execute(f"$[{offset}:{offset + limit}]")
        # to_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)
        # Extract fields (path segments after $.)
        fields = []
        if '$.' in query:
            path_part = query.split('$.')[1] if '$.' in query else query.lstrip('$')
            path_part = path_part.split('[')[0].split('?')[0]
            if '.' in path_part:
                fields = [f.strip() for f in path_part.split('.') if f.strip()]
            elif path_part:
                fields = [path_part]
        # Extract WHERE conditions (filter expressions like [?condition])
        where_conditions = []
        filter_match = re.search(r'\[\?([^\]]+)\]', query)
        if filter_match:
            filter_expr = filter_match.group(1)
            where_conditions.append(filter_expr)
        # Build actions tree
        children = []
        if where_conditions:
            where_content = " AND ".join(where_conditions)
            children.append({
                "type": "WHERE",
                "id": "json_query_where_1",
                "content": where_content,
                "line_number": 1,
                "timestamp": datetime.now().isoformat(),
                "children": []
            })
        select_fields = ", ".join(fields) if fields else "*"
        select_action = {
            "type": "SELECT",
            "id": "json_query_select_1",
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
                    "source_format": "JSON_QUERY"
                }
            }
        }
        return ANode.from_native(actions)
        # from_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)
        # Extract fields
        select_content = stmt.get('content', '')
        fields = []
        if 'SELECT' in select_content.upper():
            fields_part = select_content.upper().replace('SELECT', '', 1).strip()
            if fields_part and fields_part != '*':
                fields = [f.strip() for f in fields_part.split(',') if f.strip()]
        # Extract WHERE conditions
        where_conditions = []
        for child in children:
            child_type = child.get('type', '')
            child_content = child.get('content', '')
            if child_type == 'WHERE':
                where_conditions.append(child_content)
        # Build JSON query
        if fields:
            json_query = "$." + ".".join(fields)
        else:
            json_query = "$"
        if where_conditions:
            filter_expr = ' AND '.join(where_conditions)
            json_query = f"$[?{filter_expr}]"
        return json_query

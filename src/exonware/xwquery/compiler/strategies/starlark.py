#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/query/strategies/starlark.py
Starlark Query Strategy
This module implements the Starlark query strategy for Starlark (Bazel-like) operations.
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


class StarlarkStrategy(GrammarBasedStrategy, ADocumentQueryStrategy):
    """Starlark query strategy for Starlark (Bazel-like) operations."""

    def __init__(self, **options):
        GrammarBasedStrategy.__init__(self, 'starlark', **options)
        super().__init__(**options)
        self._mode = QueryMode.AUTO
        self._traits = QueryTrait.DOCUMENT | QueryTrait.STRUCTURED

    def execute(self, query: str, **kwargs) -> Any:
        """Execute Starlark query."""
        if not self.validate_query(query):
            raise XWQueryValueError(f"Invalid Starlark query: {query}")
        return {"result": "Starlark query executed", "query": query}

    def validate_query(self, query: str) -> bool:
        """Validate Starlark query syntax."""
        if not query or not isinstance(query, str):
            return False
        # Starlark is Python-like syntax
        return any(op in query for op in ["def", "return", "if", "else", "for", "in", "=", "[]", "{}", "load", "("])

    def get_query_plan(self, query: str) -> dict[str, Any]:
        """Get Starlark query execution plan."""
        return {
            "query_type": "STARLARK",
            "complexity": "MEDIUM",
            "estimated_cost": 85
        }

    def path_query(self, path: str) -> Any:
        """Execute path-based query."""
        return self.execute(f"data['{path}']")

    def filter_query(self, filter_expression: str) -> Any:
        """Execute filter query."""
        return self.execute(f"[x for x in data if {filter_expression}]")

    def projection_query(self, fields: list[str]) -> Any:
        """Execute projection query."""
        fields_code = ", ".join([f"'{f}': data['{f}']" for f in fields])
        return self.execute(f"{{{fields_code}}}")

    def sort_query(self, sort_fields: list[str], order: str = "asc") -> Any:
        """Execute sort query."""
        return self.execute(f"sorted(data, key=lambda x: x['{sort_fields[0]}'])")

    def limit_query(self, limit: int, offset: int = 0) -> Any:
        """Execute limit query."""
        return self.execute(f"data[{offset}:{offset + limit}]")
        # to_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)
        # Extract data['field'] references
        import re
        data_matches = re.findall(r"data\['([^']+)'\]", query)
        if data_matches:
            fields = data_matches
        select_fields = ", ".join(fields) if fields else "*"
        select_action = {
            "type": "SELECT",
            "id": "starlark_select_1",
            "content": f"SELECT {select_fields}",
            "line_number": 1,
            "timestamp": datetime.now().isoformat(),
            "children": []
        }
        actions = {
            "root": {
                "type": "PROGRAM",
                "statements": [select_action],
                "comments": [],
                "metadata": {
                    "version": "1.0",
                    "created": datetime.now().isoformat(),
                    "source_format": "STARLARK"
                }
            }
        }
        return ANode.from_native(actions)
        # from_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)

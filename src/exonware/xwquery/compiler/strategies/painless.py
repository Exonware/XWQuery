#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/query/strategies/painless.py
Painless Query Strategy
This module implements the Painless query strategy for Elasticsearch scripting language operations.
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


class PainlessStrategy(GrammarBasedStrategy, ADocumentQueryStrategy):
    """Painless query strategy for Elasticsearch scripting language operations."""

    def __init__(self, **options):
        GrammarBasedStrategy.__init__(self, 'painless', **options)
        super().__init__(**options)
        self._mode = QueryMode.AUTO
        self._traits = QueryTrait.DOCUMENT | QueryTrait.STRUCTURED

    def execute(self, query: str, **kwargs) -> Any:
        """Execute Painless query."""
        if not self.validate_query(query):
            raise XWQueryValueError(f"Invalid Painless query: {query}")
        return {"result": "Painless query executed", "query": query}

    def validate_query(self, query: str) -> bool:
        """Validate Painless query syntax."""
        if not query or not isinstance(query, str):
            return False
        # Painless is Java-like scripting language
        return any(op in query for op in ["def", "return", "if", "else", "for", "while", "doc[", "params[", ".value", ".size()"])

    def get_query_plan(self, query: str) -> dict[str, Any]:
        """Get Painless query execution plan."""
        return {
            "query_type": "PAINLESS",
            "complexity": "MEDIUM",
            "estimated_cost": 90
        }

    def path_query(self, path: str) -> Any:
        """Execute path-based query."""
        return self.execute(f"doc['{path}'].value")

    def filter_query(self, filter_expression: str) -> Any:
        """Execute filter query."""
        return self.execute(f"if ({filter_expression}) {{ return true; }} else {{ return false; }}")

    def projection_query(self, fields: list[str]) -> Any:
        """Execute projection query."""
        fields_code = ", ".join([f"doc['{f}'].value" for f in fields])
        return self.execute(f"def result = [{fields_code}]; return result;")

    def sort_query(self, sort_fields: list[str], order: str = "asc") -> Any:
        """Execute sort query."""
        return self.execute(f"doc['{sort_fields[0]}'].value")

    def limit_query(self, limit: int, offset: int = 0) -> Any:
        """Execute limit query."""
        return self.execute(f"return {limit};")
        # to_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)
        # Extract doc['field'] references
        import re
        doc_matches = re.findall(r"doc\['([^']+)'\]", query)
        if doc_matches:
            fields = doc_matches
        select_fields = ", ".join(fields) if fields else "*"
        select_action = {
            "type": "SELECT",
            "id": "painless_select_1",
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
                    "source_format": "PAINLESS"
                }
            }
        }
        return ANode.from_native(actions)
        # from_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)

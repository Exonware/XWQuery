#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/query/strategies/sed.py
sed Query Strategy
This module implements the sed query strategy for sed (stream editing scripts) operations.
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


class SedStrategy(GrammarBasedStrategy, ADocumentQueryStrategy):
    """sed query strategy for sed (stream editing scripts) operations."""

    def __init__(self, **options):
        GrammarBasedStrategy.__init__(self, 'sed', **options)
        super().__init__(**options)
        self._mode = QueryMode.AUTO
        self._traits = QueryTrait.DOCUMENT | QueryTrait.STRUCTURED

    def execute(self, query: str, **kwargs) -> Any:
        """Execute sed query."""
        if not self.validate_query(query):
            raise XWQueryValueError(f"Invalid sed query: {query}")
        return {"result": "sed query executed", "query": query}

    def validate_query(self, query: str) -> bool:
        """Validate sed query syntax."""
        if not query or not isinstance(query, str):
            return False
        # sed uses addresses and commands
        return any(op in query for op in ["s/", "d", "p", "a", "i", "c", "y/", "/", "!", "$", "^", "g", "i"])

    def get_query_plan(self, query: str) -> dict[str, Any]:
        """Get sed query execution plan."""
        return {
            "query_type": "SED",
            "complexity": "LOW",
            "estimated_cost": 50
        }

    def path_query(self, path: str) -> Any:
        """Execute path-based query."""
        return self.execute(f"s/{path}/&/p")

    def filter_query(self, filter_expression: str) -> Any:
        """Execute filter query."""
        return self.execute(f"/{filter_expression}/p")

    def projection_query(self, fields: list[str]) -> Any:
        """Execute projection query."""
        return self.execute(f"s/.*/{fields[0]}/p")

    def sort_query(self, sort_fields: list[str], order: str = "asc") -> Any:
        """Execute sort query."""
        return self.execute("p")

    def limit_query(self, limit: int, offset: int = 0) -> Any:
        """Execute limit query."""
        return self.execute(f"{offset},{offset + limit}p")
        # to_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)
        # Extract pattern from s/pattern/replacement/
        import re
        pattern_match = re.search(r's/([^/]+)/', query)
        if pattern_match:
            fields = [pattern_match.group(1)]
        select_fields = ", ".join(fields) if fields else "*"
        select_action = {
            "type": "SELECT",
            "id": "sed_select_1",
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
                    "source_format": "SED"
                }
            }
        }
        return ANode.from_native(actions)
        # from_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)

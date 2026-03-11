#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/query/strategies/nifi_el.py
Apache NiFi Expression Language Query Strategy
This module implements the Apache NiFi Expression Language query strategy for NiFi EL operations.
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


class NiFiELStrategy(GrammarBasedStrategy, ADocumentQueryStrategy):
    """Apache NiFi Expression Language query strategy for NiFi EL operations."""

    def __init__(self, **options):
        GrammarBasedStrategy.__init__(self, 'nifiel', **options)
        super().__init__(**options)
        self._mode = QueryMode.AUTO
        self._traits = QueryTrait.DOCUMENT | QueryTrait.STRUCTURED

    def execute(self, query: str, **kwargs) -> Any:
        """Execute NiFi EL query."""
        if not self.validate_query(query):
            raise XWQueryValueError(f"Invalid NiFi EL query: {query}")
        return {"result": "NiFi EL query executed", "query": query}

    def validate_query(self, query: str) -> bool:
        """Validate NiFi EL query syntax."""
        if not query or not isinstance(query, str):
            return False
        # NiFi EL uses ${...} expressions with functions and attributes
        return any(op in query for op in ["${", "}", ".", ":", "(", ")", "isEmpty", "toUpper", "toLower", "substring", "replace", "matches"])

    def get_query_plan(self, query: str) -> dict[str, Any]:
        """Get NiFi EL query execution plan."""
        return {
            "query_type": "NIFI_EL",
            "complexity": "LOW",
            "estimated_cost": 60
        }

    def path_query(self, path: str) -> Any:
        """Execute path-based query."""
        return self.execute(f"${{{path}}}")

    def filter_query(self, filter_expression: str) -> Any:
        """Execute filter query."""
        return self.execute(f"${{literal('{filter_expression}')}}")

    def projection_query(self, fields: list[str]) -> Any:
        """Execute projection query."""
        return self.execute("${" + ", ".join([f"{f}" for f in fields]) + "}")

    def sort_query(self, sort_fields: list[str], order: str = "asc") -> Any:
        """Execute sort query."""
        return self.execute(f"${{toUpper('{sort_fields[0]}')}}")

    def limit_query(self, limit: int, offset: int = 0) -> Any:
        """Execute limit query."""
        return self.execute(f"${{literal({limit})}}")
        # to_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)
        # Extract ${...} expressions
        import re
        expr_matches = re.findall(r'\$\{([^}]+)\}', query)
        if expr_matches:
            fields = expr_matches
        select_fields = ", ".join(fields) if fields else "*"
        select_action = {
            "type": "SELECT",
            "id": "nifi_el_select_1",
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
                    "source_format": "NIFI_EL"
                }
            }
        }
        return ANode.from_native(actions)
        # from_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)

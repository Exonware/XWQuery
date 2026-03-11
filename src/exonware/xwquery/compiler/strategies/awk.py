#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/query/strategies/awk.py
AWK Query Strategy
This module implements the AWK query strategy for AWK (text/data stream processing) operations.
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


class AWKStrategy(GrammarBasedStrategy, ADocumentQueryStrategy):
    """AWK query strategy for AWK (text/data stream processing) operations."""

    def __init__(self, **options):
        GrammarBasedStrategy.__init__(self, 'awk', **options)
        super().__init__(**options)
        self._mode = QueryMode.AUTO
        self._traits = QueryTrait.DOCUMENT | QueryTrait.STRUCTURED

    def execute(self, query: str, **kwargs) -> Any:
        """Execute AWK query."""
        if not self.validate_query(query):
            raise XWQueryValueError(f"Invalid AWK query: {query}")
        return {"result": "AWK query executed", "query": query}

    def validate_query(self, query: str) -> bool:
        """Validate AWK query syntax."""
        if not query or not isinstance(query, str):
            return False
        # AWK uses patterns and actions
        return any(op in query for op in ["BEGIN", "END", "{", "}", "print", "$", "NF", "NR", "if", "for", "while", "/", "~", "!~"])

    def get_query_plan(self, query: str) -> dict[str, Any]:
        """Get AWK query execution plan."""
        return {
            "query_type": "AWK",
            "complexity": "LOW",
            "estimated_cost": 55
        }

    def path_query(self, path: str) -> Any:
        """Execute path-based query."""
        return self.execute(f"{{ print ${path} }}")

    def filter_query(self, filter_expression: str) -> Any:
        """Execute filter query."""
        return self.execute(f"{filter_expression} {{ print $0 }}")

    def projection_query(self, fields: list[str]) -> Any:
        """Execute projection query."""
        fields_code = ", ".join([f"${f}" for f in fields])
        return self.execute(f"{{ print {fields_code} }}")

    def sort_query(self, sort_fields: list[str], order: str = "asc") -> Any:
        """Execute sort query."""
        return self.execute(f"{{ print ${sort_fields[0]} }}")

    def limit_query(self, limit: int, offset: int = 0) -> Any:
        """Execute limit query."""
        return self.execute(f"NR > {offset} && NR <= {offset + limit} {{ print $0 }}")
        # to_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)
        # Extract $N field references
        import re
        field_matches = re.findall(r'\$(\d+)', query)
        if field_matches:
            fields = field_matches
        select_fields = ", ".join(fields) if fields else "*"
        select_action = {
            "type": "SELECT",
            "id": "awk_select_1",
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
                    "source_format": "AWK"
                }
            }
        }
        return ANode.from_native(actions)
        # from_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)

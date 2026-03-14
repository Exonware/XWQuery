#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/query/strategies/fluent_bit.py
Fluent Bit Query Strategy
This module implements the Fluent Bit query strategy for Fluent Bit filter/record modifier DSL operations.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.5
Generation Date: January 2, 2025
"""

from typing import Any
from .base import ADocumentQueryStrategy
from .grammar_based import GrammarBasedStrategy
from ...errors import XWQueryValueError
from ...defs import QueryMode, QueryTrait
from exonware.xwnode.base import ANode


class FluentBitStrategy(GrammarBasedStrategy, ADocumentQueryStrategy):
    """Fluent Bit query strategy for Fluent Bit filter/record modifier DSL operations."""

    def __init__(self, **options):
        GrammarBasedStrategy.__init__(self, 'fluentbit', **options)
        super().__init__(**options)
        self._mode = QueryMode.AUTO
        self._traits = QueryTrait.DOCUMENT | QueryTrait.STRUCTURED

    def execute(self, query: str, **kwargs) -> Any:
        """Execute Fluent Bit query."""
        if not self.validate_query(query):
            raise XWQueryValueError(f"Invalid Fluent Bit query: {query}")
        return {"result": "Fluent Bit query executed", "query": query}

    def validate_query(self, query: str) -> bool:
        """Validate Fluent Bit query syntax."""
        if not query or not isinstance(query, str):
            return False
        # Fluent Bit uses [FILTER] sections with plugins
        return any(op in query for op in ["[FILTER]", "[INPUT]", "[OUTPUT]", "Name", "Match", "Modify", "Record", "Add", "Rename"])

    def get_query_plan(self, query: str) -> dict[str, Any]:
        """Get Fluent Bit query execution plan."""
        return {
            "query_type": "FLUENT_BIT",
            "complexity": "LOW",
            "estimated_cost": 65
        }

    def path_query(self, path: str) -> Any:
        """Execute path-based query."""
        return self.execute(f"[FILTER]\n    Name modify\n    Match *\n    Add {path} value")

    def filter_query(self, filter_expression: str) -> Any:
        """Execute filter query."""
        return self.execute(f"[FILTER]\n    Name modify\n    Match *\n    Condition {filter_expression}")

    def projection_query(self, fields: list[str]) -> Any:
        """Execute projection query."""
        fields_block = "\n    ".join([f"Rename {f} {f}" for f in fields])
        return self.execute(f"[FILTER]\n    Name modify\n    Match *\n    {fields_block}")

    def sort_query(self, sort_fields: list[str], order: str = "asc") -> Any:
        """Execute sort query."""
        return self.execute(f"[FILTER]\n    Name modify\n    Match *\n    Add sort_field {sort_fields[0]}")

    def limit_query(self, limit: int, offset: int = 0) -> Any:
        """Execute limit query."""
        return self.execute(f"[FILTER]\n    Name modify\n    Match *")
        # to_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)
        # from_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)

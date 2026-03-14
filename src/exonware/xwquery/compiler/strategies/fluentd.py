#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/query/strategies/fluentd.py
Fluentd Query Strategy
This module implements the Fluentd query strategy for Fluentd filter DSL operations.
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


class FluentdStrategy(GrammarBasedStrategy, ADocumentQueryStrategy):
    """Fluentd query strategy for Fluentd filter DSL operations."""

    def __init__(self, **options):
        GrammarBasedStrategy.__init__(self, 'fluentd', **options)
        super().__init__(**options)
        self._mode = QueryMode.AUTO
        self._traits = QueryTrait.DOCUMENT | QueryTrait.STRUCTURED

    def execute(self, query: str, **kwargs) -> Any:
        """Execute Fluentd query."""
        if not self.validate_query(query):
            raise XWQueryValueError(f"Invalid Fluentd query: {query}")
        return {"result": "Fluentd query executed", "query": query}

    def validate_query(self, query: str) -> bool:
        """Validate Fluentd query syntax."""
        if not query or not isinstance(query, str):
            return False
        # Fluentd uses <filter>, <match>, <source>, <store> directives
        return any(op in query for op in ["<filter", "<match", "<source", "<store", "type", "tag", "format", "@type"])

    def get_query_plan(self, query: str) -> dict[str, Any]:
        """Get Fluentd query execution plan."""
        return {
            "query_type": "FLUENTD",
            "complexity": "LOW",
            "estimated_cost": 70
        }

    def path_query(self, path: str) -> Any:
        """Execute path-based query."""
        return self.execute(f"<filter {path}>\n  @type record_transformer\n  <record>\n    field value\n  </record>\n</filter>")

    def filter_query(self, filter_expression: str) -> Any:
        """Execute filter query."""
        return self.execute(f"<filter **>\n  @type grep\n  <exclude>\n    key message\n    pattern /{filter_expression}/\n  </exclude>\n</filter>")

    def projection_query(self, fields: list[str]) -> Any:
        """Execute projection query."""
        fields_block = "\n    ".join([f"{f} ${f}" for f in fields])
        return self.execute(f"<filter **>\n  @type record_transformer\n  <record>\n    {fields_block}\n  </record>\n</filter>")

    def sort_query(self, sort_fields: list[str], order: str = "asc") -> Any:
        """Execute sort query."""
        return self.execute(f"<filter **>\n  @type record_transformer\n  <record>\n    sort_field ${sort_fields[0]}\n  </record>\n</filter>")

    def limit_query(self, limit: int, offset: int = 0) -> Any:
        """Execute limit query."""
        return self.execute(f"<filter **>\n  @type record_transformer\n</filter>")
        # to_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)
        # from_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)

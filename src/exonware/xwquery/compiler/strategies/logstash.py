#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/query/strategies/logstash.py
Logstash Query Strategy
This module implements the Logstash query strategy for Logstash config language (pipeline/filter DSL) operations.
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


class LogstashStrategy(GrammarBasedStrategy, ADocumentQueryStrategy):
    """Logstash query strategy for Logstash config language (pipeline/filter DSL) operations."""

    def __init__(self, **options):
        GrammarBasedStrategy.__init__(self, 'logstash', **options)
        super().__init__(**options)
        self._mode = QueryMode.AUTO
        self._traits = QueryTrait.DOCUMENT | QueryTrait.STRUCTURED

    def execute(self, query: str, **kwargs) -> Any:
        """Execute Logstash query."""
        if not self.validate_query(query):
            raise XWQueryValueError(f"Invalid Logstash query: {query}")
        return {"result": "Logstash query executed", "query": query}

    def validate_query(self, query: str) -> bool:
        """Validate Logstash query syntax."""
        if not query or not isinstance(query, str):
            return False
        # Logstash uses input, filter, output blocks with plugins
        return any(op in query for op in ["input", "filter", "output", "{", "}", "grok", "mutate", "date", "json", "if", "else"])

    def get_query_plan(self, query: str) -> dict[str, Any]:
        """Get Logstash query execution plan."""
        return {
            "query_type": "LOGSTASH",
            "complexity": "MEDIUM",
            "estimated_cost": 85
        }

    def path_query(self, path: str) -> Any:
        """Execute path-based query."""
        return self.execute(f"filter {{\n  grok {{\n    match => {{ \"message\" => \"{path}\" }}\n  }}\n}}")

    def filter_query(self, filter_expression: str) -> Any:
        """Execute filter query."""
        return self.execute(f"filter {{\n  if {filter_expression} {{\n    mutate {{ add_field => {{ \"matched\" => \"true\" }} }}\n  }}\n}}")

    def projection_query(self, fields: list[str]) -> Any:
        """Execute projection query."""
        fields_block = "\n".join([f'    {f} => "%{{{f}}}"' for f in fields])
        return self.execute(f"filter {{\n  mutate {{\n{fields_block}\n  }}\n}}")

    def sort_query(self, sort_fields: list[str], order: str = "asc") -> Any:
        """Execute sort query."""
        return self.execute(f"filter {{\n  mutate {{\n    add_field => {{ \"sort_field\" => \"%{{{sort_fields[0]}}}\" }}\n  }}\n}}")

    def limit_query(self, limit: int, offset: int = 0) -> Any:
        """Execute limit query."""
        return self.execute(f"filter {{\n  if [@metadata][_index] > {offset} and [@metadata][_index] <= {offset + limit} {{\n  }}\n}}")
        # to_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)
        # Simple extraction
        if 'filter' in query.lower():
            fields = ["filter"]
        select_fields = ", ".join(fields) if fields else "*"
        select_action = {
            "type": "SELECT",
            "id": "logstash_select_1",
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
                    "source_format": "LOGSTASH"
                }
            }
        }
        return ANode.from_native(actions)
        # from_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)

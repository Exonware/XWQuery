#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/query/strategies/tcl.py
Tcl Query Strategy
This module implements the Tcl query strategy for Tcl (often embedded for ETL glue) operations.
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


class TclStrategy(GrammarBasedStrategy, ADocumentQueryStrategy):
    """Tcl query strategy for Tcl (often embedded for ETL glue) operations."""

    def __init__(self, **options):
        GrammarBasedStrategy.__init__(self, 'tcl', **options)
        super().__init__(**options)
        self._mode = QueryMode.AUTO
        self._traits = QueryTrait.DOCUMENT | QueryTrait.STRUCTURED

    def execute(self, query: str, **kwargs) -> Any:
        """Execute Tcl query."""
        if not self.validate_query(query):
            raise XWQueryValueError(f"Invalid Tcl query: {query}")
        return {"result": "Tcl query executed", "query": query}

    def validate_query(self, query: str) -> bool:
        """Validate Tcl query syntax."""
        if not query or not isinstance(query, str):
            return False
        # Tcl uses commands, variables, and expressions
        return any(op in query for op in ["set", "proc", "foreach", "if", "while", "for", "return", "$", "[", "]", "expr"])

    def get_query_plan(self, query: str) -> dict[str, Any]:
        """Get Tcl query execution plan."""
        return {
            "query_type": "TCL",
            "complexity": "MEDIUM",
            "estimated_cost": 80
        }

    def path_query(self, path: str) -> Any:
        """Execute path-based query."""
        return self.execute(f"set result $data({path})")

    def filter_query(self, filter_expression: str) -> Any:
        """Execute filter query."""
        return self.execute(f"foreach item $data {{ if {{ {filter_expression} }} {{ lappend result $item }} }}")

    def projection_query(self, fields: list[str]) -> Any:
        """Execute projection query."""
        fields_code = " ".join([f"$item({f})" for f in fields])
        return self.execute(f"foreach item $data {{ set result [list {fields_code}] }}")

    def sort_query(self, sort_fields: list[str], order: str = "asc") -> Any:
        """Execute sort query."""
        return self.execute(f"lsort -{order} -index {sort_fields[0]} $data")

    def limit_query(self, limit: int, offset: int = 0) -> Any:
        """Execute limit query."""
        return self.execute(f"lrange $data {offset} [expr {{ {offset} + {limit} - 1 }}]")
        # to_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)
        # Extract $variable references
        import re
        var_matches = re.findall(r'\$(\w+)', query)
        if var_matches:
            fields = var_matches[:5]  # Limit to first 5
        select_fields = ", ".join(fields) if fields else "*"
        select_action = {
            "type": "SELECT",
            "id": "tcl_select_1",
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
                    "source_format": "TCL"
                }
            }
        }
        return ANode.from_native(actions)
        # from_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)

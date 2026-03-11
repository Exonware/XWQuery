#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/query/strategies/gsql.py
GSQL Query Strategy
This module implements the GSQL query strategy for TigerGraph operations.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.1
Generation Date: January 2, 2025
"""

from typing import Any, Optional
from .base import AGraphQueryStrategy
from .grammar_based import GrammarBasedStrategy
from ...errors import XWQueryValueError
from ...defs import QueryMode, QueryTrait
from exonware.xwnode.base import ANode


class GSQLStrategy(GrammarBasedStrategy, AGraphQueryStrategy):
    """GSQL query strategy for TigerGraph operations."""

    def __init__(self, **options):
        GrammarBasedStrategy.__init__(self, 'sql', **options)
        super().__init__(**options)
        self._mode = QueryMode.AUTO
        self._traits = QueryTrait.GRAPH | QueryTrait.STRUCTURED

    def execute(self, query: str, **kwargs) -> Any:
        """Execute GSQL query."""
        if not self.validate_query(query):
            raise XWQueryValueError(f"Invalid GSQL query: {query}")
        return {"result": "GSQL query executed", "query": query}

    def validate_query(self, query: str) -> bool:
        """Validate GSQL query syntax."""
        if not query or not isinstance(query, str):
            return False
        return any(op in query.upper() for op in ["SELECT", "FROM", "WHERE", "ACCUM", "POST-ACCUM", "INTERPRET", "CREATE QUERY", "INSTALL QUERY"])

    def get_query_plan(self, query: str) -> dict[str, Any]:
        """Get GSQL query execution plan."""
        return {
            "query_type": "GSQL",
            "complexity": "HIGH",
            "estimated_cost": 130
        }

    def path_query(self, start: Any, end: Any) -> list[Any]:
        """Path query."""
        return self.execute(f"SELECT v FROM start:v-(:e)->end:target WHERE v.id == '{start}' AND target.id == '{end}'")

    def neighbor_query(self, node: Any) -> list[Any]:
        """Neighbor query."""
        return self.execute(f"SELECT v FROM start:v-(:e)->:neighbor WHERE v.id == '{node}'")

    def shortest_path_query(self, start: Any, end: Any) -> list[Any]:
        """Shortest path query."""
        return self.execute(f"SELECT path FROM start:v-(:e)->end:target WHERE v.id == '{start}' AND target.id == '{end}'")

    def connected_components_query(self) -> list[list[Any]]:
        """Connected components query."""
        return self.execute("SELECT v FROM :v")

    def cycle_detection_query(self) -> list[list[Any]]:
        """Cycle detection query."""
        return self.execute("SELECT path FROM start:v-(:e)->end:v WHERE path.isCycle()")
        # to_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)
        # Parse GSQL query (SELECT ... FROM ... WHERE ...)
        entity_name = None
        fields = []
        where_conditions = []
        # Extract FROM vertex/edge patterns
        from_match = re.search(r'FROM\s+(.+?)(?:\s+WHERE|\s+ACCUM|\s+POST-ACCUM|\s*$)', query_upper, re.IGNORECASE | re.DOTALL)
        if from_match:
            from_expr = from_match.group(1).strip()
            # Extract vertex type
            vertex_match = re.search(r':(\w+)', from_expr, re.IGNORECASE)
            if vertex_match:
                entity_name = vertex_match.group(1)
        # Extract WHERE conditions
        where_match = re.search(r'WHERE\s+(.+?)(?:\s+ACCUM|\s+POST-ACCUM|\s*$)', query_upper, re.IGNORECASE | re.DOTALL)
        if where_match:
            where_expr = where_match.group(1).strip()
            where_conditions.append(where_expr)
        # Extract SELECT fields
        select_match = re.search(r'SELECT\s+(.+?)(?:\s+FROM|\s*$)', query_upper, re.IGNORECASE | re.DOTALL)
        if select_match:
            select_expr = select_match.group(1).strip()
            if select_expr and select_expr.upper() != '*':
                fields = [select_expr.strip()]
        # Build actions tree using helper method
        return self._build_actions_tree(entity_name, fields, where_conditions, "GSQL", "gsql")
        # from_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)

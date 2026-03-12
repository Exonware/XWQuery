#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/query/strategies/ngql.py
nGQL Query Strategy
This module implements the nGQL query strategy for NebulaGraph operations.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.2
Generation Date: January 2, 2025
"""

from typing import Any, Optional
from .base import AGraphQueryStrategy
from .grammar_based import GrammarBasedStrategy
from ...errors import XWQueryValueError
from ...defs import QueryMode, QueryTrait
from exonware.xwnode.base import ANode


class nGQLStrategy(GrammarBasedStrategy, AGraphQueryStrategy):
    """nGQL query strategy for NebulaGraph operations."""

    def __init__(self, **options):
        GrammarBasedStrategy.__init__(self, 'ngql', **options)
        super().__init__(**options)
        self._mode = QueryMode.AUTO
        self._traits = QueryTrait.GRAPH | QueryTrait.STRUCTURED

    def execute(self, query: str, **kwargs) -> Any:
        """Execute nGQL query."""
        if not self.validate_query(query):
            raise XWQueryValueError(f"Invalid nGQL query: {query}")
        return {"result": "nGQL query executed", "query": query}

    def validate_query(self, query: str) -> bool:
        """Validate nGQL query syntax."""
        if not query or not isinstance(query, str):
            return False
        return any(op in query.upper() for op in ["GO", "FETCH", "LOOKUP", "MATCH", "FIND", "WHERE", "RETURN", "YIELD", "CREATE", "INSERT", "UPDATE", "DELETE"])

    def get_query_plan(self, query: str) -> dict[str, Any]:
        """Get nGQL query execution plan."""
        return {
            "query_type": "NGQL",
            "complexity": "MEDIUM",
            "estimated_cost": 105
        }

    def path_query(self, start: Any, end: Any) -> list[Any]:
        """Path query."""
        return self.execute(f"FIND SHORTEST PATH FROM '{start}' TO '{end}' OVER * YIELD path")

    def neighbor_query(self, node: Any) -> list[Any]:
        """Neighbor query."""
        return self.execute(f"GO FROM '{node}' OVER * YIELD dst(edge)")

    def shortest_path_query(self, start: Any, end: Any) -> list[Any]:
        """Shortest path query."""
        return self.execute(f"FIND SHORTEST PATH FROM '{start}' TO '{end}' OVER * YIELD path")

    def connected_components_query(self) -> list[list[Any]]:
        """Connected components query."""
        return self.execute("FETCH PROP ON * hash('vertex')")

    def cycle_detection_query(self) -> list[list[Any]]:
        """Cycle detection query."""
        return self.execute("MATCH (v)-[*2..5]-(v) RETURN v")
        # to_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)
        # Parse nGQL query (GO/FETCH/MATCH ... WHERE ... YIELD/RETURN ...)
        entity_name = None
        fields = []
        where_conditions = []
        # Extract FROM patterns (GO FROM, FETCH PROP ON, MATCH)
        from_match = re.search(r'(?:GO\s+FROM|FETCH\s+PROP\s+ON|MATCH)\s+(\w+)', query_upper, re.IGNORECASE)
        if from_match:
            entity_name = from_match.group(1)
        # Extract WHERE conditions
        where_match = re.search(r'WHERE\s+(.+?)(?:\s+YIELD|\s+RETURN|\s*$)', query_upper, re.IGNORECASE | re.DOTALL)
        if where_match:
            where_expr = where_match.group(1).strip()
            where_conditions.append(where_expr)
        # Extract YIELD/RETURN fields
        yield_match = re.search(r'(?:YIELD|RETURN)\s+(.+?)(?:\s+WHERE|\s*$)', query_upper, re.IGNORECASE | re.DOTALL)
        if yield_match:
            yield_expr = yield_match.group(1).strip()
            if yield_expr and yield_expr.upper() != '*':
                fields = [yield_expr.strip()]
        # Build actions tree using helper method
        return self._build_actions_tree(entity_name, fields, where_conditions, "NGQL", "ngql")
        # from_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)

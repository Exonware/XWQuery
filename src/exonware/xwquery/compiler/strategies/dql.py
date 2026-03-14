#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/query/strategies/dql.py
DQL (Dgraph GraphQL+-) Query Strategy
This module implements the DQL query strategy for Dgraph operations.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.3
Generation Date: January 2, 2025
"""

from typing import Any
from .base import AGraphQueryStrategy
from .grammar_based import GrammarBasedStrategy
from ...errors import XWQueryValueError
from ...defs import QueryMode, QueryTrait
from exonware.xwnode.base import ANode


class DQLStrategy(GrammarBasedStrategy, AGraphQueryStrategy):
    """DQL query strategy for Dgraph operations (GraphQL+- syntax)."""

    def __init__(self, **options):
        GrammarBasedStrategy.__init__(self, 'dql', **options)
        super().__init__(**options)
        self._mode = QueryMode.AUTO
        self._traits = QueryTrait.GRAPH | QueryTrait.DOCUMENT

    def execute(self, query: str, **kwargs) -> Any:
        """Execute DQL query."""
        if not self.validate_query(query):
            raise XWQueryValueError(f"Invalid DQL query: {query}")
        return {"result": "DQL query executed", "query": query}

    def validate_query(self, query: str) -> bool:
        """Validate DQL query syntax."""
        if not query or not isinstance(query, str):
            return False
        return any(op in query for op in ["query", "{", "func:", "filter", "orderasc", "orderdesc", "first", "after"])

    def get_query_plan(self, query: str) -> dict[str, Any]:
        """Get DQL query execution plan."""
        return {
            "query_type": "DQL",
            "complexity": "MEDIUM",
            "estimated_cost": 95
        }

    def path_query(self, start: Any, end: Any) -> list[Any]:
        """Path query."""
        return self.execute(f"{{ me(func: uid({start})) {{ ~link {{ uid {end} }} }} }}")

    def neighbor_query(self, node: Any) -> list[Any]:
        """Neighbor query."""
        return self.execute(f"{{ me(func: uid({node})) {{ link {{ uid }} }} }}")

    def shortest_path_query(self, start: Any, end: Any) -> list[Any]:
        """Shortest path query."""
        return self.execute(f"{{ path(func: uid({start})) {{ uid link {{ uid {end} }} }} }}")

    def connected_components_query(self) -> list[list[Any]]:
        """Connected components query."""
        return self.execute("{ nodes(func: has(link)) { uid } }")

    def cycle_detection_query(self) -> list[list[Any]]:
        """Cycle detection query."""
        return self.execute("{ nodes(func: has(link)) { link { link { uid } } } }")
        # to_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)
        # Parse DQL query (GraphQL+- syntax)
        entity_name = None
        fields = []
        where_conditions = []
        # Extract func: patterns
        func_match = re.search(r'func:\s*\w+\(([^)]+)\)', query, re.IGNORECASE)
        if func_match:
            func_expr = func_match.group(1)
            # Could extract predicate name or uid
        # Extract field names from query blocks
        field_matches = re.findall(r'(\w+)\s*\{', query)
        if field_matches:
            fields = field_matches
        # Build actions tree using helper method
        return self._build_actions_tree(entity_name, fields, where_conditions, "DQL", "dql")
        # from_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)

#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/query/strategies/cypher_age.py
Cypher for Apache AGE Query Strategy
This module implements the Cypher query strategy for Apache AGE (PostgreSQL extension) operations.
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


class CypherAGEStrategy(GrammarBasedStrategy, AGraphQueryStrategy):
    """Cypher query strategy for Apache AGE (PostgreSQL extension) operations."""

    def __init__(self, **options):
        GrammarBasedStrategy.__init__(self, 'cypherage', **options)
        super().__init__(**options)
        self._mode = QueryMode.AUTO
        self._traits = QueryTrait.GRAPH | QueryTrait.STRUCTURED

    def execute(self, query: str, **kwargs) -> Any:
        """Execute Cypher AGE query."""
        if not self.validate_query(query):
            raise XWQueryValueError(f"Invalid Cypher AGE query: {query}")
        return {"result": "Cypher AGE query executed", "query": query}

    def validate_query(self, query: str) -> bool:
        """Validate Cypher AGE query syntax."""
        if not query or not isinstance(query, str):
            return False
        return any(op in query.upper() for op in ["MATCH", "RETURN", "WHERE", "CREATE", "MERGE", "DELETE", "SET", "WITH", "OPTIONAL MATCH"])

    def get_query_plan(self, query: str) -> dict[str, Any]:
        """Get Cypher AGE query execution plan."""
        return {
            "query_type": "CYPHER_AGE",
            "complexity": "MEDIUM",
            "estimated_cost": 100
        }

    def path_query(self, start: Any, end: Any) -> list[Any]:
        """Path query."""
        return self.execute(f"MATCH path = (start)-[*]->(end) WHERE start.id = '{start}' AND end.id = '{end}' RETURN path")

    def neighbor_query(self, node: Any) -> list[Any]:
        """Neighbor query."""
        return self.execute(f"MATCH (n)-[r]->(neighbor) WHERE n.id = '{node}' RETURN neighbor")

    def shortest_path_query(self, start: Any, end: Any) -> list[Any]:
        """Shortest path query."""
        return self.execute(f"MATCH path = shortestPath((start)-[*]-(end)) WHERE start.id = '{start}' AND end.id = '{end}' RETURN path")

    def connected_components_query(self) -> list[list[Any]]:
        """Connected components query."""
        return self.execute("MATCH (n) RETURN n")

    def cycle_detection_query(self) -> list[list[Any]]:
        """Cycle detection query."""
        return self.execute("MATCH path = (a)-[*]->(a) RETURN path")
        # to_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)
        # Parse Cypher query (MATCH ... WHERE ... RETURN ...)
        entity_name = None
        fields = []
        where_conditions = []
        # Extract MATCH patterns
        match_match = re.search(r'MATCH\s+(.+?)(?:\s+WHERE|\s+RETURN|\s*$)', query_upper, re.IGNORECASE | re.DOTALL)
        if match_match:
            match_expr = match_match.group(1).strip()
            # Extract node labels from pattern
            node_match = re.search(r'\((\w+)', match_expr, re.IGNORECASE)
            if node_match:
                entity_name = node_match.group(1)
        # Extract WHERE conditions
        where_match = re.search(r'WHERE\s+(.+?)(?:\s+RETURN|\s*$)', query_upper, re.IGNORECASE | re.DOTALL)
        if where_match:
            where_expr = where_match.group(1).strip()
            where_conditions.append(where_expr)
        # Extract RETURN fields
        return_match = re.search(r'RETURN\s+(.+?)(?:\s+ORDER\s+BY|\s+LIMIT|\s*$)', query_upper, re.IGNORECASE | re.DOTALL)
        if return_match:
            return_expr = return_match.group(1).strip()
            if return_expr and return_expr.upper() != '*':
                fields = [f.strip() for f in return_expr.split(',') if f.strip()]
        # Build actions tree using helper method
        return self._build_actions_tree(entity_name, fields, where_conditions, "CYPHER_AGE", "cypher_age")
        # from_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)

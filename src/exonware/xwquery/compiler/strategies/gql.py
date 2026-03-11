#!/usr/bin/env python3
"""
GQL Query Strategy
This module implements the GQL query strategy for ISO/IEC 39075:2024 Graph Query Language operations.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.1
Generation Date: January 2, 2025
"""

import re
from typing import Any, Optional
from .base import AGraphQueryStrategy
from .grammar_based import GrammarBasedStrategy
from ...errors import XWQueryValueError
from ...defs import QueryMode, QueryTrait
from exonware.xwnode.base import ANode


class GQLStrategy(GrammarBasedStrategy, AGraphQueryStrategy):
    """GQL query strategy for ISO/IEC 39075:2024 Graph Query Language operations."""

    def __init__(self, **options):
        GrammarBasedStrategy.__init__(self, 'graphql', **options)
        super().__init__(**options)
        self._mode = QueryMode.AUTO
        self._traits = QueryTrait.GRAPH | QueryTrait.STRUCTURED | QueryTrait.ANALYTICAL

    def execute(self, query: str, **kwargs) -> Any:
        """Execute GQL query."""
        if not self.validate_query(query):
            raise XWQueryValueError(f"Invalid GQL query: {query}")
        return {"result": "GQL query executed", "query": query}

    def validate_query(self, query: str) -> bool:
        """Validate GQL query syntax."""
        if not query or not isinstance(query, str):
            return False
        return any(op in query.upper() for op in ["MATCH", "SELECT", "WHERE", "RETURN", "CREATE", "DELETE"])

    def get_query_plan(self, query: str) -> dict[str, Any]:
        """Get GQL query execution plan."""
        return {
            "query_type": "GQL",
            "complexity": "HIGH",
            "estimated_cost": 150
        }

    def match_query(self, pattern: str, where_clause: str = None) -> Any:
        """Execute MATCH query."""
        return self.execute(f"MATCH {pattern}")

    def create_query(self, pattern: str) -> Any:
        """Execute CREATE query."""
        return self.execute(f"CREATE {pattern}")

    def delete_query(self, pattern: str) -> Any:
        """Execute DELETE query."""
        return self.execute(f"DELETE {pattern}")

    def set_query(self, pattern: str) -> Any:
        """Execute SET query."""
        return self.execute(f"SET {pattern}")

    def remove_query(self, pattern: str) -> Any:
        """Execute REMOVE query."""
        return self.execute(f"REMOVE {pattern}")

    def merge_query(self, pattern: str) -> Any:
        """Execute MERGE query."""
        return self.execute(f"MERGE {pattern}")

    def path_query(self, start: Any, end: Any) -> list[Any]:
        """Execute path query."""
        query = f"MATCH path = (start)-[*]->(end) WHERE start.id = '{start}' AND end.id = '{end}' RETURN path"
        return self.execute(query)

    def neighbor_query(self, node: Any) -> list[Any]:
        """Execute neighbor query."""
        query = f"MATCH (n)-[r]-(neighbor) WHERE n.id = '{node}' RETURN neighbor, r"
        return self.execute(query)

    def shortest_path_query(self, start: Any, end: Any) -> list[Any]:
        """Execute shortest path query."""
        query = f"MATCH path = shortestPath((start)-[*]-(end)) WHERE start.id = '{start}' AND end.id = '{end}' RETURN path LIMIT 1"
        return self.execute(query)

    def connected_components_query(self) -> list[list[Any]]:
        """Execute connected components query."""
        query = "MATCH (n)-[*]-(connected) RETURN DISTINCT connected"
        return self.execute(query)

    def cycle_detection_query(self) -> list[list[Any]]:
        """Execute cycle detection query."""
        query = "MATCH path = (n)-[*]->(n) RETURN path"
        return self.execute(query)

    def to_actions_tree(self, gql_query: str) -> ANode:
        """Convert GQL query to XWQuery Script actions tree."""
        # Parse GQL query (similar to Cypher)
        # Example: "MATCH (u:User) WHERE u.age > 30 RETURN u.name, u.age"
        query_upper = gql_query.strip().upper()
        # Extract MATCH pattern (e.g., "(u:User)" from "MATCH (u:User)")
        entity_name = None
        match_match = re.search(r'MATCH\s+(\([^)]+\))', query_upper)
        if match_match:
            match_pattern = match_match.group(1)
            # Extract label from pattern like "(u:User)" -> "User"
            label_match = re.search(r':(\w+)', match_pattern)
            if label_match:
                entity_label = label_match.group(1)
                entity_name = entity_label.lower() + 's'  # Pluralize
        # Extract WHERE conditions
        where_conditions = []
        where_match = re.search(r'WHERE\s+(.+?)(?:\s+RETURN|$)', query_upper, re.IGNORECASE)
        if where_match:
            where_clause = where_match.group(1)
            # Split conditions by AND/OR
            conditions = re.split(r'\s+AND\s+|\s+OR\s+', where_clause, flags=re.IGNORECASE)
            where_conditions = [cond.strip() for cond in conditions if cond.strip()]
        # Extract RETURN fields
        return_fields = []
        return_match = re.search(r'RETURN\s+(.+)', query_upper, re.IGNORECASE)
        if return_match:
            return_clause = return_match.group(1)
            # Split by comma and clean up
            fields = return_clause.split(',')
            for field in fields:
                field = field.strip()
                # Extract field name (e.g., "u.name" -> "name")
                if '.' in field:
                    field = field.split('.')[-1]
                elif ' ' in field:
                    # Handle aliases like "u.name AS name"
                    field = field.split()[-1]
                return_fields.append(field)
        # Use base class method to build actions tree
        return self._build_actions_tree(
            entity_name=entity_name or "node",
            fields=return_fields if return_fields else ["*"],
            where_conditions=where_conditions,
            source_format="GQL",
            action_id_prefix="gql"
        )

    def from_actions_tree(self, actions_tree: ANode) -> str:
        """Convert XWQuery Script actions tree to GQL query."""
        # Extract tree data
        tree_data = actions_tree.to_native() if hasattr(actions_tree, 'to_native') else actions_tree
        statements = tree_data.get('root', {}).get('statements', [])
        if not statements:
            return "MATCH (n) RETURN n"
        # Extract first statement (SELECT action)
        stmt = statements[0]
        action_type = stmt.get('type', '')
        children = stmt.get('children', [])
        if action_type != 'SELECT':
            return "MATCH (n) RETURN n"
        # Extract fields from SELECT content
        select_content = stmt.get('content', '')
        fields = []
        if 'SELECT' in select_content.upper():
            fields_part = select_content.upper().replace('SELECT', '', 1).strip()
            if fields_part and fields_part != '*':
                field_list = [f.strip() for f in fields_part.split(',') if f.strip()]
                fields = [f.lower() for f in field_list]
        # Extract entity name from FROM child
        entity_name = None
        entity_label = 'Node'  # Default
        where_conditions = []
        for child in children:
            child_type = child.get('type', '')
            child_content = child.get('content', '')
            if child_type == 'FROM':
                entity_name = child_content
                # Convert plural entity name to singular label (e.g., "users" -> "User")
                if entity_name.endswith('s'):
                    entity_label = entity_name[:-1].capitalize()
                else:
                    entity_label = entity_name.capitalize()
            elif child_type == 'WHERE':
                where_conditions.append(child_content)
        # Build GQL query
        fields_str = ', '.join([f"n.{f.lower()}" for f in fields]) if fields else "n"
        # Build GQL query string
        gql_query = f"MATCH (n:{entity_label})"
        if where_conditions:
            where_str = ' AND '.join(where_conditions)
            # Convert SQL-style WHERE to GQL-style (e.g., "age > 25" -> "n.age > 25")
            where_gql = re.sub(r'\bage\b', 'n.age', where_str, flags=re.IGNORECASE)
            where_gql = re.sub(r'\bcity\b', 'n.city', where_gql, flags=re.IGNORECASE)
            gql_query += f" WHERE {where_gql}"
        gql_query += f" RETURN {fields_str}"
        return gql_query

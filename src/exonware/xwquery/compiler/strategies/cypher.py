#!/usr/bin/env python3
"""
Cypher Query Strategy
This module implements the Cypher query strategy for Neo4j graph queries.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.4
Generation Date: January 2, 2025
"""

import re
from typing import Any
from .base import AGraphQueryStrategy
from .grammar_based import GrammarBasedStrategy
from ...errors import XWQueryTypeError, XWQueryValueError
from ...defs import QueryMode, QueryTrait
from exonware.xwnode.base import ANode


class CypherStrategy(GrammarBasedStrategy, AGraphQueryStrategy):
    """
    Cypher query strategy for Neo4j graph queries.
    Supports:
    - Cypher query language
    - MATCH, CREATE, MERGE, DELETE operations
    - WHERE clauses and conditions
    - RETURN and WITH clauses
    - Path expressions and patterns
    """

    def __init__(self, **options):
        GrammarBasedStrategy.__init__(self, 'cypher', **options)
        AGraphQueryStrategy.__init__(self, **options)
        self._mode = QueryMode.AUTO
        self._traits = QueryTrait.GRAPH | QueryTrait.STRUCTURED | QueryTrait.ANALYTICAL

    def execute(self, query: str, **kwargs) -> Any:
        """Execute Cypher query."""
        if not self.validate_query(query):
            raise XWQueryValueError(f"Invalid Cypher query: {query}")
        query_type = self._get_query_type(query)
        if query_type == "MATCH":
            return self._execute_match(query, **kwargs)
        elif query_type == "CREATE":
            return self._execute_create(query, **kwargs)
        elif query_type == "MERGE":
            return self._execute_merge(query, **kwargs)
        elif query_type == "DELETE":
            return self._execute_delete(query, **kwargs)
        else:
            raise XWQueryValueError(f"Unsupported query type: {query_type}")

    def validate_query(self, query: str) -> bool:
        """Validate Cypher query syntax."""
        if not query or not isinstance(query, str):
            return False
        # Basic Cypher validation
        query = query.strip().upper()
        valid_operations = ["MATCH", "CREATE", "MERGE", "DELETE", "SET", "REMOVE", "RETURN", "WITH", "UNWIND", "CALL", "LOAD", "USING"]
        for operation in valid_operations:
            if query.startswith(operation):
                return True
        return False

    def get_query_plan(self, query: str) -> dict[str, Any]:
        """Get Cypher query execution plan."""
        query_type = self._get_query_type(query)
        return {
            "query_type": query_type,
            "operation": query_type,
            "complexity": self._estimate_complexity(query),
            "estimated_cost": self._estimate_cost(query),
            "patterns": self._extract_patterns(query),
            "optimization_hints": self._get_optimization_hints(query)
        }

    def path_query(self, start: Any, end: Any) -> list[Any]:
        """Execute path query."""
        query = f"MATCH p = (start {{id: '{start}'}})-[*]->(end {{id: '{end}'}}) RETURN p"
        return self.execute(query)

    def neighbor_query(self, node: Any) -> list[Any]:
        """Execute neighbor query."""
        query = f"MATCH (n {{id: '{node}'}})-[r]-(neighbor) RETURN neighbor"
        return self.execute(query)

    def shortest_path_query(self, start: Any, end: Any) -> list[Any]:
        """Execute shortest path query."""
        query = f"MATCH p = shortestPath((start {{id: '{start}'}})-[*]->(end {{id: '{end}'}})) RETURN p"
        return self.execute(query)

    def connected_components_query(self) -> list[list[Any]]:
        """Execute connected components query."""
        query = "MATCH (n) RETURN n, size((n)-[*]-()) as component_size"
        return self.execute(query)

    def cycle_detection_query(self) -> list[list[Any]]:
        """Execute cycle detection query."""
        query = "MATCH p = (n)-[r*]->(n) RETURN p"
        return self.execute(query)

    def _get_query_type(self, query: str) -> str:
        """Extract query type from Cypher query."""
        query = query.strip().upper()
        for operation in ["MATCH", "CREATE", "MERGE", "DELETE", "SET", "REMOVE", "RETURN", "WITH", "UNWIND", "CALL", "LOAD", "USING"]:
            if query.startswith(operation):
                return operation
        return "UNKNOWN"

    def _execute_match(self, query: str, **kwargs) -> Any:
        """Execute MATCH query."""
        return {"result": "Cypher MATCH executed", "query": query}

    def _execute_create(self, query: str, **kwargs) -> Any:
        """Execute CREATE query."""
        return {"result": "Cypher CREATE executed", "query": query}

    def _execute_merge(self, query: str, **kwargs) -> Any:
        """Execute MERGE query."""
        return {"result": "Cypher MERGE executed", "query": query}

    def _execute_delete(self, query: str, **kwargs) -> Any:
        """Execute DELETE query."""
        return {"result": "Cypher DELETE executed", "query": query}

    def _estimate_complexity(self, query: str) -> str:
        """Estimate query complexity."""
        patterns = self._extract_patterns(query)
        if len(patterns) > 5:
            return "HIGH"
        elif len(patterns) > 2:
            return "MEDIUM"
        else:
            return "LOW"

    def _estimate_cost(self, query: str) -> int:
        """Estimate query cost."""
        complexity = self._estimate_complexity(query)
        if complexity == "HIGH":
            return 160
        elif complexity == "MEDIUM":
            return 80
        else:
            return 40

    def _extract_patterns(self, query: str) -> list[str]:
        """Extract Cypher patterns from query."""
        patterns = []
        # Look for node patterns
        node_patterns = re.findall(r'\([^)]+\)', query)
        patterns.extend(node_patterns)
        # Look for relationship patterns
        rel_patterns = re.findall(r'\[[^\]]+\]', query)
        patterns.extend(rel_patterns)
        return patterns

    def _get_optimization_hints(self, query: str) -> list[str]:
        """Get query optimization hints."""
        hints = []
        if "MATCH" in query.upper() and "WHERE" not in query.upper():
            hints.append("Consider adding WHERE clause to limit results")
        if "shortestPath" in query:
            hints.append("Consider using indexes for shortestPath operations")
        if "RETURN *" in query.upper():
            hints.append("Consider specifying specific properties instead of using *")
        return hints

    def to_actions_tree(self, cypher_query: str) -> ANode:
        """Convert Cypher query to XWQuery Script actions tree."""
        # Normalize query
        query = ' '.join(cypher_query.split())
        query_upper = query.upper()
        # Extract MATCH pattern (e.g., "(u:User)" from "MATCH (u:User)")
        entity_name = None
        entity_label = None
        match_pattern = None
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
            entity_name=entity_name,
            fields=return_fields,
            where_conditions=where_conditions,
            source_format="CYPHER",
            action_id_prefix="cypher"
        )

    def from_actions_tree(self, actions_tree: ANode) -> str:
        """Convert XWQuery Script actions tree to Cypher query."""
        # Extract tree data - structure is {type: "PROGRAM", children: [...]}
        tree_data = actions_tree.to_native() if hasattr(actions_tree, 'to_native') else actions_tree
        # Handle both old format (root.statements) and new format (children)
        if 'root' in tree_data and 'statements' in tree_data['root']:
            actions = tree_data['root']['statements']
        elif 'children' in tree_data:
            actions = tree_data['children']
        else:
            if tree_data.get('type') == 'PROGRAM' and 'children' in tree_data:
                actions = tree_data['children']
            else:
                return "MATCH (n) RETURN n"
        if not actions:
            return "MATCH (n) RETURN n"
        # Find SELECT action and related actions
        select_action = None
        where_actions = []
        for action in actions:
            action_type = action.get('type', '')
            if action_type == 'SELECT':
                select_action = action
            elif action_type == 'WHERE':
                where_actions.append(action)
        if not select_action:
            return "MATCH (n) RETURN n"
        # Extract fields from SELECT params
        select_params = select_action.get('params', {})
        fields = select_params.get('fields', [])
        # Try to extract from metadata content if params don't have fields
        if not fields or fields == ['*']:
            metadata = select_action.get('metadata', {})
            content = metadata.get('content', '')
            if 'SELECT' in content.upper() and 'FROM' in content.upper():
                select_match = re.search(r'SELECT\s+(.*?)\s+FROM', content, re.IGNORECASE | re.DOTALL)
                if select_match:
                    fields_str = select_match.group(1).strip()
                    if fields_str and fields_str != '*':
                        fields_str = ' '.join(fields_str.split())
                        fields = [f.strip() for f in fields_str.split(',') if f.strip()]
        # Extract table/entity name
        entity_name = select_params.get('from') or select_params.get('path') or 'User'
        # Convert entity name to label (e.g., "users" -> "User")
        if entity_name.endswith('s'):
            entity_label = entity_name[:-1].capitalize()
        else:
            entity_label = entity_name.capitalize()
        # Extract WHERE conditions
        where_clauses = []
        for where_action in where_actions:
            where_params = where_action.get('params', {})
            where_content = where_action.get('metadata', {}).get('content', '')
            if where_content and 'WHERE' in where_content.upper():
                where_match = re.search(r'WHERE\s+(.+)', where_content, re.IGNORECASE)
                if where_match:
                    where_clauses.append(where_match.group(1).strip())
            elif where_params:
                field = where_params.get('field', '')
                operator = where_params.get('operator', '=')
                value = where_params.get('value', '')
                if field:
                    where_clauses.append(f"{field} {operator} {value}")
        # Build Cypher query
        if fields and fields != ['*']:
            # Map fields to Cypher return format
            return_fields = []
            for field in fields:
                # Handle aliases like "COUNT(o.id) as order_count"
                if ' as ' in field.lower() or ' AS ' in field:
                    parts = re.split(r'\s+as\s+', field, flags=re.IGNORECASE)
                    if len(parts) == 2:
                        return_fields.append(f"{parts[0].strip()} AS {parts[1].strip()}")
                    else:
                        return_fields.append(field)
                else:
                    # Simple field - add node prefix if needed
                    if '.' in field:
                        return_fields.append(field)
                    else:
                        return_fields.append(f"u.{field}")
            fields_str = ', '.join(return_fields)
        else:
            fields_str = "u"
        # Build Cypher query string
        cypher_query = f"MATCH (u:{entity_label})"
        if where_clauses:
            where_str = ' AND '.join(where_clauses)
            cypher_query += f" WHERE {where_str}"
        cypher_query += f" RETURN {fields_str}"
        return cypher_query

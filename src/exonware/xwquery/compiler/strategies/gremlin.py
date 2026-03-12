#!/usr/bin/env python3
"""
Gremlin Query Strategy
This module implements the Gremlin query strategy for Apache TinkerPop graph queries.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.2
Generation Date: January 2, 2025
"""

import re
from typing import Any, Optional
from .base import AGraphQueryStrategy
from .grammar_based import GrammarBasedStrategy
from ...errors import XWQueryTypeError, XWQueryValueError
from ...defs import QueryMode, QueryTrait
from exonware.xwnode.base import ANode


class GremlinStrategy(GrammarBasedStrategy, AGraphQueryStrategy):
    """
    Gremlin query strategy for Apache TinkerPop graph queries.
    Supports:
    - Gremlin traversal language
    - Graph traversal operations
    - Vertex and edge operations
    - Property and label operations
    - Path and cycle detection
    """

    def __init__(self, **options):
        GrammarBasedStrategy.__init__(self, 'gremlin', **options)
        super().__init__(**options)
        self._mode = QueryMode.AUTO
        self._traits = QueryTrait.GRAPH | QueryTrait.STRUCTURED | QueryTrait.ANALYTICAL

    def execute(self, query: str, **kwargs) -> Any:
        """Execute Gremlin query."""
        if not self.validate_query(query):
            raise XWQueryValueError(f"Invalid Gremlin query: {query}")
        query_type = self._get_query_type(query)
        if query_type == "traversal":
            return self._execute_traversal(query, **kwargs)
        elif query_type == "vertex":
            return self._execute_vertex(query, **kwargs)
        elif query_type == "edge":
            return self._execute_edge(query, **kwargs)
        else:
            raise XWQueryValueError(f"Unsupported query type: {query_type}")

    def validate_query(self, query: str) -> bool:
        """Validate Gremlin query syntax."""
        if not query or not isinstance(query, str):
            return False
        # Basic Gremlin validation
        query = query.strip()
        # Check for Gremlin keywords
        gremlin_keywords = ["g.", "V", "E", "addV", "addE", "drop", "has", "hasLabel", "hasId", "out", "in", "both", "outE", "inE", "bothE", "outV", "inV", "bothV", "values", "key", "label", "id", "count", "limit", "range", "order", "by", "select", "where", "and", "or", "not", "is", "within", "without", "between", "inside", "outside", "within", "without", "between", "inside", "outside", "within", "without", "between", "inside", "outside"]
        for keyword in gremlin_keywords:
            if keyword in query:
                return True
        return False

    def get_query_plan(self, query: str) -> dict[str, Any]:
        """Get Gremlin query execution plan."""
        query_type = self._get_query_type(query)
        return {
            "query_type": query_type,
            "operation": query_type,
            "complexity": self._estimate_complexity(query),
            "estimated_cost": self._estimate_cost(query),
            "steps": self._extract_steps(query),
            "optimization_hints": self._get_optimization_hints(query)
        }

    def path_query(self, start: Any, end: Any) -> list[Any]:
        """Execute path query."""
        query = f"g.V('{start}').repeat(out()).until(hasId('{end}')).path()"
        return self.execute(query)

    def neighbor_query(self, node: Any) -> list[Any]:
        """Execute neighbor query."""
        query = f"g.V('{node}').both()"
        return self.execute(query)

    def shortest_path_query(self, start: Any, end: Any) -> list[Any]:
        """Execute shortest path query."""
        query = f"g.V('{start}').repeat(out()).until(hasId('{end}')).path().limit(1)"
        return self.execute(query)

    def connected_components_query(self) -> list[list[Any]]:
        """Execute connected components query."""
        query = "g.V().repeat(both()).until(cyclicPath()).dedup()"
        return self.execute(query)

    def cycle_detection_query(self) -> list[list[Any]]:
        """Execute cycle detection query."""
        query = "g.V().repeat(out()).until(cyclicPath()).path()"
        return self.execute(query)

    def _get_query_type(self, query: str) -> str:
        """Extract query type from Gremlin query."""
        query = query.strip()
        if "V(" in query or "E(" in query:
            return "traversal"
        elif "addV" in query or "V(" in query:
            return "vertex"
        elif "addE" in query or "E(" in query:
            return "edge"
        else:
            return "unknown"

    def _execute_traversal(self, query: str, **kwargs) -> Any:
        """Execute traversal query."""
        return {"result": "Gremlin traversal executed", "query": query}

    def _execute_vertex(self, query: str, **kwargs) -> Any:
        """Execute vertex query."""
        return {"result": "Gremlin vertex executed", "query": query}

    def _execute_edge(self, query: str, **kwargs) -> Any:
        """Execute edge query."""
        return {"result": "Gremlin edge executed", "query": query}

    def _estimate_complexity(self, query: str) -> str:
        """Estimate query complexity."""
        steps = self._extract_steps(query)
        if len(steps) > 10:
            return "HIGH"
        elif len(steps) > 5:
            return "MEDIUM"
        else:
            return "LOW"

    def _estimate_cost(self, query: str) -> int:
        """Estimate query cost."""
        complexity = self._estimate_complexity(query)
        if complexity == "HIGH":
            return 180
        elif complexity == "MEDIUM":
            return 90
        else:
            return 45

    def _extract_steps(self, query: str) -> list[str]:
        """Extract Gremlin steps from query."""
        steps = []
        # Common Gremlin steps
        gremlin_steps = ["V", "E", "addV", "addE", "drop", "has", "hasLabel", "hasId", "out", "in", "both", "outE", "inE", "bothE", "outV", "inV", "bothV", "values", "key", "label", "id", "count", "limit", "range", "order", "by", "select", "where", "and", "or", "not", "is", "within", "without", "between", "inside", "outside", "repeat", "until", "emit", "times", "path", "dedup", "cyclicPath"]
        for step in gremlin_steps:
            if step in query:
                steps.append(step)
        return steps

    def _get_optimization_hints(self, query: str) -> list[str]:
        """Get query optimization hints."""
        hints = []
        if "repeat" in query:
            hints.append("Consider using limit() with repeat() to prevent infinite loops")
        if "path" in query:
            hints.append("Consider using dedup() with path() to avoid duplicate paths")
        if "count" in query:
            hints.append("Consider using count() early in the traversal for better performance")
        return hints

    def to_actions_tree(self, gremlin_query: str) -> ANode:
        """Convert Gremlin query to XWQuery Script actions tree."""
        # Parse Gremlin traversal query
        # Example: "g.V().has('name', 'John').values('name', 'age')"
        query = gremlin_query.strip()
        # Extract entity name from V() or hasLabel()
        entity_name = None
        label_match = re.search(r"hasLabel\s*\(\s*['\"](\w+)['\"]", query)
        if label_match:
            entity_name = label_match.group(1).lower() + 's'  # Pluralize
        # Extract fields from values()
        fields = []
        values_match = re.search(r"values\s*\(\s*([^)]+)\)", query)
        if values_match:
            values_str = values_match.group(1)
            # Split by comma and clean up
            field_list = [f.strip().strip("'\"") for f in values_str.split(',')]
            fields = [f for f in field_list if f]
        # Extract WHERE conditions from has()
        where_conditions = []
        has_matches = re.finditer(r"has\s*\(\s*['\"](\w+)['\"]\s*,\s*['\"]?([^'\"\)]+)['\"]?\s*\)", query)
        for match in has_matches:
            prop_name = match.group(1)
            prop_value = match.group(2).strip("'\"")
            where_conditions.append(f"{prop_name} = '{prop_value}'")
        # Use base class method to build actions tree
        return self._build_actions_tree(
            entity_name=entity_name or "vertex",
            fields=fields if fields else ["*"],
            where_conditions=where_conditions,
            source_format="GREMLIN",
            action_id_prefix="gremlin"
        )

    def from_actions_tree(self, actions_tree: ANode) -> str:
        """Convert XWQuery Script actions tree to Gremlin query."""
        import re
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
                return "g.V()"
        if not actions:
            return "g.V()"
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
            return "g.V()"
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
        entity_name = select_params.get('from') or select_params.get('path')
        # Extract WHERE conditions
        where_conditions = []
        for where_action in where_actions:
            where_params = where_action.get('params', {})
            where_content = where_action.get('metadata', {}).get('content', '')
            if where_content and 'WHERE' in where_content.upper():
                where_match = re.search(r'WHERE\s+(.+)', where_content, re.IGNORECASE)
                if where_match:
                    where_conditions.append(where_match.group(1).strip())
            elif where_params:
                field = where_params.get('field', '')
                operator = where_params.get('operator', '=')
                value = where_params.get('value', '')
                if field:
                    where_conditions.append(f"{field} {operator} {value}")
        # Build Gremlin query
        gremlin_query = "g.V()"
        # Add hasLabel if entity_name exists
        if entity_name:
            # Convert plural to singular label (e.g., "users" -> "User")
            label = entity_name.rstrip('s').capitalize() if entity_name.endswith('s') else entity_name.capitalize()
            gremlin_query += f".hasLabel('{label}')"
        # Add has() filters from WHERE conditions
        if where_conditions:
            where_str = ' AND '.join(where_conditions)
            # Parse conditions like "name = 'John'" or "age > 25" or "u.active = true"
            # Remove table prefixes
            where_str = re.sub(r'\w+\.', '', where_str)
            condition_matches = re.finditer(r"(\w+)\s*([=<>]+)\s*['\"]?([^'\"\s]+)['\"]?", where_str)
            for match in condition_matches:
                prop_name = match.group(1)
                operator = match.group(2)
                prop_value = match.group(3).strip("'\"")
                # Convert operators
                if operator == '=':
                    gremlin_query += f".has('{prop_name}', '{prop_value}')"
                elif operator == '>':
                    gremlin_query += f".has('{prop_name}', gt('{prop_value}'))"
                elif operator == '<':
                    gremlin_query += f".has('{prop_name}', lt('{prop_value}'))"
        # Add values() if fields exist
        if fields and fields != ["*"]:
            # Clean up fields (remove table prefixes, handle aliases)
            clean_fields = []
            for field in fields:
                # Remove table prefix (e.g., "u.name" -> "name")
                if '.' in field:
                    field = field.split('.')[-1]
                # Handle aliases
                if ' as ' in field.lower() or ' AS ' in field:
                    parts = re.split(r'\s+as\s+', field, flags=re.IGNORECASE)
                    if len(parts) == 2:
                        field = parts[1].strip()
                # Remove function calls (e.g., "COUNT(o.id)" -> just use field name)
                if '(' in field:
                    field_match = re.search(r'(\w+)', field)
                    if field_match:
                        field = field_match.group(1)
                clean_fields.append(field.strip())
            if clean_fields:
                fields_str = "', '".join(clean_fields)
                gremlin_query += f".values('{fields_str}')"
            else:
                gremlin_query += ".values()"
        else:
            gremlin_query += ".values()"
        return gremlin_query

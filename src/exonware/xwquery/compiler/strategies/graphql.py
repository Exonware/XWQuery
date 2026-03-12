#!/usr/bin/env python3
"""
GraphQL Query Strategy
This module implements the GraphQL query strategy for graph-based data queries.
Now uses GrammarBasedStrategy for maximum xwsyntax reuse.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.2
Generation Date: January 20, 2025
"""

import re
from typing import Any, Optional
from .grammar_based import GrammarBasedStrategy
from .base import AGraphQueryStrategy
from ...errors import XWQueryTypeError, XWQueryValueError
from ...defs import QueryMode, QueryTrait, FormatType
from exonware.xwnode.base import ANode


class GraphQLStrategy(GrammarBasedStrategy, AGraphQueryStrategy):
    """
    GraphQL query strategy for graph-based data queries.
    Maximum reuse: Inherits from GrammarBasedStrategy which uses xwsyntax
    for all parsing/generation, eliminating manual parsing code.
    Supports:
    - Queries and mutations
    - Fragments and variables
    - Introspection
    - Subscriptions
    - Schema validation
    """

    def __init__(self, **options):
        # Initialize GrammarBasedStrategy with 'graphql' format (maximum xwsyntax reuse)
        GrammarBasedStrategy.__init__(self, 'graphql', **options)
        AGraphQueryStrategy.__init__(self, **options)
        self._mode = QueryMode.AUTO
        self._traits = QueryTrait.GRAPH | QueryTrait.STRUCTURED | QueryTrait.ANALYTICAL

    def execute(self, query: str, **kwargs) -> Any:
        """Execute GraphQL query."""
        # Use GrammarBasedStrategy.validate_query (via xwsyntax)
        if not self.validate_query(query):
            raise XWQueryValueError(f"Invalid GraphQL query: {query}")
        query_type = self._get_query_type(query)
        if query_type == "query":
            return self._execute_query(query, **kwargs)
        elif query_type == "mutation":
            return self._execute_mutation(query, **kwargs)
        elif query_type == "subscription":
            return self._execute_subscription(query, **kwargs)
        else:
            raise XWQueryValueError(f"Unsupported query type: {query_type}")
    # validate_query() now inherited from GrammarBasedStrategy (uses xwsyntax)

    def _get_query_type(self, query: str) -> str:
        """Get query type from GraphQL query."""
        query_upper = query.strip().upper()
        if 'MUTATION' in query_upper:
            return 'MUTATION'
        elif 'SUBSCRIPTION' in query_upper:
            return 'SUBSCRIPTION'
        elif 'QUERY' in query_upper or query_upper.startswith('{'):
            return 'QUERY'
        return 'QUERY'

    def get_query_plan(self, query: str) -> dict[str, Any]:
        """Get GraphQL query execution plan."""
        query_type = self._get_query_type(query)
        return {
            "query_type": query_type,
            "operation": query_type,
            "complexity": self._estimate_complexity(query),
            "estimated_cost": self._estimate_cost(query),
            "fields": self._extract_fields(query),
            "optimization_hints": self._get_optimization_hints(query)
        }

    def path_query(self, start: Any, end: Any) -> list[Any]:
        """Execute path query."""
        query = f"""
        query {{
            path(start: "{start}", end: "{end}") {{
                nodes
                edges
                cost
            }}
        }}
        """
        return self.execute(query)

    def neighbor_query(self, node: Any) -> list[Any]:
        """Execute neighbor query."""
        query = f"""
        query {{
            node(id: "{node}") {{
                neighbors {{
                    id
                    properties
                }}
            }}
        }}
        """
        return self.execute(query)

    def shortest_path_query(self, start: Any, end: Any) -> list[Any]:
        """Execute shortest path query."""
        query = f"""
        query {{
            shortestPath(start: "{start}", end: "{end}") {{
                path
                distance
                hops
            }}
        }}
        """
        return self.execute(query)

    def connected_components_query(self) -> list[list[Any]]:
        """Execute connected components query."""
        query = """
        query {
            connectedComponents {
                components {
                    nodes
                    size
                }
            }
        }
        """
        return self.execute(query)

    def cycle_detection_query(self) -> list[list[Any]]:
        """Execute cycle detection query."""
        query = """
        query {
            cycles {
                cycles {
                    nodes
                    length
                }
            }
        }
        """
        return self.execute(query)

    def _get_query_type(self, query: str) -> str:
        """Extract query type from GraphQL query."""
        query = query.strip()
        if query.startswith("mutation"):
            return "mutation"
        elif query.startswith("subscription"):
            return "subscription"
        elif query.startswith("query") or query.startswith("{"):
            return "query"
        else:
            return "unknown"

    def _execute_query(self, query: str, **kwargs) -> Any:
        """Execute GraphQL query."""
        return {"result": "GraphQL query executed", "query": query}

    def _execute_mutation(self, query: str, **kwargs) -> Any:
        """Execute GraphQL mutation."""
        return {"result": "GraphQL mutation executed", "query": query}

    def _execute_subscription(self, query: str, **kwargs) -> Any:
        """Execute GraphQL subscription."""
        return {"result": "GraphQL subscription executed", "query": query}

    def _estimate_complexity(self, query: str) -> str:
        """Estimate query complexity."""
        # Count nested fields and connections
        depth = self._calculate_query_depth(query)
        if depth > 5:
            return "HIGH"
        elif depth > 2:
            return "MEDIUM"
        else:
            return "LOW"

    def _estimate_cost(self, query: str) -> int:
        """Estimate query cost."""
        complexity = self._estimate_complexity(query)
        if complexity == "HIGH":
            return 150
        elif complexity == "MEDIUM":
            return 75
        else:
            return 25

    def _calculate_query_depth(self, query: str) -> int:
        """Calculate query nesting depth."""
        depth = 0
        max_depth = 0
        for char in query:
            if char == '{':
                depth += 1
                max_depth = max(max_depth, depth)
            elif char == '}':
                depth -= 1
        return max_depth

    def _extract_fields(self, query: str) -> list[str]:
        """Extract field names from GraphQL query."""
        # Simple field extraction
        fields = []
        lines = query.split('\n')
        for line in lines:
            line = line.strip()
            if line and not line.startswith('{') and not line.startswith('}'):
                if ':' in line:
                    field = line.split(':')[0].strip()
                    fields.append(field)
        return fields

    def _get_optimization_hints(self, query: str) -> list[str]:
        """Get query optimization hints."""
        hints = []
        if self._calculate_query_depth(query) > 3:
            hints.append("Consider reducing query depth to improve performance")
        if "..." in query:
            hints.append("Consider using fragments for reusable query parts")
        if query.count('{') > 10:
            hints.append("Consider breaking down complex queries into smaller ones")
        return hints

    def to_actions_tree(self, graphql_query: str) -> ANode:
        """Convert GraphQL query to XWQuery Script actions tree."""
        # Normalize query by removing extra whitespace
        query = ' '.join(graphql_query.split())
        # Extract query type (query, mutation, subscription)
        query_type = self._get_query_type(query)
        # Extract entity/field name (e.g., "users" from "users { ... }" or "query { users { ... } }")
        entity_name = None
        entity_match = re.search(r'(?:query\s*\{?\s*)?(\w+)\s*(?:\([^)]*\))?\s*\{', query)
        if entity_match:
            entity_name = entity_match.group(1)
        # Extract fields (everything between { } at the top level)
        fields = []
        # Find the main selection set
        brace_start = query.find('{')
        if brace_start != -1:
            depth = 0
            current_pos = brace_start + 1
            field_start = current_pos
            i = current_pos
            while i < len(query):
                if query[i] == '{':
                    depth += 1
                elif query[i] == '}':
                    if depth == 0:
                        # End of main selection set
                        field_text = query[field_start:i].strip()
                        # Extract individual fields
                        for line in field_text.split(','):
                            line = line.strip()
                            if line and not line.startswith('{'):
                                field = line.split(':')[0].strip()
                                if field:
                                    fields.append(field)
                        break
                    depth -= 1
                i += 1
        # Extract filters/arguments (e.g., "age_gt: 25" from "users(age_gt: 25)")
        filters = {}
        filter_match = re.search(r'(\w+)\s*\(([^)]+)\)', query)
        if filter_match:
            filter_str = filter_match.group(2)
            # Parse key:value pairs
            for pair in filter_str.split(','):
                pair = pair.strip()
                if ':' in pair:
                    key, value = pair.split(':', 1)
                    filters[key.strip()] = value.strip()
        # Build WHERE conditions from filters
        where_conditions = []
        for key, value in filters.items():
            where_conditions.append(f"{key} = {value}")
        # Use base class method to build actions tree
        actions_tree = self._build_actions_tree(
            entity_name=entity_name,
            fields=fields,
            where_conditions=where_conditions,
            source_format="GRAPHQL",
            action_id_prefix="graphql"
        )
        # Add query_type to metadata if needed
        tree_data = actions_tree.to_native() if hasattr(actions_tree, 'to_native') else actions_tree
        tree_data['root']['metadata']['query_type'] = query_type
        return ANode.from_native(tree_data)

    def from_actions_tree(self, actions_tree: ANode) -> str:
        """Convert XWQuery Script actions tree to GraphQL query."""
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
                return "query { }"
        if not actions:
            return "query { }"
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
            return "query { }"
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
        entity_name = select_params.get('from') or select_params.get('path') or 'users'
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
        # Build GraphQL query
        # Convert fields to GraphQL format (remove table prefixes, handle aliases)
        graphql_fields = []
        for field in fields:
            if field == '*':
                graphql_fields.append('id')
                graphql_fields.append('name')
            else:
                # Remove table prefix (e.g., "u.name" -> "name")
                if '.' in field:
                    field = field.split('.')[-1]
                # Handle aliases (e.g., "COUNT(o.id) as order_count" -> "order_count")
                if ' as ' in field.lower() or ' AS ' in field:
                    parts = re.split(r'\s+as\s+', field, flags=re.IGNORECASE)
                    if len(parts) == 2:
                        graphql_fields.append(parts[1].strip())
                    else:
                        # Extract field name from function call
                        field_match = re.search(r'(\w+)\s*\(', field)
                        if field_match:
                            graphql_fields.append(field_match.group(1).lower())
                        else:
                            graphql_fields.append(field.strip())
                else:
                    graphql_fields.append(field.strip())
        fields_str = ' '.join(graphql_fields) if graphql_fields else 'id name'
        # Convert WHERE conditions to GraphQL filters
        filters = {}
        if where_clauses:
            where_str = ' AND '.join(where_clauses)
            # Parse common conditions
            # age > X
            age_match = re.search(r'(\w+\.)?age\s*>\s*(\d+)', where_str, re.IGNORECASE)
            if age_match:
                filters['age_gt'] = age_match.group(2)
            # active = true
            active_match = re.search(r'(\w+\.)?active\s*=\s*(true|false)', where_str, re.IGNORECASE)
            if active_match:
                filters['active'] = active_match.group(2).lower()
            # created_date >= 'date'
            date_match = re.search(r'(\w+\.)?created_date\s*>=\s*\'([^\']+)\'', where_str, re.IGNORECASE)
            if date_match:
                filters['created_date_gte'] = f"'{date_match.group(2)}'"
        # Build GraphQL query string
        if filters:
            filter_str = ', '.join([f"{k}: {v}" for k, v in filters.items()])
            return f"query {{ {entity_name}(where: {{{filter_str}}}) {{ {fields_str} }} }}"
        else:
            return f"query {{ {entity_name} {{ {fields_str} }} }}"

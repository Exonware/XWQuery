#!/usr/bin/env python3
"""
jq Query Strategy
This module implements the jq query strategy for jq JSON processor operations.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.2
Generation Date: January 2, 2025
"""

from typing import Any, Optional
from .base import ADocumentQueryStrategy
from .grammar_based import GrammarBasedStrategy
from ...errors import XWQueryValueError
from ...defs import QueryMode, QueryTrait
from exonware.xwnode.base import ANode


class JQStrategy(GrammarBasedStrategy, ADocumentQueryStrategy):
    """jq query strategy for jq JSON processor operations."""

    def __init__(self, **options):
        GrammarBasedStrategy.__init__(self, 'jq', **options)
        super().__init__(**options)
        self._mode = QueryMode.AUTO
        self._traits = QueryTrait.DOCUMENT | QueryTrait.STRUCTURED | QueryTrait.ANALYTICAL | QueryTrait.STREAMING

    def execute(self, query: str, **kwargs) -> Any:
        """Execute jq query."""
        if not self.validate_query(query):
            raise XWQueryValueError(f"Invalid jq query: {query}")
        return {"result": "jq query executed", "query": query}

    def validate_query(self, query: str) -> bool:
        """Validate jq query syntax."""
        if not query or not isinstance(query, str):
            return False
        return any(op in query for op in [".", "|", "select", "map", "filter", "group_by", "sort_by"])

    def get_query_plan(self, query: str) -> dict[str, Any]:
        """Get jq query execution plan."""
        return {
            "query_type": "jq",
            "complexity": "MEDIUM",
            "estimated_cost": 60
        }

    def path_query(self, path: str) -> Any:
        """Execute path-based query."""
        return self.execute(f".{path}")

    def filter_query(self, filter_expression: str) -> Any:
        """Execute filter query."""
        return self.execute(f"select({filter_expression})")

    def projection_query(self, fields: list[str]) -> Any:
        """Execute projection query."""
        return self.execute(f"{{{', '.join(f'{field}: .{field}' for field in fields)}}}")

    def sort_query(self, sort_fields: list[str], order: str = "asc") -> Any:
        """Execute sort query."""
        return self.execute(f"sort_by(.{sort_fields[0]})")

    def limit_query(self, limit: int, offset: int = 0) -> Any:
        """Execute limit query."""
        return self.execute(f".[{offset}:{offset + limit}]")
        # to_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)
        # Extract fields (path segments after .)
        fields = []
        if '.' in query:
            parts = query.split('.')
            for part in parts[1:]:  # Skip first . (root)
                part = part.split('|')[0].split('select')[0].split('map')[0].strip()
                if part and part != '*':
                    fields.append(part)
        # Extract WHERE conditions (select expressions)
        where_conditions = []
        select_match = re.search(r'select\(([^)]+)\)', query)
        if select_match:
            select_expr = select_match.group(1)
            where_conditions.append(select_expr)
        # Build actions tree
        children = []
        if where_conditions:
            where_content = " AND ".join(where_conditions)
            children.append({
                "type": "WHERE",
                "id": "jq_where_1",
                "content": where_content,
                "line_number": 1,
                "timestamp": datetime.now().isoformat(),
                "children": []
            })
        select_fields = ", ".join(fields) if fields else "*"
        select_action = {
            "type": "SELECT",
            "id": "jq_select_1",
            "content": f"SELECT {select_fields}",
            "line_number": 1,
            "timestamp": datetime.now().isoformat(),
            "children": children
        }
        actions = {
            "root": {
                "type": "PROGRAM",
                "statements": [select_action],
                "comments": [],
                "metadata": {
                    "version": "1.0",
                    "created": datetime.now().isoformat(),
                    "source_format": "JQ"
                }
            }
        }
        return ANode.from_native(actions)

    def from_actions_tree(self, actions_tree: ANode) -> str:
        """Convert XWQuery Script actions tree to jq query."""
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
                return "."
        if not actions:
            return "."
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
            return "."
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
                    where_conditions.append(f".{field} {operator} {value}")
        # Build jq query
        if fields and fields != ['*']:
            # Convert fields to jq paths (remove table prefixes, handle aliases)
            jq_fields = []
            for field in fields:
                # Remove table prefix (e.g., "u.name" -> "name")
                if '.' in field:
                    field = field.split('.')[-1]
                # Handle function calls (e.g., "COUNT(o.id)" -> just use field name)
                if '(' in field:
                    field_match = re.search(r'(\w+)', field)
                    if field_match:
                        field = field_match.group(1)
                jq_fields.append(field)
            jq = '.' + '.'.join(jq_fields) if jq_fields else "."
        else:
            jq = "."
        if where_conditions:
            select_expr = ' and '.join(where_conditions)
            jq = f"{jq} | select({select_expr})"
        return jq

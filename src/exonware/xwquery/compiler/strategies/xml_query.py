#!/usr/bin/env python3
"""
XML Query Strategy
This module implements the XML Query strategy for generic XML operations.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.3
Generation Date: January 2, 2025
"""

from typing import Any
from .base import ADocumentQueryStrategy
from .grammar_based import GrammarBasedStrategy
from ...errors import XWQueryValueError
from ...defs import QueryMode, QueryTrait
from exonware.xwnode.base import ANode


class XMLQueryStrategy(GrammarBasedStrategy, ADocumentQueryStrategy):
    """XML Query strategy for generic XML operations."""

    def __init__(self, **options):
        GrammarBasedStrategy.__init__(self, 'xmlquery', **options)
        super().__init__(**options)
        self._mode = QueryMode.AUTO
        self._traits = QueryTrait.DOCUMENT | QueryTrait.STRUCTURED | QueryTrait.ANALYTICAL

    def execute(self, query: str, **kwargs) -> Any:
        """Execute XML query."""
        if not self.validate_query(query):
            raise XWQueryValueError(f"Invalid XML query: {query}")
        return {"result": "XML query executed", "query": query}

    def validate_query(self, query: str) -> bool:
        """Validate XML query syntax."""
        if not query or not isinstance(query, str):
            return False
        return any(op in query for op in ["<", ">", "/", "//", "@", "[", "]"])

    def get_query_plan(self, query: str) -> dict[str, Any]:
        """Get XML query execution plan."""
        return {
            "query_type": "XML_QUERY",
            "complexity": "MEDIUM",
            "estimated_cost": 60
        }

    def path_query(self, path: str) -> Any:
        """Execute path-based query."""
        return self.execute(f"//{path}")

    def filter_query(self, filter_expression: str) -> Any:
        """Execute filter query."""
        return self.execute(f"//*[{filter_expression}]")

    def projection_query(self, fields: list[str]) -> Any:
        """Execute projection query."""
        return self.execute(f"//*[{' or '.join(fields)}]")

    def sort_query(self, sort_fields: list[str], order: str = "asc") -> Any:
        """Execute sort query."""
        return self.execute(f"//*[sort by {sort_fields[0]}]")

    def limit_query(self, limit: int, offset: int = 0) -> Any:
        """Execute limit query."""
        return self.execute(f"//*[position() > {offset} and position() <= {offset + limit}]")
        # to_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)
        # Extract entity name (last element in path)
        entity_name = None
        if '/' in query or '//' in query:
            parts = re.split(r'/+', query)
            parts = [p for p in parts if p and not p.startswith('*')]
            if parts:
                entity_name = parts[-1].split('[')[0].split('@')[0]
        # Extract fields (elements in path)
        fields = []
        if '/' in query or '//' in query:
            parts = re.split(r'/+', query)
            for part in parts:
                elem = part.split('[')[0].split('@')[0].strip()
                if elem and elem != '*':
                    fields.append(elem)
        # Extract WHERE conditions (predicates)
        where_conditions = []
        predicate_match = re.search(r'\[([^\]]+)\]', query)
        if predicate_match:
            predicate = predicate_match.group(1)
            where_conditions.append(predicate)
        # Build actions tree
        children = []
        if entity_name:
            children.append({
                "type": "FROM",
                "id": "xml_query_from_1",
                "content": entity_name,
                "line_number": 1,
                "timestamp": datetime.now().isoformat(),
                "children": []
            })
        if where_conditions:
            where_content = " AND ".join(where_conditions)
            children.append({
                "type": "WHERE",
                "id": "xml_query_where_1",
                "content": where_content,
                "line_number": 1,
                "timestamp": datetime.now().isoformat(),
                "children": []
            })
        select_fields = ", ".join(fields) if fields else "*"
        select_action = {
            "type": "SELECT",
            "id": "xml_query_select_1",
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
                    "source_format": "XML_QUERY"
                }
            }
        }
        return ANode.from_native(actions)

    def from_actions_tree(self, actions_tree: ANode) -> str:
        """Convert XWQuery Script actions tree to XML query."""
        import re
        tree_data = actions_tree.to_native() if hasattr(actions_tree, 'to_native') else actions_tree
        statements = tree_data.get('root', {}).get('statements', [])
        if not statements:
            return "//*"
        stmt = statements[0]
        action_type = stmt.get('type', '')
        children = stmt.get('children', [])
        if action_type != 'SELECT':
            return "//*"
        # Extract fields
        select_content = stmt.get('content', '')
        fields = []
        if 'SELECT' in select_content.upper():
            fields_part = select_content.upper().replace('SELECT', '', 1).strip()
            if fields_part and fields_part != '*':
                fields = [f.strip() for f in fields_part.split(',') if f.strip()]
        # Extract entity name and WHERE conditions
        entity_name = None
        where_conditions = []
        for child in children:
            child_type = child.get('type', '')
            child_content = child.get('content', '')
            if child_type == 'FROM':
                entity_name = child_content
            elif child_type == 'WHERE':
                where_conditions.append(child_content)
        # Build XML query
        if fields:
            path = '//' + '/'.join(fields)
        elif entity_name:
            path = f"//{entity_name}"
        else:
            path = "//*"
        if where_conditions:
            predicate = ' AND '.join(where_conditions)
            path = f"{path}[{predicate}]"
        return path

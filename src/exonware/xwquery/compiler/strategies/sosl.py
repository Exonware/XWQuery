#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/query/strategies/sosl.py
SOSL Query Strategy
This module implements the SOSL query strategy for Salesforce Object Search Language operations.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.1
Generation Date: January 2, 2025
"""
import re
from typing import Any, Optional
from .base import AStructuredQueryStrategy
from .grammar_based import GrammarBasedStrategy
from ...errors import XWQueryValueError
from ...defs import QueryMode, QueryTrait
from exonware.xwnode.base import ANode
class SOSLStrategy(GrammarBasedStrategy, AStructuredQueryStrategy):
    """SOSL query strategy for Salesforce Object Search Language operations."""
    def __init__(self, **options):
        GrammarBasedStrategy.__init__(self, 'sosl', **options)
        super().__init__(**options)
        self._mode = QueryMode.AUTO
        self._traits = QueryTrait.STRUCTURED | QueryTrait.SEARCH | QueryTrait.UNSTRUCTURED
    def execute(self, query: str, **kwargs) -> Any:
        """Execute SOSL query."""
        if not self.validate_query(query):
            raise XWQueryValueError(f"Invalid SOSL query: {query}")
        return {"result": "SOSL query executed", "query": query}
    def validate_query(self, query: str) -> bool:
        """Validate SOSL query syntax."""
        if not query or not isinstance(query, str):
            return False
        query_upper = query.upper()
        return query_upper.startswith('FIND') and ('RETURNING' in query_upper or 'IN' in query_upper)
    def get_query_plan(self, query: str) -> dict[str, Any]:
        """Get SOSL query execution plan."""
        return {
            "query_type": "SOSL",
            "complexity": "MEDIUM",
            "estimated_cost": 85
        }
    def select_query(self, table: str, columns: list[str], where_clause: str = None) -> Any:
        """Execute SELECT query."""
        search_term = where_clause or "*"
        fields_str = ', '.join(columns) if columns else '*'
        query = f"FIND '{search_term}' IN ALL FIELDS RETURNING {table}({fields_str})"
        return self.execute(query)
    def insert_query(self, table: str, data: dict[str, Any]) -> Any:
        """Execute INSERT query."""
        return self.execute(f"INSERT INTO {table} VALUES {data}")
    def update_query(self, table: str, data: dict[str, Any], where_clause: str = None) -> Any:
        """Execute UPDATE query."""
        return self.execute(f"UPDATE {table} SET {data}")
    def delete_query(self, table: str, where_clause: str = None) -> Any:
        """Execute DELETE query."""
        return self.execute(f"DELETE FROM {table}")
    def join_query(self, tables: list[str], join_conditions: list[str]) -> Any:
        """Execute JOIN query."""
        return self.execute(f"FIND '*' IN ALL FIELDS RETURNING {', '.join(tables)}")
    def aggregate_query(self, table: str, functions: list[str], group_by: list[str] = None) -> Any:
        """Execute aggregate query."""
        return self.execute(f"FIND '*' IN ALL FIELDS RETURNING {table}({', '.join(functions)})")
        # to_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)
        # Parse SOSL query (FIND ... IN ... RETURNING ...)
        search_term = None
        search_scope = None
        returning_objects = []
        fields = []
        # Extract FIND search term
        find_match = re.search(r"FIND\s+['\"](.+?)['\"]", query, re.IGNORECASE)
        if find_match:
            search_term = find_match.group(1)
        # Extract IN scope
        in_match = re.search(r"IN\s+(\w+\s+FIELDS)", query_upper, re.IGNORECASE)
        if in_match:
            search_scope = in_match.group(1)
        # Extract RETURNING clause
        returning_match = re.search(r"RETURNING\s+(.+?)(?:;|$)", query, re.IGNORECASE | re.DOTALL)
        if returning_match:
            returning_clause = returning_match.group(1).strip()
            # Parse object(fields) patterns
            obj_pattern = r"(\w+)\s*\(([^)]+)\)"
            for obj_match in re.finditer(obj_pattern, returning_clause):
                obj_name = obj_match.group(1)
                obj_fields = [f.strip() for f in obj_match.group(2).split(',') if f.strip()]
                returning_objects.append((obj_name, obj_fields))
        # Build actions tree
        children = []
        # Add search term as WHERE condition
        if search_term:
            where_content = f"search_term = '{search_term}'"
            if search_scope:
                where_content += f" IN {search_scope}"
            children.append({
                "type": "WHERE",
                "id": "sosl_where_1",
                "content": where_content,
                "line_number": 1,
                "timestamp": datetime.now().isoformat(),
                "children": []
            })
        # Use first object as entity (or default)
        entity_name = returning_objects[0][0] if returning_objects else "Object"
        fields = returning_objects[0][1] if returning_objects else []
        if entity_name:
            children.append({
                "type": "FROM",
                "id": "sosl_from_1",
                "content": entity_name,
                "line_number": 1,
                "timestamp": datetime.now().isoformat(),
                "children": []
            })
        select_fields = ", ".join(fields) if fields else "*"
        select_action = {
            "type": "SELECT",
            "id": "sosl_select_1",
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
                    "source_format": "SOSL"
                }
            }
        }
        return ANode.from_native(actions)
        # from_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)
                # Extract search term from WHERE condition
                if "search_term = " in child_content:
                    term_match = re.search(r"search_term\s*=\s*['\"](.+?)['\"]", child_content)
                    if term_match:
                        search_term = term_match.group(1)
        entity = entity_name or 'Object'
        fields_str = ', '.join(fields) if fields else 'Id, Name'
        sosl_query = f"FIND '{search_term}' IN ALL FIELDS RETURNING {entity}({fields_str})"
        return sosl_query

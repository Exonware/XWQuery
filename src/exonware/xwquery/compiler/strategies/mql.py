#!/usr/bin/env python3
"""
MQL Query Strategy
This module implements the MQL query strategy for MongoDB Query Language operations.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.1
Generation Date: January 2, 2025
"""

from typing import Any, Optional
from .base import ADocumentQueryStrategy
from .grammar_based import GrammarBasedStrategy
from ...errors import XWQueryValueError
from ...defs import QueryMode, QueryTrait
from exonware.xwnode.base import ANode


class MQLStrategy(GrammarBasedStrategy, ADocumentQueryStrategy):
    """MQL query strategy for MongoDB Query Language operations."""

    def __init__(self, **options):
        GrammarBasedStrategy.__init__(self, 'mql', **options)
        super().__init__(**options)
        self._mode = QueryMode.AUTO
        self._traits = QueryTrait.DOCUMENT | QueryTrait.STRUCTURED | QueryTrait.ANALYTICAL

    def execute(self, query: str, **kwargs) -> Any:
        """Execute MQL query."""
        if not self.validate_query(query):
            raise XWQueryValueError(f"Invalid MQL query: {query}")
        return {"result": "MQL query executed", "query": query}

    def validate_query(self, query: str) -> bool:
        """Validate MQL query syntax."""
        if not query or not isinstance(query, str):
            return False
        return any(op in query for op in ["find", "aggregate", "insert", "update", "delete", "createIndex"])

    def get_query_plan(self, query: str) -> dict[str, Any]:
        """Get MQL query execution plan."""
        return {
            "query_type": "MQL",
            "complexity": "MEDIUM",
            "estimated_cost": 80
        }

    def path_query(self, path: str) -> Any:
        """Execute path-based query."""
        return self.execute(f"db.collection.find({{{path}: {{$exists: true}}}})")

    def filter_query(self, filter_expression: str) -> Any:
        """Execute filter query."""
        return self.execute(f"db.collection.find({filter_expression})")

    def projection_query(self, fields: list[str]) -> Any:
        """Execute projection query."""
        projection = {field: 1 for field in fields}
        return self.execute(f"db.collection.find({{}}, {projection})")

    def sort_query(self, sort_fields: list[str], order: str = "asc") -> Any:
        """Execute sort query."""
        sort_order = 1 if order == "asc" else -1
        return self.execute(f"db.collection.find().sort({{{sort_fields[0]}: {sort_order}}})")

    def limit_query(self, limit: int, offset: int = 0) -> Any:
        """Execute limit query."""
        return self.execute(f"db.collection.find().skip({offset}).limit({limit})")
        # to_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)
        # Parse MQL query (e.g., "db.collection.find({field: value})" or aggregation pipeline)
        entity_name = None
        fields = []
        where_conditions = []
        # Extract collection name from db.collection.find(...)
        collection_match = re.search(r'db\.(\w+)\.find', query, re.IGNORECASE)
        if collection_match:
            entity_name = collection_match.group(1)
        # Extract filter conditions from find({...})
        find_match = re.search(r'\.find\(([^)]+)\)', query, re.IGNORECASE)
        if find_match:
            filter_str = find_match.group(1).strip()
            if filter_str and filter_str != '{}':
                try:
                    # Try to parse as JSON
                    serializer = _get_global_serializer('json')
                    filter_obj = serializer.loads(filter_str)
                    for key, value in filter_obj.items():
                        where_conditions.append(f"{key} = {value}")
                except (SerializationError, ValueError):
                    # Fallback: treat as simple string condition
                    where_conditions.append(filter_str)
        # Extract projection fields from find({}, {field1: 1, field2: 1})
        projection_match = re.search(r'\.find\([^)]+\),\s*(\{[^}]+\})', query, re.IGNORECASE)
        if projection_match:
            proj_str = projection_match.group(1)
            try:
                serializer = _get_global_serializer('json')
                proj_obj = serializer.loads(proj_str)
                fields = [k for k, v in proj_obj.items() if v == 1]
            except (SerializationError, ValueError):
                pass
        # Build actions tree
        children = []
        if entity_name:
            children.append({
                "type": "FROM",
                "id": "mql_from_1",
                "content": entity_name,
                "line_number": 1,
                "timestamp": datetime.now().isoformat(),
                "children": []
            })
        if where_conditions:
            where_content = " AND ".join(where_conditions)
            children.append({
                "type": "WHERE",
                "id": "mql_where_1",
                "content": where_content,
                "line_number": 1,
                "timestamp": datetime.now().isoformat(),
                "children": []
            })
        select_fields = ", ".join(fields) if fields else "*"
        select_action = {
            "type": "SELECT",
            "id": "mql_select_1",
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
                    "source_format": "MQL"
                }
            }
        }
        return ANode.from_native(actions)
        # from_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)
        # Build filter
        filter_obj = {}
        if where_conditions:
            for cond in where_conditions:
                if ' = ' in cond:
                    key, value = cond.split(' = ', 1)
                    filter_obj[key.strip()] = value.strip().strip('"\'')
        filter_str = str(filter_obj).replace("'", '"') if filter_obj else '{}'
        # Build projection
        if fields:
            proj_obj = {f: 1 for f in fields}
            proj_str = str(proj_obj).replace("'", '"')
            mql_query = f"db.{collection}.find({filter_str}, {proj_str})"
        else:
            mql_query = f"db.{collection}.find({filter_str})"
        return mql_query

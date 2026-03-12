#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/query/strategies/couchdb_mango.py
CouchDB Mango Query Strategy
This module implements the CouchDB Mango query strategy for CouchDB Mango Query (JSON selector language) operations.
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


class CouchDBMangoStrategy(GrammarBasedStrategy, ADocumentQueryStrategy):
    """CouchDB Mango query strategy for CouchDB Mango Query (JSON selector language) operations."""

    def __init__(self, **options):
        GrammarBasedStrategy.__init__(self, 'couchdbmango', **options)
        super().__init__(**options)
        self._mode = QueryMode.AUTO
        self._traits = QueryTrait.DOCUMENT | QueryTrait.STRUCTURED

    def execute(self, query: str, **kwargs) -> Any:
        """Execute CouchDB Mango query."""
        if not self.validate_query(query):
            raise XWQueryValueError(f"Invalid CouchDB Mango query: {query}")
        return {"result": "CouchDB Mango query executed", "query": query}

    def validate_query(self, query: str) -> bool:
        """Validate CouchDB Mango query syntax."""
        if not query or not isinstance(query, str):
            return False
        return any(op in query for op in ["selector", "fields", "sort", "limit", "skip", "$eq", "$gt", "$lt", "$and", "$or"])

    def get_query_plan(self, query: str) -> dict[str, Any]:
        """Get CouchDB Mango query execution plan."""
        return {
            "query_type": "COUCHDB_MANGO",
            "complexity": "MEDIUM",
            "estimated_cost": 80
        }

    def path_query(self, path: str) -> Any:
        """Execute path-based query."""
        return self.execute(f'{{"selector": {{"{path}": {{"$exists": true}} }} }}')

    def filter_query(self, filter_expression: str) -> Any:
        """Execute filter query."""
        return self.execute(f'{{"selector": {filter_expression} }}')

    def projection_query(self, fields: list[str]) -> Any:
        """Execute projection query."""
        fields_obj = {field: 1 for field in fields}
        return self.execute(f'{{"selector": {{}}, "fields": {fields_obj} }}')

    def sort_query(self, sort_fields: list[str], order: str = "asc") -> Any:
        """Execute sort query."""
        sort_order = [{"field": sort_fields[0], "direction": order}]
        return self.execute(f'{{"selector": {{}}, "sort": {sort_order} }}')

    def limit_query(self, limit: int, offset: int = 0) -> Any:
        """Execute limit query."""
        query_obj = {"selector": {}, "limit": limit, "skip": offset}
        return self.execute(str(query_obj).replace("'", '"'))
        # to_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)
        # Parse CouchDB Mango query (JSON selector format)
        entity_name = None
        fields = []
        where_conditions = []
        try:
            if query.startswith('{'):
                serializer = _get_global_serializer('json')
                mango_obj = serializer.loads(query)
                selector = mango_obj.get('selector', {})
                # Extract conditions from selector
                for key, value in selector.items():
                    if isinstance(value, dict):
                        # Handle operators like $eq, $gt, etc.
                        for op, op_value in value.items():
                            where_conditions.append(f"{key} {op} {op_value}")
                    else:
                        where_conditions.append(f"{key} = {value}")
                # Extract fields
                if 'fields' in mango_obj:
                    fields = list(mango_obj['fields'])
        except (SerializationError, ValueError, KeyError):
            pass
        # Build actions tree
        children = []
        if entity_name:
            children.append({
                "type": "FROM",
                "id": "couchdb_mango_from_1",
                "content": entity_name,
                "line_number": 1,
                "timestamp": datetime.now().isoformat(),
                "children": []
            })
        if where_conditions:
            where_content = " AND ".join(where_conditions)
            children.append({
                "type": "WHERE",
                "id": "couchdb_mango_where_1",
                "content": where_content,
                "line_number": 1,
                "timestamp": datetime.now().isoformat(),
                "children": []
            })
        select_fields = ", ".join(fields) if fields else "*"
        select_action = {
            "type": "SELECT",
            "id": "couchdb_mango_select_1",
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
                    "source_format": "COUCHDB_MANGO"
                }
            }
        }
        return ANode.from_native(actions)
        # from_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)
        # Build selector
        selector = {}
        for cond in where_conditions:
            if ' = ' in cond:
                key, value = cond.split(' = ', 1)
                selector[key.strip()] = value.strip().strip('"\'')
        mango_obj = {"selector": selector if selector else {}}
        if fields:
            mango_obj["fields"] = fields
        from exonware.xwsystem.io.serialization.serializer import _get_global_serializer
        serializer = _get_global_serializer('json')
        return serializer.dumps(mango_obj)

#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/query/strategies/json_patch.py
JSON Patch Query Strategy
This module implements the JSON Patch query strategy for JSON Patch (RFC 6902) operations.
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


class JSONPatchStrategy(GrammarBasedStrategy, ADocumentQueryStrategy):
    """JSON Patch query strategy for JSON Patch (RFC 6902) operations."""

    def __init__(self, **options):
        GrammarBasedStrategy.__init__(self, 'jsonpatch', **options)
        super().__init__(**options)
        self._mode = QueryMode.AUTO
        self._traits = QueryTrait.DOCUMENT | QueryTrait.STRUCTURED

    def execute(self, query: str, **kwargs) -> Any:
        """Execute JSON Patch query."""
        if not self.validate_query(query):
            raise XWQueryValueError(f"Invalid JSON Patch query: {query}")
        return {"result": "JSON Patch query executed", "query": query}

    def validate_query(self, query: str) -> bool:
        """Validate JSON Patch query syntax."""
        if not query or not isinstance(query, str):
            return False
        # JSON Patch uses operations: add, remove, replace, move, copy, test
        return any(op in query for op in ["add", "remove", "replace", "move", "copy", "test", "op", "path", "value", "from"])

    def get_query_plan(self, query: str) -> dict[str, Any]:
        """Get JSON Patch query execution plan."""
        return {
            "query_type": "JSON_PATCH",
            "complexity": "LOW",
            "estimated_cost": 50
        }

    def path_query(self, path: str) -> Any:
        """Execute path-based query."""
        return self.execute(f'[{{"op": "test", "path": "{path}", "value": null}}]')

    def filter_query(self, filter_expression: str) -> Any:
        """Execute filter query."""
        return self.execute(f'[{{"op": "test", "path": "/", "value": {filter_expression}}}]')

    def projection_query(self, fields: list[str]) -> Any:
        """Execute projection query."""
        # JSON Patch doesn't directly support projection, but we can use test operations
        from exonware.xwsystem.io.serialization.serializer import _get_global_serializer
        patch_ops = [{"op": "test", "path": f"/{field}", "value": None} for field in fields]
        serializer = _get_global_serializer('json')
        return self.execute(serializer.dumps(patch_ops))

    def sort_query(self, sort_fields: list[str], order: str = "asc") -> Any:
        """Execute sort query."""
        # JSON Patch doesn't support sorting directly
        return self.execute('[{"op": "test", "path": "/", "value": {}}]')

    def limit_query(self, limit: int, offset: int = 0) -> Any:
        """Execute limit query."""
        # JSON Patch doesn't support limit directly
        return self.execute('[{"op": "test", "path": "/", "value": {}}]')
        # to_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)
        # Parse JSON Patch query (array of patch operations)
        fields = []
        where_conditions = []
        try:
            if query.startswith('['):
                serializer = _get_global_serializer('json')
                patch_ops = serializer.loads(query)
                for op in patch_ops:
                    if isinstance(op, dict):
                        op_type = op.get('op', '')
                        path = op.get('path', '')
                        if path:
                            fields.append(path)
                        if op_type == 'test':
                            value = op.get('value')
                            if value is not None:
                                where_conditions.append(f"{path} = {value}")
        except (SerializationError, ValueError, KeyError):
            pass
        # Build actions tree
        children = []
        if where_conditions:
            where_content = " AND ".join(where_conditions)
            children.append({
                "type": "WHERE",
                "id": "json_patch_where_1",
                "content": where_content,
                "line_number": 1,
                "timestamp": datetime.now().isoformat(),
                "children": []
            })
        select_fields = ", ".join(fields) if fields else "*"
        select_action = {
            "type": "SELECT",
            "id": "json_patch_select_1",
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
                    "source_format": "JSON_PATCH"
                }
            }
        }
        return ANode.from_native(actions)
        # from_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)
        # Build patch operations
        patch_ops = []
        for field in fields:
            patch_ops.append({"op": "test", "path": f"/{field}", "value": None})
        if not patch_ops:
            patch_ops = [{"op": "test", "path": "/", "value": {}}]
        from exonware.xwsystem.io.serialization.serializer import _get_global_serializer
        serializer = _get_global_serializer('json')
        return serializer.dumps(patch_ops)

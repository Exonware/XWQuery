#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/query/strategies/opensearch_dsl.py
OpenSearch DSL Query Strategy
This module implements the OpenSearch DSL query strategy for OpenSearch Query DSL operations.
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
from exonware.xwsystem.io.serialization.serializer import _get_global_serializer
from exonware.xwsystem.io.serialization.errors import SerializationError
class OpenSearchDSLStrategy(GrammarBasedStrategy, AStructuredQueryStrategy):
    """OpenSearch DSL query strategy for OpenSearch Query DSL operations."""
    def __init__(self, **options):
        GrammarBasedStrategy.__init__(self, 'opensearchdsl', **options)
        super().__init__(**options)
        self._mode = QueryMode.AUTO
        self._traits = QueryTrait.DOCUMENT | QueryTrait.STRUCTURED | QueryTrait.SEARCH | QueryTrait.ANALYTICAL
    def execute(self, query: str, **kwargs) -> Any:
        """Execute OpenSearch DSL query."""
        if not self.validate_query(query):
            raise XWQueryValueError(f"Invalid OpenSearch DSL query: {query}")
        return {"result": "OpenSearch DSL query executed", "query": query}
    def validate_query(self, query: str) -> bool:
        """Validate OpenSearch DSL query syntax."""
        if not query or not isinstance(query, str):
            return False
        query_stripped = query.strip()
        # OpenSearch DSL is JSON-based
        if query_stripped.startswith('{'):
            try:
                serializer = _get_global_serializer('json')
                serializer.loads(query_stripped)
                return 'query' in query_stripped.lower() or 'match' in query_stripped.lower() or 'term' in query_stripped.lower()
            except SerializationError:
                return False
        return any(op in query_stripped for op in ["GET", "POST", "/_search", "match", "term", "bool"])
    def get_query_plan(self, query: str) -> dict[str, Any]:
        """Get OpenSearch DSL query execution plan."""
        return {
            "query_type": "OpenSearch_DSL",
            "complexity": "HIGH",
            "estimated_cost": 115
        }
    def select_query(self, table: str, columns: list[str], where_clause: str = None) -> Any:
        """Execute SELECT query."""
        query_obj = {
            "query": {
                "match_all": {}
            }
        }
        if where_clause:
            query_obj["query"] = {"match": {"_all": where_clause}}
        serializer = _get_global_serializer('json')
        return self.execute(serializer.dumps(query_obj))
    def insert_query(self, table: str, data: dict[str, Any]) -> Any:
        """Execute INSERT query."""
        return self.execute(f"POST /{table}/_doc")
    def update_query(self, table: str, data: dict[str, Any], where_clause: str = None) -> Any:
        """Execute UPDATE query."""
        return self.execute(f"POST /{table}/_update_by_query")
    def delete_query(self, table: str, where_clause: str = None) -> Any:
        """Execute DELETE query."""
        return self.execute(f"POST /{table}/_delete_by_query")
    def join_query(self, tables: list[str], join_conditions: list[str]) -> Any:
        """Execute JOIN query."""
        return self.execute(f"GET /{tables[0]}/_search")
    def aggregate_query(self, table: str, functions: list[str], group_by: list[str] = None) -> Any:
        """Execute aggregate query."""
        query_obj = {
            "size": 0,
            "aggs": {
                "group_by_field": {
                    "terms": {"field": group_by[0] if group_by else "_id"},
                    "aggs": {f"agg_{f}": {f: {"field": f}} for f in functions}
                }
            }
        }
        serializer = _get_global_serializer('json')
        return self.execute(serializer.dumps(query_obj))
        # to_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)
        # Parse OpenSearch DSL query (JSON-based)
        entity_name = None
        fields = []
        where_conditions = []
        # Try to parse as JSON
        dsl_obj = None
        if query.startswith('{'):
            try:
                serializer = _get_global_serializer('json')
                dsl_obj = serializer.loads(query)
            except SerializationError:
                pass
        # Extract index from GET/POST path or JSON structure
        index_match = re.search(r'(?:GET|POST)\s+/(\w+)/_search', query, re.IGNORECASE)
        if index_match:
            entity_name = index_match.group(1)
        if dsl_obj:
            # Extract query conditions
            if 'query' in dsl_obj:
                query_obj = dsl_obj['query']
                if 'match' in query_obj:
                    for field, value in query_obj['match'].items():
                        fields.append(field)
                        where_conditions.append(f"{field} = {value}")
                elif 'term' in query_obj:
                    for field, value in query_obj['term'].items():
                        fields.append(field)
                        where_conditions.append(f"{field} = {value}")
                elif 'bool' in query_obj:
                    bool_obj = query_obj['bool']
                    if 'must' in bool_obj:
                        for must_clause in bool_obj['must']:
                            if 'match' in must_clause:
                                for field, value in must_clause['match'].items():
                                    fields.append(field)
                                    where_conditions.append(f"{field} = {value}")
        # Build actions tree
        children = []
        if entity_name:
            children.append({
                "type": "FROM",
                "id": "opensearch_dsl_from_1",
                "content": entity_name,
                "line_number": 1,
                "timestamp": datetime.now().isoformat(),
                "children": []
            })
        if where_conditions:
            where_content = " AND ".join(where_conditions)
            children.append({
                "type": "WHERE",
                "id": "opensearch_dsl_where_1",
                "content": where_content,
                "line_number": 1,
                "timestamp": datetime.now().isoformat(),
                "children": []
            })
        select_fields = ", ".join(list(set(fields))) if fields else "*"
        select_action = {
            "type": "SELECT",
            "id": "opensearch_dsl_select_1",
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
                    "source_format": "OpenSearch_DSL"
                }
            }
        }
        return ANode.from_native(actions)
        # from_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)
            # Build match query
            query_obj = {"match": {}}
            for cond in where_conditions:
                if ' = ' in cond:
                    field, value = cond.split(' = ', 1)
                    field = field.strip()
                    value = value.strip().strip("'\"")
                    query_obj["match"][field] = value
            serializer = _get_global_serializer('json')
            dsl_query = serializer.dumps({"query": query_obj}, indent=2)
        else:
            dsl_query = '{"query": {"match_all": {}}}'
        return dsl_query

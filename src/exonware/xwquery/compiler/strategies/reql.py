#!/usr/bin/env python3
"""
ReQL Query Strategy
This module implements the ReQL (RethinkDB Query Language) query strategy.
ReQL is a chainable, functional query language for document databases.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.1
Generation Date: 20-Dec-2025
"""

import re
from typing import Any, Optional
from .base import ADocumentQueryStrategy
from .grammar_based import GrammarBasedStrategy
from ...errors import XWQueryTypeError, XWQueryValueError
from ...defs import QueryMode, QueryTrait
from exonware.xwnode.base import ANode


class ReQLStrategy(GrammarBasedStrategy, ADocumentQueryStrategy):
    """
    ReQL query strategy for RethinkDB Query Language operations.
    Supports:
    - Chainable functional query syntax
    - Real-time data manipulation
    - Document database operations
    - Filtering, mapping, reducing
    - Joins and aggregations
    """

    def __init__(self, **options):
        GrammarBasedStrategy.__init__(self, 'reql', **options)
        super().__init__(**options)
        self._mode = QueryMode.AUTO
        self._traits = QueryTrait.DOCUMENT | QueryTrait.STRUCTURED | QueryTrait.ANALYTICAL

    def execute(self, query: str, **kwargs) -> Any:
        """Execute ReQL query."""
        if not self.validate_query(query):
            raise XWQueryValueError(f"Invalid ReQL query: {query}")
        query_type = self._get_query_type(query)
        if query_type == "filter":
            return self._execute_filter(query, **kwargs)
        elif query_type == "map":
            return self._execute_map(query, **kwargs)
        elif query_type == "reduce":
            return self._execute_reduce(query, **kwargs)
        elif query_type == "get":
            return self._execute_get(query, **kwargs)
        elif query_type == "get_all":
            return self._execute_get_all(query, **kwargs)
        elif query_type == "insert":
            return self._execute_insert(query, **kwargs)
        elif query_type == "update":
            return self._execute_update(query, **kwargs)
        elif query_type == "delete":
            return self._execute_delete(query, **kwargs)
        else:
            raise XWQueryValueError(f"Unsupported query type: {query_type}")

    def validate_query(self, query: str) -> bool:
        """Validate ReQL query syntax."""
        if not query or not isinstance(query, str):
            return False
        # Basic ReQL validation - chainable method calls
        query = query.strip()
        # ReQL uses method chaining: r.table('users').filter(...).map(...)
        reql_patterns = [
            r'r\.table\s*\(',
            r'\.filter\s*\(',
            r'\.map\s*\(',
            r'\.reduce\s*\(',
            r'\.get\s*\(',
            r'\.get_all\s*\(',
            r'\.insert\s*\(',
            r'\.update\s*\(',
            r'\.delete\s*\(',
            r'\.order_by\s*\(',
            r'\.limit\s*\(',
            r'\.skip\s*\(',
            r'\.group\s*\(',
            r'\.join\s*\(',
        ]
        for pattern in reql_patterns:
            if re.search(pattern, query, re.IGNORECASE):
                return True
        return False

    def get_query_plan(self, query: str) -> dict[str, Any]:
        """Get ReQL query execution plan."""
        query_type = self._get_query_type(query)
        return {
            "query_type": query_type,
            "operation": query_type,
            "complexity": self._estimate_complexity(query),
            "estimated_cost": self._estimate_cost(query),
            "chain_operations": self._extract_chain_operations(query),
            "optimization_hints": self._get_optimization_hints(query)
        }

    def filter_query(self, filter_expression: str) -> Any:
        """Execute filter query."""
        query = f"r.table('collection').filter({filter_expression})"
        return self.execute(query)

    def projection_query(self, fields: list[str]) -> Any:
        """Execute projection query."""
        if len(fields) == 1:
            query = f"r.table('collection').map(r.row['{fields[0]}'])"
        else:
            field_dict = {field: f"r.row['{field}']" for field in fields}
            query = f"r.table('collection').map({field_dict})"
        return self.execute(query)

    def sort_query(self, sort_fields: list[str], order: str = "asc") -> Any:
        """Execute sort query."""
        if order.lower() == "desc":
            query = f"r.table('collection').order_by(r.desc('{sort_fields[0]}'))"
        else:
            query = f"r.table('collection').order_by('{sort_fields[0]}')"
        return self.execute(query)

    def limit_query(self, limit: int, offset: int = 0) -> Any:
        """Execute limit query."""
        if offset > 0:
            query = f"r.table('collection').skip({offset}).limit({limit})"
        else:
            query = f"r.table('collection').limit({limit})"
        return self.execute(query)

    def _get_query_type(self, query: str) -> str:
        """Extract query type from ReQL query."""
        query = query.strip().lower()
        if '.filter(' in query:
            return "filter"
        elif '.map(' in query:
            return "map"
        elif '.reduce(' in query:
            return "reduce"
        elif '.get(' in query:
            return "get"
        elif '.get_all(' in query:
            return "get_all"
        elif '.insert(' in query:
            return "insert"
        elif '.update(' in query:
            return "update"
        elif '.delete(' in query:
            return "delete"
        else:
            return "unknown"

    def _execute_filter(self, query: str, **kwargs) -> Any:
        """Execute ReQL filter query."""
        return {"result": "ReQL filter executed", "query": query}

    def _execute_map(self, query: str, **kwargs) -> Any:
        """Execute ReQL map query."""
        return {"result": "ReQL map executed", "query": query}

    def _execute_reduce(self, query: str, **kwargs) -> Any:
        """Execute ReQL reduce query."""
        return {"result": "ReQL reduce executed", "query": query}

    def _execute_get(self, query: str, **kwargs) -> Any:
        """Execute ReQL get query."""
        return {"result": "ReQL get executed", "query": query}

    def _execute_get_all(self, query: str, **kwargs) -> Any:
        """Execute ReQL get_all query."""
        return {"result": "ReQL get_all executed", "query": query}

    def _execute_insert(self, query: str, **kwargs) -> Any:
        """Execute ReQL insert query."""
        return {"result": "ReQL insert executed", "query": query}

    def _execute_update(self, query: str, **kwargs) -> Any:
        """Execute ReQL update query."""
        return {"result": "ReQL update executed", "query": query}

    def _execute_delete(self, query: str, **kwargs) -> Any:
        """Execute ReQL delete query."""
        return {"result": "ReQL delete executed", "query": query}

    def _estimate_complexity(self, query: str) -> str:
        """Estimate query complexity."""
        chain_ops = self._extract_chain_operations(query)
        if len(chain_ops) > 5:
            return "HIGH"
        elif len(chain_ops) > 2:
            return "MEDIUM"
        else:
            return "LOW"

    def _estimate_cost(self, query: str) -> int:
        """Estimate query cost."""
        complexity = self._estimate_complexity(query)
        if complexity == "HIGH":
            return 100
        elif complexity == "MEDIUM":
            return 50
        else:
            return 25

    def _extract_chain_operations(self, query: str) -> list[str]:
        """Extract chain operations from ReQL query."""
        operations = []
        reql_methods = [
            "table", "filter", "map", "reduce", "get", "get_all",
            "insert", "update", "delete", "order_by", "limit", "skip",
            "group", "join", "union", "distinct", "count", "sum", "avg",
            "min", "max", "pluck", "without", "merge", "append", "prepend"
        ]
        for method in reql_methods:
            if f".{method}(" in query.lower():
                operations.append(method)
        return operations

    def _get_optimization_hints(self, query: str) -> list[str]:
        """Get query optimization hints."""
        hints = []
        if ".count()" in query.lower():
            hints.append("Consider using indexed fields for count operations")
        if ".order_by(" in query.lower() and ".limit(" not in query.lower():
            hints.append("Consider adding limit() after order_by() for better performance")
        if ".filter(" in query.lower() and ".get(" not in query.lower():
            hints.append("Consider using get() with indexed fields instead of filter() when possible")
        return hints
        # to_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)
        # Parse ReQL query (e.g., "r.table('users').filter(r.row['age'] > 25).map(r.row['name'])")
        entity_name = None
        fields = []
        where_conditions = []
        # Extract table name from r.table('name')
        table_match = re.search(r"r\.table\(['\"](\w+)['\"]\)", query, re.IGNORECASE)
        if table_match:
            entity_name = table_match.group(1)
        # Extract filter conditions from .filter(...)
        filter_match = re.search(r'\.filter\(([^)]+)\)', query, re.IGNORECASE)
        if filter_match:
            filter_expr = filter_match.group(1).strip()
            # Simplify: extract condition from r.row expressions
            where_conditions.append(filter_expr)
        # Extract projection fields from .map(...) or .pluck(...)
        map_match = re.search(r'\.(?:map|pluck)\(([^)]+)\)', query, re.IGNORECASE)
        if map_match:
            map_expr = map_match.group(1).strip()
            # Extract field names from r.row['field'] patterns
            field_matches = re.findall(r"r\.row\['(\w+)'\]", map_expr)
            fields.extend(field_matches)
        # Build actions tree
        children = []
        if entity_name:
            children.append({
                "type": "FROM",
                "id": "reql_from_1",
                "content": entity_name,
                "line_number": 1,
                "timestamp": datetime.now().isoformat(),
                "children": []
            })
        if where_conditions:
            where_content = " AND ".join(where_conditions)
            children.append({
                "type": "WHERE",
                "id": "reql_where_1",
                "content": where_content,
                "line_number": 1,
                "timestamp": datetime.now().isoformat(),
                "children": []
            })
        select_fields = ", ".join(fields) if fields else "*"
        select_action = {
            "type": "SELECT",
            "id": "reql_select_1",
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
                    "source_format": "REQL"
                }
            }
        }
        return ANode.from_native(actions)

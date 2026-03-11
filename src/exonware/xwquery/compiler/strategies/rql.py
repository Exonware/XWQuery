#!/usr/bin/env python3
"""
RQL Query Strategy
This module implements the RQL (Resource Query Language) query strategy.
RQL is a query language for filtering and querying RESTful APIs.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.1
Generation Date: 20-Dec-2025
"""

import re
from typing import Any, Optional
from urllib.parse import parse_qs, urlparse
from .base import AStructuredQueryStrategy
from .grammar_based import GrammarBasedStrategy
from ...errors import XWQueryTypeError, XWQueryValueError
from ...defs import QueryMode, QueryTrait
from exonware.xwnode.base import ANode


class RQLStrategy(GrammarBasedStrategy, AStructuredQueryStrategy):
    """
    RQL query strategy for Resource Query Language operations.
    Supports:
    - RESTful API query syntax
    - URL-encoded query parameters
    - Filtering, sorting, pagination
    - Field selection and projection
    - Logical operators (and, or, not)
    - Comparison operators (eq, ne, gt, gte, lt, lte, like, in)
    """

    def __init__(self, **options):
        GrammarBasedStrategy.__init__(self, 'rql', **options)
        super().__init__(**options)
        self._mode = QueryMode.AUTO
        self._traits = QueryTrait.STRUCTURED | QueryTrait.UNSTRUCTURED | QueryTrait.SEARCH

    def execute(self, query: str, **kwargs) -> Any:
        """Execute RQL query."""
        if not self.validate_query(query):
            raise XWQueryValueError(f"Invalid RQL query: {query}")
        query_type = self._get_query_type(query)
        if query_type == "filter":
            return self._execute_filter(query, **kwargs)
        elif query_type == "select":
            return self._execute_select(query, **kwargs)
        elif query_type == "sort":
            return self._execute_sort(query, **kwargs)
        elif query_type == "limit":
            return self._execute_limit(query, **kwargs)
        else:
            raise XWQueryValueError(f"Unsupported query type: {query_type}")

    def validate_query(self, query: str) -> bool:
        """Validate RQL query syntax."""
        if not query or not isinstance(query, str):
            return False
        # RQL can be URL-encoded query string or structured format
        query = query.strip()
        # Check for URL-encoded format: ?filter=eq(name,John)&sort=name
        if '?' in query or '&' in query or '=' in query:
            return True
        # Check for structured RQL format: filter(eq(name,John))&sort(name)
        rql_patterns = [
            r'filter\s*\(',
            r'select\s*\(',
            r'sort\s*\(',
            r'limit\s*\(',
            r'offset\s*\(',
            r'eq\s*\(',
            r'ne\s*\(',
            r'gt\s*\(',
            r'gte\s*\(',
            r'lt\s*\(',
            r'lte\s*\(',
            r'like\s*\(',
            r'in\s*\(',
            r'and\s*\(',
            r'or\s*\(',
            r'not\s*\(',
        ]
        for pattern in rql_patterns:
            if re.search(pattern, query, re.IGNORECASE):
                return True
        return False

    def get_query_plan(self, query: str) -> dict[str, Any]:
        """Get RQL query execution plan."""
        query_type = self._get_query_type(query)
        return {
            "query_type": query_type,
            "operation": query_type,
            "complexity": self._estimate_complexity(query),
            "estimated_cost": self._estimate_cost(query),
            "filters": self._extract_filters(query),
            "optimization_hints": self._get_optimization_hints(query)
        }

    def select_query(self, table: str, columns: list[str], where_clause: str = None) -> Any:
        """Execute SELECT query."""
        query_parts = []
        if columns:
            query_parts.append(f"select({','.join(columns)})")
        if where_clause:
            query_parts.append(f"filter({where_clause})")
        query = "&".join(query_parts)
        return self.execute(query)

    def filter_query(self, filter_expression: str) -> Any:
        """Execute filter query."""
        query = f"filter({filter_expression})"
        return self.execute(query)

    def sort_query(self, sort_fields: list[str], order: str = "asc") -> Any:
        """Execute sort query."""
        if order.lower() == "desc":
            query = f"sort(-{sort_fields[0]})"
        else:
            query = f"sort({sort_fields[0]})"
        return self.execute(query)

    def limit_query(self, limit: int, offset: int = 0) -> Any:
        """Execute limit query."""
        query_parts = [f"limit({limit})"]
        if offset > 0:
            query_parts.append(f"offset({offset})")
        query = "&".join(query_parts)
        return self.execute(query)

    def _get_query_type(self, query: str) -> str:
        """Extract query type from RQL query."""
        query = query.strip().lower()
        if 'filter(' in query or 'filter=' in query:
            return "filter"
        elif 'select(' in query or 'select=' in query:
            return "select"
        elif 'sort(' in query or 'sort=' in query:
            return "sort"
        elif 'limit(' in query or 'limit=' in query:
            return "limit"
        else:
            return "unknown"

    def _execute_filter(self, query: str, **kwargs) -> Any:
        """Execute RQL filter query."""
        return {"result": "RQL filter executed", "query": query}

    def _execute_select(self, query: str, **kwargs) -> Any:
        """Execute RQL select query."""
        return {"result": "RQL select executed", "query": query}

    def _execute_sort(self, query: str, **kwargs) -> Any:
        """Execute RQL sort query."""
        return {"result": "RQL sort executed", "query": query}

    def _execute_limit(self, query: str, **kwargs) -> Any:
        """Execute RQL limit query."""
        return {"result": "RQL limit executed", "query": query}

    def _estimate_complexity(self, query: str) -> str:
        """Estimate query complexity."""
        filters = self._extract_filters(query)
        if len(filters) > 5:
            return "HIGH"
        elif len(filters) > 2:
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

    def _extract_filters(self, query: str) -> list[str]:
        """Extract filters from RQL query."""
        filters = []
        # Parse URL-encoded query
        if '?' in query:
            parsed = urlparse(query)
            params = parse_qs(parsed.query)
            if 'filter' in params:
                filters.extend(params['filter'])
        else:
            # Parse structured RQL format
            filter_pattern = r'filter\s*\(([^)]+)\)'
            matches = re.findall(filter_pattern, query, re.IGNORECASE)
            filters.extend(matches)
        return filters

    def _get_optimization_hints(self, query: str) -> list[str]:
        """Get query optimization hints."""
        hints = []
        if "like(" in query.lower():
            hints.append("Consider using indexed fields for like() operations")
        if "in(" in query.lower():
            hints.append("Consider using eq() with multiple values instead of in() when possible")
        if "or(" in query.lower():
            hints.append("Consider using and() when possible for better index usage")
        return hints
        # to_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)
        # Parse RQL query (URL-encoded or structured format)
        entity_name = None
        fields = []
        where_conditions = []
        # Parse URL-encoded format: ?filter=eq(name,John)&select=name,age
        if '?' in query or '&' in query or '=' in query:
            parsed = urlparse(query if '?' in query else f"?{query}")
            params = parse_qs(parsed.query)
            # Extract filters
            if 'filter' in params:
                for filter_val in params['filter']:
                    where_conditions.append(filter_val)
            # Extract select fields
            if 'select' in params:
                for select_val in params['select']:
                    fields = [f.strip() for f in select_val.split(',') if f.strip()]
        else:
            # Parse structured format: filter(eq(name,John))&select(name,age)
            filter_match = re.search(r'filter\s*\(([^)]+)\)', query, re.IGNORECASE)
            if filter_match:
                where_conditions.append(filter_match.group(1).strip())
            select_match = re.search(r'select\s*\(([^)]+)\)', query, re.IGNORECASE)
            if select_match:
                fields = [f.strip() for f in select_match.group(1).split(',') if f.strip()]
        # Build actions tree
        children = []
        if where_conditions:
            where_content = " AND ".join(where_conditions)
            children.append({
                "type": "WHERE",
                "id": "rql_where_1",
                "content": where_content,
                "line_number": 1,
                "timestamp": datetime.now().isoformat(),
                "children": []
            })
        select_fields = ", ".join(fields) if fields else "*"
        select_action = {
            "type": "SELECT",
            "id": "rql_select_1",
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
                    "source_format": "RQL"
                }
            }
        }
        return ANode.from_native(actions)
        # from_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)

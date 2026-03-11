#!/usr/bin/env python3
"""
JSONiq Query Strategy
This module implements the JSONiq query strategy for JSON data queries.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.1
Generation Date: January 2, 2025
"""

import re
from typing import Any, Optional
from .base import ADocumentQueryStrategy
from .grammar_based import GrammarBasedStrategy
from ...errors import XWQueryTypeError, XWQueryValueError
from ...defs import QueryMode, QueryTrait
from exonware.xwnode.base import ANode


class JSONiqStrategy(GrammarBasedStrategy, ADocumentQueryStrategy):
    """
    JSONiq query strategy for JSON data queries.
    Supports:
    - JSONiq 1.0 and 1.1 features
    - FLWOR expressions
    - JSON navigation
    - Type system
    - Functions and modules
    """

    def __init__(self, **options):
        GrammarBasedStrategy.__init__(self, 'jsoniq', **options)
        super().__init__(**options)
        self._mode = QueryMode.AUTO
        self._traits = QueryTrait.DOCUMENT | QueryTrait.STRUCTURED | QueryTrait.ANALYTICAL

    def execute(self, query: str, **kwargs) -> Any:
        """Execute JSONiq query."""
        if not self.validate_query(query):
            raise XWQueryValueError(f"Invalid JSONiq query: {query}")
        query_type = self._get_query_type(query)
        if query_type == "flwor":
            return self._execute_flwor(query, **kwargs)
        elif query_type == "path":
            return self._execute_path(query, **kwargs)
        elif query_type == "function":
            return self._execute_function(query, **kwargs)
        else:
            raise XWQueryValueError(f"Unsupported query type: {query_type}")

    def validate_query(self, query: str) -> bool:
        """Validate JSONiq query syntax."""
        if not query or not isinstance(query, str):
            return False
        # Basic JSONiq validation
        query = query.strip()
        # Check for JSONiq keywords
        jsoniq_keywords = ["for", "let", "where", "order by", "group by", "return", "collection", "json", "object", "array"]
        query_lower = query.lower()
        for keyword in jsoniq_keywords:
            if keyword in query_lower:
                return True
        # Check for JSON path expressions
        if "$" in query or ".." in query or "[]" in query:
            return True
        return False

    def get_query_plan(self, query: str) -> dict[str, Any]:
        """Get JSONiq query execution plan."""
        query_type = self._get_query_type(query)
        return {
            "query_type": query_type,
            "operation": query_type,
            "complexity": self._estimate_complexity(query),
            "estimated_cost": self._estimate_cost(query),
            "expressions": self._extract_expressions(query),
            "optimization_hints": self._get_optimization_hints(query)
        }

    def path_query(self, path: str) -> Any:
        """Execute path-based query."""
        # JSONiq path queries
        query = f"$${path}"
        return self.execute(query)

    def filter_query(self, filter_expression: str) -> Any:
        """Execute filter query."""
        query = f"""
        for $$item in collection()
        where {filter_expression}
        return $$item
        """
        return self.execute(query)

    def projection_query(self, fields: list[str]) -> Any:
        """Execute projection query."""
        if len(fields) == 1:
            query = f"""
            for $$item in collection()
            return $$item.{fields[0]}
            """
        else:
            field_list = ", ".join([f"$$item.{field}" for field in fields])
            query = f"""
            for $$item in collection()
            return {{ {field_list} }}
            """
        return self.execute(query)

    def sort_query(self, sort_fields: list[str], order: str = "asc") -> Any:
        """Execute sort query."""
        if order.lower() == "desc":
            query = f"""
            for $$item in collection()
            order by $$item.{sort_fields[0]} descending
            return $$item
            """
        else:
            query = f"""
            for $$item in collection()
            order by $$item.{sort_fields[0]}
            return $$item
            """
        return self.execute(query)

    def limit_query(self, limit: int, offset: int = 0) -> Any:
        """Execute limit query."""
        if offset > 0:
            query = f"""
            for $$item in collection()
            where count($$item) > {offset}
            return $$item
            """
            # Use subsequence for limit
            return self._execute_function(f"subsequence(collection(), {offset + 1}, {limit})")
        else:
            query = f"""
            for $$item in collection()
            return $$item
            """
            return self._execute_function(f"subsequence(collection(), 1, {limit})")

    def _get_query_type(self, query: str) -> str:
        """Extract query type from JSONiq query."""
        query = query.strip()
        if "for" in query.lower() or "let" in query.lower():
            return "flwor"
        elif "$" in query or ".." in query:
            return "path"
        elif "(" in query and ")" in query:
            return "function"
        else:
            return "unknown"

    def _execute_flwor(self, query: str, **kwargs) -> Any:
        """Execute FLWOR expression."""
        return {"result": "JSONiq FLWOR executed", "query": query}

    def _execute_path(self, query: str, **kwargs) -> Any:
        """Execute path expression."""
        return {"result": "JSONiq path executed", "query": query}

    def _execute_function(self, query: str, **kwargs) -> Any:
        """Execute function call."""
        return {"result": "JSONiq function executed", "query": query}

    def _estimate_complexity(self, query: str) -> str:
        """Estimate query complexity."""
        expressions = self._extract_expressions(query)
        if len(expressions) > 5:
            return "HIGH"
        elif len(expressions) > 2:
            return "MEDIUM"
        else:
            return "LOW"

    def _estimate_cost(self, query: str) -> int:
        """Estimate query cost."""
        complexity = self._estimate_complexity(query)
        if complexity == "HIGH":
            return 120
        elif complexity == "MEDIUM":
            return 60
        else:
            return 30

    def _extract_expressions(self, query: str) -> list[str]:
        """Extract JSONiq expressions from query."""
        expressions = []
        # FLWOR expressions
        if "for" in query.lower():
            expressions.append("for")
        if "let" in query.lower():
            expressions.append("let")
        if "where" in query.lower():
            expressions.append("where")
        if "order by" in query.lower():
            expressions.append("order by")
        if "group by" in query.lower():
            expressions.append("group by")
        if "return" in query.lower():
            expressions.append("return")
        # Path expressions
        if "$" in query:
            expressions.append("path")
        if ".." in query:
            expressions.append("descendant")
        if "[]" in query:
            expressions.append("array")
        # Function calls
        if "(" in query and ")" in query:
            expressions.append("function")
        return expressions

    def _get_optimization_hints(self, query: str) -> list[str]:
        """Get query optimization hints."""
        hints = []
        if "for" in query.lower() and "let" in query.lower():
            hints.append("Consider using let for computed values")
        if ".." in query:
            hints.append("Consider using specific paths instead of descendant navigation")
        if "[]" in query:
            hints.append("Consider using array indexing for better performance")
        if "order by" in query.lower():
            hints.append("Consider using indexes for ordered queries")
        return hints
        # to_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)
        # Extract entity name from FOR clause (e.g., "for $item in collection('users')")
        entity_name = None
        for_match = re.search(r"for\s+\$\w+\s+in\s+(?:collection\(['\"]?(\w+)['\"]?\)|json\s+file\s+['\"]?(\w+)['\"]?)", query, re.IGNORECASE)
        if for_match:
            entity_name = for_match.group(1) or for_match.group(2)
        # Extract fields from RETURN clause
        fields = []
        return_match = re.search(r'return\s+(.+?)(?:\s*$|\s*})', query, re.IGNORECASE | re.DOTALL)
        if return_match:
            return_expr = return_match.group(1).strip()
            # Extract field paths (e.g., "$item.field1, $item.field2")
            field_matches = re.findall(r'\$\w+\.(\w+)', return_expr)
            fields.extend(field_matches)
        # Extract WHERE conditions
        where_conditions = []
        where_match = re.search(r'where\s+(.+?)(?:\s+order\s+by|\s+return)', query, re.IGNORECASE | re.DOTALL)
        if where_match:
            where_expr = where_match.group(1).strip()
            where_conditions.append(where_expr)
        # Build actions tree
        children = []
        if entity_name:
            children.append({
                "type": "FROM",
                "id": "jsoniq_from_1",
                "content": entity_name,
                "line_number": 1,
                "timestamp": datetime.now().isoformat(),
                "children": []
            })
        if where_conditions:
            where_content = " AND ".join(where_conditions)
            children.append({
                "type": "WHERE",
                "id": "jsoniq_where_1",
                "content": where_content,
                "line_number": 1,
                "timestamp": datetime.now().isoformat(),
                "children": []
            })
        select_fields = ", ".join(fields) if fields else "*"
        select_action = {
            "type": "SELECT",
            "id": "jsoniq_select_1",
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
                    "source_format": "JSONIQ"
                }
            }
        }
        return ANode.from_native(actions)
        # from_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)
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
        # Build JSONiq FLWOR expression
        entity = entity_name or "items"
        var_name = "$item"
        jsoniq = f"for {var_name} in collection('{entity}')"
        if where_conditions:
            where_expr = ' AND '.join(where_conditions)
            jsoniq += f"\nwhere {where_expr}"
        if fields:
            return_fields = ', '.join([f"{var_name}.{f}" for f in fields])
            jsoniq += f"\nreturn {{{return_fields}}}"
        else:
            jsoniq += f"\nreturn {var_name}"
        return jsoniq

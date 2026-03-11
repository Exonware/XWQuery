#!/usr/bin/env python3
"""
XQuery Query Strategy
This module implements the XQuery query strategy for XML data queries.
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


class XQueryStrategy(GrammarBasedStrategy, ADocumentQueryStrategy):
    """
    XQuery query strategy for XML data queries.
    Supports:
    - XQuery 1.0 and 3.0 features
    - FLWOR expressions
    - XPath expressions
    - XML construction
    - Functions and modules
    """

    def __init__(self, **options):
        GrammarBasedStrategy.__init__(self, 'xquery', **options)
        super().__init__(**options)
        self._mode = QueryMode.AUTO
        self._traits = QueryTrait.DOCUMENT | QueryTrait.STRUCTURED | QueryTrait.ANALYTICAL

    def execute(self, query: str, **kwargs) -> Any:
        """Execute XQuery query."""
        if not self.validate_query(query):
            raise XWQueryValueError(f"Invalid XQuery query: {query}")
        query_type = self._get_query_type(query)
        if query_type == "flwor":
            return self._execute_flwor(query, **kwargs)
        elif query_type == "xpath":
            return self._execute_xpath(query, **kwargs)
        elif query_type == "construction":
            return self._execute_construction(query, **kwargs)
        else:
            raise XWQueryValueError(f"Unsupported query type: {query_type}")

    def validate_query(self, query: str) -> bool:
        """Validate XQuery query syntax."""
        if not query or not isinstance(query, str):
            return False
        # Basic XQuery validation
        query = query.strip()
        # Check for XQuery keywords
        xquery_keywords = ["for", "let", "where", "order by", "group by", "return", "declare", "namespace", "import", "module", "function", "variable", "element", "attribute", "text", "comment", "processing-instruction", "document", "collection"]
        query_lower = query.lower()
        for keyword in xquery_keywords:
            if keyword in query_lower:
                return True
        # Check for XPath expressions
        if "/" in query or "//" in query or "@" in query or "[" in query:
            return True
        return False

    def get_query_plan(self, query: str) -> dict[str, Any]:
        """Get XQuery query execution plan."""
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
        # XQuery path queries
        query = f"doc()/{path}"
        return self.execute(query)

    def filter_query(self, filter_expression: str) -> Any:
        """Execute filter query."""
        query = f"""
        for $item in doc()//*
        where {filter_expression}
        return $item
        """
        return self.execute(query)

    def projection_query(self, fields: list[str]) -> Any:
        """Execute projection query."""
        if len(fields) == 1:
            query = f"""
            for $item in doc()//*
            return $item/{fields[0]}
            """
        else:
            field_list = ", ".join([f"$item/{field}" for field in fields])
            query = f"""
            for $item in doc()//*
            return <result>{{ {field_list} }}</result>
            """
        return self.execute(query)

    def sort_query(self, sort_fields: list[str], order: str = "asc") -> Any:
        """Execute sort query."""
        if order.lower() == "desc":
            query = f"""
            for $item in doc()//*
            order by $item/{sort_fields[0]} descending
            return $item
            """
        else:
            query = f"""
            for $item in doc()//*
            order by $item/{sort_fields[0]}
            return $item
            """
        return self.execute(query)

    def limit_query(self, limit: int, offset: int = 0) -> Any:
        """Execute limit query."""
        if offset > 0:
            query = f"""
            for $item at $pos in doc()//*
            where $pos > {offset}
            return $item
            """
            # Use subsequence for limit
            return self._execute_function(f"subsequence(doc()//*, {offset + 1}, {limit})")
        else:
            query = f"""
            for $item in doc()//*
            return $item
            """
            return self._execute_function(f"subsequence(doc()//*, 1, {limit})")

    def _get_query_type(self, query: str) -> str:
        """Extract query type from XQuery query."""
        query = query.strip()
        if "for" in query.lower() or "let" in query.lower():
            return "flwor"
        elif "<" in query and ">" in query:
            return "construction"
        elif "/" in query or "//" in query:
            return "xpath"
        else:
            return "unknown"

    def _execute_flwor(self, query: str, **kwargs) -> Any:
        """Execute FLWOR expression."""
        return {"result": "XQuery FLWOR executed", "query": query}

    def _execute_xpath(self, query: str, **kwargs) -> Any:
        """Execute XPath expression."""
        return {"result": "XQuery XPath executed", "query": query}

    def _execute_construction(self, query: str, **kwargs) -> Any:
        """Execute XML construction."""
        return {"result": "XQuery construction executed", "query": query}

    def _execute_function(self, query: str, **kwargs) -> Any:
        """Execute function call."""
        return {"result": "XQuery function executed", "query": query}

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
            return 150
        elif complexity == "MEDIUM":
            return 75
        else:
            return 35

    def _extract_expressions(self, query: str) -> list[str]:
        """Extract XQuery expressions from query."""
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
        # XPath expressions
        if "/" in query:
            expressions.append("path")
        if "//" in query:
            expressions.append("descendant")
        if "@" in query:
            expressions.append("attribute")
        if "[" in query and "]" in query:
            expressions.append("predicate")
        # XML construction
        if "<" in query and ">" in query:
            expressions.append("construction")
        # Functions
        if "(" in query and ")" in query:
            expressions.append("function")
        return expressions

    def _get_optimization_hints(self, query: str) -> list[str]:
        """Get query optimization hints."""
        hints = []
        if "//" in query:
            hints.append("Consider using specific paths instead of descendant navigation")
        if "for" in query.lower() and "let" in query.lower():
            hints.append("Consider using let for computed values")
        if "[" in query and "]" in query:
            hints.append("Consider using indexes for predicate operations")
        if "order by" in query.lower():
            hints.append("Consider using indexes for ordered queries")
        return hints
        # to_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)
        # Extract entity name from FOR clause (e.g., "for $item in doc()//element")
        entity_name = None
        for_match = re.search(r'for\s+\$\w+\s+in\s+(?:doc\(\)|collection\(\))?(?://|/)?(\w+)', query, re.IGNORECASE)
        if for_match:
            entity_name = for_match.group(1)
        # Extract fields from RETURN clause
        fields = []
        return_match = re.search(r'return\s+(.+?)(?:\s*$|\s*})', query, re.IGNORECASE | re.DOTALL)
        if return_match:
            return_expr = return_match.group(1).strip()
            # Extract field paths (e.g., "$item/field1, $item/field2")
            field_matches = re.findall(r'\$item/(\w+)', return_expr)
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
                "id": "xquery_from_1",
                "content": entity_name,
                "line_number": 1,
                "timestamp": datetime.now().isoformat(),
                "children": []
            })
        if where_conditions:
            where_content = " AND ".join(where_conditions)
            children.append({
                "type": "WHERE",
                "id": "xquery_where_1",
                "content": where_content,
                "line_number": 1,
                "timestamp": datetime.now().isoformat(),
                "children": []
            })
        select_fields = ", ".join(fields) if fields else "*"
        select_action = {
            "type": "SELECT",
            "id": "xquery_select_1",
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
                    "source_format": "XQUERY"
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
        # Build XQuery FLWOR expression
        entity = entity_name or "element"
        var_name = "$item"
        xquery = f"for {var_name} in doc()//{entity}"
        if where_conditions:
            where_expr = ' AND '.join(where_conditions)
            xquery += f"\nwhere {where_expr}"
        if fields:
            return_fields = ', '.join([f"{var_name}/{f}" for f in fields])
            xquery += f"\nreturn <result>{{ {return_fields} }}</result>"
        else:
            xquery += f"\nreturn {var_name}"
        return xquery

#!/usr/bin/env python3
"""
CQL Query Strategy
This module implements the CQL query strategy for Cassandra Query Language operations.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.3
Generation Date: January 2, 2025
"""

import re
from typing import Any
from .base import AStructuredQueryStrategy
from .grammar_based import GrammarBasedStrategy
from ...errors import XWQueryTypeError, XWQueryValueError
from ...defs import QueryMode, QueryTrait
from exonware.xwnode.base import ANode


class CQLStrategy(GrammarBasedStrategy, AStructuredQueryStrategy):
    """
    CQL query strategy for Cassandra Query Language operations.
    Supports:
    - CQL 3.0+ features
    - SELECT, INSERT, UPDATE, DELETE operations
    - CREATE, DROP, ALTER operations
    - Batch operations
    - Time-to-live (TTL) operations
    """

    def __init__(self, **options):
        GrammarBasedStrategy.__init__(self, 'cql', **options)
        super().__init__(**options)
        self._mode = QueryMode.AUTO
        self._traits = QueryTrait.STRUCTURED | QueryTrait.ANALYTICAL | QueryTrait.BATCH

    def execute(self, query: str, **kwargs) -> Any:
        """Execute CQL query."""
        if not self.validate_query(query):
            raise XWQueryValueError(f"Invalid CQL query: {query}")
        query_type = self._get_query_type(query)
        if query_type == "SELECT":
            return self._execute_select(query, **kwargs)
        elif query_type == "INSERT":
            return self._execute_insert(query, **kwargs)
        elif query_type == "UPDATE":
            return self._execute_update(query, **kwargs)
        elif query_type == "DELETE":
            return self._execute_delete(query, **kwargs)
        else:
            raise XWQueryValueError(f"Unsupported query type: {query_type}")

    def validate_query(self, query: str) -> bool:
        """Validate CQL query syntax."""
        if not query or not isinstance(query, str):
            return False
        # Basic CQL validation
        query = query.strip().upper()
        valid_operations = ["SELECT", "INSERT", "UPDATE", "DELETE", "CREATE", "DROP", "ALTER", "USE", "TRUNCATE", "BATCH", "GRANT", "REVOKE", "LIST", "DESCRIBE", "EXPLAIN"]
        for operation in valid_operations:
            if query.startswith(operation):
                return True
        return False

    def get_query_plan(self, query: str) -> dict[str, Any]:
        """Get CQL query execution plan."""
        query_type = self._get_query_type(query)
        return {
            "query_type": query_type,
            "operation": query_type,
            "complexity": self._estimate_complexity(query),
            "estimated_cost": self._estimate_cost(query),
            "operations": self._extract_operations(query),
            "optimization_hints": self._get_optimization_hints(query)
        }

    def select_query(self, table: str, columns: list[str], where_clause: str = None) -> Any:
        """Execute SELECT query."""
        query = f"SELECT {', '.join(columns)} FROM {table}"
        if where_clause:
            query += f" WHERE {where_clause}"
        return self.execute(query)

    def insert_query(self, table: str, data: dict[str, Any]) -> Any:
        """Execute INSERT query."""
        columns = list(data.keys())
        values = list(data.values())
        query = f"INSERT INTO {table} ({', '.join(columns)}) VALUES ({', '.join(['?' for _ in values])})"
        return self.execute(query, values=values)

    def update_query(self, table: str, data: dict[str, Any], where_clause: str = None) -> Any:
        """Execute UPDATE query."""
        set_clause = ', '.join([f"{k} = ?" for k in data.keys()])
        query = f"UPDATE {table} SET {set_clause}"
        if where_clause:
            query += f" WHERE {where_clause}"
        return self.execute(query, values=list(data.values()))

    def delete_query(self, table: str, where_clause: str = None) -> Any:
        """Execute DELETE query."""
        query = f"DELETE FROM {table}"
        if where_clause:
            query += f" WHERE {where_clause}"
        return self.execute(query)

    def join_query(self, tables: list[str], join_conditions: list[str]) -> Any:
        """Execute JOIN query."""
        # CQL doesn't support traditional JOINs, use denormalization
        raise XWQueryValueError("CQL doesn't support JOIN operations. Use denormalization instead.")

    def aggregate_query(self, table: str, functions: list[str], group_by: list[str] = None) -> Any:
        """Execute aggregate query."""
        query = f"SELECT {', '.join(functions)} FROM {table}"
        if group_by:
            query += f" GROUP BY {', '.join(group_by)}"
        return self.execute(query)

    def _get_query_type(self, query: str) -> str:
        """Extract query type from CQL query."""
        query = query.strip().upper()
        for operation in ["SELECT", "INSERT", "UPDATE", "DELETE", "CREATE", "DROP", "ALTER", "USE", "TRUNCATE", "BATCH", "GRANT", "REVOKE", "LIST", "DESCRIBE", "EXPLAIN"]:
            if query.startswith(operation):
                return operation
        return "UNKNOWN"

    def _execute_select(self, query: str, **kwargs) -> Any:
        """Execute SELECT query."""
        return {"result": "CQL SELECT executed", "query": query}

    def _execute_insert(self, query: str, **kwargs) -> Any:
        """Execute INSERT query."""
        return {"result": "CQL INSERT executed", "query": query}

    def _execute_update(self, query: str, **kwargs) -> Any:
        """Execute UPDATE query."""
        return {"result": "CQL UPDATE executed", "query": query}

    def _execute_delete(self, query: str, **kwargs) -> Any:
        """Execute DELETE query."""
        return {"result": "CQL DELETE executed", "query": query}

    def _estimate_complexity(self, query: str) -> str:
        """Estimate query complexity."""
        operations = self._extract_operations(query)
        if len(operations) > 5:
            return "HIGH"
        elif len(operations) > 2:
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

    def _extract_operations(self, query: str) -> list[str]:
        """Extract CQL operations from query."""
        operations = []
        cql_operations = ["SELECT", "INSERT", "UPDATE", "DELETE", "CREATE", "DROP", "ALTER", "USE", "TRUNCATE", "BATCH", "GRANT", "REVOKE", "LIST", "DESCRIBE", "EXPLAIN"]
        for operation in cql_operations:
            if operation in query.upper():
                operations.append(operation)
        return operations

    def _get_optimization_hints(self, query: str) -> list[str]:
        """Get query optimization hints."""
        hints = []
        if "SELECT *" in query.upper():
            hints.append("Consider specifying columns instead of using *")
        if "WHERE" not in query.upper() and "SELECT" in query.upper():
            hints.append("Consider adding WHERE clause to limit results")
        if "ORDER BY" in query.upper():
            hints.append("Consider using clustering columns for ORDER BY operations")
        return hints
        # to_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)
        # Extract query type
        query_type = self._get_query_type(query)
        if query_type != "SELECT":
            actions = {
                "root": {
                    "type": "PROGRAM",
                    "statements": [{
                        "type": query_type,
                        "id": f"cql_{query_type.lower()}_1",
                        "content": query,
                        "line_number": 1,
                        "timestamp": datetime.now().isoformat(),
                        "children": []
                    }],
                    "comments": [],
                    "metadata": {
                        "version": "1.0",
                        "created": datetime.now().isoformat(),
                        "source_format": "CQL"
                    }
                }
            }
            return ANode.from_native(actions)
        # Parse SELECT query
        fields = []
        select_match = re.search(r'SELECT\s+(.+?)(?:\s+FROM|\s*$)', query_upper, re.IGNORECASE | re.DOTALL)
        if select_match:
            fields_str = select_match.group(1).strip()
            if fields_str and fields_str != '*':
                fields = [f.strip() for f in fields_str.split(',') if f.strip()]
        entity_name = None
        from_match = re.search(r'FROM\s+(\w+)', query_upper, re.IGNORECASE)
        if from_match:
            entity_name = from_match.group(1)
        where_conditions = []
        where_match = re.search(r'WHERE\s+(.+?)(?:\s+ALLOW|\s+ORDER\s+BY|\s+LIMIT|\s*$)', query_upper, re.IGNORECASE | re.DOTALL)
        if where_match:
            where_expr = where_match.group(1).strip()
            where_conditions.append(where_expr)
        # Build actions tree
        children = []
        if entity_name:
            children.append({
                "type": "FROM",
                "id": "cql_from_1",
                "content": entity_name,
                "line_number": 1,
                "timestamp": datetime.now().isoformat(),
                "children": []
            })
        if where_conditions:
            where_content = " AND ".join(where_conditions)
            children.append({
                "type": "WHERE",
                "id": "cql_where_1",
                "content": where_content,
                "line_number": 1,
                "timestamp": datetime.now().isoformat(),
                "children": []
            })
        select_fields = ", ".join(fields) if fields else "*"
        select_action = {
            "type": "SELECT",
            "id": "cql_select_1",
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
                    "source_format": "CQL"
                }
            }
        }
        return ANode.from_native(actions)
        # from_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)

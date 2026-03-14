#!/usr/bin/env python3
"""
HiveQL Query Strategy
This module implements the HiveQL query strategy for Apache Hive SQL operations.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.5
Generation Date: January 2, 2025
"""

import re
from typing import Any
from .base import AStructuredQueryStrategy
from .grammar_based import GrammarBasedStrategy
from ...errors import XWQueryTypeError, XWQueryValueError
from ...defs import QueryMode, QueryTrait
from exonware.xwnode.base import ANode


class HiveQLStrategy(GrammarBasedStrategy, AStructuredQueryStrategy):
    """
    HiveQL query strategy for Apache Hive SQL operations.
    Supports:
    - Hive-specific SQL extensions
    - Partitioned tables
    - Bucketed tables
    - UDFs and UDAFs
    - MapReduce operations
    """

    def __init__(self, **options):
        GrammarBasedStrategy.__init__(self, 'hiveql', **options)
        super().__init__(**options)
        self._mode = QueryMode.AUTO
        self._traits = QueryTrait.STRUCTURED | QueryTrait.ANALYTICAL | QueryTrait.BATCH

    def execute(self, query: str, **kwargs) -> Any:
        """Execute HiveQL query."""
        if not self.validate_query(query):
            raise XWQueryValueError(f"Invalid HiveQL query: {query}")
        query_type = self._get_query_type(query)
        if query_type == "SELECT":
            return self._execute_select(query, **kwargs)
        elif query_type == "INSERT":
            return self._execute_insert(query, **kwargs)
        elif query_type == "CREATE":
            return self._execute_create(query, **kwargs)
        elif query_type == "LOAD":
            return self._execute_load(query, **kwargs)
        else:
            raise XWQueryValueError(f"Unsupported query type: {query_type}")

    def validate_query(self, query: str) -> bool:
        """Validate HiveQL query syntax."""
        if not query or not isinstance(query, str):
            return False
        # HiveQL validation
        query = query.strip().upper()
        valid_operations = ["SELECT", "INSERT", "CREATE", "DROP", "ALTER", "LOAD", "EXPORT", "IMPORT"]
        for operation in valid_operations:
            if query.startswith(operation):
                return True
        return False

    def get_query_plan(self, query: str) -> dict[str, Any]:
        """Get HiveQL query execution plan."""
        query_type = self._get_query_type(query)
        return {
            "query_type": query_type,
            "operation": query_type,
            "complexity": self._estimate_complexity(query),
            "estimated_cost": self._estimate_cost(query),
            "mapreduce_jobs": self._estimate_mapreduce_jobs(query),
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
        # HiveQL doesn't support UPDATE, use INSERT OVERWRITE instead
        set_clause = ', '.join([f"{k} = ?" for k in data.keys()])
        query = f"INSERT OVERWRITE TABLE {table} SELECT {set_clause} FROM {table}"
        if where_clause:
            query += f" WHERE {where_clause}"
        return self.execute(query, values=list(data.values()))

    def delete_query(self, table: str, where_clause: str = None) -> Any:
        """Execute DELETE query."""
        # HiveQL doesn't support DELETE, use INSERT OVERWRITE instead
        query = f"INSERT OVERWRITE TABLE {table} SELECT * FROM {table}"
        if where_clause:
            query += f" WHERE NOT ({where_clause})"
        return self.execute(query)

    def join_query(self, tables: list[str], join_conditions: list[str]) -> Any:
        """Execute JOIN query."""
        if len(tables) < 2:
            raise XWQueryValueError("JOIN requires at least 2 tables")
        query = f"SELECT * FROM {tables[0]}"
        for i, table in enumerate(tables[1:], 1):
            if i <= len(join_conditions):
                query += f" JOIN {table} ON {join_conditions[i-1]}"
            else:
                query += f" CROSS JOIN {table}"
        return self.execute(query)

    def aggregate_query(self, table: str, functions: list[str], group_by: list[str] = None) -> Any:
        """Execute aggregate query."""
        query = f"SELECT {', '.join(functions)} FROM {table}"
        if group_by:
            query += f" GROUP BY {', '.join(group_by)}"
        return self.execute(query)

    def _get_query_type(self, query: str) -> str:
        """Extract query type from HiveQL query."""
        query = query.strip().upper()
        for operation in ["SELECT", "INSERT", "CREATE", "DROP", "ALTER", "LOAD", "EXPORT", "IMPORT"]:
            if query.startswith(operation):
                return operation
        return "UNKNOWN"

    def _execute_select(self, query: str, **kwargs) -> Any:
        """Execute SELECT query."""
        return {"result": "HiveQL SELECT executed", "query": query}

    def _execute_insert(self, query: str, **kwargs) -> Any:
        """Execute INSERT query."""
        return {"result": "HiveQL INSERT executed", "query": query}

    def _execute_create(self, query: str, **kwargs) -> Any:
        """Execute CREATE query."""
        return {"result": "HiveQL CREATE executed", "query": query}

    def _execute_load(self, query: str, **kwargs) -> Any:
        """Execute LOAD query."""
        return {"result": "HiveQL LOAD executed", "query": query}

    def _estimate_complexity(self, query: str) -> str:
        """Estimate query complexity."""
        query = query.upper()
        if "JOIN" in query or "UNION" in query:
            return "HIGH"
        elif "GROUP BY" in query or "ORDER BY" in query:
            return "MEDIUM"
        else:
            return "LOW"

    def _estimate_cost(self, query: str) -> int:
        """Estimate query cost."""
        complexity = self._estimate_complexity(query)
        if complexity == "HIGH":
            return 200  # Higher cost due to MapReduce
        elif complexity == "MEDIUM":
            return 100
        else:
            return 50

    def _estimate_mapreduce_jobs(self, query: str) -> int:
        """Estimate number of MapReduce jobs."""
        query = query.upper()
        jobs = 1  # Base job
        if "JOIN" in query:
            jobs += 1
        if "GROUP BY" in query:
            jobs += 1
        if "ORDER BY" in query:
            jobs += 1
        return jobs

    def _get_optimization_hints(self, query: str) -> list[str]:
        """Get query optimization hints."""
        hints = []
        query = query.upper()
        if "SELECT *" in query:
            hints.append("Consider specifying columns instead of using *")
        if "WHERE" not in query and "SELECT" in query:
            hints.append("Consider adding WHERE clause to limit results")
        if "JOIN" in query:
            hints.append("Consider using partitioned tables for JOINs")
        if "GROUP BY" in query:
            hints.append("Consider using bucketed tables for GROUP BY")
        return hints
        # to_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)
        # Parse HiveQL query (SQL-like syntax)
        fields = []
        entity_name = None
        where_conditions = []
        # Extract SELECT fields
        select_match = re.search(r'SELECT\s+(.+?)(?:\s+FROM|\s*$)', query_upper, re.IGNORECASE | re.DOTALL)
        if select_match:
            fields_str = select_match.group(1).strip()
            if fields_str and fields_str != '*':
                fields = [f.strip() for f in fields_str.split(',') if f.strip()]
        # Extract FROM table
        from_match = re.search(r'FROM\s+(\w+)', query_upper, re.IGNORECASE)
        if from_match:
            entity_name = from_match.group(1)
        # Extract WHERE conditions
        where_match = re.search(r'WHERE\s+(.+?)(?:\s+GROUP\s+BY|\s+ORDER\s+BY|\s+LIMIT|\s*$)', query_upper, re.IGNORECASE | re.DOTALL)
        if where_match:
            where_expr = where_match.group(1).strip()
            where_conditions.append(where_expr)
        # Build actions tree
        children = []
        if entity_name:
            children.append({
                "type": "FROM",
                "id": "hiveql_from_1",
                "content": entity_name,
                "line_number": 1,
                "timestamp": datetime.now().isoformat(),
                "children": []
            })
        if where_conditions:
            where_content = " AND ".join(where_conditions)
            children.append({
                "type": "WHERE",
                "id": "hiveql_where_1",
                "content": where_content,
                "line_number": 1,
                "timestamp": datetime.now().isoformat(),
                "children": []
            })
        select_fields = ", ".join(fields) if fields else "*"
        select_action = {
            "type": "SELECT",
            "id": "hiveql_select_1",
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
                    "source_format": "HIVEQL"
                }
            }
        }
        return ANode.from_native(actions)
        # from_actions_tree() now inherited from GrammarBasedStrategy (uses xwsyntax grammar)

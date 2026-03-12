#!/usr/bin/env python3
"""
SQL Query Strategy
This module implements the SQL query strategy for structured data queries.
Now uses GrammarBasedStrategy for maximum xwsyntax reuse.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.2
Generation Date: January 20, 2025
"""

import re
from typing import Any, Optional
from .grammar_based import GrammarBasedStrategy
from .base import AStructuredQueryStrategy
from ...errors import XWQueryTypeError, XWQueryValueError
from ...defs import QueryMode, QueryTrait, FormatType
from ...contracts import QueryAction
from exonware.xwnode.base import ANode


class SQLStrategy(GrammarBasedStrategy, AStructuredQueryStrategy):
    """
    SQL query strategy for standard SQL operations.
    Maximum reuse: Inherits from GrammarBasedStrategy which uses xwsyntax
    for all parsing/generation, eliminating manual parsing code.
    Supports:
    - SELECT, INSERT, UPDATE, DELETE operations
    - JOIN operations
    - Aggregate functions
    - WHERE clauses
    - ORDER BY, GROUP BY, HAVING
    """

    def __init__(self, **options):
        # Initialize GrammarBasedStrategy with 'sql' format (maximum xwsyntax reuse)
        GrammarBasedStrategy.__init__(self, 'sql', **options)
        AStructuredQueryStrategy.__init__(self, **options)
        self._mode = QueryMode.AUTO
        self._traits = QueryTrait.STRUCTURED | QueryTrait.ANALYTICAL | QueryTrait.BATCH

    def execute(self, query: str, **kwargs) -> Any:
        """Execute SQL query."""
        # Use GrammarBasedStrategy.validate_query (via xwsyntax)
        if not self.validate_query(query):
            raise XWQueryValueError(f"Invalid SQL query: {query}")
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
    # validate_query() now inherited from GrammarBasedStrategy (uses xwsyntax)

    def _get_query_type(self, query: str) -> str:
        """Get query type from SQL query."""
        query_upper = query.strip().upper()
        if query_upper.startswith('SELECT'):
            return 'SELECT'
        elif query_upper.startswith('INSERT'):
            return 'INSERT'
        elif query_upper.startswith('UPDATE'):
            return 'UPDATE'
        elif query_upper.startswith('DELETE'):
            return 'DELETE'
        elif query_upper.startswith('CREATE'):
            return 'CREATE'
        elif query_upper.startswith('ALTER'):
            return 'ALTER'
        elif query_upper.startswith('DROP'):
            return 'DROP'
        return 'UNKNOWN'

    def get_query_plan(self, query: str) -> dict[str, Any]:
        """Get SQL query execution plan."""
        query_type = self._get_query_type(query)
        return {
            "query_type": query_type,
            "operation": query_type,
            "complexity": self._estimate_complexity(query),
            "estimated_cost": self._estimate_cost(query),
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
        """Extract query type from SQL query."""
        query = query.strip().upper()
        for operation in ["SELECT", "INSERT", "UPDATE", "DELETE", "CREATE", "DROP", "ALTER"]:
            if query.startswith(operation):
                return operation
        return "UNKNOWN"

    def _execute_select(self, query: str, **kwargs) -> Any:
        """
        Execute SELECT query on data.
        For single-object queries, extracts data from kwargs and executes the query.
        Supports basic SELECT with expressions like "SELECT age - 5 AS perfect_age FROM table".
        """
        # Get data from kwargs - ExecutionEngine passes data through context
        data = kwargs.get('data') or kwargs.get('node') or kwargs.get('queryable')
        # If data is XWNode or native Python, use it directly
        if hasattr(data, 'get') or hasattr(data, 'to_native'):
            # Extract native data
            if hasattr(data, 'to_native'):
                native_data = data.to_native()
            elif hasattr(data, 'get'):
                # Try to get data from XWNode
                native_data = data.get('') if callable(data.get) else data
            else:
                native_data = data
        else:
            native_data = data
        # Parse SELECT query to extract columns and FROM table
        # Simple regex-based parsing for basic queries
        select_match = re.search(r'SELECT\s+(.*?)\s+FROM\s+(\w+)', query, re.IGNORECASE)
        if not select_match:
            # Try without FROM (shouldn't happen if we added FROM clause)
            select_match = re.search(r'SELECT\s+(.*?)(?:\s+FROM|$)', query, re.IGNORECASE)
            if select_match:
                columns_expr = select_match.group(1).strip()
                table_name = 'table'  # Default
            else:
                # Fallback: return empty result
                return []
        else:
            columns_expr = select_match.group(1).strip()
            table_name = select_match.group(2).strip()
        # Handle data structure
        # If native_data is dict with table key, get the table data
        if isinstance(native_data, dict) and table_name in native_data:
            table_data = native_data[table_name]
        elif isinstance(native_data, list):
            # List of rows - use directly
            table_data = native_data
        elif isinstance(native_data, dict):
            # Single object dict - wrap in list
            table_data = [native_data]
        else:
            # Unknown format - return empty
            return []
        # Execute SELECT expression on each row
        results = []
        for row in table_data if isinstance(table_data, list) else [table_data]:
            if not isinstance(row, dict):
                continue
            # Parse column expression (e.g., "age - 5 AS perfect_age")
            # Extract alias if present
            if ' AS ' in columns_expr.upper():
                expr, alias = columns_expr.rsplit(' AS ', 1)
                alias = alias.strip()
            else:
                expr = columns_expr
                # Try to infer alias from expression
                alias = expr.strip().replace(' ', '_').replace('-', '_').replace('+', '_')
            # Evaluate expression (simple arithmetic for now)
            # Replace field names with values from row
            eval_expr = expr
            for field_name, field_value in row.items():
                # Replace field references in expression
                eval_expr = re.sub(rf'\b{re.escape(field_name)}\b', str(field_value), eval_expr)
            # Evaluate the expression (basic arithmetic only)
            try:
                # Safe evaluation of arithmetic expressions
                result_value = eval(eval_expr, {"__builtins__": {}}, {})
                results.append({alias: result_value})
            except Exception:
                # If evaluation fails, skip this row
                continue
        return results

    def _execute_insert(self, query: str, **kwargs) -> Any:
        """Execute INSERT query."""
        # Placeholder implementation
        return {"result": "INSERT executed", "query": query}

    def _execute_update(self, query: str, **kwargs) -> Any:
        """Execute UPDATE query."""
        # Placeholder implementation
        return {"result": "UPDATE executed", "query": query}

    def _execute_delete(self, query: str, **kwargs) -> Any:
        """Execute DELETE query."""
        # Placeholder implementation
        return {"result": "DELETE executed", "query": query}

    def _estimate_complexity(self, query: str) -> str:
        """Estimate query complexity."""
        query = query.upper()
        if "JOIN" in query:
            return "HIGH"
        elif "GROUP BY" in query or "ORDER BY" in query:
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
            return 10

    def _get_optimization_hints(self, query: str) -> list[str]:
        """Get query optimization hints."""
        hints = []
        query = query.upper()
        if "SELECT *" in query:
            hints.append("Consider specifying columns instead of using *")
        if "WHERE" not in query and "SELECT" in query:
            hints.append("Consider adding WHERE clause to limit results")
        if "ORDER BY" in query:
            hints.append("Consider adding index on ORDER BY columns")
        return hints

    def to_actions_tree(self, sql_query: str) -> QueryAction:
        """
        Convert SQL query to QueryAction tree using xwsyntax.
        Maximum reuse: Uses GrammarBasedStrategy.to_actions_tree() which
        delegates to xwsyntax for parsing and conversion.
        """
        # Use GrammarBasedStrategy implementation (maximum xwsyntax reuse)
        return super().to_actions_tree(sql_query)

    def from_actions_tree(self, actions_tree: ANode) -> str:
        """Convert XWQuery Script actions tree to SQL query."""
        # Extract tree data - structure is {type: "PROGRAM", children: [...]}
        tree_data = actions_tree.to_native() if hasattr(actions_tree, 'to_native') else actions_tree
        # Handle both old format (root.statements) and new format (children)
        if 'root' in tree_data and 'statements' in tree_data['root']:
            actions = tree_data['root']['statements']
        elif 'children' in tree_data:
            actions = tree_data['children']
        else:
            # Try direct access if tree_data is the root action
            if tree_data.get('type') == 'PROGRAM' and 'children' in tree_data:
                actions = tree_data['children']
            else:
                return "SELECT * FROM table"
        if not actions:
            return "SELECT * FROM table"
        # Find SELECT action and collect all related actions
        select_action = None
        from_action = None
        join_actions = []
        where_actions = []
        group_action = None
        having_action = None
        order_action = None
        limit_action = None
        for action in actions:
            action_type = action.get('type', '')
            if action_type == 'SELECT':
                select_action = action
            elif action_type == 'FROM':
                from_action = action
            elif action_type in ('JOIN', 'INNER_JOIN', 'LEFT_JOIN', 'RIGHT_JOIN', 'FULL_JOIN', 'IN'):
                join_actions.append(action)
            elif action_type == 'WHERE':
                where_actions.append(action)
            elif action_type == 'GROUP':
                group_action = action
            elif action_type == 'HAVING':
                having_action = action
            elif action_type == 'ORDER':
                order_action = action
            elif action_type == 'LIMIT':
                limit_action = action
        if not select_action:
            return "SELECT * FROM table"
        # Extract SELECT fields
        select_params = select_action.get('params', {})
        fields = select_params.get('fields', [])
        # If fields are not properly extracted, try to get from metadata content
        # Collect all content from actions to reconstruct the full query
        all_content_parts = []
        for action in actions:
            action_meta = action.get('metadata', {})
            content = action_meta.get('content', '')
            if content:
                all_content_parts.append(content)
        # Try to reconstruct the original query from all content parts
        full_query = ' '.join(all_content_parts)
        # If fields are missing or just "*", try to extract from full query
        if not fields or fields == ['*']:
            # Look for SELECT ... FROM pattern in the reconstructed query
            select_match = re.search(r'SELECT\s+(.*?)\s+FROM', full_query, re.IGNORECASE | re.DOTALL)
            if select_match:
                fields_str = select_match.group(1).strip()
                if fields_str and fields_str != '*':
                    # Handle multi-line fields (remove newlines, normalize whitespace)
                    fields_str = ' '.join(fields_str.split())
                    # Split by comma but handle function calls like COUNT(o.id)
                    # Simple split - may need refinement for complex cases
                    fields = []
                    current_field = ""
                    paren_depth = 0
                    for char in fields_str:
                        if char == '(':
                            paren_depth += 1
                            current_field += char
                        elif char == ')':
                            paren_depth -= 1
                            current_field += char
                        elif char == ',' and paren_depth == 0:
                            if current_field.strip():
                                fields.append(current_field.strip())
                            current_field = ""
                        else:
                            current_field += char
                    if current_field.strip():
                        fields.append(current_field.strip())
            # If still no fields, try to get from individual action contents
            if not fields or fields == ['*']:
                for action in actions:
                    content = action.get('metadata', {}).get('content', '')
                    if 'SELECT' in content.upper():
                        # Extract fields from SELECT line
                        lines = content.split('\n')
                        for line in lines:
                            if 'SELECT' in line.upper() and 'FROM' in line.upper():
                                select_match = re.search(r'SELECT\s+(.*?)\s+FROM', line, re.IGNORECASE)
                                if select_match:
                                    fields_str = select_match.group(1).strip()
                                    if fields_str and fields_str != '*':
                                        fields_str = ' '.join(fields_str.split())
                                        fields = [f.strip() for f in fields_str.split(',') if f.strip()]
                                        break
                        if fields and fields != ['*']:
                            break
        fields_str = ', '.join(fields) if fields and fields != ['*'] else '*'
        # Extract FROM table
        entity_name = None
        if from_action:
            from_params = from_action.get('params', {})
            entity_name = from_params.get('source') or from_params.get('table') or from_params.get('from')
            from_meta = from_action.get('metadata', {})
            if not entity_name:
                from_content = from_meta.get('content', '')
                from_match = re.search(r'FROM\s+(\w+)', from_content, re.IGNORECASE)
                if from_match:
                    entity_name = from_match.group(1)
        # Also check select_params for from/table
        if not entity_name:
            entity_name = select_params.get('from') or select_params.get('path') or select_params.get('table')
        # Try to extract from content if still not found
        if not entity_name:
            for action in actions:
                content = action.get('metadata', {}).get('content', '')
                if 'FROM' in content.upper():
                    from_match = re.search(r'FROM\s+(\w+)', content, re.IGNORECASE)
                    if from_match:
                        entity_name = from_match.group(1)
                        break
        entity_name = entity_name or 'table'
        # Build SQL query parts
        sql_parts = [f"SELECT {fields_str}"]
        sql_parts.append(f"FROM {entity_name}")
        # Add JOINs
        for join_action in join_actions:
            join_params = join_action.get('params', {})
            join_content = join_action.get('metadata', {}).get('content', '')
            if join_content and 'JOIN' in join_content.upper():
                # Extract JOIN clause from content
                join_match = re.search(r'(INNER|LEFT|RIGHT|FULL)?\s*JOIN\s+.*', join_content, re.IGNORECASE)
                if join_match:
                    sql_parts.append(join_match.group(0))
            elif join_params.get('raw'):
                sql_parts.append(join_params['raw'])
        # Add WHERE clauses
        where_clauses = []
        for where_action in where_actions:
            where_params = where_action.get('params', {})
            where_content = where_action.get('metadata', {}).get('content', '')
            if where_content and 'WHERE' in where_content.upper():
                # Extract condition from content
                where_match = re.search(r'WHERE\s+(.+)', where_content, re.IGNORECASE)
                if where_match:
                    where_clauses.append(where_match.group(1).strip())
            elif where_params:
                field = where_params.get('field', '')
                operator = where_params.get('operator', '=')
                value = where_params.get('value', '')
                if field:
                    where_clauses.append(f"{field} {operator} {value}")
        if where_clauses:
            sql_parts.append(f"WHERE {' AND '.join(where_clauses)}")
        # Add GROUP BY
        if group_action:
            group_params = group_action.get('params', {})
            group_fields = group_params.get('fields', [])
            if group_fields:
                sql_parts.append(f"GROUP BY {', '.join(group_fields)}")
            else:
                group_content = group_action.get('metadata', {}).get('content', '')
                if 'GROUP BY' in group_content.upper():
                    group_match = re.search(r'GROUP\s+BY\s+(.+)', group_content, re.IGNORECASE)
                    if group_match:
                        sql_parts.append(f"GROUP BY {group_match.group(1).strip()}")
        # Add HAVING
        if having_action:
            having_params = having_action.get('params', {})
            having_content = having_action.get('metadata', {}).get('content', '')
            if having_content and 'HAVING' in having_content.upper():
                having_match = re.search(r'HAVING\s+(.+)', having_content, re.IGNORECASE)
                if having_match:
                    sql_parts.append(f"HAVING {having_match.group(1).strip()}")
            elif having_params.get('raw'):
                sql_parts.append(f"HAVING {having_params['raw']}")
        # Add ORDER BY
        if order_action:
            order_params = order_action.get('params', {})
            order_fields = order_params.get('fields', [])
            if order_fields:
                order_parts = []
                for field_spec in order_fields:
                    if isinstance(field_spec, dict):
                        field_name = field_spec.get('field', '')
                        direction = field_spec.get('direction', 'ASC')
                        order_parts.append(f"{field_name} {direction}")
                    else:
                        order_parts.append(str(field_spec))
                if order_parts:
                    sql_parts.append(f"ORDER BY {', '.join(order_parts)}")
            else:
                order_content = order_action.get('metadata', {}).get('content', '')
                if 'ORDER BY' in order_content.upper():
                    order_match = re.search(r'ORDER\s+BY\s+(.+)', order_content, re.IGNORECASE)
                    if order_match:
                        sql_parts.append(f"ORDER BY {order_match.group(1).strip()}")
        # Add LIMIT
        if limit_action:
            limit_params = limit_action.get('params', {})
            limit_value = limit_params.get('limit') or limit_params.get('value')
            if limit_value:
                sql_parts.append(f"LIMIT {limit_value}")
            else:
                limit_content = limit_action.get('metadata', {}).get('content', '')
                if 'LIMIT' in limit_content.upper():
                    limit_match = re.search(r'LIMIT\s+(\d+)', limit_content, re.IGNORECASE)
                    if limit_match:
                        sql_parts.append(f"LIMIT {limit_match.group(1)}")
        return ' '.join(sql_parts)

    def can_handle(self, query_string: str) -> bool:
        """Check if this strategy can handle the given query string."""
        return self.validate_query(query_string)

    def get_supported_operations(self) -> list[str]:
        """Get list of supported query operations."""
        return [
            "SELECT", "INSERT", "UPDATE", "DELETE", "CREATE", "DROP", "ALTER",
            "JOIN", "UNION", "GROUP BY", "ORDER BY", "HAVING", "WHERE",
            "WITH", "CASE", "WINDOW", "PARTITION BY", "OVER"
        ]

    def estimate_complexity(self, query_string: str) -> dict[str, Any]:
        """Estimate query complexity and resource requirements."""
        complexity = self._estimate_complexity(query_string)
        cost = self._estimate_cost(query_string)
        return {
            "complexity_level": complexity,
            "estimated_cost": cost,
            "has_joins": "JOIN" in query_string.upper(),
            "has_subqueries": "SELECT" in query_string.upper().replace("SELECT", "", 1),
            "has_aggregates": any(func in query_string.upper() for func in ["SUM", "COUNT", "AVG", "MIN", "MAX"]),
            "has_window_functions": "OVER" in query_string.upper(),
            "query_length": len(query_string),
            "estimated_memory": "high" if complexity == "HIGH" else "medium" if complexity == "MEDIUM" else "low"
        }

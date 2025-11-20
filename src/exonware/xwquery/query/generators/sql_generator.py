#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/generators/sql_generator.py

Production-grade SQL generator - converts QueryAction tree to SQL text.
Supports SQL:2016 standard with pretty-printing.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.7
Generation Date: 28-Oct-2025
"""

from typing import List, Dict, Any, Optional
from .base_generator import AStructuredQueryGenerator
from .generator_utils import (
    format_sql_select,
    format_sql_insert,
    format_sql_update,
    format_sql_delete,
    format_sql_value,
    quote_identifier
)
from ...contracts import QueryAction
from ...errors import XWQueryValueError
from ...defs import ConversionMode


class SQLGenerator(AStructuredQueryGenerator):
    """
    Production-grade SQL generator.
    
    Supports:
    - SELECT statements (all clauses)
    - INSERT, UPDATE, DELETE statements
    - JOINs (INNER, LEFT, RIGHT, FULL, CROSS)
    - Subqueries and CTEs (WITH)
    - Set operations (UNION, INTERSECT, EXCEPT)
    - Aggregate functions
    - Complex expressions
    
    Features:
    - Pretty-printing with indentation
    - Quoted identifiers when needed
    - Proper escaping
    - Performance optimized
    """
    
    def __init__(
        self,
        conversion_mode: ConversionMode = ConversionMode.FLEXIBLE,
        **kwargs
    ):
        """Initialize SQL generator."""
        super().__init__(conversion_mode, **kwargs)
    
    # ==================== Main Generation Entry Point ====================
    
    def generate(self, actions: List[QueryAction], **options) -> str:
        """
        Generate SQL query from QueryAction tree.
        
        Args:
            actions: List of QueryAction objects
            **options: Generation options
            
        Returns:
            SQL query string
            
        Raises:
            XWQueryValueError: On generation errors
        """
        if not actions:
            raise XWQueryValueError("Cannot generate SQL from empty action list")
        
        # Determine statement type from first action
        first_action = actions[0]
        
        if first_action.operation == 'SELECT':
            return self._generate_select_statement(actions)
        elif first_action.operation == 'INSERT':
            return self._generate_insert_statement(first_action)
        elif first_action.operation == 'UPDATE':
            return self._generate_update_statement(first_action)
        elif first_action.operation == 'DELETE':
            return self._generate_delete_statement(first_action)
        else:
            raise XWQueryValueError(
                f"Unsupported statement type: {first_action.operation}\n"
                f"Expected: SELECT, INSERT, UPDATE, or DELETE"
            )
    
    def get_format_name(self) -> str:
        """Return format name."""
        return "SQL"
    
    # ==================== SELECT Statement Generation ====================
    
    def _generate_select_statement(self, actions: List[QueryAction]) -> str:
        """Generate SELECT statement from actions."""
        # Extract components from actions
        select_action = None
        from_table = None
        where_expr = None
        joins = []
        group_by_cols = []
        having_expr = None
        order_by_specs = []
        limit_value = None
        offset_value = None
        ctes = None
        recursive = False
        
        for action in actions:
            if action.operation == 'SELECT':
                select_action = action
                # Check for CTEs
                if 'ctes' in action.params:
                    ctes = action.params['ctes']
                    recursive = action.params.get('recursive', False)
            elif action.operation == 'FROM':
                from_table = action.params.get('table')
            elif action.operation == 'WHERE' or action.operation == 'FILTER':
                where_expr = self._action_params_to_where_string(action.params)
            elif action.operation == 'JOIN':
                joins.append(action)
            elif action.operation == 'GROUP_BY':
                group_by_cols = action.params.get('columns', [])
            elif action.operation == 'HAVING':
                having_expr = self._action_params_to_where_string(action.params)
            elif action.operation == 'ORDER_BY':
                col = action.params.get('column')
                direction = action.params.get('direction', 'ASC')
                order_by_specs.append((col, direction))
            elif action.operation == 'LIMIT':
                limit_value = action.params.get('limit')
            elif action.operation == 'OFFSET':
                offset_value = action.params.get('offset')
        
        if not select_action:
            raise XWQueryValueError("No SELECT action found in action list")
        
        # Build SELECT statement
        columns = select_action.params.get('columns', ['*'])
        distinct = select_action.params.get('distinct', False)
        
        # Add DISTINCT to first column if needed
        if distinct and columns:
            columns = ['DISTINCT ' + columns[0]] + columns[1:]
        
        # Format JOINs
        join_clauses = []
        for join_action in joins:
            join_type = join_action.params.get('join_type', 'INNER')
            join_table = join_action.params.get('table')
            join_condition = join_action.params.get('condition')
            
            join_str = f"{join_type} JOIN {join_table}"
            if join_condition and not join_condition.startswith('USING'):
                join_str += f" ON {join_condition}"
            elif join_condition:
                join_str += f" {join_condition}"
            
            join_clauses.append(join_str)
        
        # Use utility function
        select_sql = format_sql_select(
            columns=columns,
            table=from_table or 'dual',  # Oracle-style dummy table
            where=where_expr,
            joins=join_clauses if join_clauses else None,
            group_by=group_by_cols if group_by_cols else None,
            having=having_expr,
            order_by=[f"{col} {direction}" for col, direction in order_by_specs] if order_by_specs else None,
            limit=limit_value,
            offset=offset_value,
            indent=self.indent,
            pretty=self.pretty_print
        )
        
        # Add CTEs if present
        if ctes:
            cte_sql = self._generate_cte_clause(ctes, recursive)
            select_sql = cte_sql + '\n' + select_sql
        
        return select_sql
    
    def _generate_cte_clause(self, ctes: List[Dict[str, Any]], recursive: bool) -> str:
        """Generate WITH (CTE) clause."""
        cte_parts = []
        
        for cte in ctes:
            cte_name = cte['name']
            columns = cte.get('columns')
            query = cte['query']
            
            if columns:
                col_str = ', '.join(columns)
                cte_str = f"{cte_name} ({col_str}) AS (\n{self.add_indent(query, 1)}\n)"
            else:
                cte_str = f"{cte_name} AS (\n{self.add_indent(query, 1)}\n)"
            
            cte_parts.append(cte_str)
        
        recursive_keyword = 'RECURSIVE ' if recursive else ''
        ctes_str = f",\n{self.indent}".join(cte_parts) if self.pretty_print else ', '.join(cte_parts)
        
        if self.pretty_print:
            return f"WITH {recursive_keyword}\n{self.indent}{ctes_str}"
        else:
            return f"WITH {recursive_keyword}{ctes_str}"
    
    # ==================== INSERT Statement Generation ====================
    
    def _generate_insert_statement(self, action: QueryAction) -> str:
        """Generate INSERT statement from action."""
        table = action.params.get('table')
        columns = action.params.get('columns')
        values = action.params.get('values')
        
        if not table:
            raise XWQueryValueError("INSERT action missing table name")
        if not values:
            raise XWQueryValueError("INSERT action missing values")
        
        # Format column list
        col_str = f"({', '.join(columns)})" if columns else ""
        
        # Format value lists
        value_parts = []
        for value_list in values:
            if isinstance(value_list, list):
                formatted_values = [self._format_value(v) for v in value_list]
            else:
                formatted_values = [self._format_value(value_list)]
            value_parts.append(f"({', '.join(formatted_values)})")
        
        if self.pretty_print:
            values_str = f",\n{self.indent}".join(value_parts)
            if col_str:
                return f"INSERT INTO {table}\n{self.indent}{col_str}\nVALUES\n{self.indent}{values_str}"
            else:
                return f"INSERT INTO {table}\nVALUES\n{self.indent}{values_str}"
        else:
            values_str = ', '.join(value_parts)
            return f"INSERT INTO {table} {col_str} VALUES {values_str}".strip()
    
    # ==================== UPDATE Statement Generation ====================
    
    def _generate_update_statement(self, action: QueryAction) -> str:
        """Generate UPDATE statement from action."""
        table = action.params.get('table')
        assignments = action.params.get('assignments', {})
        where_expr = action.params.get('where')
        
        if not table:
            raise XWQueryValueError("UPDATE action missing table name")
        if not assignments:
            raise XWQueryValueError("UPDATE action missing assignments")
        
        # Format assignments
        assignment_parts = []
        for col, value in assignments.items():
            formatted_value = self._format_value(value)
            assignment_parts.append(f"{col} = {formatted_value}")
        
        if self.pretty_print:
            assign_str = f",\n{self.indent}".join(assignment_parts)
            parts = [f"UPDATE {table}", f"SET\n{self.indent}{assign_str}"]
            if where_expr:
                parts.append(f"WHERE\n{self.indent}{where_expr}")
            return '\n'.join(parts)
        else:
            assign_str = ', '.join(assignment_parts)
            parts = [f"UPDATE {table} SET {assign_str}"]
            if where_expr:
                parts.append(f"WHERE {where_expr}")
            return ' '.join(parts)
    
    # ==================== DELETE Statement Generation ====================
    
    def _generate_delete_statement(self, action: QueryAction) -> str:
        """Generate DELETE statement from action."""
        table = action.params.get('table')
        where_expr = action.params.get('where')
        
        if not table:
            raise XWQueryValueError("DELETE action missing table name")
        
        if self.pretty_print:
            parts = [f"DELETE FROM {table}"]
            if where_expr:
                parts.append(f"WHERE\n{self.indent}{where_expr}")
            return '\n'.join(parts)
        else:
            parts = [f"DELETE FROM {table}"]
            if where_expr:
                parts.append(f"WHERE {where_expr}")
            return ' '.join(parts)
    
    # ==================== Helper Methods ====================
    
    def _action_params_to_where_string(self, params: Dict[str, Any]) -> str:
        """Convert action params to WHERE clause string."""
        # If params contain a 'condition' key, use it
        if 'condition' in params:
            return str(params['condition'])
        
        # If params contain a 'filter' key, format it
        if 'filter' in params:
            filter_dict = params['filter']
            return self._format_filter_dict(filter_dict)
        
        # Otherwise, format all params as conditions
        conditions = []
        for key, value in params.items():
            if key not in ('operation', 'type'):
                formatted_value = self._format_value(value)
                conditions.append(f"{key} = {formatted_value}")
        
        return ' AND '.join(conditions) if conditions else ''
    
    def _format_filter_dict(self, filter_dict: Dict[str, Any]) -> str:
        """Format filter dictionary to SQL WHERE condition."""
        conditions = []
        
        for key, value in filter_dict.items():
            if isinstance(value, dict):
                # MongoDB-style operators ($gt, $lt, etc.)
                for op, op_value in value.items():
                    if op == '$gt':
                        conditions.append(f"{key} > {self._format_value(op_value)}")
                    elif op == '$gte':
                        conditions.append(f"{key} >= {self._format_value(op_value)}")
                    elif op == '$lt':
                        conditions.append(f"{key} < {self._format_value(op_value)}")
                    elif op == '$lte':
                        conditions.append(f"{key} <= {self._format_value(op_value)}")
                    elif op == '$eq':
                        conditions.append(f"{key} = {self._format_value(op_value)}")
                    elif op == '$ne':
                        conditions.append(f"{key} != {self._format_value(op_value)}")
                    elif op == '$in':
                        values = ', '.join(self._format_value(v) for v in op_value)
                        conditions.append(f"{key} IN ({values})")
                    elif op == '$nin':
                        values = ', '.join(self._format_value(v) for v in op_value)
                        conditions.append(f"{key} NOT IN ({values})")
                    else:
                        # Unknown operator - just format as-is
                        conditions.append(f"{key} {op} {self._format_value(op_value)}")
            else:
                # Simple equality
                conditions.append(f"{key} = {self._format_value(value)}")
        
        return ' AND '.join(conditions) if conditions else ''
    
    def _format_value(self, value: Any) -> str:
        """Format value for SQL."""
        if value is None:
            return 'NULL'
        elif isinstance(value, bool):
            return 'TRUE' if value else 'FALSE'
        elif isinstance(value, str):
            # Check if already quoted or is an expression
            if value.startswith("'") and value.endswith("'"):
                return value
            # Check if it's a number
            try:
                float(value)
                return value
            except ValueError:
                pass
            # Check if it's a SQL keyword or function
            upper_value = value.upper()
            if upper_value in ('NULL', 'TRUE', 'FALSE', 'CURRENT_TIMESTAMP', 'CURRENT_DATE', 'CURRENT_TIME'):
                return upper_value
            # Otherwise, quote it
            return format_sql_value(value)
        elif isinstance(value, (int, float)):
            return str(value)
        elif isinstance(value, (list, tuple)):
            # Array - format as comma-separated values
            formatted = [self._format_value(v) for v in value]
            return f"({', '.join(formatted)})"
        elif isinstance(value, dict):
            # Expression AST - convert to string
            return self._expression_dict_to_string(value)
        else:
            return format_sql_value(str(value))
    
    def _expression_dict_to_string(self, expr: Dict[str, Any]) -> str:
        """Convert expression AST dict to SQL string."""
        expr_type = expr.get('type')
        
        if expr_type == 'literal':
            return str(expr['value'])
        elif expr_type == 'identifier':
            return expr['value']
        elif expr_type == 'binary':
            left = self._expression_dict_to_string(expr['left'])
            right = self._expression_dict_to_string(expr['right'])
            return f"({left} {expr['op']} {right})"
        elif expr_type == 'unary':
            operand = self._expression_dict_to_string(expr['operand'])
            return f"{expr['op']} {operand}"
        elif expr_type == 'function':
            args = ', '.join(self._expression_dict_to_string(arg) for arg in expr.get('args', []))
            return f"{expr['name']}({args})"
        elif expr_type == 'aggregate':
            arg = self._expression_dict_to_string(expr['arg'])
            distinct = 'DISTINCT ' if expr.get('distinct') else ''
            return f"{expr['name']}({distinct}{arg})"
        else:
            return str(expr)
    
    # ==================== Identifier Formatting ====================
    
    def format_identifier(self, name: str) -> str:
        """
        Format identifier with quoting if needed.
        
        Args:
            name: Identifier name
            
        Returns:
            Formatted identifier
        """
        # Check if needs quoting (has spaces, special chars, or is keyword)
        if ' ' in name or '-' in name or name.upper() in SQL_KEYWORDS:
            return quote_identifier(name, style="double")
        return name
    
    def format_string_literal(self, value: str) -> str:
        """Format string literal with SQL escaping."""
        return format_sql_value(value)


# ==================== SQL Keywords (for quoting detection) ====================

SQL_KEYWORDS = {
    'SELECT', 'FROM', 'WHERE', 'JOIN', 'INNER', 'LEFT', 'RIGHT', 'FULL',
    'OUTER', 'CROSS', 'ON', 'USING', 'GROUP', 'BY', 'HAVING', 'ORDER',
    'LIMIT', 'OFFSET', 'INSERT', 'INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE',
    'CREATE', 'ALTER', 'DROP', 'TABLE', 'INDEX', 'VIEW', 'DATABASE', 'SCHEMA',
    'WITH', 'RECURSIVE', 'AS', 'DISTINCT', 'ALL', 'UNION', 'INTERSECT', 'EXCEPT',
    'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'EXISTS', 'IN', 'NOT', 'AND', 'OR',
    'NULL', 'TRUE', 'FALSE', 'IS', 'LIKE', 'BETWEEN'
}


# ==================== Convenience Function ====================

def generate_sql(actions: List[QueryAction], pretty: bool = True, **options) -> str:
    """
    Generate SQL query from QueryAction tree.
    
    Args:
        actions: List of QueryAction objects
        pretty: Enable pretty-printing
        **options: Generation options
        
    Returns:
        SQL query string
        
    Raises:
        XWQueryValueError: On generation errors
    """
    generator = SQLGenerator(pretty_print=pretty, **options)
    return generator.generate_with_validation(actions, **options)


__all__ = [
    'SQLGenerator',
    'generate_sql'
]


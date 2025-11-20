#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/generators/generator_utils.py

Shared utilities for query generation.
Formatting helpers for SQL-style and functional-style queries.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1
Generation Date: 28-Oct-2025
"""

from typing import List, Dict, Any, Optional, Union
import re


# ==================== SQL-Style Formatting ====================

def format_sql_select(
    columns: List[str],
    table: str,
    where: Optional[str] = None,
    joins: Optional[List[str]] = None,
    group_by: Optional[List[str]] = None,
    having: Optional[str] = None,
    order_by: Optional[List[str]] = None,
    limit: Optional[int] = None,
    offset: Optional[int] = None,
    indent: str = "  ",
    pretty: bool = True
) -> str:
    """
    Format SQL SELECT statement.
    
    Args:
        columns: List of column names/expressions
        table: Table name
        where: WHERE clause
        joins: List of JOIN clauses
        group_by: List of GROUP BY columns
        having: HAVING clause
        order_by: List of ORDER BY expressions
        limit: LIMIT value
        offset: OFFSET value
        indent: Indentation string
        pretty: Enable pretty-printing
        
    Returns:
        Formatted SQL SELECT statement
    """
    parts = []
    
    # SELECT clause
    if pretty:
        col_str = f",\n{indent}".join(columns) if len(columns) > 1 else columns[0]
        parts.append(f"SELECT\n{indent}{col_str}")
    else:
        parts.append(f"SELECT {', '.join(columns)}")
    
    # FROM clause
    if pretty:
        parts.append(f"FROM\n{indent}{table}")
    else:
        parts.append(f"FROM {table}")
    
    # JOINs
    if joins:
        for join in joins:
            if pretty:
                parts.append(f"{indent}{join}")
            else:
                parts.append(join)
    
    # WHERE clause
    if where:
        if pretty:
            parts.append(f"WHERE\n{indent}{where}")
        else:
            parts.append(f"WHERE {where}")
    
    # GROUP BY
    if group_by:
        if pretty:
            parts.append(f"GROUP BY\n{indent}{', '.join(group_by)}")
        else:
            parts.append(f"GROUP BY {', '.join(group_by)}")
    
    # HAVING
    if having:
        if pretty:
            parts.append(f"HAVING\n{indent}{having}")
        else:
            parts.append(f"HAVING {having}")
    
    # ORDER BY
    if order_by:
        if pretty:
            parts.append(f"ORDER BY\n{indent}{', '.join(order_by)}")
        else:
            parts.append(f"ORDER BY {', '.join(order_by)}")
    
    # LIMIT/OFFSET
    if limit is not None:
        parts.append(f"LIMIT {limit}")
    if offset is not None:
        parts.append(f"OFFSET {offset}")
    
    # Join parts
    separator = '\n' if pretty else ' '
    return separator.join(parts)


def format_sql_insert(
    table: str,
    columns: List[str],
    values: List[Any],
    indent: str = "  ",
    pretty: bool = True
) -> str:
    """
    Format SQL INSERT statement.
    
    Args:
        table: Table name
        columns: List of column names
        values: List of values
        indent: Indentation string
        pretty: Enable pretty-printing
        
    Returns:
        Formatted SQL INSERT statement
    """
    col_str = ', '.join(columns)
    val_str = ', '.join(format_sql_value(v) for v in values)
    
    if pretty:
        return f"""INSERT INTO {table}
{indent}({col_str})
VALUES
{indent}({val_str})"""
    else:
        return f"INSERT INTO {table} ({col_str}) VALUES ({val_str})"


def format_sql_update(
    table: str,
    assignments: Dict[str, Any],
    where: Optional[str] = None,
    indent: str = "  ",
    pretty: bool = True
) -> str:
    """
    Format SQL UPDATE statement.
    
    Args:
        table: Table name
        assignments: Dictionary of column=value assignments
        where: WHERE clause
        indent: Indentation string
        pretty: Enable pretty-printing
        
    Returns:
        Formatted SQL UPDATE statement
    """
    set_parts = [f"{col} = {format_sql_value(val)}" for col, val in assignments.items()]
    
    if pretty:
        set_str = f",\n{indent}".join(set_parts)
        parts = [f"UPDATE {table}", f"SET\n{indent}{set_str}"]
        if where:
            parts.append(f"WHERE\n{indent}{where}")
        return '\n'.join(parts)
    else:
        set_str = ', '.join(set_parts)
        parts = [f"UPDATE {table} SET {set_str}"]
        if where:
            parts.append(f"WHERE {where}")
        return ' '.join(parts)


def format_sql_delete(
    table: str,
    where: Optional[str] = None,
    indent: str = "  ",
    pretty: bool = True
) -> str:
    """
    Format SQL DELETE statement.
    
    Args:
        table: Table name
        where: WHERE clause
        indent: Indentation string
        pretty: Enable pretty-printing
        
    Returns:
        Formatted SQL DELETE statement
    """
    if pretty:
        parts = [f"DELETE FROM {table}"]
        if where:
            parts.append(f"WHERE\n{indent}{where}")
        return '\n'.join(parts)
    else:
        parts = [f"DELETE FROM {table}"]
        if where:
            parts.append(f"WHERE {where}")
        return ' '.join(parts)


# ==================== Value Formatting ====================

def format_sql_value(value: Any) -> str:
    """
    Format value for SQL.
    
    Args:
        value: Value to format
        
    Returns:
        Formatted value string
    """
    if value is None:
        return "NULL"
    elif isinstance(value, bool):
        return "TRUE" if value else "FALSE"
    elif isinstance(value, str):
        # Escape single quotes
        escaped = value.replace("'", "''")
        return f"'{escaped}'"
    elif isinstance(value, (int, float)):
        return str(value)
    elif isinstance(value, (list, tuple)):
        # Array literal
        items = ', '.join(format_sql_value(v) for v in value)
        return f"({items})"
    else:
        # Fallback to string
        return f"'{str(value)}'"


# ==================== Identifier Formatting ====================

def quote_identifier(name: str, style: str = "double") -> str:
    """
    Quote identifier.
    
    Args:
        name: Identifier name
        style: Quoting style ('double', 'single', 'backtick', 'bracket')
        
    Returns:
        Quoted identifier
    """
    if style == "double":
        return f'"{name}"'
    elif style == "single":
        return f"'{name}'"
    elif style == "backtick":
        return f"`{name}`"
    elif style == "bracket":
        return f"[{name}]"
    else:
        return name


def is_keyword(name: str, keywords: set) -> bool:
    """
    Check if name is a keyword.
    
    Args:
        name: Identifier name
        keywords: Set of keywords
        
    Returns:
        True if keyword
    """
    return name.upper() in keywords


def needs_quoting(name: str, keywords: set) -> bool:
    """
    Check if identifier needs quoting.
    
    Args:
        name: Identifier name
        keywords: Set of keywords
        
    Returns:
        True if needs quoting
    """
    # Check if keyword
    if is_keyword(name, keywords):
        return True
    
    # Check if valid identifier (alphanumeric + underscore)
    if not re.match(r'^[a-zA-Z_][a-zA-Z0-9_]*$', name):
        return True
    
    return False


# ==================== Expression Formatting ====================

def format_expression(
    expr: Dict[str, Any],
    precedence: Optional[int] = None
) -> str:
    """
    Format expression from AST.
    
    Args:
        expr: Expression AST dictionary
        precedence: Current precedence level
        
    Returns:
        Formatted expression string
    """
    if isinstance(expr, str):
        return expr
    
    if not isinstance(expr, dict):
        return str(expr)
    
    expr_type = expr.get('type')
    
    if expr_type == 'literal':
        return str(expr.get('value', ''))
    
    elif expr_type == 'identifier':
        return expr.get('name', '')
    
    elif expr_type == 'function':
        func_name = expr.get('name', '')
        args = expr.get('args', [])
        formatted_args = ', '.join(format_expression(arg) for arg in args)
        return f"{func_name}({formatted_args})"
    
    elif expr_type == 'binary':
        left = format_expression(expr.get('left', {}))
        op = expr.get('op', '')
        right = format_expression(expr.get('right', {}))
        
        # Add parentheses if needed based on precedence
        result = f"{left} {op} {right}"
        if precedence is not None and expr.get('precedence', 0) < precedence:
            result = f"({result})"
        
        return result
    
    elif expr_type == 'unary':
        op = expr.get('op', '')
        operand = format_expression(expr.get('operand', {}))
        return f"{op} {operand}"
    
    else:
        return str(expr)


# ==================== Functional-Style Formatting ====================

def format_function_call(
    name: str,
    args: List[str],
    multiline: bool = False,
    indent: str = "  "
) -> str:
    """
    Format function call.
    
    Args:
        name: Function name
        args: List of argument strings
        multiline: Use multiline format
        indent: Indentation string
        
    Returns:
        Formatted function call
    """
    if not multiline or len(args) <= 2:
        return f"{name}({', '.join(args)})"
    
    # Multiline format
    formatted_args = f",\n{indent}".join(args)
    return f"{name}(\n{indent}{formatted_args}\n)"


def format_chained_calls(
    calls: List[str],
    indent: str = "  "
) -> str:
    """
    Format chained method calls.
    
    Args:
        calls: List of call strings
        indent: Indentation string
        
    Returns:
        Formatted chained calls
    """
    if not calls:
        return ""
    
    # First call on same line, rest indented
    result = calls[0]
    for call in calls[1:]:
        result += f"\n{indent}.{call}"
    
    return result


# ==================== Pretty-Printing ====================

def indent_block(
    text: str,
    level: int = 1,
    indent: str = "  "
) -> str:
    """
    Indent text block.
    
    Args:
        text: Text to indent
        level: Indentation level
        indent: Indentation string
        
    Returns:
        Indented text
    """
    indent_str = indent * level
    lines = text.split('\n')
    return '\n'.join(indent_str + line if line.strip() else '' for line in lines)


def wrap_text(
    text: str,
    width: int = 80,
    indent: str = ""
) -> str:
    """
    Wrap text to width.
    
    Args:
        text: Text to wrap
        width: Maximum width
        indent: Indentation for wrapped lines
        
    Returns:
        Wrapped text
    """
    if len(text) <= width:
        return text
    
    words = text.split()
    lines = []
    current_line = ""
    
    for word in words:
        test_line = current_line + (" " if current_line else "") + word
        if len(test_line) <= width:
            current_line = test_line
        else:
            if current_line:
                lines.append(current_line)
            current_line = indent + word
    
    if current_line:
        lines.append(current_line)
    
    return '\n'.join(lines)


# ==================== String Utilities ====================

def escape_string(value: str, style: str = "sql") -> str:
    """
    Escape string value.
    
    Args:
        value: String value
        style: Escape style ('sql', 'json', 'xml')
        
    Returns:
        Escaped string
    """
    if style == "sql":
        return value.replace("'", "''")
    elif style == "json":
        return value.replace('\\', '\\\\').replace('"', '\\"')
    elif style == "xml":
        return (value
                .replace('&', '&amp;')
                .replace('<', '&lt;')
                .replace('>', '&gt;')
                .replace('"', '&quot;')
                .replace("'", '&apos;'))
    else:
        return value


def unescape_string(value: str, style: str = "sql") -> str:
    """
    Unescape string value.
    
    Args:
        value: Escaped string
        style: Escape style ('sql', 'json', 'xml')
        
    Returns:
        Unescaped string
    """
    if style == "sql":
        return value.replace("''", "'")
    elif style == "json":
        return value.replace('\\"', '"').replace('\\\\', '\\')
    elif style == "xml":
        return (value
                .replace('&apos;', "'")
                .replace('&quot;', '"')
                .replace('&gt;', '>')
                .replace('&lt;', '<')
                .replace('&amp;', '&'))
    else:
        return value


# ==================== Comment Formatting ====================

def add_line_comment(text: str, comment: str, style: str = "sql") -> str:
    """
    Add line comment to text.
    
    Args:
        text: Text
        comment: Comment text
        style: Comment style ('sql', 'c', 'python')
        
    Returns:
        Text with comment
    """
    if style == "sql":
        return f"{text} -- {comment}"
    elif style == "c":
        return f"{text} // {comment}"
    elif style == "python":
        return f"{text} # {comment}"
    else:
        return f"{text} -- {comment}"


def add_block_comment(text: str, comment: str, style: str = "sql") -> str:
    """
    Add block comment to text.
    
    Args:
        text: Text
        comment: Comment text
        style: Comment style ('sql', 'c', 'xml')
        
    Returns:
        Text with comment
    """
    if style in ("sql", "c"):
        return f"/* {comment} */\n{text}"
    elif style == "xml":
        return f"<!-- {comment} -->\n{text}"
    else:
        return f"/* {comment} */\n{text}"


# ==================== Exports ====================

__all__ = [
    # SQL formatting
    'format_sql_select',
    'format_sql_insert',
    'format_sql_update',
    'format_sql_delete',
    'format_sql_value',
    
    # Identifiers
    'quote_identifier',
    'is_keyword',
    'needs_quoting',
    
    # Expressions
    'format_expression',
    
    # Functional style
    'format_function_call',
    'format_chained_calls',
    
    # Pretty-printing
    'indent_block',
    'wrap_text',
    
    # String utilities
    'escape_string',
    'unescape_string',
    
    # Comments
    'add_line_comment',
    'add_block_comment'
]


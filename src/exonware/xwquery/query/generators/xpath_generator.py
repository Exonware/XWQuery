#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/generators/xpath_generator.py

Production-grade XPath generator - converts QueryAction tree to XPath expressions.
Supports XPath 1.0, 2.0, 3.0 with conversion modes.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.7
Generation Date: 28-Oct-2025
"""

from typing import List, Dict, Any, Optional
from .base_generator import APathQueryGenerator
from ...contracts import QueryAction
from ...errors import XWQueryValueError
from ...defs import ConversionMode


class XPathGenerator(APathQueryGenerator):
    """
    Production-grade XPath generator.
    
    Supports:
    - Location paths (/, //)
    - Predicates ([@attr='value'], [position()=1])
    - Conversion from SQL-style queries
    - Conversion modes (STRICT, FLEXIBLE, LENIENT)
    
    Conversion Strategy:
    - SELECT columns → XPath with selected elements
    - FROM table → Root element /table
    - WHERE conditions → Predicates [condition]
    - JOINs → Not directly supported (FLEXIBLE/LENIENT modes)
    - GROUP BY → Not directly supported
    - ORDER BY → Not directly supported
    
    Example Conversions:
    - SQL: SELECT name FROM users WHERE age > 18
      → XPath: //users/user[age > 18]/name
    
    - SQL: SELECT * FROM books WHERE price < 10
      → XPath: //books/book[price < 10]
    """
    
    def __init__(
        self,
        conversion_mode: ConversionMode = ConversionMode.FLEXIBLE,
        **kwargs
    ):
        """Initialize XPath generator."""
        super().__init__(conversion_mode, **kwargs)
    
    # ==================== Main Generation Entry Point ====================
    
    def generate(self, actions: List[QueryAction], **options) -> str:
        """
        Generate XPath expression from QueryAction tree.
        
        Args:
            actions: List of QueryAction objects
            **options: Generation options
            
        Returns:
            XPath expression string
            
        Raises:
            XWQueryValueError: On generation errors
        """
        # Extract components
        table = None
        columns = ['*']
        predicates = []
        
        for action in actions:
            if action.operation == 'SELECT':
                columns = action.params.get('columns', ['*'])
            elif action.operation == 'FROM':
                table = action.params.get('table')
            elif action.operation in ('WHERE', 'FILTER'):
                predicate = self._action_to_predicate(action)
                if predicate:
                    predicates.append(predicate)
            elif action.operation in ('JOIN', 'GROUP_BY', 'ORDER_BY', 'LIMIT', 'OFFSET'):
                # These don't map to XPath directly
                self.handle_incompatible_action(action)
        
        # Build XPath
        return self._build_xpath(table, columns, predicates)
    
    def get_format_name(self) -> str:
        """Return format name."""
        return "XPath"
    
    # ==================== XPath Construction ====================
    
    def _build_xpath(
        self,
        table: Optional[str],
        columns: List[str],
        predicates: List[str]
    ) -> str:
        """
        Build XPath expression.
        
        Args:
            table: Table/element name
            columns: Columns to select
            predicates: Filter predicates
            
        Returns:
            XPath expression
        """
        # Start with descendant-or-self axis
        xpath = '//'
        
        # Add table/element
        if table:
            xpath += table
            
            # For structured data, add child element
            # Assume pattern: //table/row
            if table.endswith('s'):
                # Plural table name → singular row
                row_name = table[:-1]  # users → user
                xpath += f"/{row_name}"
            else:
                xpath += '/row'
        else:
            xpath += '*'
        
        # Add predicates
        for predicate in predicates:
            xpath += f"[{predicate}]"
        
        # Add column selection
        if columns != ['*'] and len(columns) == 1:
            xpath += f"/{columns[0]}"
        elif columns != ['*']:
            # Multiple columns - use union
            if self.conversion_mode == ConversionMode.STRICT:
                raise XWQueryValueError(
                    "STRICT MODE: XPath does not support selecting multiple columns. "
                    "Use FLEXIBLE mode to generate union expression."
                )
            # Build union: col1 | col2 | col3
            base_path = xpath
            column_paths = [f"{base_path}/{col}" for col in columns]
            xpath = ' | '.join(column_paths)
        
        return xpath
    
    def _action_to_predicate(self, action: QueryAction) -> Optional[str]:
        """Convert filter action to XPath predicate."""
        params = action.params
        
        # Get filter condition
        if 'condition' in params:
            return str(params['condition'])
        
        if 'filter' in params:
            return self._filter_dict_to_predicate(params['filter'])
        
        # Format all params as predicates
        conditions = []
        for key, value in params.items():
            if key not in ('operation', 'type'):
                conditions.append(self._format_condition(key, value))
        
        return ' and '.join(conditions) if conditions else None
    
    def _filter_dict_to_predicate(self, filter_dict: Dict[str, Any]) -> str:
        """Convert filter dictionary to XPath predicate."""
        conditions = []
        
        for key, value in filter_dict.items():
            if isinstance(value, dict):
                # MongoDB-style operators
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
                    else:
                        # Try to format anyway
                        conditions.append(f"{key} {op} {self._format_value(op_value)}")
            else:
                # Simple equality
                conditions.append(f"{key} = {self._format_value(value)}")
        
        return ' and '.join(conditions)
    
    def _format_condition(self, key: str, value: Any) -> str:
        """Format single condition."""
        formatted_value = self._format_value(value)
        return f"{key} = {formatted_value}"
    
    def _format_value(self, value: Any) -> str:
        """Format value for XPath."""
        if value is None:
            # XPath doesn't have NULL - use empty string or special function
            if self.conversion_mode == ConversionMode.STRICT:
                raise XWQueryValueError(
                    "STRICT MODE: XPath does not have NULL literal. "
                    "Use FLEXIBLE mode for alternatives."
                )
            return "''"
        elif isinstance(value, bool):
            return 'true()' if value else 'false()'
        elif isinstance(value, str):
            # Check if already quoted
            if value.startswith("'") and value.endswith("'"):
                return value
            # Quote with single quotes
            escaped = value.replace("'", "&apos;")
            return f"'{escaped}'"
        elif isinstance(value, (int, float)):
            return str(value)
        else:
            return f"'{str(value)}'"
    
    # ==================== Path Formatting ====================
    
    def format_path(self, path_parts: List[str]) -> str:
        """
        Format path from parts.
        
        Args:
            path_parts: List of path components
            
        Returns:
            Formatted XPath expression
        """
        if not path_parts:
            return '//*'
        
        # Join with /
        return '//' + '/'.join(path_parts)
    
    # ==================== Character Utilities ====================
    
    def _current_char(self) -> str:
        """Get current character."""
        if self.position >= len(self.path):
            return ''
        return self.path[self.position]
    
    def _advance(self) -> str:
        """Advance to next character."""
        if self.position < len(self.path):
            char = self.path[self.position]
            self.position += 1
            return char
        return ''
    
    def _skip_whitespace(self) -> None:
        """Skip whitespace."""
        while self._current_char().isspace():
            self._advance()
    
    def _skip_until(self, target: str) -> None:
        """Skip until target character."""
        while self._current_char() and self._current_char() != target:
            self._advance()
    
    def _consume(self, char: str, message: str) -> None:
        """Consume specific character."""
        if self._current_char() != char:
            raise XWQueryParseError(
                f"{message}\n"
                f"  Expected: '{char}'\n"
                f"  Got: '{self._current_char()}'\n"
                f"  Position: {self.position}"
            )
        self._advance()


# ==================== Convenience Function ====================

def generate_xpath(actions: List[QueryAction], **options) -> str:
    """
    Generate XPath expression from QueryAction tree.
    
    Args:
        actions: List of QueryAction objects
        **options: Generation options
        
    Returns:
        XPath expression string
        
    Raises:
        XWQueryValueError: On generation errors
    """
    generator = XPathGenerator(**options)
    return generator.generate_with_validation(actions, **options)


__all__ = [
    'XPathGenerator',
    'generate_xpath'
]


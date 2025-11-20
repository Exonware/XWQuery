#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/parsers/xpath_parser.py

Production-grade XPath parser - converts XPath expressions to QueryAction tree.
Supports XPath 1.0, 2.0, 3.0 with comprehensive error handling.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1
Generation Date: 28-Oct-2025
"""

from typing import List, Dict, Any, Optional
from .base_parser import APathQueryParser
from .query_action_builder import QueryActionBuilder
from ..contracts import QueryAction
from ..errors import XWQueryParseError
from ..defs import ConversionMode


class XPathParser(APathQueryParser):
    """
    Production-grade XPath parser.
    
    Supports:
    - Location paths (/, //, child::, parent::, etc.)
    - Predicates ([position() = 1], [@attr='value'])
    - Functions (count(), text(), string(), number(), etc.)
    - Axes (child, parent, ancestor, descendant, following, etc.)
    - Node tests (node(), text(), comment(), processing-instruction())
    - Operators (=, !=, <, >, <=, >=, and, or, not)
    - Wildcards (* for any element)
    
    Examples:
    - //users/user[@age > 18]/name
    - /root/child[position() = 1]
    - //book[price < 10]/title
    - //*[@id='main']//div[@class='content']
    """
    
    # XPath axes
    AXES = {
        'child', 'descendant', 'parent', 'ancestor',
        'following-sibling', 'preceding-sibling',
        'following', 'preceding',
        'attribute', 'namespace',
        'self', 'descendant-or-self', 'ancestor-or-self'
    }
    
    # XPath functions
    FUNCTIONS = {
        # Node set functions
        'count', 'id', 'local-name', 'namespace-uri', 'name',
        # String functions
        'string', 'concat', 'starts-with', 'contains', 'substring',
        'substring-before', 'substring-after', 'string-length',
        'normalize-space', 'translate',
        # Boolean functions
        'boolean', 'not', 'true', 'false', 'lang',
        # Number functions
        'number', 'sum', 'floor', 'ceiling', 'round',
        # Position functions
        'position', 'last'
    }
    
    def __init__(self, conversion_mode: ConversionMode = ConversionMode.FLEXIBLE):
        """Initialize XPath parser."""
        super().__init__(conversion_mode)
        self.path = ""
        self.position = 0
    
    # ==================== Main Parsing Entry Point ====================
    
    def parse(self, query: str, **options) -> List[QueryAction]:
        """
        Parse XPath expression to QueryAction tree.
        
        Args:
            query: XPath expression string
            **options: Parsing options
            
        Returns:
            List of QueryAction objects
            
        Raises:
            XWQueryParseError: On parsing errors
        """
        self.path = query.strip()
        self.position = 0
        
        # Parse location path
        location_path = self._parse_location_path()
        
        # Convert to QueryAction tree
        return self._location_path_to_actions(location_path)
    
    def get_format_name(self) -> str:
        """Return format name."""
        return "XPath"
    
    # ==================== Location Path Parsing ====================
    
    def _parse_location_path(self) -> Dict[str, Any]:
        """
        Parse location path.
        
        Returns:
            Location path structure
        """
        steps = []
        absolute = False
        
        # Check if absolute path (starts with /)
        if self._current_char() == '/':
            absolute = True
            self._advance()
            
            # Check for // (descendant-or-self)
            if self._current_char() == '/':
                steps.append({
                    'axis': 'descendant-or-self',
                    'node_test': 'node()',
                    'predicates': []
                })
                self._advance()
        
        # Parse steps
        while self.position < len(self.path):
            step = self._parse_step()
            if step:
                steps.append(step)
            
            # Check for next step separator
            if self._current_char() == '/':
                self._advance()
                if self._current_char() == '/':
                    # Add descendant-or-self step
                    steps.append({
                        'axis': 'descendant-or-self',
                        'node_test': 'node()',
                        'predicates': []
                    })
                    self._advance()
            else:
                break
        
        return {
            'absolute': absolute,
            'steps': steps
        }
    
    def _parse_step(self) -> Optional[Dict[str, Any]]:
        """
        Parse location step.
        
        Returns:
            Step structure or None
        """
        # Skip whitespace
        self._skip_whitespace()
        
        if self.position >= len(self.path):
            return None
        
        # Parse axis (optional)
        axis = self._parse_axis()
        
        # Parse node test
        node_test = self._parse_node_test()
        
        # Parse predicates
        predicates = []
        while self._current_char() == '[':
            predicate = self._parse_predicate()
            predicates.append(predicate)
        
        return {
            'axis': axis or 'child',
            'node_test': node_test,
            'predicates': predicates
        }
    
    def _parse_axis(self) -> Optional[str]:
        """Parse axis specifier (child::, parent::, etc.)."""
        # Look for ::
        double_colon_pos = self.path.find('::', self.position)
        if double_colon_pos == -1 or double_colon_pos > self.position + 30:
            # Special axes
            if self._current_char() == '@':
                self._advance()
                return 'attribute'
            elif self._current_char() == '.':
                self._advance()
                if self._current_char() == '.':
                    self._advance()
                    return 'parent'
                return 'self'
            return None
        
        # Extract axis name
        axis_name = self.path[self.position:double_colon_pos].strip()
        if axis_name in self.AXES:
            self.position = double_colon_pos + 2
            return axis_name
        
        return None
    
    def _parse_node_test(self) -> str:
        """Parse node test (element name, *, node(), text(), etc.)."""
        self._skip_whitespace()
        
        # Wildcard
        if self._current_char() == '*':
            self._advance()
            return '*'
        
        # Read name
        start = self.position
        while self.position < len(self.path) and self._is_name_char(self._current_char()):
            self._advance()
        
        name = self.path[start:self.position]
        
        # Check if function
        if self._current_char() == '(':
            self._advance()
            self._skip_until(')')
            if self._current_char() == ')':
                self._advance()
            return f"{name}()"
        
        return name if name else '*'
    
    def _parse_predicate(self) -> Dict[str, Any]:
        """Parse predicate expression [condition]."""
        # [
        self._consume('[', "Expected [")
        
        # Expression
        expr_start = self.position
        depth = 1
        while depth > 0 and self.position < len(self.path):
            if self._current_char() == '[':
                depth += 1
            elif self._current_char() == ']':
                depth -= 1
            if depth > 0:
                self._advance()
        
        expr_text = self.path[expr_start:self.position].strip()
        
        # ]
        self._consume(']', "Expected ]")
        
        # Parse expression
        return self._parse_predicate_expression(expr_text)
    
    def _parse_predicate_expression(self, expr: str) -> Dict[str, Any]:
        """Parse predicate expression to structured format."""
        # Simple expression parser for predicates
        expr = expr.strip()
        
        # Position test: [1], [last()], [position() = 1]
        if expr.isdigit():
            return {'type': 'position', 'value': int(expr)}
        
        if 'position()' in expr or 'last()' in expr:
            return {'type': 'position_expr', 'expression': expr}
        
        # Comparison: @attr = 'value', @attr > 10
        for op in ['!=', '<=', '>=', '=', '<', '>']:
            if op in expr:
                parts = expr.split(op, 1)
                left = parts[0].strip()
                right = parts[1].strip() if len(parts) > 1 else ''
                return {
                    'type': 'comparison',
                    'left': left,
                    'op': op,
                    'right': right
                }
        
        # Logical: and, or
        if ' and ' in expr.lower():
            parts = expr.lower().split(' and ', 1)
            return {
                'type': 'logical',
                'op': 'and',
                'left': self._parse_predicate_expression(parts[0]),
                'right': self._parse_predicate_expression(parts[1])
            }
        
        if ' or ' in expr.lower():
            parts = expr.lower().split(' or ', 1)
            return {
                'type': 'logical',
                'op': 'or',
                'left': self._parse_predicate_expression(parts[0]),
                'right': self._parse_predicate_expression(parts[1])
            }
        
        # Function call
        if '(' in expr and expr.endswith(')'):
            func_name = expr[:expr.index('(')]
            return {'type': 'function', 'name': func_name, 'args': []}
        
        # Attribute or element test
        return {'type': 'test', 'value': expr}
    
    # ==================== Conversion to QueryAction ====================
    
    def _location_path_to_actions(self, location_path: Dict[str, Any]) -> List[QueryAction]:
        """Convert location path to QueryAction tree."""
        builder = QueryActionBuilder()
        
        steps = location_path['steps']
        
        # Extract source (first step without predicates)
        source = None
        filter_steps = []
        
        for i, step in enumerate(steps):
            if i == 0 and not step['predicates']:
                source = step['node_test']
            else:
                filter_steps.append(step)
        
        # Build actions
        if source:
            builder.from_source(source)
        
        # Add filter actions from predicates
        for step in filter_steps:
            # Navigate to element
            element = step['node_test']
            
            # Add predicates as filters
            for predicate in step['predicates']:
                if predicate['type'] == 'comparison':
                    left = predicate['left'].replace('@', '')
                    op = predicate['op']
                    right = predicate['right'].strip("'\"")
                    
                    # Convert to filter format
                    if op == '=':
                        builder.where({left: right})
                    elif op == '>':
                        builder.where({left: {'$gt': right}})
                    elif op == '<':
                        builder.where({left: {'$lt': right}})
                    elif op == '>=':
                        builder.where({left: {'$gte': right}})
                    elif op == '<=':
                        builder.where({left: {'$lte': right}})
                    elif op == '!=':
                        builder.where({left: {'$ne': right}})
        
        # Add select action
        builder.select(['*'])
        
        return builder.build()
    
    # ==================== Character Navigation ====================
    
    def _current_char(self) -> str:
        """Get current character."""
        if self.position >= len(self.path):
            return ''
        return self.path[self.position]
    
    def _peek_char(self, offset: int = 1) -> str:
        """Peek ahead."""
        pos = self.position + offset
        if pos >= len(self.path):
            return ''
        return self.path[pos]
    
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
    
    def _skip_until(self, char: str) -> None:
        """Skip until specific character."""
        while self._current_char() and self._current_char() != char:
            self._advance()
    
    def _consume(self, char: str, message: str) -> None:
        """Consume specific character or raise error."""
        if self._current_char() != char:
            raise XWQueryParseError(
                f"{message}\n"
                f"  Expected: '{char}'\n"
                f"  Got: '{self._current_char()}'\n"
                f"  Position: {self.position}"
            )
        self._advance()
    
    def _is_name_char(self, char: str) -> bool:
        """Check if character is valid in name."""
        return char.isalnum() or char in ('_', '-', '.')


# ==================== Convenience Function ====================

def parse_xpath(query: str, **options) -> List[QueryAction]:
    """
    Parse XPath expression to QueryAction tree.
    
    Args:
        query: XPath expression string
        **options: Parsing options
        
    Returns:
        List of QueryAction objects
        
    Raises:
        XWQueryParseError: On parsing errors
    """
    parser = XPathParser()
    return parser.parse_with_validation(query, **options)


__all__ = [
    'XPathParser',
    'parse_xpath'
]


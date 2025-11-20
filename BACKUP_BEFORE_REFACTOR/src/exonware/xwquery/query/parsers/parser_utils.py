#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/parsers/parser_utils.py

Shared utilities for query parsing.
Reusable functions for tokenization, normalization, expression parsing.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1
Generation Date: 28-Oct-2025
"""

import re
from typing import List, Dict, Any, Optional, Tuple, Union
from enum import Enum


# ==================== Token Types ====================

class TokenType(Enum):
    """Token types for query parsing."""
    
    # Literals
    STRING = "STRING"
    NUMBER = "NUMBER"
    BOOLEAN = "BOOLEAN"
    NULL = "NULL"
    
    # Identifiers
    IDENTIFIER = "IDENTIFIER"
    KEYWORD = "KEYWORD"
    
    # Operators
    OPERATOR = "OPERATOR"
    COMPARISON = "COMPARISON"
    LOGICAL = "LOGICAL"
    ARITHMETIC = "ARITHMETIC"
    
    # Punctuation
    COMMA = "COMMA"
    DOT = "DOT"
    SEMICOLON = "SEMICOLON"
    COLON = "COLON"
    
    # Brackets
    LPAREN = "LPAREN"
    RPAREN = "RPAREN"
    LBRACKET = "LBRACKET"
    RBRACKET = "RBRACKET"
    LBRACE = "LBRACE"
    RBRACE = "RBRACE"
    
    # Special
    WILDCARD = "WILDCARD"
    EOF = "EOF"
    UNKNOWN = "UNKNOWN"


class Token:
    """
    Represents a single token in query.
    
    Attributes:
        type: Token type
        value: Token value
        position: Position in query
        line: Line number
        column: Column number
    """
    
    def __init__(
        self,
        type: TokenType,
        value: str,
        position: int = 0,
        line: int = 1,
        column: int = 1
    ):
        self.type = type
        self.value = value
        self.position = position
        self.line = line
        self.column = column
    
    def __repr__(self) -> str:
        return f"Token({self.type.value}, '{self.value}', pos={self.position})"
    
    def __eq__(self, other) -> bool:
        if isinstance(other, Token):
            return self.type == other.type and self.value == other.value
        return False


# ==================== Tokenization ====================

class Tokenizer:
    """
    Generic tokenizer for query languages.
    
    Provides basic tokenization with support for:
    - Keywords
    - Identifiers
    - String literals (single and double quotes)
    - Numbers (integers and floats)
    - Operators
    - Punctuation
    - Comments (line and block)
    """
    
    # Common SQL/query keywords (extend in subclass)
    KEYWORDS = {
        'SELECT', 'FROM', 'WHERE', 'JOIN', 'ON', 'GROUP', 'BY', 'ORDER',
        'HAVING', 'LIMIT', 'OFFSET', 'INSERT', 'INTO', 'VALUES', 'UPDATE',
        'SET', 'DELETE', 'CREATE', 'DROP', 'ALTER', 'TABLE', 'INDEX',
        'AND', 'OR', 'NOT', 'IN', 'LIKE', 'BETWEEN', 'IS', 'NULL',
        'AS', 'DISTINCT', 'ALL', 'ANY', 'EXISTS', 'CASE', 'WHEN', 'THEN',
        'ELSE', 'END', 'UNION', 'INTERSECT', 'EXCEPT', 'INNER', 'LEFT',
        'RIGHT', 'FULL', 'OUTER', 'CROSS', 'NATURAL'
    }
    
    # Operators
    OPERATORS = {
        '=', '!=', '<>', '<', '>', '<=', '>=',
        '+', '-', '*', '/', '%',
        '||'  # String concatenation
    }
    
    def __init__(self, query: str, keywords: Optional[set] = None):
        """
        Initialize tokenizer.
        
        Args:
            query: Query string to tokenize
            keywords: Custom keywords set (uses default if None)
        """
        self.query = query
        self.keywords = keywords or self.KEYWORDS
        self.position = 0
        self.line = 1
        self.column = 1
        self.tokens: List[Token] = []
    
    def tokenize(self) -> List[Token]:
        """
        Tokenize entire query.
        
        Returns:
            List of tokens
        """
        while self.position < len(self.query):
            # Skip whitespace
            if self._current_char().isspace():
                self._skip_whitespace()
                continue
            
            # Skip comments
            if self._is_comment_start():
                self._skip_comment()
                continue
            
            # String literals
            if self._current_char() in ('"', "'"):
                self.tokens.append(self._read_string())
                continue
            
            # Numbers
            if self._current_char().isdigit():
                self.tokens.append(self._read_number())
                continue
            
            # Identifiers and keywords
            if self._current_char().isalpha() or self._current_char() == '_':
                self.tokens.append(self._read_identifier())
                continue
            
            # Operators and punctuation
            token = self._read_operator_or_punctuation()
            if token:
                self.tokens.append(token)
                continue
            
            # Unknown character - skip
            self._advance()
        
        # Add EOF token
        self.tokens.append(Token(TokenType.EOF, '', self.position, self.line, self.column))
        
        return self.tokens
    
    # ==================== Helper Methods ====================
    
    def _current_char(self) -> str:
        """Get current character."""
        if self.position >= len(self.query):
            return ''
        return self.query[self.position]
    
    def _peek_char(self, offset: int = 1) -> str:
        """Peek ahead at character."""
        pos = self.position + offset
        if pos >= len(self.query):
            return ''
        return self.query[pos]
    
    def _advance(self) -> str:
        """Advance to next character."""
        if self.position < len(self.query):
            char = self.query[self.position]
            self.position += 1
            self.column += 1
            if char == '\n':
                self.line += 1
                self.column = 1
            return char
        return ''
    
    def _skip_whitespace(self) -> None:
        """Skip whitespace characters."""
        while self._current_char().isspace():
            self._advance()
    
    def _is_comment_start(self) -> bool:
        """Check if current position is start of comment."""
        # Line comment: --
        if self._current_char() == '-' and self._peek_char() == '-':
            return True
        # Block comment: /* */
        if self._current_char() == '/' and self._peek_char() == '*':
            return True
        return False
    
    def _skip_comment(self) -> None:
        """Skip comment."""
        # Line comment
        if self._current_char() == '-' and self._peek_char() == '-':
            while self._current_char() and self._current_char() != '\n':
                self._advance()
            return
        
        # Block comment
        if self._current_char() == '/' and self._peek_char() == '*':
            self._advance()  # /
            self._advance()  # *
            while self._current_char():
                if self._current_char() == '*' and self._peek_char() == '/':
                    self._advance()  # *
                    self._advance()  # /
                    break
                self._advance()
    
    def _read_string(self) -> Token:
        """Read string literal."""
        start_pos = self.position
        start_line = self.line
        start_col = self.column
        
        quote = self._advance()  # Opening quote
        value = ''
        
        while self._current_char() and self._current_char() != quote:
            if self._current_char() == '\\':
                # Escape sequence
                self._advance()
                if self._current_char():
                    value += self._advance()
            else:
                value += self._advance()
        
        if self._current_char() == quote:
            self._advance()  # Closing quote
        
        return Token(TokenType.STRING, value, start_pos, start_line, start_col)
    
    def _read_number(self) -> Token:
        """Read number literal."""
        start_pos = self.position
        start_line = self.line
        start_col = self.column
        
        value = ''
        has_dot = False
        
        while self._current_char() and (self._current_char().isdigit() or self._current_char() == '.'):
            if self._current_char() == '.':
                if has_dot:
                    break  # Second dot
                has_dot = True
            value += self._advance()
        
        return Token(TokenType.NUMBER, value, start_pos, start_line, start_col)
    
    def _read_identifier(self) -> Token:
        """Read identifier or keyword."""
        start_pos = self.position
        start_line = self.line
        start_col = self.column
        
        value = ''
        while self._current_char() and (self._current_char().isalnum() or self._current_char() in ('_', '$')):
            value += self._advance()
        
        # Check if keyword
        token_type = TokenType.KEYWORD if value.upper() in self.keywords else TokenType.IDENTIFIER
        
        return Token(token_type, value, start_pos, start_line, start_col)
    
    def _read_operator_or_punctuation(self) -> Optional[Token]:
        """Read operator or punctuation."""
        start_pos = self.position
        start_line = self.line
        start_col = self.column
        
        char = self._current_char()
        
        # Two-character operators
        two_char = char + self._peek_char()
        if two_char in self.OPERATORS:
            self._advance()
            self._advance()
            return Token(TokenType.OPERATOR, two_char, start_pos, start_line, start_col)
        
        # Single-character tokens
        token_map = {
            ',': TokenType.COMMA,
            '.': TokenType.DOT,
            ';': TokenType.SEMICOLON,
            ':': TokenType.COLON,
            '(': TokenType.LPAREN,
            ')': TokenType.RPAREN,
            '[': TokenType.LBRACKET,
            ']': TokenType.RBRACKET,
            '{': TokenType.LBRACE,
            '}': TokenType.RBRACE,
            '*': TokenType.WILDCARD if self._is_wildcard_context() else TokenType.OPERATOR,
        }
        
        if char in token_map:
            self._advance()
            return Token(token_map[char], char, start_pos, start_line, start_col)
        
        # Other operators
        if char in self.OPERATORS or char in '=!<>+-*/%':
            self._advance()
            return Token(TokenType.OPERATOR, char, start_pos, start_line, start_col)
        
        return None
    
    def _is_wildcard_context(self) -> bool:
        """Check if * is in wildcard context (e.g., SELECT *)."""
        # Simple heuristic: check if previous non-whitespace token was SELECT
        for token in reversed(self.tokens):
            if token.type == TokenType.KEYWORD and token.value.upper() == 'SELECT':
                return True
            if token.type not in (TokenType.COMMA,):
                break
        return False


# ==================== Expression Parsing ====================

def parse_expression(expr: str) -> Dict[str, Any]:
    """
    Parse expression string to structured format.
    
    Handles:
    - Arithmetic: +, -, *, /, %
    - Comparison: =, !=, <, >, <=, >=
    - Logical: AND, OR, NOT
    - Functions: FUNC(args)
    
    Args:
        expr: Expression string
        
    Returns:
        Expression AST as dictionary
    """
    # Simple expression parser (extend as needed)
    expr = expr.strip()
    
    # Logical operators (lowest precedence)
    for op in [' OR ', ' AND ']:
        if op in expr.upper():
            parts = re.split(op, expr, maxsplit=1, flags=re.IGNORECASE)
            return {
                'op': op.strip(),
                'left': parse_expression(parts[0]),
                'right': parse_expression(parts[1])
            }
    
    # Comparison operators
    for op in ['<=', '>=', '!=', '<>', '=', '<', '>']:
        if op in expr:
            parts = expr.split(op, maxsplit=1)
            return {
                'op': op,
                'left': parse_expression(parts[0].strip()),
                'right': parse_expression(parts[1].strip())
            }
    
    # Function call
    if '(' in expr and expr.endswith(')'):
        func_name = expr[:expr.index('(')].strip()
        args_str = expr[expr.index('(')+1:-1]
        args = [parse_expression(arg.strip()) for arg in split_args(args_str)]
        return {
            'type': 'function',
            'name': func_name,
            'args': args
        }
    
    # Literal or identifier
    return {'type': 'literal', 'value': expr}


def split_args(args_str: str) -> List[str]:
    """
    Split function arguments respecting nested parentheses.
    
    Args:
        args_str: Arguments string
        
    Returns:
        List of argument strings
    """
    if not args_str.strip():
        return []
    
    args = []
    current = ''
    depth = 0
    
    for char in args_str:
        if char == ',' and depth == 0:
            args.append(current.strip())
            current = ''
        else:
            if char in '([{':
                depth += 1
            elif char in ')]}':
                depth -= 1
            current += char
    
    if current:
        args.append(current.strip())
    
    return args


# ==================== Normalization ====================

def normalize_identifier(identifier: str) -> str:
    """
    Normalize identifier (remove quotes, lowercase, etc.).
    
    Args:
        identifier: Identifier string
        
    Returns:
        Normalized identifier
    """
    # Remove quotes
    if identifier.startswith('"') and identifier.endswith('"'):
        identifier = identifier[1:-1]
    if identifier.startswith('`') and identifier.endswith('`'):
        identifier = identifier[1:-1]
    if identifier.startswith('[') and identifier.endswith(']'):
        identifier = identifier[1:-1]
    
    return identifier


def normalize_whitespace(query: str) -> str:
    """
    Normalize whitespace in query.
    
    Args:
        query: Query string
        
    Returns:
        Normalized query
    """
    # Collapse multiple spaces
    query = re.sub(r'\s+', ' ', query)
    
    # Trim
    query = query.strip()
    
    return query


# ==================== Validation ====================

def is_valid_identifier(name: str) -> bool:
    """
    Check if string is valid identifier.
    
    Args:
        name: Identifier name
        
    Returns:
        True if valid identifier
    """
    if not name:
        return False
    
    # Must start with letter or underscore
    if not (name[0].isalpha() or name[0] == '_'):
        return False
    
    # Rest can be alphanumeric or underscore
    return all(c.isalnum() or c == '_' for c in name[1:])


def escape_string_literal(value: str, quote: str = "'") -> str:
    """
    Escape string literal for query.
    
    Args:
        value: String value
        quote: Quote character (' or ")
        
    Returns:
        Escaped string with quotes
    """
    # Escape backslashes
    value = value.replace('\\', '\\\\')
    
    # Escape quotes
    value = value.replace(quote, '\\' + quote)
    
    return f"{quote}{value}{quote}"


def unescape_string_literal(literal: str) -> str:
    """
    Unescape string literal.
    
    Args:
        literal: Escaped string with quotes
        
    Returns:
        Unescaped string value
    """
    # Remove quotes
    if (literal.startswith("'") and literal.endswith("'")) or \
       (literal.startswith('"') and literal.endswith('"')):
        literal = literal[1:-1]
    
    # Unescape sequences
    literal = literal.replace("\\'", "'")
    literal = literal.replace('\\"', '"')
    literal = literal.replace('\\\\', '\\')
    
    return literal


# ==================== Operator Precedence ====================

OPERATOR_PRECEDENCE = {
    # Logical (lowest)
    'OR': 1,
    'AND': 2,
    'NOT': 3,
    
    # Comparison
    '=': 4,
    '!=': 4,
    '<>': 4,
    '<': 4,
    '>': 4,
    '<=': 4,
    '>=': 4,
    'IN': 4,
    'LIKE': 4,
    'BETWEEN': 4,
    'IS': 4,
    
    # Arithmetic
    '+': 5,
    '-': 5,
    '*': 6,
    '/': 6,
    '%': 6,
    
    # Unary (highest)
    'UNARY_MINUS': 7,
    'UNARY_PLUS': 7,
}


def get_operator_precedence(operator: str) -> int:
    """
    Get operator precedence.
    
    Args:
        operator: Operator string
        
    Returns:
        Precedence level (higher = higher precedence)
    """
    return OPERATOR_PRECEDENCE.get(operator.upper(), 0)


# ==================== Exports ====================

__all__ = [
    'TokenType',
    'Token',
    'Tokenizer',
    'parse_expression',
    'split_args',
    'normalize_identifier',
    'normalize_whitespace',
    'is_valid_identifier',
    'escape_string_literal',
    'unescape_string_literal',
    'get_operator_precedence',
    'OPERATOR_PRECEDENCE'
]


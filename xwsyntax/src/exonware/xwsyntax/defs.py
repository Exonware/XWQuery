#exonware/xwsyntax/src/exonware/xwsyntax/defs.py
"""
Definitions and enums for the syntax module.
"""

from enum import Enum, auto
from typing import Final


class ParserMode(Enum):
    """Parser mode."""
    STRICT = auto()      # Strict parsing, fail on any error
    LENIENT = auto()     # Lenient parsing, try to recover
    PARTIAL = auto()     # Partial parsing, return what's parseable


class GrammarFormat(Enum):
    """Grammar format."""
    LARK = auto()        # Lark grammar format (EBNF-like)
    PEG = auto()         # Parsing Expression Grammar
    ANTLR = auto()       # ANTLR grammar format
    CUSTOM = auto()      # Custom format


class ASTNodeType(Enum):
    """Common AST node types."""
    ROOT = auto()
    STATEMENT = auto()
    EXPRESSION = auto()
    LITERAL = auto()
    IDENTIFIER = auto()
    OPERATOR = auto()
    FUNCTION = auto()
    BLOCK = auto()
    TERMINAL = auto()


# Constants
DEFAULT_GRAMMAR_FORMAT: Final[GrammarFormat] = GrammarFormat.LARK
DEFAULT_PARSER_MODE: Final[ParserMode] = ParserMode.STRICT
MAX_PARSE_DEPTH: Final[int] = 1000
CACHE_SIZE: Final[int] = 128


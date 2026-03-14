#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/query/parsers/cypher_parser.py
Cypher Parser - Grammar-based implementation
Uses grammar adapter for parsing Cypher queries to QueryAction tree.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.5
Generation Date: 20-Dec-2025
"""

from typing import Any
from .base_parser import AGraphQueryParser
from ..adapters.grammar_adapter import CypherGrammarAdapter
from ..adapters import SyntaxToQueryActionConverter
from ...contracts import QueryAction
from ...errors import XWQueryParseError
from ...defs import ConversionMode


class CypherParser(AGraphQueryParser):
    """
    Cypher parser using grammar-based parsing.
    Uses CypherGrammarAdapter with xwsyntax for parsing.
    Converts AST to QueryAction tree using SyntaxToQueryActionConverter.
    Supports:
    - MATCH patterns
    - CREATE operations
    - MERGE operations
    - DELETE operations
    - SET operations
    - RETURN clauses
    - WITH clauses
    - WHERE clauses
    - Path expressions
    """

    def __init__(self, conversion_mode: ConversionMode = ConversionMode.FLEXIBLE):
        """Initialize Cypher parser."""
        super().__init__(conversion_mode)
        self._grammar_adapter = CypherGrammarAdapter()
        self._converter = SyntaxToQueryActionConverter()

    def parse(self, query: str, **options) -> list[QueryAction]:
        """
        Parse Cypher query to QueryAction tree.
        Args:
            query: Cypher query string
            **options: Parsing options
        Returns:
            List of QueryAction objects
        Raises:
            XWQueryParseError: On parsing errors
        """
        # Security validation (from base class)
        self.validate_security(query)
        self.validate_input(query)
        try:
            # Parse using grammar adapter
            ast = self._grammar_adapter.parse(query)
            # Convert AST to QueryAction tree
            actions = self._converter.convert(ast, source_format='cypher')
            return actions
        except Exception as e:
            raise XWQueryParseError(
                f"Failed to parse Cypher query: {str(e)}"
            ) from e

    def get_format_name(self) -> str:
        """Return format name."""
        return "Cypher"

    def parse_pattern(self, pattern: str) -> Any:
        """
        Parse graph pattern (for AGraphQueryParser interface).
        Args:
            pattern: Graph pattern string
        Returns:
            Parsed pattern AST
        """
        try:
            ast = self._grammar_adapter.parse(pattern)
            return ast
        except Exception as e:
            raise XWQueryParseError(
                f"Failed to parse Cypher pattern: {str(e)}"
            ) from e

#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/query/parsers/sparql_parser.py
SPARQL Parser - Grammar-based implementation
Uses grammar adapter for parsing SPARQL queries to QueryAction tree.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.5
Generation Date: 20-Dec-2025
"""

from typing import Any
from .base_parser import AGraphQueryParser
from ..adapters.grammar_adapter import SPARQLGrammarAdapter
from ..adapters import SyntaxToQueryActionConverter
from ...contracts import QueryAction
from ...errors import XWQueryParseError
from ...defs import ConversionMode


class SPARQLParser(AGraphQueryParser):
    """
    SPARQL parser using grammar-based parsing.
    Uses SPARQLGrammarAdapter with xwsyntax for parsing.
    Converts AST to QueryAction tree using SyntaxToQueryActionConverter.
    Supports:
    - SELECT queries
    - CONSTRUCT queries
    - ASK queries
    - DESCRIBE queries
    - Triple patterns
    - Property paths
    - OPTIONAL clauses
    - FILTER clauses
    - UNION operations
    """

    def __init__(self, conversion_mode: ConversionMode = ConversionMode.FLEXIBLE):
        """Initialize SPARQL parser."""
        super().__init__(conversion_mode)
        self._grammar_adapter = SPARQLGrammarAdapter()
        self._converter = SyntaxToQueryActionConverter()

    def parse(self, query: str, **options) -> list[QueryAction]:
        """
        Parse SPARQL query to QueryAction tree.
        Args:
            query: SPARQL query string
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
            actions = self._converter.convert(ast, source_format='sparql')
            return actions
        except Exception as e:
            raise XWQueryParseError(
                f"Failed to parse SPARQL query: {str(e)}"
            ) from e

    def get_format_name(self) -> str:
        """Return format name."""
        return "SPARQL"

    def parse_pattern(self, pattern: str) -> Any:
        """
        Parse graph pattern (for AGraphQueryParser interface).
        Args:
            pattern: Graph pattern string (triple pattern)
        Returns:
            Parsed pattern AST
        """
        try:
            ast = self._grammar_adapter.parse(pattern)
            return ast
        except Exception as e:
            raise XWQueryParseError(
                f"Failed to parse SPARQL pattern: {str(e)}"
            ) from e

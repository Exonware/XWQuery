#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/query/parsers/graphql_parser.py
GraphQL Parser - Grammar-based implementation
Uses grammar adapter for parsing GraphQL queries to QueryAction tree.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.4
Generation Date: 20-Dec-2025
"""

from typing import Any
from .base_parser import ABaseParser
from ..adapters.grammar_adapter import GraphQLGrammarAdapter
from ..adapters import SyntaxToQueryActionConverter
from ...contracts import QueryAction
from ...errors import XWQueryParseError
from ...defs import ConversionMode


class GraphQLParser(ABaseParser):
    """
    GraphQL parser using grammar-based parsing.
    Uses GraphQLGrammarAdapter with xwsyntax for parsing.
    Converts AST to QueryAction tree using SyntaxToQueryActionConverter.
    Supports:
    - Query operations
    - Mutation operations
    - Subscription operations
    - Field selection
    - Arguments
    - Fragments
    - Directives
    """

    def __init__(self, conversion_mode: ConversionMode = ConversionMode.FLEXIBLE):
        """Initialize GraphQL parser."""
        super().__init__(conversion_mode)
        self._grammar_adapter = GraphQLGrammarAdapter()
        self._converter = SyntaxToQueryActionConverter()

    def parse(self, query: str, **options) -> list[QueryAction]:
        """
        Parse GraphQL query to QueryAction tree.
        Args:
            query: GraphQL query string
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
            actions = self._converter.convert(ast, source_format='graphql')
            return actions
        except Exception as e:
            raise XWQueryParseError(
                f"Failed to parse GraphQL query: {str(e)}"
            ) from e

    def get_format_name(self) -> str:
        """Return format name."""
        return "GraphQL"

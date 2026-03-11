#!/usr/bin/env python3
"""
Grammar-Based Strategy Base Class
This module provides a base class for all grammar-based query strategies
that use xwsyntax BidirectionalGrammar for parsing and generation.
Maximum reuse of xwsyntax - all strategies inherit from this base class.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.1
Generation Date: January 20, 2025
"""

from __future__ import annotations
from typing import Any, Optional
from .base import AQueryStrategy
from ...defs import QueryMode, FormatType
from ...errors import XWQueryParseError, XWQueryValueError
from ...contracts import QueryAction
from ..adapters.syntax_adapter import SyntaxToQueryActionConverter
from ..adapters.grammar_adapter import UniversalGrammarAdapter


class GrammarBasedStrategy(AQueryStrategy):
    """
    Base class for all grammar-based query strategies.
    Uses xwsyntax BidirectionalGrammar for maximum reuse:
    - All parsing via xwsyntax
    - All generation via xwsyntax
    - ParseNode ↔ QueryAction conversion via syntax_adapter
    - Format conversion via xwsyntax BidirectionalGrammar
    This eliminates manual parsing/generation code in strategies,
    reducing code by 70-80% and increasing xwsyntax reuse.
    Example:
        >>> class SQLStrategy(GrammarBasedStrategy):
        ...     def __init__(self, **options):
        ...         super().__init__('sql', **options)
        >>> 
        >>> strategy = SQLStrategy()
        >>> actions = strategy.to_actions_tree("SELECT * FROM users")
        >>> query = strategy.from_actions_tree(actions)
    """

    def __init__(self, format_name: str, **options: Any) -> None:
        """
        Initialize grammar-based strategy.
        Args:
            format_name: Format name (e.g., 'sql', 'graphql', 'cypher')
            **options: Additional options
        """
        super().__init__(**options)
        self._format_name = format_name.lower()
        self._grammar_adapter: Optional[UniversalGrammarAdapter] = None
        self._syntax_converter: Optional[SyntaxToQueryActionConverter] = None

    def _ensure_grammar_adapter(self) -> UniversalGrammarAdapter:
        """Lazy load grammar adapter from xwsyntax."""
        if self._grammar_adapter is None:
            # Use format name or try FormatType enum
            try:
                format_type = FormatType[self._format_name.upper()]
                self._grammar_adapter = UniversalGrammarAdapter(format_type)
            except (KeyError, AttributeError):
                # Fallback to string format name
                self._grammar_adapter = UniversalGrammarAdapter(self._format_name)
        return self._grammar_adapter

    def _ensure_syntax_converter(self) -> SyntaxToQueryActionConverter:
        """Lazy load syntax converter."""
        if self._syntax_converter is None:
            self._syntax_converter = SyntaxToQueryActionConverter(query_mode=self._mode)
        return self._syntax_converter

    def validate_query(self, query: str) -> bool:
        """
        Validate query using xwsyntax grammar.
        Maximum reuse: Delegates all validation to xwsyntax.
        Args:
            query: Query string to validate
        Returns:
            True if valid, False otherwise
        """
        try:
            adapter = self._ensure_grammar_adapter()
            return adapter.validate(query)
        except Exception:
            return False

    def to_actions_tree(self, query: str) -> QueryAction:
        """
        Convert query to QueryAction tree using xwsyntax.
        Maximum reuse:
        1. Parse with xwsyntax BidirectionalGrammar
        2. Convert ParseNode → QueryAction via syntax_adapter
        Args:
            query: Query string to parse
        Returns:
            QueryAction tree ready for execution
        Raises:
            XWQueryParseError: If parsing or conversion fails
        """
        try:
            # Parse with xwsyntax (maximum reuse)
            adapter = self._ensure_grammar_adapter()
            parse_node = adapter.parse(query)
            # Convert ParseNode → QueryAction
            converter = self._ensure_syntax_converter()
            return converter.convert(parse_node)
        except Exception as e:
            raise XWQueryParseError(
                f"Failed to parse {self._format_name} query: {str(e)}"
            ) from e

    def from_actions_tree(self, actions_tree: QueryAction) -> str:
        """
        Generate query from QueryAction tree using xwsyntax.
        Maximum reuse:
        1. Convert QueryAction → ParseNode via syntax_adapter
        2. Generate with xwsyntax BidirectionalGrammar
        Args:
            actions_tree: QueryAction tree to convert
        Returns:
            Generated query string
        Raises:
            XWQueryParseError: If conversion or generation fails
        """
        try:
            # Convert QueryAction → ParseNode
            converter = self._ensure_syntax_converter()
            parse_node = converter.reverse_convert(actions_tree)
            # Generate with xwsyntax (maximum reuse)
            adapter = self._ensure_grammar_adapter()
            return adapter.generate(parse_node)
        except Exception as e:
            raise XWQueryParseError(
                f"Failed to generate {self._format_name} query: {str(e)}"
            ) from e

    def from_format(self, query: str, source_format: str) -> AQueryStrategy:
        """
        Convert query from another format to this format using xwsyntax.
        Maximum reuse: Uses xwsyntax BidirectionalGrammar for format conversion.
        Args:
            query: Query string in source format
            source_format: Source format name
        Returns:
            Self with parsed query
        """
        try:
            # Parse source format with xwsyntax
            source_adapter = UniversalGrammarAdapter(source_format)
            source_parse_node = source_adapter.parse(query)
            # Convert to QueryAction (universal intermediate)
            converter = self._ensure_syntax_converter()
            actions_tree = converter.convert(source_parse_node)
            # Store actions tree for later use
            self._actions_tree = actions_tree
            return self
        except Exception as e:
            raise XWQueryParseError(
                f"Failed to convert from {source_format} to {self._format_name}: {str(e)}"
            ) from e

    def to_format(self, target_format: str) -> str:
        """
        Convert query to another format using xwsyntax.
        Maximum reuse: Uses xwsyntax BidirectionalGrammar for format conversion.
        Args:
            target_format: Target format name
        Returns:
            Query string in target format
        """
        if not hasattr(self, '_actions_tree') or not self._actions_tree:
            raise XWQueryValueError("No query parsed. Call from_format() first.")
        try:
            # Convert QueryAction → ParseNode
            converter = self._ensure_syntax_converter()
            parse_node = converter.reverse_convert(self._actions_tree)
            # Generate target format with xwsyntax
            target_adapter = UniversalGrammarAdapter(target_format)
            return target_adapter.generate(parse_node)
        except Exception as e:
            raise XWQueryParseError(
                f"Failed to convert to {target_format}: {str(e)}"
            ) from e

    def roundtrip_test(self, query: str) -> bool:
        """
        Test bidirectional roundtrip: parse → generate → parse.
        Maximum reuse: Uses xwsyntax BidirectionalGrammar roundtrip validation.
        Args:
            query: Query string to test
        Returns:
            True if roundtrip is successful
        """
        try:
            adapter = self._ensure_grammar_adapter()
            return adapter.roundtrip_test(query)
        except Exception:
            return False

    def get_query_type(self) -> str:
        """Get the query type for this strategy."""
        return self._format_name.upper()
__all__ = [
    'GrammarBasedStrategy',
]

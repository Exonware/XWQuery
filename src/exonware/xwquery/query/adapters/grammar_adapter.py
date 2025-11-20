#!/usr/bin/env python3
"""
Grammar Adapter for xwquery - Uses xwsyntax with xwquery's grammars

This module provides a unified interface for all grammar-based parsing using xwsyntax.
Loads grammars from xwquery's grammars directory for all 31+ formats.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.7
Generation Date: October 29, 2025
"""

import os
from pathlib import Path
from typing import Any, Dict, List, Optional, Union
from exonware.xwsyntax import BidirectionalGrammar, SyntaxEngine
from exonware.xwquery.contracts import QueryAction
from exonware.xwquery.defs import QueryMode, ConversionMode, FormatType
from exonware.xwquery.errors import XWQueryParseError


# Get xwquery grammars directory (resolve to absolute path)
# adapter is in: src/exonware/xwquery/query/adapters/
# grammars are in: src/exonware/xwquery/grammars/
# So we need: parent.parent.parent / "grammars"
XWQUERY_GRAMMARS_DIR = (Path(__file__).parent.parent.parent / "grammars").resolve()


class UniversalGrammarAdapter:
    """
    Universal grammar adapter using xwsyntax for all 31+ formats.
    
    Loads grammars from xwquery's grammars directory.
    Supports all FormatType values using bidirectional grammars.
    """
    
    def __init__(self, format_type: Union[str, FormatType] = FormatType.SQL):
        """
        Initialize adapter for specific format.
        
        Args:
            format_type: Format to use (SQL, GraphQL, Cypher, etc.)
        """
        if isinstance(format_type, FormatType):
            format_name = format_type.value
        else:
            format_name = format_type.lower()
        
        self._format = format_name
        self._grammar = None
        self._mode = QueryMode.AUTO
        self._conversion_mode = ConversionMode.FLEXIBLE
    
    def _ensure_grammar_loaded(self):
        """Lazy load grammar from xwquery's grammars directory."""
        if self._grammar is None:
            try:
                # Load from xwquery's grammars directory
                self._grammar = BidirectionalGrammar.load(
                    self._format,
                    grammar_dir=str(XWQUERY_GRAMMARS_DIR)
                )
            except Exception as e:
                raise XWQueryParseError(
                    f"Failed to load grammar for '{self._format}' from {XWQUERY_GRAMMARS_DIR}: {str(e)}"
                )
    
    def parse(self, query_text: str) -> Any:
        """
        Parse query text to AST.
        
        Args:
            query_text: Query string in the format's syntax
            
        Returns:
            AST tree ready for conversion to QueryAction
            
        Raises:
            XWQueryParseError: If parsing fails
        """
        self._ensure_grammar_loaded()
        
        try:
            ast = self._grammar.parse(query_text)
            return ast
        except Exception as e:
            raise XWQueryParseError(
                f"Failed to parse {self._format} query: {str(e)}"
            )
    
    def generate(self, ast: Any) -> str:
        """
        Generate query text from AST.
        
        Args:
            ast: AST tree
            
        Returns:
            Query string in the format's syntax
            
        Raises:
            XWQueryParseError: If generation fails
        """
        self._ensure_grammar_loaded()
        
        try:
            query_text = self._grammar.generate(ast)
            return query_text
        except Exception as e:
            raise XWQueryParseError(
                f"Failed to generate {self._format} query: {str(e)}"
            )
    
    def validate(self, query_text: str) -> bool:
        """
        Validate query syntax.
        
        Args:
            query_text: Query string to validate
            
        Returns:
            True if query is syntactically valid
        """
        try:
            self.parse(query_text)
            return True
        except Exception:
            return False
    
    def roundtrip_test(self, query_text: str) -> bool:
        """
        Test bidirectional roundtrip (parse → generate → parse).
        
        Args:
            query_text: Query string to test
            
        Returns:
            True if roundtrip is successful
        """
        self._ensure_grammar_loaded()
        
        try:
            return self._grammar.validate_roundtrip(query_text)
        except Exception:
            return False
    
    @staticmethod
    def list_available_formats() -> List[str]:
        """
        List all available grammar formats in xwquery's grammars directory.
        
        Returns:
            List of format names
        """
        try:
            # List all .in.grammar files in xwquery's grammars directory
            if not XWQUERY_GRAMMARS_DIR.exists():
                return []
            
            formats = []
            for file in XWQUERY_GRAMMARS_DIR.glob("*.in.grammar"):
                format_name = file.stem.replace('.in', '')
                formats.append(format_name)
            
            return sorted(formats)
        except Exception:
            # Fallback to FormatType enum
            return [fmt.value for fmt in FormatType]
    
    @staticmethod
    def create_for_format(format_type: Union[str, FormatType]) -> 'UniversalGrammarAdapter':
        """
        Factory method to create adapter for specific format.
        
        Args:
            format_type: Format to use
            
        Returns:
            Configured UniversalGrammarAdapter instance
        """
        return UniversalGrammarAdapter(format_type)


# Convenience aliases for common formats
class SQLGrammarAdapter(UniversalGrammarAdapter):
    """SQL grammar adapter (convenience)."""
    def __init__(self):
        super().__init__(FormatType.SQL)


class GraphQLGrammarAdapter(UniversalGrammarAdapter):
    """GraphQL grammar adapter (convenience)."""
    def __init__(self):
        super().__init__(FormatType.GRAPHQL)


class CypherGrammarAdapter(UniversalGrammarAdapter):
    """Cypher grammar adapter (convenience)."""
    def __init__(self):
        super().__init__(FormatType.CYPHER)


class MongoDBGrammarAdapter(UniversalGrammarAdapter):
    """MongoDB grammar adapter (convenience)."""
    def __init__(self):
        super().__init__(FormatType.MONGODB)


class SPARQLGrammarAdapter(UniversalGrammarAdapter):
    """SPARQL grammar adapter (convenience)."""
    def __init__(self):
        super().__init__(FormatType.SPARQL)


__all__ = [
    'UniversalGrammarAdapter',
    'SQLGrammarAdapter',
    'GraphQLGrammarAdapter',
    'CypherGrammarAdapter',
    'MongoDBGrammarAdapter',
    'SPARQLGrammarAdapter',
]


#!/usr/bin/env python3
"""
XWSyntax Facade - Main Public API

This module provides the main public API for the xwsyntax library,
implementing the facade pattern to hide complexity and provide
a clean, intuitive interface.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.1
Generation Date: October 29, 2025
"""

import logging
from typing import Any, Dict, List, Optional, Union
from pathlib import Path

from .base import AGrammar, ASyntaxEngine
from .engine import SyntaxEngine, Grammar
from .syntax_tree import ASTNode
from .errors import GrammarError, GrammarNotFoundError, ParseError
from .defs import ParserMode, GrammarFormat
from .grammar_loader import get_grammar_loader
from .bidirectional import BidirectionalGrammar, get_bidirectional_registry

logger = logging.getLogger(__name__)


class XWSyntax(ASyntaxEngine):
    """
    Main XWSyntax class providing a unified interface for all syntax operations.
    
    This class implements the facade pattern, hiding the complexity of the
    underlying grammar engine while providing a clean, intuitive API.
    
    Features:
    - Load grammars from 31+ formats
    - Parse text to AST
    - Generate text from AST (bidirectional)
    - Validate syntax
    - Export grammars to Monaco, tree-sitter, etc.
    
    Example:
        >>> # Parse JSON
        >>> syntax = XWSyntax()
        >>> ast = syntax.parse('{"name": "Alice"}', 'json')
        >>> 
        >>> # Bidirectional: parse and generate
        >>> grammar = syntax.load_bidirectional('sql')
        >>> ast = grammar.parse('SELECT * FROM users')
        >>> sql = grammar.generate(ast)
    """
    
    def __init__(
        self,
        grammar_dir: Optional[Union[str, Path]] = None,
        cache_size: int = 128,
        auto_load: bool = True,
    ):
        """
        Initialize XWSyntax with configuration.
        
        Args:
            grammar_dir: Directory containing grammar files (None = default)
            cache_size: Maximum number of cached parsers
            auto_load: Automatically load commonly-used grammars
        """
        self._engine = SyntaxEngine(grammar_dir=grammar_dir, cache_size=cache_size)
        self._grammar_loader = get_grammar_loader()
        self._bidirectional_registry = get_bidirectional_registry()
        self._auto_load = auto_load
        
        # Preload common grammars if auto_load is enabled
        if self._auto_load:
            self._preload_common_grammars()
    
    def _preload_common_grammars(self):
        """Preload commonly-used grammars for better performance."""
        common = ['json', 'sql', 'python', 'graphql']
        for name in common:
            try:
                self._engine.load_grammar(name)
                logger.debug(f"Preloaded grammar: {name}")
            except Exception as e:
                logger.debug(f"Could not preload {name}: {e}")
    
    # ============================================================================
    # CORE OPERATIONS (from ASyntaxEngine)
    # ============================================================================
    
    def load_grammar(self, name: str) -> AGrammar:
        """
        Load grammar by name.
        
        Args:
            name: Grammar name (e.g., 'sql', 'json', 'python')
            
        Returns:
            Grammar instance
            
        Raises:
            GrammarNotFoundError: If grammar not found
            
        Example:
            >>> syntax = XWSyntax()
            >>> grammar = syntax.load_grammar('sql')
            >>> ast = grammar.parse('SELECT * FROM users')
        """
        return self._engine.load_grammar(name)
    
    def parse(
        self,
        text: str,
        grammar: str,
        mode: ParserMode = ParserMode.STRICT,
    ) -> ASTNode:
        """
        Parse text using specified grammar.
        
        Args:
            text: Text to parse
            grammar: Grammar name (e.g., 'sql', 'json')
            mode: Parser mode (STRICT, LENIENT, etc.)
            
        Returns:
            ASTNode: Root AST node
            
        Raises:
            GrammarNotFoundError: If grammar not found
            ParseError: If parsing fails
            
        Example:
            >>> syntax = XWSyntax()
            >>> ast = syntax.parse('{"name": "Alice"}', 'json')
            >>> print(ast.type)  # 'start'
        """
        return self._engine.parse(text, grammar, mode)
    
    def validate(self, text: str, grammar: str) -> List[str]:
        """
        Validate text against grammar.
        
        Args:
            text: Text to validate
            grammar: Grammar name
            
        Returns:
            List of error messages (empty if valid)
            
        Example:
            >>> syntax = XWSyntax()
            >>> errors = syntax.validate('SELECT * FORM users', 'sql')
            >>> if errors:
            ...     print(f"Validation failed: {errors}")
        """
        return self._engine.validate(text, grammar)
    
    def list_grammars(self) -> List[str]:
        """
        List available grammars.
        
        Returns:
            List of grammar names
            
        Example:
            >>> syntax = XWSyntax()
            >>> grammars = syntax.list_grammars()
            >>> print(grammars)  # ['json', 'sql', 'python', ...]
        """
        return self._engine.list_grammars()
    
    # ============================================================================
    # BIDIRECTIONAL OPERATIONS
    # ============================================================================
    
    def load_bidirectional(self, name: str) -> BidirectionalGrammar:
        """
        Load bidirectional grammar (parse + generate).
        
        Args:
            name: Grammar name
            
        Returns:
            BidirectionalGrammar instance
            
        Example:
            >>> syntax = XWSyntax()
            >>> grammar = syntax.load_bidirectional('sql')
            >>> ast = grammar.parse('SELECT * FROM users')
            >>> sql = grammar.generate(ast)
        """
        return self._bidirectional_registry.get(name)
    
    def generate(self, ast: ASTNode, grammar: str) -> str:
        """
        Generate text from AST using specified grammar.
        
        Args:
            ast: AST node to generate from
            grammar: Grammar name
            
        Returns:
            Generated text
            
        Example:
            >>> syntax = XWSyntax()
            >>> ast = syntax.parse('SELECT * FROM users', 'sql')
            >>> sql = syntax.generate(ast, 'sql')
        """
        bidirectional = self.load_bidirectional(grammar)
        return bidirectional.generate(ast)
    
    def convert(self, text: str, from_grammar: str, to_grammar: str) -> str:
        """
        Convert text from one format to another.
        
        Args:
            text: Source text
            from_grammar: Source grammar name
            to_grammar: Target grammar name
            
        Returns:
            Converted text
            
        Example:
            >>> syntax = XWSyntax()
            >>> # Convert SQL to GraphQL (conceptually)
            >>> ast = syntax.parse('SELECT * FROM users', 'sql')
            >>> graphql = syntax.generate(ast, 'graphql')
        """
        # Parse with source grammar
        ast = self.parse(text, from_grammar)
        
        # Generate with target grammar
        return self.generate(ast, to_grammar)
    
    # ============================================================================
    # ADVANCED OPERATIONS
    # ============================================================================
    
    def parse_file(
        self,
        file_path: Union[str, Path],
        grammar: Optional[str] = None,
        mode: ParserMode = ParserMode.STRICT,
    ) -> ASTNode:
        """
        Parse file content using specified or auto-detected grammar.
        
        Args:
            file_path: Path to file
            grammar: Grammar name (None = auto-detect from extension)
            mode: Parser mode
            
        Returns:
            ASTNode: Root AST node
            
        Example:
            >>> syntax = XWSyntax()
            >>> ast = syntax.parse_file('query.sql')  # Auto-detects SQL
            >>> ast = syntax.parse_file('data.json', 'json')  # Explicit
        """
        file_path = Path(file_path)
        
        # Read file content
        try:
            text = file_path.read_text(encoding='utf-8')
        except Exception as e:
            raise GrammarError(f"Failed to read file {file_path}: {e}")
        
        # Auto-detect grammar from extension if not provided
        if grammar is None:
            ext = file_path.suffix.lower().lstrip('.')
            grammar = self._detect_grammar_from_extension(ext)
        
        return self.parse(text, grammar, mode)
    
    def validate_file(
        self,
        file_path: Union[str, Path],
        grammar: Optional[str] = None,
    ) -> List[str]:
        """
        Validate file content.
        
        Args:
            file_path: Path to file
            grammar: Grammar name (None = auto-detect)
            
        Returns:
            List of validation errors
            
        Example:
            >>> syntax = XWSyntax()
            >>> errors = syntax.validate_file('query.sql')
            >>> if not errors:
            ...     print("File is valid!")
        """
        file_path = Path(file_path)
        
        # Read file content
        try:
            text = file_path.read_text(encoding='utf-8')
        except Exception as e:
            return [f"Failed to read file: {e}"]
        
        # Auto-detect grammar from extension if not provided
        if grammar is None:
            ext = file_path.suffix.lower().lstrip('.')
            grammar = self._detect_grammar_from_extension(ext)
        
        return self.validate(text, grammar)
    
    def _detect_grammar_from_extension(self, ext: str) -> str:
        """
        Detect grammar from file extension.
        
        Args:
            ext: File extension (without dot)
            
        Returns:
            Grammar name
            
        Raises:
            GrammarError: If extension not recognized
        """
        # Extension to grammar mapping
        ext_map = {
            'sql': 'sql',
            'json': 'json',
            'py': 'python',
            'gql': 'graphql',
            'graphql': 'graphql',
            'cypher': 'cypher',
            'cql': 'cql',
            'sparql': 'sparql',
            'xml': 'xml_query',
            'xpath': 'xpath',
            'xquery': 'xquery',
            'yaml': 'yaml',
            'yml': 'yaml',
            'toml': 'toml',
        }
        
        if ext in ext_map:
            return ext_map[ext]
        
        # Try direct match
        available = self.list_grammars()
        if ext in available:
            return ext
        
        raise GrammarError(
            f"Could not detect grammar for extension '.{ext}'. "
            f"Please specify grammar explicitly."
        )
    
    # ============================================================================
    # IDE INTEGRATION
    # ============================================================================
    
    def export_to_monaco(
        self,
        grammar: str,
        case_insensitive: bool = False,
    ) -> Dict[str, Any]:
        """
        Export grammar to Monaco editor format.
        
        Args:
            grammar: Grammar name
            case_insensitive: Whether language is case-insensitive
            
        Returns:
            Monaco language definition
            
        Example:
            >>> syntax = XWSyntax()
            >>> monaco_def = syntax.export_to_monaco('sql', case_insensitive=True)
            >>> # Use in Monaco editor
        """
        g = self.load_grammar(grammar)
        return g.export_to_monaco(case_insensitive)
    
    # ============================================================================
    # UTILITY METHODS
    # ============================================================================
    
    def clear_cache(self) -> None:
        """Clear parser cache."""
        self._engine.clear_cache()
        logger.info("Parser cache cleared")
    
    def get_info(self, grammar: str) -> Dict[str, Any]:
        """
        Get grammar information.
        
        Args:
            grammar: Grammar name
            
        Returns:
            Dictionary with grammar metadata
            
        Example:
            >>> syntax = XWSyntax()
            >>> info = syntax.get_info('sql')
            >>> print(info['version'], info['format'])
        """
        g = self.load_grammar(grammar)
        return g.describe()
    
    def is_grammar_available(self, name: str) -> bool:
        """
        Check if grammar is available.
        
        Args:
            name: Grammar name
            
        Returns:
            True if grammar exists
            
        Example:
            >>> syntax = XWSyntax()
            >>> if syntax.is_grammar_available('sql'):
            ...     # Use SQL grammar
        """
        return name in self.list_grammars()


# ============================================================================
# FACTORY CLASS
# ============================================================================

class XWSyntaxFactory:
    """Factory for creating XWSyntax instances."""
    
    @staticmethod
    def create(
        grammar_dir: Optional[Union[str, Path]] = None,
        **options
    ) -> XWSyntax:
        """
        Create XWSyntax instance with options.
        
        Args:
            grammar_dir: Custom grammar directory
            **options: Additional options
            
        Returns:
            XWSyntax instance
        """
        return XWSyntax(grammar_dir=grammar_dir, **options)
    
    @staticmethod
    def with_custom_grammars(grammar_dir: Union[str, Path]) -> XWSyntax:
        """
        Create XWSyntax with custom grammar directory.
        
        Args:
            grammar_dir: Directory containing custom grammars
            
        Returns:
            XWSyntax instance
        """
        return XWSyntax(grammar_dir=grammar_dir, auto_load=False)
    
    @staticmethod
    def lightweight() -> XWSyntax:
        """
        Create lightweight XWSyntax (no preloading, small cache).
        
        Returns:
            XWSyntax instance with minimal footprint
        """
        return XWSyntax(cache_size=16, auto_load=False)
    
    @staticmethod
    def performance() -> XWSyntax:
        """
        Create XWSyntax optimized for performance (large cache, preloading).
        
        Returns:
            XWSyntax instance optimized for speed
        """
        return XWSyntax(cache_size=512, auto_load=True)


# ============================================================================
# CONVENIENCE FUNCTIONS
# ============================================================================

def parse(text: str, grammar: str, mode: ParserMode = ParserMode.STRICT) -> ASTNode:
    """
    Quick parse function.
    
    Example:
        >>> from exonware.xwsyntax import parse
        >>> ast = parse('{"name": "Alice"}', 'json')
    """
    syntax = XWSyntax()
    return syntax.parse(text, grammar, mode)


def validate(text: str, grammar: str) -> List[str]:
    """
    Quick validate function.
    
    Example:
        >>> from exonware.xwsyntax import validate
        >>> errors = validate('SELECT * FROM users', 'sql')
    """
    syntax = XWSyntax()
    return syntax.validate(text, grammar)


def load_grammar(name: str) -> AGrammar:
    """
    Quick load grammar function.
    
    Example:
        >>> from exonware.xwsyntax import load_grammar
        >>> grammar = load_grammar('sql')
    """
    syntax = XWSyntax()
    return syntax.load_grammar(name)


def list_grammars() -> List[str]:
    """
    Quick list grammars function.
    
    Example:
        >>> from exonware.xwsyntax import list_grammars
        >>> print(list_grammars())
    """
    syntax = XWSyntax()
    return syntax.list_grammars()


# Export main classes and functions
__all__ = [
    # Main classes
    'XWSyntax',
    'XWSyntaxFactory',
    # Convenience functions
    'parse',
    'validate',
    'load_grammar',
    'list_grammars',
]


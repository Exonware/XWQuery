#exonware/xwsyntax/src/exonware/xwsyntax/syntax_facade.py
"""
XWSyntax Facade - Clean bidirectional syntax API.

NO HARDCODING - All metadata comes from handler classes.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.1
Date: October 29, 2025
"""

from pathlib import Path
from typing import Optional, Dict, Any, List
from .syntax_tree import ASTNode
from .base import AGrammar
from .errors import SyntaxError, GrammarNotFoundError


class XWSyntax:
    """
    Unified syntax reader/writer facade.
    
    Acts as both parser and generator for bidirectional formats.
    
    NO HARDCODING PRINCIPLE:
    - Format metadata comes from handler classes
    - Auto-detection via registry
    - Zero hardcoded format checks
    
    Usage:
        # Option 1: Explicit paths
        syntax = XWSyntax("SQL", "sql",
                         grammar_in="grammars/sql.in.grammar",
                         grammar_out="grammars/sql.out.grammar")
        
        # Option 2: Auto-discovery
        syntax = XWSyntax.load(
            format="SQL",
            grammar_dir="grammars/",
            bidirectional=True
        )
        
        # Option 3: From grammar file
        syntax = XWSyntax.from_grammar("grammars/sql.in.grammar")
        
        # Reader (parse)
        ast = syntax.parse("SELECT * FROM users")
        
        # Writer (generate)
        sql = syntax.generate(ast)
        
        # Aliases
        ast = syntax.deserialize("SELECT * FROM users")
        sql = syntax.serialize(ast)
        sql = syntax.unparse(ast)
    """
    
    def __init__(self,
                 format_id: str,
                 syntax_name: str,
                 grammar_in: Optional[str] = None,
                 grammar_out: Optional[str] = None,
                 # Optional metadata overrides
                 extensions: Optional[List[str]] = None,
                 mime_types: Optional[List[str]] = None,
                 aliases: Optional[List[str]] = None,
                 category: Optional[str] = None,
                 **options):
        """
        Initialize syntax handler.
        
        Args:
            format_id: Format ID (e.g., "SQL", "GraphQL")
            syntax_name: Syntax name (e.g., "sql", "graphql")
            grammar_in: Path to input grammar (for parsing)
            grammar_out: Path to output grammar (for generation)
            extensions: Override file extensions
            mime_types: Override MIME types
            aliases: Override aliases
            category: Override category
            **options: Additional options passed to handler
        """
        self.format_id = format_id
        self.syntax_name = syntax_name
        
        # Get handler from registry (NO HARDCODING!)
        from .registry import get_syntax_registry
        registry = get_syntax_registry()
        
        self._handler = registry.get_handler(format_id)
        
        # Apply metadata overrides if provided
        if extensions:
            self._handler._override_extensions = extensions
        if mime_types:
            self._handler._override_mime_types = mime_types
        if aliases:
            self._handler._override_aliases = aliases
        if category:
            self._handler._override_category = category
        
        # Load grammars
        self._grammar_in: Optional[AGrammar] = None
        self._grammar_out: Optional[AGrammar] = None
        
        if grammar_in:
            self._grammar_in = self._load_grammar_file(grammar_in)
        
        if grammar_out:
            self._grammar_out = self._load_grammar_file(grammar_out)
    
    def _load_grammar_file(self, path: str) -> AGrammar:
        """Load grammar from file."""
        from .grammar_loader import get_grammar_loader
        loader = get_grammar_loader()
        grammar_text, format_type, metadata = loader.load_grammar_file(path)
        return self._handler.parse_grammar(grammar_text, metadata)
    
    # =========================================================================
    # FACTORY METHODS (Options 2 & 3 from proposal)
    # =========================================================================
    
    @classmethod
    def load(cls,
             format: str,
             grammar_dir: Optional[str] = None,
             grammar_in: Optional[str] = None,
             grammar_out: Optional[str] = None,
             bidirectional: bool = False,
             **metadata) -> 'XWSyntax':
        """
        Load syntax with auto-discovery (Option 2).
        
        Args:
            format: Format ID (e.g., "SQL", "GraphQL")
            grammar_dir: Directory containing grammars (auto-finds {name}.in.grammar)
            grammar_in: Explicit input grammar path
            grammar_out: Explicit output grammar path
            bidirectional: Whether to load output grammar
            **metadata: Optional metadata overrides (extensions, mime_types, etc.)
        
        Returns:
            XWSyntax instance
        
        Example:
            syntax = XWSyntax.load(
                format="SQL",
                grammar_dir="grammars/",
                bidirectional=True
            )
        """
        # Get format metadata from registry
        from .registry import get_syntax_registry
        registry = get_syntax_registry()
        handler = registry.get_handler(format)
        
        syntax_name = handler.syntax_name
        
        # Auto-discover grammar paths if directory provided
        if grammar_dir and not grammar_in:
            grammar_in = f"{grammar_dir}/{syntax_name}.in.grammar"
        
        if grammar_dir and bidirectional and not grammar_out:
            grammar_out = f"{grammar_dir}/{syntax_name}.out.grammar"
        
        return cls(
            format_id=format,
            syntax_name=syntax_name,
            grammar_in=grammar_in,
            grammar_out=grammar_out,
            **metadata
        )
    
    @classmethod
    def from_grammar(cls, grammar_path: str, **metadata) -> 'XWSyntax':
        """
        Create from grammar file with auto-detection (Option 3).
        
        Args:
            grammar_path: Path to grammar file
            **metadata: Optional metadata overrides
        
        Returns:
            XWSyntax instance
        
        Auto-detects:
            - Format from file extension
            - Whether it's .in or .out grammar
            - Matching complementary grammar
        
        Example:
            syntax = XWSyntax.from_grammar("grammars/sql.in.grammar")
            # Auto-detects: format="SQL", finds sql.out.grammar
        """
        from .registry import get_syntax_registry
        registry = get_syntax_registry()
        
        path = Path(grammar_path)
        
        # Auto-detect format from extension or content
        format_id = registry.detect_format(grammar_path)
        
        if not format_id:
            # Try to detect from filename
            # e.g., "sql.in.grammar" -> format="SQL"
            name_parts = path.stem.split('.')
            if name_parts:
                potential_format = name_parts[0].upper()
                if registry.has_handler(potential_format):
                    format_id = potential_format
        
        if not format_id:
            raise ValueError(f"Could not auto-detect format from: {grammar_path}")
        
        handler = registry.get_handler(format_id)
        syntax_name = handler.syntax_name
        
        # Determine if this is input or output grammar
        is_input = '.in.' in str(path) or not '.out.' in str(path)
        
        grammar_in = grammar_path if is_input else None
        grammar_out = None
        
        # Try to find complementary grammar
        if is_input:
            # Look for .out.grammar
            out_path = str(path).replace('.in.grammar', '.out.grammar')
            if Path(out_path).exists():
                grammar_out = out_path
        
        return cls(
            format_id=format_id,
            syntax_name=syntax_name,
            grammar_in=grammar_in,
            grammar_out=grammar_out,
            **metadata
        )
    
    # =========================================================================
    # READER OPERATIONS (Parse)
    # =========================================================================
    
    def parse(self, text: str) -> ASTNode:
        """
        Parse text to AST (reader operation).
        
        Args:
            text: Source text to parse
        
        Returns:
            AST representation
        
        Raises:
            ValueError: If no input grammar loaded
            ParseError: If parsing fails
        
        Example:
            sql = XWSyntax("SQL", "sql", grammar_in="sql.in.grammar")
            ast = sql.parse("SELECT * FROM users WHERE age > 18")
        """
        if not self._grammar_in:
            raise ValueError("No input grammar loaded. Provide grammar_in parameter.")
        
        return self._handler.parse(text, self._grammar_in)
    
    # =========================================================================
    # WRITER OPERATIONS (Generate)
    # =========================================================================
    
    def generate(self, ast: ASTNode) -> str:
        """
        Generate text from AST (writer operation).
        
        Args:
            ast: AST to generate from
        
        Returns:
            Generated text
        
        Raises:
            ValueError: If no output grammar loaded
            NotImplementedError: If format doesn't support generation
        
        Example:
            sql = XWSyntax("SQL", "sql", grammar_out="sql.out.grammar")
            text = sql.generate(ast)
        """
        if not self._grammar_out:
            raise ValueError("No output grammar loaded. Provide grammar_out parameter.")
        
        return self._handler.generate(ast, self._grammar_out)
    
    # =========================================================================
    # ALIASES (parse/generate/serialize/deserialize/unparse)
    # =========================================================================
    
    def deserialize(self, text: str) -> ASTNode:
        """Alias for parse() - deserialize text to AST."""
        return self.parse(text)
    
    def serialize(self, ast: ASTNode) -> str:
        """Alias for generate() - serialize AST to text."""
        return self.generate(ast)
    
    def unparse(self, ast: ASTNode) -> str:
        """Alias for generate() - unparse AST to text."""
        return self.generate(ast)
    
    # =========================================================================
    # METADATA ACCESS (from handler)
    # =========================================================================
    
    @property
    def extensions(self) -> List[str]:
        """Get supported file extensions from handler."""
        return self._handler.file_extensions
    
    @property
    def mime_types(self) -> List[str]:
        """Get MIME types from handler."""
        return getattr(self._handler, 'mime_types', [])
    
    @property
    def aliases(self) -> List[str]:
        """Get aliases from handler."""
        return self._handler.aliases
    
    @property
    def category(self) -> str:
        """Get category from handler."""
        return self._handler.category
    
    @property
    def supports_bidirectional(self) -> bool:
        """Check if format supports bidirectional operations."""
        return self._handler.supports_bidirectional
    
    def get_metadata(self) -> Dict[str, Any]:
        """
        Get all metadata from handler.
        
        Returns:
            Dictionary with format metadata:
            - format_id
            - syntax_name
            - extensions
            - mime_types
            - aliases
            - category
            - bidirectional
        """
        return {
            'format_id': self.format_id,
            'syntax_name': self.syntax_name,
            'extensions': self.extensions,
            'mime_types': self.mime_types,
            'aliases': self.aliases,
            'category': self.category,
            'bidirectional': self.supports_bidirectional,
        }
    
    def __repr__(self) -> str:
        """String representation."""
        in_status = "✓" if self._grammar_in else "✗"
        out_status = "✓" if self._grammar_out else "✗"
        return (f"<XWSyntax format={self.format_id} "
                f"parse={in_status} generate={out_status}>")


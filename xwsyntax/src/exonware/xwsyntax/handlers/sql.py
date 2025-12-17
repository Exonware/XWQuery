#exonware/xwsyntax/src/exonware/xwsyntax/handlers/sql.py
"""
SQL Grammar Handler - Self-describing, NO HARDCODING!

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Date: October 29, 2025
"""

from typing import Optional, Any
from pathlib import Path
from ..base import ASyntaxHandler, AGrammar
from ..syntax_tree import ASTNode
from ..defs import GrammarFormat
from ..errors import GrammarNotFoundError


class SQLGrammarHandler(ASyntaxHandler):
    """
    SQL Grammar Handler.
    
    Declares all its own metadata - NO HARDCODING needed!
    """
    
    # =========================================================================
    # METADATA (Self-Describing - NO HARDCODING!)
    # =========================================================================
    
    @property
    def format_id(self) -> str:
        """Unique format identifier."""
        return "SQL"
    
    @property
    def syntax_name(self) -> str:
        """Syntax name (lowercase)."""
        return "sql"
    
    @property
    def format_name(self) -> str:
        """Format name for ISerialization compatibility."""
        return "SQL"
    
    @property
    def file_extensions(self) -> list[str]:
        """Supported file extensions."""
        return [".sql", ".ddl", ".dml", ".dql"]
    
    @property
    def mime_type(self) -> str:
        """Primary MIME type."""
        return "application/sql"
    
    @property
    def mime_types(self) -> list[str]:
        """All MIME types."""
        return ["application/sql", "text/x-sql", "application/x-sql"]
    
    @property
    def aliases(self) -> list[str]:
        """Alternative names."""
        return ["sql", "SQL", "structured-query-language", "tsql", "plsql", "mysql", "postgresql"]
    
    @property
    def category(self) -> str:
        """Format category."""
        return "query"
    
    @property
    def supports_bidirectional(self) -> bool:
        """SQL supports both parse and generate."""
        return True
    
    @property
    def is_binary_format(self) -> bool:
        """SQL is text-based."""
        return False
    
    @property
    def supports_streaming(self) -> bool:
        """SQL doesn't support streaming."""
        return False
    
    # =========================================================================
    # GRAMMAR OPERATIONS (from ISyntaxHandler)
    # =========================================================================
    
    def parse_grammar(self, text: str, metadata: Optional[dict[str, Any]] = None) -> AGrammar:
        """Parse SQL grammar definition."""
        # Implementation uses existing engine
        from ..engine import Grammar
        return Grammar(
            name=metadata.get('name', self.syntax_name) if metadata else self.syntax_name,
            grammar_text=text,
            version=metadata.get('version', '1.0.0') if metadata else '1.0.0',
            start_rule=metadata.get('start_rule', 'start') if metadata else 'start'
        )
    
    def validate_grammar(self, text: str) -> list[str]:
        """Validate SQL grammar."""
        errors = []
        # Basic validation
        if not text or not text.strip():
            errors.append("Grammar cannot be empty")
        return errors
    
    def get_grammar_format(self) -> GrammarFormat:
        """SQL uses Lark format."""
        return GrammarFormat.LARK
    
    def convert_to_lark(self, grammar_data: Any) -> str:
        """Convert SQL grammar data to Lark EBNF."""
        if isinstance(grammar_data, str):
            return grammar_data
        # Add conversion logic if needed
        return str(grammar_data)
    
    # =========================================================================
    # PARSING AND GENERATION (Bidirectional)
    # =========================================================================
    
    def parse(self, text: str, grammar: Optional[AGrammar] = None) -> ASTNode:
        """
        Parse SQL text to AST.
        
        Args:
            text: SQL query text
            grammar: Optional grammar (uses default SQL grammar if not provided)
        
        Returns:
            AST representation of SQL
        """
        if grammar is None:
            # Use default SQL grammar
            grammar = self._get_default_grammar()
        
        # Parse using Lark
        tree = grammar.parse(text)
        
        # Convert to ASTNode
        return self._tree_to_ast(tree)
    
    def generate(self, ast: ASTNode, grammar: Optional[AGrammar] = None) -> str:
        """
        Generate SQL text from AST.
        
        Args:
            ast: AST representation
            grammar: Optional output grammar
        
        Returns:
            SQL query text
        """
        # Use unparser/generator
        from ..unparser import GrammarUnparser
        
        if grammar is None:
            grammar = self._get_default_output_grammar()
        
        unparser = GrammarUnparser(grammar)
        return unparser.unparse(ast)
    
    # =========================================================================
    # HELPER METHODS
    # =========================================================================
    
    def _get_default_grammar(self) -> AGrammar:
        """Get default SQL input grammar."""
        from ..grammar_loader import get_grammar_loader
        loader = get_grammar_loader()
        
        # Try to find sql.in.grammar
        grammar_paths = [
            "sql.in.grammar",
            "grammars/sql.in.grammar",
            "src/exonware/xwsyntax/grammars/sql.in.grammar",
        ]
        
        for path in grammar_paths:
            try:
                grammar_text, _, metadata = loader.load_grammar_file(path)
                return self.parse_grammar(grammar_text, metadata)
            except (FileNotFoundError, GrammarError):
                # Expected - try next path
                continue
        
        raise GrammarNotFoundError("No default SQL grammar found")
    
    def _get_default_output_grammar(self) -> AGrammar:
        """Get default SQL output grammar."""
        from ..grammar_loader import get_grammar_loader
        loader = get_grammar_loader()
        
        # Try to find sql.out.grammar
        grammar_paths = [
            "sql.out.grammar",
            "grammars/sql.out.grammar",
            "src/exonware/xwsyntax/grammars/sql.out.grammar",
        ]
        
        for path in grammar_paths:
            try:
                grammar_text, _, metadata = loader.load_grammar_file(path)
                return self.parse_grammar(grammar_text, metadata)
            except (FileNotFoundError, GrammarError):
                # Expected - try next path
                continue
        
        raise GrammarNotFoundError("No default SQL output grammar found")
    
    def _tree_to_ast(self, tree: Any) -> ASTNode:
        """Convert Lark tree to ASTNode."""
        # Basic conversion
        if hasattr(tree, 'data'):
            return ASTNode(
                type=tree.data,
                children=[self._tree_to_ast(child) for child in tree.children]
            )
        else:
            return ASTNode(type='Terminal', value=str(tree))
    
    # =========================================================================
    # ISerialization Required Methods
    # =========================================================================
    
    def capabilities(self) -> set:
        """Get serialization capabilities."""
        return set()
    
    def sniff_format(self, src: Any) -> Any:
        """Detect if content is SQL."""
        if isinstance(src, str):
            # Simple heuristic
            sql_keywords = ['SELECT', 'INSERT', 'UPDATE', 'DELETE', 'CREATE', 'DROP']
            upper = src.upper()
            return any(kw in upper for kw in sql_keywords)
        return False


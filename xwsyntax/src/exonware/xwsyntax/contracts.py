#exonware/xwsyntax/src/exonware/xwsyntax/contracts.py
"""
Type protocols and interfaces for the syntax module.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.1
"""

from abc import ABC, abstractmethod
from typing import Protocol, Any, Dict, List, Optional, Union
from pathlib import Path
from .defs import ParserMode, GrammarFormat

# Import serialization interface from xwsystem
# xwsystem is a core dependency - no try/except per DEV_GUIDELINES.md Line 128
from exonware.xwsystem.io.serialization import ISerialization


class ParseResult(Protocol):
    """Protocol for parse results."""
    
    @property
    def success(self) -> bool:
        """Whether parsing succeeded."""
        ...
    
    @property
    def ast(self) -> Optional[Any]:
        """AST if successful."""
        ...
    
    @property
    def errors(self) -> List[str]:
        """List of errors if failed."""
        ...


class GrammarLoader(Protocol):
    """Protocol for grammar loaders."""
    
    def load(self, name: str) -> str:
        """Load grammar text by name."""
        ...
    
    def exists(self, name: str) -> bool:
        """Check if grammar exists."""
        ...


class ParserCache(Protocol):
    """Protocol for parser caching."""
    
    def get(self, key: str) -> Optional[Any]:
        """Get cached parser."""
        ...
    
    def set(self, key: str, parser: Any) -> None:
        """Cache parser."""
        ...
    
    def clear(self) -> None:
        """Clear cache."""
        ...


class ASTTransformer(Protocol):
    """Protocol for AST transformers."""
    
    def transform(self, tree: Any) -> Any:
        """Transform tree to AST."""
        ...


# ============================================================================
# SYNTAX HANDLER INTERFACE - EXTENDS SERIALIZATION
# ============================================================================

class ISyntaxHandler(ISerialization):
    """
    Syntax handler interface that extends ISerialization.
    
    This interface combines serialization capabilities with grammar-specific
    functionality. By extending ISerialization, syntax handlers inherit all
    the serialization methods (dumps, loads, save, load, etc.) and add
    grammar-specific operations.
    
    NO HARDCODING PRINCIPLE:
    - Each handler declares its own metadata (ID, extensions, MIME types)
    - Registry auto-discovers handlers by their metadata
    - Zero hardcoded if/elif chains for format detection
    
    Example Implementation:
        class SQLGrammarHandler(ASyntaxHandler):
            @property
            def format_id(self) -> str:
                return "SQL"
            
            @property
            def syntax_name(self) -> str:
                return "sql"
            
            @property
            def file_extensions(self) -> List[str]:
                return [".sql", ".ddl", ".dml"]
            
            def parse(self, text: str) -> ASTNode:
                # Parse SQL to AST
                return ast
            
            def generate(self, ast: ASTNode) -> str:
                # Generate SQL from AST
                return sql_text
    """
    
    # =========================================================================
    # METADATA PROPERTIES (NO HARDCODING!)
    # =========================================================================
    
    @property
    @abstractmethod
    def format_id(self) -> str:
        """
        Unique format identifier (e.g., 'SQL', 'GraphQL').
        
        Used for registry lookup and identification.
        Should be ALL CAPS for consistency.
        """
        pass
    
    @property
    @abstractmethod
    def syntax_name(self) -> str:
        """
        Syntax name in lowercase (e.g., 'sql', 'graphql').
        
        Used for user-friendly references and file naming.
        """
        pass
    
    @property
    def aliases(self) -> List[str]:
        """
        Alternative names for this format.
        
        Returns:
            List of aliases (default: [format_id.lower(), syntax_name])
        """
        return [self.format_id.lower(), self.syntax_name]
    
    @property
    def category(self) -> str:
        """
        Format category (e.g., 'query', 'data', 'programming').
        
        Returns:
            Category string (default: 'query')
        """
        return "query"
    
    @property
    def supports_bidirectional(self) -> bool:
        """
        Whether this format supports both parse and generate.
        
        Returns:
            True if bidirectional, False if parse-only (default: False)
        """
        return False
    
    # =========================================================================
    # GRAMMAR-SPECIFIC METHODS (in addition to ISerialization methods)
    # =========================================================================
    
    @abstractmethod
    def parse_grammar(self, text: str, metadata: Optional[Dict[str, Any]] = None) -> 'AGrammar':
        """
        Parse grammar text into a Grammar object.
        
        This is distinct from parse() which parses input text using a grammar.
        This method parses the grammar definition itself.
        
        Args:
            text: Grammar definition text
            metadata: Optional metadata about the grammar
            
        Returns:
            Grammar object ready for use
            
        Raises:
            GrammarError: If grammar is invalid
        """
        pass
    
    @abstractmethod
    def validate_grammar(self, text: str) -> List[str]:
        """
        Validate grammar definition.
        
        Args:
            text: Grammar definition text
            
        Returns:
            List of validation errors (empty if valid)
        """
        pass
    
    @abstractmethod
    def get_grammar_format(self) -> GrammarFormat:
        """
        Get the grammar format this handler supports.
        
        Returns:
            GrammarFormat enum value
        """
        pass
    
    @abstractmethod
    def convert_to_lark(self, grammar_data: Any) -> str:
        """
        Convert grammar from native format to Lark EBNF.
        
        This enables cross-format grammar conversion.
        
        Args:
            grammar_data: Grammar in native format (dict, etc.)
            
        Returns:
            Grammar in Lark EBNF format
        """
        pass
    
    def load_grammar(self, file_path: Union[str, Path]) -> 'AGrammar':
        """
        Load grammar from file.
        
        This combines load() from ISerialization with parse_grammar().
        
        Args:
            file_path: Path to grammar file
            
        Returns:
            Grammar object
            
        Raises:
            GrammarNotFoundError: If file not found
            GrammarError: If grammar is invalid
        """
        # Default implementation using inherited load()
        data = self.load(file_path)
        
        # If data is text, parse directly
        if isinstance(data, str):
            return self.parse_grammar(data)
        
        # If data is structured (dict), convert to Lark first
        elif isinstance(data, dict):
            lark_text = self.convert_to_lark(data)
            return self.parse_grammar(lark_text, metadata={'source_data': data})
        
        else:
            raise GrammarError(f"Unsupported grammar data type: {type(data)}")
    
    def save_grammar(self, grammar: 'AGrammar', file_path: Union[str, Path]) -> None:
        """
        Save grammar to file.
        
        This combines grammar serialization with save() from ISerialization.
        
        Args:
            grammar: Grammar object to save
            file_path: Path to save to
        """
        # Export grammar as text (this could be format-specific)
        grammar_text = self.dumps_text(grammar)
        
        # Use inherited save() method
        self.save(grammar_text, file_path)
    
    # =========================================================================
    # PARSING AND GENERATION (Bidirectional Operations)
    # =========================================================================
    
    @abstractmethod
    def parse(self, text: str, grammar: Optional['AGrammar'] = None) -> 'ASTNode':
        """
        Parse text to AST using this syntax.
        
        Args:
            text: Source text to parse
            grammar: Optional grammar to use (uses default if not provided)
        
        Returns:
            AST representation
        
        Raises:
            ParseError: If parsing fails
        
        Example:
            handler = SQLGrammarHandler()
            ast = handler.parse("SELECT * FROM users")
        """
        pass
    
    def generate(self, ast: 'ASTNode', grammar: Optional['AGrammar'] = None) -> str:
        """
        Generate text from AST (for bidirectional formats).
        
        Args:
            ast: AST to generate from
            grammar: Optional output grammar (uses default if not provided)
        
        Returns:
            Generated text
        
        Raises:
            NotImplementedError: If format doesn't support generation
        
        Example:
            handler = SQLGrammarHandler()
            sql_text = handler.generate(ast)
        """
        if not self.supports_bidirectional:
            raise NotImplementedError(
                f"{self.format_id} does not support text generation"
            )
        raise NotImplementedError("generate() must be implemented for bidirectional formats")
    
    # =========================================================================
    # ALIASES (for consistency with serialization terminology)
    # =========================================================================
    
    def deserialize(self, text: str, grammar: Optional['AGrammar'] = None) -> 'ASTNode':
        """
        Alias for parse() - deserialize text to AST.
        
        Provides consistent terminology with serialization systems.
        """
        return self.parse(text, grammar)
    
    def serialize(self, ast: 'ASTNode', grammar: Optional['AGrammar'] = None) -> str:
        """
        Alias for generate() - serialize AST to text.
        
        Provides consistent terminology with serialization systems.
        """
        return self.generate(ast, grammar)
    
    def unparse(self, ast: 'ASTNode', grammar: Optional['AGrammar'] = None) -> str:
        """
        Alias for generate() - unparse AST to text.
        
        Common terminology in AST systems.
        """
        return self.generate(ast, grammar)


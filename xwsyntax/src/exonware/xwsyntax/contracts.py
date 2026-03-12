#exonware/xwsyntax/src/exonware/xwsyntax/contracts.py
"""
Type protocols and interfaces for the syntax module.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.6.0.4
"""

from __future__ import annotations
from typing import Protocol, Any, Optional, runtime_checkable, TYPE_CHECKING
from pathlib import Path
from .defs import ParserMode, GrammarFormat
# Import serialization interface from xwsystem
# xwsystem is a core dependency - no try/except per DEV_GUIDELINES.md Line 128
from exonware.xwsystem.io.serialization import ISerialization
if TYPE_CHECKING:
    from .syntax_tree import ParseNode
    from .base import AGrammar, AParseNode


class IParseResult(Protocol):
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

    def errors(self) -> list[str]:
        """List of errors if failed."""
        ...


class IGrammarLoader(Protocol):
    """Protocol for grammar loaders."""

    def load(self, name: str) -> str:
        """Load grammar text by name."""
        ...

    def exists(self, name: str) -> bool:
        """Check if grammar exists."""
        ...


class IParserCache(Protocol):
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


class IASTTransformer(Protocol):
    """Protocol for AST transformers."""

    def transform(self, tree: Any) -> Any:
        """Transform tree to AST."""
        ...
@runtime_checkable

class IParseNode(Protocol):
    """
    Protocol/Interface for parse nodes.
    This interface defines the contract that all parse nodes must follow,
    allowing different implementations to be used interchangeably.
    Following DEV_GUIDELINES.md: Interfaces in contracts.py use Protocol.
    """
    @property

    def type(self) -> str:
        """Get node type."""
        ...
    @property

    def value(self) -> Optional[Any]:
        """Get node value."""
        ...
    @property

    def children(self) -> list['ParseNode']:
        """Get child nodes."""
        ...
    @property

    def metadata(self) -> dict[str, Any]:
        """Get node metadata."""
        ...

    def to_dict(self) -> dict[str, Any]:
        """Convert to dictionary representation."""
        ...
    @classmethod

    def from_dict(cls, data: dict[str, Any]) -> 'ParseNode':
        """Create from dictionary representation."""
        ...

    def find_all(self, node_type: str) -> list['ParseNode']:
        """Find all nodes of a given type."""
        ...

    def find_first(self, node_type: str) -> Optional['ParseNode']:
        """Find first node of a given type."""
        ...
# ============================================================================
# SYNTAX HANDLER INTERFACE - EXTENDS SERIALIZATION
# ============================================================================
# ============================================================================
# SYNTAX ENGINE INTERFACE
# ============================================================================
@runtime_checkable

class ISyntaxEngine(Protocol):
    """
    Protocol/Interface for syntax engines.
    This interface defines the contract that all syntax engines must follow,
    allowing different implementations (Native, Lark, etc.) to be used
    interchangeably.
    """

    def load_grammar(self, name: str) -> "AGrammar":
        """
        Load grammar by name.
        Args:
            name: Grammar name (e.g., 'sql', 'json')
        Returns:
            Grammar instance
        Raises:
            GrammarNotFoundError: If grammar not found
        """
        ...

    def parse(
        self,
        text: str,
        grammar: str,
        mode: ParserMode = ParserMode.STRICT,
    ) -> "ParseNode":
        """
        Parse text using specified grammar.
        Args:
            text: Text to parse
            grammar: Grammar name
            mode: Parser mode
        Returns:
            ParseNode: Root AST node
        Raises:
            GrammarNotFoundError: If grammar not found
            ParseError: If parsing fails
        """
        ...

    def validate(self, text: str, grammar: str) -> list[str]:
        """
        Validate text against grammar.
        Args:
            text: Text to validate
            grammar: Grammar name
        Returns:
            List of error messages (empty if valid)
        """
        ...

    def list_grammars(self) -> list[str]:
        """
        List available grammars.
        Returns:
            List of grammar names
        """
        ...
# ============================================================================
# SYNTAX HANDLER INTERFACE - EXTENDS SERIALIZATION
# ============================================================================
@runtime_checkable

class ISyntaxHandler(ISerialization, Protocol):
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
            def file_extensions(self) -> list[str]:
                return [".sql", ".ddl", ".dml"]
            def parse(self, text: str) -> ParseNode:
                # Parse SQL to AST
                return ast
            def generate(self, ast: ParseNode) -> str:
                # Generate SQL from AST
                return sql_text
    """
    # =========================================================================
    # METADATA PROPERTIES (NO HARDCODING!)
    # =========================================================================
    @property

    def format_id(self) -> str:
        """
        Unique format identifier (e.g., 'SQL', 'GraphQL').
        Used for registry lookup and identification.
        Should be ALL CAPS for consistency.
        """
        ...
    @property

    def syntax_name(self) -> str:
        """
        Syntax name in lowercase (e.g., 'sql', 'graphql').
        Used for user-friendly references and file naming.
        """
        ...
    @property

    def aliases(self) -> list[str]:
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

    def parse_grammar(self, text: str, metadata: Optional[dict[str, Any]] = None) -> AGrammar:
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
        ...

    def validate_grammar(self, text: str) -> list[str]:
        """
        Validate grammar definition.
        Args:
            text: Grammar definition text
        Returns:
            List of validation errors (empty if valid)
        """
        ...

    def get_grammar_format(self) -> GrammarFormat:
        """
        Get the grammar format this handler supports.
        Returns:
            GrammarFormat enum value
        """
        ...

    def convert_to_lark(self, grammar_data: Any) -> str:
        """
        Convert grammar from native format to Lark EBNF.
        This enables cross-format grammar conversion.
        Args:
            grammar_data: Grammar in native format (dict, etc.)
        Returns:
            Grammar in Lark EBNF format
        """
        ...

    def load_grammar(self, file_path: str | Path) -> AGrammar:
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

    def save_grammar(self, grammar: AGrammar, file_path: str | Path) -> None:
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

    def parse(self, text: str, grammar: Optional[AGrammar] = None) -> ParseNode:
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
        ...

    def generate(self, ast: ParseNode, grammar: Optional[AGrammar] = None) -> str:
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

    def deserialize(self, text: str, grammar: Optional[AGrammar] = None) -> ParseNode:
        """
        Alias for parse() - deserialize text to AST.
        Provides consistent terminology with serialization systems.
        """
        return self.parse(text, grammar)

    def serialize(self, ast: ParseNode, grammar: Optional[AGrammar] = None) -> str:
        """
        Alias for generate() - serialize AST to text.
        Provides consistent terminology with serialization systems.
        """
        return self.generate(ast, grammar)

    def unparse(self, ast: ParseNode, grammar: Optional[AGrammar] = None) -> str:
        """
        Alias for generate() - unparse AST to text.
        Common terminology in AST systems.
        """
        return self.generate(ast, grammar)

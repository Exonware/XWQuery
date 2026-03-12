#exonware/xwsyntax/src/exonware/xwsyntax/base.py
"""
Abstract base classes for the syntax module.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.6.0.4
"""

from __future__ import annotations
from abc import ABC, abstractmethod
from typing import Any, Optional, TYPE_CHECKING
from pathlib import Path
from .defs import ParserMode, GrammarFormat
# Import serialization base class from xwsystem
# xwsystem is a core dependency - no try/except per DEV_GUIDELINES.md Line 128
from exonware.xwsystem.io.serialization import ASerialization
# Import interface for ParseNode
# Following DEV_GUIDELINES.md: Abstract classes in base.py extend interfaces from contracts.py
from .contracts import IParseNode
if TYPE_CHECKING:
    from .syntax_tree import ParseNode
# ============================================================================
# PARSE NODE ABSTRACT BASE CLASS - EXTENDS INTERFACE
# ============================================================================


class AParseNode(IParseNode, ABC):
    """
    Abstract base class for parse nodes.
    Following DEV_GUIDELINES.md:
    - Interfaces (I*) in contracts.py use Protocol
    - Abstract classes (A*) in base.py extend interfaces from contracts.py
    - Concrete classes extend abstract classes
    This provides the contract that all parse node implementations must follow.
    Default property implementations allow dataclass subclasses to use field
    names type, value, children, metadata (instance attributes override these).
    """
    @property

    def type(self) -> str:
        """Get node type. Subclasses/dataclass set via instance __dict__."""
        return self.__dict__.get('type', '')
    @type.setter

    def type(self, value: str) -> None:
        self.__dict__['type'] = value
    @property

    def value(self) -> Optional[Any]:
        """Get node value. Subclasses/dataclass set via instance __dict__."""
        return self.__dict__.get('value')
    @value.setter

    def value(self, value: Optional[Any]) -> None:
        self.__dict__['value'] = value
    @property

    def children(self) -> list['ParseNode']:
        """Get child nodes. Subclasses/dataclass set via instance __dict__."""
        return self.__dict__.get('children', [])
    @children.setter

    def children(self, value: list['ParseNode']) -> None:
        self.__dict__['children'] = value
    @property

    def metadata(self) -> dict[str, Any]:
        """Get node metadata. Subclasses/dataclass set via instance __dict__."""
        return self.__dict__.get('metadata', {})
    @metadata.setter

    def metadata(self, value: dict[str, Any]) -> None:
        self.__dict__['metadata'] = value
    @abstractmethod

    def to_dict(self) -> dict[str, Any]:
        """Convert to dictionary representation."""
        ...
    @classmethod
    @abstractmethod

    def from_dict(cls, data: dict[str, Any]) -> 'ParseNode':
        """Create from dictionary representation."""
        ...
    @abstractmethod

    def find_all(self, node_type: str) -> list['ParseNode']:
        """Find all nodes of a given type."""
        ...
    @abstractmethod

    def find_first(self, node_type: str) -> Optional['ParseNode']:
        """Find first node of a given type."""
        ...
# ============================================================================
# GRAMMAR ABSTRACT BASE CLASS
# ============================================================================


class AGrammar(ABC):
    """Abstract base class for grammar definitions."""
    @abstractmethod

    def get_name(self) -> str:
        """Get grammar name."""
        pass
    @abstractmethod

    def get_version(self) -> str:
        """Get grammar version."""
        pass
    @abstractmethod

    def get_format(self) -> GrammarFormat:
        """Get grammar format."""
        pass
    @abstractmethod

    def parse(self, text: str, mode: ParserMode = ParserMode.STRICT) -> ParseNode:
        """
        Parse text to AST.
        Args:
            text: Text to parse
            mode: Parser mode
        Returns:
            ParseNode: Root AST node
        Raises:
            ParseError: If parsing fails
        """
        pass
    @abstractmethod

    def validate(self, text: str) -> list[str]:
        """
        Validate syntax without full parsing.
        Args:
            text: Text to validate
        Returns:
            List of error messages (empty if valid)
        """
        pass

    def describe(self) -> dict[str, Any]:
        """
        Get grammar description.
        Returns:
            Dictionary with grammar metadata
        """
        return {
            'name': self.get_name(),
            'version': self.get_version(),
            'format': self.get_format().name,
        }

    def export_to_monaco(self, case_insensitive: bool = False) -> dict[str, Any]:
        """
        Export grammar to Monaco Monarch format.
        Args:
            case_insensitive: Whether language is case-insensitive
        Returns:
            Dictionary with Monaco language and config definitions
        """
        # Default implementation (can be overridden)
        raise NotImplementedError("Monaco export not implemented for this grammar")


class ASyntaxEngine(ABC):
    """Abstract base class for syntax engines."""
    @abstractmethod

    def load_grammar(self, name: str) -> AGrammar:
        """
        Load grammar by name.
        Args:
            name: Grammar name (e.g., 'sql', 'json')
        Returns:
            Grammar instance
        Raises:
            GrammarNotFoundError: If grammar not found
        """
        pass
    @abstractmethod

    def parse(
        self,
        text: str,
        grammar: str,
        mode: ParserMode = ParserMode.STRICT,
    ) -> ParseNode:
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
        pass
    @abstractmethod

    def validate(self, text: str, grammar: str) -> list[str]:
        """
        Validate text against grammar.
        Args:
            text: Text to validate
            grammar: Grammar name
        Returns:
            List of error messages (empty if valid)
        """
        pass
    @abstractmethod

    def list_grammars(self) -> list[str]:
        """
        List available grammars.
        Returns:
            List of grammar names
        """
        pass
# ============================================================================
# SYNTAX HANDLER BASE CLASS - EXTENDS SERIALIZATION
# ============================================================================


class ASyntaxHandler(ASerialization):
    """
    Abstract base class for syntax handlers that extends ASerialization.
    This class provides default implementations for serialization methods
    and adds grammar-specific functionality. Subclasses must implement
    the grammar-specific abstract methods.
    By extending ASerialization, syntax handlers automatically inherit:
    - dumps() / dumps_text() / dumps_binary()
    - loads() / loads_text() / loads_bytes()
    - save() / load() with file handling
    - validate_input() with security checks
    - is_text_format() / is_binary_format()
    - And all other ISerialization methods
    This enables grammar handlers to work seamlessly with the serialization
    system while adding grammar-specific capabilities.
    Example:
        class LarkGrammarHandler(ASyntaxHandler):
            @property
            def format_name(self) -> str:
                return "Lark"
            @property
            def file_extensions(self) -> list[str]:
                return [".grammar", ".lark"]
            def parse_grammar(self, text: str) -> AGrammar:
                return Grammar(text)
    """

    def __init__(self, **kwargs):
        """Initialize syntax handler with serialization capabilities."""
        # Initialize parent ASerialization
        super().__init__(**kwargs)
    # =========================================================================
    # METADATA PROPERTIES (Required by codec adapter and registry)
    # =========================================================================
    @property
    @abstractmethod

    def syntax_name(self) -> str:
        """
        Syntax name in lowercase (e.g., 'sql', 'graphql').
        Used for user-friendly references and file naming.
        """
        pass
    @property

    def category(self) -> str:
        """
        Format category (e.g., 'query', 'data', 'programming').
        Default implementation returns 'syntax'.
        """
        return "syntax"
    @property

    def mime_types(self) -> list[str]:
        """
        List of MIME types for this format.
        Default implementation returns empty list.
        Subclasses should override to provide specific MIME types.
        """
        return []
    @property

    def aliases(self) -> list[str]:
        """
        Alternative names for this format.
        Default implementation uses format_name if available.
        """
        if hasattr(self, 'format_name'):
            return [self.format_name.lower(), self.syntax_name]
        return [self.syntax_name]
    @property

    def supports_bidirectional(self) -> bool:
        """
        Whether this format supports both parse and generate.
        Default: False (parse-only).
        """
        return False
    @property

    def supports_streaming(self) -> bool:
        """
        Whether this format supports streaming operations.
        Default: False.
        """
        return False
    # =========================================================================
    # GRAMMAR-SPECIFIC ABSTRACT METHODS
    # =========================================================================
    @abstractmethod

    def parse_grammar(self, text: str, metadata: Optional[dict[str, Any]] = None) -> AGrammar:
        """
        Parse grammar text into a Grammar object.
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

    def validate_grammar(self, text: str) -> list[str]:
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
        Args:
            grammar_data: Grammar in native format (dict, etc.)
        Returns:
            Grammar in Lark EBNF format
        """
        pass
    # =========================================================================
    # PARSING AND GENERATION (Required by codec adapter)
    # =========================================================================
    @abstractmethod

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
        """
        pass

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
        """
        if not self.supports_bidirectional:
            raise NotImplementedError(
                f"{self.syntax_name} does not support text generation"
            )
        raise NotImplementedError("generate() must be implemented for bidirectional formats")
    # =========================================================================
    # REQUIRED CODEC/SERIALIZATION INTERFACE (Bridge methods)
    # =========================================================================
    # These bridge ASyntaxHandler to ISerialization/ICodec interface
    # Required because ASyntaxHandler extends ASerialization
    @property

    def codec_id(self) -> str:
        """Bridge syntax_name to codec_id (required by ICodec)."""
        return self.syntax_name
    @property

    def media_types(self) -> list[str]:
        """Bridge to mime_types property (required by ICodec)."""
        # If subclass provides mime_types() method, use it
        # Otherwise return empty list
        return getattr(self, 'mime_types', [])

    def encode(self, value: Any, *, options: Optional[dict[str, Any]] = None) -> bytes | str:
        """
        Encode AST to text (bridges to generate()).
        Args:
            value: ParseNode to encode
            options: Optional encoding options
        Returns:
            Generated text
        Raises:
            TypeError: If value is not an ParseNode
            NotImplementedError: If format doesn't support generation
        """
        from .syntax_tree import ParseNode
        if not isinstance(value, ParseNode):
            raise TypeError(f"Expected ParseNode, got {type(value)}")
        # Bridge to generate method
        grammar = options.get('grammar', None) if options else None
        return self.generate(value, grammar=grammar)

    def decode(self, repr: bytes | str, *, options: Optional[dict[str, Any]] = None) -> Any:
        """
        Decode text to AST (bridges to parse()).
        Args:
            repr: Text to parse
            options: Optional decoding options
        Returns:
            Parsed ParseNode
        Raises:
            ParseError: If parsing fails
        """
        # Convert bytes to str if needed
        if isinstance(repr, bytes):
            repr = repr.decode('utf-8')
        # Bridge to parse method
        grammar = options.get('grammar', None) if options else None
        return self.parse(repr, grammar=grammar)
    # =========================================================================
    # CONCRETE METHODS - COMBINING SERIALIZATION + GRAMMAR
    # =========================================================================

    def load_grammar(self, file_path: str | Path) -> AGrammar:
        """
        Load grammar from file.
        This combines load() from ASerialization with parse_grammar().
        Args:
            file_path: Path to grammar file
        Returns:
            Grammar object
        """
        # Use inherited load() method from ASerialization
        data = self.load(file_path)
        # If data is text, parse directly
        if isinstance(data, str):
            return self.parse_grammar(data)
        # If data is structured (dict), convert to Lark first
        elif isinstance(data, dict):
            lark_text = self.convert_to_lark(data)
            return self.parse_grammar(lark_text, metadata={'source_data': data})
        else:
            from .errors import GrammarError
            raise GrammarError(f"Unsupported grammar data type: {type(data)}")

    def save_grammar(self, grammar: AGrammar, file_path: str | Path) -> None:
        """
        Save grammar to file.
        Args:
            grammar: Grammar object to save
            file_path: Path to save to
        """
        # Export grammar as text
        grammar_text = str(grammar)  # Could be more sophisticated
        # Use inherited save() method from ASerialization
        self.save(grammar_text, file_path)

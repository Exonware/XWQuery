"""
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.6.0.2
Generation Date: November 4, 2025
Codec Adapter - Bridge between xwsyntax handlers and ICodec interface.
This adapter allows xwsyntax handlers to work seamlessly with UniversalCodecRegistry
without breaking their existing API.
"""
from typing import Any, Optional
from pathlib import Path
from exonware.xwsystem.io.codec.contracts import ICodec, ICodecMetadata
from exonware.xwsystem.io.contracts import EncodeOptions, DecodeOptions
from exonware.xwsystem.io.defs import CodecCapability
from .base import ASyntaxHandler
from .syntax_tree import ParseNode
class SyntaxHandlerCodecAdapter(ICodec, ICodecMetadata):
    """
    Adapter that makes ASyntaxHandler compatible with ICodec interface.
    This allows xwsyntax handlers to be registered with UniversalCodecRegistry
    while maintaining their existing parse/generate API.
    Bridge Pattern:
    - ASyntaxHandler.parse() â†’ ICodec.decode()
    - ASyntaxHandler.generate() â†’ ICodec.encode()
    - ASyntaxHandler metadata â†’ ICodecMetadata properties
    Examples:
        >>> handler = SQLGrammarHandler()
        >>> adapter = SyntaxHandlerCodecAdapter(handler)
        >>> 
        >>> # Works as ICodec
        >>> ast = adapter.decode("SELECT * FROM users")
        >>> sql = adapter.encode(ast)
        >>> 
        >>> # Still works as handler
        >>> ast = handler.parse("SELECT * FROM users")
        >>> sql = handler.generate(ast)
    """
    def __init__(self, handler: ASyntaxHandler):
        """
        Initialize adapter with syntax handler.
        Args:
            handler: ASyntaxHandler instance to adapt
        """
        self._handler = handler
    # ========================================================================
    # ICodec INTERFACE (Bridge to parse/generate)
    # ========================================================================
    def encode(self, value: ParseNode, *, options: Optional[EncodeOptions] = None) -> str:
        """
        Encode AST to text (bridges to handler.generate()).
        Args:
            value: AST node to encode
            options: Optional encoding options (passed to generate)
        Returns:
            Generated text (SQL, GraphQL, etc.)
        Raises:
            TypeError: If value is not an ParseNode
        """
        if not isinstance(value, ParseNode):
            raise TypeError(f"Expected ParseNode, got {type(value)}")
        # Bridge to handler's generate method
        opts = options or {}
        grammar = opts.get('grammar', None)
        return self._handler.generate(value, grammar=grammar)
    def decode(self, repr: bytes | str, *, options: Optional[DecodeOptions] = None) -> ParseNode:
        """
        Decode text to AST (bridges to handler.parse()).
        Args:
            repr: Text to parse (SQL, GraphQL, etc.)
            options: Optional decoding options (passed to parse)
        Returns:
            Parsed AST node
        Raises:
            ValueError: If parsing fails
        """
        # Convert bytes to str if needed
        if isinstance(repr, bytes):
            repr = repr.decode('utf-8')
        # Bridge to handler's parse method
        opts = options or {}
        grammar = opts.get('grammar', None)
        return self._handler.parse(repr, grammar=grammar)
    # ========================================================================
    # ICodecMetadata INTERFACE (Bridge to handler metadata)
    # ========================================================================
    @property
    def codec_id(self) -> str:
        """Bridge to handler.syntax_name."""
        return self._handler.syntax_name
    @property
    def media_types(self) -> list[str]:
        """Bridge to handler.mime_types."""
        return self._handler.mime_types
    @property
    def file_extensions(self) -> list[str]:
        """Bridge to handler.file_extensions."""
        return self._handler.file_extensions
    @property
    def aliases(self) -> list[str]:
        """Bridge to handler.aliases."""
        return self._handler.aliases
    @property
    def codec_types(self) -> list[str]:
        """
        Determine codec types from handler category.
        Mapping:
        - "query" â†’ ["query", "syntax"]
        - "data" â†’ ["data", "syntax"]
        - default â†’ ["syntax"]
        """
        category = self._handler.category
        # Map handler category to codec types
        if category == "query":
            return ["query", "syntax"]
        elif category == "data":
            return ["data", "syntax", "serialization"]
        else:
            return ["syntax"]
    def capabilities(self) -> CodecCapability:
        """
        Determine capabilities from handler.
        Returns:
            Codec capabilities based on handler support
        """
        caps = CodecCapability.NONE
        # All syntax handlers support text
        caps |= CodecCapability.TEXT
        # Check if bidirectional
        if self._handler.supports_bidirectional:
            caps |= CodecCapability.BIDIRECTIONAL
        else:
            # Default to decode only if not bidirectional
            caps |= CodecCapability.DECODE
        # Check if supports streaming
        if self._handler.supports_streaming:
            caps |= CodecCapability.STREAMING
        return caps
    # ========================================================================
    # CONVENIENCE METHODS
    # ========================================================================
    @property
    def handler(self) -> ASyntaxHandler:
        """Get the wrapped handler."""
        return self._handler
    def __repr__(self) -> str:
        """String representation."""
        return f"SyntaxHandlerCodecAdapter({self._handler.format_name})"
# ============================================================================
# FACTORY FUNCTIONS
# ============================================================================
def create_codec_from_handler(handler: ASyntaxHandler) -> SyntaxHandlerCodecAdapter:
    """
    Create ICodec adapter from syntax handler.
    Args:
        handler: Syntax handler instance
    Returns:
        Codec adapter that implements ICodec
    Examples:
        >>> handler = SQLGrammarHandler()
        >>> codec = create_codec_from_handler(handler)
        >>> registry.register(codec.__class__, codec)
    """
    return SyntaxHandlerCodecAdapter(handler)
def register_handler_as_codec(handler: ASyntaxHandler, registry=None):
    """
    Register syntax handler with UniversalCodecRegistry.
    Args:
        handler: Syntax handler to register
        registry: Optional registry (uses global if None)
    Examples:
        >>> handler = SQLGrammarHandler()
        >>> register_handler_as_codec(handler)
        >>> # Now available via registry
        >>> codec = registry.get_by_id("sql")
    """
    from exonware.xwsystem.io.codec.registry import get_registry
    if registry is None:
        registry = get_registry()
    # Create adapter
    adapter = SyntaxHandlerCodecAdapter(handler)
    # Register with registry
    # Note: We create a unique class for each handler to avoid conflicts
    adapter_class = type(
        f"{handler.format_name}CodecAdapter",
        (SyntaxHandlerCodecAdapter,),
        {'__init__': lambda self: SyntaxHandlerCodecAdapter.__init__(self, handler)}
    )
    registry.register(adapter_class, adapter)
    return adapter
# ============================================================================
# AUTO-REGISTRATION
# ============================================================================
def auto_register_all_handlers(registry=None):
    """
    Auto-register all xwsyntax handlers with UniversalCodecRegistry.
    Discovers and registers all formats from *.grammar.info.json files
    using the generic XWSyntaxHandler.
    Args:
        registry: Optional registry (uses global if None)
    Returns:
        Number of handlers registered
    Examples:
        >>> count = auto_register_all_handlers()
        >>> print(f"Registered {count} syntax handlers")
    """
    from pathlib import Path
    from .handlers import XWSyntaxHandler
    # Find grammar directory
    grammar_dir = Path(__file__).parent / 'grammars'
    if not grammar_dir.exists():
        return 0
    # Auto-discover all formats from *.grammar.info.json files
    info_files = list(grammar_dir.glob("*.grammar.info.json"))
    registered_count = 0
    # Register each format using generic handler
    for info_file in info_files:
        # Extract format name (e.g., "json" from "json.grammar.info.json")
        format_name = info_file.stem.replace('.grammar.info', '')
        # Create handler instance
        handler = XWSyntaxHandler(format_name, grammar_dir)
        # Register with codec registry
        register_handler_as_codec(handler, registry)
        registered_count += 1
    return registered_count

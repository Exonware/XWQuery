"""
Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.1
Generation Date: November 4, 2025

Codec Adapter - Bridge between xwsyntax handlers and ICodec interface.

This adapter allows xwsyntax handlers to work seamlessly with UniversalCodecRegistry
without breaking their existing API.
"""

from typing import Any, Optional, Union, List
from pathlib import Path

from exonware.xwsystem.io.codec.contracts import ICodec, ICodecMetadata
from exonware.xwsystem.io.contracts import EncodeOptions, DecodeOptions
from exonware.xwsystem.io.defs import CodecCapability

from .base import ASyntaxHandler
from .syntax_tree import ASTNode


class SyntaxHandlerCodecAdapter(ICodec, ICodecMetadata):
    """
    Adapter that makes ASyntaxHandler compatible with ICodec interface.
    
    This allows xwsyntax handlers to be registered with UniversalCodecRegistry
    while maintaining their existing parse/generate API.
    
    Bridge Pattern:
    - ASyntaxHandler.parse() → ICodec.decode()
    - ASyntaxHandler.generate() → ICodec.encode()
    - ASyntaxHandler metadata → ICodecMetadata properties
    
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
    
    def encode(self, value: ASTNode, *, options: Optional[EncodeOptions] = None) -> str:
        """
        Encode AST to text (bridges to handler.generate()).
        
        Args:
            value: AST node to encode
            options: Optional encoding options (passed to generate)
        
        Returns:
            Generated text (SQL, GraphQL, etc.)
        
        Raises:
            TypeError: If value is not an ASTNode
        """
        if not isinstance(value, ASTNode):
            raise TypeError(f"Expected ASTNode, got {type(value)}")
        
        # Bridge to handler's generate method
        opts = options or {}
        grammar = opts.get('grammar', None)
        
        return self._handler.generate(value, grammar=grammar)
    
    def decode(self, repr: Union[bytes, str], *, options: Optional[DecodeOptions] = None) -> ASTNode:
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
        - "query" → ["query", "syntax"]
        - "data" → ["data", "syntax"]
        - default → ["syntax"]
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
    
    Discovers and registers:
    - JSON handler
    - SQL handler
    - GraphQL handler
    - (Any future handlers)
    
    Args:
        registry: Optional registry (uses global if None)
    
    Returns:
        Number of handlers registered
    
    Examples:
        >>> count = auto_register_all_handlers()
        >>> print(f"Registered {count} syntax handlers")
    """
    from .handlers.json_handler import JSONGrammarHandler
    from .handlers.sql import SQLGrammarHandler
    from .handlers.graphql import GraphQLGrammarHandler
    
    handlers = [
        JSONGrammarHandler(),
        SQLGrammarHandler(),
        GraphQLGrammarHandler(),
    ]
    
    # Register all handlers - no try/except per DEV_GUIDELINES.md Line 128
    # If registration fails, it should fail-fast to reveal the root cause
    for handler in handlers:
        register_handler_as_codec(handler, registry)
    
    return len(handlers)


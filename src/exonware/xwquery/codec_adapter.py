"""
Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.7
Generation Date: November 4, 2025

Codec Adapter - Bridge between xwquery parsers and ICodec interface.

This adapter allows xwquery parsers to work seamlessly with UniversalCodecRegistry
without breaking their existing API.
"""

from typing import Any, Optional, Union, List
from pathlib import Path

from exonware.xwsystem.io.codec.contracts import ICodec, ICodecMetadata
from exonware.xwsystem.io.contracts import EncodeOptions, DecodeOptions
from exonware.xwsystem.io.defs import CodecCapability

from .query.parsers.base_parser import ABaseParser
from .contracts import QueryAction


class QueryParserCodecAdapter(ICodec, ICodecMetadata):
    """
    Adapter that makes xwquery parsers compatible with ICodec interface.
    
    This allows query parsers to be registered with UniversalCodecRegistry
    while maintaining their existing parse API.
    
    Bridge Pattern:
    - Parser.parse(query) → ICodec.decode(repr)
    - Generator.generate(actions) → ICodec.encode(value)
    - Parser metadata → ICodecMetadata properties
    
    Examples:
        >>> parser = SQLParser()
        >>> adapter = QueryParserCodecAdapter(parser, "sql")
        >>> 
        >>> # Works as ICodec
        >>> actions = adapter.decode("SELECT * FROM users")
        >>> sql = adapter.encode(actions)
        >>> 
        >>> # Still works as parser
        >>> actions = parser.parse("SELECT * FROM users")
    """
    
    def __init__(
        self,
        parser: ABaseParser,
        codec_id: str,
        file_extensions: List[str],
        media_types: List[str],
        aliases: Optional[List[str]] = None,
        generator = None
    ):
        """
        Initialize adapter with query parser.
        
        Args:
            parser: ABaseParser instance to adapt
            codec_id: Codec identifier (e.g., 'sql', 'xpath', 'graphql')
            file_extensions: List of file extensions (e.g., ['.sql', '.ddl'])
            media_types: List of MIME types
            aliases: Optional list of aliases
            generator: Optional generator for encode() (if None, encode raises NotImplementedError)
        """
        self._parser = parser
        self._codec_id = codec_id
        self._file_extensions = file_extensions
        self._media_types = media_types
        self._aliases = aliases or [codec_id.lower(), codec_id.upper()]
        self._generator = generator
    
    # ========================================================================
    # ICodec INTERFACE (Bridge to parse/generate)
    # ========================================================================
    
    def encode(self, value: List[QueryAction], *, options: Optional[EncodeOptions] = None) -> str:
        """
        Encode QueryAction list to text (bridges to generator).
        
        Args:
            value: List of QueryAction objects
            options: Optional encoding options
        
        Returns:
            Generated query text (SQL, XPath, etc.)
        
        Raises:
            NotImplementedError: If generator not provided
            TypeError: If value is not a list of QueryAction
        """
        if self._generator is None:
            raise NotImplementedError(
                f"Encode not supported for {self._codec_id} (no generator provided). "
                f"This parser only supports decode (parse)."
            )
        
        if not isinstance(value, list):
            raise TypeError(f"Expected list of QueryAction, got {type(value)}")
        
        # Bridge to generator
        opts = options or {}
        return self._generator.generate(value, **opts)
    
    def decode(self, repr: Union[bytes, str], *, options: Optional[DecodeOptions] = None) -> List[QueryAction]:
        """
        Decode text to QueryAction list (bridges to parser.parse()).
        
        Args:
            repr: Query text to parse (SQL, XPath, etc.)
            options: Optional decoding options (passed to parse)
        
        Returns:
            List of QueryAction objects
        
        Raises:
            XWQueryParseError: If parsing fails
        """
        # Convert bytes to str if needed
        if isinstance(repr, bytes):
            repr = repr.decode('utf-8')
        
        # Bridge to parser's parse method
        opts = options or {}
        return self._parser.parse(repr, **opts)
    
    # ========================================================================
    # ICodecMetadata INTERFACE
    # ========================================================================
    
    @property
    def codec_id(self) -> str:
        """Codec identifier."""
        return self._codec_id
    
    @property
    def media_types(self) -> list[str]:
        """Supported MIME types."""
        return self._media_types
    
    @property
    def file_extensions(self) -> list[str]:
        """Supported file extensions."""
        return self._file_extensions
    
    @property
    def aliases(self) -> list[str]:
        """Alternative names."""
        return self._aliases
    
    @property
    def codec_types(self) -> list[str]:
        """
        Query parsers are query and syntax types.
        
        All query parsers belong to both categories:
        - "query": They parse query languages
        - "syntax": They handle syntax/grammar
        """
        return ["query", "syntax"]
    
    def capabilities(self) -> CodecCapability:
        """
        Determine capabilities from parser and generator.
        
        Returns:
            Codec capabilities
        """
        caps = CodecCapability.TEXT | CodecCapability.DECODE
        
        # Add encode if generator available
        if self._generator is not None:
            caps |= CodecCapability.ENCODE
            caps |= CodecCapability.BIDIRECTIONAL
        
        return caps
    
    # ========================================================================
    # CONVENIENCE METHODS
    # ========================================================================
    
    @property
    def parser(self) -> ABaseParser:
        """Get the wrapped parser."""
        return self._parser
    
    @property
    def generator(self):
        """Get the wrapped generator."""
        return self._generator
    
    def __repr__(self) -> str:
        """String representation."""
        return f"QueryParserCodecAdapter({self._codec_id})"


# ============================================================================
# FACTORY FUNCTIONS
# ============================================================================

def create_sql_codec():
    """Create SQL parser codec adapter."""
    from .query.parsers.sql_parser import SQLParser
    from .query.generators.sql_generator import SQLGenerator
    
    parser = SQLParser()
    generator = SQLGenerator()
    
    return QueryParserCodecAdapter(
        parser=parser,
        codec_id="sql",
        file_extensions=[".sql", ".ddl", ".dml", ".dql"],
        media_types=["application/sql", "text/x-sql", "application/x-sql"],
        aliases=["sql", "SQL", "tsql", "plsql", "mysql", "postgresql"],
        generator=generator
    )


def create_xpath_codec():
    """Create XPath parser codec adapter."""
    from .query.parsers.xpath_parser import XPathParser
    from .query.generators.xpath_generator import XPathGenerator
    
    parser = XPathParser()
    generator = XPathGenerator()
    
    return QueryParserCodecAdapter(
        parser=parser,
        codec_id="xpath",
        file_extensions=[".xpath"],
        media_types=["application/xpath"],
        aliases=["xpath", "XPath", "XPATH"],
        generator=generator
    )


# ============================================================================
# TODO: Future Parser Codecs (Not Yet Implemented)
# ============================================================================
# 
# Per DEV_GUIDELINES.md: Don't use try/except to hide missing functionality
# These parsers don't exist yet - removed try/except wrappers
#
# def create_graphql_codec():
#     """Create GraphQL parser codec adapter (parse-only)."""
#     from .query.parsers.graphql_parser import GraphQLParser
#     parser = GraphQLParser()
#     return QueryParserCodecAdapter(
#         parser=parser,
#         codec_id="graphql",
#         file_extensions=[".graphql", ".gql"],
#         media_types=["application/graphql"],
#         aliases=["graphql", "gql", "GraphQL"],
#         generator=None
#     )
#
# def create_cypher_codec():
#     """Create Cypher parser codec adapter (parse-only)."""
#     from .query.parsers.cypher_parser import CypherParser
#     parser = CypherParser()
#     return QueryParserCodecAdapter(
#         parser=parser,
#         codec_id="cypher",
#         file_extensions=[".cypher", ".cyp"],
#         media_types=["application/x-cypher-query"],
#         aliases=["cypher", "Cypher", "neo4j"],
#         generator=None
#     )
#
# def create_sparql_codec():
#     """Create SPARQL parser codec adapter (parse-only)."""
#     from .query.parsers.sparql_parser import SPARQLParser
#     parser = SPARQLParser()
#     return QueryParserCodecAdapter(
#         parser=parser,
#         codec_id="sparql",
#         file_extensions=[".sparql", ".rq"],
#         media_types=["application/sparql-query"],
#         aliases=["sparql", "SPARQL"],
#         generator=None
#     )


# ============================================================================
# AUTO-REGISTRATION
# ============================================================================

def auto_register_all_parsers(registry=None):
    """
    Auto-register all xwquery parsers with UniversalCodecRegistry.
    
    Registers:
    - SQL parser (with generator) ✅
    - XPath parser (with generator) ✅
    
    TODO: Add when parsers are implemented:
    - GraphQL parser (parse-only)
    - Cypher parser (parse-only)
    - SPARQL parser (parse-only)
    
    Args:
        registry: Optional registry (uses global if None)
    
    Returns:
        Number of parsers registered
    
    Examples:
        >>> count = auto_register_all_parsers()
        >>> print(f"Registered {count} query parsers")
    """
    from exonware.xwsystem.io.codec.registry import get_registry
    
    if registry is None:
        registry = get_registry()
    
    # Only register implemented parsers (per DEV_GUIDELINES.md - no try/except to hide missing)
    factories = [
        create_sql_codec,
        create_xpath_codec,
        # create_graphql_codec,  # TODO: Implement GraphQL parser
        # create_cypher_codec,   # TODO: Implement Cypher parser
        # create_sparql_codec,   # TODO: Implement SPARQL parser
    ]
    
    registered_count = 0
    for factory in factories:
        codec = factory()
        
        # Create unique adapter class
        adapter_class = type(
            f"{codec.codec_id.upper()}ParserCodecAdapter",
            (QueryParserCodecAdapter,),
            {'__init__': lambda self, c=codec: QueryParserCodecAdapter.__init__(
                self,
                c._parser,
                c._codec_id,
                c._file_extensions,
                c._media_types,
                c._aliases,
                c._generator
            )}
        )
        
        registry.register(adapter_class, codec)
        registered_count += 1
    
    return registered_count


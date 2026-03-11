#exonware/xwsyntax/src/exonware/xwsyntax/__init__.py
"""
xwsyntax - Universal Grammar Engine (REF_01_REQ, REF_14_DX, REF_15_API)
A comprehensive grammar engine providing parsing and generation for 100+ grammar
formats (328+ grammar-related files). Bidirectional grammars (parse + generate) for
universal format conversion; used by xwquery and IDE/tooling. REF_22_PROJECT.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.6.0.1
Features:
- 31 grammar formats (queries, data, programming languages, specialized)
- Bidirectional processing (text → AST → text)
- Automatic performance optimization based on AST size
- Binary format support (BSON, MessagePack, CBOR, Protobuf, Avro)
- IDE integration (LSP server, Monaco editor, tree-sitter)
- xwnode-powered indexing (Trie, IntervalTree, LRU cache)
Usage:
    # Recommended: Use the facade
    from exonware.xwsyntax import XWSyntax
    syntax = XWSyntax()
    ast = syntax.parse('{"name": "Alice"}', 'json')
    # Or use convenience functions
    from exonware.xwsyntax import parse
    ast = parse('SELECT * FROM users', 'sql')
    # For bidirectional operations
    from exonware.xwsyntax import BidirectionalGrammar
    grammar = BidirectionalGrammar.load('json')
    ast = grammar.parse('{"name": "Alice"}')
    output = grammar.generate(ast)
"""
# =============================================================================
# XWLAZY INTEGRATION - Auto-install missing dependencies silently (EARLY)
# =============================================================================
# Activate xwlazy BEFORE other imports to enable auto-installation of missing dependencies
# This enables silent auto-installation of missing libraries when they are imported

try:
    from exonware.xwlazy import auto_enable_lazy
    auto_enable_lazy(__package__ or "exonware.xwsyntax", mode="smart")
except ImportError:
    # xwlazy not installed - lazy mode simply stays disabled (normal behavior)
    pass
from .facade import (
    XWSyntax,
    XWSyntaxFactory,
    parse,
    validate,
    load_grammar as load_grammar_quick,
    list_grammars as list_grammars_quick,
)
from .base import AGrammar, ASyntaxEngine, ASyntaxHandler
from .contracts import ISyntaxHandler, ISyntaxEngine
from .syntax_tree import ParseNode, ParseVisitor, ParsePrinter, create_immutable_ast
from .engines import XWSyntaxEngine, LarkSyntaxEngine, Grammar, LarkGrammar
from .errors import (
    SyntaxError,
    GrammarError,
    GrammarNotFoundError,
    ParseError,
    ValidationError,
    MaxDepthError,
)
from .monaco_exporter import (
    MonacoExporter,
    MonarchLanguage,
    MonarchLanguageConfig,
    export_grammar_to_monaco,
)
from .grammar_loader import MultiFormatGrammarLoader, get_grammar_loader
from .grammar_metadata import GrammarMetadata, get_grammar_metadata
from .output_grammar import OutputGrammar, OutputGrammarRegistry, get_default_registry
from .unparser import GrammarUnparser
from .bidirectional import BidirectionalGrammar, BidirectionalGrammarRegistry, get_bidirectional_registry
__all__ = [
    # Facade (Main Public API)
    'XWSyntax',
    'XWSyntaxFactory',
    'parse',
    'validate',
    'load_grammar_quick',
    'list_grammars_quick',
    # Base classes
    'AGrammar',
    'ASyntaxEngine',
    'ASyntaxHandler',
    # Interfaces
    'ISyntaxHandler',
    # Core classes
    'XWSyntaxEngine',
    'LarkSyntaxEngine',
    'Grammar',
    'LarkGrammar',
    # Interfaces
    'ISyntaxEngine',
    # Loaders
    'MultiFormatGrammarLoader',
    'get_grammar_loader',
    # Metadata
    'GrammarMetadata',
    'get_grammar_metadata',
    # Parse Tree
    'ParseNode',
    'ParseVisitor',
    'ParsePrinter',
    'create_immutable_ast',
    # Bidirectional Grammars (NEW)
    'OutputGrammar',
    'OutputGrammarRegistry',
    'get_default_registry',
    'GrammarUnparser',
    'BidirectionalGrammar',
    'BidirectionalGrammarRegistry',
    'get_bidirectional_registry',
    # Monaco
    'MonacoExporter',
    'MonarchLanguage',
    'MonarchLanguageConfig',
    'export_grammar_to_monaco',
    # Errors
    'SyntaxError',
    'GrammarError',
    'GrammarNotFoundError',
    'ParseError',
    'ValidationError',
    'MaxDepthError',
]
# ============================================================================
# AUTO-REGISTRATION WITH UNIVERSALCODECREGISTRY
# ============================================================================


def _auto_register_codecs():
    """
    Auto-register all xwsyntax handlers with UniversalCodecRegistry on import.
    Registers:
    - JSON handler → codec_types: ["data", "syntax", "serialization"]
    - SQL handler → codec_types: ["query", "syntax"]
    - GraphQL handler → codec_types: ["query", "syntax"]
    Note: codec_adapter depends on xwsystem which is a core dependency.
    No try/except per DEV_GUIDELINES.md Line 128.
    """
    from .codec_adapter import auto_register_all_handlers
    count = auto_register_all_handlers()
    # Uncomment for debugging:
    # print(f"xwsyntax: Auto-registered {count} syntax handlers as codecs")
# Run auto-registration
_auto_register_codecs()

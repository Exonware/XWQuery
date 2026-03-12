#exonware/xwsyntax/src/exonware/xwsyntax/handlers/generic.py
"""
Generic Syntax Handler
This module provides a generic syntax handler that loads metadata
from *.grammar.info.json files instead of hardcoding it in Python classes.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.6.0.3
"""
import json
from pathlib import Path
from typing import Any, Optional
from ..base import ASyntaxHandler, AGrammar
from ..syntax_tree import ParseNode
from ..defs import GrammarFormat
from ..errors import GrammarError, GrammarNotFoundError
from ..engines import LarkSyntaxEngine
class XWSyntaxHandler(ASyntaxHandler):
    """
    Generic syntax handler that loads metadata from *.grammar.info.json files.
    This handler dynamically loads format metadata instead of hardcoding it
    in Python classes. Metadata is stored in *.grammar.info.json files.
    Usage:
        handler = XWSyntaxHandler("json")
        ast = handler.parse('{"name": "Alice"}')
    """
    def __init__(self, format_name: str, grammar_dir: Optional[str | Path] = None):
        """
        Initialize generic syntax handler.
        Args:
            format_name: Format name (e.g., 'json', 'sql', 'python')
            grammar_dir: Directory containing grammar files (None = default)
        """
        super().__init__()
        self._format_name = format_name.lower()
        self._grammar_dir = self._resolve_grammar_dir(grammar_dir)
        self._metadata: Optional[dict[str, Any]] = None
        self._engine: Optional[LarkSyntaxEngine] = None
    def _resolve_grammar_dir(self, grammar_dir: Optional[str | Path]) -> Path:
        """Resolve grammar directory path."""
        if grammar_dir is None:
            # Default: look for grammars in parent directory
            return Path(__file__).parent.parent / 'grammars'
        return Path(grammar_dir)
    def _load_metadata(self) -> dict[str, Any]:
        """
        Load metadata from *.grammar.info.json file.
        Returns:
            Dictionary with format metadata
        Raises:
            GrammarNotFoundError: If info.json file not found
        """
        if self._metadata is not None:
            return self._metadata
        info_file = self._grammar_dir / f"{self._format_name}.grammar.info.json"
        if not info_file.exists():
            raise GrammarNotFoundError(
                f"Grammar info file not found: {info_file} "
                f"(format: {self._format_name})"
            )
        try:
            with open(info_file, 'r', encoding='utf-8') as f:
                self._metadata = json.load(f)
        except Exception as e:
            raise GrammarError(f"Failed to load grammar info from {info_file}: {e}")
        return self._metadata
    def _get_engine(self) -> LarkSyntaxEngine:
        """Get or create syntax engine."""
        if self._engine is None:
            self._engine = LarkSyntaxEngine(grammar_dir=self._grammar_dir)
        return self._engine
    # =========================================================================
    # METADATA PROPERTIES (loaded from info.json)
    # =========================================================================
    @property
    def format_id(self) -> str:
        """Format ID (e.g., 'JSON', 'SQL')."""
        metadata = self._load_metadata()
        return metadata.get('format_id', self._format_name.upper())
    @property
    def syntax_name(self) -> str:
        """Syntax name in lowercase (e.g., 'json', 'sql')."""
        metadata = self._load_metadata()
        return metadata.get('syntax_name', self._format_name)
    @property
    def format_name(self) -> str:
        """Format name for ISerialization compatibility."""
        metadata = self._load_metadata()
        return metadata.get('format_name', self.format_id)
    @property
    def file_extensions(self) -> list[str]:
        """Supported file extensions."""
        metadata = self._load_metadata()
        return metadata.get('file_extensions', [f'.{self._format_name}'])
    @property
    def mime_type(self) -> str:
        """Primary MIME type."""
        metadata = self._load_metadata()
        return metadata.get('primary_mime_type', f'application/{self._format_name}')
    @property
    def mime_types(self) -> list[str]:
        """All MIME types."""
        metadata = self._load_metadata()
        return metadata.get('mime_types', [self.mime_type])
    @property
    def aliases(self) -> list[str]:
        """Alternative names."""
        metadata = self._load_metadata()
        aliases = metadata.get('aliases', [self.format_id, self._format_name])
        # Ensure format_id and syntax_name are included
        if self.format_id not in aliases:
            aliases.append(self.format_id)
        if self._format_name not in aliases:
            aliases.append(self._format_name)
        return aliases
    @property
    def category(self) -> str:
        """Format category."""
        metadata = self._load_metadata()
        return metadata.get('category', 'data')
    @property
    def supports_bidirectional(self) -> bool:
        """Whether format supports both parse and generate."""
        metadata = self._load_metadata()
        return metadata.get('supports_bidirectional', True)
    @property
    def is_binary_format(self) -> bool:
        """Whether format is binary."""
        metadata = self._load_metadata()
        return metadata.get('is_binary_format', False)
    @property
    def supports_streaming(self) -> bool:
        """Whether format supports streaming."""
        metadata = self._load_metadata()
        return metadata.get('supports_streaming', False)
    # =========================================================================
    # GRAMMAR OPERATIONS
    # =========================================================================
    def parse_grammar(self, text: str, metadata: Optional[dict[str, Any]] = None) -> AGrammar:
        """
        Parse grammar text into a Grammar object.
        Args:
            text: Grammar definition text
            metadata: Optional metadata about the grammar
        Returns:
            Grammar object ready for use
        """
        from ..engines import Grammar
        info_metadata = self._load_metadata()
        # Merge provided metadata with info.json metadata
        if metadata:
            merged_metadata = {**info_metadata, **metadata}
        else:
            merged_metadata = info_metadata
        return Grammar(
            name=merged_metadata.get('name', self.syntax_name),
            grammar_text=text,
            version=merged_metadata.get('version', '1.0.0'),
            start_rule=merged_metadata.get('start_rule', 'start')
        )
    def validate_grammar(self, text: str) -> list[str]:
        """
        Validate grammar definition.
        Args:
            text: Grammar definition text
        Returns:
            List of validation errors (empty if valid)
        """
        errors = []
        if not text or not text.strip():
            errors.append("Grammar cannot be empty")
        return errors
    def get_grammar_format(self) -> GrammarFormat:
        """Get the grammar format this handler supports."""
        return GrammarFormat.LARK
    def convert_to_lark(self, grammar_data: Any) -> str:
        """
        Convert grammar from native format to Lark EBNF.
        Args:
            grammar_data: Grammar in native format (dict, etc.)
        Returns:
            Grammar in Lark EBNF format
        """
        if isinstance(grammar_data, str):
            return grammar_data
        return str(grammar_data)
    # =========================================================================
    # PARSING AND GENERATION
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
        """
        if grammar is None:
            engine = self._get_engine()
            grammar = engine.load_grammar(self._format_name)
        return grammar.parse(text)
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
                f"{self.format_id} does not support text generation"
            )
        from ..bidirectional import BidirectionalGrammar
        bidirectional = BidirectionalGrammar.load(self._format_name, str(self._grammar_dir))
        return bidirectional.generate(ast)

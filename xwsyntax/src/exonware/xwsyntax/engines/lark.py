#exonware/xwsyntax/src/exonware/xwsyntax/engines/lark.py
"""
Lark Syntax Engine with Full Indenter Support
This engine provides complete Lark functionality including Indenter postlexer
for languages like Python that require INDENT/DEDENT token handling.
"""
from pathlib import Path
from typing import Any, Optional
from ..base import AGrammar, ASyntaxEngine
from ..syntax_tree import ParseNode
from ..parser_cache import ParserCache
from ..defs import ParserMode, GrammarFormat, MAX_PARSE_DEPTH
from ..errors import GrammarNotFoundError, ParseError, GrammarError, MaxDepthError
from ..monaco_exporter import export_grammar_to_monaco
from ..grammar_loader import get_grammar_loader
# Import Lark - required dependency per pyproject.toml
# No try/except per DEV_GUIDELINES.md Line 128
from lark import Lark, Tree, Token
from lark.exceptions import LarkError, ParseError as LarkParseError, UnexpectedCharacters
from lark.indenter import Indenter
class PythonIndenter(Indenter):
    """Indenter for Python-like languages that use INDENT/DEDENT."""
    NL_type = '_NEWLINE'
    OPEN_PAREN_types = []
    CLOSE_PAREN_types = []
    INDENT_type = '_INDENT'
    DEDENT_type = '_DEDENT'
    tab_len = 8
class LarkGrammar(AGrammar):
    """
    Grammar implementation using full Lark parser with Indenter support.
    This grammar class supports languages like Python that require
    INDENT/DEDENT token handling via Lark's Indenter postlexer.
    """
    def __init__(
        self,
        name: str,
        grammar_text: str,
        version: str = "1.0.0",
        start_rule: str = "start",
        use_indenter: bool = False,
    ):
        """
        Initialize grammar with optional Indenter support.
        Args:
            name: Grammar name
            grammar_text: Grammar definition in Lark format
            version: Grammar version
            start_rule: Start rule name
            use_indenter: Whether to use PythonIndenter for INDENT/DEDENT
        """
        self._name = name
        self._version = version
        self._start_rule = start_rule
        self._grammar_text = grammar_text
        self._use_indenter = use_indenter
        try:
            parser_kwargs = {
                'grammar': grammar_text,
                'start': start_rule,
                'parser': 'lalr',
                'maybe_placeholders': False,
            }
            # Add Indenter postlexer if needed
            if use_indenter:
                parser_kwargs['postlex'] = PythonIndenter()
            self._parser = Lark(**parser_kwargs)
        except LarkError as e:
            raise GrammarError(f"Invalid grammar '{name}': {e}")
    def get_name(self) -> str:
        """Get grammar name."""
        return self._name
    def get_version(self) -> str:
        """Get grammar version."""
        return self._version
    def get_format(self) -> GrammarFormat:
        """Get grammar format."""
        return GrammarFormat.LARK
    def parse(self, text: str, mode: ParserMode = ParserMode.STRICT) -> ParseNode:
        """
        Parse text to AST.
        Args:
            text: Text to parse
            mode: Parser mode (currently only STRICT supported)
        Returns:
            ParseNode: Root AST node
        Raises:
            ParseError: If parsing fails
        """
        try:
            tree = self._parser.parse(text)
            return self._tree_to_ast(tree)
        except (LarkParseError, UnexpectedCharacters) as e:
            raise ParseError(
                message=str(e),
                text=text,
                line=getattr(e, 'line', None),
                column=getattr(e, 'column', None),
            )
        except (RecursionError, MaxDepthError):
            raise ParseError(
                message=f"Maximum parse depth exceeded ({MAX_PARSE_DEPTH})",
                text=text,
            )
    def validate(self, text: str) -> list[str]:
        """
        Validate syntax without full parsing.
        Args:
            text: Text to validate
        Returns:
            List of error messages (empty if valid)
        """
        errors = []
        try:
            self.parse(text)
        except ParseError as e:
            errors.append(str(e))
        except Exception as e:
            errors.append(f"Unexpected error: {e}")
        return errors
    def export_to_monaco(self, case_insensitive: bool = False) -> dict[str, Any]:
        """
        Export grammar to Monaco Monarch format.
        Args:
            case_insensitive: Whether language is case-insensitive
        Returns:
            Dictionary with Monaco language and config definitions
        """
        return export_grammar_to_monaco(
            self._grammar_text,
            self._name,
            case_insensitive,
            output_format='dict',
        )
    def export_to_monaco_typescript(self, case_insensitive: bool = False) -> str:
        """
        Export grammar to Monaco TypeScript code.
        Args:
            case_insensitive: Whether language is case-insensitive
        Returns:
            TypeScript code for Monaco registration
        """
        return export_grammar_to_monaco(
            self._grammar_text,
            self._name,
            case_insensitive,
            output_format='typescript',
        )
    def _tree_to_ast(self, tree: Tree | Token, depth: int = 0) -> ParseNode:
        """
        Convert Lark tree to ParseNode.
        Args:
            tree: Lark tree or token
            depth: Current recursion depth
        Returns:
            ParseNode
        """
        if depth > MAX_PARSE_DEPTH:
            raise MaxDepthError(f"Maximum depth {MAX_PARSE_DEPTH} exceeded")
        # Handle tokens (terminals)
        if isinstance(tree, Token):
            return ParseNode(
                type='terminal',
                value=str(tree),
                children=[],
                metadata={'token_type': tree.type if hasattr(tree, 'type') else None}
            )
        # Handle trees (non-terminals)
        children = []
        for child in tree.children:
            child_node = self._tree_to_ast(child, depth + 1)
            children.append(child_node)
        # Special handling for rules that match alternatives of terminals
        # (e.g., binary_op: "+" | "-" | "*")
        # In these cases, Lark creates a Tree with no children, but we need to
        # extract the actual matched token from the source
        metadata = {'rule': tree.data}
        # For binary_op and similar rules, try to extract the token from children
        # If the rule has no children but we're in a context where we can infer it,
        # we'll handle it in the transformer
        if tree.data == 'binary_op' and not tree.children:
            # binary_op matched but token was consumed - we'll need to infer from context
            # Store a flag in metadata
            metadata['needs_inference'] = True
        return ParseNode(
            type=tree.data,
            value=None,
            children=children,
            metadata=metadata
        )
class LarkSyntaxEngine(ASyntaxEngine):
    """
    Lark syntax engine with full Indenter support.
    This engine provides complete Lark functionality including Indenter postlexer
    for languages like Python that require INDENT/DEDENT token handling.
    Use this engine for:
    - Python and other indentation-based languages
    - Grammars that declare _INDENT/_DEDENT tokens
    - Any grammar that requires postlex processing
    """
    def __init__(
        self,
        grammar_dir: Optional[str | Path] = None,
        cache_size: int = 128,
    ):
        """
        Initialize Lark syntax engine.
        Args:
            grammar_dir: Directory containing grammar files (None = default)
            cache_size: Maximum number of cached parsers
        """
        self._grammar_dir = self._resolve_grammar_dir(grammar_dir)
        self._cache = ParserCache(max_size=cache_size)
        self._grammars: dict[str, LarkGrammar] = {}
    def _resolve_grammar_dir(self, grammar_dir: Optional[str | Path]) -> Path:
        """Resolve grammar directory path."""
        if grammar_dir is None:
            # Default: look for grammars in parent directory
            return Path(__file__).parent.parent / 'grammars'
        return Path(grammar_dir)
    def _detect_grammar_file(self, name: str) -> Optional[Path]:
        """
        Detect grammar file with any supported extension.
        Tries multiple extensions in order:
        1. .in.grammar (Input grammar - preferred for parsing)
        2. .grammar (Lark EBNF)
        3. Other formats...
        """
        extensions = [
            '.grammar.in.lark',  # New format: input grammar files (preferred for parsing)
            '.grammar.in.grammar',  # Legacy format
            '.in.grammar',  # Legacy format
            '.grammar',
            '.tmLanguage.json',
            '.tmLanguage',
            '.json',
            '.yaml',
            '.yml',
            '.toml',
            '.xml',
            '.plist',
        ]
        for ext in extensions:
            grammar_file = self._grammar_dir / f"{name}{ext}"
            if grammar_file.exists():
                return grammar_file
        return None
    def _requires_indenter(self, grammar_text: str) -> bool:
        """
        Check if grammar requires Indenter (has _INDENT/_DEDENT declarations).
        Args:
            grammar_text: Grammar definition text
        Returns:
            True if grammar declares _INDENT/_DEDENT
        """
        return '%declare' in grammar_text and ('_INDENT' in grammar_text or '_DEDENT' in grammar_text)
    def load_grammar(self, name: str) -> LarkGrammar:
        """
        Load grammar by name with automatic Indenter detection.
        Supports multiple formats and automatically detects if Indenter
        is needed based on grammar declarations.
        Args:
            name: Grammar name (e.g., 'sql', 'json', 'python')
        Returns:
            LarkGrammar instance
        Raises:
            GrammarNotFoundError: If grammar not found in any format
        """
        # Check cache
        if name in self._grammars:
            return self._grammars[name]
        # Check file cache
        cached = self._cache.get(name)
        if cached:
            self._grammars[name] = cached
            return cached
        # Detect grammar file with any supported extension
        grammar_file = self._detect_grammar_file(name)
        if not grammar_file:
            raise GrammarNotFoundError(
                f"Grammar '{name}' not found in {self._grammar_dir} "
                f"(tried: .grammar.in.lark, .grammar.in.grammar, .in.grammar, .grammar, .tmLanguage.json, .tmLanguage, .json, .yaml, .toml, .xml)"
            )
        try:
            # Use multi-format loader (reuses serialization!)
            loader = get_grammar_loader()
            grammar_text, format_type, metadata = loader.load_grammar_file(grammar_file)
        except Exception as e:
            raise GrammarError(f"Failed to load grammar '{name}' from {grammar_file}: {e}")
        # Parse metadata
        version = metadata.get('version', "1.0.0")
        start_rule = metadata.get('start_rule', "start")
        # Detect if Indenter is needed
        use_indenter = self._requires_indenter(grammar_text)
        # Create grammar with appropriate settings
        grammar = LarkGrammar(
            name=name,
            grammar_text=grammar_text,
            version=version,
            start_rule=start_rule,
            use_indenter=use_indenter,
        )
        # Store metadata
        grammar._metadata = metadata
        grammar._source_format = metadata.get('source_format', 'lark')
        # Cache
        self._grammars[name] = grammar
        self._cache.set(name, grammar)
        return grammar
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
        g = self.load_grammar(grammar)
        return g.parse(text, mode)
    def validate(self, text: str, grammar: str) -> list[str]:
        """
        Validate text against grammar.
        Args:
            text: Text to validate
            grammar: Grammar name
        Returns:
            List of error messages (empty if valid)
        """
        try:
            g = self.load_grammar(grammar)
            return g.validate(text)
        except GrammarNotFoundError as e:
            return [str(e)]
    def list_grammars(self) -> list[str]:
        """
        List available grammars.
        Returns:
            List of grammar names (without .in/.out suffixes)
        """
        if not self._grammar_dir.exists():
            return []
        grammar_names = set()
        # Find all new format files first (preferred)
        for file in self._grammar_dir.glob("*.grammar.in.lark"):
            name = file.stem.replace('.grammar.in', '')
            grammar_names.add(name)
        # Also check legacy .in.grammar files
        for file in self._grammar_dir.glob("*.in.grammar"):
            name = file.stem.replace('.in', '')
            grammar_names.add(name)
        # Also check for .grammar files (fallback naming)
        for file in self._grammar_dir.glob("*.grammar"):
            name = file.stem
            # Skip all known patterns
            if not name.endswith('.grammar.in') and not name.endswith('.grammar.out') and not name.endswith('.in') and not name.endswith('.out'):
                grammar_names.add(name)
        return sorted(grammar_names)
    def clear_cache(self) -> None:
        """Clear parser cache."""
        self._cache.clear()
        self._grammars.clear()

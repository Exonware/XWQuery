#exonware/xwsyntax/src/exonware/xwsyntax/engine.py
"""
Core syntax engine implementation using Lark parser.
"""

from pathlib import Path
from typing import Any, Dict, List, Optional, Union
from .base import AGrammar, ASyntaxEngine
from .syntax_tree import ASTNode
from .parser_cache import ParserCache
from .defs import ParserMode, GrammarFormat, MAX_PARSE_DEPTH
from .errors import GrammarNotFoundError, ParseError, GrammarError, MaxDepthError
from .monaco_exporter import export_grammar_to_monaco
from .grammar_loader import get_grammar_loader

# Import Lark - required dependency per pyproject.toml
# No try/except per DEV_GUIDELINES.md Line 128
from lark import Lark, Tree, Token
from lark.exceptions import LarkError, ParseError as LarkParseError


class Grammar(AGrammar):
    """
    Grammar implementation using Lark parser.
    
    Provides parsing capabilities for a specific grammar format.
    """
    
    def __init__(
        self,
        name: str,
        grammar_text: str,
        version: str = "1.0.0",
        start_rule: str = "start",
    ):
        """
        Initialize grammar.
        
        Args:
            name: Grammar name
            grammar_text: Grammar definition in Lark format
            version: Grammar version
            start_rule: Start rule name
        """
        self._name = name
        self._version = version
        self._start_rule = start_rule
        self._grammar_text = grammar_text
        
        try:
            self._parser = Lark(
                grammar_text,
                start=start_rule,
                parser='lalr',  # Fast LALR parser
                maybe_placeholders=False,
            )
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
    
    def parse(self, text: str, mode: ParserMode = ParserMode.STRICT) -> ASTNode:
        """
        Parse text to AST.
        
        Args:
            text: Text to parse
            mode: Parser mode (currently only STRICT supported)
            
        Returns:
            ASTNode: Root AST node
            
        Raises:
            ParseError: If parsing fails
        """
        try:
            tree = self._parser.parse(text)
            return self._tree_to_ast(tree)
        except LarkParseError as e:
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
    
    def validate(self, text: str) -> List[str]:
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
    
    def export_to_monaco(self, case_insensitive: bool = False) -> Dict[str, Any]:
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
    
    def _tree_to_ast(self, tree: Union[Tree, Token], depth: int = 0) -> ASTNode:
        """
        Convert Lark tree to ASTNode.
        
        Args:
            tree: Lark tree or token
            depth: Current recursion depth
            
        Returns:
            ASTNode
        """
        if depth > MAX_PARSE_DEPTH:
            raise MaxDepthError(f"Maximum depth {MAX_PARSE_DEPTH} exceeded")
        
        # Handle tokens (terminals)
        if isinstance(tree, Token):
            return ASTNode(
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
        
        return ASTNode(
            type=tree.data,
            value=None,
            children=children,
            metadata={'rule': tree.data}
        )


class SyntaxEngine(ASyntaxEngine):
    """
    Main syntax engine.
    
    Manages grammar loading, parsing, and caching.
    """
    
    def __init__(
        self,
        grammar_dir: Optional[Union[str, Path]] = None,
        cache_size: int = 128,
    ):
        """
        Initialize syntax engine.
        
        Args:
            grammar_dir: Directory containing grammar files (None = default)
            cache_size: Maximum number of cached parsers
        """
        self._grammar_dir = self._resolve_grammar_dir(grammar_dir)
        self._cache = ParserCache(max_size=cache_size)
        self._grammars: Dict[str, Grammar] = {}
    
    def _resolve_grammar_dir(self, grammar_dir: Optional[Union[str, Path]]) -> Path:
        """Resolve grammar directory path."""
        if grammar_dir is None:
            # Default: look for grammars in same directory
            return Path(__file__).parent / 'grammars'
        return Path(grammar_dir)
    
    def _detect_grammar_file(self, name: str) -> Optional[Path]:
        """
        Detect grammar file with any supported extension.
        
        Tries multiple extensions in order:
        1. .grammar (Lark EBNF)
        2. .tmLanguage.json (TextMate JSON)
        3. .tmLanguage (TextMate PLIST)
        4. .json (JSON)
        5. .yaml, .yml (YAML)
        6. .toml (TOML)
        7. .xml (XML)
        """
        extensions = [
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
    
    def load_grammar(self, name: str) -> Grammar:
        """
        Load grammar by name.
        
        Supports multiple formats:
        - .grammar (Lark EBNF)
        - .tmLanguage.json (TextMate JSON)
        - .tmLanguage (TextMate PLIST)
        - .json, .yaml, .toml, .xml
        
        Args:
            name: Grammar name (e.g., 'sql', 'json', 'python')
            
        Returns:
            Grammar instance
            
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
                f"(tried: .grammar, .tmLanguage.json, .tmLanguage, .json, .yaml, .toml, .xml)"
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
        
        # Create grammar
        grammar = Grammar(
            name=name,
            grammar_text=grammar_text,
            version=version,
            start_rule=start_rule,
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
    ) -> ASTNode:
        """
        Parse text using specified grammar.
        
        Args:
            text: Text to parse
            grammar: Grammar name
            mode: Parser mode
            
        Returns:
            ASTNode: Root AST node
            
        Raises:
            GrammarNotFoundError: If grammar not found
            ParseError: If parsing fails
        """
        g = self.load_grammar(grammar)
        return g.parse(text, mode)
    
    def validate(self, text: str, grammar: str) -> List[str]:
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
    
    def list_grammars(self) -> List[str]:
        """
        List available grammars.
        
        Returns:
            List of grammar names
        """
        if not self._grammar_dir.exists():
            return []
        
        grammars = []
        for file in self._grammar_dir.glob("*.grammar"):
            grammars.append(file.stem)
        
        return sorted(grammars)
    
    def clear_cache(self) -> None:
        """Clear parser cache."""
        self._cache.clear()
        self._grammars.clear()


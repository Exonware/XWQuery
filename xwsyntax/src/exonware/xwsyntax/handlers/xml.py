#exonware/xwsyntax/src/exonware/xwsyntax/handlers/xml.py
"""
XML Grammar Handler - Self-describing, NO HARDCODING!
Company: eXonware.com
Author: eXonware Backend Team
Date: November 15, 2025
"""
from typing import Optional, Any
from ..base import ASyntaxHandler, AGrammar
from ..syntax_tree import ParseNode
from ..defs import GrammarFormat
class XMLGrammarHandler(ASyntaxHandler):
    """XML Grammar Handler - all metadata self-declared!"""
    # =========================================================================
    # METADATA (Self-Describing - NO HARDCODING!)
    # =========================================================================
    @property
    def format_id(self) -> str:
        return "XML"
    @property
    def syntax_name(self) -> str:
        return "xml"
    @property
    def format_name(self) -> str:
        return "XML"
    @property
    def file_extensions(self) -> list[str]:
        return [".xml", ".xsd", ".xslt", ".xhtml"]
    @property
    def mime_type(self) -> str:
        return "application/xml"
    @property
    def mime_types(self) -> list[str]:
        return ["application/xml", "text/xml", "application/xhtml+xml"]
    @property
    def aliases(self) -> list[str]:
        return ["xml", "XML", "xhtml", "xsd", "xslt"]
    @property
    def category(self) -> str:
        return "data"
    @property
    def supports_bidirectional(self) -> bool:
        return True
    @property
    def is_binary_format(self) -> bool:
        return False
    @property
    def supports_streaming(self) -> bool:
        return True  # XML supports streaming parsing
    # =========================================================================
    # GRAMMAR OPERATIONS
    # =========================================================================
    def parse_grammar(self, text: str, metadata: Optional[dict[str, Any]] = None) -> AGrammar:
        from ..engine import Grammar
        return Grammar(
            name=metadata.get('name', self.syntax_name) if metadata else self.syntax_name,
            grammar_text=text,
            version=metadata.get('version', '1.0') if metadata else '1.0',
            start_rule=metadata.get('start_rule', 'start') if metadata else 'start'
        )
    def validate_grammar(self, text: str) -> list[str]:
        errors = []
        if not text or not text.strip():
            errors.append("Grammar cannot be empty")
        return errors
    def get_grammar_format(self) -> GrammarFormat:
        return GrammarFormat.LARK
    def convert_to_lark(self, grammar_data: Any) -> str:
        if isinstance(grammar_data, str):
            return grammar_data
        return str(grammar_data)
    # =========================================================================
    # PARSING AND GENERATION
    # =========================================================================
    def parse(self, text: str, grammar: Optional[AGrammar] = None) -> ParseNode:
        """Parse XML to AST."""
        if grammar is None:
            grammar = self._get_default_grammar()
        return grammar.parse(text)
    def generate(self, ast: ParseNode, grammar: Optional[AGrammar] = None) -> str:
        """Generate XML from AST."""
        from ..unparser import Unparser
        if grammar is None:
            grammar = self._get_default_output_grammar()
        unparser = Unparser(grammar)
        return unparser.unparse(ast)
    def _get_default_grammar(self) -> AGrammar:
        """Get default XML input grammar."""
        from ..facade import XWSyntax
        engine = XWSyntax()
        return engine.load_grammar("xml")
    def _get_default_output_grammar(self) -> AGrammar:
        """Get default XML output grammar."""
        from ..grammar_loader import get_grammar_loader
        loader = get_grammar_loader()
        grammar_paths = [
            "xml.out.grammar",
            "grammars/xml.out.grammar",
            "src/exonware/xwsyntax/grammars/xml.out.grammar",
        ]
        for path in grammar_paths:
            try:
                grammar_text, _, metadata = loader.load_grammar_file(path)
                return self.parse_grammar(grammar_text, metadata)
            except (FileNotFoundError, Exception):
                continue
        return self._get_default_grammar()
    def capabilities(self) -> set:
        return {"parse", "generate", "validate", "format", "xpath"}
    def sniff_format(self, src: Any) -> bool:
        if isinstance(src, str):
            stripped = src.strip()
            # XML starts with <?xml or <tag
            return (stripped.startswith('<?xml') or 
                    (stripped.startswith('<') and '>' in stripped))
        return False

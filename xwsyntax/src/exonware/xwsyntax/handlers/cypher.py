#!/usr/bin/env python3
"""
#exonware/xwsyntax/src/exonware/xwsyntax/handlers/cypher.py
Cypher Grammar Handler
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.6.0.1
Generation Date: 15-Nov-2025
"""

from typing import Any, Optional
from pathlib import Path
from exonware.xwsystem import get_logger
from ..base import ASyntaxHandler
logger = get_logger(__name__)


class CypherGrammarHandler(ASyntaxHandler):
    """
    Cypher grammar handler for Neo4j graph query language.
    Self-describing handler with metadata declared in class.
    """
    # Metadata (self-describing)
    format_id = "CYPHER"
    syntax_name = "cypher"
    file_extensions = [".cypher", ".cql"]
    mime_types = ["application/x-cypher", "text/x-cypher"]
    primary_mime_type = "application/x-cypher"
    aliases = ["Cypher", "CQL"]
    category = "query"
    supports_bidirectional = True
    is_binary_format = False
    supports_streaming = True

    def parse_grammar(self, grammar_path: Path) -> dict[str, Any]:
        """Parse Cypher grammar file."""
        from ..engines import LarkSyntaxEngine
        engine = LarkSyntaxEngine()
        return engine.load_grammar(grammar_path.stem)

    def validate_grammar(self, grammar: dict[str, Any]) -> bool:
        """Validate Cypher grammar structure."""
        return isinstance(grammar, dict) and 'rules' in grammar

    def get_grammar_format(self) -> str:
        """Get grammar format identifier."""
        return "lark"

    def convert_to_lark(self, grammar: dict[str, Any]) -> str:
        """Convert grammar to Lark EBNF format."""
        # Basic Cypher grammar structure
        if isinstance(grammar, dict) and 'rules' in grammar:
            rules = grammar['rules']
            lark_rules = []
            for rule_name, rule_def in rules.items():
                lark_rules.append(f"{rule_name}: {rule_def}")
            return '\n'.join(lark_rules)
        return str(grammar)

    def parse(self, text: str, grammar: Optional[dict[str, Any]] = None) -> Any:
        """Parse Cypher query text."""
        # Basic parsing - full implementation would use Cypher parser
        return {'type': 'cypher_query', 'text': text}

    def generate(self, ast: Any, grammar: Optional[dict[str, Any]] = None) -> str:
        """Generate Cypher query from AST."""
        if isinstance(ast, dict) and 'text' in ast:
            return ast['text']
        return str(ast)

    def _get_default_grammar(self) -> dict[str, Any]:
        """Get default Cypher grammar."""
        return {
            'rules': {
                'query': 'MATCH | CREATE | MERGE | DELETE | SET | RETURN',
                'match': 'MATCH pattern WHERE? RETURN',
                'create': 'CREATE pattern',
                'merge': 'MERGE pattern',
            }
        }

    def _get_default_output_grammar(self) -> dict[str, Any]:
        """Get default output grammar (same as input for Cypher)."""
        return self._get_default_grammar()

    def _tree_to_ast(self, tree: Any) -> Any:
        """Convert parse tree to AST."""
        return tree

    def capabilities(self) -> dict[str, bool]:
        """Get handler capabilities."""
        return {
            'parsing': True,
            'generation': True,
            'validation': True,
            'format_conversion': True,
        }

    def sniff_format(self, text: str) -> tuple[bool, float]:
        """Sniff if text is Cypher format."""
        cypher_keywords = ['MATCH', 'CREATE', 'MERGE', 'RETURN', 'WHERE', 'WITH']
        text_upper = text.upper()
        matches = sum(1 for keyword in cypher_keywords if keyword in text_upper)
        confidence = min(matches / len(cypher_keywords), 1.0)
        return matches > 0, confidence

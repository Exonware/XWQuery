#!/usr/bin/env python3
"""
#exonware/xwsyntax/src/exonware/xwsyntax/handlers/sparql.py
SPARQL Grammar Handler
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.6.0.2
Generation Date: 15-Nov-2025
"""

from typing import Any, Optional
from pathlib import Path
from exonware.xwsystem import get_logger
from ..base import ASyntaxHandler
logger = get_logger(__name__)


class SPARQLGrammarHandler(ASyntaxHandler):
    """
    SPARQL grammar handler for RDF query language.
    Self-describing handler with metadata declared in class.
    """
    # Metadata (self-describing)
    format_id = "SPARQL"
    syntax_name = "sparql"
    file_extensions = [".sparql", ".rq"]
    mime_types = ["application/sparql-query", "text/sparql"]
    primary_mime_type = "application/sparql-query"
    aliases = ["SPARQL", "RDF Query"]
    category = "query"
    supports_bidirectional = True
    is_binary_format = False
    supports_streaming = True

    def parse_grammar(self, grammar_path: Path) -> dict[str, Any]:
        """Parse SPARQL grammar file."""
        from ..engines import LarkSyntaxEngine
        engine = LarkSyntaxEngine()
        return engine.load_grammar(grammar_path.stem)

    def validate_grammar(self, grammar: dict[str, Any]) -> bool:
        """Validate SPARQL grammar structure."""
        return isinstance(grammar, dict) and 'rules' in grammar

    def get_grammar_format(self) -> str:
        """Get grammar format identifier."""
        return "lark"

    def convert_to_lark(self, grammar: dict[str, Any]) -> str:
        """Convert grammar to Lark EBNF format."""
        if isinstance(grammar, dict) and 'rules' in grammar:
            rules = grammar['rules']
            lark_rules = []
            for rule_name, rule_def in rules.items():
                lark_rules.append(f"{rule_name}: {rule_def}")
            return '\n'.join(lark_rules)
        return str(grammar)

    def parse(self, text: str, grammar: Optional[dict[str, Any]] = None) -> Any:
        """Parse SPARQL query text."""
        return {'type': 'sparql_query', 'text': text}

    def generate(self, ast: Any, grammar: Optional[dict[str, Any]] = None) -> str:
        """Generate SPARQL query from AST."""
        if isinstance(ast, dict) and 'text' in ast:
            return ast['text']
        return str(ast)

    def _get_default_grammar(self) -> dict[str, Any]:
        """Get default SPARQL grammar."""
        return {
            'rules': {
                'query': 'SELECT | CONSTRUCT | ASK | DESCRIBE',
                'select': 'SELECT variables WHERE pattern',
                'construct': 'CONSTRUCT template WHERE pattern',
                'ask': 'ASK WHERE pattern',
                'describe': 'DESCRIBE resource WHERE?',
            }
        }

    def _get_default_output_grammar(self) -> dict[str, Any]:
        """Get default output grammar (same as input for SPARQL)."""
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
        """Sniff if text is SPARQL format."""
        sparql_keywords = ['SELECT', 'CONSTRUCT', 'ASK', 'DESCRIBE', 'WHERE', 'PREFIX']
        text_upper = text.upper()
        matches = sum(1 for keyword in sparql_keywords if keyword in text_upper)
        confidence = min(matches / len(sparql_keywords), 1.0)
        return matches > 0, confidence

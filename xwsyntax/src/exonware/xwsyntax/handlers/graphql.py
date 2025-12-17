#exonware/xwsyntax/src/exonware/xwsyntax/handlers/graphql.py
"""
GraphQL Grammar Handler - Self-describing, NO HARDCODING!

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Date: October 29, 2025
"""

from typing import Optional, Any
from ..base import ASyntaxHandler, AGrammar
from ..syntax_tree import ASTNode
from ..defs import GrammarFormat


class GraphQLGrammarHandler(ASyntaxHandler):
    """GraphQL Grammar Handler - all metadata self-declared!"""
    
    # =========================================================================
    # METADATA (Self-Describing - NO HARDCODING!)
    # =========================================================================
    
    @property
    def format_id(self) -> str:
        return "GraphQL"
    
    @property
    def syntax_name(self) -> str:
        return "graphql"
    
    @property
    def format_name(self) -> str:
        return "GraphQL"
    
    @property
    def file_extensions(self) -> list[str]:
        return [".graphql", ".gql"]
    
    @property
    def mime_type(self) -> str:
        return "application/graphql"
    
    @property
    def mime_types(self) -> list[str]:
        return ["application/graphql", "application/x-graphql"]
    
    @property
    def aliases(self) -> list[str]:
        return ["graphql", "gql", "GraphQL"]
    
    @property
    def category(self) -> str:
        return "query"
    
    @property
    def supports_bidirectional(self) -> bool:
        return True  # Can parse and generate GraphQL
    
    @property
    def is_binary_format(self) -> bool:
        return False
    
    @property
    def supports_streaming(self) -> bool:
        return False
    
    # =========================================================================
    # GRAMMAR OPERATIONS
    # =========================================================================
    
    def parse_grammar(self, text: str, metadata: Optional[dict[str, Any]] = None) -> AGrammar:
        from ..engine import Grammar
        return Grammar(
            name=metadata.get('name', self.syntax_name) if metadata else self.syntax_name,
            grammar_text=text,
            version=metadata.get('version', '1.0.0') if metadata else '1.0.0',
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
    
    def parse(self, text: str, grammar: Optional[AGrammar] = None) -> ASTNode:
        """Parse GraphQL query to AST."""
        # Implementation details...
        pass
    
    def generate(self, ast: ASTNode, grammar: Optional[AGrammar] = None) -> str:
        """Generate GraphQL from AST."""
        # Implementation details...
        pass
    
    def capabilities(self) -> set:
        return set()
    
    def sniff_format(self, src: Any) -> bool:
        if isinstance(src, str):
            gql_keywords = ['query', 'mutation', 'subscription', 'fragment']
            lower = src.lower()
            return any(kw in lower for kw in gql_keywords)
        return False


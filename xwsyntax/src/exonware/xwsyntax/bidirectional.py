#!/usr/bin/env python3
#exonware/xwsyntax/src/exonware/xwsyntax/bidirectional.py

"""
Bidirectional Grammar Support for xwsyntax

Combines input grammars (parsing) and output grammars (generation)
for roundtrip text processing.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.1
Generation Date: 29-Oct-2025
"""

from typing import Any, Dict, Optional
from pathlib import Path
from .engine import Grammar
from .output_grammar import OutputGrammar, OutputGrammarRegistry
from .unparser import GrammarUnparser
from .syntax_tree import ASTNode
from .errors import GrammarError, ParseError


class BidirectionalGrammar:
    """
    Bidirectional grammar supporting both parsing and generation.
    
    Combines:
    - Input grammar (.grammar) for parsing text → AST
    - Output grammar (.out.grammar) for generating AST → text
    
    Features:
    - Roundtrip processing (parse → generate → parse)
    - Format-preserving generation
    - Template-based output
    """
    
    def __init__(
        self,
        format_name: str,
        input_grammar: Grammar,
        output_grammar: OutputGrammar
    ):
        """
        Initialize bidirectional grammar.
        
        Args:
            format_name: Format name (e.g., 'json', 'sql')
            input_grammar: Grammar for parsing
            output_grammar: Grammar for generation
        """
        self.format_name = format_name
        self.input_grammar = input_grammar
        self.output_grammar = output_grammar
        self.unparser = GrammarUnparser(output_grammar)
    
    def parse(self, text: str, **options) -> ASTNode:
        """
        Parse text to AST.
        
        Args:
            text: Input text
            **options: Parse options
            
        Returns:
            AST node
        """
        return self.input_grammar.parse(text)
    
    def generate(self, ast: ASTNode, **options) -> str:
        """
        Generate text from AST.
        
        Args:
            ast: AST node
            **options: Generation options (pretty, indent, etc.)
            
        Returns:
            Generated text
        """
        return self.unparser.unparse(ast, **options)
    
    def roundtrip(self, text: str, **options) -> str:
        """
        Parse and regenerate text (roundtrip test).
        
        Args:
            text: Input text
            **options: Generation options
            
        Returns:
            Regenerated text
        """
        ast = self.parse(text)
        return self.generate(ast, **options)
    
    def validate_roundtrip(self, text: str, normalize: bool = True) -> bool:
        """
        Validate that roundtrip produces equivalent result.
        
        Args:
            text: Input text
            normalize: Normalize whitespace before comparison
            
        Returns:
            True if roundtrip succeeds
        """
        try:
            # Parse original
            ast1 = self.parse(text)
            
            # Generate
            generated = self.generate(ast1)
            
            # Re-parse
            ast2 = self.parse(generated)
            
            # Compare ASTs
            return self._compare_asts(ast1, ast2, normalize)
        except Exception:
            return False
    
    def _compare_asts(self, ast1: ASTNode, ast2: ASTNode, normalize: bool = True) -> bool:
        """Compare two AST nodes for equivalence."""
        # Compare types
        if ast1.type != ast2.type:
            return False
        
        # Compare values
        if normalize:
            val1 = str(ast1.value).strip() if ast1.value else None
            val2 = str(ast2.value).strip() if ast2.value else None
        else:
            val1 = ast1.value
            val2 = ast2.value
        
        if val1 != val2:
            return False
        
        # Compare children count
        if len(ast1.children) != len(ast2.children):
            return False
        
        # Compare children recursively
        for child1, child2 in zip(ast1.children, ast2.children):
            if not self._compare_asts(child1, child2, normalize):
                return False
        
        return True
    
    @classmethod
    def load(cls, format_name: str, grammar_dir: Optional[str] = None) -> 'BidirectionalGrammar':
        """
        Load bidirectional grammar for a format.
        
        Args:
            format_name: Format name (e.g., 'json', 'sql')
            grammar_dir: Directory containing grammar files
            
        Returns:
            BidirectionalGrammar instance
        """
        if not grammar_dir:
            grammar_dir = str(Path(__file__).parent / 'grammars')
        
        # Load input grammar (try .in.grammar first, fallback to .grammar)
        input_file = Path(grammar_dir) / f"{format_name}.in.grammar"
        if not input_file.exists():
            # Fallback to old naming
            input_file = Path(grammar_dir) / f"{format_name}.grammar"
            if not input_file.exists():
                raise GrammarError(f"Input grammar not found: {format_name}.in.grammar or {format_name}.grammar")
        
        with open(input_file, 'r', encoding='utf-8') as f:
            input_text = f.read()
        
        input_grammar = Grammar(format_name, input_text)
        
        # Load output grammar
        output_file = Path(grammar_dir) / f"{format_name}.out.grammar"
        if not output_file.exists():
            raise GrammarError(f"Output grammar not found: {output_file}")
        
        output_grammar = OutputGrammar.load_from_file(str(output_file))
        
        return cls(format_name, input_grammar, output_grammar)
    
    def __repr__(self) -> str:
        return f"BidirectionalGrammar(format='{self.format_name}')"


class BidirectionalGrammarRegistry:
    """Registry for managing bidirectional grammars."""
    
    def __init__(self, grammar_dir: Optional[str] = None):
        """Initialize registry."""
        self.grammar_dir = grammar_dir
        self._grammars: Dict[str, BidirectionalGrammar] = {}
    
    def load_grammar(self, format_name: str) -> BidirectionalGrammar:
        """Load bidirectional grammar."""
        if format_name in self._grammars:
            return self._grammars[format_name]
        
        grammar = BidirectionalGrammar.load(format_name, self.grammar_dir)
        self._grammars[format_name] = grammar
        
        return grammar
    
    def get_grammar(self, format_name: str) -> Optional[BidirectionalGrammar]:
        """Get cached grammar."""
        return self._grammars.get(format_name)
    
    def list_formats(self) -> list:
        """List all formats with bidirectional support."""
        if not self.grammar_dir:
            grammar_dir = str(Path(__file__).parent / 'grammars')
        else:
            grammar_dir = self.grammar_dir
        
        formats = []
        grammar_path = Path(grammar_dir)
        
        # Find all .out.grammar files
        for out_file in grammar_path.glob('*.out.grammar'):
            format_name = out_file.stem.replace('.out', '')
            
            # Check if input grammar also exists (.in.grammar or .grammar)
            input_file = grammar_path / f"{format_name}.in.grammar"
            if not input_file.exists():
                input_file = grammar_path / f"{format_name}.grammar"
            
            if input_file.exists():
                formats.append(format_name)
        
        return sorted(formats)


# Global registry
_global_registry = None


def get_bidirectional_registry() -> BidirectionalGrammarRegistry:
    """Get global bidirectional grammar registry."""
    global _global_registry
    if _global_registry is None:
        _global_registry = BidirectionalGrammarRegistry()
    return _global_registry


__all__ = [
    'BidirectionalGrammar',
    'BidirectionalGrammarRegistry',
    'get_bidirectional_registry'
]


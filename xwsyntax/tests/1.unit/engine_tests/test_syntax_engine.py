#exonware/xwsyntax/tests/1.unit/engine_tests/test_syntax_engine.py

"""
Unit tests for SyntaxEngine class.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1
"""

import pytest
from exonware.xwsyntax import SyntaxEngine, Grammar
from exonware.xwsyntax.errors import GrammarNotFoundError


@pytest.mark.xwsyntax_unit
class TestSyntaxEngine:
    """Unit tests for SyntaxEngine."""
    
    def test_create_engine(self):
        """Test creating a SyntaxEngine instance."""
        engine = SyntaxEngine()
        assert engine is not None
    
    def test_load_json_grammar(self, syntax_engine):
        """Test loading JSON grammar."""
        grammar = syntax_engine.load_grammar('json')
        assert grammar is not None
        assert isinstance(grammar, Grammar)
    
    def test_parse_simple_json(self, syntax_engine):
        """Test parsing simple JSON."""
        ast = syntax_engine.parse('{"key": "value"}', grammar='json')
        assert ast is not None
        assert ast.type == 'object'
    
    def test_parse_json_array(self, syntax_engine):
        """Test parsing JSON array."""
        ast = syntax_engine.parse('[1, 2, 3]', grammar='json')
        assert ast is not None
        assert ast.type == 'array'
    
    def test_invalid_grammar_raises_error(self, syntax_engine):
        """Test that invalid grammar name raises proper error."""
        with pytest.raises(GrammarNotFoundError):
            syntax_engine.load_grammar('nonexistent_grammar')
    
    def test_list_available_grammars(self, syntax_engine):
        """Test listing available grammars."""
        grammars = syntax_engine.list_grammars()
        assert isinstance(grammars, list)
        assert 'json' in grammars
        assert len(grammars) >= 1


@pytest.mark.xwsyntax_unit
class TestGrammar:
    """Unit tests for Grammar class."""
    
    def test_grammar_parse(self, syntax_engine):
        """Test Grammar.parse() method."""
        grammar = syntax_engine.load_grammar('json')
        ast = grammar.parse('{"test": true}')
        assert ast is not None
    
    def test_grammar_caching(self, syntax_engine):
        """Test that grammars are cached."""
        grammar1 = syntax_engine.load_grammar('json')
        grammar2 = syntax_engine.load_grammar('json')
        # Should return cached instance
        assert grammar1 is grammar2


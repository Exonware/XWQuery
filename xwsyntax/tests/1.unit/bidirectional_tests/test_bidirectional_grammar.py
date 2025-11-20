#exonware/xwsyntax/tests/1.unit/bidirectional_tests/test_bidirectional_grammar.py

"""
Unit tests for BidirectionalGrammar class.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1
"""

import pytest
from exonware.xwsyntax import BidirectionalGrammar, get_bidirectional_registry


@pytest.mark.xwsyntax_unit
class TestBidirectionalGrammar:
    """Unit tests for BidirectionalGrammar class."""
    
    def test_load_json_grammar(self):
        """Test loading JSON bidirectional grammar."""
        grammar = BidirectionalGrammar.load('json')
        assert grammar is not None
        assert grammar.format == 'json'
    
    def test_parse_simple_json(self, json_grammar):
        """Test parsing simple JSON."""
        ast = json_grammar.parse('{"key": "value"}')
        assert ast is not None
        assert ast.type == 'object'
    
    def test_generate_simple_json(self, json_grammar):
        """Test generating JSON from AST."""
        ast = json_grammar.parse('{"name": "Alice"}')
        output = json_grammar.generate(ast)
        assert output is not None
        assert 'Alice' in output
    
    def test_validate_roundtrip_simple(self, json_grammar):
        """Test roundtrip validation."""
        input_text = '{"test": "data", "number": 42}'
        assert json_grammar.validate_roundtrip(input_text)
    
    def test_validate_roundtrip_array(self, json_grammar):
        """Test roundtrip validation for arrays."""
        input_text = '[1, 2, 3, "test", true, false, null]'
        assert json_grammar.validate_roundtrip(input_text)
    
    def test_validate_roundtrip_nested(self, json_grammar):
        """Test roundtrip validation for nested structures."""
        input_text = '{"users": [{"id": 1, "name": "Alice"}], "count": 1}'
        assert json_grammar.validate_roundtrip(input_text)


@pytest.mark.xwsyntax_unit
class TestBidirectionalGrammarRegistry:
    """Unit tests for BidirectionalGrammarRegistry."""
    
    def test_get_registry(self):
        """Test getting bidirectional registry."""
        registry = get_bidirectional_registry()
        assert registry is not None
    
    def test_list_formats(self):
        """Test listing available formats."""
        registry = get_bidirectional_registry()
        formats = registry.list_formats()
        assert isinstance(formats, list)
        assert 'json' in formats
    
    def test_load_from_registry(self):
        """Test loading grammar from registry."""
        registry = get_bidirectional_registry()
        grammar = registry.load('json')
        assert grammar is not None
        assert grammar.format == 'json'


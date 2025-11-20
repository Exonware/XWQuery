#exonware/xwsyntax/tests/0.core/test_core_bidirectional.py

"""
Core bidirectional grammar tests for xwsyntax.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1
"""

import pytest
from exonware.xwsyntax import BidirectionalGrammar


@pytest.mark.xwsyntax_core
class TestBidirectionalCore:
    """Core tests for bidirectional grammars - 20% for 80% value."""
    
    def test_json_simple_roundtrip(self):
        """Test simple JSON roundtrip parsing and generation."""
        grammar = BidirectionalGrammar.load('json')
        
        input_text = '{"name": "Alice", "age": 30}'
        
        # Parse
        ast = grammar.parse(input_text)
        assert ast is not None
        assert ast.type == 'object'
        
        # Generate
        output = grammar.generate(ast)
        assert output is not None
        assert 'Alice' in output
        
        # Validate roundtrip
        assert grammar.validate_roundtrip(input_text)
    
    def test_json_array_roundtrip(self):
        """Test JSON array roundtrip."""
        grammar = BidirectionalGrammar.load('json')
        
        input_text = '[1, 2, 3, "test", true, false, null]'
        
        ast = grammar.parse(input_text)
        assert ast.type == 'array'
        
        output = grammar.generate(ast)
        assert '1' in output
        assert 'test' in output
        
        assert grammar.validate_roundtrip(input_text)
    
    def test_list_available_grammars(self):
        """Test listing available bidirectional grammars."""
        from exonware.xwsyntax import get_bidirectional_registry
        
        registry = get_bidirectional_registry()
        formats = registry.list_formats()
        
        assert 'json' in formats
        assert len(formats) >= 1


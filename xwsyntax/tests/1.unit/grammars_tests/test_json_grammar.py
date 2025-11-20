#exonware/xwsyntax/tests/1.unit/grammars_tests/test_json_grammar.py

"""
Unit tests for JSON grammar.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1
"""

import pytest
from exonware.xwsyntax import BidirectionalGrammar


@pytest.mark.xwsyntax_unit
@pytest.mark.xwsyntax_grammar
class TestJSONGrammar:
    """Unit tests for JSON bidirectional grammar."""
    
    def test_parse_empty_object(self):
        """Test parsing empty JSON object."""
        grammar = BidirectionalGrammar.load('json')
        ast = grammar.parse('{}')
        assert ast.type == 'object'
    
    def test_parse_empty_array(self):
        """Test parsing empty JSON array."""
        grammar = BidirectionalGrammar.load('json')
        ast = grammar.parse('[]')
        assert ast.type == 'array'
    
    def test_parse_string_value(self):
        """Test parsing string values."""
        grammar = BidirectionalGrammar.load('json')
        ast = grammar.parse('{"name": "Alice"}')
        assert ast is not None
    
    def test_parse_number_value(self):
        """Test parsing number values."""
        grammar = BidirectionalGrammar.load('json')
        ast = grammar.parse('{"age": 30}')
        assert ast is not None
    
    def test_parse_boolean_values(self):
        """Test parsing boolean values."""
        grammar = BidirectionalGrammar.load('json')
        ast = grammar.parse('{"active": true, "deleted": false}')
        assert ast is not None
    
    def test_parse_null_value(self):
        """Test parsing null value."""
        grammar = BidirectionalGrammar.load('json')
        ast = grammar.parse('{"value": null}')
        assert ast is not None
    
    def test_parse_nested_objects(self):
        """Test parsing nested objects."""
        grammar = BidirectionalGrammar.load('json')
        ast = grammar.parse('{"user": {"name": "Alice", "age": 30}}')
        assert ast is not None
    
    def test_parse_array_of_objects(self):
        """Test parsing array of objects."""
        grammar = BidirectionalGrammar.load('json')
        ast = grammar.parse('[{"id": 1}, {"id": 2}]')
        assert ast.type == 'array'
    
    def test_generate_empty_object(self):
        """Test generating empty object."""
        grammar = BidirectionalGrammar.load('json')
        ast = grammar.parse('{}')
        output = grammar.generate(ast)
        assert '{}' in output or '{ }' in output
    
    def test_generate_simple_object(self):
        """Test generating simple object."""
        grammar = BidirectionalGrammar.load('json')
        ast = grammar.parse('{"test": "value"}')
        output = grammar.generate(ast)
        assert 'test' in output
        assert 'value' in output
    
    def test_roundtrip_all_types(self):
        """Test roundtrip with all JSON data types."""
        grammar = BidirectionalGrammar.load('json')
        input_text = '{"string": "text", "number": 42, "bool": true, "null": null, "array": [1, 2], "object": {"nested": "value"}}'
        assert grammar.validate_roundtrip(input_text)
    
    @pytest.mark.parametrize("json_text,description", [
        pytest.param('{}', 'empty object', id='empty_obj'),
        pytest.param('[]', 'empty array', id='empty_arr'),
        pytest.param('{"key": "value"}', 'simple object', id='simple_obj'),
        pytest.param('[1, 2, 3]', 'simple array', id='simple_arr'),
        pytest.param('{"nested": {"deep": true}}', 'nested', id='nested'),
    ])
    def test_json_roundtrip_parametrized(self, json_text, description):
        """Test JSON roundtrip with multiple cases."""
        grammar = BidirectionalGrammar.load('json')
        assert grammar.validate_roundtrip(json_text), f"Failed for: {description}"


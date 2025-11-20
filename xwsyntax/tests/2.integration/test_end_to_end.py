#exonware/xwsyntax/tests/2.integration/test_end_to_end.py

"""
End-to-end integration tests for xwsyntax.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1
"""

import pytest
from exonware.xwsyntax import BidirectionalGrammar, SyntaxEngine


@pytest.mark.xwsyntax_integration
class TestEndToEndJSON:
    """End-to-end tests for JSON processing."""
    
    def test_full_json_workflow(self):
        """
        Test complete JSON workflow.
        
        Given: A complex JSON document
        When: Parsing, modifying, and generating
        Then: Output is valid and consistent
        """
        # Given
        grammar = BidirectionalGrammar.load('json')
        input_json = '{"company": "eXonware.com", "products": ["xwnode", "xwdata", "xwsyntax"], "active": true}'
        
        # When - Parse
        ast = grammar.parse(input_json)
        assert ast is not None
        
        # When - Generate
        output = grammar.generate(ast)
        assert output is not None
        
        # Then - Validate
        assert 'eXonware' in output
        assert 'xwsyntax' in output
    
    def test_cross_format_scenario(self):
        """
        Test working with multiple formats.
        
        Given: Multiple grammar formats loaded
        When: Processing different inputs
        Then: Each format works independently
        """
        # Load multiple grammars
        json_grammar = BidirectionalGrammar.load('json')
        sql_grammar = BidirectionalGrammar.load('sql')
        
        # Process JSON
        json_ast = json_grammar.parse('{"test": "json"}')
        json_out = json_grammar.generate(json_ast)
        assert 'json' in json_out
        
        # Process SQL
        sql_ast = sql_grammar.parse('SELECT * FROM test')
        assert sql_ast.type == 'select_statement'


@pytest.mark.xwsyntax_integration
class TestEngineIntegration:
    """Integration tests for SyntaxEngine."""
    
    def test_engine_with_multiple_grammars(self):
        """Test engine can handle multiple grammars."""
        engine = SyntaxEngine()
        
        # Parse JSON
        json_ast = engine.parse('{"test": "data"}', grammar='json')
        assert json_ast.type == 'object'
        
        # Parse SQL
        sql_ast = engine.parse('SELECT * FROM users', grammar='sql')
        assert sql_ast.type == 'select_statement'


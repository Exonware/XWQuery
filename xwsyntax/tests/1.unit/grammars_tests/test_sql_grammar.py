#exonware/xwsyntax/tests/1.unit/grammars_tests/test_sql_grammar.py

"""
Unit tests for SQL grammar.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1
"""

import pytest
from exonware.xwsyntax import BidirectionalGrammar


@pytest.mark.xwsyntax_unit
@pytest.mark.xwsyntax_grammar
class TestSQLGrammar:
    """Unit tests for SQL bidirectional grammar."""
    
    def test_parse_simple_select(self):
        """Test parsing simple SELECT statement."""
        grammar = BidirectionalGrammar.load('sql')
        ast = grammar.parse('SELECT * FROM users')
        assert ast is not None
        assert ast.type == 'select_statement'
    
    def test_parse_select_with_where(self):
        """Test parsing SELECT with WHERE clause."""
        grammar = BidirectionalGrammar.load('sql')
        ast = grammar.parse('SELECT name FROM users WHERE age > 30')
        assert ast.type == 'select_statement'
    
    def test_parse_insert_statement(self):
        """Test parsing INSERT statement."""
        grammar = BidirectionalGrammar.load('sql')
        ast = grammar.parse("INSERT INTO users (name, age) VALUES ('Alice', 30)")
        assert ast.type == 'insert_statement'
    
    def test_parse_update_statement(self):
        """Test parsing UPDATE statement."""
        grammar = BidirectionalGrammar.load('sql')
        ast = grammar.parse("UPDATE users SET age = 31 WHERE name = 'Alice'")
        assert ast.type == 'update_statement'
    
    def test_parse_delete_statement(self):
        """Test parsing DELETE statement."""
        grammar = BidirectionalGrammar.load('sql')
        ast = grammar.parse('DELETE FROM users WHERE age < 18')
        assert ast.type == 'delete_statement'
    
    @pytest.mark.parametrize("sql_query,expected_type", [
        pytest.param('SELECT * FROM users', 'select_statement', id='select'),
        pytest.param("INSERT INTO users (name) VALUES ('Bob')", 'insert_statement', id='insert'),
        pytest.param("UPDATE users SET age = 25", 'update_statement', id='update'),
        pytest.param('DELETE FROM users', 'delete_statement', id='delete'),
    ])
    def test_sql_parsing_parametrized(self, sql_query, expected_type):
        """Test SQL parsing with multiple statement types."""
        grammar = BidirectionalGrammar.load('sql')
        ast = grammar.parse(sql_query)
        assert ast.type == expected_type


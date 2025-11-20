#exonware/xwsyntax/tests/1.unit/optimizations_tests/test_type_index.py

"""
Unit tests for TypeIndex.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1
"""

import pytest
from exonware.xwsyntax.optimizations import TypeIndex


@pytest.mark.xwsyntax_unit
class TestTypeIndex:
    """Unit tests for TypeIndex class."""
    
    def test_create_type_index(self):
        """Test creating TypeIndex instance."""
        index = TypeIndex()
        assert index is not None
    
    def test_index_ast(self, small_ast):
        """Test indexing an AST."""
        index = TypeIndex()
        index.index_ast(small_ast)
        # Should not raise any errors
    
    def test_find_by_type(self, medium_ast):
        """Test finding nodes by type."""
        index = TypeIndex()
        index.index_ast(medium_ast)
        
        # Find string nodes
        results = index.find_by_type('string')
        assert isinstance(results, list)
    
    def test_find_by_type_returns_empty_for_nonexistent(self, small_ast):
        """Test finding nonexistent type returns empty list."""
        index = TypeIndex()
        index.index_ast(small_ast)
        
        results = index.find_by_type('nonexistent_type')
        assert results == []


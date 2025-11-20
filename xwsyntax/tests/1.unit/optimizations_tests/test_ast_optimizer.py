#exonware/xwsyntax/tests/1.unit/optimizations_tests/test_ast_optimizer.py

"""
Unit tests for AST optimizer.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1
"""

import pytest
from exonware.xwsyntax.optimizations import (
    ASTOptimizer,
    BasicAST,
    MediumAST,
    LargeAST,
    UltraLargeAST,
)


@pytest.mark.xwsyntax_unit
class TestASTOptimizer:
    """Unit tests for ASTOptimizer class."""
    
    def test_create_optimizer(self):
        """Test creating AST optimizer."""
        optimizer = ASTOptimizer()
        assert optimizer is not None
    
    def test_optimize_small_ast_auto(self, small_ast):
        """Test automatic optimization for small AST."""
        optimizer = ASTOptimizer()
        optimized = optimizer.optimize(small_ast, mode="auto")
        assert isinstance(optimized, BasicAST)
    
    def test_optimize_medium_ast_auto(self, medium_ast):
        """Test automatic optimization for medium AST."""
        optimizer = ASTOptimizer()
        optimized = optimizer.optimize(medium_ast, mode="auto")
        assert isinstance(optimized, MediumAST)
    
    def test_optimize_large_ast_auto(self, large_ast):
        """Test automatic optimization for large AST."""
        optimizer = ASTOptimizer()
        optimized = optimizer.optimize(large_ast, mode="auto")
        assert isinstance(optimized, (LargeAST, UltraLargeAST))
    
    def test_optimize_manual_basic(self, medium_ast):
        """Test manual basic optimization."""
        optimizer = ASTOptimizer()
        optimized = optimizer.optimize(medium_ast, mode="basic")
        assert isinstance(optimized, BasicAST)
    
    def test_optimize_manual_medium(self, small_ast):
        """Test manual medium optimization."""
        optimizer = ASTOptimizer()
        optimized = optimizer.optimize(small_ast, mode="medium")
        assert isinstance(optimized, MediumAST)
    
    def test_optimize_manual_large(self, small_ast):
        """Test manual large optimization."""
        optimizer = ASTOptimizer()
        optimized = optimizer.optimize(small_ast, mode="large")
        assert isinstance(optimized, LargeAST)


@pytest.mark.xwsyntax_unit
class TestOptimizedAST:
    """Unit tests for OptimizedAST wrappers."""
    
    def test_basic_ast_find_by_type(self, small_ast):
        """Test BasicAST find_by_type."""
        optimizer = ASTOptimizer()
        optimized = optimizer.optimize(small_ast, mode="basic")
        
        # Should work even without optimization
        results = optimized.find_by_type('string')
        assert isinstance(results, list)
    
    def test_medium_ast_has_type_index(self, medium_ast):
        """Test MediumAST has type index."""
        optimizer = ASTOptimizer()
        optimized = optimizer.optimize(medium_ast, mode="medium")
        
        assert hasattr(optimized, '_type_index')
        results = optimized.find_by_type('number')
        assert isinstance(results, list)
    
    def test_large_ast_has_position_index(self, large_ast):
        """Test LargeAST has position index."""
        optimizer = ASTOptimizer()
        optimized = optimizer.optimize(large_ast, mode="large")
        
        assert hasattr(optimized, '_type_index')
        assert hasattr(optimized, '_position_index')


#exonware/xwsyntax/src/exonware/xwsyntax/optimizations/__init__.py
"""
xwnode-powered optimization for AST operations.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
"""

from .ast_optimizer import (
    OptimizationLevel,
    OptimizedAST,
    BasicAST,
    MediumAST,
    LargeAST,
    UltraLargeAST,
    ASTOptimizer,
)
from .type_index import TypeIndex
from .position_index import PositionIndex
from .cache_optimizer import ParserCache, TemplateCache
__all__ = [
    # Optimization levels
    'OptimizationLevel',
    'OptimizedAST',
    'BasicAST',
    'MediumAST',
    'LargeAST',
    'UltraLargeAST',
    'ASTOptimizer',
    # Indexes
    'TypeIndex',
    'PositionIndex',
    # Caches
    'ParserCache',
    'TemplateCache',
]

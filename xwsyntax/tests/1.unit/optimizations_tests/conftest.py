#exonware/xwsyntax/tests/1.unit/optimizations_tests/conftest.py

"""
Optimization test fixtures.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
"""

import pytest
from pathlib import Path
import sys

src_path = Path(__file__).parent.parent.parent.parent / "src"
if str(src_path) not in sys.path:
    sys.path.insert(0, str(src_path))


@pytest.fixture
def small_ast():
    """Create small AST for testing."""
    from exonware.xwsyntax import BidirectionalGrammar
    grammar = BidirectionalGrammar.load('json')
    return grammar.parse('{"small": "ast"}')


@pytest.fixture
def medium_ast():
    """Create medium AST (100-1000 nodes)."""
    from exonware.xwsyntax import BidirectionalGrammar
    grammar = BidirectionalGrammar.load('json')
    items = ','.join([f'{{"id": {i}}}' for i in range(120)])
    return grammar.parse(f'{{"items": [{items}]}}')


@pytest.fixture
def large_ast():
    """Create large AST (>1000 nodes)."""
    from exonware.xwsyntax import BidirectionalGrammar
    grammar = BidirectionalGrammar.load('json')
    items = ','.join([f'{{"id": {i}, "data": "value_{i}"}}' for i in range(600)])
    return grammar.parse(f'{{"items": [{items}]}}')


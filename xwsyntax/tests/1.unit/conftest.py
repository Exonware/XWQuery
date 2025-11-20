#exonware/xwsyntax/tests/1.unit/conftest.py

"""
Unit test fixtures for xwsyntax.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
"""

import pytest
from pathlib import Path
import sys

# Ensure src is in path
src_path = Path(__file__).parent.parent.parent / "src"
if str(src_path) not in sys.path:
    sys.path.insert(0, str(src_path))


@pytest.fixture
def sample_json_ast():
    """Sample JSON AST for testing."""
    from exonware.xwsyntax import BidirectionalGrammar
    grammar = BidirectionalGrammar.load('json')
    return grammar.parse('{"test": "data", "number": 42}')


@pytest.fixture
def sample_sql_text():
    """Sample SQL query text."""
    return "SELECT name, age FROM users WHERE age > 30"


@pytest.fixture
def large_json_text():
    """Large JSON for optimization testing."""
    items = ','.join([f'{{"id": {i}, "value": "item_{i}"}}' for i in range(150)])
    return f'{{"items": [{items}]}}'


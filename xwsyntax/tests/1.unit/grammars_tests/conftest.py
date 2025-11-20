#exonware/xwsyntax/tests/1.unit/grammars_tests/conftest.py

"""
Grammar test fixtures.

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
def json_test_cases():
    """JSON test cases."""
    return [
        ('{}', 'empty object'),
        ('[]', 'empty array'),
        ('{"key": "value"}', 'simple object'),
        ('[1, 2, 3]', 'simple array'),
        ('{"nested": {"deep": true}}', 'nested object'),
        ('{"array": [1, 2, {"inner": "value"}]}', 'mixed structure'),
    ]


@pytest.fixture
def sql_test_cases():
    """SQL test cases."""
    return [
        ('SELECT * FROM users', 'simple select'),
        ('SELECT name, age FROM users WHERE age > 30', 'select with where'),
        ('INSERT INTO users (name) VALUES (\'Alice\')', 'simple insert'),
        ('UPDATE users SET age = 31 WHERE name = \'Alice\'', 'simple update'),
        ('DELETE FROM users WHERE age < 18', 'simple delete'),
    ]


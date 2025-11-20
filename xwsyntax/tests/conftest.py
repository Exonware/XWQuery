#exonware/xwsyntax/tests/conftest.py

"""
Pytest configuration and fixtures for xwsyntax tests.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1
"""

import pytest
from pathlib import Path
import sys

# Ensure src is in path for imports
src_path = Path(__file__).parent.parent / "src"
if str(src_path) not in sys.path:
    sys.path.insert(0, str(src_path))


@pytest.fixture
def simple_json_data():
    """Simple JSON test data."""
    return '{"name": "Alice", "age": 30, "city": "New York"}'


@pytest.fixture
def nested_json_data():
    """Complex nested JSON test data."""
    return '''{
  "users": [
    {
      "id": 1,
      "name": "Alice",
      "profile": {
        "email": "alice@example.com",
        "preferences": {"theme": "dark"}
      }
    }
  ],
  "metadata": {
    "version": "1.0",
    "created": "2024-01-01"
  }
}'''


@pytest.fixture
def simple_sql_query():
    """Simple SQL query."""
    return "SELECT * FROM users WHERE age > 30"


@pytest.fixture
def complex_sql_query():
    """Complex SQL query with JOIN."""
    return "SELECT u.name, o.total FROM users u JOIN orders o ON u.id = o.user_id WHERE o.total > 100"


@pytest.fixture
def simple_python_code():
    """Simple Python code."""
    return '''def hello(name):
    return f"Hello, {name}!"'''


@pytest.fixture
def test_data_dir():
    """Get the test data directory."""
    return Path(__file__).parent / "0.core" / "data"


@pytest.fixture
def temp_test_dir(tmp_path):
    """Create a temporary directory for test files."""
    test_dir = tmp_path / "test_data"
    test_dir.mkdir()
    return test_dir


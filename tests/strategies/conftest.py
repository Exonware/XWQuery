#!/usr/bin/env python3
"""
#exonware/xwquery/tests/strategies/conftest.py

Shared fixtures for strategy tests.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1
Generation Date: 28-Oct-2025
"""

import pytest
from pathlib import Path


@pytest.fixture
def test_data_dir():
    """Get test data directory."""
    return Path(__file__).parent / "data"


@pytest.fixture
def sample_queries_dir():
    """Get sample queries directory."""
    return Path(__file__).parent / "sample_queries"


@pytest.fixture
def benchmark_queries():
    """Get benchmark queries for performance testing."""
    return {
        'simple': "SELECT name FROM users",
        'complex': "SELECT u.name, COUNT(o.id) FROM users u JOIN orders o ON u.id = o.user_id GROUP BY u.name HAVING COUNT(o.id) > 5 ORDER BY u.name LIMIT 10",
        'nested': "SELECT * FROM (SELECT id, name FROM users WHERE age > 18) AS adults WHERE name LIKE 'A%'"
    }

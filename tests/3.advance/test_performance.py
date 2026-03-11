#!/usr/bin/env python3
"""
#exonware/xwquery/tests/3.advance/test_performance.py
Performance benchmarks for xwquery.
Priority #4: Performance Excellence
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.0.1
Generation Date: 07-Jan-2025
"""

import pytest
import time
from exonware.xwquery import XWQuery
@pytest.mark.xwquery_advance
@pytest.mark.xwquery_performance

class TestQueryParsingPerformance:
    """Performance tests for query parsing."""

    def test_sql_parsing_performance(self):
        """Test SQL query parsing performance."""
        query_str = "SELECT name, age FROM users WHERE age > 25"
        # Test parsing performance
        start = time.time()
        for _ in range(1000):
            query = XWQuery(query_str)
        elapsed = time.time() - start
        # 1000 parses should complete in < 2 seconds
        assert elapsed < 2.0, f"SQL parsing too slow: {elapsed:.3f}s for 1000 queries"

    def test_complex_query_parsing(self):
        """Test complex query parsing performance."""
        complex_query = """
        SELECT u.name, u.age, p.title 
        FROM users u 
        JOIN posts p ON u.id = p.user_id 
        WHERE u.age > 25 AND p.published = true 
        ORDER BY u.age DESC 
        LIMIT 10
        """
        start = time.time()
        for _ in range(100):
            query = XWQuery(complex_query)
        elapsed = time.time() - start
        # 100 complex parses should complete in < 1 second
        assert elapsed < 1.0, f"Complex query parsing too slow: {elapsed:.3f}s"
@pytest.mark.xwquery_advance
@pytest.mark.xwquery_performance

class TestFormatConversionPerformance:
    """Performance tests for format conversion."""

    def test_sql_to_graphql_conversion(self):
        """Test SQL to GraphQL conversion performance."""
        sql_query = "SELECT name, age FROM users WHERE age > 25"
        query = XWQuery(sql_query)
        start = time.time()
        for _ in range(100):
            graphql = query.to_graphql()
        elapsed = time.time() - start
        # 100 conversions should complete in < 1 second
        assert elapsed < 1.0, f"Format conversion too slow: {elapsed:.3f}s"

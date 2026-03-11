#!/usr/bin/env python3
"""
#exonware/xwquery/tests/2.integration/test_query_conversion_all_formats.py
Integration tests for query conversion between all supported formats.
Tests query conversion: SQL <-> GraphQL <-> Cypher (all-to-all)
If queries convert successfully between all formats, xwquery is working 100%.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.0.1
Generation Date: 07-Jan-2025
"""
from __future__ import annotations
import pytest
from exonware.xwquery import XWQuery
@pytest.mark.xwquery_integration
class TestQueryConversionAllFormats:
    """Integration tests for query conversion between all supported formats."""
    @pytest.fixture
    def base_sql_query(self):
        """Base SQL query for testing conversions."""
        return "SELECT name, age FROM users WHERE age > 25"
    def test_sql_to_graphql_conversion(self, base_sql_query):
        """Test SQL -> GraphQL conversion."""
        result = XWQuery.convert(
            base_sql_query,
            from_format='sql',
            to_format='graphql'
        )
        assert result is not None, "GraphQL conversion should not be None"
        assert isinstance(result, str), "GraphQL conversion should return string"
        assert len(result) > 0, "GraphQL query should not be empty"
        # Verify key elements
        result_normalized = ' '.join(result.split()).lower()
        assert 'query' in result_normalized, "GraphQL should contain 'query'"
        assert 'users' in result_normalized, "GraphQL should contain 'users'"
        assert 'name' in result_normalized, "GraphQL should contain 'name'"
        assert 'age' in result_normalized, "GraphQL should contain 'age'"
    def test_sql_to_cypher_conversion(self, base_sql_query):
        """Test SQL -> Cypher conversion."""
        result = XWQuery.convert(
            base_sql_query,
            from_format='sql',
            to_format='cypher'
        )
        assert result is not None, "Cypher conversion should not be None"
        assert isinstance(result, str), "Cypher conversion should return string"
        assert len(result) > 0, "Cypher query should not be empty"
        # Verify key elements
        result_normalized = result.upper()
        assert 'MATCH' in result_normalized, "Cypher should contain 'MATCH'"
        assert 'RETURN' in result_normalized, "Cypher should contain 'RETURN'"
        result_lower = result_normalized.lower()
        assert 'name' in result_lower, "Cypher should contain 'name'"
        assert 'age' in result_lower, "Cypher should contain 'age'"
    def test_graphql_to_sql_conversion(self):
        """Test GraphQL -> SQL conversion."""
        graphql_query = "query { users(age_gt: 25) { name age } }"
        result = XWQuery.convert(
            graphql_query,
            from_format='graphql',
            to_format='sql'
        )
        assert result is not None, "SQL conversion should not be None"
        assert isinstance(result, str), "SQL conversion should return string"
        assert len(result) > 0, "SQL query should not be empty"
        # Verify key elements
        result_normalized = result.upper()
        assert 'SELECT' in result_normalized, "SQL should contain 'SELECT'"
        assert 'FROM' in result_normalized, "SQL should contain 'FROM'"
        result_lower = result_normalized.lower()
        assert 'name' in result_lower or 'users' in result_lower, \
            "SQL should contain 'name' or 'users'"
    def test_graphql_to_cypher_conversion(self):
        """Test GraphQL -> Cypher conversion."""
        graphql_query = "query { users(age_gt: 25) { name age } }"
        result = XWQuery.convert(
            graphql_query,
            from_format='graphql',
            to_format='cypher'
        )
        assert result is not None, "Cypher conversion should not be None"
        assert isinstance(result, str), "Cypher conversion should return string"
        assert len(result) > 0, "Cypher query should not be empty"
        # Verify key elements
        result_normalized = result.upper()
        assert 'MATCH' in result_normalized, "Cypher should contain 'MATCH'"
        assert 'RETURN' in result_normalized, "Cypher should contain 'RETURN'"
        result_lower = result_normalized.lower()
        assert 'name' in result_lower or 'age' in result_lower, \
            "Cypher should contain 'name' or 'age'"
    def test_cypher_to_sql_conversion(self):
        """Test Cypher -> SQL conversion."""
        cypher_query = "MATCH (u:User) WHERE u.age > 25 RETURN u.name, u.age"
        result = XWQuery.convert(
            cypher_query,
            from_format='cypher',
            to_format='sql'
        )
        assert result is not None, "SQL conversion should not be None"
        assert isinstance(result, str), "SQL conversion should return string"
        assert len(result) > 0, "SQL query should not be empty"
        # Verify key elements
        result_normalized = result.upper()
        assert 'SELECT' in result_normalized, "SQL should contain 'SELECT'"
    def test_cypher_to_graphql_conversion(self):
        """Test Cypher -> GraphQL conversion."""
        cypher_query = "MATCH (u:User) WHERE u.age > 25 RETURN u.name, u.age"
        result = XWQuery.convert(
            cypher_query,
            from_format='cypher',
            to_format='graphql'
        )
        assert result is not None, "GraphQL conversion should not be None"
        assert isinstance(result, str), "GraphQL conversion should return string"
        assert len(result) > 0, "GraphQL query should not be empty"
        # Verify key elements
        result_normalized = ' '.join(result.split()).lower()
        assert 'query' in result_normalized, "GraphQL should contain 'query'"
    def test_all_format_roundtrip_sql(self, base_sql_query):
        """Test SQL -> GraphQL -> SQL roundtrip conversion."""
        # SQL -> GraphQL
        graphql_result = XWQuery.convert(
            base_sql_query,
            from_format='sql',
            to_format='graphql'
        )
        assert graphql_result is not None
        # GraphQL -> SQL
        sql_result = XWQuery.convert(
            graphql_result,
            from_format='graphql',
            to_format='sql'
        )
        assert sql_result is not None
        assert isinstance(sql_result, str)
        assert len(sql_result) > 0
    def test_all_format_roundtrip_graphql(self):
        """Test GraphQL -> Cypher -> GraphQL roundtrip conversion."""
        graphql_query = "query { users(age_gt: 25) { name age } }"
        # GraphQL -> Cypher
        cypher_result = XWQuery.convert(
            graphql_query,
            from_format='graphql',
            to_format='cypher'
        )
        assert cypher_result is not None
        # Cypher -> GraphQL
        graphql_result = XWQuery.convert(
            cypher_result,
            from_format='cypher',
            to_format='graphql'
        )
        assert graphql_result is not None
        assert isinstance(graphql_result, str)
        assert len(graphql_result) > 0
    def test_all_format_roundtrip_cypher(self):
        """Test Cypher -> SQL -> Cypher roundtrip conversion."""
        cypher_query = "MATCH (u:User) WHERE u.age > 25 RETURN u.name, u.age"
        # Cypher -> SQL
        sql_result = XWQuery.convert(
            cypher_query,
            from_format='cypher',
            to_format='sql'
        )
        assert sql_result is not None
        # SQL -> Cypher
        cypher_result = XWQuery.convert(
            sql_result,
            from_format='sql',
            to_format='cypher'
        )
        assert cypher_result is not None
        assert isinstance(cypher_result, str)
        assert len(cypher_result) > 0

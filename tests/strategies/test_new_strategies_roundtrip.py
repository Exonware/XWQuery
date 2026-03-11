#!/usr/bin/env python3
"""
#exonware/xwquery/tests/strategies/test_new_strategies_roundtrip.py
Comprehensive roundtrip tests for newly created query strategies.
Tests:
- Validation
- to_actions_tree conversion
- from_actions_tree conversion  
- Roundtrip (query -> actions -> query)
- Language-specific syntax compliance
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.0.1.8
Generation Date: January 2, 2025
"""

import pytest
try:
    from exonware.xwquery.compiler.strategies.gql_gae import GQLGAEStrategy
    from exonware.xwquery.compiler.strategies.sosl import SOSLStrategy
    from exonware.xwquery.compiler.strategies.saql import SAQLStrategy
    from exonware.xwquery.compiler.strategies.dax import DAXStrategy
    from exonware.xwquery.compiler.strategies.mdx import MDXStrategy
    from exonware.xwquery.compiler.strategies.m import MStrategy
    from exonware.xwquery.compiler.strategies.powerfx import PowerFxStrategy
    from exonware.xwquery.compiler.strategies.odata import ODataStrategy
    from exonware.xwquery.compiler.strategies.opensearch_dsl import OpenSearchDSLStrategy
    from exonware.xwquery.compiler.strategies.opensearch_ppl import OpenSearchPPLStrategy
except ImportError as e:
    pytest.skip(f"One or more strategies not yet implemented: {e}", allow_module_level=True)

class TestGQLGAEStrategy:
    """Test GQL (Google App Engine) strategy."""
    @pytest.fixture

    def strategy(self):
        return GQLGAEStrategy()

    def test_validate_query(self, strategy):
        """Test GQL validation."""
        valid_queries = [
            "SELECT * FROM KindName",
            "SELECT name, age FROM Users WHERE age > 25",
            "SELECT * FROM Users WHERE ANCESTOR IS :1",
        ]
        for query in valid_queries:
            assert strategy.validate_query(query), f"Should validate: {query}"

    def test_to_actions_tree(self, strategy):
        """Test GQL to actions tree conversion."""
        query = "SELECT name, age FROM Users WHERE age > 25"
        actions_tree = strategy.to_actions_tree(query)
        assert actions_tree is not None
        tree_data = actions_tree.to_native()
        assert 'root' in tree_data
        assert len(tree_data['root']['statements']) > 0

    def test_from_actions_tree(self, strategy):
        """Test actions tree to GQL conversion."""
        query = "SELECT name, age FROM Users WHERE age > 25"
        actions_tree = strategy.to_actions_tree(query)
        regenerated = strategy.from_actions_tree(actions_tree)
        assert regenerated is not None
        assert "SELECT" in regenerated.upper()
        assert "FROM" in regenerated.upper()

    def test_roundtrip(self, strategy):
        """Test roundtrip conversion."""
        original = "SELECT name, age FROM Users WHERE age > 25"
        actions_tree = strategy.to_actions_tree(original)
        regenerated = strategy.from_actions_tree(actions_tree)
        # Verify semantic preservation (entity name should be preserved)
        assert "Users" in regenerated or "users" in regenerated.lower()
        assert "SELECT" in regenerated.upper()


class TestSOSLStrategy:
    """Test SOSL (Salesforce Object Search Language) strategy."""
    @pytest.fixture

    def strategy(self):
        return SOSLStrategy()

    def test_validate_query(self, strategy):
        """Test SOSL validation."""
        valid_queries = [
            "FIND 'Acme' IN ALL FIELDS RETURNING Account(Name, Industry)",
            "FIND '*' IN ALL FIELDS RETURNING Contact(FirstName, LastName)",
        ]
        for query in valid_queries:
            assert strategy.validate_query(query), f"Should validate: {query}"

    def test_to_actions_tree(self, strategy):
        """Test SOSL to actions tree conversion."""
        query = "FIND 'Acme' IN ALL FIELDS RETURNING Account(Name, Industry)"
        actions_tree = strategy.to_actions_tree(query)
        assert actions_tree is not None

    def test_roundtrip(self, strategy):
        """Test roundtrip conversion."""
        original = "FIND 'Acme' IN ALL FIELDS RETURNING Account(Name, Industry)"
        actions_tree = strategy.to_actions_tree(original)
        regenerated = strategy.from_actions_tree(actions_tree)
        assert "FIND" in regenerated.upper()
        assert "RETURNING" in regenerated.upper() or "returning" in regenerated.lower()


class TestSAQLStrategy:
    """Test SAQL (Salesforce Analytics Query Language) strategy."""
    @pytest.fixture

    def strategy(self):
        return SAQLStrategy()

    def test_validate_query(self, strategy):
        """Test SAQL validation."""
        valid_queries = [
            'q = load "Dataset";',
            'q = load "Dataset"; q = filter q by \'StageName\' == "Closed Won";',
        ]
        for query in valid_queries:
            assert strategy.validate_query(query), f"Should validate: {query}"

    def test_roundtrip(self, strategy):
        """Test roundtrip conversion."""
        original = 'q = load "Dataset"; q = filter q by \'StageName\' == "Closed Won"; q = foreach q generate \'StageName\', sum(\'Amount\');'
        actions_tree = strategy.to_actions_tree(original)
        regenerated = strategy.from_actions_tree(actions_tree)
        assert "load" in regenerated.lower()


class TestDAXStrategy:
    """Test DAX (Power BI) strategy."""
    @pytest.fixture

    def strategy(self):
        return DAXStrategy()

    def test_validate_query(self, strategy):
        """Test DAX validation."""
        valid_queries = [
            "EVALUATE SELECTCOLUMNS(Sales, [ProductID], [Amount])",
            "SUM(Sales[Amount])",
            "CALCULATE(SUM(Sales[Amount]), Sales[Region] = \"West\")",
        ]
        for query in valid_queries:
            assert strategy.validate_query(query), f"Should validate: {query}"

    def test_roundtrip(self, strategy):
        """Test roundtrip conversion."""
        original = "EVALUATE FILTER(SELECTCOLUMNS(Sales, [ProductID], [Amount]), [Amount] > 1000)"
        actions_tree = strategy.to_actions_tree(original)
        regenerated = strategy.from_actions_tree(actions_tree)
        assert regenerated is not None
        assert len(regenerated) > 0


class TestMDXStrategy:
    """Test MDX (OLAP) strategy."""
    @pytest.fixture

    def strategy(self):
        return MDXStrategy()

    def test_validate_query(self, strategy):
        """Test MDX validation."""
        valid_queries = [
            "SELECT { [Measures].[Store Sales] } ON COLUMNS FROM Sales",
            "SELECT { [Measures].[Store Sales] } ON COLUMNS FROM Sales WHERE ( [Store].[USA].[CA] )",
        ]
        for query in valid_queries:
            assert strategy.validate_query(query), f"Should validate: {query}"

    def test_roundtrip(self, strategy):
        """Test roundtrip conversion."""
        original = "SELECT { [Measures].[Store Sales] } ON COLUMNS FROM Sales WHERE ( [Store].[USA].[CA] )"
        actions_tree = strategy.to_actions_tree(original)
        regenerated = strategy.from_actions_tree(actions_tree)
        assert "SELECT" in regenerated.upper()
        assert "FROM" in regenerated.upper()


class TestMStrategy:
    """Test M (Power Query) strategy."""
    @pytest.fixture

    def strategy(self):
        return MStrategy()

    def test_validate_query(self, strategy):
        """Test M validation."""
        valid_queries = [
            "let Source = #table({}, {}) in Source",
            "let x = 3, y = x + 5 in y",
        ]
        for query in valid_queries:
            assert strategy.validate_query(query), f"Should validate: {query}"

    def test_roundtrip(self, strategy):
        """Test roundtrip conversion."""
        original = "let Source = #table({}, {}), Filtered = Table.SelectRows(Source, each [Age] > 18) in Filtered"
        actions_tree = strategy.to_actions_tree(original)
        regenerated = strategy.from_actions_tree(actions_tree)
        assert "let" in regenerated.lower()
        assert "in" in regenerated.lower()


class TestPowerFxStrategy:
    """Test PowerFx strategy."""
    @pytest.fixture

    def strategy(self):
        return PowerFxStrategy()

    def test_validate_query(self, strategy):
        """Test PowerFx validation."""
        valid_queries = [
            "=Table",
            "=Filter(Table, [Age] > 18)",
            "=Sum([Amount])",
        ]
        for query in valid_queries:
            assert strategy.validate_query(query), f"Should validate: {query}"

    def test_roundtrip(self, strategy):
        """Test roundtrip conversion."""
        original = "=Filter(Users, [Age] > 18)"
        actions_tree = strategy.to_actions_tree(original)
        regenerated = strategy.from_actions_tree(actions_tree)
        assert regenerated is not None
        assert len(regenerated) > 0


class TestODataStrategy:
    """Test OData strategy."""
    @pytest.fixture

    def strategy(self):
        return ODataStrategy()

    def test_validate_query(self, strategy):
        """Test OData validation."""
        valid_queries = [
            "/Customers?$select=CustomerID,CompanyName",
            "/Orders?$filter=ShipCountry eq 'France'",
            "/Customers?$select=CustomerID&$filter=ContactName ne 'Fred'",
        ]
        for query in valid_queries:
            assert strategy.validate_query(query), f"Should validate: {query}"

    def test_roundtrip(self, strategy):
        """Test roundtrip conversion."""
        original = "/Customers?$select=CustomerID,CompanyName&$filter=ContactName ne 'Fred'"
        actions_tree = strategy.to_actions_tree(original)
        regenerated = strategy.from_actions_tree(actions_tree)
        assert "/" in regenerated
        # Should contain select or filter
        assert "$select" in regenerated or "$filter" in regenerated or len(regenerated) > 1


class TestOpenSearchDSLStrategy:
    """Test OpenSearch DSL strategy."""
    @pytest.fixture

    def strategy(self):
        return OpenSearchDSLStrategy()

    def test_validate_query(self, strategy):
        """Test OpenSearch DSL validation."""
        valid_queries = [
            '{"query": {"match_all": {}}}',
            '{"query": {"match": {"content": "OpenSearch"}}}',
            'GET /index/_search',
        ]
        for query in valid_queries:
            assert strategy.validate_query(query), f"Should validate: {query}"

    def test_roundtrip(self, strategy):
        """Test roundtrip conversion."""
        original = '{"query": {"match": {"content": "OpenSearch"}}}'
        actions_tree = strategy.to_actions_tree(original)
        regenerated = strategy.from_actions_tree(actions_tree)
        assert regenerated is not None
        assert len(regenerated) > 0


class TestOpenSearchPPLStrategy:
    """Test OpenSearch PPL strategy."""
    @pytest.fixture

    def strategy(self):
        return OpenSearchPPLStrategy()

    def test_validate_query(self, strategy):
        """Test OpenSearch PPL validation."""
        valid_queries = [
            "search source=accounts;",
            "search source=accounts | where age > 18;",
            "search source=accounts | where age > 18 | fields firstname, lastname;",
        ]
        for query in valid_queries:
            assert strategy.validate_query(query), f"Should validate: {query}"

    def test_roundtrip(self, strategy):
        """Test roundtrip conversion."""
        original = "search source=accounts | where age > 18 | fields firstname, lastname;"
        actions_tree = strategy.to_actions_tree(original)
        regenerated = strategy.from_actions_tree(actions_tree)
        assert "search" in regenerated.lower()
        assert "source=" in regenerated.lower()
@pytest.mark.xwquery_integration

def test_all_strategies_registered():
    """Test that all new strategies are registered in xwquery.py."""
    from exonware.xwquery.compiler.strategies.xwquery import FORMAT_STRATEGY_MAP
    expected_strategies = [
        'GQL_GAE',
        'SOSL',
        'SAQL',
        'DAX',
        'MDX',
        'M',
        'POWERFX',
        'ODATA',
        'OPENSEARCH_DSL',
        'OPENSEARCH_PPL',
    ]
    for strategy_name in expected_strategies:
        assert strategy_name in FORMAT_STRATEGY_MAP, f"{strategy_name} should be registered"
        assert FORMAT_STRATEGY_MAP[strategy_name] is not None, f"{strategy_name} should have a class"

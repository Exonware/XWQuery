#!/usr/bin/env python3
"""
#exonware/xwquery/tests/strategies/test_new_strategies_xwquery_integration.py
Integration tests for newly created query strategies with XWQueryScript.
Tests full roundtrip: Query -> Actions Tree -> XWQueryScript -> Actions Tree -> Query
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
    from exonware.xwquery.compiler.strategies.xwquery import XWQueryScriptStrategy
except ImportError as e:
    pytest.skip(f"One or more strategies not yet implemented: {e}", allow_module_level=True)
@pytest.mark.xwquery_integration

class TestGQLGAEIntegration:
    """Test GQL (Google App Engine) integration with XWQueryScript."""
    @pytest.fixture

    def strategy(self):
        return GQLGAEStrategy()
    @pytest.fixture

    def xwquery_strategy(self):
        return XWQueryScriptStrategy()

    def test_full_roundtrip_through_xwquery(self, strategy, xwquery_strategy):
        """Test: GQL -> Actions -> XWQuery -> Actions -> GQL"""
        original = "SELECT name, age FROM Users WHERE age > 25"
        # Step 1: Convert to Actions Tree
        actions_tree = strategy.to_actions_tree(original)
        assert actions_tree is not None
        # Step 2: Convert Actions Tree to XWQueryScript
        xwquery_script = xwquery_strategy.from_actions_tree(actions_tree)
        assert xwquery_script is not None
        assert len(xwquery_script) > 0
        # Step 3: Parse XWQueryScript back to Actions Tree
        parsed_xwquery = xwquery_strategy.to_actions_tree(xwquery_script)
        assert parsed_xwquery is not None
        # Step 4: Convert Actions Tree back to GQL
        regenerated = strategy.from_actions_tree(parsed_xwquery)
        assert regenerated is not None
        assert "SELECT" in regenerated.upper()
        assert "FROM" in regenerated.upper()
@pytest.mark.xwquery_integration

class TestSOSLIntegration:
    """Test SOSL integration with XWQueryScript."""
    @pytest.fixture

    def strategy(self):
        return SOSLStrategy()
    @pytest.fixture

    def xwquery_strategy(self):
        return XWQueryScriptStrategy()

    def test_full_roundtrip_through_xwquery(self, strategy, xwquery_strategy):
        """Test: SOSL -> Actions -> XWQuery -> Actions -> SOSL"""
        original = "FIND 'Acme' IN ALL FIELDS RETURNING Account(Name, Industry)"
        actions_tree = strategy.to_actions_tree(original)
        xwquery_script = xwquery_strategy.from_actions_tree(actions_tree)
        parsed_xwquery = xwquery_strategy.to_actions_tree(xwquery_script)
        regenerated = strategy.from_actions_tree(parsed_xwquery)
        assert regenerated is not None
        assert "FIND" in regenerated.upper() or "find" in regenerated.lower()
@pytest.mark.xwquery_integration

class TestSAQLIntegration:
    """Test SAQL integration with XWQueryScript."""
    @pytest.fixture

    def strategy(self):
        return SAQLStrategy()
    @pytest.fixture

    def xwquery_strategy(self):
        return XWQueryScriptStrategy()

    def test_full_roundtrip_through_xwquery(self, strategy, xwquery_strategy):
        """Test: SAQL -> Actions -> XWQuery -> Actions -> SAQL"""
        original = 'q = load "Dataset"; q = filter q by \'StageName\' == "Closed Won";'
        actions_tree = strategy.to_actions_tree(original)
        xwquery_script = xwquery_strategy.from_actions_tree(actions_tree)
        parsed_xwquery = xwquery_strategy.to_actions_tree(xwquery_script)
        regenerated = strategy.from_actions_tree(parsed_xwquery)
        assert regenerated is not None
        assert len(regenerated) > 0
@pytest.mark.xwquery_integration

class TestDAXIntegration:
    """Test DAX integration with XWQueryScript."""
    @pytest.fixture

    def strategy(self):
        return DAXStrategy()
    @pytest.fixture

    def xwquery_strategy(self):
        return XWQueryScriptStrategy()

    def test_full_roundtrip_through_xwquery(self, strategy, xwquery_strategy):
        """Test: DAX -> Actions -> XWQuery -> Actions -> DAX"""
        original = "EVALUATE FILTER(SELECTCOLUMNS(Sales, [ProductID], [Amount]), [Amount] > 1000)"
        actions_tree = strategy.to_actions_tree(original)
        xwquery_script = xwquery_strategy.from_actions_tree(actions_tree)
        parsed_xwquery = xwquery_strategy.to_actions_tree(xwquery_script)
        regenerated = strategy.from_actions_tree(parsed_xwquery)
        assert regenerated is not None
        assert len(regenerated) > 0
@pytest.mark.xwquery_integration

class TestMDXIntegration:
    """Test MDX integration with XWQueryScript."""
    @pytest.fixture

    def strategy(self):
        return MDXStrategy()
    @pytest.fixture

    def xwquery_strategy(self):
        return XWQueryScriptStrategy()

    def test_full_roundtrip_through_xwquery(self, strategy, xwquery_strategy):
        """Test: MDX -> Actions -> XWQuery -> Actions -> MDX"""
        original = "SELECT { [Measures].[Store Sales] } ON COLUMNS FROM Sales WHERE ( [Store].[USA].[CA] )"
        actions_tree = strategy.to_actions_tree(original)
        xwquery_script = xwquery_strategy.from_actions_tree(actions_tree)
        parsed_xwquery = xwquery_strategy.to_actions_tree(xwquery_script)
        regenerated = strategy.from_actions_tree(parsed_xwquery)
        assert regenerated is not None
        assert "SELECT" in regenerated.upper()
@pytest.mark.xwquery_integration

class TestMIntegration:
    """Test M (Power Query) integration with XWQueryScript."""
    @pytest.fixture

    def strategy(self):
        return MStrategy()
    @pytest.fixture

    def xwquery_strategy(self):
        return XWQueryScriptStrategy()

    def test_full_roundtrip_through_xwquery(self, strategy, xwquery_strategy):
        """Test: M -> Actions -> XWQuery -> Actions -> M"""
        original = "let Source = #table({}, {}), Filtered = Table.SelectRows(Source, each [Age] > 18) in Filtered"
        actions_tree = strategy.to_actions_tree(original)
        xwquery_script = xwquery_strategy.from_actions_tree(actions_tree)
        parsed_xwquery = xwquery_strategy.to_actions_tree(xwquery_script)
        regenerated = strategy.from_actions_tree(parsed_xwquery)
        assert regenerated is not None
        assert len(regenerated) > 0
@pytest.mark.xwquery_integration

class TestPowerFxIntegration:
    """Test PowerFx integration with XWQueryScript."""
    @pytest.fixture

    def strategy(self):
        return PowerFxStrategy()
    @pytest.fixture

    def xwquery_strategy(self):
        return XWQueryScriptStrategy()

    def test_full_roundtrip_through_xwquery(self, strategy, xwquery_strategy):
        """Test: PowerFx -> Actions -> XWQuery -> Actions -> PowerFx"""
        original = "=Filter(Users, [Age] > 18)"
        actions_tree = strategy.to_actions_tree(original)
        xwquery_script = xwquery_strategy.from_actions_tree(actions_tree)
        parsed_xwquery = xwquery_strategy.to_actions_tree(xwquery_script)
        regenerated = strategy.from_actions_tree(parsed_xwquery)
        assert regenerated is not None
        assert len(regenerated) > 0
@pytest.mark.xwquery_integration

class TestODataIntegration:
    """Test OData integration with XWQueryScript."""
    @pytest.fixture

    def strategy(self):
        return ODataStrategy()
    @pytest.fixture

    def xwquery_strategy(self):
        return XWQueryScriptStrategy()

    def test_full_roundtrip_through_xwquery(self, strategy, xwquery_strategy):
        """Test: OData -> Actions -> XWQuery -> Actions -> OData"""
        original = "/Customers?$select=CustomerID,CompanyName&$filter=ContactName ne 'Fred'"
        actions_tree = strategy.to_actions_tree(original)
        xwquery_script = xwquery_strategy.from_actions_tree(actions_tree)
        parsed_xwquery = xwquery_strategy.to_actions_tree(xwquery_script)
        regenerated = strategy.from_actions_tree(parsed_xwquery)
        assert regenerated is not None
        assert len(regenerated) > 0
@pytest.mark.xwquery_integration

class TestOpenSearchDSLIntegration:
    """Test OpenSearch DSL integration with XWQueryScript."""
    @pytest.fixture

    def strategy(self):
        return OpenSearchDSLStrategy()
    @pytest.fixture

    def xwquery_strategy(self):
        return XWQueryScriptStrategy()

    def test_full_roundtrip_through_xwquery(self, strategy, xwquery_strategy):
        """Test: OpenSearch DSL -> Actions -> XWQuery -> Actions -> OpenSearch DSL"""
        original = '{"query": {"match": {"content": "OpenSearch"}}}'
        actions_tree = strategy.to_actions_tree(original)
        xwquery_script = xwquery_strategy.from_actions_tree(actions_tree)
        parsed_xwquery = xwquery_strategy.to_actions_tree(xwquery_script)
        regenerated = strategy.from_actions_tree(parsed_xwquery)
        assert regenerated is not None
        assert len(regenerated) > 0
@pytest.mark.xwquery_integration

class TestOpenSearchPPLIntegration:
    """Test OpenSearch PPL integration with XWQueryScript."""
    @pytest.fixture

    def strategy(self):
        return OpenSearchPPLStrategy()
    @pytest.fixture

    def xwquery_strategy(self):
        return XWQueryScriptStrategy()

    def test_full_roundtrip_through_xwquery(self, strategy, xwquery_strategy):
        """Test: OpenSearch PPL -> Actions -> XWQuery -> Actions -> OpenSearch PPL"""
        original = "search source=accounts | where age > 18 | fields firstname, lastname;"
        actions_tree = strategy.to_actions_tree(original)
        xwquery_script = xwquery_strategy.from_actions_tree(actions_tree)
        parsed_xwquery = xwquery_strategy.to_actions_tree(xwquery_script)
        regenerated = strategy.from_actions_tree(parsed_xwquery)
        assert regenerated is not None
        assert "search" in regenerated.lower() or "Search" in regenerated

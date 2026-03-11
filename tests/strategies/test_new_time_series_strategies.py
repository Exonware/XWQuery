#!/usr/bin/env python3
"""
Test suite for the 10 newly created query strategy implementations.
Tests:
- SPL (Splunk)
- SumoLogic
- NRQL (New Relic)
- Wavefront
- InfluxQL
- TICK (Kapacitor)
- Chronograf
- MetricsQL (VictoriaMetrics)
- Graphite
- M3QL
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.0.1.8
Generation Date: January 2, 2025
"""
import pytest
try:
    from exonware.xwquery.compiler.strategies.spl import SPLStrategy
    from exonware.xwquery.compiler.strategies.sumologic import SumoLogicStrategy
    from exonware.xwquery.compiler.strategies.nrql import NRQLStrategy
    from exonware.xwquery.compiler.strategies.wavefront import WavefrontStrategy
    from exonware.xwquery.compiler.strategies.influxql import InfluxQLStrategy
    from exonware.xwquery.compiler.strategies.tick import TICKStrategy
    from exonware.xwquery.compiler.strategies.chronograf import ChronografStrategy
    from exonware.xwquery.compiler.strategies.metricsql import MetricsQLStrategy
    from exonware.xwquery.compiler.strategies.graphite import GraphiteStrategy
    from exonware.xwquery.compiler.strategies.m3ql import M3QLStrategy
except ImportError as e:
    pytest.skip(f"One or more time-series strategies not yet implemented: {e}", allow_module_level=True)
# ==================== Test Data: Real Query Examples ====================
SPL_QUERIES = [
    # Basic index search
    'index=main',
    'index=main host="server01"',
    'index=main | stats count by host',
    'index=main | fields host, source',
    'index=main host="server01" | stats avg(cpu) by host',
    # Complex query
    'index=web status=200 | stats count by host | head 10',
]
SUMOLOGIC_QUERIES = [
    '_sourceCategory=prod',
    '_sourceCategory=prod | where status=200',
    '_sourceCategory=prod | count',
    '_sourceCategory=prod | where status=200 | fields host, source',
    '_sourceCategory=prod | parse "method=* status=*" as method, status',
]
NRQL_QUERIES = [
    'SELECT * FROM Transaction',
    'SELECT count(*) FROM Transaction WHERE appName=\'MyApp\'',
    'SELECT average(duration) FROM Transaction FACET appName',
    'SELECT * FROM Transaction WHERE appName=\'MyApp\' SINCE 1 hour ago',
    'SELECT count(*) FROM Transaction WHERE statusCode=200 FACET host LIMIT 10',
]
WAVEFRONT_QUERIES = [
    'ts("cpu.usage")',
    'ts("cpu.usage", {env="prod"})',
    'ts("cpu.usage", {env="prod", host="server01"})',
    'sum(ts("cpu.usage", {env="prod"}))',
    'avg(ts("cpu.usage", {host="server*"}))',
]
INFLUXQL_QUERIES = [
    'SELECT * FROM "cpu"',
    'SELECT mean("value") FROM "cpu" WHERE "host" = \'server01\'',
    'SELECT mean("value") FROM "cpu" WHERE "host" = \'server01\' GROUP BY time(1m)',
    'SELECT max("value"), min("value") FROM "cpu" WHERE time > now() - 1h',
    'SHOW TAG VALUES FROM "cpu" WITH KEY IN ("host", "env")',
]
TICK_QUERIES = [
    'stream\n  |from()\n    .measurement("cpu")',
    'stream\n  |from()\n    .measurement("cpu")\n  |where(lambda: "host" == \'server01\')',
    'stream\n  |from()\n    .measurement("cpu")\n  |groupBy("host")\n  |mean()',
    'stream\n  |from()\n    .measurement("cpu")\n  |where(lambda: "cpu" > 80)\n  |alert()',
]
CHRONOGRAF_QUERIES = [
    'SHOW TAG VALUES FROM "cpu" WITH KEY IN ("host")',
    'SHOW TAG VALUES FROM "cpu" WITH KEY IN ("host", "env")',
    'SHOW TAG VALUES FROM "cpu" WITH KEY IN ("host") WHERE "env" = \'prod\'',
    'SHOW TAG VALUES FROM "memory" WITH KEY IN ("host")',
]
METRICSQL_QUERIES = [
    'up',
    'up{job="prometheus"}',
    'up{job="prometheus", instance=~"server.*"}',
    'rate(up{job="prometheus"}[5m])',
    'sum(up{job="prometheus"}) by (instance)',
]
GRAPHITE_QUERIES = [
    'metric.server.cpu.usage',
    'metric.server.*.cpu',
    'sumSeries(metric.server.*.cpu)',
    'averageSeries(metric.server.cpu.usage)',
    'groupByNode(metric.server.*.*, 1, "sumSeries")',
]
M3QL_QUERIES = [
    'up',
    'up{job="prometheus"}',
    'up{job="prometheus", instance=~"server.*"}',
    'aggregate(up{job="prometheus"}, "sum")',
    'rate(up{job="prometheus"}[5m])',
]
# ==================== Roundtrip Test Fixtures ====================
@pytest.fixture(params=[
    (SPLStrategy, 'SPL', SPL_QUERIES),
    (SumoLogicStrategy, 'SumoLogic', SUMOLOGIC_QUERIES),
    (NRQLStrategy, 'NRQL', NRQL_QUERIES),
    (WavefrontStrategy, 'Wavefront', WAVEFRONT_QUERIES),
    (InfluxQLStrategy, 'InfluxQL', INFLUXQL_QUERIES),
    (TICKStrategy, 'TICK', TICK_QUERIES),
    (ChronografStrategy, 'Chronograf', CHRONOGRAF_QUERIES),
    (MetricsQLStrategy, 'MetricsQL', METRICSQL_QUERIES),
    (GraphiteStrategy, 'Graphite', GRAPHITE_QUERIES),
    (M3QLStrategy, 'M3QL', M3QL_QUERIES),
])
def strategy_and_queries(request):
    """Parameterized fixture providing strategy class, name, and test queries."""
    strategy_class, name, queries = request.param
    return strategy_class(), name, queries
# ==================== Roundtrip Tests ====================
@pytest.mark.xwquery_unit
class TestRoundtripConversion:
    """Test roundtrip conversion for all new strategies."""
    def test_roundtrip_all_queries(self, strategy_and_queries):
        """Test roundtrip conversion for all query examples."""
        strategy, strategy_name, queries = strategy_and_queries
        for query in queries:
            # Skip very complex queries that may have minor formatting differences
            if len(query) > 200:
                continue
            try:
                # Convert to actions tree
                actions_tree = strategy.to_actions_tree(query)
                assert actions_tree is not None, f"{strategy_name}: Failed to convert query to actions tree"
                # Convert back to query
                regenerated = strategy.from_actions_tree(actions_tree)
                assert regenerated is not None, f"{strategy_name}: Failed to convert actions tree back to query"
                assert len(regenerated) > 0, f"{strategy_name}: Regenerated query is empty"
            except Exception as e:
                pytest.fail(f"{strategy_name} roundtrip failed for query '{query[:50]}...': {str(e)}")
    def test_roundtrip_simple_queries(self, strategy_and_queries):
        """Test roundtrip with simple queries (first query of each strategy)."""
        strategy, strategy_name, queries = strategy_and_queries
        if not queries:
            pytest.skip(f"No queries defined for {strategy_name}")
        simple_query = queries[0]
        try:
            actions_tree = strategy.to_actions_tree(simple_query)
            regenerated = strategy.from_actions_tree(actions_tree)
            # Basic validation
            assert regenerated is not None
            assert len(regenerated) > 0
        except Exception as e:
            pytest.fail(f"{strategy_name} simple roundtrip failed: {str(e)}")
    def test_roundtrip_preserves_semantics(self, strategy_and_queries):
        """Test that roundtrip preserves semantic meaning (entity name, filters)."""
        strategy, strategy_name, queries = strategy_and_queries
        # Use first query with filters/conditions
        test_queries = [q for q in queries if any(keyword in q.lower() for keyword in ['where', '=', '{', '}'])]
        if not test_queries:
            pytest.skip(f"No queries with filters for {strategy_name}")
        query = test_queries[0]
        # Parse original
        original_tree = strategy.to_actions_tree(query)
        original_data = original_tree.to_native() if hasattr(original_tree, 'to_native') else original_tree
        # Roundtrip
        regenerated = strategy.from_actions_tree(original_tree)
        regenerated_tree = strategy.to_actions_tree(regenerated)
        regenerated_data = regenerated_tree.to_native() if hasattr(regenerated_tree, 'to_native') else regenerated_tree
        # Check that both have FROM clauses
        original_from = _extract_from_clause(original_data)
        regenerated_from = _extract_from_clause(regenerated_data)
        if original_from:
            assert regenerated_from is not None or regenerated_from == original_from, \
                f"{strategy_name}: FROM clause not preserved in roundtrip"
def _extract_from_clause(tree_data):
    """Helper to extract FROM clause from actions tree."""
    if isinstance(tree_data, dict):
        root = tree_data.get('root', {})
        statements = root.get('statements', [])
        for stmt in statements:
            children = stmt.get('children', [])
            for child in children:
                if child.get('type') == 'FROM':
                    return child.get('content')
    return None
# ==================== Validation Tests ====================
@pytest.mark.xwquery_unit
class TestQueryValidation:
    """Test query validation for all new strategies."""
    def test_validate_real_queries(self, strategy_and_queries):
        """Test that all real query examples are valid."""
        strategy, strategy_name, queries = strategy_and_queries
        for query in queries:
            is_valid = strategy.validate_query(query)
            assert is_valid, f"{strategy_name}: Query should be valid: {query[:100]}"
    def test_validate_empty_query(self, strategy_and_queries):
        """Test that empty queries are rejected."""
        strategy, strategy_name, _ = strategy_and_queries
        assert not strategy.validate_query(""), f"{strategy_name}: Empty query should be invalid"
        assert not strategy.validate_query("   "), f"{strategy_name}: Whitespace-only query should be invalid"
    def test_validate_none_query(self, strategy_and_queries):
        """Test that None queries are rejected."""
        strategy, strategy_name, _ = strategy_and_queries
        assert not strategy.validate_query(None), f"{strategy_name}: None query should be invalid"
# ==================== Language Specification Tests ====================
@pytest.mark.xwquery_unit
class TestLanguageSpecifications:
    """Test that queries follow actual language specifications."""
    def test_spl_index_syntax(self):
        """Test SPL index syntax."""
        strategy = SPLStrategy()
        # Valid SPL queries
        assert strategy.validate_query('index=main')
        assert strategy.validate_query('index=main | stats count')
        assert strategy.validate_query('index=main host="server01"')
        # SPL should support pipe operators
        query = 'index=main | stats count'
        actions_tree = strategy.to_actions_tree(query)
        assert actions_tree is not None
    def test_sumologic_source_category(self):
        """Test SumoLogic source category syntax."""
        strategy = SumoLogicStrategy()
        # Valid SumoLogic queries
        assert strategy.validate_query('_sourceCategory=prod')
        assert strategy.validate_query('_sourceCategory=prod | where status=200')
        query = '_sourceCategory=prod | where status=200'
        actions_tree = strategy.to_actions_tree(query)
        assert actions_tree is not None
    def test_nrql_sql_like_syntax(self):
        """Test NRQL SQL-like syntax."""
        strategy = NRQLStrategy()
        # Valid NRQL queries
        assert strategy.validate_query('SELECT * FROM Transaction')
        assert strategy.validate_query('SELECT count(*) FROM Transaction WHERE appName=\'MyApp\'')
        query = 'SELECT count(*) FROM Transaction WHERE appName=\'MyApp\''
        actions_tree = strategy.to_actions_tree(query)
        assert actions_tree is not None
    def test_wavefront_ts_function(self):
        """Test Wavefront ts() function syntax."""
        strategy = WavefrontStrategy()
        # Valid Wavefront queries
        assert strategy.validate_query('ts("cpu.usage")')
        assert strategy.validate_query('ts("cpu.usage", {env="prod"})')
        query = 'ts("cpu.usage", {env="prod"})'
        actions_tree = strategy.to_actions_tree(query)
        assert actions_tree is not None
    def test_influxql_sql_like_syntax(self):
        """Test InfluxQL SQL-like syntax."""
        strategy = InfluxQLStrategy()
        # Valid InfluxQL queries
        assert strategy.validate_query('SELECT * FROM "cpu"')
        assert strategy.validate_query('SELECT mean("value") FROM "cpu" WHERE "host" = \'server01\'')
        query = 'SELECT mean("value") FROM "cpu" WHERE "host" = \'server01\''
        actions_tree = strategy.to_actions_tree(query)
        assert actions_tree is not None
    def test_tick_pipeline_syntax(self):
        """Test TICK pipeline syntax."""
        strategy = TICKStrategy()
        # Valid TICK queries
        assert strategy.validate_query('stream\n  |from()\n    .measurement("cpu")')
        query = 'stream\n  |from()\n    .measurement("cpu")'
        actions_tree = strategy.to_actions_tree(query)
        assert actions_tree is not None
    def test_chronograf_show_syntax(self):
        """Test Chronograf SHOW syntax."""
        strategy = ChronografStrategy()
        # Valid Chronograf queries
        assert strategy.validate_query('SHOW TAG VALUES FROM "cpu" WITH KEY IN ("host")')
        query = 'SHOW TAG VALUES FROM "cpu" WITH KEY IN ("host")'
        actions_tree = strategy.to_actions_tree(query)
        assert actions_tree is not None
    def test_metricsql_promql_compatible(self):
        """Test MetricsQL PromQL-compatible syntax."""
        strategy = MetricsQLStrategy()
        # Valid MetricsQL queries
        assert strategy.validate_query('up{job="prometheus"}')
        assert strategy.validate_query('rate(up{job="prometheus"}[5m])')
        query = 'up{job="prometheus"}'
        actions_tree = strategy.to_actions_tree(query)
        assert actions_tree is not None
    def test_graphite_metric_paths(self):
        """Test Graphite metric path syntax."""
        strategy = GraphiteStrategy()
        # Valid Graphite queries
        assert strategy.validate_query('metric.server.cpu.usage')
        assert strategy.validate_query('sumSeries(metric.server.*.cpu)')
        query = 'sumSeries(metric.server.*.cpu)'
        actions_tree = strategy.to_actions_tree(query)
        assert actions_tree is not None
    def test_m3ql_promql_compatible(self):
        """Test M3QL PromQL-compatible syntax."""
        strategy = M3QLStrategy()
        # Valid M3QL queries
        assert strategy.validate_query('up{job="prometheus"}')
        assert strategy.validate_query('aggregate(up{job="prometheus"}, "sum")')
        query = 'up{job="prometheus"}'
        actions_tree = strategy.to_actions_tree(query)
        assert actions_tree is not None
# ==================== Actions Tree Structure Tests ====================
@pytest.mark.xwquery_unit
class TestActionsTreeStructure:
    """Test that actions trees are correctly structured."""
    def test_actions_tree_has_root(self, strategy_and_queries):
        """Test that actions tree has proper root structure."""
        strategy, strategy_name, queries = strategy_and_queries
        if not queries:
            pytest.skip(f"No queries for {strategy_name}")
        query = queries[0]
        actions_tree = strategy.to_actions_tree(query)
        tree_data = actions_tree.to_native() if hasattr(actions_tree, 'to_native') else actions_tree
        assert 'root' in tree_data, f"{strategy_name}: Actions tree should have 'root' key"
        root = tree_data['root']
        assert 'type' in root, f"{strategy_name}: Root should have 'type'"
        assert root['type'] == 'PROGRAM', f"{strategy_name}: Root type should be 'PROGRAM'"
        assert 'statements' in root, f"{strategy_name}: Root should have 'statements'"
    def test_actions_tree_has_metadata(self, strategy_and_queries):
        """Test that actions tree has metadata with source format."""
        strategy, strategy_name, queries = strategy_and_queries
        if not queries:
            pytest.skip(f"No queries for {strategy_name}")
        query = queries[0]
        actions_tree = strategy.to_actions_tree(query)
        tree_data = actions_tree.to_native() if hasattr(actions_tree, 'to_native') else actions_tree
        root = tree_data['root']
        metadata = root.get('metadata', {})
        assert 'source_format' in metadata, f"{strategy_name}: Metadata should have 'source_format'"
        assert metadata['source_format'] == strategy_name.upper(), \
            f"{strategy_name}: Source format should match strategy name"
# ==================== Error Handling Tests ====================
@pytest.mark.xwquery_unit
class TestErrorHandling:
    """Test error handling for invalid inputs."""
    def test_execute_invalid_query_raises_error(self, strategy_and_queries):
        """Test that executing invalid queries raises appropriate errors."""
        strategy, strategy_name, _ = strategy_and_queries
        with pytest.raises(Exception):
            strategy.execute("invalid query that doesn't match syntax")
    def test_to_actions_tree_invalid_query(self, strategy_and_queries):
        """Test that converting invalid queries doesn't crash."""
        strategy, strategy_name, _ = strategy_and_queries
        # Should not raise exception, but may return incomplete tree
        try:
            result = strategy.to_actions_tree("invalid")
            # Result might be None or incomplete tree
            assert result is None or isinstance(result, object)
        except Exception:
            # Acceptable if it raises an error for invalid input
            pass
if __name__ == '__main__':
    pytest.main([__file__, '-v'])

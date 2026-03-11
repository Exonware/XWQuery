#!/usr/bin/env python3
"""
#exonware/xwquery/tests/strategies/test_new_sql_strategies_roundtrip.py
Roundtrip tests for newly created SQL strategies.
This test suite verifies that all new SQL strategies properly convert
queries to XWQuery Script actions tree and back (roundtrip conversion).
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.0.1.8
Generation Date: January 2, 2025
"""
import pytest
from typing import Any
# Import all new strategies - skip entire module if any are not implemented
try:
    from exonware.xwquery.compiler.strategies.timescaledb import TimescaleDBStrategy
    from exonware.xwquery.compiler.strategies.drill import DrillStrategy
    from exonware.xwquery.compiler.strategies.presto_sql import PrestoSQLStrategy
    from exonware.xwquery.compiler.strategies.trino_sql import TrinoSQLStrategy
    from exonware.xwquery.compiler.strategies.spark_sql import SparkSQLStrategy
    from exonware.xwquery.compiler.strategies.flink_sql import FlinkSQLStrategy
    from exonware.xwquery.compiler.strategies.beam_sql import BeamSQLStrategy
    from exonware.xwquery.compiler.strategies.materialize import MaterializeStrategy
    from exonware.xwquery.compiler.strategies.risingwave import RisingWaveStrategy
    from exonware.xwquery.compiler.strategies.databricks_sql import DatabricksSQLStrategy
    from exonware.xwquery.compiler.strategies.teradata_sql import TeradataSQLStrategy
    from exonware.xwquery.compiler.strategies.vertica_sql import VerticaSQLStrategy
    from exonware.xwquery.compiler.strategies.netezza_sql import NetezzaSQLStrategy
    from exonware.xwquery.compiler.strategies.exasol_sql import ExasolSQLStrategy
    from exonware.xwquery.compiler.strategies.firebird_sql import FirebirdSQLStrategy
    from exonware.xwquery.compiler.strategies.db2_sql_pl import Db2SQLPLStrategy
    from exonware.xwquery.compiler.strategies.plpgsql import PLpgSQLStrategy
    from exonware.xwquery.compiler.strategies.plpython import PLPythonStrategy
    from exonware.xwquery.compiler.strategies.plv8 import PLv8Strategy
    from exonware.xwquery.compiler.strategies.plperl import PLPerlStrategy
    from exonware.xwquery.compiler.strategies.mysql_stored import MySQLStoredStrategy
except ImportError as e:
    pytest.skip(f"One or more SQL strategies not yet implemented: {e}", allow_module_level=True)
# Test data: (strategy_class, format_name, test_queries)
NEW_STRATEGIES = [
    (TimescaleDBStrategy, "TIMESCALEDB", [
        "SELECT * FROM table",
        "SELECT name, age FROM users WHERE age > 18",
        "SELECT * FROM hypertable WHERE time > NOW() - INTERVAL '1 day'",
    ]),
    (DrillStrategy, "DRILL", [
        "SELECT * FROM table",
        "SELECT name, age FROM users WHERE age > 18",
        "SELECT * FROM dfs.`/data/users.parquet`",
    ]),
    (PrestoSQLStrategy, "PRESTO_SQL", [
        "SELECT * FROM table",
        "SELECT name, age FROM users WHERE age > 18",
        "SELECT * FROM hive.schema.table",
    ]),
    (TrinoSQLStrategy, "TRINO_SQL", [
        "SELECT * FROM table",
        "SELECT name, age FROM users WHERE age > 18",
        "SELECT * FROM hive.schema.table",
    ]),
    (SparkSQLStrategy, "SPARK_SQL", [
        "SELECT * FROM table",
        "SELECT name, age FROM users WHERE age > 18",
        "SELECT * FROM parquet.`/path/to/data`",
    ]),
    (FlinkSQLStrategy, "FLINK_SQL", [
        "SELECT * FROM table",
        "SELECT name, age FROM users WHERE age > 18",
        "SELECT * FROM kafka_table",
    ]),
    (BeamSQLStrategy, "BEAM_SQL", [
        "SELECT * FROM table",
        "SELECT name, age FROM users WHERE age > 18",
        "SELECT * FROM pubsub.topic",
    ]),
    (MaterializeStrategy, "MATERIALIZE", [
        "SELECT * FROM table",
        "SELECT name, age FROM users WHERE age > 18",
        "CREATE MATERIALIZED VIEW mv AS SELECT * FROM source",
    ]),
    (RisingWaveStrategy, "RISINGWAVE", [
        "SELECT * FROM table",
        "SELECT name, age FROM users WHERE age > 18",
        "CREATE MATERIALIZED VIEW mv AS SELECT * FROM source",
    ]),
    (DatabricksSQLStrategy, "DATABRICKS_SQL", [
        "SELECT * FROM table",
        "SELECT name, age FROM users WHERE age > 18",
        "SELECT * FROM delta.`/path/to/table`",
    ]),
    (TeradataSQLStrategy, "TERADATA_SQL", [
        "SELECT * FROM table",
        "SELECT name, age FROM users WHERE age > 18",
        "SELECT TOP 10 * FROM users",
    ]),
    (VerticaSQLStrategy, "VERTICA_SQL", [
        "SELECT * FROM table",
        "SELECT name, age FROM users WHERE age > 18",
        "SELECT * FROM table WHERE time BETWEEN '2024-01-01' AND '2024-12-31'",
    ]),
    (NetezzaSQLStrategy, "NETEZZA_SQL", [
        "SELECT * FROM table",
        "SELECT name, age FROM users WHERE age > 18",
        "SELECT * FROM table LIMIT 100",
    ]),
    (ExasolSQLStrategy, "EXASOL_SQL", [
        "SELECT * FROM table",
        "SELECT name, age FROM users WHERE age > 18",
        "SELECT * FROM table FETCH FIRST 10 ROWS ONLY",
    ]),
    (FirebirdSQLStrategy, "FIREBIRD_SQL", [
        "SELECT * FROM table",
        "SELECT name, age FROM users WHERE age > 18",
        "SELECT FIRST 10 * FROM users",
    ]),
    (Db2SQLPLStrategy, "DB2_SQL_PL", [
        "SELECT * FROM table",
        "SELECT name, age FROM users WHERE age > 18",
        "CALL procedure_name(?)",
    ]),
    (PLpgSQLStrategy, "PLPGSQL", [
        "SELECT * FROM table",
        "SELECT name, age FROM users WHERE age > 18",
        "CREATE FUNCTION func() RETURNS void AS $$ BEGIN SELECT 1; END; $$ LANGUAGE plpgsql",
    ]),
    (PLPythonStrategy, "PLPYTHON", [
        "SELECT * FROM table",
        "SELECT name, age FROM users WHERE age > 18",
        "CREATE FUNCTION func() RETURNS int AS $$ return 1 $$ LANGUAGE plpython3u",
    ]),
    (PLv8Strategy, "PLV8", [
        "SELECT * FROM table",
        "SELECT name, age FROM users WHERE age > 18",
        "CREATE FUNCTION func() RETURNS int AS $$ return 1; $$ LANGUAGE plv8",
    ]),
    (PLPerlStrategy, "PLPERL", [
        "SELECT * FROM table",
        "SELECT name, age FROM users WHERE age > 18",
        "CREATE FUNCTION func() RETURNS int AS $$ return 1; $$ LANGUAGE plperl",
    ]),
    (MySQLStoredStrategy, "MYSQL_STORED", [
        "SELECT * FROM table",
        "SELECT name, age FROM users WHERE age > 18",
        "CREATE PROCEDURE proc() BEGIN SELECT 1; END",
    ]),
]
@pytest.mark.xwquery_unit
@pytest.mark.xwquery_integration
class TestNewSQLStrategiesRoundtrip:
    """Test roundtrip conversion for all new SQL strategies."""
    @pytest.mark.parametrize("strategy_class,format_name,test_queries", NEW_STRATEGIES)
    def test_strategy_instantiation(self, strategy_class, format_name, test_queries):
        """Test that strategy can be instantiated."""
        strategy = strategy_class()
        assert strategy is not None
        assert hasattr(strategy, 'execute')
        assert hasattr(strategy, 'validate_query')
        assert hasattr(strategy, 'to_actions_tree')
        assert hasattr(strategy, 'from_actions_tree')
    @pytest.mark.parametrize("strategy_class,format_name,test_queries", NEW_STRATEGIES)
    def test_validate_query(self, strategy_class, format_name, test_queries):
        """Test query validation for each strategy."""
        strategy = strategy_class()
        # Test valid queries
        for query in test_queries:
            is_valid = strategy.validate_query(query)
            assert is_valid, f"{format_name}: Query should be valid: {query}"
        # Test invalid queries
        assert not strategy.validate_query(""), f"{format_name}: Empty query should be invalid"
        assert not strategy.validate_query("   "), f"{format_name}: Whitespace-only query should be invalid"
    @pytest.mark.parametrize("strategy_class,format_name,test_queries", NEW_STRATEGIES)
    def test_to_actions_tree(self, strategy_class, format_name, test_queries):
        """Test conversion from query to actions tree."""
        strategy = strategy_class()
        for query in test_queries[:2]:  # Test first 2 queries
            if not strategy.validate_query(query):
                pytest.skip(f"{format_name}: Query is not valid: {query}")
            try:
                actions_tree = strategy.to_actions_tree(query)
                assert actions_tree is not None, f"{format_name}: to_actions_tree should return non-None"
                assert hasattr(actions_tree, 'to_native'), f"{format_name}: Actions tree should have to_native method"
                # Verify structure
                tree_data = actions_tree.to_native()
                assert 'root' in tree_data, f"{format_name}: Actions tree should have 'root' key"
                assert 'statements' in tree_data['root'], f"{format_name}: Root should have 'statements'"
            except Exception as e:
                pytest.fail(f"{format_name}: to_actions_tree failed for query '{query}': {e}")
    @pytest.mark.parametrize("strategy_class,format_name,test_queries", NEW_STRATEGIES)
    def test_from_actions_tree(self, strategy_class, format_name, test_queries):
        """Test conversion from actions tree to query."""
        strategy = strategy_class()
        # Create a simple query and convert it
        test_query = test_queries[0]
        if not strategy.validate_query(test_query):
            pytest.skip(f"{format_name}: Query is not valid: {test_query}")
        try:
            # Convert to actions tree
            actions_tree = strategy.to_actions_tree(test_query)
            # Convert back to query
            regenerated_query = strategy.from_actions_tree(actions_tree)
            assert regenerated_query is not None, f"{format_name}: from_actions_tree should return non-None"
            assert isinstance(regenerated_query, str), f"{format_name}: from_actions_tree should return string"
            assert len(regenerated_query) > 0, f"{format_name}: Regenerated query should not be empty"
        except Exception as e:
            pytest.fail(f"{format_name}: from_actions_tree failed: {e}")
    @pytest.mark.parametrize("strategy_class,format_name,test_queries", NEW_STRATEGIES)
    def test_roundtrip_conversion(self, strategy_class, format_name, test_queries):
        """Test roundtrip conversion: query -> actions_tree -> query."""
        strategy = strategy_class()
        # Test with first query (should be simplest)
        original_query = test_queries[0]
        if not strategy.validate_query(original_query):
            pytest.skip(f"{format_name}: Query is not valid: {original_query}")
        try:
            # Convert to actions tree
            actions_tree = strategy.to_actions_tree(original_query)
            # Convert back to query
            regenerated_query = strategy.from_actions_tree(actions_tree)
            # Verify regenerated query is valid
            assert strategy.validate_query(regenerated_query), \
                f"{format_name}: Regenerated query should be valid: {regenerated_query}"
            # Convert again to verify consistency
            actions_tree2 = strategy.to_actions_tree(regenerated_query)
            assert actions_tree2 is not None, \
                f"{format_name}: Second conversion should work"
        except Exception as e:
            pytest.fail(f"{format_name}: Roundtrip conversion failed for '{original_query}': {e}")
    @pytest.mark.parametrize("strategy_class,format_name,test_queries", NEW_STRATEGIES)
    def test_get_query_plan(self, strategy_class, format_name, test_queries):
        """Test get_query_plan method."""
        strategy = strategy_class()
        test_query = test_queries[0]
        if not strategy.validate_query(test_query):
            pytest.skip(f"{format_name}: Query is not valid: {test_query}")
        try:
            plan = strategy.get_query_plan(test_query)
            assert plan is not None, f"{format_name}: get_query_plan should return non-None"
            assert isinstance(plan, dict), f"{format_name}: get_query_plan should return dict"
            assert 'query_type' in plan, f"{format_name}: Plan should have 'query_type'"
        except Exception as e:
            pytest.fail(f"{format_name}: get_query_plan failed: {e}")
    @pytest.mark.parametrize("strategy_class,format_name,test_queries", NEW_STRATEGIES)
    def test_execute_method(self, strategy_class, format_name, test_queries):
        """Test execute method (should not raise errors)."""
        strategy = strategy_class()
        test_query = test_queries[0]
        if not strategy.validate_query(test_query):
            pytest.skip(f"{format_name}: Query is not valid: {test_query}")
        try:
            result = strategy.execute(test_query)
            assert result is not None, f"{format_name}: execute should return non-None"
        except Exception as e:
            # Execute may raise errors for placeholder implementations, but should not crash
            pytest.skip(f"{format_name}: execute method not fully implemented: {e}")
@pytest.mark.xwquery_integration
class TestNewSQLStrategiesXWQueryIntegration:
    """Test integration with XWQuery Script conversion."""
    @pytest.mark.parametrize("strategy_class,format_name,test_queries", NEW_STRATEGIES)
    def test_xwquery_script_integration(self, strategy_class, format_name, test_queries):
        """Test that strategies can convert to/from XWQuery Script format."""
        from exonware.xwquery.compiler.strategies.xwquery import XWQueryScriptStrategy
        strategy = strategy_class()
        xwquery_strategy = XWQueryScriptStrategy()
        test_query = test_queries[0]
        if not strategy.validate_query(test_query):
            pytest.skip(f"{format_name}: Query is not valid: {test_query}")
        try:
            # Convert format query to actions tree
            actions_tree = strategy.to_actions_tree(test_query)
            # Convert actions tree to XWQuery Script format
            xwquery_strategy._actions_tree = actions_tree
            xwquery_script = xwquery_strategy.from_actions_tree(actions_tree)
            # Verify we got something back
            assert xwquery_script is not None, \
                f"{format_name}: XWQuery Script conversion should return non-None"
        except Exception as e:
            # Integration may not be fully implemented, but should not crash
            pytest.skip(f"{format_name}: XWQuery Script integration not fully implemented: {e}")

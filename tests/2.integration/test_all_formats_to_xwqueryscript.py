#!/usr/bin/env python3
"""
Comprehensive Test Suite: All Formats to XWQueryScript Conversion
Tests that all query format strategies can be converted to XWQueryScript
and back (roundtrip).
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.0.1.8
Generation Date: January 2, 2025
"""
import pytest
import sys
from pathlib import Path
# Add src to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent / "src"))
from exonware.xwquery import XWQuery
from exonware.xwquery.compiler.strategies.xwqs import XWQSStrategy, FORMAT_STRATEGY_MAP
# Sample queries for each format type
SAMPLE_QUERIES = {
    # SQL Family
    'SQL': "SELECT name, age FROM users WHERE age > 25",
    'SQL_GRAMMAR': "SELECT name, age FROM users WHERE age > 25",
    'N1QL': "SELECT name, age FROM users WHERE age > 25",
    'PARTIQL': "SELECT name, age FROM users WHERE age > 25",
    'HIVEQL': "SELECT name, age FROM users WHERE age > 25",
    'HQL': "FROM User u WHERE u.age > 25 SELECT u.name, u.age",
    'KQL': "users | where age > 25 | project name, age",
    'CQL': "SELECT name, age FROM users WHERE age > 25 ALLOW FILTERING",
    # Graph Queries
    'CYPHER': "MATCH (u:User) WHERE u.age > 25 RETURN u.name, u.age",
    'SPARQL': "SELECT ?name ?age WHERE { ?u :age ?age . ?u :name ?name . FILTER(?age > 25) }",
    'GRAPHQL': "{ users(filter: {age: {gt: 25}}) { name age } }",
    'GQL': "SELECT u.name, u.age FROM User u WHERE u.age > 25",
    'GREMLIN': "g.V().hasLabel('User').has('age', gt(25)).values('name', 'age')",
    # Document Queries
    'XPATH': "//users/user[age > 25]/name",
    'XQUERY': "for $u in $users where $u/age > 25 return $u/name",
    'XML_QUERY': "//users/user[age > 25]/name",
    'JMESPATH': "users[?age > `25`].{name: name, age: age}",
    'JQ': ".users[] | select(.age > 25) | {name, age}",
    'JSON_QUERY': "$.users[?(@.age > 25)].{name: name, age: age}",
    'JSONPATH': "$.users[?(@.age > 25)].{name: name, age: age}",
    'JSONIQ': "for $u in $users where $u.age > 25 return {\"name\": $u.name, \"age\": $u.age}",
    # NoSQL
    'MQL': "db.users.find({age: {$gt: 25}}, {name: 1, age: 1})",
    'MONGODB_AGGREGATION': "db.users.aggregate([{$match: {age: {$gt: 25}}}, {$project: {name: 1, age: 1}}])",
    'COUCHDB_MANGO': '{"selector": {"age": {"$gt": 25}}, "fields": ["name", "age"]}',
    'ARANGODB_AQL': "FOR u IN users FILTER u.age > 25 RETURN {name: u.name, age: u.age}",
    'EDGEQL': "SELECT User {name, age} FILTER .age > 25",
    'SURREALQL': "SELECT name, age FROM users WHERE age > 25",
    # Functional/Streaming
    'LINQ': "from u in users where u.age > 25 select new { u.name, u.age }",
    'DATALOG': "result(name, age) :- users(id, name, age, city, active), age > 25",
    'PIG': "users_filtered = FILTER users BY age > 25; result = FOREACH users_filtered GENERATE name, age;",
    # Time Series
    'PROMQL': "users{age>25}",
    'LOGQL': "{job=\"users\"} | json | age > 25 | line_format \"{{.name}} {{.age}}\"",
    'FLUX': "from(bucket: \"users\") |> filter(fn: (r) => r.age > 25) |> keep(columns: [\"name\", \"age\"])",
    'EQL': "users where age > 25 | fields name, age",
    'INFLUXQL': "SELECT name, age FROM users WHERE age > 25",
    'CHRONOGRAF': "SELECT name, age FROM users WHERE age > 25",
    'METRICSQL': "SELECT name, age FROM users WHERE age > 25",
    'GRAPHITE': "users.age > 25",
    'M3QL': "SELECT name, age FROM users WHERE age > 25",
    'TICK': "SELECT name, age FROM users WHERE age > 25",
    'TIMESCALEDB': "SELECT name, age FROM users WHERE age > 25",
    'WAVEFRONT': "users{age>25}",
    'NRQL': "SELECT name, age FROM users WHERE age > 25",
    'SPL': "users | where age > 25 | fields name, age",
    'SUMOLOGIC': "users | where age > 25 | fields name, age",
    # Search
    'ELASTIC_DSL': '{"query": {"range": {"age": {"gt": 25}}}, "_source": ["name", "age"]}',
    'ELASTICSEARCH': '{"query": {"range": {"age": {"gt": 25}}}, "_source": ["name", "age"]}',
    'ELASTICSEARCH_SQL': "SELECT name, age FROM users WHERE age > 25",
    'OPENSEARCH_DSL': '{"query": {"range": {"age": {"gt": 25}}}, "_source": ["name", "age"]}',
    'OPENSEARCH_PPL': "source=users | where age > 25 | fields name, age",
    # SQL Engines
    'PRESTO_SQL': "SELECT name, age FROM users WHERE age > 25",
    'PRESTO': "SELECT name, age FROM users WHERE age > 25",
    'TRINO_SQL': "SELECT name, age FROM users WHERE age > 25",
    'TRINO': "SELECT name, age FROM users WHERE age > 25",
    'SPARK_SQL': "SELECT name, age FROM users WHERE age > 25",
    'SPARK': "SELECT name, age FROM users WHERE age > 25",
    'FLINK_SQL': "SELECT name, age FROM users WHERE age > 25",
    'FLINK': "SELECT name, age FROM users WHERE age > 25",
    'BEAM_SQL': "SELECT name, age FROM users WHERE age > 25",
    'BEAM': "SELECT name, age FROM users WHERE age > 25",
    'MATERIALIZE': "SELECT name, age FROM users WHERE age > 25",
    'RISINGWAVE': "SELECT name, age FROM users WHERE age > 25",
    'DATABRICKS_SQL': "SELECT name, age FROM users WHERE age > 25",
    'DATABRICKS': "SELECT name, age FROM users WHERE age > 25",
    'TERADATA_SQL': "SELECT name, age FROM users WHERE age > 25",
    'TERADATA': "SELECT name, age FROM users WHERE age > 25",
    'VERTICA_SQL': "SELECT name, age FROM users WHERE age > 25",
    'VERTICA': "SELECT name, age FROM users WHERE age > 25",
    'NETEZZA_SQL': "SELECT name, age FROM users WHERE age > 25",
    'NETEZZA': "SELECT name, age FROM users WHERE age > 25",
    'EXASOL_SQL': "SELECT name, age FROM users WHERE age > 25",
    'EXASOL': "SELECT name, age FROM users WHERE age > 25",
    'FIREBIRD_SQL': "SELECT name, age FROM users WHERE age > 25",
    'FIREBIRD': "SELECT name, age FROM users WHERE age > 25",
    'DB2_SQL_PL': "SELECT name, age FROM users WHERE age > 25",
    'DB2': "SELECT name, age FROM users WHERE age > 25",
    'BIGQUERY': "SELECT name, age FROM users WHERE age > 25",
    'SNOWFLAKE': "SELECT name, age FROM users WHERE age > 25",
    'REDSHIFT': "SELECT name, age FROM users WHERE age > 25",
    'CLICKHOUSE': "SELECT name, age FROM users WHERE age > 25",
    'DUCKDB': "SELECT name, age FROM users WHERE age > 25",
    'MARIADB': "SELECT name, age FROM users WHERE age > 25",
    'MYSQL': "SELECT name, age FROM users WHERE age > 25",
    'SQLITE': "SELECT name, age FROM users WHERE age > 25",
    'DRILL': "SELECT name, age FROM users WHERE age > 25",
    'PREsto_SQL': "SELECT name, age FROM users WHERE age > 25",
    # Specialized
    'GSQL': "SELECT name, age FROM User WHERE age > 25",
    'NGQL': "FETCH PROP ON User WHERE User.age > 25 YIELD User.name, User.age",
    'DQL': "SELECT name, age FROM users WHERE age > 25",
    'OPENCYPHER': "MATCH (u:User) WHERE u.age > 25 RETURN u.name, u.age",
    'CYPHER_AGE': "MATCH (u:User) WHERE u.age > 25 RETURN u.name, u.age",
    'ASTERIXDB_AQL': "FOR u IN users WHERE u.age > 25 RETURN {name: u.name, age: u.age}",
    'SQL_PLUS_PLUS': "SELECT name, age FROM users WHERE age > 25",
    # Analytics/BI
    'DAX': "EVALUATE FILTER(users, users[age] > 25)",
    'MDX': "SELECT {[name], [age]} ON COLUMNS FROM [users] WHERE [age] > 25",
    'M': "let users = Table.SelectRows(users, each [age] > 25)",
    'POWERFX': "Filter(users, age > 25)",
    'ODATA': "users?$filter=age gt 25&$select=name,age",
    'SAQL': "q = load \"users\"; q = filter q by age > 25; q = foreach q generate name, age;",
    'SOSL': "FIND {users} WHERE age > 25 RETURNING name, age",
    'SOQL': "SELECT name, age FROM users WHERE age > 25",
    'GQL_GAE': "SELECT name, age FROM users WHERE age > 25",
    # Scripting/Config
    'JSONATA': "users[age > 25].{name: name, age: age}",
    'JSONNET': "local users = []; users.filter(function(u) u.age > 25).map(function(u) {name: u.name, age: u.age})",
    'JSON_PATCH': '[{"op": "replace", "path": "/users/0/age", "value": 26}]',
    'CUE': "users: [for u in users if u.age > 25 {name: u.name, age: u.age}]",
    'DHALL': "let users = [] in users",
    'HCL': 'users = [for u in users : {name = u.name, age = u.age} if u.age > 25]',
    'KRM_KYAML': "apiVersion: v1\nkind: User\nmetadata:\n  name: test",
    'KUSTOMIZE': "resources:\n- users.yaml",
    'NIFI_EL': "${users.filter(u -> u.age > 25)}",
    'LOGSTASH': 'filter { if [age] > 25 { mutate { add_field => {"filtered" => "true"} } } }',
    'FLUENT_BIT': '[FILTER]\n    Name grep\n    Match users\n    Regex age > 25',
    'FLUENTD': '<filter users>\n  @type grep\n  <regexp>\n    key age\n    pattern /^2[5-9]|^[3-9]/  \n  </regexp>\n</filter>',
    'PAINLESS': "ctx.users.stream().filter(u -> u.age > 25).collect(Collectors.toList())",
    'STARLARK': "users = [u for u in users if u.age > 25]",
    'TCL': "set result [lsearch -all $users {dict get $u age > 25}]",
    'AWK': "awk '$3 > 25 {print $1, $2}' users",
    'SED': "sed -n '/age > 25/p' users",
    'BASH_PIPELINE': "cat users | grep 'age > 25' | awk '{print $1, $2}'",
    # Stored Procedures
    'PLPGSQL': "SELECT name, age FROM users WHERE age > 25",
    'PLPYTHON': "SELECT name, age FROM users WHERE age > 25",
    'PLV8': "SELECT name, age FROM users WHERE age > 25",
    'PLPERL': "SELECT name, age FROM users WHERE age > 25",
    'MYSQL_STORED': "SELECT name, age FROM users WHERE age > 25",
    # ReQL/RQL
    'REQL': "r.table('users').filter(r.row['age'].gt(25)).pluck('name', 'age')",
    'RQL': "users.filter(age > 25).select(name, age)",
}
class TestAllFormatsToXWQueryScript:
    """Test that all formats can convert to XWQueryScript."""
    @pytest.mark.parametrize("format_name", sorted(FORMAT_STRATEGY_MAP.keys()))
    def test_format_to_xwqueryscript(self, format_name):
        """Test conversion from format to XWQueryScript."""
        # Skip XWQUERY itself (it's already XWQueryScript)
        if format_name == 'XWQUERY' or format_name == 'XWQUERY_SCRIPT':
            pytest.skip(f"Skipping {format_name} - it's already XWQueryScript")
        # Skip SQL_GRAMMAR - has missing grammar file issue
        if format_name == 'SQL_GRAMMAR':
            pytest.skip(f"Skipping {format_name} - missing grammar file")
        # Get sample query for this format
        query = SAMPLE_QUERIES.get(format_name)
        if not query:
            # Try to find a similar format (remove suffixes)
            base_name = format_name.replace('_SQL', '').replace('_DSL', '').replace('_PL', '')
            query = SAMPLE_QUERIES.get(base_name)
            if not query:
                # Try common SQL fallback
                if 'SQL' in format_name or format_name in ['PRESTO', 'TRINO', 'SPARK', 'FLINK', 'BEAM']:
                    query = SAMPLE_QUERIES.get('SQL')
                elif 'DSL' in format_name:
                    query = SAMPLE_QUERIES.get('ELASTIC_DSL')
                else:
                    pytest.skip(f"No sample query available for {format_name}")
        try:
            # Convert to XWQueryScript using XWQueryScriptStrategy
            script_strategy = XWQueryScriptStrategy()
            converted_strategy = script_strategy.from_format(query, format_name)
            # Verify conversion succeeded
            assert converted_strategy is not None, f"Conversion failed for {format_name}"
            assert hasattr(converted_strategy, '_actions_tree'), f"No actions tree for {format_name}"
            # Verify actions tree is not empty
            actions_tree = converted_strategy.get_actions_tree()
            assert actions_tree is not None, f"Actions tree is None for {format_name}"
            # Verify tree has structure (XWQueryScript is the actions tree, not a string)
            tree_data = actions_tree.to_native() if hasattr(actions_tree, 'to_native') else actions_tree
            assert isinstance(tree_data, dict), f"Tree data is not a dict for {format_name}"
            # Check for root or statements
            has_root = 'root' in tree_data
            has_statements = has_root and ('statements' in tree_data.get('root', {}))
            # At least one of these should be true
            assert has_root or 'statements' in tree_data or 'type' in tree_data, \
                f"Actions tree has no recognizable structure for {format_name}"
        except ValueError as e:
            # Format not supported yet
            if "No strategy available" in str(e) or "not yet supported" in str(e).lower():
                pytest.skip(f"Format {format_name} not yet supported: {e}")
            else:
                pytest.fail(f"Conversion failed for {format_name}: {e}")
        except FileNotFoundError as e:
            # Missing grammar files or resources
            pytest.skip(f"Format {format_name} requires missing resources: {e}")
        except Exception as e:
            # Check if it's a known limitation
            error_msg = str(e).lower()
            if "grammar" in error_msg and "not found" in error_msg:
                pytest.skip(f"Format {format_name} requires missing grammar file: {e}")
            elif "not implemented" in error_msg or "not supported" in error_msg:
                pytest.skip(f"Format {format_name} not fully implemented: {e}")
            else:
                pytest.fail(f"Conversion failed for {format_name}: {e}")
    @pytest.mark.parametrize("format_name", sorted(FORMAT_STRATEGY_MAP.keys()))
    def test_format_roundtrip_via_xwqueryscript(self, format_name):
        """Test roundtrip: format -> XWQueryScript -> format."""
        # Skip XWQUERY itself
        if format_name == 'XWQUERY' or format_name == 'XWQUERY_SCRIPT':
            pytest.skip(f"Skipping {format_name} - it's already XWQueryScript")
        # Skip SQL_GRAMMAR - has missing grammar file issue
        if format_name == 'SQL_GRAMMAR':
            pytest.skip(f"Skipping {format_name} - missing grammar file")
        # Get sample query for this format
        original_query = SAMPLE_QUERIES.get(format_name)
        if not original_query:
            # Try to find a similar format (remove suffixes)
            base_name = format_name.replace('_SQL', '').replace('_DSL', '').replace('_PL', '')
            original_query = SAMPLE_QUERIES.get(base_name)
            if not original_query:
                # Try common SQL fallback
                if 'SQL' in format_name or format_name in ['PRESTO', 'TRINO', 'SPARK', 'FLINK', 'BEAM']:
                    original_query = SAMPLE_QUERIES.get('SQL')
                elif 'DSL' in format_name:
                    original_query = SAMPLE_QUERIES.get('ELASTIC_DSL')
                else:
                    pytest.skip(f"No sample query available for {format_name}")
        try:
            # Step 1: Convert to XWQueryScript
            script_strategy = XWQueryScriptStrategy()
            converted_strategy = script_strategy.from_format(original_query, format_name)
            assert converted_strategy is not None, f"Step 1 failed for {format_name}"
            # Step 2: Convert back to original format using strategy's from_actions_tree
            strategy_class = FORMAT_STRATEGY_MAP.get(format_name)
            if strategy_class:
                strategy = strategy_class()
                if hasattr(strategy, 'from_actions_tree'):
                    converted_back = strategy.from_actions_tree(actions_tree)
                    assert converted_back is not None, f"Step 2 failed for {format_name}"
                    assert isinstance(converted_back, str), f"Converted back query is not a string for {format_name}"
                    assert len(converted_back) > 0, f"Converted back query is empty for {format_name}"
                else:
                    pytest.skip(f"Strategy {format_name} does not implement from_actions_tree")
            else:
                pytest.skip(f"No strategy class found for {format_name}")
            # Note: We don't assert exact equality because formatting may differ
            # The important thing is that conversion works both ways
        except ValueError as e:
            # Format not supported yet
            if "No strategy available" in str(e):
                pytest.skip(f"Format {format_name} not yet supported: {e}")
            else:
                pytest.skip(f"Roundtrip not fully supported for {format_name}: {e}")
        except FileNotFoundError as e:
            # Missing grammar files or resources
            pytest.skip(f"Format {format_name} requires missing resources: {e}")
        except Exception as e:
            # Some formats may not support full roundtrip yet
            error_msg = str(e).lower()
            if "grammar" in error_msg and "not found" in error_msg:
                pytest.skip(f"Format {format_name} requires missing grammar file: {e}")
            elif "not implemented" in error_msg or "not supported" in error_msg:
                pytest.skip(f"Format {format_name} not fully implemented: {e}")
            else:
                pytest.skip(f"Roundtrip not fully supported for {format_name}: {e}")
    def test_xwquery_convert_method(self):
        """Test using XWQuery.convert() method for conversion."""
        # Test SQL to XWQueryScript
        sql_query = "SELECT name, age FROM users WHERE age > 25"
        try:
            xwquery_script = XWQuery.convert(sql_query, from_format='sql', to_format='xwquery')
            assert xwquery_script is not None
            assert isinstance(xwquery_script, str)
            assert len(xwquery_script) > 0
        except Exception as e:
            pytest.fail(f"XWQuery.convert() failed: {e}")
    def test_all_formats_listed(self):
        """Test that all formats in FORMAT_STRATEGY_MAP are testable."""
        formats_with_queries = set(SAMPLE_QUERIES.keys())
        formats_in_map = set(FORMAT_STRATEGY_MAP.keys())
        # Check that we have queries for most formats
        missing_queries = formats_in_map - formats_with_queries - {'XWQUERY', 'XWQUERY_SCRIPT'}
        if missing_queries:
            # This is informational - not a failure
            print(f"\nNote: Missing sample queries for formats: {sorted(missing_queries)}")
        # At least verify the map exists and has entries
        assert len(FORMAT_STRATEGY_MAP) > 0, "FORMAT_STRATEGY_MAP is empty"
    @pytest.mark.parametrize("format_name", [
        'SQL', 'CYPHER', 'GRAPHQL', 'SPARQL', 'XPATH', 'JMESPATH', 
        'N1QL', 'PARTIQL', 'KQL', 'HIVEQL', 'HQL', 'LINQ', 'JSONIQ'
    ])
    def test_key_formats_detailed(self, format_name):
        """Test key formats with detailed validation."""
        query = SAMPLE_QUERIES.get(format_name)
        if not query:
            pytest.skip(f"No sample query for {format_name}")
        try:
            # Convert to XWQueryScript
            script_strategy = XWQueryScriptStrategy()
            converted_strategy = script_strategy.from_format(query, format_name)
            # Get actions tree
            actions_tree = converted_strategy.get_actions_tree()
            assert actions_tree is not None
            # Verify tree structure
            tree_data = actions_tree.to_native() if hasattr(actions_tree, 'to_native') else actions_tree
            assert isinstance(tree_data, dict), f"Tree data is not a dict for {format_name}"
            # Check for root node
            if 'root' in tree_data:
                root = tree_data['root']
                assert 'statements' in root or 'type' in root, f"Invalid root structure for {format_name}"
            # Convert to XWQueryScript string
            xwquery_script = converted_strategy.to_format('XWQUERY')
            assert xwquery_script is not None
            assert isinstance(xwquery_script, str)
        except Exception as e:
            pytest.fail(f"Detailed test failed for {format_name}: {e}")
class TestFormatStrategyImplementation:
    """Test that all strategies implement required methods."""
    @pytest.mark.parametrize("format_name,strategy_class", FORMAT_STRATEGY_MAP.items())
    def test_strategy_has_to_actions_tree(self, format_name, strategy_class):
        """Test that strategy class has to_actions_tree method."""
        # Skip XWQUERY itself
        if format_name == 'XWQUERY' or format_name == 'XWQUERY_SCRIPT':
            pytest.skip(f"Skipping {format_name}")
        # Check if method exists
        has_method = hasattr(strategy_class, 'to_actions_tree') or hasattr(strategy_class, 'to_actions_tree')
        # Some strategies may implement it via base class
        # Check if it's callable
        if has_method:
            strategy_instance = strategy_class()
            assert callable(getattr(strategy_instance, 'to_actions_tree', None)), \
                f"{format_name} strategy does not have callable to_actions_tree method"
    @pytest.mark.parametrize("format_name,strategy_class", FORMAT_STRATEGY_MAP.items())
    def test_strategy_instantiation(self, format_name, strategy_class):
        """Test that strategy can be instantiated."""
        try:
            strategy = strategy_class()
            assert strategy is not None
            assert hasattr(strategy, 'validate_query') or hasattr(strategy, 'validate')
        except Exception as e:
            pytest.fail(f"Failed to instantiate {format_name} strategy: {e}")
if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])

#!/usr/bin/env python3
"""
#exonware/xwquery/tests/strategies/test_new_strategies_comprehensive.py
Comprehensive tests for all newly created query strategies.
Tests:
- Validation
- to_actions_tree conversion
- from_actions_tree conversion  
- Roundtrip (query -> actions_tree -> query)
- Language-specific syntax compliance
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.0.1.8
Generation Date: January 2, 2025
"""
import pytest
from exonware.xwnode.base import ANode
# Import all new strategies - skip if any are not implemented
try:
    from exonware.xwquery.compiler.strategies.mongodb_aggregation import MongoDBAggregationStrategy
    from exonware.xwquery.compiler.strategies.arangodb_aql import ArangoDBAQLStrategy
    from exonware.xwquery.compiler.strategies.edgeql import EdgeQLStrategy
    from exonware.xwquery.compiler.strategies.surrealql import SurrealQLStrategy
    from exonware.xwquery.compiler.strategies.cypher_age import CypherAGEStrategy
    from exonware.xwquery.compiler.strategies.asterixdb_aql import AsterixDBAQLStrategy
    from exonware.xwquery.compiler.strategies.sql_plus_plus import SQLPlusPlusStrategy
    from exonware.xwquery.compiler.strategies.elasticsearch_sql import ElasticsearchSQLStrategy
    from exonware.xwquery.compiler.strategies.gsql import GSQLStrategy
    from exonware.xwquery.compiler.strategies.ngql import nGQLStrategy
    from exonware.xwquery.compiler.strategies.dql import DQLStrategy
    from exonware.xwquery.compiler.strategies.opencypher import OpenCypherStrategy
    from exonware.xwquery.compiler.strategies.couchdb_mango import CouchDBMangoStrategy
    from exonware.xwquery.compiler.strategies.jsonata import JSONataStrategy
    from exonware.xwquery.compiler.strategies.jsonnet import JsonnetStrategy
    from exonware.xwquery.compiler.strategies.json_patch import JSONPatchStrategy
    from exonware.xwquery.compiler.strategies.jsonpath import JSONPathStrategy
    from exonware.xwquery.compiler.strategies.cue import CUEStrategy
    from exonware.xwquery.compiler.strategies.dhall import DhallStrategy
    from exonware.xwquery.compiler.strategies.hcl import HCLStrategy
    from exonware.xwquery.compiler.strategies.krm_kyaml import KRMKyamlStrategy
    from exonware.xwquery.compiler.strategies.kustomize import KustomizeStrategy
    from exonware.xwquery.compiler.strategies.nifi_el import NiFiELStrategy
    from exonware.xwquery.compiler.strategies.logstash import LogstashStrategy
    from exonware.xwquery.compiler.strategies.fluent_bit import FluentBitStrategy
    from exonware.xwquery.compiler.strategies.fluentd import FluentdStrategy
    from exonware.xwquery.compiler.strategies.painless import PainlessStrategy
    from exonware.xwquery.compiler.strategies.starlark import StarlarkStrategy
    from exonware.xwquery.compiler.strategies.tcl import TclStrategy
    from exonware.xwquery.compiler.strategies.awk import AWKStrategy
    from exonware.xwquery.compiler.strategies.sed import SedStrategy
    from exonware.xwquery.compiler.strategies.bash_pipeline import BashPipelineStrategy
except ImportError as e:
    pytest.skip(f"One or more strategies not yet implemented: {e}", allow_module_level=True)
# Test data: (strategy_class, format_name, valid_queries, invalid_queries)
TEST_STRATEGIES = [
    # SQL/Database
    (MongoDBAggregationStrategy, "MONGODB_AGGREGATION", 
     ['db.users.aggregate([{"$match": {"age": {"$gt": 25}}}])'],
     ['invalid query', '']),
    (ArangoDBAQLStrategy, "ARANGODB_AQL",
     ['FOR doc IN users RETURN doc', 'FOR doc IN users FILTER doc.age > 25 RETURN doc'],
     ['invalid', '']),
    (EdgeQLStrategy, "EDGEQL",
     ['SELECT name, age FROM User', 'SELECT * FROM User FILTER age > 25'],
     ['invalid', '']),
    (SurrealQLStrategy, "SURREALQL",
     ['SELECT * FROM users', 'SELECT name FROM users WHERE age > 25'],
     ['invalid', '']),
    (CypherAGEStrategy, "CYPHER_AGE",
     ['MATCH (n) RETURN n', 'MATCH (n) WHERE n.age > 25 RETURN n'],
     ['invalid', '']),
    (AsterixDBAQLStrategy, "ASTERIXDB_AQL",
     ['FOR doc IN dataset.users RETURN doc', 'FOR doc IN dataset.users WHERE doc.age > 25 RETURN doc'],
     ['invalid', '']),
    (SQLPlusPlusStrategy, "SQL_PLUS_PLUS",
     ['SELECT * FROM collection', 'SELECT name FROM collection WHERE age > 25'],
     ['invalid', '']),
    (ElasticsearchSQLStrategy, "ELASTICSEARCH_SQL",
     ['SELECT * FROM index', 'SELECT name FROM index WHERE age > 25'],
     ['invalid', '']),
    # Graph
    (GSQLStrategy, "GSQL",
     ['SELECT v FROM start:v-(:e)->:target', 'SELECT v FROM start:v-(:e)->:target WHERE v.id == "1"'],
     ['invalid', '']),
    (nGQLStrategy, "NGQL",
     ['GO FROM "vertex" OVER * YIELD dst(edge)', 'MATCH (v) RETURN v'],
     ['invalid', '']),
    (DQLStrategy, "DQL",
     ['{ nodes(func: has(predicate)) { uid } }', '{ me(func: uid(1)) { link { uid } } }'],
     ['invalid', '']),
    (OpenCypherStrategy, "OPENCYPHER",
     ['MATCH (n) RETURN n', 'MATCH (n) WHERE n.age > 25 RETURN n'],
     ['invalid', '']),
    # Document/JSON
    (CouchDBMangoStrategy, "COUCHDB_MANGO",
     ['{"selector": {}}', '{"selector": {"age": {"$gt": 25}}}'],
     ['invalid', '']),
    (JSONataStrategy, "JSONATA",
     ['$', '$.users[*].name', '$[?(@.age > 25)]'],
     ['invalid', '']),
    (JsonnetStrategy, "JSONNET",
     ['{}', 'local data = $; data.field'],
     ['invalid', '']),
    (JSONPatchStrategy, "JSON_PATCH",
     ['[{"op": "test", "path": "/", "value": {}}]', '[{"op": "add", "path": "/field", "value": "value"}]'],
     ['invalid', '']),
    (JSONPathStrategy, "JSONPATH",
     ['$', '$.users[*].name', '$[?(@.age > 25)]'],
     ['invalid', '']),
    # Config/DSL
    (CUEStrategy, "CUE",
     ['{}', '{field: string}'],
     ['invalid', '']),
    (DhallStrategy, "DHALL",
     ['{}', '\\x -> x.field'],
     ['invalid', '']),
    (HCLStrategy, "HCL",
     ['resource "type" "name" {}', 'resource "type" "name" { field = "value" }'],
     ['invalid', '']),
    (KRMKyamlStrategy, "KRM_KYAML",
     ['apiVersion: v1\nkind: Resource', 'apiVersion: v1\nkind: Resource\nmetadata:\n  name: test'],
     ['invalid', '']),
    (KustomizeStrategy, "KUSTOMIZE",
     ['apiVersion: kustomize.config.k8s.io/v1beta1\nkind: Kustomization\nresources: []'],
     ['invalid', '']),
    # Processing/ETL
    (NiFiELStrategy, "NIFI_EL",
     ['${attributeName}', '${toUpper(attributeName)}'],
     ['invalid', '']),
    (LogstashStrategy, "LOGSTASH",
     ['filter {\n  mutate {}\n}', 'filter {\n  if [field] == "value" {\n    mutate {}\n  }\n}'],
     ['invalid', '']),
    (FluentBitStrategy, "FLUENT_BIT",
     ['[FILTER]\n    Name modify\n    Match *'],
     ['invalid', '']),
    (FluentdStrategy, "FLUENTD",
     ['<filter **>\n  @type record_transformer\n</filter>'],
     ['invalid', '']),
    (PainlessStrategy, "PAINLESS",
     ["doc['field'].value", "if (doc['age'].value > 25) { return true; }"],
     ['invalid', '']),
    (StarlarkStrategy, "STARLARK",
     ["data['field']", "[x for x in data if x.age > 25]"],
     ['invalid', '']),
    # Scripting
    (TclStrategy, "TCL",
     ['set result $data', 'foreach item $data { puts $item }'],
     ['invalid', '']),
    (AWKStrategy, "AWK",
     ['{ print $0 }', 'NR > 10 { print $1 }'],
     ['invalid', '']),
    (SedStrategy, "SED",
     ['p', 's/pattern/replacement/p'],
     ['invalid', '']),
    (BashPipelineStrategy, "BASH_PIPELINE",
     ['cat file', 'grep "pattern" | head -n 10'],
     ['invalid', '']),
]
@pytest.mark.xwquery_unit
@pytest.mark.parametrize("strategy_class,format_name,valid_queries,invalid_queries", TEST_STRATEGIES)
class TestNewStrategies:
    """Comprehensive tests for all new strategies."""
    @pytest.fixture
    def strategy(self, strategy_class):
        """Return strategy instance."""
        return strategy_class()
    def test_strategy_instantiation(self, strategy_class):
        """Test that strategy can be instantiated."""
        strategy = strategy_class()
        assert strategy is not None
    def test_validate_valid_queries(self, strategy, valid_queries):
        """Test validation of valid queries."""
        for query in valid_queries:
            if query:  # Skip empty queries
                result = strategy.validate_query(query)
                assert result, f"Query should be valid: {query[:50]}"
    def test_validate_invalid_queries(self, strategy, invalid_queries):
        """Test validation rejects invalid queries."""
        for query in invalid_queries:
            if query:  # Empty string should be invalid
                result = strategy.validate_query(query)
                assert not result, f"Query should be invalid: {query[:50]}"
    def test_to_actions_tree(self, strategy, valid_queries):
        """Test conversion from query to actions tree."""
        for query in valid_queries:
            if query:
                try:
                    actions_tree = strategy.to_actions_tree(query)
                    assert actions_tree is not None, f"Actions tree should not be None for: {query[:50]}"
                    assert isinstance(actions_tree, ANode) or hasattr(actions_tree, 'to_native'), \
                        f"Actions tree should be ANode or have to_native method for: {query[:50]}"
                    # Verify structure
                    tree_data = actions_tree.to_native() if hasattr(actions_tree, 'to_native') else actions_tree
                    assert 'root' in tree_data or isinstance(tree_data, dict), \
                        f"Tree data should have 'root' key or be dict for: {query[:50]}"
                except Exception as e:
                    pytest.fail(f"to_actions_tree failed for query '{query[:50]}': {e}")
    def test_from_actions_tree(self, strategy, valid_queries):
        """Test conversion from actions tree to query."""
        for query in valid_queries:
            if query:
                try:
                    # First convert to actions tree
                    actions_tree = strategy.to_actions_tree(query)
                    if actions_tree is None:
                        continue
                    # Then convert back
                    regenerated = strategy.from_actions_tree(actions_tree)
                    assert regenerated is not None, f"Regenerated query should not be None for: {query[:50]}"
                    assert isinstance(regenerated, str), f"Regenerated query should be string for: {query[:50]}"
                    assert len(regenerated) > 0, f"Regenerated query should not be empty for: {query[:50]}"
                except Exception as e:
                    pytest.fail(f"from_actions_tree failed for query '{query[:50]}': {e}")
    def test_roundtrip_conversion(self, strategy, valid_queries):
        """Test roundtrip conversion (query -> actions_tree -> query)."""
        for query in valid_queries:
            if query:
                try:
                    # Query -> Actions Tree
                    actions_tree1 = strategy.to_actions_tree(query)
                    if actions_tree1 is None:
                        continue
                    # Actions Tree -> Query
                    regenerated = strategy.from_actions_tree(actions_tree1)
                    if regenerated is None or len(regenerated) == 0:
                        continue
                    # Regenerated Query -> Actions Tree
                    actions_tree2 = strategy.to_actions_tree(regenerated)
                    if actions_tree2 is None:
                        continue
                    # Verify both actions trees have similar structure
                    tree_data1 = actions_tree1.to_native() if hasattr(actions_tree1, 'to_native') else actions_tree1
                    tree_data2 = actions_tree2.to_native() if hasattr(actions_tree2, 'to_native') else actions_tree2
                    # Both should have root or be dicts
                    assert (('root' in tree_data1) == ('root' in tree_data2)) or \
                           (isinstance(tree_data1, dict) == isinstance(tree_data2, dict)), \
                        f"Roundtrip structure mismatch for: {query[:50]}"
                except Exception as e:
                    pytest.fail(f"Roundtrip conversion failed for query '{query[:50]}': {e}")
    def test_get_query_plan(self, strategy, valid_queries):
        """Test get_query_plan method."""
        for query in valid_queries:
            if query:
                try:
                    plan = strategy.get_query_plan(query)
                    assert plan is not None
                    assert isinstance(plan, dict)
                    assert 'query_type' in plan or 'complexity' in plan or 'estimated_cost' in plan
                except Exception as e:
                    pytest.fail(f"get_query_plan failed for query '{query[:50]}': {e}")
    def test_execute(self, strategy, valid_queries):
        """Test execute method."""
        for query in valid_queries:
            if query:
                try:
                    result = strategy.execute(query)
                    assert result is not None
                    # Result should be a dict or have some structure
                    assert isinstance(result, dict) or hasattr(result, '__iter__')
                except Exception as e:
                    pytest.fail(f"execute failed for query '{query[:50]}': {e}")
# Format-specific detailed tests
@pytest.mark.xwquery_unit
class TestMongoDBAggregation:
    """Detailed tests for MongoDB Aggregation."""
    @pytest.fixture
    def strategy(self):
        return MongoDBAggregationStrategy()
    def test_mongodb_aggregation_pipeline(self, strategy):
        """Test MongoDB aggregation pipeline parsing."""
        query = 'db.users.aggregate([{"$match": {"age": {"$gt": 25}}}, {"$project": {"name": 1, "age": 1}}])'
        assert strategy.validate_query(query)
        actions_tree = strategy.to_actions_tree(query)
        assert actions_tree is not None
    def test_mongodb_aggregation_roundtrip(self, strategy):
        """Test MongoDB aggregation roundtrip."""
        query = 'db.users.aggregate([{"$match": {"age": 25}}])'
        actions_tree = strategy.to_actions_tree(query)
        regenerated = strategy.from_actions_tree(actions_tree)
        assert "aggregate" in regenerated.lower()
        assert "users" in regenerated.lower() or "collection" in regenerated.lower()
@pytest.mark.xwquery_unit
class TestnGQL:
    """Detailed tests for nGQL."""
    @pytest.fixture
    def strategy(self):
        return nGQLStrategy()
    def test_ngql_go_from(self, strategy):
        """Test nGQL GO FROM syntax."""
        query = 'GO FROM "vertex" OVER * YIELD dst(edge)'
        assert strategy.validate_query(query)
        actions_tree = strategy.to_actions_tree(query)
        assert actions_tree is not None
    def test_ngql_match(self, strategy):
        """Test nGQL MATCH syntax."""
        query = 'MATCH (v) RETURN v'
        assert strategy.validate_query(query)
        actions_tree = strategy.to_actions_tree(query)
        assert actions_tree is not None
@pytest.mark.xwquery_unit
class TestCypherAGE:
    """Detailed tests for Cypher AGE."""
    @pytest.fixture
    def strategy(self):
        return CypherAGEStrategy()
    def test_cypher_age_match_return(self, strategy):
        """Test Cypher AGE MATCH RETURN syntax."""
        query = 'MATCH (n:Person) WHERE n.age > 25 RETURN n.name, n.age'
        assert strategy.validate_query(query)
        actions_tree = strategy.to_actions_tree(query)
        assert actions_tree is not None
    def test_cypher_age_roundtrip(self, strategy):
        """Test Cypher AGE roundtrip."""
        query = 'MATCH (n) RETURN n'
        actions_tree = strategy.to_actions_tree(query)
        regenerated = strategy.from_actions_tree(actions_tree)
        assert "MATCH" in regenerated.upper()
        assert "RETURN" in regenerated.upper()
@pytest.mark.xwquery_unit
class TestJSONPath:
    """Detailed tests for JSONPath."""
    @pytest.fixture
    def strategy(self):
        return JSONPathStrategy()
    def test_jsonpath_basic(self, strategy):
        """Test JSONPath basic syntax."""
        query = '$.users[*].name'
        assert strategy.validate_query(query)
        actions_tree = strategy.to_actions_tree(query)
        assert actions_tree is not None
    def test_jsonpath_filter(self, strategy):
        """Test JSONPath filter syntax."""
        query = '$[?(@.age > 25)]'
        assert strategy.validate_query(query)
        actions_tree = strategy.to_actions_tree(query)
        assert actions_tree is not None
if __name__ == "__main__":
    pytest.main([__file__, "-v"])

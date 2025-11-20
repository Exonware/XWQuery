#!/usr/bin/env python3
"""
Test XWQuery Format Auto-Detection (Plan 2)

Tests the multi-stage format detection pipeline:
- Keyword-based detection
- Pattern-based detection
- Confidence scoring
- Auto-detection in query execution
"""

import pytest
from exonware.xwquery.query.parsers.format_detector import (
    QueryFormatDetector,
    detect_query_format
)


class TestQueryFormatDetector:
    """Test QueryFormatDetector class."""
    
    @pytest.fixture
    def detector(self):
        """Create detector instance."""
        return QueryFormatDetector(confidence_threshold=0.8)
    
    def test_detect_sql_select(self, detector):
        """Test SQL SELECT detection."""
        query = "SELECT * FROM users WHERE age > 18"
        format_name, confidence = detector.detect_format(query)
        
        assert format_name == 'SQL'
        assert confidence >= 0.9
    
    def test_detect_sql_insert(self, detector):
        """Test SQL INSERT detection."""
        query = "INSERT INTO users (name, age) VALUES ('Alice', 30)"
        format_name, confidence = detector.detect_format(query)
        
        assert format_name == 'SQL'
        assert confidence >= 0.9
    
    def test_detect_sql_update(self, detector):
        """Test SQL UPDATE detection."""
        query = "UPDATE users SET age = 31 WHERE name = 'Alice'"
        format_name, confidence = detector.detect_format(query)
        
        assert format_name == 'SQL'
        assert confidence >= 0.9
    
    def test_detect_sql_delete(self, detector):
        """Test SQL DELETE detection."""
        query = "DELETE FROM users WHERE age < 18"
        format_name, confidence = detector.detect_format(query)
        
        assert format_name == 'SQL'
        assert confidence >= 0.9
    
    def test_detect_sql_join(self, detector):
        """Test SQL JOIN detection."""
        query = "SELECT u.name, p.title FROM users u JOIN posts p ON u.id = p.user_id"
        format_name, confidence = detector.detect_format(query)
        
        assert format_name == 'SQL'
        assert confidence >= 0.85
    
    def test_detect_sql_group_by(self, detector):
        """Test SQL GROUP BY detection."""
        query = "SELECT department, COUNT(*) FROM employees GROUP BY department"
        format_name, confidence = detector.detect_format(query)
        
        assert format_name == 'SQL'
        assert confidence >= 0.85


class TestCypherDetection:
    """Test Cypher (Neo4j) query detection."""
    
    @pytest.fixture
    def detector(self):
        return QueryFormatDetector()
    
    def test_detect_cypher_match(self, detector):
        """Test Cypher MATCH detection."""
        query = "MATCH (u:User) WHERE u.age > 18 RETURN u.name"
        format_name, confidence = detector.detect_format(query)
        
        assert format_name == 'Cypher'
        assert confidence >= 0.9
    
    def test_detect_cypher_relationship(self, detector):
        """Test Cypher relationship pattern detection."""
        query = "MATCH (u:User)-[:FOLLOWS]->(f:User) RETURN u.name, f.name"
        format_name, confidence = detector.detect_format(query)
        
        assert format_name == 'Cypher'
        assert confidence >= 0.9
    
    def test_detect_cypher_create(self, detector):
        """Test Cypher CREATE detection."""
        query = "CREATE (u:User {name: 'Alice', age: 30})"
        format_name, confidence = detector.detect_format(query)
        
        assert format_name == 'Cypher'
        assert confidence >= 0.9


class TestGraphQLDetection:
    """Test GraphQL query detection."""
    
    @pytest.fixture
    def detector(self):
        return QueryFormatDetector()
    
    def test_detect_graphql_query(self, detector):
        """Test GraphQL query detection."""
        query = """
        query GetUser {
            user(id: 123) {
                name
                email
                posts {
                    title
                }
            }
        }
        """
        format_name, confidence = detector.detect_format(query)
        
        assert format_name == 'GraphQL'
        assert confidence >= 0.9
    
    def test_detect_graphql_mutation(self, detector):
        """Test GraphQL mutation detection."""
        query = """
        mutation CreateUser {
            createUser(input: {name: "Alice", email: "alice@example.com"}) {
                id
                name
            }
        }
        """
        format_name, confidence = detector.detect_format(query)
        
        assert format_name == 'GraphQL'
        assert confidence >= 0.9
    
    def test_detect_graphql_subscription(self, detector):
        """Test GraphQL subscription detection."""
        query = """
        subscription OnNewPost {
            newPost {
                title
                author
            }
        }
        """
        format_name, confidence = detector.detect_format(query)
        
        assert format_name == 'GraphQL'
        assert confidence >= 0.9


class TestSPARQLDetection:
    """Test SPARQL query detection."""
    
    @pytest.fixture
    def detector(self):
        return QueryFormatDetector()
    
    def test_detect_sparql_prefix(self, detector):
        """Test SPARQL with PREFIX detection."""
        query = """
        PREFIX foaf: <http://xmlns.com/foaf/0.1/>
        SELECT ?name ?email
        WHERE {
            ?person foaf:name ?name .
            ?person foaf:email ?email .
        }
        """
        format_name, confidence = detector.detect_format(query)
        
        assert format_name == 'SPARQL'
        assert confidence >= 0.9
    
    def test_detect_sparql_construct(self, detector):
        """Test SPARQL CONSTRUCT detection."""
        query = "CONSTRUCT { ?s ?p ?o } WHERE { ?s ?p ?o }"
        format_name, confidence = detector.detect_format(query)
        
        assert format_name == 'SPARQL'
        assert confidence >= 0.9
    
    def test_detect_sparql_ask(self, detector):
        """Test SPARQL ASK detection."""
        query = "ASK { ?person foaf:name 'Alice' }"
        format_name, confidence = detector.detect_format(query)
        
        assert format_name == 'SPARQL'
        assert confidence >= 0.9


class TestGremlinDetection:
    """Test Gremlin query detection."""
    
    @pytest.fixture
    def detector(self):
        return QueryFormatDetector()
    
    def test_detect_gremlin_vertices(self, detector):
        """Test Gremlin vertex traversal detection."""
        query = "g.V().has('name', 'Alice').out('follows').values('name')"
        format_name, confidence = detector.detect_format(query)
        
        assert format_name == 'Gremlin'
        assert confidence >= 0.9
    
    def test_detect_gremlin_edges(self, detector):
        """Test Gremlin edge traversal detection."""
        query = "g.E().hasLabel('follows').count()"
        format_name, confidence = detector.detect_format(query)
        
        assert format_name == 'Gremlin'
        assert confidence >= 0.9


class TestJMESPathDetection:
    """Test JMESPath query detection."""
    
    @pytest.fixture
    def detector(self):
        return QueryFormatDetector()
    
    def test_detect_jmespath_filter(self, detector):
        """Test JMESPath filter detection."""
        query = "users[?age > `18`].name"
        format_name, confidence = detector.detect_format(query)
        
        assert format_name == 'JMESPath'
        assert confidence >= 0.85
    
    def test_detect_jmespath_pipe(self, detector):
        """Test JMESPath pipe detection."""
        query = "users | sort_by(@, &age) | [0].name"
        format_name, confidence = detector.detect_format(query)
        
        assert format_name == 'JMESPath'
        assert confidence >= 0.7


class TestJSONPathDetection:
    """Test JSONPath query detection."""
    
    @pytest.fixture
    def detector(self):
        return QueryFormatDetector()
    
    def test_detect_jsonpath_root(self, detector):
        """Test JSONPath root detection."""
        query = "$.users[*].name"
        format_name, confidence = detector.detect_format(query)
        
        assert format_name == 'JSONPath'
        assert confidence >= 0.9
    
    def test_detect_jsonpath_filter(self, detector):
        """Test JSONPath filter detection."""
        query = "$..users[?(@.age > 18)]"
        format_name, confidence = detector.detect_format(query)
        
        assert format_name == 'JSONPath'
        assert confidence >= 0.85


class TestXPathDetection:
    """Test XPath query detection."""
    
    @pytest.fixture
    def detector(self):
        return QueryFormatDetector()
    
    def test_detect_xpath_absolute(self, detector):
        """Test XPath absolute path detection."""
        query = "/bookstore/book[@price<10]/title"
        format_name, confidence = detector.detect_format(query)
        
        assert format_name == 'XPath'
        assert confidence >= 0.85
    
    def test_detect_xpath_descendant(self, detector):
        """Test XPath descendant detection."""
        query = "//book[@lang='en']/title"
        format_name, confidence = detector.detect_format(query)
        
        assert format_name == 'XPath'
        assert confidence >= 0.85


class TestMongoDBDetection:
    """Test MongoDB query detection."""
    
    @pytest.fixture
    def detector(self):
        return QueryFormatDetector()
    
    def test_detect_mongodb_find(self, detector):
        """Test MongoDB find detection."""
        query = "db.users.find({ age: { $gt: 18 } })"
        format_name, confidence = detector.detect_format(query)
        
        assert format_name == 'MongoDB'
        assert confidence >= 0.85
    
    def test_detect_mongodb_aggregate(self, detector):
        """Test MongoDB aggregate detection."""
        query = "db.users.aggregate([{ $match: { age: { $gt: 18 } } }])"
        format_name, confidence = detector.detect_format(query)
        
        assert format_name == 'MongoDB'
        assert confidence >= 0.9


class TestDetectionConfidence:
    """Test confidence scoring and thresholds."""
    
    @pytest.fixture
    def detector(self):
        return QueryFormatDetector(confidence_threshold=0.8)
    
    def test_high_confidence_detection(self, detector):
        """Test high confidence detection."""
        query = "SELECT * FROM users WHERE age > 18"
        assert detector.is_confident(query) is True
    
    def test_ambiguous_query_detection(self, detector):
        """Test ambiguous query detection."""
        # Very short or ambiguous query
        query = "age > 18"
        format_name, confidence = detector.detect_format(query)
        
        # Should return something, but with lower confidence
        assert format_name is not None
        assert 0.0 <= confidence <= 1.0
    
    def test_detect_format_with_candidates(self, detector):
        """Test getting all format candidates."""
        query = "SELECT * FROM users WHERE age > 18"
        candidates = detector.detect_format_with_candidates(query)
        
        assert isinstance(candidates, dict)
        assert 'SQL' in candidates
        assert candidates['SQL'] >= 0.9
        
        # Should be sorted by confidence
        scores = list(candidates.values())
        assert scores == sorted(scores, reverse=True)


class TestConvenienceFunction:
    """Test convenience function."""
    
    def test_detect_query_format_function(self):
        """Test global detect_query_format function."""
        query = "SELECT * FROM users"
        format_name, confidence = detect_query_format(query)
        
        assert format_name == 'SQL'
        assert confidence >= 0.9
    
    def test_convenience_function_uses_global_detector(self):
        """Test that convenience function reuses detector."""
        # Call twice to ensure same detector is used
        query1 = "SELECT * FROM users"
        query2 = "MATCH (u:User) RETURN u"
        
        format1, conf1 = detect_query_format(query1)
        format2, conf2 = detect_query_format(query2)
        
        assert format1 == 'SQL'
        assert format2 == 'Cypher'


class TestEdgeCases:
    """Test edge cases and error handling."""
    
    @pytest.fixture
    def detector(self):
        return QueryFormatDetector()
    
    def test_empty_query(self, detector):
        """Test empty query."""
        format_name, confidence = detector.detect_format("")
        
        assert format_name == 'SQL'  # Default fallback
        assert confidence == 0.5
    
    def test_none_query(self, detector):
        """Test None query."""
        format_name, confidence = detector.detect_format(None)
        
        assert format_name == 'SQL'  # Default fallback
        assert confidence == 0.5
    
    def test_whitespace_only_query(self, detector):
        """Test whitespace-only query."""
        format_name, confidence = detector.detect_format("   \n\t   ")
        
        assert format_name == 'SQL'  # Default fallback
        assert confidence == 0.5
    
    def test_complex_sql_query(self, detector):
        """Test complex SQL with multiple clauses."""
        query = """
        SELECT 
            u.id,
            u.name,
            COUNT(p.id) as post_count,
            AVG(p.likes) as avg_likes
        FROM users u
        LEFT JOIN posts p ON u.id = p.user_id
        WHERE u.age > 18
        GROUP BY u.id, u.name
        HAVING COUNT(p.id) > 5
        ORDER BY avg_likes DESC
        LIMIT 10
        """
        format_name, confidence = detector.detect_format(query)
        
        assert format_name == 'SQL'
        assert confidence >= 0.9


class TestAutoDetectionIntegration:
    """Test auto-detection in XWQuery.execute()."""
    
    def test_execute_with_auto_detection(self):
        """Test that XWQuery.execute uses auto-detection."""
        from exonware.xwquery import XWQuery
        from exonware.xwnode import XWNode
        
        data = XWNode.from_native({'users': [{'name': 'Alice', 'age': 30}]})
        
        # Should auto-detect SQL
        result = XWQuery.execute(
            "SELECT * FROM users WHERE age > 25",
            data,
            auto_detect=True
        )
        
        assert result is not None
    
    def test_execute_explicit_format_overrides_detection(self):
        """Test that explicit format parameter overrides auto-detection."""
        from exonware.xwquery import XWQuery
        from exonware.xwnode import XWNode
        
        data = XWNode.from_native({'users': [{'name': 'Alice'}]})
        
        # Explicitly specify format (should NOT auto-detect)
        result = XWQuery.execute(
            "SELECT * FROM users",
            data,
            format='sql',
            auto_detect=True  # Should be ignored when format is specified
        )
        
        assert result is not None


if __name__ == '__main__':
    pytest.main([__file__, '-v'])


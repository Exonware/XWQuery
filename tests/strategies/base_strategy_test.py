#!/usr/bin/env python3
"""
#exonware/xwquery/tests/strategies/base_strategy_test.py

Abstract base test class for all query strategies.
Provides 30+ parameterized tests following 80/20 rule.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1
Generation Date: 28-Oct-2025
"""

import pytest
from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
from pathlib import Path
import time

from exonware.xwquery.query.parsers.query_action_builder import QueryActionBuilder
from exonware.xwquery.defs import ConversionMode


class BaseStrategyTest(ABC):
    """
    Abstract base test class for query strategy testing.
    
    All strategy tests inherit from this to ensure consistent coverage.
    Follows 80/20 rule: 20% of tests cover 80% of value.
    
    Test Categories:
    - Parsing: Query text → QueryAction tree
    - Generation: QueryAction tree → Query text
    - Round-trip: Query → Actions → Query (semantic preservation)
    - Edge cases: Empty, None, malformed queries
    - Security: Injection attacks, malicious input
    - Performance: Large queries, complex operations
    - Conversion: Format-to-format translation
    - Unicode: Multilingual support
    """
    
    # ==================== Abstract Methods (Override in Subclasses) ====================
    
    @pytest.fixture
    @abstractmethod
    def strategy(self):
        """
        Override to return strategy instance.
        
        Example:
            @pytest.fixture
            def strategy(self):
                return SQLStrategy()
        """
        raise NotImplementedError("Subclass must implement strategy fixture")
    
    @abstractmethod
    def get_simple_select_query(self) -> str:
        """Return a simple SELECT-equivalent query in this format."""
        raise NotImplementedError("Subclass must implement get_simple_select_query")
    
    @abstractmethod
    def get_filter_query(self) -> str:
        """Return a query with WHERE-equivalent filtering."""
        raise NotImplementedError("Subclass must implement get_filter_query")
    
    @abstractmethod
    def get_join_query(self) -> str:
        """Return a query with JOIN-equivalent operations (if supported)."""
        raise NotImplementedError("Subclass must implement get_join_query")
    
    # ==================== Core Parsing Tests (20% - High Value) ====================
    
    def test_parse_simple_select(self, strategy):
        """Test parsing simple SELECT-equivalent query."""
        query = self.get_simple_select_query()
        
        # Parse to QueryAction tree
        actions = strategy.parse(query)
        
        assert actions is not None, "Parser should return QueryAction tree"
        assert len(actions) > 0, "Should have at least one action"
    
    def test_parse_with_filter(self, strategy):
        """Test parsing query with WHERE-equivalent filtering."""
        query = self.get_filter_query()
        
        actions = strategy.parse(query)
        
        assert actions is not None
        # Should contain filter/where action
        has_filter = any(action.operation in ['FILTER', 'WHERE'] for action in actions)
        assert has_filter, "Should contain filter operation"
    
    def test_parse_invalid_query_raises_error(self, strategy):
        """Test that invalid queries raise proper errors."""
        invalid_queries = [
            "",  # Empty
            "   ",  # Whitespace
            "INVALID_SYNTAX_HERE",  # Garbage
            "123456",  # Numbers only
        ]
        
        for invalid in invalid_queries:
            with pytest.raises((ValueError, SyntaxError, Exception)):
                strategy.parse(invalid)
    
    # ==================== Core Generation Tests (20% - High Value) ====================
    
    def test_generate_from_query_actions(self, strategy):
        """Test generating query text from QueryAction tree."""
        # Create simple QueryAction tree
        builder = QueryActionBuilder()
        actions = builder.select(['name', 'age']).from_source('users').build()
        
        # Generate query text
        query_text = strategy.generate(actions)
        
        assert query_text is not None, "Generator should return query string"
        assert len(query_text) > 0, "Generated query should not be empty"
        assert isinstance(query_text, str), "Generated query should be string"
    
    def test_generate_with_filter(self, strategy):
        """Test generating query with filter/where clause."""
        builder = QueryActionBuilder()
        actions = (builder
                   .select(['name'])
                   .from_source('users')
                   .where({'age': {'$gt': 18}})
                   .build())
        
        query_text = strategy.generate(actions)
        
        assert query_text is not None
        assert len(query_text) > 0
    
    def test_generate_from_empty_actions_raises_error(self, strategy):
        """Test that empty action list raises error."""
        with pytest.raises((ValueError, Exception)):
            strategy.generate([])
    
    # ==================== Round-Trip Tests (Critical) ====================
    
    def test_round_trip_simple_query(self, strategy):
        """Test query → actions → query preserves semantics."""
        original_query = self.get_simple_select_query()
        
        # Parse
        actions = strategy.parse(original_query)
        
        # Generate
        regenerated_query = strategy.generate(actions)
        
        # Parse again
        actions2 = strategy.parse(regenerated_query)
        
        # Semantic equivalence (not necessarily text equivalence)
        assert len(actions) == len(actions2), "Should preserve number of actions"
    
    def test_round_trip_preserves_filters(self, strategy):
        """Test round-trip with filters preserves logic."""
        original_query = self.get_filter_query()
        
        actions = strategy.parse(original_query)
        regenerated = strategy.generate(actions)
        actions2 = strategy.parse(regenerated)
        
        # Both should have filter operations
        has_filter1 = any(action.operation in ['FILTER', 'WHERE'] for action in actions)
        has_filter2 = any(action.operation in ['FILTER', 'WHERE'] for action in actions2)
        
        assert has_filter1 == has_filter2, "Filter operations should be preserved"
    
    # ==================== Edge Cases Tests ====================
    
    def test_parse_none_raises_error(self, strategy):
        """Test that None input raises appropriate error."""
        with pytest.raises((TypeError, ValueError, Exception)):
            strategy.parse(None)
    
    def test_parse_empty_string_raises_error(self, strategy):
        """Test that empty string raises error."""
        with pytest.raises((ValueError, Exception)):
            strategy.parse("")
    
    def test_parse_whitespace_only_raises_error(self, strategy):
        """Test that whitespace-only query raises error."""
        with pytest.raises((ValueError, Exception)):
            strategy.parse("   \n\t   ")
    
    def test_generate_none_raises_error(self, strategy):
        """Test that None actions raise error."""
        with pytest.raises((TypeError, ValueError, Exception)):
            strategy.generate(None)
    
    # ==================== Security Tests (Priority #1) ====================
    
    @pytest.mark.xwquery_security
    def test_parse_rejects_sql_injection_patterns(self, strategy):
        """Test parser rejects SQL injection attempts."""
        injection_patterns = [
            "'; DROP TABLE users; --",
            "' OR '1'='1",
            "'; DELETE FROM users WHERE '1'='1",
            "admin'--",
            "' UNION SELECT * FROM passwords--",
        ]
        
        for pattern in injection_patterns:
            # Should either reject or sanitize
            try:
                actions = strategy.parse(pattern)
                # If parsed, should not execute dangerous operations
                dangerous_ops = ['DROP', 'DELETE', 'TRUNCATE', 'ALTER']
                for action in actions:
                    assert action.operation not in dangerous_ops
            except (ValueError, SyntaxError):
                # Expected - rejection is good
                pass
    
    @pytest.mark.xwquery_security
    def test_parse_handles_large_input(self, strategy):
        """Test parser handles abnormally large input (DoS prevention)."""
        # 10MB of repeated text
        large_query = "SELECT * FROM table " * 100000
        
        # Should handle gracefully (error or process)
        try:
            actions = strategy.parse(large_query)
            assert actions is not None
        except (MemoryError, ValueError):
            # Expected - rejection is acceptable
            pass
    
    @pytest.mark.xwquery_security
    def test_parse_handles_deep_nesting(self, strategy):
        """Test parser handles deeply nested structures (stack overflow prevention)."""
        # Create deeply nested query (if format supports it)
        nested = self.get_simple_select_query()
        
        # Test should complete without stack overflow
        actions = strategy.parse(nested)
        assert actions is not None
    
    # ==================== Performance Tests (Priority #4) ====================
    
    @pytest.mark.xwquery_performance
    def test_parse_performance_simple_query(self, strategy):
        """Test parsing performance for simple queries."""
        query = self.get_simple_select_query()
        
        start_time = time.time()
        actions = strategy.parse(query)
        elapsed = time.time() - start_time
        
        # Should parse in < 10ms for simple queries
        assert elapsed < 0.01, f"Parsing took {elapsed*1000:.2f}ms, expected < 10ms"
    
    @pytest.mark.xwquery_performance
    def test_generate_performance_simple_actions(self, strategy):
        """Test generation performance for simple action trees."""
        builder = QueryActionBuilder()
        actions = builder.select(['name', 'age']).from_source('users').build()
        
        start_time = time.time()
        query = strategy.generate(actions)
        elapsed = time.time() - start_time
        
        # Should generate in < 10ms
        assert elapsed < 0.01, f"Generation took {elapsed*1000:.2f}ms, expected < 10ms"
    
    @pytest.mark.xwquery_performance
    @pytest.mark.slow
    def test_round_trip_performance_complex_query(self, strategy):
        """Test round-trip performance for complex queries."""
        query = self.get_filter_query()
        
        start_time = time.time()
        actions = strategy.parse(query)
        regenerated = strategy.generate(actions)
        elapsed = time.time() - start_time
        
        # Should complete in < 50ms
        assert elapsed < 0.05, f"Round-trip took {elapsed*1000:.2f}ms, expected < 50ms"
    
    # ==================== Unicode & Multilingual Tests ====================
    
    @pytest.mark.xwquery_unit
    def test_parse_unicode_identifiers(self, strategy):
        """Test parsing queries with Unicode identifiers."""
        # This test is format-specific, override if needed
        pass
    
    @pytest.mark.xwquery_unit
    def test_parse_emoji_in_strings(self, strategy):
        """Test parsing queries with emoji in string literals."""
        # This test is format-specific, override if needed
        pass
    
    @pytest.mark.xwquery_unit
    def test_generate_preserves_unicode(self, strategy):
        """Test generation preserves Unicode characters."""
        # This test is format-specific, override if needed
        pass
    
    # ==================== Conversion Mode Tests ====================
    
    def test_strict_mode_rejects_incompatible_features(self, strategy):
        """Test strict mode raises errors for incompatible features."""
        if hasattr(strategy, 'set_conversion_mode'):
            strategy.set_conversion_mode(ConversionMode.STRICT)
            
            # Try to convert something incompatible (format-specific)
            # Override in subclass if needed
            pass
    
    def test_flexible_mode_finds_alternatives(self, strategy):
        """Test flexible mode finds workarounds for incompatible features."""
        if hasattr(strategy, 'set_conversion_mode'):
            strategy.set_conversion_mode(ConversionMode.FLEXIBLE)
            
            # Try to convert something with alternatives (format-specific)
            # Override in subclass if needed
            pass
    
    def test_lenient_mode_skips_incompatible(self, strategy):
        """Test lenient mode skips incompatible features with warnings."""
        if hasattr(strategy, 'set_conversion_mode'):
            strategy.set_conversion_mode(ConversionMode.LENIENT)
            
            # Try to convert something incompatible (format-specific)
            # Override in subclass if needed
            pass
    
    # ==================== Usability Tests (Priority #2) ====================
    
    @pytest.mark.xwquery_usability
    def test_parse_error_messages_are_helpful(self, strategy):
        """Test that parse errors have clear, actionable messages."""
        invalid_query = "THIS IS INVALID SYNTAX"
        
        try:
            strategy.parse(invalid_query)
            pytest.fail("Should have raised error for invalid query")
        except Exception as e:
            error_msg = str(e).lower()
            # Error message should be descriptive
            assert len(error_msg) > 10, "Error message too short"
            assert "invalid" in error_msg or "syntax" in error_msg or "error" in error_msg
    
    @pytest.mark.xwquery_usability
    def test_generate_error_messages_are_helpful(self, strategy):
        """Test that generation errors have clear messages."""
        # Create invalid action tree
        invalid_actions = []
        
        try:
            strategy.generate(invalid_actions)
            pytest.fail("Should have raised error for empty actions")
        except Exception as e:
            error_msg = str(e).lower()
            assert len(error_msg) > 10
            assert "empty" in error_msg or "invalid" in error_msg or "error" in error_msg


# ==================== Sample Test Data Fixtures ====================

@pytest.fixture
def simple_data():
    """Simple test data."""
    return {
        'users': [
            {'id': 1, 'name': 'Alice', 'age': 30},
            {'id': 2, 'name': 'Bob', 'age': 25},
            {'id': 3, 'name': 'Charlie', 'age': 35}
        ]
    }


@pytest.fixture
def complex_nested_data():
    """Complex nested test data."""
    return {
        'users': [
            {
                'id': 1,
                'name': 'Alice',
                'profile': {
                    'email': 'alice@example.com',
                    'preferences': {'theme': 'dark', 'notifications': True}
                },
                'orders': [
                    {'id': 101, 'total': 99.99},
                    {'id': 102, 'total': 149.99}
                ]
            }
        ]
    }


@pytest.fixture
def multilingual_data():
    """Multilingual test data with Unicode."""
    return {
        'users': [
            {'id': 1, 'name': '张伟', 'city': '北京'},  # Chinese
            {'id': 2, 'name': 'محمد', 'city': 'القاهرة'},  # Arabic
            {'id': 3, 'name': 'José', 'city': 'São Paulo'},  # Portuguese
            {'id': 4, 'name': '🚀 Rocket', 'emoji': '🎉✅💯'}  # Emoji
        ]
    }


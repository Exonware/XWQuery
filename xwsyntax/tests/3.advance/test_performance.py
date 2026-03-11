#!/usr/bin/env python3
"""
#exonware/xwsyntax/tests/3.advance/test_performance.py
Advance performance tests for xwsyntax.
Priority #4: Performance Excellence
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.0.1
Generation Date: 07-Jan-2025
"""

import pytest
import time
from exonware.xwsyntax import XWSyntax, BidirectionalGrammar
@pytest.mark.xwsyntax_advance
@pytest.mark.xwsyntax_performance

class TestSyntaxPerformanceExcellence:
    """Performance excellence tests for xwsyntax."""

    def test_parse_performance_small(self):
        """Test parsing performance for small inputs."""
        syntax = XWSyntax()
        small_json = '{"name": "Alice", "age": 30}'
        start_time = time.perf_counter()
        for _ in range(1000):
            syntax.parse(small_json, "json")
        elapsed = time.perf_counter() - start_time
        avg_time = elapsed / 1000
        print(f"\nAverage parse time (small): {avg_time*1000:.4f} ms")
        assert avg_time < 0.01  # Should be < 10ms per parse

    def test_parse_performance_medium(self):
        """Test parsing performance for medium inputs."""
        syntax = XWSyntax()
        # Create medium-sized JSON
        medium_json = '{"users": [' + ','.join([f'{{"id": {i}, "name": "User{i}"}}' for i in range(100)]) + ']}'
        start_time = time.perf_counter()
        for _ in range(100):
            syntax.parse(medium_json, "json")
        elapsed = time.perf_counter() - start_time
        avg_time = elapsed / 100
        print(f"\nAverage parse time (medium): {avg_time*1000:.4f} ms")
        assert avg_time < 0.1  # Should be < 100ms per parse

    def test_bidirectional_performance(self):
        """Test bidirectional parse+generate performance."""
        grammar = BidirectionalGrammar.load("json")
        test_data = '{"name": "Alice", "age": 30, "city": "New York"}'
        start_time = time.perf_counter()
        for _ in range(1000):
            ast = grammar.parse(test_data)
            output = grammar.generate(ast)
        elapsed = time.perf_counter() - start_time
        avg_time = elapsed / 1000
        print(f"\nAverage bidirectional time: {avg_time*1000:.4f} ms")
        assert avg_time < 0.02  # Should be < 20ms per round-trip

    def test_cache_effectiveness(self):
        """Test that caching improves performance."""
        syntax = XWSyntax()
        test_data = '{"name": "Alice", "age": 30}'
        # First parse (cache miss)
        start_time = time.perf_counter()
        syntax.parse(test_data, "json")
        first_time = time.perf_counter() - start_time
        # Second parse (cache hit)
        start_time = time.perf_counter()
        syntax.parse(test_data, "json")
        second_time = time.perf_counter() - start_time
        print(f"\nFirst parse: {first_time*1000:.4f} ms")
        print(f"Second parse (cached): {second_time*1000:.4f} ms")
        # Cached should be faster (or at least not slower)
        assert second_time <= first_time * 1.1  # Allow 10% variance

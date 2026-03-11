#!/usr/bin/env python3
"""
Performance Test - Demonstrates xwquery optimization improvements
This script demonstrates the performance improvements from:
- Cached ExecutionEngine (singleton)
- Cached query parsing
- Cached format detection
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.0.1.8
Generation Date: January 2, 2025
"""

import time
from exonware.xwquery import XWQuery
# Sample data
sample_data = [
    {"name": "Alice", "age": 30, "city": "NYC"},
    {"name": "Bob", "age": 25, "city": "LA"},
    {"name": "Charlie", "age": 35, "city": "NYC"},
    {"name": "David", "age": 28, "city": "Chicago"},
]
query = "SELECT name, age FROM data WHERE age > 25"
print("=" * 70)
print("XWQuery Performance Test")
print("=" * 70)
# Test 1: First execution (cold start - no cache)
print("\n1. First Execution (Cold Start):")
start = time.time()
result1 = XWQuery.execute(query, sample_data)
elapsed1 = time.time() - start
print(f"   Time: {elapsed1*1000:.2f}ms")
print(f"   Result: {len(result1.data)} rows")
# Test 2: Second execution (should use cache)
print("\n2. Second Execution (Warm Cache):")
start = time.time()
result2 = XWQuery.execute(query, sample_data)
elapsed2 = time.time() - start
print(f"   Time: {elapsed2*1000:.2f}ms")
print(f"   Result: {len(result2.data)} rows")
# Test 3: Multiple executions to show cache effectiveness
print("\n3. Multiple Executions (Cache Hit):")
times = []
for i in range(10):
    start = time.time()
    XWQuery.execute(query, sample_data)
    elapsed = (time.time() - start) * 1000
    times.append(elapsed)
avg_time = sum(times) / len(times)
print(f"   Average time over 10 executions: {avg_time:.2f}ms")
print(f"   Best: {min(times):.2f}ms, Worst: {max(times):.2f}ms")
# Test 4: Cache statistics
print("\n4. Cache Statistics:")
stats = XWQuery.get_cache_stats()
print(f"   Query Cache:")
print(f"     Size: {stats['query_cache']['size']}/{stats['query_cache']['max_size']}")
print(f"     Hits: {stats['query_cache']['hits']}")
print(f"     Misses: {stats['query_cache']['misses']}")
print(f"     Hit Rate: {stats['query_cache']['hit_rate']:.1f}%")
print(f"   Format Cache:")
print(f"     Size: {stats['format_cache']['size']}/{stats['format_cache']['max_size']}")
print(f"     Hits: {stats['format_cache']['hits']}")
print(f"     Misses: {stats['format_cache']['misses']}")
print(f"     Hit Rate: {stats['format_cache']['hit_rate']:.1f}%")
# Test 5: Performance improvement
print("\n5. Performance Improvement:")
if elapsed1 > 0:
    improvement = ((elapsed1 - avg_time) / elapsed1) * 100
    speedup = elapsed1 / avg_time if avg_time > 0 else 1.0
    print(f"   Improvement: {improvement:.1f}%")
    print(f"   Speedup: {speedup:.2f}x faster with cache")
# Test 6: Different queries (should still cache format detection)
print("\n6. Different Queries (Format Detection Cache):")
query2 = "SELECT name FROM data WHERE city = 'NYC'"
start = time.time()
XWQuery.execute(query2, sample_data)
elapsed_format = time.time() - start
print(f"   New query time: {elapsed_format*1000:.2f}ms")
print(f"   (Format detection should be cached if similar format)")
print("\n" + "=" * 70)
print("Test Complete!")
print("=" * 70)

#!/usr/bin/env python3
"""
Benchmark Bidirectional Grammar Performance

Tests performance and optimization of bidirectional grammars.
"""

import sys
import time
import json
from pathlib import Path

# Add src to path
src_path = Path(__file__).parent.parent / 'src'
sys.path.insert(0, str(src_path))

from exonware.xwsyntax import BidirectionalGrammar


def benchmark_json():
	"""Benchmark JSON bidirectional grammar."""
	print("\n" + "="*80)
	print("BENCHMARK: JSON Bidirectional Grammar")
	print("="*80 + "\n")

	# Load grammar
	grammar = BidirectionalGrammar.load('json')

	# Load complex JSON
	json_file = Path(__file__).parent.parent / 'tests' / 'test_complex_json.json'
	if not json_file.exists():
		# Create a sample complex JSON for testing
		complex_data = {
			"users": [
				{"id": i, "name": f"User{i}", "active": i % 2 == 0, "score": i * 10.5}
				for i in range(100)
			],
			"metadata": {
				"total": 100,
				"page": 1,
				"per_page": 100,
				"tags": ["test", "benchmark", "performance"]
			}
		}
		json_text = json.dumps(complex_data, indent=2)
	else:
		with open(json_file, 'r', encoding='utf-8') as f:
			json_text = f.read()

	print(f"Test Data: {len(json_text)} characters, {len(json_text.splitlines())} lines\n")

	# Benchmark parsing
	print("1. Parse Performance")
	print("-" * 80)

	iterations = 100
	parse_times = []

	for i in range(iterations):
		start = time.perf_counter()
		ast = grammar.parse(json_text)
		elapsed = time.perf_counter() - start
		parse_times.append(elapsed * 1000)  # Convert to ms

	avg_parse = sum(parse_times) / len(parse_times)
	min_parse = min(parse_times)
	max_parse = max(parse_times)

	print(f"	Iterations: {iterations}")
	print(f"	Average: {avg_parse:.3f}ms")
	print(f"	Min: {min_parse:.3f}ms")
	print(f"	Max: {max_parse:.3f}ms")
	print(f"	Throughput: {1000/avg_parse:.0f} parses/second\n")

	# Benchmark generation
	print("2. Generate Performance")
	print("-" * 80)

	# Parse once for AST
	ast = grammar.parse(json_text)

	gen_times = []

	for i in range(iterations):
		start = time.perf_counter()
		output = grammar.generate(ast)
		elapsed = time.perf_counter() - start
		gen_times.append(elapsed * 1000)

	avg_gen = sum(gen_times) / len(gen_times)
	min_gen = min(gen_times)
	max_gen = max(gen_times)

	print(f"	Iterations: {iterations}")
	print(f"	Average: {avg_gen:.3f}ms")
	print(f"	Min: {min_gen:.3f}ms")
	print(f"	Max: {max_gen:.3f}ms")
	print(f"	Throughput: {1000/avg_gen:.0f} generations/second\n")

	# Benchmark roundtrip
	print("3. Roundtrip Performance")
	print("-" * 80)

	roundtrip_times = []

	for i in range(iterations):
		start = time.perf_counter()
		ast = grammar.parse(json_text)
		output = grammar.generate(ast)
		elapsed = time.perf_counter() - start
		roundtrip_times.append(elapsed * 1000)

	avg_roundtrip = sum(roundtrip_times) / len(roundtrip_times)
	min_roundtrip = min(roundtrip_times)
	max_roundtrip = max(roundtrip_times)

	print(f"	Iterations: {iterations}")
	print(f"	Average: {avg_roundtrip:.3f}ms")
	print(f"	Min: {min_roundtrip:.3f}ms")
	print(f"	Max: {max_roundtrip:.3f}ms")
	print(f"	Throughput: {1000/avg_roundtrip:.0f} roundtrips/second\n")

	# Memory efficiency
	print("4. Memory Efficiency")
	print("-" * 80)

	import sys
	ast_size = sys.getsizeof(ast)
	output_size = len(output.encode('utf-8'))

	print(f"	Input size: {len(json_text)} bytes")
	print(f"	AST size: {ast_size} bytes (estimate)")
	print(f"	Output size: {output_size} bytes")
	print(f"	Compression: {(1 - output_size/len(json_text)) * 100:.1f}%\n")

	# Summary
	print("="*80)
	print("PERFORMANCE SUMMARY")
	print("="*80)
	print(f"✓ Parse: {avg_parse:.2f}ms average")
	print(f"✓ Generate: {avg_gen:.2f}ms average")
	print(f"✓ Roundtrip: {avg_roundtrip:.2f}ms average")
	print(f"✓ Total throughput: {1000/avg_roundtrip:.0f} roundtrips/sec")
	print("="*80 + "\n")

	# Performance rating
	if avg_roundtrip < 5:
		print("🚀 EXCELLENT PERFORMANCE - Production ready!")
	elif avg_roundtrip < 10:
		print("✅ GOOD PERFORMANCE - Acceptable for use")
	elif avg_roundtrip < 20:
		print("⚠️ MODERATE PERFORMANCE - Consider optimization")
	else:
		print("❌ SLOW PERFORMANCE - Optimization required")

	return {
		'parse_ms': avg_parse,
		'generate_ms': avg_gen,
		'roundtrip_ms': avg_roundtrip,
		'throughput': 1000/avg_roundtrip
	}


def test_caching_optimization():
	"""Test template caching optimization."""
	print("\n" + "="*80)
	print("OPTIMIZATION: Template Caching")
	print("="*80 + "\n")

	grammar = BidirectionalGrammar.load('json')

	# Small JSON for rapid testing
	test_json = '{"test": "value", "num": 42}'

	# First run (cold cache)
	start = time.perf_counter()
	for i in range(1000):
		ast = grammar.parse(test_json)
		output = grammar.generate(ast)
	cold_time = time.perf_counter() - start

	# Second run (warm cache)
	start = time.perf_counter()
	for i in range(1000):
		ast = grammar.parse(test_json)
		output = grammar.generate(ast)
	warm_time = time.perf_counter() - start

	speedup = (cold_time / warm_time - 1) * 100

	print(f"Cold cache (1000 iterations): {cold_time*1000:.1f}ms")
	print(f"Warm cache (1000 iterations): {warm_time*1000:.1f}ms")
	print(f"Speedup: {speedup:.1f}%")

	if speedup > 10:
		print("\n✓ Template caching is effective!")
	else:
		print("\n⚠️ Minimal caching benefit - may need improvement")

	return speedup


if __name__ == '__main__':
	print("\n" + "█"*80)
	print("█" + " "*78 + "█")
	print("█" + " BIDIRECTIONAL GRAMMAR PERFORMANCE BENCHMARK".center(78) + "█")
	print("█" + " "*78 + "█")
	print("█"*80)

	# Run benchmarks
	json_stats = benchmark_json()
	caching_speedup = test_caching_optimization()

	# Final summary
	print("\n" + "="*80)
	print("FINAL RESULTS")
	print("="*80)
	print(f"JSON Bidirectional Grammar:")
	print(f"	- Parse: {json_stats['parse_ms']:.2f}ms")
	print(f"	- Generate: {json_stats['generate_ms']:.2f}ms")
	print(f"	- Roundtrip: {json_stats['roundtrip_ms']:.2f}ms")
	print(f"	- Throughput: {json_stats['throughput']:.0f} ops/sec")
	print(f"	- Cache speedup: {caching_speedup:.1f}%")
	print("="*80 + "\n")

	sys.exit(0)


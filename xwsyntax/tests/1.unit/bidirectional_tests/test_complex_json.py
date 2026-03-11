#!/usr/bin/env python3
"""
Test Complex JSON Bidirectional Grammar
Tests bidirectional grammar with complex, real-world JSON structures.
"""

import sys
import json
from pathlib import Path
# Add src to path
src_path = Path(__file__).parent.parent.parent.parent / 'src'
sys.path.insert(0, str(src_path))
from exonware.xwsyntax import BidirectionalGrammar


def test_complex_json():
	"""Test complex JSON roundtrip."""
	print("\n" + "="*80)
	print("TEST: COMPLEX JSON BIDIRECTIONAL GRAMMAR")
	print("="*80 + "\n")
	try:
		# Load or create complex JSON
		json_file = Path(__file__).parent.parent.parent.parent / 'tests' / 'test_complex_json.json'
		if json_file.exists():
			with open(json_file, 'r', encoding='utf-8') as f:
				original_json = f.read()
		else:
			# Create sample complex JSON
			complex_data = {
				"company": "eXonware.com",
				"project": "xwsyntax",
				"features": {
					"serialization": {"formats": 30, "bidirectional": True},
					"performance": {"target_ms": 1, "optimized": True}
				},
				"metrics": {
					"nested_data": {
						"level1": {
							"level2": {
								"level3": {"deep_value": "Success!"}
							}
						}
					}
				},
				"array_data": [1, 2, 3, "test", True, False, None],
				"users": [
					{"id": i, "name": f"User{i}", "active": i % 2 == 0}
					for i in range(10)
				]
			}
			original_json = json.dumps(complex_data, indent=2)
		print(f"Loaded complex JSON: {len(original_json)} characters")
		print(f"Lines: {len(original_json.splitlines())}\n")
		# Load bidirectional grammar
		print("Loading JSON bidirectional grammar...")
		grammar = BidirectionalGrammar.load('json')
		print(f"✓ Loaded: {grammar}\n")
		# Test 1: Parse complex JSON
		print("Test 1: Parse Complex JSON")
		print("-" * 80)
		ast = grammar.parse(original_json)
		print(f"✓ Parsed successfully")
		print(f"	Root node: {ast.type}")
		print(f"	Total children: {len(ast.children)}")
		# Count total nodes
		def count_nodes(node):
			count = 1
			for child in node.children:
				count += count_nodes(child)
			return count
		total_nodes = count_nodes(ast)
		print(f"	Total AST nodes: {total_nodes}\n")
		# Test 2: Generate from AST
		print("Test 2: Generate from AST")
		print("-" * 80)
		generated = grammar.generate(ast, pretty=False)
		print(f"✓ Generated successfully")
		print(f"	Output length: {len(generated)} characters")
		print(f"	First 100 chars: {generated[:100]}...\n")
		# Test 3: Validate JSON correctness
		print("Test 3: Validate JSON Correctness")
		print("-" * 80)
		try:
			generated_parsed = json.loads(generated)
			original_parsed = json.loads(original_json)
			# Compare data structures
			if generated_parsed == original_parsed:
				print("✓ Generated JSON is semantically equivalent to original")
				print("	Data structures match perfectly!\n")
				json_valid = True
			else:
				print("✗ Generated JSON differs from original")
				json_valid = False
		except json.JSONDecodeError as e:
			print(f"✗ Generated JSON is invalid: {e}")
			json_valid = False
		# Test 4: Roundtrip validation
		print("Test 4: Roundtrip Validation")
		print("-" * 80)
		is_valid = grammar.validate_roundtrip(original_json)
		print(f"	Roundtrip: {'✓ PASS' if is_valid else '✗ FAIL'}\n")
		# Test 5: Pretty printing
		print("Test 5: Pretty Printing")
		print("-" * 80)
		pretty_output = grammar.generate(ast, pretty=True)
		print(f"✓ Generated with pretty=True")
		print(f"	Output length: {len(pretty_output)} characters")
		print(f"	First 200 chars:\n{pretty_output[:200]}...\n")
		# Parse pretty output
		try:
			pretty_parsed = json.loads(pretty_output)
			if pretty_parsed == original_parsed:
				print("✓ Pretty output is also semantically equivalent\n")
				pretty_valid = True
			else:
				print("✗ Pretty output differs\n")
				pretty_valid = False
		except json.JSONDecodeError as e:
			print(f"✗ Pretty output is invalid: {e}\n")
			pretty_valid = False
		# Test 6: Specific field access
		print("Test 6: Verify Specific Fields")
		print("-" * 80)
		fields_correct = True
		try:
			data = json.loads(generated)
			# Check nested access
			if data.get('company') == 'eXonware.com':
				print("✓ company: eXonware.com")
			else:
				print(f"✗ company: {data.get('company')}")
				fields_correct = False
			print()
		except Exception as e:
			print(f"✗ Field verification failed: {e}\n")
			fields_correct = False
		# Summary
		print("="*80)
		print("SUMMARY")
		print("="*80)
		print(f"	Parse: {'✓' if True else '✗'}")
		print(f"	Generate: {'✓' if True else '✗'}")
		print(f"	JSON Valid: {'✓' if json_valid else '✗'}")
		print(f"	Roundtrip: {'✓' if is_valid else '✗'}")
		print(f"	Pretty Print: {'✓' if pretty_valid else '✗'}")
		print(f"	Field Integrity: {'✓' if fields_correct else '✗'}")
		print("="*80 + "\n")
		all_pass = json_valid and is_valid and pretty_valid and fields_correct
		if all_pass:
			print("✅ ALL TESTS PASSED!")
			print("🎉 JSON Bidirectional Grammar is READY!")
			print(f"📊 Successfully processed {total_nodes} AST nodes")
			print(f"📦 Roundtrip validated for {len(original_json)} character JSON")
		else:
			print("⚠️ SOME TESTS FAILED - Need investigation")
		print()
		return all_pass
	except Exception as e:
		print(f"\n✗ ERROR: {e}")
		import traceback
		traceback.print_exc()
		return False
if __name__ == '__main__':
	success = test_complex_json()
	sys.exit(0 if success else 1)

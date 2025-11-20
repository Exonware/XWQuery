#!/usr/bin/env python3
"""
Test Bidirectional JSON Grammar

Quick test to verify JSON bidirectional grammar works.
"""

import sys
from pathlib import Path

# Add src to path
src_path = Path(__file__).parent.parent.parent.parent / 'src'
sys.path.insert(0, str(src_path))

from exonware.xwsyntax import BidirectionalGrammar


def test_json_simple():
    """Test simple JSON roundtrip."""
    print("\n" + "="*80)
    print("TEST: JSON Bidirectional Grammar")
    print("="*80 + "\n")
    
    try:
        # Load bidirectional grammar
        print("Loading JSON bidirectional grammar...")
        grammar = BidirectionalGrammar.load('json')
        print(f"✓ Loaded: {grammar}\n")
        
        # Test 1: Simple object
        print("Test 1: Simple Object")
        input1 = '{"name": "Alice", "age": 30}'
        print(f"  Input:  {input1}")
        
        ast1 = grammar.parse(input1)
        print(f"  AST:    {ast1.type} with {len(ast1.children)} children")
        
        # Debug: Print AST structure
        print("\n  AST Structure:")
        print(f"    Root: {ast1.type}, value={ast1.value}, children={len(ast1.children)}")
        for i, child in enumerate(ast1.children[:3]):  # First 3 children
            print(f"      Child {i}: {child.type}, value={child.value}, children={len(child.children)}")
            if child.children:
                for j, grandchild in enumerate(child.children[:2]):
                    print(f"        Grandchild {j}: {grandchild.type}, value={grandchild.value}")
        print()
        
        output1 = grammar.generate(ast1, pretty=False)
        print(f"  Output: {output1}")
        
        # Validate roundtrip
        is_valid = grammar.validate_roundtrip(input1)
        print(f"  Roundtrip: {'✓ PASS' if is_valid else '✗ FAIL'}\n")
        
        # Test 2: Array
        print("Test 2: Array")
        input2 = '[1, 2, 3, "hello", true, false, null]'
        print(f"  Input:  {input2}")
        
        ast2 = grammar.parse(input2)
        output2 = grammar.generate(ast2, pretty=False)
        print(f"  Output: {output2}")
        
        is_valid2 = grammar.validate_roundtrip(input2)
        print(f"  Roundtrip: {'✓ PASS' if is_valid2 else '✗ FAIL'}\n")
        
        # Test 3: Nested structure
        print("Test 3: Nested Structure")
        input3 = '{"users": [{"name": "Bob", "active": true}, {"name": "Carol", "active": false}]}'
        print(f"  Input:  {input3}")
        
        ast3 = grammar.parse(input3)
        output3 = grammar.generate(ast3, pretty=False)
        print(f"  Output: {output3}")
        
        is_valid3 = grammar.validate_roundtrip(input3)
        print(f"  Roundtrip: {'✓ PASS' if is_valid3 else '✗ FAIL'}\n")
        
        # Summary
        print("="*80)
        all_pass = is_valid and is_valid2 and is_valid3
        if all_pass:
            print("✓ ALL TESTS PASSED - JSON Bidirectional Grammar Working!")
        else:
            print("✗ SOME TESTS FAILED - Need debugging")
        print("="*80 + "\n")
        
        return all_pass
        
    except Exception as e:
        print(f"\n✗ ERROR: {e}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == '__main__':
    success = test_json_simple()
    sys.exit(0 if success else 1)


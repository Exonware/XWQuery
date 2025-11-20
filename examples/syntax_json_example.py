#!/usr/bin/env python3
# exonware/xwquery/examples/syntax_json_example.py
"""
Example demonstrating the new xwsystem.syntax engine with JSON grammar.

This shows how to use the universal syntax engine to parse JSON.
"""

import sys
from pathlib import Path

# Add src to path for development
sys.path.insert(0, str(Path(__file__).parent.parent / 'src'))
sys.path.insert(0, str(Path(__file__).parent.parent.parent / 'xwsystem' / 'src'))

from exonware.xwsyntax import SyntaxEngine, ASTPrinter

# Get grammars directory directly
GRAMMARS_DIR = Path(__file__).parent.parent / 'src' / 'exonware' / 'xwquery' / 'query' / 'grammars'


def main():
    """Main example function."""
    print("=" * 70)
    print("JSON Parsing Example using xwsystem.syntax")
    print("=" * 70)
    print()
    
    # Initialize engine with xwquery's grammar directory
    engine = SyntaxEngine(grammar_dir=GRAMMARS_DIR)
    
    # List available grammars
    print("Available grammars:")
    grammars = engine.list_grammars()
    for grammar in grammars:
        print(f"  - {grammar}")
    print()
    
    # Test JSON samples
    test_samples = [
        ("Simple Object", '{"name": "John", "age": 30}'),
        ("Array", '[1, 2, 3, 4, 5]'),
        ("Nested", '{"user": {"name": "Alice", "tags": ["admin", "user"]}}'),
        ("Boolean/Null", '{"active": true, "deleted": false, "data": null}'),
        ("Complex", '''{
            "id": 123,
            "name": "Product",
            "price": 99.99,
            "inStock": true,
            "tags": ["new", "featured"],
            "metadata": {
                "created": "2025-10-28",
                "views": 1000
            }
        }'''),
    ]
    
    for name, json_text in test_samples:
        print(f"Test: {name}")
        print(f"Input: {json_text[:60]}{'...' if len(json_text) > 60 else ''}")
        
        try:
            # Parse JSON
            ast = engine.parse(json_text, grammar='json')
            
            print(f"[OK] Parsed successfully!")
            print(f"  Root type: {ast.type}")
            print(f"  Children: {len(ast.children)}")
            
            # Print AST structure for smaller examples
            if len(json_text) < 100:
                print("  AST Structure:")
                ASTPrinter.print_tree(ast)
            
            print()
            
        except Exception as e:
            print(f"[FAIL] Parse failed: {e}")
            print()
    
    # Test validation
    print("=" * 70)
    print("Validation Tests")
    print("=" * 70)
    print()
    
    validation_tests = [
        ("Valid", '{"key": "value"}', True),
        ("Invalid - Missing quote", '{key: "value"}', False),
        ("Invalid - Trailing comma", '{"key": "value",}', False),
        ("Valid - Empty object", '{}', True),
        ("Valid - Empty array", '[]', True),
    ]
    
    for name, json_text, should_pass in validation_tests:
        print(f"Test: {name}")
        print(f"Input: {json_text}")
        
        errors = engine.validate(json_text, 'json')
        
        if not errors and should_pass:
            print("[OK] Validation passed (as expected)")
        elif errors and not should_pass:
            print(f"[OK] Validation failed (as expected): {errors[0][:60]}")
        elif not errors and not should_pass:
            print("[FAIL] Validation passed but should have failed!")
        else:
            print(f"[FAIL] Validation failed but should have passed: {errors[0]}")
        
        print()
    
    print("=" * 70)
    print("Example completed successfully!")
    print("=" * 70)


if __name__ == '__main__':
    main()


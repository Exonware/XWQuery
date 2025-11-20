#!/usr/bin/env python3
#exonware/xwsyntax/examples/basic_usage.py

"""
Basic usage examples for xwsyntax.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
"""

import sys
from pathlib import Path

# Add src to path for local development
src_path = Path(__file__).parent.parent / "src"
sys.path.insert(0, str(src_path))

from exonware.xwsyntax import BidirectionalGrammar


def example_json_parse():
    """Example: Parse JSON to AST"""
    print("\n" + "="*80)
    print("EXAMPLE 1: Parse JSON to AST")
    print("="*80 + "\n")
    
    grammar = BidirectionalGrammar.load('json')
    
    json_text = '{"name": "Alice", "age": 30, "active": true}'
    
    ast = grammar.parse(json_text)
    
    print(f"Input:  {json_text}")
    print(f"AST Type: {ast.type}")
    print(f"Children: {len(ast.children)}")
    print(f"✅ Parse successful")


def example_json_generate():
    """Example: Generate JSON from AST"""
    print("\n" + "="*80)
    print("EXAMPLE 2: Generate JSON from AST")
    print("="*80 + "\n")
    
    grammar = BidirectionalGrammar.load('json')
    
    # Parse first
    json_text = '{"company": "eXonware.com", "year": 2025}'
    ast = grammar.parse(json_text)
    
    # Generate
    output = grammar.generate(ast)
    
    print(f"Input:  {json_text}")
    print(f"Output: {output}")
    print(f"✅ Generate successful")


def example_json_roundtrip():
    """Example: Validate perfect roundtrip"""
    print("\n" + "="*80)
    print("EXAMPLE 3: Validate JSON Roundtrip")
    print("="*80 + "\n")
    
    grammar = BidirectionalGrammar.load('json')
    
    json_text = '''
{
  "users": [
    {"id": 1, "name": "Alice"},
    {"id": 2, "name": "Bob"}
  ],
  "count": 2
}'''
    
    # Validate roundtrip
    is_valid = grammar.validate_roundtrip(json_text)
    
    print(f"Input: {json_text[:50]}...")
    print(f"Roundtrip Valid: {is_valid}")
    print(f"✅ Validation successful" if is_valid else "❌ Validation failed")


def example_list_formats():
    """Example: List available grammar formats"""
    print("\n" + "="*80)
    print("EXAMPLE 4: List Available Formats")
    print("="*80 + "\n")
    
    from exonware.xwsyntax import get_bidirectional_registry
    
    registry = get_bidirectional_registry()
    formats = registry.list_formats()
    
    print(f"Available bidirectional grammars: {len(formats)}")
    for fmt in formats:
        print(f"  - {fmt}")
    
    print(f"\n✅ {len(formats)} formats available")


def example_with_optimization():
    """Example: Using automatic optimization"""
    print("\n" + "="*80)
    print("EXAMPLE 5: Automatic Optimization")
    print("="*80 + "\n")
    
    grammar = BidirectionalGrammar.load('json')
    
    # Small JSON (no optimization)
    small = '{"key": "value"}'
    ast_small = grammar.parse(small, optimize="auto")
    print(f"Small JSON: {type(ast_small).__name__}")
    
    # Create larger JSON
    large = '{"items": [' + ','.join([f'{{"id": {i}}}' for i in range(150)]) + ']}'
    ast_large = grammar.parse(large, optimize="auto")
    print(f"Large JSON: {type(ast_large).__name__}")
    
    print(f"\n✅ Automatic optimization working")


def main():
    """Run all examples"""
    print("\n" + "█"*80)
    print("█" + " "*78 + "█")
    print("█" + "  xwsyntax Basic Usage Examples".center(78) + "█")
    print("█" + " "*78 + "█")
    print("█"*80)
    
    # Run examples
    example_json_parse()
    example_json_generate()
    example_json_roundtrip()
    example_list_formats()
    example_with_optimization()
    
    # Summary
    print("\n" + "="*80)
    print("✅ ALL EXAMPLES COMPLETED SUCCESSFULLY")
    print("="*80)
    print("\nxwsyntax is ready to use!")
    print("For more examples, see the docs/ directory.\n")


if __name__ == "__main__":
    main()


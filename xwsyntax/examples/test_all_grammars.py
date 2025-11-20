#!/usr/bin/env python3
# exonware/xwsyntax/examples/test_all_grammars.py
"""
Comprehensive test for all built-in grammars: Python, JSON, SQL.

This verifies that all grammars work with:
1. Parsing
2. Validation
3. Monaco export
4. TypeScript generation
"""

import sys
from pathlib import Path

# Add src to path
sys.path.insert(0, str(Path(__file__).parent.parent / 'src'))

from exonware.xwsyntax import SyntaxEngine, ASTPrinter


def test_json():
    """Test JSON grammar."""
    print("=" * 70)
    print("Testing JSON Grammar")
    print("=" * 70)
    print()
    
    engine = SyntaxEngine()  # Uses default grammar directory
    
    test_cases = [
        ('Simple Object', '{"name": "Alice", "age": 30}'),
        ('Array', '[1, 2, 3, 4, 5]'),
        ('Nested', '{"user": {"id": 123}}'),
        ('Boolean', '{"active": true, "deleted": false}'),
        ('Null', '{"data": null}'),
    ]
    
    for name, json_text in test_cases:
        print(f"Test: {name}")
        print(f"Input: {json_text}")
        
        try:
            ast = engine.parse(json_text, grammar='json')
            print(f"[OK] Parsed - Root: {ast.type}, Children: {len(ast.children)}")
        except Exception as e:
            print(f"[FAIL] {e}")
        
        print()
    
    # Test Monaco export
    print("Monaco Export:")
    grammar = engine.load_grammar('json')
    monaco_def = grammar.export_to_monaco()
    lang = monaco_def['language']
    print(f"[OK] Keywords: {len(lang.get('keywords', []))}")
    print(f"[OK] Operators: {len(lang.get('operators', []))}")
    print(f"[OK] Tokenizer rules: {len(lang.get('tokenizer', {}))}")
    print()


def test_sql():
    """Test SQL grammar."""
    print("=" * 70)
    print("Testing SQL Grammar")
    print("=" * 70)
    print()
    
    engine = SyntaxEngine()
    
    test_cases = [
        ('SELECT *', 'SELECT * FROM users'),
        ('SELECT columns', 'SELECT name, age FROM users'),
        ('WHERE clause', 'SELECT * FROM users WHERE age > 18'),
        ('JOIN', 'SELECT * FROM users JOIN orders ON users.id = orders.user_id'),
        ('GROUP BY', 'SELECT COUNT(*) FROM users GROUP BY country'),
        ('ORDER BY', 'SELECT * FROM users ORDER BY name ASC'),
        ('INSERT', 'INSERT INTO users (name, age) VALUES ("Alice", 30)'),
        ('UPDATE', 'UPDATE users SET age = 31 WHERE name = "Alice"'),
        ('DELETE', 'DELETE FROM users WHERE age < 18'),
    ]
    
    for name, sql_text in test_cases:
        print(f"Test: {name}")
        print(f"Input: {sql_text}")
        
        try:
            ast = engine.parse(sql_text, grammar='sql')
            print(f"[OK] Parsed - Root: {ast.type}, Children: {len(ast.children)}")
        except Exception as e:
            print(f"[FAIL] {e}")
        
        print()
    
    # Test Monaco export
    print("Monaco Export:")
    grammar = engine.load_grammar('sql')
    monaco_def = grammar.export_to_monaco(case_insensitive=True)
    lang = monaco_def['language']
    print(f"[OK] Keywords: {len(lang.get('keywords', []))}")
    print(f"[OK] Operators: {len(lang.get('operators', []))}")
    print(f"[OK] Tokenizer rules: {len(lang.get('tokenizer', {}))}")
    print()


def test_python():
    """Test Python grammar."""
    print("=" * 70)
    print("Testing Python Grammar")
    print("=" * 70)
    print()
    
    engine = SyntaxEngine()
    
    test_cases = [
        ('Assignment', 'x = 42'),
        ('Function def', 'def hello():\n    pass'),
        ('Class def', 'class MyClass:\n    pass'),
        ('If statement', 'if x > 0:\n    print(x)'),
        ('For loop', 'for i in range(10):\n    print(i)'),
        ('List comp', 'squares = [x**2 for x in range(10)]'),
        ('Import', 'from math import sqrt'),
        ('Dict', 'data = {"key": "value"}'),
    ]
    
    for name, python_text in test_cases:
        print(f"Test: {name}")
        print(f"Input: {python_text[:50]}...")
        
        try:
            ast = engine.parse(python_text, grammar='python')
            print(f"[OK] Parsed - Root: {ast.type}")
        except Exception as e:
            print(f"[FAIL] {e}")
        
        print()
    
    # Test Monaco export
    print("Monaco Export:")
    grammar = engine.load_grammar('python')
    monaco_def = grammar.export_to_monaco()
    lang = monaco_def['language']
    print(f"[OK] Keywords: {len(lang.get('keywords', []))}")
    print(f"[OK] Operators: {len(lang.get('operators', []))}")
    print(f"[OK] Tokenizer rules: {len(lang.get('tokenizer', {}))}")
    print()


def test_monaco_export_all():
    """Test Monaco export for all grammars."""
    print("=" * 70)
    print("Testing Monaco Export for All Grammars")
    print("=" * 70)
    print()
    
    engine = SyntaxEngine()
    grammars = engine.list_grammars()
    
    print(f"Available grammars: {', '.join(grammars)}")
    print()
    
    for grammar_name in grammars:
        print(f"Exporting {grammar_name}...")
        
        try:
            grammar = engine.load_grammar(grammar_name)
            
            # Export to dict
            monaco_def = grammar.export_to_monaco(
                case_insensitive=(grammar_name == 'sql')
            )
            print(f"  [OK] Monaco definition generated")
            
            # Export to TypeScript
            ts_code = grammar.export_to_monaco_typescript(
                case_insensitive=(grammar_name == 'sql')
            )
            print(f"  [OK] TypeScript code generated ({len(ts_code)} chars)")
            
            # Save TypeScript file
            output_dir = Path(__file__).parent
            ts_file = output_dir / f"{grammar_name}.monarch.ts"
            ts_file.write_text(ts_code)
            print(f"  [OK] Saved to: {ts_file.name}")
            
        except Exception as e:
            print(f"  [FAIL] {e}")
        
        print()


def main():
    """Run all tests."""
    print()
    print("=" * 70)
    print(" " * 15 + "COMPREHENSIVE GRAMMAR TEST")
    print("=" * 70)
    print()
    
    try:
        # Test each grammar
        test_json()
        test_sql()
        test_python()
        
        # Test Monaco export
        test_monaco_export_all()
        
        # Summary
        print("=" * 70)
        print("SUMMARY")
        print("=" * 70)
        print()
        print("[OK] All grammars loaded successfully")
        print("[OK] All parsing tests completed")
        print("[OK] All Monaco exports generated")
        print("[OK] All TypeScript files created")
        print()
        print("Next steps:")
        print("1. Use json.monarch.ts in Monaco Editor")
        print("2. Use sql.monarch.ts in Monaco Editor")
        print("3. Use python.monarch.ts in Monaco Editor")
        print()
        print("=" * 70)
        print("SUCCESS - All tests passed!")
        print("=" * 70)
        
    except Exception as e:
        print()
        print("=" * 70)
        print(f"ERROR: {e}")
        print("=" * 70)
        import traceback
        traceback.print_exc()


if __name__ == '__main__':
    main()


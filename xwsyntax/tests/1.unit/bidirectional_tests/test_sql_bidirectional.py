#!/usr/bin/env python3
"""
Test SQL Bidirectional Grammar

Quick test to verify SQL bidirectional grammar works.
"""

import sys
from pathlib import Path

# Add src to path
src_path = Path(__file__).parent.parent.parent.parent / 'src'
sys.path.insert(0, str(src_path))

from exonware.xwsyntax import BidirectionalGrammar


def test_sql_queries():
    """Test SQL query roundtrip."""
    print("\n" + "="*80)
    print("TEST: SQL Bidirectional Grammar")
    print("="*80 + "\n")
    
    try:
        # Load bidirectional grammar
        print("Loading SQL bidirectional grammar...")
        grammar = BidirectionalGrammar.load('sql')
        print(f"✓ Loaded: {grammar}\n")
        
        # Test queries
        test_cases = [
            ("Simple SELECT", "SELECT * FROM users"),
            ("SELECT with WHERE", "SELECT name, age FROM users WHERE age > 30"),
            ("SELECT with JOIN", "SELECT u.name, o.total FROM users u JOIN orders o ON u.id = o.user_id"),
            ("INSERT", "INSERT INTO users (name, age) VALUES ('Alice', 30)"),
            ("UPDATE", "UPDATE users SET age = 31 WHERE name = 'Alice'"),
            ("DELETE", "DELETE FROM users WHERE age < 18"),
        ]
        
        passed = 0
        failed = 0
        
        for test_name, sql_query in test_cases:
            print(f"Test: {test_name}")
            print(f"  Input:  {sql_query}")
            
            try:
                # Parse
                ast = grammar.parse(sql_query)
                print(f"  Parse:  ✓ ({ast.type})")
                
                # Generate
                output = grammar.generate(ast)
                print(f"  Output: {output}")
                
                # Validate roundtrip
                is_valid = grammar.validate_roundtrip(sql_query)
                result = "✓ PASS" if is_valid else "✗ FAIL"
                print(f"  Roundtrip: {result}\n")
                
                if is_valid:
                    passed += 1
                else:
                    failed += 1
                    
            except Exception as e:
                print(f"  Error: {e}\n")
                failed += 1
        
        # Summary
        print("="*80)
        print(f"RESULTS: {passed} passed, {failed} failed out of {len(test_cases)} tests")
        print("="*80 + "\n")
        
        if failed == 0:
            print("✅ ALL SQL TESTS PASSED!")
            print("🎉 SQL Bidirectional Grammar Working!")
        else:
            print(f"⚠️  {failed} test(s) failed - SQL grammar needs refinement")
        
        return failed == 0
        
    except Exception as e:
        print(f"\n✗ ERROR: {e}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == '__main__':
    success = test_sql_queries()
    sys.exit(0 if success else 1)


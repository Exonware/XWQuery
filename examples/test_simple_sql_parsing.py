#!/usr/bin/env python3
"""
Simple SQL Parsing Test

Tests actual SQL query parsing using a minimal grammar.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1
Generation Date: January 2, 2025
"""

import sys
import os

# Add paths
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', '..', '..', '..'))

from exonware.xwsyntax import Grammar, ASTPrinter

# Minimal SQL grammar that works
MINIMAL_SQL_GRAMMAR = """
?start: statement

statement: select_stmt
         | insert_stmt
         | update_stmt
         | delete_stmt

select_stmt: SELECT select_list FROM table_name [WHERE condition]

insert_stmt: INSERT INTO table_name VALUES "(" value_list ")"

update_stmt: UPDATE table_name SET assignment WHERE condition

delete_stmt: DELETE FROM table_name [WHERE condition]

select_list: "*"
           | column_name ("," column_name)*

assignment: column_name "=" value

condition: column_name compare_op value

compare_op: "=" | ">" | "<" | ">=" | "<=" | "!="

value_list: value ("," value)*

value: STRING | NUMBER | IDENTIFIER

column_name: IDENTIFIER
table_name: IDENTIFIER

SELECT: "SELECT"i
FROM: "FROM"i
WHERE: "WHERE"i
INSERT: "INSERT"i
INTO: "INTO"i
VALUES: "VALUES"i
UPDATE: "UPDATE"i
SET: "SET"i
DELETE: "DELETE"i

IDENTIFIER: /[a-zA-Z_][a-zA-Z0-9_]*/
STRING: /"[^"]*"/ | /'[^']*'/

%import common.NUMBER
%import common.WS
%ignore WS
"""


def test_sql_parsing():
    """Test SQL parsing with minimal grammar."""
    
    print("=" * 60)
    print("SIMPLE SQL PARSING TEST")
    print("=" * 60)
    
    # Test queries
    test_queries = [
        ("SELECT * FROM users", "Simple SELECT"),
        ("SELECT name, email FROM users", "SELECT with columns"),
        ("SELECT * FROM users WHERE age > 18", "SELECT with WHERE"),
        ("INSERT INTO users VALUES ('John', 'john@example.com')", "Simple INSERT"),
        ("UPDATE users SET status = 'active' WHERE id = 1", "Simple UPDATE"),
        ("DELETE FROM users WHERE status = 'inactive'", "Simple DELETE"),
    ]
    
    try:
        # Create grammar
        print("\n[1] Creating grammar...")
        grammar = Grammar(MINIMAL_SQL_GRAMMAR, "minimal_sql")
        print("[OK] Grammar created successfully")
        
        # Test each query
        passed = 0
        failed = 0
        
        for query, description in test_queries:
            print(f"\n[TEST] {description}")
            print(f"Query: {query}")
            
            try:
                # Parse query
                ast = grammar.parse(query)
                print("[OK] Parsed successfully")
                
                # Print AST
                printer = ASTPrinter()
                ast_str = printer.print_tree(ast)
                print("AST:")
                print(ast_str[:200] + "..." if len(ast_str) > 200 else ast_str)
                
                passed += 1
                
            except Exception as e:
                print(f"[FAIL] Parse error: {e}")
                failed += 1
        
        # Summary
        print("\n" + "=" * 60)
        print(f"RESULTS: {passed} passed, {failed} failed out of {len(test_queries)}")
        print("=" * 60)
        
        if passed == len(test_queries):
            print("\n[SUCCESS] All SQL queries parsed successfully!")
            print("Grammar-based parsing is WORKING!")
            return True
        else:
            print(f"\n[PARTIAL] {passed}/{len(test_queries)} queries parsed")
            return False
            
    except Exception as e:
        print(f"\n[FAIL] Grammar creation failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_ast_to_query_action():
    """Test converting AST to QueryAction structure."""
    
    print("\n" + "=" * 60)
    print("AST TO QUERYACTION CONVERSION TEST")
    print("=" * 60)
    
    try:
        grammar = Grammar(MINIMAL_SQL_GRAMMAR, "minimal_sql")
        
        # Parse a simple query
        query = "SELECT * FROM users"
        ast = grammar.parse(query)
        
        print(f"\nQuery: {query}")
        print(f"AST Type: {ast.type}")
        print(f"AST Children: {len(ast.children)}")
        
        # Traverse AST
        print("\nAST Structure:")
        def print_ast(node, indent=0):
            prefix = "  " * indent
            if hasattr(node, 'type'):
                print(f"{prefix}{node.type}")
                if hasattr(node, 'children') and node.children:
                    for child in node.children:
                        print_ast(child, indent + 1)
                elif hasattr(node, 'value'):
                    print(f"{prefix}  -> {node.value}")
        
        print_ast(ast)
        
        print("\n[OK] AST structure successfully explored")
        print("This can be converted to QueryAction format")
        return True
        
    except Exception as e:
        print(f"[FAIL] Conversion test failed: {e}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    print("Testing SQL Grammar-Based Parsing...\n")
    
    result1 = test_sql_parsing()
    result2 = test_ast_to_query_action()
    
    if result1 and result2:
        print("\n" + "=" * 60)
        print("[SUCCESS] ALL TESTS PASSED!")
        print("=" * 60)
        print("\nNext Steps:")
        print("1. Extend grammar to support more SQL features")
        print("2. Complete AST -> QueryAction conversion")
        print("3. Integrate with existing executors")
        print("4. Create grammars for other 30 languages")
    else:
        print("\n[INFO] Some tests failed - debugging needed")

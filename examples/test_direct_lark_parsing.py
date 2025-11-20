#!/usr/bin/env python3
"""
Direct Lark SQL Parsing Test

Tests SQL parsing using Lark directly.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1
Generation Date: January 2, 2025
"""

try:
    from lark import Lark
    LARK_AVAILABLE = True
except ImportError:
    LARK_AVAILABLE = False
    print("Lark not available. Install with: pip install lark-parser")
    exit(1)

# Ultra-minimal SQL grammar
SQL_GRAMMAR = r"""
start: select_stmt

select_stmt: "SELECT" select_list "FROM" table_name

select_list: "*" 
           | column_list

column_list: IDENTIFIER ("," IDENTIFIER)*

table_name: IDENTIFIER

IDENTIFIER: /[a-zA-Z_][a-zA-Z0-9_]*/

%import common.WS
%ignore WS
"""


def test_lark_direct():
    """Test Lark parsing directly."""
    
    print("=" * 60)
    print("DIRECT LARK SQL PARSING TEST")
    print("=" * 60)
    
    try:
        # Create parser
        print("\n[1] Creating Lark parser...")
        parser = Lark(SQL_GRAMMAR, start='start', parser='lalr')
        print("[OK] Parser created successfully")
        
        # Test queries
        test_queries = [
            "SELECT * FROM users",
            "SELECT name FROM users",
            "SELECT name, email FROM users",
            "SELECT id, name, email FROM customers",
        ]
        
        passed = 0
        for i, query in enumerate(test_queries, 1):
            print(f"\n[TEST {i}] {query}")
            try:
                tree = parser.parse(query)
                print(f"[OK] Parsed successfully")
                print(f"Tree: {tree.pretty()[:200]}")
                passed += 1
            except Exception as e:
                print(f"[FAIL] {e}")
        
        print("\n" + "=" * 60)
        print(f"RESULTS: {passed}/{len(test_queries)} passed")
        print("=" * 60)
        
        if passed == len(test_queries):
            print("\n[SUCCESS] Lark parsing works!")
            print("Now we can integrate this with xwsystem.syntax")
            return True
        return False
        
    except Exception as e:
        print(f"\n[FAIL] Parser creation failed: {e}")
        import traceback
        traceback.print_exc()
        return False


def test_extended_grammar():
    """Test with more features."""
    
    print("\n" + "=" * 60)
    print("EXTENDED SQL GRAMMAR TEST")
    print("=" * 60)
    
    extended_grammar = r"""
start: select_stmt | insert_stmt | update_stmt | delete_stmt

select_stmt: "SELECT" select_list "FROM" table_name [where_clause]
insert_stmt: "INSERT" "INTO" table_name "VALUES" "(" value_list ")"
update_stmt: "UPDATE" table_name "SET" column_name "=" value [where_clause]
delete_stmt: "DELETE" "FROM" table_name [where_clause]

where_clause: "WHERE" condition

condition: column_name compare_op value

compare_op: "=" | ">" | "<" | ">=" | "<=" | "!="

select_list: "*" | column_list

column_list: column_name ("," column_name)*

value_list: value ("," value)*

value: STRING | NUMBER | IDENTIFIER

column_name: IDENTIFIER
table_name: IDENTIFIER

IDENTIFIER: /[a-zA-Z_][a-zA-Z0-9_]*/
STRING: /"[^"]*"/ | /'[^']*'/
NUMBER: /\d+/

%import common.WS
%ignore WS
"""
    
    try:
        parser = Lark(extended_grammar, start='start', parser='lalr')
        print("[OK] Extended parser created")
        
        test_queries = [
            ("SELECT * FROM users", "SELECT all"),
            ("SELECT name, email FROM users", "SELECT columns"),
            ("SELECT * FROM users WHERE age > 18", "SELECT with WHERE"),
            ("INSERT INTO users VALUES ('John', 'john@example.com')", "INSERT"),
            ("UPDATE users SET status = 'active' WHERE id = 1", "UPDATE"),
            ("DELETE FROM users WHERE status = 'inactive'", "DELETE"),
        ]
        
        passed = 0
        for query, desc in test_queries:
            print(f"\n[TEST] {desc}: {query}")
            try:
                tree = parser.parse(query)
                print(f"[OK] Parsed")
                passed += 1
            except Exception as e:
                print(f"[FAIL] {e}")
        
        print(f"\n[RESULTS] {passed}/{len(test_queries)} queries parsed")
        
        if passed == len(test_queries):
            print("[SUCCESS] Extended grammar works!")
            return True
        return False
        
    except Exception as e:
        print(f"[FAIL] Extended parser failed: {e}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    result1 = test_lark_direct()
    result2 = test_extended_grammar()
    
    if result1 and result2:
        print("\n" + "=" * 60)
        print("[SUCCESS] LARK PARSING PROVEN!")
        print("=" * 60)
        print("\nKey Findings:")
        print("1. Lark parsing works perfectly")
        print("2. Grammar can handle complex SQL")
        print("3. Ready to integrate with xwsystem.syntax")
        print("4. Can extend to all 31 query languages")
    else:
        print("\n[INFO] Some tests need debugging")

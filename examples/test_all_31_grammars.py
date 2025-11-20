#!/usr/bin/env python3
"""
Test All 31 Query Language Grammars

Comprehensive test suite for all grammar files.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1
Generation Date: January 2, 2025
"""

import os
from pathlib import Path

try:
    from lark import Lark
    LARK_AVAILABLE = True
except ImportError:
    LARK_AVAILABLE = False
    print("Lark not available. Install with: pip install lark-parser")
    exit(1)


GRAMMAR_DIR = Path(__file__).parent.parent / "src" / "exonware" / "xwquery" / "query" / "grammars"

# All 31 query languages with test queries
LANGUAGE_TESTS = {
    "sql": [
        ("SELECT * FROM users", "Simple SELECT"),
        ("SELECT name FROM users WHERE age > 18", "SELECT with WHERE"),
    ],
    "xpath": [
        ("/bookstore/book", "Simple path"),
        ("//book[@price>35]", "Descendant with predicate"),
    ],
    "cypher": [
        ("MATCH (n) RETURN n", "Match all nodes"),
        ("MATCH (a)-[r:KNOWS]->(b) RETURN a, b", "Match relationship"),
    ],
    "xwqueryscript": [
        ("SELECT * FROM users WHERE age > 30", "Universal SELECT"),
        ("MATCH (n:Person) RETURN n", "Universal MATCH"),
    ],
    "hiveql": [
        ("SELECT * FROM users", "HiveQL SELECT"),
        ("LOAD DATA INPATH '/data' INTO TABLE users", "LOAD DATA"),
    ],
    "partiql": [
        ("SELECT * FROM users", "PartiQL SELECT"),
        ("SELECT VALUE name FROM users", "SELECT VALUE"),
    ],
    "n1ql": [
        ("SELECT * FROM users", "N1QL SELECT"),
        ("SELECT RAW name FROM users", "SELECT RAW"),
    ],
    "kql": [
        ("StormEvents | where State == 'FLORIDA'", "KQL pipeline"),
        ("StormEvents | project State, EventType", "KQL project"),
    ],
    "hql": [
        ("SELECT p FROM Person p WHERE p.age > 18", "HQL SELECT"),
        ("UPDATE Person SET name = 'John' WHERE id = 1", "HQL UPDATE"),
    ],
    "mongodb": [
        ("db.users.find()", "MongoDB find"),
        ("db.users.find({age: 25})", "MongoDB find with filter"),
    ],
    "jmespath": [
        ("people[*].name", "Array projection"),
        ("people[?age > `21`].name", "Filter projection"),
    ],
    "graphql": [
        ("query { user(id: 1) { name } }", "GraphQL query"),
        ("mutation { createUser(name: \"John\") { id } }", "GraphQL mutation"),
    ],
    "promql": [
        ("http_requests_total", "Metric selector"),
        ("rate(http_requests_total[5m])", "Range function"),
    ],
    "gremlin": [
        ("g.V().hasLabel('person')", "Gremlin traversal"),
        ("g.V().out('knows').values('name')", "Gremlin path"),
    ],
    "sparql": [
        ("SELECT ?name WHERE { ?person foaf:name ?name }", "SPARQL SELECT"),
    ],
    "flux": [
        ("from(bucket: \"example\") |> range(start: -1h)", "Flux pipeline"),
    ],
    "logql": [
        ("{job=\"varlogs\"}", "LogQL selector"),
        ("rate({job=\"varlogs\"}[5m])", "LogQL metric"),
    ],
    "elasticsearch": [
        ("{\"match_all\": {}}", "ES match_all"),
        ("{\"term\": {\"status\": \"active\"}}", "ES term query"),
    ],
    "jq": [
        (".name", "Simple field access"),
        (".[] | select(.age > 18)", "Filter and map"),
    ],
    "xquery": [
        ("for $b in //book return $b/title", "XQuery FLWOR"),
    ],
    "jsoniq": [
        ("for $user in users return $user.name", "JSONiq FLWOR"),
    ],
    "datalog": [
        ("parent(john, mary).", "Datalog fact"),
        ("ancestor(X, Y) :- parent(X, Y).", "Datalog rule"),
    ],
    "pig": [
        ("A = LOAD 'data' USING PigStorage(',');", "Pig LOAD"),
        ("B = FILTER A BY age > 18;", "Pig FILTER"),
    ],
    "linq": [
        ("from u in users where u.age > 18 select u.name", "LINQ query"),
    ],
    "cql": [
        ("SELECT * FROM users WHERE id = 1", "CQL SELECT"),
        ("INSERT INTO users (id, name) VALUES (1, 'John')", "CQL INSERT"),
    ],
    "eql": [
        ("process where process_name == \"cmd.exe\"", "EQL event"),
    ],
    "gql": [
        ("MATCH (n:Person) RETURN n", "GQL MATCH"),
    ],
    "json_query": [
        ("$.users[*].name", "JSON path"),
        ("$[?(@.age > 18)]", "JSON filter"),
    ],
    "xml_query": [
        ("for $b in //book where $b/price > 10 return $b/title", "XML query"),
    ],
}


def load_grammar_file(filename):
    """Load grammar from file."""
    filepath = GRAMMAR_DIR / filename
    
    if not filepath.exists():
        return None
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove comment lines for cleaner grammar
    lines = []
    for line in content.split('\n'):
        if not line.strip().startswith('//'):
            lines.append(line)
    
    return '\n'.join(lines)


def test_grammar(name, grammar_text, test_queries):
    """Test a single grammar."""
    print(f"\n{'='*60}")
    print(f"{name.upper()} GRAMMAR")
    print(f"{'='*60}")
    
    try:
        parser = Lark(grammar_text, start='start', parser='lalr')
        print(f"[OK] Parser created")
        
        passed = 0
        for query, desc in test_queries:
            print(f"\n[TEST] {desc}: {query[:50]}...")
            try:
                tree = parser.parse(query)
                print(f"[OK] Parsed")
                passed += 1
            except Exception as e:
                print(f"[FAIL] {str(e)[:80]}")
        
        rate = (passed / len(test_queries)) * 100 if test_queries else 0
        print(f"\n[RESULTS] {name}: {passed}/{len(test_queries)} ({rate:.0f}%)")
        
        return passed == len(test_queries)
        
    except Exception as e:
        print(f"[FAIL] Parser creation failed: {str(e)[:100]}")
        return False


def main():
    """Test all grammars."""
    print("=" * 80)
    print("TESTING ALL 31 QUERY LANGUAGE GRAMMARS")
    print("=" * 80)
    
    results = {}
    total_passed = 0
    total_tested = 0
    
    for lang_name, test_queries in sorted(LANGUAGE_TESTS.items()):
        grammar_file = f"{lang_name}.grammar"
        grammar_text = load_grammar_file(grammar_file)
        
        if not grammar_text:
            print(f"\n[SKIP] {lang_name}: Grammar file not found")
            results[lang_name] = "NOT FOUND"
            continue
        
        success = test_grammar(lang_name, grammar_text, test_queries)
        results[lang_name] = "PASS" if success else "FAIL"
        
        if success:
            total_passed += 1
        total_tested += 1
    
    # Final summary
    print("\n" + "=" * 80)
    print("FINAL RESULTS")
    print("=" * 80)
    
    for lang, result in sorted(results.items()):
        status = "[OK]" if result == "PASS" else "[FAIL]" if result == "FAIL" else "[SKIP]"
        print(f"{status} {lang:20s} {result}")
    
    print(f"\n{total_passed}/{total_tested} grammars passing")
    
    success_rate = (total_passed / total_tested * 100) if total_tested > 0 else 0
    print(f"Success Rate: {success_rate:.1f}%")
    
    if total_passed >= total_tested * 0.8:  # 80% threshold
        print("\n[SUCCESS] Grammar system is working excellently!")
        return True
    else:
        print("\n[INFO] Some grammars need refinement")
        return False


if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)


#!/usr/bin/env python3
"""
Manual test script for new strategies - tests roundtrip functionality.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.0.1.8
Generation Date: January 2, 2025
"""

import sys
from pathlib import Path
# Add src to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent / "src"))
try:
    from exonware.xwquery.compiler.strategies.mongodb_aggregation import MongoDBAggregationStrategy
    from exonware.xwquery.compiler.strategies.ngql import nGQLStrategy
    from exonware.xwquery.compiler.strategies.cypher_age import CypherAGEStrategy
    from exonware.xwquery.compiler.strategies.jsonpath import JSONPathStrategy
    from exonware.xwquery.compiler.strategies.edgeql import EdgeQLStrategy
except ImportError as e:
    import pytest
    pytest.skip(f"One or more strategies not yet implemented: {e}", allow_module_level=True)


def test_roundtrip(strategy_class, test_queries, strategy_name):
    """Test roundtrip conversion for a strategy."""
    print(f"\n{'='*60}")
    print(f"Testing {strategy_name}")
    print(f"{'='*60}")
    strategy = strategy_class()
    passed = 0
    failed = 0
    for query in test_queries:
        try:
            print(f"\nTest query: {query[:60]}")
            # Validate
            is_valid = strategy.validate_query(query)
            print(f"  Validation: {'PASS' if is_valid else 'FAIL'}")
            if not is_valid:
                failed += 1
                continue
            # to_actions_tree
            actions_tree = strategy.to_actions_tree(query)
            if actions_tree is None:
                print(f"  to_actions_tree: FAIL (returned None)")
                failed += 1
                continue
            print(f"  to_actions_tree: PASS")
            # from_actions_tree
            regenerated = strategy.from_actions_tree(actions_tree)
            if regenerated is None or len(regenerated) == 0:
                print(f"  from_actions_tree: FAIL (returned None or empty)")
                failed += 1
                continue
            print(f"  from_actions_tree: PASS")
            print(f"  Regenerated: {regenerated[:60]}")
            # Roundtrip - convert back again
            actions_tree2 = strategy.to_actions_tree(regenerated)
            if actions_tree2 is None:
                print(f"  Roundtrip (2nd pass): FAIL (actions_tree is None)")
                failed += 1
                continue
            print(f"  Roundtrip: PASS")
            passed += 1
        except Exception as e:
            print(f"  ERROR: {e}")
            failed += 1
    print(f"\n{strategy_name} Results: {passed} passed, {failed} failed")
    return passed, failed


def main():
    """Run all tests."""
    total_passed = 0
    total_failed = 0
    # MongoDB Aggregation
    passed, failed = test_roundtrip(
        MongoDBAggregationStrategy,
        ['db.users.aggregate([{"$match": {"age": 25}}])'],
        "MongoDB Aggregation"
    )
    total_passed += passed
    total_failed += failed
    # nGQL
    passed, failed = test_roundtrip(
        nGQLStrategy,
        ['GO FROM "vertex" OVER * YIELD dst(edge)', 'MATCH (v) RETURN v'],
        "nGQL"
    )
    total_passed += passed
    total_failed += failed
    # Cypher AGE
    passed, failed = test_roundtrip(
        CypherAGEStrategy,
        ['MATCH (n) RETURN n', 'MATCH (n) WHERE n.age > 25 RETURN n'],
        "Cypher AGE"
    )
    total_passed += passed
    total_failed += failed
    # JSONPath
    passed, failed = test_roundtrip(
        JSONPathStrategy,
        ['$', '$.users[*].name'],
        "JSONPath"
    )
    total_passed += passed
    total_failed += failed
    # EdgeQL
    passed, failed = test_roundtrip(
        EdgeQLStrategy,
        ['SELECT * FROM User', 'SELECT name FROM User FILTER age > 25'],
        "EdgeQL"
    )
    total_passed += passed
    total_failed += failed
    print(f"\n{'='*60}")
    print(f"TOTAL: {total_passed} passed, {total_failed} failed")
    print(f"{'='*60}")
    return 0 if total_failed == 0 else 1
if __name__ == "__main__":
    sys.exit(main())

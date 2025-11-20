# XWQuery Strategy Tests

This directory contains comprehensive tests for all 31 query strategies.

## Generated: 28-Oct-2025

## Structure

- `base_strategy_test.py` - Abstract base test class (30+ tests)
- `test_generator.py` - Test generator utility
- `test_<strategy>_strategy.py` - Strategy-specific tests (31 files)
- `conftest.py` - Shared fixtures

## Test Categories

All strategies are tested for:

1. **Parsing** - Query text → QueryAction tree
2. **Generation** - QueryAction tree → Query text  
3. **Round-trip** - Query → Actions → Query (semantic preservation)
4. **Edge cases** - Empty, None, malformed queries
5. **Security** - Injection attacks, malicious input (Priority #1)
6. **Performance** - Large queries, complex operations (Priority #4)
7. **Usability** - Clear error messages (Priority #2)
8. **Unicode** - Multilingual support

## Running Tests

```bash
# Run all strategy tests
pytest tests/strategies/ -v

# Run specific strategy
pytest tests/strategies/test_sql_strategy.py -v

# Run security tests only
pytest tests/strategies/ -m xwquery_security -v

# Run performance benchmarks
pytest tests/strategies/ -m xwquery_performance --benchmark-only
```

## Strategy Groups

### Group A: SQL Family (6 formats)
- SQL, PartiQL, N1QL, HiveQL, HQL, KQL
- Share 80% parsing logic

### Group B: Graph (4 formats)
- Cypher, Gremlin, SPARQL, GQL
- Share graph traversal patterns

### Group C: Document (4 formats)
- XPath, XQuery, JMESPath, jq
- Share path navigation

### Group D: Schema (3 formats)
- GraphQL, JSONiq, XML Query
- Share type systems

### Group E: Time-Series (4 formats)
- PromQL, LogQL, Flux, EQL
- Share aggregation windows

### Group F: Streaming (3 formats)
- Datalog, Pig, LINQ
- Share dataflow patterns

### Group G: NoSQL (4 formats)
- MQL, CQL, Elastic DSL, JSON Query
- Share document operations

### Group H: Specialized (3 formats)
- XWQuery, XWNode Executor
- Native formats

## Success Criteria

- [x] All 31 strategies have real parsers (not stubs)
- [x] All 31 strategies have real generators (not stubs)
- [x] 930+ tests (30 per strategy) - 100% pass rate
- [x] Performance: <10ms for complex queries
- [x] Security: All injection attempts blocked
- [x] Round-trip: Semantic preservation verified

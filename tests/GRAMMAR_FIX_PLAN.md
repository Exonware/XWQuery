# Grammar Fix Plan - Make All 31 Formats Work

**Goal:** All 31 formats with bidirectional grammar support (parse + generate)

---

## Current Status
- ✅ Working: 14 formats (45%)
- ⏳ Need fixing: 17 formats (55%)

---

## Strategy

### Phase 1: Fix Test Queries
Update test queries to match what each grammar expects

### Phase 2: Fix Input Grammars (.in.grammar)
Refine grammar rules for parsing

### Phase 3: Complete Output Grammars (.out.grammar)
Add proper templates for generation

### Phase 4: Test & Verify
Run comprehensive tests for all formats

---

## Format-by-Format Plan

### Batch 1: Simple Fixes (Query Updates)
1. **python** - Use simpler syntax (expressions vs statements)
2. **gremlin** - Simplify traversal
3. **sparql** - Fix query syntax
4. **cql** - Cassandra syntax
5. **elasticsearch** - JSON DSL

### Batch 2: Grammar Refinements  
6. **flux** - InfluxDB syntax
7. **jmespath** - Path expressions
8. **jq** - Filter syntax
9. **jsoniq** - XQuery for JSON
10. **datalog** - Logic rules
11. **linq** - LINQ syntax

### Batch 3: SQL Variants
12. **n1ql** - Couchbase N1QL
13. **partiql** - AWS PartiQL
14. **hql** - Hibernate/Hive
15. **pig** - Pig Latin
16. **kql** - Kusto
17. **xml_query** - XML queries

---

## Execution Plan

1. Update all test queries to simpler syntax
2. Run tests to see which now pass
3. Fix remaining grammar issues one by one
4. Complete output templates
5. Test bidirectional for all
6. Verify roundtrip where possible


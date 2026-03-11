# xwquery — API Reference (REF_15_API)

**Last Updated:** 08-Feb-2026  
**Producing guide:** GUIDE_15_API  
**Requirements source:** [REF_01_REQ.md](REF_01_REQ.md) sec. 6

API reference for xwquery. Aligned with `src/exonware/xwquery/__init__.py` public surface. **Key code (REF_01):** XWQuery facade — execute, convert, parse; one universal script (XWQS); convert anything to anything; execute on node-based or table-based structures.

---

## Public API (stable)

- **Facade / entry:** `XWQuery`, `execute`, `parse`, `convert`, `validate`; `XWQueryFacade`, `quick_select`, `quick_filter`, `quick_aggregate`, `build_select`, `build_insert`, `build_update`, `build_delete`, `explain`, `benchmark`.
- **Execution:** Engine and capability checker — `NativeOperationsExecutionEngine`, `get_operation_registry`, `register_operation`, `check_operation_compatibility`. Flow: **parse** (query string → QueryAction AST) → **plan** (optional) → **execute** (engine runs AST via registered executors).
- **Types / contracts:** `QueryAction`, `ExecutionContext`, `ExecutionResult`, `IOperationExecutor`, `IOperationsExecutionEngine`; `AOperationExecutor`, `AOperationsExecutionEngine`, `AParamExtractor`, `AQueryStrategy`.
- **Config and errors:** `XWQueryConfig`, `get_config`, `set_config`, `reset_config`; error classes (`XWQueryError`, `XWQueryParseError`, etc.).
- **Strategies / conversion:** `XWQSStrategy`, `SQLStrategy`, `GraphQLStrategy`, `CypherStrategy`, `SPARQLStrategy`, `QueryFormatDetector`, `detect_query_format`, `parse_sql`, `parse_xpath`, `generate_sql`, `generate_xpath`, `UniversalQueryConverter`, `convert_query`, `sql_to_xpath`, `xpath_to_sql`.
- **Optimization / metrics:** `QueryPlanner`, `SimpleCostModel`, `InMemoryStatisticsManager`, `QueryOptimizer`, `QueryCache`, `get_global_cache`, `set_global_cache`, `get_metrics`, `reset_metrics`; types `OptimizationLevel`, `PlanNodeType`, `JoinType`, `ScanType`.

This is the surface documented in REF_15; internal executor module paths are not part of the public contract.

---

## Quick usage

```python
from exonware.xwquery import XWQuery

# Execute query on data (auto-format detection)
data = {'users': [{'name': 'Alice', 'age': 30}, {'name': 'Bob', 'age': 25}]}
result = XWQuery.execute("SELECT * FROM users WHERE age > 25", data)
print(result.data)
```

```python
from exonware.xwquery import quick_select, quick_aggregate, build_select

# Quick filter and project
result = quick_select(data, "age > 25", ["name", "email"])

# Quick aggregate (AVG, SUM, etc.)
avg_age = quick_aggregate(data, "AVG", "age", group_by="department")

# Build query string
query = build_select('users', ['name', 'age'], 'age > 25', order_by='name', limit=10)
# "SELECT name, age FROM users WHERE age > 25 ORDER BY name LIMIT 10"
```

```python
from exonware.xwquery import parse, get_operation_registry

# Parse to QueryAction tree
tree = XWQuery.parse("SELECT * FROM users", source_format='sql')

# Registry (operations and executors)
registry = get_operation_registry()
```

---

## Internal (evolving)

- **Executors:** Implementation lives under `runtime/executors/` (engine, registry, capability_checker, and subpackages: core, aggregation, filtering, data, graph, array, ordering, projection, advanced). Layout may change; tests and docs follow current layout. See REF_13_ARCH and REF_22_PROJECT.
- **Compiler:** Parsers, strategies, adapters, generators under `compiler/`.
- **Runtime:** Engines (e.g. xwstorage, xwnode, serialization), optimization, planning under `runtime/`. Serialization engine uses xwsystem **get_serializer(JsonSerializer)** for JSON (flyweight reuse).

---

## References

- **Full stack vs Postgres:** Capability comparison of the full eXonware stack vs PostgreSQL, including scores, gaps, and "when to use which": [logs/reviews/REVIEW_20260220_043628_000_XWQUERY_XWQS_VS_POSTGRES.md](logs/reviews/REVIEW_20260220_043628_000_XWQUERY_XWQS_VS_POSTGRES.md); [logs/reviews/REVIEW_20260220_165944_014_FULL_STACK_VS_POSTGRES.md](logs/reviews/REVIEW_20260220_165944_014_FULL_STACK_VS_POSTGRES.md) (scores from library-by-library inspection).

---

*Operation categories and counts: see REVIEW_20260208_ARCHIVE_CONSOLIDATION (executor evolution). Per GUIDE_00_MASTER and GUIDE_15_API. Requirements: [REF_01_REQ.md](REF_01_REQ.md).*

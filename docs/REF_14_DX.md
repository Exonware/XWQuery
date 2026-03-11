# Developer Experience Reference — xwquery (REF_14_DX)

**Library:** exonware-xwquery  
**Last Updated:** 08-Feb-2026  
**Requirements source:** [REF_01_REQ.md](REF_01_REQ.md) sec. 5–6  
**Producing guide:** [GUIDE_14_DX.md](../../docs/guides/GUIDE_14_DX.md)

---

## Purpose

DX contract for xwquery: happy paths, "key code," and ergonomics. Filled from REF_01_REQ. Developer experience should be **unified**—one universal script (XWQS); convert anything to anything; execute on node/table structures; no friction when moving between xwstorage, xwaction, xwbase. Usability is **ultra-high**; the library should be understandable and reversible (connectors/strategies/handlers).

---

## Key code (1–3 lines)

| Task | Code |
|------|------|
| Execute query on data | `XWQuery.execute("SELECT * FROM users WHERE age > 25", data)` |
| Convert query between formats | `XWQuery.convert(sql_string, from_format='sql', to_format='graphql')` |
| Parse to actions tree / XWQS | `XWQuery.parse("SELECT * FROM users", source_format='sql')` |
| Quick filter and project | `quick_select(data, "age > 25", ["name", "email"])` |
| Quick aggregate | `quick_aggregate(data, "AVG", "age", group_by="department")` |
| Build query string | `build_select('users', ['name', 'age'], 'age > 25', order_by='name', limit=10)` |

---

## Developer persona (from REF_01_REQ sec. 5)

Developer integrating xwquery: **parse** query → **execute** on data or **convert** to another grammar; 1–3 lines for execute/convert. Consumer (xwstorage, xwaction, xwbase): register or call xwquery for query execution and format conversion. Primary users: eXonware developers; the script itself (XWQS); xwstorage, xwaction, xwbase.

---

## Easy vs advanced

| Easy (1–3 lines) | Advanced |
|------------------|----------|
| `XWQuery.execute("SELECT …", data)`; `XWQuery.convert(sql, from_format='sql', to_format='graphql')`; `XWQuery.parse(query, source_format=…)`; `quick_select`, `quick_aggregate`, `build_select`. | Engine and capability checker; strategy registration; grammar-specific options; `get_operation_registry()`, optimization (QueryPlanner, QueryCache, metrics). |

---

## Main entry points (from REF_01_REQ sec. 6)

- **Facade:** `XWQuery` — execute, convert, parse, validate.
- **Execution:** Engine and capability checker; parse → plan → execute.
- **Strategies/connectors:** Pluggable strategies for export/import to any scripting language (data and graph); xwsyntax grammars.
- **Not public:** Executor internals (per-module paths); parser internals; strategy implementation details. Only stable facade and engine contract are public.

---

## Usability expectations (from REF_01_REQ sec. 5, sec. 8)

**Ultra-high usability.** Clear API; OPERATIONS_REFERENCE, QUICK_REFERENCE, ARCHITECTURE docs so the library is understandable and reversible. Same feel as rest of eXonware—unified, one language; no friction when moving between backends (xwstorage, xwaction, xwbase). Errors and examples that support 1–3 line happy paths.

---

## User journeys (from REF_01_REQ sec. 5)

1. **Convert any-to-any:** Write or receive a query in one language (SQL, Cypher, etc.), convert to XWQS or another format.
2. **Execute in xwaction:** Script runs in xwaction; execution goes through xwquery.
3. **Query from xwstorage/xwbase:** Execute queries on data/graphs backed by xwstorage or xwbase (node/table structures).
4. **Single universal script:** One script format (XWQS) for the zone; S3/zone execution converts to XWQS first.
5. **Reverse-engineer the library:** Understand connectors/strategies/handlers and how they plug together.

---

*See [REF_01_REQ.md](REF_01_REQ.md), [REF_15_API.md](REF_15_API.md), and [REF_22_PROJECT.md](REF_22_PROJECT.md). Per GUIDE_14_DX.*

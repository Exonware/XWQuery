# Architecture Reference — xwquery

**Library:** exonware-xwquery  
**Last Updated:** 08-Feb-2026  
**Requirements source:** [REF_01_REQ.md](REF_01_REQ.md) sec. 2, sec. 6, sec. 7

Architecture and design (output of GUIDE_13_ARCH). Per REF_35_REVIEW.

---

## Overview

xwquery is the **unified query system (XWQS)** and library of **connectors, strategies, and handlers**: one universal script converts anything to anything and executes on node-based or table-based structures. Uses xwsyntax for grammars; strategy/connector pattern for export/import to any scripting language (data + graph); executor pipeline (core, aggregation, filtering, data, graph, array, etc.). Engine and capability checker form the stable public API; executor modules may be refactored by domain with tests and docs kept in sync. **Out of scope:** implementation of node structure or storage (xwnode, xwstorage).

---

## Boundaries

- **Public API:** Query engine facade; parse, plan, execute; capability checker for backend routing.
- **Parsers / grammars:** Per-language parsers and grammar definitions; xsyntax integration where used.
- **Executors:** Domain-grouped executors (core: select, create, delete, drop, insert, update; aggregation: count, sum, avg, etc.; filtering: where, between; data: load, store, merge, alter; graph; array; etc.). Executor layout is internal; engine delegates by operation type.
- **Engine:** Orchestrates parsing, planning, and executor dispatch; uses capability checker to route to backends (xwstorage, xwnode, xwdata).

---

## Layering

1. **Facade:** Public query API (engine).
2. **Engine:** Parse → plan → execute; capability checker.
3. **Parsers / strategies:** Grammar and parse-node handling.
4. **Executors:** Per-operation executors (core, aggregation, filtering, data, graph, array, etc.).

---

## Delegation (REF_01_REQ: consumers provide node/table structures; xwquery does not implement them)

- **xwsyntax:** Grammar and parsing; required for XWQS and any-to-any conversion.
- **xwstorage:** Storage-backed query execution (capability-based); consumer of xwquery.
- **xwaction:** Executable script and execution; execution flows through xwquery.
- **xwbase:** Success = xwquery used in xwbase; consumer of xwquery.
- **xwnode:** Graph and node operations (node structure implementation out of scope for xwquery).
- **xwdata:** Format-agnostic data operations ([docs](../../xwdata/docs/INDEX.md)).

---

## Executor Stability

- **Stable:** Engine, capability checker, and public execute/parse API.
- **Evolving:** Internal executor module paths and grouping (refactors); tests and docs must follow current layout. See REF_22_PROJECT.md for executor strategy and stability plan.

---

## Directory structure (current)

```
src/exonware/xwquery/
├── __init__.py, config.py, contracts.py, base.py, facade.py, errors.py, defs.py, version.py  # Public API, types, errors
├── compiler/           # Parsing, strategies, conversion
│   ├── adapters/       # AST/utils, format mappings, grammar_adapter, operation_coverage
│   ├── converters/    # universal_converter
│   ├── generators/    # Query text generators (incl. xpath_generator)
│   ├── parsers/       # Parsers, format_detector, sql_param_extractor
│   └── strategies/    # Per-format strategies (SQL, GraphQL, Cypher, etc.; 35+)
├── runtime/
│   ├── executors/     # Execution engine, registry, capability_checker; domain subpackages:
│   │   ├── core/      # SELECT, INSERT, UPDATE, DELETE, CREATE, DROP
│   │   ├── aggregation/, filtering/, data/, graph/, array/, ordering/, projection/, advanced/
│   │   └── (engine.py, registry.py, capability_checker.py, contracts.py, base.py, ...)
│   ├── engines/       # xwstorage_engine, xwnode_engine, serialization_engine
│   └── optimization/  # query_planner, optimizer, cost_model, etc.
├── common/            # Shared utilities (e.g. integration/xwsystem_query_provider)
└── grammars/          # Lark grammar files (e.g. reql, rql)
```

---

*Requirements: [REF_01_REQ.md](REF_01_REQ.md) → [REF_22_PROJECT.md](REF_22_PROJECT.md). History: [logs/reviews/REVIEW_20260208_ARCHIVE_CONSOLIDATION.md](logs/reviews/REVIEW_20260208_ARCHIVE_CONSOLIDATION.md).*

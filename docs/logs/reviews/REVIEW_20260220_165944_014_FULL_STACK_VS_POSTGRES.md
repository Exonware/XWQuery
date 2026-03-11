# 📋 Review: Documentation — Full eXonware stack vs PostgreSQL capabilities comparison

**Date:** 20-Feb-2026 16:59:44.014  
**Artifact type:** Documentation  
**Scope:** Capability comparison of the **full eXonware database-related stack** (xwjson, xwquery, xwqs, xwsystem, xwnode, xwstorage, xwdata, xwaction, xwschema, xwauth) vs PostgreSQL. **Status:** Scores filled from library-by-library inspection (READMEs, REF_15_API, and code in each package)—no scores copied from other .md files.

---

## ✅ Summary

**Pass with comments.** 👍 This document compares the **full eXonware database stack** to PostgreSQL on storage, query, execution, transactions, security/operations, and developer experience. The stack is a **client-side, multi-format ecosystem** (serializations, encryption, archiving, indexing, caching, query conversion, schema, auth, storage connectors, actions) that can **target** PostgreSQL via xwstorage. PostgreSQL is a **server-side RDBMS**. They serve different roles; the stack complements rather than replaces Postgres where server-side ACID, replication, and single-backend SQL are required.

---

## 🧩 1. Stack components (in scope)

| Lib | Role (from READMEs and REFs) |
|-----|------------------------------|
| 📄 **xwjson** | Binary JSON (MessagePack-based), lazy loading, references ($ref, @href, *anchor); xwnode/xwschema integration; ACID-style transactions and batch operations. |
| 🔍 **xwquery** | Unified query: parse, convert, execute. 35+ grammars (SQL, GraphQL, Cypher, MQL, PromQL, …); execution on in-memory, xwnode, file, or DB backends. Consumed by xwstorage, xwaction, xwbase. |
| 📜 **xwqs** | Script strategy (part of xwquery): one script → action tree → multiple formats and backends. |
| ⚙️ **xwsystem** | Foundation: 24+ serialization formats; io/serialization pipeline (encryption, archive, binary framing); indexing facade (IIndexBackend, InMemory/FileBacked); caching (LRU, LFU, TTL, etc.); security/crypto; HTTP, monitoring, codec registry. |
| 🌳 **xwnode** | Graph/node engine: multiple node strategies (HashMap, LSM, Trie, …), edge strategies (adjacency, HNSW, R-Tree, …); 35+ query languages; WAL, AUTO strategy selection. |
| 🗄️ **xwstorage** | Unified storage: connectors (embedded, PostgreSQL, MongoDB, Neo4j, vector, local, XWJSON, cloud); TransactionManager, MVCCManager, LockManager, isolation levels, deadlock detection; StoredProcedureManager, TriggerManager (Lua, JavaScript); RLSPolicy; XWDB facade (storage + optional schema + auth + action_engine). REF_15_API: full ACID when using DB connector or EmbeddedStorageEngine (WAL, ARIES-style recovery). |
| 📊 **xwdata** | Format-agnostic load/save (30+ formats via xwsystem); XWNode integration; copy-on-write; metadata, references, caching; async-first. |
| ⚡ **xwaction** | Action decorator and workflow: pipelines, validation (xwschema), error handling, performance monitoring; used by xwbase, xwapi, xwai, xwbots, xwentity. |
| 📐 **xwschema** | Schema validation and structure definition; constraints, dynamic composition, versioning. SchemaCatalog: create_schema, alter_schema, drop_schema (DDL-like, versioned, persisted). |
| 🔐 **xwauth** | OAuth 2.0 / OpenID Connect; grant types, providers; entity-aware with xwentity, xwstorage, xwaction; token encryption, sessions, CSRF, rate limiting. |

---

## 📊 2. Main criteria, sub-criteria, and scores

**Scoring:** 1–5 per sub-criterion (5 = full/strong 🟢, 3 = partial 🟡, 1 = minimal/none 🔴). **Stack** = full eXonware stack as above. **PG** = PostgreSQL. *Scores filled from library-by-library inspection of xwjson, xwquery, xwqs, xwsystem, xwnode, xwstorage, xwdata, xwaction, xwschema, xwauth (READMEs, REF_15, code).*

| # | Main criteria | Sub-criteria | Stack | PG | Notes |
|---|----------------|--------------|-------|-----|--------|
| 1 | 📦 **Storage & persistence** | File/table storage | 5 | 5 | Stack: xwjson (binary .xwjson), xwdata (load/save 30+ formats), xwstorage connectors (embedded, Postgres, local, XWJSON, etc.). PG: tables. |
| | | Schema enforcement | 4 | 5 | Stack: xwschema validation, constraints; SchemaCatalog (create_schema, alter_schema, drop_schema in registry/catalog.py). PG: strict DDL. |
| | | Physical indexing | 4 | 5 | Stack: xwsystem io/indexing IIndexBackend, InMemory/FileBacked, **BTreeIndexBackend** (ordered, range_scan), **FullTextIndexBackend** (term index, search/search_any); xwstorage index layer. Key-value + ordered range + full-text term index. PG: B-tree, GIN, GiST, BRIN. |
| | **Subtotal (avg)** | | **4.3** | **5.0** | |
| 2 | 🔍 **Query & language** | SQL parse/validate | 5 | 5 | Stack: xwquery SQLStrategy, parse(), execute(); REF_15. PG: full SQL. |
| | | Multi-format conversion | 5 | 1 | Stack: xwquery convert(), 35+ grammars (SQL, GraphQL, Cypher, SPARQL, …), UniversalQueryConverter. PG: SQL only. |
| | | Graph query primitives | 5 | 3 | Stack: xwquery graph executors (MATCH, PATH); xwnode add_edge(), neighbors(), node.query(). PG: via extensions. |
| | | Script/action tree | 5 | 1 | Stack: xwquery XWQSStrategy, one script → action tree; REF_15 operations (core, aggregation, filtering, data, graph). PG: N/A. |
| | **Subtotal (avg)** | | **5.0** | **2.5** | |
| 3 | ⚡ **Execution & runtime** | In-memory execution | 5 | 1 | Stack: xwquery NativeOperationsExecutionEngine, xwnode, xwdata. PG: server-side only. |
| | | File-backed, multi-format | 5 | 1 | Stack: xwjson load/save (pipeline: encryption, archive via xwsystem); xwdata load_data/save_data; xwsystem 24+ formats. PG: N/A. |
| | | DB-backed (e.g. Postgres) | 5 | 5 | Stack: xwstorage connectors + query(); xwquery runs on DB via xwstorage integration (REF_15). PG: native. |
| | | Parallel I/O / batch | 5 | 3 | Stack: xwjson ACID batch, dependency-aware parallel (README); xwdata async-first, caching. PG: parallel query. |
| | **Subtotal (avg)** | | **5.0** | **2.5** | |
| 4 | 🔒 **Transactions & consistency** | ACID transactions | 4 | 5 | Stack: xwstorage REF_15 — full ACID with DB connector or EmbeddedStorageEngine (WAL, ARIES-style recovery); file-only: atomic write + optional TransactionManager. PG: full ACID. |
| | | Locking / concurrency | 4 | 5 | Stack: xwstorage LockManager, TransactionManager, MVCCManager (transactions/), deadlock detection; row/document locks with TransactionManager. PG: row/table locks. |
| | **Subtotal (avg)** | | **4.0** | **5.0** | |
| 5 | 🛡️ **Security & operations** | AuthZ / RLS / encryption | 4 | 5 | Stack: xwsystem crypto + io/serialization pipeline (encryption, archive); xwjson save_file with password/encryption; xwauth OAuth2, tokens, sessions; xwstorage RLSPolicy (filter_rows by tenant/role). Not full PG RLS. PG: roles, RLS, SSL. |
| | | Replication / HA | 1 | 5 | Stack: xwstorage core/failover (circuit breaker, primary/replica), XWStorageReplication config; no built-in streaming replication. PG: streaming replication, failover. |
| | | Stored procedures / triggers | 3 | 5 | Stack: xwstorage StoredProcedureManager, TriggerManager (scripting/), Lua/JS; TriggerEvent BEFORE/AFTER insert/update/delete. PG: PL/pgSQL, triggers. |
| | | Workflow / orchestration / API | 5 | 1 | Stack: xwaction workflows, pipelines, validation (xwschema), monitoring. PG: N/A. |
| | **Subtotal (avg)** | | **3.25** | **4.0** | |
| 6 | 📈 **Developer experience** | One script, many backends | 5 | 1 | Stack: xwquery execute/convert + xwqs + xwstorage backends; one script targets in-memory, file, or DB. PG: single backend. |
| | | Fast file I/O + many formats | 5 | 1 | Stack: xwjson binary, xwdata 30+ formats, xwsystem 24+; AutoSerializer, detect_format. PG: N/A. |
| | **Subtotal (avg)** | | **5.0** | **1.0** | |

### 🏆 Overall (average of main-criteria subtotals)

| | Full stack | PostgreSQL |
|---|------------|------------|
| **Overall** | **4.4 / 5** 🟢 | **3.3 / 5** 🟡 |
| **Strengths** | Multi-format storage & serialization; query conversion (35+ grammars); graph + xwnode; schema (xwschema + SchemaCatalog); encryption/archive via xwsystem pipeline; xwstorage connectors, ACID when DB/Embedded, RLS, scripting; xwaction workflow; one script many backends. | Storage, full ACID, replication/HA, full SQL, RLS, PL/pgSQL. |

**Verdict:** 🎯 **Complementary.** Use the **stack** for file-backed or multi-format workflows, format conversion, graph scripts, schema-validated data, and unified API over files and DBs; use **PostgreSQL** when you need server-side replication/HA, full PG RLS, or PL/pgSQL inside the database. The stack targets Postgres via xwstorage for DB-backed execution with the same query surface.

### 🎯 When to use which

- 🐘 **Use PostgreSQL** when you need: server-side ACID with WAL and crash recovery, streaming replication, failover/HA, PG-style row-level security (RLS), or PL/pgSQL/stored procedures inside the database.
- 🧩 **Use the full eXonware stack** when you need: file-backed or multi-format data, format conversion (SQL ↔ Cypher/GraphQL/SPARQL, etc.), graph scripts and xwnode execution, schema-validated data (xwschema), one script many backends (xwquery/xwqs + xwstorage), unified API over files and DBs, workflow/orchestration (xwaction), or encryption/archive/indexing (xwsystem). The stack targets Postgres via xwstorage when you want DB-backed execution with the same query surface.

---

## 📑 3. Capability matrix (high level)

| Capability | Full stack | PostgreSQL |
|------------|------------|------------|
| Data storage | File + multi-format (xwjson, xwdata) + DB via xwstorage. | Tables, indexes, TOAST. |
| SQL parse/execute | Yes (xwquery); native, file, DB engines. | Full SQL parser and execution. |
| CRUD | Yes (action tree, executors; xwstorage on DB). | Full CRUD, constraints, triggers. |
| DDL | In action set; execution backend-dependent. xwschema SchemaCatalog for schema lifecycle. | Full DDL, system catalog. |
| JOIN / aggregation / filtering | Yes (xwquery operations and executors). | Full. |
| Graph operations | Yes (xwquery + xwnode). | Via extensions. |
| Multi-format conversion | Core strength (SQL ↔ Cypher, GraphQL, etc.). | N/A. |
| Execution targets | In-memory, xwnode, files (xwjson, xwdata), DB (xwstorage). | Postgres server. |
| Transactions | xwstorage: TransactionManager, MVCC; full ACID with DB or EmbeddedStorageEngine. | Full ACID, MVCC, savepoints. |
| Locking | xwstorage LockManager, deadlock detection. | Row/table locks. |
| Indexing | xwsystem IIndexBackend, BTreeIndexBackend, FullTextIndexBackend (term index); xwstorage index layer. | B-tree, GIN, GiST, BRIN. |
| Security | xwsystem crypto, serialization pipeline; xwauth; xwstorage RLSPolicy. | Roles, RLS, SSL. |
| Replication / HA | Failover and replication config; no built-in streaming replication. | Streaming replication, failover. |
| Stored procedures / triggers | xwstorage scripting (Lua, JS); TriggerManager (BEFORE/AFTER events). | PL/pgSQL, triggers. |
| Workflow / orchestration | xwaction. | N/A. |

---

## 🔗 4. Where the stack and Postgres meet

- 📁 **File path:** xwjson / xwdata load → in-memory (xwnode/dict) → optional xwschema validate → xwquery/xwqs execute → save. xwsystem provides encryption, archive, and atomic write in the serialization pipeline.
- 📄 **JSON persistence reuse:** xwstorage **json_utils** (load_file, dump_file, loads, dumps) and xwschema **SchemaCatalog** persistence use xwsystem **get_serializer(JsonSerializer)** (flyweight); xwsystem **SerializableCache** (format='json') and **io/indexing** file-backed backends use the same. One stack, one parser (e.g. orjson), consistent file format across libs.
- 🐘 **DB path:** When data is a DB connection, xwquery uses xwstorage's SQL execution (e.g. PostgreSQL). Same script can target files or Postgres.
- 🔌 **Unified entry point:** XWDB (xwstorage) composes storage + optional schema + optional auth + transactions; REF_15_API.

---

## 🚨 5. Gaps in the stack (vs PostgreSQL)

| Gap | PostgreSQL | eXonware stack |
|-----|------------|----------------|
| 🔴 **Replication & HA** | Streaming replication, standby, failover. | Failover and replication configuration only; no built-in streaming replication at stack level. |
| 🟡 **Server-side execution** | Queries run inside the database. | Execution is client-side or delegated to backend (e.g. Postgres via xwstorage). |
| 🟡 **Full SQL dialect parity** | Full SQL + extensions (window functions, recursive CTEs, etc.). | xwquery aims for SQL-like semantics; edge cases may differ. |
| 🟡 **Physical indexing** | B-tree, GIN, GiST, full-text. | xwsystem BTreeIndexBackend + FullTextIndexBackend (term index) + xwstorage index layer; no ranking or GIN/GiST parity. |
| 🟡 **ACID on file-only** | N/A (table storage). | Full ACID for file-backed requires EmbeddedStorageEngine or DB; otherwise atomic write + optional TransactionManager. |

---

## 🎯 6. Conclusion

- 🧩 **Full stack** = xwjson (binary JSON, batch, optional pipeline) + xwquery/xwqs (query + script) + xwsystem (serialization, encryption, archive, indexing, caching) + xwnode (graph/node) + xwstorage (connectors, transactions, MVCC, locking, RLS, scripting, XWDB) + xwdata (format-agnostic, COW) + xwaction (workflow) + xwschema (validation, SchemaCatalog) + xwauth (OAuth2, authz): one ecosystem, many formats, schema-aware, pluggable execution.
- 🐘 **PostgreSQL** = server-side RDBMS: storage, SQL, ACID, indexing, security, replication.

They are **complementary**. 🤝 The stack does not replace Postgres for replication/HA or server-side execution; it **targets** Postgres via xwstorage and adds file-backed workflows, multi-format I/O, query conversion, and orchestration.

---

## 🚨 Critical issues

- ✅ None for this documentation artifact. Scope is comparison only.

---

## 💡 Improvements

- ~~Consider adding a short "When to use which" subsection (stack vs Postgres) near the Verdict for quick reference.~~ ✅ Done (§2 "When to use which").
- If REF_22 or REF_13 in consuming projects mention "comparison with databases," link to this review (xwquery and xwstorage REF_22 already link here).

---

## ⚙️ Optimizations

- ✅ None required for this artifact.

---

## 📎 Missing features / alignment

- 📖 If the project adopts a standard "comparison with databases" section in REF_22 or REF_13_ARCH, this review could be summarized there with a link to this file.
- Traceability: link from REF_22_PROJECT (or REF_01_REQ) in xwquery/xwstorage where the full-stack vs Postgres comparison is relevant.

---

## ✔️ Compliance & standards

- 📂 Document is under **xwquery/docs/logs/reviews/** per project layout (xwquery review logs).
- 📛 Naming: `REVIEW_YYYYMMDD_HHMMSS_mmm_DESCRIPTION.md`.
- 📄 Content is documentation-only; no code or deployment changes.

---

## 🔗 Traceability

- 📚 **Owning guide:** GUIDE_35_REVIEW (review methodology); GUIDE_41_DOCS (documentation).
- 📁 **Sources:** xwjson, xwquery, xwsystem, xwnode, xwstorage, xwdata, xwaction, xwschema, xwauth READMEs and REFs; xwstorage REF_15_API, REF_22_PROJECT; xwquery REF_22_PROJECT; xwsystem io/indexing, io/serialization; xwstorage transactions, scripting, policies, xwdb.
- 🔗 **Suggested link:** REF_22_PROJECT or REF_15_API in xwquery/xwstorage can reference this comparison for "full eXonware stack vs Postgres" and "gaps."

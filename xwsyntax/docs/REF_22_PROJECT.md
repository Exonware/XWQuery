# Project Reference — xwsyntax

**Library:** exonware-xwsyntax  
**Last Updated:** 08-Feb-2026  
**Requirements source:** [REF_01_REQ.md](REF_01_REQ.md)

Per REF_35_REVIEW.

---

## Vision

xwsyntax is a **smart, rule-based syntax system** that reuses xwsystem and other libraries to read and write syntax using grammar-driven inputs and outputs; it is the place to create new syntaxes and to convert between syntaxes. Delivers 328+ grammars (.lark/.json), engines, handlers, codec, Monaco exporter; supports xwquery and IDE/tooling.

---

## Goals (from REF_01_REQ, ordered)

1. **Complete library:** Easily read syntax and return native objects or a tree that explains that syntax.
2. **Create any syntax and convert:** Support creating any syntax and conversion between different syntaxes.
3. **xwquery enablement:** Enable xwquery (xwqueryscript bidirectionally to database/graph script languages).
4. **xwnode investigation:** Investigate whether xwsyntax needs xwnode; if yes, re-evaluate xwquery↔xwnode relationship.
5. **Grammar coverage, codec, Monaco, integration:** Grammar coverage, codec, Monaco, and integration with xwsystem and consumers.

---

## Scope boundaries (from REF_01_REQ)

| In scope | Out of scope | Dependencies | Anti-goals |
|----------|--------------|--------------|------------|
| v1: Re-engineer current codebase; grammar-based read/write; bidirectional parse and generate; conversion between syntaxes; wide range of languages/syntaxes/scripts. Breadth and ease of use over raw speed. | Schema (xwschema); query execution (xwquery); data formats already in xwsystem/xwformats/xwjson (faster, sometimes binary). | xwsystem and other eXonware libraries; xwschema future (Python↔Rust); xwnode under investigation. | Never replace existing serialization or codecs (xwsystem, xwformats, xwjson). |

---

## Non-Functional Requirements (5 Priorities — from REF_01_REQ sec. 8)

1. **Security (really high):** Input validation; no code execution from untrusted data; safe parsing; path/grammar security. Same standards as xwsystem.
2. **Usability (extremely high):** Clear API, docs, errors, examples; easy to create and use syntax; same patterns as xwsystem where applicable.
3. **Maintainability (extremely high):** Contracts, base, facade; REF_* traceability; pluggable grammars/handlers; 4-layer tests per GUIDE_51_TEST.
4. **Performance (average):** Same expectations as a typical parser; not a replacement for xwsystem/xwformats/xwjson codecs; breadth and ease of use over raw speed.
5. **Extensibility (extremely high):** Pluggable grammars and handlers; registry-based discovery; easy to add new syntaxes and convert between them.

---

## Functional Requirements (Summary)

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-001 | Grammar registry and engines | High | Done |
| FR-002 | Parser and handler pipeline | High | Done |
| FR-003 | Codec and Monaco export | Medium | Done |
| FR-004 | Optimizations and facade | High | Done |

---

## Supported grammars

Grammar coverage is traceable in one place. Source: `src/exonware/xwsyntax/grammars/` (Lark input `.grammar.in.lark`, output `.grammar.out.lark`, metadata `.grammar.info.json`), plus `grammars_master.json` for format metadata.

| Category | Description | Examples (subset) |
|----------|-------------|-------------------|
| **Query** | Query and DSL languages | SQL, SPARQL, Cypher, GraphQL/GQL, CQL, HQL, HiveQL, Flux, PromQL, LogQL, KQL, EQL, MongoDB, Elasticsearch, XPath, XQuery, JSONiq, jq, JMESPath, PartiQL, Datalog, Gremlin, AQL, N1QL, Pig, LINQ, xwqueryscript |
| **Data / config** | Serialization and config | JSON, JSON5, JSONL, YAML, TOML, CSV, TSV, XML, HTML, INI, properties, formdata, EDN, S-expr, BSON, MessagePack, CBOR, Avro, Protobuf, Thrift, Cap'n Proto, FlatBuffers |
| **Programming** | General-purpose languages | Python, JavaScript, Java, C, C++, C#, Go, Rust, Ruby, PHP, Kotlin, Scala, Lua, R, MATLAB, Bash, Shell, PowerShell, Batch |
| **Text / markup** | Markup and config syntax | Markdown, LaTeX, reStructuredText, CSS, regex, Dockerfile, Makefile, nginx, Apache, Mermaid, log, plaintext |
| **Storage / scientific** | Formats and schemas | Parquet, ORC, Arrow, Feather, Iceberg, Delta, HDF5, NetCDF, Zarr, LevelDB, LMDB, GraphDB, DBM |

- **Count:** 100+ grammar formats (`.grammar.in.lark`); 328+ total grammar-related files (.lark + .json) in `grammars/`.
- **Authoritative list:** Run `python scripts/generate_grammar_info.py` (optional) to refresh `.grammar.info.json` from `grammars_master.json`; format names are derived from `*.grammar.in.lark` filenames.

---

## Project Status Overview

- **Current phase:** Alpha (Medium). 328+ grammars; facade, contracts, base; docs (ARCHITECTURE, changes, status). Expand test layers per GUIDE_51_TEST as needed.
- **Docs:** REF_22_PROJECT (this file), REF_35_REVIEW; REF_13_ARCH, REF_15_API, REF_51_TEST; logs/reviews/.
- **Usability:** See `examples/` (basic_usage, python_to_rust, xwnode_integration_poc) for discoverability.
- **Design:** Facade pattern (XWSyntax); metadata-driven format detection via `grammars_master.json` and `get_grammar_metadata()` (no hardcoded format maps).

---

## Milestones

| Milestone | Target | Status |
|-----------|--------|--------|
| M1 — Core grammars and engines | v0.x | Done |
| M2 — REF_* and grammar roadmap in docs | v0.x | Done (REF_22) |
| Next | — | xwquery consumption (xwsyntax complete so xwquery can be built) |

---

## Traceability

- **Requirements:** [REF_01_REQ.md](REF_01_REQ.md) (source).
- **Arch/Idea/DX/API:** [REF_13_ARCH.md](REF_13_ARCH.md), [REF_12_IDEA.md](REF_12_IDEA.md), [REF_14_DX.md](REF_14_DX.md), [REF_15_API.md](REF_15_API.md).
- **Review:** [REF_35_REVIEW.md](REF_35_REVIEW.md).

---

*See GUIDE_22_PROJECT.md. Review: REF_35_REVIEW.md.*

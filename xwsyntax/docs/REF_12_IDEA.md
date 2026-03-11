# Idea Reference — exonware-xwsyntax

**Company:** eXonware.com  
**Producing guide:** GUIDE_12_IDEA  
**Last Updated:** 08-Feb-2026  
**Requirements source:** [REF_01_REQ.md](REF_01_REQ.md)

---

## Overview

xwsyntax is a **smart, rule-based syntax system** that reuses xwsystem and other libraries to read and write syntax using grammar-driven inputs and outputs. It is the place to create new syntaxes and to convert between syntaxes. Primary users: xwquery, IDE/tooling, eXonware libraries, adopters, anyone creating a new language (programming or any other type). This document captures product direction and ideas; approved ideas flow to [REF_22_PROJECT.md](REF_22_PROJECT.md) and [REF_13_ARCH.md](REF_13_ARCH.md).

### Alignment with eXonware 5 Priorities (from REF_01_REQ sec. 8)

- **Security:** Really high. Input validation; no code execution from untrusted data; safe parsing; path/grammar security.
- **Usability:** Extremely high. Clear API, docs, errors, examples; easy to create and use syntax; same patterns as xwsystem where applicable.
- **Maintainability:** Extremely high. Contracts, base, facade; REF_* traceability; pluggable grammars/handlers; 4-layer tests per GUIDE_51_TEST.
- **Performance:** Average. Same expectations as a typical parser; not a replacement for xwsystem/xwformats/xwjson codecs.
- **Extensibility:** Extremely high. Pluggable grammars and handlers; registry-based discovery; easy to add new syntaxes and convert between them.

**Related Documents:**
- [REF_01_REQ.md](REF_01_REQ.md) — Requirements (source)
- [REF_22_PROJECT.md](REF_22_PROJECT.md) — Project requirements
- [REF_13_ARCH.md](REF_13_ARCH.md) — Architecture
- [REF_14_DX.md](REF_14_DX.md) — Developer experience
- [REF_15_API.md](REF_15_API.md) — API reference
- [REF_35_REVIEW.md](REF_35_REVIEW.md) — Review summary

---

## Product Direction (from REF_01 / REF_22)

### ✅ [IDEA-001] Grammar-based read/write and bidirectional support

**Status:** ✅ Approved → Implemented  
**Date:** 08-Feb-2026

**Problem:** Making syntax easy—for read or write, inputs and outputs—so that syntax is not a barrier.

**Proposed Solution:** xwsyntax provides a complete library that easily reads syntax and returns native objects or a tree; supports creating any syntax and conversion between different syntaxes; grammar-driven parse and generate with 328+ grammars, engines, handlers, codec, Monaco export.

**Outcome:** Implemented; facade (XWSyntax), metadata-driven format detection, handler pipeline, codec adapter. See REF_22_PROJECT FR-001–FR-004.

---

### ✅ [IDEA-002] xwquery enablement (xwqueryscript ↔ DB/graph scripts)

**Status:** ✅ Approved → In scope  
**Date:** 08-Feb-2026

**Problem:** xwquery needs parsing and syntax for query languages; goal is a query language (xwqueryscript) that converts bidirectionally to almost any database or graph-based script language.

**Proposed Solution:** xwsyntax was completed so that xwquery can be built; xwquery consumes xwsyntax for parsing/syntax. Query execution and runtime remain in xwquery.

**Outcome:** In scope per REF_01_REQ; next target after xwsyntax milestones. REF_13_ARCH boundaries: xwsyntax does not execute queries.

---

### 🔍 [IDEA-003] xwnode relationship investigation

**Status:** 🔍 Proposed / Under investigation  
**Date:** 08-Feb-2026

**Problem:** Whether xwsyntax needs xwnode is not certain; if it does, the relationship between xwquery and xwnode may need re-evaluation (xwquery uses xwnode; xwnode uses xwquery for query execution).

**Proposed Solution:** Investigate dependency and document outcome; if xwsyntax requires xwnode, re-evaluate xwquery↔xwnode boundaries and integration.

**Outcome:** TBD. Captured in REF_01_REQ sec. 7 (under investigation), sec. 10 (risks).

---

### 🔍 [IDEA-004] Python↔Rust conversion (future, xwschema-dependent)

**Status:** 🔍 Proposed / Future  
**Date:** 08-Feb-2026

**Problem:** Python to Rust or Rust to Python is a valuable use case for xwsyntax but requires support from xwschema, which is not yet developed or a dependency for xwsyntax.

**Proposed Solution:** When xwschema is available, enable Python↔Rust conversion via xwsyntax (parse/generate) with schema support. Document as future application in REF_01_REQ success criteria.

**Outcome:** Deferred until xwschema exists; not in current scope.

---

### ✅ [IDEA-005] No replacement for fast serialization/codecs

**Status:** ✅ Approved (anti-goal)  
**Date:** 08-Feb-2026

**Problem:** xwsystem, xwformats, xwjson provide faster and sometimes binary serialization; xwsyntax is not intended to replace them.

**Proposed Solution:** Explicit anti-goal in REF_01_REQ: never make xwsyntax a replacement for existing serialization or codecs. Performance is average (typical parser); breadth and ease of use over raw speed.

**Outcome:** Documented in REF_01_REQ sec. 2 (anti-goals), sec. 8 (Performance = average).

---

*See [REF_01_REQ.md](REF_01_REQ.md) and [REF_22_PROJECT.md](REF_22_PROJECT.md). Per GUIDE_12_IDEA.*

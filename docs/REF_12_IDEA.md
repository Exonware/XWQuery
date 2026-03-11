# Idea Reference — exonware-xwquery

**Company:** eXonware.com  
**Producing guide:** GUIDE_12_IDEA  
**Last Updated:** 08-Feb-2026  
**Requirements source:** [REF_01_REQ.md](REF_01_REQ.md)

---

## Overview

xwquery is the **unified query system (XWQS)** and the **library** of connectors, strategies, and handlers so one universal script can convert anything to anything and execute on node-based or table-based structures. It uses xwsyntax and is consumed by xwstorage, xwaction, and xwbase; anything executed in the zone (e.g. S3) is converted to XWQS first. This document captures product direction and ideas; approved ideas flow to [REF_22_PROJECT.md](REF_22_PROJECT.md) and [REF_13_ARCH.md](REF_13_ARCH.md).

### Alignment with eXonware 5 Priorities (from REF_01_REQ sec. 8)

- **Security (very high):** Input validation; no code execution from query text; capability checks.
- **Usability (ultra-high):** Clear API; OPERATIONS_REFERENCE, QUICK_REFERENCE, ARCHITECTURE; library understandable and reversible.
- **Maintainability (ultra-high):** REF_* traceability; tests and docs aligned with executor/strategy layout; 4-layer tests.
- **Performance (high):** Parser and executor performance; optimization docs.
- **Extensibility (ultra-high):** Pluggable grammars (xwsyntax) and strategies/connectors.

**Related Documents:**
- [REF_01_REQ.md](REF_01_REQ.md) — Requirements (source)
- [REF_22_PROJECT.md](REF_22_PROJECT.md) — Project requirements
- [REF_13_ARCH.md](REF_13_ARCH.md) — Architecture
- [REF_14_DX.md](REF_14_DX.md) — Developer experience
- [REF_15_API.md](REF_15_API.md) — API reference
- [REF_35_REVIEW.md](REF_35_REVIEW.md) — Review summary

---

## Product Direction (from REF_01_REQ)

### ✅ [IDEA-001] Unified query system (XWQS)

**Status:** ✅ Approved → Implemented  
**Date:** 08-Feb-2026

**Problem:** Too many handlers and too many languages; need one universal language for execution. Writing in a different language per backend is friction.

**Proposed Solution:** xwquery as unified query system (XWQS) and library: one universal script; convert anything to anything; execute on node-based or table-based structures; zone execution (e.g. S3) converts to XWQS first. Strategies/connectors for export/import to any scripting language (data + graph); xwsyntax for grammars; executor pipeline (core, aggregation, filtering, data, graph, etc.).

**Outcome:** Implemented; multi-grammar support; engine and capability checker as stable API. Success = use in xwbase; consumed by xwstorage, xwaction, xwbase.

---

### ✅ [IDEA-002] Run in xwaction; used in xwstorage and xwbase

**Status:** ✅ Approved → In scope  
**Date:** 08-Feb-2026

**Problem:** Executable scripts and storage/backend queries need a single query layer, not separate handlers per system.

**Proposed Solution:** xwquery provides executable script + execution; xwaction runs scripts that flow through xwquery; xwstorage and xwbase consume xwquery for query execution and format conversion. Node/table structure implementation stays in xwnode, xwstorage (out of scope for xwquery).

**Outcome:** In scope per REF_01_REQ sec. 2, sec. 9. Backend integration (xwstorage, xwnode, xwdata) and capability-based routing support this.

---

### 🔍 [IDEA-003] Next phase: user interface and editor

**Status:** 🔍 Deferred (next phase)  
**Date:** 08-Feb-2026

**Problem:** REF_01_REQ sec. 9 defines current phase as library + strategies + execution; next phase is user interface and editor.

**Proposed Solution:** Future work: UI and editor for XWQS/query authoring and inspection. Not part of current phase DoD.

**Outcome:** Deferred; current phase DoD = strategies + execution + adoption in xwstorage, xwaction, xwbase (success = xwbase).

---

*See [REF_01_REQ.md](REF_01_REQ.md) and [REF_22_PROJECT.md](REF_22_PROJECT.md). Per GUIDE_12_IDEA.*

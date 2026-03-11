# Archive migration log — xwsyntax docs/_archive

**Date:** 2026-02-08  
**Action:** Extract value into REF_* and docs/logs/reviews/, then remove files from docs/_archive.

---

## Where value went

| REF / log | Content added from archive |
|-----------|----------------------------|
| **REF_13_ARCH** | Data flow (parse/generate); design decisions (facade, metadata-driven detection, handler–serialization bridge); adding a grammar. Removed legacy link to _archive/ARCHITECTURE.md. |
| **REF_22_PROJECT** | Design line: facade pattern, metadata-driven format detection (grammars_master.json, get_grammar_metadata). |
| **REVIEW_20251029_IMPLEMENTATION_FOUNDATION** | Consolidated implementation/extraction/status (Oct 2025): extraction, xwnode integration, 4-layer tests, JSON production-ready. |
| **REVIEW_20251104_CODE_REVIEW** | Code review (Nov 2025): ASyntaxHandler bridge fix (encode/decode/codec_id/media_types), compliance, next steps. |

---

## Files removed and value disposition

| Archived file | Type | Value disposition |
|--------------|------|-------------------|
| **README.md** | Index of archive | Superseded by this migration log; _archive README replaced with short note. |
| **ARCHITECTURE.md** | Reference | Layers, data flow, design patterns, dependencies, extension points → REF_13 (data flow, design, adding grammar). |
| **COMPLETE_STATUS.md** | Status report | Phases, stats, test layout, production readiness → REVIEW_20251029_IMPLEMENTATION_FOUNDATION. |
| **EXTRACTION_FINAL_REPORT.md** | Status report | Extraction summary, validation, remaining work → REVIEW_20251029_IMPLEMENTATION_FOUNDATION. |
| **FINAL_IMPLEMENTATION_REPORT.md** | Status report | Deliverables, test suite, compliance → REVIEW_20251029_IMPLEMENTATION_FOUNDATION. |
| **GRAMMARS_MASTER_INTEGRATION.md** | Reference | grammars_master.json location, integration points → REF_22 (grammar list, metadata), REF_13 (metadata-driven). |
| **GUIDE_SYNTAX_ENGINE.md** | Guide | Engine overview, API, usage → REF_15_API (public surface); usage in README/examples. |
| **IMPLEMENTATION_STATUS.md** | Status report | Phase progress, package contents → REVIEW_20251029_IMPLEMENTATION_FOUNDATION. |
| **NEXT_STEPS.md** | Next steps | Post-fix steps, testing tips → REVIEW_20251104_CODE_REVIEW (next steps). |
| **runner_out.md** | Test output | Stale runner output; test output location documented in REF_51_TEST (tests/runner_out.md). |
| **XWSYNTAX_ARCHITECTURE_DIAGRAM.md** | Diagram | Serialization/syntax class hierarchy, data flow → REF_13 (design, handler bridge). |
| **XWSYNTAX_COMPLETE_PLAN.md** | Plan | Long-term plan; current scope and phases in REF_22, REF_35. |
| **XWSYNTAX_COMPLETE.md** | Status report | Completion summary → REVIEW_20251029_IMPLEMENTATION_FOUNDATION. |
| **XWSYNTAX_EXTRACTION_COMPLETE.md** | Status report | Extraction success → REVIEW_20251029_IMPLEMENTATION_FOUNDATION. |
| **XWSYNTAX_EXTRACTION_SUCCESS.md** | Status report | Phase 1/2 summary → REVIEW_20251029_IMPLEMENTATION_FOUNDATION. |
| **XWSYNTAX_FACADE_PATTERN.md** | Design | Facade (XWSyntax) → REF_13 (design), REF_15 (facade entry). |
| **XWSYNTAX_FORMAT_REGISTRY_COMPLETE.md** | Design | Registry, format ID/extensions, no hardcoding → REF_13 (metadata-driven). |
| **XWSYNTAX_IMPLEMENTATION_COMPLETE.md** | Status report | Implementation summary → REVIEW_20251029_IMPLEMENTATION_FOUNDATION. |
| **XWSYNTAX_NO_HARDCODING_ARCHITECTURE.md** | Design | Metadata-driven handlers → REF_13 (metadata-driven). |
| **XWSYNTAX_QUICK_START_GUIDE.md** | Guide | Install, usage, tests → README, REF_51 (running tests), examples. |
| **XWSYNTAX_REVIEW_COMPLETE.md** | Review | Critical fix, compliance → REVIEW_20251104_CODE_REVIEW. |
| **XWSYNTAX_SERIALIZATION_INTEGRATION.md** | Design | ISerialization/ASyntaxHandler, loader ↔ xwsystem → REF_13 (handler–serialization bridge). |

---

*All listed files were removed from docs/_archive after this log was created.*

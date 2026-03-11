# Requirements Reference (REF_01_REQ)

**Project:** xwsyntax (exonware-xwsyntax)  
**Sponsor:** eXonware.com / eXonware Backend Team  
**Version:** 0.0.1  
**Last Updated:** 08-Feb-2026  
**Produced by:** [GUIDE_01_REQ.md](../../docs/guides/GUIDE_01_REQ.md)

---

## Purpose of This Document

This document is the **single source of raw and refined requirements** collected from the project sponsor and stakeholders. It is updated on every requirements-gathering run. When the **Clarity Checklist** (section 12) reaches the agreed threshold, use this content to fill REF_12_IDEA, REF_22_PROJECT, REF_13_ARCH, REF_14_DX, REF_15_API, and planning artifacts. Template structure: [GUIDE_01_REQ.md](../../docs/guides/GUIDE_01_REQ.md).

---

## 1. Vision and Goals

| Field | Content |
|-------|---------|
| One-sentence purpose | xwsyntax is a smart, rule-based syntax system that reuses xwsystem and other libraries to read and write syntax using grammar-driven inputs and outputs; if you want to create a new syntax or convert between syntaxes, xwsyntax is what you use. |
| Primary users/beneficiaries | xwquery; IDE and tooling; eXonware libraries; adopters; anyone creating a new language (programming or any other type). |
| Success (6 mo / 1 yr) | xwsyntax is used and tested (e.g. JSON and existing supported formats); proven to work and to work for xwquery. Future application: Python↔Rust conversion (requires future xwschema support—not yet a dependency). |
| Top 3–5 goals (ordered) | 1) Provide a complete library that easily reads syntax and returns native objects or a tree that explains that syntax. 2) Support creating any syntax and conversion between different syntaxes. 3) Enable xwquery (xwqueryscript bidirectionally to database/graph script languages). 4) Investigate whether xwsyntax needs xwnode (if yes, re-evaluate xwquery↔xwnode relationship). 5) Grammar coverage, codec, Monaco, and integration with xwsystem and consumers. |
| Problem statement | Making syntax easy—whether for read or write, inputs and outputs—so that syntax is not a barrier. |

## 2. Scope and Boundaries

| In scope | Out of scope | Dependencies | Anti-goals |
|----------|--------------|--------------|------------|
| **v1:** Re-engineer what is already there (current codebase). Grammar-based read/write; bidirectional parse and generate; conversion between syntaxes; wide range of languages/syntaxes/scripts. Speed is not the primary concern—breadth and ease of use are. | Schema (xwschema) not in scope; query language execution (xwquery) not in scope; data formats already provided by xwsystem, xwformats, or xwjson—those are faster and sometimes binary, and are out of scope for xwsyntax. | xwsystem and other eXonware libraries as per existing design. xwschema may be a future dependency for Python↔Rust use case (not yet). xwnode relationship under investigation. | Never make xwsyntax a replacement for existing serialization or codecs (xwsystem, xwformats, xwjson)—they are much faster and sometimes binary; xwsyntax is not intended to replace them. |

## 3. Stakeholders and Sponsor

| Sponsor (name, role, final say) | Main stakeholders | External customers/partners | Doc consumers |
|----------------------------------|-------------------|-----------------------------|---------------|
| eXonware (company); eXonware Backend Team (author, maintainer, final say on scope and priorities). Same model as xwsystem. | eXonware library teams (xwsystem, xwlazy, xwstorage, xwformats, xwjson, xwentity, xwnode, xwdata, xwauth, xwquery, xwchat, xwui); *-server maintainers; open-source contributors. | None currently. Future: open-source adopters; possible sponsorship or partnership. | Developers and internal eXonware teams; AI agents (Cursor, Cloud Code); downstream REF_22 / REF_13 / REF_15 owners. |

## 4. Compliance and Standards

| Regulatory/standards | Security & privacy | Certifications/evidence |
|----------------------|--------------------|--------------------------|
| Same as xwsystem: OWASP Top 10 alignment; resource limits; no code execution from untrusted data; path traversal protection; input validation. Mars Standard / NASA-style traceability in docs/compliance where applicable. | Auth and secrets at callers (xwauth) or app; xwsyntax provides safe parsing and secure defaults. No PII stored in xwsyntax; audit at app level. | SOC2 or similar only if required by production or contracts; for now no formal cert. Compliance gap-analysis under docs/compliance. |

## 5. Product and User Experience

| Main user journeys/use cases | Developer persona & 1–3 line tasks | Usability/accessibility | UX/DX benchmarks |
|-----------------------------|------------------------------------|--------------------------|------------------|
| (1) **Create a new syntax:** Use xwsyntax to define and use any new language or format. (2) **Read syntax → native/tree:** Parse input and get native objects or a tree that explains the syntax. (3) **Convert between syntaxes:** Bidirectional conversion (e.g. one query language to another). (4) **xwquery integration:** Parsing and syntax for query languages (xwqueryscript ↔ DB/graph scripts). (5) **IDE/tooling:** Monaco export and grammar support for editors. (6) **Future: Python↔Rust:** Use case supported when xwschema is available. | Developer creating or consuming syntax: load a grammar, parse text to AST, generate text from AST; convert between two formats in a few lines. Same patterns as xwsystem where applicable. | Clear API, good errors, examples (e.g. examples/). Usability and maintainability are extremely high priority. | Same feel as other eXonware packages; easy to add grammars and handlers; no friction for “read syntax / write syntax” workflows. |

## 6. API and Surface Area

| Main entry points / "key code" | Easy (1–3 lines) vs advanced | Integration/existing APIs | Not in public API |
|--------------------------------|------------------------------|---------------------------|-------------------|
| **Facade:** `XWSyntax` — load grammars, parse, validate. **Parse/generate:** `parse()`, `validate()`; `BidirectionalGrammar.load(name)`, `parse()`, `generate()`. **Metadata:** `get_grammar_metadata()`, `list_grammars_quick()`, `load_grammar_quick()`. **Monaco:** `MonacoExporter`, `export_grammar_to_monaco`. **Base:** `AGrammar`, `ASyntaxEngine`, `ASyntaxHandler`; engines, handlers, codec adapter. (Code-derived from REF_15_API and existing __init__.py.) | **Easy:** Load grammar by name, parse text to AST, generate text from AST; convert between two syntaxes in a few lines. **Advanced:** Custom engines/handlers, optimizations, registry access, format-specific options. | xwsystem (codec registry via codec_adapter); xwquery for parsing/syntax of query languages; xwnode where used (e.g. examples). | Internal engine/loader internals; raw backend APIs; registry internals. Only expose what is stable and documented in REF_15_API. |

## 7. Architecture and Technology

| Required/forbidden tech | Preferred patterns | Scale & performance | Multi-language/platform |
|-------------------------|--------------------|----------------------|-------------------------|
| **Required:** Python per pyproject; xwsystem for codec registry and contracts. **Forbidden:** No code execution from untrusted grammar/data. **Under investigation:** Whether xwsyntax needs xwnode (if yes, re-evaluate xwquery↔xwnode relationship). | Facade (XWSyntax); metadata-driven format detection (grammars_master.json, get_grammar_metadata); handler pipeline; registry pattern; strategy per format. (REF_13_ARCH.) | Performance is average priority—same expectations as a typical parser; not a replacement for fast serialization/codecs. Breadth and ease of use over raw speed. | Python reference implementation; Windows, Linux, macOS. |

## 8. Non-Functional Requirements (Five Priorities)

| Security | Usability | Maintainability | Performance | Extensibility |
|----------|-----------|-----------------|-------------|---------------|
| **Really high.** Input validation; no code execution from untrusted data; safe parsing; path/grammar security. Same standards as xwsystem. | **Extremely high.** Clear API, docs, errors, examples; easy to create and use syntax; same patterns as xwsystem where applicable. | **Extremely high.** Contracts, base, facade; REF_* traceability; pluggable grammars/handlers; 4-layer tests per GUIDE_51_TEST. | **Average.** Same performance expectations as a typical parser; not optimized to replace xwsystem/xwformats/xwjson codecs; speed is not the primary goal. | **Extremely high.** Pluggable grammars and handlers; registry-based discovery; easy to add new syntaxes and convert between them. |

## 9. Milestones and Timeline

| Major milestones | Definition of done (first) | Fixed vs flexible |
|------------------|----------------------------|-------------------|
| **M1 — Core grammars and engines:** v0.x (Done). **M2 — REF_* and grammar roadmap in docs:** v0.x (Done). **Next target:** xwquery—xwsyntax was completed so that xwquery can be built: a query language (xwqueryscript) that converts bidirectionally to almost any database or graph-based script language. | M1 DoD: Core grammar set, engines, facade, codec integration, bidirectional support; re-engineered and documented. | Milestones for xwsyntax are complete; dates flexible; next phase is xwquery consumption. |

## 10. Risks and Assumptions

| Top risks | Assumptions | Kill/pivot criteria |
|-----------|-------------|----------------------|
| (1) xwschema not yet available—Python↔Rust use case depends on future xwschema. (2) If xwsyntax needs xwnode, xwquery↔xwnode relationship may need re-evaluation (xwquery uses xwnode; xwnode uses xwquery for execution). (3) Scope creep (e.g. replacing fast codecs—explicitly out of scope). (4) Grammar/maintenance burden as grammar set grows. | xwsystem remains stable and provides codec registry; xwquery consumes xwsyntax for parsing/syntax; xwsyntax does not replace xwsystem/xwformats/xwjson; performance is “average parser” expectation. | Same as xwsystem: if ecosystem pivots away from this model, direction would need to change. |

## 11. Workshop / Session Log (Optional)

| Date | Type | Participants | Outcomes |
|------|------|---------------|----------|
| 08-Feb-2026 | REF_01 discovery | Sponsor / Requirements Collector | REF_01_REQ created; all discovery questions posed in one go |
| 08-Feb-2026 | REF_01 discovery | Sponsor / Requirements Collector | Sections 1–10 filled from sponsor answers; NFR priorities (Security high, Usability/Maintainability/Extensibility extremely high, Performance average); milestones complete, xwquery next; summary added for confirmation |
| 08-Feb-2026 | REF_01 feed | Requirements Collector | Fed REF_01_REQ into REF_12_IDEA, REF_22_PROJECT, REF_13_ARCH, REF_14_DX, REF_15_API; checklist 14 confirmed |
| 08-Feb-2026 | Downstream | Requirements Collector | Created REF_14_DX; updated REF_22 (vision, goals, scope boundaries, traceability), REF_13_ARCH, REF_15_API, INDEX, REF_51_TEST, README, GUIDE_01_USAGE |
| 08-Feb-2026 | Downstream (code) | Requirements Collector | Fixed 0.core test: AParseNode type/value/children/metadata made concrete with getter/setter (__dict__) so dataclass ParseNode can be instantiated; tests/0.core and unit bidirectional/json pass |
| 08-Feb-2026 | CONT DOWNSTREAM | Requirements Collector | Verified REF_12_IDEA, REF_22_PROJECT, REF_13_ARCH, REF_14_DX, REF_15_API aligned with REF_01_REQ; added NFR (5 Priorities) section to REF_22 |
| 08-Feb-2026 | CONT DOWNSTREAM (verify) | Requirements Collector | Re-verified all downstream REFs (REF_12, REF_22, REF_13, REF_14, REF_15) aligned with REF_01_REQ; INDEX.md complete; no changes required |
| 08-Feb-2026 | CONT DOWNSTREAM (codebase + tests) | Requirements Collector | Package __init__ (REF_01, REF_14_DX, REF_15_API); facade.py (REF_15_API, REF_01 sec. 6); tests/conftest (REF_01, REF_51, REF_14_DX); 0.core/test_core_facade.py for REF_14_DX key code (list_grammars_quick, load_grammar_quick, XWSyntax.parse) |

---

## Requirements Understood — Summary (for sponsor confirmation)

- **Vision:** xwsyntax is a smart, rule-based syntax system that reuses xwsystem and other libraries to read and write syntax using grammar-driven inputs and outputs; it is the place to create new syntaxes and to convert between syntaxes.
- **In scope:** Re-engineer current codebase; grammar-based read/write; bidirectional parse/generate; conversion between syntaxes; wide range of languages/syntaxes/scripts; ease of use over raw speed.
- **Out of scope:** Schema (xwschema); query execution (xwquery); replacing data formats in xwsystem/xwformats/xwjson (they stay faster/binary).
- **Top goals (ordered):** (1) Complete library that reads syntax and returns native/tree; (2) Create any syntax and convert between syntaxes; (3) Enable xwquery (xwqueryscript ↔ DB/graph scripts); (4) Investigate xwnode need and xwquery↔xwnode relationship; (5) Grammar coverage, codec, Monaco, xwsystem integration.
- **Main constraints:** Never replace existing serialization/codecs; performance = average (typical parser); Security/Usability/Maintainability/Extensibility very high; xwschema and xwnode relationship noted as future/investigation.

*If this summary is accurate, confirm and criterion 14 will be checked; then REF_01 is complete and downstream docs (REF_12_IDEA, REF_22_PROJECT, REF_13_ARCH, REF_14_DX, REF_15_API) can be filled or refreshed from this REF_01_REQ. Correct any item above if needed.*

---

## 12. Clarity Checklist

| # | Criterion | ☐ |
|---|-----------|---|
| 1 | Vision and one-sentence purpose filled and confirmed | ☑ |
| 2 | Primary users and success criteria defined | ☑ |
| 3 | Top 3–5 goals listed and ordered | ☑ |
| 4 | In-scope and out-of-scope clear | ☑ |
| 5 | Dependencies and anti-goals documented | ☑ |
| 6 | Sponsor and main stakeholders identified | ☑ |
| 7 | Compliance/standards stated or deferred | ☑ |
| 8 | Main user journeys / use cases listed | ☑ |
| 9 | API / "key code" expectations captured | ☑ |
| 10 | Architecture/technology constraints captured | ☑ |
| 11 | NFRs (Five Priorities) addressed | ☑ |
| 12 | Milestones and DoD for first milestone set | ☑ |
| 13 | Top risks and assumptions documented | ☑ |
| 14 | Sponsor confirmed vision, scope, priorities | ☑ |

**Clarity score:** 14 / 14. **Ready to fill downstream docs?** ☑ Yes

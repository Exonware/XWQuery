# Requirements Reference (REF_01_REQ)

**Project:** xwquery (exonware-xwquery)  
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
| One-sentence purpose | xwquery is the unified query system (XWQS) and library that provides connectors, strategies, and handlers so one universal script can convert anything to anything and execute on node-based or table-based structures across the eXonware ecosystem (xwstorage, xwaction, xwbase). |
| Primary users/beneficiaries | eXonware developers; the script/runtime itself (XWQS); xwstorage, xwaction, xwbase as consumers; anyone executing queries in "the zone world" (e.g. S3) where execution is converted to XWQS first. |
| Success (6 mo / 1 yr) | Success = xwquery being used in xwbase. Adoption and use by xwstorage and xwaction; one universal script executed everywhere. |
| Top 3–5 goals (ordered) | 1) Unified scripting language (XWQS) that can convert anything to anything. 2) Run in xwaction (executable script + execution). 3) Used in xwstorage. 4) Used in xwbase. (Reverse-engineered: multi-grammar support and executor pipeline support these.) |
| Problem statement | Too many handlers and too many languages; need one unified language for execution. Anything executed in the eXonware zone (e.g. S3) should be converted to XWQS first. One universal script—no need to write in a different language every time. |

## 2. Scope and Boundaries

| In scope | Out of scope | Dependencies | Anti-goals |
|----------|--------------|--------------|------------|
| All strategies that enable export/import to any scripting language for **data and graph-based structures**; **executable script** plus **execution** of the query; power to **execute queries** on node-based or table-based structures. (Library with connectors/strategies/handlers to everything else; uses xwsyntax.) | Actual implementation of the **node structure** or the **sentence** (storage/data-structure implementation)—that stays in xwnode, xwstorage, etc. xwquery only queries and executes. | xwsyntax (grammars/parsing); consumed by xwstorage, xwaction, xwbase. Likely xwsystem for contracts. | Multiple separate languages and handlers per backend; writing queries in different languages for each system. |

## 3. Stakeholders and Sponsor

| Sponsor (name, role, final say) | Main stakeholders | External customers/partners | Doc consumers |
|----------------------------------|-------------------|-----------------------------|---------------|
| eXonware (company); eXonware Backend Team (author, maintainer, final say on scope and priorities). Same model as xwsystem. | eXonware library teams (xwsystem, xwsyntax, xwstorage, xwaction, xwbase, xwnode, xwdata, xwentity); *-server maintainers; open-source contributors. | None currently. Future: open-source adopters. | Developers and internal eXonware teams; AI agents; downstream REF_22 / REF_13 / REF_15 owners; xwstorage, xwaction, xwbase integrators. |

## 4. Compliance and Standards

| Regulatory/standards | Security & privacy | Certifications/evidence |
|----------------------|--------------------|--------------------------|
| Align with eXonware norms; Mars Standard / traceability in docs where applicable. No code execution from untrusted query text; input validation. | Security priority **very high** (per NFRs). Auth and secrets at app/caller level; xwquery validates input and does not execute arbitrary code from query strings. | Same as xwsystem: SOC2 or formal cert only if required by production; compliance gap-analysis under docs/compliance where applicable. |

## 5. Product and User Experience

| Main user journeys/use cases | Developer persona & 1–3 line tasks | Usability/accessibility | UX/DX benchmarks |
|-----------------------------|------------------------------------|--------------------------|------------------|
| (1) **Convert any-to-any:** Write or receive a query in one language (SQL, Cypher, etc.), convert to XWQS or another format. (2) **Execute in xwaction:** Script runs in xwaction; execution goes through xwquery. (3) **Query from xwstorage/xwbase:** Execute queries on data/graphs backed by xwstorage or xwbase (node/table structures). (4) **Single universal script:** One script format (XWQS) for the zone; S3/zone execution converts to XWQS first. (5) **Reverse-engineer the library:** Understand connectors/strategies/handlers and how they plug together. | Developer integrating xwquery: parse query → execute on data or convert to another grammar; 1–3 lines for execute/convert. Consumer (xwstorage, xwaction, xwbase): register or call xwquery for query execution and format conversion. | **Usability: ultra-high** (per NFRs). Clear API, docs, errors, examples; OPERATIONS_REFERENCE, QUICK_REFERENCE, architecture docs so the library is understandable and reversible. | Same feel as rest of eXonware—unified, one language; no friction when moving between backends (xwstorage, xwaction, xwbase). |

## 6. API and Surface Area

| Main entry points / "key code" | Easy (1–3 lines) vs advanced | Integration/existing APIs | Not in public API |
|--------------------------------|------------------------------|---------------------------|-------------------|
| **Facade:** XWQuery — execute, convert, parse. **Execution:** execute(query, data/context) on node-based or table-based structures. **Conversion:** convert(query, from_format, to_format); parse → actions tree / XWQS. **Strategies/connectors:** Pluggable strategies for export/import to any scripting language (data and graph). Engine and capability checker as stable contract. | **Easy:** `XWQuery.execute("SELECT …", data)`; `XWQuery.convert(sql, from_format='sql', to_format='graphql')`; parse then execute or convert. **Advanced:** Engine/capability checker, strategy registration, grammar-specific options. | Must integrate with xwsyntax (grammars); xwstorage, xwaction, xwbase consume execute/convert/parse. Backends provide node/table structures; xwquery does not implement those. | Executor internals (individual executor modules); parser internals; strategy implementation details. Only stable, documented facade and engine contract are public. |

## 7. Architecture and Technology

| Required/forbidden tech | Preferred patterns | Scale & performance | Multi-language/platform |
|-------------------------|--------------------|----------------------|-------------------------|
| **Required:** Python 3.x; xwsyntax for grammars. **Forbidden:** No code execution from untrusted query text; node/table implementation is out of scope (lives in xwnode, xwstorage, etc.). | Strategy/connector pattern for export/import to any scripting language; executor pipeline (core, aggregation, filtering, data, graph, etc.); capability-based routing; parse → plan → execute. Facade (XWQuery) + engine + capability checker as stable API. | **Performance: high** (per NFRs). Parser and executor performance; optimization docs. No explicit SLA; suitable for in-zone and backend use by xwstorage, xwaction, xwbase. | Python reference implementation; XWQS as universal intermediate. Multi-language via specs/contracts if needed later. |

## 8. Non-Functional Requirements (Five Priorities)

| Security | Usability | Maintainability | Performance | Extensibility |
|----------|-----------|-----------------|-------------|---------------|
| **Very high.** Input validation; no code execution from query text; capability checks; safe handling of query strings. | **Ultra-high.** Clear API; OPERATIONS_REFERENCE, QUICK_REFERENCE, architecture; docs and examples so the library is understandable and reversible. | **Ultra-high.** REF_* traceability; tests and docs aligned with executor/strategy layout; 4-layer tests; clear structure and ownership. | **High.** Parser and executor performance; optimization documentation. | **Ultra-high.** Pluggable grammars (xwsyntax) and strategies/connectors; add new scripting languages and backends without breaking the universal-script contract. |

## 9. Milestones and Timeline

| Major milestones | Definition of done (first) | Fixed vs flexible |
|------------------|----------------------------|-------------------|
| **This phase:** Library with all strategies for export/import to any scripting language (data + graph); executable script + execution; execute queries on node-based and table-based structures; used by xwstorage, xwaction, xwbase. **Next phases:** User interface and editor (future). | DoD for this phase: Strategies and execution in place; convert anything to anything (XWQS); execution on node/table structures; adoption in xwstorage, xwaction, and success = use in xwbase. | Scope (unified script, execution, strategies, xwbase use) is fixed; dates flexible. Future UI/editor is next phase. |

## 10. Risks and Assumptions

| Top risks | Assumptions | Kill/pivot criteria |
|-----------|-------------|----------------------|
| (1) Complexity of many grammars and strategies—mitigate with clear executor/strategy layout and docs. (2) Consistency of XWQS and conversion across xwstorage, xwaction, xwbase—single contract and capability checker. (3) Performance with many formats—optimization and high NFR. | xwsyntax remains the grammar source; xwstorage, xwaction, xwbase provide node/table structures and consume xwquery; "zone" execution (e.g. S3) converts to XWQS first; one universal script is the product direction. | If xwsyntax or key consumers (xwbase, xwaction, xwstorage) drop the unified-script model, or if scope becomes "implement storage/node ourselves," direction would need to change. |

## 11. Workshop / Session Log (Optional)

| Date | Type | Participants | Outcomes |
|------|------|---------------|----------|
| 08-Feb-2026 | REF_01 discovery | Requirements Collector | REF_01_REQ created; full question set posed in one go |
| 08-Feb-2026 | REF_01 discovery | Sponsor / Requirements Collector | Vision, goals, scope, boundaries, sponsor, NFRs, milestones from sponsor; remaining sections reverse-engineered from REF_22, README, xwsystem model |
| 08-Feb-2026 | REF_01 feed | Requirements Collector | Fed REF_01_REQ into REF_12_IDEA, REF_22_PROJECT, REF_13_ARCH, REF_14_DX, REF_15_API (downstream docs) |
| 08-Feb-2026 | CONT DOWNSTREAM (verify) | Requirements Collector | Verified REF_12_IDEA, REF_22_PROJECT, REF_13_ARCH, REF_14_DX, REF_15_API aligned with REF_01_REQ; completed REF_22 traceability to all REFs |
| 08-Feb-2026 | CONT DOWNSTREAM | Requirements Collector | REF_51_TEST + REF_01 source; GUIDE_01_USAGE quick start (execute/convert/parse, REF_14_DX); README vision + REF_01 link; tests/0.core/test_xwquery_basic 10/10 passed |
| 08-Feb-2026 | CONT DOWNSTREAM (codebase + tests) | Requirements Collector | Package __init__ (REF_01, REF_14_DX, REF_15_API); tests/conftest.py added (REF_01, REF_51, REF_14_DX); 0.core/test_xwquery_basic docstring REF_14_DX key code |

---

## Requirements Understood — Summary (for sponsor confirmation)

- **Vision:** xwquery is the **unified query system (XWQS)** and the **library** with connectors/strategies/handlers so one universal script can convert anything to anything and execute on node-based or table-based structures. It uses xwsyntax and is used by developers, by the script itself, and by xwstorage, xwaction, and xwbase. Anything executed in the zone (e.g. S3) is converted to XWQS first.
- **In scope:** All strategies for export/import to any scripting language (data + graph); executable script + execution; executing queries on node-based or table-based structures. Out of scope: actual implementation of node structure or storage (“the sentence”)—that stays in xwnode/xwstorage.
- **Top goals (ordered):** (1) Unified scripting language (XWQS) that converts anything to anything. (2) Run in xwaction. (3) Used in xwstorage. (4) Used in xwbase. Success = see it used in xwbase.
- **Main constraints:** Security/usability/maintainability/extensibility ultra-high, performance high; same sponsor as xwsystem; dependencies xwsyntax and consumers xwstorage, xwaction, xwbase. Anti-goal = many handlers and many languages.
- **This phase:** Library + strategies + execution; next phase = UI and editor.

*If this summary is accurate, confirm and the clarity checklist will be set to 14/14 and requirements phase closed. Correct any item above if needed.*

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

**Comparison with PostgreSQL:** Capability comparison (full eXonware stack vs Postgres) and traceability: see [REF_22_PROJECT.md](REF_22_PROJECT.md) Traceability → [logs/reviews/REVIEW_20260220_043628_000_XWQUERY_XWQS_VS_POSTGRES.md](logs/reviews/REVIEW_20260220_043628_000_XWQUERY_XWQS_VS_POSTGRES.md). Per GUIDE_35_REVIEW.

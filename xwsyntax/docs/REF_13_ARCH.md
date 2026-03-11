# xwsyntax — Architecture Reference (REF_13_ARCH)

**Last Updated:** 08-Feb-2026  
**Producing guide:** GUIDE_13_ARCH  
**Requirements source:** [REF_01_REQ.md](REF_01_REQ.md)

Architecture reference for xwsyntax.

---

## High-level structure

xwsyntax owns **grammars, parsing, and bidirectional support** for the eXonware stack. It does not execute queries, own the data engine, or perform schema validation.

| Component | Location / role |
|-----------|------------------|
| **Facade** | `facade.py` — `XWSyntax`, `parse()`, `validate()`, grammar load/list; main entry for callers. |
| **Engines** | `engines/` — Lark and xw parsing engines; `Grammar` / `LarkGrammar` wrappers. |
| **Grammars** | `grammars/` — 328+ files: `.grammar.in.lark` (parse), `.grammar.out.lark` (generate), `.grammar.info.json`; `grammars_master.json` for metadata. |
| **Handlers** | `handlers/` — Format-specific handlers (e.g. CSV, Cypher, GraphQL, JSON, SPARQL, SQL, TOML, XML, YAML). |
| **Codec** | `codec_adapter.py` — Registers syntax handlers with UniversalCodecRegistry (xwsystem). |
| **Monaco** | `monaco_exporter.py` — Export grammars for IDE/tooling (Monarch, etc.). |
| **Optimizations** | `optimizations/` — AST optimizer, cache, type index, position index. |
| **Bidirectional** | `bidirectional.py`, `output_grammar.py`, `unparser.py` — Parse ↔ AST ↔ generate; registries. |
| **Base / contracts** | `base.py`, `contracts.py` — `AGrammar`, `ASyntaxEngine`, `ASyntaxHandler`, interfaces. |

---

## Boundaries

- **xwsyntax provides:** Grammar registry, parsing engines, handler pipeline, codec registration, Monaco export, bidirectional (parse + generate), AST optimizations. Consumed by **xwquery** for parsing/syntax of query languages.
- **xwsyntax does not:** Execute queries (xwquery), run the data engine or storage (xwdata/xwstorage), validate schema (xwschema), or execute actions (xwaction). The boundary is **syntax and parsing** only.

---

## Delegation and integration

- **xwquery** uses xwsyntax for parsing and syntax; query execution and runtime live in xwquery.
- **xwsystem** is used for console/CLI (e.g. UTF-8) and codec registry; xwsyntax registers handlers via `codec_adapter`.
- **xwnode** can be used for optimized AST structures where integrated (e.g. examples).

When grammar set or scope changes, update REF_22 (and grammar list) and this REF_13 if structure or boundaries change.

---

## Data flow

- **Parse:** Text → `.grammar.in.lark` (Lark) → AST. Optional: AST optimization (type index, position index, cache) via `optimizations/`.
- **Generate:** AST → `.grammar.out.lark` (templates) / unparser → text. Bidirectional roundtrip can be validated per format.

---

## Design decisions

- **Facade:** `XWSyntax` is the main public entry; engines, loaders, and registries are behind it.
- **Metadata-driven format detection:** Format IDs and file extensions are not hardcoded in the engine. `grammars_master.json` and `.grammar.info.json` (see REF_22) plus `get_grammar_metadata()` drive detection; facade and registry use this for auto-detection and listing.
- **Handler–serialization bridge:** Handlers implement `ASyntaxHandler` (extends xwsystem’s `ASerialization`). They expose `parse`/`generate` and bridge to `encode`/`decode` for `UniversalCodecRegistry` so syntax handlers can be used as codecs. `MultiFormatGrammarLoader` may use xwsystem serializers for loading grammar files (e.g. JSON/YAML).

---

## Adding a grammar

Add `.grammar.in.lark` and optionally `.grammar.out.lark` under `grammars/`; optionally run `scripts/generate_grammar_info.py` to refresh `.grammar.info.json`. See REF_22 for grammar list and categories.

---

## Traceability

- **Requirements:** [REF_01_REQ.md](REF_01_REQ.md) (source) → [REF_22_PROJECT.md](REF_22_PROJECT.md)
- **API / DX:** [REF_15_API.md](REF_15_API.md), [REF_14_DX.md](REF_14_DX.md)

---

*Per GUIDE_00_MASTER and GUIDE_13_ARCH.*

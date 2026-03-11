# Developer Experience Reference — xwsyntax (REF_14_DX)

**Library:** exonware-xwsyntax  
**Last Updated:** 08-Feb-2026  
**Requirements source:** [REF_01_REQ.md](REF_01_REQ.md) sec. 5–6  
**Producing guide:** [GUIDE_14_DX.md](../../docs/guides/GUIDE_14_DX.md)

---

## Purpose

DX contract for xwsyntax: happy paths, "key code," and ergonomics. Filled from REF_01_REQ. Same feel as other eXonware packages; easy to add grammars and handlers; no friction for "read syntax / write syntax" workflows.

---

## Key code (1–3 lines)

| Task | Code |
|------|------|
| Load grammar and parse to AST | `BidirectionalGrammar.load('json')` then `grammar.parse(text)` |
| Generate text from AST | `grammar.generate(ast)` |
| Convert between two syntaxes | Load source grammar, parse; load target grammar, generate from same AST (e.g. JSON → SQL). |
| List grammars / load by name | `list_grammars_quick()`, `load_grammar_quick(name)` |
| Facade parse/validate | `XWSyntax()` then `parse(text, format_name)` or `validate(text, format_name)` |

---

## Developer persona (from REF_01_REQ sec. 5)

Developer creating or consuming syntax: load a grammar, parse text to AST, generate text from AST; convert between two formats in a few lines. Same patterns as xwsystem where applicable.

---

## Easy vs advanced

| Easy (1–3 lines) | Advanced |
|------------------|----------|
| `BidirectionalGrammar.load(name)`, `parse(text)`, `generate(ast)`; `XWSyntax().parse(text, format_name)`; `list_grammars_quick()`, `load_grammar_quick(name)`. | Custom engines/handlers, optimizations, registry access, format-specific options, Monaco export, codec adapter. |

---

## Main entry points (from REF_01_REQ sec. 6)

- **Facade:** `XWSyntax` — load grammars, parse, validate.
- **Parse/generate:** `parse()`, `validate()`; `BidirectionalGrammar.load(name)`, `parse()`, `generate()`.
- **Metadata:** `get_grammar_metadata()`, `list_grammars_quick()`, `load_grammar_quick()`.
- **Monaco:** `MonacoExporter`, `export_grammar_to_monaco`.
- **Base:** `AGrammar`, `ASyntaxEngine`, `ASyntaxHandler`; engines, handlers, codec adapter.

---

## Usability expectations (from REF_01_REQ sec. 5, sec. 8)

Clear API, good errors, examples (e.g. `examples/`). Usability and maintainability are extremely high priority. Same patterns as xwsystem where applicable.

---

## User journeys (from REF_01_REQ sec. 5)

1. **Create a new syntax:** Use xwsyntax to define and use any new language or format.
2. **Read syntax → native/tree:** Parse input and get native objects or a tree that explains the syntax.
3. **Convert between syntaxes:** Bidirectional conversion (e.g. one query language to another).
4. **xwquery integration:** Parsing and syntax for query languages (xwqueryscript ↔ DB/graph scripts).
5. **IDE/tooling:** Monaco export and grammar support for editors.
6. **Future: Python↔Rust:** Use case supported when xwschema is available (REF_01_REQ sec. 5, sec. 10).

---

*See [REF_01_REQ.md](REF_01_REQ.md), [REF_15_API.md](REF_15_API.md), and [REF_22_PROJECT.md](REF_22_PROJECT.md). Per GUIDE_14_DX.*

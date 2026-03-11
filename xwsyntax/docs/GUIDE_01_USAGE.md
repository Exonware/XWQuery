<!-- docs/GUIDE_01_USAGE.md (project usage, GUIDE_41_DOCS) -->
# xwsyntax — Usage Guide

**Last Updated:** 08-Feb-2026  
**Requirements source:** [REF_01_REQ.md](REF_01_REQ.md)

How to use xwsyntax (output of GUIDE_41_DOCS).

## Quick start

- **Load grammar, parse, generate:** `BidirectionalGrammar.load('json')` → `grammar.parse(text)` → `grammar.generate(ast)`.
- **Convert between syntaxes:** Parse with source grammar, generate with target grammar (e.g. JSON → SQL).
- **Facade:** `XWSyntax()` then `parse(text, format_name)` or `validate(text, format_name)`.
- **List/load grammars:** `list_grammars_quick()`, `load_grammar_quick(name)`.

See [REF_14_DX.md](REF_14_DX.md) (key code, DX) and [REF_15_API.md](REF_15_API.md) (API). Project: [REF_22_PROJECT.md](REF_22_PROJECT.md). Legacy quick start: _archive/.

---

*Per GUIDE_00_MASTER and GUIDE_41_DOCS.*

# xwsyntax

**Bidirectional grammar engine.** 100+ grammars (328+ grammar files) for reading and writing syntaxes: parse to AST, generate back, and convert between languages and formats.

**Company:** eXonware.com · **Author:** eXonware Backend Team · **Email:** connect@exonware.com  
**Updated:** See [version.py](src/exonware/xwsyntax/version.py) (`__date__`)

[![Status](https://img.shields.io/badge/status-beta-blue.svg)](https://exonware.com)
[![Python](https://img.shields.io/badge/python-3.8%2B-blue.svg)](https://www.python.org)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

---

## Features

- **Grammar-based read/write** — Parse input to native objects or tree; generate from AST.
- **Bidirectional** — Parse ↔ AST ↔ generate; convert between syntaxes (e.g. JSON → SQL).
- **328+ grammars** — Query (SQL, Cypher, GraphQL, xwqueryscript, …), data, programming, markup.
- **xwquery enablement** — Parsing and syntax for query languages (xwqueryscript ↔ DB/graph scripts).
- **Monaco / IDE** — Export grammars for editors. Codec integration with xwsystem.

## Installation

```bash
pip install exonware-xwsyntax
# Full (optional)
pip install exonware-xwsyntax[full]
```

## Quick Start

```python
from exonware.xwsyntax import BidirectionalGrammar

grammar = BidirectionalGrammar.load('json')
ast = grammar.parse('{"name": "Alice", "age": 30}')
json_str = grammar.generate(ast)

# Convert between syntaxes
sql_grammar = BidirectionalGrammar.load('sql')
sql = sql_grammar.generate(ast)
```

See [REF_14_DX](docs/REF_14_DX.md) (key code) and [REF_15_API](docs/REF_15_API.md) (API).

## Documentation

- [Requirements](docs/REF_01_REQ.md) — REF_01_REQ
- [Project](docs/REF_22_PROJECT.md) — Vision, scope, milestones
- [Architecture](docs/REF_13_ARCH.md) — REF_13_ARCH
- [API Reference](docs/REF_15_API.md) — REF_15_API
- [Developer experience](docs/REF_14_DX.md) — REF_14_DX

## Docs and tests

- **Start:** [docs/INDEX.md](docs/INDEX.md) or [REF_01_REQ](docs/REF_01_REQ.md), [REF_14_DX](docs/REF_14_DX.md), [REF_15_API](docs/REF_15_API.md).
- **Tests:** Run from project root per project layout.

---

## 🔬 Innovation: Where does this package fit?

**Tier 1 — Genuinely novel (nothing like this exists)**

**`xwsyntax` — Bidirectional Universal Grammar Engine**

Parse AND generate across 31+ formats (JSON, SQL, GraphQL, Cypher, Python, Rust, Go...) using paired `.in.grammar` / `.out.grammar` files. No other tool does **bidirectional roundtripping** at this scale.

- Lark, tree-sitter, ANTLR, Pygments only parse in ONE direction; `.out.grammar` templates enable **generation back from AST**
- Zero-hardcoding: add a new format by dropping 2 grammar files, no code changes
- Auto-optimizing AST (Trie + IntervalTree + LRU based on AST size)

**Verdict:** 🟢 **Nothing like this exists.** Part of the eXonware story: xwsyntax powers xwquery → xwstorage → xwbase, all on xwnode with xwsystem — vertical integration across 20+ packages.

---

## License and links

MIT — see [LICENSE](LICENSE). **Homepage:** https://exonware.com · **Repository:** https://github.com/exonware/xwsyntax  

Contributing → CONTRIBUTING.md · Security → SECURITY.md (when present).

*Built with ❤️ by eXonware.com - Revolutionizing Python Development Since 2025*


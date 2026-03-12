# xwsyntax

**One bidirectional grammar engine.** Parse text to AST, generate back, or convert between syntaxes (e.g. JSON to SQL). 100+ grammars (328+ files) for query, data, and code. Powers xwquery and editors; use it to create new syntaxes or bridge formats.

**Company:** eXonware.com · **Author:** eXonware Backend Team · **Email:** connect@exonware.com  
**Version:** [version.py](src/exonware/xwsyntax/version.py) (`__version__`, `__date__`)

[![Status](https://img.shields.io/badge/status-alpha-orange.svg)](https://exonware.com)
[![Python](https://img.shields.io/badge/python-3.8%2B-blue.svg)](https://www.python.org)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

---

## Install

```bash
pip install exonware-xwsyntax
# Optional: full extras
pip install exonware-xwsyntax[full]
```

Depends on xwsystem. See [docs/GUIDE_01_USAGE.md](docs/GUIDE_01_USAGE.md) for details.

---

## Quick start

```python
from exonware.xwsyntax import BidirectionalGrammar

grammar = BidirectionalGrammar.load('json')
ast = grammar.parse('{"name": "Alice", "age": 30}')
json_str = grammar.generate(ast)

# Convert between syntaxes
sql_grammar = BidirectionalGrammar.load('sql')
sql = sql_grammar.generate(ast)
# Same AST, different format
```

Facade: `XWSyntax().parse(text, format_name)` or `validate(text, format_name)`.  
List grammars: `list_grammars_quick()`, `load_grammar_quick(name)`.  
Key code: [REF_14_DX](docs/REF_14_DX.md) · API: [REF_15_API](docs/REF_15_API.md).

---

## Examples

### Parse and validate with the facade

```python
from exonware.xwsyntax import XWSyntax

engine = XWSyntax()
ast = engine.parse("a = 1 + 2", format_name="python")
is_valid = engine.validate("a = 1 + 2", format_name="python")
```

### List grammars and load by name

```python
from exonware.xwsyntax import list_grammars_quick, load_grammar_quick

names = list_grammars_quick()
grammar = load_grammar_quick(names[0])
```

### Convert JSON to SQL by reusing the AST

```python
from exonware.xwsyntax import BidirectionalGrammar

ast = BidirectionalGrammar.load("json").parse('{"name": "Alice", "age": 30}')
sql = BidirectionalGrammar.load("sql").generate(ast)
```

---

## What you get

| Area | Description |
|------|-------------|
| **Grammar read/write** | Parse input to native objects or tree; generate from AST. Grammar-driven; no hardcoded format maps. |
| **Bidirectional** | Parse to AST, generate back; convert between syntaxes (e.g. JSON to SQL) by swapping grammars. |
| **100+ grammars** | Query (SQL, Cypher, GraphQL, xwqueryscript, …), data/config, programming, markup, storage. 328+ grammar files (.lark + .json). |
| **xwquery and IDE** | Parsing and syntax for query languages; Monaco export and codec integration with xwsystem. |

Current phase: **Alpha.** M1–M2 done; xwquery consumption next. Status: [REF_22_PROJECT](docs/REF_22_PROJECT.md#project-status-overview).

---

## Docs and tests

- **Start:** [docs/INDEX.md](docs/INDEX.md)
- **Usage:** [docs/GUIDE_01_USAGE.md](docs/GUIDE_01_USAGE.md)
- **Requirements and status:** [REF_01_REQ](docs/REF_01_REQ.md), [REF_22_PROJECT](docs/REF_22_PROJECT.md)
- **API and design:** [REF_15_API](docs/REF_15_API.md), [REF_13_ARCH](docs/REF_13_ARCH.md), [REF_14_DX](docs/REF_14_DX.md)
- **Tests:** [REF_51_TEST](docs/REF_51_TEST.md). Run from project root: `python tests/runner.py`.

---

## License and links

MIT — [LICENSE](LICENSE).  
**Homepage:** https://exonware.com · **Repository:** https://github.com/exonware/xwsyntax  

Contributing → CONTRIBUTING.md · Security → SECURITY.md (when present).

*Built with ❤️ by eXonware.com - Revolutionizing Python Development Since 2025*

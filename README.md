# xwquery

**One universal query system.** 35+ query grammars (SQL, GraphQL, Cypher, MQL, PromQL, SPARQL, JQ, JMESPath, and more) with a single execution engine over node-based or table-based data.

**Company:** eXonware.com · **Author:** eXonware Backend Team · **Email:** connect@exonware.com  
**Version:** See [version.py](src/exonware/xwquery/version.py) or PyPI. · **Updated:** See [version.py](src/exonware/xwquery/version.py) (`__date__`)

[![Status](https://img.shields.io/badge/status-alpha-orange.svg)](https://exonware.com)
[![Python](https://img.shields.io/badge/python-3.8%2B-blue.svg)](https://www.python.org)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

---

## Install

```bash
pip install exonware-xwquery
```

Requires xwsystem (and xwsyntax for grammars). See [docs/GUIDE_01_USAGE.md](docs/GUIDE_01_USAGE.md) for variants.

---

## Quick start

```python
from exonware.xwquery import XWQuery

data = {'users': [
    {'name': 'Alice', 'age': 30, 'city': 'NYC'},
    {'name': 'Bob', 'age': 25, 'city': 'LA'},
    {'name': 'Charlie', 'age': 35, 'city': 'NYC'}
]}

result = XWQuery.execute("""
    SELECT name, age 
    FROM users 
    WHERE age > 25 AND city = 'NYC'
""", data)
# [{'name': 'Alice', 'age': 30}, {'name': 'Charlie', 'age': 35}]
```

Convert between formats: `XWQuery.convert(sql_string, from_format='sql', to_format='graphql')`. Parse: `XWQuery.parse("SELECT * FROM users", source_format='sql')`. See [REF_14_DX](docs/REF_14_DX.md) and [REF_15_API](docs/REF_15_API.md).

---

## What you get

| Area | What's in it |
|------|----------------|
| **Execution** | Execute on any Python data structure; engine and capability checker; parse → plan → execute. |
| **Grammars** | 35+ formats (SQL, GraphQL, Cypher, MQL, PromQL, Flux, JQ, JMESPath, …) via xwsyntax; parse, generate, validate. |
| **Operations** | Core CRUD, filtering, aggregation, graph (MATCH, PATH, …), JOIN, UNION, WINDOW, PIPE, etc. |
| **Integration** | Used by xwstorage, xwaction, xwbase; one universal script (XWQS) across backends. |

Current phase: Alpha. Executor refactor and doc alignment in progress. Status: [REF_22_PROJECT](docs/REF_22_PROJECT.md#project-status-overview).

---

## Docs and tests

Content in this README is aligned with the project REFs and [docs/GUIDE_01_USAGE.md](docs/GUIDE_01_USAGE.md) (per [GUIDE_63_README](../docs/guides/GUIDE_63_README.md)).

- **Start:** [docs/INDEX.md](docs/INDEX.md) — doc index and quick links.
- **Use it:** [docs/GUIDE_01_USAGE.md](docs/GUIDE_01_USAGE.md) — usage, key code, formats.
- **Requirements and status:** [docs/REF_01_REQ.md](docs/REF_01_REQ.md), [docs/REF_22_PROJECT.md](docs/REF_22_PROJECT.md).
- **API and design:** [docs/REF_15_API.md](docs/REF_15_API.md), [docs/REF_13_ARCH.md](docs/REF_13_ARCH.md), [docs/REF_14_DX.md](docs/REF_14_DX.md).
- **Tests:** See [docs/REF_51_TEST.md](docs/REF_51_TEST.md). Run via project test runner or pytest from project root.

---

## License and links

MIT — see [LICENSE](LICENSE).

- **Homepage:** https://exonware.com  
- **Repository:** https://github.com/exonware/xwquery  
- **Version:** `from exonware.xwquery import __version__` or `import exonware.xwquery; print(exonware.xwquery.__version__)`  

Contributing → CONTRIBUTING.md · Security → SECURITY.md (when present).

*Built with ❤️ by eXonware.com - Revolutionizing Python Development Since 2025*

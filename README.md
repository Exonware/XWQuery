# xwquery

**One universal query language.** Execute on Python data or convert between SQL, GraphQL, Cypher, and 35+ formats with a single engine. One script (XWQS) for the zone; used by xwstorage, xwaction, xwbase.

**Company:** eXonware.com · **Author:** eXonware Backend Team · **Email:** connect@exonware.com  
**Version:** [version.py](src/exonware/xwquery/version.py) (`__version__`, `__date__`)

[![Status](https://img.shields.io/badge/status-alpha-orange.svg)](https://exonware.com)
[![Python](https://img.shields.io/badge/python-3.8%2B-blue.svg)](https://www.python.org)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

---

## Install

```bash
pip install exonware-xwquery
```

Requires xwsystem; xwsyntax for grammars. See [docs/GUIDE_01_USAGE.md](docs/GUIDE_01_USAGE.md) for details.

---

## Quick start

```python
from exonware.xwquery import XWQuery

data = {'users': [
    {'name': 'Alice', 'age': 30, 'city': 'NYC'},
    {'name': 'Bob', 'age': 25, 'city': 'LA'},
    {'name': 'Charlie', 'age': 35, 'city': 'NYC'},
]}

result = XWQuery.execute("""
    SELECT name, age
    FROM users
    WHERE age > 25 AND city = 'NYC'
""", data)
# result.data → [{'name': 'Alice', 'age': 30}, {'name': 'Charlie', 'age': 35}]
```

Convert between formats: `XWQuery.convert(sql_string, from_format='sql', to_format='graphql')`.  
Parse only: `XWQuery.parse("SELECT * FROM users", source_format='sql')`.  
Key code: [REF_14_DX](docs/REF_14_DX.md) · API: [REF_15_API](docs/REF_15_API.md).

---

## What you get

| Area | Description |
|------|-------------|
| **Execution** | Run queries on any Python data (node or table). Parse → plan → execute; one engine, one contract. |
| **Grammars** | 35+ formats (SQL, GraphQL, Cypher, SPARQL, MQL, PromQL, JQ, JMESPath, …) via xwsyntax. Parse, generate, validate. |
| **Operations** | CRUD, filtering, aggregation, graph (MATCH, PATH), JOIN, UNION, WINDOW, PIPE, and more. |
| **Integration** | Consumed by xwstorage, xwaction, xwbase. One universal script (XWQS); zone execution (e.g. S3) converts to XWQS first. |

Current phase: **Alpha.** Executor refactor and doc alignment in progress. Status: [REF_22_PROJECT](docs/REF_22_PROJECT.md#project-status-overview).

---

## Docs and tests

- **Start:** [docs/INDEX.md](docs/INDEX.md)
- **Usage:** [docs/GUIDE_01_USAGE.md](docs/GUIDE_01_USAGE.md)
- **Requirements and status:** [REF_01_REQ](docs/REF_01_REQ.md), [REF_22_PROJECT](docs/REF_22_PROJECT.md)
- **API and design:** [REF_15_API](docs/REF_15_API.md), [REF_13_ARCH](docs/REF_13_ARCH.md), [REF_14_DX](docs/REF_14_DX.md)
- **Tests:** [REF_51_TEST](docs/REF_51_TEST.md). Run from project root (pytest or project test runner).

---

## License and links

MIT — [LICENSE](LICENSE).  
**Homepage:** https://exonware.com · **Repository:** https://github.com/exonware/xwquery  

Contributing → CONTRIBUTING.md · Security → SECURITY.md (when present).

*Built with ❤️ by eXonware.com - Revolutionizing Python Development Since 2025*

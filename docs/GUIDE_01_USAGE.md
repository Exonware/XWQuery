<!-- docs/GUIDE_01_USAGE.md (project usage, GUIDE_41_DOCS) -->
# xwquery — Usage Guide

**Last Updated:** 08-Feb-2026  
**Requirements source:** [REF_01_REQ.md](REF_01_REQ.md)

How to use xwquery (output of GUIDE_41_DOCS).

## Quick start

- **Execute:** `XWQuery.execute("SELECT …", data)` — run query on node-based or table-based structures.
- **Convert:** `XWQuery.convert(sql, from_format='sql', to_format='graphql')` — convert between formats (XWQS universal script).
- **Parse:** Parse query → plan → execute or convert. One universal script (XWQS) for the zone; consumed by xwstorage, xwaction, xwbase.

See [REF_14_DX.md](REF_14_DX.md) (key code) and [REF_15_API.md](REF_15_API.md) (API). Project and executor strategy: [REF_22_PROJECT.md](REF_22_PROJECT.md). Examples: repo `examples/`. Legacy quick start: _archive/.

---

*Per GUIDE_00_MASTER and GUIDE_41_DOCS.*

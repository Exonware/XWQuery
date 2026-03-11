# Reference: Syntax → Schema → SQL (REF_12_IDEA_SYNTAX_SCHEMA_SQL)

**Company:** eXonware.com  
**Author:** eXonware Backend Team  
**Email:** connect@exonware.com  
**Version:** 0.0.1  
**Last Updated:** 21-Feb-2026  

**Related:** [GUIDE_12_IDEA.md](../../docs/guides/GUIDE_12_IDEA.md) — Idea capture and evaluation.

---

## Overview

This report documents a **deep dive** into **xwsyntax**, **xwschema**, and **xwquery** to show how we can drive the full pipeline with:

- **Only xwsyntax** for parsing and generation (Lark grammars),
- **One JSON file** that matches the schema structure (canonical query tree schema),
- **Different JSON mapping files** that map each query format (e.g. SQL) to that schema.

The **target artifact set** for the SQL example is:

| # | Artifact | Location | Role |
|---|----------|----------|------|
| 1 | 2 Lark files for SQL | xwsyntax | Parse (`.in`) and generate (`.out`) SQL text |
| 2 | 1 JSON for SQL metadata | xwsyntax | Format id, MIME, extensions, bidirectional flag |
| 3 | 1 JSON schema for xwquery tree | xwschema | Single schema describing the canonical query tree |
| 4 | 1 JSON mapping (SQL → tree) | xwquery | Maps SQL grammar / AST to xwquery tree nodes |

---

## Table of Contents

1. [Deep dive: xwsyntax](#1-deep-dive-xwsyntax)
2. [Deep dive: xwschema](#2-deep-dive-xwschema)
3. [Deep dive: xwquery](#3-deep-dive-xwquery)
4. [Target artifacts: SQL example](#4-target-artifacts-sql-example)
5. [Pipeline summary](#5-pipeline-summary)

---

## 1. Deep dive: xwsyntax

### 1.1 Role

xwsyntax provides **grammar-driven parsing and generation**: one input grammar (Lark) for **text → AST**, one output grammar (Lark-like templates) for **AST → text**. No hand-written parsers or generators for the language itself.

### 1.2 File conventions

- **`<format>.grammar.in.lark`** — Input grammar (Lark). Used to **parse** source text into a **ParseNode** AST. Rules define the concrete syntax (e.g. `select_statement`, `where_clause`).
- **`<format>.grammar.out.lark`** — Output grammar. Template-style rules (e.g. `@select_statement = SELECT {{child_0}}...`) used to **generate** text from an AST. One rule per non-terminal, with placeholders for children and properties.
- **`<format>.grammar.info.json`** — Single JSON metadata file per format. Describes format id, name, file extensions, MIME types, category, `supports_bidirectional`, etc. Handlers and registry **auto-discover** formats from these files (no hardcoding in Python).

Relevant code:

- **Discovery:** `xwsyntax/registry.py` and `grammar_metadata.py` glob `*.grammar.info.json` and merge metadata.
- **Bidirectional:** `xwsyntax/bidirectional.py` loads `{format}.grammar.in.lark` and `{format}.grammar.out.lark` by convention.
- **Parsing:** `xwsyntax/engines/lark.py` (and `xw.py`) prefer `.grammar.in.lark` for parsing.

### 1.3 SQL in xwsyntax (existing)

- **`sql.grammar.in.lark`** — Defines `statement` (select | insert | update | delete | create | alter | drop), expressions, literals, keywords. Produces a **ParseNode** tree (rule names become node types).
- **`sql.grammar.out.lark`** — One `@rule = ...` per rule; templates use `{{child_0}}`, `{{value}}`, Handlebars-style conditionals. Used to serialize an AST back to SQL text.
- **`sql.grammar.info.json`** — Contains `format_id`, `format_name`, `syntax_name`, `file_extensions`, `mime_types`, `supports_bidirectional`, etc.

So for SQL we **already have** the “2 Lark + 1 JSON” set in xwsyntax; the idea is to **rely only on these** (plus one schema and one mapping) and not duplicate syntax logic elsewhere.

---

## 2. Deep dive: xwschema

### 2.1 Role

xwschema handles **schema formats** (JSON Schema, Avro, Protobuf, OpenAPI, GraphQL, etc.): load, validate, transform, and generate. Schemas are described in their native format (e.g. a `.schema.json` or `.json` file for JSON Schema). The engine uses **xwdata** for I/O and reference resolution.

### 2.2 Schema as “one JSON file”

- **JSON Schema** is supported via `JsonSchemaSerializer`; schema documents are JSON with a well-known structure (`$schema`, `type`, `properties`, `$ref`, etc.).
- The engine maps file extensions (e.g. `.schema.json`, `.json`) to `SchemaFormat.JSON_SCHEMA` and loads/saves through xwdata.
- So the **“1 JSON file matching the schema structure”** means: a **single JSON Schema document** that describes the **canonical structure of the xwquery tree** (e.g. node types, required/optional fields, allowed children). That file would live in or be referenced by xwschema (or a shared docs/schemas folder) and define the **contract** for the query tree.

### 2.3 xwquery tree schema (conceptual)

The xwquery runtime uses **QueryAction** (extends **ANode** from xwnode): tree nodes with `type`, `params`, `children`, etc. A schema for this could look like:

- **Root:** object with `type` (e.g. `"SELECT"`, `"INSERT"`), `params` (object), optional `children` (array of same shape).
- **params:** format-specific (e.g. `select_list`, `from_clause`, `where_clause` for SELECT).
- **children:** recursive tree for subqueries or nested clauses.

That schema would be the **single** structural definition; format-specific mappings (e.g. SQL) would say how each grammar rule or AST node maps to this tree (see xwquery section).

---

## 3. Deep dive: xwquery

### 3.1 Role

xwquery compiles and executes many query formats. The **canonical internal representation** is a **QueryAction** tree (ANode). Strategies (e.g. SQL) either parse text to QueryAction or generate text from QueryAction.

### 3.2 SQL strategy and xwsyntax

- **`compiler/strategies/sql.py`** — `SQLStrategy` extends `GrammarBasedStrategy` and `AStructuredQueryStrategy`. It uses **xwsyntax** for parsing (no hand-written SQL parser); parsing is done via `GrammarBasedSQLStrategy` (syntax_adapter).
- **`compiler/strategies/grammar_based.py`** — Base that holds a format name, lazy-loads `UniversalGrammarAdapter` (xwsyntax) and `SyntaxToQueryActionConverter`. Flow: **query string → xwsyntax ParseNode AST → SyntaxToQueryActionConverter → QueryAction tree**.
- **`compiler/adapters/syntax_adapter.py`** — `SyntaxToQueryActionConverter` converts **ParseNode → QueryAction** (and reverse). Logic is currently **hard-coded in Python** (e.g. `_convert_select`, `_convert_insert`, …).

### 3.3 Mapping today vs. “1 JSON mapping” idea

- **`compiler/adapters/format_mappings.py`** — Defines `MappingRule` (ast_pattern, query_action_type, extraction_func) and `FormatMapping` (format_name, rules, …). Today these are **Python dataclasses and callables**; the “different JSON mapping syntax to the schema” idea would replace or drive this by:
  - **One JSON file per format** (e.g. `sql_query_mapping.json`) that describes:
    - Which AST node types (from xwsyntax grammar rule names) map to which QueryAction `type` and `params` shape.
    - How to pull `select_list`, `from_clause`, `where_clause`, etc. from the ParseNode tree (path or simple expressions).
  - A **generic interpreter** (in xwquery) that reads this JSON and the xwquery-tree schema (from xwschema world) and performs ParseNode → QueryAction. That gives “1 JSON file for sql-query tree in xwquery” as requested.

So the **“1 JSON file for sql-query tree in xwquery”** is the **SQL-specific mapping** from SQL grammar/AST (xwsyntax) to the canonical query tree (described by the single schema in xwschema).

---

## 4. Target artifacts: SQL example

Concrete list matching the intro.

### 4.1 In xwsyntax (2 Lark + 1 JSON)

| File | Purpose |
|------|--------|
| `sql.grammar.in.lark` | Parse SQL text → ParseNode AST (rule names = node types). |
| `sql.grammar.out.lark` | Generate SQL text from ParseNode AST (templates per rule). |
| `sql.grammar.info.json` | Format metadata (id, extensions, MIME, bidirectional). |

All under e.g. `xwsyntax/src/exonware/xwsyntax/grammars/`. No extra SQL syntax logic in xwquery.

### 4.2 In xwschema (1 JSON)

| File | Purpose |
|------|--------|
| `xwquery_tree.schema.json` (or similar) | **One** JSON Schema (or equivalent) describing the **xwquery query tree**: root type, `type`, `params` shape, `children` recursion. Used to validate and document the canonical tree. |

Location could be `xwschema` (if we treat it as a schema asset) or a shared `docs/schemas` / `xwquery/docs/schemas` and referenced by both xwschema and xwquery.

### 4.3 In xwquery (1 JSON)

| File | Purpose |
|------|--------|
| `sql_query_mapping.json` (or similar) | **SQL-specific** mapping: which SQL grammar rules / ParseNode types map to which QueryAction `type` and how to fill `params`/children from the AST. Drives the converter that today lives in `syntax_adapter.py` / `format_mappings.py`. |

Location e.g. `xwquery/src/exonware/xwquery/compiler/mappings/sql_query_mapping.json` or under `docs/` if we want it as reference only at first.

---

## 5. Pipeline summary

```
┌─────────────────────────────────────────────────────────────────────────┐
│ xwsyntax                                                                 │
│   sql.grammar.in.lark  ──parse──►  ParseNode (AST)                      │
│   sql.grammar.out.lark ◄──generate──  ParseNode (AST)                    │
│   sql.grammar.info.json  (format metadata)                               │
└─────────────────────────────────────────────────────────────────────────┘
                    │
                    │ AST
                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ xwquery                                                                   │
│   sql_query_mapping.json  (SQL AST → tree mapping)                       │
│   + generic mapper using xwquery_tree.schema.json (structure)            │
│                    │                                                      │
│                    ▼                                                      │
│   QueryAction tree (canonical xwquery tree)                              │
└─────────────────────────────────────────────────────────────────────────┘
                    │
                    │ schema
                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ xwschema                                                                  │
│   xwquery_tree.schema.json  (single JSON describing tree structure)     │
└─────────────────────────────────────────────────────────────────────────┘
```

- **Only xwsyntax** defines SQL syntax (2 Lark + 1 info JSON).
- **One schema JSON** (xwschema world) describes the xwquery tree.
- **One mapping JSON** per format (here SQL) describes how that format’s AST maps to the schema. That yields the “different JSON mapping syntax to the schema of different query format, for example SQL” with exactly the artifact set above.

---

*End of report.*

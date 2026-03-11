# xwsyntax — API Reference (REF_15_API)

**Last Updated:** 08-Feb-2026  
**Producing guide:** GUIDE_15_API  
**Requirements source:** [REF_01_REQ.md](REF_01_REQ.md) sec. 6

API reference for xwsyntax. Aligned with `src/exonware/xwsyntax/__init__.py` public surface. See [REF_22_PROJECT.md](REF_22_PROJECT.md) and [REF_13_ARCH.md](REF_13_ARCH.md). Legacy: _archive/ (XWSYNTAX_QUICK_START_GUIDE, etc.).

---

## Main entry points (facade)

| Symbol | Description |
|--------|-------------|
| `XWSyntax` | Main facade: load grammars, parse, validate. |
| `XWSyntaxFactory` | Factory for facade instances. |
| `parse(text, format_name, ...)` | Parse text to AST for a given format. |
| `validate(text, format_name, ...)` | Validate text against a grammar. |
| `load_grammar_quick(name)` | Load a grammar by name (convenience). |
| `list_grammars_quick()` | List available grammars (convenience). |

---

## Base and contracts

| Symbol | Description |
|--------|-------------|
| `AGrammar`, `ASyntaxEngine`, `ASyntaxHandler` | Base classes. |
| `ISyntaxHandler`, `ISyntaxEngine` | Interfaces. |

---

## Engines and grammars

| Symbol | Description |
|--------|-------------|
| `XWSyntaxEngine`, `LarkSyntaxEngine` | Parsing engines. |
| `Grammar`, `LarkGrammar` | Grammar wrappers. |

---

## Loaders and metadata

| Symbol | Description |
|--------|-------------|
| `MultiFormatGrammarLoader`, `get_grammar_loader` | Multi-format grammar loading. |
| `GrammarMetadata`, `get_grammar_metadata` | Grammar metadata access. |

---

## Parse tree and bidirectional

| Symbol | Description |
|--------|-------------|
| `ParseNode`, `ParseVisitor`, `ParsePrinter`, `create_immutable_ast` | Parse tree types and utilities. |
| `OutputGrammar`, `OutputGrammarRegistry`, `get_default_registry` | Output (generate) side. |
| `GrammarUnparser` | Unparse AST to text. |
| `BidirectionalGrammar`, `BidirectionalGrammarRegistry`, `get_bidirectional_registry` | Bidirectional parse ↔ generate. |

---

## Monaco export

| Symbol | Description |
|--------|-------------|
| `MonacoExporter`, `MonarchLanguage`, `MonarchLanguageConfig` | Monaco / Monarch integration. |
| `export_grammar_to_monaco` | Export a grammar to Monaco format. |

---

## Errors

| Symbol | Description |
|--------|-------------|
| `SyntaxError`, `GrammarError`, `GrammarNotFoundError` | Grammar/load errors. |
| `ParseError`, `ValidationError`, `MaxDepthError` | Parse/validation errors. |

---

*Per GUIDE_00_MASTER and GUIDE_15_API. Requirements: [REF_01_REQ.md](REF_01_REQ.md).*

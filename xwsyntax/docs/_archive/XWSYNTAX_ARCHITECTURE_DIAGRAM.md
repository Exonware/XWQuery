# xwsyntax Architecture - Serialization Integration

## Class Hierarchy

```
┌─────────────────────────────────────────────────────────────────┐
│                        ISerialization                           │
│                      (xwsystem.serialization)                   │
├─────────────────────────────────────────────────────────────────┤
│  Properties:                                                    │
│  • format_name: str                                            │
│  • file_extensions: list[str]                                  │
│  • is_text_format: bool                                        │
│  • is_binary_format: bool                                      │
│                                                                  │
│  Core Methods:                                                  │
│  • dumps(data) -> str | bytes                                  │
│  • loads(data) -> Any                                          │
│  • save(data, path)                                            │
│  • load(path) -> Any                                           │
│  • validate_input(data) -> bool                                │
│  • + 50+ more serialization methods                            │
└─────────────────────────────────────────────────────────────────┘
                            ▲
                            │ extends
                            │
┌─────────────────────────────────────────────────────────────────┐
│                      ISyntaxHandler                             │
│                       (xwsyntax.contracts)                      │
├─────────────────────────────────────────────────────────────────┤
│  Inherited from ISerialization:                                 │
│  ✓ All serialization methods                                   │
│                                                                  │
│  Grammar-Specific Methods:                                      │
│  • parse_grammar(text) -> AGrammar                             │
│  • validate_grammar(text) -> list[str]                         │
│  • get_grammar_format() -> GrammarFormat                       │
│  • convert_to_lark(data) -> str                                │
│  • load_grammar(path) -> AGrammar                              │
│  • save_grammar(grammar, path)                                 │
└─────────────────────────────────────────────────────────────────┘
                            ▲
                            │ implements
                            │
┌─────────────────────────────────────────────────────────────────┐
│                      ASyntaxHandler                             │
│                       (xwsyntax.base)                          │
├─────────────────────────────────────────────────────────────────┤
│  Inherited from ASerialization:                                 │
│  ✓ Default implementations of all serialization methods        │
│  ✓ File I/O, security, validation                             │
│                                                                  │
│  Concrete Implementations:                                      │
│  ✓ load_grammar(path) - combines load() + parse_grammar()     │
│  ✓ save_grammar() - combines serialization + save()           │
│                                                                  │
│  Abstract Methods (must implement):                             │
│  • parse_grammar(text) -> AGrammar                             │
│  • validate_grammar(text) -> list[str]                         │
│  • get_grammar_format() -> GrammarFormat                       │
│  • convert_to_lark(data) -> str                                │
└─────────────────────────────────────────────────────────────────┘
                            ▲
                            │ subclass
                            │
                   ┌────────┴────────┐
                   │                 │
        ┌──────────▼─────────┐  ┌───▼──────────────┐
        │ LarkGrammarHandler │  │ JSONGrammarHandler│
        │  (future)          │  │   (future)        │
        └────────────────────┘  └───────────────────┘
```

## Component Interaction

```
┌─────────────────────────────────────────────────────────────────┐
│                    MultiFormatGrammarLoader                     │
│                   (xwsyntax.grammar_loader)                    │
├─────────────────────────────────────────────────────────────────┤
│  Uses serializers from xwsystem:                                │
│  • JsonSerializer                                              │
│  • YamlSerializer                                              │
│  • TomlSerializer                                              │
│  • XmlSerializer                                               │
│  • PlistlibSerializer                                          │
└─────────────────────────────────────────────────────────────────┘
                            │
                            │ imports from
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                 exonware.xwsystem.serialization                 │
├─────────────────────────────────────────────────────────────────┤
│  • JsonSerializer     ──→  uses json.dumps/loads               │
│  • YamlSerializer     ──→  uses yaml.dump/safe_load            │
│  • TomlSerializer     ──→  uses tomli/tomli_w                  │
│  • XmlSerializer      ──→  uses defusedxml                     │
│  • PlistlibSerializer ──→  uses plistlib                       │
└─────────────────────────────────────────────────────────────────┘
```

## Data Flow: Loading a Grammar File

```
┌──────────────┐
│ grammar.json │
└──────┬───────┘
       │
       ▼
┌────────────────────────────────────┐
│ MultiFormatGrammarLoader           │
│ .load_grammar_file("grammar.json") │
└────────────────┬───────────────────┘
                 │
                 ├─ 1. Detect format (.json)
                 │
                 ▼
┌─────────────────────────────────────┐
│ JsonSerializer (from xwsystem)      │
│ .load("grammar.json")               │
└────────────────┬────────────────────┘
                 │
                 ├─ 2. Parse JSON using json.loads()
                 │
                 ▼
┌─────────────────────────────────────┐
│ Python dict with grammar data       │
└────────────────┬────────────────────┘
                 │
                 ├─ 3. Convert to Lark format
                 │
                 ▼
┌─────────────────────────────────────┐
│ Lark EBNF text                      │
└────────────────┬────────────────────┘
                 │
                 ├─ 4. Parse grammar definition
                 │
                 ▼
┌─────────────────────────────────────┐
│ Grammar object (ready to use)       │
└─────────────────────────────────────┘
```

## Method Resolution Order (MRO)

```
ASyntaxHandler.__mro__:
1. ASyntaxHandler
2. ASerialization      ← from xwsystem
3. ISerialization      ← from xwsystem
4. ABC
5. object

This means ASyntaxHandler inherits ALL methods from ASerialization:
✓ dumps(), loads(), save(), load()
✓ validate_input(), validate_path()
✓ is_text_format(), is_binary_format()
✓ estimate_size(), format_detection()
✓ to_base64(), from_base64()
✓ ... and 40+ more methods!
```

## Benefits Diagram

```
┌───────────────────────────────────────────────────────────────┐
│                   Before (Duplicated Code)                    │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  xwsystem                    xwsyntax                         │
│  ├─ JsonSerializer           ├─ JsonParser (reimplemented)   │
│  ├─ YamlSerializer           ├─ YamlParser (reimplemented)   │
│  ├─ TomlSerializer           ├─ TomlParser (reimplemented)   │
│  └─ XmlSerializer            └─ XmlParser (reimplemented)    │
│                                                               │
│  Problems:                                                    │
│  ❌ Code duplication                                          │
│  ❌ Maintenance burden                                        │
│  ❌ Inconsistent APIs                                         │
│  ❌ Security vulnerabilities                                  │
└───────────────────────────────────────────────────────────────┘

                            ↓ Refactored to ↓

┌───────────────────────────────────────────────────────────────┐
│                    After (Code Reuse)                         │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  xwsystem.serialization                                       │
│  ├─ ISerialization ──────────────┐                           │
│  ├─ ASerialization               │                           │
│  ├─ JsonSerializer               │ extends                   │
│  ├─ YamlSerializer               │                           │
│  ├─ TomlSerializer               │                           │
│  └─ XmlSerializer                │                           │
│                                  │                           │
│  xwsyntax                        │                           │
│  ├─ ISyntaxHandler ◄─────────────┘                           │
│  ├─ ASyntaxHandler (inherits all serialization)              │
│  └─ MultiFormatGrammarLoader (uses xwsystem serializers)     │
│                                                               │
│  Benefits:                                                    │
│  ✅ Zero code duplication                                     │
│  ✅ Single source of truth                                    │
│  ✅ Consistent API everywhere                                │
│  ✅ Inherited security features                               │
│  ✅ 31+ formats automatically                                │
└───────────────────────────────────────────────────────────────┘
```

## SOLID Principles Applied

```
┌─────────────────────────────────────────────────────────────┐
│ S - Single Responsibility Principle                         │
├─────────────────────────────────────────────────────────────┤
│ ✓ xwsystem: Handles serialization                          │
│ ✓ xwsyntax: Handles grammar logic                          │
│ ✓ Clear separation of concerns                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ O - Open/Closed Principle                                   │
├─────────────────────────────────────────────────────────────┤
│ ✓ Open for extension: New grammar formats can be added     │
│ ✓ Closed for modification: Uses stable serialization API   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ L - Liskov Substitution Principle                           │
├─────────────────────────────────────────────────────────────┤
│ ✓ ASyntaxHandler can replace ASerialization anywhere       │
│ ✓ Adds functionality without breaking contracts            │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ I - Interface Segregation Principle                         │
├─────────────────────────────────────────────────────────────┤
│ ✓ ISyntaxHandler only adds necessary grammar methods       │
│ ✓ Clients use only what they need                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ D - Dependency Inversion Principle                          │
├─────────────────────────────────────────────────────────────┤
│ ✓ Both depend on ISerialization abstraction                │
│ ✓ Not coupled to concrete implementations                  │
└─────────────────────────────────────────────────────────────┘
```

## Format Support Matrix

```
┌─────────────────┬─────────────┬─────────────────────────────┐
│ Format          │ Serializer  │ Grammar Support             │
├─────────────────┼─────────────┼─────────────────────────────┤
│ JSON            │ ✓ xwsystem  │ ✓ TextMate JSON grammars    │
│ YAML            │ ✓ xwsystem  │ ✓ TextMate YAML grammars    │
│ TOML            │ ✓ xwsystem  │ ✓ Custom TOML grammars      │
│ XML             │ ✓ xwsystem  │ ✓ TextMate XML grammars     │
│ PLIST           │ ✓ xwsystem  │ ✓ TextMate PLIST grammars   │
│ Lark EBNF       │ ✓ Direct    │ ✓ Native format             │
├─────────────────┼─────────────┼─────────────────────────────┤
│ Binary formats  │             │                             │
│ BSON            │ ✓ xwsystem  │ ○ Future support            │
│ MessagePack     │ ✓ xwsystem  │ ○ Future support            │
│ CBOR            │ ✓ xwsystem  │ ○ Future support            │
└─────────────────┴─────────────┴─────────────────────────────┘

Legend:
✓ - Implemented and working
○ - Planned for future versions
```

---

**Architecture designed by:** Eng. Muhammad AlShehri  
**Company:** eXonware.com  
**Date:** October 29, 2025


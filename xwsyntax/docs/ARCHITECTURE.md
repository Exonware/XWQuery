# xwsyntax Architecture

**Company:** eXonware.com  
**Version:** 0.0.1  
**Date:** 29-Oct-2025

---

## Overview

xwsyntax is a universal grammar engine that provides bidirectional parsing and generation for 31+ formats. It leverages xwnode's optimized data structures for high-performance AST operations.

---

## Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│ IDE Integration (LSP, Monaco, tree-sitter)                  │
│ - Language Server Protocol for editor features              │
│ - Monaco Monarch language definitions                       │
│ - Tree-sitter grammar generation                            │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Bidirectional Grammar System                                │
│ - Input Grammars (.in.grammar) → Parse text to AST         │
│ - Output Grammars (.out.grammar) → Generate text from AST  │
│ - Roundtrip validation                                      │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Core Engine                                                 │
│ - SyntaxEngine: Parse using Lark                            │
│ - GrammarUnparser: Generate using templates                 │
│ - Grammar: Wrapper for Lark parsers                         │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ AST Optimization (xwnode-powered)                           │
│ - Automatic optimization based on tree size                 │
│ - Type Index: Trie for O(k) type queries                   │
│ - Position Index: IntervalTree for O(log n) range queries  │
│ - Cache: LRU for parsers and templates                     │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ Binary Format Adapters                                      │
│ - BSON, MessagePack, CBOR, Protobuf, Avro                  │
│ - Convert binary → AST (same structure as text)            │
│ - Enable cross-format conversion                            │
└─────────────────────────────────────────────────────────────┘
```

---

## Core Components

### 1. SyntaxEngine

**Purpose:** Main parsing interface using Lark grammars.

**Capabilities:**
- Load and cache grammar definitions
- Parse text to AST
- Automatic parser caching

**Usage:**
```python
from exonware.xwsyntax import SyntaxEngine

engine = SyntaxEngine()
ast = engine.parse('SELECT * FROM users', grammar='sql')
```

### 2. BidirectionalGrammar

**Purpose:** Unified interface for parsing AND generation.

**Capabilities:**
- Parse text → AST using `.in.grammar`
- Generate AST → text using `.out.grammar`
- Roundtrip validation
- Format registry

**Usage:**
```python
from exonware.xwsyntax import BidirectionalGrammar

grammar = BidirectionalGrammar.load('json')
ast = grammar.parse('{"key": "value"}')
output = grammar.generate(ast)
```

### 3. ASTOptimizer

**Purpose:** Automatic performance optimization based on tree size.

**Optimization Levels:**
- **Small (<100 nodes):** No overhead, direct traversal
- **Medium (100-1K):** Type index (Trie) for O(k) type queries
- **Large (1K-10K):** Type + position indexes
- **Ultra (>10K):** Full optimization suite

**Usage:**
```python
# Automatic
ast = grammar.parse(text, optimize="auto")

# Manual
ast = grammar.parse(text, optimize="large")
```

---

## Data Flow

### Parsing Flow

```
Text Input
    ↓
.in.grammar (Lark parser)
    ↓
Lark Tree
    ↓
AST Conversion
    ↓
ASTNode Tree
    ↓
[Optional] Optimization (xwnode)
    ↓
Optimized AST
```

### Generation Flow

```
ASTNode Tree
    ↓
.out.grammar (Template system)
    ↓
Template Rendering
    ↓
Text Output
```

---

## Performance Characteristics

### Parse Performance

| AST Size | Without Optimization | With Optimization |
|----------|---------------------|-------------------|
| Small (<100) | 0.1-1ms | 0.1-1ms (no overhead) |
| Medium (100-1K) | 1-10ms | 1-10ms |
| Large (1K-10K) | 10-100ms | 10-100ms |
| Ultra (>10K) | 100ms-1s | 100ms-1s |

### Query Performance (with optimization)

| Operation | Without Optimization | With Optimization |
|-----------|---------------------|-------------------|
| find_by_type() | O(n) | O(k) with Trie |
| find_in_range() | O(n) | O(log n + k) with IntervalTree |
| Parser cache hit | N/A | O(1) with LRU |

---

## Design Patterns

### 1. Strategy Pattern
- Different optimization strategies (Basic, Medium, Large, Ultra)
- Automatic selection based on AST size

### 2. Facade Pattern
- BidirectionalGrammar provides unified interface
- Hides complexity of parse + generate

### 3. Registry Pattern
- Grammar registry for format management
- Cache registry for parser/template storage

### 4. Template Method Pattern
- OutputGrammar defines template structure
- Specific formats implement templates

---

## Dependencies

### Core
- **exonware-xwnode** - Optimized data structures
- **exonware-xwsystem** - Foundation utilities
- **lark** - Grammar parsing

### Optional
- **msgpack, cbor2** - Binary formats
- **pygls, tree-sitter** - IDE features

---

## Extension Points

### Adding a New Grammar

1. Create `.in.grammar` file (parsing rules)
2. Create `.out.grammar` file (generation templates)
3. Place in `grammars/` directory
4. Test with roundtrip validation

**No Python code needed!**

### Adding Binary Format

1. Implement `ABinaryAdapter`
2. Override `parse()` and `generate()`
3. Specify text equivalent grammar

### Adding IDE Feature

1. Use existing LSP server
2. Export grammar to Monaco format
3. Generate tree-sitter grammar

---

**For complete details, see API_REFERENCE.md**



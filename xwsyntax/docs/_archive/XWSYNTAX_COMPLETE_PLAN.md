# xwsyntax - Universal Grammar Engine
## Complete Implementation Plan

**Version:** 1.0.0  
**Date:** October 29, 2025  
**Company:** eXonware.com  
**Status:** Implementation Plan

---

## Executive Summary

**xwsyntax** is a comprehensive grammar engine that will become the foundation for parsing and generating code across 31+ formats. It leverages xwnode's optimized data structures for high-performance AST operations and provides bidirectional grammars (parse + generate) for universal format conversion.

### Key Features
- 31 grammar formats (queries, data, programming languages, specialized)
- Bidirectional processing (text → AST → text)
- Automatic performance optimization based on AST size
- Binary format support (BSON, MessagePack, CBOR, Protobuf, Avro)
- IDE integration (LSP server, Monaco editor, tree-sitter)
- xwnode-powered indexing (Trie, IntervalTree, LRU cache)

### Architecture Position
```
xwsystem (foundation: utilities, serialization, monitoring)
    ↓
xwnode (strategies: 57+ data structures)
    ↓
xwsyntax (grammars: universal parsing engine) ← NEW
    ↓
xwquery (conversion: 31 query formats)
```

---

## Table of Contents

1. [Architecture & Dependencies](#1-architecture--dependencies)
2. [Phase 0: Documentation](#phase-0-documentation)
3. [Phase 1: Package Extraction](#phase-1-package-extraction--structure)
4. [Phase 2: xwnode Integration](#phase-2-xwnode-integration-automatic-optimization)
5. [Phase 3: Grammar Implementation](#phase-3-grammar-implementation-31-formats)
6. [Phase 4: Binary Format Support](#phase-4-binary-format-support)
7. [Phase 5: IDE Features](#phase-5-ide-features)
8. [Phase 6: Performance Optimizations](#phase-6-performance-optimizations)
9. [Phase 7: Testing Infrastructure](#phase-7-testing-infrastructure)
10. [Phase 8: Documentation](#phase-8-documentation)
11. [Phase 9: Migration & Integration](#phase-9-migration--integration)
12. [Phase 10: Release & Publishing](#phase-10-release--publishing)
13. [Success Metrics & Timeline](#success-metrics--timeline)

---

## 1. Architecture & Dependencies

### 1.1 Dependency Chain

```
┌─────────────────────────────────────────────────┐
│ xwquery (Query Language Conversion)              │
│ - 31 query format converters                    │
│ - Uses xwsyntax grammars for parsing            │
│ Dependencies: exonware-xwsyntax>=1.0.0          │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│ xwsyntax (Universal Grammar Engine) ← NEW       │
│ - Bidirectional grammars (parse + generate)     │
│ - 31+ format grammars                           │
│ - Uses xwnode for AST optimization              │
│ Dependencies: exonware-xwnode>=1.0.0, lark      │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│ xwnode (Optimized Data Structures)              │
│ - 57 node strategies (Trie, IntervalTree, etc.) │
│ - 22 edge strategies                            │
│ Dependencies: exonware-xwsystem>=1.0.0          │
└─────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────┐
│ xwsystem (Enterprise Foundation)                │
│ - 30 serialization formats                      │
│ - Security, monitoring, caching                 │
│ Dependencies: typing-extensions (minimal)       │
└─────────────────────────────────────────────────┘
```

### 1.2 Installation Modes

```bash
# Minimal (basic parsing)
pip install exonware-xwsyntax
# Gets: xwsyntax + xwnode (basic) + xwsystem (core)

# Optimized (all xwnode strategies)
pip install exonware-xwsyntax[optimization]
# Gets: xwsyntax + xwnode[full] (57 strategies) + xwsystem[full]

# Binary formats
pip install exonware-xwsyntax[binary]
# Gets: + msgpack, cbor2 for binary adapters

# IDE features
pip install exonware-xwsyntax[ide]
# Gets: + pygls (LSP), tree-sitter

# Complete (recommended for development)
pip install exonware-xwsyntax[full]
# Gets: optimization + binary + ide
```

---

## Phase 0: Documentation

### Deliverable: This Document

**Status:** ✅ Complete

This comprehensive plan serves as:
- Implementation roadmap
- Technical specification
- Architecture reference
- Project timeline
- Success criteria

---

## Phase 1: Package Extraction & Structure

### 1.1 Create Package Directory

```bash
xwsyntax/
├── src/
│   ├── exonware/
│   │   ├── __init__.py           # Namespace package
│   │   └── xwsyntax/
│   │       ├── __init__.py       # Main facade
│   │       ├── version.py        # Version: 1.0.0
│   │       ├── base.py           # Abstract base classes
│   │       ├── engine.py         # Grammar engine
│   │       ├── syntax_tree.py    # AST nodes
│   │       ├── parser_cache.py   # Parser caching
│   │       ├── output_grammar.py # Output grammar parser
│   │       ├── unparser.py       # Template-based generation
│   │       ├── bidirectional.py  # Bidirectional wrapper
│   │       ├── grammar_loader.py # Multi-format loader
│   │       ├── monaco_exporter.py # Monaco integration
│   │       ├── contracts.py      # Interfaces
│   │       ├── defs.py           # Enums and constants
│   │       ├── errors.py         # Exception hierarchy
│   │       ├── grammars/         # 31+ grammar files
│   │       │   ├── json.in.grammar
│   │       │   ├── json.out.grammar
│   │       │   ├── sql.in.grammar
│   │       │   ├── sql.out.grammar
│   │       │   └── ... (60+ files)
│   │       ├── optimizations/    # xwnode integration
│   │       │   ├── __init__.py
│   │       │   ├── ast_optimizer.py
│   │       │   ├── type_index.py
│   │       │   ├── position_index.py
│   │       │   └── cache_optimizer.py
│   │       ├── binary/           # Binary format adapters
│   │       │   ├── __init__.py
│   │       │   ├── base.py
│   │       │   ├── bson_adapter.py
│   │       │   ├── msgpack_adapter.py
│   │       │   ├── cbor_adapter.py
│   │       │   ├── protobuf_adapter.py
│   │       │   └── avro_adapter.py
│   │       └── ide/              # IDE features
│   │           ├── __init__.py
│   │           ├── lsp_server.py
│   │           ├── monaco_languages.py
│   │           └── tree_sitter_gen.py
│   └── xwsyntax.py              # Convenience alias
├── tests/
│   ├── __init__.py
│   ├── unit/
│   │   ├── test_parser.py
│   │   ├── test_unparser.py
│   │   ├── test_bidirectional.py
│   │   ├── test_optimization.py
│   │   └── test_binary_adapters.py
│   ├── integration/
│   │   ├── test_roundtrip_all_formats.py
│   │   ├── test_xwnode_integration.py
│   │   └── test_format_conversion.py
│   ├── performance/
│   │   └── test_benchmarks.py
│   └── runner.py
├── benchmarks/
│   ├── benchmark_parsing.py
│   ├── benchmark_generation.py
│   ├── benchmark_roundtrip.py
│   ├── benchmark_optimization.py
│   └── benchmark_binary.py
├── examples/
│   ├── basic_usage.py
│   ├── format_conversion.py
│   ├── binary_formats.py
│   ├── optimization_demo.py
│   ├── ide_integration/
│   │   ├── lsp_example.py
│   │   └── monaco_example.html
│   └── advanced_features.py
├── docs/
│   ├── ARCHITECTURE.md
│   ├── GRAMMARS.md
│   ├── OPTIMIZATION.md
│   ├── BINARY_FORMATS.md
│   ├── IDE_INTEGRATION.md
│   ├── API_REFERENCE.md
│   └── MIGRATION_GUIDE.md
├── pyproject.toml
├── requirements.txt
├── README.md
├── LICENSE
└── CHANGELOG.md
```

### 1.2 Extract Modules from xwsystem

**Source:** `xwsystem/src/exonware/xwsystem/syntax/`  
**Destination:** `xwsyntax/src/exonware/xwsyntax/`

**Files to extract:**
- `base.py` (130 lines) - Abstract base classes
- `engine.py` (397 lines) - SyntaxEngine, Grammar classes
- `syntax_tree.py` (140 lines) - ASTNode, ASTVisitor
- `parser_cache.py` (72 lines) - Cache implementations
- `output_grammar.py` (245 lines) - OutputGrammar class
- `unparser.py` (457 lines) - GrammarUnparser class
- `bidirectional.py` (257 lines) - BidirectionalGrammar class
- `grammar_loader.py` (200+ lines) - Multi-format loader
- `monaco_exporter.py` (300+ lines) - Monaco Monarch exporter
- `contracts.py` (100+ lines) - Interfaces
- `defs.py` (80+ lines) - Enums and constants
- `errors.py` (150+ lines) - Exception hierarchy
- `grammars/` (6 files currently, will grow to 62 files)
  - json.in.grammar (30 lines)
  - json.out.grammar (24 lines)
  - sql.in.grammar (209 lines)
  - sql.out.grammar (147 lines)
  - python.in.grammar (99 lines)
  - python.out.grammar (75 lines)

**Total code to extract:** ~2,400 lines + grammar files

### 1.3 Create pyproject.toml

```toml
[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[project]
name = "exonware-xwsyntax"
version = "1.0.0"
description = "Universal grammar engine with bidirectional parsing and generation for 31+ formats"
readme = "README.md"
requires-python = ">=3.8"
keywords = [
    "parser", "grammar", "lark", "ast", "syntax",
    "bidirectional", "code-generation", "format-conversion",
    "ide", "lsp", "monaco", "tree-sitter",
    "json", "sql", "python", "graphql", "cypher",
    "exonware"
]
classifiers = [
    "Development Status :: 5 - Production/Stable",
    "Intended Audience :: Developers",
    "License :: OSI Approved :: MIT License",
    "Operating System :: OS Independent",
    "Programming Language :: Python :: 3",
    "Programming Language :: Python :: 3.8",
    "Programming Language :: Python :: 3.9",
    "Programming Language :: Python :: 3.10",
    "Programming Language :: Python :: 3.11",
    "Programming Language :: Python :: 3.12",
    "Topic :: Software Development :: Code Generators",
    "Topic :: Software Development :: Compilers",
    "Topic :: Software Development :: Interpreters",
    "Topic :: Text Processing :: Linguistic",
]

dependencies = [
    "exonware-xwnode>=1.0.0",
    "lark>=1.1.0",
]

[[project.authors]]
name = "Eng. Muhammad AlShehri"
email = "connect@exonware.com"

[project.license]
text = "MIT"

[project.optional-dependencies]
optimization = [
    "exonware-xwnode[full]>=1.0.0",  # All 57 node strategies
]

binary = [
    "msgpack>=1.0.0",      # MessagePack binary format
    "cbor2>=5.0.0",        # CBOR binary format
]

ide = [
    "pygls>=1.0.0",        # Language Server Protocol
    "tree-sitter>=0.20.0", # High-performance parsing
]

dev = [
    "pytest>=7.0.0",
    "pytest-asyncio>=0.21.0",
    "pytest-cov>=4.0.0",
    "pytest-benchmark>=4.0.0",
    "black>=23.0.0",
    "isort>=5.12.0",
    "mypy>=1.0.0",
]

full = [
    "exonware-xwsyntax[optimization,binary,ide]",
]

[project.urls]
Homepage = "https://exonware.com"
Repository = "https://github.com/exonware/xwsyntax"
Documentation = "https://github.com/exonware/xwsyntax#readme"

[tool.hatch.version]
path = "src/exonware/xwsyntax/version.py"

[tool.hatch.build.targets.wheel]
packages = ["src/exonware"]
py-modules = ["src/xwsyntax"]
```

### 1.4 Update Import Paths

**Search and replace across all extracted files:**

```python
# Old imports
from exonware.xwsystem.syntax import ...

# New imports
from exonware.xwsyntax import ...
```

**Update internal imports:**
```python
# Old
from .base import AGrammar
from ..utils import something

# New (should remain)
from .base import AGrammar
from .utils import something
```

---

## Phase 2: xwnode Integration (Automatic Optimization)

### 2.1 Automatic Optimization Strategy

**Goal:** Automatically optimize AST operations based on tree size without user intervention.

**Implementation:** `optimizations/ast_optimizer.py`

```python
from typing import Optional
from ..syntax_tree import ASTNode
from exonware.xwnode import XWNode, NodeMode

class OptimizationLevel:
    """AST size thresholds for automatic optimization"""
    SMALL = 100      # No optimization overhead
    MEDIUM = 1000    # Type index only (Trie)
    LARGE = 10000    # Type + position indexes
    # Ultra-large: Full optimization suite

class OptimizedAST:
    """Base class for optimized AST wrappers"""
    def __init__(self, root: ASTNode):
        self.root = root
        self._node_count = self._count_nodes(root)
    
    def _count_nodes(self, node: ASTNode) -> int:
        count = 1
        for child in node.children:
            count += self._count_nodes(child)
        return count
    
    def find_by_type(self, node_type: str):
        """Override in subclasses with optimization"""
        return self.root.find_all(node_type)
    
    def find_in_range(self, start_line: int, end_line: int):
        """Override in subclasses with optimization"""
        raise NotImplementedError("Position queries not available")

class BasicAST(OptimizedAST):
    """No optimization - direct tree operations (< 100 nodes)"""
    pass

class MediumAST(OptimizedAST):
    """Type index using Trie (100-1000 nodes)"""
    def __init__(self, root: ASTNode):
        super().__init__(root)
        self._type_index = TypeIndex()
        self._type_index.index_ast(root)
    
    def find_by_type(self, node_type: str):
        # O(k) instead of O(n)
        return self._type_index.find_by_type(node_type)

class LargeAST(MediumAST):
    """Type + Position indexes (1000-10000 nodes)"""
    def __init__(self, root: ASTNode):
        super().__init__(root)
        self._position_index = PositionIndex()
        self._position_index.index_ast(root)
    
    def find_in_range(self, start_line: int, end_line: int):
        # O(log n + k) instead of O(n)
        return self._position_index.find_in_range(start_line, end_line)

class UltraLargeAST(LargeAST):
    """Full optimization suite (> 10000 nodes)"""
    def __init__(self, root: ASTNode):
        super().__init__(root)
        # Additional optimizations:
        # - Rope structure for efficient editing
        # - Cached subtree hashes for change detection
        # - Compressed storage for rarely-accessed nodes

class ASTOptimizer:
    """Automatically selects optimization level"""
    
    def optimize(self, ast: ASTNode, mode: str = "auto") -> OptimizedAST:
        if mode == "none":
            return BasicAST(ast)
        
        # Count nodes for automatic selection
        node_count = self._count_nodes(ast)
        
        if mode == "auto":
            if node_count < OptimizationLevel.SMALL:
                return BasicAST(ast)
            elif node_count < OptimizationLevel.MEDIUM:
                return MediumAST(ast)
            elif node_count < OptimizationLevel.LARGE:
                return LargeAST(ast)
            else:
                return UltraLargeAST(ast)
        
        # Manual mode selection
        elif mode == "basic":
            return BasicAST(ast)
        elif mode == "medium":
            return MediumAST(ast)
        elif mode == "large":
            return LargeAST(ast)
        elif mode == "ultra":
            return UltraLargeAST(ast)
        else:
            raise ValueError(f"Unknown optimization mode: {mode}")
    
    def _count_nodes(self, node: ASTNode) -> int:
        count = 1
        for child in node.children:
            count += self._count_nodes(child)
        return count
```

### 2.2 Type Index (Trie-based)

**File:** `optimizations/type_index.py`

```python
from typing import List
from exonware.xwnode import XWNode, NodeMode
from ..syntax_tree import ASTNode

class TypeIndex:
    """
    O(k) type queries using xwnode's Trie strategy.
    
    Enables fast prefix-based type searches:
    - find_by_type("string") -> all string nodes
    - find_by_type("func") -> all function/funcall nodes
    """
    
    def __init__(self):
        self._index = XWNode(mode=NodeMode.TRIE)
    
    def index_ast(self, ast: ASTNode):
        """Build index by walking entire AST"""
        self._walk_and_index(ast)
    
    def _walk_and_index(self, node: ASTNode):
        # Index this node
        existing = self._index.get(node.type, [])
        existing.append(node)
        self._index.set(node.type, existing)
        
        # Index children recursively
        for child in node.children:
            self._walk_and_index(child)
    
    def find_by_type(self, node_type: str) -> List[ASTNode]:
        """
        Find all nodes of given type.
        O(k) where k = number of results.
        """
        return self._index.get(node_type, [])
    
    def find_by_type_prefix(self, prefix: str) -> List[ASTNode]:
        """
        Find all nodes whose type starts with prefix.
        O(k) where k = number of results.
        """
        results = []
        for type_name in self._index.find_prefix(prefix):
            results.extend(self._index.get(type_name, []))
        return results
```

### 2.3 Position Index (IntervalTree-based)

**File:** `optimizations/position_index.py`

```python
from typing import List
from exonware.xwnode import XWNode, NodeMode
from ..syntax_tree import ASTNode

class PositionIndex:
    """
    O(log n + k) line-range queries using xwnode's IntervalTree strategy.
    
    Enables fast position-based queries:
    - find_in_range(50, 50) -> nodes at line 50
    - find_in_range(100, 200) -> nodes in lines 100-200
    
    Essential for IDE features like:
    - "Find symbol at cursor"
    - "Highlight syntax in visible range"
    - "Fold code sections"
    """
    
    def __init__(self):
        self._index = XWNode(mode=NodeMode.INTERVAL_TREE)
    
    def index_ast(self, ast: ASTNode):
        """Build index by walking AST and extracting positions"""
        self._walk_and_index(ast)
    
    def _walk_and_index(self, node: ASTNode):
        # Extract position metadata
        if 'start_line' in node.metadata and 'end_line' in node.metadata:
            start = node.metadata['start_line']
            end = node.metadata['end_line']
            
            # Insert interval into IntervalTree
            self._index.insert_interval(start, end, node)
        
        # Index children recursively
        for child in node.children:
            self._walk_and_index(child)
    
    def find_in_range(self, start_line: int, end_line: int) -> List[ASTNode]:
        """
        Find all nodes overlapping the given line range.
        O(log n + k) where k = number of results.
        """
        return self._index.find_overlaps(start_line, end_line)
    
    def find_at_line(self, line: int) -> List[ASTNode]:
        """Find all nodes containing the given line"""
        return self.find_in_range(line, line)
```

### 2.4 Cache Optimizer (LRU-based)

**File:** `optimizations/cache_optimizer.py`

```python
from typing import Optional, Any
from exonware.xwnode import XWNode, NodeMode

class ParserCache:
    """
    LRU cache for parsed grammars using xwnode's LRU_CACHE strategy.
    
    Provides O(1) get/put with automatic LRU eviction.
    Better than standard dict or functools.lru_cache:
    - Memory-bounded
    - Thread-safe
    - Statistics tracking
    - Custom eviction policies
    """
    
    def __init__(self, max_size: int = 128):
        self._cache = XWNode(
            mode=NodeMode.LRU_CACHE,
            max_size=max_size
        )
    
    def get(self, key: str) -> Optional[Any]:
        """Get cached parser (O(1))"""
        return self._cache.get(key)
    
    def set(self, key: str, parser: Any) -> None:
        """Cache parser (O(1) with automatic LRU eviction)"""
        self._cache.set(key, parser)
    
    def clear(self) -> None:
        """Clear all cached parsers"""
        self._cache.clear()
    
    def stats(self) -> dict:
        """Get cache statistics"""
        return {
            'size': self._cache.size(),
            'max_size': self._cache.max_size,
            'hit_rate': self._cache.hit_rate(),
            'evictions': self._cache.evictions(),
        }

class TemplateCache:
    """
    Cache for compiled output templates.
    Uses xwnode's HASH_MAP for O(1) lookups.
    """
    
    def __init__(self):
        self._cache = XWNode(
            mode=NodeMode.HASH_MAP,
            traits=NodeTrait.INDEXED
        )
    
    def get(self, template_key: str) -> Optional[Any]:
        """Get compiled template"""
        return self._cache.get(template_key)
    
    def set(self, template_key: str, compiled_template: Any) -> None:
        """Cache compiled template"""
        self._cache.set(template_key, compiled_template)
```

### 2.5 Integration into Engine

**Update:** `engine.py`

```python
from .optimizations.ast_optimizer import ASTOptimizer, OptimizedAST
from .optimizations.cache_optimizer import ParserCache

class Grammar(AGrammar):
    # Class-level parser cache (shared across instances)
    _parser_cache = ParserCache(max_size=128)
    
    def __init__(self, name: str, grammar_text: str, ...):
        # Check cache first
        cache_key = f"{name}:{hash(grammar_text)}"
        cached_parser = self._parser_cache.get(cache_key)
        
        if cached_parser:
            self._parser = cached_parser
        else:
            self._parser = Lark(grammar_text, ...)
            self._parser_cache.set(cache_key, self._parser)
    
    def parse(self, text: str, optimize: str = "auto") -> ASTNode:
        """
        Parse text to AST with automatic optimization.
        
        Args:
            text: Input text to parse
            optimize: Optimization mode:
                - "auto" (default): Automatic based on AST size
                - "none": No optimization
                - "basic", "medium", "large", "ultra": Manual selection
        
        Returns:
            OptimizedAST or basic ASTNode
        """
        # Parse to basic AST
        tree = self._parser.parse(text)
        ast = self._tree_to_ast(tree)
        
        # Apply optimization if requested
        if optimize != "none":
            optimizer = ASTOptimizer()
            return optimizer.optimize(ast, mode=optimize)
        
        return ast
```

---

## Phase 3: Grammar Implementation (31 Formats)

### 3.1 Grammar File Pairs

Each format requires TWO grammar files:
1. **Input grammar** (`.in.grammar`) - Parsing rules (text → AST)
2. **Output grammar** (`.out.grammar`) - Generation templates (AST → text)

**Total files:** 31 formats × 2 = 62 grammar files

### 3.2 Grammar Groups

#### Group A: Query Languages (8 formats)

| # | Format | Description | Priority | Lines Estimate |
|---|--------|-------------|----------|----------------|
| 1 | **GraphQL** | Query, Mutation, Subscription | High | 300-400 |
| 2 | **Cypher** | Neo4j graph queries | High | 250-350 |
| 3 | **MongoDB** | Aggregation pipelines | High | 200-300 |
| 4 | **XPath** | XML path expressions | Medium | 150-200 |
| 5 | **SPARQL** | RDF queries | Medium | 200-250 |
| 6 | **Gremlin** | Graph traversals | Medium | 250-300 |
| 7 | **N1QL** | Couchbase queries | Low | 200-250 |
| 8 | **PartiQL** | SQL on nested data | Low | 250-300 |

**Total for Group A:** ~3,200 lines

#### Group B: Data Formats (6 formats)

| # | Format | Description | Priority | Lines Estimate |
|---|--------|-------------|----------|----------------|
| 9 | **YAML** | Data serialization | High | 150-200 |
| 10 | **TOML** | Configuration files | High | 100-150 |
| 11 | **XML** | Markup language | High | 200-250 |
| 12 | **CSV** | Comma-separated values | Medium | 50-80 |
| 13 | **INI** | Configuration files | Low | 40-60 |
| 14 | **Properties** | Java properties | Low | 40-60 |

**Total for Group B:** ~1,100 lines

#### Group C: Programming Languages (8 formats)

| # | Format | Description | Priority | Lines Estimate |
|---|--------|-------------|----------|----------------|
| 15 | **JavaScript** | ES6+ syntax | High | 400-500 |
| 16 | **TypeScript** | Typed JavaScript | High | 450-550 |
| 17 | **Go** | Google's language | Medium | 300-400 |
| 18 | **Rust** | Systems programming | Medium | 400-500 |
| 19 | **Java** | JVM language | Medium | 400-500 |
| 20 | **C++** | Systems programming | Low | 500-600 |
| 21 | **C#** | .NET language | Low | 400-500 |
| 22 | **Ruby** | Dynamic language | Low | 300-400 |

**Total for Group C:** ~6,400 lines

#### Group D: Specialized Formats (9 formats)

| # | Format | Description | Priority | Lines Estimate |
|---|--------|-------------|----------|----------------|
| 23 | **Protobuf** | Schema definition | High | 150-200 |
| 24 | **Thrift** | Apache Thrift IDL | Medium | 150-200 |
| 25 | **Avro Schema** | Avro schemas | Medium | 100-150 |
| 26 | **JSON Schema** | Validation schemas | High | 200-250 |
| 27 | **Regex** | Regular expressions | Medium | 100-150 |
| 28 | **Markdown** | Markup language | High | 200-250 |
| 29 | **HTML** | Hypertext markup | High | 300-350 |
| 30 | **CSS** | Stylesheets | Medium | 200-250 |
| 31 | **Dockerfile** | Container definitions | High | 100-150 |

**Total for Group D:** ~2,600 lines

### 3.3 Total Grammar Code

**Grand Total:** ~13,300 lines across 62 grammar files

### 3.4 Grammar Implementation Template

Each grammar follows this pattern:

#### Input Grammar Template

```lark
// {format}.in.grammar
// Parsing rules for {Format Name}

// Start rule
start: {root_element}

// Core rules
{root_element}: ...
{sub_element}: ...

// Terminals
STRING: /"[^"]*"/
NUMBER: /\d+(\.\d+)?/
IDENTIFIER: /[a-zA-Z_][a-zA-Z0-9_]*/

// Whitespace handling
%import common.WS
%ignore WS
```

#### Output Grammar Template

```
# {format}.out.grammar
# Generation templates for {Format Name}

# Formatting rules
@indent = 2
@pretty = true
@line_width = 80

# Root template
@{root_element} = {
  # Template content with {{placeholders}}
}

# Element templates
@{sub_element} = ...

# Filters
@filter:escape = escape special characters
```

### 3.5 Implementation Priority

**Phase 3A (Week 1-2):** Query Languages (8 grammars)
- GraphQL, Cypher, MongoDB, XPath, SPARQL, Gremlin, N1QL, PartiQL

**Phase 3B (Week 2-3):** Data Formats (6 grammars)
- YAML, TOML, XML, CSV, INI, Properties

**Phase 3C (Week 3-4):** Programming Languages (8 grammars)
- JavaScript, TypeScript, Go, Rust, Java, C++, C#, Ruby

**Phase 3D (Week 4-5):** Specialized Formats (9 grammars)
- Protobuf, Thrift, Avro, JSON Schema, Regex, Markdown, HTML, CSS, Dockerfile

---

## Phase 4: Binary Format Support

### 4.1 Binary Adapter Architecture

**Goal:** Enable binary formats to produce same AST structure as text equivalents.

**Example:** BSON binary → AST (same structure as JSON AST) → can convert to any format

### 4.2 Adapter Base Class

**File:** `binary/base.py`

```python
from abc import ABC, abstractmethod
from typing import Any
from ..syntax_tree import ASTNode

class ABinaryAdapter(ABC):
    """
    Abstract base for binary format adapters.
    
    Adapters convert binary formats to/from AST structures
    that match their text equivalents.
    """
    
    @abstractmethod
    def parse(self, binary_data: bytes) -> ASTNode:
        """
        Parse binary data to AST.
        
        Args:
            binary_data: Raw binary bytes
        
        Returns:
            ASTNode with same structure as text equivalent
        """
        pass
    
    @abstractmethod
    def generate(self, ast: ASTNode) -> bytes:
        """
        Generate binary data from AST.
        
        Args:
            ast: AST node (same structure as text format)
        
        Returns:
            Binary bytes in target format
        """
        pass
    
    @abstractmethod
    def get_text_equivalent(self) -> str:
        """
        Get name of equivalent text format.
        
        Returns:
            Format name (e.g., "json" for BSON)
        """
        pass
```

### 4.3 Adapter Implementations

#### BSON Adapter

**File:** `binary/bson_adapter.py`

```python
import bson
from exonware.xwnode import XWNode, NodeMode
from .base import ABinaryAdapter
from ..syntax_tree import ASTNode

class BSONAdapter(ABinaryAdapter):
    """
    BSON (Binary JSON) adapter.
    
    Produces same AST structure as JSON grammar.
    Enables: BSON → AST → JSON/SQL/Python/etc.
    """
    
    def parse(self, binary_data: bytes) -> ASTNode:
        """Parse BSON to AST (JSON-equivalent structure)"""
        # Decode BSON to Python object
        obj = bson.loads(binary_data)
        
        # Convert to AST using xwnode for optimization
        ast = self._to_ast(obj)
        
        return ast
    
    def generate(self, ast: ASTNode) -> bytes:
        """Generate BSON from AST"""
        # Convert AST back to Python object
        obj = self._from_ast(ast)
        
        # Encode to BSON
        return bson.dumps(obj)
    
    def get_text_equivalent(self) -> str:
        return "json"
    
    def _to_ast(self, obj: Any) -> ASTNode:
        """Convert Python object to AST"""
        if isinstance(obj, dict):
            return ASTNode(
                type="object",
                children=[
                    ASTNode(
                        type="pair",
                        children=[
                            ASTNode(type="string", value=k),
                            self._to_ast(v)
                        ]
                    )
                    for k, v in obj.items()
                ]
            )
        elif isinstance(obj, list):
            return ASTNode(
                type="array",
                children=[self._to_ast(item) for item in obj]
            )
        elif isinstance(obj, str):
            return ASTNode(type="string", value=obj)
        elif isinstance(obj, (int, float)):
            return ASTNode(type="number", value=obj)
        elif isinstance(obj, bool):
            return ASTNode(type="true" if obj else "false")
        elif obj is None:
            return ASTNode(type="null")
        else:
            # Handle BSON-specific types
            return self._handle_bson_type(obj)
    
    def _from_ast(self, ast: ASTNode) -> Any:
        """Convert AST to Python object"""
        if ast.type == "object":
            return {
                pair.children[0].value: self._from_ast(pair.children[1])
                for pair in ast.children
            }
        elif ast.type == "array":
            return [self._from_ast(child) for child in ast.children]
        elif ast.type == "string":
            return ast.value
        elif ast.type == "number":
            return ast.value
        elif ast.type == "true":
            return True
        elif ast.type == "false":
            return False
        elif ast.type == "null":
            return None
```

#### MessagePack Adapter

**File:** `binary/msgpack_adapter.py`

Similar structure to BSON adapter, using `msgpack` library.

#### CBOR Adapter

**File:** `binary/cbor_adapter.py`

Similar structure to BSON adapter, using `cbor2` library.

#### Protocol Buffers Adapter

**File:** `binary/protobuf_adapter.py`

More complex - requires schema definition first:

```python
class ProtobufAdapter(ABinaryAdapter):
    """
    Protocol Buffers binary adapter.
    
    Requires schema to parse binary data.
    """
    
    def __init__(self, schema: str):
        """
        Args:
            schema: .proto schema definition
        """
        self.schema = self._compile_schema(schema)
    
    def parse(self, binary_data: bytes) -> ASTNode:
        # Use schema to decode binary
        message = self.schema.parse(binary_data)
        return self._to_ast(message)
    
    def generate(self, ast: ASTNode) -> bytes:
        message = self._from_ast(ast)
        return message.SerializeToString()
```

#### Avro Adapter

**File:** `binary/avro_adapter.py`

Similar to Protobuf - requires Avro schema.

### 4.4 Binary Format Support Matrix

| Format | Adapter | Text Equivalent | Use Case |
|--------|---------|-----------------|----------|
| BSON | BSONAdapter | JSON | MongoDB storage |
| MessagePack | MsgPackAdapter | JSON | Compact serialization |
| CBOR | CBORAdapter | JSON | RFC 7049 standard |
| Protobuf | ProtobufAdapter | protobuf.grammar | gRPC, efficiency |
| Avro | AvroAdapter | avro.grammar | Hadoop ecosystem |

---

## Phase 5: IDE Features

### 5.1 Language Server Protocol (LSP)

**File:** `ide/lsp_server.py`

```python
from pygls.server import LanguageServer
from pygls.lsp.methods import (
    TEXT_DOCUMENT_COMPLETION,
    TEXT_DOCUMENT_HOVER,
    TEXT_DOCUMENT_DEFINITION,
    TEXT_DOCUMENT_REFERENCES,
    TEXT_DOCUMENT_DID_CHANGE,
    TEXT_DOCUMENT_DID_OPEN,
)
from pygls.lsp.types import (
    CompletionItem,
    CompletionList,
    Hover,
    Location,
    Position,
    Range,
)
from ..engine import SyntaxEngine

class XWSyntaxLanguageServer(LanguageServer):
    """
    LSP server for xwsyntax supporting 31 grammars.
    
    Features:
    - Real-time syntax validation
    - Auto-completion
    - Hover documentation
    - Go to definition
    - Find references
    - Error reporting with fixes
    """
    
    def __init__(self):
        super().__init__("xwsyntax-lsp", "v1.0.0")
        self.syntax_engine = SyntaxEngine()
        self.register_features()
    
    def register_features(self):
        """Register all LSP features"""
        
        @self.feature(TEXT_DOCUMENT_DID_OPEN)
        async def did_open(params):
            """Document opened - validate syntax"""
            await self.validate_document(params.text_document.uri)
        
        @self.feature(TEXT_DOCUMENT_DID_CHANGE)
        async def did_change(params):
            """Document changed - revalidate"""
            await self.validate_document(params.text_document.uri)
        
        @self.feature(TEXT_DOCUMENT_COMPLETION)
        async def completions(params):
            """Provide auto-completion"""
            return await self.get_completions(
                params.text_document.uri,
                params.position
            )
        
        @self.feature(TEXT_DOCUMENT_HOVER)
        async def hover(params):
            """Provide hover information"""
            return await self.get_hover_info(
                params.text_document.uri,
                params.position
            )
        
        @self.feature(TEXT_DOCUMENT_DEFINITION)
        async def definition(params):
            """Go to definition"""
            return await self.get_definition(
                params.text_document.uri,
                params.position
            )
        
        @self.feature(TEXT_DOCUMENT_REFERENCES)
        async def references(params):
            """Find references"""
            return await self.get_references(
                params.text_document.uri,
                params.position
            )
    
    async def validate_document(self, uri: str):
        """Validate document syntax"""
        document = self.workspace.get_document(uri)
        grammar_name = self._detect_grammar(uri)
        
        # Parse document
        try:
            ast = self.syntax_engine.parse(document.source, grammar_name)
            # Clear diagnostics on success
            self.publish_diagnostics(uri, [])
        except Exception as e:
            # Report error
            diagnostic = self._create_diagnostic(e)
            self.publish_diagnostics(uri, [diagnostic])
    
    async def get_completions(self, uri: str, position: Position):
        """Get auto-completion items"""
        document = self.workspace.get_document(uri)
        grammar_name = self._detect_grammar(uri)
        
        # Get context at cursor position
        line = document.lines[position.line]
        prefix = line[:position.character]
        
        # Generate completions based on grammar
        items = self._generate_completions(grammar_name, prefix)
        
        return CompletionList(is_incomplete=False, items=items)
```

**Usage:**
```bash
# Start LSP server
python -m exonware.xwsyntax.ide.lsp_server

# Configure in VS Code (settings.json):
{
  "xwsyntax.lsp.enable": true,
  "xwsyntax.lsp.server": "python -m exonware.xwsyntax.ide.lsp_server"
}
```

### 5.2 Monaco Editor Integration

**File:** `ide/monaco_languages.py`

```python
import json
from typing import Dict, List
from ..engine import SyntaxEngine
from ..monaco_exporter import MonacoExporter

class MonacoLanguageGenerator:
    """
    Generate Monaco Monarch language definitions for all grammars.
    
    Output: JSON files for Monaco editor integration.
    """
    
    def __init__(self):
        self.syntax_engine = SyntaxEngine()
        self.exporter = MonacoExporter()
    
    def export_all_languages(self, output_dir: str):
        """Export all 31 grammars to Monaco format"""
        for grammar_name in self.syntax_engine.list_grammars():
            self.export_language(grammar_name, output_dir)
    
    def export_language(self, grammar_name: str, output_dir: str):
        """Export single grammar to Monaco format"""
        grammar = self.syntax_engine.load_grammar(grammar_name)
        
        # Generate Monaco Monarch definition
        monarch_def = self.exporter.export_grammar_to_monaco(grammar)
        
        # Write to file
        output_path = f"{output_dir}/{grammar_name}.monarch.json"
        with open(output_path, 'w') as f:
            json.dump(monarch_def, f, indent=2)
        
        print(f"✓ Exported {grammar_name} -> {output_path}")
```

**Output Example (json.monarch.json):**
```json
{
  "displayName": "JSON",
  "mimeTypes": ["application/json"],
  "fileExtensions": [".json"],
  "tokenizer": {
    "root": [
      ["{", "delimiter.curly"],
      ["}", "delimiter.curly"],
      ["[", "delimiter.square"],
      ["]", "delimiter.square"],
      [":", "delimiter.colon"],
      [",", "delimiter.comma"],
      ["\"([^\"\\\\]|\\\\.)*\"", "string"],
      ["[+-]?\\d+\\.\\d+([eE][+-]?\\d+)?", "number.float"],
      ["[+-]?\\d+", "number"],
      ["true|false", "keyword"],
      ["null", "keyword"]
    ]
  }
}
```

### 5.3 Tree-sitter Integration

**File:** `ide/tree_sitter_gen.py`

```python
from tree_sitter import Language, Parser
from ..engine import SyntaxEngine

class TreeSitterGenerator:
    """
    Generate tree-sitter grammars from Lark grammars.
    
    Tree-sitter provides:
    - Incremental parsing (only reparse changed sections)
    - Error recovery (partial AST from invalid syntax)
    - High performance (C implementation)
    """
    
    def generate_tree_sitter_grammar(self, lark_grammar: str) -> str:
        """Convert Lark grammar to tree-sitter format"""
        # Parse Lark grammar
        rules = self._parse_lark_grammar(lark_grammar)
        
        # Convert to tree-sitter format
        ts_grammar = self._convert_to_tree_sitter(rules)
        
        return ts_grammar
    
    def _convert_to_tree_sitter(self, rules: dict) -> str:
        """Convert parsed rules to tree-sitter grammar.js format"""
        output = "module.exports = grammar({\n"
        output += "  name: 'xwsyntax',\n"
        output += "  rules: {\n"
        
        for rule_name, rule_def in rules.items():
            output += f"    {rule_name}: $ => {rule_def},\n"
        
        output += "  }\n"
        output += "});\n"
        
        return output
```

---

## Phase 6: Performance Optimizations

### 6.1 Performance Targets

| AST Size | Parse Target | Generate Target | Roundtrip Target |
|----------|--------------|-----------------|------------------|
| Small (<100 nodes) | <1ms | <1ms | <2ms |
| Medium (100-1K nodes) | <10ms | <10ms | <20ms |
| Large (1K-10K nodes) | <100ms | <100ms | <200ms |
| Ultra (>10K nodes) | <1s | <1s | <2s |

### 6.2 Optimization Techniques

#### 6.2.1 Template Compilation

```python
class CompiledTemplate:
    """
    Pre-compile output templates for fast generation.
    
    Instead of parsing template on every generation,
    compile once and reuse.
    """
    
    def __init__(self, template: str):
        self.tokens = self._tokenize(template)
        self.placeholders = self._extract_placeholders(template)
    
    def render(self, context: dict) -> str:
        """Fast rendering using pre-compiled tokens"""
        output = []
        for token in self.tokens:
            if token.type == "literal":
                output.append(token.value)
            elif token.type == "placeholder":
                output.append(context[token.value])
        return ''.join(output)
```

#### 6.2.2 Grammar Precompilation

```python
class PrecompiledGrammar:
    """
    Precompile Lark grammars to bytecode.
    
    Lark can serialize compiled parsers to disk,
    avoiding recompilation on every run.
    """
    
    @staticmethod
    def compile_grammar(grammar_path: str, output_path: str):
        """Compile grammar to bytecode"""
        with open(grammar_path) as f:
            grammar_text = f.read()
        
        parser = Lark(grammar_text, parser='lalr')
        
        # Serialize to disk
        with open(output_path, 'wb') as f:
            pickle.dump(parser, f)
    
    @staticmethod
    def load_compiled(compiled_path: str):
        """Load precompiled grammar"""
        with open(compiled_path, 'rb') as f:
            return pickle.load(f)
```

#### 6.2.3 Fast Path for Common Patterns

```python
class FastPathParser:
    """
    Detect common patterns and use optimized paths.
    
    Example: Simple JSON objects can skip full parse.
    """
    
    def parse(self, text: str, grammar: str):
        # Try fast path for simple cases
        if grammar == "json":
            if self._is_simple_json(text):
                return self._fast_parse_json(text)
        
        # Fall back to full parse
        return self.full_parse(text, grammar)
    
    def _is_simple_json(self, text: str) -> bool:
        """Check if JSON is simple enough for fast path"""
        # No nested objects, small size, etc.
        return len(text) < 1000 and text.count('{') < 5
```

### 6.3 Benchmark Suite

**File:** `benchmarks/benchmark_parsing.py`

```python
import time
import statistics
from exonware.xwsyntax import SyntaxEngine

def benchmark_parse_speed():
    """Benchmark parsing speed for all formats"""
    engine = SyntaxEngine()
    
    test_cases = {
        'json': '{"key": "value", "nested": {"array": [1, 2, 3]}}',
        'sql': 'SELECT id, name FROM users WHERE age > 25',
        'python': 'def hello(name):\n    return f"Hello, {name}!"',
        # ... more test cases for all 31 formats
    }
    
    results = {}
    
    for format_name, test_input in test_cases.items():
        times = []
        
        # Warm-up
        for _ in range(10):
            engine.parse(test_input, format_name)
        
        # Actual benchmark
        for _ in range(1000):
            start = time.perf_counter()
            engine.parse(test_input, format_name)
            end = time.perf_counter()
            times.append((end - start) * 1000)  # Convert to ms
        
        results[format_name] = {
            'min': min(times),
            'max': max(times),
            'avg': statistics.mean(times),
            'median': statistics.median(times),
            'stdev': statistics.stdev(times),
        }
    
    return results
```

---

## Phase 7: Testing Infrastructure

### 7.1 Test Categories

1. **Unit Tests** - Individual components (90%+ coverage target)
2. **Integration Tests** - Component interactions
3. **Roundtrip Tests** - Parse → Generate → Parse validation
4. **Performance Tests** - Benchmark regression detection
5. **Fuzzing Tests** - Random input validation

### 7.2 Test Structure

```
tests/
├── unit/
│   ├── test_parser.py           # Grammar parsing
│   ├── test_unparser.py          # Template generation
│   ├── test_bidirectional.py    # Roundtrip tests
│   ├── test_optimization.py     # xwnode integration
│   ├── test_binary_adapters.py  # Binary format tests
│   ├── test_type_index.py       # Trie indexing
│   ├── test_position_index.py   # IntervalTree indexing
│   └── test_cache.py             # LRU cache
├── integration/
│   ├── test_roundtrip_all_formats.py  # All 31 formats
│   ├── test_xwnode_integration.py     # xwnode strategies
│   ├── test_format_conversion.py      # Cross-format
│   └── test_lsp_server.py             # LSP features
├── performance/
│   ├── test_benchmarks.py        # Performance regression
│   ├── test_optimization_impact.py
│   └── test_scalability.py
├── fuzzing/
│   └── test_random_inputs.py     # Fuzz testing
└── runner.py                     # Test runner
```

### 7.3 Roundtrip Test Example

```python
import pytest
from exonware.xwsyntax import BidirectionalGrammar

class TestRoundtrip:
    """Test roundtrip for all 31 formats"""
    
    @pytest.mark.parametrize("format_name", [
        "json", "sql", "python", "graphql", "cypher",
        "mongodb", "xpath", "sparql", "yaml", "toml",
        # ... all 31 formats
    ])
    def test_roundtrip(self, format_name):
        """
        Test: parse → generate → parse produces same AST
        """
        grammar = BidirectionalGrammar.load(format_name)
        
        # Get test input for this format
        test_input = self.get_test_input(format_name)
        
        # Parse to AST
        ast1 = grammar.parse(test_input)
        
        # Generate back to text
        output = grammar.generate(ast1)
        
        # Re-parse
        ast2 = grammar.parse(output)
        
        # ASTs should be equivalent
        assert self.asts_equal(ast1, ast2), \
            f"Roundtrip failed for {format_name}"
    
    def asts_equal(self, ast1, ast2, ignore_whitespace=True):
        """Compare ASTs for equality"""
        if ast1.type != ast2.type:
            return False
        if ast1.value != ast2.value:
            return False
        if len(ast1.children) != len(ast2.children):
            return False
        
        for c1, c2 in zip(ast1.children, ast2.children):
            if not self.asts_equal(c1, c2, ignore_whitespace):
                return False
        
        return True
```

---

## Phase 8: Documentation

### 8.1 Core Documentation Files

1. **README.md** - Quick start and overview
2. **ARCHITECTURE.md** - System design and components
3. **GRAMMARS.md** - All 31 grammar specifications
4. **OPTIMIZATION.md** - xwnode integration guide
5. **BINARY_FORMATS.md** - Binary adapter usage
6. **IDE_INTEGRATION.md** - LSP and editor setup
7. **API_REFERENCE.md** - Complete API documentation
8. **MIGRATION_GUIDE.md** - From xwsystem.syntax
9. **CONTRIBUTING.md** - Development guidelines
10. **CHANGELOG.md** - Version history

### 8.2 README.md Structure

```markdown
# xwsyntax - Universal Grammar Engine

Parse and generate code for 31+ formats with one unified API.

## Features

- 🎯 31 grammar formats (queries, data, programming, specialized)
- ↔️ Bidirectional (parse AND generate from grammars)
- ⚡ Automatic optimization (xwnode-powered)
- 🔧 Binary format support (BSON, MessagePack, CBOR, etc.)
- 💻 IDE integration (LSP, Monaco, tree-sitter)
- 🚀 High performance (<1ms for common cases)

## Installation

```bash
# Basic
pip install exonware-xwsyntax

# Full (recommended)
pip install exonware-xwsyntax[full]
```

## Quick Start

```python
from exonware.xwsyntax import BidirectionalGrammar

# Parse JSON
grammar = BidirectionalGrammar.load('json')
ast = grammar.parse('{"name": "Alice", "age": 30}')

# Generate back to JSON
json_str = grammar.generate(ast)

# Convert to SQL!
sql_grammar = BidirectionalGrammar.load('sql')
sql = sql_grammar.generate(ast)
```

## Supported Formats

### Query Languages (8)
GraphQL, Cypher, MongoDB, XPath, SPARQL, Gremlin, N1QL, PartiQL

### Data Formats (6)
JSON, YAML, TOML, XML, CSV, INI

### Programming Languages (8)
JavaScript, TypeScript, Python, Go, Rust, Java, C++, C#

### Specialized (9)
Protobuf, Markdown, HTML, CSS, Regex, and more

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [All Grammars](docs/GRAMMARS.md)
- [Optimization Guide](docs/OPTIMIZATION.md)
- [API Reference](docs/API_REFERENCE.md)

## License

MIT - eXonware.com
```

### 8.3 API Reference Structure

```markdown
# API Reference

## Core Classes

### SyntaxEngine

```python
class SyntaxEngine:
    """Main entry point for parsing"""
    
    def parse(text: str, grammar: str) -> ASTNode:
        """Parse text to AST"""
    
    def list_grammars() -> List[str]:
        """List available grammars"""
```

### BidirectionalGrammar

```python
class BidirectionalGrammar:
    """Bidirectional grammar (parse + generate)"""
    
    @staticmethod
    def load(format_name: str) -> BidirectionalGrammar:
        """Load grammar by name"""
    
    def parse(text: str) -> ASTNode:
        """Parse to AST"""
    
    def generate(ast: ASTNode) -> str:
        """Generate from AST"""
```

### ASTNode

```python
@dataclass
class ASTNode:
    """AST node"""
    type: str
    value: Any = None
    children: List['ASTNode'] = field(default_factory=list)
    metadata: Dict[str, Any] = field(default_factory=dict)
    
    def find_all(type: str) -> List['ASTNode']:
        """Find all nodes of type"""
    
    def find_first(type: str) -> Optional['ASTNode']:
        """Find first node of type"""
```

## Optimization

### OptimizedAST

```python
ast = grammar.parse(text, optimize="auto")

# Automatic optimization based on size:
# - < 100 nodes: No optimization
# - 100-1K nodes: Type index (Trie)
# - 1K-10K nodes: Type + position indexes
# - > 10K nodes: Full optimization

# Fast queries
nodes = ast.find_by_type("string")  # O(k) with Trie
nodes = ast.find_in_range(100, 200)  # O(log n) with IntervalTree
```

## Binary Formats

```python
from exonware.xwsyntax.binary import BSONAdapter

adapter = BSONAdapter()
ast = adapter.parse(bson_bytes)  # BSON -> AST
json_str = json_grammar.generate(ast)  # AST -> JSON
```
```

---

## Phase 9: Migration & Integration

### 9.1 Update xwsystem

**Remove syntax module:**
```bash
rm -rf xwsystem/src/exonware/xwsystem/syntax/
```

**Update pyproject.toml:**
```toml
[project.optional-dependencies]
syntax = [
    "exonware-xwsyntax>=1.0.0",  # Optional: use standalone package
]
```

**Update __init__.py (add deprecation notice):**
```python
# exonware/xwsystem/__init__.py

def __getattr__(name):
    if name == "syntax":
        import warnings
        warnings.warn(
            "xwsystem.syntax has been moved to standalone package 'exonware-xwsyntax'. "
            "Please update imports: from exonware.xwsyntax import ...",
            DeprecationWarning,
            stacklevel=2
        )
        try:
            import exonware.xwsyntax
            return exonware.xwsyntax
        except ImportError:
            raise ImportError(
                "exonware-xwsyntax not installed. "
                "Install with: pip install exonware-xwsyntax"
            )
    raise AttributeError(f"module 'exonware.xwsystem' has no attribute '{name}'")
```

### 9.2 Update xwquery

**Update pyproject.toml:**
```toml
[project]
dependencies = [
    "exonware-xwsyntax>=1.0.0",  # NEW: Direct dependency
    "exonware-xwnode>=1.0.0",
]
```

**Update imports throughout codebase:**
```bash
# Find all imports
grep -r "from exonware.xwsystem.syntax" xwquery/src/

# Replace with
from exonware.xwsyntax import ...
```

**Files to update:**
- `xwquery/src/exonware/xwquery/query/adapters/syntax_adapter.py`
- `xwquery/src/exonware/xwquery/query/adapters/ast_utils.py`
- Any other files importing from xwsystem.syntax

### 9.3 Create Migration Guide

**File:** `xwsyntax/docs/MIGRATION_GUIDE.md`

```markdown
# Migration Guide: xwsystem.syntax → xwsyntax

## Overview

The syntax module has been extracted from xwsystem into a standalone
package for better modularity and reusability.

## Installation

```bash
# Old (bundled with xwsystem)
pip install exonware-xwsystem[full]

# New (standalone)
pip install exonware-xwsyntax
```

## Import Changes

### Basic Imports

```python
# Old
from exonware.xwsystem.syntax import SyntaxEngine, ASTNode

# New
from exonware.xwsyntax import SyntaxEngine, ASTNode
```

### Bidirectional Grammars

```python
# Old
from exonware.xwsystem.syntax import BidirectionalGrammar

# New
from exonware.xwsyntax import BidirectionalGrammar
```

### Monaco Exporter

```python
# Old
from exonware.xwsystem.syntax import MonacoExporter

# New
from exonware.xwsyntax import MonacoExporter
```

## API Changes

### No Breaking Changes

The API remains identical. All existing code should work
with just import path updates.

### New Features

1. **Automatic Optimization**
   ```python
   ast = grammar.parse(text, optimize="auto")
   ```

2. **Binary Format Support**
   ```python
   from exonware.xwsyntax.binary import BSONAdapter
   adapter = BSONAdapter()
   ast = adapter.parse(bson_bytes)
   ```

3. **IDE Features**
   ```python
   from exonware.xwsyntax.ide import XWSyntaxLanguageServer
   ```

## Migration Checklist

- [ ] Update dependencies in pyproject.toml
- [ ] Replace import statements
- [ ] Test all parsing functionality
- [ ] Consider enabling optimization features
- [ ] Update documentation references

## Backward Compatibility

xwsystem provides a compatibility shim for deprecated imports:

```python
# This will work but show deprecation warning
from exonware.xwsystem.syntax import SyntaxEngine
```

Warning message:
```
DeprecationWarning: xwsystem.syntax has been moved to 
standalone package 'exonware-xwsyntax'. Please update imports.
```

## Questions?

- Documentation: https://github.com/exonware/xwsyntax
- Issues: https://github.com/exonware/xwsyntax/issues
```

---

## Phase 10: Release & Publishing

### 10.1 Pre-Release Checklist

- [ ] All 31 grammars implemented with roundtrip tests
- [ ] xwnode optimization working (auto-selection)
- [ ] Binary adapters functional (5+ formats)
- [ ] IDE features operational (LSP, Monaco)
- [ ] Performance benchmarks meet targets
- [ ] Test suite passing (90%+ coverage)
- [ ] Documentation complete (all 10 docs)
- [ ] Examples working (all 5 examples)
- [ ] xwquery successfully migrated
- [ ] xwsystem updated with deprecation notices

### 10.2 Version Numbering

**Version:** 1.0.0

**Semantic Versioning:**
- MAJOR (1): Breaking API changes
- MINOR (0): New features, backward compatible
- PATCH (0): Bug fixes

**Future versions:**
- 1.0.1 - Bug fixes
- 1.1.0 - New grammars added
- 2.0.0 - Breaking API changes

### 10.3 CHANGELOG.md

```markdown
# Changelog

All notable changes to xwsyntax will be documented in this file.

## [1.0.0] - 2025-11-XX

### Added
- Initial release as standalone package
- 31 grammar formats with bidirectional support
- Automatic xwnode optimization
- Binary format adapters (BSON, MessagePack, CBOR, Protobuf, Avro)
- IDE features (LSP server, Monaco integration, tree-sitter)
- Comprehensive test suite (90%+ coverage)
- Complete documentation (10 docs)

### Migrated from xwsystem.syntax
- All core parsing functionality
- Grammar engine
- Bidirectional grammar system
- Monaco exporter
- 3 existing grammars (JSON, SQL, Python)

### Performance
- <1ms for small ASTs (<100 nodes)
- <10ms for medium ASTs (100-1K nodes)
- <100ms for large ASTs (1K-10K nodes)
- Automatic optimization based on AST size
```

### 10.4 Build & Publish

```bash
# 1. Clean build artifacts
rm -rf dist/ build/ *.egg-info

# 2. Build distributions
python -m build

# 3. Verify distributions
twine check dist/*

# 4. Test on TestPyPI first
twine upload --repository testpypi dist/*

# 5. Test installation from TestPyPI
pip install --index-url https://test.pypi.org/simple/ exonware-xwsyntax

# 6. Publish to PyPI
twine upload dist/*

# 7. Verify on PyPI
pip install exonware-xwsyntax
```

### 10.5 Release Announcement

**Title:** "xwsyntax 1.0.0: Universal Grammar Engine for Python"

**Content:**

> We're excited to announce xwsyntax 1.0.0, a comprehensive grammar engine
> that provides parsing and generation for 31+ formats through one unified API.
>
> **What makes xwsyntax unique:**
> - Bidirectional grammars (parse AND generate)
> - Automatic performance optimization using xwnode strategies
> - Binary format support (BSON, MessagePack, CBOR, etc.)
> - IDE integration (LSP, Monaco, tree-sitter)
> - Universal AST enables cross-format conversion
>
> **Install:**
> ```bash
> pip install exonware-xwsyntax[full]
> ```
>
> **Quick Example:**
> ```python
> from exonware.xwsyntax import BidirectionalGrammar
>
> # Parse JSON
> json_grammar = BidirectionalGrammar.load('json')
> ast = json_grammar.parse('{"name": "Alice"}')
>
> # Generate SQL
> sql_grammar = BidirectionalGrammar.load('sql')
> sql = sql_grammar.generate(ast)
> ```
>
> **Documentation:** https://github.com/exonware/xwsyntax
> 
> **Migration from xwsystem.syntax:** See MIGRATION_GUIDE.md

---

## Success Metrics & Timeline

### Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Grammar Coverage** | 31/31 formats | Roundtrip test pass rate |
| **Performance** | <1ms small ASTs | Benchmark suite |
| **Test Coverage** | 90%+ | pytest-cov |
| **Binary Support** | 5+ adapters | Functional tests |
| **IDE Features** | LSP + Monaco | Integration tests |
| **Documentation** | 10 complete docs | Review checklist |
| **Adoption** | xwquery migrated | Import success |

### Timeline Estimate

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| Phase 0: Documentation | 1 day | None |
| Phase 1: Extraction | 1-2 days | Phase 0 |
| Phase 2: xwnode Integration | 2-3 days | Phase 1 |
| Phase 3A: Query Grammars | 2-3 days | Phase 2 |
| Phase 3B: Data Grammars | 2-3 days | Phase 3A |
| Phase 3C: Programming Grammars | 3-4 days | Phase 3B |
| Phase 3D: Specialized Grammars | 3-4 days | Phase 3C |
| Phase 4: Binary Formats | 3-4 days | Phase 2 |
| Phase 5: IDE Features | 4-5 days | Phase 2 |
| Phase 6: Performance | 2-3 days | Phase 3D, 4 |
| Phase 7: Testing | 3-4 days | All phases (parallel) |
| Phase 8: Documentation | 3-4 days | All phases (parallel) |
| Phase 9: Migration | 2-3 days | Phase 8 |
| Phase 10: Release | 1-2 days | Phase 9 |

**Total Duration:** 4-6 weeks

**Critical Path:** Phase 0 → 1 → 2 → 3A → 3B → 3C → 3D → 6 → 7 → 8 → 9 → 10

**Parallel Work:**
- Phases 4, 5 can run parallel to Phase 3
- Phases 7, 8 can run parallel to later phases

### Milestones

**Week 1:**
- ✅ Documentation complete
- ✅ Package extracted
- ✅ xwnode integration working
- ✅ Query grammars (8) complete

**Week 2:**
- ✅ Data grammars (6) complete
- ✅ Binary adapters (5) functional

**Week 3:**
- ✅ Programming grammars (8) complete
- ✅ IDE features operational

**Week 4:**
- ✅ Specialized grammars (9) complete
- ✅ Performance benchmarks passing

**Week 5:**
- ✅ Test suite complete (90%+ coverage)
- ✅ Documentation finalized

**Week 6:**
- ✅ xwquery migrated
- ✅ Released to PyPI

---

## Competitive Advantages

### vs Existing Solutions

| Feature | xwsyntax | Lark | tree-sitter | orjson |
|---------|----------|------|-------------|--------|
| **Formats** | 31 | Custom | Custom | JSON only |
| **Bidirectional** | ✅ | ❌ | ❌ | ❌ |
| **Auto-optimization** | ✅ | ❌ | ❌ | N/A |
| **Binary support** | ✅ | ❌ | ❌ | ❌ |
| **Format conversion** | ✅ | ❌ | ❌ | ❌ |
| **IDE features** | ✅ | ❌ | ✅ | ❌ |
| **Performance** | Good | Good | Excellent | Excellent |

### Market Position

**xwsyntax is NOT:**
- A faster JSON parser than orjson
- A replacement for tree-sitter in editors
- A general-purpose parser generator

**xwsyntax IS:**
- Universal grammar system (31+ formats)
- Bidirectional (parse AND generate)
- Format converter (any → any)
- IDE-ready (LSP, Monaco, tree-sitter)
- Auto-optimizing (xwnode-powered)

**Use xwsyntax when:**
- You need multiple format support
- You want format conversion
- You're building code intelligence tools
- You need both parsing and generation

**Don't use xwsyntax when:**
- You only need one format
- Raw speed is the only metric
- You have a custom grammar to implement

---

## Appendix A: File Inventory

### Total Files to Create

| Category | Count | Lines (est.) |
|----------|-------|--------------|
| Python modules | 30 | 5,000 |
| Grammar files | 62 | 13,300 |
| Test files | 15 | 3,000 |
| Benchmark files | 5 | 1,000 |
| Documentation | 10 | 5,000 |
| Examples | 6 | 800 |
| Config files | 5 | 300 |
| **TOTAL** | **133** | **28,400** |

### Detailed Breakdown

**Core Package (30 files, ~5,000 lines):**
- __init__.py, version.py, base.py, engine.py
- syntax_tree.py, parser_cache.py
- output_grammar.py, unparser.py, bidirectional.py
- grammar_loader.py, monaco_exporter.py
- contracts.py, defs.py, errors.py
- optimizations/ (4 files)
- binary/ (6 files)
- ide/ (4 files)

**Grammars (62 files, ~13,300 lines):**
- 31 formats × 2 (input + output) = 62 files

**Tests (15 files, ~3,000 lines):**
- unit/ (8 files)
- integration/ (4 files)
- performance/ (2 files)
- runner.py

**Documentation (10 files, ~5,000 lines):**
- README.md, ARCHITECTURE.md, GRAMMARS.md
- OPTIMIZATION.md, BINARY_FORMATS.md
- IDE_INTEGRATION.md, API_REFERENCE.md
- MIGRATION_GUIDE.md, CONTRIBUTING.md
- CHANGELOG.md

---

## Appendix B: Dependencies

### Runtime Dependencies

```
exonware-xwnode>=1.0.0    # Data structure strategies
lark>=1.1.0               # Grammar parsing
```

### Optional Dependencies

```
# optimization
exonware-xwnode[full]>=1.0.0

# binary
msgpack>=1.0.0
cbor2>=5.0.0

# ide
pygls>=1.0.0
tree-sitter>=0.20.0
```

### Development Dependencies

```
pytest>=7.0.0
pytest-asyncio>=0.21.0
pytest-cov>=4.0.0
pytest-benchmark>=4.0.0
black>=23.0.0
isort>=5.12.0
mypy>=1.0.0
```

---

## Appendix C: Grammar Complexity

### Lines per Grammar Type

| Type | Avg Input | Avg Output | Total Avg |
|------|-----------|------------|-----------|
| Query | 250 | 150 | 400 |
| Data | 120 | 80 | 200 |
| Programming | 450 | 300 | 750 |
| Specialized | 180 | 110 | 290 |

### Most Complex Grammars

1. **C++** (~1,100 lines) - Templates, namespaces, preprocessing
2. **TypeScript** (~1,000 lines) - Type system, generics
3. **Rust** (~900 lines) - Ownership, traits, macros
4. **Java** (~900 lines) - Classes, interfaces, annotations
5. **JavaScript** (~900 lines) - ES6+ features

### Simplest Grammars

1. **CSV** (~130 lines) - Simple row/column structure
2. **INI** (~100 lines) - Sections and key-values
3. **Properties** (~100 lines) - Key-value pairs
4. **JSON** (~54 lines) - Already implemented
5. **TOML** (~250 lines) - Tables and arrays

---

## Appendix D: Performance Benchmarks

### Expected Performance (Based on JSON Implementation)

| AST Size | Parse (ms) | Generate (ms) | Roundtrip (ms) |
|----------|------------|---------------|----------------|
| 10 nodes | 0.1 | 0.1 | 0.2 |
| 100 nodes | 0.6 | 0.5 | 1.1 |
| 1,000 nodes | 6.0 | 5.0 | 11.0 |
| 10,000 nodes | 60.0 | 50.0 | 110.0 |

### Optimization Impact

| AST Size | No Opt | Type Index | Position Index | Full Opt |
|----------|--------|------------|----------------|----------|
| 100 | 0.6ms | 0.6ms (+0%) | N/A | 0.6ms |
| 1,000 | 60ms | 10ms (-83%) | 12ms (-80%) | 10ms |
| 10,000 | 6s | 100ms (-98%) | 120ms (-98%) | 100ms |

---

## Contact & Support

**Company:** eXonware.com  
**Author:** Eng. Muhammad AlShehri  
**Email:** connect@exonware.com  
**Repository:** https://github.com/exonware/xwsyntax  
**Documentation:** https://github.com/exonware/xwsyntax#readme  
**Issues:** https://github.com/exonware/xwsyntax/issues

---

**End of Plan** - Ready for Implementation ✓


# XWQuery Architecture Guide

**Company:** eXonware.com  
**Author:** Eng. Muhammad AlShehri  
**Email:** connect@exonware.com  
**Version:** 0.0.1.5  
**Date:** October 26, 2025

---

## Overview

xwquery follows a clean, layered architecture aligned with xwnode patterns. This document describes the architectural structure and design patterns used.

---

## Directory Structure

```
src/exonware/xwquery/
├── Root-Level Files (Shared Components)
│   ├── __init__.py          # Public API (80+ exports)
│   ├── version.py           # Version management
│   ├── config.py            # Configuration management
│   ├── defs.py              # Type definitions & enums
│   ├── contracts.py         # Interfaces & data structures
│   ├── base.py              # Abstract base classes
│   ├── facade.py            # Enhanced API facade
│   └── errors.py            # Error hierarchy
│
├── common/                   # Shared Utilities
│   ├── monitoring/          # Metrics & performance
│   ├── patterns/            # Design patterns
│   └── utils/               # Helper functions
│
├── executors/                # Query Operation Executors
│   ├── base.py              # Executor base classes
│   ├── contracts.py         # Executor interfaces (re-exports root)
│   ├── defs.py              # Executor types (re-exports root)
│   ├── errors.py            # Executor errors (extends root)
│   ├── engine.py            # Execution engine
│   ├── registry.py          # Executor registry
│   ├── capability_checker.py # Capability validation
│   ├── core/                # Core operations (SELECT, INSERT, etc.)
│   ├── filtering/           # Filter operations (WHERE, LIKE, etc.)
│   ├── aggregation/         # Aggregation operations (SUM, AVG, etc.)
│   ├── graph/               # Graph operations (MATCH, PATH, etc.)
│   ├── ordering/            # Ordering operations (ORDER BY, etc.)
│   ├── projection/          # Projection operations (PROJECT, EXTEND)
│   ├── advanced/            # Advanced operations (JOIN, WINDOW, etc.)
│   ├── array/               # Array operations (SLICING, INDEXING)
│   └── data/                # Data operations (LOAD, STORE, etc.)
│
├── parsers/                  # Query Parsers
│   ├── base.py              # Parser base classes (re-exports root)
│   ├── contracts.py         # Parser interfaces (re-exports root)
│   ├── errors.py            # Parser errors (extends root)
│   └── sql_param_extractor.py # SQL parameter extraction
│
└── strategies/               # Format Conversion Strategies
    ├── base.py              # Strategy base classes (re-exports root)
    ├── xwquery.py           # XWQuery script strategy
    ├── sql.py               # SQL format
    ├── graphql.py           # GraphQL format
    ├── cypher.py            # Cypher format
    ├── sparql.py            # SPARQL format
    └── [30+ more formats]   # All 35+ format strategies
```

---

## Architectural Layers

### Layer 1: Public API (Root __init__.py)
**Purpose:** Single entry point for all xwquery functionality

**Exports:**
- Main classes: `XWQuery`, `XWQueryFacade`
- Configuration: `get_config()`, `set_config()`, `XWQueryConfig`
- Convenience functions: `execute()`, `parse()`, `convert()`, `quick_select()`, etc.
- Type definitions: Enums, operation lists
- Error classes: Complete error hierarchy

### Layer 2: Root-Level Modules
**Purpose:** Shared types, interfaces, and utilities

**Files:**
- `config.py` - Configuration management
- `defs.py` - Type definitions and enums
- `contracts.py` - Interfaces and data structures
- `base.py` - Abstract base classes
- `facade.py` - Enhanced facade with convenience methods
- `errors.py` - Error hierarchy

### Layer 3: Subsystem Modules
**Purpose:** Specific implementations (executors, parsers, strategies)

**Pattern:** Each subsystem has:
- `base.py` - Module-specific base classes (imports from root)
- `contracts.py` - Module-specific interfaces (imports from root)
- `defs.py` - Module-specific types (imports from root)
- `errors.py` - Module-specific errors (extends root)
- Implementation files organized by category

### Layer 4: Common Utilities
**Purpose:** Shared utilities across all modules

**Structure:**
- `monitoring/` - Metrics and performance
- `patterns/` - Design patterns
- `utils/` - Helper functions

---

## Design Patterns Used

### 1. Facade Pattern
**Location:** `facade.py`, `XWQuery` class

**Purpose:** Provide simple interface hiding internal complexity

**Example:**
```python
class XWQuery:
    @staticmethod
    def execute(query, data, **kwargs):
        # Hides complexity of parsing, validation, execution
        pass
```

### 2. Registry Pattern
**Location:** `executors/registry.py`

**Purpose:** Manage operation executor registration and lookup

**Example:**
```python
registry = get_operation_registry()
registry.register("SELECT", SelectExecutor)
executor = registry.get("SELECT")
```

### 3. Strategy Pattern
**Location:** `strategies/` directory

**Purpose:** Interchangeable format conversion algorithms

**Example:**
```python
class SQLStrategy(AQueryStrategy):
    def to_actions_tree(self, query): ...
    def from_actions_tree(self, tree): ...
```

### 4. Template Method Pattern
**Location:** `base.py` - `AOperationExecutor`

**Purpose:** Define execution skeleton, defer details to subclasses

**Example:**
```python
class AOperationExecutor:
    def execute(self, action, context):
        self.validate(action, context)    # Template
        self.validate_capability_or_raise(context)
        return self._do_execute(action, context)  # Deferred to subclass
```

### 5. Singleton Pattern
**Location:** `config.py`, `registry.py`

**Purpose:** Ensure single instance for global state

**Example:**
```python
_config = None
def get_config():
    global _config
    with _config_lock:
        if _config is None:
            _config = XWQueryConfig.from_env()
    return _config
```

---

## Import Hierarchy

### Root-Level Imports
```python
# Always import shared types from root
from ..defs import QueryMode, OperationType
from ..contracts import Action, ExecutionContext
from ..errors import XWQueryError
from ..base import AOperationExecutor
from ..config import get_config
```

### Module-Level Imports
```python
# Module-level files re-export root imports
# executors/defs.py
from ..defs import QueryMode, OperationType  # Import from root
__all__ = ['QueryMode', 'OperationType']     # Re-export for convenience
```

### External Dependencies
```python
# xwsystem (required dependency)
from exonware.xwsystem import get_logger
from exonware.xwsystem.monitoring import get_metrics

# xwnode (required dependency)
from exonware.xwnode import XWNode
from exonware.xwnode.nodes.strategies.contracts import NodeType
```

---

## Data Flow

### Query Execution Flow
```
User Query String
    ↓
[XWQuery.execute()] ← Public API
    ↓
[ExecutionEngine.execute()] ← Orchestration
    ↓
[XWQueryScriptStrategy.parse_script()] ← Parsing
    ↓
[Actions Tree] ← Intermediate Representation
    ↓
[ExecutionEngine.execute_actions_tree()] ← Execution
    ↓
[OperationRegistry.get()] ← Executor Lookup
    ↓
[Specific Executor.execute()] ← Operation Execution
    ↓
[ExecutionResult] ← Result
```

### Format Conversion Flow
```
Source Query (e.g., SQL)
    ↓
[XWQuery.convert()] ← Public API
    ↓
[Source Strategy.to_actions_tree()] ← Parse to tree
    ↓
[Actions Tree] ← Universal format
    ↓
[Target Strategy.from_actions_tree()] ← Generate target
    ↓
Target Query (e.g., GraphQL)
```

---

## Configuration Management

### Configuration Structure
```python
@dataclass
class XWQueryConfig:
    # Query execution
    max_query_depth: int = 50
    query_timeout_seconds: float = 30.0
    enable_query_caching: bool = True
    
    # Performance
    enable_optimization: bool = True
    enable_parallel_execution: bool = False
    
    # Security
    max_result_size: int = 1_000_000
    enable_sql_injection_protection: bool = True
    
    # Monitoring
    enable_metrics: bool = True
    log_slow_queries: bool = True
```

### Thread-Safe Access
```python
# Thread-safe singleton pattern
_config_lock = threading.Lock()
_config: Optional[XWQueryConfig] = None

def get_config():
    global _config
    if _config is not None:
        return _config
    with _config_lock:
        if _config is None:
            _config = XWQueryConfig.from_env()
    return _config
```

---

## Error Hierarchy

```
XWQueryError (base)
├── XWQueryValueError
├── XWQueryTypeError
├── XWQueryParseError
├── XWQueryExecutionError
├── XWQueryTimeoutError
├── XWQuerySecurityError
│   └── XWQueryLimitError
├── XWQueryFormatError
├── UnsupportedOperationError
├── UnsupportedFormatError
└── XWQueryOptimizationError
```

### Error Features
- **Rich context** - Error details in structured format
- **Suggestions** - Actionable advice for fixing
- **Chainable** - Fluent error building
- **Performance optimized** - Uses __slots__

---

## Testing Strategy

### Test Organization (Future)
```
tests/
├── 0.core/          # Core functionality (20% for 80% value)
├── 1.unit/          # Unit tests (mirrors src/ structure)
├── 2.integration/   # Integration tests
└── 3.advance/       # Production excellence tests
```

### Current Tests
- `tests/core/test_xwquery_basic.py` - Basic functionality tests
- Success rate: 90% (9/10 passing)

---

## Extension Points

### Adding New Operations
1. Create executor in `executors/<category>/`
2. Extend appropriate base class
3. Implement `_do_execute()` method
4. Register in `executors/__init__.py`

### Adding New Formats
1. Create strategy in `strategies/<format>.py`
2. Extend `AQueryStrategy`
3. Implement `to_actions_tree()` and `from_actions_tree()`
4. Export in `strategies/__init__.py`

### Adding Convenience Methods
1. Add to `XWQueryFacade` class in `facade.py`
2. Create module-level function wrapper
3. Export in root `__init__.py`

---

## Best Practices

### Import Guidelines
1. **Always import from root** for shared types
2. **Use module re-exports** for backward compatibility
3. **Import xwsystem** directly (required dependency)
4. **Import xwnode** for node types only

### Error Handling
1. **Use specific error types** (not generic Exception)
2. **Add context** to errors
3. **Provide suggestions** when possible
4. **Chain exceptions** with `cause` parameter

### Configuration
1. **Use get_config()** instead of hardcoded values
2. **Validate configuration** before use
3. **Support environment variables** for deployment
4. **Document all configuration options**

---

## Performance Considerations

### Caching
- Query cache: 1024 entries (configurable)
- Conversion cache: 512 entries (configurable)
- Thread-safe cache implementation

### Monitoring
- Metrics tracked via xwsystem
- Slow query logging
- Execution time tracking

### Optimization
- Lazy evaluation support (future)
- Parallel execution support (future)
- Query plan optimization (future)

---

## Security

### Input Validation
- SQL injection protection (configurable)
- Query depth limits
- Result size limits
- Filter complexity limits

### Resource Limits
- Maximum query depth: 50 (configurable)
- Maximum result size: 1,000,000 (configurable)
- Query timeout: 30 seconds (configurable)

---

## Backward Compatibility

All existing code continues to work:
```python
# Old code still works
from exonware.xwquery import XWQuery, execute, parse, convert

# New code has more options
from exonware.xwquery import (
    XWQuery, XWQueryFacade,
    get_config, quick_select, build_select,
    QueryMode, XWQueryError
)
```

Module-level files (executors/defs.py, etc.) re-export root definitions to maintain compatibility.

---

## Migration Guide

### From Old to New (Optional)

**Old Style:**
```python
from exonware.xwquery import XWQuery

result = XWQuery.execute(query, data)
```

**New Style (Enhanced):**
```python
from exonware.xwquery import quick_select, get_config

# Use convenience method
result = quick_select(data, "age > 25", ["name", "email"])

# Configure if needed
config = get_config()
print(f"Timeout: {config.query_timeout_seconds}s")
```

---

## References

- **xwnode Architecture** - Reference implementation
- **DEV_GUIDELINES.md** - Development standards (in xwnode/docs)
- **GUIDELINES_ARCHITECTURE_REFACTORING.md** - Refactoring guidelines (in xwnode/docs)

---

*This architecture ensures xwquery maintains the same high-quality standards as xwnode while remaining accessible and easy to use.*


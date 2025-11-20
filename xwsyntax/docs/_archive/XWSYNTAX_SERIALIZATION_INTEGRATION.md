# xwsyntax Serialization Integration

**Date:** October 29, 2025  
**Status:** ✅ Complete  
**Author:** Eng. Muhammad AlShehri  
**Email:** connect@exonware.com

## Overview

This document describes how `xwsyntax` now extends and reuses the `xwsystem.serialization` interface to provide grammar handling capabilities across 31+ formats without duplicating code.

## The Problem

Originally, `xwsyntax` had its own `grammar_loader.py` that attempted to import serializers from a non-existent local `..serialization` package. This created:

1. **Import errors** - The package didn't exist in xwsyntax
2. **Code duplication** - Would require reimplementing serialization logic
3. **Inconsistent API** - Different serialization patterns across packages
4. **Maintenance burden** - Two codebases doing the same thing

## The Solution: Interface Extension

We've implemented a **proper inheritance hierarchy** where syntax handlers extend the serialization interface:

```
ISerialization (xwsystem)
    ↓
ISyntaxHandler (xwsyntax) - adds grammar-specific methods
    ↓
ASyntaxHandler (xwsyntax) - concrete base implementation
```

### Key Changes

#### 1. Fixed Import in `grammar_loader.py`

**Before:**
```python
from ..serialization import (  # ❌ Doesn't exist
    JsonSerializer,
    ...
)
```

**After:**
```python
from exonware.xwsystem.serialization import (  # ✅ Reuses xwsystem
    JsonSerializer,
    PlistlibSerializer,
    XmlSerializer,
    YamlSerializer,
    TomlSerializer,
)
```

#### 2. Created `ISyntaxHandler` Interface

Location: `xwsyntax/src/exonware/xwsyntax/contracts.py`

```python
class ISyntaxHandler(ISerialization):
    """
    Syntax handler interface that extends ISerialization.
    
    Inherits all serialization methods:
    - dumps() / dumps_text() / dumps_binary()
    - loads() / loads_text() / loads_bytes()
    - save() / load() with file handling
    - validate_input() with security
    
    Adds grammar-specific methods:
    - parse_grammar()
    - validate_grammar()
    - get_grammar_format()
    - convert_to_lark()
    - load_grammar()
    - save_grammar()
    """
```

#### 3. Created `ASyntaxHandler` Base Class

Location: `xwsyntax/src/exonware/xwsyntax/base.py`

```python
class ASyntaxHandler(ASerialization):
    """
    Abstract base class for syntax handlers.
    
    Extends ASerialization to inherit:
    - All serialization capabilities
    - File I/O operations
    - Security and validation
    - Format detection
    
    Adds grammar-specific abstract methods that subclasses must implement.
    """
```

#### 4. Updated Exports

Location: `xwsyntax/src/exonware/xwsyntax/__init__.py`

```python
__all__ = [
    'AGrammar',
    'ASyntaxEngine',
    'ASyntaxHandler',      # ✅ New export
    'ISyntaxHandler',      # ✅ New export
    # ... rest of exports
]
```

## Architecture Benefits

### 1. **Code Reuse**
- Grammar loaders use proven serialization implementations
- No reimplementation of JSON/YAML/TOML/XML parsers
- Leverages existing security and validation

### 2. **Consistent API**
- Same interface across xwsystem and xwsyntax
- Familiar patterns for developers
- Easy to extend with new formats

### 3. **Type Safety**
- Clear inheritance hierarchy
- Interface contracts enforced
- Type hints throughout

### 4. **Format Support**
Out of the box support for:
- **Text formats:** JSON, YAML, TOML, XML, INI, CSV, etc.
- **Grammar formats:** Lark EBNF, TextMate JSON/PLIST
- **Binary formats:** BSON, MessagePack, CBOR (when installed)

### 5. **Security**
- Inherits xwsystem security features
- Safe deserialization with defusedxml
- Path validation and sandboxing
- Size limits and recursion protection

## Usage Examples

### Loading a Grammar (Any Format)

```python
from exonware.xwsyntax import SyntaxEngine

# Load JSON grammar
engine = SyntaxEngine()
grammar = engine.load_grammar('sql')  # Automatically uses JSON serializer

# Load YAML grammar
grammar = engine.load_grammar('graphql')  # Automatically uses YAML serializer

# Load Lark EBNF grammar
grammar = engine.load_grammar('python')  # Direct text loading
```

### Creating a Custom Syntax Handler

```python
from exonware.xwsyntax import ASyntaxHandler, AGrammar
from exonware.xwsyntax.defs import GrammarFormat

class CustomGrammarHandler(ASyntaxHandler):
    """Custom handler that extends ASyntaxHandler."""
    
    @property
    def format_name(self) -> str:
        return "CustomFormat"
    
    @property
    def file_extensions(self) -> list[str]:
        return [".custom", ".cg"]
    
    def parse_grammar(self, text: str, metadata=None) -> AGrammar:
        # Parse custom format using inherited serialization methods
        data = self.loads(text)  # From ASerialization
        # ... convert to Grammar object
        return grammar
    
    def validate_grammar(self, text: str) -> list[str]:
        errors = []
        # Validation logic
        return errors
    
    def get_grammar_format(self) -> GrammarFormat:
        return GrammarFormat.CUSTOM
    
    def convert_to_lark(self, grammar_data: Any) -> str:
        # Convert to Lark EBNF
        return lark_text
```

### Using Grammar Loader with Serialization

```python
from exonware.xwsyntax import get_grammar_loader

loader = get_grammar_loader()

# Load from any format - automatically detects and uses correct serializer
grammar_text, format_type, metadata = loader.load_grammar_file('grammar.json')
grammar_text, format_type, metadata = loader.load_grammar_file('grammar.yaml')
grammar_text, format_type, metadata = loader.load_grammar_file('grammar.toml')
grammar_text, format_type, metadata = loader.load_grammar_file('grammar.xml')
```

## Implementation Details

### Inheritance Chain

```
ISerialization (interface)
    ├── dumps(), loads(), save(), load()
    ├── validate_input(), is_text_format()
    └── ... all serialization methods

ISyntaxHandler (interface) extends ISerialization
    ├── Inherits: all ISerialization methods
    └── Adds: parse_grammar(), validate_grammar(), convert_to_lark()

ASerialization (base class)
    ├── Implements: ISerialization
    └── Provides: default implementations

ASyntaxHandler (base class) extends ASerialization
    ├── Inherits: all ASerialization implementations
    ├── Implements: ISyntaxHandler
    └── Provides: load_grammar(), save_grammar()
```

### Method Flow

When loading a grammar file:

1. **File Detection**: Extension determines format (`.json`, `.yaml`, etc.)
2. **Serializer Selection**: Appropriate serializer loaded from xwsystem
3. **Deserialization**: File parsed using official library (json, yaml, etc.)
4. **Grammar Conversion**: Data converted to Grammar object
5. **Validation**: Grammar validated using inherited validation methods

```python
file_path = "sql.json"
    ↓
MultiFormatGrammarLoader.load_grammar_file()
    ↓
JsonSerializer.load()  # From xwsystem.serialization
    ↓
json.loads()  # Official library
    ↓
convert_to_lark()  # Grammar-specific conversion
    ↓
Grammar object
```

## Design Principles Applied

### 1. **DRY (Don't Repeat Yourself)**
- Reuses existing serialization code
- No reimplementation of format parsers

### 2. **Single Responsibility**
- xwsystem handles serialization
- xwsyntax handles grammar logic
- Clear separation of concerns

### 3. **Open/Closed Principle**
- Open for extension (new grammar formats)
- Closed for modification (uses stable serialization)

### 4. **Liskov Substitution**
- ASyntaxHandler can be used anywhere ASerialization is expected
- Adds functionality without breaking contracts

### 5. **Interface Segregation**
- ISyntaxHandler only adds necessary grammar methods
- Clients not forced to implement unused methods

### 6. **Dependency Inversion**
- Both depend on ISerialization abstraction
- Not coupled to concrete implementations

## Dependencies

### Required
- `exonware-xwsystem>=0.0.1` - Provides serialization infrastructure
- `lark>=1.1.0` - Lark parser for grammar processing

### Optional
- `PyYAML` - YAML grammar support (via xwsystem)
- `tomli`/`tomli-w` - TOML grammar support (via xwsystem)
- `defusedxml` - XML grammar support with security (via xwsystem)

All optional dependencies are managed through xwsystem, so xwsyntax gets them automatically.

## Testing Strategy

### Unit Tests
```python
def test_syntax_handler_inheritance():
    """Test that ASyntaxHandler properly extends ASerialization."""
    from exonware.xwsyntax import ASyntaxHandler
    from exonware.xwsystem.serialization import ASerialization
    
    assert issubclass(ASyntaxHandler, ASerialization)

def test_interface_methods():
    """Test that ISyntaxHandler has all required methods."""
    from exonware.xwsyntax import ISyntaxHandler
    
    required_methods = [
        'dumps', 'loads', 'save', 'load',  # From ISerialization
        'parse_grammar', 'validate_grammar',  # Grammar-specific
    ]
    
    for method in required_methods:
        assert hasattr(ISyntaxHandler, method)
```

### Integration Tests
```python
def test_grammar_loader_uses_serialization():
    """Test that grammar loader uses xwsystem serializers."""
    from exonware.xwsyntax import get_grammar_loader
    
    loader = get_grammar_loader()
    
    # Should use JsonSerializer from xwsystem
    assert loader.json_serializer is not None
    assert loader.yaml_serializer is not None
```

## Future Enhancements

### 1. **Async Support**
ISerialization already supports async operations. Future versions can:
```python
async def load_grammar_async(self, file_path: Path) -> AGrammar:
    data = await self.load_async(file_path)
    return await self.parse_grammar_async(data)
```

### 2. **Streaming Support**
For large grammar files:
```python
def stream_grammar(self, file_path: Path) -> Iterator[GrammarRule]:
    for chunk in self.stream_load(file_path):
        yield self.parse_rule(chunk)
```

### 3. **Format Conversion**
Leverage serialization for grammar format conversion:
```python
def convert_grammar(self, input_path: Path, output_format: str) -> None:
    grammar = self.load_grammar(input_path)
    serializer = get_serializer(output_format)
    serializer.save(grammar, output_path)
```

## Conclusion

By extending the `ISerialization` interface, `xwsyntax` achieves:

✅ **Zero code duplication** - Reuses xwsystem serialization  
✅ **31+ formats supported** - All through existing infrastructure  
✅ **Consistent API** - Same patterns across packages  
✅ **Type safety** - Clear inheritance and contracts  
✅ **Security** - Inherits all xwsystem security features  
✅ **Maintainability** - Single source of truth for serialization  

This is a **textbook example** of proper software architecture:
- Interface-driven design
- Code reuse through inheritance
- Separation of concerns
- Following SOLID principles

## Related Documentation

- [xwsystem Serialization Documentation](../../xwsystem/docs/SERIALIZATION.md)
- [xwsyntax Architecture](../../xwsyntax/README.md)
- [XWQUERY-XWSYNTAX Integration](./XWQUERY_XWSYNTAX_INTEGRATION_COMPLETE.md)

---

**Company:** eXonware.com  
**Author:** Eng. Muhammad AlShehri  
**Email:** connect@exonware.com


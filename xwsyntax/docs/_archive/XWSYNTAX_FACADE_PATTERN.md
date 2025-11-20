# xwsyntax Facade Pattern

**Date:** October 29, 2025  
**Status:** ✅ Complete  
**Author:** Eng. Muhammad AlShehri  
**Email:** connect@exonware.com

## Overview

xwsyntax now implements the **Facade Pattern** following the same structure as xwnode. This provides a clean, intuitive public API that hides the complexity of the underlying grammar engine.

## Architecture Comparison

### xwnode Facade Structure

```
xwnode/
├── __init__.py         ← Exports facade
├── facade.py           ← XWNode class (main facade)
├── base.py             ← ANode (abstract base)
├── engine/             ← Internal implementation
└── strategies/         ← Hidden complexity
```

### xwsyntax Facade Structure (NEW)

```
xwsyntax/
├── __init__.py         ← Exports facade
├── facade.py           ← XWSyntax class (main facade)  ✅ NEW
├── base.py             ← ASyntaxEngine (abstract base)
├── engine.py           ← Internal implementation
└── grammar_loader.py   ← Hidden complexity
```

## The Facade Class: `XWSyntax`

### Class Definition

```python
class XWSyntax(ASyntaxEngine):
    """
    Main XWSyntax class providing a unified interface for all syntax operations.
    
    This class implements the facade pattern, hiding the complexity of the
    underlying grammar engine while providing a clean, intuitive API.
    """
```

### Key Features

1. **Simple Construction**
```python
# Default instance
syntax = XWSyntax()

# Custom grammar directory
syntax = XWSyntax(grammar_dir='/path/to/grammars')

# Performance optimized
syntax = XWSyntax(cache_size=512, auto_load=True)
```

2. **Core Operations**
```python
# Parse text
ast = syntax.parse('SELECT * FROM users', 'sql')

# Validate syntax
errors = syntax.validate('{"name": "Alice"}', 'json')

# Load grammar
grammar = syntax.load_grammar('python')

# List available grammars
grammars = syntax.list_grammars()
```

3. **Bidirectional Operations**
```python
# Load bidirectional grammar
grammar = syntax.load_bidirectional('sql')

# Parse and generate
ast = grammar.parse('SELECT * FROM users')
sql = grammar.generate(ast)

# Or use facade methods
ast = syntax.parse('SELECT * FROM users', 'sql')
sql = syntax.generate(ast, 'sql')

# Format conversion
graphql = syntax.convert('SELECT * FROM users', 'sql', 'graphql')
```

4. **File Operations**
```python
# Parse file (auto-detects grammar from extension)
ast = syntax.parse_file('query.sql')

# Parse file with explicit grammar
ast = syntax.parse_file('data.txt', 'json')

# Validate file
errors = syntax.validate_file('script.py')
```

5. **IDE Integration**
```python
# Export to Monaco editor
monaco_def = syntax.export_to_monaco('sql', case_insensitive=True)

# Get grammar info
info = syntax.get_info('python')
print(info['version'], info['format'])

# Check availability
if syntax.is_grammar_available('graphql'):
    # Use GraphQL grammar
    pass
```

## Factory Pattern

### XWSyntaxFactory

```python
from exonware.xwsyntax import XWSyntaxFactory

# Create with custom options
syntax = XWSyntaxFactory.create(grammar_dir='/custom/path')

# Lightweight instance (minimal footprint)
syntax = XWSyntaxFactory.lightweight()

# Performance instance (large cache, preloading)
syntax = XWSyntaxFactory.performance()

# Custom grammars only
syntax = XWSyntaxFactory.with_custom_grammars('/my/grammars')
```

## Convenience Functions

For quick, one-off operations:

```python
from exonware.xwsyntax import parse, validate, load_grammar, list_grammars

# Quick parse
ast = parse('{"name": "Alice"}', 'json')

# Quick validate
errors = validate('SELECT * FROM users', 'sql')

# Quick load
grammar = load_grammar('python')

# Quick list
grammars = list_grammars()
```

## Before vs After

### Before (Direct Engine Usage)

```python
# Complex, exposes internal details
from exonware.xwsyntax.engine import SyntaxEngine
from exonware.xwsyntax.defs import ParserMode

engine = SyntaxEngine()
grammar = engine.load_grammar('sql')
ast = grammar.parse('SELECT * FROM users', ParserMode.STRICT)
```

### After (Facade Pattern)

```python
# Simple, clean API
from exonware.xwsyntax import XWSyntax

syntax = XWSyntax()
ast = syntax.parse('SELECT * FROM users', 'sql')
```

## Comparison with xwnode

### xwnode Facade

```python
from exonware.xwnode import XWNode

# Create node
node = XWNode.from_native({'name': 'Alice', 'age': 30})

# Navigate
name = node.get('name')
age = node['age']

# Set value
node.set('age', 31)

# Factory
node = XWFactory.from_dict({'key': 'value'})
```

### xwsyntax Facade (Parallel Structure)

```python
from exonware.xwsyntax import XWSyntax

# Create syntax engine
syntax = XWSyntax()

# Parse
ast = syntax.parse('{"name": "Alice"}', 'json')

# Validate
errors = syntax.validate('SELECT * FROM users', 'sql')

# Load grammar
grammar = syntax.load_grammar('python')

# Factory
syntax = XWSyntaxFactory.lightweight()
```

## Benefits

### 1. **Simplified API**
- Users don't need to know about `SyntaxEngine`, `Grammar`, `ParserMode`, etc.
- Single entry point: `XWSyntax`

### 2. **Hides Complexity**
- Grammar loading
- Parser caching
- Format detection
- Error handling

### 3. **Consistent with xwnode**
- Same pattern across eXonware packages
- Familiar API for users
- Easy to learn and use

### 4. **Flexibility**
- Advanced users can still access internal classes
- Facade doesn't prevent direct usage of `SyntaxEngine`
- Layers of abstraction available

### 5. **Factory Support**
- Multiple creation patterns
- Performance presets
- Lightweight variants

## Usage Recommendations

### For Most Users (Recommended)

```python
from exonware.xwsyntax import XWSyntax

syntax = XWSyntax()
# Use syntax.parse(), syntax.validate(), etc.
```

### For Quick Operations

```python
from exonware.xwsyntax import parse, validate

ast = parse(text, 'sql')
errors = validate(text, 'json')
```

### For Advanced Users

```python
from exonware.xwsyntax import SyntaxEngine, Grammar

# Still available for advanced use cases
engine = SyntaxEngine(cache_size=1024)
grammar = engine.load_grammar('custom')
```

### For Custom Grammars

```python
from exonware.xwsyntax import XWSyntaxFactory

syntax = XWSyntaxFactory.with_custom_grammars('/my/grammars')
```

## Implementation Details

### Class Hierarchy

```
ASyntaxEngine (abstract)
    ↓
SyntaxEngine (concrete implementation)
    ↓
XWSyntax (facade - delegates to SyntaxEngine)
```

### Delegation Pattern

`XWSyntax` delegates to internal `SyntaxEngine`:

```python
class XWSyntax(ASyntaxEngine):
    def __init__(self, ...):
        self._engine = SyntaxEngine(...)  # Internal engine
    
    def parse(self, text, grammar, mode):
        return self._engine.parse(text, grammar, mode)  # Delegate
```

### Auto-loading

```python
class XWSyntax:
    def __init__(self, auto_load=True):
        if auto_load:
            # Preload common grammars for better performance
            self._preload_common_grammars()
```

## Future Enhancements

### 1. **Async Support**

```python
async with XWSyntax() as syntax:
    ast = await syntax.parse_async(text, 'sql')
```

### 2. **Context Manager**

```python
with XWSyntax() as syntax:
    # Automatic cleanup
    ast = syntax.parse(text, 'sql')
```

### 3. **Chaining**

```python
result = (syntax
    .parse(text, 'sql')
    .transform(transformer)
    .generate('graphql'))
```

### 4. **Batch Operations**

```python
results = syntax.parse_many([
    ('text1', 'sql'),
    ('text2', 'json'),
    ('text3', 'python')
])
```

## Comparison Table

| Feature | xwnode (XWNode) | xwsyntax (XWSyntax) |
|---------|----------------|---------------------|
| **Purpose** | Data node facade | Grammar engine facade |
| **Main Class** | XWNode | XWSyntax |
| **Factory** | XWFactory | XWSyntaxFactory |
| **Base Class** | ANode | ASyntaxEngine |
| **Internal** | StrategyManager | SyntaxEngine |
| **Pattern** | Strategy + Facade | Engine + Facade |
| **Presets** | fast(), optimized() | lightweight(), performance() |

## Testing

### Unit Tests

```python
def test_facade_creation():
    """Test XWSyntax facade creation."""
    syntax = XWSyntax()
    assert syntax is not None
    assert isinstance(syntax, ASyntaxEngine)

def test_facade_parse():
    """Test parsing through facade."""
    syntax = XWSyntax()
    ast = syntax.parse('{"key": "value"}', 'json')
    assert ast is not None

def test_convenience_functions():
    """Test convenience functions."""
    from exonware.xwsyntax import parse, validate
    
    ast = parse('SELECT * FROM users', 'sql')
    assert ast is not None
    
    errors = validate('{"key": "value"}', 'json')
    assert len(errors) == 0
```

### Integration Tests

```python
def test_facade_integration():
    """Test full workflow through facade."""
    syntax = XWSyntax()
    
    # Parse
    ast = syntax.parse('SELECT name FROM users', 'sql')
    
    # Validate
    errors = syntax.validate('SELECT name FROM users', 'sql')
    assert len(errors) == 0
    
    # Convert
    json_ast = syntax.convert('SELECT name FROM users', 'sql', 'json')
```

## Documentation

The facade is now the **recommended entry point** for xwsyntax:

```python
"""
xwsyntax - Universal Grammar Engine

Usage:
    # Recommended: Use the facade
    from exonware.xwsyntax import XWSyntax
    
    syntax = XWSyntax()
    ast = syntax.parse('{"name": "Alice"}', 'json')
"""
```

## Migration Guide

### Existing Code

```python
# Old way (still works)
from exonware.xwsyntax import SyntaxEngine

engine = SyntaxEngine()
grammar = engine.load_grammar('sql')
ast = grammar.parse('SELECT * FROM users')
```

### Recommended Approach

```python
# New way (recommended)
from exonware.xwsyntax import XWSyntax

syntax = XWSyntax()
ast = syntax.parse('SELECT * FROM users', 'sql')
```

## Conclusion

The xwsyntax facade pattern:

✅ **Follows xwnode structure** - Consistent architecture  
✅ **Simplifies API** - Clean, intuitive interface  
✅ **Hides complexity** - Internal details abstracted  
✅ **Maintains flexibility** - Advanced usage still possible  
✅ **Improves usability** - Better developer experience  

This is now the **primary way** to use xwsyntax!

---

**Company:** eXonware.com  
**Author:** Eng. Muhammad AlShehri  
**Email:** connect@exonware.com


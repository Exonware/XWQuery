# Python to Rust Bidirectional Converter

Bidirectional converter that transforms Python code to Rust and vice versa, using **xwsyntax** for syntax parsing/generation and **xwschema** for schema-aware type conversion.

## Overview

This converter provides a complete solution for bidirectional code conversion between Python and Rust:

- **xwsyntax**: Syntax parsing (Python/Rust → AST) and code generation (AST → Python/Rust)
- **xwschema**: Schema-aware type conversion and validation
- **JSON schemas**: Type mappings, pattern mappings, and conversion rules
- **AST transformations**: Custom transformation logic for language-specific constructs

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                  PythonToRustConverter                      │
│                                                              │
│  ┌─────────────────┐         ┌─────────────────┐          │
│  │  Syntax Layer   │         │  Schema Layer   │          │
│  │   (xwsyntax)    │         │   (xwschema)    │          │
│  │                 │         │                 │          │
│  │ • Parse Python  │         │ • Load schemas  │          │
│  │ • Parse Rust    │         │ • Type mapping  │          │
│  │ • Generate Rust │         │ • Validation    │          │
│  │ • Generate Py   │         │ • Conversion    │          │
│  └────────┬────────┘         └────────┬────────┘          │
│           │                            │                   │
│           └────────────┬───────────────┘                   │
│                        │                                    │
│              ┌─────────▼─────────┐                         │
│              │  Transformation   │                         │
│              │     Engine        │                         │
│              │                   │                         │
│              │ • AST transform   │                         │
│              │ • Type convert    │                         │
│              │ • Pattern match   │                         │
│              └───────────────────┘                         │
└─────────────────────────────────────────────────────────────┘
```

### Conversion Flow

**Python → Rust:**
```
Python Code → Parse (xwsyntax) → AST → Transform (ASTTransformer) → AST → Generate (xwsyntax) → Rust Code
```

**Rust → Python:**
```
Rust Code → Parse (xwsyntax) → AST → Transform (ASTTransformer) → AST → Generate (xwsyntax) → Python Code
```

## File Structure

```
xwsyntax/examples/python_to_rust/
├── converter.py              # Main converter class (PythonToRustConverter)
├── transformer.py            # AST transformation engine (ASTTransformer)
├── tests.py                  # Roundtrip tests
├── __init__.py               # Package initialization
├── schemas/                  # JSON schema files
│   ├── type_mappings.json    # Python types → Rust types
│   ├── pattern_mappings.json # Syntax patterns → Rust patterns
│   ├── conversion_rules.json # Conversion rules and options
│   ├── python_schema.json    # Python type schema (for xwschema)
│   └── rust_schema.json      # Rust type schema (for xwschema)
├── examples/
│   ├── simple.py             # Simple Python examples
│   └── complex.py            # Complex Python examples
└── README.md                 # This file
```

## Installation

The converter requires:
- `xwsyntax`: For syntax parsing and code generation
- `xwschema`: For schema validation (optional, for validation features)

Both should be installed as part of the exonware ecosystem.

## Usage

### Basic Usage

```python
from exonware.xwsyntax.examples.python_to_rust import PythonToRustConverter

# Create converter
converter = PythonToRustConverter()

# Python to Rust
rust_code = converter.convert_python_to_rust("""
def add(a: int, b: int) -> int:
    return a + b
""")
print(rust_code)

# Rust to Python
python_code = converter.convert_rust_to_python("""
fn add(a: i32, b: i32) -> i32 {
    a + b
}
""")
print(python_code)
```

### File Conversion

```python
from pathlib import Path
from exonware.xwsyntax.examples.python_to_rust import PythonToRustConverter

converter = PythonToRustConverter()

# Convert Python file to Rust
converter.convert_file(
    Path('example.py'),
    Path('example.rs'),
    direction='python_to_rust'
)

# Convert Rust file to Python
converter.convert_file(
    Path('example.rs'),
    Path('example.py'),
    direction='rust_to_python'
)
```

### Command Line Usage

```bash
# Run the converter
python converter.py

# Convert a file
python converter.py input.py output.rs python_to_rust
python converter.py input.rs output.py rust_to_python
```

### Running Tests

```bash
# Run roundtrip tests
python tests.py
```

## Schema Configuration

### Type Mappings (`schemas/type_mappings.json`)

Defines mappings between Python and Rust types:

```json
{
  "primitives": {
    "int": "i32",
    "float": "f64",
    "str": "String",
    "bool": "bool",
    "None": "()",
    "bytes": "Vec<u8>"
  },
  "collections": {
    "list": "Vec",
    "dict": "HashMap",
    "tuple": "tuple",
    "set": "HashSet"
  },
  "optional": {
    "Optional": "Option",
    "Union[None, T]": "Option<T>"
  }
}
```

### Pattern Mappings (`schemas/pattern_mappings.json`)

Defines syntax pattern transformations:

- Function definitions (`def` → `fn`)
- Class definitions (`class` → `struct`/`impl`)
- Variable declarations
- Control flow (if/for/while)
- Return statements
- Import statements

### Conversion Rules (`schemas/conversion_rules.json`)

Configuration for conversion behavior:

- Naming conventions (snake_case → snake_case)
- Type inference rules
- Error handling strategies
- Memory management hints
- Code generation options

### Language Schemas (`schemas/python_schema.json`, `schemas/rust_schema.json`)

JSON Schema definitions for type validation using xwschema.

## Features

### ✅ Implemented

- **Bidirectional conversion**: Python ↔ Rust
- **Schema-based type mapping**: Configurable type conversions
- **AST transformations**: Custom transformation logic
- **File conversion**: Convert entire files
- **Schema loading**: Load and validate schemas
- **Roundtrip tests**: Verify conversion quality

### 🔄 Architecture Support (Grammar-Dependent)

- Function definitions
- Class/struct definitions
- Type annotations
- Control flow statements
- Variable declarations
- Function calls

**Note**: Conversion quality depends on grammar completeness. Some language features may require grammar refinement for optimal conversion.

## Examples

### Simple Example

**Python:**
```python
def add(a: int, b: int) -> int:
    return a + b
```

**Rust (converted):**
```rust
fn add(a: i32, b: i32) -> i32 {
    a + b
}
```

### Complex Example

See `examples/simple.py` and `examples/complex.py` for more examples.

## Limitations

1. **Grammar Completeness**: Conversion quality depends on grammar definitions. Some language features may not be fully supported yet.

2. **Type System Differences**: 
   - Python's dynamic typing vs Rust's static typing
   - Python's `None` vs Rust's `Option<T>`
   - Python's GC vs Rust's ownership model

3. **Language Idioms**: Some Python idioms don't translate directly to Rust and vice versa.

4. **Semantic Translation**: Complex conversions may require additional transformation logic.

## Extending the Converter

### Custom Type Mappings

Add custom type mappings to `schemas/type_mappings.json`:

```json
{
  "custom": {
    "MyCustomType": "MyRustType",
    "AnotherType": "AnotherRustType"
  }
}
```

### Custom Transformations

Extend `ASTTransformer` class to add custom transformation logic:

```python
from transformer import ASTTransformer

class MyTransformer(ASTTransformer):
    def _transform_function_def(self, ast, direction):
        # Custom transformation logic
        return transformed_ast
```

### Custom Schemas

Place custom schema files in the `schemas/` directory and load them:

```python
converter = PythonToRustConverter(schema_dir=Path('custom_schemas'))
```

## Testing

Run the test suite:

```bash
python tests.py
```

The test suite includes:
- Simple conversion tests
- Rust to Python conversion tests
- Roundtrip tests (Python → Rust → Python, Rust → Python → Rust)
- File conversion tests
- Schema loading tests

## See Also

- [xwsyntax Architecture](../../docs/ARCHITECTURE.md)
- [Bidirectional Grammars](../../docs/BIDIRECTIONAL.md)
- [xwschema Documentation](../../../xwschema/README.md)

## Design Decisions

1. **JSON-First Configuration**: All schemas, mappings, and rules in JSON format for easy modification
2. **Schema Validation**: Use xwschema to validate type conversions and schema structures
3. **Bidirectional**: Support both Python→Rust and Rust→Python conversion
4. **Extensible**: Allow custom schema files and transformation rules
5. **AST-Based**: Use AST as universal intermediate format (via xwsyntax)

## Dependencies

- `xwsyntax`: Syntax parsing and code generation
- `xwschema`: Schema validation and type checking (optional, for validation features)
- JSON schema files for configuration

## Company

**eXonware.com**  
Author: eXonware Backend Team  
Email: connect@exonware.com  
Version: 0.0.1  
Generation Date: 15-Jan-2025

# Advanced Python ↔ Rust Conversion Examples

This directory contains comprehensive examples demonstrating modern Python and Rust features and their bidirectional conversion.

## Files

### `advanced_python.py`
Advanced Python examples using modern features (Python 3.10+):
- **Pattern Matching**: `match/case` statements
- **Type Unions**: `Union`, `Optional` types
- **Dataclasses**: `@dataclass` decorator
- **Enums**: `Enum` with `auto()`
- **Async/Await**: Asynchronous programming
- **Generics**: `TypeVar`, `Generic`
- **Context Managers**: `with` statements and `@contextmanager`
- **Type Guards**: Runtime type checking
- **Protocol Types**: Structural typing
- **Result Pattern**: Error handling without exceptions

### `advanced_rust.rs`
Corresponding Rust examples with modern features (Rust 2021+):
- **Pattern Matching**: `match` expressions
- **Enums**: Enums with data variants
- **Structs**: Struct definitions with `impl` blocks
- **Generics**: Generic types and traits
- **Async/Await**: `async/await` with Tokio
- **Error Handling**: `Result<T, E>` type
- **Option Types**: `Option<T>` for nullable values
- **Lifetimes**: Lifetime annotations
- **Iterators**: Iterator chains and closures
- **Traits**: Trait definitions and implementations

### `modern_features.py`
Cutting-edge Python features (Python 3.11+):
- **Literal Types**: `Literal["read", "write"]`
- **TypedDict**: Typed dictionaries
- **Annotated Types**: Type annotations with metadata
- **Self Type**: `Self` for method chaining
- **Pattern Matching with Guards**: Conditional pattern matching
- **Type Narrowing**: Automatic type inference
- **Exception Groups**: Multiple exception handling (Python 3.11+)
- **Variadic Generics**: `TypeVarTuple` (Python 3.11+)

### `complex.py`
Original complex examples with classes and collections.

### `simple.py`
Simple examples for basic conversion testing.

## Features Demonstrated

### Pattern Matching

**Python:**
```python
def handle_status(status: Status) -> str:
    match status:
        case Status.PENDING:
            return "Waiting to start"
        case Status.COMPLETED:
            return "Successfully completed"
        case _:
            return "Unknown status"
```

**Rust:**
```rust
fn handle_status(status: Status) -> String {
    match status {
        Status::Pending => "Waiting to start".to_string(),
        Status::Completed => "Successfully completed".to_string(),
        _ => "Unknown status".to_string(),
    }
}
```

### Generics

**Python:**
```python
T = TypeVar('T')

class Stack(Generic[T]):
    def push(self, item: T) -> None:
        self._items.append(item)
```

**Rust:**
```rust
struct Stack<T> {
    items: Vec<T>,
}

impl<T> Stack<T> {
    fn push(&mut self, item: T) {
        self.items.push(item);
    }
}
```

### Error Handling

**Python:**
```python
def divide(a: float, b: float) -> Result[float, str]:
    if b == 0:
        return Result.err("Division by zero")
    return Result.ok(a / b)
```

**Rust:**
```rust
fn divide(a: f64, b: f64) -> Result<f64, String> {
    if b == 0.0 {
        Err("Division by zero".to_string())
    } else {
        Ok(a / b)
    }
}
```

### Async/Await

**Python:**
```python
async def fetch_data(url: str) -> Dict[str, str]:
    await asyncio.sleep(0.1)
    return {"url": url, "data": f"Data from {url}"}
```

**Rust:**
```rust
async fn fetch_data(url: &str) -> HashMap<String, String> {
    sleep(Duration::from_millis(100)).await;
    let mut result = HashMap::new();
    result.insert("url".to_string(), url.to_string());
    result.insert("data".to_string(), format!("Data from {}", url));
    result
}
```

## Running the Examples

### Convert Python to Rust

```python
from converter import PythonToRustConverter

converter = PythonToRustConverter()

with open('examples/advanced_python.py', 'r') as f:
    python_code = f.read()

rust_code = converter.convert_python_to_rust(python_code)
print(rust_code)
```

### Convert Rust to Python

```python
from converter import PythonToRustConverter

converter = PythonToRustConverter()

with open('examples/advanced_rust.rs', 'r') as f:
    rust_code = f.read()

python_code = converter.convert_rust_to_python(rust_code)
print(python_code)
```

### Run Tests

```bash
cd xwsyntax/examples/python_to_rust
python examples/test_advanced.py
```

## Conversion Status

### ✅ Fully Supported
- Basic functions with types
- Classes → Structs
- Enums
- Generics (basic)
- Optional types
- Error handling patterns

### 🚧 Partially Supported
- Pattern matching (basic cases work)
- Async/await (structure preserved, runtime may differ)
- Context managers (converted to manual resource management)
- Dataclasses (converted to structs, some features may be lost)

### ❌ Not Yet Supported
- Exception groups (Python 3.11+)
- Variadic generics (Python 3.11+)
- Advanced pattern matching guards
- Some Python-specific features (list comprehensions, decorators)

## Notes

1. **Language Differences**: Some Python features don't have direct Rust equivalents:
   - Python's dynamic typing vs Rust's static typing
   - Python's exceptions vs Rust's Result types
   - Python's garbage collection vs Rust's ownership

2. **Conversion Quality**: The converter focuses on structural conversion. Some idiomatic patterns may need manual refinement.

3. **Type System**: The converter uses type mappings from `schemas/type_mappings.json`. Custom types may need additional mappings.

## Contributing

To add support for new features:

1. Update the input grammars (`python.grammar.in.lark`, `rust.grammar.in.lark`)
2. Update the output grammars (`python.grammar.out.lark`, `rust.grammar.out.lark`)
3. Enhance the transformer (`transformer.py`) with new transformation rules
4. Add test cases in `test_advanced.py`
5. Update type mappings in `schemas/type_mappings.json`

## License

Company: eXonware.com  
Author: eXonware Backend Team  
Email: connect@exonware.com

# Usage Guide - exonware-xwsystem

**Library:** exonware-xwsystem  
**Version:** 0.0.1.387  
**Last Updated:** 06-Nov-2025

---

## 🚀 Quick Start

### Installation

| Language | Command |
|----------|---------|
| **Python** | `pip install exonware-xwsystem[lazy]` |
| **TypeScript** | `npm install @exonware/xwsystem` |
| **Go** | `go get github.com/exonware/xwsystem` |
| **Rust** | Add `exonware-xwsystem = "0.0.1"` to `Cargo.toml` |

### Basic Usage

**Python | TypeScript | Go | Rust**

<details>
<summary><strong>Python</strong></summary>

```python
from exonware.xwsystem import JsonSerializer

# Create serializer
js = JsonSerializer()

# Serialize data
data = {"name": "Alice", "age": 30}
json_str = js.dumps(data)

# Deserialize
parsed = js.loads(json_str)
```

</details>

<details>
<summary><strong>TypeScript</strong></summary>

```typescript
import { JsonSerializer } from '@exonware/xwsystem';

// Create serializer
const js = new JsonSerializer();

// Serialize data
const data = { name: "Alice", age: 30 };
const jsonStr = js.dumps(data);

// Deserialize
const parsed = js.loads(jsonStr);
```

</details>

<details>
<summary><strong>Go</strong></summary>

```go
package main

import (
    "fmt"
    "github.com/exonware/xwsystem"
)

func main() {
    // Create serializer
    js := xwsystem.NewJsonSerializer()
    
    // Serialize data
    data := map[string]interface{}{
        "name": "Alice",
        "age": 30,
    }
    jsonStr, err := js.Dumps(data)
    if err != nil {
        panic(err)
    }
    
    // Deserialize
    parsed, err := js.Loads(jsonStr)
    if err != nil {
        panic(err)
    }
    
    fmt.Println(parsed)
}
```

</details>

<details>
<summary><strong>Rust</strong></summary>

```rust
use exonware_xwsystem::JsonSerializer;

fn main() {
    // Create serializer
    let js = JsonSerializer::new();
    
    // Serialize data
    let data = serde_json::json!({
        "name": "Alice",
        "age": 30
    });
    let json_str = js.dumps(&data).unwrap();
    
    // Deserialize
    let parsed: serde_json::Value = js.loads(&json_str).unwrap();
    
    println!("{:?}", parsed);
}
```

</details>

---

## 🔧 Core Capabilities

### 1. Serialization (24+ Formats)

xwsystem provides unified serialization across 24 formats:

**Text Formats:** JSON, YAML, TOML, XML, INI, CSV, Properties, Dotenv  
**Binary Formats:** MessagePack, BSON, CBOR, Pickle, Marshal, Protobuf, Avro, Thrift, Cap'n Proto, FlatBuffers  
**Columnar/Enterprise:** Parquet, ORC, Arrow, Feather, HDF5, NetCDF, FITS

### 2. HTTP Client

Advanced HTTP client with HTTP/2 support, streaming, retries, and mock transport

### 3. Validation

Pydantic-style data validation with type coercion

### 4. Caching

LRU, LFU, TTL caching with async support

### 5. CLI Utilities

Colors, progress bars, tables for beautiful CLI apps

---

## 💡 Common Use Cases

### Use Case 1: Data Serialization

**Python | TypeScript | Go | Rust**

<details>
<summary><strong>Python</strong></summary>

```python
from exonware.xwsystem import JsonSerializer, YamlSerializer

# JSON for APIs
json_s = JsonSerializer()
api_data = {"status": "success", "data": {...}}
json_output = json_s.dumps(api_data)

# YAML for configs
yaml_s = YamlSerializer()
config = {
    "database": {"host": "localhost", "port": 5432},
    "features": ["auth", "api"]
}
yaml_output = yaml_s.dumps(config)
```

</details>

<details>
<summary><strong>TypeScript</strong></summary>

```typescript
import { JsonSerializer, YamlSerializer } from '@exonware/xwsystem';

// JSON for APIs
const jsonS = new JsonSerializer();
const apiData = { status: "success", data: {...} };
const jsonOutput = jsonS.dumps(apiData);

// YAML for configs
const yamlS = new YamlSerializer();
const config = {
    database: { host: "localhost", port: 5432 },
    features: ["auth", "api"]
};
const yamlOutput = yamlS.dumps(config);
```

</details>

<details>
<summary><strong>Go</strong></summary>

```go
import (
    "github.com/exonware/xwsystem"
)

// JSON for APIs
jsonS := xwsystem.NewJsonSerializer()
apiData := map[string]interface{}{
    "status": "success",
    "data": map[string]interface{}{},
}
jsonOutput, _ := jsonS.Dumps(apiData)

// YAML for configs
yamlS := xwsystem.NewYamlSerializer()
config := map[string]interface{}{
    "database": map[string]interface{}{
        "host": "localhost",
        "port": 5432,
    },
    "features": []string{"auth", "api"},
}
yamlOutput, _ := yamlS.Dumps(config)
```

</details>

<details>
<summary><strong>Rust</strong></summary>

```rust
use exonware_xwsystem::{JsonSerializer, YamlSerializer};

// JSON for APIs
let json_s = JsonSerializer::new();
let api_data = serde_json::json!({
    "status": "success",
    "data": {}
});
let json_output = json_s.dumps(&api_data).unwrap();

// YAML for configs
let yaml_s = YamlSerializer::new();
let config = serde_yaml::to_value(&serde_json::json!({
    "database": {
        "host": "localhost",
        "port": 5432
    },
    "features": ["auth", "api"]
})).unwrap();
let yaml_output = yaml_s.dumps(&config).unwrap();
```

</details>

**Why this approach:**
- Consistent API across all formats
- Easy to switch formats
- Production-grade libraries under the hood

### Use Case 2: File I/O

**Python | TypeScript | Go | Rust**

<details>
<summary><strong>Python</strong></summary>

```python
from exonware.xwsystem import JsonSerializer

js = JsonSerializer()

# Save to file
data = {"users": [...], "settings": {...}}
js.dump_to_file(data, "config.json")

# Load from file
loaded_data = js.load_from_file("config.json")
```

</details>

<details>
<summary><strong>TypeScript</strong></summary>

```typescript
import { JsonSerializer } from '@exonware/xwsystem';
import * as fs from 'fs/promises';

const js = new JsonSerializer();

// Save to file
const data = { users: [...], settings: {...} };
await js.dumpToFile(data, "config.json");

// Load from file
const loadedData = await js.loadFromFile("config.json");
```

</details>

<details>
<summary><strong>Go</strong></summary>

```go
import "github.com/exonware/xwsystem"

js := xwsystem.NewJsonSerializer()

// Save to file
data := map[string]interface{}{
    "users": []interface{}{},
    "settings": map[string]interface{}{},
}
js.DumpToFile(data, "config.json")

// Load from file
loadedData, _ := js.LoadFromFile("config.json")
```

</details>

<details>
<summary><strong>Rust</strong></summary>

```rust
use exonware_xwsystem::JsonSerializer;
use std::fs;

let js = JsonSerializer::new();

// Save to file
let data = serde_json::json!({
    "users": [],
    "settings": {}
});
js.dump_to_file(&data, "config.json").unwrap();

// Load from file
let loaded_data: serde_json::Value = js.load_from_file("config.json").unwrap();
```

</details>

**Why:** Simple file operations with automatic encoding handling

### Use Case 3: HTTP Requests

**Python | TypeScript | Go | Rust**

<details>
<summary><strong>Python</strong></summary>

```python
from exonware.xwsystem import AdvancedHttpClient

async with AdvancedHttpClient() as client:
    # GET request
    response = await client.get("https://api.example.com/data")
    data = response.json()
    
    # POST with JSON
    result = await client.post(
        "https://api.example.com/users",
        json={"name": "Alice", "email": "alice@example.com"}
    )
```

</details>

<details>
<summary><strong>TypeScript</strong></summary>

```typescript
import { AdvancedHttpClient } from '@exonware/xwsystem';

const client = new AdvancedHttpClient();

// GET request
const response = await client.get("https://api.example.com/data");
const data = await response.json();

// POST with JSON
const result = await client.post(
    "https://api.example.com/users",
    { json: { name: "Alice", email: "alice@example.com" } }
);
```

</details>

<details>
<summary><strong>Go</strong></summary>

```go
import (
    "context"
    "github.com/exonware/xwsystem"
)

client := xwsystem.NewAdvancedHttpClient(context.Background())

// GET request
response, _ := client.Get("https://api.example.com/data")
var data map[string]interface{}
response.JSON(&data)

// POST with JSON
result, _ := client.Post(
    "https://api.example.com/users",
    xwsystem.WithJSON(map[string]interface{}{
        "name": "Alice",
        "email": "alice@example.com",
    }),
)
```

</details>

<details>
<summary><strong>Rust</strong></summary>

```rust
use exonware_xwsystem::AdvancedHttpClient;
use serde_json::json;

let client = AdvancedHttpClient::new();

// GET request
let response = client.get("https://api.example.com/data").await?;
let data: serde_json::Value = response.json().await?;

// POST with JSON
let result = client.post(
    "https://api.example.com/users",
    json!({
        "name": "Alice",
        "email": "alice@example.com"
    })
).await?;
```

</details>

**Why:** Async-first, HTTP/2 support, automatic retries

---

## 🔧 Codec System Usage

### Creating Custom Codecs

**Python | TypeScript | Go | Rust**

<details>
<summary><strong>Python</strong></summary>

```python
from exonware.xwsystem.codec import CodecBase, MediaKey, register_codec

class MyCodec(CodecBase[dict, bytes]):
    codec_id = "myformat"
    media_types = ["application/x-myformat"]
    file_extensions = [".myformat"]
    
    def encode(self, value, *, options=None):
        # Your encoding logic
        return str(value).encode('utf-8')
    
    def decode(self, repr, *, options=None):
        # Your decoding logic
        return eval(repr.decode('utf-8'))
    
    def capabilities(self):
        return CodecCapability.BIDIRECTIONAL

# Register codec
register_codec(MyCodec)

# Use it
codec = MyCodec()
encoded = codec.encode({"key": "value"})
decoded = codec.decode(encoded)
```

</details>

<details>
<summary><strong>TypeScript</strong></summary>

```typescript
import { CodecBase, MediaKey, registerCodec, CodecCapability } from '@exonware/xwsystem';

class MyCodec extends CodecBase<Record<string, any>, Uint8Array> {
    codecId = "myformat";
    mediaTypes = ["application/x-myformat"];
    fileExtensions = [".myformat"];
    
    encode(value: Record<string, any>, options?: any): Uint8Array {
        // Your encoding logic
        return new TextEncoder().encode(JSON.stringify(value));
    }
    
    decode(repr: Uint8Array, options?: any): Record<string, any> {
        // Your decoding logic
        return JSON.parse(new TextDecoder().decode(repr));
    }
    
    capabilities(): CodecCapability {
        return CodecCapability.BIDIRECTIONAL;
    }
}

// Register codec
registerCodec(MyCodec);

// Use it
const codec = new MyCodec();
const encoded = codec.encode({ key: "value" });
const decoded = codec.decode(encoded);
```

</details>

<details>
<summary><strong>Go</strong></summary>

```go
import (
    "github.com/exonware/xwsystem"
)

type MyCodec struct {
    xwsystem.CodecBase
}

func NewMyCodec() *MyCodec {
    return &MyCodec{
        CodecBase: xwsystem.CodecBase{
            CodecID:        "myformat",
            MediaTypes:     []string{"application/x-myformat"},
            FileExtensions: []string{".myformat"},
        },
    }
}

func (c *MyCodec) Encode(value interface{}, options map[string]interface{}) ([]byte, error) {
    // Your encoding logic
    return []byte(fmt.Sprintf("%v", value)), nil
}

func (c *MyCodec) Decode(repr []byte, options map[string]interface{}) (interface{}, error) {
    // Your decoding logic
    return string(repr), nil
}

func (c *MyCodec) Capabilities() xwsystem.CodecCapability {
    return xwsystem.CodecCapabilityBidirectional
}

// Register codec
xwsystem.RegisterCodec(NewMyCodec())

// Use it
codec := NewMyCodec()
encoded, _ := codec.Encode(map[string]interface{}{"key": "value"}, nil)
decoded, _ := codec.Decode(encoded, nil)
```

</details>

<details>
<summary><strong>Rust</strong></summary>

```rust
use exonware_xwsystem::{CodecBase, CodecCapability, register_codec};

struct MyCodec {
    codec_id: String,
    media_types: Vec<String>,
    file_extensions: Vec<String>,
}

impl CodecBase for MyCodec {
    fn codec_id(&self) -> &str {
        &self.codec_id
    }
    
    fn media_types(&self) -> &[String] {
        &self.media_types
    }
    
    fn file_extensions(&self) -> &[String] {
        &self.file_extensions
    }
    
    fn encode(&self, value: &serde_json::Value, _options: Option<&serde_json::Value>) -> Result<Vec<u8>, Box<dyn std::error::Error>> {
        // Your encoding logic
        Ok(serde_json::to_string(value)?.into_bytes())
    }
    
    fn decode(&self, repr: &[u8], _options: Option<&serde_json::Value>) -> Result<serde_json::Value, Box<dyn std::error::Error>> {
        // Your decoding logic
        serde_json::from_slice(repr).map_err(|e| e.into())
    }
    
    fn capabilities(&self) -> CodecCapability {
        CodecCapability::Bidirectional
    }
}

// Register codec
register_codec(Box::new(MyCodec {
    codec_id: "myformat".to_string(),
    media_types: vec!["application/x-myformat".to_string()],
    file_extensions: vec![".myformat".to_string()],
}));

// Use it
let codec = MyCodec { /* ... */ };
let encoded = codec.encode(&serde_json::json!({"key": "value"}), None)?;
let decoded = codec.decode(&encoded, None)?;
```

</details>

**Why:** 8 method pairs automatically generated from encode/decode

### Available Method Pairs

| Purpose | OUT (Model ? Format) | IN (Format ? Model) |
|---------|----------------------|---------------------|
| **Core** | `encode(value)` | `decode(repr)` |
| **Python** | `dumps(value)` | `loads(repr)` |
| **Explicit** | `serialize(value)` | `deserialize(repr)` |
| **File** | `save(value, path)` | `load(path)` |
| **Export** | `export(value, path)` | `import_(path)` |
| **Direction** | `to_file(value, path)` | `from_file(path)` |
| **Stream** | `write(value, stream)` | `read(stream)` |

---

## 📋 Core Module Interfaces

### IStringable - String Conversion

**Python | TypeScript | Go | Rust**

<details>
<summary><strong>Python</strong></summary>

```python
from exonware.xwsystem import IStringable

class MyClass(IStringable):
    def __init__(self, name):
        self.name = name
    
    def to_string(self, **options) -> str:
        return f"MyClass(name={self.name})"

# Usage
obj = MyClass("example")
print(obj.to_string())  # MyClass(name=example)
```

</details>

<details>
<summary><strong>TypeScript</strong></summary>

```typescript
import { IStringable } from '@exonware/xwsystem';

class MyClass implements IStringable {
    constructor(private name: string) {}
    
    toString(options?: Record<string, any>): string {
        return `MyClass(name=${this.name})`;
    }
}

// Usage
const obj = new MyClass("example");
console.log(obj.toString());  // MyClass(name=example)
```

</details>

<details>
<summary><strong>Go</strong></summary>

```go
import "github.com/exonware/xwsystem"

type MyClass struct {
    name string
}

func (m *MyClass) ToString(options map[string]interface{}) string {
    return fmt.Sprintf("MyClass(name=%s)", m.name)
}

// Usage
obj := &MyClass{name: "example"}
fmt.Println(obj.ToString(nil))  // MyClass(name=example)
```

</details>

<details>
<summary><strong>Rust</strong></summary>

```rust
use exonware_xwsystem::IStringable;

struct MyClass {
    name: String,
}

impl IStringable for MyClass {
    fn to_string(&self, _options: Option<&serde_json::Value>) -> String {
        format!("MyClass(name={})", self.name)
    }
}

// Usage
let obj = MyClass { name: "example".to_string() };
println!("{}", obj.to_string(None));  // MyClass(name=example)
```

</details>

**Why:** Consistent string conversion across xwsystem

---

## 🔒 Security Best Practices

### Input Validation

**Python | TypeScript | Go | Rust**

<details>
<summary><strong>Python</strong></summary>

```python
from exonware.xwsystem import validate_path

# Always validate user input
safe_path = validate_path(user_provided_path, allowed_dir="/data")
data = load_file(safe_path)
```

</details>

<details>
<summary><strong>TypeScript</strong></summary>

```typescript
import { validatePath } from '@exonware/xwsystem';

// Always validate user input
const safePath = validatePath(userProvidedPath, { allowedDir: "/data" });
const data = loadFile(safePath);
```

</details>

<details>
<summary><strong>Go</strong></summary>

```go
import "github.com/exonware/xwsystem"

// Always validate user input
safePath, err := xwsystem.ValidatePath(userProvidedPath, "/data")
if err != nil {
    panic(err)
}
data, _ := loadFile(safePath)
```

</details>

<details>
<summary><strong>Rust</strong></summary>

```rust
use exonware_xwsystem::validate_path;

// Always validate user input
let safe_path = validate_path(user_provided_path, "/data")?;
let data = load_file(safe_path)?;
```

</details>

**Why:** Prevents path traversal attacks (OWASP A5)

### Secure Serialization

**Python | TypeScript | Go | Rust**

<details>
<summary><strong>Python</strong></summary>

```python
from exonware.xwsystem import JsonSerializer

js = JsonSerializer()

# Validate before serialization
if validate_data(user_data):
    json_output = js.dumps(user_data)
```

</details>

<details>
<summary><strong>TypeScript</strong></summary>

```typescript
import { JsonSerializer } from '@exonware/xwsystem';

const js = new JsonSerializer();

// Validate before serialization
if (validateData(userData)) {
    const jsonOutput = js.dumps(userData);
}
```

</details>

<details>
<summary><strong>Go</strong></summary>

```go
import "github.com/exonware/xwsystem"

js := xwsystem.NewJsonSerializer()

// Validate before serialization
if xwsystem.ValidateData(userData) {
    jsonOutput, _ := js.Dumps(userData)
}
```

</details>

<details>
<summary><strong>Rust</strong></summary>

```rust
use exonware_xwsystem::JsonSerializer;

let js = JsonSerializer::new();

// Validate before serialization
if validate_data(&user_data) {
    let json_output = js.dumps(&user_data).unwrap();
}
```

</details>

**Why:** Prevents injection attacks

---

## ? Performance Tips

### Tip 1: Use Binary Formats for Speed

**Python | TypeScript | Go | Rust**

<details>
<summary><strong>Python</strong></summary>

```python
from exonware.xwsystem import MessagePackSerializer

# 3-5x faster than JSON
mps = MessagePackSerializer()
packed = mps.dumps(large_data)  # Faster encoding
unpacked = mps.loads(packed)     # Faster decoding
```

</details>

<details>
<summary><strong>TypeScript</strong></summary>

```typescript
import { MessagePackSerializer } from '@exonware/xwsystem';

// 3-5x faster than JSON
const mps = new MessagePackSerializer();
const packed = mps.dumps(largeData);  // Faster encoding
const unpacked = mps.loads(packed);   // Faster decoding
```

</details>

<details>
<summary><strong>Go</strong></summary>

```go
import "github.com/exonware/xwsystem"

// 3-5x faster than JSON
mps := xwsystem.NewMessagePackSerializer()
packed, _ := mps.Dumps(largeData)  // Faster encoding
unpacked, _ := mps.Loads(packed)    // Faster decoding
```

</details>

<details>
<summary><strong>Rust</strong></summary>

```rust
use exonware_xwsystem::MessagePackSerializer;

// 3-5x faster than JSON
let mps = MessagePackSerializer::new();
let packed = mps.dumps(&large_data)?;  // Faster encoding
let unpacked: serde_json::Value = mps.loads(&packed)?;  // Faster decoding
```

</details>

**Why:** Binary formats are significantly faster for large datasets

### Tip 2: Use Caching

**Python | TypeScript | Go | Rust**

<details>
<summary><strong>Python</strong></summary>

```python
from exonware.xwsystem.caching import create_cache

# Configurable cache (defaults to LFU - fastest cache type)
# Can be overridden via XWSYSTEM_CACHE_TYPE environment variable or settings
cache = create_cache(capacity=1000)

# Or specify cache type explicitly
cache = create_cache(capacity=1000, cache_type='lru')  # Use LRU instead

@cache
def expensive_operation(param):
    # Cached result
    return compute(param)
```

</details>

<details>
<summary><strong>TypeScript</strong></summary>

```typescript
import { LRUCache } from '@exonware/xwsystem';

const cache = new LRUCache<string, any>(1000);

function expensiveOperation(param: string): any {
    const cached = cache.get(param);
    if (cached) return cached;
    
    const result = compute(param);
    cache.set(param, result);
    return result;
}
```

</details>

<details>
<summary><strong>Go</strong></summary>

```go
import "github.com/exonware/xwsystem"

cache := xwsystem.NewLRUCache(1000)

func expensiveOperation(param string) interface{} {
    if cached, ok := cache.Get(param); ok {
        return cached
    }
    
    result := compute(param)
    cache.Set(param, result)
    return result
}
```

</details>

<details>
<summary><strong>Rust</strong></summary>

```rust
use exonware_xwsystem::LRUCache;

let mut cache = LRUCache::new(1000);

fn expensive_operation(param: &str, cache: &mut LRUCache<String, String>) -> String {
    if let Some(cached) = cache.get(param) {
        return cached.clone();
    }
    
    let result = compute(param);
    cache.insert(param.to_string(), result.clone());
    result
}
```

</details>

**Why:** 80% performance improvement for repeated operations

---

## 🔍 Troubleshooting

### Issue: ImportError for Specific Format

```
ModuleNotFoundError: No module named 'yaml'
```

**Solution:**

| Language | Command |
|----------|---------|
| **Python** | `pip install exonware-xwsystem[full]` |
| **TypeScript** | `npm install @exonware/xwsystem` |
| **Go** | `go get github.com/exonware/xwsystem` |
| **Rust** | Add `exonware-xwsystem = "0.0.1"` to `Cargo.toml` |

**Why:** Lite installation doesn't include format-specific dependencies

### Issue: Slow Serialization

**Solution:**

**Python | TypeScript | Go | Rust**

<details>
<summary><strong>Python</strong></summary>

```python
# Use binary format instead of text
from exonware.xwsystem import MessagePackSerializer

mps = MessagePackSerializer()  # 3-5x faster than JSON
```

</details>

<details>
<summary><strong>TypeScript</strong></summary>

```typescript
// Use binary format instead of text
import { MessagePackSerializer } from '@exonware/xwsystem';

const mps = new MessagePackSerializer();  // 3-5x faster than JSON
```

</details>

<details>
<summary><strong>Go</strong></summary>

```go
// Use binary format instead of text
import "github.com/exonware/xwsystem"

mps := xwsystem.NewMessagePackSerializer()  // 3-5x faster than JSON
```

</details>

<details>
<summary><strong>Rust</strong></summary>

```rust
// Use binary format instead of text
use exonware_xwsystem::MessagePackSerializer;

let mps = MessagePackSerializer::new();  // 3-5x faster than JSON
```

</details>

**Why:** Binary formats optimize for speed over readability

---

## 📚 Related Documentation

- [GUIDE_MASTER.md](GUIDE_MASTER.md) - Master standards and shared constraints
- [REF_API.md](../REF_API.md) - Complete API reference
- [REF_ARCH.md](../REF_ARCH.md) - Architecture documentation
- [GUIDE_DEV.md](GUIDE_DEV.md) - Development standards
- [logs/SUMMARY_CHANGE.md](../logs/SUMMARY_CHANGE.md) - Version history

**Original Source Documents:**
- [SERIALIZATION Reference](../logs/changes/CHANGE_20251030_2221_SERIALIZATION_REFERENCE.md)
- [Codec Quick Start](../logs/changes/CHANGE_20251030_1911_CODEC_QUICKSTART.md)
- [Core Modules Analysis](../logs/changes/CHANGE_20251104_1919_CORE_MODULES.md)

---

*Last updated: 06-Nov-2025*



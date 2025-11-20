# xwsyntax - Universal Grammar Engine

Parse and generate code for 31+ formats with one unified API.

## Features

- 🎯 **31 grammar formats** (queries, data, programming, specialized)
- ↔️ **Bidirectional** (parse AND generate from grammars)
- ⚡ **Automatic optimization** (xwnode-powered)
- 🔧 **Binary format support** (BSON, MessagePack, CBOR, etc.)
- 💻 **IDE integration** (LSP, Monaco, tree-sitter)
- 🚀 **High performance** (<1ms for common cases)

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

## Company

**eXonware.com**  
Author: Eng. Muhammad AlShehri  
Email: connect@exonware.com

## License

MIT


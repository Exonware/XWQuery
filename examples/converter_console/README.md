# XWQuery Converter Console

A command-line tool for converting query files between different formats using XWQuery's universal conversion system.

## Installation

This console tool is part of the xwquery examples. Make sure you have xwquery installed:

```bash
pip install exonware-xwquery
```

Or for development:

```bash
# Install in editable mode
pip install -e .
```

## Usage

```bash
convert <from_format> <to_format> <input_file> <output_file>
```

### Examples

Convert XWQuery Script to SQL:
```bash
python converter_console.py convert xwqs sql input.xwqs output.sql
```

Convert SQL to XWQuery Script:
```bash
python converter_console.py convert sql xwquery query.sql query.xwqs
```

Convert Cypher to GraphQL:
```bash
python converter_console.py convert cypher graphql data.cypher data.graphql
```

Convert SQL to MongoDB:
```bash
python converter_console.py convert sql mongodb query.sql query.mongodb
```

## Supported Formats

The converter supports all formats available in XWQuery, including:

### SQL Family
- SQL, SQLITE, MYSQL, POSTGRESQL
- N1QL, PARTIQL, CQL
- HIVEQL, HQL, KQL

### Graph Query Languages
- CYPHER, OPENCYPHER, GSQL, NGQL
- GREMLIN, SPARQL, GQL

### Document/JSON Query Languages
- MONGODB, COUCHDB
- JMESPATH, JQ, JSONIQ
- JSONPATH, JSONATA

### API Query Languages
- GRAPHQL

### Time-Series Query Languages
- PROMQL, LOGQL, FLUX, EQL

### Processing/ETL
- DATALOG, LINQ, PIG

### Specialized
- XWQUERY (or XWQS) - XWQuery Script format

## Format Aliases

- `xwqs` → `xwquery` (XWQuery Script)
- `xwqueryscript` → `xwquery`
- `xwquery_script` → `xwquery`

## Notes

- Format names are case-insensitive
- Input and output files should be UTF-8 encoded
- The converter automatically creates output directories if they don't exist
- Installation messages from xwlazy (auto-installer) are suppressed by default for cleaner output

## Error Handling

The converter will exit with an error code if:
- Input file doesn't exist
- Input file is empty
- Conversion fails (invalid query, unsupported format, etc.)
- Output file cannot be written (permissions, disk space, etc.)

## Examples Directory Structure

```
converter_console/
├── __init__.py
├── converter_console.py    # Main console script
└── README.md               # This file
```

## Running from Command Line

You can run the converter directly:

```bash
# From the examples/converter_console directory
python converter_console.py convert xwqs sql input.xwqs output.sql

# Or make it executable (Unix/Linux/Mac)
chmod +x converter_console.py
./converter_console.py convert xwqs sql input.xwqs output.sql
```

## Integration

To use this as a module:

```python
from examples.converter_console.converter_console import convert_file
from pathlib import Path

convert_file(
    from_format='xwqs',
    to_format='sql',
    input_file=Path('input.xwqs'),
    output_file=Path('output.sql')
)
```

## Company Information

**Company:** eXonware.com  
**Author:** eXonware Backend Team  
**Email:** connect@exonware.com  
**Version:** 0.0.1

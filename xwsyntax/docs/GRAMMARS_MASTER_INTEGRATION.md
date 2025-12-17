# Grammars Master Integration

## Overview

The `grammars_master.json` file provides a centralized metadata registry for all 96 supported grammar formats in xwsyntax. This file is now integrated into the xwsyntax library and used for format detection and metadata lookup.

## File Location

```
xwsyntax/src/exonware/xwsyntax/grammars/grammars_master.json
```

## Structure

Each format entry contains:
- `name`: Display name
- `description`: Format description
- `category`: Category (text_serialization, binary_serialization, query, programming, etc.)
- `file_extensions`: List of file extensions (e.g., `[".json", ".jsonl"]`)
- `mime_types`: List of MIME types
- `primary_mime_type`: Primary MIME type
- `aliases`: List of aliases
- `is_binary`: Boolean indicating if format is binary
- `supports_bidirectional`: Boolean indicating bidirectional support
- `specification`: Optional specification reference (e.g., "RFC 8259")

## Integration Points

### 1. GrammarMetadata Module

**File**: `xwsyntax/src/exonware/xwsyntax/grammar_metadata.py`

Provides:
- `get_grammar_metadata()`: Get global metadata instance
- `detect_from_extension(file_path)`: Detect format from file extension
- `detect_from_mime_type(mime_type)`: Detect format from MIME type
- `detect_from_alias(alias)`: Detect format from alias
- `find_format(identifier)`: Find format by any identifier
- `get_metadata(format_id)`: Get complete metadata for a format
- `list_formats()`: List all format IDs
- `list_extensions()`: List all supported extensions
- `list_mime_types()`: List all supported MIME types

### 2. Facade Integration

**File**: `xwsyntax/src/exonware/xwsyntax/facade.py`

The `_detect_grammar_from_extension()` method now uses `grammars_master.json` instead of hardcoded extension mappings.

**Before**:
```python
ext_map = {
    'sql': 'sql',
    'json': 'json',
    # ... hardcoded mappings
}
```

**After**:
```python
metadata = get_grammar_metadata()
format_id = metadata.detect_from_extension(f'.{ext}')
```

### 3. Registry Integration

**File**: `xwsyntax/src/exonware/xwsyntax/registry.py`

The `detect_format()` method now falls back to `grammars_master.json` if no handler is registered:

```python
# First try registered handlers
format_id = self._extension_map.get(suffix)
if format_id:
    return format_id

# Fallback to grammars_master.json
metadata = get_grammar_metadata()
format_id = metadata.detect_from_extension(file_path)
```

## Usage Examples

### Detect Format from Extension

```python
from exonware.xwsyntax import get_grammar_metadata

metadata = get_grammar_metadata()
format_id = metadata.detect_from_extension("data.json")
# Returns: "json"
```

### Detect Format from MIME Type

```python
format_id = metadata.detect_from_mime_type("application/json")
# Returns: "json"
```

### Get Complete Metadata

```python
metadata_dict = metadata.get_metadata("json")
# Returns: {
#     "name": "JSON",
#     "description": "...",
#     "file_extensions": [".json"],
#     "mime_types": ["application/json", "text/json"],
#     ...
# }
```

### List All Formats

```python
formats = metadata.list_formats()
# Returns: ["apache", "avro", "bash", "batch", ...]
```

## Benefits

1. **No Hardcoding**: All format metadata is centralized in one JSON file
2. **Easy Updates**: Add new formats by updating the JSON file
3. **Comprehensive**: Supports 96 formats with full metadata
4. **Flexible Lookups**: Find formats by extension, MIME type, alias, or ID
5. **Backward Compatible**: Existing handler-based detection still works

## Format Categories

- `text_serialization`: JSON, YAML, TOML, CSV, etc.
- `binary_serialization`: BSON, MessagePack, CBOR, etc.
- `enterprise_schema`: Protobuf, Avro, Thrift, etc.
- `query`: SQL, GraphQL, Cypher, SPARQL, etc.
- `programming`: Python, JavaScript, Java, C++, etc.
- `web`: HTML, CSS
- `markup`: Markdown, LaTeX, reStructuredText
- `configuration`: Dockerfile, Makefile, Nginx, Apache
- `scripting`: Bash, PowerShell, Shell, Batch
- `scientific`: HDF5, Feather, Zarr, NetCDF, MATLAB
- `database`: LMDB, LevelDB, GraphDB
- `other`: Plain Text, Log, Regex

## Total Formats

**96 formats** are currently supported and documented in `grammars_master.json`.


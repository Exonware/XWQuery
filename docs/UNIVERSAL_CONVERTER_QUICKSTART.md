# Universal Query Converter - Quick Start Guide

**Version:** 0.0.1  
**Last Updated:** 28-Oct-2025  
**Status:** Days 1-20 Complete (SQL + XPath operational)

---

## 🚀 One-Sentence Overview

**Transform queries between any supported formats** (currently SQL ↔ XPath, expanding to 31 formats) **through a universal QueryAction intermediate representation** with security validation, conversion modes, and excellent error reporting.

---

## Installation

```bash
# Install XWQuery
pip install exonware-xwquery

# Or install with lazy dependencies
pip install exonware-xwquery[lazy]

# Or install full dependencies
pip install exonware-xwquery[full]
```

---

## Quick Examples

### Basic SQL ↔ XPath Conversion

```python
from exonware.xwquery import sql_to_xpath, xpath_to_sql

# SQL to XPath
sql = "SELECT name FROM users WHERE age > 18"
xpath = sql_to_xpath(sql)
print(xpath)
# Output: //users/user[age > 18]/name

# XPath to SQL
xpath = "//books/book[price < 10]/title"
sql = xpath_to_sql(xpath)
print(sql)
# Output: SELECT title FROM books WHERE price < 10
```

### Using the Universal Converter

```python
from exonware.xwquery import UniversalQueryConverter
from exonware.xwquery.defs import ConversionMode

# Create converter
converter = UniversalQueryConverter()

# Convert between formats
result = converter.convert(
    query="SELECT * FROM users WHERE age > 18",
    from_format='sql',
    to_format='xpath'
)
print(result)
# Output: //users/user[age > 18]

# Check supported formats
formats = converter.get_supported_formats()
print(formats)
# Output: ['sql', 'xpath']

# Check if conversion is possible
can_convert = converter.can_convert('sql', 'xpath')
print(can_convert)
# Output: True
```

### Conversion Modes

```python
from exonware.xwquery import UniversalQueryConverter
from exonware.xwquery.defs import ConversionMode

# STRICT mode - fail on incompatible features
converter_strict = UniversalQueryConverter(ConversionMode.STRICT)

try:
    # JOINs don't map to XPath
    xpath = converter_strict.convert(
        "SELECT * FROM users JOIN orders ON users.id = orders.user_id",
        from_format='sql',
        to_format='xpath'
    )
except ValueError as e:
    print(f"STRICT mode error: {e}")

# FLEXIBLE mode - find alternatives (default)
converter_flex = UniversalQueryConverter(ConversionMode.FLEXIBLE)
xpath = converter_flex.convert(
    "SELECT * FROM users JOIN orders ON users.id = orders.user_id",
    from_format='sql',
    to_format='xpath'
)
print(xpath)
# Output: //users/user[id = //orders/order/user_id] (alternative representation)

# LENIENT mode - skip incompatible with warnings
converter_lenient = UniversalQueryConverter(ConversionMode.LENIENT)
xpath = converter_lenient.convert(
    "SELECT * FROM users JOIN orders ON users.id = orders.user_id",
    from_format='sql',
    to_format='xpath'
)
print(xpath)
# Output: //users/user /* Skipped: JOIN not supported in XPath */
```

### With Intermediate Representation

```python
from exonware.xwquery import UniversalQueryConverter

converter = UniversalQueryConverter()

# Get intermediate QueryAction tree
xpath, actions = converter.convert_with_intermediate(
    query="SELECT name, age FROM users WHERE active = true",
    from_format='sql',
    to_format='xpath',
    return_actions=True
)

print("XPath:", xpath)
print("Actions:", actions)
# Actions: [
#   QueryAction(operation='FROM', params={'table': 'users'}),
#   QueryAction(operation='WHERE', params={'active': True}),
#   QueryAction(operation='SELECT', params={'columns': ['name', 'age']})
# ]
```

### Batch Conversion

```python
from exonware.xwquery import UniversalQueryConverter

converter = UniversalQueryConverter()

queries = [
    "SELECT * FROM users",
    "SELECT name FROM products WHERE price < 100",
    "SELECT COUNT(*) FROM orders"
]

# Convert all at once
xpaths = converter.convert_many(
    queries=queries,
    from_format='sql',
    to_format='xpath'
)

for sql, xpath in zip(queries, xpaths):
    print(f"SQL:   {sql}")
    print(f"XPath: {xpath}")
    print()
```

---

## Supported Formats (Current + Planned)

### ✅ Fully Operational (Days 1-20)

1. **SQL** - Standard SQL:2016
2. **XPath** - XPath 1.0, 2.0, 3.0

### 🟡 Planned (Days 21-100)

**SQL Family (5):**
- PartiQL (AWS)
- N1QL (Couchbase)
- HiveQL (Hadoop)
- HQL (Hibernate)
- KQL (Azure)

**Graph (4):**
- Cypher (Neo4j)
- Gremlin (TinkerPop)
- SPARQL (RDF)
- GQL (ISO standard)

**Document (3):**
- XQuery
- JMESPath (AWS)
- jq (JSON processor)

**Schema (3):**
- GraphQL
- JSONiq
- XML Query

**Time-Series (4):**
- PromQL (Prometheus)
- LogQL (Loki)
- Flux (InfluxDB)
- EQL (Elastic)

**Streaming (3):**
- Datalog
- Pig (Hadoop)
- LINQ (.NET)

**NoSQL (4):**
- MQL (MongoDB)
- CQL (Cassandra)
- Elastic DSL
- JSON Query

**Specialized (3):**
- XWQuery (native)
- XWNode Executor
- XWQueryScript

---

## API Reference

### UniversalQueryConverter Class

```python
class UniversalQueryConverter:
    """Universal query language converter."""
    
    def __init__(self, conversion_mode=ConversionMode.FLEXIBLE):
        """
        Initialize converter.
        
        Args:
            conversion_mode: STRICT, FLEXIBLE, or LENIENT
        """
        pass
    
    def convert(self, query, from_format, to_format, **options):
        """
        Convert query between formats.
        
        Args:
            query: Query string in source format
            from_format: Source format name
            to_format: Target format name
            **options: Conversion options
        
        Returns:
            Query string in target format
        """
        pass
    
    def convert_with_intermediate(self, query, from_format, to_format, return_actions=False):
        """
        Convert with optional intermediate QueryAction tree.
        
        Returns:
            Tuple of (target_query, actions) if return_actions=True
        """
        pass
    
    def get_supported_formats(self):
        """Get list of supported formats."""
        pass
    
    def can_convert(self, from_format, to_format):
        """Check if conversion is supported."""
        pass
    
    def validate_query(self, query, format_name):
        """Validate query in specific format."""
        pass
```

### Convenience Functions

```python
def sql_to_xpath(sql_query, mode=ConversionMode.FLEXIBLE):
    """Convert SQL to XPath."""
    pass

def xpath_to_sql(xpath_expr, mode=ConversionMode.FLEXIBLE):
    """Convert XPath to SQL."""
    pass

def convert_query(query, from_format, to_format, mode=ConversionMode.FLEXIBLE):
    """Convert between any two formats."""
    pass
```

---

## Advanced Usage

### Direct Parser/Generator Usage

```python
from exonware.xwquery.parsers.sql_parser import parse_sql
from exonware.xwquery.generators.sql_generator import generate_sql

# Parse SQL to actions
query = "SELECT * FROM users WHERE age > 18"
actions = parse_sql(query)

print("QueryAction tree:", actions)
# [QueryAction(...), QueryAction(...), ...]

# Generate SQL from actions
sql = generate_sql(actions, pretty=True)
print("Generated SQL:")
print(sql)
```

### Performance Monitoring

```python
from exonware.xwquery.parsers.sql_parser import SQLParser
from exonware.xwquery.generators.sql_generator import SQLGenerator

# Create parser
parser = SQLParser()

# Parse multiple queries
for query in queries:
    actions = parser.parse_with_validation(query)

# Get performance stats
stats = parser.get_performance_stats()
print(f"Parsed {stats['parse_count']} queries")
print(f"Average time: {stats['average_time']*1000:.2f}ms")
print(f"Error rate: {stats['error_rate']*100:.1f}%")
```

### Error Handling

```python
from exonware.xwquery import sql_to_xpath
from exonware.xwquery.errors import XWQueryParseError, XWQueryValueError

try:
    xpath = sql_to_xpath("INVALID SQL QUERY")
except XWQueryParseError as e:
    print(f"Parse error: {e}")
    # Shows: position, line, column, context

try:
    xpath = sql_to_xpath(None)
except XWQueryValueError as e:
    print(f"Value error: {e}")
    # Shows: clear explanation of what went wrong
```

---

## Conversion Examples

### Simple Queries

| SQL | XPath |
|-----|-------|
| `SELECT * FROM users` | `//users/user` |
| `SELECT name FROM users` | `//users/user/name` |
| `SELECT * FROM users WHERE age > 18` | `//users/user[age > 18]` |

### With Filters

| SQL | XPath |
|-----|-------|
| `WHERE age = 25` | `[age = 25]` |
| `WHERE age > 18` | `[age > 18]` |
| `WHERE name = 'Alice'` | `[name = 'Alice']` |
| `WHERE active = true` | `[active = true()]` |
| `WHERE price < 100 AND in_stock = true` | `[price < 100 and in_stock = true()]` |

### Multiple Columns

| SQL | XPath |
|-----|-------|
| `SELECT name, age FROM users` | `//users/user/(name \| age)` |
| `SELECT title, author FROM books` | `//books/book/(title \| author)` |

### Incompatible Features

| SQL | XPath (FLEXIBLE mode) | Notes |
|-----|----------------------|-------|
| `SELECT * FROM a JOIN b` | `//a[id = //b/a_id]` | JOIN → predicate correlation |
| `GROUP BY category` | `/* GROUP BY not in XPath */` | Skipped with comment |
| `ORDER BY price DESC` | `//items/item` | ORDER lost in LENIENT mode |

---

## Performance Guidelines

### Parsing

- Simple queries: <1ms
- Complex queries: <10ms
- Very large queries: <100ms

### Generation

- Simple actions: <1ms
- Complex actions: <10ms
- Very large actions: <50ms

### Conversion

- Same-format: <1ms (no-op)
- Different formats: 10-30ms
- Round-trip: 20-50ms

---

## Security

### SQL Injection Prevention ✅

All dangerous patterns are blocked:

```python
from exonware.xwquery import sql_to_xpath

# These all raise XWQuerySecurityError
dangerous = [
    "'; DROP TABLE users; --",
    "' OR '1'='1",
    "'; DELETE FROM users WHERE '1'='1"
]

for query in dangerous:
    try:
        xpath = sql_to_xpath(query)
    except Exception as e:
        print(f"Blocked: {e}")
```

### DoS Prevention ✅

Limits enforced:
- Max query length: 1MB
- Max tokens: 10,000
- Max nesting depth: 100

---

## Testing

### Run All Tests

```bash
# Run all strategy tests
pytest tests/strategies/ -v

# Run SQL tests only
pytest tests/strategies/test_sql_strategy.py -v

# Run XPath tests only
pytest tests/strategies/test_xpath_strategy.py -v

# Run security tests
pytest tests/strategies/ -m xwquery_security -v

# Run performance benchmarks
pytest tests/strategies/ -m xwquery_performance --benchmark-only
```

### Test Categories

Each format has 30+ tests:
- ✅ Parsing tests
- ✅ Generation tests
- ✅ Round-trip tests
- ✅ Security tests
- ✅ Performance tests
- ✅ Edge case tests
- ✅ Unicode tests
- ✅ Conversion mode tests

---

## Troubleshooting

### Import Errors

```python
# If you get import errors, check installation
try:
    from exonware.xwquery import UniversalQueryConverter
    print("✅ XWQuery installed correctly")
except ImportError as e:
    print(f"❌ Installation issue: {e}")
    print("Run: pip install exonware-xwquery")
```

### Parse Errors

```python
# Parse errors show exactly what went wrong
from exonware.xwquery import sql_to_xpath

try:
    xpath = sql_to_xpath("SLECT * FROM users")  # Typo: SLECT
except Exception as e:
    print(e)
    # Shows: "SQL Tokenization Error: Unexpected token..."
    #        Location, context, expected vs got
```

### Conversion Errors

```python
# Incompatible features show clear messages
from exonware.xwquery import UniversalQueryConverter, ConversionMode

converter = UniversalQueryConverter(ConversionMode.STRICT)

try:
    # JOINs not supported in XPath
    xpath = converter.convert(
        "SELECT * FROM users JOIN orders",
        'sql', 'xpath'
    )
except Exception as e:
    print(e)
    # Shows: "STRICT MODE: Action 'JOIN' not supported in XPath"
    #        Suggestion: "Use FLEXIBLE mode for alternatives"
```

---

## What's Next

### Phase 3.3 (Days 21-80)

Implementing 29 remaining formats:

1. **SQL Family** (Days 21-28)
   - PartiQL, N1QL, HiveQL, HQL, KQL

2. **Graph** (Days 29-36)
   - Cypher, Gremlin, SPARQL, GQL

3. **Document** (Days 37-44)
   - XQuery, JMESPath, jq

4. **And more...** (Days 45-80)

### Phase 3.4-3.6 (Days 81-100)

- XWQueryScript integration
- Universal testing
- Complete documentation

---

## Resources

**Documentation:**
- Phase 3.0 Infrastructure Complete
- Phase 3.1 SQL Complete
- Phase 3 Progress Report (Days 1-20)
- Phase 3 Master Checklist

**Code:**
- `src/exonware/xwquery/parsers/` - All parsers
- `src/exonware/xwquery/generators/` - All generators
- `src/exonware/xwquery/universal_converter.py` - Main converter
- `tests/strategies/` - 900+ comprehensive tests

**Guidelines:**
- GUIDELINES_DEV.md - Development standards
- GUIDELINES_TEST.md - Testing standards

---

## Support

**Company:** eXonware.com  
**Author:** Eng. Muhammad AlShehri  
**Email:** connect@exonware.com

---

*This guide covers Days 1-20 implementation. More formats and features coming in Days 21-100!*


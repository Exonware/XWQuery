# XWQuery Quick Reference - v0.0.1.5

**Company:** eXonware.com  
**Updated:** October 26, 2025

---

## Quick Import Guide

### Basic Usage
```python
from exonware.xwquery import XWQuery

result = XWQuery.execute("SELECT * FROM users WHERE age > 25", data)
```

### Enhanced Usage
```python
from exonware.xwquery import (
    # Main classes
    XWQuery, XWQueryFacade,
    
    # Convenience functions
    execute, quick_select, quick_filter, quick_aggregate,
    
    # Query builders
    build_select, build_insert, build_update, build_delete,
    
    # Tools
    explain, benchmark,
    
    # Configuration
    get_config, set_config, XWQueryConfig,
    
    # Monitoring
    get_metrics, reset_metrics,
    
    # Types
    QueryMode, FormatType, OperationType,
    
    # Errors
    XWQueryError, XWQueryParseError, XWQueryExecutionError
)
```

---

## Quick Examples

### Execute Query
```python
from exonware.xwquery import XWQuery

data = {'users': [{'name': 'Alice', 'age': 30}, {'name': 'Bob', 'age': 25}]}
result = XWQuery.execute("SELECT * FROM users WHERE age > 25", data)
print(result.data)
```

### Quick Filter
```python
from exonware.xwquery import quick_select

result = quick_select(data, "age > 25", ["name", "email"])
```

### Quick Aggregate
```python
from exonware.xwquery import quick_aggregate

avg_age = quick_aggregate(data, "AVG", "age", group_by="department")
```

### Build Query
```python
from exonware.xwquery import build_select

query = build_select('users', ['name', 'age'], 'age > 25', order_by='name', limit=10)
# "SELECT name, age FROM users WHERE age > 25 ORDER BY name LIMIT 10"
```

### Convert Formats
```python
from exonware.xwquery import XWQuery

sql = "SELECT * FROM users WHERE age > 25"
graphql = XWQuery.convert(sql, from_format='sql', to_format='graphql')
```

### Benchmark Performance
```python
from exonware.xwquery import benchmark

stats = benchmark("SELECT * FROM users WHERE age > 25", data, iterations=100)
print(f"Average: {stats['avg_time_ms']}ms")
```

### Configure
```python
from exonware.xwquery import get_config, set_config, XWQueryConfig

# Get current config
config = get_config()

# Customize
custom = XWQueryConfig(
    max_query_depth=100,
    query_timeout_seconds=60.0,
    enable_optimization=True
)
set_config(custom)
```

### Get Metrics
```python
from exonware.xwquery import XWQuery, get_metrics

XWQuery.execute(query, data)
metrics = get_metrics()
print(f"Operations: {metrics.operation_count}")
```

---

## Available Enums

### QueryMode
- `IMMEDIATE` - Execute immediately
- `LAZY` - Lazy evaluation
- `STREAMING` - Stream results
- `BATCH` - Batch processing
- `PARALLEL` - Parallel execution
- `AUTO` - Automatic selection

### FormatType
- `XWQUERY`, `SQL`, `GRAPHQL`, `CYPHER`, `SPARQL`, `GREMLIN`
- `MONGODB`, `CQL`, `N1QL`, `ELASTICSEARCH`
- `PROMQL`, `FLUX`, `LOGQL`, `KQL`
- `JMESPATH`, `JQ`, `JSONIQ`, `XPATH`, `XQUERY`
- `DATALOG`, `LINQ`, `PARTIQL`, `HIVEQL`, `PIG`
- ... and more (29 total)

### OperationType
- `CORE` - SELECT, INSERT, UPDATE, DELETE
- `FILTERING` - WHERE, FILTER, LIKE, IN
- `AGGREGATION` - SUM, AVG, COUNT, MIN, MAX
- `GRAPH` - MATCH, PATH, TRAVERSE
- `PROJECTION` - PROJECT, EXTEND
- ... and more

---

## Convenience Functions Reference

### Query Execution
| Function | Purpose | Example |
|----------|---------|---------|
| `execute(query, data)` | Execute query | `execute("SELECT *", data)` |
| `quick_select(data, filter, fields)` | Quick SELECT | `quick_select(data, "x>1", ["name"])` |
| `quick_filter(data, condition)` | Quick filter | `quick_filter(data, "active=true")` |
| `quick_aggregate(data, func, field)` | Quick aggregation | `quick_aggregate(data, "AVG", "age")` |

### Query Building
| Function | Purpose | Example |
|----------|---------|---------|
| `build_select(table, fields, where)` | Build SELECT | `build_select("users", ["name"], "age>25")` |
| `build_insert(table, values)` | Build INSERT | `build_insert("users", {"name": "Alice"})` |
| `build_update(table, values, where)` | Build UPDATE | `build_update("users", {"age": 31}, "id=1")` |
| `build_delete(table, where)` | Build DELETE | `build_delete("users", "id=1")` |

### Analysis & Tools
| Function | Purpose | Example |
|----------|---------|---------|
| `explain(query)` | Explain query | `explain("SELECT * FROM users")` |
| `benchmark(query, data, n)` | Benchmark | `benchmark(query, data, 100)` |
| `parse(query, format)` | Parse query | `parse("SELECT *", "sql")` |
| `convert(query, from, to)` | Convert format | `convert(sql, "sql", "graphql")` |
| `validate(query, format)` | Validate syntax | `validate("SELECT *")` |

### Configuration
| Function | Purpose | Example |
|----------|---------|---------|
| `get_config()` | Get config | `config = get_config()` |
| `set_config(config)` | Set config | `set_config(custom_config)` |
| `reset_config()` | Reset config | `reset_config()` |

### Monitoring
| Function | Purpose | Example |
|----------|---------|---------|
| `get_metrics()` | Get metrics | `metrics = get_metrics()` |
| `reset_metrics()` | Reset metrics | `reset_metrics()` |

---

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `max_query_depth` | int | 50 | Maximum query nesting depth |
| `query_timeout_seconds` | float | 30.0 | Query execution timeout |
| `enable_query_caching` | bool | True | Enable query result caching |
| `query_cache_size` | int | 1024 | Query cache size |
| `max_tokens` | int | 10000 | Maximum parser tokens |
| `enable_optimization` | bool | True | Enable query optimization |
| `enable_parallel_execution` | bool | False | Enable parallel execution |
| `max_workers` | int | 4 | Max parallel workers |
| `max_result_size` | int | 1000000 | Maximum result size |
| `enable_sql_injection_protection` | bool | True | SQL injection protection |
| `enable_metrics` | bool | True | Enable metrics tracking |
| `log_slow_queries` | bool | True | Log slow queries |
| `slow_query_threshold_ms` | float | 1000.0 | Slow query threshold |

---

## Common Patterns

### Pattern 1: Configure Once, Use Everywhere
```python
from exonware.xwquery import set_config, XWQueryConfig, XWQuery

# Configure at app startup
set_config(XWQueryConfig(
    query_timeout_seconds=60.0,
    enable_optimization=True,
    log_slow_queries=True
))

# Use throughout app
result1 = XWQuery.execute(query1, data1)
result2 = XWQuery.execute(query2, data2)
# All queries use same configuration
```

### Pattern 2: Error Handling with Rich Context
```python
from exonware.xwquery import XWQuery, XWQueryError

try:
    result = XWQuery.execute(user_query, user_data)
except XWQueryError as e:
    logger.error(f"Query failed: {e.message}")
    logger.debug(f"Context: {e.context}")
    logger.info(f"Suggestions: {e.suggestions}")
    # Rich error information for debugging
```

### Pattern 3: Performance Monitoring
```python
from exonware.xwquery import XWQuery, get_metrics, reset_metrics

# Reset at start
reset_metrics()

# Execute queries
for query in queries:
    XWQuery.execute(query, data)

# Get stats
metrics = get_metrics()
print(f"Total: {metrics.operation_count}")
print(f"Average latency: {metrics.average_latency}ms")
```

### Pattern 4: Query Building Pipeline
```python
from exonware.xwquery import build_select, XWQuery

# Build complex query programmatically
def get_active_users(min_age, max_results):
    query = build_select(
        table='users',
        fields=['id', 'name', 'email'],
        where=f'status = "active" AND age >= {min_age}',
        order_by='name',
        limit=max_results
    )
    return XWQuery.execute(query, users_data)

active_users = get_active_users(min_age=18, max_results=100)
```

---

## Tips & Tricks

1. **Use quick_* functions** for simple operations
2. **Use build_* functions** for programmatic query construction
3. **Configure once** at application startup
4. **Monitor with metrics** in production
5. **Benchmark** critical queries during development
6. **Handle XWQueryError** for rich error information

---

## Version Compatibility

- **v0.0.1.4 and earlier** - All features work
- **v0.0.1.5** - All features work + new enhancements
- **Upgrade path** - No code changes needed, new features optional

---

*For detailed architecture information, see ARCHITECTURE.md*


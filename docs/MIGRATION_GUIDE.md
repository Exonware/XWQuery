# Migration Guide - xwquery v0.0.1.5

**Company:** eXonware.com  
**Author:** Eng. Muhammad AlShehri  
**Email:** connect@exonware.com  
**Date:** October 26, 2025

---

## Overview

This guide helps you migrate to xwquery v0.0.1.5 which includes architectural improvements aligned with xwnode. **Good news: No breaking changes!** All existing code continues to work.

---

## What Changed

### Architecture Improvements
- Root-level files for shared components (config, defs, contracts, base, facade, errors)
- Common utilities directory
- Enhanced public API with convenience methods
- Centralized configuration management
- Rich error messages with suggestions

### New Features
- Configuration system with environment variables
- Convenience methods: `quick_select()`, `quick_filter()`, `quick_aggregate()`
- Query builders: `build_select()`, `build_insert()`, `build_update()`
- Performance tools: `explain()`, `benchmark()`
- Metrics integration: `get_metrics()`, `reset_metrics()`

---

## Do You Need to Migrate?

**NO!** Existing code works without changes.

**Optional:** Adopt new features for enhanced functionality.

---

## Backward Compatibility

### All Existing Imports Work ✓

```python
# Your existing code - STILL WORKS
from exonware.xwquery import XWQuery
from exonware.xwquery import execute, parse, convert, validate
from exonware.xwquery import ExecutionEngine
from exonware.xwquery import Action, ExecutionContext, ExecutionResult

# All work exactly as before!
result = XWQuery.execute("SELECT * FROM users", data)
```

### All Existing Functions Work ✓

```python
# Your existing code - STILL WORKS
data = {'users': [{'name': 'Alice', 'age': 30}]}

# Execute query
result = XWQuery.execute("SELECT * FROM users WHERE age > 25", data)

# Parse query
parsed = XWQuery.parse("SELECT * FROM users")

# Convert format
graphql = XWQuery.convert("SELECT * FROM users", from_format='sql', to_format='graphql')

# Validate query
valid = XWQuery.validate("SELECT * FROM users")
```

---

## Optional Enhancements

### 1. Use Configuration (NEW)

**Before:**
```python
# Configuration was hardcoded
```

**After:**
```python
from exonware.xwquery import get_config, set_config, XWQueryConfig

# Get configuration
config = get_config()
print(f"Max query depth: {config.max_query_depth}")
print(f"Query timeout: {config.query_timeout_seconds}s")

# Customize configuration
custom_config = XWQueryConfig(
    max_query_depth=100,
    query_timeout_seconds=60.0,
    enable_query_caching=True,
    enable_optimization=True
)
set_config(custom_config)
```

### 2. Use Convenience Methods (NEW)

**Before:**
```python
from exonware.xwquery import XWQuery

# Manual query construction
result = XWQuery.execute(f"SELECT * FROM data WHERE {condition}", data)
```

**After:**
```python
from exonware.xwquery import quick_select, quick_filter

# Cleaner API
result = quick_select(data, filter_expr="age > 25", fields=["name", "email"])

# Or just filter
result = quick_filter(data, "status = 'active'")
```

### 3. Use Query Builders (NEW)

**Before:**
```python
# String concatenation
query = f"SELECT {', '.join(fields)} FROM {table} WHERE {condition} ORDER BY {order}"
```

**After:**
```python
from exonware.xwquery import build_select

# Builder pattern
query = build_select(
    table='users',
    fields=['name', 'email'],
    where='age > 25',
    order_by='name',
    limit=10
)
# Result: "SELECT name, email FROM users WHERE age > 25 ORDER BY name LIMIT 10"
```

### 4. Use Performance Tools (NEW)

```python
from exonware.xwquery import explain, benchmark

# Explain query execution plan
plan = explain("SELECT * FROM users WHERE age > 25")
print(plan)

# Benchmark query performance
results = benchmark("SELECT * FROM users WHERE age > 25", data, iterations=100)
print(f"Average time: {results['avg_time_ms']}ms")
print(f"Min time: {results['min_time_ms']}ms")
print(f"Max time: {results['max_time_ms']}ms")
```

### 5. Use Metrics (NEW)

```python
from exonware.xwquery import XWQuery, get_metrics, reset_metrics

# Execute queries
XWQuery.execute(query1, data)
XWQuery.execute(query2, data)

# Get metrics
metrics = get_metrics()
print(f"Total operations: {metrics.operation_count}")
print(f"Average latency: {metrics.average_latency}ms")

# Reset metrics
reset_metrics()
```

### 6. Use Rich Errors (NEW)

**Before:**
```python
try:
    result = XWQuery.execute(query, data)
except Exception as e:
    print(f"Error: {str(e)}")
```

**After:**
```python
from exonware.xwquery import XWQuery, XWQueryError

try:
    result = XWQuery.execute(query, data)
except XWQueryError as e:
    print(f"Error: {e.message}")
    print(f"Code: {e.error_code}")
    print(f"Context: {e.context}")
    print(f"Suggestions: {e.suggestions}")
    
    # Errors provide actionable suggestions!
```

---

## Configuration via Environment Variables

Set environment variables to configure xwquery:

```bash
# Query execution
export XWQUERY_MAX_QUERY_DEPTH=100
export XWQUERY_QUERY_TIMEOUT_SECONDS=60.0
export XWQUERY_ENABLE_QUERY_CACHING=true

# Performance
export XWQUERY_ENABLE_OPTIMIZATION=true
export XWQUERY_ENABLE_PARALLEL_EXECUTION=false
export XWQUERY_MAX_WORKERS=4

# Security
export XWQUERY_MAX_RESULT_SIZE=10000000
export XWQUERY_ENABLE_SQL_INJECTION_PROTECTION=true

# Monitoring
export XWQUERY_ENABLE_METRICS=true
export XWQUERY_LOG_SLOW_QUERIES=true
export XWQUERY_SLOW_QUERY_THRESHOLD_MS=1000.0
```

---

## New Error Types

### XWQueryError (Base)
All xwquery errors inherit from this

### Specific Errors
- `XWQueryValueError` - Invalid values
- `XWQueryTypeError` - Type mismatches
- `XWQueryParseError` - Parsing failures
- `XWQueryExecutionError` - Execution failures
- `XWQueryTimeoutError` - Timeouts
- `XWQuerySecurityError` - Security violations
- `XWQueryLimitError` - Resource limits exceeded
- `XWQueryFormatError` - Format conversion errors
- `UnsupportedOperationError` - Unsupported operations
- `UnsupportedFormatError` - Unsupported formats

---

## New Enums and Types

```python
from exonware.xwquery import (
    QueryMode,           # IMMEDIATE, LAZY, STREAMING, BATCH, PARALLEL, AUTO
    QueryOptimization,   # NONE, BASIC, AGGRESSIVE, ADAPTIVE
    ParserMode,          # STRICT, TOLERANT, PERMISSIVE
    FormatType,          # XWQUERY, SQL, GRAPHQL, CYPHER, SPARQL, ... (35+ formats)
    OperationType,       # CORE, FILTERING, AGGREGATION, GRAPH, etc.
    ExecutionStatus,     # PENDING, VALIDATING, EXECUTING, COMPLETED, FAILED
    OperationCapability, # REQUIRES_LINEAR, REQUIRES_TREE, REQUIRES_GRAPH, etc.
)
```

---

## Quick Start with New Features

### Example 1: Using Configuration
```python
from exonware.xwquery import XWQuery, get_config

# Get config
config = get_config()
print(f"Timeout: {config.query_timeout_seconds}s")

# Execute query
result = XWQuery.execute("SELECT * FROM users", data)
```

### Example 2: Using Convenience Methods
```python
from exonware.xwquery import quick_select, quick_aggregate

# Quick filter and select
users = quick_select(data, "age > 25", ["name", "email"])

# Quick aggregation
avg_age = quick_aggregate(data, "AVG", "age", group_by="department")
```

### Example 3: Using Query Builders
```python
from exonware.xwquery import build_select, XWQuery

# Build query
query = build_select(
    table='users',
    fields=['name', 'email'],
    where='status = "active" AND age > 25',
    order_by='name',
    limit=100
)

# Execute built query
result = XWQuery.execute(query, data)
```

### Example 4: Performance Analysis
```python
from exonware.xwquery import explain, benchmark

# Explain query
plan = explain("SELECT * FROM users WHERE age > 25")
print(f"Estimated cost: {plan['estimated_cost']}")

# Benchmark query
stats = benchmark("SELECT * FROM users WHERE age > 25", data, iterations=100)
print(f"Average: {stats['avg_time_ms']}ms")
```

---

## Troubleshooting

### Import Errors

**If you see:** `ImportError: cannot import name 'X'`

**Solution:** Make sure you have the latest version:
```bash
pip install --upgrade exonware-xwquery
```

### Configuration Errors

**If you see:** `XWQueryValueError: query_cache_size must be positive`

**Solution:** Check your configuration values are valid
```python
from exonware.xwquery import XWQueryConfig

config = XWQueryConfig()
config.validate()  # Raises error if invalid
```

---

## Support

If you encounter issues:
1. Check this migration guide
2. Review ARCHITECTURE.md for structure details
3. See REFACTORING_SUCCESS_SUMMARY.md for changes
4. Contact: connect@exonware.com

---

## Summary

- ✓ **No code changes required** for existing users
- ✓ **All existing functionality preserved**
- ✓ **New features available optionally**
- ✓ **Better error messages automatically**
- ✓ **Configuration available if needed**
- ✓ **Performance tools if desired**

**Recommendation:** Continue using xwquery as before. Explore new features when you need them.

---

*Built with ❤️ by eXonware.com - Making universal querying effortless*


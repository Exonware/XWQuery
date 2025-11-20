# Query Optimization in xwquery

**Version:** 0.0.1.5  
**Date:** October 27, 2025  
**Status:** Complete

## Overview

xwquery now includes a comprehensive query optimization system that improves query performance through:

1. **Query Planning** - Convert queries to logical and physical execution plans
2. **Cost Estimation** - Estimate query costs to choose best execution strategy
3. **Statistics Management** - Collect and maintain table/column statistics
4. **Optimization Rules** - Apply transformations to improve query performance
5. **Query Caching** - Cache frequently-used query results

## Quick Start

### Basic Usage

```python
from exonware.xwquery import (
    XWQuery,
    QueryPlanner,
    SimpleCostModel,
    InMemoryStatisticsManager,
    QueryOptimizer,
    OptimizationLevel
)

# Create optimization components
stats_manager = InMemoryStatisticsManager()
cost_model = SimpleCostModel(stats_manager)
planner = QueryPlanner(cost_model, stats_manager)
optimizer = QueryOptimizer(cost_model, stats_manager, OptimizationLevel.STANDARD)

# Provide statistics for your data
stats_manager.set_table_statistics('users', row_count=10000)
stats_manager.set_column_statistics('users', 'age', cardinality=50)
stats_manager.register_index('users', 'age')

# Execute query with optimization
query = "SELECT * FROM users WHERE age > 25"
result = XWQuery.execute(query, data)
```

### Query Planning

```python
from exonware.xwquery import QueryPlanner, SimpleCostModel

# Create planner
planner = QueryPlanner(cost_model, stats_manager)

# Parse query to action tree
action_tree = XWQuery.parse("SELECT * FROM users WHERE age > 25")

# Create logical plan
logical_plan = await planner.create_logical_plan(action_tree)
print(f"Logical plan cost: {logical_plan.get_estimated_cost()}")
print(f"Estimated rows: {logical_plan.get_estimated_rows()}")

# Create physical plan
physical_plan = await planner.create_physical_plan(logical_plan)
print(f"Physical plan cost: {physical_plan.get_estimated_cost()}")

# Inspect plan structure
print(physical_plan.to_dict())
```

### Query Optimization

```python
from exonware.xwquery import QueryOptimizer, OptimizationLevel

# Create optimizer with different levels
optimizer_basic = QueryOptimizer(
    cost_model,
    stats_manager,
    OptimizationLevel.BASIC
)

optimizer_aggressive = QueryOptimizer(
    cost_model,
    stats_manager,
    OptimizationLevel.AGGRESSIVE
)

# Optimize a plan
logical_plan = await planner.create_logical_plan(action_tree)
optimized_plan = await optimizer_aggressive.optimize(logical_plan)

print(f"Original cost: {logical_plan.get_estimated_cost()}")
print(f"Optimized cost: {optimized_plan.get_estimated_cost()}")
```

### Query Caching

```python
from exonware.xwquery import QueryCache, get_global_cache

# Use global cache
cache = get_global_cache()

# Or create custom cache
custom_cache = QueryCache(
    max_size=1000,          # Max 1000 entries
    max_memory_mb=100.0,    # Max 100MB
    ttl_seconds=3600        # 1 hour TTL
)

# Manual caching
query = "SELECT * FROM users WHERE age > 25"
params = {'age_threshold': 25}

# Check cache
cached_result = cache.get(query, params)
if cached_result:
    return cached_result

# Execute query
result = XWQuery.execute(query, data)

# Cache result
cache.put(query, result, params)

# Invalidate cache when data changes
cache.invalidate_by_table('users')

# Get cache statistics
stats = cache.get_stats()
print(f"Hit rate: {stats['hit_rate']:.1%}")
print(f"Memory usage: {stats['memory_mb']:.1f} MB")
```

## Optimization Levels

xwquery supports four optimization levels:

### NONE
- No optimization applied
- Queries execute as parsed
- Use for debugging or when optimization causes issues

```python
from exonware.xwquery import OptimizationLevel

optimizer = QueryOptimizer(optimization_level=OptimizationLevel.NONE)
```

### BASIC
- Basic rule-based optimization
- Predicate pushdown
- Projection pushdown
- No cost-based decisions

```python
optimizer = QueryOptimizer(optimization_level=OptimizationLevel.BASIC)
```

### STANDARD (Default)
- Cost-based optimization
- Index selection
- Join algorithm selection
- All BASIC rules plus cost-based decisions

```python
optimizer = QueryOptimizer(optimization_level=OptimizationLevel.STANDARD)
```

### AGGRESSIVE
- Advanced optimization techniques
- More aggressive transformations
- May take longer to optimize
- Best for complex queries

```python
optimizer = QueryOptimizer(optimization_level=OptimizationLevel.AGGRESSIVE)
```

## Optimization Rules

### Predicate Pushdown

Moves filter conditions closer to data sources to reduce data volume early.

**Before:**
```
FILTER (age > 25)
  └─ SCAN (users)
```

**After:**
```
SCAN (users, filter: age > 25)
```

### Projection Pushdown

Selects only required columns early to reduce data size.

**Before:**
```
PROJECT (name, email)
  └─ SCAN (users) [all columns]
```

**After:**
```
SCAN (users, columns: [name, email])
```

### Index Selection

Replaces sequential scans with index scans when appropriate.

**Before:**
```
SEQUENTIAL_SCAN (users)
  FILTER (age > 25)
```

**After:**
```
INDEX_SCAN (users, index: age_idx)
  FILTER (age > 25)
```

### Join Reordering

Reorders joins to minimize intermediate result sizes.

**Before:**
```
JOIN (large_table, huge_table)
  └─ JOIN result with small_table
```

**After:**
```
JOIN (small_table, large_table)
  └─ JOIN result with huge_table
```

## Statistics Management

### Collecting Statistics

```python
from exonware.xwquery import InMemoryStatisticsManager

stats_manager = InMemoryStatisticsManager()

# Set table statistics
stats_manager.set_table_statistics(
    table='users',
    row_count=10000,
    avg_row_size=100
)

# Set column statistics
stats_manager.set_column_statistics(
    table='users',
    column='age',
    cardinality=50,           # 50 distinct values
    null_fraction=0.05,       # 5% nulls
    min_value=18,
    max_value=65
)

# Register indexes
stats_manager.register_index('users', 'age')
stats_manager.register_index('users', 'email')

# Check for indexes
has_index = await stats_manager.has_index('users', 'age')
```

### Selectivity Estimation

```python
# Get selectivity estimate for a predicate
selectivity = await stats_manager.estimate_selectivity(
    table='users',
    predicate=age_predicate
)

print(f"Estimated {selectivity:.1%} of rows match predicate")
```

## Cost Model

### Estimating Costs

```python
from exonware.xwquery import SimpleCostModel

cost_model = SimpleCostModel(stats_manager, page_size=8192)

# Estimate scan cost
scan_cost = await cost_model.estimate_scan_cost(
    table='users',
    scan_type='sequential',
    selectivity=1.0
)

# Estimate join cost
join_cost = await cost_model.estimate_join_cost(
    left_rows=10000,
    right_rows=5000,
    join_type='hash',
    selectivity=0.1
)

# Estimate sort cost
sort_cost = await cost_model.estimate_sort_cost(
    rows=10000,
    columns=2
)

# Choose best join algorithm
best_algorithm = cost_model.choose_join_algorithm(
    left_rows=10000,
    right_rows=5000,
    has_index=True
)
```

## Integration with Storage Backends

When xwstorage is available, the optimizer can use persistent statistics and indexes:

```python
from exonware.xwquery import XWQuery
from exonware.xwstorage import EmbeddedBackend

# Create storage backend
storage = EmbeddedBackend('mydb.db')

# Execute query with storage backend
result = XWQuery.execute(
    "SELECT * FROM users WHERE age > 25",
    data,
    storage_backend=storage  # Future feature
)
```

## Performance Tips

### 1. Provide Statistics

Always provide statistics for better optimization decisions:

```python
# Collect statistics for all tables
for table in ['users', 'orders', 'products']:
    await stats_manager.collect_statistics(table)
```

### 2. Register Indexes

Tell the optimizer about available indexes:

```python
stats_manager.register_index('users', 'email')
stats_manager.register_index('orders', 'user_id')
stats_manager.register_index('orders', 'order_date')
```

### 3. Use Query Cache

Enable caching for frequently-executed queries:

```python
from exonware.xwquery import set_global_cache, QueryCache

# Create and set global cache
cache = QueryCache(max_size=1000, max_memory_mb=200.0)
set_global_cache(cache)
```

### 4. Choose Optimization Level

Use appropriate optimization level:
- **Development:** BASIC (fast optimization)
- **Production:** STANDARD (balanced)
- **Complex queries:** AGGRESSIVE (thorough optimization)

### 5. Monitor Performance

Track optimization effectiveness:

```python
# Get cache statistics
cache_stats = cache.get_stats()
print(f"Cache hit rate: {cache_stats['hit_rate']:.1%}")

# Get query metrics
from exonware.xwquery import get_metrics
metrics = get_metrics()
print(f"Average execution time: {metrics.average_execution_time}ms")
```

## Examples

### Example 1: Simple Query with Optimization

```python
from exonware.xwquery import (
    XWQuery,
    QueryPlanner,
    SimpleCostModel,
    InMemoryStatisticsManager,
    QueryOptimizer,
    OptimizationLevel
)

# Setup
stats = InMemoryStatisticsManager()
stats.set_table_statistics('users', row_count=10000)
stats.set_column_statistics('users', 'age', cardinality=50)

cost_model = SimpleCostModel(stats)
planner = QueryPlanner(cost_model, stats)
optimizer = QueryOptimizer(cost_model, stats)

# Parse and optimize
query = "SELECT name, email FROM users WHERE age > 25"
action_tree = XWQuery.parse(query)

logical_plan = await planner.create_logical_plan(action_tree)
optimized_plan = await optimizer.optimize(logical_plan)
physical_plan = await planner.create_physical_plan(optimized_plan)

# Execute
result = XWQuery.execute(query, data)
```

### Example 2: Complex Join with Optimization

```python
# Provide statistics for multiple tables
stats.set_table_statistics('users', row_count=10000)
stats.set_table_statistics('orders', row_count=50000)
stats.register_index('orders', 'user_id')

# Complex join query
query = """
    SELECT u.name, COUNT(o.id) as order_count
    FROM users u
    JOIN orders o ON u.id = o.user_id
    WHERE u.age > 25
    GROUP BY u.name
"""

# Optimizer will:
# 1. Push down age filter to users scan
# 2. Select index on orders.user_id
# 3. Choose hash join algorithm
# 4. Group by after join

result = XWQuery.execute(query, data)
```

### Example 3: Caching Expensive Queries

```python
from exonware.xwquery import QueryCache

cache = QueryCache(max_size=100, ttl_seconds=3600)

# Expensive aggregation query
query = """
    SELECT 
        category,
        AVG(price) as avg_price,
        COUNT(*) as product_count
    FROM products
    GROUP BY category
"""

# Check cache first
cached = cache.get(query)
if cached:
    return cached

# Execute and cache
result = XWQuery.execute(query, data)
cache.put(query, result)

# Next execution hits cache
result = cache.get(query)  # Instant!
```

## Future Enhancements

Planned improvements to query optimization:

1. **Adaptive Query Execution** - Runtime plan adjustments
2. **Parallel Execution** - Multi-threaded query processing
3. **Materialized Views** - Pre-computed results
4. **Query Hints** - User-specified optimization directives
5. **Cost Model Calibration** - Learn from actual execution times
6. **Advanced Join Algorithms** - Radix join, grace hash join
7. **Columnar Execution** - Vectorized operations
8. **Just-in-Time Compilation** - Compile hot queries

## See Also

- [xwquery README](../README.md) - Main documentation
- [xwstorage Architecture](../../xwstorage/docs/DATABASE_SUPPORT_PLAN.md) - Storage layer details
- [Performance Guide](./PERFORMANCE.md) - Performance tuning tips

---

*Built with ❤️ by eXonware.com*


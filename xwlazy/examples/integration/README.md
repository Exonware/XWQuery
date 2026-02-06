# xwlazy Integration Examples

This directory contains examples demonstrating xwlazy integration with other xw libraries.

## Examples

### 1. xwnode Integration (`xwnode_integration.py`)

Demonstrates lazy loading of graph operations and auto-installation of graph libraries.

**Features:**
- Graph structure creation
- Lazy loading of visualization libraries
- Performance comparison
- Auto-installation on demand

**Usage:**
```bash
python xwnode_integration.py
```

### 2. xwdata Integration (`xwdata_integration.py`)

Demonstrates lazy loading of format converters and optional data processing libraries.

**Features:**
- Format conversion (JSON, YAML, CSV)
- Multi-source merging
- Async operations
- On-demand dependency installation

**Usage:**
```bash
python xwdata_integration.py
```

### 3. xwquery Integration (`xwquery_integration.py`)

Demonstrates lazy loading of query language parsers and format converters.

**Features:**
- SQL-like queries
- GraphQL queries
- Cypher queries
- Query optimization
- Format converter lazy loading

**Usage:**
```bash
python xwquery_integration.py
```

### 4. Cross-Library Demo (`cross_library_demo.py`)

Complete application using xwlazy with multiple xw libraries.

**Features:**
- Multiple package configuration
- Security policies (allow lists)
- Production deployment patterns
- Per-package isolation
- Statistics and monitoring

**Usage:**
```bash
python cross_library_demo.py
```

## Configuration Patterns

### Smart Mode (On-Demand Installation)
```python
config_package_lazy_install_enabled("xwsystem", enabled=True, mode="smart")
```

### Lite Mode (Lazy Loading Only)
```python
config_package_lazy_install_enabled("xwnode", enabled=True, mode="lite")
```

### Warn Mode (Monitoring Only)
```python
config_package_lazy_install_enabled("xwquery", enabled=True, mode="warn")
```

### With Allow List
```python
config_package_lazy_install_enabled("xwdata", enabled=True, mode="smart")
set_package_allow_list("xwdata", ["PyYAML", "pandas"])
```

## Benefits

1. **Reduced Installation Size**: Only install what you need
2. **Faster Startup**: Lazy loading reduces initial load time
3. **Security Control**: Allow/deny lists for production
4. **Flexibility**: Different modes for different environments
5. **Monitoring**: Track what gets installed

## Production Deployment

For production deployments:

1. **Development**: Use `smart` mode for convenience
2. **Staging**: Use `lite` mode with pre-installed dependencies
3. **Production**: Use `warn` mode with allow lists

## License

MIT License - see LICENSE file in parent directory.

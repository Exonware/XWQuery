# xwlazy Integration Guide

**Company:** eXonware.com  
**Author:** Eng. Muhammad AlShehri  
**Email:** connect@exonware.com  
**Version:** 1.0.0

## Overview

This guide explains how to integrate xwlazy with other xw libraries and use it in production environments.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Integration with xw Libraries](#integration-with-xw-libraries)
3. [Configuration Patterns](#configuration-patterns)
4. [Production Deployment](#production-deployment)
5. [Security Policies](#security-policies)
6. [Troubleshooting](#troubleshooting)

## Quick Start

### Basic Integration

```python
from xwlazy.lazy import config_package_lazy_install_enabled

# Enable lazy loading for your package
config_package_lazy_install_enabled("your-package", enabled=True, mode="smart")
```

### Keyword-Based Detection

Add to your `pyproject.toml`:

```toml
[project]
keywords = ["xwlazy-enabled"]
```

After `pip install -e .`, xwlazy automatically enables lazy loading.

## Integration with xw Libraries

### xwsystem Integration

```python
from xwlazy.lazy import config_package_lazy_install_enabled

# Configure xwsystem for smart mode
config_package_lazy_install_enabled("xwsystem", enabled=True, mode="smart")

# Now use xwsystem - dependencies auto-install
from exonware.xwsystem import AvroSerializer, ProtobufSerializer
# fastavro and protobuf will be auto-installed if needed
```

### xwnode Integration

```python
# Configure for lazy loading only (no auto-install)
config_package_lazy_install_enabled("xwnode", enabled=True, mode="lite")

# Graph operations use lazy loading
from exonware.xwnode import Node, Graph
# Dependencies must be pre-installed in lite mode
```

### xwdata Integration

```python
# Configure with allow list for security
config_package_lazy_install_enabled("xwdata", enabled=True, mode="smart")
set_package_allow_list("xwdata", ["PyYAML", "pandas", "openpyxl"])

# Format converters auto-install from allow list
from exonware.xwdata import DataEngine
```

### xwquery Integration

```python
# Configure for monitoring only
config_package_lazy_install_enabled("xwquery", enabled=True, mode="warn")

# Queries logged but dependencies not auto-installed
from exonware.xwquery import QueryEngine
```

## Configuration Patterns

### Development Environment

```python
# Auto-install everything for convenience
config_package_lazy_install_enabled("xwsystem", enabled=True, mode="smart")
config_package_lazy_install_enabled("xwdata", enabled=True, mode="smart")
```

### Staging Environment

```python
# Lazy load only, dependencies pre-installed
config_package_lazy_install_enabled("xwsystem", enabled=True, mode="lite")
config_package_lazy_install_enabled("xwdata", enabled=True, mode="lite")
```

### Production Environment

```python
# Controlled auto-install with allow lists
config_package_lazy_install_enabled("xwsystem", enabled=True, mode="smart")
set_package_allow_list("xwsystem", ["fastavro", "protobuf", "msgpack"])

# Monitor only for sensitive packages
config_package_lazy_install_enabled("xwquery", enabled=True, mode="warn")
```

## Production Deployment

### Docker Deployment

```dockerfile
FROM python:3.12-slim

# Install base packages
RUN pip install exonware-xwlazy exonware-xwsystem

# Configure xwlazy
ENV XWLAZY_MODE=smart
ENV XWLAZY_ALLOW_LIST=fastavro,protobuf,msgpack

# Your application
COPY . /app
WORKDIR /app
CMD ["python", "app.py"]
```

### Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: xwlazy-app
spec:
  template:
    spec:
      containers:
      - name: app
        image: xwlazy-app:latest
        env:
        - name: XWLAZY_MODE
          value: "smart"
        - name: XWLAZY_ALLOW_LIST
          value: "fastavro,protobuf,msgpack"
```

### Environment Variables

```bash
# Global lazy mode
export XWLAZY_MODE=smart

# Package-specific configuration
export XWSYSTEM_LAZY_MODE=smart
export XWDATA_LAZY_MODE=lite
export XWQUERY_LAZY_MODE=warn

# Allow list
export XWLAZY_ALLOW_LIST=fastavro,protobuf,msgpack
```

## Security Policies

### Allow List

```python
from xwlazy.lazy import set_package_allow_list

# Only allow specific packages
set_package_allow_list("xwsystem", ["fastavro", "protobuf"])
```

### Deny List

```python
from xwlazy.lazy import set_package_deny_list

# Block specific packages
set_package_deny_list("xwsystem", ["suspicious-package"])
```

### Lockfile Management

```python
from xwlazy.lazy import set_package_lockfile

# Track installed packages
set_package_lockfile("xwsystem", "xwsystem-lock.json")
```

### SBOM Generation

```python
from xwlazy.lazy import generate_package_sbom

# Generate Software Bill of Materials
sbom = generate_package_sbom("xwsystem", "xwsystem-sbom.json")
```

## Troubleshooting

### Import Errors

**Problem:** Packages not auto-installing

**Solution:**
```python
# Check if lazy loading is enabled
from xwlazy.lazy import get_lazy_install_stats
stats = get_lazy_install_stats("xwsystem")
print(stats)
```

### Security Policy Issues

**Problem:** Package blocked by allow list

**Solution:**
```python
# Add to allow list
set_package_allow_list("xwsystem", ["new-package"])
```

### Performance Issues

**Problem:** Slow first import

**Solution:**
- Use `full` mode to pre-install all dependencies
- Use `lite` mode with pre-installed dependencies
- Enable caching for faster subsequent imports

## Best Practices

1. **Use appropriate modes** for each environment
2. **Configure allow lists** in production
3. **Monitor installations** with statistics
4. **Generate SBOMs** for compliance
5. **Use lockfiles** to track dependencies
6. **Test in staging** before production

## Examples

See `examples/integration/` for complete integration examples.

## Support

For issues or questions:
- **Email:** connect@exonware.com
- **Documentation:** [Complete Documentation](../README.md)
- **Examples:** [Integration Examples](../examples/integration/)

---

**Last Updated:** January 2025

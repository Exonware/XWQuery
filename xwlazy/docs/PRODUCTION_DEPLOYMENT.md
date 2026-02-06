# xwlazy Production Deployment Guide

**Company:** eXonware.com  
**Author:** Eng. Muhammad AlShehri  
**Email:** connect@exonware.com  
**Version:** 1.0.0

## Overview

This guide provides comprehensive instructions for deploying xwlazy in production environments, including CI/CD integration, Docker containerization, security hardening, and monitoring.

## Table of Contents

1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [CI/CD Integration](#cicd-integration)
3. [Docker Containerization](#docker-containerization)
4. [Security Hardening](#security-hardening)
5. [Monitoring and Observability](#monitoring-and-observability)
6. [Performance Optimization](#performance-optimization)

## Pre-Deployment Checklist

### Environment Setup

- [ ] Python 3.12+ installed
- [ ] Virtual environment configured
- [ ] xwlazy installed (`pip install exonware-xwlazy`)
- [ ] Environment variables configured
- [ ] Security policies defined
- [ ] Monitoring configured

### Security Checklist

- [ ] Allow lists configured
- [ ] Deny lists configured (if needed)
- [ ] Lockfile management enabled
- [ ] SBOM generation configured
- [ ] Vulnerability scanning enabled
- [ ] PEP 668 compliance verified

### Performance Checklist

- [ ] Appropriate mode selected
- [ ] Caching enabled
- [ ] Statistics collection enabled
- [ ] Performance monitoring configured

## CI/CD Integration

### GitHub Actions

```yaml
name: CI/CD with xwlazy

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.12'
      
      - name: Install dependencies
        run: |
          pip install exonware-xwlazy
          pip install -e .
      
      - name: Configure xwlazy
        run: |
          python -c "
          from xwlazy.lazy import config_package_lazy_install_enabled
          config_package_lazy_install_enabled('your-package', enabled=True, mode='smart')
          "
      
      - name: Run tests
        run: pytest
      
      - name: Generate SBOM
        run: |
          python -c "
          from xwlazy.lazy import generate_package_sbom
          generate_package_sbom('your-package', 'sbom.json')
          "
```

### GitLab CI

```yaml
stages:
  - test
  - deploy

test:
  stage: test
  image: python:3.12
  script:
    - pip install exonware-xwlazy
    - pip install -e .
    - python -c "from xwlazy.lazy import config_package_lazy_install_enabled; config_package_lazy_install_enabled('your-package', enabled=True, mode='smart')"
    - pytest
  artifacts:
    paths:
      - sbom.json
```

### Jenkins Pipeline

```groovy
pipeline {
    agent any
    
    stages {
        stage('Setup') {
            steps {
                sh 'pip install exonware-xwlazy'
                sh 'pip install -e .'
            }
        }
        
        stage('Configure') {
            steps {
                sh '''
                    python -c "
                    from xwlazy.lazy import config_package_lazy_install_enabled
                    config_package_lazy_install_enabled('your-package', enabled=True, mode='smart')
                    "
                '''
            }
        }
        
        stage('Test') {
            steps {
                sh 'pytest'
            }
        }
    }
}
```

## Docker Containerization

### Basic Dockerfile

```dockerfile
FROM python:3.12-slim

WORKDIR /app

# Install xwlazy
RUN pip install --no-cache-dir exonware-xwlazy

# Copy application
COPY . .

# Install application
RUN pip install -e .

# Configure xwlazy via environment variables
ENV XWLAZY_MODE=smart
ENV XWLAZY_ALLOW_LIST=fastavro,protobuf,msgpack

# Run application
CMD ["python", "app.py"]
```

### Multi-Stage Dockerfile

```dockerfile
# Build stage
FROM python:3.12-slim as builder

WORKDIR /app

# Install build dependencies
RUN pip install --no-cache-dir exonware-xwlazy

# Copy and install application
COPY . .
RUN pip install -e .

# Production stage
FROM python:3.12-slim

WORKDIR /app

# Copy only runtime dependencies
COPY --from=builder /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=builder /app /app

# Configure xwlazy
ENV XWLAZY_MODE=lite
ENV XWLAZY_ALLOW_LIST=fastavro,protobuf,msgpack

# Run application
CMD ["python", "app.py"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  app:
    build: .
    environment:
      - XWLAZY_MODE=smart
      - XWLAZY_ALLOW_LIST=fastavro,protobuf,msgpack
      - XWLAZY_LOCKFILE=/app/lockfile.json
    volumes:
      - ./lockfile.json:/app/lockfile.json
    ports:
      - "8000:8000"
```

## Security Hardening

### Allow List Configuration

```python
from xwlazy.lazy import (
    config_package_lazy_install_enabled,
    set_package_allow_list,
)

# Enable lazy loading with allow list
config_package_lazy_install_enabled("xwsystem", enabled=True, mode="smart")
set_package_allow_list("xwsystem", [
    "fastavro",
    "protobuf",
    "msgpack",
    "PyYAML",
])
```

### Deny List Configuration

```python
from xwlazy.lazy import set_package_deny_list

# Block specific packages
set_package_deny_list("xwsystem", [
    "suspicious-package",
    "untrusted-package",
])
```

### Lockfile Management

```python
from xwlazy.lazy import set_package_lockfile

# Track all installed packages
set_package_lockfile("xwsystem", "/secure/lockfile.json")
```

### SBOM Generation

```python
from xwlazy.lazy import generate_package_sbom

# Generate Software Bill of Materials
sbom = generate_package_sbom(
    "xwsystem",
    "/secure/sbom.json",
    include_vulnerabilities=True
)
```

### Vulnerability Scanning

```python
# Enable vulnerability scanning
from xwlazy.lazy import set_vulnerability_scanning

set_vulnerability_scanning("xwsystem", enabled=True)
```

## Monitoring and Observability

### Statistics Collection

```python
from xwlazy.lazy import get_lazy_install_stats

# Get installation statistics
stats = get_lazy_install_stats("xwsystem")
print(f"Installed: {stats.get('total_installed', 0)}")
print(f"Failed: {stats.get('failed_count', 0)}")
print(f"Mode: {stats.get('mode', 'unknown')}")
```

### Logging Configuration

```python
import logging

# Configure logging for xwlazy
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

# xwlazy will log installation events
```

### Metrics Export

```python
# Export metrics to monitoring system
from xwlazy.lazy import get_lazy_install_stats

stats = get_lazy_install_stats("xwsystem")

# Export to Prometheus, Datadog, etc.
metrics = {
    "xwlazy_installed_total": stats.get("total_installed", 0),
    "xwlazy_failed_total": stats.get("failed_count", 0),
}
```

## Performance Optimization

### Caching Configuration

```python
# Enable aggressive caching
from xwlazy.lazy import set_cache_config

set_cache_config(
    max_size=1000,
    ttl=3600,  # 1 hour
)
```

### Mode Selection

```python
# Use appropriate mode for environment
# Development: smart
# Staging: lite
# Production: warn or lite with pre-installed deps

config_package_lazy_install_enabled(
    "xwsystem",
    enabled=True,
    mode="lite"  # Lazy load only, no auto-install
)
```

### Pre-Installation Strategy

```python
# Pre-install common dependencies
# Dockerfile or requirements.txt
RUN pip install fastavro protobuf msgpack PyYAML

# Then use lite mode
config_package_lazy_install_enabled("xwsystem", enabled=True, mode="lite")
```

## Environment Variables

### Global Configuration

```bash
# Global lazy mode
export XWLAZY_MODE=smart

# Global allow list
export XWLAZY_ALLOW_LIST=fastavro,protobuf,msgpack

# Lockfile path
export XWLAZY_LOCKFILE=/app/lockfile.json
```

### Package-Specific Configuration

```bash
# xwsystem configuration
export XWSYSTEM_LAZY_MODE=smart
export XWSYSTEM_LAZY_ALLOW_LIST=fastavro,protobuf

# xwdata configuration
export XWDATA_LAZY_MODE=lite
export XWDATA_LAZY_ALLOW_LIST=PyYAML,pandas
```

## Kubernetes Deployment

### Deployment YAML

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: xwlazy-app
spec:
  replicas: 3
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
        - name: XWLAZY_LOCKFILE
          value: "/app/lockfile.json"
        volumeMounts:
        - name: lockfile
          mountPath: /app/lockfile.json
      volumes:
      - name: lockfile
        configMap:
          name: xwlazy-lockfile
```

### ConfigMap for Lockfile

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: xwlazy-lockfile
data:
  lockfile.json: |
    {
      "packages": {
        "fastavro": "1.0.0",
        "protobuf": "4.0.0"
      }
    }
```

## Best Practices

1. **Use allow lists in production** - Control what gets installed
2. **Enable lockfile tracking** - Track all installations
3. **Generate SBOMs regularly** - For compliance and security
4. **Monitor statistics** - Track installation patterns
5. **Use appropriate modes** - Match mode to environment
6. **Pre-install common deps** - Reduce runtime installation
7. **Enable vulnerability scanning** - Security best practice
8. **Test in staging first** - Validate before production

## Troubleshooting

See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for common issues and solutions.

## Support

For production support:
- **Email:** connect@exonware.com
- **Documentation:** [Complete Documentation](../README.md)
- **Examples:** [Integration Examples](../examples/integration/)

---

**Last Updated:** January 2025

# xwlazy Best Practices

**Company:** eXonware.com  
**Author:** Eng. Muhammad AlShehri  
**Email:** connect@exonware.com  
**Version:** 1.0.0

## Overview

This guide provides best practices for using xwlazy in different scenarios and environments.

## Table of Contents

1. [When to Use Lazy Loading](#when-to-use-lazy-loading)
2. [Mode Selection Guidelines](#mode-selection-guidelines)
3. [Security Policy Recommendations](#security-policy-recommendations)
4. [Performance Tuning Tips](#performance-tuning-tips)
5. [Environment-Specific Practices](#environment-specific-practices)

## When to Use Lazy Loading

### Use Lazy Loading When:

✅ **Optional Dependencies**: Features that users may never need  
✅ **Large Dependencies**: Packages that significantly increase installation size  
✅ **Development Tools**: Tools only needed during development  
✅ **Platform-Specific**: Dependencies that vary by platform  
✅ **Experimental Features**: Features still in development  

### Avoid Lazy Loading When:

❌ **Core Dependencies**: Essential functionality required by all users  
❌ **Small Dependencies**: Packages with minimal installation size  
❌ **Frequently Used**: Dependencies used in hot paths  
❌ **Security-Critical**: Dependencies required for security features  

## Mode Selection Guidelines

### Smart Mode (Recommended for Development)

```python
config_package_lazy_install_enabled("package", enabled=True, mode="smart")
```

**Use when:**
- Development environment
- Prototyping
- Testing new features
- Quick iteration

**Benefits:**
- Automatic dependency installation
- Zero configuration
- Fast development cycle

### Lite Mode (Recommended for Staging)

```python
config_package_lazy_install_enabled("package", enabled=True, mode="lite")
```

**Use when:**
- Staging environment
- Pre-installed dependencies
- Controlled deployment
- Testing production-like setup

**Benefits:**
- Lazy loading performance
- No auto-installation overhead
- Predictable behavior

### Warn Mode (Recommended for Production)

```python
config_package_lazy_install_enabled("package", enabled=True, mode="warn")
```

**Use when:**
- Production environment
- Security-sensitive deployments
- Compliance requirements
- Monitoring dependencies

**Benefits:**
- Security control
- Audit trail
- No unexpected installations

### Full Mode (Recommended for CI/CD)

```python
config_package_lazy_install_enabled("package", enabled=True, mode="full")
```

**Use when:**
- CI/CD pipelines
- Docker builds
- Pre-warming caches
- Batch installations

**Benefits:**
- Fast subsequent runs
- Predictable environment
- No runtime installation delays

## Security Policy Recommendations

### Allow Lists

Always use allow lists in production:

```python
set_package_allow_list("xwsystem", ["fastavro", "protobuf", "msgpack"])
```

**Best Practices:**
- Whitelist only required packages
- Review allow list regularly
- Document why each package is allowed
- Version pinning for critical packages

### Deny Lists

Use deny lists to block known problematic packages:

```python
set_package_deny_list("xwsystem", ["suspicious-package", "deprecated-package"])
```

**Best Practices:**
- Block packages with known vulnerabilities
- Block deprecated packages
- Block packages conflicting with your stack
- Regular updates to deny list

### Lockfile Management

Track all installed packages:

```python
set_package_lockfile("xwsystem", "xwsystem-lock.json")
```

**Best Practices:**
- Commit lockfiles to version control
- Review lockfiles in code reviews
- Update lockfiles regularly
- Use lockfiles for reproducibility

### SBOM Generation

Generate Software Bill of Materials for compliance:

```python
generate_package_sbom("xwsystem", "xwsystem-sbom.json")
```

**Best Practices:**
- Generate SBOMs for all packages
- Store SBOMs securely
- Update SBOMs on dependency changes
- Use SBOMs for vulnerability scanning

## Performance Tuning Tips

### Cache Configuration

Enable aggressive caching for faster imports:

```python
# Cache is enabled by default
# Monitor cache hit rates
stats = get_lazy_install_stats("xwsystem")
print(f"Cache hits: {stats.get('cache_hits', 0)}")
```

### Pre-installation

Pre-install frequently used dependencies:

```python
# Use full mode to pre-install
config_package_lazy_install_enabled("xwsystem", enabled=True, mode="full")
```

### Background Loading

Use background loading for non-critical dependencies:

```python
from xwlazy.lazy import LazyLoadMode, LazyModeConfig

config = LazyModeConfig(
    load_mode=LazyLoadMode.BACKGROUND,
    install_mode=LazyInstallMode.SMART,
    background_workers=4
)
config_package_lazy_install_enabled("xwsystem", enabled=True, mode_config=config)
```

### Size-Aware Installation

Skip large packages automatically:

```python
config_package_lazy_install_enabled("xwsystem", enabled=True, mode="size_aware")
```

## Environment-Specific Practices

### Development

```python
# Auto-install everything for convenience
config_package_lazy_install_enabled("xwsystem", enabled=True, mode="smart")
config_package_lazy_install_enabled("xwdata", enabled=True, mode="smart")
```

### Staging

```python
# Lazy load with pre-installed dependencies
config_package_lazy_install_enabled("xwsystem", enabled=True, mode="lite")
config_package_lazy_install_enabled("xwdata", enabled=True, mode="lite")
```

### Production

```python
# Controlled auto-install with security policies
config_package_lazy_install_enabled("xwsystem", enabled=True, mode="smart")
set_package_allow_list("xwsystem", ["fastavro", "protobuf"])

# Monitor only for sensitive packages
config_package_lazy_install_enabled("xwquery", enabled=True, mode="warn")
```

### CI/CD

```python
# Pre-install all dependencies
config_package_lazy_install_enabled("xwsystem", enabled=True, mode="full")
config_package_lazy_install_enabled("xwdata", enabled=True, mode="full")
```

## Common Patterns

### Per-Package Isolation

```python
# Different modes for different packages
config_package_lazy_install_enabled("xwsystem", enabled=True, mode="smart")
config_package_lazy_install_enabled("xwnode", enabled=True, mode="lite")
config_package_lazy_install_enabled("xwquery", enabled=True, mode="warn")
```

### Conditional Configuration

```python
import os

mode = "smart" if os.getenv("ENV") == "development" else "warn"
config_package_lazy_install_enabled("xwsystem", enabled=True, mode=mode)
```

### Statistics Monitoring

```python
from xwlazy.lazy import get_lazy_install_stats

# Monitor installation statistics
stats = get_lazy_install_stats("xwsystem")
print(f"Installed: {stats.get('total_installed', 0)}")
print(f"Failed: {stats.get('failed_count', 0)}")
```

## Anti-Patterns to Avoid

❌ **Don't use smart mode in production without allow lists**  
❌ **Don't disable lazy loading for optional dependencies**  
❌ **Don't ignore security policies**  
❌ **Don't skip lockfile management**  
❌ **Don't use full mode for large dependency sets**  

## Summary

1. **Choose the right mode** for your environment
2. **Use security policies** in production
3. **Monitor performance** and adjust accordingly
4. **Follow environment-specific** practices
5. **Avoid anti-patterns** that reduce security or performance

---

**Last Updated:** January 2025

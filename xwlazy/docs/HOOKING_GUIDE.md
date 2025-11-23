# xwlazy Hooking & Extension Guide

**Company:** eXonware.com  
**Author:** Eng. Muhammad AlShehri  
**Email:** connect@exonware.com  
**Version:** 0.1.0.18  
**Generation Date:** 15-Nov-2025

## 🎯 AI-Friendly Document

**This document is designed for both human developers and AI assistants.**  
Provides comprehensive guide on how to hook and extend xwlazy functionality through strategies and hooks.

**Related Documents:**
- [REF_ARCH.md](REF_ARCH.md) - System architecture and design patterns
- [docs/guides/GUIDE_DOCS.md](guides/GUIDE_DOCS.md) - Documentation standards

---

## 🎯 Overview

xwlazy provides multiple extension points through the **Strategy Pattern** and **Hook System**. This guide shows you how to customize and extend xwlazy behavior.

**Why this guide exists:** xwlazy uses the Strategy Pattern to allow complete customization of installation behavior. Understanding how to create and use custom strategies enables developers to adapt xwlazy to their specific needs, whether that's custom execution methods, timing strategies, or security policies.

## Table of Contents

1. [Strategy Pattern Extensions](#strategy-pattern-extensions)
2. [Import Hook System](#import-hook-system)
3. [Custom Strategy Examples](#custom-strategy-examples)
4. [Runtime Strategy Swapping](#runtime-strategy-swapping)
5. [Configuration Hooks](#configuration-hooks)

---

## Strategy Pattern Extensions

xwlazy uses **5 strategy types** that you can customize:

### 1. Execution Strategy (`IInstallExecutionStrategy`)
**Purpose:** HOW to execute installation (pip, wheel, cached, async, custom)

**Interface:**
```python
from exonware.xwlazy.contracts import IInstallExecutionStrategy
from exonware.xwlazy.package.services.install_result import InstallResult

class IInstallExecutionStrategy(Protocol):
    def execute_install(self, package_name: str, policy_args: List[str]) -> Any:
        """Execute installation of a package."""
        ...
    
    def execute_uninstall(self, package_name: str) -> bool:
        """Execute uninstallation of a package."""
        ...
```

**Example: Custom Docker Execution Strategy**
```python
from exonware.xwlazy.package.base import AInstallExecutionStrategy
from exonware.xwlazy.package.services.install_result import InstallResult, InstallStatus
import subprocess

class DockerExecution(AInstallExecutionStrategy):
    """Install packages inside a Docker container."""
    
    def __init__(self, container_name: str = "xwlazy-python"):
        self.container_name = container_name
    
    def execute_install(self, package_name: str, policy_args: List[str]) -> InstallResult:
        try:
            # Run pip install inside Docker container
            cmd = [
                "docker", "exec", self.container_name,
                "pip", "install", package_name
            ]
            result = subprocess.run(cmd, capture_output=True, text=True, check=True)
            
            return InstallResult(
                package_name=package_name,
                success=True,
                status=InstallStatus.SUCCESS,
                source="docker"
            )
        except Exception as e:
            return InstallResult(
                package_name=package_name,
                success=False,
                status=InstallStatus.FAILED,
                error=str(e)
            )
    
    def execute_uninstall(self, package_name: str) -> bool:
        try:
            cmd = ["docker", "exec", self.container_name, "pip", "uninstall", "-y", package_name]
            result = subprocess.run(cmd, capture_output=True, text=True, check=True)
            return result.returncode == 0
        except Exception:
            return False
```

### 2. Timing Strategy (`IInstallTimingStrategy`)
**Purpose:** WHEN to install packages (on-demand, upfront, temporary, etc.)

**Interface:**
```python
class IInstallTimingStrategy(Protocol):
    def should_install_now(self, package_name: str, context: Any) -> bool:
        """Determine if package should be installed now."""
        ...
    
    def should_uninstall_after(self, package_name: str, context: Any) -> bool:
        """Determine if package should be uninstalled after use."""
        ...
    
    def get_install_priority(self, packages: List[str]) -> List[str]:
        """Get priority order for installing packages."""
        ...
```

**Example: Priority-Based Timing Strategy**
```python
from exonware.xwlazy.package.base import AInstallTimingStrategy

class PriorityTiming(AInstallTimingStrategy):
    """Install packages based on priority list."""
    
    def __init__(self, priority_packages: List[str]):
        self.priority_packages = priority_packages
    
    def should_install_now(self, package_name: str, context: Any) -> bool:
        # Install immediately if in priority list
        if package_name in self.priority_packages:
            return True
        # Otherwise, install on-demand
        return context is not None
    
    def should_uninstall_after(self, package_name: str, context: Any) -> bool:
        # Never uninstall priority packages
        return package_name not in self.priority_packages
    
    def get_install_priority(self, packages: List[str]) -> List[str]:
        # Sort by priority list, then by name
        priority_set = set(self.priority_packages)
        priority = [p for p in self.priority_packages if p in packages]
        others = sorted([p for p in packages if p not in priority_set])
        return priority + others
```

### 3. Discovery Strategy (`IDiscoveryStrategy`)
**Purpose:** HOW to discover dependencies (from files, manifest, auto-detect)

**Interface:**
```python
class IDiscoveryStrategy(Protocol):
    def discover(self, project_root: Any) -> Dict[str, str]:
        """Discover dependencies from sources."""
        ...
    
    def get_source(self, import_name: str) -> Optional[str]:
        """Get the source of a discovered dependency."""
        ...
```

**Example: Custom File-Based Discovery**
```python
from exonware.xwlazy.package.base import ADiscoveryStrategy
from pathlib import Path
import json

class CustomFileDiscovery(ADiscoveryStrategy):
    """Discover dependencies from custom dependency file."""
    
    def __init__(self, package_name: str, project_root: Optional[str] = None):
        self.package_name = package_name
        self.project_root = Path(project_root) if project_root else Path.cwd()
        self._cache: Dict[str, str] = {}
    
    def discover(self, project_root: Any) -> Dict[str, str]:
        """Discover from custom deps.json file."""
        deps_file = self.project_root / "deps.json"
        if not deps_file.exists():
            return {}
        
        try:
            with open(deps_file) as f:
                deps = json.load(f)
                # Convert to import_name -> package_name mapping
                result = {}
                for import_name, package_name in deps.items():
                    result[import_name] = package_name
                self._cache.update(result)
                return result
        except Exception:
            return {}
    
    def get_source(self, import_name: str) -> Optional[str]:
        """Get source of dependency."""
        if import_name in self._cache:
            return "deps.json"
        return None
```

### 4. Policy Strategy (`IPolicyStrategy`)
**Purpose:** WHAT can be installed (security/policy - allow/deny lists)

**Interface:**
```python
class IPolicyStrategy(Protocol):
    def is_allowed(self, package_name: str) -> Tuple[bool, str]:
        """Check if package is allowed to be installed."""
        ...
    
    def get_pip_args(self, package_name: str) -> List[str]:
        """Get pip arguments based on policy."""
        ...
```

**Example: Version-Based Policy**
```python
from exonware.xwlazy.package.base import APolicyStrategy
from typing import Dict

class VersionPolicy(APolicyStrategy):
    """Only allow specific package versions."""
    
    def __init__(self, package_name: str, allowed_versions: Dict[str, str]):
        self.package_name = package_name
        self.allowed_versions = allowed_versions  # {package: version}
    
    def is_allowed(self, package_name: str) -> Tuple[bool, str]:
        if package_name in self.allowed_versions:
            return True, "OK"
        return False, f"Package '{package_name}' not in allowed versions list"
    
    def get_pip_args(self, package_name: str) -> List[str]:
        args = []
        if package_name in self.allowed_versions:
            version = self.allowed_versions[package_name]
            args.extend([package_name, "==", version])
        return args
```

### 5. Mapping Strategy (`IMappingStrategy`)
**Purpose:** HOW to map import names to package names (e.g., 'cv2' -> 'opencv-python')

**Interface:**
```python
class IMappingStrategy(Protocol):
    def map_import_to_package(self, import_name: str) -> Optional[str]:
        """Map import name to package name."""
        ...
    
    def map_package_to_imports(self, package_name: str) -> List[str]:
        """Map package name to possible import names."""
        ...
```

**Example: Custom Mapping with Aliases**
```python
from exonware.xwlazy.package.base import AMappingStrategy

class AliasMapping(AMappingStrategy):
    """Custom mapping with aliases."""
    
    def __init__(self, package_name: str, project_root: Optional[str] = None):
        self.package_name = package_name
        # Custom alias mappings
        self.aliases = {
            'cv2': 'opencv-python',
            'PIL': 'Pillow',
            'yaml': 'PyYAML',
            'sklearn': 'scikit-learn',
        }
    
    def map_import_to_package(self, import_name: str) -> Optional[str]:
        # Check aliases first
        if import_name in self.aliases:
            return self.aliases[import_name]
        # Fallback to default (import_name == package_name)
        return import_name
    
    def map_package_to_imports(self, package_name: str) -> List[str]:
        # Find all aliases that map to this package
        imports = []
        for imp, pkg in self.aliases.items():
            if pkg == package_name:
                imports.append(imp)
        # Also include package name itself
        if package_name not in imports:
            imports.append(package_name)
        return imports
```

---

## Using Custom Strategies

### Method 1: Pass Strategies to XWPackageHelper

```python
from exonware.xwlazy.package.facade import XWPackageHelper
from my_custom_strategies import DockerExecution, PriorityTiming, AliasMapping

# Create helper with custom strategies
helper = XWPackageHelper(
    package_name="myapp",
    execution_strategy=DockerExecution(container_name="my-python"),
    timing_strategy=PriorityTiming(priority_packages=["numpy", "pandas"]),
    mapping_strategy=AliasMapping(package_name="myapp"),
)

# Use the helper
helper.install("requests")
```

### Method 2: Runtime Strategy Swapping

```python
from exonware.xwlazy.package.facade import XWPackageHelper
from my_custom_strategies import DockerExecution

# Create helper with default strategies
helper = XWPackageHelper(package_name="myapp")

# Swap execution strategy at runtime
helper.swap_execution_strategy(DockerExecution())

# Swap timing strategy
from exonware.xwlazy.package.strategies import FullTiming
helper.swap_timing_strategy(FullTiming("myapp"))

# Swap policy strategy
from exonware.xwlazy.package.strategies import AllowListPolicy
helper.swap_policy_strategy(AllowListPolicy("myapp", ["requests", "numpy"]))
```

---

## Import Hook System

xwlazy provides an import hook system that intercepts `ImportError` and automatically installs missing packages.

### Installing/Uninstalling Hooks

```python
from exonware.xwlazy.facade import (
    install_import_hook,
    uninstall_import_hook,
    is_import_hook_installed,
)

# Install hook for a package
install_import_hook(package_name="myapp")

# Check if hook is installed
if is_import_hook_installed("myapp"):
    print("Hook is active")

# Uninstall hook
uninstall_import_hook(package_name="myapp")
```

### Configuration with Hooks

```python
from exonware.xwlazy.facade import config_package_lazy_install_enabled

# Configure and install hook automatically
config_package_lazy_install_enabled(
    package_name="myapp",
    enabled=True,
    mode="smart",
    install_hook=True,  # Automatically installs hook
)
```

---

## Configuration Hooks

### Environment Variables

```python
import os

# Enable async installs
os.environ["XWLAZY_ASYNC_INSTALL"] = "1"
os.environ["XWLAZY_ASYNC_WORKERS"] = "4"

# Set cache directory
os.environ["XWLAZY_ASYNC_CACHE_DIR"] = "/path/to/cache"

# Enable lazy installation for package
os.environ["MYAPP_LAZY_INSTALL"] = "1"
```

### Programmatic Configuration

```python
from exonware.xwlazy.facade import config_package_lazy_install_enabled
from exonware.xwlazy.defs import LazyInstallMode, LazyLoadMode

config_package_lazy_install_enabled(
    package_name="myapp",
    enabled=True,
    mode="smart",
    install_hook=True,
    install_mode=LazyInstallMode.SMART,
    load_mode=LazyLoadMode.ON_DEMAND,
)
```

### Configuring Custom Strategies

xwlazy allows you to configure custom strategies for both **package** and **module** operations. Strategies are stored in a registry and automatically used when helpers are created.

#### Package Strategies

Configure custom package strategies (execution, timing, discovery, policy, mapping):

```python
from exonware.xwlazy import config_package_lazy_install_enabled
from exonware.xwlazy.package.strategies import (
    WheelExecution,      # Custom execution strategy
    FullTiming,          # Custom timing strategy
    HybridDiscovery,    # Custom discovery strategy
    AllowListPolicy,     # Custom policy strategy
    ManifestFirstMapping # Custom mapping strategy
)

# Configure with custom strategies
config_package_lazy_install_enabled(
    package_name="myapp",
    enabled=True,
    mode="smart",
    install_hook=True,
    # Package strategies
    execution_strategy=WheelExecution(),
    timing_strategy=FullTiming("myapp"),
    discovery_strategy=HybridDiscovery("myapp"),
    policy_strategy=AllowListPolicy("myapp", allowed_packages=["pandas", "numpy"]),
    mapping_strategy=ManifestFirstMapping("myapp"),
)
```

#### Module Strategies

Configure custom module strategies (helper, manager, caching):

```python
from exonware.xwlazy import config_module_lazy_load_enabled
from exonware.xwlazy.module.strategies import (
    LazyHelper,      # Custom helper strategy
    AdvancedManager, # Custom manager strategy
)
from exonware.xwlazy.common.strategies import LRUCache

# Configure with custom module strategies
config_module_lazy_load_enabled(
    package_name="myapp",
    enabled=True,
    load_mode=LazyLoadMode.CACHED,
    # Module strategies
    helper_strategy=LazyHelper(),
    manager_strategy=AdvancedManager("myapp", None, None, None),
    caching_strategy=LRUCache(max_size=2000),
)
```

#### One-Liner with Custom Strategies

The simplest way to enable xwlazy with custom strategies in your package's `__init__.py`:

```python
# In your_package/__init__.py
from exonware.xwlazy import config_package_lazy_install_enabled, config_module_lazy_load_enabled
from exonware.xwlazy.package.strategies import AsyncExecution, SmartTiming
from exonware.xwlazy.module.strategies import LazyHelper

# Configure package strategies
config_package_lazy_install_enabled(
    __name__.split('.')[0],
    execution_strategy=AsyncExecution(),
    timing_strategy=SmartTiming(__name__.split('.')[0]),
    install_hook=True
)

# Configure module strategies
config_module_lazy_load_enabled(
    __name__.split('.')[0],
    helper_strategy=LazyHelper(),
)
```

#### Strategy Selection by Mode

You can also use mode strings to select built-in strategies:

```python
# Package mode: "smart", "full", "clean", "temporary", etc.
# Module mode: "auto", "cached", "turbo", etc.

from exonware.xwlazy import config_package_lazy_install_enabled, config_module_lazy_load_enabled
from exonware.xwlazy.defs import LazyLoadMode

# Package mode = "smart" (uses SmartTiming by default)
# Module mode = "cached" (uses CACHED load mode)
config_package_lazy_install_enabled(__name__.split('.')[0], mode="smart", install_hook=True)
config_module_lazy_load_enabled(__name__.split('.')[0], load_mode=LazyLoadMode.CACHED)
```

#### Custom Strategy Implementation

To use your own custom strategy, implement the interface and pass it:

```python
from exonware.xwlazy.package.base import AInstallExecutionStrategy
from exonware.xwlazy.package.services.install_result import InstallResult, InstallStatus

class MyCustomExecution(AInstallExecutionStrategy):
    def execute_install(self, package_name: str, policy_args: List[str]) -> InstallResult:
        # Your custom installation logic
        return InstallResult(package_name=package_name, success=True, status=InstallStatus.SUCCESS)
    
    def execute_uninstall(self, package_name: str) -> bool:
        # Your custom uninstallation logic
        return True

# Use it
config_package_lazy_install_enabled(
    "myapp",
    execution_strategy=MyCustomExecution(),
    install_hook=True
)
```

---

## Complete Example: Custom Strategy Suite

```python
"""
Complete example: Custom strategy suite for a specific use case.
"""

from exonware.xwlazy.package.facade import XWPackageHelper
from exonware.xwlazy.package.base import (
    AInstallExecutionStrategy,
    AInstallTimingStrategy,
    APolicyStrategy,
    AMappingStrategy,
)
from exonware.xwlazy.package.services.install_result import InstallResult, InstallStatus
from typing import List, Tuple, Optional, Dict, Any

# 1. Custom Execution: Install to virtual environment
class VenvExecution(AInstallExecutionStrategy):
    def __init__(self, venv_path: str):
        self.venv_path = venv_path
    
    def execute_install(self, package_name: str, policy_args: List[str]) -> InstallResult:
        import subprocess
        import sys
        venv_pip = f"{self.venv_path}/bin/pip" if sys.platform != "win32" else f"{self.venv_path}/Scripts/pip.exe"
        try:
            subprocess.run([venv_pip, "install", package_name] + policy_args, check=True)
            return InstallResult(package_name=package_name, success=True, status=InstallStatus.SUCCESS, source="venv")
        except Exception as e:
            return InstallResult(package_name=package_name, success=False, status=InstallStatus.FAILED, error=str(e))
    
    def execute_uninstall(self, package_name: str) -> bool:
        import subprocess
        import sys
        venv_pip = f"{self.venv_path}/bin/pip" if sys.platform != "win32" else f"{self.venv_path}/Scripts/pip.exe"
        try:
            subprocess.run([venv_pip, "uninstall", "-y", package_name], check=True)
            return True
        except Exception:
            return False

# 2. Custom Timing: Install during off-peak hours
class OffPeakTiming(AInstallTimingStrategy):
    def should_install_now(self, package_name: str, context: Any) -> bool:
        import datetime
        hour = datetime.datetime.now().hour
        # Only install between 2 AM and 6 AM
        return 2 <= hour < 6
    
    def should_uninstall_after(self, package_name: str, context: Any) -> bool:
        return False
    
    def get_install_priority(self, packages: List[str]) -> List[str]:
        return packages

# 3. Custom Policy: Only allow packages from internal PyPI
class InternalPyPIPolicy(APolicyStrategy):
    def __init__(self, package_name: str, internal_index_url: str):
        self.package_name = package_name
        self.internal_index_url = internal_index_url
    
    def is_allowed(self, package_name: str) -> Tuple[bool, str]:
        # Allow all packages, but enforce internal index
        return True, "OK"
    
    def get_pip_args(self, package_name: str) -> List[str]:
        return ["--index-url", self.internal_index_url, "--trusted-host", self.internal_index_url.split("//")[1].split("/")[0]]

# 4. Use all custom strategies
helper = XWPackageHelper(
    package_name="myapp",
    execution_strategy=VenvExecution("/path/to/venv"),
    timing_strategy=OffPeakTiming(),
    policy_strategy=InternalPyPIPolicy("myapp", "https://pypi.internal.com/simple"),
)

# Now all installations use your custom strategies!
helper.install("requests")
```

---

## Summary

xwlazy provides **5 strategy types** for complete customization:

1. **Execution Strategy** - HOW to install (pip, wheel, cached, async, custom)
2. **Timing Strategy** - WHEN to install (on-demand, upfront, temporary, custom)
3. **Discovery Strategy** - HOW to discover dependencies (files, manifest, custom)
4. **Policy Strategy** - WHAT can be installed (security, allow/deny, custom)
5. **Mapping Strategy** - HOW to map imports to packages (aliases, custom)

**Key Benefits:**
- ✅ **Composable** - Mix and match strategies
- ✅ **Swappable** - Change strategies at runtime
- ✅ **Extensible** - Create custom strategies easily
- ✅ **Testable** - Mock strategies for testing

**Next Steps:**
- Check existing strategies in `xwlazy/src/exonware/xwlazy/package/strategies/`
- Implement your custom strategy by extending base classes
- Use `XWPackageHelper` with your strategies
- Swap strategies at runtime as needed


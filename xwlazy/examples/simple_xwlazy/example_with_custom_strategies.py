"""
Example: Using Custom Strategies

This demonstrates how to configure xwlazy with custom strategies
for more control over installation and loading behavior.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
"""

import sys
from pathlib import Path

# Configure UTF-8 encoding for Windows console
if sys.platform == "win32":
    try:
        if hasattr(sys.stdout, 'reconfigure'):
            sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    except (AttributeError, OSError):
        pass  # Fallback to default encoding

# Add the examples directory to the path so we can import simple_xwlazy
examples_dir = Path(__file__).parent.parent
sys.path.insert(0, str(examples_dir))

# =============================================================================
# Example: Configure with custom strategies
# =============================================================================

from exonware.xwlazy import (
    config_package_lazy_install_enabled,
    config_module_lazy_load_enabled,
)
from exonware.xwlazy.package.strategies import AsyncExecution, SmartTiming
from exonware.xwlazy.module.strategies import LazyHelper
from exonware.xwlazy.defs import LazyLoadMode

# Configure package strategies (how packages are installed)
config_package_lazy_install_enabled(
    "simple_xwlazy",
    enabled=True,
    mode="smart",
    install_hook=True,
    # Custom execution strategy: Use async installation
    execution_strategy=AsyncExecution(),
    # Custom timing strategy: Smart on-demand installation
    timing_strategy=SmartTiming(),
)

# Configure module strategies (how modules are loaded)
config_module_lazy_load_enabled(
    "simple_xwlazy",
    enabled=True,
    load_mode=LazyLoadMode.CACHED,
    # Custom helper strategy: Lazy loading
    helper_strategy=LazyHelper(),
)

print("✅ Configured xwlazy with custom strategies!")
print("   - Package execution: Async")
print("   - Package timing: Smart")
print("   - Module loading: Cached")

# Now imports will use these custom strategies
import simple_xwlazy


"""
Simple xwlazy Example Package

This demonstrates the simplest way to hook xwlazy for automatic lazy installation
and lazy loading of modules.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
"""

# =============================================================================
# ONE-LINER: Hook xwlazy for automatic lazy installation
# =============================================================================

from exonware.xwlazy import config_package_lazy_install_enabled

# Enable lazy installation with import hook
# This will automatically install missing packages when imported
config_package_lazy_install_enabled(__name__.split('.')[0], install_hook=True)

# =============================================================================
# That's it! Now any import of missing packages will trigger automatic installation
# =============================================================================

# Example: This package can now use optional dependencies
# When someone imports this package and uses pandas, it will be auto-installed:
#
#   from simple_xwlazy import some_function
#   # Later in code:
#   import pandas  # <- pandas will be automatically installed if missing!

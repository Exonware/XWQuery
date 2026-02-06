"""
Demo App - Simple example using xwlazy v4.0 for auto-installation

This package demonstrates how xwlazy automatically installs missing
dependencies from requirements.txt when they are imported.
"""

# One-line activation using xwlazy v4.0!
from exonware.xwlazy import auto_enable_lazy
auto_enable_lazy(__package__)

__version__ = "1.0.0"

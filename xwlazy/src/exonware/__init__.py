"""
exonware package - Enterprise-grade Python framework ecosystem

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Generation Date: 2025-01-03

This is a namespace package allowing multiple exonware subpackages
to coexist (xwsystem, xwnode, xwdata, xwlazy, etc.)
"""

# Make this a namespace package - DO NOT set __path__
# This allows both exonware.xwsystem and exonware.xwlazy to coexist
__path__ = __import__('pkgutil').extend_path(__path__, __name__)

# Import version from xwlazy if available, otherwise use default
try:
    from exonware.xwlazy.version import __version__
except ImportError:
    __version__ = '0.0.1'  # Fallback for namespace package when xwlazy not installed

__author__ = 'Eng. Muhammad AlShehri'
__email__ = 'connect@exonware.com'
__company__ = 'eXonware.com'


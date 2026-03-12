#exonware/xwsyntax/src/exonware/xwsyntax/handlers/__init__.py
"""
Syntax Handlers Package
This package provides syntax handlers for different formats.
Handlers load metadata from *.grammar.info.json files.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.6.0.4
"""

from .generic import XWSyntaxHandler
__all__ = [
    'XWSyntaxHandler',
]

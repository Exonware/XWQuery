#!/usr/bin/env python3
"""
Parser Base Classes

This module now imports from root-level base.py.
Kept for backward compatibility.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.5
Generation Date: October 26, 2025
"""

from abc import ABC
from typing import Dict, Any, Union

# Import from root
from ..base import AParamExtractor
from ..errors import XWQueryParseError

# Alias for backward compatibility
ParseError = XWQueryParseError

# AParamExtractor is now imported from root base.py - no need to redefine

__all__ = ['AParamExtractor', 'ParseError']


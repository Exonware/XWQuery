#!/usr/bin/env python3
"""
Parser Base Classes
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.9.0.1
Generation Date: October 26, 2025
"""

from abc import ABC
from typing import Any
# Import from compiler base (not root to avoid circular import)
from ..base import AParamExtractor
from ...errors import XWQueryParseError
__all__ = ['AParamExtractor']

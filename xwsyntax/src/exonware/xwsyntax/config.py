#!/usr/bin/env python3
"""
#exonware/xwsyntax/src/exonware/xwsyntax/config.py
Configuration classes for xwsyntax.
Company: eXonware.com
Author: eXonware Backend Team
Email: connect@exonware.com
Version: 0.6.0.3
Generation Date: 07-Jan-2025
"""

from dataclasses import dataclass
from typing import Optional
@dataclass

class XWSyntaxConfig:
    """Configuration for XWSyntax."""
    enable_cache: bool = True
    enable_optimization: bool = True
    max_cache_size: int = 1000
    enable_binary_formats: bool = True
    enable_ide_integration: bool = False
    strict_mode: bool = False
    timeout_seconds: Optional[int] = None

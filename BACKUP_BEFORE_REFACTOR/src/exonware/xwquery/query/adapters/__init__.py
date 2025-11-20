#!/usr/bin/env python3
"""
Adapters package for xwquery

Provides adapters to integrate external systems with xwquery.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1
Generation Date: January 2, 2025
"""

from .syntax_adapter import SyntaxToQueryActionConverter, GrammarBasedSQLStrategy

__all__ = [
    "SyntaxToQueryActionConverter",
    "GrammarBasedSQLStrategy"
]

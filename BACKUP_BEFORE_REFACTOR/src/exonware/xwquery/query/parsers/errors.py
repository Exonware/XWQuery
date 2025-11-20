#!/usr/bin/env python3
"""
Parser Errors

Module-specific errors for query parsers.
Extends root error classes per DEV_GUIDELINES.md - no redundancy.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.5
Generation Date: October 26, 2025
"""

# Import and REUSE root error classes per DEV_GUIDELINES
from ..errors import XWQueryError, XWQueryParseError, XWQueryValueError


class ParserError(XWQueryError):
    """
    Base error for parser operations.
    
    Extends XWQueryError from root - follows DEV_GUIDELINES principle.
    """
    pass


# Alias for backward compatibility
ParseError = XWQueryParseError


class UnsupportedSyntaxError(ParserError):
    """Raised when syntax is not supported."""
    pass


__all__ = [
    'ParserError',
    'ParseError',
    'UnsupportedSyntaxError',
    'XWQueryParseError',
]


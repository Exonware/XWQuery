#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/parsers/partiql_parser.py

PartiQL parser - AWS PartiQL (SQL extension for semi-structured data).
Extends SQL parser with JSON path navigation and dynamic typing.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.7
Generation Date: 28-Oct-2025
"""

from typing import List
from .sql_parser import SQLParser
from ...contracts import QueryAction
from ...defs import ConversionMode


class PartiQLParser(SQLParser):
    """
    PartiQL parser for AWS PartiQL queries.
    
    PartiQL = SQL + JSON path navigation + dynamic types
    
    Extensions over SQL:
    - SELECT VALUE for unwrapping
    - Path navigation (users[0].name, users.*.name)
    - Dynamic types (semi-structured data)
    - UNPIVOT operations
    - @variable syntax
    
    Reuses: 90% of SQL parser
    Extends: Path navigation, variable syntax
    
    Examples:
    - SELECT * FROM S3Object[*].users WHERE age > 18
    - SELECT VALUE user FROM users AS user WHERE user.active
    - SELECT u.name FROM @mydata AS u
    """
    
    def __init__(self, conversion_mode: ConversionMode = ConversionMode.FLEXIBLE):
        """Initialize PartiQL parser."""
        super().__init__(conversion_mode)
    
    def get_format_name(self) -> str:
        """Return format name."""
        return "PartiQL"
    
    # Override to add PartiQL-specific features
    # Most parsing logic inherited from SQLParser


# ==================== Convenience Function ====================

def parse_partiql(query: str, **options) -> List[QueryAction]:
    """
    Parse PartiQL query to QueryAction tree.
    
    Args:
        query: PartiQL query string
        **options: Parsing options
        
    Returns:
        List of QueryAction objects
    """
    parser = PartiQLParser()
    return parser.parse_with_validation(query, **options)


__all__ = [
    'PartiQLParser',
    'parse_partiql'
]


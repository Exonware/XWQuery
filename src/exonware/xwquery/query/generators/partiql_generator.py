#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/generators/partiql_generator.py

PartiQL generator - AWS PartiQL (SQL extension for semi-structured data).
Extends SQL generator with JSON path notation.

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.7
Generation Date: 28-Oct-2025
"""

from typing import List
from .sql_generator import SQLGenerator, generate_sql
from ...contracts import QueryAction
from ...defs import ConversionMode


class PartiQLGenerator(SQLGenerator):
    """
    PartiQL generator for AWS PartiQL queries.
    
    Extends SQL generator with:
    - Path navigation syntax
    - @variable notation
    - SELECT VALUE syntax
    
    Reuses: 90% of SQL generator
    Extends: Path syntax, variable notation
    """
    
    def __init__(
        self,
        conversion_mode: ConversionMode = ConversionMode.FLEXIBLE,
        **kwargs
    ):
        """Initialize PartiQL generator."""
        super().__init__(conversion_mode, **kwargs)
    
    def get_format_name(self) -> str:
        """Return format name."""
        return "PartiQL"


# ==================== Convenience Function ====================

def generate_partiql(actions: List[QueryAction], pretty: bool = True, **options) -> str:
    """
    Generate PartiQL query from QueryAction tree.
    
    Args:
        actions: List of QueryAction objects
        pretty: Enable pretty-printing
        **options: Generation options
        
    Returns:
        PartiQL query string
    """
    generator = PartiQLGenerator(pretty_print=pretty, **options)
    return generator.generate_with_validation(actions, **options)


__all__ = [
    'PartiQLGenerator',
    'generate_partiql'
]


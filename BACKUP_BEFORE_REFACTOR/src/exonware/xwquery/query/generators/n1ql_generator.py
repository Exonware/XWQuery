#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/generators/n1ql_generator.py

N1QL generator - Couchbase N1QL (SQL for JSON).

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1
Generation Date: 28-Oct-2025
"""

from typing import List
from .sql_generator import SQLGenerator
from ..contracts import QueryAction
from ..defs import ConversionMode


class N1QLGenerator(SQLGenerator):
    """N1QL generator for Couchbase. Reuses 85% of SQL generator."""
    
    def get_format_name(self) -> str:
        return "N1QL"


def generate_n1ql(actions: List[QueryAction], pretty: bool = True, **options) -> str:
    """Generate N1QL query from QueryAction tree."""
    generator = N1QLGenerator(pretty_print=pretty, **options)
    return generator.generate_with_validation(actions, **options)


__all__ = ['N1QLGenerator', 'generate_n1ql']


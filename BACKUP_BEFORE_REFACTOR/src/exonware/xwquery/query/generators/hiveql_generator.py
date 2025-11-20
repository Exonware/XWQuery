#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/generators/hiveql_generator.py

HiveQL generator - Hadoop Hive SQL dialect.

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


class HiveQLGenerator(SQLGenerator):
    """HiveQL generator for Hadoop Hive. Reuses 80% of SQL generator."""
    
    def get_format_name(self) -> str:
        return "HiveQL"


def generate_hiveql(actions: List[QueryAction], pretty: bool = True, **options) -> str:
    """Generate HiveQL query from QueryAction tree."""
    generator = HiveQLGenerator(pretty_print=pretty, **options)
    return generator.generate_with_validation(actions, **options)


__all__ = ['HiveQLGenerator', 'generate_hiveql']


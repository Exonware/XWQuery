#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/generators/hql_generator.py

HQL generator - Hibernate Query Language (ORM-oriented).

Company: eXonware.com
Author: Eng. Muhammad AlShehri
Email: connect@exonware.com
Version: 0.0.1.7
Generation Date: 28-Oct-2025
"""

from typing import List
from .sql_generator import SQLGenerator
from ...contracts import QueryAction
from ...defs import ConversionMode


class HQLGenerator(SQLGenerator):
    """HQL generator for Hibernate ORM. Reuses 75% of SQL generator."""
    
    def get_format_name(self) -> str:
        return "HQL"


def generate_hql(actions: List[QueryAction], pretty: bool = True, **options) -> str:
    """Generate HQL query from QueryAction tree."""
    generator = HQLGenerator(pretty_print=pretty, **options)
    return generator.generate_with_validation(actions, **options)


__all__ = ['HQLGenerator', 'generate_hql']


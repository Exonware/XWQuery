#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/generators/kql_generator.py

KQL generator - Azure Kusto Query Language (log analytics).

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


class KQLGenerator(SQLGenerator):
    """KQL generator for Azure Kusto. Reuses 70% of SQL generator."""
    
    def get_format_name(self) -> str:
        return "KQL"


def generate_kql(actions: List[QueryAction], pretty: bool = True, **options) -> str:
    """Generate KQL query from QueryAction tree."""
    generator = KQLGenerator(pretty_print=pretty, **options)
    return generator.generate_with_validation(actions, **options)


__all__ = ['KQLGenerator', 'generate_kql']


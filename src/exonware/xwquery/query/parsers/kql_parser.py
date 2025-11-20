#!/usr/bin/env python3
"""
#exonware/xwquery/src/exonware/xwquery/parsers/kql_parser.py

KQL parser - Azure Kusto Query Language (log analytics).
Extends SQL parser with time-series and log-specific operators.

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


class KQLParser(SQLParser):
    """
    KQL parser for Azure Kusto queries.
    
    Extensions over SQL:
    - Pipe operator (|)
    - Time operators (ago(), now())
    - Log-specific functions
    - render operators
    
    Reuses: 70% of SQL parser
    """
    
    def get_format_name(self) -> str:
        return "KQL"


def parse_kql(query: str, **options) -> List[QueryAction]:
    """Parse KQL query to QueryAction tree."""
    parser = KQLParser()
    return parser.parse_with_validation(query, **options)


__all__ = ['KQLParser', 'parse_kql']

